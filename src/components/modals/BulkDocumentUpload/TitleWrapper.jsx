import { Box, Typography, Button, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";

// TitleWrapper Component
const TitleWrapper = ({
  Featuredicon,
  classes,
  handleDownloadSample,
  sampleDownloadLoading,
  loading,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main; // Use theme color directly

  return (
    <Box className={classes["title-wrapper"]}>
      <Box className={classes["title"]}>
        <img src={Featuredicon} alt="Featuredicon" />
        <Box>
          <Typography variant="h6">{t("bulkDocumentUpload")}</Typography>
        </Box>
      </Box>
      <Box>
        <Button
          variant="contained"
        sx={{backgroundColor: bgcolor || "#2C64FF", textTransform: "none"



        }}
          onClick={handleDownloadSample}
          disabled={sampleDownloadLoading || loading} 
          startIcon={
            sampleDownloadLoading ? (
              <CircularProgress size={20} />
            ) : (
              <DownloadIcon />
            )
          }
        >
          {sampleDownloadLoading ? t("downloading") : t("downloadSample")}
        </Button>
      </Box> 
    </Box>
  );
};

export default TitleWrapper;

TitleWrapper.propTypes = {
  Featuredicon: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  handleDownloadSample: PropTypes.func.isRequired,
  sampleDownloadLoading: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};