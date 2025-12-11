import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Tabs,
  Tab,
  Badge,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { GetNotification } from "../../store/notification/action";
import { useNavigate } from "react-router";
import { setLinkedData } from "../../store/notificationLinkedIDandName/actions";
import BackgroundMeshBox from "../../common/meshbackground/BackgroundMeshBox";
import { useTranslation } from "react-i18next";
import Pageloader from "../../assets/image/cubeloader1.gif";
import { useHeadingBgColor } from "../useHeadingBgColor";
import moment from "moment-timezone";
import {
  GetCountUnreadApi,
  NotificationCountApi,
} from "../../services/notification/notification";
import { frontendState } from "../../store/presist/action";

const formatDateShort = (utcDateString) => {
  if (!utcDateString) return "";
  return moment(utcDateString).tz("Asia/Kolkata").format("DD MMM YYYY, h:mm A");
};

const AllNotificationsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notification } = useSelector((state) => state.notification);
  const [loading, setLoading] = useState(true);
  const bgColor = useHeadingBgColor();
  const [activeTab, setActiveTab] = useState(0);
  const [readNotifications, setReadNotifications] = useState(() => {
    const storedReadNotifications = localStorage.getItem("readNotifications");
    return storedReadNotifications ? JSON.parse(storedReadNotifications) : {};
  });

  useEffect(() => {
    if (notification && notification.length > 0) {
      setLoading(false);
      return;
    }
    const requestBody = {
      Limit: 500,
      Page: 1,
    };
    dispatch(GetNotification(requestBody)).then((action) => {
      console.log("Notification API response:", action.payload);

      const initialReadStatus = { ...readNotifications };
      action.payload?.forEach((notif) => {
        if (!(notif.LinkedID in initialReadStatus)) {
          initialReadStatus[notif.LinkedID] = false;
        }
      });
      setReadNotifications(initialReadStatus);
      localStorage.setItem(
        "readNotifications",
        JSON.stringify(initialReadStatus)
      );
      setLoading(false);
    });
  }, []);

  const handleNotificationClick = async (
    linkedType,
    linkedID,
    notificationID
  ) => {
    await GetCountUnreadApi({ NotificationID: notificationID });
    try {
      const response = await NotificationCountApi();
      if (response?.data?.count !== undefined) {
        localStorage.setItem("notification_count", response.data.count);
      }
    } catch (error) {
      console.error("Error updating notification count:", error);
    }
    dispatch(setLinkedData({ linkedType, linkedID }));
    const updatedReadNotifications = {
      ...readNotifications,
      [linkedID]: true,
    };
    setReadNotifications(updatedReadNotifications);
    localStorage.setItem(
      "readNotifications",
      JSON.stringify(updatedReadNotifications)
    );
    switch (linkedType) {
      case "SOP":
        navigate("/sops/view");
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
      case "Document":
          dispatch(
                  frontendState({
                    DocumentID: linkedID,
                    MyActionable: true,
                     IsDraft: true,
                  })
                );
       navigate("/documents/view?MyActionable=true");

        break;
      case "MyRequest":
        navigate("/my-request");
        break;
      default:
        console.log("No matching route found for ModuleName:", linkedType);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getFilteredNotifications = () => {
    if (!notification) return [];

    switch (activeTab) {
      case 0:
        return notification;
      case 1:
        return notification.filter(
          (notif) => !readNotifications[notif.LinkedID]
        );
      case 2:
        return notification.filter(
          (notif) => readNotifications[notif.LinkedID]
        );
      default:
        return notification;
    }
  };

  const unreadCount = notification
    ? notification.filter((notif) => !readNotifications[notif.LinkedID]).length
    : 0;
  const readCount = notification
    ? notification.filter((notif) => readNotifications[notif.LinkedID]).length
    : 0;
  const totalCount = notification ? notification.length : 0;

  const filteredNotifications = getFilteredNotifications();

  const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </div>
  );

  return (
    <BackgroundMeshBox sx={{ height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            padding: "24px 34px 0 34px",
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", color: bgColor, mb: 3 }}
          >
            {t("all_notifications")}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              backgroundColor: "transparent",
              borderRadius: "12px",
              overflow: "hidden",
              mb: 2,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                backgroundColor: "#f5f7ff",
                borderRadius: "12px",
                "& .MuiTabs-indicator": {
                  height: "100%",
                  borderRadius: "10px",
                  backgroundColor: bgColor,
                  zIndex: 0,
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                  minHeight: "48px",
                  borderRadius: "10px",
                  margin: "4px",
                  zIndex: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(1, 18, 117, 0.08)",
                  },
                  "&.Mui-selected": {
                    color: "white",
                    fontWeight: "700",
                  },
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {t("label_all")}
                    <Badge
                      badgeContent={totalCount}
                      color="primary"
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor:
                            activeTab === 0 ? "rgba(255,255,255,0.2)" : bgColor,
                          color: activeTab === 0 ? "white" : "white",
                          fontSize: "10px",
                          minWidth: "18px",
                          height: "18px",
                          marginRight: "-10px",
                        },
                      }}
                    />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {t("unread")}
                    <Badge
                      badgeContent={unreadCount}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor:
                            activeTab === 1
                              ? "rgba(255,255,255,0.2)"
                              : "#f44336",
                          color: "white",
                          fontSize: "10px",
                          minWidth: "18px",
                          height: "18px",
                          marginRight: "-10px",
                        },
                      }}
                    />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {t("read")}
                    <Badge
                      badgeContent={readCount}
                      color="success"
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor:
                            activeTab === 2
                              ? "rgba(255,255,255,0.2)"
                              : "#4caf50",
                          color: "white",
                          fontSize: "10px",
                          minWidth: "18px",
                          height: "18px",
                          marginRight: "-5px",
                        },
                      }}
                    />
                  </Box>
                }
              />
            </Tabs>
          </Paper>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: "0 34px 34px 34px",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "3px",
            },
          }}
        >
          <TabPanel value={activeTab} index={0}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <img
                  src={Pageloader}
                  alt="Loading..."
                  style={{ width: "80px", height: "80px" }}
                />
              </Box>
            ) : (
              <List sx={{ padding: 0 }}>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "12px",
                        backgroundColor: "white",
                        boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.08)",
                        border: "1px solid rgba(1, 18, 117, 0.08)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        position: "relative",
                        cursor:
                          notif.NotificationType === "actionable"
                            ? "default"
                            : "pointer",
                        opacity:
                          notif.NotificationType === "actionable" ? 0.6 : 1,
                        pointerEvents:
                          notif.NotificationType === "actionable"
                            ? "none"
                            : "auto",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform:
                            notif.NotificationType !== "actionable"
                              ? "translateY(-2px)"
                              : "none",
                          boxShadow:
                            notif.NotificationType !== "actionable"
                              ? "0px 4px 20px rgba(0, 0, 0, 0.12)"
                              : "0px 2px 12px rgba(0, 0, 0, 0.08)",
                        },
                      }}
                      onClick={() =>
                        notif.NotificationType !== "actionable" &&
                        handleNotificationClick(
                          notif.LinkedType,
                          notif.LinkedID,
                          notif.NotificationID
                        )
                      }
                    >
                      {!readNotifications[notif.LinkedID] && (
                        <Box
                          sx={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "#f44336",
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            boxShadow: "0 0 0 3px rgba(244, 67, 54, 0.2)",
                          }}
                        />
                      )}

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: bgColor,
                          fontSize: "16px",
                        }}
                      >
                        {`${notif?.CreatedByUser?.UserFirstName} ${notif?.CreatedByUser?.UserLastName}`}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          marginBottom: "12px",
                          color: "#555",
                          lineHeight: 1.5,
                        }}
                      >
                        {notif.Message}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#888",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {formatDateShort(notif?.CreatedDate)}
                        </Typography>

                        {readNotifications[notif.LinkedID] && (
                          <Box
                            sx={{
                              backgroundColor: "#e8f5e8",
                              color: "#2e7d32",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "10px",
                              fontWeight: "600",
                            }}
                          >
                            {t("READ")}
                          </Box>
                        )}
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      padding: "60px 20px",
                      color: "#999",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "500", mb: 1 }}>
                      {t("No notifications found")}
                    </Typography>
                    <Typography variant="body2">
                      {activeTab === 1
                        ? t("All notifications have been read")
                        : activeTab === 2
                        ? t("No read notifications yet")
                        : t("You're all caught up!")}
                    </Typography>
                  </Box>
                )}
              </List>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <img
                  src={Pageloader}
                  alt="Loading..."
                  style={{ width: "80px", height: "80px" }}
                />
              </Box>
            ) : (
              <List sx={{ padding: 0 }}>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "12px",
                        backgroundColor: "white",
                        boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.08)",
                        border: "2px solid #f44336",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        position: "relative",
                        cursor:
                          notif.NotificationType === "actionable"
                            ? "default"
                            : "pointer",
                        opacity:
                          notif.NotificationType === "actionable" ? 0.6 : 1,
                        pointerEvents:
                          notif.NotificationType === "actionable"
                            ? "none"
                            : "auto",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform:
                            notif.NotificationType !== "actionable"
                              ? "translateY(-2px)"
                              : "none",
                          boxShadow:
                            notif.NotificationType !== "actionable"
                              ? "0px 4px 20px rgba(244, 67, 54, 0.2)"
                              : "0px 2px 12px rgba(0, 0, 0, 0.08)",
                        },
                      }}
                      onClick={() =>
                        notif.NotificationType !== "actionable" &&
                        handleNotificationClick(
                          notif.LinkedType,
                          notif.LinkedID,
                          notif.NotificationID // Pass NotificationID here
                        )
                      }
                    >
                      <Box
                        sx={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: "#f44336",
                          position: "absolute",
                          top: "16px",
                          right: "16px",
                          boxShadow: "0 0 0 3px rgba(244, 67, 54, 0.2)",
                        }}
                      />

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: bgColor,
                          fontSize: "16px",
                        }}
                      >
                        {`${notif?.CreatedByUser?.UserFirstName} ${notif?.CreatedByUser?.UserLastName}`}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          marginBottom: "12px",
                          color: "#555",
                          lineHeight: 1.5,
                        }}
                      >
                        {notif.Message}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          color: "#888",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {formatDateShort(notif?.CreatedDate)}
                      </Typography>
                    </ListItem>
                  ))
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      padding: "60px 20px",
                      color: "#999",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "500", mb: 1 }}>
                      {t("No unread notifications")}
                    </Typography>
                    <Typography variant="body2">
                      {t("All notifications have been read")}
                    </Typography>
                  </Box>
                )}
              </List>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <img
                  src={Pageloader}
                  alt="Loading..."
                  style={{ width: "80px", height: "80px" }}
                />
              </Box>
            ) : (
              <List sx={{ padding: 0 }}>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "12px",
                        backgroundColor: "white",
                        boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.08)",
                        border: "1px solid rgba(76, 175, 80, 0.3)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        position: "relative",
                        cursor:
                          notif.NotificationType === "actionable"
                            ? "default"
                            : "pointer",
                        opacity: 0.8,
                        pointerEvents:
                          notif.NotificationType === "actionable"
                            ? "none"
                            : "auto",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          opacity: 1,
                          transform:
                            notif.NotificationType !== "actionable"
                              ? "translateY(-2px)"
                              : "none",
                          boxShadow:
                            notif.NotificationType !== "actionable"
                              ? "0px 4px 20px rgba(76, 175, 80, 0.2)"
                              : "0px 2px 12px rgba(0, 0, 0, 0.08)",
                        },
                      }}
                      onClick={() =>
                        notif.NotificationType !== "actionable" &&
                        handleNotificationClick(
                          notif.LinkedType,
                          notif.LinkedID,
                          notif.NotificationID // Pass NotificationID here
                        )
                      }
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: bgColor,
                          fontSize: "16px",
                        }}
                      >
                        {`${notif?.CreatedByUser?.UserFirstName} ${notif?.CreatedByUser?.UserLastName}`}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          marginBottom: "12px",
                          color: "#555",
                          lineHeight: 1.5,
                        }}
                      >
                        {notif.Message}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#888",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {formatDateShort(notif?.CreatedDate)}
                        </Typography>

                        <Box
                          sx={{
                            backgroundColor: "#e8f5e8",
                            color: "#2e7d32",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "10px",
                            fontWeight: "600",
                          }}
                        >
                          READ
                        </Box>
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      padding: "60px 20px",
                      color: "#999",
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "500", mb: 1 }}>
                      {t("No read notifications")}
                    </Typography>
                    <Typography variant="body2">
                      {t("Start reading your notifications to see them here")}
                    </Typography>
                  </Box>
                )}
              </List>
            )}
          </TabPanel>
        </Box>
      </Box>
    </BackgroundMeshBox>
  );
};

export default AllNotificationsPage;
