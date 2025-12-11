import { 
  Box, 
  Chip, 
  Grid, 
  Paper, 
  Typography, 
  LinearProgress 
} from "@mui/material";
import { 
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from "@mui/icons-material";
import PropTypes from "prop-types";

const RiskMonitoringReviewsAccordion = ({ riskData }) => {
  const analysisData = riskData?.RiskMonitoringReviews || [];
  console.log("RiskMonitoringReviewsAccordion", analysisData);

  if (!analysisData || analysisData.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, textAlign: "center", bgcolor: "background.default" }}>
        <Typography variant="body1" color="text.secondary">
          No Risk Monitoring Review Data Available
        </Typography>
      </Paper>
    );
  }

  const getEffectivenessColor = (score) => {
    if (score >= 4) return 'success';
    if (score >= 2) return 'warning';
    return 'error';
  };

  const getScoreIcon = (score) => {
    const colors = getEffectivenessColor(score);
    if (colors === 'success') return <CheckCircleIcon color="success" />;
    if (colors === 'warning') return <WarningIcon color="warning" />;
    return <ErrorIcon color="error" />;
  };

  return (
    <Box sx={{ width: "100%" }}>
      {analysisData.map((review, index) => (
        <Box key={review.RiskMonitoringReviewID || index} sx={{ mb: 0, p: 1, mt: 2 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`Monitoring Frequency: ${review.MonitoringFrequency}`}
              variant="outlined"
              color="primary"
            />
            <Chip
              label={`Last Review: ${new Date(review.LastReviewDate).toLocaleDateString()}`}
              variant="outlined"
            />
            <Chip
              label={`Next Review: ${new Date(review.NextReviewDate).toLocaleDateString()}`}
              variant="outlined"
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 1, display: "flex", alignItems: "center" }}>
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Review Findings
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body2">
                    {review.ReviewFindings || "Not specified"}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 1, display: "flex", alignItems: "center" }}>
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Alert Condition
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body2">
                    {review.AlertCondition || "Not specified"}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 1 }}>
                  Control Effectiveness
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={review.ControlEffectiveness * 20}
                    color={getEffectivenessColor(review.ControlEffectiveness)}
                    sx={{ height: 10, flexGrow: 1, borderRadius: 5 }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {review.ControlEffectiveness}/5
                    </Typography>
                    {getScoreIcon(review.ControlEffectiveness)}
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 1, display: "flex", alignItems: "center" }}>
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Alert Action
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body2">
                    {review.AlertAction || "Not specified"}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 1, display: "flex", alignItems: "center" }}>
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Key Performance Indicator (KPI)
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {review.KPI || "Not specified"}
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>

       

          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(review.CreatedDate).toLocaleString()}
            </Typography>
           
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RiskMonitoringReviewsAccordion;

RiskMonitoringReviewsAccordion.propTypes = {
  riskData: PropTypes.shape({
    RiskMonitoringReviews: PropTypes.arrayOf(
      PropTypes.shape({
        RiskMonitoringReviewID: PropTypes.string,
        MonitoringFrequency: PropTypes.string,
        LastReviewDate: PropTypes.string,
        NextReviewDate: PropTypes.string,
        ReviewFindings: PropTypes.string,
        AlertCondition: PropTypes.string,
        ControlEffectiveness: PropTypes.number,
        AlertAction: PropTypes.string,
        KPI: PropTypes.string,
        CreatedDate: PropTypes.string,
      })
    ),
  }),
};
