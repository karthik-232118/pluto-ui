import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Select,
  MenuItem,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
import { Close } from "@mui/icons-material";
import { GetDocOne } from "../../../store/docOne/action";
import { GetDocTwo } from "../../../store/docTwo/action";
import { BASE_URL } from "../../../config/urlConfig";
import { diffWords } from "diff";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.js?url";
import { useTheme } from "@mui/styles";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const CompareDocsModal = ({ open, onClose, elementsDocumentFile }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [pdfVersion1, setPdfVersion1] = useState("");
  const [pdfVersion2, setPdfVersion2] = useState("");
  const [versions, setVersions] = useState([]);
  const [numPages1, setNumPages1] = useState(null);
  const [numPages2, setNumPages2] = useState(null);
  const [pageTexts1, setPageTexts1] = useState({});
  const [pageTexts2, setPageTexts2] = useState({});
  const [pageTextItems1, setPageTextItems1] = useState({});
  const [pageTextItems2, setPageTextItems2] = useState({});
  const [highlightedPages, setHighlightedPages] = useState({});
  const [isComparing, setIsComparing] = useState(false);
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;

  // Get the API data from Redux store
  const {
    DocOne,
    loading: loadingDocOne,
    error: errorDocOne,
  } = useSelector((state) => state.docOne);
  const {
    DocTwo,
    loading: loadingDocTwo,
    error: errorDocTwo,
  } = useSelector((state) => state.docTwo);

  useEffect(() => {
    if (elementsDocumentFile?.details?.History) {
      const historyWithVersions = elementsDocumentFile.details.History.map(
        (history) => ({
          displayVersion: history.MasterVersion
            ? history.MasterVersion
            : `version ${history.DraftVersion}`,
          version: history.MasterVersion || history.DraftVersion,
          isMaster: history.MasterVersion !== null,
          DocumentID: history.DocumentID,
        })
      );
      setVersions(historyWithVersions);
    }
  }, [elementsDocumentFile]);

  // Handle version selection for Document 1
  const handleVersion1Change = (event) => {
    const selectedVersion = event.target.value;
    setPdfVersion1(selectedVersion);
    setHighlightedPages({});
    setIsComparing(false);

    const selectedHistory = versions.find(
      (version) => version.version === selectedVersion
    );
    if (selectedHistory) {
      console.log(
        "Fetching Document 1 data for DocumentID:",
        selectedHistory.DocumentID
      );
      dispatch(
        GetDocOne({
          DocumentID: selectedHistory.DocumentID,
          IsActionable: true,
        })
      );
    }
  };

  // Handle version selection for Document 2
  const handleVersion2Change = (event) => {
    const selectedVersion = event.target.value;
    setPdfVersion2(selectedVersion);
    setHighlightedPages({});
    setIsComparing(false);

    const selectedHistory = versions.find(
      (version) => version.version === selectedVersion
    );
    if (selectedHistory) {
      console.log(
        "Fetching Document 2 data for DocumentID:",
        selectedHistory.DocumentID
      );
      dispatch(
        GetDocTwo({
          DocumentID: selectedHistory.DocumentID,
          IsActionable: true,
        })
      );
    }
  };

  // Handle PDF load success for Document 1
  const onDocumentLoadSuccess1 = async ({ numPages }) => {
    setNumPages1(numPages);
    await extractAllPagesText(
      DocOne.DocumentPath,
      setPageTexts1,
      setPageTextItems1,
      numPages
    );
  };

  // Handle PDF load success for Document 2
  const onDocumentLoadSuccess2 = async ({ numPages }) => {
    setNumPages2(numPages);
    await extractAllPagesText(
      DocTwo.DocumentPath,
      setPageTexts2,
      setPageTextItems2,
      numPages
    );
  };

  // Extract text from all pages with position information
  const extractAllPagesText = async (
    documentPath,
    setPageTexts,
    setPageTextItems,
    totalPages
  ) => {
    try {
      const pdf = await pdfjs.getDocument(`${BASE_URL}/${documentPath}`)
        .promise;
      const pageTexts = {};
      const pageTextItems = {};

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const viewport = page.getViewport({ scale: 1 });

        pageTexts[i] = content.items.map((item) => item.str).join(" ");
        pageTextItems[i] = content.items.map((item) => ({
          text: item.str,
          x: item.transform[4],
          y: viewport.height - item.transform[5] - 25, // Move highlight up by 5 pixels
          width: item.width || "100%",
          height: item.height || 10, // Slightly increase height for better visibility
          fontName: item.fontName,
        }));
      }

      setPageTexts(pageTexts);
      setPageTextItems(pageTextItems);
    } catch (error) {
      console.error("Error extracting text:", error);
    }
  };

  const findTextPositions = (searchText, textItems) => {
    const positions = [];
    const normalizedSearch = searchText.replace(/\s+/g, "").toLowerCase();

    for (let i = 0; i < textItems.length; i++) {
      let collected = "";
      let temp = [];

      for (let j = i; j < textItems.length; j++) {
        const item = textItems[j];
        const normalizedItem = item.text.replace(/\s+/g, "").toLowerCase();

        if (!normalizedItem) continue;

        collected += normalizedItem;
        temp.push(item);

        if (collected === normalizedSearch) {
          positions.push(
            ...temp.map((item) => ({
              ...item,
              x: item.x,
              y: item.y + 3, // ⬅️ increased for more accurate downward alignment
              width: item.width || 1,
              height: item.height || 11,
            }))
          );
          break;
        }

        if (collected.length > normalizedSearch.length + 5) break;
      }
    }

    return positions;
  };

  // Compare text and create highlights
  const compareText = async () => {
    setIsComparing(true);
    const highlights = {};
    const maxPages = Math.max(numPages1 || 0, numPages2 || 0);

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const text1 = pageTexts1[pageNum] || "";
      const text2 = pageTexts2[pageNum] || "";

      if (text1 || text2) {
        const diff = diffWords(text1, text2);
        highlights[pageNum] = { doc1: [], doc2: [] };

        for (const part of diff) {
          const targetText = part.value.trim();
          if (!targetText) continue;

          if (part.removed && pageTextItems1[pageNum]) {
            const positions = findTextPositions(
              targetText,
              pageTextItems1[pageNum]
            );
            highlights[pageNum].doc1.push(
              ...positions.map((pos) => ({
                ...pos,
                color: "rgba(255, 0, 0, 0.3)",
                type: "removed",
              }))
            );
          }
          if (part.added && pageTextItems2[pageNum]) {
            const positions = findTextPositions(
              targetText,
              pageTextItems2[pageNum]
            );
            highlights[pageNum].doc2.push(
              ...positions.map((pos) => ({
                ...pos,
                color: "rgba(0, 255, 0, 0.3)",
                type: "added",
              }))
            );
          }
        }
      }
    }

    setHighlightedPages(highlights);
    setIsComparing(false);
  };

  // Render highlights overlay
  const renderHighlights = (pageNum, docType, scale = 1) => {
    const pageHighlights = highlightedPages[pageNum];
    if (!pageHighlights) return null;

    const highlights =
      docType === "doc1" ? pageHighlights.doc1 : pageHighlights.doc2;

    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        {highlights.map((highlight, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${(highlight.x - 1) * scale}px`, // Adjust X to prevent overlap/gap
              top: `${highlight.y + 12}px`, // Shift up slightly to align with baseline
              width: `${Math.max((highlight.width + 1) * scale, 2)}px`, // Add small buffer
              height: `${(highlight.height + 3) * scale}px`, // Slightly taller to fully wrap text
              backgroundColor: highlight.color,
              pointerEvents: "none",
              borderRadius: "2px",
              opacity: 0.5, // Optional: softer overlay
              mixBlendMode: "multiply", // Optional: blends better with text
              boxSizing: "border-box",
            }}
          />
        ))}
      </div>
    );
  };

  // Custom page renderer with highlights
  const renderPageWithHighlights = (pageNum, docType, scale = 1) => {
    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <Page
          key={`page_${pageNum}`}
          pageNumber={pageNum}
          width={600}
          scale={scale}
        />
        {renderHighlights(pageNum, docType, scale)}
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          height: "90vh",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: bgColor,
          color: "#fff",
          fontWeight: "400",
          fontSize: "18px",
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {t("compare_documents")}

        <Box sx={{ position: "absolute", top: 0, right: 0, padding: "8px" }}>
          <Close onClick={onClose} sx={{ cursor: "pointer" }} />
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: "24px",
          backgroundColor: "#f5f5f5",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Controls */}
        <Box
          sx={{
            mb: 2,
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: bgColor, fontWeight: "bold" }}
            >
              {t("document_1")}
            </Typography>
            <Select
              value={pdfVersion1}
              onChange={handleVersion1Change}
              sx={{
                width: "200px",
                height: "40px",
                backgroundColor: "#fff",
                borderRadius: "4px",
              }}
            >
              {versions.map((version, index) => (
                <MenuItem key={index} value={version.version}>
                  {version.isMaster ? t("version") : t("draft")}{" "}
                  {version.displayVersion}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Button
            variant="contained"
            onClick={compareText}
            disabled={
              loadingDocOne ||
              loadingDocTwo ||
              !DocOne?.DocumentPath ||
              !DocTwo?.DocumentPath ||
              isComparing
            }
            sx={{ px: 4, py: 1.5 }}
          >
            {isComparing ? t("comparing") : t("compare_button")}
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: bgColor, fontWeight: "bold" }}
            >
              {t("document_2")}
            </Typography>
            <Select
              value={pdfVersion2}
              onChange={handleVersion2Change}
              sx={{
                width: "200px",
                height: "40px",
                backgroundColor: "#fff",
                borderRadius: "4px",
              }}
            >
              {versions.map((version, index) => (
                <MenuItem key={index} value={version.version}>
                  {version.isMaster ? t("version") : t("draft")}{" "}
                  {version.displayVersion}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Legend */}
        {Object.keys(highlightedPages).length > 0 && (
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
              gap: 4,
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "rgba(255, 0, 0, 0.3)",
                  border: "1px solid #ccc",
                }}
              />
              <Typography variant="body2">Removed Text</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "rgba(0, 255, 0, 0.3)",
                  border: "1px solid #ccc",
                }}
              />
              <Typography variant="body2">Added Text</Typography>
            </Box>
          </Box>
        )}

        {/* PDF Display */}
        <Box sx={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
          <Grid container spacing={2} sx={{ height: "100%" }}>
            {/* Left Side - Document 1 */}
            <Grid item xs={6} sx={{ height: "100%" }}>
              <Box
                sx={{
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  backgroundColor: "#fff",
                  height: "100%",
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {loadingDocOne ? (
                  <Typography>{t("loading_document_1")}</Typography>
                ) : errorDocOne ? (
                  <Typography style={{ color: "red" }}>
                    Error: {errorDocOne}
                  </Typography>
                ) : DocOne?.DocumentPath && pdfVersion1 !== "" ? (
                  <Document
                    file={`${BASE_URL}/${DocOne.DocumentPath}`}
                    onLoadSuccess={onDocumentLoadSuccess1}
                  >
                    {Array.from(new Array(numPages1), (el, index) => (
                      <Box
                        key={`page_${index + 1}`}
                        sx={{ mb: 2, position: "relative" }}
                      >
                        {renderPageWithHighlights(index + 1, "doc1", 1)}
                      </Box>
                    ))}
                  </Document>
                ) : (
                  <Typography sx={{ color: "#777" }}>
                    {t("select_version")}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Right Side - Document 2 */}
            <Grid item xs={6} sx={{ height: "100%" }}>
              <Box
                sx={{
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  backgroundColor: "#fff",
                  height: "100%",
                  overflow: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {loadingDocTwo ? (
                  <Typography>{t("loading_document_2")}</Typography>
                ) : errorDocTwo ? (
                  <Typography style={{ color: "red" }}>
                    Error: {errorDocTwo}
                  </Typography>
                ) : DocTwo?.DocumentPath && pdfVersion2 !== "" ? (
                  <Document
                    file={`${BASE_URL}/${DocTwo.DocumentPath}`}
                    onLoadSuccess={onDocumentLoadSuccess2}
                  >
                    {Array.from(new Array(numPages2), (el, index) => (
                      <Box
                        key={`page_${index + 1}`}
                        sx={{ mb: 2, position: "relative" }}
                      >
                        {renderPageWithHighlights(index + 1, "doc2", 1)}
                      </Box>
                    ))}
                  </Document>
                ) : (
                  <Typography sx={{ color: "#777" }}>
                    {t("select_version")}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

CompareDocsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  elementsDocumentFile: PropTypes.object.isRequired,
};

export default CompareDocsModal;
