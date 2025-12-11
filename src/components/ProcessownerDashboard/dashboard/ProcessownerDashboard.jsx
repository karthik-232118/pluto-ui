import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ElementAnalytics from "./ElementAnalytics";
import DashboardCards from "./DashboardCards";
import {
  GetDashboardElementDetails,
  GetDashboardProcessOwner,
  GetDynamicDashboard,
} from "../../../store/dashboard/action";
import Banner from "./Banner";
import BackgroundMeshBox from "../../../common/meshbackground/BackgroundMeshBox";
import { useTranslation } from "react-i18next";
import { useSocket } from "../../../context/SocketContext";
import { toast } from "react-toastify";
import MyActionable from "./MyActionable";
import MyActionablesModal from "./MyActionablesModal";
import AI_Mode from "../../navbar/AI_Mode";
 
const ProcessownerDashboard = () => { 
  const socket = useSocket();
  const dashboardContainerRef = useRef(null);
  const hasFetchedDynamicDashboard = useRef(false);
  const hasFetchedDashboard = useRef(false);
   const elementDetails = useSelector((state) => state.dashboard.elementDetails);

   console.log("elementDetailslenth", elementDetails?.data?.length);
 
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { dashboard, error, dynamicDashboardData } = useSelector(
    (state) => state.dashboard
  );
 
  const [dashboardData, SetDashboardData] = useState([]);
  const [dynamicDashboard, SetdynamicDashboard] = useState({});
  const [elementStatus, setElementStatus] = useState([]);
  const [aiMode, setAiMode] = useState(() => {
    return localStorage.getItem("aiMode") === "AIModeON";
  });
 
  useEffect(() => {
    const handleStorageChange = () => {
      setAiMode(localStorage.getItem("aiMode") === "AIModeON");
    };
 
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
 
  useEffect(() => {
    console.log(
      dynamicDashboard?.data?.ElementStatus?.DraftState?.count,
      "dynamicDashboardDatacaa"
    );
    dispatch(GetDashboardElementDetails({ DetailsType: "Expiry" }));
 
    setElementStatus(dynamicDashboard?.data?.ElementStatus);
  }, []);
 
  const scrollToBottom = () => {
    if (dashboardContainerRef.current) {
      dashboardContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };
 
  const fetchDynamicDashboard = useCallback(() => {
    if (hasFetchedDynamicDashboard.current) return;
    hasFetchedDynamicDashboard.current = true;
 
    // Always dispatch the API call on reload
    const payload = {
      RequestedData: [
        "AcknowledgeData",
        // "DocumentData",
        // "UpcummingTestData",
        // "FormData",
        "ElementStatusCount",
      ],
    };
 
    dispatch(GetDynamicDashboard(payload));
  }, [dispatch]);
 
  useEffect(() => {
    // fetchActionableData();
    fetchDynamicDashboard();
  }, [fetchDynamicDashboard]);
 
  useEffect(() => {
    if (!socket) return;
 
    const syncSuccessHandler = async () => {
      try {
        // const response = await ActionableApi();
        // const data = response?.slice(0, 10);
        // setActionableData(data);
        toast.success("A new document has been assigned to you!");
      } catch (error) {
        console.error("Error fetching actionable data on socket event:", error);
      }
    };
 
    socket.on("document_saved", syncSuccessHandler);
    return () => socket.off("document_saved", syncSuccessHandler);
  }, [socket]);
 
  useEffect(() => {
    if (hasFetchedDashboard.current) return;
    if (!dashboard || dashboard.length === 0) {
      dispatch(GetDashboardProcessOwner());
      hasFetchedDashboard.current = true;
    }
  }, [dispatch, dashboard]);
 
  useEffect(() => {
    if (dashboard) {
      SetDashboardData(dashboard);
    }
 
    if (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [dashboard, error]);
 
  // Remove all localStorage usage for dynamicDashboardData
  useEffect(() => {
    if (dynamicDashboardData) {
      SetdynamicDashboard(dynamicDashboardData);
      // No localStorage.setItem here
    }
  }, [dynamicDashboardData]);
 
  useEffect(() => {
    const value = localStorage.getItem("aiMode");
    setAiMode(value);
    console.log("AI mode value from localStorage:", value);
  }, []);
 
  return (
    <BackgroundMeshBox>
      {aiMode ? (
        <AI_Mode />
      ) : (
        <Box ref={dashboardContainerRef}>
          <div style={{ margin: "1rem" }}>
            <Banner />
          </div>
 
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} sm={12}>
                <ElementAnalytics dashboardData={dashboardData} />
              </Grid>
              <Grid item xs={12} md={4} sm={12}>
                <MyActionable
                  dashboardData={dashboardData}
                  dynamicDashboardData={dynamicDashboard?.data}
                  onItemClick={scrollToBottom}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{ mt: 1, mb: 1, width: "99.2%", marginLeft: "-0.1rem" }}
            >
              {/* <Grid item xs={12}>
              <ActivityCards dynamicDashboardData={dynamicDashboardData} />
            </Grid> */}
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <DashboardCards
                  dashboardData={dashboardData}
                  dynamicDashboardData={dynamicDashboard?.data}
                  card1={"To Stakeholder"}
                  card2={"To Reviewer"}
                  card3={"Reviewed"}
                  card4={"Approved"}  
                  card5={"Published"}
                  card6={"Elements Expiry"}
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
                  card7key={
                    dynamicDashboardData?.data?.ElementStatus?.MyRejection
                      ?.count || 0
                  }
                  card6key={elementDetails?.data?.length || 0}
                  onCardClick={scrollToBottom}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MyActionablesModal />
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </BackgroundMeshBox>
  );
};
 
export default memo(ProcessownerDashboard);
 
 