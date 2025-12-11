import React, { useState, useCallback, useEffect } from "react";
import { useReactFlow, useNodesData, useNodeConnections } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDispatch, useSelector } from "react-redux";
import { GetUserList, openSidbar } from "../../store/flow/action";
import { Box, styled, Typography } from "@mui/material";
import {
  updateConfigData,
  UpdateEdgesData,
  UpdateNodesData,
  updatePropsData,
} from "../../store/flow/slice";
import { Handle, Position } from "@xyflow/react";
import "./flow.css";
import { geticons, getStatus } from "../../utils";
import edit from "../../assets/svg/reactflow/edit.svg";
import trash from "../../assets/svg/reactflow/trash.svg";
import pin from "../../assets/svg/reactflow/pin.svg";
import copy from "../../assets/svg/reactflow/copy.svg";
import { useLocation } from "react-router";
import ForwardSharpIcon from "@mui/icons-material/ForwardSharp";
// import { updateEdge } from "react-flow-renderer";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#FFE4E4",
    color: "#DC2626",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

function DynamicDragDrop({
  id,
  type,
  isConnectable,
  data,
  target,
  source,
  // targetY,
}) {
  const configData = useSelector((state) => state.workflow.configData);
  const serviceList = useSelector((state) => state.workflow.getallservices);
  const flowDataById = useSelector((state) => state.workflow.getflowdatafromId);
  const [ServiceID, setServiceId] = useState("");
  const dataId = useSelector((state) => state.workflow.data.id);
  const startNodeId = useSelector((state) => state.workflow.startNodeId);
  const { userList } = useSelector((state) => state.workflow);
  const { getEdges, getNodes, screenToFlowPosition } = useReactFlow();
  const nodes = getNodes();
  const edges = getEdges();

  const dispatch = useDispatch();
  const { updateNodeData, getNode, addNodes, setNodes, setEdges } =
    useReactFlow();
  const location = useLocation();
  const connections = useNodeConnections({
    type: "target",
  });
  const nodesData = useNodesData(
    connections.map((connection) => connection.source)
  );

  // const isConnected = connections.some(
  //   (connection) => connection.source === id || connection.target === id
  // );
  useEffect(() => {
    const detail = flowDataById.Details?.find(
      (x) => x.ShapeID === id.toString()
    )?.DetailsProperties;
    if (detail) {
      dispatch(updateConfigData({ id, value: detail }));
    }
  }, [flowDataById, id]);

  useEffect(() => {
    for (const el of serviceList) {
      for (const item of el.ServiceElements) {
        if (item.ServiceElementName === type) {
          setServiceId(item.FlowServiceElementID);
        }
      }
    }
    if (!userList.length) {
      dispatch(
        GetUserList({
          SearchString: "",
          Limit: 1000,
          Page: 1,
        })
      );
    }
  }, [serviceList, type]);

  useEffect(() => {
    const parentIds = [];
    for (const el of nodesData) {
      if (el.data?.parentIds) parentIds.push(...el.data?.parentIds);
    }
    if (!parentIds.includes(id)) {
      updateNodeData(id, { parentIds: [id, ...parentIds] });
      if (nodesData.length) dispatch(updatePropsData({ id, value: nodesData }));
    }
  }, [nodesData]);

  useEffect(() => {
    if (!configData[id] && ServiceID) {
      const payload = { title: type, type, ServiceID };
      if (type === "Gmail") {
        payload["EmailRecipient"] = "";
        payload["EmailSubject"] = "";
        payload["BodyType"] = "text";
        payload["MessageBody"] = "";
        payload["CCEmails"] = [""];
        payload["BCCEmails"] = [""];
        payload["ActionRequired"] = false;
      }
      if (type === "Create Form") {
        payload["sharedFields"] = {
          [id]: [],
        };
      }
      dispatch(
        updateConfigData({
          id,
          value: payload,
        })
      );
    }
  }, [ServiceID]);

  const handleClikonedit = () => {
    dispatch(
      openSidbar({
        name: type,
        open: true,
        id,
      })
    );
  };

  const toggleSidebar = () => {
    dispatch(
      openSidbar({
        name: type,
        open: false,
        id: id,
      })
    );
  };

  const copyNode = async () => {
    toggleSidebar();
    // const edges = getEdges();
    const sourceNode = nodes.find((node) => node.id === id);
    const position = {
      x: sourceNode.position.x,
      y: sourceNode.position.y + 100,
    };
    // const sourceEdges = edges.find((edge) => edge.source === id);
    const newNode = {
      id: new Date().getTime().toString(),
      type: sourceNode.type,
      position,
      data: {
        label: `${sourceNode.type} node`,
        StepStatus: "default",
      },
    };
    let node = [];
    for (let element of JSON.parse(JSON.stringify(nodes))) {
      if (element.position.y >= newNode.position.y) {
        element.position.y = element.position.y + 100;
      }
      node.push(element);
    }
    node.push(newNode);

    if (sourceNode.type === "If Else Clause") {
      dispatch(
        updateConfigData({
          id: newNode.id + "Yes",
          value: {
            title: "Yes",
            type: "Yes",
          },
        })
      );
      node.push({
        id: newNode.id + "Yes",
        type: "Yes",
        position: {
          x: newNode.position.x - 140,
          y: newNode.position.y + 2,
        },
        data: {
          label: `${"yes"} node`,
          StepStatus: "default",
        },
      });
      dispatch(
        updateConfigData({
          id: newNode.id + "No",
          value: {
            title: "No",
            type: "No",
          },
        })
      );
      node.push({
        id: newNode.id + "No",
        type: "No",
        position: {
          x: newNode.position.x + 140,
          y: newNode.position.y + 2,
        },
        data: {
          label: `${"No"} node`,
          StepStatus: "default",
        },
      });
    }
    // const reqEdges = edges.filter((edge) => edge.source !== id);

    let newEdges = [
      {
        id: `xy-edge__${id}d-${newNode.id}b`,
        source: id,
        sourceHandle: "d",
        tagetHanlder: "b",
        target: newNode.id,
        type: "step_button",
      },
    ];
    if (sourceNode.type === "If Else Clause") {
      newEdges = [
        {
          id: `xy-edge__${id}Yesd-${newNode.id}b`,
          source: id + "Yes",
          sourceHandle: "d",
          tagetHanlder: "b",
          target: newNode.id,
          type: "step_button",
        },
      ];
      newEdges.push({
        id: `xy-edge__${newNode.id}b-${newNode.id}Yesyes`, // Connect Yes handle
        source: newNode.id,
        sourceHandle: `b`, // Match the ID of the "Yes" source handle
        target: `${newNode.id}Yes`,
        targetHandle: "c", // Example: target's "No" handle
      });

      newEdges.push({
        id: `xy-edge__${newNode.id}c-${newNode.id}Nono`, // Connect No handle
        source: newNode.id,
        sourceHandle: `c`, // Match the ID of the "No" source handle
        target: `${newNode.id}No`,
        targetHandle: `b`, // Example: target's "Yes" handle
      });
      newEdges.push({
        id: `xy-edge__${newNode.id}Nod-${nodes.find((x) => x.id.startsWith("end")).id
          }b`,
        source: `${newNode.id}No`,
        sourceHandle: "d",
        tagetHanlder: "b",
        target: nodes.find((x) => x.id.startsWith("end")).id,
        type: "step_button",
      });
    }
    const updatededges = JSON.parse(JSON.stringify(edges));
    for (const element of updatededges) {
      if (element.source === id) {
        if (type !== "If Else Clause") {
          element.source = newNode.id;
          element.id = element.id.replace(id, newNode.id);
        }
      } else if (element.source === id + "Yes") {
        element.source = newNode.id + "Yes";
      }
    }
   let newedgesaftermodify = [...updatededges, ...newEdges];
   let newnodesaftermodify = [...node]
    const stepWisePosition = async (edge) => {
      const sourceNode = await newnodesaftermodify.find(x => x.id === edge.source);
      const targetNode = await newnodesaftermodify.find(x => x.id === edge.target);
      const index = await newnodesaftermodify.findIndex(x => x.id === edge.target);
      if (targetNode.type === 'Yes' || targetNode.type === 'No') {
        newnodesaftermodify[index].position.y = sourceNode.position.y + 2;
      } else if (targetNode.type === 'End') {
        const endEdges = await newedgesaftermodify.filter(x => x.target === targetNode.id);
        const endEdgesSourceIds = [];
        for await (const el of endEdges) {
          const item = await newnodesaftermodify.find(x => x.id === el.source);
          if (item) {
            endEdgesSourceIds.push(item);
          }
        }
        const maxEntry = endEdgesSourceIds.reduce((max, item) => item.position.y > max.position.y ? item : max, endEdgesSourceIds[0]);
        console.log(maxEntry)
        newnodesaftermodify[index].position.y = maxEntry.position.y + 100;
      } else {
        newnodesaftermodify[index].position.y = sourceNode.position.y + 100;
      }
      const nextEdges = await newedgesaftermodify.filter(x => x.source === edge.target);
      for (const element of nextEdges) {
        console.log(element)
        await stepWisePosition(element);
      }
      return 'OK';
    }
    const startEdge = await newedgesaftermodify.find(x => x.source.includes('start'));
    console.log(startEdge);
    await stepWisePosition(startEdge);
    dispatch(UpdateNodesData(newnodesaftermodify));
    dispatch(UpdateEdgesData(newedgesaftermodify));
  };
  const deleteNode = useCallback(async () => {
    toggleSidebar();
    const newEdges = [];
    const currentNode = nodes.filter((node) => node.id === id);
    let prvedg = null;
    let incomNode = null;

    if (currentNode[0].type === "If Else Clause") {
      const incomingEdges = edges.filter((edge) => edge.target === id); // Edges pointing to the node
      const outgoingEdges = edges.filter((edge) => edge.source === id); // Edges originating from the node
      const yesNode = nodes.find(
        (node) => node.id === currentNode[0].id + "Yes"
      );
      const noNode = nodes.find((node) => node.id === currentNode[0].id + "No");
      let updatedEdges = edges.filter(
        (edge) =>
          edge.source !== currentNode[0].id + "Yes" &&
          edge.target !== currentNode[0].id + "Yes" &&
          edge.source !== currentNode[0].id + "No" &&
          edge.target !== currentNode[0].id + "No" &&
          edge.target !== currentNode[0].id &&
          edge.source !== currentNode[0].id
      );

      const updatedNodes = nodes.filter(
        (node) =>
          node.id !== currentNode[0].id + "Yes" &&
          node.id !== currentNode[0].id + "No" &&
          node.id !== currentNode[0].id
      );

      incomingEdges.forEach((incomingEdge) => {
        const prevNode = nodes.find((node) => node.id === incomingEdge.source);
        prvedg = prevNode;
      });
      let newedge = [];

      if (yesNode && noNode) {
        const yesOutgoingEdges = edges.filter(
          (edge) => edge.source === yesNode.id
        );
        const NoOutgoingEdges = edges.filter(
          (edge) => edge.source === yesNode.id
        );
        if (yesOutgoingEdges[0].target && NoOutgoingEdges[0].target) {
          newedge.push({
            id: `xy-edge__${prvedg.id}d-${yesOutgoingEdges[0].target}b`,
            source: prvedg.id,
            target: NoOutgoingEdges[0].target,
            type: "step_button",
          });
        }
      }
      let newnodesaftermodify = JSON.parse(JSON.stringify(updatedNodes))
      let newedgesaftermodify = [...updatedEdges, ...newedge];
      //Check Node Position
      const deletedNodeIds = []
      const deleteEntireNo = (nodeId) => {
        for (const el of edges) {
          if(el.source === nodeId && !el.target.includes('end')){
            deletedNodeIds.push(el.target)
            deleteEntireNo(el.target);
          }
        }
      }

      deleteEntireNo(id + 'No');
      newnodesaftermodify = await newnodesaftermodify.filter(x => !deletedNodeIds.includes(x.id));
      newedgesaftermodify = await newedgesaftermodify.filter(x => !deletedNodeIds.includes(x.source) || !deletedNodeIds.includes(x.target));
      const stepWisePosition = async (edge) => {
        const sourceNode = await newnodesaftermodify.find(x => x.id === edge.source);
        const targetNode = await newnodesaftermodify.find(x => x.id === edge.target);
        const index = await newnodesaftermodify.findIndex(x => x.id === targetNode.id);
        if (targetNode.type === 'Yes' || targetNode.type === 'No') {
          newnodesaftermodify[index].position.y = sourceNode.position.y + 2;
          if (targetNode.type === 'No') {
            newnodesaftermodify[index].position.x = sourceNode.position.x + 140;
          } else {
            newnodesaftermodify[index].position.x = sourceNode.position.x - 140;
          }
        } else if (targetNode.type === 'End') {
          const endEdges = await newedgesaftermodify.filter(x => x.target === targetNode.id);
          const endEdgesSourceIds = [];
          for await (const el of endEdges) {
            const item = await newnodesaftermodify.find(x => x.id === el.source);
            if (item) {
              endEdgesSourceIds.push(item);
            }
          }
          console.log(endEdgesSourceIds)
          const maxEntry = endEdgesSourceIds.reduce((max, item) => item?.position?.y > max?.position?.y ? item : max, endEdgesSourceIds[0]);
          newnodesaftermodify[index].position.y = maxEntry.position.y + 100;
        } else {
          newnodesaftermodify[index].position.y = sourceNode.position.y + 100;
          newnodesaftermodify[index].position.x = sourceNode.position.x;
        }
        const nextEdges = await newedgesaftermodify.filter(x => x.source === edge.target);
        for (const element of nextEdges) {
          await stepWisePosition(element);
        }
        return 'OK';
      }
      const startEdge = await newedgesaftermodify.find(x => x.source.includes('start'));
      await stepWisePosition(startEdge);
      // Dispatch the updated nodes and edges
      console.log(deletedNodeIds, edges)
      dispatch(UpdateNodesData(newnodesaftermodify));
      dispatch(UpdateEdgesData(newedgesaftermodify));
    } else if (currentNode[0].type !== "If Else Clause") {
      const incomingEdges = edges.filter((edge) => edge.target === id); // Edges pointing to the node
      const outgoingEdges = edges.filter((edge) => edge.source === id); // Edges originating from the node

      // Process incoming edges: reconnect the previous node to the next node (the "next incoming node")
      incomingEdges.forEach((incomingEdge) => {
        const prevNode = nodes.find((node) => node.id === incomingEdge.source);
        prvedg = prevNode;
      });

      // Process outgoing edges: reconnect the next node in sequence
      outgoingEdges.forEach((outgoingEdge) => {
        const sourceNode = nodes.find(
          (node) => node.id === outgoingEdge.source
        );
        const nextTargetNode = nodes.find(
          (node) => node.id === outgoingEdge.target
        );
        incomNode = nextTargetNode;
        if (sourceNode && nextTargetNode) {
          // Create a new edge from the source node to the new target node
          const newEdge = {
            id: `xy-edge__${prvedg.id}d-${nextTargetNode.id}b`,
            source: prvedg.id,
            target: nextTargetNode.id,
            type: "step_button",
          };
          newEdges.push(newEdge);
        }
      });
      const updatedNodes = nodes.filter((node) => node.id !== id);
      const updatedEdges = edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      );
      let newnodesaftermodify = JSON.parse(JSON.stringify(updatedNodes))
      let newedgesaftermodify = [...updatedEdges, ...newEdges];
      //Check Node Position
      const stepWisePosition = async (edge) => {
        const sourceNode = await newnodesaftermodify.find(x => x.id === edge.source);
        const targetNode = await newnodesaftermodify.find(x => x.id === edge.target);
        const index = await newnodesaftermodify.findIndex(x => x.id === edge.target);
        if (targetNode.type === 'Yes' || targetNode.type === 'No') {
          newnodesaftermodify[index].position.y = sourceNode.position.y + 2;
        } else if (targetNode.type === 'End') {
          const endEdges = await newedgesaftermodify.filter(x => x.target === targetNode.id);
          const endEdgesSourceIds = [];
          for await (const el of endEdges) {
            const item = await newnodesaftermodify.find(x => x.id === el.source);
            if (item) {
              endEdgesSourceIds.push(item);
            }
          }
          const maxEntry = endEdgesSourceIds.reduce((max, item) => item.position.y > max.position.y ? item : max, endEdgesSourceIds[0]);
          console.log(maxEntry)
          newnodesaftermodify[index].position.y = maxEntry.position.y + 100;
        } else {
          newnodesaftermodify[index].position.y = sourceNode.position.y + 100;
        }
        const nextEdges = await newedgesaftermodify.filter(x => x.source === edge.target);
        for (const element of nextEdges) {
          console.log(element)
          await stepWisePosition(element);
        }
        return 'OK';
      }
      const startEdge = await newedgesaftermodify.find(x => x.source.includes('start'));
      console.log(startEdge);
      await stepWisePosition(startEdge);
      // Dispatch the updated nodes and edges
      dispatch(UpdateNodesData(newnodesaftermodify));
      dispatch(UpdateEdgesData(newedgesaftermodify));
    }

    // Remove the node to be deleted and update the edges
  }, [id, nodes, edges]);
  return (
    <>
      {dataId === id && location.pathname.includes("workflow-creation") && (
        <div className="node-actions">
          <div
            style={{
              border: "1.5px solid #e0e0e0",
              borderRadius: "6px",
              height: "20px",
            }}
          >
            <Box onClick={copyNode}>
              <img src={copy} alt="copy" />
            </Box>
            <Box onClick={handleClikonedit}>
              <img src={edit} alt="edit" />
            </Box>
            <Box onClick={deleteNode}>
              <img src={trash} alt="trash" />
            </Box>
          </div>
        </div>
      )}
      <div>
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          id="a"
          className="handle-dots"
        />

        {type === "If Else Clause" ? (
          <>
            <Handle
              type="source"
              isConnectable={isConnectable}
              className="handle-dots"
              position={Position.Right}
              id="c"
            />
            <Handle
              type={type === "If Else Clause" ? "source" : "target"}
              position={Position.Left}
              isConnectable={isConnectable}
              className="handle-dots"
              id="b"
            />
          </>
        ) : (
          <Handle
            type="source"
            isConnectable={isConnectable}
            className="handle-dots"
            position={Position.Bottom}
            id="d"
          />
        )}
        <div
          className={`${data.StepStatus} dynamic-node`}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("application/reactflow", `${data?.label}`);
            e.dataTransfer.effectAllowed = "move";
          }}
          onClick={toggleSidebar}
        >
          {startNodeId === id && (
            <ForwardSharpIcon className="start-icon-step" fontSize="10px" />
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              brekword: "break-word",
              maxWidth: "100%",
              justifyContent: "space-between",
            }}
          >
            <img src={geticons(type)} alt={type} height={12} />
            <Typography variant="caption1" fontSize={6} marginRight={1}>
              {configData[id]?.title}
            </Typography>
            <div />
          </Box>
          {data.StepStatus === "Faild" &&
            !location.pathname.includes("workflow-creation") ? (
            <HtmlTooltip
              title={
                <Box>
                  {" A message which appears when a cursor is positioned."}
                </Box>
              }
            >
              <img
                title={data.StepStatus}
                src={getStatus(data.StepStatus)}
                alt={data.StepStatus}
                className="statusicon"
              />
            </HtmlTooltip>
          ) : data.StepStatus !== "default" &&
            !location.pathname.includes("workflow-creation") ? (
            <img
              title={data.StepStatus}
              src={getStatus(data.StepStatus)}
              alt={data.StepStatus}
              className="statusicon"
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
export default DynamicDragDrop;
