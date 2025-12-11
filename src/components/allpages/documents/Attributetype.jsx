import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Autocomplete,
  IconButton,
  styled,
  useTheme,
} from "@mui/material";
import {
  createElementAttributeType,
  listProcessOwner,
  listProcessOwnerAndEndUser,
  ViewElementAttributeType,
} from "../../../services/documentModules/DocumentsModule";
import notify from "../../../assets/svg/utils/toast/Toast";
// import { GetSystemSettings } from "../../../services/settings/Settings";
import { useSelector } from "react-redux";
import plus from "../../../assets/svg/owerside/plus-circle.svg";
import { Close } from "@mui/icons-material";

// Styled components for the dialog header
const style = {
  boxShadow: 24,
  padding: "0", // Changed to 0 to accommodate header styling
};

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: "white",
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.15)",
    transition: "background-color 0.2s ease",
  },
}));
import { t } from "i18next";

const Attributetype = ({
  SelectedRow,
  openforEdit = false,
  onclose,
  fetchList,
  isLoading,
  setSelectedRow,
}) => {
  const [open, setOpen] = useState(false);
  const [reviewers, setReviewers] = useState([]);
  const [processOwnerAndEndUserList, setProcessOwnerAndEndUserList] = useState(
    []
  );
  const [errors, setErrors] = useState({});
  const [SelfApproved, setSelfApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetchingEditData, setIsFetchingData] = useState(false);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;

  const headerStyle = {
    background: bgColor || "linear-gradient(to top, #2C64FF, #4A90E2)",
    padding: "24px",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative", // Add this
    "& .MuiTypography-h6": {
      color: "#FFFFFF",
    },
    "& .MuiTypography-body2": {
      color: "#FFFFFF",
      opacity: 0.9,
    },
  };

  const defaultForm = {
    elementAttributeTypeID: null,
    ModuleTypeID: null,
    Name: "",
    Description: "",
    isReviewMandatory: false,
    IsApproval: false,
    approvers: [],
    reviewers: [],
    stakeholders: [],
    EscalationUsers: [],
    DownloadableUsers: [],
    IsStakeholder: false,
    IsEscalation: false,
    EscalationType: "",
    EscalationAfter: "",
    isDownloadable: false,
    IsExpiry: false,
    ExpiryDate: "",
    IsEmailTrigger: false,
    IsAutoPublish: false,
    ReviewNotificationInterval: 1,
    SelfApproved: false,
    StakeHolderEscalationAfter: " ",
    StakeHolderEscalationType: "",
    StakeHolderEscalationUsers: [],
    IsStakeHolderEscalation: false,
    CoOwnerUserID: [],
  };

  const [formData, setFormData] = useState(defaultForm);

  const getConflictingFields = (currentField) => {
    switch (currentField) {
      case "reviewers":
        return ["approvers", "stakeholders", "EscalationUsers"];
      case "approvers":
        return ["reviewers", "stakeholders"];
      case "stakeholders":
        return ["reviewers", "approvers", "EscalationUsers"];
      case "EscalationUsers":
        return ["reviewers", "stakeholders"];
      case "StakeHolderEscalationUsers":
        return ["stakeholders"];
      default:
        return [];
    }
  };

  const getAllSelectedUsers = (currentField) => {
    const conflictFields = getConflictingFields(currentField);
    return conflictFields.flatMap((field) => formData[field] || []);
  };

  // Function to get available users for a specific dropdown (excluding users selected in other dropdowns)
  const getAvailableUsers = (currentField, userList) => {
    const allSelected = getAllSelectedUsers(currentField);
    const currentSelected = formData[currentField] || [];
    const loginUserId = localStorage.getItem("user_id");
    return userList.filter((user) => {
      // Include if user is not selected in any dropdown, or if user is selected in current dropdown
      return (
        (!allSelected.includes(user.UserID) ||
          currentSelected.includes(user.UserID)) &&
        user.UserID !== loginUserId
      );
    });
  };

  // Function to get available reviewers for revie  wers dropdown
  const getAvailableReviewers = () => {
    return getAvailableUsers("reviewers", reviewers);
  };

  // Function to get available users for stakeholders dropdown
  const getAvailableStakeholders = () => {
    return getAvailableUsers("stakeholders", reviewers);
  };

  // Function to get available users for approvers dropdown
  const getAvailableApprovers = () => {
    return getAvailableUsers("approvers", processOwnerAndEndUserList);
  };

  // Function to get available users for escalation users dropdown
  const getAvailableEscalationUsers = () => {
    return getAvailableUsers("EscalationUsers", reviewers);
  };
  const handleChange = (field, value) => {
    if (Array.isArray(value)) {
      const uniqueValues = [...new Set(value)];
      setFormData((prev) => ({ ...prev, [field]: uniqueValues }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      delete errors[field];
      setErrors(errors);
    }
    if (field === "SelfApproved") {
      setSelfApproved(value);
      if (value) {
        setFormData((prev) => ({
          ...prev,
          isReviewMandatory: false,
          IsApproval: false,
          approvers: [],
          reviewers: [],
          stakeholders: [],
          EscalationUsers: [],
          DownloadableUsers: [],
          IsStakeholder: false,
          IsEscalation: false,
          EscalationType: "",
          EscalationAfter: "",
          isDownloadable: false,
          IsEmailTrigger: false,
          IsAutoPublish: false,
          ReviewNotificationInterval: 1,
          StakeHolderEscalationAfter: "",
          StakeHolderEscalationType: "",
          StakeHolderEscalationUsers: [],
          IsStakeHolderEscalation: false,
        }));
        if (errors.isReviewMandatory) {
          delete errors.isReviewMandatory;
        }
        if (errors.IsApproval) {
          delete errors.IsApproval;
        }
        if (errors.stakeholders) {
          delete errors.stakeholders;
        }
        if (errors.IsStakeholder) {
          delete errors.IsStakeholder;
        }
        if (errors.approvers) {
          delete errors.approvers;
        }
      }
    }
  };

  const handleSubmit = async () => {
    let newErrors = {};
    if (!formData.Name.trim()) newErrors.Name = "Name is required.";
    if (!SelfApproved) {
      if (!formData.isReviewMandatory)
        newErrors.isReviewMandatory = "Review is mandatory.";
      if (formData.reviewers.length === 0 && formData.isReviewMandatory)
        newErrors.reviewers = "Please select at least one reviewer.";
      if (!formData.IsApproval) {
        newErrors.IsApproval = "Approval is mandatory.";
      }
      if (formData.approvers.length === 0 && formData.IsApproval)
        newErrors.approvers = "Please select at least one approver.";
      if (
        !formData.IsStakeholder &&
        presistStore.ModuleTypeID === "8db6ea3c-475d-47b7-8d4d-918de1889ef5"
      )
        newErrors.IsStakeholder = "Stakeholder is mandatory.";
      if (formData.stakeholders.length === 0 && formData.IsStakeholder)
        newErrors.stakeholders = "Please select at least one stakeholder.";
    }
    if (!formData.IsExpiry) {
      if (!formData.ExpiryDate)
        newErrors.ExpiryDate = "Expiry date is required.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    const payload = {
      ElementAttributeTypeID: SelectedRow || null,
      ModuleTypeID: presistStore.ModuleTypeID || null,
      Name: formData.Name,
      Description: formData.Description,
      IsReview: formData.isReviewMandatory,
      IsApproval: formData.IsApproval,
      IsStakeholder: formData.IsStakeholder,
      IsEscalation: formData.IsEscalation,
      EscalationType: formData.EscalationType || null,
      EscalationAfter: parseInt(formData.EscalationAfter) || null,
      IsDownloadable: formData.isDownloadable || false,
      IsExpiry: !formData.IsExpiry ? true : false,
      ExpiryDate: !formData.IsExpiry ? formData.ExpiryDate : null,
      IsEmailTrigger: formData.IsEmailTrigger,
      IsAutoPublish: formData.IsAutoPublish,
      ReviewNotificationInterval:
        parseInt(formData.ReviewNotificationInterval) || null,
      Approvers: formData.approvers || [],
      Reviewers: formData.reviewers || [],
      Stakeholders: formData.stakeholders || [],
      EscalationUsers: formData.EscalationUsers || [],
      DownloadableUsers: formData.DownloadableUsers || [],
      SelfApproved: SelfApproved,
      StakeHolderEscalationAfter: formData.StakeHolderEscalationAfter || null,
      StakeHolderEscalationType: formData.StakeHolderEscalationType || null,
      StakeHolderEscalationUsers: formData.StakeHolderEscalationUsers || [],
      IsStakeHolderEscalation: formData.IsStakeHolderEscalation || false,
      NeedAcceptance: formData.NeedAcceptance,
      NeedAcceptanceForApprover: formData.NeedAcceptanceForApprover || false,
      NeedAcceptanceFromStakeHolder:
        formData.NeedAcceptanceFromStakeHolder || false,
      CoOwnerUserID: formData.CoOwnerUserID || [],
    };
    try {
      const res = await createElementAttributeType(payload);
      if (res?.status === 201 || res?.status === 200) {
        fetchList();
        notify("success", res.data.message);
        setFormData(defaultForm);
        setErrors({});
        onclose();
        setOpen(false);
      } else {
        notify("error", res.data.message || "Failed to create attribute type.");
      }
    } catch (error) {
      console.log(error);
      notify("error", error || "Failed to create attribute type.");
    } finally {
      setLoading(false);
    }
  };

  const FetchlistProcessOwnerAndEndUser = async () => {
    try {
      const response = await listProcessOwnerAndEndUser();
      if (response?.status === 200) {
        setProcessOwnerAndEndUserList(response?.data?.data?.userList || []);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    }
  };

  const fetchReviewers = async () => {
    try {
      const response = await listProcessOwner();
      if (response?.status === 200) {
        setReviewers(response.data?.data?.userList || []);
      }
    } catch (error) {
      notify(
        "error",
        error?.response?.data?.message || "Failed to load reviewers."
      );
    }
  };

  useEffect(() => {
    fetchReviewers();
    FetchlistProcessOwnerAndEndUser();
  }, []);

  const getReviewerNameById = (id) => {
    const reviewer = reviewers.find((r) => r.UserID === id);
    const userDetail = reviewer?.UserDetail;

    if (!reviewer) return id;

    const userName = reviewer.UserName || "";
    const firstName = userDetail?.UserFirstName || "";
    const lastName = userDetail?.UserLastName || "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName ? `${userName} (${fullName})` : userName || id;
  };

  const getProcessOwnerOrEndUserNameById = (id) => {
    const user = processOwnerAndEndUserList.find((u) => u.UserID === id);
    const userDetail = user?.UserDetail;

    if (!user) return id;

    const userName = user.UserName || "";
    const firstName = userDetail?.UserFirstName || "";
    const lastName = userDetail?.UserLastName || "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName ? `${userName} (${fullName})` : userName || id;
  };

  const fetcheditData = async () => {
    setIsFetchingData(true);
    try {
      const response = await ViewElementAttributeType({
        ElementAttributeTypeID: SelectedRow,
      });
      if (response?.status === 200) {
        const { elementAttribute } = response.data.data;
        setSelfApproved(elementAttribute.SelfApproved);
        console.log("Submitting form data:", elementAttribute);

        setFormData({
          elementAttributeTypeID: elementAttribute.elementAttributeTypeID,
          ModuleTypeID: elementAttribute.ModuleTypeID,
          Name: elementAttribute.Name,
          Description: elementAttribute.Description,
          EscalationType: elementAttribute.EscalationType,
          EscalationAfter: elementAttribute.EscalationAfter,
          IsEmailTrigger: elementAttribute.IsEmailTrigger,
          IsAutoPublish: elementAttribute.IsAutoPublish,
          IsExpiry: !elementAttribute.IsExpiry, // Fix: set IsExpiry as boolean
          IsDownloadable: elementAttribute.IsDownloadable,
          ExpiryDate: elementAttribute.ExpiryDate
            ? elementAttribute.ExpiryDate.split("T")[0]
            : "", // Fix: show date if exists
          ReviewNotificationType: elementAttribute.ReviewNotificationType,
          ReviewNotificationInterval:
            elementAttribute.ReviewNotificationInterval,
          isReviewMandatory: elementAttribute.IsReview,
          reviewers: elementAttribute.Reviewers || [],
          approvers: elementAttribute.Approvers || [],
          stakeholders: elementAttribute.Stakeholders || [],
          EscalationUsers: elementAttribute.EscalationUsers || [],
          DownloadableUsers: elementAttribute.DownloadableUsers || [],
          IsApproval: elementAttribute.IsApproval,
          IsEscalation: elementAttribute.IsEscalation,
          IsStakeholder: elementAttribute.IsStakeholder,
          SelfApproved: elementAttribute.SelfApproved,
          IsStakeHolderEscalation:
            elementAttribute.IsStakeHolderEscalation || false,
          StakeHolderEscalationAfter:
            elementAttribute.StakeHolderEscalationAfter || "",
          StakeHolderEscalationType:
            elementAttribute.StakeHolderEscalationType || "",
          StakeHolderEscalationUsers:
            elementAttribute.StakeHolderEscalationUsers || [],
          NeedAcceptance: elementAttribute.NeedAcceptance || false,
          NeedAcceptanceForApprover:
            elementAttribute.NeedAcceptanceForApprover || false,
          NeedAcceptanceFromStakeHolder:
            elementAttribute.NeedAcceptanceFromStakeHolder,
          CoOwnerUserID: elementAttribute.CoOwnerUserID || [],
        });
      } else {
        notify("error", response.data.message || "Failed to fetch data.");
        onclose();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error fetching edit data:", error);
      onclose();
      setOpen(false);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    if (SelectedRow && openforEdit) {
      fetcheditData();
      setOpen(true);
    }
    setOpen(openforEdit);
    setFormData(defaultForm);
  }, [SelectedRow, openforEdit]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
            setSelectedRow(null);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          disabled={isLoading}
        >
          <span>{t("add")}</span>
          <img
            src={plus}
            alt=""
            style={{
              height: "20px",
              width: "20px",
            }}
          />
        </Button>
      </div>

      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2, // equivalent to 24px (1 unit = 8px)
          },
        }}
      >
        <Box sx={style}>
          <Box sx={headerStyle}>
            <Typography variant="h6">
              {SelectedRow ? t("editAttributeType") : t("createAttributeType")}
            </Typography>
            <CloseButton
              aria-label="close"
              onClick={() => {
                setOpen(false);
                onclose();
                setFormData(defaultForm);
              }}
            >
              <Close />
            </CloseButton>
          </Box>
          <DialogContent
            dividers
            sx={{
              maxHeight: "70vh",
              overflowY: "auto",
              pt: 2,
              padding: 2,
            }}
          >
            <>
              {isFetchingEditData ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "70vh",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label={t("name")}
                        fullWidth
                        margin="normal"
                        value={formData.Name}
                        onChange={(e) => handleChange("Name", e.target.value)}
                        error={!!errors.Name}
                        helperText={errors.Name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label={t("description")}
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={formData.Description}
                        onChange={(e) =>
                          handleChange("Description", e.target.value)
                        }
                        error={!!errors.Description}
                        helperText={errors.Description}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData?.SelfApproved}
                              onChange={(event) => {
                                handleChange(
                                  "SelfApproved",
                                  event.target.checked
                                );
                              }}
                              color="primary"
                            />
                          }
                          label={t("self_approved")}
                        />
                      </Box>
                    </Grid>
                    {presistStore?.ModuleTypeID ===
                    "8db6ea3c-475d-47b7-8d4d-918de1889ef5" ? (
                      <Grid item xs={12}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled={formData?.SelfApproved}
                                checked={formData.IsStakeholder || false}
                                onChange={(e) =>
                                  handleChange(
                                    "IsStakeholder",
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label={t("co-creators")}
                          />
                          {formData.IsStakeholder && (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  color="primary"
                                  checked={
                                    formData.NeedAcceptanceFromStakeHolder
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      "NeedAcceptanceFromStakeHolder",
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label="Need Acceptance From All"
                              labelPlacement="start"
                              sx={{ marginRight: 0 }}
                              disabled={formData?.SelfApproved}
                            />
                          )}
                        </Box>
                        {errors.IsStakeholder && (
                          <Typography color="error" variant="caption">
                            {errors.IsStakeholder}
                          </Typography>
                        )}
                        <Grid container spacing={2}>
                          {formData.IsStakeholder && (
                            <>
                              <Grid item xs={12}>
                                <FormControl fullWidth margin="normal">
                                  <Autocomplete
                                    multiple
                                    disabled={formData?.SelfApproved}
                                    options={getAvailableStakeholders() || []}
                                    getOptionLabel={(option) =>
                                      option?.UserName ||
                                      `${
                                        option?.UserDetail?.UserFirstName || ""
                                      } ${
                                        option?.UserDetail?.UserLastName || ""
                                      }`
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                      option?.UserID === value
                                    }
                                    value={
                                      getAvailableStakeholders()?.filter(
                                        (user) =>
                                          formData?.stakeholders?.includes(
                                            user.UserID
                                          )
                                      ) || []
                                    }
                                    onChange={(event, newValue) => {
                                      const selectedIds = newValue.map(
                                        (user) => user.UserID
                                      );
                                      handleChange("stakeholders", selectedIds);
                                    }}
                                    renderTags={(selected, getTagProps) =>
                                      selected.map((option, index) => (
                                        <Chip
                                          key={option.UserID}
                                          label={
                                            getReviewerNameById(
                                              option.UserID
                                            ) ||
                                            `${
                                              option?.UserDetail
                                                ?.UserFirstName || ""
                                            } ${
                                              option?.UserDetail
                                                ?.UserLastName || ""
                                            }`
                                          }
                                          {...getTagProps({ index })}
                                        />
                                      ))
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="outlined"
                                        label={t("SelectStakeholders")}
                                        placeholder={t(
                                          "ChooseStakeholdersPlaceholder"
                                        )}
                                      />
                                    )}
                                  />
                                </FormControl>
                                {errors.stakeholders && (
                                  <Typography color="error" variant="caption">
                                    {errors.stakeholders}
                                  </Typography>
                                )}
                              </Grid>

                              <Grid item xs={12}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={formData.IsStakeHolderEscalation}
                                      disabled={formData?.SelfApproved}
                                      onChange={(e) =>
                                        handleChange(
                                          "IsStakeHolderEscalation",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label={t("escalationRequiredLabel")}
                                />
                              </Grid>
                              {formData?.IsStakeHolderEscalation && (
                                <>
                                  <Grid item sm={12}>
                                    <FormControl fullWidth margin="normal">
                                      <Autocomplete
                                        multiple
                                        disabled={formData?.SelfApproved}
                                        options={
                                          // use process owner / end user list filtered for stakeholder escalation
                                          getAvailableUsers(
                                            "StakeHolderEscalationUsers",
                                            processOwnerAndEndUserList
                                          ) || []
                                        }
                                        getOptionLabel={(option) =>
                                          option?.UserName ||
                                          `${
                                            option?.UserDetail?.UserFirstName ||
                                            ""
                                          } ${
                                            option?.UserDetail?.UserLastName ||
                                            ""
                                          }`
                                        }
                                        // compare by UserID with value object safety
                                        isOptionEqualToValue={(option, value) =>
                                          option?.UserID === value?.UserID
                                        }
                                        value={
                                          processOwnerAndEndUserList?.filter(
                                            (user) =>
                                              formData?.StakeHolderEscalationUsers?.includes(
                                                user.UserID
                                              )
                                          ) || []
                                        }
                                        onChange={(event, newValue) => {
                                          const selectedIds = newValue.map(
                                            (user) => user.UserID
                                          );
                                          handleChange(
                                            "StakeHolderEscalationUsers",
                                            selectedIds
                                          );
                                        }}
                                        renderTags={(selected, getTagProps) =>
                                          selected.map((option, index) => (
                                            <Chip
                                              key={option.UserID}
                                              label={
                                                getProcessOwnerOrEndUserNameById(
                                                  option.UserID
                                                ) ||
                                                `${
                                                  option?.UserDetail
                                                    ?.UserFirstName || ""
                                                } ${
                                                  option?.UserDetail
                                                    ?.UserLastName || ""
                                                }`
                                              }
                                              {...getTagProps({ index })}
                                            />
                                          ))
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            variant="outlined"
                                            label={t("EscalationUsers")}
                                            placeholder={t(
                                              "ChooseUsersPlaceholder"
                                            )}
                                          />
                                        )}
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <FormControl fullWidth>
                                      <InputLabel id="stake-holder-escalation-time-unit-label">
                                        {t("StakeholderEscalationTimeUnit")}{" "}
                                      </InputLabel>
                                      <Select
                                        id="stake-holder-escalation-time-unit-label"
                                        label={t(
                                          "StakeholderEscalationTimeUnit"
                                        )}
                                        value={
                                          formData?.StakeHolderEscalationType
                                        }
                                        onChange={(e) =>
                                          handleChange(
                                            "StakeHolderEscalationType",
                                            e.target.value
                                          )
                                        }
                                        disabled={formData?.SelfApproved}
                                      >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="Hours">Hours</MenuItem>
                                        <MenuItem value="Days">Days</MenuItem>
                                      </Select>
                                      {errors.StakeHolderEscalationType && (
                                        <Typography
                                          color="error"
                                          variant="caption"
                                        >
                                          {errors.StakeHolderEscalationType}
                                        </Typography>
                                      )}
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <TextField
                                      fullWidth
                                      type="number"
                                      label={t(
                                        "StakeholderEscalationTimeValueLabel"
                                      )}
                                      value={
                                        formData?.StakeHolderEscalationAfter
                                      }
                                      onChange={(e) => {
                                        if (e.target.value > 0) {
                                          handleChange(
                                            "StakeHolderEscalationAfter",
                                            e.target.value
                                          );
                                        }
                                      }}
                                      inputProps={{ min: 0, step: 1 }}
                                      disabled={formData?.SelfApproved}
                                      error={
                                        !!errors.StakeHolderEscalationAfter
                                      }
                                      helperText={
                                        errors.StakeHolderEscalationAfter
                                      }
                                    />
                                  </Grid>
                                </>
                              )}
                            </>
                          )}
                        </Grid>
                      </Grid>
                    ) : null}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={formData?.SelfApproved}
                            checked={formData.isReviewMandatory}
                            onChange={(e) => {
                              handleChange(
                                "isReviewMandatory",
                                e.target.checked
                              );
                            }}
                          />
                        }
                        label={t("Is review mandatory?")}
                      />
                      {errors.isReviewMandatory && (
                        <Typography color="error" variant="caption">
                          {errors.isReviewMandatory}
                        </Typography>
                      )}
                      {formData.isReviewMandatory && (
                        <>
                          <Grid item xs={12}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography sx={{ fontWeight: "600" }}>
                                {t("reviewers")}{" "}
                                <span style={{ color: "red" }}>
                                  {!formData?.SelfApproved ? "*" : ""}
                                </span>
                              </Typography>

                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="primary"
                                    checked={formData.NeedAcceptance}
                                    onChange={(e) =>
                                      handleChange(
                                        "NeedAcceptance",
                                        e.target.checked
                                      )
                                    }
                                    disabled={formData?.SelfApproved}
                                  />
                                }
                                label={t("need_acceptance_from_all")}
                                labelPlacement="start"
                                sx={{ marginRight: 0 }}
                              />
                            </Box>
                            <FormControl fullWidth margin="normal">
                              <Autocomplete
                                multiple
                                disabled={formData?.SelfApproved}
                                options={getAvailableReviewers() || []}
                                getOptionLabel={(option) =>
                                  option?.UserName ||
                                  `${option?.UserDetail?.UserFirstName || ""} ${
                                    option?.UserDetail?.UserLastName || ""
                                  }`
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option?.UserID === value
                                }
                                value={
                                  getAvailableReviewers()?.filter((user) =>
                                    formData?.reviewers?.includes(user.UserID)
                                  ) || []
                                }
                                onChange={(event, newValue) => {
                                  const selectedIds = newValue.map(
                                    (user) => user.UserID
                                  );
                                  handleChange("reviewers", selectedIds);
                                }}
                                renderTags={(selected, getTagProps) =>
                                  selected.map((option, index) => (
                                    <Chip
                                      key={option.UserID}
                                      label={
                                        getReviewerNameById(option.UserID) ||
                                        `${
                                          option?.UserDetail?.UserFirstName ||
                                          ""
                                        } ${
                                          option?.UserDetail?.UserLastName || ""
                                        }`
                                      }
                                      {...getTagProps({ index })}
                                    />
                                  ))
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    label={t("selectReviewersLabel")}
                                    placeholder={t(
                                      "chooseReviewersPlaceholder"
                                    )}
                                  />
                                )}
                              />
                            </FormControl>
                            {errors.reviewers && (
                              <Typography color="error" variant="caption">
                                {errors.reviewers}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.IsEscalation}
                                  disabled={formData?.SelfApproved}
                                  onChange={(e) =>
                                    handleChange(
                                      "IsEscalation",
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label={t("escalationRequiredLabel")}
                            />
                          </Grid>

                          {formData.IsEscalation && (
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <FormControl fullWidth margin="normal">
                                  <Autocomplete
                                    multiple
                                    disabled={formData?.SelfApproved}
                                    options={
                                      getAvailableEscalationUsers() || []
                                    }
                                    getOptionLabel={(option) =>
                                      option?.UserName ||
                                      `${
                                        option?.UserDetail?.UserFirstName || ""
                                      } ${
                                        option?.UserDetail?.UserLastName || ""
                                      }`
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                      option?.UserID === value
                                    }
                                    value={
                                      reviewers?.filter((user) =>
                                        formData?.EscalationUsers?.includes(
                                          user.UserID
                                        )
                                      ) || []
                                    }
                                    onChange={(event, newValue) => {
                                      const selectedIds = newValue.map(
                                        (user) => user.UserID
                                      );
                                      handleChange(
                                        "EscalationUsers",
                                        selectedIds
                                      );
                                    }}
                                    renderTags={(selected, getTagProps) =>
                                      selected.map((option, index) => (
                                        <Chip
                                          key={option.UserID}
                                          label={
                                            option?.UserName ||
                                            `${
                                              option?.UserDetail
                                                ?.UserFirstName || ""
                                            } ${
                                              option?.UserDetail
                                                ?.UserLastName || ""
                                            }`
                                          }
                                          {...getTagProps({ index })}
                                        />
                                      ))
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="outlined"
                                        label={t("EscalationUsers")}
                                        placeholder={t(
                                          "ChooseUsersPlaceholder"
                                        )}
                                      />
                                    )}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined">
                                  <InputLabel id="escalation-time-unit-label">
                                    {t("EscalationTimeUnit")}
                                  </InputLabel>
                                  <Select
                                    labelId="escalation-time-unit-label"
                                    id="escalation-time-unit"
                                    label={t("EscalationTimeUnit")}
                                    value={formData.EscalationType}
                                    onChange={(e) =>
                                      handleChange(
                                        "EscalationType",
                                        e.target.value
                                      )
                                    }
                                    disabled={formData?.SelfApproved}
                                  >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="Hours">Hours</MenuItem>
                                    <MenuItem value="Days">Days</MenuItem>
                                  </Select>
                                  {errors.EscalationType && (
                                    <Typography color="error" variant="caption">
                                      {errors.EscalationType}
                                    </Typography>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label={t("EscalationTimeValueLabel")}
                                  value={formData.EscalationAfter}
                                  onChange={(e) => {
                                    if (e.target.value > 0) {
                                      handleChange(
                                        "EscalationAfter",
                                        e.target.value
                                      );
                                    }
                                  }}
                                  inputProps={{ min: 0, step: 1 }}
                                  disabled={formData?.SelfApproved}
                                  error={!!errors.EscalationAfter}
                                  helperText={errors.EscalationAfter}
                                />
                              </Grid>
                            </Grid>
                          )}
                        </>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.IsApproval}
                            disabled={formData?.SelfApproved}
                            onChange={(e) =>
                              handleChange("IsApproval", e.target.checked)
                            }
                          />
                        }
                        label={t("Is approval mandatory?")}
                      />
                      {errors.IsApproval && (
                        <Typography color="error" variant="caption">
                          {errors.IsApproval}
                        </Typography>
                      )}

                      {formData.IsApproval && (
                        <Grid item xs={12}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography sx={{ fontWeight: "600" }}>
                              {t("approvars")}{" "}
                              <span style={{ color: "red" }}>
                                {!formData?.SelfApproved ? "*" : ""}
                              </span>
                            </Typography>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  color="primary"
                                  checked={formData.NeedAcceptanceForApprover}
                                  onChange={(e) =>
                                    handleChange(
                                      "NeedAcceptanceForApprover",
                                      e.target.checked
                                    )
                                  }
                                  disabled={formData?.SelfApproved}
                                />
                              }
                              label={t("need_acceptance_from_all")}
                              labelPlacement="start"
                              sx={{ marginRight: 0 }}
                            />
                          </Box>
                          <FormControl fullWidth margin="normal">
                            <Autocomplete
                              multiple
                              disabled={formData?.SelfApproved}
                              options={getAvailableApprovers() || []}
                              getOptionLabel={(option) =>
                                option?.UserName ||
                                `${option?.UserDetail?.UserFirstName || ""} ${
                                  option?.UserDetail?.UserLastName || ""
                                }`
                              }
                              isOptionEqualToValue={(option, value) =>
                                option?.UserID === value
                              }
                              value={
                                getAvailableApprovers()?.filter((user) =>
                                  formData?.approvers?.includes(user.UserID)
                                ) || []
                              }
                              onChange={(event, newValue) => {
                                const selectedIds = newValue.map(
                                  (user) => user.UserID
                                );
                                handleChange("approvers", selectedIds);
                              }}
                              renderTags={(selected, getTagProps) =>
                                selected.map((option, index) => (
                                  <Chip
                                    key={option.UserID}
                                    label={
                                      getProcessOwnerOrEndUserNameById(
                                        option.UserID
                                      ) ||
                                      `${
                                        option?.UserDetail?.UserFirstName || ""
                                      } ${
                                        option?.UserDetail?.UserLastName || ""
                                      }`
                                    }
                                    {...getTagProps({ index })}
                                  />
                                ))
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  label={t("selectApproversLabel")}
                                  placeholder={t("chooseApproversPlaceholder")}
                                />
                              )}
                            />
                          </FormControl>
                          {errors.approvers && (
                            <Typography color="error" variant="caption">
                              {errors.approvers}
                            </Typography>
                          )}
                        </Grid>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.IsExpiry || false}
                              onChange={(e) =>
                                handleChange("IsExpiry", e.target.checked)
                              }
                            />
                          }
                          label={t("Does document have no expiry?")}
                        />
                      </FormGroup>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        type="date"
                        value={formData.ExpiryDate || ""}
                        onChange={(e) =>
                          handleChange("ExpiryDate", e.target.value)
                        }
                        fullWidth
                        placeholder="YYYY-MM-DD"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: new Date().toISOString().split("T")[0],
                        }}
                        disabled={formData.IsExpiry}
                      />
                      {errors.ExpiryDate && (
                        <Typography color="error" variant="caption">
                          {errors.ExpiryDate}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="number"
                        label={t("reviewNotificationDays")}
                        value={formData.ReviewNotificationInterval}
                        disabled={formData?.SelfApproved}
                        onChange={(e) =>
                          handleChange(
                            "ReviewNotificationInterval",
                            e.target.value
                          )
                        }
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                  </Grid>
                  <Grid>
                    <FormControl fullWidth margin="normal">
                      <Typography sx={{ fontWeight: "600" }}>
                        {t("co owner")}
                      </Typography>
                      <Autocomplete
                        multiple
                        disabled={formData?.SelfApproved}
                        options={getAvailableStakeholders() || []}
                        getOptionLabel={(option) =>
                          option?.UserName ||
                          `${option?.UserDetail?.UserFirstName || ""} ${
                            option?.UserDetail?.UserLastName || ""
                          }`
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.UserID === value
                        }
                        value={
                          reviewers?.filter((user) =>
                            formData?.CoOwnerUserID?.includes(user.UserID)
                          ) || []
                        }
                        onChange={(event, newValue) => {
                          const selectedIds = newValue.map(
                            (user) => user.UserID
                          );
                          handleChange("CoOwnerUserID", selectedIds);
                        }}
                        renderTags={(selected, getTagProps) =>
                          selected.map((option, index) => (
                            <Chip
                              key={option.UserID}
                              label={
                                getReviewerNameById(option.UserID) ||
                                `${option?.UserDetail?.UserFirstName || ""} ${
                                  option?.UserDetail?.UserLastName || ""
                                }`
                              }
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={t("Co-Creation")}
                            placeholder={t("ChooseStakeholdersPlaceholder")}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                </DialogContent>
              )}
            </>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                setOpen(false);
                onclose();
                setFormData(defaultForm);
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? t("submitting") : t("submit")}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default Attributetype;
