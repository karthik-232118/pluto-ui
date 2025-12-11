import  { useState } from "react";
import { Handle, Position } from "reactflow";
import PropTypes from "prop-types";

const CustomResizerNode = ({ data }) => {
  const [width, setWidth] = useState(150);
  const [height, setHeight] = useState(100);
  const [isResizing, setIsResizing] = useState(false);

  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleResize = (e) => {
    if (!isResizing) return;

    const newWidth = Math.max(100, e.clientX - e.target.parentNode.getBoundingClientRect().left);
    const newHeight = Math.max(50, e.clientY - e.target.parentNode.getBoundingClientRect().top);

    setWidth(newWidth);
    setHeight(newHeight);
  };

  const stopResize = () => {
    setIsResizing(false);
  };

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: "1px solid #ddd",
        borderRadius: "4px",
        background: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseMove={handleResize}
      onMouseUp={stopResize}
      onMouseLeave={stopResize}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ padding: "10px", textAlign: "center" }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
      <div
        style={{
          width: "15px",
          height: "15px",
          background: "#ff5722",
          position: "absolute",
          bottom: "0",
          right: "0",
          cursor: "nwse-resize",
        }}
        onMouseDown={startResize}
      />
    </div>
  );
};

export default CustomResizerNode;

CustomResizerNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};
