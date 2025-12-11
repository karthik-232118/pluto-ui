import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import "./ActionablesAndDepartment.css";
import { useDispatch, useSelector } from "react-redux";
import { DepartmentOverwiew } from "../../../store/dashboard/action";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import TableSkeleton from "../../../common/seletons/tableSkeleton";
import Nodata from "../../allpages/masterpopups/Nodata";
import { dateformatter } from "../../../utils";
import MyActionable from "./MyActionable";
import { useTheme } from "@emotion/react";
import { Close } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
const getRandomColor = () => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F06292",
    "#7986CB",
    "#9575CD",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 8,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...(theme.palette.mode === "dark" && {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 8,
    backgroundColor: "#1a90ff",
    ...(theme.palette.mode === "dark" && {
      backgroundColor: "#308fe8",
    }),
  },
}));
const ActionablesAndLeaderboard = ({
  dashboardData,
  PendingAcknowledgmentsComponent,
}) => {
  const dispatch = useDispatch();
  const { departmentOverview, departmentloading } = useSelector(
    (state) => state.dashboard
  );
  const theme = useTheme();
  const [isMCQ, setIsMCQ] = useState(false);
  const [tesOptions, setTesOptions] = useState([]);
  const [mcqOptions, setMcqOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserAvatars, setSelectedUserAvatars] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setSelectLoading(true);
    if (dashboardData?.departmentOverview) {
      setTesOptions(dashboardData.departmentOverview.tes?.values || []);
      setMcqOptions(dashboardData.departmentOverview.mcq?.values || []);
      setSelectLoading(false);
    }
  }, [dashboardData?.departmentOverview]);

  const options = isMCQ ? mcqOptions : tesOptions;

  const handleGetleaderboard = (testMCQID, testSimulationID) => {
    const requestBody = {
      TestMCQID: testMCQID || null,
      TestSimulationID: testSimulationID || null,
      Limit: 10,
      Page: 1,
    };
    dispatch(DepartmentOverwiew(requestBody));
  };

  useEffect(() => {
    if (dashboardData?.departmentOverview) {
      setTesOptions(dashboardData.departmentOverview.tes?.values || []);
      setMcqOptions(dashboardData.departmentOverview.mcq?.values || []);
    }
  }, [dashboardData?.departmentOverview]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedOption = options.find(
      (option) =>
        option.TestSimulationName === selectedValue ||
        option.TestMCQName === selectedValue
    );

    // Check if the selection is TES and "Leader Board Two" exists
    if (
      selectedValue === "TES" &&
      options.some((option) => option.TestSimulationName === "Leader Board Two")
    ) {
      const leaderboardOption = options.find(
        (option) => option.TestSimulationName === "Leader Board Two"
      );
      setSelectedOption(leaderboardOption);
      handleGetleaderboard(null, leaderboardOption.TestSimulationID);
    } else if (selectedOption) {
      setSelectedOption(selectedOption);
      if (isMCQ) {
        handleGetleaderboard(selectedOption.TestMCQID, null);
      } else {
        handleGetleaderboard(null, selectedOption.TestSimulationID);
      }
    }
  };

  const handleAvatarGroupClick = (users) => {
    setSelectedUserAvatars(users);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUserAvatars([]);
  };

  return (
    <Grid container sx={{ mb: 2, px: 2.2 }}>
    
      <Grid item xs={12} md={12} sm={12}>
        <Card
          className="equal-height"
          sx={{
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding={2}
            sx={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Box>
              <Typography variant="h6">{t("departmentOverview")}</Typography>
            <Typography variant="body2">{t("overviewOfLatestMonth")}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  color: !isMCQ ? "blue" : theme.palette.text.primary,
                  marginRight: "8px",
                }}
              >
               {t("tes")}
              </Typography>
              <FormControlLabel
                control={
                  <Switch checked={isMCQ} onChange={() => setIsMCQ(!isMCQ)} />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ color: isMCQ ? "blue" : theme.palette.text.primary }}
                  >
                 {t("mcq")}
                  </Typography>
                }
                className="swith_para"
              />
              <div style={{ position: "relative", width: "250px" }}>
                <select
                  id="titleSelect"
                  value={selectedOption ? (selectedOption.TestMCQName || selectedOption.TestSimulationName) : ""}
                  onChange={handleSelectChange}
                  disabled={selectLoading}
                  style={{
                    height: "36px",
                    width: "100%",
                    padding: "0 8px",
                    outline: "none",
                    backgroundColor: theme.palette.background.default,
                    borderRadius: "8px",
                    border: `1px solid ${theme.palette.grey[300]}`,
                    color: theme.palette.text.primary,
                    opacity: selectLoading ? 0.7 : 1,
                  }}
                >
                  <option value="" disabled>
                  {t("select")}
                  </option>
                  {options?.map((option) => (
                    <option
                      key={option.TestSimulationID || option.TestMCQID}
                      value={option.TestMCQName || option.TestSimulationName}
                    >
                      {option.TestSimulationName || option.TestMCQName}
                    </option>
                  ))}
                </select>
                {selectLoading && (
                  <div
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <CircularProgress
                      size={20}
                      sx={{ marginLeft: "-40px", marginTop: "0.3rem" }}
                    />
                  </div>
                )}
              </div>
            </Box>
          </Box>
          <Divider sx={{ marginBottom: "1rem" }} />
          <Box>
            <table
              className="leaderboard_table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead
                style={{
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      fontWeight: "450",
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      fontWeight: "450",
                    }}
                  >
                  <th>{t("department")}</th>
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      fontWeight: "450",
                    }}
                  >
                     <th>{t("teamMembers")}</th>
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      textAlign: "left",
                      fontWeight: "450",
                    }}
                  >
                    <th>{t("departmentProgress")}</th>
                  </th>
                </tr>
              </thead>
              <tbody>
                {departmentloading ? (
                  <tr>
                    <td colSpan={4}>
                      <TableSkeleton rows={5} />
                    </td>
                  </tr>
                ) : departmentOverview?.data?.length > 0 ? (
                  departmentOverview.data.map((user, index) => (
                    <tr key={user.UserID}>
                      <td style={{ padding: "8px" }}>
                        <Typography sx={{ fontWeight: "450" }}>
                          {`#${index + 1}`}
                        </Typography>
                      </td>

                      <td style={{ width: "200px", padding: "8px" }}>
                        <Box>
                          <Typography
                            variant="body1"
                            className="text-truncate"
                            title={user.DepartmentName}
                            sx={{ fontWeight: "450" }}
                          >
                            {user.DepartmentName}
                          </Typography>
                          <Typography variant="caption" color={"gray"}>
                            {user?.CreatedDate
                              ? dateformatter(user?.CreatedDate)
                              : "N/A"}
                          </Typography>
                        </Box>
                      </td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          fontWeight: "450",
                        }}
                      >
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleAvatarGroupClick(user.Users)}
                        >
                          <AvatarGroup
                            max={4}
                            renderSurplus={(surplus) => <span>+{surplus}</span>}
                          >
                            {user.Users?.map((avatar, index) => (
                              <Tooltip
                                key={index}
                                title={avatar.UserName}
                                arrow
                              >
                                <Avatar
                                  alt={avatar.UserName}
                                  src={avatar.UserPhoto}
                                />
                              </Tooltip>
                            ))}
                          </AvatarGroup>
                        </Box>
                      </td>

                      <Dialog
                        open={modalOpen}
                        onClose={handleCloseModal}
                        maxWidth="xs"
                        fullWidth
                        PaperProps={{
                          sx: {
                            borderRadius: 3,
                            background:
                              "linear-gradient(145deg, #f5f7fa 0%, #e4e8f0 100%)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <IconButton
                            aria-label="close"
                            onClick={handleCloseModal}
                            sx={{
                              position: "absolute",
                              right: 6,
                              top: 6,
                              color: "text.secondary",
                              backgroundColor: "rgba(255,255,255,0.7)",
                              "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.9)",
                                color: "error.main",
                              },
                              zIndex: 1,
                            }}
                          >
                            <Close fontSize="medium" />
                          </IconButton>

                          <DialogTitle
                            sx={{
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              py: 2,
                              px: 3,
                              fontSize: "1.2rem",
                              fontWeight: "600",
                              borderTopLeftRadius: "12px",
                              borderTopRightRadius: "12px",
                            }}
                          >
                            Team Members
                          </DialogTitle>

                          <DialogContent sx={{ p: 0 }}>
                            <List sx={{ py: 1 }}>
                              {selectedUserAvatars.map((user, idx) => (
                                <ListItem
                                  key={idx}
                                  sx={{
                                    px: 3,
                                    py: 1.5,
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                    "&:last-child": {
                                      borderBottom: "none",
                                    },
                                    "&:hover": {
                                      backgroundColor: "action.hover",
                                    },
                                  }}
                                >
                                  <ListItemAvatar>
                                    <Avatar
                                      sx={{
                                        bgcolor: getRandomColor(),
                                        width: 36,
                                        height: 36,
                                        fontSize: "0.875rem",
                                      }}
                                    >
                                      {getInitials(user.UserName)}
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={user.UserName}
                                    primaryTypographyProps={{
                                      fontWeight: "medium",
                                      color: "text.primary",
                                    }}
                                    secondary={user.role}
                                  />
                                  {user.status && (
                                    <Chip
                                      label={user.status}
                                      size="small"
                                      sx={{
                                        ml: 1,
                                        backgroundColor:
                                          user.status === "Active"
                                            ? "success.light"
                                            : "warning.light",
                                        color:
                                          user.status === "Active"
                                            ? "success.dark"
                                            : "warning.dark",
                                      }}
                                    />
                                  )}
                                </ListItem>
                              ))}
                            </List>
                          </DialogContent>
                        </Box>
                      </Dialog>

                      <td style={{ padding: "8px", fontWeight: "450" }}>
                        <Box display="flex" alignItems="center">
                          <BorderLinearProgress
                            variant="determinate"
                            value={user?.Progress}
                            sx={{ width: "80%", marginRight: 2 }}
                          />
                          <Typography variant="body1">
                            {Math.floor(user?.Progress)}%
                          </Typography>
                        </Box>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "center", padding: "16px" }}
                    >
                      <Nodata title={""} image={true} height={300} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );  
};

export default ActionablesAndLeaderboard;

ActionablesAndLeaderboard.propTypes = {
  dashboardData: PropTypes.shape({
    departmentOverview: PropTypes.object,
  }).isRequired,
  PendingAcknowledgmentsComponent: PropTypes.node, // add prop type
};
