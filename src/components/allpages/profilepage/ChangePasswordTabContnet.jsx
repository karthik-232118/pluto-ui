import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/styles";
import { useDispatch } from "react-redux";
import { ChangePasowrd } from "../../../store/user/user";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { t } from "i18next";

const CustomTextField = styled(TextField)(() => ({
  borderRadius: "8px",
  boxShadow: "0px 1px 2px 0px #1018280D",
  "& fieldset": {
    borderColor: "#D0D5DD",
  },
  "&:hover fieldset": {
    borderColor: "#D0D5DD",
  },
  "&.Mui-focused fieldset": {
    borderColor: "#D0D5DD",
  },
  "&.MuiOutlinedInput:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 30px #fff inset !important",
    boxShadow: "0 0 0 30px #fff inset !important",
    WebkitTextFillColor: "#000 !important",
    height: "20px !important",
  },
  "&.MuiOutlinedInput:-webkit-autofill:focus": {
    borderColor: "#3f51b5",
  },
}));

const checkPasswordStrength = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*]/.test(password);
  const isLongEnough = password.length >= 8;

  const strengthCriteriaMet = [
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChars,
    isLongEnough,
  ].filter(Boolean).length;

  if (strengthCriteriaMet < 3) return "Weak";
  if (strengthCriteriaMet === 3) return "Medium";
  return "Strong";
};

const ChangePasswordTabContent = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    OldPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "NewPassword") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Validation logic
    if (name === "OldPassword" && !value) {
      setErrors((prev) => ({
        ...prev,
        OldPassword: "Old password is required",
      }));
    } else if (name === "NewPassword") {
      if (!value) {
        setErrors((prev) => ({
          ...prev,
          NewPassword: "New password is required",
        }));
      } else if (value.length < 8) {
        setErrors((prev) => ({
          ...prev,
          NewPassword: "Password must be at least 8 characters",
        }));
      } else {
        setErrors((prev) => {
          const { ...rest } = prev;
          return rest; // Clear the NewPassword error
        });
      }
    } else if (name === "ConfirmPassword") {
      if (value !== formData.NewPassword) {
        setErrors((prev) => ({
          ...prev,
          ConfirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => {
          const { ...rest } = prev;
          return rest; // Clear the ConfirmPassword error
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.OldPassword) {
      newErrors.OldPassword = "Old password is required";
    }
    if (!formData.NewPassword) {
      newErrors.NewPassword = "New password is required";
    } else if (formData.NewPassword.length < 8) {
      newErrors.NewPassword = "Password must be at least 8 characters";
    }
    if (formData.NewPassword !== formData.ConfirmPassword) {
      newErrors.ConfirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      dispatch(ChangePasowrd(formData));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault(); // Prevent paste action
  };
  return (
    <Box>
      <Typography variant="h6" className="heading">
        {t("changePasswordTitle")}
      </Typography>
      <Typography
        variant="body1"
        className="subheading"
        sx={{ color: "#64748B", fontSize: "14px", fontWeight: "400" }}
      >
        {t("changePasswordDescription")}
      </Typography>

      <Divider className="divider" />

      <p className="inputheading">
        {t("enterOldPassword")} <span style={{ color: "red" }}>*</span>
      </p>
      <Box className="inputContainer">
        <CustomTextField
          type="password"
          placeholder={t("oldPasswordPlaceholder")}
          className="inputField"
          onChange={handleChange}
          name="OldPassword"
          value={formData.OldPassword}
          error={Boolean(errors.OldPassword)}
          helperText={errors.OldPassword}
          sx={{
            "& .MuiInputBase-root": {
              width: "354px !important",
              height: "40px !important",
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      <p className="inputheading">
        {t("enterNewPassword")} <span style={{ color: "red" }}>*</span>
      </p>
      <Box className="inputContainer">
        <CustomTextField
          type={showNewPassword ? "text" : "password"}
          placeholder={t("newPasswordPlaceholder")}
          className="inputField"
          onChange={handleChange}
          value={formData.NewPassword}
          name="NewPassword"
          sx={{
            "& .MuiInputBase-root": {
              width: "354px !important",
              height: "40px !important",
              borderRadius: "8px",
            },
          }}
          error={Boolean(errors.NewPassword)}
          helperText={errors.NewPassword}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setShowNewPassword((prev) => !prev)}>
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Typography
          variant="body2"
          style={{
            color:
              passwordStrength === "Strong"
                ? "green"
                : passwordStrength === "Weak"
                ? "red"
                : "orange",
          }}
        >
          {passwordStrength}
        </Typography>
      </Box>

      <p className="inputheading">
        {t("confirmNewPassword")} <span style={{ color: "red" }}>*</span>
      </p>
      <Box className="inputContainer">
        <CustomTextField
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
          className="inputField"
          onChange={handleChange}
          name="ConfirmPassword"
          value={formData.ConfirmPassword}
          sx={{
            "& .MuiInputBase-root": {
              width: "354px !important",
              height: "40px !important",
              borderRadius: "8px",
            },
          }}
          error={Boolean(errors.ConfirmPassword)}
          helperText={errors.ConfirmPassword}
          onPaste={handlePaste} // Prevent paste action
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {/* <Button
          variant="outlined"
          onClick={() => {
            setFormData({});
          }}
          className="cancelButton"
        >
          Reset
        </Button> */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            textTransform: "none",
          }}
        >
          {t("saveChanges")}
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePasswordTabContent;
