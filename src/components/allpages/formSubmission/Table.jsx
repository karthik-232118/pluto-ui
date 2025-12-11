import { useEffect, useState } from "react";
import {
  Typography,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { FiEye } from "react-icons/fi";
import { GetFormSubmissionApi } from "../../../services/formSubmission/FormSubmission";
import { useTranslation } from "react-i18next";

const FormSubmissionsTable = () => {
  const [formSubmissions, setFormSubmissions] = useState([]);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetFormSubmissionApi();
        setFormSubmissions(response?.data || []);
      } catch (error) {
        setError("Failed to fetch data.");
        console.error("Error fetching form submission data:", error);
      }
    };

    fetchData();
  }, []);

  const handleViewForm = (submission) => {
    console.log("View form clicked for:", submission);
    // Add functionality to handle form view
  };

  return (
    <div>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <MuiTable>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Form Name</TableCell>
              <TableCell>Master Version</TableCell>
              <TableCell>Publish Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>View Form</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {error ? (
                    <Typography variant="body2" color="error">
                      {error}
                    </Typography>
                  ) : (
                    <Typography variant="body2">{t("noDataAvailable")}</Typography>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              formSubmissions?.map((submission, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {`${submission?.UserFirstName || ""} ${
                      submission?.UserLastName || ""
                    }`}
                  </TableCell>
                  <TableCell>{submission?.FormName || "N/A"}</TableCell>
                  <TableCell>{submission?.MasterVersion || "N/A"}</TableCell>
                  <TableCell>
                    {submission?.PublishDate
                      ? new Date(submission?.PublishDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {submission?.DueDate
                      ? new Date(submission?.DueDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewForm(submission)}
                    >
                      <FiEye />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </div>
  );
};

export default FormSubmissionsTable;
