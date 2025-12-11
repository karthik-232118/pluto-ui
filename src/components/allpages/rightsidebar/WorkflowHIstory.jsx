import { useDispatch, useSelector } from "react-redux";
import "../../workflow/flow.css";
import {
  ExecuteFlowHistoryToGetData,
} from "../../../store/flow/action";
import { dateformatter, getStatusStyle, getStatus } from "../../../utils";
import { useEffect } from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

const History = () => {
  const dispatch = useDispatch();
  const { executionHistoryData } = useSelector((state) => state.workflow);
  const { SOPReactFlow } = useSelector((state) => state.SOPReactFlow);
  useEffect(() => {
    dispatch(
      ExecuteFlowHistoryToGetData({
        FlowID: SOPReactFlow.sopModuleDraft.SOPID,
      })
    );
  }, [SOPReactFlow]);

  return (
    <Box>
      <Box
        className="runworkflowsteps" // Fixed typo here for class name
        sx={{
          background: (theme) => theme.palette.background.default,
          borderRadius: "0",
          width: "230px", // Width changes based on visibility
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
              {/* <IconButton>
                  <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                </IconButton> */}
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default History;
