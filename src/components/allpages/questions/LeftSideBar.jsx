import  { useState, useEffect } from "react";
import {
  List,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  ListItemIcon,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDnD } from "./DnDContext";
import { useDispatch, useSelector } from "react-redux";
import { GetServiceList, openSidbar } from "../../../store/flow/action";
import { geticons } from "../../../utils";
import Vector from "../../../assets/svg/reactflow/drag.svg";
import { updateConfigData } from "../../../store/flow/slice";

// Give the component a display name for eslint
const LeftSideBar = () => {
  // eslint-disable-next-line no-unused-vars
  const [, setType] = useDnD();
  const [expanded, setExpanded] = useState({});
  const { getallservices } = useSelector((state) => state.workflow);
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.workflow.data);
  const configData = useSelector((state) => state.workflow.configData);

  const onClickOfServ = (newNode) => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          title: newNode.ServiceElementName,
        },
      })
    );
    dispatch(
      openSidbar({
        name: newNode.ServiceElementName,
        open: true,
        openService: true,
        id,
      })
    );
    if (newNode.ServiceElementName === "Table") {
      setType("table");
    }
  };

  const handleAccordionChange = (name) => (_, isExpanded) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [name]: isExpanded,
    }));
  };

  useEffect(() => {
    dispatch(GetServiceList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        overflow: "auto",
        overflowX: "hidden",
        height: "100%",
        scrollbarWidth: "none",
      }}
    >
      <Box
        sx={{
          width: "100%",
          padding: "1rem",
        }}
      >
        {/* Accordion for each node group */}
        {getallservices?.map((service) => (
          <Accordion
            key={service.ServiceID}
            expanded={!!expanded[service.ServiceID]}
            onChange={handleAccordionChange(service.ServiceID)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${service.ServiceID}-content`}
              id={`${service.ServiceID}-header`}
            >
              <Typography variant="body1">{service.ServiceName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {service.ServiceElements.map((element) => (
                  <ListItem
                    key={element.FlowServiceElementID}
                    onClick={() => onClickOfServ(element)}
                    draggable
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
      </Box>
    </div>
  );
};

export default LeftSideBar;
