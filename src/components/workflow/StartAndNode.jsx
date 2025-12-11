import React from "react";
import "@xyflow/react/dist/style.css";
import { Box, Typography } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import "./flow.css";

function DynamicDragDrop({ id, type, isConnectable, data }) {
  return (
    <>
      <div>
        {type === "Start" && (
          <Handle
            type="source"
            isConnectable={isConnectable}
            className="handle-dots"
            position={Position.Bottom}
            id="d"
          />
        )}
        {type === "End" && (
          <Handle
            type="target"
            position={Position.Top}
            isConnectable={isConnectable}
            id="b"
            className="handle-dots"
          />
        )}

        <div
          className={`${type}`}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("application/reactflow", `${data?.label}`);
            e.dataTransfer.effectAllowed = "move";
          }}
        >
          <Typography variant="caption" fontSize={"7px"}>
            {type}
          </Typography>
        </div>
      </div>
    </>
  );
}
export default DynamicDragDrop;
