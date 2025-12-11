import React from "react";
import "@xyflow/react/dist/style.css";
import { Typography } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import "./flow.css";

function OutputNodeForIF({ id, type, isConnectable, data }) {
  return (
    <>
      <div>
        {type === "No" && (
          <>
            <Handle
              type="target"
              isConnectable={isConnectable}
              className="handle"
              position={Position.Left}
              id={`b`} // Unique ID for the "Yes" handle
            />
            <Handle
              type="source"
              isConnectable={isConnectable}
              className="handle"
              position={Position.Bottom}
              id={`d`} // Unique ID for the "Yes" bottom target
            />
          </>
        )}
        {type === "Yes" && (
          <>
            <Handle
              type="target"
              position={Position.Right}
              isConnectable={isConnectable}
              id={`c`} // Unique ID for the "No" handle
              className="handle"
            />
            <Handle
              type="source"
              position={Position.Bottom}
              isConnectable={isConnectable}
              id={`d`} // Unique ID for the "No" bottom target
              className="handle"
            />
          </>
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

export default OutputNodeForIF;
