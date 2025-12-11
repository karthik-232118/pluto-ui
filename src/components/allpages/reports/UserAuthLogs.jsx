import { useEffect, useState } from "react";
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
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Avatar,
  Autocomplete,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import reportApis from "../../../services/reportModules";
import notify from "../../../assets/svg/utils/toast/Toast";
import _ from "lodash";
import Nodata from "../masterpopups/Nodata";
import { dateformatter } from "../../../utils";
import { Download } from "@mui/icons-material";
import { handleExportToExcel } from "./handleExportToExcel";
import { useTranslation } from "react-i18next";
import AccessDenied from "../../accessDenied/AccessDenied";

const UserAuthLogs = () => {
  const { t } = useTranslation(); // Use the hook
  const [usersDropdown, setUsersDropdown] = useState([]);
  const [isFetchingUsersDropdown, setIsFetchingUsersDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state for API call
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false); // Track if search was initiated
  const [isExporting, setIsExporting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // Manage the current page
  const pageSize = 10; // Number of logs per page
  const userType = localStorage.getItem("user_type");

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      user: null,
      startDate: null,
      endDate: null,
    },
  });

  const selectedUser = watch("user");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const fetchUsersDropdown = async (searchText = "") => {
    setIsFetchingUsersDropdown(true);
    try {
      const users = await reportApis.getUsersDropdownOption({
        SearchText: searchText,
      });
      setUsersDropdown(users);
    } catch (error) {
      console.error("Failed to fetch user dropdown options", error);
      notify("error", "Failed to fetch user dropdown options");
      setUsersDropdown([]);
    } finally {
      setIsFetchingUsersDropdown(false);
    }
  };

  const handleUserSearch = _.debounce((value) => {
    fetchUsersDropdown(value);
  }, 300);

  // Fetch the user dropdown options once when the component is mounted
  useEffect(() => {
    fetchUsersDropdown();
  }, []);

  // This function will handle form submission
  const onSubmit = async (formData) => {
    setSearchInitiated(true); // Track when search is clicked
    const { user, startDate, endDate } = formData;

    if (!user) {
      setErrorMessage("Please select a user");
      return;
    }

    setLoading(true);
    setErrorMessage(null); // Clear any previous errors

    const body = {
      UserID: user?.value,
      StartDate: startDate || null,
      EndDate: endDate || null,
    };

    try {
      const logs = await reportApis.getAuthLogs(body);
      const formattedLogs = logs?.map((log) => ({
        profilePic: log?.UserPhoto || "",
        name: `${log?.UserFirstName} ${log?.UserMiddleName || ""} ${
          log?.UserLastName || ""
        }`,
        department: log?.DepartmentName || "N/A",
        role: log?.RoleName || "N/A",
        login: log?.LoginDateTime ? dateformatter(log?.LoginDateTime) : "N/A",
        logout: log?.LogoutDateTime
          ? dateformatter(log?.LogoutDateTime)
          : "N/A",
      }));

      setUserData(formattedLogs);
      setCurrentPage(1); // Reset to the first page after fetching new data
    } catch (error) {
      console.error("Error fetching user logs", error);
      setErrorMessage("Error fetching user logs! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Pagination
  const totalPages = userData ? Math.ceil(userData.length / pageSize) : 1;
  const paginatedData = userData
    ? userData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Function to export data to Excel

  const handleExportClick = async () => {
    if (!userData || userData.length === 0) {
      notify("warning", t("noDataToExport"));
      return;
    }

    setIsExporting(true); // Start loader

    try {
      // Prepare data with headers
      const headers = [
        [
          "Name",
          "Department",
          "Role",
          "Login Date & Time",
          "Logout Date & Time",
        ],
      ];
      const dataToExport = userData.map((log) => [
        log.name,
        log.department,
        log.role,
        log.login,
        log.logout,
      ]);

      // Simulating a delay to show the loader (optional)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the export function
      handleExportToExcel(dataToExport, headers, "UserLoginReport.xlsx");

      notify("success", t("exportSuccess")); // Show success toast
    } catch (error) {
      notify("error", t("exportFailed")); // Show error toast
      console.error("Export Error:", error);
    } finally {
      setIsExporting(false); // Stop loader
    }
  };

  if (userType === "EndUser") {
    return <AccessDenied />;
  }

  return (
    <>
      <Box
        sx={{
          margin: "25px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: (theme) => {
            theme.palette.background.default;
          },
        }}
      >
        <Box>
          <Typography variant="h6" style={{ fontWeight: "500" }}>
            {t("userLoginReport")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("trackUserActivities")}
          </Typography>
        </Box>

        <Button
          sx={{
            height: "40px",
            borderRadius: "8px",
            textTransform: "none",
          }}
          variant="contained"
          size="small"
          onClick={handleExportClick}
          startIcon={
            isExporting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Download />
            )
          }
          disabled={isExporting} // Disable button during export
        >
          {isExporting ? t("exporting") : t("export")}
        </Button>
      </Box>
      <Box
        sx={{
          padding: "20px",
          // backgroundColor: (theme) => {
          //   theme.palette.background.default;
          // },
          backgroundColor: "#fff",
          margin: "25px",
          borderRadius: "8px",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              paddingTop: "16px",
              paddingBottom: "16px",
              borderRadius: "8px", // Rounded corners
            }}
          >
            {/* User Autocomplete */}
            <Controller
              name="user"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  freeSolo
                  options={usersDropdown?.length > 0 ? usersDropdown : []}
                  getOptionLabel={(option) => option.label || ""}
                  value={
                    usersDropdown?.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  loading={isFetchingUsersDropdown}
                  onInputChange={(e, value, reason) => {
                    if (reason === "clear") {
                      field.onChange("");
                    } else if (reason === "input") {
                      handleUserSearch(value);
                    }
                  }}
                  onChange={(e, value) => {
                    field.onChange(value || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        isFetchingUsersDropdown
                          ? t("fetchingUsers") // Add this key in your JSON file
                          : usersDropdown !== null &&
                            usersDropdown?.length === 0
                          ? t("noDataAvailable") // Add this key in your JSON file
                          : t("selectUser")
                      }
                      variant="outlined"
                      sx={{
                        width: "250px",
                        borderRadius: "8px",
                        backgroundColor: (theme) =>
                          theme.palette.background.default,
                      }}
                    />
                  )}
                />
              )}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {/* Start Date */}
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("startDate")}
                    type="date"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      width: "200px",
                      borderRadius: "8px",
                      backgroundColor: (theme) => {
                        theme.palette.background.default;
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

              {/* End Date */}
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("endDate")}
                    type="date"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      width: "200px",
                      borderRadius: "8px",
                      backgroundColor: (theme) => {
                        theme.palette.background.default;
                      },
                    }}
                    disabled={!startDate}
                    InputProps={{
                      inputProps: {
                        min: startDate,
                        max: new Date().toISOString().split("T")[0],
                      },
                    }}
                  />
                )}
              />

              {/* Search Button */}
              <Button
                disabled={!selectedUser || (startDate && !endDate)}
                variant="contained"
                type="submit"
                sx={{
                  height: "44px", // Match the height of the input fields
                  padding: "0 24px",
                  borderRadius: "8px", // Rounded corners
                  textTransform: "none", // Avoid uppercase text
                  fontWeight: "500",
                }}
              >
                {t("search")}
              </Button>
            </Box>
          </Box>
        </form>

        <Divider sx={{ marginTop: 2 }} />

        {/* Table Section */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("name")}</TableCell>
                <TableCell>{t("department")}</TableCell>
                <TableCell>{t("role")}</TableCell>
                <TableCell> {t("loginDateTime")}</TableCell>
                <TableCell> {t("logoutDateTime")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Show appropriate messages instead of rows */}
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : errorMessage ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {errorMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : !searchInitiated ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography
                      variant="p"
                      sx={{
                        fontWeight: "500",
                        justifyContent: "center",
                        display: "flex",
                      }}
                    >
                      {!selectedUser
                        ? t("pleaseSelectUser")
                        : startDate && !endDate
                        ? t("pleaseSelectEndDate")
                        : t("hitSearchToViewLogs")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : userData && userData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Nodata image={true} />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData?.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={log.profilePic}
                          alt={log.name}
                          sx={{ width: 40, height: 40, borderRadius: "50%" }}
                        />
                        {log.name}
                      </Box>
                    </TableCell>
                    <TableCell>{log.department}</TableCell>
                    <TableCell>{log.role}</TableCell>
                    <TableCell>{log.login}</TableCell>
                    <TableCell>{log.logout}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
              sx={{
                borderColor: "#D0D5DD",
                color: "#344054",
                textTransform: "none",
                borderRadius: "8px",
              }}
            >
              {t("previous")}
            </Button>
            <Button
              variant="outlined"
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
              sx={{
                borderColor: "#D0D5DD",
                color: "#344054",
                textTransform: "none",
                borderRadius: "8px",
              }}
            >
              {t("next")}
            </Button>
          </Box>
          <Typography sx={{ color: "#344054" }}>
            {/* Page {currentPage} of {totalPages} */}
            {t("page")}
            {currentPage} {t("of")} {totalPages}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default UserAuthLogs;
