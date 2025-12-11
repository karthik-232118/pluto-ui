import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const ProfessionalInformation = () => {
  const textFieldStyle = {
    borderRadius: "20px",
    width: "100%",
    height: "40px",
    padding: "15px",
  };

  return (
    <Box>
      <Box sx={{ flexGrow: 1, p: 4 }} style={{ backgroundColor: "#EDF3FF" }}>
        <Box
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "10px",
            minHeight: "75vh",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                USERS
              </Typography>
              <Typography variant="h6" gutterBottom>
                Create a New User
              </Typography>
              <Typography variant="subtitle1">
               <span> <Link to="/personal-information" style={{ textDecoration: 'none', color: 'inherit' }}>
            Personal Information
          </Link> </span>{">"}{" "}
                <span style={{ color: "blue" }}>Professional Information</span>
              </Typography>
            </Grid>

            <Grid container spacing={2} xs={12} md={5} sm={10} sx={{ mt: 2 }}>
              {" "}
              {/* Grid container for spacing */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {" "}
                {/* Grid item for Region */}
                <Typography variant="body1">Employee ID:</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9}>
                {" "}
                {/* Grid item for Region TextField */}
                <TextField
                  fullWidth
                  placeholder="Enter Employee ID"
                  variant="outlined"
                  InputProps={{
                    style: textFieldStyle,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {" "}
                {/* Grid item for Region */}
                <Typography variant="body1">Job Title:</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9}>
                {" "}
                {/* Grid item for Region TextField */}
                <TextField
                  fullWidth
                  placeholder="Enter Job Title"
                  variant="outlined"
                  InputProps={{
                    style: textFieldStyle,
                  }}
                />
              </Grid>
              {/* First Row: Region and TextField */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {" "}
                {/* Grid item for Region */}
                <Typography variant="body1">Region:</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9}>
                {" "}
                {/* Grid item for Region TextField */}
                <TextField
                  fullWidth
                  placeholder="Enter Region"
                  variant="outlined"
                  InputProps={{
                    style: textFieldStyle,
                  }}
                />
              </Grid>
              {/* Second Row: Full Name and TextField */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {" "}
                {/* Grid item for Full Name */}
                <Typography variant="body1">Full Name:</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9}>
                {" "}
                {/* Grid item for Full Name TextField */}
                <TextField
                  fullWidth
                  placeholder="Enter Full Name"
                  variant="outlined"
                  InputProps={{
                    style: textFieldStyle,
                  }}
                />
              </Grid>
              {/* Third Row: Select Department and TextField */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {" "}
                {/* Grid item for Select Department */}
                <Typography variant="body1">Select Department:</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9}>
                {" "}
                {/* Grid item for Select Department TextField */}
                <TextField
                  fullWidth
                  placeholder="Select Department"
                  variant="outlined"
                  InputProps={{
                    style: textFieldStyle,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {" "}
                {/* Grid item for Select Department */}
                <Typography variant="body1">Select role(s):</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={8}
                lg={9}
                style={{ display: "flex", flexDirection: "column" }}
              >
                {" "}
                {/* Grid item for Select Department TextField */}
                <FormControlLabel
               
                  control={<Checkbox name="admin" />}
                  label="ADMIN"
                />
                <FormControlLabel
                  control={<Checkbox name="powerUser" />}
                  label="POWER USER"
                />
                <FormControlLabel
                  control={<Checkbox name="user" />}
                  label="USER"
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" m={3}>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            mr: 2,
            borderColor: "black",
            color: "black",
            borderRadius: "10px",
          }}
        >
          Discard
        </Button>
        <Link to="/permissions-passwords">
        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "black", borderRadius: "10px" }}
        >
          Next
        </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default ProfessionalInformation;
