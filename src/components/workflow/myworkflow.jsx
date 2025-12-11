import React, { useState, useEffect } from "react";
import { ReactFlow, Controls, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DnDProvider } from "./DnDContext";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { GetMyWorkFlow } from "../../store/flow/action";
import { styled } from "@mui/material/styles";
import Output from "./output/Output";
import "./flow.css";
import RightSideRunflow from "./RunTheWorkFlow/RightSideRunflow";
import WorkflowHeader from "./WorkflowHeader";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import DynamicDragDrop from "./DynamicDragDrop";
import ShapesNode from "./ShapesNode";
import OutputNodeForIF from "./OutputNodeForIF";
import StartAndNode from "./StartAndNode";
import AccessDenied from "../accessDenied/AccessDenied";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  width: "300px",
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.primary.main.hover,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
}));

const nodeTypes = {
  Start: StartAndNode,
  End: StartAndNode,
  Yes: OutputNodeForIF,
  No: OutputNodeForIF,
  Email: DynamicDragDrop,
  "Email Custom API Call": DynamicDragDrop,
  "Human Input": DynamicDragDrop,
  "Create Form": DynamicDragDrop,
  "If Else Clause": DynamicDragDrop,
  "Image Helper": DynamicDragDrop,
  "CSV (Convert CSV to JSON)": DynamicDragDrop,
  "CSV (Convert JSON to CSV)": DynamicDragDrop,
  Concatenation: DynamicDragDrop,
  Split: DynamicDragDrop,
  "Remove HTML": DynamicDragDrop,
  Replace: DynamicDragDrop,
  Find: DynamicDragDrop,
  Output: Output,
  "External Forms": DynamicDragDrop,
  diamond: ShapesNode,
  circle: ShapesNode,
  cylinder: ShapesNode,
  "round-rectangle": ShapesNode,
  darkcircle: ShapesNode,
  doubleC: ShapesNode,
  "Call Rest API": DynamicDragDrop,
};

function Myworkflow() {
  const [nodes, setNodes] = useState([]); // Initialize nodes as an empty array
  const [edges, setEdges] = useState([]); // Initialize edges as an empty array
  const [flowhistory, setFlowHistory] = useState({}); // State to manage active tab
  const dispatch = useDispatch();
  const { getflowdatafromId, executeFlowData } = useSelector(
    (state) => state.workflow
  );
  const exicutionLoading = false; // loading status from store or state
  const configData = {};

  useEffect(() => {
    // If execution data is available and we're not loading, transform and set nodes/edges
    if (!exicutionLoading) {
      if (getflowdatafromId?.FlowNodePositionDetails) {
        const transformedNodes = getflowdatafromId?.FlowNodePositionDetails.map(
          (node) => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: {
              label: node.data.label || "No Label", // Default label if none exists
              StepStatus: node.data.StepStatus,
            },
          })
        );
        setNodes(transformedNodes);
      }

      if (getflowdatafromId?.FlowNodeEdgesDetails) {
        const transformedEdges = getflowdatafromId.FlowNodeEdgesDetails.map(
          (edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type,
            animated: edge.animated || false,
            label: edge.label || "",
          })
        );
        setEdges(transformedEdges);
      }
    }
  }, [exicutionLoading, getflowdatafromId, executeFlowData]);

  useEffect(() => {
    dispatch(GetMyWorkFlow());
  }, [dispatch]);

  const userType = localStorage.getItem("user_type");
  if (userType === "Admin" || userType === "ProcessOwner") {
    return <AccessDenied />;
  }

  return (
    <div className="flowpage">
      <div className="flow-page-header-warpper">
        <WorkflowHeader
          configData={configData}
          saveAction={
            <Typography
              sx={{
                backgroundColor: "#FBBF24",
                color: "#000",
                borderRadius: "22px",
                height: "32px",
                padding: "8px",
                textAlign: "center",
                fontSize: "16px",
              }}
            >
              TAT : <b>0 min</b>
            </Typography>
          }
          status={
            <Box marginTop={1}>
              <BorderLinearProgress
                variant="determinate"
                value={
                  100 *
                  (flowhistory?.CompletedStepCount / flowhistory?.TotalSteps)
                }
              />
              <Box
                display={"flex"}
                justifyContent={"center"}
                marginTop={1}
                textAlign={"center"}
              >
                <Typography className="sub_variant">
                  Completed:{" "}
                  <b>
                    {flowhistory?.CompletedStepCount || 0}/{" "}
                    {flowhistory?.TotalSteps || 0}
                  </b>
                </Typography>
              </Box>
            </Box>
          }
          flowdata={getflowdatafromId}
        />
        <div
          style={{
            display: "flex",
            height: "75vh",
            flexDirection: "row",
            // gap: "2rem",
          }}
        >
          {/* <div
            style={{ flex: "0 0 240px", maxWidth: "240px", padding: "10px" }}
          > */}
          <RightSideRunflow />
          {/* </div> */}
          <div className="reactflow-wrapper">
            {getflowdatafromId?.Details?.length > 0 && !exicutionLoading && (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                nodeTypes={nodeTypes}
                proOptions={{ hideAttribution: true }}
              >
                <Controls />
              </ReactFlow>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <Myworkflow />
    </DnDProvider>
  </ReactFlowProvider>
);
