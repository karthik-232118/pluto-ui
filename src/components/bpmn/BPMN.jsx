import { useEffect, useRef, useState } from "react";
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";

import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Tooltip,
  Badge,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import riskIcon from "../../assets/image/accountOpening/risk.svg";
import complianceIcon from "../../assets/image/accountOpening/com.svg";
import impactanalysisIcon from "../../assets/svg/impactanalysis/impactanalysisIcon.svg";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { getAttachmentItemList } from "./httpService";
import "./BPMN.css";
import headingicons from "../../assets/svg/BPMN/headingIcon.svg";
import viewIcon from "../../assets/svg/BPMN/viewIcon.svg";
import closeIcon from "../../assets/svg/BPMN/closeIcon.svg";
import SopsfileIcon from "../../assets/svg/BPMN/SOPsFileIcon.svg";
import documentIcon from "../../assets/svg/SideBar/book-open.svg";
import trainingSimulation from "../../assets/svg/SideBar/video.svg";
import testSimulation from "../../assets/svg/SideBar/monitor.svg";
import testMCQ from "../../assets/svg/SideBar/edit.svg";
import VideoIcon from "../../assets/svg/BPMN/videoIcon.svg";
import cicon from "../../assets/svg/BPMN/cicon.svg";
import { ClauseModal } from "./ClauseModal";
import RiskAndComplianceModal from "../allpages/sops/RiskAndComplianceModal";
import { useDispatch, useSelector } from "react-redux";
import { impactAnalysis } from "../../store/impactAnalysis/ImpactAnalysis";
import { useNavigate } from "react-router";
import { getroles } from "../../services/enterprise/Enterprise";

const initialBpmnXml = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
  id="Definitions_1" 
  targetNamespace="http://bpmn.io/schema/bpmn"
>
  <bpmn:process id="Process_1" isExecutable="false" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

