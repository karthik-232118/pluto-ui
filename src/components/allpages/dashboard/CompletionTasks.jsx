import  { useEffect } from "react";
import { Box,  Grid, Skeleton, Typography } from "@mui/material";
import "./DashBoard.css";
import Dashborad_completed from "../../../assets/image/dashborad/Dashborad_completed.svg";
import Dashborad_incompleted from "../../../assets/image/dashborad/Dashborad_incompleted.svg";
import CircularProgressChart from "./CircularProgressChart";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const CompletionTasks = ({ dashboardData }) => {
  const { loading } = useSelector((state) => state.dashboard);
  useEffect(() => {}, [dashboardData]);

  return (
    <Box>
      <Grid container spacing={2} className="chart_bg">
        <Grid container className="inside_bg">
          <Grid sx={{ width: "40%" }}>
            <div>
              <Typography variant="h6" className="top_variant">
                Completion Tasks
              </Typography>
              <Typography variant="body2" className="sub_variant">
                Tasks that require immediate attention.
              </Typography>
            </div>
          </Grid>
        </Grid>
        <div className="horizontal_line" />
        <Grid container className="inside_bg">
          <Grid sx={{ width: "100%" }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py:3
                }}
              >
                <Skeleton
                  variant="circular"
                  width={200}
                  height={200}
                  animation="pulse"
                />
              </Box>
            ) : (
              <CircularProgressChart dashboardData={dashboardData} />
            )}{" "}
          </Grid>
        </Grid>
        <div className="horizontal_line" />
        <Grid container>
          <Grid
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
              <Typography variant="body2" className="icon_varient">
                Completed
              </Typography>
              <Typography variant="h6" sx={{ fontSize: 17 }}>
                {dashboardData?.performance?.CompletedTask}
              </Typography>
            </div>
          </Grid>
          <Grid
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
              <Typography variant="body2" className="icon_varient">
                Pending
              </Typography>
              <Typography variant="h6" sx={{ fontSize: 17 }}>
                {dashboardData?.performance?.PendingTask}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompletionTasks;

CompletionTasks.propTypes = {
  dashboardData: PropTypes.object,
};