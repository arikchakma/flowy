import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { HandleId } from '~/lib/handles';
import {
  initialEdges,
  initialNodes,
  REQUEST_STROKE_STYLE,
} from '~/lib/contants';

export type EditorState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
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
