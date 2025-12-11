import React, { useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  TextField,
  Typography,
  Button,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
} from "@mui/material";
import imageHelper from "../../../assets/svg/reactflow/ImageHelper.svg";

const CompressImage = () => {
  // State Variables
  const [sender, setSender] = useState({ name: "" });
  const [continueOnFailure, setContinueOnFailure] = useState(false);
  const [retryOnFailure, setRetryOnFailure] = useState(false);
  const [quality, setQuality] = useState("High");
  const [format, setFormat] = useState("JPG");

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <img src={imageHelper} height={60} alt="Email icon" />
        <Box>
          <Typography variant="h6">Image Helper (Crop an image)</Typography>
          <Typography variant="caption">
            Tools for image manipulations
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ marginY: 2 }} />

      {/* Quality Section */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">
          Image <span>*</span>
        </Typography>
        <TextField
          fullWidth
          value={sender.name}
          onChange={(e) => setSender({ ...sender, name: e.target.value })}
          sx={{ marginBottom: 1 }}
        />{" "}
      </Box>

      {/* Format Section */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">
          Left <span>*</span>
        </Typography>
        <TextField
          fullWidth
          value={sender.name}
          onChange={(e) => setSender({ ...sender, name: e.target.value })}
          sx={{ marginBottom: 1 }}
        />
      </Box>

      {/* File Name Section */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">
          Top <span>*</span>
        </Typography>
        <TextField
          fullWidth
          value={sender.name}
          onChange={(e) => setSender({ ...sender, name: e.target.value })}
          sx={{ marginBottom: 1 }}
        />{" "}
        <Typography variant="subtitle1">
          {/* Specifies the output file name for the result image (without
          extension). */}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">
          Widht <span>*</span>
        </Typography>
        <TextField
          fullWidth
          value={sender.name}
          onChange={(e) => setSender({ ...sender, name: e.target.value })}
          sx={{ marginBottom: 1 }}
        />{" "}
        <Typography variant="subtitle1">
          {/* Specifies the output file name for the result image (without
          extension). */}
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">
          Height<span>*</span>
        </Typography>
        <TextField
          fullWidth
          value={sender.name}
          onChange={(e) => setSender({ ...sender, name: e.target.value })}
          sx={{ marginBottom: 1 }}
        />{" "}
        <Typography variant="subtitle1">
          {/* Specifies the output file name for the result image (without
          extension). */}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">
          Result file Name<span>*</span>
        </Typography>
        <TextField
          fullWidth
          value={sender.name}
          onChange={(e) => setSender({ ...sender, name: e.target.value })}
          sx={{ marginBottom: 1 }}
        />{" "}
        <Typography variant="subtitle1">
          {/* Specifies the output file name for the result image (without
          extension). */}
        </Typography>
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
          sx={{ justifyContent: "space-between", marginY: 1 }}
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
            <Box>
              <Typography variant="subtitle1">Continue on Failure</Typography>
              <Typography variant="caption" color="textSecondary">
                Enable this option to skip this step and continue the flow
                normally if it fails.
              </Typography>
            </Box>
          }
          labelPlacement="start"
          sx={{ justifyContent: "space-between", marginY: 1 }}
        />
      </Box>
    </Box>
  );
};

export default CompressImage;
