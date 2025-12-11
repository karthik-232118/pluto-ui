import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useHeadingBgColor } from "../../useHeadingBgColor";
import { useTranslation } from "react-i18next";
import { GetAllDashboardsApi } from "../../../services/dashboardBuilder/DashboardBuilder";

const StyledDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    width: 420,
    background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
  },
});

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: "8px !important",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: theme.spacing(0, 0, 2, 0),
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: "#f8f9fa",
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  "& .MuiAccordionSummary-content": {
    alignItems: "center",
    gap: theme.spacing(1),
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1, 2),
}));

const SettingsDrawer = ({
  open,
  onClose,
  selectedItem,
  onConfigChange,
  onSave,
  componentTypes,
  onSourceDataSelect,
  onSaveChart,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState("dataSettings");
  const [dataSource, setDataSource] = useState(
    selectedItem?.config?.dataSource || "static"
  );
  const staticData = selectedItem?.config?.data || [];
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editLabel, setEditLabel] = useState("");

  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const bgColor = useHeadingBgColor();
  const HeaderPaper = styled(Paper)(({ theme }) => ({
    background: bgColor,
    color: "white",
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    borderRadius: 0,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  }));

  // Store fetched source data
  const [sourceDataList, setSourceDataList] = useState([]);

  const handleConfigChange = (key, value) => {
    if (selectedItem && onConfigChange) {
      onConfigChange(key, value);
    }
  };

  const handleDataSourceChange = (event) => {
    const value = event.target.value;
    setDataSource(value);
    handleConfigChange("dataSource", value);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleStaticDataChange = (newData) => {
    handleConfigChange("data", newData);
  };

  const handleEditClick = (idx) => {
    setEditIndex(idx);
    setEditValue(staticData[idx]?.value ?? "");
    setEditLabel(staticData[idx]?.label ?? "");
  };

  const handleEditSave = (idx) => {
    const updated = staticData.map((item, i) =>
      i === idx ? { ...item, value: editValue, label: editLabel } : item
    );
    handleStaticDataChange(updated);
    setEditIndex(null);
    setEditValue("");
    setEditLabel("");
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditValue("");
    setEditLabel("");
  };

  const handleDeleteStaticData = (idx) => {
    const updated = staticData.filter((_, i) => i !== idx);
    handleStaticDataChange(updated);
  };

  const handleAddStaticData = () => {
    if (newValue !== "") {
      const updated = [...staticData, { value: newValue, label: newLabel }];
      handleStaticDataChange(updated);
      setNewValue("");
      setNewLabel("");
    }
  };

  const apiEndpoints = [
    { label: "Users API", value: "https://api.example.com/users" },
    { label: "Orders API", value: "https://api.example.com/orders" },
    { label: "Products API", value: "https://api.example.com/products" },
  ];

  const sourceDataOptions = [
    { label: "Source 1", value: "source1" },
    { label: "Source 2", value: "source2" },
    { label: "Source 3", value: "source3" },
  ];

  const handleGetAllDashboards = async () => {
    try {
      const response = await GetAllDashboardsApi({});
      const data = response?.data?.data || [];
      setSourceDataList(data);
      console.log("GetAllDashboardsApi response:", data);
    } catch (error) {
      console.error("GetAllDashboardsApi error:", error);
    }
  };

  useEffect(() => {
    if (open) {
      handleGetAllDashboards();
    }
  }, [open]);

  const handleSourceDataSelect = (dataSourceId) => {
    if (onSourceDataSelect) {
      onSourceDataSelect(dataSourceId);
    }
    // Optionally keep the local console for debugging:
    console.log("Selected DataSourceID:", dataSourceId);
  };

  const handleSaveClick = () => {
    if (onSaveChart && selectedItem) {
      const payload = {
        ChartName: selectedItem.config?.title || "Untitled Chart",
        ChartDescription: selectedItem.config?.description || "No description",
        ChartType: selectedItem.type?.name || "Unknown",
        ChartConfigData: {
          ...selectedItem.config,
          xAxis: selectedItem.config?.xAxis || "Default X-Axis",
          yAxis: selectedItem.config?.yAxis || "Default Y-Axis",
        },
        UsedDataSourceID: selectedItem.config?.sourceData || null,
      };
      onSaveChart(payload);
    }
    onSave();
  };

  return (
    <StyledDrawer anchor="right" open={open} onClose={onClose}>
      <HeaderPaper elevation={0}>
        <SettingsIcon sx={{ fontSize: 28 }} />
        <Typography variant="h6" fontWeight="600">
          {t("componentSettings")}
        </Typography>
        <Chip
          label={selectedItem?.type?.name || "Component"}
          size="small"
          sx={{
            marginLeft: "auto",
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: 500,
          }}
        />
      </HeaderPaper>

      {selectedItem && (
        <Box sx={{ p: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Title"
              value={selectedItem.config?.title || ""}
              onChange={(e) => handleConfigChange("title", e.target.value)}
              variant="outlined"
              size="small"
            />
          </FormControl>

          {/* New fields for X-Axis and Y-Axis */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="X-Axis"
              value={selectedItem.config?.xAxis || ""}
              onChange={(e) => handleConfigChange("xAxis", e.target.value)}
              variant="outlined"
              size="small"
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Y-Axis"
              value={selectedItem.config?.yAxis || ""}
              onChange={(e) => handleConfigChange("yAxis", e.target.value)}
              variant="outlined"
              size="small"
            />
          </FormControl>

          <StyledAccordion
            expanded={expanded === "dataSettings"}
            onChange={handleAccordionChange("dataSettings")}
          >
            <StyledAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="data-settings-content"
              id="data-settings-header"
            >
              <Typography fontWeight="500">{t("dataSource")}</Typography>
            </StyledAccordionSummary>
            <AccordionDetails sx={{ pt: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {t("selectDataInstruction")}
              </Typography>

              {/* Three radio buttons for data source */}
              <RadioGroup
                value={dataSource}
                onChange={handleDataSourceChange}
                name="data-source-group"
                sx={{ mb: 2, mt: 1 }}
              >
                {/* <FormControlLabel
                  value="static"
                  control={<Radio color="primary" />}
                  label={t("staticData")}
                /> */}
                {/* <FormControlLabel
                  value="api"
                  control={<Radio color="primary" />}
                  label={t("API Data")}
                /> */}
                <FormControlLabel
                  value="source"
                  control={<Radio color="primary" />}
                  label="Source Data"
                />
              </RadioGroup>

              <Divider sx={{ my: 2 }} />

              {/* Static Data Editor */}
              {dataSource === "static" && (
                <>
                  {/* Show for all chart types that support static data */}
                  {[
                    "card",
                    "barChart",
                    "pieChart",
                    "donutChart",
                    "areaChart",
                    "radarChart",
                    "funnelChart",
                    "scatterChart",
                  ].includes(selectedItem.type?.id) && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="500"
                        sx={{ mb: 1 }}
                      >
                        {t("staticData")}
                      </Typography>

                      {/* List static data items */}
                      {staticData.length === 0 ? (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6c757d",
                            mb: 2,
                            fontStyle: "italic",
                          }}
                        >
                          {t("noStaticData")}
                        </Typography>
                      ) : (
                        <List dense sx={{ mb: 2 }}>
                          {staticData.map((item, idx) => (
                            <ListItem
                              key={idx}
                              sx={{
                                backgroundColor:
                                  editIndex === idx ? "#e3f2fd" : "transparent",
                                borderRadius: 1,
                                mb: 0.5,
                              }}
                            >
                              {editIndex === idx ? (
                                <>
                                  <TextField
                                    size="small"
                                    label={t("Label")}
                                    value={editLabel}
                                    onChange={(e) =>
                                      setEditLabel(e.target.value)
                                    }
                                    sx={{ mr: 1, flex: 1 }}
                                  />
                                  <TextField
                                    size="small"
                                    label={t("Value")}
                                    value={editValue}
                                    onChange={(e) =>
                                      setEditValue(e.target.value)
                                    }
                                    sx={{ mr: 1, flex: 1 }}
                                  />
                                  <Tooltip title={t("saveChanges")}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEditSave(idx)}
                                      color="primary"
                                    >
                                      <SaveIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title={t("cancel")}>
                                    <IconButton
                                      size="small"
                                      onClick={handleEditCancel}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <>
                                  <ListItemText
                                    primary={item.label || `Item ${idx + 1}`}
                                    secondary={`Value: ${item.value}`}
                                    sx={{ flex: 1 }}
                                  />
                                  <ListItemSecondaryAction>
                                    <Tooltip title={t("edit")}>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleEditClick(idx)}
                                        sx={{ mr: 0.5 }}
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t("delete")}>
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleDeleteStaticData(idx)
                                        }
                                        color="error"
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </ListItemSecondaryAction>
                                </>
                              )}
                            </ListItem>
                          ))}
                        </List>
                      )}

                      {/* Add new static data */}
                      <Typography
                        variant="subtitle2"
                        fontWeight="500"
                        sx={{ mb: 1, mt: 2 }}
                      >
                        {t("addNewDataItem")}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <TextField
                          size="small"
                          label={t("Label")}
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          fullWidth
                        />
                        <TextField
                          size="small"
                          label={t("Value")}
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          fullWidth
                        />
                        <Tooltip title={t("Add Item")}>
                          <IconButton
                            onClick={handleAddStaticData}
                            color="primary"
                            disabled={!newValue}
                            sx={{
                              backgroundColor: "primary.main",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "primary.dark",
                              },
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}

                  {/* Card specific fields */}
                  {selectedItem.type?.id === "card" && (
                    <>
                      <TextField
                        fullWidth
                        label="Value"
                        value={selectedItem.config?.value || ""}
                        onChange={(e) =>
                          handleConfigChange("value", e.target.value)
                        }
                        sx={{ mb: 2 }}
                        size="small"
                      />
                      <TextField
                        fullWidth
                        label="Subtitle"
                        value={selectedItem.config?.subtitle || ""}
                        onChange={(e) =>
                          handleConfigChange("subtitle", e.target.value)
                        }
                        sx={{ mb: 2 }}
                        size="small"
                      />
                    </>
                  )}
                </>
              )}

              {/* API Data Dropdown */}
              {dataSource === "api" && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{t("apiEndpoint")}</InputLabel>
                  <Select
                    value={selectedItem.config?.apiEndpoint || ""}
                    label={t("apiEndpoint")}
                    onChange={(e) =>
                      handleConfigChange("apiEndpoint", e.target.value)
                    }
                    size="small"
                  >
                    {apiEndpoints.map((api) => (
                      <MenuItem key={api.value} value={api.value}>
                        {api.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Source Data Dropdown */}
              {dataSource === "source" && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Source Data</InputLabel>
                  <Select
                    value={selectedItem.config?.sourceData || ""}
                    label="Source Data"
                    onChange={(e) => {
                      handleConfigChange("sourceData", e.target.value);
                      handleSourceDataSelect(e.target.value);
                    }}
                    size="small"
                  >
                    {sourceDataList.map((src) => (
                      <MenuItem key={src.DataSourceID} value={src.DataSourceID}>
                        {src.DataSourceName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </AccordionDetails>
          </StyledAccordion>
          <StyledAccordion
            expanded={expanded === "componentSettings"}
            onChange={handleAccordionChange("componentSettings")}
          >
            <StyledAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="component-settings-content"
              id="component-settings-header"
            >
              <Typography fontWeight="500">
                {t("componentConfiguration")}
              </Typography>
            </StyledAccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t("componentType")}</InputLabel>
                <Select
                  value={selectedItem.type?.id || ""}
                  label={t("componentType")}
                  disabled
                  size="small"
                >
                  {componentTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </StyledAccordion>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: 3,
              pt: 2,
              borderTop: "1px solid #e9ecef",
            }}
          >
            <ActionButton onClick={onClose} variant="outlined" color="inherit">
              {t("cancel")}
            </ActionButton>
            <ActionButton
              variant="contained"
              onClick={handleSaveClick} // Use the new handler
              sx={{
                background: bgColor,
                "&:hover": {
                  background: bgColor,
                },
              }}
            >
              {t("saveChanges")}
            </ActionButton>
          </Box>
        </Box>
      )}
    </StyledDrawer>
  );
};

export default SettingsDrawer;
