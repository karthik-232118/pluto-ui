import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/styles";

const DocumentExitModal = ({
  open,
  onCancel,
  onConfirm,
  documentName,
  pagesViewedCount,
  timeSpentMinutes,
}) => {
  // Format time for display
  const theme = useTheme();
  const bgColor = theme.palette.primary.main; // Use theme color directly
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours !== 1 ? "s" : ""}${
      remainingMinutes > 0
        ? ` ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`
        : ""
    }`;
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Paper
        sx={{
          width: "400px",
          maxWidth: "90%",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Header with background color and close button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            backgroundColor: bgColor,
            color: "white",
          }}
        >
          <Typography variant="h6">Confirm Exit</Typography>
          <IconButton
            onClick={onCancel}
            sx={{ color: "white" }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ padding: "24px" }}>
          <Typography variant="body2" paragraph sx={{ mb: 2 }}>
            Are you sure you want to close <strong>{documentName}</strong>?
          </Typography>
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              padding: "12px 16px",
              mb: 3,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              {"You've viewed"} <strong>{pagesViewedCount}</strong> page
              {pagesViewedCount !== 1 ? "s" : ""} and spent{" "}
              <strong>{formatTime(timeSpentMinutes)}</strong> on this document.
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              pt: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{
                textTransform: "none",
                px: 3,
                borderRadius: "4px",
                borderColor: "#000",
                color: "#000",
                "&:hover": {
                  borderColor: "#000",
                  backgroundColor: "transparent",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onConfirm}
              sx={{
                textTransform: "none",
                px: 3,
                borderRadius: "4px",
                boxShadow: "none",
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DocumentExitModal;
