import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  FormControl,
  Button,
  Chip,
  Divider,
  Alert,
  IconButton,
  // useTheme,
  useMediaQuery,
  Stack,
  Card,
  Grid,
  Autocomplete,
  TextField,
  CircularProgress,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import OwnerChangeConfirmationDialog from "./OwnerChangeConfirmationDialog";
import { listProcessOwner } from "../../services/documentModules/DocumentsModule";
import { getElementDetails } from "../../services/common/common.service";
import SignatoriesChange from "../allpages/accountopening/signatoriesChange/SignatoriesChange";
import AuditorChange from "../allpages/accountopening/signatoriesChange/AuditorChanage";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";
import CoCreationChange from "../allpages/accountopening/signatoriesChange/CoCreationChange";

const MainCard = styled(Card)(({ theme }) => ({
  width: "100%",
  borderRadius: theme.spacing(1),
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: "#fff",
  padding: "20px",
  borderBottom: `1px solid ${theme.palette.divider}`,

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 2),
  },
}));

const GradientTitle = styled(Typography)(() => ({
  fontSize: "1rem",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "8px",

  marginBottom: "1rem",
}));

const SwapButton = styled(IconButton)(({ theme, disabled }) => ({
  width: 56,
  height: 56,
  borderRadius: "50%",
  backgroundColor: disabled ? theme.palette.grey[400] : "#2575fc",
  color: theme.palette.common.white,
  transform: !disabled ? "scale(1.2)" : "scale(1)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: disabled ? theme.palette.grey[400] : "#1a68e0",
  },
  [theme.breakpoints.down("sm")]: {
    width: 40,
    height: 40,
    margin: theme.spacing(1, 0),
  },
}));

const OwnerCard = styled(Paper)(({ theme, variant }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1.5),
  border: "2px solid transparent",
  background:
    variant === "current"
      ? "linear-gradient(135deg, #f9f9f9 0%, #eef2f5 100%)"
      : "linear-gradient(135deg, #f9f9f9 0%, #eef2f5 100%)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const ResetButton = styled(Button)(({ theme }) => ({
  backgroundColor: "transparent",
  border: "2px solid rgb(0, 0, 0)",
  color: "#000",
  borderRadius: theme.spacing(1.5),
  fontWeight: 500,
  fontSize: "0.875rem",
  "&:hover": {
    backgroundColor: "rgba(206, 198, 209, 0.1)",
    border: "2px solid rgb(232, 231, 233)",
  },
}));

