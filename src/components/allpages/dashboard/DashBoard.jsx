import { useEffect, useState, memo, useCallback, useRef } from "react";
import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ElementAnalytics from "../../ProcessownerDashboard/dashboard/ElementAnalytics";
import Banner from "../../ProcessownerDashboard/dashboard/Banner";
import ActionablesAndLeaderboard from "./ActionablesAndLeaderboard";
import {
  GetDashboard,
  GetDynamicDashboard,
} from "../../../store/dashboard/action";
import BackgroundMeshBox from "../../../common/meshbackground/BackgroundMeshBox";
import { useTranslation } from "react-i18next";
// import { ActionableApi } from "../../../services/dashboard/dashboard";
import { useSocket } from "../../../context/SocketContext";
import { toast } from "react-toastify";

import MyActionable from "../../ProcessownerDashboard/dashboard/MyActionable";
import DashboardCards from "../../ProcessownerDashboard/dashboard/DashboardCards";
import MyActionablesModal from "../../ProcessownerDashboard/dashboard/MyActionablesModal";
import { GetAssignedChartsOfCurrentUserAPI } from "../../../services/dashboardBuilder/DashboardBuilder";
import DashBoardBuilderEndUser from "./DashBoardBuilderEndUser";

const DashBoard = memo(function DashBoardWithDisplayName() {
  const socket = useSocket();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector((state) => state.dashboard);
  const { dynamicDashboardData } = useSelector((state) => state.dashboard);
  const [dashboardData, SetDashboardData] = useState(() => {
    // On first render, try to get from localStorage
    const cached = localStorage.getItem("dashboardData");
    return cached ? JSON.parse(cached) : [];
  });
  const [dynamicDashboard, SetdynamicDashboard] = useState([]);
  const hasFetchedDynamicDashboard = useRef(false);

  console.log("gettdashboard:", dashboard);
  useEffect(() => {
    if (hasFetchedDynamicDashboard.current) return;
    const payload = {
      RequestedData: ["AcknowledgeData", "ElementStatusCount"],
    };
    dispatch(GetDynamicDashboard(payload));
    hasFetchedDynamicDashboard.current = true;
  }, [dispatch]);

  useEffect(() => {
    if (dynamicDashboardData) {
      SetdynamicDashboard(dynamicDashboardData);
      // No localStorage.setItem here, use API data directly
    }
  }, [dynamicDashboardData]);

  useEffect(() => {
    fetchActionableData();

    if (!socket) return;
    const syncSuccessHandler = async () => {
      console.log("handle called!!");
      toast.success("A new document has been assigned to you!");
      await fetchActionableData();
    };
    socket.on("document_saved", syncSuccessHandler);

    return () => {
      socket.off("document_saved", syncSuccessHandler);
    };
  }, [socket]);

  const fetchActionableData = useCallback(async () => {
    try {
      // const response = await ActionableApi();
      // console.log(response);
      // setActionableData(response?.slice(0, 10));
    } catch (error) {
      console.error("Error fetching actionable data:", error);
    }
  }, []);

  // Remove the effect that always dispatches GetDashboard on reload
  // Only dispatch if dashboard data is not in localStorage
  useEffect(() => {
    const cachedDashboard = localStorage.getItem("dashboardData");
    if (!cachedDashboard) {
      dispatch(GetDashboard());
    }
  }, [dispatch]);

  // When dashboard data from Redux updates, update localStorage and state
  useEffect(() => {
    if (dashboard && Object.keys(dashboard).length > 0) {
      SetDashboardData(dashboard);
      localStorage.setItem("dashboardData", JSON.stringify(dashboard));
    }
    if (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [dashboard, error]);

  // useEffect(() => {
  //   const fetchAssignedCharts = async () => {
  //     try {
  //       const payload = {}; 
  //       const res = await GetAssignedChartsOfCurrentUserAPI(payload);
  //       console.log("Assigned Charts Response:", res?.data);
  //     } catch (error) {
  //       console.error("Error fetching assigned charts:", error);
  //     }
  //   };

  //   fetchAssignedCharts();
  // }, []);

  return (
    <BackgroundMeshBox>
      <Box>
        <Box sx={{ padding: "1rem" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} sm={12}>
              <Banner />
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} sm={12}>
              <ElementAnalytics dashboardData={dashboardData} />
            </Grid>
            <Grid item xs={12} md={4} sm={12}>
              <MyActionable
                dashboardData={dashboardData}
                dynamicDashboardData={dynamicDashboard?.data} 
              />
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{ mt: 1, mb: 1, width: "97.7%", marginLeft: "1.5rem" }}
            ></Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} sm={12} sx={{ marginLeft: "1.5rem" }}>
                <DashboardCards
                  dashboardData={dashboardData}
                  dynamicDashboardData={dynamicDashboard?.data}
                  card1={"To Stakeholder"}
                  card2={"To Reviewer" || t("card2")}
                  card3={"Reviewed"}
                  card4={"Approved"}
                  card5={t("card4")}
                  card6={t("card1")}
                  card7={"My rejections"}
                  card1key={
                    dynamicDashboardData?.data?.ElementStatus?.ToStakeHolder
                      ?.count || 0
                  }
                  card2key={
                    dynamicDashboardData?.data?.ElementStatus?.ToReviewer
                      ?.count || 0
                  }
                  card3key={
                    dynamicDashboardData?.data?.ElementStatus?.ToReviewed
                      ?.count || 0
                  }
                  card4key={
                    dynamicDashboardData?.data?.ElementStatus?.ToApproved
                      ?.count || 0
                  }
                  card5key={
                    dynamicDashboardData?.data?.ElementStatus?.Approved
                      ?.count || 0
                  }
                  card6key={dashboardData?.taskCount?.ExpiredElement || 0}
                  card7key={
                    dynamicDashboardData?.data?.ElementStatus?.MyRejection
                      ?.count || 0
                  }
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} sm={12} sx={{ marginTop: "-1.5rem" }}>
              <MyActionablesModal />
              <Box sx={{ margin: "0 1.2rem 1rem 1.2rem" }}>
                <ActionablesAndLeaderboard />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* <DashBoardBuilderEndUser /> */}
    </BackgroundMeshBox>
  );
});

export default DashBoard;
