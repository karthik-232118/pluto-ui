import { useState, useEffect } from "react";
import { Grid, Typography, Box, CircularProgress, Card } from "@mui/material";
import ElementsExpiry from "../ElementsExpiry";
import ProrTypes from "prop-types";
import arrow from "../../../assets/svg/dashboard/arrow-up-right.svg";
import stakeholder from "../../../assets/svg/dashboard/Stakeholder.svg";
import toreviewer from "../../../assets/svg/dashboard/ToReviewer.svg";
import approved from "../../../assets/svg/dashboard/Approved.svg";
import reviewed from "../../../assets/svg/dashboard/Reviewed.svg";
import myrejection from "../../../assets/svg/dashboard/MyRejection.svg";
import published from "../../../assets/svg/dashboard/Published.svg";
import elementexpiry from "../../../assets/svg/dashboard/ElementExpiry.svg";
import { useTranslation } from "react-i18next";
import {
  setSelectedTitle,
  setDashboardData,
} from "../../../store/dashboardActions/actions";
import { useDispatch } from "react-redux";
 
const cardStyles = {
  dashborad_card1: {
    background: "#8C42FF",
  },
  dashborad_card2: {
    background: "#00C087",
  },
  dashborad_card3: {
    background: "#E78B00",
  },
  dashborad_card4: {
    background: "#19BDD1",
  },
  dashborad_card5: {
    background: "#57C05B",
  },
  dashborad_card6: {
    background: "#FF5353",
  },
  dashborad_card7: {
    background: "#FF4081",
  },
};
 
const DashboardCards = ({
  card1,
  card2,
  card3,
  card4,
  card5,
  card6,
  card7,
  card1key,
  card2key,
  card3key,
  card4key,
  card5key,
  card6key,
  card7key,
  dynamicDashboardData,
  onCardClick,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [dashboardData, setDashboardDatas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openElementsExpiryModal, setOpenElementsExpiryModal] = useState(false);
  const dispatch = useDispatch();
 
  const { t } = useTranslation();
 
  const handleCardClick = (cardTitle, index) => {
    if (index === 5) {
      setOpenElementsExpiryModal(true);
    } else {
      dispatch(setSelectedTitle(cardTitle));
      setModalTitle(cardTitle);
      setOpenModal(true);
    }
    if (onCardClick) {
      onCardClick();
    }
  };
 
  const cards = [
    { title: card1, value: card1key, image: stakeholder },
    {
      title: card2,
      value: isLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        card2key || dashboardData?.MyEscalated?.count || 0
      ),
      image: toreviewer,
    },
    {
      title: card3,
      value: isLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        card3key || dashboardData?.ReviewState?.count || 0
      ),
      image: reviewed,
    },
    {
      title: card4,
      value: isLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        card4key || dashboardData?.Approved?.count || 0
      ),
      image: approved,
    },
    {
      title: card5,
      value: isLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        card5key || 0
      ),
      image: published,
    },
    {
      title: card6,
      value: isLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        card6key || 0
      ),
      image: elementexpiry,
    },
    {
      title: card7,
      value: isLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        card7key || 0
      ),
      image: myrejection,
    },
  ];
 
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
 
  useEffect(() => {
    setIsLoading(true);
    const dynamicDashboardData = localStorage.getItem("dynamicDashboardData");
    console.log("Retrieved dynamicDashboardData:", dynamicDashboardData);
 
    try {
      const parsedData = dynamicDashboardData
        ? JSON.parse(dynamicDashboardData)
        : null;
      setDashboardDatas(parsedData?.data?.ElementStatus || {});
      console.log("Parsed dynamicDashboardData enduser:", parsedData?.data?.ElementStatus);
    } catch (error) {
      console.error("Failed to parse dynamicDashboardData:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
 
  return (
    <>
      <Card
        sx={{
          border: "1px solid #D6E6F2",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
          marginRight: "1.1rem",
          marginLeft: "1.1rem",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            marginBottom: "1rem",
            color: "#333",
          }}
        >
          {t("elementTransition")}
        </Typography>
 
        <Grid container spacing={2}>
          {cards.map((card, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={1.714}>
              <Box
                sx={{
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "1rem",
                  height: "100%",
                  cursor: "pointer",
                  ...cardStyles[`dashborad_card${index + 1}`],
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  },
                }}
                onClick={() => handleCardClick(card.title, index)}
                className={`dashborad_card${index + 1}`}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  style={{
                    width: "40px",
                    height: "40px",
                    marginRight: "1rem",
                  }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: 12,
                      color: "#FFFFFFE5",
                      display: "block",
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {card.value}
                      <img src={arrow} alt="" style={{ marginLeft: 8 }} />
                    </Box>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>
     
      <ElementsExpiry
        open={openElementsExpiryModal}
        onClose={() => setOpenElementsExpiryModal(false)}
      />  
    </>
  );
};
 
export default DashboardCards;
 
DashboardCards.propTypes = {
  card1: ProrTypes.string.isRequired,
  card2: ProrTypes.string.isRequired,
  card3: ProrTypes.string.isRequired,
  card4: ProrTypes.string.isRequired,
  card5: ProrTypes.string.isRequired,
  card6: ProrTypes.string.isRequired,
  card7: ProrTypes.string.isRequired,
  card1key: ProrTypes.string.isRequired,
  card2key: ProrTypes.string.isRequired,
  card3key: ProrTypes.string.isRequired,
  card4key: ProrTypes.string.isRequired,
  card5key: ProrTypes.string.isRequired,
  card6key: ProrTypes.string.isRequired,
  card7key: ProrTypes.string.isRequired,
};
 
