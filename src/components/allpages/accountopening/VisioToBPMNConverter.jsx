import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  LinearProgress,
} from "@mui/material";
import { XMLParser } from "fast-xml-parser";
import Modeler from "bpmn-js/lib/Modeler";
import { saveAs } from "file-saver";
import JSZip from "jszip";

function isArray(x) {
  return Array.isArray(x);
}

function toArray(x) {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}

function getNumber(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

function normalizeShapes(rawShapes) {
  // VDX can give a single object or an array
  const shapes = toArray(rawShapes).map((s) => {
    const id = String(s?.["@_ID"] ?? s?.ID ?? "");
    const text = (
      typeof s?.Text === "string" ? s.Text : s?.Text?.["#text"] ?? ""
    ).trim();
    const xf = s?.XForm || {};
    const PinX = getNumber(xf?.PinX);
    const PinY = getNumber(xf?.PinY);
    const Width = getNumber(xf?.Width, 1);
    const Height = getNumber(xf?.Height, 0.6);

    // Geom might be used to detect rectangle vs line
    const geom = s?.Geom;
    const geomArr = toArray(geom);
    // If has 4-5 LineTo segments, treat as a rectangle (task). If just MoveTo/LineTo two points → likely a line/connector
    let isRect = false;
    let isLine = false;
    if (geomArr.length) {
      const first = geomArr[0];
      const moveTo = toArray(first?.MoveTo);
      const lineTo = toArray(first?.LineTo);
      if (lineTo.length >= 3) isRect = true;
      if (lineTo.length === 1 || lineTo.length === 2) isLine = true;
    } else {
      // Fallback: if it has Text, assume a box
      if (text) isRect = true;
    }

    // Some drawings embed connects inside Shape
    const connects = s?.Connects ? toArray(s.Connects.Connect) : [];
    const connectsTo = connects.map((c) =>
      String(c?.["@_ToSheet"] ?? c?.ToSheet ?? "")
    );

    return {
      raw: s,
      id,
      text,
      PinX,
      PinY,
      Width,
      Height,
      isRect,
      isLine,
      connectsTo,
    };
  });

  return shapes;
}

function extractConnectsFromPage(rawPage) {
  // In many VDX files, <Connects> sits directly under <Page>
  const pageConnects = rawPage?.Connects
    ? toArray(rawPage.Connects.Connect)
    : [];
  const edges = pageConnects
    .map((c) => {
      const from = String(c?.["@_FromSheet"] ?? c?.FromSheet ?? "");
      const to = String(c?.["@_ToSheet"] ?? c?.ToSheet ?? "");
      return from && to ? { from, to } : null;
    })
    .filter(Boolean);
  return edges;
}

function deriveEdges(shapes, pageEdges) {
  const rects = shapes.filter((s) => s.isRect);
  const idSet = new Set(rects.map((r) => r.id));
  const edges = [];

  // 1) Use explicit edges if found on page
  for (const e of pageEdges) {
    if (idSet.has(e.from) && idSet.has(e.to)) edges.push(e);
  }

  // 2) Use inline shape Connects (connector shape listing ToSheet). Try to infer "from" as the nearest rect to the connector's start
  for (const s of shapes) {
    if (s.isLine && s.connectsTo?.length) {
      // naive approach: connect to the closest rectangle above and below
      const targets = s.connectsTo.filter((t) => idSet.has(t));
      if (targets.length === 2) {
        edges.push({ from: targets[0], to: targets[1] });
      }
    }
  }

  // 3) If still no edges, infer top-down by Y position
  if (edges.length === 0 && rects.length > 1) {
    const sorted = [...rects].sort((a, b) => b.PinY - a.PinY); // Visio Y grows upwards
    for (let i = 0; i < sorted.length - 1; i++) {
      edges.push({ from: sorted[i].id, to: sorted[i + 1].id });
    }
  }

  // De-duplicate
  const keySet = new Set();
  const unique = [];
  for (const e of edges) {
    const k = `${e.from}->${e.to}`;
    if (!keySet.has(k)) {
      keySet.add(k);
      unique.push(e);
    }
  }

  return unique;
}

// Helper function to calculate connection points on the edge of rectangles/circles
function getConnectionPoints(sourceEl, targetEl) {
  const sourceCenterX = sourceEl.x + sourceEl.w / 2;
  const sourceCenterY = sourceEl.y + sourceEl.h / 2;
  const targetCenterX = targetEl.x + targetEl.w / 2;
  const targetCenterY = targetEl.y + targetEl.h / 2;

  // Calculate angle between centers
  const deltaX = targetCenterX - sourceCenterX;
  const deltaY = targetCenterY - sourceCenterY;

  // Source exit point (edge of source element)
  let sourceX, sourceY;
  if (sourceEl.isCircle) {
    // For circles (start/end events), use radius
    const radius = sourceEl.w / 2;
    const angle = Math.atan2(deltaY, deltaX);
    sourceX = sourceCenterX + Math.cos(angle) * radius;
    sourceY = sourceCenterY + Math.sin(angle) * radius;
  } else {
    // For rectangles, find intersection with rectangle edge
    const halfWidth = sourceEl.w / 2;
    const halfHeight = sourceEl.h / 2;

    if (Math.abs(deltaX) / halfWidth > Math.abs(deltaY) / halfHeight) {
      // Exit from left or right side
      sourceX = sourceCenterX + (deltaX > 0 ? halfWidth : -halfWidth);
      sourceY =
        sourceCenterY +
        (deltaY / deltaX) * (deltaX > 0 ? halfWidth : -halfWidth);
    } else {
      // Exit from top or bottom side
      sourceX =
        sourceCenterX +
        (deltaX / deltaY) * (deltaY > 0 ? halfHeight : -halfHeight);
      sourceY = sourceCenterY + (deltaY > 0 ? halfHeight : -halfHeight);
    }
  }

  // Target entry point (edge of target element)
  let targetX, targetY;
  if (targetEl.isCircle) {
    // For circles (start/end events), use radius
    const radius = targetEl.w / 2;
    const angle = Math.atan2(-deltaY, -deltaX); // Opposite direction
    targetX = targetCenterX + Math.cos(angle) * radius;
    targetY = targetCenterY + Math.sin(angle) * radius;
  } else {
    // For rectangles, find intersection with rectangle edge
    const halfWidth = targetEl.w / 2;
    const halfHeight = targetEl.h / 2;

    if (Math.abs(deltaX) / halfWidth > Math.abs(deltaY) / halfHeight) {
      // Enter from left or right side
      targetX = targetCenterX - (deltaX > 0 ? halfWidth : -halfWidth);
      targetY =
        targetCenterY -
        (deltaY / deltaX) * (deltaX > 0 ? halfWidth : -halfWidth);
    } else {
      // Enter from top or bottom side
      targetX =
        targetCenterX -
        (deltaX / deltaY) * (deltaY > 0 ? halfHeight : -halfHeight);
      targetY = targetCenterY - (deltaY > 0 ? halfHeight : -halfHeight);
    }
  }

  return {
    source: { x: Math.round(sourceX), y: Math.round(sourceY) },
    target: { x: Math.round(targetX), y: Math.round(targetY) },
  };
}

function buildBPMN(defId, processId, nodes, edges) {
  // Simple BPMN generation with DI; positions in px (scale from inches roughly)
  const scale = 100; // ~100px per 1 visio unit (inches-ish)
  const taskW = 140;
  const taskH = 70;

  // Map Visio shapes to BPMN tasks
  const tasks = nodes.map((n, idx) => ({
    id: `Task_${n.id || idx + 1}`,
    name: n.text || `Step ${idx + 1}`,
    x: Math.round(n.PinX * scale - taskW / 2),
    y: Math.round((12 - n.PinY) * scale), // invert Y a bit, rough canvas flip
    w: taskW,
    h: taskH,
    srcId: n.id,
    isCircle: false,
  }));

  // Create start & end
  // Start near the top-most task; End near the bottom-most
  const topTask = [...tasks].sort((a, b) => a.y - b.y)[0] || tasks[0];
  const bottomTask =
    [...tasks].sort((a, b) => b.y - a.y)[0] || tasks[tasks.length - 1];

  const startEvent = {
    id: "StartEvent_1",
    name: "Start",
    x: (topTask?.x ?? 50) - 60,
    y: (topTask?.y ?? 50) + Math.floor(taskH / 2) - 18,
    w: 36,
    h: 36,
    isCircle: true,
  };

  const endEvent = {
    id: "EndEvent_1",
    name: "End",
    x: (bottomTask?.x ?? 50) + taskW + 60,
    y: (bottomTask?.y ?? 50) + Math.floor(taskH / 2) - 18,
    w: 36,
    h: 36,
    isCircle: true,
  };

  // Build flows
  let flowIdx = 1;
  const flows = [];

  // Start -> first task (choose the one with no incoming)
  const srcIds = new Set(edges.map((e) => e.to));
  const first = tasks.find((t) => !srcIds.has(t.srcId)) || tasks[0];
  if (first) {
    flows.push({
      id: `Flow_${flowIdx++}`,
      from: startEvent.id,
      to: first.id,
    });
  }

  // Task -> Task
  for (const e of edges) {
    const fromTask = tasks.find((t) => t.srcId === e.from);
    const toTask = tasks.find((t) => t.srcId === e.to);
    if (fromTask && toTask) {
      flows.push({
        id: `Flow_${flowIdx++}`,
        from: fromTask.id,
        to: toTask.id,
      });
    }
  }

  // Last -> End (choose task with no outgoing)
  const outSrc = new Set(edges.map((e) => e.from));
  const last =
    tasks.find((t) => !outSrc.has(t.srcId)) || tasks[tasks.length - 1];
  if (last) {
    flows.push({
      id: `Flow_${flowIdx++}`,
      from: last.id,
      to: endEvent.id,
    });
  }

  // XML assembly
  const header = `<?xml version="1.0" encoding="UTF-8"?>`;
  const defsOpen = `<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="${defId}" targetNamespace="http://bpmn.io/schema/bpmn">`;

  const procOpen = `<bpmn:process id="${processId}" isExecutable="false">`;
  const startXml = `<bpmn:startEvent id="${startEvent.id}" name="${startEvent.name}" />`;
  const endXml = `<bpmn:endEvent id="${endEvent.id}" name="${endEvent.name}" />`;
  const tasksXml = tasks
    .map((t) => `<bpmn:task id="${t.id}" name="${escapeXml(t.name)}" />`)
    .join("\n");

  const flowsXml = flows
    .map(
      (f) =>
        `<bpmn:sequenceFlow id="${f.id}" sourceRef="${f.from}" targetRef="${f.to}" />`
    )
    .join("\n");

  const procClose = `</bpmn:process>`;

  // DI
  const diOpen = `<bpmndi:BPMNDiagram id="BpmnDiagram_1"><bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="${processId}">`;
  const diStart = `<bpmndi:BPMNShape id="${startEvent.id}_di" bpmnElement="${startEvent.id}">
    <dc:Bounds x="${startEvent.x}" y="${startEvent.y}" width="36" height="36" />
  </bpmndi:BPMNShape>`;

  const diEnd = `<bpmndi:BPMNShape id="${endEvent.id}_di" bpmnElement="${endEvent.id}">
    <dc:Bounds x="${endEvent.x}" y="${endEvent.y}" width="36" height="36" />
  </bpmndi:BPMNShape>`;

  const diTasks = tasks
    .map(
      (t) => `<bpmndi:BPMNShape id="${t.id}_di" bpmnElement="${t.id}">
    <dc:Bounds x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" />
  </bpmndi:BPMNShape>`
    )
    .join("\n");

  // Create element lookup for edge calculations
  const elById = {
    [startEvent.id]: startEvent,
    [endEvent.id]: endEvent,
  };
  for (const t of tasks) elById[t.id] = t;

  // Generate edges with proper connection points
  const diFlows = flows
    .map((f) => {
      const sourceEl = elById[f.from];
      const targetEl = elById[f.to];

      if (!sourceEl || !targetEl) {
        // Fallback to center points if elements not found
        const sw = {
          x: (sourceEl?.x || 0) + (sourceEl?.w || 0) / 2,
          y: (sourceEl?.y || 0) + (sourceEl?.h || 0) / 2,
        };
        const tw = {
          x: (targetEl?.x || 0) + (targetEl?.w || 0) / 2,
          y: (targetEl?.y || 0) + (targetEl?.h || 0) / 2,
        };
        return `<bpmndi:BPMNEdge id="${f.id}_di" bpmnElement="${f.id}">
      <di:waypoint x="${sw.x}" y="${sw.y}" />
      <di:waypoint x="${tw.x}" y="${tw.y}" />
    </bpmndi:BPMNEdge>`;
      }

      const connectionPoints = getConnectionPoints(sourceEl, targetEl);

      return `<bpmndi:BPMNEdge id="${f.id}_di" bpmnElement="${f.id}">
      <di:waypoint x="${connectionPoints.source.x}" y="${connectionPoints.source.y}" />
      <di:waypoint x="${connectionPoints.target.x}" y="${connectionPoints.target.y}" />
    </bpmndi:BPMNEdge>`;
    })
    .join("\n");

  const diClose = `</bpmndi:BPMNPlane></bpmndi:BPMNDiagram>`;
  const defsClose = `</bpmn:definitions>`;

  return [
    header,
    defsOpen,
    procOpen,
    startXml,
    tasksXml,
    flowsXml,
    endXml,
    procClose,
    diOpen,
    diStart,
    diTasks,
    diFlows,
    diEnd,
    diClose,
    defsClose,
  ].join("\n");
}

function escapeXml(s = "") {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function handleVSDXFile(file) {
  const zip = new JSZip();
  const zipContents = await zip.loadAsync(file);

  // Try to find first page file
  const pageFileName = Object.keys(zipContents.files).find((f) =>
    f.match(/^visio\/pages\/page\d+\.xml$/i)
  );

  if (!pageFileName) {
    throw new Error("Invalid VSDX file: no page XML found");
  }

  const pageXml = await zipContents.file(pageFileName)?.async("text");
  if (!pageXml) {
    throw new Error("Invalid VSDX file: could not read page XML");
  }

  return pageXml; // this text can now be parsed by parseVDXAndConvert
}


// This function would handle VSD binary files (would require a binary parser)
// For demo purposes, this provides a placeholder implementation
async function handleVSDFile(file) {
  throw new Error(
    "VSD binary format not supported. Please open the file in Visio and save it as .vdx or .vsdx first."
  );
}


const VisioToBPMNConverter = () => {
  const containerRef = useRef(null);
  const modelerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [bpmnXML, setBpmnXML] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    modelerRef.current = new Modeler({
      container: containerRef.current,
    });
    return () => {
      modelerRef.current?.destroy();
      modelerRef.current = null;
    };
  }, []);

  const renderBPMN = useCallback(async (xml) => {
    if (!modelerRef.current) return;
    await modelerRef.current.importXML(xml);
    const canvas = modelerRef.current.get("canvas");
    canvas.zoom("fit-viewport", "auto");
  }, []);

  useEffect(() => {
    if (bpmnXML) renderBPMN(bpmnXML);
  }, [bpmnXML, renderBPMN]);

  const parseVDXAndConvert = async (text) => {
    // Parse VDX XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      allowBooleanAttributes: true,
    });
    const json = parser.parse(text);

    // VisioDocument.Pages.Page
    const pages = toArray(json?.VisioDocument?.Pages?.Page);
    if (pages.length === 0) throw new Error("No pages found in VDX");

    // Use first page
    const page = pages[0];

    // Shapes
    const rawShapes = page?.Shapes?.Shape;
    if (!rawShapes) throw new Error("No shapes found in VDX");

    const shapes = normalizeShapes(rawShapes);

    // Page-level connects (preferred)
    const pageEdges = extractConnectsFromPage(page);

    // Only use rectangles as BPMN tasks
    const rects = shapes.filter((s) => s.isRect && s.text);
    if (rects.length === 0)
      throw new Error("No rectangular labeled shapes found to convert");

    const edges = deriveEdges(shapes, pageEdges);

    // Build BPMN
    const xml = buildBPMN("Definitions_1", "Process_1", rects, edges);
    return xml;
  };

  const onFileChange = async (evt) => {
    const file = evt.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const ext = file.name.split(".").pop().toLowerCase();
    try {
      setLoading(true);
      let text;

      // Handle different file formats
      switch (ext) {
        case "vdx":
          text = await file.text();
          break;
        case "vsdx":
          text = await handleVSDXFile(file);
          break;
        case "vsd":
          text = await handleVSDFile(file);
          break;
        default:
          throw new Error(
            "Unsupported file format. Please use .vdx, .vsdx, or .vsd files."
          );
      }

      const xml = await parseVDXAndConvert(text);
      setBpmnXML(xml);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to convert file");
    } finally {
      setLoading(false);
      evt.target.value = "";
    }
  };

  const onDownload = () => {
    if (!bpmnXML) return;
    const blob = new Blob([bpmnXML], { type: "application/xml;charset=utf-8" });
    const base = fileName?.replace(/\.(vdx|vsdx|vsd)$/i, "") || "diagram";
    saveAs(blob, `${base}.bpmn`);
  };

  const onReset = () => {
    setBpmnXML("");
    setFileName("");
    modelerRef.current?.clear();
  };

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Typography variant="h5">
        Visio (.vdx, .vsdx, .vsd) → BPMN Converter
      </Typography>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="contained" component="label">
            Upload Visio File
            <input
              hidden
              type="file"
              accept=".vdx,.vsdx,.vsd"
              onChange={onFileChange}
            />
          </Button>

          <Button variant="outlined" onClick={onDownload} disabled={!bpmnXML}>
            Download .bpmn
          </Button>

          <Button
            variant="text"
            onClick={onReset}
            disabled={!bpmnXML && !fileName}
          >
            Reset
          </Button>

          {fileName && (
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              Loaded: {fileName}
            </Typography>
          )}
        </Stack>

        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="caption">Converting…</Typography>
          </Box>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 0, height: 520, overflow: "hidden" }}>
        <div ref={containerRef} style={{ width: "100%", height: 520 }} />
      </Paper>

      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Tip: This converter supports .vdx, .vsdx, and .vsd Visio files. For best
        results with complex diagrams, use the .vdx format. This demo maps
        labeled rectangles and simple connectors to BPMN Tasks and Sequence
        Flows.
      </Typography>
    </Stack>
  );
};

export default VisioToBPMNConverter;
