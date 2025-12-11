import { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const MonitoringReview = () => {
  const [riskId] = useState("R-280325172");
  const [monitoringFrequency, setMonitoringFrequency] = useState("");
  const [lastReviewDate, setLastReviewDate] = useState(null);
  const [nextReviewDate, setNextReviewDate] = useState(null);
  const [reviewFindings, setReviewFindings] = useState("");
  const [statusChanges, setStatusChanges] = useState("");
  const [escalationPath, setEscalationPath] = useState("");
  const [reviewPerformedBy, setReviewPerformedBy] = useState("");

  const frequencyOptions = [
    'Daily',
    'Weekly',
    'Monthly',
    'Quarterly',
    'Annually',
    'As Needed'
  ];

  const performerOptions = [
    'Risk Manager',
    'Project Lead',
    'Department Head',
    'External Auditor',
    'Compliance Officer'
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, maxWidth: "100%", margin: 'auto' }}>
      
        <TextField
          label="Risk ID"
          value={riskId}
          variant="outlined"
          fullWidth
          margin="dense"
          size="small"
          InputProps={{
            readOnly: true,
          }}
       
        />
               
        <TextField
          select
          label="Monitoring Frequency"
          value={monitoringFrequency}
          onChange={(e) => setMonitoringFrequency(e.target.value)}
          variant="outlined"
          fullWidth
          margin="dense"
          size="small"
          placeholder="Select monitoring frequency"
        >
          {frequencyOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

       

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DatePicker
              label="Last Review Date"
              value={lastReviewDate}
              onChange={(newValue) => setLastReviewDate(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  variant="outlined"
                  margin="dense"
                  size="small"
                  placeholder="Pick a date"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              label="Next Review Date"
              value={nextReviewDate}
              onChange={(newValue) => setNextReviewDate(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  variant="outlined"
                  margin="dense"
                  size="medium"
                  placeholder="Pick a date"
                />
              )}
            />
          </Grid>
        </Grid>

       

        <TextField
          label="Review Findings"
          value={reviewFindings}
          onChange={(e) => setReviewFindings(e.target.value)}
          variant="outlined"
          fullWidth
          margin="dense"
          size="small"
          multiline
          rows={2}
          placeholder="Summary of findings from the latest review"
        />

      

        <TextField
          label="Status Changes"
          value={statusChanges}
          onChange={(e) => setStatusChanges(e.target.value)}
          variant="outlined"
          fullWidth
          margin="dense"
          size="small"
          multiline
          rows={2}
          placeholder="Describe any status changes"
        />

     
        <TextField
          label="Escalation Path"
          value={escalationPath}
          onChange={(e) => setEscalationPath(e.target.value)}
          variant="outlined"
          fullWidth
          margin="dense"
          size="small"
          multiline
          rows={2}
          placeholder="Define who should be notified if risk increases"
        />

    
        <TextField
          select
          label="Review Performed By"
          value={reviewPerformedBy}
          onChange={(e) => setReviewPerformedBy(e.target.value)}
          variant="outlined"
          fullWidth
          margin="dense"
          size="small"
        >
          {performerOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </LocalizationProvider>
  );
};

export default MonitoringReview;