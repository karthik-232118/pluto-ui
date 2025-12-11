import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CTQImage from "../../assets/image/SOPs/ctqimage.png";
import { useHeadingBgColor } from "../useHeadingBgColor";

const CTQModal = ({ open, onClose, sopDraftID }) => {
  const bgColor = useHeadingBgColor();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          pr: 5,
          background: bgColor,
          color: "white",
          fontWeight: "600",
          fontSize: "1.1rem",
          py: 2.5,
        }}
      >
        Critical-to-Quality (CTQ) Metrics
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "white",
            backgroundColor: "rgba(255,255,255,0.1)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ padding: 0, backgroundColor: "#fafbfc" }}>
        <Box
          sx={{
            overflow: "auto",
            maxHeight: "75vh",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: "3px",
              "&:hover": {
                background: "#a8a8a8",
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 20px",
              minHeight: "400px",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxHeight: "650px",
                maxWidth: "auto",
                backgroundColor: "#f8f9fa",
                border: "2px dashed #dee2e6",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: bgColor,
                  backgroundColor: "#f0f2f5",
                },
              }}
            >
              <img
                src={CTQImage}
                alt="CTQ Metrics"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </Box>
          </Box>
        </Box>
{/* 
        {sopDraftID && (
          <Box
            sx={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
              borderTop: "1px solid #dee2e6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#6c757d",
                fontSize: "0.7rem",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              SOP InProgress ID: {sopDraftID}
            </Typography>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#28a745",
              }}
            />
          </Box>
        )} */}
      </DialogContent>
    </Dialog>
  );
};

export default CTQModal;
