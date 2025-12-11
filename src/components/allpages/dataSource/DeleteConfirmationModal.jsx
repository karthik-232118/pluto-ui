import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Delete, Warning, Close } from "@mui/icons-material";
import { useState } from "react";
import { toast } from "react-toastify";
import { DeleteDataSourceApi } from "../../../services/dashboardBuilder/DashboardBuilder";

const DeleteConfirmationModal = ({
  open,
  onClose,
  selectedDataSourceId,
  onDeleteSuccess,
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!selectedDataSourceId) {
      toast.error("No data source selected for deletion");
      return;
    }

    setDeleting(true);
    try {
      console.log("Deleting data source with ID:", selectedDataSourceId);
      await DeleteDataSourceApi({ DataSourceID: selectedDataSourceId });
      toast.success("Data source deleted successfully!");
      onDeleteSuccess?.();
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete data source");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: "error.main", color: "common.white", p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Warning sx={{ color: "#FFD600" }} />
            Confirm Delete
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={deleting}
            sx={{
              color: "common.white",
              ml: 2,
              p: 0.5,
            }}
            size="small"
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2 }}>
        <Typography variant="body1">
          Are you sure you want to delete this data source?
        </Typography>
        {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Data Source ID: <strong>{selectedDataSourceId}</strong>
        </Typography> */}
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleConfirmDelete}
          disabled={deleting}
          variant="contained"
          color="error"
          startIcon={deleting ? <CircularProgress size={16} /> : <Delete />}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
