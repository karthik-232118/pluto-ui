import React, { useEffect, useState } from "react";
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
  Grid,
} from "@mui/material";
import { Delete, Add, AttachFile } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateConfigData } from "../../../store/flow/slice";

const commonInputStyles = {
  marginBottom: 1,
  fontSize: "14px", // Custom font size

  "& .MuiInputBase-root": {
    height: "40px", // Custom height
    borderRadius: "8px", // Border radius
  },
};

const ServocesCustomEmailApi = () => {
  const [connection, setConnection] = useState(""); // State for Connection dropdown
  const [queryparams, setqueryprmas] = useState([]); // State for Body Type
  const nodeData = useSelector((state) => state.workflow.propertiesData);
  const { id, name } = useSelector((state) => state.workflow.data);
  const [sender, setSender] = useState({ name: "", email: "" });
  const [receivers, setReceivers] = useState([{ email: "" }]);
  const [ccList, setCcList] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [replyToList, setReplyToList] = useState([]);
  const [createDraft, setCreateDraft] = useState(false);
  const [continueOnFailure, setContinueOnFailure] = useState(false);
  const [retryOnFailure, setRetryOnFailure] = useState(false);
  const configData = useSelector((state) => state.workflow.configData);
  const [sourceTitle, setSourceTitle] = useState(
    configData[id]?.title ? configData[id]?.title : "Gmail"
  );
  const dispatch = useDispatch();

  // Attachment state

  // Generic handler to update email fields
  const handleEmailChange = (index, value, setter) => {
    const updatedList = [...setter];
    updatedList[index].email = value;
    setter(updatedList);
  };

  // Add a new email field
  const handleAddEmail = (setter) => {
    setter((prev) => [...prev, { email: "" }]);
  };

  // Remove an email field
  const handleRemoveEmail = (index, setter) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          title: sourceTitle,
        },
      })
    );
  }, [sourceTitle]);
  return (
    <>
      <Box sx={{ marginTop: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" className="title-label">
              title{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} md={10}>
            <TextField
              value={sourceTitle}
              onChange={(e) => setSourceTitle(e.target.value)}
              placeholder="Enter Title here"
              className="title-textfield"
              InputProps={{
                style: {
                  height: "40px", // Adjust the height as needed
                  padding: "0 8px", // Adjust padding for content alignment
                  borderRadius: "8px",
                  borderColor: "#E0E0E0",
                  fontSize: "14px",
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Box sx={{ marginTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" className="title-label">
                Url
              </Typography>
            </Grid>
            <Grid item xs={6} md={10}>
              <TextField
                fullWidth
                label="Sender Name"
                value={sender.name}
                onChange={(e) => setSender({ ...sender, name: e.target.value })}
                size="small"
                sx={commonInputStyles}
              />
            </Grid>
          </Grid>
        </Box>
        <Typography variant="subtitle1" className="title-label">
          The full URL to use, including the base URL
        </Typography>
      </Box>

      {/* CC Section */}
      <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" className="title-label">
              Method
            </Typography>
          </Grid>
          <Grid item xs={6} md={10}>
            <Select
              fullWidth
              value={connection}
              sx={{
                height: "40px", // Set the desired height
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E0E0E0", // Set border color
                  borderRadius: "8px", // Set border radius
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#B0B0B0", // Set border color on hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#B0B0B0", // Set border color when focused
                },
                "& .MuiInputBase-input": {
                  padding: "8px", // Adjust padding for better alignment
                },
              }}
            >
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
              <MenuItem value="PATCH">PATCH</MenuItem>
              <MenuItem value="HEAD">HEAD</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1" className="title-label">
          Headers <span>*</span>
        </Typography>
        {headers.map((item, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 1, marginY: 1 }}
          >
            <TextField
              fullWidth
              placeholder=""
              value={item.email}
              onChange={(e) =>
                handleEmailChange(index, e.target.value, setHeaders)
              }
              sx={commonInputStyles}
            />
            <TextField
              fullWidth
              placeholder=""
              value={item.email}
              onChange={(e) =>
                handleEmailChange(index, e.target.value, setHeaders)
              }
              sx={commonInputStyles}
            />
            <IconButton
              onClick={() => handleRemoveEmail(index, setHeaders)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => handleAddEmail(setHeaders)}
          sx={{ textTransform: "none" }}
        >
          Add Item
        </Button>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1" className="title-label">
          Query Parameters <span>*</span>
        </Typography>
        {queryparams.map((item, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 1, marginY: 1 }}
          >
            <TextField
              fullWidth
              placeholder=""
              value={item.email}
              onChange={(e) =>
                handleEmailChange(index, e.target.value, setqueryprmas)
              }
              sx={commonInputStyles}
            />
            <TextField
              fullWidth
              placeholder=""
              value={item.email}
              onChange={(e) =>
                handleEmailChange(index, e.target.value, setqueryprmas)
              }
              sx={commonInputStyles}
            />
            <IconButton
              onClick={() => handleRemoveEmail(index, setqueryprmas)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => handleAddEmail(setqueryprmas)}
          sx={{ textTransform: "none" }}
        >
          Add Item
        </Button>
      </Box>
      {/* Create InProgress */}
      <Box sx={{ marginY: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={createDraft}
              onChange={(e) => setCreateDraft(e.target.checked)}
            />
          }
          label={
            <Box>
              <Typography variant="subtitle1" className="title-label">
                No Error Failure
              </Typography>
            </Box>
          }
          labelPlacement="start"
          sx={{ justifyContent: "space-between", marginY: 1 }}
        />
      </Box>

      <Box>
        <Typography variant="subtitle1" className="title-label">
          Time Out in(seconds){" "}
        </Typography>
        <TextField fullWidth placeholder="" sx={commonInputStyles} />
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
              <Typography variant="subtitle1" className="title-label">
                Continue on Failure
              </Typography>
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
              <Typography variant="subtitle1" className="title-label">
                Retry on Failure
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Automatically retry up to four attempts when failed.
              </Typography>
            </Box>
          }
          labelPlacement="start"
          sx={{ justifyContent: "space-between", marginY: 1 }}
        />
      </Box>
    </>
  );
};

export default ServocesCustomEmailApi;
