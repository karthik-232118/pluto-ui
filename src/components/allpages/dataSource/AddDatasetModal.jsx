import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Fade,
} from "@mui/material";

import CustomQueryBuilder from "./CustomQueryBuilder";
import { Database } from "lucide-react";
import { Api, Close, Visibility } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useHeadingBgColor } from "../../useHeadingBgColor";
import { useTranslation } from "react-i18next";

const AddDatasetModal = ({ open, onClose, onSave, editingDataset }) => {

  console.log("Editing dataset in edit modal:", editingDataset);
  const bgColor = useHeadingBgColor();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    queryType: "DB Query",
    dbType: "Internal DB",
    sqlQuery: "",
  });

  // Update form data when editing dataset changes
  useEffect(() => {
    if (editingDataset) {
      setFormData({
        name: editingDataset.name || "",
        description: editingDataset.description || "",
        queryType: editingDataset.queryType || "DB Query",
        dbType: editingDataset.dbType || "Internal DB",
        sqlQuery: editingDataset.sqlQuery || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        queryType: "DB Query",
        dbType: "Internal DB",
        sqlQuery: "",
      });
    }
  }, [editingDataset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSQLChange = (sql) => {
    setFormData((prev) => ({
      ...prev,
      sqlQuery: sql,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setFormData({
      name: "",
      description: "",
      queryType: "DB Query",
      dbType: "Internal DB",
      sqlQuery: "",
    });
    onClose();
  };

  const renderContent = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label={t("datasetName")}
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          variant="outlined"
          size="small"
          placeholder={t("datasetName_placeholder")}
        />
        <TextField
          label={t("description_label")}
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          size="small"
          placeholder={t("description_placeholder")}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {formData.queryType === "DB Query" && (
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <CustomQueryBuilder
              onSQLChange={handleSQLChange}
              sql={formData.sqlQuery}
            />
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "visible",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          backgroundColor: bgColor,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {t("createNewDataset")}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "black",
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Fade in={true} timeout={500}>
          {renderContent()}
        </Fade>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          {t("cancel")}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!formData.name.trim()}
          startIcon={<Visibility />}
        >
          {t("savePreview")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddDatasetModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editingDataset: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    queryType: PropTypes.string,
    dbType: PropTypes.string,
    sqlQuery: PropTypes.string,
  }),
};

export default AddDatasetModal;
