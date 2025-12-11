import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  ReactFlow,
  Controls,
  ControlButton,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CloseIcon from "@mui/icons-material/Close";
import DragNode from "../questions/DragNode";
import ResizableNode from "../questions/ResizableNode";
import DiamondNode from "../questions/DiamondNode";
import { DnDProvider } from "../questions/DnDContext";
import {
  ViewSOPReactFlowVesrionOne,
  ViewSOPReactFlowVersionTwo,
} from "../../../services/SOPReactFlow/SOPReactFlow";
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

const defaultEdgeOptions = {
  style: {
    stroke: "#b1b1b7",
    strokeWidth: 2,
  },
  markerEnd: {
    type: "arrowclosed",
    color: "#b1b1b7",
  },
};

function FlowDiagram({ nodes, edges, height = 500 }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const openFullscreen = () => setIsFullscreen(true);
  const closeFullscreen = () => setIsFullscreen(false);

  return (
    <>
      <Box
        sx={{
          height,
          border: "1px solid #ddd",
          borderRadius: "4px",
          boxShadow: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionMode={ConnectionMode.Loose}
          proOptions={{ hideAttribution: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <Controls showZoom showFitView={false} showInteractive={false}>
            <ControlButton onClick={openFullscreen} title="Enter Fullscreen">
              ⛶
            </ControlButton>
          </Controls>
        </ReactFlow>
      </Box>
      <Dialog
        fullScreen
        open={isFullscreen}
        onClose={closeFullscreen}
        PaperProps={{ style: { height: "100%", margin: 0, borderRadius: 0 } }}
      >
        <Box sx={{ height: "100%", position: "relative" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionMode={ConnectionMode.Loose}
            proOptions={{ hideAttribution: true }}
            style={{ width: "100%", height: "100%" }}
          >
            <Controls showZoom showFitView={false} showInteractive={false}>
              <ControlButton onClick={closeFullscreen} title="Exit Fullscreen">
                ✕
              </ControlButton>
            </Controls>
          </ReactFlow>
        </Box>
      </Dialog>
    </>
  );
}

FlowDiagram.propTypes = {
  nodes: PropTypes.array.isRequired,
  edges: PropTypes.array.isRequired,
  height: PropTypes.number,
};

function CompareSOPModal({ open, onClose }) {
  const { elementsDocumentFiles } = useSelector((state) => state.elements);
  const presistStore = useSelector((state) => state.sidebarstate || {});
  const history = elementsDocumentFiles?.details?.History || [];
  const [versionLeft, setVersionLeft] = useState("");
  const [versionRight, setVersionRight] = useState("");
  const [loadingLeft, setLoadingLeft] = useState(false);
  const [loadingRight, setLoadingRight] = useState(false);
  const [leftNodes, setLeftNodes] = useState([]);
  const [leftEdges, setLeftEdges] = useState([]);
  const [rightNodes, setRightNodes] = useState([]);
  const [rightEdges, setRightEdges] = useState([]);

  // Filter history to only include items with MasterVersion
  const masterVersions = useMemo(() => {
    return history.filter((item) => item.MasterVersion !== null);
  }, [history]);

  // Sort by MasterVersion numerically
  const sortedMasterVersions = useMemo(() => {
    return [...masterVersions].sort(
      (a, b) => parseFloat(a.MasterVersion) - parseFloat(b.MasterVersion)
    );
  }, [masterVersions]);

  useEffect(() => {
    if (sortedMasterVersions.length > 0) {
      setVersionLeft(sortedMasterVersions[0].SOPID);
      setVersionRight(sortedMasterVersions[0].SOPID);
    }
  }, [sortedMasterVersions]);

  const convertSopFlowToElements = (sopFlow) => {
    if (!sopFlow) return { nodes: [], edges: [] };
    const nodes = (sopFlow.Nodes || []).map((node) => {
      let apiType = node.data?.shapeType;
      if (!apiType || !(apiType in nodeTypes)) {
        apiType = "Node";
      }
      return {
        id: node.id,
        data: {
          label: node.data?.title || apiType,
          type: apiType,
        },
        type: apiType,
        position: node.position,
        style: {},
      };
    });
    const edges = (sopFlow.Edges || []).map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type || "step",
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    }));
    return { nodes, edges };
  };

  useEffect(() => {
    if (!versionLeft) return;
    setLoadingLeft(true);
    const payloadLeft = {
      SOPID: versionLeft,
      ContentID: presistStore.ContentID || "",
      ModuleTypeID: presistStore.ModuleTypeID || "",
    };
    ViewSOPReactFlowVesrionOne(payloadLeft)
      .then((res) => {
        const sopFlow = res?.data?.data?.sopModuleDraft?.SopFlow;
        const { nodes, edges } = convertSopFlowToElements(sopFlow);
        setLeftNodes(nodes);
        setLeftEdges(edges);
      })
      .catch((err) => console.error("Left API Error:", err))
      .finally(() => setLoadingLeft(false));
  }, [versionLeft, presistStore]);

  useEffect(() => {
    if (!versionRight) return;
    setLoadingRight(true);
    const payloadRight = {
      SOPID: versionRight,
      ContentID: presistStore.ContentID || "",
      ModuleTypeID: presistStore.ModuleTypeID || "",
    };
    ViewSOPReactFlowVersionTwo(payloadRight)
      .then((res) => {
        const sopFlow = res?.data?.data?.sopModuleDraft?.SopFlow;
        const { nodes, edges } = convertSopFlowToElements(sopFlow);
        setRightNodes(nodes);
        setRightEdges(edges);
      })
      .catch((err) => console.error("Right API Error:", err))
      .finally(() => setLoadingRight(false));
  }, [versionRight, presistStore]);

  const comparedLeftNodes = useMemo(() => {
    if (!leftNodes.length || !rightNodes.length) return leftNodes;
    const rightIds = new Set(rightNodes.map((n) => n.id));
    return leftNodes.map((n) => {
      if (!rightIds.has(n.id)) {
        return {
          ...n,
          data: {
            ...n.data,
            label: (
              <div style={{ textAlign: "center" }}>
                {n.data.label}
                <div style={{ fontSize: "10px", color: "#fff", marginTop: 4 }}>
                  - removed
                </div>
              </div>
            ),
          },
          style: {
            ...n.style,
            backgroundColor: "red",
          },
        };
      }
      return n;
    });
  }, [leftNodes, rightNodes]);

  const comparedRightNodes = useMemo(() => {
    if (!leftNodes.length || !rightNodes.length) return rightNodes;
    const leftIds = new Set(leftNodes.map((n) => n.id));
    return rightNodes.map((n) => {
      if (!leftIds.has(n.id)) {
        return {
          ...n,
          data: {
            ...n.data,
            label: (
              <div style={{ textAlign: "center" }}>
                {n.data.label}
                <div style={{ fontSize: "10px", color: "#fff", marginTop: 4 }}>
                  + added
                </div>
              </div>
            ),
          },
          style: {
            ...n.style,
            backgroundColor: "green",
          },
        };
      }
      return n;
    });
  }, [leftNodes, rightNodes]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 1200,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            backgroundColor: "#127ddb",
            p: "0.4rem",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              mb: "0.5rem",
              fontWeight: 400,
              fontSize: "15px",
              ml: "1rem",
              mt: "0.3rem",
            }}
          >
            Compare SOPs
          </Typography>
          <CloseIcon
            style={{
              marginTop: "-20px",
              marginRight: "-5px",
              cursor: "pointer",
              color: "#fff",
            }}
            onClick={onClose}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", p: 2 }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel sx={{ fontSize: "12px" }}>Version</InputLabel>
              <Select
                value={versionLeft}
                label="Version"
                onChange={(e) => setVersionLeft(e.target.value)}
                sx={{ height: "35px", fontSize: "12px" }}
                disabled={sortedMasterVersions.length === 0}
              >
                {sortedMasterVersions.map((item) => (
                  <MenuItem key={item.SOPID} value={item.SOPID}>
                    Version {item.MasterVersion}
                  </MenuItem>
                ))}
                {sortedMasterVersions.length === 0 && (
                  <MenuItem disabled>No Master Versions Available</MenuItem>
                )}
              </Select>
            </FormControl>
            {loadingLeft ? (
              <Box
                sx={{
                  height: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : sortedMasterVersions.length > 0 ? (
              <FlowDiagram
                nodes={comparedLeftNodes}
                edges={leftEdges}
                height={500}
              />
            ) : (
              <Box
                sx={{
                  height: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  color: "#666",
                }}
              >
                No Master Version diagram to display
              </Box>
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel sx={{ fontSize: "12px" }}>Version</InputLabel>
              <Select
                value={versionRight}
                label="Version"
                onChange={(e) => setVersionRight(e.target.value)}
                sx={{ height: "35px", fontSize: "12px" }}
                disabled={sortedMasterVersions.length === 0}
              >
                {sortedMasterVersions.map((item) => (
                  <MenuItem key={item.SOPID} value={item.SOPID}>
                    Version {item.MasterVersion}
                  </MenuItem>
                ))}
                {sortedMasterVersions.length === 0 && (
                  <MenuItem disabled>No Master Versions Available</MenuItem>
                )}
              </Select>
            </FormControl>
            {loadingRight ? (
              <Box
                sx={{
                  height: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : sortedMasterVersions.length > 0 ? (
              <FlowDiagram
                nodes={comparedRightNodes}
                edges={rightEdges}
                height={500}
              />
            ) : (
              <Box
                sx={{
                  height: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  color: "#666",
                }}
              >
                No Master Version diagram to display
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

const WrappedFlowDiagram = (props) => (
  <DnDProvider>
    <CompareSOPModal {...props} />
  </DnDProvider>
);

export default WrappedFlowDiagram;

CompareSOPModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  Historydata: PropTypes.array.isRequired,
};
WrappedFlowDiagram.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  Historydata: PropTypes.array.isRequired,
};
WrappedFlowDiagram.displayName = "CompareSOPModal";
WrappedFlowDiagram.displayName = "WrappedFlowDiagram";
