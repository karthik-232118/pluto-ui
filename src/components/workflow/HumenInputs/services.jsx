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
import TextInput from "../../../assets/svg/reactflow/TextInput.svg";
import { Delete, Add, AttachFile } from "@mui/icons-material";
import AutoComplateForms from "./AutoComplateForms";

const TextInputServices = () => {
  const [connection, setConnection] = useState(""); // State for Connection dropdown
  const [queryparams, setqueryprmas] = useState([]); // State for Body Type
  // Email sections
  const [sender, setSender] = useState({ name: "", email: "" });
  // const [receivers, setReceivers] = useState([{ email: "" }]);
  // const [ccList, setCcList] = useState([]);
  const [headers, setHeaders] = useState([]);
  // const [replyToList, setReplyToList] = useState([]);
  const [createDraft, setCreateDraft] = useState(false);
  const [continueOnFailure, setContinueOnFailure] = useState(false);
  const [retryOnFailure, setRetryOnFailure] = useState(false);

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

  return (
    <>
      {/* Header Section */}
      <Box className="RightSide_Bar_Header_Section">
        <img src={TextInput} height={60} alt="Email icon" />
        <Box>
          <Typography variant="h6">Text Input (Respond on UI)</Typography>
          <Typography variant="caption">
            Trigger a flow through human input.
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ marginY: 2 }} />

      {/* Create InProgress */}

      <AutoComplateForms />
      <Box>
        <Typography variant="subtitle1">Attachment</Typography>
        <TextField fullWidth value={sender.name} sx={{ marginBottom: 1 }} />
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

export default TextInputServices;
