import React, { useEffect, useState, useCallback, memo } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  ClickAwayListener,
  Divider,
  Avatar,
  styled,
  Badge,
  Stack,
  Skeleton,
} from "@mui/material";
import openBook from "../../assets/svg/SavedList/OpenBook.svg";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import home from "../../assets/svg/SideBar/home.svg";
import workflow from "../../assets/svg/SideBar/workflow.svg";
import sops from "../../assets/svg/SideBar/3-layers.svg";
import document from "../../assets/svg/SideBar/book-open.svg";
import trainingSimulation from "../../assets/svg/SideBar/video.svg";
import testSimulation from "../../assets/svg/SideBar/monitor.svg";
import eSign from "../../assets/svg/SideBar/Signature.svg";
import formBuilder from "../../assets/svg/SideBar/formBuilder.svg";
import testMCQ from "../../assets/svg/SideBar/edit.svg";
import activity from "../../assets/svg/SideBar/activity.svg";
import reports from "../../assets/svg/SideBar/reports.svg";
import settings from "../../assets/svg/SideBar/logoutred.svg";
import arrow from "../../assets/svg/SideBar/arrow.svg";
import create from "../../assets/svg/SideBar/create.svg";
import bulkemail from "../../assets/svg/SideBar/bulkemail.svg";
import Admin from "../../assets/svg/SideBar/Admin.svg";
import riskIcon from "../../assets/svg/SideBar/riskIcon.svg";
import PO from "../../assets/svg/SideBar/PO.svg";
import EndUser from "../../assets/svg/SideBar/EndUser.svg";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "transparent",
    padding: 0,
    border: "none",
  },
}));

import { useDispatch, useSelector } from "react-redux";
import { GetElementsSidebar } from "../../store/elements/action";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LogOutModal from "../logout/LogOutModal";
import { BASE_URL } from "../../config/urlConfig";
import { GetUserdata } from "../../store/user/user";
import { frontendState } from "../../store/presist/action";
import { formatSidebarText } from "../../utils";
import { transform } from "lodash";
import { stroke } from "pdf-lib";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";

const drawerWidth = 246;
const collapsedWidth = 60;

const ListItemIconStyled = styled(ListItemIcon)(({ theme }) => ({
  minWidth: "30px",
  marginLeft: "-2px",
}));

const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontFamily: "var(--fontfamilysans)",
  fontSize: "var(--fontsizesm)",
  fontWeight: 500,
  lineHeight: "var(--fontline-height5)",
  letterSpacing: "var(--fontletter-spacingnormal)",
  textAlign: "left",
  fontVariationSettings: "'slnt' 0",
  color: "#000",
}));

