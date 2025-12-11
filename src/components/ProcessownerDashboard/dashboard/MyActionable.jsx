import {
  Box,
  Card,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import reviewpending from "../../../assets/svg/dashboard/ReviewPending.svg";
import pendingacknowledgement from "../../../assets/svg/dashboard/PendingAcknowledgement.svg";
import approvalpending from "../../../assets/svg/dashboard/ApprovalPending.svg";
import pendingstakeholder from "../../../assets/svg/dashboard/PendingStakeholder.svg";
import mycompletions from "../../../assets/svg/dashboard/MyCompletions.svg";
import {
  setDashboardData,
  setSelectedTitle,
} from "../../../store/dashboardActions/actions";
import { useDispatch } from "react-redux";

const MyActionable = ({ dynamicDashboardData, onItemClick }) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (dynamicDashboardData && Object.keys(dynamicDashboardData).length > 0) {
      setIsLoading(false);
    }
  }, [dynamicDashboardData]);
  console.log(
    "dynamicDashboardDataMycoloo",
    dynamicDashboardData?.PendingAcknowledge
  );
  const pendingReviewCount =
    dynamicDashboardData?.ElementStatus?.PendingReview?.count ?? 0;
  const pendingApprovalCount =
    dynamicDashboardData?.ElementStatus?.PendingApproval?.count ?? 0;
  const pendingDraftCount =
    dynamicDashboardData?.ElementStatus?.DraftState?.count ?? 0;
  const pendingStakeholderCount =
    dynamicDashboardData?.ElementStatus?.StekHolderPending?.count ?? 0;
  const MyCompletionCount =
    dynamicDashboardData?.ElementStatus?.MyCompletion?.count ?? 0;
  const pendingAcknowledgementCount =
    dynamicDashboardData?.PendingAcknowledge?.length ?? 0;
  useEffect(() => {
    if (dynamicDashboardData) {
      dispatch(
        setDashboardData(
          dynamicDashboardData?.ElementStatus,
          dynamicDashboardData?.PendingAcknowledge
        )
      );
    }
  }, [dynamicDashboardData, dispatch]);
  console.log("Pending InProgress Count:", pendingDraftCount);
  console.log(
    "Pending Review Count:",
    pendingReviewCount,
    "Pending Approval Count:",
    pendingApprovalCount
  );

  const formatCount = (count) => {
    if (isLoading) {
      return (
        <CircularProgress size={20} thickness={4} sx={{ color: "#333" }} />
      );
    }
    return count > 99 ? "99+" : count;
  };

  const actionItems = [
    {
      id: 2,
      title: "Review Pending",
      icon: <img src={reviewpending} alt="" width={40} height={40} />,
      count: pendingReviewCount,
      color: "#FFE082",
    },
    {
      id: 3,
      title: "Approval Pending",
      icon: <img src={approvalpending} alt="" width={40} height={40} />,
      count: pendingApprovalCount,
      color: "#80DEEA",
    },
    {
      id: 4,
      title: "Pending Stakeholder",
      icon: <img src={pendingstakeholder} alt="" width={40} height={40} />,
      count: pendingStakeholderCount,
      color: "#B39DDB",
    },
    {
      id: 5,
      title: "My Completions",
      icon: <img src={mycompletions} alt="" width={40} height={40} />,
      count: MyCompletionCount,
      color: "#81C784",
      hasDividerBelow: true,
    },
    {
      id: 6,
      title: "Pending Acknowledgement",
      icon: <img src={pendingacknowledgement} alt="" width={40} height={40} />,
      count: pendingAcknowledgementCount,
      color: "#7986CB",
    },
  ];

  const handleItemClick = (item) => {
    dispatch(setSelectedTitle(item.title || ""));
    setSelectedItem(item);
    setModalOpen(true);
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <Card
      sx={{
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "410px",
        width: "96.5%",
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
          <Typography variant="h6">{t("MyActionables")}</Typography>
          <Typography variant="body2" className="sub_variant">
            {t("ImmediateAttention")}
          </Typography>
        </div>
      </Box>
      <Divider />
      <Box
        className="scrollable-content"
        sx={{ marginTop: 0, p: 1, flexGrow: 1 }}
      >
        {actionItems.map((item, index) => (
          <React.Fragment key={index}>
            <Box
              display="flex"
              alignItems="center"
              mb={2}
              padding={1}
              onClick={() => handleItemClick(item)}
              marginBottom={0}
              sx={{
                cursor: "pointer",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: item.color + "80",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {item.icon}
              <Box
                flexGrow={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml={2}
              >
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      fontSize: 14,
                      mb: 0.1,
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      backgroundColor: item.color,
                      color: "#333",
                      fontWeight: 500,
                      borderRadius: "50%",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: item.count > 99 ? "10px" : "inherit",
                    }}
                  >
                    {formatCount(item.count)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {(index !== actionItems.length - 1 || item.hasDividerBelow) && (
              <Divider sx={{ my: 0.5 }} />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Card>
  );
};

export default MyActionable;

MyActionable.propTypes = {
  dashboardData: PropTypes.object,
  dynamicDashboardData: PropTypes.object,
};

MyActionable.defaultProps = {
  dashboardData: {},
  dynamicDashboardData: {},
};

