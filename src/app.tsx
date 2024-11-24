import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import type { Edge, Node, OnConnect } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCallback } from 'react';
import { TriggerNode } from './components/nodes/trigger';
import { RequestNode } from './components/nodes/request';
import { LogNode } from './components/nodes/log';
import { BubbleMenu } from './components/bubble-menu';

const nodeTypes = {
  trigger: TriggerNode,
  request: RequestNode,
  log: LogNode,
};

const proOptions = { hideAttribution: true };

const connectionLineStyle = {
  stroke: 'var(--color-zinc-900)',
  strokeWidth: 2.5,
  opacity: 0.5,
};

const defaultEdgeOptions = {
  style: {
    stroke: 'var(--color-zinc-900)',
    strokeWidth: 2.5,
  },
};

const initialNodes: Node[] = [
  {
    id: '3',
    type: 'trigger',
    position: { x: 0, y: 200 },
    data: { label: '3' },
  },
  {
    id: '4',
    type: 'request',
    position: { x: 190, y: 110 },
    data: { label: '4' },
  },
  {
    id: '5',
    type: 'log',
    position: { x: 500, y: 200 },
    data: { label: '5' },
  },
  {
    id: '6',
    type: 'log',
    position: { x: 500, y: 240 },
    data: { label: '5' },
  },
];
const initialEdges: Edge[] = [
  { id: '3-4', source: '3', target: '4' },
  { id: '4-5', source: '4', target: '5', sourceHandle: 'w2' },
  { id: '4-6', source: '4', target: '6', sourceHandle: 'x2' },
];

export function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        // Zoom and pan settings
        zoomOnScroll={false}
        panActivationKeyCode="Space"
        panOnScroll={true}
        panOnDrag={false}
        // Connection line style
        connectionLineStyle={connectionLineStyle}
        defaultEdgeOptions={defaultEdgeOptions}
        // Background settings
        fitView={true}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <BubbleMenu />
      </ReactFlow>
    </div>
  );
}