const SideBar = ({ setDashboardBlur, setSidebarOpen, sidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState("Home");
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  const [sidebarData, setSidebarData] = useState([]);
  const [drawerDataforCreate, setDrawerDataforCreate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const { moduleTypeId } = useParams();
  const pathname = location.pathname;
  const { userdata } = useSelector((state) => state?.user);
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;
  const { t } = useTranslation();

  const pathMap = {
    SOP: "/sops",
    Document: "/documents",
    SkillBuilding: "/training-simulations",
    SkillAssessment: "/test-simulations",
    TestMCQ: "/test-mcqs",
  };
  const iconMap = {
    SOP: sops,
    SkillBuilding: trainingSimulation,
    SkillAssessment: testSimulation,
    TestMCQ: testMCQ,
    Document: document,
    ESign: eSign,
    Form: formBuilder,
    Workflow: workflow,
    Risk: riskIcon,
  };
  const ListItemStyled = styled(ListItem)(({ theme, isActive }) => ({
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(0.8),
    paddingLeft: theme.spacing(2),
    height: "40px",
    marginLeft: "2px",
    color: isActive ? "#ffffff" : "#475569",
    "& .MuiTypography-root": {
      color: isActive ? "#ffffff" : "#475569",
    },
    background: isActive
      ? bgColor
      : "linear-gradient(to right, #ffffff, #f8f8f8)",
    backgroundSize: "200% 100%",
    backgroundPosition: "right center",
    borderRadius: "10px",
    width: "98%",
    transition:
      "background-position 0.6s ease, transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)",
    "&:hover": {
      background: bgColor,
      left: "0.25rem",
      width: "95%",
      backgroundSize: "200% 100%",
      backgroundPosition: "right center",
      "& .MuiTypography-root": {
        color: "#ffffff",
      },
      "& .MuiListItemIcon-root svg": {
        fill: "#ffffff",
        stroke: "#ffffff",
      },
      "& .MuiListItemIcon-root img, & .arrow-hover": {
        filter:
          "invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(250%) contrast(250%)",
      },
    },
    "& .MuiListItemIcon-root svg": {
      fill: isActive ? "#ffffff" : "#475569",
    },
    "& .MuiListItemIcon-root img": {
      filter: isActive
        ? "invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(250%) contrast(250%)"
        : "invert(0%) sepia(0%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%)",
    },
  }));

  useEffect(() => {
    const userTypeFromStorage = localStorage.getItem("user_type");
    setUserType(userTypeFromStorage);
  }, []);

  useEffect(() => {
    const userdataFromStorage = localStorage.getItem("user_data");
    if (!userdataFromStorage) {
      dispatch(GetUserdata())
        .then((response) => {
          const data = response?.payload || [];
          setUserData(data);
          localStorage.setItem("user_data", JSON.stringify(data));
        })
        .catch((error) => {
          console.log(error, "response");
        });
    } else {
      setUserData(JSON.parse(userdataFromStorage));
    }
  }, [dispatch]);

  useEffect(() => {
    const cachedSidebar = localStorage.getItem("sidebarData");
    let parsedSidebar = [];
    try {
      parsedSidebar = cachedSidebar
        ? JSON.parse(cachedSidebar)?.data || []
        : [];
    } catch (e) {
      parsedSidebar = [];
    }

    if (parsedSidebar.length > 0) {
      setSidebarData(parsedSidebar);
      setLoading(false);
    } else {
      setLoading(true);
      dispatch(GetElementsSidebar())
        .then((response) => {
          const data = response?.payload?.data || [];
          setSidebarData(data);
          localStorage.setItem("sidebarData", JSON.stringify({ data }));
        })
        .catch((error) => {
          console.log(error, "response");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch]);

  const handleLogoutClick = () => {
    setIsLogOutModalOpen(true);
  };

  const handleProfileClick = () => {
    navigate("/profilepage");
  };

  const handleCloseModal = () => {
    setIsLogOutModalOpen(false);
  };

  const handleClickAway = () => {
    setSidebarOpen(false);
    setDrawerDataforCreate(null);
  };
  const handleSidebarMouseEnter = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const handleSidebarMouseLeave = useCallback(() => {
    setSidebarOpen(false);
  }, []);
  const renderListItemText = (text) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: "0.45rem",
      }}
    >
      <ListItemTextStyled
        primary={
          <span style={{ fontWeight: 400, fontSize: 12 }}>
            {formatSidebarText(text)}
          </span>
        }
      />
      <img
        src={arrow}
        alt=""
        className="arrow-hover"
        style={{ marginTop: "-0.5rem", height: "12px" }}
      />
    </Box>
  );

  const handleMenuItemClick = async (moduleTypeID, element) => {
    if (
      element?.text !== "Master" &&
      element?.text !== "Reports" &&
      element?.text !== "Home" &&
      element?.text !== "Bulk Email"
    ) {
      setDrawerDataforCreate(null);
      await dispatch(
        frontendState({
          ModuleTypeID: moduleTypeID?.moduleTypeID,
          ContentID: null,
        })
      );
      const moduleName = moduleTypeID?.moduleName || moduleTypeID?.text;
      if (pathMap[moduleName]) {
        const path = pathMap[moduleName] || "/dashboard";
        await navigate(path);
      } else if (element?.text === "home") {
        await navigate("/dashboard");
      }
    }
  };

  const handleclickCreateNew = () => {
    setDrawerDataforCreate([
      {
        ContentName: "Enterprises",
      },
      {
        ContentName: "Zone",
      },
      {
        ContentName: "Role",
      },
      {
        ContentName: "Unit",
      },
      {
        ContentName: "Department",
      },
      {
        ContentName: "Advertisement Management",
      },
      {
        ContentName: "User Management",
      },
      {
        ContentName: "License Key",
      },
      {
        ContentName: "Settings",
      },
      {
        ContentName: "Group Management",
      },
      {
        ContentName: "Change management",
      },
      {
        ContentName: "Email Template",
      },
    ]);
  };
  const handleClickReport = () => {
    const reportData = [
      { ContentName: "User Auth Logs", requiredFor: ["Admin", "ProcessOwner"] },
      {
        ContentName: "Element Publish Logs",
        requiredFor: ["Admin", "ProcessOwner"],
      },
      {
        ContentName: "Element Access Logs",
        requiredFor: ["Admin", "ProcessOwner", "EndUser"],
      },
      {
        ContentName: "Element Activity Transition Logs",
        requiredFor: ["Admin", "ProcessOwner"],
      },
      {
        ContentName: "MCQ And Simulation Logs",
        requiredFor: ["EndUser", "ProcessOwner"],
      },
      {
        ContentName: "Document reading time logs",
        requiredFor: ["Admin", "ProcessOwner"],
      },
      // {
      //   ContentName: "Form Submission",
      //   requiredFor: ["ProcessOwner"],
      // },
      {
        ContentName: "Bulk Email Reports",
        requiredFor: ["Admin"],
      },
     
    ];

    const drawerData = reportData
      .filter((data) => data.requiredFor.includes(userType))
      .map((data) => ({ ContentName: data.ContentName }));

    setDrawerDataforCreate(drawerData);
  };

  const mainMenuItems = [
    { text: "Home", icon: home, link: "/dashboard" },
    // ...(userType === "ProcessOwner"
    //   ? [
    //       {
    //         text: "Risk",
    //         icon: riskIcon,
    //         link: "/risk-management",
    //       },
    //     ]
    //   : []),
    ...(Array.isArray(sidebarData) && sidebarData.length > 0
      ? sidebarData
          .filter((item) => item.ModuleName !== "AI") // Exclude AI module
          .map((item) => {
            // Transform the display text based on ModuleName
            let displayText = item.ModuleName;
            if (item.ModuleName === "SOP") {
              displayText = "SOP Digitize"; // Change to what you want to display
            } else if (item.ModuleName === "Document") {
              displayText = "SOP Documents"; // Change to what you want to display
            }
            // Add other transformations as needed

            return {
              text: displayText, // Use transformed text
              icon: iconMap[item.ModuleName] || "/path/to/default-icon.svg",
              link: "#",
              moduleTypeID: item.ModuleTypeID,
              originalModuleName: item.ModuleName, // Keep original for routing
            };
          })
      : []),
    ...(userType === "ProcessOwner"
      ? [{ text: "Data Source", icon: workflow, link: "/flow" }]
      : []),
    ...(userType === "ProcessOwner"
      ? [{ text: "Dashboard & Reports", icon: reports, link: "/flow" }]
      : []),
    // ...(userType === "EndUser"
    //   ? [{ text: "My Work Flow", icon: workflow, link: "/my-work-flow" }]
    //   : []),
    ...(userType === "Admin"
      ? [
          {
            text: "Master",
            icon: create,
            link: "/create-new",
            onClick: handleclickCreateNew,
          },
          {
            text: "Bulk Email",
            icon: bulkemail,
            link: "/bulk-email",
          },
        
        ]
      : []),

    ...(userType !== "Auditor"
      ? [
          {
            text: "Reports",
            icon: reports,
            link: "/reports",
            onClick: handleClickReport,
          },
        ]
      : []),

    {
      text: "Request",
      icon: activity,
      link: "/my-request",
    },
  ];
  const renderMenuItems = (items) =>
    items.map((item, index) => {
      const resolvedPath =
        item?.text === "SOP Digitize"
          ? "/sops"
          : item?.text === "SOP Documents"
          ? "/documents"
          : item?.text === "SkillAssessment"
          ? "/test-simulations"
          : item?.text === "SkillBuilding"
          ? "/training-simulations"
          : item?.text === "TestMCQ"
          ? "/test-mcqs"
          : item?.text === "Master"
          ? "/create-new"
          : item?.text === "Reports"
          ? "/reports"
          : item?.text === "ESign"
          ? "/e-sign"
          : item?.text === "Form"
          ? "/form"
          : item?.text === "Request"
          ? "/my-request"
          : item?.text === "Bulk Email"
          ? "/bulk-email"
          : item?.text === "Risk"
          ? "/risk-management"
          : item.text === "Data Source"
          ? "/data-source"
          : item.text === "Dashboard & Reports"
          ? "/create-dashboard"
          : item.text === "Email Template"
          ? "/email-template"
          :item.text === "Workflow"
          ? "/flow"
          : item.text === "My Work Flow"
          ? "/my-work-flow"
          : "/dashboard";

      const isExactMatch = pathname === resolvedPath;
      const isActive =
        isExactMatch ||
        (pathname.startsWith(resolvedPath) && resolvedPath !== "/dashboard");

      return (
        <ListItemStyled
          key={index}
          button
          component={Link}
          to={{ pathname: resolvedPath }}
          isActive={isActive}
          onClick={(e) => {
            if (item.moduleTypeID) {
              setActiveMenuItem(item.moduleTypeID);
              handleMenuItemClick(item);
            } else {
              setActiveMenuItem(item.text);
            }
            if (item.onClick) {
              item.onClick();
            } else {
              handleClickAway();
            }
          }}
        >
          <ListItemIconStyled>
            <img
              src={item.icon ? item.icon : openBook}
              alt=""
              style={{ height: "22px" }}
            />
          </ListItemIconStyled>

          {sidebarOpen && renderListItemText(item.text)}
        </ListItemStyled>
      );
    });

  const renderCreatenew = (items) =>
    items.length > 0 ? (
      items.map((item, index) => (
        <ListItemStyled
          key={index}
          component={Link}
          to={{
            pathname: `/${item?.ContentName?.toLowerCase().replace(
              /\s+/g,
              "-"
            )}`,
          }}
          onClick={() => {
            setDrawerDataforCreate(null);
          }}
        >
          <ListItemTextStyled
            primary={item?.ContentName}
            sx={{
              "& .MuiTypography-root": {
                fontSize: "13px !important",
                marginTop: "0.45rem",
              },
            }}
          />
          <img
            src={arrow}
            alt="arrow"
            style={{ marginLeft: "auto", height: "12px" }}
            className="arrow-hover"
          />
        </ListItemStyled>
      ))
    ) : (
      <p>No documents found.</p>
    );
  const sidebarStyle = {
    width: drawerWidth,
    flexShrink: 0,
    overflow: "hidden",
    top: "72px",
    height: "calc(100vh - 72px)",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#ffffff",
    color: "#CBD5E1",
  };
  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div style={{ display: "flex", position: "relative" }}>
          <div
            onMouseEnter={handleSidebarMouseEnter}
            onMouseLeave={handleSidebarMouseLeave}
            style={{ cursor: "pointer" }}
          >
            <Drawer
              variant="permanent"
              style={{
                width: sidebarOpen ? drawerWidth : collapsedWidth,
                flexShrink: 0,
                overflow: "hidden",
                top: "72px",
                height: "calc(100vh - 72px)",
              }}
              PaperProps={{
                style: {
                  width: sidebarOpen ? drawerWidth : collapsedWidth,
                  overflow: "hidden",
                  top: "72px",
                  height: "calc(100vh - 72px)",
                  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)",
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  paddingTop: "0.1rem",
                  transition: "width 0.5s",
                },
              }}
            >
              <Box
                style={{
                  margin: "0.3rem",
                  height: "80vh",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "1rem",
                    }}
                  >
                    <Stack spacing={1}>
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                      <Skeleton variant="rectangular" width={210} height={30} />
                      <Skeleton variant="rounded" width={210} height={30} />
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                      <Skeleton variant="rectangular" width={210} height={30} />
                      <Skeleton variant="rounded" width={210} height={30} />
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                      <Skeleton variant="rectangular" width={210} height={30} />
                      <Skeleton variant="rounded" width={210} height={30} />
                    </Stack>
                  </Box>
                ) : (
                  <List>{renderMenuItems(mainMenuItems)}</List>
                )}
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <div style={{ overflow: "hidden", margin: "0.3rem" }}>
                <Divider sx={{ backgroundColor: "#E2E8F0" }} />
                <List sx={{ paddingTop: 0.5 }}>
                  <ListItemStyled onClick={handleLogoutClick}>
                    <img
                      src={settings}
                      alt=""
                      style={{ marginLeft: "-12px" }}
                    />

                    {sidebarOpen && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            "&:hover .MuiTypography-root.MuiTypography-body2.MuiListItemText-secondary":
                              {
                                color: "#3B82F6",
                              },
                          }}
                          onClick={handleLogoutClick}
                        >
                          <ListItemTextStyled
                            primary={t("Logout")}
                            sx={{
                              "& .MuiTypography-root": {
                                color: "#DC2626",
                                fontWeight: 400,
                                marginTop: "0.5rem",
                                fontSize: "14px !important",
                              },
                            }}
                          />
                        </Box>

                        <ArrowForwardIosIcon
                          sx={{
                            fontSize: "16px",
                            color: "#DC2626",
                            marginLeft: "auto",
                            height: "16px",
                            width: "18px",
                          }}
                        />
                      </Box>
                    )}
                  </ListItemStyled>
                  <Divider sx={{ backgroundColor: "#E2E8F0" }} />
                  <ListItemStyled
                    sx={{ marginTop: "1rem" }}
                    onClick={handleProfileClick}
                  >
                    <ListItemIconStyled>
                      <Box display={"felx"} flexDirection={"column"}>
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          badgeContent={
                            <img
                              src={
                                userData?.UserType === "ProcessOwner"
                                  ? PO
                                  : userData?.UserType === "Admin"
                                  ? Admin
                                  : EndUser
                              }
                              alt={`${userData?.UserType} Icon`}
                              style={{ width: "16px", height: "16px" }}
                            />
                          }
                        >
                          <Avatar
                            alt={userData?.UserFirstName}
                            src={`${BASE_URL}${userData?.UserPhoto}`}
                            style={{
                              height: "30px",
                              width: "30px",
                              marginLeft: "-3px",
                            }}
                          />
                        </StyledBadge>
                      </Box>
                    </ListItemIconStyled>
                    {sidebarOpen && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          "&:hover .MuiTypography-root.MuiTypography-body2.MuiListItemText-secondary":
                            {
                              color: "#3D54CD",
                            },
                        }}
                        onClick={handleClickAway}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            "&:hover .MuiTypography-root.MuiTypography-body2.MuiListItemText-secondary":
                              {
                                color: "#3B82F6",
                              },
                          }}
                        >
                          <ListItemTextStyled
                            primary={`${userData?.UserFirstName} ${userData?.UserLastName}`}
                            sx={{
                              "& .MuiTypography-root": {
                                marginTop: "0.5rem",
                                fontWeight: 400,
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </ListItemStyled>
                </List>
              </div>
            </Drawer>
          </div>
          {isLogOutModalOpen && (
            <LogOutModal open={isLogOutModalOpen} onClose={handleCloseModal} />
          )}
          {drawerDataforCreate && (
            <Drawer
              variant="permanent"
              style={{
                ...sidebarStyle,
                position: "absolute",
                left: sidebarOpen ? drawerWidth : collapsedWidth,
              }}
              PaperProps={{
                style: {
                  width: drawerWidth,
                  overflow: "hidden",
                  top: "72px",
                  height: "calc(100vh - 72px)",
                  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)",
                  marginLeft: sidebarOpen ? drawerWidth : collapsedWidth,
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                },
              }}
            >
              <div
                style={{
                  overflow: "hidden",
                  margin: "0.3rem",
                  fontSize: "12px",
                  marginTop: "10px",
                }}
              >
                <List>{renderCreatenew(drawerDataforCreate)}</List>
              </div>
            </Drawer>
          )}
        </div>
      </ClickAwayListener>
    </>
  );
};

export default SideBar;
