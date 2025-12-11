import { useState, useRef, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  BarChart as BarChartIcon,
  Map as MapIcon,
  PieChart as PieChartIcon,
  DonutLarge as DonutIcon,
  TableChart as TableIcon,
  Dashboard as DashboardIcon,
  ScatterPlot as ScatterIcon,
  ShowChart as AreaChartIcon,
  Public as RadarIcon,
  Filter as FunnelIcon,
  DragIndicator as DragIcon,
  Assignment,
} from "@mui/icons-material";
import SettingsDrawer from "./SettingsDrawer";
import AddComponentModal from "./AddComponentModal";
import { useTranslation } from "react-i18next";
import AssignModal from "./AssignModal";
import {
  CreateDynamicChartApi,
  GetAllDynamicChartApi,
  GetDynamicChartByIdApi,
  DeleteDynamicChartApi,
} from "../../../services/dashboardBuilder/DashboardBuilder";

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
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: "category",
      data: days,
      splitArea: {
        show: true,
      },
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
        label: {
          show: false,
        },
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
  // Use config.data if present
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
          emphasis: {
            focus: "series",
          },
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "Union Ads",
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: "Video Ads",
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: "Direct",
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: "Search Engine",
          type: "line",
          stack: "Total",
          label: {
            show: true,
            position: "top",
          },
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ];
  const option = {
    title: { text: config?.title || "Area Chart", left: "center" },
    tooltip: { trigger: "axis" },
    legend: {
      data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
    },
    toolbox: { feature: { saveAsImage: {} } },
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
  // Use config.data if present
  const radarIndicators = config?.data?.length
    ? config.data.map((item) => ({ name: item.label, max: 10000 }))
    : [
        { name: "Sales", max: 6500 },
        { name: "Administration", max: 16000 },
        { name: "Information Technology", max: 30000 },
        { name: "Customer Support", max: 38000 },
        { name: "Development", max: 52000 },
        { name: "Marketing", max: 25000 },
      ];
  const radarSeries = config?.data?.length
    ? [
        {
          name: config?.title || "Series",
          type: "radar",
          data: [
            {
              value: config.data.map((item) => item.value),
              name: config?.title || "Static",
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
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: "Allocated Budget",
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: "Actual Spending",
            },
          ],
        },
      ];
  const option = {
    title: { text: config?.title || "Radar Chart", left: "center" },
    legend: { data: ["Allocated Budget", "Actual Spending"] },
    radar: { shape: "circle", indicator: radarIndicators },
    series: radarSeries,
  };
  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

const FunnelChart = ({ config }) => {
  // Use config.data if present
  const funnelData = config?.data?.length
    ? config.data.map((item) => ({ value: item.value, name: item.label }))
    : [
        { value: 60, name: "Visit" },
        { value: 40, name: "Inquiry" },
        { value: 20, name: "Order" },
        { value: 80, name: "Click" },
        { value: 100, name: "Show" },
      ];
  const option = {
    title: { text: config?.title || "Funnel Chart", left: "center" },
    tooltip: { trigger: "item", formatter: "{a} <br/>{b} : {c}%" },
    toolbox: {
      feature: { dataView: { readOnly: false }, restore: {}, saveAsImage: {} },
    },
    legend: { data: funnelData.map((d) => d.name) },
    series: [
      {
        name: "Funnel",
        type: "funnel",
        left: "10%",
        top: 60,
        bottom: 60,
        width: "80%",
        min: 0,
        max: 100,
        minSize: "0%",
        maxSize: "100%",
        sort: "descending",
        gap: 2,
        label: { show: true, position: "inside" },
        labelLine: { length: 10, lineStyle: { width: 1, type: "solid" } },
        itemStyle: { borderColor: "#fff", borderWidth: 1 },
        emphasis: { label: { fontSize: 20 } },
        data: funnelData,
      },
    ],
  };
  return (
    <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
  );
};

const ScatterChart = ({ config }) => {
  // Use config.data if present
  const scatterData = config?.data?.length
    ? config.data.map((item) => [
        Number(item.label) || 0,
        Number(item.value) || 0,
        50, // default size
      ])
    : (() => {
        const arr = [];
        for (let i = 0; i < 100; i++) {
          arr.push([
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100),
          ]);
        }
        return arr;
      })();
  const option = {
    title: { text: config?.title || "Scatter Chart", left: "center" },
    xAxis: {},
    yAxis: {},
    series: [
      {
        symbolSize: function (val) {
          return val[2] * 0.5;
        },
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
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
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
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
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
      <Box
        sx={{
          maxHeight: 300,
          overflow: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => (
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

const CreateDashboard = () => {
  const [dashboardItems, setDashboardItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedChartId, setSelectedChartId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { t } = useTranslation();
  const chartRefs = useRef({});

  useEffect(() => {
    if (selectedChartId) {
      const fetchChartById = async () => {
        try {
          const payload = { ChartID: selectedChartId };
          const response = await GetDynamicChartByIdApi(payload);
          console.log("GetDynamicChartByIdApi response:", response?.data);
        } catch (error) {
          console.error("Error fetching chart by ID:", error);
        }
      };
      fetchChartById();
    }
  }, [selectedChartId]);

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
    const fetchDynamicCharts = async () => {
      setLoading(true);
      try {
        const payload = {};
        console.log("Fetching dynamic charts...");

        const response = await GetAllDynamicChartApi(payload);
      
        if (response.data && Array.isArray(response.data.data)) {
          response.data.data.forEach((chart) => {
            // console.log(
            //   "ChartType:",
            //   chart.ChartType,
            //   "ChartID:",
            //   chart.ChartID
            // );
          });
        }
        if (response.data && Array.isArray(response.data.data)) {
          setDashboardItems((prevItems) => {
            const existingIds = new Set(prevItems.map((item) => item.id));
            const apiCharts = response.data.data
              .filter((chart) => !existingIds.has(chart.ChartID))
              .map((chart, index) => {
                const chartTypeId =
                  chartTypeNameToId[chart.ChartType?.trim()] ||
                  chartTypeNameToId[chart.chartType?.trim()] ||
                  "barChart";
                return {
                  id: chart.ChartID,
                  type: {
                    id: chartTypeId,
                    name:
                      chart.ChartType ||
                      chart.chartType ||
                      `Chart ${index + 1}`,
                  },
                  title: chart.title || `Dynamic Chart ${index + 1}`,
                  config: {
                    title: chart.title || `Dynamic Chart ${index + 1}`,
                    data: chart.data || [],
                    ...chart.config,
                  },
                  source: "api",
                };
              });
            if (apiCharts.length > 0) {
              setSnackbar({
                open: true,
                message: `Loaded ${apiCharts.length} dynamic charts from API`,
                severity: "success",
              });
            }
            return [...prevItems, ...apiCharts];
          });
        }
      } catch (error) {
        console.error("Error fetching dynamic charts:", error);
        setSnackbar({
          open: true,
          message: "Failed to load dynamic charts",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicCharts();
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
    let sheetData = [];
    switch (item.type.id) {
      case "barChart":
        headers = ["Day", "Value"];
        if (item.config?.data?.length) {
          data = item.config.data.map((d) => [d.label, d.value]);
        } else {
          data = [
            ["Mon", 120],
            ["Tue", 200],
            ["Wed", 150],
            ["Thu", 80],
            ["Fri", 70],
            ["Sat", 110],
            ["Sun", 130],
          ];
        }
        break;

      case "pieChart":
      case "donutChart":
        headers = ["Category", "Value"];
        if (item.config?.data?.length) {
          data = item.config.data.map((d) => [d.label, d.value]);
        } else {
          data = [
            ["Search Engine", 1048],
            ["Direct", 735],
            ["Email", 580],
            ["Union Ads", 484],
            ["Video Ads", 300],
          ];
        }
        break;

      case "areaChart":
        if (item.config?.data?.length) {
          headers = ["Category", "Value"];
          data = item.config.data.map((d) => [d.label, d.value]);
        } else {
          headers = [
            "Day",
            "Email",
            "Union Ads",
            "Video Ads",
            "Direct",
            "Search Engine",
          ];
          data = [
            ["Mon", 120, 220, 150, 320, 820],
            ["Tue", 132, 182, 232, 332, 932],
            ["Wed", 101, 191, 201, 301, 901],
            ["Thu", 134, 234, 154, 334, 934],
            ["Fri", 90, 290, 190, 390, 1290],
            ["Sat", 230, 330, 330, 330, 1330],
            ["Sun", 210, 310, 410, 320, 1320],
          ];
        }
        break;

      case "radarChart":
        if (item.config?.data?.length) {
          headers = ["Metric", "Value"];
          data = item.config.data.map((d) => [d.label, d.value]);
        } else {
          headers = ["Metric", "Allocated Budget", "Actual Spending"];
          data = [
            ["Sales", 4200, 5000],
            ["Administration", 3000, 14000],
            ["Information Technology", 20000, 28000],
            ["Customer Support", 35000, 26000],
            ["Development", 50000, 42000],
            ["Marketing", 18000, 21000],
          ];
        }
        break;

      case "funnelChart":
        headers = ["Stage", "Conversion Rate (%)"];
        if (item.config?.data?.length) {
          data = item.config.data.map((d) => [d.label, d.value]);
        } else {
          data = [
            ["Visit", 60],
            ["Inquiry", 40],
            ["Order", 20],
            ["Click", 80],
            ["Show", 100],
          ];
        }
        break;

      case "scatterChart":
        headers = ["X", "Y", "Size"];
        if (item.config?.data?.length) {
          data = item.config.data.map((d) => [d.label, d.value, 50]);
        } else {
          data = Array.from({ length: 30 }, () => [
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100),
          ]);
        }
        break;

      case "heatMap": {
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
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        headers = ["Day", "Hour", "Value"];
        data = [];
        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 24; j++) {
            data.push([days[i], hours[j], Math.round(Math.random() * 100)]);
          }
        }
        break;
      }

      case "dataGrid":
        headers = ["ID", "Name", "Value", "Status"];
        data = Array.from({ length: 10 }, (_, i) => [
          i + 1,
          `Item ${i + 1}`,
          Math.floor(Math.random() * 100),
          (i + 1) % 2 === 0 ? "Active" : "Pending",
        ]);
        break;

      case "card":
        headers = ["Metric", "Value"];
        if (item.config?.data?.length) {
          data = item.config.data.map((d) => [d.label, d.value]);
        } else {
          data = [
            [item.config?.subtitle || "Total Items", item.config?.value || "0"],
          ];
        }
        break;

      default:
        headers = ["Category", "Value"];
        data = [["No data available", 0]];
    }
    sheetData = [headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${item.config?.title || item.title}.xlsx`);
  };
  const componentTypes = [
    { id: "barChart", name: t("barChart"), icon: <BarChartIcon /> },
    { id: "heatMap", name: t("heatMap"), icon: <MapIcon /> },
    { id: "areaChart", name: t("areaChart"), icon: <AreaChartIcon /> },
    { id: "radarChart", name: t("radarChart"), icon: <RadarIcon /> },
    { id: "funnelChart", name: t("funnelChart"), icon: <FunnelIcon /> },
    { id: "scatterChart", name: t("scatterChart"), icon: <ScatterIcon /> },
    { id: "pieChart", name: t("pieChart"), icon: <PieChartIcon /> },
    { id: "donutChart", name: t("donutChart"), icon: <DonutIcon /> },
    { id: "dataGrid", name: t("dataGrid"), icon: <TableIcon /> },
    { id: "card", name: t("card"), icon: <DashboardIcon /> },
  ];

  const addComponent = (type) => {
    const staticTypes = ["card", "barChart", "pieChart", "donutChart"];
    const newItem = {
      id: Date.now(),
      type,
      title: type.name,
      config: {
        title: type.name,
        value: Math.floor(Math.random() * 10000).toLocaleString(),
        ...(staticTypes.includes(type.id) ? { data: [] } : {}),
      },
    };
    setDashboardItems([...dashboardItems, newItem]);
    setAddMenuOpen(false);
  };

  const removeComponent = async (id) => {
    try {
      await DeleteDynamicChartApi({ ChartID: id });
      setDashboardItems(dashboardItems.filter((item) => item.id !== id));
      setSnackbar({
        open: true,
        message: "Chart deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete chart",
        severity: "error",
      });
      console.error("Error deleting chart:", error);
    }
  };

  const openSettings = (item) => {
    setSelectedItem(item);
    setSettingsOpen(true);
  };

  const handleSettingsSave = () => {
    if (selectedItem) {
      setDashboardItems(
        dashboardItems.map((item) =>
          item.id === selectedItem.id ? selectedItem : item
        )
      );
    }
    setSettingsOpen(false);
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem(index);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverItem(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedItem !== null && draggedItem !== dropIndex) {
      const items = [...dashboardItems];
      const draggedItemData = items[draggedItem];
      items.splice(draggedItem, 1);
      const newDropIndex = draggedItem < dropIndex ? dropIndex - 1 : dropIndex;
      items.splice(newDropIndex, 0, draggedItemData);
      setDashboardItems(items);
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
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

  const handleConfigChange = (key, value) => {
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        config: {
          ...selectedItem.config,
          [key]: value,
        },
      });
    }
  };
  const handleSourceDataSelect = (dataSourceId) => {
    console.log("Selected DataSourceID in CreateDashboard:", dataSourceId);
  };

  const handleSaveChart = async (chartDetails) => {
    try {
      const response = await CreateDynamicChartApi(chartDetails);
      console.log("Chart saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving chart:", error);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            {t("interactiveDashboard")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                const dashboard = document.getElementById(
                  "dashboard-container"
                );
                if (!dashboard) return;

                html2canvas(dashboard, {
                  scrollY: -window.scrollY,
                  height: dashboard.scrollHeight,
                  windowHeight: dashboard.scrollHeight,
                  backgroundColor: null,
                  removeContainer: true,
                  scale: 2,
                  logging: false,
                  onclone: (document) => {
                    const container = document.getElementById(
                      "dashboard-container"
                    );
                    if (container) {
                      container.style.backgroundColor = "transparent";
                    }
                  },
                }).then((canvas) => {
                  const imgData = canvas.toDataURL("image/png");
                  const pdf = new jsPDF("l", "mm", "a4");
                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const pdfHeight = pdf.internal.pageSize.getHeight();
                  const imgWidth = canvas.width;
                  const imgHeight = canvas.height;
                  const ratio = Math.min(
                    pdfWidth / imgWidth,
                    pdfHeight / imgHeight
                  );
                  const totalPages = Math.ceil((imgHeight * ratio) / pdfHeight);
                  for (let page = 0; page < totalPages; page++) {
                    if (page > 0) pdf.addPage();

                    const srcY = page * (pdfHeight / ratio);
                    const sliceHeight = Math.min(
                      pdfHeight / ratio,
                      imgHeight - srcY
                    );
                    const tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = canvas.width;
                    tmpCanvas.height = sliceHeight;
                    const ctx = tmpCanvas.getContext("2d");
                    ctx.drawImage(
                      canvas,
                      0,
                      srcY,
                      canvas.width,
                      sliceHeight,
                      0,
                      0,
                      canvas.width,
                      sliceHeight
                    );

                    const sliceData = tmpCanvas.toDataURL("image/png");
                    pdf.addImage(
                      sliceData,
                      "PNG",
                      0,
                      0,
                      pdfWidth,
                      sliceHeight * ratio
                    );
                  }

                  pdf.save("complete-dashboard.pdf");
                });
              }}
              sx={{ borderRadius: 2 }}
            >
              {t("downloadAllPDF")}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                const wb = XLSX.utils.book_new();
                dashboardItems.forEach((item, index) => {
                  let data = [];
                  let headers = [];
                  switch (item.type.id) {
                    case "barChart":
                      headers = ["Day", "Value"];
                      if (item.config?.data?.length) {
                        data = item.config.data.map((d) => [d.label, d.value]);
                      } else {
                        data = [
                          ["Mon", 120],
                          ["Tue", 200],
                          ["Wed", 150],
                          ["Thu", 80],
                          ["Fri", 70],
                          ["Sat", 110],
                          ["Sun", 130],
                        ];
                      }
                      break;

                    case "pieChart":
                    case "donutChart":
                      headers = ["Category", "Value"];
                      if (item.config?.data?.length) {
                        data = item.config.data.map((d) => [d.label, d.value]);
                      } else {
                        data = [
                          ["Search Engine", 1048],
                          ["Direct", 735],
                          ["Email", 580],
                          ["Union Ads", 484],
                          ["Video Ads", 300],
                        ];
                      }
                      break;

                    case "areaChart":
                      if (item.config?.data?.length) {
                        headers = ["Category", "Value"];
                        data = item.config.data.map((d) => [d.label, d.value]);
                      } else {
                        headers = [
                          "Day",
                          "Email",
                          "Union Ads",
                          "Video Ads",
                          "Direct",
                          "Search Engine",
                        ];
                        data = [
                          ["Mon", 120, 220, 150, 320, 820],
                          ["Tue", 132, 182, 232, 332, 932],
                          ["Wed", 101, 191, 201, 301, 901],
                          ["Thu", 134, 234, 154, 334, 934],
                          ["Fri", 90, 290, 190, 390, 1290],
                          ["Sat", 230, 330, 330, 330, 1330],
                          ["Sun", 210, 310, 410, 320, 1320],
                        ];
                      }
                      break;

                    case "radarChart":
                      if (item.config?.data?.length) {
                        headers = ["Metric", "Value"];
                        data = item.config.data.map((d) => [d.label, d.value]);
                      } else {
                        headers = [
                          "Metric",
                          "Allocated Budget",
                          "Actual Spending",
                        ];
                        data = [
                          ["Sales", 4200, 5000],
                          ["Administration", 3000, 14000],
                          ["Information Technology", 20000, 28000],
                          ["Customer Support", 35000, 26000],
                          ["Development", 50000, 42000],
                          ["Marketing", 18000, 21000],
                        ];
                      }
                      break;

                    case "funnelChart":
                      headers = ["Stage", "Conversion Rate (%)"];
                      if (item.config?.data?.length) {
                        data = item.config.data.map((d) => [d.label, d.value]);
                      } else {
                        data = [
                          ["Visit", 60],
                          ["Inquiry", 40],
                          ["Order", 20],
                          ["Click", 80],
                          ["Show", 100],
                        ];
                      }
                      break;

                    case "scatterChart":
                      headers = ["X", "Y", "Size"];
                      if (item.config?.data?.length) {
                        data = item.config.data.map((d) => [
                          d.label,
                          d.value,
                          50,
                        ]);
                      } else {
                        data = Array.from({ length: 30 }, () => [
                          Math.round(Math.random() * 100),
                          Math.round(Math.random() * 100),
                          Math.round(Math.random() * 100),
                        ]);
                      }
                      break;

                    case "heatMap": {
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
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ];
                      headers = ["Day", "Hour", "Value"];
                      data = [];
                      for (let i = 0; i < 7; i++) {
                        for (let j = 0; j < 24; j++) {
                          data.push([
                            days[i],
                            hours[j],
                            Math.round(Math.random() * 100),
                          ]);
                        }
                      }
                      break;
                    }

                    case "dataGrid":
                      headers = ["ID", "Name", "Value", "Status"];
                      data = Array.from({ length: 10 }, (_, i) => [
                        i + 1,
                        `Item ${i + 1}`,
                        Math.floor(Math.random() * 100),
                        (i + 1) % 2 === 0 ? "Active" : "Pending",
                      ]);
                      break;

                    case "card":
                      headers = ["Metric", "Value"];
                      if (item.config?.data?.length) {
                        data = item.config.data.map((d) => [d.label, d.value]);
                      } else {
                        data = [
                          [
                            item.config?.subtitle || "Total Items",
                            item.config?.value || "0",
                          ],
                        ];
                      }
                      break;

                    default:
                      headers = ["Category", "Value"];
                      data = [["No data available", 0]];
                  }
                  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
                  const sheetName = `${item.config?.title || item.type.name}_${
                    index + 1
                  }`
                    .substring(0, 31)
                    .replace(/[^a-zA-Z0-9_]/g, "_");
                  XLSX.utils.book_append_sheet(wb, ws, sheetName);
                });
                const timestamp = new Date()
                  .toISOString()
                  .replace(/[:.]/g, "-")
                  .substring(0, 19);
                XLSX.writeFile(wb, `dashboard_export_${timestamp}.xlsx`);
              }}
              sx={{ borderRadius: 2, mr: 2 }}
            >
              {t("downloadAllExcel")}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddMenuOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              {t("addComponent")}
            </Button>
            <Button
              variant="contained"
              startIcon={<Assignment />}
              onClick={() => {
                setSelectedItems(dashboardItems);
                setAssignModalOpen(true);
              }}
              sx={{ borderRadius: 2 }}
            >
              Assign
            </Button>
          </Box>
        </Box>
      </Box>
      <AddComponentModal
        open={addMenuOpen}
        onClose={() => setAddMenuOpen(false)}
        componentTypes={componentTypes}
        onAddComponent={addComponent}
      />
      {/* Dashboard Grid */}
      <Grid container spacing={3} id="dashboard-container">
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Paper
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              sx={{
                p: 2,
                position: "relative",
                border: "2px solid transparent",
                borderColor: dragOverItem === index ? "#1976d2" : "transparent",
                opacity: draggedItem === index ? 0.5 : 1,
                transform: draggedItem === index ? "rotate(2deg)" : "none",
                cursor: "move",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: draggedItem === null ? "#1976d2" : "transparent",
                  boxShadow: draggedItem === null ? 3 : 1,
                },
                height: "100%",
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
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <DragIcon sx={{ mr: 1, color: "#999", cursor: "move" }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {item.title}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(
                        "Settings icon clicked for ChartID:",
                        item.id
                      );
                      setSelectedChartId(item.id);
                      openSettings(item);
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Delete icon clicked for ChartID:", item.id);
                      removeComponent(item.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box id={`chart-${item.id}`} sx={{ height: 300 }}>
                {renderComponent(item)}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1, fontSize: "0.75rem" }}
                  onClick={() => handleDownloadPDF(item)}
                >
                  {t("pdf")}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem" }}
                  onClick={() => handleDownloadExcel(item)}
                >
                  {t("excel")}
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <AssignModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        selectedItems={selectedItems}
        clearCheckbox={() => {}}
      />
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        selectedItem={selectedItem}
        onConfigChange={(key, value) => handleConfigChange(key, value)}
        onSave={handleSettingsSave}
        componentTypes={componentTypes}
        onSourceDataSelect={handleSourceDataSelect}
        onSaveChart={handleSaveChart}
      />
      {dashboardItems.length === 0 && (
        <Paper sx={{ p: 5, mt: 5, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#999" }}>
            {t("emptyDashboardMessage")}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CreateDashboard;
