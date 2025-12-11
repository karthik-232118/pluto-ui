import React, { useEffect, useState, useRef } from "react";
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
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GetElementsFolderDocument } from "../../../store/elements/action";
import bookMark from "../../../assets/svg/accountOpening-Svg/BookMark-blue.svg";
import "./AccountOpeningForm.css";
import Breadcrumbs from "../../breadcrumbs/Breadcrumbs";
import { toast } from "react-toastify";
import { GetAddFavourites } from "../../../store/favourites/action";
import { BASE_URL } from "../../../config/urlConfig";
import { impactAnalysis } from "../../../store/impactAnalysis/ImpactAnalysis";
import { setDetailsData, setLoading } from "../../../store/details/slice";
import {
  Worker,
  Viewer,
  Position as PDFPositon,
  PrimaryButton,
} from "@react-pdf-viewer/core";
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
import NoFav from "../../../assets/svg/navbar/favone.svg";
import { Download } from "@mui/icons-material";
import OnlyOffice from "../../docViewer/OnlyOffice";
import Pageloader from "../../../assets/image/cubeloader1.gif";
import seecomment from "../../../assets/image/accountOpening/seecomment.png";
import introJs from "intro.js";
import "intro.js/introjs.css";
import OnlyOfficeModal from "../../docViewer/OnlyOfficeModal";
import { updateIsAccepted } from "../../../services/documentModules/DocumentsModule";
import DelegateModal from "../../docViewer/DelegateModal";
import { delegateStatusUpdate } from "../../../services/activitysidebar/ActivitySidebar";
import { GetSystemSettings } from "../../../services/settings/Settings";
import FourBox from "../../../assets/image/accountOpening/sop.png";
import SOPModal from "./SOPModal";
import { CommentOutlined, Close } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { PDFDocument, rgb } from "pdf-lib";
// import { highlightPlugin, HighlightArea, SelectionData } from "@react-pdf-viewer/highlight";
import { highlightPlugin, MessageIcon } from "@react-pdf-viewer/highlight";
import {
  Button as PDFButton,
  Position,
  Tooltip as PDFTooltip,
} from "@react-pdf-viewer/core";

