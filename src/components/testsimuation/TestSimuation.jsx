import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  CardContent,
  Backdrop,
  Tooltip,
} from "@mui/material";
import avatar from "../../assets/svg/TestSimulation/Avatar.svg";
import calendar from "../../assets/svg/VideoSimulation/calendar.svg";
import clock from "../../assets/svg/VideoSimulation/clock.svg";
import loader from "../../assets/svg/VideoSimulation/loader.svg";
import arrow from "../../assets/svg/TestSimulation/arrow-right-circle.svg";
import Silver from "../../assets/svg/TestSimulation/badge1.svg";
import Gold from "../../assets/svg/TestSimulation/badge2.svg";
import Brass from "../../assets/svg/TestSimulation/badge3.svg";
import Platinum from "../../assets/svg/TestSimulation/badge4.svg";
import TestStartModel from "./TestStartModel";
import "./TestSimuation.css";
import RightSection from "../allpages/accountopening/RightSection";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import CommonContainer from "../allpages/commoncontainer/CommonContainer";
import bookMark from "../../assets/svg/accountOpening-Svg/BookMark-blue.svg";
import "../../css/Common.css";
import { GetElementsFolderDocument } from "../../store/elements/action";
import { useDispatch, useSelector } from "react-redux";
import { GetAddFavourites } from "../../store/favourites/action";
import { useLocation, useNavigate, useParams } from "react-router";
import { impactAnalysis } from "../../store/impactAnalysis/ImpactAnalysis";
import { setDetailsData } from "../../store/details/slice";
import { toast } from "react-toastify";
import CompletedAttemptsModal from "../modals/CompletedAttemptsModal";
import { dateformatter } from "../../utils";
import impactanalysisIcon from "../../assets/svg/impactanalysis/impactanalysisIcon.svg";
import { GetSystemSettings } from "../../services/settings/Settings";
import NoFav from "../../assets/svg/navbar/favone.svg";
import { setTestMCQID } from "../../store/testmcqid/slice";
import BackgroundMeshBox from "../../common/meshbackground/BackgroundMeshBox";
import Pageloader from "../../assets/image/cubeloader.gif";
import { useTranslation } from "react-i18next";
import { useHeadingBgColor } from "../useHeadingBgColor";

const colors = ["#FEF3C7", "#DBEAFE", "#DCFCE7", "#FFE4E6"];

