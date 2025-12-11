import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import {
  Add,
  Close,
  Description,
  ExpandMore,
  Remove,
} from "@mui/icons-material";
import RiskAnalysisAccordion from "./RiskAnalysisAccordion";
import RiskAssessmentsAccordion from "./RiskAssessmentsAccordion";
import RiskMonitoringReviewsAccordion from "./RiskMonitoringReviewsAccordion";
import RiskTreatmentsAccordion from "./RiskTreatmentsAccordion";
import { BASE_URL } from "../../../config/urlConfig";
import PropTypes from "prop-types";

const RisksModal = ({ open, handleClose, riskData }) => {
  const [expandedAll, setExpandedAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  console.log("RisksModalRiskData:", riskData);

  useEffect(() => {
    if (riskData !== undefined && riskData !== null) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [riskData]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleToggleAll = () => {
    setExpandedAll(!expandedAll);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const RiskLength = riskData?.length || 0;

  const handleOpenDocument = (documentPath) => {
    window.open(`${BASE_URL}/${documentPath}`, "_blank");
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 800,
          maxHeight: "95vh",
          overflowY: "hidden",
          bgcolor: "background.paper",
          borderRadius: "12px",
          boxShadow: 24,
          p: 0,
          background: "linear-gradient(145deg, #f8fbff 0%, #ebf3ff 100%)",
          border: "none",
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0,
            background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
            color: "white",
            p: 3,
            borderRadius: "12px 12px 0 0",
            position: "relative",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 450, letterSpacing: 0.5 }}>
            {`Risk Details (${RiskLength})`}
          </Typography>

          <IconButton
            onClick={handleClose}
            sx={{
              color: "white",
              position: "absolute",
              right: 16,
              top: 16,
              backgroundColor: "rgba(255,255,255,0.2)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <Close sx={{ fontSize: 26 }} />
          </IconButton>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
              background: "white",
              borderRadius: "0 0 12px 12px",
            }}
          >
            <CircularProgress size={40} sx={{ color: "#2196f3" }} />
          </Box>
        ) : riskData && riskData?.length > 0 ? (
          <>
            {riskData?.length > 1 && (
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  bgcolor: "#f5f9ff",
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#2196f3",
                    height: 2,
                    marginLeft: "-0.5rem",
                  },
                }}
              >
                {riskData?.map((risk, index) => (
                  <Tab
                    key={risk.RiskID}
                    label={`${risk.RiskName} (${index + 1})`}
                    sx={{
                      marginLeft: "1rem",
                      textTransform: "none",
                      fontWeight: 500,
                      minWidth: 0,
                      px: 2,
                      "&.Mui-selected": {
                        color: "#2196f3",
                      },
                    }}
                  />
                ))}
              </Tabs>
            )}

            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 0,
                background: "white",
                borderRadius: "0 0 12px 12px",
                border: "none",
                maxHeight: "calc(90vh - 80px)",
                overflowY: "auto",
                "&::-webkit-scrollbar": { display: "none" },
                "-ms-overflow-style": "none",
                "scrollbar-width": "none",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 3,
                  mb: -2,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#5f6368",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Risk Name
                  </Typography>
                  <Typography
                    sx={{
                      mb: 2,
                      p: 1.5,
                      background: "#f5f9ff",
                      borderRadius: "8px",
                      borderLeft: "3px solid #4caf50",
                      fontWeight: 500,
                    }}
                  >
                    {riskData[activeTab]?.RiskName}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#5f6368",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Created Date
                  </Typography>
                  <Typography
                    sx={{
                      mb: 2,
                      p: 1.5,
                      background: "#f5f9ff",
                      borderRadius: "8px",
                      borderLeft: "3px solid #2196f3",
                      fontWeight: 500,
                    }}
                  >
                    {formatDate(riskData[activeTab]?.CreatedDate)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#5f6368",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Risk State
                  </Typography>
                  <Typography
                    sx={{
                      mb: 2,
                      p: 1.5,
                      background: "#f5f9ff",
                      borderRadius: "8px",
                      borderLeft: "3px solid #9c27b0",
                      fontWeight: 500,
                    }}
                  >
                    {riskData[activeTab]?.RiskState}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "#5f6368",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Status
                  </Typography>
                  <Typography
                    sx={{
                      mb: 2,
                      p: 1.5,
                      background: "#f5f9ff",
                      borderRadius: "8px",
                      borderLeft: "3px solid #f44336",
                      fontWeight: 500,
                    }}
                  >
                    {riskData[activeTab]?.Status}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {riskData[activeTab]?.RiskDocumentPath && (
                  <Button
                    variant="outlined"
                    startIcon={<Description />}
                    onClick={() =>
                      handleOpenDocument(riskData[activeTab]?.RiskDocumentPath)
                    }
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    View Document
                  </Button>
                )}
              </Box>
              <Divider
                sx={{
                  my: 3,
                  borderColor: "#e0e0e0",
                  borderWidth: "1px",
                  borderStyle: "dashed",
                }}
              />

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#5f6368",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    mb: 1,
                    display: "block",
                  }}
                >
                  Risk Description
                </Typography>
                <Box
                  sx={{
                    p: 3,
                    background: "#f8fbff",
                    borderRadius: "8px",
                    minHeight: 100,
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <Typography sx={{ color: "#424242", lineHeight: 1.6 }}>
                    {riskData[activeTab]?.RiskDescription ||
                      "No description provided"}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    background:
                      "linear-gradient(135deg,rgb(227, 233, 240) 0%,#ffffff 100%)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    boxShadow: "0 1px 3px rgba(74, 64, 64, 0.05)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#4b5e76",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      background: "linear-gradient(90deg, #4b5e76, #7b92b0)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Risk Steps
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleToggleAll}
                    sx={{
                      backgroundColor: "#6b7280",
                      color: "#ffffff",
                      padding: "6px",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#4b5563",
                        transform: "scale(1.05)",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      },
                      "&:active": {
                        transform: "scale(0.95)",
                      },
                    }}
                  >
                    {expandedAll ? (
                      <Remove fontSize="small" />
                    ) : (
                      <Add fontSize="small" />
                    )}
                  </IconButton>
                </Box>
                {expandedAll && (
                  <>
                    <Accordion
                      sx={{
                        boxShadow: "none",
                        border: "1px solid #e0e0e0",
                        mb: 2,
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          backgroundColor: "#f8fbff",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography fontWeight="500" fontSize={"14px"}>
                          Risk Assessments
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: "#ffffff" }}>
                        <Typography>
                          <RiskAssessmentsAccordion
                            riskData={riskData[activeTab]}
                          />
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      sx={{
                        boxShadow: "none",
                        border: "1px solid #e0e0e0",
                        mb: 2,
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          backgroundColor: "#f8fbff",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography fontWeight="500" fontSize={"14px"}>
                          Risk Analysis
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: "#ffffff" }}>
                        <Typography>
                          <RiskAnalysisAccordion
                            riskData={riskData[activeTab]}
                          />
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      sx={{
                        boxShadow: "none",
                        border: "1px solid #e0e0e0",
                        mb: 2,
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          backgroundColor: "#f8fbff",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography fontWeight="500" fontSize={"14px"}>
                          Risk Treatments
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: "#ffffff" }}>
                        <Typography>
                          <RiskTreatmentsAccordion
                            riskData={riskData[activeTab]}
                          />
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      sx={{
                        boxShadow: "none",
                        border: "1px solid #e0e0e0",
                        mt: 2,
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          backgroundColor: "#f8fbff",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography fontWeight="500" fontSize={"14px"}>
                          Risk Monitoring Reviews
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: "#ffffff" }}>
                        <Typography>
                          <RiskMonitoringReviewsAccordion
                            riskData={riskData[activeTab]}
                          />
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </>
                )}
              </Box>
            </Paper>
          </>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: "white",
              borderRadius: "0 0 12px 12px",
              border: "none",
              textAlign: "center",
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                backgroundColor: "#f5f5f5",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Close sx={{ color: "#9e9e9e", fontSize: 40 }} />
            </Box>
            <Typography
              variant="body1"
              sx={{ color: "#757575", fontWeight: 500 }}
            >
              No risk details available for this node.
            </Typography>
          </Paper>
        )}
      </Box>
    </Modal>
  );
};
export default RisksModal;

RisksModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  riskData: PropTypes.arrayOf(
    PropTypes.shape({
      RiskID: PropTypes.string,
      RiskName: PropTypes.string,
      CreatedDate: PropTypes.string,
      RiskState: PropTypes.string,
      Status: PropTypes.string,
      RiskDocumentPath: PropTypes.string,
      RiskDescription: PropTypes.string, // <-- Add this line for prop validation
    })
  ).isRequired,
};
RisksModal.defaultProps = {
  riskData: [],
};
