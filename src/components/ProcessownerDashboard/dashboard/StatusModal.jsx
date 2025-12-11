import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle,
  RadioButtonUnchecked,
  Cancel,
  AccessTime,
  PlayArrow,
  Receipt,
} from "@mui/icons-material";

const StatusModal = ({ open, onClose, statusName, timelineData }) => {
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "fulfill":
        return <CheckCircle sx={{ color: "#4caf50", fontSize: "20px" }} />;
      case "completed":
        return <CheckCircle sx={{ color: "#4caf50", fontSize: "20px" }} />;
      case "authorized":
        return <CheckCircle sx={{ color: "#2196f3", fontSize: "20px" }} />;
      case "attempt to authorize the transaction":
        return <AccessTime sx={{ color: "#ff9800", fontSize: "20px" }} />;
      case "processing":
        return <PlayArrow sx={{ color: "#e91e63", fontSize: "20px" }} />;
      case "generate the payment form":
        return <Receipt sx={{ color: "#9e9e9e", fontSize: "20px" }} />;
      case "rechnung":
        return <Receipt sx={{ color: "#9e9e9e", fontSize: "20px" }} />;
      default:
        return (
          <RadioButtonUnchecked sx={{ color: "#9e9e9e", fontSize: "20px" }} />
        );
    }
  };

  const defaultTimelineData = [
    {
      time: "12:10:49 PM",
      status: "Fullfil",
      code: "",
      description: "",
    },
    {
      time: "12:10:48 PM",
      status: "Completed",
      code: "CHF104.73",
      description: "",
    },
    {
      time: "12:10:45 PM",
      status: "Authorized",
      code: "CHF104.73",
      description: "",
    },
    {
      time: "12:10:41 PM",
      status: "Attempt to authorize the transaction",
      code: "",
      description: "Powerpay B28 und B20 - Invoice",
    },
    {
      time: "12:10:41 PM",
      status: "Processing",
      code: "",
      description: "",
    },
    {
      time: "12:10:41 PM",
      status: "Generate the payment form",
      code: "",
      description: "Powerpay B28 und B20 - Invoice",
    },
    {
      time: "",
      status: "Rechnung",
      code: "",
      description: "Powerpay B28 und B20 - Invoice",
    },
  ];

  const dataToUse = timelineData || defaultTimelineData;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "500px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(to top, #2C64FF, #4A90E2)",
          color: "white",
          pb: 2,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, color: "white" }}
        >
          {statusName || "Transaction Timeline"}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            mt: 2,
            color: "#666",
            fontWeight: 400,
            fontSize: "0.8rem",
          }}
        >
          09 JUN 2025
        </Typography>

        <List sx={{ width: "100%", p: 0 }}>
          {dataToUse.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ p: 0, alignItems: "flex-start" }}>
                <ListItemIcon sx={{ minWidth: "40px", pt: "4px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    {getStatusIcon(item.status)}
                    {index !== dataToUse.length - 1 && (
                      <Divider
                        orientation="vertical"
                        sx={{
                          height: "24px",
                          borderRightWidth: "2px",
                          backgroundColor: "#e0e0e0",
                          my: "4px",
                        }}
                      />
                    )}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.status}
                      </Typography>
                      {item.code && (
                        <Chip
                          label={item.code}
                          size="small"
                          sx={{
                            backgroundColor: "#f5f5f5",
                            color: "#333",
                            fontSize: "0.75rem",
                            height: "20px",
                          }}
                        />
                      )}
                    </Stack>
                  }
                  secondary={
                    <>
                      {item.time && (
                        <Typography variant="caption" color="text.secondary">
                          {item.time}
                        </Typography>
                      )}
                      {item.description && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <RadioButtonUnchecked
                            sx={{
                              color: "#9e9e9e",
                              fontSize: "16px",
                              mr: 1,
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {item.description}
                          </Typography>
                        </Box>
                      )}
                    </>
                  }
                  sx={{ m: 0 }}
                />
              </ListItem>
              {index === 3 && (
                <Box sx={{ ml: 5, my: 1 }}>
                  <Divider sx={{ borderStyle: "dashed" }} />
                </Box>
              )}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default StatusModal;
