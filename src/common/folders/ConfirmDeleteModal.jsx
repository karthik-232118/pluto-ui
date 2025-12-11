// ConfirmDeleteModal.js
import  { useState } from "react";
import { Modal, Box, Typography, Button, Grid, Divider } from "@mui/material";
import { DeleteCategoryApi } from "../../services/deleteElement/DeleteElement";
import ErrorContentModal from "./ErrorContentModal";
import { useTranslation } from "react-i18next";
// import { DeleteCategoryApi } from "../../api/DeleteCategoryApi"; // Import the API function


const ConfirmDeleteModal = ({ open, handleClose, item, handleDelete }) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(null); // To handle errors if any
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorContentNames, setErrorContentNames] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const ContentID = item?.ContentID;

  const handleConfirmDelete = async () => {
    if (!ContentID) return; // Ensure ContentID exists
    setLoading(true); // Start loading
    setError(null); // Reset error state
    try {
      const response = await DeleteCategoryApi({ ContentID }); // Call the API
      console.log("API Response:", response); // Log the full response to the console
      // Handle successful response
      if (response?.status === 200) {
        handleDelete(response.data); // Notify parent with the response data
        handleClose(); // Close the modal
        window.location.reload(); // Reload the page
      } else {
        // Handle cases where the response status is not 200
        console.error("API Error Response:", response?.data);
      const contentNames = response?.data?.data?.map(item => item.ContentName) || [];
      console.log("Content Names:", contentNames);
      setErrorContentNames(contentNames);
      setErrorMessage(response?.data?.message || "Cannot delete category.");
      setErrorModalOpen(true); // Open the error content modal
    }
    } catch (err) {
      console.error("API Error:", err); 
      setError("Failed to delete category. Please try again."); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
    <Modal open={open} onClose={handleClose}>
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
        <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
        {t("confirm_deletion_title")}
        </Typography>
        <Divider sx={{ marginBottom: "1rem" }} />
        <Typography variant="h6" sx={{ marginBottom: "2rem", color: "gray" }}>
        {t("confirm_deletion_message", { item: item?.ContentName })}
        </Typography>

        {/* Show error if exists */}
        {error && <Typography color="error">{error}</Typography>}

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete} // Trigger the delete function
              sx={{ marginRight: 2, textTransform: "none" }}
              fullWidth
              disabled={loading} // Disable the button while loading
            >
            {loading ? t("deleting_button") : t("delete_button")}{/* Show loading state */}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleClose}
             >
              {t("cancel")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
    <ErrorContentModal
    open={errorModalOpen}
    handleClose={() => setErrorModalOpen(false)}
    contentNames={errorContentNames}
    message={errorMessage}
  />
    </>
  );
};

export default ConfirmDeleteModal;
