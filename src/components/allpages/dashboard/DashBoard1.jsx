import { useEffect, useState } from "react";
import DashboardElements from "./DashboardElements";
import { Box, Grid } from "@mui/material";
import bgimage from "../../../assets/image/dashborad/bgimage.png";
import { useDispatch, useSelector } from "react-redux";
import {
  GetDashboard,
  GetDynamicDashboard,
} from "../../../store/dashboard/action";
import Banner from "../../ProcessownerDashboard/dashboard/Banner";
import DashboardCards from "./DashboardCards";
import PendingAcknowledgments from "./PendingAcknowledgments";
import MyActionable from "./MyActionable";
import UpcomingTests from "./UpcomingTests";
import Leaderboard from "./Leaderboard";
import FormsTable from "./FormsTable";
import QuickView from "./QuickView";

const DashBoard1 = () => {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector((state) => state.dashboard);
  const [dashboardData, setDashboardData] = useState([]);
  const [dynamicDashboard, SetdynamicDashboard] = useState([]);
  console.log("Dynamic Dashboard Data useState:", dynamicDashboard);
  const payload = {
    RequestedData: [
      "AcknowledgeData",
      "DocumentData",
      "UpcummingTestData",
      "FormData",
    ],
  };
  const { dynamicDashboardData } = useSelector(
    (state) => state.dashboard
  );
  useEffect(() => {
    dispatch(GetDynamicDashboard(payload));
  }, [dispatch]);
  useEffect(() => {
    if (dynamicDashboardData) {
      console.log("Dynamic Dashboard Data:", dynamicDashboardData);
      SetdynamicDashboard(dynamicDashboardData);
    }
  }, [dynamicDashboardData]);

  useEffect(() => {
    dispatch(GetDashboard());
  }, [dispatch]);
  useEffect(() => {
    if (dashboard) {
      setDashboardData(dashboard);
    }
    if (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [dashboard, loading, error]);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.5,
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          height: "100%", 
        }}
      >
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid item xs={12}>
            <Banner />
          </Grid>
          <Grid item xs={12}>
            <DashboardCards
              card1={"Your Progress(%)"}
              card2={"Average Test MCQs(%)"}
              card3={"AVERAGE TEST Simulation(%)"}
              card4={"License Expires In"}
              card1key={dashboardData?.performance?.Progress}
              card2key={Math.floor(dashboardData?.performance?.MCQAverage)}
              card3key={Math.floor(dashboardData?.performance?.TestAverage)}
              card4key={dashboardData?.license?.ValidityTo}
            />
          </Grid>
          <Grid
            container
            item
            xs={12}
            spacing={2}
            alignItems="stretch"
            sx={{ flexGrow: 1 }}
          >
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <DashboardElements dashboardData={dashboardData} />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <PendingAcknowledgments dashboardData={dynamicDashboard} />
              </Box>
            </Grid>
            <Grid item xs={12} container spacing={2} alignItems="stretch">
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <MyActionable dashboardData={dashboardData} />
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <UpcomingTests dynamicDashboardData={dynamicDashboard} />
                </Box>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Leaderboard />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <FormsTable dynamicDashboardData={dynamicDashboard} />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <QuickView dynamicDashboardData={dynamicDashboard} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashBoard1;
