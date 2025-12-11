import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Check as CheckIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddDatasetModal from "./AddDatasetModal";
import ExternalAPIModal from "./ExternalAPIModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useTranslation } from "react-i18next";
import {
  GetAllDataSourceByTypeApi,
  GetAllDataSourceByIdApi,
} from "../../../services/dashboardBuilder/DashboardBuilder";
// import { GetAllDataSourceByTypeApi } from "path-to-your-api-service"; // <-- Update with actual path

const ExternalAPI = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDataset, setEditingDataset] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dataSets, setDataSets] = useState([]); 
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchExternalAPIs = async () => {
      try {
        setLoading(true)
        const payload = { DataSourceType: "External API" };
        const response = await GetAllDataSourceByTypeApi(payload);
        const apiData = response?.data?.data || [];
        // Map API data to table format
        const mappedData = apiData.map((item) => ({
          id: item.DataSourceID,
          name: item.DataSourceName,
          description: item.DataSourceDescription,
          method: item.DataSourceType, // or use another field if needed
          actions: ["view", "edit"],
        }));
        setDataSets(mappedData);
      } catch (error) {
        console.error("Error fetching External API data:", error);
      }finally{
        setLoading(false)
      }
    };
    fetchExternalAPIs();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleOpenModal = () => {
    setEditingDataset(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDataset(null);
  };

  const handleEdit = async (dataset) => {
    console.log("Edit DataSourceID:", dataset.id);
    try {
        setEditLoading(true);
      const payload = { DataSourceID: dataset.id };
      const response = await GetAllDataSourceByIdApi(payload);
      const data = response?.data?.data;
      if (data) {
        // Map API response to modal form fields
        setEditingDataset({
          id: data.DataSourceID,
          name: data.DataSourceName || "",
          description: data.DataSourceDescription || "",
          method: data.DataSourceConfig?.method || "GET",
          apiUrl: data.DataSourceConfig?.apiUrl || "",
          headers: data.DataSourceConfig?.headers || "",
          mappingKey: data.DataSourceConfig?.mappingKey || "",
          payload: data.DataSourceConfig?.payload || "",
        });
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching data by ID:", error);
    }finally{
      setEditLoading(true)
    }
  };

  const handleDelete = (dataset) => {
    setSelectedDeleteId(dataset.id);
    setDeleteModalOpen(true);
  };

  const handleSaveDataset = (newDataset) => {
    if (editingDataset) {
      setDataSets(
        dataSets.map((ds) =>
          ds.name === editingDataset.name
            ? { ...newDataset, actions: ["view", "edit"] }
            : ds
        )
      );
      setSnackbar({
        open: true,
        message: "Dataset updated successfully!",
        severity: "success",
      });
    } else {
      setDataSets([...dataSets, { ...newDataset, actions: ["view", "edit"] }]);
      setSnackbar({
        open: true,
        message: "Dataset added successfully!",
        severity: "success",
      });
    }
  };

  const handleDeleteSuccess = () => {
    setDeleteModalOpen(false);
    setSelectedDeleteId(null);
    // Optionally refresh table here, e.g. re-fetch data or remove from state
    setDataSets(dataSets.filter((ds) => ds.id !== selectedDeleteId));
  };

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 3,
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Go back">
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
          </Tooltip>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: "550",
              color: "primary.main",
              fontSize: isMobile ? "1.5rem" : "1.5rem",
            }}
          >
            {t("externalApi")}
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          {t("addNewExternalApi")}
        </Button>
      </Box>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="data sets table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    py: 2,
                    fontSize: "1rem",
                  }}
                >
                  {t("name")}
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    py: 2,
                    fontSize: "1rem",
                  }}
                >
                  {t("description")}
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    py: 2,
                    fontSize: "1rem",
                  }}
                >
                  {t("apiType")}
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    py: 2,
                    fontSize: "1rem",
                  }}
                >
                  {t("actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

                 {loading && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <CircularProgress size={40} />
                     
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {!loading && dataSets.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "#f5f5f5", opacity: 0.9 },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ py: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>{row.description}</TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={row.method}
                      color="secondary"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(row)}
                          sx={{
                            color: "info.main",
                            backgroundColor: "info.light",
                            "&:hover": {
                              backgroundColor: "info.main",
                              color: "white",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(row)}
                          sx={{
                            color: "error.main",
                            backgroundColor: "error.light",
                            "&:hover": {
                              backgroundColor: "error.main",
                              color: "white",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <ExternalAPIModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDataset}
        editingDataset={editingDataset}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedDataSourceId={selectedDeleteId}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </Box>
  );
};

export default ExternalAPI;
