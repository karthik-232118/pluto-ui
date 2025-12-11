import { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Box,
  Autocomplete,
} from "@mui/material";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const diagrams = {
  "SOP 1": {
    nodes: [
      { id: "1", data: { label: "Start SOP 1" }, position: { x: 0, y: 0 } },
      {
        id: "2",
        data: { label: "Initial Review" },
        position: { x: 250, y: 0 },
      },
      {
        id: "3",
        data: { label: "Risk Assessment" },
        position: { x: 500, y: -100 },
      },
      {
        id: "4",
        data: { label: "Mitigation Plan" },
        position: { x: 500, y: 100 },
      },
      {
        id: "5",
        data: { label: "Management Approval" },
        position: { x: 750, y: 0 },
      },
      { id: "6", data: { label: "End SOP 1" }, position: { x: 1000, y: 0 } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e2-4", source: "2", target: "4" },
      { id: "e3-5", source: "3", target: "5" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" },
    ],
  },

  "SOP 2": {
    nodes: [
      { id: "1", data: { label: "Start SOP 2" }, position: { x: 0, y: 0 } },
      { id: "2", data: { label: "Task Planning" }, position: { x: 250, y: 0 } },
      {
        id: "3",
        data: { label: "Task Assignment" },
        position: { x: 500, y: -100 },
      },
      {
        id: "4",
        data: { label: "Execution Phase" },
        position: { x: 500, y: 100 },
      },
      { id: "5", data: { label: "QA Review" }, position: { x: 750, y: -50 } },
      {
        id: "6",
        data: { label: "Rework (if any)" },
        position: { x: 750, y: 150 },
      },
      {
        id: "7",
        data: { label: "Final Submit" },
        position: { x: 1000, y: 50 },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e2-4", source: "2", target: "4" },
      { id: "e3-5", source: "3", target: "5" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" },
      { id: "e6-7", source: "6", target: "7" },
      { id: "e5-7", source: "5", target: "7" },
    ],
  },

  "SOP 3": {
    nodes: [
      { id: "1", data: { label: "Start SOP 3" }, position: { x: 0, y: 200 } },
      {
        id: "2",
        data: { label: "Requirement Gathering" },
        position: { x: 200, y: 200 },
      },
      {
        id: "3",
        data: { label: "Stakeholder Interviews" },
        position: { x: 400, y: 100 },
      },
      {
        id: "4",
        data: { label: "Document Analysis" },
        position: { x: 400, y: 300 },
      },
      {
        id: "5",
        data: { label: "Feasibility Study" },
        position: { x: 600, y: 200 },
      },
      {
        id: "6",
        data: { label: "Design Phase" },
        position: { x: 800, y: 100 },
      },
      {
        id: "7",
        data: { label: "Architecture Planning" },
        position: { x: 800, y: 300 },
      },
      {
        id: "8",
        data: { label: "Design Review" },
        position: { x: 1000, y: 200 },
      },
      {
        id: "9",
        data: { label: "Development Phase" },
        position: { x: 1200, y: 100 },
      },
      {
        id: "10",
        data: { label: "Code Review" },
        position: { x: 1200, y: 300 },
      },
      {
        id: "11",
        data: { label: "Integration & Build" },
        position: { x: 1400, y: 200 },
      },
      {
        id: "12",
        data: { label: "Testing - QA" },
        position: { x: 1600, y: 100 },
      },
      {
        id: "13",
        data: { label: "Testing - UAT" },
        position: { x: 1600, y: 300 },
      },
      {
        id: "14",
        data: { label: "Security Audit" },
        position: { x: 1800, y: 200 },
      },
      {
        id: "15",
        data: { label: "Client Approval" },
        position: { x: 2000, y: 200 },
      },
      {
        id: "16",
        data: { label: "Production Deployment" },
        position: { x: 2200, y: 200 },
      },
      {
        id: "17",
        data: { label: "Monitoring & Logs" },
        position: { x: 2400, y: 100 },
      },
      {
        id: "18",
        data: { label: "Post-Deployment Review" },
        position: { x: 2400, y: 300 },
      },
      {
        id: "19",
        data: { label: "Feedback Loop" },
        position: { x: 2600, y: 200 },
      },
      {
        id: "20",
        data: { label: "Post-Support" },
        position: { x: 2800, y: 200 },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e2-4", source: "2", target: "4" },
      { id: "e3-5", source: "3", target: "5" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" },
      { id: "e5-7", source: "5", target: "7" },
      { id: "e6-8", source: "6", target: "8" },
      { id: "e7-8", source: "7", target: "8" },
      { id: "e8-9", source: "8", target: "9" },
      { id: "e8-10", source: "8", target: "10" },
      { id: "e9-11", source: "9", target: "11" },
      { id: "e10-11", source: "10", target: "11" },
      { id: "e11-12", source: "11", target: "12" },
      { id: "e11-13", source: "11", target: "13" },
      { id: "e12-14", source: "12", target: "14" },
      { id: "e13-14", source: "13", target: "14" },
      { id: "e14-15", source: "14", target: "15" },
      { id: "e15-16", source: "15", target: "16" },
      { id: "e16-17", source: "16", target: "17" },
      { id: "e16-18", source: "16", target: "18" },
      { id: "e17-19", source: "17", target: "19" },
      { id: "e18-19", source: "18", target: "19" },
      { id: "e19-20", source: "19", target: "20" },
    ],
  },
};

const RiskIdentification = () => {
  const [ setSelectedStepLabel] = useState(null);
  const [selectedStepLabels, setSelectedStepLabels] = useState([]);

  const [selectedSOP, setSelectedSOP] = useState("SOP 1");

  const rawNodes = diagrams[selectedSOP]?.nodes || [];
  const edges = diagrams[selectedSOP]?.edges || [];

  const nodes = rawNodes.map((node) => ({
    ...node,
    style: {
      ...node.style,
      border: selectedStepLabels.includes(node.data.label)
        ? "3px solid #1976d2"
        : "1px solid #ccc",
      backgroundColor: selectedStepLabels.includes(node.data.label)
        ? "#e3f2fd"
        : "#fff",
      borderRadius: "8px",
    },
  }));
  return (
    <Box sx={{ width: "100%", p: 0 }}>
      <Box sx={{ borderRadius: 1 }}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ width: "100%" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Risk ID"
                defaultValue="R-280325172"
                variant="outlined"
                disabled
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    backgroundColor: "#f5f5f5",
                  },
                  "& .MuiInputBase-root": {
                    height: "40px",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select defaultValue="New" label="Status">
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Risk Name/Title"
                variant="outlined"
                placeholder="Enter risk name or title"
                sx={{ "& .MuiInputBase-root": { height: "40px" } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Risk Description"
                variant="outlined"
                placeholder="Provide a detailed description of the risk"
                multiline
                rows={4}
                sx={{ "& .MuiInputBase-root": { height: "120px" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Risk Category</InputLabel>
                <Select label="Risk Category">
                  <MenuItem value="Category 1">Category 1</MenuItem>
                  <MenuItem value="Category 2">Category 2</MenuItem>
                  <MenuItem value="Category 3">Category 3</MenuItem>
                  <MenuItem value="Category 4">Category 4</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select label="Department">
                  <MenuItem value="Department 1">Department 1</MenuItem>
                  <MenuItem value="Department 2">Department 2</MenuItem>
                  <MenuItem value="Department 3">Department 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Associated SOP with diagram toggle */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                disableClearable
                size="small"
                fullWidth
                options={["SOP 1", "SOP 2", "SOP 3"]}
                value={selectedSOP}
                onChange={(e, newValue) => {
                  setSelectedSOP(newValue);
                  setSelectedStepLabel(null);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Associated SOP" />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                size="small"
                fullWidth
                options={rawNodes.map((node) => node.data.label)}
                value={selectedStepLabels}
                onChange={(e, newValue) => setSelectedStepLabels(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Process/Step Reference" />
                )}
              />
            </Grid>

            {/* Diagram Display */}
            <Grid item xs={12}>
              <Box
                sx={{ height: 300, border: "1px solid #ccc", borderRadius: 2 }}
              >
                <ReactFlow nodes={nodes} edges={edges} fitView>
                  <Background color="#ffffff" gap={0} />
                  <Controls />
                </ReactFlow>
              </Box>
            </Grid>

          
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default RiskIdentification;
