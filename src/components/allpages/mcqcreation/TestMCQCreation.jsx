import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  DialogActions,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
  Checkbox,
  Menu,
  ListItemIcon,
  TextareaAutosize,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DraggableSection from "./DraggableSection";
import threedoticon from "../../../assets/svg/TestMCQ/threedoticon.svg";
import puls from "../../../assets/svg/TestMCQ/puls.svg";
import backButton from "../../../assets/svg/McqQuestionsPage/back-button.svg";
import deleteicon from "../../../assets/svg/TestMCQ/delete.svg";
import UploadIcon from "@mui/icons-material/CloudUploadTwoTone";
import {
  CheckCircle,
  Delete,
  DragIndicator,
  EditAttributesSharp,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  createTestMCQModule,
  listMcqc,
} from "../../../services/testMcqModules/TestMcqModules";
import { selectTestData } from "../../../store/mcqtestslice/testSlice";
import notify from "../../../assets/svg/utils/toast/Toast";
import { frontendState } from "../../../store/presist/action";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Pageloader from "../../../assets/image/cubeloader1.gif";
import GenerateMCQModal from "./GenerateMCQModal";
import { useTheme } from "@mui/styles";

const TestMCQCreation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;

  // Accessing Redux store data
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const testData = useSelector(selectTestData);
  const { requestBody } = useSelector((state) => state.testMcq);
  // Local state management
  const [showDraggable, setShowDraggable] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAIModal, setOpenAIModal] = useState(false);
  const [newMCQ, setNewMCQ] = useState({
    QuestionHeading: "",
    QuestionText: "",
    AnswerList: [{ OptionText: "", IsCorrect: false }],
    IsMultipleAnswer: false,
    IsAnswerWithImage: false,
    IsRequired: false,
    QuestionImage: null,
    HasCustomAnswer: false, // New state for custom answer switch
    CustomAnswer: "", // New state for custom answer text
  });
  const [isCreatingMCQ] = useState(false);
  const [testMCQData, setTestMCQData] = useState([]);
  // Logging Redux store data for debugging
  console.log(testData, "testDataTesting");
  console.log("requestBodyInLocalStore", requestBody);
  // Fetch existing questions on component mount
  useEffect(() => {
    if (testData) {
      console.log("API Response:", testData);
    }
  }, [testData]);
  const totalQuestionsRequired = parseInt(testData?.TotalQuestions) || 0; // Default to 0 if undefined
  const currentQuestionCount = testMCQData.length; // Current count of questions
  console.log(totalQuestionsRequired, "totalQuestionsRequired");
  useEffect(() => {
    const fetchMCQData = async () => {
      try {
        const requestData = {
          TestMCQDraftID: presistStore?.TestMCQDraftID || null,
          TestMCQID: presistStore?.TestMCQID || null,
          ModuleTypeID: presistStore?.ModuleTypeID || null,
          ContentID: presistStore?.ContentID || null,
        };
        const response = await listMcqc(requestData);
        const fetchedData =
          response?.data?.data?.mcqs?.QuestionsAndAnswers.map((mcq) => ({
            QuestionID: `QID_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            QuestionHeading: mcq.QuestionHeading,
            QuestionText: mcq.QuestionText,
            QuestionImage: mcq.QuestionImage || null,
            AnswerList: mcq.AnswerList.map((answer) => ({
              OptionText: answer.OptionText,
              IsCorrect: answer.IsCorrect,
              isChecked: answer.IsCorrect,
            })),
            IsMultipleAnswer: mcq.IsMultipleAnswer || false,
            IsAnswerWithImage: mcq.IsAnswerWithImage || false,
            IsRequired: mcq.IsRequired || false,
            HasCustomAnswer: mcq.HasCustomAnswer || false, // Include custom answer state
            CustomAnswer: mcq.CustomAnswer || "", // Include custom answer text
          })) || [];
        const requestBodyData =
          requestBody?.QuestionList?.map((question) => ({
            QuestionID: `QID_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            QuestionHeading: question.QuestionHeading,
            QuestionText: question.QuestionText,
            QuestionImage: question.QuestionImage || null,
            AnswerList: question.AnswerList.map((answer) => ({
              OptionText: answer.OptionText,
              IsCorrect: answer.IsCorrect,
              isChecked: answer.IsCorrect,
            })),
            IsMultipleAnswer: question.IsMultipleAnswer || false,
            IsAnswerWithImage: question.IsAnswerWithImage || false,
            IsRequired: question.IsRequired || false,
            HasCustomAnswer: question.HasCustomAnswer || false, // Include custom answer state
            CustomAnswer: question.CustomAnswer || "", // Include custom answer text
          })) || [];
        // Merge both fetched data and requestBody data
        const mergedData = [...fetchedData, ...requestBodyData];
        setTestMCQData(mergedData);
      } catch (error) {
        toast.error("Failed to fetch data. Please try again.");
        console.error("Error fetching MCQ data:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchMCQData();
  }, [presistStore, requestBody]);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAnchorElClose = () => {
    setAnchorEl(null);
  };
  const handleClickOpen = () => {
    setShowDraggable(false);
  };
  const handleClose = () => {
    setShowDraggable(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMCQ({ ...newMCQ, [name]: value });
  };
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newMCQ.AnswerList];
    updatedOptions[index].OptionText = value;
    setNewMCQ({ ...newMCQ, AnswerList: updatedOptions });
  };
  const handleAddOption = () => {
    if (newMCQ.AnswerList.length >= 10) {
      toast.error("You can't add more than 10 answers.");
      return;
    }
    setNewMCQ({
      ...newMCQ,
      AnswerList: [
        ...newMCQ.AnswerList,
        { OptionText: "", IsCorrect: false, isChecked: false },
      ],
    });
  };

  const handleAddQuestion = () => {
    // Validation checks
    if (!newMCQ.QuestionHeading.trim() || !newMCQ.QuestionText.trim()) {
      toast.error("Please provide a valid heading and question text.");
      return;
    }
    
    // If custom answer is enabled, skip the regular option validation
    if (!newMCQ.HasCustomAnswer) {
      const filledOptions = newMCQ.AnswerList.filter(
        (option) => option.OptionText.trim() !== ""
      );
      if (filledOptions.length < 2) {
        toast.error("Please provide at least 2 options with non-empty text.");
        return;
      }
      const hasCorrectOption = filledOptions.some(
        (option) => option.IsCorrect === true
      );
      if (!hasCorrectOption) {
        toast.error("Please mark at least one option as correct.");
        return;
      }
    }

    const updatedOptions = newMCQ.HasCustomAnswer 
      ? [] // If custom answer is enabled, don't include regular options
      : newMCQ.AnswerList.filter(option => option.OptionText.trim() !== "")
          .map((option) => ({
            ...option,
            IsCorrect: String(option.IsCorrect), // Ensure stored as "true"/"false"
            isChecked: String(option.IsCorrect), // Ensure stored as "true"/"false"
          }));

    setTestMCQData((prevState) => [
      ...prevState,
      {
        QuestionID: `QID_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        ...newMCQ,
        AnswerList: updatedOptions,
        IsMultipleAnswer: String(newMCQ.IsMultipleAnswer),
        IsAnswerWithImage: String(newMCQ.IsAnswerWithImage),
        IsRequired: String(newMCQ.IsRequired),
        HasCustomAnswer: String(newMCQ.HasCustomAnswer),
        CustomAnswer: newMCQ.CustomAnswer || "",
      },
    ]);

    setNewMCQ({
      QuestionHeading: "",
      QuestionText: "",
      IsMultipleAnswer: "false",
      IsAnswerWithImage: "false",
      IsRequired: "false",
      HasCustomAnswer: false,
      CustomAnswer: "",
      AnswerList: [{ OptionText: "", IsCorrect: "false", isChecked: "false" }],
      QuestionImage: null,
    });

    handleClose();
  };

  const handleUpdateMcq = (updatedMcqData, QuestionID) => {
    console.log("Received Updated Question Data in Parent:", updatedMcqData);

    const updatedMcqList = testMCQData.map((mcq) =>
      mcq.QuestionID === QuestionID ? { ...mcq, ...updatedMcqData } : mcq
    );

    setTestMCQData(updatedMcqList);
  };

  const handleDeleteMcq = (QuestionID) => {
    const updatedMCQData = testMCQData.filter(
      (mcq) => mcq.QuestionID !== QuestionID
    );
    setTestMCQData(updatedMCQData);
  };

  console.log(presistStore?.editTestMcqData, "testData");

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      const combinedRequestBody = {
        ...presistStore?.editTestMcqData,
        TestMCQDraftID: presistStore?.TestMCQDraftID || null,
        TestMCQID: presistStore?.TestMCQID || null,
        QuestionList: testMCQData.map((question) => ({
          QuestionHeading: question.QuestionHeading,
          QuestionText: question.QuestionText,
          QuestionImage: question.QuestionImage || null,
          AnswerList: question.AnswerList.map((answer) => ({
            OptionText: answer.OptionText,
            IsCorrect:
              answer.IsCorrect === true || answer.IsCorrect === "true"
                ? "true"
                : "false",
          })),
          IsMultipleAnswer: question.IsMultipleAnswer,
          IsAnswerWithImage: question.IsAnswerWithImage,
          IsRequired: question.IsRequired,
          HasCustomAnswer: question.HasCustomAnswer, // Include custom answer state
          CustomAnswer: question.CustomAnswer, // Include custom answer text
        })),
      };

      const response = await createTestMCQModule(combinedRequestBody);
      if (response?.status === 201) {
        toast.success(t("Successfully saved"));
        dispatch(frontendState(response?.data?.data));

        navigate(-1);
      } else {
        notify(
          "error",
          response?.data?.message ||
            response?.data?.error ||
            t("An error occurred")
        );
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMCQ((prevState) => ({
          ...prevState,
          QuestionImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  console.log(testMCQData, "testMCQData");

  const handleDeleteOption = (index) => {
    const updatedOptions = [...newMCQ.AnswerList];
    updatedOptions.splice(index, 1);
    setNewMCQ({ ...newMCQ, AnswerList: updatedOptions }); // Update the state with the new AnswerList
  };

  const handleCheckboxChange = (selectedIndex) => {
    const updatedOptions = newMCQ.AnswerList.map((option, index) => {
      if (newMCQ.IsMultipleAnswer) {
        // Toggle selected option
        return {
          ...option,
          isChecked:
            index === selectedIndex ? !option.isChecked : option.isChecked,
          IsCorrect:
            index === selectedIndex ? !option.IsCorrect : option.IsCorrect,
        };
      } else {
        // Only one option can be correct
        return {
          ...option,
          isChecked: index === selectedIndex, // Only selected option is checked
          IsCorrect: index === selectedIndex, // Only selected option is correct
        };
      }
    });
    setNewMCQ({ ...newMCQ, AnswerList: updatedOptions });
  };

  const handleSwitchChange = (name) => (event) => {
    setNewMCQ({
      ...newMCQ,
      [name]: event.target.checked,
    });
  };

  // Handle custom answer switch change
  const handleCustomAnswerSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setNewMCQ({
      ...newMCQ,
      HasCustomAnswer: isChecked,
      // If enabling custom answer, clear any existing options
      AnswerList: isChecked ? [] : [{ OptionText: "", IsCorrect: false, isChecked: false }],
    });
  };

  // Handle custom answer text change
  const handleCustomAnswerChange = (event) => {
    setNewMCQ({
      ...newMCQ,
      CustomAnswer: event.target.value,
    });
  };

  // All questions (manual + AI) are now in testMCQData
  const allQuestions = testMCQData;

  const handleAISuccess = (responseData) => {
    console.log("AI Generated MCQs Response:", responseData);
    // Convert AI MCQs to the same format as manual MCQs and append to testMCQData
    if (Array.isArray(responseData)) {
      const aiQuestions = responseData.map((q) => ({
        QuestionID:
          q.QuestionID ||
          `QID_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        QuestionHeading: q.QuestionHeading,
        QuestionText: q.QuestionText,
        QuestionImage: q.QuestionImage || null,
        AnswerList: (q.AnswerOptions || []).map((a) => ({
          OptionText: a.OptionText,
          IsCorrect:
            a.IsCorrect === true || a.IsCorrect === "true" ? "true" : "false",
          isChecked: a.IsCorrect === true || a.IsCorrect === "true",
        })),
        IsMultipleAnswer: q.IsMultipleAnswer || false,
        IsAnswerWithImage: q.IsAnswerWithImage || false,
        IsRequired: q.IsRequired || false,
        HasCustomAnswer: q.HasCustomAnswer || false,
        CustomAnswer: q.CustomAnswer || "",
      }));
      setTestMCQData((prev) => [...prev, ...aiQuestions]);
    }
  };

  // Auto-open AI modal if selectedMCQCard is "AI MCQ"
  // Auto-navigate to Bulk MCQ if selectedMCQCard is "Bulk MCQ"
  useEffect(() => {
    const selectedMCQCard = localStorage.getItem("selectedMCQCard");
    if (selectedMCQCard === "AI MCQ") {
      setOpenAIModal(true);
    }
    if (selectedMCQCard === "Bulk MCQ") {
      navigate("/bulk-mcqs");
    }
  }, []);

  return (
    <Box>
      {isFetching && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 9999,
          }}
        >
          <img src={Pageloader} alt="loader" style={{ width: "10%" }} />
        </Box>
      )}
      {!isFetching && (
        <Box>
          <Box
            className="back-icon"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fff",
              height: "70px",
              padding: "0 16px",
            }}
          >
            <img
              src={backButton}
              alt="Back"
              style={{ marginTop: "-20px", cursor: "pointer" }}
              onClick={() => navigate(-1)}
            />

            <Box>
              <Button
                variant="contained"
                onClick={handlePublish}
                style={{ textTransform: "none" }}
                disabled={
                  isLoading ||
                  isCreatingMCQ ||
                  currentQuestionCount < totalQuestionsRequired
                }
              >
                {isLoading ? t("saving") : t("save")}
              </Button>

              <Button
                variant="contained"
                style={{
                  textTransform: "none",
                  marginLeft: "1rem",
                }}
                onClick={() => navigate("/bulk-mcqs")}
              >
                {t("bulk_mcqs")}
              </Button>

              <Button
                variant="contained"
                style={{
                  textTransform: "none",
                  marginLeft: "1rem",
                }}
                onClick={() => setOpenAIModal(true)}
              >
                {t("AIModalTitle")}
              </Button>
            </Box>
          </Box>

          {totalQuestionsRequired > 0 && (
            <Box
              sx={{
                backgroundColor: "#FFF9C4",
                color: "#F57F17",
                padding: "10px 20px",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              <Typography variant="body1" align="center">
                {totalQuestionsRequired} {t("questions_required")}
              </Typography>
            </Box>
          )}
          <Box style={{ margin: "25px" }}>
            <Box sx={{ flexGrow: 1, padding: 1 }}>
              <Grid container spacing={6}>
                <Grid item xs={12} md={3} style={{ height: "100%" }}>
                  <Box
                    sx={{
                      bgcolor: "#fff",
                      padding: 2,
                      borderRadius: "12px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Header with Questions Count and Add Button */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          color: "#333",
                          fontSize: "15px",
                        }}
                      >
                        {t("questions_heading")} ({allQuestions.length})
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ color: "#3D54CD" }}
                        onClick={handleClickOpen}
                      >
                        <img src={puls} alt="Add Question" />
                      </IconButton>
                    </Box>

                    {/* List of Questions */}
                    {allQuestions.length > 0 ? (
                      allQuestions.map((questionData, index) => (
                        <Box
                          key={questionData.QuestionID}
                          sx={{
                            bgcolor: "#F2F4FE",
                            borderRadius: 2,
                            padding: 1.5,
                            marginBottom: 1.5,
                            boxShadow: 1,
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            height: "100px",
                          }}
                        >
                          {/* Question Header */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "24px",
                                height: "24px",
                                border: "2px solid #3D54CD",
                                borderRadius: "50%",
                                color: "#3D54CD",
                                fontWeight: 500,
                                mr: 1,
                              }}
                            >
                              {index + 1}
                            </Box>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 500,
                                flex: 1,
                                color: "#333",
                                marginTop: "10px",
                              }}
                            >
                              {questionData.QuestionText.length > 20
                                ? `${questionData.QuestionText.slice(0, 20)}...`
                                : questionData.QuestionText}
                            </Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="#7E8CA0">
                        {t("no_questions")}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Right Grid (Draggable Sections or Add Question Form) */}
                <Grid item xs={12} md={9}>
                  {showDraggable ? (
                    <DraggableSection
                      mcqcreationlist={allQuestions}
                      handleUpdateMcq={handleUpdateMcq}
                      handleDeleteMcq={handleDeleteMcq}
                    />
                  ) : (
                    <Box>
                      <Box
                        sx={{
                          bgcolor: "#fff",
                          padding: 2,
                          borderRadius: "12px",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Header with Question Type and Actions */}
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Select
                            value="Multiple Choice"
                            sx={{
                              width: "200px",
                              height: "35px",
                              backgroundColor: "#F2F4FE",
                              borderRadius: "4px",
                              color: bgColor,
                              border: "none",
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                              },
                            }}
                          >
                            <MenuItem value="Multiple Choice">
                              {t("multiple_choice")}
                            </MenuItem>
                          </Select>
                          <Box display="flex" alignItems="center">
                            <Typography
                              sx={{
                                marginRight: 1,
                                color: bgColor,
                                fontWeight: "450",
                              }}
                            >
                              {t("required")}
                            </Typography>
                            <Switch
                              checked={newMCQ.IsRequired}
                              onChange={handleSwitchChange("IsRequired")}
                            />
                            <IconButton onClick={handleClick}>
                              <img src={threedoticon} alt="Options" />
                            </IconButton>

                            {/* Dropdown Menu */}
                            <Menu
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleAnchorElClose} // This will close the dropdown when clicking outside
                              PaperProps={{
                                sx: {
                                  width: "150px",
                                  gap: "0px",
                                  borderRadius: "8px",
                                  border: "1px solid #F2F4F7",
                                  boxShadow:
                                    "0px 4px 6px -2px rgba(16, 24, 40, 0.08), 0px 12px 16px -4px rgba(16, 24, 40, 0.14)",
                                },
                              }}
                            >
                              {/* Delete Row */}
                              <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                  <Delete />
                                </ListItemIcon>
                                <Typography variant="body2">
                                  {t("delete")}
                                </Typography>
                              </MenuItem>

                              {/* Edit Row */}
                              <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                  <EditAttributesSharp />
                                </ListItemIcon>
                                <Typography variant="body2">
                                  {t("edit")}
                                </Typography>
                              </MenuItem>
                            </Menu>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Question Content */}
                        <DialogContent>
                          {/* Question Heading */}
                          <TextField
                            autoFocus
                            margin="dense"
                            label={t("question_heading_label")}
                            type="text"
                            name="QuestionHeading"
                            variant="outlined"
                            value={newMCQ.QuestionHeading}
                            onChange={handleInputChange}
                            fullWidth
                          />

                          {/* Question Text and Image */}
                          <Grid sx={{ mt: 2 }} container spacing={2}>
                            <Grid
                              item
                              xs={9}
                              sx={{
                                backgroundColor: "#FBFBFB",
                                height: "160px",
                                padding: "16px 24px",
                                borderRadius: "8px",
                                gap: "12px",
                                opacity: 1,
                              }}
                            >
                              <TextField
                                name="QuestionText"
                                fullWidth
                                variant="standard"
                                value={newMCQ.QuestionText}
                                onChange={handleInputChange}
                                placeholder={t("question_text_placeholder")}
                                InputProps={{
                                  disableUnderline: true, // Removes the underline (border)
                                  style: {
                                    backgroundColor: "#FBFBFB",
                                    border: "none",
                                    boxShadow: "none",
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  height: "100%",
                                }}
                              >
                                {newMCQ.QuestionImage ? (
                                  <img
                                    src={newMCQ.QuestionImage}
                                    alt="Question"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                    }}
                                  />
                                ) : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      width: "100%",
                                      height: "100%",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <IconButton
                                      component="label"
                                      sx={{ cursor: "pointer" }}
                                    >
                                      <UploadIcon
                                        style={{
                                          height: "40px",
                                          width: "40px",
                                        }}
                                      />
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        hidden // Hide the default file input
                                      />
                                    </IconButton>
                                    <Typography
                                      variant="body1"
                                      sx={{ color: bgColor, mt: 1 }}
                                    >
                                      {t("upload_image_label")}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Grid>
                          </Grid>

                          {/* Custom Answer Switch */}
                          <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={newMCQ.HasCustomAnswer}
                                  onChange={handleCustomAnswerSwitchChange}
                                />
                              }
                              label={t("enable custom answer")}
                              labelPlacement="start"
                              sx={{
                                fontWeight: "500",
                                color: "#000",
                              }}
                            />
                          </Box>

                          {/* Custom Answer Text Area (visible when switch is on) */}
                          {newMCQ.HasCustomAnswer && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                {t("custom answer label")}
                              </Typography>
                              <TextareaAutosize
                                minRows={3}
                                placeholder={t("custom answer placeholder")}
                                value={newMCQ.CustomAnswer}
                                onChange={handleCustomAnswerChange}
                                style={{
                                  width: "100%",
                                  padding: "10px",
                                  borderRadius: "4px",
                                  border: "1px solid #ccc",
                                  resize: "vertical",
                                }}
                              />
                            </Box>
                          )}

                          {/* Choices Section (hidden when custom answer is enabled) */}
                          {!newMCQ.HasCustomAnswer && (
                            <Box sx={{ mt: 3 }}>
                              <Box display="flex" alignItems="center">
                                {/* Choices Title */}
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                    fontWeight: "500",
                                    color: "#7E8CA0",
                                    marginRight: 2,
                                  }}
                                >
                                  {t("choices_label")}
                                </Typography>

                                <Divider
                                  orientation="vertical"
                                  flexItem
                                  sx={{ height: 30, marginRight: 2 }}
                                />

                                {/* Multiple Answer Switch */}
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={newMCQ.IsMultipleAnswer}
                                      onChange={handleSwitchChange(
                                        "IsMultipleAnswer"
                                      )}
                                    />
                                  }
                                  label={t("multiple_answer")}
                                  labelPlacement="start"
                                  sx={{
                                    marginRight: 4,
                                    fontWeight: "500",
                                    color: "#000",
                                  }}
                                />

                                {/* Answer With Image Switch */}
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={newMCQ.IsAnswerWithImage}
                                      onChange={handleSwitchChange(
                                        "IsAnswerWithImage"
                                      )}
                                    />
                                  }
                                  label={t("answer_with_image")}
                                  labelPlacement="start"
                                  sx={{
                                    fontWeight: "500",
                                    color: "#000",
                                  }}
                                />
                              </Box>

                              {/* List of Answer Options */}
                              {newMCQ.AnswerList.map((option, index) => (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "#FBFBFB",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    marginBottom: "10px",
                                  }}
                                >
                                  {/* Checkbox without label */}
                                  <Checkbox
                                    icon={<RadioButtonUnchecked />}
                                    checkedIcon={<CheckCircle />}
                                    sx={{
                                      color: "#BBBCC3",
                                      "&.Mui-checked": {
                                        color: "#3D54CD",
                                      },
                                    }}
                                    checked={option.isChecked || false}
                                    onChange={() => handleCheckboxChange(index)}
                                  />

                                  {/* TextField for Option Text */}
                                  <TextField
                                    margin="dense"
                                    label={`${t("Option")} ${index + 1}`}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={option.OptionText}
                                    onChange={(e) =>
                                      handleOptionChange(index, e.target.value)
                                    }
                                    style={{ backgroundColor: "#FBFBFB" }}
                                  />

                                  {/* Drag and Delete Icons */}
                                  <Box sx={{ display: "flex" }}>
                                    <IconButton>
                                      <DragIndicator />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => handleDeleteOption(index)}
                                    >
                                      <img src={deleteicon} alt="Delete" />
                                    </IconButton>
                                  </Box>
                                </div>
                              ))}

                              {/* Add Answer Button */}
                              <Button
                                variant="outlined"
                                sx={{
                                  mt: 2,
                                }}
                                onClick={handleAddOption}
                              > 
                                {t("add_answer")}
                              </Button>
                            </Box>
                          )}
                        </DialogContent>

                        {/* Dialog Actions */}
                        <DialogActions>
                          <Button
                            onClick={handleClose}
                            variant="outlined"
                            style={{ color: "#DC2626", borderColor: "#DC2626" }}
                          >
                            {t("cancel")}
                          </Button>
                          <Button
                            onClick={handleAddQuestion}
                            variant="contained"
                            style={{
                              backgroundColor: bgColor,
                              textTransform: "none",
                            }}
                          >
                            {t("add_question")}
                          </Button>
                        </DialogActions>
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>

            <GenerateMCQModal
              open={openAIModal}
              onClose={() => setOpenAIModal(false)}
              onSuccess={handleAISuccess}
              noOfMcqs={totalQuestionsRequired}
            />

            {/* Optionally, you can add more content here */}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TestMCQCreation;