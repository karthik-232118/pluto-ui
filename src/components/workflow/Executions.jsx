import React, { useState, useEffect, useRef } from "react";
import { ReactFlow, Controls, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DnDProvider } from "./DnDContext";
import RightSidebar from "./Services";
import {
  Backdrop,
  Box,
  Chip,
  Dialog,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  ExecuteFlowHistoryToGetData,
  // GettflowById,
  openSidbar,
  UpdateExecutionHistory,
  ExecutionRetry,
  ExecuteFlow,
} from "../../store/flow/action";
import { useParams } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Output from "./output/Output";
// import { updateConfigData } from "../../store/flow/slice";
import "./flow.css";
import {
  convertToDaysAndHours,
  dateformatter,
  getStatus,
  getStatusStyle,
} from "../../utils";
import WorkflowHeader from "./WorkflowHeader";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import DynamicDragDrop from "./DynamicDragDrop";
import Pageloader from "../../assets/image/cubeloader1.gif";
import ShapesNode from "./ShapesNode";
import WorkflowDetails from "./WorkFlowStepDetails";
// import ReplayIcon from "@mui/icons-material/Replay";
import { updateConfig } from "../../store/flow/slice";
import { FaAngleRight } from "react-icons/fa6";
import OutputNodeForIF from "./OutputNodeForIF";
import StartAndNode from "./StartAndNode";
import { FaRedo } from "react-icons/fa";
import { io } from "socket.io-client";
import { FLOW_BASE_URL } from "../../config/urlConfig";

// import { Start } from "@mui/icons-material";
const nodeTypes = {
  Start: StartAndNode,
  End: StartAndNode,
  Yes: OutputNodeForIF,
  No: OutputNodeForIF,
  Email: DynamicDragDrop,
  "Email Custom API Call": DynamicDragDrop,
  "Webhook - Call Rest API/Webhook": DynamicDragDrop,
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
};

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

