import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { getSearchElementList } from "./httpService";
import "./BPMN.css";
import headingicons from "../../assets/svg/BPMN/headingIcon.svg";
import viewIcon from "../../assets/svg/BPMN/viewIcon.svg";
import closeIcon from "../../assets/svg/BPMN/closeIcon.svg";
import SopsfileIcon from "../../assets/svg/BPMN/SOPsFileIcon.svg";
import VideoIcon from "../../assets/svg/BPMN/videoIcon.svg";
import BookOpen from "../../assets/svg/SideBar/book-open.svg";
import EditIcon from "../../assets/svg/SideBar/edit.svg";
import MonitorIcon from "../../assets/svg/SideBar/monitor.svg";
import ColorPickerModule from "./colors/index";
import { getroles } from "../../services/enterprise/Enterprise";
import LinkPopUp from "./LinkPopUp";
import LinkIcon from "../../assets/svg/BPMN/LinkIcon.svg";
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useHeadingBgColor } from "../useHeadingBgColor";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import { XMLParser } from "fast-xml-parser";
import JSZip from "jszip";

const initialBpmnXml = `
  <?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn:process id="Process_1" isExecutable="false" />
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
    </bpmndi:BPMNDiagram>
  </bpmn:definitions>
  `;

// Font family options
const fontFamilyOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Verdana", label: "Verdana" },
  { value: "Georgia", label: "Georgia" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "Impact", label: "Impact" },
  { value: "Lucida Console", label: "Lucida Console" },
  { value: "Tahoma", label: "Tahoma" },
  { value: "Palatino", label: "Palatino" },
  { value: "Garamond", label: "Garamond" },
  { value: "Bookman", label: "Bookman" },
];

function toArray(x) {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}
function getNumber(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}
function snap(n, grid = 10) {
  return Math.round(n / grid) * grid;
}
function uniqBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const it of arr) {
    const k = keyFn(it);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }
  return out;
}

const GRID = 10;
function snapPoint(p) {
  return { x: snap(p.x, GRID), y: snap(p.y, GRID) };
}
function snapWaypoints(waypoints) {
  return (waypoints || []).map(snapPoint);
}
function orthogonalizeAllConnections(modeler) {
  const modeling = modeler.get("modeling");
  const elementRegistry = modeler.get("elementRegistry");
  const conns = elementRegistry
    .getAll()
    .filter((el) => el.waypoints && el.type !== "label");
  conns.forEach((c) => {
    try {
      modeling.layoutConnection(c);
      modeling.updateWaypoints(c, snapWaypoints(c.waypoints));
    } catch (err) {
      // ignore routing errors
    }
  });
}

function normalizeShapes(rawShapes) {
  const shapes = toArray(rawShapes).map((s, idx) => {
    const id = String(
      s?.["@_ID"] ?? s?.ID ?? s?.id ?? s?.["@_id"] ?? String(idx + 1)
    );

    let text = "";
    if (typeof s?.Text === "string") text = s.Text;
    else if (s?.Text?.["#text"]) text = s.Text["#text"];
    else if (s?.text) text = s.text;
    else if (s?.["@_text"]) text = s["@_text"];
    else if (s?.name) text = s.name;
    else if (s?.label) text = s.label;
    text = String(text || "").trim();
    const xf = s?.XForm || s?.Transform || s?.transform || {};
    let PinX = getNumber(xf.PinX ?? xf["@_PinX"] ?? xf.x ?? xf["@_x"], 0);
    let PinY = getNumber(xf.PinY ?? xf["@_PinY"] ?? xf.y ?? xf["@_y"], 0);
    let Width = getNumber(
      xf.Width ?? xf["@_Width"] ?? xf.width ?? xf["@_width"],
      1
    );
    let Height = getNumber(
      xf.Height ?? xf["@_Height"] ?? xf.height ?? xf["@_height"],
      0.6
    );

    const geom = s?.Geom || s?.Geometry || s?.geometry || {};
    const geomArr = toArray(geom);
    let isRect = false;
    let isLine = false;
    let isDiamond = false;
    let isCircle = false;

    // Improved lane detection
    let isLane = false;
    const shapeText = String(text || "").toLowerCase();
    const shapeType = String(
      s?.type || s?.Type || s?.["@_type"] || ""
    ).toLowerCase();

    // Check for lane/pool indicators in both type and text
    if (
      shapeType.includes("lane") ||
      shapeType.includes("pool") ||
      shapeType.includes("swim") ||
      shapeText.includes("lane") ||
      shapeText.includes("pool") ||
      shapeText.includes("swim")
    ) {
      isLane = true;
    }

    // Also check by aspect ratio for horizontal/vertical containers
    const aspect =
      Width && Height ? Math.max(Width / Height, Height / Width) : 0;
    if (!isLane && aspect >= 6 && (Width > 3 || Height > 3)) isLane = true;

    if (geomArr.length) {
      const first = geomArr[0];
      const lineTo = toArray(first?.LineTo || first?.lineTo || []);
      if (lineTo.length >= 3) isRect = true;
      if (lineTo.length === 1 || lineTo.length === 2) isLine = true;
      if (lineTo.length === 4 && !text) isDiamond = true;
    } else {
      if (
        text ||
        shapeType.includes("rect") ||
        shapeType.includes("box") ||
        shapeType.includes("task") ||
        shapeType.includes("process")
      )
        isRect = true;
      if (
        shapeType.includes("line") ||
        shapeType.includes("connector") ||
        shapeType.includes("arrow")
      )
        isLine = true;
      if (
        shapeType.includes("diamond") ||
        shapeType.includes("decision") ||
        shapeType.includes("gateway")
      )
        isDiamond = true;
      if (
        shapeType.includes("circle") ||
        shapeType.includes("ellipse") ||
        shapeType.includes("event") ||
        shapeType.includes("terminator")
      )
        isCircle = true;
    }

    // inline connects on shape (sometimes available on connector shapes)
    const connects = s?.Connects ? toArray(s.Connects.Connect) : [];
    const connectsTo = connects.map((c) =>
      String(c?.["@_ToSheet"] ?? c?.ToSheet ?? c?.toSheet ?? c?.target ?? "")
    );

    const left = PinX - Width / 2;
    const right = PinX + Width / 2;
    const top = PinY - Height / 2;
    const bottom = PinY + Height / 2;

    return {
      id,
      text,
      PinX,
      PinY,
      Width,
      Height,
      isRect,
      isLine,
      isDiamond,
      isCircle,
      isLane,
      connectsTo,
      bounds: { left, right, top, bottom },
    };
  });

  return shapes;
}

function extractConnectsFromPage(rawPage) {
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
  const rects = shapes.filter((s) => s.isRect || s.isDiamond || s.isCircle);
  const rectIds = new Set(rects.map((r) => r.id));
  const edges = [];
  for (const e of pageEdges || []) {
    if (rectIds.has(e.from) && rectIds.has(e.to)) edges.push(e);
  }
  for (const s of shapes) {
    if (s.isLine && Array.isArray(s.connectsTo) && s.connectsTo.length) {
      const targets = s.connectsTo.filter((t) => rectIds.has(t));
      if (targets.length === 2)
        edges.push({ from: targets[0], to: targets[1] });
    }
  }
  if (edges.length === 0 && rects.length > 1) {
    const sorted = [...rects].sort((a, b) => {
      const dy = a.PinY - b.PinY;
      if (Math.abs(dy) < 0.8) return a.PinX - b.PinX;
      return dy;
    });
    for (let i = 0; i < sorted.length - 1; i++) {
      edges.push({ from: sorted[i].id, to: sorted[i + 1].id });
    }
  }

  return uniqBy(edges, (e) => `${e.from}->${e.to}`);
}

