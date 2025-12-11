import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Divider,
  Switch,
  Modal,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { GetAllUserApi } from "../../../store/usermanagement/action";
import icon from "../../../assets/svg/sopsModal/modalIcon.svg";
import {
  GetDepartment,
  GetRoleList,
  GetZone,
  Getentrprise,
} from "../../../store/enterprise/action";
import "./NewUserForm.css";
import { validateAndSanitizeInputs } from "../../../utils";
import { validateInput } from "../../../utils/securityUtils";
import errorHandler from "../../../utils/errorHandler";
import notify from "../../../assets/svg/utils/toast/Toast";
import { AddUserApi } from "../../../services/usermanagement/UserManagement";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { listProcessOwner } from "../../../services/sopModules/SopModule";
import PropTypes from "prop-types";
import i18next from "i18next";
import { useTheme } from "@mui/styles";

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
  maxHeight: "90vh",
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
  maxHeight: "60vh",
  paddingBottom: "24px",
  marginTop: "16px",
  marginBottom: "16px",
};

const footerStyle = {
  marginTop: "24px",
};

const NewUserForm = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    UserName: "",
    Password: "",
    UserFirstName: "",
    UserMiddleName: "",
    UserLastName: "",
    UserEmail: "",
    UserPhoneNumber: "",
    UserAddress: "",
    UserDateOfBirth: "",
    Gender: "",
    UserType: "",
    UserEmployeeNumber: "",
    OrganizationStructureID: "",
    RoleID: "",
    DepartmentID: "",
    IsActive: true,
    UserSiganture: "",
  });
  const [roles, setRoles] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [department, setDepartment] = useState([]);
  const [zone, setZone] = useState([]);
  const [unit, setUnit] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedZoneID, setSelectedZoneID] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [eSignEnabled, setESignEnabled] = useState(false);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [SOPState] = useState("SOP"); // Default state is SOP
  const [riskOwnersList, setRiskOwnersList] = useState([]);
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main;
  if (signatureFile) {
    // console.log("File Name:", signatureFile.name);
    // console.log("File Size:", signatureFile.size);
    // console.log("File Type:", signatureFile.type);
  }

  const resetForm = () => {
    setUserData({
      UserName: "",
      Password: "",
      UserFirstName: "",
      UserMiddleName: "",
      UserLastName: "",
      UserEmail: "",
      UserPhoneNumber: "",
      UserAddress: "",
      UserDateOfBirth: "",
      Gender: "",
      UserType: "",
      UserEmployeeNumber: "",
      OrganizationStructureID: "",
      RoleID: "",
      DepartmentID: "",
      IsActive: true,
      UserSiganture: "",
    });
    setSelectedValue("");
    setSelectedZoneID("");
    setPasswordVisible(false);
    setPasswordStrength("");
    setESignEnabled(false);
    setSignaturePreview(null);
    setSignatureFile(null);
    setErrors({});
  };
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    const fetchProcessOwners = async () => {
      try {
        const response = await listProcessOwner({});
        setRiskOwnersList(response?.data?.data?.userList || []);
      } catch (error) {
        console.error("Error fetching process owners:", error);
      }
    };

    fetchProcessOwners();
  }, []);

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
  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, Password: value });

    const strength = checkPasswordStrength(value);
    setPasswordStrength(strength);
  };

  const [isUserSaving, setIsUserSaving] = useState(false);

  useEffect(() => {
    if (eSignEnabled) {
      setUserData((prevData) => ({
        ...prevData,
        ESignUserName: prevData.UserName,
        ESignFirstName: prevData.UserFirstName,
      }));
    }
  }, [userData.UserName, userData.UserFirstName, eSignEnabled]);

  useEffect(() => {
    dispatch(GetRoleList())
      .unwrap()
      .then((fetchedRoles) => {
        setRoles(fetchedRoles);
      })
      .catch((err) => {
        console.error("Failed to fetch roles:", err);
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetDepartment())
      .unwrap()
      .then((fetchedDepartment) => {
        setDepartment(fetchedDepartment?.Departments || []);
      })
      .catch((err) => {
        console.error("Failed to fetch departments:", err);
      });
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (signaturePreview) {
        URL.revokeObjectURL(signaturePreview);
      }
    };
  }, [signaturePreview]);

  useEffect(() => {
    dispatch(GetZone())
      .unwrap()
      .then((fetchedZone) => {
        setZone(fetchedZone || []);
      })
      .catch((err) => {
        console.error("Failed to fetch getZoneApi:", err);
      });
  }, [dispatch]);

  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSignatureFile(file);
      setSignaturePreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setUserData((prevData) => ({
          ...prevData,
          UserSiganture: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectZone = (event) => {
    const selectedZoneID = event.target.value;
    setSelectedZoneID(selectedZoneID);

    if (selectedZoneID) {
      const requestBody = {
        ParentID: selectedZoneID,
      };

      dispatch(Getentrprise(requestBody))
        .unwrap()
        .then((fetchedentrprise) => {
          setUnit(fetchedentrprise || []);
        })
        .catch((err) => {
          console.error("Failed to fetch Getentrprise:", err);
        });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    setUserData({ ...userData, OrganizationStructureID: value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!validateInput(userData.UserName)) {
      formErrors.UserName = "Invalid input detected in username";
      errorHandler.addSecurityError(userData.UserName, "UserName");
      setErrors(formErrors);
      return false;
    }

    if (!validateInput(userData.UserFirstName)) {
      formErrors.UserFirstName = "Invalid input detected in first name";
      errorHandler.addSecurityError(userData.UserFirstName, "UserFirstName");
      setErrors(formErrors);
      return false;
    }

    if (!validateInput(userData.UserEmail)) {
      formErrors.UserEmail = "Invalid input detected in email";
      errorHandler.addSecurityError(userData.UserEmail, "UserEmail");
      setErrors(formErrors);
      return false;
    }

    if (!validateInput(userData.UserEmployeeNumber)) {
      formErrors.UserEmployeeNumber =
        "Invalid input detected in employee number";
      errorHandler.addSecurityError(
        userData.UserEmployeeNumber,
        "UserEmployeeNumber"
      );
      setErrors(formErrors);
      return false;
    }

    if (!userData.UserName.trim()) formErrors.UserName = t("errors.UserName");
    if (!userData.UserFirstName.trim())
      formErrors.UserFirstName = t("errors.UserFirstName");
    if (!userData.UserEmail.trim())
      formErrors.UserEmail = t("errors.UserEmail");
    if (!userData.UserAddress.trim())
      formErrors.UserAddress = t("errors.UserAddress");
    if (!userData.Gender.trim()) formErrors.Gender = t("errors.Gender");
    if (!userData.Password.trim()) formErrors.Password = t("errors.Password");
    if (!userData.UserEmployeeNumber.trim())
      formErrors.UserEmployeeNumber = t("errors.UserEmployeeNumber");
    if (!selectedZoneID) formErrors.ZoneID = t("errors.ZoneID");
    if (!selectedValue) formErrors.UnitID = t("errors.UnitID");
    if (!userData.RoleID) formErrors.RoleID = t("errors.RoleID");
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUserSaving(true); 
    const isValid = validateAndSanitizeInputs([
      userData.UserName,
      userData.UserFirstName,
      userData.UserEmail,
      userData.UserPhoneNumber,
      userData.UserAddress,
      eSignEnabled && userData.ESignUserName,
      eSignEnabled && userData.ESignFirstName,
    ]);

    if (validateForm()) {
      if (isValid) {
        try {
          const payload = {
            ...userData,
            SOPState,
            ...(eSignEnabled && userData.SignaturePath
              ? { UserSiganture: userData.SignaturePath }
              : {}),
            UserSupervisorID: userData.ProcessOwner,
          };
          const response = await AddUserApi(payload);

          if (response?.status === 200) {
            notify("success", i18next.t("user_added"));
            onClose();
            dispatch(GetAllUserApi());
          } else {
            notify(
              "error",
              response?.data?.message ||
                response?.data?.error ||
                "Failed to add user"
            );
          }
        } catch (error) {
          notify(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.error ||
              "Failed to add user"
          );
        } finally {
          setIsUserSaving(false);
        }
      } else {
        setIsUserSaving(false);
      }
    } else {
      setIsUserSaving(false);
    }
  };

  const handleESignToggle = (event) => {
    setESignEnabled(event.target.checked);
    if (!event.target.checked) {
      setUserData((prevData) => ({
        ...prevData,
        ESignUserName: "",
        ESignFirstName: "",
      }));

      setSignaturePreview(null);
    }
  };
  const handleRemoveSignature = () => {
    setSignaturePreview(null);
  };

  const handleSelectProcessOwneChange = (event) => {
    const selectedUserID = event.target.value;
    setUserData({
      ...userData,
      ProcessOwner: selectedUserID, 
    });
  };

  return (
    <Modal open={open}>
      <Box sx={style}>
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
          <Button
            onClick={onClose}
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
        {/* <Divider sx={{ margin: "1rem 0rem" }} /> */}
        <Box sx={contentStyle}>
          <Box>
            <Typography variant="p" style={{ color: "#64748B" }}>
              {t("personalInfo")}
            </Typography>
            <Divider sx={{ margin: "1rem 0rem" }} />
          </Box>

          {/* Personal Information */}

          <Grid container spacing={2}>
            {/* First Name */}
            <Grid item xs={4}>
              <label>
                {t("firstName")}
                <span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="text"
                name="UserFirstName"
                value={userData.UserFirstName}
                onChange={handleChange}
                placeholder={t("enterFirstName")}
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
              {errors.UserFirstName && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.UserFirstName}
                </p>
              )}
            </Grid>

            {/* Middle Name */}
            <Grid item xs={4}>
              <label>{t("middleName")}</label>
              <input
                type="text"
                name="UserMiddleName"
                value={userData.UserMiddleName}
                onChange={handleChange}
                placeholder={t("enterMiddleName")}
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
                value={userData.UserLastName}
                onChange={handleChange}
                placeholder={t("enterLastName")}
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
          </Grid>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={6}>
              <label>
                {t("userName")}
                <span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="text"
                name="UserName"
                value={userData.UserName}
                onChange={handleChange}
                placeholder={t("enterUserName")}
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
              {errors.UserName && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.UserName}
                </p>
              )}
            </Grid>

            <Grid item xs={6}>
              <label>
                {t("emailAddress")} <span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="email"
                name="UserEmail"
                value={userData.UserEmail}
                onChange={handleChange}
                placeholder={t("enterEmail")}
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "8px",
                  margin: "5px 0 -10px 0",
                }}
              />
              {errors.UserEmail && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.UserEmail}
                </p>
              )}
            </Grid>
            <Grid item xs={6}>
              <label>{t("phoneNumber")}</label>
              <input
                type="text"
                name="UserPhoneNumber"
                value={userData.UserPhoneNumber}
                onChange={handleChange}
                placeholder={t("enterPhoneNumber")}
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "8px",
                  margin: "5px 0 -10px 0",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <label>
                {t("location")} <span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="text"
                name="UserAddress"
                value={userData.UserAddress}
                onChange={handleChange}
                placeholder={t("enterLocation")}
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "8px",
                  margin: "5px 0 -10px 0",
                }}
              />
              {errors.UserAddress && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.UserAddress}
                </p>
              )}
            </Grid>
            <Grid item xs={6}>
              <label>
                {t("gender")} <span style={{ color: "red" }}> *</span>
              </label>
              <select
                name="Gender"
                value={userData.Gender}
                onChange={handleChange}
                className="form-select"
                style={{ fontFamily: "Inter" }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              {errors.Gender && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.Gender}
                </p>
              )}
            </Grid>

            <Grid item xs={6}>
              <label>{t("dob")}</label>
              <input
                type="date"
                name="UserDateOfBirth"
                value={userData.UserDateOfBirth}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  margin: "5px 0",
                  fontFamily: "Inter",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <label>
                {t("password")} <span style={{ color: "red" }}> *</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="Password"
                  value={userData.Password}
                  onChange={handlePasswordChange}
                  placeholder={t("enterPassword")}
                  style={{
                    fontFamily: "Inter",
                    width: "100%",
                    padding: "8px",
                    margin: "5px 0 -10px 0",
                  }}
                />
                <span
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "70%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {passwordVisible ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              <Typography
                variant="body2"
                style={{
                  marginTop: "1rem",
                  color:
                    passwordStrength === t("strong")
                      ? "green"
                      : passwordStrength === t("weak")
                      ? "red"
                      : "orange",
                }}
              >
                {passwordStrength}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <label>{t("supervisor")}</label>
              <select
                name="ProcessOwner"
                value={userData.ProcessOwner}
                onChange={handleSelectProcessOwneChange}
                className="form-select"
                style={{ fontFamily: "Inter" }}
              >
                <option value="">{t("selectProcessOwner")}</option>
                {/* Mapping through the riskOwnersList to display UserName */}
                {riskOwnersList.map((owner) => (
                  <option key={owner.UserID} value={owner.UserID}>
                    {owner.UserName}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>

          {/* Additional Information */}
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
            {t("additionalInfo")}
          </Typography>

          <Divider sx={{ margin: "1rem 0rem" }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <label>
                {t("employeeNumber")} <span style={{ color: "red" }}> *</span>
              </label>
              <input
                type="text"
                name="UserEmployeeNumber"
                value={userData.UserEmployeeNumber}
                onChange={handleChange}
                placeholder={t("enterEmployeeNumber")}
                style={{
                  fontFamily: "Inter",
                  width: "100%",
                  padding: "8px",
                  margin: "5px 0 -10px 0",
                }}
              />
              {errors.UserEmployeeNumber && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.UserEmployeeNumber}
                </p>
              )}
            </Grid>

            <Grid item xs={6}>
              <label>{t("userType")}</label>
              <select
                name="UserType"
                value={userData.UserType}
                onChange={handleChange}
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
              {userData.UserType === "ProcessOwner" && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={userData.IsContentAndmin}
                      onChange={() =>
                        setUserData({
                          ...userData,
                          IsContentAndmin: !userData.IsContentAndmin,
                        })
                      }
                      color="primary"
                    />
                  }
                  label="Content Admin"
                />
              )}
            </Grid>

            <Grid item xs={6}>
              <label>
                {t("organizationZone")} <span style={{ color: "red" }}> *</span>
              </label>
              <select
                value={selectedZoneID}
                onChange={handleSelectZone}
                className="form-select"
                style={{ fontFamily: "Inter" }}
              >
                <option value="" disabled>
                  Select Zone
                </option>

                {zone.map((item) => (
                  <option
                    key={item.OrganizationStructureID}
                    value={item.OrganizationStructureID}
                  >
                    {item.OrganizationStructureName}
                  </option>
                ))}
              </select>

              {errors.ZoneID && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.ZoneID}
                </p>
              )}
            </Grid>
            <Grid item xs={6}>
              <label>
                {t("organizationUnit")} <span style={{ color: "red" }}> *</span>
              </label>
              <select
                value={selectedValue}
                onChange={handleSelectChange}
                className="form-select"
                style={{ fontFamily: "Inter" }}
              >
                <option value="" disabled>
                  Select Unit
                </option>
                {unit.map((item) => (
                  <option
                    key={item.OrganizationStructureID}
                    value={item.OrganizationStructureID}
                  >
                    {item.OrganizationStructureName}
                  </option>
                ))}
              </select>
              {errors.UnitID && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.UnitID}
                </p>
              )}
            </Grid>
            <Grid item xs={6}>
              <label>
                {t("role")} <span style={{ color: "red" }}> *</span>
              </label>
              <select
                name="RoleID"
                value={userData.RoleID}
                onChange={handleChange}
                className="form-select"
                style={{ fontFamily: "Inter" }}
              >
                <option value="">Select Role</option>
                {roles?.map((role) => (
                  <option key={role?.RoleID} value={role?.RoleID}>
                    {role?.RoleName}
                  </option>
                ))}
              </select>
              {errors.RoleID && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.RoleID}
                </p>
              )}
            </Grid>

            <Grid item xs={6}>
              <label>
                {t("departmentName")} <span style={{ color: "red" }}> *</span>
              </label>
              <select
                name="DepartmentID"
                value={userData.DepartmentID}
                onChange={handleChange}
                className="form-select"
                style={{ fontFamily: "Inter" }}
              >
                <option value="">Select Department</option>
                {department?.map((dept) => (
                  <option key={dept.DepartmentID} value={dept.DepartmentID}>
                    {dept.DepartmentName}
                  </option>
                ))}
              </select>
            </Grid>

            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 3, mb: 2 }}
              >
                <Box display="flex" alignItems="center">
                  <Switch
                    checked={userData.IsActive}
                    onChange={() =>
                      setUserData({ ...userData, IsActive: !userData.IsActive })
                    }
                  />
                  <div>
                    <Typography variant="body1" style={{ fontWeight: "500" }}>
                      {t("isActive")}
                    </Typography>
                    <Typography variant="body2">{t("changeStatus")}</Typography>
                  </div>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color={userData.IsActive ? "#15803D" : "#B91C1C"}
                    sx={{
                      bgcolor: userData.IsActive ? "#F0FDF4" : "#FEF2F2",
                      padding: "4px 12px",
                      borderRadius: "16px",
                    }}
                  >
                    {userData.IsActive ? t("active") : t("inactive")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* E-sing */}
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

          {/* Conditionally Render E-Signature Fields */}
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
                    value={userData.ESignUserName}
                    readOnly
                    placeholder={t("enterESignUserName")}
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

                  {errors.ESignUserName && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      {errors.ESignUserName}
                    </p>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <label>
                    {t("eSignFirstName")}{" "}
                    <span style={{ color: "red" }}> *</span>
                  </label>
                  <input
                    type="text"
                    name="ESignFirstName"
                    value={userData.ESignFirstName}
                    readOnly
                    placeholder={t("enterESignFirstName")}
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

                  {errors.ESignFirstName && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      {errors.ESignFirstName}
                    </p>
                  )}
                </Grid>

                <Grid item xs={6} mt={2}>
                  <label>
                    {t("uploadSignature")}{" "}
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
                      onChange={handleSignatureChange} // Attach the handler here
                    />
                  </Button>
                </Grid>

                {/* Display Uploaded Signature */}
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

          {/* Buttons */}
        </Box>
        <Box sx={footerStyle}>
          <Grid container spacing={2} style={{ marginTop: "20px" }}>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                disabled={isUserSaving}
                onClick={onClose}
                fullWidth
                // style={{
                //   textTransform: "none",
                //   color: "#000",
                //   borderRadius: "8px",
                //   borderColor: "#D0D5DD",
                // }}
              >
                {t("cancel")}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                // disabled={isUserSaving}
                onClick={handleSubmit}
                disabled={passwordStrength !== "Strong"}
                fullWidth // Makes the button take the full width of the grid column
                style={{
                  textTransform: "none",
                  // color: "#3D54CD",
                  color: "#fff",
                  borderRadius: "8px",
                }} // Prevents the button text from transforming to uppercase
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

export default NewUserForm;

NewUserForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  eSignEnabled: PropTypes.bool,
};
