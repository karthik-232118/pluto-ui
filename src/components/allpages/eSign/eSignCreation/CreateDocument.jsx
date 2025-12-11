import { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { uploadPdf } from "../../../../services/eSign/ESignModule";
import { BASE_URL } from "../../../../config/urlConfig";
import notify from "../../../../assets/svg/utils/toast/Toast";
import { t } from "i18next";
import PropTypes from "prop-types";

function CreateDocument({ documentData, setDocumentData }) {
  const [isUploading, setIsUploading] = useState(false); // State for loader
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate input
    if (containsHtmlOrScript(value)) {
      setError("Invalid input: HTML or script tags are not allowed.");
    } else {
      setError(""); // Clear error message if input is valid
    }

    setDocumentData((prevData) => ({ ...prevData, [name]: value }));
  };

  const setDocumentFileData = (file, fileName, fileSize) => {
    const fileNameWithoutExtension = fileName.split(".")[0];
    const firstThreeChars = fileNameWithoutExtension.substring(0, 3);
    const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();
    const ReferenceNumber = firstThreeChars + randomDigits;

    setDocumentData((prevData) => ({
      ...prevData,
      DocumentName: fileNameWithoutExtension,
      ReferenceNumber: ReferenceNumber,
      file: file,
      fileSize: fileSize,
    }));
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file.size > 25 * 1024 * 1024) {
      alert("File size should not exceed 25MB.");
      return;
    }

    const fileName = file.name;
    const fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB"; // Convert bytes to MB

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadPdf(formData);
      if (response?.status === 200) {
        let file = response?.data?.data?.file;
        const baseUrl = BASE_URL.endsWith("/")
          ? BASE_URL.slice(0, -1)
          : BASE_URL;
        // file = `${baseUrl}${file.split("public")[1]}`;
        file = `${baseUrl}/${file}`;
        setDocumentFileData(file, fileName, fileSize);
        notify("success", t("File uploaded successfully") || response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      notify("error", "Error uploading PDF");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const containsHtmlOrScript = (value) => {
    const regex = /<.*?>/g; // Regex to detect any HTML tags
    return regex.test(value);
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #3f51b5",
          padding: 3,
          textAlign: "center",
          borderRadius: 2,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          transition: "background-color 0.3s",
          "&:hover": { backgroundColor: "#e3f2fd" },
        }}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <CircularProgress color="primary" />
        ) : documentData.DocumentName ? (
          <Box display="flex" alignItems="center" flexDirection="column">
            <InsertDriveFileIcon sx={{ fontSize: 60, color: "#d32f2f" }} />
            <Typography variant="h6" color="textSecondary" mt={1}>
              {documentData.DocumentName} ({documentData.fileSize})
            </Typography>
          </Box>
        ) : (
          <>
            <InsertDriveFileIcon
              sx={{ fontSize: 60, color: "#d32f2f", mb: 1 }}
            />
            <Typography variant="h6" color="textSecondary">
              {t("dragDrop")}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t("fileAcceptance")}
            </Typography>
          </>
        )}
      </Box>

      {documentData.file && (
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            <a
              href={documentData.file}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#3f51b5", textDecoration: "none" }}
            >
              {t("Click here to preview the document")}
            </a>
          </Typography>
        </Box>
      )}

      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("documentNameLabel")} // Translated label
            variant="outlined"
            fullWidth
            required
            id="DocumentName"
            name="DocumentName"
            value={documentData.DocumentName || ""}
            onChange={handleChange}
            placeholder={t("documentNamePlaceholder")} 
            InputLabelProps={{ shrink: true }}
            error={!!error} 
            helperText={error} 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("referenceNumber.label")} 
            variant="outlined"
            fullWidth
            required
            id="ReferenceNumber"
            name="ReferenceNumber"
            value={documentData.ReferenceNumber || ""}
            onChange={handleChange}
            placeholder={t("referenceNumber.placeholder")} 
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default CreateDocument;

CreateDocument.propTypes = {
  documentData: PropTypes.shape({
    DocumentName: PropTypes.string,
    ReferenceNumber: PropTypes.string,
    file: PropTypes.string,
    fileSize: PropTypes.string,
  }).isRequired,
  setDocumentData: PropTypes.func.isRequired,
};
