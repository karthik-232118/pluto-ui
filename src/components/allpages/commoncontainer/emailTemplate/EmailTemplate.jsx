import React, { useEffect, useState } from "react";
import {
  Save as SaveIcon,
  Visibility as EyeIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  CreateAndEditMailTemplate,
  DeleteMailTemplate,
  GetAllMailTemlate,
} from "../../../../services/mailTemplate/MailTemplate";
import { toast } from "react-toastify";
import DeleteTemplateModal from "./DeleteTemplateModal";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputLabel,
  Divider,
  Paper,
  Container,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { useHeadingBgColor } from "../../../useHeadingBgColor";

const EmailTemplate = () => {
  const bgColor = useHeadingBgColor();

  const [templateData, setTemplateData] = useState({
    logo: "",
    dear: "Dear [Customer Name],",
    content:
      "We are writing to inform you about important updates regarding your account. Our records indicate that there have been recent changes that require your attention.\n\nPlease review the following information carefully and take appropriate action if necessary. If you have any questions or concerns, do not hesitate to contact our support team.",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    closing: "Best regards,",
    signature:
      "Best regards,\n \nJohn Smith\nCustomer Support Manager\nABC Company Inc.\nEmail: support@abccompany.com\nPhone: (555) 123-4567",
    subject: "Important Update Regarding Your Account",
  });

  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await GetAllMailTemlate();
        console.log("GetAllMailTemlate API Response:", response?.data?.data);
        const fetchedTemplates = response?.data?.data || [];
        setTemplates(fetchedTemplates);

        // Select the latest template if available
        if (fetchedTemplates.length > 0) {
          // Sort templates by CreatedDate in descending order to get the latest
          const latestTemplate = fetchedTemplates.sort(
            (a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate)
          )[0];

          // Set the latest template as selected
          setSelectedTemplateId(latestTemplate.EmailTemplateID);
          setTemplateData({
            logo: latestTemplate.logo || "",
            dear: latestTemplate.GreetingName || "",
            content: latestTemplate.Body || "",
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            closing: "Best regards,",
            signature: latestTemplate.signature || "",
            subject: latestTemplate.Subject || "",
          });
        }
      } catch (error) {
        console.error("Error fetching mail templates:", error);
        toast.error("Failed to load templates", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateSelect = (template) => {
    console.log("Selected Template ID:", template.EmailTemplateID);
    setSelectedTemplateId(template.EmailTemplateID);
    setTemplateData({
      logo: template.logo || "",
      dear: template.GreetingName || "",
      content: template.Body || "",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      closing: "Best regards,",
      signature: template.signature || "",
      subject: template.Subject || "",
    });
  };

  const handleClear = () => {
    setSelectedTemplateId("");
    setTemplateData({
      logo: "",
      dear: "Dear [Customer Name],",
      content:
        "We are writing to inform you about important updates regarding your account. Our records indicate that there have been recent changes that require your attention.\n\nPlease review the following information carefully and take appropriate action if necessary. If you have any questions or concerns, do not hesitate to contact our support team.",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      closing: "Best regards,",
      signature:
        "Best regards,\n \nJohn Smith\nCustomer Support Manager\nABC Company Inc.\nEmail: support@abccompany.com\nPhone: (555) 123-4567",
      subject: "Important Update Regarding Your Account",
    });
  };

  const handleInputChange = (field) => (event) => {
    setTemplateData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const payload = {
        GreetingName: templateData.dear,
        Subject: templateData.subject,
        Body: templateData.content,
        signature: templateData.signature,
        logo: templateData.logo, // This will be base64 string when uploaded
        ...(selectedTemplateId && { EmailTemplateID: selectedTemplateId }),
      };

      console.log("Selected Template ID:", selectedTemplateId);
      console.log("Sending payload with user data:", payload);
      console.log(
        "Logo data (first 100 chars):",
        templateData.logo?.substring(0, 100)
      );

      // Call the API
      const response = await CreateAndEditMailTemplate(payload);
      console.log("API Response:", response);

      // ✅ Check HTTP status
      if (response?.status === 200 || response?.status === 201) {
        toast.success(
          response?.data?.message || "Template saved successfully!",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      } else {
        toast.error(response?.data?.message || "Something went wrong!", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to save template. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setTemplateData((prev) => ({
          ...prev,
          logo: e.target.result, // This is the base64 string
        }));
        toast.success("Logo uploaded successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      };
      reader.onerror = () => {
        toast.error("Failed to upload logo", {
          position: "top-right",
          autoClose: 5000,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setTemplateData((prev) => ({
      ...prev,
      logo: "",
    }));
    toast.info("Logo removed", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const getSelectedTemplateName = () => {
    if (!selectedTemplateId) return "Select a template";
    const selected = templates.find(
      (t) => t.EmailTemplateID === selectedTemplateId
    );
    return selected ? selected.GreetingName : "Select a template";
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const payload = { EmailTemplateID: selectedTemplateId };

      const response = await DeleteMailTemplate(payload);

      console.log("Delete API Response:", response);

      toast.success("Template deleted successfully!");
      handleClear();
    } catch (error) {
      console.error("Delete API Error:", error);
      toast.error("Failed to delete template.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleMouseEnter = (template, event) => {
    setHoveredTemplate(template);
    const rect = event.currentTarget.getBoundingClientRect();
    setPreviewPosition({
      x: rect.right + 12,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredTemplate(null);
  };
  const TemplatePreview = ({ template }) => {
    if (!template) return null;

    return (
      <Card
        sx={{
          position: "fixed",
          left: previewPosition.x,
          top: previewPosition.y,
          transform: "translateY(0)",
          width: 400,
          maxHeight: 500,
          overflow: "auto",
          zIndex: 9999,
          boxShadow: 4,
          border: `2px solid ${bgColor}`,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              backgroundColor: "#f8f9fa",
              padding: 2,
              borderBottom: 1,
              borderColor: "#e0e0e0",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold" color={bgColor}>
              {template.Subject || "No Subject"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Template Preview
            </Typography>
          </Box>

          {/* Logo Preview */}
          {template.logo && (
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <img
                src={template.logo}
                alt="Logo"
                style={{
                  maxHeight: "40px",
                  maxWidth: "120px",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}

          {/* Date */}
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ textAlign: "right", mb: 1 }}
          >
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>

          {/* Greeting */}
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {template.GreetingName || "Dear [Customer Name],"}
          </Typography>

          {/* Content Preview */}
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              lineHeight: 1.4,
              maxHeight: 120,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
              color: "#555",
            }}
          >
            {template.Body || "No content available"}
          </Typography>

          <Box sx={{ borderTop: 1, borderColor: "#e0e0e0", pt: 1 }}>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", fontSize: "0.8rem", color: "#666" }}
            >
              {template.signature || "No signature"}
            </Typography>
          </Box>

          <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: "#e0e0e0" }}>
            <Typography variant="caption" color="text.secondary">
              Created:{" "}
              {template.CreatedDate
                ? new Date(template.CreatedDate).toLocaleDateString()
                : "Unknown"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f5f5f5",
        padding: { xs: 1, sm: 4 },
        boxSizing: "border-box",
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            textAlign: "start",
            marginBottom: 3,
            color: bgColor,
          }}
        >
          Email Template Editor
        </Typography>

        <Paper
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          }}
        >
          <Box sx={{ padding: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#333",
              }}
            >
              {isEditing ? "Edit Template" : "Preview Template"}
            </Typography>

            {/* Hover Preview */}
            {hoveredTemplate && <TemplatePreview template={hoveredTemplate} />}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 0,
                marginTop: 2,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <FormControl
                size="small"
                sx={{
                  marginBottom: 3,
                  width: { xs: "100%", sm: "400px" }, // Match input width
                }}
              >
                <InputLabel>Select Template</InputLabel>
                <Select
                  value={selectedTemplateId || ""}
                  onChange={(e) => {
                    const template = templates.find(
                      (t) => t.EmailTemplateID === e.target.value
                    );
                    if (template) handleTemplateSelect(template);
                  }}
                  input={
                    <OutlinedInput
                      label="Select Template"
                      endAdornment={
                        selectedTemplateId && (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={handleClear}
                              sx={{ p: 0.5 }}
                            >
                              <CloseIcon
                                fontSize="small"
                                sx={{ marginRight: "10px" }}
                              />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    />
                  }
                  renderValue={(value) =>
                    value ? getSelectedTemplateName() : "Select a template"
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,
                        width: "inherit",
                      },
                    },
                  }}
                >
                  {templates.length === 0 ? (
                    <MenuItem disabled>No templates available</MenuItem>
                  ) : (
                    templates.map((template) => (
                      <MenuItem
                        key={template.EmailTemplateID}
                        value={template.EmailTemplateID}
                      >
                        <Typography fontWeight={500}>
                          {template.GreetingName || "Unnamed Template"}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {template.Subject || "No subject"}
                        </Typography>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", gap: 1, marginTop: -4 }}>
                {selectedTemplateId && (
                  <Button
                    onClick={handleDeleteClick}
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    size="medium"
                  >
                    Delete
                  </Button>
                )}
                {isEditing ? (
                  <Button
                    onClick={handlePreview}
                    variant="contained"
                    startIcon={<EyeIcon />}
                    sx={{
                      backgroundColor: bgColor,
                      color: "white",
                      "&:hover": {
                        backgroundColor: `${bgColor}CC`,
                      },
                    }}
                    size="medium"
                  >
                    Preview
                  </Button>
                ) : (
                  <Button
                    onClick={handleEdit}
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{
                      backgroundColor: bgColor,
                      color: "white",
                      "&:hover": {
                        backgroundColor: `${bgColor}CC`,
                      },
                    }}
                    size="medium"
                  >
                    Edit
                  </Button>
                )}
              </Box>
            </Box>

            {isEditing ? (
              /* EDIT MODE */
              <Paper
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  padding: 3,
                  backgroundColor: "#fafafa",
                  minHeight: 600,
                }}
              >
                {/* Subject Field */}
                <Box sx={{ marginBottom: 3 }}>
                  <InputLabel
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "#555",
                      marginBottom: 1,
                      display: "block",
                    }}
                  >
                    Email Subject
                  </InputLabel>
                  <TextField
                    fullWidth
                    value={templateData.subject}
                    onChange={handleInputChange("subject")}
                    placeholder="Enter email subject..."
                    size="medium"
                    variant="outlined"
                  />
                </Box>

                {/* Logo Section - ALWAYS VISIBLE */}
                <Box sx={{ marginBottom: 3 }}>
                  <InputLabel
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "#555",
                      marginBottom: 1,
                      display: "block",
                    }}
                  >
                    Company Logo
                  </InputLabel>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {/* Logo Upload Button */}
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="logo-upload"
                      type="file"
                      onChange={handleLogoUpload}
                    />
                    <label htmlFor="logo-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<UploadIcon />}
                        sx={{
                          borderColor: bgColor,
                          color: bgColor,
                          "&:hover": {
                            borderColor: `${bgColor}CC`,
                            backgroundColor: `${bgColor}08`,
                          },
                        }}
                      >
                        Upload Logo
                      </Button>
                    </label>

                    {/* Logo Preview and Remove Button */}
                    {templateData.logo && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <img
                          src={templateData.logo}
                          alt="Logo Preview"
                          style={{
                            maxHeight: "80px",
                            maxWidth: "200px",
                            objectFit: "contain",
                            borderRadius: 1,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Button
                          onClick={handleRemoveLogo}
                          variant="text"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                        >
                          Remove Logo
                        </Button>
                      </Box>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 1, textAlign: "center" }}
                  >
                    Supported formats: JPEG, PNG, GIF. Max size: 2MB
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Date Field */}
                <Box sx={{ marginBottom: 2 }}>
                  <InputLabel
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "#555",
                      marginBottom: 1,
                      display: "block",
                    }}
                  >
                    Date
                  </InputLabel>
                  <TextField
                    fullWidth
                    value={templateData.date}
                    onChange={handleInputChange("date")}
                    placeholder="e.g., January 1, 2024"
                    size="medium"
                    variant="outlined"
                  />
                </Box>

                {/* Dear Field */}
                <Box sx={{ marginBottom: 2 }}>
                  <InputLabel
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "#555",
                      marginBottom: 1,
                      display: "block",
                    }}
                  >
                    Salutation
                  </InputLabel>
                  <TextField
                    fullWidth
                    value={templateData.dear}
                    onChange={handleInputChange("dear")}
                    placeholder="e.g., Dear Customer,"
                    size="medium"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ marginBottom: 2 }}>
                  <InputLabel
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "#555",
                      marginBottom: 1,
                      display: "block",
                    }}
                  >
                    Email Content
                  </InputLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    value={templateData.content}
                    onChange={handleInputChange("content")}
                    placeholder="Enter your email content here..."
                    size="medium"
                    variant="outlined"
                    sx={{
                      "& .MuiInputBase-root": { alignItems: "flex-start" },
                    }}
                  />
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <InputLabel
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "#555",
                      marginBottom: 1,
                      display: "block",
                    }}
                  >
                    Signature
                  </InputLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={templateData.signature}
                    onChange={handleInputChange("signature")}
                    placeholder="Your name, title, company, and contact information"
                    size="medium"
                    variant="outlined"
                    sx={{
                      "& .MuiInputBase-root": { alignItems: "flex-start" },
                    }}
                  />
                </Box>
              </Paper>
            ) : (
            
              <Paper
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  padding: 0,
                  backgroundColor: "white",
                  minHeight: 600,
                  fontFamily: "Arial, sans-serif",
                  boxShadow: 1,
                }}
              >
              
                <Box
                  sx={{
                    backgroundColor: "#f8f9fa",
                    padding: { xs: "1rem 1rem", md: "1rem 2rem" },
                    borderBottom: 1,
                    borderColor: "#e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: "space-between" },
                      alignItems: "center",
                      fontSize: "0.875rem",
                      color: "#666",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 1,
                      textAlign: { xs: "center", md: "left" },
                    }}
                  >
                    <Typography>
                      <strong>From:</strong> support@abccompany.com
                    </Typography>
                    <Typography>
                      <strong>Date:</strong> {templateData.date}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      mt: 1,
                      textAlign: "center",
                    }}
                  >
                    <strong>To:</strong> customer@example.com
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: { xs: "1rem", md: "1.125rem" },
                      fontWeight: "bold",
                      color: bgColor,
                      textAlign: "center",
                    }}
                  >
                    <strong>Subject:</strong> {templateData.subject}
                  </Typography>
                </Box>
                <Box sx={{ padding: { xs: 2, md: 3 } }}>
                  {templateData.logo && (
                    <Box
                      sx={{
                        textAlign: "center",
                        marginBottom: 2,
                      }}
                    >
                      <img
                        src={templateData.logo}
                        alt="Company Logo"
                        style={{
                          maxHeight: "60px",
                          maxWidth: "180px",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  )}
              
                  <Box
                    sx={{
                      textAlign: "right",
                      color: "#666",
                      fontSize: "0.875rem",
                      marginBottom: 2,
                    }}
                  >
                    {templateData.date}
                  </Box>

                  <Typography
                    sx={{
                      marginBottom: 2,
                      fontSize: "1rem",
                      color: "#333",
                    }}
                  >
                    {templateData.dear}
                  </Typography>

                  <Typography
                    sx={{
                      marginBottom: 2,
                      fontSize: "1rem",
                      color: "#333",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {templateData.content}
                  </Typography>

                  <Typography
                    sx={{
                      marginBottom: 1,
                      fontSize: "1rem",
                      color: "#333",
                    }}
                  >
                    {templateData.closing}
                  </Typography>

                  <Typography
                    sx={{
                      marginBottom: 3,
                      fontSize: "1rem",
                      color: "#333",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.5,
                    }}
                  >
                    {templateData.signature}
                  </Typography>

                  <Box
                    sx={{
                      borderTop: 1,
                      borderColor: "#e0e0e0",
                      paddingTop: 3,
                      fontSize: "0.75rem",
                      color: "#666",
                      textAlign: "center",
                    }}
                  >
                    <Typography sx={{ margin: "0.25rem 0" }}>
                      ABC Company Inc. | 123 Business Street, Suite 100 | New
                      York, NY 10001
                    </Typography>
                    <Typography sx={{ margin: "0.25rem 0" }}>
                      Phone: (555) 123-4567 | Email: info@abccompany.com |
                      Website: www.abccompany.com
                    </Typography>
                    <Typography
                      sx={{ margin: "0.25rem 0", fontStyle: "italic" }}
                    >
                      This email was sent to customer@example.com. Please do not
                      reply to this email.
                    </Typography>
                    <Box
                      sx={{
                        margin: "0.25rem 0",
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="text"
                        href="#"
                        sx={{
                          color: bgColor,
                          textDecoration: "underline",
                          p: 0,
                          minWidth: "auto",
                        }}
                        size="small"
                      >
                        Unsubscribe
                      </Button>
                      <Button
                        variant="text"
                        href="#"
                        sx={{
                          color: bgColor,
                          textDecoration: "underline",
                          p: 0,
                          minWidth: "auto",
                        }}
                        size="small"
                      >
                        Privacy Policy
                      </Button>
                      <Button
                        variant="text"
                        href="#"
                        sx={{
                          color: bgColor,
                          textDecoration: "underline",
                          p: 0,
                          minWidth: "auto",
                        }}
                        size="small"
                      >
                        Terms of Service
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Action Buttons */}
            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={isEditing ? handlePreview : handleEdit}
                variant="outlined"
                startIcon={isEditing ? <EyeIcon /> : <EditIcon />}
                sx={{
                  color: bgColor,
                  borderColor: bgColor,
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                }}
                size="medium"
              >
                {isEditing ? "Preview" : "Edit"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{
                  backgroundColor: bgColor,
                  color: "white",
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: `${bgColor}CC`,
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#ccc",
                  },
                }}
                size="medium"
              >
                {isLoading
                  ? "Saving..."
                  : selectedTemplateId
                  ? "Update Template"
                  : "Create Template"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <DeleteTemplateModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default EmailTemplate;
