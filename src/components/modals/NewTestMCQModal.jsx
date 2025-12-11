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
import { useEffect, useState } from "react";
import icon from "../../assets/svg/sopsModal/modalIcon.svg";
import {
  listProcessOwner,
  listProcessOwnerAndEndUser,
  listTestMCQModuleDraftVersion,
  viewTestMCQModuleDraft,
} from "../../services/testMcqModules/TestMcqModules";
import { useDispatch, useSelector } from "react-redux";
import notify from "../../assets/svg/utils/toast/Toast";
import { useNavigate } from "react-router";
import { Close } from "@mui/icons-material";
import { setTestData } from "../../store/mcqtestslice/testSlice";
import { validateAndSanitizeInputs } from "../../utils";
import { frontendState } from "../../store/presist/action";
import repotApis from "../../services/reportModules";
import { styled } from "@mui/material";
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
  width: "95%",
  maxWidth: 1200, // Increased width significantly
  maxHeight: "95vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "24px",
  borderRadius: "12px",
  outline: "none",
};

const labelStyle = {
  marginBottom: "8px",
  fontWeight: "600",
};

const CustomTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontWeight: 400,
  },
});

const NewTestMCQModal = ({ open, onClose, editTestMCQID = null }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const [testMCQID, setTestMCQID] = useState(editTestMCQID);
  const [testMCQDraftID, setTestMCQDraftID] = useState(null);
  const [testMCQName, setTestMCQName] = useState("");
  const [testMCQDescription, setTestMCQDescription] = useState("");
  const [testMCQStatus, setTestMCQStatus] = useState(true);
  const [tags, setTags] = useState([]);
  const [selfApproved, setSelfApproved] = useState(true);
  const [checkers, setCheckers] = useState([]);
  const [escalationPersons, setEscalationPersons] = useState([]);
  const [escalationTimeUnit, setEscalationTimeUnit] = useState("");
  const [escalationTimeValue, setEscalationTimeValue] = useState("");
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [setProcessOwnerAndEndUserList] = useState([]);
  const [documentDraftVersion, setDocumentDraftVersion] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [draftAndMasterVersion, setDraftAndMasterVersion] = useState({});
  const [isDraftFetching, setIsDraftFetching] = useState(false);
  const [numberOfAttempts, setNumberOfAttempts] = useState(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(null);
  const [passPercentage, setPassPercentage] = useState(null);
  const [TestMCQExpiry, setTestMCQExpiry] = useState(null);
  const [questionAndAnswersList, setQuestionAndAnswersList] = useState([]);
  const [isDocumentModuleListFetching, setIsDocumentModuleListFetching] =
    useState(false);
  const [isSkipTestMCQExpiry, setIsSkipTestMCQExpiry] = useState(false);
  const [processOwnerList, setProcessOwnerList] = useState([]);
  const [timeLimit, setTimeLimit] = useState("");
  const [minimumTime, setMinimumTime] = useState(""); // New minimum time field
  const [needAcceptance] = useState(false);
  const [elementDropdown, setElementDropdown] = useState([]);
  const [linkMCQ, setLinkMCQ] = useState("");
  const [errors, setErrors] = useState({});

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchElements = async () => {
      try {
        const payload = {
          ModuleTypeID: presistStore?.ModuleTypeID,
        };

        console.log("Payload sent:", payload);

        const elements = await repotApis.getElementsDropdownOption(payload);
        console.log("APIResponseTestsimu:", elements);

        setElementDropdown(elements);
      } catch (error) {
        console.error("Failed to fetch elements", error);
      }
    };

    fetchElements();
  }, []);

  const fetchTestMCQDraftData = async (testMCQID = null) => {
    if (!testMCQID) {
      setTestMCQID(null);
      setTestMCQDraftID(null);
      setTestMCQName("");
      setTestMCQDescription("");
      setSelectedOwners([]);
      setTestMCQStatus(false);
      setTags([]);
      setSelfApproved(false);
      setCheckers([]);
      setEscalationPersons([]);
      setEscalationTimeUnit("");
      setEscalationTimeValue("");
      setNumberOfAttempts("");
      setNumberOfQuestions("");
      setPassPercentage("");
      setQuestionAndAnswersList([]);
      setDraftAndMasterVersion({});
      setTestMCQExpiry(null);
      setIsSkipTestMCQExpiry(false);
      setMinimumTime(""); // Reset minimum time
    } else {
      const data = {
        TestMCQID: testMCQID,
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      };
      setIsDraftFetching(true);
      try {
        const response = await viewTestMCQModuleDraft(data);
        if (response?.status === 200) {
          const testMCQDraft = response?.data?.data?.testMCQModuleDraft;
          const checkers = testMCQDraft?.Checkers?.map(
            (checker) => checker?.ModuleCheckerUser
          );
          const escalations = testMCQDraft?.EscalationPersons?.map(
            (checker) => checker?.ModuleEscalationUser
          );
          const tags = testMCQDraft?.TestMCQTags
            ? testMCQDraft?.TestMCQTags.split(",")
            : [];
          const selectedOwners = testMCQDraft?.ModuleOwners?.map(
            (owner) => owner?.UserID
          );

          setTimeLimit(testMCQDraft?.TimeLimite || "");
          setMinimumTime(testMCQDraft?.MinimumTime || ""); // Set minimum time from draft
          setTestMCQExpiry(testMCQDraft?.TestMCQExpiry || null);
          setIsSkipTestMCQExpiry(!testMCQDraft?.TestMCQExpiry);
          setTestMCQDraftID(testMCQDraft?.TestMCQDraftID);
          setTestMCQName(testMCQDraft?.TestMCQName);
          setTestMCQDescription(testMCQDraft?.TestMCQDescription);
          setSelectedOwners(selectedOwners);
          setTestMCQStatus(testMCQDraft?.TestMCQIsActive);
          setTags(tags);
          setSelfApproved(testMCQDraft?.SelfApproved);
          setCheckers(checkers);
          setEscalationPersons(escalations);
          setEscalationTimeUnit(testMCQDraft?.EscalationType);
          setEscalationTimeValue(testMCQDraft?.EscalationAfter);
          setNumberOfAttempts(testMCQDraft?.TotalAttempts);
          setNumberOfQuestions(testMCQDraft?.TotalQuestions);
          setPassPercentage(testMCQDraft?.PassPercentage);
          setQuestionAndAnswersList(testMCQDraft?.QuestionsAndAnswers);
          setDraftAndMasterVersion({
            draftVersion: testMCQDraft?.DraftVersion,
            masterVersion: testMCQDraft?.MasterVersion,
          });
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
      setTestMCQID("");
      fetchTestMCQDraftData();
    } else {
      setSelectedVersion(selectedValue);
      setTestMCQID(selectedValue);
      const selectedVersionObj = documentDraftVersion.find(
        (version) => version.SOPID === selectedValue
      );
      setDraftAndMasterVersion({
        draftVersion: selectedVersionObj?.DraftVersion,
        masterVersion: selectedVersionObj?.MasterVersion,
      });
      fetchTestMCQDraftData(selectedValue);
    }
  };

  const getOwnerNameById = (id) => {
    const owner = processOwnerList.find((owner) => owner.UserID === id);
    return owner ? owner.UserName : "";
  };

  const handleOwnerChange = (event) => {
    const value = event.target.value;
    if (userId) {
      const userIdStr = String(userId);
      const autoOwner = processOwnerList.find(
        (owner) => String(owner.UserID) === userIdStr
      );
      if (autoOwner) {
        if (!value.includes(autoOwner.UserID)) {
          value.unshift(autoOwner.UserID);
        }
      }
    }
    setSelectedOwners(value);
  };

  const handleOwnerDelete = (UserID) => {
    if (String(UserID) === String(userId)) return;
    setSelectedOwners((prev) =>
      prev.filter((selectedUserID) => selectedUserID !== UserID)
    );
  };

  const handleTagDelete = (tagToDelete) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  const validate = () => {
    let newErrors = {};

    if (!testMCQName) {
      newErrors.testMCQName = t("errors.TestMCQNameRequired");
    }
    if (selectedOwners.length === 0) {
      newErrors.selectedOwners = t("errors.OwnerRequired");
    }
    if (!passPercentage || isNaN(passPercentage) || passPercentage <= 0) {
      newErrors.passPercentage = t("errors.PassPercentageRequired");
    }
    if (!numberOfAttempts || isNaN(numberOfAttempts) || numberOfAttempts <= 0) {
      newErrors.numberOfAttempts = t("errors.NumberOfAttemptsRequired");
    }
    if (
      !numberOfQuestions ||
      isNaN(numberOfQuestions) ||
      numberOfQuestions <= 0
    ) {
      newErrors.numberOfQuestions = t("errors.NumberOfQuestionsRequired");
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
    if (!isSkipTestMCQExpiry && !TestMCQExpiry) {
      newErrors.TestMCQExpiry = t("errors.ExpiryDateRequired");
    }
    if (!timeLimit) {
      newErrors.timeLimit = t("errors.TimeLimitRequired");
    }
    if (!minimumTime) {
      newErrors.minimumTime = t("errors.MinimumTimeRequired");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (open) {
      setTimeLimit("");
      setMinimumTime(""); // Reset minimum time when modal opens
    }
  }, [open]);

  const handleNextClick = () => {
    // Add security validation checks
    if (!validateInput(testMCQName)) {
      setErrors((prev) => ({
        ...prev,
        testMCQName:
          "Invalid input detected. Please enter a valid test MCQ name.",
      }));
      errorHandler.addSecurityError(testMCQName, "testMCQName");
      return;
    }

    if (testMCQDescription && !validateInput(testMCQDescription)) {
      setErrors((prev) => ({
        ...prev,
        testMCQDescription:
          "Invalid input detected. Please enter a valid description.",
      }));
      errorHandler.addSecurityError(testMCQDescription, "testMCQDescription");
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

    if (!validateInput(numberOfQuestions?.toString())) {
      setErrors((prev) => ({
        ...prev,
        numberOfQuestions: "Invalid input detected for number of questions.",
      }));
      errorHandler.addSecurityError(numberOfQuestions, "numberOfQuestions");
      return;
    }

    if (validate()) {
      const inputs = [
        testMCQName,
        testMCQDescription,
        tags.join(""),
        passPercentage,
        numberOfAttempts,
        numberOfQuestions,
        escalationTimeValue,
      ];
      console.log(inputs);
      if (validateAndSanitizeInputs(inputs)) {
        const ModuleTypeID = presistStore?.ModuleTypeID;
        const ContentID = presistStore?.ContentID;
        if (!ModuleTypeID || !ContentID) {
          return notify("error", "Please select a module and content type");
        }
        const payloadTestMCQExpiry = isSkipTestMCQExpiry ? null : TestMCQExpiry;
        const data = {
          TestMCQDraftID: testMCQDraftID,
          ModuleTypeID,
          ContentID,
          TestMCQID: testMCQID,
          TestMCQName: testMCQName,
          TestMCQDescription: testMCQDescription,
          TestMCQOwner: selectedOwners,
          TestMCQIsActive: testMCQStatus,
          TestMCQTags: tags.join(","),
          SelfApproved: selfApproved,
          Checker: checkers.map((checker) => checker?.UserID),
          EscalationPerson: escalationPersons.map(
            (escalation) => escalation?.UserID
          ),
          EscalationType: escalationTimeUnit,
          EscalationAfter: escalationTimeValue,
          PassPercentage: passPercentage,
          TotalAttempts: numberOfAttempts,
          TotalQuestions: numberOfQuestions,
          QuestionList: questionAndAnswersList,
          TestMCQExpiry: payloadTestMCQExpiry,
          TimeLimite: timeLimit,
          MinimumTime: minimumTime, // Added minimum time to payload
          NeedAcceptance: needAcceptance,
          LinkTestMCQ: linkMCQ,
        };
        const keys = {
          TestMCQID: testMCQID,
          TestMCQDraftID: testMCQDraftID,
        };
        dispatch(frontendState(keys));

        dispatch(frontendState({ editTestMcqData: data }));

        dispatch(setTestData(data));

        if (editTestMCQID) {
          localStorage.removeItem("selectedMCQCard");
          navigate("/testmcqcreation");
        } else {
          navigate("/create-mcq-steps");
        }
      } else {
        notify("error", "Suspicious input detected");
      }
    }
  };

  useEffect(() => {
    setIsDocumentModuleListFetching(true);
    listTestMCQModuleDraftVersion({
      ModuleTypeID: presistStore?.ModuleTypeID,
      ContentID: presistStore?.ContentID,
    })
      .then((response) => {
        if (response?.status === 200) {
          setDocumentDraftVersion(response?.data?.data?.testMCQModuleList);
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
          const owners = response?.data?.data?.userList;
          if (owners && userId) {
            const found = owners.find(
              (owner) => String(owner.UserID) === String(userId)
            );
            if (found) {
              setSelectedOwners((prev) => {
                if (!prev.includes(found.UserID)) {
                  return [found.UserID, ...prev];
                }
                return prev;
              });
            }
          }
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      });
  }, []);

  useEffect(() => {
    if (editTestMCQID) {
      setSelectedVersion(editTestMCQID);
      fetchTestMCQDraftData(editTestMCQID);
    } else {
      setIsSkipTestMCQExpiry(false);
      setTestMCQExpiry(null);
    }
  }, [editTestMCQID]);

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
            margin: "-24px -24px 24px -24px",
            padding: "24px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            position: "relative",
          }}
        >
          <img src={icon} alt="logo" />
          <Box>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              {t("testMCQManagement")}
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff" }}>
              {t("testMCQManagementDescription")}
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

        {/* Two Column Layout */}
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Link MCQ */}
            <FormGroup sx={{ marginBottom: "0rem" }}>
              <Typography sx={labelStyle}>{t("linkTestMCQ")}</Typography>
              <select
                style={inputStyle}
                value={linkMCQ}
                onChange={(e) => setLinkMCQ(e.target.value)}
              >
                <option value="">{"selectLinkTestMCQ"}</option>
                {elementDropdown.map((element) => (
                  <option key={element.value} value={element.value}>
                    {element.label}
                  </option>
                ))}
              </select>
            </FormGroup>

            {/* Test MCQ Name */}
            <FormGroup sx={{ marginBottom: "0.5rem" }}>
              <FormLabel className="label">
                {t("testMCQName")}
                <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <CustomTextField
                className="custom-input-style"
                value={testMCQName}
                onChange={(e) => setTestMCQName(e.target.value)}
                fullWidth
                placeholder={t("Enter Test MCQ name")}
                error={!!errors.testMCQName}
                helperText={errors.testMCQName}
              />
            </FormGroup>

            {/* Test MCQ Description */}
            <FormGroup sx={{ marginBottom: "0.5rem" }}>
              <FormLabel className="label">{t("testMCQDescription")}</FormLabel>
              <CustomTextField
                multiline
                rows={3}
                placeholder={t("enterTestMCQDescription")}
                value={testMCQDescription}
                onChange={(e) => setTestMCQDescription(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </FormGroup>

            {/* Owners */}
            <FormGroup sx={{ marginBottom: "0.5rem" }}>
              <Typography sx={labelStyle}>
                {t("select_owners")} <span style={{ color: "red" }}>*</span>
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
                      style={{ fontWeight: 450 }}
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
                  sx={{ fontSize: "14px", fontWeight: 450 }}
                >
                  {processOwnerList?.length > 0 &&
                    processOwnerList.map((owner) => (
                      <MenuItem
                        key={owner.UserID}
                        value={owner.UserID}
                        sx={{
                          fontSize: "13px",
                          fontWeight: 450,
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
                    sx={{ fontWeight: 450, fontSize: "13px" }}
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
                    mb: 0,
                    maxWidth: "500px",
                  }}
                >
                  {selectedOwners?.map((UserID) => (
                    <Chip
                      key={UserID}
                      label={getOwnerNameById(UserID)}
                      onDelete={
                        String(UserID) === String(userId)
                          ? undefined
                          : () => handleOwnerDelete(UserID)
                      }
                      deleteIcon={
                        String(UserID) === String(userId) ? undefined : (
                          <Close />
                        )
                      }
                      className="owner-chip"
                      sx={{
                        fontWeight: 400,
                        fontSize: "13px",
                        opacity: String(UserID) === String(userId) ? 0.6 : 1,
                        pointerEvents:
                          String(UserID) === String(userId) ? "none" : "auto",
                      }}
                    />
                  ))}
                </Box>
              </FormControl>
            </FormGroup>

            {/* Status Switch for Edit Mode */}
            {editTestMCQID && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 3, mb: 2 }}
              >
                <Box display="flex" alignItems="center">
                  <Switch
                    checked={testMCQStatus}
                    onChange={() => setTestMCQStatus(!testMCQStatus)}
                  />
                  <div>
                    <Typography variant="body1" style={{ fontWeight: "500" }}>
                      {t("testMCQStatus")}
                    </Typography>
                    <Typography variant="body2">
                      {t("changeTestMCQStatus")}
                    </Typography>
                  </div>
                </Box>
                {errors.testMCQStatus && (
                  <Typography color="error">{errors.testMCQStatus}</Typography>
                )}
                <Box>
                  <Typography
                    variant="body2"
                    color={testMCQStatus ? "#15803D" : "#B91C1C"}
                    sx={{
                      bgcolor: testMCQStatus ? "#F0FDF4" : "#FEF2F2",
                      padding: "4px 12px",
                      borderRadius: "16px",
                    }}
                  >
                    {testMCQStatus ? t("active") : t("inactive")}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Tags */}
            <FormGroup sx={{ marginBottom: "0rem" }}>
              <FormLabel className="label">{t("testMCQTags")}</FormLabel>
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
            </FormGroup>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            {/* Expiry Date */}
            <FormGroup sx={{ marginBottom: "0.5rem" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <FormLabel className="label">
                  {t("testMCQExpiryDate")}{" "}
                  {!isSkipTestMCQExpiry && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </FormLabel>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isSkipTestMCQExpiry}
                      onChange={(e) => {
                        setIsSkipTestMCQExpiry(e.target.checked);
                        if (e.target.checked) {
                          setTestMCQExpiry(null);
                        }
                      }}
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
                value={TestMCQExpiry || ""}
                onChange={(e) => setTestMCQExpiry(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}
                disabled={isSkipTestMCQExpiry}
                error={!!errors.TestMCQExpiry}
                helperText={errors.TestMCQExpiry}
              />
            </FormGroup>

            {/* Pass Percentage and Number of Attempts */}
            <Grid container spacing={2} sx={{ marginBottom: "0rem" }}>
              <Grid item xs={6}>
                <Box>
                  <Typography sx={labelStyle}>
                    {t("passPercentage")}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <input
                    type="text"
                    placeholder={t("passPercentage")}
                    style={{ ...inputStyle, width: "100%" }}
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
                    <Typography color="error" sx={{ fontSize: "13px", mt: -1 }}>
                      {errors.passPercentage}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box>
                  <Typography sx={labelStyle}>
                    {t("numberOfAttempts")}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <input
                    type="text"
                    placeholder={t("numberOfAttempts")}
                    style={{ ...inputStyle, width: "100%" }}
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
                    <Typography color="error" sx={{ fontSize: "13px", mt: -1 }}>
                      {errors.numberOfAttempts}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Time Limit and Minimum Time */}
            <Grid container spacing={2} sx={{ marginBottom: "0.5rem" }}>
              <Grid item xs={6}>
                <FormGroup>
                  <FormLabel className="label">
                    {t("timeLimit")} <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <CustomTextField
                    type="time"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    fullWidth
                    placeholder={t("enterTestDuration")}
                    InputProps={{ inputProps: { min: 1, step: 1 } }}
                    error={!!errors.timeLimit}
                    helperText={errors.timeLimit || ""}
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={6}>
                <FormGroup>
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
                  />
                </FormGroup>
              </Grid>
            </Grid>

            {/* Number of Questions */}
            <FormGroup sx={{ marginBottom: "1rem" }}>
              <Typography sx={labelStyle}>
                {t("noOfQuestions")} <span style={{ color: "red" }}>*</span>
              </Typography>
              <input
                type="number"
                placeholder={t("enterNoOfQuestions")}
                style={{ ...inputStyle, width: "100%" }}
                min="0"
                step="1"
                value={numberOfQuestions}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || Number(value) >= 0) {
                    setNumberOfQuestions(e.target.value);
                  }
                }}
              />
              {errors.numberOfQuestions && (
                <Typography color="error" sx={{ fontSize: "13px" }}>
                  {errors.numberOfQuestions}
                </Typography>
              )}
            </FormGroup>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              sx={{
                height: "40px",
                borderColor: "#D0D5DD",
                color: "#000",
                textTransform: "none",
                borderRadius: "8px",
                minWidth: "120px",
                width: "100%",
              }}
            >
              {t("cancel")}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={handleNextClick}
              sx={{
                textTransform: "none",
                height: "40px",
                borderRadius: "8px",
                minWidth: "120px",
                width: "100%",
              }}
            >
              {t("next")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default NewTestMCQModal;

NewTestMCQModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editTestMCQID: PropTypes.string,
};
