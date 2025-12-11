import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
  Container,
  Avatar,
  Chip,
  Zoom,
} from "@mui/material";
import { Folder as FolderIcon, Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import notify from "../../../assets/svg/utils/toast/Toast";
import { BASE_URL } from "../../../config/urlConfig";
import { useSocket } from "../../../context/SocketContext";
import EscalationTimeoutModal from "../../docViewer/EscalationTimeoutModal";
import { useHeadingBgColor } from "../../useHeadingBgColor";
import CircularProgress from "@mui/material/CircularProgress";
import { SaveAndSendApi } from "../../../services/docTemplate/DocTemplate";
import { GetElementsCategory } from "../../../store/elements/action";
import { useDispatch } from "react-redux";
const TemplateSelector = ({
  onTemplateSave,
  apiResponseData,
  onClose,
  openEditorDirectly = false,
  documentName = "",
  documentDescription = "",
  documentOwner = "",
  documentId = null,
  newDocumentId,
  createTemplateAndBlankDocumentResponse,
  fileURL,
  presistStore,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [openEditor, setOpenEditor] = useState(false);
  const [userData, setUserData] = useState(null);
  const [documentResult, setDocumentResult] = useState(null);
  const [escalationTimoutModal, setEscalationTimoutModal] = useState(false);
  const [docxURL, setDocxURL] = useState(null);
  const [editorLoading, setEditorLoading] = useState(false);
  const [docDraftID, setDocDraftID] = useState(null);
  const { t } = useTranslation();
  const onlyOfficeRef = useRef(null);
  const socket = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bgColor = useHeadingBgColor();
  const templatefolder = localStorage.getItem("selectedContentName");
  const typeofdocument = localStorage.getItem("selectedDocumentType");
  useEffect(() => {
    const userdataFromStorage = localStorage.getItem("user_data");
    setUserData(JSON.parse(userdataFromStorage));
  }, []);

  const Edit = localStorage.getItem("moduleAction");

  console.log("docDraftIDdocDraftID", docDraftID);

  console.log("docxURLdocxURL", fileURL);
  console.log(
    "createTemplateAndBlankDocumentResponse:",
    createTemplateAndBlankDocumentResponse
  );
  console.log(`${BASE_URL}${docxURL}`, "docxUssRL");
  useEffect(() => {
    if (templatefolder === "Create Template") {
      if (createTemplateAndBlankDocumentResponse?.data?.DocumentTemplateID) {
        setDocDraftID(
          createTemplateAndBlankDocumentResponse?.data?.DocumentTemplateID
        );
      }
    } else {
      setDocDraftID(createTemplateAndBlankDocumentResponse?.DocumentDraftID);
    }
  }, [createTemplateAndBlankDocumentResponse]);
  const templates = [
    {
      id: 1,
      name: "Empty Template",
      icon: <FolderIcon />,
      description: "Start with a blank document and create your own content",
      category: "General",
      color: bgColor,
      gradient: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor} 100%)`,
      image: "📄",
      logo: "📝",
      bgImage:
        "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E",
      documentData: {
        CreatedDate: new Date().toISOString(),
        EscalationType: "days",
        EscalationAfter: 7,
        CheckerAndStakeHolderIDs: [],
      },
      documentPermission: [],
      creator: [],
    },
  ];
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setOpenEditor(true);
  };
  const handleCloseEditor = () => {
    // localStorage.setItem("onlyofficeModal", "false");
    setOpenEditor(false);
  };
  const getCurrentTemplate = () => {
    return templates.find((t) => t.id === selectedTemplate);
  };
  useEffect(() => {
    if (!openEditor || !selectedTemplate) return;
    const template = getCurrentTemplate();
    if (!template || !template.documentData) return;
    const isUserCheckerOrStakeholder =
      template.documentData?.CheckerAndStakeHolderIDs?.some((group) =>
        group?.Checker?.some((checker) => checker.userId === userData?.UserID)
      ) ||
      template.documentData?.CheckerAndStakeHolderIDs?.some((group) =>
        group?.StakeHolder?.some(
          (stakeholder) => stakeholder.userId === userData?.UserID
        )
      );
    if (!isUserCheckerOrStakeholder) {
      setEscalationTimoutModal(false);
      return;
    }
    if (
      template.documentData?.CreatedDate &&
      template.documentData?.EscalationType &&
      template.documentData?.EscalationAfter
    ) {
      const createdDate = new Date(template.documentData.CreatedDate);
      const now = new Date();
      let escalationTimeInMs;
      switch (template.documentData.EscalationType.toLowerCase()) {
        case "minutes":
          escalationTimeInMs =
            template.documentData.EscalationAfter * 60 * 1000;
          break;
        case "hours":
          escalationTimeInMs =
            template.documentData.EscalationAfter * 60 * 60 * 1000;
          break;
        case "days":
          escalationTimeInMs =
            template.documentData.EscalationAfter * 24 * 60 * 60 * 1000;
          break;
        case "weeks":
          escalationTimeInMs =
            template.documentData.EscalationAfter * 7 * 24 * 60 * 60 * 1000;
          break;
        case "months":
          escalationTimeInMs =
            template.documentData.EscalationAfter * 30.44 * 24 * 60 * 60 * 1000;
          break;
        case "years":
          escalationTimeInMs =
            template.documentData.EscalationAfter *
            365.25 *
            24 *
            60 *
            60 *
            1000;
          break;
        default:
          escalationTimeInMs = 0;
      }
      const timeDifferenceInMs = now - createdDate;
      const remainingTimeMs = escalationTimeInMs - timeDifferenceInMs;
      if (remainingTimeMs <= 0) {
        setEscalationTimoutModal(true);
      } else {
        const timeoutId = setTimeout(() => {
          setEscalationTimoutModal(true);
        }, remainingTimeMs);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [openEditor, selectedTemplate, userData]);
  useEffect(() => {
    if (!socket) return;
    const documentEditFailureHandler = (message) => {
      if (message) {
        notify("error", message);
      }
    };

    socket
      .off("document-edit-failure")
      .on("document-edit-failure", documentEditFailureHandler);

    return () => {
      socket.off("document-edit-failure", documentEditFailureHandler);
    };
  }, [socket]);

  const getPermissionarray = (documentData) => {
    const checkerItem = documentData?.find((item) => item.Checker);
    const checkerIds = checkerItem?.Checker
      ? checkerItem.Checker.map((checker) => ({
          userId: checker.userId,
          ApprovalStatus: checker.ApprovalStatus,
          checkerId: checker.checkerId,
        }))
      : [];

    const stakeHolderItem = documentData?.find((item) => item.StakeHolder);
    const stakeHolderIds = stakeHolderItem?.StakeHolder
      ? stakeHolderItem.StakeHolder.map((stakeHolder) => ({
          userId: stakeHolder.userId,
          ApprovalStatus: stakeHolder.ApprovalStatus,
          stakeHolderId: stakeHolder.stakeHolderId,
        }))
      : [];

    return checkerIds.length > stakeHolderIds.length
      ? { ids: checkerIds, permission: "comment" }
      : { ids: stakeHolderIds, permission: "review" };
  };
  const handleCloseEscalationTimeoutModal = () => {
    setEscalationTimoutModal(false);
    navigate(-1);
  };
  useEffect(() => {
    if (!openEditor || !selectedTemplate || !userData) return;

    setEditorLoading(true);

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById("onlyoffice-api-js")) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.id = "onlyoffice-api-js";
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const initializeEditor = async () => {
      const template = getCurrentTemplate();
      const result = getPermissionarray(template.documentPermission);
      const userInResult = result.ids.find(
        (idObj) =>
          idObj.userId === userData?.UserID &&
          idObj.ApprovalStatus !== "Approved"
      );
      setDocumentResult(userInResult);

      const ownerIDs =
        template.documentPermission
          .filter((item) => item.Owner)
          .flatMap((item) => item.Owner.map((owner) => owner.userId)) || [];
      const escalationIDs =
        template.documentPermission
          .filter((item) => item.Escalation)
          .flatMap((item) => item.Escalation.map((esc) => esc.userId)) || [];

      const permissionMode = userInResult
        ? result.permission
        : ownerIDs?.includes(userData?.UserID) ||
          template.creator?.includes(userData?.UserID) ||
          escalationIDs?.includes(userData?.UserID)
        ? "review"
        : "view";

      try {
        console.log("Loading OnlyOffice script...");
        // prefer VITE_ var (exposed by Vite), fallback to NON-VITE if present
        const onlyofficeUrl =
          import.meta.env.VITE_ONLYOFFICE_API_URL ||
          import.meta.env.ONLYOFFICE_API_URL ||
          "";
        if (!onlyofficeUrl)
          throw new Error(
            "OnlyOffice API URL not configured (VITE_ONLYOFFICE_API_URL)"
          );

        await loadScript(onlyofficeUrl);

        if (!window.DocsAPI) {
          throw new Error("DocsAPI is not defined after script load.");
        }

        const editorContainer = onlyOfficeRef.current;
        if (editorContainer) {
          editorContainer.innerHTML = "";
          window.docEditor = new window.DocsAPI.DocEditor("onlyoffice-editor", {
            document: {
              fileType: "docx",
              key:
                templatefolder === "Create Template"
                  ? `${docDraftID}_${Date.now()}`
                  : `${docDraftID}_${Date.now()}`,
              title:
                templatefolder === "Create Template"
                  ? `${createTemplateAndBlankDocumentResponse?.data?.DocumentName}`
                  : `${createTemplateAndBlankDocumentResponse?.DocumentName}`,
              url: `${BASE_URL}${
                typeofdocument === "create-from-template" || Edit === "Edit"
                  ? fileURL
                  : docxURL
              }`,
              // url: `https://1ccd4791b7d6.ngrok-free.app/${typeofdocument === "create-from-template" || Edit === "Edit" ? fileURL : docxURL
              //   }`,
              permissions: {
                review: true,
                chat: false,
                download: false,
                print: false,
                plugins: false,
                about: false,
                help: false,
                editCommentAuthorOnly: true,
                deleteCommentAuthorOnly: true,
                protect: false,
                changeTracking: true,
              },
            },
            documentType: "word",
            editorConfig: {
              callbackUrl:
                templatefolder === "Create Template"
                  ? `${BASE_URL}/v1/1hjr5/xshadbw5sFVhZab`
                  : `${BASE_URL}/v1/1hjr5/bhZabhw5sFVxsda`,
              // templatefolder === "Create Template"
              //   ? `https://1ccd4791b7d6.ngrok-free.app/v1/1hjr5/xshadbw5sFVhZab`
              //   : `https://1ccd4791b7d6.ngrok-free.app/v1/1hjr5/bhZabhw5sFVxsda`,
              mode: "review",
              user: {
                id: userData?.UserID,
                name: userData?.UserName,
              },
              startServer: {
                defaultTab: "home",
              },
              customization: {
                plugins: false,
                macros: false,
                mailmerge: false,
                view: false,
                about: false,
                help: false,
                feedback: false,
              },
            },
            startServer: {
              defaultTab: "home",
            },
            height: "100%",
            width: "100%",
          });

          setEditorLoading(false);
        }
      } catch (error) {
        console.error("Error initializing OnlyOffice editor:", error);
        notify(
          "error",
          "Failed to load the document editor. Please try again or contact support."
        );
        setEditorLoading(false);
      }
    };

    const observer = new MutationObserver(() => {
      const pluginButton = document.querySelector(
        '.toolbar-button[title="Plugins"]'
      );
      const pluginManager = document.querySelector(".plugin-manager");
      const helpButton = document.querySelector(
        '.toolbar-button[title="Help"]'
      );

      if (pluginButton) {
        pluginButton.style.display = "none";
      }

      if (pluginManager) {
        pluginManager.style.display = "none";
      }

      if (helpButton) {
        helpButton.style.display = "none";
      }
    });

    initializeEditor();

    const editorContainer = onlyOfficeRef.current;
    if (editorContainer) {
      observer.observe(editorContainer, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (onlyOfficeRef.current) {
        onlyOfficeRef.current.innerHTML = "";
      }
      observer.disconnect();
      setEditorLoading(false);
    };
  }, [openEditor, selectedTemplate, userData]);

  const handleSaveDocument = () => {
    localStorage.setItem("onlyofficeModal", "false");
    localStorage.setItem("saveAsDraftClicked", "true"); // set true on Save as InProgress

    // remove it automatically after 30 seconds
    setTimeout(() => {
      localStorage.removeItem("saveAsDraftClicked");
    }, 40000); // 40,000 ms = 40 seconds
    setTimeout(() => {
      localStorage.removItem("onlyofficeModal");
    }, 40000);

    if (window.docEditor) {
      console.log("Document saved");
    }
    setOpenEditor(false);
    if (onTemplateSave) {
      onTemplateSave(getCurrentTemplate());
    }
  };

  const handleSaveAndSend = async () => {
    localStorage.setItem("onlyofficeModal", "false");
    localStorage.setItem("saveAndSendClicked", "true");

    setTimeout(() => {
      localStorage.removeItem("saveAndSendClicked");
    }, 40000);

    if (window.docEditor) {
      console.log("Document saved & sent");
    }
    setOpenEditor(false);
    try {
      const payload = {
        DocumentModuleDraftID:
          createTemplateAndBlankDocumentResponse?.DocumentDraftID,
      };
      // call API
      await SaveAndSendApi(payload);
      // only run below if API succeeds
      notify("success", "Document saved and sent successfully.");
      dispatch(
        GetElementsCategory({
          ModuleTypeID: presistStore?.ModuleTypeID,
          ParentContentID: presistStore?.ContentID,
        })
      );

      if (onTemplateSave) {
        onTemplateSave(getCurrentTemplate());
      }
    } catch (error) {
      notify("error", "Failed to save and send document.");
    }
  };

  useEffect(() => {
    if (apiResponseData && templatefolder === "Create Template") {
      console.log(
        "Received API response data in TemplateSelector:",
        apiResponseData
      );
      setDocxURL(apiResponseData?.url);
      console.log("docxURL set to:", apiResponseData?.url);
    } else {
      console.log("Received API response", apiResponseData);
      setDocxURL(apiResponseData);
    }
  }, [apiResponseData]);

  useEffect(() => {
    if (openEditorDirectly) {
      setSelectedTemplate(1);
      setOpenEditor(true);
    }
  }, [openEditorDirectly]);

  useEffect(() => {
    if (documentId) {
      console.log("Received DocumentID in TemplateSelector:", documentId);
    }
  }, [documentId]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {!openEditorDirectly && (
        <Grid container spacing={3}>
          {templates?.map((template, index) => (
            <Grid item xs={12} sm={6} key={template.id}>
              <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card
                  sx={{
                    height: "240px",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    backgroundImage: `url("${template.bgImage}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                      "& .template-overlay": {
                        opacity: 1,
                      },
                    },
                  }}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "80px",
                      background: template.gradient,
                      opacity: 0.1,
                    }}
                  />

                  <Box
                    className="template-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `${template.gradient}, rgba(255,255,255,0.9)`,
                      backgroundBlendMode: "overlay",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      zIndex: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        background: template.gradient,
                        fontWeight: "bold",
                        px: 2,
                        py: 1,
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {t("createDocument")}
                    </Button>
                  </Box>

                  <CardContent
                    sx={{
                      textAlign: "center",
                      p: 2,
                      flexGrow: 1,
                      position: "relative",
                      zIndex: 0,
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="h2" sx={{ fontSize: "2rem" }}>
                        {template.image}
                      </Typography>
                    </Box>

                    <Chip
                      label={template.category}
                      size="small"
                      sx={{
                        mb: 1,
                        backgroundColor: template.color,
                        color: "white",
                        fontWeight: 500,
                        fontSize: "0.6rem",
                      }}
                    />

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        color: "text.primary",
                        mb: 1,
                        fontSize: "1rem",
                      }}
                    >
                      {template.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.8rem",
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 1,
                      }}
                    >
                      {template.description}
                    </Typography>

                    <Avatar
                      sx={{
                        backgroundColor: template.color,
                        color: "white",
                        mt: 1,
                        mx: "auto",
                        width: 32,
                        height: 32,
                        fontSize: "1rem",
                      }}
                    >
                      {template.icon}
                    </Avatar>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      )}

      {openEditor && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1300,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              background: getCurrentTemplate()?.gradient,
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseEditor}
              aria-label="close"
              sx={{
                mr: 2,
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 3,
                  fontSize: "24px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                {getCurrentTemplate()?.logo}
              </Box>
              <Box sx={{ flex: 1 }}>
                {/* Show passed name/description/owner */}
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold", mb: 0.5 }}
                >
                  {documentName || getCurrentTemplate()?.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  {documentDescription || getCurrentTemplate()?.description}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Owner: {documentOwner}
                </Typography>
              </Box>
            </Box>

            {templatefolder !== "Create Template" && (
              <Button
                variant="outlined"
                onClick={handleSaveAndSend}
                sx={{
                  borderColor: "white",
                  color: "white",
                  background: getCurrentTemplate()?.gradient,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.7)",
                    borderColor: "white",
                  },
                }}
              >
                Save & Send
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={handleSaveDocument}
              sx={{
                marginLeft: "20px",
                borderColor: "white",
                color: "white",
                background: getCurrentTemplate()?.gradient,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.7)",
                  borderColor: "white",
                },
              }}
            >
              Save as Draft
            </Button>
          </Box>
          <Box
            sx={{
              flex: 1,
              width: "100%",
              height: "100%",
              p: 2,
              position: "relative",
            }}
          >
            {editorLoading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.7)",
                  zIndex: 10,
                }}
              >
                <CircularProgress size={64} color="primary" />
              </Box>
            )}
            <div
              ref={onlyOfficeRef}
              id="onlyoffice-editor"
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid #ddd",
                background: "#fff",
              }}
            />
          </Box>
        </Box>
      )}

      <EscalationTimeoutModal
        open={escalationTimoutModal}
        onClose={handleCloseEscalationTimeoutModal}
      />
    </Container>
  );
};

TemplateSelector.propTypes = {
  onTemplateSave: PropTypes.func,
  apiResponseData: PropTypes.any,
  onClose: PropTypes.func,
  openEditorDirectly: PropTypes.bool,
  documentName: PropTypes.string,
  documentDescription: PropTypes.string,
  documentOwner: PropTypes.string,
  documentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default TemplateSelector;
