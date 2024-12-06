import { getProperty } from 'dot-prop';
import { runPromisesInBatchSequentially, HandleId, wait } from '@flowy/shared';
import type {
  AppNode,
  RequestNodeType,
  SelectNodeType,
  TriggerNodeType,
  Edge,
  BatchPromiseInput,
  LogNodeType,
} from '@flowy/shared';
import { Subscribable } from './subscribable';
import { FlowyError } from '@flowy/shared';
import { DelayNodeType } from '@flowy/shared';

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

    const trigger = nodes.find((node) => node.type === 'trigger');
    if (!trigger) {
      throw new FlowyError('Trigger node not found');
    }

    await this.#handleNode(trigger);
  }

  async #handleNode(node: AppNode): Promise<void> {
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

  async #handleConnections(connections: EdgeConnection[]) {
    const promises: BatchPromiseInput<any> = [];
    for (const connection of connections) {
      const { targetId } = connection;
      const node = this.nodes.find((node) => node.id === targetId);
      if (!node) {
        continue;
      }

      promises.push(() => this.#handleNode(node));
    }

    await runPromisesInBatchSequentially(promises, 5);
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

    await this.#handleConnections(connections);
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
  }

  async request(node: RequestNodeType) {
    this.#setResult(node.id, { status: 'running' });

    const nodeId = node.id;

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

    if (result.data) {
      await this.#handleConnections(successes);
    } else if (result.error) {
      await this.#handleConnections(failures);
    }
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

    await this.#handleConnections(children);
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

    await this.#handleConnections(children);
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
