import { getProperty } from 'dot-prop';
import { Subscribable } from './subscribable';
import { FlowyError } from './flowy-error';
import type { AppNode } from '~/types/nodes';
import type { Edge } from '@xyflow/react';
import type { BooleanNodeType } from '~/components/nodes/boolean';
import type { DelayNodeType } from '~/components/nodes/delay';
import type { LogNodeType } from '~/components/nodes/log';
import type { NumberNodeType } from '~/components/nodes/number';
import type { RecordNodeType } from '~/components/nodes/record';
import type { RequestNodeType } from '~/components/nodes/request';
import type { SelectNodeType } from '~/components/nodes/select';
import type { StringNodeType } from '~/components/nodes/string';
import type { TriggerNodeType } from '~/components/nodes/trigger';
import type { VariableNodeType } from '~/components/nodes/variable';
import { HandleId } from '../types/handle-id';
import { wait } from '~/utils/promise';

export type FlowyResults = Map<string, StepResult>;

type Listener = (data: FlowyResults) => void;

type Status = 'idle' | 'running' | 'paused' | 'finished';

export type StepResult<R = unknown, E = FlowyError> = {
  status: Status;
  data?: R;
  error?: E;
};

type EdgeConnection = {
  edgeId: string;
  sourceId: string;
  targetId: string;
  sourceHandle: string;
  targetHandle: string;
};

export const CONSTANT_NODE_TYPES = ['string', 'number', 'boolean'];

export class FlowyManager extends Subscribable<Listener> {
  #results: FlowyResults;
  #connections: Map<string, EdgeConnection[]>;

  nodes: AppNode[];
  edges: Edge[];

  constructor() {
    super();

    this.#results = new Map();
    this.#connections = new Map();

    this.nodes = [];
    this.edges = [];
  }

  async run(nodes: AppNode[], edges: Edge[]) {
    this.#results.clear();
    this.#connections.clear();

    this.nodes = nodes;
    this.edges = edges;

    const flows = await this.#flows();
    await this.#promise(flows);
  }

