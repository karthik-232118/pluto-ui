import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const DeleteModal = ({ open, onClose, isDeleting, onConfirm }) => {
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
        <Box
          display="flex"
          flexDirection="column"
          alignItems="start"
          textAlign="center"
        >
          <Typography variant="h6" component="h2">
            {t("confirm_deletion_title")}
          </Typography>
        
      <div style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)", width: "100%", margin: "10px 0px 0 0" }}></div>

          <Typography variant="h6" sx={{ marginBottom: "2rem", color: "gray" ,mt: 2}}>
            {t("confirm_deletion_message_modal")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                onClick={onConfirm}
                variant="contained"
                color="error"
                fullWidth
                disabled={isDeleting}
                startIcon={isDeleting && <CircularProgress size={20} />}
              >
                {isDeleting ? t("deleting_button") : t("delete_button")}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                onClick={onClose}
               variant="outlined"
              fullWidth
                disabled={isDeleting}
                  >
                {t("cancel")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteModal;

DeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
};
DeleteModal.defaultProps = {
  isDeleting: false,
};

