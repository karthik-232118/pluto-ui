import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Slider,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const RiskTreatment = () => {
  const [riskId] = useState("R-280325172");
  const [treatmentStrategy, setTreatmentStrategy] = useState("");
  const [treatmentActions, setTreatmentActions] = useState("");
  const [mitigationPlan, setMitigationPlan] = useState("");
  const [responsibleParty, setResponsibleParty] = useState("");
  const [treatmentStatus] = useState("Not Started");
  const [residualRisk, setResidualRisk] = useState(2);
  const [treatmentEffectiveness, setTreatmentEffectiveness] = useState(5);
  const [resourcesRequired, setResourcesRequired] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [targetDate, setTargetDate] = useState(null);

  const strategyOptions = ["Avoid", "Reduce", "Transfer", "Accept"];

  const partyOptions = [
    "Project Manager",
    "Risk Team",
    "Department Head",
    "External Vendor",
  ];

  const statusOptions = ["Pending", "Approved", "Rejected", "In Review"];



  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2, maxWidth: "100%", margin: "auto" }}>
        <TextField
          label="Risk ID"
          value={riskId}
          variant="outlined"
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          select
          label="Treatment Strategy"
          value={treatmentStrategy}
          onChange={(e) => setTreatmentStrategy(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        >
          {strategyOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Treatment Actions"
          value={treatmentActions}
          onChange={(e) => setTreatmentActions(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          placeholder="Enter treatment actions..."
        />

        <TextField
          label="Mitigation Plan"
          value={mitigationPlan}
          onChange={(e) => setMitigationPlan(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          placeholder="Enter mitigation plan..."
        />

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6} sx={{ marginTop: "-15px" }}>
            <TextField
              select
              label="Responsible Party"
              value={responsibleParty}
              onChange={(e) => setResponsibleParty(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            >
              {partyOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Responsibility Date"
              value={targetDate}
              onChange={(newValue) => setTargetDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              )}
            />
          </Grid>
        </Grid>

        <TextField
          label="Treatment Status"
          value={treatmentStatus}
          variant="outlined"
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />

<Grid container spacing={2}>
  {/* Residual Risk Slider */}
  <Grid item xs={12}>
    <Box sx={{ position: "relative" }}>
      <Typography variant="p" gutterBottom>
        Residual Risk
      </Typography>
      <Slider
        value={residualRisk}
        onChange={(e, newValue) => setResidualRisk(newValue)}
        min={1}
        max={5}
        step={1}
        marks
        sx={{ color: "#1976d2" }}
        valueLabelDisplay="off"
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "#e3f2fd",
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontSize: "13px",
          color: "#1976d2",
          fontWeight: 500,
        }}
      >
        {residualRisk <= 2 ? "Low" : residualRisk === 3 ? "Medium" : "High"} ({residualRisk})
      </Box>
    </Box>
  </Grid>

  {/* Treatment Effectiveness Slider */}
  <Grid item xs={12}>
    <Box sx={{ position: "relative", mt: 2 }}>
      <Typography variant="p" gutterBottom>
        Treatment Effectiveness
      </Typography>
      <Slider
        value={treatmentEffectiveness}
        onChange={(e, newValue) => setTreatmentEffectiveness(newValue)}
        min={1}
        max={5}
        step={1}
        marks
        sx={{ color: "#1976d2" }}
        valueLabelDisplay="off"
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "#ffebee",
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontSize: "13px",
          color: "#c62828",
          fontWeight: 500,
        }}
      >
        {treatmentEffectiveness <= 2
          ? "Low"
          : treatmentEffectiveness === 3
          ? "Moderate"
          : treatmentEffectiveness === 4
          ? "High"
          : "Very High"}{" "}
        ({treatmentEffectiveness})
      </Box>
    </Box>
  </Grid>
</Grid>


        <TextField
          label="Resources Required"
          value={resourcesRequired}
          onChange={(e) => setResourcesRequired(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          placeholder="Describe required resources..."
        />

        <TextField
          select
          label="Approval Status"
          value={approvalStatus}
          onChange={(e) => setApprovalStatus(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </LocalizationProvider>
  );
};

export default RiskTreatment;
