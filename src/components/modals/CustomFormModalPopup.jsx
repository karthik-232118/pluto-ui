import { Modal, Box } from "@mui/material";
import PropTypes from "prop-types";

const CustomFormModalPopup = ({ isOpen, onClose, disabled, children }) => {
  return (
    <Modal
      open={isOpen}
      onClose={disabled ? undefined : onClose} // Disable close on backdrop click if disabled is true
      aria-labelledby="custom-modal"
      aria-describedby="custom-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: 400,
          maxWidth: "90%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default CustomFormModalPopup;

CustomFormModalPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
CustomFormModalPopup.defaultProps = {
  disabled: false,
};