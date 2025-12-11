import { useState } from "react";
import { Modal, Box, Typography, Button, Divider, Grid } from "@mui/material";
import { toast } from "react-toastify";
import { Delete_Risk_API } from "../../../services/sopRisk/SOPRisk";
import PropTypes from "prop-types";
const DeleteConfirmationModal = ({ open, onClose, selectedRisk, onDelete }) => {
  const riskId = selectedRisk?.RiskID;
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const payload = { RiskID: riskId };
      const response = await Delete_Risk_API(payload);
      if (response.status === 200) {
        toast.success("Risk deleted successfully!");
        onDelete(riskId);
        onClose();
      } else {
        toast.error("Failed to delete the risk");
      }
    } catch (error) {
      console.error("Error deleting risk:", error);
      toast.error("An error occurred while deleting the risk");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
       sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="start"
          textAlign="center"
        >
         
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Confirm Deletion
          </Typography>
          <Divider sx={{ width: "100%", mb: 2 }} />
          <Typography  variant="h6" sx={{ marginBottom: "2rem", color: "gray",fontWeight:"550" }}  >
            Are you sure you want to delete this risk? 
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleDelete}
                disabled={loading}
                sx={{ marginRight: 2, textTransform: "none" ,backgroundColor:"#B91C1C"}}             >
                {loading ? "Deleting..." : "Confirm"}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                onClick={onClose}
                 >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedRisk: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};
