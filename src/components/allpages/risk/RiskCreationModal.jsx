import { useEffect, useState, useRef } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Box,
  Autocomplete,
  Modal,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Dialog,
  Slider,
  LinearProgress,
  GlobalStyles,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  ReactFlow,
  Controls as ReactFlowControls,
  ControlButton,
  MarkerType,
  ConnectionMode,
  Background,
} from "@xyflow/react";
import "reactflow/dist/style.css";
import { listDepartment } from "../../../services/elementAssignment/ElementAssignment";
import {
  CreateRiskAPI,
  Edit_Risk_API,
  SOP_List_API,
} from "../../../services/sopRisk/SOPRisk";
import ResizableNode from "../questions/ResizableNode";
import DiamondNode from "../questions/DiamondNode";
import DragNode from "../questions/DragNode";
import { toast } from "react-toastify";
import { DnDProvider } from "../questions/DnDContext";
import risk from "../../../../src/assets/svg/SOPs/risk.svg";
import { useTranslation } from "react-i18next";
import { listProcessOwner } from "../../../services/sopModules/SopModule";
import { Circle } from "@mui/icons-material";
import BPMNRisk from "../../bpmn/BPMNRisk";
import { riskUploadDocument } from "../../../services/common/common.service";
import PropTypes from "prop-types";

const nodeTypes = {
  comment: ResizableNode,
  diamond: DiamondNode,
  Start: DragNode,
  End: DragNode,
  Node: DragNode,
  "create-task": DragNode,
  Email: DragNode,
  "Email Custom API Call": DragNode,
  "Human Input": DragNode,
  "Create Form": DragNode,
  "If Else Clause": DragNode,
  "Image Helper": DragNode,
  "CSV (Convert CSV to JSON)": DragNode,
  "Call Rest API": DragNode,
  "CSV (Convert JSON to CSV)": DragNode,
  Concatenation: DragNode,
  Split: DragNode,
  "Remove HTML": DragNode,
  Replace: DragNode,
  Find: DragNode,
  Output: DragNode,
};

const defaultEdgeOptions = {
  markerEnd: {
    type: MarkerType.ArrowClosed,
    // color: "#FF6B6B",
  },
  style: {
    // stroke: "#4ECDC4",
    strokeWidth: 2,
  },
};

