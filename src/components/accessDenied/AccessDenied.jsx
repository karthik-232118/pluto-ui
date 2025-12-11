import React from "react";
import { FaLock, FaArrowRight, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "70%", md: "50%" },
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
       
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1.5rem",
            boxShadow: "0 8px 16px rgba(255, 107, 129, 0.2)",
          }}
        >
          <FaLock style={{ color: "white", fontSize: "32px" }} />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "700",
            marginBottom: "0.75rem",
            background: "#3B82F6",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "1.75rem", sm: "2rem" },
          }}
        >
          Access Restricted
        </Typography>
        <Typography
          variant="p"
          sx={{
            fontWeight: "400",
            color: "#6c757d",
            marginBottom: "1rem",
            fontSize: { xs: "0.8rem", sm: "0.8rem" },
           fontFamily: "Inter, sans-serif !important"
          }}
        >
          {"Oops! You don't have permission to access this page"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#6c757d",
            lineHeight: "1.6",
            marginBottom: "2.5rem",
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
          }}
        >
          If you believe this is a mistake, please contact your system
          administrator with your account details.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outlined"
            sx={{
              padding: "0.6rem 1.5rem",
              fontWeight: "600",
              color: "#495057",
              borderColor: "#dee2e6",
              borderRadius: "50px",
              textTransform: "none",
              fontSize: "0.875rem",
              transition: "all 0.3s ease",
              ":hover": {
                borderColor: "#adb5bd",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "rgba(0, 0, 0, 0.01)",
              },
            }}
            startIcon={
              <FaArrowRight
                style={{ transform: "rotate(180deg)", marginRight: "6px" }}
              />
            }
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="contained"
            sx={{
              padding: "0.6rem 1.5rem",
              fontWeight: "600",
              background: "#3B82F6",
              color: "white",
              borderRadius: "50px",
              textTransform: "none",
              fontSize: "0.875rem",
              boxShadow: "0 4px 12px rgba(67, 97, 238, 0.3)",
              transition: "all 0.3s ease",
              ":hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(67, 97, 238, 0.4)",
                background: "#2563eb",
              },
            }}
            startIcon={<FaHome style={{ marginRight: "6px", fontSize: "14px" }} />}
          >
            Home Page
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AccessDenied;