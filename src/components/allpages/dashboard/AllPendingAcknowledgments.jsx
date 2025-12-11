import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  Divider,
  Typography,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Reuse your existing dateformatter and Allcaughtup
import { dateformatter } from "../../../utils/index";
import Allcaughtup from "../../allpages/masterpopups/Allcaughtup";

// Reuse your existing icons
import SOPsIcon from "../../../assets/svg/SavedList/SOPsHeading.svg";
import TrainingIcon from "../../../assets/svg/SavedList/TrainingHeading.svg";
import TestIcon from "../../../assets/svg/SavedList/TestHeading.svg";
import openBook from "../../../assets/svg/SavedList/OpenBook.svg";

// Actions
import { GetDynamicDashboard } from "../../../store/dashboard/action";
import { setElementID } from "../../../store/dashboardelementID/actions";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

// Helper to style the element tag
const ElementStyle = (type) => ({
  fontWeight: "500",
  color:
    type === "Document"
      ? "#673AB7"
      : type === "TrainingSimulation"
      ? "#673AB7"
      : type === "SOP" || type === "TestMCQ" || type === "TestSimulation"
      ? "#5290F7"
      : "#000000",
  backgroundColor:
    type === "SOP"
      ? "#D1C4E9"
      : type === "TestMCQ" || type === "TestSimulation"
      ? "#E6F4F1"
      : type === "Document"
      ? "#F2F4FE"
      : "#FFFFFF",
  padding: "2px 8px",
  borderRadius: "8px",
  display: "inline-block",
  fontSize: "12px",
  fontStyle: "normal",
  lineHeight: "18px",
  letterSpacing: "0.16px",
});

const GetDocIcon = (type) => {
  switch (type) {
    case "Document":
      return openBook;
    case "TrainingSimulation":
    case "TestSimulation":
      return TrainingIcon;
    case "SOP":
      return SOPsIcon;
    case "TestMCQ":
      return TestIcon;
    default:
      return openBook; 
  }
};

const AllPendingAcknowledgments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dynamicDashboardData, isLoading } = useSelector(
    (state) => state.dashboard
  );
  const payload = {
    RequestedData: [
      "AcknowledgeData",
      "DocumentData",
      "UpcummingTestData",
      "FormData",
    ],
  };
  useEffect(() => {
    dispatch(GetDynamicDashboard(payload));
  }, [dispatch]);
  const allActionables = dynamicDashboardData?.data?.PendingAcknowledge || [];
  const handleTestSimulationClick = (action) => {
    dispatch(setElementID(action.ElementID, action.ElementTypeName));
    switch (action.ElementTypeName) {
      case "SOP":
        navigate("/sops/view", { state: { fromActionables: true } });
        break;
      case "TrainingSimulation":
        navigate("/training-simulations/view", {
          state: { fromActionables: true },
        });
        break;
      case "TestSimulation":
        navigate("/test-simulations/view", {
          state: { fromActionables: true },
        });
        break;
      case "TestMCQ":
        navigate("/test-mcqs/view", { state: { fromActionables: true } });
        break;
      case "Document":
        navigate("/documents/view", { state: { fromActionables: true } });
        break;
      default:
        break;
    }
  };

  return (
    <Box>
      <Box sx={{ backgroundColor: "#fff", height: "70px" }}>
        <Button
          style={{ margin: "18px 0 20px 24px" }}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="contained"
        >
          Back
        </Button>
      </Box>
      <Card
        sx={{
          background: "#FFFFFF73",
          display: "flex",
          flexDirection: "column",
          width: "96.5%",
          margin: "20px auto",
          height: "calc(100vh - 150px)", // Adjust as needed
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding={2}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "18px" }}>
            All Pending Acknowledgments ({allActionables.length})
          </Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            background: "#FFFFFF73",
            flexGrow: 1,
            overflowY: "auto",
            padding: "16px",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : allActionables.length > 0 ? (
            <Grid container spacing={2}>
              {allActionables.map((action, index) => {
                const dueDate = new Date(action?.DueDate);
                const now = new Date();
                const diffMs = dueDate - now;
                const diffDays = diffMs / (1000 * 60 * 60 * 24);
                let color = "#2E7D32"; 
                if (diffDays < 0) color = "red"; 
                else if (diffDays <= 3) color = "gold"; 

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={action.ElementID + index}
                  >
                    <Card
                      sx={{
                        cursor: "pointer",
                        mb: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                      onClick={() => handleTestSimulationClick(action)}
                    >
                      <Box display="flex" alignItems="center" sx={{ p: 2 }}>
                        <Box
                          component="img"
                          src={GetDocIcon(action.ElementTypeName)}
                          alt={`${action.ElementTypeName} Icon`}
                          sx={{ width: 35, height: 35, mr: 2 }}
                        />
                        <Box flexGrow={1}>
                          <Typography variant="body2">
                            {action.ElementName}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 0.5,
                            }}
                          >
                            <Box
                              sx={ElementStyle(action.ElementTypeName)}
                              style={{ fontSize: "8px" }}
                            >
                              {action.ElementTypeName}
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                ml: 1,
                                color: "#555555",
                              }}
                            >
                              <AccessTimeIcon
                                fontSize="small"
                                sx={{ mr: 0.5, height: "14px", width: "14px" }}
                              />
                              <span style={{ fontSize: "12px" }}>Due on:</span>
                              <span
                                style={{
                                  color,
                                  marginLeft: "4px",
                                  fontSize: "12px",
                                }}
                              >
                                {dateformatter(dueDate)}
                              </span>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Allcaughtup image={true} height={400} />
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default AllPendingAcknowledgments;


