import  { useState } from "react";
import "./index.css";
import { Button, Modal, Typography, Box, TextField } from "@mui/material";
import PropTypes from "prop-types";

const Stamp = ({ formData, setFormData, markerData }) => {
  const [signatureTabOpen, setSignatureTabOpen] = useState(false);

  const handleOpenSignatureTab = () => setSignatureTabOpen(true);
  const handleCloseSignatureTab = () => setSignatureTabOpen(false);

  const onSignatureImageChoose = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      formData[markerData.markerId] = {
        markerId: markerData.markerId,
        markerType: "image",
        data: reader.result,
      };
      setFormData(formData);
      handleCloseSignatureTab();
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const data = formData[markerData?.markerId]?.data;

  return (
    <>
      <Box
        className="signature"
        onClick={handleOpenSignatureTab}
        sx={{
          cursor: "pointer",
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        {data ? (
          <img
            src={data}
            alt="signature"
            style={{
              width: "99px",
              height: "48px",
            }}
          />
        ) : (
          <Typography variant="body2">Click to add stamp</Typography>
        )}
      </Box>

      <Modal open={signatureTabOpen} onClose={handleCloseSignatureTab}>
        <Box
          className="signature__modal"
          sx={{
            width: "90%",
            margin: "auto",
            mt: 5,
            bgcolor: "background.paper",
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Modal heading
          </Typography>
          <Box>
            <Typography>Choose your signature</Typography>
            <TextField
              type="file"
              fullWidth
              inputProps={{ accept: "image/*" }}
              onChange={onSignatureImageChoose}
              sx={{ mt: 2 }}
            />
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseSignatureTab}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseSignatureTab}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Stamp;


Stamp.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  markerData: PropTypes.object.isRequired,
};