import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useDnD } from "./DnDContext";
import Vector from "../../assets/svg/reactflow/drag.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { GetServiceList } from "../../store/flow/action";
import { geticons } from "../../utils";

export default () => {
  const [_, setType] = useDnD();
  const [expanded, setExpanded] = useState({});
  const [isOpen, setIsOpen] = useState(true);
  const { getallservices } = useSelector((state) => state.workflow);
  const dispatch = useDispatch();

  // Drag start handler
  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/reactflow", nodeType);
  };

  // const geticons = (name) => {
  //   const icons = {
  //     "SMTP - Send Email": email,
  //     "Webhook - Call Rest API/Webhook": Webhook,
  //     "Human Input": TextInput,
  //     "Create Form": TextInput,
  //     "If Else": TextInput,
  //     "Data mapper": datamapper,
  //     "Import - csv": cvc,
  //     "Text Helper": TextHelper,
  //     API: API,
  //     "Image Helper": ImageHelper,
  //     "Output View": ImageHelper,
  //     "AI Transformation": AI,
  //     Code: Code,
  //     OneDrive: Onedrive,
  //     "Google Drive": GoogleDrive,
  //     mongo: mongodb,
  //     postgresql: Postgresql,
  //     salesforce: Salesforce,
  //     Zoho: Zoho,
  //   };
  //   return icons[name];
  // };

  const handleAccordionChange = (name) => (_, isExpanded) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [name]: isExpanded,
    }));
  };

  useEffect(() => {
    dispatch(GetServiceList());
  }, []);

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        height: "100%",
      }}
    >
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: "absolute",
          top: "10px",
          left: isOpen ? "300px" : "0px",
          zIndex: 1000,
          backgroundColor: "#fff",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
          marginLeft: "10px",
        }}
      >
        {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
      </IconButton>
      <Drawer
        sx={{
          width: isOpen ? 300 : 0,
          flexShrink: 0,
          transition: "width 0.3s ease-in-out",
          "& .MuiDrawer-paper": {
            width: isOpen ? 300 : 0,
            boxSizing: "border-box",
            position: "relative",
            padding: "1rem",
            overflowX: "hidden",
            height: "79vh",
          },
        }}
        variant="persistent"
        anchor="left"
        open={isOpen}
      >
        {/* Accordion for each node group */}
        {getallservices?.map((service) => (
          <Accordion
            key={service.ServiceID}
            expanded={expanded[service.ServiceID] || false}
            onChange={handleAccordionChange(service.ServiceID)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${service.ServiceID}-content`}
              id={`${service.ServiceID}-header`}
            >
              <Typography variant="bo">{service.ServiceName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {service.ServiceElements.map((element) => (
                  <ListItem
                    key={element.FlowServiceElementID}
                    onDragStart={(event) =>
                      onDragStart(event, element.ServiceElementName)
                    }
                    draggable
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 16px",
                      margin: "5px 0",
                      cursor: "move",
                      borderRadius: "4px",
                      borderBottom:
                        "1px solid var(--divider, rgba(0, 0, 0, 0.12))",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <ListItemIcon>
                        <img
                          src={geticons(service.ServiceName)}
                          alt={element.ServiceElementName}
                          style={{
                            width: "24px",
                            height: "24px",
                          }}
                        />
                      </ListItemIcon>
                      <Typography variant="caption">
                        {element.ServiceElementName}
                      </Typography>
                    </div>
                    <img
                      src={Vector}
                      alt="Vector"
                      style={{
                        width: "22px",
                        height: "22px",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Drawer>
    </div>
  );
};
