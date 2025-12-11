import  { useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  styled,

  Button,
  Stack,
} from "@mui/material";
import { indigo } from "@mui/material/colors";
import RiskIdentification from "./RiskIdentification";
import RiskAssessment from "./RiskAssessment";
import RiskAnalysis from "./RiskAnalysis";
import RiskTreatment from "./RiskTreatment";
import MonitoringReview from "./MonitoringReview";

const StyledTabs = styled(Tabs)(() => ({
    "& .MuiTabs-indicator": {
      display: "none", // Remove the indicator
    },
    backgroundColor: "#dae3e6",
    padding: 0, // Remove extra padding
    borderRadius: "8px", // Rounded corners for the whole tab container
    minHeight: "40px", // Reduce the height of the tab container
  }));
  
  const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: "none",
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    backgroundColor: "transparent",
    borderRadius: "8px", // Apply border radius to all sides
    flex: 1, // This makes the tab take equal space
    height: "40px", // Reduce height of each tab
    display: "flex",
    alignItems: "center", // Vertically center the text
    justifyContent: "center", // Horizontally center the text
    "&.Mui-selected": {
      color: indigo[800],
      fontWeight: theme.typography.fontWeightBold,
      backgroundColor: "#ffffff", // White background for selected tab
      borderRadius: "8px", // Equal border-radius on all sides
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Optional: for depth
    },
    "&:hover": {
      color: indigo[600],
      backgroundColor: "#ffffff",
    },
  }));
  

const RiskCreate = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNext = () => {
    if (value < tabComponents.length - 1) {
      setValue(value + 1);
    }
  };

  const handlePrevious = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Risk record submitted!");
    alert("Risk record submitted successfully!");
  };

  const tabComponents = [
    <RiskIdentification key="identification" />,
    <RiskAssessment key="assessment" />,
    <RiskAnalysis key="analysis" />,
    <RiskTreatment key="treatment" />,
    <MonitoringReview key="monitoring" />,
  ];

  const tabLabels = [
    "Risk Identification",
    "Risk Assessment",
    "Risk Analysis",
    "Risk Treatment",
    "Monitoring & Review",
  ];

  const isLastPage = value === tabComponents.length - 1;

  return (
    <Box sx={{ margin: "25px" }}>
      <Typography variant="h6" gutterBottom sx={{ color: indigo[800], mb: 3 }}>
        Risk Assessment & Management
      </Typography>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          my: 4,
        }}
      >
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="risk assessment tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabLabels.map((label, index) => (
            <StyledTab key={index} label={label} />
          ))}
        </StyledTabs>
      </Box>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          my: 4,
        }}
      >
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <Box
            sx={{
              p: 3,
              minHeight: "400px",
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            {tabComponents[value]}
          </Box>
        </Paper>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          sx={{ mt: 3 }}
        >
          <Button
            variant="contained"
            onClick={handlePrevious}
            disabled={value === 0}
            sx={{
              visibility: value === 0 ? "hidden" : "visible",
              bgcolor: "#3B82F6",
              "&:hover": { bgcolor: indigo[700] },
            }}
          >
            Previous
          </Button>

          {isLastPage ? (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{
                ml: "auto",
                bgcolor: "#3B82F6",
                "&:hover": {  bgcolor: indigo[700]  },
              }}
            >
              Submit Risk Record
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                ml: "auto",
                bgcolor:" #3B82F6",
                "&:hover": { bgcolor: indigo[700] },
              }}
            >
              Next
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default RiskCreate;
