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
import { SaveOwnerChangeApi } from "../../services/ownerchange/ownerchange";
import { toast } from "react-toastify";
import i18next from "i18next";
import { useTheme } from "@mui/styles";

const OwnerChangeConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  currentOwnerData,
  newOwnerData,
  selectedElements = [],
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main; // Use theme color directly

  const handleConfirm = () => {
    if (
      !currentOwnerData?.id ||
      !newOwnerData?.id ||
      selectedElements.length === 0
    ) {
      const errorMsg = "Missing required data for owner change";
      console.error(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      ElementID: selectedElements.map((element) => element.ModuleID),
      OldOwnerID: currentOwnerData.id,
      NewOwnerID: newOwnerData.id,
    };

    SaveOwnerChangeApi(payload)
      .then((response) => {
        if (response?.status === 200) {
          toast.success(i18next.t("owner_changed"));
          onConfirm({ startDate, endDate });
          onClose();
        } else {
          const errorMsg =
            response?.data?.error ||
            "Owner change failed with unexpected response";
          console.error("Unexpected response:", response);
          setError(errorMsg);
          toast.error(errorMsg);
        }
      })
      .catch((error) => {
        console.error("Owner change failed:", error);
        const errorMessage =
          error?.response?.data?.error ||
          error?.response?.error ||
          error?.message ||
          "Failed to change owner";

        setError(errorMessage);
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  React.useEffect(() => {
    if (!startDate) {
      setStartDate(new Date());
    }
  }, [startDate]);

  console.log(
    "Selected ModuleIDs:",
    selectedElements.map((element) => element.ModuleID)
  );

  // Log owner details similar to OwnerChange.jsx
  console.log("Current Owner Details:", {
    id: currentOwnerData?.id,
    name: currentOwnerData?.name,
    email: currentOwnerData?.email,
  });

  console.log("New Owner Details:", {
    id: newOwnerData?.id,
    name: newOwnerData?.name,
    email: newOwnerData?.email,
  });

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
          background: bgcolor || "linear-gradient(to top, #2C64FF, #4A90E2)",
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
          Confirm Owner Change
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
          Are you sure you want to change the owner? This action cannot be
          undone.
        </Alert>

        <Box sx={{ textAlign: "center", my: 2 }}>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              fontSize: "0.8rem",
              color: "text.secondary",
            }}
          >
            You are about to transfer ownership from:
          </Typography>

          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 3 }}
          >
            {currentOwnerData && (
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
                        bgcolor: currentOwnerData.color,
                        width: 28,
                        height: 28,
                        fontSize: "0.8rem",
                      }}
                    >
                      {currentOwnerData.avatar}
                    </Avatar>
                  }
                  label={currentOwnerData.name}
                  sx={{
                    background: bgcolor || "linear-gradient(to top, #2C64FF, #4A90E2)",
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
                  Current Owner
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

            {newOwnerData && (
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
                        bgcolor: newOwnerData.color,
                        width: 28,
                        height: 28,
                        fontSize: "0.8rem",
                      }}
                    >
                      {newOwnerData.avatar}
                    </Avatar>
                  }
                  label={newOwnerData.name}
                  sx={{
                    bgcolor: bgcolor || "#2575fc",
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
                  New Owner
                </Typography>
              </Box>
            )}
          </Stack>



          {selectedElements && selectedElements.length > 0 && (
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
                Selected Elements ({selectedElements.length})
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
                {selectedElements.map((element) => (
                  <Box
                    key={element.ModuleID}
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
                        {element.ModuleName}
                      </Typography>
                      <Chip
                        label={element.ModuleType}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.65rem",
                          bgcolor:
                            element.ModuleType === "Document"
                              ? "#e3f2fd"
                              : "#e8f5e9",
                          color:
                            element.ModuleType === "Document"
                              ? "#1e88e5"
                              : "#4caf50",
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
                      {element.MasterVersion && (
                        <Typography variant="caption">
                          Master: v{element.MasterVersion}
                        </Typography>
                      )}
                      {element.DraftVersion && (
                        <Typography variant="caption">
                          InProgress: v{element.DraftVersion}
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
            background: bgcolor || "linear-gradient(to top, #2C64FF, #4A90E2)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": {
              background: bgcolor || "linear-gradient(to top, #1a4bb8, #3f6fbf)",
              boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
            },
            minWidth: "120px", // Ensure consistent width during loading state
          }}
        >
          {isSubmitting ? (
            <React.Fragment>
              <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
              Processing...
            </React.Fragment>
          ) : (
            "Confirm Change"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OwnerChangeConfirmationDialog;

OwnerChangeConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  currentOwnerData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    avatar: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
  newOwnerData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    avatar: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
  selectedElements: PropTypes.arrayOf(
    PropTypes.shape({
      ModuleID: PropTypes.string.isRequired,
      ModuleName: PropTypes.string.isRequired,
      ModuleType: PropTypes.string.isRequired,
      MasterVersion: PropTypes.string,
      DraftVersion: PropTypes.string,
    })
  ),
};
