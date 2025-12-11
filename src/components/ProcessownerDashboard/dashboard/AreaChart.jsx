import ReactApexChart from "react-apexcharts";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const CHART_HEIGHT = 200;

const AreaChart = ({ dashboardData }) => {
  const { t } = useTranslation();
  // Extract months from dashboardData instead of using all static months
  const months = dashboardData?.map((item) => item?.Month) || [];
  console.log(dashboardData, "dashboardDatadashboardDataareachaert");

  const monthData =
    dashboardData?.map((item) => ({
      Attempt: item?.Attempt || 0,
      Total: item?.Total || 0,
    })) || [];

  const seriesData = [
    {
      name: t("Attended"),
      data: monthData.map((item) => item.Attempt),
    },
    {
      name: t("Unattended"),
      data: monthData.map((item) => item.Total),
    },
  ];
  const yAxisMin = Math.min(
    ...monthData.map((item) => Math.min(item.Attempt, item.Total))
  );
  const yAxisMax = Math.max(
    ...monthData.map((item) => Math.max(item.Attempt, item.Total))
  );

  const chartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "Inter",
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: months,
      labels: {
        rotate: 0,
      },
    },
    yaxis: {
      min: yAxisMin,
      max: yAxisMax,
      tickAmount: 2,
      labels: {
        formatter: (value) => value.toFixed(0),
      },
    },
    colors: ["#00A86B", "#007FFF"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.3,
        gradientToColors: ["#A7FFEB", "#ADD8E6"],
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      markers: {
        width: 10,
        height: 10,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: CHART_HEIGHT,
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: CHART_HEIGHT,
          },
        },
      },
    ],
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "2000px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <ReactApexChart
        key={JSON.stringify(dashboardData)}
        options={chartOptions}
        series={seriesData}
        type="area"
        height={CHART_HEIGHT}
      />
    </div>
  );
};

AreaChart.propTypes = {
  dashboardData: PropTypes.array.isRequired,
};

export default AreaChart;
