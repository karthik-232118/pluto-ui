import React, { useState, useEffect, useMemo } from "react";
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
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  OutlinedInput,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import StorageIcon from "@mui/icons-material/Storage";
import { useTranslation } from "react-i18next";
import { useHeadingBgColor } from "../../useHeadingBgColor";
// import { SaveUploadedDashboardApi } from "../../../api/dashboardApi"; // adjust path as needed
import CircularProgress from "@mui/material/CircularProgress";
import {
  SaveUploadedDashboardApi,
  UpdateDataSourceApi,
} from "../../../services/dashboardBuilder/DashboardBuilder";

// Database categories for better organization
const DATABASE_CATEGORIES = {
  SQL: [
    "MySQL",
    "PostgreSQL",
    "MariaDB",
    "SQLServer",
    "Oracle",
    "SQLite",
    "DB2",
    "Snowflake",
    "Teradata",
    "Sybase",
  ],
  NoSQL: [
    "MongoDB",
    "Cassandra",
    "Redis",
    "Elasticsearch",
    "DynamoDB",
    "Firebase",
    "CouchDB",
    "Neo4j",
  ],
  TimeSeries: ["InfluxDB", "ClickHouse"],
  BigData: ["HBase", "Cassandra"],
};

const AddConnectionDialog = ({
  open,
  onClose,
  selectedDb,
  onDbSelect,
  onAddConnection,
  databaseList = Object.values(DATABASE_CATEGORIES).flat(),
  initialValues,
  mode = "add", // <-- add mode prop, default to "add"
}) => {
  const { t } = useTranslation();

  // Form state
  const [form, setForm] = useState({
    host: "",
    port: "",
    dbName: "",
    username: "",
    password: "",
  });
  const bgcolor = useHeadingBgColor();
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [showDatabaseList, setShowDatabaseList] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter databases based on search term
  const filteredDatabases = useMemo(() => {
    if (!searchTerm) return databaseList;

    return databaseList.filter((db) =>
      db.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, databaseList]);

  // Categorize filtered databases
  const categorizedDatabases = useMemo(() => {
    const categorized = {};

    Object.entries(DATABASE_CATEGORIES).forEach(([category, dbs]) => {
      const categoryDbs = filteredDatabases.filter((db) => dbs.includes(db));
      if (categoryDbs.length > 0) {
        categorized[category] = categoryDbs;
      }
    });

    return categorized;
  }, [filteredDatabases]);

  // Reset form when dialog opens/closes or db changes
  useEffect(() => {
    if (!open) {
      setForm({
        host: "",
        port: "",
        dbName: "",
        username: "",
        password: "",
      });
      setSearchTerm("");
      setShowDatabaseList(false);
    } else if (initialValues) {
      setForm(initialValues);
    }
  }, [open, selectedDb, initialValues]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConnect = async () => {
    if (!selectedDb) return;
    setLoading(true);
    try {
      // Prepare payload
      const payload = {
        DataSourceName: selectedDb,
        DataSourceType: "External Databases",
        DataSourceConfigData: {
          host: form.host,
          port: form.port,
          userName: form.username,
          passwoard: form.password,
          DatabaseType: selectedDb,
          databasename: form.dbName,
        },
      };
      await SaveUploadedDashboardApi(payload);
      // Call parent handler after successful API call
      onAddConnection({
        name: selectedDb,
        type:
          Object.entries(DATABASE_CATEGORIES).find(([_, dbs]) =>
            dbs.includes(selectedDb)
          )?.[0] || "SQL",
        ...form,
      });
    } catch (e) {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedDb || !initialValues?.id) return;
    setLoading(true);
    try {
      // Prepare payload for update
      const payload = {
        DataSourceID: initialValues.id,
        DataSourceName: selectedDb,
        DataSourceDescription: initialValues.description || "",
        DataSourceType: "External Databases",
        DataSourceConfigData: {
          host: form.host,
          port: form.port,
          userName: form.username,
          passwoard: form.password,
          DatabaseType: selectedDb,
          databasename: form.dbName,
        },
      };
      await UpdateDataSourceApi(payload);
      // Call parent handler after successful API call
      onAddConnection({
        name: selectedDb,
        type:
          Object.entries(DATABASE_CATEGORIES).find(([_, dbs]) =>
            dbs.includes(selectedDb)
          )?.[0] || "SQL",
        ...form,
      });
    } catch (e) {
      setLoading(false);
    }
  };

  const getDefaultPort = (dbType) => {
    const portMap = {
      MongoDB: "27017",
      MySQL: "3306",
      PostgreSQL: "5432",
      Redis: "6379",
      Cassandra: "9042",
      Elasticsearch: "9200",
      Neo4j: "7687",
      SQLServer: "1433",
      Oracle: "1521",
      MariaDB: "3306",
      SQLite: "", // No port for SQLite
      InfluxDB: "8086",
      ClickHouse: "8123",
    };
    return portMap[dbType] || "";
  };

  // Auto-fill port when database is selected
  useEffect(() => {
    if (selectedDb && !form.port) {
      const defaultPort = getDefaultPort(selectedDb);
      if (defaultPort) {
        setForm((prev) => ({ ...prev, port: defaultPort }));
      }
    }
  }, [selectedDb]);

  const handleDbSelect = (db) => {
    onDbSelect({ target: { value: db } });
    setShowDatabaseList(false);
    setSearchTerm("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
          background: bgcolor,
          py: 2,
          position: "relative",
          textAlign: "center",
          fontSize: "1.5rem",
        }}
      >
        <StorageIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        {t("addNewDatabaseConnection")}
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
        {/* Database Selection */}
        <FormControl fullWidth sx={{ mt: 4 }} variant="outlined">
          <InputLabel id="db-select-label" sx={{ fontWeight: "bold" }}>
            {t("databaseType")}
          </InputLabel>
          <Select
            labelId="db-select-label"
            value={selectedDb}
            label={t("databaseType")}
            onOpen={() => setShowDatabaseList(true)}
            onClose={() => setShowDatabaseList(false)}
            open={showDatabaseList}
            renderValue={(value) => (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={value}
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
                placeholder="Search databases..."
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
                sx={{ maxHeight: 300, overflow: "auto" }}
              >
                <List dense>
                  {Object.entries(categorizedDatabases).map(
                    ([category, dbs]) => (
                      <React.Fragment key={category}>
                        <ListItem>
                          <ListItemText>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              fontWeight="bold"
                            >
                              {category} Databases
                            </Typography>
                          </ListItemText>
                        </ListItem>
                        {dbs.map((db) => (
                          <ListItemButton
                            key={db}
                            selected={selectedDb === db}
                            onClick={() => handleDbSelect(db)}
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
                            <ListItemText primary={db} />
                          </ListItemButton>
                        ))}
                        <Divider sx={{ my: 1 }} />
                      </React.Fragment>
                    )
                  )}

                  {filteredDatabases.length === 0 && (
                    <ListItem>
                      <ListItemText>
                        <Typography color="text.secondary" align="center">
                          No databases found
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
        {selectedDb && (
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
              Connection Details for {selectedDb}
            </Typography>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                fullWidth
                label="Host"
                name="host"
                value={form.host}
                onChange={handleChange}
                placeholder="localhost"
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                label="Port"
                name="port"
                value={form.port}
                onChange={handleChange}
                placeholder={getDefaultPort(selectedDb)}
                variant="outlined"
                size="small"
              />
            </Box>

            <TextField
              fullWidth
              label="Database Name"
              name="dbName"
              value={form.dbName}
              onChange={handleChange}
              sx={{ mt: 2 }}
              variant="outlined"
              size="small"
            />

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
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
            </Box>

            {selectedDb === "SQLite" && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Note: SQLite uses file-based connections. Host and Port fields
                are optional.
              </Typography>
            )}
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
          disabled={loading}
        >
          {t("cancel")}
        </Button>
        {mode === "edit" ? (
          <Button
            variant="contained"
            onClick={handleEdit}
            disabled={!selectedDb || loading}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: "bold",
              background: bgcolor,
              "&:hover": {
                background: bgcolor,
              },
            }}
            startIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : null
            }
          >
            {loading ? t("editing") : t("edit")}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleConnect}
            disabled={!selectedDb || loading}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: "bold",
              background: bgcolor,
              "&:hover": {
                background: bgcolor,
              },
            }}
            startIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : null
            }
          >
            {loading ? t("connecting") : t("connect")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddConnectionDialog;
