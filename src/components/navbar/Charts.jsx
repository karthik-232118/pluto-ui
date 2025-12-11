import { useState } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  TextField,
  Card,
  FormControlLabel,
  Switch,
  CircularProgress,
  Button,
  ButtonGroup,
} from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import Aisvg from "../../assets/svg/navbar/AisvgBlue.svg";
import gptSend from "../../assets/svg/navbar/gptSend.svg";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useTranslation } from "react-i18next";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const Charts = () => {
  const [search, setSearch] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [isPieChart, setIsPieChart] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataAvailable, setIsDataAvailable] = useState(true);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedClip, setSelectedClip] = useState(null);
  const [error, setError] = useState(null);
  console.log("Charts component rendered", successMessage);
  const [chartLabels, setChartLabels] = useState([]);
  const [chartValues, setChartValues] = useState([]);
  const { t } = useTranslation(); // Assuming you have a translation function
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#F7464A",
    "#D4AF37",
    "#00A36C",
    "#8A2BE2",
  ];

  const pieData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Value",
        data: chartValues,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Value",
        data: chartValues,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 2,
      },
    ],
  };
  const generateMockData = (query) => {
    const words = query.split(" ").filter((word) => word.length > 0);
    return {
      series: [
        {
          name: words
            .slice(0, 5)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1)),
          data: words
            .slice(0, 5)
            .map((_, i) => Math.floor(Math.random() * 100) + 1),
        },
      ],
    };
  };
  const handleGetResponse = async () => {
    if (!search) return;
    setIsLoading(true);
    setIsDataAvailable(true);
    setSuccessMessage("");
    setError(null);

    try {
      setLastSearchQuery(search);
        const access_token = localStorage.getItem("access_token");

        const payload = {
          query: search,
          module_name: selectedClip || "all",
          access_token: access_token,
        };
        let res;
        try {
          res = await axios.post(
            process.env.VITE_ANALYSIS_URL,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("API Response:", res.data);
        if (res.data.error === "No data available for the given query.") {
          setShowChart(false);
          setIsDataAvailable(false);
          setError(res.data.error); 
          return;
        }
      } catch (apiError) {
        console.warn("Primary API failed, using mock data:", apiError);
        res = { data: generateMockData(search) };
        setError("API unavailable - showing mock data");
      }

      const series = res?.data?.series;
      if (
        Array.isArray(series) &&
        series?.length > 0 &&
        series[0]?.name?.length > 0
      ) {
        setChartLabels(series[0]?.name || []);
        setChartValues(series[0]?.data || []);
        setShowChart(true);
        setIsDataAvailable(true);
        setSuccessMessage("Successfully Generated ✅");
      } else {
        setShowChart(false);
        setIsDataAvailable(false);
        setError(res.data.error || "No data available"); 
      }

      setSearch("");
    } catch (error) {
      console.error("Error:", error?.response?.data || error.message);
      setShowChart(false);
      setIsDataAvailable(false);
      setError(
        error?.response?.data?.error ||
          "Failed to fetch data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e?.key === "Enter") {
      e.preventDefault();
      handleGetResponse();
    }
  };
  const handleSendClick = () => {
    handleGetResponse();
  };
  const handleClipSelect = (clip) => {
    setSelectedClip(clip === selectedClip ? null : clip);
  };

  return (
    <Card
      sx={{
        padding: "1.5rem",
        marginTop: "1.5rem",
        borderRadius: "12px",
        textAlign: "center",
        backgroundColor: "#ffffff",
        width: "800px",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          mt: -1,
          display: "flex",
          justifyContent: "space-between",
          mb: 0.5,
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "700", color: "#333" }}>
          {t("charts")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginTop: "-5px",
          }}
        >
          <ButtonGroup variant="outlined" size="small">
            {[
              t("SOP"),
              t("Document"),
              t("TestMCQ"),
              t("SkillAssessment"),
              t("SkillBuilding"),
            ].map((clip) => (
              <Button
                key={clip}
                onClick={() => handleClipSelect(clip)}
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  textTransform: "none",
                  color: selectedClip === clip ? "#fff" : "#555",
                  backgroundColor:
                    selectedClip === clip ? "#36A2EB" : "transparent",
                  borderColor: "#ddd",
                  "&:hover": {
                    borderColor: "#bbb",
                    backgroundColor:
                      selectedClip === clip ? "#2d8ed6" : "#f5f5f5",
                  },
                  px: 1.5,
                  py: 0.5,
                }}
              >
                {clip}
              </Button>
            ))}
          </ButtonGroup>

          <FormControlLabel
            control={
              <Switch
                checked={isPieChart}
                onChange={() => setIsPieChart(!isPieChart)}
                size="small"
              />
            }
            label={
              <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                {isPieChart ? t("chartTypePie") : t("chartTypeBar")}
              </Typography>
            }
            sx={{ ml: 1 }}
          />
        </Box>
      </Box>
      <Box>
        <TextField
          placeholder={t("searchPlaceholderGPT")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <img src={Aisvg} alt="AI" style={{ width: 20, height: 20 }} />
            ),
            endAdornment: (
              <img
                src={gptSend}
                alt="Send"
                style={{ cursor: "pointer" }}
                onClick={handleSendClick}
              />
            ),
            style: {
              height: "45px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              width: "750px",
            },
          }}
        />
        {lastSearchQuery && (
          <Box
            sx={{
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #68CE6D80",
              backgroundColor: "#68CE6D0A",
              height: "auto",
              display: "flex",
              justifyContent: "start",
              padding: "10px 10px 0px 10px",
            }}
          >
            <Typography sx={{ fontSize: "14px", color: "#555" }}>
              <strong style={{ color: "green" }}>Searched For:</strong>{" "}
              {lastSearchQuery}
            </Typography>
            {selectedClip && (
              <Typography sx={{ fontSize: "14px", color: "#555", ml: 2 }}>
                <strong style={{ color: "#36A2EB" }}>{t("module")}</strong>{" "}
                {selectedClip}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {isLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "center",
            marginTop: "0.5rem",
          }}
        >
          <CircularProgress size={20} />
          <Typography variant="body2">
            {t("loadingGPT")}
          </Typography>
        </Box>
      )}

      {error && (
        <Typography sx={{ mt: 2, color: "orange" }}>{error}</Typography>
      )}

      {!isLoading && !isDataAvailable && !error && (
        <Typography sx={{ mt: 2, color: "red" }}>{t("noDataFound")}</Typography>
      )}

      {/* Welcome message that shows before any API call */}
      {!isLoading && !showChart && !lastSearchQuery && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "400px",
            width: "100%",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            mt: 2,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
            }}
          >
            <img
              src={Aisvg}
              alt="AI"
              style={{ width: 40, height: 40, marginRight: "10px" }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: "600", color: "#333", fontSize: "1.2rem" }}
            >
              {t("greeting")}, {"I'm"} {t("titleGPT")}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ color: "#555", fontSize: "0.9rem", textAlign: "center" }}
          >
            {t("How Can I help")}
          </Typography>
        </Box>
      )}
      {!isLoading && isDataAvailable && showChart && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            mt: 0,
            width: "100%",
            height: "auto",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "600px",
              height: "400px",
            }}
          >
            {isPieChart ? <Pie data={pieData} /> : <Bar data={barData} />}
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default Charts;
