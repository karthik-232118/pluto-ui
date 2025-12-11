import  { useState } from "react";
import { Container, Box, Typography, Switch } from "@mui/material";
import GptCard from "./GptCard";  
import Charts from "./Charts"; 
import { useTranslation } from "react-i18next";

const SearchGpt = () => {
  const { t } = useTranslation(); // Assuming you have a translation function
  const [showGpt, setShowGpt] = useState(true);
  const handleSwitchChange = () => {
    setShowGpt((prev) => !prev);
  };
  return (
    <Container>
      <Box
        display="flex"
        justifyContent="end" 
        alignItems="center"
        gap="0px"             
        sx={{ width: "100%",marginTop:"-20px"}} 
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: "#333",       
          }}
        >
         {t("gptTab")}
        </Typography>
        <Switch
          checked={!showGpt}
          onChange={handleSwitchChange}
          color="success"        // or "primary", "secondary", etc.
          sx={{
            "& .MuiSwitch-track": {
              backgroundColor: !showGpt ? "#68CE6D80" : "#ccc",
            },
            "& .MuiSwitch-thumb": {
              color: !showGpt ? "#68CE6D" : "#fff",
            },
          }}
        />

        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: "#333",
          }}
        >
      {t("analyticsTab")}
        </Typography>
      </Box>
      {showGpt ? <GptCard /> : <Charts />}
    </Container>
  );
};

export default SearchGpt;
