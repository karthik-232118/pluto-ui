import  { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  MenuItem,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,

  IconButton,
  Grid,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FiEye } from "react-icons/fi";
import FormDetailModal from "./FormDetailModal";
import { GetFormSubmissionApi } from "../../../services/formSubmission/FormSubmission";
import { useTranslation } from "react-i18next";
// import { GetFormSubmissionApi } from "../../../services/formSubmission/FormSubmission";

const FormSubmission = () => {
  const { control, handleSubmit } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [formSubmissions, setFormSubmissions] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation();



useEffect(() => {
    const fetchData = async () => {
      
      try {
        const response = await GetFormSubmissionApi();
        setFormSubmissions(response?.data || [],"jdhdh");
      } catch (error) {
        setError("Failed to fetch data.");
        console.error("Error fetching form submission data:", error);
      } finally {
        console.log("Form Submissions:", formSubmissions);
      }
    };

    fetchData();
  }, []);



  // Static data for dropdowns
  const unitsDropdown = [
    { label: "Unit 1", value: "unit1" },
    { label: "Unit 2", value: "unit2" },
  ];
  const departmentsDropdown = [
    { label: "HR", value: "hr" },
    { label: "Engineering", value: "engineering" },
  ];
  const rolesDropdown = [
    { label: "Manager", value: "manager" },
    { label: "Developer", value: "developer" },
  ];
  const usersDropdown = [
    { label: "Henry Thomas", value: "henry_thomas" },
    { label: "Jane Smith", value: "jane_smith" },
  ];
  const elementTypesDropdown = [{ label: "Forms", value: "forms" }];
  const elementDropdown = [
    {
      label: "Reporting Misconduct Human Resource",
      value: "reporting_misconduct",
    },
  ];

  // Placeholder for form submit
  const onSubmit = (data) => {
    console.log(data);
  };


  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedLog(null);
  };

  return (
    <>
      <Box
        sx={{
          margin: "45px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h6" style={{ fontWeight: "500" }}>
            Form Submissions
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Lists all forms submitted by users
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          padding: "20px",
          backgroundColor: (theme) => theme.palette.background.default,
          margin: "45px",
          borderRadius: "8px",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Unit Autocomplete */}
            <Grid item xs={3}>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={unitsDropdown}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Unit"
                        variant="outlined"
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: (theme) =>
                            theme.palette.background.default,
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            {/* Department Autocomplete */}
            <Grid item xs={3}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={departmentsDropdown}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Department"
                        variant="outlined"
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: (theme) =>
                            theme.palette.background.default,
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            {/* Role Autocomplete */}
            <Grid item xs={3}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={rolesDropdown}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Role"
                        variant="outlined"
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: (theme) =>
                            theme.palette.background.default,
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            {/* User Autocomplete */}
            <Grid item xs={3}>
              <Controller
                name="user"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={usersDropdown}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select User *"
                        variant="outlined"
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: (theme) =>
                            theme.palette.background.default,
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            {/* Element Type Dropdown */}
            <Grid item xs={3}>
              <Controller
                name="element_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Select Element Type *"
                    variant="outlined"
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      backgroundColor: (theme) =>
                        theme.palette.background.default,
                    }}
                  >
                    {elementTypesDropdown?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            {/* Element Autocomplete */}
            <Grid item xs={3}>
              <Controller
                name="element"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={elementDropdown}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Element"
                        variant="outlined"
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: (theme) =>
                            theme.palette.background.default,
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            {/* Start Date */}
            <Grid item xs={3}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Start Date"
                    type="date"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      backgroundColor: (theme) =>
                        theme.palette.background.default,
                    }}
                  />
                )}
              />
            </Grid>
            {/* End Date */}
            <Grid item xs={3}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="End Date"
                    type="date"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      backgroundColor: (theme) =>
                        theme.palette.background.default,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            type="submit"
            sx={{
              width: "200px",
              height: "44px",
              padding: "0 24px",
              borderRadius: "8px",
              backgroundColor: "#3B82F6",
              textTransform: "none",
              fontWeight: "500",
              marginTop: "16px",
            }}
          >
            Search
          </Button>
        </form>

        <Divider sx={{ marginTop: 2 }} />

        {/* Table Section */}
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Form Name</TableCell>
                <TableCell>Master Version</TableCell>
                <TableCell>Publish Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>View Form</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formSubmissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {error ? (
                      <Typography variant="body2" color="error">
                        {error}
                      </Typography>
                    ) : (
                      <Typography variant="body2">
                      {t("noDataAvailable")}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                formSubmissions.map((submission, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {`${submission.UserFirstName || ""} ${
                        submission.UserLastName || ""
                      }`}
                    </TableCell>
                    <TableCell>{submission.FormName || "N/A"}</TableCell>
                    <TableCell>{submission.MasterVersion || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(submission.PublishDate).toLocaleDateString() ||
                        "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(submission.DueDate).toLocaleDateString() ||
                        "N/A"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        // onClick={() => handleViewForm(submission)}
                      >
                        <FiEye />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {selectedLog && (
        <FormDetailModal
          open={openModal}
          onClose={handleCloseModal}
          log={selectedLog}
        />
      )}
    </>
  );
};

export default FormSubmission;
