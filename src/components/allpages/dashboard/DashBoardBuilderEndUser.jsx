import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
import { GetAssignedChartsOfCurrentUserAPI } from "../../../services/dashboardBuilder/DashboardBuilder";

const BarChart = ({ config }) => {
  const chartData = config?.data?.length
    ? config.data.map((item) => item.value)
    : [120, 200, 150, 80, 70, 110, 130];
  const chartLabels = config?.data?.length
    ? config.data.map((item) => item.label)
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const option = {
    title: {
      text: config?.title || "Bar Chart",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: chartLabels,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: chartData,
        type: "bar",
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

const HeatMap = ({ config }) => {
  const hours = [
    "12a",
    "1a",
    "2a",
    "3a",
    "4a",
    "5a",
    "6a",
    "7a",
    "8a",
    "9a",
    "10a",
    "11a",
    "12p",
    "1p",
    "2p",
    "3p",
    "4p",
    "5p",
    "6p",
    "7p",
    "8p",
    "9p",
    "10p",
    "11p",
  ];
  const days = [
    "Saturday",
    "Friday",
    "Thursday",
    "Wednesday",
    "Tuesday",
    "Monday",
    "Sunday",
  ];

  const data = [];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 24; j++) {
      data.push([j, i, Math.random() * 100]);
    }
  }

  const option = {
    title: {
      text: config?.title || "Heat Map",
      left: "center",
    },
    tooltip: {
      position: "top",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: hours,
      splitArea: { show: true },
    },
    yAxis: {
      type: "category",
      data: days,
      splitArea: { show: true },
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "0%",
    },
    series: [
      {
        name: "Punch Card",
        type: "heatmap",
        data: data,
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

const AreaChart = ({ config }) => {
  const areaLabels = config?.data?.length
    ? config.data.map((item) => item.label)
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const areaSeries = config?.data?.length
    ? [
        {
          name: config?.title || "Series",
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: { focus: "series" },
          data: config.data.map((item) => item.value),
        },
      ]
    : [
        {
          name: "Email",
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: { focus: "series" },
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "Union Ads",
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: { focus: "series" },
          data: [220, 182, 191, 234, 290, 330, 310],
        },
      ];

  const option = {
    title: { left: "center" },
    tooltip: { trigger: "axis" },
    legend: {
      data: areaSeries.map((s) => s.name),
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: [{ type: "category", boundaryGap: false, data: areaLabels }],
    yAxis: [{ type: "value" }],
    series: areaSeries,
  };

  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

const RadarChart = ({ config }) => {
  const radarIndicators = config?.data?.length
    ? config.data.map((item) => ({ name: item.label, max: 10000 }))
    : [
        { name: "Sales", max: 6500 },
        { name: "Administration", max: 16000 },
        { name: "Information Technology", max: 30000 },
      ];

  const radarSeries = config?.data?.length
    ? [
        {
          name: config?.title || "Series",
          type: "radar",
          data: [
            {
              value: config.data.map((item) => item.value),
              name: config?.title || "Data",
            },
          ],
        },
      ]
    : [
        {
          name: "Budget vs spending",
          type: "radar",
          data: [
            {
              value: [4200, 3000, 20000],
              name: "Allocated Budget",
            },
          ],
        },
      ];

  const option = {
    title: { text: config?.title || "Radar Chart", left: "center" },
    radar: { shape: "circle", indicator: radarIndicators },
    series: radarSeries,
  };

  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

const FunnelChart = ({ config }) => {
  const funnelData = config?.data?.length
    ? config.data.map((item) => ({ value: item.value, name: item.label }))
    : [
        { value: 60, name: "Visit" },
        { value: 40, name: "Inquiry" },
        { value: 20, name: "Order" },
      ];

  const option = {
    title: { text: config?.title || "Funnel Chart", left: "center" },
    tooltip: { trigger: "item", formatter: "{a} <br/>{b} : {c}%" },
    legend: { data: funnelData.map((d) => d.name) },
    series: [
      {
        name: "Funnel",
        type: "funnel",
        left: "10%",
        top: 60,
        bottom: 60,
        width: "80%",
        data: funnelData,
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

const ScatterChart = ({ config }) => {
  const scatterData = config?.data?.length
    ? config.data.map((item) => [
        Number(item.label) || 0,
        Number(item.value) || 0,
        50,
      ])
    : Array.from({ length: 50 }, () => [
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
      ]);

  const option = {
    title: { text: config?.title || "Scatter Chart", left: "center" },
    xAxis: {},
    yAxis: {},
    series: [
      {
        symbolSize: (val) => val[2] * 0.5,
        data: scatterData,
        type: "scatter",
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

const PieChart = ({ config }) => {
  const pieData = config?.data?.length
    ? config.data.map((item) => ({ value: item.value, name: item.label }))
    : [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
      ];

  const option = {
    title: {
      text: config?.title || "Pie Chart",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

const DonutChart = ({ config }) => {
  const donutData = config?.data?.length
    ? config.data.map((item) => ({ value: item.value, name: item.label }))
    : [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
      ];

  const option = {
    title: {
      text: config?.title || "Donut Chart",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        data: donutData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

const DataGrid = ({ config }) => {
  return (
    <Box sx={{ p: 2, textAlign: "center", height: "100%", overflow: "auto" }}>
      <Typography variant="h6" gutterBottom>
        {config?.title || "Data Grid"}
      </Typography>
      <Box sx={{ maxHeight: 300, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>ID</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                Value
              </th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {row}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  Item {row}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {Math.floor(Math.random() * 100)}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  <span style={{ color: row % 2 === 0 ? "green" : "orange" }}>
                    {row % 2 === 0 ? "Active" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

const DataCard = ({ config }) => {
  const cardData = config?.data?.length ? config.data[0] : null;
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          {config?.title || "Data Card"}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          {cardData ? cardData.value : config?.value || "1,234"}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          {cardData ? cardData.label : config?.subtitle || "Total Items"}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Skeleton Loader Component
const ChartSkeleton = () => {
  return (
    <Paper
      sx={{
        p: 2,
        position: "relative",
        height: "100%",
        transition: "all 0.3s ease",
      }}
    >
      {/* Title Skeleton */}
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="text" width="60%" height={32} />
      </Box>

      {/* Description Skeleton */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />
      </Box>

      {/* Chart Area Skeleton */}
      <Box
        sx={{ height: 300, display: "flex", flexDirection: "column", gap: 1 }}
      >
        {/* Chart header */}
        <Skeleton variant="rectangular" width="100%" height={30} />

        {/* Chart content with retailer shape */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            gap: 1,
            p: 1,
          }}
        >
          {/* Retailer shape bars - first row */}
          <Skeleton
            variant="rectangular"
            width="12%"
            height="80%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
          <Skeleton
            variant="rectangular"
            width="12%"
            height="60%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
          <Skeleton
            variant="rectangular"
            width="12%"
            height="90%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
          <Skeleton
            variant="rectangular"
            width="12%"
            height="50%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
          <Skeleton
            variant="rectangular"
            width="12%"
            height="70%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
          <Skeleton
            variant="rectangular"
            width="12%"
            height="85%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
          <Skeleton
            variant="rectangular"
            width="12%"
            height="65%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />

          {/* Second row of retailer shape bars */}
          <Skeleton
            variant="rectangular"
            width="12%"
            height="75%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
          <Skeleton
            variant="rectangular"
            width="12%"
            height="55%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
          <Skeleton
            variant="rectangular"
            width="12%"
            height="95%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
          <Skeleton
            variant="rectangular"
            width="12%"
            height="45%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
          <Skeleton
            variant="rectangular"
            width="12%"
            height="65%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
          <Skeleton
            variant="rectangular"
            width="12%"
            height="80%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
          <Skeleton
            variant="rectangular"
            width="12%"
            height="60%"
            sx={{ borderRadius: "4px 4px 0 0" }}
          />
        </Box>

        {/* X-axis labels */}
        <Box sx={{ display: "flex", justifyContent: "space-between", px: 1 }}>
          <Skeleton variant="text" width="12%" height={20} />
          <Skeleton variant="text" width="12%" height={20} />
          <Skeleton variant="text" width="12%" height={20} />
          <Skeleton variant="text" width="12%" height={20} />
          <Skeleton variant="text" width="12%" height={20} />
          <Skeleton variant="text" width="12%" height={20} />
          <Skeleton variant="text" width="12%" height={20} />
        </Box>
      </Box>

      {/* Action buttons skeleton */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
        <Skeleton
          variant="rectangular"
          width={120}
          height={36}
          sx={{ borderRadius: 1 }}
        />
        <Skeleton
          variant="rectangular"
          width={120}
          height={36}
          sx={{ borderRadius: 1 }}
        />
      </Box>
    </Paper>
  );
};

const DashBoardBuilderEndUser = () => {
  const [dashboardItems, setDashboardItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartTypeNameToId = {
    "Bar Chart": "barChart",
    "Heat Map": "heatMap",
    "Area Chart": "areaChart",
    "Radar Chart": "radarChart",
    "Funnel Chart": "funnelChart",
    "Scatter Chart": "scatterChart",
    "Pie Chart": "pieChart",
    "Donut Chart": "donutChart",
    "Data Grid": "dataGrid",
    Card: "card",
  };

  useEffect(() => {
    const fetchAssignedCharts = async () => {
      try {
        setLoading(true);
        const payload = {};
        const res = await GetAssignedChartsOfCurrentUserAPI(payload);
        console.log("Assigned Charts Response:", res?.data?.data);
        if (res?.data?.data && Array.isArray(res.data.data)) {
          const formattedCharts = res.data.data
            .sort(
              (a, b) =>
                a.AssignDetails.SequenceNumber - b.AssignDetails.SequenceNumber
            )
            .map((chart) => {
              const chartTypeId =
                chartTypeNameToId[chart.ChartType?.trim()] || "barChart";
              return {
                id: chart.ChartID,
                type: {
                  id: chartTypeId,
                  name: chart.ChartType || chart.ChartName,
                },
                title: chart.ChartName || chart.ChartType,
                description: chart.ChartDescription,
                config: {
                  title: chart.ChartConfigData?.title || chart.ChartName,
                  value: chart.ChartConfigData?.value,
                  data: chart.ChartConfigData?.data || [],
                  ...chart.ChartConfigData,
                },
                assignDetails: chart.AssignDetails,
              };
            });

          setDashboardItems(formattedCharts);
        }
      } catch (error) {
        console.error("Error fetching assigned charts:", error);
        setError("Failed to load dashboard charts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedCharts();
  }, []);

  const handleDownloadPDF = (item) => {
    const element = document.getElementById(`chart-${item.id}`);
    if (!element) return;

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.text(item.config?.title || item.title, pdfWidth / 2, 20, {
        align: "center",
      });
      pdf.save(`${item.config?.title || item.title}.pdf`);
    });
  };

  const handleDownloadExcel = (item) => {
    let data = [];
    let headers = [];

    switch (item.type.id) {
      case "barChart":
      case "pieChart":
      case "donutChart":
        headers = ["Category", "Value"];
        data = item.config?.data?.length
          ? item.config.data.map((d) => [d.label, d.value])
          : [["No data", 0]];
        break;
      default:
        headers = ["Category", "Value"];
        data = [["No data available", 0]];
    }

    const sheetData = [headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${item.config?.title || item.title}.xlsx`);
  };

  const renderComponent = (item) => {
    switch (item.type.id) {
      case "barChart":
        return <BarChart config={item.config} />;
      case "heatMap":
        return <HeatMap config={item.config} />;
      case "areaChart":
        return <AreaChart config={item.config} />;
      case "radarChart":
        return <RadarChart config={item.config} />;
      case "funnelChart":
        return <FunnelChart config={item.config} />;
      case "scatterChart":
        return <ScatterChart config={item.config} />;
      case "pieChart":
        return <PieChart config={item.config} />;
      case "donutChart":
        return <DonutChart config={item.config} />;
      case "dataGrid":
        return <DataGrid config={item.config} />;
      case "card":
        return <DataCard config={item.config} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="200px" height={40} />
          <Skeleton variant="text" width="300px" height={24} sx={{ mt: 1 }} />
        </Box>

        <Grid container spacing={3}>
          {/* Render 4 skeleton loaders */}
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} md={6} key={item}>
              <ChartSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
          My Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
          View your assigned charts and analytics
        </Typography>
      </Box>

      <Grid container spacing={3} id="dashboard-container">
        {dashboardItems.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Paper
              sx={{
                p: 2,
                position: "relative",
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 3,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {item.title}
                </Typography>
              </Box>

              {item.description && item.description !== "No description" && (
                <Typography
                  variant="body2"
                  sx={{ color: "#666", mb: 2, fontSize: "0.875rem" }}
                >
                  {item.description}
                </Typography>
              )}

              <Box id={`chart-${item.id}`} sx={{ height: 300 }}>
                {renderComponent(item)}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                  gap: 1,
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleDownloadPDF(item)}
                >
                  Download PDF
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleDownloadExcel(item)}
                >
                  Download Excel
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {dashboardItems.length === 0 && (
        <Paper sx={{ p: 5, mt: 5, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#999" }}>
            No charts have been assigned to you yet.
          </Typography>
          <Typography variant="body2" sx={{ color: "#999", mt: 1 }}>
            Please contact your administrator if you believe this is an error.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default DashBoardBuilderEndUser;
