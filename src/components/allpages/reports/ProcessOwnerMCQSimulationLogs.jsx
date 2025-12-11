// import { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Divider,
//   MenuItem,
//   CircularProgress,
//   Avatar,
//   Autocomplete,
//   Switch,
// } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import reportApis from "../../../services/reportModules";
// import notify from "../../../assets/svg/utils/toast/Toast";
// import _ from "lodash";
// import Nodata from "../masterpopups/Nodata";
// import { dateformatter } from "../../../utils";
// import { Download } from "@mui/icons-material";
// import { handleExportToExcel } from "./handleExportToExcel";
// import { useTranslation } from "react-i18next";

// const ProcessOwnerMCQSimulationLogs = () => {
//   const { t } = useTranslation();
//   const [testNamesDropdown, setTestNamesDropdown] = useState(null);
//   const [allTestDropdownData, setAllTestDropdownData] = useState(null);
//   const [isFetchingTestNamesDropdown, setIsFetchingTestNamesDropdown] =
//     useState(false);
//   const [usersDropdown, setUsersDropdown] = useState(null);
//   const [isFetchingUsersDropdown, setIsFetchingUsersDropdown] = useState(false);
//   const [logData, setLogData] = useState(null);
//   const [loading, setLoading] = useState(false); // Loader state for API call
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [searchInitiated, setSearchInitiated] = useState(false); // Track if search was initiated
//   const [toggleValue, setToggleValue] = useState(false);

//   const [isExporting, setIsExporting] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1); // Manage the current page
//   const pageSize = 10; // Number of logs per page

//   const { control, handleSubmit, watch } = useForm({
//     defaultValues: {
//       testName: "",
//       user: null,
//     },
//   });

//   const selectedTestName = watch("testName");
//   const selectedUser = watch("user");

//   // Handle the switch toggle
//   const handleToggleChange = (event) => {
//     const value = event.target.checked;
//     setToggleValue(value);
//     const currentValue = value ? "MCQ" : "Skill Assessment";
//     if (currentValue === "MCQ") {
//       setTestNamesDropdown(allTestDropdownData?.mcq);
//     } else if (currentValue === "Skill Assessment") {
//       setTestNamesDropdown(allTestDropdownData?.test);
//     } else {
//       setTestNamesDropdown([]);
//     }
//   };

//   const fetchMCQSimulationNamesDropdown = async () => {
//     setIsFetchingTestNamesDropdown(true);
//     try {
//       const data = await reportApis.getTestNameDropdownOption({
//         UserID: selectedUser?.value || null,
//       });
//       setAllTestDropdownData(data);
//       const currentValue = toggleValue ? "MCQ" : "Skill Assessment";
//       if (currentValue === "MCQ") {
//         setTestNamesDropdown(data?.mcq);
//       } else if (currentValue === "Skill Assessment") {
//         setTestNamesDropdown(data?.test);
//       } else {
//         setTestNamesDropdown([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch Test name dropdown options", error);
//       // notify("error", "Failed to fetch Test name dropdown options");
//       setTestNamesDropdown([]);
//     } finally {
//       setIsFetchingTestNamesDropdown(false);
//     }
//   };

//   const fetchUsersDropdown = async (searchText = "") => {
//     setIsFetchingUsersDropdown(true);
//     try {
//       const users = await reportApis.getUsersDropdownOption({
//         SearchText: searchText,
//       });
//       setUsersDropdown(users);
//     } catch (error) {
//       console.error("Failed to fetch user dropdown options", error);
//       notify("error", "Failed to fetch user dropdown options");
//       setUsersDropdown([]);
//     } finally {
//       setIsFetchingUsersDropdown(false);
//     }
//   };

//   const handleUserSearch = _.debounce((value) => {
//     fetchUsersDropdown(value);
//   }, 300);

//   useEffect(() => {
//     if (selectedUser) {
//       fetchMCQSimulationNamesDropdown();
//     }
//   }, [selectedUser]);

//   useEffect(() => {
//     fetchUsersDropdown();
//   }, []);

