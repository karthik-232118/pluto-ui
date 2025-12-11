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
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import Featuredicon from "../../../assets/svg/newdoc/Featuredicon.svg";
import SearchIcon from "@mui/icons-material/Search";
import Book from "../../../assets/png/book-open.png";
import { Close } from "@mui/icons-material";
import notify from "../../../assets/svg/utils/toast/Toast";
import {
  assignElement,
  listDepartment,
  listRole,
} from "../../../services/elementAssignment/ElementAssignment";
import { listProcessOwnerAndEndUser } from "../../../services/documentModules/DocumentsModule";
import SelectUsersModal from "../../modals/SelectUsersModal";
import { useTranslation } from "react-i18next";
import { listGroupApi } from "../../../services/groupManagement/GroupManagement";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";
import {
  GetAllMailTemlate,
  GetMailTemplateByID,
} from "../../../services/mailTemplate/MailTemplate";

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

const Assign = ({ open, setOpen, selectedItems, clearCheckbox }) => {
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
  const [mailTemplates, setMailTemplates] = useState([]);
  const [selectedMailTemplate, setSelectedMailTemplate] = useState(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({
    startDate: false,
    dueDate: false,
    departmentOrRole: false,
    checkers: false,
    signatories: false,
    mailTemplate: false, // <-- added
  });
  const [isSelectUserModalOpen, setIsSelectUserModalOpen] = useState(false);
  const [assignedData, setAssignedData] = useState({});
  const [isAssigning, setIsAssigning] = useState({
    all: false,
    custom: false,
  });
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;

  console.log(selectedItems, "selectedItemsmmm");
  console.log(selectedMailTemplate?.EmailTemplateID, "heyheyyy");

  useEffect(() => {
    listProcessOwnerAndEndUser()
      .then((response) => {
        if (response?.status === 200) {
          setProcessOwnerAndEndUserList(response?.data?.data?.userList);
          console.log("responseUserList", response?.data?.data?.userList);
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      });
  }, []);

  useEffect(() => {
    if (open) {
      fetchMailTemplates();
    }
  }, [open]);

  // Add this function to fetch mail templates
  const fetchMailTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const response = await GetAllMailTemlate();
      if (response?.status === 200) {
        setMailTemplates(response?.data?.data || []);
        console.log("Mail Templates:", response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching mail templates:", error);
      notify("error", "Failed to load mail templates");
    } finally {
      setIsLoadingTemplates(false);
    }
  };

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

  const getDisplayName = (item) => {
    switch (item?.ModuleName) {
      case "Document":
        return item?.DocumentName;
      case "SkillBuilding":
        return item?.TrainingSimulationName;
      case "SOP":
        return item?.SOPName;
      case "TestMCQ":
        return item?.TestMCQName;
      case "SkillAssessment":
        return item?.TestSimulationName;
      case "Form":
        return item?.FormName;
      default:
      
        return (
          item?.ContentName ||
          Object.keys(item || {})
            .find((k) => k.toLowerCase().endsWith("name"))
            ?.let?.((key) => item[key]) ||
          ""
        );
    }
  };

  const getItemIdValue = (item) => {
    switch (item?.ModuleName) {
      case "Document":
        return item?.DocumentID;
      case "SkillBuilding":
        return item?.TrainingSimulationID;
      case "SOP":
        return item?.SOPID;
      case "TestMCQ":
        return item?.TestMCQID;
      case "SkillAssessment":
        return item?.TestSimulationID;
      case "Form":
        return item?.FormID;
      default:
        return item?.ContentID || null;
    }
  };

  useEffect(() => {
    if (selectedItems?.length) {
      const data = selectedItems.map((item) => {
        const itemName = getDisplayName(item) || item?.ContentName || "N/A";
        const moduleName =
          item?.ModuleName || item?.ModuleMaster?.ModuleName || null;
        const moduleTypeId = item?.ModuleTypeID || null;
        const idValue = getItemIdValue(item) || item?.ContentID || null;
        return {
          itemName,
          name: moduleName,
          ModuleTypeID: moduleTypeId,
          data: idValue,
        };
      });

      setElementsData(data);
      const initialCheckedItems = {};
      data.forEach((d) => {
        if (d.data) initialCheckedItems[d.data] = true;
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

    // New: Mail Template is required
    if (!selectedMailTemplate) {
      setErrors((prevErrors) => ({ ...prevErrors, mailTemplate: true }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mailTemplate: false }));
    }

    return isValid;
  };

  const formatPayload = () => {
    const filteredElements = elementsData.filter(
      (item) => checkedItems[item.data]
    );

    const aggregatedData = filteredElements.reduce((acc, curr) => {
      const existing = acc.find(
        (item) => item.ModuleTypeID === curr.ModuleTypeID
      );

      if (existing) {
        existing.data.push(curr.data);
      } else {
        acc.push({
          name: curr.name,
          ModuleTypeID: curr.ModuleTypeID,
          data: [curr.data],
        });
      }

      return acc;
    }, []);

    const data = {
      departments: selectedDepartments,
      roles: selectedRoles,
      // groups: selectedGroups, // Make sure to include the selected groups in the payload
      auditors: checkers.map((checker) => checker.UserID),
      usersiganture: signatories.map((signatory) => signatory.UserID),
      modules: aggregatedData,
      startDate: startDate,
      dueDate: dueDate,
      EmailTemplateID: selectedMailTemplate?.EmailTemplateID || null,
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
      const data = formatPayload();
      data["isAllUsers"] = isAllUsers;
      data["selectedUsers"] =
        selectedUsers && selectedUsers?.length > 0
          ? selectedUsers?.map((user) => user.UserID)
          : [];
      data["EmailTemplateID"] = selectedMailTemplate?.EmailTemplateID || null;
      const response = await assignElement(data);
      if (response?.status === 200) {
        notify(
          "success",
          response?.data?.message || "Element Assigned successfully"
        );
        setOpen(false);
        setIsSelectUserModalOpen(false);
        clearCheckbox();
        setCheckers([]);
        setSignatories([]);
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

  const filteredElements = elementsData.filter((content) =>
    content?.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onAssignHandler = async () => {
    if (!validateForm()) {
      return;
    }

    // if (selectedMailTemplate?.EmailTemplateID) {
    //   try {
    //     const payload = {
    //       EmailTemplateID: selectedMailTemplate?.EmailTemplateID,
    //     };

    //     const response = await GetMailTemplateByID(payload);

    //     if (response?.status === 200) {
    //       console.log("Mail template details:", response?.data);
    //       // You can handle the response data here if needed
    //     } else {
    //       notify("error", "Failed to fetch mail template details");
    //       return; // Stop proceeding if API fails
    //     }
    //   } catch (error) {
    //     console.error("Error fetching mail template:", error);
    //     notify(
    //       "error",
    //       error?.response?.data?.message || "Failed to fetch mail template"
    //     );
    //     return; // Stop proceeding if API fails
    //   }
    // }

    // Continue with the existing logic
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
      selectedGroupNames,
      selectedGroupIDs,
    });
  };

  return (
    <Dialog open={open} maxWidth="lg">
      <DialogContent>
        {isSelectUserModalOpen ? (
          <SelectUsersModal
            open={isSelectUserModalOpen}
            onClose={() => setIsSelectUserModalOpen(false)}
            data={{
              ...assignedData,
              selectedGroups: selectedGroups,
            }}
            onAction={onConfirmHandler}
            isLoading={isAssigning}
          />
        ) : (
          <>
            <div
              className="title-wrapper"
              style={{
                background: bgColor,
                margin: "-20px -24px 24px",
                padding: "24px",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
              }}
            >
              <img src={Featuredicon} alt="Featuredicon" />
              <div>
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  {t("assign")}
                </Typography>
              </div>
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
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{ color: "#8c8c8c" }}
                    />
                  </Box>
                  <Divider sx={{ margin: "1rem 0rem" }} />
                  <Box
                    sx={{
                      maxHeight: "250px",
                      overflowY: "auto",
                    }}
                  >
                    {filteredElements.map((content, index) => (
                      <div className="assing-list" key={index}>
                        <div>
                          <img src={Book} alt="Icon" />
                          <Typography variant="b" style={{ fontWeight: "500" }}>
                            {content?.itemName}
                          </Typography>
                        </div>
                        <Checkbox
                          color="primary"
                          checked={checkedItems[content.data] || false}
                          onChange={() => handleCheckChange(content.data)}
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
                        error={errors.startDate}
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
                        error={errors.dueDate}
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
                          }
                          deleteIcon={<Close />}
                          className="tag-chip"
                        />
                      ) : (
                        selectedDepartments.map((deptID) => (
                          <Chip
                            key={deptID}
                            label={getDepartmentNameById(deptID)}
                            onDelete={() => handleDeleteDepartment(deptID)}
                            deleteIcon={<Close />}
                            className="tag-chip"
                          />
                        ))
                      )}
                    </Box>
                  </FormControl>
                </FormGroup>

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
                          onDelete={() => handleDeleteRole("All Roles")}
                          deleteIcon={<Close />}
                          className="tag-chip"
                        />
                      ) : (
                        selectedRoles.map((roleID) => (
                          <Chip
                            key={roleID}
                            label={getRoleNameById(roleID)}
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
                    options={processOwnerAndEndUserList || []}
                    getOptionLabel={(option) => option?.UserName || ""}
                    isOptionEqualToValue={(option, value) =>
                      option?.UserID === value?.UserID
                    }
                    value={checkers}
                    onChange={(event, newValue) => {
                      setCheckers(newValue);
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
                    )}
                    getOptionLabel={(option) => option?.UserName || ""}
                    isOptionEqualToValue={(option, value) =>
                      option?.UserID === value?.UserID
                    }
                    value={signatories}
                    onChange={(event, newValue) => {
                      setSignatories(newValue);
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
                <Box>
                  <Typography>Mail Template <span style={{ color: "red" }}>*</span></Typography>
                  <Autocomplete
                    options={mailTemplates}
                    getOptionLabel={(option) => option?.GreetingName || ""}
                    isOptionEqualToValue={(option, value) =>
                      option?.EmailTemplateID === value?.EmailTemplateID
                    }
                    value={selectedMailTemplate}
                    onChange={(event, newValue) => {
                      setSelectedMailTemplate(newValue);
                      // Clear mail template error when user picks one
                      setErrors((prev) => ({ ...prev, mailTemplate: newValue ? false : true }));
                    }}
                    loading={isLoadingTemplates}
                    renderOption={(props, option) => (
                      <Tooltip
                        title={
                          <Box sx={{ p: 2, maxWidth: 400 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "bold",
                                mb: 1.5,
                                color: "primary.main",
                                fontSize: "1.1rem",
                              }}
                            >
                              {option.Subject}
                            </Typography>

                            <Box sx={{ mb: 1.5 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: "bold",
                                  color: "text.secondary",
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                Greeting
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.primary" }}
                              >
                                {option.GreetingName}
                              </Typography>
                            </Box>

                            <Box sx={{ mb: 1.5 }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: "bold",
                                  color: "text.secondary",
                                  display: "block",
                                  mb: 0.5,
                                }}
                              >
                                Body
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  whiteSpace: "pre-wrap",
                                  color: "text.primary",
                                  lineHeight: 1.5,
                                }}
                              >
                                {option.Body}
                              </Typography>
                            </Box>

                            {option.signature && (
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: "bold",
                                    color: "text.secondary",
                                    display: "block",
                                    mb: 0.5,
                                  }}
                                >
                                  Signature
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    whiteSpace: "pre-wrap",
                                    color: "text.primary",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {option.signature}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                        placement="right"
                        arrow
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: "background.paper",
                              color: "text.primary",
                              border: "1px solid",
                              borderColor: "divider",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                              maxWidth: 500,
                              borderRadius: 2,
                              overflow: "hidden",
                            },
                          },
                          arrow: {
                            sx: {
                              color: "background.paper",
                              "&::before": {
                                border: "1px solid",
                                borderColor: "divider",
                              },
                            },
                          },
                        }}
                      >
                        <li {...props}>
                          <Typography
                            variant="body2"
                            sx={{
                              padding: "8px 12px",
                              borderRadius: 1,
                              "&:hover": {
                                backgroundColor: "action.hover",
                              },
                            }}
                          >
                            {option.GreetingName}
                          </Typography>
                        </li>
                      </Tooltip>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select Mail Template"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isLoadingTemplates ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  {errors.mailTemplate && (
                    <Typography color="error" sx={{ mt: 1 }}>
                      Mail Template is required
                    </Typography>
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
                onClick={() => setOpen(false)}
                disabled={isAssigning?.all || isAssigning?.custom}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  textTransform: "none",
                  height: "40px",
                }}
                onClick={onAssignHandler}
                disabled={isAssigning.all || isAssigning.custom || !selectedMailTemplate}
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

export default Assign;

Assign.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
  clearCheckbox: PropTypes.func.isRequired,
};
