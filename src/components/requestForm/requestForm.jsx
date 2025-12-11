import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  Select,
  MenuItem,
  Box,
  Grid,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AddNewReq } from "../../store/myrequest/action";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";
import { validateInput } from "../../utils/securityUtils";
import errorHandler from "../../utils/errorHandler";

const RequestForm = () => {
  const { t } = useTranslation();
  const [requestType, setRequestType] = useState("");
  const [requestName, setRequestName] = useState("");
  const [requestDate, setRequestDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main; // Use theme color directly

  const dispatch = useDispatch();
  const validateHTMLInput = (value) => {
    const htmlTagPattern = /<.*?>/g; // Regex to check for HTML tags
    if (htmlTagPattern.test(value)) {
      return true; // HTML or script tags detected
    }
    return false;
  };

  // Handle input change with validation
  const handleInputChange = (e, setter) => {
    const { value, name } = e.target;

    // Check for HTML tags
    if (validateHTMLInput(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "HTML or script tags are not allowed.",
      }));
      setter("");
      return;
    }

    setter(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error message if no HTML is detected
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Add security validation checks
    if (!validateInput(requestName)) {
      newErrors.requestName =
        "Invalid input detected. Please enter a valid request name.";
      errorHandler.addSecurityError(requestName, "requestName");
      setErrors(newErrors);
      return;
    }

    if (!validateInput(description)) {
      newErrors.description =
        "Invalid input detected. Please enter a valid description.";
      errorHandler.addSecurityError(description, "description");
      setErrors(newErrors);
      return;
    }

    // Perform existing validation
    const regex = /^[a-zA-Z\s]*$/; // Adjust regex as needed

    if (!requestType) newErrors.requestType = t("Request Type is required.");
    if (!requestName.trim()) {
      newErrors.requestName = t("Request Name is required.");
    } else if (!regex.test(requestName)) {
      newErrors.requestName = t(
        "Request Name can only contain letters and spaces."
      );
    }
    if (!requestDate) newErrors.requestDate = t("Request Date is required.");
    if (!description.trim())
      newErrors.description = t("Description is required.");
    if (!priority) newErrors.priority = t("Priority is required.");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    const capitalizedPriority =
      priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();

    const payload = {
      RequestType: requestType,
      RequestTitle: requestName,
      RequestDate: requestDate,
      RequestDescription: description,
      RequestPriority: capitalizedPriority,
    };

    dispatch(AddNewReq(payload));

    // Reset form fields
    setRequestType("");
    setRequestName("");
    setRequestDate("");
    setDescription("");
    setPriority("");
    setErrors({});
  };

  return (
    <Card sx={{ padding: "1rem", margin: "1.5rem" }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <InputLabel>{t("requestType")}</InputLabel>
            <FormControl fullWidth margin="normal">
              <Select
                labelId="request-type-label"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                fullWidth
                error={!!errors.requestType}
              >
                <MenuItem value="">{t("selectType")}</MenuItem>
                <MenuItem value="add">{t("add")}</MenuItem>
                <MenuItem value="edit">{t("edit")}</MenuItem>
                <MenuItem value="delete">{t("delete")}</MenuItem>
              </Select>
              {errors.requestType && (
                <Typography varient="body1" sx={{ color: "red", fontSize: 12 }}>
                  {errors.requestType}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <InputLabel>{t("requestTitle")}</InputLabel>
            <FormControl fullWidth margin="normal">
              <TextField
                value={requestName}
                onChange={(e) => handleInputChange(e, setRequestName)}
                fullWidth
                error={!!errors.requestName}
              />
              {errors.requestName && (
                <Typography varient="body1" sx={{ color: "red", fontSize: 12 }}>
                  {errors.requestName}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <InputLabel>{t("priority")} </InputLabel>
            <FormControl fullWidth margin="normal">
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                fullWidth
                error={!!errors.priority}
              >
                <MenuItem value="">{t("selectPriority")}</MenuItem>
                <MenuItem value="low">{t("low")}</MenuItem>
                <MenuItem value="medium">{t("medium")}</MenuItem>
                <MenuItem value="high">{t("high")}</MenuItem>
              </Select>
              {errors.priority && (
                <Typography varient="body1" sx={{ color: "red", fontSize: 12 }}>
                  {errors.priority}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <TextField
                label={t("description")}
                multiline
                rows={4}
                value={description}
                onChange={(e) => handleInputChange(e, setDescription)}
                fullWidth
                // margin="normal"
                error={!!errors.description}
                // helperText={errors.description}
              />
              {errors.priority && (
                <Typography varient="body1" sx={{ color: "red", fontSize: 12 }}>
                  {errors.description}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <Box
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              backgroundColor: bgcolor || "#2C64FF",
            }}
          >
            {t("save")}
          </Button>
          <Button
            variant="outlined"
            sx={{ textTransform: "none", color: "#000", borderColor: "#000" }}
            onClick={() => {
              setRequestType("");
              setRequestName("");
              setRequestDate("");
              setDescription("");
              setPriority("");
              setErrors({});
            }}
          >
            {t("cancel")}
          </Button>
        </Box>
      </form>
    </Card>
  );
};

export default RequestForm;
