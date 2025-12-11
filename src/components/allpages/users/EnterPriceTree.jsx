import React, { useEffect, useState, useCallback } from "react";
import Tree from "react-d3-tree";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUserApi } from "../../../store/usermanagement/action";
import {
  IconButton,
  Badge,
  Box,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import {
  Fullscreen,
  FullscreenExit,
  AccountTree,
  Business,
  Group,
} from "@mui/icons-material";
import "./EnterpriseTree.css";
import { useTranslation } from "react-i18next";

const EnterPriceTree = () => {
  const [orientation, setOrientation] = useState("vertical");
  const [treeData, setTreeData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [firstNode, setFirstNode] = useState(null);
  const { t } = useTranslation();
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { getalluser } = useSelector((state) => state.getalluser);
  const dispatch = useDispatch();
  const { enterpriselist } = useSelector((state) => state.enterprise);
  useEffect(() => {
    console.log(
      enterpriselist?.[0]?.OrganizationStructureName,
      "in the modal tree"
    );
    setFirstNode(enterpriselist?.[0]?.OrganizationStructureName);
  }, [enterpriselist]);

  useEffect(() => {
    dispatch(GetAllUserApi());
  }, [dispatch]);
  const treeContainerRef = useCallback(
    (containerElem) => {
      if (containerElem) {
        const { width, height } = containerElem.getBoundingClientRect();
        setContainerDimensions({ width, height });
        setTranslate({ x: width / 2, y: height / 4 });
      }
    },
    [isFullscreen]
  );
  useEffect(() => {
    if (getalluser?.data) {
      const transformedData = transformApiData(getalluser.data);
      setTreeData(transformedData);
    }
  }, [getalluser]);

  // Function to transform API data into tree structure
  const transformApiData = (apiData) => {
    // Group users by DepartmentName
    const departmentsMap = {};

    apiData.forEach((user) => {
      const deptName = user.DepartmentName || "Unassigned Department";

      if (!departmentsMap[deptName]) {
        departmentsMap[deptName] = {
          name: deptName,
          attributes: {
            type: "Department",
            employeeCount: 0,
          },
          children: [],
        };
      }

      // Create user node with detailed children
      const userName = `${user.UserFirstName} ${user.UserMiddleName || ""} ${
        user.UserLastName
      }`.trim();

      // Create child nodes for user details
      const userDetailChildren = [
        {
          name: `ID: ${user.UserEmployeeNumber || "N/A"}`,
          attributes: { type: "UserDetail", category: "Employee ID" },
        },
        {
          name: `Email: ${user.UserEmail || "N/A"}`,
          attributes: { type: "UserDetail", category: "Email" },
        },
        {
          name: `Role: ${user.RoleName || "N/A"}`,
          attributes: { type: "UserDetail", category: "Role" },
        },
        {
          name: `Address: ${user.UserAddress || "N/A"}`,
          attributes: { type: "UserDetail", category: "Address" },
        },
        {
          name: `Org Unit: ${user.OrganizationStructureName || "N/A"}`,
          attributes: { type: "UserDetail", category: "Organization" },
        },
        {
          name: `Type: ${user.UserType || "N/A"}`,
          attributes: { type: "UserDetail", category: "User Type" },
        },
        {
          name: `Status: ${user.IsActive ? "Active" : "Inactive"}`,
          attributes: { type: "UserDetail", category: "Status" },
        },
        {
          name: `Phone: ${user.UserPhoneNumber || "N/A"}`,
          attributes: { type: "UserDetail", category: "Phone" },
        },
        {
          name: `Gender: ${user.Gender || "N/A"}`,
          attributes: { type: "UserDetail", category: "Gender" },
        },
      ].filter(
        (child) => child.name !== "N/A" && !child.name.includes(": N/A")
      ); // Filter out N/A values

      const userNode = {
        name: userName,
        attributes: {
          type: "User",
          UserID: user.UserID,
          UserEmail: user.UserEmail,
          UserEmployeeNumber: user.UserEmployeeNumber,
          UserAddress: user.UserAddress,
          RoleName: user.RoleName,
          OrganizationStructureName: user.OrganizationStructureName,
        },
        children: userDetailChildren,
        // Store the original user data for reference
        originalData: user,
      };

      departmentsMap[deptName].children.push(userNode);
      departmentsMap[deptName].attributes.employeeCount++;
    });

    // Create the root node with departments as children
    const rootNode = {
      name: firstNode || "Bank",
      attributes: {
        type: "Bank",
        departmentCount: Object.keys(departmentsMap).length,
        employeeCount: apiData.length,
      },
      children: Object.values(departmentsMap),
    };

    return rootNode;
  };

  const handleNodeClick = (nodeData, toggleNode) => {
    setSelectedNode(nodeData);

    // Toggle node if it has children
    if (nodeData.children && nodeData.children.length > 0) {
      toggleNode();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);

    // Recalculate translate after fullscreen toggle
    setTimeout(() => {
      const container = document.querySelector(".tree-visualization");
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        setContainerDimensions({ width, height });
        setTranslate({ x: width / 2, y: height / 4 });
      }
    }, 100);
  };

  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;
    const nodeType = nodeDatum.attributes?.type;

    let fillColor;
    let textColor = "white";

    switch (nodeType) {
      case "Bank":
        fillColor = "#2c5282";
        break;
      case "Department":
        fillColor = "#3182ce";
        break;
      case "User":
        fillColor = "#63b3ed";
        break;
      case "UserDetail":
        fillColor = "#90cdf4";
        textColor = "#1a365d";
        break;
      default:
        fillColor = "#a0aec0";
    }

    // Adjust node size based on type
    const nodeWidth = nodeType === "UserDetail" ? 180 : 140;
    const nodeHeight = nodeType === "UserDetail" ? 40 : 60;

    return (
      <g>
        {/* Node rectangle */}
        <rect
          width={nodeWidth}
          height={nodeHeight}
          x={-nodeWidth / 2}
          y={-nodeHeight / 2}
          fill={fillColor}
          stroke="#1a365d"
          strokeWidth="2"
          rx="10"
          onClick={(e) => {
            e.stopPropagation();
            handleNodeClick(nodeDatum, toggleNode);
          }}
          style={{ cursor: "pointer" }}
        />

        {/* Expand/collapse icon for nodes with children */}
        {hasChildren && (
          <text
            fill={textColor}
            strokeWidth="0"
            x={nodeWidth / 2 - 10}
            y={-nodeHeight / 2 + 15}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            onClick={(e) => {
              e.stopPropagation();
              toggleNode();
            }}
            style={{ cursor: "pointer" }}
          >
            {nodeDatum.__rd3t.collapsed ? "+" : "-"}
          </text>
        )}

        {/* Child count badge for nodes with children */}
        {hasChildren && (
          <circle
            cx={nodeWidth / 2 - 20}
            cy={-nodeHeight / 2}
            r="12"
            fill="#e53e3e"
            stroke="#fff"
            strokeWidth="2"
          />
        )}

        {hasChildren && (
          <text
            fill="white"
            strokeWidth="0"
            x={nodeWidth / 2 - 20}
            y={-nodeHeight / 2 + 4}
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
          >
            {nodeDatum.children.length}
          </text>
        )}

        {/* Node text - now clickable to toggle children */}
        <text
          fill={textColor}
          strokeWidth="0"
          x="0"
          y={nodeType === "UserDetail" ? "0" : "-5"}
          textAnchor="middle"
          fontSize={nodeType === "UserDetail" ? "10" : "12"}
          fontWeight="bold"
          onClick={(e) => {
            e.stopPropagation();
            handleNodeClick(nodeDatum, toggleNode);
          }}
          style={{ cursor: "pointer" }}
        >
          {nodeDatum.name.length > (nodeType === "UserDetail" ? 20 : 15)
            ? `${nodeDatum.name.substring(
                0,
                nodeType === "UserDetail" ? 17 : 12
              )}...`
            : nodeDatum.name}
        </text>

        {/* Node type label (only for non-UserDetail nodes) */}
        {nodeType !== "UserDetail" && (
          <text
            fill="#e2e8f0"
            strokeWidth="0"
            x="0"
            y="15"
            textAnchor="middle"
            fontSize="10"
            onClick={(e) => {
              e.stopPropagation();
              handleNodeClick(nodeDatum, toggleNode);
            }}
            style={{ cursor: "pointer" }}
          >
            {nodeType}
          </text>
        )}
      </g>
    );
  };

  if (!treeData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <Typography variant="h6">{t("Loading organizational tree...")}</Typography>
      </Box>
    );
  }

  const containerStyle = isFullscreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
        zIndex: 9999,
        overflow: "hidden",
      }
    : {};

  return (
    <div className="enterprise-tree-container" style={containerStyle}>
      {/* Header with badges and fullscreen toggle */}
      <Box
        position={isFullscreen ? "fixed" : "relative"}
        top={isFullscreen ? 16 : 0}
        left={isFullscreen ? 16 : 0}
        // zIndex={10000}
        display="flex"
        alignItems="center"
        gap={2}
        mb={isFullscreen ? 0 : 2}
      >
        {/* Department Count Badge */}
        <Badge
          badgeContent={treeData?.attributes?.departmentCount || 0}
          color="primary"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "12px",
              minWidth: "20px",
              height: "20px",
            },
          }}
        >
          <Paper sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <Business fontSize="small" />
            <Typography variant="body2" fontWeight="bold">
             {t("Departments")}
            </Typography>
          </Paper>
        </Badge>

        {/* Employee Count Badge */}
        <Badge
          badgeContent={treeData?.attributes?.employeeCount || 0}
          color="secondary"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "12px",
              minWidth: "20px",
              height: "20px",
            },
          }}
        >
          <Paper sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <Group fontSize="small" />
            <Typography variant="body2" fontWeight="bold">
             {t("Employees")}
            </Typography>
          </Paper>
        </Badge>

        {/* Fullscreen Toggle */}
        <Tooltip title={isFullscreen ? t("Exit Fullscreen") : t("Enter Fullscreen")}>
          <IconButton
            onClick={toggleFullscreen}
            color="primary"
            sx={{
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Tooltip>
      </Box>

      <div
        className="controls"
        style={{ marginTop: isFullscreen ? "80px" : "0" }}
      >
        <button
          onClick={() => setOrientation("vertical")}
          className={orientation === "vertical" ? "active" : ""}
        >
          <AccountTree style={{ marginRight: "8px", fontSize: "16px" }} />
         {t("Vertical Layout")}
        </button>

        <button
          onClick={() => setOrientation("diagonal")}
          className={orientation === "diagonal" ? "active" : ""}
        >
          <AccountTree
            style={{
              marginRight: "8px",
              fontSize: "16px",
              transform: "rotate(45deg)",
            }}
          />
          {t("Diagonal Layout")}
        </button>
      </div>

      <div className="tree-content">
        <div
          className="tree-visualization"
          ref={treeContainerRef}
          style={{
            width: "100%",
            height: isFullscreen ? "calc(100vh - 120px)" : "750px",
          }}
        >
          <Tree
            data={treeData}
            orientation={orientation === "vertical" ? "vertical" : "diagonal"}
            renderCustomNodeElement={renderCustomNode}
            nodeSize={{ x: 250, y: 120 }}
            separation={{ siblings: 1.2, nonSiblings: 1.8 }}
            translate={translate}
            pathFunc={orientation === "vertical" ? "step" : "diagonal"}
            initialDepth={2}
            zoom={isFullscreen ? 0.8 : 0.7}
            styles={{
              links: {
                stroke: "#1a365d",
                strokeWidth: 2,
              },
            }}
            collapsible={true}
            shouldCollapseNeighborNodes={false}
          />
        </div>
      </div>
    </div>
  );
};

export default EnterPriceTree;
