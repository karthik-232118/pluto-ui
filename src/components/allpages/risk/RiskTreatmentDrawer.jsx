import  { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Slider,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Card,
  Divider,
  FormHelperText,
  FormControl,
  FormLabel,
  LinearProgress,
  GlobalStyles,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  CreateRiskAPI,
  Edit_Risk_API,
} from "../../../services/sopRisk/SOPRisk";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { listProcessOwner } from "../../../services/sopModules/SopModule";
import { riskUploadDocument } from "../../../services/common/common.service";
import PropTypes from "prop-types";

const RiskTreatmentDrawer = ({
  open,
  onClose,
  risk,
  editRisk,
  isCreate,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [riskId, setRiskId] = useState("");
  const [treatmentStrategy, setTreatmentStrategy] = useState("");
  const [treatmentActions, setTreatmentActions] = useState("");
  const [residualRisk, setResidualRisk] = useState(2);
  const [treatmentEffectiveness, setTreatmentEffectiveness] = useState(5);
  const [resourcesRequired, setResourcesRequired] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [targetDate, setTargetDate] = useState(null);
  const [treatmentStatus, setTreatmentStatus] = useState("NotStarted");
  const [riskModuleDraftID, setRiskModuleDraftID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [treatmentActionsInput, setTreatmentActionsInput] = useState("");
  const [treatmentActionsList, setTreatmentActionsList] = useState([]);
  const [resourcesRequiredInput, setResourcesRequiredInput] = useState("");
  const [resourcesRequiredList, setResourcesRequiredList] = useState([]);
  const [riskOwnersList, setRiskOwnersList] = useState([]);
  const [selectedOwnerID, setSelectedOwnerID] = useState("");
  const [progress, setProgress] = useState(0); 
  const [relatedDocuments, setRelatedDocuments] = useState(null);
  console.log(riskOwnersList,treatmentActions,resourcesRequired,selectedOwnerID, "riskOwnersList1stsett");
  console.log("RTEditRisk", editRisk);
  const [controlMeasureType, setControlMeasureType] = useState(
    "Predefined controls library"
  );
  const [customControlDescription, setCustomControlDescription] = useState("");
  const [actionItems, setActionItems] = useState([
    {
      TreatmentDescription: "",
      TreatmentOwner: "",
      TreatmentDueDate: null,
      TreatmentActionStatus: "NotStarted",
    },
  ]);

  console.log(isCreate, "isCreateTD");

  useEffect(() => {
    console.log(isCreate, "isCreateTD");
    if (isCreate) {
      setTreatmentStrategy("");
      setTreatmentActions("");
      setResidualRisk(2);
      setTreatmentEffectiveness(5);
      setResourcesRequired("");
      setApprovalStatus("");
      setTargetDate(null);
      setTreatmentStatus("NotStarted");
      setTreatmentActionsInput("");
      setTreatmentActionsList([]);
      setResourcesRequiredInput("");
      setResourcesRequiredList([]);
      setSelectedOwnerID("");
      setProgress(0);
      setRelatedDocuments(null);
      setControlMeasureType("Predefined controls library");
      setCustomControlDescription("");
      setActionItems([
        {
          TreatmentDescription: "",
          TreatmentOwner: "",
          TreatmentDueDate: null,
          TreatmentActionStatus: "NotStarted",
        },
      ]);
      setBudgetRequired("");
      setBudgetBreakdown([{ category: "", amount: "" }]);

      setErrors({
        treatmentStrategy: false,
        customControlDescription: false,
        actionItems: false,
      });
    }
  }, [isCreate]);

  const [budgetRequired, setBudgetRequired] = useState("");
 
  const [budgetBreakdown, setBudgetBreakdown] = useState([
    { category: "", amount: "" },
  ]);

  console.log(budgetBreakdown)

  const [errors, setErrors] = useState({
    treatmentStrategy: false,
    customControlDescription: false,
    actionItems: false,
  });

  const strategyOptions = ["Accept", "Reduce", "Transfer", "Avoid"];
  const statusOptions = ["Pending", "Approved", "Rejected", "OnHold"];

  useEffect(() => {
    if (editRisk?.RiskTreatments && editRisk.RiskTreatments.length > 0) {
      const treatment = editRisk.RiskTreatments[0];

      setTreatmentStrategy(treatment.TreatmentStrategy || "");
      setTreatmentActionsList(treatment.TreatmentActions || []);
      setTargetDate(
        treatment.TargetCompletionDate
          ? new Date(treatment.TargetCompletionDate)
          : null
      );
      setTreatmentStatus(treatment.TreatmentStatus || "");
      setResidualRisk(treatment.ResidualRisk ?? 2);
      setTreatmentEffectiveness(treatment.TreatmentEffectiveness ?? 5);
      setResourcesRequiredList(treatment.ResourcesRequired || []);
      setApprovalStatus(treatment.ApprovalStatus || "");
      setBudgetRequired(treatment.BudgetRequired || "");

      if (treatment.ControlMeasures === "Custom Controls") {
        setControlMeasureType("Custom Controls");
        setCustomControlDescription(treatment.ControlMeasures);
      } else {
        setControlMeasureType(
          treatment.ControlMeasures || "Predefined controls library"
        );
      }

      if (
        treatment.RiskTreatmentActionItems &&
        treatment.RiskTreatmentActionItems.length > 0
      ) {
        console.log(
          "Action Items from API:",
          treatment.RiskTreatmentActionItems
        );
        const mappedActionItems = treatment.RiskTreatmentActionItems.map(
          (item) => ({
            TreatmentDescription: item.TreatmentDescription || "",
            TreatmentOwner: item.TreatmentOwner || "",
            TreatmentDueDate: item.TreatmentDueDate
              ? new Date(item.TreatmentDueDate)
              : null,
            TreatmentActionStatus: item.TreatmentActionStatus || "NotStarted",
          })
        );

        setActionItems(mappedActionItems); 
      } else {
        setActionItems([
          {
            TreatmentDescription: "",
            TreatmentOwner: "",
            TreatmentDueDate: null,
            TreatmentActionStatus: "NotStarted",
          },
        ]);
      }

      if (treatment?.RiskTreatmentDocumentPath) {
        setRelatedDocuments(treatment.RiskTreatmentDocumentPath);
      }
    }
  }, [editRisk?.RiskTreatments]);

  useEffect(() => {
    const fetchProcessOwners = async () => {
      try {
        const response = await listProcessOwner({});
        setRiskOwnersList(response?.data?.data?.userList || []);
      } catch (error) {
        console.error("Error fetching process owners:", error);
      }
    };
    fetchProcessOwners();
  }, []);

  useEffect(() => {
    if (risk) {
      setRiskId(risk?.RiskID); 
      setRiskModuleDraftID(risk?.RiskModuleDraftID);
    }
  }, [risk]);

  const handleAddActionItem = () => {
    setActionItems((prev) => [
      ...prev,
      {
        TreatmentDescription: "",
        TreatmentOwner: "",
        TreatmentDueDate: null,
        TreatmentActionStatus: "NotStarted",
      },
    ]);
  };

  const handleRemoveActionItem = (index) => {
    setActionItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleActionItemChange = (index, field, value) => {
    setActionItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value, 
            }
          : item
      )
    );
  };

  const validateFields = () => {
    const newErrors = {
      treatmentStrategy: !treatmentStrategy,
      customControlDescription:
        controlMeasureType === "Custom Controls" &&
        !customControlDescription.trim(),
      actionItems: actionItems.some(
        (item) => !item.TreatmentDescription.trim()
      ),
      budgetRequired: !budgetRequired, 
      treatmentActions: treatmentActionsList.length === 0, 
      targetDate: !targetDate, 
      resourcesRequired: resourcesRequiredList.length === 0, 
      approvalStatus: !approvalStatus, 
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleCreateRisk = async () => {
    if (!validateFields()) {
      toast.error("Please fill all required fields");
      return;
    }
    const payload = {
      RiskState: "Risk Treatment",
      RiskID: riskId,
      TreatmentStrategy: treatmentStrategy,
      TreatmentActions: treatmentActionsList,
      TargetCompletionDate: targetDate,
      TreatmentStatus: treatmentStatus,
      ResidualRisk: residualRisk,
      TreatmentEffectiveness: treatmentEffectiveness,
      ResourcesRequired: resourcesRequiredList, 
      ApprovalStatus: approvalStatus,
      RiskModuleDraftID: riskModuleDraftID,
      TreatmentFileUrl: relatedDocuments, 
      ControlMeasures: controlMeasureType || customControlDescription,
      TreatmentActionItems: actionItems.map((item) => ({
        ...item,
        TreatmentOwner: item.TreatmentOwner,
      })),
      BudgetRequired: budgetRequired,
     
    };

    setLoading(true);

    try {
     
      const response = await CreateRiskAPI(payload);

      if (response.status >= 200 && response.status < 300) {
        toast.success(
          response.data?.message || "Risk treatment saved successfully!"
        );
        onClose();
        if (onSuccess) {
          onSuccess(response.data); 
        } else {
          toast.error(response.data.message || "Failed to create risk");
        }
       
      } else {
        const errorMessage =
          response.data?.message || "Failed to save risk treatment";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error saving risk treatment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while saving the risk treatment";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRisk = async () => {
    const editPayload = {
      RiskState: "Risk Treatment",
      RiskID: editRisk?.RiskTreatments[0]?.RiskID,
      TreatmentStrategy: treatmentStrategy,
      TreatmentActions: treatmentActionsList,
      TargetCompletionDate: targetDate,
      TreatmentStatus: treatmentStatus,
      ResidualRisk: residualRisk,
      TreatmentEffectiveness: treatmentEffectiveness,
      ResourcesRequired: resourcesRequiredList,
      ApprovalStatus: approvalStatus,
      RiskModuleDraftID: riskModuleDraftID,
      FileUrl: relatedDocuments,
      ControlMeasures: controlMeasureType || customControlDescription,
      TreatmentActionItems: actionItems.map((item) => ({
        ...item,
        TreatmentOwner: item.TreatmentOwner,
      })),
      BudgetRequired: budgetRequired,
    };

    setLoading(true);
    try {
      const response = await Edit_Risk_API(editPayload);

      if (response.status >= 200 && response.status < 300) {
        toast.success(
          response.data?.message || "Risk treatment updated successfully!"
        );
        onClose();
        window.location.reload();
      } else {
        const errorMessage =
          response.data?.message || "Failed to update risk treatment.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating risk treatment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while updating the risk treatment.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (editRisk) {
      handleEditRisk(); 
    } else {
      handleCreateRisk(); 
    }
  };

  const getRiskColor = (value) => {
    return value <= 2 ? "#4caf50" : value === 3 ? "#ff9800" : "#f44336";
  };

  const getEffectivenessColor = (value) => {
    return value <= 2
      ? "#f44336"
      : value === 3
      ? "#ff9800"
      : value === 4
      ? "#4caf50"
      : "#2e7d32";
  };

  const handleTreatmentActionsKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && treatmentActionsInput.trim()) {
      e.preventDefault();
      setTreatmentActionsList([
        ...treatmentActionsList,
        treatmentActionsInput.trim(),
      ]);
      setTreatmentActionsInput("");
    }
  };

  const handleRemoveAction = (index) => {
    const newActions = [...treatmentActionsList];
    newActions.splice(index, 1);
    setTreatmentActionsList(newActions);
  };

  const handleResourcesRequiredKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && resourcesRequiredInput.trim()) {
      e.preventDefault();
      setResourcesRequiredList([
        ...resourcesRequiredList,
        resourcesRequiredInput.trim(),
      ]);
      setResourcesRequiredInput("");
    }
  };

  const handleRemoveResource = (index) => {
    const newResources = [...resourcesRequiredList];
    newResources.splice(index, 1);
    setResourcesRequiredList(newResources);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds the 10MB limit.");
        return;
      }
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "application/xml",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Invalid file type. Only PDF, DOCX, PNG, and XML are allowed."
        );
        return;
      }

      const formData = new FormData();
      formData.append("file", file); 
      riskUploadDocument(formData, (progress) => {
        setProgress(progress);
      })
        .then((response) => {
          toast.success(t("File uploaded successfully"));
          console.log(response?.data?.data?.file, "resssssss"); 
          setRelatedDocuments(response?.data?.data?.file); 
        })
        .catch((error) => {
          toast.error("Failed to upload the file.");
          console.error("Error uploading file:", error);
        });
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
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: "#f9fafb",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              p: 3,
              pb: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              position: "relative",
              backgroundColor: "white",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {t("risk_treatment")}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content Section */}
          <Card
            sx={{
              padding: 0,
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
              border: "1px solid #e0e0e0",
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Scrollable content inside the Box */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 0,
                  fontSize: "0.75rem",
                  "& .MuiTextField-root": {
                    mb: 2,
                  },
                }}
              >
                {/* Risk Treatment Form */}
                <Box
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: "white",
                    borderRadius: 2,
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* 1) Control Measures */}

                  <FormControl fullWidth>
                    <FormLabel className="risk_field_lable">
                      Control Measure Type
                    </FormLabel>
                    <TextField
                      select
                      value={controlMeasureType}
                      onChange={(e) => setControlMeasureType(e.target.value)}
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                        },
                      }}
                    >
                      <MenuItem
                        value="Predefined controls library"
                        sx={{ fontSize: "0.9rem" }}
                      >
                        Predefined Controls Library
                      </MenuItem>
                      <MenuItem
                        value="Custom Controls"
                        className="risk_field_lable"
                      >
                        Custom Controls
                      </MenuItem>
                    </TextField>
                  </FormControl>

                  {controlMeasureType === "Custom Controls" && (
                    <FormControl fullWidth>
                      <FormLabel className="risk_field_lable">
                        Control Description
                      </FormLabel>
                      <TextField
                        value={customControlDescription}
                        onChange={(e) => {
                          setCustomControlDescription(e.target.value);
                          setErrors((prev) => ({
                            ...prev,
                            customControlDescription: false,
                          }));
                        }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        placeholder="Describe custom controls..."
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                          },
                        }}
                        error={errors.customControlDescription} // Show error if set
                      />
                      {/* Error message */}
                      {errors.customControlDescription && (
                        <FormHelperText error sx={{ mt: -2, mb: 2 }}>
                          Control description is required
                        </FormHelperText>
                      )}

                      {/* Upload Button */}
                      <Box sx={{ mt: 1 }}>
                        <Button
                          variant="outlined"
                          component="label"
                          fullWidth
                          sx={{
                            borderRadius: "8px",
                            borderColor: "#DFE3E8",
                            color: "#4361ee",
                            padding: "9px",
                            fontSize: "13px", 
                            "&:hover": {
                              borderColor: "#4361ee",
                              backgroundColor: "rgba(67, 97, 238, 0.04)",
                            },
                          }}
                        >
                          Upload Related Documents
                          <input
                            type="file"
                            hidden
                            onChange={handleFileUpload}
                          />
                        </Button>
                        {progress > 0 && progress < 100 && (
                          <Box sx={{ width: "100%", mt: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                            />
                          </Box>
                        )}
                        {relatedDocuments && (
                          <Typography
                            variant="body2"
                            sx={{ mt: 1, color: "#5F6D7E" }}
                          >
                            {relatedDocuments.name}
                          </Typography>
                        )}
                      </Box>
                    </FormControl>
                  )}

                  <Divider sx={{ my: 2 }} />
                  <Typography
                    color="text.secondary"
                    gutterBottom
                    className="risk_field_lable"
                  >
                    Action Items*
                  </Typography>
                  {actionItems.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mb: 2,
                        p: 2,
                        border: "1px solid #eee",
                        borderRadius: 2,
                      }}
                    >
                      {/* Description Field */}
                      <TextField
                        size="small"
                        label="Description *"
                        value={item.TreatmentDescription}
                        onChange={(e) =>
                          handleActionItemChange(
                            index,
                            "TreatmentDescription",
                            e.target.value
                          )
                        }
                      />
                      {errors.actionItems &&
                        !item.TreatmentDescription.trim() && (
                          <Box error sx={{ mt: -2, mb: 1, color: "red" }}>
                            Description is required for all action items
                          </Box>
                        )}

                      {/* Owner Field */}
                      <TextField
                        select
                        size="small"
                        label="Owner"
                        value={item.TreatmentOwner}
                        onChange={(e) => {
                          const selectedOwnerID = e.target.value;
                          handleActionItemChange(
                            index,
                            "TreatmentOwner",
                            selectedOwnerID
                          );
                        }}
                      >
                        {riskOwnersList.map((owner) => (
                          <MenuItem key={owner.UserID} value={owner.UserID}>
                            {owner.UserName}
                          </MenuItem>
                        ))}
                      </TextField>
                      {errors.actionItems && !item.TreatmentOwner && (
                        <Box error sx={{ mt: -2, mb: 1, color: "red" }}>
                          Owner is required for each action item
                        </Box>
                      )}
                      <TextField
                        select
                        size="small"
                        label="Status"
                        value={item.TreatmentActionStatus}
                        onChange={(e) =>
                          handleActionItemChange(
                            index,
                            "TreatmentActionStatus",
                            e.target.value
                          )
                        }
                        error={
                          errors.actionItems && !item.TreatmentActionStatus
                        }
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                          },
                        }}
                      >
                        {["NotStarted", "InProgress", "Completed"].map(
                          (statusOpt) => (
                            <MenuItem
                              key={statusOpt}
                              value={statusOpt}
                              sx={{ fontSize: "0.9rem" }}
                            >
                              {statusOpt}
                            </MenuItem>
                          )
                        )}
                      </TextField>
                      {errors.actionItems && !item.TreatmentActionStatus && (
                        <FormHelperText error sx={{ mt: -2, mb: 1 }}>
                          Status is required for each action item
                        </FormHelperText>
                      )}
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Due Date"
                          value={item.TreatmentDueDate}
                          onChange={(newValue) =>
                            handleActionItemChange(
                              index,
                              "TreatmentDueDate",
                              newValue
                            )
                          }
                          minDate={new Date()} 
                          renderInput={(params) => (
                            <TextField {...params} fullWidth size="small" />
                          )}
                        />
                      </LocalizationProvider>
                      {errors.actionItems && !item.TreatmentDueDate && (
                        <Box error sx={{ mt: -2, mb: 1, color: "red" }}>
                          Due Date is required for each action item
                        </Box>
                      )}
                      {actionItems.length > 1 && (
                        <Box sx={{ textAlign: "right" }}>
                          <IconButton
                            onClick={() => handleRemoveActionItem(index)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  ))}

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleAddActionItem}
                    sx={{ fontSize: "0.7rem", mb: 2 }}
                  >
                    + Add Action Item
                  </Button>

                  <Divider sx={{ my: 3 }} />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel className="risk_field_lable">
                      Total Budget Required *
                    </FormLabel>
                    <TextField
                      type="number"
                      value={budgetRequired}
                      onChange={(e) => {
                        const input = e.target.value;
                        if (input === "" || /^[0-9]*\.?[0-9]*$/.test(input)) {
                          setBudgetRequired(input);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      size="small"
                      fullWidth
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9.]*", 
                        step: "0.01", 
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          fontSize: "0.75rem",
                        },
                      }}
                    />
                    {errors.budgetRequired && (
                      <Box error sx={{ mt: -2, mb: 1, color: "red" }}>
                        Budget Required is required
                      </Box>
                    )}
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel className="risk_field_lable">
                      {t("treatment_strategy_label")} *
                    </FormLabel>
                    <TextField
                      select
                      value={treatmentStrategy}
                      onChange={(e) => {
                        setTreatmentStrategy(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          treatmentStrategy: false,
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
                      {strategyOptions.map((option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          sx={{ fontSize: "0.9rem" }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    {errors.treatmentStrategy && (
                      <Box error sx={{ mt: -2, mb: 2, color: "red" }}>
                        Treatment strategy is required
                      </Box>
                    )}
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel className="risk_field_lable">
                      {t("treatment_actions_label")}*
                    </FormLabel>
                    <TextField
                      value={treatmentActionsInput}
                      onChange={(e) => setTreatmentActionsInput(e.target.value)}
                      onKeyDown={handleTreatmentActionsKeyDown}
                      variant="outlined"
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      placeholder={
                        treatmentActionsList.length === 0
                          ? t("treatment_actions_placeholder") +
                            " (Press Enter or comma to add)"
                          : ""
                      }
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                        },
                        "& .MuiInputBase-multiline": {
                          display: "flex",
                          flexWrap: "wrap", // Makes the actions wrap to the next line if space is filled
                          gap: "8px", // Adds spacing between the action items
                          minHeight: "60px", // Sets a minimum height for the field to ensure enough space
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap", // Ensures that the actions will wrap to the next line within the input area
                              gap: "8px",
                              mb: 1,
                            }}
                          >
                            {treatmentActionsList.map((action, index) => (
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
                                  {action}
                                </Typography>
                                <IconButton
                                  onClick={() => handleRemoveAction(index)}
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
                    {errors.treatmentActions && (
                      <Box error sx={{ mt: -2, mb: 1, color: "red" }}>
                        Treatment Actions are required
                      </Box>
                    )}
                  </FormControl>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label={t("target_date_label")}
                          value={targetDate}
                          onChange={(newValue) => setTargetDate(newValue)}
                          minDate={new Date()}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              size="small"
                              sx={{
                                "& .MuiInputBase-root": {
                                  borderRadius: "8px",
                                  fontSize: "0.75rem",
                                },
                              }}
                            />
                          )}
                        />
                        {errors.targetDate && (
                          <Box error sx={{ mt: -2, mb: 1, color: "red" }}>
                            Target Date is required
                          </Box>
                        )}
                      </LocalizationProvider>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel className="risk_field_lable">
                          {t("treatment_status_label")}
                        </FormLabel>
                        <TextField
                          select
                          value={treatmentStatus}
                          onChange={(e) => setTreatmentStatus(e.target.value)}
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
                          {["NotStarted", "InProgress", "Completed"].map(
                            (status) => (
                              <MenuItem
                                key={status}
                                value={status}
                                sx={{ fontSize: "0.9rem" }}
                              >
                                {status}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="text.secondary"
                      gutterBottom
                      className="risk_field_lable"
                    >
                      {t("residual_risk_label")}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Slider
                        value={residualRisk}
                        onChange={(e, newValue) => setResidualRisk(newValue)}
                        min={1}
                        max={5}
                        step={1}
                        sx={{
                          color: getRiskColor(residualRisk),
                          flex: 1,
                        }}
                      />
                      <Chip
                        label={
                          residualRisk <= 2
                            ? "Low"
                            : residualRisk === 3
                            ? "Medium"
                            : "High"
                        }
                        sx={{
                          backgroundColor: getRiskColor(residualRisk),
                          color: "white",
                          fontWeight: 600,
                          width: 80,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mt: 3, mb: 4 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="text.secondary"
                      gutterBottom
                      className="risk_field_lable"
                    >
                      {t("treatment_effectiveness_label")}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Slider
                        value={treatmentEffectiveness}
                        onChange={(e, newValue) =>
                          setTreatmentEffectiveness(newValue)
                        }
                        min={1}
                        max={5}
                        step={1}
                        sx={{
                          color: getEffectivenessColor(treatmentEffectiveness),
                          flex: 1,
                        }}
                      />
                      <Chip
                        label={
                          treatmentEffectiveness <= 2
                            ? "Low"
                            : treatmentEffectiveness === 3
                            ? "Moderate"
                            : treatmentEffectiveness === 4
                            ? "High"
                            : "Very High"
                        }
                        sx={{
                          backgroundColor: getEffectivenessColor(
                            treatmentEffectiveness
                          ),
                          color: "white",
                          fontWeight: 600,
                          width: 100,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                  </Box>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel className="risk_field_lable">
                      {t("resources_required_label")}*
                    </FormLabel>
                    <TextField
                      value={resourcesRequiredInput}
                      onChange={(e) =>
                        setResourcesRequiredInput(e.target.value)
                      }
                      onKeyDown={handleResourcesRequiredKeyDown}
                      variant="outlined"
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      placeholder={
                        resourcesRequiredList.length === 0
                          ? "Describe required resources... (Press Enter or comma to add)"
                          : ""
                      }
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                        },
                        "& .MuiInputBase-multiline": {
                          display: "flex",
                          flexWrap: "wrap", // Ensures the resources move to the next line if space is filled
                          gap: "8px", // Adds space between the resource tags
                          minHeight: "60px", // Ensures there is enough space to accommodate multiple lines of input
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap", // Ensures resources go to the next line within the input area
                              gap: "8px",
                              mb: 1,
                            }}
                          >
                            {resourcesRequiredList.map((resource, index) => (
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
                                  {resource}
                                </Typography>
                                <IconButton
                                  onClick={() => handleRemoveResource(index)}
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
                    {errors.resourcesRequired && (
                      <Box error sx={{ mt: -2, mb: 1, color: "red" }}>
                        Resources Required is required
                      </Box>
                    )}
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel className="risk_field_lable">
                      {t("approval_status_label")}*
                    </FormLabel>
                    <TextField
                      select
                      value={approvalStatus}
                      onChange={(e) => setApprovalStatus(e.target.value)}
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
                      {statusOptions.map((option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          sx={{ fontSize: "0.9rem" }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                    {errors.approvalStatus && (
                      <Box error sx={{ mt: -2, mb: 1, color: "red" }}>
                        Approval Status is required
                      </Box>
                    )}
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Card>

          {/* Footer with Save Button */}

          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "flex-end",
              backgroundColor: "white",
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
                  backgroundColor: "#303f9f",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("save_treatment_plan_button")
              )}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default RiskTreatmentDrawer;

RiskTreatmentDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  riskData: PropTypes.object.isRequired,
  riskOwnersList: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
   riskID: PropTypes.string.isRequired,
  editRisk: PropTypes.bool.isRequired,  
  isCreate: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func.isRequired,
  risk: PropTypes.object.isRequired,

};
