import Dashborad_completed from "../../assets/svg/AdminDashBoard/tick.svg";
import Dashborad_incompleted from "../../assets/image/dashborad/Dashborad_incompleted.svg";
import AdminCircularProgressChart from "./AdminCircularProgressChart";
import { Box, Card, Divider, Typography, Skeleton, Grid } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const LiveSessions = ({ dashboardData }) => {
  const {t} = useTranslation();
  const { loading } = useSelector((state) => state.dashboard);

  return (
    <Card sx={{ marginTop: "2rem", height: "510px" }}>
      <Box padding={2}>
        <Typography variant="h6">{t("liveSessions")}</Typography>
        <Typography
          variant="body1"
          sx={{ color: "#A6A9AC", fontWeight: "300", fontSize: "14px" }}
        >
         {t("sessionsLiveNow")}
        </Typography>
      </Box>
      <Divider />

      <Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Skeleton
              variant="circular"
              width={260}
              height={260}
              animation="pulse"
            />
          </Box>
        ) : (
          <AdminCircularProgressChart dashboardData={dashboardData} />
        )}
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
          className="bottom_content"
        >
          <img src={Dashborad_completed} alt="" />
          <div>
            <Typography
              variant="inherit"
              className="icon_varient"
              sx={{ color: "#A6A9AC" }}
            >
             {t("online")}
            </Typography>
            <Typography variant="h6">
              {dashboardData?.LiveSession?.Online}
            </Typography>
          </div>
        </Box>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
          className="bottom_content"
        >
          <img src={Dashborad_incompleted} alt="" />
          <div>
            <Typography
              variant="inherit"
              className="icon_varient"
              sx={{ color: "#A6A9AC" }}
            >
              {t("offline")}
            </Typography>
            <Typography variant="h6">
              {dashboardData?.LiveSession?.Offline}
            </Typography>
          </div>
        </Box>
      </Box>
    </Card>
  );
};

export default LiveSessions;
