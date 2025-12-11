import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Card,
  CardContent,
  TextField,
  Grid,
  InputAdornment,
  Divider,
  IconButton,
  Checkbox,
  Breadcrumbs,
  Link,
  useTheme,
} from "@mui/material";
import PageLoader from "../../../src/assets/image/cubeloader1.gif";
import { useDispatch, useSelector } from "react-redux";
import { GetModalElementsCategoryApi } from "../../services/elements/Elements";
import SearchIcon from "@mui/icons-material/Search";
import FolderIcon from "@mui/icons-material/Folder";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MoveFile } from "../../store/moveFile/action";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import fileIcon from "../../assets/svg/AotuFinance/fileIcon.svg";

const MoveToModal = ({ open, onClose, selectedItems }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [apiResponse, setApiResponse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clickedContentID, setClickedContentID] = useState(null);
  const [clickedModuleTypeID, setClickedModuleTypeID] = useState(null);
  const [selectedContentID, setSelectedContentID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const theme = useTheme();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "12px",
    overflow: "hidden",
  };
  const headerStyle = {
    background: theme.palette.primary.main,
    color: "white",
    padding: "16px 24px",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  const contentStyle = {
    padding: "24px",
    flex: 1,
    overflowY: "auto",
    backgroundColor: "#f9fafc",
  };
  const cardStyle = {
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    border: "2px solid transparent",
    borderRadius: "8px",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 16px rgba(25, 118, 210, 0.2)",
      backgroundColor: "#f0f7ff",
    },
  };
  const selectedCardStyle = {
    ...cardStyle,
    border: "2px solid #1976d2",
    backgroundColor: "#e3f2fd",
  };
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const payload = {
            ModuleTypeID: presistStore?.ModuleTypeID || null,
            ParentContentID: null,
            IsEnableMyTask: false,
          };
          const response = await GetModalElementsCategoryApi(payload);
          setApiResponse(response?.data);
        } catch (error) {
          console.error("Error calling API:", error);
          toast.error("Failed to load folders");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [open, presistStore]);

  // Filter the data based on search term
  const filteredData = apiResponse?.data?.filter((item) =>
    item.ContentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (event, contentID) => {
    if (event.target.checked) {
      setSelectedContentID(contentID);
    } else {
      setSelectedContentID(null);
    }
  };

  const handleMove = async () => {
    if (!selectedContentID) {
      toast.warning("Please select a folder to move to");
      return;
    }

    setMoving(true);
    try {
      const FileID = selectedItems?.map(
        (item) =>
          item?.SOPID ||
          item?.TrainingSimulationID ||
          item?.TestSimulationID ||
          item?.TestMCQID ||
          item?.DocumentID
      );
      const moduleName = selectedItems[0]?.ModuleName;
      const moduleTypeID = selectedItems[0]?.ModuleTypeID;
      const payload = {
        FileIDs: FileID,
        ModuleTypeID: moduleTypeID,
        ModuleName: moduleName,
        MovingFolderID: selectedContentID || null,
      };
      await dispatch(MoveFile(payload));
      toast.success("Files moved successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error("Failed to move files. Please try again.");
    } finally {
      setMoving(false);
    }
  };
  const handleCardClick = async (item) => {
    const contentID = item.ContentID;
    const moduleTypeID = item.ModuleTypeID;
    setClickedContentID(contentID);
    setClickedModuleTypeID(moduleTypeID);

    // Save current state to history
    setNavigationHistory((prev) => [
      ...prev,
      {
        contentId: clickedContentID,
        moduleTypeId: clickedModuleTypeID,
        response: apiResponse,
      },
    ]);

    try {
      setLoading(true);
      const payload = {
        ModuleTypeID: moduleTypeID,
        ParentContentID: contentID,
        IsEnableMyTask: false,
      };
      const response = await GetModalElementsCategoryApi(payload);
      setApiResponse(response?.data);
    } catch (error) {
      console.error("Error calling API in handleCardClick:", error);
      toast.error("Failed to load folder contents");
    } finally {
      setLoading(false);
    }
  };
  const handleBreadcrumbClick = async (breadcrumbId) => {
    try {
      setLoading(true);
      const payload = {
        ModuleTypeID: presistStore?.ModuleTypeID || null,
        ParentContentID: breadcrumbId || null,
        IsEnableMyTask: false,
      };
      const response = await GetModalElementsCategoryApi(payload);
      setApiResponse(response?.data);
    } catch (error) {
      console.error("Error calling API on breadcrumb click:", error);
      toast.error("Failed to navigate to folder");
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    if (navigationHistory.length > 0) {
      const previousState = navigationHistory[navigationHistory.length - 1];
      setClickedContentID(previousState.contentId);
      setClickedModuleTypeID(previousState.moduleTypeId);
      setApiResponse(previousState.response);
      setNavigationHistory((prev) => prev.slice(0, -1));
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* Header with back and close buttons */}
        <Box sx={headerStyle}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navigationHistory.length > 0 && (
              <IconButton onClick={handleBack} color="inherit" size="small">
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6" style={{ fontWeight: 600 }}>
              {t("move_selected_items")}
            </Typography>
          </Box>
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={contentStyle}>
          <TextField
            variant="outlined"
            placeholder={t("search_folders_placeholder")}
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginBottom: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "50px",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              },
            }}
          />
          <Divider sx={{ margin: "0 0 20px 0", borderColor: "#e0e0e0" }} />
          {apiResponse?.bredcrumbs && apiResponse.bredcrumbs.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Breadcrumbs aria-label="breadcrumb" separator="›">
                {apiResponse.bredcrumbs.map((b, index) => (
                  <Link
                    key={b.breadcrumbId}
                    underline="hover"
                    color={
                      index === apiResponse.bredcrumbs.length - 1
                        ? "text.primary"
                        : "primary"
                    }
                    sx={{
                      fontWeight:
                        index === apiResponse.bredcrumbs.length - 1 ? 600 : 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        color: "#0d47a1",
                      },
                    }}
                    onClick={() => handleBreadcrumbClick(b.breadcrumbId)}
                  >
                    {index === 0 && (
                      <img
                        src={fileIcon}
                        alt=""
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}
                    {b.breadcrumbName}
                  </Link>
                ))}
              </Breadcrumbs>
            </Box>
          )}
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="200px"
            >
              <img src={PageLoader} alt="Loading..." height={60} width={60} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredData?.length > 0 ? (
                filteredData.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.ContentID}>
                    <Card
                      sx={
                        selectedContentID === item.ContentID
                          ? selectedCardStyle
                          : cardStyle
                      }
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          padding: "12px !important",
                        }}
                        onClick={() => handleCardClick(item)}
                      >
                        {/* <FolderIcon
                          color={
                            selectedContentID === item.ContentID
                              ? "primary"
                              : "action"
                          }
                          fontSize="medium"
                        /> */}

                        <img src={fileIcon} alt="" />
                        <Typography
                          variant="body2"
                          sx={{
                            flexGrow: 1,
                            fontWeight:
                              selectedContentID === item.ContentID ? 600 : 400,
                            color:
                              selectedContentID === item.ContentID
                                ? "#1976d2"
                                : "text.primary",
                          }}
                        >
                          {item.ContentName}
                        </Typography>
                        <Checkbox
                          checked={selectedContentID === item.ContentID}
                          onChange={(e) =>
                            handleCheckboxChange(e, item.ContentID)
                          }
                          color="primary"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            "&.Mui-checked": {
                              color: "#1976d2",
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="200px"
                    flexDirection="column"
                    gap={2}
                  >
                    <FolderIcon
                      fontSize="large"
                      sx={{ color: "text.disabled" }}
                    />
                    <Typography color="text.secondary">
                      No folders found
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
        <Box
          sx={{
            padding: "16px 24px",
            backgroundColor: "#ffffff",
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleMove}
            disabled={!selectedContentID || moving}
            // sx={{
            //   minWidth: "120px",
            //   padding: "8px 24px",
            //   borderRadius: "8px",
            //   textTransform: "none",
            //   backgroundColor: bgColor,
            //   fontWeight: 600,
            //   boxShadow: "none",
            //   "&:hover": {
            //     boxShadow: "0 2px 8px bgColor",
            //   },
            //   "&:disabled": {
            //     backgroundColor: "#e0e0e0",
            //     color: "#9e9e9e",
            //   },
            // }}
          >
            {moving ? (
              <>
                <img src={PageLoader} alt="Loading..." height={60} width={60} />
                Moving...
              </>
            ) : (
              t("move_button")
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default MoveToModal;
