import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextHelper from "../../../assets/svg/workflow/Text Helper.svg";
import { Typography } from "@mui/material";
import { openSidbar } from "../../../redux/action";
import { updatePropsData } from "../../../redux/slice";
export default function TextInputFind({ id, isConnectable, data }) {
  const { open } = useSelector((state) => state.workflow.data);
  const nodeData = useSelector((state) => state.workflow.propertiesData);
  const configData = useSelector((state) => state.workflow.configData);
  const dispatch = useDispatch();
  const { updateNodeData } = useReactFlow();
  const connections = useHandleConnections({
    type: "target",
  });
  const nodesData = useNodesData(
    connections.map((connection) => connection.source)
  );
  // console.log(nodeData)
  useEffect(() => {
    if (nodesData.length) {
      dispatch(
        updatePropsData({
          id,
          value: nodesData,
        })
      );
    }
  }, [nodesData]);

  useEffect(() => {
    updateNodeData(id, nodeData[0]);
  }, [nodeData[id]]);
  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("application/reactflow", "Find");
          e.dataTransfer.effectAllowed = "move";
        }}
        className={`${data?.StepStatus}`}
      >
        <img
          src={TextHelper}
          alt="text icon"
          style={{ width: 14, height: 14 }}
        />
        <Typography variant="caption" marginBottom={"0"}>
          {configData[id]?.title || "Find"}
        </Typography>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}
