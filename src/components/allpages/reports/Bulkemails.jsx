import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableCell,
  TableBody,
  Box,
  Button,
  Typography,
  Card,
  TablePagination,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetBulkEmailReports, GetCampList } from "../../../store/eSign/action";
import * as XLSX from "xlsx";
import { exportCampaing } from "../../../services/eSign/ESignModule";
import Nodata from "../../../components/allpages/masterpopups/Nodata";
import AutocompSearch from "./AutocompSearch";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";
// Utility function for formatting status
const getStatusStyle = (status) => ({
  fontWeight: "bold",
  color:
    status === "Pending"
      ? "#B42318"
      : status === "Submitted"
      ? (theme) => theme.palette.success.main
      : "#5290F7",
  backgroundColor:
    status === "Pending"
      ? "#FEF3F2"
      : status === "Submitted"
      ? "#E6F4F1"
      : "#F2F4FE",
  padding: "5px 10px",
  borderRadius: "15px",
  display: "inline-block",
});

// Function to convert data to Excel format
const convertToExcel = (data) => {
  const worksheetData = [
    [
      "First Name",
      "Last Name",
      "Status",
      "Unique Code",
      "Mobile",
      "Recipient Email",
    ],
    ...data.map((item) => [
      item.FirstName,
      item.LastName,
      item.Status ? "Submitted" : "Not Submitted",
      item.UniqueCode,
      item.Mobile,
      item.Email,
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bulk Email Reports");
  XLSX.writeFile(wb, "bulk_email_reports.xlsx");
};

const Bulkemails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { emailReports, loading } = useSelector((state) => state.esing);
  const [selectedId, setSelectedId] = useState(null);
  const bgcolor = theme.palette.primary.main;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  useEffect(() => {
    dispatch(GetCampList());
  }, [dispatch]);

  useEffect(() => {
    if (selectedId) {
      dispatch(
        GetBulkEmailReports({
          CampaignID: selectedId,
          page: page + 1, // API expects 1-based page index
          pageSize: rowsPerPage,
        })
      );
    }
  }, [dispatch, selectedId, page, rowsPerPage]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Export the data as Excel
  const handleExportReport = async () => {
    try {
      if (emailReports?.participantList?.length > 0) {
        const submittedParticipants = emailReports.participantList.filter(
          (participant) => participant.Status === "Submitted"
        );

        if (submittedParticipants.length > 0) {
          const payload = {
            CampaignID: selectedId,
          };

          const response = await exportCampaing(payload);

          if (response?.status === 200) {
            // Use the filtered list of "Submitted" participants for the export
            convertToExcel(submittedParticipants); // Exports only the "Submitted" participants
          } else {
            console.error("Failed to export report. Status:", response?.status);
            alert(t("exportFailed"));
          }
        } else {
          console.warn("No submitted data available to export.");
          alert(t("noSubmittedData"));
        }
      } else {
        console.warn("No data available to export.");
        alert(t("noDataAvailable"));
      }
    } catch (error) {
      console.error("Error exporting report:", error);
      alert(t("exportError"));
    }
  };
  return (
    <Box sx={{ margin: 4 }}>
      <Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Box>
            <Typography variant="h6">{t("bulk_email_reports")}</Typography>
            <Typography variant="caption" className="description">
              {/* List of bulk emails */}
            </Typography>
          </Box>
          <Box style={{ display: "flex", gap: "1rem" }}>
            {/* Export Button */}
          </Box>
        </Box>

        <Card>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "1rem",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Box>
              <Button
                startIcon={<GetAppIcon />}
                variant="contained"
                onClick={handleExportReport}
                sx={{
                  height: "50px",
                  marginTop: "1rem",
                  backgroundColor: bgcolor || "#2C64FF",
                }}
              >
                {t("export_report")}
              </Button>
            </Box>

            <AutocompSearch setSelectedId={setSelectedId} />
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 800,
              overflowY: "auto",
            }}
          >
            <Table>
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#fff",
                  zIndex: 1,
                }}
              >
                <TableRow>
                  <TableCell>{t("first_name")}</TableCell>
                  <TableCell>{t("last_name")}</TableCell>
                  <TableCell>{t("status")}</TableCell>
                  <TableCell>{t("unique_code")}</TableCell>
                  <TableCell>{t("mobile")}</TableCell>
                  <TableCell>{t("recipient_email")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedId !== null ? (
                  emailReports?.participantList?.length > 0 ? (
                    emailReports?.participantList?.map((user) => (
                      <TableRow key={user?.UserID}>
                        <TableCell>{user?.FirstName}</TableCell>
                        <TableCell>{user?.LastName}</TableCell>
                        <TableCell>
                          <Box sx={getStatusStyle(user?.Status)}>
                            {user?.Status}
                          </Box>
                        </TableCell>
                        <TableCell>{user?.UnitCode}</TableCell>
                        <TableCell>{user?.MobileNumber}</TableCell>
                        <TableCell>{user?.Email}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2">
                          <Nodata image={true} />
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2">
                        {t("please_select_campaign")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={emailReports?.pagination?.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            pageCount={emailReports?.pagination?.totalPages || 0}
          />
        </Card>

        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Box>
  );
};

export default Bulkemails;
