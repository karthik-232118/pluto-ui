import {
  Box,
  Divider,
  FormGroup,
  Grid,
  // MenuItem,
  // Select,
  TextField,
  Typography,
} from "@mui/material";
// import { useReactFlow } from "@xyflow/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateConfigData } from "../../../store/flow/slice";
import DataSelectorModal from "./DataSelectorModal";

const commonInputStyles = {
  marginBottom: 1,
  fontSize: "14px", // Custom font size

  "& .MuiInputBase-root": {
    height: "40px", // Custom height
    borderRadius: "8px", // Border radius
  },
};

export default function TextService() {
  const { id, name } = useSelector((state) => state.workflow.data);
  const nodeData = useSelector((state) => state.workflow.propertiesData);
  const configData = useSelector((state) => state.workflow.configData);
  const [value, setValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [sourceTitle, setSourceTitle] = useState(
    configData[id]?.title ? configData[id]?.title : "Concatenation"
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          value: value,
          title: sourceTitle,
        },
      })
    );
  }, [value, sourceTitle]);

  const handleAddField = (field) => {
    setPosition((prev) => {
      return `${prev}${/\{.*?\}/.test(prev) ? "," : " "}{${field}}`;
    });
  };

  return (
    <>
      <FormGroup>
        <Typography variant="subtitle1" className="title-label">
          Title <span className="error">*</span>
        </Typography>
        <TextField
          fullWidth
          value={sourceTitle}
          onChange={(e) => setSourceTitle(e.target.value)} // Handle title changes
          placeholder="Enter Title here"
          sx={commonInputStyles}
        />
      </FormGroup>
      <Divider />
      <FormGroup>
        <Typography variant="subtitle1" className="title-label">
          Concate Value <span className="error">*</span>
        </Typography>
        <TextField
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClick={() => setModalOpen(true)}
          placeholder="Concate Value Here"
          sx={commonInputStyles}
        />
      </FormGroup>
      <DataSelectorModal
        nodeData={{ id, data: configData }}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddField} // Handle adding fields
      />
    </>
  );
}
