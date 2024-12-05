import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import {
  initialEdges,
  initialNodes,
  REQUEST_STROKE_STYLE,
} from '../utils/contants';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { AppNode, HandleId } from '@flowy/shared';

export type EditorState = {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
};

export const useEditorStore = createWithEqualityFn<EditorState>(
  (set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
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
  }),
  shallow
);
