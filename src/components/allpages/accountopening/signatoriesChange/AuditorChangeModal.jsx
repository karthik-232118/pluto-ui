import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";

const AuditorChangeModal = ({ open, onClose, auditors, onConfirmChange }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Confirm Auditor Change
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            You are about to change the auditor. Please review the changes before
            confirming.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Avatar
              sx={{
                bgcolor: "#4A90E2",
                width: 56,
                height: 56,
                margin: "0 auto 10px",
              }}
            >
              C
            </Avatar>
            <Typography variant="subtitle1" fontWeight="bold">
              Current Auditor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Michael Brown
            </Typography>
            <Typography variant="body2" color="text.secondary">
              michael.brown@example.com
            </Typography>
          </Box>

          <Box sx={{ textAlign: "center", px: 2 }}>
            <Box
              sx={{
                bgcolor: "#2575fc",
                color: "white",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Box>
          </Box>

          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Avatar
              sx={{
                bgcolor: "#50C878",
                width: 56,
                height: 56,
                margin: "0 auto 10px",
              }}
            >
              S
            </Avatar>
            <Typography variant="subtitle1" fontWeight="bold">
              New Auditor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sarah Johnson
            </Typography>
            <Typography variant="body2" color="text.secondary">
              sarah.johnson@example.com
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Documents to be transferred:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 2,
            }}
          >
            <Chip label="Audit Agreement" size="small" />
            <Chip label="Financial Statements" size="small" />
            <Chip label="Audit Findings" size="small" />
            <Chip label="Compliance Report" size="small" />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Close />}
          onClick={onClose}
          sx={{ minWidth: 120 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Check />}
          onClick={() => {
            onConfirmChange();
            onClose();
          }}
          sx={{
            minWidth: 120,
            background: "linear-gradient(to top, #2C64FF, #4A90E2)",
            "&:hover": {
              background: "linear-gradient(to top, #1a68e0, #3f7edc)",
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuditorChangeModal;