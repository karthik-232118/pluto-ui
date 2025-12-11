import {
  Card,
  CardContent,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
  Skeleton,
  Box,
} from "@mui/material";
import { Email, AssignmentTurnedIn, CheckCircle } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const ESignDashboardMetrics = ({ data = {}, loading }) => {
  const theme = useTheme();
  const {t}=useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const baseColor = "#2b7bf3";
  const colorVariations = [
    baseColor,
    "#eb2e76", // A complementary pink color
    "#2cc2f8", // A lighter blue
  ];

  const metrics = [
    {
      label: t("Total Invites"),
      value: data?.totalInvites || 0,
      background: `linear-gradient(135deg, ${colorVariations[1]} 0%, ${darkenColor(colorVariations[1], 20)} 100%)`,
      icon: () => (
        <Box
          sx={{
            width: 48,
            height: 48,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            background: colorVariations[1],
          }}
        >
          <Email
            sx={{
              color: "#fff",
              fontSize: 28,
            }}
          />
        </Box>
      ),
    },
    {
      label: t("E - Sign Completed"),
      value: data?.eSignCompleted || 0,
      background: `linear-gradient(135deg, ${baseColor} 0%, ${darkenColor(baseColor, 20)} 100%)`,
      icon: () => (
        <Box
          sx={{
            width: 48,
            height: 48,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            background: baseColor,
          }}
        >
          <AssignmentTurnedIn
            sx={{
              color: "#fff",
              fontSize: 28,
            }}
          />
        </Box>
      ),
    },
    {
      label: t("Completed Documents"),
      value: data?.completedDocuments || 0,
      background: `linear-gradient(135deg, ${colorVariations[2]} 0%, ${darkenColor(colorVariations[2], 20)} 100%)`,
      icon: () => (
        <Box
          sx={{
            width: 48,
            height: 48,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            background: colorVariations[2],
          }}
        >
          <CheckCircle
            sx={{
              color: "#fff",
              fontSize: 28,
            }}
          />
        </Box>
      ),
    },
  ];

  return (
    <Grid container spacing={2} mt={2}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            variant="outlined"
            sx={{
              color: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              textAlign: "left",
              background: metric.background,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              {loading ? (
                <>
                  <Skeleton
                    variant="text"
                    width={isMobile ? "60%" : "80%"}
                    height={isMobile ? 18 : isTablet ? 20 : 22}
                  />
                  <Skeleton
                    variant="text"
                    width={isMobile ? "80%" : "90%"}
                    height={isMobile ? 28 : isTablet ? 32 : 36}
                    style={{ marginTop: "16px" }}
                  />
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography fontSize={28}>{metric.label}</Typography>

                    <metric.icon />
                  </Box>

                  <Typography fontSize={28} fontWeight="bold" marginTop={2}>
                    {metric.value}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Helper function to darken a color
function darkenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return `#${(
    0x1000000 +
    (R < 0 ? 0 : R) * 0x10000 +
    (G < 0 ? 0 : G) * 0x100 +
    (B < 0 ? 0 : B)
  )
    .toString(16)
    .slice(1)}`;
}

export default ESignDashboardMetrics;

ESignDashboardMetrics.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
};
ESignDashboardMetrics.defaultProps = {
  data: {},
  loading: false,
};