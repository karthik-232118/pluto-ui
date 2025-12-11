import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import notify from "../../assets/svg/utils/toast/Toast";
import { useSocket } from "../../context/SocketContext";
import EscalationTimeoutModal from "./EscalationTimeoutModal";
import PropTypes from "prop-types";
import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import axios from "axios";

const OnlyOffice = ({ documentData, type, documentPermission }) => {
  const socket = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  // const [userData, setUserData] = useState(null);
  const [escalationTimoutModal, setEscalationTimoutModal] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const apiLoadedRef = useRef(false); // Cache API load state
  const queryParams = new URLSearchParams(location.search);
  const isMyActionableTrue = queryParams.get("MyActionable") === "true";
  const editorInstanceRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    console.log(documentData, "documentaaaaData");
  }, [documentData]);

  const loadOnlyOfficeApiOnce = (src, timeout = 5000) =>
    new Promise((resolve, reject) => {
      if (!src) {
        reject(new Error("OnlyOffice API URL is not configured"));
        return;
      }

      // Check if already loaded
      if (window.DocsAPI) {
        resolve();
        return;
      }

      const s = document.createElement("script");
      s.src = src;
      s.async = true;

      const timer = setTimeout(() => {
        s.onerror?.();
        reject(new Error(`Timeout loading from ${src}`));
      }, timeout);

      s.onload = () => {
        clearTimeout(timer);
        console.log("OnlyOffice API loaded from:", src);
        apiLoadedRef.current = true;
        resolve();
      };

      s.onerror = () => {
        clearTimeout(timer);
        reject(new Error(`Failed to load ${src}`));
      };

      document.head.appendChild(s);
    });

  const tryLoadFromMultipleSources = async () => {
    // prefer VITE_ var (exposed by Vite), fallback to NON-VITE if present
    const configuredUrl =
      import.meta.env.VITE_ONLYOFFICE_API_URL ||
      import.meta.env.ONLYOFFICE_API_URL ||
      "";
    const urls = [configuredUrl].filter(Boolean);

    if (urls.length === 0) {
      throw new Error(
        "OnlyOffice API URL is not configured. Set VITE_ONLYOFFICE_API_URL in your environment."
      );
    }

    const promises = urls.map((url) =>
      loadOnlyOfficeApiOnce(url, 5000).catch((err) => {
        console.warn(`Failed to load OnlyOffice API from: ${url}`, err);
        return null;
      })
    );

    const results = await Promise.all(promises);
    if (!results.some((r) => r !== null) && !window.DocsAPI) {
      throw new Error("Failed to load OnlyOffice API from all sources");
    }
  };

  const initializeEditor = async () => {
    try {
      console.log("Initializing editor...");
      const sessionSpecificKey =
        type === "template"
          ? `${documentData?.DocumentTemplateID}_${Date.now()}`
          : documentData.DocumentStatus === "Draft"
          ? `${documentData?.DocumentModuleDraftID}_${Date.now()}`
          : `${documentData?.DocumentModuleDraftID}`;

      if (!apiLoadedRef.current) {
        try {
          await tryLoadFromMultipleSources();
        } catch (scriptError) {
          console.error("Script loading failed:", scriptError);
          setLoadError(
            "Unable to connect to the OnlyOffice server. Please check your connection or contact support."
          );
          throw scriptError;
        }
      }

      let permission = {};
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const data = await axios.post(
          `${BASE_URL}${ENDPOINT_URL?.onlyoffice.office_permission}`,
          {
            DocumentModuleDraftID: documentData?.DocumentModuleDraftID,
            IsActionable: isMyActionableTrue,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);
        permission = data?.data?.data || {};
        if (type !== "template") {
          documentPermission(permission);
        }
      } catch (permError) {
        console.warn(
          "Permission fetch timeout/failed, using defaults:",
          permError
        );
        permission = {
          UserType: "viewer",
          UserID: localStorage.getItem("user_id"),
          UserName: "User",
        };
      }

      if (!window.DocsAPI) throw new Error("DocsAPI not available.");

      const urlToUse = `${BASE_URL}/${documentData?.DocumentPath}`;
      const callbackurlToUse = {};

      if (
        permission?.UserType === "owner" &&
        documentData?.DocumentStatus === "Published"
      ) {
        callbackurlToUse[
          "callbackUrl"
        ] = `${BASE_URL}/v1/1hjr5/basFV5bhZxhwsda`;
      } else if (type === "template") {
        callbackurlToUse[
          "callbackUrl"
        ] = `${BASE_URL}/v1/1hjr5/xshadbw5sFVhZab`;
      }

      editorInstanceRef.current = new window.DocsAPI.DocEditor(
        "onlyoffice-editor",
        {
          document: {
            fileType: "docx",
            key: sessionSpecificKey,
            title: `${documentData?.DocumentName}`,
            url: urlToUse,
            permissions: {
              edit: permission?.UserType === "owner",
              comment:
                permission?.UserType === "reviewer" ||
                permission?.UserType === "approver" ||
                permission?.UserType === "owner",
              review:
                permission?.UserType === "stakeholder" ||
                permission?.UserType === "owner",
              view: type === "template" ? true : false,
              chat: false,
              copy: false,
              download: false,
              print: false,
              plugins: false,
              about: false,
              help: false,
              editCommentAuthorOnly:
                permission?.UserType === "owner" ? false : true,
              deleteCommentAuthorOnly:
                permission?.UserType === "owner" ? false : true,
              protect: false,
            },
          },
          documentType: "word",
          editorConfig: {
            ...callbackurlToUse,
            mode: permission?.UserType === "others" ? "view" : "edit",
            user: {
              id: permission?.UserID,
              name: permission?.UserName,
            },
            canEdit: false,
            coEditing: {
              mode: "fast",
              change: true,
            },
            customization: {
              plugins: false,
              macros: false,
              mailmerge: false,
              view: false,
              about: false,
              help: false,
              feedback: false,
              forcesave: true,
              comments: permission?.UserType === "others" ? false : true,
              review: {
                hideReviewDisplay: false,
                showReviewChanges:
                  permission?.UserType === "owner" ? true : false,
                trackChanges: true,
              },
            },
            events: {
              onDocumentReady: () => {
                console.log("Document ready");
              },
              onPageChanged: (event) => {
                setCurrentPage(event.data);
              },
            },
          },
          height: "100%",
          width: "100%",
        }
      );
    } catch (error) {
      console.error("Editor initialization error:", error);
      setLoadError(
        error.message ||
          "Failed to load the document editor. Please refresh and try again."
      );
      notify(
        "error",
        "Failed to load the document editor. Please refresh and try again."
      );
    }
  };

  useEffect(() => {
    const setupEditor = async () => {
      if (!documentData) return;

      try {
        await initializeEditor();
      } catch (error) {
        console.error("Error setting up the editor:", error);
      }
    };

    setupEditor();
    return () => {
      const instance = editorInstanceRef?.current;
      if (instance && typeof instance.destroy === "function") {
        instance.destroy();
      } else {
        console.warn("Editor instance not found or destroy method missing");
      }
    };
  }, [documentData]);

  useEffect(() => {
    if (!socket) return;

    const documentEditFailureHandler = (message) => {
      if (message) notify("error", message);
    };
    socket
      .off("document-edit-failure")
      .on("document-edit-failure", documentEditFailureHandler);
    return () =>
      socket.off("document-edit-failure", documentEditFailureHandler);
  }, [socket]);

  const handleCloseEscalationTimeoutModal = () => {
    setEscalationTimoutModal(false);
    navigate(-1);
  };

  return (
    <div>
      <div
        id="onlyoffice-wrapper"
        style={{
          height: "100vh",
          width: "90%",
          marginRight: "5%",
          marginLeft: "5%",
          overflow: "auto",
          position: "relative",
        }}
      >
        {loadError && (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          >
            <strong>Error Loading Document:</strong> {loadError}
            <button
              onClick={() => window.location.reload()}
              style={{ marginLeft: "10px" }}
            >
              Retry
            </button>
          </div>
        )}
        <div
          id="onlyoffice-editor"
          style={{ flex: 1, border: "1px solid #ddd", overflow: "scroll" }}
        />
      </div>

      {escalationTimoutModal && (
        <EscalationTimeoutModal
          open={escalationTimoutModal}
          onClose={handleCloseEscalationTimeoutModal}
        />
      )}
    </div>
  );
};

OnlyOffice.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  documentName: PropTypes.string.isRequired,
  documentID: PropTypes.string.isRequired,
  documentPermission: PropTypes.array.isRequired,
  creator: PropTypes.string.isRequired,
  documentData: PropTypes.object.isRequired,
};

export default OnlyOffice;
