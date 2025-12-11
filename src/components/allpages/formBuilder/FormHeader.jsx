import { Box, Typography, Button } from "@mui/material";
import PropTypes from "prop-types";

const FormHeader = ({
  isPreview,
  handleOpenDialog,
  togglePreview,
  isSubmitting,
  formBuilderData,
}) => {
 

  const disableSubmitButton = isSubmitting || !formBuilderData.length;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "#3B82F6" }}>
        Create Form
      </Typography>
      <Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={togglePreview}
          sx={{ mb: 2, fontSize: "16px", mr: 2 }}
          disabled={isSubmitting}
        >
          {isPreview ? "Back to Edit" : "Preview Form"}
        </Button>
        {isPreview && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            sx={{ mb: 2, fontSize: "16px" }}
            disabled={disableSubmitButton}
          >
            Submit Form
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FormHeader;


FormHeader.propTypes = {
  isPreview: PropTypes.bool.isRequired,
  handleOpenDialog: PropTypes.func.isRequired,
  togglePreview: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  formBuilderData: PropTypes.array.isRequired,
};