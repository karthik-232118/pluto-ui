import React, { useState, useCallback, useEffect, memo } from "react";
import {
  useReactFlow,
  Position,
  Handle,
  useNodesData,
  useHandleConnections,
} from "@xyflow/react";
import "react-resizable/css/styles.css";
import copyIcon from "../../assets/svg/flowpage/copy.svg";
import editIcon from "../../assets/svg/flowpage/edit.svg";
import deleteIcon from "../../assets/svg/flowpage/delete.svg";
import pinIcon from "../../assets/svg/flowpage/pinicon.svg";
import { useDispatch, useSelector } from "react-redux";
import { updateConfigData, updatePropsData } from "../../store/flow/slice";
import {
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Box,
} from "@mui/material";
import { geticons, getStatus } from "../../utils/index";
import "./flow.css";
import { useDnD } from "./DnDContext";
import {
  GetServiceList,
  GetUserList,
  openSidbar,
} from "../../store/flow/action";
import { useLocation } from "react-router";

function DragNode({ id, type, data, isConnectable }) {
  const [showIcons, setShowIcons] = useState(false);
  const [selectedElement, setSelectedElement] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { getallservices, configData } = useSelector((state) => state.workflow);
  const dispatch = useDispatch();
  const [_, setType] = useDnD();
  const [selectedService, setSelectedService] = useState("");
  const workflowNodes = useSelector((state) => state.workflow);
  const serviceList = useSelector((state) => state.workflow.getallservices);
  const flowDataById = useSelector((state) => state.workflow.getflowdatafromId);
  const userList = useSelector((state) => state.workflow.userList);
  const [ServiceID, setServiceId] = useState("");
  const dataId = useSelector((state) => state.workflow.data.id);
  const location = useLocation();
  const { updateNodeData, getNode, addNodes, setNodes, setEdges } =
    useReactFlow();
  const connections = useHandleConnections({
    type: "target",
  });
  const nodesData = useNodesData(
    connections.map((connection) => connection.source)
  );

  useEffect(() => {
    const detail = flowDataById.Details?.find(
      (x) => x.ShapeID === id.toString()
    )?.DetailsProperties;
    if (detail) {
      dispatch(updateConfigData({ id, value: detail }));
    }
  }, [flowDataById, id]);

  useEffect(() => {
    for (const el of serviceList) {
      for (const item of el.ServiceElements) {
        if (item.ServiceElementName === type) {
          setServiceId(item.FlowServiceElementID);
        }
      }
    }
    if (!userList.length) {
      dispatch(
        GetUserList({
          SearchString: "",
          Limit: 1000,
          Page: 1,
        })
      );
    }
  }, [serviceList, type]);

  useEffect(() => {
    const parentIds = [id];
    for (const el of nodesData) {
      if (el.data?.parentIds) parentIds.push(...el.data?.parentIds);
    }
    updateNodeData(id, { parentIds });
    if (nodesData.length) dispatch(updatePropsData({ id, value: nodesData }));
  }, [nodesData]);

  useEffect(() => {
    if (!configData[id] && ServiceID) {
      const payload = { title: type, type, ServiceID };
      if (configData[id]?.element?.ServiceElementName === "Gmail") {
        payload["EmailRecipient"] = "";
        payload["EmailSubject"] = "";
        payload["BodyType"] = "text";
        payload["MessageBody"] = "";
        payload["CCEmails"] = [""];
        payload["BCCEmails"] = [""];
        payload["ActionRequired"] = false;
      }
      if (type === "Create Form") {
        payload["sharedFields"] = {
          [id]: [],
        };
      }
      dispatch(
        updateConfigData({
          id,
          value: payload,
        })
      );
    }
  }, [ServiceID]);

  const handleNodeClick = (e) => {
    e.stopPropagation();
    setShowIcons((prev) => !prev);
  };

  const handleClickOnPin = (e) => {
    setAnchorEl(e.currentTarget);
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
        id,
      })
    );
    handleCloseMenu();
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
    setSelectedElement("");
  };

  const handleElementChange = (event) => {
    const elementName = event.target.value;
    setSelectedElement(elementName);

    const selectedServiceData = getallservices?.find(
      (service) => service.ServiceID === selectedService
    );

    const selectedElementData = selectedServiceData?.ServiceElements.find(
      (element) => element.ServiceElementName === elementName
    );

    dispatch(
      updateConfigData({
        id: id,
        value: {
          ServiceID: selectedElementData?.FlowServiceElementID,
          title: elementName,
          type: elementName,
          shapeType: type,
        },
      })
    );
    setAnchorEl(null);
  };

  useEffect(() => {
    dispatch(GetServiceList());
  }, [dispatch]);

  const renderHandlesForShape = () => {
    switch (type) {
      case "circle":
      case "darkcircle":
      case "doubleC":
        return (
          <>
            <Handle
              type="target"
              position={Position.Top}
              style={{ background: "#555" }}
              id="a"
            />
            <Handle
              type="source"
              position={Position.Bottom}
              style={{ background: "#555", bottom: 0 }}
              id="b"
            />
            <Handle
              type="target"
              position={Position.Left}
              style={{ background: "#555", left: 0 }}
              id="c"
            />
            <Handle
              type="source"
              position={Position.Right}
              style={{ background: "#555", right: 0 }}
              id="d"
            />
          </>
        );
      case "diamond":
        return (
          <>
            <Handle
              type="target"
              id="a"
              position={Position.Top}
              style={{
                background: "#555",
                transform: "rotate(45deg)",
                left: -4,
              }}
            />
            <Handle
              id="b"
              type="target"
              position={Position.Bottom}
              style={{
                background: "#555",
                transform: "rotate(45deg)",
                left: -4,
              }}
            />
            <Handle
              type="source"
              id="c"
              position={Position.Left}
              style={{
                background: "#555",
                transform: "rotate(45deg)",
                left: "100%",
                top: -4,
              }}
            />
            <Handle
              type="source"
              id="d"
              position={Position.Right}
              style={{
                background: "#555",
                transform: "rotate(45deg)",
                right: -4,
                top: "100%",
              }}
            />
          </>
        );
      default:
        return (
          <div>
            <Handle
              type="target"
              position={Position.Top}
              isConnectable={isConnectable}
            />
            {type === "If" ? (
              <>
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id="success"
                  style={{ marginLeft: -15 }}
                  isConnectable={isConnectable}
                />
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id="faild"
                  style={{ marginLeft: 15, backgroundColor: "grey" }}
                  isConnectable={isConnectable}
                />
              </>
            ) : (
              <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                isConnectable={isConnectable}
              />
            )}
          </div>
        );
    }
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
      <div className={`${type} dynamic-node`} onClick={handleNodeClick}>
        {/* <NodeResizer minWidth={100} minHeight={100} /> */}
        {renderHandlesForShape()}
        {dataId === id && (
          <div className="node-actions">
            <Box onClick={copyNode}>
              <img src={copyIcon} alt="copy" />
            </Box>
            <Box onClick={handleClickOnEdit}>
              <img src={editIcon} alt="edit" />
            </Box>
            <Box onClick={deleteNode}>
              <img src={deleteIcon} alt="delete" />
            </Box>
            <Box onClick={handleClickOnPin}>
              <img src={pinIcon} alt="pin" />
            </Box>
          </div>
        )}
        {data.StepStatus === "Faild" &&
          !location.pathname.includes("workflow-creation") ? (
          <HtmlTooltip
            title={
              <Box>
                {" A message which appears when a cursor is positioned."}
              </Box>
            }
          >
            {data.StepStatus !== "Pending" && (
              <img
                title={data.StepStatus}
                src={getStatus(data.StepStatus)}
                alt={data.StepStatus}
                className="statusicon"
              />
            )}
          </HtmlTooltip>
        ) : data.StepStatus &&
          !location.pathname.includes("workflow-creation") ? (
          <img
            title={data.StepStatus}
            src={getStatus(data.StepStatus)}
            alt={data.StepStatus}
            className="statusicon"
          />
        ) : null}
        <div className="node-label" onClick={toggleSidebar}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <img src={geticons(configData[id]?.type || type)} />
            <Typography variant="caption1" fontSize={7}>
              {configData[id]?.title || type}
            </Typography>
          </Box>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{ style: { width: "300px", padding: "1rem" } }}
      >
        <FormControl fullWidth>
          <InputLabel id="service-select-label">Select Service</InputLabel>
          <Select
            labelId="service-select-label"
            value={selectedService}
            label="Select Service"
            onChange={handleServiceChange}
          >
            {getallservices?.map((service) => (
              <MenuItem key={service.ServiceID} value={service.ServiceID}>
                {service.ServiceName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {console.log(data)}
        {selectedService && (
          <FormControl fullWidth sx={{ marginTop: "1rem" }}>
            <InputLabel id="element-select-label">Select Element</InputLabel>
            <Select
              labelId="element-select-label"
              value={selectedElement}
              label="Select Element"
              onChange={handleElementChange}
            >
              {getallservices
                ?.find((service) => service.ServiceID === selectedService)
                ?.ServiceElements.map((element) => (
                  <MenuItem
                    key={element.FlowServiceElementID}
                    value={element.ServiceElementName}
                  >
                    <ListItem
                      sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <ListItemIcon>
                        <img
                          src={geticons(
                            getallservices?.find(
                              (service) => service.ServiceID === selectedService
                            ).ServiceName
                          )}
                          alt={element.ServiceElementName}
                          style={{ width: "24px", height: "24px" }}
                        />
                      </ListItemIcon>
                      <Typography variant="caption">
                        {element.ServiceElementName}
                      </Typography>
                    </ListItem>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      </Menu>
    </>
  );
}

export default memo(DragNode);
