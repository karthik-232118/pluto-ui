import { useEffect, useState } from "react";
import "./SaveList.css";

import documentsIcon from "../../../assets/svg/SavedList/DocumentsIcon.svg";

import openBook from "../../../assets/svg/SavedList/OpenBook.svg";
import bookMark from "../../../assets/svg/SavedList/BookMark.svg";
import SOPsIcon from "../../../assets/svg/SavedList/SOPsHeading.svg";
import TrainingIcon from "../../../assets/svg/SavedList/TrainingHeading.svg";
import TestIcon from "../../../assets/svg/SavedList/TestHeading.svg";
import fileicon from "../../../assets/svg/SavedList/fileicon.svg";
import BackButton from "../../../assets/svg/SavedList/BackButton.svg";
import { useDispatch, useSelector } from "react-redux";
import { GetFavourites } from "../../../store/favourites/action";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { setIDs } from "../../../store/favIds/slice";
import BackgroundMeshBox from "../../../common/meshbackground/BackgroundMeshBox";
import { useTranslation } from "react-i18next";
import Pageloader from "../../../assets/image/cubeloader1.gif";

const SaveList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate for routing
  const { favourites, loading } = useSelector((state) => state.favourites);
  const [showAllModules, setShowAllModules] = useState({});

  useEffect(() => {
    dispatch(GetFavourites({ ModuleTypeID: null }));
  }, [dispatch]);
  useEffect(() => {
    if (favourites) {
      console.log("Favourites Data:", favourites); // Log the favourites data
    }
  }, [favourites]);
  useEffect(() => {
    if (favourites && favourites.data) {
      const documentIDs =
        favourites.data.Document?.rows?.map((row) => row.DocumentID) || [];
      const sopIDs = favourites.data.SOP?.rows?.map((row) => row.SOPID) || [];
      const testSimulationIDs =
        favourites.data.TestSimulation?.rows?.map(
          (row) => row.TestSimulationID
        ) || [];
      const testMCQIDs =
        favourites.data.TestMCQ?.rows?.map((row) => row.TestMCQID) || []; // Corrected extraction
      const trainingSimulationIDs =
        favourites.data.TrainingSimulation?.rows?.map(
          (row) => row.TrainingSimulationID
        ) || []; // Corrected
      const skillBuildingIDs =
        favourites.data.SkillBuilding?.rows?.map(
          (row) => row.TrainingSimulationID
        ) || [];
      const skillAssessmentIDs =
        favourites.data.SkillAssessment?.rows?.map(
          (row) => row.TestSimulationID
        ) || [];

      // Dispatch the IDs to the Redux store
      dispatch(
        setIDs({
          documentIDs,
          sopIDs,
          testSimulationIDs,
          testMCQIDs, // Corrected
          trainingSimulationIDs, // Corrected
        })
      );
    }
  }, [favourites, dispatch]);

  const toggleShowAll = (moduleName) => {
    setShowAllModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  // Function to get the correct name based on module type
  const getModuleName = (moduleKey, row) => {
    switch (moduleKey) {
      case "SOP":
        return row.SOPName;
      case "TrainingSimulation":
        return row.TrainingSimulationName;
      case "TestSimulation":
        return row.TestSimulationName;
      case "TestMCQ":
        return row.TestMCQName;
      case "Document":
        return row.DocumentName;
      case "SkillBuilding":
        return row.TrainingSimulationName;
      case "SkillAssessment":
        return row.TestSimulationName;
      default:
        return "No Name";
    }
  };

  // Function to handle navigation based on module type
  const handleItemClick = (moduleKey) => {
    const routeMap = {
      Document: "/documents/view",
      TrainingSimulation: "/training-simulations/view",
      SOP: "/sops/view",
      TestSimulation: "/test-simulations/view",
      TestMCQ: "/test-mcqs/view",
      SkillBuilding: "/training-simulations/view",
      SkillAssessment: "/test-simulations/view",
    };
    const route = routeMap[moduleKey];
    if (route) {
      navigate(route); // Navigate to the appropriate route
    }
  };

  return (
    <BackgroundMeshBox sx={{ height: "100%" }}>
      <div>
        {/* <div className="cards"> */}
        <div className="card-header" style={{ backgroundColor: "#fff" }}>
          <img
            src={bookMark}
            alt="BookMark Icon"
            className="icons"
            style={{ width: "50px" }}
          />
          <h3>{t("favourites_heading")}</h3>
        </div>
        {/* </div> */}

        {loading ? (
          <Box
            style={{ marginTop: "10px" }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <img
              src={Pageloader}
              alt="Loading..."
              style={{ width: "80px", height: "80px" }}
            />
          </Box>
        ) : favourites &&
          favourites.data &&
          Object.keys(favourites.data).length > 0 ? (
          Object.keys(favourites.data).map((moduleKey) => {
            const module = favourites.data[moduleKey];
            const rows = module.rows;
            const displayedItems = showAllModules[moduleKey]
              ? rows
              : rows.slice(0, 12);

            const iconMap = {
              SOP: SOPsIcon,
              TrainingSimulation: TrainingIcon,
              TestSimulation: TestIcon,
              TestMCQ: TrainingIcon,
              Document: openBook,
              SkillBuilding: TrainingIcon,
              SkillAssessment: TestIcon,
            };

            return (
              <div
                key={moduleKey}
                className="card"
                style={{ margin: "20px", width: "97%" }}
              >
                <div className="card-header">
                  {showAllModules[moduleKey] && (
                    <img
                      src={BackButton}
                      alt="Back Button"
                      className="icons back-button"
                      onClick={() => toggleShowAll(moduleKey)}
                    />
                  )}
                  <img
                    src={iconMap[moduleKey] || documentsIcon}
                    alt={`${moduleKey} Icon`}
                    className="icons"
                  />
                  <p
                    className="fav-sub-heading"
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {moduleKey} <span className="count">({rows.length})</span>
                  </p>
                  {!showAllModules[moduleKey] && rows.length > 12 && (
                    <span
                      className="view-all"
                      onClick={() => toggleShowAll(moduleKey)}
                    >
                      {t("view_all")} {">"}
                    </span>
                  )}
                </div>
                <div className="divider"></div>
                <div className="card-content">
                  {displayedItems.length > 0 ? (
                    displayedItems.map((row, index) => (
                      <div
                        key={index}
                        className="document-card"
                        onClick={() => handleItemClick(moduleKey, row)} // Navigate on click
                      >
                        <img
                          src={fileicon}
                          alt={`${moduleKey} Icon`}
                          style={{ marginRight: "10px", marginTop: "-2px" }}
                        />
                        <p style={{ fontWeight: "500", fontSize: "14px" }}>
                          {getModuleName(moduleKey, row)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>{t("no_items_available")}</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "start",
              height: "100vh",
              marginTop: "20vh",
            }}
          >
            <Typography variant="h6" color="textSecondary">
              {t("no_data_available")}
            </Typography>
          </Box>
        )}
      </div>
    </BackgroundMeshBox>
  );
};

export default SaveList;
