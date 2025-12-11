import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
} from "@mui/material";

const Convertjsontocsv = () => {
  // State Variables
  // const [sender, setSender] = useState({ name: "" });
  const [continueOnFailure, setContinueOnFailure] = useState(false);
  const [retryOnFailure, setRetryOnFailure] = useState(false);
  const [delimiter, setDelimiter] = useState(",");
  const [jsonInput, setJsonInput] = useState(""); // JSON input state

  // Handle JSON input validation
  const handleJsonInputChange = (e) => {
    const value = e.target.value;
    setJsonInput(value);
  };

  return (
    <>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">Delimiter</Typography>
        <Select
          fullWidth
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
        >
          <MenuItem value=",">Comma (,)</MenuItem>
          <MenuItem value=";">Semicolon (;)</MenuItem>
          <MenuItem value="|">Pipe (|)</MenuItem>
          <MenuItem value="\t">Tab</MenuItem>
        </Select>
      </Box>

      {/* JSON Input Section */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">JSON Input</Typography>
        <TextField
          fullWidth
          label="Enter JSON Text"
          multiline
          rows={4}
          value={jsonInput}
          onChange={handleJsonInputChange}
          sx={{ marginBottom: 1 }}
        />
        <Typography variant="caption" color="textSecondary">
          Enter valid JSON text for additional processing.
        </Typography>
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
            <Box>
              <Typography variant="subtitle1">Continue on Failure</Typography>
              <Typography variant="caption" color="textSecondary">
                Enable this option to skip this step and continue the flow
                normally if it fails.
              </Typography>
            </Box>
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

export default Convertjsontocsv;
