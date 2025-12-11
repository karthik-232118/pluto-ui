import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Link as LinkIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddEditOtherSourcesModal from "./AddEditOtherSourcesModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  GetAllDataSourceByTypeApi,
  GetAllDataSourceByIdApi,
} from "../../../services/dashboardBuilder/DashboardBuilder";

const OtherSources = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSource, setSelectedSource] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editInitialValues, setEditInitialValues] = useState(undefined);
  const [dataSources, setDataSources] = useState([]);
  const [selectedDataSourceId, setSelectedDataSourceId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteDataSourceId, setDeleteDataSourceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchOtherDataSources = async () => {
      setLoading(true);
      try {
        const response = await GetAllDataSourceByTypeApi({
          DataSourceType: "Other Data Sources",
        });
        const apiData = response?.data?.data || [];
        // Map API data to card format
        const mapped = apiData.map((item) => ({
          id: item.DataSourceID,
          name: item.DataSourceName || "",
          type: item.DataSourceType || "",
          status: item.IsActive ? "connected" : "not connected",
          color:
            item.DataSourceName === "SFTP"
              ? "#3498db"
              : item.DataSourceName === "Firebase"
              ? "#FFCA28"
              : item.DataSourceName === "Google Sheets"
              ? "#0F9D58"
              : "#888",
          // Add other fields if needed
        }));
        setDataSources(mapped);
        console.log("Other Data Sources API response:", apiData);
      } catch (error) {
        console.error("Error fetching Other Data Sources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOtherDataSources();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddConnection = () => {
    setOpenDialog(true);
    setEditIndex(null);
    setEditInitialValues(undefined);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSource("");
    setEditIndex(null);
    setEditInitialValues(undefined);
  };

  const handleSourceSelect = (event) => {
    setSelectedSource(event.target.value);
  };

  // Edit handler: open modal with selected source data
  const handleEdit = async (index) => {
    const src = dataSources[index];
    console.log("Edit DataSourceID:", src.id);
    setSelectedDataSourceId(src.id);
    setEditLoading(true);
    try {
      const response = await GetAllDataSourceByIdApi({ DataSourceID: src.id });
      const apiData = response?.data?.data;
      console.log("GetAllDataSourceByIdApi response:", apiData);
      setSelectedSource(apiData?.DataSourceName || "");
      setEditInitialValues(apiData?.DataSourceConfigData || {});
    } catch (error) {
      console.error("Error fetching DataSource by ID:", error);
      setSelectedSource(
        src.name === t("sftp")
          ? "SFTP"
          : src.name === t("firebase")
          ? "Firebase"
          : "Google Sheets"
      );
      setEditInitialValues({
        ...src.details,
      });
    } finally {
      setEditLoading(false);
    }
    setEditIndex(index);
    setOpenDialog(true);
  };

  // Save handler: update if editing, else add
  const handleSaveSource = (newSource) => {
    if (editIndex !== null) {
      setDataSources((prev) =>
        prev.map((src, idx) =>
          idx === editIndex
            ? {
                ...src,
                ...newSource,
                status: src.status,
                color:
                  newSource.name === t("sftp")
                    ? "#3498db"
                    : newSource.name === t("firebase")
                    ? "#FFCA28"
                    : "#0F9D58",
              }
            : src
        )
      );
    } else {
      setDataSources((prev) => [
        ...prev,
        {
          ...newSource,
          id: prev.length + 1,
          status: "connected",
          color:
            newSource.name === t("sftp")
              ? "#3498db"
              : newSource.name === t("firebase")
              ? "#FFCA28"
              : "#0F9D58",
        },
      ]);
    }
    setOpenDialog(false);
    setSelectedSource("");
    setEditIndex(null);
    setEditInitialValues(undefined);
  };

  // Dummy handler for delete
  const handleDelete = (index) => {
    const src = dataSources[index];
    setDeleteDataSourceId(src.id);
    setDeleteModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    setDataSources((prev) =>
      prev.filter((src) => src.id !== deleteDataSourceId)
    );
    setDeleteDataSourceId(null);
    setDeleteModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setDeleteDataSourceId(null);
  };

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      {/* Header with back button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            mr: 2,
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "550",
              color: "primary.main",
              fontSize: isMobile ? "1.5rem" : "1.5rem",
            }}
          >
            {t("otherDataSources")}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddConnection}
            sx={{ borderRadius: 2 }}
            disabled={loading}
          >
            {t("addConnection")}
          </Button>
        </Box>
      </Box>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{ mb: 3, color: "text.secondary", maxWidth: "800px" }}
      >
        {t("dataSourcesDescription")}
      </Typography>

      {/* Loading state */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {/* Action buttons */}
          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            {/* <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              sx={{ borderRadius: 2 }}
            >
              Manage Connections
            </Button> */}
          </Box>

          {/* Data source cards grid */}
          <Grid container spacing={3}>
            {dataSources.map((source, idx) => (
              <Grid item xs={12} sm={6} md={4} key={source.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box
                        sx={{
                          backgroundColor: source.color,
                          borderRadius: "50%",
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        <CloudIcon sx={{ color: "white" }} />
                      </Box>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: "bold" }}
                      >
                        {source.name}
                      </Typography>
                      <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(idx)}
                          disabled={editLoading}
                        >
                          {editLoading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <EditIcon />
                          )}
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(idx)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={source.type}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                      <Chip
                        label={source.status}
                        size="small"
                        color={
                          source.status === "connected" ? "success" : "default"
                        }
                        sx={{ borderRadius: 1 }}
                      />
                    </Box>

                    <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        startIcon={<SettingsIcon />}
                      >
                        {t("configure")}
                      </Button>
                      {source.status === "not connected" && (
                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          startIcon={<LinkIcon />}
                          color="primary"
                        >
                          {t("connect")}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Add Connection Modal */}
      <AddEditOtherSourcesModal
        open={openDialog}
        onClose={handleCloseDialog}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        selectedDataSourceId={selectedDataSourceId}
        onSave={handleSaveSource}
        initialValues={editInitialValues}
        mode={editIndex !== null ? "edit" : "add"}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        selectedDataSourceId={deleteDataSourceId}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </Box>
  );
};

export default OtherSources;