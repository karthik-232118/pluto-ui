import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import * as XLSX from "xlsx";
import DragAndDrop from "./DragAndDrop";
import { AddBulkUser } from "../../../store/usermanagement/action";
import { useDispatch, useSelector } from "react-redux";
import {
  GetDepartment,
  GetRoleList,
  GetUnitlist,
} from "../../../store/enterprise/action";
import notify from "../../../assets/svg/utils/toast/Toast";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";

const UserManagement = () => {
  const { departmentlist, rolelist, unitList } = useSelector(
    (state) => state.enterprise
  );
  const { t } = useTranslation();
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;
  const [uploadedFile, setUploadedFile] = useState(null);
  const [setFileError] = useState("");
  const dispatch = useDispatch();
  const [excelData, setExcelData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState([]);

  // Generate only 4 sample users
  const generateSampleUserData = () => {
    const sampleUsers = [];
    let counter = 0;

    // Check if rolelist, unitList, and departmentlist are populated
    if (!rolelist || rolelist.length === 0) {
      notify("error", "Error: No roles available.");
      return [];
    }

    if (!unitList || unitList.length === 0) {
      notify("error", "Error: No units available.");
      return [];
    }

    if (
      !departmentlist ||
      !departmentlist.Departments ||
      departmentlist.Departments.length === 0
    ) {
      notify("error", "Error: No departments available.");
      return [];
    }

    unitList.forEach((unit) => {
      rolelist.forEach((role) => {
        departmentlist.Departments.forEach((department) => {
          if (counter < 4) {
            sampleUsers.push({
              UserName: `abc${counter}`,
              Password: "password123",
              UserFirstName: `xyz`,
              UserMiddleName: "M",
              UserLastName: `xyz`,
              UserEmail: `xyz${counter}@example.com`,
              UserPhone: "123-456-7890",
              UserAddress: "123 Main St",
              UserDateOfBirth: "1990-01-01",
              Gender: "male",
              UserType: "EndUser/Admin/ProcessOwner",
              UserEmployeeNumber: `E${Math.floor(Math.random() * 1000)}`,
              UnitName: unit?.UnitName,
              RoleName: role?.RoleName,
              DepartmentName: department?.DepartmentName,
            });
            counter++;
          }
        });
      });
    });

    return sampleUsers;
  };

  useEffect(() => {
    dispatch(GetDepartment());
    dispatch(GetRoleList());
    dispatch(GetUnitlist());
  }, [dispatch]);

  useEffect(() => {
    if (
      rolelist?.length > 0 &&
      unitList?.length > 0 &&
      departmentlist.Departments?.length > 0
    ) {
      const sampleData = generateSampleUserData();
      setExcelData({ UsersData: sampleData });
    }
  }, [rolelist, unitList, departmentlist]);

  const handleFileUpload = (data) => {
    const file = data;

    if (!file) {
      console.error("No file selected.");
      return;
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      notify("error", "Please upload a valid Excel file.");
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
          const newdata = XLSX.utils.sheet_to_json(worksheet);
          const requiredFields = [
            "UserName",
            "Password",
            "UserFirstName",
            "UserLastName",
            "UserEmail",
            "UserPhone",
            "UserDateOfBirth",
            "Gender",
            "UserType",
            "UserEmployeeNumber",
            "UnitName",
            "RoleName",
            "DepartmentName",
            "UserMiddleName",
          ];

          let allMissingMessages = [];
          let seenUsernames = new Set();
          let seenEmails = new Set();
          let seenPhoneNumbers = new Set();
          let seenEmployeeNumbers = new Set();
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          const nameRegex = /^[A-Za-z ]+$/;
          const phoneRegex = /^[0-9\s-]+$/;
          newdata.forEach((user, index) => {
            const missingFields = [];
            const userName = user.UserName || "Unknown User";
            const userEmail = user.UserEmail || "Unknown Email";
            const userPhone = user.UserPhone || "Unknown Phone";
            const userEmployeeNumber =
              user.UserEmployeeNumber || "Unknown Employee Number";
            if (seenUsernames.has(userName)) {
              allMissingMessages.push(
                `Duplicate username found: ${userName} (Line ${index + 1})`
              );
            } else {
              seenUsernames.add(userName);
            }

            if (seenEmails.has(userEmail)) {
              allMissingMessages.push(
                `Duplicate email found: ${userEmail} (Line ${index + 1})`
              );
            } else {
              seenEmails.add(userEmail);
            }

            if (seenPhoneNumbers.has(userPhone)) {
              allMissingMessages.push(
                `Duplicate phone number found: ${userPhone} (Line ${index + 1})`
              );
            } else {
              seenPhoneNumbers.add(userPhone);
            }

            if (seenEmployeeNumbers.has(userEmployeeNumber)) {
              allMissingMessages.push(
                `Duplicate employee number found: ${userEmployeeNumber} (Line ${
                  index + 1
                })`
              );
            } else {
              seenEmployeeNumbers.add(userEmployeeNumber);
            }
            requiredFields.forEach((field) => {
              if (!user[field.trim()]) {
                missingFields.push(field.trim());
              }
            });
            if (userEmail && !emailRegex.test(userEmail)) {
              allMissingMessages.push(
                `Invalid email format: ${userEmail} (Line ${index + 1})`
              );
            }

            if (userName && !nameRegex.test(userName)) {
              allMissingMessages.push(
                `Username should not contain numbers: ${userName} (Line ${
                  index + 1
                })`
              );
            }

            if (user.UserFirstName && !nameRegex.test(user.UserFirstName)) {
              allMissingMessages.push(
                `First name should not contain numbers: ${
                  user.UserFirstName
                } (Line ${index + 1})`
              );
            }

            if (user.UserLastName && !nameRegex.test(user.UserLastName)) {
              allMissingMessages.push(
                `Last name should not contain numbers: ${
                  user.UserLastName
                } (Line ${index + 1})`
              );
            }

            if (user.UserMiddleName && !nameRegex.test(user.UserMiddleName)) {
              allMissingMessages.push(
                `Middle name should not contain numbers: ${
                  user.UserMiddleName
                } (Line ${index + 1})`
              );
            }

            if (userPhone && !phoneRegex.test(userPhone)) {
              allMissingMessages.push(
                `Phone number should only contain digits, spaces, or dashes: ${userPhone} (Line ${
                  index + 1
                })`
              );
            }

            if (missingFields.length > 0) {
              const fieldsList = missingFields.join(", ");
              const message = `Missing fields: ${fieldsList} in user data for ${userName} (Line ${
                index + 1
              })`;
              allMissingMessages.push(message);
            }
          });

          if (allMissingMessages.length > 0) {
            setSnackbarMessage(allMissingMessages);
            setSuccess(false);
            return;
          }

          const validUsersData = newdata.filter(
            (user) =>
              requiredFields.every((field) => user[field.trim()]) &&
              emailRegex.test(user.UserEmail) &&
              nameRegex.test(user.UserName) &&
              (user.UserPhone ? phoneRegex.test(user.UserPhone) : true)
          );

          if (validUsersData.length !== newdata.length) {
            notify(
              "error",
              "Some users have invalid data or missing required fields."
            );
          }

          setExcelData({
            UsersData: validUsersData.map((user) => ({
              UserName: user.UserName,
              Password: user.Password,
              UserFirstName: user.UserFirstName,
              UserMiddleName: user.UserMiddleName,
              UserLastName: user.UserLastName,
              UserEmail: user.UserEmail,
              UserPhone: user.UserPhone,
              UserAddress: user.UserAddress,
              UserDateOfBirth: user.UserDateOfBirth,
              Gender: user.Gender,
              UserType: user.UserType,
              UserEmployeeNumber: user.UserEmployeeNumber,
              UnitName: user.UnitName,
              RoleName: user.RoleName,
              DepartmentName: user.DepartmentName,
              IsActive: true,
            })),
          });
          setSuccess(true);
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

  const handleUpload = async () => {
    try {
      const resultAction = await dispatch(AddBulkUser(excelData));
      if (resultAction.meta.requestStatus === "fulfilled") {
        notify("success", "Users added successfully:", resultAction.payload);
        setExcelData([]);
      } else {
        notify("error", resultAction.payload);
      }
    } catch (error) {
      notify("error", error);
    }
  };

  const handleExportUnitRoleDepartment = () => {
    const workbook = XLSX.utils.book_new();
    const jsonDataHeader = Object.keys(excelData.UsersData[0] || {});
    const jsonDataRows = excelData.UsersData.map((user) =>
      jsonDataHeader.map((key) => user[key])
    );

    const jsonDataWorksheet = XLSX.utils.aoa_to_sheet([
      jsonDataHeader,
      ...jsonDataRows,
    ]);
    XLSX.utils.book_append_sheet(workbook, jsonDataWorksheet, "Master Data");

    const dataHeader = ["Type", "Name", "Description"];
    const dataRows = [];

    unitList.forEach((unit) => {
      dataRows.push(["Unit", unit.UnitName]);
    });

    rolelist.forEach((role) => {
      dataRows.push(["Role", role.RoleName]);
    });

    departmentlist.Departments.forEach((department) => {
      dataRows.push(["Department", department.DepartmentName]);
    });

    const dataWorksheet = XLSX.utils.aoa_to_sheet([dataHeader, ...dataRows]);
    XLSX.utils.book_append_sheet(workbook, dataWorksheet, "Data");

    XLSX.writeFile(workbook, "unit_role_department_data_with_json.xlsx");
    setSnackbarMessage([]);
  };

  return (
    <div>
      <Box
        sx={{
          m: 2,
          display: "flex",
          justifyContent: "space-between",
          width: "auto",
        }}
      >
        <Box sx={{ width: "auto" }}>
          <Typography variant="h6">{t("userManagement")}</Typography>
          <Typography variant="body1" className="description">
            {t("description")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("instructions", { returnObjects: true }).map(
              (instruction, index) => (
                <div key={index}>{instruction}</div>
              )
            )}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            width: "auto",
          }}
        >
          <div>
            <Button
              variant="contained"
              style={{
                backgroundColor: bgColor,
                textTransform: "none",
                borderRadius: "8px",
              }}
              onClick={handleExportUnitRoleDepartment}
            >
              {t("download_sample")}
            </Button>
          </div>
        </Box>
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          gap: "10px",
        }}
      >
        {success ? (
          <div
            style={{
              background: "#E0E7FF",
              padding: "16px",
              gap: "6px",
              borderRadius: "8px",
              border: "1px solid #E0E7FF",
            }}
          >
            Ready To Upload
          </div>
        ) : (
          snackbarMessage?.length > 0 && (
            <div
              style={{
                background: "#FFE9DA",
                padding: "16px",
                gap: "6px",
                borderRadius: "8px",
                border: "1px solid #D9AA8A",
              }}
            >
              {snackbarMessage?.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </div>
          )
        )}
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          gap: "10px",
          width: "auto",
        }}
      >
        <Button
          variant="contained"
          style={{
            marginRight: "1rem",
            backgroundColor: bgColor,
            textTransform: "none",
            borderRadius: "8px",
            color: "white",
          }}
          onClick={handleUpload}
          disabled={!success}
        >
          {t("uploadButton")}
        </Button>
      </Box>
    </div>
  );
};

export default UserManagement;
