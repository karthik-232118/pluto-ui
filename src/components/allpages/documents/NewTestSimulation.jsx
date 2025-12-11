import {
  FormControl,
  FormGroup,
  FormLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  Chip,
  Autocomplete,
  Grid,
  Card,
  Button,
  Modal,
  Checkbox,
  CircularProgress,
  OutlinedInput,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Featuredicon from "../../../assets/svg/newdoc/Featuredicon.svg";
import uploadeimage from "../../../assets/svg/newdoc/uploadeimage.svg";
import "./newdocuments.css";
import {
  createTestSimulationModule,
  listProcessOwnerAndEndUser,
  listTestSimulationModuleDraftVersion,
  viewTestSimulationModuleDraft,
  listProcessOwner,
} from "../../../services/testSimulationsModule/TestSimulationModule";
import { uploadTestSimulationZip } from "../../../services/common/common.service";
import { useSelector, useDispatch } from "react-redux";
import { GetElementsCategory } from "../../../store/elements/action";
import notify from "../../../assets/svg/utils/toast/Toast";
import { Close } from "@mui/icons-material";
import { validateAndSanitizeInputs } from "../../../utils";
import { styled } from "@mui/material";
import { GetSystemSettings } from "../../../services/settings/Settings";
import ProgressBar from "../../ProgressBar/ProgressBar";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { validateInput } from "../../../utils/securityUtils";
import errorHandler from "../../../utils/errorHandler";

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
  boxSizing: "border-box",
  marginTop: "0px",
  fontFamily: "Inter",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 1200,
  height: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "12px",
  outline: "none",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden", // Prevent outer scrolling
};

const contentStyle = {
  flex: 1,
  overflowY: "auto",
  padding: "24px",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "4px",
    "&:hover": {
      background: "#555",
    },
  },
};

const footerStyle = {
  padding: "16px 24px",
  borderTop: "1px solid #e0e0e0",
  backgroundColor: "#fff",
  display: "flex",
  gap: 2,
  position: "sticky",
  bottom: 0,
};

const labelStyle = {
  marginBottom: "8px",
  fontWeight: "bold",
};

const CustomTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontWeight: 400,
  },
});

