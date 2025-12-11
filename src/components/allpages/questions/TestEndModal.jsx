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
import testEnd from "../../../assets/svg/ModelsSvg/TestEnd.svg";
import calendar from "../../../assets/svg/ModelsSvg/calendar.svg";
import loader from "../../../assets/svg/ModelsSvg/loader.svg";
import "./TestEndModal.css";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const TestEndModal = ({
  open,
  handleClose,
  TestMCQName,
  dueDate,
  handleConfirm,
  TestMCQDescription,
  attemptCounter,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleConfirmAndNavigate = () => {
    console.log("Executing handleConfirm...");
    handleConfirm(); // First, execute handleConfirm
    console.log("handleConfirm executed.");

    navigate("/mcqtestresult"); // Then, navigate to the mcqtestresult page
    console.log("Navigating to /mcqtestresult...");
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
            background: "linear-gradient(to top, #B91C1C, #EF4444)",
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
              src={testEnd}
              alt="testEnd"
              style={{ width: "64px", height: "64px" }}
            />
          </Box>
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 500,
                color: "#FFFFFF",
                // mb: 0.5,
                mt: 2,
                textTransform: "none",
              }}
            >
              {t("endTestConfirmation")}
            </Typography>
           
          </Box>
        </Box>

        {/* Content Section */}
        <Box sx={{ p: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ color: "#1F2937", mb: 1 }}>
              {TestMCQName}
            </Typography>
            <Typography sx={{ color: "#4B5563" }}>
              {TestMCQDescription}
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
                    p: 1.5,
                    backgroundColor: "#F9FAFB",
                    borderRadius: "8px",
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
                  {t("Attempt Counter")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    backgroundColor: "#F9FAFB",
                    borderRadius: "8px",
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
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                onClick={handleClose}
                className="modal-button"
                sx={{
                  borderColor: "#D0D5DD",
                  color: "black",
                  textTransform: "none",
                  boxShadow: "0px 1px 2px 0px #1018280D",
                  borderRadius: "8px",
                }}
              >
                {t("cancel")}
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                onClick={handleConfirmAndNavigate}
                className="modal-button-contained"
                sx={{
                  backgroundColor: "#EF4444",
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#B91C1C",
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

export default TestEndModal;

TestEndModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  TestMCQName: PropTypes.string.isRequired,
  dueDate: PropTypes.string.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  TestMCQDescription: PropTypes.string.isRequired,
  attemptCounter: PropTypes.number.isRequired,
};
