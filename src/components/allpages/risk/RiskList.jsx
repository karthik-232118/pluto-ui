import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Divider,
  Chip,
  IconButton,
  Menu,
  Tabs,
  Tab,
  CircularProgress,
  TablePagination,
  GlobalStyles,
} from "@mui/material";
import "./Risk.css";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MoreVert } from "@mui/icons-material";
import { useEffect, useState } from "react";
import RiskCreationModal from "./RiskCreationModal";
import RiskAssessmentDrawer from "./RiskAssessmentDrawer";
import RiskAnalysisDrawer from "./RiskAnalysisDrawer";
import RiskTreatmentDrawer from "./RiskTreatmentDrawer";
import MonitoringReviewDrawer from "./MonitoringReviewDrawer";
import {
  Get_Risk_By_RiskID_API,
  Get_Risk_List_API,
  Get_RiskAdded_SOPList_API,
} from "../../../services/sopRisk/SOPRisk";
import { listProcessOwner } from "../../../services/sopModules/SopModule";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import AccessDenied from "../../accessDenied/AccessDenied";
import RisksModal from "../questions/RisksModal";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4361ee",
    },
    secondary: {
      main: "#3f37c9",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#212529",
      secondary: "#6c757d",
    },
    success: {
      main: "#4cc9f0",
      contrastText: "#fff",
    },
    warning: {
      main: "#f8961e",
      contrastText: "#fff",
    },
    error: {
      main: "#f72585",
      contrastText: "#fff",
    },
  },
});

