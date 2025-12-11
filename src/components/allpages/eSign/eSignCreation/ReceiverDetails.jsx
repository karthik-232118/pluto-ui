import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  IconButton,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import InternalUser from "./InternalUser";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function ReceiverDetails({ receivers, setReceivers }) {
  const { t } = useTranslation();
  const [Isinternal, setIsInternal] = useState(false);

  const handleInputChange = (index, event) => {
    const newReceivers = receivers.map((receiver, rIndex) => {
      if (index === rIndex) {
        return { ...receiver, [event.target.name]: event.target.value };
      }
      return receiver;
    });

    setReceivers(newReceivers);
  };

  const addReceiver = () => {
    // Check if all existing receivers are fully filled out
    const allFieldsFilled = receivers.every(
      (receiver) =>
        receiver.UserName && receiver.UserEmail && receiver.UserPhoneNumber
    );

    if (!allFieldsFilled) {
      alert(
        "Please fill out all fields for existing invitees before adding a new one."
      );
      return;
    }

    // Add a new invitee
    setReceivers([
      ...receivers,
      { UserName: "", UserEmail: "", UserPhoneNumber: "", Markers: [] },
    ]);
  };

  const removeReceiver = (index) => {
    // Remove the receiver at the specific index
    const newReceivers = receivers.filter((_, rIndex) => rIndex !== index);
    setReceivers(newReceivers);
  };
  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            value={Isinternal}
            onChange={() => {
              setIsInternal(!Isinternal);
            }}
          />
        }
        label={t("Internal User")}
      />

      <>
        {Isinternal && (
          <InternalUser setReceivers={setReceivers} receivers={receivers} />
        )}
        <br />
        {receivers.map((receiver, index) => (
          <React.Fragment key={index}>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label={t("Name")}
                  variant="outlined"
                  fullWidth
                  required
                  name="UserName"
                  value={receiver.UserName}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder={t("Enter Receiver Name")}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label={t("Email")}
                  variant="outlined"
                  fullWidth
                  required
                  name="UserEmail"
                  value={receiver.UserEmail}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder={t("Enter Receiver Email")}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label={t("Mobile Number")}
                  variant="outlined"
                  fullWidth
                  required
                  type="tel"
                  inputProps={{
                    maxLength: 15,
                    pattern: "[0-9]*", // This helps with mobile keyboard input
                    inputMode: "numeric", // Shows numeric keyboard on mobile devices
                  }}
                  name="UserPhoneNumber"
                  value={receiver.UserPhoneNumber}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, "");
                    e.target.value = value;
                    handleInputChange(index, e);
                  }}
                  placeholder={t("Enter Receiver Mobile Number")}
                />
              </Grid>
            </Grid>
            {receivers.length > 1 && (
              <Box display="flex" justifyContent="flex-end" mb={1}>
                <IconButton
                  onClick={() => removeReceiver(index)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </React.Fragment>
        ))}
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            onClick={addReceiver}
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
          >
            {t("Add Invitee")}
          </Button>
        </Box>
      </>
    </Box>
  );
}

export default ReceiverDetails;

ReceiverDetails.propTypes = {
  receivers: PropTypes.arrayOf(
    PropTypes.shape({
      UserName: PropTypes.string,
      UserEmail: PropTypes.string,
      UserPhoneNumber: PropTypes.string,
      Markers: PropTypes.array,
    })
  ).isRequired, // Array of receiver objects
  setReceivers: PropTypes.func.isRequired, // Function to update the receivers array
};
