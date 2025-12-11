import { useEffect, useState } from "react";
import "./LicenseKeyManagement.css";
import keyicon from "../../../assets/svg/keypages/keyicon.svg";
import home from "../../../assets/svg/keypages/home.svg";
import {
  Box,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Container,
  Chip,
  Stack,
} from "@mui/material";
import {
  Shield as ShieldIcon,
  BoltOutlined as PowerUserIcon,
  Person as EndUserIcon,
  RemoveRedEye as AuditorIcon,
  ContentCopy as ClipboardIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  GetLicenseKeyDetails,
  GetAddLicenseKey,
} from "../../../store/licensekeymanagement/action";
import { dateformatter } from "../../../utils";
import { useTranslation } from "react-i18next";
import AccessDenied from "../../accessDenied/AccessDenied";
import { useTheme } from "@mui/styles";
import { validateInput } from "../../../utils/securityUtils";
import errorHandler from "../../../utils/errorHandler";

const UserCountCard = ({ count, total, type, icon, gradient }) => {
  return (
    <Card
      sx={{
        background: gradient,
        color: "white",
        borderRadius: 2,
        boxShadow: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {count}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {type}
            </Typography>
          </Box>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: 2,
              padding: 1,
              backdropFilter: "blur(4px)",
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography
          variant="caption"
          sx={{ mt: 1, display: "block", opacity: 0.8 }}
        >
          {total > 0 ? `Of ${total} users` : "Unlimited allocation"}
        </Typography>
      </CardContent>
    </Card>
  );
};

const LicenseKeyManagement = () => {
  const { t } = useTranslation();
  const [fullLicenseKey, setFullLicenseKey] = useState("");
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [licenseKey, setLicenseKey] = useState("");
  const [organizationToken, setOrganizationToken] = useState("");
  // New state for active modules
  const [activeModules, setActiveModules] = useState([]);
  // Add states for clipboard feedback
  const [licenseKeyCopied, setLicenseKeyCopied] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main; // Use theme color directly

  // Access license key details from Redux store
  const licensekeydetails = useSelector(
    (state) => state?.licensekeydetails?.licensekeydetails
  );
  const loading = useSelector((state) => state?.licensekeydetails?.loading);
  const userType = localStorage.getItem("user_type");

  useEffect(() => {
    // Get and log sidebarData from localStorage
    const sidebarData = localStorage.getItem("sidebarData");
    try {
      const parsedSidebarData = sidebarData ? JSON.parse(sidebarData) : null;
      console.log("Sidebar Data from localStorage:", parsedSidebarData);
    } catch (error) {
      console.error("Error parsing sidebarData:", error);
      console.log("Raw sidebarData:", sidebarData);
    }

    dispatch(GetLicenseKeyDetails());
  }, [dispatch]);

  // Function to match module IDs with names from sidebar data
  const matchModuleNamesWithIds = (moduleIds) => {
    try {
      const sidebarData = localStorage.getItem("sidebarData");
      if (!sidebarData) return [];

      const parsedSidebarData = JSON.parse(sidebarData);
      if (!parsedSidebarData.data) return [];

      const modules = [];
      moduleIds.forEach((id) => {
        const matchedModule = parsedSidebarData.data.find(
          (module) => module.ModuleTypeID === id
        );
        if (matchedModule) {
          modules.push(matchedModule.ModuleName);
        }
      });

      return modules;
    } catch (error) {
      console.error("Error matching modules:", error);
      return [];
    }
  };

  // Calculate remaining days and process module data
  useEffect(() => {
    if (licensekeydetails?.data?.ValidityTo) {
      const validityDate = new Date(licensekeydetails.data.ValidityTo);
      const currentDate = new Date();
      const timeDiff = validityDate - currentDate;
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setDaysRemaining(days);
    }

    // Set the license key and process module data
    if (licensekeydetails?.licenseHistory?.length > 0) {
      const licenseKeyData = licensekeydetails.licenseHistory[0].LicenseKey;
      setFullLicenseKey(licenseKeyData);

      // Log and process ModuleTypeIDs
      const moduleIds = licensekeydetails.licenseHistory[0].ModuleTypeIDs;
      console.log("ModuleTypeIDs:", moduleIds);

      if (moduleIds && moduleIds.length > 0) {
        const matchedModules = matchModuleNamesWithIds(moduleIds);
        setActiveModules(matchedModules);
        console.log("Matched Module Names:", matchedModules);
      }
    }
  }, [licensekeydetails]);

  const handleBackHome = () => {
    alert("Going back to Home");
  };

  const keyHistoryData =
    licensekeydetails?.licenseHistory?.map((item, index) => ({
      serialNumber: index + 1,
      key: fullLicenseKey,
      pu: item?.NumberOfProcessOwnerUsers,
      eu: item?.NumberOfEndUsers,
      appliedOn: dateformatter(item?.ValidityFrom),
      expiredOn: dateformatter(item?.ValidityTo),
    })) || [];

  const handleApply = () => {
    const newErrors = {};

    // Add security validation checks
  



    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const requestBody = {
      LicenseKey: licenseKey,
      OrganizationStructureToken: organizationToken,
    };
    dispatch(GetAddLicenseKey(requestBody));
  };

  const copyToClipboard = (text, setIsCopied) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "background.default",
        padding: { xs: 2, md: 4 },
        position: "relative",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "fixed",
          zIndex: -20,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "1512px",
          height: "1512px",
          borderRadius: "1512px",
          opacity: 0.05,
          bgcolor: "primary.main",
          filter: "blur(240px)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "25%",
          left: "25%",
          width: "100px",
          height: "100px",
          borderRadius: "100%",
          bgcolor: "#E3F2FD",
          opacity: 0.2,
          filter: "blur(24px)",
          zIndex: -10,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "25%",
          right: "25%",
          width: "96px",
          height: "96px",
          borderRadius: "100%",
          bgcolor: "#F3E5F5",
          opacity: 0.2,
          filter: "blur(24px)",
          zIndex: -10,
        }}
      />

      {/* Access denied check */}
      {userType === "EndUser" || userType === "ProcessOwner" ? (
        <AccessDenied />
      ) : loading ? (
        /* Loading state */
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        /* Main content when loaded and authorized */
        <Container maxWidth="">
          <Card
            sx={{
              width: "100%",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {/* Card header with gradient */}
            <Box
              sx={{
                background:
                  bgcolor || "linear-gradient(to top, #2C64FF, #4A90E2)",
                padding: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="white">
                {t("licenseKeyManagement")}
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={1}
              >
                <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                  {t("manageLicenseKeys")}
                </Typography>
                <Box
                  component="span"
                  sx={{
                    px: 2,
                    py: 0.75,
                    bgcolor: "red",
                    color: "white",
                    borderRadius: 4,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {daysRemaining !== null
                    ? `${t("expiresIn")} ${daysRemaining} ${t("days")}`
                    : t("calculatingExpiration")}
                </Box>
              </Box>
            </Box>

            {/* Card body */}
            <Box
              sx={{
                padding: 3,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {/* User stats section */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="text.primary"
                  sx={{ mb: 2 }}
                >
                  {t("userAllocations")}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <UserCountCard
                      count={licensekeydetails?.data?.AdminUserAdded || 0}
                      total={licensekeydetails?.data?.NumberOfAdminUsers || 0}
                      type={t("admin")}
                      icon={<ShieldIcon />}
                      gradient="linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <UserCountCard
                      count={
                        licensekeydetails?.data?.ProcessOwnerUserAdded || 0
                      }
                      total={
                        licensekeydetails?.data?.NumberOfProcessOwnerUsers || 0
                      }
                      type={t("powerUsers")}
                      icon={<PowerUserIcon />}
                      gradient="linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <UserCountCard
                      count={licensekeydetails?.data?.EndUserAdded || 0}
                      total={licensekeydetails?.data?.NumberOfEndUsers || 0}
                      type={t("endUsers")}
                      icon={<EndUserIcon />}
                      gradient="linear-gradient(135deg, #2196f3 0%, #1976d2 100%)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <UserCountCard
                      count={licensekeydetails?.data?.AuditorUserAdded || 0}
                      total={licensekeydetails?.data?.NumberOfAuditorUsers || 0}
                      type={t("auditor")}
                      icon={<AuditorIcon />}
                      gradient="linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* Active Modules section - replaced with chips */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  {t("activeModules")}
                </Typography>

                {activeModules.length > 0 ? (
                  <Box sx={{ py: 1 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {activeModules.map((module, index) => (
                        <Chip
                          key={index}
                          label={module}
                          variant="outlined"
                          sx={{
                            px: 1,
                            borderRadius: 2,
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            border: "1px solid",
                            borderColor: bgcolor || "primary.main",
                            "& .MuiChip-icon": { color: "success.main" },
                            color: bgcolor || "text.primary",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      textAlign: "center",
                      border: "1px dashed",
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Typography color="text.secondary">
                      No active modules found
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider />

              {/* Key history section */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    {t("keyHistory")}
                  </Typography>
                </Box>
                <TableContainer
                  component={Paper}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Table>
                    <TableHead sx={{ bgcolor: "background.default" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "medium",
                            color: "text.secondary",
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                          }}
                        >
                          {t("sNo")}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "medium",
                            color: "text.secondary",
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                          }}
                        >
                          {t("key")}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "medium",
                            color: "text.secondary",
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                          }}
                        >
                          {t("pu")}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "medium",
                            color: "text.secondary",
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                          }}
                        >
                          {t("eu")}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "medium",
                            color: "text.secondary",
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                          }}
                        >
                          {t("appliedOn")}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "medium",
                            color: "text.secondary",
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                          }}
                        >
                          {t("expiredOn")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {keyHistoryData.map((row) => (
                        <TableRow
                          key={row?.serialNumber}
                          hover
                          sx={{ "&:hover": { bgcolor: "action.hover" } }}
                        >
                          <TableCell>{row?.serialNumber}</TableCell>
                          <TableCell
                            sx={{
                              fontFamily: "monospace",
                              fontWeight: 500,
                            }}
                          >
                            {row?.key}
                          </TableCell>
                          <TableCell>{row?.pu}</TableCell>
                          <TableCell>{row?.eu}</TableCell>
                          <TableCell>{row?.appliedOn}</TableCell>
                          <TableCell>{row?.expiredOn}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Divider />

              {/* License key input section */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="text.primary"
                  sx={{ mb: 2 }}
                >
                  {t("activate New License")}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      mb={1}
                      color="text.secondary"
                    >
                      {t("enterLicenseKey")}
                    </Typography>
                    <TextField
                      fullWidth
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      variant="outlined"
                      error={!!errors.licenseKey}
                      helperText={
                        errors.licenseKey && (
                          <Box>
                            <Typography color="error">
                              {errors.licenseKey}
                              {errors.licenseKey.includes("SQL injection") && (
                                <Box
                                  component="pre"
                                  sx={{
                                    mt: 1,
                                    fontSize: "12px",
                                    color: "#d32f2f",
                                    bgcolor: "#fff3f3",
                                    p: 1,
                                    borderRadius: 1,
                                  }}
                                >
                                  [SQL_INJECTION] Error: {errors.licenseKey}
                                </Box>
                              )}
                            </Typography>
                          </Box>
                        )
                      }
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      mb={1}
                      color="text.secondary"
                    >
                      {t("uniqueCode")}
                    </Typography>
                    <TextField
                      fullWidth
                      value={organizationToken}
                      onChange={(e) => setOrganizationToken(e.target.value)}
                      placeholder="Enter unique code"
                      variant="outlined"
                      error={!!errors.organizationToken}
                      helperText={
                        errors.organizationToken && (
                          <Box>
                            <Typography color="error">
                              {errors.organizationToken}
                              {errors.organizationToken.includes(
                                "SQL injection"
                              ) && (
                                <Box
                                  component="pre"
                                  sx={{
                                    mt: 1,
                                    fontSize: "12px",
                                    color: "#d32f2f",
                                    bgcolor: "#fff3f3",
                                    p: 1,
                                    borderRadius: 1,
                                  }}
                                >
                                  [SQL_INJECTION] Error:{" "}
                                  {errors.organizationToken}
                                </Box>
                              )}
                            </Typography>
                          </Box>
                        )
                      }
                    />
                  </Box>
                  <Box display="flex" justifyContent="flex-end" gap={1.5}>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        textTransform: "none",
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleApply}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        textTransform: "none",
                      }}
                    >
                      {t("apply")}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleBackHome}
                      startIcon={<HomeIcon />}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        textTransform: "none",
                      }}
                    >
                      {t("backHome")}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>
        </Container>
      )}
    </Box>
  );
};

export default LicenseKeyManagement;
