// src/components/BulkMCQs/DragAndDrop.js

import { Card, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const DragAndDrop = ({
 
  setUploadedFile,
  handleFileUpload,
  setFileError,
  resolution,
  title,
  filetype,
}) => {
  const { t } = useTranslation();
  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      handleFileUpload(file);
    },
    onDropRejected: (rejectedFiles) => {
      const error = rejectedFiles[0].errors[0];
      if (error.code === "file-too-large") {
        setFileError(`File is larger than 15 MB`);
      } else {
        setFileError(error.message);
      }
    },
    noClick: true,
    noKeyboard: true,
    maxSize: 15 * 1024 * 1024, // 15 MB
  });

  return (
    <div>
      <Card
        className="upload-card"
        sx={{ backgroundColor: "#f0f0f0", cursor: "pointer", padding: "20px" }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div style={{ textAlign: "center" }}>
        
          <div
            className="d-flex"
            style={{
              justifyContent: "center",
              gap: "1rem",
              marginTop: "10px",
            }}
          >
            <Typography
              variant="body1"
              component="p"
              className="upload-card-text"
              onClick={openFileDialog}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              component="p"
              style={{ color: "#64748B" }}
              onClick={openFileDialog}
            >
              {t("or_drag_and_drop")}
            </Typography>
          </div>
          <Typography
            variant="body2"
            component="p"
            style={{ color: "#64748B", marginTop: "10px" }}
            onClick={openFileDialog}
          >
            {resolution}
          </Typography>
          <Typography
            variant="body2"
            component="p"
            style={{ color: "#64748B" }}
            onClick={openFileDialog}
          >
            {filetype}
          </Typography>
        </div>
      </Card>
    </div>
  );
};

export default DragAndDrop;

DragAndDrop.propTypes = {
  uploadedFile: PropTypes.object,
  setUploadedFile: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  setFileError: PropTypes.func.isRequired,
  resolution: PropTypes.string,
  title: PropTypes.string,
  filetype: PropTypes.string,
};
