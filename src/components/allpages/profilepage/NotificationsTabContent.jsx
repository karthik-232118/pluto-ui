import {
  Box,
  Divider,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  // Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { UpdateNotification } from "../../../store/user/user";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const NotificationsTabContent = () => {
  const {t}=useTranslation();
  const [notificationsPaused, setNotificationsPaused] = useState(false);
  const { userdata } = useSelector((state) => state?.user);
  const [actionableNotification, setActionableNotification] = useState("push");
  const [elementNotification, setElementNotification] = useState("push");
  const disptach = useDispatch();
  const handlePauseChange = (event) => {
    setNotificationsPaused(event.target.checked);
    if (event.target.checked) {
      const payload = {
        NotificationTypeForPublish: "none",
        NotificationTypeForAction: "none",
      };
      setActionableNotification("none");
      setElementNotification("none");
      disptach(UpdateNotification(payload));
      return;
    } else {
      const payload = {
        NotificationTypeForPublish: "both",
        NotificationTypeForAction: "both",
      };
      setActionableNotification("both");
      setElementNotification("both");
      disptach(UpdateNotification(payload));
    }
  };

  const handleActionableChange = (event) => {
    setActionableNotification(event.target.value);
    const payload = {
      NotificationTypeForPublish: event.target.value,
      NotificationTypeForAction: elementNotification,
    };
    disptach(UpdateNotification(payload));
  };

  const handleElementChange = (event) => {
    setElementNotification(event.target.value);
    const payload = {
      NotificationTypeForPublish: actionableNotification,
      NotificationTypeForAction: event.target.value,
    };
    disptach(UpdateNotification(payload));
  };

  useEffect(() => {
    if (
      userdata?.NotificationTypeForAction === "none" &&
      userdata?.NotificationTypeForPublish === "none"
    ) {
      setNotificationsPaused(true);
    }
    setActionableNotification(userdata?.NotificationTypeForPublish);
    setElementNotification(userdata?.NotificationTypeForAction);
  }, [userdata]);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: "550" }}>
      {t("notifications")}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "#64748B", fontSize: "14px", fontWeight: "400" }}
      >
       {t("notification_desc")}
      </Typography>
      <Divider sx={{ my: 2, mb: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#FFF4E2",
          border: "1px solid #EDBE71",
          padding: "16px",
          borderRadius: "12px",
          height: "56px",
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontWeight: "450", color: "#C87008", marginBottom:0 }}
        >
          {t("pause_all_notifications")}
        </Typography>
        <Switch
          checked={notificationsPaused}
          onChange={handlePauseChange}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#fff", // Color of the switch thumb when checked
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#E39619", // Color of the switch track when checked
            },
          }}
        />
      </Box>

      {/* Actionable Notifications */}
      <Typography
        variant="body1"
        sx={{ mt: 3 }}
        style={{ fontWeight: "500", fontSize: "15px" }}
      >
        {t("receive_actionable_notifications")}
      </Typography>
    
      <FormControl
        component="fieldset"
        sx={{ mt: 1 }}
        style={{ display: "flex" }}
      >
        <RadioGroup
          row
          aria-label="actionable-notifications"
          name="actionable-notifications"
          value={actionableNotification}
          onChange={handleActionableChange}
        >
          <FormControlLabel
            value="push"
            control={<Radio />}
            label={t("push_notification")}
            sx={{
              "& .MuiTypography-root": {
                marginBottom: 0,
                fontWeight: 500,
              },
            }}
          />
          <FormControlLabel
            value="email"
            control={<Radio />}
            label={t("email_notification")}
            sx={{
              "& .MuiTypography-root": {
                marginBottom: 0,
                fontWeight: 500,
              },
            }}
          />
          <FormControlLabel
            value="both"
            control={<Radio />}
            label={t("both")}
            sx={{
              "& .MuiTypography-root": {
                marginBottom: 0,
                fontWeight: 500,
              },
            }}
          />
          <FormControlLabel
            value="none"
            control={<Radio />}
            label={t("none")}
            sx={{
              "& .MuiTypography-root": {
                marginBottom: 0,
                fontWeight: 500,
              },
            }}
          />
        </RadioGroup>
      </FormControl>

      {/* Element Notifications */}
      <Typography
        variant="body1"
        sx={{ mt: 3 }}
        style={{ fontWeight: "500", fontSize: "15px" }}
      >
       {t("receive_new_elements_notifications")}
      </Typography>
     
      <FormControl
        component="fieldset"
        sx={{ mt: 1 }}
        style={{ display: "flex" }}
      >
        <RadioGroup
          row
          aria-label="element-notifications"
          name="element-notifications"
          value={elementNotification}
          onChange={handleElementChange}
        >
          <FormControlLabel
            value="push"
            control={<Radio />}
            label={t("push_notification")}
             sx={{
              "& .MuiTypography-root": {
                marginBottom: 0,
                fontWeight: 500,
              },
            }}
          />
          <FormControlLabel
            value="email"
            control={<Radio />}
            label={t("email_notification")}
             sx={{
              "& .MuiTypography-root": {
                marginBottom: 0,
                fontWeight: 500,
              },
            }}
          />
          <FormControlLabel
            value="both"
            control={<Radio />}
            label={t("both")}
             sx={{
              "& .MuiTypography-root": {
                marginBottom: 0,
                fontWeight: 500,
              },
            }}
          />
          <FormControlLabel
            value="none"
            control={<Radio />}
            label={t("none")}
             sx={{
              "& .MuiTypography-root": {
                marginBottom: 0,
                fontWeight: 500,
              },
            }}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default NotificationsTabContent;
