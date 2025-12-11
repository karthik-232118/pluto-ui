import  { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const CHART_HEIGHT = 245; 

const CircularProgressChart = ({ dashboardData }) => {
  const [seriesData, setSeriesData] = useState([]); 
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "radialBar",
      animations: {
        enabled: false
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "60%",
          background: "#E0F7FA", 
        },
        dataLabels: {
          showOn: "always",
          name: {
            show: true,
            fontSize: "16px",
            fontWeight: 600,
            color: "#000", 
            offsetY: 16,
          },
          value: {
            show: true,
            fontSize: "30px",
            fontWeight: 700,
            color: "#007FFF", 
            offsetY: -20,
            formatter: () => `${seriesData}`, 
          },
        },
        track: {
          background: "#f2f2f2", 
          strokeWidth: "150%",
        },
      },
    },
    fill: {
      colors: ["#007FFF"], 
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#00AFFF"], 
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round", 
    },
    labels: ["Total Tasks"],
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: CHART_HEIGHT,
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "55%", 
              },
              dataLabels: {
                value: {
                  fontSize: "24px", 
                },
                name: {
                  fontSize: "14px", 
                },
              },
            },
          },
        },
      },
      {
        breakpoint: 480, 
        options: {
          chart: {
            height: CHART_HEIGHT,
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "50%", 
              },
              dataLabels: {
                value: {
                  fontSize: "20px", 
                },
                name: {
                  fontSize: "12px", 
                },
              },
            },
          },
        },
      },
    ],
  });

  useEffect(() => {
    if (dashboardData?.performance?.TotalTask != null) {
      setSeriesData([dashboardData.performance?.TotalTask]); 
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
                formatter: () => `${dashboardData?.performance?.TotalTask}`, 
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
          height={CHART_HEIGHT}
        />
      )}
    </div>
  );
};

export default CircularProgressChart;

CircularProgressChart.propTypes = {
  dashboardData: PropTypes.shape({
    performance: PropTypes.shape({
      TotalTask: PropTypes.number,
    }),
  }).isRequired,
};
