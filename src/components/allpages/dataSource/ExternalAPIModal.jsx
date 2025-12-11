import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Http as HttpIcon,
  Code as CodeIcon,
  VpnKey as KeyIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  SaveUploadedDashboardApi,
  UpdateDataSourceApi,
} from "../../../services/dashboardBuilder/DashboardBuilder";

const ExternalAPIModal = ({ open, onClose, onSave, editingDataset }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    method: "GET",
    apiUrl: "",
    headers: "",
    mappingKey: "",
    payload: "",
  });

  useEffect(() => {
    if (editingDataset) {
      setFormData(editingDataset);
    } else {
      setFormData({
        name: "",
        description: "",
        method: "GET",
        apiUrl: "",
        headers: "",
        mappingKey: "",
        payload: "",
      });
    }
  }, [editingDataset, open]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const payload = {
      DataSourceID: editingDataset?.id || "", 
      DataSourceName: formData.name,
      DataSourceDescription: formData.description,
      DataSourceType: "External API",
      DataSourceConfig: {
        method: formData.method,
        apiUrl: formData.apiUrl,
        headers: formData.headers,
        mappingKey: formData.mappingKey,
        payload: formData.payload,
      },
    };
    try {
      if (editingDataset) {
        await UpdateDataSourceApi(payload);
      } else {
        await SaveUploadedDashboardApi(payload);
      }
      if (onSave) onSave(formData);
      onClose();
    } catch (error) {
      // Optionally handle error (e.g., show notification)
      console.error("Failed to save external API data source", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          background: "#f9fafc",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: theme.palette.primary.main,
          color: "white",
          py: 2,
          px: 3,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <HttpIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6" fontWeight="600">
              {editingDataset ? t("editExternalApi") : t("addNewExternalApi")}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3, background: "#f9fafc" }}>
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 3, background: "white", borderRadius: 2 }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("name")}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                margin="dense"
                required
                placeholder={t("namePlaceholder")}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("description")}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                margin="dense"
                placeholder={t("descriptionPlaceholder")}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography
                  variant="p"
                  gutterBottom
                  color="textSecondary"
                  fontWeight="500"
                >
                  {t("apiMethod")}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item>
                    <Button
                      variant={
                        formData.method === "GET" ? "contained" : "outlined"
                      }
                      onClick={() => handleChange("method", "GET")}
                      color="primary"
                      sx={{
                        borderRadius: 2,
                        fontWeight: "600",
                        textTransform: "none",
                        px: 2,
                        boxShadow: formData.method === "GET" ? 2 : 0,
                      }}
                    >
                      {t("get")}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant={
                        formData.method === "POST" ? "contained" : "outlined"
                      }
                      onClick={() => handleChange("method", "POST")}
                      color="primary"
                      sx={{
                        borderRadius: 2,
                        fontWeight: "600",
                        textTransform: "none",
                        px: 2,
                        boxShadow: formData.method === "POST" ? 2 : 0,
                      }}
                    >
                      {t("post")}
                    </Button>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("apiUrl")}
                value={formData.apiUrl}
                onChange={(e) => handleChange("apiUrl", e.target.value)}
                margin="dense"
                required
                placeholder={t("apiUrlPlaceholder")}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("headers")}
                value={formData.headers}
                onChange={(e) => handleChange("headers", e.target.value)}
                margin="dense"
                multiline
                rows={4}
                placeholder={t("headersPlaceholder")}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {formData.method === "POST" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("payload")}
                  value={formData.payload}
                  onChange={(e) => handleChange("payload", e.target.value)}
                  margin="normal"
                  multiline
                  rows={4}
                  placeholder={t("payloadPlaceholder")}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("mappingKey")}
                value={formData.mappingKey}
                onChange={(e) => handleChange("mappingKey", e.target.value)}
                margin="dense"
                required
                placeholder={t("mappingKeyPlaceholder")}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <KeyIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    pl: 1,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, background: "white" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            fontWeight: "600",
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name || !formData.apiUrl || !formData.mappingKey}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            fontWeight: "600",
            boxShadow: 2,
          }}
        >
          {editingDataset ? t("updateApi") : t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExternalAPIModal;
