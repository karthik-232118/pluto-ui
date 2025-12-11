import {
  Divider,
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
  Button,
  Modal,
  Checkbox,
  CircularProgress,
  OutlinedInput,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import icon from "../../assets/svg/sopsModal/modalIcon.svg";
import { GetElementsCategory } from "../../store/elements/action";
import {
  listProcessOwner,
  listProcessOwnerAndEndUser,
  listFormModuleDraftVersion,
  viewFormModuleDraft,
  createFormModule,
  publishFormModule,
  generateTokenForDynamicForm,
  verifyUserPermissionToEditForm,
} from "../../services/formModules/FormModules";
import { useDispatch, useSelector } from "react-redux";
import notify from "../../assets/svg/utils/toast/Toast";
import { Close } from "@mui/icons-material";
import { validateAndSanitizeInputs } from "../../utils";
import usePopupRedirect from "../../hooks/usePopupRedirect";
import CustomFormModalPopup from "./CustomFormModalPopup";
import { FORM_BASE_URL } from "../../config/urlConfig";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";
import { validateInput } from "../../utils/securityUtils";
import errorHandler from "../../utils/errorHandler";

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
  width: "90%",
  maxWidth: 1000,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "24px",
  borderRadius: "12px",
  outline: "none",
};

const labelStyle = {
  marginBottom: "8px",
  fontWeight: "bold",
};

