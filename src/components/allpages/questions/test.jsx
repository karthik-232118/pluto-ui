import { useState, useCallback, useEffect, memo } from "react";
import { useReactFlow, Position, Handle, NodeResizer } from "@xyflow/react";
import "react-resizable/css/styles.css";
import copy from "../../../assets/svg/flowpage/copy.svg";
import editIcon from "../../../assets/svg/flowpage/edit.svg";
import deleteIcon from "../../../assets/svg/flowpage/delete.svg";
import pinIcon from "../../../assets/svg/flowpage/pinicon.svg";
import { useDispatch, useSelector } from "react-redux";
import {  updateConfigData } from "../../../store/flow/slice";
import {
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { geticons } from "../../../utils/index";
import "./flow.css";
import { GetServiceList, openSidbar } from "../../../store/flow/action";
import { setSelectedNodeId } from "../../../store/selectedNode/selectedNodeSlice";
import PropTypes from "prop-types";      
function DragNode({ id, type, data, isConnectable }) {
  const { getNode, addNodes, setNodes, setEdges } = useReactFlow();
  const [showIcons, setShowIcons] = useState(false);
  const [selectedElement, setSelectedElement] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [label, setLabel] = useState("");
  const { getallservices, configData } = useSelector((state) => state.workflow);
  const dispatch = useDispatch();
  const [selectedService, setSelectedService] = useState("");
 
  const handleNodeClick = (e) => {
    e.stopPropagation();
    setShowIcons((prev) => !prev);
 
    const nodeLabel = data?.label || "No Label"; // Get the label from the data or provide a default
 
    console.log("Clicked Node ID:", id); // Logs the Node ID
    console.log("Node Label:", nodeLabel); // Logs the Node Label
    setLabel(nodeLabel); // Set the label to the state
 
    dispatch(setSelectedNodeId(id)); // Dispatch the selected node ID to Redux
 
    if (data.onNodeClick) {
      data.onNodeClick(id); // Pass the ID to FlowPage
    }
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
    setSelectedNodeId(id); // Pass the node ID to the parent component
    dispatch(
      openSidbar({
        name: label,
        open: false,
        openService: true,
        id, // Pass the node ID for further use
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
          serviceId: selectedService,
          element: selectedElementData,
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
      case "Round":
        return (
          <>
            <Handle
              type="target"
              position={Position.Top}
              style={{ background: "#555" }}
            />
            <Handle
              type="source"
              position={Position.Bottom}
              style={{ background: "#555" }}
            />
            <Handle
              type="target"
              position={Position.Left}
              style={{ background: "#555", top: 0 }}
            />
            <Handle
              type="source"
              position={Position.Right}
              style={{ background: "#555", top: 0 }}
            />
          </>
        );
      case "diamond":
        return (
          <>
            <Handle
              type="target"
              position={Position.Top}
              style={{
                background: "#555",
                transform: "rotate(45deg)",
                left: -4,
              }}
            />
            <Handle
              type="source"
              position={Position.Bottom}
              style={{
                background: "#555",
                transform: "rotate(45deg)",
                left: -4,
              }}
            />
            <Handle
              type="target"
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
 
  return (
    <>
      <div className={`${type} dynamic-node`} onClick={handleNodeClick}>
        <NodeResizer minWidth={100} minHeight={100} />
        {renderHandlesForShape()}
        {showIcons && (
          <div className="node-actions" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                border: "1.5px solid #e0e0e0",
                borderRadius: "6px",
                height: "20px",
              }}
            >
              <img src={copy} alt="Copy" onClick={copyNode} />
              <div onClick={handleClickOnPin}>
                <img src={pinIcon} alt="Pin" />
              </div>
              <img src={deleteIcon} alt="Delete" onClick={deleteNode} />
              <div
                onClick={handleClickOnEdit}
                style={{ borderLeft: "1px solid #e0e0e0" }}
              >
                <img
                  src={editIcon}
                  alt="Edit"
                  style={{ paddingLeft: "5px", width: "20px" }}
                />
              </div>
            </div>
          </div>
        )}
        <div className="node-label">
          {configData[id]?.element?.ServiceElementName || type}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Render Image Icons on the Left */}
          <div className="node-images">
            {data.images?.map((imageIcon, index) => (
              <span key={index} style={{ margin: "4px" }}>
                {imageIcon}
              </span>
            ))}
          </div>
 
          {/* Render Clip Icons on the Right */}
          <div className="node-clips">
            {data.clips?.map((clipIcon, index) => (
              <img
                key={index}
                src={clipIcon}
                alt={`Clip ${index}`}
                className="clip-icon"
                style={{ width: "14px", height: "14px", margin: "4px" }}
              />
            ))}
          </div>
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
 

DragNode.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  isConnectable: PropTypes.bool.isRequired,
  onNodeClick: PropTypes.func.isRequired,
};
DragNode.defaultProps = {
  data: {
    label: "Default Node",
    images: [],
    clips: [],
  },
};
DragNode.displayName = "DragNode";
