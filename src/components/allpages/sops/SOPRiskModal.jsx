

import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Grid,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import ApexCharts from "react-apexcharts";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { Risk_Dashboard_API } from "../../../services/sopRisk/SOPRisk";
import PropTypes from "prop-types";

const vulnerabilitiesData = {
  series: [{ data: [30, 48, 35, 60, 28] }],
  options: {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#3b82f6"],
    plotOptions: {
      bar: { horizontal: true, borderRadius: 4, barHeight: "18px" },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Encryption Vulnerabilities",
        "Excessive User Permissions",
        "Dormant Accounts",
        "Physical Security",
        "Overly Trusting Employees",
      ],
      labels: { style: { fontSize: "12px" } },
    },
    grid: { show: false },
  },
};

const risksData = {
  series: [{ data: [54, 18, 11, 12, 14] }],
  options: {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#3b82f6"],
    plotOptions: {
      bar: { horizontal: true, borderRadius: 4, barHeight: "18px" },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Add text here",
        "Add text here",
        "Add text here",
        "Add text here",
        "Add text here",
      ],
      labels: { style: { fontSize: "12px" } },
    },
    grid: { show: false },
  },
};

const heatmapOptions = {
  chart: { type: "heatmap", toolbar: { show: false }, height: 160 },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      radius: 0,
      useFillColorAsStroke: true,
      colorScale: {
        ranges: [
          { from: 0, to: 60, color: "#4ade80" },
          { from: 61, to: 100, color: "#fbbf24" },
          { from: 101, to: 150, color: "#fb923c" },
          { from: 151, to: 200, color: "#d63636" },
          { from: 201, to: 500, color: "#991b1b" },
        ],
      },
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Rare", "Unlikely", "Moderate", "Likely", "Almost Certain"],
    labels: { style: { fontSize: "10px" } },
  },
  yaxis: {
    labels: { style: { fontSize: "10px" } },
  },
  legend: { show: false },
};

const heatmapSeries = [
  { name: "Severe", data: [40, 50, 40, 2, 3] },
  { name: "Major", data: [60, 40, 50, 50, 3] },
  { name: "Moderate", data: [50, 108, 150, 160, 104] },
  { name: "Minor", data: [140, 207, 101, 90, 80] },
  { name: "Insignificant", data: [200, 404, 106, 102, 20] },
];

const SOPRiskModal = ({ open, onClose, sopDraftID }) => {
  const [summaryData, setSummaryData] = useState([]);
  const [actionPlanData, setActionPlanData] = useState({
    series: [],
    options: {},
  });
  const [riskRatingData, setRiskRatingData] = useState({
    series: [],
    options: {},
  });
  const [loading, setLoading] = useState(false);

  // console.log("SOPRiskModal sopDraftID",sopDraftID);
  useEffect(() => {
    if (open && sopDraftID) {
      setLoading(true); // Start loading
      const payload = { SOPDraftID: sopDraftID };
      Risk_Dashboard_API(payload)
        .then((res) => {
          const summary = res?.data?.data?.summary || {};
          const action = res?.data?.data?.actionPlanData || {};
          const breakdown = res?.data?.data?.riskbreakdownData || {};

          setSummaryData([
            { label: "Total No of Risk", value: summary.totalRisks || 0 },
            {
              label: "Risk Analysis Progress",
              value: summary.riskAnalysisProgress || 0,
            },
            { label: "Closed Risk", value: summary.closedRisks || 0 },
            {
              label: "Response InProgress Count",
              value: summary.responseInProgress || 0,
            },
            {
              label: "High Priority Risk",
              value: summary.highPriorityRisks || 0,
            },
          ]);

          setActionPlanData({
            series: action.counts || [],
            options: {
              chart: { type: "donut" },
              labels: action.labels || [],
              colors: ["#fb923c", "#4ade80", "#facc15", "#22c55e"],
              legend: { position: "bottom", fontSize: "12px" },
              dataLabels: { enabled: false },
              tooltip: { enabled: true },
            },
          });

          setRiskRatingData({
            series: breakdown.counts || [],
            options: {
              chart: { type: "donut" },
              labels: breakdown.labels || [],
              colors: ["#4ade80", "#fbbf24", "#d63636"],
              legend: { position: "bottom", fontSize: "12px" },
              dataLabels: { enabled: false },
              tooltip: { enabled: true },
            },
          });
        })
        .catch((err) => {
          console.error("Risk Dashboard API Error:", err);
        })
        .finally(() => {
          setLoading(false); // Stop loading
        });
    }
  }, [open, sopDraftID]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "#4F46E5",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1.5,
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        Risk Analysis
        <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />

      {loading ? (
        // Loader centered inside modal content area
        <Box
          sx={{
            height: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            background: (theme) => theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: 1,
            p: 4,
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: (theme) => theme.palette.primary.main,
              animationDuration: "800ms",
              mb: 2,
            }}
          />

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: "medium",
              textAlign: "center",
              maxWidth: 300,
            }}
          >
            Fetching Risk Dashboard Data...
          </Typography>

          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            This may take a few moments
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              bgcolor: "#4F46E5",
              color: "white",
              py: 1,
              px: 2,
              fontWeight: "bold",
              paddingTop: 3,
            }}
          >
            {summaryData.map(({ label, value }) => (
              <Box
                key={label}
                sx={{ textAlign: "center", minWidth: 140, fontSize: "0.85rem" }}
              >
                <Typography sx={{ fontSize: "1.6rem" }}>{value}</Typography>
                <Typography sx={{ fontSize: "0.75rem", mt: 0.5 }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{ p: 1.5, height: "100%", borderColor: "#e0e7ff" }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1, fontSize: "0.9rem" }}
                  >
                    Top 5 Vulnerabilities
                  </Typography>
                  <ApexCharts
                    options={vulnerabilitiesData.options}
                    series={vulnerabilitiesData.series}
                    type="bar"
                    height={220}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{ p: 1.5, height: "100%", borderColor: "#e0e7ff" }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1, fontSize: "0.9rem" }}
                  >
                    Top 5 Risks
                  </Typography>
                  <ApexCharts
                    options={risksData.options}
                    series={risksData.series}
                    type="bar"
                    height={220}
                  />
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={3.5}>
                <Paper
                  variant="outlined"
                  sx={{ p: 1.5, borderColor: "#e0e7ff", height: "100%" }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: "0.85rem",
                      textAlign: "center",
                    }}
                  >
                    Action Plan Breakdown
                  </Typography>
                  <ApexCharts
                    options={actionPlanData.options}
                    series={actionPlanData.series}
                    type="donut"
                    height={160}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper
                  variant="outlined"
                  sx={{ p: 1.5, borderColor: "#e0e7ff", height: "100%" }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: "0.85rem",
                      textAlign: "center",
                    }}
                  >
                    Risk Heat Map
                  </Typography>
                  <ApexCharts
                    options={heatmapOptions}
                    series={heatmapSeries}
                    type="heatmap"
                    height={160}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} md={3.5}>
                <Paper
                  variant="outlined"
                  sx={{ p: 1.5, borderColor: "#e0e7ff", height: "100%" }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: "0.85rem",
                      textAlign: "center",
                    }}
                  >
                    Risk Rating Breakdown
                  </Typography>
                  <ApexCharts
                    options={riskRatingData.options}
                    series={riskRatingData.series}
                    type="donut"
                    height={160}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Dialog>
  );
};

export default SOPRiskModal;

SOPRiskModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sopDraftID: PropTypes.string.isRequired,
};
