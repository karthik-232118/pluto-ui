import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableCell,
  TableBody,
  Container,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const BulkEmailListing = ({ excelData, setSelectedData, apiErrorMessage }) => {
  const { t } = useTranslation();
  // Get selected rows from localStorage
  const [selectedrows, setSelectedRows] = useState(
    JSON.parse(localStorage.getItem("selectedData")) || []
  );

  // Handle the selection of individual checkboxes
  const handleRowSelect = (user) => {
    const isSelected = selectedrows.some(
      (selectedUser) =>
        selectedUser.FirstName === user.FirstName &&
        selectedUser.LastName === user.LastName
    );

    const newSelectedRows = isSelected
      ? selectedrows.filter(
          (selectedUser) =>
            selectedUser.FirstName !== user.FirstName ||
            selectedUser.LastName !== user.LastName
        )
      : [...selectedrows, user];

    setSelectedRows(newSelectedRows);
    localStorage.setItem("selectedData", JSON.stringify(newSelectedRows));
    setSelectedData(newSelectedRows);
  };

  // Handle the "Select All"
  const handleSelectAll = () => {
    if (selectedrows.length === excelData?.length) {
      setSelectedRows([]);
      localStorage.setItem("selectedData", JSON.stringify([]));
      setSelectedData([]);
    } else {
      setSelectedRows(excelData);
      localStorage.setItem("selectedData", JSON.stringify(excelData));
      setSelectedData(excelData);
    }
  };

  // Check if all rows are selected
  const isAllSelected = selectedrows.length === excelData?.length;

  // Check if some rows are selected (for the "indeterminate" state of the Select All checkbox)
  const isSomeSelected =
    selectedrows.length > 0 && selectedrows.length < excelData?.length;

  // Check if a specific object is selected
  const isUserSelected = (user) => {
    return selectedrows.some(
      (selectedUser) =>
        selectedUser.FirstName === user.FirstName &&
        selectedUser.LastName === user.LastName
    );
  };

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isSomeSelected}
                  onChange={handleSelectAll}
                  color="primary"
                />
                {t("first_name")}
              </TableCell>
              <TableCell>{t("last_name")}</TableCell>
              <TableCell>{t("mobile_number")}</TableCell>
              <TableCell>{t("unit_code")}</TableCell>
              <TableCell>{t("recipient_email")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {excelData?.map((user) => {
              const isSelected = isUserSelected(user); // Check if this user is selected

              return (
                <TableRow
                  key={`${user.FirstName} ${user.LastName}`}
                  sx={{
                    backgroundColor: isSelected ? "lightblue" : "inherit", // Highlight selected rows
                    "&:hover": {
                      backgroundColor: isSelected ? "lightblue" : "transparent", // Hover color for selected rows
                    },
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleRowSelect(user)} // Pass the whole user object for selection
                      color="primary"
                    />
                    {user.FirstName}
                  </TableCell>
                  <TableCell>{user.LastName}</TableCell>
                  <TableCell>{user.MobileNumber}</TableCell>
                  <TableCell>{user.UnitCode}</TableCell>
                  <TableCell>{user.Email}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {apiErrorMessage && <p style={{ color: "red" }}>{apiErrorMessage}</p>}
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
          marginTop: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{ textTransform: "none" }}
          onClick={() => {
            localStorage.removeItem("users");
            localStorage.removeItem("selectedData");
            setSelectedRows([]);
            setSelectedData([]);
          }}
        >
          {t("re_upload")}
        </Button>
      </Box>
    </Container>
  );
};

export default BulkEmailListing;

BulkEmailListing.propTypes = {
  excelData: PropTypes.array.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  apiErrorMessage: PropTypes.string,
};
BulkEmailListing.defaultProps = {
  apiErrorMessage: "",
};
