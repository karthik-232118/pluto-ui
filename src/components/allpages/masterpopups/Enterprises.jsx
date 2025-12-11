import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  TextField,
  Modal,
  Box,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import icon from "../../../assets/svg/MasterPopup/headingaddicon.svg";
import { useDispatch } from "react-redux";
import {
  AddEnterprises,
  Editenterprise,
} from "../../../store/enterprise/action";
import notify from "../../../assets/svg/utils/toast/Toast";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useTheme } from "@mui/styles";
import { validateInput } from "../../../utils/securityUtils";
import errorHandler from "../../../utils/errorHandler";

const Enterprises = ({ open, onClose, editdata }) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({
    OrganizationStructureName: "",
    OrganizationStructureDescription: "",
    OrganizationStructureEmail: "",
    OrganizationStructureToken: "",
    IsActive: true,
  });
  const [uniqueCode, setUniqueCode] = useState(() => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  });
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#2196F3");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loginImages, setLoginImages] = useState([
    { image: null, heading: "", description: "" },
  ]);
  const dispatch = useDispatch();
  const theme = useTheme();
  const bgColor = theme.palette.primary.main; // Use theme color directly

  const validateForm = () => {
    const newErrors = {};
    const regex = /^[a-zA-Z\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
      // Add security validation checks
      if (!validateInput(formState.OrganizationStructureName)) {
        newErrors.OrganizationStructureName =
          "SQL injection attempt detected in enterprise name";
        errorHandler.addSecurityError(
          formState.OrganizationStructureName,
          "OrganizationStructureName"
        );
        setErrors(newErrors);
        return false;
      }

      if (!validateInput(formState.OrganizationStructureDescription)) {
        newErrors.OrganizationStructureDescription =
          "SQL injection attempt detected in description";
        errorHandler.addSecurityError(
          formState.OrganizationStructureDescription,
          "OrganizationStructureDescription"
        );
        setErrors(newErrors);
        return false;
      }

      if (!validateInput(formState.OrganizationStructureEmail)) {
        newErrors.OrganizationStructureEmail =
          "SQL injection attempt detected in email";
        errorHandler.addSecurityError(
          formState.OrganizationStructureEmail,
          "OrganizationStructureEmail"
        );
        setErrors(newErrors);
        return false;
      }

      // Continue with existing validation
      if (!formState.OrganizationStructureName.trim()) {
        newErrors.OrganizationStructureName = t(
          "errors.organization_structure_name_required"
        );
      } else if (!regex.test(formState.OrganizationStructureName)) {
        newErrors.OrganizationStructureName = t(
          "errors.organization_structure_name_invalid"
        );
      }

      if (!formState.OrganizationStructureEmail.trim()) {
        newErrors.OrganizationStructureEmail = t(
          "errors.organization_structure_email_required"
        );
      } else if (!emailRegex.test(formState.OrganizationStructureEmail)) {
        newErrors.OrganizationStructureEmail = t(
          "errors.organization_structure_email_invalid"
        );
      }

      if (!formState.OrganizationStructureDescription.trim()) {
        newErrors.OrganizationStructureDescription = t(
          "errors.organization_structure_description_required"
        );
      }
    } catch (error) {
      // Handle security errors
      if (error.message.includes("SQL_INJECTION")) {
        const field = error.message.match(/in (\w+)/)[1];
        newErrors[field] = `SQL injection attempt detected in ${field}`;
        setErrors(newErrors);
        return false;
      }
      throw error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async () => {
    setShowErrors(true);
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        OrganizationStructureName: formState.OrganizationStructureName,
        OrganizationStructureDescription:
          formState.OrganizationStructureDescription,
        OrganizationStructureEmail: formState.OrganizationStructureEmail,
        OrganizationStructureToken: uniqueCode,
        IsActive: formState.IsActive,
        OrganizationStructureLogo: image,
        OrganizationStructureColor: selectedColor,
      };
      if (editdata) {
        payload.OrganizationStructureID = editdata.OrganizationStructureID;
        const res = await dispatch(Editenterprise(payload));
        if (res) {
          handleClose();
        }
      } else {
        const res = await dispatch(AddEnterprises(payload));
        if (res) {
          handleClose();
        }
      }
    } catch (error) {
      console.error(error);
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFormState({
      OrganizationStructureName: "",
      OrganizationStructureDescription: "",
      OrganizationStructureEmail: "",
      OrganizationStructureToken: "",
      IsActive: true,
    });
    setUniqueCode("");
    setImage(null);
    setShowColorPicker(false);
    setErrors({});
    setShowErrors(false);
    setLoginImages([{ image: null, heading: "", description: "" }]);
  };
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (editdata) {
      setFormState({
        OrganizationStructureName: editdata?.OrganizationStructureName,
        OrganizationStructureDescription:
          editdata?.OrganizationStructureDescription,
        OrganizationStructureEmail: editdata?.OrganizationStructureEmail,
        OrganizationStructureToken: editdata?.OrganizationStructureToken,
        IsActive: editdata?.IsActive || true,
      });
      setUniqueCode(editdata?.OrganizationStructureToken || "");
      setSelectedColor(editdata?.OrganizationStructureColor || "#2196F3");
      setImage(editdata?.OrganizationStructureLogo || null);
    } else {
      setUniqueCode(Math.random().toString(36).substring(2, 8).toUpperCase());
      setFormState({
        OrganizationStructureName: "",
        OrganizationStructureDescription: "",
        OrganizationStructureEmail: "",
        OrganizationStructureToken: "",
        IsActive: true,
      });
      setImage(null);
      setSelectedColor("#2196F3");
    }
    setErrors({});
    setLoginImages([{ image: null, heading: "", description: "" }]);
  }, [editdata]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/svg+xml" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an SVG or PNG image.");
    }
  };

  const handleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };
  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  // Handle image upload for login images
  const handleLoginImageChange = (idx, e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "image/svg+xml" ||
        file.type === "image/png" ||
        file.type === "image/jpeg")
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        setLoginImages((prev) =>
          prev.map((item, i) =>
            i === idx ? { ...item, image: reader.result } : item
          )
        );
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an SVG, PNG, or JPG image.");
    }
  };

  // Handle heading/description change for login images
  const handleLoginImageFieldChange = (idx, field, value) => {
    setLoginImages((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  // Add more login image fields
  const handleAddLoginImage = () => {
    setLoginImages((prev) => [
      ...prev,
      { image: null, heading: "", description: "" },
    ]);
  };

  // Remove a login image field
  const handleRemoveLoginImage = (idx) => {
    setLoginImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <Modal open={open}>
        <Box
          sx={{
            width: "90%",
            maxWidth: 1200,
            height: "90vh",
            bgcolor: "background.paper",
            borderRadius: 1,
            padding: 4,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            gap="24px"
            sx={{ height: "100%" }}
          >
            <Box
              display="flex"
              alignItems="center"
              gap="16px"
              sx={{
                background:
                  bgColor || "linear-gradient(to top, #2C64FF, #4A90E2)",
                margin: "-32px -32px 0",
                padding: "24px",
                borderTopLeftRadius: "2px",
                borderTopRightRadius: "2px",
                position: "relative",
                pr: 6,
              }}
            >
              <img src={icon} alt="logo" />
              <Box flexGrow={1}>
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  {t("enterpriseManagement.title")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#fff", textTransform: "none" }}
                >
                  {t("enterpriseManagement.description")}
                </Typography>
              </Box>
              <Button
                onClick={onClose}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: 16,
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

            <Box
              sx={{
                flexGrow: 1,
                display: "grid",
                gridTemplateColumns: "1fr", // Changed from "repeat(2, 1fr)" to "1fr"
                gap: 3,
                overflowY: "auto",
                pr: 2,
              }}
            >
              {/* Left Column */}
              <Box display="flex" flexDirection="column" gap={3}>
                <Box>
                  <Typography>
                    {t("enterpriseManagement.fields.enterpriseName")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    type="text"
                    placeholder={t(
                      "enterpriseManagement.placeholders.enterName"
                    )}
                    name="OrganizationStructureName"
                    onChange={onChange}
                    value={formState.OrganizationStructureName}
                    error={showErrors && !!errors.OrganizationStructureName}
                    helperText={
                      showErrors &&
                      errors.OrganizationStructureName && (
                        <Typography color="error" sx={{ mt: 1 }}>
                          {errors.OrganizationStructureName}
                          {errors.OrganizationStructureName.includes(
                            "SQL injection"
                          ) && (
                            <Box
                              component="pre"
                              sx={{
                                mt: 1,
                                fontSize: "12px",
                                color: "#d32f2f",
                                bgcolor: "#fff3f3",
                                p: 1,
                                borderRadius: 1,
                              }}
                            >
                              [SQL_INJECTION] Error:{" "}
                              {errors.OrganizationStructureName}
                            </Box>
                          )}
                        </Typography>
                      )
                    }
                    fullWidth
                    variant="outlined"
                    size="small"
                    required
                  />
                </Box>
                <Box>
                  <Typography>
                    {t("enterpriseManagement.fields.enterpriseDescription")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    multiline
                    rows={4}
                    name="OrganizationStructureDescription"
                    placeholder={t(
                      "enterpriseManagement.placeholders.enterDescription"
                    )}
                    variant="outlined"
                    fullWidth
                    onChange={onChange}
                    value={formState.OrganizationStructureDescription}
                    error={
                      showErrors && !!errors.OrganizationStructureDescription
                    }
                    helperText={
                      showErrors ? errors.OrganizationStructureDescription : ""
                    }
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography>
                    {t("enterpriseManagement.fields.email")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <TextField
                    type="email"
                    placeholder={t(
                      "enterpriseManagement.placeholders.enterEmail"
                    )}
                    name="OrganizationStructureEmail"
                    onChange={onChange}
                    value={formState.OrganizationStructureEmail}
                    error={showErrors && !!errors.OrganizationStructureEmail}
                    helperText={
                      showErrors ? errors.OrganizationStructureEmail : ""
                    }
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Box>
                {editdata ? (
                  <Box>
                    <Typography>
                      {t("enterpriseManagement.fields.uniqueCode")}
                      <span style={{ color: "red" }}>*</span>
                    </Typography>
                    <Box display="flex" alignItems="center" gap="8px">
                      <TextField
                        type="text"
                        value={uniqueCode}
                        placeholder={t(
                          "enterpriseManagement.placeholders.generatedCode"
                        )}
                        readOnly
                        fullWidth
                        size="small"
                        error={!!errors.uniqueCode}
                        helperText={errors.uniqueCode}
                        onChange={(e) => setUniqueCode(e.target.value)}
                      />
                    </Box>
                  </Box>
                ) : null}

                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="body1" mb={1}>
                    {t("enterpriseManagement.fields.uploadLogo")}
                  </Typography>
                  <input
                    type="file"
                    accept=".svg,.png"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="upload-logo"
                  />
                  <label htmlFor="upload-logo">
                    <Button variant="outlined" component="span">
                      {t("enterpriseManagement.fields.chooseFile")}
                    </Button>
                  </label>
                  {image && (
                    <Box mt={2}>
                      <img
                        src={image}
                        alt="Uploaded Logo"
                        style={{
                          height: "20px",
                          width: "80px",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <Box textAlign="center">
                  <Typography
                    variant="body1"
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    {" "}
                    {t("enterpriseManagement.fields.navbarColor.title")}
                  </Typography>
                  <Button variant="outlined" onClick={handleColorPicker}>
                    {t("enterpriseManagement.fields.navbarColor.button")}
                  </Button>

                  {showColorPicker && (
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={handleColorChange}
                      style={{
                        marginTop: "12px",
                        width: "100px",
                        height: "38px",
                      }}
                    />
                  )}

                  {/* Preview Section */}
                  <Box
                    mt={2}
                    height={50}
                    bgcolor={selectedColor}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius={1}
                    boxShadow={2}
                  >
                    <Typography
                      variant="body1"
                      color="#fff"
                      sx={{ marginTop: "10px" }}
                    >
                      {t("preview")}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Right Column - COMMENTED OUT */}
              {/* <Box>
                <Box sx={{ height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      p: 2,
                      background:
                        "linear-gradient(135deg, #f6f7f9 0%, #edf0f5 100%)",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#1a2027" }}
                      >
                        {t("loginPageImages")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("loginPageImagesDescription")}
                      </Typography>
                    </Box>
                  </Box>

                  {loginImages.map((item, idx) => (
                    <Card
                      key={idx}
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        background: "#fff",
                        position: "relative",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", gap: 3 }}>
                          <Box
                            sx={{
                              width: 200,
                              height: 140,
                              borderRadius: 2,
                              border: "2px dashed #e0e0e0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#f8fafc",
                              overflow: "hidden",
                            }}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt="Login"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <Box sx={{ textAlign: "center", p: 2 }}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}
                                >
                                  {t("noImageSelected")}
                                </Typography>
                                <input
                                  type="file"
                                  accept=".svg,.png,.jpg,.jpeg"
                                  style={{ display: "none" }}
                                  id={`login-image-upload-${idx}`}
                                  onChange={(e) =>
                                    handleLoginImageChange(idx, e)
                                  }
                                />
                                <label htmlFor={`login-image-upload-${idx}`}>
                                  <Button
                                    variant="outlined"
                                    component="span"
                                    size="small"
                                    sx={{
                                      textTransform: "none",
                                      borderRadius: "20px",
                                    }}
                                  >
                                    {t("chooseImage")}
                                  </Button>
                                </label>
                              </Box>
                            )}
                          </Box>

                          <Box sx={{ flex: 1 }}>
                            <TextField
                              label="Heading"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={item.heading}
                              onChange={(e) =>
                                handleLoginImageFieldChange(
                                  idx,
                                  "heading",
                                  e.target.value
                                )
                              }
                              sx={{ mb: 2 }}
                            />
                            <TextField
                              label="Description"
                              variant="outlined"
                              size="small"
                              fullWidth
                              multiline
                              rows={2}
                              value={item.description}
                              onChange={(e) =>
                                handleLoginImageFieldChange(
                                  idx,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            {item.image && (
                              <label htmlFor={`login-image-upload-${idx}`}>
                                <Button
                                  variant="outlined"
                                  component="span"
                                  size="small"
                                  sx={{
                                    minWidth: "100px",
                                    textTransform: "none",
                                  }}
                                >
                                  {t("change")}
                                </Button>
                              </label>
                            )}
                            {loginImages.length > 1 && (
                              <IconButton
                                onClick={() => handleRemoveLoginImage(idx)}
                                color="error"
                                size="small"
                                sx={{
                                  border: "1px solid #ffcdd2",
                                  "&:hover": {
                                    background: "#fff5f5",
                                  },
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddLoginImage}
                    sx={{
                      mt: 1,
                      textTransform: "none",
                      borderStyle: "dashed",
                      borderWidth: "2px",
                      "&:hover": {
                        borderStyle: "dashed",
                        borderWidth: "2px",
                      },
                    }}
                  >
                    {t("addMoreImages")}
                  </Button>
                </Box>
              </Box> */}
            </Box>

            {/* Footer with buttons */}
            <Box
              mt={3}
              display="flex"
              justifyContent="space-between"
              sx={{ borderTop: 1, borderColor: "divider", pt: 2 }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  handleClose();
                }}
                style={{
                  marginRight: 8,
                  textTransform: "none",
                }}
                size="small"
                fullWidth
              >
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                onClick={handleClick}
                size="small"
                disabled={
                  loading ||
                  !formState.OrganizationStructureName.trim() ||
                  !formState.OrganizationStructureDescription.trim() ||
                  !formState.OrganizationStructureEmail.trim()
                }
                fullWidth
                sx={{
                  textTransform: "none",
                }}
              >
                {loading ? <CircularProgress size={24} /> : t("save")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Enterprises;

Enterprises.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editdata: PropTypes.object,
};
Enterprises.defaultProps = {
  editdata: null,
};