//   const onSubmit = async (formData) => {
//     setSearchInitiated(true);
//     const { testName, user } = formData;
//     if (!testName || !user) {
//       setErrorMessage("Please select User and Test Name");
//       return;
//     }
//     setLoading(true);
//     setErrorMessage(null);
//     const currentValue = toggleValue ? "MCQ" : "Skill Assessment";
//     const body = {
//       ModuleID: testName,
//       ModuleType: currentValue,
//       UserID: selectedUser?.value || null,
//     };
//     try {
//       const logs = await reportApis.getTestAttemptLogs(body);
//       const formattedLogs = logs?.map((log) => {
//         const isMCQ = currentValue === "MCQ";
//         return {
//           name: isMCQ
//             ? log?.TestMCQName || "N/A"
//             : log?.TestSimulationName || "N/A",
//           attempts: log?.AttemptNumber || "N/A",
//           date: log?.CreatedDate ? dateformatter(log?.CreatedDate) : "N/A",
//           maximumScore: log?.MaxScore || "N/A",
//           attemptScore: isMCQ
//             ? log?.Score || "N/A"
//             : log?.TotalPercentage || "N/A",
//           passOrFail: isMCQ
//             ? compareStringFloats(log?.Score, log?.PassPercentage) || "N/A"
//             : compareStringFloats(log?.TotalPercentage, log?.PassPercentage) ||
//               "N/A",
//         };
//       });

