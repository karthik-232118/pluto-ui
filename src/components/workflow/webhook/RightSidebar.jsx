import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDnD } from "./DnDContext";
import { useDispatch, useSelector } from "react-redux";
import { GetServiceList } from "../../store/flow/action";
import { geticons } from "../../utils";

const RightSidebar = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [_, setType] = useDnD();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetServiceList());
  }, [dispatch]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <IconButton onClick={handleDrawerOpen} style={{ position: "absolute", right: 0, top: 0 }}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleDrawerClose}
        sx={{ width: "250px" }}
      >
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
        <List>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleAccordionChange("panel1")}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Services</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Render your services list here */}
              <List>
                {/* Example service item */}
                <ListItem button>
                  <ListItemIcon>{/* Add icon if needed */}</ListItemIcon>
                  <Typography>Service Name</Typography>
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        </List>
      </Drawer>
    </>
  );
};

export default RightSidebar;
