import { useState, useMemo, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import PropTypes from "prop-types";

import {
  GetSopOneApi,
  GetSopTwoApi,
} from "../../../services/elements/Elements";
import { Close, Fullscreen, Search } from "@mui/icons-material";
import { getroles } from "../../../services/enterprise/Enterprise";
// import { getAttachmentItemList } from "../../path/to/httpService"; // update path as needed
import headingicons from "../../../assets/svg/BPMN/headingIcon.svg";

import viewIcon from "../../../assets/svg/BPMN/viewIcon.svg";
import closeIcon from "../../../assets/svg/BPMN/closeIcon.svg";
import SopsfileIcon from "../../../assets/svg/BPMN/SOPsFileIcon.svg";
import documentIcon from "../../../assets/svg/SideBar/book-open.svg";
import trainingSimulation from "../../../assets/svg/SideBar/video.svg";
import testSimulation from "../../../assets/svg/SideBar/monitor.svg";
import testMCQ from "../../../assets/svg/SideBar/edit.svg";
import VideoIcon from "../../../assets/svg/BPMN/videoIcon.svg";
import cicon from "../../../assets/svg/BPMN/cicon.svg";
// import { ClauseModal } from "./ClauseModal";
import { getAttachmentItemList } from "../../bpmn/httpService";
import { ClauseModal } from "../../bpmn/ClauseModal";
import { useHeadingBgColor } from "../../useHeadingBgColor";
import { useTranslation } from "react-i18next";

const initialBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  targetNamespace="http://bpmn.io/schema/bpmn"
>
  <bpmn:process id="EmptyProcess" isExecutable="false" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="EmptyProcess" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

function configureShapeIcons(
  container,
  sopDetails,
  roles,
  createClipDetailsContent
) {
  if (!Array.isArray(sopDetails) || sopDetails.length === 0) return;
  const groupNodes = container.querySelectorAll("g");

  Array.from(groupNodes).forEach((node) => {
    sopDetails.forEach((shape) => {
      if (node.dataset.elementId === shape?.SopShapeID) {
        node.classList.add(node.dataset.elementId);
        let bbox = null;
        const visual = node.querySelector(".djs-visual");
        if (visual) {
          const shapeEl = visual.querySelector(
            "rect,ellipse,polygon,path,circle"
          );
          if (shapeEl && typeof shapeEl.getBBox === "function") {
            bbox = shapeEl.getBBox();
          }
        }
        if (!bbox) {
          bbox = node.getBBox();
        }
        Array.from(node.querySelectorAll("g[data-role]")).forEach((el) =>
          el.remove()
        );
        const roleIDs = shape.FooterProperties?.roles || [];
        const roleNames = Array.isArray(roles)
          ? roleIDs
            .map((id) => roles.find((r) => r.RoleID === id)?.RoleName)
            .filter(Boolean)
          : [];

        if (roleNames.length > 0) {
          const roleG = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
          );
          roleG.setAttributeNS(null, "data-role", shape.SopShapeID);
          const rectWidth = 100;
          const rectHeight = 14;
          const rectX = bbox.x + (bbox.width - rectWidth) / 2;
          const rectY = bbox.y + bbox.height - 15;
          const background = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
          );
          background.setAttribute("x", rectX);
          background.setAttribute("y", rectY);
          background.setAttribute("width", rectWidth);
          background.setAttribute("height", rectHeight);
          background.setAttribute("fill", "#007bff");
          background.setAttribute("rx", "7");
          background.setAttribute("ry", "15");

          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          text.setAttribute("x", rectX + rectWidth / 2);
          text.setAttribute("y", rectY + 10);
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("fill", "#fff");
          text.setAttribute("font-size", "10");
          text.setAttribute("font-family", "Inter");

          let displayText =
            roleNames[0].length > 15
              ? roleNames[0].substring(0, 15) + "..."
              : roleNames[0];
          if (roleNames.length > 1)
            displayText += ` (+${roleNames.length - 1})`;

          text.textContent = displayText;

          roleG.appendChild(background);
          roleG.appendChild(text);
          let tooltip = document.getElementById("bpmn-role-tooltip");
          if (!tooltip) {
            tooltip = document.createElement("div");
            tooltip.id = "bpmn-role-tooltip";
            tooltip.style.position = "fixed";
            tooltip.style.display = "none";
            tooltip.style.background = "#fff";
            tooltip.style.border = "1px solid #d1d1d1";
            tooltip.style.borderRadius = "8px";
            tooltip.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
            tooltip.style.padding = "10px 16px";
            tooltip.style.zIndex = "99999";
            tooltip.style.fontSize = "13px";
            tooltip.style.color = "#222";
            document.body.appendChild(tooltip);
          }
          roleG.addEventListener("mouseenter", (evt) => {
            tooltip.innerHTML = `<b>Roles:</b><ul style='margin:0;padding-left:18px;'>${roleNames
              .map((rn) => `<li>${rn}</li>`)
              .join("")}</ul>`;
            tooltip.style.display = "block";
            const mouseX =
              evt.clientX || (evt.touches && evt.touches[0].clientX) || 0;
            const mouseY =
              evt.clientY || (evt.touches && evt.touches[0].clientY) || 0;
            tooltip.style.left = mouseX + 12 + "px";
            tooltip.style.top = mouseY + 12 + "px";
          });
          roleG.addEventListener("mousemove", (evt) => {
            const mouseX =
              evt.clientX || (evt.touches && evt.touches[0].clientX) || 0;
            const mouseY =
              evt.clientY || (evt.touches && evt.touches[0].clientY) || 0;
            tooltip.style.left = mouseX + 12 + "px";
            tooltip.style.top = mouseY + 12 + "px";
          });
          roleG.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
          });

          node.appendChild(roleG);
        }

        // --- Remove existing clip icon(s) for this node ---
        Array.from(node.querySelectorAll("g[data-clip]")).forEach((el) =>
          el.remove()
        );

        // 2. Add clip icon if AttachmentIcon is true (SVG path, clickable, same as BPMN)
        if (shape.AttachmentIcon) {
          const newpathg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
          );
          newpathg.setAttributeNS(null, "data-clip", node.dataset.elementId);

          // Always position at the top-right of the main shape
          const iconSize = 15;
          const horizontalPadding = -10; // Padding from the right edge
          const verticalPadding = -20; // Negative padding to move it up above the shape
          const iconX = bbox.x + bbox.width - iconSize - horizontalPadding;
          const iconY = bbox.y + verticalPadding; // Negative value moves it up
          newpathg.setAttributeNS(
            null,
            "transform",
            `translate(${iconX},${iconY}) scale(1)`
          );

          const newpath = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          newpath.setAttributeNS(
            null,
            "d",
            "M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z"
          );
          newpath.setAttributeNS(null, "stroke", "#909194");
          newpath.setAttributeNS(null, "stroke-width", 1);
          newpath.setAttributeNS(null, "opacity", 1);
          newpath.setAttributeNS(null, "fill", "#22242a");
          newpath.setAttributeNS(null, "class", "event-curser");
          newpath.setAttributeNS(null, "transform", "scale(0.05)");

          // On click => open the context menu pop-up
          newpath.addEventListener("click", (ee) => {
            createClipDetailsContent(
              shape.SopDetailsID,
              node.dataset.elementId,
              ee.clientX,
              ee.clientY
            );
          });

          newpathg.appendChild(newpath);
          node.appendChild(newpathg);
        }
      }
    });
  });
}

