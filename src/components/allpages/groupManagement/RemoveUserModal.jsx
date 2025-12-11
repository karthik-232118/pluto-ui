import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import headingIcon from "../../../assets/svg/Groupmanagement/removeheadingicon.svg";
import { updateGroupApi } from "../../../services/groupManagement/GroupManagement";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";
const RemoveUserModal = ({ open, onClose, users, onSuccess }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleToggle = (userId) => () => {
    const currentIndex = selectedUsers.indexOf(userId);
    const newSelected = [...selectedUsers];

    if (currentIndex === -1) {
      newSelected.push(userId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedUsers(newSelected);
  };

  const handleRemove = async () => {
    if (selectedUsers.length === 0) {
      console.warn("No users selected for removal");
      return;
    }

    setIsLoading(true);

    try {
      // Get the group ID (assuming all selected users are from the same group)
      const groupId = users.find((user) => selectedUsers.includes(user.UserID))
        ?.UserGroup?.GroupID;

      if (!groupId) {
        throw new Error("Group ID not found");
      }

      // Prepare the API payload
      const payload = {
        GroupID: groupId,
        RemoveUserIDs: selectedUsers,
        // Add any additional required fields here
      };

      // Call the API to remove users
      const response = await updateGroupApi(payload);
      console.log("Users removed successfully:", response);

      // Call the success callback if provided
      if (onSuccess) {
        const remainingUsers = users.filter(
          (user) => !selectedUsers.includes(user.UserID)
        );
        onSuccess(remainingUsers);
      }

      // Reset selection and close modal
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error("Error removing users:", error);
      // Here you could add error notification to the user
    } finally {
      setIsLoading(false);
    }
  };

  // Function to generate initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          background: "#DC2626",
          mb: 2,
          position: "relative",
          paddingRight: "48px", // Make space for the close button
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mr: 2 }}>
            <img src={headingIcon} alt="" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: "#fff", marginTop: "-8px" }}>
              {t("removeUsersTitle")}
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff" }}>
              {t("removeUsersDescription")}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <Divider sx={{ margin: "0 20px", borderColor: "#E2E8F0" }} />

      <DialogContent>
        <Box mb={2}>
          <Typography variant="p" sx={{ fontWeight: 500, fontSize: "14px" }}>
            {t("groupUsers")} ({users.length})
          </Typography>
        </Box>

        <TableContainer
          sx={{
            maxHeight: 300,
            overflow: "auto",
            border: "1px solid #EAECF0",
            borderRadius: "10px",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Table sx={{ minWidth: 20 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: 500, color: "#475467", fontSize: "12px" }}
                >
                  {t("tableUser")}
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 500, color: "#475467", fontSize: "12px" }}
                >
                  {t("Name")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.UserID}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Checkbox
                        edge="start"
                        onChange={handleToggle(user.UserID)}
                        checked={selectedUsers.indexOf(user.UserID) !== -1}
                        sx={{
                          "&.Mui-checked": {
                            color: "#3B82F6",
                          },
                          transform: "scale(0.75)",
                        }}
                      />
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "200px",
                          border: "1px solid #D0D5DD",
                          marginRight: "12px",
                          backgroundColor: "#F9FAFB",
                          color: "#475467",
                          fontWeight: 300,
                        }}
                      >
                        {getInitials(user.UserName)}
                      </Avatar>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: "13.5px",
                        color: "#101828",
                      }}
                    >
                      {user.UserName}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={onClose}
              color="primary"
              fullWidth
              disabled={isLoading}
              sx={{
                borderRadius: "6px",
                border: "1px solid #D0D5DD",
                color: "#000",
                px: 2,
                py: 1,
              }}
            >
              {t("cancel")}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={handleRemove}
              variant="contained"
              fullWidth
              disabled={isLoading || selectedUsers.length === 0}
              sx={{
                borderRadius: "6px",
                px: 2,
                py: 1,
                backgroundColor: "#EF4444",
                "&:hover": {
                  backgroundColor: "#DC2626",
                },
              }}
            >
              {isLoading ? t("removing") : t("removeSelected")}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveUserModal;

RemoveUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      UserID: PropTypes.string.isRequired,
      UserName: PropTypes.string.isRequired,
      UserGroup: PropTypes.shape({
        GroupID: PropTypes.string.isRequired,
      }),
    })
  ).isRequired,
  onSuccess: PropTypes.func,
};
RemoveUserModal.defaultProps = {
  onSuccess: null,
};
RemoveUserModal.displayName = "RemoveUserModal";
