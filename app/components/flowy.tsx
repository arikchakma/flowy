import '@xyflow/react/dist/style.css';
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  type NodeTypes,
  type XYPosition,
} from '@xyflow/react';

import { StartNode } from './nodes/start';
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
import { useCallback, useRef, type DragEvent } from 'react';
import { nanoid } from 'nanoid';
import type { AppNode, NodeType } from '~/types/nodes';

function newId() {
  const isDev = import.meta.env.DEV;
  if (isDev) {
    const nodes = useEditorStore.getState().nodes;
    const sorted = nodes.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    const lastId = parseInt(sorted[sorted.length - 1]?.id);
    if (!lastId) {
      return '1';
    }

    return (lastId + 1).toString();
  }

  return nanoid();
}

function createNode(type: NodeType, position: XYPosition) {
  const id = newId();
  switch (type) {
    case 'start':
      return {
        id,
        data: {},
        position,
        type,
      };
    case 'request':
      return {
        id,
        data: {
          method: 'GET' as const,
          url: 'https://arikko.dev',
          headers: {},
          body: {},
        },
        position,
        type,
      };
    case 'log':
      return {
        id,
        data: {},
        position,
        type,
      };
    case 'select':
      return {
        id,
        data: {
          path: '',
        },
        position,
        type,
      };
    case 'repeat':
      return {
        id,
        data: {
          repeat: 'indefinite' as const,
        },
        position,
        type,
      };
    case 'string':
      return {
        id,
        data: {
          value: '',
        },
        position,
        type,
      };
    case 'number':
      return {
        id,
        data: {
          value: 0,
        },
        position,
        type,
      };
    case 'boolean':
      return {
        id,
        data: {
          value: false,
        },
        position,
        type,
      };
    case 'delay':
      return {
        id,
        data: {
          duration: 1000,
        },
        position,
        type,
      };
    case 'record':
      return {
        id,
        data: {
          values: [],
        },
        position,
        type,
      };
    case 'variable':
      return {
        id,
        data: {
          name: '',
        },
        position,
        type,
      };
    default:
      return null;
  }
}

const nodeTypes = {
  start: StartNode,
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
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    reactFlow,
    setReactFlow,
    setNodes,
  } = useEditorStore();

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlow?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (!position) {
        return;
      }

      const newNode = createNode(type as NodeType, position);
      if (!newNode) {
        return;
      }

      const newNodes: AppNode[] = [...nodes, newNode];
      setNodes(newNodes);
    },
    [reactFlow, nodes, setNodes]
  );
  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  console.log({ nodes, edges });

  return (
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
      onInit={setReactFlow}
      onDragOver={onDragOver}
      onDrop={onDrop}
      ref={reactFlowWrapper}
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <BubbleMenu />
      <ViewportLogger />
    </ReactFlow>
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
