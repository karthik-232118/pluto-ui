import { useEffect } from "react";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const LineChart = ({ dashboardData }) => {
  useEffect(() => {
    console.log(dashboardData, "LineChart Data");
  }, [dashboardData]);

  // Define all 12 months
  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Prepare data for each month with default values if month data is missing
  const monthData = allMonths?.map((month) => {
    const monthInfo = dashboardData.find((item) => item.Month === month);
    return {
      Attempt: monthInfo ? monthInfo.Attempt : 0,
      Total: monthInfo ? monthInfo.Total : 0,
    };
  });

  const seriesData = [
    {
      name: "Accessed",
      data: monthData.map((item) => item.Attempt),
    },
    {
      name: "Assigned",
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
      categories: allMonths, // Display all 12 months on x-axis
    },
    yaxis: {
      min: 0,
      max: 30,
      tickAmount: 6, // Creates 6 ticks for 0, 5, 10, ..., 30
      labels: {
        formatter: (value) => value.toFixed(0), // Display whole numbers
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
            width: "100%",
            height: 300,
          },
          legend: {
            position: "bottom",
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
          },
        },
      },
    ],
  };

  return (
    <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
      <Chart
        options={chartOptions}
        series={seriesData}
        type="area"
        height="280"
      />
    </div>
  );
};

LineChart.propTypes = {
  dashboardData: PropTypes.array.isRequired,
};

export default LineChart;
