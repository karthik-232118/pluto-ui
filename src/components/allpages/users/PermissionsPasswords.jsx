import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const PermissionsPasswords = () => {
  const textFieldStyle = {
    borderRadius: "20px",
    width: "80%",
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
          height:"75vh",
          
        }}
      >
        <Grid container >
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">USERS</Typography>
            <Typography variant="h6" gutterBottom>Create a New User</Typography>
            <Typography variant="subtitle1">
        <span>
          <Link to="/personal-information" style={{ textDecoration: 'none', color: 'inherit' }}>
            Personal Information
          </Link>
        </span>{" "}
        {">"}{" "}
        <span>
          <Link to="/professional-information" style={{ textDecoration: 'none', color: 'inherit' }}>
            Professional Information
          </Link>
        </span>{" "}
        {">"}{" "}
        <span style={{ color: "blue" }}>
          Permissions & Passwords
        </span>
      </Typography>
          </Grid>

          <Grid container spacing={2} xs={12} md={7} sm={10} sx={{ mt: 2 }}>
              {" "}
             
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {" "}
               
                <Typography variant="body1" >Create A Password:</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={9}>
                {" "}
               
                <TextField
                  fullWidth
                  placeholder='Enter Password'
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
        <Button variant="outlined"  sx={{ mr: 2, borderColor: "black", color: "black", borderRadius: "10px" }}>
          Discard
        </Button>
        <Button variant="contained"  sx={{ backgroundColor: "black", borderRadius: "10px" }}>
        Save New User
        </Button>
      </Box>
    </Box>
  );
}

export default PermissionsPasswords;








