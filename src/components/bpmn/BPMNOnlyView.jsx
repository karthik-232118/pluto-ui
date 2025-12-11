import React, { useRef, useState, useEffect, useCallback } from "react";
import BpmnViewer from "bpmn-js/lib/Viewer";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

const initialBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="start"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="170" y="160" width="36" height="36"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

const BPMNOnlyView = () => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [status, setStatus] = useState("Ready");

  // Load initial diagram
  useEffect(() => {
    if (!canvasRef.current) return;
    const v = new BpmnViewer({
      container: canvasRef.current,
      keyboard: { bindTo: document },
    });
    setViewer(v);

    (async () => {
      try {
        await v.importXML(initialBpmnXml);
        v.get("canvas").zoom("fit-viewport", "auto");
        setStatus("Loaded default diagram");
      } catch (err) {
        setStatus("Import error");
      }
    })();

    return () => {
      try {
        v.destroy();
      } catch {}
    };
  }, []);

  // Import XML from file
  const readFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const importXML = useCallback(
    async (xmlText) => {
      if (!viewer || !xmlText) return;
      try {
        await viewer.importXML(xmlText);
        viewer.get("canvas").zoom("fit-viewport", "auto");
        setStatus("Diagram imported");
      } catch (err) {
        setStatus("Import error: check XML");
      }
    },
    [viewer]
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

  // Drag and drop support
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

  // Fit view button
  const fitView = useCallback(() => {
    if (!viewer) return;
    try {
      viewer.get("canvas").zoom("fit-viewport");
    } catch {}
  }, [viewer]);

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
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 rounded-xl shadow text-sm border hover:shadow-md"
          type="button"
        >
          Import XML
        </button>
        <button
          onClick={fitView}
          className="px-3 py-2 rounded-xl shadow text-sm border hover:shadow-md"
          type="button"
        >
          Fit View
        </button>
      </div>
      {status && (
        <div style={{ fontSize: 12, color: "#4b5563", marginTop: 8 }}>
          Status: {status}
        </div>
      )}
    </div>
  );
};

export default BPMNOnlyView;
