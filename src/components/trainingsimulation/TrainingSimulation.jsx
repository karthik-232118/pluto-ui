import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Backdrop,
  Button,
  Tooltip,
  keyframes,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GetElementsFolderDocument } from "../../store/elements/action";
import layer1 from "../../assets/svg/TrainingSimulation/2-layers-1st.svg";
import layer2 from "../../assets/svg/TrainingSimulation/2-layers-2nd.svg";
import RightSection from "../allpages/accountopening/RightSection";
import calendar from "../../assets/svg/VideoSimulation/calendar.svg";
import avatar from "../../assets/svg/TestSimulation/Avatar.svg";
import clock from "../../assets/svg/VideoSimulation/clock.svg";
import loader from "../../assets/svg/VideoSimulation/loader.svg";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import arrow1 from "../../assets/svg/TrainingSimulation/arrow1.svg";
import arrow2 from "../../assets/svg/TrainingSimulation/arrow2.svg";
import CommonContainer from "../allpages/commoncontainer/CommonContainer";
import bookMark from "../../assets/svg/accountOpening-Svg/BookMark-blue.svg";
import { useDispatch, useSelector } from "react-redux";
import { GetAttempts } from "../../store/attempts/action";
import { GetAddFavourites } from "../../store/favourites/action";
import { BASE_URL } from "../../config/urlConfig";
import { impactAnalysis } from "../../store/impactAnalysis/ImpactAnalysis";
import { setDetailsData } from "../../store/details/slice";
import { toast } from "react-toastify";
import { dateformatter } from "../../utils";
import impactanalysisIcon from "../../assets/svg/impactanalysis/impactanalysisIcon.svg";
import NoFav from "../../assets/svg/navbar/favone.svg";
import BackgroundMeshBox from "../../common/meshbackground/BackgroundMeshBox";
import Pageloader from "../../assets/image/cubeloader.gif";
import { useTranslation } from "react-i18next";
import { useHeadingBgColor } from "../useHeadingBgColor";

const colors = ["#FEF3C7", "#DBEAFE", "#DCFCE7", "#FFE4E6"];

