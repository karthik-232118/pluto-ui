import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Divider,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { convertDocxToPdf } from "../../../services/documentModules/DocumentsModule";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ConvertModal = ({ open, onClose, DocumentModuleDraftID, onConvert }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleConvertClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmConvert = async () => {
    const payload = { DocumentModuleDraftID: DocumentModuleDraftID };

    try {
      setLoading(true);
      const response = await convertDocxToPdf(payload);

      if (response?.status === 200 || response?.success) {
        toast.success("Document converted to PDF successfully!");
        onConvert?.(response);
        setShowConfirmation(false);
        onClose();
        setTimeout(() => {
          navigate(-1);
        }, 500);
      } else {
        toast.error(response?.message || "Failed to convert document");
      }
    } catch (error) {
      console.error("Error converting document:", error);
      toast.error(
        error?.message || "Error converting document. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConvert = () => {
    setShowConfirmation(false);
  };

  const handleClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 24,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <DescriptionIcon color="primary" />
          <Typography variant="h6" component="div" fontWeight={600}>
            Convert Document to PDF
          </Typography>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ mt: 2, position: "relative", minHeight: 150 }}>
        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
          >
            <CircularProgress size={48} thickness={4} />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Converting document to PDF...
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Please wait, this may take a few moments
            </Typography>
          </Box>
        ) : showConfirmation ? (
          <Box>
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
              icon={<CheckCircleOutlineIcon fontSize="inherit" />}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                Confirm Conversion
              </Typography>
            </Alert>
            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}
            >
              <Typography variant="body2" color="text.secondary" paragraph>
                Are you sure you want to convert this document to PDF format?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • This action cannot be undone
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • The document will be converted from DOCX to PDF
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Any changes that are not accepted will be erased.
              </Typography>
            </Paper>
          </Box>
        ) : (
          <Box>
            <Paper
              elevation={0}
              sx={{ p: 2, bgcolor: "primary.50", borderRadius: 1, mb: 2 }}
            >
              <Typography variant="body2" color="text.secondary" paragraph>
                📄 Ready to convert your document
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Click {"Convert"} to proceed with the conversion process
              </Typography>
            </Paper>

            <Alert severity="info" sx={{ mt: 2 }}>
              The conversion process will begin after confirmation
            </Alert>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        {showConfirmation ? (
          // Confirmation Buttons
          <>
            <Button
              onClick={handleCancelConvert}
              disabled={loading}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmConvert}
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Converting..." : "Confirm Convert"}
            </Button>
          </>
        ) : (
          // Main Conversion Buttons
          <>
            <Button onClick={handleClose} disabled={loading} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleConvertClick}
              variant="contained"
              disabled={loading}
            >
              Convert to PDF
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConvertModal;
