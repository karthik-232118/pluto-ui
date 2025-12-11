import React, { useState } from "react";
import {
  Box,
  Divider,
  Typography,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import * as XLSX from "xlsx";
import { useReactFlow } from "@xyflow/react";
import { useSelector } from "react-redux";

const XlsxToJsonConverter = () => {
  // State variables for the component
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [continueOnFailure, setContinueOnFailure] = useState(false);
  const [retryOnFailure, setRetryOnFailure] = useState(false);
  const { getallservices, getflowdatafromId } = useSelector(
    (state) => state.workflow
  );
  const { id } = useSelector((state) => state.workflow.data);
  // const [delimiter, setDelimiter] = useState(",");
  // State to dynamically update the title text
  const { updateNodeData } = useReactFlow();
  // Handle input change and update node data
  const onChange = (newValue) => {
    if (updateNodeData) {
      updateNodeData(id, { value: newValue });
    }
  };

  const convertXlsxToJson = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // Assuming we're converting the first sheet to JSON
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
      setJsonData(json);
      onChange(json);
    };

    reader.readAsBinaryString(file);
  };

  // Handle file upload and convert XLSX to JSON
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      convertXlsxToJson(uploadedFile);
    }
  };

  return (
    <>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">Upload XLSX File</Typography>
        <TextField
          fullWidth
          onChange={handleFileUpload}
          type="file"
          accept=".xlsx, .xls"
          sx={{ marginBottom: 1 }}
        />
      </Box>

      {/* Continue on Failure */}
      <Box sx={{ marginY: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={continueOnFailure}
              onChange={(e) => setContinueOnFailure(e.target.checked)}
            />
          }
          label={
            <Typography variant="subtitle1">Continue on Failure</Typography>
          }
          labelPlacement="start"
          sx={{ justifyContent: "space-between" }}
        />
      </Box>

      {/* Retry on Failure */}
      <Box sx={{ marginY: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={retryOnFailure}
              onChange={(e) => setRetryOnFailure(e.target.checked)}
            />
          }
          label={
            <Box>
              <Typography variant="subtitle1">Retry on Failure</Typography>
              <Typography variant="caption" color="textSecondary">
                Automatically retry up to four attempts when failed.
              </Typography>
            </Box>
          }
          labelPlacement="start"
          sx={{ justifyContent: "space-between" }}
        />
      </Box>
    </>
  );
};

export default XlsxToJsonConverter;
