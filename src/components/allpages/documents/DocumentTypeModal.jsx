import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Card,
  IconButton,
} from "@mui/material";
import {
  NoteAdd as CreateIcon,
  Upload as UploadIcon,
  Close as CloseIcon,
  Description as DocumentIcon,
  Assignment as TemplateIcon,
} from "@mui/icons-material";
import { useHeadingBgColor } from "../../useHeadingBgColor";
import { GetDocEmptyTemplateApi } from "../../../services/docTemplate/DocTemplate";
import { useTranslation } from "react-i18next";

const DocumentTypeModal = ({ open, onClose, onSelectOption, onCloseAll }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const bgColor = useHeadingBgColor();
  const { t } = useTranslation();
  const options = [
    {
      id: "create-blank",
      title: t("Create Blank Document / Create Template"),
      description: t("Start with a fresh, empty template and build from scratch"),
      icon: <CreateIcon sx={{ fontSize: 44, color: "#fff" }} />,
      gradient: "linear-gradient(135deg, #dadef1 0%, #764ba2 100%)",
      hoverGradient: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    }, 
    {
      id: "upload-document",  
      title: t("Upload Document"),
      description: t("Upload an existing document or template from your device"),
      icon: <UploadIcon sx={{ fontSize: 44, color: "#fff" }} />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      hoverGradient: "linear-gradient(135deg, #e581f0 0%, #f04560 100%)",
    },
    {
      id: "create-from-template",
      title: t("Create From Template"),
      description: t("Choose from available templates to start your document"),
      icon: <TemplateIcon sx={{ fontSize: 44, color: "#fff" }} />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      hoverGradient: "linear-gradient(135deg, #36c86e 0%, #2ed9c3 100%)",
    },
  ];

  const handleSelect = async (optionId) => {
    if (isProcessing) return; 
    setIsProcessing(true);
    setSelectedOption(optionId);
    localStorage.setItem("selectedDocumentType", optionId);
    if (optionId === "create-blank") {
      try {
        const response = await GetDocEmptyTemplateApi();
        onSelectOption(optionId, response);
        onClose();
      } catch (error) {
        console.error("Error fetching empty template:", error);
        onSelectOption(optionId, null);
        onClose();
      }
    } else {
      onSelectOption(optionId);
      onClose();
    }
    
    setIsProcessing(false);
    setSelectedOption(null);
  };

  const handleCloseAll = () => {
    setSelectedOption(null);
    if (onCloseAll) onCloseAll();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseAll}
      maxWidth="md"
      fullWidth
      fullScreen
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          background: "#ffffff",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: bgColor,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 3,
          px: 4,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DocumentIcon sx={{ fontSize: 28, color: "white" }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="500" sx={{ mb: 0.5 }}>
              {t("Choose Document Type")}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "14px" }}>
              {t("Select how you'd like to get started")}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleCloseAll}
          size="small"
          sx={{
            color: "white",
            zIndex: 1,
            background: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.2)",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          background: "linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 4,
            justifyContent: "start",
            marginTop: 4,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
          }}
        >
          {options.map((option) => (
            <Card
              key={option.id}
              sx={{
                width: 280,
                height: 240,
                p: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: isProcessing ? "default" : "pointer",
                border:
                  selectedOption === option.id
                    ? bgColor
                    : "2px solid transparent",
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
                background: selectedOption === option.id ? "#f8faff" : "white",
                boxShadow:
                  selectedOption === option.id
                    ? "0 20px 40px rgba(102, 126, 234, 0.2)"
                    : "0 8px 25px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform:
                  selectedOption === option.id
                    ? "translateY(-8px) scale(1.02)"
                    : "translateY(0) scale(1)",
                "&:hover": !isProcessing && {
                  transform:
                    selectedOption === option.id
                      ? "translateY(-8px) scale(1.02)"
                      : "translateY(-6px) scale(1.01)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                  borderColor:
                    selectedOption === option.id ? "#667eea" : "#d1d5db",
                  "& .icon-container": {
                    background: option.hoverGradient,
                    transform: "scale(1.1)",
                  },
                },
                opacity: isProcessing && selectedOption !== option.id ? 0.7 : 1,
              }}
              onClick={() => !isProcessing && handleSelect(option.id)}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background:
                    selectedOption === option.id
                      ? option.gradient
                      : "transparent",
                  transition: "all 0.3s ease",
                }}
              />
              <Box
                className="icon-container"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 90,
                  height: 90,
                  borderRadius: 3,
                  background: option.gradient,
                  mb: 3,
                  mt: 2,
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {option.icon}
              </Box>

              {/* Content */}
              <Box sx={{ px: 3, pb: 3, textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#1f2937",
                    mb: 1.5,
                    lineHeight: 1.2,
                  }}
                >
                  {option.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    lineHeight: 1.5,
                    fontSize: "14px",
                  }}
                >
                  {option.description}
                </Typography>
              </Box>

              {/* Selection Indicator */}
              {selectedOption === option.id && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "#667eea",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
                    animation: "pulse 1.5s infinite",
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "white",
                    }}
                  />
                </Box>
              )}

              {isProcessing && selectedOption === option.id && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(255, 255, 255, 0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "3px solid #f3f3f3",
                      borderTop: "3px solid #667eea",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                </Box>
              )}
            </Card>
          ))}
        </Box>
      </DialogContent>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Dialog>
  );
};

export default DocumentTypeModal;