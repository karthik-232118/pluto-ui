import { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  InputBase,
  alpha,
  styled,
  Box,
  Typography,
  Switch,
  Badge,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Menu,
} from "@mui/material";
import { MoreVert, Search as SearchIcon } from "@mui/icons-material";
import bell from "../../assets/svg/navbar/bell.svg";
import activebell from "../../assets/svg/navbar/activebell.svg";
import note from "../../assets/svg/navbar/notes.svg";
import bookMark from "../../assets/svg/navbar/fav.svg";
import ActiveBookMark from "../../assets/svg/navbar/ActiveBookMark.svg";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavBar.css";
import SearchModal from "./SearchModal";
import { useDispatch, useSelector } from "react-redux";
import { GetGlobalSearch } from "../../store/search/action";
import debounce from "lodash/debounce";
import NotificationModal from "./NotificationModal";
import { GetNotification } from "../../store/notification/action";
import { setChatUserList, setMessage } from "../../store/chat/slice";
import { ReadChatApi } from "../../services/elements/Elements";
import CustomNotesDialog from "../allpages/notespage/NotesDialog";
import "intro.js/introjs.css";
import introJs from "intro.js";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import { useSocket } from "../../context/SocketContext";
import jsPDF from "jspdf";
import { NotificationCountApi } from "../../services/notification/notification";
import { Getentrprise } from "../../store/enterprise/action";
import { useTheme } from "@mui/styles";

