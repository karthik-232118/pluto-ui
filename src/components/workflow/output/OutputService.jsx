import {
  Box,
  Divider,
  styled,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { useHandleConnections, useNodesData } from "@xyflow/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateConfigData } from "../../../store/flow/slice";

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Textarea = styled(TextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }
  
    /* firefox */
    &:focus-visible {
      outline: 0;
    }
  `
);
export default function OutputService() {
  const { id, name } = useSelector((state) => state.workflow.data);
  const nodeData = useSelector((state) => state.workflow.propertiesData);
  const [isSorceInput, setIsSourceInput] = useState(false);
  const [sourceInput, setSourceInput] = useState("");
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const serviceList = useSelector((state) => state.workflow.getallservices);
  const [serviceId, setServiceId] = useState("");
  useEffect(() => {
    for (const el of serviceList) {
      for (const item of el.ServiceElements) {
        console.log(item.ServiceElementName === name);
        if (item.ServiceElementName === name) {
          setServiceId(item.FlowServiceElementID);
        }
      }
    }
  }, [serviceList, name]);
  useEffect(() => {
    setIsSourceInput(!!nodeData[id]);
    if (nodeData[id]) {
      setSourceInput("Data From Source");
    } else {
      setSourceInput("");
    }
  }, [nodeData[id], id]);
  useEffect(() => {
    if (nodeData[id]) {
      setValue(JSON.stringify(nodeData[id]));
    } else {
      setValue(sourceInput);
    }
  }, [nodeData[id], sourceInput]);
  useEffect(() => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ServiceID: serviceId,
        },
      })
    );
  }, [serviceId]);
  return (
    <>
     
      <Box>
        <Typography variant="subtitle1">Input</Typography>
        <TextField
          fullWidth
          value={sourceInput}
          disabled={isSorceInput}
          onChange={(e) => setSourceInput(e.target.value)}
          placeholder="Enter Inputs here"
        />
      </Box>
      <Divider />
      <Box>
        <Typography variant="subtitle1">Output</Typography>
        <Textarea disabled value={value} minRows={3} placeholder="Output" />
      </Box>
    </>
  );
}
