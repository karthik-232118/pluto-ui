import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Slider,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Grid,
  Tooltip,
  GlobalStyles,
} from "@mui/material";
import "./Risk.css";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const RiskAssessment = () => {
  // Risk Details Section State
  const [riskId] = useState("R-280325172");
  const [riskConsequences, setRiskConsequences] = useState("");
  const [likelihood, setLikelihood] = useState(2);
  const [impact, setImpact] = useState(2);

  // Risk Assessment Section State
  const [riskOwner, setRiskOwner] = useState("");
  const [assessmentDate, setAssessmentDate] = useState(new Date("2025-03-28"));
  const [assessmentNotes, setAssessmentNotes] = useState(
    "Additional notes about the risk assessment"
  );
  const [inherentRiskRating, setInherentRiskRating] = useState(3);
  const [riskPrioritization, setRiskPrioritization] = useState("Low");

  const affectedAreas = [
    "Financial",
    "Reputation",
    "Employee",
    "Operations",
    "Strategic",
    "IT",
    "Compliance",
    "Customer",
    "Security",
  ];

  const [checkedAreas, setCheckedAreas] = useState(
    affectedAreas.reduce((acc, area) => {
      acc[area] = false;
      return acc;
    }, {})
  );

  // Helper functions
  const calculateRiskSeverity = (likelihood, impact) => likelihood * impact;
  const riskSeverity = calculateRiskSeverity(likelihood, impact);

  const handleLikelihoodChange = (event, newValue) => {
    setLikelihood(newValue);
  };

  const handleImpactChange = (event, newValue) => {
    setImpact(newValue);
  };

  // Determine the progress bar color
  const getSeverityColor = (severity) => {
    if (severity >= 20) return "#d32f2f"; // Red for High
    if (severity >= 10) return "#fbc02d"; // Yellow for Medium
    return "#388e3c"; // Green for Low
  };

  const handleAreaChange = (area) => (event) => {
    setCheckedAreas({ ...checkedAreas, [area]: event.target.checked });
  };

  const marks = [
    {
      value: 1,
      label: "Unlikely",
    },
    {
      value: 5,
      label: "Very Likely",
    },
  ];

  return (
    <>
      <GlobalStyles
        styles={{
          ".riskAssessment-root, .riskAssessment-root *": {
            fontFamily: '"Inter", sans-serif !important',
          },
          // Also target MUI input elements specifically for full coverage
          ".riskAssessment-root input, .riskAssessment-root textarea, .riskAssessment-root select":
            {
              fontFamily: '"Inter", sans-serif !important',
            },
          // If you use any MUI Typography or button components, add this:
          ".riskAssessment-root .MuiTypography-root, .riskAssessment-root .MuiButton-root":
            {
              fontFamily: '"Inter", sans-serif !important',
            },
        }}
      />
      <Box className="riskAssessment-root" sx={{ maxWidth: "100%" }}>
        {/* Risk Details Section */}
        <Box elevation={3} sx={{ padding: 3, marginBottom: -2 }}>
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
            label="Risk Consequences"
            value={riskConsequences}
            onChange={(e) => setRiskConsequences(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            placeholder="Describe the potential consequences if this risk materializes"
          />

          <Box sx={{ marginTop: 3 }}>
            <Typography id="likelihood-slider" gutterBottom>
              Likelihood
            </Typography>
            <Slider
              aria-labelledby="likelihood-slider"
              value={likelihood}
              onChange={handleLikelihoodChange}
              step={1}
              min={1}
              max={5}
              marks={marks}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box sx={{ marginTop: 3 }}>
            <Typography variant="p" gutterBottom>
              Impact
            </Typography>
            <Slider
              value={impact}
              min={1}
              max={5}
              step={1}
              onChange={handleImpactChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) =>
                value === 1 ? "Minor" : value === 5 ? "Severe" : ""
              }
            />
          </Box>

          <Box sx={{ marginTop: 3 }}>
            <Typography variant="p" gutterBottom>
              Risk Severity (Likelihood × Impact)
            </Typography>
            <Tooltip
              title={`Calculated as ${likelihood} × ${impact} = ${riskSeverity}`}
            >
              <Box
                sx={{
                  backgroundColor: "#e0f7fa",
                  height: "10px",
                  borderRadius: "5px",
                  marginBottom: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: getSeverityColor(riskSeverity),
                    height: "100%",
                    width: `${(riskSeverity / 25) * 100}%`,
                    borderRadius: "5px",
                  }}
                />
              </Box>
            </Tooltip>
            <Typography variant="body1">
              {riskSeverity >= 20
                ? "High"
                : riskSeverity >= 10
                ? "Medium"
                : "Low"}{" "}
              Risk
            </Typography>
          </Box>

          {/* Inherent Risk Rating */}

          <Box sx={{ marginTop: 3 }}>
            <Typography id="inherent-risk-slider" gutterBottom>
              Inherent Risk Rating
            </Typography>
            <Slider
              aria-labelledby="inherent-risk-slider"
              value={inherentRiskRating}
              onChange={(event, newValue) => setInherentRiskRating(newValue)}
              step={1}
              min={1}
              max={5}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>

        {/* Risk Assessment Section */}
        <Box elevation={3} sx={{ padding: 2 }}>
          {/* Risk Value */}
          <Box mb={3}>
            <Typography variant="p" gutterBottom>
              Risk Value
            </Typography>
            <TextField value="Low" fullWidth disabled variant="outlined" />
          </Box>

          {/* Affected Areas */}
          <Box mb={3}>
            <Typography variant="p" gutterBottom>
              Affected Areas
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: "-10px" }}>
              {affectedAreas.map((area) => (
                <Grid item xs={4} key={area}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedAreas[area]}
                        onChange={handleAreaChange(area)}
                        color="primary"
                      />
                    }
                    label={area}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Risk Owner and Assessment Date */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6}>
              <Typography variant="p" gutterBottom>
                Risk Owner
              </Typography>
              <FormControl fullWidth size="medium">
                <InputLabel>Select risk owner</InputLabel>
                <Select
                  value={riskOwner}
                  onChange={(e) => setRiskOwner(e.target.value)}
                  label="Select risk owner"
                >
                  <MenuItem value="Owner 1">Owner 1</MenuItem>
                  <MenuItem value="Owner 2">Owner 2</MenuItem>
                  <MenuItem value="Owner 3">Owner 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="p" gutterBottom>
                Assessment Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={assessmentDate}
                  onChange={(newValue) => setAssessmentDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          {/* Assessment Notes */}
          <Box mb={3}>
            <Typography variant="p" gutterBottom>
              Assessment Notes
            </Typography>
            <TextField
              value={assessmentNotes}
              onChange={(e) => setAssessmentNotes(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
          </Box>

          {/* Risk Prioritization */}
          <Box mb={3}>
            <FormControl fullWidth>
              <InputLabel>Risk Prioritization</InputLabel>
              <Select
                value={riskPrioritization}
                onChange={(e) => setRiskPrioritization(e.target.value)}
                label="Risk Prioritization"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RiskAssessment;
