// src/components/modals/BulkSkillAssessmentModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  LinearProgress,
  Alert,
} from "@mui/material";
import { Download, Close, CloudUpload } from "@mui/icons-material";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";

const BulkSkillAssessmentModal = ({ open, onClose }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [zipFile, setZipFile] = useState(null);
  const [zipFileName, setZipFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [requirementsError, setRequirementsError] = useState(false);
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;

  const { t } = useTranslation();
  // Sample data for Excel sheet
  const sampleData = [
    {
      "Test Name": "Sample Assessment Test",
      Description: "This is a sample test description",
      Owners: "owner1@example.com, owner2@example.com",
      "Test Tags": "assessment, test, skill",
      Duration: "30", // in minutes
      "Passing Score": "70", // percentage
      "Test Expiry Date": "2023-12-31",
      Questions: "question1, question2, question3", // or could be separate columns
    },
    ...Array(4).fill({
      "Test Name": "",
      Description: "",
      Owners: "",
      "Test Tags": "",
      Duration: "",
      "Passing Score": "",
      "Test Expiry Date": "",
      Questions: "",
    }),
  ];

  const downloadSample = () => {
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Skill Assessments");
    XLSX.writeFile(wb, "Skill_Assessment_Template.xlsx");
  };

  const handleExcelFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setError(null);
      } else {
        setError("Invalid file type. Please upload an XLSX or XLS file.");
      }
    }
  };

  const handleZipFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/zip" ||
        selectedFile.name.endsWith(".zip")
      ) {
        setZipFile(selectedFile);
        setZipFileName(selectedFile.name);
        setError(null);
      } else {
        setError("Invalid file type. Please upload a ZIP file.");
      }
    }
  };

  const REQUIRED_COLUMNS = [
    "Test Name",
    "Description",
    "Owners",
    "Test Tags",
    "Duration",
    "Passing Score",
    "Test Expiry Date",
    "Questions",
  ];

  function validateExcelData(jsonData) {
    if (!Array.isArray(jsonData) || jsonData.length === 0) return false;
    const firstRow = jsonData[0];
    return REQUIRED_COLUMNS.every((col) => Object.keys(firstRow).includes(col));
  }

  const handleUpload = async () => {
    if (!file && !zipFile) {
      setError("Please select a file to upload.");
      return;
    }

    // Check file size (max 5MB)
    const uploadFile = file || zipFile;
    if (uploadFile.size > 5 * 1024 * 1024) {
      setError("Maximum file size allowed is 5MB.");
      setRequirementsError(true);
      return;
    }

    setIsUploading(true);
    setSuccess(false);
    setError(null);
    setRequirementsError(false);

    try {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          // Validate columns
          if (!validateExcelData(jsonData)) {
            setError(null);
            setRequirementsError(true);
            setIsUploading(false);
            return;
          }

          // Simulate API call
          setTimeout(() => {
            console.log("Parsed data:", jsonData);
            setIsUploading(false);
            setSuccess(true);
            setTimeout(() => {
              onClose();
              setSuccess(false);
              setFile(null);
              setFileName("");
            }, 1500);
          }, 2000);
        };
        reader.readAsArrayBuffer(file);
      } else if (zipFile) {
        // Simulate ZIP upload (replace with actual logic if needed)
        setTimeout(() => {
          console.log("ZIP file uploaded:", zipFileName);
          setIsUploading(false);
          setSuccess(true);
          setTimeout(() => {
            onClose();
            setSuccess(false);
            setZipFile(null);
            setZipFileName("");
          }, 1500);
        }, 2000);
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: bgColor,
          color: "white",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          justifyContent="space-between"
        >
          <Typography variant="h6" fontWeight="500">
            {t("bulkUploadTitle")}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Download />}
              onClick={downloadSample}
              sx={{ mr: 2 }}
            >
              {t("downloadTemplate")}
            </Button>
            <Tooltip title="Close">
              <IconButton onClick={onClose} sx={{ color: "white" }}>
                <Close />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers={false}>
        {isUploading && <LinearProgress sx={{ mb: 2 }} />}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {requirementsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {t("errorMessage")}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t("successMessage")}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <CloudUpload color={bgColor} sx={{ mr: 1, fontSize: 30 }} />
            <Typography variant="h6" fontWeight="medium">
              {t("uploadYourFile")}
            </Typography>
          </Box>

          {/* Excel Upload Option */}
          <Box
            sx={{
              border: "2px dashed",
              borderColor: bgColor,
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              mb: 2,
              bgcolor: "action.hover",
            }}
          >
            <input
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              id="excel-upload-file"
              type="file"
              onChange={handleExcelFileChange}
              disabled={isUploading}
            />
            <label htmlFor="excel-upload-file">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUpload />}
                disabled={isUploading}
                size="large"
                sx={{
                  backgroundColor: bgColor,
                }}
              >
                {t("chooseExcelFile")}
              </Button>
            </label>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              {t("excelHint")}
            </Typography>
            {fileName && (
              <Chip
                label={fileName}
                onDelete={() => {
                  setFile(null);
                  setFileName("");
                }}
                sx={{ mt: 2 }}
                deleteIcon={<Close />}
              />
            )}
          </Box>

          {/* ZIP Upload Option */}
          <Box
            sx={{
              border: "2px dashed",
              borderColor: bgColor,
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              mb: 2,
              bgcolor: "action.hover",
            }}
          >
            <input
              accept=".zip"
              style={{ display: "none" }}
              id="zip-upload-file"
              type="file"
              onChange={handleZipFileChange}
              disabled={isUploading}
            />
            <label htmlFor="zip-upload-file">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUpload />}
                disabled={isUploading}
                size="large"
                sx={{
                  backgroundColor: bgColor,
                }}
              >
                {t("chooseZipFile")}
              </Button>
            </label>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              {t("zipHint")}
            </Typography>
            {zipFileName && (
              <Chip
                label={zipFileName}
                onDelete={() => {
                  setZipFile(null);
                  setZipFileName("");
                }}
                sx={{ mt: 2 }}
                deleteIcon={<Close />}
              />
            )}
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            borderColor: "#000000",
            color: "#000000",
            "&:hover": {
              borderColor: "#000000",
              color: "#000000",
              backgroundColor: "#f5f5f5",
            },
          }}
          variant="outlined"
          disabled={isUploading}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!(file || zipFile) || isUploading}
          startIcon={isUploading ? null : <CloudUpload />}
        >
          {isUploading ? t("uploading") : t("upload")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkSkillAssessmentModal;