const translateText = async (text, targetLang = "hi") => {
  const apiKey = "AIzaSyCFaF851Ld9FsxQojE2jm3aOVPAr3PFFJQ";
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, target: targetLang }),
    });

    const data = await response.json();

    return data?.data?.translations[0]?.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const TrainingSimulation = () => {
  const { t, i18n } = useTranslation();
  const [deviceType, setDeviceType] = useState("Laptop");
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [translatedName, setTranslatedName] = useState("");
  const [translatedDescription, setTranslatedDescription] = useState("");
  const bgColor = useHeadingBgColor();

  const { elementsDocumentFiles, loading } = useSelector(
    (state) => state.elements
  );
  const { trainingSimulationIDs } = useSelector((state) => state.ids);
  console.log(trainingSimulationIDs, "trainingSimulationIDs");
  const { attempts } = useSelector((state) => state.attempts);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const searchSelectedId = useSelector((state) => state.selectedId.value);
  const elementID = useSelector((state) => state.elementid.elementID);
  const { linkedID } = useSelector((state) => state.linkedData);
  const getDeviceType = (width) => {
    if (width < 768) {
      return "Phone";
    } else if (width >= 768 && width < 1024) {
      return "Tablet";
    } else {
      return "Laptop";
    }
  };

  const breadcrumbsData = elementsDocumentFiles?.bredcrumbs;
  const documentData = elementsDocumentFiles?.data;
  dispatch(setDetailsData(elementsDocumentFiles?.details));

  useEffect(() => {
    const lang = i18n.language || "en";
    if (documentData?.TrainingSimulationName) {
      translateText(documentData.TrainingSimulationName, lang).then(
        (translated) => setTranslatedName(translated.replace(/d&#39;/g, "'"))
      );
    }
    if (documentData?.TrainingSimulationDescription) {
      translateText(documentData.TrainingSimulationDescription, lang).then(
        (translated) =>
          setTranslatedDescription(translated.replace(/d&#39;/g, "'"))
      );
    }
  }, [
    documentData?.TrainingSimulationName,
    documentData?.TrainingSimulationDescription,
    i18n.language,
  ]);

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      const type = getDeviceType(width);
      console.log(`Device Type SOP: ${type}`);
      setDeviceType(type);
    };

    updateDeviceType();

    window.addEventListener("resize", updateDeviceType);

    return () => {
      window.removeEventListener("resize", updateDeviceType);
    };
  }, []);

  useEffect(() => {
    if (elementID) {
      console.log(elementID, "elementID");
    }
  }, [elementID]);
  const my_task = localStorage.getItem("my_task");
  const storedTrainingSimulationID = presistStore?.TrainingSimulationID;
  const fromActionables = location.state?.fromActionables || false;
  const queryParams = new URLSearchParams(location.search);
  const isSOPTrue = queryParams.get("SOP") === "true";
  const isSOPFalse = queryParams.get("SOP") === "false";

  useEffect(() => {
    const TrainingSimulationID = fromActionables
      ? elementID
      : id ||
      searchSelectedId ||
      linkedID ||
      storedTrainingSimulationID ||
      trainingSimulationIDs[0];
    if (TrainingSimulationID) {
      const isActionable = isSOPTrue
        ? true
        : isSOPFalse
          ? false
          : fromActionables;
      const payload = {
        TrainingSimulationID: TrainingSimulationID,
        IsActionable: isActionable,
        IsEnableMyTask: my_task ? true : false,
      };
      dispatch(GetElementsFolderDocument(payload));
    }
  }, [
    dispatch,
    id,
    storedTrainingSimulationID,
    trainingSimulationIDs,
    fromActionables,
    elementID,
    isSOPTrue,
    isSOPFalse,
  ]);

  useEffect(() => {
    if (attempts.length > 0) {
      // console.log("Attempts from Redux:", attempts);
    }
  }, [attempts]);

  const isVideoAvailable = documentData?.IsTrainingLinkIsVideo;
  const TrainingSimulationTrainingPath =
    elementsDocumentFiles?.data?.TrainingSimulationPath;
  console.log("TrainingSimulationTrainingPath", TrainingSimulationTrainingPath);

  const HandleGuidedModeClick = () => {
    const userType = localStorage.getItem("user_type");
    const myTask = localStorage.getItem("my_task");
    if (TrainingSimulationTrainingPath) {
      const fullPath = `${BASE_URL}${TrainingSimulationTrainingPath}/demo.html`;
      console.log("Full Path:", fullPath);
      const newTab = window.open(fullPath, "_blank");

      if (newTab) {
        const requestBody = {
          ModuleID: elementsDocumentFiles?.data?.TrainingSimulationID,
        };
        if (userType === "EndUser" || myTask) {
          dispatch(GetAttempts(requestBody))
            .then((response) => {
              console.log("GetAttempts Response:", response.payload);
            })
            .catch((error) => {
              console.error("Error in GetAttempts:", error);
            });
        }
      } else {
        console.warn("Failed to open the new tab");
      }
    } else {
      console.warn("Training mode path is not available");
    }
  };

  const HandleTrainingModeClick = () => {
    const userType = localStorage.getItem("user_type");
    const myTask = localStorage.getItem("my_task");
    if (TrainingSimulationTrainingPath) {
      const fullPath = `${BASE_URL}${TrainingSimulationTrainingPath}/tutorial.html`;
      const newTab = window.open(fullPath, "_blank");
      if (newTab) {
        const requestBody = {
          ModuleID: elementsDocumentFiles?.data?.TrainingSimulationID,
        };
        if (userType === "EndUser" || myTask) {
          dispatch(GetAttempts(requestBody))
            .then((response) => {
              console.log("GetAttempts Response:", response.payload);
            })
            .catch((error) => {
              console.error("Error in GetAttempts:", error);
            });
        }
      } else {
        console.warn("Failed to open the new tab");
      }
    } else {
      console.warn("Training mode path is not available");
    }
  };
  const formattedDueDate =
    elementsDocumentFiles?.data?.DueDate ||
    elementsDocumentFiles?.data?.CreatedDate;
  const dueDate = formattedDueDate ? dateformatter(formattedDueDate) : "N/A";
  const assignedBy =
    elementsDocumentFiles?.data?.AssignByUser ||
    elementsDocumentFiles?.details?.History?.[0]?.CreatedBy;
  const AverageDuration = elementsDocumentFiles?.data?.AverageDuration;
  const logsLength = elementsDocumentFiles?.data?.Logs?.length || 0;
  const UserFavorite = elementsDocumentFiles?.data?.UserFavorite || false;
  const attemptCounter = `${logsLength}/∞`;
  const handleBookmarkClick = async () => {
    const payload = {
      ModuleTypeID: presistStore.ModuleTypeID,
      ModuleID: presistStore.TrainingSimulationID,
    };

    try {
      const result = await dispatch(GetAddFavourites(payload)).unwrap();

      toast.success(t("Added to Favorites Successfully") || result.message);
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Failed to add to favourites");
    }
  };

  const handleImpactAnalysis = () => {
    const payload = {
      ModuleID: presistStore.TrainingSimulationID,
      ImpactAnalysisTarget: "TrainingSimulation",
      name: documentData?.TrainingSimulationName,
    };
    localStorage.setItem("impactAnalysisPayload", JSON.stringify(payload));
    dispatch(impactAnalysis(payload));

    navigate("/impact-analysis");
  };

  const handleStartVideo = () => {
    navigate("/training-sim-video");
    console.log("Start Video");
  };

  return (
    <BackgroundMeshBox sx={{ height: "100%" }}>
      {deviceType === "Phone" ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            backgroundColor: "#f0f0f0",
            animation: `${fadeIn} 1s ease-in-out`,
          }}
        >
          <Typography
            variant="b"
            sx={{
              color: "#ff0000",
              animation: `${fadeIn} 1.5s ease-in-out`,
              padding: "10px",
            }}
          >
            This screen is not for Phone view. Please switch to Tablet or Laptop
          </Typography>
        </Box>
      ) : (
        <CommonContainer
          rightSection={<RightSection documentData={documentData} />}
        >
          {/* {!fromActionables && breadcrumbsData && ( */}
          <Box sx={{ marginRight: "-10px" }}>
            <Breadcrumbs
              bredcrumbs={breadcrumbsData}
              type={presistStore}
              isBack={true}
            />
          </Box>
          {/* )} */}
          <Divider style={{ marginTop: "0rem", marginBottom: "-16px" }} />

          <Box className="header">
            <Box className="header-text">
              <Typography variant="p" color={"primary.main"}>
                {documentData?.TrainingSimulationName}
              </Typography>
              <Typography sx={{ color: "#64748B" }}>
                {t("Version")}{" "}
                {documentData?.TrainingSimulationStatus === "InProgress"
                  ? documentData?.DraftVersion
                  : documentData?.MasterVersion || "N/A"}
                {`${" "}\u00A0(${documentData?.SequenceNumber})`}
              </Typography>
            </Box>
            <div style={{ display: "flex", marginRight: "10px" }}>
              <div>
                <Tooltip title={t("ImpactAnalysis")} placement="top">
                  <Box
                    className="impact_analysis"
                    sx={{
                      height: "40px",
                      width: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: bgColor,
                      borderRadius: "20%",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImpactAnalysis();
                    }}
                  >
                    {" "}
                    <img src={impactanalysisIcon} alt="Impact Analysis Icon" />
                  </Box>
                </Tooltip>
              </div>
              <Box
                onClick={!UserFavorite ? handleBookmarkClick : undefined}
                sx={{
                  height: "40px",
                  width: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: bgColor,
                  borderRadius: "20%",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
              >
                <Tooltip
                  title={UserFavorite ? t("AlreadyAdded") : t("AddToFavorites")}
                  placement="top"
                >
                  <img
                    src={UserFavorite ? bookMark : NoFav}
                    alt={
                      UserFavorite
                        ? "Already Added to Favorites"
                        : "Add to Favorites"
                    }
                  />
                </Tooltip>
              </Box>
            </div>
          </Box>

          <Box
            sx={{
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: 2,
              backgroundColor: (theme) => {
                theme.palette.background.default;
              },
            }}
            style={{ margin: "24px 15px 24px 20px", padding: "24px" }}
          >
            <Typography variant="p" sx={{ fontSize: "15px" }}>
              {/* {translatedDescription ||
                documentData?.TrainingSimulationDescription} */}

              {documentData?.TrainingSimulationDescription}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginBottom: "0.5rem",
                }}
              >
                {t("Details")}
              </Typography>
              <Box className="details-container">
                {[
                  { label: t("Due Date"), value: dueDate, icon: calendar },
                  { label: t("Assigned By"), value: assignedBy, icon: avatar },

                  {
                    label: t("Attempt Counter"),
                    value: attemptCounter,
                    icon: loader,
                  },
                ].map((item, index) => (
                  <Box key={index} className="detail-item">
                    <Typography
                      className="details-headings"
                      sx={{
                        fontWeight: "400",
                        fontSize: "13.5px",
                        marginBottom: "-0.3rem",
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Box
                      className="detail-value"
                      sx={{
                        backgroundColor: colors[index % colors.length],
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="detail-icon"
                      />
                      {item.value}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <Divider sx={{ marginY: 2 }} />
            {isVideoAvailable ? (
              <Box>
                <Button
                  variant="contained"
                  style={{
                    textTransform: "none",
                    padding: "6px 26px",
                    borderRadius: "10px)",
                  }}
                  onClick={() => handleStartVideo()}
                >
                  {t("Start Video")}
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                <Grid
                  item
                  xs={12}
                  lg={6}
                  onClick={isDisabled ? undefined : HandleGuidedModeClick}
                  sx={{
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.6 : 1,
                    pointerEvents: isDisabled ? "none" : "auto",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "10px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#ede1cc",
                      position: "relative",
                    }}
                  >
                    {isDisabled && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "rgba(0,0,0,0.4)",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          zIndex: 2,
                        }}
                      >
                        {t("testInProgress")}
                      </Box>
                    )}
                    <img
                      src={layer1}
                      alt="Layer 1"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <Typography
                      variant="h6"
                      style={{
                        color: "#B45309",
                        fontWeight: "600",
                        marginBottom: "0.2rem",
                        fontSize: "16px",
                      }}
                    >
                      {t("Start Guided Mode")}
                    </Typography>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography style={{ width: "80%", fontWeight: "450" }}>
                        {t("Explain Guided Mode")}
                      </Typography>
                      <img
                        src={arrow1}
                        alt="Arrow 1"
                        style={{ height: "12px", width: "8px" }}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  lg={6}
                  onClick={isDisabled ? undefined : HandleTrainingModeClick}
                  sx={{
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.6 : 1,
                    pointerEvents: isDisabled ? "none" : "auto",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "10px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#e9cced",
                      position: "relative",
                    }}
                  >
                    {isDisabled && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "rgba(0,0,0,0.4)",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          zIndex: 2,
                        }}
                      >
                        {t("testInProgress")}
                      </Box>
                    )}
                    <img
                      src={layer2}
                      alt="Layer 2"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <Typography
                      variant="h6"
                      style={{
                        color: "#6D28D9",
                        fontWeight: "600",
                        marginBottom: "0.2rem",
                        fontSize: "16px",
                      }}
                    >
                      {t("Start Training Mode")}
                    </Typography>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography style={{ width: "80%", fontWeight: "450" }}>
                        {t("Explain Training Mode")}
                      </Typography>
                      <img
                        src={arrow2}
                        alt="Arrow 2"
                        style={{ height: "12px", width: "8px" }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
          <Backdrop
            sx={(theme) => ({
              color: "#fff",
              zIndex: theme.zIndex.drawer + 1,
            })}
            open={loading}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={Pageloader}
                alt="loader"
                style={{ height: "25%", width: "25%" }}
              />
            </div>
          </Backdrop>
        </CommonContainer>
      )}
    </BackgroundMeshBox>
  );
};

export default TrainingSimulation;
