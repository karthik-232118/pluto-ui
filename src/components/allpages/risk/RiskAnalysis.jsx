import  { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Slider,
  MenuItem,
  InputAdornment,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const RiskAnalysis = () => {
  const [riskId] = useState("R-280325172");
  const [rootCauseAnalysis, setRootCauseAnalysis] = useState("");
  const [currentControls, setCurrentControls] = useState("");
  const [controlEffectiveness, setControlEffectiveness] = useState(3);
  const [riskExposure] = useState(1);
  const [potentialConsequences, setPotentialConsequences] = useState("");
  const [triggerIndicators, setTriggerIndicators] = useState("");
  const [analysisPerformedBy, setAnalysisPerformedBy] = useState("");
  const [analysisDate, setAnalysisDate] = useState(null);

  const marks = [
    { value: 1, label: "1 - Low" },
    { value: 2, label: "2" },
    { value: 3, label: "3 - Medium" },
    { value: 4, label: "4" },
    { value: 5, label: "5 - High" },
  ];

  const performers = [
    { value: "john", label: "John Doe" },
    { value: "jane", label: "Jane Smith" },
    { value: "mike", label: "Mike Johnson" },
  ];

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
          label="Root Cause Analysis"
          value={rootCauseAnalysis}
          onChange={(e) => setRootCauseAnalysis(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          placeholder="Identify and document the underlying causes of the risk"
        />

        <TextField
          label="Current Controls"
          value={currentControls}
          onChange={(e) => setCurrentControls(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          placeholder="Describe existing control measures"
        />

        <Box sx={{ marginTop: 3 }}>
          <Typography id="control-effectiveness-slider" gutterBottom>
            Control Effectiveness
          </Typography>
          <Slider
            aria-labelledby="control-effectiveness-slider"
            value={controlEffectiveness}
            onChange={(e, newValue) => setControlEffectiveness(newValue)}
            step={1}
            min={1}
            max={5}
            marks={marks}
            valueLabelDisplay="auto"
          />
        </Box>

        <TextField
          label="Risk Exposure"
          value={riskExposure}
          variant="outlined"
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
            endAdornment: <InputAdornment position="end">/5</InputAdornment>,
          }}
        />

        <TextField
          label="Potential Consequences"
          value={potentialConsequences}
          onChange={(e) => setPotentialConsequences(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          placeholder="Describe potential consequences"
        />

        <TextField
          label="Trigger Indicators"
          value={triggerIndicators}
          onChange={(e) => setTriggerIndicators(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          placeholder="Describe trigger indicators"
        />

        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={6} sx={{marginTop:"-15px"}}>
            <TextField
              select
              label="Analysis Performed By"
              value={analysisPerformedBy}
              onChange={(e) => setAnalysisPerformedBy(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            >
              {performers.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="Analysis Date"
              value={analysisDate}
              onChange={(newValue) => setAnalysisDate(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default RiskAnalysis;
