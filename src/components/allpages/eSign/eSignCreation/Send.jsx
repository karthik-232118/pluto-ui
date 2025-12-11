import PdfViewer from "../pdfViewer";
import PropTypes from "prop-types";

function Send({ documentData, setDocumentData, receivers, setReceivers }) {
  return (
    <div>
      <PdfViewer
        documentData={documentData}
        setDocumentData={setDocumentData}
        receivers={receivers}
        setReceivers={setReceivers}
      />
    </div>
  );
}

export default Send;
Send.propTypes = {
  documentData: PropTypes.object.isRequired, 
  setDocumentData: PropTypes.func.isRequired, 
  receivers: PropTypes.array.isRequired, 
  setReceivers: PropTypes.func.isRequired, 
};
