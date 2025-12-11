import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";

const FlowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [text, setText] = useState("");

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  useEffect(() => {
    updateFlowDiagram(text);
  }, [text]); 

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const updateFlowDiagram = (inputText) => {
    const lines = inputText.split("\n").filter((line) => line.trim() !== "");
    const updatedNodes = lines.map((line, index) => ({
      id: `node-${index}`,
      data: { label: line },
      position: { x: index * 150, y: 100 }, 
      type: "default",
    }));
    const updatedEdges = lines.slice(1).map((_, index) => ({
      id: `edge-${index}`,
      source: `node-${index}`,
      target: `node-${index + 1}`,
      animated: true,
    }));

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  return (
    <div style={{ display: "flex", height: "100vh", padding: "10px" }}>
   
      <div style={{ flex: 1, padding: "10px" }}>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Type here to generate a flow diagram..."
          style={{
            width: "100%",
            height: "100%",
            fontSize: "16px",
            padding: "10px",
          }}
        />
      </div>
      <div style={{ flex: 2, borderLeft: "2px solid #ddd", padding: "10px" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowEditor;
