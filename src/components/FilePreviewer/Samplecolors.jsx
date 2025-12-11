
import  { useState } from "react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import {
  Box,
  Modal,
  Backdrop,
  Fade,
  Button,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const FilePreviewer = ({ fileUrl, isUploading }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [riskTexts, setRiskTexts] = useState([]);
  const [commonTexts, setCommonTexts] = useState([]);
  const {t} = useTranslation();

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const onTextSelected = () => {
    const selected = window.getSelection();
    if (selected && selected.toString().trim() !== "") {
      setSelectedText(selected.toString());
      console.log("Selected Text:", selected.toString());
    }
  };

  const addToRisk = () => {
    if (selectedText) {
      setRiskTexts((prev) => [...prev, selectedText]);
      setSelectedText(""); // Clear selection after adding
    }
  };

  const addToCommon = () => {
    if (selectedText) {
      setCommonTexts((prev) => [...prev, selectedText]);
      setSelectedText(""); // Clear selection after adding
    }
  };

  return (
    <div>
      {(isUploading || fileUrl) && (
        <Button
          variant="contained"
          color="success"
          onClick={toggleModal}
          sx={{ padding: "10px 20px", textTransform: "none" }}
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
              {/* PDF Viewer Section */}
              <Box
                sx={{
                  flex: 2,
                  position: "relative",
                  marginRight: "20px",
                  borderRight: "1px solid #ddd",
                  paddingRight: "10px",
                }}
                onMouseUp={onTextSelected} // Capture text selection
              >
                <Worker
                  workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                >
                  <Viewer
                    fileUrl={fileUrl}
                    defaultScale={SpecialZoomLevel.PageFit}
                  />
                </Worker>
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
                {/* Display Selected Text */}
                {selectedText && (
                  <Box
                    sx={{
                      p: 1,
                      backgroundColor: "#f9f9f9",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  >
                    <strong>Selected Text:</strong> {selectedText}
                    <Box sx={{ display: "flex", gap: 2, marginTop: "10px" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={addToRisk}
                        sx={{height:"40px",whiteSpace:"nowrap"}}
                      >
                        Risk
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={addToCommon}
                        sx={{height:"40px",whiteSpace:"nowrap"}}
                      >
                        Compliance
                      </Button>
                      <Button
                        variant="outlined"
                        
                        onClick={() => setSelectedText("")}
                        sx={{height:"40px",color:"#000",borderColor:"#000",whiteSpace:"nowrap"}}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}

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
                      <li key={index}>{text}</li>
                    ))}
                  </ul>
                </Box>

                {/* Common Box */}
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
                  <strong>compliance:</strong>
                  <ul>
                    {commonTexts.map((text, index) => (
                      <li key={index}>{text}</li>
                    ))}
                  </ul>
                </Box>
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
  fileUrl: PropTypes.string,
  isUploading: PropTypes.bool,
};
FilePreviewer.defaultProps = {
  fileUrl: "",
  isUploading: false,
};


