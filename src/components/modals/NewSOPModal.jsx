import {
  FormControl,
  FormGroup,
  FormLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  Chip,
  Autocomplete,
  Button,
  Modal,
  Checkbox,
  CircularProgress,
  styled,
  InputLabel,
  Divider,
  Grid,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import icon from "../../assets/svg/sopsModal/modalIcon.svg";
import {
  createSopModule,
  listProcessOwnerAndEndUser,
  listSopModuleDraftVersion,
  listProcessOwner,
  viewSopModuleDraft,
  isTemplateSopModuleList,
  viewTemplateSopModule,
} from "../../services/sopModules/SopModule";
import { useSelector, useDispatch } from "react-redux";
import { GetElementsCategory } from "../../store/elements/action";
import notify from "../../assets/svg/utils/toast/Toast";
import { CloudUpload, CloudUploadOutlined } from "@mui/icons-material";
import { formatUserName, validateAndSanitizeInputs } from "../../utils";
import SopTemplateModal from "./SopTemplateModal";
import { useNavigate } from "react-router";
import { setSOPflowModalData } from "../../store/FlowWithSOP/flowWithSop";
import { useTranslation } from "react-i18next";
import { frontendState } from "../../store/presist/action";
import PropTypes, { element } from "prop-types";
import {
  listElementAttributeType,
  publishedDocumentList,
  ViewElementAttributeType,
} from "../../services/documentModules/DocumentsModule";
import moment from "moment";
import { useTheme } from "@mui/styles";
import { validateInput } from "../../utils/securityUtils";
import errorHandler from "../../utils/errorHandler";

// Update style definitions for better consistency
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 1400,
  height: "95vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: 0,
  borderRadius: "16px",
  outline: "none",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const contentStyle = {
  padding: "20px 24px",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
};

const scrollableContent = {
  flex: 1,
  overflowY: "auto",
  paddingRight: "8px",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#c1c1c1",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#a8a8a8",
  },
};

const labelStyle = {
  marginBottom: "8px",
  fontWeight: 600,
  fontSize: "14px",
  color: "#374151",
  display: "inline-flex",
  alignItems: "center",
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CustomTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontWeight: 400,
    fontSize: "14px",
  },
  "& .MuiInputBase-root": {
    height: "40px",
  },
  "& .MuiInputBase-multiline": {
    height: "auto",
  },
});

const StyledFormGroup = styled(FormGroup)({
  marginBottom: "16px",
});

