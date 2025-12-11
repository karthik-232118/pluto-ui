import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { WorkOutline as WorkflowIcon } from "@mui/icons-material";
import InsightsIcon from "@mui/icons-material/Insights";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import SchemaIcon from "@mui/icons-material/Schema";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Navigate, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const SOPCreationSeteps = () => {
  const [selectedCard, setSelectedCard] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    const savedCard = localStorage.getItem("selectedSOPCard");
    if (savedCard) {
      setSelectedCard(savedCard);
    }
  }, []);

  const handleCardClick = (cardName) => {
    navigate("/sop-creation");
    setSelectedCard(cardName);

    localStorage.setItem("selectedSOPCard", cardName);
    console.log(`Selected card: ${cardName}`);
  };

  return (
    <Box sx={{ p: 3, margin: "20px" }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        {t("sopWorkflow")}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 3, color: "#666" }}>
        {t("createSopSteps")}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              "&:hover": { boxShadow: 3 },
              border:
                selectedCard === "SOP with BPMN"
                  ? "2px solid #f0f0f0ff"
                  : "none",
            }}
            onClick={() => handleCardClick("SOP with BPMN")}
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
                <InsightsIcon sx={{ fontSize: 60, color: "black" }} />
              </Box>
              <Box sx={{ p: 2, height: "40%" }}>
                {" "}
                <Typography
                  mt={1}
                  variant="h6"
                  component="h6"
                  gutterBottom
                  sx={{ fontWeight: "600", fontSize: "1rem" }}
                >
                  {t("buildSop")}
                  <Typography sx={{ fontSize: 14, color: "#666" }}>
                    {t("connectorsInfo")}
                  </Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Connector Files Card */}
        {/* <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              "&:hover": { boxShadow: 3 },
              border:
                selectedCard === "SOP with workflow"
                  ? "2px solid #ffffffff"
                  : "none",
            }}
            onClick={() => handleCardClick("SOP with workflow")}
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
                <SchemaIcon sx={{ fontSize: 60, color: "black" }} />
              </Box>
              <Box sx={{ p: 2, height: "40%" }}>
                {" "}
                <Typography
                  mt={1}
                  variant="h6"
                  component="h6"
                  gutterBottom
                  sx={{ fontWeight: "600", fontSize: "1rem" }}
                >
                  {t("buildSopWithWorkflow")}
                  <Typography sx={{ fontSize: 14, color: "#666" }}>
                    {t("viewManageWorkflow")}
                  </Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              "&:hover": { boxShadow: 3 },
              border:
                selectedCard === "BPMN with AI"
                  ? "2px solid #ffffffff"
                  : "none",
            }}
            onClick={() => handleCardClick("BPMN with AI")}
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
                {" "}
                <Typography
                  mt={1}
                  variant="h6"
                  component="h6"
                  gutterBottom
                  sx={{ fontWeight: "600", fontSize: "1rem" }}
                >
                  {t("generatedFromAi")}
                  <Typography sx={{ fontSize: 14, color: "#666" }}>
                    {t("generateAiWorkflows")}
                  </Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Import BPMN Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              "&:hover": { boxShadow: 3 },
              border:
                selectedCard === "Import BPMN" ? "2px solid #ffffffff" : "none",
            }}
            onClick={() => handleCardClick("Import BPMN")}
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
                <FileUploadIcon sx={{ fontSize: 60, color: "black" }} />
              </Box>
              <Box sx={{ p: 2, height: "40%" }}>
                {" "}
                <Typography
                  mt={1}
                  variant="h6"
                  component="h6"
                  gutterBottom
                  sx={{ fontWeight: "600", fontSize: "1rem" }}
                >
                  {t("importBpmn")}/visio
                  <Typography sx={{ fontSize: 14, color: "#666" }}>
                {t("importExistingBpmn")}/visio
                  </Typography>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              cursor: "pointer",
              "&:hover": { boxShadow: 3 },
              border:
                selectedCard === "SOP Template"
                  ? "2px solid #ffffffff"
                  : "none",
            }}
            onClick={() => handleCardClick("SOP Template")}
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
                <DriveFolderUploadIcon sx={{ fontSize: 60, color: "black" }} />
              </Box>
              <Box sx={{ p: 2, height: "40%" }}>
                <Typography
                  mt={1}
                  variant="h6"
                  component="h6"
                  gutterBottom
                  sx={{ fontWeight: "600", fontSize: "1rem" }}
                >
                 {t("sopTemplate")}
                  <Typography sx={{ fontSize: 14, color: "#666" }}>
                   {t("useSopTemplate")}
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

export default SOPCreationSeteps;
