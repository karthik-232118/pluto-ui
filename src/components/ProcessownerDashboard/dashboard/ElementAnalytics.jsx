import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./DashBoard.css";
import AreaChart from "./AreaChart";
import Dashborad_sop from "../../../assets/image/dashborad/Dashborad_sop.svg";
import Dashborad_doc from "../../../assets/image/dashborad/Dashborad_doc.svg";
import Dashborad_tes from "../../../assets/image/dashborad/Dashborad_tes.svg";
import Dashborad_trs from "../../../assets/image/dashborad/Dashborad_trs.svg";
import Dashborad_mcq from "../../../assets/image/dashborad/Dashborad_mcq.svg";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ElementsSidebarApi } from "../../../services/elements/Elements";
import { useNavigate } from "react-router";
import { GetElementsCategory } from "../../../store/elements/action";
import { useDispatch } from "react-redux";

const ElementAnalytics = ({ dashboardData }) => {
  const dispatch = useDispatch();
  const [areaChartData, setAreaChartData] = useState([]);
  const [sidebarData, setSidebarData] = useState(null);
  const [activeButton, setActiveButton] = useState(
    localStorage.getItem("activeButton") || "SOP"
  );
  const { t } = useTranslation();
  console.log(dashboardData,"dashboardDatadashboardData")
  const navigate = useNavigate(); 
  const modulePaths = {
    SOP: "/sops",
    Document: "/documents",
    TestMCQ: "/test-mcqs",
    SkillAssessment: "/training-simulations",
    SkillBuilding: "/test-simulations",
  };

  useEffect(() => {
    const fetchSidebarData = async () => {
      const cachedData = localStorage.getItem("sidebarData");

      if (cachedData) {
        console.log("Using cached sidebar data");
        setSidebarData(JSON.parse(cachedData));
        return;
      }

      try {
        // Only make API call if no cached data exists
        console.log("Fetching sidebar data from API");
        // const response = await ElementsSidebarApi();
        // console.log("Sidebar API Response in Dashboard:", response?.data?.data);

        // Store the fresh data in both state and localStorage
        // localStorage.setItem("sidebarData", JSON.stringify(response?.data));
        // setSidebarData(response?.data);
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    };

    fetchSidebarData();
  }, []);
  const getElementsData = (type) => {
    setActiveButton(type);
    localStorage.setItem("activeButton", type); // Save to localStorage
    // Filter the dashboardData based on the type (ModuleName)
    const filteredData = dashboardData?.monthly?.find(
      (item) => item.ModuleName === type
    );
    if (filteredData) {
      setAreaChartData(filteredData?.dates);
    } else {
      setAreaChartData([]); // Handle case when no match is found
    }
  };

  useEffect(() => {
    // Automatically get the data based on the activeButton on component mount
    getElementsData(activeButton);
  }, [dashboardData]);

  const getModuleTypeID = (moduleName) => {
    const moduleData = sidebarData?.data?.find(
      (item) => item.ModuleName === moduleName
    );

    if (moduleData) {
      console.log(`${moduleName} ModuleTypeID:`, moduleData.ModuleTypeID);
      const path = modulePaths[moduleName]; // Get the path based on the moduleName
      if (path) {
        navigate(path); // Navigate to the corresponding path
      }

      // Dispatch GetElementsCategory action with ModuleTypeID and ParentContentID as null
      dispatch(
        GetElementsCategory({
          ModuleTypeID: moduleData.ModuleTypeID,
          ParentContentID: null, // Add ParentContentID with null value
        })
      );
    } else {
      console.log(`Module with name ${moduleName} not found.`);
    }
  };
  return (
    <Card sx={{ marginLeft: "15px" }}>
      <Grid container spacing={2}>
        <Grid container className="inside_bg">
          <Grid sx={{ width: "fit-content", mr: 2 }}>
            <Box
              sx={{
                padding: "1rem",
              }}
            >
              <Typography variant="h6" className="top_variant">
                {t("elementAnalytics")}
              </Typography>
              <Typography variant="body2" className="sub_variant">
                {t("overviewLatestMonth")}
              </Typography>
            </Box>
          </Grid>
          <Grid sx={{ width: "60%" }}>
            <Box
              sx={{
                mt: 2.5,
                display: { md: "flex", sx: "column" },
                justifyContent: "flex-start",
              }}
            >
              <Button
                className={`${
                  activeButton === "SOP"
                    ? "chart_buttons_active"
                    : "chart_buttons"
                }`}
                onClick={() => getElementsData("SOP")}
              >
                {t("SOP")}
              </Button>
              <Button
                className={`${
                  activeButton === "Document"
                    ? "chart_buttons_active"
                    : "chart_buttons"
                }`}
                onClick={() => getElementsData("Document")}
              >
                {t("Document")}
              </Button>
              <Button
                className={`${
                  activeButton === "TestMCQ"
                    ? "chart_buttons_active"
                    : "chart_buttons"
                }`}
                onClick={() => getElementsData("TestMCQ")}
              >
                {t("MCQ")}
              </Button>
              <Button
                className={`${
                  activeButton === "TestSimulation"
                    ? "chart_buttons_active"
                    : "chart_buttons"
                }`}
                onClick={() => getElementsData("SkillAssessment")}
              >
                {t("TestSimulation")} 
              
              </Button>
              <Button
                className={`${
                  activeButton === "TrainingSimulation"
                    ? "chart_buttons_active"
                    : "chart_buttons"
                }`}
                onClick={() => getElementsData("SkillBuilding")}
              >
                {t("TrainingSimulation")} 
              
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Divider width={"100%"} />

        <Grid container>
          <Grid sx={{ width: "100%" }}>
            <AreaChart dashboardData={areaChartData} />
          </Grid>
        </Grid>
        <Divider width={"100%"} />
        <Grid
          container
          spacing={0} // No spacing for better control of layout
          sx={{
            px: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {[
            {
              icon: Dashborad_sop,
              name: t("SOP"),
              count: dashboardData?.module?.[0]?.count,
            },
            {
              icon: Dashborad_doc,
              name: t("Document"),
              count: dashboardData?.module?.[1]?.count,
            },
            {
              icon: Dashborad_tes,
              name: t("TestSimulation") ,
              count: dashboardData?.module?.[3]?.count,
            },
            {
              icon: Dashborad_trs,
              name: t("TrainingSimulation"),
              count: dashboardData?.module?.[4]?.count,
            },
            {
              icon: Dashborad_mcq,
              name: t("MCQ"),
              count: dashboardData?.module?.[2]?.count,
            },
          ].map((module, index, array) => (
            <React.Fragment key={index}>
              <Grid
                item
                xs={12} 
                sm={6} 
                md 
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  textAlign: "left",
                  width: "20%", 
                }}
                className={`${index < array.length && "bottom_content"}`}
                onClick={() => getModuleTypeID(module.name)}
              >
                <img
                  className="icon-module"
                  src={module.icon}
                  alt={module.name} 
                  style={{ width: 50, height: 50 }} 
                />
                <div>
                  <Typography
                    variant="body2"
                    className="icon_varient"
                    sx={{
                      fontWeight: 450,
                      color: "#00000099",
                      fontSize: "10px",
                    }}
                  >
                    {module.name.toUpperCase()}
                  </Typography>
                  <Typography variant="body1" className="icon_numbers">
                    {module.count}
                  </Typography>
                </div>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Grid>
    </Card>
  );
};

export default ElementAnalytics;

ElementAnalytics.propTypes = {
  dashboardData: PropTypes.array.isRequired,
};
