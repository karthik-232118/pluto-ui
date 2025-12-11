import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ReactFlow,
  addEdge,
  Controls,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
  useEdgesState,
  useNodesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import roundrectangle from "../../../assets/svg/flowpage/node.svg";
import starticon from "../../../assets/svg/flowpage/roundtwo.svg";
import endicon from "../../../assets/svg/flowpage/darkcircle.svg";
import five from "../../../assets/svg/flowpage/five.svg";
import comment from "../../../assets/svg/flowpage/comment.svg";
import AiIcon from "../../../assets/svg/BPMN/Ai-icon.svg";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import "react-resizable/css/styles.css";
import { setImageUrl } from "../../../store/imageSlice/imageSlice";
import { DnDProvider, useDnD } from "./DnDContext";
import DragNode from "./DragNode";
import FLowpageHeader from "./FLowpageHeader";
import { toggelServices, updateConfigData } from "../../../store/flow/slice";
import {
  GetCreateSOPReactFlow,
  GetViewSOPReactFlow,
} from "../../../store/SOPReactFlow/action";
import { UpdateFLowPosition } from "../../../store/flow/action";
import {
  setIsWorkflowEnabled,
  setRolesData,
  setSelectedLinks,
  setSelectedImage,
} from "../../../store/FlowWithSOP/flowWithSop";
import { uploadImage } from "../../../services/common/common.service";
import SopProperties from "./SopProperties";
import BpmnModdle from "bpmn-moddle";
import DiamondNode from "./DiamondNode";
import UploadPDFModal from "./UploadPDFModal";
import CustomEdge from "./CustomEdges";
import ResizableNode from "./ResizableNode";
import { frontendState } from "../../../store/presist/action";
import { MoreVert } from "@mui/icons-material";
import BPMNAdmin from "../../bpmn/BPMNAdmin";
import {
  createSopModule,
  viewSopModuleDraft,
} from "../../../services/sopModules/SopModule";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";
import BPMNAdminWithAI from "../../bpmn/BPMNAdminWithAI";
import {
  CreateSOPTemplateApi,
  ListSOPTemplateApi,
} from "../../../services/sopTemplate/SOPTemplate";
const nodeTypes = {
  comment: ResizableNode,
  diamond: DiamondNode,
  Start: DragNode,
  End: DragNode,
  Node: DragNode,
  "create-task": DragNode,
  Email: DragNode,
  "Email Custom API Call": DragNode,
  "Human Input": DragNode,
  "Create Form": DragNode,
  "If Else Clause": DragNode,
  "Image Helper": DragNode,
  "CSV (Convert CSV to JSON)": DragNode,
  "Call Rest API": DragNode,
  "CSV (Convert JSON to CSV)": DragNode,
  Concatenation: DragNode,
  Split: DragNode,
  "Remove HTML": DragNode,
  Replace: DragNode,
  Find: DragNode,
  Output: DragNode,
};
const edgeTypes = {
  bidirectional: CustomEdge,
};

