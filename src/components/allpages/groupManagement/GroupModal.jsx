import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Stack,
  Box,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import headingIcon from "../../../assets/svg/Groupmanagement/groupheadingicon.svg";
import { listProcessOwnerAndEndUser } from "../../../services/documentModules/DocumentsModule";
import {
  CreateGroupManagementApi,
  updateGroupApi,
} from "../../../services/groupManagement/GroupManagement"; // Import both APIs
import { toast } from "react-toastify"; // Import Toastify
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types"; // Import PropTypes for type checking
import { use } from "react";
import i18next from "i18next";
import { useTheme } from "@mui/styles";
import { validateInput } from "../../../utils/securityUtils";
import errorHandler from "../../../utils/errorHandler";

const GroupModal = ({ open, onClose, group = null, onGroupUpdated }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main; // Custom hook to get background color

  const [groupName, setGroupName] = useState(group?.GroupName || "");
  const [groupDescription, setGroupDescription] = useState(
    group ? group.GroupDescription : ""
  );
  const [selectedUsers, setSelectedUsers] = useState(
    group ? group.UsersInGroup : []
  );
  const [userInput, setUserInput] = useState("");
  const [userList, setUserList] = useState([]);

  const [errors, setErrors] = useState({
    groupName: false,
    users: false,
  });

  // Log group details when in edit mode
  useEffect(() => {
    if (group && open) {
      console.log("Selected Group Data (Edit Mode): ", {
        GroupName: group.GroupName,
        GroupDescription: group.GroupDescription,
        UsersInGroup: group.UsersInGroup.map((user) => ({
          UserName: user.UserName,
          UserID: user.UserID,
        })),
      });

      setGroupName(group.GroupName);
      setGroupDescription(group.GroupDescription);
      setSelectedUsers(group.UsersInGroup);
    } else {
      setGroupName("");
      setGroupDescription("");
      setSelectedUsers([]);
    }
  }, [group, open]);

  // Fetch process owner and end user data when the modal opens
  useEffect(() => {
    const fetchProcessOwnerAndEndUser = async () => {
      try {
        const response = await listProcessOwnerAndEndUser({
          someKey: "someValue",
        });
        setUserList(response?.data?.data?.userList || []);
      } catch (error) {
        console.error("API Error: ", error);
      }
    };

    if (open) {
      fetchProcessOwnerAndEndUser();
    }
  }, [open]);

  const handleUserSelect = (event) => {
    const userId = event.target.value;
    if (userId && !selectedUsers.some((user) => user.UserID === userId)) {
      const userToAdd = userList.find((user) => user.UserID === userId);
      const updatedSelectedUsers = [...selectedUsers, userToAdd];
      setSelectedUsers(updatedSelectedUsers);

      console.log(
        "Selected Users: ",
        updatedSelectedUsers.map((user) => ({
          UserName: user.UserName,
          UserID: user.UserID,
        }))
      );
    }
    setUserInput("");
  };

  const handleDeleteUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.UserID !== userId));
  };

  const handleSave = async () => {
    const errors = {
      groupName: !groupName.trim(),
      users: selectedUsers.length === 0,
    };

    // Add security validation checks
    if (!validateInput(groupName)) {
      errors.groupName = "Invalid input detected in group name";
      errorHandler.addSecurityError(groupName, "groupName");
      setErrors(errors);
      return;
    }

    if (!validateInput(groupDescription)) {
      errors.groupDescription = "Invalid input detected in description";
      errorHandler.addSecurityError(groupDescription, "groupDescription");
      setErrors(errors);
      return;
    }

    setErrors(errors);
    if (errors.groupName || errors.users) return;

    const payload = {
      GroupName: groupName,
      GroupDescription: groupDescription,
      UserIDs: selectedUsers.map((user) => user.UserID),
    };

    try {
      let response;
      if (group) {
        // If the group exists, update it
        payload.GroupID = group.GroupID;
        response = await updateGroupApi(payload); // Call update API
        console.log("Group updated successfully: ", response);
        toast.success(i18next.t("group_updated")); // Success toast on update
      } else {
        // If the group doesn't exist, create it
        response = await CreateGroupManagementApi(payload); // Call create API
        console.log("Group created successfully: ", response);
        toast.success(i18next.t("group_created")); // Success toast on create
      }
      onGroupUpdated();
      onClose(); // Close the modal after save
    } catch (error) {
      console.error("Error saving group: ", error);
      toast.error("Error saving group!"); // Error toast on failure
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      height: "40px",
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "#E2E8F0",
      },
      "&:hover fieldset": {
        borderColor: "#E2E8F0",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#E2E8F0",
      },
    },
  };

  const selectStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "#E2E8F0",
      },
      "&:hover fieldset": {
        borderColor: "#E2E8F0",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#E2E8F0",
      },
    },
  };

  const handleGroupNameChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/<[^>]*>/g, ""); // Removes HTML tags
    setGroupName(sanitizedValue);
  };

  const handleGroupDescriptionChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/<[^>]*>/g, ""); // Removes HTML tags
    setGroupDescription(sanitizedValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: bgcolor || "linear-gradient(to top, #2C64FF, #4A90E2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          pr: 6,
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mr: 2 }}>
            <img src={headingIcon} alt="" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              {group ? t("group_modal_title_edit") : t("group_modal_title_new")}
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff" }}>
              {t("group_modal_description")}
            </Typography>
          </Box>
        </Box>

        {/* Close button at top-right */}
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            minWidth: "auto",
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 1L1 13M1 1L13 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </DialogTitle>
      <DialogContent>
        <Stack>
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="p"
              sx={{ fontSize: "15px", fontWeight: "500" }}
            >
              {t("group_name_label")}
            </Typography>
            <TextField
              placeholder={t("group_name_placeholder")}
              variant="outlined"
              fullWidth
              value={groupName}
              onChange={(e) => handleGroupNameChange(e)}
              sx={{ mt: 1, ...inputStyles }}
              error={!!errors.groupName}
              helperText={
                errors.groupName && (
                  <Box>
                    <Typography color="error">
                      {errors.groupName}
                      {errors.groupName.includes("SQL injection") && (
                        <Box
                          component="pre"
                          sx={{
                            mt: 1,
                            fontSize: "12px",
                            color: "#d32f2f",
                            bgcolor: "#fff3f3",
                            p: 1,
                            borderRadius: 1,
                          }}
                        >
                          [SQL_INJECTION] Error: {errors.groupName}
                        </Box>
                      )}
                    </Typography>
                  </Box>
                )
              }
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body1"
              sx={{ fontSize: "15px", fontWeight: "500" }}
            >
              {t("group_description_label")}
            </Typography>
            <TextField
              placeholder={t("group_description_placeholder")}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={groupDescription}
              onChange={(e) => handleGroupDescriptionChange(e)}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="p"
              sx={{ fontSize: "15px", fontWeight: "500" }}
            >
              {t("add_users_label")}
            </Typography>

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="user-select-label">
                {t("select_user_label")}
              </InputLabel>
              <Select
                labelId="user-select-label"
                id="user-select"
                value={userInput}
                label={t("select_user_label")}
                onChange={handleUserSelect}
                sx={selectStyles}
              >
                {userList.map((user) => (
                  <MenuItem key={user.UserID} value={user.UserID}>
                    {user.UserName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedUsers.map((user) => (
                <Chip
                  key={user.UserID}
                  label={user.UserName}
                  variant="outlined"
                  onDelete={() => handleDeleteUser(user.UserID)}
                  deleteIcon={<span>×</span>}
                  sx={{
                    borderRadius: "6px",
                    borderColor: "#E2E8F0",
                    "& .MuiChip-deleteIcon": {
                      color: "#64748B",
                    },
                  }}
                />
              ))}
            </Box>
            {errors.users && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {t("select_user_error")}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid #E2E8F0" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={onClose}
              color="primary"
              fullWidth
              sx={{
                borderRadius: "6px",
                color: "#000",
                px: 2,
                py: 1,
              }}
              variant="outlined"
            >
              {t("cancel_button")}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={handleSave}
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "6px",
                px: 2,
                py: 1,
              }}
            >
              {t("save_button")}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default GroupModal;

GroupModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  group: PropTypes.shape({
    GroupName: PropTypes.string,
    GroupDescription: PropTypes.string,
    UsersInGroup: PropTypes.arrayOf(
      PropTypes.shape({
        UserName: PropTypes.string,
        UserID: PropTypes.string,
      })
    ),
  }),
  onGroupUpdated: PropTypes.func.isRequired,
};
GroupModal.defaultProps = {
  group: null,
};
