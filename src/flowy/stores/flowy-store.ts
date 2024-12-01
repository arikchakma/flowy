import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { useEditorStore } from './editor-store';
import { AppNode, HandleId } from '../types';
import { getProperty } from 'dot-prop';
import { SelectNode } from '../components/nodes/select';
import { RequestNode } from '../components/nodes/request';
import { LogNode } from '../components/nodes/log';
import { runPromisesInBatchSequentially } from '../utils/promise';

type FlowyStatus = 'idle' | 'running' | 'paused' | 'finished';

type ConnectionType = {
  edgeId: string;
  sourceId: string;
  targetId: string;
  sourceHandle: string;
  targetHandle: string;
};

type StepResult = {
  status: FlowyStatus;
  data?: unknown;
  error?: unknown;
};

export type FlowyState = {
  status: FlowyStatus;

  start: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  reset: () => void;

  results: Map<string, StepResult>;
  setResult: (nodeId: string, result: Partial<StepResult>) => void;

  connections: Map<string, ConnectionType[]>;
  handleNode: (node: AppNode) => Promise<void>;
  handleLogNode: (node: LogNode) => Promise<void>;
  handleRequestNode: (node: RequestNode) => Promise<void>;
  handleSelectNode: (node: SelectNode) => Promise<void>;

  handleConnections: (connections: ConnectionType[]) => Promise<void>;
  getHandleConnections: (
    nodeId: string,
    type: 'source' | 'target',
    handleId: string
  ) => ConnectionType[];
};

export const useFlowyStore = createWithEqualityFn<FlowyState>(
  (set, get) => ({
    status: 'idle',
    connections: new Map(),

    results: new Map(),
    setResult: (nodeId, result) => {
      set((state) => {
        const results = new Map(state.results);
        const prevResult = results.get(nodeId);
        results.set(nodeId, {
          status: 'idle',
          ...prevResult,
          ...result,
        });
        return { results };
      });
    },

    start: async () => {
      set({ status: 'running', results: new Map(), connections: new Map() });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nodes = useEditorStore.getState().nodes;

      const triggerNode = nodes.find((node) => node.type === 'trigger');
      if (!triggerNode) {
        return;
      }

      // get the connected nodes to the trigger node
      const connections = get().getHandleConnections(
        triggerNode.id,
        'source',
        HandleId.TriggerSource
      );

      await get().handleConnections(connections);
      set({ status: 'finished' });
    },

    handleNode: async (node: AppNode) => {
      switch (node.type) {
        case 'log':
          await get().handleLogNode(node);
          break;
        case 'request':
          await get().handleRequestNode(node);
          break;
        case 'select':
          await get().handleSelectNode(node);
          break;
        default:
          console.error(`Unhandled node type: ${node.type}`);
          break;
      }
    },

    handleConnections: async (connections: ConnectionType[]) => {
      const nodes = useEditorStore.getState().nodes;

      const promises: (() => Promise<void>)[] = [];
      for (const connection of connections) {
        const { targetId } = connection;
        const currNode = nodes.find((node) => node.id === targetId);
        if (!currNode) {
          continue;
        }

        promises.push(() => get().handleNode(currNode));
      }

      await runPromisesInBatchSequentially(promises, 5);
    },

    pause: () => {
      set({ status: 'paused' });
    },
    resume: () => {
      set({ status: 'running' });
    },
    reset: () => {
      set({ status: 'idle', results: new Map() });
    },

    getHandleConnections: (nodeId, type, handleId) => {
      const key = `${nodeId}-${type}-${handleId}`;
      const connections = get().connections;
      const hasConnections = connections.has(key);
      if (hasConnections) {
        return connections.get(key) || [];
      }

      const nodes = useEditorStore.getState().nodes;
      const edges = useEditorStore.getState().edges;

      const node = nodes.find((node) => node.id === nodeId);
      if (!node) {
        return [];
      }

      const nodeEdges = edges.filter((edge) => {
        return type === 'source'
          ? edge.source === nodeId && edge.sourceHandle === handleId
          : edge.target === nodeId && edge.targetHandle === handleId;
      });

      const nodeConnections = nodeEdges.map((edge) => {
        return {
          edgeId: edge.id,
          sourceId: edge.source,
          targetId: edge.target,

          // we can infer the handle ids because
          // we always have a source and target handle
          sourceHandle: edge.sourceHandle!,
          targetHandle: edge.targetHandle!,
        };
      });

      connections.set(key, nodeConnections);
      set({ connections });
      return nodeConnections;
    },

    handleLogNode: async (node) => {
      const results = get().results;
      get().setResult(node.id, { status: 'running' });

      await new Promise((resolve) => setTimeout(resolve, 3000));
      const parents = get().getHandleConnections(
        node.id,
        'target',
        HandleId.LogTarget
      );

      for (const parent of parents) {
        const { sourceId: parentId } = parent;
        const result = results.get(parentId);
        if (!result) {
          continue;
        }

        console.log(
          `Log result for node ${parentId}:`,
          JSON.stringify(result, null, 2)
        );

        get().setResult(node.id, {
          status: 'finished',
          data: result.data,
          error: result.error,
        });
      }
    },
    handleRequestNode: async (node) => {
      get().setResult(node.id, { status: 'running' });

      const successes = get().getHandleConnections(
        node.id,
        'source',
        HandleId.RequestSuccessSource
      );
      const failures = get().getHandleConnections(
        node.id,
        'source',
        HandleId.RequestFailureSource
      );

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const result = {
        data: { success: true, value: crypto.randomUUID() },
        error: undefined,
      };

      get().setResult(node.id, {
        status: 'finished',
        data: result.data,
        error: result.error,
      });

      if (result.data) {
        await get().handleConnections(successes);
      } else if (result.error) {
        await get().handleConnections(failures);
      }
    },

    handleSelectNode: async (node) => {
      const results = get().results;
      get().setResult(node.id, { status: 'running' });

      await new Promise((resolve) => setTimeout(resolve, 3000));
      const parents = get().getHandleConnections(
        node.id,
        'target',
        HandleId.SelectTarget
      );

      const children = get().getHandleConnections(
        node.id,
        'source',
        HandleId.SelectSource
      );

      const { path } = node.data;

      for (const parent of parents) {
        const { sourceId: parentId } = parent;
        const result = results.get(parentId);
        if (!result) {
          continue;
        }

        const pathResult = getProperty(result, path);

        get().setResult(node.id, {
          status: 'finished',
          data: pathResult,
          error: undefined,
        });

        await get().handleConnections(children);
      }
    },

    getNodesData: (nodeId: string | string[]) => {
      const nodes = useEditorStore.getState().nodes;
      const nodeIds = Array.isArray(nodeId) ? nodeId : [nodeId];
      return nodes.filter((node) => nodeIds.includes(node.id));
    },
  }),
  shallow
);
