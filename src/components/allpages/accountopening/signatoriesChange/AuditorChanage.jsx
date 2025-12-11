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
import AuditorChangeModal from "./AuditorChangeModal";
import { useTranslation } from "react-i18next";
import { use } from "react";
import { AuditorListApi } from "../../../../services/ownerchange/ownerchange";

const MainCard = styled(Card)(({ theme }) => ({
  width: "100%",
  borderRadius: theme.spacing(1),
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
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

const AuditorCard = styled(Paper)(({ theme, variant }) => ({
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

const AuditorChangeButton = styled(Button)(({ theme, disabled }) => ({
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

const AuditorChange = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentAuditor, setCurrentAuditor] = useState(null);
  const [newAuditor, setNewAuditor] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [auditors, setAuditors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAuditorDocuments, setCurrentAuditorDocuments] = useState([]);
  const [newAuditorDocuments, setNewAuditorDocuments] = useState([]);
  const [currentDocumentsLoading, setCurrentDocumentsLoading] = useState(false);
  const [newDocumentsLoading, setNewDocumentsLoading] = useState(false);
  const [currentDocumentsSearch, setCurrentDocumentsSearch] = useState("");
  const [newDocumentsSearch, setNewDocumentsSearch] = useState("");
  const [selectedCurrentDocuments, setSelectedCurrentDocuments] = useState([]);
  const [selectedNewDocuments, setSelectedNewDocuments] = useState([]);
  const [currentAllSelected, setCurrentAllSelected] = useState(false);
  const [newAllSelected, setNewAllSelected] = useState(false);
  const [openAuditorChangeModal, setOpenAuditorChangeModal] = useState(false);
  const { t } = useTranslation(); // Assuming you have a translation function

  // Mock data for demonstration
  const mockDocuments = [
    {
      DocumentID: "doc-001",
      DocumentName: "Audit Agreement",
      DocumentType: "Contract",
      Status: "Active",
    },
    {
      DocumentID: "doc-002",
      DocumentName: "Financial Statements",
      DocumentType: "Report",
      Status: "Active",
    },
    {
      DocumentID: "doc-003",
      DocumentName: "Audit Findings",
      DocumentType: "Report",
      Status: "Active",
    },
    {
      DocumentID: "doc-004",
      DocumentName: "Compliance Report",
      DocumentType: "Report",
      Status: "Active",
    },
  ];

  const filteredCurrentDocuments = currentAuditorDocuments.filter((doc) =>
    doc.DocumentName.toLowerCase().includes(
      currentDocumentsSearch.toLowerCase()
    )
  );

  const filteredNewDocuments = newAuditorDocuments.filter((doc) =>
    doc.DocumentName.toLowerCase().includes(newDocumentsSearch.toLowerCase())
  );

  const handleCurrentDocumentSelect = (documentId) => {
    setSelectedCurrentDocuments((prev) => {
      if (prev.includes(documentId)) {
        return prev.filter((id) => id !== documentId);
      } else {
        return [...prev, documentId];
      }
    });
  };

  useEffect(() => {
    const fetchAuditorList = async () => {
      try {
        setIsLoading(true); // Start loader before API call
        const response = await AuditorListApi();
        const apiAuditors = (response?.data?.data?.userList || []).map(
          (user) => ({
            id: user.UserID,
            name: user.UserName,
            email: `${user.UserDetail?.UserFirstName || ""} ${
              user.UserDetail?.UserLastName || ""
            }`.trim(),
            fullName: `${user.UserDetail?.UserFirstName || ""} ${
              user.UserDetail?.UserLastName || ""
            }`.trim(),
          })
        );
        setAuditors(apiAuditors);
        setIsLoading(false); // Stop loader after list is set
      } catch (error) {
        console.error("Error fetching auditor list:", error);
        setIsLoading(false); // Stop loader on error
      }
    };

    fetchAuditorList();
  }, []);

  const handleSelectAllCurrent = () => {
    if (currentAllSelected) {
      setSelectedCurrentDocuments([]);
    } else {
      const allIds = filteredCurrentDocuments.map((doc) => doc.DocumentID);
      setSelectedCurrentDocuments(allIds);
    }
    setCurrentAllSelected(!currentAllSelected);
  };

  const handleSelectAllNew = () => {
    if (newAllSelected) {
      setSelectedNewDocuments([]);
    } else {
      const allIds = filteredNewDocuments.map((doc) => doc.DocumentID);
      setSelectedNewDocuments(allIds);
    }
    setNewAllSelected(!newAllSelected);
  };

  useEffect(() => {
    setSelectedCurrentDocuments([]);
    setCurrentAllSelected(false);
  }, [currentAuditorDocuments, currentDocumentsSearch]);

  useEffect(() => {
    setSelectedNewDocuments([]);
    setNewAllSelected(false);
  }, [newAuditorDocuments, newDocumentsSearch]);

  const handleAuditorSelect = (type, value) => {
    if (type === "current") {
      setCurrentAuditor(value);
      if (value) {
        setCurrentDocumentsLoading(true);
        setTimeout(() => {
          setCurrentAuditorDocuments(mockDocuments);
          setCurrentDocumentsLoading(false);
        }, 1000);
      } else {
        setCurrentAuditorDocuments([]);
      }
    } else {
      setNewAuditor(value);
      if (value) {
        setNewDocumentsLoading(true);
        setTimeout(() => {
          setNewAuditorDocuments(mockDocuments);
          setNewDocumentsLoading(false);
        }, 1000);
      } else {
        setNewAuditorDocuments([]);
      }
    }
  };

  const handleConfirmChange = () => {
    setShowSuccess(true);
    setCurrentAuditor(null);
    setNewAuditor(null);
    setCurrentAuditorDocuments([]);
    setNewAuditorDocuments([]);
    setSelectedCurrentDocuments([]);
    setSelectedNewDocuments([]);
  };

  const isChangeValid = null;
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
                Auditor has been successfully changed!
              </Alert>
            )}

            <Grid
              container
              spacing={isMobile ? 2 : 4}
              alignItems="stretch"
              sx={{ mb: 3 }}
            >
              <Grid item xs={12} md={5}>
                <AuditorCard variant="current">
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
                    <PersonIcon fontSize="small" /> Current Auditor
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 0 }}>
                    <Autocomplete
                      options={auditors}
                      getOptionLabel={(option) =>
                        `${option.name} - ${option.fullName}`
                      }
                      value={currentAuditor}
                      onChange={(event, newValue) => {
                        handleAuditorSelect("current", newValue);
                      }}
                      loading={isLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select "
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
                      noOptionsText="No auditors found"
                      sx={{
                        "& .MuiAutocomplete-popupIndicator": {
                          transform: "none",
                        },
                      }}
                    />
                  </FormControl>
                  {currentAuditor && (
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
                          {currentAuditorDocuments.length > 0 && (
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
                            {currentAuditorDocuments.length > 0 &&
                              `(${currentAuditorDocuments.length})`}
                          </Typography>
                        </Box>
                      </Box>
                      {currentAuditorDocuments.length > 0 && (
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
                            currentAuditorDocuments.length === 0
                              ? "center"
                              : "flex-start",
                          alignItems:
                            currentDocumentsLoading ||
                            currentAuditorDocuments.length === 0
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
                        ) : currentAuditorDocuments.length === 0 ? (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              textAlign: "center",
                            }}
                          >
                            No documents found for this auditor
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
                                key={document.DocumentID}
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
                                    document.DocumentID
                                  )}
                                  onChange={() =>
                                    handleCurrentDocumentSelect(
                                      document.DocumentID
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
                                      {document.DocumentName}
                                    </Typography>
                                    <Chip
                                      label={document.DocumentType}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: "0.65rem",
                                        bgcolor:
                                          document.DocumentType === "Contract"
                                            ? "#e3f2fd"
                                            : "#e8f5e9",
                                        color:
                                          document.DocumentType === "Contract"
                                            ? "#1976d2"
                                            : "#4caf50",
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      fontSize: "0.7rem",
                                    }}
                                  >
                                    Status: {document.Status}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </>
                        )}
                      </Box>
                    </Box>
                  )}
                </AuditorCard>
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
                  <SwapButton disabled={isChangeValid}>
                    <SwapHorizIcon />
                  </SwapButton>
                </Box>
              </Grid>

              <Grid item xs={12} md={5}>
                <AuditorCard>
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
                    <PersonIcon fontSize="small" /> New Auditor
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 0 }}>
                    <Autocomplete
                      options={auditors}
                      getOptionLabel={(option) =>
                        `${option.name} - ${option.fullName}`
                      }
                      value={newAuditor}
                      onChange={(event, newValue) => {
                        handleAuditorSelect("new", newValue);
                      }}
                      loading={isLoading}
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
                                {isLoading ? (
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
                          {option.name} - {option.email}
                        </li>
                      )}
                      noOptionsText="No auditors found"
                      sx={{
                        "& .MuiAutocomplete-popupIndicator": {
                          transform: "none",
                        },
                      }}
                    />
                  </FormControl>

                  {/* New Auditor's Documents */}
                  {newAuditor && (
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
                            {newAuditorDocuments.length > 0 &&
                              `(${newAuditorDocuments.length})`}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Search box */}
                      {newAuditorDocuments.length > 0 && (
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
                            newAuditorDocuments.length === 0
                              ? "center"
                              : "flex-start",
                          alignItems:
                            newDocumentsLoading ||
                            newAuditorDocuments.length === 0
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
                        ) : newAuditorDocuments.length === 0 ? (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              textAlign: "center",
                            }}
                          >
                            No documents found for this auditor
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
                                key={document.DocumentID}
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
                                      {document.DocumentName}
                                    </Typography>
                                    <Chip
                                      label={document.DocumentType}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: "0.65rem",
                                        bgcolor:
                                          document.DocumentType === "Contract"
                                            ? "#e3f2fd"
                                            : "#e8f5e9",
                                        color:
                                          document.DocumentType === "Contract"
                                            ? "#1976d2"
                                            : "#4caf50",
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      fontSize: "0.7rem",
                                    }}
                                  >
                                    Status: {document.Status}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </>
                        )}
                      </Box>
                    </Box>
                  )}
                </AuditorCard>
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
              <AuditorChangeButton
                disabled={isChangeValid}
                variant="contained"
                startIcon={<SwapHoriz />}
                onClick={() => setOpenAuditorChangeModal(true)}
              >
                Change Auditor
              </AuditorChangeButton>
              <ResetButton
                startIcon={<CloseIcon fontSize="small" />}
                onClick={() => {
                  setCurrentAuditor(null);
                  setNewAuditor(null);
                  setCurrentAuditorDocuments([]);
                  setNewAuditorDocuments([]);
                }}
                variant="outlined"
              >
                {t("reset")}
              </ResetButton>
            </Box>
          </Box>
        </MainCard>
      </Card>
      <AuditorChangeModal
        open={openAuditorChangeModal}
        onClose={() => setOpenAuditorChangeModal(false)}
        auditors={auditors}
        onConfirmChange={handleConfirmChange}
      />
    </>
  );
};

export default AuditorChange;