//       setLogData(formattedLogs);
//       setCurrentPage(1); // Reset to the first page after fetching new data
//     } catch (error) {
//       console.error("Error fetching Test Name logs", error);
//       setErrorMessage(t("Error fetching Test Name logs! Please try again."));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalPages = logData ? Math.ceil(logData.length / pageSize) : 1;
//   const paginatedData = logData
//     ? logData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
//     : [];

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   function compareStringFloats(str1, str2) {
//     const num1 = parseFloat(str1);
//     const num2 = parseFloat(str2);

//     return num1 < num2 ? "Fail" : "Pass";
//   }

//   // Function to export data to Excel
//   const handleExportClick = async () => {
//     if (!logData || logData.length === 0) {
//       notify("warning", t("noDataToExport"));
//       return;
//     }

//     setIsExporting(true); // Set loader to true

//     try {
//       // Prepare headers
//       const headers = [
//         [
//           "Test Name",
//           "Attempts",
//           "Date",
//           "Maximum Score",
//           "Attempt Score",
//           "Pass/Fail",
//         ],
//       ];

//       const dataToExport = logData.map((log) => [
//         log.name,
//         log.attempts,
//         log.date,
//         log.maximumScore,
//         log.attemptScore,
//         log.passOrFail,
//       ]);

//       // Simulate delay (optional) to show the loader for a short time
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Handle the export to Excel
//       handleExportToExcel(
//         dataToExport,
//         headers,
//         "ElementActivityTransition.xlsx"
//       );

//       // Optional: Success notification
//       notify("success", t("exportSuccess"));
//     } catch (error) {
//       // Optional: Error notification
//       notify("error", t("exportFailed"));
//       console.error("Export Error:", error);
//     } finally {
//       setIsExporting(false); // Set loader to false when done
//     }
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           margin: "25px",
//           borderRadius: "8px",
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <Box>
//           <Typography variant="h6" style={{ fontWeight: "500" }}>
//             {t("usersMCQSimulationAttemptReport")}
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             {t("getUserMCQSimulationReport")}
//           </Typography>
//         </Box>

//         <Button
//           sx={{
//             height: "40px",
//             borderRadius: "8px",
//             textTransform: "none",
//           }}
//           variant="contained"
//           size="small"
//           startIcon={
//             isExporting ? (
//               <CircularProgress size={20} color="inherit" />
//             ) : (
//               <Download />
//             )
//           }
//           onClick={handleExportClick}
//           disabled={isExporting} // Disable the button while exporting
//         >
//           {isExporting ? t("exporting") : t("export")}
//         </Button>
//       </Box>
//       <Box
//         sx={{
//           padding: "20px",
//           backgroundColor: "#fff",
//           margin: "25px",
//           borderRadius: "8px",
//         }}
//       >
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between", // Align items to left and right
//               gap: "20px",
//               paddingTop: "16px",
//               paddingBottom: "16px",
//               borderRadius: "8px", // Rounded corners
//             }}
//           >
//             {/* Switch Toggle with labels TEST and MCQ */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
//               <Typography>{t("testLabel")}</Typography>{" "}
//               {/* Label on the left */}
//               <Switch
//                 checked={toggleValue}
//                 onChange={handleToggleChange}
//                 inputProps={{ "aria-label": "Test/MCQ toggle" }}
//               />
//               <Typography>{t("mcqLabel")}</Typography>{" "}
//               {/* Label on the right */}
//             </Box>

//             {/* Test Name Autocomplete and Search Button on the right */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "20px",
//               }}
//             >
//               <Box sx={{ width: "250px" }}>
//                 <Controller
//                   name="user"
//                   control={control}
//                   render={({ field }) => (
//                     <Autocomplete
//                       {...field}
//                       freeSolo
//                       options={usersDropdown?.length > 0 ? usersDropdown : []}
//                       getOptionLabel={(option) => option.label || ""}
//                       value={
//                         usersDropdown?.find(
//                           (option) => option.value === field.value
//                         ) || null
//                       }
//                       loading={isFetchingUsersDropdown}
//                       onInputChange={(e, value, reason) => {
//                         if (reason === "clear") {
//                           field.onChange("");
//                           handleUserSearch();
//                         } else if (reason === "input") {
//                           handleUserSearch(value);
//                         }
//                       }}
//                       onChange={(e, value) => {
//                         field.onChange(value || "");
//                       }}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label={
//                             isFetchingUsersDropdown
//                               ? t("fetchingUsers")
//                               : usersDropdown !== null &&
//                                 usersDropdown?.length === 0
//                               ? t("noDataAvailable")
//                               : t("selectUser")
//                           }
//                           variant="outlined"
//                           sx={{
//                             borderRadius: "8px",
//                             backgroundColor: "#f9fafb",
//                           }}
//                         />
//                       )}
//                     />
//                   )}
//                 />
//               </Box>
//               <Controller
//                 name="testName"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     disabled={!selectedUser}
//                     {...field}
//                     select
//                     label={
//                       isFetchingTestNamesDropdown
//                         ? t("fetchingTestNames")
//                         : testNamesDropdown !== null &&
//                           testNamesDropdown?.length === 0
//                         ? t("noDataAvailable")
//                         : t("selectTestName")
//                     }
//                     variant="outlined"
//                     sx={{
//                       width: "250px",
//                       borderRadius: "8px",
//                       backgroundColor: "#f9fafb",
//                     }}
//                   >
//                     <MenuItem value="">Select Test Name</MenuItem>
//                     {testNamesDropdown &&
//                       testNamesDropdown?.map((option) => (
//                         <MenuItem key={option.value} value={option.value}>
//                           {option.label}
//                         </MenuItem>
//                       ))}
//                   </TextField>
//                 )}
//               />
//               {/* Search Button */}
//               <Button
//                 disabled={!selectedTestName || !selectedUser}
//                 variant="contained"
//                 type="submit"
//                 sx={{
//                   height: "44px", // Match the height of the input fields
//                   padding: "0 24px",
//                   borderRadius: "8px", // Rounded corners
//                   textTransform: "none", // Avoid uppercase text
//                   fontWeight: "500",
//                 }}
//               >
//                 {t("search")}
//               </Button>
//             </Box>
//           </Box>
//         </form>

//         <Divider sx={{ marginTop: 2 }} />

//         {/* Table Section */}
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>{t("testName")}</TableCell>
//                 <TableCell>{t("attempts")}</TableCell>
//                 <TableCell>{t("date")}</TableCell>
//                 <TableCell>{t("maximumScore")}</TableCell>
//                 <TableCell>{t("attemptScore")}</TableCell>
//                 <TableCell>{t("passFail")}</TableCell>
//                 {toggleValue === "TEST" && (
//                   <>
//                     <TableCell> {t("correctClick")} </TableCell>
//                     <TableCell> {t("incorrectClick")} </TableCell>
//                   </>
//                 )}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {/* Show appropriate messages instead of rows */}
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center">
//                     <CircularProgress />
//                   </TableCell>
//                 </TableRow>
//               ) : errorMessage ? (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center">
//                     <Typography variant="h5" sx={{ fontWeight: "bold" }}>
//                       {errorMessage}
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : !searchInitiated ? (
//                 <TableRow>
//                   <TableCell colSpan={5} align="center">
//                     <Typography
//                       variant="p"
//                       sx={{
//                         fontWeight: "500",
//                         justifyContent: "center",
//                         display: "flex",
//                       }}
//                     >
//                       {!selectedUser
//                         ? t("selectUserMessage")
//                         : !selectedTestName
//                         ? t("selectTestNameMessage")
//                         : t("hitSearchMessage")}
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : logData && logData.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center">
//                     <Nodata image={true} />
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedData?.map((log, index) => (
//                   <TableRow key={index}>
//                     <TableCell>
//                       <Box
//                         sx={{ display: "flex", alignItems: "center", gap: 2 }}
//                       >
//                         <Avatar
//                           src={log.profilePic}
//                           alt={log.name}
//                           sx={{ width: 40, height: 40, borderRadius: "50%" }}
//                         />
//                         {log?.name}
//                       </Box>
//                     </TableCell>
//                     <TableCell>{log?.attempts}</TableCell>
//                     <TableCell>{log?.date}</TableCell>
//                     <TableCell>{log?.maximumScore}</TableCell>
//                     <TableCell>{log.attemptScore}</TableCell>
//                     <TableCell>{log?.passOrFail}</TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Pagination section */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginTop: 2,
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               gap: "12px",
//               alignItems: "center",
//             }}
//           >
//             <Button
//               variant="outlined"
//               disabled={currentPage === 1}
//               onClick={handlePreviousPage}
//               sx={{
//                 borderColor: "#D0D5DD",
//                 color: "#344054",
//                 textTransform: "none",
//                 borderRadius: "8px",
//               }}
//             >
//               {t("previous")}
//             </Button>
//             <Button
//               variant="outlined"
//               disabled={currentPage === totalPages}
//               onClick={handleNextPage}
//               sx={{
//                 borderColor: "#D0D5DD",
//                 color: "#344054",
//                 textTransform: "none",
//                 borderRadius: "8px",
//               }}
//             >
//               {t("next")}
//             </Button>
//           </Box>
//           <Typography sx={{ color: "#344054" }}>
//             {t("page")} {currentPage} {t("of")} {totalPages}
//           </Typography>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default ProcessOwnerMCQSimulationLogs;

// // import React from 'react'

// // const ProcessOwnerMCQSimulationLogs = () => {
// //   return (
// //     <div>ProcessOwnerMCQSimulationLogs</div>
// //   )
// // }

// // export default ProcessOwnerMCQSimulationLogs

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
  Autocomplete,
  Switch,
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

const ProcessOwnerMCQSimulationLogs = () => {
  const { t } = useTranslation();
  const [testNamesDropdown, setTestNamesDropdown] = useState(null);
  const [allTestDropdownData, setAllTestDropdownData] = useState(null);
  const [isFetchingTestNamesDropdown, setIsFetchingTestNamesDropdown] =
    useState(false);
  const [usersDropdown, setUsersDropdown] = useState(null);
  const [isFetchingUsersDropdown, setIsFetchingUsersDropdown] = useState(false);
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [toggleValue, setToggleValue] = useState("TEST");
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      testName: "",
      user: null,
    },
  });
  const selectedTestName = watch("testName");
  const selectedUser = watch("user");

  const handleToggleChange = (event) => {
    const value = event.target.checked;
    setToggleValue(value ? "MCQ" : "TEST");
    const currentValue = value ? "MCQ" : "TEST";
    if (currentValue === "MCQ") {
      setTestNamesDropdown(allTestDropdownData?.mcq);
    } else if (currentValue === "TEST") {
      setTestNamesDropdown(allTestDropdownData?.test);
    } else {
      setTestNamesDropdown([]);
    }
  };

  const fetchMCQSimulationNamesDropdown = async () => {
    setIsFetchingTestNamesDropdown(true);
    try {
      const data = await reportApis.getTestNameDropdownOption({
        UserID: selectedUser?.value || null,
      });
      setAllTestDropdownData(data);
      const currentValue = toggleValue;
      if (currentValue === "MCQ") {
        setTestNamesDropdown(data?.mcq);
      } else if (currentValue === "TEST") {
        setTestNamesDropdown(data?.test);
      } else {
        setTestNamesDropdown([]);
      }
    } catch (error) {
      console.error("Failed to fetch Test name dropdown options", error);
      // notify("error", "Failed to fetch Test name dropdown options");
      setTestNamesDropdown([]);
    } finally {
      setIsFetchingTestNamesDropdown(false);
    }
  };

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

  useEffect(() => {
    if (selectedUser) {
      fetchMCQSimulationNamesDropdown();
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchUsersDropdown();
  }, []);

  const onSubmit = async (formData) => {
    setSearchInitiated(true);
    const { testName, user } = formData;
    if (!testName || !user) {
      setErrorMessage("Please select User and Test Name");
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    const currentValue = toggleValue;
    const body = {
      ModuleID: testName,
      ModuleType: currentValue === "TEST" ? "Skill Assessment" : "MCQ",
      UserID: selectedUser?.value || null,
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
          correctClick: log?.CorrectClick || "N/A",
          incorrectClick: log?.IncorrectClick || "N/A",
        };
      });

      setLogData(formattedLogs);
      setCurrentPage(1);
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

  // Function to export data to Excel
  const handleExportClick = async () => {
    if (!logData || logData.length === 0) {
      notify("warning", t("noDataToExport"));
      return;
    }

    setIsExporting(true); // Set loader to true

    try {
      // Prepare headers based on toggleValue
      const headers = [
        toggleValue === "TEST"
          ? [
              "Test Name",
              "Attempts",
              "Date",
              "Maximum Score",
              "Attempt Score",
              "Pass/Fail",
              "Correct Click",
              "Incorrect Click",
            ]
          : [
              "Test Name",
              "Attempts",
              "Date",
              "Maximum Score",
              "Attempt Score",
              "Pass/Fail",
            ],
      ];

      const dataToExport = logData.map((log) =>
        toggleValue === "TEST"
          ? [
              log.name,
              log.attempts,
              log.date,
              log.maximumScore,
              log.attemptScore,
              log.passOrFail,
              log.correctClick,
              log.incorrectClick,
            ]
          : [
              log.name,
              log.attempts,
              log.date,
              log.maximumScore,
              log.attemptScore,
              log.passOrFail,
            ]
      );

      // Simulate delay (optional) to show the loader for a short time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle the export to Excel
      handleExportToExcel(
        dataToExport,
        headers,
        "ElementActivityTransition.xlsx"
      );

      // Optional: Success notification
      notify("success", t("exportSuccess"));
    } catch (error) {
      // Optional: Error notification
      notify("error", t("exportFailed"));
      console.error("Export Error:", error);
    } finally {
      setIsExporting(false); // Set loader to false when done
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
          startIcon={
            isExporting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Download />
            )
          }
          onClick={handleExportClick}
          disabled={isExporting} 
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
              justifyContent: "space-between", 
              gap: "20px",
              paddingTop: "16px",
              paddingBottom: "16px",
              borderRadius: "8px", 
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Typography>{t("testLabel")}</Typography>{" "}
              <Switch
                checked={toggleValue === "MCQ"}
                onChange={handleToggleChange}
                inputProps={{ "aria-label": "Test/MCQ toggle" }}
              />
              <Typography>{t("mcqLabel")}</Typography>{" "}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <Box sx={{ width: "250px" }}>
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
                            backgroundColor: "#f9fafb",
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Box>
              <Controller
                name="testName"
                control={control}
                render={({ field }) => (
                  <TextField
                    disabled={!selectedUser}
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
                disabled={!selectedTestName || !selectedUser}
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
                <TableCell>{t("testName")}</TableCell>
                <TableCell>{t("attempts")}</TableCell>
                <TableCell>{t("date")}</TableCell>
                <TableCell>{t("maximumScore")}</TableCell>
                <TableCell>{t("attemptScore")}</TableCell>
                <TableCell>{t("passFail")}</TableCell>
                {toggleValue === "TEST" && (
                  <>
                    <TableCell> {t("correctClick")} </TableCell>
                    <TableCell> {t("incorrectClick")} </TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Show appropriate messages instead of rows */}
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={toggleValue === "TEST" ? 8 : 6}
                    align="center"
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : errorMessage ? (
                <TableRow>
                  <TableCell
                    colSpan={toggleValue === "TEST" ? 8 : 6}
                    align="center"
                  >
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {errorMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : !searchInitiated ? (
                <TableRow>
                  <TableCell
                    colSpan={toggleValue === "TEST" ? 8 : 6}
                    align="center"
                  >
                    <Typography
                      variant="p"
                      sx={{
                        fontWeight: "500",
                        justifyContent: "center",
                        display: "flex",
                      }}
                    >
                      {!selectedUser
                        ? t("selectUserMessage")
                        : !selectedTestName
                        ? t("selectTestNameMessage")
                        : t("hitSearchMessage")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : logData && logData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={toggleValue === "TEST" ? 8 : 6}
                    align="center"
                  >
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
                        {log?.name}
                      </Box>
                    </TableCell>
                    <TableCell>{log?.attempts}</TableCell>
                    <TableCell>{log?.date}</TableCell>
                    <TableCell>{log?.maximumScore}</TableCell>
                    <TableCell>{log.attemptScore}</TableCell>
                    <TableCell>{log?.passOrFail}</TableCell>
                    {toggleValue === "TEST" && (
                      <>
                        <TableCell>{log?.CorrectClick}</TableCell>
                        <TableCell>{log?.InCorrectClick}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
    </>
  );
};

export default ProcessOwnerMCQSimulationLogs;
