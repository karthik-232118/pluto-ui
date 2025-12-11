import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ESignOverviewHeader = () => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      justifyContent="space-between"
      alignItems={isMobile ? "flex-start" : "center"}
      gap={isMobile ? 1 : 0}
    >
      <Box>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
          {t("Overview")}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {t("Your Current Summary and Activity")}
        </Typography>
      </Box>
      <Button
        variant="contained"
        sx={{
          textTransform: "none",
          marginTop: isMobile ? "8px" : 0,
          alignSelf: isMobile ? "flex-start" : "center",
        }}
        onClick={() => navigation("/e-sign/create")}
      >
        {t("+ New Document")}
      </Button>
    </Box>
  );
};

export default ESignOverviewHeader;
