import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  MenuItem,
  CircularProgress,
  Paper,
  Avatar,
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import reportApis from "../../../services/reportModules";
import notify from "../../../assets/svg/utils/toast/Toast";
import _ from "lodash"; // For debouncing
import Nodata from "../masterpopups/Nodata";
import { dateformatter } from "../../../utils/index";
import { Download } from "@mui/icons-material";
import { handleExportToExcel } from "./handleExportToExcel";
import { useTranslation } from "react-i18next";

const ElementProcessOwnerAccessLogs = () => {
  const { t } = useTranslation();
  const [unitsDropdown, setUnitsDropdown] = useState(null);
  const [isFetchingUnitsDropdown, setIsFetchingUnitsDropdown] = useState(false);
  const [departmentsDropdown, setDepartmentsDropdown] = useState(null);
  const [isFetchingDepartmentsDropdown, setIsFetchingDepartmentsDropdown] =
    useState(false);
  const [rolesDropdown, setRolesDropdown] = useState(null);
  const [isFetchingRolesDropdown, setIsFetchingRolesDropdown] = useState(false);
  const [usersDropdown, setUsersDropdown] = useState(null);
  const [isFetchingUsersDropdown, setIsFetchingUsersDropdown] = useState(false);
  const [elementTypesDropdown, setElementTypesDropdown] = useState(null);
  const [isFetchingElementTypesDropdown, setIsFetchingElementTypesDropdown] =
    useState(false);
  const [elementDropdown, setElementDropdown] = useState(null);
  const [isFetchingElements, setIsFetchingElements] = useState(false);
  const [elementLogData, setElementLogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const pageSize = 10;

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      element_type: "",
      element: "",
      startDate: "",
      endDate: "",
    },
  });

  const selectedElementType = watch("element_type");
  const selectedUnit = watch("unit");
  const selectedDepartment = watch("department");
  const selectedRole = watch("role");
  const selectedUser = watch("user");
  const selectedElement = watch("element");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const fetchUnitsDropdown = async (searchText = "") => {
    setIsFetchingUnitsDropdown(true);
    try {
      const units = await reportApis.getUnitsDropdownOption({
        SearchText: searchText,
      });
      setUnitsDropdown(units);
    } catch (error) {
      console.error("Failed to fetch unit dropdown options", error);
      notify("error", "Failed to fetch unit dropdown options");
      setUnitsDropdown([]);
    } finally {
      setIsFetchingUnitsDropdown(false);
    }
  };

  const fetchDepartmentsDropdown = async (searchText = "") => {
    setIsFetchingDepartmentsDropdown(true);
    try {
      const departments = await reportApis.getDepartmentsDropdownOption({
        SearchText: searchText,
      });
      setDepartmentsDropdown(departments);
    } catch (error) {
      console.error("Failed to fetch department dropdown options", error);
      notify("error", "Failed to fetch department dropdown options");
      setDepartmentsDropdown([]);
    } finally {
      setIsFetchingDepartmentsDropdown(false);
    }
  };

  const fetchRolesDropdown = async (searchText = "") => {
    setIsFetchingRolesDropdown(true);
    try {
      const roles = await reportApis.getRolesDropdownOption({
        SearchText: searchText,
      });
      setRolesDropdown(roles);
    } catch (error) {
      console.error("Failed to fetch role dropdown options", error);
      notify("error", "Failed to fetch role dropdown options");
      setRolesDropdown([]);
    } finally {
      setIsFetchingRolesDropdown(false);
    }
  };

  const fetchUsersDropdown = async (searchText = "") => {
    setIsFetchingUsersDropdown(true);
    try {
      const users = await reportApis.getUsersDropdownOption({
        SearchText: searchText,
        RoleID: selectedRole?.value || null,
        DepartmentID: selectedDepartment?.value || null,
        UnitID: selectedUnit?.value || null,
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

  useEffect(() => {
    fetchUsersDropdown();
  }, [selectedUnit, selectedDepartment, selectedRole]);

  const fetchElements = async (searchText = "") => {
    if (!selectedElementType) return;

    setIsFetchingElements(true);
    try {
      const elements = await reportApis.getElementsDropdownOption({
        ModuleTypeID: selectedElementType,
        SearchText: searchText,
      });
      setElementDropdown(elements);
    } catch (error) {
      console.error("Failed to fetch elements", error);
      notify("error", "Failed to fetch elements");
      setElementDropdown([]);
    } finally {
      setIsFetchingElements(false);
    }
  };

  const handleUnitSearch = _.debounce((value) => {
    fetchUnitsDropdown(value);
  }, 300);

  const handleElementSearch = _.debounce((value) => {
    fetchElements(value);
  }, 300);

  const handleDepartmentSearch = _.debounce((value) => {
    fetchDepartmentsDropdown(value);
  }, 300);

  const handleRoleSearch = _.debounce((value) => {
    fetchRolesDropdown(value);
  }, 300);

  const handleUserSearch = _.debounce((value) => {
    fetchUsersDropdown(value);
  }, 300);

  useEffect(() => {
    const getDropdownOptions = async () => {
      setIsFetchingElementTypesDropdown(true);
      try {
        const moduleTypes = await reportApis.getModuleTypesDropdownOption();
        setElementTypesDropdown(moduleTypes);
        await Promise.all([
          fetchUnitsDropdown(),
          fetchDepartmentsDropdown(),
          fetchRolesDropdown(),
          fetchUsersDropdown(),
        ]);
      } catch (error) {
        console.error("Failed to fetch module type dropdown options", error);
        notify("error", "Failed to fetch dropdown options");
        setElementTypesDropdown([]);
      } finally {
        setIsFetchingElementTypesDropdown(false);
      }
    };

    getDropdownOptions();
  }, []);

  useEffect(() => {
    if (selectedElementType) {
      setValue("element", "");
      setElementDropdown([]);
      fetchElements("");
    }
  }, [selectedElementType, setValue]);

  const onSubmit = async (formData) => {
    setSearchInitiated(true);
    const { element, user, startDate, endDate } = formData;
    if (!element || !user) {
      setErrorMessage("Please select both Element and User");
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    const body = {
      ModuleID: element.value,
      UserID: user?.value,
      StartDate: startDate || null,
      EndDate: endDate || null,
    };
    try {
      const logs = await reportApis.getElementProcessOwnerAccessLogs(body);
      const formattedLogs = logs?.map((log) => ({
        profilePic: log?.UserPhoto || "",
        name: `${log?.UserFirstName} ${log?.UserMiddleName || ""} ${
          log?.UserLastName || ""
        }`,
        elementName: log?.ElementName || "N/A",
        elementType: log?.ElementType || "N/A",
        version: log?.ElementVersion || "N/A",
        IsAncknowledged: log?.IsAncknowledged,
        published: log?.PublishDate ? dateformatter(log?.PublishDate) : "N/A",
        accessDate: log?.AccessedDate
          ? dateformatter(log?.AccessedDate)
          : "N/A",
        dueDate: log?.DueDate ? dateformatter(log?.DueDate) : "N/A",
        AncknowledgedDate: log?.AncknowledgedDate
          ? dateformatter(log?.AncknowledgedDate)
          : "N/A",
      }));
      setElementLogData(formattedLogs);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching element publish logs", error);
      setErrorMessage("Error fetching element publish logs! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = elementLogData
    ? Math.ceil(elementLogData.length / pageSize)
    : 1;
  const paginatedData = elementLogData
    ? elementLogData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
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
    if (!elementLogData || elementLogData.length === 0) {
      notify("warning", t("noDataToExport"));
      return;
    }

    setIsExporting(true); // Start the loader

    try {
      // Prepare headers
      const headers = [
        [
          "User Name",
          "Element Name",
          "Element Type",
          "Master Version",
          "Published Date",
          "Accessed Date",
          "Due Date",
          "Is Acknowledge",
          "Acknowledge Date",
        ],
      ];

      const dataToExport = elementLogData.map((log) => [
        log.name,
        log.elementName,
        log.elementType,
        log.version,
        log.published,
        log.accessDate,
        log.dueDate,
        log.IsAncknowledged ? "Yes" : "No",
        log.AncknowledgedDate,
      ]);

      // Simulate delay (optional) to show loader
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Export data
      handleExportToExcel(dataToExport, headers, "ElementAccessLog.xlsx");

      notify("success", t("exportSuccess")); // Optional success notification
    } catch (error) {
      notify("error", t("exportFailed")); // Optional error notification
      console.error("Export Error:", error);
    } finally {
      setIsExporting(false); // Stop the loader
    }
  };

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
            {t("elementAccessLog")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("Track the element access logTrack the element access log")}
          </Typography>
        </Box>

        <Button
          sx={{
            height: "40px",
            borderRadius: "8px",
          }}
          variant="contained"
          size="small"
          startIcon={
            isExporting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Download />
            )
          }
          onClick={handleExportClick}
          disabled={isExporting} // Disable the button while exporting
        >
          {isExporting ? t("exporting") : t("export")}
        </Button>
      </Box>

      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#fff",
          margin: "25px",
          borderRadius: "8px",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              paddingTop: "16px",
              paddingBottom: "16px",
              borderRadius: "8px",
              flexWrap: "wrap",
            }}
          >
            {/* Unit Autocomplete */}
            <Box sx={{ flexGrow: 1 }}>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={unitsDropdown?.length > 0 ? unitsDropdown : []}
                    getOptionLabel={(option) => option.label || ""}
                    value={
                      unitsDropdown?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    loading={isFetchingUnitsDropdown}
                    onInputChange={(e, value, reason) => {
                      if (reason === "clear") {
                        field.onChange("");
                      } else if (reason === "input") {
                        handleUnitSearch(value);
                      }
                    }}
                    onChange={(e, value) => {
                      field.onChange(value || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          isFetchingUnitsDropdown
                            ? t("fetchingUsers")
                            : unitsDropdown !== null &&
                              unitsDropdown?.length === 0
                            ? t("noDataAvailable")
                            : t("selectUnit")
                        }
                        variant="outlined"
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: (theme) => {
                            theme.palette.background.default;
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Box>
            {/* Department Autocomplete */}
            <Box sx={{ flexGrow: 1 }}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={
                      departmentsDropdown?.length > 0 ? departmentsDropdown : []
                    }
                    getOptionLabel={(option) => option.label || ""}
                    value={
                      departmentsDropdown?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    loading={isFetchingDepartmentsDropdown}
                    onInputChange={(e, value, reason) => {
                      if (reason === "clear") {
                        field.onChange("");
                      } else if (reason === "input") {
                        handleDepartmentSearch(value);
                      }
                    }}
                    onChange={(e, value) => {
                      field.onChange(value || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          isFetchingDepartmentsDropdown
                            ? t("fetchingDepartments")
                            : departmentsDropdown !== null &&
                              departmentsDropdown?.length === 0
                            ? t("noDataAvailable")
                            : t("selectDepartment")
                        }
                        variant="outlined"
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: (theme) => {
                            theme.palette.background.default;
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Box>
            {/* Role Autocomplete */}
            <Box sx={{ flexGrow: 1 }}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={rolesDropdown?.length > 0 ? rolesDropdown : []}
                    getOptionLabel={(option) => option.label || ""}
                    value={
                      rolesDropdown?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    loading={isFetchingRolesDropdown}
                    onInputChange={(e, value, reason) => {
                      if (reason === "clear") {
                        field.onChange("");
                      } else if (reason === "input") {
                        handleRoleSearch(value);
                      }
                    }}
                    onChange={(e, value) => {
                      field.onChange(value || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          isFetchingRolesDropdown
                            ? t("fetchingRoles")
                            : rolesDropdown !== null &&
                              rolesDropdown?.length === 0
                            ? t("noDataAvailable")
                            : t("selectRole")
                        }
                        variant="outlined"
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: (theme) => {
                            theme.palette.background.default;
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Box>
            {/* User Autocomplete */}
            <Box sx={{ flexGrow: 1 }}>
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
                        handleUserSearch();
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
                            ? t("fetchingUsers")
                            : usersDropdown !== null &&
                              usersDropdown?.length === 0
                            ? t("noDataAvailable")
                            : t("selectUser")
                        }
                        variant="outlined"
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: (theme) => {
                            theme.palette.background.default;
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              paddingTop: "16px",
              paddingBottom: "16px",
              borderRadius: "8px",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {/* Module Type Dropdown */}
            <Box sx={{ flexGrow: 1, flexBasis: "0" }}>
              <Controller
                name="element_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label={
                      isFetchingElementTypesDropdown
                        ? t("fetchingElementTypes")
                        : elementTypesDropdown !== null &&
                          elementTypesDropdown?.length === 0
                        ? t("noDataAvailable")
                        : t("selectElementType")
                    }
                    variant="outlined"
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      backgroundColor: (theme) => {
                        theme.palette.background.default;
                      },
                    }}
                  >
                    <MenuItem value="">Select Module Type</MenuItem>
                    {elementTypesDropdown?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>

            {/* Element Type Autocomplete */}
            <Box sx={{ flexGrow: 1, flexBasis: "0" }}>
              <Controller
                disabled={!selectedElementType}
                name="element"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={elementDropdown?.length > 0 ? elementDropdown : []}
                    getOptionLabel={(option) => option.label || ""}
                    value={
                      elementDropdown?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    loading={isFetchingElements}
                    onInputChange={(e, value, reason) => {
                      if (reason === "clear") {
                        field.onChange("");
                      } else if (reason === "input") {
                        handleElementSearch(value);
                      }
                    }}
                    onChange={(e, value) => {
                      field.onChange(value || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          isFetchingElements
                            ? t("fetchingElements")
                            : elementDropdown !== null &&
                              elementDropdown?.length === 0
                            ? t("noDataAvailable")
                            : t("selectElement")
                        }
                        variant="outlined"
                        sx={{
                          width: "100%",
                          borderRadius: "8px",
                          backgroundColor: (theme) => {
                            theme.palette.background.default;
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </Box>

            {/* Start Date */}
            <Box sx={{ flexGrow: 1, flexBasis: "0" }}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("startDate")}
                    type="date"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      backgroundColor: (theme) => {
                        theme.palette.background.default;
                      },
                    }}
                    inputProps={{
                      max: new Date().toISOString().split("T")[0],
                    }}
                  />
                )}
              />
            </Box>

            {/* End Date */}
            <Box sx={{ flexGrow: 1, flexBasis: "0" }}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("endDate")}
                    type="date"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: "100%",
                      borderRadius: "8px",
                      backgroundColor: (theme) => {
                        theme.palette.background.default;
                      },
                    }}
                    disabled={!startDate}
                    inputProps={{
                      min: startDate,
                      max: new Date().toISOString().split("T")[0],
                    }}
                  />
                )}
              />
            </Box>
          </Box>

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
            }}
            disabled={
              !selectedElementType ||
              !selectedElement ||
              !selectedUser ||
              (startDate && !endDate)
            }
          >
            {t("search")}
          </Button>
        </form>

        <Divider sx={{ marginTop: 2 }} />

        {/* Table Section */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("userName")}</TableCell>
                <TableCell>{t("elementName")}</TableCell>
                <TableCell>{t("elementType")}</TableCell>
                <TableCell>{t("masterVersion")}</TableCell>
                <TableCell>{t("publishedDate")}</TableCell>
                <TableCell>{t("accessedDate")}</TableCell>
                <TableCell>{t("dueDate")}</TableCell>
                <TableCell>{t("isAcknowledge")} </TableCell>
                <TableCell>{t("acknowledgeDate")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
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
                  <TableCell colSpan={8} align="center">
                    <Typography
                      variant="p"
                      sx={{
                        fontWeight: "500",
                        justifyContent: "center",
                        display: "flex",
                      }}
                    >
                      {!selectedElementType && !selectedElement && !selectedUser
                        ? t("selectLogs")
                        : !selectedElementType
                        ? t("selectElementTypeToViewLogs")
                        : !selectedElement
                        ? t("selectElementToViewLogs")
                        : !selectedUser
                        ? t("selectUserToViewLogs")
                        : startDate && !endDate
                        ? t("selectEndDate")
                        : t("hitSearchToViewLogs")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : elementLogData && elementLogData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
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
                    <TableCell>{log.elementName}</TableCell>
                    <TableCell>{log.elementType}</TableCell>
                    <TableCell>{log.version}</TableCell>
                    <TableCell>{log.published}</TableCell>
                    <TableCell>{log?.accessDate}</TableCell>
                    <TableCell>{log?.dueDate}</TableCell>
                    <TableCell>{log.IsAncknowledged ? "Yes" : "No"}</TableCell>
                    <TableCell>{log?.AncknowledgedDate}</TableCell>
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
          <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
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
            {t("page")} {currentPage} {t("of")} {totalPages}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ElementProcessOwnerAccessLogs;
