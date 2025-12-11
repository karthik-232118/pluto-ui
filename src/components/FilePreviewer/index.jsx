import React, { useState, useEffect, useRef } from "react";
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  Button as PDFButton,
  Position,
  Tooltip as PDFTooltip,
} from "@react-pdf-viewer/core";
import { highlightPlugin, MessageIcon } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import {
  Box,
  Modal,
  Backdrop,
  Fade,
  Button,
  CircularProgress,
  IconButton,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReactFileViewer from "react-file-viewer";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

const supportedViewExtensions = ["xls", "xlsx", "ppt", "pptx", "doc", "docx"];

const FilePreviewer = ({
  fileUrl,
  isUploading,
  onSave,
  riskAndComplienceString,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [riskTexts, setRiskTexts] = useState([]);
  const [commonTexts, setCommonTexts] = useState([]);
  const [clauseTexts, setClauseTexts] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [lastViewedPageIndex, setLastViewedPageIndex] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const [activeHighlightPosition, setActiveHighlightPosition] = useState(null);
  const [viewerKey, setViewerKey] = useState(0);
  const [viewerInitialPage, setViewerInitialPage] = useState(0);
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState([]);

  // Initialize state for storing position details
  const [riskPositions, setRiskPositions] = useState([]);
  const [compliancePositions, setCompliancePositions] = useState([]);
  const [clausePositions, setClausePositions] = useState([]);

  const { t } = useTranslation();
  const viewerRef = useRef();
  const pdfContainerRef = useRef(null);

  const RiskDetailsArrays = riskAndComplienceString?.RiskDetailsArrays || [];
  const ComplianceDetailsArrays =
    riskAndComplienceString?.ComplianceDetailsArrays || [];
  const ClauseDetailsArrays =
    riskAndComplienceString?.ClauseDetailsArrays || [];

  let noteId = notes?.length;

  const handlePageChange = (pageIndex) => {
    console.log(
      `Page changed to: ${pageIndex + 1} (0-based index: ${pageIndex})`
    );
    setLastViewedPageIndex(pageIndex);
    setCurrentPageIndex(pageIndex + 1);
  };

  useEffect(() => {
    const uniqueRiskTexts = [...new Set([...riskTexts, ...RiskDetailsArrays])];
    const uniqueCommonTexts = [
      ...new Set([...commonTexts, ...ComplianceDetailsArrays]),
    ];
    const uniqueClauseTexts = [
      ...new Set([...clauseTexts, ...ClauseDetailsArrays]),
    ];

    if (
      uniqueRiskTexts.length !== riskTexts.length ||
      uniqueCommonTexts.length !== commonTexts.length ||
      uniqueClauseTexts.length !== clauseTexts.length
    ) {
      setRiskTexts(uniqueRiskTexts);
      setCommonTexts(uniqueCommonTexts);
      setClauseTexts(uniqueClauseTexts);
    }
  }, [RiskDetailsArrays, ComplianceDetailsArrays, ClauseDetailsArrays]);

  const handleSave = () => {
    if (onSave) {
      onSave({
        riskTexts,
        commonTexts,
        clauseTexts,
        riskPositions,
        compliancePositions,
        clausePositions,
      });
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "uploaded-document";
      link.click();
    }
  };

  const toggleModal = () => {
    const getExtension = fileUrl.split(".").pop().toLowerCase();
    const supportedExtensions = ["xls", "xlsx", "ppt", "pptx"];

    if (supportedExtensions.includes(getExtension)) {
      handleDownload();
    } else {
      setModalOpen(!isModalOpen);
    }
  };

  // Clear all highlights function
  const clearAllHighlights = () => {
    const allTextSpans = document.querySelectorAll(
      ".react-pdf__Page__textLayer span"
    );
    allTextSpans.forEach((span) => {
      span.style.backgroundColor = "transparent";
      span.classList.remove("active-highlight");
    });
  };

  // Highlight specific text in PDF
  const highlightTextInPDF = (textToHighlight, type) => {
    clearAllHighlights();

    setTimeout(() => {
      const allTextSpans = document.querySelectorAll(
        ".react-pdf__Page__textLayer span"
      );

      allTextSpans.forEach((span) => {
        if (span.textContent.includes(textToHighlight)) {
          let backgroundColor = "#90EE90";
          if (type === "risk") backgroundColor = "#ffcccb";
          else if (type === "compliance")
            backgroundColor = "#add8e6"; // Light blue
          else if (type === "clause") backgroundColor = "#dda0dd"; // Light purple

          span.style.backgroundColor = backgroundColor;
          span.classList.add("active-highlight");
          span.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
    }, 500);
  };

  // Render highlight target for new selections
  const renderHighlightTarget = (props) => (
    <div
      style={{
        background: "#eee",
        display: "flex",
        position: "absolute",
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: "translate(0, 8px)",
        zIndex: 1,
      }}
    >
      <PDFTooltip
        position={Position.TopCenter}
        target={
          <PDFButton onClick={props.toggle}>
            <MessageIcon />
          </PDFButton>
        }
        content={() => <div style={{ width: "100px" }}>Add to category</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  // Render highlight content with category selection
  const renderHighlightContent = (props) => {
    const addToCategory = (category) => {
      if (props.selectedText) {
        const pageIndex =
          props.selectionData?.startPageIndex ?? props.pageIndex;
        const currentPageNumber = pageIndex + 1;

        // Get selection position
        const selectionPosition = {
          pageIndex: pageIndex,
          page: currentPageNumber,
          left: props.highlightAreas[0]?.left || 0,
          top: props.highlightAreas[0]?.top || 0,
          width: props.highlightAreas[0]?.width || 0,
          height: props.highlightAreas[0]?.height || 0,
        };

        // Log selection information from plugin
        console.log(`PLUGIN ${category.toUpperCase()} SELECTION INFO:`, {
          text: props.selectedText,
          page: currentPageNumber,
          pageIndex: pageIndex,
          position: {
            top: selectionPosition.top,
            left: selectionPosition.left,
            width: selectionPosition.width,
            height: selectionPosition.height,
          },
          highlightAreas: props.highlightAreas,
        });

        // Position data object
        const positionData = {
          text: props.selectedText,
          position: {
            page: currentPageNumber,
            pageIndex: pageIndex,
            top: selectionPosition.top,
            left: selectionPosition.left,
            width: selectionPosition.width,
            height: selectionPosition.height,
          },
        };

        // Add to respective category
        if (category === "risk") {
          setRiskTexts((prev) => [...new Set([...prev, props.selectedText])]);
          setRiskPositions((prev) => [...prev, positionData]);
        } else if (category === "compliance") {
          setCommonTexts((prev) => [...new Set([...prev, props.selectedText])]);
          setCompliancePositions((prev) => [...prev, positionData]);
        } else if (category === "clause") {
          setClauseTexts((prev) => [...new Set([...prev, props.selectedText])]);
          setClausePositions((prev) => [...prev, positionData]);
        }

        // Create highlight object
        const newHighlight = {
          id: uuidv4(),
          text: props.selectedText,
          position: selectionPosition,
          highlightAreas: [...props.highlightAreas],
          category: category,
          timestamp: new Date().toISOString(),
        };

        // Add to highlights array
        setHighlights((prev) => [...prev, newHighlight]);

        props.cancel();

        // Clear highlights after a short delay
        setTimeout(() => {
          clearAllHighlights();
        }, 500);
      }
    };

    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(0, 0, 0, .3)",
          borderRadius: "2px",
          padding: "8px",
          position: "absolute",
          left: `${props.selectionRegion.left}%`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
          zIndex: 1,
          minWidth: "200px",
        }}
      >
        <div
          style={{ marginBottom: "8px", fontSize: "12px", fontWeight: "bold" }}
        >
          Add to category:
        </div>
        <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
          <button
            onClick={() => addToCategory("risk")}
            style={{
              padding: "4px 8px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Risk
          </button>
          <button
            onClick={() => addToCategory("compliance")}
            style={{
              padding: "4px 8px",
              backgroundColor: "#0288d1",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Compliance
          </button>
          <button
            onClick={() => addToCategory("clause")}
            style={{
              padding: "4px 8px",
              backgroundColor: "#9c27b0",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Clause
          </button>
        </div>
        <button
          onClick={props.cancel}
          style={{
            padding: "4px 8px",
            backgroundColor: "#ccc",
            border: "none",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Cancel
        </button>
      </div>
    );
  };

  // Render existing highlights
  const renderHighlights = (props) => {
    return (
      <div>
        {highlights
          .filter(
            (highlight) =>
              highlight.highlightAreas?.some(
                (area) => area.pageIndex === props.pageIndex
              ) && activeHighlightPosition?.id === highlight.id
          )
          .map((highlight, idx) => (
            <React.Fragment key={idx}>
              {highlight.highlightAreas
                .filter((area) => area.pageIndex === props.pageIndex)
                .map((area, areaIdx) => {
                  let backgroundColor = "#90EE90"; // Default
                  if (highlight.category === "risk")
                    backgroundColor = "#ffcccb";
                  else if (highlight.category === "compliance")
                    backgroundColor = "#add8e6";
                  else if (highlight.category === "clause")
                    backgroundColor = "#dda0dd";

                  return (
                    <div
                      key={areaIdx}
                      style={Object.assign(
                        {},
                        {
                          background: backgroundColor,
                          opacity: 0.6,
                        },
                        props.getCssProperties(area, props.rotation)
                      )}
                    />
                  );
                })}
            </React.Fragment>
          ))}
      </div>
    );
  };

  // Initialize highlight plugin
  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    renderHighlights,
  });

  const onTextSelected = () => {
    const selected = window.getSelection();
    if (selected && selected.toString().trim() !== "") {
      setSelectedText(selected.toString());

      const range = selected.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      let currentPageElement = null;
      let pageIndex = lastViewedPageIndex;

      let element = range.commonAncestorContainer;
      while (element && element !== document.body) {
        if (
          element.classList &&
          element.classList.contains("rpv-core__page-layer")
        ) {
          currentPageElement = element;
          const pageNum = element.getAttribute("data-page-number");
          if (pageNum) {
            pageIndex = parseInt(pageNum, 10) - 1;
            break;
          }
        }
        element = element.parentElement;
      }

      if (currentPageElement === null) {
        const pageElements = document.querySelectorAll(".rpv-core__page-layer");
        pageElements.forEach((pageEl, idx) => {
          const pageRect = pageEl.getBoundingClientRect();
          if (rect.top >= pageRect.top && rect.bottom <= pageRect.bottom) {
            currentPageElement = pageEl;
            pageIndex = idx;
          }
        });
      }

      const textLayer = currentPageElement
        ? currentPageElement.querySelector(".react-pdf__Page__textLayer")
        : document.querySelector(".react-pdf__Page__textLayer");

      const textLayerRect = textLayer
        ? textLayer.getBoundingClientRect()
        : null;
      const relLeft = textLayerRect
        ? rect.left - textLayerRect.left
        : rect.left;
      const relTop = textLayerRect ? rect.top - textLayerRect.top : rect.top;

      const selectionPosition = {
        left: relLeft,
        top: relTop,
        width: rect.width,
        height: rect.height,
        pageIndex: pageIndex,
        page: pageIndex + 1,
        absLeft: rect.left,
        absTop: rect.top,
      };

      window.lastSelectionPosition = selectionPosition;
    }
  };

  const addToRisk = () => {
    if (selectedText) {
      const selectionPosition = window.lastSelectionPosition || {
        height: 0,
        left: 0,
        pageIndex: lastViewedPageIndex,
        page: lastViewedPageIndex + 1,
        top: 0,
        width: 0,
      };

      // Log selection information
      console.log("RISK SELECTION INFO:", {
        text: selectedText,
        page: selectionPosition.page,
        pageIndex: selectionPosition.pageIndex,
        position: {
          top: selectionPosition.top,
          left: selectionPosition.left,
          width: selectionPosition.width,
          height: selectionPosition.height,
        },
      });

      setRiskTexts((prev) => [...new Set([...prev, selectedText])]);

      // Store position data for this text
      setRiskPositions((prev) => [
        ...prev,
        {
          text: selectedText,
          position: {
            page: selectionPosition.page,
            pageIndex: selectionPosition.pageIndex,
            top: selectionPosition.top,
            left: selectionPosition.left,
            width: selectionPosition.width,
            height: selectionPosition.height,
          },
        },
      ]);

      // Create highlight for this selection
      const newHighlight = {
        id: uuidv4(),
        text: selectedText,
        position: selectionPosition,
        category: "risk",
        timestamp: new Date().toISOString(),
      };
      setHighlights((prev) => [...prev, newHighlight]);

      setSelectedText("");
    }
  };

  const addToCommon = () => {
    if (selectedText) {
      const selectionPosition = window.lastSelectionPosition || {
        height: 0,
        left: 0,
        pageIndex: lastViewedPageIndex,
        page: lastViewedPageIndex + 1,
        top: 0,
        width: 0,
      };

      // Log selection information
      console.log("COMPLIANCE SELECTION INFO:", {
        text: selectedText,
        page: selectionPosition.page,
        pageIndex: selectionPosition.pageIndex,
        position: {
          top: selectionPosition.top,
          left: selectionPosition.left,
          width: selectionPosition.width,
          height: selectionPosition.height,
        },
      });

      setCommonTexts((prev) => [...new Set([...prev, selectedText])]);

      // Store position data for this text
      setCompliancePositions((prev) => [
        ...prev,
        {
          text: selectedText,
          position: {
            page: selectionPosition.page,
            pageIndex: selectionPosition.pageIndex,
            top: selectionPosition.top,
            left: selectionPosition.left,
            width: selectionPosition.width,
            height: selectionPosition.height,
          },
        },
      ]);

      // Create highlight for this selection
      const newHighlight = {
        id: uuidv4(),
        text: selectedText,
        position: selectionPosition,
        category: "compliance",
        timestamp: new Date().toISOString(),
      };
      setHighlights((prev) => [...prev, newHighlight]);

      setSelectedText("");
    }
  };

  const addToClause = () => {
    if (selectedText) {
      const selectionPosition = window.lastSelectionPosition || {
        height: 0,
        left: 0,
        pageIndex: lastViewedPageIndex,
        page: lastViewedPageIndex + 1,
        top: 0,
        width: 0,
      };

      // Log selection information
      console.log("CLAUSE SELECTION INFO:", {
        text: selectedText,
        page: selectionPosition.page,
        pageIndex: selectionPosition.pageIndex,
        position: {
          top: selectionPosition.top,
          left: selectionPosition.left,
          width: selectionPosition.width,
          height: selectionPosition.height,
        },
      });

      setClauseTexts((prev) => [...new Set([...prev, selectedText])]);

      // Store position data for this text
      setClausePositions((prev) => [
        ...prev,
        {
          text: selectedText,
          position: {
            page: selectionPosition.page,
            pageIndex: selectionPosition.pageIndex,
            top: selectionPosition.top,
            left: selectionPosition.left,
            width: selectionPosition.width,
            height: selectionPosition.height,
          },
        },
      ]);

      // Create highlight for this selection
      const newHighlight = {
        id: uuidv4(),
        text: selectedText,
        position: selectionPosition,
        category: "clause",
        timestamp: new Date().toISOString(),
      };
      setHighlights((prev) => [...prev, newHighlight]);

      setSelectedText("");
    }
  };

  const removeFromRisk = (index) => {
    const textToRemove = riskTexts[index];
    setRiskTexts((prev) => prev.filter((_, i) => i !== index));

    // Also remove position data
    setRiskPositions((prev) =>
      prev.filter((item) => item.text !== textToRemove)
    );

    // Remove corresponding highlight
    setHighlights((prev) =>
      prev.filter((h) => !(h.text === textToRemove && h.category === "risk"))
    );
    clearAllHighlights();
  };

  const removeFromCommon = (index) => {
    const textToRemove = commonTexts[index];
    setCommonTexts((prev) => prev.filter((_, i) => i !== index));

    // Also remove position data
    setCompliancePositions((prev) =>
      prev.filter((item) => item.text !== textToRemove)
    );

    // Remove corresponding highlight
    setHighlights((prev) =>
      prev.filter(
        (h) => !(h.text === textToRemove && h.category === "compliance")
      )
    );
    clearAllHighlights();
  };

  const removeFromClause = (index) => {
    const textToRemove = clauseTexts[index];
    setClauseTexts((prev) => prev.filter((_, i) => i !== index));

    // Also remove position data
    setClausePositions((prev) =>
      prev.filter((item) => item.text !== textToRemove)
    );

    // Remove corresponding highlight
    setHighlights((prev) =>
      prev.filter((h) => !(h.text === textToRemove && h.category === "clause"))
    );
    clearAllHighlights();
  };

  // Handle clicking on text items to highlight them
  const handleTextItemClick = (text, type) => {
    // Find the highlight for this text
    const highlight = highlights.find(
      (h) => h.text === text && h.category === type
    );

    if (highlight) {
      // Navigate to the page and highlight
      setActiveHighlightPosition(highlight);
      setViewerInitialPage(highlight.position.pageIndex);
      setViewerKey((prev) => prev + 1);

      setTimeout(() => {
        highlightTextInPDF(text, type);
      }, 1000);
    } else {
      // Fallback: just highlight text if found
      highlightTextInPDF(text, type);
    }
  };

  return (
    <div>
      {(isUploading || fileUrl) && (
        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={toggleModal}
          disabled={isUploading}
          startIcon={
            isUploading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : null
          }
        >
          {isUploading ? t("uploading") : t("previewFile")}
        </Button>
      )}

      {fileUrl && !isUploading && (
        <Modal
          open={isModalOpen}
          onClose={toggleModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
          }}
        >
          <Fade in={isModalOpen}>
            <Box
              sx={{
                display: "flex",
                width: "90%",
                height: "90%",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: 24,
                p: 2,
                position: "relative",
                overflow: "hidden",
                mx: "auto",
                my: "auto",
                outline: "none",
              }}
            >
              {/* File Viewer Section */}
              <Box
                ref={pdfContainerRef}
                sx={{
                  flex: 2,
                  position: "relative",
                  marginRight: "20px",
                  borderRight: "1px solid #ddd",
                  paddingRight: "10px",
                }}
                onMouseUp={onTextSelected}
              >
                {!supportedViewExtensions.includes(
                  fileUrl.split(".").pop().toLowerCase()
                ) ? (
                  <Worker
                    workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                  >
                    <Viewer
                      key={viewerKey}
                      fileUrl={fileUrl}
                      defaultScale={SpecialZoomLevel.PageFit}
                      ref={viewerRef}
                      initialPage={viewerInitialPage}
                      onPageChange={handlePageChange}
                      plugins={[highlightPluginInstance]}
                    />
                  </Worker>
                ) : (
                  <ReactFileViewer
                    fileType={fileUrl.split(".").pop()}
                    filePath={fileUrl}
                    errorCallback={(e) =>
                      console.error("Error loading file", e)
                    }
                  />
                )}
              </Box>

              {/* Text Boxes Section */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Risk Box */}
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: "#ffe0e0",
                    border: "1px solid #f44336",
                    borderRadius: "8px",
                    padding: "10px",
                    overflowY: "auto",
                  }}
                >
                  <strong>Risk:</strong>
                  <ul>
                    {riskTexts.map((text, index) => (
                      <li
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontWeight: "400",
                          cursor: "pointer",
                          padding: "2px 0",
                        }}
                        onClick={() => handleTextItemClick(text, "risk")}
                      >
                        <span style={{ flex: 1 }}>
                          {index + 1}. {text}
                        </span>
                        <div>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTextItemClick(text, "risk");
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromRisk(index);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Box>

                {/* Compliance Box */}
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: "#e0f7fa",
                    border: "1px solid #0288d1",
                    borderRadius: "8px",
                    padding: "10px",
                    overflowY: "auto",
                  }}
                >
                  <strong>Compliance:</strong>
                  <ul>
                    {commonTexts.map((text, index) => (
                      <li
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontWeight: "400",
                          cursor: "pointer",
                          padding: "2px 0",
                        }}
                        onClick={() => handleTextItemClick(text, "compliance")}
                      >
                        <span style={{ flex: 1 }}>
                          {index + 1}. {text}
                        </span>
                        <div>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTextItemClick(text, "compliance");
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCommon(index);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Box>

                {/* Clause Box */}
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: "#f3e5f5",
                    border: "1px solid #9c27b0",
                    borderRadius: "8px",
                    padding: "10px",
                    overflowY: "auto",
                  }}
                >
                  <strong>Clause:</strong>
                  <ul>
                    {clauseTexts.map((text, index) => (
                      <li
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "400",
                          cursor: "pointer",
                          padding: "2px 0",
                        }}
                        onClick={() => handleTextItemClick(text, "clause")}
                      >
                        <span style={{ flex: 1 }}>
                          {index + 1}. {text}
                        </span>
                        <div>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTextItemClick(text, "clause");
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromClause(index);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Box>

                <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ textTransform: "none" }}
                      fullWidth
                      onClick={() => {
                        handleSave();
                        toggleModal();
                      }}
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={toggleModal}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}
    </div>
  );
};

export default FilePreviewer;

FilePreviewer.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  isUploading: PropTypes.bool,
  onSave: PropTypes.func,
  riskAndComplienceString: PropTypes.shape({
    RiskDetailsArrays: PropTypes.arrayOf(PropTypes.string),
    ComplianceDetailsArrays: PropTypes.arrayOf(PropTypes.string),
    ClauseDetailsArrays: PropTypes.arrayOf(PropTypes.string),
  }),
};

FilePreviewer.defaultProps = {
  isUploading: false,
  onSave: null,
  riskAndComplienceString: {
    RiskDetailsArrays: [],
    ComplianceDetailsArrays: [],
    ClauseDetailsArrays: [],
  },
};