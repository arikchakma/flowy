import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type ReactFlowInstance,
} from '@xyflow/react';
import {
  initialEdges,
  initialNodes,
  REQUEST_STROKE_STYLE,
} from '../utils/contants';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import type { AppNode } from '~/types/nodes';
import { HandleId } from '~/types/handle-id';

export type EditorState = {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  reactFlow: ReactFlowInstance<AppNode, Edge> | null;
  setReactFlow: (reactFlow: ReactFlowInstance<AppNode, Edge>) => void;
};

export const useEditorStore = createWithEqualityFn<EditorState>(
  (set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    reactFlow: null,
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      // if we are connecting from a Request source to other target
      // update the stroke color of the edge to var(--color-pink-700)
      if (
        (connection.sourceHandle === HandleId.RequestFailureSource ||
          connection.sourceHandle === HandleId.RequestSuccessSource) &&
        'style' in connection
      ) {
        connection.style = {
          ...(connection?.style ?? {}),
          ...REQUEST_STROKE_STYLE,
        };
      }

      set({
        edges: addEdge(connection, get().edges),
      });
    },
    setNodes: (nodes) => {
      set({ nodes });
    },
    setEdges: (edges) => {
      set({ edges });
    },
    setReactFlow: (reactFlow) => {
      set({ reactFlow });
    },
  }),
  shallow
);
