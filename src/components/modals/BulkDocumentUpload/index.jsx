import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, Divider, Alert } from "@mui/material";
import * as XLSX from "xlsx";
import moment from "moment";
import Featuredicon from "../../../assets/svg/newdoc/Featuredicon.svg";
import classes from "./css/BulkDocumentUpload.module.css";
import ActionsWrapper from "./ActionsWrapper";
import TitleWrapper from "./TitleWrapper";
import UploadedFileInfo from "./UploadedFileInfo";
import ErrorContainer from "./ErrorContainer";
import Dropzone from "./Dropzone";
import notify from "../../../assets/svg/utils/toast/Toast";
import { listProcessOwner } from "../../../services/common/common.service";
import { createBulkDocumentModule } from "../../../services/documentModules/DocumentsModule";
import PropTypes from "prop-types";

const sample = [
  {
    "Name*": "Document Name",
    Description: "Document Description",
    "Expiry (DD-MM-YYYY)": "17-01-2025",
    "Owners* (Copy owner id from Owners sheet)":
      "b4893621-339c-4dac-bb2e-629cc51ab64c,e283941c-68f5-40dd-ae7d-8d3d34b097a3",
    "Source Folder* (Start with 'Document/')": "Document/Docs",
    "File Name* (with extension)": "Risk.pdf",
    "Content hierarchy path* (Start with 'Document/')":
      "Document/Risk Analysis/Hiring",
  },
];

const keyMap = {
  "Name*": "DocumentName",
  Description: "DocumentDescription",
  "Expiry (DD-MM-YYYY)": "DocumentExpiry",
  "Owners* (Copy owner id from Owners sheet)": "DocumentOwner",
  "Source Folder* (Start with 'Document/')": "SourceFolder",
  "File Name* (with extension)": "FileName",
  "Content hierarchy path* (Start with 'Document/')": "CategoryPath",
};

const MAX_FILE_SIZE = 15;

