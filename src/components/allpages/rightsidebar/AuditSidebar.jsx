import {
  Box,
  Typography,
  TextField,
  Button,
  styled,
  Divider,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { AddAuditorCommentApi } from "../../../services/auditorComment/auditorComment";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.grey[300],
      borderRadius: "8px",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: "1px",
    },
  },
}));

const AuditSidebar = ({ elementsDocumentFiles }) => {
  const userType = localStorage.getItem("user_type");
  const [isFinal, setIsFinal] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const location = useLocation();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [finalCommentSent, setFinalCommentSent] = useState(false);
  const { t } = useTranslation();

  const createdBy = elementsDocumentFiles?.data?.CreatedBy;
  const ownerID = localStorage.getItem("user_id");
  const hasAuditMessages =
    elementsDocumentFiles?.data?.AuditorMessages &&
    elementsDocumentFiles.data.AuditorMessages.length > 0;

  // Disable save button if owner is creator and there are no audit messages
  const isSaveDisabled = createdBy === ownerID && !hasAuditMessages;

  console.log(createdBy, "createdBy");
  console.log(ownerID, "ownerID");
  console.log(hasAuditMessages, "hasAuditMessages");
  console.log(isSaveDisabled, "isSaveDisabled");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    if (
      elementsDocumentFiles?.data?.AuditorMessages &&
      elementsDocumentFiles.data.AuditorMessages.length > 0
    ) {
      const formattedComments = elementsDocumentFiles.data.AuditorMessages.map(
        (message) => ({
          id: Date.now() + Math.random(),
          text: message.CommentText,
          timestamp: formatDate(message.CreatedDateTime),
          isFinal: message.ActionType === "Complete",
          user: message.CommentBy,
          version: message.DraftVersion || message.MasterVersion || "N/A",
        })
      );
      setComments(formattedComments);
      const hasFinal = elementsDocumentFiles.data.AuditorMessages.some(
        (msg) => msg.ActionType === "Complete"
      );
      setFinalCommentSent(hasFinal);
    }
  }, [elementsDocumentFiles?.data?.AuditorMessages]);
  const handleExternalComment = (jsonComment) => {
    try {
      const parsedComment =
        typeof jsonComment === "string" ? JSON.parse(jsonComment) : jsonComment;
      const newExternalComment = {
        id: parsedComment.id || Date.now(),
        text: parsedComment.text || parsedComment.comment || "",
        timestamp: parsedComment.timestamp || new Date().toLocaleString(),
        isFinal: parsedComment.isFinal || false,
        user: parsedComment.user || parsedComment.name || "Unknown",
      };

      setComments((prev) => [...prev, newExternalComment]);
    } catch (error) {
      console.error("Failed to process external comment:", error);
    }
  };

  const handleSaveComment = async () => {
    if (comment.trim()) {
      setIsLoading(true);
      try {
        // Create the payload for the API
        const payload = {
          ModuleDraftID:
            elementsDocumentFiles?.data?.SOPDraftID ||
            elementsDocumentFiles?.data?.DocumentModuleDraftID,
          CommentText: comment,
          ActionType: isFinal ? "Complete" : "Message",
        };

        const response = await AddAuditorCommentApi(payload);

        const newComment = {
          id: Date.now(),
          text: comment,
          timestamp: formatDate(new Date()),
          isFinal: isFinal,
        };

        setComments((prevComments) => [...prevComments, newComment]);
        setComment("");
        setIsFinal(false);

        if (isFinal) {
          setFinalCommentSent(true);
        }

        console.log("Comment saved successfully:", response);
      } catch (error) {
        console.error("Failed to save comment:", error);
        let errorMessage = "Failed to save comment";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.message === "string") {
          errorMessage = error.message;
        }

        setToast({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast({ ...toast, open: false });
  };

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  // Group comments by version
  const groupedCommentsByVersion = () => {
    const grouped = {};
    sortedComments.forEach((comment) => {
      const version = comment.version || "N/A";
      if (!grouped[version]) {
        grouped[version] = [];
      }
      grouped[version].push(comment);
    });
    return Object.entries(grouped)
      .sort(([versionA], [versionB]) => {
        const numA = parseFloat(versionA);
        const numB = parseFloat(versionB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numB - numA;
        }
        return versionB.localeCompare(versionA);
      })
      .map(([version, comments]) => ({ version, comments }));
  };

  const versionGroups = groupedCommentsByVersion();

  // Check URL path to determine if controls should be disabled
  useEffect(() => {
    // Check if URL has a document ID pattern (like /documents/view/[UUID]?SOP=true)
    const hasDocumentId = /\/documents\/view\/[a-f0-9-]+/.test(
      location.pathname
    );
    setIsDisabled(hasDocumentId);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        padding: "1.5rem",
        gap: "1.5rem",
        height: "100%",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          height: "100%",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: "1.1rem",
              mb: 1,
            }}
          >
            Overall comments
          </Typography>
          <Divider sx={{ width: "100%", margin: "10px 0" }} />
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.5, mb: 2 }}
          >
            {t("addObservations")}
          </Typography>
        </Box>
        <StyledTextField
          multiline
          rows={8}
          fullWidth
          placeholder={t("enterAuditNotes")}
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isDisabled || isSaveDisabled}
          InputProps={{
            sx: {
              fontSize: "0.875rem",
              lineHeight: "1.5",
            },
          }}
        />

        {userType === "Auditor" && (
          <Tooltip title="Cannot be modified once saved" placement="top" arrow>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isFinal}
                  onChange={(e) => setIsFinal(e.target.checked)}
                  disabled={isDisabled || isSaveDisabled}
                />
              }
              label={isFinal ? t("auditCommentIsFinal") : t("markAsFinal")}
              sx={{ my: 1, width: "100%" }}
            />
          </Tooltip>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleSaveComment}
          disabled={isDisabled || isSaveDisabled || !comment.trim()}
          sx={{
            py: 0.5,
            borderRadius: "8px",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          {isLoading ? t("saving") : t("save")}
        </Button>

        {comments.length > 0 && (
          <Box style={{ marginTop: 16, width: "100%" }}>
            <Typography
              style={{
                fontWeight: 600,
                marginBottom: 6,
                fontSize: "13px",
                color: "#1e293b",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {t("auditComments", { count: comments.length })}
            </Typography>

            <Box
              style={{
                maxHeight: "300px", // reduced height
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                paddingRight: "4px",
              }}
            >
              {versionGroups.map((group) => (
                <Box key={group.version} style={{ marginBottom: "4px" }}>
                  <Typography
                    style={{
                      fontWeight: 500,
                      fontSize: "12px",
                      color: "#0f172a",
                      backgroundColor: "#f8fafc",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      display: "inline-block",
                      fontFamily: "Inter, sans-serif",
                      marginBottom: "6px",
                    }}
                  >
                    Version: {group.version}
                  </Typography>

                  {group.comments.map((item) => {
                    const isCurrentUser = item.user?.includes("Manokaran");
                    const isProcessOwner = item.user?.includes("Process Owner");

                    const bubbleColor = isCurrentUser
                      ? "#e3f2fd"
                      : isProcessOwner
                      ? "#e8f5e9"
                      : "#f1f5f9";

                    const borderColor = isCurrentUser
                      ? "#90caf9"
                      : isProcessOwner
                      ? "#a5d6a7"
                      : "#cbd5e1";

                    const userColor = isCurrentUser ? "#0d47a1" : "#1b5e20";

                    return (
                      <Box
                        key={item.id}
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: isCurrentUser
                            ? "flex-end"
                            : "flex-start",
                          marginBottom: "6px",
                        }}
                      >
                        <Box
                          style={{
                            maxWidth: "85%",
                            padding: "10px",
                            backgroundColor: bubbleColor,
                            border: `1px solid ${borderColor}`,
                            borderRadius: "10px",
                            borderTopRightRadius: isCurrentUser
                              ? "4px"
                              : "10px",
                            borderTopLeftRadius: isCurrentUser ? "10px" : "4px",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          <Typography
                            style={{
                              fontWeight: 600,
                              fontSize: "11px",
                              color: userColor,
                              marginBottom: "0px",
                            }}
                          >
                            {item.user || "Unknown"}
                          </Typography>

                          <Typography
                            style={{
                              fontSize: "12px",
                              color: "#334155",
                              marginBottom: "6px",
                              lineHeight: "1.4",
                              whiteSpace: "pre-line",
                              overflowWrap: "break-word",
                              wordBreak: "break-word", // Force break long words if needed
                              width: "100%",
                              display: "block",
                            }}
                          >
                            {item.text}
                          </Typography>
                          <Box
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              style={{
                                fontSize: "10px",
                                color: "#64748b",
                                marginBottom: "-5px",
                              }}
                            >
                              {item.timestamp}
                            </Typography>

                            {item.isFinal && (
                              <Typography
                                style={{
                                  fontSize: "10px",
                                  fontWeight: 500,
                                  color: isCurrentUser ? "#0d47a1" : "#1b5e20",
                                  backgroundColor: isCurrentUser
                                    ? "rgba(33, 150, 243, 0.15)"
                                    : "rgba(76, 175, 80, 0.15)",
                                  padding: "1px 6px",
                                  borderRadius: "4px",
                                  marginLeft: "6px",
                                }}
                              >
                                Final
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Snackbar
          open={toast.open}
          autoHideDuration={6000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AuditSidebar;
