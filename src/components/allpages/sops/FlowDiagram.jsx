import  { useState, useEffect, useRef } from "react";
import {
  ReactFlow,
  Controls,
  ControlButton,
  MarkerType,
  ConnectionMode,
} from "@xyflow/react";
import Dialog from "@mui/material/Dialog";
import { DnDProvider } from "../questions/DnDContext";
import DragNode from "../questions/DragNode";
import DiamondNode from "../questions/DiamondNode";
import ResizableNode from "../questions/ResizableNode";
import "@xyflow/react/dist/style.css";
import PropTypes from "prop-types";

const nodeTypes = {
  comment: ResizableNode,
  diamond: DiamondNode,
  Start: DragNode,
  End: DragNode,
  Node: DragNode,
  "create-task": DragNode,
  Email: DragNode,
  "Email Custom API Call": DragNode,
  "Human Input": DragNode,
  "Create Form": DragNode,
  "If Else Clause": DragNode,
  "Image Helper": DragNode,
  "CSV (Convert CSV to JSON)": DragNode,
  "Call Rest API": DragNode,
  "CSV (Convert JSON to CSV)": DragNode,
  Concatenation: DragNode,
  Split: DragNode,
  "Remove HTML": DragNode,
  Replace: DragNode,
  Find: DragNode,
  Output: DragNode,
};

function FlowDiagram({
  sopXMLElement,
  nodes: propNodes,
  edges: propEdges,
 
}) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  const flowWrapperRef = useRef(null);

  console.log("FlowDiagram props:", { propNodes });

  const openFullScreenModal = async () => {
    if (document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.error("Error entering fullscreen mode:", err);
      }
    }
    setIsModalOpen(true);
  };

  const closeFullScreenModal = async () => {
    setIsModalOpen(false);
    if (document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("Error exiting fullscreen mode:", err);
      }
    }
  };

  useEffect(() => {
    setNodes([]);
    setEdges([]);
    setLoading(true); // Start loading

    const loadDiagramData = () => {
      if (propNodes && propEdges) {
        console.log("Node datasss:", propNodes);
        const updatedNodes = propNodes?.map((node) => ({
          id: node.id,
          type: node.type || "default",
          position: node.position,
          data: {
            ...node.data?.data,
            RiskIDs: node?.data?.RiskIDs, 
          },
        }));
        setNodes(updatedNodes);
        setEdges(propEdges);
      } else if (sopXMLElement) {
        // Handle BPMN parsing if needed
        // Example: parse XML and set nodes and edges
      }
      setLoading(false);
    };

    setTimeout(() => {
      loadDiagramData();
    }, 500); 
  }, [sopXMLElement, propNodes, propEdges]);
  console.log("FlowDiagram nodes:", nodes);
  const defaultEdgeOptions = {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#b1b1b7",
    },
  };

  return (
    <>
      <div
        ref={flowWrapperRef}
        className="reactflow-wrapper"
        style={{
          flex: 1,
          position: "relative",
          height: "76vh",
          border: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#555",
        }}
      >
        {loading ? (
          "Diagram is loading..."
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            nodeTypes={nodeTypes}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionMode={ConnectionMode.Loose}
          >
            <Controls
              showZoom={true}
              showFitView={false}
              showInteractive={false}
            >
              <ControlButton
                onClick={openFullScreenModal}
                title="Enter Fullscreen"
              >
                ⛶
              </ControlButton>
            </Controls>
          </ReactFlow>
        )}
      </div>
      <Dialog
        fullScreen
        open={isModalOpen}
        onClose={closeFullScreenModal}
        PaperProps={{
          style: { height: "100%", margin: 0, borderRadius: 0 },
        }}
      >
        <div style={{ height: "100%", position: "relative" }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Diagram is loading...
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              nodeTypes={nodeTypes}
              proOptions={{ hideAttribution: true }}
              defaultEdgeOptions={defaultEdgeOptions}
              connectionMode={ConnectionMode.Loose}
            >
              <Controls
                showZoom={true}
                showFitView={false}
                showInteractive={false}
              >
                <ControlButton
                  onClick={closeFullScreenModal}
                  title="Exit Fullscreen"
                >
                  ✕
                </ControlButton>
              </Controls>
            </ReactFlow>
          )}
        </div>
      </Dialog>
    </>
  );
}

FlowDiagram.propTypes = {
  sopXMLElement: PropTypes.string,
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string,
      position: PropTypes.object.isRequired,
      data: PropTypes.object.isRequired,
    })
  ),
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
      target: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ),
  executionLoading: PropTypes.bool,
};
FlowDiagram.defaultProps = {
  sopXMLElement: null,
  nodes: [],
  edges: [],
  executionLoading: false,
};



const WrappedFlowDiagram = (props) => (
  <DnDProvider>
    <FlowDiagram {...props} />
  </DnDProvider>
);

export default WrappedFlowDiagram;



