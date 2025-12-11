

import  { useState } from "react";
import { Box, Button } from "@mui/material";
import DragAndDrop from "../../components/allpages/users/DragAndDrop";
import * as XLSX from "xlsx";
import BulkEmailListing from "./bulkEmailListing";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const BulkEmailList = ({ setSelectedData, selectedData, apiErrorMessage }) => {
  const {t} = useTranslation();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [ setFileError] = useState("");
  const [ setSuccess] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState([]);

  const handleFileUpload = (data) => {
    const file = data;
    if (!file) {
      console.error("No file selected.");
      return;
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Please upload a valid Excel file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (sheetName === "Master Data") {
          const newData = XLSX.utils.sheet_to_json(worksheet);
          setSuccess(true);
          setUploadedFile(file);
          localStorage.setItem("users", JSON.stringify(newData));
        } else {
          alert("Invalid sheet name. Please use 'Master Data'.");
        }
      } catch (error) {
        setSuccess(false);
        console.error("Error reading Excel file:", error);
        alert("Failed to read the Excel file.");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    const sampleData = [
      {
        FirstName: "John",
        LastName: "Doe",
        Email: "johndoe@example.com",
        MobileNumber: "123-456-7890",
        UnitCode: "1234",
      },
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Master Data");
    XLSX.writeFile(workbook, "sample_user_data.xlsx");
  };

  const data = JSON.parse(localStorage.getItem("users")) || [];

  const handleClear = () => {
    localStorage.removeItem("users");
    setUploadedFile(null);
    setSuccess(false);
    setSnackbarMessage([]);
  };

  return (
    <>
      {data.length > 0 ? (
        <BulkEmailListing
          excelData={data}
          setSelectedData={setSelectedData}
          selectedData={selectedData}
          apiErrorMessage={apiErrorMessage}
          onClear={handleClear} // Pass clear function to BulkEmailListing
        />
      ) : (
        <Box sx={{ margin: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              padding: "1rem",
            }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "#3B82F6",
                textTransform: "none",
                borderRadius: "8px",
              }}
              onClick={handleExport}
            >
           {t("download_sample")}
            </Button>
          </Box>
          <Box sx={{ width: "100%", padding: "1rem" }}>
            <DragAndDrop
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              setFileError={setFileError}
              handleFileUpload={handleFileUpload}
              title={t("browse")}
              resolution={t("recommended_resolution")}
              filetype={t("recommended_file_type")}
            />
          </Box>
          {snackbarMessage.length > 0 && (
            <div
              style={{
                background: "#FFE9DA",
                padding: "16px",
                gap: "6px",
                borderRadius: "8px",
                border: "1px solid #D9AA8A",
              }}
            >
              {snackbarMessage.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </div>
          )}
        </Box>
      )}
    </>
  );
};

export default BulkEmailList;

BulkEmailList.propTypes = {
  setSelectedData: PropTypes.func.isRequired,
  selectedData: PropTypes.array.isRequired,
  apiErrorMessage: PropTypes.string,
};
BulkEmailList.defaultProps = {
  apiErrorMessage: "",
};
