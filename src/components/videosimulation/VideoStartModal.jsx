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
import { useDispatch } from "react-redux";
import testStart from "../../assets/svg/ModelsSvg/TestStart.svg";
import calendar from "../../assets/svg/ModelsSvg/calendar.svg";
import clock from "../../assets/svg/ModelsSvg/clock.svg";
import loader from "../../assets/svg/ModelsSvg/loader.svg";
import { BASE_URL } from "../../config/urlConfig";
import { encryptString } from "../../utils";
import { GetAttempts } from "../../store/attempts/action";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";

const VideoStartModal = ({
  open,
  handleClose,
  dueDate,
  TestSimulationName,
  avgTimeRequired,
  attemptCounter,
  TestSimulationDescription,
  TestSimulationPath,
  ModuleID,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();

  const UserID = localStorage.getItem("user_id");

  console.log(ModuleID, "ModuleID in VideoStartModal");
  const HandleConfirm = () => {
    const accessToken = localStorage.getItem("access_token");
    const userType = localStorage.getItem("user_type");
    const myTask = localStorage.getItem("my_task");
    if (!accessToken) {
      toast.error("Access token not found");
      return;
    }
    const encryptedAccessToken = encryptString(accessToken, 10);
   const fullURL = `${BASE_URL}${TestSimulationPath}/test.html?token=${encryptedAccessToken}&SkillId=${ModuleID}&UserId=${UserID}`;
const newTab = window.open(fullURL, "_blank");

    if (newTab) {
      handleClose();
      const requestBody = {
        ModuleID: ModuleID,
      };
      if (userType === "EndUser" || myTask) {
        dispatch(GetAttempts(requestBody))
          .then((response) => {
            console.log("GetAttempts Response:", response.payload);
          })
          .catch((error) => {
            console.error("Error in GetAttempts:", error);
            toast.error("Failed to get attempts");
          });
      }
    } else {
      console.warn("Failed to open the new tab");
    }
  };

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
            <Typography sx={{ color: "#E5E7EB", mb: 0.5 }}>
              {t("areYouSure")}
            </Typography>
            <Typography sx={{ color: "#F3F4F6", fontSize: "0.875rem" }}>
              {t("timerInfo")}
            </Typography>
          </Box>
        </Box>

        {/* Content Section */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: "#1F2937", mb: 1 }}>
              {TestSimulationName}
            </Typography>
            <Typography sx={{ color: "#4B5563" }}>
              {TestSimulationDescription}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ minWidth: "150px" }}>
                <Typography sx={{ color: "#6B7280", mb: 1 }}>
                  {t("Due Date")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#1F2937",
                  }}
                >
                  <img
                    src={calendar}
                    alt=""
                    style={{ marginRight: "8px", width: "20px" }}
                  />
                  {dueDate}
                </Box>
              </Box>
              <Box sx={{ minWidth: "150px" }}>
                <Typography sx={{ color: "#6B7280", mb: 1 }}>
                  {"duration"}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#1F2937",
                  }}
                >
                  <img
                    src={clock}
                    alt=""
                    style={{ marginRight: "8px", width: "20px" }}
                  />
                  {avgTimeRequired || "0"}
                </Box>
              </Box>
              <Box sx={{ minWidth: "150px" }}>
                <Typography sx={{ color: "#6B7280", mb: 1 }}>
                  {t("Attempt Counter")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#1F2937",
                  }}
                >
                  <img
                    src={loader}
                    alt=""
                    style={{ marginRight: "8px", width: "20px" }}
                  />
                  {attemptCounter}
                </Box>
              </Box>
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
                sx={{
                  borderColor: "#D0D5DD",
                  color: "#374151",
                  textTransform: "none",
                  boxShadow: "0px 1px 2px 0px #1018280D",
                  borderRadius: "8px",
                  py: 1,
                  "&:hover": {
                    borderColor: "#9CA3AF",
                    backgroundColor: "#F9FAFB",
                  },
                }}
              >
                {t("cancel")}
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={HandleConfirm}
                sx={{
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
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Modal>
  );
};

export default VideoStartModal;

VideoStartModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  dueDate: PropTypes.string.isRequired,
  TestSimulationName: PropTypes.string.isRequired,
  avgTimeRequired: PropTypes.string.isRequired,
  attemptCounter: PropTypes.string.isRequired,
  TestSimulationDescription: PropTypes.string.isRequired,
  TestSimulationPath: PropTypes.string.isRequired,
  ModuleID: PropTypes.number.isRequired,
};
VideoStartModal.defaultProps = {
  open: false,
  handleClose: () => {},
  handleConfirm: () => {},
  dueDate: "",
  TestSimulationName: "",
  avgTimeRequired: "",
  attemptCounter: "0",
  TestSimulationDescription: "",
  TestSimulationPath: "",
  ModuleID: 0,
};
