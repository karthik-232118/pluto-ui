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
  MenuItem,
  CircularProgress,
  Avatar,
  Switch,
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

const MCQSimulationLogs = () => {
  const { t } = useTranslation();
  const [testNamesDropdown, setTestNamesDropdown] = useState(null);
  const [allTestDropdownData, setAllTestDropdownData] = useState(null);
  const [isFetchingTestNamesDropdown, setIsFetchingTestNamesDropdown] =
    useState(false);
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state for API call
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false); // Track if search was initiated
  const [toggleValue, setToggleValue] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Manage the current page
  const pageSize = 10; // Number of logs per page
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      testName: "",
    },
  });
  const selectedTestName = watch("testName");
  // Handle the switch toggle
  const handleToggleChange = (event) => {
    const value = event.target.checked;
    setToggleValue(value);
    const currentValue = value ? "MCQ" : "Test Simulation";
    if (currentValue === "MCQ") {
      setTestNamesDropdown(allTestDropdownData?.mcq);
    } else if (currentValue === "Test Simulation") {
      setTestNamesDropdown(allTestDropdownData?.test);
    } else {
      setTestNamesDropdown([]);
    }
  };

  const fetchMCQSimulationNamesDropdown = async () => {
    setIsFetchingTestNamesDropdown(true);
    try {
      const data = await reportApis.getTestNameDropdownOption();

      setAllTestDropdownData(data);
      const currentValue = toggleValue ? "MCQ" : "Test Simulation";
      if (currentValue === "MCQ") {
        setTestNamesDropdown(data?.mcq);
      } else if (currentValue === "Test Simulation") {
        setTestNamesDropdown(data?.test);
      } else {
        setTestNamesDropdown([]);
      }
    } catch (error) {
      console.error("Failed to fetch Test name dropdown options", error);
      notify("error", "Failed to fetch Test name dropdown options");
      setTestNamesDropdown([]);
    } finally {
      setIsFetchingTestNamesDropdown(false);
    }
  };

  useEffect(() => {
    fetchMCQSimulationNamesDropdown();
  }, []);

  // This function will handle form submission
  const onSubmit = async (formData) => {
    setSearchInitiated(true); // Track when search is clicked
    const { testName } = formData;
    if (!testName) {
      setErrorMessage("Please select a Test Name");
      return;
    }
    setLoading(true);
    setErrorMessage(null); // Clear any previous errors
    const currentValue = toggleValue ? "MCQ" : "Skill Assessment";
    const body = {
      ModuleID: testName,
      ModuleType: currentValue,
    };
    try {
      const logs = await reportApis.getTestAttemptLogs(body);
      const formattedLogs = logs?.map((log) => {
        const isMCQ = currentValue === "MCQ";
        return {
          name: isMCQ
            ? log?.TestMCQName || "N/A"
            : log?.TestSimulationName || "N/A",
          attempts: log?.AttemptNumber || "N/A",
          date: log?.CreatedDate ? dateformatter(log?.CreatedDate) : "N/A",
          maximumScore: log?.MaxScore || "N/A",
          attemptScore: isMCQ
            ? log?.Score || "N/A"
            : log?.TotalPercentage || "N/A",
          passOrFail: isMCQ
            ? compareStringFloats(log?.Score, log?.PassPercentage) || "N/A"
            : compareStringFloats(log?.TotalPercentage, log?.PassPercentage) ||
              "N/A",
        };
      });

      setLogData(formattedLogs);
      setCurrentPage(1); // Reset to the first page after fetching new data
    } catch (error) {
      console.error("Error fetching Test Name logs", error);
      setErrorMessage(t("Error fetching Test Name logs! Please try again."));
    } finally {
      setLoading(false);
    }
  };
  const totalPages = logData ? Math.ceil(logData.length / pageSize) : 1;
  const paginatedData = logData
    ? logData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
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

  function compareStringFloats(str1, str2) {
    const num1 = parseFloat(str1);
    const num2 = parseFloat(str2);

    return num1 < num2 ? "Fail" : "Pass";
  }

  const handleExportClick = () => {
    if (!logData || logData.length === 0) {
      notify("warning", t("noDataToExport"));
      return;
    }

    const headers = [
      [
        "Test Name",
        "Attempts",
        "Date",
        "Maximum Score",
        "Attempt Score",
        "Pass/Fail",
      ],
    ];

    const dataToExport = logData.map((log) => [
      log.name,
      log.attempts,
      log.date,
      log.maximumScore,
      log.attemptScore,
      log.passOrFail,
    ]);

    handleExportToExcel(dataToExport, headers, "MCQSimulationReport.xlsx");
  };

  return (
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
            {t("usersMCQSimulationAttemptReport")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("getUserMCQSimulationReport")}
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
              alignItems: "center",
              justifyContent: "space-between", // Align items to left and right
              gap: "20px",
              paddingTop: "16px",
              paddingBottom: "16px",
              borderRadius: "8px", // Rounded corners
            }}
          >
            {/* Switch Toggle with labels TEST and MCQ */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Typography>{t("testLabel")}</Typography>{" "}
              {/* Label on the left */}
              <Switch
                checked={toggleValue}
                onChange={handleToggleChange}
                inputProps={{ "aria-label": "Test/MCQ toggle" }}
              />
              <Typography>{t("mcqLabel")}</Typography>{" "}
              {/* Label on the right */}
            </Box>

            {/* Test Name Autocomplete and Search Button on the right */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <Controller
                name="testName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label={
                      isFetchingTestNamesDropdown
                        ? t("fetchingTestNames")
                        : testNamesDropdown !== null &&
                          testNamesDropdown?.length === 0
                        ? t("noDataAvailable")
                        : t("selectTestName")
                    }
                    variant="outlined"
                    sx={{
                      width: "250px",
                      borderRadius: "8px",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <MenuItem value="">Select Test Name</MenuItem>
                    {testNamesDropdown &&
                      testNamesDropdown?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </TextField>
                )}
              />
              {/* Search Button */}
              <Button
                disabled={!selectedTestName}
                variant="contained"
                type="submit"
                sx={{
                  height: "44px",
                  padding: "0 24px",
                  borderRadius: "8px",
                  textTransform: "none",
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
                <TableCell>{t("testName")}</TableCell>
                <TableCell>{t("attempts")}</TableCell>
                <TableCell>{t("date")}</TableCell>
                <TableCell>{t("maximumScore")}</TableCell>
                <TableCell>{t("attemptScore")}</TableCell>
                <TableCell>{t("passFail")}</TableCell>
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
                      {!selectedTestName
                        ? t("selectTestNameMessage")
                        : t("hitSearchMessage")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : logData && logData.length === 0 ? (
                <TableRow>
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Nodata image={true} />
                    </TableCell>
                  </TableRow>
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
                        {log?.name}
                      </Box>
                    </TableCell>
                    <TableCell>{log?.attempts}</TableCell>
                    <TableCell>{log?.date}</TableCell>
                    <TableCell>{log?.maximumScore}</TableCell>
                    <TableCell>{log.attemptScore}</TableCell>
                    <TableCell>{log?.passOrFail}</TableCell>
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
            {t("page")} {currentPage} {t("of")} {totalPages}
          </Typography>
        </Box>
      </Box>
    </BackgroundMeshBox>
  );
};

export default MCQSimulationLogs;
