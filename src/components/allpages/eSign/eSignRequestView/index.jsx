import React, { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import { getComponent } from "../pdfViewer/components/components";
import {
  Box,
  Container,
  Grid,
  Button,
  CircularProgress,
  Typography,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./index.css";
import {
  fillESignRequest,
  viewESignRequest,
} from "../../../../services/eSign/ESignModule";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { BASE_URL } from "../../../../config/urlConfig";
import PropTypes from "prop-types";

const Loader = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
    >
      <CircularProgress size={60} thickness={4} />
    </Box>
  );
};

const ErrorMessage = ({ message }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      padding="20px"
      bgcolor="#f9f9f9"
    >
      <Stack
        direction="column"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "600px",
          backgroundColor: "white",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "#FF9800" }} />

        <Typography
          variant="body1"
          fontSize="1.25rem"
          textAlign="center"
          color="textSecondary"
        >
          {message ||
            "An unexpected error has occurred. Please try again later."}
        </Typography>
      </Stack>
    </Box>
  );
};

const EsignRequestView = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery("(max-width:768px)");
  const scale = isMobile ? 0.5 : 2;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [eSignRequests, setESignRequests] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [markers, setMarkers] = React.useState([]);
  const [numPages, setNumPages] = React.useState(null);
  const [formData, setFormData] = React.useState({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState(null);
  const hasFetchedESignRequest = useRef(false);

  const fetchESignRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: ipData } = await axios.get(
        "https://api.ipify.org?format=json"
      );
      const response = await viewESignRequest({
        ESignRequestID: id,
        receiverId: searchParams.get("receiverId"),
        ip: ipData.ip,
      });

      if (response?.status === 200) {
        const data = response?.data?.data;
        setMarkers(data?.eSignReceiver?.Markers);
        setESignRequests(data);
      } else {
        setError(
          response?.data?.message ||
            response?.data?.error ||
            "Error fetching eSign request"
        );
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Error fetching eSign request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  useEffect(() => {
    if (!hasFetchedESignRequest.current) {
      fetchESignRequests();
      hasFetchedESignRequest.current = true;
    }
  }, []);

  const handleEsignSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: ipData } = await axios.get(
        "https://api.ipify.org?format=json"
      );
      const payload = {
        ESignRequestID: id,
        Markers: Object.values(formData),
        ESignReceiverID: searchParams.get("receiverId"),
        IP: ipData.ip,
        // createdAt: new Date(),
        // userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      const response = await fillESignRequest(payload);
      if (response?.status === 200) {
        toast.success("ESign Response Submitted Successfully");
        setIsSubmitted(true);
      } else {
        toast.error(
          response?.data?.message ||
            response?.data?.error ||
            "Error submitting response"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Error submitting response"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadSuccess = React.useCallback(({ numPages }) => {
    setNumPages(numPages);
  }, []);

  useEffect(() => {
    // Disable right-click
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    // Disable inspect element and keyboard shortcuts
    const handleKeyDown = (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+P
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.key === "P")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        {isSubmitting && (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ height: "70vh" }}
          >
            <CircularProgress color="primary" />
            <Typography variant="body1" style={{ marginTop: "10px" }}>
              Please wait while we submit your eSign response...
            </Typography>
          </Grid>
        )}

        {!isSubmitted && !isSubmitting ? (
          <Box
            className="custom-row"
            style={{
              width: "100%",
              height: "fit-content",
              marginRight: "auto",
              overflow: "auto",
            }}
          >
            <Document
              file={{
                url: `${BASE_URL}${eSignRequests?.eSignDocument?.ESignDocumentURL}`,
              }}
              onLoadSuccess={handleLoadSuccess}
              onLoadError={(error) => {
                console.log("Error loading PDF:", error);
                setError("Error loading Document");
              }}
              className="esign_viewport"
              loading={<Loader />}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={scale}
                  className="page"
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  customTextRenderer={false}
                >
                  {markers
                    ?.filter((marker) => marker.pageNumber === index + 1)
                    ?.map((marker, markerIndex) => (
                      <div
                        key={markerIndex}
                        style={{
                          position: "absolute",
                          top: marker.y * scale,
                          left: marker.x * scale,
                          transform: `scale(${scale})`,
                          transformOrigin: "top left",
                        }}
                      >
                        {getComponent(
                          marker.component,
                          formData,
                          setFormData,
                          marker,
                          eSignRequests?.eSignReceiver
                        )}
                      </div>
                    ))}
                </Page>
              ))}
            </Document>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "100%",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <Button
                onClick={handleEsignSubmit}
                disabled={error}
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Box>
          </Box>
        ) : null}

        {isSubmitted && !isSubmitting && (
          <Typography
            variant="h6"
            color="primary"
            style={{ marginTop: "20px", textAlign: "center" }}
          >
            Thank you, the eSign signature has been successfully submitted. 🎉
          </Typography>
        )}
      </Container>
    </div>
  );
};

export default EsignRequestView;

ErrorMessage.propTypes = {
  message: PropTypes.string,
};
EsignRequestView.propTypes = {
  id: PropTypes.string.isRequired,
  searchParams: PropTypes.object.isRequired,
};
