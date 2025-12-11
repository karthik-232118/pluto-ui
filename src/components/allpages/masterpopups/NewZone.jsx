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
import {
  AddZone,
  EditZone,
  Getentrprise,
} from "../../../store/enterprise/action";
import { validateAndSanitizeInputs } from "../../../utils";
import notify from "../../../assets/svg/utils/toast/Toast";
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
  width: "90%",
  maxWidth: 700,
  height: "auto", // Fixed height
  overflowY: "none", // Handle overflow
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "24px",
  borderRadius: "12px",
  outline: "none",
};

const inputStyle = {
  width: "100%",
  // padding: "10px 12px",
  borderRadius: "8px",
  // border: "1px solid #E2E8F0",
  fontSize: "16px",
  boxSizing: "border-box",
};

const labelStyle = {
  marginBottom: "8px",
  fontWeight: "bold",
};

const NewZone = ({ open, onClose, editdata }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main;

  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    OrganizationStructureName: "",
    OrganizationStructureDescription: "",
    IsActive: true,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Add security validation checks
    if (!validateInput(formState.OrganizationStructureName)) {
      newErrors.OrganizationStructureName =
        "Invalid input detected in zone name";
      errorHandler.addSecurityError(
        formState.OrganizationStructureName,
        "OrganizationStructureName"
      );
      setErrors(newErrors);
      return false;
    }

    if (!validateInput(formState.OrganizationStructureDescription)) {
      newErrors.OrganizationStructureDescription =
        "Invalid input detected in description";
      errorHandler.addSecurityError(
        formState.OrganizationStructureDescription,
        "OrganizationStructureDescription"
      );
      setErrors(newErrors);
      return false;
    }

    // Continue with existing validation
    const regex = /^[a-zA-Z\s]*$/;
    if (!formState.OrganizationStructureName.trim()) {
      newErrors.OrganizationStructureName = t("errors.zone_name_required");
    } else if (!regex.test(formState.OrganizationStructureName)) {
      newErrors.OrganizationStructureName = t("errors.zone_name_invalid");
    }

    if (!formState.OrganizationStructureDescription.trim()) {
      newErrors.OrganizationStructureDescription = t(
        "errors.organization_structure_description_required"
      );
    } else if (!regex.test(formState.OrganizationStructureDescription)) {
      newErrors.OrganizationStructureDescription = t(
        "errors.organization_structure_description_required"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const inputs = [
        formState.OrganizationStructureName,
        formState.OrganizationStructureDescription,
      ];
      if (validateAndSanitizeInputs(inputs)) {
        if (editdata !== null && editdata !== undefined) {
          const payload = {
            OrganizationStructureID: editdata?.OrganizationStructureID,
            OrganizationStructureDescription:
              formState?.OrganizationStructureDescription,
            OrganizationStructureName: formState?.OrganizationStructureName,
            OrganizationStructureAdditionalInfo:
              "OrganizationStructureAdditionalInfo",
            IsActive: formState?.IsActive,
          };
          const res = await dispatch(EditZone(payload));
          if (res?.payload) {
            handleClose();
          }
        } else {
          const payload = {
            ...formState,
          };
          const res = await dispatch(AddZone(payload));
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
      OrganizationStructureName: "",
      OrganizationStructureDescription: "",
      IsActive: true,
    });

    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
  useEffect(() => {
    if (editdata) {
      setFormState({ ...editdata });
    } else {
      setFormState({
        OrganizationStructureName: "",
        OrganizationStructureDescription: "",
        IsActive: true,
      });
    }
    setErrors({});
  }, [editdata]);

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
                  {t("zoneManagement")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#fff", textTransform: "none" }}
                >
                  {t("zone_list_description")}
                </Typography>
              </Box>

              {/* Close button at top-right */}
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
            <Box>
              <Typography sx={labelStyle}>
                {t("zone_name")} <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                type="text"
                name="OrganizationStructureName"
                placeholder={t("zone_name_placeholder")}
                style={inputStyle}
                value={formState.OrganizationStructureName}
                onChange={onChange}
                error={!!errors.OrganizationStructureName}
                helperText={errors.OrganizationStructureName}
              />
            </Box>

            <Box>
              <Typography sx={labelStyle}>
                {t("zone_description")}
                <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                multiline
                rows={4}
                name="OrganizationStructureDescription"
                placeholder={t("zone_description_placeholder")}
                variant="outlined"
                fullWidth
                onChange={onChange}
                value={formState.OrganizationStructureDescription}
                error={errors.OrganizationStructureDescription}
                helperText={errors.OrganizationStructureDescription}
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
                  checked={formState?.IsActive}
                  onChange={() =>
                    setFormState({
                      ...formState,
                      IsActive: !formState.IsActive,
                    })
                  }
                />
                <div>
                  <Typography variant="b">{t("zone_status")}</Typography>
                  <Typography variant="body2">
                    {t("zone_status_description")}
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
                      backgroundColor: bgcolor || "#3D54CD",
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

export default NewZone;

NewZone.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editdata: PropTypes.object,
};
NewZone.defaultProps = {
  editdata: null,
};
