import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  LinearProgress,
  Grid,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Checkbox,
  Backdrop,
} from "@mui/material";
import backButton from "../../../assets/svg/McqQuestionsPage/back-button.svg";
import openBook from "../../../assets/svg/McqQuestionsPage/book-open.svg";
import TestEndModal from "./TestEndModal";
import { styled, useTheme } from "@mui/styles";
import "./Questions.css";
import "../../../css/Common.css";
import { useDispatch, useSelector } from "react-redux";
import { GetTestMcqsList, GetEndTest } from "../../../store/mcqs/action";
import { GetElementsFolderDocument } from "../../../store/elements/action";
import select from "../../../assets/svg/TestMCQ/selectedIcon.svg";
import { useNavigate } from "react-router";
import { dateformatter } from "../../../utils";
import { TimerModal } from "./TimerModal";
import Pageloader from "../../../assets/image/cubeloader.gif";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  width: "21.5%",
  borderRadius: "10px",
  backgroundColor: "#F1F5F9",
  height: "8px",
  marginBottom: "8px",
  "& .MuiLinearProgress-bar": {
    backgroundColor: "#3D54CD",
  },
  "& .MuiLinearProgress-root": {
    height: 10,
  },
  [theme.breakpoints.down("lg")]: {
    width: "40%",
  },
  [theme.breakpoints.down("md")]: {
    width: "50%",
  },
  [theme.breakpoints.down("sm")]: {
    width: "60%",
  },
  [theme.breakpoints.down("xs")]: {
    width: "90%",
  },
}));

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const Questions = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mcqs, setMcqs] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [attemptID, setAttemptID] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const hasFetched = useRef(false); // Tracks if API was already called
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { elementsDocumentFiles, loading } = useSelector(
    (state) => state.elements
  );
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );

  const elementId = presistStore?.ModuleTypeID;
  const TestMCQID = presistStore?.TestMCQID;

  // Correct Selector in Questions Component
  const TestMCQIDTwo = useSelector((state) => state.testId.TestMCQID);
  const LatestTestMCQID = localStorage.getItem("TestMCQID");

  useEffect(() => {
    if (TestMCQIDTwo) {
      // eslint-disable-next-line no-console
      console.log("TestMCQID:", TestMCQIDTwo, isDataFetched, selectedAnswers);
    } else {
      // eslint-disable-next-line no-console
      console.log("TestMCQID is not available.");
    }
    // Only run when TestMCQIDTwo, isDataFetched, or selectedAnswers changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TestMCQIDTwo, isDataFetched, selectedAnswers]);

  useEffect(() => {
    if (elementId) {
      const payload = { TestMCQID: LatestTestMCQID || TestMCQID };
      dispatch(GetElementsFolderDocument(payload));
    }
  }, [dispatch, elementId, LatestTestMCQID, TestMCQID]);

  useEffect(() => {
    const fetchMCQs = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const testMCQID = {
          TestMCQID: LatestTestMCQID || TestMCQID || TestMCQIDTwo,
          IsMyAssignment: true,
        };
        const result = await dispatch(GetTestMcqsList(testMCQID));
        // eslint-disable-next-line no-console
        console.log("MCQ result:", result);
        const mcqData = result.payload?.data || [];
        if (mcqData.length > 0) {
          setMcqs(mcqData);
          setAttemptID(result?.payload?.attemptDetails?.AttemptID);
          setIsDataFetched(true);
        } else {
          // eslint-disable-next-line no-console
          console.error("No questions found in MCQ data.");
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching MCQs:", error);
      }
    };
    fetchMCQs();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, LatestTestMCQID, TestMCQID, TestMCQIDTwo]);

  useEffect(() => {
    if (elementsDocumentFiles?.data?.TimeLimite) {
      const timeParts = elementsDocumentFiles.data.TimeLimite.split(":");
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const seconds = parseInt(timeParts[2], 10);

      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      setTimeLeft(totalSeconds);
    }
  }, [elementsDocumentFiles]);

  useEffect(() => {
    const savedTime = localStorage.getItem("timeLeft");

    if (savedTime) {
      setTimeLeft(parseInt(savedTime, 10));
    }

    if (timeLeft > 0) {
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            localStorage.removeItem("timeLeft");
            setIsTimerModalOpen(true);
            return 0;
          }

          const newTime = prevTime - 1;
          localStorage.setItem("timeLeft", newTime);
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
    return undefined;
  }, [timeLeft]);

  useEffect(() => {
    const currentQuestionId = mcqs[currentQuestion]?.QuestionID;
    setSelectedOption(selectedAnswers[currentQuestionId] || "");
  }, [currentQuestion, mcqs, selectedAnswers]);

  // Handle "Next" button click
  const HandleNext = () => {
    saveAnswer();
    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  };

  const HandlePrevious = () => {
    saveAnswer();
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    }
  };
  // Handle "Previous" button click
  const HandleBack = () => {
    navigate("/test-mcqs/view");
  };

  // Save the current answer
  const saveAnswer = () => {
    const question = mcqs[currentQuestion];
    if (!question) return;
    let answer;
    answer = selectedOption;
    console.log("Selected Option:", answer);
  };

  const handleConfirmAndNavigate = () => {
    setIsModalOpen(false); // Close the modal
    handleConfirmEndTest(); // Execute the end test function
    navigate("/mcqtestresult"); // Navigate to the result page
  };

  // Handle option change
  const HandleOptionChange = (event) => {
    const selectedAnswerID = event.target.value; // Save the AnswerID
    setSelectedOption(selectedAnswerID);

    setSelectedAnswers((prev) => ({
      ...prev,
      [mcqs[currentQuestion].QuestionID]: selectedAnswerID,
    }));
  };

  // Render options for the current question
  const renderOptions = () => {
    const question = mcqs[currentQuestion];

    if (!question) return null;

    if (question?.IsMultipleAnswer) {
      // Render checkboxes for multiple answers
      return (
        <Box>
          {question?.AnswerOptions?.map((option) => (
            <FormControlLabel
              key={option?.AnswerID}
              control={
                <Checkbox
                  checked={
                    Array.isArray(selectedAnswers[question.QuestionID]) &&
                    selectedAnswers[question.QuestionID].includes(
                      option.AnswerID
                    )
                  }
                  onChange={() =>
                    handleMultipleOptionChange(
                      question.QuestionID,
                      option.AnswerID
                    )
                  }
                />
              }
              label={option?.OptionText}
            />
          ))}
        </Box>
      );
    } else {
      // Render radio buttons for single-answer questions
      return (
        <RadioGroup value={selectedOption} onChange={HandleOptionChange}>
          {question?.AnswerOptions?.map((option) => (
            <FormControlLabel
              key={option?.AnswerID}
              value={option?.AnswerID}
              control={<Radio />}
              label={option?.OptionText}
            />
          ))}
        </RadioGroup>
      );
    }
  };
  // Handle multiple option selection for IsMultipleAnswer questions
  const handleMultipleOptionChange = (questionId, answerId) => {
    setSelectedAnswers((prev) => {
      const currentSelections = prev[questionId] || [];
      const updatedSelections = currentSelections.includes(answerId)
        ? currentSelections.filter((id) => id !== answerId)
        : [...currentSelections, answerId];

      return {
        ...prev,
        [questionId]: updatedSelections,
      };
    });
  };

  const handleEndTestClick = () => {
    saveAnswer();
    setIsModalOpen(true);
  };

  const handleConfirmEndTest = async () => {
    const requestPayload = {
      AttemptID: attemptID,
      QuestionAnswerIDs: mcqs.map((question) => {
        const selectedAnswer = selectedAnswers[question.QuestionID];
        return {
          QuestionID: question.QuestionID,
          AnswerID: question.IsMultipleAnswer
            ? selectedAnswer || [] // If multiple answers allowed, send array or empty array if no answer selected
            : (Array.isArray(selectedAnswer)
                ? selectedAnswer[0]
                : selectedAnswer) || null, // Send single answer if not multiple-choice
        };
      }),
    };
    localStorage.removeItem("timeLeft"); // Cleanup saved time

    try {
      await dispatch(GetEndTest(requestPayload));
      setIsModalOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error ending the test:", error);
    }
  };

  const logsLength = elementsDocumentFiles?.data?.PreviousAttempts?.length ?? 0;
  const TestMCQName = elementsDocumentFiles?.data?.TestMCQName ?? "N/A";
  const TestMCQDescription =
    elementsDocumentFiles?.data?.TestMCQDescription ?? "N/A";
  const dueDate = elementsDocumentFiles?.data?.CreatedDate
    ? dateformatter(elementsDocumentFiles.data.CreatedDate)
    : "N/A";

  // const logsLength = elementsDocumentFiles?.data?.Logs?.length ?? 0;
  const totalAttempt = elementsDocumentFiles?.data?.TotalAttempts ?? "N/A";
  const attemptCounter = `${logsLength}/${totalAttempt} `;

  if (loading) {
    return (
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
      // <Box
      //   display="flex"
      //   justifyContent="center"
      //   alignItems="center"
      //   height="100vh"
      //   width="100%"
      // >
      //   <CircularProgress size={60} />
      // </Box>
    );
  }
  const currentIsRequired = mcqs[currentQuestion]?.IsRequired;
  const isAnswered = !!selectedAnswers[mcqs[currentQuestion]?.QuestionID];
  return (
    <Box>
      <Box
        className="back-icon"
        style={{ backgroundColor: "#fff", height: "70px" }}
      >
        <img
          src={backButton}
          alt="Back"
          onClick={HandleBack}
          style={{ marginTop: "-5px" }}
        />
      </Box>

      <Grid container alignItems="stretch">
        <Grid item xs={12} md={8.5}>
          <Box className="question-box" sx={{ height: "100%" }}>
            <Box>
              <Box className="question-header">
                <Box className="question-header-left">
                  <img src={openBook} alt="Open Book" />
                  <Typography variant="h6" className="analysis-data">
                    {mcqs &&
                    mcqs.length > 0 &&
                    mcqs[currentQuestion]?.QuestionHeading
                      ? mcqs[currentQuestion].QuestionHeading
                      : "Heading Loading..."}
                  </Typography>
                  {currentIsRequired && (
                    <Typography variant="body2" color="red" component="span">
                      {" *"} {/* Display red asterisk if required */}
                    </Typography>
                  )}
                </Box>
                <Box style={{ marginLeft: "0px" }}>
                  <Typography
                    variant="h6"
                    style={{
                      color: "#fff",
                      backgroundColor: timeLeft <= 120 ? "red" : "green",
                      padding: "5px 10px",
                      borderRadius: "8px",
                      marginRight: "25px",
                      animation:
                        timeLeft <= 120
                          ? "blink 1s step-start infinite"
                          : "none",
                    }}
                  >
                    {formatTime(timeLeft)}
                  </Typography>
                </Box>
                <CustomLinearProgress
                  variant="determinate"
                  value={((currentQuestion + 1) / mcqs.length) * 100}
                />
              </Box>

              <Box className="answered-total">
                <Typography
                  className="total-answered"
                  sx={{ paddingRight: "-30px" }}
                >
                  {t("question")}:
                  <span className="counts">{currentQuestion + 1}</span>
                </Typography>
                <Typography className="total-questions">
                  {t("total")}: <span className="counts">{mcqs.length}</span>
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ marginY: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box className="question-text">
                  <Typography variant="h6">{currentQuestion + 1}. </Typography>
                  <Typography
                    variant="body1"
                    className="question-description"
                    sx={{ marginTop: "0.6rem", marginLeft: "0.5rem" }}
                  >
                    {mcqs &&
                    mcqs.length > 0 &&
                    mcqs[currentQuestion]?.QuestionText
                      ? mcqs[currentQuestion].QuestionText
                      : "Loading..."}
                  </Typography>
                </Box>
              </Grid>

              {mcqs[currentQuestion]?.QuestionImage && (
                <Box>
                  <img
                    src={mcqs[currentQuestion].QuestionImage}
                    alt="Question"
                    style={{
                      maxWidth: "auto",
                      height: "200px",
                      borderRadius: "8px",
                      marginTop: "10px",
                    }}
                  />
                </Box>
              )}

              <Grid item xs={12}>
                {renderOptions()}
              </Grid>

              <Grid item xs={12} className="navigation-buttons">
                <Box>
                  <Button
                    variant="outlined"
                    onClick={HandlePrevious}
                    disabled={currentQuestion === 0} // Disable if it's the first question
                    className="test_previous-skip_botton"
                  >
                    Previous
                  </Button>
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    onClick={HandleNext}
                    className="test_previous-skip_botton"
                    disabled={currentIsRequired && !isAnswered}
                  >
                    {t("skipQuestion")}
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: bgColor,
                      marginLeft: "1rem",
                      ":hover": { backgroundColor: bgColor },
                    }}
                    onClick={HandleNext}
                    disabled={
                      currentQuestion === mcqs.length - 1 ||
                      (currentIsRequired && !isAnswered)
                    }
                  >
                    {t("next")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={3.5}>
          <Box
            className="question-box"
            sx={{
              marginRight: "20px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              sx={{ p: 0.3, display: "flex", alignItems: "center" }}
            >
              <span style={{ marginRight: 8 }}>
                <img src={select} alt="" />
              </span>
              {t("selectQuestions")}
            </Typography>

            <Divider sx={{ mt: 2, mb: 2 }} />

            {mcqs.length > 0 ? (
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                }}
              >
                {mcqs.map((question, index) => {
                  let statusColor = "";
                  let borderColor = "1px solid #BBBCC3";
                  let textColor = "#000";

                  if (index === currentQuestion) {
                    statusColor = "#3D54CD";
                    textColor = "#fff";
                  } else if (selectedAnswers[question.QuestionID]) {
                    statusColor = "green";
                    textColor = "#fff";
                  } else {
                    statusColor = "#FFFFFF";
                    borderColor = "1px solid #CCC";
                    textColor = "#000";
                  }

                  return (
                    <Box
                      key={question.QuestionID}
                      onClick={() => setCurrentQuestion(index)}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: statusColor,
                        borderRadius: "50%",
                        height: "40px",
                        width: "40px",
                        border: borderColor,
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Typography
                        variant="b"
                        style={{
                          color: textColor,
                          // color: index === currentQuestion ? "#fff" : "#000",
                        }}
                      >
                        {index + 1}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography>{t("noQuestionsAvailable")}</Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              // onClick={handleSubmitTest}
              onClick={handleEndTestClick}
              className="test_end_botton"
              sx={{
                marginTop: "auto",
                width: "100%",
                textTransform: "none",
              }}
            >
              {t("endTest")}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <TimerModal
        open={isTimerModalOpen}
        onConfirm={handleConfirmAndNavigate}
      />

      <TestEndModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleConfirm={handleConfirmEndTest}
        TestMCQName={TestMCQName}
        dueDate={dueDate}
        TestMCQDescription={TestMCQDescription}
        attemptCounter={attemptCounter}
        handleConfirmAndNavigate={handleConfirmAndNavigate}
      />
    </Box>
  );
};
TimerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

TestEndModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  TestMCQName: PropTypes.string,
  dueDate: PropTypes.string,
  TestMCQDescription: PropTypes.string,
  attemptCounter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleConfirmAndNavigate: PropTypes.func,
};

export default Questions;