  async #execute(node: AppNode) {
    const nodes = await this.#handleNode(node);
    this.#promise(nodes);
  }

  async #flows() {
    // 1. get the flow nodes and add them to the flows
    // flow nodes are nodes which do not have any incoming edges
    const flows = this.nodes.filter((node) => {
      return !this.edges.some((edge) => edge.target === node.id);
    });

    const constantNodes = flows.filter((node) => {
      if (!node.type) {
        return false;
      }

      return CONSTANT_NODE_TYPES.includes(node.type);
    });

    // 3. run and save the results of the constant nodes
    await this.#promise(constantNodes);
    return flows.filter((node) => !constantNodes.includes(node));
  }

  async #handleNode(node: AppNode): Promise<AppNode[]> {
    const { type } = node;
    if (!type) {
      throw new FlowyError('Node type not found');
    }

    if (type in this) {
      // @ts-ignore - we know this is a function
      return this[type](node);
    }

    throw new FlowyError(`Node type "${type}" not found`);
  }

  #setResult(nodeId: string, result: Partial<StepResult>) {
    const prevResult = this.#results.get(nodeId);
    this.#results.set(nodeId, {
      status: 'idle',
      ...prevResult,
      ...result,
    });
    this.#notify();
  }

  #getHandleConnections(
    nodeId: string,
    type: 'source' | 'target',
    handleId?: string
  ): EdgeConnection[] {
    const key = handleId
      ? `${nodeId}-${type}-${handleId}`
      : `${nodeId}-${type}`;

    if (this.#connections.has(key)) {
      return this.#connections.get(key) || [];
    }

    const node = this.nodes.find((node) => node.id === nodeId);
    if (!node) {
      return [];
    }

    const edges = this.edges.filter((edge) => {
      return type === 'source'
        ? edge.source === nodeId &&
            (!handleId || edge.sourceHandle === handleId)
        : edge.target === nodeId &&
            (!handleId || edge.targetHandle === handleId);
    });

    const connections = edges.map((edge) => {
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

    this.#connections.set(key, connections);
    return connections;
  }

  /**
   * Nodes
   */

  async trigger(node: TriggerNodeType) {
    const connections = this.#getHandleConnections(
      node.id,
      'source',
      HandleId.TriggerSource
    );

    return this.#getNodes(connections.map((connection) => connection.targetId));
  }

  async log(node: LogNodeType) {
    this.#setResult(node.id, { status: 'running' });

    await wait(3000);
    const parents = this.#getHandleConnections(
      node.id,
      'target',
      HandleId.LogTarget
    );

    for (const parent of parents) {
      const { sourceId: parentId } = parent;
      const result = this.#results.get(parentId);
      if (!result) {
        continue;
      }

      console.log(`Log node ${node.id} connected to ${parentId}`);
    }

    this.#setResult(node.id, { status: 'finished' });
    return [];
  }

  async request(node: RequestNodeType) {
    this.#setResult(node.id, { status: 'running' });

    const nodeId = node.id;

    const headers = await this.#headers(node);
    console.log('-'.repeat(20));
    console.log('Headers: ', headers);
    console.log('-'.repeat(20));

    const successes = this.#getHandleConnections(
      nodeId,
      'source',
      HandleId.RequestSuccessSource
    );
    const failures = this.#getHandleConnections(
      nodeId,
      'source',
      HandleId.RequestFailureSource
    );

    await wait(3000);

    const result = {
      // FIXME: THIS is just a placeholder
      data: { success: true, value: crypto.randomUUID() },
      error: undefined,
    };

    this.#setResult(nodeId, {
      status: 'finished',
      data: result.data,
      error: result.error,
    });

    const connections = result.data ? successes : failures;
    return this.#getNodes(connections.map((connection) => connection.targetId));
  }

  async #promise(nodes: AppNode[]) {
    return Promise.all(
      nodes.map(async (node) => {
        return await this.#execute(node);
      })
    );
  }

  async #headers(node: RequestNodeType) {
    const connection = this.#getHandleConnections(
      node.id,
      'target',
      HandleId.RequestHeadersTarget
    )?.[0];

    if (!connection) {
      return {};
    }

    const record = this.nodes.find(
      (node) => node.id === connection.sourceId
    ) as RecordNodeType;
    if (!record) {
      return {};
    }

    await this.record(record);
    const result = this.#results.get(record.id);
    if (!result) {
      return {};
    }

    return result.data;
  }

  async record(node: RecordNodeType) {
    this.#setResult(node.id, { status: 'running' });
    const { values } = node.data;

    const data: Record<string, unknown> = {};
    const connections = this.#getHandleConnections(node.id, 'target');
    for (const value of values) {
      const { key, handleId } = value;
      const connection = connections.find(
        (connection) => connection.targetHandle === handleId
      );

      if (!connection) {
        continue;
      }

      const result = this.#results.get(connection.sourceId);
      if (!result) {
        continue;
      }

      data[key] = result.data;
    }

    this.#setResult(node.id, { status: 'finished', data });
    return [];
  }

  async select(node: SelectNodeType) {
    this.#setResult(node.id, { status: 'running' });

    await wait(3000);

    const parents = this.#getHandleConnections(
      node.id,
      'target',
      HandleId.SelectTarget
    );
    const children = this.#getHandleConnections(
      node.id,
      'source',
      HandleId.SelectSource
    );

    const { path } = node.data;
    let pathResult: unknown = null;

    for (const parent of parents) {
      const { sourceId: parentId } = parent;
      const result = this.#results.get(parentId);
      if (!result) {
        continue;
      }

      pathResult = getProperty(result, path);
    }

    this.#setResult(node.id, {
      status: 'finished',
      data: pathResult,
      error: undefined,
    });

    return this.#getNodes(children.map((connection) => connection.targetId));
  }

  #getNodes(nodeIds: string[]) {
    return this.nodes.filter((node) => nodeIds.includes(node.id));
  }

  async delay(node: DelayNodeType) {
    this.#setResult(node.id, { status: 'running' });

    await wait(node.data.duration);

    const parents = this.#getHandleConnections(
      node.id,
      'target',
      HandleId.DelayTarget
    );

    let result: StepResult | undefined;
    for (const parent of parents) {
      const { sourceId: parentId } = parent;
      result = this.#results.get(parentId);
      if (!result) {
        continue;
      }
    }

    this.#setResult(node.id, {
      status: 'finished',
      data: result?.data,
      error: result?.error,
    });

    const children = this.#getHandleConnections(
      node.id,
      'source',
      HandleId.DelaySource
    );

    return this.#getNodes(children.map((connection) => connection.targetId));
  }

  async string(node: StringNodeType) {
    this.#setResult(node.id, { status: 'running' });
    const { value } = node.data;
    this.#setResult(node.id, { status: 'finished', data: value });

    return [];
  }

  async number(node: NumberNodeType) {
    this.#setResult(node.id, { status: 'running' });
    const { value } = node.data;
    this.#setResult(node.id, { status: 'finished', data: value });

    return [];
  }

  async boolean(node: BooleanNodeType) {
    this.#setResult(node.id, { status: 'running' });
    const { value } = node.data;
    this.#setResult(node.id, { status: 'finished', data: value });

    return [];
  }

  #notify() {
    const listeners = this.listeners;
    for (const listener of listeners) {
      listener(this.#results);
    }
  }

  get(nodeId: string): StepResult | undefined {
    return this.#results.get(nodeId);
  }

  getAll(): Map<string, StepResult> {
    return this.#results;
  }
}

export const flowyManager = new FlowyManager();
