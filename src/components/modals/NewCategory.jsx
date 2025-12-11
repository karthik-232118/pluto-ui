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
  CircularProgress,
} from "@mui/material";
import icon from "../../assets/svg/sopsModal/modalIcon.svg";
import { AddCategory, GetElementsCategory } from "../../store/elements/action";
import { useDispatch, useSelector } from "react-redux";
import notify from "../../assets/svg/utils/toast/Toast";
import { validateAndSanitizeInputs } from "../../utils";
import { styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";
import { validateInput } from "../../utils/securityUtils";
import errorHandler from "../../utils/errorHandler";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 700,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "24px",
  borderRadius: "12px",
  outline: "none",
};

const inputStyle = {
  width: "100%",
  // padding: "10px 12px",
  marginBottom: "16px",
  borderRadius: "8px",
  // border: "1px solid #ccc",
  fontSize: "16px",
  boxSizing: "border-box",
};

const labelStyle = {
  marginBottom: "8px",
  fontWeight: "bold",
};

const CustomTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontWeight: 400, // Ensure font weight is set to 400
  },
});

const NewCategory = ({ open, onClose, editCategory }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [state, setState] = useState({
    ContentName: "",
    ContentDescription: "",
    CategoryStatus: true,
  });
  const disptach = useDispatch();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const bgColor = theme.palette.primary.main;

  // console.log(presistStore, "presistStore");
  const resetForm = () => {
    setState({
      ContentName: "",
      ContentDescription: "",
      CategoryStatus: true,
    });
    setErrors({});
  };

  useEffect(() => {
    if (editCategory !== null) {
      setState({
        ...editCategory,
        CategoryStatus: editCategory?.IsActive,
      });
    } else {
      setState({
        ContentName: "",
        ContentDescription: "",
        CategoryStatus: true,
      });
    }
    setErrors({});
  }, [editCategory]);
  const handleChange = (e) => {
    const { value, name } = e.target;
    setState({
      ...state,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" }); // Clear the error when the user starts typing
  };
  const validateForm = () => {
    let formErrors = {};
    const regex = /^[a-zA-Z\s]*$/;
    const htmlRegex = /(<([^>]+)>)/gi; // Regex to detect HTML tags

    if (!state.ContentName || state.ContentName.trim() === "") {
      formErrors.ContentName = t("errors.CategoryNameRequired");
    } else if (!regex.test(state.ContentName)) {
      formErrors.ContentName = t("errorsContentNameOnlyLetters");
    } else if (htmlRegex.test(state.ContentName)) {
      formErrors.ContentName = t("errors.no_html_allowed");
    }

    if (htmlRegex.test(state.ContentDescription)) {
      formErrors.ContentDescription = t("errors.no_html_allowed");
    }

    return formErrors;
  };

  const handleSubmit = async () => {
    // Validate inputs using security utils
    if (!validateInput(state.ContentName)) {
      setErrors((prev) => ({
        ...prev,
        ContentName:
          "Invalid input detected. Please enter a valid category name.",
      }));
      errorHandler.addSecurityError(state.ContentName, "categoryName");
      return;
    }

    if (state.ContentDescription && !validateInput(state.ContentDescription)) {
      setErrors((prev) => ({
        ...prev,
        ContentDescription:
          "Invalid input detected. Please enter a valid description.",
      }));
      errorHandler.addSecurityError(
        state.ContentDescription,
        "categoryDescription"
      );
      return;
    }

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      if (editCategory !== null) {
        const payload = {
          ModuleTypeID: presistStore?.ModuleTypeID || null,
          ParentContentID: presistStore?.ContentID || null,
          ContentID: editCategory?.ContentID || null,
          ContentName: state.ContentName || null,
          ContentDescription: state.ContentDescription || null,
          CategoryStatus: state?.IsActive || null,
        };
        const res = await disptach(AddCategory(payload));
        if (res?.payload) {
          resetForm();
          onClose();
          const data = {
            ModuleTypeID: presistStore?.ModuleTypeID,
            ParentContentID: presistStore?.ContentID,
          };
          disptach(GetElementsCategory(data));
        }
      } else {
        const payload = {
          ...state,
          ModuleTypeID: presistStore.ModuleTypeID,
          ParentContentID: presistStore.ContentID,
        };
        const res = await disptach(AddCategory(payload));
        if (res?.payload) {
          resetForm();
          onClose();
          const data = {
            ModuleTypeID: presistStore?.ModuleTypeID,
            ParentContentID: presistStore?.ContentID,
          };
          disptach(GetElementsCategory(data));
        }
      }
    } catch (error) {
      errorHandler.handleError(error);
      notify("error", "An error occurred while saving the category.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
                bgColor || "linear-gradient(to top, #2C64FF, #4A90E2)",
              margin: "-24px -24px 24px",
              padding: "24px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              position: "relative", // Added for X button positioning
            }}
          >
            <img src={icon} alt="logo" />
            <Box>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                {t("category_management")}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#fff", textTransform: "none" }}
              >
                {t("add_edit_category")}
              </Typography>
            </Box>
            <Button
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: "8px",
                top: "8px",
                minWidth: "auto",
                p: "4px",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Typography fontSize="24px">×</Typography>
            </Button>
          </Box>

          <Box>
            <Typography sx={labelStyle}>
              {t("category_name")} <span style={{ color: "red" }}>*</span>{" "}
            </Typography>
            <CustomTextField
              type="text"
              placeholder={t("enter_category_name")}
              style={inputStyle}
              onChange={handleChange}
              name="ContentName"
              error={!!errors.ContentName}
              helperText={errors.ContentName}
              value={state?.ContentName}
            />
          </Box>
          <Box>
            <Typography sx={labelStyle}>
              {t("category_description")}
              {/* <span style={{ color: "red" }}>*</span> */}
            </Typography>
            <CustomTextField
              multiline
              rows={4}
              placeholder={t("categoryDescriptionPlaceholder")}
              variant="outlined"
              fullWidth
              onChange={handleChange}
              name="ContentDescription"
              error={!!errors.ContentDescription}
              helperText={errors.ContentDescription}
              value={state?.ContentDescription}
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
                checked={state?.CategoryStatus}
                onChange={() =>
                  setState({
                    ...state,
                    CategoryStatus: !state?.CategoryStatus,
                  })
                }
                name="CategoryStatus"
              />
              <div>
                <Typography
                  variant="b"
                  sx={{ ...labelStyle, fontWeight: "600" }}
                >
                  {t("category_status")}
                </Typography>
              </div>
            </Box>
            <Box>
              <Typography
                variant="body2"
                color={state?.CategoryStatus ? "green" : "red"}
              >
                {state?.CategoryStatus ? t("active") : t("inactive")}
              </Typography>
            </Box>
          </Box>
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
                  fullWidth
                  onClick={handleSubmit}
                  sx={{
                    textTransform: "none",
                    backgroundColor: bgColor || "#2C64FF",
                    color: "#fff",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                  ) : editCategory === null ? (
                    t("save")
                  ) : (
                    t("Update")
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewCategory;

NewCategory.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editCategory: PropTypes.object, // Optional, if null it means adding a new category
};
NewCategory.defaultProps = {
  editCategory: null, // Default to null for adding a new category
};
