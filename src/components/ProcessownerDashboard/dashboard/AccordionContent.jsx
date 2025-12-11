import React from "react";
import { ActivityViewHistoryApi } from "../../../services/activitysidebar/ActivitySidebar";
import Pageloader from "../../../../src/assets/image/cubeloader1.gif";

const AccordionContent = ({ rowData }) => {
  const [activityData, setActivityData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  console.log("AccordionContent rowData:", rowData);

  React.useEffect(() => {
    const fetchActivity = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = {
          ModuleID: rowData?.ModuleDraftID,
          Order: "DESC",
          IsLatestOne: true,
        };
        const response = await ActivityViewHistoryApi(payload);
        if (response?.data?.data && response.data.data.length > 0) {
          setActivityData(response.data.data[0]);
        } else {
          if (response?.data?.message) {
            setError(response.data.message);
          } else {
            setError("No activity data found.");
          }
          setActivityData(null);
        }
      } catch (err) {
        if (err?.response?.message) {
          setError(err.response.data.message);
        } else if (err?.message) {
          setError(err.message);
        } else {
          setError("Failed to fetch activity data");
        }
        setActivityData(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (rowData) fetchActivity();
  }, [rowData]);

  const getStepStatus = (arr) =>
    Array.isArray(arr) && arr.length > 0 ? "completed" : "pending";
  const shouldShowAllSteps = (activity) => {
    if (!activity) return true;
    return (
      activity.NeedAcceptanceFromStakeHolder === true ||
      activity.NeedAcceptance === true ||
      activity.NeedAcceptanceForApprover === true
    );
  };

  const hasAnyCompleted = (actions) =>
    Array.isArray(actions) && actions.some((a) => a.ActionDateTime);

  const getStepDetailsWithHasActioned = (actions) => {
    if (!Array.isArray(actions) || actions.length === 0) return [];
    const hasAnyActioned = actions.some((a) => a.ActionDateTime);
    return actions.map((user) => {
      let status;
      if (user.ActionDateTime) {
        status = `Status: ${user.ApprovalStatus || "Completed"}`;
      } else if (hasAnyActioned) {
        status = "Status: Has Actioned by other one";
      } else {
        status = "Status: Pending";
      }
      return {
        name: user.UserName,
        actionDateTime: user.ActionDateTime,
        status,
        comment: `Comment: ${user.Comment || "No comment provided"}`,
      };
    });
  };

  const getStepsFromActivity = (activity) => {
    if (!activity) return [];
    const steps = [];

    const hasActions = (actions) =>
      Array.isArray(actions) && actions.length > 0;
    const separateActionsByDate = (actions) => {
      const withDates = [];
      const withoutDates = [];

      actions.forEach((action) => {
        if (action.ActionDateTime) {
          withDates.push(action);
        } else {
          withoutDates.push(action);
        }
      });
      withDates.sort(
        (a, b) => new Date(a.ActionDateTime) - new Date(b.ActionDateTime)
      );

      return [...withDates, ...withoutDates];
    };
    const showAll = shouldShowAllSteps(activity);
    if (
      (showAll && hasActions(activity.SteakHolderActions)) ||
      (!showAll && hasAnyCompleted(activity.SteakHolderActions))
    ) {
      const sortedActions = hasActions(activity.SteakHolderActions)
        ? separateActionsByDate(activity.SteakHolderActions)
        : [];
      steps.push({
        id: 4,
        title: "Stakeholders",
        status: getStepStatus(activity.SteakHolderActions),
        isDisabled: showAll
          ? sortedActions.every((action) => !action.ActionDateTime)
          : false,
        details: getStepDetailsWithHasActioned(sortedActions),
      });
    }
    if (
      (showAll && hasActions(activity.CheckerActions)) ||
      (!showAll && hasAnyCompleted(activity.CheckerActions))
    ) {
      const sortedActions = hasActions(activity.CheckerActions)
        ? separateActionsByDate(activity.CheckerActions)
        : [];
      steps.push({
        id: 2,
        title: "Review Stage",
        status: getStepStatus(activity.CheckerActions),
        isDisabled: showAll
          ? sortedActions.every((action) => !action.ActionDateTime)
          : false,
        details: getStepDetailsWithHasActioned(sortedActions),
      });
    }
    if (
      (showAll && hasActions(activity.EscalatorActions)) ||
      (!showAll && hasAnyCompleted(activity.EscalatorActions))
    ) {
      const sortedActions = hasActions(activity.EscalatorActions)
        ? separateActionsByDate(activity.EscalatorActions)
        : [];
      steps.push({
        id: 5,
        title: "Reviewer Escalation Stage",
        status: getStepStatus(activity.EscalatorActions),
        isDisabled: showAll
          ? sortedActions.every((action) => !action.ActionDateTime)
          : false,
        details: getStepDetailsWithHasActioned(sortedActions),
        isEscalation: true, // mark for dotted line
      });
    }
    if (
      (showAll && hasActions(activity.ApproverActions)) ||
      (!showAll && hasAnyCompleted(activity.ApproverActions))
    ) {
      const sortedActions = hasActions(activity.ApproverActions)
        ? separateActionsByDate(activity.ApproverActions)
        : [];
      steps.push({
        id: 6,
        title: "Approvers",
        status: getStepStatus(activity.ApproverActions),
        isDisabled: showAll
          ? sortedActions.every((action) => !action.ActionDateTime)
          : false,
        details: getStepDetailsWithHasActioned(sortedActions),
      });
    }
    if (activity.SelfApproved === true) {
      steps.push({
        id: 7,
        title: "Self Approved",
        status: "completed",
        isDisabled: false,
      });
    }
    // Add StackHolderEscalatorActions step
    if (
      (showAll && hasActions(activity.StackHolderEscalatorActions)) ||
      (!showAll && hasAnyCompleted(activity.StackHolderEscalatorActions))
    ) {
      const sortedActions = hasActions(activity.StackHolderEscalatorActions)
        ? separateActionsByDate(activity.StackHolderEscalatorActions)
        : [];
      steps.push({
        id: 8,
        title: "StakeHolder Escalation Stage",
        status: getStepStatus(activity.StackHolderEscalatorActions),
        isDisabled: showAll
          ? sortedActions.every((action) => !action.ActionDateTime)
          : false,
        details: getStepDetailsWithHasActioned(sortedActions),
        isEscalation: true, // mark for dotted line if needed
      });
    }

    return steps.sort((a, b) => {
      const aDate = a.details?.[0]?.actionDateTime;
      const bDate = b.details?.[0]?.actionDateTime;

      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return new Date(aDate) - new Date(bDate);
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

    if (!hasChangeOwners && !hasCheckers && !hasStakeholders && !hasApprovers) {
      return null;
    }

    return (
      <>
        <div style={styles.headerSection}>
          {hasChangeOwners && (
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
          )}
        </div>

        {hasApprovers && (
          <>
            <div style={styles.verticalDivider}></div>
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
          </>
        )}

        {hasCheckers && (
          <>
            <div style={styles.verticalDivider}></div>
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
          </>
        )}

        {hasStakeholders && (
          <>
            <div style={styles.verticalDivider}></div>
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
          </>
        )}
      </>
    );
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
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    scrollArea: {
      padding: "0 16px 16px 16px",
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
      backgroundColor: "#2C64FF",
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
      backgroundColor: "#24e24dff",
      color: "#24e24dff",
    },
    pendingIcon: {
      backgroundColor: "#E0E0E0",
      color: "#9E9E9E",
    },
    latestCompletedIcon: {
      backgroundColor: "#0e24e9ff",
      color: "#0e24e9ff",
    },
    disabledIcon: {
      backgroundColor: "#f5f5f5",
      color: "#bdbdbd",
      border: "1px solid #e0e0e0",
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
    disabledTitle: {
      color: "#bdbdbd",
    },
    stepTimestamp: {
      fontSize: "11px",
      color: "#999",
      marginBottom: "6px",
    },
    stepDetails: {
      marginTop: "6px",
      paddingLeft: "12px",
      fontSize: "12px",
      color: "#666",
    },
    connector: {
      position: "absolute",
      left: "9px",
      top: "20px",
      width: "2px",
      height: "calc(100% - 20px)",
      backgroundColor: "#E0E0E0",
    },
    disabledConnector: {
      backgroundColor: "#f5f5f5",
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
    downloadButton: {
      color: "#2C64FF",
      borderColor: "rgba(44, 100, 255, 0.3)",
      backgroundColor: "rgba(44, 100, 255, 0.05)",
      "&:hover": {
        backgroundColor: "rgba(44, 100, 255, 0.1)",
        borderColor: "rgba(44, 100, 255, 0.5)",
      },
      textTransform: "none",
      fontWeight: "600",
      padding: "4px 12px",
      fontSize: "12px",
      borderRadius: "4px",
      border: "1px solid",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "4px",
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
    userItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px",
    },
    disabledContent: {
      opacity: 0.6,
    },
  };

  return (
    <div style={styles.container}>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
          }}
        >
          <img src={Pageloader} alt="Loading..." height={60} width={60} />
        </div>
      )}
      {error && (
        <div style={styles.errorOverlay}>
          <div style={styles.errorBox}>
            <div style={styles.errorTitle}>Error</div>
            <div style={styles.errorMessage}>{error}</div>
          </div>
        </div>
      )}

      <div id="accordion-activity-content" style={styles.scrollArea}>
        {!isLoading && !error && activityData && (
          <>
            <div style={styles.paymentHeader}>
              <div style={styles.headerSection}>
                {/* Add heading for Module */}
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
                <div style={{ fontWeight: "500" }}>
                  {activityData.ModuleName || "N/A"}
                </div>
                {/* Add heading for Attribute Name if present */}
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

            <div style={styles.stepper}>
              {getStepsFromActivity(activityData).length > 0 ? (
                getStepsFromActivity(activityData).map((step, index, arr) => {
                  // Determine if the next step is an escalation stage
                  const nextStep = arr[index + 1];
                  const isCurrentStepReviewOrStakeholder =
                    step.title === "Review Stage" ||
                    step.title === "Stakeholders";
                  const isNextStepEscalation =
                    nextStep &&
                    (nextStep.title === "Reviewer Escalation Stage" ||
                      nextStep.title === "StakeHolder Escalation Stage");
                  return (
                    <div
                      key={step.id}
                      style={{
                        ...styles.stepItem,
                        opacity: step.isDisabled ? 0.6 : 1,
                      }}
                    >
                      {index < arr.length - 1 && (
                        <div
                          style={
                            isCurrentStepReviewOrStakeholder &&
                              isNextStepEscalation
                              ? styles.dottedConnector
                              : styles.connector
                          }
                        ></div>
                      )}
                      <div
                        style={{
                          ...styles.stepIcon,
                          ...(step.isDisabled
                            ? styles.disabledIcon
                            : isLatestAction(
                              step.details?.[0]?.actionDateTime,
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
                          : index + 1}{" "}
                      </div>
                      <div
                        style={{
                          ...styles.stepContent,
                          ...(step.isDisabled ? styles.disabledContent : {}),
                        }}
                      >
                        <div
                          style={{
                            ...styles.stepTitle,
                            ...(step.isDisabled
                              ? styles.disabledTitle
                              : step.status === "completed"
                                ? styles.completedTitle
                                : styles.pendingTitle),
                          }}
                        >
                          {step.title}
                        </div>
                        {Array.isArray(step.details) &&
                          step.details.length > 0 && (
                            <div style={styles.stepDetails}>
                              {step.details.map((detail, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    marginBottom: 8,
                                    padding: "8px",
                                    borderRadius: "4px",
                                    backgroundColor: step.isDisabled
                                      ? "#f9f9f9"
                                      : "transparent",
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
                                            color: step.isDisabled
                                              ? "#bdbdbd"
                                              : "#666",
                                            fontSize: "12px",
                                            minWidth: "150px",
                                          }}
                                        >
                                          {detail.actionDateTime === null
                                            ? "Pending"
                                            : formatDate(detail.actionDateTime)}
                                        </span>
                                        <span
                                          style={{
                                            fontWeight: 500,
                                            marginLeft: "8px",
                                            color: step.isDisabled
                                              ? "#bdbdbd"
                                              : "#333",
                                          }}
                                        >
                                          {detail.name}
                                        </span>
                                      </div>
                                      <span
                                        style={{
                                          backgroundColor: step.isDisabled
                                            ? "#f5f5f5"
                                            : detail.status.includes("Rejected")
                                              ? "#fee2e2"
                                              : detail.status.includes("Approved")
                                                ? "#dcfce7"
                                                : detail.status.includes(
                                                  "Has Actioned by other one"
                                                )
                                                  ? "#fef3c7"
                                                  : "#e2e8f0",
                                          color: step.isDisabled
                                            ? "#bdbdbd"
                                            : detail.status.includes("Rejected")
                                              ? "#b91c1c"
                                              : detail.status.includes("Approved")
                                                ? "#166534"
                                                : detail.status.includes(
                                                  "Has Actioned by other one"
                                                )
                                                  ? "#92400e"
                                                  : "#475569",
                                          padding: "2px 8px",
                                          borderRadius: "12px",
                                          fontSize: "12px",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {detail.status.replace("Status: ", "")}
                                      </span>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      borderTop: "1px solid #e2e8f0",
                                      paddingTop: "8px",
                                      fontSize: "12px",
                                      color: step.isDisabled
                                        ? "#bdbdbd"
                                        : "#475569",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: step.isDisabled
                                          ? "#bdbdbd"
                                          : "#666",
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
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })
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
                    No Activity Data Found
                  </div>
                  <div style={{ color: "#94a3b8", textAlign: "center" }}>
                    There is no activity data available for this item.
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {!isLoading && !error && !activityData && (
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
              No Activity Data Found
            </div>
            <div style={{ color: "#94a3b8", textAlign: "center" }}>
              There is no activity data available for this item.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccordionContent;