async function getRolesList() {
  try {
    const rolesResponse = await getroles();
    return rolesResponse?.data?.data?.Roles || [];
  } catch {
    return [];
  }
}

// Update initOrImportXML to accept roles as argument (for reuse)
async function initOrImportXML(
  viewerRef,
  containerRef,
  xml,
  sopData,
  createClipDetailsContent,
  roles
) {
  if (!viewerRef.current) {
    viewerRef.current = new BpmnViewer({
      container: containerRef.current,
    });
  }

  try {
    await viewerRef.current.importXML(xml);
    viewerRef.current.get("canvas").zoom("fit-viewport", "auto");

    // Use passed roles or fetch if not provided
    let rolesList = roles;
    if (!rolesList) {
      rolesList = await getRolesList();
    }
    const sopDetails = sopData?.data?.data?.SOPDetails || [];

    configureShapeIcons(
      containerRef.current,
      sopDetails,
      rolesList,
      createClipDetailsContent
    );
  } catch (err) {
    console.error("Error importing BPMN XML:", err);
  }
}

const CompareBPMNModal = ({ open, onClose }) => {
  // Redux state which contains the entire "History" array
  const documentDetails = useSelector((state) => state.details.detailsData);

  const [leftVersion, setLeftVersion] = useState("");
  const [rightVersion, setRightVersion] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Lens toggle
  const [isLensActive, setIsLensActive] = useState(false);
  // Position of the cursor for the “lens” overlay
  const [mousePosLeft, setMousePosLeft] = useState({ x: 0, y: 0 });
  const [mousePosRight, setMousePosRight] = useState({ x: 0, y: 0 });
  const [leftSopData, setLeftSopData] = useState(null);
  const [rightSopData, setRightSopData] = useState(null);
  // Loader states
  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentID, setContentID] = useState(null);
  // Each side's BPMN container and viewer references
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);
  const leftViewerRef = useRef(null);
  const rightViewerRef = useRef(null);
  // Add a ref for the popup
  const popupRef = useRef(null);
  const bgColor = useHeadingBgColor();
  const { t } = useTranslation();

  // Sort/filter the History array
  const sortedHistory = useMemo(() => {
    if (!documentDetails?.History) return [];
    // Only show MasterVersion if present, otherwise show DraftVersion
    return [...documentDetails.History]
      .filter((h) => h.MasterVersion || h.DraftVersion)
      .sort((a, b) => {
        // Sort by MasterVersion (desc), then DraftVersion (desc)
        const aVer = a.MasterVersion || a.DraftVersion || "0";
        const bVer = b.MasterVersion || b.DraftVersion || "0";
        return parseFloat(bVer) - parseFloat(aVer);
      });
  }, [documentDetails]);

  // Set default versions when sortedHistory is loaded
  useEffect(() => {
    if (sortedHistory.length > 0) {
      const defaultVersion =
        sortedHistory[0].MasterVersion || sortedHistory[0].DraftVersion;
      if (!leftVersion) setLeftVersion(defaultVersion);
      if (!rightVersion) setRightVersion(defaultVersion);
    }
    // eslint-disable-next-line
  }, [sortedHistory]);

  // Fetch left SOP when leftVersion changes
  useEffect(() => {
    if (leftVersion) {
      const foundLeft = sortedHistory.find(
        (h) => h.MasterVersion === leftVersion || h.DraftVersion === leftVersion
      );
      if (foundLeft?.SOPID) {
        setLeftLoading(true);
        fetchLeftSop(foundLeft.SOPID).finally(() => setLeftLoading(false));
      } else {
        setLeftSopData(null);
      }
    }
    // eslint-disable-next-line
  }, [leftVersion, sortedHistory]);

  // Fetch right SOP when rightVersion changes
  useEffect(() => {
    if (rightVersion) {
      const foundRight = sortedHistory.find(
        (h) =>
          h.MasterVersion === rightVersion || h.DraftVersion === rightVersion
      );
      if (foundRight?.SOPID) {
        setRightLoading(true);
        fetchRightSop(foundRight.SOPID).finally(() => setRightLoading(false));
      } else {
        setRightSopData(null);
      }
    }
    // eslint-disable-next-line
  }, [rightVersion, sortedHistory]);

  // -- LEFT side: fetch SOP + store in "leftSopData" state
  const fetchLeftSop = async (sopId) => {
    try {
      const payload = { SOPID: sopId, IsActionable: true };
      const response = await GetSopOneApi(payload);
      setLeftSopData(response);
    } catch (error) {
      setLeftSopData(null);
      console.error("Error fetching left SOP =>", error);
    }
  };

  const fetchRightSop = async (sopId) => {
    try {
      const payload = { SOPID: sopId, IsActionable: true };
      const response = await GetSopTwoApi(payload);
      setRightSopData(response);
    } catch (error) {
      setRightSopData(null);
      console.error("Error fetching right SOP =>", error);
    }
  };

  const handleLeftVersionChange = (event) => {
    const selectedVersion = event.target.value;
    setLeftVersion(selectedVersion);
  };

  const handleRightVersionChange = (event) => {
    const selectedVersion = event.target.value;
    setRightVersion(selectedVersion);
  };

  useEffect(() => {
    const load = async () => {
      const bpmnXml = leftSopData?.data?.data?.SOPXMLElement;
      if (leftSopData) {
        const roles = await getRolesList();
        await initOrImportXML(
          leftViewerRef,
          leftCanvasRef,
          bpmnXml || initialBpmnXml,
          leftSopData,
          createClipDetailsContent,
          roles
        );
      }
    };
    load();
    // eslint-disable-next-line
  }, [leftSopData]);

  // Whenever rightSopData changes, load its BPMN:
  useEffect(() => {
    const load = async () => {
      const bpmnXml = rightSopData?.data?.data?.SOPXMLElement;
      if (rightSopData) {
        const roles = await getRolesList();
        await initOrImportXML(
          rightViewerRef,
          rightCanvasRef,
          bpmnXml || initialBpmnXml,
          rightSopData,
          createClipDetailsContent,
          roles
        );
      }
    };
    load();
    // eslint-disable-next-line
  }, [rightSopData]);

  // Highlight differences if both left and right data exist
  useEffect(() => {
    if (!leftSopData || !rightSopData) return;

    const highlightDifferences = async () => {
      const leftViewer = leftViewerRef.current;
      const rightViewer = rightViewerRef.current;
      if (!leftViewer || !rightViewer) return;

      try {
        // Import XML for both sides
        await Promise.all([
          leftViewer.importXML(leftSopData.data.data.SOPXMLElement),
          rightViewer.importXML(rightSopData.data.data.SOPXMLElement),
        ]);

        // --- Always re-add pins and role names after import ---
        const [rolesLeft, rolesRight] = await Promise.all([
          getRolesList(),
          getRolesList(),
        ]);
        const leftSopDetails = leftSopData?.data?.data?.SOPDetails || [];
        const rightSopDetails = rightSopData?.data?.data?.SOPDetails || [];
        configureShapeIcons(
          leftCanvasRef.current,
          leftSopDetails,
          rolesLeft,
          createClipDetailsContent
        );
        configureShapeIcons(
          rightCanvasRef.current,
          rightSopDetails,
          rolesRight,
          createClipDetailsContent
        );

        // Highlight differences
        const leftRegistry = leftViewer.get("elementRegistry");
        const rightRegistry = rightViewer.get("elementRegistry");

        // Only consider elements that are shapes (not labels, etc.)
        const leftElements = leftRegistry
          .getAll()
          .filter((el) => el.type && !el.labelTarget)
          .map((el) => el.id);
        const rightElements = rightRegistry
          .getAll()
          .filter((el) => el.type && !el.labelTarget)
          .map((el) => el.id);

        // Nodes only in left (removed in right)
        const leftOnly = leftElements.filter(
          (id) => !rightElements.includes(id)
        );
        // Nodes only in right (added in right)
        const rightOnly = rightElements.filter(
          (id) => !leftElements.includes(id)
        );

        const highlight = (viewer, ids, type) => {
          const canvas = viewer.get("canvas");
          // Remove all highlight markers first
          ids.forEach((id) => {
            canvas.removeMarker(id, "highlight-added");
            canvas.removeMarker(id, "highlight-removed");
          });
          // Add the new marker
          ids.forEach((id) => canvas.addMarker(id, type));
        };

        highlight(leftViewer, leftOnly, "highlight-removed"); // red on left
        highlight(rightViewer, rightOnly, "highlight-added"); // green on right

        leftViewer.get("canvas").zoom("fit-viewport", "auto");
        rightViewer.get("canvas").zoom("fit-viewport", "auto");
      } catch (error) {
        console.error("Error highlighting differences:", error);
      }
    };

    highlightDifferences();
    // eslint-disable-next-line
  }, [leftSopData, rightSopData]);

  // Toggle Lens functionality
  const handleLensToggle = () => {
    setIsLensActive((prev) => !prev);
  };

  // Mouse events for LEFT diagram
  const handleMouseMoveLeft = (e) => {
    if (!leftViewerRef.current) return;

    // Update lens circle position in that container
    const rect = leftCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosLeft({ x, y });

    // Only zoom if lens is active
    if (!isLensActive) return;

    const canvas = leftViewerRef.current.get("canvas");
    // Zoom to a fixed scale (2x), centered where the mouse is
    canvas.zoom(2, { x, y });
  };

  const handleMouseLeaveLeft = () => {
    if (!leftViewerRef.current) return;
    const canvas = leftViewerRef.current.get("canvas");
    // Restore the view
    canvas.zoom("fit-viewport", "auto");
  };

  // Mouse events for RIGHT diagram
  const handleMouseMoveRight = (e) => {
    if (!rightViewerRef.current) return;

    // Update lens circle position in that container
    const rect = rightCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosRight({ x, y });

    // Only zoom if lens is active
    if (!isLensActive) return;

    const canvas = rightViewerRef.current.get("canvas");
    // Zoom to a fixed scale (2x), centered where the mouse is
    canvas.zoom(2, { x, y });
  };

  const handleMouseLeaveRight = () => {
    if (!rightViewerRef.current) return;
    const canvas = rightViewerRef.current.get("canvas");
    // Restore the view
    canvas.zoom("fit-viewport", "auto");
  };
  console.log(documentDetails);

  // Create the pop-up content for attachments
  const createClipDetailsContent = async (shapeId, id, x, y) => {
    let respData;
    if (shapeId) {
      respData = await getAttachmentItemList(shapeId);
    }

    // Remove existing pop-ups
    document.querySelectorAll(".context-menu").forEach((el) => el.remove());

    let Temlet = "";
    const attachmentLinks = respData?.data?.SopAttachmentLinks || [];

    for (const element of attachmentLinks) {
      if (element?.ContentLinkType === "sop") {
        Temlet += `
        <div class="divider"></div>
        <div class="content-item">
          <img src="${SopsfileIcon}" alt="SOP Icon" />
          <span class="item-text">${element?.ContentLinkTitle}</span>
          <div>
            <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                 onclick="window.open('/sops/view/${encodeURIComponent(
          element?.ContentLink
        )}?SOP=false', '_blank');" />
          </div>
        </div>
      `;
      } else if (element?.ContentLinkType === "doc") {
        Temlet += `
        <div class="divider"></div>
        <div class="content-item">
          <img src="${documentIcon}" alt="Document Icon" />
          <span class="item-text">${element?.ContentLinkTitle}</span>
          <div>
            ${element?.RiskAndComplience?.NoOfClause > 0
            ? `<img src="${cicon}" alt="Clause Icon" style="width: 32px; height: 32px;"
                       class="openmodal" data-linkid="${element?.RiskAndComplience?.RiskAndComplianceID}" />`
            : ""
          }
            <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                 onclick="window.open('/documents/view/${encodeURIComponent(
            element?.ContentLink
          )}?SOP=false', '_blank');" />
          </div>
        </div>
      `;
      } else if (element?.ContentLinkType === "trs") {
        Temlet += `
        <div class="divider"></div>
        <div class="content-item">
          <img src="${trainingSimulation}" alt="Training Simulation Icon"/>
          <span class="item-text">${element?.ContentLinkTitle}</span>
          <div>
            <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                 onclick="window.open('/training-simulations/view/${encodeURIComponent(
          element?.ContentLink
        )}', '_blank');" />
          </div>
        </div>
      `;
      } else if (element?.ContentLinkType === "link") {
        Temlet += `
        <div class="divider"></div>
        <div class="content-item">
          <img src="${VideoIcon}" alt="Video Icon"/>
          <span class="item-text">${element?.ContentLinkTitle}</span>
          <div>
            <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                 onclick="window.open('${element?.ContentLink}', '_blank');" />
          </div>
        </div>
      `;
      } else if (element?.ContentLinkType === "tes") {
        Temlet += `
        <div class="divider"></div>
        <div class="content-item">
          <img src="${testSimulation}" alt="Test Simulation Icon"/>
          <span class="item-text">${element?.ContentLinkTitle}</span>
          <div>
            <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                 onclick="window.open('/test-simulations/view/${encodeURIComponent(
          element?.ContentLink
        )}', '_blank');" />
          </div>
        </div>
      `;
      } else if (element?.ContentLinkType === "mcq") {
        Temlet += `
        <div class="divider"></div>
        <div class="content-item">
          <img src="${testMCQ}" alt="MCQ Icon"/>
          <span class="item-text">${element?.ContentLinkTitle}</span>
          <div>
            <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                 onclick="window.open('/test-mcqs/view/${encodeURIComponent(
          element?.ContentLink
        )}?SOP=false', '_blank');" />
          </div>
        </div>
      `;
      }
    }

    // If no attachments
    if (attachmentLinks.length === 0) {
      Temlet += `
      <div class="divider"></div>
      <div class="content-item">
        <span class="item-text" style="text-align:center;">No Content Available</span>
      </div>
    `;
    }

    // Create the pop-up container
    document.querySelectorAll(".context-menu").forEach((el) => el.remove());
    const div = document.createElement("div");
    div.innerHTML = `
    <div class="context-menu" style="
         position: absolute;
         width: 350px; 
         box-shadow: .3em .3em .3em gray; 
         left: ${x - 350}px; 
         top: ${y}px;">
      <div class="dd-content">
        <div class="headerpopup">
          <div class="icon-container"></div>
          <div class="header-text">
            <h3>Content</h3>
          </div>
          <div class="close-button" 
               style="position: absolute; top: 10px; right: 10px; cursor: pointer;">
            <img src="${closeIcon}" alt="Close Icon" 
                 style="width: 24px; height: 24px;" 
                 onclick="document.querySelector('.context-menu')?.remove();" />
          </div>
        </div>
        ${Temlet}
      </div>
    </div>
  `;

    // Insert heading icon
    const iconContainer = div.querySelector(".icon-container");
    const headingImg = document.createElement("img");
    headingImg.src = headingicons;
    headingImg.alt = "Heading Icon";
    headingImg.style.width = "400px";
    iconContainer.appendChild(headingImg);

    // Add to DOM
    document.body.appendChild(div);
    popupRef.current = div;

    // Adjust if out of viewport
    const modalRect = div.getBoundingClientRect();
    if (modalRect.left < 0) {
      div.style.left = `10px`;
    }

    // Close if user clicks outside
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        popupRef.current.remove();
        popupRef.current = null;
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // If there's a "cicon" (risk/compliance) button => open ClauseModal
    document.querySelectorAll(".openmodal").forEach((el) => {
      el.addEventListener("click", openModal);
    });
  };

  const openModal = (e) => {
    document.querySelector(".context-menu")?.remove();
    setContentID(e.target.dataset.linkid);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // Helper to get display version and value
  const getDisplayVersion = (histItem) => {
    if (histItem.MasterVersion) {
      return {
        label: `${histItem.MasterVersion} Version`,
        value: histItem.MasterVersion,
        type: "master",
      };
    } else if (histItem.DraftVersion) {
      return {
        label: `${histItem.DraftVersion} (InProgress)`,
        value: histItem.DraftVersion,
        type: "draft",
      };
    }
    return { label: "", value: "", type: "" };
  };

  // -- MAIN RETURN
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{
        "& .MuiDialog-paper": isFullscreen
          ? {
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            margin: 0,
            borderRadius: 0,
          }
          : {},
      }}
    >
      {/* Top bar */}
      {!isFullscreen && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ backgroundColor: bgColor }}
          paddingX={2}
          paddingTop={2}
          paddingBottom={1}
        >
          <Typography variant="h6" sx={{ color: "#fff" }}>
            {t("compareSOPs")}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>
      )}
      {console.log(sortedHistory)}{" "}
      <DialogContent dividers>
        {/* Dropdowns to pick left and right versions */}
        {!isFullscreen && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
            mt={1}
          >
            {/* Left side */}
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>{t("searchVersion")}</InputLabel>
              <Select
                value={leftVersion}
                label="Version (Left)"
                onChange={handleLeftVersionChange}
              >
                {sortedHistory.map((histItem) => {
                  const { label, value } = getDisplayVersion(histItem);
                  return (
                    <MenuItem key={histItem.SOPID} value={value}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            {/* Right side */}
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>{t("searchVersion")}</InputLabel>
              <Select
                value={rightVersion}
                label="Version (Right)"
                onChange={handleRightVersionChange}
              >
                {sortedHistory.map((histItem) => {
                  const { label, value } = getDisplayVersion(histItem);
                  return (
                    <MenuItem key={histItem.SOPID} value={value}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Side-by-side BPMN viewers */}
        <Box
          display="flex"
          flexDirection="row"
          gap={2}
          sx={{ height: isFullscreen ? "85vh" : "60vh" }}
        >
          {/* Left BPMN container */}
          <Box
            flex={1}
            border="1px solid #ccc"
            borderRadius={1}
            position="relative"
            onMouseMove={handleMouseMoveLeft}
            onMouseLeave={handleMouseLeaveLeft}
            minHeight={200}
          >
            {leftLoading && (
              <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="rgba(255,255,255,0.7)"
                zIndex={10}
              >
                <span>{t("loading")}</span>
              </Box>
            )}
            <div
              ref={leftCanvasRef}
              style={{ width: "100%", height: "100%" }}
            />
            {/* If lens is active, show a circle overlay at the mouse position */}
            {isLensActive && (
              <div
                style={{
                  position: "absolute",
                  top: mousePosLeft.y - 50,
                  left: mousePosLeft.x - 50,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  pointerEvents: "none",
                  border: "2px solid red",
                  // Use a semi-transparent background to mimic a "lens"
                  background: "rgba(255, 255, 255, 0.1)",
                }}
              ></div>
            )}
          </Box>

          {/* Right BPMN container */}
          <Box
            flex={1}
            border="1px solid #ccc"
            borderRadius={1}
            position="relative"
            onMouseMove={handleMouseMoveRight}
            onMouseLeave={handleMouseLeaveRight}
            minHeight={200}
          >
            {rightLoading && (
              <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="rgba(255,255,255,0.7)"
                zIndex={10}
              >
                <span>Loading...</span>
              </Box>
            )}
            <div
              ref={rightCanvasRef}
              style={{ width: "100%", height: "100%" }}
            />
            {/* If lens is active, show a circle overlay at the mouse position */}
            {isLensActive && (
              <div
                style={{
                  position: "absolute",
                  top: mousePosRight.y - 50,
                  left: mousePosRight.x - 50,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  pointerEvents: "none",
                  border: "2px solid red",
                  background: "rgba(255, 255, 255, 0.1)",
                }}
              ></div>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        {!isFullscreen && (
          <Button variant="contained" onClick={onClose}>
            {t("close")}
          </Button>
        )}

        {/* Lens Icon Toggle */}
        <IconButton onClick={handleLensToggle}>
          <Search
            // Add some indication if lens is active (optional)
            style={{ opacity: isLensActive ? 1 : 0.7 }}
          />
        </IconButton>

        {/* Fullscreen Icon Toggle */}
        <IconButton onClick={() => setIsFullscreen((prev) => !prev)}>
          {isFullscreen ? <Close /> : <Fullscreen />}
        </IconButton>
      </DialogActions>
      <style>
        {`
    /* Make highlight work regardless of where the marker class is applied */
.highlight-added .djs-visual > :nth-child(1),
.djs-element.highlight-added .djs-visual > :nth-child(1) {
  stroke: green !important;
  stroke-width: 3px !important;
  animation: highlightAdded 1s linear infinite;
}

.highlight-removed .djs-visual > :nth-child(1),
.djs-element.highlight-removed .djs-visual > :nth-child(1) {
  stroke: red !important;
  stroke-width: 3px !important;
  animation: highlightRemoved 1s linear infinite;
}

@keyframes highlightAdded {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  25% {
    opacity: 0.2;
    transform: scale(1);
  }
}

@keyframes highlightRemoved {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  25% {
    opacity: 0.2;
    transform: scale(1);
  }
}

  `}
      </style>
      <ClauseModal
        open={isModalOpen}
        onClose={closeModal}
        contentID={contentID}
      />
    </Dialog>
  );
};

export default CompareBPMNModal;

CompareBPMNModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
