import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

// Dropzone Component
const Dropzone = ({ getRootProps, getInputProps, classes }) => {
  const { t } = useTranslation();

  return (
    <Box className={classes["dropzone"]} {...getRootProps()}>
      <input {...getInputProps()} />
      <Typography variant="body1" color="textSecondary">
        {t("dragAndDrop")}
      </Typography>
    </Box>
  );
};

export default Dropzone;
Dropzone.propTypes = {
  getRootProps: PropTypes.func.isRequired,
  getInputProps: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
