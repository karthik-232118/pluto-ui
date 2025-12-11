import { useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./ProfilePage.css";
import GeneralTabContent from "./GeneralTabContent";
import ChangePasswordTabContnet from "./ChangePasswordTabContnet";
import NotificationsTabContent from "./NotificationsTabContent";
import MyAchievements from "./MyAchievements";
import { useDispatch, useSelector } from "react-redux";
import { GetUserdata } from "../../../store/user/user";
import BackgroundMeshBox from "../../../common/meshbackground/BackgroundMeshBox";
import Pageloader from "../../../assets/image/cubeloader.gif";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";

const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.user);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const userName = localStorage.getItem("user_type");
  useEffect(() => {
    dispatch(GetUserdata());
  }, []);
  const handleOpenOrgTree = () => {
    navigate("/enterprisetree");
  };

  return (
    <BackgroundMeshBox sx={{ height: "100%" }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <img
            src={Pageloader}
            alt="Loading..."
            style={{ height: "100px", width: "100px" }}
          />
        </Box>
      ) : (
        <Box className="profile-container">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography variant="h6" className="heading">
                {t("myProfileHeading")}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#64748B", fontSize: "15px", fontWeight: "400" }}
              >
                {t("profileDescription")}
              </Typography>
            </Box>
            <Box>
              {userName !== "EndUser" && (
                <Button
                  variant="contained"
                  style={{
                    textTransform: "none",
                    borderRadius: "8px",
                  }}
                  onClick={handleOpenOrgTree}
                >
                  {t("view organization Tree")}
                </Button>
              )}
            </Box>
          </Box>

          <Box
            sx={{ display: "flex", height: "auto" }}
            className="tabs-container"
          >
            {/* Left Side Vertical Tabs */}
            <Box
              sx={{ minWidth: "200px", borderRight: 1, borderColor: "divider" }}
              style={{ marginTop: "20px" }}
            >
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Profile Tabs"
                sx={{
                  borderColor: "divider",
                  ".MuiTabs-indicator": {
                    display: "none", // Hide the indicator
                  },
                  width: "100%",
                }}
              >
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: "6px",
                      }}
                    >
                      {t("general")}
                      <ArrowForwardIosIcon
                        sx={{ fontSize: "12px", marginTop: "2px" }}
                      />
                    </Box>
                  }
                  sx={{ textTransform: "none" }}
                  className={value === 0 ? "tab-active" : "tab-inactive"}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: "6px",
                      }}
                    >
                      {t("myAchievements")}
                      <ArrowForwardIosIcon
                        sx={{ fontSize: "12px", marginTop: "2px" }}
                      />
                    </Box>
                  }
                  sx={{ textTransform: "none" }}
                  className={value === 1 ? "tab-active" : "tab-inactive"}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: "6px",
                      }}
                    >
                      {t("changePassword")}
                      <ArrowForwardIosIcon
                        sx={{ fontSize: "12px", marginTop: "2px" }}
                      />
                    </Box>
                  }
                  sx={{ textTransform: "none" }}
                  className={value === 2 ? "tab-active" : "tab-inactive"}
                />
                <Tab
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: "6px",
                      }}
                    >
                      {t("notifications")}
                      <ArrowForwardIosIcon
                        sx={{ fontSize: "12px", marginTop: "2px" }}
                      />
                    </Box>
                  }
                  sx={{ textTransform: "none" }}
                  className={value === 3 ? "tab-active" : "tab-inactive"}
                />
              </Tabs>
            </Box>

            {/* Right Side Content */}
            <Box sx={{ flexGrow: 1 }}>
              <TabPanel value={value} index={0}>
                <GeneralTabContent />
              </TabPanel>

              <TabPanel value={value} index={1}>
                <MyAchievements />
              </TabPanel>

              <TabPanel value={value} index={2}>
                <ChangePasswordTabContnet />
              </TabPanel>

              <TabPanel value={value} index={3}>
                <NotificationsTabContent />
              </TabPanel>
            </Box>
          </Box>
        </Box>
      )}
    </BackgroundMeshBox>
  );
};

export default ProfilePage;

ProfilePage.propTypes = {
  children: PropTypes.node,
};
TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};
