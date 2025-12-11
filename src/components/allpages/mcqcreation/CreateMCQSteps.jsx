import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const CreateMCQSteps = () => {
  const [selectedCard, setSelectedCard] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const savedCard = localStorage.getItem("selectedMCQCard");
    if (savedCard) {
      setSelectedCard(savedCard);
    }
  }, []);

  const handleCardClick = (cardName) => {
    navigate("/testmcqcreation");
    setSelectedCard(cardName);
    localStorage.setItem("selectedMCQCard", cardName);
  };

  return (
    <Box sx={{ p: 3, margin: "20px" }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        {t("MCQCreationTitle")}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 3, color: "#666" }}>
      {t("MCQCreationSubtitle")}
      </Typography>

      <Grid container spacing={3}>
        {/* Manual MCQ Creation */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              "&:hover": { boxShadow: 3 },
              border:
                selectedCard === "Manual MCQ" ? "2px solid #f0f0f0ff" : "none",
            }}
            onClick={() => handleCardClick("Manual MCQ")}
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
                <CreateIcon sx={{ fontSize: 60, color: "black" }} />
              </Box>
              <Box sx={{ p: 2, height: "40%" }}>
                <Typography
                  mt={1}
                  variant="h6"
                  component="h6"
                  gutterBottom
                  sx={{ fontWeight: "600", fontSize: "1rem" }}
                >
                  {t("ManualMCQTitle")}
                  <Typography sx={{ fontSize: 14, color: "#666" }}>
                    {t("ManualMCQDescription")}
                  </Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI MCQ Creation */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              "&:hover": { boxShadow: 3 },
              border:
                selectedCard === "AI MCQ" ? "2px solid #f0f0f0ff" : "none",
            }}
            onClick={() => handleCardClick("AI MCQ")}
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
                <AutoAwesomeIcon sx={{ fontSize: 60, color: "black" }} />
              </Box>
              <Box sx={{ p: 2, height: "40%" }}>
                <Typography
                  mt={1}
                  variant="h6"
                  component="h6"
                  gutterBottom
                  sx={{ fontWeight: "600", fontSize: "1rem" }}
                >
                  {t("AIMCQTitle")}
                  <Typography sx={{ fontSize: 14, color: "#666" }}>
                    {t("AIMCQDescription")}
                  </Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bulk MCQ Upload */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              "&:hover": { boxShadow: 3 },
              border:
                selectedCard === "Bulk MCQ" ? "2px solid #f0f0f0ff" : "none",
            }}
            onClick={() => handleCardClick("Bulk MCQ")}
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
                <CloudUploadIcon sx={{ fontSize: 60, color: "black" }} />
              </Box>
              <Box sx={{ p: 2, height: "40%" }}>
                <Typography
                  mt={1}
                  variant="h6"
                  component="h6"
                  gutterBottom
                  sx={{ fontWeight: "600", fontSize: "1rem" }}
                >
                  {t("BulkMCQTitle")}
                  <Typography sx={{ fontSize: 14, color: "#666" }}>
                    {t("BulkMCQDescription")}
                  </Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateMCQSteps;
