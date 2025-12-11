import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { SwapHoriz } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const ModalButton = styled(Button)(({ theme, color }) => ({
  background:
    color === "primary"
      ? "linear-gradient(to top, #2C64FF, #4A90E2)"
      : "transparent",
  color: color === "primary" ? theme.palette.common.white : "#000",
  borderRadius: theme.spacing(1.5),
  fontWeight: 500,
  fontSize: "0.875rem",
  padding: theme.spacing(1, 3),
  border: color === "primary" ? "none" : "1px solid #000",
  "&:hover": {
    background:
      color === "primary"
        ? "linear-gradient(to top, #1a68e0, #3f7edc)"
        : "rgba(0,0,0,0.04)",
  },
}));

const UserBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  background: "linear-gradient(135deg, #f9f9f9 0%, #eef2f5 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: theme.spacing(1),
  position: "relative",
  minHeight: "150px",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
    minHeight: "120px",
  },
}));

const CoCreationChangeModal = ({
  open,
  onClose,
  onConfirm,
  currentCoCreatorData,
  newCoCreatorData,
  selectedDocuments = [],
  metaPayload = {},
  rawCurrentDocuments,
  selectedCurrentDocumentIds,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  // If either user data is missing, don't render the content
  if (!currentCoCreatorData || !newCoCreatorData) {
    return null;
  }

  const handleConfirm = () => {
    // Prepare payload with all selected docs and metadata
    const payload = {
      ...metaPayload,
      currentCoCreator: currentCoCreatorData,
      newCoCreator: newCoCreatorData,
      selectedDocuments,
      // Ensure UserIDs are explicitly included in the payload
      currentUserID: currentCoCreatorData.userId,
      newUserID: newCoCreatorData.userId,
    };
    onConfirm(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.1rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SwapHoriz color="primary" /> {t("Confirm Co-Creator Change")}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        <Typography
          variant="body2"
          sx={{ mb: 3, color: "text.secondary", fontSize: "0.9rem" }}
        >
          {t(
            "You are about to change the co-creator for the selected documents. Please review and confirm this change."
          )}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            mb: 3,
          }}
        >
          <UserBox sx={{ flex: 1 }}>
            <Chip
              label={t("Current")}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "#e3f2fd",
                color: "#1976d2",
                fontSize: "0.7rem",
              }}
            />
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: currentCoCreatorData.color || "#1976d2",
                fontSize: "1.5rem",
              }}
            >
              {currentCoCreatorData.avatar || "C"}
            </Avatar>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: "0.9rem", mt: 1 }}
            >
              {currentCoCreatorData.name || "Co-Creator Name"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.8rem" }}
            >
              {currentCoCreatorData.email || "email@example.com"}
            </Typography>
          </UserBox>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
            }}
          >
            <SwapHoriz
              sx={{
                transform: isMobile ? "rotate(90deg)" : "rotate(0deg)",
                color: "#2575fc",
                fontSize: "2rem",
              }}
            />
          </Box>

          <UserBox sx={{ flex: 1 }}>
            <Chip
              label={t("New")}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "#e8f5e9",
                color: "#4caf50",
                fontSize: "0.7rem",
              }}
            />
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: newCoCreatorData.color || "#4caf50",
                fontSize: "1.5rem",
              }}
            >
              {newCoCreatorData.avatar || "N"}
            </Avatar>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: "0.9rem", mt: 1 }}
            >
              {newCoCreatorData.name || "Co-Creator Name"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.8rem" }}
            >
              {newCoCreatorData.email || "email@example.com"}
            </Typography>
          </UserBox>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          {t("Selected Documents")} ({selectedDocuments.length})
        </Typography>

        <Box
          sx={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #eee",
            borderRadius: 1,
            p: selectedDocuments.length ? 1 : 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {selectedDocuments.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center" }}
            >
              {t("No documents selected")}
            </Typography>
          ) : (
            selectedDocuments.map((doc) => (
              <Box
                key={doc.id}
                sx={{
                  p: 1,
                  bgcolor: "#f9fafb",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {doc.name}
                </Typography>
                <Chip
                  label={doc.type}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    bgcolor: "#e3f2fd",
                    color: "#1976d2",
                  }}
                />
              </Box>
            ))
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <ModalButton onClick={onClose} disabled={loading}>
          {t("Cancel")}
        </ModalButton>
        <ModalButton
          color="primary"
          onClick={handleConfirm}
          disabled={selectedDocuments.length === 0 || loading}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              {t("Processing...")}
            </Box>
          ) : (
            t("Confirm Change")
          )}
        </ModalButton>
      </DialogActions>
    </Dialog>
  );
};

export default CoCreationChangeModal;