const CustomSwitch = styled(Switch)(() => ({
  "& .Mui-checked": {
    color: "#ff9933",
  },
  "& .Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#fac289",
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  width: "100%",
  maxWidth: "440px",
  display: "flex",

  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.05),
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, `calc(1em + ${theme.spacing(4)})`),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
    color: "white",
    fontWeight: "400",
    "&::placeholder": {
      color: "white",
      fontWeight: "300",
    },
  },
}));

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const socket = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("selectedLanguage") || "en";
  });
  const [logoUrl, setLogoUrl] = useState(() => {
    return localStorage.getItem("organizationLogo") || "";
  });
  const theme = useTheme();
  const bgColor = theme.palette.primary.main;
  const notifications = useSelector((state) => state.notification.notification);
  const searchResults = useSelector((state) => state.search.search);
  const notificationCounts = useSelector((state) => state.notification.count);
  const readData = useSelector((state) => state?.chat?.readData);
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarkActive, setBookmarkActive] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [isProcessOwner, setIsProcessOwner] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [shakeBell, setShakeBell] = useState(false);
  const [isPOTasks, setIsPOTasks] = useState(
    localStorage.getItem("my_task") === "EndUser"
  );
  const [isGlobalView, setIsGlobalView] = useState(() => {
    return localStorage.getItem("IsGlobalView") === "true";
  });
  const [lastMessage, setLastMessage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [aiMode, setAiMode] = useState(() => {
    return localStorage.getItem("aiMode") === "AIModeON";
  });
  const isMenuOpen = Boolean(anchorEl);

  const searchRef = useRef(null);
  const modalRef = useRef(null);
  const noteRef = useRef(null);
  const favRef = useRef(null);
  const notificationRef = useRef(null);
  const { enterpriselist } = useSelector((state) => state.enterprise);
  const { dashboard, dynamicDashboardData } = useSelector(
    (state) => state.dashboard
  );

  const userType = localStorage.getItem("user_type");

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await NotificationCountApi();

        if (response?.data?.count !== undefined) {
          setNotificationCount(response?.data?.count);
          console.log("Fetched notification count:", response?.data?.count);
        }
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();
  }, []);

  useEffect(() => {
    localStorage.getItem("notification_count");
    setCount();
  }, [notificationCounts]);

  const setCount = () => {
    const storedCount = localStorage.getItem("notification_count");
    if (storedCount) {
      setNotificationCount(Number(storedCount));
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNotificationCount = (payload) => {
        localStorage.setItem("notification_count", payload);
    setNotificationCount(Number(payload));
      if (!isNotificationOpen) {
        // localStorage.setItem("notification_count", payload);
        // setNotificationCount(Number(payload));
        setShakeBell(true);
        setTimeout(() => setShakeBell(false), 500);
      }
    };

    const handleChatMessage = (payload) => {
      console.log("💬 Incoming Chat Message:", payload);
      setLastMessage(payload);
      dispatch(setMessage(payload));
    };

    const handleChatUsers = (payload) => {
      console.log("👥 Incoming User List:", payload);
      dispatch(setChatUserList(payload));
    };

    const handleChatCount = (payload) => {
      console.log("📩 Incoming Unread Chat Count:", payload);
    };

    socket.on("notification_count", handleNotificationCount);
    socket.on("chat_message", handleChatMessage);
    socket.on("chat_users", handleChatUsers);
    socket.on("chat_count", handleChatCount);

    return () => {
      console.log("🛑 Cleaning up socket event listeners...");
      socket.off("notification_count", handleNotificationCount);
      socket.off("chat_message", handleChatMessage);
      socket.off("chat_users", handleChatUsers);
      socket.off("chat_count", handleChatCount);
    };
  }, [socket, isNotificationOpen]);

  const readMessages = async (data) => {
    await ReadChatApi(data);
  };
  useEffect(() => {
    if (!lastMessage) return;
    if (readData?.ChatMessageID === lastMessage?.ChatMessageID) {
      if (userType === "EndUser") {
        readMessages({
          ModuleID: lastMessage?.ModuleID,
        });
      } else if (userType === "ProcessOwner") {
        readMessages({
          ModuleID: lastMessage?.ModuleID,
          ModuleAccessorID: readData?.ModuleAccessorID,
        });
      }
    }
  }, [readData]);

  const countEvent = () => {
    const requestBody = {
      Limit: 5,
      Page: 1,
    };
    dispatch(GetNotification(requestBody)).then((action) => {
      if (action.payload) {
        // setNotificationCount(action.payload.count);
      }
    });
  };

  useEffect(() => {
    const userType = localStorage.getItem("user_type");
    if (userType === "ProcessOwner" || userType === "Auditor") {
      setIsProcessOwner(true);
    }
  }, []);

  const getSidebarDataFromLocalStorage = () => {
    try {
      const sidebarData = localStorage.getItem("sidebarData");
      return sidebarData ? JSON.parse(sidebarData).data : [];
    } catch (error) {
      console.error("Error parsing sidebarData from localStorage:", error);
      return [];
    }
  };

  useEffect(() => {
    if (location.pathname === "/save-list") {
      setBookmarkActive(true);
    } else {
      setBookmarkActive(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbarElement = document.querySelector('.appBar');
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !navbarElement.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBookmarkClick = () => {
    if (!bookmarkActive) {
      navigate("/save-list");
    }
  };

  const handleNoteClick = () => {
    setNotesOpen(true);
  };

  const handleFocus = () => {
    setSearchOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchParam(e.target.value);
  };

  const debouncedSearch = useRef(
    debounce((search) => {
      const requestBody = {
        ModuleTypeIDs: ["d7c8ebb4-ae45-4d40-ad0b-de574137b434"],
        SearchParam: search,
      };

      dispatch(GetGlobalSearch(requestBody));
    }, 300)
  ).current;

  useEffect(() => {
    if (searchParam !== "") {
      debouncedSearch(searchParam);
    }
  }, [searchParam, debouncedSearch]);

  const handleSwitchChange = () => {
    const newStatus = !isPOTasks;
    setIsPOTasks(newStatus);
    if (newStatus) {
      localStorage.setItem("my_task", "EndUser");
    } else {
      localStorage.removeItem("my_task");
    }
    window.location.reload();
  };

  const toggleNotificationModal = () => {
    if (!isNotificationOpen) {
      countEvent();
    }
    setNotificationOpen(!isNotificationOpen);
  };

  const [notesOpen, setNotesOpen] = useState(false);

  const handleLanguageChange = (event) => {
    const selectedLang = event.target.value;
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("selectedLanguage", selectedLang);
  };

  useEffect(() => {
    i18n?.changeLanguage(language);
  }, [language]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;

    const addText = (text) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 10;
      }
      doc.text(text, 10, y);
      y += lineHeight;
    };

    addText("Actionable Items");
    dashboard?.actionable?.forEach((item, index) => {
      addText(
        `${index + 1}. [${item.ActionType || "N/A"}] ${item.ElementName} - ${
          item.ModuleName
        }`
      );
    });
    const department = dashboard?.departmentOverview || {};

    if (department?.mcq?.values?.length > 0) {
      addText("MCQ Test Names");
      department.mcq.values.forEach((item, index) => {
        addText(`${index + 1}. ${item.TestMCQName}`);
      });
    }

    if (department?.tes?.values?.length > 0) {
      addText("Test Simulation Names");
      department.tes.values.forEach((item, index) => {
        addText(`${index + 1}. ${item.TestSimulationName}`);
      });
    }

    if (dashboard?.license) {
      addText("License Validity");
      addText(`From: ${dashboard.license.ValidityFrom}`);
      addText(`To: ${dashboard.license.ValidityTo}`);
    }

    if (dashboard?.module?.length > 0) {
      addText("Modules");
      dashboard.module.forEach((mod, index) => {
        addText(`${index + 1}. ${mod.name} - ${mod.count}`);
      });
    }

    if (dashboard?.monthly?.length > 0) {
      addText("Monthly Data");
      dashboard.monthly.forEach((mod) => {
        addText(`Module: ${mod.ModuleName}`);
        mod.dates.forEach((dateObj) => {
          addText(
            `- ${dateObj.Month}: Total=${dateObj.Total}, Attempt=${dateObj.Attempt}`
          );
        });
      });
    }
    if (dashboard?.taskCount) {
      addText("Task Count Summary");
      Object.entries(dashboard.taskCount).forEach(([key, value]) => {
        addText(`${key}: ${value}`);
      });
    }
    if (dashboard?.banner?.length > 0) {
      addText("Banner Info");
      dashboard.banner.forEach((item, index) => {
        addText(
          `${index + 1}. ${item.AdvertisementTitle} - Expires on ${
            item.ExpireDate
          }`
        );
      });
    }

    const pendingItems = dynamicDashboardData?.data?.PendingAcknowledge;
    if (pendingItems?.length > 0) {
      addText("Pending Acknowledge Items");
      pendingItems.forEach((item, index) => {
        const dueDate = new Date(item.DueDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        addText(
          `${index + 1}. ${item.ElementName} [${
            item.ElementTypeName
          }] - Due on ${dueDate}`
        );
      });
    }

    doc.save("dashboard_report.pdf");
  };

  const handleGlobalViewChange = () => {
    const newValue = !isGlobalView;
    setIsGlobalView(newValue);
    localStorage.setItem("IsGlobalView", newValue.toString());
    window.location.reload();
  };

  useEffect(() => {
    const payload = {};
    dispatch(Getentrprise(payload)).then((response) => {
      const organization =
        response?.payload?.length > 0 ? response.payload[0] : {};
      const logoUrl = organization?.OrganizationStructureLogo;
      if (logoUrl) {
        localStorage.setItem("organizationLogo", logoUrl);
        setLogoUrl(logoUrl);
      }
    });
  }, [dispatch]);

  const handleAiModeChange = (event) => {
    const newAiMode = event.target.checked;
    setAiMode(newAiMode);
    if (newAiMode) {
      localStorage.setItem("aiMode", "AIModeON");
    } else {
      localStorage.removeItem("aiMode");
    }
    window.location.reload();
  };

  return (
    <AppBar
      position="fixed"
      className="appBar"
      style={{
        color: "black",
        background: bgColor,
      }}
    >
      <Toolbar className="toolbar">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Organization Logo"
            style={{ width: "auto", height: "60px", marginRight: "10px" }}
            onError={() => {
              localStorage.removeItem("organizationLogo");
              setLogoUrl("");
            }}
          />
        ) : (
          <Typography
            variant="h5"
            style={{
              color: "#ffffff",
              fontWeight: "600",
              fontSize: "1.4rem",
              fontFamily: "Inter",
              latterSpacing: "0.2rem",
              marginTop: "-6px",
            }}
            className="logo"
          >
            {t("appName")}
          </Typography>
        )}
        <Box className="center" sx={{ height: "45px", marginTop: "0px" }}>
          <Search sx={{ borderRadius: "30px" }} ref={searchRef}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              className="search"
              onClick={handleFocus}
              tabIndex={0}
              placeholder={t("searchPlaceholder")}
              inputProps={{ "aria-label": "search" }}
              onChange={handleSearchChange}
            />
          </Search>
        </Box>
        {isProcessOwner && location.pathname === "/dashboard" && (
          <Box display="flex" alignItems="center" className="po-switch">
            <CustomSwitch
              checked={aiMode}
              onChange={handleAiModeChange}
              color="default"
            />
            <Typography
              style={{
                display: "flex",
                gap: "1px",
                color: "white",
                padding: "4px",
                borderRadius: "4px",
                marginTop: "8px",
              }}
            >
              {t("AI Mode")}
            </Typography>
          </Box>
        )}

        <Box>
          <Box className="icons">
            <Tooltip title={t("Notes")} placement="bottom">
              <img
                src={note}
                alt=""
                onClick={handleNoteClick}
                ref={noteRef}
                style={{ cursor: "pointer", marginTop: "-4px" }}
              />
            </Tooltip>
            <Tooltip title={t("Favourite")} placement="bottom">
              <img
                src={bookmarkActive ? ActiveBookMark : bookMark}
                alt="bookmark"
                ref={favRef}
                onClick={handleBookmarkClick}
                style={{ cursor: "pointer", marginTop: "-4px" }}
              />
            </Tooltip>
            <Tooltip title={t("Notification")} placement="bottom">
              <Badge
                badgeContent={notificationCount || notificationCounts}
                color="error"
                className={shakeBell ? "shake" : ""}
              >
                <img
                  src={isNotificationOpen ? activebell : bell}
                  alt="bell"
                  ref={notificationRef}
                  style={{
                    cursor: "pointer",
                    width: "40px",
                    height: "40px",
                    marginTop: "4px",
                  }}
                  onClick={toggleNotificationModal}
                />
              </Badge>
            </Tooltip>

            <Box>
              <Tooltip title={t("SelectLanguage")} arrow placement="left">
                <FormControl>
                  <Select
                    value={language}
                    onChange={handleLanguageChange}
                    variant="outlined"
                    sx={{
                      width: 60,
                      height: 40,
                      marginTop: 0.5,
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "4px",
                      border: "none",
                      "& fieldset": {
                        border: "none",
                      },
                      "& .MuiSelect-icon": {
                        color: "white",
                      },
                    }}
                    renderValue={(value) => {
                      const selectedLanguage = [
                        { code: "en", countryCode: "US" },
                        { code: "hi", countryCode: "IN" },
                        { code: "ar", countryCode: "AE" },
                        { code: "fr", countryCode: "FR" },
                        { code: "es", countryCode: "ES" },
                        { code: "de", countryCode: "DE" },
                        { code: "pt", countryCode: "PT" },
                        { code: "ms", countryCode: "MY" },
                        { code: "is", countryCode: "IS" },
                        { code: "zh", countryCode: "CN" },
                      ].find((lang) => lang.code === value);

                      return (
                        <ReactCountryFlag
                          countryCode={selectedLanguage.countryCode}
                          svg
                          style={{ fontSize: "13.5px" }}
                        />
                      );
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "& .MuiMenuItem-root": {
                            padding: "8px 16px",
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="en">
                      <ReactCountryFlag
                        countryCode="US"
                        style={{ marginRight: 8, fontSize: "0.8em" }}
                        svg
                      />
                      English
                    </MenuItem>
                    <MenuItem value="hi">
                      <ReactCountryFlag
                        countryCode="IN"
                        style={{ marginRight: 8, fontSize: "0.8em" }}
                        svg
                      />
                      हिंदी
                    </MenuItem>
                    <MenuItem value="ar">
                      <ReactCountryFlag
                        countryCode="AE"
                        style={{ marginRight: 8, fontSize: "0.8em" }}
                        svg
                      />
                      العربية
                    </MenuItem>
                    <MenuItem value="fr">
                      <ReactCountryFlag
                        countryCode="FR"
                        style={{ marginRight: 8, fontSize: "0.8em" }}
                        svg
                      />
                      Français
                    </MenuItem>
                    <MenuItem value="es">
                      <ReactCountryFlag
                        countryCode="ES"
                        style={{ marginRight: 8, fontSize: "0.8em" }}
                        svg
                      />
                      Español
                    </MenuItem>
                    <MenuItem value="de">
                      <ReactCountryFlag
                        countryCode="DE"
                        style={{ marginRight: 8, fontSize: "0.8em" }}
                        svg
                      />
                      Deutsch
                    </MenuItem>
                    <MenuItem value="pt">
                      <ReactCountryFlag
                        countryCode="PT"
                        style={{ marginRight: 8, fontSize: "0.8em" }}
                        svg
                      />
                      Português
                    </MenuItem>
                    <MenuItem value="ms">
                      <ReactCountryFlag
                        countryCode="MY"
                        style={{ marginRight: 8, fontSize: "0.8em" }}
                        svg
                      />
                      Bahasa Melayu
                    </MenuItem>
                    <MenuItem value="is">
                      <ReactCountryFlag
                        countryCode="IS"
                        style={{ marginRight: 8, fontSize: "0.8em" }}
                        svg
                      />
                      Íslenska
                    </MenuItem>
                    {/* <MenuItem value="mu">
                      <ReactCountryFlag
                        countryCode="MU"
                        style={{ marginRight: 8, fontSize: "0.8em" }}
                        svg
                      />
                      Mauritius
                    </MenuItem> */}
                    <MenuItem value="zh">
                      <ReactCountryFlag
                        countryCode="CN"
                        style={{ marginRight: 8, fontSize: "0.8em" }}
                        svg
                      />
                      中文
                    </MenuItem>
                  </Select>
                </FormControl>
              </Tooltip>
            </Box>
            <Box sx={{}}>
              {isProcessOwner && (
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 15,
                    right: 8,
                  }}
                  onClick={handleMenuOpen}
                >
                  <MoreVert style={{ color: "#fff" }} />
                </IconButton>
              )}

              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
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
                  sx: {
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    minWidth: "200px",
                    padding: "4px 0",
                    background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                    "& .MuiMenuItem-root": {
                      padding: "8px 16px",
                      margin: "0 4px",
                      borderRadius: "4px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: (theme) => theme.palette.primary.main,
                        color: "#fff",
                        transform: "translateX(2px)",
                        "& .MuiTypography-root": {
                          color: "#fff",
                        },
                        "& .MuiSwitch-thumb": {
                          color: "#fff",
                        },
                      },
                    },
                  },
                }}
              >
                {isProcessOwner && (
                  <MenuItem
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#182848", fontWeight: 500 }}
                    >
                      {t("organizationWide")}
                    </Typography>
                    <CustomSwitch
                      checked={isGlobalView}
                      onChange={handleGlobalViewChange}
                      color="default"
                      size="small"
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: isGlobalView ? "#4b6cb7" : "#ccc",
                        },
                      }}
                    />
                  </MenuItem>
                )}
                {isProcessOwner && location.pathname !== "/dashboard" && (
                  <MenuItem
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#182848", fontWeight: 500 }}
                    >
                      {t("myAssignments")}
                    </Typography>
                    <CustomSwitch
                      checked={isPOTasks}
                      onChange={handleSwitchChange}
                      color="default"
                      size="small"
                      sx={{
                        "& .MuiSwitch-track": {
                          backgroundColor: isPOTasks ? "#4b6cb7" : "#ccc",
                        },
                      }}
                    />
                  </MenuItem>
                )}
                {location.pathname === "/dashboard" && (
                  <MenuItem onClick={handleDownloadPDF}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#182848", fontWeight: 500 }}
                    >
                      {t("downloadPdf")}
                    </Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Box>
        </Box>
      </Toolbar>

      {searchOpen && (
        <SearchModal
          ref={modalRef}
          onClose={() => setSearchOpen(false)}
          moduleNames={getSidebarDataFromLocalStorage()}
          combinedData={searchResults?.data || {}}
          searchParam={searchParam}
        />
      )}

      <NotificationModal
        open={isNotificationOpen}
        onClose={() => setNotificationOpen(false)}
        notifications={notifications}
        onNotificationCountUpdate={(count) => setNotificationCount(count)}
      />
      <CustomNotesDialog open={notesOpen} onClose={() => setNotesOpen(false)} />
    </AppBar>
  );
};

export default NavBar;
