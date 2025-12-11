import { Box, Button, Typography, Modal, Grid, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const DeleteConfirmationPopup = ({ open, onClose, onConfirm, isDeleting }) => {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
          {t("confirm_deletion_title")}
        </Typography>
        <Divider sx={{ marginBottom: "1rem" }} />
        <Typography variant="body1" sx={{ marginBottom: "2rem", color: "gray" }}>
          {t("confirm_deletion_message")}
        </Typography>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="error"
              sx={{ width: "100%" }}
              style={{ backgroundColor: "#B91C1C", borderRadius: "8px" }}
              fullWidth
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : t("confirm")}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              onClick={onClose}
              fullWidth
              // sx={{ width: "100%" }}
             >
              {t("cancel")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationPopup;

DeleteConfirmationPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
DeleteConfirmationPopup.defaultProps = {
  open: false,
  onClose: () => {},
  onConfirm: () => {},
  title: "",
};
DeleteConfirmationPopup.displayName = "DeleteConfirmationPopup";
