import { useState } from "react";
import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Pagination,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PropTypes from "prop-types";
const QuickView = ({ dynamicDashboardData }) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const documentData = dynamicDashboardData?.data?.DocumentList || [];
  const currentData = documentData.slice(startIndex, startIndex + rowsPerPage);
  return (
    <Card
      sx={{
        borderRadius: "12px",
        background: "linear-gradient(to right, #f8f6fc, #f8f6fc)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        padding: "1rem 0",
      }}
    >
      <>
        <Box sx={{ padding: "0rem 1rem" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Quick View Documents
          </Typography>
          <Typography variant="body2" sx={{ color: "#A6A9AC", mb: 2 }}>
            Overview of latest month
          </Typography>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  borderTop: "2px solid #ddd",
                  borderBottom: "2px solid #ddd",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 600,
                    background: "#fff",
                    borderBottom: "none",
                    color: "rgba(0, 0, 0, 0.6)",
                  }}
                >
                  DOCUMENT NAME
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    background: "#fff",
                    borderBottom: "none",
                    color: "rgba(0, 0, 0, 0.6)",
                  }}
                >
                  ACTION
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((row) => (
                <TableRow
                  key={row.DocumentID}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <TableCell>{row.DocumentName}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityOutlinedIcon />}
                      sx={{
                        textTransform: "none",
                        borderRadius: "20px",
                        borderColor: "#ccc",
                      }}
                    >
                      View
                    </Button>
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
            padding: "0rem 1rem",
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
            count={Math.ceil(documentData.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            shape="rounded"
            color="primary"
          />
          <Button
            variant="outlined"
            disabled={page === Math.ceil(documentData.length / rowsPerPage)}
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, Math.ceil(documentData.length / rowsPerPage))
              )
            }
          >
            Next &rarr;
          </Button>
        </Box>
      </>
    </Card>
  );
};

export default QuickView;

QuickView.propTypes = {
  dynamicDashboardData: PropTypes.shape({
    data: PropTypes.shape({
      DocumentList: PropTypes.arrayOf(
        PropTypes.shape({
          DocumentID: PropTypes.string.isRequired,
          DocumentName: PropTypes.string.isRequired,
        })
      ),
    }),
  }),
};
