import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  Avatar,
  CircularProgress,
  // Grid,Compare Documents
  StepContent,
  Divider,
  Chip,
  Paper,
  LinearProgress,
} from "@mui/material";
// import DialogTitle from "@mui/material/DialogTitle";
import "./modals.css";
import greenicon from "../../assets/png/greenicon.png";
import greencircle from "../../assets/png/greencircle.png";
// import graycircle from "../../assets/png/graycircle.png";
import redicon from "../../assets/png/redicon.png";
import icon from "../../assets/png/icon.png";
import icon2 from "../../assets/png/icons2.png";
import notify from "../../assets/svg/utils/toast/Toast";
import {
  viewElementDraftActivity,
  viewElementDraftActivityHistory,
} from "../../services/elementDraftActivityLog/ElementDraftActivityLog";
import ActivityAvatars from "../activityAvatars/ActivityAvatars";
import { publishDocumentModule } from "../../services/documentModules/DocumentsModule";
import { publishTrainingSimulationModule } from "../../services/trainingSimulationsModule/TrainingSimulationModule";
import { publishTestSimulationModule } from "../../services/testSimulationsModule/TestSimulationModule";
import { publishSopModule } from "../../services/sopModules/SopModule";
import { GetElementsCategory } from "../../store/elements/action";
import { useDispatch, useSelector } from "react-redux";
import { publishTestMCQModule } from "../../services/testMcqModules/TestMcqModules";
import { publishFormModule } from "../../services/formModules/FormModules";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import moment from "moment";

