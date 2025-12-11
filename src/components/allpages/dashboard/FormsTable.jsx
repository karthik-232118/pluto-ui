import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/styles";
import PropTypes from "prop-types";

const StatusChip = styled("div")(({ status }) => ({
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: "8px",
  fontWeight: 500,
  fontSize: "14px",
  border: `1px solid ${status === "Pending" ? "#EF6C00" : "#2E7D32"}`,
  backgroundColor:
    status === "Pending" ? "rgba(255, 152, 0, 0.1)" : "rgba(76, 175, 80, 0.1)",
  color: status === "Pending" ? "#EF6C00" : "#2E7D32",
  textAlign: "center",
}));

const FormsTable = ({ dynamicDashboardData }) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Handle page change
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Get form data from dynamic dashboard data
  const formData = dynamicDashboardData?.data?.FormData || [];
  const currentData = formData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(formData.length / rowsPerPage);

  return (
    <Card
      sx={{
        borderRadius: "12px",
        background: "linear-gradient(to right, #f8f6fc, #f8f6fc)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        padding: "1rem 0",
      }}
    >
      <Box sx={{ padding: "0 1rem" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          Forms
        </Typography>
        <Typography variant="body2" sx={{ color: "#A6A9AC", mb: 2 }}>
          Overview of latest month
        </Typography>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          {/* Table Header */}
          <TableHead>
            <TableRow
              sx={{
                borderBottom: "2px solid #ccc",
                borderTop: "2px solid #ccc",
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 600,
                  background: "#fff",
                  borderBottom: "none",
                  borderTop: "2px solid #ccc",
                  color: "rgba(0, 0, 0, 0.6)",
                }}
              >
                FORM NAME
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 600,
                  background: "#fff",
                  borderBottom: "none",
                  borderTop: "2px solid #ccc",
                  color: "rgba(0, 0, 0, 0.6)",
                }}
              >
                STATUS
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {currentData.map((row, index) => (
              <TableRow
                key={row.FormID || index}
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  borderBottom: "1px solid #ccc",
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ borderBottom: "1px solid #ccc" }}
                >
                  {row.FormName}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ borderBottom: "1px solid #ccc" }}
                >
                  <StatusChip
                    status={row.IsSubmitted ? "Completed" : "Pending"}
                  >
                    {row.IsSubmitted ? "Completed" : "Pending"}
                  </StatusChip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          padding: "0 1rem",
        }}
      >
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          &larr; Previous
        </Button>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          shape="rounded"
          color="primary"
        />
        <Button
          variant="outlined"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next &rarr;
        </Button>
      </Box>
    </Card>
  );
};

export default FormsTable;

FormsTable.propTypes = {
  dynamicDashboardData: PropTypes.shape({
    data: PropTypes.shape({
      FormData: PropTypes.arrayOf(
        PropTypes.shape({
          FormID: PropTypes.string,
          FormName: PropTypes.string,
          IsSubmitted: PropTypes.bool,
        })
      ),
    }),
  }).isRequired,
};
