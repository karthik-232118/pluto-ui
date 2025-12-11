import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  Grid,
  Paper,
  Chip,
  Fade,
  Zoom,
  Avatar,
  Tooltip,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { frontendState } from "../../../store/presist/action";
import { Visibility } from "@mui/icons-material";
import { setElementID } from "../../../store/dashboardelementID/actions";
import AvatarGroup from "@mui/material/AvatarGroup";
import AccordionContent from "./AccordionContent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BellReminderIcon from "../../../../src/assets/svg/dashboard/BellReminderIcon.svg";
import { useTranslation } from "react-i18next";
const MyActionablesModal = () =>
  //   {
  //   title = "Project Alpha",
  //   dynamicDashboardData = {},
  //   PendingAcknowledgementData,
  // }
  {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [moduleTypeFilter, setModuleTypeFilter] = useState("All");
    const [createdByFilter, setCreatedByFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const dashboardState = useSelector((state) => state.dashboardAction);
    const title = dashboardState.selectedTitle || "";
    const { t } = useTranslation();
    useEffect(() => {
      console.log("Redux store dashboard data:", dashboardState);
    }, [dashboardState]);
    const formatStakeholderTooltip = useCallback((stakeholder) => {
      return (
        <div>
          <div>
            <b>{stakeholder.UserName || "-"}</b>
          </div>
          <div>Comment: {stakeholder.Comment ? stakeholder.Comment : "-"}</div>
          <div>
            Status:{" "}
            {stakeholder.ApprovalStatus
              ? stakeholder.ApprovalStatus
              : "Pending"}
          </div>
        </div>
      );
    }, []);
    const tableData = useMemo(() => {
      if (title === "Draft Pending") {
        return dashboardState?.elementStatus?.DraftState?.data || [];
      } else if (title === "Review Pending") {
        return dashboardState?.elementStatus?.PendingReview?.data || [];
      } else if (title === "Approval Pending") {
        return dashboardState?.elementStatus?.PendingApproval?.data || [];
      } else if (title === "Published") {
        return dashboardState?.elementStatus?.Approved?.data || [];
      } else if (title === "Approved") {
        return dashboardState?.elementStatus?.ToApproved?.data || [];
      } else if (title === "Review State") {
        return dashboardState?.elementStatus?.ReviewState?.data || [];
      } else if (title === "My Escalated") {
        return dashboardState?.elementStatus?.MyEscalated?.data || [];
      } else if (title === "My Completions") {
        return dashboardState?.elementStatus?.MyCompletion?.data || [];
      } else if (title === "Pending Stakeholder") {
        return dashboardState?.elementStatus?.StekHolderPending?.data || [];
      } else if (title === "To Stakeholder") {
        return dashboardState?.elementStatus?.ToStakeHolder?.data || [];
      } else if (title === "To Reviewer") {
        return dashboardState?.elementStatus?.ToReviewer?.data || [];
      } else if (title === "Reviewed") {
        return dashboardState?.elementStatus?.ToReviewed?.data || [];
      } else if (title === "Pending Acknowledgement") {
        return dashboardState?.pendingAcknowledge || [];
      } else if (title === "My rejections") {
        return dashboardState?.elementStatus?.MyRejection?.data || [];
      }
      return [];
    }, [title, dashboardState]);
    const getModuleTypes = () => {
      const types = new Set();
      tableData.forEach((item) => {
        const type = item.ModuleType || item.ElementTypeName;
        if (type) types.add(type);
      });
      return ["All", ...Array.from(types)];
    };
    const getCreators = () => {
      const creators = new Set();
      tableData.forEach((item) => {
        const creator = item.CreatedBy || item.Owner;
        if (creator) creators.add(creator);
      });
      return ["All", ...Array.from(creators)].sort();
    };
    const getDateFieldName = () => {
      switch (title) {
        case "Pending Stakeholder":
        case "Review Pending":
        case "To Stakeholder":
        case "To Reviewer":
          return "EscalationDate";
        case "Approved":
          return "ApprovedDate";
        case "Reviewed":
          return "ReviewedDate";
        case "Published":
          return "EscalationDate";
        case "Pending Acknowledgement":
          return "DueDate";
        case "My rejections":
          return "RejectedDate"; // Add this line
        default:
          return "EscalationDate";
      }
    };
    useEffect(() => {
      let result = [...tableData];
      if (moduleTypeFilter !== "All") {
        result = result.filter((item) => {
          const itemType = item.ModuleType || item.ElementTypeName;
          return itemType === moduleTypeFilter;
        });
      }
      if (dateFilter) {
        const dateField = getDateFieldName();
        const filterDate = new Date(dateFilter);
        filterDate.setHours(0, 0, 0, 0);
        result = result.filter((item) => {
          if (!item[dateField]) return false;
          const itemDate = new Date(item[dateField]);
          itemDate.setHours(0, 0, 0, 0);
          return itemDate.getTime() === filterDate.getTime();
        });
      }
      if (createdByFilter !== "All") {
        result = result.filter((item) => {
          const creator = item.CreatedBy || item.Owner;
          return creator === createdByFilter;
        });
      }
      // Sort by most recent date and time at the top
      const dateField = getDateFieldName();
      result.sort((a, b) => {
        const dateA = a[dateField] ? new Date(a[dateField]).getTime() : 0;
        const dateB = b[dateField] ? new Date(b[dateField]).getTime() : 0;
        return dateB - dateA;
      });
      setFilteredData(result);
    }, [
      tableData,
      moduleTypeFilter,
      dateFilter,
      createdByFilter,
      getDateFieldName,
    ]);

    useEffect(() => {
      setModuleTypeFilter("All");
      setDateFilter(null);
      setCreatedByFilter("All");
      setFilteredData(tableData);
    }, [title, tableData]);

    const handleViewClick = (item) => {
      dispatch(setElementID(item.ModuleDraftID, item.ModuleName));
      console.log("Item clicked:", item);
      let payload = {};
      let path = "";
      const isPendingAcknowledgement = title === "Pending Acknowledgement";
      const myActionableValue = isPendingAcknowledgement ? false : true;
      const queryParam = isPendingAcknowledgement
        ? "MyActionable=false"
        : "MyActionable=true";
      if (item.ModuleType === "SOP" || item.ElementTypeName === "SOP") {
        payload = {
          SOPID: item.ModuleDraftID || item.ElementID,
          MyActionable: myActionableValue,
        };
        path = `/sops/view?${queryParam}`;
      } else if (
        item.ModuleType === "Document" ||
        item.ElementTypeName === "Document"
      ) {
        payload = {
          DocumentID: item.ModuleDraftID || item.ElementID,
          MyActionable: myActionableValue,
          IsDraft: false,
        };
        path = `/documents/view?${queryParam}`;
      } else if (item.ElementTypeName === "TestMCQ") {
        payload = {
          TestID: item.ElementID,
          MyActionable: myActionableValue,
        };
        path = `/tests/view?${queryParam}`;
      } else {
        return;
      }

      dispatch(frontendState(payload));
      navigate(path);
    };

    useEffect(() => {
      if (title) {
        localStorage.setItem("myActionablesModalTitle", title);
      }
    }, [title]);

    const getTableHeaders = () => {
      const headers = t("tableHeaders", { returnObjects: true });

      if (!headers) return [];

      if (title === "To Stakeholder") return headers.toStakeholder || [];
      if (title === "Published") return headers.published || [];
      if (title === "To Reviewer") return headers.toReviewer || [];
      if (title === "Reviewed") return headers.reviewed || [];
      if (title === "Approved") return headers.approved || [];
      if (title === "Pending Stakeholder")
        return headers.pendingStakeholder || [];
      if (title === "Review Pending") return headers.reviewPending || [];
      if (title === "Approval Pending") return headers.approvalPending || [];
      if (title === "My Completions") return headers.myCompletions || [];
      if (title === "Pending Acknowledgement")
        return headers.pendingAcknowledgement || [];
      if (title === "My rejections")
        return (
          headers.myRejections || [
            "Element Name",
            "Action Type",
            "Rejected Date",
            "Action",
          ]
        );

      return headers.default || [];
    };

    const getDateFilterLabel = () => {
      switch (title) {
        case "Pending Stakeholder":
        case "Review Pending":
        case "To Stakeholder":
        case "To Reviewer":
        case "Pending Acknowledgement":
          return t("dateFilterLabels.dueDate");
        case "Approved":
          return t("dateFilterLabels.approvedDate");
        case "Reviewed":
          return t("dateFilterLabels.reviewedDate");
        case "Published":
          return t("dateFilterLabels.publishedDate");
        default:
          return t("dateFilterLabels.escalationDate");
      }
    };

    const getCreatedByLabel = () => {
      switch (title) {
        case "Published":
        case "Approved":
        case "Reviewed":
          return t("createdByLabels.createdBy");
        case "Pending Stakeholder":
        case "Review Pending":
        case "Approval Pending":
        case "My Completions":
          return t("createdByLabels.owner");
        default:
          return t("createdByLabels.createdBy");
      }
    };
    if (!title || !tableData || tableData.length === 0) {
      return null;
    }

    return (
      <Grid container sx={{ mb: 2, px: 2.2 }}>
        <Grid item xs={12} md={12} sm={12}>
          <Card
            sx={{
              border: "1px solid #D6E6F2",
              borderRadius: "8px",
              marginBottom: "1rem",
              backgroundColor: "#fff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fff",
                padding: "20px 20px 10px 20px",
                position: "relative",
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "#333",
                }}
              >
                {/* 📂 */}
                {title} Related Elements
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,

                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {getModuleTypes().length > 1 && (
                  <FormControl sx={{ minWidth: 160 }} size="small">
                    <InputLabel
                      id="module-type-filter-label"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {t("labels.elementType")}
                    </InputLabel>
                    <Select
                      labelId="module-type-filter-label"
                      value={moduleTypeFilter}
                      label="Element Type"
                      onChange={(e) => setModuleTypeFilter(e.target.value)}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      {getModuleTypes().map((type) => (
                        <MenuItem
                          key={type}
                          value={type}
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <TextField
                  label={getDateFilterLabel()}
                  type="date"
                  size="small"
                  value={
                    dateFilter ? dateFilter.toISOString().split("T")[0] : ""
                  }
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    setDateFilter(date);
                  }}
                  InputLabelProps={{
                    shrink: true,
                    sx: { fontSize: "0.75rem" },
                  }}
                  inputProps={{ style: { fontSize: "0.75rem" } }}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: 1,
                    minWidth: 160,
                    "& .MuiOutlinedInput-root": {
                      fontSize: "0.75rem",
                      "& fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.23)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: (theme) => theme.palette.primary.main,
                      },
                    },
                  }}
                />

                {getCreators().length > 1 && (
                  <FormControl sx={{ minWidth: 160 }} size="small">
                    <InputLabel
                      id="created-by-filter-label"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {getCreatedByLabel()}
                    </InputLabel>
                    <Select
                      labelId="created-by-filter-label"
                      value={createdByFilter}
                      label={getCreatedByLabel()}
                      onChange={(e) => setCreatedByFilter(e.target.value)}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      {getCreators().map((creator) => (
                        <MenuItem
                          key={creator}
                          value={creator}
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {creator}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                padding: theme.spacing(3),
                background: "#fff",
                minHeight: "400px",
              }}
            >
              <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                <Box>
                  <Box
                    sx={{
                      height: "400px",
                      overflow: "hidden",
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        overflow: "auto",
                        maxHeight: "400px",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "separate",
                          borderSpacing: 0,
                        }}
                      >
                        <thead
                          style={{ position: "sticky", top: 0, zIndex: 1 }}
                        >
                          <tr style={{ backgroundColor: "rgb(211, 207, 207)" }}>
                            {getTableHeaders().map((header, idx) => (
                              <th
                                key={header}
                                style={{
                                  padding: "12px",
                                  textAlign:
                                    idx === getTableHeaders().length - 1
                                      ? "center"
                                      : "left",
                                }}
                              >
                                {header}
                              </th>
                            ))}

                            {title !== "Pending Acknowledgement" && (
                              <th
                                style={{ padding: "12px", textAlign: "center" }}
                              ></th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.length === 0 ? (
                            <tr>
                              <td
                                colSpan={
                                  getTableHeaders().length +
                                  (title !== "Pending Acknowledgement" ? 1 : 0)
                                }
                                style={{
                                  textAlign: "center",
                                  padding: "32px",
                                  color: "#888",
                                  fontWeight: 500,
                                }}
                              >
                                No data found
                              </td>
                            </tr>
                          ) : (
                            filteredData.map((item, index) => {
                              const safe = (val) =>
                                val === undefined || val === null || val === ""
                                  ? "-"
                                  : val;

                              let cells = [];
                              if (
                                title === "Pending Stakeholder" ||
                                title === "Review Pending"
                              ) {
                                cells = [
                                  // Element Name + type
                                  <td
                                    key="name"
                                    style={{
                                      padding: "12px",
                                      fontWeight: 600,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Chip
                                      label={
                                        item.ModuleType === "Document"
                                          ? "Doc"
                                          : safe(item.ModuleType)
                                      }
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          item.ModuleType === "SOP"
                                            ? "#FF9800"
                                            : item.ModuleType === "Document"
                                            ? "#43A047"
                                            : "#757575",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        boxShadow: `0 2px 8px #4A90E240`,
                                        border: "none",
                                      }}
                                    />
                                    {safe(item.ModuleName)}
                                  </td>,
                                  <td
                                    key="next-actioner"
                                    style={{ padding: "12px" }}
                                  >
                                    {title === "Pending Stakeholder" &&
                                    Array.isArray(item.Approver) ? (
                                      <div>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "start",
                                          }}
                                        >
                                          <AvatarGroup max={4} spacing="medium">
                                            {item.Approver.map((user, idx) => {
                                              // Generate a color based on the index or user id
                                              const avatarColors = [
                                                "#4A90E2",
                                                "#FF9800",
                                                "#43A047",
                                                "#E91E63",
                                                "#9C27B0",
                                                "#00BCD4",
                                              ];
                                              const color =
                                                avatarColors[
                                                  user.UserID
                                                    ? Math.abs(
                                                        user.UserID.split(
                                                          ""
                                                        ).reduce(
                                                          (acc, c) =>
                                                            acc +
                                                            c.charCodeAt(0),
                                                          0
                                                        )
                                                      ) % avatarColors.length
                                                    : idx % avatarColors.length
                                                ];
                                              return (
                                                <Tooltip
                                                  key={user.UserID || idx}
                                                  title={user.UserName || "-"}
                                                  arrow
                                                >
                                                  <Avatar
                                                    sx={{
                                                      width: 32,
                                                      height: 32,
                                                      bgcolor: color,
                                                      fontSize: 14,
                                                    }}
                                                  >
                                                    {user.UserName
                                                      ? user.UserName.split(" ")
                                                          .map((n) => n[0])
                                                          .join("")
                                                          .toUpperCase()
                                                          .slice(0, 2)
                                                      : "U"}
                                                  </Avatar>
                                                </Tooltip>
                                              );
                                            })}
                                          </AvatarGroup>
                                        </div>
                                      </div>
                                    ) : title === "Review Pending" &&
                                      Array.isArray(item.Approver) ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "start",
                                        }}
                                      >
                                        <AvatarGroup max={4} spacing="medium">
                                          {item.Approver.map((user, idx) => {
                                            // Generate a color based on the index or user id
                                            const avatarColors = [
                                              "#4A90E2",
                                              "#FF9800",
                                              "#43A047",
                                              "#E91E63",
                                              "#9C27B0",
                                              "#00BCD4",
                                            ];
                                            const color =
                                              avatarColors[
                                                user.UserID
                                                  ? Math.abs(
                                                      user.UserID.split(
                                                        ""
                                                      ).reduce(
                                                        (acc, c) =>
                                                          acc + c.charCodeAt(0),
                                                        0
                                                      )
                                                    ) % avatarColors.length
                                                  : idx % avatarColors.length
                                              ];
                                            return (
                                              <Tooltip
                                                key={user.UserID || idx}
                                                title={user.UserName || "-"}
                                                arrow
                                              >
                                                <Avatar
                                                  sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: color,
                                                    fontSize: 14,
                                                  }}
                                                >
                                                  {user.UserName
                                                    ? user.UserName.split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()
                                                        .slice(0, 2)
                                                    : "U"}
                                                </Avatar>
                                              </Tooltip>
                                            );
                                          })}
                                        </AvatarGroup>
                                      </div>
                                    ) : (
                                      safe(
                                        title === "Pending Stakeholder"
                                          ? item.ActionType
                                          : item.NextActioner
                                      )
                                    )}
                                  </td>,
                                  <td key="owner" style={{ padding: "12px" }}>
                                    {title === "Pending Stakeholder"
                                      ? safe(item.CreatedBy)
                                      : title === "Review Pending"
                                      ? safe(item.CreatedBy)
                                      : safe(item.Owner)}
                                  </td>,
                                  <td
                                    key="due-date"
                                    style={{ padding: "12px" }}
                                  >
                                    {title === "Pending Stakeholder"
                                      ? item.EscalationDate
                                        ? (() => {
                                            const dateObj = new Date(
                                              item.EscalationDate
                                            );
                                            const day = dateObj.getDate();
                                            const month =
                                              dateObj.toLocaleString("en-US", {
                                                month: "short",
                                              });
                                            const year = dateObj.getFullYear();
                                            const hours = dateObj.getHours();
                                            const minutes =
                                              dateObj.getMinutes();
                                            const seconds =
                                              dateObj.getSeconds();
                                            const dateStr = `${day} ${month} ${year}`;
                                            if (
                                              hours !== 0 ||
                                              minutes !== 0 ||
                                              seconds !== 0
                                            ) {
                                              const timeStr =
                                                dateObj.toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  hour12: true,
                                                });
                                              return `${dateStr} ${timeStr}`;
                                            }
                                            return dateStr;
                                          })()
                                        : "-"
                                      : title === "Review Pending"
                                      ? item.EscalationDate
                                        ? (() => {
                                            const dateObj = new Date(
                                              item.EscalationDate
                                            );
                                            const day = dateObj.getDate();
                                            const month =
                                              dateObj.toLocaleString("en-US", {
                                                month: "short",
                                              });
                                            const year = dateObj.getFullYear();
                                            const hours = dateObj.getHours();
                                            const minutes =
                                              dateObj.getMinutes();
                                            const seconds =
                                              dateObj.getSeconds();
                                            const dateStr = `${day} ${month} ${year}`;
                                            if (
                                              hours !== 0 ||
                                              minutes !== 0 ||
                                              seconds !== 0
                                            ) {
                                              const timeStr =
                                                dateObj.toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  hour12: true,
                                                });
                                              return `${dateStr} ${timeStr}`;
                                            }
                                            return dateStr;
                                          })()
                                        : "-"
                                      : safe(item.DueDate)}
                                  </td>,
                                  <td
                                    key="view"
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <IconButton
                                      onClick={() => handleViewClick(item)}
                                      sx={{
                                        color: "#4A90E2",
                                        "&:hover": {
                                          color: "#003DA5",
                                          backgroundColor:
                                            "rgba(74, 144, 226, 0.1)",
                                        },
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        <Visibility />
                                      </Typography>
                                    </IconButton>
                                  </td>,
                                ];
                              } else if (title === "Approval Pending") {
                                cells = [
                                  <td
                                    key="name"
                                    style={{
                                      padding: "12px",
                                      fontWeight: 600,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Chip
                                      label={
                                        item.ModuleType === "Document"
                                          ? "Doc"
                                          : safe(item.ModuleType)
                                      }
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          item.ModuleType === "SOP"
                                            ? "#FF9800"
                                            : item.ModuleType === "Document"
                                            ? "#43A047"
                                            : "#757575",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        boxShadow: `0 2px 8px #4A90E240`,
                                        border: "none",
                                      }}
                                    />
                                    {safe(item.ModuleName)}
                                  </td>,
                                  <td
                                    key="reviewed-by"
                                    style={{ padding: "12px" }}
                                  >
                                    {Array.isArray(item.Checkers) ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "start",
                                        }}
                                      >
                                        <AvatarGroup max={4} spacing="medium">
                                          {item.Checkers.map((checker, idx) => {
                                            const avatarColors = [
                                              "#4A90E2",
                                              "#FF9800",
                                              "#43A047",
                                              "#E91E63",
                                              "#9C27B0",
                                              "#00BCD4",
                                            ];
                                            const color =
                                              avatarColors[
                                                checker.UserID
                                                  ? Math.abs(
                                                      checker.UserID.split(
                                                        ""
                                                      ).reduce(
                                                        (acc, c) =>
                                                          acc + c.charCodeAt(0),
                                                        0
                                                      )
                                                    ) % avatarColors.length
                                                  : idx % avatarColors.length
                                              ];
                                            return (
                                              <Tooltip
                                                key={checker.UserID || idx}
                                                title={
                                                  <div>
                                                    <div>
                                                      <b>
                                                        {checker.UserName ||
                                                          "-"}
                                                      </b>
                                                    </div>
                                                    <div>
                                                      Comment:{" "}
                                                      {checker.Comment
                                                        ? checker.Comment
                                                        : "-"}
                                                    </div>
                                                    <div>
                                                      Status:{" "}
                                                      {checker.ApprovalStatus
                                                        ? checker.ApprovalStatus
                                                        : "-"}
                                                    </div>
                                                  </div>
                                                }
                                                arrow
                                              >
                                                <Avatar
                                                  sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: color,
                                                    fontSize: 14,
                                                  }}
                                                >
                                                  {checker.UserName
                                                    ? checker.UserName.split(
                                                        " "
                                                      )
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()
                                                        .slice(0, 2)
                                                    : "U"}
                                                </Avatar>
                                              </Tooltip>
                                            );
                                          })}
                                        </AvatarGroup>
                                      </div>
                                    ) : (
                                      safe(item.ReviewedBy)
                                    )}
                                  </td>,
                                  <td key="owner" style={{ padding: "12px" }}>
                                    {safe(item.CreatedBy)}
                                  </td>,
                                  <td
                                    key="sent-date"
                                    style={{ padding: "12px" }}
                                  >
                                    {item.EscalationDate
                                      ? (() => {
                                          const dateObj = new Date(
                                            item.EscalationDate
                                          );
                                          const day = dateObj.getDate();
                                          const month = dateObj.toLocaleString(
                                            "en-US",
                                            { month: "short" }
                                          );
                                          const year = dateObj.getFullYear();
                                          const hours = dateObj.getHours();
                                          const minutes = dateObj.getMinutes();
                                          const seconds = dateObj.getSeconds();
                                          const dateStr = `${day} ${month} ${year}`;
                                          if (
                                            hours !== 0 ||
                                            minutes !== 0 ||
                                            seconds !== 0
                                          ) {
                                            const timeStr =
                                              dateObj.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              });
                                            return `${dateStr} ${timeStr}`;
                                          }
                                          return dateStr;
                                        })()
                                      : "-"}
                                  </td>,
                                  <td
                                    key="view"
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <IconButton
                                      onClick={() => handleViewClick(item)}
                                      sx={{
                                        color: "#4A90E2",
                                        "&:hover": {
                                          color: "#003DA5",
                                          backgroundColor:
                                            "rgba(74, 144, 226, 0.1)",
                                        },
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        <Visibility />
                                      </Typography>
                                    </IconButton>
                                  </td>,
                                ];
                              } else if (title === "My Completions") {
                                cells = [
                                  <td
                                    key="name"
                                    style={{
                                      padding: "12px",
                                      fontWeight: 600,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Chip
                                      label={
                                        item.ModuleType === "Document"
                                          ? "Doc"
                                          : item.ModuleType === "SOP"
                                          ? "SOP"
                                          : item.ElementTypeName
                                          ? item.ElementTypeName
                                          : "-"
                                      }
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          item.ModuleType === "SOP" ||
                                          item.ElementTypeName === "SOP"
                                            ? "#FF9800"
                                            : item.ModuleType === "Document" ||
                                              item.ElementTypeName ===
                                                "Document"
                                            ? "#43A047"
                                            : "#757575",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        boxShadow: `0 2px 8px #4A90E240`,
                                        border: "none",
                                      }}
                                    />
                                    {item.ModuleName || item.ElementName || "-"}
                                    {item.IsDeleted && (
                                      <Chip
                                        label="Deleted"
                                        size="small"
                                        sx={{
                                          backgroundColor: "#f44336",
                                          color: "#fff",
                                          fontWeight: 600,
                                          fontSize: "0.7rem",
                                          marginLeft: "8px",
                                        }}
                                      />
                                    )}
                                  </td>,
                                  <td
                                    key="actioned-by"
                                    style={{ padding: "12px" }}
                                  >
                                    {Array.isArray(item.Actioner) ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "start",
                                        }}
                                      >
                                        <AvatarGroup max={4} spacing="medium">
                                          {item.Actioner.map(
                                            (actioner, idx) => {
                                              const avatarColors = [
                                                "#4A90E2",
                                                "#FF9800",
                                                "#43A047",
                                                "#E91E63",
                                                "#9C27B0",
                                                "#00BCD4",
                                              ];
                                              const color =
                                                avatarColors[
                                                  actioner.UserID
                                                    ? Math.abs(
                                                        actioner.UserID.split(
                                                          ""
                                                        ).reduce(
                                                          (acc, c) =>
                                                            acc +
                                                            c.charCodeAt(0),
                                                          0
                                                        )
                                                      ) % avatarColors.length
                                                    : idx % avatarColors.length
                                                ];
                                              return (
                                                <Tooltip
                                                  key={actioner.UserID || idx}
                                                  title={
                                                    <div>
                                                      <div>
                                                        <b>
                                                          {actioner.UserName ||
                                                            "-"}
                                                        </b>
                                                      </div>
                                                      <div>
                                                        Comment:{" "}
                                                        {actioner.Comment
                                                          ? actioner.Comment
                                                          : "-"}
                                                      </div>
                                                      <div>
                                                        Status:{" "}
                                                        {actioner.ApprovalStatus
                                                          ? actioner.ApprovalStatus
                                                          : "-"}
                                                      </div>
                                                    </div>
                                                  }
                                                  arrow
                                                >
                                                  <Avatar
                                                    sx={{
                                                      width: 32,
                                                      height: 32,
                                                      bgcolor: color,
                                                      fontSize: 14,
                                                    }}
                                                  >
                                                    {actioner.UserName
                                                      ? actioner.UserName.split(
                                                          " "
                                                        )
                                                          .map((n) => n[0])
                                                          .join("")
                                                          .toUpperCase()
                                                          .slice(0, 2)
                                                      : "U"}
                                                  </Avatar>
                                                </Tooltip>
                                              );
                                            }
                                          )}
                                        </AvatarGroup>
                                      </div>
                                    ) : (
                                      "-"
                                    )}
                                  </td>,
                                  <td key="owner" style={{ padding: "12px" }}>
                                    {item.CreatedBy || "-"}
                                  </td>,
                                  <td
                                    key="submitted-date"
                                    style={{ padding: "12px" }}
                                  >
                                    {item.EscalationDate
                                      ? (() => {
                                          const dateObj = new Date(
                                            item.EscalationDate
                                          );
                                          const day = dateObj.getDate();
                                          const month = dateObj.toLocaleString(
                                            "en-US",
                                            { month: "short" }
                                          );
                                          const year = dateObj.getFullYear();
                                          const hours = dateObj.getHours();
                                          const minutes = dateObj.getMinutes();
                                          const seconds = dateObj.getSeconds();
                                          const dateStr = `${day} ${month} ${year}`;
                                          if (
                                            hours !== 0 ||
                                            minutes !== 0 ||
                                            seconds !== 0
                                          ) {
                                            const timeStr =
                                              dateObj.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              });
                                            return `${dateStr} ${timeStr}`;
                                          }
                                          return dateStr;
                                        })()
                                      : "-"}
                                  </td>,
                                  <td
                                    key="view"
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <IconButton
                                      onClick={() => handleViewClick(item)}
                                      sx={{
                                        color: "#4A90E2",
                                        "&:hover": {
                                          color: "#003DA5",
                                          backgroundColor:
                                            "rgba(74, 144, 226, 0.1)",
                                        },
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        <Visibility />
                                      </Typography>
                                    </IconButton>
                                  </td>,
                                ];
                              } else if (title === "To Stakeholder") {
                                cells = [
                                  // Element Name + type
                                  <td
                                    key="name"
                                    style={{
                                      padding: "12px",
                                      fontWeight: 600,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Chip
                                      label={
                                        item.ModuleType === "Document"
                                          ? "Doc"
                                          : safe(item.ModuleType)
                                      }
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          item.ModuleType === "SOP"
                                            ? "#FF9800"
                                            : item.ModuleType === "Document"
                                            ? "#43A047"
                                            : "#757575",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        boxShadow: `0 2px 8px #4A90E240`,
                                        border: "none",
                                      }}
                                    />
                                    {safe(item.ModuleName)}
                                  </td>,
                                  <td
                                    key="stakeholder-details"
                                    style={{ padding: "12px" }}
                                  >
                                    {Array.isArray(item.SteakHolders) ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "start",
                                        }}
                                      >
                                        <AvatarGroup max={4} spacing="medium">
                                          {item.SteakHolders.map(
                                            (stakeholder, idx) => {
                                              // Generate a color based on the index or user id
                                              const avatarColors = [
                                                "#4A90E2",
                                                "#FF9800",
                                                "#43A047",
                                                "#E91E63",
                                                "#9C27B0",
                                                "#00BCD4",
                                              ];
                                              const color =
                                                avatarColors[
                                                  stakeholder.UserID
                                                    ? Math.abs(
                                                        stakeholder.UserID.split(
                                                          ""
                                                        ).reduce(
                                                          (acc, c) =>
                                                            acc +
                                                            c.charCodeAt(0),
                                                          0
                                                        )
                                                      ) % avatarColors.length
                                                    : idx % avatarColors.length
                                                ];
                                              return (
                                                <Tooltip
                                                  key={
                                                    stakeholder.UserID || idx
                                                  }
                                                  title={formatStakeholderTooltip(
                                                    stakeholder
                                                  )}
                                                  arrow
                                                >
                                                  <Avatar
                                                    sx={{
                                                      width: 32,
                                                      height: 32,
                                                      bgcolor: color,
                                                      fontSize: 14,
                                                    }}
                                                  >
                                                    {stakeholder.UserName
                                                      ? stakeholder.UserName.split(
                                                          " "
                                                        )
                                                          .map((n) => n[0])
                                                          .join("")
                                                          .toUpperCase()
                                                          .slice(0, 2)
                                                      : "U"}
                                                  </Avatar>
                                                </Tooltip>
                                              );
                                            }
                                          )}
                                        </AvatarGroup>
                                      </div>
                                    ) : (
                                      "-"
                                    )}
                                  </td>,
                                  <td
                                    key="due-date"
                                    style={{ padding: "12px" }}
                                  >
                                    {item.EscalationDate
                                      ? (() => {
                                          const dateObj = new Date(
                                            item.EscalationDate
                                          );
                                          const day = dateObj.getDate();
                                          const month = dateObj.toLocaleString(
                                            "en-US",
                                            { month: "short" }
                                          );
                                          const year = dateObj.getFullYear();
                                          const hours = dateObj.getHours();
                                          const minutes = dateObj.getMinutes();
                                          const seconds = dateObj.getSeconds();
                                          const dateStr = `${day} ${month} ${year}`;
                                          if (
                                            hours !== 0 ||
                                            minutes !== 0 ||
                                            seconds !== 0
                                          ) {
                                            const timeStr =
                                              dateObj.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              });
                                            return `${dateStr} ${timeStr}`;
                                          }
                                          return dateStr;
                                        })()
                                      : "-"}
                                  </td>,
                                  <td
                                    key="view"
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <IconButton
                                      onClick={() => handleViewClick(item)}
                                      sx={{
                                        color: "#4A90E2",
                                        "&:hover": {
                                          color: "#003DA5",
                                          backgroundColor:
                                            "rgba(74, 144, 226, 0.1)",
                                        },
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        <Visibility />
                                      </Typography>
                                    </IconButton>
                                  </td>,
                                ];
                              } else if (title === "To Reviewer") {
                                cells = [
                                  // Element Name + type
                                  <td
                                    key="name"
                                    style={{
                                      padding: "12px",
                                      fontWeight: 600,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Chip
                                      label={
                                        item.ModuleType === "Document"
                                          ? "Doc"
                                          : safe(item.ModuleType)
                                      }
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          item.ModuleType === "SOP"
                                            ? "#FF9800"
                                            : item.ModuleType === "Document"
                                            ? "#43A047"
                                            : "#757575",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        boxShadow: `0 2px 8px #4A90E240`,
                                        border: "none",
                                      }}
                                    />
                                    {safe(item.ModuleName)}
                                  </td>,
                                  <td
                                    key="reviewer-details"
                                    style={{ padding: "12px" }}
                                  >
                                    {Array.isArray(item.Reviewers) &&
                                    item.Reviewers?.length > 0 ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "start",
                                        }}
                                      >
                                        <AvatarGroup max={4} spacing="medium">
                                          {item.Reviewers.map(
                                            (reviewer, idx) => {
                                              // Generate a color based on the index or user id
                                              const avatarColors = [
                                                "#4A90E2",
                                                "#FF9800",
                                                "#43A047",
                                                "#E91E63",
                                                "#9C27B0",
                                                "#00BCD4",
                                              ];
                                              const color =
                                                avatarColors[
                                                  reviewer.UserID
                                                    ? Math.abs(
                                                        reviewer.UserID.split(
                                                          ""
                                                        ).reduce(
                                                          (acc, c) =>
                                                            acc +
                                                            c.charCodeAt(0),
                                                          0
                                                        )
                                                      ) % avatarColors.length
                                                    : idx % avatarColors.length
                                                ];
                                              return (
                                                <Tooltip
                                                  key={reviewer.UserID || idx}
                                                  title={formatStakeholderTooltip(
                                                    reviewer
                                                  )}
                                                  arrow
                                                >
                                                  <Avatar
                                                    sx={{
                                                      width: 32,
                                                      height: 32,
                                                      bgcolor: color,
                                                      fontSize: 14,
                                                    }}
                                                  >
                                                    {reviewer.UserName
                                                      ? reviewer.UserName.split(
                                                          " "
                                                        )
                                                          .map((n) => n[0])
                                                          .join("")
                                                          .toUpperCase()
                                                          .slice(0, 2)
                                                      : "U"}
                                                  </Avatar>
                                                </Tooltip>
                                              );
                                            }
                                          )}
                                        </AvatarGroup>
                                      </div>
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: "#888",
                                          fontStyle: "italic",
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        N/A
                                      </Typography>
                                    )}
                                  </td>,
                                  <td
                                    key="due-date"
                                    style={{ padding: "12px" }}
                                  >
                                    {item.EscalationDate
                                      ? (() => {
                                          const dateObj = new Date(
                                            item.EscalationDate
                                          );
                                          const day = dateObj.getDate();
                                          const month = dateObj.toLocaleString(
                                            "en-US",
                                            { month: "short" }
                                          );
                                          const year = dateObj.getFullYear();
                                          const hours = dateObj.getHours();
                                          const minutes = dateObj.getMinutes();
                                          const seconds = dateObj.getSeconds();
                                          const dateStr = `${day} ${month} ${year}`;
                                          if (
                                            hours !== 0 ||
                                            minutes !== 0 ||
                                            seconds !== 0
                                          ) {
                                            const timeStr =
                                              dateObj.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              });
                                            return `${dateStr} ${timeStr}`;
                                          }
                                          return dateStr;
                                        })()
                                      : "-"}
                                  </td>,
                                  <td
                                    key="view"
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <IconButton
                                      onClick={() => handleViewClick(item)}
                                      sx={{
                                        color: "#4A90E2",
                                        "&:hover": {
                                          color: "#003DA5",
                                          backgroundColor:
                                            "rgba(74, 144, 226, 0.1)",
                                        },
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        <Visibility />
                                      </Typography>
                                    </IconButton>
                                  </td>,
                                ];
                              } else if (title === "Published") {
                                cells = [
                                  // Element Name + type
                                  <td
                                    key="name"
                                    style={{
                                      padding: "12px",
                                      fontWeight: 600,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Chip
                                      label={
                                        item.ModuleType === "Document"
                                          ? "Doc"
                                          : safe(item.ModuleType)
                                      }
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          item.ModuleType === "SOP"
                                            ? "#FF9800"
                                            : item.ModuleType === "Document"
                                            ? "#43A047"
                                            : "#757575",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        boxShadow: `0 2px 8px #4A90E240`,
                                        border: "none",
                                      }}
                                    />
                                    {safe(item.ModuleName)}
                                  </td>,
                                  <td
                                    key="published-by"
                                    style={{ padding: "12px" }}
                                  >
                                    {safe(item.CreatedBy)}
                                  </td>,
                                  <td
                                    key="published-date"
                                    style={{ padding: "12px" }}
                                  >
                                    {item.EscalationDate
                                      ? (() => {
                                          const dateObj = new Date(
                                            item.EscalationDate
                                          );
                                          const day = dateObj.getDate();
                                          const month = dateObj.toLocaleString(
                                            "en-US",
                                            { month: "short" }
                                          );
                                          const year = dateObj.getFullYear();
                                          const hours = dateObj.getHours();
                                          const minutes = dateObj.getMinutes();
                                          const seconds = dateObj.getSeconds();
                                          const dateStr = `${day} ${month} ${year}`;
                                          if (
                                            hours !== 0 ||
                                            minutes !== 0 ||
                                            seconds !== 0
                                          ) {
                                            const timeStr =
                                              dateObj.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              });
                                            return `${dateStr} ${timeStr}`;
                                          }
                                          return dateStr;
                                        })()
                                      : "-"}
                                  </td>,
                                  <td
                                    key="view"
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <IconButton
                                      onClick={() => handleViewClick(item)}
                                      sx={{
                                        color: "#4A90E2",
                                        "&:hover": {
                                          color: "#003DA5",
                                          backgroundColor:
                                            "rgba(74, 144, 226, 0.1)",
                                        },
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        <Visibility />
                                      </Typography>
                                    </IconButton>
                                  </td>,
                                ];
                              } else if (title === "Approved") {
                                cells = [
                                  // Element Name + type
                                  <td
                                    key="name"
                                    style={{
                                      padding: "12px",
                                      fontWeight: 600,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Chip
                                      label={
                                        item.ModuleType === "Document"
                                          ? "Doc"
                                          : safe(item.ModuleType)
                                      }
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          item.ModuleType === "SOP"
                                            ? "#FF9800"
                                            : item.ModuleType === "Document"
                                            ? "#43A047"
                                            : "#757575",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        boxShadow: `0 2px 8px #4A90E240`,
                                        border: "none",
                                      }}
                                    />
                                    {safe(item.ModuleName)}
                                  </td>,
                                  <td
                                    key="approved-by"
                                    style={{ padding: "12px" }}
                                  >
                                    {Array.isArray(item.ApprovedBy) &&
                                    item.ApprovedBy.length > 0 ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "start",
                                        }}
                                      >
                                        <AvatarGroup max={4} spacing="medium">
                                          {item.ApprovedBy.map(
                                            (approver, idx) => {
                                              // Generate color based on approval status
                                              const getStatusColor = (
                                                status
                                              ) => {
                                                switch (status) {
                                                  case "Approved":
                                                    return "#43A047";
                                                  case "Rejected":
                                                    return "#E91E63";
                                                  default:
                                                    return "#4A90E2";
                                                }
                                              };

                                              const avatarColors = [
                                                "#4A90E2",
                                                "#FF9800",
                                                "#43A047",
                                                "#E91E63",
                                                "#9C27B0",
                                                "#00BCD4",
                                              ];

                                              // Use approval status color or generate based on UserID
                                              const color =
                                                approver.ApprovalStatus
                                                  ? getStatusColor(
                                                      approver.ApprovalStatus
                                                    )
                                                  : avatarColors[
                                                      approver.UserID
                                                        ? Math.abs(
                                                            approver.UserID.split(
                                                              ""
                                                            ).reduce(
                                                              (acc, c) =>
                                                                acc +
                                                                c.charCodeAt(0),
                                                              0
                                                            )
                                                          ) %
                                                          avatarColors.length
                                                        : idx %
                                                          avatarColors.length
                                                    ];
                                              return (
                                                <Tooltip
                                                  key={approver.UserID || idx}
                                                  title={formatStakeholderTooltip(
                                                    approver
                                                  )}
                                                  arrow
                                                >
                                                  <Avatar
                                                    sx={{
                                                      width: 32,
                                                      height: 32,
                                                      bgcolor: color,
                                                      fontSize: 14,
                                                      border:
                                                        approver.ApprovalStatus ===
                                                        "Approved"
                                                          ? "2px solid #43A047"
                                                          : approver.ApprovalStatus ===
                                                            "Rejected"
                                                          ? "2px solid #E91E63"
                                                          : "none",
                                                    }}
                                                  >
                                                    {approver.UserName
                                                      ? approver.UserName.split(
                                                          " "
                                                        )
                                                          .map((n) => n[0])
                                                          .join("")
                                                          .toUpperCase()
                                                          .slice(0, 2)
                                                      : "U"}
                                                  </Avatar>
                                                </Tooltip>
                                              );
                                            }
                                          )}
                                        </AvatarGroup>
                                      </div>
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: "#888",
                                          fontStyle: "italic",
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        N/A
                                      </Typography>
                                    )}
                                  </td>,
                                  <td
                                    key="approved-date"
                                    style={{ padding: "12px" }}
                                  >
                                    {item.ApprovedDate
                                      ? (() => {
                                          const dateObj = new Date(
                                            item.ApprovedDate
                                          );
                                          const day = dateObj.getDate();
                                          const month = dateObj.toLocaleString(
                                            "en-US",
                                            { month: "short" }
                                          );
                                          const year = dateObj.getFullYear();
                                          const hours = dateObj.getHours();
                                          const minutes = dateObj.getMinutes();
                                          const seconds = dateObj.getSeconds();
                                          const dateStr = `${day} ${month} ${year}`;
                                          if (
                                            hours !== 0 ||
                                            minutes !== 0 ||
                                            seconds !== 0
                                          ) {
                                            const timeStr =
                                              dateObj.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              });
                                            return `${dateStr} ${timeStr}`;
                                          }
                                          return dateStr;
                                        })()
                                      : "-"}
                                  </td>,

                                  <td
                                    key="view"
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <IconButton
                                      onClick={() => handleViewClick(item)}
                                      sx={{
                                        color: "#4A90E2",
                                        "&:hover": {
                                          color: "#003DA5",
                                          backgroundColor:
                                            "rgba(74, 144, 226, 0.1)",
                                        },
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        <Visibility />
                                      </Typography>
                                    </IconButton>
                                  </td>,
                                ];
                              } else if (title === "My rejections") {
                                cells = [
                                  // Element Name + type
                                  <td
                                    key="name"
                                    style={{
                                      padding: "12px",
                                      fontWeight: 600,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Chip
                                      label={
                                        item.ModuleType === "Document"
                                          ? "Doc"
                                          : safe(item.ModuleType)
                                      }
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          item.ModuleType === "SOP"
                                            ? "#FF9800"
                                            : item.ModuleType === "Document"
                                            ? "#43A047"
                                            : "#757575",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        boxShadow: `0 2px 8px #4A90E240`,
                                        border: "none",
                                      }}
                                    />
                                    {safe(item.ModuleName)}
                                  </td>,
                                  <td
                                    key="action-type"
                                    style={{ padding: "12px" }}
                                  >
                                    {safe(item.ActionType)}
                                  </td>,
                                  <td
                                    key="rejected-date"
                                    style={{ padding: "12px" }}
                                  >
                                    {item.RejectedDate
                                      ? (() => {
                                          const dateObj = new Date(
                                            item.RejectedDate
                                          );
                                          const day = dateObj.getDate();
                                          const month = dateObj.toLocaleString(
                                            "en-US",
                                            {
                                              month: "short",
                                            }
                                          );
                                          const year = dateObj.getFullYear();
                                          const hours = dateObj.getHours();
                                          const minutes = dateObj.getMinutes();
                                          const seconds = dateObj.getSeconds();
                                          const dateStr = `${day} ${month} ${year}`;
                                          if (
                                            hours !== 0 ||
                                            minutes !== 0 ||
                                            seconds !== 0
                                          ) {
                                            const timeStr =
                                              dateObj.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              });
                                            return `${dateStr} ${timeStr}`;
                                          }
                                          return dateStr;
                                        })()
                                      : "-"}
                                  </td>,
                                  <td
                                    key="view"
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <IconButton
                                      onClick={() => handleViewClick(item)}
                                      sx={{
                                        color: "#4A90E2",
                                        "&:hover": {
                                          color: "#003DA5",
                                          backgroundColor:
                                            "rgba(74, 144, 226, 0.1)",
                                        },
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        <Visibility />
                                      </Typography>
                                    </IconButton>
                                  </td>,
                                ];
                              } else if (title === "Reviewed") {
                                cells = [
                                  // Element Name + type
                                  <td
                                    key="name"
                                    style={{
                                      padding: "12px",
                                      fontWeight: 600,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Chip
                                      label={
                                        item.ModuleType === "Document"
                                          ? "Doc"
                                          : safe(item.ModuleType)
                                      }
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          item.ModuleType === "SOP"
                                            ? "#FF9800"
                                            : item.ModuleType === "Document"
                                            ? "#43A047"
                                            : "#757575",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        boxShadow: `0 2px 8px #4A90E240`,
                                        border: "none",
                                      }}
                                    />
                                    {safe(item.ModuleName)}
                                  </td>,
                                  <td
                                    key="reviewed-by"
                                    style={{ padding: "12px" }}
                                  >
                                    {Array.isArray(item.ReviewedBy) &&
                                    item.ReviewedBy.length > 0 ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "start",
                                        }}
                                      >
                                        <AvatarGroup max={4} spacing="medium">
                                          {item.ReviewedBy.map(
                                            (reviewer, idx) => {
                                              // Generate color based on approval status
                                              const getStatusColor = (
                                                status
                                              ) => {
                                                switch (status) {
                                                  case "Approved":
                                                    return "#43A047";
                                                  case "Rejected":
                                                    return "#E91E63";
                                                  default:
                                                    return "#4A90E2";
                                                }
                                              };

                                              const color =
                                                reviewer.ApprovalStatus
                                                  ? getStatusColor(
                                                      reviewer.ApprovalStatus
                                                    )
                                                  : "#4A90E2";

                                              return (
                                                <Tooltip
                                                  key={reviewer.UserID || idx}
                                                  title={
                                                    <div>
                                                      <div>
                                                        <b>
                                                          {reviewer.UserName ||
                                                            "-"}
                                                        </b>
                                                      </div>
                                                      <div>
                                                        Comment:{" "}
                                                        {reviewer.Comment
                                                          ? reviewer.Comment
                                                          : "-"}
                                                      </div>
                                                      <div>
                                                        Status:{" "}
                                                        <span
                                                          style={{
                                                            color: color,
                                                            fontWeight: "bold",
                                                          }}
                                                        >
                                                          {reviewer.ApprovalStatus ||
                                                            "-"}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  }
                                                  arrow
                                                >
                                                  <Avatar
                                                    sx={{
                                                      width: 32,
                                                      height: 32,
                                                      bgcolor: color,
                                                      fontSize: 14,
                                                      border:
                                                        reviewer.ApprovalStatus ===
                                                        "Approved"
                                                          ? "2px solid #43A047"
                                                          : reviewer.ApprovalStatus ===
                                                            "Rejected"
                                                          ? "2px solid #E91E63"
                                                          : "none",
                                                    }}
                                                  >
                                                    {reviewer.UserName
                                                      ? reviewer.UserName.split(
                                                          " "
                                                        )
                                                          .map((n) => n[0])
                                                          .join("")
                                                          .toUpperCase()
                                                          .slice(0, 2)
                                                      : "U"}
                                                  </Avatar>
                                                </Tooltip>
                                              );
                                            }
                                          )}
                                        </AvatarGroup>
                                      </div>
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: "#888",
                                          fontStyle: "italic",
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        N/A
                                      </Typography>
                                    )}
                                  </td>,
                                  <td
                                    key="reviewed-date"
                                    style={{ padding: "12px" }}
                                  >
                                    {item.ReviewedDate
                                      ? (() => {
                                          const dateObj = new Date(
                                            item.ReviewedDate
                                          );
                                          const day = dateObj.getDate();
                                          const month = dateObj.toLocaleString(
                                            "en-US",
                                            { month: "short" }
                                          );
                                          const year = dateObj.getFullYear();
                                          const hours = dateObj.getHours();
                                          const minutes = dateObj.getMinutes();
                                          const seconds = dateObj.getSeconds();
                                          const dateStr = `${day} ${month} ${year}`;
                                          if (
                                            hours !== 0 ||
                                            minutes !== 0 ||
                                            seconds !== 0
                                          ) {
                                            const timeStr =
                                              dateObj.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              });
                                            return `${dateStr} ${timeStr}`;
                                          }
                                          return dateStr;
                                        })()
                                      : "-"}
                                  </td>,
                                  <td
                                    key="view"
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <IconButton
                                      onClick={() => handleViewClick(item)}
                                      sx={{
                                        color: "#4A90E2",
                                        "&:hover": {
                                          color: "#003DA5",
                                          backgroundColor:
                                            "rgba(74, 144, 226, 0.1)",
                                        },
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        <Visibility />
                                      </Typography>
                                    </IconButton>
                                  </td>,
                                ];
                              } else if (title === "Pending Acknowledgement") {
                                cells = [
                                  // Element Name + type
                                  <td
                                    key="name"
                                    style={{
                                      padding: "12px",
                                      fontWeight: 600,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <Chip
                                      label={
                                        item.ElementTypeName === "Document"
                                          ? "Doc"
                                          : item.ElementTypeName === "TestMCQ"
                                          ? "MCQ"
                                          : safe(item.ElementTypeName)
                                      }
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          item.ElementTypeName === "SOP"
                                            ? "#FF9800"
                                            : item.ElementTypeName ===
                                              "Document"
                                            ? "#43A047"
                                            : item.ElementTypeName === "TestMCQ"
                                            ? "#9C27B0"
                                            : "#757575",
                                        color: "#fff",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        boxShadow: `0 2px 8px #4A90E240`,
                                        border: "none",
                                      }}
                                    />
                                    {safe(item.ElementName)}
                                  </td>,
                                  <td
                                    key="due-date"
                                    style={{ padding: "12px" }}
                                  >
                                    {item.DueDate
                                      ? (() => {
                                          const dateObj = new Date(
                                            item.DueDate
                                          );
                                          const day = dateObj.getDate();
                                          const month = dateObj.toLocaleString(
                                            "en-US",
                                            { month: "short" }
                                          );
                                          const year = dateObj.getFullYear();
                                          const hours = dateObj.getHours();
                                          const minutes = dateObj.getMinutes();
                                          const seconds = dateObj.getSeconds();
                                          const dateStr = `${day} ${month} ${year}`;
                                          if (
                                            hours !== 0 ||
                                            minutes !== 0 ||
                                            seconds !== 0
                                          ) {
                                            const timeStr =
                                              dateObj.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              });
                                            return `${dateStr} ${timeStr}`;
                                          }
                                          return dateStr;
                                        })()
                                      : "-"}
                                  </td>,
                                  <td
                                    key="view"
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <IconButton
                                      onClick={() =>
                                        handleViewClick({
                                          ModuleDraftID: item.ElementID,
                                          ModuleName: item.ElementName,
                                          ModuleType: item.ElementTypeName,
                                        })
                                      }
                                      sx={{
                                        color: "#4A90E2",
                                        "&:hover": {
                                          color: "#003DA5",
                                          backgroundColor:
                                            "rgba(74, 144, 226, 0.1)",
                                        },
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        <Visibility />
                                      </Typography>
                                    </IconButton>
                                  </td>,
                                ];
                              }

                              return (
                                <React.Fragment key={index}>
                                  <tr style={{ borderBottom: "none" }}>
                                    {cells.length > 0 ? (
                                      <>
                                        {cells}
                                        {title !==
                                          "Pending Acknowledgement" && (
                                          <td
                                            style={{
                                              padding: "12px",
                                              textAlign: "center",
                                              verticalAlign: "top",
                                            }}
                                          >
                                            <IconButton>
                                              <Tooltip
                                                title={t("tooltips.reminder")}
                                              >
                                                <img
                                                  height={30}
                                                  width={30}
                                                  src={BellReminderIcon}
                                                  alt="Reminder"
                                                />
                                              </Tooltip>
                                            </IconButton>
                                            <IconButton
                                              onClick={() =>
                                                setExpandedRow(
                                                  expandedRow === index
                                                    ? null
                                                    : index
                                                )
                                              }
                                              aria-label="expand row"
                                              size="small"
                                            >
                                              <Tooltip
                                                title={t("tooltips.activity")}
                                              >
                                                <ExpandMoreIcon
                                                  style={{
                                                    transform:
                                                      expandedRow === index
                                                        ? "rotate(180deg)"
                                                        : "rotate(0deg)",
                                                    transition:
                                                      "transform 0.2s",
                                                  }}
                                                />
                                              </Tooltip>
                                            </IconButton>
                                          </td>
                                        )}
                                      </>
                                    ) : (
                                      <td
                                        colSpan={
                                          getTableHeaders().length +
                                          (title !== "Pending Acknowledgement"
                                            ? 1
                                            : 0)
                                        }
                                        style={{
                                          textAlign: "center",
                                          padding: "32px",
                                          color: "#888",
                                          fontWeight: 500,
                                        }}
                                      >
                                        No data found
                                      </td>
                                    )}
                                  </tr>

                                  {title !== "Pending Acknowledgement" &&
                                    expandedRow === index && (
                                      <tr>
                                        <td
                                          colSpan={getTableHeaders().length + 1}
                                          style={{
                                            background: "#f7fafd",
                                            padding: 0,
                                            borderBottom: "1px solid #e0e0e0",
                                          }}
                                        >
                                          <AccordionContent rowData={item} />
                                        </td>
                                      </tr>
                                    )}
                                </React.Fragment>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </Box>
                  </Box>
                </Box>
              </Zoom>
            </Box>
          </Card>
        </Grid>
      </Grid>
    );
  };

export default MyActionablesModal;
