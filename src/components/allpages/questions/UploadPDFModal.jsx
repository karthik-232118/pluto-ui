import { useState, useEffect } from "react";
import { Modal, Box, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";

const UploadPDFModal = ({ open, handleClose, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadType, setUploadType] = useState("pdf");
  const { t } = useTranslation();
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileError("");
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setFileError("Please select a file to upload.");
      return;
    }
    localStorage.removeItem("lang");
    localStorage.removeItem("bpmn_xml");
    localStorage.removeItem("bpmn_xml_icelandic");

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Single API call to /api/convert/
      const response = await fetch(import.meta.env.VITE_CONVERT_API_URL, {
        method: "POST",
        headers: {
          // 'accept': 'application/json', // Not needed for fetch, but can be added if required
          // 'Content-Type': 'multipart/form-data', // DO NOT set this header, browser will set it with boundary
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onUploadComplete && onUploadComplete(data);
        toast.success(t("File uploaded successfully"));
        resetFileState();
        handleClose(false);
      } else {
        alert("Failed to upload the file.");
        window.history.back(); // Go to previous page on failure
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during the upload.");
      window.history.back(); // Go to previous page on error
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // 🔹 Reset function to clear file selection
  const resetFileState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Clears the uploaded file upon modal close
  useEffect(() => {
    if (!open) {
      resetFileState();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="upload-pdf-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
          // position: "relative"
        }}
      >
        {/* Header Row */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon style={{ height: "17px", width: "20px" }} />
          </IconButton>
          <Typography
            variant="h6"
            component="h3"
            sx={{ fontWeight: 600, flexGrow: 1, textAlign: "start" }}
          >
            {t("uploadSopPdf")}
          </Typography>
        </Box>

        {/* Uploaded File Name */}
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 2, fontSize: "14px" }}
        >
          {selectedFile
            ? `${t("selectedFile")} ${selectedFile.name}`
            : "No file selected."}
        </Typography>

        {fileError && (
          <Typography color="error" sx={{ fontSize: "12px", mb: 2 }}>
            {fileError}
          </Typography>
        )}

        {/* File Input Section */}
        <Box
          sx={{
            backgroundColor: "#e6eefa",
            border: "2px dashed #D0D5DD",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            marginBottom: "16px",
            cursor: "pointer",
            transition: "0.3s ease",
            "&:hover": { backgroundColor: "#EFF3F8", borderColor: "#A0AEC0" },
          }}
        >
          <input
            type="file"
            accept={uploadType === "pdf" ? "application/pdf" : "text/plain"}
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              sx={{
                backgroundColor: bgColor,
                color: "#FFFFFF",
                textTransform: "none",
                fontWeight: "bold",
                padding: "10px 24px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: bgColor },
              }}
            >
              {t("browseFiles")}
            </Button>
          </label>
          <Typography variant="body2" sx={{ color: "#7B8794", mt: 2 }}>
            {t("dragDropInfo")}
          </Typography>
        </Box>

        {/* Upload Progress */}
        {isUploading && (
          <Box sx={{ width: "100%", mb: 2 }}>
            {/* <LinearProgress variant="determinate" value={uploadProgress} /> */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "center",
                  mt: 1,
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                {t("aiGenerating")}
              </Typography>
            </motion.div>
          </Box>
        )}

        {/* Actions: Upload, Clear, Cancel */}
        <Box display="flex" justifyContent="space-between" gap={2}>
          <Box>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isUploading}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="outlined"
              onClick={resetFileState}
              disabled={!selectedFile}
              sx={{ marginLeft: "1rem", borderColor: bgColor, color: bgColor }}
            >
              {t("clearFile")}
            </Button>
          </Box>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            sx={{
              backgroundColor: bgColor,
              "&:hover": { backgroundColor: bgColor },
            }}
          >
            {isUploading ? t("uploading") : t("upload")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadPDFModal;

UploadPDFModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onUploadComplete: PropTypes.func,
};
UploadPDFModal.defaultProps = {
  onUploadComplete: null,
};
