import { useState, useCallback, useEffect, memo } from "react";
import { useReactFlow, Position, Handle } from "@xyflow/react";
import "react-resizable/css/styles.css";
import copy from "../../../assets/svg/flowpage/copy.svg";
import editIcon from "../../../assets/svg/flowpage/edit.svg";
import clip from "../../../assets/svg/flowpage/clip.svg";
import deleteIcon from "../../../assets/svg/flowpage/delete.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  Typography,
  Box,
  Chip,
  Badge,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import { geticons } from "../../../utils/index";
import "./flow.css";
import { GetServiceList, openSidbar } from "../../../store/flow/action";
import ModalComponent from "./ModalComponent";
import { updateConfigData } from "../../../store/flow/slice";
import { BASE_URL } from "../../../config/urlConfig";
import { useLocation } from "react-router";
import headingicons from "../../../assets/svg/BPMN/headingIcon.svg";
import viewIcon from "../../../assets/svg/BPMN/viewIcon.svg";
import SopsfileIcon from "../../../assets/svg/BPMN/SOPsFileIcon.svg";
import documentIcon from "../../../assets/svg/SideBar/book-open.svg";
import trainingSimulation from "../../../assets/svg/SideBar/video.svg";
import risk from "../../../../src/assets/svg/SOPs/risk.svg";
import { getroles } from "../../../services/enterprise/Enterprise";
import { Close, Link } from "@mui/icons-material";
import RisksModal from "./RisksModal";
import { Get_Risk_By_RiskID_API } from "../../../services/sopRisk/SOPRisk";
import PropTypes from "prop-types";

