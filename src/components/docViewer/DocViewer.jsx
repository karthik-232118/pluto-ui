import  { useEffect, useState } from "react";
import PropTypes from "prop-types";

const DocViewer = ({ fileUrl, handleDocumentLoadSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(5); // Maximum retry attempts

  // Function to check if the document has loaded
  const checkDocumentLoaded = (iframe) => {
    try {
      const iframeContent = iframe.contentWindow;
      return iframeContent && iframeContent.document.readyState === "complete";
    } catch (error) {
      return false; // Return false if access to iframe content is blocked or unavailable
    }
  };

  // Retry function
  const retryLoadDocument = (iframe) => {
    if (retryCount < maxRetries) {
      setRetryCount((prevCount) => prevCount + 1);
      setLoading(true);
      setTimeout(() => {
        if (!checkDocumentLoaded(iframe)) {
          retryLoadDocument(iframe); // Retry until it loads
        } else {
          setLoading(false);
          handleDocumentLoadSuccess(); // Notify that the document has loaded successfully
        }
      }, 2000); // Retry every 2 seconds
    } else {
      setLoading(false); // Max retries reached
    }
  };

  // Effect to trigger the retry logic when the component is mounted
  useEffect(() => {
    if (fileUrl) {
      const iframe = document.getElementById("docIframe");
      retryLoadDocument(iframe);
    }
  }, [fileUrl, retryCount]);

  return (
    <div style={{ position: "relative", width: "100%", height: "800px" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "18px",
            color: "#3B82F6",
          }}
        >
          Loading document...
        </div>
      )}
      <iframe
        id="docIframe"
        src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
        width="100%"
        height="100%"
        style={{
          display: loading ? "none" : "block",
          border: "none",
        }}
        onLoad={(e) => {
          if (checkDocumentLoaded(e.target)) {
            setLoading(false);
            handleDocumentLoadSuccess(); // Notify parent when the document is loaded
          }
        }}
      />
    </div>
  );
};

export default DocViewer;

DocViewer.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  handleDocumentLoadSuccess: PropTypes.func.isRequired,
};
// DocViewer.jsx
