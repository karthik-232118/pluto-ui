import  { useState } from "react";
import { Button, Modal, Box, Typography } from "@mui/material";

const usePopupRedirect = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);

  const checkPopupAndRedirect = (url) => {
    setRedirectUrl(url);
    const popup = window.open("", "_blank");

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
     
      setIsModalOpen(true);
    } else {
     
      popup.location.href = url;
      popup.focus();
    }
  };

  const handleAllow = () => {
    if (redirectUrl) {
      const popup = window.open(redirectUrl, "_blank");
      if (popup) popup.focus();
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const PopupModal = () => (
    <Modal open={isModalOpen} onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          Allow Popup
        </Typography>
        <Typography variant="body2" mb={3}>
          The requested action requires enabling popups for this site. Would you
          like to allow it?
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleAllow}>
            Allow
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  return { checkPopupAndRedirect, PopupModal };
};

export default usePopupRedirect;
