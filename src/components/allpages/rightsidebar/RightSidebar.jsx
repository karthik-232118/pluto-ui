import { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  TextField,
  Tooltip,
  tooltipClasses,
  styled,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Grid,
  CircularProgress,
} from "@mui/material";
import DetailsIcon from "../../../assets/svg/D&A/info.svg";
import ActivityIcon from "../../../assets/svg/D&A/activity.svg";
import chatIcon from "../../../assets/svg/D&A/chat.svg";
import note from "../../../assets/svg/D&A/note.svg";
import calendar from "../../../assets/svg/VideoSimulation/calendar.svg";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  GetActivityAddComment,
  GetActivitySidebar,
} from "../../../store/activitysidebar/action";
import { toast } from "react-toastify";
import Chat from "../../chat/chat";
import NotesModel from "../notespage/NotesModel";
import { dateformatter } from "../../../utils";
import auditIcon from "../../../assets/svg/common/auditIcons.svg";
import { useTranslation } from "react-i18next";
import CompareDocsModal from "./CompareDocsModal";
import History from "./WorkflowHIstory";
import SideBarAI from "./SideBarAI";
import CompareSOPModal from "./CompareSOPModal";
import {
  listEndUser,
  listProcessOwner,
} from "../../../services/documentModules/DocumentsModule";
import notify from "../../../assets/svg/utils/toast/Toast";
import { DelegateUser } from "../../../services/activitysidebar/ActivitySidebar";
import CompareBPMNModal from "./CompareBPMNModal";
import AuditSidebar from "./AuditSidebar";
import PropTypes from "prop-types";