const RiskList = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isCreate, SetIsCreate] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState(null);
  const [isRisksModalOpen, setIsRisksModalOpen] = useState(false);

  const [riskData, setRiskData] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("activeTab") || "all";
    const tabs = [
      "all",
      "Risk Identification",
      "Risk Assessment",
      "Risk Analysis Form",
      "Risk Treatment",
      "Risk Monitoring & Review",
    ];
    return tabs.includes(savedTab) ? savedTab : "all";
  });
  const [processOwners, setProcessOwners] = useState([]);
  const [sopList, setSopList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSOPName, setSelectedSOPName] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [editRisk, setEditRisk] = useState(null);
  const [selecctedRiskTreament, SetSelectedRiskTreatment] = useState(null);
  const [sampleDataState, setSampleData] = useState([]);
  const [unfilteredData, setUnfilteredData] = useState([]);
  const [selectedSOPDraftID, setSelectedSOPDraftID] = useState("");
  const [page, setPage] = useState(0); 
  const [rowsPerPage] = useState(10); 
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openMonitoringReview, SetSelectedMonitoringReview] = useState(null);
  const [pagination, setPagination] = useState({});
  const [selectedRiskAnalysis, SetSelectedRiskAnalysis] = useState(null);
  const userType = localStorage.getItem("user_type");
  const [selectedEditdata, setSelectedEditdata] = useState(null);

  console.log("RiskList rendered",editRisk,rowsPerPage);

  useEffect(() => {
    const fetchRiskAddedSOPList = async () => {
      try {
        const data = {};
        const response = await Get_RiskAdded_SOPList_API(data);
        console.log(
          "API Response for Risk Added SOP List:",
          response?.data?.data
        );
        setSopList(response?.data?.data || []);
        console.log("SOP List:", sopList);
      } catch (error) {
        console.error("Error fetching Risk Added SOP List:", error);
      }
    };
    fetchRiskAddedSOPList();
  }, []);

  useEffect(() => {
    const fetchRiskList = async () => {
      try {
        setLoading(true); 
        setSampleData([]);
        const payload = {
          SOPDraftID: selectedSOPDraftID || "",
          searchQuery: searchQuery,
          page: page + 1,
          RiskState: activeTab === "all" ? "" : activeTab,
        };
        const response = await Get_Risk_List_API(payload);
        if (
          response?.data?.message ===
          "Access denied: Process Owner or Admin privileges required"
        ) {
          toast.error(
            "Access denied: Process Owner or Admin privileges required"
          );
        }
        console.log("API Response PAEEE:", response?.data?.pagination);
        setPagination(response?.data?.pagination);
        const fetchedData = response?.data?.data || [];
        setUnfilteredData(fetchedData);
        if (activeTab === "all") {
          setSampleData(fetchedData);
        } else {
          setSampleData(
            fetchedData.filter((row) => {
              if (activeTab === "Risk Identification") {
                return row.RiskState === "Risk Identification";
              } else if (activeTab === "Risk Assessment") {
                return row.RiskState === "Risk Assessment";
              } else if (activeTab === "Risk Analysis Form") {
                return row.RiskState === "Risk Analysis Form";
              } else if (activeTab === "Risk Treatment") {
                return row.RiskState === "Risk Treatment";
              } else if (activeTab === "Risk Monitoring & Review") {
                return row.RiskState === "Risk Monitoring & Review";
              }
              return true;
            })
          );
        }
      } catch (error) {
        console.error("Error fetching risk list:", error);
      } finally {
        setLoading(false); // End loading
      }
    };
    const fetchProcessOwners = async () => {
      try {
        const response = await listProcessOwner();
        console.log(
          "API Response Process Owners:",
          response?.data?.data?.userList
        );
        setProcessOwners(response?.data?.data?.userList || []);
      } catch (error) {
        console.error("Error fetching process owners:", error);
      }
    };
    fetchRiskList();
    fetchProcessOwners();
  }, [selectedSOPDraftID, searchQuery, activeTab, page]);
  const handleDelete = () => {
    handleMenuClose();
    setOpenDeleteModal(true);
  };
  const handleConfirmDelete = (id) => {
    console.log("Deleted Risk ID:", id);
    const updatedData = sampleDataState.filter((row) => row.RiskID !== id);
    setSampleData(updatedData);
  };
  const handleMenuClick = (event, risk) => {
    setAnchorEl(event.currentTarget);
    setSelectedRisk(risk);
    console.log("Selected Risk:", risk);
    setSelectedEditdata(risk);
    SetSelectedRiskTreatment(risk);
    SetSelectedMonitoringReview(risk);
    SetSelectedRiskAnalysis(risk);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDrawerOpen = (drawerType) => {
    setDrawerType(drawerType);
    setOpenDrawer(true);
    setAnchorEl(null);
    SetIsCreate(true);
  };
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    } else {
      setActiveTab("all");
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
    localStorage.setItem("activeTab", newValue);

    if (newValue === "all") {

      setSampleData(unfilteredData);
    } else if (newValue === "Risk Identification") {
      setSampleData(unfilteredData.filter((row) => row.RiskState === newValue));
    } else if (newValue === "Risk Assessment") {
      setSampleData(unfilteredData.filter((row) => row.RiskState === newValue));
    } else if (newValue === "Risk Analysis Form") {
      setSampleData(unfilteredData.filter((row) => row.RiskState === newValue));
    } else if (newValue === "Risk Treatment") {
      setSampleData(unfilteredData.filter((row) => row.RiskState === newValue));
    } else if (newValue === "Risk Monitoring & Review") {
      setSampleData(unfilteredData.filter((row) => row.RiskState === newValue));
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const paginatedData = sampleDataState;

  if (userType === "EndUser" || userType === "Admin") {
    return <AccessDenied />;
  }

  const handleRowClick = async (riskId) => {
    try {
      const payload = { RiskIDs: [riskId] };
      const response = await Get_Risk_By_RiskID_API(payload);
      console.log("API response for RiskID In the RiskList:", riskId, response);
      setRiskData(response?.data?.data || null);
      setIsRisksModalOpen(true); // Open modal after success
    } catch (error) {
      console.error("Error fetching risk by RiskID:", riskId, error);
    }
  };

  return (
    <>
     <GlobalStyles
        styles={{
          ".risklist-root table, .risklist-root table *": {
            fontFamily: '"Inter", sans-serif !important',
          },
        }}
      />
    <ThemeProvider theme={theme}>
      <Box
        className="risklist-root"
        sx={{
          p: 3,
          backgroundColor: "background.default",
          minHeight: "100vh",
          fontFamily: "Inter, sans-serif !important",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            mb: 3,
          }}
        ></Box>

        <Card
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            mb: 3,
            background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
          }}
        >
          <Box
            sx={{
              p: 3,
              pb: 2,
              background: "linear-gradient(to top, #2C64FF, #4A90E2)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                component="h2"
                fontWeight="bold"
                sx={{ fontFamily: "Inter, sans-serif !important" }}
              >
                {t("create_new_risk")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  mt: 0.5,
                  fontFamily: "Inter, sans-serif !important",
                }}
              >
                {t("view_search_manage")}
              </Typography>
            </Box>
            {activeTab === "all" && (
              <Box>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenModal(true);
                    setEditRisk(null); 
                    SetIsCreate(true); 
                  }}
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    color: "#000",
                    fontWeight: "500",
                    fontFamily: "Inter, sans-serif !important",
                    "&:hover": {
                      backgroundColor: "#3B82F6",
                      boxShadow: "0 4px 8px rgba(67, 97, 238, 0.3)",
                    },
                  }}
                >
                  {t("create_new_risk")}
                </Button>
              </Box>
            )}
          </Box>

          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                px: 3,
                pt: 2,
                backgroundColor: "#f8f9fa",
                borderRadius: "12px 12px 0 0",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "start", // Centering the tabs container
                alignItems: "center",
                fontFamily: "Inter, sans-serif !important",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered // This will center the tabs
                sx={{
                  fontFamily: "Inter, sans-serif !important",
                  "& .MuiTabs-indicator": {
                    background: "linear-gradient(90deg, #4361ee, #3a0ca3)",
                    height: 4,
                    borderRadius: "4px 4px 0 0",
                  },
                  "& .MuiTab-root": {
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  },
                  "& .MuiTab-wrapper": {
                    width: "100%",
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
              >
                <Tab
                  label={t("label_all")}
                  value="all"
                  sx={{
                    textTransform: "none",
                    color: activeTab === "all" ? "#3a0ca3" : "#6c757d",
                    fontWeight: activeTab === "all" ? "600" : "500",
                    fontFamily: "Inter, sans-serif !important",
                    fontSize: "0.95rem",
                    px: 0,
                    py: 2,
                    minHeight: "40px",
                    backgroundColor:
                      activeTab === "all"
                        ? "rgba(67, 97, 238, 0.1)"
                        : "transparent",
                    borderRadius: "8px 8px 0 0",
                    marginX: 1,
                    minWidth: "120px",
                    "&:hover": {
                      color: "#3a0ca3",
                      backgroundColor:
                        activeTab === "all"
                          ? "rgba(67, 97, 238, 0.15)"
                          : "rgba(58, 12, 163, 0.05)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(67, 97, 238, 0.1)",
                    },
                  }}
                />

                <Tab
                  label={t("label_risk_identification")}
                  value="Risk Identification"
                  sx={{
                    fontFamily: "Inter, sans-serif !important",
                    textTransform: "none",
                    color:
                      activeTab === "Risk Identification"
                        ? "#3a0ca3"
                        : "#6c757d",
                    fontWeight:
                      activeTab === "Risk Identification" ? "600" : "500",
                    fontSize: "0.95rem",
                    px: 0,
                    py: 2,
                    minHeight: "52px",
                    backgroundColor:
                      activeTab === "Risk Identification"
                        ? "rgba(67, 97, 238, 0.1)"
                        : "transparent",
                    borderRadius: "8px 8px 0 0",
                    marginX: 1,
                    minWidth: "120px",
                    "&:hover": {
                      color: "#3a0ca3",
                      backgroundColor:
                        activeTab === "Risk Identification"
                          ? "rgba(67, 97, 238, 0.15)"
                          : "rgba(58, 12, 163, 0.05)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(67, 97, 238, 0.1)",
                    },
                  }}
                />
                <Tab
                  label={t("label_risk_assessment")}
                  value="Risk Assessment"
                  sx={{
                    fontFamily: "Inter, sans-serif !important",
                    textTransform: "none",
                    color:
                      activeTab === "riskAssessment" ? "#3a0ca3" : "#6c757d",
                    fontWeight: activeTab === "riskAssessment" ? "600" : "500",
                    fontSize: "0.95rem",
                    px: 0,
                    py: 2,
                    minHeight: "52px",
                    backgroundColor:
                      activeTab === "riskAssessment"
                        ? "rgba(67, 97, 238, 0.1)"
                        : "transparent",
                    borderRadius: "8px 8px 0 0",
                    marginX: 1,
                    minWidth: "150px",
                    "&:hover": {
                      color: "#3a0ca3",
                      backgroundColor:
                        activeTab === "riskAssessment"
                          ? "rgba(67, 97, 238, 0.15)"
                          : "rgba(58, 12, 163, 0.05)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(67, 97, 238, 0.1)",
                    },
                  }}
                />
                <Tab
                  label={t("label_risk_analysis")}
                  value="Risk Analysis Form"
                  sx={{
                    fontFamily: "Inter, sans-serif !important",
                    textTransform: "none",
                    color: activeTab === "riskAnalysis" ? "#3a0ca3" : "#6c757d",
                    fontWeight: activeTab === "riskAnalysis" ? "600" : "500",
                    fontSize: "0.95rem",
                    px: 0,
                    py: 2,
                    minHeight: "52px",
                    backgroundColor:
                      activeTab === "riskAnalysis"
                        ? "rgba(67, 97, 238, 0.1)"
                        : "transparent",
                    borderRadius: "8px 8px 0 0",
                    marginX: 1,
                    minWidth: "120px",
                    "&:hover": {
                      color: "#3a0ca3",
                      backgroundColor:
                        activeTab === "riskAnalysis"
                          ? "rgba(67, 97, 238, 0.15)"
                          : "rgba(58, 12, 163, 0.05)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(67, 97, 238, 0.1)",
                    },
                  }}
                />
                <Tab
                  label={t("label_risk_treatment")}
                  value="Risk Treatment"
                  sx={{
                    fontFamily: "Inter, sans-serif !important",
                    textTransform: "none",
                    color:
                      activeTab === "riskTreatment" ? "#3a0ca3" : "#6c757d",
                    fontWeight: activeTab === "riskTreatment" ? "600" : "500",
                    fontSize: "0.95rem",
                    px: 0,
                    py: 2,
                    minHeight: "52px",
                    backgroundColor:
                      activeTab === "riskTreatment"
                        ? "rgba(67, 97, 238, 0.1)"
                        : "transparent",
                    borderRadius: "8px 8px 0 0",
                    marginX: 1,
                    minWidth: "120px",
                    "&:hover": {
                      color: "#3a0ca3",
                      backgroundColor:
                        activeTab === "riskTreatment"
                          ? "rgba(67, 97, 238, 0.15)"
                          : "rgba(58, 12, 163, 0.05)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(67, 97, 238, 0.1)",
                    },
                  }}
                />
                <Tab
                  label={t("label_monitoring_review")}
                  value="Risk Monitoring & Review"
                  sx={{
                    fontFamily: "Inter, sans-serif !important",
                    textTransform: "none",
                    color:
                      activeTab === "monitoringReview" ? "#3a0ca3" : "#6c757d",
                    fontWeight:
                      activeTab === "monitoringReview" ? "600" : "500",
                    fontSize: "0.95rem",
                    px: 0,
                    py: 2,
                    minHeight: "52px",
                    backgroundColor:
                      activeTab === "monitoringReview"
                        ? "rgba(67, 97, 238, 0.1)"
                        : "transparent",
                    borderRadius: "8px 8px 10px 0",
                    minWidth: "120px",
                    "&:hover": {
                      color: "#3a0ca3",
                      backgroundColor:
                        activeTab === "monitoringReview"
                          ? "rgba(67, 97, 238, 0.15)"
                          : "rgba(58, 12, 163, 0.05)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(67, 97, 238, 0.1)",
                    },
                  }}
                />
              </Tabs>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 3,
                pb: 0,
                marginBottom: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  fontFamily: "Inter, sans-serif !important",
                }}
              >
                <TextField
                  placeholder={t("placeholder_search_records")}
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: "8px",
                      width: 350,
                      backgroundColor: "background.paper",
                    },
                  }}
                />
                {/* {activeTab === "all" && ( */}
                <Select
                  value={selectedSOPName}
                  displayEmpty
                  size="small"
                  variant="outlined"
                  sx={{
                    minWidth: 200,
                    fontFamily: "Inter, sans-serif !important",
                    borderRadius: "8px",
                    backgroundColor: "background.paper",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "divider",
                    },
                  }}
                  onChange={async (e) => {
                    const selectedSOPName = e.target.value;
                    setSelectedSOPName(selectedSOPName); 
                    const selectedSOP = sopList.find(
                      (sop) => sop.SOPName === selectedSOPName
                    );

                    if (selectedSOP) {
                      setSelectedSOPDraftID(selectedSOP.SOPDraftID);
                    } else {
                      setSelectedSOPDraftID(""); 
                    }
                    if (selectedSOPName === "") {
                      setSampleData(unfilteredData);
                    } else {
                      setSampleData(
                        unfilteredData.filter(
                          (row) => row.SOPName === selectedSOPName
                        )
                      );
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300, 
                        overflow: "auto",
                      },
                    },
                    anchorOrigin: {
                      vertical: "bottom", 
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                  }}
                >
                  <MenuItem value="">{t("filter_by_sop")}</MenuItem>
                  {sopList.map((sop) => (
                    <MenuItem key={sop.SOPDraftID} value={sop.SOPName}>
                      {sop.SOPName}
                    </MenuItem>
                  ))}
                </Select>

              </Box>
            </Box>
            <Divider sx={{ my: 0 }} />

            <Box sx={{ overflowX: "auto" }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : sampleDataState.length === 0 ? (
                <Typography variant="h6" sx={{ textAlign: "center", py: 4 }}>
                  No Data Found
                </Typography>
              ) : (
                <Table
                className="interFontImportant"
                  sx={{
                    minWidth: 900,
                    
                  }}
                >
                  <TableHead
                    sx={{
                      fontWeight: "600",
                      fontSize: "0.875rem",
                      fontFamily: "Inter, sans-serif !important",
                    }}
                  >
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          fontFamily: "Inter, sans-serif !important",
                        }}
                      >
                        Risk Id
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          fontFamily: "Inter, sans-serif !important",
                        }}
                      >
                        {t("risk_name")}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          fontFamily: "Inter, sans-serif !important",
                        }}
                      >
                        {t("department")}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          fontFamily: "Inter, sans-serif !important",
                        }}
                      >
                        {t("risk_owner")}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          fontFamily: "Inter, sans-serif !important",
                        }}
                      >
                        {t("risk_state")}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          fontFamily: "Inter, sans-serif !important",
                        }}
                      >
                        {t("created_date")}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "600",
                          fontSize: "0.875rem",
                          fontFamily: "Inter, sans-serif !important",
                        }}
                      >
                        {t("status")}
                      </TableCell>
                      {activeTab !== "all" &&
                        activeTab !== "Risk Monitoring & Review" && (
                          <TableCell
                            sx={{ fontWeight: "600", fontSize: "0.875rem" }}
                          >
                            {t("actions")}
                          </TableCell>
                        )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.map((row) => {
                      const owner = processOwners.find(
                        (owner) => owner.UserID === row.IdentifiedBy
                      );
                      return (
                        <TableRow
                          key={row.RiskID}
                          hover
                          // onClick={() => handleRowClick(row.RiskModuleDraftID)}
                          style={{ cursor: "pointer" }}
                          sx={{ fontFamily: "Inter, sans-serif !important" }}
                        >
                          <TableCell
                            onClick={() =>
                              handleRowClick(row.RiskModuleDraftID)
                            }
                          >
                            {row.RiskIndex}
                          </TableCell>

                          <TableCell
                            onClick={() =>
                              handleRowClick(row.RiskModuleDraftID)
                            }
                          >
                            {row.RiskName}
                          </TableCell>
                          <TableCell
                            onClick={() =>
                              handleRowClick(row.RiskModuleDraftID)
                            }
                          >
                            {row.RiskCategory}
                          </TableCell>
                          <TableCell
                            onClick={() =>
                              handleRowClick(row.RiskModuleDraftID)
                            }
                          >
                            {owner ? owner.UserName : "Not Found"}
                          </TableCell>
                          <TableCell
                            onClick={() =>
                              handleRowClick(row.RiskModuleDraftID)
                            }
                          >
                            {row.RiskState}
                          </TableCell>
                          <TableCell
                            onClick={() =>
                              handleRowClick(row.RiskModuleDraftID)
                            }
                          >
                            {new Date(row.CreatedDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "2-digit",
                              }
                            )}
                          </TableCell>
                          <TableCell
                            onClick={() =>
                              handleRowClick(row.RiskModuleDraftID)
                            }
                          >
                            <Chip
                              sx={{ width: "90px" }}
                              label={row.Status}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          {activeTab !== "all" && (
                            <TableCell>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMenuClick(e, row);
                                }}
                              >
                                <MoreVert />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                              >
                                {row.RiskState === "Risk Identification" && (
                                  <MenuItem
                                    onClick={() => handleDelete(row.RiskID)}
                                  >
                                    Delete
                                  </MenuItem>
                                )}
                                {row.RiskState === "Risk Identification" && (
                                  <MenuItem
                                    onClick={() => {
                                      setEditRisk(row); 
                                      setOpenModal(true);
                                      handleMenuClose();
                                      SetIsCreate(false); 
                                    }}
                                  >
                                    Edit 1st Step
                                  </MenuItem>
                                )}
                                {row.RiskState === "Risk Identification" && (
                                  <MenuItem
                                    onClick={() =>
                                      handleDrawerOpen("RiskAssessment")
                                    }
                                  >
                                    Risk Assessment
                                  </MenuItem>
                                )}

                                {row.RiskState === "Risk Assessment" && (
                                  <MenuItem
                                    onClick={() =>
                                      handleDrawerOpen("RiskAnalysis")
                                    }
                                  >
                                    Risk Analysis
                                  </MenuItem>
                                )}

                                {row.RiskState === "Risk Assessment" && (
                                  <MenuItem
                                    onClick={() => {
                                      setSelectedRisk(row); 
                                      handleDrawerOpen("RiskAssessment"); 
                                      handleMenuClose(); 
                                      SetIsCreate(false); 
                                    }}
                                  >
                                    Edit Risk Assessment
                                  </MenuItem>
                                )}
                                {row.RiskState === "Risk Analysis Form" && (
                                  <MenuItem
                                    onClick={() =>
                                      handleDrawerOpen("RiskTreatment")
                                    }
                                  >
                                    Risk Treatment
                                  </MenuItem>
                                )}

                                {row.RiskState === "Risk Analysis Form" && (
                                  <MenuItem
                                    onClick={() => {
                                      setSelectedRisk(row); 
                                      handleDrawerOpen("RiskAnalysis"); 
                                      handleMenuClose();
                                      SetIsCreate(false);
                                    }}
                                  >
                                    Edit Risk Analysis
                                  </MenuItem>
                                )}

                                {row.RiskState === "Risk Treatment" && (
                                  <MenuItem
                                    onClick={() =>
                                      handleDrawerOpen("MonitoringReview")
                                    }
                                  >
                                    Monitoring & Review
                                  </MenuItem>
                                )}

                                {row.RiskState === "Risk Treatment" && (
                                  <MenuItem
                                    onClick={() => {
                                      setSelectedRisk(row); 
                                      handleDrawerOpen("RiskTreatment"); 
                                      handleMenuClose(); 
                                      SetIsCreate(false);
                                    }}
                                  >
                                    Edit Risk Treatment
                                  </MenuItem>
                                )}
                                {activeTab === "Risk Monitoring & Review" && (
                                  <MenuItem
                                    onClick={() => {
                                      setSelectedRisk(row); 
                                      handleDrawerOpen("MonitoringReview"); 
                                      handleMenuClose();
                                      SetIsCreate(false);
                                    }}
                                  >
                                    Edit Monitoring & Review
                                  </MenuItem>
                                )}
                              </Menu>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </Box>

            <TablePagination
            sx={{fontFamily: "Inter, sans-serif !important"}}
              component="div"
              count={pagination?.total}
              rowsPerPage={pagination.pageSize}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[]}
              labelDisplayedRows={() => {
                const from = page * pagination.pageSize + 1;
                const to = Math.min(
                  (page + 1) * pagination.pageSize,
                  pagination.total
                );
                return `Page ${from}  Showing ${to} of ${pagination.total} items`;
              }}
            />
          </CardContent>
        </Card>
      </Box>

      <RiskCreationModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditRisk(null); // Clear after close
        }}
        editRisk={!isCreate ? selectedRisk : null}
        onSuccess={(rec) => setActiveTab(rec?.riskModule?.RiskState)}
        isCreate={isCreate} // Pass isCreate prop to the modal
      />

      {/* Conditional Drawer Rendering */}
      <RiskAssessmentDrawer
        open={openDrawer && drawerType === "RiskAssessment"}
        onClose={handleDrawerClose}
        risk={selectedRisk}
        editRisk={!isCreate ? selectedEditdata : null}
        onSuccess={(rec) => setActiveTab(rec?.riskModule?.RiskState)}
        isCreate={isCreate} // Pass isCreate prop to the modal
      />
      <RiskAnalysisDrawer
        open={openDrawer && drawerType === "RiskAnalysis"}
        onClose={handleDrawerClose}
        risk={selectedRisk}
        editRisk={!isCreate ? selectedRiskAnalysis : null}
        onSuccess={(rec) => setActiveTab(rec?.riskModule?.RiskState)}
        isCreate={isCreate} // Pass isCreate prop to the modal
      />
      <RiskTreatmentDrawer
        open={openDrawer && drawerType === "RiskTreatment"}
        onClose={handleDrawerClose}
        risk={selectedRisk}
        editRisk={!isCreate ? selecctedRiskTreament : null}
        onSuccess={(rec) => setActiveTab(rec?.riskModule?.RiskState)}
        isCreate={isCreate} 
      />
      <MonitoringReviewDrawer
        open={openDrawer && drawerType === "MonitoringReview"}
        onClose={handleDrawerClose}
        risk={selectedRisk}
        editRisk={!isCreate ? openMonitoringReview : null}
        onSuccess={(rec) => setActiveTab(rec?.riskModule?.RiskState)}
        isCreate={isCreate}
      />

      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        selectedRisk={selectedRisk}
        onDelete={handleConfirmDelete} 
      />

      <RisksModal
        open={isRisksModalOpen}
        handleClose={() => setIsRisksModalOpen(false)}
        riskData={riskData}
      />
    </ThemeProvider>
    
</>
  );
};

export default RiskList;
