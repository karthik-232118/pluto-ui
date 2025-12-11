import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const CircularProgressChart = ({ dashboardData }) => {
  const [seriesData, setSeriesData] = useState([]); // Default value until data is loaded
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "60%",
          background: "#D3FFD8", // Background color behind the text
        },
        dataLabels: {
          showOn: "always",
          name: {
            show: true,
            fontSize: "16px",
            fontWeight: 600,
            color: "#000", // Color of the "Total Tasks" text
            offsetY: 16,
          },
          value: {
            show: true,
            fontSize: "30px",
            fontWeight: 700,
            color: "#3EDA22", // Color of the number
            offsetY: -20,
            formatter: () => `${seriesData}`, // Format using the value
          },
        },
        track: {
          background: "#f2f2f2", // The grey background of the outer track
          strokeWidth: "150%",
        },
      },
    },
    fill: {
      colors: ["#197409"], // Blue color for the progress
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#3EDA22"], // Gradient end color
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round", // Makes the ends of the progress bar rounded
    },
    labels: ["Total Tasks"],
    responsive: [
      {
        breakpoint: 768, // Breakpoint for tablet devices
        options: {
          chart: {
            height: "280", // Adjust height for tablets
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "55%", // Slightly smaller inner circle on tablets
              },
              dataLabels: {
                value: {
                  fontSize: "24px", // Smaller number size on tablets
                },
                name: {
                  fontSize: "14px", // Smaller label on tablets
                },
              },
            },
          },
        },
      },
      {
        breakpoint: 480, // Breakpoint for mobile devices
        options: {
          chart: {
            height: "230", // Smaller height for mobile
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "50%", // Smaller inner circle on mobile
              },
              dataLabels: {
                value: {
                  fontSize: "20px", // Smaller number size on mobile
                },
                name: {
                  fontSize: "12px", // Smaller label on mobile
                },
              },
            },
          },
        },
      },
    ],
  });

  useEffect(() => {
    if (dashboardData?.LiveSession?.Total != null) {
      setSeriesData([dashboardData.LiveSession?.Total]); // Update with API data when available
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        plotOptions: {
          ...prevOptions.plotOptions,
          radialBar: {
            ...prevOptions.plotOptions.radialBar,
            dataLabels: {
              ...prevOptions.plotOptions.radialBar.dataLabels,
              value: {
                ...prevOptions.plotOptions.radialBar.dataLabels.value,
                formatter: () => `${dashboardData.LiveSession?.Total}`, // Display the actual API value
              },
            },
          },
        },
      }));
    }
  }, [dashboardData]);

  return (
    <div style={{ width: "100%", maxWidth: "340px", margin: "0 auto" }}>
      {seriesData?.length > 0 && (
        <Chart
          options={chartOptions}
          series={seriesData}
          type="radialBar"
          height="340"
        />
      )}
    </div>
  );
};

export default CircularProgressChart;
