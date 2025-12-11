import  { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Button,
  CircularProgress,
  Slider,
  FormHelperText,
  FormControl,
  FormLabel,
  GlobalStyles,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AssessmentIcon from "@mui/icons-material/Assessment";
import {
  CreateRiskAPI,
  Edit_Risk_API,
} from "../../../services/sopRisk/SOPRisk";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const MonitoringReviewDrawer = ({
  open,
  onClose,
  risk,
  editRisk,
  isCreate,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [riskId, setRiskId] = useState("");
  const [monitoringFrequency, setMonitoringFrequency] = useState("");
  const [lastReviewDate, setLastReviewDate] = useState(null);
  const [nextReviewDate, setNextReviewDate] = useState(null);
  const [reviewFindings, setReviewFindings] = useState("");

  const [alertCondition, setAlertCondition] = useState(""); // Alert Condition input
  const [alertAction, setAlertAction] = useState(""); // Action for "If X then Y"
  const [controlEffectiveness, setControlEffectiveness] = useState(1); // Control Effectiveness slider

  const [kpis, setKpis] = useState(""); // KPI input field

  const [riskModuleDraftID, setRiskModuleDraftID] = useState(null);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    monitoringFrequency: false,
    // kpis: false,
    reviewFindings: false,
    nextReviewDate: false,
    controlEffectiveness: false,
  });

  const frequencyOptions = ["Daily", "Weekly", "Monthly", "Quarterly"];

  console.log("editRiskintheM", editRisk);
  console.log(isCreate, "isCreateMR");

  useEffect(() => {
    console.log(isCreate, "isCreateMR");
    if (isCreate) {
      // Reset all form fields to their initial state
      setMonitoringFrequency("");
      setLastReviewDate(null);
      setNextReviewDate(null);
      setReviewFindings("");
      setAlertCondition("");
      setAlertAction("");
      setControlEffectiveness(1);
      setKpis("");

      // Reset error states
      setErrors({
        monitoringFrequency: false,
        reviewFindings: false,
        nextReviewDate: false,
        controlEffectiveness: false,
      });
    }
  }, [isCreate]);

  useEffect(() => {
    if (risk) {
      setRiskId(risk?.RiskID);
      setRiskModuleDraftID(risk?.RiskModuleDraftID);
    }

    // 🛠️ Prefill from editRisk data (Monitoring & Review)
    if (
      editRisk?.RiskMonitoringReviews &&
      editRisk.RiskMonitoringReviews.length > 0
    ) {
      const monitoringReview = editRisk.RiskMonitoringReviews[0]; // Take the first record

      setMonitoringFrequency(monitoringReview.MonitoringFrequency || "");
      setLastReviewDate(
        monitoringReview.LastReviewDate
          ? new Date(monitoringReview.LastReviewDate)
          : null
      );
      setNextReviewDate(
        monitoringReview.NextReviewDate
          ? new Date(monitoringReview.NextReviewDate)
          : null
      );
      setReviewFindings(monitoringReview.ReviewFindings || "");
      setAlertCondition(monitoringReview.AlertCondition || "");
      setAlertAction(monitoringReview.AlertAction || "");
      setControlEffectiveness(monitoringReview.ControlEffectiveness ?? 1);
      setKpis(monitoringReview.KPI || "");
    }
  }, [risk, editRisk]);

  useEffect(() => {
    if (risk) {
      setRiskId(risk?.RiskID); // Set the RiskID passed from the parent
      setRiskModuleDraftID(risk?.RiskModuleDraftID);
    }
  }, [risk]);

  const validateFields = () => {
    const newErrors = {
      monitoringFrequency: !monitoringFrequency,
      // kpis: !kpis.trim(),
      reviewFindings: !reviewFindings.trim(),
      nextReviewDate: !nextReviewDate,
      controlEffectiveness:
        controlEffectiveness === null || controlEffectiveness === undefined,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const createRiskMonitoring = async () => {
    const payload = {
      RiskID: riskId,
      RiskState: "Risk Monitoring & Review",
      MonitoringFrequency: monitoringFrequency,
      LastReviewDate: lastReviewDate ? lastReviewDate.toISOString() : null,
      NextReviewDate: nextReviewDate ? nextReviewDate.toISOString() : null,
      ReviewFindings: reviewFindings,
      AlertCondition: alertCondition,
      AlertAction: alertAction,
      ControlEffectiveness: controlEffectiveness,
      RiskModuleDraftID: riskModuleDraftID,
      KPI: kpis,
    };

    setLoading(true);

    try {
      const response = await CreateRiskAPI(payload);

      if (response.status >= 200 && response.status < 300) {
        toast.success(
          response.data?.message || "Risk monitoring created successfully!"
        );
        onClose();
        if (onSuccess) {
          onSuccess(response.data); // Pass the success response data to the parent
        } else {
          toast.error(response.data.message || "Failed to create risk");
        }
        // window.location.reload();
      } else {
        toast.error(
          response.data?.message || "Failed to create risk monitoring."
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error during creation.");
    } finally {
      setLoading(false);
    }
  };

  const editRiskMonitoring = async () => {
    const payload = {
      RiskID: editRisk?.RiskTreatments[0]?.RiskID,
      RiskState: "Risk Monitoring & Review",
      MonitoringFrequency: monitoringFrequency,
      LastReviewDate: lastReviewDate ? lastReviewDate.toISOString() : null,
      NextReviewDate: nextReviewDate ? nextReviewDate.toISOString() : null,
      ReviewFindings: reviewFindings,
      AlertCondition: alertCondition,
      AlertAction: alertAction,
      ControlEffectiveness: controlEffectiveness,
      RiskModuleDraftID: riskModuleDraftID,
      KPI: kpis,
    };

    setLoading(true);

    try {
      const response = await Edit_Risk_API(payload);

      if (response.status >= 200 && response.status < 300) {
        toast.success(
          response.data?.message || "Risk monitoring updated successfully!"
        );
        onClose();
        window.location.reload();
      } else {
        toast.error(
          response.data?.message || "Failed to update risk monitoring."
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error during update.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateFields()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editRisk && editRisk.RiskMonitoringReviews?.length > 0) {
      await editRiskMonitoring(); // If Editing
    } else {
      await createRiskMonitoring(); // If Creating
    }
  };

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
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "500px" },
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f9fafb",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AssessmentIcon
              sx={{
                mr: 2,
                color: "primary.main",
                fontSize: "28px",
              }}
            />
            <Typography variant="h6" fontWeight={600}>
              {t("monitoring_and_review")}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "text.secondary",
              position: "absolute",
              right: 16,
              top: 16,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            p: 3,
            flex: 1,
            overflowY: "auto",
            fontSize: "0.75rem", // Global font size for smaller text
            "& .MuiTextField-root": {
              mb: 2,
            },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
              sx={{
                p: 3,
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <Grid container spacing={3}>
                {/* Monitoring Frequency */}
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel className="risk_field_lable">
                      {`${t("monitoring_frequency_label")} *`}
                    </FormLabel>
                    <TextField
                      select
                      value={monitoringFrequency}
                      onChange={(e) => {
                        setMonitoringFrequency(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          monitoringFrequency: false,
                        }));
                      }}
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                        },
                      }}
                    >
                      {frequencyOptions.map((option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          sx={{ fontSize: "0.9rem" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {option}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                    {errors.monitoringFrequency && (
                      <Box error sx={{ mt: -2, mb: 2, color: "red" }}>
                        Monitoring frequency is required
                      </Box>
                    )}
                  </FormControl>
                </Grid>

                {/* Alert Condition (Rule Builder) */}
                <Grid item xs={12} mt={-4}>
                  <FormControl fullWidth>
                    <FormLabel className="risk_field_lable">
                      Alert Condition (If X)
                    </FormLabel>
                    <TextField
                      value={alertCondition}
                      onChange={(e) => setAlertCondition(e.target.value)}
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="Enter condition"
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                        },
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} mt={-2}>
                  <FormControl fullWidth>
                    <FormLabel className="risk_field_lable">
                      Alert Action (Then Y)
                    </FormLabel>
                    <TextField
                      value={alertAction}
                      onChange={(e) => setAlertAction(e.target.value)}
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="Enter action"
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                        },
                      }}
                    />
                  </FormControl>
                </Grid>

                {/* Date Pickers */}
                <Grid item xs={12} sm={6} sx={{ mt: -2 }}>
                  <DatePicker
                    label={t("last_review_date_label")}
                    value={lastReviewDate}
                    onChange={(newValue) => setLastReviewDate(newValue)}
                    maxDate={new Date()}
                    // minDate={
                    //   new Date(new Date().setDate(new Date().getDate() + 1))
                    // }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: "8px",
                            fontSize: "0.75rem", // Font size for text field
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mt: -2 }}>
                  <DatePicker
                    label={`${t("next_review_date_label")} *`}
                    value={nextReviewDate}
                    onChange={(newValue) => {
                      setNextReviewDate(newValue);
                      setErrors((prev) => ({ ...prev, nextReviewDate: false }));
                    }}
                    minDate={
                      new Date(new Date().setDate(new Date().getDate() + 1))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: "8px",
                            fontSize: "0.75rem", // Font size for text field
                          },
                        }}
                      />
                    )}
                  />
                  {errors.nextReviewDate && (
                    <Box error sx={{ mt: -2, mb: 2, color: "red" }}>
                      Next review date is required
                    </Box>
                  )}
                </Grid>

                {/* KPI Input Field */}
                <Grid item xs={12} mt={-2}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel className="risk_field_lable">KPIs</FormLabel>
                    <TextField
                      value={kpis}
                      onChange={(e) => {
                        setKpis(e.target.value);
                        setErrors((prev) => ({ ...prev, kpis: false }));
                      }}
                      variant="outlined"
                      fullWidth
                      size="small"
                      multiline
                      rows={1}
                      placeholder="Enter KPIs here"
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                        },
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    className="risk_field_lable"
                    color="text.secondary"
                    mt={-5}
                    mb={2}
                  >
                    Control Effectiveness *
                  </Typography>
                  <Slider
                    value={controlEffectiveness}
                    onChange={(e, newValue) =>
                      setControlEffectiveness(newValue)
                    }
                    min={0}
                    max={5}
                    valueLabelDisplay="on" // Show value always
                    valueLabelFormat={(value) => `${value}`}
                    sx={{
                      mb: 0,
                      "& .MuiSlider-valueLabel": {
                        top: "auto", // Reset the top position
                        bottom: "0px", // Position the label below the slider
                      },
                      marginTop: 2.3,
                    }}
                  />
                  {errors.controlEffectiveness && (
                    <FormHelperText error sx={{ mt: -1, mb: 2 }}>
                      Control effectiveness is required
                    </FormHelperText>
                  )}
                </Grid>

                {/* Review Findings */}
                <Grid item xs={12} mt={-2}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel className="risk_field_lable">
                      {`${t("review_findings_label")} *`}
                    </FormLabel>
                    <TextField
                      value={reviewFindings}
                      onChange={(e) => {
                        setReviewFindings(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          reviewFindings: false,
                        }));
                      }}
                      variant="outlined"
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      placeholder="Summary of findings from the latest review"
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                        },
                      }}
                    />
                    {errors.reviewFindings && (
                      <Box error sx={{ mt: -2, color: "red" }}>
                        Review findings are required
                      </Box>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </LocalizationProvider>
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            backgroundColor: "white",
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              px: 3,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              color: "text.secondary",
              borderColor: "rgba(0, 0, 0, 0.23)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                borderColor: "rgba(0, 0, 0, 0.23)",
              },
            }}
          >
            {t("cancel_button")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              px: 3,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: "#3B82F6",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("save_changes_button")
            )}
          </Button>
        </Box>
      </Box>
    </Drawer>
    </>
  );
};

export default MonitoringReviewDrawer;

MonitoringReviewDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  risk: PropTypes.object,
  editRisk: PropTypes.object,
  isCreate: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func,
};
MonitoringReviewDrawer.defaultProps = {
  risk: null,
  editRisk: null,
  onSuccess: null,
};
