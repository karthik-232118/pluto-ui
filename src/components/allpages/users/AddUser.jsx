import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import icon1 from "../../../assets/svg/AddUser/sort-icon.svg";
import icon2 from "../../../assets/svg/AddUser/add-icon.svg";
import { Link } from "react-router-dom";
import "./Users.css";

const AddUser = () => {
  const users = [
    {
      name: "Mano",
      email: "Mano@email.com",
      designation: "Designation",
      employeeNo: "0075",
      userType: "POWER USER",
      department: "Administration",
    },
    {
      name: "Siva",
      email: "Siva@email.com",
      designation: "Designation",
      employeeNo: "0075",
      userType: "ADMIN",
      department: "Administration",
    },
    {
      name: "Naveen",
      email: "Naveen@email.com",
      designation: "Designation",
      employeeNo: "0075",
      userType: "USER",
      department: "Administration",
    },
    {
      name: "Raghav",
      email: "example@email.com",
      designation: "Designation",
      employeeNo: "0075",
      userType: "USER",
      department: "Administration",
    },
    {
      name: "Nitesh",
      email: "example@email.com",
      designation: "Designation",
      employeeNo: "0075",
      userType: "POWER USER",
      department: "Administration",
    },
    {
      name: "Nitesh",
      email: "example@email.com",
      designation: "Designation",
      employeeNo: "0075",
      userType: "USER",
      department: "Administration",
    },
  ];

  return (
    <Box>
    <Box className="add-user-container">
      <Box className="add-user-box">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="p">Settings</Typography>
            <Typography variant="h5">Users</Typography>
          </Grid>
          <Grid
            item
            xs={6}
            container
            justifyContent="flex-end"
            alignItems="center"
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search Members"
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              className="search-textfield"
            />
            <Button
              variant="contained"
              style={{ backgroundColor: "#328A98", borderRadius: "8px", marginLeft:"10px" }}
              startIcon={
                <img
                  src={icon1}
                  alt="Sort Icon"
                  style={{ width: "24px", height: "24px" }}
                />
              }
            >
              Sort By
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#F1F8FF" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell sx={{ color: "#6E6893" }}>NAME & EMAIL</TableCell>
                <TableCell sx={{ color: "#6E6893" }}>DESIGNATION</TableCell>
                <TableCell sx={{ color: "#6E6893" }}>EMPLOYEE NO.</TableCell>
                <TableCell sx={{ color: "#6E6893" }}>USER TYPE</TableCell>
                <TableCell sx={{ color: "#6E6893" }}>DEPARTMENT</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <Typography>{user.name}</Typography>
                    <Typography>{user.email}</Typography>
                  </TableCell>
                  <TableCell>{user.designation}</TableCell>
                  <TableCell>{user.employeeNo}</TableCell>
                  <TableCell>{user.userType}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>...</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

     
    </Box>

    <Box style={{display:"flex",justifyContent:"end",padding:"1.5rem"}}>
        <Link to="/personal-information">
          <Button
            variant="contained"
            style={{ backgroundColor: "black", borderRadius: "8px" }}
            startIcon={
              <img
                src={icon2}
                alt="Sort Icon"
                style={{ width: "24px", height: "24px" }}
              />
            }
          >
            Add User
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default AddUser;
