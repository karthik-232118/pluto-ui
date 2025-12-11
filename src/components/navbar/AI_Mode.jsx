import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";

// Add this utility function after imports and before ChartJS.register
const renderMessageWithCodeBlocks = (text) => {
  if (typeof text !== "string") return text;

  // Split text by code blocks
  const parts = text.split(/(```[\s\S]*?```|`[^`]*`)/g);

  return parts.map((part, index) => {
    // Multi-line code block
    if (part.startsWith("```") && part.endsWith("```")) {
      const codeContent = part.slice(3, -3);
      const lines = codeContent.split("\n");
      const language = lines[0].trim();
      const code = lines.slice(1).join("\n");

      return (
        <div
          key={index}
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #e9ecef",
            borderRadius: "8px",
            margin: "12px 0",
            position: "relative",
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
          }}
        >
          {language && (
            <div
              style={{
                backgroundColor: "#e9ecef",
                padding: "8px 12px",
                borderBottom: "1px solid #dee2e6",
                borderRadius: "8px 8px 0 0",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#495057",
              }}
            >
              {language}
            </div>
          )}
          <div
            style={{
              padding: "16px",
              overflow: "auto",
              maxHeight: "400px",
            }}
          >
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                backgroundColor: "#6c757d",    
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "12px",
                cursor: "pointer",
                zIndex: 1,
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#5a6268")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#6c757d")}
            >
              Copy
            </button>
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#212529",
              }}
            >
              <code>{code}</code>
            </pre>
          </div>
        </div>
      );
    }
    // Inline code
    else if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          style={{
            backgroundColor: "#f8f9fa",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "0.9em",
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            border: "1px solid #e9ecef",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    // Regular text - split by line breaks and render with proper formatting
    else {
      return part.split("\n").map((line, lineIndex, array) => (
        <span key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < array.length - 1 && <br />}
        </span>
      ));
    }
  });
};

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const colors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#F7464A",
  "#D4AF37",
  "#00A36C",
  "#8A2BE2",
];

const AI_Mode = () => {
  const muiTheme = useTheme();
  const [selectedMode, setSelectedMode] = useState("ALL");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageColor, setMessageColor] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [moduleInfo, setModuleInfo] = useState(null);
  const [activeTextAreaTab, setActiveTextAreaTab] = useState("GPT");
  const [chartData, setChartData] = useState(null);
  const [isPieChart, setIsPieChart] = useState(true);
  const [clarification, setClarification] = useState(null);
  const [manualChoice, setManualChoice] = useState("");
  const bgColor = muiTheme.palette.primary.main;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [conversations, setConversations] = useState([
    {
      id: 1,
      title: "SOP for Quality Control",
      mode: "SOP",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      title: "Product Documentation",
      mode: "Document",
      timestamp: "1 day ago",
    },
    {
      id: 3,
      title: "Safety Training Quiz",
      mode: "TestMCQ",
      timestamp: "3 days ago",
    },
  ]);

  const modes = [
    {
      name: "All",
      id: "ALL",
      description: "All available modes",
      gradient: "#fff",
    },
    {
      id: "SOP",
      name: "SOP",
      description: "Standard Operating Procedures",
      gradient: "#fff",
    },
    {
      id: "Document",
      name: "Document",
      description: "Document Generation",
      gradient: "#fff",
    },
    {
      id: "TestMCQ",
      name: "Test MCQ",
      description: "Multiple Choice Questions",
      gradient: "#fff",
    },
    {
      id: "TestSimulation",
      name: "Skill Assessment",
      description: "Interactive Simulations",
      gradient: "#fff",
    },
    {
      id: "TrainingSimulation",
      name: "Skill Building",
      description: "Training Scenarios",
      gradient: "#fff",
    },
  ];

  const theme = {
    bg: "#f8f9fa",
    text: "#333",
    sidebarBg: "#ffffff",
    sidebarBorder: "#e0e0e0",
    headerBg: "#ffffff",
    headerBorder: "#e0e0e0",
    chatBg: "#f8f9fa",
    inputBg: "#ffffff",
    inputBorder: "#e0e0e0",
    messageUserBg: "#1976d2",
    messageUserText: "#ffffff",
    messageAiBg: "#f5f7fa",
    messageAiText: "#333",
    cardBg: "#ffffff",
    cardBorder: "#e0e0e0",
    accent: "#1976d2",
    accentHover: "#1565c0",
    mutedText: "#666",
    disabled: "#cccccc",
    shadow: "rgba(0,0,0,0.1)",
  };

  const wsRef = useRef(null);
  const [wsReady, setWsReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Setup WebSocket for GPT requests
    wsRef.current = new window.WebSocket(import.meta.env.VITE_WSS_URL);
    wsRef.current.onopen = () => setWsReady(true);
    wsRef.current.onclose = () => setWsReady(false);
    wsRef.current.onerror = () => setWsReady(false);
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Helper to ensure WebSocket is open before sending
  const ensureWebSocket = (callback) => {
    if (!wsRef.current || wsRef.current.readyState !== 1) {
      wsRef.current = new window.WebSocket(import.meta.env.VITE_WSS_URL);
      wsRef.current.onopen = () => {
        setWsReady(true);
        callback();
      };
    } else {
      callback();
    }
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

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setMessage("");
    setMessageColor("");
    setChartData(null); // reset chart data on new message
    const access_token = localStorage.getItem("access_token");
    setChatHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    try {
      if (activeTextAreaTab === "Analytics") {
        const payload = {
          query: message,
          module_name: selectedMode || "all",
          access_token: access_token,
        };
        const res = await axios.post(
          import.meta.env.VITE_ANALYSIS_URL,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Handle clarification response for analytics
        if (res.data?.type === "clarification") {
          setClarification(res.data);
          setLoading(false);
          return;
        }

        // Parse chart data from API response
        const apiData = res.data;
        // Only handle if apiData.series exists and is array
        if (apiData && Array.isArray(apiData.series)) {
          // Prepare data for Pie and Bar
          const labels = apiData.series.map((s, idx) =>
            Array.isArray(s.name) ? s.name[0] : `Series ${idx + 1}`
          );
          const data = apiData.series.map((s) =>
            Array.isArray(s.data) ? s.data[0] : 0
          );
          const pieData = {
            labels,
            datasets: [
              {
                data,
                backgroundColor: colors.slice(0, data.length),
                borderWidth: 1,
              },
            ],
          };
          const barData = {
            labels,
            datasets: [
              {
                label: "Value",
                data,
                backgroundColor: colors.slice(0, data.length),
              },
            ],
          };
          setChartData({ pieData, barData });
        } else {
          setChartData(null);
        }

        setChatHistory((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: clarification ? (
              <div
                style={{
                  width: "100%",
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  borderRadius: "12px",
                  padding: "0.75rem",
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  boxShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                }}
              >
                {/* Clarification UI - same as your provided code */}
                {/* Header with icon */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
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
                  </div>
                  <span
                    style={{
                      color: "#1e293b",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    Clarification Needed
                  </span>
                </div>
                {/* Message */}
                <span
                  style={{
                    color: "#475569",
                    fontWeight: 500,
                    lineHeight: 1.4,
                    fontSize: "0.8rem",
                    marginLeft: "32px",
                  }}
                >
                  {clarification.message}
                </span>
                {/* Options Section */}
                <div style={{ width: "100%", marginLeft: "32px" }}>
                  <span
                    style={{
                      color: "#64748b",
                      fontWeight: 500,
                      marginBottom: "6px",
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Select an option:
                  </span>
                  {/* Predefined Options */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "8px",
                    }}
                  >
                    {clarification.options.map((option, index) => (
                      <button
                        key={option}
                        onClick={() => handleClarificationChoice(option)}
                        style={{
                          textTransform: "none",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          background:
                            index % 3 === 0
                              ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
                              : index % 3 === 1
                              ? "linear-gradient(135deg, #10b981, #047857)"
                              : "linear-gradient(135deg, #f59e0b, #d97706)",
                          color: "white",
                          border: "none",
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
                          marginRight: "6px",
                          marginBottom: "6px",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {/* Custom Input Section */}
                  <div
                    style={{
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
                    <span
                      style={{
                        color: "#64748b",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        minWidth: "fit-content",
                      }}
                    >
                      Or specify:
                    </span>
                    <input
                      type="text"
                      value={manualChoice}
                      onChange={(e) => setManualChoice(e.target.value)}
                      style={{
                        flex: 1,
                        marginTop: "0.5rem",
                        minWidth: "120px",
                        borderRadius: "7px",
                        backgroundColor: "white",
                        fontSize: "0.75rem",
                        padding: "6px 8px",
                        border: "1px solid #e2e8f0",
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && manualChoice.trim()) {
                          handleManualChoiceSend();
                        }
                      }}
                    />
                    <button
                      onClick={handleManualChoiceSend}
                      disabled={!manualChoice.trim()}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "7px",
                        background: manualChoice.trim()
                          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                          : "#f1f5f9",
                        color: manualChoice.trim() ? "white" : "#94a3b8",
                        border: "2px solid",
                        borderColor: manualChoice.trim()
                          ? "#10b981"
                          : "#e2e8f0",
                        transition: "all 0.15s ease",
                        cursor: manualChoice.trim() ? "pointer" : "not-allowed",
                      }}
                    >
                      ✓
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              "[Chart Response]"
            ),
            sender: "ai",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isChart: !clarification,
          },
        ]);
      } else {
        const payload = {
          prompt: message,
          auth_token: access_token,
          module_name: selectedMode,
        };
        setClarification(null);
        ensureWebSocket(() => {
          wsRef.current.send(JSON.stringify(payload));
          wsRef.current.onmessage = (event) => {
            let res;
            try {
              res = JSON.parse(event.data);
            } catch (e) {
              res = {};
            }
            if (res?.type === "clarification") {
              setClarification(res);
              setLoading(false);
              return;
            }
            const answer =
              res?.qa?.[0]?.answer || res?.response || "No response found.";
            setMessage("");
            setMessageColor("green");
            setChatHistory((prev) => [
              ...prev,
              {
                id: Date.now() + 1,
                text: answer,
                sender: "ai",
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
            setSuggestedQuestions(res?.["suggested questions"] || []);
            setModuleInfo(res?.module || null);
            if (res?.module?.SOPID || res?.module?.DocumentID) {
              handleModuleNavigation();
            }
            setLoading(false);
          };
          wsRef.current.onerror = () => {
            setMessage("An error occurred. Please try again.");
            setMessageColor("red");
            setChatHistory((prev) => [
              ...prev,
              {
                id: Date.now() + 2,
                text: "An error occurred. Please try again.",
                sender: "ai",
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
            setLoading(false);
          };
        });
      }
    } catch (err) {
      console.error("Error: ", err.response ? err.response.data : err.message);
      setMessage("An error occurred. Please try again.");
      setMessageColor("red");
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "An error occurred. Please try again.",
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setMessage("");
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setChatHistory([]);
    const newConv = {
      id: Date.now(),
      title: `New ${selectedMode} Chat`,
      mode: selectedMode,
      timestamp: "now",
    };
    setConversations((prev) => [newConv, ...prev]);
  };

  const getCurrentMode = () => modes.find((mode) => mode.id === selectedMode);

  const handleSuggestedClick = (q) => {
    setMessage(q);
    setInputFocused(true);
  };

  const handleModuleNavigation = () => {
    // if (moduleInfo?.SOPID) {
    //   navigate(`/sops/view/${moduleInfo.SOPID}`);
    // } else if (moduleInfo?.DocumentID) {
    //   navigate(`/documents/view/${moduleInfo.DocumentID}`);
    // }
  };

  const styles = {
    container: {
      display: "flex",
      height: "93vh",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: theme.bg,
      color: theme.text,
      transition: "all 0.3s ease",
    },
    sidebar: {
      width: sidebarOpen ? "280px" : "0",
      backgroundColor: theme.sidebarBg,
      borderRight: `1px solid ${theme.sidebarBorder}`,
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s ease",
      overflow: "hidden",
      boxShadow: `2px 0 10px ${theme.shadow}`,
      "@media (max-width: 768px)": {
        width: "100%",
        height: sidebarOpen ? "auto" : "0",
        borderRight: "none",
        borderBottom: `1px solid ${theme.sidebarBorder}`,
      },
    },
    sidebarHeader: {
      padding: "16px",
      borderBottom: `1px solid ${theme.sidebarBorder}`,
      backgroundColor: theme.sidebarBg,
    },
    newChatBtn: {
      width: "100%",
      padding: "12px",
      backgroundColor: bgColor,
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "16px",
      transition: "background-color 0.2s",
      ":hover": {
        backgroundColor: theme.accentHover,
      },
    },
    modesSection: {
      padding: "16px",
      borderBottom: `1px solid ${theme.sidebarBorder}`,
    },
    sectionTitle: {
      fontSize: "12px",
      fontWeight: "600",
      color: theme.mutedText,
      marginBottom: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    modeItem: {
      display: "flex",
      alignItems: "center",
      padding: "8px",
      borderRadius: "8px",
      cursor: "pointer",
      marginBottom: "4px",
      transition: "all 0.2s",
      border: "1px solid transparent",
      backgroundColor: "transparent",
      ":hover": {
        backgroundColor: theme.cardBg,
      },
    },
    modeItemSelected: {
      backgroundColor: theme.messageAiBg,
      borderColor: theme.accent,
    },
    modeIcon: {
      fontSize: "18px",
      marginRight: "10px",
      width: "22px",
      textAlign: "center",
    },
    modeInfo: {
      flex: 1,
    },
    modeName: {
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "1px",
      color: theme.text,
    },
    modeDescription: {
      fontSize: "11px",
      color: theme.mutedText,
      lineHeight: "1.2",
    },
    historySection: {
      flex: 1,
      padding: "16px",
      overflow: "auto",
      msOverflowStyle: "none",
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    historyItem: {
      padding: "8px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      marginBottom: "4px",
      transition: "background-color 0.2s",
      fontSize: "14px",
      color: theme.text,
      ":hover": {
        backgroundColor: theme.cardBg,
      },
    },
    mainContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.chatBg,
      overflow: "hidden",
    },
    header: {
      padding: "12px 16px",
      borderBottom: `1px solid ${theme.headerBorder}`,
      backgroundColor: theme.headerBg,
      display: "flex",
      alignItems: "center",
      gap: "12px",
      boxShadow: `0 2px 4px ${theme.shadow}`,
      zIndex: 10,
      "@media (max-width: 768px)": {
        padding: "10px",
      },
    },
    toggleBtn: {
      background: "none",
      border: "none",
      fontSize: "18px",
      cursor: "pointer",
      padding: "8px",
      color: theme.text,
    },
    headerTitle: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flex: 1,
    },
    headerIcon: {
      fontSize: "22px",
    },
    headerText: {
      fontSize: "18px",
      fontWeight: "600",
      margin: 0,
      color: theme.text,
      "@media (max-width: 480px)": {
        fontSize: "16px",
      },
    },
    badge: {
      backgroundColor: theme.cardBg,
      color: theme.mutedText,
      padding: "4px 10px",
      borderRadius: "16px",
      fontSize: "12px",
      border: `1px solid ${theme.cardBorder}`,
      "@media (max-width: 480px)": {
        display: "none",
      },
    },
    chatArea: {
      flex: 1,
      overflowY: "auto",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      msOverflowStyle: "none",
      scrollbarWidth: "none",
      position: "relative",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    welcomeScreen: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "20px",
      overflow: "auto",
    },
    welcomeIcon: {
      fontSize: "64px",
      marginBottom: "20px",
      background: getCurrentMode()?.gradient,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    welcomeTitle: {
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "10px",
      color: theme.text,
      textAlign: "center",
      marginTop: "-6rem",
    },
    welcomeSubtitle: {
      fontSize: "15px",
      color: theme.mutedText,
      marginBottom: "24px",
      lineHeight: "1.5",
    },
    featureTags: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    tag: {
      backgroundColor: theme.cardBg,
      color: theme.accent,
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "14px",
      border: `1px solid ${theme.accent}20`,
      fontWeight: "500",
      boxShadow: `0 2px 8px ${theme.shadow}`,
    },
    messageContainer: {
      display: "flex",
      marginBottom: "16px",
      alignItems: "flex-start",
      justifyContent: "center",
      width: "100%",
      maxWidth: "800px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    userMessage: {
      justifyContent: "flex-end",
    },
    messageAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      fontWeight: "500",
      marginRight: "12px",
      background: theme.messageUserBg,
      color: "white",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      flexShrink: 0,
      transition: "transform 0.2s ease",
      ":hover": {
        transform: "scale(1.05)",
      },
    },
    userAvatar: {
      backgroundColor: theme.messageUserBg,
      marginLeft: "12px",
      marginRight: "0",
    },
    aiAvatar: {
      background: theme.messageUserBg,
      fontSize: "24px",
    },
    messageBubble: {
      maxWidth: "calc(100% - 100px)",
      padding: "16px 20px",
      borderRadius: "18px",
      boxShadow: `0 2px 12px ${theme.shadow}`,
      backgroundColor: theme.messageAiBg,
      color: theme.messageAiText,
      wordBreak: "break-word",
      lineHeight: "1.5",
    },
    userMessageBubble: {
      backgroundColor: theme.messageUserBg,
      color: theme.messageUserText,
    },
    messageText: {
      fontSize: "15px",
      lineHeight: "1.6",
      margin: 0,
    },
    messageTime: {
      fontSize: "12px",
      opacity: 0.7,
      marginTop: "8px",
      display: "block",
      textAlign: "right",
    },
    inputArea: {
      padding: "16px",
      borderTop: `1px solid ${theme.headerBorder}`,
      backgroundColor: theme.headerBg,
    },
    inputContainer: {
      maxWidth: "800px",
      margin: "0 auto",
      position: "relative",
      display: "flex",
      alignItems: "flex-end",
      backgroundColor: theme.inputBg,
      border: `2px solid ${theme.inputBorder}`,
      borderRadius: "16px",
      padding: "12px",
      boxShadow: `0 4px 16px ${theme.shadow}`,
      transition: "all 0.2s ease",
    },
    inputContainerFocused: {
      borderColor: theme.accent,
      boxShadow: `0 4px 16px ${theme.accent}20`,
    },
    textInput: {
      flex: 1,
      border: "none",
      outline: "none",
      padding: "12px 16px",
      fontSize: "15px",
      resize: "none",
      backgroundColor: "transparent",
      minHeight: "24px",
      maxHeight: "120px",
      fontFamily: "inherit",
      color: theme.text,
      lineHeight: "1.5",
    },
    sendBtn: {
      backgroundColor: theme.accent,
      color: "white",
      border: "none",
      borderRadius: "12px",
      padding: "12px 16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "8px",
      transition: "all 0.2s ease",
      ":hover": {
        backgroundColor: theme.accentHover,
        transform: "scale(1.05)",
      },
    },
    sendBtnDisabled: {
      backgroundColor: theme.disabled,
      cursor: "not-allowed",
      ":hover": {
        transform: "none",
      },
    },
    suggestedQuestions: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      justifyContent: "center",
      margin: "16px auto",
      maxWidth: "800px",
      width: "100%",
    },
    suggestedQuestion: {
      background: theme.cardBg,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: "16px",
      padding: "8px 16px",
      fontSize: "14px",
      color: theme.text,
      cursor: "pointer",
      transition: "all 0.2s ease",
      ":hover": {
        background: theme.accent,
        color: "white",
        borderColor: theme.accent,
        transform: "translateY(-2px)",
      },
    },
    textAreaContainer: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },
    textAreaTabs: {
      display: "flex",
      gap: "4px",
      borderBottom: `1px solid ${theme.inputBorder}`,
      padding: "4px 8px",
    },
    textAreaTab: {
      padding: "4px 12px",
      fontSize: "12px",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: theme.mutedText,
      borderRadius: "4px 4px 0 0",
    },
    textAreaTabActive: {
      color: theme.accent,
      background: `${theme.accent}10`,
      fontWeight: "500",
    },
  };

  const mergeStyles = (baseStyle, ...conditionalStyles) => {
    return {
      ...baseStyle,
      ...Object.assign({}, ...conditionalStyles),
    };
  };

  const chatAreaRef = React.useRef(null);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <button style={styles.newChatBtn} onClick={handleNewChat}>
            <span style={{ color: "white" }}>{t("newChat")}</span>
          </button>
        </div>
        {/* <div
          style={{
            padding: "16px 12px",
            borderBottom: `1px solid ${theme.sidebarBorder}`,
            flex: 1,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: theme.mutedText,
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {t("history")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: `1px solid ${theme.sidebarBorder}`,
                  backgroundColor: theme.sidebarBg,
                  transition: "all 0.2s ease",
                  ":hover": {
                    backgroundColor: `${theme.accent}10`,
                    borderColor: theme.accent,
                    transform: "translateX(4px)",
                  },
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    marginBottom: "4px",
                    color: theme.text,
                  }}
                >
                  {conv.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: theme.mutedText,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{conv.mode}</span>
                  <span>{conv.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
      <div style={styles.mainContent}>
        <div style={styles.header}>
          {/* <button
            style={styles.toggleBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button> */}
          <div style={styles.headerTitle}>
            <div style={styles.headerIcon}>{getCurrentMode()?.icon}</div>
            <h1 style={styles.headerText}>
              {getCurrentMode()?.name} Assistant
            </h1>
          </div>
          <div style={styles.badge}>{getCurrentMode()?.description}</div>
        </div>
        <div style={styles.chatArea} ref={chatAreaRef}>
          {chatHistory.length === 0 ? (
            <div style={styles.welcomeScreen}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "24px",
                  width: "100%",
                  maxWidth: "800px",
                  margin: "auto",
                  padding: "20px",
                }}
              >
                <h2 style={styles.welcomeTitle}>{t("welcomeTitle")}</h2>
                <div
                  style={{
                    ...styles.inputContainer,
                    width: "100%",
                    borderColor:
                      inputFocused || message.trim()
                        ? theme.accent
                        : theme.inputBorder,
                  }}
                >
                  <div style={styles.textAreaContainer}>
                    <div style={styles.textAreaTabs}>
                      <button
                        style={{
                          ...styles.textAreaTab,
                          ...(activeTextAreaTab === "GPT"
                            ? styles.textAreaTabActive
                            : {}),
                        }}
                        onClick={() => setActiveTextAreaTab("GPT")}
                      >
                        {t("gptTab")}
                      </button>
                      <button
                        style={{
                          ...styles.textAreaTab,
                          ...(activeTextAreaTab === "Analytics"
                            ? styles.textAreaTabActive
                            : {}),
                        }}
                        onClick={() => setActiveTextAreaTab("Analytics")}
                      >
                        {t("analyticsTab")}
                      </button>
                    </div>
                    <textarea
                      style={styles.textInput}
                      placeholder={
                        activeTextAreaTab === "GPT"
                          ? `${t("gptPlaceholder")} ${
                              getCurrentMode()?.name
                            } ${t("assistantPlaceholder")}`
                          : t("analyticsPlaceholder")
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      rows={1}
                      onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height =
                          Math.min(e.target.scrollHeight, 120) + "px";
                      }}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                    />
                  </div>
                  <button
                    style={{
                      ...styles.sendBtn,
                      ...(!message.trim() ? styles.sendBtnDisabled : {}),
                    }}
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    ➤
                  </button>
                </div>
                <div style={styles.featureTags}>
                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    {modes.map((mode) => {
                      const isActive = selectedMode === mode.id;
                      return (
                        <span
                          key={mode.id}
                          style={{
                            ...styles.tag,
                            background: isActive ? theme.accent : mode.gradient,
                            color: isActive ? "#fff" : theme.accent,
                            border: "none",
                            cursor: "pointer",
                            transform: isActive ? "scale(1.05)" : "none",
                            transition: "all 0.3s ease",
                            margin: "4px",
                          }}
                          onClick={() => setSelectedMode(mode.id)}
                        >
                          {mode.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}>
              {chatHistory.map((msg, idx) => (
                <div
                  key={msg.id}
                  style={mergeStyles(
                    styles.messageContainer,
                    msg.sender === "user" ? styles.userMessage : {}
                  )}
                >
                  {msg.sender === "ai" && (
                    <div
                      style={mergeStyles(styles.messageAvatar, styles.aiAvatar)}
                    >
                      {getCurrentMode()?.icon || "🤖"}
                    </div>
                  )}
                  <div
                    style={mergeStyles(
                      styles.messageBubble,
                      msg.sender === "user" ? styles.userMessageBubble : {}
                    )}
                  >
                    {/* Chart rendering for Analytics AI response */}
                    {msg.isChart && chartData ? (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <span style={{ fontWeight: 500, marginRight: 12 }}>
                            Chart Type:
                          </span>
                          <button
                            style={{
                              padding: "6px 14px",
                              borderRadius: "16px",
                              border: "1px solid #1976d2",
                              background: isPieChart ? "#1976d2" : "#fff",
                              color: isPieChart ? "#fff" : "#1976d2",
                              marginRight: 8,
                              cursor: "pointer",
                              fontWeight: 500,
                            }}
                            onClick={() => setIsPieChart(true)}
                          >
                            Pie
                          </button>
                          <button
                            style={{
                              padding: "6px 14px",
                              borderRadius: "16px",
                              border: "1px solid #1976d2",
                              background: !isPieChart ? "#1976d2" : "#fff",
                              color: !isPieChart ? "#fff" : "#1976d2",
                              cursor: "pointer",
                              fontWeight: 500,
                            }}
                            onClick={() => setIsPieChart(false)}
                          >
                            Bar
                          </button>
                        </div>
                        <div style={{ maxWidth: 400, margin: "0 auto" }}>
                          {isPieChart ? (
                            <Pie data={chartData.pieData} />
                          ) : (
                            <Bar
                              data={chartData.barData}
                              options={{
                                responsive: true,
                                plugins: {
                                  legend: { display: false },
                                  title: { display: false },
                                },
                                scales: {
                                  y: { beginAtZero: true },
                                },
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={styles.messageText}>
                          {renderMessageWithCodeBlocks(msg.text)}
                        </div>
                        <span style={styles.messageTime}>{msg.timestamp}</span>
                      </>
                    )}
                  </div>
                  {msg.sender === "user" && (
                    <div
                      style={mergeStyles(
                        styles.messageAvatar,
                        styles.userAvatar
                      )}
                    >
                      👤
                    </div>
                  )}
                  {msg.sender === "ai" &&
                    idx === chatHistory.length - 1 &&
                    moduleInfo &&
                    (moduleInfo.SOPID || moduleInfo.DocumentID) && (
                      <div style={{ marginTop: "12px", textAlign: "right" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            background: theme.cardBg,
                            color: theme.accent,
                            border: `1px solid ${theme.accent}`,
                            borderRadius: "16px",
                            padding: "8px 16px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            boxShadow: `0 2px 8px ${theme.shadow}`,
                            marginLeft: "8px",
                            transition: "all 0.2s ease",
                            ":hover": {
                              background: theme.accent,
                              color: "white",
                            },
                          }}
                          onClick={() => {
                            if (moduleInfo.SOPID) {
                              navigate(`/sops/view/${moduleInfo.SOPID}`);
                            } else if (moduleInfo.DocumentID) {
                              navigate(
                                `/documents/view/${moduleInfo.DocumentID}`
                              );
                            }
                          }}
                        >
                          {moduleInfo.SOPID ? "View SOP" : "View Document"}
                          <LaunchIcon style={{ fontSize: 18, marginLeft: 4 }} />
                        </span>
                      </div>
                    )}
                </div>
              ))}
              {suggestedQuestions.length > 0 && (
                <div style={styles.suggestedQuestions}>
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      style={styles.suggestedQuestion}
                      onClick={() => handleSuggestedClick(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {clarification && (
          <div
            style={{
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
            }}
          >
            {/* Header with icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }}
            >
              <div
                style={{
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
              </div>
              <span
                style={{
                  color: "#1e293b",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  letterSpacing: "-0.025em",
                }}
              >
                Clarification Needed
              </span>
            </div>
            {/* Message */}
            <span
              style={{
                color: "#475569",
                fontWeight: 500,
                lineHeight: 1.4,
                fontSize: "0.8rem",
                marginLeft: "32px",
              }}
            >
              {clarification.message}
            </span>
            {/* Options Section */}
            <div style={{ width: "100%", marginLeft: "32px" }}>
              <span
                style={{
                  color: "#64748b",
                  fontWeight: 500,
                  marginBottom: "6px",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Select an option:
              </span>
              {/* Predefined Options */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginBottom: "8px",
                }}
              >
                {clarification.options.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => handleClarificationChoice(option)}
                    style={{
                      textTransform: "none",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      background:
                        index % 3 === 0
                          ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
                          : index % 3 === 1
                          ? "linear-gradient(135deg, #10b981, #047857)"
                          : "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      border: "none",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
                      marginRight: "6px",
                      marginBottom: "6px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {/* Custom Input Section */}
              <div
                style={{
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
                <span
                  style={{
                    color: "#64748b",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                    minWidth: "fit-content",
                  }}
                >
                  Or specify:
                </span>
                <input
                  type="text"
                  value={manualChoice}
                  onChange={(e) => setManualChoice(e.target.value)}
                  style={{
                    flex: 1,
                    marginTop: "0.5rem",
                    minWidth: "120px",
                    borderRadius: "7px",
                    backgroundColor: "white",
                    fontSize: "0.75rem",
                    padding: "6px 8px",
                    border: "1px solid #e2e8f0",
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && manualChoice.trim()) {
                      handleManualChoiceSend();
                    }
                  }}
                />
                <button
                  onClick={handleManualChoiceSend}
                  disabled={!manualChoice.trim()}
                  style={{
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
                    cursor: manualChoice.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  ✓
                </button>
              </div>
            </div>
          </div>
        )}
        {loading && (
          <div
            style={{
              textAlign: "center",
              color: theme.accent,
              marginBottom: 12,
            }}
          >
            Generating response...
          </div>
        )}
        {chatHistory.length > 0 && (
          <div style={styles.inputArea}>
            <div
              style={mergeStyles(
                { marginBottom: "1rem !important" },
                styles.inputContainer,
                inputFocused || message.trim()
                  ? styles.inputContainerFocused
                  : {}
              )}
            >
              <div style={styles.textAreaContainer}>
                <div style={styles.textAreaTabs}>
                  <button
                    style={{
                      ...styles.textAreaTab,
                      ...(activeTextAreaTab === "GPT"
                        ? styles.textAreaTabActive
                        : {}),
                    }}
                    onClick={() => setActiveTextAreaTab("GPT")}
                  >
                    GPT
                  </button>
                  <button
                    style={{
                      ...styles.textAreaTab,
                      ...(activeTextAreaTab === "Analytics"
                        ? styles.textAreaTabActive
                        : {}),
                    }}
                    onClick={() => setActiveTextAreaTab("Analytics")}
                  >
                    Analytics
                  </button>
                </div>
                <textarea
                  style={styles.textInput}
                  placeholder={
                    activeTextAreaTab === "GPT"
                      ? `Ask ${getCurrentMode()?.name} Assistant...`
                      : "Ask Analytics question..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height =
                      Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <button
                style={mergeStyles(
                  styles.sendBtn,
                  !message.trim() ? styles.sendBtnDisabled : {}
                )}
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                ➤
              </button>
            </div>
            {/* Show only "All" mode below the question input */}
            <div style={styles.featureTags}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {modes
                  .filter((mode) => mode.id === "ALL")
                  .map((mode) => {
                    const isActive = selectedMode === mode.id;
                    return (
                      <span
                        key={mode.id}
                        style={{
                          ...styles.tag,
                          background: isActive ? theme.accent : mode.gradient,
                          color: isActive ? "#fff" : theme.accent,
                          border: "none",
                          cursor: "pointer",
                          transform: isActive ? "scale(1.05)" : "none",
                          transition: "all 0.3s ease",
                          margin: "4px",
                        }}
                        onClick={() => setSelectedMode(mode.id)}
                      >
                        {mode.name}
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AI_Mode;
