import  { useState } from "react";
import { Box, Modal, Typography, Button, Divider, TextField } from "@mui/material";
import PropTypes from "prop-types";

const IntegrationModal = ({ open, heading, onClose, onSave }) => {
  const isGoogle = heading === "Google Integration";

  // Define all labels
  const labels = {
    GoogleClientID: "",
    GoogleClientSecret: "",
    GoogleTenantID: "",
    MicrosoftClientID: "",
    MicrosoftClientSecret: "",
    MicrosoftTenantID: "",
  };

  // State to hold form values
  const [formValues, setFormValues] = useState(labels);

  // Handle input changes dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save button click
  const handleSave = () => {
    onSave(formValues); // Send all form values to the parent
    onClose(); // Close the modal
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}
      >
        <Typography variant="h6" component="h2">
          {heading}
        </Typography>
        <Divider sx={{ mt: 2 }} />
        <Typography sx={{ mt: 2, mb: 3 }}>
          Please provide the following details to complete the {heading}  setup:
        </Typography>
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Render only the relevant inputs based on the heading */}
          <TextField
            label={isGoogle ? "GoogleClientID" : "MicrosoftClientID"}
            variant="outlined"
            fullWidth
            required
            name={isGoogle ? "GoogleClientID" : "MicrosoftClientID"}
            value={formValues[isGoogle ? "GoogleClientID" : "MicrosoftClientID"]}
            onChange={handleInputChange}
          />
          <TextField
            label={isGoogle ? "GoogleClientSecret" : "MicrosoftClientSecret"}
            variant="outlined"
            fullWidth
            required
            type="password"
            name={isGoogle ? "GoogleClientSecret" : "MicrosoftClientSecret"}
            value={formValues[isGoogle ? "GoogleClientSecret" : "MicrosoftClientSecret"]}
            onChange={handleInputChange}
          />
          <TextField
            label={isGoogle ? "GoogleTenantID" : "MicrosoftTenantID"}
            variant="outlined"
            fullWidth
            required
            name={isGoogle ? "GoogleTenantID" : "MicrosoftTenantID"}
            value={formValues[isGoogle ? "GoogleTenantID" : "MicrosoftTenantID"]}
            onChange={handleInputChange}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button variant="contained" onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default IntegrationModal;

IntegrationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  heading: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
