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
import { Delete, Add, AttachFile } from "@mui/icons-material";

const ImageRisze = () => {
  // Email sections
  const [sender, setSender] = useState({ name: "", email: "" });
  const [continueOnFailure, setContinueOnFailure] = useState(false);
  const [retryOnFailure, setRetryOnFailure] = useState(false);

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <img src={imageHelper} height={60} alt="Email icon" />
        <Box>
          <Typography variant="h6">Image Helper (Resize Image)</Typography>
          <Typography variant="caption">
            Tools for image manipulations
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ marginY: 2 }} />
      <Box sx={{ marginBottom: 2 }}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">Image</Typography>
          <TextField
            fullWidth
            label="Sender Name"
            value={sender.name}
            onChange={(e) => setSender({ ...sender, name: e.target.value })}
            sx={{ marginBottom: 1 }}
          />
          <Typography variant="subtitle1">To Convert</Typography>
        </Box>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">Height</Typography>
          <TextField
            fullWidth
            value={sender.name}
            onChange={(e) => setSender({ ...sender, name: e.target.value })}
            sx={{ marginBottom: 1 }}
          />
          <Typography variant="subtitle1">
            Specifies the height of the image.
          </Typography>
        </Box>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">Widht</Typography>
          <TextField
            fullWidth
            label="Widht"
            value={sender.name}
            onChange={(e) => setSender({ ...sender, name: e.target.value })}
            sx={{ marginBottom: 1 }}
          />
          <Typography variant="subtitle1">
            Specifies the width of the image.
          </Typography>
        </Box>
      </Box>
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
              <Typography variant="subtitle1">
                Maintain aspect ratio for height
              </Typography>
            </Box>
          }
          labelPlacement="start"
          sx={{ justifyContent: "space-between", marginY: 1 }}
        />
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">Result File Name</Typography>
          <TextField
            fullWidth
            label="Widht"
            value={sender.name}
            onChange={(e) => setSender({ ...sender, name: e.target.value })}
            sx={{ marginBottom: 1 }}
          />
          <Typography variant="subtitle1">
            Specifies output file name for the Result image without.
          </Typography>
        </Box>
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

export default ImageRisze;
