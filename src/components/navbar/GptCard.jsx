import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Card,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  ButtonGroup,
  Chip,
} from "@mui/material";
import { ErrorOutline, ContentCopy } from "@mui/icons-material";
import gptSend from "../../assets/svg/navbar/gptSend.svg";
import Aisvg from "../../assets/svg/navbar/AisvgBlue.svg";
import Checkcircle from "../../assets/svg/navbar/Checkcircle.svg";
import { AI_URL } from "../../config/urlConfig";
import { useNavigate } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import { useTranslation } from "react-i18next";
import CheckIcon from "@mui/icons-material/Check";

const GptCard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedClip, setSelectedClip] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [moduleInfo, setModuleInfo] = useState(null);
  const [clarification, setClarification] = useState(null);
  const [manualChoice, setManualChoice] = useState("");
  const { t } = useTranslation(); // Assuming you have a translation function
  const wsRef = useRef(null);
  const [wsReady, setWsReady] = useState(false);

  const connectWebSocket = () => {
    wsRef.current = new window.WebSocket(
      "ws://122.166.253.254:5050/api/generate"
    );
    wsRef.current.onopen = () => setWsReady(true);
    wsRef.current.onclose = () => setWsReady(false);
    wsRef.current.onerror = () => setWsReady(false);
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const ensureWebSocket = (callback) => {
    if (!wsRef.current || wsRef.current.readyState !== 1) {
      connectWebSocket();
      wsRef.current.onopen = () => {
        setWsReady(true);
        callback();
      };
    } else {
      callback();
    }
  };

  const handleClipSelect = (clip) => {
    setSelectedClip(clip === selectedClip ? null : clip);
  };

  const handleModuleNavigation = () => {
    if (moduleInfo?.SOPID) {
      navigate(`/sops/view/${moduleInfo.SOPID}`);
    } else if (moduleInfo?.DocumentID) {
      navigate(`/documents/view/${moduleInfo.DocumentID}`);
    }
  };

  const handleGetResponse = () => {
    if (!search) return;
    setLoading(true);
    setMessage("");
    const access_token = localStorage.getItem("access_token");
    setMessageColor("");
    setConversation([
      { type: "question", content: search, module: selectedClip },
    ]);
    setClarification(null); // reset clarification
    const payload = {
      prompt: search,
      auth_token: access_token,
    };

    ensureWebSocket(() => {
      wsRef.current.send(JSON.stringify(payload));
      wsRef.current.onmessage = (event) => {
        let res;
        try {
          res = JSON.parse(event.data);
        } catch (e) {
          res = {};
        }
        console.log(res, "webSocketResponse"); // Log the response
        if (res?.type === "clarification") {
          setClarification(res);
          setLoading(false);
          return;
        }
        const answer =
          res?.qa?.[0]?.answer || res?.response || "No response found.";
        setSuggestedQuestions(res?.["suggested questions"] || []);
        setModuleInfo(res?.module || null);
        setMessage("Successfully generated responses");
        setMessageColor("green");
        setConversation((prev) => [
          ...prev,
          { type: "answer", content: answer },
        ]);
        setLoading(false);
      };
      wsRef.current.onerror = () => {
        setMessage("An error occurred. Please try again.");
        setMessageColor("red");
        setConversation((prev) => [
          ...prev,
          { type: "answer", content: "An error occurred. Please try again." },
        ]);
        setLoading(false);
      };
      wsRef.current.onclose = () => {
        setWsReady(false);
      };
      setSearch("");
    });
  };

  const handleClarificationChoice = (choice) => {
    setLoading(true);
    setClarification(null);
    setManualChoice("");
    const access_token = localStorage.getItem("access_token");
    const payload = {
      choice,
      auth_token: access_token,
    };
    ensureWebSocket(() => {
      wsRef.current.send(JSON.stringify(payload));
    });
  };

  const handleManualChoiceSend = () => {
    if (!manualChoice.trim()) return;
    handleClarificationChoice(manualChoice.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGetResponse();
    }
  };

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatContent = (content) => {
    return content.split("\n").map((paragraph, index) => (
      <React.Fragment key={index}>
        {paragraph}
        <br />
      </React.Fragment>
    ));
  };

  const isCodeBlock = (content) => {
    return content.includes("```");
  };

  const renderCodeBlocks = (content, answerIndex) => {
    const parts = content.split("```");
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const codeIndex = `${answerIndex}-${index}`;
        return (
          <Box
            key={index}
            sx={{
              position: "relative",
              backgroundColor: "#282c34",
              padding: "16px",
              borderRadius: "6px",
              overflowX: "auto",
              fontFamily: "monospace",
              whiteSpace: "pre",
              margin: "12px 0",
              width: "768px",
              border: "1px solid #444",
              color: "#abb2bf",
            }}
          >
            <Tooltip
              title={copiedIndex === codeIndex ? "Copied!" : "Copy code"}
              placement="top"
            >
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  right: "8px",
                  top: "8px",
                  color: "#abb2bf",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
                onClick={() => handleCopyCode(part, codeIndex)}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
            <Box component="pre" sx={{ margin: 0 }}>
              {part}
            </Box>
          </Box>
        );
      }
      return formatContent(part);
    });
  };

  const handleSuggestedQuestion = (question) => {
    setSearch(question);
    handleGetResponse();
  };

  return (
    <Card sx={{ height: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "768px",
          gap: "20px",
          margin: "0 1rem",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
        {/* Heading and Module selection in the same row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            mt: "1.4rem",
            mb: "-1rem",
          }}
        >
          <h4
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              margin: 0,
            }}
          >
            {t("titleGPT")}
          </h4>
          <ButtonGroup variant="outlined" size="small">
            {[
               t("SOP"),
              t("Document"),
              t("TestMCQ"),
              t("SkillAssessment"),
              t("SkillBuilding"),
            ].map((clip) => (
              <Button
                key={clip}
                onClick={() => handleClipSelect(clip)}
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  textTransform: "none",
                  color: selectedClip === clip ? "#fff" : "#555",
                  backgroundColor:
                    selectedClip === clip ? "#36A2EB" : "transparent",
                  borderColor: "#ddd",
                  "&:hover": {
                    borderColor: "#bbb",
                    backgroundColor:
                      selectedClip === clip ? "#2d8ed6" : "#f5f5f5",
                  },
                  px: 1.5,
                  py: 0.5,
                }}
              >
                {clip}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        <TextField
          placeholder={t("searchPlaceholderGPT")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <img src={Aisvg} alt="AI" style={{ width: 20, height: 20 }} />
            ),
            endAdornment: (
              <img
                src={gptSend}
                alt="Send"
                style={{ cursor: "pointer" }}
                onClick={handleGetResponse}
              />
            ),
            style: {
              height: "45px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              marginTop: "10px",
              width: "770px",
            },
          }}
        />

        {/* Welcome message that shows before any conversation */}
        {conversation.length === 0 && !loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "400px",
              width: "100%",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              mt: 0,
              p: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              <img
                src={Aisvg}
                alt="AI"
                style={{ width: 40, height: 40, marginRight: "10px" }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: "600", color: "#333", fontSize: "1.2rem" }}
              >
                {t("greeting")}, {"I'm"} {t("titleGPT")}
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: "#555", fontSize: "0.9rem", textAlign: "center" }}
            >
              {t("intro")}
            </Typography>
          </Box>
        )}

        {suggestedQuestions.length > 0 && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              mt: -2,
            }}
          >
            <Typography
              variant="p"
              sx={{
                color: "#0d0d0eff",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              {t("suggested")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => handleSuggestedQuestion(question)}
                  sx={{
                    textTransform: "none",
                    borderColor: "#36A2EB",
                    color: "#36A2EB",
                    backgroundColor: "white",
                    "&:hover": {
                      backgroundColor: "#36A2EB",
                      color: "white",
                      borderColor: "#36A2EB",
                    },
                    fontSize: "0.75rem",
                    padding: "4px 12px",
                    borderRadius: "16px",
                  }}
                >
                  {question}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {conversation.length > 0 && (
          <Box
            sx={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #68CE6D80",
              backgroundColor: "#68CE6D0A",
              display: "flex",
              flexDirection: "row",
              alignItems: "center", // centers vertically
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              {t("searched")}
            </Typography>
            <Typography variant="body1" sx={{ color: "#000", pt: 1.2 }}>
              {conversation[0].content}
            </Typography>
            {moduleInfo && (moduleInfo.SOPID || moduleInfo.DocumentID) && (
              <Chip
                icon={<LaunchIcon sx={{ fontSize: 16 }} />}
                label={moduleInfo.SOPID ? "View SOP" : "View Document"}
                size="small"
                clickable
                onClick={handleModuleNavigation}
                sx={{
                  ml: "auto",
                  borderColor: "#36A2EB",
                  color: "#36A2EB",
                  "&:hover": {
                    backgroundColor: "#36A2EB",
                    color: "white",
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#36A2EB",
                  },
                }}
              />
            )}
          </Box>
        )}

        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CircularProgress size={20} />
            <Typography variant="body2">{t("loadingGPT")}</Typography>
          </Box>
        )}

        {message && (
          <Box
            sx={{
              height: "45px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              padding: "1rem",
              width: "100%",
              border:
                messageColor === "green"
                  ? "1px solid #68CE6D80"
                  : "1px solid red",
              backgroundColor:
                messageColor === "green"
                  ? "#68CE6D0A"
                  : "rgba(255, 0, 0, 0.04)",
              gap: "10px",
            }}
          >
            {messageColor === "red" ? (
              <ErrorOutline sx={{ color: "red", fontSize: "20px" }} />
            ) : (
              <img src={Checkcircle} alt="Checkcircle" />
            )}
            <Typography color={messageColor} variant="body2">
              {message}
            </Typography>
          </Box>
        )}

        {clarification && (
          <Box
            sx={{
              width: "100%",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              padding: "0.75rem",
              marginBottom: "0.75rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
              boxShadow:
                "0 2px 3px -1px rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow:
                  "0 5px 8px -3px rgba(0, 0, 0, 0.08), 0 2px 3px -2px rgba(0, 0, 0, 0.03)",
                transform: "translateY(-1px)",
              },
            }}
          >
            {/* Header with icon */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                ?
              </Box>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#1e293b",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  letterSpacing: "-0.025em",
                }}
              >
                Clarification Needed
              </Typography>
            </Box>

            {/* Message */}
            <Typography
              variant="body2"
              sx={{
                color: "#475569",
                fontWeight: 500,
                lineHeight: 1.4,
                fontSize: "0.8rem",
                marginLeft: "32px", // Align with header text
              }}
            >
              {clarification.message}
            </Typography>

            {/* Options Section */}
            <Box sx={{ width: "100%", marginLeft: "32px" }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  fontWeight: 500,
                  marginBottom: "6px",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Select an option:
              </Typography>

              {/* Predefined Options */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginBottom: "8px",
                }}
              >
                {clarification.options.map((option, index) => (
                  <Button
                    key={option}
                    variant="contained"
                    onClick={() => handleClarificationChoice(option)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      background: `linear-gradient(135deg, ${
                        index % 3 === 0
                          ? "#3b82f6, #1d4ed8"
                          : index % 3 === 1
                          ? "#10b981, #047857"
                          : "#f59e0b, #d97706"
                      })`,
                      color: "white",
                      border: "none",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.12)",
                        background: `linear-gradient(135deg, ${
                          index % 3 === 0
                            ? "#2563eb, #1d4ed8"
                            : index % 3 === 1
                            ? "#059669, #047857"
                            : "#f59e0b, #b45309"
                        })`,
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>

              {/* Custom Input Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px",
                  backgroundColor: "rgba(248, 250, 252, 0.8)",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  width: "70%",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                    minWidth: "fit-content",
                  }}
                >
                  Or specify:
                </Typography>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Type your custom option..."
                  value={manualChoice}
                  onChange={(e) => setManualChoice(e.target.value)}
                  sx={{
                    flex: 1,
                    marginTop: "0.5rem",
                    minWidth: "120px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "7px",
                      backgroundColor: "white",
                      fontSize: "0.75rem",
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: "6px 8px",
                    },
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && manualChoice.trim()) {
                      handleManualChoiceSend();
                    }
                  }}
                />
                <IconButton
                  size="small"
                  onClick={handleManualChoiceSend}
                  disabled={!manualChoice.trim()}
                  sx={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "7px",
                    background: manualChoice.trim()
                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                      : "#f1f5f9",
                    color: manualChoice.trim() ? "white" : "#94a3b8",
                    border: "2px solid",
                    borderColor: manualChoice.trim() ? "#10b981" : "#e2e8f0",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      background: manualChoice.trim()
                        ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                        : "#f1f5f9",
                      transform: manualChoice.trim() ? "scale(1.05)" : "none",
                    },
                    "&:disabled": {
                      background: "#f1f5f9",
                      color: "#cbd5e1",
                      borderColor: "#e2e8f0",
                    },
                  }}
                >
                  <CheckIcon sx={{ fontSize: "14px" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}

        {messageColor === "green" &&
          conversation
            .filter((item) => item.type === "answer")
            .map((item, index) => (
              <Box
                key={index}
                sx={{
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  whiteSpace: "pre-wrap",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "400",
                    fontSize: "14px",
                    marginTop: "-10px",
                  }}
                >
                  {isCodeBlock(item.content)
                    ? renderCodeBlocks(item.content, index)
                    : formatContent(item.content)}
                </Typography>
              </Box>
            ))}
      </Box>
    </Card>
  );
};

export default GptCard;
