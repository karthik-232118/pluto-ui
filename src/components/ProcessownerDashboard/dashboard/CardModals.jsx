import { Modal, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const CardModals = ({ open, onClose, heading }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: "2rem", backgroundColor: "white", borderRadius: "8px", width: "400px", margin: "auto", marginTop: "20vh" }}>
        <Typography variant="h6">License Expiry Date</Typography>
        <Typography variant="body1">{heading}</Typography> {/* Display the validity date here */}
      </Box>
    </Modal>
  );
};

export default CardModals;

CardModals.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired, // Assuming heading is a string representing the validity date
};
