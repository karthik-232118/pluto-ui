import React from "react";
import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Allcaughtup from "../../allpages/masterpopups/Allcaughtup";
import { dateformatter } from "../../../utils/index";
import SOPsIcon from "../../../assets/svg/SavedList/SOPsHeading.svg";
import TrainingIcon from "../../../assets/svg/SavedList/TrainingHeading.svg";
import TestIcon from "../../../assets/svg/SavedList/TestHeading.svg";
import openBook from "../../../assets/svg/SavedList/OpenBook.svg";
import { useDispatch } from "react-redux";
import { setElementID } from "../../../store/dashboardelementID/actions";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

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

  const PendingAcknowledgments = ({ dashboardData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allActionables =
    dashboardData?.data?.PendingAcknowledge?.slice(0, 10) || [];
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
        return openBook; // Default icon if type is unknown
    }
  };
  return (
    <>
      <Grid item xs={12} md={12} sm={12} paddingLeft={2}>
    <Card
    
    className="equal-height"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={2}
      >
        <div>
          <Typography
            variant="h6"
            style={{ fontWeight: "600", fontSize: "18px" }}
          >
            {t("pendingAcknowledgments")}
          </Typography>
          <Typography variant="body2" className="sub_variant">
            {t("pendingAcknowledgmentsDesc")}
          </Typography>
        </div>

        <Button
          className="arrow_btn"
          onClick={() => navigate("/acknowledgments")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M3.33203 8.00065H12.6654M12.6654 8.00065L7.9987 3.33398M12.6654 8.00065L7.9987 12.6673"
              stroke="#344054"
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
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
        {allActionables.length > 0 ? (
          allActionables.map((action, index) => {
            // 1) Calculate color based on DueDate
            const dueDate = new Date(action?.DueDate);
            const now = new Date();
            const diffMs = dueDate - now; // in milliseconds
            const diffDays = diffMs / (1000 * 60 * 60 * 24);

            let color = "#2E7D32"; // green default
            if (diffDays < 0) {
              color = "red"; // Overdue
            } else if (diffDays <= 3) {
              color = "gold"; // Expires soon
            }

            return (
              <React.Fragment key={action.ElementID + index}>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleTestSimulationClick(action)}
                >
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
                      sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
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
                {index !== allActionables.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </React.Fragment>
            );
          })
        ) : (
          <Allcaughtup image={true} height={400} />
        )}
      </Box>
    </Card>
    </Grid>
    </>
  );
};

export default PendingAcknowledgments;


PendingAcknowledgments.propTypes = {
  dashboardData: PropTypes.shape({
    data: PropTypes.shape({
      PendingAcknowledge: PropTypes.arrayOf(
        PropTypes.shape({
          ElementID: PropTypes.string.isRequired,
          ElementName: PropTypes.string.isRequired,
          ElementTypeName: PropTypes.string.isRequired,
          DueDate: PropTypes.string.isRequired,
        })
      ),
    }),
  }),
};