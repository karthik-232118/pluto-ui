import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Badge,
  keyframes,
  Chip,
} from "@mui/material";
import Pageloader from "../../../../src/assets/image/cubeloader1.gif";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import BPMN from "../../bpmn/BPMN";
import Acknowledge from "../accountopening/acknowledge";
import RiskAndComplianceModal from "./RiskAndComplianceModal";
import RightSection from "../accountopening/RightSection";
import CommonContainer from "../commoncontainer/CommonContainer";
import BackgroundMeshBox from "../../../common/meshbackground/BackgroundMeshBox";
import FlowDiagram from "./FlowDiagram";
import { GetElementsFolderDocument } from "../../../store/elements/action";
import { GetAddFavourites } from "../../../store/favourites/action";
import { GetListRiskAndCompliences } from "../../../store/riskandCompliences/action";
import { GetViewSOPReactFlow } from "../../../store/SOPReactFlow/action";
import { setDetailsData } from "../../../store/details/slice";
import { setSopId } from "../../../store/sopid/Slice";
import { impactAnalysis } from "../../../store/impactAnalysis/ImpactAnalysis";
import { IAcknowledge } from "../../../store/attempts/action";
import bookMark from "../../../assets/svg/accountOpening-Svg/BookMark-blue.svg";
import NoFav from "../../../assets/svg/navbar/favone.svg";
import cicon from "../../../assets/svg/BPMN/cicon.svg";
import risk from "../../../assets/image/accountOpening/risk.svg";
import com from "../../../assets/image/accountOpening/com.svg";
import audit from "../../../assets/svg/accountOpening-Svg/audit.svg";
import impactanalysisIcon from "../../../assets/svg/impactanalysis/impactanalysisIcon.svg";
import { useTranslation } from "react-i18next";
import SourceDoument from "../../../assets/svg/SOPs/SourceDoument.svg";
import download from "../../../assets/svg/SOPs/download.svg";
import ctqIconss from "../../../assets/svg/common/CTQ.svg";

