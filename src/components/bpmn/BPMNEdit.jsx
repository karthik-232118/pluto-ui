import { useEffect, useRef, useState } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { getSearchElementList } from "./httpService";
import "./BPMN.css";
import headingicons from "../../assets/svg/BPMN/headingIcon.svg";
import viewIcon from "../../assets/svg/BPMN/viewIcon.svg";
import closeIcon from "../../assets/svg/BPMN/closeIcon.svg";
import SopsfileIcon from "../../assets/svg/BPMN/SOPsFileIcon.svg";
import VideoIcon from "../../assets/svg/BPMN/videoIcon.svg";
import BookOpen from "../../assets/svg/SideBar/book-open.svg";
import EditIcon from "../../assets/svg/SideBar/edit.svg";
import MonitorIcon from "../../assets/svg/SideBar/monitor.svg";
import ColorPickerModule from "./colors/index";
import { getroles } from "../../services/enterprise/Enterprise";
import LinkPopUp from "./LinkPopUp";
import LinkIcon from "../../assets/svg/BPMN/LinkIcon.svg";
import { Backdrop, Box, Button } from "@mui/material";
import Pageloader from "../../assets/image/cubeloader.gif";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useHeadingBgColor } from "../useHeadingBgColor";

const initialBpmnXml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
      <bpmn:process id="Process_1" isExecutable="false" />
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
      </bpmndi:BPMNDiagram>
    </bpmn:definitions>
    `;

export default function BPMNEdit(props) {
  let {
    setXml,
    shapeDetails,
    setShapeDetails,
    selectedelement,
    setSelectedElement,
    selectedElementRef,
    // setSopDraftData,
    modelerRef,
    canvasRef,

    // setSOPData,
  } = props;
  const apiCallRef = useRef(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [elemetList, setElementList] = useState([]);
  const selectedShapeId = useRef(null);
  const existingLinkedElement = useRef(null);
  const [searchString, setSearchString] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [rolePins, setRolePins] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  const [hoveredRoles, setHoveredRoles] = useState([]);
  const [showRoleTooltip, setShowRoleTooltip] = useState(false);
  const roleTooltipRef = useRef(null);
  const SOPData = props.SOPData; // no new reference = no update

  const popupRef = useRef(null);
  const { t } = useTranslation();
  const bgColor = useHeadingBgColor();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false); // Close the popup if clicked outside
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside); // Clean up event listener
    };
  }, []);

  useEffect(() => {
    getroles()
      .then((response) => {
        console.log(
          "Roles API Response from BPMN:",
          response?.data?.data?.Roles
        );
        setRoles(response?.data?.data?.Roles || []);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  useEffect(() => {
    if (SOPData?.SOPXMLElement) {
      if (!apiCallRef.current && SOPData?.SOPXMLElement && roles?.length) {
        initModeler();
        apiCallRef.current = true;
      }
    }
  }, [apiCallRef, SOPData?.SOPXMLElement, roles, setRoles]);

  const openRoleModal = () => {
    setIsRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedRoles([]); // Clear all selected roles when closing modal
  };

  const handleRoleSelect = (roleId) => {
    // If role is already selected, deselect it
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    } else {
      // If more than 3 are already selected, show an alert
      if (selectedRoles.length >= 100) {
        alert("You can only select up to 100 roles.");
      } else {
        // Otherwise, add the new role
        setSelectedRoles([...selectedRoles, roleId]);
      }
    }
  };

  const handleSaveRoles = () => {
    setRolePins(selectedRoles);

    const updatedDetails = SOPData.SopDetails.map((detail) => {
      if (detail.SopShapeID === selectedShapeId.current) {
        return {
          ...detail,
          FooterProperties: {
            ...detail.FooterProperties,
            roles: selectedRoles,
          },
        };
      }
      return detail;
    });

    // If the node is not in SopDetails, store roles in newRolesMap
    const isExisting = SOPData.SopDetails.some(
      (d) => d.SopShapeID === selectedShapeId.current
    );
    if (!isExisting && selectedShapeId.current) {
      setNewRolesMap((prev) => ({
        ...prev,
        [selectedShapeId.current]: [...selectedRoles],
      }));
    }

    props.setSOPData({
      ...SOPData,
      SopDetails: updatedDetails,
    });

    // Pass both shapeId and roleIds properly
    addRolePinsToDiagram(selectedShapeId.current, selectedRoles);

    closeRoleModal();
  };

  // Track roles for new nodes
  const [newRolesMap, setNewRolesMap] = useState({});

  // Helper to get all roles for all nodes (old + new)
  const getAllRolesData = () => {
    if (!roles.length) return [];
    const elementRegistry = modelerRef.current.get("elementRegistry");
    const allElements = elementRegistry.getAll();

    const rolesData = [];

    // 1. Existing nodes with roles from SopDetails
    SOPData?.SopDetails?.forEach((detail) => {
      const roleIDs = detail.FooterProperties?.roles || [];
      if (roleIDs.length > 0) {
        const roleNames = roleIDs
          .map((id) => {
            const role = roles.find((r) => r.RoleID === id);
            return role ? role.RoleName : null;
          })
          .filter(Boolean);

        rolesData.push({
          roleNames,
          roleIDs,
          nodeID: detail.SopShapeID,
        });
      }
    });

    // 2. Newly added nodes NOT in SopDetails yet (from newRolesMap)
    allElements.forEach((element) => {
      if (
        element.type === "bpmn:Process" ||
        rolesData.some((item) => item.nodeID === element.id)
      ) {
        return;
      }

      let roleIDs = element.businessObject?.roleIDs || [];
      if (roleIDs.length === 0) {
        // roleIDs = newRolesMap[element.id] || [];
      }

      if (roleIDs.length > 0) {
        const roleNames = roleIDs
          .map((id) => {
            const role = roles.find((r) => r.RoleID === id);
            return role ? role.RoleName : null;
          })
          .filter(Boolean);

        rolesData.push({
          roleNames,
          roleIDs,
          nodeID: element.id,
        });
      }
    });

    return rolesData;
  };

  // Call onRolesData with all roles (old + new) whenever roles or newRolesMap changes
  useEffect(() => {
    if (roles.length && modelerRef.current) {
      if (props.onRolesData) {
        props.onRolesData(getAllRolesData());
      }
    }
    // eslint-disable-next-line
  }, [SOPData?.SopDetails, roles, newRolesMap]);

  const handleRoleMouseEnter = (roles) => {
    setHoveredRoles(roles);
    setShowRoleTooltip(true);
  };

  const handleRoleMouseLeave = () => {
    setShowRoleTooltip(false);
  };

  const addRolePinsToDiagram = async (shapeId, roleIds) => {
    const selectedElement = document.querySelector(`.${shapeId}`);
    if (!selectedElement) return;

    const elementRegistry = await modelerRef.current.get("elementRegistry");
    const element = elementRegistry.get(shapeId);
    if (element && element.businessObject) {
      // console.log(element.businessObject, "element.businessObject");
      element.businessObject.roleIDs = roleIds; // <-- sync roles to businessObject here
    }

    // Remove existing role group for this node to avoid duplicates
    const existingRoleGroup = selectedElement.querySelector(
      `[data-role="${shapeId}"]`
    );
    if (existingRoleGroup) existingRoleGroup.remove();

    // Map role IDs to names using `roles` state
    const roleNames = await roleIds
      .map((roleId) => {
        const roleObj = roles.find((r) => r.RoleID === roleId);
        return roleObj ? roleObj.RoleName : null;
      })
      .filter((name) => name !== null);

    if (roleNames.length === 0) return;

    // Create SVG group <g> for roles label
    const newRoleG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    newRoleG.setAttributeNS(null, "data-role", shapeId);
    const bbox = selectedElement.getBBox();
    newRoleG.setAttributeNS(
      null,
      "transform",
      `translate(${bbox.x + 5}, ${bbox.y + bbox.height - 19})`
    );

    // Background rect
    const newRoleRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    newRoleRect.setAttributeNS(null, "width", "100");
    newRoleRect.setAttributeNS(null, "height", "14");
    newRoleRect.setAttributeNS(null, "fill", "#007bff");
    newRoleRect.setAttributeNS(null, "rx", "7");
    newRoleRect.setAttributeNS(null, "ry", "7");

    // Text
    const newRoleText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    newRoleText.setAttributeNS(null, "fill", "#ffffff");
    newRoleText.setAttributeNS(null, "font-size", "10");
    newRoleText.setAttributeNS(null, "font-family", "Inter");
    newRoleText.setAttributeNS(null, "x", "8");
    newRoleText.setAttributeNS(null, "y", "11");

    let displayText =
      roleNames[0].length > 15
        ? roleNames[0].substring(0, 15) + "..."
        : roleNames[0];
    if (roleNames.length > 1) displayText += ` (+${roleNames.length - 1})`;
    newRoleText.textContent = displayText;

    newRoleG.addEventListener("mouseenter", () =>
      handleRoleMouseEnter(roleNames)
    );
    newRoleG.addEventListener("mouseleave", handleRoleMouseLeave);

    newRoleG.appendChild(newRoleRect);
    newRoleG.appendChild(newRoleText);

    selectedElement.appendChild(newRoleG);
  };

  const initModeler = async () => {
    try {
      const modeler = new BpmnModeler({
        container: canvasRef.current,
        additionalModules: [ColorPickerModule],
      });

      modelerRef.current = modeler;
      modeler.on("element.click", () => {
        // Handle element click
      });
      modeler.on("element.changed", async (event) => {
        const element = event.element;
        if (
          element.type === "bpmn:Task" ||
          element.type === "bpmn:ServiceTask" ||
          element.type === "bpmn:UserTask" ||
          element.type === "bpmn:SendTask" ||
          element.type === "bpmn:ReceiveTask" ||
          element.type === "bpmn:ManualTask" ||
          element.type === "bpmn:BusinessRuleTask" ||
          element.type === "bpmn:ScriptTask" ||
          element.type === "bpmn:CallActivity" ||
          element.type === "bpmn:SubProcess"
        ) {
          const businessObject = element.businessObject;
          if (businessObject.name) {
            // console.log("Task name length:", businessObject.name.length);

            if (businessObject.name.length > 45) {
              // Truncate to max 45 characters
              const truncatedName = businessObject.name.substring(0, 45);

              // Only update and alert if the name actually changed to avoid infinite loops
              if (businessObject.name !== truncatedName) {
                modeler.get("modeling").updateProperties(element, {
                  name: truncatedName,
                });
                alert("Task name cannot exceed 45 characters");
              }
            }
          }
        }

        // Save XML after changes
        event.preventDefault();
        const { xml } = modeler.saveXML({ format: true });
        setXml(xml);
      });
      modeler.on("element.contextmenu", (e) => {
        clearContent();
        if (e.element.id !== "Process_1") {
          e.preventDefault();
          e.gfx.classList.add(e.element.id);
          selectedShapeId.current = e.element.id;
          const id = e.element.id;
          const div = document.createElement("div");
          const shapes = document.querySelectorAll("." + id);
          let isEnableShape = true;
          Array.from(shapes).forEach((parent) => {
            parent.childNodes.forEach((child) => {
              if (child.dataset.clip === id) {
                isEnableShape = false;
              }
            });
          });
          div.innerHTML = `<div class="context-menu" style="box-shadow: .3em .3em .5em gray;left: ${
            e.originalEvent.x
          }px; top: ${e.originalEvent.y}px;">
                            <ul>
                                ${
                                  isEnableShape
                                    ? '<li class="add-clip">Add Pin</li>'
                                    : ""
                                }
                                <li class="add-role">Add Role</li>
                            </ul>
                        </div>`;
          document.body.appendChild(div);

          // Add event listener to close modal when clicking outside
          const handleClickOutsideModal = (event) => {
            const contextMenu = div.querySelector(".context-menu");
            if (contextMenu && !contextMenu.contains(event.target)) {
              div.remove();
              document.removeEventListener(
                "mousedown",
                handleClickOutsideModal
              );
            }
          };
          // Use mousedown to catch before focus changes
          document.addEventListener("mousedown", handleClickOutsideModal);

          document.querySelector(".add-role").addEventListener("click", () => {
            openRoleModal();
            clearContent();
          });
          const pins = document.querySelectorAll(".add-clip");
          Array.from(pins).forEach((node) => {
            node.addEventListener("click", async (evt) => {
              const dtls = {};
              dtls[e?.element?.id] = [];
              setShapeDetails(dtls);
              selectedElementRef.current[e?.element?.id] = [];
              clearContent();
              const newpathg = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
              );
              newpathg.setAttributeNS(null, "data-clip", e.element.id);
              newpathg.setAttributeNS(
                null,
                "transform",
                `matrix(1 0 0 1 ${e.element.width - 5} -15)`
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
              newpath.setAttributeNS(null, "x", "500");
              newpath.setAttributeNS(null, "y", "500");
              newpath.setAttributeNS(null, "transform", `scale(0.05)`);
              newpath.addEventListener("click", (ee) => {
                createClipDetailsContaint(null, e.element.id, ee.x, ee.y);
              });
              newpathg.appendChild(newpath);
              document.querySelector("." + e.element.id).appendChild(newpathg);
            });
          });
        }
      });
      // console.log(SOPData?.SOPXMLElement, "SOPXMLElementSOPXMLElementssss");
      await modeler.importXML(SOPData?.SOPXMLElement || initialBpmnXml);
      await modeler.get("canvas").zoom("fit-viewport", "auto");

      setXml(SOPData?.SOPXMLElement ? SOPData.SOPXMLElement : initialBpmnXml);
      // console.log(SOPData, "checkingss");

      const shapeWithLink = {};

      // console.log(SOPData, "testclip");

      if (SOPData?.SopDetails?.length) {
        const existingShapeIds = [];
        const groupNode = document.querySelectorAll("g");
        Array.from(groupNode).forEach((node) => {
          SOPData?.SopDetails?.forEach((shape) => {
            if (node.dataset.elementId === shape?.SopShapeID) {
              existingShapeIds.push(shape?.SopShapeID);
              node.classList.add(node.dataset.elementId);

              if (shape?.FooterProperties?.roles?.length) {
                addRolePinsToDiagram(
                  shape.SopShapeID,
                  shape.FooterProperties.roles
                );
              }

              if (shape.AttachmentIcon) {
                const newpathg = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "g"
                );
                newpathg.setAttributeNS(
                  null,
                  "data-clip",
                  node.dataset.elementId
                );
                newpathg.setAttributeNS(
                  null,
                  "transform",
                  `matrix(1 0 0 1 ${node.getBBox().width - 15} -15)`
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
                newpath.setAttributeNS(null, "x", "500");
                newpath.setAttributeNS(null, "y", "500");
                newpath.setAttributeNS(null, "transform", `scale(0.05)`);
                newpath.addEventListener("click", (ee) => {
                  createClipDetailsContaint(
                    shape?.SopAttachmentLinks,
                    node.dataset.elementId,
                    ee.x,
                    ee.y
                  );
                });
                newpathg.appendChild(newpath);
                node.appendChild(newpathg);
              }
            }
          });
        });
        for (const el of SOPData?.SopDetails ?? []) {
          const links = [];
          if (
            existingShapeIds.some(
              (existingShapeId) => existingShapeId === el.SopShapeID
            )
          ) {
            for (const e of el.SopAttachmentLinks) {
              links.push({
                SopShapeID: el.SopShapeID,
                ContentLinkTitle: e.ContentLinkTitle,
                ContentLink: e.ContentLink,
                ContentLinkType: e.ContentLinkType,
              });
            }
            shapeWithLink[el.SopShapeID] = links;
          }
        }
        selectedElementRef.current = shapeWithLink;
      }
      return () => {
        modeler.destroy();
      };
    } catch (error) {
      // console.error(error)
    }
  };

  const clearContent = () => {
    const cmc = document.querySelectorAll(".context-menu");
    Array.from(cmc).forEach((el) => {
      el.remove();
    });
  };

  useEffect(() => {
    if (
      isRoleModalOpen &&
      selectedShapeId.current &&
      SOPData?.SopDetails?.length
    ) {
      const nodeDetails = SOPData.SopDetails.find(
        (d) => d.SopShapeID === selectedShapeId.current
      );
      // console.log(nodeDetails.FooterProperties?.roles, "nodeDetails");
      if (nodeDetails && nodeDetails.FooterProperties?.roles) {
        setSelectedRoles(nodeDetails.FooterProperties.roles);
      } else {
        setSelectedRoles([]);
      }
    }
  }, [isRoleModalOpen]);

  const createClipDetailsContaint = async (shapeLinks, id, x, y) => {
    let respData = selectedElementRef.current;
    if (!Array.isArray(respData[id])) {
      respData[id] = [];
      if (shapeLinks?.length > 0) {
        respData[id] = shapeLinks;
      }
    }
    setSelectedElement([]);
    for (const el of respData[id]) {
      el["IsSelect"] = true;
    }
    existingLinkedElement.current = respData[id];
    selectedShapeId.current = id;
    clearContent();
    let Temlet = "";

    for (const element of respData[id]) {
      // Check if the link type is 'video'
      if (element?.ContentLinkType === "sop") {
        Temlet += `
                    <div class="divider"></div>
                    <div class="content-item">
                        <img src ="${SopsfileIcon}" alt="Video Icon"/>
                        <span class="item-text">${
                          element?.ContentLinkTitle
                        }</span>
                        <div>
                          <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                                onclick="window.open('/sops/view/${encodeURIComponent(
                                  element?.ContentLink
                                )}', '_blank');" />
                      </div>
                    </div>`;
      } else if (element?.ContentLinkType === "link") {
        // Handle saved links with an eye icon to view them
        Temlet += `
            <div class="divider"></div>
            <div class="content-item">
                  <img src="${LinkIcon}" alt="Link Icon" style="width: 20px; height: 20px;"/>
                <span class="item-text">${element?.ContentLinkTitle}</span>
                <div>
                  <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                        onclick="window.open('${encodeURIComponent(
                          element?.ContentLink
                        )}', '_blank');" />
                </div>
            </div>`;
      } else if (element?.ContentLinkType === "doc") {
        // For Document, open /documents/view
        Temlet += `
                    <div class="divider"></div>
                    <div class="content-item">
                        <img src ="${BookOpen}" alt="File Icon"/>
                        <span class="item-text">${
                          element?.ContentLinkTitle
                        }</span>
                        <div>
                            <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px;"
                                onclick="window.open('/documents/view?docId=${encodeURIComponent(
                                  element?.ContentLink
                                )}', '_blank');" />
                        </div>
                    </div>`;
      } else if (element?.ContentLinkType === "trs") {
        // For Training Simulations, open /training-simulations/view
        Temlet += `
                    <div class="divider"></div>
                    <div class="content-item">
                        <img src ="${VideoIcon}" alt="Training Simulation Icon"/>
                        <span class="item-text">${
                          element?.ContentLinkTitle
                        }</span>
                        <div>
                            <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                                onclick="window.open('/training-simulations/view?trsId=${encodeURIComponent(
                                  element?.ContentLink
                                )}', '_blank');" />
                        </div>
                    </div>`;
      } else if (element?.ContentLinkType === "tes") {
        // For Test Simulations, open /test-simulations/view
        Temlet += `
                    <div class="divider"></div>
                    <div class="content-item">
                        <img src ="${MonitorIcon}" alt="Test Simulation Icon"/>
                        <span class="item-text">${
                          element?.ContentLinkTitle
                        }</span>
                        <div>
                            <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                                onclick="window.open('/test-simulations/view?tesId=${encodeURIComponent(
                                  element?.ContentLink
                                )}', '_blank');" />
                        </div>
                    </div>`;
      } else if (element?.ContentLinkType === "mcq") {
        // For MCQs, open /test/mcqs
        Temlet += `
                    <div class="divider"></div>
                    <div class="content-item">
                        <img src ="${EditIcon}" alt="MCQ Icon"/>
                        <span class="item-text">${
                          element?.ContentLinkTitle
                        }</span>
                        <div>
                            <img src="${viewIcon}" alt="View Icon" style="width: 32px; height: 32px; cursor: pointer;"
                                onclick="window.open('/test/mcqs?mcqId=${encodeURIComponent(
                                  element?.ContentLink
                                )}', '_blank');" />
                        </div>
                    </div>`;
      }
    }

    if (!respData[id].length) {
      Temlet += `
                <div class="divider"></div>
                <div class="content-item">
                  <span class="item-text" style="text-align:center;">No Content Available</span>
                </div>`;
    }
    const div = document.createElement("div");
    div.innerHTML = `
              <div class="context-menu" style="width: 350px; box-shadow: .3em .3em .3em gray; left: ${x}px; top: ${y}px;">
                <div class="dd-content">
                  <div class="headerpopup">
                    <div class="icon-container"></div>
                    <div class="header-text">
                      <h3>Content</h3>
                    
                    </div>
                    <div class="close-button" style="position: absolute; top: 10px; right: 10px; cursor: pointer;">
                      <img src="${closeIcon}" alt="Close Icon" style="width: 24px; height: 24px;" onclick="document.querySelector('.context-menu')?.remove();" />
                    </div>
                  </div>
                    ${Temlet}
                    <div class="divider"></div>
                    <div class="buttons">
                      <button class="delete-btn">Delete Pins</button>
                      <button class="manage-btn" >Manage</button>
                  </div>
                </div>
              </div>`;

    const iconContainer = div.querySelector(".icon-container");
    const img = document.createElement("img");
    img.src = headingicons;
    img.alt = "Heading Icon";
    img.style.width = "200px";
    iconContainer.appendChild(img);
    document.body.appendChild(div);

    // Add event listener to close modal when clicking outside
    const handleClickOutsideModal = (event) => {
      const contextMenu = div.querySelector(".context-menu");
      if (contextMenu && !contextMenu.contains(event.target)) {
        div.remove();
        document.removeEventListener("mousedown", handleClickOutsideModal);
      }
    };
    // Use mousedown to catch before focus changes
    document.addEventListener("mousedown", handleClickOutsideModal);

    document.querySelectorAll(".manage-btn").forEach((node) => {
      node.addEventListener("click", () => {
        const cmc = document.querySelectorAll(".context-menu");
        Array.from(cmc).forEach((el) => {
          el.remove();
        });
        openPopup();
      });
    });

    document.querySelectorAll(".delete-btn").forEach((node) => {
      node.addEventListener("click", () => {
        // console.log("first delete", selectedShapeId.current);s
        const shapes = document.querySelectorAll("." + selectedShapeId.current);
        Array.from(shapes).forEach((parent) => {
          parent.childNodes.forEach((child) => {
            if (child.dataset.clip == selectedShapeId.current) {
              child.remove();
              const cmc = document.querySelectorAll(".context-menu");
              Array.from(cmc).forEach((el) => {
                el.remove();
              });
              delete selectedElementRef.current[selectedShapeId.current];
            }
          });
        });
      });
    });
  };
  function openPopup() {
    setElementList(existingLinkedElement.current);
    setSelectedElement(existingLinkedElement.current);
    let dtls = {};
    if (!Array.isArray(shapeDetails[selectedShapeId.current])) {
      shapeDetails[selectedShapeId.current] = [];
    }
    dtls[selectedShapeId.current] = [
      ...existingLinkedElement.current,
      ...shapeDetails[selectedShapeId.current],
    ];
    setShapeDetails(dtls);
    // console.log(shapeDetails);
    setSearchString("");
    document.getElementById("popup").style.display = "flex";
  }
  function closePopup() {
    document.getElementById("popup").style.display = "none";
  }
  async function handleSearch(search) {
    setSearchString(search);
    const data = await getSearchElementList(search);
    data.data.map(
      (el) =>
        (el["IsSelect"] = shapeDetails[selectedShapeId.current]?.some(
          (x) => x.ContentLink === el.ContentLink
        )
          ? true
          : false)
    );
    setElementList(data.data);
  }
  function handleSelectedElement(event, element) {
    if (event.target.checked) {
      element.IsSelect = true;
      setSelectedElement([...selectedelement, element]);
    } else {
      element.IsSelect = false;
      setSelectedElement(
        selectedelement.filter((el) => el.ContentLink !== element?.ContentLink)
      );
    }
  }
  function handleCountClick() {
    setElementList(selectedelement);
  }
  async function handleUpdate() {
    const payload = [];
    // console.log(selectedelement, "selectedelement");
    for (const el of selectedelement) {
      if (!el.SopShapeID) {
        payload.push({
          SopShapeID: selectedShapeId.current,
          ContentLinkTitle: el.ContentLinkTitle,
          ContentLink: el.ContentLink,
          ContentLinkType: el.ContentLinkType || "link",
        });
      } else {
        payload.push(el);
      }
    }
    let dtls = {};
    // console.log(shapeDetails, payload);
    dtls[selectedShapeId.current] = [...payload];
    selectedElementRef.current[selectedShapeId.current] = [...payload];
    // console.log(dtls);
    setShapeDetails(dtls);
    setSelectedElement([]);
    closePopup();
  }
  const handleSave = (newLink) => {
    // Save the new link to the selectedElementRef for the current selected shape
    if (selectedShapeId.current) {
      const currentLinks =
        selectedElementRef.current[selectedShapeId.current] || [];
      selectedElementRef.current[selectedShapeId.current] = [
        ...currentLinks,
        {
          SopShapeID: selectedShapeId.current,
          ContentLinkTitle: newLink.name,
          ContentLink: newLink.url,
          ContentLinkType: "link", // Add a new type for regular links
        },
      ];
    }

    // Update the links state to keep track of all saved links
    setLinks([...links, newLink]);
    togglePopup(); // Close the popup after saving the link
  };

  return (
    <>
      {!SOPData?.SopDetails ? (
        <Backdrop
          sx={(theme) => ({
            color: "#fff",
            zIndex: theme.zIndex.drawer + 1,
          })}
          open={!SOPData?.SopDetails}
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
      ) : (
        <div>
          <div ref={canvasRef} style={{ width: "1400px", height: "70vh" }} />
          {showRoleTooltip && (
            <div
              ref={roleTooltipRef}
              className="role-tooltip"
              style={{
                position: "absolute",
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                zIndex: 1000,
                marginTop: "-30rem",
                marginLeft: "25rem",
              }}
            >
              <h3>Selected Roles</h3>
              <ul>
                {hoveredRoles.map((role, index) => (
                  <li key={index}>{role}</li>
                ))}
              </ul>
            </div>
          )}
          {isRoleModalOpen && (
            <div
              className="sidebar"
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "300px",
                height: "100%",
                backgroundColor: "#fff",
                boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  width: "500px",
                  textAlign: "center",
                  height: "400px",
                  position: "relative",
                }}
              >
                {/* Cancel Icon */}
                <div
                  onClick={closeRoleModal}
                  style={{
                    position: "absolute",
                    top: "60px",
                    left: "-50px",
                    cursor: "pointer",
                    fontSize: "24px",
                  }}
                >
                  &times;
                </div>

                {/* Modal Heading */}
                <h3
                  style={{
                    marginBottom: "10px",
                    marginTop: "3rem",
                    marginLeft: "-25rem",
                  }}
                >
                  All Roles
                </h3>

                {/* Divider */}
                <div
                  className="divider"
                  style={{
                    borderBottom: "1px solid #d1d1d1",
                    marginBottom: "20px",
                  }}
                ></div>

                {/* Content */}
                <div style={{ maxHeight: "470px", overflowY: "auto" }}>
                  {roles.length === 0 ? (
                    <p>No RoleName is available</p>
                  ) : (
                    roles.map((role) => (
                      <div
                        key={role.RoleID}
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(role.RoleID)}
                          onChange={() => handleRoleSelect(role.RoleID)}
                          style={{
                            marginRight: "10px",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        <span>{role.RoleName}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Save Button */}
                <Box saveXML style={{ width: "230px" }}>
                  <Button variant="contained" onClick={handleSaveRoles}>
                    Save
                  </Button>
                </Box>
              </div>
            </div>
          )}
          <div
            id="popup"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "none",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                width: "500px",
                maxHeight: "600px",
                padding: "24px",
                position: "relative",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    marginTop: "-25px",
                    marginLeft: "-10px",
                    marginRight: "5px",
                    display: "inline-block",
                  }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {t("manageLinks")}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#6B7280",
                      }}
                    >
                      {t("manageLinksDesc")}
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  height: "1px",
                  backgroundColor: "#E5E7EB",
                  margin: "0 -24px 20px -24px",
                }}
              ></div>

              <div style={{ position: "relative", marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <b
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      fontWeight: "600",
                    }}
                  >
                    {t("chooseLinks")}
                  </b>
                  <button
                    onClick={handleCountClick}
                    style={{
                      background: bgColor,
                      color: "#ffffff",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px 16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                      outline: "none",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-1px)";
                      e.target.style.boxShadow =
                        "0 4px 8px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    {selectedelement ? selectedelement?.length : 0}{" "}
                    {t("selected")}
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder={t("searchLinks")}
                    value={searchString}
                    onChange={(event) => handleSearch(event.target.value)}
                    style={{
                      width: "100%",
                      paddingLeft: "40px",
                      paddingRight: "12px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      borderRadius: "8px",
                      border: "2px solid #E5E7EB",
                      height: "44px",
                      boxSizing: "border-box",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                      backgroundColor: "#F9FAFB",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.backgroundColor = "#ffffff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E5E7EB";
                      e.target.style.backgroundColor = "#F9FAFB";
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9CA3AF",
                      fontSize: "16px",
                    }}
                  >
                    🔍
                  </span>
                </div>
              </div>

              <div
                style={{
                  overflowY: "auto",
                  maxHeight: "300px",
                  paddingRight: "8px",
                  marginRight: "-8px",
                }}
              >
                {elemetList?.map((element) => (
                  <div key={element.IdName + element.ContentLink}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 0",
                        borderRadius: "8px",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#F3F4F6";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <img
                        src={
                          element?.ContentLinkType === "sop"
                            ? SopsfileIcon
                            : element?.ContentLinkType === "doc"
                            ? BookOpen
                            : element?.ContentLinkType === "trs"
                            ? VideoIcon
                            : element?.ContentLinkType === "tes"
                            ? MonitorIcon
                            : element?.ContentLinkType === "mcq"
                            ? EditIcon
                            : element?.ContentLinkType === "link"
                            ? LinkIcon
                            : ""
                        }
                        alt="File Icon"
                        style={{
                          width:
                            element?.ContentLinkType === "link"
                              ? "20px"
                              : "32px",
                          height:
                            element?.ContentLinkType === "link"
                              ? "20px"
                              : "32px",
                          flexShrink: 0,
                        }}
                      />

                      <p
                        style={{
                          marginLeft: "12px",
                          margin: 0,
                          fontSize: "14px",
                          color: "#374151",
                          flex: 1,
                          fontWeight: "500",
                        }}
                      >
                        {element?.ContentLinkTitle}
                      </p>

                      <input
                        type="checkbox"
                        checked={element?.IsSelect}
                        onChange={(e) => {
                          handleSelectedElement(e, element);
                        }}
                        style={{
                          marginLeft: "auto",
                          height: "20px",
                          width: "20px",
                          cursor: "pointer",
                          accentColor: "#667eea",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        height: "1px",
                        backgroundColor: "#F3F4F6",
                        margin: "0",
                      }}
                    ></div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={closePopup}
                  style={{
                    backgroundColor: "#F3F4F6",
                    color: "#374151",
                    border: "2px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    outline: "none",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#E5E7EB";
                    e.target.style.borderColor = "#D1D5DB";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#F3F4F6";
                    e.target.style.borderColor = "#E5E7EB";
                  }}
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleUpdate}
                  style={{
                    background: bgColor,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    outline: "none",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  {t("update")}
                </button>
              </div>
            </div>
          </div>

          <LinkPopUp
            isOpen={isPopupOpen}
            onClose={togglePopup}
            onSave={handleSave}
          />
        </div>
      )}
    </>
  );
}

BPMNEdit.propTypes = {
  SOPData: PropTypes.shape({
    SopDetails: PropTypes.arrayOf(
      PropTypes.shape({
        SopShapeID: PropTypes.string,
        FooterProperties: PropTypes.shape({
          roles: PropTypes.arrayOf(PropTypes.string),
        }),
        AttachmentIcon: PropTypes.bool,
        SopAttachmentLinks: PropTypes.arrayOf(
          PropTypes.shape({
            ContentLinkTitle: PropTypes.string,
            ContentLink: PropTypes.string,
            ContentLinkType: PropTypes.string,
          })
        ),
      })
    ),
    SOPXMLElement: PropTypes.string,
  }),
  setXml: PropTypes.func,
  shapeDetails: PropTypes.object,
  setShapeDetails: PropTypes.func,
  selectedelement: PropTypes.array,
  setSelectedElement: PropTypes.func,
  selectedElementRef: PropTypes.object,
  modelerRef: PropTypes.object,
  setSOPData: PropTypes.func,
  onRolesData: PropTypes.func,
};
