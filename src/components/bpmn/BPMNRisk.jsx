import { useEffect, useRef, useState } from "react";
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { useSelector } from "react-redux";
import { ClauseModal } from "./ClauseModal";
import { ClipsModal } from "./ClipsModal";
import "./BPMN.css";
import PropTypes from "prop-types";

function generateBpmnXmlWithColors(sopFlow) {
  const { Nodes = [], Edges = [] } = sopFlow || {};
  if (!Nodes.length || !Edges.length) return initialBpmnXml;
  const bpmnElements = [];
  const bpmnShapes = [];
  const bpmnFlows = [];
  const bpmnEdges = [];

  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0"
    id="Definitions_${Date.now()}"
    targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    ${bpmnElements.join("\n")}
    ${bpmnFlows.join("\n")}
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      ${bpmnShapes.join("\n")}
      ${bpmnEdges.join("\n")}
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
}

const initialBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0"
  id="Definitions_1"
  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

export default function BPMNRisk({
  sopDetails,
  selectedSopData,
  onLabeledElements,
  selectedIds,
}) {
  const fullscreenRef = useRef(null);
  const canvasRef = useRef(null);
  const viewerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentID] = useState(null);
  const [isClipsModalOpen, setIsClipsModalOpen] = useState(false);
  const [clipsData, setClipsData] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { SOPReactFlow } = useSelector((state) => state.SOPReactFlow);
  const flowData = SOPReactFlow?.sopModuleDraft?.SopFlow;

  const highlightElements = () => {
    if (!viewerRef.current || !selectedIds || !Array.isArray(selectedIds))
      return;

    const canvas = viewerRef.current.get("canvas");
    const elementRegistry = viewerRef.current.get("elementRegistry");

    // Remove previous highlights
    elementRegistry.getAll().forEach((element) => {
      canvas.removeMarker(element.id, "highlight");
    });

    // Add highlight marker to selected elements
    selectedIds.forEach((id) => {
      const element = elementRegistry.get(id);
      if (element) {
        canvas.addMarker(id, "highlight");
      }
    });
  };

  const logAllLabels = (viewer) => {
    if (!viewer) return;

    const elementRegistry = viewer.get("elementRegistry");
    const elements = elementRegistry.getAll();

    const labeledElements = elements
      .filter(
        (element) => element.businessObject && element.businessObject.name
      )
      .map((element) => ({
        id: element.id,
        type: element.type,
        name: element.businessObject.name,
      }));

    console.log("All labeled elements:", labeledElements);
    onLabeledElements(labeledElements);
  };

  useEffect(() => {
    if (!viewerRef.current) {
      viewerRef.current = new BpmnViewer({
        container: canvasRef.current,
        height: "100%",
        width: "100%",
      });
    }

    const loadDiagram = async () => {
      try {
        let bpmnXml;

        if (selectedSopData?.SOPXMLElement) {
          bpmnXml = selectedSopData.SOPXMLElement;
        } else if (sopDetails?.SOPXMLElement) {
          bpmnXml = sopDetails.SOPXMLElement;
        } else if (flowData) {
          bpmnXml = generateBpmnXmlWithColors(flowData);
        } else {
          bpmnXml = initialBpmnXml;
        }

        await viewerRef.current.importXML(bpmnXml);
        viewerRef.current.get("canvas").zoom("fit-viewport");

        const defs = document.querySelector("svg defs");
        if (defs) {
          defs.remove();
        }

        logAllLabels(viewerRef.current);
        highlightElements();
        enableFullLabelTooltips(viewerRef.current);

        if (flowData) {
          attachClipIcons(flowData, openClipsModal);
          attachImageOverlays(flowData);
        }
      } catch (err) {
        console.error("Error rendering BPMN diagram:", err);
      }
    };

    loadDiagram();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [selectedSopData?.SOPXMLElement, sopDetails?.SOPXMLElement, flowData]);

  useEffect(() => {
    if (viewerRef.current) {
      highlightElements();
    }
  }, [selectedIds]);

  const enterFullscreen = () => {
    if (fullscreenRef.current) {
      fullscreenRef.current.requestFullscreen().catch((err) => {
        console.error("Error going fullscreen:", err);
      });
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Error exiting fullscreen:", err);
      });
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const zoomIn = () => {
    if (viewerRef.current) {
      const canvas = viewerRef.current.get("canvas");
      const currentZoom = canvas.zoom();
      canvas.zoom(Math.min(currentZoom * 1.2, 3.0)); // Limit max zoom to 3.0
    }
  };

  const zoomOut = () => {
    if (viewerRef.current) {
      const canvas = viewerRef.current.get("canvas");
      const currentZoom = canvas.zoom();
      canvas.zoom(Math.max(currentZoom * 0.8, 0.2)); // Limit min zoom to 0.2
    }
  };

  const resetZoom = () => {
    if (viewerRef.current) {
      viewerRef.current.get("canvas").zoom("fit-viewport");
    }
  };

  const openClipsModal = (clipsArray) => {
    setClipsData(clipsArray);
    setIsClipsModalOpen(true);
  };

  const closeClipsModal = () => {
    setIsClipsModalOpen(false);
    setClipsData([]);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div
      ref={fullscreenRef}
      style={{
        position: "relative",
        width: "850px",
        height: "200px",
        margin: "0",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          zIndex: 10,
          display: "flex",
          flexDirection: "column", 
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column", 
            gap: "5px",
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "4px",
            padding: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
        >
          <button
            onClick={zoomIn}
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              padding: "5px 10px",
              fontSize: "14px",
            }}
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={zoomOut}
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              padding: "5px 10px",
              fontSize: "14px",
            }}
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={resetZoom}
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              padding: "5px 10px",
              fontSize: "12px",
            }}
            title="Reset Zoom"
          >
            ↻
          </button>
        </div>

        {/* Fullscreen Button */}
        <button
          style={{
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
            padding: "8px 12px",
          }}
          onClick={isFullscreen ? exitFullscreen : enterFullscreen}
        >
          {isFullscreen ? "X" : "⛶"}
        </button>
      </div>

      <div
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      />
      <ClauseModal
        open={isModalOpen}
        onClose={closeModal}
        contentID={contentID}
      />
      <ClipsModal
        open={isClipsModalOpen}
        onClose={closeClipsModal}
        clips={clipsData}
      />
    </div>
  );
}

function enableFullLabelTooltips() {
}

function attachClipIcons() {
}

function attachImageOverlays() {
}

BPMNRisk.propTypes = {
  sopDetails: PropTypes.object,
  selectedSopData: PropTypes.object,
  onLabeledElements: PropTypes.func.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
};
BPMNRisk.defaultProps = {
  sopDetails: null,
  selectedSopData: null,
  selectedIds: [],
};
