import ReactApexChart from "react-apexcharts";
import PropTypes from "prop-types";

const AreaChart = ({ dashboardData }) => {
  const allMonths = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
  const monthData = allMonths?.map((month) => {
    const monthInfo = dashboardData.find((item) => item.Month === month);
    return {
      Attempt: monthInfo ? monthInfo.Attempt : 0,
      Total: monthInfo ? monthInfo.Total : 0,
    };
  });
  
  const seriesData = [
    {
      name: "Attended",
      data: monthData.map((item) => item.Attempt),
    },
    {
      name: "Unattended",
      data: monthData.map((item) => item.Total),
    },
  ];
  const chartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: allMonths,
      labels: {
        rotate: 0, 
      },
    },
    yaxis: {
      min: 0,
      max: 30,
      tickAmount: 6,
      labels: {
        formatter: (value) => value.toFixed(0),
      },
    },
    colors: ["#00A86B", "#7367F0"],
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
      position: "bottom", 
      horizontalAlign: "right", 
      markers: {
        width: 10,
        height: 10,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 5, 
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "100%",
            height: 300,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center", 
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
            height: 250,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center", 
          },
        },
      },
    ],
  };
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <ReactApexChart
        key={JSON.stringify(dashboardData)}
        options={chartOptions}
        series={seriesData}
        type="area"
        height="280"
      />
    </div>
  );
};

AreaChart.propTypes = {
  dashboardData: PropTypes.array.isRequired,
};

export default AreaChart;
