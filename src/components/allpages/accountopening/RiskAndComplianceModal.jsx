import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";
import { useTranslation } from "react-i18next";

const RiskAndComplianceModal = ({
  open,
  onClose,
  heading,
  RiskAndCompliences,
  onItemClick,
}) => {
  const content =
    heading === "Risk"
      ? RiskAndCompliences?.RiskDetailsArrays || []
      : heading === "Compliance"
      ? RiskAndCompliences?.ComplianceDetailsArrays || []
      : heading === "Clause"
      ? RiskAndCompliences?.ClauseDetailsArrays || []
      : [];

  const properties =
    heading === "Risk"
      ? RiskAndCompliences?.RiskPropertiesDetails || []
      : heading === "Compliance"
      ? RiskAndCompliences?.CompliancePropertiesDetails || []
      : heading === "Clause"
      ? RiskAndCompliences?.ClausePropertiesDetails || []
      : [];
  const { t } = useTranslation();
  const getPositionForText = (text) => properties.find((p) => p.Text === text);

  const theme = useTheme();
  const bgcolor = theme.palette.primary.main;
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute", // For the modal center positioning
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            height: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            outline: "none",
            overflowY: "auto",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#fff",
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Heading with gradient background */}
          <Box
            sx={{
              background:
                bgcolor || "linear-gradient(to top, #2C64FF, #4A90E2)",
              margin: "-32px -32px 24px",
              padding: "24px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ textAlign: "start", marginBottom: 0, color: "#fff" }}
            >
              {heading}
            </Typography>
          </Box>

          {/* List Content */}
          <Box sx={{ textAlign: "start" }}>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {content.length > 0 ? (
                content.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "1rem",
                    }}
                  >
                    {/* Bullet Circle with Check Icon */}
                    <div
                      style={{
                        width: "15px",
                        height: "15px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        border: "#0288D114 1.5px solid",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "8px",
                        marginTop: "3px",
                      }}
                    >
                      <CheckIcon
                        style={{
                          fontSize: "16px",
                          color: "#3B82F6",
                          height: "10px",
                          width: "10px",
                        }}
                      />
                    </div>

                    {/* The actual bullet text */}
                    <div
                      style={{ color: "#00000099", fontWeight: 350, flex: 1 }}
                    >
                      {item}
                    </div>

                    {/* View Icon */}
                    <Tooltip title={t("viewInDocument")}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const position = getPositionForText(item);
                          if (position) {
                            onItemClick(position);
                            onClose();
                          }
                        }}
                        sx={{ ml: 1 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </li>
                ))
              ) : (
                <li>No {heading} details available.</li>
              )}
            </ul>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RiskAndComplianceModal;

RiskAndComplianceModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  RiskAndCompliences: PropTypes.shape({
    RiskDetailsArrays: PropTypes.arrayOf(PropTypes.string),
    ComplianceDetailsArrays: PropTypes.arrayOf(PropTypes.string),
    ClauseDetailsArrays: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