import ActivitySideBar from "./ActivitySideBar";
import { useHeadingBgColor } from "../../useHeadingBgColor";
import { use } from "react";
import { NotificationCountApi } from "../../../services/notification/notification";
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    padding: "15px",
    margin: "1rem",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff",
  },
}));
const RightSidebar = ({ onToggle }) => {
  const userType = localStorage.getItem("user_type");
  const userID = localStorage.getItem("user_id");
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const fromDashboard = location.state?.fromDashboard || false;
  const { elementsdocumentfiles } = useSelector((state) => state.elements);
  const [isOpen, setIsOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("myworkflow");
  const [comment, setComment] = useState(" ");
  const [action, setAction] = useState(null); // State for dropdown
  const [delegateUserID, setDelegateUserID] = useState(null); // State for dropdown
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isOwnerActivity, setIsOwnerActivity] = useState(false);
  const [open, setOpen] = useState(false);
  const [activitySidebarPayload, setActivitySidebarPayload] = useState(null);
  const sidebarRef = useRef(null);
  const dispatch = useDispatch();
  const { activity, loading } = useSelector((state) => state.activity);
  const documentDetails = useSelector((state) => state.details.detailsData);
  const { elementID, moduleName } = useSelector((state) => state.elementid);
  const { elementsDocumentFiles } = useSelector((state) => state.elements);
  const [processOwnerList, setProcessOwnerList] = useState([]);
  const [endUserList, setEndUserList] = useState([]);
  const [openBPMNModal, setOpenBPMNModal] = useState(false);
  const { t } = useTranslation();
  const isSOPView = location.pathname.includes("sops/view");
  const isDocumentView = location.pathname.includes("documents/view");
  const isCompareAvailable = isSOPView || isDocumentView;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const bgColor = useHeadingBgColor();
  const handlOpenBPMNModal = () => {
    setOpenBPMNModal(true);
  };

  // console.log("Elements Document FilesModuleDraftID:", moduleName, elementID);
  useEffect(() => {
    console.log("Elements Document Files:", elementsDocumentFiles);
    console.log(
      "Document Status:",
      elementsDocumentFiles?.data?.DocumentStatus
    );
  }, [elementsDocumentFiles]);
  useEffect(() => {
    if (elementID) {
      console.log("ElementID:", elementID);
    }
    if (moduleName) {
      console.log("ModuleName:", moduleName);
    }
  }, [elementID, moduleName]);

  useEffect(() => {
    const rawOwnerData = localStorage.getItem("OwnerData");
    const OwnerData =
      rawOwnerData && rawOwnerData !== "undefined"
        ? JSON.parse(rawOwnerData)
        : null;

    if (OwnerData) {
      if (OwnerData.some((item) => item.userId === userID)) {
        setIsOwnerActivity(true);
      }
    }

    if (userType === "ProcessOwner") {
      listProcessOwner()
        .then((response) => {
          if (response?.status === 200) {
            // console.log(response?.data?.data?.userList);
            setProcessOwnerList(response?.data?.data?.userList);
          }
        })
        .catch((error) => {
          notify("error", error?.response?.data?.message);
        });
    } else {
      listEndUser()
        .then((response) => {
          if (response?.status === 200) {
            setEndUserList(response?.data?.data?.userList);
          }
        })
        .catch((error) => {
          notify("error", error?.response?.data?.message);
        });
    }
  }, []);

  useEffect(() => {
    if (activeTab === "activity" && elementID && moduleName) {
      let requestBody = {};
      if (location.pathname.includes("/sops/view")) {
        requestBody = { SOPID: elementID };
      } else if (location.pathname.includes("/documents/view")) {
        requestBody = { DocumentID: elementID };
      } else if (moduleName === "SOP") {
        requestBody = { SOPID: elementID };
      } else if (moduleName === "Document") {
        requestBody = { DocumentID: elementID };
      } else if (moduleName === "TrainingSimulation") {
        requestBody = { TrainingSimulationID: elementID };
      } else if (moduleName === "TestMCQ") {
        requestBody = { TestMCQID: elementID };
      } else if (moduleName === "TestSimulation") {
        requestBody = { TestSimulationID: elementID };
      }
      if (Object.keys(requestBody).length > 0) {
        dispatch(GetActivitySidebar(requestBody));
      }
    }
  }, [activeTab, elementID, moduleName, dispatch]);

  useEffect(() => {
    if (!loading) {
      // console.log("Activity Dataaaaa:", activity);
    }
  }, [loading, activity]);

  useEffect(() => {
    if (!loading && activity) {
      console.log("Activity Data:");
      activity?.data?.forEach((item, index) => {
        console.log(`CreatedUserName (${index}):`, item.CreatedUserName);
        if (item.Checkers && item?.Checkers?.length > 0) {
          item?.Checkers?.forEach((checker, checkerIndex) => {
            console.log(`Checker ${checkerIndex} UserName:`, checker?.UserName);
          });
        }
        if (item?.StakeHolders && item?.StakeHolders?.length > 0) {
          item?.Checkers?.forEach((StakeHolder, StakeHolderIndex) => {
            console.log(
              `Stakeholder ${StakeHolderIndex} UserName:`,
              StakeHolder?.UserName
            );
          });
        }
        if (item.Escalators && item.Escalators.length > 0) {
          item.Escalators.forEach((escalator, escalatorIndex) => {
            console.log(
              `Escalator ${escalatorIndex} UserName:`,
              escalator?.UserName
            );
          });
        }
      });
    }
  }, [loading, activity]);
  useEffect(() => {
    if (documentDetails) {
      // console.log("History:", documentDetails.History);
    } else {
      // console.log("No details available");
    }
  }, [documentDetails]);
  const uploadedBy = documentDetails?.UploadeBy || "N/A";
  const uploadedOnRaw = documentDetails?.UploadedOn || "N/A";
  const uploadedOn =
    uploadedOnRaw !== "N/A" ? dateformatter(uploadedOnRaw) : "N/A";

  useEffect(() => {
    if (fromDashboard) {
      setActiveTab("activity");
    }
  }, [fromDashboard]);

  useEffect(() => {
    setData(elementsDocumentFiles?.data);
  }, [elementsDocumentFiles]);

  useEffect(() => {
    console.log("Elements Document Files in Sidebar:", elementsdocumentfiles);
  }, [elementsdocumentfiles]);

  const shouldHideActivityIcon =
    /(documents\/view|test-mcqs\/view|test-simulations\/view|training-simulations\/view|sops\/view)\/[a-f0-9-]+$/.test(
      location.pathname
    );
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen);
  };

  const handleSubmitComment = () => {
    console.log("Comment Submitted:", comment, "Action Selected:", action);
    let requestBody = {
      Comment: comment,
      ApprovalStatus: action,
      IsReviewSkipped: false,
    };

    if (location.pathname.includes("/documents/view")) {
      requestBody.DocumentID = elementID;
    } else if (location.pathname.includes("/sops/view")) {
      requestBody.SOPID = elementID;
    }

    dispatch(GetActivityAddComment(requestBody))
      .then((response) => {
        NotificationCountApi()
          .then((countResponse) => {
            toast.success(response?.message || "Comment added successfully");
            navigate("/dashboard"); 
          })
          .catch((countError) => {
            console.error("Failed to fetch notification count:", countError);
            toast.success(response?.message || "Comment added successfully");
            navigate("/dashboard");
          });
      })
      .catch((error) => {
        toast.error(error?.message || "Failed to add comment");
      });
  };
  const handleDelegate = async (userType) => {
    const payload = {
      DocumentID: elementID,
      NewUserID: delegateUserID,
      userType: userType,
    };

    try {
      const result = await DelegateUser(payload);
      if (result.status === 200) {
        toast.success(result.message || "Successfully Delegated");
        navigate(-1);
      } else {
        toast.error(
          result.message ||
            "Failed to Delegate as other user would have delegated"
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to Delegate!!");
    }
  };    
  useEffect(() => {
    const auditSideBarState = localStorage.getItem("AuditSideBar");
    if (auditSideBarState === "true" && (isSOPView || isDocumentView)) {
      setActiveTab("audit");
      setIsOpen(true);
      onToggle(true);
    }
  }, [isSOPView, isDocumentView, onToggle]);

  useEffect(() => {
    return () => {
      if (activeTab !== "audit") {
        localStorage.setItem("AuditSideBar", "false");
      }
    };
  }, [activeTab]);

  const handleTabChange = (tab) => {
    if (tab === activeTab && isOpen) {
      setIsOpen(false);
      onToggle(false);
      if (activeTab === "audit") {
        localStorage.setItem("AuditSideBar", "false");
      }
    } else {
      setActiveTab(tab);
      setIsOpen(true);
      onToggle(true);
      if (tab === "audit") {
        localStorage.setItem("AuditSideBar", "true");
      }
    }
  };

  const handleBlur = (event) => {
    if (sidebarRef.current.contains(event.relatedTarget)) {
      return;
    }
  };

  const sortedHistory = documentDetails?.History?.filter((item) => {
    const documentStatus = elementsDocumentFiles?.data?.DocumentStatus;
    if (documentStatus === "Published") {
      return item.MasterVersion !== null;
    }
    return item.DraftVersion !== null;
  }).sort((a, b) => {
    const documentStatus = elementsDocumentFiles?.data?.DocumentStatus;
    if (documentStatus === "Published") {
      return parseFloat(b.MasterVersion) - parseFloat(a.MasterVersion);
    }
    return parseFloat(b.DraftVersion) - parseFloat(a.DraftVersion);
  });

  const isActionEnabled = comment?.trim() !== "" && action !== "";
  const handleOpenNotesModal = () => {
    setIsNotesModalOpen(true);
  };
  const handleCloseNotesModal = () => {
    setIsNotesModalOpen(false);
  };
  const handleAddNote = () => {
    console.log("New note added");
    setIsNotesModalOpen(false); 
  };
  const alldata = elementsDocumentFiles?.data;
  useEffect(() => {
    console.log("IsReactFlow", alldata?.IsReactFlow);
  }, [alldata]);

  const name =
    elementsDocumentFiles?.data?.TrainingSimulationName ||
    elementsDocumentFiles?.data?.DocumentName ||
    elementsDocumentFiles?.data?.SOPName;

  const handleVersionClick = (id, flagName) => {
    if (flagName === "TestMCQID") {
      const url = `/test-mcqs/view/${id}?SOP=true`;
      window.open(url, "_blank"); 
    } else if (flagName === "TestSimulationID") {
      const url = `/test-simulations/view/${id}?SOP=true`;
      window.open(url, "_blank"); 
    } else if (flagName === "TrainingSimulationID") {
      const url = `/training-simulations/view/${id}?SOP=true`;
      window.open(url, "_blank"); 
    } else if (flagName === "SOPID") {
      const url = `/sops/view/${id}?SOP=true`;
      window.open(url, "_blank"); 
    } else if (flagName === "DocumentID") {
      const url = `/documents/view/${id}?SOP=true`;
      window.open(url, "_blank"); 
    }
  };

  const getModuleInfo = (data) => {
    if (data?.SOPID) {
      return {
        ModuleName: "SOP",
        ModuleID: data.SOPID,
        ModuleTypeID: data.ModuleTypeID,
        ContentID: data.ContentID,
      };
    } else if (data?.DocumentID) {
      return {
        ModuleName: "Document",
        ModuleID: data.DocumentID,
        ModuleTypeID: data.ModuleTypeID,
        ContentID: data.ContentID,
      };
    } else if (data?.TrainingSimulationID) {
      return {
        ModuleName: "TrainingSimulation",
        ModuleID: data.TrainingSimulationID,
        ModuleTypeID: data.ModuleTypeID,
        ContentID: data.ContentID,
      };
    } else if (data?.TestMCQID) {
      return {
        ModuleName: "TestMCQ",
        ModuleID: data.TestMCQID,
        ModuleTypeID: data.ModuleTypeID,
        ContentID: data.ContentID,
      };
    } else if (data?.TestSimulationID) {
      return {
        ModuleName: "TestSimulation",
        ModuleID: data.TestSimulationID,
        ModuleTypeID: data.ModuleTypeID,
        ContentID: data.ContentID,
      };
    }
    console.log("No ModuleID found");
    return null;
  };

  const handleOpenActivityModal = () => {
    setActivitySidebarPayload(getModuleInfo(data));
    setActivityModalOpen(true);
  };

  const [myActionablesModalTitle, setMyActionablesModalTitle] = useState("");

  useEffect(() => {
    const modalTitle = localStorage.getItem("myActionablesModalTitle");
    if (modalTitle) {
      setMyActionablesModalTitle(modalTitle);
      console.log("myActionablesModalTitle from localStorage:", modalTitle);
    }
  }, []);

  // Logic to determine if ActivityIcon should be shown
  const showActivityIconByActionableTitle = [
    "Review Pending",
    "Approval Pending",
    "Pending Stakeholder",
  ].includes(myActionablesModalTitle);

  const hideActivityIconByActionableTitle = [
    "InProgress Pending",
    "My Escalated Elements",
    "Review State",
    "Approved",
  ].includes(myActionablesModalTitle);

  return (
    <Card
      ref={sidebarRef}
      onBlur={handleBlur}
      tabIndex={-1}
      sx={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: isOpen ? "300px" : "62px",
        backgroundColor: (theme) => theme?.palette?.background?.default,
        boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
        transition: "width 0.3s",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: isOpen ? "none" : "0.5rem",
        zIndex: 999,
      }}
    >
      <Grid container sx={{ height: "100%" }}>
        {/* Left navigation section */}
        <Grid
          item
          xs={2}
          sx={{
            // backgroundColor: "#F5F6FB",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            paddingTop: "5rem",
            marginLeft: isOpen ? "" : "40%",
            borderRight: isOpen ? "1px solid #E2E8F0" : "",
          }}
        >
          <CustomTooltip title={t("Info")} placement="left" arrow>
            <IconButton
              onClick={() => handleTabChange("details")}
              color={isOpen && activeTab === "details" ? bgColor : "default"}
            >
              <img
                onClick={toggleSidebar}
                src={DetailsIcon}
                alt="Details"
                style={{
                  filter:
                    isOpen && activeTab === "details"
                      ? `invert(35%) sepia(82%) saturate(7298%) hue-rotate(195deg) brightness(95%) contrast(101%)`
                      : "none",
                }}
              />
            </IconButton>
          </CustomTooltip>

          {/* {showAIIcon && (
            <CustomTooltip title={t("AIAssistant")} placement="left" arrow>
              <IconButton
                onClick={() => handleTabChange("AI")}
                color={isOpen && activeTab === "AI" ? bgColor : "default"}
              >
                <img
                  src={Aisvg}
                  alt="AI Assistant"
                  style={{
                    filter:
                      isOpen && activeTab === "AI"
                        ? "invert(35%) sepia(82%) saturate(7298%) hue-rotate(195deg) brightness(95%) contrast(101%)"
                        : "none",
                    width: "25px",
                    height: "25px",
                  }}
                />
              </IconButton>
            </CustomTooltip>
          )} */}

          {/* ActivityIcon logic based on myActionablesModalTitle */}
          {!fromDashboard &&
            !shouldHideActivityIcon &&
            !isOwnerActivity &&
            showActivityIconByActionableTitle &&
            !hideActivityIconByActionableTitle && (
              <CustomTooltip title={t("Activity")} placement="left" arrow>
                <IconButton
                  onClick={() => handleTabChange("activity")}
                  color={
                    isOpen && activeTab === "activity" ? bgColor : "default"
                  }
                >
                  <img
                    onClick={toggleSidebar}
                    src={ActivityIcon}
                    alt="Activity"
                    style={{
                      filter:
                        isOpen && activeTab === "activity"
                          ? "invert(35%) sepia(82%) saturate(7298%) hue-rotate(195deg) brightness(95%) contrast(101%)"
                          : "none",
                    }}
                  />
                </IconButton>
              </CustomTooltip>
            )}

          {elementsDocumentFiles?.data?.DocumentStatus === "Published" && (
            <CustomTooltip title={t("Chat")} placement="left" arrow>
              <IconButton
                color={isOpen && activeTab === "Chat" ? "default" : bgColor}
                onClick={() => handleTabChange("Chat")}
              >
                <img
                  src={chatIcon}
                  alt="Chat"
                  style={{
                    filter:
                      isOpen && activeTab === "Chat"
                        ? "invert(35%) sepia(82%) saturate(7298%) hue-rotate(195deg) brightness(95%) contrast(101%)"
                        : "none",
                  }}
                />
              </IconButton>
            </CustomTooltip>
          )}
          {(isSOPView || isDocumentView) &&
            elementsDocumentFiles?.data?.DocumentStatus === "Published" && (
              <CustomTooltip title={t("audit")} placement="left" arrow>
                <IconButton
                  color={isOpen && activeTab === "audit" ? "default" : bgColor}
                  onClick={() => handleTabChange("audit")}
                >
                  <img
                    src={auditIcon}
                    alt="auditIcon"
                    style={{
                      width: "25px",
                      height: "25px",
                      filter:
                        isOpen && activeTab === "audit"
                          ? "invert(35%) sepia(82%) saturate(7298%) hue-rotate(195deg) brightness(95%) contrast(101%)"
                          : "none",
                    }}
                  />
                </IconButton>
              </CustomTooltip>
            )}

          {name && (
            <CustomTooltip title={t("Notes")} placement="left" arrow>
              <IconButton onClick={handleOpenNotesModal}>
                <img src={note} alt="note" />
              </IconButton>
            </CustomTooltip>
          )}
        </Grid>

        <Grid
          item
          xs={10}
          sx={{
            overflowY: "auto",
            paddingTop: "4rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isOpen && (
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                width: "100%",
                height: "100%",
                justifyContent: "start",
              }}
            >
              {activeTab === "details" && (
                <Box
                  sx={{
                    paddingX: 1,
                    height: "100%", // Ensure the full height is used
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <h3 style={{ marginBottom: 0, fontFamily: "Inter" }}>
                        {t("details")}
                      </h3>
                      <Box
                        onClick={handleOpenActivityModal}
                        sx={{ marginLeft: "auto", paddingTop: "1.5rem" }}
                      >
                        {/* <img src={ActivityIcon} alt="Activity" />  */}
                        <button
                          style={{
                            backgroundColor: "#000",
                            color: "#fff",
                            padding: "2px 10px",
                            borderRadius: "10px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "400",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: "#333",
                              boxShadow: "0 4px 8px rgba(58, 54, 54, 0.3)",
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          {t("activity")}
                        </button>
                      </Box>
                    </Box>
                    <div className="detail-section">
                      <Typography
                        style={{
                          color: "#64748B",
                          fontFamily: "Inter",
                          fontSize: "14px",
                        }}
                      >
                        {t("createdBy")}
                      </Typography>
                      <Box className="uploaded-by">
                        <Avatar
                          sx={{ marginRight: 1, width: "26px", height: "26px" }}
                          src="path-to-salman-avatar.png"
                        />
                        <CustomTooltip
                          title={t("Created By")}
                          placement="bottom"
                          arrow
                        >
                          <p
                            style={{ whiteSpace: "nowrap" }}
                            className="uploaded-by-name"
                          >
                            {(documentDetails?.History?.[0]?.CreatedBy || "")
                              .length > 10
                              ? `${documentDetails.History[0].CreatedBy.slice(
                                  0,
                                  12
                                )}...`
                              : documentDetails?.History?.[0]?.CreatedBy ||
                                "N/A"}
                          </p>
                        </CustomTooltip>
                      </Box>
                      <Typography
                        style={{
                          color: "#64748B",
                          fontWeight: "400",
                          fontFamily: "Inter",
                          fontSize: "14px",
                        }}
                      >
                        {t("createdOn")}
                      </Typography>
                      <Box
                        className="uploaded-on"
                        sx={{
                          width: "auto",
                          fontSize: "14px",
                        }}
                      >
                        <img
                          src={calendar}
                          alt=""
                          style={{ marginRight: "0.3rem" }}
                        />
                        {documentDetails?.History?.[0]?.CreatedDate
                          ? dateformatter(
                              documentDetails.History[0].CreatedDate
                            )
                          : "N/A"}
                      </Box>
                    </div>
                  </Box>
                  <Box
                    sx={{
                      flexGrow: 1,
                      marginTop: "1rem",
                    }}
                  >
                    <ListItem
                      sx={{
                        px: 0,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, fontFamily: "Inter" }}>
                        {t("versionUpdates")}
                      </Typography>
                      {isCompareAvailable && (
                        <Button
                          variant="text"
                          sx={{ marginTop: "-6px" }}
                          disabled={
                            elementsDocumentFiles?.data?.DocumentStatus ===
                            "Draft"
                          }
                          onClick={() => {
                            if (isDocumentView) {
                              setOpen(true);
                            } else if (alldata?.IsReactFlow) {
                              setOpen(true);
                            } else {
                              handlOpenBPMNModal();
                            }
                          }}
                        >
                          {t("compare")}
                        </Button>
                      )}
                    </ListItem>
                    <List
                      sx={{
                        fontSize: "14px",
                        px: 0,
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 300px)",
                        "&::-webkit-scrollbar": { display: "none" },
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                      }}
                    >
                      {sortedHistory?.map((item, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            px: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              marginRight: "16px",
                            }}
                          >
                            <Box
                              sx={{
                                backgroundColor: bgColor,
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                marginBottom: "8px",
                                boxShadow: "0 0 0 5px #DBEAFE",
                              }}
                            />
                            <Box
                              sx={{
                                height: "30px",
                                borderLeft: "2px solid #E2E8F0",
                                marginTop: "-6px",
                              }}
                            />
                          </Box>
                          <Box
                            sx={{ flexGrow: 1 }}
                            style={{ marginTop: "-22px" }}
                          >
                            <Typography
                              style={{
                                marginTop: "12px",
                                fontFamily: "Inter",
                                fontSize: "14px",
                              }}
                            >
                              {/* {formatDate(item.CreatedDate)} */}
                              {item.CreatedDate
                                ? dateformatter(item.CreatedDate)
                                : "N/A"}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "start",
                                marginTop: "8px",
                              }}
                            >
                              <Avatar
                                sx={{
                                  marginRight: 1,
                                  marginLeft: "-31px",
                                  width: "24px",
                                  height: "24px",
                                  marginTop: "5px",
                                }}
                              />
                              <Typography
                                sx={{
                                  fontFamily: "Inter",
                                  fontSize: "14px",
                                  flexGrow: 1,
                                  paddingTop: "10px",
                                  fontWeight: "500",
                                }}
                              >
                                {item.CreatedBy}
                                <span
                                  style={{
                                    color: bgColor,
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    let flagName = "";
                                    let id =
                                      item.DocumentID ||
                                      item.SOPID ||
                                      item.TrainingSimulationID ||
                                      item.TestMCQID ||
                                      item.TestSimulationID;
                                    if (item.DocumentID) {
                                      flagName = "DocumentID";
                                    } else if (item.SOPID) {
                                      flagName = "SOPID";
                                    } else if (item.TrainingSimulationID) {
                                      flagName = "TrainingSimulationID";
                                    } else if (item.TestMCQID) {
                                      flagName = "TestMCQID";
                                    } else if (item.TestSimulationID) {
                                      flagName = "TestSimulationID";
                                    }
                                    handleVersionClick(id, flagName);
                                  }}
                                >
                                  {" "}
                                  Version{" "}
                                  {elementsDocumentFiles?.data
                                    ?.DocumentStatus === "Published"
                                    ? item.MasterVersion
                                    : item.DraftVersion}
                                </span>
                              </Typography>
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              )}
              {activeTab === "Chat" && userType !== "Admin" && (
                <Box>
                  <Chat />
                </Box>
              )}
              {activeTab === "audit" && userType !== "Admin" && (
                <Box>
                  <AuditSidebar elementsDocumentFiles={elementsDocumentFiles} />
                </Box>
              )}
              {activeTab === "myworkflow" && (
                <>
                  <History />
                </>
              )}

              {activeTab === "AI" && (
                <Box
                  sx={{
                    marginTop: "-10rem",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <SideBarAI />
                </Box>
              )}

              {activeTab === "activity" && !fromDashboard && (
                <Box
                  sx={{
                    marginLeft: "0.5rem",
                    position: "relative",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent:
                      activity?.data && activity.data.length > 0
                        ? "flex-start"
                        : "center",
                    alignItems:
                      activity?.data && activity.data.length > 0
                        ? "flex-start"
                        : "center",
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      color="primary"
                      style={{ margin: "5.5rem" }}
                    />
                  ) : activity?.data && activity?.data.length > 0 ? (
                    <>
                      <h3>{t("activity")}</h3>
                      {/* Comment TextArea and Button */}
                      <Box
                        sx={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "white",
                          paddingBottom: "1rem",
                          borderBottom: "1px solid #E0E0E0",
                        }}
                      >
                        <TextField
                          label="Add comment here... *"
                          multiline
                          rows={4}
                          variant="outlined"
                          fullWidth
                          sx={{
                            width: "235px",
                            boxShadow: "0px 1px 2px 0px #090d14fd",
                            borderRadius: "8px",
                            "& .MuiOutlinedInput-root": {
                              border: "1px solid #F5F6FB",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <Box
                          sx={{
                            marginTop: "1rem",
                            backgroundColor: "white",
                          }}
                        >
                          <FormControl
                            fullWidth
                            sx={{ marginTop: "1rem", width: "235px" }}
                          >
                            <InputLabel>
                              {t("status")}{" "}
                              <span style={{ color: "red" }}>*</span>
                            </InputLabel>
                            <Select
                              value={action}
                              label="Action"
                              onChange={(e) => setAction(e.target.value)}
                            >
                              <MenuItem value={null} disabled>
                                {t("noAction")}
                              </MenuItem>
                              <MenuItem value="Rejected">
                                {t("rejected")}
                              </MenuItem>
                              <MenuItem value="Approved">
                                {t("approved")}
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              width: "97%",
                              backgroundColor: bgColor,
                              textTransform: "none",
                              marginTop: "1rem",
                            }}
                            onClick={handleSubmitComment}
                            disabled={
                              !isActionEnabled ||
                              (action !== "Rejected" && action !== "Approved")
                            }
                          >
                            {t("submit")}
                          </Button>
                        </Box>
                        <Box
                          sx={{
                            marginTop: "1rem",
                            backgroundColor: "white",
                          }}
                        >
                          <FormControl
                            fullWidth
                            sx={{ marginTop: "1rem", width: "235px" }}
                          >
                            <InputLabel>
                              {t("Delegate To")}{" "}
                              <span style={{ color: "red" }}>*</span>
                            </InputLabel>
                            {userType == "ProcessOwner" ? (
                              <Select
                                value={delegateUserID}
                                label="Delegate"
                                onChange={(e) =>
                                  setDelegateUserID(e.target.value)
                                }
                              >
                                {processOwnerList &&
                                  processOwnerList?.length > 0 &&
                                  processOwnerList
                                    ?.filter((user) => user.UserID !== userID)
                                    .map((owner) => (
                                      <MenuItem
                                        key={owner.UserID}
                                        value={owner.UserID}
                                        sx={{
                                          fontSize: "13px",
                                          fontWeight: 400,
                                          height: "auto",
                                        }}
                                      >
                                        {owner.UserName}
                                      </MenuItem>
                                    ))}
                              </Select>
                            ) : (
                              ""
                            )}
                            {userType == "EndUser" ? (
                              <Select
                                value={delegateUserID}
                                label="Delegate"
                                onChange={(e) =>
                                  setDelegateUserID(e.target.value)
                                }
                              >
                                {endUserList &&
                                  endUserList?.length > 0 &&
                                  endUserList
                                    ?.filter((user) => user.UserID !== userID)
                                    .map((owner) => (
                                      <MenuItem
                                        key={owner.UserID}
                                        value={owner.UserID}
                                        sx={{
                                          fontSize: "13px",
                                          fontWeight: 400,
                                          height: "auto",
                                        }}
                                      >
                                        {owner.UserName}
                                      </MenuItem>
                                    ))}
                              </Select>
                            ) : (
                              ""
                            )}
                          </FormControl>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              width: "97%",
                              backgroundColor: bgColor,
                              textTransform: "none",
                              marginTop: "1rem",
                            }}
                            onClick={() => handleDelegate(userType)}
                            disabled={!delegateUserID}
                          >
                            {t("Delegate")}
                          </Button>
                        </Box>
                      </Box>
                      {/* {hasElements(activity?.data[0]?.Checkers) ? (
                        <Box
                          sx={{
                            flex: 1,
                            overflowY: "auto",
                            paddingBottom: "-2rem",
                            paddingRight: "1rem",
                          }}
                        >
                          {activity?.data
                            ?.map((item) => {
                              const latestCheckerActionDate =
                                item?.CheckerActions?.reduce(
                                  (latestDate, action) => {
                                    const actionDate = new Date(
                                      action?.CreatedDate
                                    );
                                    return actionDate > latestDate
                                      ? actionDate
                                      : latestDate;
                                  },
                                  new Date(item.CreatedDate)
                                );

                              return {
                                ...item,
                                latestDate: latestCheckerActionDate,
                              };
                            })
                            .sort(
                              (a, b) =>
                                new Date(b.latestDate) - new Date(a.latestDate)
                            )
                            .map((item, index) => (
                              <Box
                                key={index}
                                sx={{ marginBottom: "1rem", marginTop: "1rem" }}
                              >
                                <Typography variant="body2">
                                  {new Date(item.CreatedDate).toLocaleString(
                                    "en-GB",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </Typography>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                  }}
                                >
                                  <Avatar
                                    sx={{ width: 40, height: 40 }}
                                    src={
                                      item.CreatedUserPhoto ||
                                      "path-to-default-avatar.png"
                                    }
                                    alt={item?.CreatedUserName}
                                  />

                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: "400",
                                        marginTop: "8px",
                                      }}
                                    >
                                      {item?.CreatedUserName}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: item?.SelfApproved
                                          ? bgColor
                                          : "#DA950D",
                                        fontSize: "12px",
                                        marginTop: "-0.5rem",
                                      }}
                                    >
                                      {item?.SelfApproved
                                        ? "Created File - Self Approved"
                                        : "Created File - Not Self Approved"}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ marginTop: "1rem" }}>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    Review / Approve:
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <AvatarGroup max={4}>
                                      {item?.Checkers?.map((checker, idx) => (
                                        <Tooltip
                                          key={idx}
                                          title={checker?.UserName}
                                        >
                                          <Avatar
                                            sx={{ width: 40, height: 40 }}
                                            src={
                                              checker?.UserPhoto ||
                                              "path-to-default-avatar.png"
                                            }
                                            alt={checker?.UserName}
                                          />
                                        </Tooltip>
                                      ))}
                                    </AvatarGroup>
                                  </Box>
                                </Box>

                                <Box
                                  sx={{
                                    marginTop: "1rem",
                                    marginBottom: "1rem",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    Escalators:
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <AvatarGroup max={4}>
                                      {item?.Escalators?.map(
                                        (escalator, idx) => (
                                          <Tooltip
                                            key={idx}
                                            title={escalator?.UserName}
                                          >
                                            <Avatar
                                              sx={{ width: 40, height: 40 }}
                                              src={
                                                escalator?.UserPhoto ||
                                                "path-to-default-avatar.png"
                                              }
                                              alt={escalator?.UserName}
                                            />
                                          </Tooltip>
                                        )
                                      )}
                                    </AvatarGroup>
                                  </Box>
                                </Box>
                              </Box>
                            ))}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            flex: 1,
                            overflowY: "auto",
                            paddingBottom: "-2rem",
                            paddingRight: "1rem",
                          }}
                        >
                          {activity?.data
                            ?.map((item) => {
                              const latestStakeHolderActionDate =
                                item?.StakeHolderActions?.reduce(
                                  (latestDate, action) => {
                                    const actionDate = new Date(
                                      action?.CreatedDate
                                    );
                                    return actionDate > latestDate
                                      ? actionDate
                                      : latestDate;
                                  },
                                  new Date(item?.CreatedDate)
                                );

                              return {
                                ...item,
                                latestDate: latestStakeHolderActionDate,
                              };
                            })
                            .sort(
                              (a, b) =>
                                new Date(b.latestDate) - new Date(a.latestDate)
                            )
                            .map((item, index) => (
                              <Box
                                key={index}
                                sx={{ marginBottom: "1rem", marginTop: "1rem" }}
                              >
                                <Typography variant="body2">
                                  {new Date(item.CreatedDate).toLocaleString(
                                    "en-GB",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </Typography>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                  }}
                                >
                                  <Avatar
                                    sx={{ width: 40, height: 40 }}
                                    src={
                                      item.CreatedUserPhoto ||
                                      "path-to-default-avatar.png"
                                    }
                                    alt={item?.CreatedUserName}
                                  />

                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: "400",
                                        marginTop: "8px",
                                      }}
                                    >
                                      {item?.CreatedUserName}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: item?.SelfApproved
                                          ? bgColor
                                          : "#DA950D",
                                        fontSize: "12px",
                                        marginTop: "-0.5rem",
                                      }}
                                    >
                                      {item?.SelfApproved
                                        ? "Created File - Self Approved"
                                        : "Created File - Not Self Approved"}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ marginTop: "1rem" }}>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    StakeHolders:
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <AvatarGroup max={4}>
                                      {item?.StakeHolders?.map(
                                        (StakeHolder, idx) => (
                                          <Tooltip
                                            key={idx}
                                            title={StakeHolder?.UserName}
                                          >
                                            <Avatar
                                              sx={{ width: 40, height: 40 }}
                                              src={
                                                StakeHolder?.UserPhoto ||
                                                "path-to-default-avatar.png"
                                              }
                                              alt={StakeHolder?.UserName}
                                            />
                                          </Tooltip>
                                        )
                                      )}
                                    </AvatarGroup>
                                  </Box>
                                </Box>

                                <Box
                                  sx={{
                                    marginTop: "1rem",
                                    marginBottom: "1rem",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    Escalators:
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <AvatarGroup max={4}>
                                      {item?.Escalators?.map(
                                        (escalator, idx) => (
                                          <Tooltip
                                            key={idx}
                                            title={escalator?.UserName}
                                          >
                                            <Avatar
                                              sx={{ width: 40, height: 40 }}
                                              src={
                                                escalator?.UserPhoto ||
                                                "path-to-default-avatar.png"
                                              }
                                              alt={escalator?.UserName}
                                            />
                                          </Tooltip>
                                        )
                                      )}
                                    </AvatarGroup>
                                  </Box>
                                </Box>
                              </Box>
                            ))}
                        </Box>
                      )} */}
                    </>
                  ) : (
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      style={{
                        padding: "4.5rem",
                      }}
                    >
                      NO DATA
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
      <NotesModel
        open={isNotesModalOpen}
        onClose={handleCloseNotesModal}
        onAddNote={handleAddNote}
      />
      {open &&
        (isDocumentView ? (
          <CompareDocsModal
            open={open}
            onClose={handleClose}
            elementsDocumentFile={elementsDocumentFiles}
          />
        ) : isSOPView ? (
          <CompareSOPModal
            open={open}
            onClose={handleClose}
            Historydata={sortedHistory}
          />
        ) : (
          <CompareDocsModal
            open={open}
            onClose={handleClose}
            elementsDocumentFile={elementsDocumentFiles}
          />
        ))}
      {openBPMNModal && (
        <CompareBPMNModal
          open={openBPMNModal}
          onClose={() => setOpenBPMNModal(false)}
        />
      )}

      <ActivitySideBar
        open={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        datafromsidebar={activitySidebarPayload}
        elementsDocumentFile={elementsDocumentFiles?.data}
      />
    </Card>
  );
};

export default RightSidebar;

// Fix: PropTypes should be 'propTypes' (not 'PropTypes'), and add onToggle
RightSidebar.propTypes = {
  onToggle: PropTypes.func.isRequired,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
  userType: PropTypes.string,
  fromDashboard: PropTypes.bool,
  activity: PropTypes.object,
  elementsDocumentFiles: PropTypes.object,
  isSOPView: PropTypes.bool,
};