const RiskCreationModal = ({
  open,
  onClose,
  onSuccess,
  editRisk,
  isCreate,
}) => {
  const { t } = useTranslation();
  const [sopObjects, setSopObjects] = useState({});
  const [selectedStepLabels, setSelectedStepLabels] = useState([]);
  const [selectedSOP, setSelectedSOP] = useState("");
  const [riskName, setRiskName] = useState("");
  const [riskDescription, setRiskDescription] = useState("");
  const [status, setStatus] = useState("New");
  const [category, setCategory] = useState("");
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [sopList, setSopList] = useState([]);
  const [selectedNodeId, setSelectedNodeID] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diagramLoading, setDiagramLoading] = useState(true);
  const flowWrapperRef = useRef(null);
  const [riskSource, setRiskSource] = useState([]);
  const [detectionDifficulty, setDetectionDifficulty] = useState(3);
  const [initialSeverity, setInitialSeverity] = useState(""); // Color Picker for Severity
  const [relatedDocuments, setRelatedDocuments] = useState(null);
  const [riskOwner, setRiskOwner] = useState("");
  const [riskOwnersList, setRiskOwnersList] = useState([]);
  const [riskOwnerID, setRiskOwnerID] = useState("");
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingRiskOwners, setLoadingRiskOwners] = useState(false);
  const [labeledElements, setLabeledElements] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); // State to store all selected IDs as an array of strings
  const [sopId, SetSOPID] = useState("");
  const [sopDraftId, SetSOPDraftID] = useState(""); // State to store SOP InProgress ID
  const [sopFlowId, SetSOPFlowId] = useState(""); // State to store SOP Flow ID
  const [progress, setProgress] = useState(0); // State for upload progress

  console.log("Selected IDs:", selectedIds); // Log the selected IDs
  const htmlTagPattern = /<.*?>/g;

  console.log("editRiskeditRisk:", editRisk, selectedNodeId);

  console.log(isCreate, "isCreateCreateModal");

  useEffect(() => {
    if (editRisk) {
      setRiskName(editRisk?.RiskName);
      setStatus(editRisk?.Status || "New");
      setRiskDescription(editRisk?.RiskDescription);
      setCategory(editRisk?.RiskCategory);
      setDepartment(editRisk?.DepartmentID);
      setRiskSource(editRisk?.RiskSource);
      setInitialSeverity(editRisk?.InitialSeverity);
      setRelatedDocuments(editRisk?.RiskDocumentPath);
      setRiskOwner(editRisk?.RiskOwner);
      setDetectionDifficulty(editRisk?.DetectionDifficulty);
    }
  }, [editRisk]);

  const openFullScreenModal = async () => {
    if (document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.error("Error entering fullscreen mode:", err);
      }
    }
    setIsModalOpen(true);
  };

  const closeFullScreenModal = async () => {
    setIsModalOpen(false);
    if (document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("Error exiting fullscreen mode:", err);
      }
    }
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
      formData.append("file", file); // Append the file with the key 'FileUrl'
      riskUploadDocument(formData, (progress) => {
        setProgress(progress);
      })
        .then((response) => {
          toast.success(t("File uploaded successfully"));
          console.log(response?.data?.data?.file, "resssssss"); // Handle the response from the API
          setRelatedDocuments(response?.data?.data?.file); // Update the state with the file URL or any other data you need
        })
        .catch((error) => {
          toast.error("Failed to upload the file.");
          console.error("Error uploading file:", error);
        });
    }
  };

  useEffect(() => {
    if (open) {
      setLoadingDepartments(true);
      listDepartment({})
        .then((response) => {
          setDepartments(response?.data?.data?.departmentList || []);
        })
        .catch((error) => {
          console.error("Error fetching departments:", error);
        })
        .finally(() => {
          setLoadingDepartments(false);
        });
    }
  }, [open]); // Ensure this effect runs only when `open` changes

  useEffect(() => {
    if (selectedSOP && sopObjects) {
      const selectedSopObj = Object.values(sopObjects).find(
        (sop) => sop.SOPName === selectedSOP
      );
      console.log("Selected SOP Object:", selectedSopObj);

      if (selectedSopObj) {
        console.log("SOPIDgggg:", selectedSopObj.SOPID);
        SetSOPID(selectedSopObj.SOPID);
        SetSOPDraftID(selectedSopObj.SOPDraftID);
        console.log("SOPDraftIDggg:", selectedSopObj.SOPDraftID);
        console.log("Selected SOP:", {
          SOPName: selectedSopObj.SOPName,
          IsReactFlow: selectedSopObj.IsReactFlow,
        });
      }
    }
  }, [selectedSOP, sopObjects]);

  useEffect(() => {
    if (selectedSOP && sopObjects) {
      const selectedSopObj = Object.values(sopObjects).find(
        (sop) => sop.SOPName === selectedSOP
      );
      console.log("Selected SOP Object:", selectedSopObj);

      if (selectedSopObj && selectedSopObj.SopFlow) {
        const sopFlowID = selectedSopObj.SopFlow.SopFlowID; // Extract SopFlowID
        console.log("SopFlowIDddddddd:", sopFlowID); // Log SopFlowID
        SetSOPFlowId(sopFlowID); // Set SopFlowID in state
        // You can also store it in state if needed
        // SetSopFlowID(sopFlowID);
      }
    }
  }, [selectedSOP, sopObjects]);

  useEffect(() => {
    fetchSOPList();
  }, []);
  const fetchSOPList = async () => {
    try {
      const response = await SOP_List_API();
      if (response?.data?.data?.sopModuleDraft) {
        setSopObjects(response.data.data.sopModuleDraft);
        console.log(
          "SOP Objects in create modal:",
          response.data.data.sopModuleDraft
        );
        const sopNames = Object.values(response.data.data.sopModuleDraft)
          .map((item) => item.SOPName)
          .filter((name) => name);
        setSopList(sopNames);
      }
    } catch (error) {
      console.error("Error fetching SOP List:", error);
    }
  };

  useEffect(() => {
    fetchSOPList();
  }, []);

  useEffect(() => {
    const fetchProcessOwners = async () => {
      setLoadingRiskOwners(true);
      try {
        const response = await listProcessOwner({});
        setRiskOwnersList(response?.data?.data?.userList || []);
      } catch (error) {
        console.error("Error fetching process owners:", error);
        toast.error("Failed to load risk owners");
      } finally {
        setLoadingRiskOwners(false);
      }
    };

    if (open) {
      fetchProcessOwners();
    }
  }, [open]);

  const handleRiskOwnerChange = (e) => {
    const selectedUser = e.target.value;
    setRiskOwner(selectedUser);
    const selectedUserObj = riskOwnersList.find(
      (user) => user.UserName === selectedUser
    );
    if (selectedUserObj) {
      setRiskOwnerID(selectedUserObj.UserID);
      console.log("Selected User ID Create Modal:", selectedUserObj.UserID);
    }
  };

  const handleCreateRisk = () => {
    const payload = {
      RiskName: riskName,
      RiskDescription: riskDescription,
      RiskCategory: category,
      DepartmentID: department,
      SopFlowID: nodeOptions.length > 0 ? sopFlowId : null,
      SOPID: sopId,
      Status: status,
      RiskOwner: riskOwnerID,
      InitialSeverity: initialSeverity,
      RiskSource: riskSource,
      SopDraftID: sopDraftId,
      DetectionDifficulty: detectionDifficulty,
      NodeIDs:
        nodeOptions.length > 0 ? selectedStepLabels.map((step) => step.id) : [],
      BPMNNodeIDs: labeledElements.length > 0 ? selectedIds : [],
      FileUrl: relatedDocuments,
    };

    console.log("Payload for Create Risk:", payload);

    setLoading(true);

    CreateRiskAPI(payload)
      .then((response) => {
        if (response.status === 200) {
          // toast.success("Risk created successfully!");
          resetForm();
          onClose();
          // window.location.reload();
          if (onSuccess) {
            onSuccess(response.data); // Pass the success response data to the parent
            toast.success("Risk created successfully!");
          }
        } else {
          toast.error(response.data.message || "Failed to create risk");
        }
      })
      .catch((error) => {
        console.error("Error creating risk:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to create risk";
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEditRisk = () => {
    const payload = {
      RiskID: editRisk?.RiskID,
      RiskName: riskName,
      RiskDescription: riskDescription,
      RiskCategory: category,
      DepartmentID: department,
      Status: status,
      InitialSeverity: initialSeverity,
      RiskSource: riskSource,
      DetectionDifficulty: detectionDifficulty,
    };

    console.log("Edit Payload:", payload);

    setLoading(true);

    Edit_Risk_API(payload)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Risk updated successfully!");
          resetForm();
          onClose();
          window.location.reload();
          if (onSuccess) onSuccess(response.data);
        } else {
          toast.error("Failed to update risk, unexpected server response");
        }
      })
      .catch((error) => {
        console.error("Error updating risk:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to update risk";
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const selectedSopData = Object.values(sopObjects).find(
    (sop) => sop.SOPName === selectedSOP
  );

  const isReactFlow = selectedSopData?.IsReactFlow === true;

  const rawNodes = selectedSopData?.SopFlow?.Nodes || [];
  const rawEdges = selectedSopData?.SopFlow?.Edges || [];

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    setDiagramLoading(true);

    if (rawNodes.length > 0 && rawEdges.length > 0) {
      const updatedNodes = rawNodes.map((node) => {
        const isSelected = selectedStepLabels.some(
          (sel) => sel.title === node.data.title
        );

        return {
          ...node,
          data: {
            ...node.data,
            label: node.data.title,
            title: node.data.title,
          },
          style: {
            ...node.style,
            border: isSelected ? "3px solid #4361ee" : "1px solid #ccc",
            // backgroundColor: isSelected
            //   ? "#E2F3FF"
            //   : nodeColors[node.type] || nodeColors.default,
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            color: "#2B2D42",
            fontSize: "12px",
            fontWeight: "bold",
          },
        };
      });

      setNodes(updatedNodes);
      setEdges(rawEdges);
      setDiagramLoading(false);
    } else {
      setDiagramLoading(false);
    }
  }, [rawNodes, rawEdges, selectedStepLabels, setNodes, setEdges]);

  const nodeOptions = rawNodes
    .filter((node) => node.data.shapeType === "create-task")
    .map((node) => ({
      id: node.id,
      title: node.data.title,
    }));

  const validateForm = () => {
    return (
      riskName.trim() !== "" &&
      riskDescription.trim() !== "" &&
      department !== "" &&
      category !== "" &&
      selectedSOP !== "" &&
      selectedStepLabels.length > 0 &&
      riskSource.length > 0 &&
      initialSeverity !== "" &&
      // relatedDocuments !== null &&
      riskOwner !== "" &&
      detectionDifficulty > 0 // if you want detectionDifficulty mandatory
    );
  };

  useEffect(() => {
    if (isCreate) {
      resetForm();
    }
  }, [isCreate]);

  const resetForm = () => {
    setRiskName("");
    setRiskDescription("");
    setStatus("New");
    setCategory("Category 1");
    setDepartment("");
    setSelectedStepLabels([]);
    setSelectedSOP("");
    setRiskSource([]);
    setDetectionDifficulty(3);
    setInitialSeverity("");
    setRelatedDocuments(null);
    setRiskOwner("");
    setRiskOwnerID("");
    setSelectedNodeID([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLabeledElements = (elements) => {
    console.log("Received labeled elements:", elements);
    setLabeledElements(elements);
  };

  const logSelectedLabeledElements = (newValue) => {
    if (newValue.length === 0) {
      setSelectedIds([]); // Clear selected IDs when all elements are deselected
      return;
    }

    const ids = newValue.map((item) => item.id); // Extract all IDs
    setSelectedIds(ids);

    // Optional: Log the selected elements
    newValue.forEach((item) => {
      console.log("Selected Name:", item.name || item.title);
      console.log("Selected ID:", item.id);
    });
  };

  return (
    <>
      <GlobalStyles
        styles={{
          ".riskCreationModal-root, .riskCreationModal-root *": {
            fontFamily: '"Inter", sans-serif !important',
          },
        }}
      />
      <Modal open={open} onClose={onClose}>
        <Box
          className="riskCreationModal-root"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: "70%", lg: "60%" },
            height: "auto",
            maxHeight: "80vh",
            bgcolor: "#F8F9FA",
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            p: 3,
            overflowY: "auto",
            overflowX: "hidden",
            border: "2px solid #4361ee",
            "&:focus-visible": { outline: "none" },
            // Hide scrollbar for Webkit (Chrome, Safari)
            "&::-webkit-scrollbar": {
              display: "none",
            },
            // Hide scrollbar for Firefox
            scrollbarWidth: "none",
            // Hide scrollbar for IE/Edge
            msOverflowStyle: "none",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              pb: 2,
              background: "linear-gradient(to top, #2C64FF, #4A90E2)",
              padding: "12px 16px",
              borderRadius: "8px 8px 0 0",
              margin: "-16px -16px 16px -16px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "white",
                fontSize: "1.25rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <img
                src={risk}
                alt=""
                style={{ height: "20px", width: "20px" }}
              />
              <span>Create New Risk</span>
            </Typography>

            <IconButton
              onClick={handleClose}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form Content */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label={t("risk_name_label")}
                value={riskName}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Regular expression to detect HTML or script tags
                  const htmlTagPattern = /<.*?>/g;

                  // If invalid input, show error and don't update state
                  if (htmlTagPattern.test(inputValue)) {
                    setRiskName(""); // Clear invalid input
                    toast.error("HTML or script tags are not allowed."); // Show error message
                  } else {
                    setRiskName(inputValue); // Update state with valid input
                  }
                }}
                variant="outlined"
                placeholder="Enter risk name or title"
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    // backgroundColor: "#FFFFFF",
                    borderColor: "#DFE3E8",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#5F6D7E",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#DFE3E8",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4361ee",
                    },
                  },
                }}
                error={htmlTagPattern.test(riskName)} // Display error if invalid
                helperText={
                  htmlTagPattern.test(riskName) &&
                  "Invalid input: HTML/Script tags are not allowed."
                } // Helper text for the error message
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: "#5F6D7E" }}>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label={t("Status")}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      backgroundColor: "#FFFFFF",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#DFE3E8",
                      },
                      "&:hover fieldset": {
                        borderColor: "#4361ee",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4361ee",
                      },
                    },
                  }}
                >
                  <MenuItem value="New">{t("menu_item_new")}</MenuItem>
                  <MenuItem value="Open">{t("menu_item_open")}</MenuItem>
                  <MenuItem value="InReview">
                    {t("menu_item_in_review")}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label={t("risk_description_label")}
                value={riskDescription}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Regular expression to detect HTML or script tags
                  const htmlTagPattern = /<.*?>/g;

                  // If invalid input, show error and don't update state
                  if (htmlTagPattern.test(inputValue)) {
                    setRiskDescription(""); // Clear invalid input
                    toast.error(
                      "HTML or script tags are not allowed in the description."
                    ); // Show error message
                  } else {
                    setRiskDescription(inputValue); // Update state with valid input
                  }
                }}
                variant="outlined"
                placeholder="Provide a brief risk description"
                multiline
                rows={3.5}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    // backgroundColor: "#FFFFFF",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#DFE3E8",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4361ee",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4361ee",
                    },
                  },
                }}
                error={htmlTagPattern.test(riskDescription)} // Display error if invalid
                helperText={
                  htmlTagPattern.test(riskDescription) &&
                  "Invalid input: HTML/Script tags are not allowed."
                } // Helper text for the error message
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: "#5F6D7E" }}>
                  {t("risk_category_label")}
                </InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label={t("risk_category_label")}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      backgroundColor: "#FFFFFF",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#DFE3E8",
                      },
                      "&:hover fieldset": {
                        borderColor: "#4361ee",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4361ee",
                      },
                    },
                  }}
                >
                  <MenuItem value="Financial">
                    {t("menu_item_financial")}
                  </MenuItem>
                  <MenuItem value="Operational">
                    {t("menu_item_operational")}
                  </MenuItem>
                  <MenuItem value="Compliance">
                    {t("menu_item_compliance")}
                  </MenuItem>
                  <MenuItem value="Strategic">
                    {t("menu_item_strategic")}
                  </MenuItem>
                  <MenuItem value="Reputational">
                    {t("menu_item_reputational")}
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                <InputLabel sx={{ color: "#5F6D7E" }}>
                  {t("department_label")}
                </InputLabel>
                <Select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  label={t("department_label")}
                  disabled={loadingDepartments}
                  IconComponent={
                    loadingDepartments
                      ? () => <CircularProgress size={16} sx={{ ml: 1 }} />
                      : undefined
                  }
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px",
                      backgroundColor: "#FFFFFF",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#DFE3E8",
                      },
                      "&:hover fieldset": {
                        borderColor: "#4361ee",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4361ee",
                      },
                    },
                  }}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {departments.length === 0 && !loadingDepartments ? (
                    <MenuItem disabled>No Departments Found</MenuItem>
                  ) : (
                    departments.map((dept) => (
                      <MenuItem
                        key={dept.DepartmentID}
                        value={dept.DepartmentID}
                        sx={{ color: "#2B2D42" }}
                      >
                        {dept.DepartmentName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid
              container
              spacing={2}
              sx={{ mt: 0, marginInlineStart: "2px" }}
            >
              {/* Risk Source - Autocomplete */}
              <Grid item xs={12} md={6} sx={{ marginTop: "10px" }}>
                <Autocomplete
                  multiple
                  size="small"
                  options={[
                    "People",
                    "Process",
                    "Technology",
                    "External",
                    "Internal",
                  ]}
                  value={riskSource}
                  onChange={(e, newValue) => setRiskSource(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Risk Source"
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          // backgroundColor: "#FFFFFF",
                          borderColor: "#DFE3E8",
                        },
                        "& .MuiInputLabel-root": {
                          color: "#5F6D7E",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#DFE3E8",
                          },
                          "&:hover fieldset": {
                            borderColor: "#4361ee",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6} style={{ marginTop: "10px" }}>
                {/* Autocomplete for Initial Severity */}
                <Autocomplete
                  value={initialSeverity}
                  onChange={(e, newValue) => setInitialSeverity(newValue)}
                  options={["Red", "Amber", "Green"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Initial Severity"
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          borderColor: "#DFE3E8",
                        },
                        "& .MuiInputLabel-root": {
                          color: "#5F6D7E",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#DFE3E8",
                          },
                          "&:hover fieldset": {
                            borderColor: "#4361ee",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4361ee",
                          },
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => {
                    const colorMap = {
                      Red: "#FF0000",
                      Amber: "#FFBF00",
                      Green: "#28A745",
                    };

                    return (
                      <li
                        {...props}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Circle
                          size={16}
                          style={{
                            marginRight: 8,
                            fill: colorMap[option],
                          }}
                        />
                        {option}
                      </li>
                    );
                  }}
                />
              </Grid>
              {/* Related Documents - File Upload */}
            </Grid>
            {!editRisk && (
              <>
                <Grid item xs={12} md={6} sx={{ marginTop: "0px" }}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      borderRadius: "8px",
                      borderColor: "#DFE3E8",
                      color: "#4361ee",
                      padding: "9px", // Increases the height of the button
                      fontSize: "16px", // Optional: adjusts the font size for better readability
                      "&:hover": {
                        borderColor: "#4361ee",
                        backgroundColor: "rgba(67, 97, 238, 0.04)",
                      },
                    }}
                  >
                    Upload Related Documents
                    <input type="file" hidden onChange={handleFileUpload} />
                  </Button>

                  {progress > 0 && progress < 100 && (
                    <Box sx={{ width: "100%", mt: 2 }}>
                      <LinearProgress variant="determinate" value={progress} />
                    </Box>
                  )}

                  {relatedDocuments && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: "#28a745",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Uploaded done
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={6} sx={{ marginTop: "3px" }}>
                  <FormControl fullWidth size="small">
                    <InputLabel
                      sx={{
                        color: "#636e72",
                        fontSize: "1rem",
                        textAlign: "center",
                      }}
                    >
                      {t("select_risk_owner_label")}
                    </InputLabel>

                    <Select
                      value={riskOwner}
                      onChange={handleRiskOwnerChange}
                      label={t("select_risk_owner_label")}
                      disabled={loadingRiskOwners}
                      IconComponent={
                        loadingRiskOwners
                          ? () => (
                            <CircularProgress
                              size={16}
                              sx={{ ml: 0, marginLeft: "-10px" }}
                            />
                          )
                          : undefined
                      }
                      sx={{
                        borderRadius: "8px",
                        "& .MuiSelect-select": {
                          padding: "10px 14px",
                          fontSize: "0.95rem",
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
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                        PaperProps: {
                          style: {
                            maxHeight: 250, // You can adjust this as needed
                          },
                        },
                      }}
                    >
                      {riskOwnersList.length === 0 && !loadingRiskOwners ? (
                        <MenuItem disabled>No risk owners found</MenuItem>
                      ) : (
                        riskOwnersList.map((user) => (
                          <MenuItem
                            key={user.UserID}
                            value={user.UserName}
                            sx={{ fontSize: "0.9rem" }}
                          >
                            {user.UserName}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Detection Difficulty - Slider with label */}
            <Grid item xs={12} md={12}>
              <Typography
                variant="body2"
                sx={{ marginBottom: 1, color: "#5F6D7E" }}
              >
                Detection Difficulty
              </Typography>
              <Slider
                value={detectionDifficulty}
                onChange={(e, newValue) => setDetectionDifficulty(newValue)}
                min={1}
                max={5}
                step={1}
                marks={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4" },
                  { value: 5, label: "5" },
                ]}
                sx={{
                  color: "#4361ee",
                  "& .MuiSlider-markLabel": {
                    color: "#5F6D7E",
                  },
                }}
              />
            </Grid>
            {!editRisk && (
              <>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    disableClearable
                    size="small"
                    fullWidth
                    options={sopList}
                    loading={sopList.length === 0}
                    value={selectedSOP}
                    onChange={(e, newValue) => {
                      setSelectedSOP(newValue);
                      setSelectedStepLabels([]);
                      setSelectedIds([]);
                      setLabeledElements([]);
                      setSelectedNodeID([]);
                    }}
                    noOptionsText={
                      sopList.length === 0
                        ? "Loading SOP..."
                        : "No SOP available"
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("associated_sop_label")}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {sopList.length === 0 ? (
                                <CircularProgress color="inherit" size={16} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: "8px",
                            backgroundColor: "#FFFFFF",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#DFE3E8",
                            },
                            "&:hover fieldset": {
                              borderColor: "#4361ee",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#4361ee",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    size="small"
                    fullWidth
                    options={
                      nodeOptions.length > 0 ? nodeOptions : labeledElements
                    }
                    getOptionLabel={(option) => option.name || option.title}
                    value={selectedStepLabels}
                    onChange={(e, newValue) => {
                      // Filter out duplicate selections by checking IDs
                      const uniqueValues = newValue.reduce((acc, current) => {
                        const exists = acc.some(
                          (item) => item.id === current.id
                        );
                        if (!exists) {
                          acc.push(current);
                        }
                        return acc;
                      }, []);

                      setSelectedStepLabels(uniqueValues);
                      setSelectedNodeID(uniqueValues.map((item) => item.id));
                      logSelectedLabeledElements(uniqueValues);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("process_step_reference_label")}
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: "8px",
                            backgroundColor: "#FFFFFF",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#DFE3E8",
                            },
                            "&:hover fieldset": {
                              borderColor: "#4361ee",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#4361ee",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    ref={flowWrapperRef}
                    sx={{
                      height: 250,
                      border: "2px solid #DFE3E8",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      overflow: "hidden",
                      mt: 1,
                      backgroundColor: "#F5F7FA",
                    }}
                  >
                    {diagramLoading ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          background:
                            "linear-gradient(135deg, #F5F7FA 0%, #E4E8F0 100%)",
                        }}
                      >
                        <CircularProgress size={24} sx={{ color: "#4361ee" }} />
                      </Box>
                    ) : !selectedSopData ? (
                      <Typography
                        variant="body1"
                        sx={{
                          textAlign: "center",
                          p: 3,
                          color: "#6c757d",
                          fontStyle: "italic",
                          background:
                            "linear-gradient(135deg, #F5F7FA 0%, #E4E8F0 100%)",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        No Diagram Found
                      </Typography>
                    ) : isReactFlow ? (
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        fitView
                        nodeTypes={nodeTypes}
                        proOptions={{ hideAttribution: false }}
                        defaultEdgeOptions={defaultEdgeOptions}
                        connectionMode={ConnectionMode.Loose}
                      >
                        <Background
                          color="#E4E8F0"
                          gap={16}
                          variant="dots"
                          size={1}
                        />
                        <ReactFlowControls
                          showZoom={true}
                          showFitView={false}
                          showInteractive={false}
                          style={{
                            backgroundColor: "rgba(255,255,255,0.8)",
                            borderRadius: "8px",
                            border: "1px solid #DFE3E8",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          <ControlButton
                            onClick={openFullScreenModal}
                            title="Enter Fullscreen"
                            style={{
                              backgroundColor: "#4361ee",
                              color: "white",
                              borderRadius: "4px",
                              margin: "4px",
                              "&:hover": {
                                backgroundColor: "#3a0ca3",
                              },
                            }}
                          >
                            ⛶
                          </ControlButton>
                        </ReactFlowControls>
                      </ReactFlow>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          backgroundColor: "#fff",
                          overflow: "scroll",

                          width: "100%",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          <BPMNRisk
                            selectedSopData={selectedSopData}
                            onLabeledElements={handleLabeledElements}
                            selectedIds={selectedIds}
                          />
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </>
            )}

            {/* Buttons at the bottom */}
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
                pt: 2,
                borderTop: "1px solid #DFE3E8",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  mr: 2,
                  px: 3,
                  py: 1,
                  color: "#2196F3",
                  borderColor: "#2196F3",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "rgba(67, 97, 238, 0.08)",
                    borderColor: "#2196F3",
                  },
                }}
              >
                {t("Cancel")}
              </Button>
              <Button
                variant="contained"
                onClick={editRisk ? handleEditRisk : handleCreateRisk}
                disabled={!editRisk && !validateForm()}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                  backgroundColor: "#4361ee",
                  fontWeight: 600,
                  background: "#2196F3",
                  boxShadow: "0 4px 6px rgba(67, 97, 238, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #2196F3 0%, #4361ee 100%)",
                    boxShadow: "0 6px 8px rgba(67, 97, 238, 0.4)",
                  },
                  "&:disabled": {
                    background: "#E9ECEF",
                    color: "#ADB5BD",
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : editRisk ? (
                  "Update Risk"
                ) : (
                  t("create_risk_button")
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Fullscreen Diagram */}
      <Dialog
        fullScreen
        open={isModalOpen}
        x
        onClose={closeFullScreenModal}
        PaperProps={{
          style: {
            height: "100%",
            margin: 0,
            borderRadius: 0,
            backgroundColor: "#F5F7FA",
          },
        }}
      >
        <div style={{ height: "100%", position: "relative" }}>
          {diagramLoading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                background: "linear-gradient(135deg, #F5F7FA 0%, #E4E8F0 100%)",
              }}
            >
              <CircularProgress size={40} sx={{ color: "#4361ee" }} />
              <Typography
                variant="h6"
                sx={{
                  ml: 2,
                  color: "#4361ee",
                  fontWeight: 600,
                }}
              >
                Loading Diagram...
              </Typography>
            </div>
          ) : nodes.length === 0 || edges.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                background: "linear-gradient(135deg, #F5F7FA 0%, #E4E8F0 100%)",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  color: "#6c757d",
                  fontWeight: 600,
                }}
              >
                No Diagram Found
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#8e9aaf",
                  maxWidth: "400px",
                  textAlign: "center",
                }}
              >
                {t("select_sop_message")}
              </Typography>
            </Box>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              nodeTypes={nodeTypes}
              proOptions={{ hideAttribution: true }}
              defaultEdgeOptions={defaultEdgeOptions}
              connectionMode={ConnectionMode.Loose}
            >
              <Background color="#E4E8F0" gap={24} variant="dots" size={1.5} />
              <ReactFlowControls
                showZoom={true}
                showFitView={false}
                showInteractive={false}
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: "8px",
                  border: "1px solid #DFE3E8",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  right: "20px",
                  bottom: "20px",
                }}
              >
                <ControlButton
                  onClick={closeFullScreenModal}
                  title="Exit Fullscreen"
                  style={{
                    backgroundColor: "#FF6B6B",
                    color: "white",
                    borderRadius: "4px",
                    margin: "4px",
                    "&:hover": {
                      backgroundColor: "#FF4757",
                    },
                  }}
                >
                  ✕
                </ControlButton>
              </ReactFlowControls>
            </ReactFlow>
          )}
        </div>
      </Dialog>
    </>
  );
};

RiskCreationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editRisk: PropTypes.bool,
  riskData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  isCreate: PropTypes.bool,
};

const WrappedRiskCreationModal = (props) => (
  <DnDProvider>
    <RiskCreationModal {...props} />
  </DnDProvider>
);

export default WrappedRiskCreationModal;
