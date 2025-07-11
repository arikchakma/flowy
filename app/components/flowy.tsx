import '@xyflow/react/dist/style.css';
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  type NodeTypes,
} from '@xyflow/react';

import { TriggerNode } from './nodes/trigger';
import { RequestNode } from './nodes/request';
import { LogNode } from './nodes/log';
import { BubbleMenu } from './bubble-menu';
import { useEditorStore } from '~/stores/editor-store';
import { SelectNode } from './nodes/select';
import { ViewportLogger } from './loggers/viewport-logger';
import { RepeatNode } from './nodes/repeat';
import { StringNode } from './nodes/string';
import { NumberNode } from './nodes/number';
import { BooleanNode } from './nodes/boolean';
import { DelayNode } from './nodes/delay';
import { RecordNode } from './nodes/record';
import { VariableNode } from './nodes/variable';
import { WorkflowEngineProvider } from '~/lib/workflow-engine-provider';
import { workflowEngine } from '~/lib/workflow-engine';

const nodeTypes = {
  trigger: TriggerNode,
  request: RequestNode,
  log: LogNode,
  select: SelectNode,
  repeat: RepeatNode,
  string: StringNode,
  number: NumberNode,
  boolean: BooleanNode,
  delay: DelayNode,
  record: RecordNode,
  variable: VariableNode,
};

const edgeTypes = {};

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

function _Flowy() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useEditorStore((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
    }));

  console.log({ nodes, edges });

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes as NodeTypes}
        edgeTypes={edgeTypes}
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
        <ViewportLogger />
      </ReactFlow>
    </div>
  );
}

export function Flowy() {
  return (
    <WorkflowEngineProvider engine={workflowEngine}>
      <ReactFlowProvider>
        <_Flowy />
      </ReactFlowProvider>
    </WorkflowEngineProvider>
  );
}
