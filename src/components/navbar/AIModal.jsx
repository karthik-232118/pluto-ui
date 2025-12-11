import  { useRef, useEffect } from "react";
import { Box,  Modal } from "@mui/material";
import Searchgpt from "./SearchAi";
import PropTypes from "prop-types";

const AIModal = ({ open, onClose }) => {
  const modalRef = useRef(null);

  // Handle click outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="ai-modal-title"
      aria-describedby="ai-modal-description"
      sx={{
        display: "flex",
        alignItems: "start",
        justifyContent: "center",
        marginTop: "78px",
      }}
    >
    
      <Box
        sx={{
          width: "auto",
          height: "400px",
          overflowY: "auto",
          scrollbarWidth: "none" /* Hides scrollbar for Firefox */,
          "&::-webkit-scrollbar": {
            display: "none" /* Hides scrollbar for Chrome, Safari */,
          },
        }}
      >
        <Searchgpt />
      </Box>
    </Modal>
  );
};

export default AIModal;

AIModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
