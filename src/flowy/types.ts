import { Edge, OnConnect, OnEdgesChange, OnNodesChange } from '@xyflow/react';
import type { LogNode } from './components/nodes/log';
import type { RequestNode } from './components/nodes/request';
import type { TriggerNode } from './components/nodes/trigger';
import { SelectNode } from './components/nodes/select';

export type AppNode = RequestNode | LogNode | TriggerNode | SelectNode;

export type AppState = {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
};
