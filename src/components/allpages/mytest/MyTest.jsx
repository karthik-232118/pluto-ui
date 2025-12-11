import  { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Box,
  Button,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import icon1 from "../../../assets/svg/My-Test-Svg/icon1.svg";
import icon2 from "../../../assets/svg/My-Test-Svg/icon2.svg";
import img1 from "../../../assets/png/My-Test-Png/img1.png";
import img2 from "../../../assets/png/My-Test-Png/img2.png";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import "./MyTest.css";
import PropTypes from "prop-types";

const CardContainer = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const CardContentContainer = styled(CardContent)({
  flex: 1,
  backgroundColor: "white",
});





const MyTest = ({ isBlurred }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    setOpen(false);
    navigate("/questions");
  };

  return (
    <Box style={isBlurred ? { filter: "blur(0px)" } : {}}>
      <Grid
        container
        sx={{
          flexGrow: 1,
          p: 4,
          height: "auto",
          backgroundColor: theme => theme.palette.background.default,
          width: "100%",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={7} lg={9}>
            <Card
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent style={{ flex: 1 }}>
                <Typography>MY TEST</Typography>
                <Typography variant="h5" component="div">
                  Account Opening
                </Typography>
                <Typography>
                  <img
                    src={icon1}
                    alt="icon1"
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginRight: "8px",
                    }}
                  />
                  <span
                    style={{ display: "inline-block", verticalAlign: "middle" }}
                  >
                    {" "}
                    <h3>Stimulation Test Session</h3>
                  </span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Test Instructions/description [mcq or video, etc.] At vero eos
                  et accusamus et iusto odio dignissimos ducimus qui blanditiis
                  praesentium voluptatum praesentium voluptatum praesentium
                  voluptatum praesentium voluptatum praesentios et accusamus et
                  iusto odio dignissimos ducimus qui blanditiis praesentium
                  voluptatum praesentium voluptatum praesentium voluptatum
                  praesentium voluptatum praesentium voluptatum
                </Typography>
                <Stack spacing={2} sx={{ marginTop: "1rem" }}>
                  <Typography>
                    <img
                      src={icon2}
                      alt="icon2"
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                        marginRight: "8px",
                      }}
                    />
                    <span
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    >
                      {" "}
                      <h3>Time Limit: 30 Minutes</h3>
                    </span>
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Card
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Typography
                  variant="body1"
                  component="div"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Test Pass Percentage:
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                  }}
                >
                  <CircularProgress variant="determinate" value={80} />
                  <Typography variant="h3" style={{ marginLeft: "8px" }}>
                    80%
                  </Typography>
                </div>
                <Typography component="div">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "1rem",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6">Assigned By:</Typography>
                    <Typography>ManoKaran</Typography>
                  </div>
                </Typography>
                <Typography component="div">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6">Due By:</Typography>
                    <Typography>10th July 2024</Typography>
                  </div>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} md={6} lg={6}>
            <CardContainer>
              <CardContentContainer>
                <Box sx={{ padding: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Paper
                        sx={{
                          padding: 2,
                          height: "100%",
                          backgroundColor: "#D3D4FE",
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Previous Attempt Scores:
                        </Typography>
                        <Grid container>
                          <Grid item xs={4}>
                            <Typography variant="body1">Date</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body1">Total Score</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body1">Time Taken</Typography>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={4}>
                            <Typography variant="body2">27/06/24</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2">78</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2">00:23:80</Typography>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={4}>
                            <Typography variant="body2">25/06/24</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2">54</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2">00:27:40</Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Paper
                            sx={{
                              padding: 2,
                              textAlign: "center",
                              backgroundColor: "#CBD8F6",
                            }}
                          >
                            <Typography variant="h6">
                              Number Of Attempts
                            </Typography>
                            <Typography variant="h4" gutterBottom>
                              2/3
                            </Typography>
                            <Typography variant="body2">
                              Attempts Left: 1
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          <Paper
                            sx={{
                              padding: 2,
                              textAlign: "center",
                              backgroundColor: "#EDF3FF",
                            }}
                          >
                            <Typography variant="h6">Highest Score</Typography>
                            <Typography variant="h4" gutterBottom>
                              78
                            </Typography>
                            <Typography variant="body2">
                              Lowest Score: 55
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </CardContentContainer>
            </CardContainer>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Card
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  My Badges:
                </Typography>
                <div>
                  <Typography variant="body1">
                    Collect Badges by completing and passing tests
                  </Typography>
                </div>
                <Box
                  sx={{
                    mt: "1rem",
                    display: "flex",
                    gap: "2rem",
                    flexWrap: "wrap",
                  }}
                >
                  <img
                    src={img1}
                    alt="img1"
                    style={{ maxWidth: "100px", flex: "1 0 100px" }}
                  />
                  <img
                    src={img2}
                    alt="img2"
                    style={{ maxWidth: "100px", flex: "1 0 100px" }}
                  />
                  <img
                    src={img2}
                    alt="img2"
                    style={{ maxWidth: "100px", flex: "1 0 100px" }}
                  />
                  <img
                    src={img2}
                    alt="img2"
                    style={{ maxWidth: "100px", flex: "1 0 100px" }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          padding: "1rem",
        }}
      >
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ backgroundColor: "#3749A6" }}
        >
          {" "}
          Launch Test
        </Button>
        <ConfirmModal
          open={open}
          handleClose={handleClose}
          handleConfirm={handleConfirm}
        />
      </Box>
    </Box>
  );
};

export default MyTest;

MyTest.propTypes = {
  isBlurred: PropTypes.bool,
};
MyTest.defaultProps = {
  isBlurred: false,
};
MyTest.displayName = "MyTest";
