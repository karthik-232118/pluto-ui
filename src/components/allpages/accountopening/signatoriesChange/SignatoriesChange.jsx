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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { SwapHoriz } from "@mui/icons-material";
import SignatoriesChangeModal from "./SignatoriesChangeModal";
import { useTranslation } from "react-i18next";
import {
  SignatoryListApi,
  GetSignatoryUserListApi,
} from "../../../../services/ownerchange/ownerchange";

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

const SignatoryCard = styled(Paper)(({ theme, variant }) => ({
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

const SignatoryChangeButton = styled(Button)(({ theme, disabled }) => ({
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

const SignatoriesChange = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentSignatory, setCurrentSignatory] = useState(null);
  const [newSignatory, setNewSignatory] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // const [signatories, setSignatories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [signatories, setSignatories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentSignatoryDocuments, setCurrentSignatoryDocuments] = useState(
    []
  );
  const [newSignatoryDocuments, setNewSignatoryDocuments] = useState([]);
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
    currentSignatory?.UserID &&
    newSignatory?.UserID &&
    currentSignatory.UserID !== newSignatory.UserID
  );

  // UPDATED filters: use ElementName
  const filteredCurrentDocuments = currentSignatoryDocuments.filter((doc) =>
    doc.ElementName?.toLowerCase().includes(
      currentDocumentsSearch.toLowerCase()
    )
  );
  const filteredNewDocuments = newSignatoryDocuments.filter((doc) =>
    doc.ElementName?.toLowerCase().includes(newDocumentsSearch.toLowerCase())
  );

  // Helper to fetch elements for a selected signatory
  const fetchSignatoryElements = async (userId, type) => {
    if (!userId) return;
    type === "current"
      ? setCurrentDocumentsLoading(true)
      : setNewDocumentsLoading(true);
    try {
      const resp = await GetSignatoryUserListApi({ UserID: userId });
      const list =
        resp?.data?.data?.data || resp?.data?.data || resp?.data || [];
      if (Array.isArray(list)) {
        if (type === "current") setCurrentSignatoryDocuments(list);
        else setNewSignatoryDocuments(list);
      } else {
        console.warn("Unexpected elements response format:", resp);
        if (type === "current") setCurrentSignatoryDocuments([]);
        else setNewSignatoryDocuments([]);
      }
    } catch (e) {
      console.error("Failed to fetch signatory elements:", e);
      if (type === "current") setCurrentSignatoryDocuments([]);
      else setNewSignatoryDocuments([]);
    } finally {
      type === "current"
        ? setCurrentDocumentsLoading(false)
        : setNewDocumentsLoading(false);
    }
  };

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
  }, [currentSignatoryDocuments, currentDocumentsSearch]);

  useEffect(() => {
    // Simulate API call for fetching signatories
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // mockSignatories is defined within this component, so it doesn't need to be a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignatoryChange = () => {
    // build data to show in modal
    const selectedDocsFull = currentSignatoryDocuments.filter((d) =>
      selectedCurrentDocuments.includes(d.ElementID)
    );
    setModalOpen(true);
    if (
      currentSignatory &&
      newSignatory &&
      currentSignatory.UserID !== newSignatory.UserID
    ) {
      setConfirmDialog(true);
    }
  };

  const handleConfirmChange = (payload) => {
    console.log("Confirm Change Payload:", payload);
    setShowSuccess(true);

    // Reset selections after successful change
    setCurrentSignatory(null);
    setNewSignatory(null);
    setCurrentSignatoryDocuments([]);
    setNewSignatoryDocuments([]);
    setSelectedCurrentDocuments([]);

    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const handleSignatorySelect = (type, value) => {
    if (type === "current") {
      setCurrentSignatory(value);
      setCurrentSignatoryDocuments([]);
      setSelectedCurrentDocuments([]);
      if (value?.UserID) fetchSignatoryElements(value.UserID, "current");
    } else {
      setNewSignatory(value);
      setNewSignatoryDocuments([]);
      if (value?.UserID) fetchSignatoryElements(value.UserID, "new");
    }
  };

  // Logging only now (API moved to per-selection)
  useEffect(() => {
    if (currentSignatory?.UserID && newSignatory?.UserID) {
      console.log("Current Signatory UserID:", currentSignatory.UserID);
      console.log("New Signatory UserID:", newSignatory.UserID);
      if (currentSignatory.UserID === newSignatory.UserID) {
        console.warn("Both dropdowns have the same UserID.");
      }
    }
  }, [currentSignatory, newSignatory]);

  // Moved logging of selected current documents into SignatoriesChangeModal
  // useEffect(() => {
  //   if (selectedCurrentDocuments.length) {
  //     const selectedData = currentSignatoryDocuments.filter((d) =>
  //       selectedCurrentDocuments.includes(d.ElementID)
  //     );
  //     console.log("SelectedCurrentDocumentsPayload:", {
  //       message: "Selected current signatory documents",
  //       data: { data: selectedData },
  //     });
  //   } else {
  //     console.log("SelectedCurrentDocumentsPayload: none selected");
  //   }
  // }, [selectedCurrentDocuments, currentSignatoryDocuments]);

  useEffect(() => {
    const fetchSignatories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await SignatoryListApi();
        setSignatories(response.data?.data?.userList || []);
      } catch (err) {
        setError(err.message || "Failed to fetch signatories");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSignatories();
  }, []);

  if (loading) return <div>Loading signatories...</div>;
  if (error) return <div>Error: {error}</div>;

  // Helper to build modal props (keeps JSX clean)
  const currentSignatoryData = currentSignatory
    ? {
        id: currentSignatory.UserID,
        name:
          (currentSignatory.UserDetail?.UserFirstName || "") +
          " " +
          (currentSignatory.UserDetail?.UserLastName || ""),
        email:
          currentSignatory.UserDetail?.UserEmail || currentSignatory.UserEmail,
        avatar: currentSignatory.UserName?.charAt(0),
        color: "#2C64FF",
      }
    : null;

  const newSignatoryData = newSignatory
    ? {
        id: newSignatory.UserID,
        name:
          (newSignatory.UserDetail?.UserFirstName || "") +
          " " +
          (newSignatory.UserDetail?.UserLastName || ""),
        email: newSignatory.UserDetail?.UserEmail || newSignatory.UserEmail,
        avatar: newSignatory.UserName?.charAt(0),
        color: "#4caf50",
      }
    : null;

  const selectedDocumentsForModal = currentSignatoryDocuments
    .filter((d) => selectedCurrentDocuments.includes(d.ElementID))
    .map((d) => ({
      id: d.ElementID,
      name: d.ElementName,
      type: d.ModuleName,
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
                Signatory has been successfully changed!
              </Alert>
            )}

            <Grid
              container
              spacing={isMobile ? 2 : 4}
              alignItems="stretch"
              sx={{ mb: 3 }}
            >
              <Grid item xs={12} md={5}>
                <SignatoryCard variant="current">
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
                    <PersonIcon fontSize="small" /> {t("currentSignatory")}
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 0 }}>
                    <Autocomplete
                      options={signatories}
                      getOptionLabel={(option) =>
                        `${option.UserName} - ${option.UserDetail?.UserFirstName} ${option.UserDetail?.UserLastName}`
                      }
                      value={currentSignatory}
                      onChange={(event, newValue) => {
                        handleSignatorySelect("current", newValue);
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
                      noOptionsText="No signatories found"
                      sx={{
                        "& .MuiAutocomplete-popupIndicator": {
                          transform: "none",
                        },
                      }}
                    />
                  </FormControl>

                  {/* Current Signatory's Documents (UPDATED rendering) */}
                  {currentSignatory && (
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
                          {currentSignatoryDocuments.length > 0 && (
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
                            {currentSignatoryDocuments.length > 0 &&
                              `(${currentSignatoryDocuments.length})`}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Search box */}
                      {currentSignatoryDocuments.length > 0 && (
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
                            currentSignatoryDocuments.length === 0
                              ? "center"
                              : "flex-start",
                          alignItems:
                            currentDocumentsLoading ||
                            currentSignatoryDocuments.length === 0
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
                        ) : currentSignatoryDocuments.length === 0 ? (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              textAlign: "center",
                            }}
                          >
                            No documents found for this signatory
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
                                key={document.ElementID}
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
                                    document.ElementID
                                  )}
                                  onChange={() =>
                                    handleCurrentDocumentSelect(
                                      document.ElementID
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
                                      {document.ElementName}
                                    </Typography>
                                    <Chip
                                      label={document.ModuleName}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: "0.65rem",
                                        bgcolor: "#e3f2fd",
                                        color: "#1976d2",
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            ))}
                          </>
                        )}
                      </Box>
                    </Box>
                  )}
                </SignatoryCard>
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
                <SignatoryCard>
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
                    <PersonIcon fontSize="small" /> {t("newSignatory")}
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 0 }}>
                    <Autocomplete
                      options={signatories}
                      getOptionLabel={(option) =>
                        `${option.UserName} - ${option.UserDetail?.UserFirstName} ${option.UserDetail?.UserLastName}`
                      }
                      value={newSignatory}
                      onChange={(event, newValue) => {
                        handleSignatorySelect("new", newValue);
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
                      noOptionsText="No signatories found"
                      sx={{
                        "& .MuiAutocomplete-popupIndicator": {
                          transform: "none",
                        },
                      }}
                    />
                  </FormControl>

                  {/* New Signatory's Documents (checkboxes removed) */}
                  {newSignatory && (
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
                            {newSignatoryDocuments.length > 0 &&
                              `(${newSignatoryDocuments.length})`}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Search box */}
                      {newSignatoryDocuments.length > 0 && (
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
                            newSignatoryDocuments.length === 0
                              ? "center"
                              : "flex-start",
                          alignItems:
                            newDocumentsLoading ||
                            newSignatoryDocuments.length === 0
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
                        ) : newSignatoryDocuments.length === 0 ? (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              textAlign: "center",
                            }}
                          >
                            No documents found for this signatory
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
                                key={document.ElementID}
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
                                      {document.ElementName}
                                    </Typography>
                                    <Chip
                                      label={document.ModuleName}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: "0.65rem",
                                        bgcolor: "#e3f2fd",
                                        color: "#1976d2",
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            ))}
                          </>
                        )}
                      </Box>
                    </Box>
                  )}
                </SignatoryCard>
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
              <SignatoryChangeButton
                onClick={handleSignatoryChange}
                variant="contained"
                startIcon={<SwapHoriz />}
              >
                Change Signatory
              </SignatoryChangeButton>
              <ResetButton
                startIcon={<CloseIcon fontSize="small" />}
                onClick={() => {
                  setCurrentSignatory(null);
                  setNewSignatory(null);
                  setCurrentSignatoryDocuments([]);
                  setNewSignatoryDocuments([]);
                }}
                variant="outlined"
              >
                Reset
              </ResetButton>
            </Box>
          </Box>
        </MainCard>
      </Card>
      <SignatoriesChangeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={(payloadFromModal) => {
          handleConfirmChange(payloadFromModal);
          setModalOpen(false);
        }}
        currentSignatoryData={currentSignatoryData}
        newSignatoryData={newSignatoryData}
        selectedDocuments={selectedDocumentsForModal}
        // extra meta sent so modal can echo back in payload
        metaPayload={{
          currentUserID: currentSignatory?.UserID || null,
          newUserID: newSignatory?.UserID || null,
        }}
        rawCurrentDocuments={currentSignatoryDocuments}
        selectedCurrentDocumentIds={selectedCurrentDocuments}
      />
    </>
  );
};

export default SignatoriesChange;
