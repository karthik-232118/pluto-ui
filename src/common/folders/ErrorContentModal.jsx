import React from "react";
import { Modal, Box, Typography, Button, Divider } from "@mui/material";

const ErrorContentModal = ({ open, handleClose, contentNames, message }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="error-content-modal-title"
      aria-describedby="error-content-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="error-content-modal-title" variant="h6" component="h2">
          Cannot Delete Category
        </Typography>
        <Divider/>
        <Typography id="error-content-modal-description" sx={{ mt: 2 }}>
          {message || "The following contents need to be removed first:"}
        </Typography>
        <ul>
          {contentNames?.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button variant="outlined" onClick={handleClose} sx={{ textTransform: "none",color:"#000",borderColor:"#000" }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ErrorContentModal;
