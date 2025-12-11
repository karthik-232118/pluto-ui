import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import Allcaughtup from "../../allpages/masterpopups/Allcaughtup";
import { dateformatter } from "../../../utils/index";
import SOPsIcon from "../../../assets/svg/SavedList/SOPsHeading.svg";
import reactflowIcon from "../../../assets/svg/SavedList/react-flow-icon.svg";
import TrainingIcon from "../../../assets/svg/SavedList/TrainingHeading.svg";
import TestIcon from "../../../assets/svg/SavedList/TestHeading.svg";
import openBook from "../../../assets/svg/SavedList/OpenBook.svg";
import { useDispatch } from "react-redux";
import { setElementID } from "../../../store/dashboardelementID/actions";
import { useTranslation } from "react-i18next";
import { setActionData } from "../../../store/ActionableData/actionSlice";
import PropTypes from "prop-types";
import React from "react";
import { frontendState } from "../../../store/presist/action";

const MyActionable = ({ dashboardData, actionableData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const limitedActionables = actionableData?.slice(0, 10);
  console.log("dashboardDatasd", dashboardData?.actionable);
  const handleTestSimulationClick = (action) => {
    // console.log("actionddddddd", action);
      dispatch(frontendState(action));
    dispatch(setActionData(action));
    if (action.ModuleName === "Workflow") {
      window.open(action.ElementID, "_blank");
      return; 
    }
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
        break;
    }
  };

  const handleViewAllClick = () => {
    navigate("/all-tests"); // Assuming you route to "/all-tests" for viewing all TestSimulationNames
  };

  const GetDocicon = (elemen) => {
    if (elemen?.ModuleName === "Document") {
      return openBook;
    } else if (elemen?.ModuleName === "TrainingSimulation") {
      return TrainingIcon;
    } else if (elemen?.ModuleName === "SOP") {
      return SOPsIcon;
    } else if (elemen?.ModuleName === "TestMCQ") {
      return TestIcon;
    } else if (elemen?.ModuleName === "TestSimulation") {
      return TrainingIcon;
    } else if (elemen?.ModuleName === "Workflow") {
      return reactflowIcon;
    }
  };
  return (
    <>
      <Grid item xs={12} md={12} sm={12} paddingLeft={5.2}>
        <Card className="equal-height">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            position="sticky"
            top={0} // Ensure it sticks to the top of its parent
            zIndex={1} // Bring it above other content
            padding={2} // Add some padding for aesthetics
          >
            <div>
              <Typography variant="h6">
                {t("MyActionables")} {/* "My Actionables" (translated) */}
              </Typography>
              <Typography variant="body2" className="sub_variant">
                {t("ImmediateAttention")}
                {/* "Need immediate attention" (translated) */}
              </Typography>
            </div>
            <Button className="arrow_btn" onClick={handleViewAllClick}>
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
          <Box className="scrollable-content" sx={{ marginTop: 0, p: 1 }}>
            {limitedActionables?.length > 0 ? (
              limitedActionables?.map((action, index) => (
                <React.Fragment key={index}>
                  <Box
                    display="flex"
                    alignItems="center"
                    mb={2}
                    padding={1}
                    onClick={() => handleTestSimulationClick(action)}
                    marginBottom={0}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={GetDocicon(action)}
                      alt=""
                      style={{ marginRight: 16 }}
                    />
                    <div>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 400, fontSize: 14, mb: 0.1 }}
                      >
                        {action.ElementName}
                      </Typography>
                      <Typography variant="body2" className="due_variant">
                        Due on{" "}
                        {action?.DueDate
                          ? dateformatter(action?.DueDate)
                          : "N/A"}
                      </Typography>
                    </div>
                  </Box>
                  {index !== limitedActionables?.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Allcaughtup image={true} height={400} />
            )}
          </Box>
        </Card>
      </Grid>
    </>
  );
};

export default MyActionable;

MyActionable.propTypes = {
  dashboardData: PropTypes.object,
  actionableData: PropTypes.array,
};