import React, { useState } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import { UpdateExecutionHistory } from "../../../store/flow/action";
import ReplayIcon from "@mui/icons-material/Replay";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"; // Left arrow for collapse
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; // Right arrow for expand
import { dateformatter, getStatusStyle, getStatus } from "../../../utils";

const RightSideRunflow = ({}) => {
  const dispatch = useDispatch();
  // Access workflow list from Redux store
  const { executionHistoryData } = useSelector((state) => state.workflow);

  const [isVisible, setIsVisible] = useState(true); // State to toggle visibility of the entire component

  const handleOncClick = (flow) => {
    dispatch(
      UpdateExecutionHistory({
        ExecutionFlowID: flow.ExecutionFlowID,
      })
    );
  };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev); // Toggle the visibility state of the whole component
  };

  return (
    <Box
      sx={{
        height: "74vh",
      }}
    >
      <Box
        className="activity" // Fixed typo here for class name
        sx={{
          width: isVisible ? "230px" : "50px", // Width changes based on visibility
        }}
      >
        {isVisible && (
          <>
            <ReplayIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption">Activity</Typography>
          </>
        )}
        <IconButton onClick={toggleVisibility}>
          {isVisible ? (
            <ArrowBackIosIcon sx={{ fontSize: 14 }} /> // Adjusted size for the left arrow icon
          ) : (
            <ArrowForwardIosIcon sx={{ fontSize: 14 }} /> // Adjusted size for the right arrow icon
          )}
        </IconButton>
      </Box>

      {/* Conditionally render the entire component based on isVisible */}
      <Box
        className="runworkflowsteps" // Fixed typo here for class name
        sx={{
          background: (theme) => theme.palette.background.default,
          borderRadius: "0",
          width: isVisible ? "230px" : "0px", // Width changes based on visibility
          overflowY: "auto",
          padding: 0,
          transition: "width 0.3s ease", // Smooth transition effect for expand/collapse
          overflowy: "scroll", // Hide overflow content when collapsed
        }}
      >
        <List>
          {executionHistoryData?.executionHistory?.map((step, stepIndex) => (
            <ListItem
              key={stepIndex}
              sx={{
                borderBottom: "1px solid", // Border color and thickness
                borderColor: (theme) => theme.palette.divider, // Use theme's divider color for the border
                borderRadius: "0",
                padding: "10px 16px", // Remove default padding (optional)
                cursor: "pointer",
              }}
            >
              <ListItemText>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="caption" fontWeight={500}>
                    {step?.FlowName}
                  </Typography>
                  <Box
                    sx={getStatusStyle(step?.LatestStatus)}
                    onClick={() => {
                      handleOncClick(step);
                    }}
                  >
                    {step?.LatestStatus}
                    <img
                      src={getStatus(step?.LatestStatus)}
                      alt={step?.LatestStatus}
                    />
                  </Box>
                  <Typography variant="caption">
                    {dateformatter(step?.StartDate)}
                  </Typography>
                </Box>
              </ListItemText>
              <IconButton>
                <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default RightSideRunflow;
