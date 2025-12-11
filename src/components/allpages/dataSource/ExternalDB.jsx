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
  Storage as DatabaseIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Link as LinkIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddConnectionDialog from "./AddConnectionDialog";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { GetAllDataSourceByTypeApi } from "../../../services/dashboardBuilder/DashboardBuilder";
import { GetAllDataSourceByIdApi } from "../../../services/dashboardBuilder/DashboardBuilder";

const ExternalDB = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { t } = useTranslation();
  const [selectedDb, setSelectedDb] = useState("");
  const [editDbIndex, setEditDbIndex] = useState(null);
  const [databases, setDatabases] = useState([]);
  const [editInitialValues, setEditInitialValues] = useState(undefined);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchExternalDatabases = async () => {
      try {
        setLoading(true); // Start loading
        const payload = { DataSourceType: "External Databases" };
        const response = await GetAllDataSourceByTypeApi(payload);
        const apiData = response?.data?.data || [];
        const mapped = apiData.map((item, idx) => ({
          id: item.DataSourceID,
          name: item.DataSourceName,
          type: "External Databases",
          status: item.IsActive ? "connected" : "not connected",
          color: "#336791",
          description: item.DataSourceDescription,
        }));
        setDatabases(mapped);
      } catch (error) {
        console.error("Error fetching External Databases:", error);
      } finally {
        setLoading(false); // Stop loading regardless of success/error
      }
    };
    fetchExternalDatabases();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddConnection = () => {
    setOpenDialog(true);
  };

  const handleEdit = async (index) => {
    const dataSourceId = databases[index].id;
    try {
      setLoading(true); // Start loading for edit
      const response = await GetAllDataSourceByIdApi({
        DataSourceID: dataSourceId,
      });
      const data = response?.data?.data;
      console.log("GetAllDataSourceByIdApi response:", data);

      // Map API data to modal initial values
      if (data && data.DataSourceConfigData) {
        setSelectedDb(data.DataSourceName || "");
        setEditDbIndex(index);
        setEditInitialValues({
          host: data.DataSourceConfigData.host || "",
          port: data.DataSourceConfigData.port || "",
          dbName: data.DataSourceConfigData.databasename || "",
          username: data.DataSourceConfigData.userName || "",
          password: data.DataSourceConfigData.passwoard || "",
          id: data.DataSourceID,
          description: data.DataSourceDescription || "",
        });
        setOpenDialog(true);
      }
    } catch (error) {
      console.error("Error calling GetAllDataSourceByIdApi:", error);
    } finally {
      setLoading(false); // Stop loading for edit
    }
  };

  const handleDelete = (index) => {
    setSelectedDeleteId(databases[index].id);
    setDeleteModalOpen(true);
  };

  const refreshDatabases = async () => {
    try {
      setLoading(true); // Start loading for refresh
      const payload = { DataSourceType: "External Databases" };
      const response = await GetAllDataSourceByTypeApi(payload);
      const apiData = response?.data?.data || [];
      const mapped = apiData.map((item, idx) => ({
        id: item.DataSourceID,
        name: item.DataSourceName,
        type: "External Databases",
        status: item.IsActive ? "connected" : "not connected",
        color: "#336791",
        description: item.DataSourceDescription,
      }));
      setDatabases(mapped);
    } catch (error) {
      console.error("Error fetching External Databases:", error);
    } finally {
      setLoading(false); // Stop loading for refresh
    }
  };

  const handleAddConnectionData = (newDb) => {
    if (editDbIndex !== null) {
      setDatabases((prev) =>
        prev.map((db, i) =>
          i === editDbIndex
            ? {
                ...db,
                ...newDb,
                name: newDb.name,
                type: newDb.type,
                status: db.status, // keep status
                color:
                  newDb.type === "NoSQL"
                    ? "#47A248"
                    : newDb.name.toLowerCase().includes("maria")
                    ? "#003545"
                    : newDb.name.toLowerCase().includes("mysql")
                    ? "#00758F"
                    : "#336791",
              }
            : db
        )
      );
    } else {
      // Add mode
      setDatabases((prev) => [
        ...prev,
        {
          ...newDb,
          id: prev.length + 1,
          status: "connected",
          color:
            newDb.type === "NoSQL"
              ? "#47A248"
              : newDb.name.toLowerCase().includes("maria")
              ? "#003545"
              : newDb.name.toLowerCase().includes("mysql")
              ? "#00758F"
              : "#336791",
        },
      ]);
    }
    setOpenDialog(false);
    setSelectedDb("");
    setEditDbIndex(null);
    setEditInitialValues(undefined);
  };

  const getEditInitialValues = () => {
    if (editInitialValues) return editInitialValues;
    if (editDbIndex !== null) {
      const db = databases[editDbIndex];
      return {
        host: db.host || "",
        port: db.port || "",
        dbName: db.dbName || "",
        username: db.username || "",
        password: db.password || "",
        id: db.id,
        description: db.description || "",
      };
    }
    return undefined;
  };

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
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
            {t("externalDatabases")}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddConnection}
            sx={{ borderRadius: 2 }}
          >
            {t("addConnection")}
          </Button>
        </Box>
      </Box>
      <Typography
        variant="body1"
        sx={{ mb: 3, color: "text.secondary", maxWidth: "800px" }}
      >
        {t("externalDatabasesdescription")}
      </Typography>

      {/* Loader */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Database Grid */}
      {!loading && (
        <Grid container spacing={3}>
          {databases.map((db, idx) => (
            <Grid item xs={12} sm={6} md={4} key={db.id}>
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
                        backgroundColor: db.color,
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      <DatabaseIcon sx={{ color: "white" }} />
                    </Box>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: "bold" }}
                    >
                      {db.name}
                    </Typography>
                    <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(idx)}
                      >
                        <EditIcon />
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

                  {db.description && (
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      {db.description}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Chip
                      label={db.type}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                    <Chip
                      label={db.status}
                      size="small"
                      color={db.status === "connected" ? "success" : "default"}
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
                    {db.status === "not connected" && (
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
      )}

      {/* Empty State */}
      {!loading && databases.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            textAlign: "center",
          }}
        >
          <DatabaseIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t("noDatabasesFound")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("addYourFirstDatabaseConnection")}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddConnection}
          >
            {t("addConnection")}
          </Button>
        </Box>
      )}

      {/* Add Connection Dialog */}
      <AddConnectionDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedDb("");
          setEditDbIndex(null);
          setEditInitialValues(undefined);
        }}
        selectedDb={selectedDb}
        onDbSelect={(e) => setSelectedDb(e.target.value)}
        onAddConnection={handleAddConnectionData}
        initialValues={getEditInitialValues()}
        mode={editDbIndex !== null ? "edit" : "add"}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedDataSourceId={selectedDeleteId}
        onDeleteSuccess={() => {
          setDeleteModalOpen(false);
          setSelectedDeleteId(null);
          refreshDatabases();
        }}
      />
    </Box>
  );
};

export default ExternalDB;
  