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
  MenuItem,
  Select,
  Grid,
  FormGroup,
} from "@mui/material";
// import emailIcon from "../../../assets/svg/reactflow/email.svg";
import { Delete, Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateConfigData } from "../../../store/flow/slice";
import DataSelectorModal from "./DataSelectorModal";
import { useTranslation } from "react-i18next";

// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ServicesSenemail = () => {
  const { id } = useSelector((state) => state.workflow.data);
  const nodeData = useSelector((state) => state.workflow.propertiesData);
  const configData = useSelector((state) => state.workflow.configData);
  const [isSorceInput, setIsSourceInput] = useState(false);
  const [sourceInput, setSourceInput] = useState("");
  const [targetKey, setTargetKey] = useState("");
  const [sourceTitle, setSourceTitle] = useState(
    configData[id]?.title ? configData[id]?.title : "Gmail"
  );

  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const [formdata, setFormData] = useState({
    EmailRecipient: "",
    EmailSubject: "",
    BodyType: "text",
    MessageBody: "",
    CCEmails: [""],
    BCCEmails: [""],
  });

  const [ActionRequired, setActionRequired] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsSourceInput(!!nodeData[id]);
    if (!!nodeData[id]) {
      setSourceInput("Data From Source");
    } else {
      setSourceInput("");
    }
  }, [nodeData[id], id]);

  useEffect(() => {
    if (configData[id]) {
      setActionRequired(configData[id]?.ActionRequired);
      setSourceTitle(configData[id]?.title);
      setFormData(configData[id]);
    }
  }, [configData[id]]);

  // Handlers for email changes
  const handleEmailChange = (index, value, emailType) => {
    const updatedList = [...formdata[emailType]];
    updatedList[index] = value;
    const updatedData = { ...formdata, [emailType]: updatedList };
    setFormData(updatedData);
  };

  const handleAddEmail = (emailType) => {
    const updatedFieldData = { [emailType]: [...formdata[emailType], ""] };
    const updatedData = {
      ...formdata,
      ...updatedFieldData,
    };
    setFormData(updatedData);
    updateValue(updatedFieldData);
  };

  const handleRemoveEmail = (index, emailType) => {
    const updatedFieldData = {
      [emailType]: formdata[emailType].filter((_, i) => i !== index),
    };
    const updatedData = {
      ...formdata,
      [emailType]: formdata[emailType].filter((_, i) => i !== index),
    };
    setFormData(updatedData);
    updateValue(updatedFieldData);
  };
  useEffect(() => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          title: sourceTitle,
          ActionRequired,
        },
      })
    );
  }, [sourceTitle, ActionRequired]);

  // Function to handle adding a field from the modal
  const handleAddField = (field, key) => {
    // Create formatted string
    const formattedField = `{${field}}`;

    // Append the formatted field to MessageBody without commas
    const updatedMessageBody = `${formdata[key]}${formattedField}`;

    // Update the formdata state
    const updatedFormData = { ...formdata, [key]: updatedMessageBody };
    setFormData(updatedFormData);

    // Dispatch the updated config data
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          [key]: updatedMessageBody,
        },
      })
    );
  };

  const updateValue = (fieldData) => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          ...fieldData,
        },
      })
    );
  };

  return (
    <>
      <Box>
        <Box>
          <FormGroup container spacing={2}>
            <Typography variant="caption">
              Title <span className="error">*</span>
            </Typography>
            <TextField
              value={sourceTitle}
              onChange={(e) => setSourceTitle(e.target.value)}
              placeholder="Enter Title here"
              className="text_input_workflow"
            />
            {/* </Grid> */}
          </FormGroup>
        </Box>

        <Divider sx={{ marginY: 2 }} />
        <Box>
          <FormGroup container spacing={2}>
            <Typography variant="caption">
              To <span className="error">*</span>
            </Typography>
            <TextField
              className="text_input_workflow"
              placeholder="Recipient Email"
              value={formdata.EmailRecipient}
              onChange={(e) => {
                const updatedData = {
                  ...formdata,
                  EmailRecipient: e.target.value,
                };
                setFormData(updatedData);
                updateValue({ EmailRecipient: e.target.value });
              }}
            // onClick={() => {
            //   setModalOpen(true);
            //   setTargetKey("EmailRecipient");
            // }}
            />
          </FormGroup>
        </Box>
        {/* CC Section */}
        <FormGroup sx={{ marginBottom: 2 }}>
          <Typography variant="caption">CC</Typography>
          {formdata?.CCEmails?.map((item, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <TextField
                className="text_input_workflow"
                placeholder="CC email"
                value={item}
                onChange={(e) =>
                  handleEmailChange(index, e.target.value, "CCEmails")
                }
              />
              <IconButton
                onClick={() => handleRemoveEmail(index, "CCEmails")}
                color="error"
              >
                <Delete className="Delete_Icon" />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleAddEmail("CCEmails")}
            sx={{ textTransform: "none" }}
          >
            {t("Add CC")}
          </Button>
        </FormGroup>
        {/* BCC Section */}
        <FormGroup sx={{ marginBottom: 2 }}>
          <Typography variant="caption">BCC</Typography>
          {formdata?.BCCEmails?.map((item, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <TextField
                className="text_input_workflow"
                placeholder="BCC email"
                value={item}
                onChange={(e) =>
                  handleEmailChange(index, e.target.value, "BCCEmails")
                }
              />
              <IconButton
                onClick={() => handleRemoveEmail(index, "BCCEmails")}
                color="error"
              >
                <Delete className="Delete_Icon" />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleAddEmail("BCCEmails")}
            sx={{ textTransform: "none" }}
          >
            Add BCC
          </Button>
        </FormGroup>
        <FormGroup sx={{ marginBottom: 2 }}>
          <Typography variant="caption">
            Subject <span className="error">*</span>
          </Typography>
          <TextField
            className="text_input_workflow"
            value={formdata.EmailSubject}
            placeholder="Enter Email Subject"
            onChange={(e) => {
              const updatedData = {
                ...formdata,
                EmailSubject: e.target.value,
              };
              setFormData(updatedData);
              updateValue({ EmailSubject: e.target.value });
            }}
          // onClick={() => {
          //   setModalOpen(true);
          //   setTargetKey("EmailSubject");
          // }}
          />
        </FormGroup>
        <FormGroup>
          <Typography variant="caption">Body Type</Typography>
          <Select
            placeholder="Choose Body Type"
            className="text_input_workflow_select"
            value={formdata.BodyType || 'text'}
            onChange={(e) => {
              const updatedData = {
                ...formdata,
                BodyType: e.target.value,
              };
              setFormData(updatedData);
              updateValue({ BodyType: e.target.value });
            }}
          >
            <MenuItem value={"text"} >TEXT</MenuItem>
            <MenuItem value={"html"}>HTML</MenuItem>
          </Select>
        </FormGroup>

        {/* Body Section */}
        <FormGroup>
          <Typography variant="caption" marginBottom={2}>
            Body <span className="error">*</span>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formdata.MessageBody}
            onChange={(e) => {
              const updatedData = { ...formdata, MessageBody: e.target.value };
              setFormData(updatedData);
              updateValue({ MessageBody: e.target.value });
            }}
            // onClick={() => {
            //   setModalOpen(true);
            //   setTargetKey("MessageBody");
            // }}
            placeholder="Email Body"
          />
        </FormGroup>
        {/* Create InProgress Switch */}
        <Box sx={{ marginY: 2 }}>
          <FormControlLabel
            sx={{
              "& .MuiFormControlLabel-label": {
                marginBottom: "0px", // Correct marginBottom styling here
              },
            }}
            control={
              <Switch
                checked={ActionRequired}
                onChange={(e) => setActionRequired(e.target.checked)}
              />
            }
            label={
              <Box>
                <Typography variant="subtitle1">Email Action</Typography>
                <Typography variant="caption" color="textSecondary">
                  Requirement of update Status
                </Typography>
              </Box>
            }
            labelPlacement="start"
          />
        </Box>
      </Box>
      <DataSelectorModal
        nodeData={{ id, data: configData }}
        targetKey={targetKey}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddField} // Handle adding fields
      />
    </>
  );
};

export default ServicesSenemail;
