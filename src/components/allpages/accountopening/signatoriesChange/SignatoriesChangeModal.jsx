import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Button,
  Avatar,
  Chip,
  Stack,
  Typography,
  Box,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { ArrowForward } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ChangeSignatoryApi } from "../../../../services/ownerchange/ownerchange";
// import { ChangeSignatoryApi } from "../../../path/to/api/ownerChange"; // TODO: correct relative path

const SignatoriesChangeModal = ({
  open,
  onClose,
  onConfirm,
  onConfirmChange,
  currentSignatoryData,
  newSignatoryData,
  selectedDocuments = [],
  metaPayload = {},
  rawCurrentDocuments = [],
  selectedCurrentDocumentIds = [],
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  console.log("Current Signatory Data:", currentSignatoryData);
  console.log("New Signatory Data:", newSignatoryData);
  console.log("Selected Documents:", selectedDocuments);
  console.log("Meta Payload:", metaPayload);

  React.useEffect(() => {
    if (selectedCurrentDocumentIds?.length) {
      const selectedData =
        rawCurrentDocuments?.filter((d) =>
          selectedCurrentDocumentIds.includes(d.ElementID)
        ) || [];
      console.log("SelectedCurrentDocumentsPayload:", {
        message: "Selected current signatory documents",
        data: { data: selectedData },
      });
    } else {
      console.log("SelectedCurrentDocumentsPayload: none selected");
    }
  }, [selectedCurrentDocumentIds, rawCurrentDocuments]);

  const handleConfirm = () => {
    setIsSubmitting(true);
    setError(null);

    const payload = {
      ElementID: (selectedDocuments || []).map((d) => d.id),
      OldOwnerID: currentSignatoryData?.id || metaPayload.currentUserID || null,
      NewOwnerID: newSignatoryData?.id || metaPayload.newUserID || null,
      ChangeReason: null, // Extend later if UI for reason is added
    };

    console.log("ChangeSignatoryApi Payload:", payload);

    ChangeSignatoryApi(payload)
      .then((res) => {
        console.log("Change signatory success:", res);
        (onConfirm || onConfirmChange)?.(payload, res);
        setIsSubmitting(false);
        onClose();
      })
      .catch((err) => {
        console.error("Change signatory error:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to change signatory"
        );
        setIsSubmitting(false);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(to top, #2C64FF, #4A90E2)",
          color: "#fff",
          fontSize: "0.9rem",
          fontWeight: "bold",
          padding: "12px 16px",
          position: "relative",
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: "rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon fontSize="small" />
          Confirm Signatory Change
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "inherit",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.1)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: "20px", marginTop: "28px" }}>
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            fontSize: "0.8rem",
            borderRadius: "6px",
            alignItems: "center",
          }}
        >
          Are you sure you want to change the signatory? This action cannot be
          undone.
        </Alert>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, fontSize: "0.75rem", borderRadius: "6px" }}
          >
            {error}
          </Alert>
        )}
        <Box sx={{ textAlign: "center", my: 2 }}>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              fontSize: "0.8rem",
              color: "text.secondary",
            }}
          >
            You are about to transfer signing authority from:
          </Typography>

          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 3 }}
          >
            {currentSignatoryData && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Chip
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: currentSignatoryData.color || "#2C64FF",
                        width: 28,
                        height: 28,
                        fontSize: "0.8rem",
                      }}
                    >
                      {currentSignatoryData.avatar ||
                        currentSignatoryData.name.charAt(0)}
                    </Avatar>
                  }
                  label={currentSignatoryData.name}
                  sx={{
                    background: "linear-gradient(to top, #2C64FF, #4A90E2)",
                    color: "white",
                    fontSize: "0.8rem",
                    padding: "4px 8px",
                    height: "auto",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  {t("currentSignatory")}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <ArrowForward fontSize="medium" />
            </Box>

            {newSignatoryData && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Chip
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: newSignatoryData.color || "#4caf50",
                        width: 28,
                        height: 28,
                        fontSize: "0.8rem",
                      }}
                    >
                      {newSignatoryData.avatar ||
                        newSignatoryData.name.charAt(0)}
                    </Avatar>
                  }
                  label={newSignatoryData.name}
                  sx={{
                    bgcolor: "#2575fc",
                    color: "white",
                    fontSize: "0.8rem",
                    padding: "4px 8px",
                    height: "auto",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  {t("newSignatory")}
                </Typography>
              </Box>
            )}
          </Stack>

          {selectedDocuments && selectedDocuments.length > 0 && (
            <Box sx={{ mt: 4, textAlign: "left" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {t("selectedDocuments")} ({selectedDocuments.length})
              </Typography>

              <Box
                sx={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  border: "1px solid #eee",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                {selectedDocuments.map((document) => (
                  <Box
                    key={document.id}
                    sx={{
                      mb: 1,
                      p: 1,
                      bgcolor: "#f9fafb",
                      borderRadius: 1,
                      "&:last-child": { mb: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                      >
                        {document.name}
                      </Typography>
                      <Chip
                        label={document.type}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.65rem",
                          bgcolor:
                            document.type === "Legal" ? "#e3f2fd" : "#e8f5e9",
                          color:
                            document.type === "Legal" ? "#1e88e5" : "#4caf50",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        fontSize: "0.7rem",
                        color: "text.secondary",
                      }}
                    >
                      {document.reference && (
                        <Typography variant="caption">
                          Ref: {document.reference}
                        </Typography>
                      )}
                      {document.version && (
                        <Typography variant="caption">
                          Version: {document.version}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <Divider sx={{ my: 0 }} />

      <DialogActions
        sx={{
          padding: "16px",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={isSubmitting}
          size="small"
          sx={{
            fontSize: "0.8rem",
            textTransform: "none",
            borderRadius: "8px",
            padding: "6px 12px",
            borderColor: "grey.300",
            color: "text.primary",
            "&:hover": {
              backgroundColor: "grey.100",
              borderColor: "grey.400",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={isSubmitting ? null : <CheckIcon fontSize="small" />}
          onClick={handleConfirm}
          disabled={isSubmitting}
          size="small"
          sx={{
            fontSize: "0.8rem",
            textTransform: "none",
            borderRadius: "8px",
            padding: "6px 12px",
            background: "linear-gradient(to top, #2C64FF, #4A90E2)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": {
              background: "linear-gradient(to top, #1a4bb8, #3f6fbf)",
              boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
            },
            minWidth: "120px",
          }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
              Processing...
            </>
          ) : (
            "Confirm Change"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SignatoriesChangeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onConfirmChange: PropTypes.func,
  currentSignatoryData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    avatar: PropTypes.string,
    color: PropTypes.string,
  }),
  newSignatoryData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    avatar: PropTypes.string,
    color: PropTypes.string,
  }),
  selectedDocuments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      reference: PropTypes.string,
      version: PropTypes.string,
    })
  ),
  metaPayload: PropTypes.shape({
    currentUserID: PropTypes.string,
    newUserID: PropTypes.string,
  }),
  rawCurrentDocuments: PropTypes.arrayOf(
    PropTypes.shape({
      ElementID: PropTypes.string,
      ElementName: PropTypes.string,
      ModuleName: PropTypes.string,
    })
  ),
  selectedCurrentDocumentIds: PropTypes.arrayOf(PropTypes.string),
};

export default SignatoriesChangeModal;
