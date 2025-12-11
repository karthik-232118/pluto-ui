import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { getEnterpriseInfoApi } from "../../../services/enterprise/Enterprise";
import { Info } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const InfoEnterprises = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  const { t } = useTranslation();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getEnterpriseInfoApi();
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching enterprise information:", error);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Info />
      </IconButton>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t("enterpriseInfo")}</DialogTitle>
        <DialogContent>
          <TextField
            label="Encrypted Key"
            value={data?.EncryptedKey || ""}
            variant="outlined"
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true,
            }}
          />
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            sx={{ mt: 2 }}
            onClick={() => {
              if (data?.EncryptedKey) {
                navigator.clipboard.writeText(data.EncryptedKey);
                alert(t("enterpriseInfoCopied"));
              }
            }}
          >
            {t("copyToClipboard")}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ borderColor: "#000", color: "#000" }}
          >
            {t("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InfoEnterprises;
