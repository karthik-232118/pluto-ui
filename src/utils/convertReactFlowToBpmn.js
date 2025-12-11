// utils/convertReactFlowToBpmn.js

/**
 * Convert React Flow nodes/edges into minimal BPMN XML.
 * - The example uses <bpmn:task> for every node.
 * - The example uses a naive approach for edge waypoints (just source center to target center).
 * - Adjust or expand as needed for your scenario.
 */
export function reactFlowToBpmnXML(nodes, edges) {
    // Create BPMN <bpmn:task> for each node
    const bpmnTasks = nodes
      .map((node) => {
        const taskId = node.id;
        const taskName = node.data?.label || node.id;
        return `<bpmn:task id="${taskId}" name="${escapeXml(taskName)}" />`;
      })
      .join("\n");
  
    // Create <bpmn:sequenceFlow> for each edge
    const bpmnFlows = edges
      .map((edge) => {
        const flowId = edge.id;
        const sourceRef = edge.source;
        const targetRef = edge.target;
        return `<bpmn:sequenceFlow id="${flowId}" sourceRef="${sourceRef}" targetRef="${targetRef}" />`;
      })
      .join("\n");
  
    // For BPMN Diagram Interchange data
    // We'll default the shape size to width=100, height=80 for every node
    const bpmnShapes = nodes
      .map((node) => {
        const shapeId = node.id;
        const x = node.position?.x ?? 0;
        const y = node.position?.y ?? 0;
        return `
          <bpmndi:BPMNShape bpmnElement="${shapeId}" id="BPMNShape_${shapeId}">
            <dc:Bounds x="${x}" y="${y}" width="100" height="80" />
          </bpmndi:BPMNShape>
        `;
      })
      .join("\n");
  
    // For BPMN Edges, we need simple waypoints. We'll assume the center of each node:
    const bpmnEdges = edges
      .map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        // Fallback if node not found
        if (!sourceNode || !targetNode) return "";
  
        // Example: center of 100x80 (x+50, y+40)
        const x1 = (sourceNode.position?.x ?? 0) + 50;
        const y1 = (sourceNode.position?.y ?? 0) + 40;
        const x2 = (targetNode.position?.x ?? 0) + 50;
        const y2 = (targetNode.position?.y ?? 0) + 40;
  
        return `
          <bpmndi:BPMNEdge bpmnElement="${edge.id}" id="BPMNEdge_${edge.id}">
            <di:waypoint x="${x1}" y="${y1}" />
            <di:waypoint x="${x2}" y="${y2}" />
          </bpmndi:BPMNEdge>
        `;
      })
      .join("\n");
  
    // Combine everything into valid BPMN XML
    // (Ensure namespaces are correct, e.g. bpmn, bpmndi, dc, di)
    const bpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
      xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
      xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
      xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
      typeLanguage="http://www.w3.org/2001/XMLSchema"
      targetNamespace="http://bpmn.io/schema/bpmn"
      id="Definitions_1">
  
    <bpmn:process id="Process_1" isExecutable="false">
      ${bpmnTasks}
      ${bpmnFlows}
    </bpmn:process>
  
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
        ${bpmnShapes}
        ${bpmnEdges}
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  
  </bpmn:definitions>`;
    return bpmnXml;
  }
  
  /**
   * Basic XML escaping for node labels (if needed).
   * Or use a more robust approach if your labels can contain special characters.
   */
  function escapeXml(str) {
    return String(str).replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case '"':
          return "&quot;";
        case "'":
          return "&apos;";
        default:
          return c;
      }
    });
  }
  