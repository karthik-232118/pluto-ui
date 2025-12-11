import { useEffect, useRef, useState, useCallback } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

import inherits from "inherits";
import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";
import { PDFDocument, rgb } from "pdf-lib"; // Add this import for PDF generation

/* -------------------- Custom move rules (no re-parent) -------------------- */
function CustomMoveRules(eventBus) {
  RuleProvider.call(this, eventBus);
}
inherits(CustomMoveRules, RuleProvider);
CustomMoveRules.$inject = ["eventBus"];
CustomMoveRules.prototype.init = function () {
  this.addRule("elements.move", 1500, function (context) {
    const { target, shapes } = context;
    if (!shapes || !shapes.length) return true;
    const originalParent = shapes[0].parent;
    if (!originalParent) return true;
    if (!target) return { target: originalParent };
    if (target.id !== originalParent.id) return false;
    return true;
  });
  this.addRule("shape.create", 1500, function (context) {
    const { target } = context;
    return !!target;
  });
};
const CustomMoveRulesModule = {
  __init__: ["customMoveRules"],
  customMoveRules: ["type", CustomMoveRules],
};

const initialBpmnXml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
      <bpmn:process id="Process_1" isExecutable="false" />
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
      </bpmndi:BPMNDiagram>
    </bpmn:definitions>
    `;

function looksLikeBase64Xml(s) {
  if (!s || typeof s !== "string") return false;
  if (s.startsWith("PD94")) return true;
  if (s.trim().startsWith("<")) return false;
  if (s.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/=]+$/.test(s);
}

function base64ToUtf8(b64) {
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    try {
      return decodeURIComponent(escape(atob(b64)));
    } catch {
      return null;
    }
  }
}

function getLanguageFromStorage() {
  // Check for language in localStorage - supports multiple possible keys
  const lang =
    localStorage.getItem("lang") ||
    localStorage.getItem("selectedLanguage") ||
    "";
  return lang.trim().toLowerCase();
}

function langKey(lang) {
  return lang === "icelandic" ? "bpmn_xml_icelandic" : "bpmn_xml";
}

function getDecodedXmlFromLS(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  if (looksLikeBase64Xml(raw)) {
    const decoded = base64ToUtf8(raw);
    return decoded && decoded.trim().length ? decoded : null;
  }
  return raw;
}

/**
 * Main function to get XML based on your requirements:
 * - If language data exists in localStorage, use localStorage XML
 * - Otherwise, fall back to props data
 */
function getXmlSource(props) {
  const lang = getLanguageFromStorage();
  const key = langKey(lang);
  const localStorageXml = getDecodedXmlFromLS(key);

  // If we have XML for the current language in localStorage, use it
  if (localStorageXml && localStorageXml.trim()) {
    return {
      source: "localStorage",
      lang,
      xml: localStorageXml,
    };
  }

  // Otherwise, use props data
  const propsXml =
    props.bpmnXml || props.SOPData?.SOPXMLElement || initialBpmnXml;
  return {
    source: "props",
    lang,
    xml: propsXml,
  };
}

function saveXmlToLocalStorage(lang, xml) {
  try {
    localStorage.setItem(langKey(lang), xml);
    console.log(`Saved XML to localStorage for language: ${lang}`);
  } catch (err) {
    console.error("Failed to save XML to localStorage:", err);
  }
}

/* -------------------- misc helpers -------------------- */
function getAncestorSubProcessIds(element) {
  const ids = [];
  let cur = element?.parent;
  while (cur) {
    if (cur.type === "bpmn:SubProcess") ids.unshift(cur.id);
    cur = cur.parent;
  }
  return ids;
}

function persistDragContext(element) {
  if (!element) return;
  const chain = getAncestorSubProcessIds(element);
  const payload = {
    at: Date.now(),
    elementId: element.id,
    parentId: element.parent?.id || null,
    subprocessChain: chain,
  };
  try {
    localStorage.setItem("bpmn_last_nested_path", JSON.stringify(payload));
  } catch {}
}

function addPinOverlay(m, elementId, _presetLinks = null) {
  if (!m) return;
  const overlays = m.get("overlays");
  const move = m.get("move");
  const elementRegistry = m.get("elementRegistry");
  const el = elementRegistry.get(elementId);
  if (!el) return;

  if (!addPinOverlay._idsByEl) addPinOverlay._idsByEl = {};
  const idsByEl = addPinOverlay._idsByEl;
  if (idsByEl[elementId]) {
    try {
      overlays.remove(idsByEl[elementId]);
    } catch {}
    delete idsByEl[elementId];
  }

  const root = document.createElement("div");
  root.style.pointerEvents = "none";
  root.style.display = "flex";

  const btn = document.createElement("div");
  btn.style.pointerEvents = "auto";
  btn.style.width = "22px";
  btn.style.height = "22px";
  btn.style.borderRadius = "6px";
  btn.style.background = "#22242a";
  btn.style.border = "1px solid #909194";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.cursor = "grab";
  btn.style.userSelect = "none";
  btn.title = "Open Content / Drag shape";
  btn.innerHTML = "📎";

  let dragged = false;

  btn.addEventListener("mousedown", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    dragged = false;

    const onMove = () => (dragged = true);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (!dragged) {
        // Handle pin click if needed
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    persistDragContext(el);
    move.start(ev, el);
  });

  root.appendChild(btn);

  const oid = overlays.add(el, {
    position: { right: -6, top: -6 },
    html: root,
  });
  idsByEl[elementId] = oid;
}

/* -------------------- Main Component -------------------- */
export default function BPMNAdminWithAI(props) {
  const {
    SOPData,
    setXml,
    modelerRef,
    bpmnXml,
    selectedElementRef = useRef({}),
    // Include all other props you might need
    shapeDetails,
    setShapeDetails,
    selectedelement,
    setSelectedElement,
    setSopDraftData,
    onRoleDetailsSave,
    TemplateHeader,
    TemplateFooter,
    TemplateFontFamly,
    setTemplateHeader,
    setTemplateFooter,
    setTemplateFontFamly,
  } = props;

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [modeler, setModeler] = useState(null);
  const [status, setStatus] = useState("Ready");
  const [dataSource, setDataSource] = useState("unknown");

  const currentXmlRef = useRef("");
  const currentLangRef = useRef("");

  console.log("Props bpmnXml:", bpmnXml);
  console.log("SOPData:", SOPData);

  /* -------------------- Initial modeler setup -------------------- */
  useEffect(() => {
    if (!canvasRef.current) return;

    const m = new BpmnModeler({
      container: canvasRef.current,
      keyboard: { bindTo: document },
      additionalModules: [CustomMoveRulesModule],
    });

    setModeler(m);
    if (modelerRef) modelerRef.current = m;

    (async () => {
      try {
        const xmlSource = getXmlSource(props);
        currentLangRef.current = xmlSource.lang;

        console.log(`Loading XML from: ${xmlSource.source}`, {
          language: xmlSource.lang,
          hasXml: !!xmlSource.xml,
        });

        await m.importXML(xmlSource.xml);
        m.get("canvas").zoom("fit-viewport", "auto");
        currentXmlRef.current = xmlSource.xml;
        setXml?.(xmlSource.xml);
        setDataSource(xmlSource.source);
        setStatus(`Loaded from ${xmlSource.source} (${xmlSource.lang})`);

        rebuildPinsFromProps(m, SOPData, selectedElementRef, addPinOverlay);
      } catch (err) {
        console.error("Initial import error", err);
        setStatus("Import error");
      }
    })();

    const eventBus = m.get("eventBus");
    const onDragStart = (e) => {
      const shapes = e?.context?.shapes;
      if (Array.isArray(shapes) && shapes.length) persistDragContext(shapes[0]);
    };
    eventBus.on("drag.start", onDragStart);
    const onMoveEnd = async () => {
      try {
        const { xml } = await m.saveXML({ format: true });
        currentXmlRef.current = xml;
        saveXmlToLocalStorage(currentLangRef.current, xml);
        setXml?.(xml);
        setDataSource("localStorage"); 
      } catch (err) {
        console.warn("Failed to save XML after move", err);
      }
    };
    eventBus.on("shape.move.end", onMoveEnd);
    eventBus.on("elements.move.end", onMoveEnd);
    const onChanged = async () => {
      try {
        const { xml } = await m.saveXML({ format: true });
        currentXmlRef.current = xml;
        saveXmlToLocalStorage(currentLangRef.current, xml);
        setXml?.(xml);
        setDataSource("localStorage");
      } catch (err) {
        console.warn("Failed to save XML after change", err);
      }
    };
    eventBus.on("commandStack.changed", onChanged);
    const onResize = () => {
      try {
        m.get("canvas").resized();
      } catch {}
    };
    window.addEventListener("resize", onResize);
    const reimportForLangChange = async () => {
      const newLang = getLanguageFromStorage();
      if (newLang === currentLangRef.current) return;

      console.log(
        `Language changed from ${currentLangRef.current} to ${newLang}`
      );
      const xmlSource = getXmlSource(props);
      try {
        await m.importXML(xmlSource.xml);
        m.get("canvas").zoom("fit-viewport", "auto");
        currentLangRef.current = xmlSource.lang;
        currentXmlRef.current = xmlSource.xml;
        setXml?.(xmlSource.xml);
        setDataSource(xmlSource.source);
        setStatus(
          `Language switched to ${xmlSource.lang} (${xmlSource.source})`
        );

        rebuildPinsFromProps(m, SOPData, selectedElementRef, addPinOverlay);
      } catch (err) {
        console.error("Language change import failed", err);
        setStatus("Language import failed");
      }
    };
    const onStorage = (e) => {
      if (e.key === "lang" || e.key === "selectedLanguage") {
        reimportForLangChange();
      }
    };
    window.addEventListener("storage", onStorage);
    const interval = setInterval(reimportForLangChange, 1000);
    return () => {
      try {
        eventBus.off("drag.start", onDragStart);
        eventBus.off("shape.move.end", onMoveEnd);
        eventBus.off("elements.move.end", onMoveEnd);
        eventBus.off("commandStack.changed", onChanged);
      } catch {}
      window.removeEventListener("resize", onResize);
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
      try {
        m.destroy();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!modeler) return;
    if (dataSource === "props") {
      const xmlSource = getXmlSource(props);
      if (xmlSource.xml !== currentXmlRef.current) {
        (async () => {
          try {
            await modeler.importXML(xmlSource.xml);
            modeler.get("canvas").zoom("fit-viewport", "auto");
            currentXmlRef.current = xmlSource.xml;
            setXml?.(xmlSource.xml);
            setStatus(`Props updated (${xmlSource.lang})`);
            rebuildPinsFromProps(
              modeler,
              SOPData,
              selectedElementRef,
              addPinOverlay
            );
          } catch (err) {
            console.error("Props update import failed", err);
          }
        })();
      }
    }
  }, [
    bpmnXml,
    SOPData,
    modeler,
    dataSource,
    setXml,
    selectedElementRef,
    props,
  ]);
  const fitView = useCallback(() => {
    if (!modeler) return;
    try {
      modeler.get("canvas").zoom("fit-viewport");
    } catch {}
  }, [modeler]);

  const readFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const importXML = useCallback(
    async (xmlText) => {
      if (!modeler || !xmlText) return;
      try {
        await modeler.importXML(xmlText);
        fitView();
        setStatus("Diagram imported");
        currentXmlRef.current = xmlText;
        saveXmlToLocalStorage(currentLangRef.current, xmlText);
        setXml?.(xmlText);
        setDataSource("localStorage");

        const map = selectedElementRef.current || {};
        Object.keys(map).forEach((elId) =>
          addPinOverlay(modeler, elId, map[elId])
        );
      } catch (err) {
        console.error(err);
        setStatus("Import error: check XML");
      }
    },
    [modeler, fitView, setXml, selectedElementRef]
  );

  const openXML = useCallback(
    async (evt) => {
      const file = evt?.target?.files?.[0];
      if (!file) return;
      try {
        const text = await readFile(file);
        await importXML(text);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [importXML]
  );

  const download = (name, data, type) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const saveXMLToFile = useCallback(async () => {
    if (!modeler) return;
    try {
      const { xml } = await modeler.saveXML({ format: true });
      download("diagram.bpmn", xml, "application/xml");
      setStatus("XML exported");
    } catch (err) {
      console.error(err);
      setStatus("Failed to export XML");
    }
  }, [modeler]);

  const saveSVGToFile = useCallback(async () => {
    if (!modeler) return;
    try {
      const { svg } = await modeler.saveSVG();
      download("diagram.svg", svg, "image/svg+xml");
      setStatus("SVG exported");
    } catch (err) {
      console.error(err);
      setStatus("Failed to export SVG");
    }
  }, [modeler]);

  const saveDiagramAsPDF = useCallback(async () => {
    if (!modeler) return;
    try {
      const elementRegistry = modeler.get("elementRegistry");
      const modeling = modeler.get("modeling");
      const canvas = modeler.get("canvas");

      // Get all subprocesses
      const subprocesses = elementRegistry.filter(
        (element) => element.type === "bpmn:SubProcess"
      );

      // Store original collapsed state
      const originalStates = {};
      subprocesses.forEach((subprocess) => {
        originalStates[subprocess.id] =
          subprocess.businessObject.di?.isExpanded;
      });

      // Expand all subprocesses
      subprocesses.forEach((subprocess) => {
        try {
          modeling.updateProperties(subprocess, {
            isExpanded: true,
          });
          canvas.addMarker(subprocess, "expanded");
          canvas.removeMarker(subprocess, "collapsed");
        } catch (err) {
          console.warn(`Failed to expand subprocess ${subprocess.id}`, err);
        }
      });

      // Force a re-render to ensure all elements are visible
      setTimeout(async () => {
        try {
          // Generate the SVG of the diagram
          const { svg } = await modeler.saveSVG();

          // Create a new PDF document
          const pdfDoc = await PDFDocument.create();

          // Parse SVG to get dimensions
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svg, "image/svg+xml");
          const svgElement = svgDoc.documentElement;

          // Get SVG dimensions
          const viewBox = svgElement.getAttribute("viewBox");
          let svgWidth, svgHeight;

          if (viewBox) {
            const viewBoxValues = viewBox.split(" ").map(Number);
            svgWidth = viewBoxValues[2];
            svgHeight = viewBoxValues[3];
          } else {
            svgWidth = Number(svgElement.getAttribute("width") || 1000);
            svgHeight = Number(svgElement.getAttribute("height") || 1000);
          }

          // Calculate PDF page size with some margin
          const margin = 50;
          const pageWidth = svgWidth + margin * 2;
          const pageHeight = svgHeight + margin * 2;

          // Add page with calculated dimensions
          const page = pdfDoc.addPage([pageWidth, pageHeight]);

          // Convert SVG to PNG
          const svgBlob = new Blob([svg], { type: "image/svg+xml" });
          const svgUrl = URL.createObjectURL(svgBlob);

          const img = new Image();
          img.src = svgUrl;

          await new Promise((resolve) => {
            img.onload = async () => {
              try {
                // Create canvas to render the SVG
                const canvas = document.createElement("canvas");
                canvas.width = svgWidth;
                canvas.height = svgHeight;
                const ctx = canvas.getContext("2d");

                // Draw SVG to canvas
                ctx.drawImage(img, 0, 0, svgWidth, svgHeight);

                // Convert canvas to PNG image data
                const pngDataUrl = canvas.toDataURL("image/png");
                const pngResponse = await fetch(pngDataUrl);
                const pngBuffer = await pngResponse.arrayBuffer();

                // Embed PNG in PDF
                const pngImage = await pdfDoc.embedPng(pngBuffer);

                // Draw image on PDF page
                page.drawImage(pngImage, {
                  x: margin,
                  y: margin,
                  width: svgWidth,
                  height: svgHeight,
                });

                // Save and download the PDF
                const pdfBytes = await pdfDoc.save();
                download("diagram.pdf", pdfBytes, "application/pdf");
                setStatus("PDF exported");

                // Restore original collapsed states
                subprocesses.forEach((subprocess) => {
                  try {
                    modeling.updateProperties(subprocess, {
                      isExpanded: originalStates[subprocess.id],
                    });

                    if (originalStates[subprocess.id]) {
                      canvas.addMarker(subprocess, "expanded");
                      canvas.removeMarker(subprocess, "collapsed");
                    } else {
                      canvas.addMarker(subprocess, "collapsed");
                      canvas.removeMarker(subprocess, "expanded");
                    }
                  } catch (err) {
                    console.warn(
                      `Failed to restore subprocess ${subprocess.id}`,
                      err
                    );
                  }
                });

                resolve();
              } catch (err) {
                console.error("Error creating PDF:", err);
                setStatus("Failed to export PDF");
                resolve();
              } finally {
                URL.revokeObjectURL(svgUrl);
              }
            };

            img.onerror = () => {
              console.error("Failed to load SVG image");
              setStatus("Failed to export PDF");
              URL.revokeObjectURL(svgUrl);
              resolve();
            };
          });
        } catch (err) {
          console.error("PDF export failed:", err);
          setStatus("Failed to export PDF");
        }
      }, 100); // Small timeout to ensure DOM updates
    } catch (err) {
      console.error("PDF export failed:", err);
      setStatus("Failed to export PDF");
    }
  }, [modeler]);

  // Helper function to convert an SVG image to PNG
  async function fetchImageAsPng(image) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsArrayBuffer(blob);
      }, "image/png");
    });
  }

  /* -------------------- Subprocess collapse toggle -------------------- */
  const toggleCollapseSafe = useCallback(
    (element, collapseTo) => {
      if (!modeler || !element) return;
      const modeling = modeler.get("modeling");
      const di = element.businessObject?.di;

      if (typeof modeling?.toggleCollapse === "function") {
        if (typeof collapseTo === "boolean") {
          const isExpandedNow = !!di?.isExpanded;
          if (collapseTo === !isExpandedNow) modeling.toggleCollapse(element);
        } else {
          modeling.toggleCollapse(element);
        }
        return;
      }

      if (di) di.isExpanded = !(di?.isExpanded ?? true);
      try {
        const canvas = modeler.get("canvas");
        const gfx = modeler.get("elementRegistry").getGraphics(element);
        modeler.get("graphicsFactory").update("shape", element, gfx);
        canvas.addMarker(element, di?.isExpanded ? "expanded" : "collapsed");
        canvas.removeMarker(element, di?.isExpanded ? "collapsed" : "expanded");
      } catch {}
    },
    [modeler]
  );

  useEffect(() => {
    if (!modeler) return;
    const eventBus = modeler.get("eventBus");
    const handler = (e) => {
      const el = e?.element;
      if (el?.type === "bpmn:SubProcess") toggleCollapseSafe(el);
    };
    eventBus.on("element.dblclick", handler);
    return () => eventBus.off("element.dblclick", handler);
  }, [modeler, toggleCollapseSafe]);

  /* -------------------- Drag and drop file import -------------------- */
  const [dragOver, setDragOver] = useState(false);
  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);
  const onDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const text = await readFile(file);
      await importXML(text);
    }
  };

  return (
    <div style={{ padding: 16, background: "#f6f8fb", minHeight: "100vh" }}>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".bpmn,.xml"
          onChange={openXML}
          style={{ display: "none" }}
        />
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          position: "relative",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          height: "calc(100vh - 200px)",
          overflow: "hidden",
        }}
      >
        <div ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        {dragOver && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15, 23, 42, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 16,
              backdropFilter: "blur(1px)",
            }}
          >
            Drop a .bpmn / .xml file to import
          </div>
        )}
      </div>

  
    </div>
  );
}

/* -------------------- Rebuild pins from SOPData -------------------- */
function rebuildPinsFromProps(
  modeler,
  SOPData,
  selectedElementRef,
  addPinOverlayFn
) {
  if (!SOPData?.SopDetails?.length) return;

  const shapeWithLink = {};
  for (const el of SOPData.SopDetails) {
    const links = (el.SopAttachmentLinks || []).map((e) => ({
      SopShapeID: el.SopShapeID,
      ContentLinkTitle: e.ContentLinkTitle,
      ContentLink: e.ContentLink,
      ContentLinkType: e.ContentLinkType,
    }));

    const element = modeler.get("elementRegistry").get(el.SopShapeID);
    if (element) {
      shapeWithLink[el.SopShapeID] = links;
      addPinOverlayFn(modeler, el.SopShapeID, links);
    }
  }
  selectedElementRef.current = shapeWithLink;
}
