import { useCallback, useState } from "react";
import React, { useEffect, useRef } from "react";
import introJs from "intro.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "intro.js/minified/introjs.min.css";
import fileIcon from "../../assets/svg/AotuFinance/fileIcon.svg";
import SOPsIcon from "../../assets/svg/SOPs/3-layers.svg";
import video from "../../assets/svg/elementFolder/video.svg";
import movefile from "../../assets/svg/elementFolder/move_file.svg";
import plus from "../../assets/svg/owerside/plus-circle.svg";
import Edit from "../../assets/svg/elementFolder/Edit.svg";
import TestSimulation from "../../assets/svg/elementFolder/monitor.svg";
import FormBuilder from "../../assets/svg/elementFolder/formBuilder.svg";
import CancelButton from "../../assets/svg/elementFolder/CancelButton.svg";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import NewSOPModal from "../../components/modals/NewSOPModal";
import bookOpen from "../../../src/assets/svg/elementFolder/book-open.svg";
import elementHidden from "../../../src/assets/svg/elementFolder/element-hidden.svg";
import elementUnHidden from "../../../src/assets/svg/elementFolder/element-unhidden.svg";
import { GetElementsCategory } from "../../store/elements/action";
import { frontendState } from "../../store/presist/action";
import NewCategory from "../../components/modals/NewCategory";
import threedot from "../../assets/svg/ModelsSvg/threedot.svg";
import deleteIcon from "../../assets/svg/ModelsSvg/trash.svg";
import activityIcon from "../../assets/svg/ModelsSvg/activity.svg";
import revokeAssignmentIcon from "../../assets/svg/ModelsSvg/revokeAssignment.svg";
import editIcon from "../../assets/svg/ModelsSvg/edit.svg";
import category from "../../assets/svg/SOPsDropDown/category.svg";
import threelayer from "../../assets/svg/SOPsDropDown/3-layers.svg";
import assign from "../../assets/svg/SOPsDropDown/assign.svg";
import Pageloader from "../../assets/image/cubeloader.gif";
import guideData from "../../utils/introContent.json";
import excelIcons from "../../../src/assets/svg/elementFolder/Excel.svg";
import "./introjs-custom.css";

import {
  Backdrop,
  Card,
  Checkbox,
  Tooltip,
  Typography,
  Box,
  Stack,
  Skeleton,
  IconButton,
  Menu,
  MenuItem,
  Grow,
  ListItemIcon,
  Badge,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Nodata from "../../components/allpages/masterpopups/Nodata";
import NewTrainingSimulation from "../../components/allpages/documents/NewTrainingSimulation";
import Assign from "../../components/allpages/documents/Assign";
import NewTestSimulation from "../../components/allpages/documents/NewTestSimulation";
import {
  deleteDocumentModule,
  exportDocumentModule,
  fetchDocxTemplateAPI,
  listElementAttributeType,
  syncModule,
} from "../../services/documentModules/DocumentsModule";
import notify from "../../assets/svg/utils/toast/Toast";
import { deleteTrainingSimulationModule } from "../../services/trainingSimulationsModule/TrainingSimulationModule";
import DeleteModal from "../../components/modals/DeleteModal";
import { deleteTestSimulationModule } from "../../services/testSimulationsModule/TestSimulationModule";
import { deleteSopModule } from "../../services/sopModules/SopModule";
import Activity from "../../components/modals/Activity";
import NewTestMCQModal from "../../components/modals/NewTestMCQModal";
import { deleteTestMCQModule } from "../../services/testMcqModules/TestMcqModules";
import {
  ElementsCategoryApi,
  TemplateFilesApi,
} from "../../services/elements/Elements";
import NewFormModal from "../../components/modals/NewFormModal";
import {
  deleteFormModule,
  generateTokenForDynamicForm,
} from "../../services/formModules/FormModules";
import { FORM_BASE_URL } from "../../config/urlConfig";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {
  ArrowDownward,
  ArrowUpward,
  Check,
  FilterList,
  GridView,
  ListRounded,
} from "@mui/icons-material";
import SelectUsersModal from "../../components/modals/SelectUsersModal";
import {
  fetchAssignedDataForElement,
  revokeAssignedUserFromElement,
} from "../../services/elementAssignment/ElementAssignment";
import BackgroundMeshBox from "../meshbackground/BackgroundMeshBox";
import { hideUnhideModule } from "../../services/elementsFolderModules/ElementsFolderModule";
import BulkDocumentUpload from "../../components/modals/BulkDocumentUpload";
import { allowedHideUnhideModules, createSampleWorkbook } from "../../utils";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useSocket } from "../../context/SocketContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import MoveToModal from "./MoveToModal";
import DocumentTypList from "../../components/allpages/documents/AttributetypeList";
import AssigneCategory from "../../components/allpages/documents/AssigneCategory";
import BulkUploadSkillBuilding from "../../components/modals/BulkUploadSkillBuilding";
import BulkSkillAssessmentModal from "../../components/modals/BulkSkillAssessmentModal";
import NewDocStepper from "../../components/allpages/documents/NewDocStepper";
import { DeleteTemplateApi } from "../../services/docTemplate/DocTemplate";

const STATIC_TEMPLATE_FOLDER = {
  ContentID: "6466e3b3-9310-4cee-a12f-6e3c879ed839",
  ContentName: "Create Template",
  // Add any other properties needed for folder rendering
  IsStaticTemplate: true,
  // Optionally, add ContentDescription if needed for checkIsFolder
};

const removeDuplicates = (arr, key) => {
  return arr.filter(
    (item, index, self) => index === self.findIndex((t) => t[key] === item[key])
  );
};

