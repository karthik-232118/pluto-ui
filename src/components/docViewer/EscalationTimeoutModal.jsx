import {
  Box,
  Button,
  Typography,
  Modal,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { GridCloseIcon } from "@mui/x-data-grid";
import PropTypes from "prop-types";

const EscalationTimeoutModal = ({ open, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="timeout-modal-title"
      aria-describedby="timeout-modal-description"
    >
      <Box sx={modalStyle}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <GridCloseIcon />
        </IconButton>

        <Typography id="timeout-modal-title" variant="h6" align="center">
          {t("TimeoutNotificationTitle")}
        </Typography>

        <Typography
          id="timeout-modal-description"
          sx={{
            color: "#64748B",
            fontWeight: "400",
            fontSize: "15px",
            marginTop: "7%",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {t("TimeoutNotificationMessage")}
        </Typography>

        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            width: "100%",
            backgroundColor: "#1976d2",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          {t("OK")}
        </Button>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  width: "485px",
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "24px",
};

export default EscalationTimeoutModal;

EscalationTimeoutModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
