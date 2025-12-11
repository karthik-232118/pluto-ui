import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const CardModal = ({ open, onClose, heading }) => {
  const {t} = useTranslation(); // Assuming you have set up i18next for translations
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    height: "auto",
    maxHeight: "80vh",
    bgcolor: "#ffffff",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
    p: 4,
    borderRadius: "16px",
    border: "2px solid #e0e0e0",
    overflowY: "auto",
    "&:focus": {
      outline: "none",
    },
  };

  const closeIconStyle = {
    position: "absolute",
    top: "16px",
    right: "16px",
    color: "#666",
    "&:hover": {
      backgroundColor: "rgba(255, 105, 135, 0.1)",
      color: "#ff4968",
    },
  };

  const gradientDividerStyle = {
    background: "linear-gradient(90deg, #ff8a00, #e52e71, #9b59b6)",
    height: "4px",
    width: "100%",
    border: "none",
    borderRadius: "2px",
    margin: "16px 0",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        backdropFilter: "blur(4px)",
      }}
    >
      <Box sx={style}>
        {/* Close Icon */}
        <IconButton aria-label="close" onClick={onClose} sx={closeIconStyle}>
          <CloseIcon fontSize="medium" />
        </IconButton>

        {/* Title with gradient text */}
        <Typography
          id="modal-title"
          variant="h4"
          component="h2"
          mb={2}
          sx={{
            background: "linear-gradient(90deg, #ff8a00, #e52e71)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "450",
            fontSize:"1.3rem",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
         {t('licenseExpiryDate')}
        </Typography>

        <Box sx={gradientDividerStyle} />

        <Typography
          id="modal-description"
          variant="body1"
          mt={4}
          mb={4}
          sx={{
            fontSize: "0.8rem",
            color: "#555",
            lineHeight: "1.6",
          }}
        >
         {t("licenseDescription")}{" "}
          <Box
            component="span"
            sx={{
              display: "inline-block",
              backgroundColor: "rgba(255, 105, 135, 0.1)",
              color: "#e52e71",
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              fontWeight: "bold",
              borderLeft: "4px solid #e52e71",
            }}
          >
            {heading}
          </Box>
          . {t("interruption")}
        </Typography>

     
      </Box>
    </Modal>
  );
};

export default CardModal;

CardModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired, // Assuming heading is a string
};