const TestSimulation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [setSettings] = useState(null);
  const [brassHigh, SetBrassHigh] = useState(null);
  const [silverHigh, SetSilverHigh] = useState(null);
  const [silverLow, SetSilverLow] = useState(null);
  const [goldHigh, SetGoldHigh] = useState(null);
  const [goldLow, SetGoldLow] = useState(null);
  const [platinumHigh, SetPlatinumHigh] = useState(null);
  const [platinumLow, SetPlatinumLow] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const bgColor = useHeadingBgColor();
  // Select relevant data from the Redux store
  const { elementsDocumentFiles, loading } = useSelector(
    (state) => state.elements
  );
  const { testMCQIDs } = useSelector((state) => state.ids);
  const { loading: favouriteLoading } = useSelector(
    (state) => state.favourites
  );
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );

  const elementID = useSelector((state) => state.elementid.elementID);

  const { linkedType, linkedID } = useSelector((state) => state.linkedData);

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const response = await GetSystemSettings({});
        const data = response.data.data;
        console.log("System Settings Response:", data);

        // Log each threshold individually
        SetPlatinumLow(data.PlatinumLow);
        SetPlatinumHigh(data.PlatinumHigh);
        SetGoldLow(data.GoldLow);
        SetGoldHigh(data.GoldHigh);
        SetSilverLow(data.SilverLow);
        SetSilverHigh(data.SilverHigh);
        SetBrassHigh(data.BrassHigh);

        setSettings(data);
      } catch (error) {
        console.error("Error fetching system settings:", error);
      }
    };

    fetchSystemSettings();
  }, []); // Empty array ensur

  const formattedDueDate =
    elementsDocumentFiles?.data?.DueDate ||
    elementsDocumentFiles?.data?.CreatedDate ||
    null;
  const dueDate = formattedDueDate ? dateformatter(formattedDueDate) : "N/A";
  const assignedBy =
    elementsDocumentFiles?.data?.AssignByUser ||
    elementsDocumentFiles?.details?.History?.[0]?.CreatedBy ||
    "N/A";
  const avgTimeRequired = elementsDocumentFiles?.data?.TimeLimite;
  const documentData = elementsDocumentFiles?.data;
  const totalAttempt = elementsDocumentFiles?.data?.TotalAttempts;
  const TestMCQName = elementsDocumentFiles?.data?.TestMCQName;
  const breadcrumbsData = elementsDocumentFiles?.bredcrumbs;
  dispatch(setDetailsData(elementsDocumentFiles?.details));
  const previousAttempts = elementsDocumentFiles?.data?.PreviousAttempts || [];
  const attemptCounter = `${previousAttempts.length}/${totalAttempt}`;
  const UserFavorite = elementsDocumentFiles?.data?.UserFavorite || false;
  const TestMCQID = elementsDocumentFiles?.data?.TestMCQID;
  const TestMCQDraftID = elementsDocumentFiles?.data?.TestMCQDraftID;

  useEffect(() => {
    const TestMCQID = elementsDocumentFiles?.data?.TestMCQID;
    if (TestMCQID) {
      dispatch(setTestMCQID(TestMCQID));
    }
  }, [elementsDocumentFiles, dispatch]);
  const getBadgeByScore = (score) => {
    if (score >= 0 && score < brassHigh) {
      return Brass;
    } else if (score >= silverLow && score < silverHigh) {
      return Silver;
    } else if (score >= goldLow && score < goldHigh) {
      return Gold;
    } else if (score >= platinumLow && score <= platinumHigh) {
      return Platinum;
    }
    return null;
  };

  useEffect(() => {
    console.log("linkedTypedoc:", linkedType);
    console.log("linkedIDdoc:", linkedID);
  }, [linkedType, linkedID]);

  useEffect(() => {
    if (elementID) {
      //  console.log(elementID, "elementID");
    }
  }, [elementID]);

  const storedTestMCQID = presistStore?.TestMCQID;

  const apiCalledRef = useRef(false);
  const testMCQIDFromStore = localStorage.getItem("TestMCQDraftID");
  const fromActionables = location.state?.fromActionables || false;
  const queryParams = new URLSearchParams(location.search);
  const isSOPTrue = queryParams.get("SOP") === "true";
  const isSOPFalse = queryParams.get("SOP") === "false";
  const my_task = localStorage.getItem("my_task");

  useEffect(() => {
    return () => {
      localStorage.removeItem("TestMCQDraftID");
      localStorage.removeItem("timeLeft");
    };
  }, []);

  useEffect(() => {
    if (!apiCalledRef.current) {
      apiCalledRef.current = true;
      const TestMCQID = fromActionables
        ? elementID
        : id ||
        testMCQIDFromStore ||
        linkedID ||
        storedTestMCQID ||
        testMCQIDs[0];

      if (TestMCQID) {
        const isActionable = isSOPTrue
          ? true
          : isSOPFalse
            ? false
            : fromActionables;
        const payload = {
          TestMCQID: TestMCQID,
          IsActionable: isActionable,
          IsEnableMyTask: my_task ? true : false,
        };

        dispatch(GetElementsFolderDocument(payload));
      }
    }
  }, [
    dispatch,
    id,
    storedTestMCQID,
    testMCQIDs,
    fromActionables,
    elementID,
    isSOPTrue,
    isSOPFalse,
  ]);

  const HandleStartTestClick = () => {
    if (previousAttempts.length === totalAttempt) {
      setIsCompletedModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const HandleCloseModal = () => {
    setIsModalOpen(false);
  };
  const HandleCloseCompletedModal = () => {
    setIsCompletedModalOpen(false);
  };
  const HandleConfirmStartTest = () => {
    setIsModalOpen(false);
  };
  const handleBookmarkClick = async () => {
    const payload = {
      ModuleTypeID: presistStore.ModuleTypeID,
      ModuleID: presistStore.TestMCQID,
    };
    try {
      const result = await dispatch(GetAddFavourites(payload)).unwrap();
      toast.success(t("Added to Favorites Successfully") || result.message);
     
    } catch (error) {
      toast.error(error.message || "Failed to add to favourites");
    }
  };
  const scores = previousAttempts
    .filter((attempt) => attempt.Score !== null)
    .map((attempt) => attempt.Score);
  const highestScore = scores?.length > 0 ? Math?.max(...scores) : 0;
  const badgeToDisplay = getBadgeByScore(highestScore);

  console.log(TestMCQID, "TestMCQIDTestMCQIDTestMCQID");

  const timeDifferences = previousAttempts.map((attempt) => {
    const startedOn = new Date(attempt.StartedOn);
    const completedOn = attempt.CompletedOn
      ? new Date(attempt.CompletedOn)
      : null;
    if (completedOn) {
      const timeDifferenceMs = completedOn - startedOn;
      const timeDifferenceSec = Math.floor(timeDifferenceMs / 1000);
      const minutes = Math.floor(timeDifferenceSec / 60);
      const seconds = timeDifferenceSec % 60;
      return `${minutes}m ${seconds}s`;
    } else {
      return "0m 0s";
    }
  });

  const handleImpactAnalysis = () => {
    const payload = {
      ModuleID: presistStore.TestMCQID,
      ImpactAnalysisTarget: "TestMCQ",
      name: documentData?.TestMCQName,
    };
    localStorage.setItem("impactAnalysisPayload", JSON.stringify(payload));
    dispatch(impactAnalysis(payload));

    navigate("/impact-analysis");
  };

  return (
    <BackgroundMeshBox sx={{ height: "100%" }}>
      <CommonContainer
        rightSection={<RightSection documentData={documentData} />}
      >
        {/* {!fromActionables && breadcrumbsData && ( */}
        <Breadcrumbs
          bredcrumbs={breadcrumbsData}
          type={presistStore}
          isBack={true}
        />
        {/* )} */}
        <Box className="header" sx={{ marginTop: "-0.2rem" }}>
          <Box className="header-text">
            <Typography
              variant="p"
              color={"primary.main"}

            >
              {documentData?.TestMCQName}
            </Typography>
            <Typography sx={{ color: "#64748B" }}>
              version{" "}
              {documentData?.TestMCQStatus === "InProgress"
                ? documentData?.DraftVersion
                : documentData?.MasterVersion || "N/A"}
              {`${" "}\u00A0(${documentData?.SequenceNumber})`}
            </Typography>
          </Box>
          <div style={{ display: "flex" }}>
            <Tooltip title={t("ImpactAnalysis")}>
              <Box
                sx={{
                  height: "40px",
                  width: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: bgColor,
                  borderRadius: "20%",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleImpactAnalysis(); // Trigger the impact analysis navigation
                }}
              >
                <img src={impactanalysisIcon} alt="Impact Analysis Icon" />
              </Box>
            </Tooltip>
            <div
              onClick={!UserFavorite ? handleBookmarkClick : undefined} // Attach handler only if not disabled
              style={{
                cursor: UserFavorite ? "not-allowed" : "pointer", // Show appropriate cursor
                marginLeft: "1rem",
                pointerEvents: UserFavorite ? "none" : "auto", // Disable interactions
              }}
            >
              <Tooltip
                title={UserFavorite ? t("AlreadyAdded") : t("AddToFavorites")}
                placement="top"
              >
                <Box sx={{
                  height: "40px",
                  width: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: bgColor,
                  borderRadius: "20%",
                  cursor: "pointer",
                  marginRight: "18px",
                }}>


                  <img
                    src={UserFavorite ? bookMark : NoFav}
                    alt={
                      UserFavorite
                        ? "Already Added to Favorites"
                        : "Add to Favorites"
                    }

                  />
                </Box>
              </Tooltip>
            </div>
          </div>
        </Box>

        <Box className="analysis-box">
          <Grid
            spacing={2}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid xs={12} sm={8} md={8} lg={8}>
              <Typography style={{ width: "85%" }} sx={{ fontSize: "15px" }}>
                {documentData?.TestMCQDescription}
              </Typography>
              <Button
                onClick={HandleStartTestClick}
                // sx={{
                //   backgroundColor: bgColor,
                //   color: "#fff",
                //   "&:hover": { backgroundColor: bgColor },
                // }}
                variant="contained"
              >
                {t("Start Test MCQ")}
                <img src={arrow} alt="" style={{ paddingLeft: "0.5rem" }} />
              </Button>
            </Grid>
            <Grid xs={12} sm={4} md={4} lg={4}>
              <Box
                className={highestScore > 0 && badgeToDisplay ? "my_badge" : ""}
              >
                {highestScore > 0 && badgeToDisplay && (
                  <>
                    <img
                      src={badgeToDisplay}
                      alt="Badge"
                      style={{ width: "60px", height: "60px" }}
                    />
                    <Typography variant="body1">{t("My Badge")}</Typography>
                  </>
                )}
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
                { label: t("Assigned By"), value: assignedBy, icon: avatar },
                {
                  label: t("Avg Time Required"),
                  value: avgTimeRequired,
                  icon: clock,
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
            <Grid item xs={12} md={12}></Grid>
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
                      {t("Time Taken")}
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
                        variant="body2"
                        sx={{
                          textAlign: "center",
                          color: "#64748B",
                          marginTop: "1rem",
                        }}
                      >
                        {t("no_data_found")}
                      </Typography>
                    ) : (
                      previousAttempts.map((attempt, index) => (
                        <Grid container key={index}>
                          <Grid item xs={4} style={{ paddingBottom: "0.3rem" }}>
                            <Typography variant="b" sx={{ fontWeight: "400" }}>
                              {/* {moment(attempt?.CreatedDate).format("DD/MM/YY")} */}
                              {attempt?.CreatedDate
                                ? dateformatter(attempt?.CreatedDate)
                                : "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="b" sx={{ fontWeight: "400" }}>
                              {attempt.Score ? `${attempt.Score}%` : "0%"}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="b" sx={{ fontWeight: "400" }}>
                              {timeDifferences[index]}
                            </Typography>
                          </Grid>
                        </Grid>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Grid>
          </Grid>
        </Box>
        <TestStartModel
          open={isModalOpen}
          handleClose={HandleCloseModal}
          handleConfirm={HandleConfirmStartTest}
          dueDate={dueDate}
          totalAttempt={attemptCounter}
          avgTimeRequired={avgTimeRequired}
          TestMCQName={TestMCQName}
          TestMCQID={TestMCQID}
          TestMCQDraftID={TestMCQDraftID}
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
          open={loading || favouriteLoading}
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
    </BackgroundMeshBox>
  );
};

export default TestSimulation;