function Executions() {
  const [nodes, setNodes] = useState([]); // Initialize nodes as an empty array
  const [edges, setEdges] = useState([]); // Initialize edges as an empty array
  const [open, setOpen] = React.useState(false);
  const ref = useRef(false);
  const {
    getflowdatafromId,
    executeFlowData,
    executionHistoryData,
    exicutionLoading,
  } = useSelector((state) => state.workflow); // Redux state for flow data
  const params = useParams();
  const dispatch = useDispatch();
  // const theme = useTheme(); // Access the theme for primary color
  const [flowhistory, setflowhistory] = useState({}); // State to manage active tab
  const configData = useSelector((state) => state.workflow.configData);
  const { executionFlowData } = useSelector((state) => state.workflow);
  const [flowData, setFlowData] = useState(null);
  const [historyLength, setHistoryLength] = useState(0);
  const intervalRef = useRef(null);
  const handleOncClick = (flow) => {
    // clearInterval(intervalRef.current);
    dispatch(
      UpdateExecutionHistory({
        ExecutionFlowID: flow.ExecutionFlowID,
      })
    );
    // intervalRef.current = setInterval(() => {
    //   dispatch(
    //     UpdateExecutionHistory({
    //       ExecutionFlowID: flow.ExecutionFlowID,
    //     })
    //   );
    // }, 30000);
  };
  useEffect(() => {
    // return () => clearInterval(intervalRef.current);
  }, []);
  async function updateInitialFlowData() {
    const data = {};
    for await (const el of executionFlowData?.flow[0].Flow.Details) {
      data[el.ShapeID] = el.DetailsProperties;
    }
    dispatch(updateConfig(data));
  }
  useEffect(() => {
    if (executionFlowData?.flow?.length > 0) {
      if (flowData && historyLength === executionFlowData?.flow?.length) {
        for (const item of executionFlowData?.flow) {
          if (item.ExecutionFlowID === flowData.ExecutionFlowID) {
            setFlowData(item);
          }
        }
      } else {
        setFlowData(executionFlowData?.flow[0]);
      }
      updateInitialFlowData();
    }
  }, [executionFlowData]);
  useEffect(() => {
    if (executeFlowData?.executionFlow) {
      setFlowData(executeFlowData?.executionFlow);
    }
  }, [executeFlowData?.executionFlow]);
  // Fetch flow data when component is mounted or params.id changes

  const executeFlow = async () => {
    if (!ref.current) {
      ref.current = true;
      await dispatch(
        ExecuteFlow({
          FlowID: params.id,
          CreatedBy: localStorage.getItem("user_id"),
        })
      );
      await dispatch(
        ExecuteFlowHistoryToGetData({
          FlowID: params?.id,
        })
      );
    }
  };
  useEffect(() => {
    executeFlow();
  }, [params?.id]);
  useEffect(() => {
    if (flowData?.Flow) {
      // Process FlowNodePositionDetails
      if (flowData?.Flow?.FlowNodePositionDetails) {
        const transformedNodes = flowData.Flow.FlowNodePositionDetails.map(
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

      // Process FlowNodeEdgesDetails
      if (flowData?.Flow?.FlowNodeEdgesDetails) {
        const transformedEdges = flowData.Flow.FlowNodeEdgesDetails.map(
          (edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type,
            animated: edge.animated || false,
            label: edge.label || "",
            sourceHandle: edge.sourceHandle || null,
          })
        );
        setEdges(transformedEdges);
      }
    } else {
      if (getflowdatafromId?.FlowNodeEdgesDetails) {
        const transformedEdges = getflowdatafromId?.FlowNodeEdgesDetails?.map(
          (edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type,
            animated: edge.animated || false,
            label: edge.label || "",
            sourceHandle: edge.sourceHandle || null,
          })
        );
        setEdges(transformedEdges);
      }
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
    }
  }, [flowData, getflowdatafromId]); // Trigger when flow data changesc

  const handleRetryExecution = async () => {
    await dispatch(
      ExecutionRetry({
        FlowID: params?.id,
      })
    );
  };
  useEffect(() => {
    const socket = io(FLOW_BASE_URL, {
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
    socket.on("connect", () => {
      console.log("socket connected");
      socket.emit("register", params.id);
    });
    socket.on("flowExecutionUpdate", (payload) => {
      dispatch(
        ExecuteFlowHistoryToGetData({
          FlowID: params?.id,
        })
      );
    });
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
    return () => socket.disconnect();
  }, []);
  return (
    <div className="flowpage">
      <div className="flow-page-header-warpper">
        {exicutionLoading && (
          <Backdrop
            sx={(theme) => ({
              color: "#fff",
              zIndex: theme.zIndex.drawer + 1,
            })}
            open={exicutionLoading}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={Pageloader}
                alt="loader"
                style={{ height: "25%", width: "25%" }}
              />
            </div>
          </Backdrop>
        )}
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
              TAT :{" "}
              <b>
                {flowData?.EndDate
                  ? convertToDaysAndHours(
                      (new Date(flowData?.EndDate).getTime() -
                        new Date(flowData?.StartDate).getTime()) /
                        1000
                    )
                  : convertToDaysAndHours(
                      (new Date().getTime() -
                        new Date(flowData?.StartDate).getTime()) /
                        1000
                    ) || "00"}
              </b>
            </Typography>
          }
          // status={
          //   <Box marginTop={1}>
          //     <BorderLinearProgress
          //       variant="determinate"
          //       value={
          //         100 * (flowData?.CompletedStepCount / flowData?.TotalSteps)
          //       }
          //     />
          //     <Box
          //       display={"flex"}
          //       justifyContent={"center"}
          //       marginTop={1}
          //       textAlign={"center"}
          //     >
          //       <Typography className="sub_variant">
          //         Completed:{" "}
          //         <b>
          //           {flowData?.CompletedStepCount || 0}/{" "}
          //           {flowData?.TotalSteps || 0}
          //         </b>
          //       </Typography>
          //     </Box>
          //   </Box>
          // }
          flowdata={getflowdatafromId}
        />
        <div style={{ display: "flex", flex: 1 }}>
          <List
            sx={{
              height: "77vh",
              background: (theme) => theme.palette.background.paper,
              borderTop: "1px solid #ccc", // Border color and thickness
              overflowY: "auto",
              scrollbarWidth: "thin", // Hide scrollbar for Firefox
            }}
          >
            {executionFlowData?.flow?.map((step, stepIndex) => (
              <ListItem
                key={stepIndex}
                sx={{
                  borderBottom: "1px solid", // Border color and thickness
                  borderColor: (theme) => theme.palette.divider, // Use theme's divider color for the border
                  borderRadius: "0",
                  padding: "10px 16px", // Remove default padding (optional)
                  cursor: "pointer",
                }}
              >
                <ListItemText>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        my: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={500}
                        marginBottom={1}
                      >
                        {step?.FlowName}
                      </Typography>
                      <Chip
                        label={"Version : " + (step?.Version || 0)}
                        size="small"
                        color="primary"
                      />
                    </Box>
                    <Box
                      sx={getStatusStyle(step?.Status)}
                      onClick={() => {
                        handleOncClick(step);
                      }}
                    >
                      {step?.Status}
                      <img src={getStatus(step?.Status)} alt={step?.Status} />
                    </Box>
                    <Typography variant="caption">
                      {dateformatter(step?.StartDate)}
                    </Typography>
                  </Box>
                </ListItemText>
                <IconButton>
                  <FaAngleRight sx={{ fontSize: 14 }} />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <div
            className="reactflow-wrapper"
            style={{ flex: 1, position: "relative", height: "77vh" }}
          >
            <Fab
              sx={{
                position: "absolute",
                left: "10px",
                top: "10px",
              }}
              color="warning"
              size="small"
            >
              <Tooltip title="Retry Execution" TransitionComponent={Zoom}>
                <IconButton
                  onClick={handleRetryExecution}
                  size="small"
                  color="primary"
                >
                  <FaRedo />
                </IconButton>
              </Tooltip>
            </Fab>
            {!exicutionLoading && (
              <ReactFlow
                nodes={exicutionLoading ? [] : nodes}
                edges={exicutionLoading ? [] : edges}
                fitView
                nodeTypes={nodeTypes}
                proOptions={{ hideAttribution: true }}
                onNodeClick={(event, node) => {
                  dispatch(
                    openSidbar({
                      name: null,
                      open: false,
                      id: node.id,
                    })
                  );
                  setOpen(true);
                }}
              >
                <Controls />
              </ReactFlow>
            )}
          </div>
        </div>
      </div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={exicutionLoading}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={Pageloader}
            alt="loader"
            style={{ height: "25%", width: "25%" }}
          />
        </div>
      </Backdrop>
      <WorkflowDetails
        executionFlowId={flowData?.ExecutionFlowID}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}
const Execution = () => (
  <ReactFlowProvider>
    <DnDProvider>
      <Executions />
    </DnDProvider>
  </ReactFlowProvider>
);
export default Execution;
