import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Container,
  Paper,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { useHeadingBgColor } from "../../useHeadingBgColor";
import {
  ArrowBack,
  CloudUpload,
  Download,
  Edit,
  Delete,
  Save,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import {
  SaveUploadedDashboardApi,
  GetAllDataSourceByTypeApi,
} from "../../../services/dashboardBuilder/DashboardBuilder";
import {
  GetAllDataSourceByIdApi,
  UpdateDataSourceApi,
} from "../../../services/dashboardBuilder/DashboardBuilder";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const UploadDB = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingRowIdx, setEditingRowIdx] = useState(null);
  const [editingRowData, setEditingRowData] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [selectedDataSource, setSelectedDataSource] = useState("");
  const [selectedDataSourceId, setSelectedDataSourceId] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const bgColor = useHeadingBgColor();
  const { t } = useTranslation();

  // Fetch data sources by type
  const fetchDataSources = useCallback(() => {
    GetAllDataSourceByTypeApi({ DataSourceType: "Upload File" })
      .then((res) => {
        setDataSources(res?.data?.data || []);
      })
      .catch((err) => {
        console.error("GetAllDataSourceByTypeApi error:", err);
      });
  }, []);

  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const prepareChartData = (data) => {
    if (!data || data.length < 2) return [];

    const headers = data[0];
    const rows = data.slice(1);
    const processedData = rows.map((row, index) => {
      const obj = { index: index + 1 };
      headers.forEach((header, headerIndex) => {
        const value = row[headerIndex];
        const numValue = parseFloat(value);
        obj[header || `Column ${headerIndex + 1}`] = isNaN(numValue)
          ? value
          : numValue;
      });
      return obj;
    });

    return processedData;
  };

  const processFile = (file) => {
    const fileType = file.name.split(".").pop().toLowerCase();
    if (fileType !== "csv" && fileType !== "xlsx" && fileType !== "xls") {
      toast.error("Only CSV and Excel files are allowed.");
      return;
    }

    setUploadedFile({
      name: file.name,
      type: fileType,
      size: file.size,
    });

    if (fileType === "csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text
          .split("\n")
          .filter((row) => row.trim() !== "")
          .map((row) => {
            return row.split(",").map((cell) => cell.trim());
          });
        setTableData(rows);
        setChartData(prepareChartData(rows));
      };
      reader.readAsText(file);
    } else if (fileType === "xlsx" || fileType === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const filteredJson = json.filter((row) =>
          row.some((cell) => cell !== undefined && cell !== null && cell !== "")
        );
        setTableData(filteredJson);
        setChartData(prepareChartData(filteredJson));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setTableData(null);
    setChartData([]);
  };

  const handleDeleteRow = (rowIdx) => {
    setTableData((prev) => {
      const newData = prev.filter((_, idx) => idx !== rowIdx);
      setChartData(prepareChartData(newData));
      return newData;
    });
  };

  const handleBack = () => {
    window.history.back();
  };

  const getDataTypeInfo = () => {
    if (!chartData || chartData.length === 0)
      return { numeric: 0, text: 0, total: 0 };
    const firstRow = chartData[0];
    const columns = Object.keys(firstRow).filter((key) => key !== "index");
    const numericCols = columns.filter(
      (key) => typeof firstRow[key] === "number"
    );
    const textCols = columns.filter((key) => typeof firstRow[key] === "string");
    return {
      numeric: numericCols.length,
      text: textCols.length,
      total: columns.length,
    };
  };

  const handleDownloadExcel = (filename = "data") => {
    if (!tableData || tableData.length === 0) return;

    const ws = XLSX.utils.aoa_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let dataSourceJson = [];
      if (tableData && tableData.length > 1) {
        const headers = tableData[0];
        const rows = tableData.slice(1);
        dataSourceJson = rows.map((row) => {
          const obj = {};
          headers.forEach((header, idx) => {
            obj[header || `Column${idx + 1}`] = row[idx];
          });
          return obj;
        });
      }

      const res = await SaveUploadedDashboardApi({
        DataSourceName: name,
        DataSourceDescription: description,
        DataSourceOutputData: dataSourceJson,
        DataSourceType: "upload file",
      });

      if (res?.success === 201 || res?.status === 201) {
        toast.success(res?.message || "Saved successfully!");
      } else {
        toast.error(res?.message || "Failed to save data!");
      }
    } catch (err) {
      const apiMsg = err?.response?.data?.message || "Something went wrong!";
      toast.error(apiMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleEditRow = (rowIdx) => {
    setEditingRowIdx(rowIdx);
    setEditingRowData([...tableData[rowIdx]]);
  };

  const handleEditCellChange = (cellIdx, value) => {
    setEditingRowData((prev) => {
      const updated = [...prev];
      updated[cellIdx] = value;
      return updated;
    });
  };

  const handleDoneEditRow = () => {
    setTableData((prev) => {
      const updated = prev.map((row, idx) =>
        idx === editingRowIdx ? editingRowData : row
      );
      setChartData(prepareChartData(updated));
      return updated;
    });
    setEditingRowIdx(null);
    setEditingRowData([]);
  };

  const handleDataSourceChange = (e) => {
    const selectedName = e.target.value;
    setSelectedDataSource(selectedName);
    const found = dataSources.find((ds) => ds.DataSourceName === selectedName);
    if (found) {
      setSelectedDataSourceId(found.DataSourceID); // Save ID for editing
      console.log("Selected DataSourceID:", found.DataSourceID);
      GetAllDataSourceByIdApi({ DataSourceID: found.DataSourceID })
        .then((res) => {
          const data = res?.data?.data;
          console.log("GetAllDataSourceByIdApi response:", data);
          setName(data?.DataSourceName || "");
          setDescription(data?.DataSourceDescription || "");
          if (
            data?.DataSourceOutputData &&
            Array.isArray(data.DataSourceOutputData) &&
            data.DataSourceOutputData.length > 0
          ) {
            const headers = Object.keys(data.DataSourceOutputData[0]);
            const rows = data.DataSourceOutputData.map((rowObj) =>
              headers.map((header) => rowObj[header] ?? "")
            );
            setTableData([headers, ...rows]);
            setChartData(prepareChartData([headers, ...rows]));
          } else {
            setTableData(null);
            setChartData([]);
          }
        })
        .catch((err) => {
          console.error("GetAllDataSourceByIdApi error:", err);
          setTableData(null);
          setChartData([]);
          setName("");
          setDescription("");
        });
    } else {
      setSelectedDataSourceId("");
      setName("");
      setDescription("");
      setTableData(null);
      setChartData([]);
    }
  };

  const handleEdit = async () => {
    if (!selectedDataSourceId) return;
    let dataSourceJson = [];
    if (tableData && tableData.length > 1) {
      const headers = tableData[0];
      const rows = tableData.slice(1);
      dataSourceJson = rows.map((row) => {
        const obj = {};
        headers.forEach((header, idx) => {
          obj[header || `Column${idx + 1}`] = row[idx];
        });
        return obj;
      });
    }
    try {
      const res = await UpdateDataSourceApi({
        DataSourceID: selectedDataSourceId,
        DataSourceName: name,
        DataSourceDescription: description,
        DataSourceType: "Upload File",
        DataSourceOutputData: dataSourceJson,
      });
      if (res?.success === 200 || res?.status === 200) {
        toast.success(res?.message || "Updated successfully!");
        fetchDataSources(); // Refresh data sources after edit
      } else {
        toast.error(res?.message || "Failed to update data!");
      }
    } catch (err) {
      const apiMsg = err?.response?.data?.message || "Something went wrong!";
      toast.error(apiMsg);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDelete = async () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteSuccess = () => {
    // Optionally refresh data sources or clear selection after delete
    setSelectedDataSource("");
    setSelectedDataSourceId("");
    setName("");
    setDescription("");
    setTableData(null);
    setChartData([]);
    fetchDataSources(); // Refresh data sources after delete
    // ...any other cleanup...
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <ToastContainer position="top-right" autoClose={4000} />
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${bgColor}33 0%, ${bgColor}11 100%)`,
          border: `1px solid ${bgColor}33`,
          borderRadius: 3,
          p: 3,
          mb: 3,
          boxShadow: `0 4px 24px 0 ${bgColor}22`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            pb: 2,
            borderBottom: `2px solid ${bgColor}33`,
          }}
        >
          <Tooltip title="Go back">
            <IconButton
              onClick={handleBack}
              sx={{
                background: `linear-gradient(135deg, ${bgColor}, ${bgColor}bb)`,
                color: "white",
                boxShadow: `0 2px 8px 0 ${bgColor}33`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${bgColor}cc, ${bgColor}99)`,
                  opacity: 0.95,
                },
              }}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              letterSpacing: 0,
              background: "#000",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `0 2px 8px ${bgColor}22`,
              textTransform: "uppercase",
            }}
          >
            {t("connectors_title")}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 3,
            fontSize: 14,
            fontWeight: 500,
            // letterSpacing: 0.5,
          }}
        >
          {t("connectors_subtitle")}
        </Typography>

        {/* Form Controls */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Select Data Source"
              value={selectedDataSource}
              onChange={handleDataSourceChange}
              fullWidth
              size="small"
              SelectProps={{
                native: true,
              }}
              sx={{ borderRadius: 1 }}
            >
              <option value=""> </option>
              {dataSources.map((ds) => (
                <option key={ds.DataSourceID} value={ds.DataSourceName}>
                  {ds.DataSourceName}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Name"
              variant="outlined"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              sx={{ borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Description"
              variant="outlined"
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              sx={{ borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            {/* Show Save if not editing, Edit if editing */}
            {selectedDataSourceId ? (
              <>
                <Button
                  variant="contained"
                  disabled={!name.trim() || !description.trim() || saving}
                  onClick={handleEdit}
                  startIcon={<Edit />}
                  fullWidth
                  sx={{
                    bgcolor: bgColor,
                    "&:hover": { bgcolor: bgColor, opacity: 0.9 },
                    py: 1,
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="contained"
                  onClick={handleDelete}
                  startIcon={<Delete />}
                  fullWidth
                  sx={{
                    borderColor: "error.main",
                    backgroundColor: "error.main",
                    "&:hover": {
                      borderColor: "red",
                      bgcolor: "red",
                      color: "white",
                    },
                    py: 1,
                    mt: 1,
                  }}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                disabled={
                  !uploadedFile || !name.trim() || !description.trim() || saving
                }
                onClick={handleSave}
                startIcon={saving ? <CircularProgress size={18} /> : <Save />}
                fullWidth
                sx={{
                  bgcolor: bgColor,
                  "&:hover": { bgcolor: bgColor, opacity: 0.9 },
                  py: 1,
                }}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Upload Section */}
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}>
        <Box
          sx={{
            bgcolor: `${bgColor}11`,
            p: 3,
            borderBottom: `4px solid ${bgColor}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              color: "text.primary",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: bgColor,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              1
            </Box>
            {t("upload_file")}
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              border: `2px dashed ${isDragging ? bgColor : "#D1D5DB"}`,
              borderRadius: 3,
              p: 6,
              textAlign: "center",
              bgcolor: isDragging ? `${bgColor}11` : "#FAFAFA",
              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
              "&:hover": {
                bgcolor: `${bgColor}08`,
                borderColor: bgColor,
              },
            }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                opacity: 0,
                cursor: "pointer",
              }}
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
            />

            {!uploadedFile ? (
              <Box>
                <CloudUpload sx={{ fontSize: 60, color: bgColor, mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {t("drag_drop")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {t("or")}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: bgColor,
                    "&:hover": { bgcolor: bgColor, opacity: 0.9 },
                    px: 4,
                  }}
                >
                  {t("browse_files")}
                </Button>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 2, color: "text.secondary" }}
                >
                  {t("supports")} CSV, Excel (.xlsx, .xls)
                </Typography>
              </Box>
            ) : (
              <Box>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "#ECFDF5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <CloudUpload sx={{ fontSize: 40, color: "#10B981" }} />
                </Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {t("file_uploaded")}
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "#F8F9FA",
                    maxWidth: 400,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {uploadedFile.name}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={removeFile}
                      sx={{ minWidth: "auto", px: 1 }}
                    >
                      Remove
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Chip
                      label={uploadedFile.type.toUpperCase()}
                      size="small"
                      color="primary"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(uploadedFile.size)}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Data Table Section */}
      {tableData && tableData.length > 0 && (
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Box
            sx={{
              bgcolor: `${bgColor}11`,
              p: 3,
              borderBottom: `4px solid ${bgColor}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                color: "text.primary",
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: bgColor,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                2
              </Box>
              Data Preview ({tableData.length - 1} rows,{" "}
              {tableData[0]?.length || 0} columns)
            </Typography>

            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() =>
                handleDownloadExcel(uploadedFile.name.split(".")[0])
              }
              sx={{
                borderColor: bgColor,
                color: bgColor,
                "&:hover": {
                  borderColor: bgColor,
                  bgcolor: `${bgColor}11`,
                },
              }}
            >
              Download Excel
            </Button>
          </Box>

          <Box sx={{ p: 3 }}>
            <Box sx={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "600px",
                }}
              >
                <thead>
                  <tr>
                    {tableData[0].map((header, idx) => (
                      <th
                        key={idx}
                        style={{
                          padding: "16px 12px",
                          borderBottom: "2px solid #E5E7EB",
                          backgroundColor: "#F8F9FA",
                          fontWeight: 600,
                          textAlign: "left",
                          fontSize: "14px",
                          color: "#374151",
                        }}
                      >
                        {header || `Column ${idx + 1}`}
                      </th>
                    ))}
                    <th
                      style={{
                        padding: "16px 12px",
                        borderBottom: "2px solid #E5E7EB",
                        backgroundColor: "#F8F9FA",
                        fontWeight: 600,
                        textAlign: "center",
                        fontSize: "14px",
                        color: "#374151",
                        width: "120px",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(1).map((row, rowIdx) => {
                    const absoluteRowIdx = rowIdx + 1;
                    const isEditing = editingRowIdx === absoluteRowIdx;
                    return (
                      <tr
                        key={rowIdx}
                        style={{
                          backgroundColor:
                            rowIdx % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                        }}
                      >
                        {tableData[0].map((_, cellIdx) => (
                          <td
                            key={cellIdx}
                            style={{
                              padding: "12px",
                              borderBottom: "1px solid #E5E7EB",
                              color: "#374151",
                              fontSize: "14px",
                              maxWidth: "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {isEditing ? (
                              <TextField
                                size="small"
                                value={editingRowData[cellIdx] ?? ""}
                                onChange={(e) =>
                                  handleEditCellChange(cellIdx, e.target.value)
                                }
                                fullWidth
                              />
                            ) : (
                              row[cellIdx] || "-"
                            )}
                          </td>
                        ))}
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #E5E7EB",
                            textAlign: "center",
                          }}
                        >
                          {isEditing ? (
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={handleDoneEditRow}
                            >
                              Done
                            </Button>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                              }}
                            >
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditRow(absoluteRowIdx)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteRow(absoluteRowIdx)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Data Summary */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: bgColor }}
                  >
                    {tableData.length - 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Rows
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: bgColor }}
                  >
                    {tableData[0]?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Columns
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Column Types
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <Chip
                      label={`${getDataTypeInfo().numeric} Numeric`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`${getDataTypeInfo().text} Text`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        selectedDataSourceId={selectedDataSourceId}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </Container>
  );
};

export default UploadDB;
