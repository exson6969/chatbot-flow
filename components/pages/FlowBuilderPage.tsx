'use client';

import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Connection,
  Edge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import toast from 'react-hot-toast';
import NodesPanel from '@/components/NodesPanel';
import SettingsPanel from '@/components/SettingsPanel';
import TextNode from '@/components/TextNode';
import FlowGenerator from '@/components/FlowGenerator';

const nodeTypes = {
  textNode: TextNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'textNode',
    data: { label: 'Test message 1' },
    position: { x: 250, y: 5 },
  },
];

// Define default options for all edges. This is where we will add the arrowhead.
const defaultEdgeOptions = {
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
  }
};

const FlowBuilder = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceHandleHasEdge = edges.some(
        (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
      );
      if (!sourceHandleHasEdge) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        toast.error('Source handle can only have one outgoing edge.');
      }
    },
    [edges, setEdges]
  );

  const onNodeClick = (_: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (reactFlowWrapper.current) {
        const type = event.dataTransfer.getData('application/reactflow');
        const position = (window as any).reactFlowInstance.project({
          x: event.clientX,
          y: event.clientY - reactFlowWrapper.current.getBoundingClientRect().top,
        });
        const newNode = {
          id: `node_${+new Date()}`,
          type,
          position,
          data: { label: `${type.replace('Node', ' Node')}` },
        };
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [setNodes]
  );

  const onSave = () => {
    if (nodes.length > 1) {
      const targetNodeIds = new Set(edges.map((edge) => edge.target));
      const nodesWithEmptyTargets = nodes.filter(
        (node) => !targetNodeIds.has(node.id)
      );
      if (nodesWithEmptyTargets.length > 1) {
        toast.error('Cannot save flow: More than one node has an empty target handle.');
      } else {
        console.log('Flow saved:', { nodes, edges });
        toast.success('Flow saved successfully!');
      }
    } else {
      console.log('Flow saved:', { nodes, edges });
      toast.success('Flow saved successfully!');
    }
  };

  const setGeneratedNodes = (newNodes: any[]) => {
    setNodes(newNodes);
    setTimeout(() => {
      const flowInstance = (window as any).reactFlowInstance;
      if (flowInstance) {
        flowInstance.fitView();
      }
    }, 100);
  };

  return (
    <div className="flex h-screen w-screen font-sans">
      <div className="flex-grow h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          onInit={(instance) => ((window as any).reactFlowInstance = instance)}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          defaultEdgeOptions={defaultEdgeOptions}
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>

      <div className="w-96 border-l border-gray-200 bg-gray-50 flex flex-col">
        <div className="flex-grow p-4 overflow-y-auto">
          <button
            onClick={onSave}
            className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-200 transition-colors duration-200 mb-6"
          >
            Save Flow
          </button>
          {selectedNode ? (
            // To edit exiting selected node.
            <SettingsPanel
              selectedNode={selectedNode}
              setNodes={setNodes}
              setSelectedNode={setSelectedNode}
            />
          ) : (
            // List of all nodes with icon and name in grid.
            <NodesPanel />
          )}
        </div>

        {/* This is the bottom section for the AI generator. */}
        <div className="p-4 ">
          <FlowGenerator setNodes={setGeneratedNodes} setEdges={setEdges} />
        </div>
      </div>
    </div>
  );
};

const FlowBuilderPage = () => (
  <ReactFlowProvider>
    <FlowBuilder />
  </ReactFlowProvider>
);

export default FlowBuilderPage;