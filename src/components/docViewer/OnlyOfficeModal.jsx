import  { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const OnlyOfficeModal = ({ open, onClose, handleSave }) => {
  const { t } = useTranslation();

  const [loading] = useState(false);

  return (
    <Modal
      open={open}
      onClose={onClose} // Use the passed `onClose` prop to close the modal
      aria-labelledby="logout-modal-title"
      aria-describedby="logout-modal-description"
    >
      <Box sx={modalStyle}>
      
        <Typography id="logout-modal-title" variant="h6" align="center">
          {t("OnlyOfficeModalTitle")}
        </Typography>
        <Typography
          id="logout-modal-description"
          sx={{
            color: "#64748B",
            fontWeight: "400",
            fontSize: "15px",
            marginTop: "7%",
          }}
          align="center"
        >
          {t("OnlyOfficeModalDescription")}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ width: "100%" }}
              style={{
                borderColor: "#D0D5DD",
                color: "#000",
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              {t("cancel")}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              style={{
                backgroundColor: "green",
                borderRadius: "8px",
                textTransform: "none",
              }}
              onClick={() => handleSave()}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("OnlyOfficeModalButton")
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  width: "485px",
  height: "248px",
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  padding: "24px",
  transform: "translate(-50%, -50%)",
};

export default OnlyOfficeModal;

OnlyOfficeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};