import {
  setIsWorkflowEnabled,
  setRolesData,
  setSelectedImage,
  setSelectedLinks,
} from "../../../store/FlowWithSOP/flowWithSop";
import { updateConfigData } from "../../../store/flow/slice";
import Breadcrumbs from "../../breadcrumbs/Breadcrumbs";
import { ViewSOPReactFlowVesrionOne } from "../../../services/SOPReactFlow/SOPReactFlow";
import { Get_Risk_By_RiskID_API } from "../../../services/sopRisk/SOPRisk";
import jsPDF from "jspdf";
import VersionComparisonModal from "./VersionComparisonModal";
import SOPRiskModal from "./SOPRiskModal";
import SourceDocumentModal from "./SourceDocumentModal";
import { getroles } from "../../../services/enterprise/Enterprise";
import { SopAttachmentListApi } from "../../../services/sopattachmentlist/sopattachmentlist";
import { useHeadingBgColor } from "../../useHeadingBgColor";
import CTQModal from "../../modals/CTQModal";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Sops = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [deviceType, setDeviceType] = useState("Laptop");
  const [diagramMode, setDiagramMode] = useState("ReactFlow");
  const [currentVersionTitles, setCurrentVersionTitles] = useState([]);
  const [previousVersionTitles, setPreviousVersionTitles] = useState([]);
  const [previousVersionId, setPreviousVersionId] = useState(null);
  const [sopDraftID, setSopDraftID] = useState(null);
  const [introSteps, setIntroSteps] = useState([]);
  const [introEnabled, setIntroEnabled] = useState(false);
  const [allRiskDraftIDs, setAllRiskDraftIDs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [newTitles, setNewTitles] = useState([]);
  const [openHeatmapModal, setOpenHeatmapModal] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  const [isSOPLoading, setIsSOPLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [openCTQModal, setOpenCTQModal] = useState(false);

  const [openSourceDocumentModal, setOpenSourceDocumentModal] = useState(false);
  console.log(
    "SOPReactFlowSOPReactFlow:",
    sopDraftID,
    currentVersionTitles,
    previousVersionTitles,
    introSteps,
    introEnabled
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { elementsDocumentFiles, loading } = useSelector(
    (state) => state.elements
  );
  const { sopIDs } = useSelector((state) => state.ids);
  const { RiskAndCompliences } = useSelector(
    (state) => state.RiskAndCompliences
  );
  const { SOPReactFlow } = useSelector((state) => state.SOPReactFlow);

  // console.log(elementsDocumentFiles?.data?.AuditorMessages?.length, "DocumentModuleTypeauffu");

  //   useEffect(() => {
  //   const fetchAttachmentData = async () => {
  //     if (elementsDocumentFiles?.data?.SOPID) {
  //       try {
  //         const attachmentData = await getAttachmentItemList(elementsDocumentFiles.data.SOPID);
  //         console.log("Attachment Item List Data:", attachmentData);
  //       } catch (error) {
  //         console.error("Error fetching attachment items:", error);
  //       }
  //     }
  //   };

  //   fetchAttachmentData();
  // }, [elementsDocumentFiles?.data?.SOPID]);

  useEffect(() => {
    // console.log(
    //   "SOPReactFlowSOPReactFlow:",
    //   SOPReactFlow?.sopModuleDraft?.SOPDraftID
    // );
    setSopDraftID(SOPReactFlow?.sopModuleDraft?.SOPDraftID);
  }, [SOPReactFlow?.sopModuleDraft?.SOPDraftID]);

  useEffect(() => {
    console.log(elementsDocumentFiles?.data?.IsReactFlow, "soppspspspsp");
  }, [elementsDocumentFiles]);

  useEffect(() => {
    const isReactFlow = elementsDocumentFiles?.data?.IsReactFlow;

    if (isReactFlow === true) {
      setDiagramMode("ReactFlow");
    } else if (isReactFlow === false) {
      setDiagramMode("BPMN");
    }
  }, [elementsDocumentFiles?.data?.IsReactFlow]);

  useEffect(() => {
    if (SOPReactFlow?.sopModuleDraft?.SopFlow?.Nodes) {
      const nodes = SOPReactFlow.sopModuleDraft.SopFlow.Nodes;

      console.log("SOPReactFlow:", SOPReactFlow?.sopModuleDraft?.SOPDraftID);

      let allRiskDraftIDs = [];

      nodes.forEach((node) => {
        if (node.RiskDraftID) {
          allRiskDraftIDs = [...allRiskDraftIDs, ...node.RiskDraftID];
        }
      });

      console.log("All RiskDraftIDs:", allRiskDraftIDs);
      setAllRiskDraftIDs(allRiskDraftIDs);
    } else {
      console.log("No SOP React Flow data found.");
    }
  }, [SOPReactFlow]);

  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );

  const actionData = useSelector((state) => state.action.actionData);
  const storedSopId = presistStore.SOPID;
  const fromActionables = location.state?.fromActionables || false;
  const queryParams = new URLSearchParams(location.search);
  const isSOPTrue = queryParams.get("SOP") === "true";
  const isSOPFalse = queryParams.get("SOP") === "false";
  const isMyActionable = queryParams.get("MyActionable") === "true";
  const elementID = useSelector((state) => state.elementid.elementID);
  const { linkedID } = (state) => state.linkedData;
  const userType = localStorage.getItem("user_type");
  const mytask = localStorage.getItem("my_task");
  const bgColor = useHeadingBgColor();
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) setDeviceType("Phone");
      else if (width >= 768 && width < 1024) setDeviceType("Tablet");
      else setDeviceType("Laptop");
    };
    updateDeviceType();
    window.addEventListener("resize", updateDeviceType);
    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  const my_task = localStorage.getItem("my_task");

  useEffect(() => {
    const sopIdToUse = fromActionables
      ? presistStore?.ElementID || elementID
      : id || linkedID || storedSopId || sopIDs[0];
    if (sopIdToUse) {
      const isActionable = isMyActionable
        ? true
        : isSOPTrue
        ? true
        : isSOPFalse
        ? false
        : fromActionables;
      dispatch(setSopId(sopIdToUse));
      if (sopIdToUse) {
        fetchSOPData(sopIdToUse);
      }
      dispatch(
        GetElementsFolderDocument({
          SOPID: sopIdToUse,
          IsActionable: isActionable,
          IsEnableMyTask: my_task ? true : false,
        })
      ).catch((error) =>
        toast.error(error.message || "Failed to fetch SOP data")
      );
    }
  }, [
    id,
    storedSopId,
    elementID,
    sopIDs,
    fromActionables,
    isSOPTrue,
    isSOPFalse,
    isMyActionable,
    linkedID,
    dispatch,
  ]);

  const fetchSOPData = async (sopIdToUse) => {
    setIsSOPLoading(true);
    try {
      await dispatch(
        GetViewSOPReactFlow({
          SOPID: sopIdToUse,
          ModuleTypeID: presistStore.ModuleTypeID,
          ContentID: presistStore.ContentID,
        })
      );
    } catch (error) {
      toast.error(error.message || "Failed to fetch SOP data");
    } finally {
      setIsSOPLoading(false);
    }
  };

  useEffect(() => {
    if (SOPReactFlow?.sopModuleDraft?.SopFlow && presistStore.SOPID !== null) {
      const { Nodes, Edges } = SOPReactFlow.sopModuleDraft.SopFlow;
      console.log(SOPReactFlow.sopModuleDraft);
      for (let i = 0; i < Nodes?.length; i++) {
        const node = Nodes[i];
        let roles = [];
        for (let j = 0; j < node.roles?.length; j++) {
          roles.push(node.roles[j].RoleID);
        }

        let attachments = [];
        for (let k = 0; k < node.clips?.length; k++) {
          const attachment = node.clips[k];
          attachments.push({
            ContentLink: attachment.AttachmentLink,
            ContentLinkTitle: attachment.AttachmentTitle,
            ContentLinkType: attachment.AttachmentType,
            id: attachment.NodeID,
          });
        }

        let images = [];
        for (let k = 0; k < node.images?.length; k++) {
          const img = node.images[k];
          images.push({
            link: img.AttachmentLink,
            title: img.AttachmentTitle,
            type: img.AttachmentType,
            id: img.NodeID,
          });
        }
        if (images.length > 0) {
          dispatch(
            setSelectedImage({
              id: node.id,
              value: {
                link: images[0].link,
                title: images[0].title,
                type: images[0].type,
              },
            })
          );
        }
        dispatch(
          setSelectedLinks({
            id: node.id,
            value: {
              selectedElement: attachments,
            },
          })
        );
        dispatch(
          setRolesData({
            id: node.id,
            value: roles || [],
          })
        );
        for (let l = 0; l < node.properties?.length; l++) {
          const property = node.properties[l];
          for (let m = 0; m < property.NodeProperties?.length; m++) {
            const prop = property.NodeProperties[m];
            dispatch(
              updateConfigData({
                id: property.NodeID,
                value: {
                  title: prop.title,
                  type: prop.title,
                  shapeType: prop.shapeType,
                  color: prop.color,
                },
              })
            );
          }
        }
      }
      const updatedNodes = [];
      for (let i = 0; i < Nodes?.length; i++) {
        updatedNodes.push({
          id: Nodes[i].id,
          type: Nodes[i].type || "default",
          position: Nodes[i].position,
          data: {
            ...Nodes[i].data,
            title: Nodes[i].data?.title || "",
            type: Nodes[i].data?.type || "",
            shapeType: Nodes[i].data?.shapeType || "",
            color: Nodes[i].data?.color || "#ffffff",
            RiskIDs: Nodes[i].RiskDraftID,
          },
        });
      }
      setNodes(updatedNodes);
      const updatedEdges = [];
      for (let i = 0; i < Edges?.length; i++) {
        updatedEdges.push({
          id: Edges[i].id,
          source: Edges[i].source,
          target: Edges[i].target,
          type: Edges[i].type || "step",
          sourceHandle: Edges[i].sourceHandle,
          targetHandle: Edges[i].targetHandle,
        });
      }
      setEdges(updatedEdges);

      dispatch(
        setIsWorkflowEnabled(SOPReactFlow?.sopModuleDraft?.IsSopWithWorkflow)
      );
    } else {
      dispatch(setIsWorkflowEnabled(false));
      dispatch(setSelectedLinks({}));
      dispatch(setRolesData({}));
      dispatch(updateConfigData({}));
      dispatch(setSelectedImage({}));
    }
  }, [SOPReactFlow?.sopModuleDraft, dispatch, presistStore.SOPID]);

  useEffect(() => {
    if (elementsDocumentFiles?.data?.SOPID) {
      dispatch(
        GetListRiskAndCompliences({ SOPID: elementsDocumentFiles.data.SOPID })
      ).catch(() => toast.error("Failed to fetch Risk and Compliance data"));
    }
  }, [elementsDocumentFiles?.data?.SOPID, dispatch]);

  useEffect(() => {
    dispatch(setDetailsData(elementsDocumentFiles?.details));
    if (
      id === undefined ||
      (id === null &&
        presistStore.ModuleTypeID !== null &&
        presistStore.ContentID !== null &&
        presistStore.SOPID !== null)
    ) {
      dispatch(
        GetViewSOPReactFlow({
          ModuleTypeID: presistStore?.ModuleTypeID || actionData?.ModuleTypeID,
          ContentID:
            presistStore?.ContentID || elementsDocumentFiles?.data?.ContentID,
          SOPID: id || presistStore?.SOPID || actionData?.ElementID,
        })
      );
    }
  }, [
    dispatch,
    presistStore.ModuleTypeID,
    presistStore.ContentID,
    presistStore.SOPID,
    elementsDocumentFiles?.details,
    id,
  ]);
  // Handlers
  const handleBookmarkClick = async () => {
    const payload = {
      ModuleTypeID: presistStore.ModuleTypeID,
      ModuleID: presistStore.SOPID,
    };
    try {
      const result = await dispatch(GetAddFavourites(payload)).unwrap();
      toast.success(t("Added to Favorites Successfully") || result.message);
    } catch (error) {
      toast.error(error.message || "already in favourites");
    }
  };
  const handleImpactAnalysisClick = () => {
    const payload = {
      ModuleID: presistStore.SOPID,
      ImpactAnalysisTarget: "SOP",
      name: elementsDocumentFiles?.data?.SOPName,
    };
    localStorage.setItem("impactAnalysisPayload", JSON.stringify(payload));
    dispatch(impactAnalysis(payload));
    navigate("/impact-analysis");
  };
  const handleAcknowledge = async () => {
    const payload = {
      ModuleID: elementsDocumentFiles?.data?.SOPID,
      IsAncknowledged: true,
      MasterVersion: elementsDocumentFiles?.data?.MasterVersion,
    };
    try {
      await dispatch(IAcknowledge(payload)).unwrap();
      const sopIdToUse = fromActionables
        ? elementID
        : id || storedSopId || sopIDs[0];
      await dispatch(
        GetElementsFolderDocument({
          SOPID: sopIdToUse,
          IsActionable: fromActionables,
        })
      );
    } catch (error) {
      toast.error("Failed to acknowledge SOP");
    }
  };
  const handleOpenModal = (heading) => {
    setModalHeading(heading);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setModalHeading("");
  };

  const handleSourceDocumentClick = () => {
    setOpenSourceDocumentModal(true);
  };

  const NoOfRisk =
    elementsDocumentFiles?.data?.RiskAndComplience?.NoOfRisk || 0;
  const NoOfCompliance =
    elementsDocumentFiles?.data?.RiskAndComplience?.NoOfCompliance || 0;
  const NoOfClause =
    elementsDocumentFiles?.data?.RiskAndComplience?.NoOfClause || 0;
  const UserFavorite = elementsDocumentFiles?.data?.UserFavorite || false;
  const isAcknowledged = elementsDocumentFiles?.data?.IsAncknowledged || false;

  const renderDiagram = useMemo(() => {
    if (diagramMode === "ReactFlow") {
      if (
        SOPReactFlow?.sopModuleDraft?.SopFlow &&
        Object.keys(SOPReactFlow.sopModuleDraft.SopFlow).length > 0
      ) {
        return (
          <FlowDiagram nodes={nodes} edges={edges} executionLoading={false} />
        );
      } else if (elementsDocumentFiles?.data?.SOPXMLElement) {
        return (
          <FlowDiagram
            sopXMLElement={elementsDocumentFiles.data.SOPXMLElement}
            executionLoading={false}
          />
        );
      } else {
        return <Typography>No diagram available</Typography>;
      }
    } else {
      return <BPMN sopDetails={elementsDocumentFiles?.data} />;
    }
  }, [diagramMode, nodes, edges, SOPReactFlow, elementsDocumentFiles]);

  useEffect(() => {
    if (elementsDocumentFiles?.data?.MasterVersion) {
      const masterVersion = parseFloat(
        elementsDocumentFiles?.data?.MasterVersion
      );

      const history = elementsDocumentFiles?.details?.History;

      if (history && history.length > 0) {
        const previousVersion = history.find(
          (entry) => parseFloat(entry.MasterVersion) === masterVersion - 1
        );

        if (previousVersion) {
          console.log("Previous Version Data:", previousVersion?.SOPID);
          setPreviousVersionId(previousVersion?.SOPID);
        } else {
          console.log("No previous version found.");
        }
      }
    }
  }, [elementsDocumentFiles]);

  useEffect(() => {
    const compareTitles = async () => {
      if (!previousVersionId || !SOPReactFlow?.sopModuleDraft?.SopFlow?.Nodes)
        return;

      try {
        const response = await ViewSOPReactFlowVesrionOne({
          SOPID: previousVersionId,
          ContentID: presistStore.ContentID || "",
          ModuleTypeID: presistStore.ModuleTypeID || "",
        });
        const previousNodes =
          response?.data?.data?.sopModuleDraft?.SopFlow?.Nodes || [];
        const currentNodes = SOPReactFlow.sopModuleDraft.SopFlow.Nodes;
        const previousTitles = new Set(
          previousNodes.map((node) => node.data?.title)
        );
        console.log("Previous Titles:", previousTitles);
        const newlyAddedTitles = currentNodes
          .map((node) => node.data?.title)
          .filter((title) => title && !previousTitles.has(title));
        setNewTitles(newlyAddedTitles);
        const newTitles = currentNodes
          .map((node) => node.data?.title)
          .filter((title) => title && !previousTitles.has(title));

        console.log("Newly added titles in current version:", newTitles);
        if (newTitles.length > 0) {
          const comparisonText = `New Nodes Added: ${newTitles.join(", ")}`;

          setIntroSteps([
            {
              element: "#compare-titles",
              intro: comparisonText,
              position: "top",
            },
          ]);

          setIntroEnabled(true);
        } else {
          setIntroSteps([]);
          setIntroEnabled(false);
        }
        if (newlyAddedTitles.length > 0) {
          setShowComparisonModal(true);
        }
      } catch (error) {
        console.error("Error comparing versions:", error);
        setIntroSteps([]);
        setIntroEnabled(false);
      }
    };

    compareTitles();
  }, [SOPReactFlow, previousVersionId, presistStore]);

  useEffect(() => {
    if (SOPReactFlow?.sopModuleDraft?.SopFlow?.Nodes) {
      const titles = SOPReactFlow.sopModuleDraft.SopFlow.Nodes.map(
        (node) => node.data?.title
      );
      setCurrentVersionTitles(titles);
    }
    const fetchPreviousVersionTitles = async () => {
      if (previousVersionId) {
        const payload = {
          SOPID: previousVersionId,
          ContentID: presistStore.ContentID || "",
          ModuleTypeID: presistStore.ModuleTypeID || "",
        };

        try {
          const response = await ViewSOPReactFlowVesrionOne(payload);
          const previousTitles =
            response?.data?.data?.sopModuleDraft?.SopFlow?.Nodes.map(
              (node) => node.data?.title
            );
          setPreviousVersionTitles(previousTitles);
        } catch (error) {
          console.error("Error fetching previous version data:", error);
        }
      }
    };

    fetchPreviousVersionTitles();
  }, [SOPReactFlow, previousVersionId, presistStore]);

  const handleAuditClick = () => {
    if (allRiskDraftIDs.length > 0) {
      setIsLoading(true);
      const uniqueRiskDraftIDs = [...new Set(allRiskDraftIDs)];
      const payload = {
        RiskIDs: uniqueRiskDraftIDs,
      };
      Get_Risk_By_RiskID_API(payload)
        .then((response) => {
          const riskData = response?.data?.data;
          console.log("API ResponseRiskData:", riskData);
          const doc = new jsPDF();
          doc.setFontSize(18);
          doc.text("Risk Report", 14, 20);
          let yPosition = 30;
          riskData.forEach((risk, index) => {
            doc.setFontSize(12);
            doc.text(
              `${index + 1}. Risk Name: ${risk.RiskName}`,
              14,
              yPosition
            );
            doc.text(
              `Risk Description: ${risk.RiskDescription}`,
              14,
              yPosition + 5
            );
            doc.text(`Risk Category: ${risk.RiskCategory}`, 14, yPosition + 10);
            doc.text(`Risk Status: ${risk.RiskStatus}`, 14, yPosition + 15);
            doc.text(`Risk State: ${risk.RiskState}`, 14, yPosition + 20);
            doc.text(
              `InProgress Version: ${risk.DraftVersion}`,
              14,
              yPosition + 25
            );
            doc.text(
              `Created Date: ${new Date(
                risk.CreatedDate
              ).toLocaleDateString()}`,
              14,
              yPosition + 30
            );
            yPosition += 35;
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
          });
          doc.save("risk_report.pdf");
        })
        .catch((error) => {
          console.error("Error fetching risk data:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      console.log("No RiskDraftIDs available.");
    }
  };

  useEffect(() => {
    const fetchAttachments = async () => {
      if (elementsDocumentFiles?.data?.SOPDraftID) {
        try {
          const response = await SopAttachmentListApi({
            SOPDraftID: elementsDocumentFiles.data.SOPDraftID,
          });
          setAttachments(response.data);
          console.log("Fetched Attachments:", response.data);
        } catch (error) {
          console.error("Error fetching attachments:", error);
        }
      }
    };

    fetchAttachments();
  }, [elementsDocumentFiles?.data?.SOPID]);

  const handleDownloadBPMNAsPDF = async () => {
    const bpmnXML = elementsDocumentFiles?.data?.SOPXMLElement;
    const sopDetails = elementsDocumentFiles?.data?.SOPDetails;

    if (!bpmnXML) {
      toast.error("No BPMN data available to download");
      return;
    }

    try {
      let rolesMap = {};
      try {
        const rolesResponse = await getroles();
        rolesMap = rolesResponse.data.data.Roles.reduce((acc, role) => {
          acc[role.RoleID] = role.RoleName;
          return acc;
        }, {});
      } catch (error) {
        console.error("Error fetching roles data:", error);
      }
      let attachmentsData = {};
      try {
        const response = await SopAttachmentListApi({
          SOPDraftID: elementsDocumentFiles.data.SOPDraftID,
        });
        attachmentsData = response.data;
        console.log("Fetched Attachments:", response.data);
      } catch (error) {
        console.error("Error fetching attachments:", error);
      }
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(bpmnXML, "text/xml");
      const tasks = xmlDoc.getElementsByTagName("bpmn:task");
      const events = xmlDoc.getElementsByTagName("bpmn:endEvent");
      const doc = new jsPDF();
      const taskToDetailsMap = {};
      if (sopDetails && sopDetails.length > 0) {
        sopDetails.forEach((detail) => {
          if (detail.SopShapeID) {
            if (!taskToDetailsMap[detail.SopShapeID]) {
              taskToDetailsMap[detail.SopShapeID] = [];
            }
            taskToDetailsMap[detail.SopShapeID].push(detail);
          }
        });
      }

      // --- Process Information Section ---
      let yPosition = 20;
      const sopData = elementsDocumentFiles.data;
      doc.setFontSize(16);
      doc.text("Process Information:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      doc.text(`Name: ${sopData.SOPName || "N/A"}`, 30, yPosition);
      yPosition += 8;
      doc.text(
        `Description: ${sopData.SOPDescription || "N/A"}`,
        30,
        yPosition
      );
      yPosition += 8;
      doc.text(`Status: ${sopData.SOPStatus || "N/A"}`, 30, yPosition);
      yPosition += 8;
      const versionText =
        sopData.SOPStatus === "InProgress"
          ? `InProgress Version: ${sopData.DraftVersion || "N/A"}`
          : `Master Version: ${sopData.MasterVersion || "N/A"}`;
      doc.text(versionText, 30, yPosition);
      yPosition += 8;

      if (sopData.CreatedDate) {
        const createdDate = new Date(sopData.CreatedDate).toLocaleDateString();
        doc.text(`Created Date: ${createdDate}`, 30, yPosition);
        yPosition += 8;
      }
      yPosition += 10; // Add space before next section

      // --- Process Steps Section ---
      doc.setFontSize(16);
      doc.text(
        `${elementsDocumentFiles?.data?.SOPName || "Process"} Steps`,
        20,
        yPosition
      );
      yPosition += 20;
      doc.setFontSize(14);
      doc.text("Process Steps:", 20, yPosition);
      yPosition += 10;

      // Track which pages contain detailed information for each task
      const detailPageMap = {};
      let stepCount = 1;

      // Add tasks to PDF
      for (let i = 0; i < tasks.length; i++) {
        const taskId = tasks[i].getAttribute("id") || "";
        const taskName = tasks[i].getAttribute("name") || "Unnamed Step";

        doc.setFontSize(12);
        doc.text(`Step ${stepCount}: ${taskName}`, 30, yPosition);
        stepCount++;

        // Check if the SopShapeID exists in the task details map
        const sopDetail = taskToDetailsMap[taskId]; // Matching taskId with SopShapeID
        if (sopDetail && sopDetail.length > 0) {
          const iconText = "📎";
          const textWidth = doc.getTextWidth(
            `Step ${stepCount - 1}: ${taskName}`
          );

          doc.setTextColor(0, 0, 255);
          doc.text(iconText, 30 + textWidth + 5, yPosition);
          const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

          detailPageMap[taskId] = {
            sourcePage: currentPage,
            sourceY: yPosition,
            details: sopDetail,
            stepNumber: stepCount - 1,
            taskName: taskName,
          };

          doc.setTextColor(0, 0, 0);
        }

        yPosition += 10;
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      }

      for (let i = 0; i < events.length; i++) {
        const eventId = events[i].getAttribute("id") || "";
        const eventName =
          events[i].getAttribute("name") || "Process Completion";

        doc.setFontSize(12);
        doc.text(`Step ${stepCount}: ${eventName}`, 30, yPosition);
        stepCount++;

        yPosition += 10;
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      }

      Object.keys(detailPageMap).forEach((taskId) => {
        doc.addPage();
        const detailsStartPage = doc.internal.getCurrentPageInfo().pageNumber;

        detailPageMap[taskId].targetPage = detailsStartPage;

        let yPos = 20;
        const taskInfo = detailPageMap[taskId];

        // Header
        doc.setFontSize(16);
        doc.text(
          `Details for Step ${taskInfo.stepNumber}: ${taskInfo.taskName}`,
          20,
          yPos
        );
        yPos += 15;
        doc.setTextColor(0, 0, 255);
        doc.text("← Back to Process Steps", 20, yPos);
        doc.link(20, yPos - 5, 120, 10, {
          pageNumber: taskInfo.sourcePage,
          yPosition: taskInfo.sourceY,
        });
        doc.setTextColor(0, 0, 0);
        yPos += 15;
        doc.setFontSize(14);
        doc.text("Step Details:", 20, yPos);
        yPos += 10;

        taskInfo.details.forEach((detail, index) => {
          doc.setFontSize(12);
          doc.text(`Detail ${index + 1}:`, 30, yPos);
          yPos += 8;

          // SOP Details ID
          doc.setFontSize(10);
          // doc.text(`- SOP Shape ID: ${detail.SopShapeID || "N/A"}`, 40, yPos);
          yPos += 6;
          const matchingAttachment = attachmentsData.data?.SopDetails?.find(
            (item) => item.SopShapeID === detail.SopShapeID
          );
          if (matchingAttachment?.SopAttachmentLinks?.length > 0) {
            doc.text(`- Attachments:`, 40, yPos);
            yPos += 6;

            matchingAttachment.SopAttachmentLinks.forEach((link, linkIdx) => {
              doc.text(
                `  • ${link.ContentLinkTitle || `Attachment ${linkIdx + 1}`} (${
                  link.ContentLinkType || "Unknown Type"
                })`,
                45,
                yPos
              );
              yPos += 5;
            });
          } else {
            doc.text(`- Attachments: None`, 40, yPos);
            yPos += 6;
          }

          // Roles (show role names from the rolesMap)
          if (detail.FooterProperties?.roles?.length > 0) {
            const roleNames = [];
            for (const roleId of detail.FooterProperties.roles) {
              const roleName = rolesMap[roleId]; // Changed from roleId.RoleID to just roleId
              if (roleName) {
                roleNames.push(roleName);
              } else {
                console.warn(`Role name not found for ID: ${roleId}`);
              }
            }

            if (roleNames.length > 0) {
              doc.text(`- Roles: ${roleNames.join(", ")}`, 40, yPos);
              yPos += 6;
            } else {
              doc.text(`- Roles: No role names available`, 40, yPos);
              yPos += 6;
            }
          }

          // Created Date
          if (detail.CreatedDate) {
            const createdDate = new Date(
              detail.CreatedDate
            ).toLocaleDateString();
            doc.text(`- Created: ${createdDate}`, 40, yPos);
            yPos += 6;
          }

          yPos += 5; // Space between details
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
      });

      // Add link annotations for each task with details
      Object.keys(detailPageMap).forEach((taskId) => {
        const info = detailPageMap[taskId];
        doc.setPage(info.sourcePage);
        doc.setFontSize(12);
        const textWidth = doc.getTextWidth(
          `Step ${info.stepNumber}: ${info.taskName}`
        );
        doc.link(30 + textWidth + 5, info.sourceY - 5, 8, 8, {
          pageNumber: info.targetPage,
        });
      });

      // Save the PDF
      doc.save(
        `${elementsDocumentFiles?.data?.SOPName || "process"}_steps.pdf`
      );
      toast.success("Process steps downloaded successfully!");
    } catch (error) {
      console.error("Error downloading process steps diagram:", error);
      toast.error("Failed to download process steps");
    }
  };
  return (
    <BackgroundMeshBox sx={{ height: "100%" }}>
      {deviceType === "Phone" ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            backgroundColor: "#f0f0f0",
            animation: `${fadeIn} 1s ease-in-out`,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#ff0000",
              animation: `${fadeIn} 1.5s ease-in-out`,
              padding: "10px",
            }}
          >
            This screen is not for Phone view. Please switch to Tablet or
            Laptop.
          </Typography>
        </Box>
      ) : (
        <CommonContainer
          rightSection={
            <RightSection documentData={elementsDocumentFiles?.data} />
          }
        >
          {SOPReactFlow?.breadcrumbs && !fromActionables && (
            <Box>
              <Breadcrumbs
                bredcrumbs={SOPReactFlow?.breadcrumbs}
                type={presistStore}
                isBack={false}
              />
            </Box>
          )}

          <Box className="header" sx={{ marginTop: "-4px" }}>
            <Box className="header-text">
              <Typography
                variant="h6"
                color={"primary.main"}
                sx={{
                  // color: "#3B82F6",
                  fontWeight: "480",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px", // Adds some space between text and image
                }}
              >
                {elementsDocumentFiles?.data?.SOPName || "N/A"}
                {elementsDocumentFiles?.data?.DocumentModule?.DocumentPath && (
                  <Tooltip title={t("sourceDocument")}>
                    <IconButton onClick={handleSourceDocumentClick}>
                      <img src={SourceDoument} alt="" height={18} width={18} />
                    </IconButton>
                  </Tooltip>
                )}
                {elementsDocumentFiles?.data?.AuditorMessages?.length > 0 &&
                  (userType === "Auditor" || userType === "ProcessOwner") && (
                    <Badge
                      badgeContent={
                        elementsDocumentFiles?.data?.AuditorMessages?.length
                      }
                      color="error"
                      sx={{ marginLeft: "8px", marginTop: "4px" }}
                    >
                      <Chip
                        label={t("audit")}
                        size="small"
                        color="primary"
                        sx={{
                          ml: 0,
                          mt: 0,
                          height: "20px",
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                          backgroundColor: "#4CAF50",
                        }}
                      />
                    </Badge>
                  )}

                {/* Show Source Document icon only if DocumentPath exists */}
              </Typography>
              <Box sx={{ display: "flex", gap: "16px" }}>
                <Typography sx={{ color: "#64748B" }} variant="body1">
                  version{" "}
                  {elementsDocumentFiles?.data?.SOPStatus === "InProgress"
                    ? elementsDocumentFiles?.data?.DraftVersion || "N/A"
                    : elementsDocumentFiles?.data?.MasterVersion || "N/A"}
                  {`${" "}\u00A0(${
                    elementsDocumentFiles?.data?.SequenceNumber
                  })`}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#64748B" }}
                >{`Process Owner: ${SOPReactFlow?.sopModuleDraft?.CreatedBy}`}</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                // marginRight: "5px",
              }}
            >
              {!fromActionables &&
                elementsDocumentFiles?.data?.SOPStatus === "Published" && (
                  <Acknowledge
                    handleAcknowledge={handleAcknowledge}
                    documentData={elementsDocumentFiles?.data}
                  />
                )}

              {/* Add Download PDF Button */}
              {elementsDocumentFiles?.data?.SOPXMLElement && (
                <Tooltip title={t("downloadBPMN")}>
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
                      marginRight: "-8px",
                    }}
                  >
                    <IconButton onClick={handleDownloadBPMNAsPDF}>
                      <img
                        src={download}
                        alt="Download icon"
                        width={25}
                        height={25}
                      />
                    </IconButton>
                  </Box>
                </Tooltip>
              )}

              {NoOfClause > 0 && (
                <Tooltip title={t("Clause")}>
                  <Badge
                    badgeContent={NoOfClause}
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
                        backgroundColor: bgColor,
                        borderRadius: "20%",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenModal("Clause")}
                    >
                      <img
                        src={cicon}
                        alt="Impact Analysis Icon"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </Box>
                  </Badge>
                </Tooltip>
              )}
              {/* <Tooltip title={"React Flow Risk"}>
                <img
                  src={ReactFlowRisk}
                  alt="React Flow Risk"
                  style={{ height: "40px", width: "40px", cursor: "pointer" }}
                  onClick={handleReactFlowRiskClick} // Open the heatmap modal on click
                />
              </Tooltip> */}
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
                        alt=""
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenModal("Risk")}
                      />
                    </Box>
                  </Badge>
                </Tooltip>
              )}

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
                        alt=""
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenModal("Compliance")}
                      />
                    </Box>
                  </Badge>
                </Tooltip>
              )}
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
                      background: "linear-gradient(135deg, #1976d2, #ff229cff)", // two fixed colors
                      borderRadius: "20%",
                      cursor: "pointer",
                    }}
                    onClick={() => setOpenCTQModal(true)}
                  >
                    <img
                      src={ctqIconss}
                      alt="Impact Analysis Icon"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </Box>
                </Badge>
              </Tooltip>

              <Tooltip title={t("ImpactAnalysis")}>
                <div
                  onClick={handleImpactAnalysisClick}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center", // Center horizontally
                    height: "40px",
                    width: "40px",
                    backgroundColor: bgColor, // Use bgColor or default to light gray
                    borderRadius: "20%",
                  }}
                >
                  <img
                    src={impactanalysisIcon}
                    alt="Impact Analysis Icon"
                    style={{ width: "20px", height: "20px" }} // optional: adjust as needed
                  />
                </div>
              </Tooltip>

              <div
                onClick={handleBookmarkClick}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "-9px",
                }}
              >
                <Tooltip
                  title={UserFavorite ? t("AlreadyAdded") : t("AddToFavorites")}
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
                      src={UserFavorite ? bookMark : NoFav}
                      alt={
                        UserFavorite
                          ? "Remove from Favorites"
                          : "Add to Favorites"
                      }
                    />
                  </Box>
                </Tooltip>
              </div>

              <Tooltip title={"download auditor pdf"}>
                {allRiskDraftIDs.length > 0 ? (
                  isLoading ? (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        zIndex: 9999,
                      }}
                    >
                      <img
                        src={Pageloader}
                        alt="Loading..."
                        height={60}
                        width={60}
                      />
                    </div>
                  ) : (
                    <img
                      src={audit}
                      alt="Audit Icon"
                      style={{
                        height: "50px",
                        width: "40px",
                        marginLeft: "-10px",
                      }}
                      onClick={handleAuditClick}
                    />
                  )
                ) : null}
              </Tooltip>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              m: 0.5,
            }}
          ></Box>

          {loading || isSOPLoading ? (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                zIndex: 9999,
              }}
            >
              <img src={Pageloader} alt="Loading..." height={100} width={100} />
            </div>
          ) : !fromActionables ? (
            <Box
              sx={{
                filter:
                  (userType === "EndUser" || mytask === "EndUser") &&
                  !isAcknowledged &&
                  !isMyActionable
                    ? "blur(5px)"
                    : "none",
              }}
            >
              {renderDiagram}
            </Box>
          ) : (
            <Box
              sx={{
                filter:
                  (userType === "EndUser" || mytask === "EndUser") &&
                  !isAcknowledged &&
                  !isMyActionable
                    ? "blur(5px)"
                    : "none",
              }}
            >
              {renderDiagram}
            </Box>
          )}

          <VersionComparisonModal
            open={showComparisonModal}
            onClose={() => setShowComparisonModal(false)}
            newTitles={newTitles}
          />

          <SOPRiskModal
            open={openHeatmapModal}
            onClose={() => setOpenHeatmapModal(false)}
            data={heatmapData}
            nodes={nodes}
            edges={edges}
            sopDraftID={sopDraftID}
          />
          <RiskAndComplianceModal
            open={openModal}
            onClose={handleCloseModal}
            heading={modalHeading}
            content={`Content related to ${modalHeading} will go here.`}
            RiskAndCompliences={RiskAndCompliences}
          />
          <CTQModal
            open={openCTQModal}
            onClose={() => setOpenCTQModal(false)}
            sopDraftID={sopDraftID}
          />

          <SourceDocumentModal
            open={openSourceDocumentModal}
            onClose={() => setOpenSourceDocumentModal(false)}
            sopName={elementsDocumentFiles?.data?.SOPName}
            documentData={elementsDocumentFiles?.data}
          />
        </CommonContainer>
      )}
    </BackgroundMeshBox>
  );
};

export default Sops;
