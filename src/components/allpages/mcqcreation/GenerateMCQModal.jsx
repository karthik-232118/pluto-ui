import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  styled,
  CircularProgress,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
  },
});

const ContentBox = styled(Box)({
  padding: "32px",
  "& .MuiTypography-body1": {
    color: "#4B5563",
    fontSize: "15px",
    lineHeight: "1.6",
  },
});

const UploadArea = styled(Box)({
  border: "2px dashed #E5E7EB",
  borderRadius: "12px",
  padding: "40px 32px",
  textAlign: "center",
  marginTop: "24px",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#3B82F6",
    backgroundColor: "#F8FAFC",
  },
});

const GenerateMCQModal = ({ open, onClose, onSuccess,noOfMcqs }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const { t } = useTranslation();
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;

  const HeaderBox = styled(Box)({
    backgroundColor: bgColor,
    color: "white",
    padding: "24px",
    position: "relative",
    minHeight: "30px",
  });

  const handleFileChange = (event) => {
    if (isGenerating) return;

    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      simulateUpload(file);
    } else {
      toast.error("Please upload a valid PDF file");
      setPdfFile(null);
    }
  };

  const simulateUpload = (file) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDragOver = (e) => {
    if (isGenerating) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    if (isGenerating) return;
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      simulateUpload(file);
    }
  };

  const handleGenerate = async () => {
    if (!pdfFile) {
      toast.error("Please upload a PDF file first");
      return;
    }
    if (!noOfMcqs || isNaN(noOfMcqs) || noOfMcqs <= 0) {
      toast.error("Please enter a valid number of MCQs");
      return;
    }

    try {
      setIsGenerating(true);

      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("no_of_mcqs", noOfMcqs);

      const response = await fetch(
       process.env.GPT_API_KEY,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result.error || result.message || "Failed to generate MCQs";
        throw new Error(errorMessage);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("MCQs generated successfully!");
      onSuccess(result?.data); // Send the response data back to parent
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error generating MCQs:", error);
      toast.error(
        error.message || "Failed to generate MCQs. Please try again.",
        {
          autoClose: 5000,
        }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModalClose = () => {
    if (!isGenerating) {
      onClose();
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleModalClose}
      fullWidth
      maxWidth="sm"
    >
      {/* Header with blue background */}
      <HeaderBox>
        <DialogTitle
          sx={{
            color: "white",
            padding: 0,
            fontSize: "22px",
            fontWeight: 600,
            lineHeight: "1.3",
          }}
        >
          {t("AIModalTitle")}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleModalClose}
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            color: "white",
            padding: "16px",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
          size="large"
          disabled={isGenerating}
        >
          <CloseIcon fontSize="medium" />
        </IconButton>
      </HeaderBox>

      <DialogContent sx={{ padding: 0 }}>
        <ContentBox>
          <Typography variant="body1" gutterBottom>
            {t("AIModalDescription")}
          </Typography>

          <UploadArea
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              borderColor: isDragging ? bgColor : "#E5E7EB",
              backgroundColor: isDragging ? "#F8FAFC" : "transparent",
              opacity: isGenerating ? 0.6 : 1,
              pointerEvents: isGenerating ? "none" : "auto",
            }}
          >
            <input
              accept="application/pdf"
              style={{ display: "none" }}
              id="pdf-upload"
              type="file"
              onChange={handleFileChange}
              disabled={isGenerating}
            />
            <label htmlFor="pdf-upload">
              <Button
                variant="outlined"
                component="span"
                disabled={isGenerating}
                sx={{
                  textTransform: "none",
                  marginBottom: "12px",
                  padding: "8px 24px",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
                startIcon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
                      stroke={isGenerating ? "#9CA3AF" : bgColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 8L12 3L7 8"
                      stroke={isGenerating ? "#9CA3AF" : bgColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 3V15"
                      stroke={isGenerating ? "#9CA3AF" : bgColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                {t("SelectPDFButton")}
              </Button>
            </label>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontSize: "14px" }}
            >
              {pdfFile
                ? `Selected: ${pdfFile.name}`
                : "Or drag and drop your PDF here"}
            </Typography>
            {pdfFile && (
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
                mt={1}
                sx={{ fontSize: "12px" }}
              >
                {t("FileSizeLabel")} {(pdfFile.size / 1024 / 1024).toFixed(2)}{" "}
                MB
              </Typography>
            )}
            {pdfFile && uploadProgress < 100 && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  {t("UploadingLabel")} {uploadProgress}%
                </Typography>
                <Box
                  sx={{
                    height: 4,
                    width: "100%",
                    bgcolor: "#E5E7EB",
                    borderRadius: 2,
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${uploadProgress}%`,
                      bgcolor: bgColor,
                      borderRadius: 2,
                      transition: "width 0.3s ease-in-out",
                    }}
                  />
                </Box>
              </Box>
            )}
          </UploadArea>

         

          {/* {apiResponse && (
            <Box
              mt={3}
              p={2}
              sx={{
                backgroundColor: "#F8FAFC",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontSize: "16px" }}>
                API Response:
              </Typography>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  fontSize: "14px",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </Box>
          )} */}
        </ContentBox>
      </DialogContent>

      <DialogActions
        sx={{ padding: "16px 24px", borderTop: "1px solid #F3F4F6" }}
      >
        <Button
          onClick={handleModalClose}
          disabled={isGenerating}
          sx={{
            textTransform: "none",
            // color: "#6B7280",
            fontWeight: 500,
            fontSize: "15px",
            padding: "8px 16px",
            borderRadius: "8px",
            // "&:hover": {
            //   backgroundColor: "#F3F4F6",
            // },
            // "&:disabled": {
            //   color: "#9CA3AF",
            // },
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={handleGenerate}
          variant="contained"
          disabled={!pdfFile || isGenerating}
          sx={{
            // backgroundColor: bgColor,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "15px",
            padding: "8px 24px",
            borderRadius: "8px",
            boxShadow: "none",
            // "&:hover": {
            //   backgroundColor: bgColor,
            //   boxShadow: "none",
            // },
            // "&:disabled": {
            //   backgroundColor: "#E5E7EB",
            //   color: "#9CA3AF",
            // },
          }}
        >
          {isGenerating ? (
            <>
              <CircularProgress size={20} sx={{ color: "#9CA3AF", mr: 1 }} />
              {t("GeneratingLabel")}
            </>
          ) : (
            t("GenerateMCQsButton")
          )}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default GenerateMCQModal;
