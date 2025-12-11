import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  CardContent,
  Backdrop,
  Tooltip,
  keyframes,
} from "@mui/material";
import VideoStartModal from "./VideoStartModal";
import avatar from "../../assets/svg/TestSimulation/Avatar.svg";
import calendar from "../../assets/svg/VideoSimulation/calendar.svg";
import clock from "../../assets/svg/VideoSimulation/clock.svg";
import loader from "../../assets/svg/VideoSimulation/loader.svg";
import arrow from "../../assets/svg/TestSimulation/arrow-right-circle.svg";
import badge1 from "../../assets/svg/TestSimulation/badge1.svg";
import badge2 from "../../assets/svg/TestSimulation/badge2.svg";
import badge3 from "../../assets/svg/TestSimulation/badge3.svg";
import badge4 from "../../assets/svg/TestSimulation/badge4.svg";
import "../testsimuation/TestSimuation.css";
import RightSection from "../allpages/accountopening/RightSection";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import CommonContainer from "../allpages/commoncontainer/CommonContainer";
import bookMark from "../../assets/svg/accountOpening-Svg/BookMark-blue.svg";
import "../../css/Common.css";
import { useDispatch, useSelector } from "react-redux";
import { GetElementsFolderDocument } from "../../store/elements/action";
import { GetAddFavourites } from "../../store/favourites/action";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router";
// import moment from "moment";
import { impactAnalysis } from "../../store/impactAnalysis/ImpactAnalysis";
import { setDetailsData } from "../../store/details/slice";
import CompletedAttemptsModal from "../modals/CompletedAttemptsModal";
import impactanalysisIcon from "../../assets/svg/impactanalysis/impactanalysisIcon.svg";
import { dateformatter } from "../../utils";
import NoFav from "../../assets/svg/navbar/favone.svg";
import BackgroundMeshBox from "../../common/meshbackground/BackgroundMeshBox";
import Pageloader from "../../assets/image/cubeloader.gif";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";
import { useHeadingBgColor } from "../useHeadingBgColor";

const colors = ["#FEF3C7", "#DBEAFE", "#DCFCE7", "#FFE4E6"];

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

