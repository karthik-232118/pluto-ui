import {
  Box,
  Divider,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useReactFlow } from "@xyflow/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateConfigData } from "../../../store/flow/slice";
import DataSelectorModal from "./DataSelectorModal";

export default function TextFindService() {
  const { id, name } = useSelector((state) => state.workflow.data);
  const nodeData = useSelector((state) => state.workflow.propertiesData);
  const configData = useSelector((state) => state.workflow.configData);
  const [isSorceInput, setIsSourceInput] = useState(false);
  const [sourceInput, setSourceInput] = useState("");
  const [sourceTitle, setSourceTitle] = useState(
    configData[id]?.title ? configData[id]?.title : "Find"
  );
  const [value, setValue] = useState(
    configData[id]?.value ? configData[id]?.value : ""
  );
  const [position, setPosition] = useState(
    configData[id]?.position ? configData[id]?.position : ""
  );

  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          value: value,
          title: sourceTitle,
          position,
        },
      })
    );
  }, [value, sourceTitle, position]);

  const handleAddField = (field) => {
    setPosition((prev) => {
      return `${prev}${/\{.*?\}/.test(prev) ? "," : " "}{${field}}`;
    });
  };
  return (
    <>
      <Box>
        <Typography variant="subtitle1">Title</Typography>
        <TextField
          fullWidth
          value={sourceTitle}
          onChange={(e) => setSourceTitle(e.target.value)}
          placeholder="Enter Title here"
        />
      </Box>
      <Divider />
      <Box>
        <Typography variant="subtitle1">Find Value</Typography>
        <TextField
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Find Value Here"
        />
      </Box>
      <Box>
        <Typography variant="subtitle1">Find Position</Typography>
        <TextField
          fullWidth
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          onClick={() => setModalOpen(true)}
          placeholder="Postion Value Here"
        />
      </Box>
      <DataSelectorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddField}
        nodeData={{ id, data: configData }}
      />
    </>
  );
}
