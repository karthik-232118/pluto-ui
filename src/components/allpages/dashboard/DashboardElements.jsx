import { Box, Button, Card, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import "./DashBoard.css";
import AreaChart from "./AreaChart";
import PropTypes from "prop-types";
import Dashborad_sop from "../../../assets/image/dashborad/Dashborad_sop.svg";
import Dashborad_doc from "../../../assets/image/dashborad/Dashborad_doc.svg";
import Dashborad_tes from "../../../assets/image/dashborad/Dashborad_tes.svg";
import Dashborad_trs from "../../../assets/image/dashborad/Dashborad_trs.svg";
import Dashborad_mcq from "../../../assets/image/dashborad/Dashborad_mcq.svg";
import { Lock } from "@mui/icons-material";

const ElementAnalytics = ({ dashboardData }) => {
  const buttons = [
    "SOP",
    "Document",
    "TestMCQ",
    "TestSimulation",
    "TrainingSimulation",
  ];

  const [areaChartData, setAreaChartData] = useState([]);
  const [activeButton, setActiveButton] = useState("SOP");

  const moduleIcons = {
    sop: Dashborad_sop,
    doc: Dashborad_doc,
    mcq: Dashborad_mcq,
    tes: Dashborad_tes,
    trs: Dashborad_trs,
  };

  const getElementsData = (type) => {
    setActiveButton(type);
    const filteredData = dashboardData?.monthly?.find(
      (item) => item.ModuleName === type
    );

    if (filteredData) {
      setAreaChartData(filteredData?.dates);
    } else {
      setAreaChartData([]);
    }
  };

  useEffect(() => {
    getElementsData("SOP");
  }, [dashboardData]);

  return (
    <Card
      sx={{
        backgroundColor: "#ffffff75",
      }}
    >
      <Box sx={{ padding: "1rem" }}>
        <Typography variant="h6" className="top_variant">
          Element Analytics
        </Typography>
        <Typography variant="body2" className="sub_variant">
          Overview of latest month
        </Typography>
      </Box>
      <Box
        sx={{
          m: 2,
          display: "flex",
          justifyContent: "space-between", // Ensures buttons are evenly distributed
          // backgroundColor: "#F5F5F5", // Background for button container
          borderRadius: "8px", // Adds rounded corners for the entire button group
          overflow: "hidden", // Ensures rounded corners are respected
          // boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          width: "90%",
        }}
      >
        {buttons.map((label, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => getElementsData(label)}
            endIcon={<Lock />}
            sx={{
              flex: 1, // Ensures all buttons are of equal width
              height: "42px", // Fixed height for buttons
              padding: "9px 0px", // Padding inside button
              textTransform: "none", // Prevent uppercase text
              fontSize: "14px", // Font size for readability
              borderColor: "rgba(0, 0, 0, 0.12)", // Set border color to gray
              // color: "#00000099",
              borderRadius: 0, // No individual button border radius
              color: activeButton === label ? "primary" : "#000", // Highlight active button
              "&:first-of-type": {
                borderRadius: "8px 0 0 8px", // Left rounded corners for first button
              },
              "&:last-of-type": {
                borderRadius: "0 8px 8px 0", // Right rounded corners for last button
              },
              "&:not(:first-of-type)": {
                borderLeft: "none", // Remove duplicate borders between buttons
              },
              "&:hover": {
                borderColor: "rgba(0, 0, 0, 0.12)", // Darker gray on hover
              },
            }}
          >
            {label}
          </Button>
        ))}
      </Box>
      <Divider width={"100%"} />
      <Box
        sx={{
          border: "1px solid #E0E0E0",
          padding: "10px",
          opacity: "75%",
        }}
      >
        <AreaChart dashboardData={areaChartData} />
      </Box>
      <Divider width={"100%"} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          background: " #FFFFFF73",
        }}
      >
        {dashboardData?.module?.map((module, index) => (
          <Box
            key={index}
            sx={{
              width: "20%",
              textAlign: "center",
              alignItems: "center",
              borderLeft: "1px solid #E0E0E0",
              borderRight: "1px solid #E0E0E0",
              padding: "10px",
              borderRadius:
                index === 0
                  ? "8px 0 0 8px"
                  : index === dashboardData?.module?.length - 1
                  ? "0 8px 8px 0"
                  : 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <img
                src={moduleIcons[module.name]}
                alt={module.name}
                style={{ width: "50px", height: "50px" }}
              />
              <Box>
                <Typography variant="body2">
                  {module?.name?.toUpperCase()}
                </Typography>
                <Typography variant="h6">{module?.count}</Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default ElementAnalytics;

ElementAnalytics.propTypes = {
  dashboardData: PropTypes.shape({
    monthly: PropTypes.arrayOf(
      PropTypes.shape({
        ModuleName: PropTypes.string.isRequired,
        dates: PropTypes.array.isRequired,
      })
    ),
    module: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
