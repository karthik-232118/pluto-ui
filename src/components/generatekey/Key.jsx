import { Box, Button, Typography, TextField } from "@mui/material";
import keyicon from "../../assets/svg/keypages/SuccessKey.svg";
import copy from "../../assets/svg/keypages/copy.svg";
import home from "../../assets/svg/keypages/home.svg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const Key = () => {
  const { data } = useSelector((state) => state?.keygenreration);
  const navigate = useNavigate();
  const {t} = useTranslation();
  const handleCopy = () => {
    navigator.clipboard.writeText(data?.LicenseKey);
    alert(t("keyCopied"));
  };

  const handleBackHome = () => {
    navigate("/home");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="81vh"
      bgcolor="#fff"
      padding={3}
      style={{ margin: "30px", borderRadius: "8px" }}
    >
      {/* Success Icon */}
      <img src={keyicon} alt="" />
      {/* Heading */}
      <Typography variant="h6" mt={2} mb={1} align="center">
        Key Generated Successfully
      </Typography>

      {/* Paragraph */}
      <Typography
        variant="body1"
        align="center"
        maxWidth="40%"
        style={{ color: "#64748B" }}
      >
        Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
        libero et velit interdum, ac aliquet odio mattis.
      </Typography>

      {/* Box containing the key */}
      <Box
        display="flex"
        alignItems="center"
        sx={{
          width: { xs: "100%", sm: "auto", lg: "495px" }, // Full width on small screens, 495px on laptops
          height: "56px",
          gap: "16px",
          mt: 2,
          mb: 3,
          bgcolor: "#fff",
          padding: { xs: "8px", sm: "12px", md: "16px 14px" }, // Adjust padding based on screen size
        }}
      >
        <TextField
          defaultValue={data?.LicenseKey}
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
            style: {
              border: "none",
              color: "#64748B",
              borderColor: "#E2E8F0",
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      {/* Buttons */}
      <Box
        display="flex"
        justifyContent="center"
        gap={2}
        sx={{
          flexDirection: { xs: "column", sm: "row" }, // Stack vertically on smaller screens
          alignItems: "center",
          width: "100%", // Ensure it spans the available width
        }}
      >
        <Button
          variant="contained"
          onClick={handleCopy}
          sx={{
            backgroundColor: "#3B82F6",
            height: "48px",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            width: { xs: "100%", sm: "auto" }, // Full width on small screens
            justifyContent: "center",
          }}
        >
            {t("copyToClipboard")}
          <span
            style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}
          >
            <img src={copy} alt="" />
          </span>
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleBackHome}
          sx={{
            borderColor: "#E2E8F0",
            color: "#000",
            textTransform: "none",
            height: "48px",
            display: "flex",
            alignItems: "center",
            width: { xs: "100%", sm: "auto" }, 
            justifyContent: "center",
          }}
        >
          {t("backHome")}
          <span
            style={{ display: "flex", alignItems: "center", marginLeft: "8px" }}
          >
            <img src={home} alt="" />
          </span>
        </Button>
      </Box>
    </Box>
  );
};

export default Key;
