import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { listProcessOwnerAndEndUser } from "../../../services/documentModules/DocumentsModule";
import headingIcon from "../../../assets/svg/Groupmanagement/groupheadingicon.svg";
import { updateGroupApi } from "../../../services/groupManagement/GroupManagement";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useTheme } from "@mui/styles";

const AddNewUserModal = ({ open, onClose, groupUsers = [], onSaveSuccess }) => {
  const [userList, setUserList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupID, setGroupID] = useState(null);
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main; // Use theme color directly
  const { t } = useTranslation();

  useEffect(() => {
    if (groupUsers && groupUsers.length > 0) {
      setGroupID(groupUsers[0]?.UserGroup?.GroupID);
      setSelectedUsers([...groupUsers]);
    }
  }, [open, groupUsers]);

  useEffect(() => {
    const fetchProcessOwnerAndEndUser = async () => {
      try {
        const response = await listProcessOwnerAndEndUser({
          someKey: "someValue",
        });
        console.log("Fetched user list:", response?.data?.data?.userList);
        setUserList(response?.data?.data?.userList || []);
      } catch (error) {
        console.error("API Error: ", error);
      }
    };

    if (open) {
      fetchProcessOwnerAndEndUser();
    } else {
      setSelectedUsers([]); // Reset selected users when modal closes
    }
  }, [open]);

  const handleDeleteUser = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((user) => user.UserID !== userId)
    );
  };

  const handleSelectUser = (event) => {
    const userId = event.target.value;
    if (userId && !selectedUsers.some((user) => user.UserID === userId)) {
      const userToAdd = userList.find((user) => user.UserID === userId);
      if (userToAdd) {
        setSelectedUsers([...selectedUsers, userToAdd]);
      }
    }
  };

  const handleSave = async () => {
    const userIds = selectedUsers.map((user) => user.UserID);
    const payload = {
      GroupID: groupID,
      UserIDs: userIds,
    };

    try {
      const response = await updateGroupApi(payload);
      if (response?.status === 200) {
        toast.success(i18next.t("user_added"));
        onClose();
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      } else {
        toast.error("Failed to add users.");
      }
    } catch (error) {
      console.error("Error adding users:", error);
      toast.error("Error adding users.");
    }
  };

  const availableUsers = userList.filter(
    (user) => !selectedUsers.some((selected) => selected.UserID === user.UserID)
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          borderRadius: "12px",
          boxShadow: 24,
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            background: bgcolor || "linear-gradient(to top, #2C64FF, #4A90E2)",
            margin: "-24px -24px 24px",
            padding: "18px",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            position: "relative",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ mr: 2 }}>
            <img src={headingIcon} alt="" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              {t("addUsersTitle")}
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff" }}>
              {t("addUsersDescription")}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="p" sx={{ fontSize: "15px", fontWeight: "500" }}>
            {t("currentUsers")}
          </Typography>
          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
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
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 2 }}>
          <Typography variant="p" sx={{ fontSize: "15px", fontWeight: "500" }}>
            {t("addNewUsers")}
          </Typography>

          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="user-select-label">
              {t("selectUserToAdd")}
            </InputLabel>
            <Select
              labelId="user-select-label"
              id="user-select"
              label={t("selectUserToAdd")}
              onChange={handleSelectUser}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "50px",
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
                "& .MuiSelect-select": {
                  paddingTop: "0px 0 30px 0px",
                  paddingBottom: "10px",
                },
              }}
            >
              {availableUsers.map((user) => (
                <MenuItem key={user.UserID} value={user.UserID}>
                  {user.UserName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            marginTop: "20px",
          }}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={12} sm={6}>
              <Button
                onClick={onClose}
                variant="outlined"
                color="primary"
                fullWidth
                sx={{
                  borderRadius: "6px",

                  px: 2,
                  py: 1,
                }}
              >
                {t("cancel")}
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
                {t("save")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddNewUserModal;

AddNewUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  groupUsers: PropTypes.array,
  onSaveSuccess: PropTypes.func,
};
AddNewUserModal.defaultProps = {
  groupUsers: [],
  onSaveSuccess: null,
};
