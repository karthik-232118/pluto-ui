import  { useEffect, useRef, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import PropTypes from "prop-types";

const initialBpmnXml = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

const SopTemplateModal = ({
  open,
  onClose,
  sopName,
  sopTemplates,
  onConfirm,
}) => {
  const diagramRef = useRef(null);
  const viewerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [diagramXml, setDiagramXml] = useState("");

  const loadBpmnDiagram = async () => {
    if (!diagramRef.current) return;

    setLoading(true);
    setError("");

    try {
      // Destroy the previous viewer instance if it exists
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }

      const bpmnViewer = new BpmnViewer({ container: diagramRef.current });
      viewerRef.current = bpmnViewer;

      const xml =
        sopTemplates?.data?.data?.sopTemplate?.SOPXMLElement || initialBpmnXml;

      await bpmnViewer.importXML(xml);

      // Zoom to fit the viewport after successful import
      bpmnViewer.get("canvas").zoom("fit-viewport");
    } catch (err) {
      console.error("Error rendering BPMN diagram:", err);
      setError("Failed to load the BPMN diagram. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      // Delay loading the diagram to ensure the ref is ready
      const timeoutId = setTimeout(() => {
        loadBpmnDiagram();
      }, 100);
      return () => clearTimeout(timeoutId);
    } else if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }
  }, [open, sopTemplates]);

  useEffect(() => {
    const xml =
      sopTemplates?.data?.data?.sopTemplate?.SOPXMLElement || initialBpmnXml;
    setDiagramXml(xml);
    if (viewerRef.current) {
      viewerRef.current.importXML(xml);
    }
  }, [sopTemplates]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="sop-template-modal-title"
      aria-describedby="sop-template-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          borderRadius: 2,
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography id="sop-template-modal-title" variant="h6" component="h2">
          {sopName}
        </Typography>

        <Box
          ref={diagramRef}
          sx={{
            flex: 1,
            border: "1px solid #ccc",
            position: "relative",
            overflow: "hidden",
            marginTop: "-20rem",
          }}
        >
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Typography
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "red",
                textAlign: "center",
                zIndex: 1,
              }}
            >
              {error}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              mr: 1,
              textTransform: "none",
              color: "#000",
              borderColor: "#000",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm(diagramXml); // Pass the updated diagram XML back
            }}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SopTemplateModal;

SopTemplateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sopName: PropTypes.string.isRequired,
  sopTemplates: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
SopTemplateModal.defaultProps = {
  sopTemplates: { data: { data: { sopTemplate: { SOPXMLElement: "" } } } },
};
