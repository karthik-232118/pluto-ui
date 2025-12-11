import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormGroup,
  InputBase,
  Checkbox,
  CircularProgress,
  FormHelperText,
  Autocomplete,
  useTheme,
  IconButton,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import {
  Assignment,
  Search as SearchIcon,
  Close,
  CalendarToday,
  People,
  AccountTree,
  VerifiedUser,
  Draw,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import {
  listDepartment,
  listRole,
} from "../../../services/elementAssignment/ElementAssignment";
import { listEndUser } from "../../../services/documentModules/DocumentsModule";
import { listGroupApi } from "../../../services/groupManagement/GroupManagement";
import notify from "../../../assets/svg/utils/toast/Toast";
import { AssignChartToUserAPI } from "../../../services/dashboardBuilder/DashboardBuilder";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AssignModal = ({ open, onClose, selectedItems, clearCheckbox }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;
  const [chartID, setChartID] = useState("");
  const [selectedUserListIds, setSelectedUserListIds] = useState([""]);
  console.log(chartID, "usesateIDss");
  // console.log(selectedUserListIds, "selectedUserListIdsconsole");
  useEffect(() => {
    const ids = selectedItems.map((item) => item.id);
    console.log("IDspoda venna:", ids);
    setChartID(ids);
  }, [selectedItems]);

  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isAllDepartmentsSelected, setIsAllDepartmentsSelected] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isAllRolesSelected, setIsAllRolesSelected] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [checkers, setCheckers] = useState([]);
  const [signatories, setSignatories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [processOwnerAndEndUserList, setProcessOwnerAndEndUserList] = useState([]);
  const [elementsData, setElementsData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({
    startDate: false,
    dueDate: false,
    departmentOrRole: false,
    checkers: false,
    signatories: false,
  });
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLoading, setIsLoading] = useState({
    departments: false,
    roles: false,
    groups: false,
    users: false,
  });

  const fetchDepartments = async () => {
    setIsLoading((prev) => ({ ...prev, departments: true }));
    try {
      const response = await listDepartment();
      if (response?.status === 200) {
        setDepartments(response?.data?.data?.departmentList || []);
      } else {
        notify("error", "Failed to fetch departments");
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      notify(
        "error",
        error?.response?.data?.message || "Failed to fetch departments"
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, departments: false }));
    }
  };

  const fetchRoles = async () => {
    setIsLoading((prev) => ({ ...prev, roles: true }));
    try {
      const response = await listRole();
      if (response?.status === 200) {
        setRoles(response?.data?.data?.roleList || []);
      } else {
        notify("error", "Failed to fetch roles");
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      notify(
        "error",
        error?.response?.data?.message || "Failed to fetch roles"
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, roles: false }));
    }
  };

  const fetchGroups = async () => {
    setIsLoading((prev) => ({ ...prev, groups: true }));
    try {
      const response = await listGroupApi({});
      if (response?.status === 200) {
        setGroups(response?.data || []);
      } else {
        console.log("Error fetching groups:", response);
        notify("error", "Failed to fetch groups");
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      notify(
        "error",
        error?.response?.data?.message || "Failed to fetch groups"
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, groups: false }));
    }
  };

  const fetchProcessOwnersAndEndUsers = async () => {
    setIsLoading((prev) => ({ ...prev, users: true }));
    try {
      const response = await listEndUser();
      console.log("listEndUserresponseddd:", response?.data?.data?.userList?.slice(0, 10));
      if (response?.status === 200) {
        setProcessOwnerAndEndUserList(response?.data?.data?.userList || []);
      } else {
        notify("error", "Failed to fetch users");
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      notify(
        "error",
        error?.response?.data?.message || "Failed to fetch users"
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, users: false }));
    }
  };

  useEffect(() => {
    if (open) {
      fetchDepartments();
      fetchRoles();
      fetchGroups();
      fetchProcessOwnersAndEndUsers();
    }
  }, [open]);

  useEffect(() => {
    if (selectedItems?.length) {
      const data = selectedItems.map((item) => {
        const moduleName = `${item?.ModuleName}Name` || "title";
        const moduleID = `${item?.ModuleName}ID` || "id";
        console.log(moduleID, "testttinggngngng");
        const name =
          item?.ContentName ||
          item[moduleName] ||
          item.title ||
          `Item ${item.id}`;
        return {
          itemName: name,
          name:
            item?.ModuleName ||
            item?.ModuleMaster?.ModuleName ||
            item.type?.name ||
            "Dashboard",
          ModuleTypeID: item?.ModuleTypeID || item.type?.id || null,
          data: item[moduleID] || item?.ContentID || item.id || [],
        };
      });
      setElementsData(data);

      const initialCheckedItems = {};
      data.forEach((item) => {
        initialCheckedItems[item.data] = true;
      });
      setCheckedItems(initialCheckedItems);
    }
  }, [selectedItems]);

  const handleCheckChange = (itemData) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [itemData]: !prevCheckedItems[itemData],
    }));
  };

  const getDepartmentNameById = (id) => {
    const department = departments.find((dept) => dept.DepartmentID === id);
    return department ? department.DepartmentName : "";
  };

  const handleDepartmentChange = (event) => {
    const value = event.target.value;
    if (value.includes("All Departments")) {
      const allDepartmentIDs = departments.map((dept) => dept.DepartmentID);
      setSelectedDepartments(allDepartmentIDs);
      setIsAllDepartmentsSelected(true);
    } else {
      setSelectedDepartments(
        value.filter((deptID) => deptID !== "All Departments")
      );
      setIsAllDepartmentsSelected(false);
    }
    if (value.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, departmentOrRole: false }));
    }
  };

  const handleDeleteDepartment = (deptID) => {
    if (deptID === "All Departments") {
      setSelectedDepartments([]);
      setIsAllDepartmentsSelected(false);
    } else {
      setSelectedDepartments((prev) =>
        prev.filter((selectedDeptID) => selectedDeptID !== deptID)
      );
    }
  };

  const getRoleNameById = (id) => {
    const role = roles.find((role) => role.RoleID === id);
    return role ? role.RoleName : "";
  };

  const handleRoleChange = (event) => {
    const value = event.target.value;
    if (value.includes("All Roles")) {
      const allRoleIDs = roles.map((role) => role.RoleID);
      setSelectedRoles(allRoleIDs);
      setIsAllRolesSelected(true);
    } else {
      setSelectedRoles(value.filter((roleID) => roleID !== "All Roles"));
      setIsAllRolesSelected(false);
    }
    if (value.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, departmentOrRole: false }));
    }
  };

  const handleDeleteRole = (roleID) => {
    if (roleID === "All Roles") {
      setSelectedRoles([]);
      setIsAllRolesSelected(false);
    } else {
      setSelectedRoles((prev) =>
        prev.filter((selectedRoleID) => selectedRoleID !== roleID)
      );
    }
  };

  const onDateChange = (value, type) => {
    const formattedDate = new Date(value).toISOString().slice(0, 10);
    if (type === "start") {
      setStartDate(formattedDate);
      setErrors((prevErrors) => ({ ...prevErrors, startDate: false }));
    } else {
      setDueDate(formattedDate);
      setErrors((prevErrors) => ({ ...prevErrors, dueDate: false }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      startDate: false,
      dueDate: false,
      departmentOrRole: false,
      checkers: false,
      signatories: false,
    };

    if (!startDate) {
      newErrors.startDate = true;
      isValid = false;
    }

    if (!dueDate) {
      newErrors.dueDate = true;
      isValid = false;
    }

    if (
      selectedDepartments.length === 0 &&
      selectedRoles.length === 0 &&
      selectedGroups.length === 0
    ) {
      newErrors.departmentOrRole = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatPayload = () => {
    const filteredElements = elementsData.filter(
      (item) => checkedItems[item.data]
    );
    const chartData = filteredElements.map((item, index) => ({
      ChartID: item.data, 
      SequenceNumber: index + 1, 
    }))
    const userIDs = selectedUserListIds;
    const payload = {
      ChartData: chartData,
      UserIDs: userIDs,
      StartDate: startDate,
      DueDate: dueDate,
      RoleID: selectedRoles.length > 0 ? selectedRoles[0] : null, 
      DepartmentID:
        selectedDepartments.length > 0 ? selectedDepartments[0] : null, 
    };

    return payload;
  };

  const handleAssign = async () => {
    if (!validateForm()) {
      return;
    }
    setIsAssigning(true)
    try {
      const data = formatPayload();
      const response = await AssignChartToUserAPI(data);
      if (response?.status === 200) {
        notify(
          "success",
          response?.data?.message || "Element Assigned successfully"
        );
        onClose();
        if (clearCheckbox) clearCheckbox();
        setCheckers([]);
        setSignatories([]);
      } else {
        notify("error", response?.data?.message || "Failed to assign element");
      }
    } catch (error) {
      console.error("Assignment failed:", error);
      notify("error", error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedDepartments([]);
    setSelectedRoles([]);
    setSelectedGroups([]);
    setCheckers([]);
    setSignatories([]);
    setStartDate(null);
    setDueDate(null);
    setErrors({
      startDate: false,
      dueDate: false,
      departmentOrRole: false,
      checkers: false,
      signatories: false,
    });
  };

  const filteredElements = elementsData.filter((content) =>
    content?.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
            padding: "20px 24px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            color: "#fff",
            position: "relative",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Assignment sx={{ mr: 2, fontSize: 28 }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, letterSpacing: "0.5px" }}
              >
                {t("assign") || "Assign Dashboard"}
              </Typography>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box display="flex" gap={4}>
            {/* Left Panel - Selected Elements */}
            <Card
              sx={{
                width: "40%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                borderRadius: "12px",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <AccountTree sx={{ mr: 1, color: "#000" }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#000" }}
                  >
                    {t("selectedElements") || "Selected Elements"}
                  </Typography>
                </Box>

                <Paper
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    height: "45px",
                    padding: "0px 16px",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                    mb: 2,
                    "&:hover": {
                      borderColor: bgColor,
                    },
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <SearchIcon sx={{ marginRight: "12px", color: "#6c757d" }} />
                  <InputBase
                    placeholder={t("search") || "Search elements..."}
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ color: "#495057", fontSize: "14px" }}
                  />
                </Paper>

                <Box sx={{ maxHeight: "200px", overflowY: "auto", mb: 3 }}>
                  {filteredElements.map((content, index) => (
                    <Paper
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        mb: 1,
                        borderRadius: "8px",
                        backgroundColor: checkedItems[content.data]
                          ? `${bgColor}10`
                          : "#fff",
                        border: checkedItems[content.data]
                          ? `1px solid ${bgColor}40`
                          : "1px solid #e9ecef",
                        "&:hover": {
                          backgroundColor: `${bgColor}08`,
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {content.itemName}
                      </Typography>
                      <Checkbox
                        color="primary"
                        checked={checkedItems[content.data] || false}
                        onChange={() => handleCheckChange(content.data)}
                        sx={{
                          "&.Mui-checked": {
                            color: bgColor,
                          },
                        }}
                      />
                    </Paper>
                  ))}
                </Box>

                <Box display="flex" gap={2}>
                  <FormGroup sx={{ flex: 1 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <CalendarToday
                        sx={{ mr: 1, color: "#000", fontSize: 20 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#000" }}
                      >
                        {t("chooseStartDate") || "Start Date"} *
                      </Typography>
                    </Box>
                    <TextField
                      type="date"
                      size="small"
                      value={startDate || ""}
                      onChange={(e) => onDateChange(e.target.value, "start")}
                      InputProps={{
                        inputProps: {
                          min: new Date().toISOString().split("T")[0],
                        },
                        sx: {
                          borderRadius: "8px",
                        },
                      }}
                      error={errors.startDate}
                      helperText={
                        errors.startDate
                          ? t("startDateRequired") || "Start date is required"
                          : ""
                      }
                      fullWidth
                    />
                  </FormGroup>

                  <FormGroup sx={{ flex: 1 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <CalendarToday
                        sx={{ mr: 1, color: "#000", fontSize: 20 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#000" }}
                      >
                        {t("chooseDueDate") || "Due Date"} *
                      </Typography>
                    </Box>
                    <TextField
                      type="date"
                      size="small"
                      value={dueDate || ""}
                      onChange={(e) => onDateChange(e.target.value, "due")}
                      InputProps={{
                        inputProps: {
                          min:
                            startDate || new Date().toISOString().split("T")[0],
                        },
                        sx: {
                          borderRadius: "8px",
                        },
                      }}
                      error={errors.dueDate}
                      helperText={
                        errors.dueDate
                          ? t("dueDateRequired") || "Due date is required"
                          : ""
                      }
                      fullWidth
                    />
                  </FormGroup>
                </Box>
              </CardContent>
            </Card>

            {/* Right Panel - Assignment Options */}
            <Card
              sx={{
                width: "60%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                borderRadius: "12px",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 500, color: "#000", mb: 2 }}
                >
                  Assignment Configuration
                </Typography>

                {/* Departments */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <People sx={{ mr: 1, color: "#000", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#000" }}
                    >
                      {t("selectDepartments") || "Select Departments"} *
                    </Typography>
                    {isLoading.departments && (
                      <CircularProgress
                        size={16}
                        sx={{ ml: 1, color: bgColor }}
                      />
                    )}
                  </Box>
                  <Select
                    multiple
                    value={
                      isAllDepartmentsSelected
                        ? ["All Departments"]
                        : selectedDepartments
                    }
                    onChange={handleDepartmentChange}
                    input={<OutlinedInput sx={{ borderRadius: "8px" }} />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {isAllDepartmentsSelected ? (
                          <Chip
                            key="all"
                            label={t("allDepartments") || "All Departments"}
                            size="small"
                            sx={{
                              backgroundColor: `${bgColor}15`,
                              color: bgColor,
                              fontWeight: 500,
                            }}
                          />
                        ) : (
                          selected.map((value) => (
                            <Chip
                              key={value}
                              label={getDepartmentNameById(value)}
                              size="small"
                              onDelete={() => handleDeleteDepartment(value)}
                              deleteIcon={<Close />}
                              sx={{
                                backgroundColor: `${bgColor}15`,
                                color: bgColor,
                                fontWeight: 500,
                              }}
                            />
                          ))
                        )}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="All Departments">
                      {t("allDepartments") || "All Departments"}
                    </MenuItem>
                    {departments.map((dept) => (
                      <MenuItem
                        key={dept.DepartmentID}
                        value={dept.DepartmentID}
                      >
                        {dept.DepartmentName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.departmentOrRole && (
                    <FormHelperText error>
                      {t("atLeastOneDepartmentOrRole") ||
                        "At least one department, role, or group is required"}
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Roles */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <VerifiedUser sx={{ mr: 1, color: "#000", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#000" }}
                    >
                      {t("selectRoles") || "Select Roles"} *
                    </Typography>
                    {isLoading.roles && (
                      <CircularProgress
                        size={16}
                        sx={{ ml: 1, color: bgColor }}
                      />
                    )}
                  </Box>
                  <Select
                    multiple
                    value={isAllRolesSelected ? ["All Roles"] : selectedRoles}
                    onChange={handleRoleChange}
                    input={<OutlinedInput sx={{ borderRadius: "8px" }} />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {isAllRolesSelected ? (
                          <Chip
                            key="all"
                            label={t("allRoles") || "All Roles"}
                            size="small"
                            sx={{
                              backgroundColor: `${bgColor}15`,
                              color: bgColor,
                              fontWeight: 500,
                            }}
                          />
                        ) : (
                          selected.map((value) => (
                            <Chip
                              key={value}
                              label={getRoleNameById(value)}
                              size="small"
                              onDelete={() => handleDeleteRole(value)}
                              deleteIcon={<Close />}
                              sx={{
                                backgroundColor: `${bgColor}15`,
                                color: bgColor,
                                fontWeight: 500,
                              }}
                            />
                          ))
                        )}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="All Roles">
                      {t("allRoles") || "All Roles"}
                    </MenuItem>
                    {roles.map((role) => (
                      <MenuItem key={role.RoleID} value={role.RoleID}>
                        {role.RoleName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* UserList */}
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Draw sx={{ mr: 1, color: "#000", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#000" }}
                    >
                      {t("User List") || "UserList"}
                    </Typography>
                    {isLoading.users && (
                      <CircularProgress
                        size={16}
                        sx={{ ml: 1, color: bgColor }}
                      />
                    )}
                  </Box>
                  <Autocomplete
                    multiple
                    options={processOwnerAndEndUserList}
                    getOptionLabel={(option) => option.UserName || ""}
                    isOptionEqualToValue={(option, value) =>
                      option?.UserID === value?.UserID
                    }
                    value={signatories}
                    onChange={(event, newValue) => {
                      setSignatories(newValue);
                      const selectedUserIds = newValue.map(
                        (user) => user.UserID
                      );
                      console.log(
                        "Selected User IDs in return:",
                        selectedUserIds
                      );
                      setSelectedUserListIds(selectedUserIds);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("UserList") || "Select user..."}
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    )}
                    sx={{
                      "& .MuiChip-root": {
                        backgroundColor: `${bgColor}15`,
                        color: bgColor,
                        fontWeight: 500,
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          gap: 2,
          borderTop: "1px solid #e9ecef",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isAssigning}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            mt: 2,
            borderColor: "#6c757d",
            color: "#6c757d",
            "&:hover": {
              borderColor: "#495057",
              backgroundColor: "#495057",
              color: "white",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          {t("cancel") || "Cancel"}
        </Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          disabled={
            isAssigning ||
            (!selectedDepartments.length &&
              !selectedRoles.length &&
              !selectedGroups.length)
          }
          startIcon={
            isAssigning ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Assignment />
            )
          }
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1,
            mt: 2,
            backgroundColor: bgColor,
            boxShadow: `0 4px 12px ${bgColor}40`,
            "&:hover": {
              backgroundColor: bgColor,
              transform: "translateY(-2px)",
              boxShadow: `0 6px 20px ${bgColor}60`,
            },
            "&:disabled": {
              backgroundColor: "#6c757d",
              color: "white",
            },
            transition: "all 0.2s ease",
          }}
        >
          {isAssigning
            ? t("assigning") || "Assigning..."
            : t("assign") || "Assign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AssignModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
  clearCheckbox: PropTypes.func,
};

export default AssignModal;
