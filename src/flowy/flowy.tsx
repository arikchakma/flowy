import '@xyflow/react/dist/style.css';
import { Background, BackgroundVariant, ReactFlow } from '@xyflow/react';

import { TriggerNode } from './components/nodes/trigger';
import { RequestNode } from './components/nodes/request';
import { LogNode } from './components/nodes/log';
import { BubbleMenu } from './components/bubble-menu';
import { useFlowyStore } from './stores/flowy-store';
import { SelectNode } from './components/nodes/select';

const nodeTypes = {
  trigger: TriggerNode,
  request: RequestNode,
  log: LogNode,
  select: SelectNode,
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

export function Flowy() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useFlowyStore((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
    }));

  return (
    <div className="h-screen w-screen">
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
