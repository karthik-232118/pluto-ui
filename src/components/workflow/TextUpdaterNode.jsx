import React, { useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import AddIcon from "@mui/icons-material/Add";
import { Button, Dialog, DialogContent, DialogTitle, Box } from "@mui/material";

// Define a basic style for handles (adjusted based on your needs)
const handleStyle = { left: 10 };

function TextUpdaterNode({ id, data, isConnectable, updateNodeData }) {
  // Local state to handle the input value
  const [textValue, setTextValue] = useState(data.value || "");
  // const [open, setOpen] = useState(false);

  // Handle input change and update node data
  const onChange = useCallback(
    (evt) => {
      const newValue = evt.target.value;
      setTextValue(newValue);

      // Call updateNodeData from the parent component (React Flow) to update node data
      if (updateNodeData) {
        updateNodeData(id, { value: newValue });
      }
    },
    [id, updateNodeData]
  );

  return (
    <div
      style={{
        padding: "10px",
        background: "#f9f9f9",
        borderRadius: "5px",
        border: "1px solid #ccc",
        textAlign: "center",
      }}
    >
      {/* Handle for top position */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      {/* Draggable Node Title */}
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData(
            "application/reactflow",
            "Human Input - Webform"
          );
          e.dataTransfer.effectAllowed = "move";
        }}
        className={`${data?.StepStatus}`}

      >
        Human Input - Webform
      </div>

      {/* Button to Open Dialog */}
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<AddIcon />}
        sx={{ textTransform: "none" }}
      >
        Configure
      </Button>

      {/* Handles for bottom positions */}

      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode;
