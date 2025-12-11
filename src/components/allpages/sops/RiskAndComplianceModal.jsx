import React, { useState } from "react";
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  Grid,
} from "@mui/material";

import ArrowUpRight from "../../../assets/svg/navbar/arrow-up-right2.svg";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/CancelSharp";
import PropTypes from "prop-types";
import "../../../css/CommonModal.css"; // Import the common modal styles
import { useTheme } from "@mui/styles";

const headingToArrayKey = {
  Clause: "ClauseDetailsArrays",
  Risk: "RiskDetailsArrays",
  Compliance: "ComplianceDetailsArrays",
};

const RiskAndComplianceModal = ({
  open,
  onClose,
  heading,
  RiskAndCompliences,
}) => {
  const arrayKey = headingToArrayKey[heading];
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main;
  const transformedData = React.useMemo(() => {
    if (!Array.isArray(RiskAndCompliences)) return [];

    return RiskAndCompliences.filter((docItem) => {
      const dataArray = docItem?.RiskAndComplience?.[0]?.[arrayKey];
      return Array.isArray(dataArray) && dataArray.length > 0;
    }).map((docItem) => {
      const dataArray = docItem.RiskAndComplience[0][arrayKey];
      return {
        documentID: docItem?.RiskAndComplience?.[0]?.DocumentID,
        documentName: docItem.DocumentName,
        bullets: dataArray,
      };
    });
  }, [RiskAndCompliences, arrayKey]);
  const [selectedDocName, setSelectedDocName] = useState(null);

  const handleShowAll = () => {
    setSelectedDocName(null);
  };

  const handleViewClick = (documentID) => {
    if (documentID) {
      const url = `/documents/view/${encodeURIComponent(documentID)}`;
      window.open(url, "_blank");
    } else {
      console.log("DocumentID is undefined");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      aria-labelledby="risk-compliance-modal-title"
      aria-describedby="risk-compliance-modal-description"
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 750, md: 1000 },
            height: "70%",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "8px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header Row with common CSS class */}
          <Box
            // className="modal-header-gradient"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              backgroundColor: bgcolor || "red",
            }}
          >
            <Typography variant="h6" className="modal-title">
              {heading} Details
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginRight: 5,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={handleShowAll}
                sx={{
                  color: "white",
                  borderColor: "white",
                  textTransform: "none",
                }}
                endIcon={
                  <img
                    src={ArrowUpRight}
                    alt="arrow up right"
                    style={{ width: "20px", height: "20px" }}
                  />
                }
              >
                All {heading}
              </Button>

              <IconButton
                onClick={onClose}
                sx={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Main Content: Left (docs list) & Right (details) */}
          <Grid container sx={{ height: "100%", overflow: "hidden" }}>
            {/* Left Sidebar */}
            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                borderRight: "1px solid #e0e0e0",
                overflowY: "auto",
                maxHeight: "calc(85vh - 64px)",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              }}
            >
              <Box sx={{ p: 2 }}>
                {transformedData.length === 0 ? (
                  <Typography variant="body2" sx={{ color: "#999" }}>
                    No {heading} details available.
                  </Typography>
                ) : (
                  transformedData.map((doc, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        mb: 2,
                        cursor: "pointer",
                        fontWeight:
                          selectedDocName === doc.documentName
                            ? "bold"
                            : "normal",
                        color:
                          selectedDocName === doc.documentName
                            ? "#2196F3"
                            : "rgba(0, 0, 0, 0.6)",
                      }}
                      onClick={() =>
                        setSelectedDocName(
                          selectedDocName === doc.documentName
                            ? null
                            : doc.documentName
                        )
                      }
                    >
                      <Typography
                        variant="body1"
                        title="Click to filter details"
                        sx={{ fontWeight: "350" }}
                      >
                        {idx + 1}. {doc.documentName}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Grid>

            {/* Right Content */}
            <Grid
              item
              xs={12}
              sm={9}
              sx={{
                overflowY: "auto",
                maxHeight: "calc(85vh - 64px)",
                p: 2,
              }}
            >
              {transformedData.length === 0 ? (
                <Typography
                  variant="body1"
                  sx={{ textAlign: "center", mt: 4, color: "#999" }}
                >
                  No {heading} details available.
                </Typography>
              ) : selectedDocName === null ? (
                // Show ALL documents
                transformedData.map((doc, idx) => (
                  <Box key={idx} sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#2196F3", fontWeight: "600", mb: 1 }}
                    >
                      {doc.documentName}
                      {/* Arrow icon calls handleViewClick */}
                      <img
                        src={ArrowUpRight}
                        alt="arrow up right"
                        style={{
                          width: "20px",
                          height: "20px",
                          verticalAlign: "middle",
                          marginLeft: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleViewClick(doc.documentID)}
                      />
                    </Typography>

                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {doc.bullets.map((detail, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            marginBottom: "1rem",
                          }}
                        >
                          {/* Circle with a Check Icon */}
                          <div
                            style={{
                              width: "15px",
                              height: "15px",
                              borderRadius: "50%",
                              backgroundColor: "#fff",
                              border: "#0288D114 1px solid",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "8px",
                              marginTop: "3px",
                            }}
                          >
                            <CheckIcon
                              style={{
                                fontSize: "16px",
                                color: "#3B82F6",
                                height: "10px",
                                width: "10px",
                              }}
                            />
                          </div>
                          <div style={{ color: "#00000099", fontWeight: 350 }}>
                            {detail}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Divider sx={{ my: 2 }} />
                  </Box>
                ))
              ) : (
                // Show only the selected doc
                transformedData
                  .filter((doc) => doc.documentName === selectedDocName)
                  .map((doc, idx) => (
                    <Box key={idx} sx={{ mb: 4 }}>
                      <Typography
                        variant="h6"
                        sx={{ color: "#2196F3", fontWeight: "600", mb: 1 }}
                      >
                        {doc.documentName}
                        {/* Arrow icon calls handleViewClick */}
                        <img
                          src={ArrowUpRight}
                          alt="arrow up right"
                          style={{
                            width: "20px",
                            height: "20px",
                            verticalAlign: "middle",
                            marginLeft: "4px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleViewClick(doc.documentID)}
                        />
                      </Typography>

                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {doc.bullets.map((detail, bulletIndex) => (
                          <li
                            key={bulletIndex}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              marginBottom: "1rem",
                            }}
                          >
                            <div
                              style={{
                                width: "15px",
                                height: "15px",
                                borderRadius: "50%",
                                backgroundColor: "#fff",
                                border: "#0288D114 1.5px solid",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "8px",
                                marginTop: "3px",
                              }}
                            >
                              <CheckIcon
                                style={{
                                  fontSize: "16px",
                                  color: "#3B82F6",
                                  height: "10px",
                                  width: "10px",
                                }}
                              />
                            </div>
                            <div
                              style={{ color: "#00000099", fontWeight: 350 }}
                            >
                              {detail}
                            </div>
                          </li>
                        ))}
                      </ul>
                      <Divider sx={{ my: 2 }} />
                    </Box>
                  ))
              )}
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RiskAndComplianceModal;

RiskAndComplianceModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  heading: PropTypes.oneOf(["Clause", "Risk", "Compliance"]).isRequired,
  RiskAndCompliences: PropTypes.arrayOf(
    PropTypes.shape({
      RiskAndComplience: PropTypes.arrayOf(
        PropTypes.shape({
          ClauseDetailsArrays: PropTypes.arrayOf(PropTypes.string),
          RiskDetailsArrays: PropTypes.arrayOf(PropTypes.string),
          ComplianceDetailsArrays: PropTypes.arrayOf(PropTypes.string),
          DocumentID: PropTypes.string,
        })
      ),
      DocumentName: PropTypes.string,
    })
  ).isRequired,
};
