import React, { useEffect, useRef } from "react";
import { Box, Grid } from "@mui/material";
import ESignOverviewHeader from "./OverviewHeader";
import ESignDashboardMetrics from "./ESignDashboardMetrics";
import ListESigns from "./ESignList";
import ESignActivityOverview from "./ESignActivityOverview";
import {
  fetchESignDashboardActivity,
  fetchESignDashboard,
  fetchESignDashboardCards,
} from "../../../services/eSign/ESignModule";
import notify from "../../../assets/svg/utils/toast/Toast";
import { dateformatter } from "../../../utils";
import BackgroundMeshBox from "../../../common/meshbackground/BackgroundMeshBox";


const Esign = () => {
  const [dashboard, setDashboard] = React.useState({  
    metrices: null,
    tableGrid: [],
  });
  const [dashboardCards, setDashboardCards] = React.useState([]);
  const isDashboardFetchingRef = useRef(null);
  const isDashboardCardsFetchingRef = useRef(null);
  const [activity, setActivity] = React.useState([]);
  const [isFetchingDashboardCards, setIsFetchingDashboardCards] =
    React.useState(false);
  const [isFetchingDashboard, setIsFetchingDashboard] = React.useState(false);
  const [isFetchingActivity, setIsFetchingActivity] = React.useState(false);
  const [isESignSelected, setIsESignSelected] = React.useState(false);
  const [rowCount, setRowCount] = React.useState(0);
  const [payload, setPayload] = React.useState({
    status: "All",
    page: 1,
    pageSize: 5,
  });
  const [shrinkList, setShrinkList] = React.useState(false);

  const fetchESignDashboardCardHandler = async () => {
    isDashboardCardsFetchingRef.current = true;
    setIsFetchingDashboardCards(true);
    try {
      const response = await fetchESignDashboardCards();
      if (response?.status === 200) {
        setDashboardCards(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
      notify("error", error?.response?.data?.message || "Error fetching data");
    } finally {
      setIsFetchingDashboardCards(false);
      isDashboardCardsFetchingRef.current = false;
    }
  };

  const eSignDashboardFetchHandler = async () => {
    isDashboardFetchingRef.current = true;
    setIsFetchingDashboard(true);
    try {
      const response = await fetchESignDashboard(payload);
      if (response?.status === 200) {
        const data = response?.data?.data;
        const modifiedTableData = data?.tableGrid?.map((item, index) => ({
          ...item,
          sn: index + 1,
          createdDate:dateformatter(item.createdDate)
        }));
        setDashboard({ tableGrid: modifiedTableData });
        setRowCount(data?.pagination?.total);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message || "Error fetching data");
    } finally {
      setIsFetchingDashboard(false);
      isDashboardFetchingRef.current = false;
    }
  };

  const eSignActivityFetchHandler = async (payload) => {
    setIsESignSelected(true);
    setIsFetchingActivity(true);
    try {
      const response = await fetchESignDashboardActivity(payload);
      if (response?.status === 200) {
        setActivity(response?.data?.data?.activities);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message || "Error fetching data");
    } finally {
      setIsFetchingActivity(false);
    }
  };

  useEffect(() => {
    if (!isDashboardCardsFetchingRef.current) {
      fetchESignDashboardCardHandler();
    }
  }, []);

  useEffect(() => {
    setIsESignSelected(false);
    setActivity([]);
    if (!isDashboardFetchingRef.current) {
      eSignDashboardFetchHandler();
    }
  }, [payload]);

  return (
    <BackgroundMeshBox sx={{ height: "100%" }}>
    <Box
      py={2}
      px={3}
      sx={{
        overflowY: "scroll",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <ESignOverviewHeader />
      <ESignDashboardMetrics
        loading={isFetchingDashboardCards}
        data={dashboardCards || {}}
      />

      <Box sx={{ width: "100%", mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={shrinkList ? 8 : 12}>
            <ListESigns
              loading={isFetchingDashboard}
              data={dashboard?.tableGrid}
              eSignActivityFetchHandler={eSignActivityFetchHandler}
              rowCount={rowCount}
              setPayload={setPayload}
              setShrinkList={setShrinkList}
            />
          </Grid>
          {shrinkList && (
            <Grid item xs={12} md={4}>
              <ESignActivityOverview
                loading={isFetchingActivity}
                activity={activity}
                isESignSelected={isESignSelected}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
    </BackgroundMeshBox>
  );
};

export default Esign;
