import  { useEffect, useState } from "react";
import { Button, TextField, Typography, Box, Chip } from "@mui/material";
import FormsAutocomp from "./FormsAutocomp";
import { useDispatch } from "react-redux";
import { GetFormsList, SendBulkemails } from "../../store/eSign/action";
import { useNavigate } from "react-router";
import { t } from "i18next";
import notify from "../../assets/svg/utils/toast/Toast";
import PropTypes from "prop-types";

function ReviewAndSend({ alldata }) {
  const [reviewData, setReviewData] = useState({
    CampaignEmailReferenceNumber: "",
    CampaignEmailSubject: "",
    CampaignEmailMessages: "",
    CampaignEmailCC: "",
  });
  const [selecetdForm, setSelecetdForm] = useState(null);
  const [receivers, setReceivers] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const errors = validateForm();
    setErrorMessages(errors);

    // If there are errors, prevent submission
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const payload = {
        Step: 3,
        FormID: selecetdForm?.FormID,
        FormModuleDraftID: selecetdForm?.FormModuleDraftID,
        FormFields: [...receivers],
        CampaignEmailSubject: reviewData.CampaignEmailSubject,
        CampaignEmailMessage: reviewData.CampaignEmailMessages,
        CampaignEmailReferenceNumber: alldata?.CampaignCode,
        ...alldata,
      };
      const res = await dispatch(SendBulkemails(payload));

      // Step 5: Check the result of the dispatch
      if (res?.type === "esign/SendBulkemails/fulfilled") {
        // Successfully sent the bulk emails, move to the next step
        naviagte("/bulk-email-reports");
        localStorage.removeItem("selectedData");
      } else {
        // Handle any issues with the API response
        notify("error", "Failed to send emails. Please try again.");
      }
    } catch (error) {
      // Catch and handle any errors during the dispatch or API call
      console.error("Error during email send:", error);
      notify("error", "An error occurred while processing the request.");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!reviewData.CampaignEmailSubject) {
      errors.CampaignEmailSubject = "Email subject is required.";
    }
    if (!reviewData.CampaignEmailMessages) {
      errors.CampaignEmailMessages = "Email message is required.";
    }
    if (!receivers || receivers.length === 0) {
      errors.receivers = "At least one receiver must be selected.";
    }
    if (!selecetdForm) {
      errors.selecetdForm = "A form must be selected.";
    }

    return errors;
  };

  useEffect(() => {
    dispatch(GetFormsList());
  }, [dispatch]);

  // Handle removing a receiver from the list
  const handleRemoveReceiver = (index) => {
    const updatedReceivers = receivers.filter((_, i) => i !== index);
    setReceivers(updatedReceivers); // Update the receivers state without the removed receiver
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          gap: 6,
          width: "100%",
          maxWidth: "100%",
         
        }}
      >
        <Box>
          <Typography variant="h5" component="h2" mb={2}>
           {t("Review And Send")}
          </Typography>

          <Typography variant="h6" mb={1} className="esign-page-heading">
            {t("Compose your email invite")}
          </Typography>
          <TextField
            fullWidth
            label={t("Reference Number")}
            value={alldata?.CampaignCode}
            disabled
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email Subject"
            value={reviewData.CampaignEmailSubject}
            onChange={(e) =>
              setReviewData({
                ...reviewData,
                CampaignEmailSubject: e.target.value,
              })
            }
            required
            sx={{ mb: 2 }}
            error={!!errorMessages.CampaignEmailSubject}
            helperText={errorMessages.CampaignEmailSubject}
          />
          <TextField
            fullWidth
            label="Email Messages"
            multiline
            rows={6}
            required
            value={reviewData.CampaignEmailMessages}
            onChange={(e) =>
              setReviewData({
                ...reviewData,
                CampaignEmailMessages: e.target.value,
              })
            }
            sx={{ mb: 2 }}
            error={!!errorMessages.CampaignEmailMessages}
            helperText={errorMessages.CampaignEmailMessages}
          />
        </Box>

        <Box
          sx={{
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" color="error" className="esign-page-heading">
            {/* *Confirm all recipients and submit agreement */}
          </Typography>
          {/* <Typography variant="h6" className="esign-page-heading">
            Recipients
          </Typography> */}
          <Typography variant="body2" className="esign-page-subheading" mb={2}>
            {/* Additional instructions or information */}
          </Typography>

          <Box>
            <FormsAutocomp
              setReceivers={setReceivers}
              setSelecetdForm={setSelecetdForm}
            />
          </Box>

          {receivers?.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                py: 1,
                borderBottom: "1px solid #ddd",
              }}
            >
              {receivers?.map((item, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                  <Chip
                    label={item?.FieldLabel}
                    onDelete={() => handleRemoveReceiver(index)}
                  />
                </Box>
              ))}
            </Box>
          )}
          {errorMessages.receivers && (
            <Typography color="error">{errorMessages.receivers}</Typography>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={
                !reviewData.CampaignEmailSubject ||
                !reviewData.CampaignEmailMessages ||
                receivers.length === 0 ||
                !selecetdForm
              }
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ReviewAndSend;

ReviewAndSend.propTypes = {
  alldata: PropTypes.object.isRequired,
};
ReviewAndSend.defaultProps = {
  alldata: {},
};