export default function Activity({ open, onClose, data, moduleId }) {
  console.log("Activity data:", data); // Debugging log
  const fetchActivityRef = React.useRef(null);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const dispatch = useDispatch();

  const [activityData, setActivityData] = React.useState(null);
  const [activityHistoryData, setActivityHistoryData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isFetchingActivity, setIsFetchingActivity] = React.useState(false);
  const [isFetchingActivityHistory, setIsFetchingActivityHistory] =
    React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [isDraftPublishing, setIsDraftPublishing] = React.useState(false);
  const { t } = useTranslation();
  const isPublished = activityData?.isPublished;

  const viewActivity = async () => {
    fetchActivityRef.current = true;
    setIsFetchingActivity(true);
    setError(null);

    try {
      const ModuleID = `${data["ModuleName"]}ID`;
      const body = {
        ModuleTypeID: data?.ModuleTypeID,
        ContentID: data?.ContentID,
        ModuleName: data?.ModuleName,
        ModuleID: data[ModuleID],
      };

      const response = await viewElementDraftActivity(body);
      if (response?.status === 200) {
        setActivityData(response?.data?.data?.moduleActivityLog);
      } else {
        throw new Error(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      notify("error", error.message || "Something went wrong");
      setError("Something went wrong! Please try again later.");
    } finally {
      setIsFetchingActivity(false);
      fetchActivityRef.current = false;
    }
  };

  const viewActivityHistory = async () => {
    setIsFetchingActivityHistory(true);
    setError(null);

    try {
      const ModuleID = `${data["ModuleName"]}ID`;
      const body = {
        ModuleTypeID: data?.ModuleTypeID,
        ContentID: data?.ContentID,
        ModuleName: data?.ModuleName,
        ModuleID: data[ModuleID],
      };

      const response = await viewElementDraftActivityHistory(body);
      if (response?.status === 200) {
        setActivityHistoryData(response?.data?.data?.moduleActivityLogHistory);
      } else {
        throw new Error(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      notify("error", error.message || "Something went wrong");
      setError("Something went wrong! Please try again later.");
    } finally {
      setIsFetchingActivityHistory(false);
    }
  };

  const handleCloseModal = (confirmed) => {
    if (confirmed) {
      onClose();
    }
    onClose(false);
  };

  const getIcon = (status) => {
    const statusIcons = {
      "created file": (
        <img src={greenicon} alt={status} height={24} width={24} />
      ),
      "skipped review": (
        <img src={redicon} alt={status} height={24} width={24} />
      ),
      "review submitted": (
        <img src={greenicon} alt={status} height={24} width={24} />
      ),
      "not yet reviewed": (
        <img src={greencircle} alt={status} height={24} width={24} />
      ),
      "checker not skipped": (
        <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
          <circle r="45" cx="50" cy="50" fill="red" />
        </svg>
      ),
      published: <img src={greenicon} alt={status} height={24} width={24} />,
    };

    return statusIcons[status] || "⚪";
  };

  React.useEffect(() => {
    if (!fetchActivityRef.current) {
      viewActivity();
    }
  }, []);

  const fetchApprovedOrRejection = (data = []) =>
    data.some(
      (item) =>
        item?.approvalStatus === "Rejected" ||
        item?.approvalStatus === "Approved"
    );

  const getReviewStatus = (data = []) => {
    return data.some((item) => item?.isReviewSkipped);
  };

  const checkerStatus = fetchApprovedOrRejection(activityData?.Checkers);
  const approvalStatus = fetchApprovedOrRejection(activityData?.Approvers);
  const escalationStatus = fetchApprovedOrRejection(
    activityData?.EscalationPersons
  );

  const isReviewSkipped = getReviewStatus(activityData?.Checkers);

  const isAnyCheckerCommented = activityData?.Checkers?.some(
    // (checker) => checker?.approvalStatus === "Approved"
    (checker) => checker?.comment
  );

  const isEscalated = activityData?.IsEscalated && !isAnyCheckerCommented;

  const checkerIconName = isReviewSkipped
    ? "skipped review"
    : checkerStatus
      ? "review submitted"
      : "not yet reviewed";

  const escalationIconName = escalationStatus
    ? "review submitted"
    : isReviewSkipped
      ? "not yet reviewed"
      : "checker not skipped";

  const approverIconName = approvalStatus
    ? "review submitted"
    : isReviewSkipped
      ? "not yet reviewed"
      : "checker not skipped";

  const publishDraft = async () => {
    setIsDraftPublishing(true);

    let publishFunction;
    const moduleName = data["ModuleName"];
    if (moduleName === "Document") {
      publishFunction = publishDocumentModule;
    } else if (moduleName === "TrainingSimulation") {
      publishFunction = publishTrainingSimulationModule;
    } else if (moduleName === "TestSimulation") {
      publishFunction = publishTestSimulationModule;
    } else if (moduleName === "SOP") {
      publishFunction = publishSopModule;
    } else if (moduleName === "TestMCQ") {
      publishFunction = publishTestMCQModule;
    } else if (moduleName === "Form") {
      publishFunction = publishFormModule;
    } else {
      notify("error", "Invalid module name");
      setIsDraftPublishing(false);
      handleCloseModal(true);
      return;
    }

    try {
      const ModuleID = `${data["ModuleName"]}ID`;
      const body = {
        ModuleTypeID: data?.ModuleTypeID,
        ContentID: data?.ContentID,
        [ModuleID]: data[ModuleID],
      };

      const response = await publishFunction(body);
      if (response?.status === 200) {
        notify(
          "success",
          response?.data?.message || "InProgress published successfully"
        );
        const data = {
          ModuleTypeID: presistStore?.ModuleTypeID,
          ParentContentID: presistStore?.ContentID,
        };
        dispatch(GetElementsCategory(data));
        handleCloseModal(true);
      }
    } catch (error) {
      notify("error", error.response?.data?.message || "Something went wrong");
    } finally {
      setIsDraftPublishing(false);
    }
  };

  const renderActivityItem = (activityItem, isHistory = false) => (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        border: "1px solid #f1f5f9",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Activity Header */}
      <Box
        sx={{
          background: "#fff",
          color: "#000",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={icon2} alt="logo" width={20} height={20} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 400, fontSize: "16px" }}>
            {activityItem?.ActivityName}
          </Typography>

          {isHistory && (
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Chip
                label={`Master: ${activityItem?.MasterVersion || "Not Published"
                  }`}
                size="small"
                sx={{
                  backgroundColor: "rgba(18, 18, 18, 0.2)",
                  color: "#000",
                  fontSize: "10px",
                }}
              />
              <Chip
                label={`InProgress: ${activityItem?.DraftVersion}`}
                size="small"
                sx={{
                  backgroundColor: "rgba(18, 18, 18, 0.2)",
                  color: "#000",
                  fontSize: "10px",
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Divider />

      {/* Activity Steps */}
      <Box sx={{ p: 2 }}>
        <Stepper
          orientation="vertical"
          sx={{
            "& .MuiStepConnector-line": {
              borderColor: "#e2e8f0",
              borderWidth: 2,
            },
          }}
        >
          {/* Created Step */}
          <Step active expanded>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#16A34A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // boxShadow: "0 2px 8px #16A34A",
                  }}
                >
                  {getIcon("created file")}
                </Box>
              )}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: 12,
                  color: "#64748b",
                  ml: 1,
                }}
              >
                Created on {activityItem?.CreatedDate}
              </Typography>
            </StepLabel>
            <StepContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  ml: 4,
                  p: 2,
                  backgroundColor: "#f8fafc",
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Avatar
                  src="https://s3-alpha-sig.figma.com/img/67da/9fdd/d372b1b5b44ffef41eed6ceb810ddf8a"
                  sx={{ width: 28, height: 28 }}
                />
                <Box>
                  <Typography
                    sx={{ fontWeight: 400, fontSize: 12, color: "#1e293b" }}
                  >
                    {activityItem?.CreatedBy}
                  </Typography>
                  <Chip
                    label={activityItem?.userType}
                    size="small"
                    sx={{
                      backgroundColor: "#10b981",
                      color: "white",
                      fontSize: "10px",
                      height: 18,
                      mt: 0.5,
                    }}
                  />
                </Box>
              </Box>
            </StepContent>
          </Step>

          {/* Review Step */}
          {!activityItem?.SelfApproved && (
            <Step active expanded>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: isReviewSkipped
                        ? "#ef4444"
                        : checkerStatus
                          ? "#36C139"
                          : "#36C139",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // boxShadow: `0 2px 8px ${
                      //   isReviewSkipped
                      //     ? "rgba(239, 68, 68, 0.3)"
                      //     : checkerStatus
                      //     ? "#36C139"
                      //     : "#36C139"
                      // }`,
                    }}
                  >
                    {getIcon(checkerIconName)}
                  </Box>
                )}
              >
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: 12,
                    color: "#64748b",
                    ml: 1,
                  }}
                >
                  Review Stage - {activityItem?.EscalationDate}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box
                  sx={{
                    ml: 4,
                    p: 2,
                    backgroundColor: "#f8fafc",
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <ActivityAvatars
                    activityData={
                      activityItem?.Checkers?.length > 0
                        ? activityItem?.Checkers
                        : activityItem?.StakeHolders
                    }
                    count={3}
                  />
                </Box>
              </StepContent>
            </Step>
          )}

          {/* Escalation Step */}
          {!activityItem?.SelfApproved && isEscalated && (
            <Step active expanded>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: escalationStatus ? "red" : "red",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // boxShadow: `0 2px 8px ${
                      //   escalationStatus ? "red" : "red"
                      // }`,
                    }}
                  >
                    {getIcon(escalationIconName)}
                  </Box>
                )}
              >
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: 12,
                    color: "#64748b",
                    ml: 1,
                  }}
                >
                  Escalation - {activityItem?.EscalationDate}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box
                  sx={{
                    ml: 4,
                    p: 2,
                    backgroundColor: "#f8fafc",
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <ActivityAvatars
                    activityData={activityItem?.EscalationPersons}
                    count={3}
                  />
                </Box>
              </StepContent>
            </Step>
          )}
        </Stepper>
      </Box>
    </Paper>
  );

  return (
    <Dialog
      open={open}
      onClose={() => handleCloseModal(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
          background: "#fafafa",
        },
      }}
    >
      {/* Loading States */}
      {(isFetchingActivity || isFetchingActivityHistory) && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            borderRadius: 3,
          }}
        >
          <CircularProgress size={40} sx={{ color: "#667eea" }} />
          <Typography variant="body2" sx={{ mt: 2, color: "#64748b" }}>
            {t("fetchingActivity")}
          </Typography>
          <LinearProgress
            sx={{
              width: "200px",
              mt: 2,
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#667eea",
              },
            }}
          />
        </Box>
      )}

      {/* Error Dialog */}
      {error && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            borderRadius: 3,
            p: 3,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              p: 3,
              borderRadius: 2,
              border: "2px solid #fecaca",
              backgroundColor: "#fef2f2",
            }}
          >
            <Typography variant="h6" sx={{ color: "#dc2626", mb: 2 }}>
              {t("error")}
            </Typography>
            <Typography variant="body1" sx={{ color: "#7f1d1d", mb: 3 }}>
              {error}
            </Typography>
            <Button
              onClick={() => handleCloseModal(false)}
              variant="contained"
              sx={{
                backgroundColor: "#dc2626",
                "&:hover": { backgroundColor: "#b91c1c" },
              }}
            >
              {t("close")}
            </Button>
          </Box>
        </Box>
      )}

      {/* Header */}
      {!(isFetchingActivityHistory || isFetchingActivity) && (
        <Box
          sx={{
            background: "linear-gradient(to top, #2C64FF, #4A90E2)",
            color: "white",
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={icon} alt="logo" width={24} height={24} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {showHistory ? t("history") : t("activityTitle")}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {showHistory ? t("reviewHistoryInfo") : t("reviewActivityInfo")}
              </Typography>
            </Box>
          </Box>

          <Button
            onClick={() => {
              setShowHistory((prev) => !prev);
              if (activityHistoryData && activityHistoryData?.length === 0) {
                viewActivityHistory();
              }
            }}
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.3)",
              backgroundColor: "rgba(255,255,255,0.1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                borderColor: "rgba(255,255,255,0.5)",
              },
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
            variant="outlined"
          >
            {showHistory ? "Hide History" : "View History"}
          </Button>
        </Box>
      )}

      {/* Content */}
      <DialogContent
        sx={{ p: 3, maxHeight: "calc(90vh - 200px)", overflowY: "auto" }}
      >
        {!isFetchingActivity &&
          !showHistory &&
          !error &&
          activityData &&
          renderActivityItem(activityData)}

        {!isFetchingActivityHistory &&
          showHistory &&
          !error &&
          activityHistoryData &&
          activityHistoryData.map((item, index) => (
            <Box key={index}>{renderActivityItem(item, true)}</Box>
          ))}
      </DialogContent>

      {/* Actions */}
      {!isFetchingActivity && !showHistory && !error && (
        <DialogActions
          sx={{
            p: 3,
            gap: 2,
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <Button
            onClick={() => handleCloseModal(false)}
            variant="outlined"
            fullWidth
            disabled={isDraftPublishing}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              py: 1.5,
              color: "#64748b",
              borderColor: "#d1d5db",
              "&:hover": {
                borderColor: "#9ca3af",
                backgroundColor: "#f9fafb",
              },
            }}
          >
            {t("cancel")}ss
          </Button>
          <Button
            onClick={publishDraft}
            variant="contained"
            fullWidth
            disabled={isDraftPublishing || isPublished}
            startIcon={isDraftPublishing && <CircularProgress size={20} />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              py: 1.5,
              background:
                isDraftPublishing || isPublished
                  ? "#d1d5db"
                  : "linear-gradient(to top, #2C64FF, #4A90E2)",

              "&:hover": {
                background:
                  isDraftPublishing || isPublished
                    ? "#d1d5db"
                    : "linear-gradient(to top, #1d4ed8, #3b82f6)",
              },
              "&.Mui-disabled": {
                color: "#9ca3af",
              },
            }}
          >
            {isDraftPublishing
              ? t("publishing")
              : isPublished
                ? t("published")
                : t("publish")}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

Activity.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

Activity.defaultProps = {
  data: {},
};

Activity.displayName = "ActivityModal";

