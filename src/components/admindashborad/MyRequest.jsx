import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import LiveSessions from "./LiveSessions";
import { useNavigate } from "react-router";
import Allcaughtup from "../allpages/masterpopups/Allcaughtup";
import EditReqModal from "./EditReqModal";
import { dateformatter } from "../../utils/index";
import { useTranslation } from "react-i18next";
// import "./AdminDashBorad.css";

const ActionablesAndLeaderboard = ({ dashboardData, getmyrequest }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const limitedActionables = dashboardData?.actionable?.slice(0, 10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const handleViewAllClick = () => {
    navigate("/my-request");
  };

  const handleActionClick = (action) => {
    setSelectedAction(action); // Set the selected action data
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedAction(null); // Clear selected action data
  };

  return (
    <Grid container spacing={3}>
      {/* My Actionables */}
      <Grid item xs={12} md={6} sm={12} sx={{ marginTop: "2rem" }}>
        <Card
          className="equal-height"
          sx={{
            overflow: "auto",
            height: "510px",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            position="sticky"
            top={0}
            zIndex={1}
            padding={2}
          >
            <div>
              <Typography variant="h6">{t("myActionables")}</Typography>
              <Typography
                variant="body1"
                sx={{ color: "#A6A9AC", fontWeight: "300", fontSize: "14px" }}
              >
               {t("tasksRequireAttention")}
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
          <Box
          //  mt={2} 
           className="scrollable-content">
            {getmyrequest?.data?.length > 0 ? (
              getmyrequest?.data?.map((action, index) => (
                <React.Fragment key={index}>
                  <Box
                    display="flex"
                    alignItems="center"
                    m={2}
                    onClick={() => handleActionClick(action)}
                  >
                    <div>
                      <Typography
                        variant="body1"
                        className="action_item"
                        marginBottom={0}
                      >
                        {action.RequestTitle}
                      </Typography>

                      <Typography variant="body2" className="due_variant">
                        {action?.CreatedDate
                          ? dateformatter(action?.CreatedDate)
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

      {/* Live Sessions */}
      <Grid item xs={12} md={6} sm={12}>
        <LiveSessions dashboardData={dashboardData} />
      </Grid>

      {/* Edit Request Modal */}
      <EditReqModal
        editdata={selectedAction}
        onClose={handleCloseModal}
        open={isModalOpen}
      />
    </Grid>
  );
};

export default ActionablesAndLeaderboard;