function DragNode({ id, type, data }) {
  const [modalHeading, setModalHeading] = useState("");
  const { getNode, addNodes, setNodes, setEdges } = useReactFlow();
  const [showIcons, setShowIcons] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentNodeId, SetCurrentNodeId] = useState("");
  const [showModalComponent, setShowModalComponent] = useState(false);
  const [showRisksModal, setShowRisksModal] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const dispatch = useDispatch();

  console.log("dadaaaa", data?.RiskIDs);
  const { configData } = useSelector((state) => state.workflow);
  console.log("configDatasop", configData?.[id]);
  const { selectedLinks, rolesData, selectedImage } = useSelector(
    (state) => state.flowWithSop
  );
  const [roles, setRoles] = useState([]);
  const userType = localStorage.getItem("user_type");
  const lodaction = useLocation();

  const hasRiskIDs = data?.RiskIDs;

  console.log("hasRiskIDs", selectedLinks);

  const AttachmentItem = ({ file, index }) => {
    const renderViewIcon = (url) => (
      <img
        src={viewIcon}
        alt="View Icon"
        style={{
          width: "30px",
          height: "30px",
          margin: "2px",
          cursor: "pointer",
        }}
        onClick={() => window.open(url, "_blank")}
      />
    );

    if (file.ContentLinkType === "sop") {
      return (
        <div key={index}>
          <Divider marginBottem={1} marginTop={1} />
          <div className="content-item">
            <img src={SopsfileIcon} alt="SOP Icon" height={20} />
            <Typography className="item-text" marginBottem={0}>
              {file.ContentLinkTitle}
            </Typography>
            <div>
              {renderViewIcon(
                `/sops/view/${encodeURIComponent(file.ContentLink)}?SOP=false`
              )}
            </div>
          </div>
        </div>
      );
    }

    if (file.ContentLinkType === "doc") {
      return (
        <div key={index}>
          <Divider marginBottem={1} marginTop={1} />
          <div className="content-item">
            <img height={20} src={documentIcon} alt="Document Icon" />
            <Typography className="item-text">
              {file.ContentLinkTitle}
            </Typography>
            <div>
              {file?.RiskAndComplience?.NoOfClause > 0 && (
                <img
                  src={cicon}
                  alt="Compliance Icon"
                  style={{ width: "32px", height: "32px" }}
                  className="openmodal"
                  data-linkid={file?.RiskAndComplience?.RiskAndComplianceID}
                />
              )}
              {renderViewIcon(
                `/documents/view/${encodeURIComponent(
                  file.ContentLink
                )}?SOP=false`
              )}
            </div>
          </div>
        </div>
      );
    }

    if (file.ContentLinkType === "trs") {
      return (
        <div key={index}>
          <Divider marginBottem={1} marginTop={1} />
          <div className="content-item">
            <img
              height={20}
              src={trainingSimulation}
              alt="Training Simulation Icon"
            />
            <Typography className="item-text">
              {file.ContentLinkTitle}
            </Typography>
            <div>
              {renderViewIcon(
                `/training-simulations/view/${encodeURIComponent(
                  file.ContentLink
                )}`
              )}
            </div>
          </div>
        </div>
      );
    }

    if (file.ContentLinkType === "link") {
      return (
        <div key={index}>
          <Divider marginBottem={1} marginTop={1} />
          <div className="content-item">
            <Link sx={{ fontSize: "20px" }} />
            <Typography className="item-text">
              {file.ContentLinkTitle}
            </Typography>
            <div>
              {file?.RiskAndComplience?.NoOfClause > 0 && (
                <img
                  src={cicon}
                  alt="Compliance Icon"
                  style={{ width: "32px", height: "32px" }}
                  className="openmodal"
                  data-linkid={file?.RiskAndComplience?.RiskAndComplianceID}
                />
              )}

              {renderViewIcon(`${decodeURIComponent(file?.ContentLink)}`)}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const ShowAttachment = () => {
    return (
      <div>
        {selectedLinks[id]?.selectedElement?.length > 0 && (
          <div onClick={handleClipIconClick}>
            <img
              src={clip}
              alt="attachment"
              style={{
                height: "10px",
                position: "absolute",
                top: "1px",
                right: "1px",
                cursor: "pointer",
              }}
            />
          </div>
        )}

        {selectedLinks[id]?.selectedElement?.length > 0 && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              style: {
                width: "300px",
                padding: "1rem",
                borderRadius: "10px",
                zIndex: 9999,
                position: "fixed",
                top: "0",
                left: "50%",
                transform: "translateX(-50%)",
              },
            }}
            sx={{
              border: "1px solid #e0e0e0",
            }}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  marginBottom: 1,
                }}
              >
                <img
                  src={headingicons}
                  alt="heading"
                  style={{ width: "40px" }}
                />
                <Typography variant="h6" fontSize={16}>
                  Content
                </Typography>
                <IconButton onClick={handleCloseMenu} className="icon-close">
                  <Close />
                </IconButton>
              </Box>
              {selectedLinks[id]?.selectedElement?.map((file, index) => (
                <AttachmentItem key={index} file={file} index={index} />
              ))}
            </Box>
          </Menu>
        )}
      </div>
    );
  };

  const handleNodeClick = (e) => {
    e.stopPropagation();
    setShowIcons((prev) => !prev);

    const currentNodeRoles = rolesData[id]?.find(
      (roleData) => roleData.nodeId === id
    );
    const roleNames = currentNodeRoles?.selectedRoles.map(
      (role) => role.RoleName
    );
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                roles: roleNames || [],
              },
            }
          : node
      )
    );
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const copyNode = () => {
    const sourceNode = getNode(id);
    const newNode = {
      ...sourceNode,
      id: new Date().getTime().toString(),
      position: {
        x: sourceNode.position.x + 50,
        y: sourceNode.position.y - 50,
      },
    };
    addNodes(newNode);
    handleCloseMenu();
  };

  const deleteNode = useCallback(() => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id)
    );
    handleCloseMenu();
  }, [id, setNodes, setEdges]);

  const handleClickOnEdit = () => {
    dispatch(
      openSidbar({
        name: configData[id]?.type || type,
        open: true,
        openService: true,
        id,
      })
    );
    handleCloseMenu();
  };

  // useEffect(() => {
  //   dispatch(GetServiceList());
  // }, [dispatch]);

  const renderHandlesForShape = () => {
    switch (type) {
      case "Start":
      case "End":
        return (
          <>
            <Handle
              className="handle-dots"
              type="source"
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
                top: -8,
              }}
              id="a"
            />
            <Handle
              className="handle-dots"
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
                bottom: -8,
              }}
              id="b"
            />
            <Handle
              className="handle-dots"
              type="source"
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
              id="c"
            />
            <Handle
              className="handle-dots"
              type="source"
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
                right: -8,
              }}
              id="d"
            />
          </>
        );
      case "diamond":
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
                transform: "rotate(45deg)",
                left: -4,
              }}
            />
            <Handle
              className="handle-dots"
              id="b"
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
                transform: "rotate(45deg)",
                left: -4,
              }}
            />

            <Handle
              className="handle-dots"
              type="source"
              id="d"
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
                transform: "rotate(45deg)",
                right: -4,
                top: "100%",
              }}
            />
          </>
        );
      case "create-task":
        return (
          <>
            <Handle
              className="handle-dots"
              type="source"
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
                top: -8,
              }}
              id="a"
            />
            <Handle
              className="handle-dots"
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
                bottom: -8,
              }}
              id="b"
            />
            <Handle
              className="handle-dots"
              type="source"
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
              id="c"
            />
            <Handle
              className="handle-dots"
              type="source"
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
                right: -8,
              }}
              id="d"
            />
          </>
        );

      default:
        return;
    }
  };
  useEffect(() => {
    if (data?.properties?.length > 0) {
      data?.properties?.NodeProperties?.forEach((item) => {
        dispatch(updateConfigData({ id, value: item }));
      });
    }
  }, [data, id, dispatch]);

  const SelectedRolesComp = () => {
    let remainingRolesCount = 0;
    const selectedRoles = [];
    rolesData[id]?.forEach((role) => {
      const isRoleSelected = roles?.find((r) => r.RoleID === role);

      if (isRoleSelected) {
        if (selectedRoles.length < 2) {
          selectedRoles.push(isRoleSelected?.RoleName);
        } else {
          remainingRolesCount++;
        }
      }
    });
    const allRoles = [];

    rolesData[id]?.forEach((role) => {
      const isRoleSelected = roles?.find((r) => r.RoleID === role);
      if (isRoleSelected) {
        allRoles.push(isRoleSelected.RoleName);
      }
    });
    return (
      <>
        <Tooltip title={allRoles.join(", ")} arrow>
          <Badge
            badgeContent={
              remainingRolesCount > 0 ? `+${remainingRolesCount}` : 0
            }
            className="task-badge"
            overlap="circular"
            sx={{
              marginTop: "1rem",
              ".MuiBadge-badge": {
                height: "14px",
                right: "-16px",
                fontSize: "6px",
              },
            }}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            color="primary"
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                position: "absolute",
                bottom: "-14px",
                left: "-12px",
                width: "6.758rem",
              }}
            >
              <div
                style={{
                  borderTop: "1px solid #ccc",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  padding: "5px",
                }}
              >
                {/* Display only the first two selected roles as chips */}
                {selectedRoles.slice(0, 2).map((roleName, index) => (
                  <Chip
                    key={index}
                    label={roleName}
                    variant="outlined"
                    color={"primary"}
                    sx={{
                      height: "14px",
                      ".MuiChip-label": {
                        fontSize: "5.4px",
                        padding: "2px",
                        fontWeight: "500",
                        lineHeight: "normal",
                      },
                    }}
                  />
                ))}
              </div>
            </div>
          </Badge>
        </Tooltip>
      </>
    );
  };
  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     try {
  //       const response = await getroles();
  //       setRoles(response.data.data.Roles);
  //     } catch (err) {
  //       console.error("Error fetching roles: ", err);
  //     }
  //   };

  //   fetchRoles();
  // }, []);

  const handleRiskIconClick = async () => {
    setModalHeading("Risk Details");
    setShowRisksModal(true);

    if (data?.RiskIDs && data?.RiskIDs.length > 0) {
      const payload = {
        RiskIDs: data?.RiskIDs,
      };

      try {
        const response = await Get_Risk_By_RiskID_API(payload);
        console.log(
          "API ResponseGet_Risk_By_RiskID_API: ",
          response?.data?.data
        );
        setRiskData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching risk details: ", error);
      }
    } else {
      console.log("No RiskID available.");
    }
  };

  const handleClipIconClick = () => {
    setModalHeading("Attachment Details");
    setShowModalComponent(true);
  };
  const handleRisksModalClose = () => {
    setShowRisksModal(false);
  };

  const handleModalComponentClose = () => {
    setShowModalComponent(false);
  };
  const displayLabel =
    type === "create-task"
      ? data.label ||
        configData[id]?.title ||
        (type !== "End" && type !== "Start" ? type : "")
      : configData[id]?.title ||
        (type !== "End" && type !== "Start" ? type : "");
  return (
    <>
      <div className="drag-node-sop">
        <div
          className={`${type}`}
          style={{
            background: configData[id]?.color || "#fff",
          }}
        >
          {hasRiskIDs && (
            <Box
              onClick={handleRiskIconClick}
              sx={{
                position: "absolute",
                top: "-10px",
                right: "14px",
                padding: "5px",
                cursor: "pointer",
                zIndex: 1,
              }}
            >
              <Badge
                badgeContent={data?.RiskIDs?.length || 0}
                color="error"
                overlap="circular"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "7px",
                    height: "10px",
                    minWidth: "10px",
                    padding: "0",
                    transform: "scale(0.8) translate(50%, -50%)",
                  },
                }}
              >
                <img
                  src={risk}
                  alt="Risk Icon"
                  style={{
                    height: "11px",
                    width: "9px",
                    pointerEvents: "none", // so parent handles click
                  }}
                />
              </Badge>
            </Box>
          )}

          {renderHandlesForShape()}
          {ShowAttachment()}
          {showIcons && (lodaction.pathname === "/sops/view") === false && (
            <div
              className={`${
                selectedImage[id]?.link
                  ? "node-action-with-image"
                  : "node-actions"
              } `}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  border: "1.5px solid #e0e0e0",
                  borderRadius: "6px",
                  height: "20px",
                }}
              >
                {type === "Start" || type === "End" ? (
                  <>
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      onClick={deleteNode}
                      // sx={{ width: "20px" }}
                    />
                  </>
                ) : (
                  type !== "Start" &&
                  type !== "End" && (
                    <>
                      <img
                        src={copy}
                        alt="Copy"
                        onClick={copyNode}
                        style={{
                          borderRight: "1px solid #e0e0e0",
                          padding: "0px 0",
                          paddingRight: "5px",
                          width: "20px",
                        }}
                      />
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        onClick={deleteNode}
                        // sx={{ width: "20px" }}
                      />
                      <div
                        onClick={handleClickOnEdit}
                        style={{
                          borderLeft: "1px solid #e0e0e0",
                          padding: "0px 0",
                        }}
                      >
                        <img
                          src={editIcon}
                          alt="Edit"
                          style={{ width: "20px" }}
                        />
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
          )}

          <div className="node-label" onClick={handleNodeClick}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <img src={geticons(configData[id]?.wqq || type)} height={10} />
              <Typography variant="caption1" fontSize={7}>
                {displayLabel}
              </Typography>
            </Box>
          </div>
          {selectedImage[id]?.link ? (
            <img
              src={`${BASE_URL}${selectedImage[id]?.link}`}
              className="attcah-image"
            />
          ) : null}

          {rolesData[id]?.length > 0 && <SelectedRolesComp />}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="node-images">
            {data?.images?.map((imageIcon, index) => (
              <span key={index}>{imageIcon}</span>
            ))}
          </div>
        </div>
        <RisksModal
          open={showRisksModal}
          handleClose={handleRisksModalClose}
          heading={modalHeading}
          currentNodeId={id}
          riskData={riskData}
        />
        <ModalComponent
          open={showModalComponent}
          handleClose={handleModalComponentClose}
          heading={modalHeading}
          currentNodeId={currentNodeId}
        />
      </div>
    </>
  );
}

export default memo(DragNode);


DragNode.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};
DragNode.defaultProps = {
  data: {},
};
