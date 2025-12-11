import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Autocomplete,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import reportApis from "../../../services/reportModules";
import notify from "../../../assets/svg/utils/toast/Toast";
import Nodata from "../masterpopups/Nodata";
import { dateformatter } from "../../../utils";
import { sopReadingLogsApi } from "../../../services/eSign/ESignModule";
import { useTranslation } from "react-i18next";

const DocumentReadedLogs = () => {
  const [usersDropdown, setUsersDropdown] = useState([]);
  const [isFetchingUsersDropdown, setIsFetchingUsersDropdown] = useState(false);
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const {t} = useTranslation();

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      user: null,
      startDate: null,
      endDate: null,
    },
  });

  const selectedUser = watch("user");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    const fetchUsersDropdown = async () => {
      setIsFetchingUsersDropdown(true);
      try {
        const users = await reportApis.getUsersDropdownOption({
          SearchText: "",
        });
        setUsersDropdown(users);
      } catch (error) {
        notify("error", "Failed to fetch user dropdown options");
        setUsersDropdown([]);
      } finally {
        setIsFetchingUsersDropdown(false);
      }
    };
    fetchUsersDropdown();
  }, []);

  const onSubmit = async (formData) => {
    setSearchInitiated(true);
    setErrorMessage(null);
    if (!formData.user) {
      setErrorMessage("Please select a user");
      return;
    }

    setLoading(true);
    try {
      const response = await sopReadingLogsApi({
        UserID: formData.user.value,
        StartDate: formData.startDate || null,
        EndDate: formData.endDate || null,
      });

      const formattedLogs = response?.data?.data?.map((log) => ({
        documentName: log.DocumentName || "N/A",
        pages: log.NoOfPageRead ?? "N/A",
        timeTaken: `${log.Days}d ${log.Hours}h ${log.Minutes}m ${log.Seconds}s`,
        date: log.StartDateAndTime
          ? dateformatter(log.StartDateAndTime)
          : "N/A",
      }));

      setLogsData(formattedLogs || []);
      setCurrentPage(1);
    } catch (error) {
      setErrorMessage("Error fetching logs! Please try again.");
      setLogsData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    reset();
    setLogsData([]);
    setSearchInitiated(false);
    setErrorMessage(null);
    setCurrentPage(1);
  };

  const totalPages = logsData ? Math.ceil(logsData.length / pageSize) : 1;
  const paginatedData = logsData
    ? logsData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const isSearchDisabled = !selectedUser || (startDate && !endDate);

  return (
    <Box sx={{ maxWidth: '100%', margin: 0, padding: 3, backgroundColor: '#f8fafc' }}>
      {/* Header Section */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500, 
            color: '#1e293b',
            marginBottom: 1
          }}
        >
        {t("SOPReadingLogs")}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#64748b',
            fontSize: '16px'
          }}
        >
         {t("SOPReadingLogsDescription")}
        </Typography>
      </Box>

      {/* Search Filters Card */}
      <Card 
        elevation={0} 
        sx={{ 
          marginBottom: 1,
          border: '1px solid #e2e8f0',
          borderRadius: '12px'
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              marginBottom: 0, 
              fontWeight: 500,
              color: '#334155'
            }}
          >
           {t("SearchFilters")}
          </Typography>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} alignItems="flex-end">
              {/* User Selection */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="user"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={usersDropdown}
                      getOptionLabel={(option) => option.label || ""}
                      value={
                        usersDropdown.find(
                          (option) => option.value === field.value?.value
                        ) || null
                      }
                      loading={isFetchingUsersDropdown}
                      onChange={(e, value) => {
                        field.onChange(value || null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            isFetchingUsersDropdown
                              ? t("LoadingUsers")
                              : usersDropdown?.length === 0
                              ? t("NoUsersAvailable")
                              : t("SelectUser")
                          }
                          variant="outlined"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              backgroundColor: '#ffffff',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3b82f6',
                              },
                            },
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Date Range */}
              <Grid item xs={12} md={3}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("StartDate")}
                      type="date"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: '#ffffff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3b82f6',
                          },
                        },
                      }}
                      InputProps={{
                        inputProps: {
                          max: new Date().toISOString().split("T")[0],
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("EndDate")}
                      type="date"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      disabled={!startDate}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: startDate ? '#ffffff' : '#f8fafc',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: startDate ? '#3b82f6' : '#e2e8f0',
                          },
                        },
                      }}
                      InputProps={{
                        inputProps: {
                          min: startDate,
                          max: new Date().toISOString().split("T")[0],
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12} md={2}>
                <Stack spacing={1}>
                  <Button
                    disabled={isSearchDisabled}
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{
                      height: '48px',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '15px',
                      '&:disabled': {
                        backgroundColor: '#e2e8f0',
                        color: '#94a3b8',
                      },
                    }}
                  >
                  {t("SearchLogs")}
                  </Button>
                  
                  {(selectedUser || startDate || endDate) && (
                    <Button
                      variant="outlined"
                      onClick={handleClearFilters}
                      fullWidth
                      sx={{
                        height: '40px',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: '#e2e8f0',
                        color: '#64748b',
                        '&:hover': {
                          borderColor: '#cbd5e1',
                          backgroundColor: '#f8fafc',
                        },
                      }}
                    >
                     {t("ClearFilters")}
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>

         
          </form>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card 
        elevation={0} 
        sx={{ 
          border: '1px solid #e2e8f0',
          borderRadius: '12px'
        }}
      >
        <CardContent sx={{ padding: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', padding: '16px 24px' }}>
                  {t("DocumentName")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', padding: '16px 24px' }}>
                    {t("PagesRead")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', padding: '16px 24px' }}>
                   {t("TimeTaken")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', padding: '16px 24px' }}>
                   {t("DateTime")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ padding: '60px 24px' }}>
                      <CircularProgress size={40} />
                      <Typography sx={{ marginTop: 2, color: '#64748b' }}>
                       {t("LoadingLogs")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : errorMessage ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ padding: '60px 24px' }}>
                      <Typography variant="h6" sx={{ color: '#dc2626', fontWeight: 500 }}>
                        {errorMessage}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : !searchInitiated ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ padding: '60px 24px' }}>
                      <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                        {!selectedUser
                          ? t("PleaseSelectUser")
                          : startDate && !endDate
                          ? t("PleaseSelectEndDate")
                          : t("ClickSearchLogs")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : logsData && logsData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ padding: '40px 24px' }}>
                      <Nodata image={true} />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData?.map((log, idx) => (
                    <TableRow 
                      key={idx}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f8fafc',
                        },
                        '&:not(:last-child)': {
                          borderBottom: '1px solid #f1f5f9',
                        },
                      }}
                    >
                      <TableCell sx={{ padding: '16px 24px', fontWeight: 500 }}>
                        {log.documentName}
                      </TableCell>
                      <TableCell sx={{ padding: '16px 24px' }}>
                        <Chip 
                          label={log.pages} 
                          size="small" 
                          color="info" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ padding: '16px 24px', fontFamily: 'monospace' }}>
                        {log.timeTaken}
                      </TableCell>
                      <TableCell sx={{ padding: '16px 24px', color: '#64748b' }}>
                        {log.date}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Enhanced Pagination */}
          {logsData && logsData.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {t("Showing")} {((currentPage - 1) * pageSize) + 1} {t("To")} {Math.min(currentPage * pageSize, logsData.length)} {t("Of")} {logsData.length} {t("Results")}
              </Typography>
              
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="outlined"
                  disabled={currentPage === 1}
                  onClick={handlePreviousPage}
                  sx={{
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    textTransform: 'none',
                    borderRadius: '8px',
                    minWidth: '100px',
                    '&:hover': {
                      borderColor: '#cbd5e1',
                      backgroundColor: '#f8fafc',
                    },
                  }}
                >
                  {t("Previous")}
                </Button>
                
                <Typography sx={{ color: '#374151', fontWeight: 500, margin: '0 16px' }}>
                  {t("Page")} {currentPage} {t("Of")} {totalPages}
                </Typography>
                
                <Button
                  variant="outlined"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                  sx={{
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    textTransform: 'none',
                    borderRadius: '8px',
                    minWidth: '100px',
                    '&:hover': {
                      borderColor: '#cbd5e1',
                      backgroundColor: '#f8fafc',
                    },
                  }}
                >
                  {t("next")}
                </Button>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DocumentReadedLogs;