const NewTestSimulation = ({ open, onClose, editTestSimulationID = null }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const [testSimulationID, setTestSimulationID] =
    useState(editTestSimulationID);
  const [testSimulationName, setTestSimulationName] = useState("");
  const [testSimulationDescription, setTestSimulationDescription] =
    useState("");
  const [testSimulationStatus, setTestSimulationStatus] = useState(true);
  const [tags, setTags] = useState([]);
  const [selfApproved, setSelfApproved] = useState(true);
  const [checkers, setCheckers] = useState([]);
  const [escalationPersons, setEscalationPersons] = useState([]);
  const [escalationTimeUnit, setEscalationTimeUnit] = useState("");
  const [escalationTimeValue, setEscalationTimeValue] = useState("");
  const [minimumTime, setMinimumTime] = useState(""); // New field
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showUploadedFileName, setShowUploadedFileName] = useState(null);
  const [fileError, setFileError] = useState("");
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [passPercentage, setPassPercentage] = useState("");
  const [numberOfAttempts, setNumberOfAttempts] = useState("");
  const [testSimulationDraftVersion, setTestSimulationDraftVersion] = useState(
    []
  );
  const [selectedVersion, setSelectedVersion] = useState("");
  const [draftAndMasterVersion, setDraftAndMasterVersion] = useState({});
  const [TestSimulationExpiry, setTestSimulationExpiry] = useState(null);
  const [isSubmittingDocument, setIsSubmittingDocument] = useState(false);
  const [isPublishingDocument, setIsPublishingDocument] = useState(false);
  const [isDraftFetching, setIsDraftFetching] = useState(false);
  const [isDocumentModuleListFetching, setIsDocumentModuleListFetching] =
    useState(false);
  const [processOwnerList, setProcessOwnerList] = useState([]);
  const [isSkipDate, setIsSkipDate] = useState(false);
  const [errors, setErrors] = useState({});
  const [needAcceptance] = useState(false);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useTranslation();
  const FILE_SIZE = uploadedSize;

  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const response = await GetSystemSettings({});
        const data = response.data.data;
        console.log("System Settings Response sim:", data);
        setUploadedSize(data?.SimulationSize);
      } catch (error) {
        console.error("Error fetching system settings:", error);
      }
    };
    fetchSystemSettings();
  }, []);

  const fetchTestSimulationDraftData = async (testSimulationID = null) => {
    if (!testSimulationID) {
      setTestSimulationID(null);
      setTestSimulationName("");
      setTestSimulationDescription("");
      setSelectedOwners([]);
      setTestSimulationStatus(false);
      setTags([]);
      setSelfApproved(false);
      setCheckers([]);
      setEscalationPersons([]);
      setEscalationTimeUnit("");
      setEscalationTimeValue("");
      setMinimumTime(""); // Reset minimum time
      setNumberOfAttempts("");
      setPassPercentage("");
      setShowUploadedFileName(null);
      setUploadedFile(null);
      setFileUrl("");
      setDraftAndMasterVersion({});
      setTestSimulationExpiry(null);
      setIsSkipDate(false);
    } else {
      const data = {
        TestSimulationID: testSimulationID,
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      };
      setIsDraftFetching(true);
      try {
        const response = await viewTestSimulationModuleDraft(data);
        if (response?.status === 200) {
          const testSimulationDraft =
            response?.data?.data?.testSimulationModuleDraft;
          const checkers = testSimulationDraft?.Checkers?.map(
            (checker) => checker?.ModuleCheckerUser
          );
          const escalations = testSimulationDraft?.EscalationPersons?.map(
            (checker) => checker?.ModuleEscalationUser
          );
          const tags = testSimulationDraft?.TestSimulationTags
            ? testSimulationDraft?.TestSimulationTags.split(",")
            : [];
          const selectedOwners = testSimulationDraft?.ModuleOwners?.map(
            (owner) => owner?.UserID
          );
          let filePath = testSimulationDraft?.TestSimulationPath;
          if (filePath) {
            filePath = filePath.split("/").pop() + ".html";
          }
          setTestSimulationName(testSimulationDraft?.TestSimulationName);
          setTestSimulationDescription(
            testSimulationDraft?.TestSimulationDescription
          );
          setSelectedOwners(selectedOwners);
          setTestSimulationStatus(testSimulationDraft?.TestSimulationIsActive);
          setTags(tags);
          setSelfApproved(testSimulationDraft?.SelfApproved);
          setCheckers(checkers);
          setEscalationPersons(escalations);
          setEscalationTimeUnit(testSimulationDraft?.EscalationType);
          setEscalationTimeValue(testSimulationDraft?.EscalationAfter);
          setMinimumTime(testSimulationDraft?.MinimumTime || ""); // Set minimum time from draft
          setNumberOfAttempts(testSimulationDraft?.TotalAttempts);
          setPassPercentage(testSimulationDraft?.PassPercentage);
          setShowUploadedFileName(filePath);
          setFileUrl(testSimulationDraft?.TestSimulationPath);
          setDraftAndMasterVersion({
            draftVersion: testSimulationDraft?.DraftVersion,
            masterVersion: testSimulationDraft?.MasterVersion,
          });
          // Handle TestSimulationExpiry and isSkipDate
          if (testSimulationDraft?.TestSimulationExpiry) {
            setTestSimulationExpiry(testSimulationDraft.TestSimulationExpiry);
            setIsSkipDate(false);
          } else {
            setTestSimulationExpiry(null);
            setIsSkipDate(true);
          }
        } else {
          notify(
            "error",
            response?.data?.message ||
              response?.data?.error ||
              "An error occurred"
          );
        }
      } catch (error) {
        notify("error", error?.response?.data?.message);
      } finally {
        setIsDraftFetching(false);
      }
    }
  };

  const getOwnerNameById = (id) => {
    const owner = processOwnerList.find((owner) => owner.UserID === id);
    return owner ? owner.UserName : "";
  };

  const handleOwnerChange = (event) => {
    const value = event.target.value;
    // Ensure user_id is always included in the selection
    if (!value.includes(user_id)) {
      value.push(user_id);
    }
    setSelectedOwners(value);
  };

  const handleOwnerDelete = (UserID) => {
    // Prevent removal if it's the current user's ID
    if (UserID === user_id) return;
    setSelectedOwners((prev) =>
      prev.filter((selectedUserID) => selectedUserID !== UserID)
    );
  };

  const handleTagDelete = (tagToDelete) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  const uploadZipFile = async (file) => {
    if (!file) {
      notify("error", "No file selected for upload.");
    }
    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);
    try {
      const response = await uploadTestSimulationZip(formData, (progress) => {
        setUploadProgress(progress);
      });

      if (response?.status === 201) {
        const zipUrl = response?.data?.data?.file;
        setFileUrl(zipUrl);
        notify("success", response?.data?.message);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    } finally {
      setIsUploading(false);
    }
  };

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
  } = useDropzone({
    accept: {
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
    maxSize: FILE_SIZE * 1024 * 1024,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setFileError("");
        setUploadedFile(file);
        await uploadZipFile(file);
      }
    },
    onDropRejected: (rejectedFiles) => {
      setUploadedFile(null);
      const error = rejectedFiles[0].errors[0];
      if (error.code === "file-too-large") {
        setFileError(`File is larger than ${FILE_SIZE} MB`);
      } else {
        setFileError(error.message);
      }
    },
    noClick: true,
  });

  const validate = () => {
    let newErrors = {};
    if (!testSimulationName) {
      newErrors.testSimulationName = t("errors.TestSimulationNameRequired");
    }
    if (selectedOwners.length === 0) {
      newErrors.selectedOwners = t("errors.OwnerRequired");
    }
    if (!editTestSimulationID && !testSimulationID) {
      if (!uploadedFile) {
        newErrors.file = t("errors.TestSimulationFileRequired");
      }
    }
    if (!passPercentage || isNaN(passPercentage) || passPercentage <= 0) {
      newErrors.passPercentage = t("errors.PassPercentageRequired");
    }
    if (!numberOfAttempts || isNaN(numberOfAttempts) || numberOfAttempts <= 0) {
      newErrors.numberOfAttempts = t("errors.NumberOfAttemptsRequired");
    }
    // if (!minimumTime || isNaN(minimumTime) || minimumTime <= 0) {
    //   newErrors.minimumTime = t("errors.MinimumTimeRequired");
    // }
    if (!selfApproved) {
      if (checkers.length === 0) {
        newErrors.checkers = t("errors.CheckerRequired");
      }
      if (escalationPersons.length === 0) {
        newErrors.escalationPersons = t("errors.EscalationPersonRequired");
      }
      if (!escalationTimeUnit) {
        newErrors.escalationTimeUnit = t("errors.EscalationTimeUnitRequired");
      }
      if (
        !escalationTimeValue ||
        isNaN(escalationTimeValue) ||
        escalationTimeValue <= 0
      ) {
        newErrors.escalationTimeValue = t("errors.EscalationValueRequired");
      }
    }
    if (!isSkipDate && !TestSimulationExpiry) {
      newErrors.TestSimulationExpiry = t("errors.ExpiryDateRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onCreateTestSimulationHandler = async () => {
    // Add security validation checks
    if (!validateInput(testSimulationName)) {
      setErrors((prev) => ({
        ...prev,
        testSimulationName:
          "Invalid input detected. Please enter a valid test simulation name.",
      }));
      errorHandler.addSecurityError(testSimulationName, "testSimulationName");
      return;
    }

    if (
      testSimulationDescription &&
      !validateInput(testSimulationDescription)
    ) {
      setErrors((prev) => ({
        ...prev,
        testSimulationDescription:
          "Invalid input detected. Please enter a valid description.",
      }));
      errorHandler.addSecurityError(
        testSimulationDescription,
        "testSimulationDescription"
      );
      return;
    }

    if (!validateInput(passPercentage?.toString())) {
      setErrors((prev) => ({
        ...prev,
        passPercentage: "Invalid input detected for pass percentage.",
      }));
      errorHandler.addSecurityError(passPercentage, "passPercentage");
      return;
    }

    if (!validateInput(numberOfAttempts?.toString())) {
      setErrors((prev) => ({
        ...prev,
        numberOfAttempts: "Invalid input detected for number of attempts.",
      }));
      errorHandler.addSecurityError(numberOfAttempts, "numberOfAttempts");
      return;
    }

    if (!validateInput(minimumTime?.toString())) {
      setErrors((prev) => ({
        ...prev,
        minimumTime: "Invalid input detected for minimum time.",
      }));
      errorHandler.addSecurityError(minimumTime, "minimumTime");
      return;
    }
    if (validate()) {
      const inputs = [
        testSimulationName,
        testSimulationDescription,
        tags.join(""),
        passPercentage,
        numberOfAttempts,
        minimumTime, 
        escalationTimeValue,
      ];
      if (validateAndSanitizeInputs(inputs)) {
        if (selfApproved) {
          setIsPublishingDocument(true);
        } else {
          setIsSubmittingDocument(true);
        }
        const ModuleTypeID = presistStore?.ModuleTypeID;
        const ContentID = presistStore?.ContentID;
        if (!ModuleTypeID || !ContentID) {
          return notify("error", "Please select a module and content type");
        }
        const payloadTestSimulationExpiry = isSkipDate
          ? null
          : TestSimulationExpiry;
        const data = {
          ModuleTypeID,
          ContentID,
          TestSimulationID: testSimulationID,
          TestSimulationName: testSimulationName,
          TestSimulationDescription: testSimulationDescription,
          TestSimulationOwner: selectedOwners,
          TestSimulationIsActive: testSimulationStatus,
          TestSimulationTags: tags.join(","),
          SelfApproved: selfApproved,
          Checker: checkers?.map((checker) => checker?.UserID),
          EscalationPerson: escalationPersons?.map(
            (escalation) => escalation?.UserID
          ),
          EscalationType: escalationTimeUnit,
          EscalationAfter: escalationTimeValue,
          MinimumTime: minimumTime, 
          TotalAttempts: numberOfAttempts,
          PassPercentage: passPercentage,
          TestSimulationExpiry: payloadTestSimulationExpiry,
          FileUrl: fileUrl,
          NeedAcceptance: needAcceptance,
        };
        try {
          const response = await createTestSimulationModule(data);
          if (response?.status === 201) {
            notify(
              "success",
              t("Skill Assessment Module created successfully") ||
                response?.data?.message
            );
            onClose();
            dispatch(
              GetElementsCategory({
                ModuleTypeID,
                ParentContentID: ContentID,
              })
            );
          } else {
            notify(
              "error",
              response?.data?.message ||
                response?.data?.error ||
                "An error occurred"
            );
          }
        } catch (error) {
          notify("error", error?.response?.data?.message);
        } finally {
          if (selfApproved) {
            setIsPublishingDocument(false);
          } else {
            setIsSubmittingDocument(false);
          }
        }
      } else {
        notify("error", "Suspicious input detected!");
      }
    }
  };

  useEffect(() => {
    setIsDocumentModuleListFetching(true);
    listTestSimulationModuleDraftVersion({
      ModuleTypeID: presistStore?.ModuleTypeID,
      ContentID: presistStore?.ContentID,
    })
      .then((response) => {
        if (response?.status === 200) {
          setTestSimulationDraftVersion(
            response?.data?.data?.testSimulationList
          );
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      })
      .finally(() => {
        setIsDocumentModuleListFetching(false);
      });
    listProcessOwnerAndEndUser()
      .then((response) => {
        if (response?.status === 200) {
          // setProcessOwnerAndEndUserList(response?.data?.data?.userList);
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      });
    listProcessOwner()
      .then((response) => {
        if (response?.status === 200) {
          setProcessOwnerList(response?.data?.data?.userList);
          // Auto-select current user if they're in the process owner list
          if (user_id && !selectedOwners.includes(user_id)) {
            setSelectedOwners((prev) => [...prev, user_id]);
          }
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      });
  }, []);

  useEffect(() => {
    if (editTestSimulationID) {
      setSelectedVersion(editTestSimulationID);
      fetchTestSimulationDraftData(editTestSimulationID);
    }
  }, [editTestSimulationID]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal open={open}>
      <Box sx={style}>
        <Box
          display="flex"
          alignItems="center"
          gap="10px"
          sx={{
            background: bgColor || "linear-gradient(to top, #2C64FF, #4A90E2)",
            padding: "20px 24px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <img src={Featuredicon} alt="logo" />
          <Box>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              {t("testSimulationManagement")}{" "}
            </Typography>
          </Box>
          <Button
            onClick={onClose}
            sx={{
              position: "absolute",
              right: "8px",
              top: "8px",
              minWidth: "auto",
              p: "4px",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Typography fontSize="24px">×</Typography>
          </Button>
        </Box>
        {isDraftFetching && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <CircularProgress />
            <Typography variant="body2" ml={2}>
              {t("fetching_data")}
            </Typography>
          </Box>
        )}
        <Box sx={contentStyle}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormGroup sx={{ mb: 2 }}>
                <FormLabel className="label">
                  {t("testSimulationName")}{" "}
                  <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <CustomTextField
                  className="custom-input-style"
                  value={testSimulationName}
                  onChange={(e) => setTestSimulationName(e.target.value)}
                  fullWidth
                  placeholder={t("enterDocumentName")}
                  size="small"
                />
                {errors.testSimulationName && (
                  <Typography color="error" variant="caption">
                    {errors.testSimulationName}
                  </Typography>
                )}
              </FormGroup>
              <FormGroup sx={{ mb: 2 }}>
                <FormLabel className="label">
                  {t("testSimulationDescription")}{" "}
                </FormLabel>
                <CustomTextField
                  multiline
                  rows={3}
                  placeholder={t("enterTestSimulationDescription")}
                  value={testSimulationDescription}
                  onChange={(e) => setTestSimulationDescription(e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FormGroup>
              <Box sx={{ mb: 2 }}>
                <FormGroup>
                  <Typography
                    variant="b"
                    sx={{
                      fontWeight: 600,
                      fontSize: "16px",
                      mb: 1,
                    }}
                  >
                    {t("select_owners")}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <FormControl>
                    <Select
                      labelId="select-owners"
                      id="select-owners"
                      multiple
                      value={selectedOwners || []}
                      onChange={handleOwnerChange}
                      label={t("select_owners")}
                      input={
                        <OutlinedInput
                          id="select-multiple-owners"
                          label="Owners"
                          style={{
                            fontWeight: 400,
                          }}
                        />
                      }
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 350,
                          },
                        },
                      }}
                      sx={{
                        fontSize: "14px",
                        fontWeight: 400,
                      }}
                      size="small"
                    >
                      {processOwnerList &&
                        processOwnerList?.length > 0 &&
                        processOwnerList?.map((owner) => (
                          <MenuItem
                            key={owner.UserID}
                            value={owner.UserID}
                            sx={{
                              fontSize: "13px",
                              fontWeight: 400,
                              padding: "8px 12px",
                              backgroundColor:
                                owner.UserID === user_id
                                  ? "rgba(0, 0, 0, 0.04)"
                                  : "inherit",
                            }}
                          >
                            {owner.UserName}{" "}
                            {owner.UserID === user_id ? "(You)" : ""}
                          </MenuItem>
                        ))}
                    </Select>
                    {errors.selectedOwners && (
                      <Typography color="error" variant="caption">
                        {errors.selectedOwners}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mt: 1,
                        mb: 1,
                      }}
                    >
                      {selectedOwners &&
                        selectedOwners?.length > 0 &&
                        selectedOwners?.map((UserID) => (
                          <Chip
                            key={UserID}
                            label={`${getOwnerNameById(UserID)}${
                              UserID === user_id ? " (You)" : ""
                            }`}
                            onDelete={
                              UserID === user_id
                                ? undefined
                                : () => handleOwnerDelete(UserID)
                            }
                            deleteIcon={UserID !== user_id ? <Close /> : null}
                            className="owner-chip"
                            size="small"
                            sx={{
                              fontWeight: 400,
                              fontSize: "13px",
                              backgroundColor:
                                UserID === user_id
                                  ? "rgba(0, 0, 0, 0.08)"
                                  : undefined,
                            }}
                          />
                        ))}
                    </Box>
                  </FormControl>
                </FormGroup>
              </Box>
              {editTestSimulationID && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Box display="flex" alignItems="center">
                    <Switch
                      checked={testSimulationStatus}
                      onChange={() =>
                        setTestSimulationStatus(!testSimulationStatus)
                      }
                      size="small"
                    />
                    <div>
                      <Typography variant="body2" style={{ fontWeight: "500" }}>
                        {t("testSimulationStatus")}
                      </Typography>
                      <Typography variant="caption">
                        {t("changeTestSimulationStatus")}
                      </Typography>
                    </div>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color={testSimulationStatus ? "#15803D" : "#B91C1C"}
                      sx={{
                        bgcolor: testSimulationStatus ? "#F0FDF4" : "#FEF2F2",
                        padding: "4px 12px",
                        borderRadius: "16px",
                      }}
                    >
                      {testSimulationStatus ? t("active") : t("inactive")}
                    </Typography>
                  </Box>
                </Box>
              )}
              {/* <Box sx={{ mb: 2 }}>
                <FormLabel className="label">
                  {t("testSimulationTags")}{" "}
                  <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={tags}
                  onChange={(event, newTags) => setTags(newTags)}
                  renderTags={(value, getTagProps) =>
                    value?.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        {...getTagProps({ index })}
                        onDelete={() => handleTagDelete(tag)}
                        size="small"
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      variant="outlined"
                      placeholder={t("enterTag")}
                      size="small"
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === ",") {
                          event.preventDefault();
                          const newTag = event.target.value.trim();
                          if (newTag && !tags.includes(newTag)) {
                            setTags((prevTags) => [...prevTags, newTag]);
                          }

                          setTimeout(() => {
                            event.target.value = "";
                          }, 0);
                        }
                        if (
                          event.key === "Backspace" &&
                          event.target.value === ""
                        ) {
                          event.preventDefault();
                        }
                      }}
                    />
                  )}
                />
              </Box> */}
              <FormGroup sx={{ mb: 2 }}>
                <FormLabel className="label">
                  {`${t("uploadTestSimulationZIP")} (Max ${FILE_SIZE}MB)`}{" "}
                  <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Card
                  className="upload-card"
                  sx={{
                    backgroundColor: "#f0f0f0",
                    height: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={uploadeimage}
                      alt="uploadeimage"
                      onClick={openFileDialog}
                      style={{
                        height: "30px",
                        width: "30px",
                        cursor: "pointer",
                      }}
                    />
                    <Typography
                      variant="body2"
                      component="p"
                      className="upload-card-text"
                      onClick={openFileDialog}
                      sx={{ cursor: "pointer", mt: 1 }}
                    >
                      {t("selectFileToUpload")}
                    </Typography>
                    <Typography
                      variant="caption"
                      component="p"
                      style={{ color: "#64748B" }}
                      onClick={openFileDialog}
                      sx={{ cursor: "pointer" }}
                    >
                      {t("orDragAndDrop")}
                    </Typography>
                    {isUploading && (
                      <ProgressBar
                        progress={uploadProgress}
                        isUploading={isUploading}
                      />
                    )}
                    {uploadedFile && !isUploading && (
                      <Typography variant="caption" mt={1}>
                        Uploaded: {uploadedFile.name} (
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </Typography>
                    )}
                    {showUploadedFileName && (
                      <Typography variant="caption" mt={1}>
                        {showUploadedFileName}
                      </Typography>
                    )}
                    {fileError && (
                      <Typography variant="caption" color="error" mt={1}>
                        {fileError}
                      </Typography>
                    )}
                  </div>
                </Card>
                {errors.file && (
                  <Typography color="error" variant="caption">
                    {errors.file}
                  </Typography>
                )}
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Box>
                    <Typography
                      sx={{
                        ...labelStyle,
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      {t("passPercentage")}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <input
                      type="text"
                      placeholder={t("passPercentage")}
                      style={{
                        ...inputStyle,
                        marginBottom: "0px",
                        height: "40px",
                      }}
                      min="0"
                      step="1"
                      value={passPercentage}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) >= 0) {
                          setPassPercentage(e.target.value);
                        }
                      }}
                    />
                    {errors.passPercentage && (
                      <Typography color="error" variant="caption">
                        {errors.passPercentage}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box>
                    <Typography
                      sx={{
                        ...labelStyle,
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      {t("numberOfAttempts")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <input
                      type="text"
                      placeholder={t("numberOfAttempts")}
                      style={{
                        ...inputStyle,
                        marginBottom: "0px",
                        height: "40px",
                      }}
                      min="0"
                      step="1"
                      value={numberOfAttempts}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) >= 0) {
                          setNumberOfAttempts(e.target.value);
                        }
                      }}
                    />
                    {errors.numberOfAttempts && (
                      <Typography color="error" variant="caption">
                        {errors.numberOfAttempts}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
              <FormGroup sx={{ mb: 2 }}>
                <FormLabel className="label">
                  {t("minimumTime")} <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <CustomTextField
                  type="time"
                  value={minimumTime}
                  onChange={(e) => setMinimumTime(e.target.value)}
                  fullWidth
                  placeholder={t("enterMinimumTime")}
                  InputProps={{ inputProps: { min: 1, step: 1 } }}
                  error={!!errors.minimumTime}
                  helperText={errors.minimumTime || ""}
                  size="small"
                />
              </FormGroup>
              <FormGroup sx={{ mb: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <FormLabel className="label" sx={{ fontSize: "14px" }}>
                    {t("testSimulationExpiryDate")}{" "}
                    {!isSkipDate && <span style={{ color: "red" }}>*</span>}{" "}
                  </FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSkipDate}
                        onChange={(e) => setIsSkipDate(e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={t("skip_date")}
                    labelPlacement="start"
                    sx={{
                      marginRight: 0,
                      "& .MuiTypography-root": {
                        marginBottom: 0,
                        fontSize: "12px",
                      },
                    }}
                  />
                </Box>
                <CustomTextField
                  type="date"
                  value={TestSimulationExpiry}
                  onChange={(e) => setTestSimulationExpiry(e.target.value)}
                  fullWidth
                  placeholder="YYYY-MM-DD"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: today }}
                  disabled={isSkipDate}
                  size="small"
                />
                {errors.TestSimulationExpiry && (
                  <Typography color="error" variant="caption">
                    {errors.TestSimulationExpiry}
                  </Typography>
                )}
              </FormGroup>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                }}
              >
                <Switch
                  checked={selfApproved}
                  onChange={() => setSelfApproved(!selfApproved)}
                  size="small"
                />
                <Box ml={2}>
                  <Typography variant="body2" style={{ fontWeight: "500" }}>
                    {t("selfApproved")}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t("enable Self Approval")}
                  </Typography>
                </Box>
              </Box>
              {!selfApproved && (
                <Box
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    p: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    {t("approvalSettings")}
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          ...labelStyle,
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        {t("escalationTimeValue")}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <input
                        type="text"
                        placeholder={t("escalationTimeValue")}
                        style={{
                          ...inputStyle,
                          marginBottom: "0px",
                          height: "40px",
                        }}
                        value={escalationTimeValue}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || Number(value) >= 0) {
                            setEscalationTimeValue(e.target.value);
                          }
                        }}
                      />
                      {errors.escalationTimeValue && (
                        <Typography color="error" variant="caption">
                          {errors.escalationTimeValue}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        sx={{
                          ...labelStyle,
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        {t("escalationTimeUnit")}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={escalationTimeUnit}
                          onChange={(e) =>
                            setEscalationTimeUnit(e.target.value)
                          }
                          size="small"
                          sx={{ height: "40px" }}
                        >
                          <MenuItem value="hours">{t("hours")}</MenuItem>
                          <MenuItem value="days">{t("days")}</MenuItem>
                          <MenuItem value="weeks">{t("weeks")}</MenuItem>
                        </Select>
                        {errors.escalationTimeUnit && (
                          <Typography color="error" variant="caption">
                            {errors.escalationTimeUnit}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Footer - stays fixed */}
        <Box sx={footerStyle}>
          <Button
            variant="outlined"
            fullWidth
            color="secondary"
            onClick={onClose}
            style={{
              height: "44px",
              borderColor: "#D0D5DD",
              color: "#000",
              textTransform: "none",
              borderRadius: "8px",
              cursor: `${
                isSubmittingDocument || isPublishingDocument
                  ? "not-allowed"
                  : "pointer"
              }`,
            }}
            disabled={isSubmittingDocument || isPublishingDocument}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={onCreateTestSimulationHandler}
            style={{
              backgroundColor:
                isSubmittingDocument || isPublishingDocument || !selfApproved
                  ? "#B0B0B0"
                  : bgColor || "#3D54CD",
              textTransform: "none",
              height: "44px",
              borderRadius: "8px",
            }}
            disabled={
              isSubmittingDocument || !selfApproved || isPublishingDocument
            }
          >
            {isPublishingDocument ? t("publishing") : t("publishButton")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewTestSimulation;

NewTestSimulation.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editTestSimulationID: PropTypes.string,
  needAcceptance: PropTypes.bool,
};
