import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Divider,
  Grid,
  Snackbar,
} from "@mui/material";
import { ArrowDownward, ArrowUpward, Search } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllUserApi,
  GetSearchUser,
  GetUpdateUserApi,
  deletUser,
} from "../../../store/usermanagement/action";
import "./Users.css";
import DeleteConfirmationPopup from "../masterpopups/DeleteConfirmationPopup";
import { toast } from "react-toastify";
import plus from "../../../assets/svg/uesrmanagement/plus.svg";
import deleteIcon from "../../../assets/svg/uesrmanagement/delete.svg";
import editIcon from "../../../assets/svg/uesrmanagement/edit.svg";
import EditUserDialog from "./EditUserDialog";
import { GetLicenseKeyDetails } from "../../../store/licensekeymanagement/action";
import NewUserForm from "./NewUserForm";
import { AllInclusive } from "@mui/icons-material";
import Nodata from "../masterpopups/Nodata";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import AccessDenied from "../../accessDenied/AccessDenied";

const getStatusStyle = (status) => ({
  color: status ? "#027A48" : "#B42318",
  backgroundColor: status ? "#ECFDF3" : "#FEF3F2",
  padding: "5px 10px",
  borderRadius: "15px",
  display: "inline-block",
});

const UsersManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getalluser, searchResults } = useSelector(
    (state) => state.getalluser
  );
  const [editData, setEditData] = useState(null);
  const [deletedata, setDeletedata] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [Alert, setAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openNewUserForm, setOpenNewUserForm] = useState(false);
  const [limitReachedMessage, setLimitReachedMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const licensekeydetails = useSelector(
    (state) => state?.licensekeydetails?.licensekeydetails
  );
  
  useEffect(() => {
    dispatch(GetLicenseKeyDetails());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    dispatch(GetAllUserApi());
  };
  const handleEditClick = (user) => {
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    setEditData({
      ...user,
      UserType: user.UserType || "",
      UserName: `${user.UserName}`,
      UserDateOfBirth: formatDate(user.UserDateOfBirth),
      UserPhoto: user.UserPhoto || "",
      IsActive: user.IsActive,
    });
    setOpenEditDialog(true);
  };

  const handleUpdateUser = async () => {
    if (editData) {
      if (
        !editData.UserDateOfBirth ||
        !editData.Gender ||
        !editData.UserEmployeeNumber ||
        !editData.UserPhoneNumber ||
        !editData.UserAddress
      ) {
        alert(
          "Please fill in all required fields: Date of Birth, Gender, Employee Number, Phone Number, and Address"
        );
        return;
      }
      const payload = {
        UserID: editData.UserID,
        IsActive: true,
        UserFirstName: editData.UserFirstName || "",
        UserLastName: editData.UserLastName || "",
        UserMiddleName: editData.UserMiddleName || "",
        UserEmail: editData.UserEmail || "",
        UserPhoneNumber: editData.UserPhoneNumber,
        UserAddress: editData.UserAddress,
        UserDateOfBirth: editData.UserDateOfBirth,
        Gender: editData.Gender,
        UserPhoto: editData.UserPhoto || "",
        UserEmployeeNumber: editData.UserEmployeeNumber,
        UserSupervisorID: editData.UserSupervisorID || null,
        UserType: editData.UserType || "",
        UserName: editData.UserName || "",
        IsContentAndmin: editData.IsContentAndmin || false,
        Password: editData.Password,
        ...(editData.UserSiganture
          ? { UserSiganture: editData.UserSiganture }
          : {}),
      };
      try {
        await dispatch(GetUpdateUserApi(payload));

        const updatedUsers = getalluser?.data.map((user) =>
          user.UserID === editData.UserID ? { ...user, ...editData } : user
        );
        dispatch({ type: "UPDATE_USERS_LIST", payload: updatedUsers });
        setOpenEditDialog(false);
      } catch (error) {
        console.error("Failed to update user:", error);
        toast.success("updated successfully");
      }
    }
  };
  const onConfirm = () => {
    const payload = {
      UserID: deletedata?.UserID,
    };
    dispatch(deletUser(payload));
    setAlert(false);
  };
  const handleChange = () => {
    setEditData({
      ...editData,
      IsActive: !editData.IsActive,
    });
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    const payload = {
      SearchQuery: value,
    };
    dispatch(GetSearchUser(payload));
  };
  const handleOpenNewUserForm = () => {
    const processOwnerCount =
      licensekeydetails?.data?.NumberOfProcessOwnerUsers || 0;
    if (-7 >= processOwnerCount) {
      setLimitReachedMessage(
        "You have reached the maximum limit for Process Owners."
      );
      setSnackbarMessage("Limit reached for Process Owners.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else {
      setOpenNewUserForm(true);
      setLimitReachedMessage("");
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCloseNewUserForm = () => {
    setOpenNewUserForm(false);
    fetchData();
  };

  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedData = (data) => {
    if (!sortConfig.key || sortConfig.direction === "") return data;
    return [...data].sort((a, b) => {
      const valA = a[sortConfig.key] || "";
      const valB = b[sortConfig.key] || "";
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const usersData = sortedData(searchResults?.data || getalluser?.data || []);

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    if (sortConfig.direction === "asc") {
      return <ArrowUpward fontSize="small" />;
    }
    return <ArrowDownward fontSize="small" />;
  };

  const userType = localStorage.getItem("user_type");
  if (userType === "EndUser" || userType === "ProcessOwner") {
    return <AccessDenied />;
  }

  const handleOpenOrgTree = () => {
    navigate("/enterprisetree");
  };

  return (
    <Box style={{ margin: "25px" }}>
      <Box
        sx={{ mb: 2 }}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h6">{t("userManagement")}</Typography>
          <Typography variant="body1" className="description">
            {t("description")}
          </Typography>
        </Box>
        <Box
          className="grid-container"
          style={{ display: "flex", gap: "20px" }}
        >
          <Grid className="gridone">
            <div className="grid-content">
              <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>
                {licensekeydetails?.data?.AdminUserAdded || 0}
              </p>
              <p style={{ margin: "0", fontSize: "10px" }}>
                of {licensekeydetails?.data?.NumberOfAdminUsers || 0} users
                {licensekeydetails?.data?.PerpetualAdminUser && (
                  <AllInclusive
                    fontSize="small"
                    style={{ marginLeft: "5px" }}
                  />
                )}
              </p>
              <p style={{ margin: "0", fontSize: "14px", fontWeight: "bold" }}>
                Admin
              </p>
            </div>
          </Grid>
          <Grid className="gridtwo">
            <div className="grid-content">
              <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>
                {licensekeydetails?.data?.ProcessOwnerUserAdded || 0}
              </p>
              <p style={{ margin: "0", fontSize: "10px" }}>
                of {licensekeydetails?.data?.NumberOfProcessOwnerUsers || 0}{" "}
                users
                {licensekeydetails?.data?.PerpetualProcessOwner && (
                  <AllInclusive
                    fontSize="small"
                    style={{ marginLeft: "5px" }}
                  />
                )}
              </p>
              <p style={{ margin: "0", fontSize: "14px", fontWeight: "bold" }}>
                Power Users
              </p>
            </div>
          </Grid>
          <Grid className="gridthree">
            <div className="grid-content">
              <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>
                {licensekeydetails?.data?.EndUserAdded || 0}
              </p>
              <p style={{ margin: "0", fontSize: "10px" }}>
                of {licensekeydetails?.data?.NumberOfEndUsers || 0} users
                {licensekeydetails?.data?.PerpetualEndUser && (
                  <AllInclusive
                    fontSize="small"
                    style={{ marginLeft: "5px" }}
                  />
                )}
              </p>
              <p style={{ margin: "0", fontSize: "14px", fontWeight: "bold" }}>
                End users
              </p>
            </div>
          </Grid>
          <Grid className="gridfour">
            <div className="grid-content">
              <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>
                {licensekeydetails?.data?.AuditorUserAdded || 0}
              </p>
              <p style={{ margin: "0", fontSize: "10px" }}>
                of {licensekeydetails?.data?.NumberOfAuditorUsers || 0} users
                {licensekeydetails?.data?.PerpetualAuditorUser && (
                  <AllInclusive
                    fontSize="small"
                    style={{ marginLeft: "5px" }}
                  />
                )}
              </p>
              <p style={{ margin: "0", fontSize: "14px", fontWeight: "bold" }}>
                Auditor
              </p>
            </div>
          </Grid>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <div>
            <Button
              variant="contained"
              style={{
                textTransform: "none",
                borderRadius: "8px",
              }}
              onClick={() => {
                navigate("/bulk-user-management");
              }}
            >
              {t("bulkUser")}
              <span>
                <img
                  src={plus}
                  alt=""
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "8px",
                  }}
                />
              </span>
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              style={{
                textTransform: "none",
                borderRadius: "8px",
              }}
              onClick={handleOpenNewUserForm}
            >
              {t("newUser")}{" "}
              <span>
                <img
                  src={plus}
                  alt=""
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "8px",
                  }}
                />
              </span>
            </Button>
          </div>
          <div>
            {/* <Button
              variant="contained"
              style={{
                textTransform: "none",
                borderRadius: "8px",
              }}
             onClick={handleOpenOrgTree}
            >
              view organization Tree
             
            </Button> */}
          </div>
        </Box>
      </Box>
      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      >
        {/* Heading and Search */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Search Box with Icons */}
          <Box sx={{ display: "flex", gap: "10px" }}>
            <TextField
              placeholder={t("search")}
              value={searchQuery} // Controlled input
              onChange={handleSearchChange} // Handle input change
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "250px",
                height: "44px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  borderColor: "#D0D5DD",
                  height: "44px",
                  "& fieldset": {
                    borderColor: "#D0D5DD",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D0D5DD",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#D0D5DD",
                  },
                },
              }}
            />
          </Box>
        </Box>
        <Divider sx={{ marginTop: 2 }} />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              x
            </IconButton>
          }
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        />

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
                <TableCell onClick={() => handleSort("UserEmployeeNumber")}>
                  {t("empId")}
                  {renderSortIcon("UserEmployeeNumber")}
                </TableCell>
                <TableCell onClick={() => handleSort("UserFirstName")}>
                  {t("employees")} {renderSortIcon("UserFirstName")}
                </TableCell>
                <TableCell onClick={() => handleSort("UserType")}>
                  {t("userType")} {renderSortIcon("UserType")}
                </TableCell>
                <TableCell onClick={() => handleSort("DepartmentName")}>
                  {t("department")} {renderSortIcon("DepartmentName")}
                </TableCell>
                <TableCell onClick={() => handleSort("UserEmail")}>
                  {t("emailId")} {renderSortIcon("UserEmail")}
                </TableCell>
                <TableCell onClick={() => handleSort("UserPhoneNumber")}>
                  {t("contactNo")} {renderSortIcon("UserPhoneNumber")}
                </TableCell>
                <TableCell onClick={() => handleSort("Status")}>
                  {t("status")} {renderSortIcon("Status")}
                </TableCell>
                <TableCell> {t("userSignature")}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData.length > 0 ? (
                usersData
                  .filter((rec) => rec.UserType !== "Admin")
                  .map((user) => (
                    <TableRow key={user.UserID}>
                      <TableCell>{user.UserEmployeeNumber || "N/A"}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <Avatar
                            alt={user.UserFirstName || "User"}
                            src={
                              user.UserPhoto ||
                              `https://i.pravatar.cc/150?u=${user.UserID}`
                            }
                          />
                          {user.UserFirstName || "No Name"}
                        </Box>
                      </TableCell>
                      <TableCell>{user.UserType}</TableCell>
                      <TableCell>{user.DepartmentName || "N/A"}</TableCell>
                      <TableCell>{user.UserEmail || "No Email"}</TableCell>
                      <TableCell>
                        {user.UserPhoneNumber || "No Phone"}
                      </TableCell>
                      <TableCell>
                        <Box sx={getStatusStyle(user?.IsActive)}>
                          {user?.IsActive ? t("active") : t("inactive")}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={getStatusStyle(user?.UserSiganture)}>
                          {user?.UserSiganture ? "E-Sign" : "No E-Sign"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(user)}>
                          <img src={editIcon} alt="edit" />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setDeletedata(user);
                            setAlert(true);
                          }}
                        >
                          <img src={deleteIcon} alt="delete" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Nodata image={true} height={500} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <EditUserDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          editData={editData}
          setEditData={setEditData}
          handleUpdateUser={handleUpdateUser}
          handleChange={handleChange}
        />
        <DeleteConfirmationPopup
          open={Alert}
          onClose={() => {
            setAlert(!Alert);
          }}
          onConfirm={() => {
            onConfirm();
          }}
          title={t("deleteModal.deleteConfirmation")}
        />
      </Box>

      <NewUserForm open={openNewUserForm} onClose={handleCloseNewUserForm} />
    </Box>
  );
};
export default UsersManagement;
