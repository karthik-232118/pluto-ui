import { Card, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import uploadeimage from "../../../assets/svg/newdoc/uploadeimage.svg";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const DragandDropcustomzie = ({
  
  setUploadedFile,
  setFileError,
  resolution,
  title,
  filetype,
}) => {
  const {t}=useTranslation();
  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
  } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
    },
    maxSize: 15 * 1024 * 1024, // Max size set to 15 MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
          if (img.width > 1300 || img.height > 200) {
            console.log(img.width, img.height ,"imageee"); 
            setFileError("Image dimensions must be 1300*200 pixels.");
            setUploadedFile(null); // Reset image if dimensions are incorrect
          } else {
            setFileError(""); // Reset error message
            setUploadedFile(file); // Set the uploaded file
          }
        };

        img.onerror = () => {
          setFileError("Error loading image.");
        };
      }
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
  });

  return (
    <div>
      <Card
        className="upload-card"
        sx={{ backgroundColor: "#f0f0f0", cursor: "pointer" }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div style={{ textAlign: "center" }}>
          <img
            src={uploadeimage}
            alt="uploadeimage"
            onClick={openFileDialog}
            style={{ height: "40px", width: "40px" }}
          />
          <div
            className="d-flex"
            style={{
              justifyContent: "center",
              gap: "1rem",
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
            style={{ color: "#64748B" }}
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

export default DragandDropcustomzie;

DragandDropcustomzie.propTypes = {
  uploadedFile: PropTypes.object,
  setUploadedFile: PropTypes.func.isRequired,
  setFileError: PropTypes.func.isRequired,
  resolution: PropTypes.string,
  title: PropTypes.string,
  filetype: PropTypes.string,
};
DragandDropcustomzie.defaultProps = {
  uploadedFile: null,
  resolution: "1300*200 pixels",
  title: "Upload Image",
  filetype: "JPG, PNG, GIF",
};

