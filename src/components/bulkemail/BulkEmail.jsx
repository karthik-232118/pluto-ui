import CreateCampaing from "./CreateCamp";
import {  useState } from "react";
import { Button, Container, Grid, Box, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import notify from "../../assets/svg/utils/toast/Toast";
import MyStepper from "../allpages/eSign/eSignCreation/MyStepper";
import BulkEmailList from "./BulkEmailList";
import { useDispatch } from "react-redux";
import { SendBulkemails } from "../../store/eSign/action";
import { validateAndSanitizeInputs } from "../../utils";
import Reviewandsendmodal from "./ReviewAndSend";
import { useTranslation } from "react-i18next";
import AccessDenied from "../accessDenied/AccessDenied";

function Sender() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const steps = [
    {
      header: t("steps.createCampaign.header"),
      subHeader: t("steps.createCampaign.subHeader"),
    },
    {
      header: t("steps.receiverDetails.header"),
      subHeader: t("steps.receiverDetails.subHeader"),
    },
    { header: t("steps.send.header"), subHeader: t("steps.send.subHeader") },
  ];
  const [selectedData, setSelectedData] = useState([]);
  const [formState, setFormState] = useState({
    CampaignName: "",
    CampaignDescription: "",
  });
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const validateForm = () => {
    const newErrors = {}; // Initialize errors object first
    const regex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces
    if (!formState.CampaignName.trim()) {
      newErrors.CampaignName = "Campaingn Name is required.";
    } else if (!regex.test(formState.CampaignName)) {
      newErrors.CampaignName =
        "Campaing Name can only contain letters and spaces.";
    }
    if (!formState.CampaignCode.trim()) {
      newErrors.CampaignCode = "Campaingn Name is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const onChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <CreateCampaing
            formState={formState}
            onChange={onChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <BulkEmailList
            setSelectedData={setSelectedData}
            selectedData={selectedData}
            apiErrorMessage={apiErrorMessage}
          />
        );
      default:
        return (
          <Reviewandsendmodal
            alldata={{
              ...formState,
              Users: selectedData,
            }}
          />
        );
    }
  };

  const handleSubmitfirstStep = async () => {
    if (validateForm()) {
      const inputs = [formState.CampaignName, formState.CampaignDescription];

      if (validateAndSanitizeInputs(inputs)) {
        try {
          const payload = {
            CampaignName: formState.CampaignName,
            CampaignDescription: formState.CampaignDescription,
            CampaignCode: formState.CampaignCode,
            Step: 1,
          };

          const res = await dispatch(SendBulkemails(payload));

          if (res?.type === "esign/SendBulkemails/fulfilled") {
            setActiveStep(activeStep + 1);
          } else {
            notify("error", "Failed to send emails. Please try again.");
          }
        } catch (error) {
          console.error("Error during email send:", error);
          notify("error", "An error occurred while processing the request.");
        }
      }
    } else {
      notify("error", "Please fill all the required fields.");
    }
  };

  const handleSecondStep = async () => {
    try {
      const payload = {
        Users: [...selectedData],
        Step: 2,
      };

      const res = await dispatch(SendBulkemails(payload));

      if (res?.type === "esign/SendBulkemails/fulfilled") {
        setActiveStep(activeStep + 1);
        setApiErrorMessage(""); // Clear error message on success
      } else {
        const errorMessage = res?.payload || "Failed to send emails.";
        setApiErrorMessage(errorMessage); // Update error message state
        console.error(
          "SendBulkemails API failed response:",
          res?.payload || res
        );
        // notify("error", errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while processing the request.";
      setApiErrorMessage(errorMessage); // Update error message state
      console.error("Error during email send:", error?.response || error);
      notify("error", errorMessage);
    }
  };

  const isNextStepDisabled = (step) => {
    if (step === 0) {
      return (
        !formState.CampaignName ||
        !formState.CampaignDescription ||
        !formState.CampaignCode
      );
    } else if (step === 1) {
      return selectedData.length === 0;
    }
  };
  const handlePreviousStep = () => {
    setActiveStep(activeStep - 1);
  };

    const userType = localStorage.getItem("user_type");
          if (userType === "EndUser" || userType === "ProcessOwner") {
            return <AccessDenied />;
          }

  return (
    <Box
      sx={{
        pt: 4,
        position: "relative",
      }}
    >
      <Container
        sx={{
          p: 4,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {t("bulk_emails")}
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
            left: "4%",
            right: "0%",
            p: 2,
            backgroundColor: "white",
            boxShadow: "0px -4px 4px rgba(0, 0, 0, 0.1)",
            // zIndex: 1300,
          }}
        >
          <Grid container justifyContent="space-between">
            <Grid item>
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={handlePreviousStep}
                disabled={activeStep === 0}
              >
                {t("previous")}
              </Button>
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                sx={{
                  color: "#fff",
                  backgroundColor: "#000",
                  marginRight: "1rem",
                }}
                onClick={() => setActiveStep(0)}
                disabled={activeStep === 0}
              >
                {t("cancel")}
              </Button>
              {activeStep !== 2 && (
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={activeStep !== 2 ? <ArrowForward /> : null}
                  onClick={() => {
                    if (activeStep === 0) {
                      // Only proceed if form is valid on the first step
                      if (validateForm()) {
                        handleSubmitfirstStep();
                      }
                    } else if (activeStep === 1 && selectedData.length > 0) {
                      handleSecondStep();
                      // Proceed to send on the last step
                    }
                  }}
                  disabled={isNextStepDisabled(activeStep)}
                >
                  {activeStep !== 2 ? t("next") : t("Send")}
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Sender;
