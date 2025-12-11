// import { Grid, Skeleton, Typography } from "@mui/material";
// import "./DashBoard.css";
// import dashboard_cube1 from "../../../assets/image/dashborad/dashboard_cube1.svg";
// import dashboard_cube2 from "../../../assets/image/dashborad/dashboard_cube2.svg";
// import dashboard_cube3 from "../../../assets/image/dashborad/dashboard_cube3.svg";
// import dashboard_cube4 from "../../../assets/image/dashborad/dashboard_cube4.svg";
// import { useSelector } from "react-redux";
// import moment from "moment";

// const DashboardCards = ({ dashboardData, card1, card2, card3, card4, card1key, card2key, card3key, card4key }) => {
//   const { loading } = useSelector((state) => state.dashboard);

//   // Calculate remaining days until license expiration
//   const calculateRemainingDays = () => {
//     const validityDate = moment(card4key);
//     const today = moment();
//     const remainingDays = validityDate.diff(today, "days");
//     return remainingDays > 0 ? remainingDays : 0; // Avoid negative numbers
//   };

//   return (
//     <Grid container gap={1.7} sx={{ marginTop: "1rem", marginLeft: "20px" }}>
//       {[
//         {

//           title: card1,
//           value: card1key,
//           image: dashboard_cube1,
//         },
//         {
//           title: card2,
//           value: card2key,
//           image: dashboard_cube2,
//         },
//         {

//           title: card3,
//           value: card3key,
//           image: dashboard_cube3,
//         },
//         {
//           title: card4, value: calculateRemainingDays(card4key),
//           image: dashboard_cube4,
//         },
//       ].map((card, index) => (
//         <Grid
//           key={index}
//           item
//           xs={12}
//           sm={12}
//           md={2.9}
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: "1rem",
//             width: "auto",
//           }}
//           className={`dashborad_card${index + 1}`}
//         >
//           {
//             loading ? <Skeleton height={20} width={100} animation={"wave"} /> : <div>
//               <Typography variant="caption" textTransform={"uppercase"} color={"white"}>
//                 {card.title}
//               </Typography>
//               <Typography variant="h6" className="card_numbers">
//                 {card.value}
//               </Typography>
//             </div>
//           }
//           <img src={card.image} alt={card.title} />
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default DashboardCards;

import React, { useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import dashboard_cube from "../../assets/image/dashborad/dashboard_cube.svg";
import dashboard_cube1 from "../../assets/image/dashborad/dashboard_cube1.svg";
import dashboard_cube2 from "../../assets/image/dashborad/dashboard_cube2.svg";
import dashboard_cube3 from "../../assets/image/dashborad/dashboard_cube3.svg";
import dashboard_cube4 from "../../assets/image/dashborad/dashboard_cube4.svg";
// import CardModal from "./CardModal";
import { useNavigate } from "react-router";
import moment from "moment";
import CardModal from "../ProcessownerDashboard/dashboard/CardModal";

const DashboardCards = ({
  card1,
  card2,
  card3,
  card4,
  card1key,
  card2key,
  card3key,
  card4key,
}) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [modalHeading, setModalHeading] = useState("");

  const handleCardClick = (cardTitle) => {
    if (cardTitle === "Elements Expiry") {
      navigate("/elements-expiry");
    } else if (cardTitle === "Unaccessed Elements") {
      navigate("/unaccessed-elements");
    } else if (cardTitle === "Rejected Element") {
      navigate("/rejected-elements");
    }
  };

  const calculateRemainingDays = () => {
    const validityDate = moment(card4key);
    const today = moment();
    const remainingDays = validityDate.diff(today, "days");
    return remainingDays > 0 ? remainingDays : 0;
  };

  const cards = [
    { title: card1, value: card1key, image: dashboard_cube },
    { title: card2, value: card2key, image: dashboard_cube },
    { title: card3, value: card3key, image: dashboard_cube },
    {
      title: card4,
      value: calculateRemainingDays(card4key),
      image: dashboard_cube,
    },
  ];

  return (
    <>
      <Grid
        container
        spacing={3} // Adjust spacing between cards
        // sx={{ padding: "1rem", marginLeft:'1px', width:'99.9%' }} // Added padding for overall layout
      >
        {cards.map((card, index) => (
          <Grid
            key={index}
            item
            xs={6} // 2 cards per row on small screens
            sm={6}
            md={3} // 4 cards per row on medium+ screens
          >
            <Box
              sx={{
                borderRadius: "8px", // Keep the original card corners rounded
                display: "flex",
                flexDirection: "row", // Align text and image horizontally
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem", // Padding inside each card
                height: "100%",
                cursor: index < 3 ? "pointer" : "default", // First 3 cards are clickable
              }}
              onClick={() => index < 3 && handleCardClick(card.title)}
              className={`dashborad_card${index + 1}`} // Maintain the original class for styling
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontSize:12,
                    color: "#FFFFFFE5", // Preserve the original color
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "white", // Preserve the original color
                  }}
                >
                  {card.value}
                </Typography>
              </Box>
              <img
                src={card.image}
                alt={card.title}
                style={{
                  width: "50px",
                  height: "50px",
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Modal */}
      <CardModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        heading={modalHeading}
      />
    </>
  );
};

export default DashboardCards;
