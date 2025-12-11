import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Box,
  Grid,
  InputLabel,
  FormControl,
  Modal,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { AddNewReq, EditReq } from "../../store/myrequest/action";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";

const EditReqModal = ({ editdata, onClose, open }) => {
  const { t } = useTranslation();
  const [requestType, setRequestType] = useState("");
  const [requestName, setRequestName] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [rejectedBy, setRejectedBy] = useState("");
  const [rejectedDate, setRejectedDate] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [rejectedReason, setRejectedReason] = useState("");
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main; // Use theme color directly

  const dispatch = useDispatch();

  // Retrieve user_type from localStorage
  const userType = localStorage.getItem("user_type");
  const isAdmin = userType === "Admin";

  useEffect(() => {
    if (editdata) {
      setRequestType(editdata.RequestType);
      setRequestName(editdata.RequestTitle);
      setRequestDate(
        editdata.CreatedDate
          ? new Date(editdata.CreatedDate).toISOString().slice(0, 10)
          : ""
      );
      setDescription(editdata.RequestDescription);
      setPriority(editdata.RequestPriority.toLowerCase());
      setRejectedBy(editdata.RejectedBy || "");
      setRejectedDate(
        editdata.RejectedDate
          ? new Date(editdata.RejectedDate).toISOString().slice(0, 10)
          : ""
      );
      setRequestStatus(editdata.RequestStatus || "Pending");
      setRejectedReason(editdata.RejectedReason || "");
    } else {
      resetForm();
    }
  }, [editdata]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const regex = /^[a-zA-Z\s]*$/;

    if (!requestType) newErrors.requestType = t("Request Type is required.");
    if (!requestName.trim()) {
      newErrors.requestName = t("Request Name is required.");
    } else if (!regex.test(requestName)) {
      newErrors.requestName =
        "Request Name can only contain letters and spaces.";
    }
    if (!requestDate) newErrors.requestDate = t("Request Date is required.");
    if (!description.trim())
      newErrors.description = t("Description is required.");
    if (!priority) newErrors.priority = t("Priority is required.");
    if (!requestStatus)
      newErrors.requestStatus = t("Request Status is required.");
    if (requestStatus === "Rejected" && !rejectedReason.trim()) {
      newErrors.rejectedReason = t("Rejected Reason is required.");
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      RequestType: requestType,
      RequestTitle: requestName,
      RequestDate: requestDate,
      RequestDescription: description,
      RequestPriority:
        priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
      RejectedBy: rejectedBy,
      RejectedDate: rejectedDate,
      RequestStatus: requestStatus,
      RequestManagementID: editdata?.RequestManagementID,
      RejectedReason: requestStatus === "Rejected" ? rejectedReason : "",
    };

    if (editdata) {
      dispatch(EditReq({ ...payload, id: editdata.id }));
    } else {
      dispatch(AddNewReq(payload));
    }

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setRequestType("");
    setRequestName("");
    setRequestDate("");
    setDescription("");
    setPriority("");
    setRejectedBy("");
    setRejectedDate("");
    setRequestStatus("");
    setErrors({});
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          padding: 0,
          width: { xs: "90%", sm: "700px" },
          boxShadow: 24,
        }}
      >
        <Box
          sx={{
            background: bgcolor || "linear-gradient(to top, #2C64FF, #4A90E2)",
            padding: "24px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            position: "relative",
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff" }}>
            {editdata ? t("editRequest") : t("addRequest")}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#fff", textTransform: "none" }}
          >
            {editdata ? t("editRequestDesc") : t("addRequestDesc")}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ padding: "24px" }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <InputLabel id="request-name-label">
                  {t("requestTitle")}
                </InputLabel>
                <TextField
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  disabled={isAdmin}
                  fullWidth
                  error={!!errors.requestName}
                  helperText={errors.requestName ? errors.requestName : ""}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputLabel id="request-type-label">
                  {t("requestType")}
                </InputLabel>
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.requestType}
                >
                  <Select
                    labelId="request-type-label"
                    value={requestType || ""}
                    onChange={(e) => setRequestType(e.target.value)}
                    disabled={isAdmin}
                  >
                    <MenuItem value="add">{t("add")}</MenuItem>
                    <MenuItem value="edit">{t("edit")}</MenuItem>
                    <MenuItem value="delete">{t("delete")}</MenuItem>
                  </Select>
                  {errors.requestType && (
                    <p style={{ color: "red" }}>{errors.requestType}</p>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputLabel id="request-date-label">
                  {t("requestDate")}
                </InputLabel>
                <TextField
                  value={requestDate}
                  disabled
                  fullWidth
                  error={!!errors.requestDate}
                  helperText={errors.requestDate ? errors.requestDate : ""}
                  margin="normal"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputLabel id="priority-label">{t("priority")}</InputLabel>
                <FormControl fullWidth margin="normal">
                  <Select
                    labelId="priority-label"
                    value={priority || ""}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={isAdmin}
                    error={!!errors.priority}
                  >
                    <MenuItem value="low">{t("low")}</MenuItem>
                    <MenuItem value="medium">{t("medium")}</MenuItem>
                    <MenuItem value="high">{t("high")}</MenuItem>
                  </Select>
                  {errors.priority && (
                    <p style={{ color: "red" }}>{errors.priority}</p>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputLabel id="request-status-label">
                  {t("requestStatus")} <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <FormControl fullWidth margin="normal">
                  <Select
                    labelId="request-status-label"
                    value={requestStatus}
                    onChange={(e) => setRequestStatus(e.target.value)}
                    disabled={!isAdmin}
                    fullWidth
                    error={!!errors.requestStatus}
                  >
                    <MenuItem value="Pending">{t("pending")}</MenuItem>
                    <MenuItem value="Rejected">{t("rejected")}</MenuItem>
                    <MenuItem value="Approved">{t("approved")}</MenuItem>
                  </Select>
                  {errors.requestStatus && (
                    <p style={{ color: "red" }}>{errors.requestStatus}</p>
                  )}
                </FormControl>
              </Grid>

              {requestStatus === "Rejected" && (
                <Grid item xs={12}>
                  <TextField
                    label={t("rejectedReason")}
                    multiline
                    rows={4}
                    value={rejectedReason}
                    onChange={(e) => setRejectedReason(e.target.value)}
                    fullWidth
                    margin="normal"
                    error={!!errors.rejectedReason}
                    helperText={
                      errors.rejectedReason ? errors.rejectedReason : ""
                    }
                    disabled={!isAdmin}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  label={t("description")}
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  margin="normal"
                  error={!!errors.description}
                  helperText={errors.description ? errors.description : ""}
                  disabled={isAdmin}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    onClose();
                    resetForm();
                  }}
                  fullWidth
                >
                  {t("cancel")}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  // sx={{ backgroundColor: bgcolor }}
                >
                  {editdata ? t("Update") : t("save")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditReqModal;
