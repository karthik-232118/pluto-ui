import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetDashboardElementDetails } from "../../../store/dashboard/action";
import DownloadIcon from '@mui/icons-material/Download';
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
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const RejectedElements = () => {
  const dispatch = useDispatch();
  const elementDetails = useSelector((state) => state.dashboard.elementDetails);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(GetDashboardElementDetails({ DetailsType: "Rejected" }))
      .finally(() => setLoading(false));
  }, [dispatch]);

  const rows = elementDetails?.data || [];

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to generate and download the XLSX file
  const downloadXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows.map((row, index) => ({
      "#": index + 1,
      "Module Name": row.ModuleName,
      "Module Type": row.ModuleType,
      "Rejected Date": row.RejectedDate,
      "Version": row.DraftVersion,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rejected Elements");

    const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([xlsxData], { type: 'application/octet-stream' });
    saveAs(blob, 'rejected_elements_data.xlsx');
  };

  if (loading) {
    return <Box sx={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</Box>;
  }

  return (
    <Box sx={{ margin: "45px" }}>
      <Box
        sx={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Rejected Elements Details</h2>
        <Button
          variant="contained"
          endIcon={<DownloadIcon />}
          onClick={downloadXLSX}
          sx={{ textTransform: "none" }}
        >
          Download XLSX File
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="rejected elements table">
          <TableHead>
            <TableRow>
              <TableCell align="center">#</TableCell>
              <TableCell align="center">Module Name</TableCell>
              <TableCell align="center">Module Type</TableCell>
              <TableCell align="center">Rejected Date</TableCell>
              <TableCell align="center">Version</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={row.ModuleID}>
                <TableCell align="center">{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell align="center">{row.ModuleName}</TableCell>
                <TableCell align="center">{row.ModuleType}</TableCell>
                <TableCell align="center">{row.RejectedDate}</TableCell>
                <TableCell align="center">{row.DraftVersion}</TableCell>
              </TableRow>
            ))}
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
    </Box>
  );
};

export default RejectedElements;