const AccountOpeningForm = () => {
  const textLayerRef = useRef();
  const [highlightedWords, setHighlightedWords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileUrl, setFileUrl] = useState(null);
  const [docAndDocxFileUrl, setDocAndDocxFileUrl] = useState(null);
  const [docId, setDocId] = useState(null);
  const [docName, setDocName] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(true);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [loadingDocument, setLoadingDocument] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const downloadOpen = Boolean(downloadAnchorEl);
  const [openOnlyOfficeModal, setOpenOnlyOfficeModal] = useState(false);
  const [delegateModal, setDelegateModal] = useState(false);
  const [coCreation, setCoCreation] = useState(false);
  const [openSOPModal, setOpenSOPModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [comments, setComments] = useState([]);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [showCommentsList, setShowCommentsList] = useState(true);
  const commentFormRef = useRef(null);
  const commentsListRef = useRef(null);
  const viewerRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { userdata } = useSelector((state) => state?.user);
  const { elementsDocumentFiles } = useSelector((state) => state.elements);
  const { linkedID } = useSelector((state) => state.linkedData);

  const { RiskAndCompliences } = useSelector(
    (state) => state.RiskAndCompliences
  );

  const elementID = useSelector((state) => state.elementid.elementID);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );

  console.log(currentPage, "currentPageuseState");
  console.log(presistStore?.DocumentStatus, "presistStoreind");

  console.log("presistStopresStoreAccount:", presistStore?.ElementID);

  const searchSelectedId = useSelector((state) => state.selectedId.value);

  const storedDocumentID = presistStore?.DocumentID;
  const fromActionables = location.state?.fromActionables || false;
  const documentID = fromActionables
    ? presistStore?.ElementID || elementID
    : id || linkedID || storedDocumentID || searchSelectedId;

  useEffect(() => {
    console.log(documentID, "URL ID");
    console.log(fromActionables, "URL ID");
  }, [id]);
  const my_task = localStorage.getItem("my_task");
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

      dispatch(
        GetElementsFolderDocument({
          DocumentID: documentID,
          IsActionable: isActionable,
          IsDraft: presistStore?.IsDraft || false,
          IsEnableMyTask: my_task ? true : false,
        })
      )
        .unwrap()
        .catch((error) => {
          console.error("Failed to fetch document:", error);
        });
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

  const documentData = elementsDocumentFiles?.data;

  const breadcrumbsData = elementsDocumentFiles?.bredcrumbs;
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

  const handleBackButtonClick = () => {
    navigate(-1);
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
      toast.error(error.message || "Failed to add to favourites");
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
    setLoadingPercentage(0);
    setDocumentLoading(true); // Reset loading state to show the loader
    setLoadingDocument(true);

    if (!documentData) {
      setFileUrl(null);
      setDocAndDocxFileUrl(null);
      setDocumentLoading(false);
      setLoading(false);
      return;
    }

    if (documentData) {
      localStorage.setItem(
        "OwnerData",
        JSON.stringify(
          documentData?.CheckerAndStakeHolderIDs?.CheckerAndStakeHolderIDs?.[2]
            ?.Owner
        )
      );
    }

    if (
      documentData?.CheckerAndStakeHolderIDs?.some((group) =>
        group?.Checker?.some(
          (checker) =>
            checker.userId === userdata?.UserID &&
            checker.IsDelegated === true &&
            checker.DelegateStatus === null
        )
      ) ||
      documentData?.CheckerAndStakeHolderIDs?.some((group) =>
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
      if (documentData?.DocumentPath) {
        const url = `${BASE_URL}${documentData.DocumentPath}`;
        const fileExtension = url.split(".").pop();

        function getDocumentAcceptance(doc) {
          const checkerObj = doc.CheckerAndStakeHolderIDs.find((item) =>
            Object.prototype.hasOwnProperty.call(item, "Checker")
          );
          if (checkerObj && checkerObj.Checker !== null) {
            return doc.NeedAcceptance;
          } else {
            return doc.NeedAcceptanceFromStakeHolder;
          }
        }

        const acceptance = getDocumentAcceptance(documentData);

        if (fileExtension === "doc" || fileExtension === "docx") {
          if (
            !documentData?.NeedAcceptance &&
            !documentData?.NeedAcceptanceFromStakeHolder &&
            ((documentData?.IsAccepted === false &&
              (!documentData?.AcceptedBy ||
                documentData?.AcceptedBy.length === 0) &&
              (documentData?.CheckerAndStakeHolderIDs?.some((group) =>
                group?.Checker?.some(
                  (checker) => checker.userId === userdata?.UserID
                )
              ) ||
                documentData?.CheckerAndStakeHolderIDs?.some((group) =>
                  group?.StakeHolder?.some(
                    (stakeholder) => stakeholder.userId === userdata?.UserID
                  )
                ))) ||
              (documentData?.IsAccepted === true &&
                documentData?.AcceptedBy?.length > 0 &&
                !documentData?.AcceptedBy.includes(userdata?.UserID) &&
                (documentData?.CheckerAndStakeHolderIDs?.some((group) =>
                  group?.Checker?.some(
                    (checker) => checker.userId === userdata?.UserID
                  )
                ) ||
                  documentData?.CheckerAndStakeHolderIDs?.some((group) =>
                    group?.StakeHolder?.some(
                      (stakeholder) => stakeholder.userId === userdata?.UserID
                    )
                  ))))
          ) {
            setOpenOnlyOfficeModal(true);
          }

          if (documentData.EditedDocumentPath) {
            setDocAndDocxFileUrl(
              `${BASE_URL}${documentData.EditedDocumentPath}`
              // `https://47b7-2401-4900-1f27-d1e6-e8ca-6f42-3e39-91f7.ngrok-free.app/${documentData.EditedDocumentPath}`
            );
          } else {
            setDocAndDocxFileUrl(
              `${BASE_URL}${documentData.DocumentPath}`
              // `https://47b7-2401-4900-1f27-d1e6-e8ca-6f42-3e39-91f7.ngrok-free.app/${documentData.DocumentPath}`
            );
          }

          setDocId(documentData?.DocumentID);
          setDocName(documentData?.DocumentName);
        } else {
          setFileUrl(url);
        }
        const interval = setInterval(() => {
          setLoadingPercentage((prev) => Math.min(prev + 10, 90)); // Increment till 90%
        }, 500);

        setTimeout(() => {
          clearInterval(interval);
          setLoadingDocument(false);
        }, 2000);
      } else {
        setFileUrl(null);
        setDocAndDocxFileUrl(null);
        setDocumentLoading(false);
        setLoadingDocument(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [documentData]);
  const handleDocumentLoadSuccess = () => {
    setDocumentLoading(false);
    setLoadingPercentage(100);
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
  const handleItemClick = (item) => {
    console.log("Clicked item:", item);
    setHighlightedWords((prev) => [...prev, item]);
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
    console.log("Hello i");
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

  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/`;
  };

  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };

  useEffect(() => {
    if (documentData?.DocumentPath) {
      const fileExtension = documentData.DocumentPath.split(".")
        .pop()
        .toLowerCase();

      if (fileExtension === "docx") {
        const docxFileDetected = getCookie("docx_file_detected");

        if (!docxFileDetected) {
          const intro = introJs();
          intro.setOptions({
            steps: [
              {
                element: "#step1",
                intro: "Right click on the document to add the comments.",
                position: "bottom",
              },
              {
                element: "#step2",
                intro: "Multiple comments can be added to the document.",
                position: "top",
              },
              {
                element: "#step3",
                intro: `
                  <div>
                    <p>Click here to see the added comments.</p>
                    <img src="${seecomment}" alt="See Comments" style="width: auto; height: auto; margin-top: 10px;" />
                  </div>
                `,
                position: "top",
              },
            ],
          });

          intro.start();

          setCookie("docx_file_detected", "true", 365);
        }
      }
    }
  }, [documentData]);

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

  const handleTextSelection = (e) => {
    console.log("Text selection event triggered", e, viewerRef.current);
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text && text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const textLayer = textLayerRef.current;
      const textLayerRect = textLayer
        ? textLayer.getBoundingClientRect()
        : null;
      let pageNumber = null;
      let element = range.commonAncestorContainer;
      while (element && element !== document.body) {
        if (
          element.classList &&
          element.classList.contains("rpv-core__page-layer")
        ) {
          const pageNum = element.getAttribute("data-page-number");
          if (pageNum) {
            pageNumber = parseInt(pageNum, 10);
          }
          break;
        }
        element = element.parentElement;
      }
      if (pageNumber === null) {
        const pageElements = document.querySelectorAll(".rpv-core__page-layer");
        for (let i = 0; i < pageElements.length; i++) {
          const pageEl = pageElements[i];
          const pageElRect = pageEl.getBoundingClientRect();
          if (rect.top >= pageElRect.top && rect.bottom <= pageElRect.bottom) {
            const pageNum = pageEl.getAttribute("data-page-number");
            if (pageNum) {
              pageNumber = parseInt(pageNum, 10);
              break;
            }
          }
        }
      }

      const relLeft = textLayerRect
        ? rect.left - textLayerRect.left
        : rect.left;
      const relTop = textLayerRect ? rect.top - textLayerRect.top : rect.top;

      const pdfSelectionPosition = {
        left: relLeft,
        top: relTop,
        width: rect.width,
        height: rect.height,
        page: currentPage || pageNumber || 1,
        absLeft: rect.left,
        absTop: rect.top,
      };

      console.log("PDF Selection Position:", pdfSelectionPosition);
      console.log("Current Page Number:", pdfSelectionPosition.page);

      setSelectedText(text);
      setContextMenuPosition({
        left: rect.right,
        top: rect.bottom,
      });
      setIsContextMenuOpen(true);
      setLastPdfSelectionPosition(pdfSelectionPosition);
    } else {
      setIsContextMenuOpen(false);
    }
  };
  const [lastPdfSelectionPosition, setLastPdfSelectionPosition] =
    useState(null);
  const handleAddComment = () => {
    if (currentComment.trim()) {
      if (!lastPdfSelectionPosition) {
        toast.error("No selection position found.");
        return;
      }
      const newComment = {
        id: uuidv4(),
        text: selectedText,
        comment: currentComment,
        timestamp: new Date().toISOString(),
        user: userdata?.Name || "User",
        position: lastPdfSelectionPosition,
      };

      setComments((prevComments) => [...prevComments, newComment]);
      setCurrentComment("");
      setIsCommentFormOpen(false);
      setIsContextMenuOpen(false);
      setShowCommentsList(true);
      toast.success("Comment added successfully!");
    } else {
      toast.error("Please enter a comment");
    }
  };

  const [viewerInitialPage, setViewerInitialPage] = useState(0);
  const [viewerKey, setViewerKey] = useState(0);
  const [pagesTextContent, setPagesTextContent] = useState({});
  const extractPageText = (pageNumber) => {
    const pageElement = document.querySelector(
      `[data-page-number="${pageNumber}"]`
    );
    if (pageElement) {
      const textLayer = pageElement.querySelector(
        ".react-pdf__Page__textLayer"
      );
      if (textLayer) {
        const text = Array.from(textLayer.childNodes)
          .map((node) => node.textContent)
          .join(" ");
        console.log(`Text content from page ${pageNumber}:`, text);
        return text;
      }
    }
    return null;
  };

  const highlightSelectedText = (position) => {
    setActiveCommentPosition(position);

    if (position && position.page) {
      setViewerInitialPage(position.page);
      setViewerKey((prev) => prev + 1);

      setTimeout(() => {
        const pageText = extractPageText(position.page);
        if (pageText) {
          setPagesTextContent((prev) => ({
            ...prev,
            [position.page]: pageText,
          }));
        }
      }, 1000);
    }
  };
  const [activeCommentPosition, setActiveCommentPosition] = useState(null);
  useEffect(() => {
    if (!activeCommentPosition || !textLayerRef.current) return;

    const textLayer = textLayerRef.current;
    const textSpans = textLayer.querySelectorAll(
      ".react-pdf__Page__textLayer span"
    );
    textSpans.forEach((span) => {
      span.style.backgroundColor = "transparent";
    });
    const textLayerRect = textLayer.getBoundingClientRect();
    const highlightLeft = textLayerRect.left + activeCommentPosition.left;
    const highlightTop = textLayerRect.top + activeCommentPosition.top;

    let found = false;
    textSpans.forEach((span) => {
      const spanRect = span.getBoundingClientRect();
      if (
        spanRect.left >= highlightLeft &&
        spanRect.right <= highlightLeft + activeCommentPosition.width &&
        spanRect.top >= highlightTop &&
        spanRect.bottom <= highlightTop + activeCommentPosition.height
      ) {
        span.style.backgroundColor = "#90EE90";
        if (!found) {
          span.scrollIntoView({ behavior: "smooth", block: "center" });
          found = true;
        }
      }
    });
  }, [activeCommentPosition]);
  const handleDeleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
    toast.success("Comment deleted successfully!");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        commentFormRef.current &&
        !commentFormRef.current.contains(event.target)
      ) {
        if (!isContextMenuOpen) {
          setIsCommentFormOpen(false);
        }
      }

      if (
        commentsListRef.current &&
        !commentsListRef.current.contains(event.target) &&
        !event.target.closest(".comments-toggle-button")
      ) {
        setShowCommentsList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isContextMenuOpen]);

  const CommentAvatar = ({ comment, style }) => {
    return (
      // <Tooltip
      //   title={
      //     <div>
      //       <Typography variant="subtitle2">{comment.user}</Typography>
      //       <Typography
      //         variant="caption"
      //         sx={{ fontStyle: "italic", display: "block" }}
      //       >
      //         {comment.text}
      //       </Typography>
      //       <Typography variant="body2">{comment.comment}</Typography>
      //     </div>
      //   }
      //   placement="top"
      // >
      //   <Avatar
      //     sx={{
      //       position: "absolute",
      //       width: 24,
      //       height: 24,
      //       bgcolor: "#3B82F6",
      //       cursor: "pointer",
      //       ...style,
      //     }}
      //   >
      //     <CommentIcon sx={{ fontSize: 16 }} />
      //   </Avatar>
      // </Tooltip>
      null
    );
  };

  const highlightCommentOnPDF = async (position) => {
    if (!fileUrl || !position) return;

    try {
      const pdfBytes = await fetch(fileUrl).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const page = pdfDoc.getPages()[position.page];

      const { width, height } = page.getSize();

      const pdfY = height - position.top - position.height;

      console.log("PDF Y Position:", height, position.top, position.height);

      page.drawRectangle({
        x: position.left - position?.width,
        y: position.top + position?.height,
        width: position.width,
        height: position.height,
        color: rgb(1, 1, 0),
        opacity: 0.3,
      });

      const modifiedPdfBytes = await pdfDoc.save();

      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const modifiedPdfUrl = URL.createObjectURL(blob);

      setFileUrl(modifiedPdfUrl);
      setViewerKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error highlighting PDF:", error);
      toast.error("Failed to highlight the selected text");
    }
  };

  const handleCommentClick = (comment, event) => {
    console.log(event, comment, "::::: handleCommentClick :::::");

    highlightSelectedText(comment.position);
    highlightCommentOnPDF(comment.position);
    console.log("PDF Selection Position:", comment.position);
    if (pagesTextContent[comment.position.page]) {
      console.log(
        `Page ${comment.position.page} Text Content:`,
        pagesTextContent[comment.position.page]
      );
    }
  };

  //   useEffect(() => {
  //     console.log(viewerRef.current, "viewerRef.current");

  //     if (viewerRef.current) {
  //       viewerRef.current.addEventListener("mouseup", handleTextSelection);
  //       // viewerRef.current.addEventListener("touchend", handleTextSelection);
  //     }
  //   }, [viewerRef.current]);
  const renderHighlightContent = (props) => {
    const addNote = () => {
      console.log("Add note clicked", props);
      //   props.cancel();
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
            }}
            onChange={(e) => console.log(e.target.value)}
          ></textarea>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "8px",
          }}
        >
          <div style={{ marginRight: "8px" }}>
            <PrimaryButton onClick={addNote}>Add</PrimaryButton>
          </div>
          <PDFButton onClick={props.cancel}>Cancel</PDFButton>
        </div>
      </div>
    );
  };

  const renderHighlightTarget = (props) => (
    <div
      style={{
        background: "#eee",
        display: "flex",
        position: "absolute",
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: "translate(0, 8px)",
      }}
    >
      <PDFTooltip
        position={Position.TopCenter}
        target={
          <PDFButton
            onClick={() => {
              alert("some");
              //   props.toggle;
            }}
          >
            <MessageIcon
              onClick={() => {
                alert("some");
                //   props.toggle;
              }}
            />
          </PDFButton>
        }
        content={() => <div style={{ width: "100px" }}>Add a note</div>}
      // offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
  });

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
          rightSection={<RightSection documentData={documentData} />}
        >
          {/* {!fromActionables && breadcrumbsData && ( */}
          <Breadcrumbs
            bredcrumbs={breadcrumbsData}
            type={presistStore}
            isBack={true}
            handleBackButtonClick={handleBackButtonClick}
          />
          {/* )} */}
          <>
            <Box className="header" sx={{ marginTop: "-0.1rem" }}>
              <Box className="header-text">
                <Typography
                  variant="p"
                  sx={{ color: "#3B82F6", fontWeight: "500" }}
                >
                  <Tooltip title="Source SOP">
                    <span
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={() => setOpenSOPModal(true)}
                    >
                      {documentData?.DocumentName || "Loading..."}
                      {documentData?.DocLinkedSOP?.length > 0 && (
                        <img
                          src={FourBox}
                          alt=""
                          style={{
                            height: "25px",
                            width: "30px",
                            marginLeft: "8px",
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </span>
                  </Tooltip>
                </Typography>
                <Typography sx={{ color: "#64748B" }}>
                  version{" "}
                  {documentData?.DocumentStatus === "InProgress"
                    ? documentData?.DraftVersion
                    : documentData?.MasterVersion || "N/A"}
                </Typography>
              </Box>
              <div
                style={{
                  cursor:
                    !documentData || loadingDocument
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
                    marginRight: "1rem",
                    marginBottom: "7px",
                  }}
                >
                  {NoOfRisk > 0 && (
                    <Tooltip title="Risk">
                      <Badge badgeContent={NoOfRisk} color="error">
                        <img
                          src={risk}
                          alt=""
                          style={{
                            marginLeft: "3rem",

                            cursor: "pointer",
                          }}
                          onClick={() => handleOpenModal("Risk")}
                        />
                      </Badge>
                    </Tooltip>
                  )}
                  {NoOfCompliance > 0 && (
                    <Tooltip title="Compliance">
                      <Badge badgeContent={NoOfCompliance} color="error">
                        <img
                          src={com}
                          alt=""
                          style={{
                            marginLeft: "1rem",
                            cursor: "pointer",
                          }}
                          onClick={() => handleOpenModal("Compliance")}
                        />
                      </Badge>
                    </Tooltip>
                  )}

                  {NoOfClause > 0 && (
                    <Tooltip title="Clause">
                      <Badge
                        badgeContent={NoOfClause}
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: "orange",
                            color: "#fff",
                          },
                        }}
                      >
                        <img
                          src={cicon}
                          alt=""
                          style={{
                            marginLeft: "1rem",
                            cursor: "pointer",
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => handleOpenModal("Clause")}
                        />
                      </Badge>
                    </Tooltip>
                  )}
                  <Box>
                    {isTemplates && (
                      <>
                        <Tooltip title="Download">
                          <IconButton onClick={handleDownloadMenuOpen}>
                            <Download />
                          </IconButton>
                        </Tooltip>

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
                      </>
                    )}
                  </Box>
                </Box>

                <div
                  style={{
                    marginRight: "1rem",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImpactAnalysis();
                  }}
                >
                  <img src={impactanalysisIcon} alt="Impact Analysis Icon" />
                </div>

                <div onClick={handleBookmarkClick}>
                  <Tooltip
                    title={UserFavorite ? "Already Added" : "Add to Favorites"}
                  >
                    <img
                      src={UserFavorite ? bookMark : NoFav}
                      alt={
                        UserFavorite
                          ? "Remove from Favorites"
                          : "Add to Favorites"
                      }
                    />
                  </Tooltip>
                </div>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "1rem",
                    marginBottom: "7px",
                  }}
                >
                  {documentData?.DocumentPath &&
                    (() => {
                      const fileExtension = documentData.DocumentPath.split(".")
                        .pop()
                        .toLowerCase();
                      const isDownloadable =
                        fileExtension === "xls" ||
                        fileExtension === "xlsx" ||
                        fileExtension === "ppt" ||
                        fileExtension === "pptx";

                      return isDownloadable ? (
                        <a
                          href={`${BASE_URL}${documentData.DocumentPath}`}
                          download
                          style={{
                            textDecoration: "none",
                            color: "#fff",
                            backgroundColor: "blue",
                            padding: "8px 12px",
                            borderRadius: "4px",
                            height: "40px",
                            fontWeight: "bold",
                            marginLeft: "0.7rem",
                          }}
                        >
                          <Download />
                        </a>
                      ) : null;
                    })()}
                </Box>
              </div>
            </Box>

            <Box>
              {fileUrl && !docAndDocxFileUrl ? (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box
                    sx={{
                      width: comments.length > 0 ? "80%" : "100%",
                      transition: "width 0.3s ease-in-out",
                    }}
                  >
                    <Worker
                      workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
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
                          defaultLayoutPluginInstance,
                          highlightPluginInstance,
                        ]}
                      />
                      <div
                        style={{
                          height: "600px",
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
                      // onMouseUp={handleTextSelection}
                      // ref={viewerRef}
                      >
                        {comments.map((comment) =>
                          comment.position ? (
                            <CommentAvatar
                              key={comment.id}
                              comment={comment}
                              style={{
                                left: `${comment.position.left}px`,
                                top: `${comment.position.top}px`,
                                transform: "translate(-50%, -50%)",
                                zIndex: 1000,
                              }}
                            />
                          ) : null
                        )}

                        {isContextMenuOpen && (
                          <Paper
                            style={{
                              position: "absolute",
                              top: `${contextMenuPosition.top}px`,
                              left: `${contextMenuPosition.left}px`,
                              zIndex: 9999,
                              padding: "5px",
                            }}
                          >
                            <MenuItem
                              onClick={() => {
                                setIsContextMenuOpen(false);
                                setIsCommentFormOpen(true);
                              }}
                            >
                              <CommentOutlined sx={{ mr: 1 }} /> Add Comment
                            </MenuItem>
                          </Paper>
                        )}

                        {isCommentFormOpen && (
                          <Paper
                            ref={commentFormRef}
                            style={{
                              position: "absolute",
                              top: `${contextMenuPosition.top}px`,
                              left: `${contextMenuPosition.left}px`,
                              zIndex: 9999,
                              padding: "15px",
                              minWidth: "300px",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography variant="subtitle2">
                                Add Comment
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => setIsCommentFormOpen(false)}
                              >
                                <Close fontSize="small" />
                              </IconButton>
                            </Box>

                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mb: 1,
                                fontStyle: "italic",
                              }}
                            >
                              {selectedText}
                            </Typography>

                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              variant="outlined"
                              placeholder="Type your comment here..."
                              value={currentComment}
                              onChange={(e) =>
                                setCurrentComment(e.target.value)
                              }
                              size="small"
                              sx={{ mb: 1 }}
                            />

                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleAddComment}
                              sx={{ mt: 1 }}
                              id="step2"
                            >
                              Save Comment
                            </Button>
                          </Paper>
                        )}
                      </div>
                    </Worker>
                  </Box>

                  {comments.length > 0 && (
                    <Paper
                      ref={commentsListRef}
                      sx={{
                        width: "20%",
                        height: "600px",
                        overflow: "auto",
                        p: 2,
                        boxShadow: 2,
                        borderRadius: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                          borderBottom: "1px solid #eee",
                          pb: 1,
                        }}
                      >
                        <Typography variant="h6">
                          Comments ({comments.length})
                        </Typography>
                      </Box>

                      {comments.length > 0 ? (
                        <List sx={{ flexGrow: 1, overflow: "auto" }}>
                          {comments.map((comment, index) => (
                            <React.Fragment key={comment.id}>
                              <ListItem
                                alignItems="flex-start"
                                sx={{
                                  flexDirection: "column",
                                  py: 1,
                                  backgroundColor:
                                    index % 2 === 0 ? "#f9f9f9" : "transparent",
                                  borderRadius: 1,
                                  mb: 1,
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: "#f0f0f0",
                                  },
                                }}
                                onClick={(e) => handleCommentClick(comment, e)}
                              >
                                <Box
                                  sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {comment.user}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {new Date(
                                      comment.timestamp
                                    ).toLocaleString()}
                                  </Typography>
                                </Box>

                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: "block",
                                    fontStyle: "italic",
                                    my: 1,
                                    p: 1,
                                    backgroundColor: "#fffde7",
                                    borderLeft: "3px solid #ffc107",
                                    borderRadius: "4px",
                                  }}
                                >
                                  "{comment.text}"
                                </Typography>

                                <Typography variant="body2">
                                  {comment.comment}
                                </Typography>

                                <Box sx={{ alignSelf: "flex-end", mt: 1 }}>
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </Box>
                              </ListItem>
                              {index < comments.length - 1 && <Divider />}
                            </React.Fragment>
                          ))}
                        </List>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <Typography color="text.secondary">
                            No comments yet
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  )}
                </Box>
              ) : documentData && !openOnlyOfficeModal && !delegateModal ? (
                <>
                  {coCreation ? (
                    <OnlyOffice
                      fileUrl={docAndDocxFileUrl}
                      documentName={documentData?.DocumentName}
                      documentID={documentData?.DocumentID}
                      documentPermission={
                        documentData?.CheckerAndStakeHolderIDs
                      }
                      creator={documentData?.CreatedBy}
                      documentData={documentData}
                    />
                  ) : (
                    <DocViewer
                      fileUrl={docAndDocxFileUrl}
                      handleDocumentLoadSuccess={handleDocumentLoadSuccess}
                    />
                  )}
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
              {/* <Colorcode /> */}
            </Box>
          </>

          <RiskAndComplianceModal
            open={openModal}
            onClose={handleCloseModal}
            heading={modalHeading}
            content={`Content related to ${modalHeading} will go here.`}
            RiskAndCompliences={RiskAndCompliences}
            onItemClick={handleItemClick} // Pass the callback to the modal
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

          <SOPModal
            open={openSOPModal}
            onClose={() => setOpenSOPModal(false)}
            elementsDocumentFiles={elementsDocumentFiles}
          />
        </CommonContainer>
      )}
    </Box>
  );
};

export default AccountOpeningForm;
