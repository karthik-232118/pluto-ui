import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CertificateImg from "../../../assets/image/Certificate/tOne.jpg";
import CertificateImg1 from "../../../../src/assets/png/icici.png";
import { QRCodeSVG } from "qrcode.react";
import DownloadIcon from "../../../assets/svg/MyAchivments/downloadIcon.svg";
import { Tooltip } from "@mui/material";
import { useSelector } from "react-redux";

// Load Google Font
const loadGoogleFont = () => {
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

// Simulated API Call

// Adjust font size based on the course name length
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

const CertificateWithAPIContent = (data) => {
  const [certificateData, setCertificateData] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef();
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const { userdata } = useSelector((state) => state?.user);
  const [logoUrl, setLogoUrl] = useState(() => {
    return localStorage.getItem("organizationLogo") || "";
  });
  useEffect(() => {
    console.log(data?.data, "checkmcqdata");
  }, [data]);

  const user = JSON.parse(localStorage.getItem("user_data"));
  // useEffect(() => {
  //   console.log(user, "userdataModal");
  // }, [user]);
  const fetchCertificateData = () => {
    return Promise.resolve({
      id: "21184acd-16312c4606bc-A12",
      name: "Manokaran.A",
      course: "Account Opening in business banking",
      completionDate: "Sept 21, 2024",
      companyName: "HDFC Bank Private Limited",
      logoUrl: logoUrl || CertificateImg1,
    });
  };

  // console.log(userdata, "userdataModal");

  // Use name from localStorage user if available, else fallback to userdata from redux
  const Name = user
    ? `${user.UserFirstName || ""} ${user.UserMiddleName || ""} ${
        user.UserLastName || ""
      }`.trim()
    : `${userdata?.UserFirstName || ""} ${userdata?.UserMiddleName || ""} ${
        userdata?.UserLastName || ""
      }`.trim();

  const companyName = userdata?.OrganizationStructureName || user?.OrganizationStructureName;

  const date = data?.data?.CompletedOn;

  const Score = data?.data?.Score;

  const StartedOn = data?.data?.StartedOn;

  const CompletedOn = data?.data?.CompletedOn;

  // console.log(date, "dateModal");

  const completionDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // console.log(completionDate, "completionDate");

  const course =
    data?.data?.TestSimulationName ||
    data?.data?.TestMCQName ||
    data?.data?.ModuleName ||
    "N / A";
  console.log(course, "coursesss");

  useEffect(() => {
    loadGoogleFont();
    fetchCertificateData().then((data) => {
      setCertificateData(data);
      setShowCertificate(true); // Show certificate once data is fetched
    });
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = CertificateImg;
    img.onload = () => {
      setImgDimensions({ width: 800, height: 650 });
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
      {showCertificate && (
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
                right: "30px",
                height: "auto",
                width: "150px",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "280px",
                left: "85px",
                width: "600px",
                textAlign: "left",
                color: "#000",
                userSelect: "none",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  marginTop: "20px",
                  textAlign: "left",
                }}
              >
                THIS CERTIFICATE PROUDLY PRESENTED TO
              </p>
              <h2 style={underlineStyleName}>
                <span>{Name.toUpperCase()}</span>
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
                  {course}
                </strong>
                by the
                <strong style={{ marginLeft: "5px", marginRight: "5px" }}>
                  {companyName}
                </strong>
                on
                <span style={{ ...underlineStyle, marginLeft: "5px" }}>
                  {completionDate}
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
                value={JSON.stringify({
                  name: Name,
                  companyName: companyName,
                  course: course,
                  completionDate: completionDate,
                  score: Score,

                  startDate: StartedOn,
                  endDate: CompletedOn,
                })}
                size={100}
              />
              <p
                style={{
                  fontSize: "14px",
                  color: "#4D2D83",
                  marginTop: "70px",
                  whiteSpace: "normal",
                  overflow: "hidden",
                }}
              >
                This is system generated certificate no signature required.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            {/* <button onClick={handleDownloadImage}>Download as Image</button>
            <button onClick={handleDownloadPDF} style={{ marginLeft: "10px" }}>
              Download as PDF
            </button> */}
            <Tooltip title="Download as a PDF" placement="top-end">
              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <img src={DownloadIcon} alt="" onClick={handleDownloadPDF} />
              </div>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateWithAPIContent;
