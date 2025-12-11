import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  Worker,
  Button as PDFButton,
  Position,
  Tooltip as PDFTooltip,
  Viewer,
  PrimaryButton,
} from "@react-pdf-viewer/core";
import { highlightPlugin, MessageIcon } from "@react-pdf-viewer/highlight";
import { GetElementsFolderDocument } from "../../../store/elements/action";
import bookMark from "../../../assets/svg/accountOpening-Svg/BookMark-blue.svg";
import "./AccountOpeningForm.css";
import Breadcrumbs from "../../breadcrumbs/Breadcrumbs";
import { toast } from "react-toastify";
import { GetAddFavourites } from "../../../store/favourites/action";
import { BASE_URL } from "../../../config/urlConfig";
import { impactAnalysis } from "../../../store/impactAnalysis/ImpactAnalysis";
import { setDetailsData, setLoading } from "../../../store/details/slice";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Acknowledge from "./acknowledge";
import { IAcknowledge } from "../../../store/attempts/action";
import DocViewer from "../../docViewer/DocViewer";
import impactanalysisIcon from "../../../assets/svg/impactanalysis/impactanalysisIcon.svg";
import { GetListRiskAndCompliences } from "../../../store/riskandCompliences/action";
import risk from "../../../assets/image/accountOpening/risk.svg";
import com from "../../../assets/image/accountOpening/com.svg";
import RiskAndComplianceModal from "./RiskAndComplianceModal";
import CommonContainer from "../commoncontainer/CommonContainer";
import RightSection from "./RightSection";
import cicon from "../../../assets/svg/BPMN/cicon.svg";
import ctqIcons from "../../../assets/svg/common/CTQ.svg";
import NoFav from "../../../assets/svg/navbar/favone.svg";
import {
  AccessTime,
  ChatBubbleOutline,
  Check,
  Delete,
  Download,
  Edit,
  InfoOutlined,
  Reply,
  Save,
  Send,
  VisibilityOutlined,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material";
import OnlyOffice from "../../docViewer/OnlyOffice";
import Pageloader from "../../../assets/image/cubeloader1.gif";
import "intro.js/introjs.css";
import OnlyOfficeModal from "../../docViewer/OnlyOfficeModal";
import { updateIsAccepted } from "../../../services/documentModules/DocumentsModule";
import DelegateModal from "../../docViewer/DelegateModal";
import { delegateStatusUpdate } from "../../../services/activitysidebar/ActivitySidebar";
import { GetSystemSettings } from "../../../services/settings/Settings";
import FourBox from "../../../assets/image/accountOpening/sop.png";
import SOPModal from "./SOPModal";
import { Close } from "@mui/icons-material";
import {
  AddCommentToPdfApi,
  DeleteCommentToPdfApi,
  ReplyResolveCommentToPdfApi,
  UpdateCommentToPdfApi,
} from "../../../services/elements/Elements";
import { useTranslation } from "react-i18next";
import DocumentExitModal from "./DocumentExitModal";
import { sopReadingLogsApi } from "../../../services/eSign/ESignModule";
import { useHeadingBgColor } from "../../useHeadingBgColor";
import CTQModal from "../../modals/CTQModal";
import { fetchDocxTemplateAPI } from "../../../services/documentModules/DocumentsModule";
import ConvertModal from "./ConvertModal";

const AccountOpeningForm = () => {
  const textLayerRef = useRef();
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileType, setFileType] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [docAndDocxFileUrl, setDocAndDocxFileUrl] = useState(null);
  const [openCTQModal, setOpenCTQModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loadingDocument, setLoadingDocument] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const downloadOpen = Boolean(downloadAnchorEl);
  const [openOnlyOfficeModal, setOpenOnlyOfficeModal] = useState(false);
  const [delegateModal, setDelegateModal] = useState(false);
  const [coCreation, setCoCreation] = useState(false);
  const [openSOPModal, setOpenSOPModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [viewerInitialPage, setViewerInitialPage] = useState(0);
  const [viewerKey, setViewerKey] = useState(0);
  const [activeCommentPosition, setActiveCommentPosition] = useState(null);
  const commentsListRef = useRef(null);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const userDataFromStorage = localStorage.getItem("user_data");
  const currentUserID = JSON.parse(userDataFromStorage)?.UserID;
  const [timeSpent, setTimeSpent] = useState(0);
  const [pagesViewed, setPagesViewed] = useState(new Set([currentPage]));
  const [showExitModal, setShowExitModal] = useState(false);
  const [maxPagesRead, setMaxPagesRead] = useState(0);
  const [openTime, setOpenTime] = useState(null);
  const timerRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { userdata } = useSelector((state) => state?.user);
  const { elementsDocumentFiles } = useSelector((state) => state.elements);
  const { linkedID } = useSelector((state) => state.linkedData);
  const bgColor = useHeadingBgColor();
  const [pageCount, setPageCount] = useState(0);
  const [templateData, setTemplateData] = useState(null);
  const templatefolder = localStorage.getItem("selectedContentName");
  const { templates, error } = useSelector((state) => state.docxTemplate);
  const [showTimeData, setShowTimeData] = useState([]);
  const [documentPermission, setDocumentPermission] = useState(null);
  const [highestPageCont, setHighestPageCont] = useState(0);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);
  useEffect(() => {
    console.log("Templates in component:", templates);
    console.log("Error in component:", error);
  }, [templates, error]);

  const { RiskAndCompliences } = useSelector(
    (state) => state.RiskAndCompliences
  );
  const elementID = useSelector((state) => state.elementid.elementID);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const searchSelectedId = useSelector((state) => state.selectedId.value);
  const storedDocumentID = presistStore?.DocumentID;
  const fromActionables = location.state?.fromActionables || false;
  const documentID = fromActionables
    ? presistStore?.ElementID || elementID
    : id || linkedID || storedDocumentID || searchSelectedId;
  const documentData = elementsDocumentFiles?.data;

  // console.log(
  //   "elementsDocumentFileselementsDocumentFiles:",
  //   elementsDocumentFiles?.data?.CreatedBy
  // );
  const userId = localStorage.getItem("user_id");
  const IsGlobalView = localStorage.getItem("IsGlobalView");
  const saveDocumentStats = useCallback(() => {
    if (!documentData?.DocumentName) return;
    const hours = Math.floor(timeSpent / 3600);
    const minutes = Math.floor((timeSpent % 3600) / 60);
    const seconds = timeSpent % 60;

    const stats = {
      documentName: documentData.DocumentName,
      documentId: documentData.DocumentID,
      timeSpent: timeSpent,
      timeSpentBreakdown: {
        hours,
        minutes,
        seconds,
        totalSeconds: timeSpent,
      },
      pagesViewed: Array.from(pagesViewed),
      lastViewed: new Date().toISOString(),
    };

    const documentHistory = JSON.parse(
      localStorage.getItem("documentViewingHistory") || "[]"
    );
    const existingIndex = documentHistory.findIndex(
      (entry) => entry.documentId === documentData.DocumentID
    );

    if (existingIndex !== -1) {
      documentHistory[existingIndex] = {
        ...stats,
        timeSpent: timeSpent,
        timeSpentBreakdown: stats.timeSpentBreakdown,
        pagesViewed: stats.pagesViewed,
        lastViewed: stats.lastViewed,
      };
    } else {
      documentHistory.push(stats);
    }

    localStorage.setItem(
      "documentViewingHistory",
      JSON.stringify(documentHistory)
    );
  }, [documentData, timeSpent, pagesViewed]);

  useEffect(() => {
    const selectedContentName = localStorage.getItem("selectedContentName");
    if (selectedContentName === "Create Template") {
      fetchDocxTemplateAPI({ DocumentTemplateID: documentID })
        .then((apiRes) => {
          console.log(
            "fetchDocxTemplateAPI response DocumentPath:",
            apiRes?.data?.data?.DocumentPath
          );
          if (apiRes?.data?.data) {
            setTemplateData(apiRes.data.data);
          }
        })
        .catch((err) => {
          console.error("fetchDocxTemplateAPI error:", err);
        });
    }
    const fetchSOPReadingLogs = async () => {
      try {
        const res = await sopReadingLogsApi({
          DocumentID: documentID,
          EndDate: null,
          StartDate: null,
        });

        setShowTimeData(res?.data?.data?.highestTime);

        setHighestPageCont(res?.data?.data?.highestPage?.NoOfPageRead);
      } catch (error) {
        // console.error("Error fetching SOP reading logs:", error);
      }
    };

    fetchSOPReadingLogs();
  }, [documentID]);

  useEffect(() => {
    if (currentPage) {
      setPagesViewed((prev) => new Set(prev).add(currentPage));
    }
  }, [currentPage]);
  const getRequiredReadingTimeInMinutes = () => {
    const value = documentData?.ReadingTimeValue;
    const unit = documentData?.ReadingTimeUnit;
    if (!value || !unit) return 0;
    if (unit.toLowerCase().startsWith("hour")) return value * 60;
    if (unit.toLowerCase().startsWith("min")) return value;
    if (unit.toLowerCase().startsWith("minute")) return value;
    return 0;
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!documentData) return;
      saveDocumentStats();
      const requiredMinutes = getRequiredReadingTimeInMinutes();
      if (requiredMinutes && timeSpent < requiredMinutes) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [documentData, timeSpent]);

  useEffect(() => {
    if (!documentData) return;
    setOpenTime(new Date());

    setTimeSpent(0);
    setPagesViewed(new Set());
    timerRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [documentData]);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.startsWith("/documents/view")) {
      return () => {
        saveDocumentStats();
      };
    }
  }, [location.pathname, saveDocumentStats]);

  const ownerUserId =
    elementsDocumentFiles?.data?.CheckerAndStakeHolderIDs?.find(
      (item) => item.Owner
    )?.Owner?.[0]?.userId;

  useEffect(() => {
    if (userId && ownerUserId && userId === ownerUserId) {
      // console.log("elementsDocumentFilesSOOPP:", ownerUserId);
    }
  }, [userId, ownerUserId]);

  useEffect(() => {
    if (elementsDocumentFiles?.data?.Comments) {
      const formattedComments = elementsDocumentFiles.data.Comments.map(
        (comment) => ({
          id: comment.DocumentModuleCommentID,
          text: comment.HighlightedText,
          comment: comment.CommentText,
          timestamp: comment.CommentedDateTime,
          user: comment.CommentedBy,
          position: {
            ...comment.HighlightedTextPosition,
            page: comment.HighlightedTextPosition.pageIndex + 1,
          },
          highlightAreas: [
            {
              ...comment.HighlightedTextPosition,
              pageIndex: comment.HighlightedTextPosition.pageIndex,
            },
          ],
          replies: comment.Replies || [],
        })
      );
      setComments(formattedComments);
    }
  }, [elementsDocumentFiles?.data?.Comments]);

  useEffect(() => {
    console.log(documentID, "URL ID");
    console.log(fromActionables, "URL ID");
  }, [id]);
  const my_task = localStorage.getItem("my_task");
  const contentName = localStorage.getItem("selectedContentName");
  const queryParams = new URLSearchParams(location.search);
  const isSOPFalse = queryParams.get("SOP") === "false";
  const isSOPTrue = queryParams.get("SOP") === "true";
  const isMyActionableTrue = queryParams.get("MyActionable") === "true";
  useEffect(() => {
    if (documentID) {
      console.log(documentID, "documentID");
      const isActionable = isMyActionableTrue
        ? true
        : isSOPTrue
        ? true
        : isSOPFalse
        ? false
        : fromActionables || false;

      if (contentName !== "Create Template") {
        dispatch(
          GetElementsFolderDocument({
            DocumentID: documentID,
            IsActionable: isActionable,
            IsDraft: presistStore?.IsDraft
              ? true
              : false || isMyActionableTrue
              ? false
              : presistStore?.DocumentStatus === "InProgress",
            IsEnableMyTask: my_task ? true : false,
          })
        )
          .unwrap()
          .catch((error) => {
            console.error("Failed to fetch document:", error);
          });
      }
    }
  }, [
    dispatch,
    documentID,
    isSOPTrue,
    isSOPFalse,
    fromActionables,
    isMyActionableTrue,
  ]);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const { Download, ...rest } = slots;
          return (
            <>
              {rest.Open}
              {rest.Print}
              {rest.Search}
            </>
          );
        }}
      </Toolbar>
    ),
  });

  const [message, setMessage] = React.useState("");
  const [notes, setNotes] = React.useState([]);
  let noteId = notes?.length;

  const renderHighlightTarget = (props) => (
    <div
      style={{
        background: "#eee",
        display: "flex",
        position: "absolute",
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: "translate(0, 8px)",
        zIndex: 1,
      }}
    >
      <PDFTooltip
        position={Position.TopCenter}
        target={
          <PDFButton onClick={props.toggle}>
            <MessageIcon />
          </PDFButton>
        }
        content={() => <div style={{ width: "100px" }}>Add a note</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  const getUserFullName = () => {
    try {
      const userDataFromStorage = localStorage.getItem("user_data");
      if (userDataFromStorage) {
        const userData = JSON.parse(userDataFromStorage);
        return `${userData.UserFirstName} ${userData.UserLastName}`;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    return userdata?.Name || "User";
  };
  const renderHighlightContent = (props) => {
    const addNote = async () => {
      if (message !== "") {
        setIsAddingComment(true);
        const pageIndex =
          props.selectionData?.startPageIndex ?? props.pageIndex;
        const currentPageNumber = pageIndex + 1;

        try {
          const payload = {
            DocumentModuleDraftID: documentData?.DocumentModuleDraftID,
            CommentText: message,
            ActionType: "Comment",
            HighlightedText: props.selectedText,
            HighlightedTextPosition: {
              pageIndex: pageIndex,
              left: props.highlightAreas[0]?.left || 0,
              top: props.highlightAreas[0]?.top || 0,
              width: props.highlightAreas[0]?.width || 0,
              height: props.highlightAreas[0]?.height || 0,
            },
          };
          const response = await AddCommentToPdfApi(payload);
          if (response.status === 201 || response.success) {
            const newComment = {
              id: response.data?.DocumentModuleCommentID || uuidv4(),
              text: props.selectedText,
              comment: message,
              timestamp: new Date().toISOString(),
              user: getUserFullName(),
              position: {
                pageIndex: pageIndex,
                page: currentPageNumber,
                left: props.highlightAreas[0]?.left || 0,
                top: props.highlightAreas[0]?.top || 0,
                width: props.highlightAreas[0]?.width || 0,
                height: props.highlightAreas[0]?.height || 0,
              },
              highlightAreas: [...props.highlightAreas],
              selectionData: { ...props.selectionData },
            };
            const note = {
              id: ++noteId,
              content: message,
              highlightAreas: props.highlightAreas,
              quote: props.selectedText,
              timestamp: new Date().toISOString(),
              user: getUserFullName(),
              pageIndex: pageIndex,
              page: currentPageNumber,
            };
            setNotes(notes.concat([note]));
            setComments((prevComments) => [...prevComments, newComment]);
            setMessage("");
            props.cancel();

            setTimeout(() => {
              clearAllHighlights();
            }, 500);
            toast.success(`Comment added on page ${currentPageNumber}`);
          } else {
            const errorMsg =
              response.data?.message ||
              response.message ||
              "Failed to save comment (server responded with non-success status)";
            toast.error(errorMsg);
          }
        } catch (error) {
          console.error("Error saving comment:", error);
          const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Failed to save comment due to network error";
          toast.error(errorMsg);
        } finally {
          setIsAddingComment(false);
        }
      } else {
        toast.error("Please enter a comment");
      }
    };
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(0, 0, 0, .3)",
          borderRadius: "2px",
          padding: "8px",
          position: "absolute",
          left: `${props.selectionRegion.left}%`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
          zIndex: 1,
        }}
      >
        <div>
          <textarea
            rows={3}
            style={{
              border: "1px solid rgba(0, 0, 0, .3)",
              width: "100%",
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "8px",
          }}
        >
          <div style={{ marginRight: "8px" }}>
            <PrimaryButton onClick={addNote} disabled={isAddingComment}>
              {isAddingComment ? (
                <React.Fragment>
                  <CircularProgress
                    size={16}
                    color="inherit"
                    style={{ marginRight: "8px" }}
                  />
                  Adding...
                </React.Fragment>
              ) : (
                "Add"
              )}
            </PrimaryButton>
          </div>
          <Button onClick={props.cancel}>Cancel</Button>
        </div>
      </div>
    );
  };

  const clearAllHighlights = () => {
    const allTextSpans = document.querySelectorAll(
      ".react-pdf__Page__textLayer span"
    );
    allTextSpans.forEach((span) => {
      span.style.backgroundColor = "transparent";
      span.classList.remove("active-highlight");
    });
  };
  const [riskComplianceHighlight, setRiskComplianceHighlight] = useState(null);
  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    renderHighlights: (props) => {
      return (
        <div>
          {comments
            .filter(
              (comment) =>
                comment.highlightAreas?.some(
                  (area) => area.pageIndex === props.pageIndex
                ) && activeCommentPosition?.id === comment.id
            )
            .map((comment, idx) => (
              <React.Fragment key={idx}>
                {comment.highlightAreas
                  .filter((area) => area.pageIndex === props.pageIndex)
                  .map((area, areaIdx) => (
                    <div
                      key={areaIdx}
                      style={Object.assign(
                        {},
                        {
                          background: "#90EE90",
                          opacity: 0.4,
                        },
                        props.getCssProperties(area, props.rotation)
                      )}
                    />
                  ))}
              </React.Fragment>
            ))}
          {riskComplianceHighlight &&
            riskComplianceHighlight.pageIndex === props.pageIndex && (
              <div
                style={Object.assign(
                  {},
                  {
                    background: "#90EE90",
                    opacity: 0.7,
                    pointerEvents: "none",
                    border: "2px solid #388e3c",
                    borderRadius: "2px",
                  },
                  props.getCssProperties(
                    {
                      left: riskComplianceHighlight.Left,
                      top: riskComplianceHighlight.Top,
                      width: riskComplianceHighlight.Width,
                      height: riskComplianceHighlight.Height,
                      pageIndex: riskComplianceHighlight.pageIndex,
                    },
                    props.rotation
                  )
                )}
              />
            )}
        </div>
      );
    },
  });

  useEffect(() => {
    if (fromActionables && elementID) {
      dispatch(
        GetElementsFolderDocument({
          DocumentID: elementID,
          IsActionable: true,
        })
      );
    }
  }, [dispatch, elementID, fromActionables]);

  const breadcrumbsData = Array.isArray(elementsDocumentFiles?.bredcrumbs)
    ? elementsDocumentFiles.bredcrumbs
    : [];

  const isTemplates = breadcrumbsData?.some(
    (breadcrumb) => breadcrumb?.breadcrumbName?.toLowerCase() === "templates"
  );
  const NoOfRisk =
    elementsDocumentFiles?.data?.RiskAndComplience?.NoOfRisk || 0;
  const NoOfCompliance =
    elementsDocumentFiles?.data?.RiskAndComplience?.NoOfCompliance || 0;
  const RiskAndComplianceID =
    elementsDocumentFiles?.data?.RiskAndComplience?.RiskAndComplianceID;
  const NoOfClause =
    elementsDocumentFiles?.data?.RiskAndComplience?.NoOfClause || 0;
  useEffect(() => {
    if (RiskAndComplianceID) {
      dispatch(GetListRiskAndCompliences({ RiskAndComplianceID }))
        .unwrap()
        .catch((error) => {
          console.error("Failed to fetch Risk and Compliance data:", error);
        });
    }
  }, [RiskAndComplianceID, dispatch]);

  dispatch(setDetailsData(elementsDocumentFiles?.details));

  const handleBackButtonClick = (e) => {
    if (!documentData && !templateData) {
      navigate(-1);
      return;
    }
    e?.preventDefault();
    const requiredMinutes = getRequiredReadingTimeInMinutes();
    if (requiredMinutes && timeSpent < requiredMinutes) {
      setShowExitModal(true);
    } else {
      saveDocumentStats();
      navigate(-1);
    }
  };

  const confirmExit = () => {
    saveDocumentStats();
    setShowExitModal(false);
    navigate(-1);
  };
  const cancelExit = () => {
    setShowExitModal(false);
  };
  const handleBookmarkClick = async () => {
    const payload = {
      ModuleTypeID: presistStore?.ModuleTypeID,
      ModuleID: id || storedDocumentID,
    };
    try {
      const result = await dispatch(GetAddFavourites(payload)).unwrap();
      toast.success(t("Added to Favorites Successfully") || result.message);
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "already in favourites");
    }
  };

  const handleImpactAnalysis = () => {
    const payload = {
      ModuleID: presistStore.DocumentID,
      ImpactAnalysisTarget: "Document",
      name: documentData?.DocumentName,
    };
    localStorage.setItem("impactAnalysisPayload", JSON.stringify(payload));
    dispatch(impactAnalysis(payload));
    navigate("/impact-analysis");
  };

  useEffect(() => {
    setLoadingDocument(true);
    const effectiveDocData = templateData || documentData;
    if (!effectiveDocData) {
      setFileUrl(null);
      setDocAndDocxFileUrl(null);
      setLoading(false);
      return;
    }
    if (effectiveDocData) {
      localStorage.setItem(
        "OwnerData",
        JSON.stringify(
          effectiveDocData?.CheckerAndStakeHolderIDs
            ?.CheckerAndStakeHolderIDs?.[2]?.Owner
        )
      );
    }
    if (
      effectiveDocData?.CheckerAndStakeHolderIDs?.some((group) =>
        group?.Checker?.some(
          (checker) =>
            checker.userId === userdata?.UserID &&
            checker.IsDelegated === true &&
            checker.DelegateStatus === null
        )
      ) ||
      effectiveDocData?.CheckerAndStakeHolderIDs?.some((group) =>
        group?.StakeHolder?.some(
          (stakeholder) =>
            stakeholder.userId === userdata?.UserID &&
            stakeholder.IsDelegated === true &&
            stakeholder.DelegateStatus === null
        )
      )
    ) {
      setDelegateModal(true);
    } else {
      setDelegateModal(false);
    }
    const timeout = setTimeout(() => {
      if (effectiveDocData?.DocumentPath) {
        const url = `${BASE_URL}${effectiveDocData.DocumentPath}`;
        const fileExtension = url.split(".").pop();
        if (fileExtension === "doc" || fileExtension === "docx") {
          setFileType(true);
          //           const isReviewer = effectiveDocData?.CheckerAndStakeHolderIDs?.some(
          //             (group) =>
          //               group?.Checker?.some((checker) => checker.userId === userId)
          //           );

          //           const isStakeholder =
          //             effectiveDocData?.CheckerAndStakeHolderIDs?.some((group) =>
          //               group?.StakeHolder?.some(
          //                 (stakeholder) => stakeholder.userId === userId
          //               )
          //             );

          //           const isApprover = effectiveDocData?.CheckerAndStakeHolderIDs?.some(
          //             (group) =>
          //               group?.Approver?.some((approver) => approver.userId === userId)
          //           );
          // console.log(isReviewer, "isReviewer");
          // console.log(isStakeholder, "isStakeholder");
          // console.log(isApprover, "isApprover");
          //           // Check open conditions
          //           const canReviewerOpen =
          //             effectiveDocData?.NeedAcceptance === false &&
          //             isReviewer &&
          //             (!effectiveDocData?.AcceptedByReviewer?.length ||
          //               !effectiveDocData?.AcceptedByReviewer.includes(userId));

          //           const canStakeholderOpen =
          //             effectiveDocData?.NeedAcceptanceFromStakeHolder === false &&
          //             isStakeholder &&
          //             (!effectiveDocData?.AcceptedByStakeHolder?.length ||
          //               !effectiveDocData?.AcceptedByStakeHolder.includes(userId));

          //           const canApproverOpen =
          //             effectiveDocData?.NeedAcceptanceForApprover === false &&
          //             isApprover &&
          //             (!effectiveDocData?.AcceptedByApprover?.length ||
          //               !effectiveDocData?.AcceptedByApprover.includes(userId));
          // console.log(canReviewerOpen, "canReviewerOpen");
          // console.log(canStakeholderOpen, "canStakeholderOpen");
          // console.log(canApproverOpen, "canApproverOpen");
          //           // Final check
          //           if (canReviewerOpen || canStakeholderOpen || canApproverOpen) {
          //             setOpenOnlyOfficeModal(true);
          //           }
          // Find role arrays
          // Build escalation lookups
          const escalationByUser = {};
          (
            effectiveDocData?.CheckerAndStakeHolderIDs?.flatMap(
              (g) => g?.Escalation || []
            ) || []
          ).forEach((esc) => {
            escalationByUser[esc.userId] = esc;
          });
          const reviewerGroups =
            effectiveDocData?.CheckerAndStakeHolderIDs?.flatMap(
              (g) => g?.Checker || []
            ) || [];
          const stakeholderGroups =
            effectiveDocData?.CheckerAndStakeHolderIDs?.flatMap(
              (g) => g?.StakeHolder || []
            ) || [];
          const approverGroups =
            effectiveDocData?.CheckerAndStakeHolderIDs?.flatMap(
              (g) => g?.Approver || []
            ) || [];
          const hasApprovedInEscalation = (userId) =>
            escalationByUser[userId] &&
            escalationByUser[userId].ApprovalStatus !== null;

          const isReviewer = reviewerGroups.some(
            (checker) => checker.userId === userId
          );
          const isStakeholder = stakeholderGroups.some(
            (s) => s.userId === userId
          );
          const isApprover = approverGroups.some((a) => a.userId === userId);
          const canReviewerOpen =
            effectiveDocData?.NeedAcceptance === false &&
            isReviewer &&
            reviewerGroups.length > 1 &&
            (!IsGlobalView || (IsGlobalView && isMyActionableTrue)) &&
            !hasApprovedInEscalation(userId) &&
            (!effectiveDocData?.AcceptedByReviewer?.length ||
              !effectiveDocData?.AcceptedByReviewer.includes(userId));
          const canStakeholderOpen =
            effectiveDocData?.NeedAcceptanceFromStakeHolder === false &&
            isStakeholder &&
            stakeholderGroups.length > 1 &&
            (!IsGlobalView || (IsGlobalView && isMyActionableTrue)) &&
            !hasApprovedInEscalation(userId) &&
            (!effectiveDocData?.AcceptedByStakeHolder?.length ||
              !effectiveDocData?.AcceptedByStakeHolder.includes(userId));
          const canApproverOpen =
            effectiveDocData?.NeedAcceptanceForApprover === false &&
            isApprover &&
            (!IsGlobalView || (IsGlobalView && isMyActionableTrue)) &&
            approverGroups.length > 1 &&
            (!effectiveDocData?.AcceptedByApprover?.length ||
              !effectiveDocData?.AcceptedByApprover.includes(userId));
          if (canReviewerOpen || canStakeholderOpen || canApproverOpen) {
            setOpenOnlyOfficeModal(true);
          }
          setDocAndDocxFileUrl(`${BASE_URL}${effectiveDocData.DocumentPath}`);
        } else {
          setFileUrl(url);
        }
        const interval = setInterval(() => {}, 500);
        setTimeout(() => {
          clearInterval(interval);
          setLoadingDocument(false);
        }, 2000);
      } else {
        setFileUrl(null);
        setDocAndDocxFileUrl(null);
        setLoadingDocument(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [documentData, templateData]);

  const handleDocumentLoadSuccess = (e) => {
    setPageCount(e.doc.numPages);
    console.log("Total pages in PDF:", e.doc.numPages);
  };

  useEffect(() => {
    highlightText();
  }, [highlightedWords]);

  const handleAcknowledge = async () => {
    const payload = {
      ModuleID: documentData.DocumentID,
      IsAncknowledged: true,
      MasterVersion: documentData?.MasterVersion,
    };

    try {
      const actionResult = await dispatch(IAcknowledge(payload));
      if (IAcknowledge.fulfilled.match(actionResult)) {
        if (fromActionables && elementID) {
          dispatch(
            GetElementsFolderDocument({
              DocumentID: elementID,
              IsActionable: true,
            })
          );
        } else {
          dispatch(
            GetElementsFolderDocument({
              DocumentID: documentID,
              IsActionable: false,
            })
          );
        }
      } else {
        toast.error(
          actionResult.error?.message || "Failed to acknowledge document"
        );
      }
    } catch (error) {
      console.error("Error acknowledging document:", error);
      toast.error(error.message || "Failed to acknowledge document");
    }
  };
  const isAcknowledged = documentData?.IsAncknowledged === true;
  const userType = localStorage.getItem("user_type");
  const myTaskType = localStorage.getItem("my_task");

  const handleOpenModal = (heading) => {
    setModalHeading(heading);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalHeading("");
  };

  const handleItemClick = (position) => {
    highlightRiskCompliancePosition(position);
  };

  const highlightRiskCompliancePosition = (position) => {
    if (!position) {
      toast.error("No position information provided");
      return;
    }
    const pageIndex =
      position.PageIndex !== undefined
        ? position.PageIndex
        : position.Page
        ? position.Page - 1
        : currentPage - 1;
    setViewerInitialPage(pageIndex);
    setViewerKey((prev) => prev + 1);
    setRiskComplianceHighlight({
      ...position,
      id: `risk-compliance-${Date.now()}`,
      pageIndex,
    });
    setTimeout(() => {
      clearAllHighlights();
    }, 100);
  };

  const highlightText = () => {
    if (!textLayerRef.current) return;
    const firstPageSpans = textLayerRef.current.querySelectorAll(
      ".react-pdf__Page__textLayer span"
    );

    firstPageSpans.forEach((span) => {
      span.style.backgroundColor = "yellow";
    });
  };

  const onTextLayerRender = (e) => {
    textLayerRef.current = e.container;
    highlightText();
  };
  const UserFavorite = elementsDocumentFiles?.data?.UserFavorite || false;
  const handleDownloadMenuOpen = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };
  const handleDownloadMenuClose = () => {
    setDownloadAnchorEl(null);
  };
  const handleDownload = (format) => {
    let downloadUrl = "";
    if (format === "pdf" && fileUrl) {
      downloadUrl = fileUrl;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${documentData.DocumentName}.pdf`;
      link.click();
    } else if ((format === "docx" || format === "doc") && docAndDocxFileUrl) {
      downloadUrl = docAndDocxFileUrl;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${documentData.DocumentName}.docx`;
      link.click();
    } else {
      toast.error(`Unable to download ${format.toUpperCase()} file.`);
    }
  };

  const handleOpenModalOnlyOffice = async () => {
    const payload = {
      ContentID: documentData.ContentID,
      DocumentID: documentData.DocumentID,
      ModuleTypeID: documentData.ModuleTypeID,
      IsAccepted: true,
    };
    try {
      const result = await updateIsAccepted(payload);
      if (result.status === 200) {
        toast.success(result.message || "User Accepted.");
        setOpenOnlyOfficeModal(false);
      } else {
        toast.error(
          result.message || "Failed to Accept as other user would have accepted"
        );
        setOpenOnlyOfficeModal(false);
        navigate(-1);
      }
    } catch (error) {
      setOpenOnlyOfficeModal(false);
      navigate(-1);
      toast.error(
        error.message || "Failed to Accept as other user would have accepted"
      );
    }
  };
  const handleOpenModalDelegate = async (status) => {
    const updatedStatus = status == "Accept" ? "Accepted" : "Rejected";
    const checker = documentData?.CheckerAndStakeHolderIDs?.find((group) =>
      group?.Checker?.some(
        (checker) =>
          checker.IsDelegated === true &&
          checker.DelegateStatus === null &&
          checker.userId === userdata?.UserID
      )
    )?.Checker?.find(
      (checker) =>
        checker.IsDelegated === true &&
        checker.DelegateStatus === null &&
        checker.userId === userdata?.UserID
    );

    const stakeholder = documentData?.CheckerAndStakeHolderIDs?.find((group) =>
      group?.StakeHolder?.some(
        (stakeholder) =>
          stakeholder.IsDelegated === true &&
          stakeholder.DelegateStatus === null &&
          stakeholder.userId === userdata?.UserID
      )
    )?.StakeHolder?.find(
      (stakeholder) =>
        stakeholder.IsDelegated === true &&
        stakeholder.DelegateStatus === null &&
        stakeholder.userId === userdata?.UserID
    );

    let updatedUser = null;
    if (checker) {
      updatedUser = checker;
    } else if (stakeholder) {
      updatedUser = stakeholder;
    }

    if (updatedUser) {
      const updatedUserData = {
        ...updatedUser,
        DelegateStatus: updatedStatus,
      };

      const payload = {
        id: updatedUser.stakeHolderId || updatedUser.checkerId,
        idType: updatedUser.stakeHolderId
          ? "ModuleStakeHolderID"
          : "ModuleCheckerID",
        delegateStatus: updatedUserData.DelegateStatus,
      };

      try {
        const result = await delegateStatusUpdate(payload);
        if (result.data.success === true) {
          toast.success(result.data.message);
          setDelegateModal(false);
        } else if (result.data.success === false) {
          toast.error(result.data.message);
          setDelegateModal(false);
          navigate(-1);
        }
      } catch (error) {
        setDelegateModal(false);
        navigate(-1);
        toast.error(error.message || "Update Failed. Please try again later.");
      }
    }
  };
  const onHandleClose = () => {
    setOpenOnlyOfficeModal(false);
    navigate(-1);
  };
  const onDelegateHandleClose = () => {
    setDelegateModal(false);
    navigate(-1);
  };
  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const response = await GetSystemSettings({});
        const data = response.data.data;
        setCoCreation(
          data?.CoCreation === "true" ||
            data?.CoCreation === true ||
            data?.CoCreation === 1
        );
      } catch (error) {
        console.error("Error fetching system settings:", error);
      }
    };
    fetchSystemSettings();
  }, []);
  const highlightSelectedText = (position, comment) => {
    if (!position) {
      toast.error("No position information in this comment");
      return;
    }
    const pageIndex =
      position.pageIndex !== undefined
        ? position.pageIndex
        : position.page
        ? position.page - 1
        : currentPage - 1;
    const pageNumber = position.page || pageIndex + 1;
    setActiveCommentPosition({
      ...position,
      id: comment.id,
    });
    setViewerInitialPage(pageIndex);
    setViewerKey((prev) => prev + 1);
    setTimeout(() => {
      clearAllHighlights();
      const pageElement = document.querySelector(
        `.react-pdf__Page[data-page-number="${pageNumber}"]`
      );

      if (!pageElement) {
        console.error(`Page element for page ${pageNumber} not found`);
        return;
      }

      const textLayer = pageElement.querySelector(
        ".react-pdf__Page__textLayer"
      );

      if (!textLayer) {
        console.error("Text layer not found on page");
        return;
      }
      const textSpans = textLayer.querySelectorAll("span");
      let highlightedSpans = [];
      textSpans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const textLayerRect = textLayer.getBoundingClientRect();
        const relativeLeft = rect.left - textLayerRect.left;
        const relativeTop = rect.top - textLayerRect.top;
        const relativeRight = rect.right - textLayerRect.left;
        const relativeBottom = rect.bottom - textLayerRect.top;
        const isInHighlightArea =
          relativeLeft <= position.left + position.width &&
          relativeRight >= position.left &&
          relativeTop <= position.top + position.height &&
          relativeBottom >= position.top;
        if (isInHighlightArea || span.textContent.includes(comment?.text)) {
          span.style.backgroundColor = "#90EE90";
          span.classList.add("active-highlight");
          highlightedSpans.push(span);
        }
      });
      if (highlightedSpans.length > 0) {
        const firstSpan = highlightedSpans[0];
        const lastSpan = highlightedSpans[highlightedSpans.length - 1];
        const highlightTop = firstSpan.getBoundingClientRect().top;
        const highlightBottom = lastSpan.getBoundingClientRect().bottom;
        const highlightMiddle = (highlightTop + highlightBottom) / 2;
        const viewerContainer = document.querySelector(".rpv-core__viewer");
        if (!viewerContainer) return;
        const containerRect = viewerContainer.getBoundingClientRect();
        const containerMiddle = containerRect.top + containerRect.height / 2;
        const scrollAdjustment = highlightMiddle - containerMiddle;
        viewerContainer.scrollBy({
          top: scrollAdjustment,
          behavior: "smooth",
        });
      }
    }, 1000);
  };

  const handleReplyClick = (commentId) => {
    setReplyingToId(commentId);
    setReplyText("");
  };
  const handleSubmitReply = async (parentId) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    try {
      const payload = {
        DocumentModuleCommentID: parentId,
        ReplyText: replyText,
        ActionType: "Reply",
      };
      const response = await ReplyResolveCommentToPdfApi(payload);
      if (response.status === 201 || response.data?.success) {
        setReplyText("");
        setIsContextMenuOpen(false);
        toast.success("Reply added successfully!");
        setComments((prevComments) => {
          return prevComments.map((comment) =>
            comment.id === parentId
              ? {
                  ...comment,
                  replies: [...comment.replies, { ReplyText: replyText }],
                }
              : comment
          );
        });
      } else {
        toast.error(response.message || "Failed to submit reply.");
        dispatch(GetElementsFolderDocument({ DocumentID: documentID }));
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error(
        error.message || "Failed to submit reply due to a network error."
      );
      dispatch(GetElementsFolderDocument({ DocumentID: documentID }));
    }
  };
  const handleDeleteComment = async (commentId) => {
    // console.log("Deleting comment with ID:", commentId);
    try {
      const response = await DeleteCommentToPdfApi({
        DocumentModuleCommentID: commentId,
      });
      if (response.status === 200 || response.success) {
        setComments((prevComments) =>
          prevComments.filter(
            (comment) =>
              comment?.id !== commentId && comment?.parentId !== commentId
          )
        );
        toast.success("Comment deleted successfully!");
      } else {
        throw new Error(response.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error.message || "Failed to delete comment");
    }
  };
  const handleResolveComment = async (commentId) => {
    try {
      const response = await ReplyResolveCommentToPdfApi({
        DocumentModuleCommentID: commentId,
        ActionType: "Resolve",
        ReplyText: replyText || null,
      });
      if (
        response.status === 201 ||
        (response?.data && response?.data?.success)
      ) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, isResolved: true }
              : comment
          )
        );
        toast.success("Comment resolved successfully!");
      } else {
        const errorMsg =
          response.data?.message ||
          response.message ||
          "Failed to resolve comment (server responded with non-success status)";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error resolving comment:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to resolve comment due to network error";
      toast.error(errorMsg);
    }
  };
  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.comment);
  };
  const handleSaveEdit = async (commentId) => {
    if (editText.trim()) {
      setIsSavingEdit(true);
      try {
        const commentToEdit = comments.find(
          (comment) => comment.id === commentId
        );

        if (!commentToEdit) {
          toast.error("Comment not found");
          setIsSavingEdit(false);
          return;
        }
        const payload = {
          DocumentModuleCommentID: commentId,
          CommentText: editText,
          HighlightedText: commentToEdit.text,
          HighlightedTextPosition: {
            pageIndex:
              commentToEdit.position.pageIndex ||
              commentToEdit.position.page - 1,
            left: commentToEdit.position.left,
            top: commentToEdit.position.top,
            width: commentToEdit.position.width,
            height: commentToEdit.position.height,
          },
        };
        const response = await UpdateCommentToPdfApi(payload);
        if (response.status === 200 || response.success) {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    comment: editText,
                    editTimestamp: new Date().toISOString(),
                  }
                : comment
            )
          );
          setEditingCommentId(null);
          setEditText("");
          toast.success("Comment updated successfully!");
        } else {
          const errorMsg =
            response.data?.message ||
            response.message ||
            "Failed to update comment";
          toast.error(errorMsg);
        }
      } catch (error) {
        console.error("Error updating comment:", error);
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Failed to update comment";
        toast.error(errorMsg);
      } finally {
        setIsSavingEdit(false);
      }
    } else {
      toast.error("Please enter a comment");
    }
  };

  const handleCancelReply = () => {
    setReplyingToId(null);
    setReplyText("");
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
  };
  const isUserComment = elementsDocumentFiles?.data?.Comments?.some(
    (comment) => comment.UserID === currentUserID
  );
  const getPageStatusColor = (currentPages, totalPages) => {
    const percentage = (currentPages / totalPages) * 100;
    if (percentage >= 80) return "#C8E6C9";
    if (percentage >= 50) return "#FFF9C4";
    return "#E3F2FD";
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current
        ?.requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <Box>
      {loadingDocument ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <img
            src={Pageloader}
            alt="Loading..."
            style={{ height: "100px", width: "100px" }}
          />
        </Box>
      ) : (
        <CommonContainer
          rightSection={
            <RightSection documentData={templateData || documentData} />
          }
        >
          <>
            <Breadcrumbs
              bredcrumbs={breadcrumbsData}
              type={presistStore}
              isBack={true}
              handleBackButtonClick={handleBackButtonClick}
              documentData={templateData || documentData}
            />
          </>

          <>
            <Box className="header" sx={{ marginTop: "-0.1rem" }}>
              <Box className="header-text">
                <Typography variant="p" color={"primary.main"}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {templateData?.DocumentName ||
                      documentData?.DocumentName ||
                      "Loading..."}
                    {userId &&
                      ownerUserId &&
                      userId === ownerUserId &&
                      fileType &&
                      documentPermission === "owner" && (
                        <Chip
                          icon={<InfoOutlined fontSize="small" />}
                          label="Auto Save Enabled"
                          size="small"
                          sx={{
                            ml: 1,
                            height: "20px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            backgroundColor: "#E3F2FD",
                            color: "#1565C0",
                            border: "1px solid #90CAF9",
                            "& .MuiChip-icon": {
                              color: "#1565C0",
                              marginLeft: "2px",
                            },
                            "&:hover": {
                              backgroundColor: "#BBDEFB",
                            },
                          }}
                        />
                      )}
                    {(templateData || documentData)?.DocumentStatus !==
                      "InProgress" &&
                      showTimeData?.NoOfPageRead > 0 && (
                        <Tooltip title="Pages Read">
                          <Chip
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <VisibilityOutlined
                                  fontSize="small"
                                  sx={{
                                    opacity: 0.7,
                                    width: "15px",
                                    height: "15px",
                                  }}
                                />
                                {`${
                                  showTimeData?.NoOfPageRead || highestPageCont
                                } pages`}
                              </Box>
                            }
                            size="small"
                            color="default"
                            sx={{
                              ml: 1,
                              height: "20px",
                              fontSize: "0.7rem",
                              fontWeight: "bold",
                              backgroundColor: getPageStatusColor(
                                maxPagesRead,
                                pageCount
                              ),
                              border: "1px solid #cbd5e1",
                              color: "#475569",
                              "&:hover": {
                                backgroundColor: getPageStatusColor(
                                  maxPagesRead,
                                  pageCount
                                ),
                                opacity: 0.9,
                              },
                            }}
                          />
                        </Tooltip>
                      )}
                    {(templateData || documentData)?.DocumentStatus !==
                      "InProgress" &&
                      ((showTimeData?.Hours || 0) > 0 ||
                        (showTimeData?.Minutes || 0) > 0 ||
                        (showTimeData?.Seconds || 0) > 0) &&
                      (templateData || documentData)?.ReadingTimeValue &&
                      (templateData || documentData)?.ReadingTimeUnit && (
                        <Tooltip title="Total Reading Time">
                          <Chip
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <AccessTime
                                  fontSize="small"
                                  sx={{
                                    opacity: 0.7,
                                    height: "15px",
                                    width: "15px",
                                  }}
                                />
                                {`${showTimeData?.Hours || 0}h ${
                                  showTimeData?.Minutes || 0
                                }m ${showTimeData?.Seconds || 0}s`}
                              </Box>
                            }
                            size="small"
                            color="default"
                            sx={{
                              ml: 1,
                              height: "20px",
                              fontSize: "0.7rem",
                              fontWeight: "bold",
                              backgroundColor: getPageStatusColor(
                                maxPagesRead,
                                pageCount
                              ),
                              border: "1px solid #cbd5e1",
                              color: "#475569",
                              "&:hover": {
                                backgroundColor: getPageStatusColor(
                                  maxPagesRead,
                                  pageCount
                                ),
                                opacity: 0.9,
                              },
                            }}
                          />
                        </Tooltip>
                      )}
                    {elementsDocumentFiles?.data?.AuditorMessages &&
                      elementsDocumentFiles?.data?.AuditorMessages.length > 0 &&
                      (userType === "Auditor" ||
                        userType === "ProcessOwner") && (
                        <Badge
                          badgeContent={
                            elementsDocumentFiles?.data?.AuditorMessages?.length
                          }
                          color="error"
                          sx={{ ml: 1 }}
                        >
                          <Chip
                            label={t("audit")}
                            size="small"
                            color="primary"
                            onClick={() => {
                              localStorage.setItem("AuditSideBar", "true");
                              navigate(location.pathname, { replace: true });
                            }}
                            sx={{
                              ml: 1,
                              height: "20px",
                              fontSize: "0.7rem",
                              fontWeight: "bold",
                              backgroundColor: "#4CAF50",
                              cursor: "pointer",
                            }}
                          />
                        </Badge>
                      )}
                    <Tooltip title="Source SOP">
                      {documentData?.DocLinkedSOP?.length > 0 && (
                        <img
                          src={FourBox}
                          alt=""
                          style={{
                            height: "25px",
                            width: "25px",
                            marginLeft: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => setOpenSOPModal(true)}
                        />
                      )}
                    </Tooltip>
                  </span>
                </Typography>
                <Typography sx={{ color: "#64748B" }}>
                  version{" "}
                  {(templateData || documentData)?.DocumentStatus ===
                  "InProgress"
                    ? (templateData || documentData)?.DraftVersion
                    : (templateData || documentData)?.MasterVersion || "N/A"}
                  {`${" "}\u00A0(${
                    (templateData || documentData)?.SequenceNumber || ""
                  })`}
                </Typography>
              </Box>
              <div
                style={{
                  cursor:
                    (!documentData && !templateData) || loadingDocument
                      ? "not-allowed"
                      : "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {!fromActionables &&
                  documentData?.DocumentStatus === "Published" && (
                    <Acknowledge
                      handleAcknowledge={handleAcknowledge}
                      documentData={documentData}
                    />
                  )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "12px",
                    marginRight: "1rem",
                    marginBottom: "7px",
                  }}
                >
                  {/* Fullscreen Button */}
                  <Tooltip
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    <IconButton
                      onClick={handleFullscreenToggle}
                      sx={{
                        height: "40px",
                        width: "40px",
                        backgroundColor: bgColor,
                        borderRadius: "20%",
                      }}
                    >
                      {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="CTQ">
                    <Badge
                      badgeContent={0}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "orange",
                          color: "white",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          height: "40px",
                          width: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, #1976d2, #ff229cff)",
                          borderRadius: "20%",
                          cursor: "pointer",
                        }}
                        onClick={() => setOpenCTQModal(true)} // 👈 add this
                      >
                        <img
                          src={ctqIcons}
                          alt="Impact Analysis Icon"
                          style={{ width: "20px", height: "20px" }}
                        />
                      </Box>
                    </Badge>
                  </Tooltip>
                  {/* Risk Icon */}
                  {NoOfRisk > 0 && (
                    <Tooltip title={t("Risk")}>
                      <Badge badgeContent={NoOfRisk} color="error">
                        <Box
                          sx={{
                            height: "40px",
                            width: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: bgColor,
                            borderRadius: "20%",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={risk}
                            alt="Risk"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOpenModal("Risk")}
                          />
                        </Box>
                      </Badge>
                    </Tooltip>
                  )}

                  {/* Compliance Icon */}
                  {NoOfCompliance > 0 && (
                    <Tooltip title={t("Compliance")}>
                      <Badge badgeContent={NoOfCompliance} color="error">
                        <Box
                          sx={{
                            height: "40px",
                            width: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: bgColor,
                            borderRadius: "20%",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={com}
                            alt="Compliance"
                            onClick={() => handleOpenModal("Compliance")}
                          />
                        </Box>
                      </Badge>
                    </Tooltip>
                  )}

                  {/* Clause Icon */}
                  {NoOfClause > 0 && (
                    <Tooltip title={t("Clause")}>
                      <Badge
                        badgeContent={NoOfClause}
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: "orange",
                            color: "#fff",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            height: "40px",
                            width: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: bgColor,
                            borderRadius: "20%",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={cicon}
                            alt="Clause"
                            onClick={() => handleOpenModal("Clause")}
                          />
                        </Box>
                      </Badge>
                    </Tooltip>
                  )}
                  {isTemplates && (
                    <Tooltip title={t("Download")}>
                      <IconButton
                        onClick={handleDownloadMenuOpen}
                        sx={{
                          height: "40px",
                          width: "40px",
                          backgroundColor: bgColor,
                          borderRadius: "20%",
                        }}
                      >
                        <Download />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title={t("impactAnalysis")}>
                    <Box
                      sx={{
                        height: "40px",
                        width: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: bgColor,
                        borderRadius: "20%",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImpactAnalysis();
                      }}
                    >
                      <img
                        src={impactanalysisIcon}
                        alt="Impact Analysis Icon"
                      />
                    </Box>
                  </Tooltip>
                  <Tooltip
                    title={
                      UserFavorite ? t("AlreadyAdded") : t("AddToFavorites")
                    }
                  >
                    <Box
                      sx={{
                        height: "40px",
                        width: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: bgColor,
                        borderRadius: "20%",
                        cursor: "pointer",
                      }}
                      onClick={handleBookmarkClick}
                    >
                      <img
                        src={UserFavorite ? bookMark : NoFav}
                        alt={
                          UserFavorite
                            ? "Remove from Favorites"
                            : "Add to Favorites"
                        }
                      />
                    </Box>
                  </Tooltip>
                  {isTemplates && (
                    <Menu
                      anchorEl={downloadAnchorEl}
                      open={downloadOpen}
                      onClose={handleDownloadMenuClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      {fileUrl && (
                        <MenuItem
                          onClick={() => {
                            handleDownload("pdf");
                            handleDownloadMenuClose();
                          }}
                        >
                          Download PDF
                        </MenuItem>
                      )}
                      {docAndDocxFileUrl && (
                        <MenuItem
                          onClick={() => {
                            handleDownload("docx");
                            handleDownloadMenuClose();
                          }}
                        >
                          Download DOCX
                        </MenuItem>
                      )}
                    </Menu>
                  )}

                  {documentData?.DocumentStatus === "Published" &&
                    elementsDocumentFiles?.data?.CreatedBy === userId &&
                    (documentData?.DocumentPath?.endsWith(".docx") ||
                      documentData?.DocumentPath?.endsWith(".doc")) && (
                      <Button
                        variant="contained"
                        sx={{ height: "40px" }}
                        onClick={() => setConvertModalOpen(true)}
                      >
                        Convert
                      </Button>
                    )}
                </Box>
              </div>
            </Box>
            <Box
              ref={fullscreenRef}
              sx={{
                position: isFullscreen ? "relative" : "static",
                backgroundColor: isFullscreen ? "#fff" : "transparent",
                height: isFullscreen ? "100vh" : "auto",
                overflow: isFullscreen ? "auto" : "visible",
              }}
            >
              {/* Fullscreen header when in fullscreen mode */}
              {isFullscreen && (
                <Box
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #e0e0e0",
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" color="primary.main">
                    {templateData?.DocumentName || documentData?.DocumentName}
                  </Typography>
                  <IconButton onClick={handleFullscreenToggle}>
                    <FullscreenExit />
                  </IconButton>
                </Box>
              )}

              {fileUrl && !docAndDocxFileUrl ? (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box
                    sx={{
                      width:
                        localStorage.getItem("AuditSideBar") === "false"
                          ? "100%"
                          : comments?.length > 0
                          ? "80%"
                          : "100%",
                      transition: "width 0.3s ease-in-out",
                    }}
                  >
                    <Worker
                      workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                    >
                      <div
                        style={{
                          height: isFullscreen ? "calc(100vh - 80px)" : "700px",
                          filter:
                            (userType === "EndUser" ||
                              myTaskType === "EndUser") &&
                            !isAcknowledged &&
                            !fromActionables &&
                            !isMyActionableTrue
                              ? "blur(5px)"
                              : "none",
                          pointerEvents:
                            (userType === "EndUser" ||
                              myTaskType === "EndUser") &&
                            !isAcknowledged &&
                            !fromActionables &&
                            !isMyActionableTrue
                              ? "none"
                              : "auto",
                          position: "relative",
                        }}
                        id="step1"
                      >
                        <Viewer
                          key={viewerKey}
                          fileUrl={fileUrl}
                          onTextLayerRender={onTextLayerRender}
                          onDocumentLoad={handleDocumentLoadSuccess}
                          initialPage={viewerInitialPage}
                          onPageChange={(e) => {
                            setCurrentPage(e.currentPage);
                          }}
                          plugins={[
                            // defaultLayoutPluginInstance, Removed the for hide all the options no need to show in the pdf viewer
                            highlightPluginInstance,
                          ]}
                        />
                      </div>
                    </Worker>
                  </Box>
                  {localStorage.getItem("AuditSideBar") === "false" && (
                    <Box>
                      {comments?.length > 0 && (
                        <Paper
                          ref={commentsListRef}
                          sx={{
                            width: "320px",
                            height: "600px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: "12px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            border: "1px solid rgba(0,0,0,0.05)",
                            backgroundColor: "#fefefe",
                          }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              borderBottom: "1px solid rgba(0,0,0,0.05)",
                              background:
                                "linear-gradient(to right, #f6f7f9, #eef1f5)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: "#2d3748",
                                fontSize: "1.1rem",
                              }}
                            >
                              Document Comments ({comments?.length})
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              flexGrow: 1,
                              overflowY: "auto",
                              p: 1,
                              "&::-webkit-scrollbar": {
                                width: "6px",
                              },
                              "&::-webkit-scrollbar-track": {
                                background: "rgba(0,0,0,0.03)",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                background: "rgba(0,0,0,0.1)",
                                borderRadius: "3px",
                              },
                            }}
                          >
                            {comments?.length > 0 ? (
                              <List sx={{ py: 0 }}>
                                {comments.map((comment, index) => (
                                  <React.Fragment key={comment?.id}>
                                    <ListItem
                                      alignItems="flex-start"
                                      sx={{
                                        flexDirection: "column",
                                        p: 2,
                                        mb: 1,
                                        borderRadius: "8px",
                                        transition: "all 0.2s ease",
                                        backgroundColor:
                                          activeCommentPosition ===
                                          comment?.position
                                            ? "rgba(33, 150, 243, 0.08)"
                                            : index % 2 === 0
                                            ? "rgba(0,0,0,0.02)"
                                            : "transparent",
                                        border:
                                          activeCommentPosition ===
                                          comment?.position
                                            ? "1px solid rgba(33, 150, 243, 0.3)"
                                            : "1px solid transparent",
                                        "&:hover": {
                                          backgroundColor:
                                            activeCommentPosition ===
                                            comment?.position
                                              ? "rgba(33, 150, 243, 0.1)"
                                              : "rgba(0,0,0,0.03)",
                                        },
                                      }}
                                      onClick={() => {
                                        clearAllHighlights();
                                        highlightSelectedText(
                                          comment?.position,
                                          comment
                                        );
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          width: "100%",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          mb: 1,
                                        }}
                                      >
                                        <Box>
                                          <Typography
                                            variant="subtitle2"
                                            sx={{
                                              fontWeight: 600,
                                              color: "#2d3748",
                                            }}
                                          >
                                            {comment?.user}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              color: "#718096",
                                              fontSize: "0.7rem",
                                              display: "block",
                                            }}
                                          >
                                            Page {comment?.position?.page}
                                          </Typography>
                                        </Box>
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            color: "#718096",
                                            fontSize: "0.7rem",
                                            alignSelf: "flex-start",
                                          }}
                                        >
                                          {new Date(
                                            comment?.timestamp
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          p: 1.5,
                                          mb: 1.5,
                                          backgroundColor:
                                            "rgba(236, 239, 241, 0.5)",
                                          borderRadius: "6px",
                                          borderLeft: "3px solid #90caf9",
                                          width: "100%",
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            color: "#37474f",
                                            fontSize: "0.75rem",
                                            lineHeight: 1.4,
                                            fontStyle: "italic",
                                          }}
                                        >
                                          {comment?.text}
                                        </Typography>
                                      </Box>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: "#4a5568",
                                          fontSize: "0.875rem",
                                          lineHeight: 1.5,
                                          mb: 1.5,
                                        }}
                                      >
                                        {comment?.comment}
                                      </Typography>

                                      {comment?.replies?.length > 0 && (
                                        <Box
                                          sx={{
                                            pl: 1.5,
                                            ml: 1.5,
                                            mt: 1.5,
                                            borderLeft:
                                              "2px solid rgba(0,0,0,0.08)",
                                          }}
                                        >
                                          {comment?.replies?.map(
                                            (reply, idx) => (
                                              <Box key={idx} sx={{ mt: 1.5 }}>
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                      "space-between",
                                                    mb: 0.5,
                                                  }}
                                                >
                                                  <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                      fontWeight: 600,
                                                      color: "#2d3748",
                                                      fontSize: "0.8rem",
                                                    }}
                                                  >
                                                    {reply.RepliedBy}{" "}
                                                    <Typography
                                                      component="span"
                                                      variant="caption"
                                                      sx={{
                                                        color: "#718096",
                                                        ml: 0.5,
                                                        fontSize: "0.7rem",
                                                      }}
                                                    >
                                                      (replied)
                                                    </Typography>
                                                  </Typography>
                                                  <Typography
                                                    variant="caption"
                                                    sx={{
                                                      color: "#718096",
                                                      fontSize: "0.7rem",
                                                    }}
                                                  >
                                                    {new Date(
                                                      reply.ReplyDateTime
                                                    ).toLocaleTimeString([], {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                    })}
                                                  </Typography>
                                                </Box>
                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    color: "#4a5568",
                                                    fontSize: "0.8rem",
                                                    lineHeight: 1.4,
                                                  }}
                                                >
                                                  {reply.ReplyText}
                                                </Typography>
                                              </Box>
                                            )
                                          )}
                                        </Box>
                                      )}

                                      {replyingToId === comment.id && (
                                        <Box
                                          sx={{
                                            width: "100%",
                                            mt: 1.5,
                                            mb: 1,
                                            p: 1.5,
                                            backgroundColor: "rgba(0,0,0,0.02)",
                                            borderRadius: "8px",
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <TextField
                                            fullWidth
                                            size="small"
                                            multiline
                                            rows={2}
                                            variant="outlined"
                                            placeholder="Type your reply..."
                                            value={replyText}
                                            onChange={(e) =>
                                              setReplyText(e.target.value)
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                            onFocus={(e) => e.stopPropagation()}
                                            sx={{
                                              mb: 1,
                                              "& .MuiOutlinedInput-root": {
                                                borderRadius: "6px",
                                                fontSize: "0.875rem",
                                              },
                                            }}
                                          />
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "flex-end",
                                              gap: 1,
                                            }}
                                          >
                                            <Button
                                              size="small"
                                              variant="text"
                                              color="inherit"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancelReply();
                                              }}
                                              startIcon={
                                                <Close fontSize="small" />
                                              }
                                              sx={{
                                                textTransform: "none",
                                                fontSize: "0.75rem",
                                                color: "#718096",
                                              }}
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              size="small"
                                              variant="contained"
                                              color="primary"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleSubmitReply(comment.id);
                                              }}
                                              disabled={
                                                isSubmittingReply &&
                                                activeReplyId === comment.id
                                              }
                                              startIcon={
                                                isSubmittingReply &&
                                                activeReplyId === comment.id ? (
                                                  <CircularProgress
                                                    size={16}
                                                    color="inherit"
                                                  />
                                                ) : (
                                                  <Send fontSize="small" />
                                                )
                                              }
                                              sx={{
                                                textTransform: "none",
                                                fontSize: "0.75rem",
                                                px: 1.5,
                                                py: 0.5,
                                                boxShadow: "none",
                                              }}
                                            >
                                              {isSubmittingReply
                                                ? "Posting..."
                                                : "Post Reply"}
                                            </Button>
                                          </Box>
                                        </Box>
                                      )}

                                      {editingCommentId === comment.id && (
                                        <Box
                                          sx={{
                                            width: "100%",
                                            mt: 1.5,
                                            mb: 1,
                                            p: 1.5,
                                            backgroundColor: "rgba(0,0,0,0.02)",
                                            borderRadius: "8px",
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <TextField
                                            fullWidth
                                            size="small"
                                            multiline
                                            rows={2}
                                            variant="outlined"
                                            placeholder="Edit your comment..."
                                            value={editText}
                                            onChange={(e) =>
                                              setEditText(e.target.value)
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                            onFocus={(e) => e.stopPropagation()}
                                            sx={{
                                              mb: 1,
                                              "& .MuiOutlinedInput-root": {
                                                borderRadius: "6px",
                                                fontSize: "0.875rem",
                                              },
                                            }}
                                          />
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "flex-end",
                                              gap: 1,
                                            }}
                                          >
                                            <Button
                                              size="small"
                                              variant="text"
                                              color="inherit"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancelEdit();
                                              }}
                                              startIcon={
                                                <Close fontSize="small" />
                                              }
                                              sx={{
                                                textTransform: "none",
                                                fontSize: "0.75rem",
                                                color: "#718096",
                                              }}
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              size="small"
                                              variant="contained"
                                              color="primary"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleSaveEdit(comment.id);
                                              }}
                                              disabled={isSavingEdit}
                                              startIcon={
                                                isSavingEdit ? (
                                                  <CircularProgress
                                                    size={16}
                                                    color="inherit"
                                                  />
                                                ) : (
                                                  <Save fontSize="small" />
                                                )
                                              }
                                              sx={{
                                                textTransform: "none",
                                                fontSize: "0.75rem",
                                                px: 1.5,
                                                py: 0.5,
                                                boxShadow: "none",
                                              }}
                                            >
                                              {isSavingEdit
                                                ? "Saving..."
                                                : "Save Changes"}
                                            </Button>
                                          </Box>
                                        </Box>
                                      )}

                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "flex-end",
                                          gap: 1,
                                          mt: 1,
                                        }}
                                      >
                                        {!isUserComment && (
                                          <Button
                                            size="small"
                                            variant="text"
                                            color="primary"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleReplyClick(
                                                comment.id,
                                                comment.text
                                              );
                                            }}
                                            startIcon={
                                              <Reply fontSize="small" />
                                            }
                                            sx={{
                                              textTransform: "none",
                                              fontSize: "0.7rem",
                                              minWidth: "auto",
                                              px: 1,
                                              py: 0.25,
                                              color: "#4299e1",
                                              "&:hover": {
                                                backgroundColor:
                                                  "rgba(66, 153, 225, 0.08)",
                                              },
                                            }}
                                          >
                                            Reply
                                          </Button>
                                        )}
                                        {isUserComment && (
                                          <>
                                            <Button
                                              size="small"
                                              variant="text"
                                              color="info"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(comment);
                                              }}
                                              startIcon={
                                                <Edit fontSize="small" />
                                              }
                                              sx={{
                                                textTransform: "none",
                                                fontSize: "0.7rem",
                                                minWidth: "auto",
                                                px: 1,
                                                py: 0.25,
                                                color: "#38b2ac",
                                                "&:hover": {
                                                  backgroundColor:
                                                    "rgba(56, 178, 172, 0.08)",
                                                },
                                              }}
                                            >
                                              Edit
                                            </Button>
                                            <Button
                                              size="small"
                                              variant="text"
                                              color="error"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteComment(comment.id);
                                              }}
                                              startIcon={
                                                <Delete fontSize="small" />
                                              }
                                              sx={{
                                                textTransform: "none",
                                                fontSize: "0.7rem",
                                                minWidth: "auto",
                                                px: 1,
                                                py: 0.25,
                                                color: "#f56565",
                                                "&:hover": {
                                                  backgroundColor:
                                                    "rgba(245, 101, 101, 0.08)",
                                                },
                                              }}
                                            >
                                              Delete
                                            </Button>

                                            <Button
                                              size="small"
                                              variant="text"
                                              color="success"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleResolveComment(
                                                  comment.id
                                                );
                                              }}
                                              startIcon={
                                                <Check fontSize="small" />
                                              }
                                              sx={{
                                                textTransform: "none",
                                                fontSize: "0.7rem",
                                                minWidth: "auto",
                                                px: 1,
                                                py: 0.25,
                                                color: "#48bb78",
                                                "&:hover": {
                                                  backgroundColor:
                                                    "rgba(72, 187, 120, 0.08)",
                                                },
                                              }}
                                            >
                                              Resolve
                                            </Button>
                                          </>
                                        )}
                                      </Box>
                                    </ListItem>
                                    {index <
                                      comments.filter((c) => !c.isReply)
                                        ?.length -
                                        1 && (
                                      <Divider
                                        sx={{
                                          my: 0.5,
                                          borderColor: "rgba(0,0,0,0.04)",
                                        }}
                                      />
                                    )}
                                  </React.Fragment>
                                ))}
                              </List>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: "100%",
                                  p: 3,
                                  textAlign: "center",
                                }}
                              >
                                <ChatBubbleOutline
                                  sx={{
                                    fontSize: "3rem",
                                    color: "rgba(0,0,0,0.12)",
                                    mb: 1.5,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "rgba(0,0,0,0.36)",
                                    fontWeight: 500,
                                  }}
                                >
                                  No comments yet
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "rgba(0,0,0,0.24)",
                                    mt: 0.5,
                                  }}
                                >
                                  Add your first comment
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Paper>
                      )}
                    </Box>
                  )}
                </Box>
              ) : templatefolder !== "Create Template" &&
                documentData &&
                !openOnlyOfficeModal &&
                !delegateModal ? (
                <>
                  {coCreation &&
                  !documentData?.DocumentPath?.includes(".pdf") ? (
                    <Box
                      sx={{
                        height: isFullscreen ? "calc(100vh - 80px)" : "auto",
                      }}
                    >
                      <OnlyOffice
                        documentData={documentData}
                        type="document"
                        documentPermission={(e) => setDocumentPermission(e)}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        height: isFullscreen ? "calc(100vh - 80px)" : "auto",
                      }}
                    >
                      <DocViewer
                        fileUrl={docAndDocxFileUrl}
                        handleDocumentLoadSuccess={handleDocumentLoadSuccess}
                      />
                    </Box>
                  )}
                </>
              ) : templateData ? (
                <>
                  <Box
                    sx={{
                      height: isFullscreen ? "calc(100vh - 80px)" : "auto",
                    }}
                  >
                    <OnlyOffice documentData={templateData} type="template" />
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "600px",
                  }}
                >
                  <Typography
                    color="error"
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {fileUrl && docAndDocxFileUrl ? "" : ""}
                  </Typography>
                </Box>
              )}
            </Box>
          </>
          <RiskAndComplianceModal
            open={openModal}
            onClose={handleCloseModal}
            heading={modalHeading}
            content={`Content related to ${modalHeading} will go here.`}
            RiskAndCompliences={RiskAndCompliences}
            onItemClick={handleItemClick}
          />
          {openOnlyOfficeModal && coCreation && (
            <OnlyOfficeModal
              open={openOnlyOfficeModal}
              onClose={onHandleClose}
              handleSave={handleOpenModalOnlyOffice}
            />
          )}
          {delegateModal && (
            <DelegateModal
              open={delegateModal}
              onClose={onDelegateHandleClose}
              handleSave={(rec) => {
                handleOpenModalDelegate(rec);
              }}
            />
          )}

          {showExitModal && (
            <DocumentExitModal
              open={showExitModal}
              onCancel={cancelExit}
              onConfirm={confirmExit}
              documentName={documentData?.DocumentName}
              pagesViewedCount={Array.from(pagesViewed).length}
              timeSpentMinutes={timeSpent}
              requiredMinutes={getRequiredReadingTimeInMinutes()}
            />
          )}

          <SOPModal
            open={openSOPModal}
            onClose={() => setOpenSOPModal(false)}
            elementsDocumentFiles={elementsDocumentFiles}
          />
          <CTQModal
            open={openCTQModal}
            onClose={() => setOpenCTQModal(false)}
          />
          <ConvertModal
            open={convertModalOpen}
            onClose={() => setConvertModalOpen(false)}
            DocumentModuleDraftID={
              elementsDocumentFiles?.data?.DocumentModuleDraftID
            }
          />
        </CommonContainer>
      )}
    </Box>
  );
};

export default AccountOpeningForm;
