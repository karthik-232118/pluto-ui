import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  FormGroup,
  InputBase,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Checkbox,
  CircularProgress,
  FormHelperText,
  Autocomplete,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import Featuredicon from "../../../assets/svg/newdoc/Featuredicon.svg";
import SearchIcon from "@mui/icons-material/Search";
import folderIcon from "../../../assets/svg/AotuFinance/fileIcon.svg";
import { Close } from "@mui/icons-material";
import notify from "../../../assets/svg/utils/toast/Toast";
import {
  CategoryAssign,
  listDepartment,
  listRole,
} from "../../../services/elementAssignment/ElementAssignment";
import { listProcessOwnerAndEndUser } from "../../../services/documentModules/DocumentsModule";
import SelectUsersModal from "../../modals/SelectUsersModal";
import { useTranslation } from "react-i18next";
import { listGroupApi } from "../../../services/groupManagement/GroupManagement";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

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

const AssigneCategory = ({ open, setOpen, selectedItems, clearCheckbox }) => {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isAllDepartmentsSelected, setIsAllDepartmentsSelected] =
    useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isAllRolesSelected, setIsAllRolesSelected] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [checkers, setCheckers] = useState([]);
  const [signatories, setSignatories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroups] = useState([]);
  const [processOwnerAndEndUserList, setProcessOwnerAndEndUserList] = useState(
    []
  );
  const [elementsData, setElementsData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const [errors, setErrors] = useState({
    startDate: false,
    dueDate: false,
    departmentOrRole: false,
    checkers: false,
    signatories: false, // Add signatories error
  }); // Add error states
  const [isSelectUserModalOpen, setIsSelectUserModalOpen] = useState(false);
  const [assignedData, setAssignedData] = useState({});
  const [isAssigning, setIsAssigning] = useState({
    all: false,
    custom: false,
  });

  useEffect(() => {
    listProcessOwnerAndEndUser()
      .then((response) => {
        if (response?.status === 200) {
          console.log(response);
          setProcessOwnerAndEndUserList(response?.data?.data?.userList);
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      });
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = {};
        const response = await listGroupApi(data);

        if (response?.status === 200) {
          setGroups(response?.data || []);
          console.log("Groupssss:", response?.data);
        } else {
          console.log("Error fetching groups:", response);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);
  useEffect(() => {
    if (selectedItems?.length) {
      setElementsData(selectedItems);
      setCheckedItems(selectedItems);
    }
  }, [selectedItems]);
  const handleCheckChange = (itemData) => {
    setCheckedItems((prevCheckedItems) => {
      const isAlreadyChecked = prevCheckedItems.some(
        (item) => item.ContentID === itemData.ContentID
      );

      if (isAlreadyChecked) {
        // Remove the item
        return prevCheckedItems.filter(
          (item) => item.ContentID !== itemData.ContentID
        );
      } else {
        // Add the item
        return [...prevCheckedItems, itemData];
      }
    });
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
    } else {
      setDueDate(formattedDate);
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!startDate) {
      setErrors((prevErrors) => ({ ...prevErrors, startDate: true }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, startDate: false }));
    }

    if (!dueDate) {
      setErrors((prevErrors) => ({ ...prevErrors, dueDate: true }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, dueDate: false }));
    }

    if (selectedDepartments.length === 0 && selectedRoles.length === 0) {
      setErrors((prevErrors) => ({ ...prevErrors, departmentOrRole: true }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, departmentOrRole: false }));
    }

    return isValid;
  };

  const formatPayload = () => {
    const filteredElements = elementsData;

    const aggregatedData = filteredElements.reduce((acc, curr) => {
      const existing = acc.find((item) => item.ContentID === curr.ContentID);

      if (existing) {
        existing.data.push(curr.data);
      } else {
        acc.push({
          name: curr.name,
          ContentID: curr.ContentID,
          data: [curr.data],
        });
      }

      return acc;
    }, []);

    const data = {
      departments: selectedDepartments,
      roles: selectedRoles,
      auditors: checkers.map((checker) => checker.UserID),
      usersiganture: signatories.map((signatory) => signatory.UserID),
      modules: aggregatedData,
      startDate: startDate,
      dueDate: dueDate,
    };

    return data;
  };
  const onConfirmHandler = async ({
    isAllUsers = true,
    selectedUsers = [],
  }) => {
    if (!validateForm()) {
      return;
    }

    setIsAssigning({
      all: isAllUsers,
      custom: !isAllUsers,
    });
    try {
      if (isAllUsers ? !selectedUsers?.length : selectedUsers?.length === 0) {
        notify(
          "error",
          "Please select at least one user or group to assign the category."
        );
      }
      const payload = {
        ContentID: selectedItems.map((item) => item.ContentID),
        UserID:
          selectedUsers && selectedUsers?.length > 0
            ? selectedUsers?.map((user) => user.UserID)
            : [],

        ModuleTypeID: presistStore?.ModuleTypeID,
        StartDate: startDate,
        DueDate: dueDate,
      };
      const response = await CategoryAssign(payload);
      if (response?.status === 200) {
        notify(
          "success",
          response?.data?.message || "Element Assigned successfully"
        );
        setOpen(false);
        setIsSelectUserModalOpen(false);
        clearCheckbox();
        setCheckers([]); // Reset auditors
        setSignatories([]); // Reset signatories
      } else {
        notify("error", response?.data?.message || "Failed to assign element");
      }
    } catch (error) {
      notify("error", error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsAssigning({
        all: false,
        custom: false,
      });
    }
  };

  useEffect(() => {
    listDepartment()
      .then((response) => {
        if (response?.status === 200) {
          setDepartments(response?.data?.data?.departmentList);
        }
      })
      .catch((error) => {
        notify(error, "Failed to fetch departments");
      });

    listRole()
      .then((response) => {
        if (response?.status === 200) {
          setRoles(response?.data?.data?.roleList);
        }
      })
      .catch((error) => {
        notify(error, "Failed to fetch roles");
      });
  }, []);

  // Filter the elementsData based on searchTerm
  const filteredElements = elementsData.filter((content) =>
    content.ContentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onAssignHandler = () => {
    if (!validateForm()) {
      return;
    }
    setIsSelectUserModalOpen(true);
    const selectedDepartmentNames = selectedDepartments.map((deptID) =>
      getDepartmentNameById(deptID)
    );
    const selectedRoleNames = selectedRoles.map((roleID) =>
      getRoleNameById(roleID)
    );
    const selectedGroupNames = selectedGroups.map(
      (groupID) => groups.find((group) => group.GroupID === groupID)?.GroupName
    );
    const selectedGroupIDs = selectedGroups.map(
      (groupID) => groups.find((group) => group.GroupID === groupID)?.GroupID
    );
    const data = formatPayload();
    setAssignedData({
      ...data,
      selectedDepartmentNames,
      selectedRoleNames,
      selectedGroupNames, // Add selected group names here
      selectedGroupIDs, // Add selected group IDs here
    });
  };
  return (
    <Dialog open={open} maxWidth="lg" onClose={null}>
      <DialogContent>
        {isSelectUserModalOpen ? (
          <SelectUsersModal
            open={isSelectUserModalOpen}
            onClose={() => setIsSelectUserModalOpen(false)}
            data={{
              ...assignedData,
              selectedGroups: selectedGroups, // Pass selected groups here
            }}
            onAction={onConfirmHandler}
            isLoading={isAssigning}
          />
        ) : (
          <>
            <div
              className="title-wrapper"
              style={{
                background: "linear-gradient(to top, #2C64FF, #4A90E2)",
                margin: "-20px -24px 24px",
                padding: "24px",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
              }}
            >
              <img src={Featuredicon} alt="Featuredicon" />
              <div>
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  {t("assign Category")}
                </Typography>
              </div>
              <IconButton
                sx={{
                  position: "absolute",
                  right: "8px",
                  top: "8px",
                  minWidth: "auto",
                  p: "4px",

                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                onClick={() => {
                  setOpen(false);
                  clearCheckbox();
                  setCheckedItems([]);
                  setSearchTerm(""); // Reset search term
                  setStartDate(null); // Reset start date
                  setDueDate(null); // Reset due date
                  setSelectedDepartments([]); // Reset selected departments
                  setIsAllDepartmentsSelected(false); // Reset all departments selection
                  setSelectedRoles([]); // Reset selected roles
                  setIsAllRolesSelected(false); // Reset all roles selection
                  setCheckers([]); // Reset auditors
                  setSignatories([]); // Reset signatories
                }}
              >
                <Close />
              </IconButton>
            </div>
            <Divider sx={{ margin: "1rem 0rem" }} />
            <Box className="d-flex">
              <div className="assign-wrapper">
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="b"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {t("selectedElements")}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      marginTop: "0.5rem",
                      alignItems: "center",
                      height: "40px",
                      padding: "0px var(--spacing4) 0px var(--spacing2)",
                      borderRadius: "var(--radiuslg)",
                      backgroundColor: "#fff",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <SearchIcon
                      sx={{ marginRight: "10px", color: "#8c8c8c" }}
                    />
                    <InputBase
                      placeholder="Search"
                      fullWidth
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on change
                      sx={{ color: "#8c8c8c" }}
                    />
                  </Box>
                  <Divider sx={{ margin: "1rem 0rem" }} />
                  <Box
                    sx={{
                      maxHeight: "250px", // Define a fixed height to make it scrollable
                      overflowY: "auto", // Enable vertical scrolling
                    }}
                  >
                    {filteredElements?.map((content, index) => (
                      <div className="assing-list" key={index}>
                        <div>
                          <img src={folderIcon} alt="Icon" />
                          <Typography variant="b" style={{ fontWeight: "500" }}>
                            {content?.ContentName}
                          </Typography>
                        </div>
                        {console.log(checkedItems, content.ContentID)}
                        <Checkbox
                          color="primary"
                          checked={checkedItems.some(
                            (item) => item.ContentID === content.ContentID
                          )}
                          onChange={() => handleCheckChange(content)}
                        />
                      </div>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "2rem",
                      marginTop: "auto",
                    }}
                  >
                    <FormGroup
                      sx={{
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="b"
                        sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                      >
                        {t("chooseStartDate")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        type="date"
                        onChange={(e) => onDateChange(e.target.value, "start")}
                        InputProps={{
                          inputProps: {
                            min: new Date().toISOString().split("T")[0],
                          },
                        }}
                        error={errors.startDate} // Show error for start date if invalid
                        helperText={
                          errors.startDate ? "Start date is required" : ""
                        }
                      />
                    </FormGroup>
                    <FormGroup
                      sx={{
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="b"
                        sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                      >
                        {t("chooseDueDate")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        type="date"
                        onChange={(e) => onDateChange(e.target.value, "due")}
                        InputProps={{
                          inputProps: {
                            min:
                              startDate ||
                              new Date().toISOString().split("T")[0],
                          },
                        }}
                        error={errors.dueDate} // Show error for due date if invalid
                        helperText={
                          errors.dueDate ? "Due date is required" : ""
                        }
                      />
                    </FormGroup>
                  </Box>
                </Box>
              </div>

              <div>
                <FormGroup>
                  <Typography variant="b" sx={{ fontWeight: 600 }}>
                    {t("selectDepartments")}{" "}
                    <span
                      style={{
                        color: errors.departmentOrRole ? "red" : "black",
                      }}
                    >
                      *
                    </span>
                  </Typography>
                  <FormControl>
                    <Select
                      labelId="select-departments"
                      id="select-departments"
                      multiple
                      value={
                        isAllDepartmentsSelected
                          ? ["All Departments"]
                          : selectedDepartments
                      }
                      onChange={handleDepartmentChange}
                      input={
                        <OutlinedInput
                          id="select-multiple-departments"
                          label="Tags"
                          style={{ width: "550px" }}
                        />
                      }
                      MenuProps={MenuProps}
                    >
                      <MenuItem key="all-departments" value="All Departments">
                        {t("allDepartments")}
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
                      <FormHelperText>
                        {t("atLeastOneDepartmentOrRole")}
                      </FormHelperText>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mt: 1,
                        mb: 1,
                        maxWidth: "500px",
                      }}
                    >
                      {isAllDepartmentsSelected ? (
                        <Chip
                          key="All Departments"
                          label="All Departments"
                          onDelete={() =>
                            handleDeleteDepartment("All Departments")
                          } // Clear selection if chip is deleted
                          deleteIcon={<Close />}
                          className="tag-chip"
                        />
                      ) : (
                        selectedDepartments.map((deptID) => (
                          <Chip
                            key={deptID}
                            label={getDepartmentNameById(deptID)} // Display department name based on DepartmentID
                            onDelete={() => handleDeleteDepartment(deptID)}
                            deleteIcon={<Close />}
                            className="tag-chip"
                          />
                        ))
                      )}
                    </Box>
                  </FormControl>
                </FormGroup>

                {/* Role Selector */}
                <FormGroup>
                  <Typography variant="b" sx={{ fontWeight: 600 }}>
                    {t("selectRoles")}{" "}
                    <span
                      style={{
                        color: errors.departmentOrRole ? "red" : "black",
                      }}
                    >
                      *
                    </span>
                  </Typography>
                  <FormControl>
                    <Select
                      labelId="select-roles"
                      id="select-roles"
                      multiple
                      value={isAllRolesSelected ? ["All Roles"] : selectedRoles}
                      onChange={handleRoleChange}
                      input={
                        <OutlinedInput
                          id="select-multiple-roles"
                          label="Tags"
                          style={{ width: "550px" }}
                        />
                      }
                      MenuProps={MenuProps}
                    >
                      <MenuItem key="all-roles" value="All Roles">
                        {t("allRoles")}
                      </MenuItem>
                      {roles.map((role) => (
                        <MenuItem key={role.RoleID} value={role.RoleID}>
                          {role.RoleName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.departmentOrRole && (
                      <FormHelperText>
                        {t("atLeastOneDepartmentOrRole")}
                      </FormHelperText>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mt: 1,
                        mb: 1,
                        maxWidth: "500px",
                      }}
                    >
                      {isAllRolesSelected ? (
                        <Chip
                          key="All Roles"
                          label="All Roles"
                          onDelete={() => handleDeleteRole("All Roles")} // Clear selection if chip is deleted
                          deleteIcon={<Close />}
                          className="tag-chip"
                        />
                      ) : (
                        selectedRoles.map((roleID) => (
                          <Chip
                            key={roleID}
                            label={getRoleNameById(roleID)} // Display role name based on RoleID
                            onDelete={() => handleDeleteRole(roleID)}
                            deleteIcon={<Close />}
                            className="tag-chip"
                          />
                        ))
                      )}
                    </Box>
                  </FormControl>
                </FormGroup>

                <Box>
                  <Typography>{t("auditors")} </Typography>
                  <Autocomplete
                    multiple
                    options={processOwnerAndEndUserList || []} // Entire objects as options
                    getOptionLabel={(option) => option?.UserName || ""} // Display username in the dropdown
                    isOptionEqualToValue={(option, value) =>
                      option?.UserID === value?.UserID
                    } // For handling value comparison
                    value={checkers} // Map selected UserIDs to their objects
                    onChange={(event, newValue) => {
                      setCheckers(newValue); // Save only the UserID of selected options
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder={t("selectAuditors")}
                      />
                    )}
                  />
                  {errors.checkers && (
                    <Typography color="error">{errors.checkers}</Typography>
                  )}
                </Box>
                <Box>
                  <Typography>{t("signatory")} </Typography>
                  <Autocomplete
                    multiple
                    options={(processOwnerAndEndUserList || []).filter(
                      (user) => user.IsSignatureUploaded
                    )} // Filter users
                    getOptionLabel={(option) => option?.UserName || ""} // Display username
                    isOptionEqualToValue={(option, value) =>
                      option?.UserID === value?.UserID
                    }
                    value={signatories} // Bind to signatories state
                    onChange={(event, newValue) => {
                      setSignatories(newValue); // Update signatories state
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder={t("selectSignatory")}
                      />
                    )}
                  />
                  {errors.signatories && (
                    <Typography color="error">{errors.signatories}</Typography>
                  )}
                </Box>
              </div>
            </Box>

            <div className="actions-wrapper">
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  height: "40px",
                  textTransform: "none",
                }}
                onClick={() => {
                  setOpen(false);
                  clearCheckbox();
                  setCheckedItems([]);
                  setSearchTerm(""); // Reset search term
                  setStartDate(null); // Reset start date
                  setDueDate(null); // Reset due date
                  setSelectedDepartments([]); // Reset selected departments
                  setIsAllDepartmentsSelected(false); // Reset all departments selection
                  setSelectedRoles([]); // Reset selected roles
                  setIsAllRolesSelected(false); // Reset all roles selection
                  setCheckers([]); // Reset auditors
                  setSignatories([]); // Reset signatories
                }}
                disabled={isAssigning?.all || isAssigning?.custom}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#3D54CD",
                  textTransform: "none",
                  height: "40px",
                }}
                onClick={onAssignHandler}
                disabled={isAssigning.all || isAssigning.custom}
                startIcon={
                  (isAssigning.all || isAssigning.custom) && (
                    <CircularProgress size={20} />
                  )
                }
              >
                {isAssigning.all || isAssigning.custom
                  ? t("assigning")
                  : t("next")}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssigneCategory;

AssigneCategory.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
  clearCheckbox: PropTypes.func.isRequired,
};
