import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Controls,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  ConnectionMode,
  useEdgesState,
  useNodesState,
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
  FormControlLabel,
  Menu,
  MenuItem,
  Switch,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import "react-resizable/css/styles.css";
import { setImageUrl } from "../../../store/imageSlice/imageSlice";
import { DnDProvider, useDnD } from "./DnDContext";
import DragNode from "./DragNode";
import FLowpageHeader from "./FLowpageHeader";
import { toggelServices } from "../../../store/flow/slice";
import {
  GetCreateSOPReactFlow,
  GetViewSOPReactFlow,
} from "../../../store/SOPReactFlow/action";
import { updateConfigData } from "../../../store/flow/slice";
import { UpdateFLowPosition } from "../../../store/flow/action";
import {
  setIsWorkflowEnabled,
  setRolesData,
  setSelectedLinks,
} from "../../../store/FlowWithSOP/flowWithSop";
import { uploadImage } from "../../../services/common/common.service";
import { setSelectedImage } from "../../../store/FlowWithSOP/flowWithSop";
import SopProperties from "./SopProperties";
import BpmnModdle from "bpmn-moddle";
import DiamondNode from "./DiamondNode";
import UploadPDFModal from "./UploadPDFModal";
import CustomEdge from "./CustomEdges";
import ResizableNode from "./ResizableNode";
import { frontendState } from "../../../store/presist/action";
import { MoreVert } from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";

