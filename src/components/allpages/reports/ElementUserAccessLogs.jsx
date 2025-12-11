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
import Nodata from "../masterpopups/Nodata";
import { dateformatter } from "../../../utils";
import { handleExportToExcel } from "./handleExportToExcel";
import { Download } from "@mui/icons-material";
import BackgroundMeshBox from "../../../common/meshbackground/BackgroundMeshBox";
import { useTranslation } from "react-i18next";

const ElementUserAccessLogs = () => {
  const { t } = useTranslation();
  const [elementTypesDropdown, setElementTypesDropdown] = useState(null);
  const [isFetchingElementTypesDropdown, setIsFetchingElementTypesDropdown] =
    useState(false);
  const [elementLogData, setElementLogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      element_type: "",
      // element_type: "",
      startDate: "",
      endDate: "",
    },
  });

  const selectedElementType = watch("element_type");
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
        console.error("Failed to fetch element type dropdown options", error);
        notify("error", "Failed to fetch element type dropdown options");
        setElementTypesDropdown([]);
      } finally {
        setIsFetchingElementTypesDropdown(false);
      }
    };

    getUserDropdownOptions();
  }, []);

  // Handle form submission
  const onSubmit = async (formData) => {
    setSearchInitiated(true);
    const { element_type, startDate, endDate } = formData;

    if (!element_type) {
      setErrorMessage("Please select Element Type");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const body = {
      ModuleTypeID: element_type || null,
      StartDate: startDate || null,
      EndDate: endDate || null,
    };

    try {
      const logs = await reportApis.getElementAccessLogs(body);
      const formattedLogs = logs?.map((log) => ({
        elementType: log?.ElementType || "N/A",
        elementName: log?.ElementName || "N/A",
        version: log?.ElementVersion || "N/A",
        accessDateAndTime: log?.AccessedDate
          ? dateformatter(log?.AccessedDate)
          : "N/A",
        AncknowledgedDate: log?.AncknowledgedDate
          ? dateformatter(log?.AncknowledgedDate)
          : "N/A",
        IsAncknowledged: log?.IsAncknowledged,
      }));
      setElementLogData(formattedLogs);
      setCurrentPage(1); // Reset to the first page after fetching new data
    } catch (error) {
      console.error("Error fetching Element Access Logs", error);
      setErrorMessage("Error fetching Element Access Logs! Please try again.");
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

  const handleExportClick = () => {
    if (!elementLogData || elementLogData.length === 0) {
      notify("warning", t("noDataToExport"));
      return;
    }

    // Prepare headers
    const headers = [
      [
        "Element Name",
        "Element Type",
        "Version",
        "Access Date & Time",
        "Is Acknowledge",
        "Acknowledge Date",
      ],
    ];

    const dataToExport = elementLogData.map((log) => [
      log.elementName,
      log.elementType,
      log.version,
      log.accessDateAndTime,
      log.IsAncknowledged ? "Yes" : "No",
      log.AncknowledgedDate,
    ]);

    handleExportToExcel(dataToExport, headers, "ElementAccessLogs.xlsx");
  };

  return (
    <>
      <BackgroundMeshBox sx={{ height: "100%" }}>
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
              {t("elementAccessLogs")}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t("trackAccessLog")}
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
            startIcon={<Download />}
          >
            {t("export")}
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
                      <MenuItem value="">Select Element Type</MenuItem>
                      {elementTypesDropdown?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
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
                  disabled={!selectedElementType || (startDate && !endDate)} // Disable until both module and element are selected
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
                  <TableCell>{t("version")}</TableCell>
                  <TableCell>{t("accessDateTime")}</TableCell>
                  <TableCell>{t("isAcknowledge")} </TableCell>
                  <TableCell>{t("acknowledgeDate")}</TableCell>
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
                      <Typography variant="p" sx={{ fontWeight: "bold" }}>
                        {!selectedElementType
                          ? t("pleaseSelectElementType")
                          : startDate && !endDate
                          ? t("pleaseSelectEndDate")
                          : t("hitSearchToViewLogs")}
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
                      <TableCell>{log.version}</TableCell>
                      <TableCell>{log.accessDateAndTime}</TableCell>
                      <TableCell>
                        {log.IsAncknowledged ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>{log.AncknowledgedDate}</TableCell>
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
              {t("page")} {currentPage} of {totalPages}
            </Typography>
          </Box>
        </Box>
      </BackgroundMeshBox>
    </>
  );
};

export default ElementUserAccessLogs;