const ElementFolders = () => {
  const socket = useSocket();
  const { t } = useTranslation();
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  const [moduleID, setModuleID] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false);
  const [dropdownIndex, setDropdownIndex] = React.useState(null);
  const [documentDropdownIndex, setDocumentDropdownIndex] = useState(null);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [modalType, setModalType] = useState(null);
  const [openAssign, setOpenAssign] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);
  const [isReactFlowData, setIsReactFlowData] = useState(false);
  const [activityContent, setActivityContent] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [folderClicked, setFolderClicked] = useState(null);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSelectingFolder, setIsSelectingFolder] = useState(null);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const [ThreeDotClickedData, setThreeDotClickedData] = useState(null);
  const [deleteTemplateDocxID, setDeleteTemplateDocxID] = useState(null);
  const [showBulkSkillBuildingUpload, setShowBulkSkillBuildingUpload] =
    useState(false);
  const [showBulkSkillAssessmentUpload, setShowBulkSkillAssessmentUpload] =
    useState(false);
  const [openAssignCategory, setOpenAssignCategory] = useState(false);
  const { elementsCategoryFiles, loading } = useSelector(
    (state) => state?.elements
  );

  console.log(loading, "elementsCategoryFiles loading");

  const { templates, error } = useSelector((state) => state.docxTemplate);

  // console.log("templates data:", templates);

  const [exportingDocuments, setExportingDocuments] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(() => {
    return localStorage.getItem("selectedOption") || "Folder";
  });
  const documentDropdownRef = useRef(null);
  const [templateFilesData, setTemplateFilesData] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem("templateFilesData");
    return saved ? JSON.parse(saved) : null;
  });
  const [isTemplateView, setIsTemplateView] = useState(false);
  const elementsStore = useSelector((state) =>
    state?.elements?.elementsCategoryFiles !== undefined
      ? state?.elements?.elementsCategoryFiles
      : {}
  );
  const [isSelectUserModalOpen, setIsSelectUserModalOpen] = useState(false);
  const [selectedUserModalData, setSelectedUserModalData] = useState(null);
  const [assignedDepartments, setAssignedDepartments] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [actionType, setActionType] = useState(null);
  const [isRevoking, setIsRevoking] = useState({
    all: false,
    custom: false,
  });
  const [hideUnhide, setHideUnhide] = useState(false);
  const [tableDropdownIndex, setTableDropdownIndex] = useState(null);
  const [isHidingUnhiding, setIsHidingUnhiding] = useState(false);
  const [showBulkDocumentUpload, setShowBulkDocumentUpload] = useState(false);
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const [folders, setFolders] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [modifiedLastSynced, setModifiedLastSynced] = useState(null);
  const [syncRetryCount, setSyncRetryCount] = useState(3);
  const [isSyncFailed, setIsSyncFailed] = useState(false);
  const retryCountRef = useRef(syncRetryCount);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterOption, setFilterOption] = useState("NameAsc");
  const [isSOPWithWorkFlowClicked, setIsSOPWithWorkFlowClicked] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [attriutelist, setAttriutelist] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user_data"));
  // const onlyofficeloader = localStorage.getItem("saveAsDraftClicked");
  // const onlyofficeloadertwo = localStorage.getItem("saveAndSendClicked");
  const selectedContentName = localStorage.getItem("selectedContentName");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (window.location.pathname === "/sops") {
      localStorage.removeItem("moduleAction");
    }
  }, []);

  const dispatch = useDispatch();
  const getIsGlobalView = () => {
    const val = localStorage.getItem("IsGlobalView");
    return val === "true";
  };
  const fetchData = useCallback(() => {
    const myTask = localStorage.getItem("my_task");
    const isGlobalView = getIsGlobalView();
    // Remove setLoading(true) from here since Redux will handle it
    const data = {
      ModuleTypeID: presistStore?.ModuleTypeID,
      ParentContentID: presistStore?.ContentID,
      IsEnableMyTask: myTask === "EndUser",
      IsGlobalView: isGlobalView || false,
    };
    dispatch(GetElementsCategory(data));
  }, [presistStore?.ModuleTypeID, presistStore?.ContentID, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "IsGlobalView") {
        fetchData();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [fetchData]);
  const navigate = useNavigate();
  const toggleDropdown = (index) => {
    setDocumentDropdownIndex(null);
    setDropdownIndex(index === dropdownIndex ? null : index);
  };
  const toggleDocumentDropdown = (index) => {
    setDropdownIndex(null);
    setDocumentDropdownIndex(index === documentDropdownIndex ? null : index);
  };
  const userRole = localStorage.getItem("user_type");
  const myTask = localStorage.getItem("my_task");
  const isProcessOwnerOrAdmin =
    (userRole === "ProcessOwner" || userRole === "Admin") &&
    (!myTask || myTask !== "EndUser");
  const handleHideClick = () => {
    setHideUnhide(true);
    setShowCheckbox(true);
    setShowDropdown(false);
  };

  const checkIsFolder = (item) => {
    return Object.keys(item).includes("ContentDescription");
  };

  const getFilesInsideFolder = async (payload, item) => {
    setIsSelectingFolder(item);
    // Remove setLoading(true) from here since we're not using local loading for this
    try {
      const response = await ElementsCategoryApi(payload);

      if (response?.status === 200) {
        if (response?.data?.docs?.length > 0) {
          const files = response?.data?.docs;
          return files;
        } else {
          throw new Error("No files found in this folder");
        }
      } else {
        throw new Error("Cannot select, please try again inner");
      }
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setIsSelectingFolder(null);
      // Remove setLoading(false) from here
    }
  };

  const toggleTableDropdown = (index) => {
    setDropdownIndex(null);
    setTableDropdownIndex(index === tableDropdownIndex ? null : index);
  };

  const handleCheckboxChange = (item) => {
    const isFolder = checkIsFolder(item);
    if (actionType !== "assignCategory") {
      if (isFolder) {
        const isItemAlreadyChecked = selectedFolders.some(
          (selectedItem) => selectedItem.ContentID === item.ContentID
        );
        if (isItemAlreadyChecked) {
          const filteredFolders = selectedFolders.filter(
            (selectedItem) => selectedItem.ContentID !== item.ContentID
          );
          const filteredFiles = selectedFiles.filter(
            (selectedItem) => selectedItem.ContentID !== item.ContentID
          );
          setSelectedFiles(filteredFiles);
          setSelectedFolders(filteredFolders);
        } else {
          getFilesInsideFolder(
            {
              ModuleTypeID: presistStore?.ModuleTypeID,
              ParentContentID: item.ContentID,
            },
            item
          )
            .then((files) => {
              setSelectedFolders((prev) => [...prev, item]);
              setSelectedFiles((prev) => [...prev, ...files]);
            })
            .catch((error) => {
              notify("error", error.message);
            });
        }
      } else {
        // Use the resolved ID key to compare items correctly across module inconsistencies
        const idKey = getItemIdKey(item);
        const isItemAlreadyChecked = selectedFiles.some(
          (selectedItem) => selectedItem[idKey] === item[idKey]
        );
        if (isItemAlreadyChecked) {
          const filteredItems = selectedFiles.filter(
            (selectedItem) => selectedItem[idKey] !== item[idKey]
          );
          setSelectedFiles(filteredItems);

          const isFolderAlreadyChecked = selectedFolders.some(
            (selectedItem) => selectedItem.ContentID === item.ContentID
          );
          if (isFolderAlreadyChecked) {
            const filteredFolders = selectedFolders.filter(
              (selectedItem) => selectedItem.ContentID !== item.ContentID
            );
            setSelectedFolders(filteredFolders);
          }
        } else {
          const fileList = [...selectedFiles, item];
          setSelectedFiles(fileList);

          const totalFilesInThisFolder = elementsStore?.docs?.length;
          const totalFilesSelectedInsideThisFolder = fileList.filter(
            (selectedItem) =>
              selectedItem.ContentID === folderClicked?.ContentID
          ).length;

          if (totalFilesInThisFolder === totalFilesSelectedInsideThisFolder) {
            setSelectedFolders((prev) => [...prev, folderClicked]);
          }
        }
      }
    } else {
      if (selectedCategory.some((cat) => cat.ContentID === item.ContentID)) {
        setSelectedCategory((prev) =>
          prev.filter((cat) => cat.ContentID !== item.ContentID)
        );
      } else {
        setSelectedCategory((prev) => [...prev, item]);
      }
    }
  };
  const onCheckboxSelect = (item) => {
    const isFolder = Object.keys(item).includes("ContentDescription");
    if (actionType !== "assignCategory") {
      if (isFolder) {
        return selectedFolders.some(
          (selectedItem) => selectedItem.ContentID === item.ContentID
        );
      } else {
        // Use resolved ID key so checked state is accurate per module
        const idKey = getItemIdKey(item);
        return selectedFiles.some(
          (selectedItem) => selectedItem[idKey] === item[idKey]
        );
      }
    } else {
      return selectedCategory.some(
        (selectedItem) => selectedItem.ContentID === item.ContentID
      );
    }
  };
  const handleSelectAllChange = () => {
    const existingFilesInFolder = elementsStore?.docs ?? [];
    const alreadySelectedFilesInFolder = selectedFiles.filter((item) =>
      existingFilesInFolder.some(
        (existingItem) => existingItem.ContentID === item.ContentID
      )
    );
    if (alreadySelectedFilesInFolder.length === existingFilesInFolder.length) {
      const filesWithUnselectedFilesInFolder = selectedFiles.filter(
        (item) =>
          !existingFilesInFolder.some(
            (existingItem) => existingItem.ContentID === item.ContentID
          )
      );
      setSelectedFiles(filesWithUnselectedFilesInFolder);
      setIsSelectAllChecked(false);
    } else {
      const filesWithSelectedFilesInFolder = [
        ...selectedFiles.filter(
          (item) =>
            !existingFilesInFolder.some(
              (existingItem) => existingItem.ContentID === item.ContentID
            )
        ),
        ...existingFilesInFolder,
      ];
      setSelectedFiles(filesWithSelectedFilesInFolder);
      setIsSelectAllChecked(true);
    }
  };
  useEffect(() => {
    const existingFilesInFolder = elementsStore?.docs ?? [];
    const alreadySelectedFilesInFolder = selectedFiles.filter((item) =>
      existingFilesInFolder.some(
        (existingItem) => existingItem.ContentID === item.ContentID
      )
    );
    if (
      existingFilesInFolder.length > 0 &&
      alreadySelectedFilesInFolder.length === existingFilesInFolder.length
    ) {
      setIsSelectAllChecked(true);
    } else {
      setIsSelectAllChecked(false);
    }
  }, [elementsStore, selectedFiles]);

  const handleContinue = () => {
    if (actionType === "assignCategory") {
      setOpenAssignCategory(true);
    } else {
      setOpenAssign(true);
    }
  };
  const handleHide = async (hideFlag, singleClickData = []) => {
    setIsHidingUnhiding(true);
    setLoading(true);
    try {
      let modifiedSelectedFiles = [];
      if (singleClickData?.length === 0 && selectedFiles?.length > 0) {
        modifiedSelectedFiles = selectedFiles?.map((item) => {
          return {
            ModuleTypeID: item?.ModuleTypeID,
            ContentID: item?.ContentID,
            ModuleName: item?.ModuleName,
            ModuleID: item[`${item?.ModuleName}ID`],
            IsHidden: hideFlag,
          };
        });
      } else if (singleClickData?.length > 0) {
        modifiedSelectedFiles = singleClickData?.map((item) => {
          return {
            ModuleTypeID: item?.ModuleTypeID,
            ContentID: item?.ContentID,
            ModuleName: item?.ModuleName,
            ModuleID: item[`${item?.ModuleName}ID`],
            IsHidden: hideFlag,
          };
        });
      }

      if (modifiedSelectedFiles?.length > 0) {
        const response = await hideUnhideModule({
          Modules: modifiedSelectedFiles,
        });
        if (response?.status === 200) {
          notify("success", response?.data?.message);
          fetchData();
          clearCheckbox();
        } else {
          notify("error", response?.data?.message);
        }
      } else {
        notify("error", "No file(s) selected to hide/unhide");
      }
    } catch (error) {
      notify("error", error?.response?.data?.message || error?.message);
    } finally {
      setIsHidingUnhiding(false);
      setLoading(false);
      toggleDropdown(null);
    }
  };
  const handleFolderClick = (item) => {
    if (
      typeof item === "object" &&
      Object.keys(item).includes("ContentDescription")
    ) {
      setFolderClicked(item);
    }
  };

  useEffect(() => {
    // When presistStore?.ContentID is null, remove templateFilesData from localStorage and state
    if (
      presistStore?.ContentID === null ||
      presistStore?.ContentID === undefined
    ) {
      // Remove from localStorage
      localStorage.removeItem("templateFilesData");

      // Clear from state
      setTemplateFilesData(null);

      // console.log("🗑️ templateFilesData removed because ContentID is null");
    }
  }, [presistStore?.ContentID]);

  const handleTemplateSaveSuccessFromStepper = async (result) => {
    console.log("📨 Template save data received in ElementFolders:", result);

    if (result.success) {
      console.log("🎉 Template saved successfully in ElementFolders!");
      console.log("Template ID:", result.templateId);
      console.log("Document Name:", result.documentName);
      console.log("Template Data:", result.templateData);

      notify("success", result.message || "Template created successfully");

      // Make the TemplateFilesApi call here instead of in HandleItemClick
      try {
        const myTask = localStorage.getItem("my_task");
        const payload = {
          ModuleTypeID: "8db6ea3c-475d-47b7-8d4d-918de1889ef5",
          ParentContentID: "6466e3b3-9310-4cee-a12f-6e3c879ed810",
          IsEnableMyTask: myTask === "EndUser",
          IsGlobalView: getIsGlobalView() || false,
        };

        const response = await TemplateFilesApi(payload);

        if (response?.status === 200) {
          console.log("✅ TemplateFilesApi called successfully");

          // Update state and localStorage with template data
          const templateData = response.data;
          setTemplateFilesData(templateData);
          localStorage.setItem(
            "templateFilesData",
            JSON.stringify(templateData)
          );

          // Refresh the data to show the new template
          fetchData();
        } else {
          console.error("❌ TemplateFilesApi failed:", response);
          notify("error", "Failed to load template data");
        }
      } catch (err) {
        console.error("💥 TemplateFilesApi error:", err);
        notify("error", "Error loading template data");
      }
    } else {
      console.log("💥 Template save failed in ElementFolders:", result.error);
      notify("error", result.message || "Template creation failed");
    }
  };

  // Remove the TemplateFilesApi call from HandleItemClick for static templates
  const HandleItemClick = async (item) => {
    handleFolderClick(item);
    // Store the ContentName in local storage

    if (item?.ContentName) {
      localStorage.setItem("selectedContentName", item.ContentName);
      if (item?.ContentName === "Create Template") {
        localStorage.removeItem("selectedDocumentType");
      }
    }

    if (item?.IsStaticTemplate) {
      // Special payload for static template
      const payload = {
        ModuleTypeID: "8db6ea3c-475d-47b7-8d4d-918de1889ef5",
        ParentContentID: "6466e3b3-9310-4cee-a12f-6e3c879ed810",
        IsEnableMyTask: myTask === "EndUser",
        IsGlobalView: getIsGlobalView() || false,
      };
      setLoading(true); // Keep this for template loading
      try {
        const response = await TemplateFilesApi(payload);

        if (response?.status === 200) {
          dispatch(
            frontendState({
              ...item,
              ContentID: payload.ParentContentID,
            })
          );
          // Save to localStorage
          const templateData = response.data;
          setTemplateFilesData(templateData);
          localStorage.setItem(
            "templateFilesData",
            JSON.stringify(templateData)
          );
        }
      } catch (err) {
        console.error("TemplateFilesApi error:", err);
      } finally {
        setLoading(false); // Keep this for template loading
      }

      setFolderClicked(item);
      return;
    }
    setTemplateFilesData(null);
    localStorage.removeItem("templateFilesData");
    dispatch(frontendState(item));
  };

  //  const handleTemplateSaveSuccessFromStepper = (result) => {
  //     console.log("📨 Template save data received in ElementFolders:", result);
  //     // setTemplateSaveResult(result);

  //     if (result.success) {
  //       console.log("🎉 Template saved successfully in ElementFolders!");
  //       console.log("Template ID:", result.templateId);
  //       console.log("Document Name:", result.documentName);
  //       console.log("Template Data:", result.templateData);

  //       notify("success", result.message || "Template created successfully");

  //       // Refresh the data to show the new template
  //       fetchData();

  //       // Close the modal after successful save
  //       // setShowNewDocStepper(false);

  //     } else {
  //       console.log("💥 Template save failed in ElementFolders:", result.error);
  //       notify("error", result.message || "Template creation failed");
  //     }
  //   };

  //   const HandleItemClick = async (item) => {
  //     handleFolderClick(item);
  //     console.log("clicked item template:", item);

  //     if (item?.IsStaticTemplate) {
  //       // Special payload for static template
  //       const payload = {
  //         ModuleTypeID: "8db6ea3c-475d-47b7-8d4d-918de1889ef5",
  //         ParentContentID: "6466e3b3-9310-4cee-a12f-6e3c879ed810",
  //         IsEnableMyTask: myTask === "EndUser",
  //         IsGlobalView: getIsGlobalView() || false,
  //       };
  //       try {
  //         const response = await TemplateFilesApi(payload);

  //         if (response?.status === 200) {
  //           dispatch(
  //             frontendState({
  //               ...item,
  //               ContentID: payload.ParentContentID,
  //             })
  //           );
  //           // Save to localStorage
  //           const templateData = response.data;
  //           setTemplateFilesData(templateData);
  //           localStorage.setItem(
  //             "templateFilesData",
  //             JSON.stringify(templateData)
  //           );
  //         }
  //       } catch (err) {
  //         console.error("TemplateFilesApi error:", err);
  //       }

  //       setFolderClicked(item);
  //       return;
  //     }
  //     setTemplateFilesData(null);
  //     localStorage.removeItem("templateFilesData");
  //     dispatch(frontendState(item));
  //   };
  useEffect(() => {
    return () => {
      // Optional: Clear localStorage when component unmounts
      // localStorage.removeItem('templateFilesData');
    };
  }, []);
  const clearCheckbox = () => {
    setSelectedFiles([]);
    setSelectedFolders([]);
    setFolderClicked(null);
    setIsSelectAllChecked(false);
    setShowCheckbox(false);
    setActionType(null);
  };

  const handleItemEdit = (item) => {
    setEditCategory(item);
    setNewCategoryModalOpen(true);
  };

  const generateTokenForDynamicFormHandler = async (item) => {
    setLoading(true);
    try {
      const response = await generateTokenForDynamicForm(item);
      if (response?.status === 200) {
        return response?.data?.data?.token;
      } else {
        notify("error", response?.data?.message);
        return null;
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const HandleItemDoc = async (item) => {
    const isForm = item?.ModuleName === "Form";
    // Check if this is a template document
    const isTemplate =
      isTemplatesBreadcrumb ||
      (templateFilesData?.docs &&
        templateFilesData.docs.some((doc) => {
          const idField = item.ModuleName + "ID";
          return (
            doc.ModuleName === item.ModuleName && doc[idField] === item[idField]
          );
        }));

    if (isForm) {
      setLoading(true);
      const userType = localStorage.getItem("user_type");
      const formModuleDraftID = item?.FormModuleDraftID;
      const userModuleLinkID = item?.UserModuleLinkID;
      const pathAccessType =
        userType === "ProcessOwner"
          ? "view"
          : userType === "EndUser"
          ? "fill"
          : "invalid";
      const payload = {
        FormModuleDraftID: formModuleDraftID,
        UserModuleLinkID: userModuleLinkID,
        OtherData: { PathAccessType: pathAccessType },
      };
      const token = await generateTokenForDynamicFormHandler(payload);
      if (token) {
        const url = `${FORM_BASE_URL}${pathAccessType}?token=${token}`;
        window.open(url, "_blank");
      }
    } else {
      dispatch(frontendState(item));

      // If it's a template document, navigate to "/document/view" path
      if (isTemplate && item.ModuleName === "Document") {
        navigate("/documents/view", { state: { fromDashboard: true } });
        // dispatch(
        //   fetchDocxTemplateAPI({
        //     DocumentTemplateID: item.DocumentID,
        //     IsGlobalView: true,
        //   })
        // );
      } else {
        const routeMapping = {
          Document: "/documents/view",
          SkillBuilding: "/training-simulations/view",
          SOP: "/sops/view",
          SkillAssessment: "/test-simulations/view",
          TestMCQ: "/test-mcqs/view",
        };
        const moduleName = presistStore.ModuleMaster?.ModuleName;
        const route = routeMapping[moduleName];
        if (route && elementsCategoryFiles?.docs?.length > 0) {
          navigate(route, { state: { fromDashboard: true } });
        }
      }
    }
  };

  const Getname = (elemen) => {
    if (elemen?.ModuleName === "Document") {
      return elemen?.DocumentName;
    } else if (elemen?.ModuleName === "SkillBuilding") {
      return elemen?.TrainingSimulationName;
    } else if (elemen?.ModuleName === "SOP") {
      return elemen?.SOPName;
    } else if (elemen?.ModuleName === "TestMCQ") {
      return elemen?.TestMCQName;
    } else if (elemen?.ModuleName === "SkillAssessment") {
      return elemen?.TestSimulationName;
    } else if (elemen?.ModuleName === "Form") {
      return elemen?.FormName;
    }
  };

  const GetExpiryDate = (elemen) => {
    if (elemen?.ModuleName === "Document") {
      return elemen?.DocumentExpiry;
    } else if (elemen?.ModuleName === "SkillBuilding") {
      return elemen?.TestSimulationExpiry;
    } else if (elemen?.ModuleName === "SOP") {
      return elemen?.SOPExpiry;
    } else if (elemen?.ModuleName === "TestMCQ") {
      return elemen?.TestMCQExpiry;
    } else if (elemen?.ModuleName === "SkillAssessment") {
      return elemen?.TestSimulationExpiry;
    } else if (elemen?.ModuleName === "Form") {
      return elemen?.FormExpiry;
    }
  };

  const GetDocicon = (elemen) => {
    const isHiddenField = elemen?.ModuleName + "IsHidden";
    if (elemen[isHiddenField]) {
      return elementHidden;
    } else if (elemen?.ModuleName === "Document") {
      return bookOpen;
    } else if (elemen?.ModuleName === "SkillBuilding") {
      return video;
    } else if (elemen?.ModuleName === "SOP") {
      return SOPsIcon;
    } else if (elemen?.ModuleName === "TestMCQ") {
      return Edit;
    } else if (elemen?.ModuleName === "SkillAssessment") {
      return TestSimulation;
    } else if (elemen?.ModuleName === "Form") {
      return FormBuilder;
    }
  };

  const getItemIdKey = (item) => {
    const moduleName = item?.ModuleName;
    switch (moduleName) {
      case "SkillBuilding":
        return "TrainingSimulationID";
      case "SkillAssessment":
        return "TestSimulationID";
      case "Document":
        return "DocumentID";
      case "TestMCQ":
        return "TestMCQID";
      case "SOP":
        return "SOPID";
      case "Form":
        return "FormID";
      default:
        return moduleName ? `${moduleName}ID` : "ContentID";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideDropdown =
        (dropdownRef.current && dropdownRef.current.contains(event.target)) ||
        (documentDropdownRef.current &&
          documentDropdownRef.current.contains(event.target));
      if (!isInsideDropdown) {
        setTableDropdownIndex(null);
        setDocumentDropdownIndex(null);
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (elementsStore?.moduleType) {
      setModuleName(elementsStore?.moduleType);
      if (elementsStore?.moduleType === "Document") {
        let time = elementsStore?.lastSynced;
        if (time) {
          time = moment.utc(time).local();
          setLastSynced(time);
          setModifiedLastSynced(time.fromNow());
        }
      }
    }
    if (elementsStore?.data && elementsStore?.data.length > 0) {
      setFolders((prev) => [...prev, ...(elementsStore?.data ?? [])]);
    }
  }, [elementsStore]);

  const handleItemClick = (name) => {
    if (name === "SOP") {
      setModalType("SOP");
      const moduleAction = localStorage.getItem("moduleAction");
      if (moduleAction === "Edit") {
        setModalOpen(true);
      } else {
        navigate("/sop-creation-steps");
      }
    } else if (name === "Document") {
      setModalType("Document");
      setModalOpen(true);
    } else if (name === "BulkDocument") {
      setModalType("BulkDocument");
      openBulkDocumentUpload();
    } else if (name === "SkillBuilding") {
      setModalType("TrainingSimulation");
      setModalOpen(true);
    } else if (name === "SkillAssessment") {
      setModalType("TestSimulation");
      setModalOpen(true);
    } else if (name === "TestMCQ") {
      setModalType("TestMCQ");
      setModalOpen(true);
    } else if (name === "ESign") {
      setModalType("ESign");
      setModalOpen(true);
    } else if (name === "Form") {
      setModalType("Form");
      setModalOpen(true);
    }
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const documentDelete = async (item) => {
    setIsDeleting(true);
    try {
      const selectedContentName = localStorage.getItem("selectedContentName");
      if (selectedContentName === "Create Template") {
        const response = await DeleteTemplateApi({
          DocumentTemplateID: item?.DocumentID,
          // ModuleTypeID: presistStore?.ModuleTypeID,
          // ContentID: presistStore?.ContentID,
        });
        if (response?.status === 200) {
          notify("success", response?.data?.message);
          const data = {
            ModuleTypeID: presistStore?.ModuleTypeID,
            ParentContentID: presistStore?.ContentID,
          };
          dispatch(GetElementsCategory(data));
        } else {
          notify("error", response?.data?.message);
        }
      } else {
        const response = await deleteDocumentModule({
          DocumentID: item?.DocumentID,
          ModuleTypeID: presistStore?.ModuleTypeID,
          ContentID: presistStore?.ContentID,
        });
        if (response?.status === 200) {
          notify("success", response?.data?.message);
          const data = {
            ModuleTypeID: presistStore?.ModuleTypeID,
            ParentContentID: presistStore?.ContentID,
          };
          dispatch(GetElementsCategory(data));
        } else {
          notify("error", response?.data?.message);
        }
      }
      closeModal();
    } catch (error) {
      notify("error", error?.response?.data?.message);
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  const trainingSimulationDelete = async (item) => {
    setIsDeleting(true);
    try {
      const response = await deleteTrainingSimulationModule({
        TrainingSimulationID: item?.TrainingSimulationID,
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      });
      if (response?.status === 200) {
        notify("success", response?.data?.message);
        const data = {
          ModuleTypeID: presistStore?.ModuleTypeID,
          ParentContentID: presistStore?.ContentID,
        };
        dispatch(GetElementsCategory(data));
      } else {
        notify("error", response?.data?.message);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  const testSimulationDelete = async (item) => {
    setIsDeleting(true);
    try {
      const response = await deleteTestSimulationModule({
        TestSimulationID: item?.TestSimulationID,
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      });
      if (response?.status === 200) {
        notify("success", response?.data?.message);
        const data = {
          ModuleTypeID: presistStore?.ModuleTypeID,
          ParentContentID: presistStore?.ContentID,
        };
        dispatch(GetElementsCategory(data));
      } else {
        notify("error", response?.data?.message);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  const sopModuleDelete = async (item) => {
    setIsDeleting(true);
    try {
      const response = await deleteSopModule({
        SOPID: item?.SOPID,
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      });
      if (response?.status === 200) {
        notify("success", response?.data?.message);
        const data = {
          ModuleTypeID: presistStore?.ModuleTypeID,
          ParentContentID: presistStore?.ContentID,
        };
        dispatch(GetElementsCategory(data));
      } else {
        notify("error", response?.data?.message);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  const testMCQModuleDelete = async (item) => {
    setIsDeleting(true);
    try {
      const response = await deleteTestMCQModule({
        TestMCQID: item?.TestMCQID,
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      });
      if (response?.status === 200) {
        notify("success", response?.data?.message);
        const data = {
          ModuleTypeID: presistStore?.ModuleTypeID,
          ParentContentID: presistStore?.ContentID,
        };
        dispatch(GetElementsCategory(data));
      } else {
        notify("error", response?.data?.message);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  const formModuleDelete = async (item) => {
    setIsDeleting(true);
    try {
      const response = await deleteFormModule({
        FormID: item?.FormID,
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      });
      if (response?.status === 200) {
        notify("success", response?.data?.message);
        const data = {
          ModuleTypeID: presistStore?.ModuleTypeID,
          ParentContentID: presistStore?.ContentID,
        };
        dispatch(GetElementsCategory(data));
      } else {
        notify("error", response?.data?.message);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message);
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  const onModuleDeleteHandler = async (item) => {
    if (item?.ModuleName === "Document") {
      openModal();
      setDeleteFunction(() => () => documentDelete(item));
    } else if (item?.ModuleName === "SkillBuilding") {
      openModal();
      setDeleteFunction(() => () => trainingSimulationDelete(item));
    } else if (item?.ModuleName === "SkillAssessment") {
      openModal();
      setDeleteFunction(() => () => testSimulationDelete(item));
    } else if (item?.ModuleName === "SOP") {
      openModal();
      setDeleteFunction(() => () => sopModuleDelete(item));
    } else if (item?.ModuleName === "TestMCQ") {
      openModal();
      setDeleteFunction(() => () => testMCQModuleDelete(item));
    } else if (item?.ModuleName === "Form") {
      openModal();
      setDeleteFunction(() => () => formModuleDelete(item));
    }
  };

  const onEditClickHandler = (item) => {
    console.log("Edit clicked for:", item); // Debug log
    switch (item?.ModuleName) {
      case "Document":
        setModuleID(item?.DocumentID);
        setModalType("Document");
        break;
      case "SkillBuilding":
        setModuleID(item?.TrainingSimulationID);
        setModalType("TrainingSimulation");
        break;
      case "SOP":
        setModuleID(item?.SOPID);
        setIsReactFlowData(item?.IsReactFlow);
        localStorage.setItem("moduleAction", "Edit");
        break;
      case "TestMCQ":
        setModuleID(item?.TestMCQID);
        break;
      case "SkillAssessment":
        setModuleID(item?.TestSimulationID);
        break;
      case "Form":
        setModuleID(item?.FormID);
        break;
      default:
        setModuleID(null);
        break;
    }
    if (moduleName) {
      localStorage.setItem("moduleAction", "Edit");
    } else {
      localStorage.removeItem("moduleAction");
    }
    handleItemClick(item?.ModuleName);
  };

  const handleItemDelete = (item) => {
    setItemToDelete(item);
    setOpenDeleteModal(true);
  };

  const handleDelete = (item) => {
    console.log(item, "Item deleted");
  };

  const handleCloseModal = () => {
    setOpenDeleteModal(false);
    setItemToDelete(null);
  };

  const fetchRolesAndDepartmentsForAssignedElement = async (data) => {
    setLoading(true);
    setIsSelectUserModalOpen(false);
    try {
      const ModuleID = `${data["ModuleName"]}ID`;
      const body = {
        ModuleTypeID: data?.ModuleTypeID,
        ContentID: data?.ContentID,
        ModuleName: data?.ModuleName,
        ModuleID: data[ModuleID],
      };
      setBodyData(body);
      const response = await fetchAssignedDataForElement(body);
      if (response?.status === 200) {
        const data = response?.data?.data;
        const { departments = [], roles = [] } = data;
        setAssignedDepartments(departments);
        setAssignedRoles(roles);

        setIsSelectUserModalOpen(true);
      }
    } catch (error) {
      notify(
        "error",
        error?.response?.data?.message || "Failed to revoke assgnment"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const onRevokeAssignmentHandler = async ({
    isAllUsers = true,
    selectedUsers = [],
  }) => {
    try {
      setIsRevoking({ all: isAllUsers, custom: !isAllUsers });
      const ModuleID = `${selectedUserModalData["ModuleName"]}ID`;
      const body = {
        ModuleTypeID: selectedUserModalData?.ModuleTypeID,
        ContentID: selectedUserModalData?.ContentID,
        ModuleName: selectedUserModalData?.ModuleName,
        ModuleID: selectedUserModalData[ModuleID],
      };
      body["Departments"] = assignedDepartments.map(
        (item) => item.DepartmentID
      );
      body["Roles"] = assignedRoles.map((item) => item.RoleID);
      body["IsAllUsers"] = isAllUsers;
      body["SelectedUsers"] =
        selectedUsers && selectedUsers?.length > 0
          ? selectedUsers?.map((user) => user.UserID)
          : [];
      const response = await revokeAssignedUserFromElement(body);
      if (response?.status === 200) {
        notify("success", response?.data?.message || "Assgnment revoked");
        setIsSelectUserModalOpen(false);
        setSelectedUserModalData(null);
      }
    } catch (error) {
      notify(
        "error",
        error?.response?.data?.message || "Failed to revoke assgnment"
      );
      return null;
    } finally {
      setIsRevoking({ all: false, custom: false });
    }
  };

  const isTemplatesBreadcrumb = elementsStore?.bredcrumbs?.some(
    (breadcrumb) => breadcrumb.breadcrumbName.toLowerCase() === "templates"
  );

  const openBulkDocumentUpload = () => {
    setShowBulkDocumentUpload(true);
  };

  const closeBulkDocumentUpload = () => {
    setShowBulkDocumentUpload(false);
  };

  const documentExportHandler = async () => {
    setExportingDocuments(true);
    notify("info", t("You will be notified once the export is ready"));
    try {
      const payload = {
        ModuleTypeID: presistStore?.ModuleTypeID,
        ContentID: presistStore?.ContentID,
      };
      const response = await exportDocumentModule(payload);
      if (response?.status === 200) {
        const data = response?.data?.data?.documentData;
        const folderName =
          elementsStore?.bredcrumbs[elementsStore?.bredcrumbs?.length - 1]
            .breadcrumbName;
        setTimeout(() => {
          createSampleWorkbook(data, folderName, "Documents");
          notify(
            "success",
            t("Documents exported successfully!") || response?.data?.message
          );
          setExportingDocuments(false);
        }, 1000);
      } else {
        notify("error", response?.data?.message);
        setExportingDocuments(false);
      }
    } catch (error) {
      notify("error", error?.response?.data?.message || error?.message);
      setExportingDocuments(false);
    }
  };

  const calculateLastSyncTime = () => {
    if (lastSynced) {
      setModifiedLastSynced(moment(lastSynced).fromNow());
    }
  };

  useEffect(() => {
    if (lastSynced) {
      const interval = setInterval(() => {
        calculateLastSyncTime();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [lastSynced]);

  const syncHandler = async () => {
    setIsSyncFailed(false);
    setIsSyncing(true);
    try {
      const response = await syncModule();
      if (response?.status !== 200) {
        throw response?.data?.message || "Failed to sync";
      }
    } catch (error) {
      notify("error", error?.response?.data?.message || error?.message);
      setIsSyncing(false);
      setIsSyncFailed(true);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const syncSuccessHandler = ({ date }) => {
      if (date) {
        setLastSynced(date);
        setModifiedLastSynced(moment(date).fromNow());
      }
      setIsSyncFailed(false);
    };
    const syncFailureHandler = ({ date }) => {
      if (date) {
        setLastSynced(date);
        setModifiedLastSynced(moment(date).fromNow());
      }
      setIsSyncFailed(true);
    };
    const globalSyncSuccessHandler = ({ message, date }) => {
      if (date) {
        setLastSynced(date);
        setModifiedLastSynced(moment(date).fromNow());
      }
      if (message) {
        notify("success", message);
      }
      setSyncRetryCount(3);
      retryCountRef.current = 3;
      setIsSyncing(false);
      setIsSyncFailed(false);
    };
    const globalSyncFailureHandler = ({ message, date }) => {
      if (retryCountRef.current > 0) {
        setTimeout(syncHandler, 2000);
      } else {
        if (date) {
          setLastSynced(date);
          setModifiedLastSynced(moment(date).fromNow());
        }
        if (message) {
          notify("error", message);
        }
        setIsSyncing(false);
        setIsSyncFailed(true);
      }
      setSyncRetryCount((prev) => {
        retryCountRef.current = prev - 1;
        return retryCountRef.current;
      });
    };
    const documentEditFailureHandler = (message) => {
      if (message) {
        notify("error", message);
      }
    };

    socket.off("sync-success").on("sync-success", syncSuccessHandler);
    socket.off("sync-failure").on("sync-failure", syncFailureHandler);
    socket
      .off("global-sync-failure")
      .on("global-sync-failure", globalSyncFailureHandler);
    socket
      .off("global-sync-success")
      .on("global-sync-success", globalSyncSuccessHandler);
    socket
      .off("document-edit-failure")
      .on("document-edit-failure", documentEditFailureHandler);

    return () => {
      socket.off("sync-success", syncSuccessHandler);
      socket.off("sync-failure", syncFailureHandler);
      socket.off("global-sync-failure", globalSyncFailureHandler);
      socket.off("global-sync-success", globalSyncSuccessHandler);
      socket.off("document-edit-failure", documentEditFailureHandler);
    };
  }, [socket]);

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
    const userType = localStorage.getItem("user_type");
    const guideShown = getCookie("guideShown");
    if ((userType === "ProcessOwner" || userType === "Admin") && !guideShown) {
      startGuide();
    }
  }, []);

  const fetchDocumentTypes = async () => {
    // Don't set loading here since it's a background operation
    try {
      const response = await listElementAttributeType({
        ModuleTypeID: presistStore.ModuleTypeID,
        IsPagination: true,
        Page: 1,
        PageSize: 10,
        SortField: "CreatedDate",
        SortOrder: "DESC",
        Search: "",
      });
      if (response?.status === 200) {
        console.log(
          "Element Attributes length:",
          response.data.data.elementAttributes.length
        );
        await setAttriutelist(response.data.data.elementAttributes || []);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching document types:", error);
    }
    // Don't set loading false here
  };

  // Call API when page opens
  useEffect(() => {
    if (presistStore?.ModuleTypeID) {
      fetchDocumentTypes();
    }
  }, [presistStore?.ModuleTypeID]);

  // Existing effect for dropdown
  useEffect(() => {
    if (showDropdown) {
      fetchDocumentTypes();
    }
  }, [presistStore.ModuleTypeID, showDropdown]);

  const startGuide = () => {
    const currentPath = window.location.pathname;
    let filteredSteps = guideData.steps.filter(
      (step) =>
        step.element !== ".training_simulation-button" &&
        step.element !== ".sop-button" &&
        step.element !== ".test-simulation-button" &&
        step.element !== ".test-mcqs-button" &&
        step.element !== ".document-button"
    );

    const pageToStepMap = {
      "/sops": ".sop-button",
      "/training-simulations": ".training_simulation-button",
      "/test-simulations": ".test-simulation-button",
      "/test-mcqs": ".test-mcqs-button",
      "/documents": ".document-button",
    };
    const selectedStep = guideData.steps.find(
      (step) => step.element === pageToStepMap[currentPath]
    );
    if (selectedStep) {
      filteredSteps.push(selectedStep);
    }
    filteredSteps = filteredSteps.filter(Boolean);
    const totalSteps = filteredSteps.length;
    if (totalSteps > 0) {
      filteredSteps = filteredSteps.map((step, index) => ({
        ...step,
        title: `Step ${index + 1} of ${totalSteps}`,
      }));
      const intro = introJs();
      intro.start();
      setCookie("guideShown", "true", 365);
    }
  };

  const isPublished = (item) => {
    return (
      item?.DocumentStatus === "Published" ||
      item?.TrainingSimulationStatus === "Published" ||
      item?.SOPStatus === "Published" ||
      item?.TestSimulationStatus === "Published" ||
      item?.TestMCQStatus === "Published" ||
      item?.FormStatus === "Published"
    );
  };

  const sortFoldersByName = (folders, ascending = true) => {
    return [...folders].sort((a, b) => {
      const nameA = (a.ContentName || "").toLowerCase();
      const nameB = (b.ContentName || "").toLowerCase();
      if (nameA < nameB) return ascending ? -1 : 1;
      if (nameA > nameB) return ascending ? 1 : -1;
      return 0;
    });
  };
  const sortDocsByName = (docs, ascending = true) => {
    return [...docs].sort((a, b) => {
      const nameA = (Getname(a) || "").toLowerCase();
      const nameB = (Getname(b) || "").toLowerCase();
      if (nameA < nameB) return ascending ? -1 : 1;
      if (nameA > nameB) return ascending ? 1 : -1;
      return 0;
    });
  };
  let folderData = [...(elementsStore.data || [])];
  if (templateFilesData?.data && templateFilesData.data.length > 0) {
    const combinedFolders = [...folderData, ...templateFilesData.data];
    folderData = removeDuplicates(combinedFolders, "ContentID");
  }
  const isDocumentsPath = window.location.pathname === "/documents";
  const userType = localStorage.getItem("user_type");
  if (
    presistStore?.ContentID == null &&
    isDocumentsPath &&
    userType === "ProcessOwner"
  ) {
    folderData = [STATIC_TEMPLATE_FOLDER, ...folderData];
  }

  let docsData = [...(elementsStore.docs || [])];

  if (templateFilesData?.docs && templateFilesData.docs.length > 0) {
    const combinedDocs = [...docsData];

    templateFilesData.docs.forEach((doc) => {
      const idField = doc.ModuleName + "ID";
      const exists = combinedDocs.some(
        (existingDoc) =>
          existingDoc.ModuleName === doc.ModuleName &&
          existingDoc[idField] === doc[idField]
      );

      if (!exists) {
        combinedDocs.push(doc);
      }
    });

    docsData = combinedDocs;
  }

  // Apply filters
  if (filterOption === "Published") {
    docsData = docsData.filter((item) => isPublished(item));
  }

  if (filterOption === "NameAsc") {
    folderData = sortFoldersByName(folderData, true);
    docsData = sortDocsByName(docsData, true);
  } else if (filterOption === "NameDesc") {
    folderData = sortFoldersByName(folderData, false);
    docsData = sortDocsByName(docsData, false);
  }

  const combinedData = [...folderData, ...docsData];
  const totalPages = Math.ceil(combinedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pageData = combinedData.slice(startIndex, endIndex);
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  const handleFilterSelect = (option) => {
    setFilterOption(option);
    handleFilterClose();
  };
  const disabledModule = () => {
    if (
      presistStore?.ContentID &&
      attriutelist?.length > 0 &&
      moduleName === "Document"
    ) {
      return false;
    } else if (presistStore?.ContentID && moduleName !== "Document") {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    setDeleteTemplateDocxID(presistStore?.DocumentID);
  }, [presistStore?.DocumentID]);
  useEffect(() => {
    const onlyofficeloader = localStorage.getItem("saveAsDraftClicked");

    if (onlyofficeloader) {
      const timeout = setTimeout(() => {
        localStorage.removeItem("saveAsDraftClicked");
      }, 30000);

      return () => clearTimeout(timeout);
    }
  }, []);

  const [showLoader, setShowLoader] = useState(false);
  const [showLoaderTwo, setShowLoaderTwo] = useState(false);

  useEffect(() => {
    const onlyofficeloadertwo = localStorage.getItem("saveAndSendClicked");

    if (onlyofficeloadertwo) {
      const timeout = setTimeout(() => {
        localStorage.removeItem("saveAndSendClicked");
        console.log(
          "saveAndSendClicked removed from localStorage after 30 seconds"
        );
      }, 30000);

      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    const checkSaveAsDraftClicked = () => {
      const onlyofficeloader = localStorage.getItem("saveAsDraftClicked");
      setShowLoader(!!onlyofficeloader);
    };
    checkSaveAsDraftClicked();
    const interval = setInterval(() => {
      checkSaveAsDraftClicked();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkSaveAndSendClicked = () => {
      const onlyofficeloadertwo = localStorage.getItem("saveAndSendClicked");
      setShowLoaderTwo(!!onlyofficeloadertwo);
    };
    checkSaveAndSendClicked();
    const interval = setInterval(() => {
      checkSaveAndSendClicked();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (showLoaderTwo) {
    return (
      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={true}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={Pageloader}
            alt="loader"
            style={{ height: "25%", width: "25%" }}
          />
        </div>
      </Backdrop>
    );
  }

  if (showLoader) {
    return (
      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={true}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={Pageloader}
            alt="loader"
            style={{ height: "25%", width: "25%" }}
          />
        </div>
      </Backdrop>
    );
  }
  return (
    <>
      <BackgroundMeshBox sx={{ height: "100%" }}>
        <DeleteModal
          open={isModalOpen}
          onClose={closeModal}
          isDeleting={isDeleting}
          deleteTemplateDocxID={deleteTemplateDocxID}
          onConfirm={deleteFunction}
        />
        {isSelectUserModalOpen && (
          <SelectUsersModal
            open={isSelectUserModalOpen}
            onClose={() => setIsSelectUserModalOpen(false)}
            data={{
              selectedDepartmentNames: assignedDepartments.map(
                (item) => item.DepartmentName
              ),
              selectedRoleNames: assignedRoles.map((item) => item.RoleName),
              departments: assignedDepartments.map((item) => item.DepartmentID),
              roles: assignedRoles.map((item) => item.RoleID),
              ...bodyData,
              IsRevoke: true,
            }}
            onAction={onRevokeAssignmentHandler}
            isLoading={isRevoking}
            isRevoking={true}
          />
        )}

        <div
          className="auto-finance-container"
          style={{
            position: "relative",
            marginBottom: "7rem",
            backgroundColor: theme.palette.default,
            color: theme.palette.text.primary,
            height: "100%",
          }}
        >
          <div
            style={{
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              display: "flex",
            }}
          >
            <Breadcrumbs
              // Use combined breadcrumbs if template data exists, otherwise use regular breadcrumbs
              bredcrumbs={
                templateFilesData?.bredcrumbs || elementsStore?.bredcrumbs
              }
              folders={folders}
              handleFolderClick={handleFolderClick}
              isBack={false}
              addNew={
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  {moduleName === "Document" ? (
                    <>
                      <Tooltip
                        title={
                          isSyncing
                            ? "This may take a while"
                            : modifiedLastSynced
                            ? `Last synced: ${modifiedLastSynced}`
                            : "Sync documents"
                        }
                      ></Tooltip>
                    </>
                  ) : null}
                  {moduleName === "Document" || moduleName === "SOP" ? (
                    <DocumentTypList />
                  ) : null}{" "}
                  <Tooltip
                    title={
                      exportingDocuments
                        ? t("exportingDocuments")
                        : elementsStore?.docs?.length === 0
                        ? t("noDocumentsToExport")
                        : `Export ${elementsStore?.docs?.length} ${
                            elementsStore?.docs?.length > 1
                              ? t("documents")
                              : "document"
                          }`
                    }
                  >
                    <span>
                      <Button
                        disabled={
                          elementsStore?.docs?.length === 0 ||
                          exportingDocuments
                        }
                        variant="contained"
                        onClick={documentExportHandler}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {exportingDocuments
                          ? t("exporting_text")
                          : t("export_excel_button")}
                        <img src={excelIcons} alt="" width={22} height={22} />
                      </Button>
                    </span>
                  </Tooltip>
                  <Button
                    variant="contained"
                    disabled={
                      !presistStore?.IsCanEdit &&
                      presistStore?.ContentID !== null &&
                      presistStore?.ContentName !== "Create Template"
                    }
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                      setShowDocumentDropdown(!showDocumentDropdown);
                      localStorage.removeItem("moduleAction");
                    }}
                    className="new-button"
                  >
                    {t("New")}
                    <span>
                      <img
                        src={plus}
                        alt=""
                        style={{
                          height: "20px",
                          width: "20px",
                        }}
                      />
                    </span>
                  </Button>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      padding: "5px 10px",
                      width: "80px",
                      height: "40px",
                    }}
                  >
                    <GridView
                      sx={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        color:
                          selectedOption === "Folder"
                            ? (theme) => theme.palette.primary.main
                            : "gray",
                      }}
                      onClick={() => setSelectedOption("Folder")}
                    />
                    <ListRounded
                      sx={{
                        width: "25px",
                        height: "30px",
                        cursor: "pointer",
                        color:
                          selectedOption === "View"
                            ? (theme) => theme.palette.primary.main
                            : "gray",
                      }}
                      onClick={() => setSelectedOption("View")}
                    />
                  </Box>
                </div>
              }
            />

            {/* The filter icon in top-right */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <Tooltip title={t("filter")}>
                <div
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "5px 5px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    gap: "2px",
                    marginRight: "1rem",
                    justifyContent: "end",
                    cursor: "pointer",
                  }}
                  onClick={handleFilterClick}
                >
                  <IconButton size="small">
                    <FilterList fontSize="small" />
                  </IconButton>
                </div>
              </Tooltip>
              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
                TransitionComponent={Grow}
                style={{ fontSize: "12px" }}
              >
                <MenuItem
                  onClick={() => handleFilterSelect("NameAsc")}
                  className="filtermenyitem"
                  style={{
                    color:
                      filterOption === "NameAsc"
                        ? theme.palette.primary.main
                        : "inherit",
                  }}
                >
                  <ListItemIcon>
                    <ArrowUpward fontSize="small" />
                  </ListItemIcon>
                  {t("name_ascending")}
                </MenuItem>
                <MenuItem
                  onClick={() => handleFilterSelect("NameDesc")}
                  className="filtermenyitem"
                  style={{
                    color:
                      filterOption === "NameDesc"
                        ? theme.palette.primary.main
                        : "inherit",
                  }}
                >
                  <ListItemIcon>
                    <ArrowDownward fontSize="small" />
                  </ListItemIcon>
                  {t("name_descending")}
                </MenuItem>
                {/* {userRole !== "EndUser" && (
                  <MenuItem
                    onClick={() => handleFilterSelect("Published")}
                    className="filtermenyitem"
                    style={{
                      color:
                        filterOption === "Published"
                          ? theme.palette.primary.main
                          : "inherit",
                    }}
                  >
                    <ListItemIcon>
                      <Check fontSize="small" />
                    </ListItemIcon>
                    {t("published")}
                  </MenuItem>
                )} */}
              </Menu>
            </div>
          </div>

          {userRole !== "EndUser" && myTask !== "EndUser" && (
            <div className="status-wrapper">
              {t("Status")} :{" "}
              <span
                className="draft"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  width: "120px",
                  justifyContent: "space-around",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    marginRight: "0.8rem",
                    borderRadius: "50%",
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <>{t("InDraft")}</>
              </span>
              <span
                className="inProgress"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  width: "120px",
                  justifyContent: "space-around",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    marginRight: "0.8rem",
                    borderRadius: "50%",
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <>{t("InProgress")}</>
              </span>
              <span
                className="published_"
                style={{
                  position: "relative",
                  marginRight: "20px",
                  display: "flex",
                  justifyContent: "space-around",
                  width: "120px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    marginRight: "0.5rem",
                    borderRadius: "50%",
                    position: "absolute",
                    left: "11px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                {t("Published")}
              </span>
            </div>
          )}

          {showDropdown && (
            <Card
              ref={dropdownRef}
              style={{
                position: "absolute",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                padding: "10px",
                boxShadow: theme.shadows[3],
                width: "200px",
                zIndex: 10,
                top: "50px",
                right: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",

                  padding: "5px 0",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setNewCategoryModalOpen(true);
                  setEditCategory(null);
                }}
                className="category-button"
              >
                <img
                  src={category}
                  alt="Category"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "8px",
                  }}
                />
                <span
                  style={{
                    flexGrow: 1,
                    marginLeft: "8px",
                    fontWeight: "450",
                    fontSize: "16px",
                  }}
                >
                  {t("Category")}
                </span>
              </div>
              <div>
                {moduleName ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 0",
                      cursor:
                        !disabledModule() &&
                        (moduleName === "SOP" || moduleName === "Document"
                          ? attriutelist?.length > 0
                          : true)
                          ? "pointer"
                          : "not-allowed",
                      opacity:
                        !disabledModule() &&
                        (moduleName === "SOP" || moduleName === "Document"
                          ? attriutelist?.length > 0
                          : true)
                          ? 1
                          : 0.5,
                    }}
                    onClick={() => {
                      if (
                        disabledModule() ||
                        ((moduleName === "SOP" || moduleName === "Document") &&
                          attriutelist?.length === 0)
                      )
                        return;
                      setModuleID(null);
                      handleItemClick(moduleName);
                      setIsSOPWithWorkFlowClicked(false);
                    }}
                    className={`${
                      moduleName !== "SOP" ? "training_simulation-button" : ""
                    } ${
                      moduleName !== "TrainingSimulation" ? "sop-button" : ""
                    }`}
                  >
                    {(moduleName === "SOP" || moduleName === "Document") &&
                    attriutelist?.length === 0 &&
                    !disabledModule() ? (
                      <Tooltip
                        title={
                          attriutelist?.length === 0
                            ? "Create an element attribute first"
                            : "Create an Category"
                        }
                      >
                        <Box display="flex" alignItems="center">
                          <img
                            src={threelayer}
                            alt={moduleName}
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "8px",
                            }}
                          />
                          <span
                            style={{
                              flexGrow: 1,
                              marginLeft: "8px",
                              fontWeight: "450",
                              fontSize: "16px",
                              color: presistStore?.ContentID
                                ? "inherit"
                                : "#999",
                            }}
                          >
                            {moduleName}
                          </span>
                        </Box>
                      </Tooltip>
                    ) : (
                      <Box
                        display="flex"
                        alignItems="center"
                        onClick={() => {
                          if (
                            (moduleName === "SOP" ||
                              moduleName === "Document") &&
                            attriutelist?.length === 0
                          )
                            return;
                          localStorage.removeItem("onlyofficeModal");
                          console.log(
                            "onlyofficeModal removed from localStorage"
                          );
                        }}
                      >
                        <img
                          src={threelayer}
                          alt={moduleName}
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "8px",
                          }}
                        />
                        <span
                          style={{
                            flexGrow: 1,
                            marginLeft: "8px",
                            fontWeight: "450",
                            fontSize: "16px",
                            color:
                              presistStore?.ContentID &&
                              (moduleName === "SOP" || moduleName === "Document"
                                ? attriutelist?.length > 0
                                : true)
                                ? "inherit"
                                : "#999",
                          }}
                        >
                          {moduleName}
                        </span>
                      </Box>
                    )}
                  </div>
                ) : null}
              </div>
              <div>
                {moduleName === "Document" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 0",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setModuleID(null);
                      handleItemClick("BulkDocument");
                    }}
                  >
                    <img
                      src={threelayer}
                      alt="Bulk Document"
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "8px",
                      }}
                    />
                    <span
                      style={{
                        flexGrow: 1,
                        marginLeft: "8px",
                        fontWeight: "450",
                        fontSize: "16px",
                      }}
                    >
                      {t("BulkDocument")}
                    </span>
                  </div>
                )}
              </div>
              <div>
                {moduleName === "SkillBuilding" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 0",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setShowBulkSkillBuildingUpload(true);
                    }}
                  >
                    <img
                      src={threelayer}
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "8px",
                      }}
                    />
                    <span
                      style={{
                        flexGrow: 1,
                        marginLeft: "8px",
                        fontWeight: "450",
                        fontSize: "16px",
                      }}
                    >
                      BulkSkillBuilding
                    </span>
                  </div>
                )}
              </div>
              <div>
                {moduleName === "SkillAssessment" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 0",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setShowBulkSkillAssessmentUpload(true);
                    }}
                  >
                    <img
                      src={threelayer}
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "8px",
                      }}
                    />
                    <span
                      style={{
                        flexGrow: 1,
                        marginLeft: "8px",
                        fontWeight: "450",
                        fontSize: "16px",
                      }}
                    >
                      BulkSkillAssessment
                    </span>
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px 0",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setActionType("assign");
                  setHideUnhide(false);
                  setShowCheckbox(true);
                  setShowDropdown(false);
                }}
              >
                <img
                  src={assign}
                  alt="Assign"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "8px",
                  }}
                />
                <span
                  style={{
                    flexGrow: 1,
                    marginLeft: "8px",
                    fontWeight: "450",
                    fontSize: "16px",
                  }}
                >
                  {t("Assign")}
                </span>
              </div>
              {userData?.IsContentAndmin && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px 0",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setActionType("assignCategory");
                    setHideUnhide(false);
                    setShowCheckbox(true);
                    setShowDropdown(false);
                    setSelectedCategory([]);
                  }}
                >
                  <img
                    src={assign}
                    alt="Assign Category"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "8px",
                    }}
                  />
                  <span
                    style={{
                      flexGrow: 1,
                      marginLeft: "8px",
                      fontWeight: "450",
                      fontSize: "16px",
                    }}
                  >
                    {t("Assign Category")}
                  </span>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px 0",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setActionType("move");
                  setHideUnhide(false);
                  setShowCheckbox(true);
                  setShowDropdown(false);
                }}
              >
                <img
                  src={movefile}
                  alt="Move File"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "8px",
                  }}
                />
                <span
                  style={{
                    flexGrow: 1,
                    marginLeft: "8px",
                    fontWeight: "450",
                    fontSize: "16px",
                  }}
                >
                  {t("move_file")}
                </span>
              </div>

              {allowedHideUnhideModules.includes(moduleName) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px 0",
                    cursor: "pointer",
                  }}
                  onClick={handleHideClick}
                >
                  <img
                    src={elementHidden}
                    alt="Hide/Unhide"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "8px",
                    }}
                  />
                  <span
                    style={{
                      flexGrow: 1,
                      marginLeft: "8px",
                      fontWeight: "450",
                      fontSize: "16px",
                    }}
                  >
                    {t("HideUnhide")}
                  </span>
                </div>
              )}
            </Card>
          )}

          <div
            className="grid-container"
            style={{
              color: theme.palette.text.primary,
              paddingBottom: showCheckbox ? "6rem" : "1.5rem",
            }}
          >
            {selectedOption === "Folder" ? (
              folderData?.length > 0 &&
              folderData?.map((item, index) => (
                <div
                  key={index}
                  className={`grid-item${
                    onCheckboxSelect(item) ? "-active" : ""
                  }`}
                  color="primary"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    marginTop: "10px",
                    backgroundColor: item?.IsStaticTemplate
                      ? "#e6f7ff"
                      : "#f8f7ff",
                    color: theme.palette.text.primary,
                    cursor: showCheckbox ? "default" : "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      color: theme.palette.text.primary,
                    }}
                    onClick={() => HandleItemClick(item)}
                    className="text-truncate"
                    title={item?.ContentName}
                  >
                    <Badge
                      badgeContent={item.NosOfChildPublishElements || 0}
                      color="primary"
                      sx={{
                        "& .MuiBadge-badge": {
                          margin: "6px !important",
                          position: "absolute",
                          top: "-6px",
                        },
                      }}
                    >
                      <img src={fileIcon} alt="Icon" className="file-icon" />
                    </Badge>
                    <Typography
                      style={{
                        marginLeft: "10px",
                        marginBottom: "0px",
                        fontWeight: 500,

                        fontSize: 14,
                        color: "#000000DE",
                      }}
                      fontSize={"medium"}
                    >
                      {item?.ContentName || "Data Not Available"}
                    </Typography>
                  </div>

                  {isProcessOwnerOrAdmin && (
                    <div
                      style={{
                        marginLeft: "auto",
                        marginTop: "5px",
                        marginRight: "5px",
                      }}
                    >
                      {showCheckbox &&
                      isSelectingFolder?.ContentID !== item?.ContentID &&
                      item?.ContentName?.toLowerCase() !== "templates" ? (
                        <Checkbox
                          sx={{ p: 0, m: 0 }}
                          type="checkbox"
                          disabled={
                            isSelectingFolder ||
                            item?.ContentName?.toLowerCase() === "templates" ||
                            isTemplatesBreadcrumb
                          }
                          checked={onCheckboxSelect(item)}
                          onChange={(e) =>
                            handleCheckboxChange(item, e.target.checked)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : showCheckbox &&
                        isSelectingFolder &&
                        isSelectingFolder?.ContentID === item?.ContentID ? (
                        <Stack spacing={1} direction="row">
                          <Skeleton
                            variant="rectangular"
                            width={18}
                            height={18}
                          />
                        </Stack>
                      ) : (
                        !isSelectingFolder &&
                        item?.ContentName?.toLowerCase() !== "templates" &&
                        item?.IsCanEdit && (
                          <img
                            src={threedot}
                            alt="threedot"
                            className="three-dot-menu"
                            onClick={(e) => {
                              e.stopPropagation();
                              setThreeDotClickedData(item); // <-- store clicked data
                              toggleDropdown(index);
                            }}
                            style={{
                              cursor: "pointer",
                              height: "15px",
                              width: "15px",
                            }}
                          />
                        )
                      )}

                      {dropdownIndex === index && (
                        <Card
                          onClick={(e) => e.stopPropagation()}
                          ref={dropdownRef}
                          style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            backgroundColor: "white",
                            border: "2px solid #F2F4F7",
                            borderRadius: "8px",
                            zIndex: 10,
                            width: "150px",
                            marginTop: "5px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "8px 16px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleItemEdit(item)}
                          >
                            <img
                              src={editIcon}
                              alt={"Edit document"}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginRight: "8px",
                              }}
                            />{" "}
                            <span style={{ fontWeight: "400" }}>
                              {t("Update")}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "8px 16px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleItemDelete(item)}
                          >
                            <img
                              src={deleteIcon}
                              alt={"delete category"}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginRight: "8px",
                              }}
                            />{" "}
                            <span style={{ fontWeight: "400" }}>
                              {t("Delete")}
                            </span>
                          </div>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div
                style={{
                  width: "92vw",
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  backgroundColor: "#fafafa",
                  overflow: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "14px",
                    marginTop: "0px",
                    height: "100%",
                    tableLayout: "fixed",
                    boxShadow: "0 4px  8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fff",
                  }}
                >
                  {combinedData.length > 0 && (
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f5f5f5",
                          textAlign: "left",
                          height: "40px",
                        }}
                      >
                        <th style={{ padding: "10px" }}>{t("Name")}</th>
                        <th style={{ padding: "10px" }}>{t("expiry_date")}</th>
                        <th style={{ padding: "10px" }}>{t("file_count")} </th>
                        <th style={{ padding: "10px" }}>
                          {t("Category Count")}
                        </th>
                        <th style={{ padding: "10px" }}>
                          {t("Published Count")}
                        </th>
                        <th style={{ padding: "10px" }}></th>
                      </tr>
                    </thead>
                  )}

                  <tbody>
                    {pageData.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          height: "40px",
                          transition: "background-color 0.3s",
                          cursor: "pointer",
                        }}
                        onClick={() => HandleItemClick(item)}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f9f9f9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <td
                          style={{
                            padding: "10px",
                            display: "flex",
                            alignItems: "center",
                            height: "40px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {Getname(item) ? (
                            <>
                              <img
                                src={GetDocicon(item, presistStore?.ModuleName)}
                                alt="Icon"
                                className="file-icon"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginRight: "10px",
                                }}
                              />
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  HandleItemDoc(item);
                                }}
                                style={{
                                  fontWeight: "500",
                                  cursor: "pointer",
                                }}
                              >
                                {Getname(item)}
                              </span>
                            </>
                          ) : (
                            <>
                              <span style={{ marginRight: "10px" }}>📁</span>

                              <span style={{ fontWeight: "500" }}>
                                {item?.ContentName || "N/A"}
                              </span>
                            </>
                          )}
                        </td>

                        <td
                          style={{ padding: "10px", verticalAlign: "middle" }}
                        >
                          {GetExpiryDate(item)
                            ? new Date(GetExpiryDate(item)).toLocaleString()
                            : t("No Expiry")}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            verticalAlign: "middle",
                            textAlign: "start",
                            paddingLeft: "35px",
                          }}
                        >
                          {!Getname(item) ? item?.NosOfChildElements || 0 : ""}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            verticalAlign: "middle",
                            textAlign: "start",
                            paddingLeft: "35px",
                          }}
                        >
                          {!Getname(item) ? item?.NosOfChildElements || 0 : ""}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            verticalAlign: "middle",
                            textAlign: "start",
                            paddingLeft: "35px",
                          }}
                        >
                          {!Getname(item)
                            ? item?.NosOfChildPublishElements || 0
                            : ""}
                        </td>

                        <td
                          style={{
                            padding: "10px",
                            textAlign: "center",
                            position: "relative",
                            verticalAlign: "middle",
                          }}
                        >
                          <img
                            src={threedot}
                            alt="More options"
                            className="three-dot-menu"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (Getname(item)) {
                                setThreeDotClickedData(item); // <-- store clicked data
                                toggleDocumentDropdown(index);
                              } else {
                                setThreeDotClickedData(item); // <-- store clicked data
                                toggleTableDropdown(index);
                              }
                            }}
                            style={{
                              cursor: "pointer",
                              height: "15px",
                              width: "15px",
                            }}
                          />

                          {!Getname(item) && tableDropdownIndex === index && (
                            <Card
                              onClick={(e) => e.stopPropagation()}
                              ref={dropdownRef}
                              style={{
                                position: "absolute",
                                top: "100%",
                                right: 0,
                                backgroundColor: "white",
                                border: "2px solid #F2F4F7",
                                borderRadius: "8px",
                                zIndex: 10,
                                width: "150px",
                                marginTop: "5px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "8px 16px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleItemEdit(item)}
                              >
                                <img
                                  src={editIcon}
                                  alt={"Edit document"}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    marginRight: "8px",
                                  }}
                                />
                                <span style={{ fontWeight: "400" }}>
                                  {t("Update")}
                                </span>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "8px 16px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleItemDelete(item)}
                              >
                                <img
                                  src={deleteIcon}
                                  alt={"delete category"}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    marginRight: "8px",
                                  }}
                                />
                                <span style={{ fontWeight: "400" }}>
                                  {t("Delete")}
                                </span>
                              </div>
                            </Card>
                          )}

                          {/* The new dropdown for actual docs with names */}
                          {Getname(item) && documentDropdownIndex === index && (
                            <Card
                              onClick={(e) => e.stopPropagation()}
                              ref={documentDropdownRef}
                              style={{
                                position: "absolute",
                                top: "100%",
                                right: "160px",
                                backgroundColor: "white",
                                border: "2px solid #F2F4F7",
                                borderRadius: "8px",
                                zIndex: 9999,
                                minWidth: "150px",
                                maxWidth: "220px",
                                marginTop: "5px",
                              }}
                            >
                              <Stack
                                direction={"row"}
                                style={{
                                  padding: "8px 16px",
                                }}
                                onClick={() => {
                                  localStorage.removeItem("onlyofficeModal");
                                  onEditClickHandler(item);
                                }}
                              >
                                <img
                                  src={editIcon}
                                  alt={"Edit document"}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    marginRight: "8px",
                                    opacity: item.IsCanEdit ? 1 : 0.6,
                                  }}
                                />
                                <Typography style={{ fontWeight: "400" }}>
                                  {t("Edit")}
                                </Typography>
                              </Stack>

                              <Stack
                                direction={"row"}
                                style={{
                                  padding: "8px 16px",
                                  cursor: "pointer",
                                }}
                                onClick={() => onModuleDeleteHandler(item)}
                              >
                                <img
                                  src={deleteIcon}
                                  alt="Delete"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    marginRight: "8px",
                                  }}
                                />
                                <Typography style={{ fontWeight: "400" }}>
                                  {t("Delete")}
                                </Typography>
                              </Stack>
                              {!isTemplatesBreadcrumb && (
                                <>
                                  <Stack
                                    direction={"row"}
                                    style={{
                                      padding: "8px 16px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setOpenActivity(true);
                                      setActivityContent(item);
                                    }}
                                  >
                                    <img
                                      src={activityIcon}
                                      alt="Activity"
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        marginRight: "8px",
                                      }}
                                    />
                                    <Typography style={{ fontWeight: "400" }}>
                                      {t("Activity")}
                                    </Typography>
                                  </Stack>

                                  <Stack
                                    direction={"row"}
                                    style={{
                                      padding: "8px 16px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setSelectedUserModalData(item);
                                      fetchRolesAndDepartmentsForAssignedElement(
                                        item
                                      );
                                    }}
                                  >
                                    <img
                                      src={revokeAssignmentIcon}
                                      alt="Revoke Assignment"
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        marginRight: "8px",
                                      }}
                                    />
                                    <Typography style={{ fontWeight: "400" }}>
                                      {t("RevokeAssignment")}
                                    </Typography>
                                  </Stack>

                                  {allowedHideUnhideModules.includes(
                                    moduleName
                                  ) &&
                                    (() => {
                                      const isHiddenField =
                                        item?.ModuleName + "IsHidden";
                                      return (
                                        <Stack
                                          direction={"row"}
                                          style={{
                                            padding: "8px 16px",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            handleHide(!item[isHiddenField], [
                                              item,
                                            ]);
                                          }}
                                          className="hide_unhide-button"
                                        >
                                          <img
                                            src={
                                              item[isHiddenField]
                                                ? elementUnHidden
                                                : elementHidden
                                            }
                                            alt="Hide/Unhide"
                                            style={{
                                              width: "20px",
                                              height: "20px",
                                              marginRight: "8px",
                                            }}
                                          />
                                          <Typography
                                            style={{ fontWeight: "400" }}
                                          >
                                            {item[isHiddenField]
                                              ? t("Unhide")
                                              : t("Hide")}
                                          </Typography>
                                        </Stack>
                                      );
                                    })()}
                                </>
                              )}
                            </Card>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {combinedData.length > 0 && (
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      marginTop: "10px",
                      padding: "8px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "14px",
                    }}
                  >
                    <div>
                      <span style={{ marginRight: "8px" }}>
                        {t("rows_per_page")}
                      </span>
                      <select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      >
                        {[5, 10].map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ marginLeft: "16px" }}>
                      {startIndex + 1}–{Math.min(endIndex, combinedData.length)}{" "}
                      of {combinedData.length}
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        style={{
                          padding: "4px 12px 2px 12px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          backgroundColor: currentPage === 1 ? "#eee" : "#fff",
                          cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        }}
                      >
                        <FaArrowLeft />
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        style={{
                          padding: "4px 12px 2px 12px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          backgroundColor:
                            currentPage === totalPages ? "#eee" : "#fff",
                          cursor:
                            currentPage === totalPages
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* If selectedOption === "Folder", also show docs below the folder blocks */}
            {selectedOption === "Folder" &&
              docsData?.length > 0 &&
              docsData?.map((item, index) => {
                const isHiddenField = item?.ModuleName + "IsHidden";
                return (
                  <div
                    key={index}
                    className={`grid-item${
                      onCheckboxSelect(item) ? "-active" : ""
                    }`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "16px",
                      alignItems: "center",
                      position: "relative",
                      cursor: showCheckbox ? "default" : "pointer",
                      backgroundColor: "#f8f7ff",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {userRole !== "EndUser" && (
                      <div
                        style={{
                          width: "8px",
                          height: "100%",
                          marginRight: "0.8rem",
                          borderRadius: "10px 0px 0px 10px",
                          position: "absolute",
                          left: "0%",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor:
                            item?.DocumentStatus === "Published" ||
                            item?.TrainingSimulationStatus === "Published" ||
                            item?.SOPStatus === "Published" ||
                            item?.TestSimulationStatus === "Published" ||
                            item?.TestMCQStatus === "Published" ||
                            item?.FormStatus === "Published"
                              ? "#eab308"
                              : item?.DocumentStatus === "InProgress" ||
                                item?.TrainingSimulationStatus ===
                                  "InProgress" ||
                                item?.SOPStatus === "InProgress" ||
                                item?.TestSimulationStatus === "InProgress" ||
                                item?.TestMCQStatus === "InProgress" ||
                                item?.FormStatus === "InProgress"
                              ? "#3B82F6"
                              : "#16a34a",
                        }}
                      />
                    )}
                    <div
                      className="item-content"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        color: theme.palette.text.primary,
                      }}
                      onClick={() => HandleItemDoc(item)}
                    >
                      <img
                        src={GetDocicon(item, presistStore?.ModuleName)}
                        alt="Icon"
                        className="file-icon"
                        style={{
                          marginLeft: "4%",
                        }}
                      />
                      <Typography
                        style={{
                          marginLeft: "10px",
                          marginBottom: "0px",
                          fontWeight: "500",
                          fontSize: 14,
                        }}
                        fontSize={"medium"}
                      >
                        {Getname(item) || "Data Not Available"}
                        {selectedContentName !== "Create Template" && (
                          <>{`${" "}\u00A0(${item?.SequenceNumber})`}</>
                        )}
                      </Typography>
                    </div>
                    {isProcessOwnerOrAdmin && (
                      <div
                        style={{
                          marginLeft: "auto",
                          marginTop: "5px",
                          marginRight: "5px",
                        }}
                      >
                        {showCheckbox && item.IsCanAssign !== false ? (
                          <Checkbox
                            type="checkbox"
                            checked={onCheckboxSelect(item)}
                            disabled={isTemplatesBreadcrumb}
                            onChange={(e) =>
                              handleCheckboxChange(item, e.target.checked)
                            }
                            style={{
                              height: "40px",
                              cursor: "pointer",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          (item?.IsCanEdit === true ||
                            item?.IsCanEdit === undefined) && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <img
                              src={threedot}
                              alt=""
                              className="three-dot-menu"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item?.IsCanEdit === true || item?.IsCanEdit === undefined) {
                                setThreeDotClickedData(item);
                                toggleDocumentDropdown(index);
                                }
                              }}
                              style={{
                                // cursor: item?.IsCanEdit === true ? "pointer" : "not-allowed",
                                height: "15px",
                                width: "15px",
                                // opacity: item?.IsCanEdit === true ? 1 : 0.3,
                              }}
                            />
                          </div>
                          )
                        )}
                        {documentDropdownIndex === index && (
                          <Card
                            onClick={(e) => e.stopPropagation()}
                            ref={documentDropdownRef}
                            style={{
                              position: "absolute",
                              top: "100%",
                              right: "0",
                              backgroundColor: "white",
                              border: "2px solid #F2F4F7",
                              borderRadius: "8px",
                              zIndex: 10,
                              minWidth: "150px",
                              maxidth: "220px",
                              marginTop: "5px",
                            }}
                          >
                            <Stack
                              direction={"row"}
                              style={{
                                padding: "8px 16px",
                              }}
                              onClick={() => {
                                localStorage.removeItem("onlyofficeModal");
                                onEditClickHandler(item);
                              }}
                            >
                              <img
                                src={editIcon}
                                alt={"Edit document"}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginRight: "8px",
                                  opacity: item.IsCanEdit ? 1 : 0.6,
                                }}
                              />
                              <Typography style={{ fontWeight: "400" }}>
                                {t("Edit")}
                              </Typography>
                            </Stack>

                            <Stack
                              direction={"row"}
                              style={{
                                padding: "8px 16px",
                                cursor: "pointer",
                              }}
                              onClick={() => onModuleDeleteHandler(item)}
                            >
                              <img
                                src={deleteIcon}
                                alt="Delete"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginRight: "8px",
                                }}
                              />
                              <Typography style={{ fontWeight: "400" }}>
                                {t("Delete")}
                              </Typography>
                            </Stack>
                            {!isTemplatesBreadcrumb && (
                              <>
                                <Stack
                                  direction={"row"}
                                  style={{
                                    padding: "8px 16px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setOpenActivity(true);
                                    setActivityContent(item);
                                  }}
                                >
                                  <img
                                    src={activityIcon}
                                    alt="Activity"
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      marginRight: "8px",
                                    }}
                                  />
                                  <Typography style={{ fontWeight: "400" }}>
                                    {t("Activity")}
                                  </Typography>
                                </Stack>

                                {selectedContentName !== "Create Template" && (
                                  <Stack
                                    direction={"row"} 
                                    style={{
                                      padding: "8px 16px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setSelectedUserModalData(item);
                                      fetchRolesAndDepartmentsForAssignedElement(
                                        item
                                      );
                                    }}
                                  >
                                    <img
                                      src={revokeAssignmentIcon}
                                      alt="Revoke Assignment"
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        marginRight: "8px",
                                      }}
                                    />
                                    <Typography style={{ fontWeight: "400" }}>
                                      {t("RevokeAssignment")}
                                    </Typography>
                                  </Stack>
                                )}

                                {allowedHideUnhideModules.includes(
                                  moduleName
                                ) &&
                                  selectedContentName !== "Create Template" && (
                                    <Stack
                                      direction={"row"}
                                      style={{
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        handleHide(!item[isHiddenField], [
                                          item,
                                        ]);
                                      }}
                                      className="hide_unhide-button"
                                    >
                                      <img
                                        src={
                                          item[isHiddenField]
                                            ? elementUnHidden
                                            : elementHidden
                                        }
                                        alt="Hide/Unhide"
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          marginRight: "8px",
                                        }}
                                      />
                                      <Typography style={{ fontWeight: "400" }}>
                                        {item[isHiddenField]
                                          ? t("Unhide")
                                          : t("Hide")}
                                      </Typography>
                                    </Stack>
                                  )}
                              </>
                            )}
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Only show "No data" message when BOTH data sources are empty */}
          {!loading && !folderData?.length > 0 && !docsData?.length > 0 && (
            <div>
              <Nodata image={true} />
            </div>
          )}

          {showCheckbox && (
            <div
              className="footer-container"
              style={{
                position: "fixed",
                bottom: "20px",
                left: "80px",
                right: "30px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: "10px 20px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={CancelButton}
                  alt="cancel"
                  style={{
                    height: "30px",
                    width: "30px",
                    marginRight: "15px",
                    cursor: "pointer",
                  }}
                  onClick={clearCheckbox}
                />
                <input
                  type="checkbox"
                  checked={isSelectAllChecked}
                  onChange={handleSelectAllChange}
                  disabled={isTemplatesBreadcrumb}
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                    height: "16px",
                    width: "16px",
                  }}
                />
                <span>{t("SelectAll")}</span>
              </div>
              <Stack spacing={1} direction="row" alignItems="center">
                <span style={{ marginRight: "15px" }}>
                  {selectedFiles.length || selectedCategory?.length}{" "}
                  {t("selected")}
                </span>
                {hideUnhide ? (
                  <Stack spacing={1} direction="row">
                    <button
                      disabled={
                        selectedFiles.length === 0 ||
                        isHidingUnhiding ||
                        selectedFiles.every(
                          (item) => item[`${item.ModuleName}IsHidden`]
                        )
                      }
                      style={{
                        backgroundColor:
                          selectedFiles.length === 0 ||
                          isHidingUnhiding ||
                          selectedFiles.every(
                            (item) => item[`${item.ModuleName}IsHidden`]
                          )
                            ? "#ccc"
                            : "#3B82F6",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor:
                          selectedFiles.length === 0 ||
                          isHidingUnhiding ||
                          selectedFiles.every(
                            (item) => item[`${item.ModuleName}IsHidden`]
                          )
                            ? "not-allowed"
                            : "pointer",
                        fontFamily: "Inter",
                        fontWeight: 600,
                      }}
                      onClick={handleHide.bind(this, true, [])}
                    >
                      {t("Hide")}
                    </button>
                    <button
                      disabled={selectedFiles.length === 0 || isHidingUnhiding}
                      style={{
                        backgroundColor:
                          selectedFiles.length === 0 || isHidingUnhiding
                            ? "#ccc"
                            : "#3B82F6",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor:
                          selectedFiles.length === 0 || isHidingUnhiding
                            ? "not-allowed"
                            : "pointer",
                        fontFamily: "Inter",
                        fontWeight: 600,
                      }}
                      onClick={handleHide.bind(this, false, [])}
                    >
                      {t("Unhide")}
                    </button>
                  </Stack>
                ) : actionType === "assign" ||
                  actionType === "assignCategory" ? (
                  <>
                    {actionType === "assign" ? (
                      <button
                        disabled={selectedFiles?.length === 0}
                        style={{
                          backgroundColor:
                            selectedFiles?.length === 0
                              ? "#ccc"
                              : theme.palette.primary.main,
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "4px",
                          cursor:
                            selectedFiles.length === 0
                              ? "not-allowed"
                              : "pointer",
                          fontFamily: "Inter",
                          fontWeight: 600,
                        }}
                        onClick={handleContinue}
                      >
                        {t("Continue")}
                      </button>
                    ) : (
                      <button
                        disabled={selectedCategory.length === 0}
                        style={{
                          backgroundColor:
                            selectedCategory?.length === 0
                              ? "#ccc"
                              : theme.palette.primary.main,
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "4px",
                          cursor:
                            selectedCategory?.length === 0
                              ? "not-allowed"
                              : "pointer",
                          fontFamily: "Inter",
                          fontWeight: 600,
                        }}
                        onClick={handleContinue}
                      >
                        {t("Continue")}
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    disabled={selectedFiles.length === 0}
                    style={{
                      backgroundColor:
                        selectedFiles.length === 0
                          ? "#ccc"
                          : theme.palette.primary.main,
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor:
                        selectedFiles.length === 0 ? "not-allowed" : "pointer",
                      fontFamily: "Inter",
                      fontWeight: 600,
                    }}
                    onClick={() => setOpenMoveModal(true)}
                  >
                    {t("move_to_button")}
                  </button>
                )}
              </Stack>
            </div>
          )}

          {modalOpen && modalType === "SOP" && (
            <NewSOPModal
              open={modalOpen}
              onClose={() => {
                localStorage.removeItem("moduleAction");
                setModalOpen(false);
              }}
              editSOPID={moduleID}
              isSOPWithWorkFlow={
                false
                // moduleID ? isReactFlowData : isSOPWithWorkFlowClicked
              }
            />
          )}
          {modalOpen && modalType === "Document" && (
            <NewDocStepper
              open={true}
              onClose={() => {
                setModalOpen(false);
                setModalType(null);
              }}
              editDocumentID={moduleID}
              ThreeDotClickedData={ThreeDotClickedData}
              onTemplateSaveSuccess={handleTemplateSaveSuccessFromStepper}
            />
          )}
          {modalOpen && modalType === "TrainingSimulation" && (
            <NewTrainingSimulation
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              editTrainingSimulationID={moduleID}
            />
          )}
          {modalOpen && modalType === "TestMCQ" && (
            <NewTestMCQModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              editTestMCQID={moduleID}
            />
          )}
          {modalOpen && modalType === "TestSimulation" && (
            <NewTestSimulation
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              editTestSimulationID={moduleID}
            />
          )}
          {modalOpen && modalType === "Form" && (
            <NewFormModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              editFormID={moduleID}
            />
          )}
          <NewCategory
            open={newCategoryModalOpen}
            onClose={() => setNewCategoryModalOpen(false)}
            editCategory={editCategory}
          />
          {openAssign && (
            <Assign
              open={openAssign}
              setOpen={setOpenAssign}
              selectedItems={selectedFiles}
              clearCheckbox={clearCheckbox}
            />
          )}
          {openAssignCategory && (
            <AssigneCategory
              open={openAssignCategory}
              setOpen={setOpenAssignCategory}
              selectedItems={selectedCategory}
              clearCheckbox={clearCheckbox}
            />
          )}
          {openActivity && (
            <Activity
              open={openActivity}
              onClose={() => setOpenActivity(false)}
              data={activityContent}
            />
          )}
          <Backdrop
            sx={(theme) => ({
              color: "#fff",
              zIndex: theme.zIndex.drawer + 1,
            })}
            open={Loading || loading} // Use both loading states
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={Pageloader}
                alt="loader"
                style={{ height: "25%", width: "25%" }}
              />
            </div>
          </Backdrop>
          <ConfirmDeleteModal
            open={openDeleteModal}
            handleClose={handleCloseModal}
            item={itemToDelete}
            handleDelete={handleDelete}
          />
        </div>
      </BackgroundMeshBox>

      <BulkDocumentUpload
        open={showBulkDocumentUpload}
        onClose={closeBulkDocumentUpload}
        ModuleTypeID={presistStore?.ModuleTypeID}
        fetchData={fetchData}
      />
      <BulkUploadSkillBuilding
        open={showBulkSkillBuildingUpload}
        onClose={() => setShowBulkSkillBuildingUpload(false)}
      />
      <BulkSkillAssessmentModal
        open={showBulkSkillAssessmentUpload}
        onClose={() => setShowBulkSkillAssessmentUpload(false)}
      />
      <MoveToModal
        open={openMoveModal}
        onClose={() => setOpenMoveModal(false)}
        selectedItems={selectedFiles}
      />
    </>
  );
};

export default ElementFolders;