const nodeTypes = {
  comment: ResizableNode,
  diamond: DiamondNode,
  Start: DragNode,
  End: DragNode,
  Node: DragNode,
  "create-task": DragNode,
  // customNode: DragNode,
  Email: DragNode,
  "Email Custom API Call": DragNode,
  // "Webhook - Call Rest API/Webhook": DragNode,
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

const FlowPage = () => {
  const dispatch = useDispatch();
  // const edges = getEdges();
  const fileInputRef = useRef(null);
  // const nodes = getNodes();
  const [newColor, setNewColor] = useState("#ffffff");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [newLabel, setNewLabel] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [setDrawerOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [debuggingInfo] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [newSubLabel, setNewSubLabel] = useState("");
  const { screenToFlowPosition } = useReactFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type] = useDnD();
  const [setType] = useDnD();
  const { openService, id } = useSelector((state) => state.workflow.data);
  const { getallservices, startNodeId } = useSelector(
    (state) => state.workflow
  );
  const {t} = useTranslation();
  const presistStore = useSelector((state) =>
    state.sidebarstate !== undefined ? state.sidebarstate : {}
  );
  const { selectedLinks, rolesData } = useSelector(
    (state) => state.flowWithSop
  );
  const { configData } = useSelector((state) => state.workflow);
  const SopData = useSelector((state) => state.flowWithSop.SOPflowModal);
  const { isWorkflowEnabled, selectedImage } = useSelector(
    (state) => state.flowWithSop
  );

  const { SOPReactFlow } = useSelector((state) => state.SOPReactFlow);

  useEffect(() => {
    const sopFlow = SOPReactFlow?.sopModuleDraft?.SopFlow;
    if (sopFlow && sopFlow.Nodes) {
      sopFlow.Nodes.forEach((node) => {
        console.log(
          `ID: ${node.id}, Title: ${node.data.title}`,
          "idwithdiagaram"
        );
      });
    }
  }, [SOPReactFlow]);

  const [sketchMode, setSketchMode] = useState(false);
  const [sketchText, setSketchText] = useState("");
  // The updateSketchDiagram function now:
  // • Removes any previous sketch nodes/edges,
  // • Creates sketch nodes from the current text (if any),
  // • Merges them with already loaded nodes (which do NOT start with "sketch-node-"),
  // • And creates solid (non-animated) edges.
  const updateSketchDiagram = (inputText) => {
    const lines = inputText.split("\n").filter((line) => line.trim() !== "");
    // Update nodes: Remove previous sketch nodes and add new ones.
    setNodes((prevNodes) => {
      const otherNodes = prevNodes.filter(
        (node) => !node.id.startsWith("sketch-node-")
      );
      const sketchNodes = lines.map((line, index) => ({
        id: `sketch-node-${index}`,
        data: { label: line }, // Use the text you typed
        position: { x: 150 * index, y: 100 },
        type: "create-task", // Uses DragNode for rendering
      }));

      return [...otherNodes, ...sketchNodes];
    });
    // Update edges: Remove previous sketch edges and create new ones.
    setEdges((prevEdges) => {
      const otherEdges = prevEdges.filter(
        (edge) => !edge?.id?.startsWith("sketch-edge-")
      );
      const sketchEdges = [];
      for (let i = 1; i < lines.length; i++) {
        sketchEdges.push({
          id: `sketch-edge-${i - 1}`,
          source: `sketch-node-${i - 1}`,
          target: `sketch-node-${i}`,
          animated: false, // Solid line (non-animated)
        });
      }
      return [...otherEdges, ...sketchEdges];
    });
  };
  useEffect(() => {
    if (sketchMode) {
      updateSketchDiagram(sketchText);
    }
  }, [sketchText, sketchMode]);

  const handleUploadComplete = (data) => {
    if (data?.data?.workflow) {
      const workflow = data.data.workflow;

      // Extract Nodes
      const updatedNodes = workflow.nodes.map((node) => ({
        id: node.id,
        type: node.type || "default",
        position: node.position,
        data: { label: node.data.label },
      }));

      // Extract Edges
      const updatedEdges = workflow.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "step",
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        // animated: true,
      }));
      // Update React Flow state
      setNodes(updatedNodes);
      setEdges(updatedEdges);
    }
  };

  const handleSwitchChange = () => {
    dispatch(setIsWorkflowEnabled(!isWorkflowEnabled));
  };

  const onConnect = useCallback(
    (params) => {
      params["type"] = "step";
      console.log(params, "params");
      params["markerEnd"] = { type: "arrowclosed", color: "#b1b1b7" };
      setEdges((eds) => addEdge(params, eds));
    },
    [nodes]
  );

  const handleTabChange = (event, newTab) => {
    setSelectedTab(newTab);
    // console.log(newTab);
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("type", file.type);
    formData.append("size", file.size);
    try {
      const response = await uploadImage(formData, () => {});
      if (response?.status === 201) {
        let data = response?.data?.data?.file;
        dispatch(
          setSelectedImage({
            id: id,
            value: {
              ...selectedImage[id],
              title: file.name,
              link: data,
              type: file.type,
            },
          })
        );
      }
    } catch {
      console.log("error");
    }
  };
  // Handle save button click
  const handleSave = () => {
    if (!selectedNode) {
      console.error("No node selected");
      return;
    }
    // Save the node data
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                id: selectedNode.id,
                label: newLabel, // main label
                subLabel: newSubLabel, // new subheading
                image: selectedImage, // Add the image URL here
              },
            }
          : node
      )
    );
    // Dispatch image URL to Redux store
    if (selectedImage) {
      dispatch(setImageUrl(selectedImage)); // Dispatch the selected image URL
    }
    // Close the drawer and reset selected node after saving
    setDrawerOpen(false);
    setSelectedNode(null);
  };
  useEffect(() => {
    if (nodes.length > 0) {
      setSelectedNode(nodes[0]); // Automatically select the first node
    }
  }, [nodes]);
  const handleCloseDrawer = () => {
    dispatch(toggelServices({ openService: false })); // Close the Drawer via Redux
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDeleteClip = () => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? {
              ...n,
              data: {
                ...n.data,
                clips: [], // Remove clips from the node
              },
            }
          : n
      )
    );
  };

  const handleDeleteImage = () => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? {
              ...n,
              data: {
                ...n.data,
                images: [], // Remove images from the node
              },
            }
          : n
      )
    );
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!type) {
        console.warn("No node type specified for drag and drop");
        return;
      }
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
      setNodes((nds) => nds.concat(newNode));
      const filteredService = getallservices.filter((item) =>
        item?.ServiceElements.some((ele) => ele.ServiceElementName === type)
      );
      if (filteredService.length > 0) {
        console.log("Filtered Service:", filteredService);
      } else {
        console.warn(`No matching service found for type: ${type}`);
      }
    },
    [screenToFlowPosition, type, nodes, getallservices, dispatch]
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
  // const proOptions = { hideAttribution: true };
  const handleSaveFlow = async () => {
    const filter = Object.fromEntries(
      Object.entries(configData).filter(([key]) =>
        nodes.some((el) => el.id === key)
      )
    );

    const formattedData = {
      SOPName: presistStore.SOPName,
      SopDescription: presistStore?.SopDescription,
      SOPOwner: presistStore?.SOPOwner,
      SOPID: presistStore?.SOPID,
      ModuleTypeID: presistStore.ModuleTypeID,
      ContentID: presistStore.ContentID,
      SOPIsActive: presistStore?.SOPIsActive,
      SelfApproved: presistStore?.SelfApproved,
      IsTemplate: presistStore?.IsTemplate,
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
      NodeProperties: Object.keys(filter || {}).map((id) => ({
        id: id,
        serviceID:
          nodes.find((node) => node.id === id)?.data?.serviceID || null,
        properties: [filter[id]] || [],
      })),
      NodeRoles: Object.keys(rolesData || {}).flatMap((nodeKey) => {
        const node = rolesData[nodeKey];
        if (node?.length > 0) {
          return node.map((roleId) => ({
            id: nodeKey,
            roleID: roleId,
          }));
        }
        return [];
      }),
      NodeClipAttachments: Object.keys(selectedLinks || {}).flatMap((node) => {
        if (selectedLinks[node]?.selectedElement?.length > 0) {
          return selectedLinks[node].selectedElement.map((clip) => ({
            id: node,
            attachmentTitle: clip.ContentLinkTitle || "Default Clip Title",
            attachmentLink: clip.ContentLink || "Default Clip Link",
            attachmentType: clip.ContentLinkType || "Default Clip Type",
          }));
        }
        return [];
      }),
      NodeImageAttachments: Object.keys(selectedImage || {}).flatMap((node) => {
        if (selectedImage[node]?.link) {
          return {
            id: node,
            attachmentTitle: selectedImage[node].title || "Default Clip Title",
            attachmentLink: selectedImage[node].link || "Default Clip Link",
            attachmentType: selectedImage[node].type || "Default Clip Type",
          };
        }
        return [];
      }),
      Checker: Array.isArray(presistStore?.Checker) ? presistStore.Checker : [],
      EscalationPerson: Array.isArray(presistStore?.EscalationPerson)
        ? presistStore.EscalationPerson
        : [],
      EscalationType: presistStore?.EscalationType || "Weeks",
      EscalationAfter: presistStore?.EscalationAfter || "1",
    };

    try {
      let res;
      if (SopData !== null) {
        if (!isWorkflowEnabled) {
          res = await dispatch(GetCreateSOPReactFlow(formattedData));
        } else {
          res = await dispatch(GetCreateSOPReactFlow(formattedData));
          await dispatch(
            UpdateFLowPosition({
              FlowName: SopData.SOPName,
              FLowDescription: SopData.SopDescription,
              StartDate: new Date(),
              EndDate: new Date(),
              ownerId: SopData.SOPOwner,
              FlowNodePositionDetails: nodes,
              FlowNodeEdgesDetails: edges,
              NodeConfigs: filter,
              StartNodeID: startNodeId,
            })
          );
        }
      } else {
        if (!isWorkflowEnabled) {
          res = await dispatch(GetCreateSOPReactFlow(formattedData));
        } else {
          res = await dispatch(GetCreateSOPReactFlow(formattedData));
          await dispatch(
            UpdateFLowPosition({
              FlowName: SOPReactFlow?.sopModuleDraft?.SOPName,
              FLowDescription: SOPReactFlow?.sopModuleDraft.SopDescription,
              StartDate: SOPReactFlow?.sopModuleDraft?.StartDate,
              EndDate: SOPReactFlow?.sopModuleDraft?.EndDate,
              ownerId: SOPReactFlow?.sopModuleDraft.SOPOwner,
              FlowNodePositionDetails: nodes,
              FlowNodeEdgesDetails: edges,
              NodeConfigs: filter,
              StartNodeID: startNodeId,
              FlowID: SOPReactFlow?.sopModuleDraft.SOPID,
            })
          );
        }
      }
      if (res.meta.requestStatus) {
        dispatch(frontendState(res.payload));
        handleCloseDrawer();
      }
    } catch (error) {
      alert("An error occurred while saving the SOP flow. Please try again.");
    } finally {
      console.log("Save operation completed");
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
  }, [
    dispatch,
    presistStore.ModuleTypeID,
    presistStore.ContentID,
    presistStore.SOPID,
  ]);
  useEffect(() => {
    if (SOPReactFlow?.sopModuleDraft?.SopFlow && presistStore.SOPID !== null) {
      const { Nodes, Edges } = SOPReactFlow.sopModuleDraft.SopFlow;
      // Iterate over each node using a for loop
      for (let i = 0; i < Nodes?.length; i++) {
        const node = Nodes[i];
        let roles = [];

        // Use a for loop to push to roles array
        for (let j = 0; j < node.roles?.length; j++) {
          roles.push(node.roles[j].RoleID);
        }

        let attachments = [];
        // Use a for loop to push to attachments array
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

        // Ensure there's at least one image before dispatching
        if (images.length > 0) {
          // Dispatch the first image (or whichever image you need)
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
        // Dispatch selectedLinks update
        dispatch(
          setSelectedLinks({
            id: node.id,
            value: {
              selectedElement: attachments, // Update the selectedElement
            },
          })
        );

        // Dispatch roles data update
        dispatch(
          setRolesData({
            id: node.id,
            value: roles || [],
          })
        );

        // Iterate through properties and dispatch updates for each property using a for loop
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
                  color: prop.color, // Use fallback color
                },
              })
            );
          }
        }
      }

      // Update nodes and edges using a for loop
      const updatedNodes = [];
      for (let i = 0; i < Nodes?.length; i++) {
        // console.log(Nodes[i]);
        updatedNodes.push({
          id: Nodes[i].id,
          type: Nodes[i].type || "default", // Default type if not defined
          position: Nodes[i].position,
          data: {
            ...Nodes[i].data?.data, // Assuming nested data is valid
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
          type: "step",
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
  }, [SOPReactFlow?.sopModuleDraft, dispatch]);

  const CustomSubmit = () => {
    return (
      <Box
        className="bottom-action"
        sx={{
          width: "340px",
          height: "74px !importent",
        }}
      >
        <div>
          <Button variant="outlined" onClick={handleCloseDrawer}>
            Cancel
          </Button>
        </div>
        <div>
          <Button variant="contained" onClick={handleSaveFlow}>
            Save Changes
          </Button>
        </div>
      </Box>
    );
  };

  const convertBpmnToJson = async (bpmnXml) => {
    const moddle = new BpmnModdle();
    const { rootElement: definitions } = await moddle.fromXML(bpmnXml);

    const nodes = [];
    const edges = [];

    // Traverse the BPMN elements and convert them to React Flow nodes and edges
    definitions.rootElements.forEach((element) => {
      if (element.$type === "bpmn:Process") {
        element.flowElements.forEach((flowElement) => {
          if (
            flowElement.$type === "bpmn:Task" ||
            flowElement.$type === "bpmn:StartEvent" ||
            flowElement.$type === "bpmn:EndEvent"
          ) {
            nodes.push({
              id: flowElement.id,
              type: flowElement.$type.replace("bpmn:", "").toLowerCase(),
              position: { x: Math.random() * 500, y: Math.random() * 500 }, // Random position for now
              data: { label: flowElement.name || flowElement.id },
            });
          } else if (flowElement.$type === "bpmn:SequenceFlow") {
            edges.push({
              id: flowElement.id,
              source: flowElement.sourceRef.id,
              target: flowElement.targetRef.id,
            });
          }
        });
      }
    });

    return { nodes, edges };
  };

  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Ensure only BPMN files are allowed
    if (file.type !== "application/xml" && !file.name.endsWith(".bpmn")) {
      console.error("Invalid file format. Please upload a BPMN file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      try {
        let flowData;

        // Check if the file is a BPMN file
        if (file.name.endsWith(".bpmn") || file.type === "application/xml") {
          // Convert BPMN XML to JSON
          flowData = await convertBpmnToJson(content);
        }
        // Check if the file is a JSON file
        else if (
          file.name.endsWith(".json") ||
          file.type === "application/json"
        ) {
          // Parse the JSON file directly
          flowData = JSON.parse(content);
        }
        // Handle unsupported file types
        else {
          console.error(
            "Invalid file format. Please upload a BPMN or JSON file."
          );
          return;
        }

        // Extract nodes and edges
        const importedNodes = flowData.nodes || [];
        const importedEdges = flowData.edges || [];

        // Update React Flow state
        setNodes(importedNodes);
        setEdges(importedEdges);

        dispatch(
          updateConfigData({ nodes: importedNodes, edges: importedEdges })
        );
      } catch (err) {
        console.error("Error parsing the file:", err);
      }
    };

    reader.readAsText(file);
  };
  useEffect(() => {
    console.log("Current Diagram:", { nodes, edges });
  }, [nodes, edges]);

  const defaultEdgeOptions = {
    // type: "floating",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#b1b1b7",
    },
  };
  const handleImportDiagram = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    handleMenuClose();
  };
  const exportDiagramToPdf = async () => {
    // Select the container for the React Flow diagram
    const reactFlowWrapper = document.querySelector(".reactflow-wrapper");
    if (!reactFlowWrapper) {
      console.error("Diagram container not found");
      return;
    }

    try {
      // Ensure the diagram is fully visible before capturing
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Wait a bit for rendering
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Capture the diagram container as a canvas
      const canvas = await html2canvas(reactFlowWrapper, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff", // Ensure white background
        scale: 2, // Increase resolution for better quality
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      // Restore original overflow
      document.body.style.overflow = originalOverflow;

      // Convert canvas to image
      const imgData = canvas.toDataURL("image/png");

      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height], // Match size of the image
      });

      // Add image to PDF and save
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("diagram.pdf"); // Download the file
    } catch (error) {
      console.error("Error exporting diagram:", error);
    }
  };
  const handleExportDiagram = () => {
    handleMenuClose();
    exportDiagramToPdf();
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flowpage">
      <div className="flow-page-header-warpper">
        <FLowpageHeader
          action={
            <Box>
              <Typography
                variant="p"
                sx={{ fontWeight: "350", fontSize: "12px" }}
              >
                SOP
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isWorkflowEnabled}
                    onChange={handleSwitchChange}
                    color="primary"
                    sx={{ marginLeft: "10px", marginRight: "-15px" }}
                  />
                }
                label=""
              />
              <Typography
                variant="p"
                sx={{
                  fontWeight: "350",
                  fontSize: "12px",
                  marginRight: "15px",
                }}
              >
                SOP with Workflow
              </Typography>
              <Button
                variant="contained"
                sx={{
                  height: "25px",
                  fontSize: "12px",
                  marginRight: "10px",
                  backgroundColor: "#000",
                }}
                onClick={handleOpenModal}
              >
                <img src={AiIcon} alt="" style={{ marginRight: "5px" }} />{" "}
                {t("generateWithAI")}
              </Button>
              <UploadPDFModal
                open={isModalOpen}
                handleClose={handleCloseModal}
                onUploadComplete={handleUploadComplete}
              />

              <Button onClick={handleMenuClick}>
                <MoreVert style={{ color: "#000" }} />
              </Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem
                  onClick={handleImportDiagram}
                  sx={{ fontSize: "14px" }}
                >
                  {t("importDiagram")}
                </MenuItem>
                <MenuItem
                  onClick={handleExportDiagram}
                  sx={{ fontSize: "14px" }}
                >
                  Export Diagram
                </MenuItem>
                <MenuItem
                  onClick={() => setSketchMode(!sketchMode)}
                  sx={{ fontSize: "14px" }}
                >
                  {t("sketch")}
                </MenuItem>
              </Menu>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                onChange={handleFileImport}
              />
            </Box>
          }
        />

        <div style={{ display: "flex", flex: 1 }}>
          {sketchMode && (
            <div
              style={{
                width: "250px",
                padding: "10px",
                borderRight: "2px solid #ddd",
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
            style={{
              flex: sketchMode ? 1 : 1,
              position: "relative",
              width: "80vh",
            }}
          >
            <ReactFlow
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              defaultEdgeOptions={defaultEdgeOptions}
              nodes={nodes}
              edgeTypes={edgeTypes}
              proOptions={{ hideAttribution: true }}
            >
              <Controls />
            </ReactFlow>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1 }}>
          <div
            className="reactflow-wrapper"
            style={{
              flex: sketchMode ? 1 : 1,
              position: "relative",
              width: "80vh",
            }}
          >
            <ReactFlow
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              defaultEdgeOptions={defaultEdgeOptions}
              nodes={nodes}
              edgeTypes={edgeTypes}
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
        </div>
      </div>
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
    </div>
  );
};

const ExampFlowPage = () => (
  <ReactFlowProvider>
    <DnDProvider>
      <FlowPage />
    </DnDProvider>
  </ReactFlowProvider>
);

export default ExampFlowPage;

const draggableItems = [
  { type: "Start", img: starticon, name: "Start" },
  { type: "diamond", img: five, name: "Create A gateway" },
  { type: "create-task", img: roundrectangle, name: "Create Task" },
  { type: "comment", img: comment, name: "comment" },
  { type: "End", img: endicon, name: "End" },
];
