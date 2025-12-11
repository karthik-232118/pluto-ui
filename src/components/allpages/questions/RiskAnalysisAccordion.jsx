import { Box, LinearProgress, Grid, Paper, Typography } from "@mui/material";
import {
  // Warning as WarningIcon, // Remove unused import
  // CheckCircle as CheckCircleIcon, // Remove unused import
  // Error as ErrorIcon, // Remove unused import
  Info as InfoIcon,
} from "@mui/icons-material";

import PropTypes from "prop-types";

const RiskAnalysisAccordion = ({ riskData }) => {
  const analysisData =
    riskData && riskData.RiskAnalysiss ? riskData.RiskAnalysiss : [];
  console.log("Risk Analysis Data:", analysisData);

  if (!analysisData || analysisData.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 3, textAlign: "center", bgcolor: "background.default" }}
      >
        <Typography variant="body1" color="text.secondary">
          No Risk Analysis Data Available
        </Typography>
      </Paper>
    );
  }

  const getEffectivenessColor = (score) => {
    if (score >= 4) return "success";
    if (score >= 2) return "warning";
    return "error";
  };

  const getExposureColor = (score) => {
    if (score <= 2) return "success";
    if (score <= 3) return "warning";
    return "error";
  };

  const renderArrayItems = (items) => {
    if (!items || items.length === 0) return "Not specified";

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {items.map((item, index) => (
          <Typography key={index} variant="body2">
            • {item}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      {analysisData.map((analysis, index) => (
        <Box key={analysis.RiskAnalysisID || index} sx={{ mb: 0, p: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "text.secondary",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Root Causes
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  {renderArrayItems(analysis.RootCause)}
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "text.secondary",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Current Controls
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  {renderArrayItems(analysis.CurrentControls)}
                </Paper>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "text.secondary",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Potential
                  Consequences
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  {renderArrayItems(analysis.PotentialConsequences)}
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "text.secondary",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Trigger Indicators
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  {renderArrayItems(analysis.TriggerIndicators)}
                </Paper>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: -2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Control Effectiveness
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={analysis.ControlEffectiveness * 20}
                    color={getEffectivenessColor(analysis.ControlEffectiveness)}
                    sx={{ height: 10, flexGrow: 1, borderRadius: 5 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: `${getEffectivenessColor(
                        analysis.ControlEffectiveness
                      )}.dark`,
                    }}
                  >
                    {analysis.ControlEffectiveness}/5
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Risk Exposure
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={analysis.RiskExposure * 20}
                    color={getExposureColor(analysis.RiskExposure)}
                    sx={{ height: 10, flexGrow: 1, borderRadius: 5 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: `${getExposureColor(analysis.RiskExposure)}.dark`,
                    }}
                  >
                    {analysis.RiskExposure}/5
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(analysis.CreatedDate).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RiskAnalysisAccordion;

RiskAnalysisAccordion.propTypes = {
  riskData: PropTypes.shape({
    RiskAnalysiss: PropTypes.arrayOf(
      PropTypes.shape({
        RiskAnalysisID: PropTypes.string,
        RootCause: PropTypes.arrayOf(PropTypes.string),
        CurrentControls: PropTypes.arrayOf(PropTypes.string),
        PotentialConsequences: PropTypes.arrayOf(PropTypes.string),
        TriggerIndicators: PropTypes.arrayOf(PropTypes.string),
        ControlEffectiveness: PropTypes.number,
        RiskExposure: PropTypes.number,
        CreatedDate: PropTypes.string,
      })
    ),
  }),
};
RiskAnalysisAccordion.defaultProps = {
  riskData: {
    RiskAnalysiss: [],
  },
};
