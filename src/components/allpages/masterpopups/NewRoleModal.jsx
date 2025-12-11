import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Switch,
  Typography,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import icon from "../../../assets/svg/MasterPopup/headingaddicon.svg";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  AddRole,
  Getentrprise,
  updateRole,
} from "../../../store/enterprise/action";
import { validateAndSanitizeInputs } from "../../../utils";
import notify from "../../../assets/svg/utils/toast/Toast";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";
import { validateInput } from "../../../utils/securityUtils";
import errorHandler from "../../../utils/errorHandler";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 700,
  // height: "95vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "24px",
  borderRadius: "12px",
  outline: "none",
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

const NewRoleModal = ({ open, onClose, editdata }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main;

  // const { enterpriselist } = useSelector((state) => state.enterprise);
  const [formState, setFormState] = useState({
    OrganizationStructureID: "",
    RoleName: "",
    RoleDescription: "",
    IsActive: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(Getentrprise({ ParentID: null }));
  }, [dispatch]);

  useEffect(() => {
    if (editdata) {
      setFormState({ ...editdata });
    } else {
      setFormState({
        // OrganizationStructureID: "",
        RoleName: "",
        RoleDescription: "",
        IsActive: true,
      });
    }
    setErrors({});
  }, [editdata]);

  const validateForm = () => {
    const newErrors = {};
    const regex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces

    // Add security validation checks
    if (!validateInput(formState.RoleName)) {
      newErrors.RoleName = "Invalid input detected in role name";
      errorHandler.addSecurityError(formState.RoleName, "RoleName");
      setErrors(newErrors);
      return false;
    }

    if (!validateInput(formState.RoleDescription)) {
      newErrors.RoleDescription = "Invalid input detected in description";
      errorHandler.addSecurityError(
        formState.RoleDescription,
        "RoleDescription"
      );
      setErrors(newErrors);
      return false;
    }

    // Continue with existing validation
    if (!formState.RoleName.trim()) {
      newErrors.RoleName = t("errors.role_name_required");
    } else if (!regex.test(formState.RoleName)) {
      newErrors.RoleName = t("errors.role_name_invalid");
    }

    if (!formState.RoleDescription.trim()) {
      newErrors.RoleDescription = t(
        "errors.organization_structure_description_required"
      );
    } else if (!regex.test(formState.RoleDescription)) {
      newErrors.RoleDescription = t(
        "errors.organization_structure_description_required"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const inputs = [formState.RoleName, formState.RoleDescription];
      if (validateAndSanitizeInputs(inputs)) {
        if (editdata !== null && editdata !== undefined) {
          const payload = {
            RoleID: editdata?.RoleID,
            RoleName: formState?.RoleName,
            RoleDescription: formState?.RoleDescription,
            IsActive: formState?.IsActive,
          };
          const res = await dispatch(updateRole(payload));
          if (res?.payload) {
            handleClose();
          }
        } else {
          const payload = {
            RoleName: formState?.RoleName,
            RoleDescription: formState?.RoleDescription,
            IsActive: formState?.IsActive,
          };
          const res = await dispatch(AddRole(payload));
          if (res?.payload) {
            handleClose();
          }
        }
      } else {
        notify("error", "Suspicious input detected!");
      }
    }
  };

  const resetForm = () => {
    setFormState({
      OrganizationStructureID: "",
      RoleName: "",
      RoleDescription: "",
      IsActive: true,
    });
    setErrors({});
  };

  // Modify the onClose handler to include reset
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  // const handleClose = () => onClose(false);

  return (
    <div>
      <Modal open={open}>
        <Box sx={style}>
          <Box display="flex" flexDirection="column" gap="24px">
            <Box
              display="flex"
              alignItems="center"
              gap="16px"
              sx={{
                background:
                  bgcolor || "linear-gradient(to top, #2C64FF, #4A90E2)",
                margin: "-24px -24px 0",
                padding: "24px",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                position: "relative", // Added for positioning
                pr: 8, // Add padding to prevent overlap
              }}
            >
              <img src={icon} alt="Role Icon" />
              <Box flexGrow={1}>
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  {t("role_management")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#fff", textTransform: "none" }}
                >
                  {t("role_list_description")}
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
            <Box>
              <Typography sx={labelStyle}>
                {t("role_name")} <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                type="text"
                placeholder={t("role_name_placeholder")}
                style={inputStyle}
                name="RoleName"
                onChange={onChange}
                value={formState.RoleName}
                error={!!errors.RoleName}
                helperText={errors.RoleName}
              />
            </Box>
            <Box>
              <Typography sx={labelStyle}>
                {t("role_description")}
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                multiline
                rows={4}
                name="RoleDescription"
                placeholder={t("role_description_placeholder")}
                variant="outlined"
                fullWidth
                onChange={onChange}
                value={formState.RoleDescription}
                error={!!errors.RoleDescription}
                helperText={errors.RoleDescription}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap="16px"
            >
              <Box display="flex" alignItems="center" gap="16px">
                <Switch
                  checked={formState.IsActive}
                  onChange={() =>
                    setFormState((prevState) => ({
                      ...prevState,
                      IsActive: !prevState.IsActive,
                    }))
                  }
                />
                <div>
                  <Typography variant="body1">{t("role_status")}</Typography>
                  <Typography variant="body2">
                    {t("role_status_description")}
                  </Typography>
                </div>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  color={formState.IsActive ? "#15803D" : "#B91C1C"}
                  sx={{
                    bgcolor: formState.IsActive ? "#F0FDF4" : "#FEF2F2",
                    padding: "4px 12px",
                    borderRadius: "16px",
                  }}
                >
                  {formState.IsActive ? t("active") : t("inactive")}
                </Typography>
              </Box>
            </Box>
            <Divider />

            <Box mt={3}>
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
                    }}
                    onClick={handleSubmit}
                  >
                    {t("save")}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default NewRoleModal;

NewRoleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editdata: PropTypes.object,
};
NewRoleModal.defaultProps = {
  editdata: null,
};
