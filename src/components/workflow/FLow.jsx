import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  useReactFlow,
  ReactFlowProvider,
  // reconnectEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Sidebar from "./Sidebar";
import { DnDProvider, useDnD } from "./DnDContext";
import RightSidebar from "./Services";
import { useDispatch, useSelector } from "react-redux";
import { GettflowById, GetUserList } from "../../store/flow/action";
import {
  updateConfigData,
  UpdateEdgesData,
  UpdateNodesData,
  updatePropsData,
} from "../../store/flow/slice";
import { useParams } from "react-router-dom";
// import Output from "./output/Output";
// import { updateConfigData, UpdateEdgesData } from "../../store/flow/slice";
import "./flow.css";
// import ShapesNode from "./ShapesNode";
import ElementServices from "./ElementServices";
import DynamicDragDrop from "./DynamicDragDrop";
import StartAndNode from "./StartAndNode";
import WorkflowHeader from "./WorkflowHeader";
// import DataTableType from "./dataTable/DataTableType";
import CustomEdge from "./CustomEdges";
import { Backdrop } from "@mui/material";
import Pageloader from "../../assets/image/cubeloader.gif";
import OutputNodeForIF from "./OutputNodeForIF";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  Email : DynamicDragDrop,
  "Email Custom API Call": DynamicDragDrop,
  "HTTP Call": DynamicDragDrop,
  "Human Input": DynamicDragDrop,
  "Create Form": DynamicDragDrop,
  "External Forms": DynamicDragDrop,
  "If Else Clause" : DynamicDragDrop,
  "Image Helper": DynamicDragDrop,
  "CSV (Convert CSV to JSON)": DynamicDragDrop,
  "CSV (Convert JSON to CSV)": DynamicDragDrop,
  Concatenation: DynamicDragDrop,
  Split: DynamicDragDrop,
  "Remove HTML": DynamicDragDrop,
  Replace: DynamicDragDrop,
  Find: DynamicDragDrop,
  "Call Rest API": DynamicDragDrop,
  Start: StartAndNode,
  End: StartAndNode,
  Yes: OutputNodeForIF,
  No: OutputNodeForIF,
};
const edgeTypes = {
  button: CustomEdge,
  step_button: CustomEdge,
};

function Flow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const { screenToFlowPosition } = useReactFlow();
  const { open } = useSelector((state) => state.workflow.data);
  const {
    getallservices,
    getflowdatafromId,
    userList,
    exicutionLoading,
    allNodes,
    allEdges,
  } = useSelector((state) => state.workflow);
  const configData = useSelector((state) => state.workflow.configData);
  const [type] = useDnD();
  const params = useParams();
  const dispatch = useDispatch();

  // Handler to change the active tab
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  useEffect(() => {
    dispatch(
      GettflowById({
        FlowID: params?.id,
      })
    );
  }, [params?.id, dispatch]);

  useEffect(() => {
    setNodes(allNodes);
  }, [allNodes]);
  useEffect(() => {
    setEdges(allEdges);
  }, [allEdges]);

  useEffect(() => {
    const containerWidth =
      document.querySelector(".reactflow-wrapper").offsetWidth;

    // Calculate the center position for the Start node
    const startNodePosition = {
      x: containerWidth / 2, // Center horizontally
      y: 0, // Keep it at the top (y=0)
    };

    // Define the nodes
    let startNode = {
      id: `start-${new Date().getTime()}`,
      type: "Start",
      position: startNodePosition, // Centered horizontally, top vertically
      data: { label: "Start" },
    };
    dispatch(
      updateConfigData({
        id: startNode.id,
        value: {},
      })
    );

    let endNode = {
      id: `end-${new Date().getTime()}`,
      type: "End",
      position: { x: containerWidth / 2, y: 100 }, // Centered horizontally, bottom vertically
      data: { label: "End" },
    };

    // Nodes array
    const newnodes = [startNode, endNode];

    // Create edges
    const newedgs = [
      {
        id: `edge-${startNode.id}-${endNode.id}`,
        source: startNode.id,
        sourceHandle: "d",
        targetHandle: "b",
        target: endNode.id,
        type: "button", // Or specify a custom edge type
      },
    ];

    // Handle additional flow edges from the data, if available

    if (
      getflowdatafromId?.FlowNodeEdgesDetails != null &&
      getflowdatafromId?.FlowNodeEdgesDetails !== undefined
    ) {
      const transformedEdges = getflowdatafromId.FlowNodeEdgesDetails.map(
        (edge) => ({
          id: edge?.id,
          source: edge?.source,
          target: edge?.target,
          type: edge?.type,
          animated: edge?.animated || false,
          label: edge?.label || "",
          sourceHandle: edge?.sourceHandle || null,
        })
      );
      dispatch(UpdateEdgesData(transformedEdges));
    } else {
      dispatch(UpdateEdgesData(newedgs));
    }

    if (
      getflowdatafromId?.FlowNodePositionDetails != null &&
      getflowdatafromId?.FlowNodePositionDetails !== undefined
    ) {
      const transformedNodes = getflowdatafromId.FlowNodePositionDetails.map(
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
      dispatch(UpdateNodesData(transformedNodes)); // Changed to UpdateNodesData
    } else {
      for (const element of newnodes) {
        dispatch(
          updateConfigData({
            id: element.id,
            value: {
              title: element.type,
              type: element.type,
            },
          })
        );
      }
      dispatch(UpdateNodesData([...newnodes])); // Changed to UpdateNodeData
    }

    // Update config data if needed
    if (getflowdatafromId?.Details) {
      getflowdatafromId.Details.forEach((el) => {
        dispatch(
          updateConfigData({
            id: el?.ShapeID,
            value: el?.DetailsProperties,
          })
        );
      });
    }
  }, [getflowdatafromId, params?.id, exicutionLoading]);

  useEffect(() => {
    if (!userList.length) {
      dispatch(
        GetUserList({
          SearchString: "",
          Limit: 1000,
          Page: 1,
        })
      );
    }
  }, []);
  // const onEdgeClick = (e, edges) => {};
  const proOptions = { hideAttribution: true };
  return (
    <div>
      <div className="flowpage">
        <div className="flow-page-header-warpper">
          <WorkflowHeader
            flowdata={getflowdatafromId}
            configData={configData}
            saveAction={null}
          />

          <div style={{ display: "flex", flex: 1 }}>
            {/* <Sidebar /> */}
            <div
              className="reactflow-wrapper"
              style={{
                flex: 1,
                position: "relative",
                width: "100%",
                scrollbarWidth: "none", // Hide scrollbar for Firefox
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
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
              {!exicutionLoading && (
                <ReactFlow
                  nodes={exicutionLoading ? [] : nodes}
                  edges={exicutionLoading ? [] : edges}
                  fitView
                  nodeTypes={nodeTypes}
                  proOptions={proOptions}
                  edgeTypes={edgeTypes}
                >
                  <Controls />
                </ReactFlow>
              )}
            </div>
            <RightSidebar
              open={open}
              nodes={nodes}
              edges={edges}
              configData={configData}
            />
            <ElementServices />
          </div>
        </div>
      </div>
    </div>
  );
}

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <Flow />
    </DnDProvider>
  </ReactFlowProvider>
);