const NewFormModal = ({ open, onClose, editFormID = null }) => {
  const { t } = useTranslation();
  const { checkPopupAndRedirect, PopupModal } = usePopupRedirect();
  const userType = localStorage.getItem("user_type");
  const dispatch = useDispatch();
  const theme = useTheme();
  const bgColor = theme.palette.primary.main; // Use theme color directly
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );

  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [formID, setFormID] = useState(editFormID);
  const [isSubmittingDocument, setIsSubmittingDocument] = useState(false);
  const [isPublishingDocument, setIsPublishingDocument] = useState(false);
  const [formDraftID, setFormDraftID] = useState(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState(true); // Default to active
  const [tags, setTags] = useState([]);
  const [selfApproved, setSelfApproved] = useState(false);
  const [checkers, setCheckers] = useState([]);
  const [escalationPersons, setEscalationPersons] = useState([]);
  const [escalationTimeUnit, setEscalationTimeUnit] = useState(null);
  const [escalationTimeValue, setEscalationTimeValue] = useState(null);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [processOwnerAndEndUserList, setProcessOwnerAndEndUserList] = useState(
    []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formDraftVersion, setFormDraftVersion] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [draftAndMasterVersion, setDraftAndMasterVersion] = useState({});
  const [isDraftFetching, setIsDraftFetching] = useState(false);
  const [isFormModuleListFetching, setIsFormModuleListFetching] =
    useState(false);
  const [processOwnerList, setProcessOwnerList] = useState([]);
  const [formExpiry, setFormExpiry] = useState(null);
  const [isSkipFormExpiry, setIsSkipFormExpiry] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDraftPublishing, setIsDraftPublishing] = useState(false);
  const [showPublishButton, setShowPublishButton] = useState(
    editFormID || formID ? true : false
  );
  const [disableSaveAndSubmitButton, setDisableSaveAndSubmitButton] =
    useState(false);

  // Add approvers state
  const [approvers, setApprovers] = useState([]);

  const handlePublishOpenModal = () => {
    setIsPublishModalOpen(true);
  };

  const handlePublishCloseModal = () => {
    setIsPublishModalOpen(false);
  };

  const handleCancelOpenModal = () => {
    setIsCancelModalOpen(true);
  };

  const handleCancelCloseModal = () => {
    setIsCancelModalOpen(false);
  };

  const handlePublishModalContinue = async () => {
    try {
      if (selfApproved) {
        await onCreateFormHandler({ type: "publishContinue" });
      } else {
        await publishDraft(formID);
      }
      setIsPublishModalOpen(false);
    } catch (error) {
      setIsPublishModalOpen(true);
    }
  };

  // Error States
  const [errors, setErrors] = useState({});

  const fetchFormDraftData = async (formID = null) => {
    if (!formID) {
      setFormID(null);
      setFormDraftID(null);
      setFormName("");
      setFormDescription("");
      setSelectedOwners([]);
      setFormStatus(false);
      setTags([]);
      setSelfApproved(false);
      setCheckers([]);
      setEscalationPersons([]);
      setEscalationTimeUnit(null);
      setEscalationTimeValue(null);
      setDraftAndMasterVersion({});
      setIsSkipFormExpiry(false);
      setFormExpiry(null);
    } else {
      const data = {
        FormID: formID,
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      };

      setIsDraftFetching(true);

      try {
        const response = await viewFormModuleDraft(data);
        if (response?.status === 200) {
          const formDraft = response?.data?.data?.formDraft;
          const checkers = formDraft?.Checkers?.map(
            (checker) => checker?.ModuleCheckerUser
          );
          const escalations = formDraft?.EscalationPersons?.map(
            (checker) => checker?.ModuleEscalationUser
          );
          // Attempt to read approvers from the draft if backend supplies them
          const approvers = formDraft?.Approvers
            ? formDraft?.Approvers.map((ap) => ap?.ModuleApproverUser)
            : [];
          const tags = formDraft?.FormTags
            ? formDraft?.FormTags.split(",")
            : [];

          const selectedOwners = formDraft?.ModuleOwners?.map(
            (owner) => owner?.UserID
          );

          if (!formDraft?.FormExpiry) {
            setIsSkipFormExpiry(true);
            setFormExpiry(null);
          } else {
            setIsSkipFormExpiry(false);
            setFormExpiry(
              new Date(formDraft?.FormExpiry).toISOString().split("T")[0]
            );
          }
          setFormDraftID(formDraft?.FormModuleDraftID);
          setFormName(formDraft?.FormName);
          setFormDescription(formDraft?.FormDescription);
          setSelectedOwners(selectedOwners);
          setFormStatus(formDraft?.FormIsActive);
          setTags(tags);
          setSelfApproved(formDraft?.SelfApproved);
          setCheckers(checkers);
          setEscalationPersons(escalations);
          setApprovers(approvers); // populate approvers
          setEscalationTimeUnit(formDraft?.EscalationType);
          setEscalationTimeValue(formDraft?.EscalationAfter);
          setDraftAndMasterVersion({
            draftVersion: formDraft?.DraftVersion,
            masterVersion: formDraft?.MasterVersion,
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
      setFormID("");
      fetchFormDraftData();
    } else {
      setSelectedVersion(selectedValue);
      setFormID(selectedValue);

      const selectedVersionObj = formDraftVersion.find(
        (version) => version.FormID === selectedValue
      );

      setDraftAndMasterVersion({
        draftVersion: selectedVersionObj?.DraftVersion,
        masterVersion: selectedVersionObj?.MasterVersion,
      });

      fetchFormDraftData(selectedValue);
    }
  };

  const getOwnerNameById = (id) => {
    const owner = processOwnerList.find((owner) => owner.UserID === id);
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

  const handleCheckboxChange = (event) => {
    setSelfApproved(event.target.checked);
  };

  const handleTagDelete = (tagToDelete) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  const generateTokenForDynamicFormHandler = async (item) => {
    setIsGeneratingToken(true);
    try {
      const permissionPayload = {
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
        FormID: item?.FormID || formID,
        FormModuleDraftID: item?.FormModuleDraftID || formDraftID,
      };

      const permissibleResponse = await verifyUserPermissionToEditForm(
        permissionPayload
      );

      if (permissibleResponse?.status === 200) {
        const response = await generateTokenForDynamicForm(item);
        if (response?.status === 200) {
          return response?.data?.data?.token;
        } else {
          notify("error", response?.data?.message);
          return null;
        }
      } else {
        notify("error", permissibleResponse?.data?.message);
        return null;
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
      return null;
    } finally {
      setIsGeneratingToken(false);
    }
  };

  const fetchCreatedForm = async (FormID) => {
    setFormID(FormID);
    setShowPublishButton(true);
    await listFomrModuleDrafts();
    await fetchFormDraftData(FormID);
    setSelectedVersion(FormID);
    setDisableSaveAndSubmitButton(true);
  };

  const publishDraft = async (formID) => {
    setIsDraftPublishing(true);

    try {
      const body = {
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
        FormID: formID,
      };

      const response = await publishFormModule(body);
      if (response?.status === 200) {
        notify(
          "success",
          response?.data?.message || "InProgress published successfully"
        );

        onClose();
        dispatch(
          GetElementsCategory({
            ModuleTypeID: presistStore?.ModuleTypeID,
            ParentContentID: presistStore?.ContentID,
          })
        );
      } else {
        notify(
          "error",
          response?.data?.message ||
            response?.data?.error ||
            "An error occurred while publishing"
        );
      }
    } catch (error) {
      notify(
        "error",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong"
      );
    } finally {
      setIsDraftPublishing(false);
    }
  };

  // Validation function
  const validate = () => {
    let newErrors = {};

    if (!formName) {
      newErrors.formName = t("errors.FormNameRequired");
    }
    if (selectedOwners.length === 0) {
      newErrors.selectedOwners = t("errors.OwnerRequired");
    }
    if (!selfApproved) {
      if (checkers.length === 0) {
        newErrors.checkers = t("errors.CheckerRequired");
      }
      // Approver required when not self approved
      if (approvers.length === 0) {
        newErrors.approvers =
          t("errors.ApproverRequired") || "Approver is required";
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
    if (!isSkipFormExpiry && !formExpiry) {
      newErrors.formExpiry = t("errors.FormExpiryRequired");
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const onCreateFormHandler = async ({ type = "" }) => {
    // Add security validation checks
    if (!validateInput(formName)) {
      setErrors((prev) => ({
        ...prev,
        formName: "Invalid input detected. Please enter a valid form name.",
      }));
      errorHandler.addSecurityError(formName, "formName");
      return;
    }

    if (formDescription && !validateInput(formDescription)) {
      setErrors((prev) => ({
        ...prev,
        formDescription:
          "Invalid input detected. Please enter a valid description.",
      }));
      errorHandler.addSecurityError(formDescription, "formDescription");
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
        formName,
        formDescription,
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

        const payloadFormExpiry = isSkipFormExpiry ? null : formExpiry;

        const data = {
          ModuleTypeID,
          ContentID,
          FormID: formID,
          FormName: formName,
          FormDescription: formDescription,
          FormOwner: selectedOwners,
          FormIsActive: formStatus,
          FormTags: tags.join(","),
          SelfApproved: selfApproved,
          Checker: checkers.map((checker) => checker?.UserID),
          Approver: approvers.map((a) => a?.UserID), // added approvers
          EscalationPerson: escalationPersons.map(
            (escalation) => escalation?.UserID
          ),
          EscalationType: escalationTimeUnit,
          EscalationAfter: escalationTimeValue,
          FormExpiry: payloadFormExpiry,
        };

        try {
          const response = await createFormModule(data);
          if (response?.status === 201) {
            notify("success", response?.data?.message);
            if (type !== "publishContinue") {
              const FormID = response?.data?.data?.FormID;
              const formModuleDraftID = response?.data?.data?.formModuleDraftID;
              setFormID(FormID);
              setFormDraftID(formModuleDraftID);
              const pathAccessType =
                userType === "ProcessOwner" ? "create" : "invalid";
              const payload = {
                FormID: FormID,
                FormModuleDraftID: formModuleDraftID,
                UserModuleLinkID: null,
                OtherData: {
                  PathAccessType: pathAccessType,
                },
              };

              const token = await generateTokenForDynamicFormHandler(payload);
              if (token) {
                const url = `${FORM_BASE_URL}${pathAccessType}?token=${token}`;
                setTimeout(async () => {
                  checkPopupAndRedirect(url);
                  window.open(url, "_blank");
                  await fetchCreatedForm(FormID);
                }, 1000);
              }
            } else {
              onClose();
            }

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
          console.log("RUNNING ELSE Catch");
          notify(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.error ||
              "An error occurred"
          );
        } finally {
          if (selfApproved) {
            setIsPublishingDocument(false);
          } else {
            setIsSubmittingDocument(false);
          }
        }
      } else {
        notify("error", "Suspicious input detected");
      }
    }
  };

  const listFomrModuleDrafts = async () => {
    setIsFormModuleListFetching(true);
    listFormModuleDraftVersion({
      ModuleTypeID: presistStore?.ModuleTypeID,
      ContentID: presistStore?.ContentID,
    })
      .then((response) => {
        if (response?.status === 200) {
          setFormDraftVersion(response?.data?.data?.formList);
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      })
      .finally(() => {
        setIsFormModuleListFetching(false);
      });
  };

  useEffect(() => {
    // Fetch versions when component loads
    listFomrModuleDrafts();
    // Fetch user list for checkers/escalation persons
    listProcessOwnerAndEndUser()
      .then((response) => {
        if (response?.status === 200) {
          setProcessOwnerAndEndUserList(response?.data?.data?.userList);
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      });
    listProcessOwner()
      .then((response) => {
        if (response?.status === 200) {
          setProcessOwnerList(response?.data?.data?.userList);
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      });
  }, []);

  useEffect(() => {
    if (editFormID) {
      setSelectedVersion(editFormID);
      fetchFormDraftData(editFormID);
    }
  }, [editFormID]);

  const PublishModalContent = () => (
    <>
      <Typography
        id="custom-modal-title"
        variant="h6"
        component="h2"
        align="center"
      >
        {t("publishConfirmation")}
      </Typography>
      <Typography
        id="custom-modal-description"
        sx={{ mt: 2, mb: 3 }}
        align="center"
      >
        {t("createFormReminder")}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-around", mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handlePublishCloseModal}
          disabled={
            isSubmittingDocument || isPublishingDocument || isDraftPublishing
          }
          sx={{ width: "175px" }}
        >
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePublishModalContinue}
          disabled={
            isSubmittingDocument || isPublishingDocument || isDraftPublishing
          }
          sx={{ width: "175px" }}
          startIcon={
            (isSubmittingDocument ||
              isPublishingDocument ||
              isDraftPublishing) && <CircularProgress size={20} />
          }
        >
          {isSubmittingDocument || isPublishingDocument || isDraftPublishing
            ? t("publishing")
            : t("Continue")}
        </Button>
      </Box>
    </>
  );

  const CancelModalContent = () => (
    <>
      <Typography
        id="custom-modal-title"
        variant="h6"
        component="h2"
        align="center"
      >
        {t("cancelConfirmation")}
      </Typography>
      <Typography
        id="custom-modal-description"
        sx={{ mt: 2, mb: 3 }}
        align="center"
      >
        {t("saveDraftOrPublishReminder")}
      </Typography>
      <Box
        sx={{ display: "flex", justifyContent: "space-around", mt: 3, gap: 5 }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            handleCancelCloseModal();
          }}
          disabled={
            isSubmittingDocument || isPublishingDocument || isDraftPublishing
          }
          sx={{ width: "125px" }}
        >
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleCancelCloseModal();
            onClose();
          }}
          disabled={
            isSubmittingDocument || isPublishingDocument || isDraftPublishing
          }
          sx={{ width: "170px" }}
        >
          {t("yesSaved")}
        </Button>
      </Box>
    </>
  );

  return (
    <>
      <Modal open={open}>
        <Box sx={style}>
          <Box
            display="flex"
            alignItems="center"
            gap="10px"
            sx={{
              background:
                bgColor || "linear-gradient(to top, #2C64FF, #4A90E2)",
              margin: "-24px -24px 0",
              padding: "24px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              position: "relative", // Add this for absolute positioning
            }}
          >
            <img src={icon} alt="logo" />
            <Box>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                {t("formManagement")}
              </Typography>
              <Typography variant="body2" sx={{ color: "#fff" }}>
                {t("addEditFormDescription")}
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
                backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2, // Ensure it's above the modal content
              }}
            >
              <CircularProgress />
              <Typography variant="body2" ml={2}>
                {t("fetching_data")}
              </Typography>
            </Box>
          )}
          <FormGroup>
            <FormLabel className="label">
              {" "}
              {t("select_previous_version")}
            </FormLabel>
            <FormControl fullWidth>
              <Select
                value={selectedVersion || ""}
                onChange={handleVersionChange}
                displayEmpty
                className="custom-input-style"
                disabled={isFormModuleListFetching || editFormID}
              >
                <MenuItem value="" disabled>
                  {isFormModuleListFetching ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={20} />{" "}
                      <span>{t("fetching_previous_versions")}...</span>
                    </Box>
                  ) : (
                    t("select_version")
                  )}
                </MenuItem>
                {formDraftVersion && formDraftVersion?.length > 0 && (
                  <MenuItem value="none" disabled={!formID}>
                    Create New
                  </MenuItem>
                )}
                {(formDraftVersion &&
                  formDraftVersion?.length > 0 &&
                  formDraftVersion?.map((version) => (
                    <MenuItem key={version?.FormID} value={version?.FormID}>
                      {version?.FormName}
                    </MenuItem>
                  ))) || <MenuItem disabled>No versions available</MenuItem>}
              </Select>
            </FormControl>
            {formID && (
              <Box display="flex" alignItems="center" gap={5} mt={1}>
                <Typography
                  variant="body2"
                  sx={{ color: "#6B7280", fontWeight: 500 }} // Muted gray for InProgress Version
                >
                  {t("draft_version")}:{" "}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "#3B82F6", fontWeight: 600 }} // Blue for the draft version number
                  >
                    {draftAndMasterVersion?.draftVersion}
                  </Typography>
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "#6B7280", fontWeight: 500 }} // Muted gray for Master Version
                >
                  {t("masterVersion")}:{" "}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: draftAndMasterVersion?.masterVersion
                        ? "#10B981" // Green if master version exists
                        : "#F59E0B", // Amber if not published
                      fontWeight: 600,
                    }}
                  >
                    {draftAndMasterVersion?.masterVersion ||
                      t("notPublishedYet")}
                  </Typography>
                </Typography>
              </Box>
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel className="label">
              {t("formName")}
              <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <TextField
              className="custom-input-style"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              fullWidth
              placeholder={t("enterFormName")}
              error={!!errors.formName}
              helperText={errors.formName}
              InputProps={{
                sx: {
                  fontWeight: "400", // Reduce font weight for input text
                  fontSize: "0.875rem", // Optional: Adjust font size if needed
                },
              }}
              InputLabelProps={{
                sx: {
                  fontWeight: "400", // Reduce font weight for label text
                  fontSize: "0.875rem", // Optional: Adjust font size if needed
                },
              }}
              FormHelperTextProps={{
                sx: {
                  fontWeight: "400", // Reduce font weight for helper text
                  fontSize: "0.75rem", // Optional: Adjust font size if needed
                },
              }}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel className="label"> {t("formDescription")}</FormLabel>
            <TextField
              multiline
              rows={3}
              placeholder={t("enterFormDescription")}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </FormGroup>
          <Box>
            <FormGroup>
              <Typography
                variant="b"
                sx={{
                  fontWeight: 600, // Reduced font weight for label
                  fontSize: "16px", // Optional: Adjusted font size
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
                        width: "100%",
                        fontWeight: 450, // Reduced font weight for input field
                      }}
                    />
                  }
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200, // Limit dropdown height
                        width: 350, // Set dropdown width
                      },
                    },
                  }}
                  sx={{
                    fontSize: "14px", // Adjusted font size for Select input
                    fontWeight: 450, // Reduced font weight for Select input
                  }}
                >
                  {processOwnerList?.length > 0 &&
                    processOwnerList.map((owner) => (
                      <MenuItem
                        key={owner.UserID}
                        value={owner.UserID}
                        sx={{
                          fontSize: "13px", // Adjusted font size for MenuItem
                          fontWeight: 400, // Reduced font weight for MenuItem
                          padding: "8px 12px", // Adjusted padding for MenuItem
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
                      fontWeight: 400, // Reduced font weight for error message
                      fontSize: "13px", // Optional: Adjusted font size
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
                  {selectedOwners?.map((UserID) => (
                    <Chip
                      key={UserID}
                      label={getOwnerNameById(UserID)}
                      onDelete={() => handleOwnerDelete(UserID)}
                      deleteIcon={<Close />}
                      className="owner-chip"
                      sx={{
                        fontWeight: 400, // Reduced font weight for Chip label
                        fontSize: "13px", // Optional: Adjusted font size for Chip
                      }}
                    />
                  ))}
                </Box>
              </FormControl>
            </FormGroup>
          </Box>
          {editFormID && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 3, mb: 2 }}
            >
              <Box display="flex" alignItems="center">
                <Switch
                  checked={formStatus}
                  onChange={() => setFormStatus(!formStatus)}
                />
                <div>
                  <Typography variant="body1" style={{ fontWeight: "500" }}>
                    {t("formStatus")}
                  </Typography>
                  <Typography variant="body2">
                    {" "}
                    {t("changeFormStatus")}
                  </Typography>
                </div>
              </Box>
              {errors.formStatus && (
                <Typography color="error">{errors.formStatus}</Typography>
              )}
              <Box>
                <Typography
                  variant="body2"
                  color={formStatus ? "#15803D" : "#B91C1C"}
                  sx={{
                    bgcolor: formStatus ? "#F0FDF4" : "#FEF2F2",
                    padding: "4px 12px",
                    borderRadius: "16px",
                  }}
                >
                  {formStatus ? t("active") : t("inactive")}
                </Typography>
              </Box>
            </Box>
          )}
          {/* SOP Tags */}
          {/* <Box>
            <FormLabel className="label">{t("formTags")}</FormLabel>
            <Autocomplete
              multiple
              freeSolo
              options={[]} // No predefined options needed
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
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder={t("enterTag")}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault();
                      const newTag = event.target.value.trim();

                      // Add the new tag to the list
                      if (newTag && !tags.includes(newTag)) {
                        setTags((prevTags) => [...prevTags, newTag]);
                      }

                      // Clear the input field after the tag is added
                      setTimeout(() => {
                        event.target.value = ""; // Reset input field after the event is processed
                      }, 0);
                    }

                    // Prevent Backspace from deleting tags
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
          {formID && !isDraftFetching && (
            <Box>
              <FormControlLabel
                sx={{
                  "& .MuiTypography-root": {
                    marginBottom: 0,
                  },
                }}
                control={
                  <Checkbox
                    checked={selfApproved}
                    onChange={handleCheckboxChange}
                    color="primary"
                  />
                }
                label={t("self_approved")}
              />
            </Box>
          )}
          <FormGroup>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <FormLabel className="label">
                {t("formExpiryDate")}{" "}
                {!isSkipFormExpiry && <span style={{ color: "red" }}>*</span>}
              </FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSkipFormExpiry}
                    onChange={(e) => setIsSkipFormExpiry(e.target.checked)}
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
            <TextField
              type="date"
              value={formExpiry}
              onChange={(e) => setFormExpiry(e.target.value)}
              fullWidth
              placeholder="YYYY-MM-DD"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split("T")[0] }}
              disabled={isSkipFormExpiry} // Disable input if "Skip Date" is checked
            />

            {errors.formExpiry && (
              <Typography color="error">{errors.formExpiry}</Typography>
            )}
          </FormGroup>
          <Box>
            <Typography sx={{ ...labelStyle, fontWeight: "600" }}>
              {t("checkerPerson")}{" "}
              <span style={{ color: "red" }}>{!selfApproved ? "*" : ""}</span>
            </Typography>
            <Autocomplete
              disabled={selfApproved}
              multiple
              options={processOwnerAndEndUserList || []} // Entire objects as options
              getOptionLabel={(option) => option?.UserName || ""} // Display username in the dropdown
              isOptionEqualToValue={(option, value) =>
                option?.UserID === value?.UserID
              } // For handling value comparison
              value={checkers} // Map selected UserIDs to their objects
              onChange={(event, newValue) => {
                setCheckers(newValue || []);
                // remove any newly selected checkers from approvers so approvers options and selection never overlap
                setApprovers((prevApprovers) =>
                  (prevApprovers || []).filter(
                    (a) =>
                      !(newValue || []).some((c) => c?.UserID === a?.UserID)
                  )
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder={t("selectCheckers")}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      fontSize: "0.875rem", // Smaller font size for input
                      fontWeight: "normal", // Reduced font weight for input
                    },
                  }}
                />
              )}
            />
            {errors.checkers && (
              <Typography color="error">{errors.checkers}</Typography>
            )}
          </Box>
          {/* Approver block - exclude already selected checkers from options */}
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ ...labelStyle, fontWeight: "600" }}>
              {t("approverPerson") || "Approver"}{" "}
              <span style={{ color: "red" }}>{!selfApproved ? "*" : ""}</span>
            </Typography>
            <Autocomplete
              disabled={selfApproved}
              multiple
              options={(processOwnerAndEndUserList || []).filter(
                (u) => !checkers?.some((c) => c?.UserID === u?.UserID)
              )}
              getOptionLabel={(option) => option?.UserName || ""} // Display username in the dropdown
              isOptionEqualToValue={(option, value) =>
                option?.UserID === value?.UserID
              } // For handling value comparison
              value={approvers} // Map selected UserIDs to their objects
              onChange={(event, newValue) => {
                setApprovers(newValue || []);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder={t("selectApprover") || "Select approver"}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      fontSize: "0.875rem",
                      fontWeight: "normal",
                    },
                  }}
                />
              )}
            />
            {errors.approvers && (
              <Typography color="error">{errors.approvers}</Typography>
            )}
          </Box>
          <Box>
            <Typography sx={{ ...labelStyle, fontWeight: "600" }}>
              {t("escalation_person")}{" "}
              <span style={{ color: "red" }}>{!selfApproved ? "*" : ""}</span>
            </Typography>
            <Autocomplete
              disabled={selfApproved}
              multiple
              options={processOwnerList || []} // Entire objects as options
              getOptionLabel={(option) => option?.UserName || ""} // Display username in the dropdown
              isOptionEqualToValue={(option, value) =>
                option?.UserID === value?.UserID
              } // For handling value comparison
              value={escalationPersons} // Map selected UserIDs to their objects
              onChange={(event, newValue) => {
                setEscalationPersons(newValue); // Save only the UserID of selected options
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder={t("selectEscalationPerson")}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      fontSize: "0.875rem", // Smaller font size for input
                      fontWeight: "normal", // Reduced font weight for input
                    },
                  }}
                />
              )}
            />
            {errors.escalationPersons && (
              <Typography color="error">{errors.escalationPersons}</Typography>
            )}
          </Box>
          <Typography sx={{ ...labelStyle, fontWeight: "600" }}>
            {t("escalation_after")}{" "}
            <span style={{ color: "red" }}>{!selfApproved ? "*" : ""}</span>
          </Typography>
          <Grid container spacing={3}>
            {/* Escalation Time Unit */}
            <Grid item xs={6} md={6}>
              <Box mb={2} sx={{ flex: 1 }}>
                <select
                  value={escalationTimeUnit}
                  onChange={(e) => setEscalationTimeUnit(e.target.value)}
                  style={inputStyle}
                  disabled={selfApproved}
                >
                  <option value="">{t("select")}</option>
                  <option value="Minutes">{t("minutes")}</option>
                  <option value="Hours">{t("hours")}</option>
                  <option value="Days">{t("days")}</option>
                  <option value="Weeks">{t("weeks")}</option>
                  <option value="Months">{t("months")}</option>
                  <option value="Years">{t("years")}</option>
                </select>
                {errors.escalationTimeUnit && (
                  <Typography color="error">
                    {errors.escalationTimeUnit}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Escalation Time Value */}
            <Grid item xs={6} md={6}>
              <Box mb={2} sx={{ flex: 1 }}>
                <input
                  type="number"
                  placeholder="0"
                  value={escalationTimeValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) >= 0) {
                      setEscalationTimeValue(value);
                    }
                  }}
                  style={inputStyle}
                  disabled={selfApproved}
                  min="0"
                  step="1"
                />
                {errors.escalationTimeValue && (
                  <Typography color="error">
                    {errors.escalationTimeValue}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>{" "}
          <div className="actions-wrapper">
            <Button
              variant="outlined"
              fullWidth
              color="secondary"
              onClick={() => {
                if (formID) {
                  handleCancelOpenModal();
                } else {
                  onClose();
                }
              }}
              style={{
                height: "40px",
                borderColor: "#D0D5DD",
                color: "#000",
                textTransform: "none",
                borderRadius: "8px",
                cursor: `${
                  isSubmittingDocument ||
                  isPublishingDocument ||
                  isDraftPublishing ||
                  isGeneratingToken
                    ? "not-allowed"
                    : "pointer"
                }`,
                whiteSpace: "nowrap",
              }}
              disabled={
                isSubmittingDocument ||
                isPublishingDocument ||
                isDraftPublishing ||
                isGeneratingToken
              }
            >
              {t("cancel")}
            </Button>

            {formID && !isDraftFetching && (
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handlePublishOpenModal}
                style={{
                  backgroundColor:
                    isSubmittingDocument ||
                    isPublishingDocument ||
                    isDraftPublishing ||
                    (!showPublishButton && !selfApproved) ||
                    isGeneratingToken
                      ? "#B0B0B0"
                      : "#3D54CD", // Gray when disabled, custom color when enabled
                  color: "#FFFFFF", // Always white text
                  textTransform: "none",
                  height: "40px",
                  borderRadius: "8px",
                  whiteSpace: "nowrap",
                }}
                disabled={
                  isSubmittingDocument ||
                  isPublishingDocument ||
                  isDraftPublishing ||
                  (!showPublishButton && !selfApproved) ||
                  isGeneratingToken
                }
                startIcon={
                  isPublishingDocument || isDraftPublishing ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : null
                }
              >
                {isPublishingDocument || isDraftPublishing
                  ? t("publishing")
                  : t("publish")}
              </Button>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={() => onCreateFormHandler({ type: "" })}
              style={{
                textTransform: "none",
                height: "40px",
                borderRadius: "8px",
                whiteSpace: "nowrap",
              }}
              disabled={
                isSubmittingDocument ||
                isPublishingDocument ||
                selfApproved ||
                isDraftPublishing ||
                disableSaveAndSubmitButton ||
                isGeneratingToken
              }
              startIcon={
                isSubmittingDocument ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : null
              }
              endIcon={<ArrowForwardIosIcon style={{ fontSize: 18 }} />}
            >
              {isSubmittingDocument
                ? t("saving")
                : disableSaveAndSubmitButton
                ? t("saved")
                : t("saveAsDraftAndProceed")}
            </Button>
            {formID && !isDraftFetching && (
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={async () => {
                  setIsEditing(true);
                  const pathAccessType =
                    userType === "ProcessOwner" ? "edit" : "invalid";
                  const payload = {
                    FormModuleDraftID: formDraftID,
                    UserModuleLinkID: null,
                    OtherData: {
                      PathAccessType: pathAccessType,
                    },
                  };

                  const token = await generateTokenForDynamicFormHandler(
                    payload
                  );
                  if (token) {
                    const url = `${FORM_BASE_URL}${pathAccessType}?token=${token}`;
                    checkPopupAndRedirect(url);
                    window.open(url, "_blank");
                    setShowPublishButton(true);
                  }
                  setIsEditing(false);
                }}
                style={{
                  color: "#FFFFFF",
                  textTransform: "none",
                  height: "40px",
                  borderRadius: "8px",
                  whiteSpace: "nowrap",
                }}
                disabled={
                  isSubmittingDocument ||
                  isPublishingDocument ||
                  isDraftPublishing ||
                  isGeneratingToken
                }
                endIcon={<ArrowForwardIosIcon style={{ fontSize: 18 }} />}
                startIcon={
                  isGeneratingToken && isEditing ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : null
                }
              >
                {isGeneratingToken && isEditing
                  ? t("pleaseWait")
                  : t("editForm")}
              </Button>
            )}
          </div>
        </Box>
      </Modal>
      <PopupModal />
      {formID && (
        <CustomFormModalPopup
          isOpen={isPublishModalOpen}
          onClose={handlePublishCloseModal}
          disabled={
            isSubmittingDocument ||
            isPublishingDocument ||
            isDraftPublishing ||
            isGeneratingToken
          }
        >
          <PublishModalContent />
        </CustomFormModalPopup>
      )}
      {formID && (
        <CustomFormModalPopup
          isOpen={isCancelModalOpen}
          onClose={handleCancelCloseModal}
          disabled={
            isSubmittingDocument ||
            isPublishingDocument ||
            isDraftPublishing ||
            isGeneratingToken
          }
        >
          <CancelModalContent />
        </CustomFormModalPopup>
      )}
    </>
  );
};

export default NewFormModal;
NewFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  formID: PropTypes.string,
  editFormID: PropTypes.string,
  onCreateFormHandler: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
};
