import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Switch,
  Slider,
  Button,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import {
  GetSystemSettings,
  SettingsUploadSize,
} from "../../../services/settings/Settings";
import noti from "../../../assets/gif/settings/notification.gif";
import { toast } from "react-toastify";
import badge1 from "../../../assets/svg/TestSimulation/badge1.svg";
import badge2 from "../../../assets/svg/TestSimulation/badge2.svg";
import badge3 from "../../../assets/svg/TestSimulation/badge3.svg";
import badge4 from "../../../assets/svg/TestSimulation/badge4.svg";
import home from "../../../assets/svg/settings/home.svg";
import integrations from "../../../assets/svg/settings/integrations.svg";
import google from "../../../assets/svg/settings/Google.svg";
import teams from "../../../assets/svg/settings/teams.svg";
import upload from "../../../assets/svg/settings/upload.svg";
import onedrive from "../../../assets/svg/settings/onedrive.svg";

import { useNavigate } from "react-router";
import IntegrationModal from "./IntegrationModal";
import { useTranslation } from "react-i18next";
import AccessDenied from "../../accessDenied/AccessDenied";
import i18next from "i18next";
import { useTheme } from "@mui/styles";

const Setting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [googleSwitch, setGoogleSwitch] = useState(false);
  const [teamsSwitch, setTeamsSwitch] = useState(false);
  const [onedriveSwitch, setOnedriveSwitch] = React.useState(false);
  const [uploadSizeSimulation, setUploadSizeSimulation] = useState(50);
  const [uploadSizeVideos, setUploadSizeVideos] = useState(50);
  const [notificationDays, setNotificationDays] = useState(0);

  const [uploadSizeDocuments, setUploadSizeDocuments] = useState(50);
  const [platinumRange, setPlatinumRange] = useState([90, 100]);
  const [goldRange, setGoldRange] = useState([75, 89]);
  const [silverRange, setSilverRange] = useState([60, 74]);
  const [brassRange, setBrassRange] = useState([0, 60]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalData, setModalData] = useState({});
  const [coCreationEnabled, setCoCreationEnabled] = useState(false);
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main; // Custom hook to get background color

  const handlePlatinumChange = (event, newValue) => {
    setPlatinumRange(newValue);
  };
  const handleGoldChange = (event, newValue) => {
    setGoldRange(newValue);
  };
  const handleSilverChange = (event, newValue) => {
    setSilverRange(newValue);
  };
  const handleBrassChange = (event, newValue) => {
    setBrassRange(newValue);
  };

  const handleGetSettings = async () => {
    try {
      const response = await GetSystemSettings();
      if (response) {
        const data = response.data?.data;

        setGoogleSwitch(data?.GoogleSSO === "true");
        setTeamsSwitch(data?.TeamSSO === "true");
        setUploadSizeSimulation(parseInt(data?.SimulationSize) || 0);
        setUploadSizeVideos(parseInt(data?.VideoSize) || 0);
        setUploadSizeDocuments(parseInt(data?.DocumentSize) || 0);
        setNotificationDays(parseInt(data?.NotificationReminder) || 0);
        setCoCreationEnabled(data?.CoCreation === "true");

        // Update range states
        setPlatinumRange([
          data?.PlatinumLow || 90,
          parseInt(data?.PlatinumHigh) || 100,
        ]);
        setGoldRange([
          parseInt(data?.GoldLow) || 75,
          parseInt(data?.GoldHigh) || 89,
        ]);
        setSilverRange([
          parseInt(data?.SilverLow) || 60,
          parseInt(data?.SilverHigh) || 74,
        ]);
        setBrassRange([
          parseInt(data?.BrassLow) || 0,
          parseInt(data?.BrassHigh) || 60,
        ]);
      }
    } catch (error) {
      console.error("Error fetching system settings:", error);
      toast.error("Failed to fetch system settings. Please try again.");
    }
  };

  const handleSave = async () => {
    const requestBody = {
      GoogleSSO: googleSwitch.toString(),
      TeamSSO: teamsSwitch.toString(),
      SimulationSize: uploadSizeSimulation,
      VideoSize: uploadSizeVideos,
      DocumentSize: uploadSizeDocuments,
      NotificationReminder: notificationDays,
      PlatinumLow: platinumRange[0],
      PlatinumHigh: platinumRange[1],
      GoldLow: goldRange[0],
      GoldHigh: goldRange[1],
      SilverLow: silverRange[0],
      SilverHigh: silverRange[1],
      BrassLow: brassRange[0],
      BrassHigh: brassRange[1],
      CoCreation: coCreationEnabled.toString(),
      ...modalData,
    };

    try {
      const response = await SettingsUploadSize(requestBody);

      if (response.error) {
        throw new Error(response.error);
      }

      console.log("API Response:", response);
      toast.success(i18next.t("settings_saved"));
    } catch (error) {
      console.error("Error saving settings:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to save settings. Please try again.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    handleGetSettings();
  }, []);

  const handleSwitchToggle = (checked, heading) => {
    if (checked) {
      setModalHeading(heading);
      setModalOpen(true);
    }
  };

  const handleOnSave = (data) => {
    console.log("Data received from modal:", data);
    setModalData(data);
  };

  const userType = localStorage.getItem("user_type");
  if (userType === "EndUser" || userType === "ProcessOwner") {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ margin: "35px" }}>
      <Card sx={{ maxWidth: "auto", padding: "0px 20px 20px 20px" }}>
        <Typography
          variant="h6"
          align="start"
          mt={2}
          sx={{
            fontWeight: 500,
            fontSize: "1.5rem",
            lineHeight: "1rem",
            letterSpacing: "normal",
            textDecorationSkipInk: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "1rem",
            }}
          >
            <img
              src={home}
              alt="Home Icon"
              style={{ width: "40px", height: "40px" }}
              onClick={() => navigate("/dashboard")}
            />
            {"<"}
            <span>{t("settings")}</span>
          </div>
        </Typography>
        <Divider />
        <Box>
          <Box display="flex" alignItems="center" mt={2} mb={4}>
            <img
              src={integrations}
              alt="Integrations Icon"
              style={{ marginRight: "15px" }}
            />
            <Typography variant="h6">{t("integrations")}</Typography>
          </Box>
          <Box
            sx={{
              border: "1px solid #ccc", // Adds a light gray border
              borderRadius: "15px", // Rounds the corners
              // Adds padding inside the box
              maxWidth: "100%", // Sets a maximum width
              margin: "0 1rem 1.5rem 1rem ", // Centers the box horizontally
            }}
          >
            {/* Integration Items */}
            <Grid container direction="column">
              {/* Google Integration */}
              <Box>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  paddingY={1}
                >
                  <Grid
                    item
                    xs={8}
                    display="flex"
                    alignItems="center"
                    padding={0.5}
                  >
                    <img
                      src={google}
                      alt="Google"
                      style={{
                        marginRight: "15px",
                      }}
                    />
                    <Typography>{t("google")}</Typography>
                  </Grid>
                  <Grid item xs={4} display="flex" justifyContent="flex-end">
                    <Switch
                      checked={googleSwitch}
                      onChange={(e) => {
                        setGoogleSwitch(e.target.checked);
                        handleSwitchToggle(
                          e.target.checked,
                          "Google Integration"
                        );
                      }}
                    />
                  </Grid>
                </Grid>
                <Divider />
              </Box>

              {/* Teams Integration */}
              <Box>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  paddingY={1}
                >
                  <Grid
                    item
                    xs={8}
                    display="flex"
                    alignItems="center"
                    padding={0.5}
                  >
                    <img
                      src={teams}
                      alt="Teams"
                      style={{
                        marginRight: "15px",
                      }}
                    />
                    <Typography>{t("teams")}</Typography>
                  </Grid>
                  <Grid item xs={4} display="flex" justifyContent="flex-end">
                    <Switch
                      checked={teamsSwitch}
                      onChange={(e) => {
                        setTeamsSwitch(e.target.checked);
                        handleSwitchToggle(
                          e.target.checked,
                          "Teams Integration"
                        );
                      }}
                    />
                  </Grid>
                </Grid>
                <Divider />
              </Box>

              {/* OneDrive Integration */}
              <Box>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  paddingY={1}
                >
                  <Grid
                    item
                    xs={8}
                    display="flex"
                    alignItems="center"
                    padding={0.5}
                  >
                    <img
                      src={onedrive}
                      alt="OneDrive"
                      style={{
                        marginRight: "15px",
                        marginLeft: "10px",
                        width: "24px",
                        height: "24px",
                      }}
                    />
                    <Typography>{t("onedrive")}</Typography>
                  </Grid>
                  <Grid item xs={4} display="flex" justifyContent="flex-end">
                    <Switch
                      checked={onedriveSwitch}
                      onChange={(e) => {
                        setOnedriveSwitch(e.target.checked);
                        handleSwitchToggle(
                          e.target.checked,
                          "OneDrive Integration"
                        );
                      }}
                    />
                  </Grid>
                </Grid>
                {/* Optional: No Divider after the last item */}
              </Box>
            </Grid>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Upload Size */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mb: 5 }}
            display="flex"
            alignItems="center"
          >
            <span>
              <img
                src={upload}
                alt=""
                style={{ marginRight: "15px", marginTop: "8px" }}
              />
            </span>{" "}
            {t("upload_size")}
          </Typography>
          <Grid
            container
            spacing={6}
            alignItems="start"
            mb={2}
            sx={{ padding: "0px 20px" }}
          >
            {/* First Row */}
            <Grid item xs={6}>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  padding: "20px",
                  borderRadius: "20px",
                }}
              >
                <Typography>{t("simulation")}</Typography>
                <Slider
                  value={uploadSizeSimulation}
                  onChange={(e, value) => setUploadSizeSimulation(value)}
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={0}
                  max={500}
                />
                <Typography>{uploadSizeSimulation} MB</Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  padding: "20px",
                  borderRadius: "20px",
                }}
              >
                <Typography>{t("videos")}</Typography>
                <Slider
                  value={uploadSizeVideos}
                  onChange={(e, value) => setUploadSizeVideos(value)}
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={0}
                  max={500}
                />
                <Typography>{uploadSizeVideos} MB</Typography>
              </Box>
            </Grid>

            {/* Second Row */}
            <Grid item xs={6}>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  padding: "20px",
                  borderRadius: "20px",
                }}
              >
                <Typography>{t("documents")}</Typography>
                <Slider
                  value={uploadSizeDocuments}
                  onChange={(e, value) => setUploadSizeDocuments(value)}
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={0}
                  max={500}
                />
                <Typography>{uploadSizeDocuments} MB</Typography>
              </Box>
            </Grid>

            {/* Optional Placeholder for Alignment */}
            <Grid item xs={6}>
              {/* Add another slider here if needed or leave empty for balance */}
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mb: 5 }}
            display="flex"
            alignItems="center"
          >
            <span>
              <img
                src={upload}
                alt=""
                style={{ marginRight: "15px", marginTop: "8px" }}
              />
            </span>{" "}
            {t("test_badge_range")}
          </Typography>

          <Grid
            container
            spacing={6}
            alignItems="start"
            mb={2}
            sx={{ padding: "0px 20px" }}
          >
            {/* First Row: Platinum and Gold */}
            <Grid item xs={6}>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  padding: "20px",
                  borderRadius: "20px",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px", // Optional: Add space between image and text
                  }}
                >
                  <img
                    src={badge4}
                    alt="Platinum Badge"
                    style={{ width: "35px", height: "35px" }}
                  />
                  {t("platinum")}
                </Typography>
                <Slider
                  value={platinumRange}
                  onChange={handlePlatinumChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                />
                <Typography>
                  Score ({platinumRange[0]} - {platinumRange[1]})
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  padding: "20px",
                  borderRadius: "20px",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px", // Optional: Add space between image and text
                  }}
                >
                  <img
                    src={badge2}
                    alt="Gold Badge"
                    style={{ width: "35px", height: "35px" }}
                  />
                  {t("gold")}
                </Typography>
                <Slider
                  value={goldRange}
                  onChange={handleGoldChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                />
                <Typography>
                  Score ({goldRange[0]} - {goldRange[1]})
                </Typography>
              </Box>
            </Grid>

            {/* Second Row: Silver and Brass */}
            <Grid item xs={6}>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  padding: "20px",
                  borderRadius: "20px",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px", // Optional: Add space between image and text
                  }}
                >
                  <img
                    src={badge1}
                    alt="Silver Badge"
                    style={{ width: "35px", height: "35px" }}
                  />
                  {t("silver")}
                </Typography>
                <Slider
                  value={silverRange}
                  onChange={handleSilverChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                />
                <Typography>
                  Score ({silverRange[0]} - {silverRange[1]})
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  padding: "20px",
                  borderRadius: "20px",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px", // Optional: Add space between image and text
                  }}
                >
                  <img
                    src={badge3}
                    alt="Brass Badge"
                    style={{ width: "35px", height: "35px" }}
                  />
                  {t("brass")}
                </Typography>
                <Slider
                  value={brassRange}
                  onChange={handleBrassChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                />
                <Typography>
                  Score ({brassRange[0]} - {brassRange[1]})
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 2 }} />

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mb: 5 }}
            display="flex"
            alignItems="center"
          >
            <span>
              <img
                src={upload}
                alt=""
                style={{ marginRight: "15px", marginTop: "8px" }}
              />
            </span>{" "}
            {t("notification_reminder_title")}
          </Typography>

          <Grid item xs={6}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                padding: "20px",
                borderRadius: "20px",
              }}
            >
              <Typography>
                <img
                  src={noti}
                  alt=""
                  style={{
                    verticalAlign: "middle",
                    height: "25px",
                    width: "25px",
                  }}
                />{" "}
                {t("notification_reminder_text")}
              </Typography>
              <Slider
                value={notificationDays}
                onChange={(event, value) => setNotificationDays(value)}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={50}
              />
              <Typography>{notificationDays} Days</Typography>
            </Box>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mb: 5 }}
            display="flex"
            alignItems="center"
          >
            <span>
              <img
                src={upload}
                alt=""
                style={{ marginRight: "15px", marginTop: "8px" }}
              />
            </span>{" "}
            {t("coCreation")}
          </Typography>

          <Box
            sx={{
              border: "1px solid #e0e0e0",
              padding: "20px",
              borderRadius: "20px",
              marginBottom: "20px",
            }}
          >
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              paddingY={1}
            >
              <Grid item xs={8} display="flex" alignItems="center">
                <Typography>
                  {coCreationEnabled
                    ? t("coCreationEnabled")
                    : t("co_creation_disabled")}
                </Typography>
              </Grid>
              <Grid item xs={4} display="flex" justifyContent="flex-end">
                <Switch
                  checked={coCreationEnabled}
                  onChange={(e) => setCoCreationEnabled(e.target.checked)}
                />
              </Grid>
            </Grid>
          </Box>
          {/* Save Button */}
          <Grid container justifyContent="flex-end" spacing={2} mt={2}>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  color: "white",
                  backgroundColor: bgcolor || "bule",
                  padding: "8px 25px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: bgcolor || "blue",
                  },
                }}
              >
                {t("save")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <IntegrationModal
        open={modalOpen}
        heading={modalHeading}
        onClose={() => setModalOpen(false)}
        onSave={handleOnSave}
      />
    </Box>
  );
};

export default Setting;
