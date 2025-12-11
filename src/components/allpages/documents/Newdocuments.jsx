import {
  FormControl,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  Chip,
  Autocomplete,
  Card,
  Button,
  Checkbox,
  CircularProgress,
  Select,
  MenuItem,
  DialogActions,
  DialogContent,
  Accordion,
  AccordionDetails,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import uploadeimage from "../../../assets/svg/newdoc/uploadeimage.svg";
import "./newdocuments.css";
import {
  createDocumentModule,
  listProcessOwnerAndEndUser,
  listProcessOwner,
  viewDocumentModuleDraft,
  listElementAttributeType,
  ViewElementAttributeType,
  createTemplate,
  fetchDocxTemplateAPI,
} from "../../../services/documentModules/DocumentsModule";
import {
  uploadDocument,
  templateUploadDocx,
} from "../../../services/common/common.service";
import { useSelector, useDispatch } from "react-redux";
import { GetElementsCategory } from "../../../store/elements/action";
import notify from "../../../assets/svg/utils/toast/Toast";
import { formatUserName, validateAndSanitizeInputs } from "../../../utils";
import FilePreviewer from "../../FilePreviewer";
import { BASE_URL } from "../../../config/urlConfig";
import { GetSystemSettings } from "../../../services/settings/Settings";
import { styled } from "@mui/material";
import ProgressBar from "../../ProgressBar/ProgressBar";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import moment from "moment";
import TemplateSelector from "./TemplateSelector";
import { useHeadingBgColor } from "../../useHeadingBgColor";
import DocumentTypeModal from "./DocumentTypeModal";
import { validateInput } from "../../../utils/securityUtils";
import errorHandler from "../../../utils/errorHandler";
import {
  CreateTemplateAndBlankDocumentApi,
  GetTemplateListApi,
} from "../../../services/docTemplate/DocTemplate";
const CustomTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontWeight: 400,
  },
});
const Newdocuments = ({
  handleNext,
  editDocumentID = null,
  handleClose,
  ThreeDotClickedData,
  onTemplateSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isCreateTemplate, setIsCreateTemplate] = useState(false);
  const [isUploadingToAI, setIsUploadingToAI] = useState(false);
  const [documentTypeModalOpen, setDocumentTypeModalOpen] = useState(false);
  const [selectedDocumentTypes, setSelectedDocumentType] = useState(null);
  const [uploadAIProgress, setUploadAIProgress] = useState(0);
  const [templateIDs, setTemplateIDs] = useState(null);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const [isTemplate, setIsTemplate] = useState(false);
  const [templateAccordionOpen, setTemplateAccordionOpen] = useState(false);
  const [templateFile, setTemplateFile] = useState(null);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [templateSelectorData, setTemplateSelectorData] = useState(null);
  const [templateURL, setTemplateURL] = useState(null);
  const [templateID, setTemplateID] = useState(null);
  const bgColor = useHeadingBgColor();
  const [
    filteredUsersEscalationStakeholders,
    setFilteredUsersEscalationStakeholders,
  ] = useState([]);
  const [filteredUsersEscalation, setFilteredUsersEscalation] = useState([]);

  const [formState, setFormState] = useState({
    Approvers: [],
    Reviewers: [],
    Stakeholders: [],
    EscalationUsers: [],

    StakeHolderEscalationPerson: [],
    StakeHolderEscalationAfter: null,
    StakeHolderEscalationType: null,
    StakeHolderEscalationUsers: [],
    ElementAttributeTypeID: null,
    ElementAttribute: null,
    DocumentName: "",
    DocumentDescription: "",
    DocumentIsActive: true,
    DocumentExpiry: null,
    IsExpiry: false,
    DocumentOwner: [],
    DocumentTags: "",
    DocumentPath: "",
    SelfApproved: false,
    NeedAcceptance: false,
    NeedAcceptanceFromStakeHolder: false,
    NeedAcceptanceForApprover: false,
    RiskDetailsArrays: [],
    ComplianceDetailsArrays: [],
    ClauseDetailsArrays: [],
    Approver: [],
    StakeHolder: [],
    EscalationType: null,
    EscalationAfter: null,
    FileUrl: "",
    DocumentReadingTime: null,
    ReadingTimeValue: null,
    ReadingTimeUnit: "hours",
    CoOwnerUserID: [],
    IsPublic: false,
  });

  console.log(formState, "formStateformStateformState");
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [showTheConfigure, setShowTheConfigure] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [IsAttributeDataFetching, setIsAttributeDataFetching] = useState(false);
  const [fileError, setFileError] = useState("");
  const [showUploadedFileName, setShowUploadedFileName] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmittingDocument, setIsSubmittingDocument] = useState(false);
  const [isPublishingDocument, setIsPublishingDocument] = useState(false);
  const [isDraftFetching, setIsDraftFetching] = useState(false);
  const [processOwnerList, setProcessOwnerList] = useState([]);
  const [processOwnerAndEndUserList, setProcessOwnerAndEndUserList] = useState(
    []
  );
  const [docDraft, setDocDraft] = useState(null);
  const [attributeTypeList, setAttributeTypeList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [riskAndComplienceString, setRiskAndComplienceString] = useState("");
  const [riskDetails, setRiskDetails] = useState([]);
  const [complianceDetails, setComplianceDetails] = useState([]);
  const [clauseDetails, setClauseDetails] = useState([]);
  const [riskPositions, setRiskPositions] = useState([]);
  const [compliancePositions, setCompliancePositions] = useState([]);
  const [clausePositions, setClausePositions] = useState([]);
  const [uploadedSize, setUploadedSize] = useState(null);
  const [coCreation, setCoCreation] = useState(false);
  const [options, setOptions] = useState({});
  const [rawFileUploaded, setRawFileUploaded] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [newDocumentId, setNewDocumentId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [documentTemplateID, setDocumentTemplateID] = useState(null);
  const [threenDotClickedDocumentID, setThreenDotClickedDocumentID] =
    useState(null);
  const [
    createTemplateAndBlankDocumentApi,
    setCreateTemplateAndBlankDocumentApi,
  ] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const [fileURL, setFileURL] = useState(null);
  const owner = `${userData?.UserName}, (${userData?.UserFirstName} ${userData?.UserLastName})`;
  const loginUserId = localStorage.getItem("user_id");
  const FILE_SIZE = uploadedSize;
  const payload = {
    ModuleTypeID: presistStore?.ModuleTypeID,
    ContentID: presistStore?.ContentID,
    IsPagination: false,
    Search: "",
  };
  const onlyofficeModal = localStorage.getItem("onlyofficeModal");
  useEffect(() => {
    console.log(
      ThreeDotClickedData?.DocumentID,
      "three stper after i am cheog nging"
    );
    setThreenDotClickedDocumentID(ThreeDotClickedData?.DocumentID);
  }, [ThreeDotClickedData]);

  useEffect(() => {
    // Handle different DocumentStatus values
    if (ThreeDotClickedData?.DocumentStatus === "Draft") {
      setSelectedDocumentType("create-blank");
      localStorage.setItem("selectedDocumentType", "create-blank");
    } else if (ThreeDotClickedData?.DocumentStatus === "Published") {
      setSelectedDocumentType("upload-document");
      localStorage.setItem("selectedDocumentType", "upload-document");
    }
  }, [ThreeDotClickedData?.DocumentStatus]);

  useEffect(() => {
    const contentName = localStorage.getItem("selectedContentName");
    if (contentName) {
      setSelectedDocumentType(contentName);
    }
  }, []);

  useEffect(() => {
    if (!editDocumentID) {
      setDocumentTypeModalOpen(true);
    }
  }, [editDocumentID]);
  const selectedDocumentType = localStorage.getItem("selectedDocumentType");
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
        setUploadedSize(data?.DocumentSize);
      } catch (error) {
        console.error("Error fetching system settings:", error);
      }
    };
    fetchSystemSettings();
  }, []);

  useEffect(() => {
    const fetchTemplateList = async () => {
      try {
        const response = await GetTemplateListApi({ IsGlobalView: false });
        console.log("Template List API Response:", response?.data?.data);
        setTemplates(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching template list:", error);
      }
    };

    fetchTemplateList();
  }, []);
  const fetchDocumentDraftData = async (documentID = null) => {
    const selectedContentName = localStorage.getItem("selectedContentName");
    if (selectedContentName === "Create Template") {
      try {
        const response = await fetchDocxTemplateAPI({
          DocumentTemplateID: documentID,
        });
        if (response?.status === 200) {
          setDocumentTemplateID(response?.data?.data?.DocumentTemplateID);
          const templateData = response?.data?.data;
          console.log("Fetched Template Data:", templateData);
          if (templateData) {
            setFormState((prevState) => ({
              ...prevState,
              DocumentName: templateData.DocumentName || "",
              DocumentDescription: templateData.DocumentDescription || "",
              DocumentIsActive: templateData.DocumentIsActive || false,
              DocumentExpiry: templateData.IsSkipDocumentExpiry
                ? moment(templateData.DocumentExpiry).format("YYYY-MM-DD")
                : null,
              ElementAttributeTypeID:
                templateData.ElementAttributeTypeID || null,
              DocumentPath: templateData.DocumentPath || "",
              SelfApproved: templateData.SelfApproved || false,
              IsPublic: templateData.IsPublic || false,
            }));

            if (templateData.DocumentPath) {
              setPreviewUrl(`${BASE_URL}${templateData.DocumentPath}`);
              setUploadedFile(templateData.DocumentPath);
              setShowUploadedFileName(
                templateData.DocumentPath.split("/").pop()
              );
            }
          }
        } else {
          notify(
            "error",
            response?.data?.message || "Failed to fetch template data."
          );
        }
      } catch (error) {
        notify(
          "error",
          error?.response?.data?.message || "Error fetching template data."
        );
      }
      return;
    }

    if (!documentID) {
      setFormState({
        DocumentID: null,
        DocumentName: "",
        DocumentDescription: "",
        DocumentIsActive: false,
        DocumentTags: [],
        SelfApproved: false,
        Reviewers: [],
        Stakeholders: [],
        EscalationPerson: [],
        EscalationTimeUnit: "",
        EscalationTimeValue: "",
        ShowUploadedFileName: null,
        UploadedFile: null,
        PreviewUrl: null,
        DocumentExpiry: null,
        IsSkipDocumentExpiry: false,
        StakeHolderEscalationAfter: "",
        StakeHolderEscalationType: "",
        StakeHolderEscalationUsers: [],
        NeedAcceptanceFromEndUsers: false,
        NeedAcceptanceFromStakeHolders: false,
        NeedAcceptanceForApprover: false,
        RiskDetails: [],
        ElementAttributeTypeID: null,
        CoOwnerUserID: [],
      });
    } else {
      const data = {
        DocumentID: documentID,
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      };
      setIsDraftFetching(true);
      try {
        const response = await viewDocumentModuleDraft(data);
        if (response?.status === 200) {
          const documentDraft = response?.data?.data?.documentDraft;
          setDocDraft(documentDraft);
          const RiskAndComplience = documentDraft?.RiskAndComplience;
          setRiskAndComplienceString(RiskAndComplience);
          const ClauseDetailsArrays = documentDraft?.ClauseDetailsArrays;
          setClauseDetails(ClauseDetailsArrays || []);
          let filePath = documentDraft?.DocumentPath;
          if (filePath) {
            filePath = filePath.split("/").pop();
          }
          const isRejected =
            documentDraft?.Checkers?.some(
              (c) => c.ApprovalStatus === "Rejected"
            ) ||
            documentDraft?.Approvers?.some(
              (a) => a.ApprovalStatus === "Rejected"
            ) ||
            documentDraft?.StakeHolders?.some(
              (s) => s.ApprovalStatus === "Rejected"
            ) ||
            documentDraft?.EscalationPersons?.some(
              (e) => e.ApprovalStatus === "Rejected"
            ) ||
            documentDraft?.StakeHolderEscalationUsers?.some(
              (e) => e.ApprovalStatus === "Rejected"
            );
          setShowTheConfigure(isRejected);
          setPreviewUrl(
            documentDraft?.DocumentPath
              ? `${BASE_URL}${documentDraft?.DocumentPath}`
              : null
          );
          setUploadedFile(documentDraft?.DocumentPath || null);
          setShowUploadedFileName(filePath || null);
          setFormState({
            DocumentID: documentDraft?.DocumentID,
            DocumentName: documentDraft?.DocumentName,
            DocumentDescription: documentDraft?.DocumentDescription,
            DocumentIsActive: documentDraft?.DocumentIsActive,
            DocumentTags: documentDraft?.DocumentTags
              ? documentDraft.DocumentTags.split(",")
              : [],
            SelfApproved: documentDraft?.SelfApproved || false,
            Reviewers: (documentDraft?.Checkers || []).map((r) => r.UserID),
            StakeHolder: (documentDraft?.StakeHolders || []).map(
              (s) => s.UserID
            ),
            EscalationPerson: (documentDraft?.EscalationPersons || []).map(
              (e) => e.UserID
            ),
            Approvers: (documentDraft?.Approvers || []).map((a) => a.UserID),
            EscalationType: documentDraft?.EscalationType || null,
            EscalationAfter: documentDraft?.EscalationAfter || null,
            ShowUploadedFileName: filePath || null,
            UploadedFile: documentDraft?.DocumentPath || null,
            PreviewUrl:
              documentDraft?.DocumentPath &&
              `${BASE_URL}${documentDraft?.DocumentPath}`,
            DocumentExpiry: documentDraft?.DocumentExpiry
              ? moment(documentDraft.DocumentExpiry).format("YYYY-MM-DD")
              : null,
            IsSkipDocumentExpiry: documentDraft?.DocumentExpiry === null,
            StakeHolderEscalationAfter:
              documentDraft?.StakeHolderEscalationAfter || null,
            StakeHolderEscalationPerson:
              documentDraft?.StakeHolderEscalationUsers || [],
            StakeHolderEscalationType:
              documentDraft?.StakeHolderEscalationType || null,
            StakeHolderEscalationUsers:
              documentDraft?.StakeHolderEscalationUsers || [],
            NeedAcceptance: documentDraft?.NeedAcceptance || false,
            NeedAcceptanceFromStakeHolder:
              documentDraft?.NeedAcceptanceFromStakeHolder || false,
            NeedAcceptanceForApprover:
              documentDraft?.NeedAcceptanceForApprover || false,
            RiskDetailsArrays:
              documentDraft?.RiskAndComplience?.RiskDetailsArrays || [],
            ComplianceDetailsArrays:
              documentDraft?.RiskAndComplience?.ComplianceDetailsArrays || [],
            ClauseDetailsArrays:
              documentDraft?.RiskAndComplience?.ClauseDetailsArrays || [],
            ElementAttributeTypeID:
              documentDraft?.ElementAttributeTypeID || null,
            ElementAttribute: documentDraft?.ElementAttribute || null,
            DocumentReadingTime: documentDraft?.DocumentReadingTime || "",
            ReadingTimeValue: documentDraft?.ReadingTimeValue || "",
            ReadingTimeUnit: documentDraft?.ReadingTimeUnit || "",
            CoOwnerUserID: documentDraft?.CoOwnerUserID || [],
          });
          if (documentDraft?.DocumentStatus !== "InProgress") {
            await handleAttributeTypeChange({
              ElementAttributeTypeID: documentDraft?.ElementAttributeTypeID,
            });
          }
        } else {
          notify(
            "error",
            response?.data?.message ||
              response?.data?.error ||
              "An error occurred"
          );
        }
      } catch (error) {
        notify("error", error?.response?.data?.message);
      } finally {
        setIsDraftFetching(false);
      }
    }
  };

  // const handleTagDelete = (tagToDelete) => {
  //   setFormState((prevState) => ({
  //     ...prevState,
  //     Tags: prevState.Tags.filter((tag) => tag !== tagToDelete),
  //   }));
  // };

  const getAcceptedFileTypes = () => {
    const selectedContentName = localStorage.getItem("selectedContentName");
    if (
      isCreateTemplate ||
      options === "create-blank" ||
      selectedDocumentTypes === "Create Template" ||
      selectedContentName === "Create Template"
    ) {
      return {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "application/msword": [".doc"],
      };
    }
    return {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    };
  };

  const handleUploadFile = async (file) => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setFileError("");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const isDocx =
        file.name.toLowerCase().endsWith(".docx") ||
        file.name.toLowerCase().endsWith(".doc");
      const selectedContentName = localStorage.getItem("selectedContentName");
      let mainResponse;

      if (
        selectedDocumentTypes !== "Create Template" &&
        selectedContentName !== "Create Template"
      ) {
        mainResponse = await uploadDocument(formData, (progress) => {
          setUploadProgress(progress);
        });
      }

      if (
        isDocx &&
        (selectedDocumentTypes === "Create Template" ||
          selectedContentName === "Create Template")
      ) {
        try {
          const templateFormData = new FormData();
          templateFormData.append("file", file);
          const templateResponse = await templateUploadDocx(
            templateFormData,
            (progress) => {
              console.log("Template upload progress:", progress);
              setUploadProgress(progress);
            }
          );
          setTemplateURL(templateResponse?.data?.data?.file);
          setUploadedFile(templateResponse?.data?.data?.file);
        } catch (templateError) {
          console.error("Template upload failed:", templateError);
          notify("error", "Template upload failed");
        }
      }

      if (mainResponse?.status === 201 || mainResponse?.status === 200) {
        let file = mainResponse?.data?.data?.file;
        setUploadedFile(file);
        setPreviewUrl(`${BASE_URL}${file}`);
        notify("success", mainResponse?.data?.message);

        const type = getFileTypeFromUrl(`${BASE_URL}${file}`);
        if ((type === "doc" || type === "docx") && coCreation) {
          if (formState?.ElementAttributeTypeID !== null) {
            await handleAttributeTypeChange({
              ElementAttributeTypeID: formState?.ElementAttributeTypeID,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      notify("error", error?.response?.data?.message);
    } finally {
      setIsUploading(false);
    }
  };

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
  } = useDropzone({
    accept: getAcceptedFileTypes(),
    maxSize: FILE_SIZE * 1024 * 1024,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setRawFileUploaded(file);
      if (file) {
        await handleUploadFile(file);
      }
    },
    onDropRejected: (rejectedFiles) => {
      setUploadedFile(null);
      setPreviewUrl(null);
      const selectedContentName = localStorage.getItem("selectedContentName");
      const isTemplateMode =
        isCreateTemplate ||
        options === "create-blank" ||
        selectedDocumentTypes === "Create Template" ||
        selectedContentName === "Create Template";

      const supportedTypes = isTemplateMode
        ? [".docx", ".doc"]
        : [
            ".pdf",
            ".doc",
            ".docx",
            ".xls",
            ".xlsx",
            ".ppt",
            ".pptx",
            ".jpg",
            ".jpeg",
            ".png",
          ];

      const file = rejectedFiles[0].file;
      const error = rejectedFiles[0].errors[0];
      const extension = file?.name?.split(".").pop()?.toLowerCase();

      if (error.code === "file-too-large") {
        setFileError(`File is larger than ${FILE_SIZE} MB`);
      } else if (!supportedTypes.includes(`.${extension}`)) {
        setFileError(
          isTemplateMode
            ? "Only DOCX and DOC files are allowed for template creation."
            : "Unsupported file type. Allowed: pdf, doc, docx, xls, xlsx, ppt, pptx."
        );
      } else {
        setFileError(error.message);
      }
    },
    noClick: true,
  });

  const validate = () => {
    let newErrors = {};

    if (!formState.DocumentName.trim() && !newErrors.DocumentName) {
      newErrors.DocumentName = "Document Name is required.";
    }
    if (!editDocumentID && !formState.documentID) {
      if (!uploadedFile) {
        newErrors.file = t("errors.DocumentPDFRequired");
      }
    }

    if (!formState.ElementAttributeTypeID) {
      newErrors.ElementAttributeTypeID = t("SelectAttributeType");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSaveFromFilePreviewer = (data) => {
    setRiskDetails(data.riskTexts);
    setComplianceDetails(data.commonTexts);
    setClauseDetails(data.clauseTexts);
    setRiskPositions(data.riskPositions || []);
    setCompliancePositions(data.compliancePositions || []);
    setClausePositions(data.clausePositions || []);
  };

  const handleTemplateSave = async (templateData) => {
    const { file } = templateData;
    setTemplateFile(file);
    setTemplateAccordionOpen(false);
    setShowUploadedFileName(file.name);
    await handleUploadFile(file);
  };
  useEffect(() => {
    const selectedDocType = localStorage.getItem("selectedDocumentType");
    if (selectedDocType === "create-blank" && newDocumentId) {
      setShowNextButton(true);
    } else {
      setShowNextButton(false);
    }
  }, [newDocumentId]);

  const onCreateDocumentHandler = async () => {
    const newErrors = {};
    if (!validateInput(formState.DocumentName)) {
      newErrors.DocumentName = "Invalid input detected in document name";
      errorHandler.addSecurityError(formState.DocumentName, "DocumentName");
    }

    if (!validateInput(formState.DocumentDescription)) {
      newErrors.DocumentDescription =
        "Invalid input detected in document description";
      errorHandler.addSecurityError(
        formState.DocumentDescription,
        "DocumentDescription"
      );
    }

    if (
      formState.DocumentTags &&
      formState.DocumentTags.some((tag) => !validateInput(tag))
    ) {
      newErrors.DocumentTags = "Invalid input detected in document tags";
      errorHandler.addSecurityError(
        formState.DocumentTags.join(","),
        "DocumentTags"
      );
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const RiskPropertiesDetails = riskPositions.map((item) => ({
      Text: item.text,
      Page: item.position.page,
      PageIndex: item.position.pageIndex,
      Top: item.position.top,
      Left: item.position.left,
      Width: item.position.width,
      Height: item.position.height,
    }));

    const CompliancePropertiesDetails = compliancePositions.map((item) => ({
      Text: item.text,
      Page: item.position.page,
      PageIndex: item.position.pageIndex,
      Top: item.position.top,
      Left: item.position.left,
      Width: item.position.width,
      Height: item.position.height,
    }));

    const ClausePropertiesDetails = clausePositions.map((item) => ({
      Text: item.text,
      Page: item.position.page,
      PageIndex: item.position.pageIndex,
      Top: item.position.top,
      Left: item.position.left,
      Width: item.position.width,
      Height: item.position.height,
    }));
    if (!showTheConfigure) {
      if (validate()) {
        const inputs = [formState.DocumentName];
        if (validateAndSanitizeInputs(inputs)) {
          if (formState.SelfApproved) {
            setIsPublishingDocument(true);
          } else {
            setIsSubmittingDocument(true);
          }
          const ModuleTypeID = presistStore?.ModuleTypeID;
          const ContentID = presistStore?.ContentID;

          if (!ModuleTypeID || !ContentID) {
            return notify("error", "Please select a module and content type");
          }
          const fileUrl =
            formState.templateData || uploadedFile || formState.DocumentPath;
          if (templateFile && !uploadedFile) {
            try {
              setIsUploading(true);
              const formData = new FormData();
              formData.append("file", templateFile);
              const response = await uploadDocument(formData, (progress) => {
                setUploadProgress(progress);
              });

              if (response?.status === 201 || response?.status === 200) {
                let file = response?.data?.data?.file;
                setUploadedFile(file);
                setPreviewUrl(`${BASE_URL}${file}`);
                notify("success", "Template file uploaded successfully");
              } else {
                notify("error", "Failed to upload template file");
                return;
              }
            } catch (error) {
              console.log(error);
              notify(
                "error",
                error?.response?.data?.message ||
                  "Failed to upload template file"
              );
              return;
            } finally {
              setIsUploading(false);
            }
          }

          const user_id = localStorage.getItem("user_id");
          const data = {
            ElementAttributeTypeID: formState?.ElementAttributeTypeID,
            ModuleTypeID: ModuleTypeID,
            ContentID: ContentID,
            DocumentID: editDocumentID || null,
            DocumentName: formState.DocumentName,
            DocumentDescription: formState.DocumentDescription,
            DocumentTags: formState.DocumentTags
              ? formState.DocumentTags.join(",")
              : null,
            Checker: formState.Reviewers,
            Approver: formState.Approvers,
            StakeHolder: formState.StakeHolder,
            EscalationPerson: formState.EscalationPerson || [],
            EscalationType: formState.EscalationType || null,
            EscalationAfter: formState.EscalationAfter || null,
            StakeHolderEscalationPerson:
              formState.StakeHolderEscalationPerson || [],
            StakeHolderEscalationType: formState.StakeHolderEscalationType,
            StakeHolderEscalationAfter: formState.StakeHolderEscalationAfter,
            SelfApproved: formState.SelfApproved,
            ReadingTimeValue: formState.ReadingTimeValue,
            ReadingTimeUnit: formState.ReadingTimeUnit,
            DocumentExpiry: formState.DocumentExpiry,
            RiskDetailsArrays: [...riskDetails],
            ComplianceDetailsArrays: [...complianceDetails],
            ClauseDetailsArrays: [...clauseDetails],
            NeedAcceptance: formState.NeedAcceptance,
            NeedAcceptanceFromStakeHolder:
              formState.NeedAcceptanceFromStakeHolder,
            NeedAcceptanceForApprover: formState.NeedAcceptanceForApprover,
            FileUrl: uploadedFile,
            DocumentOwner: [user_id],
            DocumentIsActive: formState.DocumentIsActive || false,
            RiskPropertiesDetails,
            CompliancePropertiesDetails,
            ClausePropertiesDetails,
            IsTemplate: isTemplate,
            TemplateID: templateID || templateIDs || null,
            CoOwnerUserID: formState.CoOwnerUserID || [],
            IsPublic: formState.IsPublic,
          };

          try {
            let templateDocumentId = null;
            if (isTemplate) {
              const templatePayload = {
                ElementAttributeTypeID: formState?.ElementAttributeTypeID,
                ModuleTypeID: ModuleTypeID,
                DocumentName: formState.DocumentName,
                DocumentDescription: formState.DocumentDescription,
                DocumentIsActive: formState.DocumentIsActive || false,
                DocumentExpiry: formState.DocumentExpiry,
                DraftVersion: "1.0",
                MasterVersion: "1.0",
                SelfApproved: formState.SelfApproved,
                DocumentPath: templateURL || uploadedFile,
                ContentID: ContentID,
                IsPublic: formState.IsPublic,
              };
              const templateResponse = await createTemplate(templatePayload);
              console.log("Template Creation Response:", templateResponse);
              if (
                templateResponse?.status === 201 ||
                templateResponse?.status === 200
              ) {
                templateDocumentId = templateResponse?.data?.DocumentTemplateID;
                setTemplateID(templateDocumentId);
                notify(
                  "success",
                  t("Template created successfully") ||
                    templateResponse?.data?.message
                );
              } else {
                notify(
                  "error",
                  templateResponse?.data?.message ||
                    templateResponse?.data?.error ||
                    "Template creation failed"
                );
                return;
              }
            }
            const response = await createDocumentModule({
              ...data,
              IsTemplate: isTemplate,
              TemplateID: templateDocumentId || templateIDs || null,
            });
            if (response?.status === 201 || response?.status === 200) {
              notify(
                "success",
                t("Document Module created successfully") ||
                  response?.data?.message
              );
              const newDocumentId = response?.data?.DocumentID;
              setNewDocumentId(newDocumentId);

              if (selectedDocumentType === "create-from-template") {
                setIsTemplateSelectorOpen(true);
                setTemplateSelectorData(response?.data);
              } else if (
                !(selectedDocumentType === "create-blank" && isTemplate)
              ) {
                handleClose();
                localStorage.removeItem("selectedDocumentType");
              }

              if (rawFileUploaded) {
                setIsUploadingToAI(true);
                setUploadAIProgress(0);
                const formData = new FormData();
                formData.append("file", rawFileUploaded);
                formData.append("document_id", newDocumentId);
                try {
                  const uploadAIResponse = await fetch(
                   process.env.VITE_UPLOAD_AI_API,
                    {
                      method: "POST",
                      body: formData,
                    }
                  );
                  if (uploadAIResponse.ok) {
                    const uploadAIResult = await uploadAIResponse.json();
                    console.log("Upload AI API Response:", uploadAIResult);
                  } else {
                    console.error(
                      "Upload AI API failed:",
                      uploadAIResponse.status
                    );
                    const errorText = await uploadAIResponse.text();
                    console.error("Error details:", errorText);
                  }
                } catch (uploadAIError) {
                  console.error("Error calling Upload AI API:", uploadAIError);
                }
              } else {
                console.log("No raw file available to upload to AI API");
              }
              dispatch(
                GetElementsCategory({
                  ModuleTypeID,
                  ParentContentID: ContentID,
                })
              );
            } else {
              notify(
                "error",
                response?.data?.message ||
                  response?.data?.error ||
                  "An error occurred"
              );
            }
          } catch (error) {
            notify("error", error?.response?.data?.message);
          } finally {
            if (formState.SelfApproved) {
              setIsPublishingDocument(false);
            } else {
              setIsSubmittingDocument(false);
            }
          }
        } else {
          notify("error", "Suspicious input detected!");
        }
      }
    } else {
      const ModuleTypeID = presistStore?.ModuleTypeID;
      const ContentID = presistStore?.ContentID;
      if (!ModuleTypeID || !ContentID) {
        return notify("error", "Please select a module and content type");
      }
      const user_id = localStorage.getItem("user_id");
      handleNext(
        {
          ElementAttributeTypeID: formState?.ElementAttributeTypeID,
          ModuleTypeID: ModuleTypeID,
          ContentID: ContentID,
          DocumentID: editDocumentID || null,
          DocumentName: formState.DocumentName,
          DocumentDescription: formState.DocumentDescription,
          DocumentTags: formState.DocumentTags
            ? formState.DocumentTags.join(",")
            : null,
          Checker: formState.Reviewers,
          Approver: formState.Approvers,
          StakeHolder: formState.StakeHolder,
          EscalationPerson: formState.EscalationPerson || [],
          EscalationType: formState.EscalationType || null,
          EscalationAfter: formState.EscalationAfter || null,
          StakeHolderEscalationPerson: formState.StakeHolderEscalationPerson,
          StakeHolderEscalationType: formState.StakeHolderEscalationType,
          StakeHolderEscalationAfter: formState.StakeHolderEscalationAfter,
          SelfApproved: formState.SelfApproved,
          ReadingTimeValue: formState.ReadingTimeValue,
          ReadingTimeUnit: formState.ReadingTimeUnit,
          DocumentExpiry: formState.DocumentExpiry,
          RiskDetailsArrays: [...riskDetails],
          ComplianceDetailsArrays: [...complianceDetails],
          ClauseDetailsArrays: [...clauseDetails],
          NeedAcceptance: formState.NeedAcceptance,
          NeedAcceptanceFromStakeHolder:
            formState.NeedAcceptanceFromStakeHolder,
          NeedAcceptanceForApprover: formState.NeedAcceptanceForApprover,
          FileUrl: formState.DocumentPath || uploadedFile,
          DocumentOwner: [user_id],
          DocumentIsActive: formState.DocumentIsActive || false,
          RiskPropertiesDetails,
          CompliancePropertiesDetails,
          ClausePropertiesDetails,
          IsTemplate: isTemplate,
          TemplateID: templateID,
          CoOwnerUserID: formState.CoOwnerUserID || [],
        },
        processOwnerList,
        processOwnerAndEndUserList
      );
    }
  };
  const FetchlistProcessOwnerAndEndUser = async () => {
    try {
      const response = await listProcessOwnerAndEndUser();
      if (response?.status === 200) {
        const formattedName = response?.data?.data?.userList?.map(
          (userDetail) => ({
            UserID: userDetail?.UserID,
            UserName: formatUserName(userDetail),
          })
        );
        setProcessOwnerAndEndUserList(formattedName);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    }
  };

  useEffect(() => {
    FetchlistProcessOwnerAndEndUser();
  }, []);

  useEffect(() => {
    if (formState?.ElementAttributeTypeID !== null) {
      setIsAttributeDataFetching(true);
      ViewElementAttributeType({
        ElementAttributeTypeID: formState?.ElementAttributeTypeID,
      })
        .then((response) => {
          if (response?.status === 200) {
            const { elementAttribute } = response.data.data;
            setSelectedAttribute({ ...elementAttribute });
          } else {
            notify("error", response.data.message || "Failed to fetch data.");
          }
        })
        .catch((error) => {
          notify("error", error?.response?.data?.message);
        })
        .finally(() => {
          setIsAttributeDataFetching(false);
        });
    }
  }, [formState?.ElementAttributeTypeID]);

  useEffect(() => {
    listProcessOwner()
      .then((response) => {
        if (response?.status === 200) {
          const formattedName = response?.data?.data?.userList?.map(
            (userDetail) => ({
              UserID: userDetail?.UserID,
              UserName: formatUserName(userDetail),
            })
          );
          setProcessOwnerList(formattedName);
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      });
  }, []);

  useEffect(() => {
    if (editDocumentID) {
      fetchDocumentDraftData(editDocumentID);
    }
  }, [editDocumentID]);

  const fetchDocumentTypes = async () => {
    try {
      const response = await listElementAttributeType(payload);
      if (response?.status === 200) {
        setAttributeTypeList(
          (response.data.data.elementAttributes || []).slice().reverse()
        );
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching document types:", error);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  useEffect(() => {
    if (
      isWordDoc(previewUrl) &&
      selectedAttribute &&
      selectedAttribute.Stakeholders
    ) {
      const stakeholderIds = selectedAttribute.Stakeholders;
      setFormState((prevState) => ({
        ...prevState,
        StakeHolder: [...stakeholderIds],
      }));
    }
  }, [selectedAttribute, previewUrl]);

  const handleAttributeTypeChange = async (newValue) => {
    if (!newValue) {
      setFormState((prevState) => ({
        ...prevState,
        ElementAttributeTypeID: null,
        ElementAttribute: null,
      }));
      return;
    }
    setFormState((prevState) => ({
      ...prevState,
      ElementAttributeTypeID: newValue.ElementAttributeTypeID,
      ElementAttribute: newValue.ElementAttribute,
    }));
    try {
      setIsAttributeDataFetching(true);
      const response = await ViewElementAttributeType({
        ElementAttributeTypeID: newValue.ElementAttributeTypeID,
      });
      if (response?.status === 200) {
        const { elementAttribute } = response.data.data;
        setFormState((prevState) => ({
          ...prevState,
          ElementAttributeTypeID: elementAttribute.ElementAttributeTypeID,
          DocumentReadingTime: elementAttribute.DocumentReadingTime || null,
          readTimeValue: elementAttribute.DocumentReadingTime
            ? elementAttribute.DocumentReadingTime.split(" ")[0]
            : "",
          readTimeUnit: elementAttribute.DocumentReadingTime
            ? elementAttribute.DocumentReadingTime.split(" ")[1]
            : "",
          StakeHolderEscalationAfter:
            elementAttribute.StakeHolderEscalationAfter || null,
          StakeHolderEscalationType:
            elementAttribute.StakeHolderEscalationType || null,
          IsSkipDocumentExpiry:
            !elementAttribute.IsExpiry || elementAttribute.ExpiryDate === null,
          DocumentExpiry:
            elementAttribute.IsExpiry && elementAttribute.ExpiryDate
              ? moment(elementAttribute.ExpiryDate).format("YYYY-MM-DD")
              : null,
          NeedAcceptanceFromStakeHolder:
            elementAttribute.NeedAcceptanceFromStakeHolder || false,
          NeedAcceptanceForApprover:
            elementAttribute.NeedAcceptanceForApprover || false,
          NeedAcceptance: elementAttribute.NeedAcceptance || false,
          Approvers: elementAttribute.Approvers || [],
          StakeHolder: elementAttribute.Stakeholders || [],
          EscalationPerson: elementAttribute.EscalationUsers || [],
          StakeHolderEscalationPerson:
            elementAttribute.StakeHolderEscalationUsers || [],
          Reviewers: elementAttribute.Reviewers || [],
          EscalationType: elementAttribute.EscalationType || null,
          EscalationAfter: elementAttribute.EscalationAfter || null,
          SelfApproved: elementAttribute.SelfApproved || false,
          CoOwnerUserID: elementAttribute.CoOwnerUserID || [],
        }));

        // Update the selectedAttribute state as well
        setSelectedAttribute({ ...elementAttribute });
      } else {
        notify("error", response.data.message || "Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error fetching edit data:", error);
    } finally {
      setIsAttributeDataFetching(false);
    }
  };

  const getFileTypeFromUrl = (url) => {
    if (!url) return null;
    const extension = url.split(".").pop().split("?")[0];
    return extension?.toLowerCase();
  };

  const isWordDoc = (url) => {
    const type = getFileTypeFromUrl(url);
    return (type === "doc" || type === "docx") && coCreation;
  };

  const formData = {
    Approvers: formState?.Approvers,
    Reviewers: formState?.Reviewers,
    Stakeholders: formState?.StakeHolder,
    EscalationUsers: formState?.EscalationUsers,
    StakeHolderEscalationUsers: formState?.StakeHolderEscalationUsers,
  };
  const getConflictingFields = (currentField) => {
    switch (currentField) {
      case "Reviewers":
        return ["Approvers", "Stakeholders", "EscalationUsers"];
      case "Approvers":
        return ["Reviewers", "Stakeholders"];
      case "Stakeholders":
        return ["Reviewers", "Approvers", "EscalationUsers"];
      case "EscalationPerson":
        return ["Reviewers", "Stakeholders"];
      case "StakeHolderEscalationUsers":
        return ["Stakeholders"];
      default:
        return [];
    }
  };
  const getAllSelectedUsers = (currentField) => {
    const conflictFields = getConflictingFields(currentField);
    return conflictFields.flatMap((field) => formData[field] || []);
  };

  const getAvailableUsersWithFixed = (
    currentField,
    userList,
    fixedIds = []
  ) => {
    const allSelected = getAllSelectedUsers(currentField);
    const currentSelected = formData[currentField] || [];

    return userList.filter((user) => {
      return (
        (!allSelected.includes(user.UserID) ||
          currentSelected.includes(user.UserID) ||
          fixedIds.includes(user.UserID)) &&
        user.UserID !== loginUserId
      );
    });
  };

  const handleUserChange = ({
    newValue,
    currentField,
    allUsers,
    fixedIds,
    selected,
    setter,
  }) => {
    const fixedUsers = allUsers.filter((user) =>
      fixedIds.includes(user.UserID)
    );

    const allSelectedInOtherFields = getAllSelectedUsers(currentField);

    const mergedUsers = [
      ...fixedUsers,
      ...newValue.filter((user) => {
        const userId = user.UserID;

        return (
          !fixedIds.includes(userId) &&
          (!allSelectedInOtherFields.includes(userId) ||
            selected.includes(userId))
        );
      }),
    ];
    const uniqueUsers = [
      ...new Map(mergedUsers.map((u) => [u.UserID, u])).values(),
    ];
    const userIds = uniqueUsers.map((user) => user.UserID);
    setter((prevState) => ({
      ...prevState,
      [currentField]: userIds,
    }));
  };

  const handleDocumentTypeSelect = (option, apiResponse) => {
    setOptions(option);
    console.log("Document type selected:", option, apiResponse?.data?.url);
    setFileURL(apiResponse?.data?.url);
    if (apiResponse && apiResponse.data && apiResponse.data.url) {
      setIsTemplate(false);
      setTemplateAccordionOpen(false);
      setUploadedFile(apiResponse.data.url);
      setPreviewUrl(`${BASE_URL}${apiResponse.data.url}`);
      setShowUploadedFileName(apiResponse.data.url.split("/").pop());
      setTemplateSelectorData(apiResponse.data);
      return;
    }
    setSelectedDocumentType(option);
    switch (option) {
      case "create-blank":
        setIsTemplate(true);
        setTemplateAccordionOpen(true);
        break;
      case "upload-docx":
        setIsTemplate(true);
        setTemplateAccordionOpen(true);
        break;
      case "document-upload":
        setIsTemplate(false);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const onlyofficeModal = localStorage.getItem("onlyofficeModal");
    if (onlyofficeModal === "false") {
      handleClose();
    }
  }, [onlyofficeModal]);

  const [isNextLoading, setIsNextLoading] = useState(false);
  const handleNextButtonClick = async () => {
    // Add validation for Document Name
    if (!formState.DocumentName || !formState.DocumentName.trim()) {
      setErrors((prev) => ({
        ...prev,
        DocumentName: "Document Name is required.",
      }));
      return;
    }
    setIsNextLoading(true);
    const user_id = localStorage.getItem("user_id");
    const payload = {
      DocumentID: threenDotClickedDocumentID || null,
      ElementAttributeTypeID: formState?.ElementAttributeTypeID,
      ModuleTypeID: presistStore?.ModuleTypeID,
      ContentID: presistStore?.ContentID,
      DocumentName: formState.DocumentName,
      DocumentDescription: formState.DocumentDescription,
      DocumentIsActive: formState.DocumentIsActive || false,
      DocumentTags: formState.DocumentTags
        ? formState.DocumentTags.join(",")
        : null,
      DocumentExpiry: formState.DocumentExpiry,
      CoOwnerUserID: formState.CoOwnerUserID || [],
      TemplateID: templateID || templateIDs || null,
      DocumentOwner: [user_id],
      Checker: formState.Reviewers,
      Approver: formState.Approvers,
      StakeHolder: formState.StakeHolder,
      FileUrl: uploadedFile,
      IsPublic: formState.IsPublic,
    };

    try {
      const response = await CreateTemplateAndBlankDocumentApi(payload);
      if (response?.status === 200 || response?.status === 201) {
        console.log("CreateTemplateAndBlankDocumentApi", response);
        setCreateTemplateAndBlankDocumentApi(response?.data);
        if (response?.data?.DocumentID) {
          setNewDocumentId(response.data.DocumentID);
        }
        setIsTemplateSelectorOpen(true);
        setTemplateSelectorData(response?.data);
        dispatch(
          GetElementsCategory({
            ModuleTypeID: presistStore?.ModuleTypeID,
            ParentContentID: presistStore?.ContentID,
          })
        );
      } else {
        notify(
          "error",
          response?.data?.message ||
            response?.data?.error ||
            "An error occurred"
        );
      }
    } catch (error) {
      notify("error", error?.response?.data?.message || "API error");
    } finally {
      setIsNextLoading(false);
    }
  };
  const handleSaveTemplate = async () => {
    if (!formState.ElementAttributeTypeID) {
      notify("error", "Please select an attribute type");
      return;
    }
    if (!formState.DocumentName) {
      notify("error", "Please enter a document name");
      return;
    }
    if (!uploadedFile) {
      notify("error", "Please upload a document");
      return;
    }
    setIsNextLoading(true);
    const templatePayload = {
      DocumentTemplateID: documentTemplateID || null,
      ElementAttributeTypeID: formState?.ElementAttributeTypeID,
      ModuleTypeID: presistStore?.ModuleTypeID,
      DocumentName: formState.DocumentName,
      DocumentDescription: formState.DocumentDescription,
      DocumentIsActive: formState.DocumentIsActive || false,
      DocumentExpiry: formState.DocumentExpiry,
      DraftVersion: "0.1",
      MasterVersion: null,
      SelfApproved: false,
      DocumentPath: templateURL || uploadedFile,
      EditedDocumentPath: null,
      ContentID: presistStore?.ContentID,
      IsPublic: formState.IsPublic,
    };
    try {
      const response = await createTemplate(templatePayload);
      if (response?.status === 200 || response?.status === 201) {
        notify("success", "Template created successfully");
        const templateId = response?.data?.DocumentTemplateID;
        setTemplateID(templateId);
        setTemplateSelectorData({
          ...response?.data,
          url: uploadedFile,
        });

        if (onTemplateSaveSuccess) {
          onTemplateSaveSuccess({
            success: true,
            templateId: templateId,
            templateData: response?.data,
            documentName: formState.DocumentName,
          });
        }
        setIsTemplateSelectorOpen(true);
      } else {
        notify(
          "error",
          response?.data?.message ||
            response?.data?.error ||
            "Template creation failed"
        );
        if (onTemplateSaveSuccess) {
          onTemplateSaveSuccess({
            success: false,
            error: response?.data?.message || "Template creation failed",
          });
        }
      }
    } catch (error) {
      notify(
        "error",
        error?.response?.data?.message || "Failed to create template"
      );
      console.error("Template creation error:", error);
      if (onTemplateSaveSuccess) {
        onTemplateSaveSuccess({
          success: false,
          error: error?.response?.data?.message || "Failed to create template",
        });
      }
    } finally {
      setIsNextLoading(false);
    }
  };
  useEffect(() => {
    if (docDraft?.DocumentStatus == "InProgress") {
      const filteredUsersEscalationStakeholders =
        docDraft?.EscalationPersons?.filter((user) => user.IsStakeHolder).map(
          (user) => user.UserID
        );
      setFilteredUsersEscalation(filteredUsersEscalationStakeholders);
      const filteredUsersEscalation = docDraft?.EscalationPersons?.filter(
        (user) => !user.IsStakeHolder
      ).map((user) => user.UserID);
      setFilteredUsersEscalation(filteredUsersEscalation);
    } else {
      setFilteredUsersEscalation(formState?.EscalationPerson || []);
      setFilteredUsersEscalationStakeholders(
        formState?.StakeHolderEscalationPerson || []
      );
    }
  }, [docDraft, formState]);
  return (
    <>
      <Box style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
        <DialogContent
          sx={{
            flex: 1,
            marginTop: "-16px",
            overflow: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            position: "relative",
          }}
        >
          {isDraftFetching && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                backdropFilter: "blur(4px)",
              }}
            >
              <Box
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <CircularProgress size={24} />
                <Typography
                  variant="body2"
                  style={{ color: "#64748b", fontWeight: "500" }}
                >
                  {t("fetching_data")}
                </Typography>
              </Box>
            </Box>
          )}

          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              height: "100%",
              alignContent: "start",
            }}
          >
            <Box
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {selectedDocumentType === "create-from-template" && (
                <Box>
                  <Typography variant="h8">{t("Select Template")}</Typography>
                  <Select
                    fullWidth
                    size="small"
                    value={selectedTemplate || ""}
                    onChange={(e) => {
                      const selected = templates.find(
                        (t) => t.DocumentTemplateID === e.target.value
                      );
                      setTemplateIDs(e.target.value);
                      setSelectedTemplate(e.target.value);
                      if (selected) {
                        setFormState((prev) => ({
                          ...prev,
                          DocumentName: selected.DocumentName,
                          DocumentDescription: selected.DocumentDescription,
                          DocumentExpiry: selected.DocumentExpiry
                            ? moment(selected.DocumentExpiry).format(
                                "YYYY-MM-DD"
                              )
                            : null,
                          ElementAttributeTypeID:
                            selected.ElementAttributeTypeID,
                          DocumentPath: selected.DocumentPath,
                        }));

                        if (selected.DocumentPath) {
                          setPreviewUrl(`${BASE_URL}${selected.DocumentPath}`);
                          setUploadedFile(selected.DocumentPath);
                          setShowUploadedFileName(
                            selected.DocumentPath.split("/").pop()
                          );
                        }
                        if (selected.ElementAttributeTypeID) {
                          handleAttributeTypeChange({
                            ElementAttributeTypeID:
                              selected.ElementAttributeTypeID,
                          });
                        }
                      }
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select a template</em>
                    </MenuItem>
                    {templates?.map((template) => (
                      <MenuItem
                        key={template.DocumentTemplateID}
                        value={template.DocumentTemplateID}
                      >
                        {template.DocumentName}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )}
              <Box>
                <Typography variant="h8">
                  {t("attribute type")}
                  <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
                </Typography>
                {attributeTypeList?.length > 0 && (
                  <Autocomplete
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        fontSize: "14px",
                        "&:hover": {
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        },
                      },
                    }}
                    options={attributeTypeList || []}
                    getOptionLabel={(option) => option?.Name || ""}
                    isOptionEqualToValue={(option, value) =>
                      option?.ElementAttributeTypeID ===
                      value?.ElementAttributeTypeID
                    }
                    value={
                      attributeTypeList?.find(
                        (element) =>
                          element.ElementAttributeTypeID ===
                          formState?.ElementAttributeTypeID
                      ) || null
                    }
                    disabled={docDraft?.ElementAttributeTypeID}
                    onChange={(event, newValue) => {
                      handleAttributeTypeChange(newValue);
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        disabled={!formState?.ElementAttributeTypeID}
                        variant="outlined"
                        placeholder={t("selectAttributeType")}
                        size="small"
                      />
                    )}
                  />
                )}
                {errors.ElementAttributeTypeID && (
                  <Typography
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.ElementAttributeTypeID}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="h8">
                  {t("documentName")}
                  <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
                </Typography>
                <CustomTextField
                  value={formState?.DocumentName}
                  onChange={(e) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      DocumentName: e.target.value,
                    }))
                  }
                  error={!!errors.DocumentName}
                  helperText={errors.DocumentName}
                  fullWidth
                  size="small"
                  placeholder={t("documentName")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      },
                    },
                  }}
                />
                {errors.DocumentName && (
                  <Typography
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.DocumentName}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="h8">{t("documentDescription")}</Typography>
                <CustomTextField
                  multiline
                  rows={3}
                  disabled={!formState?.ElementAttributeTypeID}
                  placeholder={t("documentDescription")}
                  value={formState?.DocumentDescription}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const htmlTagPattern = /<.*?>/g;
                    if (htmlTagPattern.test(inputValue)) {
                      setFormState((prevState) => ({
                        ...prevState,
                        DocumentDescription: "",
                      }));
                      toast.error(
                        "HTML or script tags are not allowed in the document description."
                      );
                    } else {
                      setFormState((prevState) => ({
                        ...prevState,
                        DocumentDescription: inputValue,
                      }));
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      },
                    },
                  }}
                />
                {errors.DocumentDescription && (
                  <Typography
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.DocumentDescription}
                  </Typography>
                )}
              </Box>
              {selectedDocumentTypes === "Create Template" && (
                <Box
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Switch
                      checked={formState.IsPublic}
                      onChange={() =>
                        setFormState({
                          ...formState,
                          IsPublic: !formState.IsPublic,
                        })
                      }
                      sx={{
                        "& .MuiSwitch-thumb": {
                          backgroundColor: formState.IsPublic
                            ? "#6366f1"
                            : "#d1d5db",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor: formState.IsPublic
                            ? "#c7d2fe"
                            : "#e5e7eb",
                        },
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body1"
                        style={{
                          fontWeight: 600,
                          color: "#374151",
                          fontSize: "14px",
                        }}
                      >
                        {t("visibility")}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: "#6b7280", fontSize: "12px" }}
                      >
                        {t("changeVisibility")}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    style={{
                      color: formState.IsPublic ? "#4f46e5" : "#4b5563",
                      backgroundColor: formState.IsPublic
                        ? "#e0e7ff"
                        : "#f3f4f6",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {formState.IsPublic ? t("public") : t("private")}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="h8">
                  {t("createdByLabels.owner")}
                  <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>
                </Typography>
                <CustomTextField
                  value={owner}
                  disabled={true}
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#f9fafb",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    },
                  }}
                />
              </Box>
              <Box>
                {isWordDoc(previewUrl) && (
                  <Box>
                    <Typography
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      {t("Stake Holders")}
                      {!formState?.SelfApproved && (
                        <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                          *
                        </span>
                      )}
                    </Typography>
                    <Autocomplete
                      multiple
                      size="small"
                      disabled={
                        formState?.SelfApproved ||
                        !formState?.ElementAttributeTypeID
                      }
                      options={getAvailableUsersWithFixed(
                        "Stakeholders",
                        processOwnerAndEndUserList || [],
                        selectedAttribute?.Stakeholders || []
                      )}
                      getOptionLabel={(option) => option?.UserName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.UserID === value
                      }
                      value={(processOwnerAndEndUserList || []).filter((user) =>
                        formState?.StakeHolder.includes(user.UserID)
                      )}
                      onChange={(e, newValue) =>
                        handleUserChange({
                          newValue,
                          currentField: "StakeHolder",
                          allUsers: processOwnerAndEndUserList || [],
                          fixedIds: selectedAttribute?.Stakeholders || [],
                          selected: formState?.StakeHolder || [],
                          setter: setFormState,
                        })
                      }
                      renderTags={(selected, getTagProps) =>
                        selected.map((option, index) => {
                          const isFixed =
                            selectedAttribute?.Stakeholders?.includes(
                              option.UserID
                            );
                          return (
                            <Chip
                              key={option.UserID}
                              label={option.UserName}
                              {...getTagProps({ index })}
                              onDelete={
                                isFixed
                                  ? undefined
                                  : getTagProps({ index }).onDelete
                              }
                              style={{
                                backgroundColor: isFixed
                                  ? "#e0e0e0"
                                  : "#e0f2fe",
                                color: isFixed ? "#374151" : "#0369a1",
                                fontSize: "11px",
                                height: "24px",
                                fontWeight: isFixed ? "bold" : "normal",
                              }}
                            />
                          );
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Choose stakeholders"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "6px",
                              fontSize: "13px",
                            },
                          }}
                        />
                      )}
                    />
                    {errors.StakeHolder && (
                      <Typography
                        style={{
                          color: "#ef4444",
                          fontSize: "11px",
                          marginTop: "4px",
                        }}
                      >
                        {errors.StakeHolder}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
              {isWordDoc(previewUrl) && (
                <Box>
                  <Typography variant="h8">
                    {t("Stake holder EscalationUsers")}
                  </Typography>
                  <Autocomplete
                    multiple
                    size="small"
                    options={processOwnerAndEndUserList || []}
                    getOptionLabel={(option) => option?.UserName || ""}
                    disabled
                    value={(processOwnerAndEndUserList || []).filter((user) =>
                      filteredUsersEscalationStakeholders?.includes(user.UserID)
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("selectEscalationUsers")}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            backgroundColor: "#ffffff",
                            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      />
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          key={option.UserID}
                          label={option.UserName}
                          {...getTagProps({ index })}
                          style={{
                            backgroundColor: "#e0e0e0",
                            color: "#000",
                            fontSize: "11px",
                            height: "24px",
                          }}
                        />
                      ))
                    }
                  />
                </Box>
              )}
              <Box>
                <Typography variant="h8">
                  {t("reviewers")}
                  {!formState?.SelfApproved && (
                    <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                      *
                    </span>
                  )}
                </Typography>
                <Autocomplete
                  multiple
                  size="small"
                  disabled={
                    formState?.SelfApproved ||
                    !formState?.ElementAttributeTypeID
                  }
                  options={getAvailableUsersWithFixed(
                    "Reviewers",
                    processOwnerList || [],
                    selectedAttribute?.Reviewers || []
                  )}
                  getOptionLabel={(option) => option?.UserName || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.UserID === value
                  }
                  value={(processOwnerList || []).filter((user) =>
                    formState?.Reviewers?.includes(user.UserID)
                  )}
                  onChange={(e, newValue) =>
                    handleUserChange({
                      newValue,
                      currentField: "Reviewers",
                      allUsers: processOwnerList || [],
                      fixedIds: selectedAttribute?.Reviewers || [],
                      selected: formState?.SelfApproved,
                      setter: setFormState,
                    })
                  }
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => {
                      const isFixed = selectedAttribute?.Reviewers?.includes(
                        option.UserID
                      );
                      return (
                        <Chip
                          key={option.UserID}
                          label={option.UserName}
                          {...getTagProps({ index })}
                          onDelete={
                            isFixed
                              ? undefined
                              : getTagProps({ index }).onDelete
                          }
                          style={{
                            backgroundColor: isFixed ? "#e0e0e0" : "#fef3c7",
                            color: isFixed ? "#374151" : "#92400e",
                            fontSize: "11px",
                            height: "24px",
                            fontWeight: isFixed ? "bold" : "normal",
                          }}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder={t("Choose reviewers")}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "6px",
                          fontSize: "13px",
                        },
                      }}
                    />
                  )}
                />
              </Box>
              <Box>
                <Typography variant="h8">{t("EscalationUsers")}</Typography>
                <Autocomplete
                  multiple
                  size="small"
                  options={processOwnerAndEndUserList || []}
                  getOptionLabel={(option) => option?.UserName || ""}
                  value={(processOwnerAndEndUserList || []).filter((user) =>
                    filteredUsersEscalation?.includes(user.UserID)
                  )}
                  disabled
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("selectEscalationUsers")}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#ffffff",
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    />
                  )}
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => (
                      <Chip
                        key={option.UserID}
                        label={option.UserName}
                        {...getTagProps({ index })}
                        style={{
                          backgroundColor: "#e0e0e0",
                          color: "#000",
                          fontSize: "11px",
                          height: "24px",
                          fontWeight: "600",
                        }}
                      />
                    ))
                  }
                />
              </Box>
              <Box>
                <Typography
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "8px",
                    marginTop: "-10px",
                  }}
                >
                  {t("approvers")}
                  {!formState?.SelfApproved && (
                    <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                      *
                    </span>
                  )}
                </Typography>
                <Autocomplete
                  multiple
                  size="small"
                  disabled={
                    formState?.SelfApproved ||
                    !formState?.ElementAttributeTypeID
                  }
                  options={getAvailableUsersWithFixed(
                    "Approvers",
                    processOwnerAndEndUserList || [],
                    selectedAttribute?.Approvers || []
                  )}
                  getOptionLabel={(option) => option?.UserName || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.UserID === value
                  }
                  value={(processOwnerAndEndUserList || [])?.filter((user) =>
                    formState?.Approvers?.includes(user.UserID)
                  )}
                  onChange={(e, newValue) =>
                    handleUserChange({
                      newValue,
                      currentField: "Approvers",
                      allUsers: processOwnerAndEndUserList || [],
                      fixedIds: selectedAttribute?.Approvers || [],
                      selected: formState?.Approvers || [],
                      setter: setFormState,
                    })
                  }
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => {
                      const isFixed = selectedAttribute?.Approvers?.includes(
                        option.UserID
                      );
                      return (
                        <Chip
                          key={option.UserID}
                          label={option.UserName}
                          {...getTagProps({ index })}
                          onDelete={
                            isFixed
                              ? undefined
                              : getTagProps({ index }).onDelete
                          }
                          style={{
                            backgroundColor: isFixed ? "#e0e0e0" : "#dcfce7",
                            color: isFixed ? "#374151" : "#166534",
                            fontSize: "11px",
                            height: "24px",
                            fontWeight: isFixed ? "bold" : "normal",
                          }}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder={t("selectApprovers")}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "6px",
                          fontSize: "13px",
                        },
                      }}
                    />
                  )}
                />
              </Box>
              {/* {!IsAttributeDataFetching && (
                <Box>
                <Box>
                    <FormLabel
                      className="label"
                      style={{
                        marginBottom: "8px",
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        marginTop: "-12px",
                      }}
                    >
                      {t("documentTags")}
                    </FormLabel>
                    <Autocomplete
                      multiple
                      freeSolo
                      options={[]}
                      value={formState?.DocumentTags || []}
                      disabled={!formState?.ElementAttributeTypeID}
                      onChange={(event, newTags) =>
                        setFormState({ ...formState, DocumentTags: newTags })
                      }
                      renderTags={(value, getTagProps) =>
                        value?.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            {...getTagProps({ index })}
                            onDelete={() => handleTagDelete(tag)}
                            style={{
                              backgroundColor: "#e0f2fe",
                              color: "#0369a1",
                              fontSize: "12px",
                              height: "28px",
                            }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          variant="outlined"
                          placeholder={t("enterTag")}
                          disabled={!formState?.ElementAttributeTypeID}
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                              backgroundColor: "#ffffff",
                              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                            },
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === ",") {
                              event.preventDefault();
                              const newTag = event.target.value.trim();
                              if (
                                newTag &&
                                !formState?.DocumentTags.includes(newTag)
                              ) {
                                setFormState((prevState) => ({
                                  ...prevState,
                                  DocumentTags: [
                                    ...prevState.DocumentTags,
                                    newTag,
                                  ],
                                }));
                              }
                              setTimeout(() => {
                                event.target.value = "";
                              }, 0);
                            }
                            if (
                              event.key === "Backspace" &&
                              event.target.value === ""
                            ) {
                              event.preventDefault();
                            }
                          }}
                        />
                      )}
                    />
                  </Box> *
                </Box>
              ) */}
            </Box>

            {/* Right Column */}
            <Box
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* File Upload */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  {!(
                    selectedDocumentType === "create-blank" && !isTemplate
                  ) && (
                    <Typography variant="h8">
                      {selectedDocumentTypes === "Create Template" ||
                      localStorage.getItem("selectedContentName") ===
                        "Create Template"
                        ? `${t("TemplateUploadHeading")} (Max ${FILE_SIZE}MB)`
                        : `${t("uploadDocument")} (Max ${FILE_SIZE}MB)`}

                      <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                        *
                      </span>
                    </Typography>
                  )}
                </Box>

                {isTemplate && (
                  <Accordion
                    expanded={templateAccordionOpen}
                    onChange={() => setTemplateAccordionOpen((prev) => !prev)}
                    sx={{
                      boxShadow: "none",
                      background: "transparent",
                      marginBottom: "0px",
                    }}
                  >
                    <AccordionDetails sx={{ padding: 0 }}>
                      {templateAccordionOpen && (
                        <Box sx={{ overflowX: "auto" }}>
                          <TemplateSelector
                            onTemplateSave={handleTemplateSave}
                            newDocumentId={newDocumentId}
                          />
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                )}

                {!(selectedDocumentType === "create-blank") && !isTemplate && (
                  <Card
                    className="upload-card"
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "2px dashed #cbd5e1",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      minHeight: "120px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "2px",
                      height: 120,
                    }}
                    {...getRootProps()}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#f1f5f9";
                      e.target.style.borderColor = "#94a3b8";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#f8fafc";
                      e.target.style.borderColor = "#cbd5e1";
                    }}
                  >
                    <input {...getInputProps()} />
                    <img
                      src={uploadeimage}
                      alt="upload"
                      onClick={openFileDialog}
                      style={{ height: "40px", width: "40px", opacity: 0.7 }}
                    />
                    <Typography
                      variant="body1"
                      onClick={openFileDialog}
                      style={{
                        color: "#475569",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      {isCreateTemplate
                        ? t("selectDocxFileToUpload")
                        : t("selectFileToUpload")}
                    </Typography>
                    <Typography
                      variant="body2"
                      onClick={openFileDialog}
                      style={{
                        color: "#64748b",
                        fontSize: "12px",
                      }}
                    >
                      {isCreateTemplate
                        ? t("onlyDocxSupported")
                        : t("orDragAndDrop")}
                    </Typography>
                    {isUploading && (
                      <ProgressBar
                        progress={uploadProgress}
                        isUploading={isUploading}
                      />
                    )}
                    {rawFileUploaded && !isUploading && (
                      <Typography
                        style={{
                          color: "#059669",
                          fontSize: "12px",
                          marginTop: "8px",
                        }}
                      >
                        Uploaded: {rawFileUploaded.name} (
                        {(rawFileUploaded.size / (1024 * 1024)).toFixed(2)} MB)
                      </Typography>
                    )}
                    {showUploadedFileName && (
                      <Typography
                        style={{
                          color: "#059669",
                          fontSize: "12px",
                          marginTop: "8px",
                        }}
                      >
                        {showUploadedFileName}
                      </Typography>
                    )}
                    {fileError && (
                      <Typography
                        style={{
                          color: "#ef4444",
                          fontSize: "12px",
                          marginTop: "8px",
                        }}
                      >
                        {fileError}
                      </Typography>
                    )}
                  </Card>
                )}
                {errors.file && (
                  <Typography
                    style={{
                      color: "#ef4444",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.file}
                  </Typography>
                )}
              </Box>
              {editDocumentID && (
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e5e7eb",
                    marginTop: "-10px",
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Switch
                      checked={formState.DocumentIsActive}
                      onChange={() =>
                        setFormState({
                          ...formState,
                          DocumentIsActive: !formState.DocumentIsActive,
                        })
                      }
                      sx={{
                        "& .MuiSwitch-thumb": {
                          backgroundColor: formState.DocumentIsActive
                            ? "#10b981"
                            : "#d1d5db",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor: formState.DocumentIsActive
                            ? "#a7f3d0"
                            : "#e5e7eb",
                        },
                      }}
                    />
                    <Box>
                      <Typography variant="body1">
                        {t("documentStatus")}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: "#6b7280", fontSize: "12px" }}
                      >
                        {t("changeDocumentStatus")}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    style={{
                      color: formState.DocumentIsActive ? "#059669" : "#dc2626",
                      backgroundColor: formState.DocumentIsActive
                        ? "#d1fae5"
                        : "#fee2e2",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {formState.DocumentIsActive ? t("active") : t("inactive")}
                  </Typography>
                </Box>
              )}
              {!(selectedDocumentType === "create-blank" && !isTemplate) &&
                !isUploading &&
                previewUrl && (
                  <Box style={{ maxHeight: "200px", overflow: "auto" }}>
                    <FilePreviewer
                      fileUrl={previewUrl}
                      isUploading={isUploading}
                      onSave={handleSaveFromFilePreviewer}
                      riskAndComplienceString={riskAndComplienceString}
                    />
                  </Box>
                )}

              {!IsAttributeDataFetching && (
                <Box>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                      marginTop: "-10px",
                    }}
                  >
                    <Typography variant="h8">
                      {t("documentExpiryDate")}
                      {!formState?.IsSkipDocumentExpiry && (
                        <span style={{ color: "#ef4444", marginLeft: "2px" }}>
                          *
                        </span>
                      )}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formState?.IsSkipDocumentExpiry || false}
                          onChange={(e) => {
                            if (!selectedAttribute?.ElementAttributeTypeID) {
                              setFormState((prevState) => ({
                                ...prevState,
                                IsSkipDocumentExpiry: e.target.checked,
                                DocumentExpiry: e.target.checked
                                  ? null
                                  : prevState.DocumentExpiry,
                              }));
                            }
                          }}
                          size="small"
                          sx={{ color: "#6366f1" }}
                          disabled={!!selectedAttribute?.ElementAttributeTypeID}
                        />
                      }
                      label={
                        <Typography
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            marginTop: "8px",
                          }}
                        >
                          {t("skip_date")}
                        </Typography>
                      }
                      labelPlacement="start"
                      sx={{ margin: 0 }}
                    />
                  </Box>
                  <CustomTextField
                    type="date"
                    value={formState?.DocumentExpiry || ""}
                    fullWidth
                    size="small"
                    placeholder="YYYY-MM-DD"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                      readOnly: !!selectedAttribute?.ElementAttributeTypeID,
                    }}
                    disabled={
                      formState?.IsSkipDocumentExpiry ||
                      !formState?.ElementAttributeTypeID ||
                      !!selectedAttribute?.ElementAttributeTypeID
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor:
                          selectedAttribute?.ElementAttributeTypeID
                            ? "#f3f4f6"
                            : "#ffffff",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                      },
                    }}
                    onChange={(e) => {
                      if (!selectedAttribute?.ElementAttributeTypeID) {
                        setFormState((prevState) => ({
                          ...prevState,
                          DocumentExpiry: e.target.value,
                          IsSkipDocumentExpiry: false,
                        }));
                      }
                    }}
                  />
                  {errors.documentExpiry && (
                    <Typography
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {errors.documentExpiry}
                    </Typography>
                  )}
                  {selectedAttribute?.ElementAttributeTypeID && (
                    <Typography
                      style={{
                        color: "#6b7280",
                        fontSize: "11px",
                        marginTop: "4px",
                        fontStyle: "italic",
                      }}
                    >
                      {t(
                        "This field is set from the attribute and cannot be changed"
                      )}
                    </Typography>
                  )}
                </Box>
              )}
              <Box sx={{ marginTop: "-16px" }}>
                <Typography variant="h8">{t("DocumentReadingTime")}</Typography>
                <Box
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    type="number"
                    value={formState?.ReadingTimeValue || ""}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        ReadingTimeValue: e.target.value,
                      })
                    }
                    placeholder={t("EnterTimePlaceholder")}
                    size="small"
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  />
                  <FormControl size="small">
                    <Select
                      value={formState?.ReadingTimeUnit || "minutes"}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          ReadingTimeUnit: e.target.value,
                        })
                      }
                      sx={{
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <MenuItem value="minutes">{t("Minutes")}</MenuItem>
                      <MenuItem value="hours">{t("Hours")}</MenuItem>
                      <MenuItem value="days">{t("Days")}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box>
                <Typography variant="h8">{t("Co-Owners")}</Typography>

                <Autocomplete
                  multiple
                  size="small"
                  disabled
                  options={processOwnerList || []}
                  getOptionLabel={(option) => option?.UserName || ""}
                  isOptionEqualToValue={(option, value) =>
                    option?.UserID === value
                  }
                  value={(processOwnerList || []).filter((user) =>
                    formState?.CoOwnerUserID?.includes(user.UserID)
                  )}
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => {
                      return (
                        <Chip
                          key={option.UserID}
                          label={option.UserName}
                          {...getTagProps({ index })}
                          style={{
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            fontSize: "11px",
                            height: "24px",
                            fontWeight: "normal",
                          }}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Choose co-owners"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "6px",
                          fontSize: "13px",
                        },
                      }}
                    />
                  )}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  marginTop: "-10px",
                }}
              >
                {/* <FormControl sx={{ flex: 1 }}>
                  <FormLabel
                    
                  >
                    {t("EscalationType")}
                  </FormLabel>
                  <Select
                    size="small"
                    value={formState.EscalationType || ""}
                    disabled
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <MenuItem value="Hours">{t("Hours")}</MenuItem>
                    <MenuItem value="Days">{t("Days")}</MenuItem>
                    <MenuItem value="Weeks">{t("Weeks")}</MenuItem>
                    <MenuItem value="Minutes">{t("Minutes")}</MenuItem>
                  </Select>
                </FormControl> */}
                {/* <FormControl sx={{ flex: 1 }}>
                  <FormLabel
                    style={{
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    {t("EscalationAfter")}
                  </FormLabel>
                  <TextField
                    size="small"
                    type="number"
                    value={formState.EscalationAfter || ""}
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                      },
                    }}
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                  />
                </FormControl> */}
              </Box>

              {IsAttributeDataFetching && (
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "40px",
                  }}
                >
                  <CircularProgress size={32} />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        {isUploadingToAI && (
          <Typography
            variant="body2"
            style={{
              color: "#64748b",
              fontWeight: "500",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            File Uploading...
          </Typography>
        )}
        <DialogActions
          className="actions-wrapper"
          style={{
            padding: "20px 24px",
            backgroundColor: "#ffffff",
            borderTop: "1px solid #e5e7eb",
            gap: "12px",
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              handleClose();
              localStorage.removeItem("selectedDocumentType");
            }}
            style={{
              height: "44px",
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: "500",
              fontSize: "14px",
              borderColor: "#d1d5db",
              color: "#374151",
              cursor:
                isSubmittingDocument || isPublishingDocument || isUploading
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.2s ease",
              backgroundColor: "#ffffff",
            }}
            disabled={
              isSubmittingDocument || isPublishingDocument || isUploading
            }
            onMouseEnter={(e) => {
              if (
                !(isSubmittingDocument || isPublishingDocument || isUploading)
              ) {
                e.target.style.backgroundColor = "#f9fafb";
                e.target.style.borderColor = "#9ca3af";
              }
            }}
            onMouseLeave={(e) => {
              if (
                !(isSubmittingDocument || isPublishingDocument || isUploading)
              ) {
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.borderColor = "#d1d5db";
              }
            }}
          >
            {t("cancel")}
          </Button>

          {/* Show Next button for create-from-template, otherwise show Save/Publish buttons */}
          {selectedDocumentType === "create-from-template" ? (
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              onClick={handleNextButtonClick}
              style={{
                textTransform: "none",
                height: "44px",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "14px",
                backgroundColor: bgColor,
                opacity: isNextLoading ? 0.7 : 1,
                pointerEvents: isNextLoading ? "none" : "auto",
              }}
              disabled={isNextLoading}
            >
              {isNextLoading ? "Loading..." : "Next"}
            </Button>
          ) : selectedDocumentType === "Create Template" ||
            localStorage.getItem("selectedContentName") ===
              "Create Template" ? (
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              onClick={handleSaveTemplate}
              style={{
                textTransform: "none",
                height: "44px",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "14px",
                backgroundColor: bgColor,
                opacity: isNextLoading ? 0.7 : 1,
                pointerEvents: isNextLoading ? "none" : "auto",
              }}
              disabled={
                isNextLoading ||
                !formState?.ElementAttributeTypeID ||
                !uploadedFile
              }
            >
              {isNextLoading ? t("Creating...") : t("next")}
            </Button>
          ) : selectedDocumentType === "create-blank" || isCreateTemplate ? (
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              onClick={() => {
                handleNextButtonClick();
                if (editDocumentID) {
                  localStorage.removeItem("selectedDocumentType");
                }
              }}
              style={{
                textTransform: "none",
                height: "44px",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "14px",
                backgroundColor: bgColor,
                opacity: isNextLoading ? 0.7 : 1,
                pointerEvents: isNextLoading ? "none" : "auto",
              }}
              disabled={isNextLoading}
            >
              {isNextLoading ? "Loading..." : "Next"}
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={onCreateDocumentHandler}
                style={{
                  textTransform: "none",
                  height: "44px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                  backgroundColor:
                    isSubmittingDocument ||
                    !formState?.ElementAttributeTypeID ||
                    isPublishingDocument ||
                    isUploading ||
                    !formState?.SelfApproved
                      ? "#bdbdbd"
                      : bgColor,
                }}
                disabled={
                  isSubmittingDocument ||
                  !formState?.ElementAttributeTypeID ||
                  isPublishingDocument ||
                  isUploading ||
                  !formState?.SelfApproved
                }
              >
                {isPublishingDocument ? t("publishing") : t("publishButton")}
              </Button>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={onCreateDocumentHandler}
                style={{
                  textTransform: "none",
                  height: "44px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                  backgroundColor:
                    isSubmittingDocument ||
                    formState?.SelfApproved ||
                    isPublishingDocument ||
                    isUploading
                      ? "#bdbdbd"
                      : bgColor,
                }}
                disabled={
                  isSubmittingDocument ||
                  formState?.SelfApproved ||
                  isPublishingDocument ||
                  isUploading
                }
              >
                {showTheConfigure ? t("Configure") : t("saveButton")}
              </Button>
            </>
          )}
          {isTemplateSelectorOpen && (
            <TemplateSelector
              onTemplateSave={(templateData) => {
                setIsTemplateSelectorOpen(false);
              }}
              apiResponseData={
                selectedDocumentTypes !== "Create Template"
                  ? fileURL
                  : templateSelectorData
              }
              onClose={() => setIsTemplateSelectorOpen(false)}
              openEditorDirectly={true}
              documentName={formState.DocumentName}
              documentDescription={formState.DocumentDescription}
              documentOwner={owner}
              newDocumentId={templateID || newDocumentId}
              fileURL={uploadedFile}
              createTemplateAndBlankDocumentResponse={templateSelectorData}
              ThreeDotClickedData={ThreeDotClickedData}
              presistStore={presistStore}
            />
          )}
        </DialogActions>
      </Box>
      {selectedDocumentTypes !== "Create Template" && (
        <DocumentTypeModal
          open={documentTypeModalOpen}
          onClose={() => setDocumentTypeModalOpen(false)}
          onCloseAll={() => {
            setDocumentTypeModalOpen(false);
            handleClose();
          }}
          onSelectOption={handleDocumentTypeSelect}
        />
      )}
    </>
  );
};

export default Newdocuments;

Newdocuments.propTypes = {
  open: PropTypes.bool.isRequired,
  handleNext: PropTypes.func.isRequired,
  onCreateDocument: PropTypes.func.isRequired,
  isDocumentModuleListFetching: PropTypes.bool.isRequired,
  documentDraftVersion: PropTypes.array.isRequired,
  processOwnerList: PropTypes.array.isRequired,
  endUserList: PropTypes.array.isRequired,
  riskAndComplienceString: PropTypes.string.isRequired,
  editDocumentID: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
};