const NewSOPModal = ({
  open,
  onClose,
  editSOPID = null,
  isSOPWithWorkFlow,
  onDataUpdate,
  initialValues,
  selectedAttributeTypeObj,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const modelerRef = useRef(null);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const bgColor = theme.palette.primary.main;
  const [sopID, setSopID] = useState(editSOPID);
  const [sopDraft, setSopDraft] = useState({});
  const [sopName, setSopName] = useState("");
  const [sopDescription, setSopDescription] = useState("");
  const [sopStatus, setSopStatus] = useState(true);
  const [tags, setTags] = useState([]);
  const [SelfApproved, setSelfApproved] = useState(false);
  const [checkers, setCheckers] = useState([]);
  const [escalationPersons, setEscalationPersons] = useState([]);
  const [escalationTimeUnit, setEscalationTimeUnit] = useState("");
  const [escalationTimeValue, setEscalationTimeValue] = useState("");
  const selectedOwners = localStorage.getItem("user_id");
  const [processOwnerAndEndUserList, setProcessOwnerAndEndUserList] = useState(
    []
  );
  const [needAcceptance, setNeedAcceptance] = useState(false);
  const [isSubmittingDocument, setIsSubmittingDocument] = useState(false);
  const [isPublishingDocument, setIsPublishingDocument] = useState(false);
  const [isDraftFetching, setIsDraftFetching] = useState(false);
  const [screen, setScreen] = useState("first");
  const [xml, setXml] = useState("");
  const selectedElementRef = useRef({});
  const [SOPExpiry, setSOPExpiry] = useState(null);
  const [isSkipSOPExpiry, setIsSkipSOPExpiry] = useState(false);
  const [processOwnerList, setProcessOwnerList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [errors, setErrors] = useState({});
  const [isTemplate, setIsTemplate] = useState(false);
  const [sopTemplates, setSopTemplates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSopName, setSelectedSopName] = useState("");
  const [BPMNDaigarm, setBPMNDaigarm] = useState({});
  const [selectedDocument, setSelectedDocument] = useState({});
  const [setTempXml] = useState(null);
  const [attributeTypeList, setAttributeTypeList] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [isAttributeDataFetching, setIsAttributeDataFetching] = useState(false);
  const [selectedAttributeType, setSelectedAttributeType] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [publishedDocs, setPublishedDocs] = useState([]);
  const [CoOwnerUserID, setCoOwnerUserID] = useState(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  const [image, setImage] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const owner = `${userData?.UserName}, (${userData?.UserFirstName} ${userData?.UserLastName})`;
  const [needAcceptanceFromEndUsers, setNeedAcceptanceFromEndUsers] =
    useState(false);

    console.log("Image Base64:", imageBase64);

  const headerStyle = {
    background: bgColor || "linear-gradient(to top, #2C64FF, #4A90E2)",
    padding: "20px 24px",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    flexShrink: 0,
    "& .MuiTypography-h6": {
      color: "#FFFFFF",
    },
    "& .MuiTypography-body2": {
      color: "#FFFFFF",
      opacity: 0.9,
    },
  };

  const [payload, setPayload] = useState({
    ModuleTypeID: presistStore?.ModuleTypeID,
    ContentID: presistStore?.ContentID,
    IsPagination: false,
    Search: "",
  });
  const navigate = useNavigate();
  const isReactFlow = localStorage.getItem("IsReactFlow");

  useEffect(() => {
    if (isReactFlow) {
      localStorage.setItem(
        "isSOPWithWorkFlow",
        JSON.stringify(isSOPWithWorkFlow) || false
      );
    } else {
      localStorage.setItem(
        "isSOPWithWorkFlow",
        JSON.stringify(isSOPWithWorkFlow) || false
      );
    }
  }, [isReactFlow, isSOPWithWorkFlow]);

  useEffect(() => {
    const fetchData = async () => {
      const data = {};
      try {
        const response = await isTemplateSopModuleList(data);
        setSopTemplates(response?.data?.data?.sopTemplates || []);
      } catch (error) {
        console.error("Error fetching isTemplateSopModuleList:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (sopDraft?.SOPDocID && publishedDocs.length > 0) {
      const matchingDoc = publishedDocs.find(
        (doc) => doc?.DocumentID === sopDraft?.SOPDocID
      );
      setSelectedDocument(matchingDoc || null);
    }
  }, [sopDraft, publishedDocs]);

  const fetchSopDraftData = async (sopID = null) => {
    if (!sopID) {
      setSopID(null);
      setSopName("");
      setSopDescription("");
      setSopStatus(false);
      setTags([]);
      setSelfApproved(false);
      setCheckers([]);
      setEscalationPersons([]);
      setEscalationTimeUnit("");
      setEscalationTimeValue("");
      setSelectedDocument(null);
      setCoOwnerUserID(null);
    } else {
      const data = {
        SOPID: sopID,
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      };
      setIsDraftFetching(true);
      try {
        const response = await viewSopModuleDraft(data);
        if (response?.status === 200) {
          const sopDraft = response?.data?.data?.sopModuleDraft;
          setSopDraft(sopDraft);
          localStorage.setItem("IsReactFlow", sopDraft?.IsReactFlow);
          const checkers = sopDraft?.Checkers?.map(
            (checker) => checker?.UserID
          );
          const escalations = sopDraft?.EscalationPersons?.map(
            (checker) => checker?.UserID
          );
          const approvers = sopDraft?.Approvers?.map(
            (approver) => approver?.UserID
          );

          const tags = sopDraft?.SOPTags ? sopDraft?.SOPTags.split(",") : [];
          if (response?.data?.data?.sopModuleDraft) {
            setSopName(sopDraft?.SOPName);
            setSopDescription(sopDraft?.SOPDescription);
            setSopStatus(sopDraft?.SOPIsActive);
            setTags(tags);
            setSelfApproved(sopDraft?.SelfApproved);
            setCheckers([...new Set(checkers)]);
            setEscalationPersons([...new Set(escalations)]);
            setEscalationTimeUnit(sopDraft?.EscalationType);
            setEscalationTimeValue(sopDraft?.EscalationAfter);
            setApprovers([...new Set(approvers)]);
            setIsTemplate(sopDraft?.IsTemplate);
            setCoOwnerUserID(sopDraft?.CoOwnerUserID || null);
            setSelectedAttributeType(sopDraft?.ElementAttributeTypeID);
            if (sopDraft?.SOPExpiry === null || sopDraft?.SOPExpiry === "") {
              setIsSkipSOPExpiry(true);
            } else {
              setIsSkipSOPExpiry(false);
            }
          }
          if (
            sopDraft?.ElementAttributeTypeID !== null &&
            sopDraft?.SOPStatus == "InProgress"
          ) {
            await handleAttributeTypeChange({
              ElementAttributeTypeID: sopDraft?.ElementAttributeTypeID,
            });
          }
        }
      } catch (error) {
        notify("error", error?.response?.data?.message);
      } finally {
        setIsDraftFetching(false);
      }
    }
  };

  const handleCheckboxIsTemplate = (event) => {
    setIsTemplate(event.target.checked);
  };

  const handleTagDelete = (tagToDelete) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  const validate = () => {
    let newErrors = {};
    if (!sopName) {
      newErrors.sopName = t("errors.SopNameRequired");
    }
    if (selectedOwners.length === 0) {
      newErrors.selectedOwners = t("errors.OwnerRequired");
    }
    if (!SelfApproved) {
      if (checkers.length === 0) {
        newErrors.checkers = t("errors.CheckerRequired");
      }
      if (escalationPersons.length === 0) {
        newErrors.escalationPersons = t("errors.EscalationPersonRequired");
      }
      if (!escalationTimeUnit) {
        newErrors.escalationTimeUnit = t("errors.EscalationTimeUnitRequired");
      }
      if (
        !escalationTimeValue ||
        isNaN(escalationTimeValue) ||
        escalationTimeValue <= 0
      ) {
        newErrors.escalationTimeValue = t("errors.EscalationValueRequired");
      }
    }
    if (!isSkipSOPExpiry && !SOPExpiry) {
      newErrors.SOPExpiry = t("errors.SOPExpiryDateRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onCreateDocumentHandler = async () => {
    if (!validateInput(sopName)) {
      setErrors((prev) => ({
        ...prev,
        sopName: "Invalid input detected. Please enter a valid SOP name.",
      }));
      errorHandler.addSecurityError(sopName, "sopName");
      return;
    }

    if (sopDescription && !validateInput(sopDescription)) {
      setErrors((prev) => ({
        ...prev,
        sopDescription:
          "Invalid input detected. Please enter a valid description.",
      }));
      errorHandler.addSecurityError(sopDescription, "sopDescription");
      return;
    }

    if (validate()) {
      const inputs = [
        sopName,
        sopDescription,
        tags.join(""),
        escalationTimeValue,
      ];
      if (validateAndSanitizeInputs(inputs)) {
        if (SelfApproved) {
          setIsPublishingDocument(true);
        } else {
          setIsSubmittingDocument(true);
        }
        const ModuleTypeID = presistStore?.ModuleTypeID;
        const ContentID = presistStore?.ContentID;
        if (!ModuleTypeID || !ContentID) {
          return notify("error", "Please select a module and content type");
        }
        let shapeList = [];
        let selectedElements = [];
        if (selectedElementRef.current) {
          for (const [k, v] of Object.entries(selectedElementRef.current)) {
            shapeList.push({
              SopShapeID: k,
              AttachmentIcon: false,
              HeaderProperties: null,
              FooterProperties: null,
            });
            selectedElements.push(...v);
          }
        }
        const data = {
          ModuleTypeID,
          ContentID,
          SOPID: sopID,
          SOPName: sopName,
          SOPDescription: sopDescription,
          SOPOwner: [selectedOwners],
          SOPIsActive: sopStatus,
          SOPTags: tags.join(","),
          SelfApproved: SelfApproved,
          SOPXMLElement: xml,
          Checker: checkers,
          StakeHolder: [],
          EscalationPerson: escalationPersons,
          Approver: approvers,
          EscalationType: escalationTimeUnit,
          EscalationAfter: escalationTimeValue,
          SOPExpiry: isSkipSOPExpiry ? null : SOPExpiry,
          shapeList,
          selectedElements,
          NeedAcceptance: needAcceptance,
          IsTemplate: isTemplate,
          CTQImageURL: imageBase64,
        };
        try {
          const response = await createSopModule(data);
          if (response?.status === 201) {
            notify("success", response?.data?.message);
            onClose();
            dispatch(
              GetElementsCategory({
                ModuleTypeID,
                ParentContentID: ContentID,
              })
            );
          }
        } catch (error) {
          notify("error", error?.response?.data?.message);
        } finally {
          if (SelfApproved) {
            setIsPublishingDocument(false);
          } else {
            setIsSubmittingDocument(false);
          }
        }
      } else {
        notify("error", "Suspicious input detected!");
      }
    }
  };

  const onNextScreenHandler = async () => {
    if (!sopID) {
      dispatch(
        setSOPflowModalData({
          ModuleTypeID: presistStore?.ModuleTypeID,
          ContentID: presistStore?.ContentID,
          SOPID: null,
          SOPName: sopName,
          SOPDescription: sopDescription,
          SOPIsActive: sopStatus,
          SelfApproved: SelfApproved,
          SOPOwner: [selectedOwners],
          IsTemplate: isTemplate,
          SOPDocID: selectedDocument?.DocumentID || null,
          ElementAttributeTypeID: selectedAttributeType,
          CoOwnerUserID: CoOwnerUserID,
        })
      );
      dispatch(
        frontendState({
          ModuleTypeID: presistStore?.ModuleTypeID,
          ContentID: presistStore?.ContentID,
          SOPID: null,
          SOPName: sopName,
          SOPIsActive: sopStatus,
          SelfApproved: SelfApproved,
          SOPOwner: [selectedOwners],
          IsTemplate: isTemplate,
          EscalationType: escalationTimeUnit,
          EscalationAfter: escalationTimeValue,
          SOPDescription: sopDescription,
          SOPExpiry,
          isSkipSOPExpiry,
          checkers,
          approvers,
          escalationPersons,
          tags,
          SOPDocID: selectedDocument?.DocumentID || null,
          ElementAttributeTypeID: selectedAttributeType,
          CoOwnerUserID: CoOwnerUserID,
          CTQImageURL: imageBase64,
        })
      );
      if (validate()) {
        const inputs = [
          sopName,
          sopDescription,
          tags.join(""),
          escalationTimeValue,
        ];
        if (validateAndSanitizeInputs(inputs)) {
          onClose();
        } else {
          notify("error", "Suspicious input detected!");
        }
      }
    } else {
      dispatch(
        setSOPflowModalData({
          ModuleTypeID: sopDraft?.ModuleTypeID,
          ContentID: sopDraft?.ContentID,
          SOPID: sopID,
          SOPName: sopDraft?.SOPName,
          SOPIsActive: sopDraft?.sopStatus,
          SelfApproved: sopDraft?.SelfApproved,
          SOPDescription: sopDraft?.sopDescription,
          SOPOwner: [selectedOwners],
          IsTemplate: sopDraft?.isTemplate,
          SOPDocID: selectedDocument?.DocumentID || null,
          ElementAttributeTypeID: selectedAttributeType,
          CoOwnerUserID: CoOwnerUserID,
        })
      );
      const data = {
        ...sopDraft,
        ModuleTypeID: sopDraft?.ModuleTypeID,
        ContentID: sopDraft?.ContentID,
        SOPID: sopID,
        SOPName: sopName,
        SOPDescription: sopDescription,
        SOPIsActive: sopStatus,
        SelfApproved: SelfApproved,
        SOPOwner: [selectedOwners],
        IsTemplate: isTemplate,
        EscalationPerson: escalationPersons,
        EscalationType: escalationTimeUnit,
        EscalationAfter: escalationTimeValue,
        SOPExpiry,
        isSkipSOPExpiry,
        checkers,
        tags,
        SOPDocID: selectedDocument?.DocumentID || null,
        ElementAttributeTypeID: selectedAttributeType,
        CoOwnerUserID: CoOwnerUserID,
      };
      dispatch(frontendState(data));
      navigate("/sop-creation");
    }
  };

  useEffect(() => {
    // setIsDocumentModuleListFetching(true);
    listSopModuleDraftVersion({
      ModuleTypeID: presistStore?.ModuleTypeID,
      ContentID: presistStore?.ContentID,
    })
      .then((response) => {
        if (response?.status === 200) {
          // setDocumentDraftVersion(response?.data?.data?.sopModuleList);
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      })
      .finally(() => {
        // setIsDocumentModuleListFetching(false);
      });
    listProcessOwnerAndEndUser()
      .then((response) => {
        if (response?.status === 200) {
          setProcessOwnerAndEndUserList(response?.data?.data?.userList);
        }
      })
      .catch((error) => {
        notify("error", error?.response?.data?.message);
      });
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
    if (editSOPID) {
      // setSelectedVersion(editSOPID);
      fetchSopDraftData(editSOPID);
      const timer = setTimeout(() => {
        fetchSopDraftData(editSOPID);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [editSOPID]);

  const handleXMLFile = (files) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        await modelerRef.current.importXML(e.target.result);
        setXml(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
  };

  const handleClick = async (SOPID, SOPDraftID, sopName) => {
    const requestData = {
      SOPID,
      SOPDraftID,
    };
    try {
      const response = await viewTemplateSopModule(requestData);
      const newXML = response?.data?.data?.sopTemplate?.SOPXMLElement || "";
      setTempXml(newXML);
      setBPMNDaigarm(response);
      setSelectedSopName(sopName);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchPublishedDocs = async () => {
      setIsLoadingDocs(true);
      try {
        const response = await publishedDocumentList({
          ModuleTypeID: presistStore?.ModuleTypeID,
          ContentID: presistStore?.ContentID,
        });
        setPublishedDocs(response?.data?.data || []);
      } catch (error) {
        notify("error", "Failed to fetch documents");
      } finally {
        setIsLoadingDocs(false);
      }
    };
    fetchPublishedDocs();
  }, [presistStore]);

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
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, [payload]);

  useEffect(() => {
    if (open && initialValues) {
      setSopName(initialValues.sopName || "");
      setSopDescription(initialValues.sopDescription || "");
      if (initialValues.selectedAttributeTypeObj) {
        setSelectedAttributeType(
          initialValues.selectedAttributeTypeObj.ElementAttributeTypeID
        );
      }
    }
  }, [open, initialValues]);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    if (!validateInput(newName)) {
      setErrors((prev) => ({
        ...prev,
        sopName: "Invalid input detected. Please enter a valid SOP name.",
      }));
      errorHandler.addSecurityError(newName, "sopName");
      return;
    }
    setSopName(newName);
    onDataUpdate(newName, undefined, undefined);
  };

  const handleDescriptionChange = (e) => {
    const newDesc = e.target.value;
    if (!validateInput(newDesc)) {
      setErrors((prev) => ({
        ...prev,
        sopDescription:
          "Invalid input detected. Please enter a valid description.",
      }));
      errorHandler.addSecurityError(newDesc, "sopDescription");
      return;
    }
    setSopDescription(newDesc);
    onDataUpdate(undefined, newDesc, undefined);
  };

  const handleAttributeTypeChange = async (newValue) => {
    if (!newValue) return;

    setSelectedAttributeType(newValue.ElementAttributeTypeID);
    onDataUpdate(undefined, undefined, newValue);

    setSOPExpiry(false);
    setSOPExpiry(null);
    setEscalationTimeUnit("");
    setEscalationTimeValue("");
    setApprovers([]);
    setCheckers([]);
    setEscalationPersons([]);
    setIsPublishingDocument(false);
    try {
      setIsAttributeDataFetching(true);
      const response = await ViewElementAttributeType({
        ElementAttributeTypeID: newValue.ElementAttributeTypeID,
      });
      if (response?.status === 200) {
        const { elementAttribute } = response.data.data;
        // Only show error if SelfApproved is false
        if (
          !elementAttribute.SelfApproved &&
          (!elementAttribute.EscalationUsers ||
            elementAttribute.EscalationUsers.length === 0)
        ) {
          notify(
            "error",
            t(
              "There are no Escalation Users for this Attribute Type. You can't select this Attribute Type."
            )
          );
          setSelectedAttributeType(null);
          setIsAttributeDataFetching(false);
          return;
        }
        const ownerId = selectedOwners;
        const reviewers = elementAttribute.Reviewers || [];
        const approvers = elementAttribute.Approvers || [];
        const stakeholders = elementAttribute.Stakeholders || [];
        if (
          reviewers.includes(ownerId) ||
          approvers.includes(ownerId) ||
          stakeholders.includes(ownerId)
        ) {
          notify(
            "error",
            t(
              "Please select another Attribute Type. You can't create with this Attribute Type."
            )
          );
          setSelectedAttributeType(null);
          setIsAttributeDataFetching(false);
          return;
        }
        setIsSkipSOPExpiry(!elementAttribute.IsExpiry);
        setSOPExpiry(
          elementAttribute?.ExpiryDate
            ? moment(elementAttribute.ExpiryDate).format("YYYY-MM-DD")
            : null
        );
        setEscalationTimeUnit(elementAttribute.EscalationType || "");
        setEscalationTimeValue(elementAttribute.EscalationAfter || "");
        setApprovers([...new Set(elementAttribute.Approvers || [])]);
        setCheckers([...new Set(elementAttribute.Reviewers || [])]);
        setEscalationPersons([
          ...new Set(elementAttribute.EscalationUsers || []),
        ]);
        setSelfApproved(elementAttribute?.SelfApproved || false);
        setIsPublishingDocument(elementAttribute.IsPublishing || false);
        setCoOwnerUserID(elementAttribute?.CoOwnerUserID || []);
      } else {
        notify("error", response.data.message || "Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error fetching edit data:", error);
    } finally {
      setIsAttributeDataFetching(false);
    }
  };

  useEffect(() => {
    if (selectedAttributeType !== null) {
      setIsAttributeDataFetching(true);
      ViewElementAttributeType({
        ElementAttributeTypeID: selectedAttributeType,
      })
        .then((response) => {
          if (response?.status === 200) {
            const { elementAttribute } = response.data.data;
            setSelectedAttribute(elementAttribute);
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
  }, [selectedAttributeType]);

  useEffect(() => {
    if (selectedAttributeTypeObj?.ElementAttributeTypeID) {
      // Call the same logic as manual selection
      ViewElementAttributeType({
        ElementAttributeTypeID: selectedAttributeTypeObj.ElementAttributeTypeID,
      })
        .then((response) => {
          if (response?.status === 200) {
            const { elementAttribute } = response.data.data;
            // Set reviewers and approvers from API response
            setCheckers(elementAttribute.Reviewers || []);
            setApprovers(elementAttribute.Approvers || []);
            // ...set other fields as needed...
          }
        })
        .catch(() => {
          setCheckers([]);
          setApprovers([]);
        });
    }
  }, [selectedAttributeTypeObj?.ElementAttributeTypeID]);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ✅ Allow only image types
  if (!file.type.startsWith("image/")) {
    alert(
      "Please upload a valid image file (jpg, png, jpeg, gif, webp, etc.)"
    );
    return;
  }

  // ✅ Restrict size to 5 MB
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    alert("File size exceeds 5 MB. Please upload a smaller image.");
    return;
  }

  // ✅ Convert to Base64 and set preview
  const reader = new FileReader();
  reader.onload = (event) => {
    const base64String = event.target.result;
    
    // Set both the preview URL and base64 string
    setImage(URL.createObjectURL(file));
    
    // Store base64 string in state or ref for payload
    setImageBase64(base64String);
  };
  reader.onerror = (error) => {
    console.error("Error converting image to Base64:", error);
    alert("Error processing image. Please try again.");
  };
  reader.readAsDataURL(file);
};

  return (
    <Modal open={open} size={"md"}>
      {screen === "first" ? (
        <Box sx={style}>
          {/* Header */}
          <Box sx={{ ...headerStyle, bgColor }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <img src={icon} alt="logo" />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "18px", fontWeight: 600, lineHeight: 1.3 }}
                >
                  {isSOPWithWorkFlow
                    ? "SOP with Work Flow"
                    : t("sop_management")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textTransform: "none", fontSize: "14px" }}
                >
                  {t("add_edit_sop")}
                </Typography>
              </Box>
            </Box>
            {editSOPID && (
              <Button
                onClick={onClose}
                sx={{
                  position: "absolute",
                  right: "16px",
                  top: "16px",
                  minWidth: "auto",
                  p: 1,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Typography fontSize="24px" fontWeight="300">
                  ×
                </Typography>
              </Button>
            )}
          </Box>

          {/* Content */}
          <Box sx={contentStyle}>
            {isDraftFetching && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 2,
                }}
              >
                <CircularProgress size={28} />
                <Typography variant="body2" ml={2}>
                  {t("fetching_data")}
                </Typography>
              </Box>
            )}

            <Box sx={scrollableContent}>
              {/* Two Column Layout */}
              <Grid container spacing={3} alignItems="flex-start">
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                  {/* Attribute Type */}
                  <StyledFormGroup>
                    <FormLabel sx={labelStyle}>
                      {t("attribute type")}
                      <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    </FormLabel>
                    {attributeTypeList?.length > 0 && (
                      <Autocomplete
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
                              selectedAttributeType
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleAttributeTypeChange(newValue);
                        }}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            variant="outlined"
                            placeholder={t("selectAttributeType")}
                          />
                        )}
                      />
                    )}
                  </StyledFormGroup>

                  {/* SOP Name */}
                  <StyledFormGroup>
                    <FormLabel sx={labelStyle}>
                      {t("sop_name")}
                      <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    </FormLabel>
                    <CustomTextField
                      value={sopName}
                      onChange={handleNameChange}
                      fullWidth
                      disabled={!selectedAttributeType}
                      placeholder={t("enter_sop_name")}
                      variant="outlined"
                    />
                    {errors.sopName && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {errors.sopName}
                      </Typography>
                    )}
                  </StyledFormGroup>

                  {/* Owner */}
                  <StyledFormGroup>
                    <FormLabel sx={labelStyle}>
                      {t("owner")}{" "}
                      <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    </FormLabel>
                    <CustomTextField
                      value={owner}
                      disabled={true}
                      variant="outlined"
                      fullWidth
                    />
                  </StyledFormGroup>

                  {/* SOP Tags
                  <StyledFormGroup>
                    <FormLabel sx={labelStyle}>{t("sop_tags")}</FormLabel>
                    <Autocomplete
                      multiple
                      freeSolo
                      options={[]}
                      value={tags}
                      disabled={!selectedAttributeType}
                      onChange={(event, newTags) => setTags(newTags)}
                      renderTags={(value, getTagProps) =>
                        value.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            {...getTagProps({ index })}
                            onDelete={() => handleTagDelete(tag)}
                            size="small"
                            sx={{ mr: 0.5, my: 0.25 }}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          variant="outlined"
                          placeholder={t("enterTag")}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === ",") {
                              event.preventDefault();
                              const newTag = event.target.value.trim();
                              if (newTag && !tags.includes(newTag)) {
                                setTags((prevTags) => [...prevTags, newTag]);
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
                  </StyledFormGroup> */}
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={6}>
                  {/* SOP Description */}
                  <StyledFormGroup>
                    <FormLabel sx={labelStyle}>
                      {t("sop_description")}
                    </FormLabel>
                    <CustomTextField
                      multiline
                      rows={3}
                      placeholder={t("enter_sop_description")}
                      value={sopDescription}
                      onChange={handleDescriptionChange}
                      variant="outlined"
                      fullWidth
                      disabled={!selectedAttributeType}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "auto",
                          minHeight: "96px",
                        },
                      }}
                    />
                  </StyledFormGroup>

                  {/* Source Documents */}
                  <StyledFormGroup>
                    <FormLabel sx={labelStyle}>
                      {t("source documents")}
                    </FormLabel>
                    <Autocomplete
                      options={publishedDocs}
                      loading={isLoadingDocs}
                      disabled={!selectedAttributeType}
                      getOptionLabel={(option) => option.DocumentName || ""}
                      value={selectedDocument}
                      onChange={(event, newValue) => {
                        setSelectedDocument(newValue);
                      }}
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          variant="outlined"
                          placeholder={
                            isLoadingDocs
                              ? t("loading")
                              : t("searchDocumentPlaceholder")
                          }
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isLoadingDocs ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </StyledFormGroup>

                  {/* SOP Status (only for edit mode) */}
                  {editSOPID && (
                    <StyledFormGroup>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          p: 2,
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          backgroundColor: "#F9FAFB",
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Switch
                            checked={sopStatus}
                            onChange={() => setSopStatus(!sopStatus)}
                            size="medium"
                          />
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 500,
                                fontSize: "14px",
                                lineHeight: 1.4,
                              }}
                            >
                              {t("sop_status")}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "12px", color: "#6B7280" }}
                            >
                              {t("change_sop_status")}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: sopStatus ? "#15803D" : "#B91C1C",
                              bgcolor: sopStatus ? "#F0FDF4" : "#FEF2F2",
                              padding: "4px 12px",
                              borderRadius: "16px",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          >
                            {sopStatus ? t("active") : t("inactive")}
                          </Typography>
                        </Box>
                      </Box>
                    </StyledFormGroup>
                  )}
                </Grid>
              </Grid>

              {/* Full Width Sections */}
              {isAttributeDataFetching ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 3,
                  }}
                >
                  <CircularProgress size={24} />
                  <Typography variant="body2" ml={2}>
                    Loading attribute data...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3} sx={{ mt: 0.5 }}>
                  {/* Reviewers Section - Full Width */}
                  <Grid item xs={12} mt={-4}>
                    <StyledFormGroup>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <FormLabel sx={{ ...labelStyle, mb: 0 }}>
                          {t("reviewers")}{" "}
                          <span style={{ color: "red", marginLeft: "2px" }}>
                            {!SelfApproved ? "*" : ""}
                          </span>
                        </FormLabel>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              checked={needAcceptanceFromEndUsers}
                              onChange={(e) =>
                                setNeedAcceptanceFromEndUsers(e.target.checked)
                              }
                              disabled={SelfApproved || !selectedAttributeType}
                              size="small"
                            />
                          }
                          label={
                            <Typography variant="caption">
                              {t("need_acceptance_from_all")}
                            </Typography>
                          }
                          labelPlacement="start"
                          sx={{ mr: 0, ml: 2 }}
                        />
                      </Box>
                      <Autocomplete
                        multiple
                        options={processOwnerList || []}
                        getOptionLabel={(option) => option?.UserName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.UserID === value
                        }
                        disabled={SelfApproved || !selectedAttributeType}
                        value={
                          processOwnerList?.filter((user) =>
                            checkers.includes(user.UserID)
                          ) || []
                        }
                        onChange={(event, newValue) => {
                          const reviewerIds =
                            selectedAttribute?.Reviewers || [];
                          const reviewerUsers = processOwnerList.filter(
                            (user) => reviewerIds.includes(user.UserID)
                          );
                          const mergedUsers = [
                            ...reviewerUsers,
                            ...newValue.filter(
                              (user) => !reviewerIds.includes(user.UserID)
                            ),
                          ];
                          const userIds = mergedUsers.map(
                            (user) => user.UserID
                          );
                          setCheckers(userIds);
                        }}
                        renderTags={(selected, getTagProps) =>
                          selected.map((option, index) => {
                            const isFixed =
                              selectedAttribute?.Reviewers?.includes(
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
                                size="small"
                                sx={{ mr: 0.5, my: 0.25 }}
                                style={
                                  isFixed
                                    ? {
                                        backgroundColor: "#e0e0e0",
                                        fontWeight: "bold",
                                      }
                                    : {}
                                }
                              />
                            );
                          })
                        }
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            variant="outlined"
                            placeholder={t("ChooseUsersPlaceholder")}
                            sx={{
                              "& .MuiInputBase-root": {
                                minHeight: "80px",
                                alignItems: "flex-start",
                                paddingTop: "8px",
                                paddingBottom: "8px",
                              },
                            }}
                          />
                        )}
                        ListboxProps={{
                          style: { maxHeight: "250px" },
                        }}
                      />
                    </StyledFormGroup>
                  </Grid>

                  {/* Approvers Section - Full Width */}
                  <Grid item xs={12} mt={-4}>
                    <StyledFormGroup>
                      <FormLabel sx={labelStyle}>
                        {t("approvers")}{" "}
                        <span style={{ color: "red", marginLeft: "2px" }}>
                          {!SelfApproved ? "*" : ""}
                        </span>
                      </FormLabel>
                      <Autocomplete
                        multiple
                        disabled={SelfApproved || !selectedAttributeType}
                        options={processOwnerAndEndUserList || []}
                        getOptionLabel={(option) => option?.UserName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.UserID === value
                        }
                        value={
                          processOwnerAndEndUserList?.filter((user) =>
                            approvers.includes(user.UserID)
                          ) || []
                        }
                        onChange={(event, newValue) => {
                          const fixedApproverIds =
                            selectedAttribute?.Approvers || [];
                          const fixedUsers =
                            processOwnerAndEndUserList?.filter((user) =>
                              fixedApproverIds.includes(user.UserID)
                            ) || [];
                          const mergedUsers = [
                            ...fixedUsers,
                            ...newValue.filter(
                              (user) => !fixedApproverIds.includes(user.UserID)
                            ),
                          ];
                          const userIds = mergedUsers.map(
                            (user) => user.UserID
                          );
                          setApprovers(userIds);
                        }}
                        renderTags={(selected, getTagProps) =>
                          selected.map((option, index) => {
                            const isFixed =
                              selectedAttribute?.Approvers?.includes(
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
                                size="small"
                                sx={{ mr: 0.5, my: 0.25 }}
                                style={
                                  isFixed
                                    ? {
                                        backgroundColor: "#e0e0e0",
                                        fontWeight: "bold",
                                      }
                                    : {}
                                }
                              />
                            );
                          })
                        }
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            variant="outlined"
                            placeholder={t("ChooseUsersPlaceholder")}
                            sx={{
                              "& .MuiInputBase-root": {
                                minHeight: "80px",
                                alignItems: "flex-start",
                                paddingTop: "8px",
                                paddingBottom: "8px",
                              },
                            }}
                          />
                        )}
                        ListboxProps={{
                          style: { maxHeight: "250px" },
                        }}
                      />
                    </StyledFormGroup>
                  </Grid>

                  <Grid item xs={12} mt={-4}>
                    <StyledFormGroup>
                      <FormLabel sx={labelStyle}>
                        {t("escalation users")}{" "}
                        <span style={{ color: "red", marginLeft: "2px" }}>
                          {!SelfApproved ? "*" : ""}
                        </span>
                      </FormLabel>
                      <Autocomplete
                        multiple
                        disabled={SelfApproved || !selectedAttributeType}
                        options={processOwnerAndEndUserList || []}
                        getOptionLabel={(option) => option?.UserName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.UserID === value
                        }
                        value={
                          processOwnerAndEndUserList?.filter((user) =>
                            escalationPersons.includes(user.UserID)
                          ) || []
                        }
                        onChange={(event, newValue) => {
                          const fixedEscalationUserIds =
                            selectedAttribute?.EscalationUsers || [];
                          const fixedUsers =
                            processOwnerAndEndUserList?.filter((user) =>
                              fixedEscalationUserIds.includes(user.UserID)
                            ) || [];
                          const mergedUsers = [
                            ...fixedUsers,
                            ...newValue.filter(
                              (user) =>
                                !fixedEscalationUserIds.includes(user.UserID)
                            ),
                          ];
                          const userIds = mergedUsers.map(
                            (user) => user.UserID
                          );
                          setEscalationPersons(userIds);
                        }}
                        renderTags={(selected, getTagProps) =>
                          selected.map((option, index) => {
                            const isFixed =
                              selectedAttribute?.EscalationUsers?.includes(
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
                                size="small"
                                sx={{ mr: 0.5, my: 0.25 }}
                                style={
                                  isFixed
                                    ? {
                                        backgroundColor: "#e0e0e0",
                                        fontWeight: "bold",
                                      }
                                    : {}
                                }
                              />
                            );
                          })
                        }
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            variant="outlined"
                            placeholder={t("ChooseUsersPlaceholder")}
                            sx={{
                              "& .MuiInputBase-root": {
                                minHeight: "80px",
                                alignItems: "flex-start",
                                paddingTop: "8px",
                                paddingBottom: "8px",
                              },
                            }}
                          />
                        )}
                        ListboxProps={{
                          style: { maxHeight: "250px" },
                        }}
                      />
                    </StyledFormGroup>
                  </Grid>

                  <Grid item xs={12} mt={-4}>
                    <StyledFormGroup>
                      <Box>
                        <FormLabel
                          className="label"
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#374151",
                          }}
                        >
                          {`${t("Co-Owners")} `}
                        </FormLabel>

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
                            CoOwnerUserID?.includes(user.UserID)
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
                              placeholder={t("Choose co-owners")}
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
                    </StyledFormGroup>
                  </Grid>
                  <Grid item xs={12} mt={-2}>
                    <FormLabel
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#374151",
                        mb: 1,
                        display: "block",
                      }}
                    >
                      Upload CTQ Image
                    </FormLabel>
                    <Box
                      sx={{
                        border: "2px dashed #cbd5e1",
                        borderRadius: "12px",
                        p: 3,
                        textAlign: "center",
                        transition: "0.3s",
                        "&:hover": {
                          borderColor: bgColor || "#3B82F6",
                        },
                      }}
                    >
                      {!image ? (
                        <>
                          <CloudUploadOutlined
                            sx={{ fontSize: 50, color: "#9ca3af", mb: 1 }}
                          />
                          <Typography
                            variant="body1"
                            sx={{ color: "#6b7280", mb: 1 }}
                          >
                            Drag & Drop or
                          </Typography>
                          <Button
                            variant="contained"
                            component="label"
                            sx={{
                             
                              textTransform: "none",
                              borderRadius: "8px",
                              px: 3,
                            }}
                          >
                            Browse Files
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </Button>
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{ color: "#6b7280", mt: 1 }}
                          >
                            Supported formats: JPG, PNG, GIF, WEBP — Max size:{" "}
                            <strong>5 MB</strong>
                          </Typography>
                        </>
                      ) : (
                        <Box>
                          <img
                            src={image}
                            alt="Preview"
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              borderRadius: "8px",
                              marginBottom: "10px",
                            }}
                          />
                          <Button variant="contained" component="label"
                            sx={{ color: "#fff", cursor: "pointer" ,backgroundColor:"#B91C1C","&:hover": { backgroundColor: "#991b1b" },}}
                            onClick={() => setImage(null)}
                          >
                            Remove Image
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                pt: 3,
                mt: 1,
                borderTop: "1px solid #E5E7EB",
                flexShrink: 0,
              }}
            >
              <Button
                variant="outlined"
                fullWidth
                color="secondary"
                onClick={onClose}
                disabled={!editSOPID} // Disable cancel when creating
                sx={{
                  height: "44px",
                  borderColor: "#D0D5DD",
                  color: "#374151",
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#9CA3AF",
                    backgroundColor: "#F9FAFB",
                  },
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={onNextScreenHandler}
                disabled={
                  editSOPID
                    ? isSubmittingDocument || isPublishingDocument
                    : isSubmittingDocument ||
                      isPublishingDocument ||
                      (!SOPExpiry && !isSkipSOPExpiry) ||
                      !selectedAttributeType ||
                      !sopName ||
                      !selectedDocument || // Require document in create mode
                      !sopDescription // Require description in create mode
                }
                sx={{
                  backgroundColor: editSOPID
                    ? isSubmittingDocument || isPublishingDocument
                      ? "#D1D5DB"
                      : bgColor || "#3B82F6"
                    : isSubmittingDocument ||
                      isPublishingDocument ||
                      (!SOPExpiry && !isSkipSOPExpiry) ||
                      !selectedAttributeType ||
                      !sopName ||
                      !selectedDocument ||
                      !sopDescription
                    ? "#D1D5DB"
                    : bgColor || "#3B82F6",
                  color: "#FFFFFF",
                  textTransform: "none",
                  height: "44px",
                  borderRadius: "8px",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: editSOPID
                      ? isSubmittingDocument || isPublishingDocument
                        ? "#D1D5DB"
                        : bgColor || "#2563EB"
                      : !selectedAttributeType ||
                        !sopName ||
                        !selectedDocument ||
                        !sopDescription
                      ? "#D1D5DB"
                      : bgColor || "#2563EB",
                  },
                }}
              >
                {t("next")}
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={style}>
          {/* Second Screen Header */}
          <Box sx={{ ...headerStyle, bgColor }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <img src={icon} alt="logo" />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "18px", fontWeight: 600 }}
                >
                  {t("New SOP")}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Checkbox
                    checked={isTemplate}
                    onChange={handleCheckboxIsTemplate}
                    sx={{
                      color: "white",
                      "&.Mui-checked": { color: "white" },
                      p: 0.5,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: "14px" }}>
                    {t("Template")}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUpload />}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  height: "40px",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                {t("Import SOP")}
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => handleXMLFile(event.target.files)}
                />
              </Button>

              <FormControl sx={{ width: 220, height: "40px" }}>
                <InputLabel
                  id="copy-dropdown-label"
                  sx={{ fontSize: "14px", color: "white", top: "-4px" }}
                >
                  {t("Copy from")}
                </InputLabel>
                <Select
                  labelId="copy-dropdown-label"
                  id="copy-dropdown"
                  value={selectedOption}
                  onChange={handleSelectChange}
                  label={t("Copy from")}
                  sx={{
                    height: "40px",
                    fontSize: "14px",
                    color: "white",
                    "& .MuiSelect-select": {
                      padding: "10px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                >
                  {sopTemplates.length > 0 ? (
                    sopTemplates.map((template) => (
                      <MenuItem
                        key={template?.SOPID}
                        value={template.SOPName}
                        onClick={() =>
                          handleClick(
                            template.SOPID,
                            template.SOPDraftID,
                            template.SOPName
                          )
                        }
                      >
                        {template.SOPName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>{t("No data found")}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>

            <Button
              onClick={onClose}
              sx={{
                position: "absolute",
                right: "16px",
                top: "16px",
                minWidth: "auto",
                p: 1,
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Typography fontSize="24px" fontWeight="300">
                ×
              </Typography>
            </Button>
          </Box>

          <Divider sx={{ margin: 0 }} />

          {/* BPMN Content Area */}
          <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column" }}>
            {/* <BPMNAdmin
              modelerRef={modelerRef}
              SOPData={sopDraft}
              setXml={setXml}
              shapeDetails={shapeDetails}
              setShapeDetails={setShapeDetails}
              selectedelement={selectedelement}
              setSelectedElement={setSelectedElement}
              selectedElementRef={selectedElementRef}
            /> */}

            <SopTemplateModal
              open={modalOpen}
              onClose={() => {
                setTempXml(null);
                setModalOpen(false);
              }}
              onConfirm={(newXml) => {
                if (modelerRef.current) {
                  modelerRef.current.clear();
                  modelerRef.current.importXML(newXml);
                }
                setXml(newXml);
                setTempXml(null);
                setModalOpen(false);
                notify("success", "Diagram updated successfully");
              }}
              sopName={selectedSopName}
              sopTemplates={BPMNDaigarm}
            />
          </Box>

          {/* Second Screen Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              p: 3,
              borderTop: "1px solid #E5E7EB",
              flexShrink: 0,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              sx={{
                height: "44px",
                borderColor: "#D0D5DD",
                color: "#374151",
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 500,
                minWidth: "100px",
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setScreen("first")}
              sx={{
                height: "44px",
                borderColor: "#D0D5DD",
                color: "#374151",
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: 500,
                minWidth: "100px",
              }}
            >
              {t("back")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onCreateDocumentHandler}
              disabled={
                isSubmittingDocument ||
                SelfApproved ||
                isPublishingDocument ||
                !selectedAttributeType
              }
              sx={{
                backgroundColor:
                  isSubmittingDocument || isPublishingDocument || SelfApproved
                    ? "#D1D5DB"
                    : bgColor || "#3B82F6",
                color: "#FFFFFF",
                textTransform: "none",
                height: "44px",
                borderRadius: "8px",
                fontWeight: 500,
                minWidth: "120px",
                "&:hover": {
                  backgroundColor: SelfApproved
                    ? "#D1D5DB"
                    : bgColor || "#2563EB",
                },
              }}
            >
              {isSubmittingDocument ? t("Saving...") : t("Save")}
            </Button>
          </Box>
        </Box>
      )}
    </Modal>
  );
};

export default NewSOPModal;

NewSOPModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isSOPWithWorkFlow: PropTypes.bool,
  isDraftFetching: PropTypes.bool,
  documentDraftVersion: PropTypes.array,
  draftAndMasterVersion: PropTypes.object,
  processOwnerList: PropTypes.array,
  processOwnerAndEndUserList: PropTypes.array,
  modelerRef: PropTypes.object.isRequired,
  BPMNDaigarm: PropTypes.array.isRequired,
  isSubmittingDocument: PropTypes.bool.isRequired,
  isPublishingDocument: PropTypes.bool.isRequired,
  sopTemplates: PropTypes.array.isRequired,
  editSOPID: PropTypes.string,
  onDataUpdate: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    sopName: PropTypes.string,
    sopDescription: PropTypes.string,
    attributeType: PropTypes.string,
    selectedAttributeTypeObj: PropTypes.object,
  }),
  selectedAttributeTypeObj: PropTypes.object,
};
