import * as React from "react";
import { ActivityViewHistoryApi } from "../../../services/activitysidebar/ActivitySidebar";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import notify from "../../../assets/svg/utils/toast/Toast";
import { Box } from "@mui/material";
import { useTheme } from "@mui/styles";

export default function ActivitySideBar({
  open,
  onClose,
  data,
  datafromsidebar,
  elementsDocumentFile,
}) {
  const fetchActivityRef = React.useRef(null);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const [activityData, setActivityData] = React.useState(null);
  const [activityHistoryData, setActivityHistoryData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isFetchingActivity, setIsFetchingActivity] = React.useState(false);
  const [isFetchingActivityHistory, setIsFetchingActivityHistory] =
    React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [isDraftPublishing, setIsDraftPublishing] = React.useState(false);
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;
  const { t } = useTranslation();
  const isNonEmptyObject = (obj) =>
    obj && typeof obj === "object" && Object.keys(obj).length > 0;
  const fetchActivity = async (isHistory = false) => {
    const apiFunction = isHistory
      ? setIsFetchingActivityHistory
      : setIsFetchingActivity;
    const activityRef = isHistory ? null : fetchActivityRef;
    if (activityRef) activityRef.current = true;
    apiFunction(true);
    setError(null);
    try {
      let moduleId;
      if (isNonEmptyObject(datafromsidebar) && datafromsidebar.ModuleID) {
        moduleId = datafromsidebar.ModuleID;
      } else if (isNonEmptyObject(data)) {
        const ModuleIDKey = `${data["ModuleName"]}ID`;
        moduleId = data[ModuleIDKey];
      } else if (presistStore?.SOPID) {
        moduleId = presistStore?.SOPID;
      } else {
        apiFunction(false);
        if (activityRef) activityRef.current = false;
        return;
      }
      const currentPath = window.location.pathname;
      const getModuleIdByPath = () => {
        if (currentPath.includes("/sops/view")) {
          return elementsDocumentFile?.SOPID;
        } else if (currentPath.includes("/training-simulations/view")) {
          return elementsDocumentFile?.TrainingSimulationID;
        } else if (currentPath.includes("/test-simulations/view")) {
          return elementsDocumentFile?.TestSimulationID;
        } else if (currentPath.includes("/test-mcqs/view")) {
          return elementsDocumentFile?.TestMCQID;
        } else if (currentPath.includes("/documents/view")) {
          return elementsDocumentFile?.DocumentID;
        } else if (currentPath.includes("/forms/view")) {
          return elementsDocumentFile?.FormID;
        }
        return moduleId;
      };
      const payload = {
        ModuleID: getModuleIdByPath(),
        Order: "DESC",
        IsLatestOne: !isHistory,
      };
      console.log(
        `Sending payload for ${isHistory ? "history" : "current activity"}:`,
        payload
      );
      const response = await ActivityViewHistoryApi(payload);
      console.log(
        `API response for ${isHistory ? "history" : "current activity"}:`,
        response
      );
      if (response?.data?.data) {
        if (isHistory) {
          setActivityHistoryData(response.data.data);
        } else {
          setActivityData(
            response.data.data.length > 0 ? response.data.data[0] : null
          );
        }
      } else {
        console.error("No data received from API");
        setError(
          `No ${isHistory ? "activity history" : "activity"} data found`
        );
      }
    } catch (error) {
      console.error(
        `Error fetching ${isHistory ? "activity history" : "activity"}:`,
        error
      );
      notify("error", error.message || "Something went wrong");
      setError(
        `Failed to fetch ${isHistory ? "activity history" : "activity"}`
      );
    } finally {
      apiFunction(false);
      if (activityRef) activityRef.current = false;
    }
  };
  React.useEffect(() => {
    if (
      open &&
      (isNonEmptyObject(datafromsidebar) ||
        isNonEmptyObject(data) ||
        presistStore?.SOPID)
    ) {
      fetchActivity(false);
    }
  }, [open, datafromsidebar, data, presistStore?.SOPID]);

  const handleCloseModal = (confirmed) => {
    if (confirmed) {
      onClose();
    }
    onClose(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shouldShowBlurStepper = (activity) => {
    if (!activity) return false;
    return (
      activity.NeedAcceptanceFromStakeHolder === true ||
      activity.NeedAcceptance === true ||
      activity.NeedAcceptanceForApprover === true
    );
  };
  const getStepsFromActivity = (activity, showAllSteps = true) => {
    if (!activity) return [];

    let allSteps = [];

    const processActions = (actions, stepTitle, extraMessage) => {
      if (Array.isArray(actions) && actions.length > 0) {
        const hasAnyActionTaken = actions.some(
          (action) => action.ActionDateTime !== null
        );

        let stepDetails = actions.map((action) => {
          let status;
          let displayStatus;

          if (action.ActionDateTime !== null) {
            status = action.ApprovalStatus || "Completed";
            displayStatus = action.ApprovalStatus || "Completed";
          } else if (hasAnyActionTaken) {
            status = "Has been Actioned by other User(s)";
            displayStatus = "Has been Actioned by other User(s)";
          } else {
            status = "Pending";
            displayStatus = "has been actioned by escalation user(s)";
          }

          return {
            name: action.UserName,
            actionDateTime: action.ActionDateTime,
            status: displayStatus,
            comment: action.Comment || "No comment provided",
          };
        });

        // Insert extra message if needed
        if (extraMessage) {
          stepDetails = [
            {
              name: "",
              actionDateTime: null,
              status: "",
              comment: "",
              extraMessage,
              isExtraMessage: true,
            },
            ...stepDetails,
          ];
        }

        // Determine step status based on all actions
        const hasCompletedActions = actions.some(
          (action) => action.ActionDateTime !== null
        );
        const allActionsCompleted = actions.every(
          (action) => action.ActionDateTime !== null
        );

        allSteps.push({
          id: Math.random().toString(36).substr(2, 9),
          title: stepTitle,
          isDisabled: !hasCompletedActions,
          status: allActionsCompleted
            ? "completed"
            : hasCompletedActions
            ? "in-progress"
            : "pending",
          details: stepDetails,
        });
      }
    };

    processActions(activity.CheckerActions, "Review Stage");
    processActions(activity.SteakHolderActions, "Stakeholders");
    processActions(activity.EscalatorActions, "Reviewer Escalation Stage");
    processActions(
      activity.StackHolderEscalatorActions,
      "StakeHolder Escalation Stage"
    );
    processActions(activity.ApproverActions, "Approval");

    if (!showAllSteps) {
      allSteps = allSteps.filter(
        (step) =>
          step.details &&
          step.details.length > 0 &&
          step.details.some((detail) => detail.actionDateTime !== null)
      );
    }

    return allSteps.sort((a, b) => {
      const getEarliestDateTime = (step) => {
        const completedActions = step.details.filter(
          (detail) => detail.actionDateTime
        );
        if (completedActions.length === 0) return null;
        return completedActions.reduce((earliest, detail) => {
          const detailDate = new Date(detail.actionDateTime);
          return !earliest || detailDate < earliest ? detailDate : earliest;
        }, null);
      };

      const aDateTime = getEarliestDateTime(a);
      const bDateTime = getEarliestDateTime(b);

      if (!aDateTime) return 1;
      if (!bDateTime) return -1;
      return aDateTime - bDateTime;
    });
  };

  const isLatestAction = (actionDateTime, allSteps) => {
    if (!actionDateTime) return false;
    const currentDate = new Date(actionDateTime);
    return allSteps.every((step) => {
      if (!step.details[0]?.actionDateTime) return true;
      return currentDate >= new Date(step.details[0].actionDateTime);
    });
  };

  const styles = {
    container: {
      padding: "0",
      backgroundColor: "rgba(74, 144, 226, 0.05)",
      borderTop: "1px dashed rgba(0,0,0,0.1)",
      borderBottom: "1px dashed rgba(0,0,0,0.1)",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    stickyHeader: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#666",
      background: "rgba(74, 144, 226, 0.05)",
      padding: "16px 16px 0 16px",
    },
    scrollArea: {
      padding: "0 16px 16px 16px",
    },
    sectionTitle: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "12px",
      color: "#666",
    },
    paymentHeader: {
      backgroundColor: "#E8F5E8",
      borderRadius: "8px",
      padding: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px",
      gap: "16px",
    },
    headerSection: {
      flex: 1,
      padding: "0 16px",
      position: "relative",
    },
    verticalDivider: {
      width: "1px",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.1)",
    },
    statusLabel: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "6px",
    },
    statusChip: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "2px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500",
      marginBottom: "6px",
      display: "inline-block",
    },
    expectedSettlement: {
      fontSize: "12px",
      color: "#333",
    },
    referenceSection: {
      textAlign: "right",
    },
    referenceLabel: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "6px",
    },
    referenceNumber: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#333",
    },
    topSection: {
      backgroundColor: "#f8fafc",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
      border: "1px solid #e2e8f0",
    },
    topSectionTitle: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "12px",
      color: "#374151",
    },
    topSectionGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    topSectionItem: {
      backgroundColor: "white",
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
    },
    topSectionItemTitle: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#6b7280",
      marginBottom: "8px",
    },
    topSectionItemContent: {
      fontSize: "12px",
      color: "#374151",
    },
    stepper: {
      position: "relative",
      margin: "20px",
    },
    stepItem: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "16px",
      position: "relative",
    },
    stepIcon: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "12px",
      flexShrink: 0,
      position: "relative",
      fontSize: "12px",
    },
    completedIcon: {
      backgroundColor: bgColor,
      color: bgColor,
    },
    pendingIcon: {
      backgroundColor: "#E0E0E0",
      color: "#9E9E9E",
    },
    latestCompletedIcon: {
      backgroundColor: "#0ea5e9",
      color: "#0ea5e9",
    },
    stepContent: {
      flex: 1,
      paddingTop: "1px",
    },
    stepTitle: {
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "3px",
      lineHeight: "1.4",
    },
    completedTitle: {
      color: "#333",
    },
    pendingTitle: {
      color: "#666",
    },
    stepTimestamp: {
      fontSize: "11px",
      color: "#999",
      marginBottom: "6px",
    },
    emailButton: {
      backgroundColor: bgColor,
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "6px 12px",
      fontSize: "12px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      marginTop: "6px",
    },
    stepDetails: {
      marginTop: "6px",
      paddingLeft: "12px",
      fontSize: "12px",
      color: "#666",
    },
    feeSection: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "3px",
    },
    waiveButton: {
      background: "none",
      border: "none",
      color: "#3F51B5",
      cursor: "pointer",
      fontSize: "11px",
      textDecoration: "underline",
    },
    connector: {
      position: "absolute",
      left: "9px",
      top: "20px",
      width: "2px",
      height: "calc(100% - 20px)",
      backgroundColor: "#E0E0E0",
    },
    dottedConnector: {
      position: "absolute",
      left: "9px",
      top: "20px",
      width: "2px",
      height: "calc(100% - 20px)",
      backgroundColor: "transparent",
      backgroundImage:
        "linear-gradient(to bottom, #E0E0E0 50%, transparent 50%)",
      backgroundSize: "2px 8px",
      backgroundRepeat: "repeat-y",
    },
    activitySection: {
      marginTop: "20px",
      paddingTop: "16px",
      borderTop: "1px solid rgba(0,0,0,0.1)",
    },
    activityItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "8px",
      borderRadius: "4px",
      backgroundColor: "white",
      marginBottom: "8px",
    },
    avatar: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      backgroundColor: "#4A90E2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "12px",
      fontWeight: "500",
    },
    dialogHeader: {
      background: bgColor,
      color: "white",
      padding: "16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dialogTitle: {
      fontWeight: "600",
      fontSize: "16px",
    },
    dialogSubtitle: {
      fontSize: "12px",
      opacity: 0.9,
    },
    downloadButton: {
      color: "white",
      borderColor: "rgba(255,255,255,0.3)",
      backgroundColor: "rgba(255,255,255,0.1)",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderColor: "rgba(255,255,255,0.5)",
      },
      textTransform: "none",
      fontWeight: "600",
      padding: "8px 16px",
      display: "flex",
      gap: "8px",
      fontSize: "12px",
    },
    historyButton: {
      color: "white",
      borderColor: "rgba(255,255,255,0.3)",
      backgroundColor: "rgba(255,255,255,0.1)",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.2)",
        borderColor: "rgba(255,255,255,0.5)",
      },
      textTransform: "none",
      fontWeight: "600",
      padding: "8px 16px",
      fontSize: "12px",
    },
    loadingOverlay: {
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
    },
    loadingSpinner: {
      color: "#4A90E2",
    },
    errorOverlay: {
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
      padding: "16px",
    },
    errorBox: {
      textAlign: "center",
      padding: "16px",
      borderRadius: "8px",
      border: "2px solid #fecaca",
      backgroundColor: "#fef2f2",
    },
    errorTitle: {
      color: "#dc2626",
      marginBottom: "8px",
      fontWeight: "600",
    },
    errorMessage: {
      color: "#7f1d1d",
      marginBottom: "16px",
    },
    closeButton: {
      backgroundColor: "#dc2626",
      color: "white",
      "&:hover": { backgroundColor: "#b91c1c" },
      textTransform: "none",
      fontWeight: "600",
    },
    dialogFooter: {
      padding: "16px",
      gap: "16px",
      background: "#f8fafc",
      borderTop: "1px solid #e2e8f0",
      display: "flex",
    },
    cancelButton: {
      textTransform: "none",
      fontWeight: "600",
      padding: "8px 16px",
      color: "#64748b",
      borderColor: "#d1d5db",
      "&:hover": {
        borderColor: "#9ca3af",
        backgroundColor: "#f9fafb",
      },
      flex: 1,
    },
    publishButton: {
      textTransform: "none",
      fontWeight: "600",
      padding: "8px 16px",
      background: bgColor,
      "&:hover": {
        background: bgColor,
      },
      "&.Mui-disabled": {
        color: "#9ca3af",
        background: "#d1d5db",
      },
      flex: 1,
    },
    userItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "4px",
    },
    actionBadge: {
      fontSize: "10px",
      color: "#666",
      marginTop: "2px",
      backgroundColor: "#cfe7d4ff",
      padding: "0px 10px",
      borderRadius: "20px",
      display: "inline-block",
    },
    noDataText: {
      color: "#666",
      fontSize: "12px",
    },
  };

  const generatePDF = async () => {
    const element = document.getElementById("activity-content");
    if (!element) return;

    try {
      notify("info", "Preparing PDF download...");

      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "-9999px";
      clone.style.maxHeight = "none";
      clone.style.overflow = "visible";
      clone.style.height = "auto";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        height: clone.scrollHeight,
        windowHeight: clone.scrollHeight,
        onclone: (document) => {
          const element = document.getElementById("activity-content");
          element.style.maxHeight = "none";
          element.style.overflow = "visible";
          element.style.height = "auto";
        },
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const currentDate = new Date().toISOString().split("T")[0];
      const moduleName = activityData?.ModuleName || "activity-report";
      const fileName = `${moduleName}-${currentDate}.pdf`;

      pdf.save(fileName);
      notify("success", "PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      notify("error", "Failed to generate PDF");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(
      0
    )}`.toUpperCase();
  };

  const renderTopSection = (activity) => {
    const hasChangeOwners =
      activity.AssignedOwner?.filter((owner) => owner.ActionType === "Change")
        ?.length > 0;
    const hasCheckers =
      activity.CheckerActions && activity.CheckerActions.length > 0;
    const hasStakeholders =
      activity.SteakHolderActions && activity.SteakHolderActions.length > 0;
    const hasApprovers =
      activity.ApproverActions && activity.ApproverActions.length > 0;
    const hasEscalatorActions =
      activity.EscalatorActions && activity.EscalatorActions.length > 0;
    const hasStackHolderEscalatorActions =
      activity.StackHolderEscalatorActions && activity.StackHolderEscalatorActions.length > 0;

    if (
      !hasChangeOwners &&
      !hasCheckers &&
      !hasStakeholders &&
      !hasApprovers &&
      !hasEscalatorActions &&
      !hasStackHolderEscalatorActions
    ) {
      return null;
    }

    return (
      <>
        {/* First Row */}
        {hasChangeOwners && (
          <>
            <div style={styles.headerSection}>
              <div>
                <div style={styles.topSectionItemTitle}>Assigned Owners</div>
                <div style={styles.topSectionItemContent}>
                  {activity.AssignedOwner.filter(
                    (user) => user.ActionType === "Change"
                  ).map((owner, idx) => (
                    <div key={idx} style={styles.userItem}>
                      <div style={styles.avatar}>
                        {getInitials(owner.UserName)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                          {owner.UserName}
                        </div>
                        <div style={styles.actionBadge}>{owner.ActionType}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={styles.verticalDivider}></div>
          </>
        )}

        {hasApprovers && (
          <>
            <div style={styles.headerSection}>
              <div style={styles.topSectionItemTitle}>Approvers</div>
              <div style={styles.topSectionItemContent}>
                {activity.ApproverActions.map((approver, idx) => (
                  <div key={idx} style={styles.userItem}>
                    <div style={styles.avatar}>
                      {getInitials(approver.UserName)}
                    </div>
                    <div style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                      {approver.UserName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.verticalDivider}></div>
          </>
        )}

        {hasCheckers && (
          <>
            <div style={styles.headerSection}>
              <div style={styles.topSectionItemTitle}>Review Stage</div>
              <div style={styles.topSectionItemContent}>
                {activity.CheckerActions.map((checker, idx) => (
                  <div key={idx} style={styles.userItem}>
                    <div style={styles.avatar}>
                      {getInitials(checker.UserName)}
                    </div>
                    <div style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                      {checker.UserName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.verticalDivider}></div>
          </>
        )}

        {hasStakeholders && (
          <>
            <div style={styles.headerSection}>
              <div style={styles.topSectionItemTitle}>Stakeholders</div>
              <div style={styles.topSectionItemContent}>
                {activity.SteakHolderActions.map((stakeholder, idx) => (
                  <div key={idx} style={styles.userItem}>
                    <div style={styles.avatar}>
                      {getInitials(stakeholder.UserName)}
                    </div>
                    <div style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                      {stakeholder.UserName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.verticalDivider}></div>
          </>
        )}
      </>
    );
  };

  const renderEscalationSection = (activity) => {
    const hasEscalatorActions =
      activity.EscalatorActions && activity.EscalatorActions.length > 0;
    const hasStackHolderEscalatorActions =
      activity.StackHolderEscalatorActions && activity.StackHolderEscalatorActions.length > 0;

    if (!hasEscalatorActions && !hasStackHolderEscalatorActions) {
      return null;
    }

    return (
      <div style={styles.paymentHeader}>
        {hasEscalatorActions && (
          <>
            <div style={styles.headerSection}>
              <div style={styles.topSectionItemTitle}>Reviewer Escalation Stage</div>
              <div style={styles.topSectionItemContent}>
                {activity.EscalatorActions.map((escalator, idx) => (
                  <div key={idx} style={styles.userItem}>
                    <div style={styles.avatar}>
                      {getInitials(escalator.UserName)}
                    </div>
                    <div style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                      {escalator.UserName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.verticalDivider}></div>
          </>
        )}

        {hasStackHolderEscalatorActions && (
          <>
            <div style={styles.headerSection}>
              <div style={styles.topSectionItemTitle}>StakeHolder Escalation Stage</div>
              <div style={styles.topSectionItemContent}>
                {activity.StackHolderEscalatorActions.map((stackHolderEscalator, idx) => (
                  <div key={idx} style={styles.userItem}>
                    <div style={styles.avatar}>
                      {getInitials(stackHolderEscalator.UserName)}
                    </div>
                    <div style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                      {stackHolderEscalator.UserName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.verticalDivider}></div>
          </>
        )}
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleCloseModal(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          maxHeight: "90vh",
          background: "#fafafa",
          minWidth: "1000px",
          width: "80vw",
        },
      }}
    >
      {(isFetchingActivity || isFetchingActivityHistory) && (
        <div style={styles.loadingOverlay}>
          <CircularProgress
            size={24}
            thickness={4}
            style={styles.loadingSpinner}
          />
        </div>
      )}

      {error && (
        <div style={styles.errorOverlay}>
          <div style={styles.errorBox}>
            <div style={styles.errorTitle}>Error</div>
            <div style={styles.errorMessage}>{error}</div>
            <Button
              onClick={() => handleCloseModal(false)}
              variant="contained"
              style={styles.closeButton}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {!(isFetchingActivityHistory || isFetchingActivity) && (
        <div style={styles.dialogHeader}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12H16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div style={styles.dialogTitle}>
                {showHistory
                  ? t("dialogTitleHistory")
                  : t("dialogTitleActivityStatus")}
              </div>
              <div style={styles.dialogSubtitle}>
                {showHistory
                  ? t("dialogSubtitleHistory")
                  : t("dialogSubtitleStatus")}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <Button
              onClick={generatePDF}
              variant="outlined"
              style={styles.downloadButton}
              startIcon={<FileDownloadIcon style={{ fontSize: "20px" }} />}
            >
              {t("downloadPDF")}
            </Button>

            <Button
              onClick={() => {
                setShowHistory((prev) => {
                  const next = !prev;
                  if (next) {
                    fetchActivity(true);
                  }
                  return next;
                });
              }}
              variant="outlined"
              style={styles.historyButton}
            >
              {showHistory ? t("hideHistory") : t("viewHistory")}
            </Button>
            <Box onClick={onClose} sx={{ cursor: "pointer" }}>
              X
            </Box>
          </div>
        </div>
      )}
      <DialogContent
        id="activity-content"
        style={{
          padding: "16px",
          maxHeight: "calc(90vh - 200px)",
          overflowY: "auto",
          "@media print": {
            maxHeight: "none",
            overflow: "visible",
          },
        }}
      >
        {!isFetchingActivity && !showHistory && !error && activityData && (
          <div style={styles.container}>
            <div style={styles.paymentHeader}>
              <div style={styles.headerSection}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    fontWeight: 600,
                    marginBottom: "2px",
                  }}
                >
                  Module
                </div>
                <div style={{ fontWeight: 500 }}>
                  {activityData.ModuleName || "N/A"}
                </div>

                {activityData.AttributeTypeName && (
                  <>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        fontWeight: 600,
                        margin: "8px 0 2px 0",
                      }}
                    >
                      Attribute Name
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#4A90E2",
                        fontWeight: 500,
                        margin: "2px 0 6px 0",
                      }}
                    >
                      {activityData.AttributeTypeName}
                    </div>
                  </>
                )}
                <div style={styles.expectedSettlement}>
                  Created By:{" "}
                  <strong>
                    {
                      activityData.AssignedOwner?.find(
                        (user) => user.ActionType === "Create"
                      )?.UserName
                    }
                  </strong>
                </div>
                <div style={styles.expectedSettlement}>
                  Created On:{" "}
                  <strong>{formatDate(activityData.CreatedDate)}</strong>
                </div>
              </div>

              <div style={styles.verticalDivider}></div>

              {renderTopSection(activityData)}

              <div style={styles.verticalDivider}></div>

              <div
                style={{ ...styles.headerSection, ...styles.referenceSection }}
              >
                <div style={styles.referenceLabel}>Master Version</div>
                <div style={styles.referenceNumber}>
                  {activityData.MasterVersion || "N/A"}
                </div>
                <div style={styles.referenceLabel}>InProgress Version</div>
                <div style={styles.referenceNumber}>
                  {activityData.DraftVersion || "N/A"}
                </div>
              </div>
            </div>

            {/* Second Row for Escalation Sections */}
            {renderEscalationSection(activityData)}

            <div style={styles.stepper}>
              {getStepsFromActivity(
                activityData,
                shouldShowBlurStepper(activityData)
              ).length > 0 ? (
                getStepsFromActivity(
                  activityData,
                  shouldShowBlurStepper(activityData)
                ).map((step, index, arr) => (
                  <div
                    key={step.id}
                    style={{
                      ...styles.stepItem,
                      opacity:
                        step.isDisabled && shouldShowBlurStepper(activityData)
                          ? 0.5
                          : 1,
                      pointerEvents:
                        step.isDisabled && shouldShowBlurStepper(activityData)
                          ? "none"
                          : "auto",
                    }}
                  >
                    {index < arr.length - 1 && (
                      <div
                        style={{
                          ...(arr[index + 1]?.title === "Escalation Stage"
                            ? styles.dottedConnector
                            : styles.connector),
                          backgroundColor: step.isDisabled
                            ? arr[index + 1]?.title === "Escalation Stage"
                              ? "transparent"
                              : "#E0E0E0"
                            : arr[index + 1]?.title === "Escalation Stage"
                            ? "transparent"
                            : "#E0E0E0",
                          backgroundImage:
                            arr[index + 1]?.title === "Escalation Stage"
                              ? "linear-gradient(to bottom, #E0E0E0 50%, transparent 50%)"
                              : "none",
                        }}
                      ></div>
                    )}
                    <div
                      style={{
                        ...styles.stepIcon,
                        ...(step.isDisabled
                          ? { backgroundColor: "#E0E0E0", color: "#9E9E9E" }
                          : isLatestAction(step.details[0]?.actionDateTime, arr)
                          ? styles.latestCompletedIcon
                          : step.status === "completed"
                          ? styles.completedIcon
                          : styles.pendingIcon),
                      }}
                    >
                      {step.status === "completed" && !step.isDisabled
                        ? "✓"
                        : "○"}
                    </div>
                    <div style={styles.stepContent}>
                      <div
                        style={{
                          ...styles.stepTitle,
                          color: step.isDisabled ? "#9E9E9E" : "#333",
                        }}
                      >
                        {step.title}
                      </div>
                      {Array.isArray(step.details) &&
                        step.details.length > 0 && (
                          <div style={styles.stepDetails}>
                            {step.details.map((detail, idx) =>
                              detail.isExtraMessage ? (
                                <div
                                  key={idx}
                                  style={{
                                    marginBottom: 8,
                                    fontWeight: 600,
                                    color: "#0ea5e9",
                                  }}
                                >
                                  {detail.extraMessage}
                                </div>
                              ) : (
                                <div
                                  key={idx}
                                  style={{
                                    marginBottom: 8,

                                    padding: "8px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      marginBottom: "8px",
                                      width: "100%",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        flex: 1,
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                          minWidth: "300px",
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: "#666",
                                            fontSize: "12px",
                                          }}
                                        >
                                          {detail.actionDateTime === null
                                            ? "null"
                                            : formatDate(detail.actionDateTime)}
                                        </span>
                                        <span
                                          style={{
                                            fontWeight: 500,
                                            marginLeft: "8px",
                                          }}
                                        >
                                          {detail.name}
                                        </span>
                                      </div>
                                      <span
                                        style={{
                                          backgroundColor:
                                            detail.status.includes("Rejected")
                                              ? "#fee2e2"
                                              : detail.status.includes(
                                                  "Approved"
                                                )
                                              ? "#dcfce7"
                                              : detail.status ===
                                                "Has been Actioned by other User(s)"
                                              ? "#fef3c7"
                                              : "#e2e8f0",
                                          color: detail.status.includes(
                                            "Rejected"
                                          )
                                            ? "#b91c1c"
                                            : detail.status.includes("Approved")
                                            ? "#166534"
                                            : detail.status ===
                                              "Has been Actioned by other User(s)"
                                            ? "#92400e"
                                            : "#475569",
                                          padding: "2px 8px",
                                          borderRadius: "12px",
                                          fontSize: "12px",
                                          fontWeight: 500,
                                        }}
                                      >
                                        Status:{" "}
                                        {detail.status.replace("Status: ", "")}
                                      </span>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      borderTop: "1px solid #e2e8f0",
                                      paddingTop: "8px",
                                      fontSize: "12px",
                                      color: "#475569",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#666",
                                        fontWeight: "500",
                                        marginRight: "4px",
                                      }}
                                    >
                                      Comment:
                                    </span>
                                    {detail.comment.replace("Comment: ", "") ===
                                    "null"
                                      ? "No comment provided"
                                      : detail.comment.replace("Comment: ", "")}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "32px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    marginTop: "16px",
                  }}
                >
                  <div
                    style={{
                      color: "#64748b",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    {t("noActivityTitle")}
                  </div>
                  <div style={{ color: "#94a3b8", textAlign: "center" }}>
                    {t("noActivityDescription")}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!isFetchingActivityHistory &&
          showHistory &&
          !error &&
          activityHistoryData.length > 0 &&
          activityHistoryData.map((item, index) => (
            <div key={index} style={styles.container}>
              <div style={styles.paymentHeader}>
                <div style={styles.headerSection}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      fontWeight: 600,
                      marginBottom: "2px",
                    }}
                  >
                    Module
                  </div>
                  <div style={{ fontWeight: 500 }}>
                    {item.ModuleName || "N/A"}
                  </div>
                  {item.AttributeTypeName && (
                    <>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          fontWeight: 600,
                          margin: "8px 0 2px 0",
                        }}
                      >
                        Attribute Name
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#4A90E2",
                          fontWeight: 500,
                          margin: "2px 0 6px 0",
                        }}
                      >
                        {item.AttributeTypeName}
                      </div>
                    </>
                  )}
                  <div style={styles.expectedSettlement}>
                    Created: <strong>{formatDate(item.CreatedDate)}</strong>
                  </div>
                </div>

                <div style={styles.verticalDivider}></div>

                {renderTopSection(item)}

                <div style={styles.verticalDivider}></div>

                <div
                  style={{
                    ...styles.headerSection,
                    ...styles.referenceSection,
                  }}
                >
                  <div style={styles.referenceLabel}>Master Version</div>
                  <div style={styles.referenceNumber}>
                    {item.MasterVersion || "N/A"}
                  </div>
                  <div style={styles.referenceLabel}>InProgress Version</div>
                  <div style={styles.referenceNumber}>
                    {item.DraftVersion || "N/A"}
                  </div>
                </div>
              </div>

              {/* Second Row for Escalation Sections in History */}
              {renderEscalationSection(item)}

              <div style={styles.stepper}>
                {getStepsFromActivity(item).length > 0 ? (
                  getStepsFromActivity(item).map((step, index, arr) => (
                    <div
                      key={step.id}
                      style={{
                        ...styles.stepItem,
                        opacity: step.isDisabled ? 0.5 : 1,
                        pointerEvents: step.isDisabled ? "none" : "auto",
                      }}
                    >
                      {index < arr.length - 1 && (
                        <div
                          style={{
                            ...(arr[index + 1]?.title === "Escalation Stage"
                              ? styles.dottedConnector
                              : styles.connector),
                            backgroundColor: step.isDisabled
                              ? arr[index + 1]?.title === "Escalation Stage"
                                ? "transparent"
                                : "#E0E0E0"
                              : arr[index + 1]?.title === "Escalation Stage"
                              ? "transparent"
                              : "#E0E0E0",
                            backgroundImage:
                              arr[index + 1]?.title === "Escalation Stage"
                                ? "linear-gradient(to bottom, #E0E0E0 50%, transparent 50%)"
                                : "none",
                          }}
                        ></div>
                      )}
                      <div
                        style={{
                          ...styles.stepIcon,
                          ...(step.isDisabled
                            ? { backgroundColor: "#E0E0E0", color: "#9E9E9E" }
                            : isLatestAction(
                                step.details[0]?.actionDateTime,
                                arr
                              )
                            ? styles.latestCompletedIcon
                            : step.status === "completed"
                            ? styles.completedIcon
                            : styles.pendingIcon),
                        }}
                      >
                        {step.status === "completed" && !step.isDisabled
                          ? "✓"
                          : "○"}
                      </div>
                      <div style={styles.stepContent}>
                        <div
                          style={{
                            ...styles.stepTitle,
                            ...(step.status === "completed"
                              ? styles.completedTitle
                              : styles.pendingTitle),
                          }}
                        >
                          {step.title}
                        </div>
                        {Array.isArray(step.details) &&
                          step.details.length > 0 && (
                            <div style={styles.stepDetails}>
                              {step.details.map((detail, idx) =>
                                detail.isExtraMessage ? (
                                  <div
                                    key={idx}
                                    style={{
                                      marginBottom: 8,
                                      fontWeight: 600,
                                      color: "#0ea5e9",
                                    }}
                                  >
                                    {detail.extraMessage}
                                  </div>
                                ) : (
                                  <div
                                    key={idx}
                                    style={{
                                      marginBottom: 8,
                                      backgroundColor: "#f8fafc",
                                      padding: "8px",
                                      borderRadius: "4px",
                                    }}
                                  >
                                    {/* ...existing code for normal details... */}
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "8px",
                                        width: "100%",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "12px",
                                          flex: 1,
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            minWidth: "300px",
                                          }}
                                        >
                                          <span
                                            style={{
                                              color: "#666",
                                              fontSize: "12px",
                                            }}
                                          >
                                            {detail.actionDateTime === null
                                              ? "null"
                                              : formatDate(
                                                  detail.actionDateTime
                                                )}
                                          </span>
                                          <span
                                            style={{
                                              fontWeight: 500,
                                              marginLeft: "8px",
                                            }}
                                          >
                                            {detail.name}
                                          </span>
                                        </div>
                                        <span
                                          style={{
                                            backgroundColor:
                                              detail.status.includes("Rejected")
                                                ? "#fee2e2"
                                                : detail.status.includes(
                                                    "Approved"
                                                  )
                                                ? "#dcfce7"
                                                : detail.status ===
                                                  "Has been Actioned by other User(s)"
                                                ? "#fef3c7"
                                                : "#e2e8f0",
                                            color: detail.status.includes(
                                              "Rejected"
                                            )
                                              ? "#b91c1c"
                                              : detail.status.includes(
                                                  "Approved"
                                                )
                                              ? "#166534"
                                              : detail.status ===
                                                "Has been Actioned by other User(s)"
                                              ? "#92400e"
                                              : "#475569",
                                            padding: "2px 8px",
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                            fontWeight: 500,
                                          }}
                                        >
                                          Status:{" "}
                                          {detail.status.replace("Status: ", "")}
                                        </span>
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        borderTop: "1px solid #e2e8f0",
                                        paddingTop: "8px",
                                        fontSize: "12px",
                                        color: "#475569",
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: "#666",
                                          fontWeight: "500",
                                          marginRight: "4px",
                                        }}
                                      >
                                        Comment:
                                      </span>
                                      {detail.comment.replace("Comment: ", "") ===
                                      "null"
                                        ? "No comment provided"
                                        : detail.comment.replace("Comment: ", "")}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "32px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      marginTop: "16px",
                    }}
                  >
                    <div
                      style={{
                        color: "#64748b",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      {t("noActivityTitle")}
                    </div>
                    <div style={{ color: "#94a3b8", textAlign: "center" }}>
                      {t("noActivityDescription")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

        {!isFetchingActivityHistory &&
          showHistory &&
          !error &&
          activityHistoryData.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  color: "#64748b",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                {t("noActivityHistoryFound")}
              </div>
              <div style={{ color: "#94a3b8", textAlign: "center" }}>
                {t("noActivityHistoryAvailable")}
              </div>
            </div>
          )}
      </DialogContent>

      {!isFetchingActivity && !showHistory && !error && (
        <DialogActions style={styles.dialogFooter}>
          <Button
            onClick={() => handleCloseModal(false)}
            variant="outlined"
            disabled={isDraftPublishing}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

ActivitySideBar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
  datafromsidebar: PropTypes.object,
};

ActivitySideBar.defaultProps = {
  data: {},
};

ActivitySideBar.displayName = "ActivityModal";
ActivitySideBar.defaultProps = {
  data: {},
};

ActivitySideBar.displayName = "ActivityModal";
ActivitySideBar.defaultProps = {
  data: {},
};

ActivitySideBar.displayName = "ActivityModal";

ActivitySideBar.defaultProps = {
  data: {},
};

ActivitySideBar.displayName = "ActivityModal";
ActivitySideBar.defaultProps = {
  data: {},
};

ActivitySideBar.displayName = "ActivityModal";
ActivitySideBar.defaultProps = {
  data: {},
};

ActivitySideBar.displayName = "ActivityModal";