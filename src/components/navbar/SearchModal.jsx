import { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchModal.css";
import arrowIcon from "../../assets/svg/navbar/arrow-up-right2.svg";
import tworing from "../../assets/svg/SearchResult/tworing.svg";
import icon1 from "../../assets/svg/navbar/OpenBook.svg";
import icon2 from "../../assets/svg/navbar/layer.svg";
import icon3 from "../../assets/svg/navbar/video.svg";
import icon4 from "../../assets/svg/navbar/window.svg";
import TestMcq from "../../assets/svg/navbar/edit.svg";
import { useDispatch } from "react-redux";
import { setModuleTypeID } from "../../store/moduleid/slice";
import { impactAnalysis } from "../../store/impactAnalysis/ImpactAnalysis";
import notify from "../../assets/svg/utils/toast/Toast";
import { Tooltip } from "@mui/material";
import { setSelectedId } from "../../store/SearchSelectID/setSelectedId";
import { GetElementsFolderDocument } from "../../store/elements/action";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const SearchModal = forwardRef(
  ({ onClose, moduleNames, combinedData, searchParam }, ref) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    console.log("Search moduleNames:", moduleNames);
    const [activeModules, setActiveModules] = useState([]);
    const handleButtonClick = (moduleName) => {
      setActiveModules((prevActiveModules) => {
        const newActiveModules = prevActiveModules.includes(moduleName)
          ? prevActiveModules.filter((name) => name !== moduleName)
          : [...prevActiveModules, moduleName];
        if (!prevActiveModules.includes(moduleName)) {
          const moduleObj = moduleNames.find(
            (item) => item.ModuleName === moduleName
          );
          if (moduleObj) {
            dispatch(setModuleTypeID(moduleObj.ModuleTypeID));
          }
          if (moduleName === "Documents") {
            navigate("/search-result");
            onClose();
          }
        }

        return newActiveModules;
      });
    };

    const handleItemClick = (itemText) => {
      const modulesToSearch =
        activeModules.length > 0 ? activeModules : Object.keys(combinedData); 
      for (const module of modulesToSearch) {
        // Grab all entries for the current module
        const entries = combinedData[module];
        if (!Array.isArray(entries)) continue;

        // Find the entry whose Name matches the clicked text
        const found = entries.find((entry) => {
          let name;
          switch (module) {
            case "SOP":
              name = entry.SOPName;
              break;
            case "TrainingSimulation":
              name = entry.TrainingSimulationName;
              break;
            case "TestSimulation":
              name = entry.TestSimulationName;
              break;
            case "TestMCQ":
              name = entry.TestMCQName;
              break;
            case "Document":
              name = entry.DocumentName;
              break;
            default:
              name = "";
              break;
          }
          return name === itemText;
        });

        if (found) {
          let IDToLog;
          switch (module) {
            case "SOP":
              IDToLog = found.SOPID;
              break;
            case "TrainingSimulation":
              IDToLog = found.TrainingSimulationID;
              break;
            case "TestSimulation":
              IDToLog = found.TestSimulationID;
              break;
            case "TestMCQ":
              IDToLog = found.TestMCQID;
              break;
            case "Document":
              IDToLog = found.DocumentID;
              break;
            default:
              IDToLog = "No ID found";
          }

          // Print the ID in the console
          // eslint-disable-next-line no-console
          console.log(
            "Clicked ID:",
            IDToLog,
            "Flag Name:",
            found.ModuleName // or found.ContentID or any other field you need
          );

          dispatch(setSelectedId(IDToLog));

          dispatch(
            GetElementsFolderDocument({
              DocumentID: IDToLog,
            })
          );
          // Then do your route navigation
          switch (module) {
            case "SOP":
              navigate(`/sops/view/${IDToLog}`);
              break;
            case "TrainingSimulation":
              navigate(`/training-simulations/view/${IDToLog}`);
              break;
            case "TestSimulation":
              navigate(`/test-simulations/view/${IDToLog}`);
              break;
            case "TestMCQ":
              navigate(`/test-mcqs/view/${IDToLog}`);
              break;
            case "Document":
              navigate(`/documents/view/${IDToLog}`);
              break;
            default:
              // eslint-disable-next-line no-console
              console.log("No matching route found");
          }

          break; // Stop once we have found and navigated
        }
      }
    };

    /**
     * Utility to create the payload for Impact Analysis
     */
    const getImpactAnalysisPayload = (itemText) => {
      for (const key in combinedData) {
        if (Object.prototype.hasOwnProperty.call(combinedData, key)) {
          if (Array.isArray(combinedData[key])) {
            // Check if any item in the array has a matching name
            for (const item of combinedData[key]) {
              const mapping = {
                ModuleID: item[`${item?.ModuleName}ID`],
                ImpactAnalysisTarget: item?.ModuleName,
                name: item[`${item?.ModuleName}Name`],
              };

              if (mapping?.name === itemText) {
                return mapping; // Return the matching object
              }
            }
          }
        }
      }
      return null; // Return null if no match is found
    };

    const generateSearchItems = () => {
      const items = [];

      const modulesToUse =
        activeModules.length > 0 ? activeModules : Object.keys(combinedData);

      for (const module of modulesToUse) {
        const entries = combinedData[module];
        if (!Array.isArray(entries)) continue;

        entries.forEach((entry) => {
          let name;
          let icon;
          switch (module) {
            case "SOP":
              name = entry.SOPName;
              icon = icon2;
              break;
            case "TrainingSimulation":
              name = entry.TrainingSimulationName;
              icon = icon3;
              break;
            case "TestSimulation":
              name = entry.TestSimulationName;
              icon = icon4;
              break;
            case "TestMCQ":
              name = entry.TestMCQName;
              icon = TestMcq;
              break;
            case "Document":
              name = entry.DocumentName;
              icon = icon1;
              break;
            default:
              return;
          }

          if (
            searchParam &&
            !name.toLowerCase().includes(searchParam.toLowerCase())
          ) {
            return; // skip
          }

          items.push({ text: name, icon });
        });
      }

      return items;
    };

    const searchItems = searchParam ? generateSearchItems() : [];

    /**
     * Trigger Impact Analysis and navigate
     */
    const handleImpactAnalysis = (text) => {
      const payload = getImpactAnalysisPayload(text);
      // eslint-disable-next-line no-console
      console.log(payload, "payload");
      if (!payload) {
        notify("error", "Payload not found");
      } else {
        dispatch(impactAnalysis(payload));
        navigate("/impact-analysis");
        onClose(); // Close modal after navigating
      }
    };

    return (
      <div
        className="search-modal"
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <p className="search-modal-heading">{t("search_modal_heading")}</p>
        <div className="quick-search">
          {moduleNames?.map((item) => (
            <button
              key={item.ModuleName}
              type="button"
              style={{
                fontFamily: "var(--fontfamilysans)",
                fontSize: "12px",
                fontWeight: 350,
                lineHeight: "var(--fontline-height4)",
                letterSpacing: "var(--fontletter-spacingnormal)",
                textAlign: "center",
                textUnderlinePosition: "from-font",
                textDecorationSkipInk: "none",
                backgroundColor: activeModules.includes(item.ModuleName)
                  ? "#3B82F6"
                  : "#2196F314",
                color: activeModules.includes(item.ModuleName)
                  ? "#FFFFFF"
                  : "#3B82F6",
                borderColor: activeModules.includes(item.ModuleName)
                  ? "#3B82F6"
                  : "#EFF6FF",
              }}
              onClick={() => handleButtonClick(item.ModuleName)}
            >
              {item.ModuleName}
            </button>
          ))}
        </div>
        <div className="search-results">
          {searchItems.length > 0 ? (
            searchItems.map((item) => (
              <div
                className="search-item"
                key={item.text}
                onClick={() => handleItemClick(item.text)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleItemClick(item.text);
                }}
              >
                <img
                  src={item.icon}
                  alt="module icon"
                  className="search-item-icon"
                />
                {item.text}
                <Tooltip title="Impact Analysis" placement="top">
                  <img
                    src={tworing}
                    alt="Impact Analysis"
                    style={{
                      marginLeft: "auto",
                      paddingRight: "2rem",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid also triggering handleItemClick
                      handleImpactAnalysis(item.text);
                    }}
                  />
                </Tooltip>
                <Tooltip title="Open file" placement="top">
                  <img src={arrowIcon} alt="Open file" className="arrow-icon" />
                </Tooltip>
              </div>
            ))
          ) : (
            <p>{t("no_matching_results")}</p>
          )}
        </div>
      </div>
    );
  }
);

SearchModal.displayName = "SearchModal";

SearchModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  moduleNames: PropTypes.arrayOf(
    PropTypes.shape({
      ModuleName: PropTypes.string.isRequired,
      ModuleTypeID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  combinedData: PropTypes.object.isRequired,
  searchParam: PropTypes.string,
};

SearchModal.defaultProps = {
  searchParam: "",
};

export default SearchModal;
