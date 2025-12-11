import Dashborad_completed from "../../../assets/image/dashborad/Dashborad_completed.svg";
import Dashborad_incompleted from "../../../assets/image/dashborad/Dashborad_incompleted.svg";
import CircularProgressChart from "./CircularProgressChart";
import { Box, Card, Divider, Typography, Skeleton } from "@mui/material";

import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const CompletionTasks = ({
  dashboardData,
  title,
  subtitle,
  content2Key,
  content1Key,
  content1,
  content2,
  TotalTask,
}) => {
  const { loading } = useSelector((state) => state.dashboard);

  return (
    <Card sx={{ height: "100%", marginRight: "15px" }}>
      <Box padding={2}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" className="sub_variant">
          {subtitle}
        </Typography>
      </Box>
      <Divider />
      <Box>
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
          <CircularProgressChart
            dashboardData={dashboardData}
            TotalTask={TotalTask}
          />
        )}
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // Ensures equal spacing between items
          alignItems: "center", // Centers content vertically
          gap: 2, // Adds spacing between the two boxes
        }}
      >
        {/* First Box */}
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2, // Space between icon and text
          }}
          className="bottom_content"
        >
          <img
            src={Dashborad_completed}
            alt="Completed Icon"
            style={{ width: 50, height: 50 }} // Adjust size as needed
          />
          <div>
            <Typography
              variant="inherit"
              className="icon_varient"
              sx={{ fontWeight: 600, color: "#A6A9AC" }}
            >
              {content2}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: 17 }}>
              {content1Key}
            </Typography>
          </div>
        </Box>

        {/* Second Box */}
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2, // Space between icon and text
          }}
          className="bottom_content"
        >
          <img
            src={Dashborad_incompleted}
            alt="Incomplete Icon"
            style={{ width: 50, height: 50 }} // Adjust size as needed
          />
          <div>
            <Typography
              variant="inherit"
              className="icon_varient"
              sx={{ fontWeight: 600, color: "#A6A9AC" }}
            >
              {content1}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: 17 }}>
              {content2Key}
            </Typography>
          </div>
        </Box>
      </Box>
    </Card>
  );
};

export default CompletionTasks;

CompletionTasks.propTypes = {
  dashboardData: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  content2Key: PropTypes.string.isRequired,
  content1Key: PropTypes.string.isRequired,
  content1: PropTypes.string.isRequired,
  content2: PropTypes.string.isRequired,
  TotalTask: PropTypes.number.isRequired,
};
