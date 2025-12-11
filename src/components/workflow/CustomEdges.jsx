import React, { useState } from "react";
import {
  applyNodeChanges,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  // useReactFlow,
} from "@xyflow/react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { Add, ArrowForwardIos } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { geticons } from "../../utils";
import {
  UpdateNodesData,
  UpdateEdgesData,
  updateConfigData,
} from "../../store/flow/slice";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  source,
  target,
  type,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    maxStep: 0,
  });
  // State to control the menu visibility
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchor, setSubmenuAnchor] = useState(null); // State for submenu
  const [activeSubmenu, setActiveSubmenu] = useState(null); // Track which service has an open submenu
  const { getallservices } = useSelector((state) => state.workflow); // Get services from Redux
  const { getEdges, getNodes } = useReactFlow();
  const nodes = getNodes();
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const path = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    maxStep: 0,
  })[0];

  // Handle closing the main menu
  const handleClose = () => {
    setAnchorEl(null);
    setSubmenuAnchor(null); // Close submenu when the main menu is closed
  };

  // Handle opening a submenu for a specific service element
  const handleSubmenuOpen = (event, element) => {
    setActiveSubmenu(element.ServiceID);
    setSubmenuAnchor(event.currentTarget);
  };

  // Handle closing the submenu
  const handleSubmenuClose = async (serviceName) => {
    setSubmenuAnchor(null);
    setActiveSubmenu(null);
    const sourceNode = nodes.find((node) => node.id === source);
    // const targetNode = nodes.find((node) => node.id === target);
    const position = {
      x: sourceNode.position.x,
      y: sourceNode.position.y + 100,
    };

    const newNode = {
      id: new Date().getTime().toString(),
      type: serviceName,
      position,
      data: {
        label: `${serviceName} node`,
        StepStatus: "default",
      },
    };
    let node = [];
    for (let element of JSON.parse(JSON.stringify(nodes))) {
      if (element.position.y >= targetY) {
        element.position.y = element.position.y + 100;
      }
      node.push(element);
    }
    node.push(newNode);


    if (serviceName === "If Else Clause") {
      dispatch(
        updateConfigData({
          id: newNode.id + "Yes",
          value: {
            title: "Yes",
            type:"Yes"

          },
        })
      );
      node.push({
        id: newNode.id + "Yes",
        type: "Yes",
        position: {
          x: newNode.position.x - 140,
          y: newNode.position.y + 2,
        },
        data: {
          label: `${"yes"} node`,
          StepStatus: "default",
        },
      });
      dispatch(
        updateConfigData({
          id: newNode.id + "No",
          value: {
            title: "No",
            type: "No",
          },
        })
      );
      node.push({
        id: newNode.id + "No",
        type: "No",
        position: {
          x: newNode.position.x + 140,
          y: newNode.position.y + 2,
        },
        data: {
          label: `${"No"} node`,
          StepStatus: "default",
        },
      });
    }
    const edges = getEdges();
    const reqEdges = edges.filter((edge) => edge.source !== source);

    const newEdges = [
      {
        id: `xy-edge__${source}d-${newNode.id}b`,
        source: source,
        sourceHandle: "d",
        tagetHanlder: "b",
        target: newNode.id,
        type: "step_button",
      },
    ];
    if (serviceName === "If Else Clause") {
      newEdges.push({
        id: `xy-edge__${newNode.id}b-${newNode.id}Yesyes`, // Connect Yes handle
        source: newNode.id,
        sourceHandle: `b`, // Match the ID of the "Yes" source handle
        target: `${newNode.id}Yes`,
        targetHandle: "c", // Example: target's "No" handle
      });

      newEdges.push({
        id: `xy-edge__${newNode.id}c-${newNode.id}Nono`, // Connect No handle
        source: newNode.id,
        sourceHandle: `c`, // Match the ID of the "No" source handle
        target: `${newNode.id}No`,
        targetHandle: `b`, // Example: target's "Yes" handle
      });
      newEdges.push({
        id: `xy-edge__${newNode.id}Yesd-${target}b`,
        source: `${newNode.id}Yes`,
        sourceHandle: "d",
        tagetHanlder: "b",
        target: target,
        type: "step_button",
      });
      newEdges.push({
        id: `xy-edge__${newNode.id}Nod-${target}b`,
        source: `${newNode.id}No`,
        sourceHandle: "d",
        tagetHanlder: "b",
        target: nodes.find((x) => x.id.startsWith("end")).id,
        type: "step_button",
      });
    } else {
      newEdges.push({
        id: `xy-edge__${newNode.id}d-${target}b`,
        source: newNode.id,
        sourceHandle: "d",
        tagetHanlder: "b",
        target: target,
        type: "step_button",
      });
    }
    let newedgesaftermodify = [...reqEdges, ...newEdges];
    let newnodesaftermodify = [...node]
     const stepWisePosition = async (edge) => {
       const sourceNode = await newnodesaftermodify.find(x => x.id === edge.source);
       const targetNode = await newnodesaftermodify.find(x => x.id === edge.target);
       const index = await newnodesaftermodify.findIndex(x => x.id === edge.target);
       if (targetNode.type === 'Yes' || targetNode.type === 'No') {
         newnodesaftermodify[index].position.y = sourceNode.position.y + 2;
       } else if (targetNode.type === 'End') {
         const endEdges = await newedgesaftermodify.filter(x => x.target === targetNode.id);
         const endEdgesSourceIds = [];
         for await (const el of endEdges) {
           const item = await newnodesaftermodify.find(x => x.id === el.source);
           if (item) {
             endEdgesSourceIds.push(item);
           }
         }
         const maxEntry = endEdgesSourceIds.reduce((max, item) => item.position.y > max.position.y ? item : max, endEdgesSourceIds[0]);
         console.log(maxEntry)
         newnodesaftermodify[index].position.y = maxEntry.position.y + 100;
       } else {
         newnodesaftermodify[index].position.y = sourceNode.position.y + 100;
       }
       const nextEdges = await newedgesaftermodify.filter(x => x.source === edge.target);
       for (const element of nextEdges) {
         console.log(element)
         await stepWisePosition(element);
       }
       return 'OK';
     }
     const startEdge = await newedgesaftermodify.find(x => x.source.includes('start'));
     console.log(startEdge);
     await stepWisePosition(startEdge);
    dispatch(UpdateNodesData(newnodesaftermodify));
    dispatch(UpdateEdgesData(newedgesaftermodify));
  };
  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <Box
          className="button-edge__label nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            position: "absolute",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          <IconButton
            sx={{
              background: "#fff",
              height: "16px",
              width: "16px",
            }}
            className="button-edge__button"
          >
            <Add
              sx={{
                fontSize: "10px",
              }}
            />
          </IconButton>
        </Box>
      </EdgeLabelRenderer>

      {/* Main Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onDoubleClick={() => {
          handleClose();
          setSubmenuAnchor(null);
          setActiveSubmenu(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        sx={{
          width: 400,
          ".MuiPaper-root": {
            width: "400px",
          },
        }}
      >
        {getallservices?.map((service, index) => (
          <div key={service.FlowServiceElementID}>
            <MenuItem
              onClick={(e) => handleSubmenuOpen(e, service)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom:
                  index === getallservices.length - 1
                    ? "none"
                    : "1px solid #ccc",
                gap: "1rem",
              }}
            >
              <img src={geticons(service?.ServiceName)} height={20} />
              {service?.ServiceName}
              <ArrowForwardIos sx={{ marginLeft: "auto" }} fontSize="10px" />
            </MenuItem>
            <Menu
              anchorEl={submenuAnchor}
              open={activeSubmenu === service.ServiceID}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{
                width: 400,
                ".MuiPaper-root": {
                  width: "400px",
                },
              }}
            >
              {service?.ServiceElements?.map((item, index) => (
                <MenuItem
                  key={item.FlowServiceElementID}
                  onClick={() => {
                    handleSubmenuClose(item?.ServiceElementName);
                  }}
                  sx={{
                    borderBottom:
                      index === service.ServiceElements.length - 1
                        ? "none"
                        : "1px solid #ccc",
                  }}
                >
                  {geticons(service?.ServiceElementName)}
                  {item.ServiceElementName}
                </MenuItem>
              ))}
            </Menu>
          </div>
        ))}
      </Menu>
    </>
  );
}
