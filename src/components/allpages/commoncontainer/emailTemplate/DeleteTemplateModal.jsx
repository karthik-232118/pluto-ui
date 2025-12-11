// DeleteTemplateModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";

const DeleteTemplateModal = ({ open, onClose, onConfirm }) => {
 
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.5rem 1.5rem 1rem",
          borderBottom: "1px solid #f0f0f0",
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#1a1a1a",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon sx={{ color: "#f57c00", fontSize: "1.5rem" }} />
          Delete Template
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#9e9e9e",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: "1.5rem" }}>  
        <Typography
          sx={{
            color: "#555",
            fontSize: "1rem",
            lineHeight: 1.5,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          Are you sure you want to delete this template?{" "}
          <Box component="span" sx={{ color: "#d32f2f", fontWeight: 500 }}>
            This action cannot be undone.
          </Box>
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            flex: 1,
            padding: "0.75rem",
            border: "1px solid #000000",
            color: "#000000",
            fontWeight: 500,
            borderRadius: "6px",
            "&:hover": {
              border: "1px solid #000000",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            flex: 1,
            padding: "0.75rem",
            backgroundColor: "#d32f2f",
            fontWeight: 500,
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: "#c62828",
              boxShadow: "0 2px 8px rgba(211, 47, 47, 0.3)",
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTemplateModal;