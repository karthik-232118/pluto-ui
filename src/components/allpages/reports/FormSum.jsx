import  { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  MenuItem,
  CircularProgress,
  Paper,
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import reportApis from "../../../services/reportModules";
import notify from "../../../assets/svg/utils/toast/Toast";
import { FiEye } from "react-icons/fi";
import _ from "lodash"; // For debouncing
import Nodata from "../masterpopups/Nodata";
import { GetFormSubmissionApi } from "../../../services/formSubmission/FormSubmission";
import FormDetailModal from "./FormDetailModal";
import { Download } from "@mui/icons-material";
import { handleExportToExcel } from "./handleExportToExcel";
import { useTranslation } from "react-i18next";
import AccessDenied from "../../accessDenied/AccessDenied";

const FormSum = () => {
  const { t } = useTranslation();
  const [unitsDropdown, setUnitsDropdown] = useState(null);
  const [isFetchingUnitsDropdown, setIsFetchingUnitsDropdown] = useState(false);
  const [departmentsDropdown, setDepartmentsDropdown] = useState(null);
  const [isFetchingDepartmentsDropdown, setIsFetchingDepartmentsDropdown] =
    useState(false);
  const [rolesDropdown, setRolesDropdown] = useState(null);
  const [isFetchingRolesDropdown, setIsFetchingRolesDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [usersDropdown, setUsersDropdown] = useState(null);
  const [isFetchingUsersDropdown, setIsFetchingUsersDropdown] = useState(false);
  const [elementTypesDropdown, setElementTypesDropdown] = useState(null);
  const [isFetchingElementTypesDropdown, setIsFetchingElementTypesDropdown] =
    useState(false);
  const [elementDropdown, setElementDropdown] = useState(null);
  const [isFetchingElements, setIsFetchingElements] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [moduleId, setModuleId] = useState(null);
  const [ setUserId] = useState(null);
  const [ setRoleId] = useState(null);
  const [ setDepartmentId] = useState(null);
  const [ setUnitId] = useState(null);
  const [ setStartDates] = useState(null);
  const [ setEndDates] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // State to hold the currently selected Questions & Answers for the modal

  const [selectedQuestions, setSelectedQuestions] = useState(null);

  const [selectedAnswers, setSelectedAnswers] = useState(null);

  const [data, setData] = useState([]);
  const rowsPerPage = 10; // Number of rows per page
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((data?.data?.length || 0) / rowsPerPage);

  const currentData = data?.data?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  console.log(moduleId, "ffff");

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      unit: null,
      department: null,
      role: null,
      user: null,
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetFormSubmissionApi();
        setData(response?.data || []);
      } catch (error) {
        console.log("Failed to fetch data.");
        console.error("Error fetching form submission data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedUnit = watch("unit");
  const selectedDepartment = watch("department");
  const selectedRole = watch("role");
  const selectedUser = watch("user");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const selectedElementType = watch("element_type");

  useEffect(() => {
    if (selectedElementType) {
      // Find the matching object from the data array
      const selectedElementData = data?.data?.find(
        (item) => item.ModuleTypeID === selectedElementType
      );

      // Log the details to the console
      console.log(selectedElementType);
      console.log("Selected Element Details:", selectedElementData);
    }
  }, [selectedElementType, data]);

  console.log("Selected Values:", {
    selectedUnit,
    selectedDepartment,
    selectedRole,
    selectedUser,
    startDate,
    endDate,
  });

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
    console.log("Inside onSubmit");
    console.log("Form Data:", formData);

    const {
      unit: selectedUnit,
      department: selectedDepartment,
      role: selectedRole,
      user: selectedUser,
      // element_type: selectedElementType,
      element: selectedElement,
      startDate,
      endDate,
    } = formData;

    // Ensure selected IDs are set properly
    const unitId = selectedUnit?.value || null;
    const departmentId = selectedDepartment?.value || null;
    const roleId = selectedRole?.value || null;
    const userId = selectedUser?.value || null;
    const moduleId = selectedElement?.value || null;

    setUnitId(unitId);
    setDepartmentId(departmentId);
    setRoleId(roleId);
    setUserId(userId);
    setModuleId(moduleId);
    setStartDates(startDate);
    setEndDates(endDate);

    setLoading(true);
    setErrorMessage(null);

    // Prepare the request payload
    const body = {
      ModuleID: moduleId,
      UserID: userId,
      RoleID: roleId,
      DepartmentID: departmentId,
      UnitID: unitId,
      StartDate: startDate || null,
      EndDate: endDate || null,
    };

    console.log("Request Body:", body);

    try {
      // Call the API
      const response = await GetFormSubmissionApi(body);
      console.log("Form Submission Data:", response);

      if (response?.data) {
        setData(response?.data || []);
      } else {
        setData([]);
        setErrorMessage("No data found for the selected filters.");
      }
    } catch (error) {
      console.error("Error fetching form submission data:", error);
      setErrorMessage(
        "Failed to fetch form submission data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleOpenModal = (questions, answers) => {
    setSelectedQuestions(questions);

    setSelectedAnswers(answers);

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedQuestions(null);

    setSelectedAnswers(null);
  };

  // Function to export data to Excel
  const handleExportClick = async () => {
    if (!data?.data || data?.data.length === 0) {
      notify("warning", t("noDataToExport"));
      return;
    }

    setIsExporting(true); // Set loader to true

    try {
      // Prepare headers
      const headers = [
        [
          "User Name",
          "Form Name",
          "Master Version",
          "Publish Date",
          "Due Date",
        ],
      ];

      const dataToExport = data?.data.map((item) => [
        `${item?.UserFirstName || ""} ${item?.UserMiddleName || ""} ${
          item?.UserLastName || ""
        }`.trim(),
        item?.FormName,
        item?.MasterVersion,
        new Date(item?.PublishDate).toLocaleDateString(),
        new Date(item?.DueDate).toLocaleDateString(),
      ]);

      // Simulate delay for loader
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional: You can adjust the delay

      // Handle the export to Excel
      handleExportToExcel(dataToExport, headers, "FormSubmissions.xlsx");

      // Optional: Success notification
      notify("success", t("exportSuccess"));
    } catch (error) {
      // Optional: Error notification
      notify("error", t("exportFailed"));
      console.error("Export Error:", error);
    } finally {
      setIsExporting(false); // Set loader to false after export completes
    }
  };

  const userType = localStorage.getItem("user_type");
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
        }}
      >
        <Box>
          <Typography variant="h6" style={{ fontWeight: "500" }}>
            {t("formSubmissions")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("listFormsSubmitted")}
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
                            ? t("fetchingUnits")
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
                            : usersDropdown?.length === 0
                            ? t("optionNotFound")
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
                    {elementTypesDropdown?.map((option) =>
                      option.label === "Form" ? (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ) : null
                    )}
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
              textTransform: "none",
              fontWeight: "500",
            }}
            // disabled={
            //   !selectedElementType ||
            //   !selectedElement ||
            //   !selectedUser ||
            //   (startDate && !endDate)
            // }
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
                <TableCell>{t("formName")}</TableCell>
                <TableCell>{t("masterVersion")}</TableCell>
                <TableCell>{t("publishDate")}</TableCell>
                <TableCell>{t("dueDate")}</TableCell>
                <TableCell>{t("viewForm")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData?.length > 0 ? (
                currentData?.map((item, index) => {
                  const hasQuestions =
                    item.Questions && item.Questions.length > 0;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {`${item?.UserFirstName || ""} ${
                          item?.UserMiddleName || ""
                        } ${item?.UserLastName || ""}`.trim()}
                      </TableCell>
                      <TableCell>{item?.FormName}</TableCell>
                      <TableCell>{item?.MasterVersion}</TableCell>
                      <TableCell>
                        {new Date(item?.PublishDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(item?.DueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            if (hasQuestions) {
                              handleOpenModal(item.Questions, item.Answers);
                            }
                          }}
                          disabled={!hasQuestions}
                        >
                          <FiEye color={hasQuestions ? "blue" : "grey"} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {loading ? (
                      <CircularProgress />
                    ) : errorMessage ? (
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {errorMessage}
                      </Typography>
                    ) : !searchInitiated ? (
                      <Typography
                        variant="p"
                        sx={{
                          fontWeight: "500",
                          justifyContent: "center",
                          display: "flex",
                        }}
                      >
                        {t("selectSearchParameters")}
                      </Typography>
                    ) : (
                      <Nodata image={true} />
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Overlay Loader */}

          {loading && (
            <Box
              sx={{
                position: "absolute",

                top: 0,

                left: 0,

                width: "100%",

                height: "100%",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                backgroundColor: "rgba(255,255,255,0.7)", // Semi-transparent background

                zIndex: 1, // Ensure it's on top
              }}
            >
              <CircularProgress />
            </Box>
          )}
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
        <FormDetailModal
          open={openModal}
          onClose={handleCloseModal}
          questions={selectedQuestions}
          answers={selectedAnswers}
        />
      </Box>
    </>
  );
};

export default FormSum;
