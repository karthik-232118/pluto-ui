import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

// UploadedFileInfo Component
const UploadedFileInfo = ({
  uploadedFile,
  errorList,
  showErrors,
  setShowErrors,
  classes,
}) => {
  const { t } = useTranslation();

  return (
    <Box className={classes["uploaded-file-info"]}>
      <Typography variant="body2" color="primary">
        {t("uploadedFile")}: {uploadedFile.name} (
        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)
      </Typography>
      {errorList && errorList.length > 0 && (
        <Typography
          variant="body2"
          color="red"
          onClick={() => setShowErrors((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          {showErrors ? t("hideErrors") : t("showErrors")}
        </Typography>
      )}
    </Box>
  );
};

export default UploadedFileInfo;

UploadedFileInfo.propTypes = {
  uploadedFile: PropTypes.object.isRequired,
  errorList: PropTypes.arrayOf(PropTypes.string),
  showErrors: PropTypes.bool.isRequired,
  setShowErrors: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
UploadedFileInfo.defaultProps = {
  errorList: [],
};
