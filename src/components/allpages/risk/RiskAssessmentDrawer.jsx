import  { useCallback, useEffect, useState } from "react";
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Divider,
  Button,
  CircularProgress,
  GlobalStyles,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Chip,
  FormHelperText,
} from "@mui/material";

import {
  CreateRiskAPI,
  Edit_Risk_API,
} from "../../../services/sopRisk/SOPRisk";
import { listProcessOwner } from "../../../services/sopModules/SopModule";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Close } from "@mui/icons-material";
import PropTypes from "prop-types";

const RiskAssessmentDrawer = ({
  open,
  onClose,
  risk,
  editRisk,
  onSuccess,
  isCreate,
}) => {
  const { t } = useTranslation();
  // Risk Details Section State
  const [riskId, setRiskId] = useState("");
  const [riskConsequences, setRiskConsequences] = useState("");
  const [likelihood, setLikelihood] = useState(0);
  const [impact, setImpact] = useState(1);

  const [assessmentDate, setAssessmentDate] = useState(new Date("2025-03-28"));
  const [assessmentNotes, setAssessmentNotes] = useState("");
  const [riskPrioritization, setRiskPrioritization] = useState("Low");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [ setRiskOwnersList] = useState([]);
  const [riskModuleDraftID, setRiskModuleDraftID] = useState("");
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState("Daily");

  console.log("RiskeditRiskeditRisk2nd", editRisk);
  console.log(isCreate, "isCreateAss");

  useEffect(() => {
    if (
      editRisk &&
      editRisk.RiskAssessments &&
      editRisk.RiskAssessments.length > 0
    ) {
      const assessmentData = editRisk.RiskAssessments[0]; // Take the first item

      setRiskConsequences(assessmentData.RiskConsequences || "");
      setLikelihood(assessmentData.Likelihood || 0);
      setImpact(assessmentData.Impact || 0);
      setRiskPrioritization(assessmentData.RiskValue || "Low");
      setSelectedAreas(assessmentData.AffectedAreas || []);
      setFrequency(assessmentData.Frequency || "Daily");
      setAssessmentNotes(assessmentData.AssessmentNotes || "");
    }
  }, [editRisk]);

  useEffect(() => {
    console.log(isCreate, "isCreateAss");
    if (isCreate) {
      // Reset all form fields
      setRiskConsequences("");
      setLikelihood(0);
      setImpact(1);
      setRiskPrioritization("Low");
      setSelectedAreas([]);
      setFrequency("Daily");
      setAssessmentNotes("");
      setAssessmentDate(new Date("2025-03-28"));

      // Reset errors
      setErrors({
        likelihood: false,
        impact: false,
        riskPrioritization: false,
        frequency: false,
        affectedAreas: false,
      });
    }
  }, [isCreate]);

  // Error states
  const [errors, setErrors] = useState({
    likelihood: false,
    impact: false,
    riskPrioritization: false,
    frequency: false,
    affectedAreas: false,
  });

  useEffect(() => {
    if (risk) {
      setRiskId(risk?.RiskID);
      setRiskModuleDraftID(risk?.RiskModuleDraftID);
    }
  }, [risk]);

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

  useEffect(() => {
    const fetchProcessOwners = async () => {
      try {
        const response = await listProcessOwner({});
        setRiskOwnersList(response?.data?.data?.userList || []);
      } catch (error) {
        console.error("Error fetching process owners:", error);
        toast.error("Failed to load risk owners");
      }
    };

    if (open) {
      fetchProcessOwners();
    }
  }, [open]);

  const handleAreaChange = (event) => {
    const { value } = event.target;
    setSelectedAreas(value);
    setErrors((prev) => ({ ...prev, affectedAreas: value.length === 0 }));
  };

  const calculateRiskSeverity = (likelihood, impact) => likelihood * impact;
  const riskSeverity = calculateRiskSeverity(likelihood, impact);

  const handleLikelihoodChange = (event) => {
    setLikelihood(event.target.value);
    setErrors((prev) => ({ ...prev, likelihood: false }));
  };

  const handleImpactChange = (event) => {
    setImpact(event.target.value);
    setErrors((prev) => ({ ...prev, impact: false }));
  };

  const getSeverityColor = (severity) => {
    if (severity >= 20) return "#d32f2f";
    if (severity >= 10) return "#ff9800";
    return "#4caf50";
  };



  const validateFields = () => {
    const newErrors = {
      likelihood: !likelihood,
      impact: !impact,
      riskPrioritization: !riskPrioritization,
      frequency: !frequency,
      affectedAreas: selectedAreas.length === 0,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSave = async () => {
    if (!validateFields()) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      RiskState: "Risk Assessment",
      RiskID: riskId,
      Likelihood: likelihood,
      Impact: impact,
      Severity: riskSeverity,
      RiskValue: riskPrioritization,
      AffectedAreas: selectedAreas,
      AssessmentDate: assessmentDate,
      AssessmentNotes: assessmentNotes,
      RiskConsequences: riskConsequences,
      RiskModuleDraftID: riskModuleDraftID,
      Frequency: frequency,
    };

    console.log("Payload being sent:", payload);

    setLoading(true);

    try {
      let response;

      if (
        editRisk &&
        editRisk.RiskAssessments &&
        editRisk.RiskAssessments.length > 0
      ) {
        // If editing, use Edit API
        response = await Edit_Risk_API(payload);
      } else {
        // If creating new, use Create API
        response = await CreateRiskAPI(payload);
      }

      if (response.status >= 200 && response.status < 300) {
        toast.success(
          editRisk
            ? "Risk assessment updated successfully!"
            : "Risk assessment created successfully!"
        );
        onClose();
        console.log("Rissfsf", response.data);
        if (onSuccess) {
          onSuccess(response.data); // Pass the success response data to the parent
        } else {
          toast.error(response.data.message || "Failed to create risk");
        }
        // window.location.reload();
      } else {
        const errorMessage =
          response.data?.message || "Failed to save risk assessment";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error saving risk assessment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while saving the risk assessment";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChipDelete = useCallback((valueToDelete) => {
    setSelectedAreas((prevAreas) => {
      const newAreas = prevAreas.filter((area) => area !== valueToDelete);
      setErrors((prev) => ({ ...prev, affectedAreas: newAreas.length === 0 }));
      return newAreas;
    });
  }, []);

  return (
      <>
    <GlobalStyles
      styles={{
        ".riskAssessment-root, .riskAssessment-root *": {
          fontFamily: '"Inter", sans-serif !important',
        },
      }}
    />
    <Drawer

    className="riskAssessment-root"
      anchor="right"
      open={open}
      onClose={onClose} 
      sx={{ width: "500px", flexShrink: 0 }}
      PaperProps={{
        sx: {
          width: "500px",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          padding: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="600" color="#2c3e50">
            {t("risk_assessment")}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#7f8c8d",
              "&:hover": {
                backgroundColor: "rgba(127, 140, 141, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 1, borderColor: "#dfe6e9" }} />

        <Box
          sx={{
            padding: 2,
            flex: 1,
            overflowY: "scroll",
            height: "100%",
            fontSize: "0.75rem",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Box sx={{ marginTop: 0, marginBottom: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: "#636e72", fontSize: "1rem" }}>
                    {t("likelihood_label")} *
                  </InputLabel>
                  <Select
                    value={likelihood}
                    onChange={handleLikelihoodChange}
                    label={`${t("likelihood_label")} *`}
                    sx={{
                      "& .MuiSelect-select": {
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        fontSize: "0.9rem",
                      },
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <MenuItem
                        key={value}
                        value={value}
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.likelihood && (
                    <Box sx={{ color: "red", fontSize: "0.7rem" }}>
                      Likelihood is required
                    </Box>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth size="small" error={errors.impact}>
                  <InputLabel sx={{ color: "#636e72", fontSize: "1rem" }}>
                    {t("impact_label")} *
                  </InputLabel>
                  <Select
                    value={impact}
                    onChange={handleImpactChange}
                    label={`${t("impact_label")} *`}
                    sx={{
                      "& .MuiSelect-select": {
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        fontSize: "0.9rem",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: errors.impact ? "#d32f2f" : "#b2bec3",
                        },
                        "&:hover fieldset": {
                          borderColor: errors.impact ? "#d32f2f" : "#636e72",
                        },
                      },
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <MenuItem
                        key={value}
                        value={value}
                        sx={{ fontSize: "0.9rem" }}
                      >
                        Level {value}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.impact && (
                    <FormHelperText
                      sx={{ color: "#d32f2f", fontSize: "0.7rem" }}
                    >
                      Impact is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ marginBottom: 3 }}>
            <Typography
              variant="body1"
              gutterBottom
              fontWeight="500"
              color="#2c3e50"
              sx={{ fontSize: "0.9rem" }}
            >
              {t("risk_severity_label")}
            </Typography>
            <Tooltip
              title={`Calculated as ${likelihood} × ${impact} = ${riskSeverity}`}
            >
              <Box
                sx={{
                  backgroundColor: "#dfe6e9",
                  height: "7px",
                  borderRadius: "8px",
                  marginBottom: 1,
                  overflow: "hidden",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: getSeverityColor(riskSeverity),
                    height: "100%",
                    width: `${(riskSeverity / 25) * 100}%`,
                    borderRadius: "8px",
                    transition: "width 0.3s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
              </Box>
            </Tooltip>
            <Typography
              variant="body1"
              sx={{
                color: getSeverityColor(riskSeverity),
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "0.75rem",
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: getSeverityColor(riskSeverity),
                }}
              />
              {riskSeverity >= 20
                ? "High"
                : riskSeverity >= 10
                ? "Medium"
                : "Low"}{" "}
              Risk
            </Typography>
          </Box>

          <Box mb={3} sx={{ display: "flex", gap: 2 }}>
            <FormControl
              fullWidth
              size="small"
              sx={{ flex: 1 }}
              error={errors.riskPrioritization}
            >
              <InputLabel sx={{ color: "#636e72", fontSize: "1rem" }}>
                {t("risk_prioritization_label")} *
              </InputLabel>
              <Select
                value={riskPrioritization}
                onChange={(e) => {
                  setRiskPrioritization(e.target.value);
                  setErrors((prev) => ({ ...prev, riskPrioritization: false }));
                }}
                label={`${t("risk_prioritization_label")} *`}
                sx={{
                  "& .MuiSelect-select": {
                    padding: "12px 14px",
                    fontSize: "0.75rem",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: errors.riskPrioritization
                        ? "#d32f2f"
                        : "#b2bec3",
                    },
                    "&:hover fieldset": {
                      borderColor: errors.riskPrioritization
                        ? "#d32f2f"
                        : "#636e72",
                    },
                  },
                }}
              >
                <MenuItem value="High" sx={{ fontSize: "0.9rem" }}>
                  {t("risk_prioritization_high")}
                </MenuItem>
                <MenuItem value="Medium" sx={{ fontSize: "0.9rem" }}>
                  {t("risk_prioritization_medium")}
                </MenuItem>
                <MenuItem value="Low" sx={{ fontSize: "0.9rem" }}>
                  {t("risk_prioritization_low")}
                </MenuItem>
              </Select>
              {errors.riskPrioritization && (
                <FormHelperText sx={{ color: "#d32f2f", fontSize: "0.7rem" }}>
                  Risk prioritization is required
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              size="small"
              sx={{ flex: 1 }}
              error={errors.frequency}
            >
              <InputLabel sx={{ color: "#636e72", fontSize: "1rem" }}>
                {t("frequency_label")} *
              </InputLabel>
              <Select
                value={frequency}
                onChange={(e) => {
                  setFrequency(e.target.value);
                  setErrors((prev) => ({ ...prev, frequency: false }));
                }}
                label={`${t("frequency_label")} *`}
                sx={{
                  "& .MuiSelect-select": {
                    padding: "12px 14px",
                    fontSize: "0.75rem",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: errors.frequency ? "#d32f2f" : "#b2bec3",
                    },
                    "&:hover fieldset": {
                      borderColor: errors.frequency ? "#d32f2f" : "#636e72",
                    },
                  },
                }}
              >
                <MenuItem value="Daily" sx={{ fontSize: "0.9rem" }}>
                  Daily
                </MenuItem>
                <MenuItem value="Weekly" sx={{ fontSize: "0.9rem" }}>
                  Weekly
                </MenuItem>
                <MenuItem value="Monthly" sx={{ fontSize: "0.9rem" }}>
                  Monthly
                </MenuItem>
                <MenuItem value="Yearly" sx={{ fontSize: "0.9rem" }}>
                  Yearly
                </MenuItem>
              </Select>
              {errors.frequency && (
                <FormHelperText sx={{ color: "#d32f2f", fontSize: "0.7rem" }}>
                  Frequency is required
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box mb={3}>
            <Typography
              variant="body1"
              gutterBottom
              fontWeight="500"
              color="#2c3e50"
              sx={{ fontSize: "0.9rem" }}
            >
              {t("risk_consequences_label")}
            </Typography>
            <TextField
              value={riskConsequences}
              onChange={(e) => setRiskConsequences(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              placeholder="Describe the potential consequences if this risk materializes"
              sx={{
                mt: 0,
                "& .MuiInputBase-root": {
                  fontSize: "0.8rem",
                  height: "70px",
                  padding: "8px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#b2bec3",
                  },
                  "&:hover fieldset": {
                    borderColor: "#636e72",
                  },
                },
              }}
            />
          </Box>

          <Box mb={3} mt={3}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: "#636e72", fontSize: "1rem" }}>
                {t("affected_areas_label")} *
              </InputLabel>
              <Select
                multiple
                value={selectedAreas}
                onChange={handleAreaChange}
                label={`${t("affected_areas_label")} *`}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom", // Opens below the input field
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top", // Aligns with the top of the input field
                    horizontal: "left",
                  },
                  PaperProps: {
                    style: {
                      maxHeight: 300, // Limits the height of the dropdown
                      marginTop: 8, // Adds some spacing between the field and dropdown
                    },
                  },
                  getContentAnchorEl: null, // Disables default positioning behavior
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        size="small"
                        sx={{
                          backgroundColor: "#f5f5f5",
                          fontSize: "0.75rem",
                        }}
                        onDelete={() => handleChipDelete(value)} // Handle delete when clicking "X"
                        deleteIcon={<Close />} // Add "X" icon
                      />
                    ))}
                  </Box>
                )}
              >
                {affectedAreas.map((area) => (
                  <MenuItem key={area} value={area} sx={{ fontSize: "0.9rem" }}>
                    {area}
                  </MenuItem>
                ))}
              </Select>
              {errors.affectedAreas && (
                <Box sx={{ color: "red", fontSize: "0.7rem" }}>
                  At least one affected area is required
                </Box>
              )}
            </FormControl>
          </Box>

          <Box mb={3} mt={3}>
            <Typography
              variant="body1"
              gutterBottom
              fontWeight="500"
              color="#2c3e50"
              sx={{ fontSize: "0.9rem" }}
            >
              {t("assessment_notes_label")}
            </Typography>
            <TextField
              value={assessmentNotes}
              onChange={(e) => setAssessmentNotes(e.target.value)}
              fullWidth
              multiline
              placeholder={t("assessment_notes_placeholder")}
              rows={4}
              variant="outlined"
              sx={{
                "& .MuiInputBase-root": {
                  padding: "10px",
                  fontSize: "0.8rem",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#b2bec3",
                  },
                  "&:hover fieldset": {
                    borderColor: "#636e72",
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          p: 1,
          borderTop: "1px solid #dfe6e9",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{
            px: 2,
            py: 1,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 400,
            fontSize: "0.9rem",
            background: "#3B82F6",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": {
              background: "#3D54f4",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            },
            "&:disabled": {
              background: "#b0bec5",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t("save_assessment_button")
          )}
        </Button>
      </Box>
    </Drawer>
    </>
  );
};

export default RiskAssessmentDrawer;

RiskAssessmentDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  risk: PropTypes.object,
  editRisk: PropTypes.object,
  onSuccess: PropTypes.func,
  isCreate: PropTypes.bool,
};
RiskAssessmentDrawer.defaultProps = {
  risk: null,
  editRisk: null,
  onSuccess: null,
  isCreate: false,
};
