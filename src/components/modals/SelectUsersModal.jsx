import { useState, useEffect, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox,
  FormGroup,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { listUserToAssignElement } from "../../services/elementAssignment/ElementAssignment";
import notify from "../../assets/svg/utils/toast/Toast";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";

const SelectUsersModal = ({
  open,
  onClose,
  data = {},
  onAction,
  isLoading = {
    all: false,
    custom: false,
  },
  isRevoking = false,
}) => {
  const listUserRef = useRef();
  const theme = useTheme();
  const bgcolor = theme.palette.primary.main; // Use theme color directly
  const [departments] = useState(data?.selectedDepartmentNames || []);
  const [roles] = useState(data?.selectedRoleNames || []);
  const [cachedData, setCachedData] = useState({
    searchQuery: "",
  });
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetchUsers = async (initialPage = "") => {
    listUserRef.current = true;
    setIsFetching(true);
    setLoading(true);

    try {
      const payload = {
        page: initialPage || page,
        pageSize: 10,
        Departments: data?.departments || [],
        Roles: data?.roles || [],
        search: searchQuery,
        // Groups: data?.selectedGroups || [],
        IsRevoke: data?.IsRevoke || false,
        ModuleID: data?.ModuleID || null,
        ModuleTypeID: data?.ModuleTypeID || null,
        ModuleName: data?.ModuleName || null,
      };

      const response = await listUserToAssignElement(payload);
      console.log(response);
      if (response && response.data && response.data.data) {
        const { userList = [], count } = response.data.data;

        if (userList?.length === 0) {
          setHasMore(false);
        } else {
          const updatedUsers = userList.map((user) => {
            const userIndex = checkedUsers.findIndex(
              (checkedUser) => checkedUser.UserID === user.UserID
            );
            return {
              ...user,
              checked: userIndex > -1,
            };
          });

          if (searchQuery && searchQuery !== cachedData.searchQuery) {
            setUsers(updatedUsers);
          } else {
            setUsers((prevUsers) => [...prevUsers, ...updatedUsers]);
          }

          setTotalCount((prev) => (prev < count ? count : prev));

          if (userList.length < 10 && users.length === count) {
            setHasMore(false);
          }
        }
      } else {
        notify("error", response?.data?.message || "Failed to fetch users");
      }
    } catch (error) {
      notify(
        "error",
        error?.response?.data?.message || "Failed to fetch users"
      );
    } finally {
      setLoading(false);
      setIsFetching(false);
      listUserRef.current = false;
    }
  };
  // Load the initial set of users when modal opens
  useEffect(() => {
    if (open && !listUserRef.current && hasMore) {
      fetchUsers();
    }
  }, [page]);

  const handleScroll = (event) => {
    const tolerance = 2;
    const isBottom =
      Math.abs(
        event.target.scrollHeight -
          (event.target.scrollTop + event.target.clientHeight)
      ) <= tolerance;

    if (isBottom && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleUserSelect = (isChecked, targetUser) => {
    if (isChecked) {
      setCheckedUsers((prev) => [...prev, targetUser]);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.UserID === targetUser.UserID ? { ...user, checked: true } : user
        )
      );
    } else {
      setCheckedUsers((prev) =>
        prev.filter((user) => user.UserID !== targetUser.UserID)
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.UserID === targetUser.UserID ? { ...user, checked: false } : user
        )
      );
    }
  };

  useEffect(() => {
    setIsFetching(true);
    if (searchQuery && cachedData.searchQuery !== searchQuery) {
      setUsers([]);
      setCachedData((prev) => ({
        ...prev,
        searchQuery: searchQuery,
      }));

      const debounce = setTimeout(() => {
        fetchUsers(1);
        setPage(1);
        setHasMore(true);
      }, 500);
      return () => clearTimeout(debounce);
    } else if (!searchQuery && cachedData.searchQuery) {
      setUsers([]);
      setCachedData((prev) => ({
        ...prev,
        searchQuery: "",
      }));

      const debounce = setTimeout(() => {
        fetchUsers(1);
        setPage(1);
        setHasMore(true);
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [searchQuery]);

  const countSelected = (list) => list.filter((item) => item).length;

  const onResetHandler = () => {
    setCheckedUsers([]);
    if (!searchQuery) {
      setUsers((prev) => prev.map((user) => ({ ...user, checked: false })));
    } else {
      setUsers([]);
      setSearchQuery("");
    }
  };

  const getActionLabel = (type) => {
    const isAll = type === "all";

    if (isLoading?.[type]) {
      return isRevoking ? "Revoking..." : "Assigning...";
    }
    return isRevoking
      ? `Revoke from ${isAll ? "all users" : "selected users"}`
      : `Assign to ${isAll ? "all users" : "selected users"}`;
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") onClose();
      }}
      closeAfterTransition
      BackdropProps={{
        onClick: (e) => e.stopPropagation(),
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: 1300,
          height: 600,
          maxHeight: "90%",
          margin: "auto",
          backgroundColor: "white",
          padding: 0,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: bgcolor,
            padding: "16px 24px",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography variant="h5" sx={{ color: "white" }}>
            Element Assignment
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ padding: 3 }}>
          <Divider orientation="horizontal" flexItem />

          {/* Content Container */}
          <Box sx={{ height: "100%", maxHeight: 420, marginTop: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              {/* First List: Selected Departments */}
              <Box
                sx={{
                  flex: 1,
                  height: "100%",
                  overflowY: "auto",
                  marginRight: 1,
                }}
              >
                <Typography variant="body1" gutterBottom>
                  Selected Departments
                </Typography>
                <Typography variant="body2">
                  {countSelected(departments)} Departments Selected
                </Typography>
                <Box sx={{ marginTop: 2, marginRight: 1 }}>
                  {departments
                    .map(
                      (department, index) => departments[index] && department
                    )
                    .filter(Boolean)
                    .map((department, index) => (
                      <Box
                        key={`department-${index + 1}`}
                        sx={{
                          padding: 1,
                          marginBottom: 1,
                          backgroundColor: "#f5f5f5",
                          borderRadius: 1,
                          border: "1px solid #ccc",
                        }}
                      >
                        <Typography variant="body2">
                          {index + 1}. {department}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </Box>

              <Divider orientation="vertical" flexItem />

              {/* Second List: Selected Roles */}
              <Box
                sx={{
                  flex: 1,
                  height: "100%",
                  overflowY: "auto",
                  paddingLeft: 1,
                  marginRight: 1,
                }}
              >
                <Typography variant="body1" gutterBottom>
                  Selected Roles
                </Typography>
                <Typography variant="body2">
                  {countSelected(roles)} Roles Selected
                </Typography>
                <Box sx={{ marginTop: 2, marginRight: 1 }}>
                  {roles
                    .map((role, index) => roles[index] && role)
                    .filter(Boolean)
                    .map((role, index) => (
                      <Box
                        key={`role-${index + 1}`}
                        sx={{
                          padding: 1,
                          marginBottom: 1,
                          backgroundColor: "#f5f5f5",
                          borderRadius: 1,
                          border: "1px solid #ccc",
                        }}
                      >
                        <Typography variant="body2">
                          {index + 1}. {role}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </Box>

              <Divider orientation="vertical" flexItem />

              {/* Third List: Users */}
              <Box
                sx={{
                  flex: 1,
                  height: "100%",
                  maxHeight: "100%", // Prevent it from exceeding its parent's height
                  paddingLeft: 1,
                  marginRight: 1,
                  marginBottom: loading ? 8 : 0,
                  // overflow: "hidden", // Prevent overflow
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 1,
                      marginTop: 1,
                    }}
                  >
                    <TextField
                      label="Search Users"
                      variant="outlined"
                      fullWidth
                      sx={{ marginRight: 1 }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <IconButton>
                            <SearchIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginRight: 1,
                      marginBottom: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ marginLeft: "auto" }}>
                        Showing 0 - {users.length} Users
                      </Typography>
                      <Typography variant="body2" sx={{ marginLeft: "auto" }}>
                        Selected : {checkedUsers.length}
                      </Typography>
                      <Typography variant="body2" sx={{ marginLeft: "auto" }}>
                        Total Users : {totalCount}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        alignSelf: "flex-end",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={onResetHandler}
                        sx={{ textTransform: "none" }}
                        disabled={
                          searchQuery === "" && checkedUsers.length === 0
                        }
                      >
                        Reset
                      </Button>
                    </Box>
                  </Box>

                  <Divider orientation="horizontal" flexItem />
                </Box>
                <Box
                  sx={{
                    height: "calc(100% - 141.12px)",
                    overflowY: "scroll",
                  }}
                  onScroll={handleScroll}
                >
                  {/* User List */}
                  <FormGroup>
                    {users &&
                      users?.length > 0 &&
                      users.map((user, index) => (
                        <FormControlLabel
                          key={`user-${user.UserID}-${index}`}
                          control={
                            <Checkbox
                              checked={user.checked}
                              onChange={(e) =>
                                handleUserSelect(e.target.checked, user)
                              }
                            />
                          }
                          label={user.UserName}
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              marginBottom: 0,
                            },
                          }}
                        />
                      ))}
                  </FormGroup>

                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: 2,
                      }}
                    >
                      <CircularProgress size={32} />
                    </Box>
                  ) : (
                    <>
                      {!hasMore && !isFetching && users.length > 10 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            padding: 2,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ textAlign: "center", marginTop: 1 }}
                          >
                            No more users available.
                          </Typography>
                        </Box>
                      )}
                      {searchQuery && !isFetching && users.length === 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            padding: 2,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ textAlign: "center", marginTop: 1 }}
                          >
                            No searched users found.
                          </Typography>
                        </Box>
                      )}
                      {!searchQuery && !isFetching && users.length === 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            padding: 2,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ textAlign: "center", marginTop: 1 }}
                          >
                            No users available.
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isLoading?.all || isLoading?.custom}
              sx={{
                textTransform: "none",
              }}
            >
              Back
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{ textTransform: "none", backgroundColor: bgcolor }}
                disabled={
                  checkedUsers.length > 0 || isLoading?.all || isLoading?.custom
                }
                onClick={() => {
                  onAction({
                    selectedUsers: [],
                    isAllUsers: true,
                  });
                }}
                startIcon={isLoading.all && <CircularProgress size={20} />}
              >
                {getActionLabel("all")}
              </Button>
              <Button
                variant="contained"
                sx={{ textTransform: "none", backgroundColor: bgcolor }}
                disabled={
                  users.length === 0 ||
                  checkedUsers.length === 0 ||
                  isLoading?.all ||
                  isLoading?.custom
                }
                onClick={() => {
                  onAction({
                    selectedUsers: checkedUsers,
                    isAllUsers: false,
                  });
                }}
                startIcon={isLoading.custom && <CircularProgress size={20} />}
              >
                {getActionLabel("custom")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default SelectUsersModal;

SelectUsersModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
  onAction: PropTypes.func.isRequired,
  isLoading: PropTypes.shape({
    all: PropTypes.bool,
    custom: PropTypes.bool,
  }),
  isRevoking: PropTypes.bool,
};