export default function BPMN({ sopDetails }) {
  console.log(sopDetails, "sopDetailssopDetailssopDetails");
  const embeddedCanvasRef = useRef(null);
  const modalCanvasRef = useRef(null);
  const embeddedViewerRef = useRef(null);
  const modalViewerRef = useRef(null);
  const popupRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bpmnOpen, setBpmnOpen] = useState(false);
  const [openRandCModal, setOpenRandCModal] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentID, setContentID] = useState(null);
  const { RiskAndCompliences } = useSelector(
    (state) => state.RiskAndCompliences
  );
  const { elementsDocumentFiles } = useSelector((state) => state.elements);

  // useEffect(() => {
  //   if (sopDetails) {
  //     sopDetails.SOPDetails.forEach((detail) => {
  //       // console.log("roleIDs:", detail.FooterProperties?.roles);
  //       // console.log("SopShapeID:", detail.SopShapeID);
  //     });
  //   }
  // }, [sopDetails]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getroles();
        console.log("Fetched roles in BPMN: ", response.data.data.Roles);
      } catch (err) {
        console.error("Error fetching roles: ", err);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getroles();
        const roles = response.data.data.Roles;
        console.log("Fetched roles in BPMN: ", roles);
        if (sopDetails) {
          sopDetails.SOPDetails.forEach((detail) => {
            const roleIDs = detail.FooterProperties?.roles;
            const sopShapeID = detail.SopShapeID;
            if (roleIDs && roleIDs.length > 0) {
              roleIDs.forEach((roleID) => {
                const matchedRole = roles.find(
                  (role) => role.RoleID === roleID
                );
                if (matchedRole) {
                  console.log(`For Shape ${sopShapeID}, Matching Role:`, {
                    RoleID: roleID,
                    RoleName: matchedRole.RoleName,
                    SopShapeID: sopShapeID,
                  });
                } else {
                  console.log(
                    `For Shape ${sopShapeID}, No role found for ID: ${roleID}`
                  );
                }
              });
            }
          });
        }
      } catch (err) {
        console.error("Error fetching roles: ", err);
      }
    };

    fetchRoles();
  }, [sopDetails]);

  useEffect(() => {
    if (sopDetails && !embeddedViewerRef.current) {
      initEmbeddedModeler(sopDetails);
    }
  }, [sopDetails]);

  useEffect(() => {
    if (bpmnOpen && sopDetails) {
      setTimeout(() => {
        initOrUpdateModalModeler(sopDetails);
      }, 0);
    }
  }, [bpmnOpen, sopDetails]);

  const initEmbeddedModeler = async (data) => {
    try {
      embeddedViewerRef.current = new BpmnViewer({
        container: embeddedCanvasRef.current,
      });

      await embeddedViewerRef.current.importXML(
        data?.SOPXMLElement || initialBpmnXml
      );
      embeddedViewerRef.current.get("canvas").zoom("fit-viewport", "auto");
      const rolesResponse = await getroles();
      const roles = rolesResponse.data.data.Roles;
      configureShapeIcons(embeddedCanvasRef.current, { ...data, Roles: roles });
    } catch (err) {
      console.error("Error initializing embedded BPMN viewer:", err);
    }
  };

  const initOrUpdateModalModeler = async (data) => {
    try {
      if (!modalViewerRef.current) {
        modalViewerRef.current = new BpmnViewer({
          container: modalCanvasRef.current,
        });
      }
      await modalViewerRefbn.current.importXML(
        data?.SOPXMLElement || initialBpmnXml
      );
      modalViewerRef.current.get("canvas").zoom("fit-viewport", "auto");
      const rolesResponse = await getroles();
      const roles = rolesResponse.data.data.Roles;
      configureShapeIcons(modalCanvasRef.current, { ...data, Roles: roles });
    } catch (err) {
      console.error("Error initializing modal BPMN viewer:", err);
    }
  };

  const configureShapeIcons = (container, data) => {
    if (!data.SOPDetails?.length) return;
    const groupNodes = container.querySelectorAll("g");
    Array.from(groupNodes).forEach((node) => {
      data.SOPDetails.forEach((shape) => {
        if (node.dataset.elementId === shape?.SopShapeID) {
          node.classList.add(node.dataset.elementId);
          const bbox = node.getBBox();
          if (data.Roles?.length) {
            const roleIDs = shape.FooterProperties?.roles || [];
            const roleNames = roleIDs
              .map(
                (roleID) =>
                  data.Roles.find((r) => r.RoleID === roleID)?.RoleName
              )
              .filter(Boolean);

            if (roleNames.length > 0) {
              const roleG = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
              );
              roleG.setAttributeNS(null, "data-role", shape.SopShapeID);

              const rectWidth = 100;
              const rectHeight = 14;
              const rectX = bbox.x + (bbox.width - rectWidth) / 2;
              const rectY = bbox.y + bbox.height - 14 - 6;

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
              text.setAttribute("x", rectX + 50);
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

              // Tooltip logic
              // Add a tooltip div to the DOM if not present
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
                // Position tooltip near mouse
                const mouseX =
                  evt.clientX || (evt.touches && evt.touches[0].clientX) || 0;
                const mouseY =
                  evt.clientY || (evt.touches && evt.touches[0].clientY) || 0;
                tooltip.style.left = mouseX + 12 + "px";
                tooltip.style.top = mouseY + 12 + "px";
              });
              roleG.addEventListener("mousemove", (evt) => {
                // Move tooltip with mouse
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
          }

          // 2. Add clip icon if AttachmentIcon is true
          if (shape.AttachmentIcon) {
            const newpathg = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "g"
            );
            newpathg.setAttributeNS(null, "data-clip", node.dataset.elementId);

            // Position near top-right of the shape
            newpathg.setAttributeNS(
              null,
              "transform",
              `matrix(1 0 0 1 ${bbox.width - 15} -15)`
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
  };

  const createClipDetailsContent = async (shapeId, id, x, y) => {
    let respData;
    if (shapeId) {
      respData = await getAttachmentItemList(shapeId);
    }

    document.querySelectorAll(".context-menu").forEach((el) => el.remove());

    let Temlet = "";
    const attachmentLinks = respData?.data?.SopAttachmentLinks || [];
    console.log("attachmentLinks", attachmentLinks);

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
              ${
                element?.RiskAndComplience?.NoOfClause > 0
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
    if (attachmentLinks.length === 0) {
      Temlet += `
        <div class="divider"></div>
        <div class="content-item">
          <span class="item-text" style="text-align:center;">No Content Available</span>
        </div>
      `;
    }
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
    const iconContainer = div.querySelector(".icon-container");
    const headingImg = document.createElement("img");
    headingImg.src = headingicons;
    headingImg.alt = "Heading Icon";
    headingImg.style.width = "400px";
    iconContainer.appendChild(headingImg);
    document.body.appendChild(div);
    popupRef.current = div;
    const modalRect = div.getBoundingClientRect();
    if (modalRect.left < 0) {
      div.style.left = `10px`;
    }
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        popupRef.current.remove();
        popupRef.current = null;
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.querySelectorAll(".openmodal").forEach((el) => {
      el.addEventListener("click", openModal);
    });
  };

  const openModal = (e) => {
    document.querySelector(".context-menu")?.remove();
    setContentID(e.target.dataset.linkid);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenBpmnModal = () => {
    setBpmnOpen(true);
  };
  const handleCloseBpmnModal = () => {
    setBpmnOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    const removeWatermark = () => {
      const watermark = document.querySelector(".bjs-powered-by");
      if (watermark) {
        watermark.remove();
      }
    };
    setTimeout(removeWatermark, 1000);
  }, [sopDetails]);

  const handleOpenModal = (heading) => {
    setModalHeading(heading);
    setOpenRandCModal(true);
  };

  const handleCloseModal = () => {
    setOpenRandCModal(false);
    setModalHeading("");
  };
  const NoOfRisk =
    elementsDocumentFiles?.data?.RiskAndComplience?.NoOfRisk || 0;
  const NoOfCompliance =
    elementsDocumentFiles?.data?.RiskAndComplience?.NoOfCompliance || 0;

  const NoOfClause =
    elementsDocumentFiles?.data?.RiskAndComplience?.NoOfClause || 0;

  const handleImpactAnalysisClick = () => {
    if (!elementsDocumentFiles?.data?.SOPID) return;

    const payload = {
      ModuleID: elementsDocumentFiles.data.SOPID,
      ImpactAnalysisTarget: "SOP",
      name: sopDetails?.SOPName,
    };
    localStorage.setItem("impactAnalysisPayload", JSON.stringify(payload));
    dispatch(impactAnalysis(payload));
    navigate("/impact-analysis?fullscreen=true");
  };

  return (
    <>
      <div
        style={{
          border: "1px solid #ccc",
          width: "100%",
          height: "600px",
          marginBottom: "1rem",
          position: "relative",
        }}
      >
        <div
          ref={embeddedCanvasRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <Button
        onClick={handleOpenBpmnModal}
        style={{ color: "#000", width: "50px", marginTop: "-100px" }}
      >
        ⛶
      </Button>
      <Dialog
        fullScreen
        open={bpmnOpen}
        onClose={handleCloseBpmnModal}
        disableEscapeKeyDown={true}
      >
        <div style={{ marginTop: "-10px", cursor: "pointer" }}>
          <DialogActions sx={{ justifyContent: "flex-end" }}>
            <CloseIcon onClick={handleCloseBpmnModal} />
          </DialogActions>
        </div>

        <DialogContent sx={{ p: 0 }}>
          <div
            ref={modalCanvasRef}
            style={{ width: "100%", height: "calc(100vh - 64px)" }}
          />
          <div
            style={{
              position: "fixed",
              top: 20,
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 60px",
              gap: 15,
              zIndex: 1000,
            }}
          >
            <div
              style={{
                padding: "0 10px",
                height: 45,
                display: "flex",
                alignItems: "center",
                border: "1px solid #dcdfe6",
                backgroundColor: "#f7f8fa",
                borderRadius: 8,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#000",
                  fontWeight: 500,
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              >
                SOP&nbsp;Name:&nbsp;
                <span style={{ color: "#4361ee", fontWeight: 600 }}>
                  {sopDetails?.SOPName}
                </span>
              </Typography>
            </div>
            <div style={{ display: "flex", gap: 15 }}>
              {NoOfClause > 0 && (
                <Tooltip title="Clause">
                  <Badge
                    badgeContent={NoOfClause}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "orange",
                        color: "white",
                      },
                    }}
                  >
                    <img
                      src={cicon}
                      alt="Clause"
                      style={{ cursor: "pointer", width: 40, height: 40 }}
                      onClick={() => handleOpenModal("Clause")}
                    />
                  </Badge>
                </Tooltip>
              )}

              {NoOfRisk > 0 && (
                <Tooltip title="Risk">
                  <Badge badgeContent={NoOfRisk} color="error">
                    <img
                      src={riskIcon}
                      alt="Risk"
                      style={{ cursor: "pointer", width: 40, height: 40 }}
                      onClick={() => handleOpenModal("Risk")}
                    />
                  </Badge>
                </Tooltip>
              )}

              {NoOfCompliance > 0 && (
                <Tooltip title="Compliance">
                  <Badge badgeContent={NoOfCompliance} color="error">
                    <img
                      src={complianceIcon}
                      alt="Compliance"
                      style={{ cursor: "pointer", width: 40, height: 40 }}
                      onClick={() => handleOpenModal("Compliance")}
                    />
                  </Badge>
                </Tooltip>
              )}

              <Tooltip title="Impact Analysis">
                <img
                  src={impactanalysisIcon}
                  alt="Impact Analysis Icon"
                  style={{ cursor: "pointer", width: 40, height: 40 }}
                  onClick={handleImpactAnalysisClick}
                />
              </Tooltip>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RiskAndComplianceModal
        open={openRandCModal}
        onClose={handleCloseModal}
        heading={modalHeading}
        content={`Content related to ${modalHeading} will go here.`}
        RiskAndCompliences={RiskAndCompliences}
      />

      {/* ClauseModal for compliance or doc clause items */}
      <ClauseModal
        open={isModalOpen}
        onClose={closeModal}
        contentID={contentID}
      />
    </>
  );
}
