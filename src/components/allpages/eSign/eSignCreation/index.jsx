import { useEffect, useState } from "react";
import { Button, Container, Grid, Box, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import CreateDocument from "./CreateDocument";
import ReceiverDetails from "./ReceiverDetails";
import Send from "./Send";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MyStepper from "./MyStepper";
import Reviewandsendmodal from "./reviewandSend/reviewandsendmodal";
import Signfaildpoup from "./signfaild/signfaildpoup";
import { createESignRequest } from "../../../../services/eSign/ESignModule";
import notify from "../../../../assets/svg/utils/toast/Toast";
import { useTranslation } from "react-i18next";

function Sender() {
  const { t } = useTranslation();
  const [isSending, setIsSending] = useState(false);

  const steps = [
    { header: t("step.step1.header"), subHeader: t("step.step1.subHeader") },
    { header: t("step.step2.header"), subHeader: t("step.step2.subHeader") },
    { header: t("step.step3.header"), subHeader: t("step.step3.subHeader") },
  ];

  const [show, setShow] = useState(false);
  const [reviewData, setReviewData] = useState({
    referenceNo: "",
    subject: "",
    message: "",
    cc: "",
  });

  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [validateMessage, setValidateMessage] = useState("");

  const [documentData, setDocumentData] = useState({
    DocumentName: "",
    ReferenceNumber: "",
    file: "",
    markers: [],
  });
  const [receivers, setReceivers] = useState([
    { UserName: "", UserEmail: "", UserPhoneNumber: "", Markers: [] },
  ]);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <CreateDocument
            documentData={documentData}
            setDocumentData={setDocumentData}
          />
        );
      case 1:
        return (
          <ReceiverDetails receivers={receivers} setReceivers={setReceivers} />
        );
      default:
        return (
          <Send
            handleSend={handleSend}
            isSending={isSending}
            documentData={documentData}
            setDocumentData={setDocumentData}
            receivers={receivers}
            setReceivers={setReceivers}
          />
        );
    }
  };

  function handleSend() {
    const payload = { ...documentData };
    payload.receivers = receivers;
    delete payload.markers;

    const isValid = isSignatureAddedForReceivers(payload);
    if (!isValid) {
      setOpen(true);
      return;
    } else {
      setShow(true);
    }
  }

  const isSignatureAddedForReceivers = (payload) => {
    let isValid = true;
    payload.receivers.forEach((receiver) => {
      if (receiver.Markers.length === 0) {
        isValid = false;
        setValidateMessage("Please add signature for all receivers");
      } else {
        let isSignatureAdded = false;
        receiver.Markers.forEach((marker) => {
          if (
            marker.component === "signature" ||
            marker.component === "initials" ||
            marker.component === "stamp"
          ) {
            isSignatureAdded = true;
          }
        });
        if (!isSignatureAdded) {
          isValid = false;
          setValidateMessage(
            "Please add signature, initials or stamp for all receivers"
          );
        }
      }
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalReviewData = {
      Subject: reviewData?.subject,
      Message: reviewData?.message,
      CC: reviewData?.cc,
    };
    const startIndex = documentData?.file?.indexOf("/public");
    const finalFile = documentData?.file?.slice(startIndex + 1);
    const payload = {
      ...documentData,
      file: finalFile,
      ...finalReviewData,
      Receivers: receivers,
    };
    delete payload.markers;

    setIsSending(true);
    try {
      const response = await createESignRequest(payload);
      if (response.status === 200) {
        toast.success(t("ESign Request Sent Successfully"));
        navigate("/e-sign");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(t("Something went wrong!") || error.response.data.message);
      } else {
        toast.error(t("An error occurred while sending the request."));
      }
      navigate("/e-sign/create");
    } finally {
      setIsSending(false);
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);
  const validateReceivers = () =>
    receivers.every(
      (receiver) =>
        validateEmail(receiver.UserEmail) &&
        validatePhoneNumber(receiver.UserPhoneNumber)
    );

  const isNextStepDisabled = (step) => {
    if (step === 0) {
      return (
        !documentData.DocumentName ||
        !documentData.ReferenceNumber ||
        !documentData.file
      );
    } else if (step === 1) {
      return receivers.some(
        (receiver) =>
          !receiver.UserName || !receiver.UserEmail || !receiver.UserPhoneNumber
      );
    }
  };

  useEffect(() => {
    if (documentData?.ReferenceNumber) {
      setReviewData({
        ...reviewData,
        referenceNo: documentData.ReferenceNumber,
      });
    }
  }, [documentData.ReferenceNumber]);

  return (
    <Container
      sx={{
        pt: 4,
      }}
    >
      <Box
        sx={{
          p: 4,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {t("createNewSignDocument")}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {t("createOrChooseTemplate")}
        </Typography>
        <MyStepper steps={steps} activeStep={activeStep} />

        <Box
          sx={{
            mb: 10,
          }}
        >
          {getStepContent(activeStep)}
        </Box>

        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            backgroundColor: "white",
            boxShadow: "0px -4px 4px rgba(0, 0, 0, 0.1)",
            zIndex: 1300,
          }}
        >
          <Grid container justifyContent="space-between">
            <Grid item>
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={() => setActiveStep(activeStep - 1)}
                disabled={activeStep === 0}
              >
                {t("previous")}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                endIcon={activeStep !== 2 ? <ArrowForward /> : null}
                onClick={() => {
                  if (activeStep === 1 && !validateReceivers()) {
                    return notify(
                      "error",
                      "Please enter valid email and phone number for all receivers"
                    );
                  }
                  activeStep === 2
                    ? handleSend()
                    : setActiveStep(activeStep + 1);
                }}
                disabled={isNextStepDisabled(activeStep) || isSending}
              >
                {activeStep !== 2 ? t("next") : t("Send")}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Signfaildpoup
          show={open}
          setShow={setOpen}
          validateMessage={validateMessage}
        />
        <Reviewandsendmodal
          show={show}
          setShow={setShow}
          data={{ documentData, receivers }}
          setReviewData={setReviewData}
          reviewData={reviewData}
          handleSubmit={handleSubmit}
          isSending={isSending}
        />
      </Box>
    </Container>
  );
}

export default Sender;
