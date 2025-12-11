import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TableSortLabel,
  Box,
  CircularProgress,
  InputAdornment,
  Pagination,
  Modal,
  Typography,
  IconButton,
  Tooltip,
  Accordion,
  AccordionDetails,
} from "@mui/material";
import {
  deleteElementAttributeType,
  listElementAttributeType,
} from "../../../services/documentModules/DocumentsModule";
import { useSelector } from "react-redux";
import Attributetype from "./Attributetype";
import DeleteConfirmationPopup from "../masterpopups/DeleteConfirmationPopup";
import notify from "../../../assets/svg/utils/toast/Toast";
import { useTranslation } from "react-i18next";
import { Search, ExpandMore, ExpandLess } from "@mui/icons-material";
import { Delete, Edit } from "@mui/icons-material";
import LinkedElements from "./linkedElements";
import { useTheme } from "@mui/styles";
import ElementAttributeDetails from "./ElementAttributeDetails";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 800,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "0",
  borderRadius: "12px",
  outline: "none",
};

const AttributetypeList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [SelectedRow, setSelectedRow] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [openforEdit, setOpenforEdit] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [accordionSelectedId, setAccordionSelectedId] = useState(null);
  const { t } = useTranslation();
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;
  const [payload, setPayload] = useState({});
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const IsGlobalView = JSON.parse(localStorage.getItem("IsGlobalView"));
  const user_id = localStorage.getItem("user_id");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    nextPage: 0,
    pageSize: 5,
    previousPage: null,
    total: 0,
    totalPages: 0,
  });

  const fetchDocumentTypes = useCallback(async (payladData) => {
    setLoading(true);
    try {
      const response = await listElementAttributeType(payladData);
      if (response?.status === 200) {
        setData(response.data.data.elementAttributes || []);
        setPagination({
          ...response.data.data.pagination,
        });
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching document types:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const headerStyle = {
    background: bgColor || "linear-gradient(to top, #2C64FF, #4A90E2)",
    padding: "24px",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative", // Add this
    "& .MuiTypography-h6": {
      color: "#FFFFFF",
    },
    "& .MuiTypography-body2": {
      color: "#FFFFFF",
      opacity: 0.9,
    },
  };

  useEffect(() => {
    const moduletypeId = JSON.parse(
      localStorage.getItem("persist:sidebarstate")
    );

    const initialPayload = {
      ModuleTypeID: moduletypeId && JSON.parse(moduletypeId?.ModuleTypeID),
      IsPagination: true,
      Page: 1,
      PageSize: 5,
      SortField: "CreatedDate",
      SortOrder: "DESC",
      Search: "",
      IsGlobalView: IsGlobalView || false,
    };

    setPayload(initialPayload);

    if (openModal) {
      fetchDocumentTypes(initialPayload);
    }
  }, [openModal]);

  useEffect(() => {
    if (openModal) {
      fetchDocumentTypes(payload);
    }
  }, [payload, openModal, fetchDocumentTypes]);

  const handleSearchChange = (e) => {
    setPayload((prev) => ({
      ...prev,
      Search: e.target.value,
      Page: 1,
    }));
  };

  const handleSort = (field) => {
    setPayload((prev) => ({
      ...prev,
      SortField: field,
      SortOrder: prev.SortOrder === "ASC" ? "DESC" : "ASC",
    }));
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteElementAttributeType({
        ElementAttributeTypeID: SelectedRow,
        ModuleName: presistStore?.ModuleMaster?.ModuleName,
      });
      if (res.status === 200) {
        notify(
          "success",
          res.data.message || "Document type deleted successfully"
        );
        setSelectedRow(null);
        const moduletypeId = JSON.parse(
          localStorage.getItem("persist:sidebarstate")
        );
        const payladData = {
          ModuleTypeID: moduletypeId && JSON.parse(moduletypeId?.ModuleTypeID),
          IsPagination: true,
          Page: payload.Page || 1,
          PageSize: payload.pageSize || 5,
          IsGlobalView: IsGlobalView || false,
        };
        fetchDocumentTypes(payladData);
      } else {
        notify("error", res?.data?.message || "Failed to Delete");
      }
    } catch (error) {
      console.error("Error deleting document type:", error);
    } finally {
      setDeleting(false);
      setAlert(false);
      setSelectedRow(null);
    }
  };

  const onclose = () => {
    setOpenforEdit(false);
    setSelectedRow(null);
  };

  const fetchList = useCallback(async () => {
    const moduletypeId = JSON.parse(
      localStorage.getItem("persist:sidebarstate")
    );
    const payladData = {
      ModuleTypeID: moduletypeId && JSON.parse(moduletypeId?.ModuleTypeID),
      IsPagination: true,
      Page: payload.Page || 1,
      PageSize: payload.pageSize || 5,
    };
    setLoading(true);
    try {
      const response = await listElementAttributeType(payladData);
      if (response?.status === 200) {
        setData(response.data.data.elementAttributes || []);
        setPagination(response.data.data.pagination);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching document types:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const handleNext = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPayload((prev) => ({
        ...prev,
        Page: pagination.currentPage + 1,
      }));
    }
  };

  const handlePrevious = () => {
    if (pagination.currentPage > 1) {
      setPayload((prev) => ({
        ...prev,
        Page: pagination.currentPage - 1,
      }));
    }
  };

  const handleAccordionToggle = (elementAttributeTypeId) => {
    if (accordionSelectedId === elementAttributeTypeId && accordionOpen) {
      setAccordionOpen(false);
      setAccordionSelectedId(null);
    } else {
      setAccordionSelectedId(elementAttributeTypeId);
      setAccordionOpen(true);
    }
  };
  return (
    <>
      <Box>
        <Button
          variant="contained"
          onClick={handleOpenModal}
          sx={{
            textTransform: "none",
            height: "40px",
            whiteSpace: "nowrap",
          }}
        >
          {t("Element Attribute Type")}
        </Button>
      </Box>

      <Modal open={openModal}>
        <Box sx={style}>
          <Box sx={headerStyle}>
            <Box display="flex" alignItems="center" gap="10px">
              <Box>
                <Typography variant="h6">
                  {t("elementAttributeTypeList")}
                </Typography>
                <Typography variant="body2">
                  {t("addEditDescription")}
                </Typography>
              </Box>
            </Box>
            <Button
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                right: "8px",
                top: "8px",
                minWidth: "auto",
                p: "4px",

                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Typography fontSize="24px">×</Typography>
            </Button>
          </Box>

          <Box
            sx={{
              padding: "16px",
            }}
          >
            <Box mb={2}>
              <TextField
                fullWidth
                variant="outlined"
                value={payload.Search}
                onChange={handleSearchChange}
                placeholder={t("searchByName")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Attributetype
              SelectedRow={SelectedRow}
              openforEdit={openforEdit}
              onclose={onclose}
              fetchList={fetchList}
              isLoading={loading}
              setSelectedRow={setSelectedRow}
            />

            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Name"].map((col) => (
                    <TableCell
                      key={col}
                      sx={{
                        fontWeight: "bold",
                        cursor: "pointer",
                        minWidth: 100,
                      }}
                    >
                      <TableSortLabel
                        active={payload?.SortField === col}
                        direction={payload?.SortOrder?.toLowerCase()}
                        onClick={() => handleSort(col)}
                      >
                        {t(col.toLowerCase())}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      minWidth: 50,
                      textAlign: "center",
                    }}
                  >
                    {t("actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading && data.length > 0 ? (
                  data.map((row) => (
                    <>
                      <TableRow
                        key={row.ElementAttributeTypeID}
                        sx={{
                          backgroundColor:
                            accordionSelectedId ===
                              row.ElementAttributeTypeID && accordionOpen
                              ? "rgba(0, 0, 0, 0.04)"
                              : "inherit",
                          opacity:
                            accordionSelectedId ===
                              row.ElementAttributeTypeID && accordionOpen
                              ? 0.6
                              : 1,
                        }}
                      >
                        <TableCell>{row.Name}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Box display="flex" justifyContent="center" gap={1}>
                            <Tooltip title={t("edit")}>
                              <IconButton
                                onClick={() => {
                                  setOpenforEdit(true);
                                  setSelectedRow(row.ElementAttributeTypeID);
                                }}
                                disabled={
                                  (accordionSelectedId ===
                                    row.ElementAttributeTypeID &&
                                    accordionOpen) ||
                                  (row?.CreatedBy === user_id && !row?.IsInUse
                                    ? false
                                    : true)
                                }
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t("Delete")}>
                              <IconButton
                                onClick={() => {
                                  setSelectedRow(row.ElementAttributeTypeID);
                                  setAlert(true);
                                }}
                                disabled={
                                  (accordionSelectedId ===
                                    row.ElementAttributeTypeID &&
                                    accordionOpen) ||
                                  deleting ||
                                  (row?.CreatedBy === user_id ? false : true)
                                }
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={
                                accordionSelectedId ===
                                  row.ElementAttributeTypeID && accordionOpen
                                  ? t("collapse")
                                  : t("View Details")
                              }
                            >
                              <IconButton
                                onClick={() =>
                                  handleAccordionToggle(
                                    row.ElementAttributeTypeID
                                  )
                                }
                                sx={{
                                  color:
                                    accordionSelectedId ===
                                      row.ElementAttributeTypeID &&
                                    accordionOpen
                                      ? "primary.main"
                                      : "inherit",
                                }}
                              >
                                {accordionSelectedId ===
                                  row.ElementAttributeTypeID &&
                                accordionOpen ? (
                                  <ExpandLess />
                                ) : (
                                  <ExpandMore />
                                )}
                              </IconButton>
                            </Tooltip>
                            <LinkedElements
                              ElementAttributeTypeID={
                                row?.ElementAttributeTypeID
                              }
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                      {accordionSelectedId === row.ElementAttributeTypeID &&
                        accordionOpen && (
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              sx={{ p: 0, border: "none" }}
                            >
                              <Accordion
                                expanded={true}
                                sx={{
                                  boxShadow: "none",
                                  "&:before": { display: "none" },
                                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                                }}
                              >
                                <AccordionDetails sx={{ pt: 2 }}>
                                 <ElementAttributeDetails row={row} />
                                </AccordionDetails>
                              </Accordion>
                            </TableCell>
                          </TableRow>
                        )}
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      {loading ? <CircularProgress /> : t("no_data")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Box display="flex" alignItems="center" justifyContent="end" mt={2}>
              {/* Previous Button */}
              <Button
                variant="outlined"
                size="small"
                onClick={handlePrevious}
                disabled={pagination.currentPage === 1}
                sx={{
                  borderRadius: "6px",
                  textTransform: "none",
                  px: 2,
                  py: 0.5,
                  "&:disabled": {
                    opacity: 0.5,
                    cursor: "not-allowed",
                  },
                }}
              >
                {t("previous")}
              </Button>

              {/* Pagination numbers */}
              <Pagination
                count={pagination.totalPages || 1}
                page={pagination.currentPage}
                onChange={(event, value) =>
                  setPayload((prev) => ({
                    ...prev,
                    Page: value,
                  }))
                }
                hidePrevButton
                hideNextButton
                color="primary"
                shape="rounded"
                size="small"
                siblingCount={1}
                boundaryCount={1}
              />

              {/* Next Button */}
              <Button
                variant="outlined"
                size="small"
                onClick={handleNext}
                disabled={
                  pagination.currentPage === pagination.totalPages ||
                  pagination.totalPages === 0
                }
                sx={{
                  borderRadius: "6px",
                  textTransform: "none",
                  px: 2,
                  py: 0.5,
                  "&:disabled": {
                    opacity: 0.5,
                    cursor: "not-allowed",
                  },
                }}
              >
                {t("next")}
              </Button>
            </Box>
          </Box>
          <DeleteConfirmationPopup
            open={alert}
            onClose={() => setAlert(false)}
            onConfirm={handleDelete}
            title={t("deleteModal.deleteConfirmation")}
            isDeleting={deleting}
          />
        </Box>
      </Modal>
    </>
  );
};

export default AttributetypeList;
