import { useState } from "react";
import { QueryBuilderDnD } from "@react-querybuilder/dnd";
import * as ReactDnD from "react-dnd";
import * as ReactDndHtml5Backend from "react-dnd-html5-backend";
import * as ReactDndTouchBackend from "react-dnd-touch-backend";
import {
  defaultValidator,
  formatQuery,
  QueryBuilder,
} from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import {
  TextField,
  Button,
  Checkbox,
  Divider,
  Typography,
  Box,
  FormGroup,
  FormControlLabel,
  Paper,
  Autocomplete,
  Chip,
  IconButton,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  PlayArrow as RunIcon,
  TableView as TableIcon,
} from "@mui/icons-material";

const fields = [
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "age", label: "Age", type: "number" },
  { name: "createdAt", label: "Created At", type: "date" },
  { name: "isActive", label: "Is Active", type: "boolean" },
];

const initialQuery = { combinator: "and", rules: [] };

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sql-tabpanel-${index}`}
      aria-labelledby={`sql-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export const CustomQueryBuilder = ({ onSQLChange }) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [tableName, setTableName] = useState("users");
  const [finalSQL, setFinalSQL] = useState("");
  const tableOptions = ["users", "products", "orders", "customers"].map(
    (option) => ({
      label: option,
      value: option,
    })
  );

  const columnOptions = [
    { label: "*", value: "*" },
    ...fields.map((f) => ({ label: f.label, value: f.name })),
  ];

  const handleGenerateSQL = () => {
    let columnsPart = "*";
    if (selectedColumns.length > 0 && !selectedColumns.includes("*")) {
      columnsPart = selectedColumns.join(", ");
    }
    const whereClause = formatQuery(query, "sql");
    const sql = `SELECT ${columnsPart} FROM ${tableName}${
      whereClause ? ` WHERE ${whereClause}` : ""
    };`;
    setFinalSQL(sql);
    if (onSQLChange) {
      onSQLChange(sql);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalSQL);
  };

  return (
    <QueryBuilderDnD
      dnd={{ ...ReactDnD, ...ReactDndHtml5Backend, ...ReactDndTouchBackend }}
    >
      <Box>
        <Paper
          elevation={0}
          sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TableIcon color="primary" />
            SQL Query Builder
          </Typography>

          {/* Table Name Input */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Table Name:
            </Typography>
            <Autocomplete
              options={tableOptions}
              value={{ label: tableName, value: tableName }}
              onChange={(event, newValue) =>
                setTableName(newValue?.value || "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Select or enter a table name"
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              freeSolo
            />
          </Box>

      

          <Divider sx={{ my: 2 }} />

          {/* Query Builder */}
          <Box sx={{ my: 2, overflow: "auto" }}>
            <QueryBuilder
              fields={fields}
              query={query}
              onQueryChange={(q) => setQuery(q)}
              addRuleToNewGroups
              controlElements={{
                combinatorSelector: (props) => (
                  <select
                    {...props}
                    className="MuiSelect-root MuiSelect-select MuiInputBase-input MuiOutlinedInput-input"
                  >
                    {props.options.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ),
              }}
              controlClassnames={{
                queryBuilder: "queryBuilder-branches",
                ruleGroup: "MuiPaper-root MuiPaper-elevation1",
                rule: "MuiPaper-root MuiPaper-outlined",
              }}
            />
          </Box>

          {/* Generate SQL Button */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={handleGenerateSQL}
              startIcon={<RunIcon />}
            >
              Generate SQL
            </Button>
          </Box>

          {/* Tabs for SQL and Preview */}
          <Box sx={{ width: "100%", mt: 0 }}>
            <Tabs value={0} aria-label="SQL tabs">
              <Tab label="SQL Query" id="sql-tab-0" />
            </Tabs>

            <TabPanel value={0} index={0}>
              {finalSQL && (
                <Card variant="outlined">
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Generated SQL:
                      </Typography>
                      <IconButton size="small" onClick={copyToClipboard}>
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box
                      sx={{
                        p: 1.5,
                        backgroundColor: "#f9f9f9",
                        borderRadius: 1,
                        overflow: "auto",
                        fontFamily:
                          "Consolas, Monaco, 'Andale Mono', monospace",
                        fontSize: "0.8rem",
                        lineHeight: 1.5,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <code>{finalSQL}</code>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </QueryBuilderDnD>
  );
};

export default CustomQueryBuilder;
