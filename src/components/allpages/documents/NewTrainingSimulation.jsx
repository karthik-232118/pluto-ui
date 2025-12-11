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
  Card,
  Button,
  Modal,
  Checkbox,
  CircularProgress,
  OutlinedInput,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Featuredicon from "../../../assets/svg/newdoc/Featuredicon.svg";
import uploadeimage from "../../../assets/svg/newdoc/uploadeimage.svg";
import "./newdocuments.css";
import {
  createTrainingSimulationModule,
  listTrainingSimulationModuleDraftVersion,
  viewTrainingSimulationModuleDraft,
  listProcessOwnerAndEndUser,
  listProcessOwner,
} from "../../../services/trainingSimulationsModule/TrainingSimulationModule";
import {
  uploadTrainingSimulationVideo,
  uploadTrainingSimulationZip,
} from "../../../services/common/common.service";
import { useSelector, useDispatch } from "react-redux";
import { GetElementsCategory } from "../../../store/elements/action";
import notify from "../../../assets/svg/utils/toast/Toast";
import { Close, CloseOutlined } from "@mui/icons-material";
import { validateAndSanitizeInputs } from "../../../utils";
import { GetSystemSettings } from "../../../services/settings/Settings";
import repotApis from "../../../services/reportModules";
import { styled } from "@mui/material";
import ProgressBar from "../../ProgressBar/ProgressBar";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";
import { validateInput } from "../../../utils/securityUtils";
import errorHandler from "../../../utils/errorHandler";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "1100px", // Increased width
  maxWidth: "98vw",
  height: "800px", // Increased height
  maxHeight: "98vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "0",
  borderRadius: "16px",
  outline: "none",
  display: "flex",
  flexDirection: "column",
};

const contentStyle = {
  padding: "0 32px 32px 32px",
  flex: 1,
  overflowY: "auto", // Only content scrolls
  display: "flex",
  flexDirection: "column",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "32px",
  marginBottom: "24px",
  alignItems: "start",
  // Responsive for small screens
  "@media (max-width: 900px)": {
    gridTemplateColumns: "1fr",
    gap: "16px",
  },
};

const fullWidthStyle = {
  gridColumn: "1 / span 2",
};

const CustomTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontWeight: 400,
  },
});
const NewTrainingSimulation = ({
  open,
  onClose,
  editTrainingSimulationID = null,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );

  const [trainingSimulationID, setTrainingSimulationID] = useState(
    editTrainingSimulationID
  );
  const [trainingSimulationName, setTrainingSimulationName] = useState("");
  const [trainingSimulationDescription, setTrainingSimulationDescription] =
    useState("");
  const [trainingSimulationStatus, setTrainingSimulationStatus] =
    useState(true);
  const [tags, setTags] = useState([]);
  const [selfApproved, setSelfApproved] = useState(true);
  const [checkers, setCheckers] = useState([]);
  const [escalationPersons, setEscalationPersons] = useState([]);
  const [escalationTimeUnit, setEscalationTimeUnit] = useState("");
  const [escalationTimeValue, setEscalationTimeValue] = useState("");
  const [uploadedFile, setUploadedFile] = useState({
    video: null,
    zip: null,
  });
  const [fileError, setFileError] = useState("");
  const [showUploadedFileName, setShowUploadedFileName] = useState({
    video: null,
    zip: null,
  });
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [owners, setOwners] = useState([]);
  const [trainingSimulationDraftVersion, setTrainingSimulationDraftVersion] =
    useState([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [draftAndMasterVersion, setDraftAndMasterVersion] = useState({});
  const [isSubmittingDocument, setIsSubmittingDocument] = useState(false);
  const [isPublishingDocument, setIsPublishingDocument] = useState(false);
  const [isDraftFetching, setIsDraftFetching] = useState(false);
  const [TrainingSimulationExpiry, setTrainingSimulationExpiry] =
    useState(null);
  const [isDocumentModuleListFetching, setIsDocumentModuleListFetching] =
    useState(false);

  const [isVideo, setIsVideo] = useState(false);
  const [isSkipTrainingSimulationExpiry, setIsSkipTrainingSimulationExpiry] =
    useState(false);
  const [errors, setErrors] = useState({});
  const [fileUrl, setFileUrl] = useState({
    video: null,
    zip: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [needAcceptance] = useState(false);
  const [videoUploadSize, setVideoUploadSize] = useState(0);
  const [elementDropdown, setElementDropdown] = useState([]);
  const [linkTrainigSimulation, setLinkTrainingSimulation] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const FILE_SIZE = uploadedSize;

  const theme = useTheme();
  const bgColor = theme.palette.primary.main;
  const headerStyle = {
    background: bgColor || "linear-gradient(to top, #2C64FF, #4A90E2)",
    padding: "24px",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    "& .MuiTypography-h6": {
      color: "#FFFFFF",
    },
    "& .MuiTypography-body2": {
      color: "#FFFFFF",
      opacity: 0.9,
    },
  };

  useEffect(() => {
    const fetchElements = async () => {
      try {
        const payload = {
          ModuleTypeID: presistStore?.ModuleTypeID,
        };
        const elements = await repotApis.getElementsDropdownOption(payload);
        setElementDropdown(elements);
      } catch (error) {
        console.error("Failed to fetch elements", error);
      }
    };
    fetchElements();
  }, []);

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const response = await GetSystemSettings({});
        const data = response.data.data;
        console.log("System Settings Response sim:", data);

        setUploadedSize(data?.SimulationSize);
        setVideoUploadSize(data?.VideoSize);
      } catch (error) {
        console.error("Error fetching system settings:", error);
      }
    };

    fetchSystemSettings();
  }, []);
  const uploadVideoFile = async (file) => {
    if (!file) {
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);
    try {
      const response = await uploadTrainingSimulationVideo(
        formData,
        (progress) => {
          setUploadProgress(progress);
        }
      );
      if (response?.status === 201) {
        const videoUrl = response?.data?.data?.file;
        setFileUrl((prev) => ({
          ...prev,
          video: videoUrl,
        }));
        notify("success", response?.data?.message);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    } finally {
      setIsUploading(false);
    }
  };
  const uploadZipFile = async (file) => {
    if (!file) {
      notify("error", "No file selected for upload.");
    }
    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);
    try {
      const response = await uploadTrainingSimulationZip(
        formData,
        (progress) => {
          setUploadProgress(progress);
        }
      );
      if (response?.status === 201) {
        const zipUrl = response?.data?.data?.file;
        setFileUrl((prev) => ({
          ...prev,
          zip: zipUrl,
        }));
        notify("success", response?.data?.message);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSwitchChange = () => {
    setIsVideo((prev) => !prev);
    setFileError("");
  };

  const handleFileUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileError("");

      if (isVideo) {
        setUploadedFile((prev) => ({
          ...prev,
          video: file,
        })); // Save the video URL
        await uploadVideoFile(file);
      } else {
        setUploadedFile((prev) => ({
          ...prev,
          zip: file,
        })); // Save the video URL
        await uploadZipFile(file);
      }
    }
  };

  const fetchTrainingSimulationDraftData = async (
    trainingSimulationID = null
  ) => {
    if (!trainingSimulationID) {
      setTrainingSimulationID(null);
      setTrainingSimulationName("");
      setTrainingSimulationDescription("");
      setSelectedOwners([]);
      setTrainingSimulationStatus(false);
      setTags([]);
      setSelfApproved(false);
      setCheckers([]);
      setEscalationPersons([]);
      setEscalationTimeUnit("");
      setEscalationTimeValue("");
      setShowUploadedFileName({
        video: null,
        zip: null,
      });
      setUploadedFile({
        video: null,
        zip: null,
      });
      setFileUrl({
        video: null,
        zip: null,
      });
      setIsVideo(false);
      setDraftAndMasterVersion({});
    } else {
      const data = {
        TrainingSimulationID: trainingSimulationID,
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      };
      setIsDraftFetching(true);
      try {
        setUploadedFile({
          video: null,
          zip: null,
        });
        const response = await viewTrainingSimulationModuleDraft(data);
        if (response?.status === 200) {
          const trainingSimulationDraft =
            response?.data?.data?.trainingSimulationModuleDraft;
          console.log("trainingSimulationDraft", trainingSimulationDraft);
          const checkers = trainingSimulationDraft?.Checkers?.map(
            (checker) => checker?.ModuleCheckerUser
          );
          const escalations = trainingSimulationDraft?.EscalationPersons?.map(
            (checker) => checker?.ModuleEscalationUser
          );
          const tags = trainingSimulationDraft?.TrainingSimulationTags
            ? trainingSimulationDraft?.TrainingSimulationTags.split(",")
            : [];
          const selectedOwners = trainingSimulationDraft?.ModuleOwners?.map(
            (owner) => owner?.UserID
          );
          let filePath = trainingSimulationDraft?.TrainingSimulationPath;
          if (filePath) {
            if (trainingSimulationDraft?.IsTrainingLinkIsVideo) {
              filePath = filePath.split("/").pop();
              setFileUrl({
                video: trainingSimulationDraft?.TrainingSimulationPath,
                zip: null,
              });
              setShowUploadedFileName((prev) => ({
                ...prev,
                video: filePath,
              }));
            } else {
              filePath = filePath.split("/").pop() + ".html";
              setFileUrl({
                zip: trainingSimulationDraft?.TrainingSimulationPath,
                video: null,
              });
              setShowUploadedFileName((prev) => ({
                ...prev,
                zip: filePath,
              }));
            }
          }
          setTrainingSimulationName(
            trainingSimulationDraft?.TrainingSimulationName
          );
          setTrainingSimulationDescription(
            trainingSimulationDraft?.TrainingSimulationDescription
          );
          setSelectedOwners(selectedOwners);
          setTrainingSimulationStatus(
            trainingSimulationDraft?.TrainingSimulationIsActive
          );
          setTags(tags);
          setSelfApproved(trainingSimulationDraft?.SelfApproved);
          setCheckers(checkers);
          setEscalationPersons(escalations);
          setEscalationTimeUnit(trainingSimulationDraft?.EscalationType);
          setEscalationTimeValue(trainingSimulationDraft?.EscalationAfter);
          setIsVideo(trainingSimulationDraft?.IsTrainingLinkIsVideo);
          setDraftAndMasterVersion({
            draftVersion: trainingSimulationDraft?.DraftVersion,
            masterVersion: trainingSimulationDraft?.MasterVersion,
          });
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

  const handleVersionChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "none") {
      setSelectedVersion("");
      fetchTrainingSimulationDraftData();
    } else {
      setSelectedVersion(selectedValue);
      setTrainingSimulationID(selectedValue);

      const selectedVersionObj = trainingSimulationDraftVersion.find(
        (version) => version.TrainingSimulationID === selectedValue
      );

      setDraftAndMasterVersion({
        draftVersion: selectedVersionObj?.DraftVersion,
        masterVersion: selectedVersionObj?.MasterVersion,
      });

      fetchTrainingSimulationDraftData(selectedValue);
    }
  };

  const getOwnerNameById = (id) => {
    const owner = owners?.find((owner) => owner.UserID === id);
    return owner ? owner.UserName : "";
  };

  const handleOwnerChange = (event) => {
    const value = event.target.value;
    setSelectedOwners(value);
  };

  const handleOwnerDelete = (UserID) => {
    setSelectedOwners((prev) =>
      prev.filter((selectedUserID) => selectedUserID !== UserID)
    );
  };

  const handleTagDelete = (tagToDelete) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
  } = useDropzone({
    accept: isVideo
      ? [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/x-msvideo",
        "video/x-matroska",
        "video/quicktime",
        "video/x-ms-wmv",
        "video/x-flv",
        "video/3gpp",
        "video/h265",
        "video/mob",
      ]
      : {
        "application/zip": [".zip"],
        "application/x-zip-compressed": [".zip"],
      },
    maxSize: videoUploadSize * 1024 * 1024,
    onDrop: handleFileUpload,
    onDropRejected: () => {
      setFileError("File is too large or unsupported format.");
      setUploadedFile((prev) => {
        if (isVideo) {
          return {
            ...prev,
            video: null,
          };
        } else {
          return {
            ...prev,
            zip: null,
          };
        }
      });
    },
  });

  const validate = () => {
    let newErrors = {};

    if (!trainingSimulationName) {
      newErrors.trainingSimulationName = t(
        "errors.TrainingSimulationNameRequired"
      );
    }
    if (selectedOwners.length === 0) {
      newErrors.selectedOwners = t("errors.OwnerRequired");
    }
    if (!editTrainingSimulationID && !trainingSimulationID) {
      if (!uploadedFile.video && !uploadedFile.zip) {
        newErrors.file = t("errors.TrainingSimulationFileRequired");
      }
    }
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
    if (!isSkipTrainingSimulationExpiry && !TrainingSimulationExpiry) {
      newErrors.TrainingSimulationExpiry = t("errors.ExpiryDateRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onCreateTrainingSimulationHandler = async () => {
    if (!validateInput(trainingSimulationName)) {
      setErrors((prev) => ({
        ...prev,
        trainingSimulationName:
          "Invalid input detected. Please enter a valid name.",
      }));
      errorHandler.addSecurityError(
        trainingSimulationName,
        "trainingSimulationName"
      );
      return;
    }

    if (
      trainingSimulationDescription &&
      !validateInput(trainingSimulationDescription)
    ) {
      setErrors((prev) => ({
        ...prev,
        trainingSimulationDescription:
          "Invalid input detected. Please enter a valid description.",
      }));
      errorHandler.addSecurityError(
        trainingSimulationDescription,
        "trainingSimulationDescription"
      );
      return;
    }

    if (!selfApproved) {
      if (
        escalationTimeValue &&
        !validateInput(escalationTimeValue.toString())
      ) {
        setErrors((prev) => ({
          ...prev,
          escalationTimeValue:
            "Invalid input detected for escalation time value.",
        }));
        errorHandler.addSecurityError(
          escalationTimeValue,
          "escalationTimeValue"
        );
        return;
      }
    }

    // Continue with existing validation
    if (validate()) {
      const inputs = [
        trainingSimulationName,
        trainingSimulationDescription,
        tags.join(""),
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

        const payloadTrainingSimulationExpiry = isSkipTrainingSimulationExpiry
          ? null
          : TrainingSimulationExpiry;

        const data = {
          ModuleTypeID,
          ContentID,
          TrainingSimulationID: trainingSimulationID,
          TrainingSimulationName: trainingSimulationName,
          TrainingSimulationDescription: trainingSimulationDescription,
          TrainingSimulationOwner: selectedOwners,
          TrainingSimulationIsActive: trainingSimulationStatus,
          TrainingSimulationTags: tags.join(","),
          SelfApproved: selfApproved,
          Checker: checkers.map((checker) => checker?.UserID),
          EscalationPerson: escalationPersons.map(
            (escalation) => escalation?.UserID
          ),
          EscalationType: escalationTimeUnit,
          EscalationAfter: escalationTimeValue,
          TrainingSimulationExpiry: payloadTrainingSimulationExpiry,
          IsTrainingLinkIsVideo: isVideo,
          FileUrl: isVideo ? fileUrl.video : fileUrl.zip,
          NeedAcceptance: needAcceptance,
          LinkTrainingSimulation: linkTrainigSimulation,
        };

        try {
          const response = await createTrainingSimulationModule(data);
          if (response?.status === 201) {
            notify(
              "success",
              t("Skill Building Module created successfully") ||
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
    // Fetch versions when component loads
    setIsDocumentModuleListFetching(true);
    listTrainingSimulationModuleDraftVersion({
      ModuleTypeID: presistStore?.ModuleTypeID,
      ContentID: presistStore?.ContentID,
    })
      .then((response) => {
        if (response?.status === 200) {
          setTrainingSimulationDraftVersion(
            response?.data?.data?.trainingSimulationList
          );
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      })
      .finally(() => {
        setIsDocumentModuleListFetching(false);
      });

    // Fetch user list for checkers/escalation persons
    listProcessOwnerAndEndUser()
      .then((response) => {
        if (response?.status === 200) {
          // setEndUserAndEscalationPersons(response?.data?.data?.userList);
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      });
    listProcessOwner()
      .then((response) => {
        if (response?.status === 200) {
          setOwners(response?.data?.data?.userList);
          console.log(response?.data?.data?.userList, "eafewr");
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      });
  }, []);

  useEffect(() => {
    if (editTrainingSimulationID) {
      setSelectedVersion(editTrainingSimulationID);
      fetchTrainingSimulationDraftData(editTrainingSimulationID);
    }
  }, [editTrainingSimulationID]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Fetch checkers and escalation persons
    listProcessOwner()
      .then((response) => {
        if (response?.status === 200) {
          // setCheckersAndEscalationPersons(response?.data?.data?.userList);
          console.log(
            response?.data?.data?.userList,
            "Fetched Users for Dropdown"
          );
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      });
  }, []);

  return (
    <Modal open={open}>
      <Card sx={style}>
        <>
          <Box sx={headerStyle}>
            <Box display="flex" alignItems="center" gap="10px">
              <img src={Featuredicon} alt="logo" />
              <Box>
                <Typography variant="h6">
                  {t("trainingSimulationManagement")}
                </Typography>
                <Typography variant="body2">
                  {t("trainingSimulationDescription")}
                </Typography>
              </Box>
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
          <Box sx={contentStyle}>   
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

            <Box sx={formGridStyle}>
              {/* Left Column */}
              <Box>
                <FormGroup>
                  <FormLabel className="label">
                    {t("training_simulation_name")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <CustomTextField
                    className="custom-input-style"
                    value={trainingSimulationName}
                    onChange={(e) => setTrainingSimulationName(e.target.value)}
                    fullWidth
                    placeholder={t("enter_document_name")}
                  />
                  {errors.trainingSimulationName && (
                    <Typography color="error">
                      {errors.trainingSimulationName}
                    </Typography>
                  )}
                </FormGroup>
                <FormGroup>
                  <FormLabel className="label">
                    {t("training_simulation_description")}
                  </FormLabel>
                  <CustomTextField
                    multiline
                    rows={3}
                    placeholder={t("enter_training_simulation_description")}
                    value={trainingSimulationDescription}
                    onChange={(e) =>
                      setTrainingSimulationDescription(e.target.value)
                    }
                    variant="outlined"
                    fullWidth
                  />
                </FormGroup>
                <Box>
                  <FormGroup>
                    <Typography
                      variant="b"
                      sx={{
                        fontWeight: 600,
                        fontSize: "16px",
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
                        input={
                          <OutlinedInput
                            id="select-multiple-owners"
                            label="Owners"
                            style={{
                              fontWeight: 450,
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
                          fontWeight: 450,
                        }}
                      >
                        {owners &&
                          owners?.length > 0 &&
                          owners?.map((owner) => (
                            <MenuItem
                              key={owner.UserID}
                              value={owner.UserID}
                              sx={{
                                fontSize: "13px",
                                fontWeight: 400,
                                padding: "8px 12px",
                              }}
                            >
                              {owner.UserName}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.selectedOwners && (
                        <Typography
                          color="error"
                          sx={{
                            fontWeight: 400,
                            fontSize: "13px",
                          }}
                        >
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
                          maxWidth: "500px",
                        }}
                      >
                        {selectedOwners &&
                          selectedOwners?.length > 0 &&
                          selectedOwners?.map((UserID) => (
                            <Chip
                              key={UserID}
                              label={getOwnerNameById(UserID)}
                              onDelete={() => handleOwnerDelete(UserID)}
                              deleteIcon={<Close />}
                              className="owner-chip"
                              sx={{
                                fontWeight: 400,
                                fontSize: "13px",
                              }}
                            />
                          ))}
                      </Box>
                    </FormControl>
                  </FormGroup>
                </Box>
                {editTrainingSimulationID && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    <Box display="flex" alignItems="center">
                      <Switch
                        checked={trainingSimulationStatus}
                        onChange={() =>
                          setTrainingSimulationStatus(!trainingSimulationStatus)
                        }
                      />
                      <div>
                        <Typography
                          variant="body1"
                          style={{ fontWeight: "500" }}
                        >
                          {t("training_simulation_status")}
                        </Typography>
                        <Typography variant="body2">
                          {t("change_training_simulation_status")}
                        </Typography>
                      </div>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        color={trainingSimulationStatus ? "#15803D" : "#B91C1C"}
                        sx={{
                          bgcolor: trainingSimulationStatus
                            ? "#F0FDF4"
                            : "#FEF2F2",
                          padding: "4px 12px",
                          borderRadius: "16px",
                        }}
                      >
                        {trainingSimulationStatus ? t("active") : t("inactive")}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
              {/* Right Column */}
              <Box>
                {/* File Upload */}
                <FormGroup>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={0}
                  >
                    <FormLabel
                      className="label"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {isVideo
                        ? `${t(
                          "selectVideoToUpload"
                        )} (Max ${videoUploadSize}MB)`
                        : `${t(
                          "uploadTrainingSimulationZip"
                        )} (Max ${FILE_SIZE}MB)`}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </FormLabel>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Typography variant="b" mr={1}>
                        {t("training_simulation")}
                      </Typography>
                      <Switch checked={isVideo} onChange={handleSwitchChange} />
                      <Typography variant="b" ml={1}>
                        {t("video")}
                      </Typography>
                    </Box>
                  </Box>
                  <Card
                    className="upload-card"
                    sx={{ backgroundColor: "#f0f0f0" }}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={uploadeimage}
                        alt="upload"
                        onClick={openFileDialog}
                        style={{ height: "40px", width: "40px" }}
                      />
                      <Typography
                        variant="body1"
                        component="p"
                        className="upload-card-text"
                      >
                        {isVideo
                          ? t("select_file_to_upload")
                          : t("select_video_to_upload")}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="p"
                        style={{ color: "#64748B" }}
                        onClick={openFileDialog}
                      >
                        {t("or_drag_and_drop")}
                      </Typography>
                      {isUploading && (
                        <ProgressBar
                          progress={uploadProgress}
                          isUploading={isUploading}
                        />
                      )}
                      {isVideo
                        ? uploadedFile.video &&
                        !isUploading && (
                          <Typography variant="body2" mt={1}>
                            Uploaded: {uploadedFile.video.name} (
                            {(
                              uploadedFile.video.size /
                              (1024 * 1024)
                            ).toFixed(2)}{" "}
                            MB)
                          </Typography>
                        )
                        : uploadedFile.zip &&
                        !isUploading && (
                          <Typography variant="body2" mt={1}>
                            Uploaded: {uploadedFile.zip.name} (
                            {(uploadedFile.zip.size / (1024 * 1024)).toFixed(
                              2
                            )}{" "}
                            MB)
                          </Typography>
                        )}
                      {isVideo
                        ? showUploadedFileName.video && (
                          <Typography variant="body2" mt={1}>
                            {showUploadedFileName.video}
                          </Typography>
                        )
                        : showUploadedFileName.zip && (
                          <Typography variant="body2" mt={1}>
                            {showUploadedFileName.zip}
                          </Typography>
                        )}
                      {fileError && (
                        <Typography variant="body2" color="error" mt={1}>
                          {fileError}
                        </Typography>
                      )}
                    </div>
                  </Card>
                  {errors.file && (
                    <Typography color="error">{errors.file}</Typography>
                  )}
                </FormGroup>
              </Box>
            </Box>
            <Box sx={{ marginTop: "-30px", marginBottom: "20px" }}>
              {/* Training Simulation Tags - full width */}
              {/* <FormGroup sx={fullWidthStyle}>
                <FormLabel className="label">
                  {t("training_simulation_tags")}
                  <span
                    style={{
                      color: "#888",
                      marginLeft: "8px",
                      fontSize: "12px",
                    }}
                  >
                    ({t("Press Enter or comma")})
                  </span>
                </FormLabel>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={tags}
                  onChange={(event, newTags) => setTags(newTags)}
                  renderTags={(value, getTagProps) =>
                    value.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        {...getTagProps({ index })}
                        onDelete={() => handleTagDelete(tag)}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      variant="outlined"
                      placeholder={t("enterTag")}
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
              </FormGroup> */}
              {/* Training Simulation Expiry Date - full width */}
              <FormGroup sx={fullWidthStyle}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FormLabel className="label">
                    {t("training_simulation_expiry_date")}{" "}
                    {!isSkipTrainingSimulationExpiry && (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSkipTrainingSimulationExpiry}
                        onChange={(e) =>
                          setIsSkipTrainingSimulationExpiry(e.target.checked)
                        }
                        color="primary"
                      />
                    }
                    label={t("skip_date")}
                    labelPlacement="start"
                    sx={{
                      marginRight: 0,
                      "& .MuiTypography-root": {
                        marginBottom: 0,
                      },
                    }}
                  />
                </Box>
                <CustomTextField
                  type="date"
                  value={TrainingSimulationExpiry}
                  onChange={(e) => setTrainingSimulationExpiry(e.target.value)}
                  fullWidth
                  placeholder="YYYY-MM-DD"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: today }}
                  disabled={isSkipTrainingSimulationExpiry}
                />
                {errors.TrainingSimulationExpiry && (
                  <Typography color="error">
                    {errors.TrainingSimulationExpiry}
                  </Typography>
                )}
              </FormGroup>
            </Box>
            {/* Actions - full width */}
            <div className="actions-wrapper" style={fullWidthStyle}>
              <Button
                variant="outlined"
                fullWidth
                onClick={onClose}
                style={{
                  height: "40px",
                  textTransform: "none",
                  borderRadius: "8px",
                  cursor: `${isSubmittingDocument || isPublishingDocument || isUploading
                    ? "not-allowed"
                    : "pointer"
                    }`,
                }}
                disabled={
                  isSubmittingDocument || isPublishingDocument || isUploading
                }
              >
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={onCreateTrainingSimulationHandler}
                style={{
                  backgroundColor:
                    isSubmittingDocument ||
                      isPublishingDocument ||
                      !selfApproved ||
                      isUploading
                      ? "#B0B0B0"
                      : bgColor || "#3D54CD",
                  textTransform: "none",
                  height: "40px",
                  borderRadius: "8px",
                }}
                disabled={
                  isSubmittingDocument ||
                  !selfApproved ||
                  isPublishingDocument ||
                  isUploading
                }
              >
                {isPublishingDocument ? t("publishing") : t("publishButton")}
              </Button>
            </div>
          </Box>
        </>
      </Card>
    </Modal>
  );
};

export default NewTrainingSimulation;

NewTrainingSimulation.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editTrainingSimulationID: PropTypes.string,
  elementDropdown: PropTypes.array.isRequired,
};
