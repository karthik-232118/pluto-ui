import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Badge,
  Tooltip,
  Collapse,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SecurityIcon from "@mui/icons-material/Security";
import PolicyIcon from "@mui/icons-material/Policy";
import ArticleIcon from "@mui/icons-material/Article";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { BASE_URL } from "../../../config/urlConfig";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import OnlyOffice from "../../docViewer/OnlyOffice"; // Make sure OnlyOffice is correctly imported
import { useTheme } from "@mui/styles";

const SourceDocumentModal = ({ open, onClose, sopName, documentData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasDocument, setHasDocument] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");
  const [error, setError] = useState(null);
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;

  const [isDocx, setIsDocx] = useState(false);
  const [activeDetail, setActiveDetail] = useState(null);

  useEffect(() => {
    try {
      const docPath =
        documentData?.DocumentModule?.DocumentPath ||
        documentData?.DocumentPath;

      console.log(
        "SourceDocumentModal documentData:",
        documentData?.DocumentModule
      );

      if (docPath) {
        setIsLoading(true);
        setError(null);
        const fullUrl = `${BASE_URL}${docPath}`;
        console.log("Document URLsss:", fullUrl);
        setDocumentUrl(fullUrl);

        const fileExtension = docPath.split(".").pop().toLowerCase();
        setIsDocx(fileExtension === "docx");
        setHasDocument(true);
      } else {
        setHasDocument(false);
        setError("No document path found");
      }
    } catch (err) {
      setError(err.message);
      setHasDocument(false);
    } finally {
      setIsLoading(false);
    }
  }, [documentData]);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const riskAndCompliance =
    documentData?.DocumentModule?.RiskAndComplience ||
    documentData?.RiskAndComplience;

  const badgeData = [
    {
      id: "risk",
      icon: SecurityIcon,
      label: "Risk",
      count: riskAndCompliance?.NoOfRisk || 0,
      color: "#ef4444",
      details: riskAndCompliance?.RiskDetailsArrays || [],
      bgColor: "#fef2f2",
    },
    {
      id: "compliance",
      icon: PolicyIcon,
      label: "Compliance",
      count: riskAndCompliance?.NoOfCompliance || 0,
      color: "#3b82f6",
      details: riskAndCompliance?.ComplianceDetailsArrays || [],
      bgColor: "#eff6ff",
    },
    {
      id: "clause",
      icon: ArticleIcon,
      label: "Clause",
      count: riskAndCompliance?.NoOfClause || 0,
      color: "#10b981",
      details: riskAndCompliance?.ClauseDetailsArrays || [],
      bgColor: "#f0fdf4",
    },
  ];

  const handleBadgeClick = (badgeId) => {
    setActiveDetail(activeDetail === badgeId ? null : badgeId);
  };

  const renderDetailContent = (details, type, color) => {
    if (!details || details.length === 0) {
      return (
        <Typography
          variant="body2"
          sx={{ color: "#64748b", fontStyle: "italic" }}
        >
          No {type.toLowerCase()} details available
        </Typography>
      );
    }

    return (
      <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
        {details.map((detail, index) => (
          <Card
            key={index}
            sx={{
              mb: 2,
              border: `1px solid ${color}20`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                transform: "translateY(-1px)",
                transition: "all 0.2s ease-in-out",
              },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Chip
                  label={`${type} ${index + 1}`}
                  size="small"
                  sx={{
                    backgroundColor: color,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.6,
                  color: "#374151",
                  fontSize: "0.875rem",
                  textAlign: "justify",
                }}
              >
                {detail}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "95%",
          height: "95vh",
          bgcolor: "background.paper",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          borderRadius: "16px",
          p: 0,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Enhanced Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}cc 100%)`,
            p: 3,
            color: "white",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1, flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "600",
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                mb: 0.5,
              }}
            >
              {documentData?.DocumentModule?.DocumentName ||
                documentData?.DocumentName ||
                sopName ||
                "Source Document"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.9)",
                opacity: 0.8,
              }}
            >
              Document Analysis & Compliance Overview
            </Typography>
          </Box>

          {/* Badge Icons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            {badgeData.map((badge) => {
              const IconComponent = badge.icon;
              const isActive = activeDetail === badge.id;

              return (
                <Tooltip
                  key={badge.id}
                  title={`${badge.label}: ${badge.count} items`}
                  arrow
                >
                  <IconButton
                    onClick={() => handleBadgeClick(badge.id)}
                    sx={{
                      color: "white",
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.2)"
                        : "transparent",
                      border: isActive
                        ? "2px solid rgba(255,255,255,0.3)"
                        : "2px solid transparent",
                      borderRadius: "12px",
                      p: 1.2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.15)",
                        transform: "scale(1.05)",
                        border: "2px solid rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    <Badge
                      badgeContent={badge.count}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: badge.color,
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          minWidth: "20px",
                          height: "20px",
                          border: "2px solid white",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      <IconComponent sx={{ fontSize: "1.5rem" }} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              );
            })}

            <IconButton
              onClick={onClose}
              sx={{
                color: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                ml: 2,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  transform: "scale(1.05)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Detail Section */}
        <Collapse in={activeDetail !== null}>
          <Box
            sx={{
              p: 3,
              backgroundColor: activeDetail
                ? badgeData.find((b) => b.id === activeDetail)?.bgColor
                : "transparent",
              borderBottom: "1px solid #e5e7eb",
              maxHeight: "250px",
              overflowY: "auto",
            }}
          >
            {activeDetail && (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: badgeData.find((b) => b.id === activeDetail)
                        ?.color,
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {React.createElement(
                      badgeData.find((b) => b.id === activeDetail)?.icon,
                      { sx: { fontSize: "1.3rem" } }
                    )}
                    {badgeData.find((b) => b.id === activeDetail)?.label}{" "}
                    Details
                  </Typography>
                  <IconButton
                    onClick={() => setActiveDetail(null)}
                    size="small"
                    sx={{ ml: "auto", color: "#64748b" }}
                  >
                    <ExpandLessIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {renderDetailContent(
                  badgeData.find((b) => b.id === activeDetail)?.details,
                  badgeData.find((b) => b.id === activeDetail)?.label,
                  badgeData.find((b) => b.id === activeDetail)?.color
                )}
              </Box>
            )}
          </Box>
        </Collapse>

        {/* Document Content */}
        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            p: 3,
            backgroundColor: "#fafafa",
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CircularProgress size={60} sx={{ color: bgColor }} />
              <Typography variant="body1" sx={{ color: "#64748b" }}>
                Loading document...
              </Typography>
            </Box>
          ) : error ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: "error.main" }}>
                {error}
              </Typography>
            </Box>
          ) : hasDocument ? (
            <Box
              sx={{
                height: "100%",
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              {isDocx ? (
                <OnlyOffice
                  fileUrl={documentUrl}
                  documentName={documentData?.DocumentName}
                />
              ) : (
                <Worker
                  workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                >
                  <Viewer
                    fileUrl={documentUrl}
                    plugins={[defaultLayoutPluginInstance]}
                    onDocumentLoadError={(err) => setError(err.message)}
                  />
                </Worker>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <ArticleIcon sx={{ fontSize: "4rem", color: "#cbd5e1" }} />
              <Typography variant="h6" sx={{ color: "#64748B" }}>
                No document found
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default SourceDocumentModal;
