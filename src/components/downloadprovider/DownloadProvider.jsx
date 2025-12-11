import  { createContext } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PropTypes from "prop-types";
// import html2pdf from "html2pdf.js";

// Create a context
const DownloadContext = createContext();

// Create a provider component
export const DownloadProvider = ({ children }) => {
  
  // Function to download PDF
  const handleDownloadPDF = (ref) => {
    if (!ref.current) {
      console.error("The reference to the certificate is null or undefined.");
      return;
    }

    html2canvas(ref.current, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Set the dimensions for the image and PDF
      const imgWidth = 210; // PDF page width in mm (A4 size)
      const pageHeight = 297; // PDF page height in mm (A4 size)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: imgHeight > pageHeight ? "portrait" : "landscape",
        unit: "mm",
        format: "a4",
      });

      let position = 0;
      if (imgHeight > pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        while (position < imgHeight) {
          position += pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position - imgHeight, imgWidth, imgHeight);
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      }

      pdf.save("certificate.pdf");
    });
  };

  return (
    <DownloadContext.Provider value={{ handleDownloadPDF }}>
      {children}
    </DownloadContext.Provider>
  );
};

// Custom hook to use the download function
// export const useDownload = () => {
//     const handleDownloadPDF = (ref) => {
//       if (ref.current) {
//         const element = ref.current;
//         html2pdf()
//           .from(element)
//           .set({
//             margin: 1,
//             filename: 'certificate.pdf',
//             html2canvas: { scale: 4 },
//             jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//           })
//           .save();
//       } else {
//         console.error("Reference to certificate content is missing.");
//       }
//     };
  
//     return { handleDownloadPDF };
//   };

// PropTypes for the provider
DownloadProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
