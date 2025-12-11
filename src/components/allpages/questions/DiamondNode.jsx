import  { useState, useCallback, memo } from "react";
import { useReactFlow, Position, Handle } from "@xyflow/react";
import "react-resizable/css/styles.css";
import editIcon from "../../../assets/svg/flowpage/edit.svg";
import deleteIcon from "../../../assets/svg/flowpage/delete.svg";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import { geticons } from "../../../utils/index";
import "./flow.css";
import { openSidbar } from "../../../store/flow/action";
import { useLocation } from "react-router";
import PropTypes from "prop-types";

function DiamondNode({ id, type }) {
  const { setNodes, setEdges } = useReactFlow();
  const [showIcons, setShowIcons] = useState(false);
  const { configData } = useSelector((state) => state.workflow);
  const { rolesData } = useSelector((state) => state.flowWithSop);
  const lodaction = useLocation();
  const dispatch = useDispatch();
  const userType = localStorage.getItem("user_type");
  const handleClickOnEdit = () => {
    dispatch(
      openSidbar({
        name: configData[id]?.type || type,
        open: true,
        openService: true,
        id,
      })
    );
   
  };
  const handleNodeClick = (e) => {
    e.stopPropagation();
    setShowIcons((prev) => !prev);
    // Retrieve roles for the clicked node
    const currentNodeRoles = rolesData[id]?.find(
      (roleData) => roleData.nodeId === id
    );
    const roleNames = currentNodeRoles?.selectedRoles.map(
      (role) => role.RoleName
    );

    // Update the node with RoleName
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                roles: roleNames || [], // Add RoleName to node data
              },
            }
          : node
      )
    );

    // Dispatch to set selected node ID
  };
  const deleteNode = useCallback(() => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id)
    );
  }, [id, setNodes, setEdges]);

  const renderHandlesForShape = () => {
    return (
      <>
        <Handle
          className="handle-dots"
          type="source"
          id="a"
          position={Position.Top}
          style={{
            background:
              userType !== "EndUser" && lodaction.pathname !== "/sops/view"
                ? "#555"
                : "transparent",
            border:
              userType === "EndUser" && lodaction.pathname === "/sops/view"
                ? "transparent !important"
                : "#ccc",
            left: 10,
            top: -10,
          }}
        />
        <Handle
          className="handle-dots"
          id="d"
          type="source"
          position={Position.Bottom}
          style={{
            background:
              userType !== "EndUser" && lodaction.pathname !== "/sops/view"
                ? "#555"
                : "transparent",
            border:
              userType === "EndUser" && lodaction.pathname === "/sops/view"
                ? "transparent !important"
                : "#ccc",
            left: 10,
            bottom: -10,
          }}
        />
        <Handle
          className="handle-dots"
          type="source"
          id="b"
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
            left: -10,
          }}
        />
        <Handle
          className="handle-dots"
          type="source"
          id="c"
          position={Position.Right}
          style={{
            background:
              userType !== "EndUser" && lodaction.pathname !== "/sops/view"
                ? "#555"
                : "transparent",
            border:
              userType === "EndUser" && lodaction.pathname === "/sops/view"
                ? "transparent !important"
                : "#ccc",
            right: -10,
          }}
        />
      </>
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

  return (
    <>
      {renderHandlesForShape()}
      <div className={`${type}`} onClick={handleNodeClick}>
        {showIcons && (lodaction.pathname === "/sops/view") === false && (
          <div className={`node-actions`} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                border: "1.5px solid #e0e0e0",
                borderRadius: "6px",
                height: "20px",
              }}
            >
              <img
                src={deleteIcon}
                alt="Delete"
                onClick={deleteNode}
              
              />
              <div onClick={handleClickOnEdit}>
                <img src={editIcon} alt="edit"  />
              </div>
            </div>
          </div>
        )}
        <div className="node-label" onClick={toggleSidebar}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <img src={geticons(configData[id]?.type || type)} />
          </Box>
        </div>
      </div>
    </>
  );
}

export default memo(DiamondNode);

DiamondNode.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};