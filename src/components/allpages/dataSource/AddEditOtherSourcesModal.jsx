import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Typography,
  OutlinedInput,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StorageIcon from "@mui/icons-material/Storage";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import {
  SaveUploadedDashboardApi,
  UpdateDataSourceApi,
} from "../../../services/dashboardBuilder/DashboardBuilder";

const SOURCE_TYPES = [
  { value: "SFTP", labelKey: "sftp" },
  { value: "Firebase", labelKey: "firebase" },
  { value: "Google Sheets", labelKey: "googleSheets" },
];

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1300,
  width: "100vw",
  height: "100vh",
  bgcolor: "rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const contentStyle = {
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  minWidth: 340,
  maxWidth: 480,
  width: "100%",
  p: 0,
  overflow: "hidden",
};

const AddEditOtherSourcesModal = ({
  open,
  onClose,
  selectedSource,
  setSelectedSource,
  onSave, // receive the handler
  initialValues, // new prop
  mode, // new prop: "edit" or "add"
  selectedDataSourceId
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSourceList, setShowSourceList] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter sources based on search term
  const filteredSources = useMemo(() => {
    if (!searchTerm) return SOURCE_TYPES;
    return SOURCE_TYPES.filter((src) =>
      t(src.labelKey).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, t]);

  const handleSourceSelect = (src) => {
    setSelectedSource(src.value);
    setShowSourceList(false);
    setSearchTerm("");
  };

  // Add state for form fields
  const [form, setForm] = useState({});
  React.useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    } else {
      setForm({});
    }
  }, [selectedSource, open, initialValues]);

  // Helper to update form fields
  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Add state for DataSourceID (for edit mode)
  const [dataSourceId, setDataSourceId] = useState("");

  React.useEffect(() => {
    if (initialValues && initialValues.DataSourceID) {
      setDataSourceId(initialValues.DataSourceID);
    } else {
      setDataSourceId("");
    }
  }, [initialValues]);

  const handleSave = async () => {
    let name = "";
    let type = "";
    if (selectedSource === "SFTP") {
      name = t("sftp");
      type = t("typeFileTransfer");
    } else if (selectedSource === "Firebase") {
      name = t("firebase");
      type = t("typeNoSQL");
    } else if (selectedSource === "Google Sheets") {
      name = t("googleSheets");
      type = t("typeSpreadsheet");
    }

    setLoading(true);
    try {
      if (mode === "edit") {
      
        const payload = {
          DataSourceID: selectedDataSourceId || initialValues?.DataSourceID || "",
          DataSourceName: selectedSource,
          DataSourceType: "Other Data Sources",
          DataSourceConfigData: form,
        };
        const response = await UpdateDataSourceApi(payload);
        console.log("UpdateDataSourceApi response:", response?.data);
      
        onSave({
          name,
          type,
          details: form,
        });
      } else {
      
        const payload = {
          DataSourceName: selectedSource,
          DataSourceType: "Other Data Sources",
          DataSourceConfigData: form,
        };
        await SaveUploadedDashboardApi(payload);
        onSave({
          name,
          type,
          details: form,
        });
      }
    } catch (err) {
      // Optionally handle error here
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
          overflow: "hidden",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          color: "white",
          background: (theme) => theme.palette.primary.main,
          py: 2,
          position: "relative",
          textAlign: "center",
          fontSize: "1.5rem",
        }}
      >
        <StorageIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        {t("dialogTitleAddConnection")}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "white",
            bgcolor: "rgba(255,255,255,0.2)",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.3)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3 }}>
        {/* Source Type Selection */}
        <FormControl fullWidth sx={{ mt: 4 }} variant="outlined">
          <InputLabel id="source-select-label" sx={{ fontWeight: "bold" }}>
            {t("sourceType")}
          </InputLabel>
          <Select
            labelId="source-select-label"
            value={selectedSource}
            label={t("sourceType")}
            onOpen={() => setShowSourceList(true)}
            onClose={() => setShowSourceList(false)}
            open={showSourceList}
            renderValue={(value) => (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={t(
                    SOURCE_TYPES.find((src) => src.value === value)?.labelKey ||
                      ""
                  )}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              </Box>
            )}
          >
            <Box sx={{ p: 1 }}>
              <OutlinedInput
                fullWidth
                size="small"
                placeholder={t("searchSourceType") || "Search source..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                }
                sx={{ mb: 1 }}
              />

              <Paper
                variant="outlined"
                sx={{ maxHeight: 200, overflow: "auto" }}
              >
                <List dense>
                  {filteredSources.map((src) => (
                    <ListItemButton
                      key={src.value}
                      selected={selectedSource === src.value}
                      onClick={() => handleSourceSelect(src)}
                      sx={{
                        borderRadius: 1,
                        mx: 1,
                        mb: 0.5,
                        "&.Mui-selected": {
                          bgcolor: "primary.light",
                          color: "white",
                        },
                      }}
                    >
                      <ListItemText primary={t(src.labelKey)} />
                    </ListItemButton>
                  ))}
                  {filteredSources.length === 0 && (
                    <ListItem>
                      <ListItemText>
                        <Typography color="text.secondary" align="center">
                          {t("noSourcesFound") || "No sources found"}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Box>
          </Select>
        </FormControl>

        {/* Connection Details */}
        {selectedSource === "SFTP" && (
          <Box
            sx={{
              mt: 3,
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              color="primary.main"
              fontWeight="bold"
            >
              {t("sftp")} {t("connectionDetails")}
            </Typography>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                fullWidth
                label={t("host")}
                sx={{ mb: 0 }}
                value={form.host || ""}
                onChange={handleFormChange("host")}
              />
              <TextField
                fullWidth
                label={t("port")}
                sx={{ mb: 0 }}
                value={form.port || ""}
                onChange={handleFormChange("port")}
              />
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mt: 2,
              }}
            >
              <TextField
                fullWidth
                label={t("username")}
                sx={{ mb: 0 }}
                value={form.username || ""}
                onChange={handleFormChange("username")}
              />
              <TextField
                fullWidth
                label={t("password")}
                type="password"
                sx={{ mb: 0 }}
                value={form.password || ""}
                onChange={handleFormChange("password")}
              />
            </Box>
            <TextField
              fullWidth
              label={t("remoteDirectoryPath")}
              sx={{ mt: 2 }}
              value={form.remoteDirectoryPath || ""}
              onChange={handleFormChange("remoteDirectoryPath")}
            />
          </Box>
        )}

        {selectedSource === "Firebase" && (
          <Box
            sx={{
              mt: 3,
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              color="primary.main"
              fontWeight="bold"
            >
              {t("firebase")} {t("connectionDetails")}
            </Typography>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                fullWidth
                label={t("projectId")}
                sx={{ mb: 0 }}
                value={form.projectId || ""}
                onChange={handleFormChange("projectId")}
              />
              <TextField
                fullWidth
                label={t("apiKey")}
                sx={{ mb: 0 }}
                value={form.apiKey || ""}
                onChange={handleFormChange("apiKey")}
              />
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mt: 2,
              }}
            >
              <TextField
                fullWidth
                label={t("authDomain")}
                sx={{ mb: 0 }}
                value={form.authDomain || ""}
                onChange={handleFormChange("authDomain")}
              />
              <TextField
                fullWidth
                label={t("storageBucket")}
                sx={{ mb: 0 }}
                value={form.storageBucket || ""}
                onChange={handleFormChange("storageBucket")}
              />
            </Box>
            <TextField
              fullWidth
              label={t("appId")}
              sx={{ mt: 2 }}
              value={form.appId || ""}
              onChange={handleFormChange("appId")}
            />
          </Box>
        )}

        {selectedSource === "Google Sheets" && (
          <Box
            sx={{
              mt: 3,
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              color="primary.main"
              fontWeight="bold"
            >
              {t("googleSheets")} {t("connectionDetails")}
            </Typography>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                fullWidth
                label={t("spreadsheetId")}
                sx={{ mb: 0 }}
                value={form.spreadsheetId || ""}
                onChange={handleFormChange("spreadsheetId")}
              />
              <TextField
                fullWidth
                label={t("sheetName")}
                sx={{ mb: 0 }}
                value={form.sheetName || ""}
                onChange={handleFormChange("sheetName")}
              />
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mt: 2,
              }}
            >
              <TextField
                fullWidth
                label={t("clientEmail")}
                sx={{ mb: 0 }}
                value={form.clientEmail || ""}
                onChange={handleFormChange("clientEmail")}
              />
              <TextField
                fullWidth
                label={t("privateKey")}
                multiline
                rows={4}
                sx={{ mb: 0 }}
                value={form.privateKey || ""}
                onChange={handleFormChange("privateKey")}
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: "bold",
          }}
        >
          {t("cancel")}
        </Button>
        {mode === "edit" ? (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: "bold",
              background: (theme) => theme.palette.primary.main,
              "&:hover": {
                background: (theme) => theme.palette.primary.main,
              },
            }}
          >
            {loading ? t("saving") || "Saving..." : t("edit")}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: "bold",
              background: (theme) => theme.palette.primary.main,
              "&:hover": {
                background: (theme) => theme.palette.primary.main,
              },
            }}
          >
            {loading ? t("saving") || "Saving..." : t("save")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddEditOtherSourcesModal;
