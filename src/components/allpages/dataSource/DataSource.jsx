import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import CloudIcon from "@mui/icons-material/Cloud";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DatabaseIcon from "@mui/icons-material/DataObject";
import InternalDB from "./InternalDB";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DataSource = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [selectedCard, setSelectedCard] = useState("");

  // Load selected card from localStorage on component mount
  useEffect(() => {
    const savedCard = localStorage.getItem("selectedDataSource");
    if (savedCard) {
      setSelectedCard(savedCard);
    }
  }, []);

const dataSources = [
  {
    id: 1,
    title: t("internalDB_title"),
    description: t("internalDB_description"),
    icon: <StorageIcon sx={{ fontSize: 60, color: "black" }} />,
  },
  {
    id: 2,
    title: t("externalDB_title"),
    description: t("externalDB_description"),
    icon: <DatabaseIcon sx={{ fontSize: 60, color: "black" }} />,
  },
  {
    id: 3,
    title: t("externalAPI_title"),
    description: t("externalAPI_description"),
    icon: <CloudIcon sx={{ fontSize: 60, color: "black" }} />,
  },
  {
    id: 4,
    title: t("uploadFile_title"),
    description: t("uploadFile_description"),
    icon: <UploadFileIcon sx={{ fontSize: 60, color: "black" }} />,
  },
  {
    id: 5,
    title: t("otherSources_title"),
    description: t("otherSources_description"),
    icon: <MoreHorizIcon sx={{ fontSize: 60, color: "black" }} />,
  },
];


  const handleCardClick = (sourceId) => {
    console.log(`Selected data source: ${sourceId}`);
    setSelectedCard(`source-${sourceId}`);
    localStorage.setItem("selectedDataSource", `source-${sourceId}`);

    // Navigate to appropriate page based on sourceId
    switch (sourceId) {
      case 1:
        navigate("/internal-db");
        break;
      case 2:
        navigate("/external-db");
        break;
      case 3:
        navigate("/external-api");
        break;
      case 4:   
        navigate("/upload-file");
        break;
      case 5:
        navigate("/other-sources");
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ p: 3, margin: "20px" }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        {t("selectDataSource")}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 3, color: "#666" }}>
        {t("chooseDataSource")}
      </Typography>
      <Grid container spacing={3}>
        {dataSources.map((source) => (
          <Grid item xs={12} sm={6} md={3} key={source.id}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                "&:hover": { boxShadow: 3 },
                border:
                  selectedCard === `source-${source.id}`
                    ? "2px solid #f0f0f0ff"
                    : "none",
              }}
              onClick={() => handleCardClick(source.id)}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  p: 0,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    bgcolor: "#e8edf0",
                    py: 4,
                    height: "60%",
                  }}
                >
                  {source.icon}
                </Box>
                <Box sx={{ p: 2, height: "40%" }}>
                  <Typography
                    mt={1}
                    variant="h6"
                    component="h6"
                    gutterBottom
                    sx={{ fontWeight: "600", fontSize: "1rem" }}
                  >
                    {source.title}
                    <Typography sx={{ fontSize: 14, color: "#666" }}>
                      {source.description}
                    </Typography>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DataSource;
