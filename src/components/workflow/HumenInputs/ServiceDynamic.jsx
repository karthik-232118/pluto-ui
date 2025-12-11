import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Button,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Divider,
  Checkbox,
  Autocomplete,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { CleanHands, Close, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateConfigData } from "../../../store/flow/slice"; // Replace with your actual import path
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import AutoComplateForms from "./AutoComplateForms";
import ConfigerSharingData from "./ConfigerSharingData";

const ServiceDynamic = () => {
  const dispatch = useDispatch();
  const { id, name } = useSelector((state) => state.workflow.data);
  const { userList } = useSelector((state) => state.workflow);

  const nodeData = useSelector((state) => state.workflow.propertiesData);
  const configData = useSelector((state) => state.workflow.configData);
  const [title, setTitle] = useState(configData[id]?.title); // State for the title field
  const [fields, setFields] = useState([]);
  const [isEmailShared, setIsEmailShared] = useState(
    configData[id]?.isEmailShared || true
  );
  const [selectedFields, setSelectedFields] = useState(
    configData[id]?.sharedFields || {}
  );
  const [ownerData, setOwnerData] = useState(configData[id]?.owner || []);
  const [selectedUserIds, setSelectedUserIds] = useState(
    configData[id]?.owner?.map((user) => user.UserID) || []
  );
  const [startDate, setStartDate] = useState(configData[id]?.startDate || "");
  const [endDate, setEndDate] = useState(configData[id]?.endDate || "");
  const [notiFyAfter, setNotifyAfter] = useState(
    configData[id]?.notiFyAfter || 0
  );
  const [remindBefore, setRemindBefore] = useState(
    configData[id]?.remindBefore || 0
  );
  const [isSkipable, setIsSkipable] = useState(
    configData[id]?.isSkipable || false
  );
  const flowDataById = useSelector((state) => state.workflow.getflowdatafromId);
  const [parentLastDate, setParentLastDate] = useState("");
  const [childForms, setChildForms] = useState([]);
  useEffect(() => {
    // Populate form data on load
    const properties = configData[id];
    setFields(
      properties?.form?.map((field) => ({
        fieldName: field.label,
        fieldType: field.type,
        fieldDescription: field.placeholder,
        isRequired: field.required,
        options: field.type === "Select" ? field.options?.join(",") || "" : "",
      })) || []
    );
  }, [configData[id], id]);

  const handleFieldChange = (index, key, value) => {
    let updatedFields = JSON.parse(JSON.stringify(fields));
    updatedFields[index][key] = value;
    setFields(updatedFields);
    dispatchFields(updatedFields); // Dispatch updated fields on change
  };

  const handleAddField = () => {
    const newField = {
      fieldName: "",
      fieldType: "text",
      fieldDescription: "",
      isRequired: false,
      options: "",
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    dispatchFields(updatedFields); // Dispatch updated fields after adding a new field
  };

  const handleRemoveField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    dispatchFields(updatedFields); // Dispatch updated fields after removing a field
  };

  const dispatchFields = (updatedFields) => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          title,
          form: updatedFields.map((field) => ({
            label: field.fieldName,
            type: field.fieldType,
            options:
              field.fieldType === "Select"
                ? field.options.split(",").map((opt) => opt.trim())
                : undefined,
            placeholder: field.fieldDescription,
            required: field.isRequired,
          })),
        },
      })
    );
  };
  useEffect(() => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          title: title,
          isEmailShared: isEmailShared,
          owner: Array.isArray(selectedUserIds)
            ? userList.filter((user) => selectedUserIds.includes(user.UserID))
            : userList.filter((user) => user.UserID === selectedUserIds),
          startDate:
            new Date().toISOString().slice(0, 10) === startDate.slice(0, 10)
              ? new Date().toISOString()
              : startDate,
          endDate: endDate
            ? new Date(
                new Date(endDate).setHours(23, 59, 59, 999)
              ).toISOString()
            : null,
          notiFyAfter: notiFyAfter ? notiFyAfter : 0,
          remindBefore: remindBefore ? remindBefore : 0,
          isSkipable,
        },
      })
    );
  }, [
    title,
    id,
    isEmailShared,
    selectedUserIds,
    startDate,
    endDate,
    notiFyAfter,
    isSkipable,
  ]);
  const handleFieldSelections = (value, sid, key) => {
    const existingValue =
      (selectedFields[sid] &&
        JSON.parse(JSON.stringify(selectedFields[sid]))) ||
      [];
    if (value) {
      existingValue.push(key);
    } else {
      existingValue.splice(existingValue.indexOf(key), 1);
    }
    const updatedValue = { ...selectedFields, [sid]: existingValue };
    // console.log(updatedValue)
    setSelectedFields(updatedValue);
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          sharedFields: updatedValue,
        },
      })
    );
  };
  useEffect(() => {
    let latestDate = flowDataById.AccessStartDate;
    if (nodeData[id]) {
      for (const el of nodeData[id]) {
        for (const [k, v] of Object.entries(configData)) {
          if (el?.data?.parentIds?.some((x) => x.toString() === k.toString())) {
            if (
              (v.type === "Dynamic Form" || v.type === "Form API") &&
              latestDate < v.endDate
            ) {
              latestDate = v.endDate;
            }
          } else if (v?.type === "Dynamic Form") {
            setChildForms((prev) => [...prev, v]);
          }
        }
      }
    }
    setParentLastDate(latestDate);
  }, [nodeData[id], configData]);
  return (
    <>
      <FormGroup>
        <Typography variant="caption" className="form_lable">
          Form Title
        </Typography>
        <TextField
          className="text_input_workflow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <Typography variant="caption" className="form_lable">
          Start Date <span className="error">*</span>
        </Typography>
        <TextField
          className="text_input_workflow"
          type="date"
          value={startDate.slice(0, 10)}
          onChange={(e) => setStartDate(e.target.value)}
          inputProps={
            flowDataById?.AccessEndDate
              ? {
                  min: parentLastDate
                    ? parentLastDate.slice(0, 10)
                    : flowDataById?.AccessStartDate
                    ? flowDataById?.AccessStartDate?.split("T")[0]
                    : new Date().toISOString().slice(0, 10),
                  max: flowDataById?.AccessEndDate
                    ? flowDataById?.AccessEndDate?.split("T")[0]
                    : "",
                }
              : {
                  min: parentLastDate
                    ? parentLastDate.slice(0, 10)
                    : flowDataById?.AccessStartDate
                    ? flowDataById?.AccessStartDate?.split("T")[0]
                    : new Date().toISOString().slice(0, 10),
                }
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </FormGroup>
      <FormGroup>
        <Typography variant="caption" className="form_lable">
          End Date
        </Typography>
        <TextField
          className="text_input_workflow"
          type="date"
          defaultValue={
            endDate ? new Date(endDate).toISOString().slice(0, 10) : null
          }
          disabled={!startDate}
          onChange={(e) => setEndDate(e.target.value)}
          inputProps={{
            min: startDate
              ? startDate
              : flowDataById?.AccessStartDate
              ? flowDataById?.AccessStartDate?.split("T")[0]
              : new Date().toISOString().slice(0, 10),
            max: flowDataById?.AccessEndDate
              ? flowDataById?.AccessEndDate?.split("T")[0]
              : null,
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </FormGroup>
      <FormGroup>
        <Typography variant="caption" className="form_lable">
          Notify After (in Hours)
        </Typography>
        <TextField
          className="text_input_workflow"
          type="number"
          defaultValue={notiFyAfter}
          onChange={(e) => setNotifyAfter(Number(e.target.value))}
        />
      </FormGroup>
    {endDate &&  <FormGroup>
        <Typography variant="caption" className="form_lable">
          Reminder Before (in Days)
        </Typography>
        <TextField
          className="text_input_workflow"
          type="number"
          defaultValue={remindBefore}
          onChange={(e) => setRemindBefore(Number(e.target.value))}
        />
      </FormGroup>}
      <FormControlLabel
        sx={{
          fontWeight: "500",
          fontSize: "12px",
        }}
        control={
          <Checkbox
            checked={isSkipable}
            onChange={(e) => setIsSkipable(e.target.checked)}
            sx={{ padding: "0.5rem", fontWeight: "500", fontSize: "12px" }}
          />
        }
        label="Is Skipable"
      />
      <Divider sx={{ marginY: 2 }} />
      <FormControlLabel
        sx={{
          ".MuiFormControlLabel-label": {
            marginBottom: "0",
            fontWeight: "500",
            fontSize: "12px",
          },
        }}
        control={
          <Checkbox
            checked={isEmailShared}
            onChange={(e) => {
              setIsEmailShared(e.target.checked);
            }}
            disabled={true}
            sx={{
              fontWeight: "500",
              fontSize: "12px",
              // Added margin-bottom to the checkbox itself
              padding: "0.5rem", // Adjust padding if necessary
            }}
          />
        }
        label="Share Via Email"
      />
      {isEmailShared && (
        <Box>
          <Box>
            <FormControl sx={{ m: 1, width: "100%" }}>
              <Typography variant="caption">
                Choose User <span className="error">*</span>
              </Typography>

              <AutoComplateForms
                userList={userList}
                selectedUserIds={selectedUserIds}
                setSelectedUserIds={setSelectedUserIds}
              />
            </FormControl>
          </Box>
          <ConfigerSharingData
            nodeData={{ id, data: configData }}
            selectedFields={selectedFields}
            onSelectField={handleFieldSelections}
          />
          <Divider sx={{ marginY: 2 }} />
        </Box>
      )}
      <Typography variant="h6" mb={2}>
        Configure Form
      </Typography>
      {fields.map((field, index) => (
        <Box
          key={index}
          border={1}
          borderColor="grey.300"
          borderRadius={2}
          p={2}
          mb={2}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={-2}
            mt={-2}
          >
            <Typography variant="caption" marginBottom={1}>
              #{index + 1}
            </Typography>
            <IconButton
              onClick={() => handleRemoveField(index)}
              sx={{ color: "#000", marginRight: "-8px" }}
            >
              <Close />
            </IconButton>
          </Box>
          <FormGroup>
            <Typography variant="caption">Field Name</Typography>
            <TextField
              className="text_input_workflow"
              value={field.fieldName}
              onChange={(e) =>
                handleFieldChange(index, "fieldName", e.target.value)
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <Typography variant="caption"> Input Type</Typography>
            <Select
              className="text_input_workflow_select"
              value={field.fieldType}
              onChange={(e) =>
                handleFieldChange(index, "fieldType", e.target.value)
              }
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="time">Time</MenuItem>
              <MenuItem value="file">File</MenuItem>
              <MenuItem value="textarea">Text Area</MenuItem>
              <MenuItem value="checkbox">Checkbox</MenuItem>
              <MenuItem value="Select">Select</MenuItem>
            </Select>
          </FormGroup>
          {field.fieldType === "Select" && (
            <FormGroup>
              <Typography>Enter options (comma separated)</Typography>
              <TextField
                className="text_input_workflow"
                value={field.options}
                // className="text_input_workflow"
                onChange={(e) =>
                  handleFieldChange(index, "options", e.target.value)
                }
              />
            </FormGroup>
          )}
          <FormGroup>
            <Typography variant="caption" className="form_lable">
              Placeholder
            </Typography>
            <TextField
              className="text_input_workflow"
              value={field.fieldDescription}
              onChange={(e) =>
                handleFieldChange(index, "fieldDescription", e.target.value)
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={field.isRequired}
                  onChange={(e) =>
                    handleFieldChange(index, "isRequired", e.target.checked)
                  }
                />
              }
              label="Required"
            />
          </FormGroup>
        </Box>
      ))}

      <Button
        variant="outlined"
        onClick={handleAddField}
        sx={{
          borderColor: "#000",
          width: "auto",
          height: "30px",
          padding: "20px 10px",
          color: "#000",
          borderRadius: "5px",
        }}
      >
        Add Field
      </Button>
    </>
  );
};

export default ServiceDynamic;
