import  { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Card,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SOPsIcon from "../../../assets/svg/SavedList/SOPsHeading.svg";
import TrainingIcon from "../../../assets/svg/SavedList/TrainingHeading.svg";
import TestIcon from "../../../assets/svg/SavedList/TestHeading.svg";
import documentIcon from "../../../assets/svg/SavedList/OpenBook.svg";
import { setElementID } from "../../../store/dashboardelementID/actions";
import { dateformatter } from "../../../utils";
import { useTranslation } from "react-i18next";
import { useSocket } from "../../../context/SocketContext";
import notify from "../../../assets/svg/utils/toast/Toast";
import { ActionableApi } from "../../../services/dashboard/dashboard";
import { setActionData } from "../../../store/ActionableData/actionSlice";
import { frontendState } from "../../../store/presist/action";

const GetIcon = (elemen) => {
  if (elemen?.ModuleName === "Document") {
    return documentIcon;
  } else if (elemen?.ModuleName === "TrainingSimulation") {
    return TrainingIcon;
  } else if (elemen?.ModuleName === "SOP") {
    return SOPsIcon;
  } else if (elemen?.ModuleName === "TestMCQ") {
    return TestIcon;
  } else if (elemen?.ModuleName === "TestSimulation") {
    return TestIcon;
  }
};

const AllTestsPage = () => {
  const socket = useSocket();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {  error } = useSelector((state) => state.dashboard);
  const [actionableData, setActionableData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true); // Track loading state for data

  useEffect(() => {
    fetchActionableData();
  }, []);

  const fetchActionableData = async () => {
    try {
      const response = await ActionableApi();
      setActionableData(response);
    } catch (error) {
      console.error("Error fetching actionable data:", error);
    } finally {
      setIsLoadingData(false); 
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };


  const handleNavigateClick = (action) => {
    dispatch(frontendState(action));
    dispatch(setActionData(action));
    dispatch(setElementID(action.ElementID, action.ModuleName));

    switch (action.ModuleName) {
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
        navigate(`/documents/view`, { state: { fromActionables: true } });
        break;
      default:
    }
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    const documentEditFailureHandler = (message) => {
      if (message) {
        notify("error", message);
      }
    };

    socket
      .off("document-edit-failure")
      .on("document-edit-failure", documentEditFailureHandler);

    return () => {
      socket.off("document-edit-failure", documentEditFailureHandler);
    };
  }, [socket]);

  return (
    <Box style={{ margin: "3rem" }}>
      {isLoadingData && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress size={50} />
        </Box>
      )}
      {error && (
        <Typography color="error" align="center" variant="h6">
          Error: {error}
        </Typography>
      )}
      {!isLoadingData && !error && actionableData && (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">{t("MyActionables")}</Typography>
            <Button onClick={handleBackClick} variant="outlined">
              {t("backHome")}
            </Button>
          </Box>

          <div className="divider"></div>
          {actionableData.length === 0 ? (
            <Box mt={4}>
              <Typography variant="h6" align="center">
                No actionables data found
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3} mt={2}>
              {actionableData.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      padding: "1rem",
                      display: "flex",
                      alignItems: "center",
                      boxShadow: 3,
                      borderRadius: "8px",
                      cursor: "pointer",
                      ":hover": {
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => handleNavigateClick(action)}
                  >
                    <img
                      src={GetIcon(action)}
                      alt="Module Icon"
                      style={{ marginRight: 16, width: 40, height: 40 }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        title={action.ElementName || "N/A"}
                        style={{
                          fontWeight: "500",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {action.ElementName || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {action?.DueDate
                          ? dateformatter(action?.DueDate)
                          : "N/A"}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default AllTestsPage;