const OwnerChange = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentOwner, setCurrentOwner] = useState(null);
  const [newOwner, setNewOwner] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processOwners, setProcessOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOwnerElements, setCurrentOwnerElements] = useState([]);
  const [newOwnerElements, setNewOwnerElements] = useState([]);
  const [currentElementsLoading, setCurrentElementsLoading] = useState(false);
  const [newElementsLoading, setNewElementsLoading] = useState(false);
  const [elementError, setElementError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [currentElementsSearch, setCurrentElementsSearch] = useState("");
  const [newElementsSearch, setNewElementsSearch] = useState("");
  const [selectedCurrentElements, setSelectedCurrentElements] = useState([]);
  const [selectedNewElements, setSelectedNewElements] = useState([]);
  const [currentAllSelected, setCurrentAllSelected] = useState(false);
  const [newAllSelected, setNewAllSelected] = useState(false);
  const [changeType, setChangeType] = useState("owner"); // "owner" or "signatory"

  const { t } = useTranslation();
  const [currentModuleTypeFilter, setCurrentModuleTypeFilter] = useState("All"); // New state for module type filter
  const moduleTypeOptions = [
    "All",
    "Document",
    "SOP",
    "TrainingSimulation",
    "Form",
    "TestMCQ",
    "TestSimulation",
  ]; // Options for module type filter

  const filteredCurrentElements = currentOwnerElements
    .filter((element) =>
      element.ModuleName.toLowerCase().includes(
        currentElementsSearch.toLowerCase()
      )
    )
    .filter((element) =>
      currentModuleTypeFilter === "All" || currentModuleTypeFilter.length === 0
        ? true
        : currentModuleTypeFilter.includes(element.ModuleType)
    );

  const bgColor = theme.palette.primary.main; // Use theme color directly
  const filteredNewElements = newOwnerElements.filter((element) =>
    element.ModuleName.toLowerCase().includes(newElementsSearch.toLowerCase())
  );
  const handleCurrentElementSelect = (elementId) => {
    setSelectedCurrentElements((prev) => {
      const elementData = currentOwnerElements.find(
        (element) => element.ModuleID === elementId
      );

      if (prev.includes(elementId)) {
        const updated = prev.filter((id) => id !== elementId);
        console.log(
          "Current owner deselected element:",
          elementId,
          "Updated selection:",
          updated
        );
        return updated;
      } else {
        const updated = [...prev, elementId];
        console.log(
          "Current owner selected element:",
          elementId,
          "Updated selection:",
          updated
        );

        if (elementData) {
          console.log("Selected element full data:", elementData);
        }
        return updated;
      }
    });
  };
  const handleSelectAllCurrent = () => {
    if (currentAllSelected) {
      setSelectedCurrentElements([]);
      console.log("Deselected all current owner elements");
    } else {
      const allIds = filteredCurrentElements.map((element) => element.ModuleID);
      setSelectedCurrentElements(allIds);
      console.log("Selected all current owner elements IDs:", allIds);

      console.log(
        "Selected all current owner elements full data:",
        filteredCurrentElements
      );
    }
    setCurrentAllSelected(!currentAllSelected);
  };

  useEffect(() => {
    setSelectedCurrentElements([]);
    setCurrentAllSelected(false);
  }, [currentOwnerElements, currentElementsSearch]);

  useEffect(() => {
    setSelectedNewElements([]);
    setNewAllSelected(false);
  }, [newOwnerElements, newElementsSearch]);

  const logSelectedOwnerID = (ownerType, userId) => {
    console.log(`Selected ${ownerType} Owner UserID:`, userId);

    setElementError(null);
    setShowToast(false);

    if (userId) {
      const selectedOwner = processOwners.find((owner) => owner.id === userId);
      if (selectedOwner) {
        console.log(`${ownerType} Owner Details:`, {
          id: selectedOwner.id,
          name: selectedOwner.name,
          email: selectedOwner.email,
        });

        const payload = { UserID: userId };
        console.log(
          `Sending API request for ${ownerType} Owner with payload:`,
          payload
        );

        if (ownerType.includes("Current")) {
          setCurrentElementsLoading(true);
        } else if (ownerType.includes("New")) {
          setNewElementsLoading(true);
        }

        getElementDetails(payload)
          .then((response) => {
            console.log(
              `API Response for ${ownerType} Owner getElementDetails:`,
              response.data
            );
            if (ownerType.includes("Current")) {
              setCurrentOwnerElements(response.data?.data || []);
              setCurrentElementsLoading(false);
            } else if (ownerType.includes("New")) {
              setNewOwnerElements(response.data?.data || []);
              setNewElementsLoading(false);
            }
          })
          .catch((error) => {
            console.error(
              `Error fetching ${ownerType} Owner element details:`,
              error
            );
            if (ownerType.includes("Current")) {
              setCurrentOwnerElements([]);
              setCurrentElementsLoading(false);
            } else if (ownerType.includes("New")) {
              setNewOwnerElements([]);
              setNewElementsLoading(false);
            }

            setElementError(
              `Error loading ${ownerType.toLowerCase()} elements: ${error.message || "Unknown error"
              }`
            );
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 5000);
          });
      }
    } else {
      if (ownerType.includes("Current")) {
        setCurrentOwnerElements([]);
      } else if (ownerType.includes("New")) {
        setNewOwnerElements([]);
      }
    }
    return userId;
  };

  useEffect(() => {
    console.log("Fetching process owners...");
    setIsLoading(true);
    listProcessOwner({})
      .then((response) => {
        console.log(
          "Process owners API response:",
          response?.data?.data?.userList
        );
        const transformedOwners = (response?.data?.data?.userList || []).map(
          (user) => {
            const firstName = user.UserDetail?.UserFirstName || "";
            const middleName = user.UserDetail?.UserMiddleName || "";
            const lastName = user.UserDetail?.UserLastName || "";
            const fullName = [firstName, middleName, lastName]
              .filter(Boolean)
              .join(" ");
            const avatar = (firstName[0] || fullName[0] || "U").toUpperCase();
            return {
              id: user.UserID,
              name: fullName,
              email: user.UserName,
              avatar: avatar,
              color: `#${user.UserID.substr(0, 6)
                .split("-")
                .join("")
                .padEnd(6, "0")}`,
            };
          }
        );

        console.log(
          "Transformed owners with UserIDs:",
          transformedOwners.map((owner) => ({ name: owner.name, id: owner.id }))
        );
        setProcessOwners(transformedOwners);
      })
      .catch((error) => {
        console.error("Error fetching process owners:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleOwnerChange = () => {
    if (currentOwner && newOwner && currentOwner.id !== newOwner.id) {
      console.log("Current (Change Initiated) Owner Details:", {
        id: currentOwner.id,
        name: currentOwner.name,
        email: currentOwner.email,
      });

      console.log("New (Change Initiated) Owner Details:", {
        id: newOwner.id,
        name: newOwner.name,
        email: newOwner.email,
      });

      setConfirmDialog(true);
    }
  };

  const handleConfirmChange = () => {
    console.log("Current (Change Confirmed) Owner Details:", {
      id: currentOwner?.id,
      name: currentOwner?.name,
      email: currentOwner?.email,
    });

    console.log("New (Change Confirmed) Owner Details:", {
      id: newOwner?.id,
      name: newOwner?.name,
      email: newOwner?.email,
    });

    if (selectedCurrentElements.length > 0) {
      const selectedElementsData = filteredCurrentElements.filter((element) =>
        selectedCurrentElements.includes(element.ModuleID)
      );
      console.log("Elements being transferred:", selectedElementsData);
    }

    setConfirmDialog(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentOwner(null);
      setNewOwner(null);
    }, 3000);
  };

  const isChangeValid =
    currentOwner && newOwner && currentOwner.id !== newOwner.id;

  const OwnerChangeButton = styled(Button)(({ theme, disabled }) => ({
    background: !disabled
      ? bgColor || "linear-gradient(to top, #2C64FF, #4A90E2)"
      : "linear-gradient(45deg,rgb(220, 224, 230),rgb(208, 210, 214))",
    color: theme.palette.common.white,
    borderRadius: theme.spacing(1.5),
    fontWeight: 500,
    fontSize: "0.875rem",
    "&:hover": {
      background: !disabled
        ? bgColor || "linear-gradient(to top, #1a68e0, #3f7edc)"
        : "linear-gradient(45deg, #64748b, #475569)",
    },
  }));

  return (
    <>
      {showToast && elementError && (
        <Alert
          severity="error"
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 9999,
            maxWidth: "400px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          }}
          onClose={() => setShowToast(false)}
        >
          {elementError}
        </Alert>
      )}

      <HeaderSection>
        <GradientTitle>
          <ManageAccountsIcon fontSize="small" />
          {t("changeManagement")}
        </GradientTitle>
        <Typography variant="body2" sx={{ color: "gray", fontSize: "0.8rem" }}>
          {t("changeManagementDescription")}
        </Typography>
      </HeaderSection>

      {/* Dropdown to select change type */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 3, ml: 5 }}>
        <FormControl size="small">
          <TextField
            select
            label="Change Types"
            value={changeType}
            onChange={(e) => setChangeType(e.target.value)}
            SelectProps={{ native: true }}
            InputProps={{
              sx: {
                fontSize: "0.75rem", // font for selected value
              },
            }}
            InputLabelProps={{
              sx: {
                fontSize: "0.75rem", // font for label
              },
            }}
            sx={{ minWidth: 200 }}
          >
            <option value="owner" style={{ fontSize: "0.75rem" }}>
              Owner Change
            </option>
            <option value="signatory" style={{ fontSize: "0.75rem" }}>
              Signatories Change
            </option>
            <option value="auditor" style={{ fontSize: "0.75rem" }}>
              Auditor Change
            </option>

            <option value="co-owner" style={{ fontSize: "0.75rem" }}>
              Co-owner Change
            </option>
          </TextField>
        </FormControl>
      </Box>

      {changeType === "owner" ? (
        <Card sx={{ margin: "20px 40px" }}>
          <MainCard>
            <Box sx={{ p: 4, pt: 3 }}>
              {showSuccess && (
                <Alert
                  icon={<CheckIcon />}
                  severity="success"
                  sx={{ mb: 3, fontSize: "0.8rem" }}
                  onClose={() => setShowSuccess(false)}
                >
                  {t("ownerChangedSuccess")}
                </Alert>
              )}

              <Grid
                container
                spacing={isMobile ? 2 : 4}
                alignItems="stretch"
                sx={{ mb: 3 }}
              >
                <Grid item xs={12} md={5}>
                  <OwnerCard variant="current">
                    <Typography
                      variant="p"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: bgColor || "#2575fc",
                        mb: 2,
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      <PersonIcon fontSize="small" /> {t("currentOwner")}
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 0 }}>
                      <Autocomplete
                        options={processOwners}
                        getOptionLabel={(option) =>
                          `${option.name} - ${option.email}`
                        }
                        value={currentOwner}
                        onChange={(event, newValue) => {
                          setCurrentOwner(newValue);
                          logSelectedOwnerID("Current", newValue?.id);
                        }}
                        loading={isLoading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t("select")}
                            size="small"
                            InputProps={{
                              ...params.InputProps,
                              style: { fontSize: "0.8rem" },
                              endAdornment: (
                                <>
                                  {isLoading ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mr: 1,
                                      }}
                                    >
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    </Box>
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} style={{ fontSize: "0.8rem" }}>
                            {option.name} - {option.email}
                          </li>
                        )}
                        noOptionsText="No owners found"
                        sx={{
                          "& .MuiAutocomplete-popupIndicator": {
                            transform: "none",
                          },
                        }}
                      />
                    </FormControl>

                    {/* {currentOwner && (
                  <Box sx={{ mt: 'auto' }}>
                    <Chip
                      avatar={
                        <Avatar sx={{ bgcolor: currentOwner.color, width: 24, height: 24 }}>
                          {currentOwner.avatar}
                        </Avatar>
                      }
                      label={currentOwner.name}
                      sx={{ 
                        bgcolor: '#2575fc',  
                        color: 'white', 
                        fontWeight: 500,
                        borderRadius: '16px',
                        px: 1,
                        fontSize: '0.8rem'
                      }}
                    />
                  </Box>
                )} */}

                    {/* Current Owner's Elements */}
                    {currentOwner && (
                      <Box sx={{ mt: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {currentOwnerElements.length > 0 && (
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Checkbox
                                  size="small"
                                  checked={currentAllSelected}
                                  onChange={handleSelectAllCurrent}
                                  sx={{
                                    p: 0.5,
                                    marginRight: 0,
                                    marginBottom: "5px",
                                  }}
                                />
                              </Box>
                            )}
                            <Typography
                              variant="subtitle1"
                              sx={{ fontSize: "0.8rem", fontWeight: 600 }}
                            >
                              Associated Elements{" "}
                              {currentOwnerElements.length > 0 &&
                                `(${currentOwnerElements.length})`}
                            </Typography>
                          </Box>
                          {currentOwnerElements.length > 0 && (
                            <FormControl
                              size="small"
                              sx={{ minWidth: 120, ml: 1 }}
                            >
                              <InputLabel sx={{ fontSize: "0.75rem" }}>
                                Module Type
                              </InputLabel>
                              <Select
                                multiple
                                size="small"
                                label="Module Type"
                                value={
                                  currentModuleTypeFilter === "All"
                                    ? []
                                    : currentModuleTypeFilter
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // If nothing is selected, treat it as "All"
                                  if (value.length === 0) {
                                    setCurrentModuleTypeFilter("All");
                                  } else {
                                    setCurrentModuleTypeFilter(value);
                                  }
                                }}
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {selected.length === 0 ? (
                                      <Chip
                                        label="All Types"
                                        size="small"
                                        sx={{ fontSize: "0.65rem" }}
                                      />
                                    ) : (
                                      selected.map((value) => (
                                        <Chip
                                          key={value}
                                          label={value}
                                          size="small"
                                          sx={{ fontSize: "0.65rem" }}
                                        />
                                      ))
                                    )}
                                  </Box>
                                )}
                                inputProps={{
                                  sx: {
                                    fontSize: "0.75rem", // Input text font
                                  },
                                }}
                                sx={{
                                  fontSize: "0.75rem", // Menu items font
                                }}
                              >
                                {moduleTypeOptions
                                  .filter((type) => type !== "All")
                                  .map((type) => (
                                    <MenuItem
                                      key={type}
                                      value={type}
                                      sx={{ fontSize: "0.75rem" }}
                                    >
                                      <Checkbox
                                        size="small"
                                        checked={
                                          currentModuleTypeFilter === "All" ||
                                          currentModuleTypeFilter.includes(type)
                                        }
                                        sx={{ p: 0.5, mr: 1 }}
                                      />
                                      {type}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          )}
                        </Box>

                        {/* Search box */}
                        {currentOwnerElements.length > 0 && (
                          <TextField
                            placeholder="Search elements..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={currentElementsSearch}
                            onChange={(e) =>
                              setCurrentElementsSearch(e.target.value)
                            }
                            InputProps={{
                              startAdornment: (
                                <Box
                                  component="span"
                                  sx={{ color: "text.secondary", mr: 1 }}
                                >
                                  <i
                                    className="fas fa-search"
                                    style={{ fontSize: "0.8rem" }}
                                  />
                                </Box>
                              ),
                              style: { fontSize: "0.8rem" },
                            }}
                            sx={{ mb: 1 }}
                          />
                        )}

                        <Box
                          sx={{
                            maxHeight: "200px",
                            overflowY: "auto",
                            border: "1px solid #eee",
                            borderRadius: 1,
                            p: 1,
                            minHeight: "100px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent:
                              currentElementsLoading ||
                                currentOwnerElements.length === 0
                                ? "center"
                                : "flex-start",
                            alignItems:
                              currentElementsLoading ||
                                currentOwnerElements.length === 0
                                ? "center"
                                : "stretch",
                          }}
                        >
                          {currentElementsLoading ? (
                            <Box sx={{ textAlign: "center" }}>
                              <CircularProgress
                                size={30}
                                sx={{ color: "#2575fc", mb: 1 }}
                              />
                              <Typography
                                variant="caption"
                                display="block"
                                sx={{ color: "text.secondary" }}
                              >
                                {t("loadingElements")}
                              </Typography>
                            </Box>
                          ) : currentOwnerElements.length === 0 ? (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                textAlign: "center",
                              }}
                            >
                              {t("noElementsForOwner")}
                            </Typography>
                          ) : filteredCurrentElements.length === 0 ? (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                textAlign: "center",
                              }}
                            >
                              {t("noMatchingElements")}
                            </Typography>
                          ) : (
                            <>
                              {filteredCurrentElements.map((element) => (
                                <Box
                                  key={element.ModuleID}
                                  sx={{
                                    mb: 1,
                                    p: 1,
                                    bgcolor: "#f9fafb",
                                    borderRadius: 1,
                                    "&:last-child": { mb: 0 },
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Checkbox
                                    size="small"
                                    checked={selectedCurrentElements.includes(
                                      element.ModuleID
                                    )}
                                    onChange={() =>
                                      handleCurrentElementSelect(
                                        element.ModuleID
                                      )
                                    }
                                    sx={{ p: 0.5, mr: 1 }}
                                  />
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 0.5,
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        {element.ModuleName}
                                      </Typography>
                                      <Chip
                                        label={element.ModuleType}
                                        size="small"
                                        sx={{
                                          height: 20,
                                          fontSize: "0.65rem",
                                          bgcolor:
                                            element.ModuleType === "Document"
                                              ? "#e3f2fd"
                                              : "#e8f5e9",
                                          color:
                                            element.ModuleType === "Document"
                                              ? "#1e88e5"
                                              : "#4caf50",
                                        }}
                                      />
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 2,
                                        fontSize: "0.7rem",
                                        color: "text.secondary",
                                      }}
                                    >
                                      {element.MasterVersion && (
                                        <Typography variant="caption">
                                          Master: v{element.MasterVersion}
                                        </Typography>
                                      )}
                                      {element.DraftVersion && (
                                        <Typography variant="caption">
                                          InProgress: v{element.DraftVersion}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                </Box>
                              ))}
                            </>
                          )}
                        </Box>
                      </Box>
                    )}
                  </OwnerCard>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SwapButton
                    color="primary"
                    disabled={!isChangeValid}
                    onClick={handleOwnerChange}
                  >
                    <SwapHorizIcon fontSize="small" />
                  </SwapButton>
                </Grid>

                <Grid item xs={12} md={5}>
                  <OwnerCard variant="new">
                    <Typography
                      variant="p"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: bgColor || "#2575fc",
                        mb: 2,
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      <GroupIcon fontSize="small" /> {t("newOwner")}
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 0 }}>
                      <Autocomplete
                        options={processOwners.filter(
                          (owner) =>
                            !currentOwner || owner.id !== currentOwner.id
                        )}
                        getOptionLabel={(option) =>
                          `${option.name} - ${option.email}`
                        }
                        value={newOwner}
                        onChange={(event, newValue) => {
                          setNewOwner(newValue);
                          logSelectedOwnerID("New", newValue?.id);
                        }}
                        disabled={!currentOwner}
                        loading={isLoading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t("select")}
                            size="small"
                            InputProps={{
                              ...params.InputProps,
                              style: { fontSize: "0.8rem" },
                              endAdornment: (
                                <>
                                  {isLoading ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mr: 1,
                                      }}
                                    >
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    </Box>
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} style={{ fontSize: "0.8rem" }}>
                            {option.name} - {option.email}
                          </li>
                        )}
                        noOptionsText="No owners found"
                        sx={{
                          "& .MuiAutocomplete-popupIndicator": {
                            transform: "none",
                          },
                        }}
                      />
                    </FormControl>

                    {/* {newOwner && (
                  <Box sx={{ mt: 'auto' }}>
                    <Chip
                      avatar={
                        <Avatar sx={{ bgcolor: newOwner.color, width: 24, height: 24 }}>
                          {newOwner.avatar}
                        </Avatar>
                      }
                      label={newOwner.name}
                      sx={{ 
                        bgcolor: '#2575fc', 
                        color: 'white', 
                        fontWeight: 500,
                        borderRadius: '16px',
                        px: 1,
                        fontSize: '0.8rem'
                      }}
                    />
                  </Box>
                )} */}

                    {/* New Owner's Elements */}
                    {newOwner && (
                      <Box sx={{ mt: 3 }}>
                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontSize: "0.8rem", fontWeight: 600 }}
                          >
                            {t("associatedElements")}{" "}
                            {newOwnerElements.length > 0 &&
                              `(${newOwnerElements.length})`}
                          </Typography>
                        </Box>

                        {/* Search box */}
                        {newOwnerElements.length > 0 && (
                          <TextField
                            placeholder="Search elements..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={newElementsSearch}
                            onChange={(e) =>
                              setNewElementsSearch(e.target.value)
                            }
                            InputProps={{
                              startAdornment: (
                                <Box
                                  component="span"
                                  sx={{ color: "text.secondary", mr: 1 }}
                                >
                                  <i
                                    className="fas fa-search"
                                    style={{ fontSize: "0.8rem" }}
                                  />
                                </Box>
                              ),
                              style: { fontSize: "0.8rem" },
                            }}
                            sx={{ mb: 1 }}
                          />
                        )}

                        <Box
                          sx={{
                            maxHeight: "200px",
                            overflowY: "auto",
                            border: "1px solid #eee",
                            borderRadius: 1,
                            p: 1,
                            minHeight: "100px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent:
                              newElementsLoading ||
                                newOwnerElements.length === 0
                                ? "center"
                                : "flex-start",
                            alignItems:
                              newElementsLoading ||
                                newOwnerElements.length === 0
                                ? "center"
                                : "stretch",
                          }}
                        >
                          {newElementsLoading ? (
                            <Box sx={{ textAlign: "center" }}>
                              <CircularProgress
                                size={30}
                                sx={{ color: "#2575fc", mb: 1 }}
                              />
                              <Typography
                                variant="caption"
                                display="block"
                                sx={{ color: "text.secondary" }}
                              >
                                Loading elements...
                              </Typography>
                            </Box>
                          ) : newOwnerElements.length === 0 ? (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                textAlign: "center",
                              }}
                            >
                              No elements found for this owner
                            </Typography>
                          ) : filteredNewElements.length === 0 ? (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                textAlign: "center",
                              }}
                            >
                              No matching elements found
                            </Typography>
                          ) : (
                            <>
                              {filteredNewElements.map((element) => (
                                <Box
                                  key={element.ModuleID}
                                  sx={{
                                    mb: 1,
                                    p: 1,
                                    bgcolor: "#f9fafb",
                                    borderRadius: 1,
                                    "&:last-child": { mb: 0 },
                                  }}
                                >
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 0.5,
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        {element.ModuleName}
                                      </Typography>
                                      <Chip
                                        label={element.ModuleType}
                                        size="small"
                                        sx={{
                                          height: 20,
                                          fontSize: "0.65rem",
                                          bgcolor:
                                            element.ModuleType === "Document"
                                              ? "#e3f2fd"
                                              : "#e8f5e9",
                                          color:
                                            element.ModuleType === "Document"
                                              ? "#1e88e5"
                                              : "#4caf50",
                                        }}
                                      />
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 2,
                                        fontSize: "0.7rem",
                                        color: "text.secondary",
                                      }}
                                    >
                                      {element.MasterVersion && (
                                        <Typography variant="caption">
                                          Master: v{element.MasterVersion}
                                        </Typography>
                                      )}
                                      {element.DraftVersion && (
                                        <Typography variant="caption">
                                          InProgress: v{element.DraftVersion}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                </Box>
                              ))}
                            </>
                          )}
                        </Box>
                      </Box>
                    )}
                  </OwnerCard>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                justifyContent="end"
                sx={{ mb: 2 }}
              >
                <OwnerChangeButton
                  startIcon={<SwapHorizIcon fontSize="small" />}
                  onClick={handleOwnerChange}
                  disabled={!isChangeValid}
                  variant="contained"
                  disableElevation
                >
                  {t("changeOwner")}
                </OwnerChangeButton>

                <ResetButton
                  startIcon={<CloseIcon fontSize="small" />}
                  onClick={() => {
                    setCurrentOwner(null);
                    setNewOwner(null);
                  }}
                >
                  {t("reset")}
                </ResetButton>
              </Stack>
            </Box>
          </MainCard>

          <OwnerChangeConfirmationDialog
            open={confirmDialog}
            onClose={() => setConfirmDialog(false)}
            onConfirm={handleConfirmChange}
            currentOwnerData={currentOwner}
            newOwnerData={newOwner}
            selectedElements={
              selectedCurrentElements.length > 0
                ? filteredCurrentElements.filter((element) =>
                  selectedCurrentElements.includes(element.ModuleID)
                )
                : []
            }
          />
        </Card>
      ) : changeType === "signatory" ? (
        <SignatoriesChange />
      ) : changeType === "auditor" ? (
        <AuditorChange />
      ) : changeType === "co-owner" ? (
        <CoCreationChange />
      ) : null}
    </>
  );
};

export default OwnerChange;
