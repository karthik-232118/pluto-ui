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
import {
  AddDipartment,
  EditAddDepartment,
  Getentrprise,
} from "../../../store/enterprise/action";
import { useDispatch } from "react-redux";
import notify from "../../../assets/svg/utils/toast/Toast";
import { validateAndSanitizeInputs } from "../../../utils";
import { validateInput } from "../../../utils/securityUtils";
import errorHandler from "../../../utils/errorHandler";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 700,
  overflowY: "none",
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

const NewDepartment = ({ open, onClose, editdata }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main;

  const [formState, setFormState] = useState({
    DepartmentName: "",
    DepartmentDescription: "",
    IsActive: true,
    // OrganizationStructureID: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const payload = {
      ParentID: null,
    };
    dispatch(Getentrprise(payload));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const regex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces

    // Add security validation checks
    if (!validateInput(formState.DepartmentName)) {
      newErrors.DepartmentName = "Invalid input detected in department name";
      errorHandler.addSecurityError(formState.DepartmentName, "DepartmentName");
      setErrors(newErrors);
      return false;
    }

    if (!validateInput(formState.DepartmentDescription)) {
      newErrors.DepartmentDescription = "Invalid input detected in description";
      errorHandler.addSecurityError(
        formState.DepartmentDescription,
        "DepartmentDescription"
      );
      setErrors(newErrors);
      return false;
    }

    // Continue with existing validation
    if (!formState.DepartmentName.trim()) {
      newErrors.DepartmentName = t("errors.department_name_required");
    } else if (!regex.test(formState.DepartmentName)) {
      newErrors.DepartmentName = t("errorsdepartment_name_invalid");
    }
    if (!formState.DepartmentDescription.trim()) {
      newErrors.DepartmentDescription = t(
        "errors.organization_structure_description_required"
      );
    } else if (!regex.test(formState.DepartmentDescription)) {
      newErrors.DepartmentDescription = t(
        "errors.organization_structure_description_required"
      );
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const inputs = [
        formState.DepartmentName,
        formState.DepartmentDescription,
      ];
      if (validateAndSanitizeInputs(inputs)) {
        if (editdata !== null && editdata !== undefined) {
          const payload = {
            DepartmentID: editdata?.DepartmentID,
            DepartmentName: formState?.DepartmentName,
            DepartmentDescription: formState?.DepartmentDescription,
            IsActive: formState?.IsActive,
          };
          // dispatch(EditAddDepartment(payload));
          const res = await dispatch(EditAddDepartment(payload));
          if (res?.payload) {
            handleClose();
            setErrors({});
          }
        } else {
          const res = await dispatch(AddDipartment(formState));

          if (res?.payload) {
            handleClose();
            setErrors({});
          }
          dispatch(formState);
          handleClose();
        }
      }
    } else {
      notify("error", "Suspicious input detected!");
    }
  };

  const resetForm = () => {
    setFormState({
      DepartmentName: "",
      DepartmentDescription: "",
      IsActive: true,
    });

    setErrors({});
  };

  // Modify the onClose handler to include reset
  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (editdata) {
      setFormState({ ...editdata });
    } else {
      setFormState({
        DepartmentName: "",
        DepartmentDescription: "",
        IsActive: true,
        // OrganizationStructureID: "",
      });
    }
    setErrors({});
  }, [editdata]);

  useEffect(() => {
    const payload = {
      ParentID: null,
    };
    dispatch(Getentrprise(payload));
  }, [dispatch]);

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
              <img src={icon} alt="logo" />
              <Box flexGrow={1}>
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  {t("department_management")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#fff", textTransform: "none" }}
                >
                  {t("department_management_description")}
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
                {t("department_name")} <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                type="text"
                name="DepartmentName"
                placeholder={t("department_name_placeholder")}
                style={inputStyle}
                value={formState.DepartmentName}
                onChange={onChange}
                error={!!errors.DepartmentName}
                helperText={errors.DepartmentName}
                defaultValue={formState.DepartmentName}
              />
            </Box>

            <Box>
              <Typography sx={labelStyle}>
                {t("department_description")}
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                multiline
                rows={4}
                name="DepartmentDescription"
                placeholder={t("department_description_placeholder")}
                variant="outlined"
                fullWidth
                onChange={onChange}
                value={formState.DepartmentDescription}
                error={!!errors.DepartmentDescription}
                helperText={errors.DepartmentDescription}
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
                    setFormState({
                      ...formState,
                      IsActive: !formState.IsActive,
                    })
                  }
                />
                <div>
                  <Typography variant="b">{t("department_status")}</Typography>
                  <Typography variant="body2">
                    {t("department_status_description")}
                  </Typography>
                </div>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  color={formState?.IsActive ? "#15803D" : "#B91C1C"}
                  sx={{
                    bgcolor: formState?.IsActive ? "#F0FDF4" : "#FEF2F2",
                    padding: "4px 12px",
                    borderRadius: "16px",
                  }}
                >
                  {formState?.IsActive ? t("active") : t("inactive")}
                </Typography>
              </Box>
            </Box>
            <Divider />

            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      setErrors({});
                      handleClose();
                    }}
                  >
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

export default NewDepartment;

NewDepartment.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editdata: PropTypes.object,
};
NewDepartment.defaultProps = {
  editdata: null,
};