function buildBPMN(defId, processId, nodes, edges) {
  const taskW = 140;
  const taskH = 70;

  const idToNode = {};
  nodes.forEach((n, i) => {
    idToNode[n.id || String(i + 1)] = n;
  });

  const validEdges = (edges || []).filter(
    (e) => idToNode[e.from] && idToNode[e.to]
  );

  const laneNodes = nodes.filter((n) => n.isLane);
  let taskNodes = nodes.filter((n) => n.isRect && !n.isLane);
  let gatewayNodes = nodes.filter((n) => n.isDiamond && !n.isLane);
  let circleNodes = nodes.filter((n) => n.isCircle && !n.isLane);

  if (taskNodes.length + gatewayNodes.length + circleNodes.length === 0) {
    taskNodes = nodes.filter((n) => !n.isLine && !n.isLane);
  }

  const rectIds = taskNodes.concat(gatewayNodes, circleNodes).map((n) => n.id);
  const inDeg = new Map(rectIds.map((id) => [id, 0]));
  const adj = new Map(rectIds.map((id) => [id, []]));

  validEdges.forEach((e) => {
    adj.get(e.from).push(e.to);
    inDeg.set(e.to, (inDeg.get(e.to) || 0) + 1);
  });

  const q = [];
  inDeg.forEach((deg, id) => {
    if (deg === 0) q.push(id);
  });

  const order = [];
  while (q.length) {
    const cur = q.shift();
    order.push(cur);
    for (const nxt of adj.get(cur) || []) {
      inDeg.set(nxt, inDeg.get(nxt) - 1);
      if (inDeg.get(nxt) === 0) q.push(nxt);
    }
  }

  const hasCycle = order.length !== rectIds.length;
  const rank = new Map();
  if (!hasCycle) {
    const layer0 = order.filter((id) => {
      return edges.findIndex((e) => e.to === id) === -1;
    });
    const seen = new Set();
    const frontier = [...layer0];
    layer0.forEach((id) => {
      rank.set(id, 0);
      seen.add(id);
    });

    while (frontier.length) {
      const cur = frontier.shift();
      const r = rank.get(cur);
      for (const nxt of adj.get(cur) || []) {
        if (!rank.has(nxt)) rank.set(nxt, r + 1);
        if (!seen.has(nxt)) {
          seen.add(nxt);
          frontier.push(nxt);
        }
      }
    }

    rectIds.forEach((id) => {
      if (!rank.has(id)) rank.set(id, 0);
    });
  } else {
    nodes
      .slice()
      .sort((a, b) => a.PinY - b.PinY || a.PinX - b.PinX)
      .forEach((n, i) => rank.set(n.id, Math.floor(i / 3)));
  }

  // ---- Bucket nodes by layer ----
  const layers = new Map();
  rectIds.forEach((id) => {
    const r = rank.get(id) ?? 0;
    if (!layers.has(r)) layers.set(r, []);
    layers.get(r).push(idToNode[id]);
  });

  // ---- Sort within each layer ----
  const sortedLayerKeys = Array.from(layers.keys()).sort((a, b) => a - b);
  sortedLayerKeys.forEach((k) => {
    layers.get(k).sort((a, b) => a.PinY - b.PinY || a.PinX - b.PinX);
  });

  // ---- Place nodes on grid ----
  const paddingX = 200;
  const paddingY = 150;
  const hSpacing = 220;
  const vSpacing = 140;

  const taskDefs = [];
  const gatewayDefs = [];
  const eventDefs = [];
  const placed = new Map(); // srcId -> visual element
  let maxRightX = 0;

  // ---- Lane mapping (assign by original Y within lane bounds) ----
  const laneDefs = [];
  if (laneNodes.length) {
    laneNodes
      .slice()
      .sort((a, b) => (a.bounds?.top || 0) - (b.bounds?.top || 0))
      .forEach((ln, i) => {
        laneDefs.push({
          id: `Lane_${ln.id}`,
          name: ln.text || `Lane ${i + 1}`,
          srcId: ln.id,
          bounds: ln.bounds,
        });
      });
  }
  const nodeIdToLaneId = new Map();
  if (laneDefs.length) {
    [...taskNodes, ...gatewayNodes, ...circleNodes].forEach((n) => {
      const y = n.PinY;
      const lane = laneDefs.find(
        (ln) => ln.bounds && y >= ln.bounds.top && y <= ln.bounds.bottom
      );
      if (lane) nodeIdToLaneId.set(n.id, lane.id);
    });
  }

  // Only keep lanes that actually have at least one member
  const usedLaneDefs = laneDefs.filter((ln) => {
    for (const n of [...taskNodes, ...gatewayNodes, ...circleNodes]) {
      if (nodeIdToLaneId.get(n.id) === ln.id) return true;
    }
    return false;
  });

  // Stack lanes vertically using computed bands
  const assignedNodesByLane = new Map();
  nodeIdToLaneId.forEach((laneId) => {
    assignedNodesByLane.set(laneId, (assignedNodesByLane.get(laneId) || 0) + 1);
  });
  const laneBands = new Map(); // laneId -> { top, bottom }
  const defaultLaneHeight = 240;
  const laneGap = 30;
  let currentTop = snap(Math.max(60, paddingY - 80));
  usedLaneDefs.forEach((ln) => {
    const count = assignedNodesByLane.get(ln.id) || 1;
    const estHeight = 100 + (count - 1) * vSpacing;
    const height = snap(Math.max(defaultLaneHeight, estHeight));
    laneBands.set(ln.id, { top: currentTop, bottom: currentTop + height });
    currentTop += height + laneGap;
  });

  sortedLayerKeys.forEach((layerIdx, colIdx) => {
    const columnNodes = layers.get(layerIdx);
    columnNodes.forEach((n, rowIdx) => {
      const x = snap(paddingX + colIdx * hSpacing);

      // Default grid Y
      let yBase = snap(paddingY + rowIdx * vSpacing);

      // If node is assigned to a lane, snap Y to the lane center for readability
      const assignedLaneId = nodeIdToLaneId.get(n.id);
      const assignedLane = assignedLaneId
        ? usedLaneDefs.find((ld) => ld.id === assignedLaneId)
        : null;

      if (circleNodes.find((c) => c.id === n.id)) {
        const h = 36;
        let y = yBase;
        const band = assignedLane ? laneBands.get(assignedLane.id) : null;
        if (band) {
          const centerY = (band.top + band.bottom) / 2;
          y = snap(centerY - h / 2);
        }
        const evt = {
          id: `Event_${n.id}`,
          name: n.text || "",
          x,
          y,
          w: 36,
          h,
          srcId: n.id,
          isCircle: true,
        };
        eventDefs.push(evt);
        placed.set(n.id, evt);
        maxRightX = Math.max(maxRightX, x + evt.w);
      } else if (gatewayNodes.find((g) => g.id === n.id)) {
        const w = 50;
        const h = 50;
        let y = yBase;
        const band = assignedLane ? laneBands.get(assignedLane.id) : null;
        if (band) {
          const centerY = (band.top + band.bottom) / 2;
          y = snap(centerY - h / 2);
        }
        const gw = {
          id: `Gateway_${n.id}`,
          name: n.text || "",
          x,
          y,
          w,
          h,
          srcId: n.id,
          isCircle: false,
          isGateway: true,
        };
        gatewayDefs.push(gw);
        placed.set(n.id, gw);
        maxRightX = Math.max(maxRightX, x + gw.w);
      } else {
        let y = yBase;
        const band = assignedLane ? laneBands.get(assignedLane.id) : null;
        if (band) {
          const centerY = (band.top + band.bottom) / 2;
          y = snap(centerY - taskH / 2);
        }
        const task = {
          id: `Task_${n.id}`,
          name: n.text || `Step ${rowIdx + 1}`,
          x,
          y,
          w: taskW,
          h: taskH,
          srcId: n.id,
          isCircle: false,
        };
        taskDefs.push(task);
        placed.set(n.id, task);
        maxRightX = Math.max(maxRightX, x + taskW);
      }
    });
  });

  if (taskDefs.length + gatewayDefs.length + eventDefs.length === 0) {
    const allNodes = taskNodes.concat(gatewayNodes, circleNodes);
    const cols = Math.ceil(Math.sqrt(allNodes.length || 1));
    allNodes.forEach((n, idx) => {
      const col = idx % cols,
        row = Math.floor(idx / cols);
      const x = snap(paddingX + col * hSpacing);
      const y = snap(paddingY + row * vSpacing);
      const task = {
        id: `Task_${n.id || idx + 1}`,
        name: n.text || `Step ${idx + 1}`,
        x,
        y,
        w: taskW,
        h: taskH,
        srcId: n.id,
        isCircle: false,
      };
      taskDefs.push(task);
      placed.set(n.id, task);
      maxRightX = Math.max(maxRightX, x + taskW);
    });
  }

  // ---- Start/End events ----
  const allY = [...taskDefs, ...gatewayDefs, ...eventDefs].map((t) => t.y);
  const avgY = allY.length
    ? allY.reduce((a, b) => a + b, 0) / allY.length
    : 200;
  const hasCircleEvents = eventDefs.length > 0;

  // Determine first and last activity by X to align events horizontally
  const sequenceElems = [...taskDefs, ...gatewayDefs]
    .slice()
    .sort((a, b) => a.x - b.x || a.y - b.y);
  const firstActivity = sequenceElems[0] || null;
  const lastActivity = sequenceElems.length
    ? sequenceElems[sequenceElems.length - 1]
    : null;

  const startEvent = hasCircleEvents
    ? null
    : {
        id: "StartEvent_1",
        x: snap(
          (Math.min(...[...taskDefs, ...gatewayDefs].map((t) => t.x)) || 200) -
            120
        ),
        y: snap(
          firstActivity
            ? firstActivity.y + firstActivity.h / 2 - 18
            : avgY + taskH / 2 - 18
        ),
        w: 36,
        h: 36,
        isCircle: true,
      };
  const endEvent = hasCircleEvents
    ? null
    : {
        id: "EndEvent_1",
        x: snap(maxRightX + 80),
        y: snap(
          lastActivity
            ? lastActivity.y + lastActivity.h / 2 - 18
            : avgY + taskH / 2 - 18
        ),
        w: 36,
        h: 36,
        isCircle: true,
      };

  // ---- Build flows ----
  const flows = [];
  let flowCount = 1;
  if (!hasCircleEvents && taskDefs.length) {
    flows.push({
      id: `Flow_${flowCount++}`,
      from: startEvent.id,
      to: taskDefs[0].id,
    });
  }

  validEdges.forEach((e) => {
    const a = placed.get(e.from);
    const b = placed.get(e.to);
    if (a && b) {
      flows.push({ id: `Flow_${flowCount++}`, from: a.id, to: b.id });
    }
  });

  if (flows.length <= 1 && taskDefs.length > 1) {
    const seq = taskDefs.slice().sort((a, b) => a.x - b.x || a.y - b.y);
    for (let i = 0; i < seq.length - 1; i++) {
      flows.push({
        id: `Flow_${flowCount++}`,
        from: seq[i].id,
        to: seq[i + 1].id,
      });
    }
  }

  if (!hasCircleEvents && (taskDefs.length || gatewayDefs.length)) {
    const seq = [...taskDefs, ...gatewayDefs]
      .slice()
      .sort((a, b) => a.x - b.x || a.y - b.y);
    if (seq.length) {
      flows.push({
        id: `Flow_${flowCount++}`,
        from: seq[seq.length - 1].id,
        to: endEvent.id,
      });
    }
  }

  // ---- Element lookup ----
  const elById = {
    ...(startEvent ? { [startEvent.id]: startEvent } : {}),
    ...(endEvent ? { [endEvent.id]: endEvent } : {}),
    ...Object.fromEntries(taskDefs.map((t) => [t.id, t])),
    ...Object.fromEntries(gatewayDefs.map((g) => [g.id, g])),
    ...Object.fromEntries(eventDefs.map((e) => [e.id, e])),
  };

  // ---- Port offset bookkeeping ----
  const outCount = new Map();
  const inCount = new Map();
  flows.forEach((f) => {
    outCount.set(f.from, (outCount.get(f.from) || 0) + 1);
    inCount.set(f.to, (inCount.get(f.to) || 0) + 1);
  });
  const outIdx = new Map();
  const inIdx = new Map();
  flows.forEach((f) => {
    outIdx.set(f.id, outIdx.get(`${f.from}#`) || 0);
    outIdx.set(`${f.from}#`, (outIdx.get(`${f.from}#`) || 0) + 1);

    inIdx.set(f.id, inIdx.get(`${f.to}#`) || 0);
    inIdx.set(`${f.to}#`, (inIdx.get(`${f.to}#`) || 0) + 1);
  });

  // ---- XML build helpers ----
  function escapeXml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  // NOTE: increased margin + portStep (NEW)
  function dockPoint(el, dir, offsetIndex = 0, total = 1) {
    const cx = el.x + el.w / 2;
    const cy = el.y + el.h / 2;
    const margin = 12; // was 5
    const portStep = 14; // was 10
    const offset = (offsetIndex - (total - 1) / 2) * portStep;

    if (el.isCircle) {
      const r = el.w / 2 + margin;
      if (dir === "L") return { x: cx - r, y: cy + offset };
      if (dir === "R") return { x: cx + r, y: cy + offset };
      if (dir === "U") return { x: cx + offset, y: cy - r };
      return { x: cx + offset, y: cy + r }; // D
    } else {
      if (dir === "L") return { x: el.x - margin, y: cy + offset };
      if (dir === "R") return { x: el.x + el.w + margin, y: cy + offset };
      if (dir === "U") return { x: cx + offset, y: el.y - margin };
      return { x: cx + offset, y: el.y + el.h + margin };
    }
  }

  function chooseSides(a, b) {
    const ax = a.x + a.w / 2,
      ay = a.y + a.h / 2;
    const bx = b.x + b.w / 2,
      by = b.y + b.h / 2;
    const dx = bx - ax,
      dy = by - ay;
    if (Math.abs(dx) >= Math.abs(dy)) {
      return { out: dx >= 0 ? "R" : "L", in: dx >= 0 ? "L" : "R" };
    } else {
      return { out: dy >= 0 ? "D" : "U", in: dy >= 0 ? "U" : "D" };
    }
  }

  function route(
    a,
    b,
    outSide,
    inSide,
    outOffsetIdx,
    outTotal,
    inOffsetIdx,
    inTotal
  ) {
    const p1 = dockPoint(a, outSide, outOffsetIdx, outTotal);
    const p4 = dockPoint(b, inSide, inOffsetIdx, inTotal);

    const aLeft = a.x;
    const aRight = a.x + a.w;
    const aTop = a.y;
    const aBottom = a.y + a.h;
    const bLeft = b.x;
    const bRight = b.x + b.w;
    const bTop = b.y;
    const bBottom = b.y + b.h;
    const gap = 40;

    const points = [{ x: snap(p1.x), y: snap(p1.y) }];

    if (outSide === "R" && inSide === "L") {
      let midX = (aRight + bLeft) / 2;
      if (midX <= aRight + 10) midX = aRight + gap;
      if (midX >= bLeft - 10) midX = bLeft - gap;
      midX = snap(midX);
      points.push({ x: midX, y: points[points.length - 1].y });
      points.push({ x: midX, y: p4.y });
    } else if (outSide === "L" && inSide === "R") {
      let midX = (aLeft + bRight) / 2;
      if (midX >= aLeft - 10) midX = aLeft - gap;
      if (midX <= bRight + 10) midX = bRight + gap;
      midX = snap(midX);
      points.push({ x: midX, y: points[points.length - 1].y });
      points.push({ x: midX, y: p4.y });
    } else if (
      (outSide === "U" && inSide === "D") ||
      (outSide === "D" && inSide === "U")
    ) {
      let midY = (aTop + bBottom) / 2;
      if (outSide === "U" && inSide === "D") {
        midY = (aTop + bBottom) / 2;
        if (midY >= aTop - 10) midY = aTop - gap;
        if (midY <= bBottom + 10) midY = bBottom + gap;
      } else {
        midY = (aBottom + bTop) / 2;
        if (midY <= aBottom + 10) midY = aBottom + gap;
        if (midY >= bTop - 10) midY = bTop - gap;
      }
      midY = snap(midY);
      points.push({ x: points[points.length - 1].x, y: midY });
      points.push({ x: p4.x, y: midY });
    } else {
      // Default orthogonal routing
      const midX = snap((p1.x + p4.x) / 2);
      points.push({ x: midX, y: points[points.length - 1].y });
      points.push({ x: midX, y: p4.y });
    }

    points.push({ x: snap(p4.x), y: snap(p4.y) });
    const cleaned = [points[0]];
    for (let i = 1; i < points.length; i++) {
      const prev = cleaned[cleaned.length - 1];
      if (prev.x !== points[i].x || prev.y !== points[i].y)
        cleaned.push(points[i]);
    }
    return cleaned;
  }

  // ---- Build XML ----

  const xmlParts = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="${defId}" targetNamespace="http://bpmn.io/schema/bpmn">`,
    `  <bpmn:process id="${processId}" isExecutable="false">`,
    ...(startEvent ? [`    <bpmn:startEvent id="${startEvent.id}" />`] : []),
    ...taskDefs.map(
      (t) => `    <bpmn:task id="${t.id}" name="${escapeXml(t.name)}" />`
    ),
    ...gatewayDefs.map(
      (g) =>
        `    <bpmn:exclusiveGateway id="${g.id}" name="${escapeXml(g.name)}" />`
    ),
    ...eventDefs.map(
      (e) =>
        `    <bpmn:intermediateThrowEvent id="${e.id}" name="${escapeXml(
          e.name
        )}" />`
    ),
    ...flows.map(
      (f) =>
        `    <bpmn:sequenceFlow id="${f.id}" sourceRef="${f.from}" targetRef="${f.to}" />`
    ),
    ...(endEvent ? [`    <bpmn:endEvent id="${endEvent.id}" />`] : []),
    ...(usedLaneDefs.length
      ? [
          `    <bpmn:laneSet id="LaneSet_1">`,
          ...usedLaneDefs.map((ln) => {
            const memberIds = [...taskNodes, ...gatewayNodes, ...circleNodes]
              .filter((n) => nodeIdToLaneId.get(n.id) === ln.id)
              .map((n) =>
                circleNodes.find((c) => c.id === n.id)
                  ? `Event_${n.id}`
                  : gatewayNodes.find((g) => g.id === n.id)
                  ? `Gateway_${n.id}`
                  : `Task_${n.id}`
              );
            return [
              `      <bpmn:lane id="${ln.id}" name="${escapeXml(ln.name)}">`,
              ...memberIds.map(
                (mid) => `        <bpmn:flowNodeRef>${mid}</bpmn:flowNodeRef>`
              ),
              `      </bpmn:lane>`,
            ].join("\n");
          }),
          `    </bpmn:laneSet>`,
        ]
      : []),
    `  </bpmn:process>`,
    `  <bpmndi:BPMNDiagram id="BPMNDiagram_1">`,
    `    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">`,
    ...(startEvent
      ? [
          `      <bpmndi:BPMNShape id="${startEvent.id}_di" bpmnElement="${startEvent.id}">`,
          `        <dc:Bounds x="${startEvent.x}" y="${startEvent.y}" width="${startEvent.w}" height="${startEvent.h}" />`,
          `      </bpmndi:BPMNShape>`,
        ]
      : []),
    ...taskDefs.map(
      (t) => `      <bpmndi:BPMNShape id="${t.id}_di" bpmnElement="${t.id}">
        <dc:Bounds x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" />
      </bpmndi:BPMNShape>`
    ),
    ...gatewayDefs.map(
      (g) => `      <bpmndi:BPMNShape id="${g.id}_di" bpmnElement="${g.id}">
        <dc:Bounds x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" />
      </bpmndi:BPMNShape>`
    ),
    ...eventDefs.map(
      (e) => `      <bpmndi:BPMNShape id="${e.id}_di" bpmnElement="${e.id}">
        <dc:Bounds x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" />
      </bpmndi:BPMNShape>`
    ),
    ...flows.map((f) => {
      const A = elById[f.from];
      const B = elById[f.to];
      if (!A || !B) return "";
      let sides = chooseSides(A, B);
      // Force horizontal side-to-side docking for event-to-activity or activity-to-event
      if ((A.isCircle && !B.isCircle) || (!A.isCircle && B.isCircle)) {
        sides = { out: "R", in: "L" };
      }
      const pts = route(
        A,
        B,
        sides.out,
        sides.in,
        outIdx.get(f.id) || 0,
        outCount.get(f.from) || 1,
        inIdx.get(f.id) || 0,
        inCount.get(f.to) || 1
      );
      const waypoints = pts
        .map((p) => `        <di:waypoint x="${p.x}" y="${p.y}" />`)
        .join("\n");
      return `      <bpmndi:BPMNEdge id="${f.id}_di" bpmnElement="${f.id}">
${waypoints}
      </bpmndi:BPMNEdge>`;
    }),
    ...(endEvent
      ? [
          `      <bpmndi:BPMNShape id="${endEvent.id}_di" bpmnElement="${endEvent.id}">`,
          `        <dc:Bounds x="${endEvent.x}" y="${endEvent.y}" width="${endEvent.w}" height="${endEvent.h}" />`,
          `      </bpmndi:BPMNShape>`,
        ]
      : []),
    ...(usedLaneDefs.length
      ? (() => {
          const allPlaced = [...taskDefs, ...gatewayDefs, ...eventDefs];
          const minX = allPlaced.length
            ? Math.min(...allPlaced.map((m) => m.x)) - 40
            : 140;
          const maxX = allPlaced.length
            ? Math.max(...allPlaced.map((m) => m.x + m.w)) + 40
            : 800;
          return usedLaneDefs.map((ln) => {
            const band =
              typeof laneBands !== "undefined" && laneBands.get
                ? laneBands.get(ln.id)
                : null;
            const pad = 40;
            const x = snap(minX);
            const y = snap((band ? band.top : 120) - pad);
            const w = snap(maxX - minX);
            const h = snap(
              (band ? band.bottom : 400) - (band ? band.top : 120) + pad * 2
            );
            return `      <bpmndi:BPMNShape id="${ln.id}_di" bpmnElement="${ln.id}">
        <dc:Bounds x="${x}" y="${y}" width="${w}" height="${h}" />
      </bpmndi:BPMNShape>`;
          });
        })()
      : []),
    `    </bpmndi:BPMNPlane>`,
    `  </bpmndi:BPMNDiagram>`,
    `</bpmn:definitions>`,
  ];

  return xmlParts.join("\n");
}

