import {
  Box,
  Chip,
  Grid,
  Paper,
  Typography,
  LinearProgress,
 
  Button,
} from "@mui/material";
import {
  Info as InfoIcon,
 
  Description,
} from "@mui/icons-material";
import { BASE_URL } from "../../../config/urlConfig";
import PropTypes from "prop-types";

const RiskTreatmentsAccordion = ({ riskData }) => {
  const analysisData = riskData?.RiskTreatments;
  console.log("RiskTreatmentsAccordion", analysisData);

  if (!analysisData || analysisData.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 3, textAlign: "center", bgcolor: "background.default" }}
      >
        <Typography variant="body1" color="text.secondary">
          No Risk Treatment Data Available
        </Typography>
      </Paper>
    );
  }

  const getEffectivenessColor = (score) => {
    if (score >= 4) return "success";
    if (score >= 2) return "warning";
    return "error";
  };

  const handleDocumentClick = (path) => {
    if (path) {
      window.open(`${BASE_URL}/${path}`, "_blank");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {analysisData.map((treatment, index) => (
        <Box key={treatment.RiskTreatmentID} sx={{ mb: 0, p: 1, mt: 2 }}>
          {/* Add document icon button at the top right */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Risk Treatment #{index + 1}
            </Typography>
            {treatment.RiskTreatmentDocumentPath && (
              <Button
                variant="outlined"
                startIcon={<Description />}
                onClick={() =>
                  handleDocumentClick(treatment.RiskTreatmentDocumentPath)
                }
                sx={{
                  mt: -2,
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                View Document
              </Button>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Chip
              label={`Strategy: ${treatment.TreatmentStrategy}`}
              variant="outlined"
              color="primary"
            />
            <Chip
              label={`Status: ${treatment.TreatmentStatus}`}
              variant="outlined"
              color="secondary"
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="p"
                  sx={{
                    color: "text.secondary",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Treatment Actions
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body2">
                    {treatment.TreatmentActions || "Not specified"}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="p"
                  sx={{
                    color: "text.secondary",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Resources Required
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body2">
                    {treatment.ResourcesRequired || "Not specified"}
                  </Typography>
                </Paper>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="p"
                  sx={{
                    color: "text.secondary",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Residual Risk
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body2">
                    {treatment.ResidualRisk || "Not specified"}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="p"
                  sx={{
                    color: "text.secondary",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InfoIcon color="info" sx={{ mr: 1 }} /> Treatment
                  Effectiveness
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={treatment.TreatmentEffectiveness * 20}
                  color={getEffectivenessColor(
                    treatment.TreatmentEffectiveness
                  )}
                  sx={{ height: 10, flexGrow: 1, borderRadius: 5 }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    color: `${getEffectivenessColor(
                      treatment.TreatmentEffectiveness
                    )}.dark`,
                  }}
                >
                  {treatment.TreatmentEffectiveness}/5
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(treatment.CreatedDate).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RiskTreatmentsAccordion;

RiskTreatmentsAccordion.propTypes = {
  riskData: PropTypes.shape({
    RiskTreatments: PropTypes.arrayOf(
      PropTypes.shape({
        RiskTreatmentID: PropTypes.string.isRequired,
        TreatmentStrategy: PropTypes.string.isRequired,
        TreatmentStatus: PropTypes.string.isRequired,
        TreatmentActions: PropTypes.string,
        ResourcesRequired: PropTypes.string,
        ResidualRisk: PropTypes.string,
        TreatmentEffectiveness: PropTypes.number.isRequired,
        RiskTreatmentDocumentPath: PropTypes.string,
        CreatedDate: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