const LanguageDropdown = ({ data, onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("lang") || "eng"
  );

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    setSelectedLanguage(lang);

    // Store the selected language in localStorage
    localStorage.setItem("lang", lang);

    if (lang === "eng" && data?.data?.bpmn_xml) {
      try {
        const decodedXml = atob(data.data.bpmn_xml);
        onLanguageChange(decodedXml);
      } catch (err) {
        console.error("Failed to decode English BPMN XML base64:", err);
        onLanguageChange(data.data.bpmn_xml);
      }
    } else if (lang === "icelandic" && data?.data?.bpmn_xml_icelandic) {
      try {
        const decodedXml = atob(data.data.bpmn_xml_icelandic);
        onLanguageChange(decodedXml);
      } catch (err) {
        console.error("Failed to decode Icelandic BPMN XML base64:", err);
        onLanguageChange(data.data.bpmn_xml_icelandic);
      }
    } else {
      onLanguageChange("");
    }
  };

  useEffect(() => {
    if (data?.data?.bpmn_xml) {
      try {
        const decodedXml = atob(data.data.bpmn_xml);
        onLanguageChange(decodedXml);
      } catch (err) {
        console.error("Failed to decode initial English BPMN XML base64:", err);
        onLanguageChange(data.data.bpmn_xml);
      }
    }
  }, [data, onLanguageChange]);
  const SOPCreationType = localStorage.getItem("selectedSOPCard");

  return (
    <>
      {SOPCreationType === "BPMN with AI" && (
        <Box sx={{ minWidth: 120, marginRight: "10px" }}>
          <FormControl fullWidth size="small">
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              id="language-select"
              value={selectedLanguage}
              label="Language"
              onChange={handleLanguageChange}
            >
              <MenuItem value="eng">English</MenuItem>
              <MenuItem value="icelandic">Icelandic</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
    </>
  );
};
const FlowPage = () => {
  const modelerRef = useRef(null);
  const dispatch = useDispatch();
  const bpmnRef = useRef(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [selectedTab, setSelectedTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [debuggingInfo, setDebuggingInfo] = useState(null);
  const [selectedRoleDetails, setSelectedRoleDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [SopDraftData, setSopDraftData] = useState({});
  const [shapeDetails, setShapeDetails] = useState({});
  const [selectedelement, setSelectedElement] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [newLabel, setNewLabel] = useState("");
  const [newSubLabel, setNewSubLabel] = useState("");
  const [newColor, setNewColor] = useState("#ffffff");
  const selectedElementRef = useRef({});
  const [isSavingBPMN, setIsSavingBPMN] = useState(false);
  const [isSavingReactFlow, setIsSavingReactFlow] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateXmlElement, setTemplateXmlElement] = useState("");
  const [templateHeader, setTemplateHeader] = useState("");
  const [templateFooter, setTemplateFooter] = useState("");
  const [templateFontFamily, setTemplateFontFamly] = useState("");
  // Add state to track if save was attempted
  const [templateSaveAttempted, setTemplateSaveAttempted] = useState(false);
  const [type, setType] = useDnD();
  const theme = useTheme();
  const hasRunEffect = useRef(false);
  const { openService, id } = useSelector((state) => state.workflow.data);
  const { getallservices, startNodeId } = useSelector(
    (state) => state.workflow
  );
  const { configData } = useSelector((state) => state.workflow);

  const { selectedLinks, rolesData, selectedImage, isWorkflowEnabled } =
    useSelector((state) => state.flowWithSop);
  const { SOPReactFlow } = useSelector((state) => state.SOPReactFlow);

  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );

  console.log("presistStore in FlowPage:", presistStore);
  const SopData = useSelector((state) => state.flowWithSop.SOPflowModal);
  const [sketchMode, setSketchMode] = useState(false);
  const [sketchText, setSketchText] = useState("");
  const [bpmnXmlString, setBpmnXmlString] = useState("");
  const [sopTemplateList, setSopTemplateList] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { t } = useTranslation();
  const isSOPWithWorkFlowFromStorage = JSON.parse(
    localStorage.getItem("isSOPWithWorkFlow") || false
  );
  const IsReactFlow = localStorage.getItem("IsReactFlow");

  const SOPCreationType = localStorage.getItem("selectedSOPCard");

  useEffect(() => {
    if (SOPCreationType) {
      switch (SOPCreationType) {
        case "BPMN SOP":
          dispatch(setIsWorkflowEnabled(false));
          localStorage.setItem("isSOPWithWorkFlow", JSON.stringify(false));
          break;

        case "BPMN with AI":
          dispatch(setIsWorkflowEnabled(false));
          localStorage.setItem("isSOPWithWorkFlow", JSON.stringify(false));
          handleOpenModal();
          break;

        case "SOP with workflow":
        case "Workflow with AI":
        case "Upload a File":
          dispatch(setIsWorkflowEnabled(true));
          localStorage.setItem("isSOPWithWorkFlow", JSON.stringify(true));
          break;

        default:
          dispatch(setIsWorkflowEnabled(false));
          localStorage.setItem("isSOPWithWorkFlow", JSON.stringify(false));
      }
    }
  }, [SOPCreationType, dispatch]);

  const updateSketchDiagram = (inputText, isUserTyping = false, configData) => {
    if (inputText === undefined || inputText.trim() === "") {
      setNodes((prevNodes) => prevNodes.filter((node) => !node.data?.isSketch));
      setEdges((prevEdges) => prevEdges.filter((edge) => !edge.data?.isSketch));
      return;
    }
    setNodes((prevNodes) => prevNodes.filter((node) => !node.data?.isSketch));
    setEdges((prevEdges) => prevEdges.filter((edge) => !edge.data?.isSketch));
    const lines = inputText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    if (lines.length === 0) {
      return;
    }
    const newNodes = lines.map((line, index) => {
      const nodeId = uuidv4();
      return {
        id: nodeId,
        position: { x: 100, y: 100 + index * 120 },
        type: "create-task",
        data: {
          title: line,
          isSketch: true,
        },
      };
    });
    const newEdges = [];
    for (let i = 0; i < newNodes?.length - 1; i++) {
      const edgeId = uuidv4();
      newEdges.push({
        id: edgeId,
        source: newNodes[i].id,
        target: newNodes[i + 1].id,
        type: "step",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#b1b1b7" },
        data: { isSketch: true },
      });
    }
    setNodes((prev) => [...prev, ...newNodes]);
    setEdges((prev) => [...prev, ...newEdges]);
    newNodes.forEach((node) => {
      dispatch(
        updateConfigData({
          id: node.id,
          value: {
            title: node.data.title,
          },
        })
      );
    });
  };

  useEffect(() => {
    if (sketchMode && !hasRunEffect.current) {
      const uniqueTitles = new Set();
      nodes.forEach((node) => {
        const nodeTitle =
          configData[node.id]?.title || node.data?.label || "(no title)";
        uniqueTitles.add(nodeTitle);
      });
      hasRunEffect.current = true;
    }
    if (!sketchMode) {
      hasRunEffect.current = false;
    }
  }, [sketchMode, nodes, configData]);
  useEffect(() => {
    if (sketchMode) {
      updateSketchDiagram(sketchText);
    }
  }, [sketchText, sketchMode]);
  const onConnect = useCallback(
    (params) => {
      params.type = "step";
      params.markerEnd = { type: MarkerType.ArrowClosed, color: "#b1b1b7" };
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!type) return;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: {
          label: type === "create-task" ? "" : `${type} node`,
          StepStatus: "default",
        },
      };
      dispatch(
        updateConfigData({
          id: newNode.id,
          value: {
            title: type,
            type: type,
            shapeType: type,
          },
        })
      );

      setNodes((nds) => nds?.concat(newNode));
    },
    [type, screenToFlowPosition, dispatch, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/reactflow", nodeType);
  };
  const handleCloseDrawer = () => {
    dispatch(toggelServices({ openService: false }));
  };
  const handleTabChange = (event, newTab) => {
    setSelectedTab(newTab);
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("type", file.type);
    formData.append("size", file.size);
    try {
      const response = await uploadImage(formData, () => {});
      if (response?.status === 201) {
        let link = response?.data?.data?.file;
        dispatch(
          setSelectedImage({
            id,
            value: {
              ...selectedImage[id],
              title: file.name,
              link,
              type: file.type,
            },
          })
        );
      }
    } catch {
      console.log("error uploading file");
    }
  };

  const handleSave = () => {
    if (!selectedNode) {
      return console.error("No node selected!");
    }

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                id: selectedNode.id,
                label: newLabel,
                subLabel: newSubLabel,
                image: selectedImage,
              },
            }
          : node
      )
    );

    if (selectedImage) {
      dispatch(setImageUrl(selectedImage));
    }

    setDrawerOpen(false);
    setSelectedNode(null);
  };
  const handleDeleteClip = () => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id ? { ...n, data: { ...n.data, clips: [] } } : n
      )
    );
  };
  const handleDeleteImage = () => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id ? { ...n, data: { ...n.data, images: [] } } : n
      )
    );
  };
  useEffect(() => {
    if (SOPCreationType === "Workflow with AI") {
      handleOpenModal();
    } else if (SOPCreationType === "Upload a File") {
      handleImportDiagram();
    }
  }, [SOPCreationType]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleUploadComplete = (data) => {
    if (data?.data?.bpmn_xml) {
      try {
        const decodedXmlEng = atob(data.data.bpmn_xml);
        setBpmnXmlString(decodedXmlEng);
        localStorage.setItem("bpmn_xml", data.data.bpmn_xml);
      } catch (err) {
        console.error("Failed to decode BPMN XML base64:", err);
      }
    }
    if (data?.data?.bpmn_xml_icelandic) {
      try {
        const decodedXmlIcelandic = atob(data.data.bpmn_xml_icelandic);

        localStorage.setItem(
          "bpmn_xml_icelandic",
          data.data.bpmn_xml_icelandic
        );
      } catch (err) {
        console.error("Failed to decode Icelandic BPMN XML base64:", err);
      }
    }
    if (data?.data?.workflow) {
      const workflow = data.data.workflow;
      const idMap = new Map();
      const updatedNodes = workflow.nodes.map((node) => {
        const nodeId = uuidv4();
        const nodePropertyId = uuidv4();
        idMap.set(node.id, nodeId);
        return {
          id: nodeId,
          type: "create-task",
          position: node.position || {
            x: Math.random() * 500,
            y: Math.random() * 500,
          },
          data: { label: node.data?.label || "AI Task", StepStatus: "default" },
          NodeProperties: [
            {
              id: nodePropertyId,
              serviceID: null,
              properties: [
                {
                  title: "Generated AI Task",
                  type: "create-task",
                  shapeType: "create-task",
                },
              ],
            },
          ],
        };
      });

      const updatedEdges = [];
      if (workflow.edges?.length) {
        updatedEdges.push(
          ...workflow.edges.map((edge) => ({
            id: uuidv4(),
            source: idMap.get(edge.source) || edge.source,
            target: idMap.get(edge.target) || edge.target,
            type: "default",
            markerEnd: { type: "arrowclosed", color: "#b1b1b7" },
          }))
        );
      } else {
        const nodeIds = updatedNodes.map((node) => node.id);
        for (let i = 0; i < nodeIds.length - 1; i++) {
          updatedEdges.push({
            id: uuidv4(),
            source: nodeIds[i],
            target: nodeIds[i + 1],
            type: "default",
            markerEnd: { type: "arrowclosed", color: "#b1b1b7" },
          });
        }
      }
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      updatedNodes.forEach((node) => {
        dispatch(
          updateConfigData({
            id: node.id,
            value: {
              title: node.data.label,
              type: "create-task",
              shapeType: "create-task",
            },
          })
        );
      });
    }
  };
  const handleImportDiagram = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    handleMenuClose();
  };

  const convertBpmnToJson = async (bpmnXml) => {
    const moddle = new BpmnModdle();
    const { rootElement: definitions } = await moddle.fromXML(bpmnXml);

    const newNodes = [];
    const newEdges = [];

    definitions.rootElements.forEach((element) => {
      if (element.$type === "bpmn:Process") {
        element.flowElements.forEach((flowElement) => {
          if (
            flowElement.$type === "bpmn:Task" ||
            flowElement.$type === "bpmn:StartEvent" ||
            flowElement.$type === "bpmn:EndEvent" ||
            flowElement.$type === "bpmn:ExclusiveGateway"
          ) {
            newNodes.push({
              id: flowElement.id,
              type: flowElement.$type.replace("bpmn:", "").toLowerCase(),
              position: { x: Math.random() * 500, y: Math.random() * 400 },
              data: { label: flowElement.name || flowElement.id },
            });
          } else if (flowElement.$type === "bpmn:SequenceFlow") {
            if (flowElement.sourceRef && flowElement.targetRef) {
              newEdges.push({
                id: flowElement.id,
                source: flowElement.sourceRef.id,
                target: flowElement.targetRef.id,
                type: "create-task",
                markerEnd: { type: MarkerType.ArrowClosed, color: "#b1b1b7" },
              });
            }
          }
        });
      }
    });

    return { nodes: newNodes, edges: newEdges };
  };
  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      try {
        let flowData;
        if (file.name.endsWith(".bpmn") || file.type === "application/xml") {
          flowData = await convertBpmnToJson(content);
        } else if (
          file.name.endsWith(".json") ||
          file.type === "application/json"
        ) {
          flowData = JSON.parse(content);
        } else {
          console.error("Unsupported file type");
          return;
        }

        const idMap = new Map();
        const updatedNodes = (flowData.nodes || []).map((node) => {
          const nodeId = uuidv4();
          const nodePropertyId = uuidv4();
          idMap.set(node.id, nodeId);

          return {
            id: nodeId,
            type: "create-task",
            position: node.position || {
              x: Math.random() * 500,
              y: Math.random() * 500,
            },
            data: {
              label: node.data?.label || "Task",
              StepStatus: "default",
            },
            NodeProperties: [
              {
                id: nodePropertyId,
                serviceID: null,
                properties: [
                  {
                    title: "create-task",
                    type: "create-task",
                    shapeType: "create-task",
                  },
                ],
              },
            ],
          };
        });

        const updatedEdges = [];
        const nodeIds = updatedNodes.map((node) => node.id);
        if (flowData.edges?.length) {
          updatedEdges.push(
            ...flowData.edges.map((edge) => ({
              id: uuidv4(),
              source: idMap.get(edge.source) || edge.source,
              target: idMap.get(edge.target) || edge.target,
              type: "default",
              markerEnd: { type: "arrowclosed", color: "#b1b1b7" },
            }))
          );
        } else {
          for (let i = 0; i < nodeIds.length - 1; i++) {
            updatedEdges.push({
              id: uuidv4(),
              source: nodeIds[i],
              target: nodeIds[i + 1],
              type: "default",
              markerEnd: { type: "arrowclosed", color: "#b1b1b7" },
            });
          }
        }

        setNodes(updatedNodes);
        setEdges(updatedEdges);
        updatedNodes.forEach((node) => {
          dispatch(
            updateConfigData({
              id: node.id,
              value: {
                title: node.data.label,
                type: "create-task",
                shapeType: "create-task",
              },
            })
          );
        });
      } catch (err) {
        console.error("Error parsing file:", err);
      }
    };
    reader.readAsText(file);
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  useEffect(() => {
    if (nodes?.length > 0) {
      setSelectedNode(nodes[0]);
    }
  }, [nodes]);
  const defaultEdgeOptions = {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#b1b1b7",
    },
  };
  const checkerUserIDs = Array.isArray(presistStore.checkers)
    ? presistStore.checkers.map((checker) => checker.UserID)
    : [];

  const handleSaveFlow = async () => {
    setIsSavingReactFlow(true);
    alert();
    const filteredConfig = Object.fromEntries(
      Object.entries(configData).filter(([key]) =>
        nodes.some((n) => n.id === key)
      )
    );

    const formattedData = {
      SOPName: presistStore.SOPName,
      SopDescription: presistStore.SopDescription,
      SOPOwner: presistStore.SOPOwner,
      SOPID: presistStore.SOPID,
      ModuleTypeID: presistStore.ModuleTypeID,
      ContentID: presistStore.ContentID,
      SOPIsActive: presistStore.SOPIsActive,
      SelfApproved: presistStore.SelfApproved,
      IsTemplate: presistStore.IsTemplate,
      IsReactFlow: isSOPWithWorkFlowFromStorage,
      IsSopWithWorkflow: isWorkflowEnabled,
      Nodes: nodes.map((node) => ({
        id: node.id,
        position: node.position,
        type: node.type,
        data: {
          ...configData[node.id]?.data,
          title: configData[node.id]?.title || "Default Title",
          shapeType: configData[node.id]?.shapeType || "default",
          color: configData[node.id]?.color || "#ffffff",
          type: configData[node.id]?.type || "default",
        },
      })),
      Edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: edge.type,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      })),
      NodeProperties: Object.keys(filteredConfig).map((id) => ({
        id,
        serviceID:
          nodes.find((node) => node.id === id)?.data?.serviceID || null,
        properties: [filteredConfig[id]] || [],
      })),
      NodeRoles: Object.keys(rolesData).flatMap((nodeId) => {
        const arr = rolesData[nodeId];
        if (arr?.length) {
          return arr.map((roleId) => ({ id: nodeId, roleID: roleId }));
        }
        return [];
      }),
      NodeClipAttachments: Object.keys(selectedLinks).flatMap((nodeId) => {
        if (selectedLinks[nodeId]?.selectedElement?.length) {
          return selectedLinks[nodeId].selectedElement.map((clip) => ({
            id: nodeId,
            attachmentTitle: clip.ContentLinkTitle || "Clip Title",
            attachmentLink: clip.ContentLink || "Clip Link",
            attachmentType: clip.ContentLinkType || "Clip Type",
          }));
        }
        return [];
      }),
      NodeImageAttachments: Object.keys(selectedImage).flatMap((nodeId) => {
        if (selectedImage[nodeId]?.link) {
          return {
            id: nodeId,
            attachmentTitle: selectedImage[nodeId].title || "Image Title",
            attachmentLink: selectedImage[nodeId].link || "Image Link",
            attachmentType: selectedImage[nodeId].type || "Image Type",
          };
        }
        return [];
      }),
      Checker: presistStore.checkers || checkerUserIDs,
      EscalationPerson: presistStore.EscalationPerson,
      Approver: presistStore?.approvers,
      SOPExpiry: presistStore.isSkipSOPExpiry ? null : presistStore?.SOPExpiry,
      EscalationType: presistStore.EscalationType || "Weeks",
      EscalationAfter: presistStore.EscalationAfter || "1",
      TemplateHeader: templateHeader,
      TemplateFooter: templateFooter,
      TemplateFontFamly: templateFontFamily,
    };

    try {
      let res;
      if (SopData !== null) {
        // Edit existing?
        res = await dispatch(GetCreateSOPReactFlow(formattedData));
        setIsSavingReactFlow(false);
        if (isWorkflowEnabled) {
          await dispatch(
            UpdateFLowPosition({
              FlowName: SopData.SOPName,
              FLowDescription: SopData.SopDescription,
              StartDate: new Date(),
              EndDate: new Date(),
              ownerId: SopData.SOPOwner,
              FlowNodePositionDetails: nodes,
              FlowNodeEdgesDetails: edges,
              NodeConfigs: filteredConfig,
              StartNodeID: startNodeId,
            })
          );
        }
      } else {
        // Possibly new
        res = await dispatch(GetCreateSOPReactFlow(formattedData));
        setIsSavingReactFlow(false);
        if (isWorkflowEnabled) {
          await dispatch(
            UpdateFLowPosition({
              FlowName: SOPReactFlow?.sopModuleDraft?.SOPName,
              FLowDescription: SOPReactFlow?.sopModuleDraft.SopDescription,
              StartDate: SOPReactFlow?.sopModuleDraft?.StartDate,
              EndDate: SOPReactFlow?.sopModuleDraft?.EndDate,
              ownerId: SOPReactFlow?.sopModuleDraft.SOPOwner,
              FlowNodePositionDetails: nodes,
              FlowNodeEdgesDetails: edges,
              NodeConfigs: filteredConfig,
              StartNodeID: startNodeId,
              FlowID: SOPReactFlow?.sopModuleDraft.SOPID,
            })
          );
        }
      }
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(frontendState(res.payload));
        handleCloseDrawer();
      }
    } catch (err) {
      alert("Error saving the SOP flow. Please try again.");
      setIsSavingReactFlow(false);
    }
  };
  const handleRoleDetailsUpdate = (details) => {
    const existingRole = selectedRoleDetails.find(
      (el) => el.nodeID === details.nodeID
    );
    if (existingRole?.nodeID === details.nodeID) {
      const updatedRoleDetails = selectedRoleDetails.map((el) =>
        el.nodeID === details.nodeID ? details : el
      );
      setSelectedRoleDetails(updatedRoleDetails);
    } else {
      setSelectedRoleDetails((prevDetails) => [...prevDetails, details]);
    }
  };

  const handleSaveBPMN = async () => {
    const bpmnElement = modelerRef.current
      ?.get("elementRegistry")
      .get("Process_1");
    if (bpmnElement) {
      modelerRef.current?.get("selection").select(null);
    }

    setIsSavingBPMN(true);
    let shapeList = [];
    let selectedElements = [];
    if (selectedElementRef.current) {
      console.log("Selected Elements:", selectedElementRef.current);
      for (const [k, v] of Object.entries(selectedElementRef.current)) {
        console.log("Selected Element:", k, v);
        shapeList.push({
          SopShapeID: k,
          AttachmentIcon: true,
          HeaderProperties: null,
          FooterProperties: null,
        });

        selectedElements.push(...v);
      }
      for (const el of selectedRoleDetails) {
        const existingShape = await shapeList.find(
          (shape) => shape.SopShapeID === el.nodeID
        );
        if (!existingShape) {
          shapeList.push({
            SopShapeID: el.nodeID,
            AttachmentIcon: false,
            HeaderProperties: null,
            FooterProperties: { roles: el.roleIDs },
          });
        } else {
          existingShape.FooterProperties = { roles: el.roleIDs };
        }
      }
    }
    const modeler = modelerRef.current;
    let xml = "";
    try {
      const { xml: extractedXml } = await modeler.saveXML({ format: true });
      xml = extractedXml;
    } catch (error) {
      console.error("Error extracting BPMN XML: ", error);
      toast.error("Failed to extract BPMN XML.");
      return;
    }
    const data = {
      ModuleTypeID: presistStore?.ModuleTypeID,
      ContentID: presistStore?.ContentID,
      SOPID: presistStore?.SOPID,
      SOPName: presistStore?.SOPName,
      SOPDescription: presistStore?.SOPDescription,
      SOPOwner: presistStore?.SOPOwner,
      SOPIsActive: presistStore?.SOPIsActive,
      SOPTags: presistStore?.SOPTags,
      SelfApproved: presistStore?.SelfApproved,
      SOPXMLElement: xml,
      Checker: presistStore?.checkers,
      Approver: presistStore?.approvers || [],
      EscalationPerson: presistStore?.escalationPersons,
      EscalationType: presistStore?.EscalationType,
      EscalationAfter: presistStore?.EscalationAfter,
      SOPExpiry: presistStore?.SOPExpiry,
      shapeList,
      selectedElements,
      NeedAcceptance: presistStore?.NeedAcceptance,
      IsTemplate: presistStore.IsTemplate,
      IsReactFlow: isSOPWithWorkFlowFromStorage,
      SOPDocID: presistStore?.SOPDocID,
      ElementAttributeTypeID: presistStore?.ElementAttributeTypeID,
      TemplateHeader: templateHeader,
      TemplateFooter: templateFooter,
      TemplateFontFamly: templateFontFamily,
      CoOwnerUserID: presistStore?.CoOwnerUserID,
      CTQImageURL: presistStore?.CTQImageURL,
    };

    try {
      const response = await createSopModule(data);
      setIsSavingBPMN(false);
      if (response?.status === 201) {
        toast.success(t("SOP Module created successfully"));
        navigate(-2);
      } else {
        toast.error(t("Failed to create SOP Module"));
      }
    } catch (error) {
      console.error("Error creating SOP Module: ", error);
      toast.error(t("An error occurred while saving SOP Module"));
      setIsSavingBPMN(false);
    }
  };

  useEffect(() => {
    if (
      presistStore.ModuleTypeID !== null &&
      presistStore.ContentID !== null &&
      presistStore.SOPID !== null
    ) {
      dispatch(
        GetViewSOPReactFlow({
          ModuleTypeID: presistStore.ModuleTypeID,
          ContentID: presistStore.ContentID,
          SOPID: presistStore.SOPID,
        })
      );
    }
    console.log(
      "presistStore.ModuleTypeID",
      presistStore.ModuleTypeID,
      "presistStore.ContentID",
      presistStore.ContentID,
      "presistStore.SOPID",
      presistStore.SOPID
    );
  }, [
    dispatch,
    presistStore.ModuleTypeID,
    presistStore.ContentID,
    presistStore.SOPID,
  ]);
  useEffect(() => {
    const data = SOPReactFlow?.sopModuleDraft;
    if (data?.SopFlow && presistStore.SOPID !== null) {
      const { Nodes, Edges } = data.SopFlow;
      for (let i = 0; i < Nodes?.length; i++) {
        const node = Nodes[i];

        if (node.roles?.length) {
          const roles = node.roles.map((r) => r.RoleID);
          dispatch(setRolesData({ id: node.id, value: roles }));
        }

        if (node.clips?.length) {
          dispatch(
            setSelectedLinks({
              id: node.id,
              value: {
                selectedElement: node.clips.map((c) => ({
                  ContentLink: c.AttachmentLink,
                  ContentLinkTitle: c.AttachmentTitle,
                  ContentLinkType: c.AttachmentType,
                  id: c.NodeID,
                })),
              },
            })
          );
        }

        if (node.images?.length) {
          const firstImg = node.images[0];
          dispatch(
            setSelectedImage({
              id: node.id,
              value: {
                link: firstImg.AttachmentLink,
                title: firstImg.AttachmentTitle,
                type: firstImg.AttachmentType,
              },
            })
          );
        }

        if (node.properties?.length) {
          for (let p = 0; p < node.properties.length; p++) {
            const property = node.properties[p];
            for (let np = 0; np < property.NodeProperties.length; np++) {
              const propObj = property.NodeProperties[np];
              dispatch(
                updateConfigData({
                  id: property.NodeID,
                  value: {
                    title: propObj.title,
                    type: propObj.title,
                    shapeType: propObj.shapeType,
                    color: propObj.color,
                  },
                })
              );
            }
          }
        }
      }

      const loadedNodes = Nodes?.map((n) => ({
        id: n.id,
        type: n.type || "default",
        position: n.position,
        data: { ...n.data?.data },
      }));
      setNodes(loadedNodes);
      const loadedEdges = Edges?.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: "step",
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
      }));
      setEdges(loadedEdges);

      dispatch(setIsWorkflowEnabled(data?.IsSopWithWorkflow));
    } else {
      dispatch(setIsWorkflowEnabled(false));
      dispatch(setSelectedLinks({}));
      dispatch(setRolesData({}));
      dispatch(updateConfigData({}));
      dispatch(setSelectedImage({}));
    }
  }, [SOPReactFlow?.sopModuleDraft, dispatch, presistStore.SOPID]);

  const CustomSubmit = () => (
    <Box className="bottom-action" sx={{ width: "340px", height: "74px" }}>
      <div>
        <Button variant="outlined" onClick={handleCloseDrawer}>
          Cancel
        </Button>
      </div>
      <div>
        <Button
          disabled={isSavingReactFlow}
          variant="contained"
          onClick={handleSaveFlow}
        >
          {!isSavingReactFlow ? (
            "Save Changes"
          ) : (
            <CircularProgress size={20} sx={{ color: "#ffffff" }} />
          )}
        </Button>
      </div>
    </Box>
  );

  const openApiDocs = () => {
    window.open(process.env.REACT_APP_FLOW_PAGE_URL, "_blank");
  };

  const data = {
    SOPID: presistStore?.SOPID,
    ModuleTypeID: presistStore?.ModuleTypeID,
    ContentID: presistStore?.ContentID,
  };

  const fetchSopModuleDraft = async () => {
    try {
      const response = await viewSopModuleDraft(data);
      if (response?.status === 200) {
        setSopDraftData(response?.data?.data?.sopModuleDraft);
        console.log(
          "SOP Module InProgress in the React flow: ",
          response?.data?.data?.sopModuleDraft
        );
      } else {
        console.error("Error fetching SOP Module InProgress");
      }
    } catch (error) {
      console.error("API call failed: ", error);
    }
  };
  useEffect(() => {
    if (
      presistStore?.SOPID &&
      presistStore?.ModuleTypeID &&
      presistStore?.ContentID
    ) {
      fetchSopModuleDraft();
    }
  }, [presistStore.SOPID, presistStore.ModuleTypeID, presistStore.ContentID]);

  const clearBPMNDiagram = () => {
    if (modelerRef.current) {
      // Import empty BPMN XML to clear the canvas
      const emptyBpmnXml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
        <bpmn:process id="Process_1" isExecutable="false" />
        <bpmndi:BPMNDiagram id="BPMNDiagram_1">
          <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
        </bpmndi:BPMNDiagram>
      </bpmn:definitions>
    `;

      modelerRef.current
        .importXML(emptyBpmnXml)
        .then(() => {
          console.log("Diagram cleared successfully");
          setTemplateHeader("");
          setTemplateFooter("");
          setTemplateFontFamly("");
        })
        .catch((err) => {
          console.error("Error clearing diagram:", err);
        });
    }
    setBpmnXmlString("");
    localStorage.removeItem("bpmn_xml");
    localStorage.removeItem("bpmn_xml_icelandic");
  };
  const handleTemplateChange = (event) => {
    const templateId = event.target.value;
    if (templateId === "") {
      setSelectedTemplate(null);
      clearBPMNDiagram();
    } else {
      const template = sopTemplateList.find((t) => t.TemplateID === templateId);
      setSelectedTemplate(template);
    }
  };
  const BPMNCreate = useMemo(() => {
    if (SOPCreationType === "BPMN with AI") {
      return (
        <BPMNAdminWithAI
          ref={bpmnRef}
          SOPData={SopDraftData}
          shapeDetails={shapeDetails}
          setShapeDetails={setShapeDetails}
          selectedelement={selectedelement}
          setSelectedElement={setSelectedElement}
          setSopDraftData={setSopDraftData}
          modelerRef={modelerRef}
          selectedElementRef={selectedElementRef}
          onRoleDetailsSave={handleRoleDetailsUpdate}
          bpmnXml={bpmnXmlString}
          TemplateHeader={templateHeader}
          TemplateFooter={templateFooter}
          TemplateFontFamly={templateFontFamily}
          setTemplateHeader={setTemplateHeader}
          setTemplateFooter={setTemplateFooter}
          setTemplateFontFamly={setTemplateFontFamly}
          selectedTemplate={selectedTemplate}
        />
      );
    } else {
      return (
        <BPMNAdmin
          ref={bpmnRef}
          SOPData={SopDraftData}
          shapeDetails={shapeDetails}
          sopTemplateList={sopTemplateList}
          setShapeDetails={setShapeDetails}
          selectedelement={selectedelement}
          setSelectedElement={setSelectedElement}
          setSopDraftData={setSopDraftData}
          modelerRef={modelerRef}
          selectedElementRef={selectedElementRef}
          onRoleDetailsSave={handleRoleDetailsUpdate}
          bpmnXml={bpmnXmlString}
          TemplateHeader={templateHeader}
          TemplateFooter={templateFooter}
          TemplateFontFamly={templateFontFamily}
          setTemplateHeader={setTemplateHeader}
          setTemplateFooter={setTemplateFooter}
          setTemplateFontFamly={setTemplateFontFamly}
          selectedTemplate={selectedTemplate}
        />
      );
    }
  }, [
    SOPCreationType,
    SopDraftData,
    shapeDetails,
    selectedelement,
    bpmnXmlString,
    templateHeader,
    templateFooter,
    templateFontFamily,
    selectedTemplate,
  ]);
  const sidebarData = localStorage.getItem("sidebarData");
  let isAIModule = false;
  if (sidebarData) {
    const parsedSidebarData = JSON.parse(sidebarData);
    console.log(
      "sidebarData from localStorage in create React flow:",
      parsedSidebarData
    );
    if (
      Array.isArray(parsedSidebarData.data) &&
      parsedSidebarData.data.some((item) => item.ModuleName === "AI")
    ) {
      isAIModule = true;
    }
  } else {
    console.log("No sidebarData found in localStorage");
  }

  const xml = localStorage.getItem("TemplatebpmnXml");
  console.log("Retrieved BPMN XML:", xml);
  const handleSaveTemplate = async () => {
    setTemplateSaveAttempted(true);
    if (!templateName) return;
    let bpmnXml = "";
    if (bpmnRef.current && bpmnRef.current.getBpmnXml) {
      const xml = await bpmnRef.current.getBpmnXml();
      console.log("Current BPMN XML in FlowPage:", xml);
    }
    const payload = {
      TemplateName: templateName,
      TemplateXMLElement: xml,
      TemplateFontFamly: templateFontFamily,
      TemplateFooter: templateFooter,
      TemplateHeader: templateHeader,
    };
    try {
      const response = await CreateSOPTemplateApi(payload);
      if (response.status === 201) {
        toast.success(t("SOP Template created successfully"));
        navigate(-2);
        setTemplateName("");
        setTemplateXmlElement("");
        setTemplateFontFamly("");
        setTemplateFooter("");
        setTemplateHeader("");
      } else {
        const apiError = response?.data?.error;
        toast.error(apiError || t("Failed to create SOP Template"));
      }
    } catch (error) {
      console.error("Error creating SOP Template: ", error);
      const apiError = error?.response?.data?.error;
      toast.error(apiError || t("An error occurred while saving SOP Template"));
    }
  };

  useEffect(() => {
    const getTemplateList = async () => {
      try {
        const response = await ListSOPTemplateApi();
        console.log("SOP Template List:", response?.data?.data);
        setSopTemplateList(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching SOP Template List:", error);
      }
    };
    getTemplateList();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "97%",
        margin: "0px 25px 0 25px",
      }}
    >
      <div
        className="flow-page-header-warpper"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {SOPCreationType === "SOP Template" ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              gap: 2,
            }}
          >
            <FormControl size="small" sx={{ minWidth: "200px" }}>
              <TextField
                id="template-name"
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter Template Name"
                label="Template Name"
                required
                size="small"
                error={templateSaveAttempted && !templateName}
                helperText={
                  templateSaveAttempted && !templateName
                    ? "Template name is required"
                    : ""
                }
              />
            </FormControl>
            <Button
              variant="contained"
              sx={{ height: "40px", minWidth: "120px", marginTop: "-6px" }}
              onClick={handleSaveTemplate}
              disabled={!templateName}
            >
              Save Template
            </Button>
          </Box>
        ) : (
          <FLowpageHeader
            action={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LanguageDropdown
                  data={SopDraftData}
                  onLanguageChange={(xml) => {
                    console.log("Language changed, XML:", xml);
                    setBpmnXmlString(xml);
                  }}
                />
                {SOPCreationType !== "BPMN with AI" && (
                  <FormControl
                    size="small"
                    sx={{
                      minWidth: 150,
                      marginRight: "10px",
                      verticalAlign: "middle",
                    }}
                  >
                    <InputLabel id="template-select-label">Template</InputLabel>
                    <Select
                      labelId="template-select-label"
                      id="template-select"
                      label={t("Template")}
                      value={
                        selectedTemplate ? selectedTemplate.TemplateID : ""
                      }
                      onChange={handleTemplateChange}
                    >
                      <MenuItem value="">
                        <em>{t("None")}</em>
                      </MenuItem>
                      {sopTemplateList.map((template) => (
                        <MenuItem
                          key={template.TemplateID}
                          value={template.TemplateID}
                        >
                          {template.TemplateName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {SOPCreationType !== "SOP with workflow" &&
                  SOPCreationType === "BPMN with AI" && (
                    <>
                      <Button
                        variant="contained"
                        sx={{
                          height: "35px",
                          fontSize: "12px",
                          marginRight: "10px",
                          backgroundColor: "#000",
                        }}
                        onClick={handleOpenModal}
                      >
                        <img
                          src={AiIcon}
                          alt=""
                          style={{ marginRight: "5px" }}
                        />
                        {t("generateWithAi")}
                      </Button>
                    </>
                  )}

                <UploadPDFModal
                  open={isModalOpen}
                  handleClose={handleCloseModal}
                  onUploadComplete={handleUploadComplete}
                />
                {isSOPWithWorkFlowFromStorage && (
                  <Button onClick={handleMenuClick}>
                    <MoreVert style={{ color: "#000" }} />
                  </Button>
                )}
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                >
                  <Tooltip title="Upload Json and bpmn file only">
                    <MenuItem onClick={handleImportDiagram}>
                      {t("importDiagram")}
                    </MenuItem>
                  </Tooltip>
                  <MenuItem onClick={() => setSketchMode(!sketchMode)}>
                    {t("sketch")}
                  </MenuItem>
                  <MenuItem onClick={openApiDocs}>{t("API")}</MenuItem>
                </Menu>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept=".json,.bpmn"
                  onChange={handleFileImport}
                />
                {!isSOPWithWorkFlowFromStorage && (
                  <Button
                    disabled={isSavingBPMN}
                    variant="contained"
                    onClick={handleSaveBPMN}
                  >
                    {!isSavingBPMN ? (
                      t("save")
                    ) : (
                      <CircularProgress size={20} sx={{ color: "#ffffff" }} />
                    )}
                  </Button>
                )}
              </Box>
            }
          />
        )}

        <div>
          {isSOPWithWorkFlowFromStorage ? (
            <>
              {sketchMode && (
                <div
                  style={{
                    width: "250px",
                    padding: "10px",
                    borderRight: "2px solid #ddd",
                    backgroundColor: "#fff",
                    zIndex: 2,
                  }}
                >
                  <textarea
                    value={sketchText}
                    onChange={(e) => setSketchText(e.target.value)}
                    placeholder="Type here to update your diagram..."
                    style={{
                      width: "100%",
                      height: "100%",
                      fontSize: "16px",
                      padding: "10px",
                    }}
                  />
                </div>
              )}
              <div
                className="reactflow-wrapper"
                style={{ flex: 1, position: "relative" }}
                onDrop={onDrop}
                onDragOver={onDragOver}
              >
                <ReactFlow
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  fitView
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  defaultEdgeOptions={defaultEdgeOptions}
                  connectionMode={ConnectionMode.Loose}
                  nodes={nodes}
                  proOptions={{ hideAttribution: true }}
                >
                  <Controls />
                </ReactFlow>
              </div>
              {openService && (
                <SopProperties
                  selectedTab={selectedTab}
                  handleTabChange={handleTabChange}
                  handleFileChange={handleFileChange}
                  handleDeleteClip={handleDeleteClip}
                  handleDeleteImage={handleDeleteImage}
                  handleSave={handleSave}
                  selectedNode={selectedNode}
                  newLabel={newLabel}
                  setNewLabel={setNewLabel}
                  newSubLabel={newSubLabel}
                  setNewSubLabel={setNewSubLabel}
                  newColor={newColor}
                  setNewColor={setNewColor}
                  selectedImage={selectedImage}
                  debuggingInfo={debuggingInfo}
                  handleCloseDrawer={handleCloseDrawer}
                  openService={openService}
                  CustomSubmit={<CustomSubmit />}
                  isWorkflowEnabled={isWorkflowEnabled}
                />
              )}
            </>
          ) : (
            <>
              {/* <BPMNAdmin
                SOPData={JSON.stringify(SopDraftData)}
                shapeDetails={shapeDetails}
                setShapeDetails={setShapeDetails}
                selectedelement={selectedelement}
                setSelectedElement={setSelectedElement}
                selectedElementRef={selectedElementRef}
              /> */}
              {BPMNCreate}
            </>
          )}
        </div>
      </div>

      {isSOPWithWorkFlowFromStorage && (
        <div className="drag-n-drop">
          <div className="drag-n-drop-warpper">
            {draggableItems.map((item, index) => (
              <div
                title={item.name}
                key={index}
                draggable
                onDragStart={(event) => onDragStart(event, item.type)}
              >
                <img src={item.img} alt={`icon-${item.type}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function FlowPageWrapper() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <FlowPage />
      </DnDProvider>
    </ReactFlowProvider>
  );
}

export default FlowPageWrapper;

const draggableItems = [
  { type: "Start", img: starticon, name: "Start" },
  { type: "diamond", img: five, name: "Create A gateway" },
  { type: "create-task", img: roundrectangle, name: "Create Task" },
  { type: "comment", img: comment, name: "Comment" },
  { type: "End", img: endicon, name: "End" },
];
