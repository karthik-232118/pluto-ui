import {
  Box,
  Chip,
  Grid,
  Paper,
  Typography,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const RiskAssessmentsAccordion = ({ riskData }) => {
  const analysisData = riskData?.RiskAssessments || [];
  console.log("Risk Analysis Data:", analysisData);

  if (!analysisData || analysisData.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 3, textAlign: "center", bgcolor: "background.default" }}
      >
        <Typography variant="body1" color="text.secondary">
          No Risk Assessment Data Available
        </Typography>
      </Paper>
    );
  }

  const getSeverityColor = (score) => {
    if (score >= 12) return "error";
    if (score >= 8) return "warning";
    return "success";
  };

  const getRiskValueColor = (value) => {
    switch (value?.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getScoreIcon = (score) => {
    const color = getSeverityColor(score);
    if (color === "success") return <CheckCircleIcon color="success" />;
    if (color === "warning") return <WarningIcon color="warning" />;
    return <ErrorIcon color="error" />;
  };

  return (
    <Box sx={{ width: "100%" }}>
      {analysisData.map((assessment, index) => (
        <Box
          key={assessment.RiskAssessmentID || index}
          sx={{ mb: 0, p: 1, mt: 2 }}
        >
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            <Chip
              icon={getScoreIcon(assessment.Severity)}
              label={`Severity: ${assessment.Severity}`}
              variant="outlined"
              sx={{
                borderColor: `${getSeverityColor(assessment.Severity)}.main`,
                color: `${getSeverityColor(assessment.Severity)}.dark`,
              }}
            />
            <Chip
              label={`Risk Value: ${assessment.RiskValue}`}
              variant="outlined"
              color={getRiskValueColor(assessment.RiskValue)}
            />
            <Chip
              label={`Frequency: ${assessment.Frequency}`}
              variant="outlined"
            />
          </Box>

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
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Risk Consequences
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {assessment.RiskConsequences || "Not specified"}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Likelihood: {assessment.Likelihood}/5
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(assessment.Likelihood / 5) * 100}
                  color={
                    assessment.Likelihood >= 4
                      ? "error"
                      : assessment.Likelihood >= 2
                      ? "warning"
                      : "success"
                  }
                  sx={{ height: 8, borderRadius: 5 }}
                />
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
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Assessment Notes
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {assessment.AssessmentNotes || "Not specified"}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Impact: {assessment.Impact}/5
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(assessment.Impact / 5) * 100}
                  color={
                    assessment.Impact >= 4
                      ? "error"
                      : assessment.Impact >= 2
                      ? "warning"
                      : "success"
                  }
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Affected Areas
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {assessment.AffectedAreas?.length > 0 ? (
                    assessment.AffectedAreas.map((area, index) => (
                      <Chip
                        key={index}
                        label={area}
                        variant="outlined"
                        color="primary"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not specified
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 5 }}>
              <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(assessment.CreatedDate).toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default RiskAssessmentsAccordion;

RiskAssessmentsAccordion.propTypes = {
  riskData: PropTypes.shape({
    RiskAssessments: PropTypes.arrayOf(
      PropTypes.shape({
        RiskAssessmentID: PropTypes.string,
        Severity: PropTypes.number,
        RiskValue: PropTypes.string,
        Frequency: PropTypes.string,
        RiskConsequences: PropTypes.string,
        Likelihood: PropTypes.number,
        AssessmentNotes: PropTypes.string,
        Impact: PropTypes.number,
        AffectedAreas: PropTypes.arrayOf(PropTypes.string),
        CreatedDate: PropTypes.string,
      })
    ),
  }),
};
