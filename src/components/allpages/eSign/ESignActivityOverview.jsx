import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  StepConnector,
  Skeleton,
  Stack,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { dateformatter } from "../../../utils";
import  PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Message = ({ message, iconColor = "error" }) => {
 
  return (
    <Box
      sx={{
        height: "100%",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Stack
        direction="column"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "600px",
          backgroundColor: "white",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 80,
            color: iconColor === "error" ? "#FF9800" : "#2196F3",
          }}
        />

        <Typography
          variant="body1"
          fontSize="1.25rem"
          textAlign="center"
          color="textSecondary"
        >
          {message ||
            "An unexpected error has occurred. Please try again later."}
        </Typography>
      </Stack>
    </Box>
  );
};

const ActivityStepper = ({ activity }) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        padding: "30px",
        borderRadius: "12px",
        maxWidth: "600px",
        backgroundColor: "white",
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h6"
        fontSize={32}
        color="textPrimary"
        sx={{ maxWidth: 400, margin: "auto" }}
      >
       {t("Activity")}
      </Typography>
      <Box sx={{ maxWidth: 400, margin: "auto", mt: 5 }}>
        <Stepper
          orientation="vertical"
          connector={
            <StepConnector
              sx={{
                ml: "24px",
                "& .MuiStepConnector-line": {
                  minHeight: 50, // Adjust the height
                  borderWidth: 2, // Adjust the thickness
                  borderColor: "#aaa", // Adjust the color if needed
                },
              }}
            />
          }
        >
          {activity.map((item, index) => (
            <Step key={index} active={true} completed={index < 1}>
              <StepLabel
                sx={{ alignItems: "center" }}
                icon={
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: "#4682B4",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                    }}
                  >
                    {index + 1}
                  </Box>
                }
              >
                <Box sx={{ ml: 2 }}>
                  <Typography fontSize={16} fontWeight="bold">
                    {item.description}
                  </Typography>
                  <Typography fontSize={14} color="textSecondary">
                    {/* {moment(item.date).format("MMMM Do YYYY, h:mm:ss a")} */}
                    {dateformatter(item?.date)}
                  </Typography>
                  <Typography fontSize={14} color="textSecondary">
                    IP: {item.ip_address}
                  </Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
};

const ESignActivityOverview = ({ loading, isESignSelected, activity = [] }) => {
  if (!isESignSelected) {
    return (
      <Message
        message="Please select an ESign to view its activities"
        iconColor="information"
      />
    );
  }

  return (
    <Box
      sx={{
        paddingLeft: "4px",
        paddingRight: "4px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <Box>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
            <Box
              key={step}
              sx={{ display: "flex", alignItems: "center", mb: 2 }}
            >
              <Skeleton
                variant="circular"
                width={36}
                height={36}
                sx={{ marginRight: 2 }}
              />
              <Box sx={{ width: "80%" }}>
                <Skeleton height={20} />
                <Skeleton height={20} width="60%" />
              </Box>
            </Box>
          ))}
        </Box>
      ) : activity.length === 0 ? (
        <Message message="No Activity Found" />
      ) : (
        <ActivityStepper activity={activity} />
      )}
    </Box>
  );
};

export default ESignActivityOverview;

Message.propTypes = {
  message: PropTypes.string,
  iconColor: PropTypes.string,
};
ActivityStepper.propTypes = {
  activity: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      ip_address: PropTypes.string.isRequired,
    })
  ).isRequired,
};
ESignActivityOverview.propTypes = {
  loading: PropTypes.bool.isRequired,
  isESignSelected: PropTypes.bool.isRequired,
  activity: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      ip_address: PropTypes.string.isRequired,
    })
  ).isRequired,
};
