import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Switch,
  Typography,
  Divider,
  Grid,
  Select,
  TextField,
  MenuItem,
} from "@mui/material";
import icon from "../../../assets/svg/MasterPopup/headingaddicon.svg";
import { Addunit, EditUnit, GetZone } from "../../../store/enterprise/action";
import { useDispatch, useSelector } from "react-redux";
import { validateAndSanitizeInputs } from "../../../utils";
import notify from "../../../assets/svg/utils/toast/Toast";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";
import errorHandler from "../../../utils/errorHandler";
import { validateInput } from "../../../utils/securityUtils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 700,
  overflowY: "auto",
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
};

const labelStyle = {
  marginBottom: "8px",
  fontWeight: "bold",
};

const NewUnit = ({ open, onClose, editdata }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { zonelist } = useSelector((state) => state.enterprise);
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main;

  const [formState, setFormState] = useState({
    ParentID: "",
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
        "Invalid input detected in unit name";
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
    const regex = /^[a-zA-Z\s]*$/; // Allows only letters and spaces

    if (!formState.OrganizationStructureName.trim()) {
      newErrors.OrganizationStructureName = t("errors.unit_name_required");
    } else if (!regex.test(formState.OrganizationStructureName)) {
      newErrors.OrganizationStructureName = t("errors.unit_name_invalid");
    }

    if (!formState.ParentID) {
      newErrors.ParentID = t("errors.zone_selection_required");
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
        if (editdata) {
          const payload = {
            OrganizationStructureID: editdata ? editdata.UnitID : undefined,
            OrganizationStructureDescription:
              formState.OrganizationStructureDescription,
            OrganizationStructureName: formState.OrganizationStructureName,
            IsActive: formState.IsActive,
            ParentID: formState.ParentID,
          };
          const res = await dispatch(EditUnit(payload));
          if (res?.payload) {
            handleClose();
          }
        } else {
          const payload = {
            ParentID: formState.ParentID,
            OrganizationStructureName: formState.OrganizationStructureName,
            OrganizationStructureDescription:
              formState.OrganizationStructureDescription,
            IsActive: formState.IsActive,
          };

          const res = await dispatch(Addunit(payload));
          if (res?.payload) {
            handleClose();
          }
        }
      } else {
        notify("error", "Suspicious input detected!");
      }
    }
  };

  const handleClose = () => {
    setFormState({
      ParentID: "",
      OrganizationStructureName: "",
      OrganizationStructureDescription: "",
      IsActive: true,
    });
    setErrors({});
    onClose();
  };

  useEffect(() => {
    dispatch(GetZone());
  }, [dispatch]);

  useEffect(() => {
    if (editdata) {
      setFormState({
        ParentID: editdata.ZoneID,
        OrganizationStructureName: editdata.UnitName,
        OrganizationStructureDescription: editdata.UnitDescriptions,
        IsActive: editdata.IsActive,
      });
    } else {
      setFormState({
        ParentID: "",
        OrganizationStructureName: "",
        OrganizationStructureDescription: "",
        IsActive: true,
      });
    }
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

  const onChangeSelect = (e) => {
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
              position: "relative", 
              pr: 8, 
            }}
          >
            <img src={icon} alt="logo" />
            <Box flexGrow={1}>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                {t("unit_management")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#fff", textTransform: "none" }}
              >
                {t("unit_add_edit_description")}
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
          <Select
            value={formState.ParentID}
            onChange={onChangeSelect}
            name="ParentID"
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              {t("select_zone")}
            </MenuItem>
            {zonelist?.map((zone) => (
              <MenuItem
                key={zone.OrganizationStructureID}
                value={zone.OrganizationStructureID}
              >
                {zone.OrganizationStructureName}
              </MenuItem>
            ))}
          </Select>
          {errors.ParentID && (
            <Typography color="error">{errors.ParentID}</Typography>
          )}
          <Box>
            <Typography sx={labelStyle}>
              {t("unit_name")}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              type="text"
              placeholder={t("unit_name_placeholder")}
              style={inputStyle}
              name="OrganizationStructureName"
              onChange={onChange}
              value={formState.OrganizationStructureName}
              error={!!errors.OrganizationStructureName}
              helperText={errors.OrganizationStructureName}
            />
          </Box>

          <Box>
            <Typography sx={labelStyle}>
              {t("unit_description")}
              <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              multiline
              rows={4}
              name="OrganizationStructureDescription"
              placeholder={t("unit_description_placeholder")}
              variant="outlined"
              fullWidth
              onChange={onChange}
              value={formState.OrganizationStructureDescription}
              error={!!errors.OrganizationStructureDescription}
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
                checked={formState.IsActive}
                onChange={() =>
                  setFormState((prev) => ({
                    ...prev,
                    IsActive: !prev.IsActive,
                  }))
                }
              />
              <div>
                <Typography variant="b">{t("unit_status")}</Typography>
                <Typography variant="body2">
                  {t("unit_status_description")}
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
  );
};

export default NewUnit;

NewUnit.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editdata: PropTypes.object,
};
NewUnit.defaultProps = {
  editdata: null,
};