export default function BPMNAdmin(props) {
  let {
    SOPData,
    setXml,
    shapeDetails,
    sopTemplateList,
    setShapeDetails,
    selectedelement,
    setSelectedElement,
    selectedElementRef = useRef({}),
    setSopDraftData,
    modelerRef,
    onRoleDetailsSave,
    bpmnXml,
    TemplateHeader,
    TemplateFooter,
    TemplateFontFamly,
    setTemplateHeader,
    setTemplateFooter,
    setTemplateFontFamly,
    selectedTemplate,
  } = props;
  const canvasRef = useRef(null);
  const apiCallRef = useRef(false);
  const currentXmlRef = useRef("");
  const fileInputRef = useRef(null);
  const SOPCreationType = localStorage.getItem("selectedSOPCard");
  const [fileDialogOpened, setFileDialogOpened] = useState(false);
  const fileDialogOpenedRef = useRef(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const { t } = useTranslation();
  const [elemetList, setElementList] = useState([]);
  const selectedShapeId = useRef(null);
  const existingLinkedElement = useRef(null);
  const [searchString, setSearchString] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [rolePins, setRolePins] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  const [hoveredRoles, setHoveredRoles] = useState([]);
  const [showRoleTooltip, setShowRoleTooltip] = useState(false);
  const roleTooltipRef = useRef(null);

  console.log(selectedTemplate, "selectedTemplateInAdminPage");

  // Font family state
  const [selectedFontFamily, setSelectedFontFamily] = useState(
    TemplateFontFamly || "Inter"
  );

  const bgColor = useHeadingBgColor();
  console.log(bpmnXml, "bpmnXml1");

  const popupRef = useRef(null);

  // New useEffect for selectedTemplate
  useEffect(() => {
    if (selectedTemplate) {
      // 1. Apply header/footer images
      if (selectedTemplate.TemplateHeader) {
        setHeadingBanner(selectedTemplate.TemplateHeader);
      }
      if (selectedTemplate.TemplateFooter) {
        setFooterBanner(selectedTemplate.TemplateFooter);
      }

      // 2. Apply font
      if (selectedTemplate.TemplateFontFamly) {
        setSelectedFontFamily(selectedTemplate.TemplateFontFamly);
        applyFontFamily(selectedTemplate.TemplateFontFamly);
      }

      // 3. Import template XML
      if (selectedTemplate.TemplateXMLElement && modelerRef.current) {
        modelerRef.current
          .importXML(selectedTemplate.TemplateXMLElement)
          .then(() => {
            modelerRef.current.get("canvas").zoom("fit-viewport", "auto");
            setXml(selectedTemplate.TemplateXMLElement);
            console.log("Imported Template XML");
          })
          .catch((err) => console.error("Error importing Template XML:", err));
      }
    }
  }, [selectedTemplate, modelerRef]);

  const getBpmnXml = useCallback(async () => {
    if (modelerRef.current) {
      try {
        const { xml } = await modelerRef.current.saveXML({ format: true });
        currentXmlRef.current = xml;
        return xml;
      } catch (error) {
        console.error("Error getting BPMN XML:", error);
        return "";
      }
    }
    return "";
  }, []);

  // Expose the getBpmnXml function to parent via ref
  // In BPMNAdmin component
  useImperativeHandle(props.ref, () => ({
    getBpmnXml: async () => {
      if (modelerRef.current) {
        try {
          const { xml } = await modelerRef.current.saveXML({ format: true });
          return xml;
        } catch (error) {
          console.error("Error getting BPMN XML:", error);
          return "";
        }
      }
      return "";
    },
  }));

  // Add this useEffect to log XML on changes
  useEffect(() => {
    const modeler = modelerRef.current;
    if (!modeler) return;

    const logCurrentXml = debounce(async () => {
      try {
        const { xml } = await modeler.saveXML({ format: true });
        console.log("Current BPMN XML:", xml);
        localStorage.setItem("TemplatebpmnXml", xml); // Save xml under the key 'TemplatebpmnXml'

        // You can also store this in state if needed
        currentXmlRef.current = xml;
      } catch (error) {
        console.error("Error getting BPMN XML:", error);
      }
    }, 500);

    // Listen for changes
    modeler.on("commandStack.changed", logCurrentXml);
    modeler.on("element.changed", logCurrentXml);

    // Also log the initial XML after import
    const logInitialXml = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for import to complete
      logCurrentXml();
    };

    logInitialXml();

    return () => {
      modeler.off("commandStack.changed", logCurrentXml);
      modeler.off("element.changed", logCurrentXml);
    };
  }, [modelerRef.current]); // Add dependencies as needed

  // Banner image states
  const [headingBanner, setHeadingBanner] = useState(TemplateHeader || null);
  const [footerBanner, setFooterBanner] = useState(TemplateFooter || null);

  // Banner file input refs
  const headingBannerInputRef = useRef(null);
  const footerBannerInputRef = useRef(null);

  // Add hover state for banners
  const [isHeadingBannerHovered, setIsHeadingBannerHovered] = useState(false);
  const [isFooterBannerHovered, setIsFooterBannerHovered] = useState(false);

  // Function to apply font family to all BPMN elements
  const applyFontFamily = (fontFamily) => {
    // Apply font to all text elements in the BPMN canvas
    const canvas = canvasRef.current;
    if (canvas) {
      // Target all text elements within the BPMN diagram
      const textElements = canvas.querySelectorAll("text, tspan, .djs-label");
      textElements.forEach((element) => {
        element.style.fontFamily = fontFamily;
      });

      // Also apply to role pins
      const rolePinTexts = canvas.querySelectorAll("[data-role] text");
      rolePinTexts.forEach((element) => {
        element.style.fontFamily = fontFamily;
      });

      // Apply to any existing content
      const allTexts = canvas.querySelectorAll("*");
      allTexts.forEach((element) => {
        if (element.tagName === "text" || element.tagName === "tspan") {
          element.style.fontFamily = fontFamily;
        }
      });
    }

    // Add CSS rule to ensure new elements also get the font
    const styleId = "bpmn-font-override";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      .djs-container text,
      .djs-container tspan,
      .djs-label,
      [data-role] text {
        font-family: ${fontFamily} !important;
      }
    `;
  };

  const isTemplateView =
    SOPCreationType === "SOP Template" && Boolean(selectedTemplate);

  const headerSrc = isTemplateView
    ? selectedTemplate?.TemplateHeader
    : headingBanner;

  const footerSrc = isTemplateView
    ? selectedTemplate?.TemplateFooter
    : footerBanner;

  // When banner/font changes, update parent state
  useEffect(() => {
    if (!isTemplateView && setTemplateHeader) setTemplateHeader(headingBanner);
  }, [headingBanner, setTemplateHeader, isTemplateView]);

  useEffect(() => {
    if (!isTemplateView && setTemplateFooter) setTemplateFooter(footerBanner);
  }, [footerBanner, setTemplateFooter, isTemplateView]);

  useEffect(() => {
    if (setTemplateFontFamly) setTemplateFontFamly(selectedFontFamily);
  }, [selectedFontFamily, setTemplateFontFamly]);

  // Handle font family change
  const handleFontFamilyChange = (event) => {
    const newFontFamily = event.target.value;
    setSelectedFontFamily(newFontFamily);
    applyFontFamily(newFontFamily);
    // setTemplateFontFamly(newFontFamily); // Already handled by useEffect above
  };

  // Banner upload handlers
  const handleBannerUpload = (event, setBanner) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setBanner(e.target.result);
      // Also update parent state
      if (setBanner === setHeadingBanner && setTemplateHeader)
        setTemplateHeader(e.target.result);
      if (setBanner === setFooterBanner && setTemplateFooter)
        setTemplateFooter(e.target.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  // Banner remove handlers
  const removeHeadingBanner = () => {
    setHeadingBanner(null);
    setIsHeadingBannerHovered(false);
  };

  const removeFooterBanner = () => {
    setFooterBanner(null);
    setIsFooterBannerHovered(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    getroles()
      .then((response) => {
        console.log(
          "Roles API Response from BPMN:",
          response?.data?.data?.Roles
        );
        setRoles(response?.data?.data?.Roles || []);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  useEffect(() => {
    if (
      SOPCreationType === "Import BPMN" &&
      fileInputRef.current &&
      !fileDialogOpenedRef.current
    ) {
      fileDialogOpenedRef.current = true;
      setFileDialogOpened(true);
      fileInputRef.current.click();
    }
  }, [SOPCreationType]);

  useEffect(() => {
    console.log(bpmnXml, "bpmnXml4");
    if (SOPData || bpmnXml) {
      if (!apiCallRef.current) {
        initModeler();
        apiCallRef.current = true;
      }
    }

    return () => {
      if (modelerRef.current) {
        modelerRef.current.destroy();
      }
      apiCallRef.current = false;
    };
  }, [bpmnXml, apiCallRef, SOPData]);

  const openRoleModal = () => {
    setIsRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedRoles([]);
  };

  const handleRoleSelect = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    } else {
      if (selectedRoles.length >= 3) {
        alert("You can only select up to 3 roles.");
      } else {
        setSelectedRoles([...selectedRoles, roleId]);
      }
    }
  };

  const handleSaveRoles = () => {
    const selectedRoleDetails = roles
      .filter((role) => selectedRoles.includes(role.RoleID))
      .map((role) => ({
        name: role.RoleName,
        id: role.RoleID,
      }));

    if (onRoleDetailsSave) {
      onRoleDetailsSave({
        roleNames: selectedRoleDetails.map((role) => role.name),
        roleIDs: selectedRoleDetails.map((role) => role.id),
        nodeID: selectedShapeId.current,
      });
    }
    console.log("Selected role details:", {
      roleNames: selectedRoleDetails.map((role) => role.name),
      roleIDs: selectedRoleDetails.map((role) => role.id),
      nodeID: selectedShapeId.current,
    });
    const selectedRoleNames = selectedRoleDetails.map((role) => role.name);
    setRolePins([...rolePins, ...selectedRoleNames]);
    addRolePinsToDiagram(selectedRoleNames);
    closeRoleModal();
  };

  const handleRoleMouseEnter = (roles) => {
    setHoveredRoles(roles);
    setShowRoleTooltip(true);
  };

  const handleRoleMouseLeave = () => {
    setShowRoleTooltip(false);
  };

  const addRolePinsToDiagram = (roleNames) => {
    const selectedElement = document.querySelector(
      `.${selectedShapeId.current}`
    );
    if (selectedElement) {
      const existingRoleGroup = selectedElement.querySelector(
        `[data-role="${selectedShapeId.current}"]`
      );
      if (existingRoleGroup) existingRoleGroup.remove();

      const newRoleG = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      newRoleG.setAttributeNS(null, "data-role", selectedShapeId.current);
      newRoleG.setAttributeNS(
        null,
        "transform",
        `translate(${selectedElement.getBBox().x + 5}, ${
          selectedElement.getBBox().y + selectedElement.getBBox().height - 19
        })`
      );

      const newRoleRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      newRoleRect.setAttributeNS(null, "width", "100");
      newRoleRect.setAttributeNS(null, "height", "14");
      newRoleRect.setAttributeNS(null, "fill", "#007bff");
      newRoleRect.setAttributeNS(null, "rx", "7");
      newRoleRect.setAttributeNS(null, "ry", "7");

      const newRoleText = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      newRoleText.setAttributeNS(null, "fill", "#ffffff");
      newRoleText.setAttributeNS(null, "font-size", "10");
      newRoleText.setAttributeNS(null, "font-family", selectedFontFamily);
      newRoleText.setAttributeNS(null, "x", "8");
      newRoleText.setAttributeNS(null, "y", "11");

      let displayText =
        roleNames[0].length > 15
          ? roleNames[0].substring(0, 15) + "..."
          : roleNames[0];
      if (roleNames.length > 1) displayText += ` (+${roleNames.length - 1})`;
      newRoleText.textContent = displayText;
      newRoleG.addEventListener("mouseenter", () =>
        handleRoleMouseEnter(roleNames)
      );
      newRoleG.addEventListener("mouseleave", handleRoleMouseLeave);
      newRoleG.appendChild(newRoleRect);
      newRoleG.appendChild(newRoleText);
      selectedElement.appendChild(newRoleG);
    }
  };

  console.log(SOPData?.SOPXMLElement, "SOPXMLElementSOPXMLElement");

  const initModeler = async () => {
    try {
      const modeler = new BpmnModeler({
        container: canvasRef.current,
        additionalModules: [ColorPickerModule],
        moddleExtensions: {},
        keyboard: {
          bindTo: window,
        },
      });

      modelerRef.current = modeler;

      // Enable better interaction capabilities
      const modeling = modeler.get("modeling");
      const elementRegistry = modeler.get("elementRegistry");
      const canvas = modeler.get("canvas");

      modeler.on("element.click", () => {});
      modeler.on("element.changed", async (event) => {
        const element = event.element;
        if (
          element.type === "bpmn:Task" ||
          element.type === "bpmn:ServiceTask" ||
          element.type === "bpmn:UserTask" ||
          element.type === "bpmn:SendTask" ||
          element.type === "bpmn:ReceiveTask" ||
          element.type === "bpmn:ManualTask" ||
          element.type === "bpmn:BusinessRuleTask" ||
          element.type === "bpmn:ScriptTask" ||
          element.type === "bpmn:CallActivity" ||
          element.type === "bpmn:SubProcess"
        ) {
          const businessObject = element.businessObject;
          if (businessObject.name) {
            console.log("Task name length:", businessObject.name.length);

            if (businessObject.name.length > 45) {
              const truncatedName = businessObject.name.substring(0, 45);
              if (businessObject.name !== truncatedName) {
                modeler.get("modeling").updateProperties(element, {
                  name: truncatedName,
                });
                alert("Task name cannot exceed 45 characters");
              }
            }
          }
        }
        const { xml } = await modeler.saveXML({ format: true });
        setXml(xml);
        setTimeout(() => applyFontFamily(selectedFontFamily), 100);
      });

      // Add auto-layout function for better positioning
      modeler.autoLayout = () => {
        const elements = elementRegistry.filter(
          (element) =>
            element.type === "bpmn:Task" ||
            element.type === "bpmn:UserTask" ||
            element.type === "bpmn:ServiceTask"
        );

        if (elements.length > 0) {
          const spacing = 200;
          const cols = Math.ceil(Math.sqrt(elements.length));

          elements.forEach((element, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            const x = 150 + col * spacing;
            const y = 150 + row * spacing;

            modeling.moveShape(element, { x: x - element.x, y: y - element.y });
          });

          canvas.zoom("fit-viewport", "auto");
        }
      };

      modeler.on("element.contextmenu", (e) => {
        clearContent();
        const isStartEvent = e.element.type === "bpmn:StartEvent";
        const isEndEvent = e.element.type === "bpmn:EndEvent";
        if (e.element.id !== "Process_1" && !isStartEvent && !isEndEvent) {
          e.preventDefault();
          e.gfx.classList.add(e.element.id);
          selectedShapeId.current = e.element.id;
          const id = e.element.id;
          const div = document.createElement("div");
          const shapes = document.querySelectorAll("." + id);
          let isEnableShape = true;
          Array.from(shapes).forEach((parent) => {
            parent.childNodes.forEach((child) => {
              if (child.dataset.clip === id) {
                isEnableShape = false;
              }
            });
          });
          div.innerHTML = `<div class="context-menu" style="box-shadow: .3em .3em .5em gray;left: ${
            e.originalEvent.x
          }px; top: ${e.originalEvent.y}px;">
                           <ul>
                               ${
                                 isEnableShape
                                   ? '<li class="add-clip">Add Pin</li>'
                                   : ""
                               }
                               <li class="add-role">Add Role</li>
                           </ul>
                       </div>`;
          document.body.appendChild(div);
          const handleClickOutside = (event) => {
            const contextMenu = div.querySelector(".context-menu");
            if (contextMenu && !contextMenu.contains(event.target)) {
              div.remove();
              document.removeEventListener("click", handleClickOutside);
            }
          };
          document.addEventListener("click", handleClickOutside);
          document.querySelector(".add-role").addEventListener("click", () => {
            openRoleModal();
            clearContent();
          });
          const pins = document.querySelectorAll(".add-clip");
          Array.from(pins).forEach((node) => {
            node.addEventListener("click", async (evt) => {
              const dtls = {};
              dtls[e?.element?.id] = [];
              setShapeDetails(dtls);
              selectedElementRef.current[e?.element?.id] = [];
              clearContent();
              const newpathg = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
              );
              newpathg.setAttributeNS(null, "data-clip", e.element.id);
              newpathg.setAttributeNS(
                null,
                "transform",
                `matrix(1 0 0 1 ${e.element.width - 5} -15)`
              );
              const newpath = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              newpath.setAttributeNS(
                null,
                "d",
                "M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z"
              );
              newpath.setAttributeNS(null, "stroke", "#909194");
              newpath.setAttributeNS(null, "stroke-width", 1);
              newpath.setAttributeNS(null, "opacity", 1);
              newpath.setAttributeNS(null, "fill", "#22242a");
              newpath.setAttributeNS(null, "class", "event-curser");
              newpath.setAttributeNS(null, "x", "500");
              newpath.setAttributeNS(null, "y", "500");
              newpath.setAttributeNS(null, "transform", `scale(0.05)`);
              newpath.addEventListener("click", (ee) => {
                createClipDetailsContaint(null, e.element.id, ee.x, ee.y);
              });
              newpathg.appendChild(newpath);
              document.querySelector("." + e.element.id).appendChild(newpathg);
            });
          });
        }
      });
      console.log(SOPData?.SOPXMLElement, "SOPXMLElementSOPXMLElementssss");
      console.log(bpmnXml, "bpmnXml2");
      let xmlToRender = initialBpmnXml; // Default to initial XML

      if (bpmnXml) {
        xmlToRender = bpmnXml;
        console.log("Using bpmnXml:", bpmnXml);
      } else if (SOPData?.SOPXMLElement) {
        xmlToRender = SOPData.SOPXMLElement;
        console.log("Using SOPData XML:", SOPData.SOPXMLElement);
      }

      try {
        await modeler.importXML(xmlToRender);
        await modeler.get("canvas").zoom("fit-viewport", "auto");

        // Save the imported XML to state
        setXml(xmlToRender);
        console.log("Successfully imported XML");

        // Apply font family after importing XML
        setTimeout(() => applyFontFamily(selectedFontFamily), 200);
      } catch (err) {
        console.error("Error importing XML:", err);
      }

      const shapeWithLink = {};

      console.log(SOPData, "testclip");

      if (SOPData?.SopDetails?.length) {
        const existingShapeIds = [];
        const groupNode = document.querySelectorAll("g");
        Array.from(groupNode).forEach((node) => {
          SOPData?.SopDetails?.forEach((shape) => {
            if (node.dataset.elementId === shape?.SopShapeID) {
              existingShapeIds.push(shape?.SopShapeID);
              node.classList.add(node.dataset.elementId);
              const newpathg = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
              );
              newpathg.setAttributeNS(
                null,
                "data-clip",
                node.dataset.elementId
              );
              newpathg.setAttributeNS(
                null,
                "transform",
                `matrix(1 0 0 1 ${node.getBBox().width - 15} -15)`
              );
              const newpath = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
              );
              newpath.setAttributeNS(
                null,
                "d",
                "M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z"
              );
              newpath.setAttributeNS(null, "stroke", "#909194");
              newpath.setAttributeNS(null, "stroke-width", 1);
              newpath.setAttributeNS(null, "opacity", 1);
              newpath.setAttributeNS(null, "fill", "#22242a");
              newpath.setAttributeNS(null, "class", "event-curser");
              newpath.setAttributeNS(null, "x", "500");
              newpath.setAttributeNS(null, "y", "500");
              newpath.setAttributeNS(null, "transform", `scale(0.05)`);
              newpath.addEventListener("click", (ee) => {
                createClipDetailsContaint(
                  shape?.SopAttachmentLinks,
                  node.dataset.elementId,
                  ee.x,
                  ee.y
                );
              });
              newpathg.appendChild(newpath);
              node.appendChild(newpathg);
            }
          });
        });
        for (const el of SOPData?.SopDetails) {
          const links = [];
          if (
            existingShapeIds.some(
              (existingShapeId) => existingShapeId === el.SopShapeID
            )
          ) {
            for (const e of el.SopAttachmentLinks) {
              links.push({
                SopShapeID: el.SopShapeID,
                ContentLinkTitle: e.ContentLinkTitle,
                ContentLink: e.ContentLink,
                ContentLinkType: e.ContentLinkType,
              });
            }
            shapeWithLink[el.SopShapeID] = links;
          }
        }
        selectedElementRef.current = shapeWithLink;
      }
      return () => {
        modeler.destroy();
      };
    } catch (error) {
      // console.error(error)
    }
  };

  const clearContent = () => {
    const cmc = document.querySelectorAll(".context-menu");
    Array.from(cmc).forEach((el) => {
      el.remove();
    });
  };

  const createClipDetailsContaint = async (shapeLinks, id, x, y) => {
    let respData = selectedElementRef.current;
    if (!Array.isArray(respData[id])) {
      respData[id] = [];
      if (shapeLinks?.length > 0) {
        respData[id] = shapeLinks;
      }
    }
    setSelectedElement([]);
    for (const el of respData[id]) {
      el["IsSelect"] = true;
    }
    existingLinkedElement.current = respData[id];
    selectedShapeId.current = id;
    clearContent();
    let Temlet = "";
    for (const element of respData[id]) {
      if (element?.ContentLinkType === "sop") {
        Temlet += `
                  <div class="divider"></div>
                  <div class="content-item">
                      <img src ="${SopsfileIcon}" alt="Video Icon"/>
                      <span class="item-text">${
                        element?.ContentLinkTitle
                      }</span>
                      <div>
                        <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                              onclick="window.open('/sops/view/${encodeURIComponent(
                                element?.ContentLink
                              )}', '_blank');" />
                    </div>
                  </div>`;
      } else if (element?.ContentLinkType === "link") {
        Temlet += `
          <div class="divider"></div>
          <div class="content-item">
                <img src="${LinkIcon}" alt="Link Icon" style="width: 20px; height: 20px;"/>
              <span class="item-text">${element?.ContentLinkTitle}</span>
              <div>
                <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                      onclick="window.open('${encodeURIComponent(
                        element?.ContentLink
                      )}', '_blank');" />
              </div>
          </div>`;
      } else if (element?.ContentLinkType === "doc") {
        // For Document, open /documents/view
        Temlet += `
                  <div class="divider"></div>
                  <div class="content-item">
                      <img src ="${BookOpen}" alt="File Icon"/>
                      <span class="item-text">${
                        element?.ContentLinkTitle
                      }</span>
                      <div>
                          <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px;"
                              onclick="window.open('/documents/view?docId=${encodeURIComponent(
                                element?.ContentLink
                              )}', '_blank');" />
                      </div>
                  </div>`;
      } else if (element?.ContentLinkType === "trs") {
        // For Training Simulations, open /training-simulations/view
        Temlet += `
                  <div class="divider"></div>
                  <div class="content-item">
                      <img src ="${VideoIcon}" alt="Training Simulation Icon"/>
                      <span class="item-text">${
                        element?.ContentLinkTitle
                      }</span>
                      <div>
                          <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                              onclick="window.open('/training-simulations/view?trsId=${encodeURIComponent(
                                element?.ContentLink
                              )}', '_blank');" />
                      </div>
                  </div>`;
      } else if (element?.ContentLinkType === "tes") {
        // For Test Simulations, open /test-simulations/view
        Temlet += `
                  <div class="divider"></div>
                  <div class="content-item">
                      <img src ="${MonitorIcon}" alt="Test Simulation Icon"/>
                      <span class="item-text">${
                        element?.ContentLinkTitle
                      }</span>
                      <div>
                          <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                              onclick="window.open('/test-simulations/view?tesId=${encodeURIComponent(
                                element?.ContentLink
                              )}', '_blank');" />
                      </div>
                  </div>`;
      } else if (element?.ContentLinkType === "mcq") {
        // For MCQs, open /test/mcqs
        Temlet += `
                  <div class="divider"></div>
                  <div class="content-item">
                      <img src ="${EditIcon}" alt="MCQ Icon"/>
                      <span class="item-text">${
                        element?.ContentLinkTitle
                      }</span>
                      <div>
                          <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                              onclick="window.open('/test/mcqs?mcqId=${encodeURIComponent(
                                element?.ContentLink
                              )}', '_blank');" />
                      </div>
                  </div>`;
      }
    }

    if (!respData[id].length) {
      Temlet += `
              <div class="divider"></div>
              <div class="content-item">
                <span class="item-text" style="text-align:center;">No Content Available</span>
              </div>`;
    }

    // Create a background overlay for modal
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.1)";
    overlay.style.zIndex = "9999";
    overlay.className = "context-menu-overlay";

    // Modal content
    const div = document.createElement("div");
    div.innerHTML = `
    <div class="context-menu" style="width: 350px; box-shadow: .3em .3em .3em gray; left: ${x}px; top: ${y}px; position: absolute;">
      <div class="dd-content">
        <div class="headerpopup">
          <div class="icon-container"></div>
          <div class="header-text">
            <h3>Content</h3>
          </div>
          <div class="close-button" style="position: absolute; top: 10px; right: 10px; cursor: pointer;">
            <img src="${closeIcon}" alt="Close Icon" style="width: 24px; height: 24px;" onclick="document.querySelector('.context-menu-overlay')?.remove();" />
          </div>
        </div>
        ${Temlet}
        <div class="divider"></div>
        <div class="buttons">
          <button class="delete-btn">Delete Pins</button>
          <button class="manage-btn" >Manage</button>
        </div>
      </div>
    </div>
  `;

    const iconContainer = div.querySelector(".icon-container");
    const img = document.createElement("img");
    img.src = headingicons;
    img.alt = "Heading Icon";
    img.style.width = "200px";
    iconContainer.appendChild(img);
    overlay.appendChild(div);
    document.body.appendChild(overlay);
    const handleClickOutsideModal = (event) => {
      const modal = div.querySelector(".context-menu");
      if (modal && !modal.contains(event.target)) {
        overlay.remove();
        document.removeEventListener("mousedown", handleClickOutsideModal);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideModal);

    div.querySelectorAll(".manage-btn").forEach((node) => {
      node.addEventListener("click", () => {
        overlay.remove();
        openPopup();
      });
    });

    div.querySelectorAll(".delete-btn").forEach((node) => {
      node.addEventListener("click", () => {
        console.log("first delete", selectedShapeId.current);
        const shapes = document.querySelectorAll("." + selectedShapeId.current);
        Array.from(shapes).forEach((parent) => {
          parent.childNodes.forEach((child) => {
            if (child.dataset.clip == selectedShapeId.current) {
              child.remove();
              const cmc = document.querySelectorAll(".context-menu");
              Array.from(cmc).forEach((el) => {
                el.remove();
              });
              delete selectedElementRef.current[selectedShapeId.current];
            }
          });
        });
        overlay.remove();
      });
    });
  };
  function openPopup() {
    const popup = document.getElementById("popup");
    if (popup) {
      popup.style.display = "flex"; // Use flex to maintain the centering
    }
    setElementList(existingLinkedElement.current);
    setSelectedElement(existingLinkedElement.current);
    setSearchString("");
    let dtls = {};
    if (!Array.isArray(shapeDetails[selectedShapeId.current])) {
      shapeDetails[selectedShapeId.current] = [];
    }
    dtls[selectedShapeId.current] = [
      ...existingLinkedElement.current,
      ...shapeDetails[selectedShapeId.current],
    ];
    setShapeDetails(dtls);
    console.log(shapeDetails);
  }
  function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) {
      popup.style.display = "none";
    }
  }
  async function handleSearch(search) {
    setSearchString(search);
    const data = await getSearchElementList(search);
    data.data.map(
      (el) =>
        (el["IsSelect"] = shapeDetails[selectedShapeId.current]?.some(
          (x) => x.ContentLink === el.ContentLink
        )
          ? true
          : false)
    );
    setElementList(data.data);
  }
  function handleSelectedElement(event, element) {
    if (event.target.checked) {
      element.IsSelect = true;
      setSelectedElement([...selectedelement, element]);
    } else {
      element.IsSelect = false;
      setSelectedElement(
        selectedelement.filter((el) => el.ContentLink !== element?.ContentLink)
      );
    }
  }
  function handleCountClick() {
    setElementList(selectedelement);
  }
  async function handleUpdate() {
    const payload = [];
    console.log(selectedelement, "selectedelement");
    for (const el of selectedelement) {
      if (!el.SopShapeID) {
        payload.push({
          SopShapeID: selectedShapeId.current,
          ContentLinkTitle: el.ContentLinkTitle,
          ContentLink: el.ContentLink,
          ContentLinkType: el.ContentLinkType || "link",
        });
      } else {
        payload.push(el);
      }
    }
    let dtls = {};
    console.log(shapeDetails, payload);
    dtls[selectedShapeId.current] = [...payload];
    selectedElementRef.current[selectedShapeId.current] = [...payload];
    console.log(dtls);
    setShapeDetails(dtls);
    setSelectedElement([]);
    closePopup();
  }
  const handleSave = (newLink) => {
    if (selectedShapeId.current) {
      const currentLinks =
        selectedElementRef.current[selectedShapeId.current] || [];
      selectedElementRef.current[selectedShapeId.current] = [
        ...currentLinks,
        {
          SopShapeID: selectedShapeId.current,
          ContentLinkTitle: newLink.name,
          ContentLink: newLink.url,
          ContentLinkType: "link",
        },
      ];
    }
    setLinks([...links, newLink]);
    togglePopup();
  };

  const handleBpmnFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      let xmlToImport = "";

      if (file.name.toLowerCase().endsWith(".vsdx")) {
        const zip = await JSZip.loadAsync(file);
        const allFiles = Object.keys(zip.files);
        let pageFiles = allFiles.filter(
          (f) =>
            (f.includes("page") && f.endsWith(".xml")) ||
            (f.startsWith("visio/pages/") && f.endsWith(".xml"))
        );
        if (pageFiles.length === 0) {
          pageFiles = allFiles.filter((f) => f.endsWith(".xml"));
        }
        if (pageFiles.length === 0)
          throw new Error("No XML pages found in VSDX.");
        let shapes = [];
        let pageEdges = [];
        for (const pageFile of pageFiles) {
          try {
            const pageContent = await zip.file(pageFile).async("text");
            const parser = new XMLParser({
              ignoreAttributes: false,
              attributeNamePrefix: "@_",
              allowBooleanAttributes: true,
              parseNodeValue: true,
              parseAttributeValue: true,
              trimValues: true,
            });
            const pageJson = parser.parse(pageContent);
            let currentShapes = [];
            if (pageJson.PageContents?.Shapes?.Shape)
              currentShapes = toArray(pageJson.PageContents.Shapes.Shape);
            else if (pageJson.Shapes?.Shape)
              currentShapes = toArray(pageJson.Shapes.Shape);
            else if (pageJson.Shape) currentShapes = toArray(pageJson.Shape);
            else if (pageJson.VisioDocument?.Pages?.Page) {
              const pages = toArray(pageJson.VisioDocument.Pages.Page);
              if (pages[0]?.Shapes?.Shape)
                currentShapes = toArray(pages[0].Shapes.Shape);
            }

            if (currentShapes.length) {
              shapes = normalizeShapes(currentShapes);

              // edges
              if (pageJson.PageContents?.Connects?.Connect) {
                const connects = toArray(
                  pageJson.PageContents.Connects.Connect
                );
                pageEdges = connects
                  .map((c) => {
                    const from = String(
                      c?.["@_FromSheet"] ?? c?.FromSheet ?? ""
                    );
                    const to = String(c?.["@_ToSheet"] ?? c?.ToSheet ?? "");
                    return from && to ? { from, to } : null;
                  })
                  .filter(Boolean);
              } else if (pageJson.Connects?.Connect) {
                const connects = toArray(pageJson.Connects.Connect);
                pageEdges = connects
                  .map((c) => {
                    const from = String(
                      c?.["@_FromSheet"] ?? c?.FromSheet ?? ""
                    );
                    const to = String(c?.["@_ToSheet"] ?? c?.ToSheet ?? "");
                    return from && to ? { from, to } : null;
                  })
                  .filter(Boolean);
              }
              // Log swimlanes (heading + content) for VSDX uploads
              try {
                const laneNodes = (shapes || []).filter((s) => s.isLane);
                if (laneNodes.length) {
                  const lanes = laneNodes
                    .slice()
                    .sort((a, b) => (a.bounds?.top || 0) - (b.bounds?.top || 0))
                    .map((ln, i) => ({
                      id: ln.id,
                      name: ln.text || `Lane ${i + 1}`,
                      bounds: ln.bounds,
                    }));
                  const membersByLane = new Map(lanes.map((l) => [l.id, []]));
                  const memberNodes = (shapes || []).filter(
                    (n) => !n.isLane && !n.isLine
                  );
                  memberNodes.forEach((n) => {
                    const y = n.PinY;
                    const lane = lanes.find(
                      (ln) =>
                        ln.bounds && y >= ln.bounds.top && y <= ln.bounds.bottom
                    );
                    if (lane) membersByLane.get(lane.id).push(n);
                  });
                  console.group("VSDX Swimlanes");
                  lanes.forEach((ln) => {
                    const members = membersByLane.get(ln.id) || [];
                    console.group(`Lane: ${ln.name}`);
                    console.log("Heading:", ln.name);
                    console.log(
                      "Content:",
                      members.map((m) => m.text).filter(Boolean)
                    );
                    console.groupEnd();
                  });
                  console.groupEnd();
                }
              } catch (e) {
                // do not block import on logging errors
              }
              break; // we got content from a page
            }
          } catch {
            // try next file
          }
        }

        if (!shapes.length) throw new Error("No usable shapes in VSDX.");

        // prefer labeled rectangles; fallback: any non-line with ID
        // Keep all shapes to preserve events/gateways/lanes
        const edges = deriveEdges(shapes, pageEdges);
        xmlToImport = buildBPMN("Definitions_1", "Process_1", shapes, edges);
      } else if (file.name.toLowerCase().endsWith(".vdx")) {
        const fileContent = await file.text();
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_",
          allowBooleanAttributes: true,
        });
        const json = parser.parse(fileContent);
        const pages = toArray(json?.VisioDocument?.Pages?.Page);
        if (!pages.length) throw new Error("No pages found in VDX");
        const page = pages[0];
        const rawShapes = page?.Shapes?.Shape;
        if (!rawShapes) throw new Error("No shapes found in VDX");
        const shapes = normalizeShapes(rawShapes);
        const pageEdges = extractConnectsFromPage(page);
        // Keep all shapes to preserve events/gateways/lanes
        const edges = deriveEdges(shapes, pageEdges);
        xmlToImport = buildBPMN("Definitions_1", "Process_1", shapes, edges);
      } else {
        // .bpmn / .xml passthrough
        xmlToImport = await file.text();
      }

      if (!modelerRef.current) throw new Error("Modeler is not initialized");

      await modelerRef.current.importXML(xmlToImport);
      await modelerRef.current.get("canvas").zoom("fit-viewport", "auto");
      // NEW: fix lines after import
      orthogonalizeAllConnections(modelerRef.current);

      if (typeof setXml === "function") {
        setXml(xmlToImport);
        localStorage.setItem("TemplatebpmnXml", xmlToImport);
      }

      setTimeout(() => applyFontFamily(selectedFontFamily), 200);

      const canvas = modelerRef.current.get("canvas");
      canvas.zoom("fit-viewport", "auto");
    } catch (err) {
      console.error("File import error:", err);
      alert(err.message || "Failed to import file");
    } finally {
      if (event.target) event.target.value = "";
      setFileDialogOpened(false);
      fileDialogOpenedRef.current = false;
    }
  };

  return (
    <div>
      {/* Show banners and font family only for SOP Template */}
      {(SOPCreationType === "SOP Template" || selectedTemplate) && (
        <>
          {/* Heading Banner */}
          <div
            style={{
              width: "100vw",
              height: "150px",
              position: "relative",
              background: headingBanner ? "transparent" : "#f5f5f5",
              overflow: "hidden",
              marginBottom: "1rem",
              border: headingBanner ? "none" : "2px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {headingBanner ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setIsHeadingBannerHovered(true)}
                onMouseLeave={() => setIsHeadingBannerHovered(false)}
              >
                <img
                  src={headingBanner}
                  alt="Heading Banner"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* Delete overlay that appears on hover */}
                {isHeadingBannerHovered && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2,
                    }}
                  >
                    {!selectedTemplate && (
                      <button
                        style={{
                          background: "#ff4d4f",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 24px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "600",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          transition: "all 0.2s ease",
                        }}
                        onClick={removeHeadingBanner}
                      >
                        🗑️ {t("deleteBanner")}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <span style={{ color: "#666", fontSize: "14px" }}>
                  📸 {t("uploadHeadingBanner")}
                </span>
                <span style={{ color: "#999", fontSize: "12px" }}>
                  Max file size: 5MB
                </span>
                <Button
                  onClick={() => headingBannerInputRef.current?.click()}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    background: bgColor,
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {t("uploadHeadingBannerBtn")}
                </Button>
                <input
                  ref={headingBannerInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleBannerUpload(e, setHeadingBanner)}
                />
              </div>
            )}
          </div>

          {/* Font Family Selector and Import Button Container */}

          <CardContent
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              p: 2,
            }}
          >
            {!selectedTemplate ? (
              <FormControl size="small" sx={{ minWidth: 140, width: 160 }}>
                <InputLabel id="font-family-label">
                  {t("fontFamily")}
                </InputLabel>
                <Select
                  labelId="font-family-label"
                  value={selectedFontFamily}
                  onChange={handleFontFamilyChange}
                  label={t("fontFamily")}
                >
                  {fontFamilyOptions.map((font) => (
                    <MenuItem key={font.value} value={font.value}>
                      <Typography sx={{ fontFamily: font.value }}>
                        {font.label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography
                variant="body1"
                sx={{ fontFamily: selectedFontFamily, fontWeight: 500 }}
              >
                {t("usingTemplateFont")}: {selectedFontFamily}
              </Typography>
            )}
          </CardContent>
        </>
      )}

      {/* Import BPMN Button - show for Import BPMN type */}
      {SOPCreationType === "Import BPMN" && (
        <div style={{ margin: "1rem", marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => {
                if (fileInputRef.current) {
                  setFileDialogOpened(true);
                  fileInputRef.current.click();
                }
              }}
              style={{
                background: bgColor,
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Import BPMN / VDX / VSDX file
            </button>

            {/* Auto-arrange button */}
            {/* <button
              onClick={() => {
                if (modelerRef.current && modelerRef.current.autoLayout) {
                  modelerRef.current.autoLayout();
                }
              }}
              style={{
                background: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "14px",
              }}
              title="Automatically arrange nodes in a grid layout"
            >
              📐 Auto-Arrange Nodes
            </button> */}
          </div>

          {/* Instructions */}
          {/* <div
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
              fontSize: "14px",


              color: "#6c757d",
            }}
          >
            💡 <strong>Tip:</strong> After importing VSDX files, if nodes
            overlap, use "Auto-Arrange Nodes" or drag them manually to
            reposition.
          </div> */}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".bpmn,.xml,.vdx,.vsdx"
            style={{ display: "none" }}
            onChange={handleBpmnFileImport}
          />
        </div>
      )}

      <div ref={canvasRef} style={{ height: "70vh" }} />

      {showRoleTooltip && (
        <div
          ref={roleTooltipRef}
          className="role-tooltip"
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            zIndex: 1000,
            marginTop: "-10rem",
            marginLeft: "5rem",
          }}
        >
          <h3>{t("selectedRoles")}</h3>
          <ul>
            {hoveredRoles.map((role, index) => (
              <li key={index}>{role}</li>
            ))}
          </ul>
        </div>
      )}
      
      {isRoleModalOpen && (
        <div
          className="sidebar"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "300px",
            height: "100%",
            backgroundColor: "#fff",
            boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "center",
              height: "400px",
              position: "relative",
            }}
          >
            {/* Cancel Icon */}
            <div
              onClick={closeRoleModal}
              style={{
                position: "absolute",
                top: "60px",
                left: "-50px",
                cursor: "pointer",
                fontSize: "24px",
              }}
            >
              &times;
            </div>

            {/* Modal Heading */}
            <h3
              style={{
                marginBottom: "10px",
                marginTop: "3rem",
                marginLeft: "-25rem",
              }}
            >
              {t("allRoles")}
            </h3>

            {/* Divider */}
            <div
              className="divider"
              style={{
                borderBottom: "1px solid #d1d1d1",
                marginBottom: "20px",
              }}
            ></div>

            {/* Content */}
            <div style={{ maxHeight: "470px", overflowY: "auto" }}>
              {roles.length === 0 ? (
                <p>{t("noRoles")}</p>
              ) : (
                roles.map((role) => (
                  <div
                    key={role.RoleID}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.RoleID)}
                      onChange={() => handleRoleSelect(role.RoleID)}
                      style={{
                        marginRight: "10px",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <span>{role.RoleName}</span>
                  </div>
                ))
              )}
            </div>

            {/* Save Button */}
            <Box style={{ width: "230px" }}>
              <Button variant="contained" onClick={handleSaveRoles}>
                {t("save")}
              </Button>
            </Box>
          </div>
        </div>
      )}

      <div
        id="popup"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "none", // Hide by default
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            width: "500px",
            maxHeight: "600px",
            padding: "24px",
            position: "relative",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                marginTop: "-25px",
                marginLeft: "-10px",
                marginRight: "5px",
                display: "inline-block",
              }}
            >
              {/* <img
          src="https://img.icons8.com/ios-filled/50/4F46E5/link.png"
          alt="Avatar"
          width="20"
          style={{ verticalAlign: "middle" }}
        /> */}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {t("manageLinks")}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#6B7280",
                  }}
                >
                  {t("manageLinksDesc")}
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              height: "1px",
              backgroundColor: "#E5E7EB",
              margin: "0 -24px 20px -24px",
            }}
          ></div>

          <div style={{ position: "relative", marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <b
                style={{
                  fontSize: "14px",
                  color: "#374151",
                  fontWeight: "600",
                }}
              >
                {t("chooseLinks")}
              </b>
              <button
                onClick={handleCountClick}
                style={{
                  background: bgColor,
                  color: "#ffffff",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  outline: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                }}
              >
                {selectedelement ? selectedelement?.length : 0} {t("selected")}
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search Links"
                value={searchString}
                onChange={(event) => handleSearch(event.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "40px",
                  paddingRight: "12px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  borderRadius: "8px",
                  border: "2px solid #E5E7EB",
                  height: "44px",
                  boxSizing: "border-box",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  backgroundColor: "#F9FAFB",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.backgroundColor = "#ffffff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.backgroundColor = "#F9FAFB";
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                  fontSize: "16px",
                }}
              >
                🔍
              </span>
            </div>
          </div>

          <div
            style={{
              overflowY: "auto",
              maxHeight: "300px",
              paddingRight: "8px",
              marginRight: "-8px",
            }}
          >
            {elemetList?.map((element) => (
              <div key={element.IdName + element.ContentLink}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 0",
                    borderRadius: "8px",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#F3F4F6";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <img
                    src={
                      element?.ContentLinkType === "sop"
                        ? SopsfileIcon
                        : element?.ContentLinkType === "doc"
                        ? BookOpen
                        : element?.ContentLinkType === "trs"
                        ? VideoIcon
                        : element?.ContentLinkType === "tes"
                        ? MonitorIcon
                        : element?.ContentLinkType === "mcq"
                        ? EditIcon
                        : element?.ContentLinkType === "link"
                        ? LinkIcon
                        : ""
                    }
                    alt="File Icon"
                    style={{
                      width:
                        element?.ContentLinkType === "link" ? "20px" : "32px",
                      height:
                        element?.ContentLinkType === "link" ? "20px" : "32px",
                      flexShrink: 0,
                    }}
                  />

                  <p
                    style={{
                      marginLeft: "12px",
                      margin: 0,
                      fontSize: "14px",
                      color: "#374151",
                      flex: 1,
                      fontWeight: "500",
                    }}
                  >
                    {element?.ContentLinkTitle}
                  </p>

                  <input
                    type="checkbox"
                    checked={element?.IsSelect}
                    onChange={(e) => {
                      handleSelectedElement(e, element);
                    }}
                    style={{
                      marginLeft: "auto",
                      height: "20px",
                      width: "20px",
                      cursor: "pointer",
                      accentColor: "#667eea",
                    }}
                  />
                </div>
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#F3F4F6",
                    margin: "0",
                  }}
                ></div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={closePopup}
              style={{
                backgroundColor: "#F3F4F6",
                color: "#374151",
                border: "2px solid #E5E7EB",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                outline: "none",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#E5E7EB";
                e.target.style.borderColor = "#D1D5DB";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#F3F4F6";
                e.target.style.borderColor = "#E5E7EB";
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              style={{
                background: bgColor,
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                outline: "none",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      <LinkPopUp
        isOpen={isPopupOpen}
        onClose={togglePopup}
        onSave={handleSave}
      />

      {/* Footer Banner */}
      {(SOPCreationType === "SOP Template" || selectedTemplate) && (
        <div
          style={{
            width: "100vw",
            height: "150px",
            position: "relative",
            background: footerBanner ? "transparent" : "#f5f5f5",
            overflow: "hidden",
            marginTop: "1rem",
            border: footerBanner ? "none" : "2px dashed #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {footerBanner ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                cursor: "pointer",
              }}
              onMouseEnter={() => setIsFooterBannerHovered(true)}
              onMouseLeave={() => setIsFooterBannerHovered(false)}
            >
              <img
                src={footerBanner}
                alt="Footer Banner"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {/* Delete overlay that appears on hover */}
              {isFooterBannerHovered && (
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                  }}
                >
                  {!selectedTemplate && (
                    <button
                      style={{
                        background: "#ff4d4f",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 24px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        transition: "all 0.2s ease",
                      }}
                      onClick={removeFooterBanner}
                    >
                      🗑️ {t("deleteBanner")}
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <span style={{ color: "#666", fontSize: "14px" }}>
                📸 {t("uploadFooterBanner")}
              </span>
              <span style={{ color: "#999", fontSize: "12px" }}>
                Max file size: 5MB
              </span>
              <Button
                onClick={() => footerBannerInputRef.current?.click()}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  background: bgColor,
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                }}
              >
                {t("uploadFooterBannerBtn")}
              </Button>
              <input
                ref={footerBannerInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleBannerUpload(e, setFooterBanner)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
