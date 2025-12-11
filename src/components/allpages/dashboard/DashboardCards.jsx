

import PropTypes from "prop-types";
import moment from "moment";
import { Grid, Typography, Skeleton, Box } from "@mui/material";
import { useNavigate } from "react-router";
import commoncube from "../../../assets/svg/dashboard/common.svg";
import pendding from "../../../assets/svg/dashboard/pending.svg";

const DashboardCards = ({
  card1,
  card2,
  card3,
  card4,
  card5,
  card1key,
  card2key,
  card3key,
  card4key,
  card5key,
}) => {
  const navigate = useNavigate();
  const clickableCardCount = 3;

  const calculateRemainingDays = () => {
    const validityDate = moment(card4key);
    const today = moment();
    return Math.max(validityDate.diff(today, "days"), 0);
  };

  const cards = [
    { title: card5, value: card5key, image: pendding },
    { title: card1, value: card1key, image: commoncube },
    { title: card2, value: card2key, image: commoncube },
    { title: card3, value: card3key, image: commoncube },
    { title: card4, value: calculateRemainingDays(), image: commoncube },
  ];

  const handleCardClick = (cardTitle) => {
    switch (cardTitle) {
      case "Elements Expiry":
        navigate("/elements-expiry");
        break;
      case "Unaccessed Elements":
        navigate("/unaccessed-elements");
        break;
      case "Rejected Element":
        navigate("/rejected-elements");
        break;
      default:
        console.log("Card clicked:", cardTitle);
    }
  };

  return (
    <Box sx={{ padding: "1rem" }}>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid
            key={index}
            item
            xs={12}
            sm={6}
            md={3}
            lg={2.4}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#1e293b",
              padding: "1.5rem",
              borderRadius: "8px",
              cursor: index < clickableCardCount ? "pointer" : "default",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: index < clickableCardCount ? "scale(1.05)" : "none",
              },
            }}
            onClick={() => index < clickableCardCount && handleCardClick(card.title)}
          >
            <Typography
              variant="caption"
              textTransform="uppercase"
              color="white"
              sx={{ marginBottom: "0.5rem" }}
            >
              {card.title}
            </Typography>
            <Typography
              variant="h6"
              color="white"
              sx={{ fontWeight: "bold", marginBottom: "1rem" }}
            >
              {card.value ?? <Skeleton variant="text" />}
            </Typography>
            <img
              src={card.image}
              alt={card.title}
              style={{ width: "50px", height: "50px" }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

DashboardCards.propTypes = {
  card1: PropTypes.string.isRequired,
  card2: PropTypes.string.isRequired,
  card3: PropTypes.string.isRequired,
  card4: PropTypes.string.isRequired,
  card5: PropTypes.string.isRequired,
  card1key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  card2key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  card3key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  card4key: PropTypes.string.isRequired,
  card5key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DashboardCards;

