import { useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import AdminBanner from "./AdminBanner";
import DashboardCards from "./DashboardCards";
import MyRequest from "./MyRequest";
import Banner from "../ProcessownerDashboard/dashboard/Banner";
import { GetDashboardAdmin, } from "../../store/dashboard/action";
import { GetMyrequest } from "../../store/myrequest/action";
import { useTheme } from "@emotion/react";
import BackgroundMeshBox from "../../common/meshbackground/BackgroundMeshBox";
import { t } from "i18next";

const AdminDashBorad = () => {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state.dashboard);
  const { getmyrequest } = useSelector((state) => state.myReq);

  const theme = useTheme();

  // Log data once the API call is successful
  useEffect(() => {
    dispatch(GetDashboardAdmin());
    dispatch(GetMyrequest())
  }, []);
  return (
    <BackgroundMeshBox>
    <Box
      padding={2}
      margin={2}
      sx={{
        minHeight: "100vh",
        color: theme.palette.text.primary,
      }}>
      <Box >
        <Banner />
      </Box>

      <Grid container sx={{marginTop:"1.5rem"}} >
         <Grid item xs={12} md={12} sm={12} ></Grid>
        <DashboardCards
          dashboardData={dashboard}
          card1={t("availablePowerUserLicense")}
          card2={t("availableEndUserLicense")}
          card3={t("hoursSpentInADay")}
          card4={t("licenseExpiresIn")}
          card1key={dashboard?.lincense?.NumberOfProcessOwnerUsers}
          card2key={dashboard?.lincense?.NumberOfAdminUsers}
          card3key={0}
          card4key={dashboard?.license?.ValidityTo}
          
        />

        <MyRequest dashboardData={dashboard} getmyrequest={getmyrequest} />
      </Grid>

    </Box>
</BackgroundMeshBox>
  );
};

export default AdminDashBorad;
