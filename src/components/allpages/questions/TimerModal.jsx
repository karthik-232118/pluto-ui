import {
  Box,
  Button,
  Modal,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

export const TimerModal = ({ open, onConfirm }) => (
  <Modal open={open} onClose={() => {}} aria-labelledby="timer-modal">
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "white",
        p: 3,
        borderRadius: 2,
        boxShadow: 24,
        maxWidth: "400px",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Your test duration is completed.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onConfirm} // Call the passed function on button click
        sx={{ mt: 2 }}
      >
        OK
      </Button>
    </Box>
  </Modal>
);

TimerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
