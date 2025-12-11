
// function FundFlowGraph() {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     // 1. Define your data (nodes and edges)
//     const data = {
//       nodes: [
//         {
//           id: 'node1',
//           x: 50,
//           y: 80,
//           label: 'Name1\n538.90 Yuan\nV1 => -34.10%',
//           style: { fill: '#fff', stroke: '#5B8FF9' }
//         },
//         {
//           id: 'node2',
//           x: 250,
//           y: 150,
//           label: 'Deal with LONG label...\n338.00 Yuan\nV2 => -17.90%',
//           style: { fill: '#fff', stroke: '#5AD8A6' }
//         },
//         {
//           id: 'node3',
//           x: 500,
//           y: 50,
//           label: 'Name3\n138.00 Yuan\nV2 => -27.00%',
//           style: { fill: '#fff', stroke: '#5B8FF9' }
//         },
//         {
//           id: 'node5',
//           x: 500,
//           y: 150,
//           label: 'Name5\n100.00 Yuan\nV1 => 25.90%',
//           style: { fill: '#fff', stroke: '#5AD8A6' }
//         },
//         {
//           id: 'node8',
//           x: 500,
//           y: 250,
//           label: 'Name8\n100.00 Yuan\nV2 => -13.10%',
//           style: { fill: '#fff', stroke: '#5AD8A6' }
//         },
//         {
//           id: 'node9',
//           x: 250,
//           y: 300,
//           label: 'Name9\n100.90 Yuan\nV2 => -22.10%',
//           style: { fill: '#fff', stroke: '#5AD8A6' }
//         },
//         {
//           id: 'node10',
//           x: 500,
//           y: 350,
//           label: 'Name10\n33.90 Yuan\nV2 => -12.00%',
//           style: { fill: '#fff', stroke: '#5B8FF9' }
//         },
//         {
//           id: 'node11',
//           x: 500,
//           y: 450,
//           label: 'Name11\n67.00 Yuan\nV2 => -30.00%',
//           style: { fill: '#fff', stroke: '#5B8FF9' }
//         },
//         {
//           id: 'node12',
//           x: 250,
//           y: 400,
//           label: 'Name12\n100.00 Yuan\nV2 => 53.10%',
//           style: { fill: '#fff', stroke: '#5B8FF9' }
//         }
//       ],
//       edges: [
//         // Connect Name1 -> Deal with LONG label...
//         { source: 'node1', target: 'node2', label: '' },
//         // Connect Deal with LONG label... -> Name9
//         { source: 'node2', target: 'node9', label: '' },
//         // Connect Deal with LONG label... -> Name12
//         { source: 'node2', target: 'node12', label: '' },
//       ],
//     };

//     // 2. Configure your graph
//     const graph = new G6.Graph({
//       container: containerRef.current,  // mount the graph to this DOM element
//       width: 800,
//       height: 600,
//       defaultNode: {
//         type: 'rect',
//         size: [160, 60],
//         labelCfg: {
//           style: {
//             fontSize: 12,
//             fill: '#000',
//             fontWeight: 'bold'
//           }
//         },
//       },
//       defaultEdge: {
//         type: 'polyline', // or 'line', 'cubic', etc.
//         style: {
//           stroke: '#A3B1BF'
//         },
//         labelCfg: {
//           autoRotate: true,
//           style: {
//             fontSize: 10,
//             background: {
//               fill: '#ffffff',
//               stroke: '#9EC9FF',
//               radius: 2
//             }
//           }
//         }
//       },
//       modes: {
//         default: ['drag-canvas', 'zoom-canvas', 'drag-node']
//       }
//     });

//     // 3. Load data into the graph
//     graph.data(data);
//     // 4. Render
//     graph.render();

//     // Cleanup on unmount
//     return () => {
//       graph.destroy();
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       style={{ width: '800px', height: '600px', border: '1px solid #ccc' }}
//     />
//   );
// }

// export default FundFlowGraph;

// commnented unwated code 
import React from "react";

const FundFlowDiagram = () => {
  return <div>FundFlowDiagram</div>;
};

export default FundFlowDiagram;
