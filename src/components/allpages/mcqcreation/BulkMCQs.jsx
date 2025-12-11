import { useState } from "react";
import { Box, Button, Typography, Card } from "@mui/material";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import DragAndDrop from "./DragAndDrop";
import notify from "../../../assets/svg/utils/toast/Toast";
import { bulkTestMcqsUpload } from "../../../services/testMcqModules/TestMcqModules";
import { useDispatch } from "react-redux";
import { setRequestBody } from "../../../store/BulkMCQS/testMcqSlice";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";

const BulkMCQs = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [mcqData, setMcqData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [setSnackbarMessages] = useState([]);
  const [BulkError, SetBulkError] = useState([]);
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;

  const validateBulkData = (questions) => {
    const errors = [];

    questions.forEach((question, qIndex) => {
      const questionNumber = qIndex + 1;

      if (!question.QuestionHeading || !question.QuestionHeading.trim()) {
        errors.push(
          `Question ${questionNumber}: Question Heading is required.`
        );
      }

      // Check if text is empty
      if (!question.QuestionText || !question.QuestionText.trim()) {
        errors.push(`Question ${questionNumber}: Question Text is required.`);
      }

      // Check for at least one answer
      if (!question.AnswerList || question.AnswerList.length === 0) {
        errors.push(
          `Question ${questionNumber}: Must have at least one answer.`
        );
      } else {
        // Validate each answer’s text
        question.AnswerList.forEach((ans, aIndex) => {
          const answerNumber = aIndex + 1;
          if (!ans.OptionText || !ans.OptionText.trim()) {
            errors.push(
              `Question ${questionNumber}, Answer ${answerNumber}: Option Text is required.`
            );
          }
        });
      }
    });

    return errors;
  };

  function sortQuestionsByNumber(inputArray) {
    const grouped = inputArray.reduce((acc, item) => {
      const match = item.match(/Question (\d+)/);
      if (match) {
        const questionNumber = match[1];
        if (!acc[questionNumber]) acc[questionNumber] = [];
        acc[questionNumber].push(item);
      }
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => a - b)
      .flatMap((key) => grouped[key]);
  }

  const handleFileUpload = (file) => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const validExtensions = [".xlsx", ".xls"];
    const validMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (
      !validExtensions.some((ext) => file.name.endsWith(ext)) ||
      !validMimeTypes.includes(file.type)
    ) {
      notify("error", "Please upload a valid Excel file.");
      setFileError("Invalid file type.");
      return;
    }

    setUploadedFile(file); // Track the uploaded file

    setUploadedFile(file); // Track the uploaded file

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const transformedData = jsonData.map((mcq) => ({
          QuestionHeading: mcq.QuestionHeading,
          QuestionText: mcq.QuestionText,
          AnswerList: [
            {
              OptionText: mcq.OptionA || "",
              IsCorrect: mcq.IsCorrectA || false,
            },
            {
              OptionText: mcq.OptionB || "",
              IsCorrect: mcq.IsCorrectB || false,
            },
            {
              OptionText: mcq.OptionC || "",
              IsCorrect: mcq.IsCorrectC || false,
            },
            {
              OptionText: mcq.OptionD || "",
              IsCorrect: mcq.IsCorrectD || false,
            },
          ],
          IsMultipleAnswer: mcq.IsMultipleAnswer || false,
          IsAnswerWithImage: mcq.IsAnswerWithImage || false,
          IsRequired: mcq.IsRequired || false,
          SubjectName: mcq.SubjectName,
          TopicName: mcq.TopicName,
        }));

        setMcqData(transformedData);
        setSuccess(true);
        notify("success", "MCQs data imported successfully.");
      } catch (error) {
        console.error("Error reading Excel file:", error);
        notify("error", "Failed to read the Excel file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExportMCQs = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sample MCQs");

      worksheet.columns = [
        { header: "QuestionHeading", key: "QuestionHeading", width: 25 },
        { header: "QuestionText", key: "QuestionText", width: 30 },
        { header: "OptionA", key: "OptionA", width: 15 },
        { header: "IsCorrectA", key: "IsCorrectA", width: 15 },
        { header: "OptionB", key: "OptionB", width: 15 },
        { header: "IsCorrectB", key: "IsCorrectB", width: 15 },
        { header: "OptionC", key: "OptionC", width: 15 },
        { header: "IsCorrectC", key: "IsCorrectC", width: 15 },
        { header: "OptionD", key: "OptionD", width: 15 },
        { header: "IsCorrectD", key: "IsCorrectD", width: 15 },
        { header: "IsMultipleAnswer", key: "IsMultipleAnswer", width: 18 },
        { header: "IsAnswerWithImage", key: "IsAnswerWithImage", width: 18 },
        { header: "IsRequired", key: "IsRequired", width: 12 },
        { header: "SubjectName", key: "SubjectName", width: 15 },
        { header: "TopicName", key: "TopicName", width: 15 },
      ];

      // Create an array of 4 sample rows
      const sampleRows = [
        {
          QuestionHeading: "Heading for Question 1",
          QuestionText: "Sample question text #1?",
          OptionA: "Option A",
          IsCorrectA: true,
          OptionB: "Option B",
          IsCorrectB: false,
          OptionC: "Option C",
          IsCorrectC: false,
          OptionD: "Option D",
          IsCorrectD: false,
          IsMultipleAnswer: false,
          IsAnswerWithImage: false,
          IsRequired: true,
          SubjectName: "Mathematics",
          TopicName: "Algebra",
        },
        {
          QuestionHeading: "Heading for Question 2",
          QuestionText: "Sample question text #2?",
          OptionA: "Option A",
          IsCorrectA: false,
          OptionB: "Option B",
          IsCorrectB: true,
          OptionC: "Option C",
          IsCorrectC: false,
          OptionD: "Option D",
          IsCorrectD: false,
          IsMultipleAnswer: false,
          IsAnswerWithImage: false,
          IsRequired: true,
          SubjectName: "Geography",
          TopicName: "Europe",
        },
        {
          QuestionHeading: "Heading for Question 3",
          QuestionText: "Sample question text #3?",
          OptionA: "Option A",
          IsCorrectA: false,
          OptionB: "Option B",
          IsCorrectB: false,
          OptionC: "Option C",
          IsCorrectC: true,
          OptionD: "Option D",
          IsCorrectD: false,
          IsMultipleAnswer: false,
          IsAnswerWithImage: false,
          IsRequired: true,
          SubjectName: "Computer Science",
          TopicName: "Programming",
        },
        {
          QuestionHeading: "Heading for Question 4",
          QuestionText: "Sample question text #4?",
          OptionA: "Option A",
          IsCorrectA: false,
          OptionB: "Option B",
          IsCorrectB: false,
          OptionC: "Option C",
          IsCorrectC: false,
          OptionD: "Option D",
          IsCorrectD: true,
          IsMultipleAnswer: true, // Example of multi-answer
          IsAnswerWithImage: false,
          IsRequired: true,
          SubjectName: "Mathematics",
          TopicName: "Geometry",
        },
      ];

      // Add all sample rows to the worksheet
      sampleRows.forEach((row) => {
        worksheet.addRow(row);
      });

      // Create a downloadable file (browser-friendly)
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Sample_MCQ.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting sample MCQs:", error);
      notify("error", "Failed to export sample MCQs.");
    }
  };

  // ==============================
  // 5) Handle Upload
  // ==============================
  const handleUpload = async () => {
    if (!uploadedFile) {
      notify("error", "Please upload a file before submitting.");
      return;
    }

    if (!uploadedFile) {
      notify("error", "Please upload a file before submitting.");
      return;
    }

    try {
      // A) Validate the data
      const validationErrors = validateBulkData(mcqData);

      if (validationErrors.length > 0) {
        const sortedErrors = sortQuestionsByNumber(validationErrors);
        SetBulkError(sortedErrors);
        setSnackbarMessages(sortedErrors);
        return;
      }

      // B) Build requestBody
      const requestBody = {
        QuestionList: mcqData.map((question) => ({
          QuestionHeading: question?.QuestionHeading,
          QuestionText: question?.QuestionText,
          AnswerList: question?.AnswerList?.map((answer) => ({
            OptionText: answer?.OptionText,
            IsCorrect:
              answer?.IsCorrect !== undefined
                ? String(answer.IsCorrect) // Convert to string
                : String(answer.isChecked || "false"), // Ensure this is also a string
          })),
          IsMultipleAnswer: question?.IsMultipleAnswer || false,
          IsRequired: question?.IsRequired || false,
        })),
      };

      // Dispatch the data
      dispatch(setRequestBody(requestBody));

      // Optional: Upload to server

      // Dispatch the data
      dispatch(setRequestBody(requestBody));

      // Optional: Upload to server
      const response = await bulkTestMcqsUpload(requestBody);
      if (response?.status === 201) {
        notify("success", "MCQs uploaded successfully.");
        setSuccess(true);
        navigate("/TestMCQCreation");
      } else {
        notify("error", "Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      notify("error", "An unexpected error occurred.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Card>
        {/* Top Section */}
        <Box
          sx={{
            m: 2,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ width: "100%", md: "auto" }}>
            <Typography variant="h6" sx={{ mb: "1rem" }}>
              {t("bulkMCQsManagement")}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: "1rem" }}>
              {t("manageInstructions")}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mb: "1rem" }}
            >
              {t("instruction", { returnObjects: true }).map(
                (instruction, index) => (
                  <div key={index}>{instruction}</div>
                )
              )}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "10px", mt: { xs: 2, md: 0 } }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: bgColor,
                textTransform: "none",
                borderRadius: "8px",
              }}
              onClick={handleExportMCQs}
            >
              {t("download_sample")}
            </Button>
          </Box>
        </Box>

        {/* Drag & Drop for file upload */}
        <Box sx={{ width: "100%", padding: "1rem", mt: "2rem" }}>
          <DragAndDrop
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            setFileError={setFileError}
            handleFileUpload={handleFileUpload}
            title={t("browse")}
            resolution={t("recommendedResolution")}
            filetype={t("recommendedFileType")}
          />
        </Box>

        {/* File Error or Success Notification */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
            gap: "10px",
          }}
        >
          {success && null}
          {fileError && (
            <Box
              sx={{
                background: "#FFE9DA",
                padding: "16px",
                gap: "6px",
                borderRadius: "8px",
                border: "1px solid #D9AA8A",
              }}
            >
              <Typography variant="body1" color="error">
                {fileError}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Show Validation/Server Errors */}
        <div style={{ padding: "1rem", marginLeft: "2rem" }}>
          {(Array.isArray(BulkError) ? BulkError : []).map((err, idx) => (
            <p style={{ color: "red", margin: "4px 0" }} key={idx}>
              • {err}
            </p>
          ))}
        </div>

        {/* Upload Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            gap: "10px",
            p: "1rem",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: bgColor,
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleUpload}
            disabled={!uploadedFile} // Disable if no file is selected
          >
            {t("uploadMCQsButton")}
          </Button>
        </Box>
      </Card>
    </div>
  );
};

export default BulkMCQs;
