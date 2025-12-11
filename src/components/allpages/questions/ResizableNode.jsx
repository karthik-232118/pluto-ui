import { memo, useRef, useEffect, useCallback, useState } from "react";
import { Handle, NodeResizer, Position, useReactFlow } from "@xyflow/react";
import { useDispatch, useSelector } from "react-redux";
import "./flow.css";
import { updateConfigData } from "../../../store/flow/slice";
import deleteIcon from "../../../assets/svg/flowpage/delete.svg";
import { useLocation } from "react-router-dom";
import  PropTypes from "prop-types";

const ResizableNode = ({ selected, id }) => {
  const { configData } = useSelector((state) => state.workflow);
  const { setNodes, setEdges } = useReactFlow();
  const [showIcons, setShowIcons] = useState(false);
  const userType = localStorage.getItem("user_type");
  const lodaction = useLocation();
  const dispatch = useDispatch();

  const deleteNode = useCallback(() => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id)
    );

  }, [id, setNodes, setEdges]);

  const textAreaRef = useRef(null);

  const onChange = (e) => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          title: e.target.value,
        },
      })
    );
  };

  // Auto resize the textarea height based on content
  const autoResize = () => {
    const textArea = textAreaRef.current;
    textArea.style.height = "auto"; // Reset the height to auto to shrink if needed
    textArea.style.height = `${textArea.scrollHeight}px`; // Set the height to scrollHeight for auto-expansion
  };

  const handleNodeClick = () => {
    setShowIcons((prev) => !prev); // Toggle the showIcons state on click
  };

  useEffect(() => {
    autoResize(); // Initially resize on render
  }, []);

  return (
    <>
      <NodeResizer color="#ccc" isVisible={selected} />
      <div className="textarea-container">
        <Handle
          type="target"
          className="handle-dots"
          position={Position.Left}
          style={{
            background:
              userType !== "EndUser" && lodaction.pathname !== "/sops/view"
                ? "#555"
                : "transparent",
            border:
              userType === "EndUser" && lodaction.pathname === "/sops/view"
                ? "transparent !important"
                : "#ccc",
            left: -8,
          }}
          id="a"
        />
        {showIcons && (
          <div className="node-actions">
            <div className="delete-icon-container">
              <img
                src={deleteIcon}
                alt="Delete"
                onClick={deleteNode}
                aria-label="Delete Node"
                className="delete-icon"
              />
            </div>
          </div>
        )}
        <div onClick={handleNodeClick}>
          <textarea
            ref={textAreaRef}
            onInput={autoResize} // Resize on input change
            onChange={onChange}
            defaultValue={configData[id]?.title}
            disabled={location.pathname.includes("sops/view")}
          />
        </div>
      </div>
    </>
  );
};

export default memo(ResizableNode);

ResizableNode.propTypes = {
  selected: PropTypes.bool,
  id: PropTypes.string.isRequired,
};
ResizableNode.defaultProps = {
  selected: false,
};
