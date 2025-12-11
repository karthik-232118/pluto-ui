import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { openSidbar } from "../../store/flow/action";

const WorkflowHeader = ({ configData, saveAction, flowdata, status }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming you are getting the `id` from the URL
  const location = useLocation(); // This helps to track the current URL location
  const [selectedTab, setSelectedTab] = useState(0);

  // Set the selected tab based on the current URL path
  useEffect(() => {
    if (location.pathname.includes("run")) {
      setSelectedTab(0); // Set "Execution" tab as active
    } else if (location.pathname.includes("workflow-creation")) {
      setSelectedTab(1); // Set "Workflow Creation" tab as active
    }
  }, [location.pathname]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      navigate(`/run/${id}`); // Navigate to execution path
    } else if (newValue === 1) {
      navigate(`/workflow-creation/${id}`); // Navigate to workflow creation path
    }
  };

  return (
    <Box className="flow-header">
      <Typography variant="h7">{flowdata?.FlowName}</Typography>
      <div>
        {status ? (
          status
        ) : (
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="workflow tabs"
            sx={{ height: "40px" }}
          >
            <Tab
              label="Execution"
              disabled={Object.keys(configData).length === 0}
              value={0}
              variant="caption"
            />
            <Tab label="Workflow Creation" value={1} variant="caption" />
          </Tabs>
        )}
      </div>
      {saveAction || <div />}
    </Box>
  );
};

export default WorkflowHeader;
