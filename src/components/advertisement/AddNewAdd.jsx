import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  Divider,
  Grid,
  TextField,
  Switch,
} from "@mui/material";
import Featuredicon from "../../assets/image/Featuredicon.png";
import { useDispatch } from "react-redux";
import DragandDropcustomzie from "../allpages/masterpopups/DragandDropcustomzie";
import {
  AddAdvertisement,
  EditAdvertisement,
} from "../../store/Advertisement/action";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import { validateInput } from "../../utils/securityUtils";
import errorHandler from "../../utils/errorHandler";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 700,
  height: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "24px",
  borderRadius: "12px",
  outline: "none",
  overflow: "hidden",
  maxHeight: "90vh",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  paddingBottom: "16px",
  borderBottom: "1px solid #E0E0E0",
};

const footerStyle = {
  marginTop: "24px",
};

const inputStyle = {
  width: "100%",
  borderRadius: "8px",
  fontSize: "16px",
  boxSizing: "border-box",
};

const labelStyle = {
  marginBottom: "8px",
  fontWeight: "bold",
};

const contentStyle = {
  overflowY: "auto",
  maxHeight: "60vh", // Adjust height as needed
  paddingBottom: "24px",
  marginTop: "16px",
  marginBottom: "16px",
};

const AddNewAdd = ({ open, onClose, editdata, pagination }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    AdvertisementTitle: "",
    AdvertisementDescription: "",
    ExpireDate: "",
    IsActive: true,
  });
  const [errors, setErrors] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const validateHTMLInput = (value) => {
    const htmlTagPattern = /<.*?>/g; // Regex to check for HTML tags
    if (htmlTagPattern.test(value)) {
      return true; // HTML or script tags detected
    }
    return false;
  };

  const validateForm = async () => {
    const newErrors = {};

    // Add security validation checks
    if (!validateInput(formState.AdvertisementTitle)) {
      newErrors.AdvertisementTitle =
        "Invalid input detected in advertisement title";
      errorHandler.addSecurityError(
        formState.AdvertisementTitle,
        "AdvertisementTitle"
      );
      setErrors(newErrors);
      return false;
    }

    if (!validateInput(formState.AdvertisementDescription)) {
      newErrors.AdvertisementDescription =
        "Invalid input detected in description";
      errorHandler.addSecurityError(
        formState.AdvertisementDescription,
        "AdvertisementDescription"
      );
      setErrors(newErrors);
      return false;
    }

    // Continue with existing validation
    // Validate title
    if (!formState.AdvertisementTitle) {
      newErrors.AdvertisementTitle = t("title_required");
    } else if (validateHTMLInput(formState.AdvertisementTitle)) {
      newErrors.AdvertisementTitle = t("title_invalid");
    }

    // Validate description
    if (!formState.AdvertisementDescription) {
      newErrors.AdvertisementDescription = t("description_required");
    } else if (validateHTMLInput(formState.AdvertisementDescription)) {
      newErrors.AdvertisementDescription = t("description_invalid");
    }

    // Validate expiry date
    if (!formState.ExpireDate) {
      newErrors.ExpireDate = t("expiry_date_required");
    }

    if (uploadedFile === null) setFileError(t("advertisement_required"));

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (await validateForm()) {
      const formData = new FormData();
      const {
        AdvertisementTitle,
        AdvertisementDescription,
        ExpireDate,
        IsActive,
      } = formState;

      formData.append("AdvertisementTitle", AdvertisementTitle);
      formData.append("AdvertisementDescription", AdvertisementDescription);
      formData.append("ExpireDate", moment(ExpireDate).format("YYYY-MM-DD"));
      formData.append("IsActive", IsActive);

      if (uploadedFile) {
        formData.append("AdvertisementBanner", uploadedFile);
      } else {
        setFileError("Advertisement banner is required.");
        return; // Exit early if file is required but not uploaded
      }

      try {
        let res;
        if (editdata) {
          formData.append("AdvertisementID", editdata.AdvertisementID);
          res = await dispatch(EditAdvertisement({ formData, pagination }));
        } else {
          res = await dispatch(AddAdvertisement({ formData, pagination }));
        }

        if (res?.meta?.requestStatus === "fulfilled") {
          handleClose();
        }
      } catch (error) {
        console.error("Submission error:", error);
        // Optionally set an error state to display to the user
      }
    }
  };

  const resetForm = () => {
    setFormState({
      AdvertisementTitle: "",
      AdvertisementDescription: "",
      ExpireDate: "",
      IsActive: true,
    });
    setUploadedFile(null);
    setFileError("");
    setErrors({});
  };

  useEffect(() => {
    console.log("editdata", editdata);
    if (editdata) {
      setFormState({ ...editdata });
      setUploadedFile(editdata.AdvertisementBanner);
    } else {
      setFormState({
        AdvertisementTitle: "",
        AdvertisementDescription: "",
        ExpireDate: "",
        IsActive: true,
      });
      setUploadedFile(null);
    }
    setFileError("");
    setErrors({});
  }, [editdata]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  return (
    <Modal open={open}>
      <Box sx={style}>
        <Box
          sx={{
            ...headerStyle,
            background: (theme) =>
              theme.palette.primary.main ||
              "linear-gradient(to top, #2C64FF, #4A90E2)",
            margin: "-24px -24px 0",
            padding: "24px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            borderBottom: "none",
            position: "relative", // Added for positioning
            pr: 8, // Add padding to prevent overlap
          }}
        >
          <img src={Featuredicon} alt="logo" />
          <Box flexGrow={1}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              {t("advertisement_management")}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#fff", textTransform: "none" }}
            >
              {t("advertisement_management_description")}
            </Typography>
          </Box>

          {/* Close button at top-right */}
          <Button
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 24,
              top: 24,
              minWidth: "auto",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 1L1 13M1 1L13 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </Box>

        <Box sx={contentStyle}>
          <Box>
            <Typography sx={labelStyle}>
              {t("advertisement_banner")}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <DragandDropcustomzie
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              setFileError={setFileError}
              title={t("browse_photo")}
              resolution={t("recommended_resolution", {
                resolution: "1330x200px",
              })}
              filetype={t("recommended_file_type", { fileType: "jpg, png" })}
            />
            {fileError && <Typography color="error">{fileError}</Typography>}
          </Box>
          <Box>
            <Typography sx={labelStyle}>
              {t("advertisement_title")}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              type="text"
              name="AdvertisementTitle"
              placeholder={t("advertisement_title_placeholder")}
              style={inputStyle}
              value={formState.AdvertisementTitle}
              onChange={onChange}
              error={!!errors.AdvertisementTitle}
              helperText={errors.AdvertisementTitle}
              aria-label="Advertisement Title"
            />
          </Box>
          <Box>
            <Typography sx={labelStyle}>
              {t("advertisement_description")}{" "}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              multiline
              rows={2}
              name="AdvertisementDescription"
              placeholder={t("advertisement_description_placeholder")}
              variant="outlined"
              fullWidth
              onChange={onChange}
              value={formState.AdvertisementDescription}
              error={!!errors.AdvertisementDescription}
              helperText={errors.AdvertisementDescription}
              aria-label="Advertisement Description"
            />
          </Box>
          <Box>
            <Typography sx={labelStyle}>
              {t("expiry_date")} <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              name="ExpireDate"
              variant="outlined"
              fullWidth
              type="date"
              onChange={onChange}
              value={formState?.ExpireDate}
              error={!!errors.ExpireDate}
              helperText={errors.ExpireDate}
              aria-label="Expiry Date"
            />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap="16px"
          >
            <Box
              display="flex"
              alignItems="center"
              gap="16px"
              sx={{
                marginTop: "16px",
              }}
            >
              <Switch
                checked={formState?.IsActive}
                onChange={() =>
                  setFormState({
                    ...formState,
                    IsActive: !formState.IsActive,
                  })
                }
              />
              <div>
                <Typography variant="b">{t("advertisement_status")}</Typography>
                <Typography variant="body2">
                  {t("advertisement_status_description")}
                </Typography>
              </div>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={footerStyle}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button variant="outlined" fullWidth onClick={handleClose}>
                {t("cancel")}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{
                  borderRadius: "8px",
                  backgroundColor: (theme) =>
                    theme.palette.primary.main || "#3D54CD",
                }}
                onClick={handleSubmit}
              >
                {t("save")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddNewAdd;
