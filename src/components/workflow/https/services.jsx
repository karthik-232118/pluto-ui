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
import webhook from "../../../assets/svg/reactflow/Webhook.svg";
import { Delete, Add, AttachFile } from "@mui/icons-material";
import { useSelector } from "react-redux";

const HttpServices = () => {
  const configData = useSelector((state) => state.workflow.configData);
  const { id, name } = useSelector((state) => state.workflow.data);
  const [connection, setConnection] = useState(configData[id].connection ? configData[id].connection : "GET");
  const [queryparams, setqueryprmas] = useState(configData[id].queryparams ? configData[id].queryparams : []);
  const [url, setUrl] = useState(configData[id].url ? configData[id].url : "");
  const [headers, setHeaders] = useState(configData[id].headers ? configData[id].headers : []);
  const [body, setBody] = useState(configData[id].body ? configData[id].body : []);
  const [continueOnFailure, setContinueOnFailure] = useState(configData[id].continueOnFailure ? configData[id].continueOnFailure : false);
  const [retryOnFailure, setRetryOnFailure] = useState(configData[id].retryOnFailure ? configData[id].retryOnFailure : false);
  const [title, setTitle] = useState(configData[id]?.title ? configData[id]?.title : "HTTP Call")
  // Attachment state

  // Generic handler to update email fields
  const handleFieldChange = (index, value, setter) => {
    const updatedList = [...setter];
    updatedList[index].email = value;
    setter(updatedList);
  };

  // Add a new email field
  const handleAddField = (setter) => {
    setter((prev) => [...prev, { email: "" }]);
  };

  // Remove an email field
  const handleRemoveField = (index, setter) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Box>
        <Typography variant="subtitle1">Title</Typography>
        <TextField
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Handle title changes
          placeholder="Enter Title here"
        />
      </Box>
      <Divider sx={{ marginY: 2 }} />
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">Method</Typography>
        <Select fullWidth value={connection} onChange={(e) => setConnection(e.target.value)}>
          <MenuItem value="GET">GET</MenuItem>
          <MenuItem value="POST">POST</MenuItem>
          <MenuItem value="PUT">PUT</MenuItem>
          <MenuItem value="DELETE">DELETE</MenuItem>
          <MenuItem value="PATCH">PATCH</MenuItem>
          <MenuItem value="HEAD">HEAD</MenuItem>
        </Select>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">Url</Typography>
          <TextField
            fullWidth
            label=""
            placeholder="Enter/Paste URL"
            value={setUrl}
            onChange={(e) => setUrl({ ...sender, name: e.target.value })}
            sx={{ marginBottom: 1 }}
          />
          <Typography variant="subtitle1">
            The full URL to use, including the base URL
          </Typography>
        </Box>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">
          Headers
        </Typography>
        {headers.map((item, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 1, marginY: 1 }}
          >
            <TextField
              fullWidth
              placeholder=""
              value={item.key}
              onChange={(e) =>
                handleFieldChange(index, e.target.value, setHeaders)
              }
            />
            <TextField
              fullWidth
              placeholder=""
              value={item.value}
              onChange={(e) =>
                handleFieldChange(index, e.target.value, setHeaders)
              }
            />
            <IconButton
              onClick={() => handleRemoveField(index, setHeaders)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => handleAddField(setHeaders)}
          sx={{ textTransform: "none" }}
        >
          Add Item
        </Button>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">
          Query Parameters
        </Typography>
        {queryparams.map((item, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 1, marginY: 1 }}
          >
            <TextField
              fullWidth
              placeholder=""
              value={item.key}
              onChange={(e) =>
                handleFieldChange(index, e.target.value, setqueryprmas)
              }
            />
            <TextField
              fullWidth
              placeholder=""
              value={item.value}
              onChange={(e) =>
                handleFieldChange(index, e.target.value, setqueryprmas)
              }
            />
            <IconButton
              onClick={() => handleRemoveField(index, setqueryprmas)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => handleAddField(setqueryprmas)}
          sx={{ textTransform: "none" }}
        >
          Add Item
        </Button>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1">
          Body
        </Typography>
        {body.map((item, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 1, marginY: 1 }}
          >
            <TextField
              fullWidth
              placeholder=""
              value={item.key}
              onChange={(e) =>
                handleFieldChange(index, e.target.value, setBody)
              }
            />
            <TextField
              fullWidth
              placeholder=""
              value={item.value}
              onChange={(e) =>
                handleFieldChange(index, e.target.value, setBody)
              }
            />
            <IconButton
              onClick={() => handleRemoveField(index, setBody)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => handleAddField(setBody)}
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
    </>
  );
};

export default HttpServices;
