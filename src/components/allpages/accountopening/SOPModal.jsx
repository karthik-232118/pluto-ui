import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
  useTheme,
  Badge,
  Tooltip,
  Collapse,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import SecurityIcon from "@mui/icons-material/Security";
import PolicyIcon from "@mui/icons-material/Policy";
import ArticleIcon from "@mui/icons-material/Article";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BPMN from "../../bpmn/BPMN";
import { GetSopOneApi } from "../../../services/elements/Elements";

const SOPModal = ({ open, onClose, elementsDocumentFiles }) => {
  const [sopDetails, setSopDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDetail, setActiveDetail] = useState(null);

  const theme = useTheme();
  const bgColor = theme.palette.primary.main;

  React.useEffect(() => {
    if (open) {
      console.log(
        "elementsDocumentFiles in SOPModal:",
        elementsDocumentFiles?.data?.DocLinkedSOP?.[0]
      );
      const SOPID = elementsDocumentFiles?.data?.DocLinkedSOP?.[0]?.SOPID;
      if (SOPID) {
        setIsLoading(true);
        GetSopOneApi({ SOPID })
          .then((res) => {
            console.log("GetSopOneApi response:", res?.data?.data);
            setSopDetails(res?.data?.data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("GetSopOneApi error:", err);
            setIsLoading(false);
          });
      }
    }
  }, [open, elementsDocumentFiles]);

  const docLinkedSop = elementsDocumentFiles?.data?.DocLinkedSOP?.[0];
  const riskAndCompliance = docLinkedSop?.RiskAndCompliance;

  const badgeData = [
    {
      id: "risk",
      icon: SecurityIcon,
      label: "Risk",
      count: riskAndCompliance?.NoOfRisk || 0,
      details: riskAndCompliance?.RiskDetailsArrays || [],
      color: "#ef4444",
      bgColor: "#fef2f2",
    },
    {
      id: "compliance",
      icon: PolicyIcon,
      label: "Compliance",
      count: riskAndCompliance?.NoOfCompliance || 0,
      details: riskAndCompliance?.ComplianceDetailsArrays || [],
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
    {
      id: "clause",
      icon: ArticleIcon,
      label: "Clause",
      count: riskAndCompliance?.NoOfClause || 0,
      details: riskAndCompliance?.ClauseDetailsArrays || [],
      color: "#10b981",
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          background: "#f8fafc",
          maxHeight: "95vh",
          height: "95vh",
        },
      }}
    >
      {/* Enhanced Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}cc 100%)`,
          color: "white",
          padding: "24px",
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
            {sopDetails?.SOPName || "SOP Diagram"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.9)",
              opacity: 0.8,
            }}
          >
            Standard Operating Procedure & Process Flow
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
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
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
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

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
                    color: badgeData.find((b) => b.id === activeDetail)?.color,
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
                  {badgeData.find((b) => b.id === activeDetail)?.label} Details
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

      {/* BPMN Content */}
      <DialogContent
        sx={{
          padding: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fafafa",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            p: 3,
            backgroundColor: "#ffffff",
            borderRadius: "0 0 16px 16px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              border: "2px dashed #64748B",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f1f5f9",
              position: "relative",
              minHeight: "400px",
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CircularProgress
                  sx={{ color: bgColor }}
                  size={60}
                  thickness={4}
                />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Loading SOP diagram...
                </Typography>
              </Box>
            ) : sopDetails ? (
              <Box sx={{ width: "100%", height: "100%", p: 2 }}>
                <BPMN sopDetails={sopDetails} />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <ArticleIcon sx={{ fontSize: "4rem", color: "#cbd5e1" }} />
                <Typography
                  variant="h6"
                  sx={{ color: "#64748B", textAlign: "center" }}
                >
                  No SOP diagram available
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#94a3b8", textAlign: "center" }}
                >
                  Please check if the document has an associated SOP
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SOPModal;
