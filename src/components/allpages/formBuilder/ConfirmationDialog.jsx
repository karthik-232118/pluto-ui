import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";

const ConfirmationDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  formBuilderData,
}) => {
  const isEmpty = !formBuilderData || formBuilderData.length === 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableEscapeKeyDown={isSubmitting}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {isEmpty ? "No Form Data Available" : "Confirm Submission"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isEmpty
            ? "It looks like you haven’t created any form elements yet. Please add fields to your form before submitting."
            : "Are you sure you want to submit the form? Once submitted, this action cannot be undone."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
          {isEmpty ? "Close" : "Cancel"}
        </Button>
        {!isEmpty && (
          <Button onClick={onSubmit} color="primary" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : "Yes, Submit"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  formBuilderData: PropTypes.array,
};
ConfirmationDialog.defaultProps = {
  isSubmitting: false,
  formBuilderData: [],
};
ConfirmationDialog.displayName = "ConfirmationDialog";
