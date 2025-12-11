import icon from "../../../assets/svg/sopsModal/modalIcon.svg";

import {
  Box,
  Button,
  Divider,
  Modal,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";
import { validateInput } from "../../../utils/securityUtils";
import errorHandler from "../../../utils/errorHandler";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 800,
  height: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "24px",
  borderRadius: "12px",
  outline: "none",
  overflow: "hidden",
  maxHeight: "100vh",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  paddingBottom: "16px",
  borderBottom: "1px solid #E0E0E0",
};

const contentStyle = {
  overflowY: "auto",
  maxHeight: "60vh", // Adjust height as needed
  paddingBottom: "24px",
  marginTop: "16px",
  marginBottom: "16px",
};

const EditUserDialog = ({
  open = false,
  onClose,
  editData,
  setEditData,
  handleUpdateUser,
  handleChange,
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [eSignEnabled, setESignEnabled] = useState(false);
  const [setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const { t } = useTranslation();
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main;

  useEffect(() => {
    if (editData?.UserSiganture) {
      setESignEnabled(true);
      setSignaturePreview(editData.UserSiganture);
    } else {
      setSignaturePreview(null);
    }
  }, [editData]);

  const handleESignToggle = (event) => {
    const checked = event.target.checked;
    setESignEnabled(checked);
    if (checked) {
      setEditData((prevData) => ({
        ...prevData,
        ESignUserName: prevData.UserName || "",
        ESignFirstName: prevData.UserFirstName || "",
      }));
    } else {
      setEditData((prevData) => ({
        ...prevData,
        ESignUserName: "",
        ESignFirstName: "",
        UserSiganture: "",
      }));
      setSignatureFile(null);
      setSignaturePreview(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  useEffect(() => {
    if (eSignEnabled) {
      setEditData((prevData) => ({
        ...prevData,
        ESignUserName: prevData.UserName || "",
        ESignFirstName: prevData.UserFirstName || "",
      }));
    } else {
      setEditData((prevData) => ({
        ...prevData,
        ESignUserName: "",
        ESignFirstName: "",
      }));
    }
  }, [eSignEnabled, editData?.UserName, editData?.UserFirstName, setEditData]);

  const validateForm = () => {
    let errors = {};

    // Add security validation checks
    if (!validateInput(editData?.UserFirstName)) {
      errors.UserFirstName = "Invalid input detected in first name";
      errorHandler.addSecurityError(editData?.UserFirstName, "UserFirstName");
      setValidationErrors(errors);
      return false;
    }

    if (!validateInput(editData?.UserEmail)) {
      errors.UserEmail = "Invalid input detected in email";
      errorHandler.addSecurityError(editData?.UserEmail, "UserEmail");
      setValidationErrors(errors);
      return false;
    }

    if (!validateInput(editData?.UserAddress)) {
      errors.UserAddress = "Invalid input detected in address";
      errorHandler.addSecurityError(editData?.UserAddress, "UserAddress");
      setValidationErrors(errors);
      return false;
    }

    if (!validateInput(editData?.UserEmployeeNumber)) {
      errors.UserEmployeeNumber = "Invalid input detected in employee number";
      errorHandler.addSecurityError(
        editData?.UserEmployeeNumber,
        "UserEmployeeNumber"
      );
      setValidationErrors(errors);
      return false;
    }

    // Continue with existing validation
    if (!editData?.UserFirstName) {
      errors.UserFirstName = t("errors.UserFirstName");
    }

    if (!editData?.UserEmail) {
      errors.UserEmail = t("errors.UserEmail");
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(editData?.UserEmail)
    ) {
      errors.UserEmail = "Invalid email address";
    }

    if (!editData?.UserAddress) {
      errors.UserAddress = t("errors.UserAddress");
    }

    if (!editData?.UserEmployeeNumber) {
      errors.UserEmployeeNumber = t("errors.UserEmployeeNumber");
    }

    if (!editData?.Gender) {
      errors.Gender = t("errors.Gender");
    }

    if (!editData?.UserType) {
      errors.UserType = "User type is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleUpdateUser();
      onClose();
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setSignaturePreview(base64String);
        setSignatureFile(file);
        setEditData((prevData) => ({
          ...prevData,
          UserSiganture: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveSignature = () => {
    setSignaturePreview(null);
    setSignatureFile(null);
    setEditData((prevData) => ({ ...prevData, UserSiganture: "" }));
  };

  return (
    <Modal open={open}>
      <Box sx={style}>
        {/* Modal Header */}
        <Box
          sx={{
            ...headerStyle,
            background: bgcolor || "linear-gradient(to top, #2C64FF, #4A90E2)",
            margin: "-24px -24px 24px",
            padding: "24px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            borderBottom: "none",
          }}
        >
          <img src={icon} alt="logo" />
          <Box>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              {t("userManagement")}
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff" }}>
              {t("addEditUsers")}
            </Typography>
          </Box>
        </Box>
        <Box sx={contentStyle}>
          <Box>
            <Typography variant="p" style={{ color: "#64748B" }}>
              {t("personalInformationHeading")}
            </Typography>
            <Divider sx={{ margin: "1rem 0rem" }} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mt: 3, mb: 2 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 24,
              }}
            >
              {
                editData?.UserPhoto ? (
                  <img
                    src={`${editData?.UserPhoto}`} // Use the UserPhoto from editData, full URL expected
                    alt="User"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                ) : null // <Typography variant="h4">👤</Typography> // Fallback icon if no photo
              }
            </Box>
            <Button
              variant="contained"
              component="label"
              sx={{ ml: 2 }}
              style={{
                textTransform: "none",
              }} // Use the custom hook for background color
            >
              {t("uploadPhotoButton")}
              <input
                type="file"
                hidden
                onChange={(e) =>
                  handleInputChange({
                    target: {
                      name: "UserPhoto",
                      value: URL.createObjectURL(e.target.files[0]),
                    },
                  })
                } // Update UserPhoto when a new file is uploaded, using ObjectURL for preview
              />
            </Button>
          </Box>

          {/* Input fields */}
          <Grid container spacing={2}>
            {/* First Name */}
            <Grid item xs={4}>
              <label>
                {t("firstNameLabel")} <span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="text"
                name="UserFirstName"
                value={editData?.UserFirstName || ""}
                onChange={handleInputChange}
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "10px 14px",
                  margin: "5px 0",
                  height: "44px",
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                }}
              />
              {validationErrors.UserFirstName && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {validationErrors.UserFirstName}
                </p>
              )}
            </Grid>

            <Grid item xs={4}>
              <label>{t("middleName")}</label>
              <input
                type="text"
                name="UserMiddleName"
                value={editData?.UserMiddleName || ""}
                onChange={handleInputChange}
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "10px 14px",
                  margin: "5px 0",
                  height: "44px",
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                }}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={4}>
              <label>{t("lastName")}</label>
              <input
                type="text"
                name="UserLastName"
                value={editData?.UserLastName || ""}
                onChange={handleInputChange}
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "10px 14px",
                  margin: "5px 0",
                  height: "44px",
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={6}>
              <label>
                {t("Email")} <span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="email"
                name="UserEmail"
                value={editData?.UserEmail || ""}
                onChange={handleInputChange}
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "10px 14px",
                  margin: "5px 0",
                  height: "44px",
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                }}
              />
              {validationErrors.UserEmail && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {validationErrors.UserEmail}
                </p>
              )}
            </Grid>

            {/* Phone Number */}
            <Grid item xs={6}>
              <label>{t("phoneNumber")}</label>
              <input
                type="text"
                name="UserPhoneNumber"
                value={editData?.UserPhoneNumber || ""}
                onChange={handleInputChange}
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "10px 14px",
                  margin: "5px 0",
                  height: "44px",
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                }}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={6}>
              <label>
                {t("locationLabel")} <span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="text"
                name="UserAddress"
                value={editData?.UserAddress || ""}
                onChange={handleInputChange}
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "10px 14px",
                  margin: "5px 0",
                  height: "44px",
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                }}
              />
              {validationErrors.UserAddress && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {validationErrors.UserAddress}
                </p>
              )}
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={6}>
              <label>{t("dob")}</label>
              <input
                type="date"
                name="UserDateOfBirth"
                value={editData?.UserDateOfBirth || ""}
                onChange={handleInputChange}
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "10px 14px",
                  margin: "5px 0",
                  height: "44px",
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                }}
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={6}>
              <label>
                {t("gender")} <span style={{ color: "red" }}> *</span>
              </label>
              <FormControl fullWidth margin="normal">
                <Select
                  name="Gender"
                  value={editData?.Gender || ""}
                  onChange={handleInputChange}
                  style={{
                    fontFamily: "Inter",
                    width: "100%",
                    padding: "10px 14px",
                    margin: "-10px 0 0 0",
                    height: "44px",
                    border: "1px solid #D0D5DD",
                    borderRadius: "8px",
                  }}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
              </FormControl>
              {validationErrors.Gender && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {validationErrors.Gender}
                </p>
              )}
            </Grid>

            {/* Employee Number */}
            <Grid item xs={6}>
              <label>
                {t("employeeNumber")} <span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="text"
                name="UserEmployeeNumber"
                value={editData?.UserEmployeeNumber || ""}
                onChange={handleInputChange}
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "10px 14px",
                  margin: "5px 0",
                  height: "44px",
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                }}
              />
              {validationErrors.UserEmployeeNumber && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {validationErrors.UserEmployeeNumber}
                </p>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <label>
                {t("userType")}
                <span style={{ color: "red" }}> *</span>
              </label>
              <select
                name="UserType"
                value={editData?.UserType || ""} // Use the UserType from editData
                onChange={handleInputChange}
                className="form-select"
                style={{ fontFamily: "Inter" }}
              >
                <option value="" disabled>
                  Select User Type
                </option>
                <option value="Admin">Admin</option>
                <option value="ProcessOwner">Process Owner</option>
                <option value="EndUser">End User</option>
                <option value="Auditor">Auditor</option>
              </select>
              {validationErrors.UserType && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {validationErrors.UserType}
                </p>
              )}

              {editData?.UserType === "ProcessOwner" && (
                <Switch
                  checked={editData?.IsContentAndmin}
                  label={"Content Admin"}
                  onChange={() =>
                    setEditData({
                      ...editData,
                      IsContentAndmin: !editData.IsContentAndmin,
                    })
                  }
                  color="primary"
                />
              )}
            </Grid>

            <Grid item xs={6}>
              <label>
                {t("userName")}
                <span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="text"
                name="UserName"
                value={`${editData?.UserName}`} // Combine First Name and Last Name for UserName
                readOnly
                placeholder="Enter User Name"
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "10px 14px", // Updated padding
                  margin: "5px 0 -10px 0",
                  height: "44px", // Hug height (44px)
                  border: "1px solid #D0D5DD", // Border color
                  borderRadius: "8px", // Border radius
                }}
              />
            </Grid>
          </Grid>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 3, mb: 2 }}
          >
            <Box display="flex" alignItems="center">
              <Switch
                checked={editData?.IsActive}
                onChange={handleChange}
                name="sopStatus"
              />
              <div>
                <Typography variant="body1" style={{ fontWeight: "500" }}>
                  User Status
                </Typography>
                <Typography variant="body2">{t("changeStatus")}</Typography>
              </div>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  bgcolor: editData?.IsActive ? "#F0FDF4" : "#FEF2F2",
                  color: editData?.IsActive ? "#15803D" : "#B91C1C",
                  padding: "4px 12px",
                  borderRadius: "16px",
                }}
              >
                {editData?.IsActive ? t("active") : t("inactive")}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: "flex" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={eSignEnabled}
                    onChange={handleESignToggle}
                    color="primary"
                  />
                }
              />
              <Typography
                variant="b"
                sx={{ marginTop: "11px", marginLeft: "-13px" }}
              >
                {t("enableESignature")}
              </Typography>
            </Box>
            <Divider sx={{ margin: "1rem 0rem" }} />
          </Box>
          {eSignEnabled && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <label>
                    {t("eSignUserName")}{" "}
                    <span style={{ color: "red" }}> *</span>
                  </label>
                  <input
                    type="text"
                    name="ESignUserName"
                    value={editData?.ESignUserName || ""}
                    readOnly
                    placeholder="E-Sign User Name"
                    style={{
                      fontFamily: "Inter",
                      width: "100%",
                      padding: "8px",
                      margin: "5px 0 -10px 0",
                      border: "1px solid #D0D5DD",
                      borderRadius: "8px",
                      backgroundColor: "#f5f5f5",
                      cursor: "not-allowed",
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <label>
                    {t("eSignFirstName")}{" "}
                    <span style={{ color: "red" }}> *</span>
                  </label>
                  <input
                    type="text"
                    name="ESignFirstName"
                    value={editData?.ESignFirstName || ""}
                    readOnly
                    placeholder="E-Sign First Name"
                    style={{
                      fontFamily: "Inter",
                      width: "100%",
                      padding: "8px",
                      margin: "5px 0 -10px 0",
                      border: "1px solid #D0D5DD",
                      borderRadius: "8px",
                      backgroundColor: "#f5f5f5",
                      cursor: "not-allowed",
                    }}
                  />
                </Grid>

                <Grid item xs={6} mt={2}>
                  <label>
                    {t("uploadSignature")}
                    <span style={{ color: "red" }}> *</span>
                  </label>
                  <br />
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ mt: 1 }}
                    style={{
                      backgroundColor: "#3B82F6",
                      color: "#fff",
                      textTransform: "none",
                      borderRadius: "8px",
                    }}
                  >
                    {t("uploadSignature")}
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      hidden
                      onChange={handleSignatureUpload} // use the new handler
                    />
                  </Button>
                </Grid>
                {signaturePreview && (
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        mt: 2,
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      <img
                        src={signaturePreview}
                        alt="Signature Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          border: "1px solid #D0D5DD",
                          borderRadius: "8px",
                        }}
                      />
                      <Button
                        onClick={handleRemoveSignature}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          minWidth: "auto",
                          padding: "4px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.7)",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </Box>

        <Box>
          <Grid container spacing={2} style={{ marginTop: "20px" }}>
            <Grid item xs={6}>
              <Button variant="outlined" onClick={onClose} fullWidth>
                {t("cancel")}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                fullWidth
                style={{
                  textTransform: "none",
                  color: "#fff",
                  borderRadius: "8px",
                }}
              >
                {t("Update")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditUserDialog;

EditUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
  setEditData: PropTypes.func.isRequired,
  handleUpdateUser: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};
// EditUserDialog.jsx
