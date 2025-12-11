import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
  Checkbox,
  Button,
  Menu,
  ListItemIcon,
  TextField,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUploadTwoTone";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircle from "@mui/icons-material/CheckCircle";
import "./TestMCQCreation.css";
import threedoticon from "../../../assets/svg/TestMCQ/threedoticon.svg";
import deleteicon from "../../../assets/svg/TestMCQ/delete.svg";
import { Delete, EditAttributesRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const DraggableSection = ({
  mcqcreationlist,
  handleUpdateMcq,
  handleDeleteMcq,
}) => {
  const [questions, setQuestions] = useState([]);
  const { t } = useTranslation();
  // State to track the anchor element and selected QuestionID for each Menu
  const [menuState, setMenuState] = useState({
    anchorEl: null,
    selectedQuestionID: null,
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedData, setEditedData] = useState({
    QuestionText: "",
    QuestionHeading: "",
    AnswerList: [],
    IsMultipleAnswer: false,
    IsAnswerWithImage: false,
    IsRequired: false,
    QuestionImage: null,
  });

  console.log("MCQ Creation List:", mcqcreationlist);

  useEffect(() => {
    // Convert all boolean values to strings and ensure only correct options are selected
    const parsedQuestions = mcqcreationlist.map((question) => ({
      ...question,
      IsMultipleAnswer: String(question.IsMultipleAnswer), // Ensure string format
      IsAnswerWithImage: String(question.IsAnswerWithImage),
      IsRequired: String(question.IsRequired),
      AnswerList: question.AnswerList.map((answer) => ({
        ...answer,
        // Accept "true"/"false" (string) or boolean for IsCorrect
        IsCorrect:
          answer.IsCorrect === true || answer.IsCorrect === "true"
            ? "true"
            : "false",
        isChecked: answer.IsCorrect === true || answer.IsCorrect === "true",
      })),
    }));

    setQuestions(parsedQuestions);
  }, [mcqcreationlist]);

  const handleClick = (event, QuestionID) => {
    setMenuState({
      anchorEl: event.currentTarget,
      selectedQuestionID: QuestionID,
    });
  };

  const handleClose = () => {
    setMenuState({
      anchorEl: null,
      selectedQuestionID: null,
    });
  };

  const handleEditClick = (questionData) => {
    // Set editing state and load question data into form fields
    setEditingQuestion(questionData?.QuestionID);
    setEditedData({
      QuestionHeading: questionData?.QuestionHeading || "",
      QuestionText: questionData?.QuestionText || "",
      AnswerList:
        questionData?.AnswerList?.map((answer) => ({
          OptionText: answer.OptionText,
          // Use IsCorrect to set isChecked
          isChecked: answer.IsCorrect === true || answer.IsCorrect === "true",
        })) || [],
      IsMultipleAnswer: questionData.IsMultipleAnswer,
      IsAnswerWithImage: questionData.IsAnswerWithImage || false,
      IsRequired: questionData.IsRequired,
      QuestionImage: questionData.QuestionImage || null,
    });
    handleClose(); // Close the menu after selecting "Edit"
  };

  const handleImageUpdate = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({
          ...prev,
          QuestionImage: reader.result,
        }));
        // Update the parent component with new image
        handleUpdateMcq(
          { ...editedData, QuestionImage: reader.result },
          editingQuestion
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };
  const handleUpdateClick = (QuestionID) => {
    // Check that at least one option is marked as correct
    const hasCorrectOption = editedData.AnswerList.some(
      (option) => option.isChecked
    );
    if (!hasCorrectOption) {
      alert("Please select at least one correct answer before updating.");
      return;
    }

    const updatedQuestionData = {
      ...editedData,
      AnswerList: editedData.AnswerList.map((option) => ({
        OptionText: option.OptionText,
        // Always send as "true"/"false" string for consistency
        IsCorrect: option.isChecked ? "true" : "false",
      })),
    };

    handleUpdateMcq(updatedQuestionData, QuestionID);
    setEditingQuestion(null);
  };

  const handleCancelEdit = () => {
    // Exit editing mode and discard changes
    setEditingQuestion(null);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...editedData.AnswerList];
    updatedOptions[index].OptionText = value; // Update option text
    setEditedData({ ...editedData, AnswerList: updatedOptions });
    console.log("Updated Options after text change:", updatedOptions);
  };

  const handleCheckboxChange = (index) => {
    const updatedOptions = editedData.AnswerList.map((option, idx) => {
      if (editedData.IsMultipleAnswer) {
        // Toggle selection if multiple answers are allowed
        return idx === index
          ? { ...option, isChecked: !option.isChecked }
          : option;
      } else {
        // If only one answer is allowed, deselect all others
        return {
          ...option,
          isChecked: idx === index, // Only the selected option will be checked
        };
      }
    });
    setEditedData({ ...editedData, AnswerList: updatedOptions });
  };

  const handleAddOption = () => {
    if (editedData.AnswerList.length < 10) {
      const newOptions = [
        ...editedData.AnswerList,
        { OptionText: "", isChecked: false },
      ];
      setEditedData({ ...editedData, AnswerList: newOptions });
      handleUpdateMcq(
        { ...editedData, AnswerList: newOptions },
        editingQuestion
      );
    } else {
      console.log("Maximum of 10 options allowed.");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = editedData.AnswerList.filter(
      (_, idx) => idx !== index
    );
    setEditedData({ ...editedData, AnswerList: updatedOptions });
    handleUpdateMcq(
      { ...editedData, AnswerList: updatedOptions },
      editingQuestion
    );
  };

  const handleSwitchChange = (name) => (event) => {
    setEditedData({
      ...editedData,
      [name]: event.target.checked,
    });
  };
  const renderOptions = (answerList, isEditing) => {
    // Log all options with their status (true/false)
    console.log("Options and their statuses:");
    answerList.forEach((option, idx) => {
      console.log(
        `${t("Option")} ${idx + 1}: "${option.OptionText}" - ${
          option.isChecked ? "True" : "False"
        }`
      );
    });

    return (
      <>
        {answerList.map((option, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
              backgroundColor: "#F2F1F1",
              p: 1,
              borderRadius: "4px",
            }}
          >
            {isEditing ? (
              <>
                <Checkbox
                  icon={<RadioButtonUnchecked />}
                  checkedIcon={<CheckCircle />}
                  checked={editedData.AnswerList[idx]?.isChecked || false}
                  onChange={() => handleCheckboxChange(idx)}
                  sx={{
                    color: "#BBBCC3",
                    "&.Mui-checked": { color: "#3D54CD" },
                  }}
                />
                <TextField
                  value={editedData.AnswerList[idx]?.OptionText || ""}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <IconButton onClick={() => handleDeleteOption(idx)}>
                  <img src={deleteicon} alt="delete" />
                </IconButton>
              </>
            ) : (
              <Typography>
                <Checkbox
                  icon={<RadioButtonUnchecked />}
                  checkedIcon={<CheckCircle />}
                  checked={option.isChecked || false}
                  sx={{
                    color: "#BBBCC3",
                    "&.Mui-checked": { color: "#3D54CD" },
                  }}
                  disabled
                />
                {option.OptionText}
              </Typography>
            )}
          </Box>
        ))}
        {isEditing && answerList.length < 10 && (
          <Button onClick={handleAddOption} sx={{ mt: 2 }} variant="outlined">
            + {t("add")} {t("Option")}
          </Button>
        )}
      </>
    );
  };

  return (
    <Box>
      {questions?.map((questionData) => {
        const { QuestionText, QuestionHeading, AnswerList, QuestionID } =
          questionData;
        const isEditing = editingQuestion === QuestionID;

        return (
          <Box
            key={QuestionID}
            sx={{
              position: "relative",
              alignItems: "center",
              mb: 4,
              backgroundColor: "#FBFBFB",
              padding: 2,
              borderRadius: "8px",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ color: "#fff" }}
            >
              <Typography
                variant="subtitle1"
                sx={{ color: "#333", fontWeight: "500" }}
              >
                {t("multiple_choice")}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography
                  sx={{ marginRight: 1, color: "#3B82F6", fontWeight: "450" }}
                >
                  {t("required")}
                </Typography>
                <Switch
                  checked={questionData.IsRequired}
                  onChange={
                    isEditing ? handleSwitchChange("IsRequired") : () => {} // disable change if not editing
                  }
                  disabled={!isEditing}
                />
                <IconButton onClick={(e) => handleClick(e, QuestionID)}>
                  <img src={threedoticon} alt="options" />
                </IconButton>

                <Menu
                  anchorEl={menuState.anchorEl}
                  open={menuState.selectedQuestionID === QuestionID}
                  onClose={handleClose}
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
                  <MenuItem onClick={() => handleDeleteMcq(QuestionID)}>
                    <ListItemIcon>
                      <Delete />
                    </ListItemIcon>
                    <Typography variant="body2">{t("delete")}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleEditClick(questionData)}>
                    <ListItemIcon>
                      <EditAttributesRounded />
                    </ListItemIcon>
                    <Typography variant="body2">{t("edit")}</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            {isEditing ? (
              <TextField
                fullWidth
                variant="outlined"
                name="QuestionHeading"
                value={editedData.QuestionHeading}
                onChange={handleInputChange}
                label="Edit Question Heading"
              />
            ) : (
              <Typography style={{ fontWeight: "500" }}>
                {QuestionHeading} <span style={{ color: "red" }}>*</span>
              </Typography>
            )}
            <Grid sx={{ mt: 2 }} container>
              <Grid item xs={9}>
                <Box
                  sx={{
                    backgroundColor: "#F2F1F1",
                    height: "160px",
                    borderRadius: "8px",
                    p: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#333" }}>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="QuestionText"
                        value={editedData.QuestionText}
                        onChange={handleInputChange}
                      />
                    ) : (
                      QuestionText
                    )}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {isEditing ? (
                    <>
                      {editedData.QuestionImage ? (
                        <img
                          src={editedData.QuestionImage}
                          alt="Question"
                          style={{
                            width: "200px",
                            height: "160px",
                            borderRadius: "8px",
                            marginBottom: "10px",
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: "#7E8CA0", mb: 2 }}
                        >
                          No Image Available
                        </Typography>
                      )}
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadIcon />}
                      >
                        {t("update_image")}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleImageUpdate}
                        />
                      </Button>
                    </>
                  ) : questionData.QuestionImage ? (
                    <img
                      src={questionData.QuestionImage}
                      alt="Question"
                      style={{
                        width: "200px",
                        height: "160px",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: "#7E8CA0" }}>
                      {t("no_image_available")}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Box display="flex" alignItems="center">
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={questionData.IsMultipleAnswer}
                      onChange={
                        isEditing
                          ? handleSwitchChange("IsMultipleAnswer")
                          : () => {} // disable change if not editing
                      }
                      disabled={!isEditing}
                    />
                  }
                  label={t("multiple_answer")}
                  labelPlacement="start"
                  sx={{
                    marginRight: 4,
                    fontWeight: "500",
                    colo: "#000",
                  }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedData.IsAnswerWithImage}
                      onChange={handleSwitchChange("IsAnswerWithImage")}
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
            </Box>

            <Grid container sx={{ mt: 2 }}>
              <Grid item xs={12}>
                {renderOptions(AnswerList, isEditing)}
              </Grid>
            </Grid>
            {isEditing && (
              <Box display="flex" gap={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => handleUpdateClick(QuestionID)}
                  disabled={
                    !editedData.AnswerList.some((option) => option.isChecked)
                  }
                >
                  {t("Update")}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
                  color="error"
                >
                  {t("cancel")}
                </Button>
              </Box>
            )}

            <Box>
              <Divider sx={{ mt: 3 }} />
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2}
            ></Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default DraggableSection;

DraggableSection.propTypes = {
  mcqcreationlist: PropTypes.array.isRequired,
  handleUpdateMcq: PropTypes.func.isRequired,
  handleDeleteMcq: PropTypes.func.isRequired,
};
DraggableSection.defaultProps = {
  mcqcreationlist: [],
  handleUpdateMcq: () => {},
  handleDeleteMcq: () => {},
};
