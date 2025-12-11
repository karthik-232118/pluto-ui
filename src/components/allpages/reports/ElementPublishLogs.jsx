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
import Nodata from "../../allpages/masterpopups/Nodata";
import { dateformatter } from "../../../utils";
import { Download } from "@mui/icons-material";
import { handleExportToExcel } from "./handleExportToExcel";
import { useTranslation } from "react-i18next";

const ElementPublishLogs = () => {
  const { t } = useTranslation();
  const [elementTypesDropdown, setElementTypesDropdown] = useState(null);
  const [isFetchingElementTypesDropdown, setIsFetchingElementTypesDropdown] =
    useState(false);
  const [elementDropdown, setElementDropdown] = useState(null);
  const [isFetchingElements, setIsFetchingElements] = useState(false);
  const [elementLogData, setElementLogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
  const selectedElement = watch("element");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Fetch element types when component mounts
  useEffect(() => {
    const getUserDropdownOptions = async () => {
      setIsFetchingElementTypesDropdown(true);
      try {
        const moduleTypes = await reportApis.getModuleTypesDropdownOption();
        setElementTypesDropdown(moduleTypes);
      } catch (error) {
        console.error("Failed to fetch module type dropdown options", error);
        notify("error", "Failed to fetch module type dropdown options");
        setElementTypesDropdown([]); // Set empty array to prevent infinite loading
      } finally {
        setIsFetchingElementTypesDropdown(false);
      }
    };

    getUserDropdownOptions();
  }, []);

  // Function to fetch elements
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
      setElementDropdown([]); // Set empty array to prevent infinite loading
    } finally {
      setIsFetchingElements(false);
    }
  };

  // Debounce function for search
  const handleSearch = _.debounce((value) => {
    // Set searching flag to true to ensure this is coming from user typing, not selecting
    fetchElements(value); // Only call API when user is typing
  }, 300); // Debounce for 300ms

  // Reset element when element_type changes
  useEffect(() => {
    if (selectedElementType) {
      setValue("element", ""); // Reset element
      setElementDropdown([]); // Clear the element dropdown options
      fetchElements(""); // Fetch new elements based on the selected element_type
    }
  }, [selectedElementType, setValue]);

  // Handle form submission
  const onSubmit = async (formData) => {
    setSearchInitiated(true);
    const { element, element_type, startDate, endDate } = formData;

    if (!element_type || !element) {
      setErrorMessage("Please select both Module Type and Element Type");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const body = {
      ModuleID: element.value,
      StartDate: startDate || null,
      EndDate: endDate || null,
    };

    try {
      const logs = await reportApis.getElementPublishLogs(body);
      const formattedLogs = logs?.map((log) => ({
        elementName: log?.ElementName || "N/A",
        elementType: log?.ModuleName || "N/A",
        draftVersion: log?.DraftVersion || "N/A",
        masterVersion: log?.MasterVersion || "N/A",
        published: log?.PublishDate ? dateformatter(log?.PublishDate) : "N/A",
      }));

      setElementLogData(formattedLogs);
      setCurrentPage(1); // Reset to the first page after fetching new data
    } catch (error) {
      console.error("Error fetching element publish logs", error);
      setErrorMessage("Error fetching element publish logs! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Pagination
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

    setIsExporting(true); // Start loader

    try {
      // Prepare headers
      const headers = [
        [
          "Element Name",
          "Element Type",
          "InProgress Version",
          "Master Version",
          "Published Date",
        ],
      ];

      const dataToExport = elementLogData.map((log) => [
        log.elementName,
        log.elementType,
        log.draftVersion,
        log.masterVersion,
        log.published,
      ]);

      // Optional: Simulate delay to show loader
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Export to Excel
      handleExportToExcel(dataToExport, headers, "ElementPublishLogs.xlsx");

      notify("success", t("exportSuccess")); // Show success message
    } catch (error) {
      notify("error", t("exportFailed")); // Show error message
      console.error("Export Error:", error);
    } finally {
      setIsExporting(false); // Stop loader
    }
  };

  const getMessage = () => {
    if (!selectedElementType && !selectedElement) {
      return t("selectElementTypeElement");
    } else if (!selectedElementType) {
      return t("pleaSeselectElementType");
    } else if (!selectedElement) {
      return t("pleaSeselectElement");
    } else if (startDate && !endDate) {
      return t("selectEndDate");
    } else {
      return t("hitSearch");
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
        }}
      >
        <Box>
          <Typography variant="h6" style={{ fontWeight: "500" }}>
            {t("elementPublishLogs")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("trackPublishLogs")}
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
          disabled={isExporting} // Disable button when loading
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
              borderRadius: "8px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
              {/* Module Type Dropdown */}
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
                      width: "220px",
                      borderRadius: "8px",
                      backgroundColor: (theme) => {
                        theme.palette.background.default;
                      },
                    }}
                  >
                    <MenuItem value="">{t("selectModuleType")}</MenuItem>
                    {elementTypesDropdown?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {/* Element Type Autocomplete */}
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
                    } // Ensure the value matches an option in the dropdown
                    loading={isFetchingElements}
                    // Handle searching input
                    onInputChange={(e, value, reason) => {
                      if (reason === "input") {
                        handleSearch(value); // API call only when typing
                      }
                    }}
                    // Handle selection without triggering search API
                    onChange={(e, value) => {
                      field.onChange(value || ""); // Handle element selection without hitting API
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
                          width: "220px",
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
            <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
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
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: "200px",
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
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: "200px",
                      borderRadius: "8px",
                      backgroundColor: (theme) => {
                        theme.palette.background.default;
                      },
                    }}
                    disabled={!startDate} // Disable end date unless start date is selected
                    inputProps={{
                      min: startDate,
                      max: new Date().toISOString().split("T")[0],
                    }}
                  />
                )}
              />

              {/* Search Button */}
              <Button
                variant="contained"
                type="submit"
                sx={{
                  height: "44px",
                  padding: "0 24px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: "500",
                }}
                disabled={
                  !selectedElementType ||
                  !selectedElement ||
                  (startDate && !endDate)
                } // Disable until both module and element are selected
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
                <TableCell>{t("elementName")}</TableCell>
                <TableCell>{t("elementType")}</TableCell>
                <TableCell>{t("draftVersion")}</TableCell>
                <TableCell>{t("masterVersion")}</TableCell>
                <TableCell>{t("publishedDate")}</TableCell>
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
                      {getMessage()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : elementLogData && elementLogData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Nodata image={true} />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData?.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.elementName}</TableCell>
                    <TableCell>{log.elementType}</TableCell>
                    <TableCell>{log.draftVersion}</TableCell>
                    <TableCell>{log.masterVersion}</TableCell>
                    <TableCell>{log.published}</TableCell>
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

export default ElementPublishLogs;