const VideoSimulation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deviceType, setDeviceType] = useState("Laptop");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const BgColor = useHeadingBgColor();

  const { id } = useParams();
  const { elementsDocumentFiles, loading } = useSelector(
    (state) => state.elements
  );
  const { testSimulationIDs } = useSelector((state) => state.ids);
  console.log(testSimulationIDs, "testSimulationIDs");

  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );

  const elementID = useSelector((state) => state.elementid.elementID);
  const { linkedType, linkedID } = useSelector((state) => state.linkedData);
  const theme = useTheme();
  // Function to determine the device type based on screen width
  const getDeviceType = (width) => {
    if (width < 768) {
      return "Phone";
    } else if (width >= 768 && width < 1024) {
      return "Tablet";
    } else {
      return "Laptop";
    }
  };

  useEffect(() => {
    // Function to update the device type
    const updateDeviceType = () => {
      const width = window.innerWidth;
      const type = getDeviceType(width);
      console.log(`Device Type SOP: ${type}`); // Log the device type to the console
      setDeviceType(type);
    };

    // Initial call to set the device type
    updateDeviceType();

    // Add event listener for window resize
    window.addEventListener("resize", updateDeviceType);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateDeviceType);
    };
  }, []);

  useEffect(() => {
    console.log("linkedTypedoc:", linkedType);
    console.log("linkedIDdoc:", linkedID);
  }, [linkedType, linkedID]);

  useEffect(() => {
    if (elementID) {
      console.log(elementID, "elementID");
    }
  }, [elementID]);
  const my_task = localStorage.getItem("my_task");
  const storedTestSimulationID = presistStore.TestSimulationID;
  const fromActionables = location.state?.fromActionables || false;
  const queryParams = new URLSearchParams(location.search);
  const isSOPTrue = queryParams.get("SOP") === "true";
  const isSOPFalse = queryParams.get("SOP") === "false";

  useEffect(() => {
    const TestSimulationID = fromActionables
      ? elementID
      : id || linkedID || storedTestSimulationID || testSimulationIDs[0];

    if (TestSimulationID) {
      const isActionable = isSOPTrue
        ? true
        : isSOPFalse
          ? false
          : fromActionables;

      const payload = {
        TestSimulationID: TestSimulationID,
        IsActionable: isActionable,
        IsEnableMyTask: my_task ? true : false,
      };
      dispatch(GetElementsFolderDocument(payload));
    }
  }, [
    dispatch,
    id,
    storedTestSimulationID,
    testSimulationIDs,
    fromActionables,
    elementID,
    isSOPTrue,
    isSOPFalse,
  ]);

  const HandleStartTestClick = () => {
    if (logsLength === totalAttempt) {
      setIsCompletedModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const HandleCloseCompletedModal = () => {
    setIsCompletedModalOpen(false);
  };

  const HandleCloseModal = () => {
    setIsModalOpen(false);
  };

  const HandleConfirmStartTest = () => {
    setIsModalOpen(false);
  };

  const ModuleID = elementsDocumentFiles?.data?.TestSimulationID;
  const formattedDueDate =
    elementsDocumentFiles?.data?.DueDate ||
    elementsDocumentFiles?.data?.CreatedDate;
  // const fromActionables = location.state?.fromActionables || false;
  const breadcrumbsData = elementsDocumentFiles?.bredcrumbs;

  dispatch(setDetailsData(elementsDocumentFiles?.details));
  const documentData = elementsDocumentFiles?.data;

  // const dueDate = formatDate(formattedDueDate);  
  const dueDate = dateformatter(formattedDueDate);

  const assignedBy =
    elementsDocumentFiles?.data?.AssignByUser ||
    elementsDocumentFiles?.details?.History?.[0]?.CreatedBy;
  const avgTimeRequired = elementsDocumentFiles?.data?.AverageDuration;
  const TestSimulationDescription =
    elementsDocumentFiles?.data?.TestSimulationDescription;
  const TestSimulationName = elementsDocumentFiles?.data?.TestSimulationName;
  const totalAttempt = elementsDocumentFiles?.data?.TotalAttempts;

  const logsLength = elementsDocumentFiles?.data?.PreviousAttempts?.length ?? 0;
  const attemptCounter = `${logsLength}/${totalAttempt}`;
  const previousAttempts = elementsDocumentFiles?.data?.PreviousAttempts || [];
  const TestSimulationPath = elementsDocumentFiles?.data?.TestSimulationPath;
  const UserFavorite = elementsDocumentFiles?.data?.UserFavorite || false;

  const scores = previousAttempts
    .filter((attempt) => attempt.Score !== null)
    .map((attempt) => attempt.Score);

  const getBadgeByScore = (score) => {
    if (score >= 0 && score < 45) {
      return badge1;
    } else if (score >= 45 && score < 70) {
      return badge2;
    } else if (score >= 70 && score < 85) {
      return badge3;
    } else if (score >= 85 && score <= 100) {
      return badge4;
    }
    return null;
  };

  const handleBookmarkClick = async () => {
    const payload = {
      ModuleTypeID: presistStore.ModuleTypeID,
      ModuleID: presistStore.TestSimulationID,
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
      ModuleID: presistStore.TestSimulationID,
      ImpactAnalysisTarget: "TestSimulation",
      name: documentData?.TestSimulationName,
    };
    localStorage.setItem("impactAnalysisPayload", JSON.stringify(payload));
    dispatch(impactAnalysis(payload));

    navigate("/impact-analysis");
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
          {!fromActionables && breadcrumbsData && (
            <Breadcrumbs
              bredcrumbs={breadcrumbsData}
              type={presistStore}
              isBack={true}
            />
          )}
          <Divider style={{ marginBottom: "-16px" }} />

          <Box className="header">
            <Box className="header-text">
              <Typography
                variant="p"
                color={"primary.main"}
              >
                {documentData?.TestSimulationName}
              </Typography>
              <Typography sx={{ color: "#64748B" }}>
                version{" "}
                {documentData?.TestSimulationStatus === "InProgress"
                  ? documentData?.DraftVersion
                  : documentData?.MasterVersion || "N/A"}
                {`${" "}\u00A0(${documentData?.SequenceNumber})`}
              </Typography>
            </Box>
            <div style={{ display: "flex", cursor: "pointer", marginRight: "10px" }}>
              <Tooltip title={t("ImpactAnalysis")}>
                <Box
                  sx={{
                    height: "40px",
                    width: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: BgColor,
                    borderRadius: "20%",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    handleImpactAnalysis(); // Trigger the impact analysis navigation
                  }}
                >
                  <img src={impactanalysisIcon} alt="Impact Analysis Icon" />
                </Box>
              </Tooltip>
              <Box
                onClick={!UserFavorite ? handleBookmarkClick : undefined} // Attach handler only if not disabled
                sx={{
                  height: "40px",
                  width: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: BgColor,
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
          <Box className="analysis-box">
            <Grid
              spacing={2}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Grid xs={12} sm={8} md={8} lg={8}>
                <Typography style={{ width: "100%" }} sx={{ fontSize: "15px" }}>
                  {documentData?.TestSimulationDescription}{" "}
                </Typography>
                <Button
                  onClick={isButtonDisabled ? undefined : HandleStartTestClick}
                  disabled={isButtonDisabled}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                    textTransform: "none",
                    position: "relative",
                    padding: "8px 16px",
                    fontSize: "14px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                    },
                    "&::after": isButtonDisabled
                      ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: "inherit",
                        zIndex: 1,
                      }
                      : {},
                  }}
                >
                  {isButtonDisabled
                    ? t("trainingUnavailable")
                    : t("startTestSimulation")}
                  {!isButtonDisabled && (
                    <img
                      src={arrow}
                      alt="arrow"
                      style={{ paddingLeft: "0.5rem" }}
                    />
                  )}
                </Button>
              </Grid>
              <Grid xs={12} sm={4} md={4} lg={4}>
                <Box className="my_badge">
                  <img
                    src={getBadgeByScore(scores[0] || 0)} // Use the first score to display the badge
                    alt="My Badge"
                  />
                  <b>{t("My Badge")}</b>
                </Box>
              </Grid>
            </Grid>
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
                  {
                    label: t("Assigned By"),
                    value: assignedBy || "N/A",
                    icon: avatar,
                  },

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
            <Grid container spacing={2} alignItems="stretch">
              <Grid item xs={12} md={12}>
                <CardContent className="score-paper">
                  <Typography
                    variant="h6"
                    gutterBottom
                    className="score-titel"
                    sx={{ fontWeight: "600", fontSize: "17px" }}
                  >
                    {t("Previous Attempt Scores")}
                  </Typography>
                  <Grid container style={{ color: "#64748B" }}>
                    <Grid item xs={4} style={{ paddingBottom: "0.3rem" }}>
                      <Typography variant="body1" sx={{ fontWeight: "400" }}>
                        {t("Date")}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body1" sx={{ fontWeight: "400" }}>
                        {t("Total Score")}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body1" sx={{ fontWeight: "400" }}>
                        {t("Attempt Count")}
                      </Typography>
                    </Grid>
                  </Grid>
                  <div
                    style={{
                      maxHeight: "250px",
                      overflowY: "scroll",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    <div style={{ height: "100%", overflowY: "hidden" }}>
                      {previousAttempts.length === 0 ? (
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#6B7280",
                            textAlign: "center",
                            marginTop: "1rem",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {t("no_data_found")}
                        </Typography>
                      ) : (
                        previousAttempts.map((attempt, index) => (
                          <Grid container key={index}>
                            <Grid
                              item
                              xs={4}
                              style={{ paddingBottom: "0.3rem" }}
                            >
                              <Typography variant="b">
                                {/* {moment(attempt?.CreatedDate).format("DD/MM/YY")} */}
                                {attempt?.CreatedDate
                                  ? dateformatter(attempt?.CreatedDate)
                                  : "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="b">
                                {attempt.TotalPercentage
                                  ? `${attempt.TotalPercentage}%`
                                  : "Not Attempted"}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="b">
                                {`${index + 1}/${totalAttempt}`}
                              </Typography>
                            </Grid>
                          </Grid>
                        ))
                      )}
                    </div>{" "}
                  </div>
                </CardContent>
              </Grid>
            </Grid>
          </Box>
          <VideoStartModal
            open={isModalOpen}
            handleClose={HandleCloseModal}
            handleConfirm={HandleConfirmStartTest}
            TestSimulationName={TestSimulationName}
            dueDate={dueDate}
            avgTimeRequired={avgTimeRequired}
            attemptCounter={attemptCounter}
            TestSimulationDescription={TestSimulationDescription}
            TestSimulationPath={TestSimulationPath}
            ModuleID={ModuleID}
          />
          <CompletedAttemptsModal
            open={isCompletedModalOpen}
            handleClose={HandleCloseCompletedModal}
          />

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

export default VideoSimulation;
