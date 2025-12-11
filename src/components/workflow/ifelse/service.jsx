import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  FormGroup,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateConfigData } from "../../../store/flow/slice";
import DataSelectorModal from "./DataSelectorModal";

const TextInputServices = () => {
  const [rows, setRows] = useState([
    { value1: "", operation: "Equals", value2: "" },
  ]);
  const nodeData = useSelector((state) => state.workflow.propertiesData);
  const configData = useSelector((state) => state.workflow.configData);
  const { id, name } = useSelector((state) => state.workflow.data);
  const dispatch = useDispatch();
  const [sourceTitle, setSourceTitle] = useState(
    configData[id]?.title ? configData[id]?.title : "If"
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [targetKey, setTargetKey] = useState("");
  const [targetIndex, setTargetIndex] = useState("");
  const [joinType, setJoinType] = useState(
    configData[id]?.joinType ? configData[id]?.joinType : "AND"
  );
  // Predefined data types and operations
  const operations = [
    "Equals",
    "Not Equals",
    "Contains",
    "Does Not Contain",
    "Starts With",
    "Ends With",
    "Match Regex",
  ];
  const resStatus = [
    "Pending",
    "ActionRequired",
    "EmailActionRequired",
    "Success",
    "Failed",
    "WaitForEmailResponse",
    "LinkActionRequired",
  ];
  useEffect(() => {
    if (configData[id]?.rows) setRows(configData[id]?.rows);
  }, [configData[id]]);

  useEffect(() => {
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          title: sourceTitle,
          joinType,
        },
      })
    );
  }, [sourceTitle, joinType]);

  // Handle input change for a specific row
  const handleRowChange = (index, field, value) => {
    let updatedRows = JSON.parse(JSON.stringify(rows));
    updatedRows[index][field] = value;
    console.log(updatedRows);
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          rows: updatedRows,
        },
      })
    );
    setRows(updatedRows);
  };

  // Add a new row
  const handleAddRow = () => {
    setRows([...rows, { value1: "", operation: "", value2: "" }]);
  };

  // Remove a row
  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleAddField = (field, index, key) => {
    // Create formatted string
    const formattedField = `{${field}}`;
    const updatedfieldValue = `${rows[index][key]}${formattedField}`;
    const updatedFormData = JSON.parse(JSON.stringify(rows));
    updatedFormData[index][key] = updatedfieldValue;
    setRows(updatedFormData);

    // Dispatch the updated config data
    dispatch(
      updateConfigData({
        id: id,
        value: {
          ...configData[id],
          rows: updatedFormData,
        },
      })
    );
  };

  return (
    <>
      <FormGroup>
        <Typography variant="caption" marginBottom={2}>
          Title <span className="error">*</span>
        </Typography>
        <TextField
          fullWidth
          className="text_input_workflow"
          value={sourceTitle}
          onChange={(e) => setSourceTitle(e.target.value)} // Handle title changes
          placeholder="Enter Title here"
        />
      </FormGroup>
      <Divider sx={{ marginY: 2 }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 2,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="caption">Dynamic If-Else Rows</Typography>
        <ToggleButtonGroup
          value={joinType}
          size="small"
          color="primary"
          onChange={(e, value) => setJoinType(value)}
          exclusive
          aria-label="device"
        >
          <ToggleButton value="OR" aria-label="or condition">
            OR
          </ToggleButton>
          <ToggleButton value="AND" aria-label="and condition">
            AND
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Dynamic Rows */}
      {rows?.map((row, index) => (
        <Box
          key={index}
          sx={{
            marginBottom: 2,
          }}
        >
          <Divider sx={{ marginBottom: 2 }} />
          {/* Value 1 */}
          <FormGroup>
            <Typography variant="caption" marginBottom={2}>
              Value 1 <span className="error">*</span>
            </Typography>
            <TextField
              required
              className="text_input_workflow"
              value={row.value1}
              onChange={(e) => handleRowChange(index, "value1", e.target.value)}
              onClick={() => {
                setModalOpen(true);
                setTargetKey("value1");
                setTargetIndex(index);
              }}
            />
          </FormGroup>
          {/* Operation */}
          <Select
            value={row.operation}
            onChange={(e) =>
              handleRowChange(index, "operation", e.target.value)
            }
            className="text_input_workflow_select"
            displayEmpty
          >
            {operations.map((operation, i) => (
              <MenuItem key={i} value={operation}>
                {operation}
              </MenuItem>
            ))}
          </Select>

          {/* Value 2 */}
          {row.value1.includes("NodeExcutionSatus") ? (
            <Select
              value={row.value2}
              onChange={(e) => handleRowChange(index, "value2", e.target.value)}
              displayEmpty
              className="text_input_workflow_select"
            >
              <MenuItem value="">Select Status Value</MenuItem>
              {resStatus.map((res, i) => (
                <MenuItem key={i} value={res}>
                  {res}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <FormGroup>
              <Typography variant="caption" marginBottom={2}>
                {row.operation === "Match Regex" ? "Enter Regex" : "Value 2"}{" "}
                <span className="error">*</span>
              </Typography>
              <TextField
                required
                value={row.value2}
                className="text_input_workflow"
                onChange={(e) =>
                  handleRowChange(index, "value2", e.target.value)
                }
                onClick={() => {
                  setModalOpen(true);
                  setTargetKey("value2");
                  setTargetIndex(index);
                }}
                error={
                  row.operation === "Match Regex" &&
                  row.value2 &&
                  (() => {
                    try {
                      new RegExp(row.value2);
                      return false;
                    } catch {
                      return true;
                    }
                  })()
                }
                helperText={
                  row.operation === "Match Regex" &&
                  row.value2 &&
                  (() => {
                    try {
                      new RegExp(row.value2);
                      return "";
                    } catch {
                      return "Invalid Regex";
                    }
                  })()
                }
              />
            </FormGroup>
          )}

          {/* Remove Button */}
          <IconButton
            onClick={() => handleRemoveRow(index)}
            color="error"
            disabled={rows.length === 1} // Prevent removing the last row
          >
            <Delete className="error" />
          </IconButton>
        </Box>
      ))}

      {/* Add New Row Button */}
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={handleAddRow}
        sx={{ marginTop: 2 }}
      >
        Add Row
      </Button>
      <DataSelectorModal
        nodeData={{ id, data: configData }}
        targetKey={targetKey}
        targetIndex={targetIndex}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddField} // Handle adding fields
      />
    </>
  );
};

export default TextInputServices;
