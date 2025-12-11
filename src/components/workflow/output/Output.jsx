import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePropsData } from "../../../store/flow/slice";
import { openSidbar } from "../../../store/flow/action";
import { Typography } from "@mui/material";
import ImageHelper from "../../../assets/svg/reactflow/ImageHelper.svg";

export default function Output({ id, isConnectable, data }) {
  const { open } = useSelector((state) => state.workflow.data);
  const dispatch = useDispatch();
  const { updateNodeData } = useReactFlow();
  const connections = useHandleConnections({
    type: "target",
  });
  const nodesData = useNodesData(
    connections.map((connection) => connection.source)
  );
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
  const toggleSidebar = () => {
    dispatch(
      openSidbar({
        name: "Output",
        open: !open,
      })
    );
  };
  return (
    <div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("application/reactflow", "Output");
          e.dataTransfer.effectAllowed = "move";
        }}
        className={`${data.StepStatus} dynamic-node`}
      >
        <img
          src={ImageHelper}
          alt="text icon"
          style={{ width: 14, height: 14 }}
        />
        <Typography variant="caption" marginBottom={"0"}>
          {" "}
          {"Output"}
        </Typography>
      </div>

      {/* <Handle
                        type="source"
                        position={Position.Bottom}
                        id="b"
                        isConnectable={isConnectable}/> */}
    </div>
  );
}
