import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Modal,
  List,
  ListItem,
  Skeleton,
  Card,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Fade,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { GetNotification } from "../../store/notification/action";
import { setLinkedData } from "../../store/notificationLinkedIDandName/actions";
import moment from "moment-timezone";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Notifications as NotificationsIcon,
  ArrowForwardIos,
  Description,
  Quiz,
  School,
  Assignment,
  RequestPage,
  AccessTime,
} from "@mui/icons-material";
import { useTheme } from "@mui/styles";
import {
  GetCountUnreadApi,
  NotificationCountApi,
} from "../../services/notification/notification";
import { frontendState } from "../../store/presist/action";

const formatDateShort = (utcDateString) => {
  if (!utcDateString) return "";
  return moment(utcDateString).tz("Asia/Kolkata").format("DD MMM YYYY, h:mm A");
};

const getNotificationIcon = (type) => {
  const iconProps = { sx: { fontSize: 18 } };
  switch (type) {
    case "Document":
      return <Description {...iconProps} />;
    case "TrainingSimulation":
      return <School {...iconProps} />;
    case "TestSimulation":
    case "TestMCQ":
      return <Quiz {...iconProps} />;
    case "SOP":
      return <Assignment {...iconProps} />;
    case "MyRequest":
      return <RequestPage {...iconProps} />;
    default:
      return <NotificationsIcon {...iconProps} />;
  }
};

const getChipStyles = (type) => {
  const styles = {
    Document: {
      color: "#6366F1",
      backgroundColor: "#EEF2FF",
      borderColor: "#C7D2FE",
    },
    TrainingSimulation: {
      color: "#059669",
      backgroundColor: "#ECFDF5",
      borderColor: "#A7F3D0",
    },
    TestSimulation: {
      color: "#DC2626",
      backgroundColor: "#FEF2F2",
      borderColor: "#FECACA",
    },
    TestMCQ: {
      color: "#EA580C",
      backgroundColor: "#FFF7ED",
      borderColor: "#FED7AA",
    },
    SOP: {
      color: "#7C3AED",
      backgroundColor: "#F3E8FF",
      borderColor: "#DDD6FE",
    },
    MyRequest: {
      color: "#0891B2",
      backgroundColor: "#F0F9FF",
      borderColor: "#BAE6FD",
    },
  };

  return (
    styles[type] || {
      color: "#6B7280",
      backgroundColor: "#F9FAFB",
      borderColor: "#E5E7EB",
    }
  );
};

const getNotificationChip = (linkedType) => {
  const typeMap = {
    SOP: { label: "SOP", fullLabel: "Standard Operating Procedure" },
    TrainingSimulation: { label: "Training", fullLabel: "Training Simulation" },
    TestSimulation: { label: "Test", fullLabel: "Test Simulation" },
    TestMCQ: { label: "MCQ Test", fullLabel: "Multiple Choice Questions Test" },
    Document: { label: "Document", fullLabel: "Document" },
    MyRequest: { label: "Request", fullLabel: "My Request" },
  };

  const typeInfo = typeMap[linkedType] || {
    label: "Notification",
    fullLabel: "Notification",
  };

  const chipStyles = getChipStyles(linkedType);

  return (
    <Tooltip title={typeInfo.fullLabel} arrow placement="top">
      <Chip
        icon={getNotificationIcon(linkedType)}
        label={typeInfo.label}
        size="small"
        variant="outlined"
        sx={{
          fontWeight: 600,
          color: chipStyles.color,
          backgroundColor: chipStyles.backgroundColor,
          borderColor: chipStyles.borderColor,
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: "12px",
          fontSize: "10px",
          height: "24px",
          minHeight: "24px",
          transition: "all 0.2s ease-in-out",
          "& .MuiChip-icon": {
            color: chipStyles.color,
            fontSize: "14px",
            marginLeft: "6px",
          },
          "& .MuiChip-label": {
            paddingLeft: "4px",
            paddingRight: "8px",
            fontWeight: 600,
          },
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: `0 4px 12px ${chipStyles.color}20`,
          },
        }}
      />
    </Tooltip>
  );
};

