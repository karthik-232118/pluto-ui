import React from "react";
import Components from "./components";
import ViewPort from "./viewport";
import Toolbar from "./toolbar";
import "./index.css";
import img1 from "./images/img1.png";
import img2 from "./images/img2.png";
import PropTypes from "prop-types";

const PdfViewer = ({
  documentData,
  setDocumentData,
  receivers,
  setReceivers,
}) => {
  const [images] = React.useState([img1, img2]);
  const [active, setActive] = React.useState(1);
  const [numPages, setNumPages] = React.useState(null);
  const [activeReceiver, setActiveReceiver] = React.useState({
    UserName: "select receiver",
    UserEmail: "",
  });

  return (
    <div  
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div
        className=""
        style={{
          maxWidth: "fit-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Toolbar
          numPages={numPages}
          setNumPages={setNumPages}
          active={active}
          setActive={setActive}
          documentData={documentData}
          setDocumentData={setDocumentData}
          receivers={receivers}
          setActiveReceiver={setActiveReceiver}
          activeReceiver={activeReceiver}
          isPagination={false}
        />
        <div className="pdfviewer">
          <Components activeReceiver={activeReceiver} />
          <ViewPort
            documentData={documentData}
            setDocumentData={setDocumentData}
            images={images}
            active={active}
            numPages={numPages}
            setNumPages={setNumPages}
            activeReceiver={activeReceiver}
            setActiveReceiver={setActiveReceiver}
            receivers={receivers}
            setReceivers={setReceivers}
          />
        </div>
        <Toolbar
          numPages={numPages}
          setNumPages={setNumPages}
          active={active}
          setActive={setActive}
          documentData={documentData}
          setDocumentData={setDocumentData}
          receivers={receivers}
          setActiveReceiver={setActiveReceiver}
          activeReceiver={activeReceiver}
          isReciverToolbar={false}
        />
      </div>
    </div>
  );
};

export default PdfViewer;

PdfViewer.propTypes = {
  documentData: PropTypes.object.isRequired, // Object containing document data
  setDocumentData: PropTypes.func.isRequired, // Function to update document data
  receivers: PropTypes.array.isRequired, // Array of receiver objects
  setReceivers: PropTypes.func.isRequired, // Function to update receivers
};

  