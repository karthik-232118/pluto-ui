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
  CircularProgress, // add this import
} from "@mui/material";
import {
  Check as CheckIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddDatasetModal from "./AddDatasetModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useTranslation } from "react-i18next";
import {
  SaveUploadedDashboardApi,
  GetAllDataSourceByTypeApi,
  GetAllDataSourceByIdApi,
  UpdateDataSourceApi,
} from "../../../services/dashboardBuilder/DashboardBuilder";

const InternalDB = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDataset, setEditingDataset] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const { t } = useTranslation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [dataSets, setDataSets] = useState([]);
  const [loading, setLoading] = useState(false); // add loading state

  useEffect(() => {
    setLoading(true); // start loading
    GetAllDataSourceByTypeApi({ DataSourceType: "Internal DB" })
      .then((res) => {
        const apiData = res?.data?.data || [];
        setDataSets(
          apiData.map((item) => ({
            id: item.DataSourceID,
            name: item.DataSourceName,
            description: item.DataSourceDescription,
            queryType: "DB Query",
            dbType: item.DataSourceType,
            actions: ["view", "edit"],
          }))
        );
      })
      .catch((err) => {
        console.error("GetAllDataSourceByTypeApi error:", err);
      })
      .finally(() => {
        setLoading(false); // stop loading
      });
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
    try {
      const res = await GetAllDataSourceByIdApi({ DataSourceID: dataset.id });
      const data = res?.data?.data;
      console.log("Fetched dataset for editing:", data);
      setEditingDataset({
        id: data?.DataSourceID,
        name: data?.DataSourceName || "",
        description: data?.DataSourceDescription || "",
        queryType: "DB Query",
        dbType: data?.DataSourceType || "Internal DB",
        sqlQuery:
          Array.isArray(data?.DataSourceOutputData) &&
          data.DataSourceOutputData.length > 0
            ? data.DataSourceOutputData[0].sqlQuery || ""
            : "",
      });
      setModalOpen(true);
    } catch (err) {
      console.error("GetAllDataSourceByIdApi error:", err);
    }
  };

  const handleSaveDataset = async (newDataset) => {
    if (editingDataset) {
      const payload = {
        DataSourceID: editingDataset.id,
        DataSourceName: newDataset.name,
        DataSourceDescription: newDataset.description,
        DataSourceType: "Internal DB",
        DataSourceOutputData: [
          {
            queryType: newDataset.queryType,
            dbType: newDataset.dbType,
            sqlQuery: newDataset.sqlQuery,
          },
        ],
      };

      try {
        await UpdateDataSourceApi(payload);
        setSnackbar({
          open: true,
          message: "Dataset updated successfully!",
          severity: "success",
        });
        setDataSets(
          dataSets.map((ds) =>
            ds.id === editingDataset.id
              ? {
                  ...newDataset,
                  id: editingDataset.id,
                  actions: ["view", "edit"],
                }
              : ds
          )
        );
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to update dataset.",
          severity: "error",
        });
      }
    } else {
      const payload = {
        DataSourceName: newDataset.name,
        DataSourceDescription: newDataset.description,
        DataSourceType: "Internal DB",
        DataSourceOutputData: [
          {
            queryType: newDataset.queryType,
            dbType: newDataset.dbType,
            sqlQuery: newDataset.sqlQuery,
          },
        ],
      };

      try {
        await SaveUploadedDashboardApi(payload);
        setSnackbar({
          open: true,
          message: "Dataset saved to server successfully!",
          severity: "success",
        });
        setDataSets([
          ...dataSets,
          { ...newDataset, actions: ["view", "edit"] },
        ]);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to save dataset to server.",
          severity: "error",
        });
      }
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDelete = (dataset) => {
    setSelectedDeleteId(dataset.id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedDeleteId(null);
  };

  const handleDeleteSuccess = () => {
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
            {t("internalDB_title")}
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          {t("addNewDataset")}
        </Button>
      </Box>

      {/* Table container */}
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
                  {t("table_name")}
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    py: 2,
                    fontSize: "1rem",
                  }}
                >
                  {t("table_description")}
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    py: 2,
                    fontSize: "1rem",
                  }}
                >
                  {t("table_queryType")}
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    py: 2,
                    fontSize: "1rem",
                  }}
                >
                  {t("table_dbType")}
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    py: 2,
                    fontSize: "1rem",
                  }}
                >
                  {t("table_actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : dataSets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" color="text.secondary">
                      {t("no_data_found") || "No data found."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                dataSets.map((row, index) => (
                  <TableRow
                    key={index}
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
                        label={row.queryType}
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip label={row.dbType} color="primary" size="small" />
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
                            sx={{
                              color: "error.main",
                              backgroundColor: "error.light",
                              "&:hover": {
                                backgroundColor: "error.main",
                                color: "white",
                              },
                            }}
                            onClick={() => handleDelete(row)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Dataset Modal */}
      <AddDatasetModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDataset}
        editingDataset={editingDataset}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        selectedDataSourceId={selectedDeleteId}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InternalDB;