const NotificationModal = ({ open, onClose, onNotificationCountUpdate }) => {
  const modalRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { notification, loading } = useSelector((state) => state.notification);
  const topNotifications = notification?.slice(0, 5);
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleNotificationClick = async (
    linkedType,
    linkedID,
    notificationID,
    notificationType
  ) => {
    console.log("NotificationID:", notificationID);
    await GetCountUnreadApi({ NotificationID: notificationID });
    try {
      const response = await NotificationCountApi();
      if (response?.data?.count !== undefined) {
        localStorage.setItem("notification_count", response.data.count);
        if (onNotificationCountUpdate) {
          onNotificationCountUpdate(response.data.count);
        }
      }
    } catch (error) {
      console.error("Error updating notification count:", error);
    }
    dispatch(setLinkedData({ linkedType, linkedID }));
    onClose();
    switch (linkedType) {
      case "SOP":
        navigate("/sops/view?MyActionable=true");
        break;
      case "TrainingSimulation":
        navigate("/training-simulations/view");
        break;
      case "TestSimulation":
        navigate("/test-simulations/view");
        break;
      case "TestMCQ":
        navigate("/test-mcqs/view");
        break;
      case "Document": {
        const frontendStatePayload = {
          DocumentID: linkedID,
          MyActionable: true,
        };
        if (notificationType === "assignment") {
          frontendStatePayload.IsDraft = true;
        }
        dispatch(frontendState(frontendStatePayload));
        navigate("/documents/view?MyActionable=true");
        break;
      }
      case "MyRequest":
        navigate("/my-request");
        break;
      default:
        console.log("No matching route found for ModuleName:", linkedType);
    }
  };
  const getAvatarColor = (name) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FECA57",
      "#FF9FF3",
      "#54A0FF",
      "#5F27CD",
      "#00D2D3",
      "#FF9F43",
    ];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        pt: 1,
      }}
      closeAfterTransition
    >
      <Fade in={open} timeout={300}>
        <Card
          ref={modalRef}
          sx={{
            width: "420px",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: 0,
            position: "absolute",
            top: "70px",
            right: "20px",
            boxShadow:
              "0px 20px 60px rgba(0, 0, 0, 0.15), 0px 0px 0px 1px rgba(255, 255, 255, 0.05)",
            maxHeight: "85vh",
            overflowY: "auto",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: "10px",
              "&:hover": {
                background: "#a8a8a8",
              },
            },
            "&:before": {
              content: '""',
              position: "absolute",
              top: "-12px",
              right: "30px",
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderBottom: "12px solid #ffffff",
              filter: "drop-shadow(0 -3px 3px rgba(0, 0, 0, 0.1))",
            },
          }}
        >
          {/* Enhanced Header */}
          <Box
            sx={{
              background:
                bgcolor || "linear-gradient(to top, #2C64FF, #4A90E2)",
              padding: "20px 24px",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
              },
            }}
          >
            {/* Decorative circles */}
            <Box
              sx={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "-30px",
                left: "-30px",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <IconButton
                sx={{
                  color: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  marginRight: "16px",
                  width: "44px",
                  height: "44px",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <NotificationsIcon sx={{ fontSize: "20px" }} />
              </IconButton>

              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="#ffffff"
                  sx={{
                    fontSize: "18px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {t("notifications")}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "12px",
                  }}
                >
                  {topNotifications?.length || 0} {t("recentNotifications")}
                </Typography>
              </Box>

              <Typography
                variant="subtitle2"
                sx={{
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: 400,
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    transform: "translateX(-2px)",
                  },
                }}
                onClick={() => {
                  const requestBody = {
                    Limit: 500,
                    Page: 1,
                  };
                  dispatch(GetNotification(requestBody));
                  onClose();
                  navigate("/notifications");
                }}
              >
                {t("see_all")}
                <ArrowForwardIos sx={{ fontSize: "10px", ml: 0.5 }} />
              </Typography>
            </Box>
          </Box>

          <List sx={{ padding: 0 }}>
            {loading ? (
              Array.from(new Array(5)).map((_, index) => (
                <ListItem key={index} sx={{ padding: "20px 24px" }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Skeleton
                      variant="circular"
                      width={48}
                      height={48}
                      sx={{ mr: 2, flexShrink: 0 }}
                    />
                    <Box sx={{ width: "100%" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Skeleton
                          width={60}
                          height={20}
                          sx={{ mr: 1, borderRadius: "12px" }}
                        />
                        <Skeleton width={120} height={16} />
                      </Box>
                      <Skeleton width="90%" height={18} sx={{ mb: 1 }} />
                      <Skeleton width="60%" height={14} />
                    </Box>
                  </Box>
                </ListItem>
              ))
            ) : topNotifications?.length > 0 ? (
              topNotifications.map((notif, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      padding: "20px 24px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      position: "relative",
                      "&:hover": {
                        backgroundColor: "rgba(102, 126, 234, 0.04)",
                        transform: "translateX(4px)",
                        "&::before": {
                          opacity: 1,
                          transform: "scaleY(1)",
                        },
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "4px",
                        backgroundColor: "#667eea",
                        opacity: 0,
                        transform: "scaleY(0)",
                        transition: "all 0.3s ease",
                        transformOrigin: "center",
                      },
                    }}
                    onClick={() =>
                      handleNotificationClick(
                        notif.LinkedType,
                        notif.LinkedID,
                        notif.NotificationID,
                        notif.NotificationType
                      )
                    }
                  >
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      {/* Enhanced Avatar */}
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: getAvatarColor(
                            `${notif?.CreatedByUser?.UserFirstName} ${notif?.CreatedByUser?.UserLastName}`
                          ),
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#ffffff",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          border: "3px solid #ffffff",
                          flexShrink: 0,
                        }}
                      >
                        {`${
                          notif?.CreatedByUser?.UserFirstName?.charAt(0) || ""
                        }${
                          notif?.CreatedByUser?.UserLastName?.charAt(0) || ""
                        }`}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            {getNotificationChip(notif.LinkedType)}
                            <Tooltip
                              title={`${notif?.CreatedByUser?.UserFirstName} ${notif?.CreatedByUser?.UserLastName}`}
                            >
                              <Typography
                                variant="p"
                                fontWeight={600}
                                sx={{
                                  color: "#1a1a1a",
                                  fontSize: "14px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {`${notif?.CreatedByUser?.UserFirstName} ${notif?.CreatedByUser?.UserLastName}`}
                              </Typography>
                            </Tooltip>
                          </Box>
                        </Box>

                        {notif.LinkedTitle && (
                          <Typography
                            variant="subtitle"
                            sx={{
                              color: "#111827",
                              fontWeight: 600,
                              fontSize: "14px",
                              mb: 0.5,
                              lineHeight: 1.4,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {notif.LinkedTitle}
                          </Typography>
                        )}

                        <Typography
                          variant="body2"
                          sx={{
                            color: "#4B5563",
                            mb: 0,
                            lineHeight: 1.5,
                            fontSize: "13px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {notif.Message}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 0,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#6B7280",
                              fontSize: "11px",
                              fontWeight: 400,
                              backgroundColor: "#eef3f7ff",
                              padding: "2px 6px",
                              borderRadius: "8px",
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                              width: "fit-content",
                            }}
                          >
                            <AccessTime sx={{ fontSize: "10px", mr: 0.5 }} />
                            {formatDateShort(notif?.CreatedDate)}
                          </Box>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              color: "#667eea",
                              fontSize: "11px",
                              fontWeight: 400,
                              padding: "4px 10px",
                              borderRadius: "16px",
                              backgroundColor: "rgba(102, 126, 234, 0.1)",
                              transition: "all 0.2s ease",
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "rgba(102, 126, 234, 0.15)",
                                transform: "translateX(2px)",
                              },
                            }}
                          >
                            {t("view_details")}
                            <ArrowForwardIos
                              sx={{ fontSize: "9px", ml: 0.5 }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < topNotifications.length - 1 && (
                    <Divider
                      sx={{
                        margin: "0 24px",
                        borderColor: "rgba(0, 0, 0, 0.08)",
                      }}
                    />
                  )}
                </React.Fragment>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 6,
                  px: 3,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <NotificationsIcon
                    sx={{
                      fontSize: 36,
                      color: "#9CA3AF",
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    color: "#374151",
                    mb: 1,
                    fontSize: "16px",
                  }}
                >
                  {t("No notifications yet")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                    textAlign: "center",
                    fontSize: "13px",
                  }}
                >
                  {t("no_notifications")}
                </Typography>
              </Box>
            )}
          </List>
        </Card>
      </Fade>
    </Modal>
  );
};

export default NotificationModal;

NotificationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onNotificationCountUpdate: PropTypes.func,
};
