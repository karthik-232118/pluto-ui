import { useEffect, useState } from "react";
import cupicon from "../../../assets/svg/MCQEndTestPage/cupIcon.svg";
import failed from "../../../assets/png/mcqresultpage/failed.png";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CertificateWithAPIContent from "../profilepage/CertificateWithAPIContent";
import { useTheme } from "@mui/styles";

const McqTestSuccess = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;
  const { endTestResult, loading } = useSelector((state) => state.mcqs);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // useEffect(() => {
  //   if (endTestResult) {
  //     console.log("End Test Result:", endTestResult);
  //   }
  // }, [endTestResult]);

  const handleHome = () => {
    navigate("/test-mcqs/view");
  };

  const handleOpenModal = (certificateType) => {
    setSelectedCertificate(certificateType);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCertificate(null);
  };
  const totalQuestions = endTestResult?.NumberOfQuestions || 0;
  const correctAnswers = endTestResult?.QuestionsCorrect || 0;
  const incorrectAnswers = endTestResult?.QuestionsIncorrect || 0;
  const totalScore = endTestResult?.Score || 0;
  const QuestionsCorrect = endTestResult?.QuestionsCorrect || 0;
  const passPercentage = endTestResult?.PassPercentage || 0;
  const percentageScored =
    totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const isPassed = percentageScored >= 40;

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box>
        <Box style={{ margin: "25px" }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100vh"
            textAlign="center"
            bgcolor="#fff"
            borderRadius={2}
            style={{}}
          >
            <Box mb={2}>
              <img
                src={isPassed ? cupicon : failed}
                alt={isPassed ? "Cup Icon" : "Failed Icon"}
                style={{
                  width: isPassed ? "auto" : "200px",
                  height: isPassed ? "auto" : "150px",
                  marginBottom: isPassed ? "0" : "-30px",
                }}
              />
            </Box>
            <Typography variant="h6" gutterBottom>
              <span style={{ color: "gray", fontWeight: "300" }}>
                {t("resultTitle")}
              </span>
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              color={isPassed ? "#18B174" : "#FF4D4F"}
              mb={3}
            >
              {isPassed ? t("passed") : t("failed")}
            </Typography>

            <Table
              sx={{
                minWidth: 300,
                maxWidth: 600,
                border: "1px solid #EAECF0",
                borderRadius: "8px",
                bgcolor: "#fff",
                marginBottom: "16px",
              }}
            >
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid #EAECF0",
                      fontWeight: "bold",
                      color: "#667085",
                      backgroundColor: "#FBFBFB",
                    }}
                  >
                    {t("passPercentage")}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ borderBottom: "1px solid #EAECF0", color: "#667085" }}
                  >
                    {passPercentage}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid #EAECF0",
                      fontWeight: "bold",
                      color: "#667085",
                      backgroundColor: "#FBFBFB",
                    }}
                  >
                    {t("percentageScored")}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ borderBottom: "1px solid #EAECF0", color: "#667085" }}
                  >
                    {percentageScored.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid #EAECF0",
                      fontWeight: "bold",
                      color: "#667085",
                      backgroundColor: "#FBFBFB",
                    }}
                  >
                    {t("totalQuestions")}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ borderBottom: "1px solid #EAECF0", color: "#667085" }}
                  >
                    {totalQuestions}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid #EAECF0",
                      fontWeight: "bold",
                      color: "#667085",
                      backgroundColor: "#FBFBFB",
                    }}
                  >
                    {t("totalCorrectAnswers")}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ borderBottom: "1px solid #EAECF0", color: "#667085" }}
                  >
                    {QuestionsCorrect}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid #EAECF0",
                      fontWeight: "bold",
                      color: "#667085",
                      backgroundColor: "#FBFBFB",
                    }}
                  >
                    {t("totalIncorrectAnswers")}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ borderBottom: "1px solid #EAECF0", color: "#667085" }}
                  >
                    {incorrectAnswers}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#3B82F6",
                      backgroundColor: "#FBFBFB",
                    }}
                  >
                    {t("totalScore")}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "#3B82F6", fontWeight: "bold" }}
                  >
                    {totalScore}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleHome}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontWeight: "bold",
                }}
              >
                {t("backToHome")}
              </Button>

              {isPassed && (
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontWeight: "bold",
                  }}
                  onClick={() => handleOpenModal("certificate1")}
                >
                  {t("viewCertificate")}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "90%",
            maxHeight: "90%",
            overflowY: "auto",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",

              top: 8,
              right: 8,
              zIndex: 1,
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          {selectedCertificate === "certificate1" && (
            <CertificateWithAPIContent data={endTestResult} />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default McqTestSuccess;
