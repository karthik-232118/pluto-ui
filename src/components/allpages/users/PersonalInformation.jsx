import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const PersonalInformation = () => {
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
          height:"75vh"
        }}
      >
        <Grid container >
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">USERS</Typography>
            <Typography variant="h6" gutterBottom>Create a New User</Typography>
            <Typography variant="subtitle1" color="primary">Personal Information</Typography>
          </Grid>

          <Grid container spacing={2} xs={12} md={5} sm={10} sx={{ mt: 2 }}>
              {" "}
             
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {" "}
               
                <Typography variant="body1">Full Name:</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9}>
                {" "}
               
                <TextField
                  fullWidth
                 
                  variant="outlined"
                  InputProps={{
                    style: textFieldStyle,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {" "}
               
                <Typography variant="body1">Date Of Birth:</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9}>
                {" "}
                
                <TextField
                  fullWidth
                 
                  variant="outlined"
                  InputProps={{
                    style: textFieldStyle,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {" "}
                
                <Typography variant="body1">Phone No.:</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9}>
                {" "}
               
                <TextField
                  fullWidth
                  
                  variant="outlined"
                  InputProps={{
                    style: textFieldStyle,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {" "}
               
                <Typography variant="body1">Email:</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9}>
                {" "}
                
                <TextField
                  fullWidth
                 
                  variant="outlined"
                  InputProps={{
                    style: textFieldStyle,
                  }}
                />
              </Grid>
          </Grid>
        </Grid>
      </Box>

      
    </Box>
    <Box display="flex" justifyContent="flex-end" m={3}>
        <Button variant="outlined" color="primary" sx={{ mr: 2, borderColor: "black", color: "black", borderRadius: "10px" }}>
          Discard
        </Button>
        
          <Link to="/professional-information">
        <Button variant="contained" color="primary" sx={{ backgroundColor: "black", borderRadius: "10px" }}>
          Next
        </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default PersonalInformation;
