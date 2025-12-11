import React, { useState, useEffect } from "react";
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
  useTheme,
  useMediaQuery,
  Card,
  Grid,
  Autocomplete,
  TextField,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import { SwapHoriz } from "@mui/icons-material";
import CoCreationChangeModal from "./CoCreationChangeModal";
import { useTranslation } from "react-i18next";
import {
  CoCreatorListApi,
  GetCoCreationUserListApi,
  SaveCoCreationApi,
} from "../../../../services/ownerchange/ownerchange";

const MainCard = styled(Card)(({ theme }) => ({
  width: "100%",
  borderRadius: theme.spacing(1),
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
}));

// Styled components for the CoCreationChange component

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

const CoCreatorCard = styled(Paper)(({ theme, variant }) => ({
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

const CoCreatorChangeButton = styled(Button)(({ theme, disabled }) => ({
  background: !disabled
    ? "linear-gradient(to top, #2C64FF, #4A90E2)"
    : "linear-gradient(45deg,rgb(220, 224, 230),rgb(208, 210, 214))",
  color: theme.palette.common.white,
  borderRadius: theme.spacing(1.5),
  fontWeight: 500,
  fontSize: "0.875rem",
  "&:hover": {
    background: !disabled
      ? "linear-gradient(to top, #1a68e0, #3f7edc)"
      : "linear-gradient(45deg, #64748b, #475569)",
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

const CoCreationChange = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentCoCreator, setCurrentCoCreator] = useState(null);
  const [newCoCreator, setNewCoCreator] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [coCreators, setCoCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentCoCreatorDocuments, setCurrentCoCreatorDocuments] = useState(
    []
  );
  const [newCoCreatorDocuments, setNewCoCreatorDocuments] = useState([]);
  const [currentDocumentsLoading, setCurrentDocumentsLoading] = useState(false);
  const [newDocumentsLoading, setNewDocumentsLoading] = useState(false);
  const [currentDocumentsSearch, setCurrentDocumentsSearch] = useState("");
  const [newDocumentsSearch, setNewDocumentsSearch] = useState("");
  const [selectedCurrentDocuments, setSelectedCurrentDocuments] = useState([]);
  const [currentAllSelected, setCurrentAllSelected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation(); // Assuming you have a translation function

  // Add back the validity flag used by <SwapButton />
  const isChangeValid = !!(
    currentCoCreator?.UserID &&
    newCoCreator?.UserID &&
    currentCoCreator.UserID !== newCoCreator.UserID
  );

  // UPDATED filters: use ElementName
  const filteredCurrentDocuments = currentCoCreatorDocuments.filter(
    (doc) =>
      doc.ElementName?.toLowerCase().includes(
        currentDocumentsSearch.toLowerCase()
      ) ||
      doc.ModuleName?.toLowerCase().includes(
        currentDocumentsSearch.toLowerCase()
      )
  );
  const filteredNewDocuments = newCoCreatorDocuments.filter(
    (doc) =>
      doc.ElementName?.toLowerCase().includes(
        newDocumentsSearch.toLowerCase()
      ) ||
      doc.ModuleName?.toLowerCase().includes(newDocumentsSearch.toLowerCase())
  );

  const handleCurrentDocumentSelect = (documentId) => {
    setSelectedCurrentDocuments((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAllCurrent = () => {
    if (currentAllSelected) {
      setSelectedCurrentDocuments([]);
    } else {
      const allIds = filteredCurrentDocuments.map((doc) => doc.ElementID);
      setSelectedCurrentDocuments(allIds);
    }
    setCurrentAllSelected(!currentAllSelected);
  };

  useEffect(() => {
    setSelectedCurrentDocuments([]);
    setCurrentAllSelected(false);
  }, [currentCoCreatorDocuments, currentDocumentsSearch]);

  const handleCoCreatorChange = () => {
    setModalOpen(true);
  };

  const handleConfirmChange = async (payload) => {
    console.log("Confirm Change Payload:", payload);
    setLoading(true);
    setError(null);

    try {
      // Prepare API payload
      const apiPayload = {
        ElementID: payload.selectedDocuments.map((doc) => doc.id),
        OldOwnerID: payload.currentUserID,
        NewOwnerID: payload.newUserID,
        ChangeReason: null,
      };

      console.log("API Payload for SaveCoCreation:", apiPayload);

      // Call the save API
      const response = await SaveCoCreationApi(apiPayload);
      console.log("Save Co-Creation API Response:", response);

      // Only close the modal after API success
      setModalOpen(false);

      // Show success message
      setShowSuccess(true);

      // Reset form state
      setCurrentCoCreator(null);
      setNewCoCreator(null);
      setCurrentCoCreatorDocuments([]);
      setNewCoCreatorDocuments([]);
      setSelectedCurrentDocuments([]);

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.message || "Failed to save co-creation changes");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCoCreatorSelect = (type, value) => {
    if (type === "current") {
      setCurrentCoCreator(value);
      setCurrentCoCreatorDocuments([]);
      setSelectedCurrentDocuments([]);
      if (value?.UserID) fetchCoCreatorElements(value.UserID, "current");
    } else {
      setNewCoCreator(value);
      setNewCoCreatorDocuments([]);
      if (value?.UserID) fetchCoCreatorElements(value.UserID, "new");
    }
  };

  // Fetch co-creator elements function
  const fetchCoCreatorElements = async (userID, type) => {
    try {
      const payload = { UserID: userID };
      console.log(
        `${type === "current" ? "Current" : "New"} Co-Creator API Payload:`,
        payload
      );

      if (type === "current") {
        setCurrentDocumentsLoading(true);
        setError(null);
        const response = await GetCoCreationUserListApi(payload);
        console.log("Current Co-Creator API Response:", response?.data);

        // Store the complete data from the API in the state
        if (Array.isArray(response?.data?.data)) {
          setCurrentCoCreatorDocuments(response.data.data);
        } else {
          setCurrentCoCreatorDocuments([]);
        }
      } else {
        setNewDocumentsLoading(true);
        setError(null);
        const response = await GetCoCreationUserListApi(payload);
        console.log("New Co-Creator API Response:", response?.data);

        // Store the complete data from the API in the state
        if (Array.isArray(response?.data?.data)) {
          setNewCoCreatorDocuments(response.data.data);
        } else {
          setNewCoCreatorDocuments([]);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to fetch documents");
      console.error("API Error:", err);
    } finally {
      if (type === "current") {
        setCurrentDocumentsLoading(false);
      } else {
        setNewDocumentsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (currentCoCreator?.UserID) {
      console.log("Current Co-Creator ID:", currentCoCreator.UserID);
    }

    if (newCoCreator?.UserID) {
      console.log("New Co-Creator ID:", newCoCreator.UserID);
    }

    if (
      currentCoCreator?.UserID &&
      newCoCreator?.UserID &&
      currentCoCreator.UserID === newCoCreator.UserID
    ) {
      console.warn("Both dropdowns have the same UserID.");
    }
  }, [currentCoCreator, newCoCreator]);

  useEffect(() => {
    const fetchCoCreators = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await CoCreatorListApi();
        setCoCreators(response.data?.data?.userList || []);
      } catch (err) {
        setError(err.message || "Failed to fetch co-creators");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoCreators();
  }, []);

  if (loading) return <div>Loading co-creators...</div>;
  if (error) return <div>Error: {error}</div>;

  // Helper to build modal props (keeps JSX clean)
  const currentCoCreatorData = currentCoCreator
    ? {
      id: currentCoCreator.UserID,
      userId: currentCoCreator.UserID, // Explicitly add UserID
      name:
        (currentCoCreator.UserDetail?.UserFirstName || "") +
        " " +
        (currentCoCreator.UserDetail?.UserLastName || ""),
      email:
        currentCoCreator.UserDetail?.UserEmail || currentCoCreator.UserEmail,
      avatar: currentCoCreator.UserName?.charAt(0),
      color: "#2C64FF",
    }
    : null;

  const newCoCreatorData = newCoCreator
    ? {
      id: newCoCreator.UserID,
      userId: newCoCreator.UserID, // Explicitly add UserID
      name:
        (newCoCreator.UserDetail?.UserFirstName || "") +
        " " +
        (newCoCreator.UserDetail?.UserLastName || ""),
      email: newCoCreator.UserDetail?.UserEmail || newCoCreator.UserEmail,
      avatar: newCoCreator.UserName?.charAt(0),
      color: "#4caf50",
    }
    : null;

  const selectedDocumentsForModal = currentCoCreatorDocuments
    .filter((d) => selectedCurrentDocuments.includes(d.ElementID || d.ModuleID))
    .map((d) => ({
      id: d.ElementID || d.ModuleID,
      name: d.ElementName || d.ModuleName,
      type: d.ModuleName || d.ModuleType,
      draftVersion: d.DraftVersion,
      masterVersion: d.MasterVersion,
    }));

  return (
    <>
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
                Co-Creator has been successfully changed!
              </Alert>
            )}

            <Grid
              container
              spacing={isMobile ? 2 : 4}
              alignItems="stretch"
              sx={{ mb: 3 }}
            >
              <Grid item xs={12} md={5}>
                <CoCreatorCard variant="current">
                  <Typography
                    variant="p"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#2575fc",
                      mb: 2,
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  >
                    <PersonIcon fontSize="small" /> {t("currentCoCreator")}
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 0 }}>
                    <Autocomplete
                      options={coCreators}
                      getOptionLabel={(option) =>
                        `${option.UserName} - ${option.UserDetail?.UserFirstName} ${option.UserDetail?.UserLastName}`
                      }
                      value={currentCoCreator}
                      onChange={(event, newValue) => {
                        handleCoCreatorSelect("current", newValue);
                      }}
                      loading={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select"
                          size="small"
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: "0.8rem" },
                            endAdornment: (
                              <>
                                {loading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} style={{ fontSize: "0.8rem" }}>
                          {option.UserName} - {option.UserDetail?.UserFirstName}{" "}
                          {option.UserDetail?.UserLastName}
                        </li>
                      )}
                      noOptionsText="No co-creators found"
                      sx={{
                        "& .MuiAutocomplete-popupIndicator": {
                          transform: "none",
                        },
                      }}
                    />
                  </FormControl>

                  {/* Current Co-Creator's Documents */}
                  {currentCoCreator && (
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {currentCoCreatorDocuments.length > 0 && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                            Associated Documents{" "}
                            {currentCoCreatorDocuments.length > 0 &&
                              `(${currentCoCreatorDocuments.length})`}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Search box */}
                      {currentCoCreatorDocuments.length > 0 && (
                        <TextField
                          placeholder="Search documents..."
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={currentDocumentsSearch}
                          onChange={(e) =>
                            setCurrentDocumentsSearch(e.target.value)
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
                            currentDocumentsLoading ||
                              currentCoCreatorDocuments.length === 0
                              ? "center"
                              : "flex-start",
                          alignItems:
                            currentDocumentsLoading ||
                              currentCoCreatorDocuments.length === 0
                              ? "center"
                              : "stretch",
                        }}
                      >
                        {currentDocumentsLoading ? (
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
                              Loading documents...
                            </Typography>
                          </Box>
                        ) : currentCoCreatorDocuments.length === 0 ? (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              textAlign: "center",
                            }}
                          >
                            No documents found for this co-creator
                          </Typography>
                        ) : filteredCurrentDocuments.length === 0 ? (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              textAlign: "center",
                            }}
                          >
                            No matching documents found
                          </Typography>
                        ) : (
                          <>
                            {filteredCurrentDocuments.map((document) => (
                              <Box
                                key={document.ElementID || document.ModuleID}
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
                                  checked={selectedCurrentDocuments.includes(
                                    document.ElementID || document.ModuleID
                                  )}
                                  onChange={() =>
                                    handleCurrentDocumentSelect(
                                      document.ElementID || document.ModuleID
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
                                      {document.ElementName ||
                                        document.ModuleName}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 1,
                                      mt: 0.5,
                                    }}
                                  >
                                    {document.DraftVersion && (
                                      <Chip
                                        label={`InProgress: ${document.DraftVersion}`}
                                        size="small"
                                        sx={{
                                          height: 18,
                                          fontSize: "0.65rem",
                                          bgcolor: "#fff8e1",
                                          color: "#ed6c02",
                                        }}
                                      />
                                    )}
                                    {document.MasterVersion && (
                                      <Chip
                                        label={`Master: ${document.MasterVersion}`}
                                        size="small"
                                        sx={{
                                          height: 18,
                                          fontSize: "0.65rem",
                                          bgcolor: "#e8f5e9",
                                          color: "#2e7d32",
                                        }}
                                      />
                                    )}
                                    {document.ModuleType && (
                                      <Chip
                                        label={document.ModuleType}
                                        size="small"
                                        sx={{
                                          height: 18,
                                          fontSize: "0.65rem",
                                          bgcolor: "#f3e5f5",
                                          color: "#7b1fa2",
                                        }}
                                      />
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
                </CoCreatorCard>
              </Grid>

              <Grid
                item
                xs={12}
                md={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "row" : "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  {isMobile ? (
                    <Divider
                      orientation="horizontal"
                      sx={{ width: "100%", position: "absolute" }}
                    />
                  ) : (
                    <Divider
                      orientation="vertical"
                      sx={{ height: "100%", position: "absolute" }}
                    />
                  )}
                  <SwapButton disabled={!isChangeValid}>
                    <SwapHorizIcon />
                  </SwapButton>
                </Box>
              </Grid>

              <Grid item xs={12} md={5}>
                <CoCreatorCard>
                  <Typography
                    variant="p"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#2575fc",
                      mb: 2,
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  >
                    <PersonIcon fontSize="small" /> {t("newCoCreator")}
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 0 }}>
                    <Autocomplete
                      options={coCreators}
                      getOptionLabel={(option) =>
                        `${option.UserName} - ${option.UserDetail?.UserFirstName} ${option.UserDetail?.UserLastName}`
                      }
                      value={newCoCreator}
                      onChange={(event, newValue) => {
                        handleCoCreatorSelect("new", newValue);
                      }}
                      loading={loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select"
                          size="small"
                          InputProps={{
                            ...params.InputProps,
                            style: { fontSize: "0.8rem" },
                            endAdornment: (
                              <>
                                {loading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} style={{ fontSize: "0.8rem" }}>
                          {option.UserName} - {option.UserDetail?.UserFirstName}{" "}
                          {option.UserDetail?.UserLastName}
                        </li>
                      )}
                      noOptionsText="No co-creators found"
                      sx={{
                        "& .MuiAutocomplete-popupIndicator": {
                          transform: "none",
                        },
                      }}
                    />
                  </FormControl>

                  {/* New Co-Creator's Documents (checkboxes removed) */}
                  {newCoCreator && (
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
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontSize: "0.8rem", fontWeight: 600 }}
                          >
                            Associated Documents{" "}
                            {newCoCreatorDocuments.length > 0 &&
                              `(${newCoCreatorDocuments.length})`}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Search box */}
                      {newCoCreatorDocuments.length > 0 && (
                        <TextField
                          placeholder="Search documents..."
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={newDocumentsSearch}
                          onChange={(e) =>
                            setNewDocumentsSearch(e.target.value)
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
                            newDocumentsLoading ||
                              newCoCreatorDocuments.length === 0
                              ? "center"
                              : "flex-start",
                          alignItems:
                            newDocumentsLoading ||
                              newCoCreatorDocuments.length === 0
                              ? "center"
                              : "stretch",
                        }}
                      >
                        {newDocumentsLoading ? (
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
                              Loading documents...
                            </Typography>
                          </Box>
                        ) : newCoCreatorDocuments.length === 0 ? (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              textAlign: "center",
                            }}
                          >
                            No documents found for this co-creator
                          </Typography>
                        ) : filteredNewDocuments.length === 0 ? (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              textAlign: "center",
                            }}
                          >
                            No matching documents found
                          </Typography>
                        ) : (
                          <>
                            {filteredNewDocuments.map((document) => (
                              <Box
                                key={document.ElementID || document.ModuleID}
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
                                {/* Checkbox removed for new side */}
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
                                      {document.ElementName ||
                                        document.ModuleName}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 1,
                                      mt: 0.5,
                                    }}
                                  >
                                    {document.DraftVersion && (
                                      <Chip
                                        label={`InProgress: ${document.DraftVersion}`}
                                        size="small"
                                        sx={{
                                          height: 18,
                                          fontSize: "0.65rem",
                                          bgcolor: "#fff8e1",
                                          color: "#ed6c02",
                                        }}
                                      />
                                    )}
                                    {document.MasterVersion && (
                                      <Chip
                                        label={`Master: ${document.MasterVersion}`}
                                        size="small"
                                        sx={{
                                          height: 18,
                                          fontSize: "0.65rem",
                                          bgcolor: "#e8f5e9",
                                          color: "#2e7d32",
                                        }}
                                      />
                                    )}
                                    {document.ModuleType && (
                                      <Chip
                                        label={document.ModuleType}
                                        size="small"
                                        sx={{
                                          height: 18,
                                          fontSize: "0.65rem",
                                          bgcolor: "#f3e5f5",
                                          color: "#7b1fa2",
                                        }}
                                      />
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
                </CoCreatorCard>
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                gap: 2,
                mt: 4,
              }}
            >
              <CoCreatorChangeButton
                onClick={handleCoCreatorChange}
                variant="contained"
                startIcon={<SwapHoriz />}
              >
                Change Co-Creator
              </CoCreatorChangeButton>
              <ResetButton
                startIcon={<CloseIcon fontSize="small" />}
                onClick={() => {
                  setCurrentCoCreator(null);
                  setNewCoCreator(null);
                  setCurrentCoCreatorDocuments([]);
                  setNewCoCreatorDocuments([]);
                }}
                variant="outlined"
              >
                Reset
              </ResetButton>
            </Box>
          </Box>
        </MainCard>
      </Card>
      <CoCreationChangeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={(payloadFromModal) => {
          handleConfirmChange(payloadFromModal);
          // Modal will be closed in handleConfirmChange after API success
        }}
        currentCoCreatorData={currentCoCreatorData}
        newCoCreatorData={newCoCreatorData}
        selectedDocuments={selectedDocumentsForModal}
        // extra meta sent so modal can echo back in payload
        metaPayload={{
          currentUserID: currentCoCreator?.UserID || null,
          newUserID: newCoCreator?.UserID || null,
        }}
        rawCurrentDocuments={currentCoCreatorDocuments}
        selectedCurrentDocumentIds={selectedCurrentDocuments}
        loading={loading}
      />
    </>
  );
};

export default CoCreationChange;
