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
} from "@mui/material";
import { useDnD } from "./DnDContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { GetServiceList } from "../../store/flow/action";
import { openServiceforShapes } from "../../store/flow/slice";
import { geticons } from "../../utils";

export default () => {
  const [_, setType] = useDnD();
  const [expanded, setExpanded] = useState({});
  const { getallservices, opneReplaceShape } = useSelector(
    (state) => state.workflow
  );

  const dispatch = useDispatch();
  // Helper function to handle right-click and open the menu

  const onClose = () => {
    dispatch(
      openServiceforShapes({
        open: !opneReplaceShape.open,
        newnode: opneReplaceShape.newnode,
      })
    );
  };

  const handleAccordionChange = (name) => (_, isExpanded) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [name]: isExpanded,
    }));
  };

  useEffect(() => {
    dispatch(GetServiceList());
  }, []);
  const onclickOnservice = (e) => {
    dispatch(
      openServiceforShapes({
        open: !opneReplaceShape.open,
        newnode: e,
      })
    );
  };
  return (
    <Drawer
      sx={{
        width: 400,
        "& .MuiDrawer-paper": {
          width: 400,
          padding: "1rem",
          borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
          marginTop: "69px",
          marginBottom: "69px",
          zIndex: 0,
        },
      }}
      anchor="right"
      variant="temporary"
      open={opneReplaceShape?.open}
      onClose={() => {
        onClose();
      }}
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
                  onClick={() =>
                    // onDragStart(event, element.ServiceElementName)
                    onclickOnservice(element)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 16px",
                    margin: "5px 0",
                    cursor: "pointer",
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
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Drawer>
  );
};
