import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Avatar,
  AvatarGroup,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import eye from "../../../../src/assets/svg/Groupmanagement/eye.svg";
import adduser from "../../../../src/assets/svg/Groupmanagement/adduser.svg";
import removeuser from "../../../../src/assets/svg/Groupmanagement/removeuser.svg";
import deletes from "../../../../src/assets/svg/Groupmanagement/delete.svg";
import { MoreVert, Edit, Add, Search } from "@mui/icons-material";
import GroupModal from "./GroupModal";
import AddNewUserModal from "./AddNewUserModal";
import RemoveUserModal from "./RemoveUserModal";
import {
  deleteGroupApi,
  listGroupApi,
} from "../../../services/groupManagement/GroupManagement";
import { toast } from "react-toastify";
import ViewGroupDetailsModal from "./ViewGroupDetailsModal";
import { useTranslation } from "react-i18next";
import AccessDenied from "../../accessDenied/AccessDenied";
import i18next from "i18next";
import { useTheme } from "@mui/styles";

const GroupManagement = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isRemoveUserModalOpen, setIsRemoveUserModalOpen] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 8;
  // Sample data with mock user avatars
  const bgcolor = theme.palette.primary.main; // Use theme color directly

  const featchGroup = async (searchTerm = "") => {
    setIsLoading(true);
    try {
      const payload = {
        search: searchTerm,
      };
      const response = await listGroupApi(payload);
      if (response.status === 200) {
        // Handle both array response and message response
        if (Array.isArray(response.data)) {
          setGroupData(response.data);
          setTotalPages(Math.ceil(response.data.length / rowsPerPage));
        } else if (response.data.message) {
          // setGroupData(response.data); // Will contain the message
          setTotalPages(1);
        } else {
          setGroupData([]);
          setTotalPages(1);
        }
        setInitialLoad(false);
      }
    } catch (error) {
      console.log("error", error);
      setGroupData([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    featchGroup(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    featchGroup();
  }, []);

  const handleUserRemovalSuccess = (remainingUsers) => {
    // Update the specific group's user list in the groupData state
    setGroupData((prevGroups) =>
      prevGroups.map((group) => {
        if (group.GroupID === currentGroup?.GroupID) {
          return {
            ...group,
            UsersInGroup: remainingUsers,
          };
        }
        return group;
      })
    );

    // Close the modal and reset current group if needed
    setIsRemoveUserModalOpen(false);
    setCurrentGroup(null);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    // You can either trigger search immediately or after a delay/debounce
    featchGroup(value);
  };

  const handleOpenModal = (group = null) => {
    setCurrentGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentGroup(null); // Clear selected group
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleDeleteGroup = async (groupId) => {
    const payload = {
      GroupID: groupId,
    };

    try {
      const response = await deleteGroupApi(payload);

      if (response.status === 200) {
        toast.success(i18next.t("group_deleted"));
        setGroupData((prevGroups) =>
          prevGroups.filter((group) => group.GroupID !== groupId)
        );
        if (getCurrentPageData().length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(i18next.t("group_delete_failed"));
      }
    } catch (error) {
      console.error("Error deleting group: ", error);
      toast.error("Error deleting group!");
    }
  };

  const handleMenuClick = (event, group) => {
    setAnchorEl(event.currentTarget);
    setCurrentGroup(group);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentGroup(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update current page
  };
  const getCurrentPageData = () => {
    if (!Array.isArray(groupData)) return [];

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return groupData.slice(startIndex, endIndex);
  };
  // Function to render user avatars with count
  const renderUserAvatars = (users) => {
    return (
      <Box display="flex" alignItems="center">
        {/* Display the number of users */}
        <Typography
          variant="body2"
          sx={{
            color: "#475467",
            fontWeight: "400",
            fontSize: "12px",
            mr: 1, // Space between the number and avatars
          }}
        >
          {users.length} users
        </Typography>
        {/* Display the user avatars */}
        <AvatarGroup max={3}>
          {users.slice(0, 3).map((user, index) => (
            <Tooltip key={index} title={user.UserName}>
              <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                {user.UserName.charAt(0)}
              </Avatar>
            </Tooltip>
          ))}
        </AvatarGroup>
      </Box>
    );
  };

  const handleOpenAddUserModal = () => {
    setAnchorEl(null); // Close the menu
    setIsAddUserModalOpen(true);
    // Don't clear currentGroup here - we need it for the modal
  };

  const handleOpenRemoveUserModal = () => {
    setAnchorEl(null); // Close the menu
    setIsRemoveUserModalOpen(true);
    // Don't clear currentGroup here - we need it for the modal
  };

  const handleOpenViewDetailsModal = () => {
    setAnchorEl(null); // Close the menu
    setIsViewDetailsModalOpen(true);
  };

  const userType = localStorage.getItem("user_type");
  if (userType === "EndUser" || userType === "ProcessOwner") {
    return <AccessDenied />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          alignItems: "center",
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="p" fontWeight="500">
            {t("group_management_title")}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#64748B", fontSize: "11px", mt: 0.5 }}
          >
            {t("group_management_subtitle")}
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            fontSize: "0.875rem",
            textTransform: "none",
            borderRadius: "8px",
            px: 2,
            py: 1,
          }}
          endIcon={<Add sx={{ fontSize: "1rem" }} />}
          onClick={() => handleOpenModal()} // Open for new group
        >
          {t("new_group_button")}
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: -0.5,
          backgroundColor: "white",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          border: "1px solid #E2E8F0",
          borderBottom: "none",
          p: 1,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <TextField
          size="small"
          placeholder={t("search_groups_placeholder")}
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            width: 300,
            backgroundColor: "white",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              height: "36px",
              fontSize: "0.8125rem",
            },
            "& .MuiInputAdornment-root": {
              marginRight: "4px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Search sx={{ color: "#94A3B8", fontSize: "18px" }} />
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #E2E8F0",
          borderRadius: "0 0 12px 12px",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
              <TableCell
                sx={{ fontWeight: 500, color: "#475467", fontSize: "12px" }}
              >
                {t("group_name")}
              </TableCell>
              <TableCell
                sx={{ fontWeight: 500, color: "#475467", fontSize: "12px" }}
              >
                {t("users")}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 500, color: "#475467", fontSize: "12px" }}
              >
                {t("actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : getCurrentPageData().length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  {groupData.message === "No groups found." ? (
                    <Typography variant="body2" color="textSecondary">
                      {t("no_groups_found")}
                    </Typography>
                  ) : initialLoad ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      {t("no_groups_available")}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              getCurrentPageData().map((group) => (
                <TableRow
                  key={group.GroupID}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#F8FAFC",
                    },
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      color: "#475467",
                      fontWeight: "400",
                      fontSize: "12px",
                    }}
                  >
                    {group.GroupName}
                  </TableCell>
                  <TableCell>{renderUserAvatars(group.UsersInGroup)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      sx={{ color: "#475467" }}
                      onClick={() => {
                        console.log("Selected Group Data:", group); // Log the group data here
                        handleOpenModal(group); // Pass the group data to the modal
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: "#475467" }}
                      onClick={(event) => handleMenuClick(event, group)} // Pass the group here
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          px: 1,
        }}
      >
        <Typography variant="body2" sx={{ color: "#64748B" }}>
          {t("page")} {currentPage} {t("of")} {totalPages}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              px: 2,
              py: 0.5,
              "&:disabled": {
                opacity: 0.5,
                cursor: "not-allowed",
              },
            }}
          >
            {t("previous")}
          </Button>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            hidePrevButton
            hideNextButton
            color="primary"
            shape="rounded"
            size="small"
            // sx={{
            //   "& .MuiPaginationItem-root": {
            //     color: bgcolor,
            //     minWidth: 32,
            //     height: 32,
            //     borderRadius: "6px",
            //     "&.Mui-selected": {
            //       backgroundColor: bgcolor,
            //       color: "white",
            //       "&:hover": {
            //         backgroundColor: bgcolor,
            //       },
            //     },
            //   },
            // }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              px: 2,
              py: 0.5,
              "&:disabled": {
                opacity: 0.5,
                cursor: "not-allowed",
              },
            }}
          >
            {t("next")}
          </Button>
        </Stack>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 1,
          sx: {
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            minWidth: 160,
            mt: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={handleOpenViewDetailsModal}
          sx={{
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img src={eye} alt="" />
          {t("view_details")}
        </MenuItem>

        <MenuItem
          onClick={handleOpenAddUserModal}
          sx={{
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img src={adduser} alt="" />
          {t("add_new_user")}
        </MenuItem>
        <MenuItem
          // onClick={() => {
          //   handleMenuClose();
          //   setIsRemoveUserModalOpen(true);
          // }}
          onClick={handleOpenRemoveUserModal}
          sx={{
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img src={removeuser} alt="" />
          {t("remove_user")}
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose(); // Close the menu
            if (currentGroup) {
              console.log("Deleting Group ID: ", currentGroup.GroupID); // Log the GroupID
              handleDeleteGroup(currentGroup.GroupID); // Call the delete function with the GroupID
            } else {
              console.log("No group selected");
            }
          }}
          sx={{
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img src={deletes} alt="Delete" />
          {t("delete_group")}
        </MenuItem>
      </Menu>
      <GroupModal
        open={isModalOpen}
        onClose={handleCloseModal}
        group={currentGroup} // Pass the selected group to the modal
        onGroupUpdated={featchGroup}
      />
      <AddNewUserModal
        open={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        groupUsers={currentGroup?.UsersInGroup || []} // Pass the current group's users
        onSaveSuccess={() => featchGroup()} // Add this line
      />
      <RemoveUserModal
        open={isRemoveUserModalOpen}
        onClose={() => setIsRemoveUserModalOpen(false)}
        users={currentGroup?.UsersInGroup || []} // Pass the current group's users
        onSuccess={handleUserRemovalSuccess} // Add this prop
      />
      <ViewGroupDetailsModal
        open={isViewDetailsModalOpen}
        onClose={() => setIsViewDetailsModalOpen(false)}
        group={currentGroup}
      />
    </Box>
  );
};

export default GroupManagement;
