import  { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  TextField,
  Slider,
  Button,
  CircularProgress,
  Card,
  FormControl,
  FormLabel,
  GlobalStyles,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  CreateRiskAPI,
  Edit_Risk_API,
} from "../../../services/sopRisk/SOPRisk";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { listProcessOwner } from "../../../services/sopModules/SopModule";
import PropTypes from "prop-types";

const RiskAnalysisDrawer = ({
  open,
  onClose,
  risk,
  editRisk,
  isCreate,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [riskId, setRiskId] = useState("");
  const [rootCauseInput, setRootCauseInput] = useState("");
  const [rootCauses, setRootCauses] = useState([]);
  const [fishboneFactors, setFishboneFactors] = useState([]);
  const [rootCauseAnalysis, setRootCauseAnalysis] = useState("");
  const [currentControls, setCurrentControls] = useState("");
  const [controlEffectiveness, setControlEffectiveness] = useState(3);
  const [riskExposure] = useState(1);
  const [potentialConsequences, setPotentialConsequences] = useState("");
  const [triggerIndicators, setTriggerIndicators] = useState("");
  const [riskModuleDraftID, setRiskModuleDraftID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentControlsInput, setCurrentControlsInput] = useState("");
  const [currentControlsList, setCurrentControlsList] = useState([]);
  const [potentialConsequencesInput, setPotentialConsequencesInput] =
    useState("");
  const [potentialConsequencesList, setPotentialConsequencesList] = useState(
    []
  );
  const [triggerIndicatorsInput, setTriggerIndicatorsInput] = useState("");
  const [triggerIndicatorsList, setTriggerIndicatorsList] = useState([]);
  const [riskOwnersList, setRiskOwnersList] = useState([]);

  console.log("currentControlsInput:", currentControlsInput,riskOwnersList,potentialConsequences,triggerIndicators,fishboneFactors,rootCauseAnalysis,currentControls);

  console.log("RiskAnalysisDrawereditddd", editRisk);

  console.log(isCreate, "isCreateAnalysisDrawer");

  useEffect(() => {
    console.log(isCreate, "isCreateAnalysisDrawer");
    if (isCreate) {
      // Reset all form fields to their initial state
      setRootCauseInput("");
      setRootCauses([]);
      setFishboneFactors([]);
      setRootCauseAnalysis("");
      setCurrentControls("");
      setControlEffectiveness(3);
      setPotentialConsequences("");
      setTriggerIndicators("");
      setCurrentControlsInput("");
      setCurrentControlsList([]);
      setPotentialConsequencesInput("");
      setPotentialConsequencesList([]);
      setTriggerIndicatorsInput("");
      setTriggerIndicatorsList([]);

      // Reset error states
      setErrors({
        rootCauses: false,
        currentControls: false,
        potentialConsequences: false,
        triggerIndicators: false,
      });
    }
  }, [isCreate]);
  useEffect(() => {
    if (
      editRisk &&
      editRisk.RiskAnalysiss &&
      editRisk.RiskAnalysiss.length > 0
    ) {
      const analysisData = editRisk.RiskAnalysiss[0];

      setRootCauses(analysisData.RootCause || []);
      setCurrentControlsList(analysisData.CurrentControls || []);
      setPotentialConsequencesList(analysisData.PotentialConsequences || []);
      setTriggerIndicatorsList(analysisData.TriggerIndicators || []);
      setControlEffectiveness(analysisData.ControlEffectiveness || 3); // default 3 if null
      setRiskModuleDraftID(analysisData.RiskModuleDraftID || null);
      setRiskId(analysisData.RiskID || ""); // optional if needed
    }
  }, [editRisk]);

  // Error states
  const [errors, setErrors] = useState({
    rootCauses: false,
    currentControls: false,
    potentialConsequences: false,
    triggerIndicators: false,
  });

  useEffect(() => {
    if (risk) {
      setRiskId(risk?.RiskID);
      setRiskModuleDraftID(risk?.RiskModuleDraftID);
    }
  }, [risk]);

  useEffect(() => {
    const fetchProcessOwners = async () => {
      try {
        const response = await listProcessOwner({});
        setRiskOwnersList(response?.data?.data?.userList || []);
        console.log(
          "Process Owners In the Owner:",
          response?.data?.data?.userList || []
        );
      } catch (error) {
        console.error("Error fetching process owners:", error);
        toast.error("Failed to load risk owners");
      }
    };

    fetchProcessOwners();
  }, []);

  const marks = [
    { value: 1, label: "1 - Low" },
    { value: 2, label: "2" },
    { value: 3, label: "3 - Medium" },
    { value: 4, label: "4" },
    { value: 5, label: "5 - High" },
  ];

  const validateFields = () => {
    const newErrors = {
      rootCauses: rootCauses.length === 0,
      currentControls: currentControlsList.length === 0, // Validate current controls
      potentialConsequences: potentialConsequencesList.length === 0, // Validate potential consequences
      triggerIndicators: triggerIndicatorsList.length === 0,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };
  const createRiskAnalysis = async () => {
    if (!validateFields()) {
      toast.error("Please fill all required fields");
      return;
    }

    const createPayload = {
      RiskState: "Risk Analysis Form",
      RiskID: riskId,
      RootCauseAnalysis: rootCauses.join("\n"),
      ControlEffectiveness: controlEffectiveness,
      RiskExposure: riskExposure,
      RiskModuleDraftID: riskModuleDraftID,
      RootCause: rootCauses,
      CurrentControls: currentControlsList,
      PotentialConsequences: potentialConsequencesList,
      TriggerIndicators: triggerIndicatorsList,
    };

    setLoading(true);

    try {
      const response = await CreateRiskAPI(createPayload);

      if (response.status >= 200 && response.status < 300) {
        toast.success(
          response.data?.message || "Risk analysis created successfully!"
        );
        onClose();
        if (onSuccess) {
          onSuccess(response.data); // Pass the success response data to the parent
        } else {
          toast.error(response.data.message || "Failed to create risk");
        }
        // window.location.reload();
      } else {
        toast.error(response.data?.message || "Failed to create risk analysis");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred while creating";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const editRiskAnalysis = async () => {
    if (!validateFields()) {
      toast.error("Please fill all required fields");
      return;
    }

    const editPayload = {
      RiskState: "Risk Analysis Form",
      RiskID: editRisk?.RiskAnalysiss[0]?.RiskID,
      RootCauseAnalysis: rootCauses.join("\n"),
      ControlEffectiveness: controlEffectiveness,
      RiskExposure: riskExposure,
      RiskModuleDraftID: riskModuleDraftID,
      RootCause: rootCauses,
      CurrentControls: currentControlsList,
      PotentialConsequences: potentialConsequencesList,
      TriggerIndicators: triggerIndicatorsList,
      EditedAt: new Date().toISOString(), // ➔ You can add more specific fields if you want for edit
    };

    setLoading(true);

    try {
      const response = await Edit_Risk_API(editPayload);

      if (response.status >= 200 && response.status < 300) {
        toast.success(
          response.data?.message || "Risk analysis updated successfully!"
        );
        onClose();
        window.location.reload();
      } else {
        toast.error(response.data?.message || "Failed to update risk analysis");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred while updating";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (editRisk && editRisk?.RiskAnalysiss?.length > 0) {
      editRiskAnalysis(); // Call EDIT
    } else {
      createRiskAnalysis(); // Call CREATE
    }
  };

  const handleRootCauseKeyDown = (e) => {
    if (e.key === "Enter" && rootCauseInput.trim()) {
      e.preventDefault();
      setRootCauses((prev) => [...prev, rootCauseInput.trim()]);
      setRootCauseInput("");
      setErrors((prev) => ({ ...prev, rootCauses: false }));
    }
  };

  const handleRemoveCause = (indexToRemove) => {
    setRootCauses((prev) => prev.filter((_, index) => index !== indexToRemove));
    setErrors((prev) => ({ ...prev, rootCauses: rootCauses.length <= 1 }));
  };

  const handleCurrentControlsKeyDown = (e) => {
    if (e.key === "Enter" && currentControlsInput.trim()) {
      e.preventDefault();
      setCurrentControlsList([
        ...currentControlsList,
        currentControlsInput.trim(),
      ]);
      setCurrentControlsInput("");
      setErrors((prev) => ({ ...prev, currentControls: false }));
    }
  };

  // Add this removal handler
  const handleRemoveControl = (index) => {
    const newControls = [...currentControlsList];
    newControls.splice(index, 1);
    setCurrentControlsList(newControls);
  };

  const handlePotentialConsequencesKeyDown = (e) => {
    if (e.key === "Enter" && potentialConsequencesInput.trim()) {
      e.preventDefault();
      setPotentialConsequencesList([
        ...potentialConsequencesList,
        potentialConsequencesInput.trim(),
      ]);
      setPotentialConsequencesInput("");
      setErrors((prev) => ({ ...prev, potentialConsequences: false }));
    }
  };

  // Add this removal handler
  const handleRemoveConsequence = (index) => {
    const newConsequences = [...potentialConsequencesList];
    newConsequences.splice(index, 1);
    setPotentialConsequencesList(newConsequences);
  };

  const handleTriggerIndicatorsKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && triggerIndicatorsInput.trim()) {
      e.preventDefault();
      setTriggerIndicatorsList([
        ...triggerIndicatorsList,
        triggerIndicatorsInput.trim(),
      ]);
      setTriggerIndicatorsInput("");
      setErrors((prev) => ({ ...prev, triggerIndicators: false }));
    }
  };

  // Add this removal handler
  const handleRemoveIndicator = (index) => {
    const newIndicators = [...triggerIndicatorsList];
    newIndicators.splice(index, 1);
    setTriggerIndicatorsList(newIndicators);
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              backgroundColor: "background.paper",
            }}
          >
            <Box
              sx={{
                p: 3,
                pb: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                position: "relative",
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {t("risk_analysis")}
              </Typography>
              <IconButton
                onClick={onClose}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
                  color: "text.secondary",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Card
              sx={{
                padding: 3,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
                border: "1px solid #e0e0e0",
                flex: 1,
                overflowY: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 3,
                  pt: 2,
                  fontSize: "0.75rem",
                  "& .MuiTextField-root": { mb: 2 },
                }}
              >
                <FormControl fullWidth>
                  <FormLabel className="risk_field_lable">
                    Root Cause *
                  </FormLabel>
                  <TextField
                    value={rootCauseInput}
                    onChange={(e) => setRootCauseInput(e.target.value)}
                    onKeyDown={handleRootCauseKeyDown}
                    variant="outlined"
                    fullWidth
                    size="small"
                    multiline
                    rows={3}
                    placeholder={
                      rootCauses.length === 0
                        ? "Type and press Enter to add"
                        : ""
                    }
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                      },
                      "& .MuiInputBase-multiline": {
                        display: "flex",
                        flexWrap: "wrap", // Makes sure the root causes wrap to the next line
                        gap: "8px", // Space between the root cause tags
                        minHeight: "50px", // Ensures there is enough space to display multiple lines of input
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap", // Makes sure root causes go to the next line within the input area
                            gap: "8px",
                            mb: 1,
                          }}
                        >
                          {rootCauses.map((cause, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#f5f5f5",
                                borderRadius: "16px",
                                px: 1.5,
                                py: 0.5,
                                fontSize: "0.9rem",
                              }}
                            >
                              <Typography sx={{ fontSize: "0.75rem", mr: 0.5 }}>
                                {cause}
                              </Typography>
                              <IconButton
                                onClick={() => handleRemoveCause(index)}
                                size="small"
                                sx={{ padding: 0, ml: 0.5 }}
                              >
                                <CloseIcon sx={{ fontSize: "1rem" }} />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      ),
                    }}
                  />
                  {errors.rootCauses && (
                    <Box error sx={{ mt: -2, mb: 2, color: "red" }}>
                      At least one root cause is required
                    </Box>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel className="risk_field_lable">
                    {t("current_controls_label")} *
                  </FormLabel>
                  <TextField
                    value={currentControlsInput}
                    onChange={(e) => {
                      setCurrentControlsInput(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        currentControls: false,
                      }));
                    }}
                    onKeyDown={handleCurrentControlsKeyDown}
                    variant="outlined"
                    fullWidth
                    size="small"
                    multiline
                    rows={4}
                    placeholder={
                      currentControlsList.length === 0
                        ? "Describe existing control measures (Type and press Enter to add)"
                        : ""
                    }
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                      },
                      "& .MuiInputBase-multiline": {
                        display: "flex",
                        flexWrap: "wrap", // Ensures items move to next line when the space is filled
                        gap: "8px", // Adds space between the control tags
                        minHeight: "60px", // Ensures enough space for multiple rows of input
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap", // Makes sure current controls go to the next line within the input area
                            gap: "8px",
                            mb: 1,
                          }}
                        >
                          {currentControlsList.map((control, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#f5f5f5",
                                borderRadius: "16px",
                                px: 1.5,
                                py: 0.5,
                                fontSize: "0.75rem",
                              }}
                            >
                              <Typography sx={{ fontSize: "0.75rem", mr: 0.5 }}>
                                {control}
                              </Typography>
                              <IconButton
                                onClick={() => handleRemoveControl(index)}
                                size="small"
                                sx={{ padding: 0, ml: 0.5 }}
                              >
                                <CloseIcon sx={{ fontSize: "1rem" }} />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      ),
                    }}
                  />
                  {errors.currentControls && (
                    <Box error sx={{ mt: -2, mb: 2, color: "red" }}>
                      Current controls are required
                    </Box>
                  )}
                </FormControl>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    id="control-effectiveness-slider"
                    gutterBottom
                    // variant="body2"
                    color="text.secondary"
                    // fontWeight={500}
                    className="risk_field_lable"
                  >
                    {t("control_effectiveness_label")}
                  </Typography>
                  <Slider
                    aria-labelledby="control-effectiveness-slider"
                    value={controlEffectiveness}
                    onChange={(e, newValue) =>
                      setControlEffectiveness(newValue)
                    }
                    step={1}
                    min={1}
                    max={5}
                    marks={marks}
                    valueLabelDisplay="auto"
                    sx={{
                      "& .MuiSlider-markLabel": {
                        fontSize: "0.75rem",
                        mt: 1,
                      },
                    }}
                  />
                </Box>

                <FormControl fullWidth>
                  <FormLabel className="risk_field_lable">
                    {t("potential_consequences_label")} *
                  </FormLabel>
                  <TextField
                    value={potentialConsequencesInput}
                    onChange={(e) => {
                      setPotentialConsequencesInput(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        potentialConsequences: false,
                      }));
                    }}
                    onKeyDown={handlePotentialConsequencesKeyDown}
                    variant="outlined"
                    fullWidth
                    size="small"
                    multiline
                    rows={4}
                    placeholder={
                      potentialConsequencesList.length === 0
                        ? "Describe potential consequences (Type and press Enter to add)"
                        : ""
                    }
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                      },
                      "& .MuiInputBase-multiline": {
                        display: "flex",
                        flexWrap: "wrap", // Ensures items move to next line when the space is filled
                        gap: "8px", // Adds space between the consequence tags
                        minHeight: "60px", // Ensures enough space for multiple rows of input
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap", // Makes sure potential consequences go to the next line within the input area
                            gap: "8px",
                            mb: 1,
                          }}
                        >
                          {potentialConsequencesList.map(
                            (consequence, index) => (
                              <Box
                                key={index}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  backgroundColor: "#f5f5f5",
                                  borderRadius: "16px",
                                  px: 1.5,
                                  py: 0.5,
                                  fontSize: "0.75rem",
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: "0.75rem", mr: 0.5 }}
                                >
                                  {consequence}
                                </Typography>
                                <IconButton
                                  onClick={() => handleRemoveConsequence(index)}
                                  size="small"
                                  sx={{ padding: 0, ml: 0.5 }}
                                >
                                  <CloseIcon sx={{ fontSize: "1rem" }} />
                                </IconButton>
                              </Box>
                            )
                          )}
                        </Box>
                      ),
                    }}
                  />
                  {errors.potentialConsequences && (
                    <Box error sx={{ mt: -2, mb: 2, color: "red" }}>
                      Potential consequences are required
                    </Box>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel className="risk_field_lable">
                    {t("trigger_indicators_label")} *
                  </FormLabel>
                  <TextField
                    value={triggerIndicatorsInput}
                    onChange={(e) => {
                      setTriggerIndicatorsInput(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        triggerIndicators: false,
                      }));
                    }}
                    onKeyDown={handleTriggerIndicatorsKeyDown}
                    variant="outlined"
                    fullWidth
                    size="small"
                    multiline
                    rows={4}
                    placeholder={
                      triggerIndicatorsList.length === 0
                        ? "Describe trigger indicators (Type and press Enter or comma to add)"
                        : ""
                    }
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                      },
                      "& .MuiInputBase-multiline": {
                        display: "flex",
                        flexWrap: "wrap", // Ensures items move to next line when the space is filled
                        gap: "8px", // Adds space between the indicator tags
                        minHeight: "60px", // Ensures enough space for multiple rows of input
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap", // Makes sure trigger indicators go to the next line within the input area
                            gap: "8px",
                            mb: 1,
                          }}
                        >
                          {triggerIndicatorsList.map((indicator, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#f5f5f5",
                                borderRadius: "16px",
                                px: 1.5,
                                py: 0.5,
                                fontSize: "0.75rem",
                              }}
                            >
                              <Typography sx={{ fontSize: "0.75rem", mr: 0.5 }}>
                                {indicator}
                              </Typography>
                              <IconButton
                                onClick={() => handleRemoveIndicator(index)}
                                size="small"
                                sx={{ padding: 0, ml: 0.5 }}
                              >
                                <CloseIcon sx={{ fontSize: "1rem" }} />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      ),
                    }}
                  />
                  {errors.triggerIndicators && (
                    <Box error sx={{ mt: -2, mb: 2, color: "red" }}>
                      Trigger indicators are required
                    </Box>
                  )}
                </FormControl>
              </Box>
            </Card>
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
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
                    backgroundColor: "#2563EB",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t("save_analysis_button")
                )}
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Drawer>
    </>
  );
};

export default RiskAnalysisDrawer;

RiskAnalysisDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  risk: PropTypes.object,
  editRisk: PropTypes.object,
  isCreate: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func,
};
RiskAnalysisDrawer.defaultProps = {
  risk: null,
  editRisk: null,
  onSuccess: null,
};
