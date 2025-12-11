// EditProfile.js
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Avatar,
} from "@mui/material";
import upload from "../../../assets/svg/EditPage/upload.svg";
import { styled, useTheme } from "@mui/styles";
import "./EditProfile.css";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../../config/urlConfig";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: "20px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));

const CustomTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    boxShadow: "0px 1px 2px 0px #1018280D", // Custom box shadow
    borderColor: "#D0D5DD", // Custom border color
    "& fieldset": {
      borderColor: "#D0D5DD", // Applied on fieldset to change the border color
    },
    "&:hover fieldset": {
      borderColor: "#D0D5DD", // Ensure it stays the same color on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#D0D5DD", // Ensure it stays the same when focused
    },
  },
}));

const EditProfile = ({ handleCancel, handleSaveChanges }) => {
  const { t } = useTranslation();
  const { userdata } = useSelector((state) => state?.user);
  const [initialValues, setInitialValues] = useState({});
  const [formData, setFormData] = useState({
    UserFirstName: "",
    UserLastName: "",
    UserEmail: "",
    UserPhoneNumber: "",
    UserAddress: "",
    Gender: "",
  });
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main;

  const handleChange = (e) => {
    const { value, name } = e.target;
    const htmlTagPattern = /<.*?>/g;

    if (htmlTagPattern.test(value)) {
      // Clear the field if invalid input is detected
      setFormData({ ...formData, [name]: "" });
      // Display an error message using toast
      toast.error("HTML or script tags are not allowed.");
      return;
    }

    setFormData({ ...formData, [name]: value });

    // Validate the changed field and update errors
    const newErrors = validateField(name, value);
    setErrors(newErrors);
  };
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "UserFirstName":
        if (!value) {
          newErrors.UserFirstName = "First Name is required";
        } else {
          delete newErrors.UserFirstName;
        }
        break;
      case "UserEmail":
        if (!value) {
          newErrors.UserEmail = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.UserEmail = "Invalid email format";
        } else {
          delete newErrors.UserEmail;
        }
        break;
      case "UserPhoneNumber":
        if (!value) {
          newErrors.UserPhoneNumber = "Phone Number is required";
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.UserPhoneNumber = "Phone Number must be exactly 10 digits";
        } else {
          delete newErrors.UserPhoneNumber;
        }
        break;
      case "UserLocation":
        if (!value) {
          newErrors.UserLocation = "Location is required";
        } else {
          delete newErrors.UserLocation;
        }
        break;
      case "Gender":
        if (!value) {
          newErrors.Gender = "Gender is required";
        } else {
          delete newErrors.Gender;
        }
        break;
      default:
        break;
    }

    return newErrors;
  };

  const validate = () => {
    const allErrors = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      const fieldErrors = validateField(key, value);
      Object.assign(allErrors, fieldErrors);
    });
    return allErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      handleSaveChanges(formData);
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    setInitialValues({
      UserFirstName: userdata?.UserFirstName,
      UserLastName: userdata?.UserLastName,
      UserEmail: userdata?.UserEmail,
      UserPhoneNumber: userdata?.UserPhoneNumber,
      UserAddress: userdata?.UserAddress,
      Gender: userdata?.Gender,
    });

    setFormData({
      UserFirstName: userdata?.UserFirstName,
      UserLastName: userdata?.UserLastName,
      UserEmail: userdata?.UserEmail,
      UserPhoneNumber: userdata?.UserPhoneNumber,
      UserAddress: userdata?.UserAddress,
      Gender: userdata?.Gender,
    });
  }, [userdata]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, UserPhoto: file });
    }
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialValues);
  };
  return (
    <Box className="edit-profile-container">
      {/* <Typography className="section-heading">Personal Information</Typography> */}
      {/* <Divider sx={{ my: 2 }} /> */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <AvatarContainer>
          <Avatar
            alt={userdata?.UserFirstName}
            src={
              userdata?.UserPhoto !== null &&
              userdata?.UserPhoto !== undefined &&
              `${BASE_URL}${userdata?.UserPhoto}`
            }
            className="avatar"
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button
              variant="contained"
              component="label"
              endIcon={
                <span>
                  <img src={upload} alt="" />
                </span>
              }
              // className="upload-button"
              sx={{
                textTransform: "none",
                backgroundColor: bgcolor || "#2C64FF", // Use the custom hook for background color
                "&:hover": {
                  backgroundColor: bgcolor || "#2C64FF", // Ensure hover color matches
                },
              }}
            >
              {t("uploadPhotoButton")}
              <input
                type="file"
                hidden
                name="UserPhoto"
                onChange={handleFileChange}
              />
            </Button>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                marginTop: "8px",
              }}
            >
              {t("uploadImageNote")}
            </Typography>
          </Box>
        </AvatarContainer>
      </Box>
      <Box className="form-field-container">
        <Box className="form-field">
          <Typography
            variant="body2"
            gutterBottom
            style={{ fontWeight: "500" }}
          >
            {t("firstNameLabel")}
            <span style={{ color: "red" }}>*</span>
          </Typography>
          <CustomTextField
            onChange={handleChange}
            fullWidth
            name="UserFirstName"
            variant="outlined"
            size="small"
            error={errors?.UserFirstName}
            helperText={errors?.UserFirstName}
            value={formData?.UserFirstName}
          />
        </Box>
        <Box className="form-field">
          <Typography
            variant="body2"
            gutterBottom
            style={{ fontWeight: "500" }}
          >
            {t("lastNameLabel")}
          </Typography>
          <CustomTextField
            onChange={handleChange}
            name="UserLastName"
            fullWidth
            variant="outlined"
            size="small"
            error={errors?.UserLastName}
            helperText={errors?.UserLastName}
            value={formData?.UserLastName}
          />
        </Box>
        <Box className="form-field">
          <Typography
            variant="body2"
            gutterBottom
            style={{ fontWeight: "500" }}
          >
            {t("emailAddressLabel")} <span style={{ color: "red" }}>*</span>
          </Typography>
          <CustomTextField
            onChange={handleChange}
            name="UserEmail"
            fullWidth
            variant="outlined"
            size="small"
            error={errors?.UserEmail}
            helperText={errors?.UserEmail}
            value={formData?.UserEmail}
          />
        </Box>
        <Box className="form-field">
          <Typography
            variant="body2"
            gutterBottom
            style={{ fontWeight: "500" }}
          >
            {t("phoneNumberLabel")} <span style={{ color: "red" }}>*</span>
          </Typography>
          <CustomTextField
            onChange={handleChange}
            fullWidth
            variant="outlined"
            name="UserPhoneNumber"
            size="small"
            error={errors?.UserPhoneNumber}
            helperText={errors?.UserPhoneNumber}
            value={formData?.UserPhoneNumber}
            onInput={(e) => {
              e.target.value = e.target.value
                .replace(/[^0-9]/g, "")
                .slice(0, 10);
            }}
          />
        </Box>
        <Box className="form-field">
          <Typography
            variant="body2"
            gutterBottom
            style={{ fontWeight: "500" }}
          >
            {t("locationLabel")} <span style={{ color: "red" }}>*</span>
          </Typography>
          <CustomTextField
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
            name="UserAddress"
            value={formData?.UserAddress}
          />
        </Box>
        <Box className="form-field">
          <Typography
            variant="body2"
            gutterBottom
            style={{ fontWeight: "500" }}
          >
            {t("genderLabel")} <span style={{ color: "red" }}>*</span>
          </Typography>
          <CustomTextField
            onChange={handleChange}
            fullWidth
            variant="outlined"
            size="small"
            select
            name="Gender"
            error={errors?.Gender}
            helperText={errors?.Gender}
            value={formData?.Gender}
          >
            <MenuItem value="male">{t("genderOptions.male")}</MenuItem>
            <MenuItem value="female">{t("genderOptions.female")}</MenuItem>
            <MenuItem value="other">{t("genderOptions.other")}</MenuItem>
          </CustomTextField>
        </Box>
      </Box>

      {/* <Typography className="section-heading" sx={{ mt: 3 }}>
        Additional Information
      </Typography> */}

      {/* <Divider sx={{ marginY: "10px", mb: 0 }} /> */}

      {/* <Grid container spacing={2} style={{ fontWeight: "500" }}>
        <Grid item xs={12} md={6}>
          <p>First Name</p>
        </Grid>
        <Grid item xs={12} md={6}>
          <p>Last Name</p>
        </Grid>
      </Grid> */}

      <Box className="button-container">
        <Button
          variant="outlined"
          onClick={handleCancel}
          className="cancel-button"
        >
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          // className="save-button"
          // disabled={!hasChanges()} // Disable button if no changes
          sx={{
            textTransform: "none",
            backgroundColor: bgcolor || "#2C64FF", // Use the custom hook for background color
            "&:hover": {
              backgroundColor: bgcolor || "#2C64FF", // Ensure hover color matches
            },
          }}
        >
          {t("saveChangesButton")}
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfile;

EditProfile.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleSaveChanges: PropTypes.func.isRequired,
};
