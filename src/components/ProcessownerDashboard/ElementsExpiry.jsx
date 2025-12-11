import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetDashboardElementDetails } from "../../store/dashboard/action";
import moment from "moment-timezone"; 
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { DownloadZipDocApi } from "../../services/DownloadZipFile/DownloadZipFile";
import { useTranslation } from "react-i18next";
import { useHeadingBgColor } from "../useHeadingBgColor";
const ElementsExpiry = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const elementDetails = useSelector((state) => state.dashboard.elementDetails);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const bgColor = useHeadingBgColor();

  useEffect(() => {
    if (open) {
      dispatch(GetDashboardElementDetails({ DetailsType: "Expiry" })).finally(
        () => setLoading(false)
      );
    }
  }, [dispatch, open]);

  const fetchZipFileData = async () => {
    try {
      const response = await DownloadZipDocApi();
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Docs.zip");
      document.body.appendChild(link);
      link.click(); 
      link.remove();
      window.URL.revokeObjectURL(url);
      console.log("Download Zip API Response:", response); 
    } catch (error) {
      console.error("Error fetching zip file data:", error);
    }
  };
  const rows = elementDetails?.data || [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const formatDateToIndianIST = (dateString) => {
    if (!dateString) return "N/A";
    const date = moment(dateString).tz("Asia/Kolkata");
    return date.format("DD MMM YYYY, hh:mm A ");
  };
  const getExpiryDateCellStyle = (dateString) => {
    if (!dateString) return {};
    const expiryDate = moment(dateString);
    const currentDate = moment();
    const daysDifference = expiryDate.diff(currentDate, "days");
    if (daysDifference < 0) {
      return {
        backgroundColor: "#ffcccc",
        color: "#d32f2f",
        fontWeight: "bold",
      };
    } else if (daysDifference <= 7) {
      return {
        backgroundColor: "#ffcccc",
        color: "#d32f2f",
        fontWeight: "bold",
      };
    } else if (daysDifference <= 30) {
     return {
        backgroundColor: "#fff9c4",
        color: "#ffb300", 
        fontWeight: "bold",
      };
    } else {
      return {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        fontWeight: "bold",
      };
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 4,
          boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: bgColor,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
          {t("elementsExpiryDetails")}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "rotate(90deg)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: "24px", position: "relative" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "400px",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: 2,
                overflow: "hidden",
                marginBottom: "70px", 
                marginTop: "1rem",
              }}
            >
              <Table sx={{ minWidth: 700 }} aria-label="elements expiry table">
                <TableHead sx={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }}>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      #
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {t("moduleName")}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {t("moduleType")}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {t("expiryDate")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        {
                          t(
                            "noDataFound"
                          ) 
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRows.map((row, index) => {
                      const rowStyle = getExpiryDateCellStyle(row.ExpiryDate);
                      return (
                        <TableRow
                          key={row.ModuleID}
                          sx={{
                            ...rowStyle,
                            "&:hover": { backgroundColor: "#f9fbff" },
                            transition: "background-color 0.2s",
                          }}
                        >
                          <TableCell
                            align="center"
                            sx={{
                              color: rowStyle.color,
                              fontWeight: rowStyle.fontWeight,
                            }}
                          >
                            {index + 1 + page * rowsPerPage}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              color: rowStyle.color,
                              fontWeight: rowStyle.fontWeight,
                            }}
                          >
                            {row.ModuleName}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              color: rowStyle.color,
                              fontWeight: rowStyle.fontWeight,
                            }}
                          >
                            {row.ModuleType}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              color: rowStyle.color,
                              fontWeight: rowStyle.fontWeight,
                            }}
                          >
                            {formatDateToIndianIST(row.ExpiryDate)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
              }}
            >
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={fetchZipFileData}
                sx={{
                  backgroundColor: bgColor,
                  "&:hover": { backgroundColor: bgColor },
                  textTransform: "none",
                  boxShadow: "0 4px 10px bgColor",
                }}
              >
                {t("documentZipFile")}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ElementsExpiry;
