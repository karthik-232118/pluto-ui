import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import testStart from "../../assets/svg/ModelsSvg/TestStart.svg";
import calendar from "../../assets/svg/ModelsSvg/calendar.svg";
import clock from "../../assets/svg/ModelsSvg/clock.svg";
import loader from "../../assets/svg/ModelsSvg/loader.svg";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";

const TestStartModel = ({
  open,
  handleClose,
  handleConfirm,
  dueDate,
  totalAttempt,
  avgTimeRequired,
  TestMCQName,
  TestMCQID,
  TestMCQDraftID,
}) => {
  const { t } = useTranslation();

  localStorage.setItem("TestMCQID", TestMCQID);
  localStorage.setItem("TestMCQDraftID", TestMCQDraftID);
  const theme = useTheme();

  return (
    <Modal
      open={open}
      onClose={null}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          position: "relative",
          width: "90%",
          maxWidth: "600px",
          bgcolor: "background.paper",
          borderRadius: "16px",
          boxShadow: 24,
          maxHeight: "90vh",
          overflowY: "auto",
          p: 0,
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: theme.palette.primary.main,
            p: 1,
            paddingTop: 2,
            paddingLeft: 3,
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            display: "flex",
            alignItems: "flex-start",
            gap: 3,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box>
            <img
              src={testStart}
              alt="testStart"
              style={{ width: "64px", height: "64px" }}
            />
          </Box>
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 600,
                color: "#FFFFFF",
                mb: 0.5,
              }}
            >
              {t("confirmTestAttempt")}
            </Typography>
            <Typography
              sx={{
                color: "#E5E7EB",
                mb: 0.5,
                fontSize: "0.875rem",
                textTransform: "none",
              }}
            >
              {t("areYouSure")}
            </Typography>
            <Typography
              sx={{
                color: "#F3F4F6",
                fontSize: "0.875rem",
                textTransform: "none",
              }}
            >
              {t("timerInfo")}
            </Typography>
          </Box>
        </Box>

        {/* Content Section */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 550, mb: 1 }}>
              {TestMCQName}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                gap: 3,
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="p" sx={{ fontWeight: 500, mb: 1 }}>
                  {t("Due Date")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    backgroundColor: "#F9FAFB",
                    borderRadius: "8px",
                  }}
                >
                  <img src={calendar} alt="" style={{ marginRight: "8px" }} />
                  {dueDate}
                </Box>
              </Box>

              <Box>
                <Typography variant="p" sx={{ fontWeight: 500, mb: 1 }}>
                  {t("duration")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    backgroundColor: "#F9FAFB",
                    borderRadius: "8px",
                  }}
                >
                  <img src={clock} alt="" style={{ marginRight: "8px" }} />
                  {avgTimeRequired}
                </Box>
              </Box>

              <Box>
                <Typography variant="p" sx={{ fontWeight: 500, mb: 1 }}>
                  {t("Attempt Counter")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    backgroundColor: "#F9FAFB",
                    borderRadius: "8px",
                  }}
                >
                  <img src={loader} alt="" style={{ marginRight: "8px" }} />
                  {totalAttempt} times
                </Box>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  width: "100%",
                  borderColor: "#D0D5DD",
                  color: "black",
                  textTransform: "none",
                  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                  borderRadius: "8px",
                  py: 1,
                  "&:hover": {
                    borderColor: "#D0D5DD",
                    backgroundColor: "#F9FAFB",
                  },
                }}
              >
                {t("cancel")}
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Link to={"/questions"} style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  onClick={handleConfirm}
                  sx={{
                    width: "100%",
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "8px",
                    textTransform: "none",
                    py: 1,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                >
                  {t("confirm")}
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Modal>
  );
};

export default TestStartModel;

TestStartModel.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  dueDate: PropTypes.string.isRequired,
  totalAttempt: PropTypes.number.isRequired,
  avgTimeRequired: PropTypes.string.isRequired,
  TestMCQName: PropTypes.string.isRequired,
  TestMCQID: PropTypes.string.isRequired,
  TestMCQDraftID: PropTypes.string.isRequired,
};