const BulkDocumentUpload = ({ open, onClose, ModuleTypeID, fetchData }) => {
  const [loading, setLoading] = useState(false);
  const [sampleDownloadLoading, setSampleDownloadLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");
  const [processOwnerList, setProcessOwnerList] = useState([]);
  const [errorList, setErrorList] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [excelData, setExcelData] = useState([]);

  const resetState = () => {
    setLoading(false);
    setSampleDownloadLoading(false);
    setUploadedFile(null);
    setError("");
    setProcessOwnerList([]);
    setErrorList([]);
    setShowErrors(false);
    setExcelData([]);
  };
  const loadExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        try {
          const wb = XLSX.read(reader.result, { type: "binary" });
          const sheetName = wb.SheetNames[1];
          const ws = wb.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(ws, {
            raw: false,
          });

          console.log(data, "adasd");

          const formattedData = data.map((row) => {
            return {
              ...row,
              "Expiry (DD-MM-YYYY)": row["Expiry (DD-MM-YYYY)"]
                ? moment(row["Expiry (DD-MM-YYYY)"], "MM/DD/YYYY").format(
                    "DD-MM-YYYY"
                  )
                : null, 
            };
          });
          resolve(formattedData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const replaceKeys = (data) => {
    const segregratedData = [];

    data.map((item) => {
      const transformedData = {};
      Object.keys(item).forEach((key) => {
        const newKey = keyMap[key] || key;
        if (newKey === "DocumentOwner") {
          transformedData[newKey] = item[key].split(",");
        } else {
          transformedData[newKey] = item[key];
        }
      });
      segregratedData.push(transformedData);
    });

    return segregratedData;
  };

  const validateColumnErrors = (excelData) => {
    const columnErrors = [];
    const expectedColumns = new Set(Object.values(keyMap));

    excelData.forEach((item, index) => {
      const columns = Object.keys(item);

      columns.forEach((column) => {
        if (!expectedColumns.has(column)) {
          columnErrors.push(
            `Invalid column '${column}' found in row ${index + 2}`
          );
        }
      });
    });

    return columnErrors;
  };

  const processExcelData = async () => {
    setLoading(true);
    try {
      if (excelData.length === 0) {
        notify("error", "No data found in the Excel file");
        return;
      }

      const segregratedData = replaceKeys(excelData);

      const columnErrors = validateColumnErrors(segregratedData);

      if (columnErrors.length > 0) {
        setErrorList(columnErrors);
        setShowErrors(true);
        return;
      }

      const payload = {
        ModuleTypeID: ModuleTypeID,
        Documents: segregratedData,
      };

      const response = await createBulkDocumentModule(payload);
      if (response.status === 201) {
        notify("success", response?.data?.message);
        onClose();
        resetState();
        fetchData();
      } else {
        setErrorList(response?.data?.errors);
        setShowErrors(true);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle file drop
  const onDropAccepted = async (acceptedFiles) => {
    try {
      if (acceptedFiles.length > 0) {
        if (acceptedFiles.length > 1) {
          throw new Error("Only one file is allowed.");
        }
        resetState();
        const file = acceptedFiles[0];
        const data = await loadExcelFile(file);
        setUploadedFile(file);
        setError("");
        setExcelData(data);
      }
    } catch (error) {
      notify("error", "Error loading Excel file: " + error.message);
    }
  };

  const onDropRejected = (rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      resetState();

      const errorMessages = rejectedFiles.map((file) => {
        const fileName = file.file.name;
        const fileSizeMB = (file.file.size / (1024 * 1024)).toFixed(2); // Convert to MB with 2 decimal places

        if (file.errors.some((err) => err.code === "file-invalid-type")) {
          return `Unsupported file type: ${fileName}. Only .xls and .xlsx files are allowed.`;
        }
        if (file.errors.some((err) => err.code === "file-too-large")) {
          return `File size exceeds the limit for ${fileName} (${fileSizeMB} MB). The maximum size allowed is ${MAX_FILE_SIZE} MB.`;
        }
        return `Error uploading file: ${fileName}`;
      });

      setError(errorMessages.join("\n"));
      setUploadedFile(rejectedFiles[0].file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    multiple: false,
    maxSize: MAX_FILE_SIZE * 1024 * 1024,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    onDropAccepted,
    onDropRejected,
  });

  const createSampleWorkbook = (data = []) => {
    // Check if data is available
    if (data.length === 0) {
      notify("error", "No data found to create sample Excel file.");
      return;
    }

    // Prepare data with UserID and UserName in a single array of objects
    const combinedData = data.map((item) => ({
      OwnerID: item.UserID,
      UserName: item.UserName,
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Create a sheet for Owners
    const wsOwner = XLSX.utils.json_to_sheet(combinedData);
    // Append the sheet to the workbook
    XLSX.utils.book_append_sheet(wb, wsOwner, "Owners List");

    // Create a sheet for Owners
    const wsSample = XLSX.utils.json_to_sheet(sample);
    // Append the sheet to the workbook
    XLSX.utils.book_append_sheet(wb, wsSample, "Sample Document");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, "sample_bulk_document_upload.xlsx");
  };

  // Download sample Excel file
  const handleDownloadSample = async () => {
    setSampleDownloadLoading(true);
    try {
      if (processOwnerList.length === 0) {
        const response = await listProcessOwner();
        if (response.status === 200) {
          const processOwnerList = response?.data?.data?.userList || [];
          if (processOwnerList.length === 0) {
            notify("error", "No data found to create sample Excel file.");
            return;
          }
          setProcessOwnerList(processOwnerList);
          createSampleWorkbook(processOwnerList);
        } else {
          notify("error", response?.data?.message);
        }
      } else {
        createSampleWorkbook(processOwnerList);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message || error?.message);
    } finally {
      setSampleDownloadLoading(false);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <DialogContent>
        {/* Header Section */}
        <TitleWrapper
          Featuredicon={Featuredicon}
          classes={classes}
          handleDownloadSample={handleDownloadSample}
          sampleDownloadLoading={sampleDownloadLoading}
          loading={loading}
        />
        <Divider sx={{ margin: "1rem 0rem" }} />

        {/* File Upload Section */}
        {/* Uploaded File Info */}
        {uploadedFile && (
          <UploadedFileInfo
            uploadedFile={uploadedFile}
            errorList={errorList}
            showErrors={showErrors}
            setShowErrors={setShowErrors}
            classes={classes}
          />
        )}

        {!showErrors ? (
          <Dropzone
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            classes={classes}
          />
        ) : (
          showErrors &&
          errorList &&
          errorList.length > 0 && (
            <ErrorContainer errorList={errorList} classes={classes} />
          )
        )}

        {/* Show error if file type is incorrect */}
        {error && (
          <Alert severity="error" sx={{ marginTop: "1rem" }}>
            {error}
          </Alert>
        )}

        {/* Action Buttons */}
        <div className={classes["actions-wrapper"]}>
          <ActionsWrapper
            onCancel={() => {
              onClose();
              resetState();
            }}
            onUpload={processExcelData}
            loading={loading}
            error={error}
            uploadedFile={uploadedFile}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDocumentUpload;

BulkDocumentUpload.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ModuleTypeID: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
};
