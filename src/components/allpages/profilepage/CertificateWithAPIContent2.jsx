

import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CertificateImg from "../../../assets/image/Certificate/templateTwo.jpg";
import CertificateImg1 from "../../../assets/image/Certificate/logo.png";
import { QRCodeSVG } from "qrcode.react";
import DownloadIcon from "../../../assets/svg/MyAchivments/downloadIcon.svg";
import { Tooltip } from "@mui/material";

// Import Google Font
const loadGoogleFont = () => {
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

  
// Simulated API Call

// Adjust font size for course name based on character length
const adjustFontSize = (courseName) => {
  const baseFontSize = 18;
  const threshold = 39;
  const maxLength = 60;
  const reductionStep = 3;
  const stepSize = 6;

  if (courseName.length <= threshold) {
    return `${baseFontSize}px`;
  }

  const extraChars = Math.min(
    courseName.length - threshold,
    maxLength - threshold
  );
  const reduction = Math.floor(extraChars / stepSize) * reductionStep;

  return `${baseFontSize - reduction}px`;
};

const CertificateWithAPIContent2 = () => {
  const [certificateData, setCertificateData] = useState(null);
  const certificateRef = useRef();
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

    const [logoUrl, setLogoUrl] = useState(() => {
      return localStorage.getItem("organizationLogo") || "";
    });

  const fetchCertificateData = () => {
  return Promise.resolve({
    id: "21184acd-16312c4606bc-A12",
    name: "V P K Raghavendar Rajendran",
    course: "Account Opening in business banking",
    completionDate: "Sept 21, 2024",
    companyName: "HDFC Bank Private Limited",
    logoUrl: logoUrl , // Use logo from local storage or default
  });
};


  useEffect(() => {
    loadGoogleFont();
    fetchCertificateData().then((data) => setCertificateData(data));
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = CertificateImg;
    img.onload = () => {
      setImgDimensions({ width: img.width, height: img.height });
    };
  }, []);


  const handleDownloadPDF = () => {
    html2canvas(certificateRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("certificate.pdf");
    });
  };

  if (!certificateData) return <p>Loading...</p>;

  const courseFontSize = adjustFontSize(certificateData.course);

  const underlineStyle = {
    borderBottom: "2px solid black",
    paddingBottom: "2px",
    marginLeft: "10px",
    textAlign: "left",
    userSelect: "none",
  };

  const underlineStyleName = {
    display: "inline-block",
    borderBottom: "2px solid black",
    paddingBottom: "2px",
    width: "100%",
    margin: "0",
    fontSize: "26px",
    textAlign: "center",
    userSelect: "none",
    fontFamily: "'Poppins', cursive",
  };

  return (
    <div>
      <div
        ref={certificateRef}
        style={{
          position: "relative",
          width: `${imgDimensions.width}px`,
          height: `${imgDimensions.height}px`,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <img
          src={CertificateImg}
          alt="Certificate Background"
          style={{
            width: "100%",
            height: "100%",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />

        <img
          src={certificateData.logoUrl}
          alt="Company Logo"
          style={{
            position: "absolute",
            top: "20px",
            right: "60px",
            width: "100px",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "210px",
            left: "75px",
            width: "600px",
            textAlign: "left",
            color: "#000",
            userSelect: "none",
          }}
        >
          <p style={{ fontSize: "18px", marginTop: "20px", textAlign: "left" }}>
            THIS CERTIFICATE PROUDLY PRESENTED TO
          </p>
          <h2 style={underlineStyleName}>
            <span>{certificateData.name.toUpperCase()}</span>
          </h2>
          <p
            style={{
              fontSize: "18px",
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              width: "100%",
              lineHeight: "2.0",
            }}
          >
            Has completed the training{" "}
            <strong
              style={{
                ...underlineStyle,
                marginLeft:
                  certificateData.course?.length >= 40 ? "2px" : "5px",
                marginRight: "5px",
                fontSize: courseFontSize,
              }}
            >
              {certificateData.course}
            </strong>
            by the
            <strong style={{ marginLeft: "5px", marginRight: "5px" }}>
              {certificateData.companyName}
            </strong>
            on
            <span style={{ ...underlineStyle, marginLeft: "5px" }}>
              {certificateData.completionDate}
            </span>
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "35px",
            left: "45px",
            width: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            userSelect: "none",
          }}
        >
          <QRCodeSVG
            value={`https://example.com/verify-certificate/${certificateData.id}`}
            size={80}
          />
          <p
            style={{
              fontSize: "14px",
              color: "#fff",
              marginTop: "70px",
              whiteSpace: "normal",
              overflow: "hidden",
            }}
          >
            This is system generated certificate no signature required.
          </p>
        </div>
      </div>

      <Tooltip title="Download as a PDF" placement="top-end">
              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <img src={DownloadIcon} alt="" onClick={handleDownloadPDF} />
              </div>
            </Tooltip>
    </div>
  );
};

export default CertificateWithAPIContent2;
