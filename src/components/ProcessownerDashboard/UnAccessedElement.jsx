import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetDashboardElementDetails } from "../../store/dashboard/action";
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
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";

const UnAccessedElement = () => {
  const dispatch = useDispatch();
  const elementDetails = useSelector((state) => state.dashboard.elementDetails);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(GetDashboardElementDetails({ DetailsType: "Unaccessed" })).finally(
      () => setLoading(false)
    );
  }, [dispatch]);

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

  const downloadXLS = () => {
    console.log("Download XLS file", rows);
    const worksheet = XLSX.utils.json_to_sheet(rows); 
    const workbook = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(workbook, worksheet, "Unaccessed Elements");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xls",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/vnd.ms-excel" }); 
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Docs.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>Loading...</Box>
    );
  }

  const formatDate = (date) => {
    if (!date) return "-"; 
    return new Date(date).toLocaleDateString();
  };

  return (
    <Box sx={{ margin: "45px" }}>
      <Box
        sx={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>UnAccessed Elements</h2>
        <Button
          variant="contained"
          endIcon={<DownloadIcon />}
          onClick={downloadXLS} 
          sx={{ textTransform: "none" }}
        >
          Download XLSX File
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="unaccessed elements table">
          <TableHead>
            <TableRow>
              <TableCell align="center">#</TableCell>
              <TableCell align="center">Module Type</TableCell>
              <TableCell align="center">Module Name</TableCell>
              <TableCell align="center">Start Date</TableCell>
              <TableCell align="center">Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={row.ModuleID}>
                <TableCell align="center">
                  {index + 1 + page * rowsPerPage}
                </TableCell>
                <TableCell align="center">{row.ModuleType}</TableCell>
                <TableCell align="center">{row.ModuleName}</TableCell>
                <TableCell align="center">
                  {formatDate(row.StartDate)}
                </TableCell>
                <TableCell align="center">{formatDate(row.DueDate)}</TableCell>
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

export default UnAccessedElement;
