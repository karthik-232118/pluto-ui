import { Grid, Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";

const TopSection = () => {
  const user = useSelector((state) => state.user);

  return (
    <Box
      sx={{
        padding: "3rem",
        backgroundColor: "#000",
        color: "#fff",
        marginBottom: "20px",
      }}
    >
      <Grid container spacing={2}>
        <Grid
          item
          lg={4}
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h4">Welcome back</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                <b>{user.firstName}</b>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={8} xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Last 6 Months</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={3} xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h1">1</Typography>
                    <Typography variant="h6">Action Required</Typography>
                  </Box>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h1">1</Typography>
                    <Typography variant="h6">Sent</Typography>
                  </Box>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h1">0</Typography>
                    <Typography variant="h6">Expired</Typography>
                  </Box>
                </Grid>
                <Grid item lg={3} xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h1">1</Typography>
                    <Typography variant="h6">Completed</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopSection;
