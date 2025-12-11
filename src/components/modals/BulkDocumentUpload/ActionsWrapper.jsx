import { Button, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const ActionsWrapper = ({
  onCancel,
  onUpload,
  loading,
  error,
  uploadedFile,
 
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        onClick={onCancel}
        disabled={loading}
      >
        {t("cancel")}
      </Button>
      <Button
        variant="contained"
        fullWidth
        disabled={loading || !uploadedFile || error}
        startIcon={loading && <CircularProgress size={20} />}
        onClick={onUpload}
      >
       {loading ? t("uploading") : t("upload")}
      </Button>
    </>
  );
};

export default ActionsWrapper;

ActionsWrapper.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool,
  uploadedFile: PropTypes.object,
};
