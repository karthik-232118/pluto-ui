import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  IconButton,
  Grid,
  CircularProgress,
} from "@mui/material";
import logout from "../../assets/svg/logout/logout.svg";
import { useNavigate } from "react-router-dom";
import { LogoutApi } from "../../services/auth/Auth";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const LogOutModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    localStorage.clear();
    navigate("/?sso=0");
    setTimeout(() => {
      window.location.reload();
    }, 500);

    try {
      LogoutApi()
        .then((response) => {
          console.log("Logout successful:", response);
        })
        .catch((error) => {
          console.error("Logout failed:", error);
        });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="logout-modal-title"
      aria-describedby="logout-modal-description"
    >
      <Box sx={modalStyle}>
        <IconButton
          disableRipple
          onClick={onClose}
          sx={{
            color: "#F50057",
            backgroundColor: "#FDE8E8",
            mb: 2,
            alignSelf: "center",
          }}
        >
          <img src={logout} alt="" />
        </IconButton>
        <Typography
          id="logout-modal-title"
          variant="h6"
          component="h2"
          align="center"
          sx={{ marginBottom: "0.4rem" }}
        >
          {t("logoutModalTitle")}
        </Typography>
        <Typography
          id="logout-modal-description"
          sx={{ color: "#64748B", fontWeight: "400", fontSize: "15px" }}
          align="center"
        >
          {t("logoutModalDescription")}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ width: "100%" }}
              style={{
                borderColor: "#D0D5DD",
                color: "#000",
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              {t("cancel")}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="error"
              sx={{ width: "100%" }}
              style={{
                backgroundColor: "#B91C1C",
                borderRadius: "8px",
                textTransform: "none",
              }}
              onClick={handleLogout}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("logoutButton")
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  width: "485px",
  height: "248px",
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  padding: "24px",
  transform: "translate(-50%, -50%)",
};

export default LogOutModal;

LogOutModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
