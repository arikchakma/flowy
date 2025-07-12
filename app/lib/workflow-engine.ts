import type { AppNode } from '~/types/nodes';
import { Subscribable } from './subscribable';
import type { Edge } from '@xyflow/react';
import PQueue from 'p-queue';
import { getProperty } from 'dot-prop';
import { HandleId } from '~/types/handle-id';
import type { RequestNodeType } from '~/components/nodes/request';
import type { SelectNodeType } from '~/components/nodes/select';
import type { RecordNodeType } from '~/components/nodes/record';
import type { VariableNodeType } from '~/components/nodes/variable';
import type { DelayNodeType } from '~/components/nodes/delay';
import type { StringNodeType } from '~/components/nodes/string';
import type { NumberNodeType } from '~/components/nodes/number';

type NodeOptions = {
  prev?: string;
};

export type Status = 'idle' | 'running' | 'paused' | 'success' | 'error';

export type StepResult<R = unknown, E = Error> = {
  status: Status;
  data?: R;
  error?: E;
};

export type WorkflowResults = Map<string, StepResult>;
type Listener = (data: WorkflowResults) => void;

type Graph = Map<string, string[]>;
type InDegree = Map<string, number>;
type VisitedCount = Map<string, number>;

export class WorkflowEngine extends Subscribable<Listener> {
  #results: WorkflowResults = new Map();
  #status: Status = 'idle';

  #graph: Graph = new Map();
  #inDegree: InDegree = new Map();
  #visitedCount: VisitedCount = new Map();

  #queue: PQueue;
  #nodes: AppNode[] = [];
  #edges: Edge[] = [];

  constructor() {
    super();

    this.#results = new Map();
    this.#graph = new Map();
    this.#inDegree = new Map();
    this.#visitedCount = new Map();
    this.#status = 'idle';

    this.#nodes = [];
    this.#edges = [];

    this.#queue = new PQueue({ concurrency: 100 });
  }

  build() {
    this.#graph.clear();
    this.#inDegree.clear();
    this.#visitedCount.clear();

    for (const node of this.#nodes) {
      this.#graph.set(node.id, []);
      this.#inDegree.set(node.id, 0);
    }

    for (const edge of this.#edges) {
      this.#graph.get(edge.source)?.push(edge.target);

      const degree = this.#inDegree.get(edge.target) || 0;
      this.#inDegree.set(edge.target, degree + 1);
    }
  }

  async start(nodes: AppNode[], edges: Edge[]) {
    this.#nodes = nodes;
    this.#edges = edges;
    this.build();

    this.#status = 'running';
    this.#notify();

    const startNodes = Array.from(this.#inDegree.entries())
      .filter(([_, degree]) => degree === 0)
      .map(([id]) => id);

    this.#queue.addAll(
      startNodes.map((nodeId) => () => this.run(nodeId, null))
    );

    await this.#queue.onIdle();
    this.#status = 'success';
    this.#notify();
  }

  async run(id: string, options: NodeOptions | null) {
    const node = this.#nodes.find((node) => node.id === id);
    if (!node) {
      throw new Error(`Node ${id} not found`);
    }

    console.log(`RUN[${id}]:`, node.type);

    this.#visit(id);
    switch (node.type) {
      case 'start':
        break;
      case 'request':
        await this.#request(node, options);
        break;
      case 'log':
        this.#log(id, options);
        break;
      case 'select':
        this.#select(node, options);
        break;
      case 'delay':
        await this.#delay(node, options);
        break;
      case 'string':
        this.#string(node);
        break;
      case 'number':
        this.#number(node);
        break;
      case 'record':
        this.#record(node, options);
        break;
      case 'variable':
        this.#variable(node, options);
        break;
      default:
        console.warn(`Unknown node type ${node.type}`);
        break;
    }

    const children = this.#children(node);
    if (!children) {
      return;
    }

    for (const child of children) {
      const dependencies = this.#dependencies(child);
      if (dependencies.length !== 0) {
        continue;
      }

      this.#queue.add(() => this.run(child, { prev: id }));
    }
  }

  /**
   * Returns the dependencies of a node.
   * So that we can determine if a node is ready to run.
   *
   * Example:
   * If the `Request` has a `record` node, then we should wait for the `record` node to finish.
   * Also for the `Record` node, we should wait for all of it's dependencies to finish.
   * Then we can run the `Request` node.
   *
   * @param node - The node to get the dependencies of.
   * @returns The dependencies of the node.
   */
  #dependencies(nodeId: string) {
    const node = this.#nodes.find((node) => node.id === nodeId);
    if (!node) {
      return [];
    }

    // for a request node, header's source is the node id
    // is a dependency for the request node
    let dependencies: string[] = [];
    switch (node.type) {
      case 'request':
        const edges = this.#edges.filter(
          (edge) =>
            edge.target === node.id &&
            (edge.targetHandle === HandleId.RequestHeadersTarget ||
              edge.targetHandle === HandleId.RequestQueryTarget ||
              edge.targetHandle === HandleId.RequestBodyTarget)
        );

        if (edges.length === 0) {
          return [];
        }

        for (const edge of edges) {
          const source = this.#nodes.find((node) => node.id === edge.source);
          if (!source) {
            continue;
          }

          const result = this.#results.get(source.id);
          if (result?.status === 'success' || result?.status === 'error') {
            continue;
          }

          dependencies.push(source.id);
        }
        return dependencies;
      case 'record':
        for (const value of node.data.values) {
          const source = this.#edges.find(
            (edge) => edge.targetHandle === value.handleId
          );
          if (!source) {
            continue;
          }

          const sourceNode = this.#nodes.find(
            (node) => node.id === source.source
          );
          if (!sourceNode) {
            continue;
          }

          const result = this.#results.get(sourceNode.id);
          if (result?.status === 'success' || result?.status === 'error') {
            continue;
          }

          dependencies.push(sourceNode.id);
        }
        return dependencies;
      default:
        return [];
    }
  }

  #children(node: AppNode) {
    // for the request node, there can be either
    // success or error children so we need to check
    // the result of the request node
    let children: string[] = [];
    const currentNodeId = node.id;
    switch (node.type) {
      case 'request':
        const result = this.#results.get(currentNodeId);
        if (!result) {
          return [];
        }

        const success = this.#edges.filter(
          (edge) =>
            edge.source === currentNodeId &&
            edge.sourceHandle === HandleId.RequestSuccessSource
        );
        const error = this.#edges.filter(
          (edge) =>
            edge.source === currentNodeId &&
            edge.sourceHandle === HandleId.RequestFailureSource
        );

        if (result.data) {
          children = success.map((edge) => edge.target);
        } else if (result.error) {
          children = error.map((edge) => edge.target);
        }
        break;
      case 'record':
      case 'variable':
        const original = this.#graph.get(currentNodeId) || [];
        for (const child of original) {
          // we will run if the children has never been visited
          // and has no other parents that has not been visited
          const visitedCount = this.#visitedCount.get(child) || 0;
          const parents = this.#edges.filter(
            (edge) =>
              edge.target === child &&
              edge.source !== currentNodeId &&
              !this.#visitedCount.get(edge.source)
          );

          if (visitedCount !== 0 || parents.length !== 0) {
            continue;
          }

          children.push(child);
        }
        break;
      default:
        children = this.#graph.get(currentNodeId) || [];
        break;
    }

    return children;
  }

  #type(nodeId: string) {
    const node = this.#nodes.find((node) => node.id === nodeId);
    if (!node) {
      return undefined;
    }

    return node.type;
  }

  #sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  #string(node: StringNodeType) {
    const nodeId = node.id;

    this.#setResult(nodeId, {
      status: 'running',
    });

    this.#setResult(nodeId, {
      status: 'success',
      data: node.data.value,
    });
  }

  #number(node: NumberNodeType) {
    const nodeId = node.id;

    this.#setResult(nodeId, {
      status: 'running',
    });

    this.#setResult(nodeId, {
      status: 'success',
      data: node.data.value,
    });
  }

  async #delay(node: DelayNodeType, options: NodeOptions | null) {
    const nodeId = node.id;

    this.#setResult(nodeId, {
      status: 'running',
    });

    const prev = options?.prev;
    const prevResult = prev ? this.#results.get(prev) : undefined;
    await this.#sleep(node.data.duration);

    this.#setResult(nodeId, {
      status: 'success',
      data:
        prevResult?.status === 'success' ? prevResult?.data : prevResult?.error,
    });
  }

  #variable(node: VariableNodeType, options: NodeOptions | null) {
    const nodeId = node.id;
    const prev = options?.prev;
    const prevResult = prev ? this.#results.get(prev) : undefined;

    this.#setResult(nodeId, {
      status: 'running',
    });

    this.#setResult(nodeId, {
      status: 'success',
      data: prevResult?.data,
    });
  }

  #record(node: RecordNodeType, options: NodeOptions | null) {
    const nodeId = node.id;

    const record: Record<string, unknown> = {};
    this.#setResult(nodeId, {
      status: 'running',
    });

    for (const value of node.data.values) {
      const source = this.#edges.find(
        (edge) => edge.targetHandle === value.handleId
      );
      if (!source) {
        record[value.key] = undefined;
        continue;
      }

      const sourceNode = this.#nodes.find((node) => node.id === source.source);
      if (!sourceNode) {
        record[value.key] = undefined;
        continue;
      }

      record[value.key] = this.#results.get(sourceNode.id)?.data;
    }

    this.#setResult(nodeId, {
      status: 'success',
      data: record,
    });
  }

  async #request(node: RequestNodeType, options: NodeOptions | null) {
    const nodeId = node.id;
    this.#setResult(nodeId, {
      status: 'running',
    });

    try {
      const headers = this.#headers(nodeId);
      const query = this.#query(nodeId);
      const body = this.#body(nodeId);
      const result = await fetch('/v1/workflow/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Flowy-Workflow-Node-Id': nodeId,
        },
        body: JSON.stringify({
          url: node.data.url,
          method: node.data.method,
          headers,
          body,
          query,
        }),
      }).then((r) => r.json());

      this.#setResult(nodeId, {
        status: 'success',
        data: result,
      });
    } catch (error) {
      this.#setResult(nodeId, {
        status: 'error',
        error: error instanceof Error ? error : undefined,
      });
    }
  }

  #select(node: SelectNodeType, options: NodeOptions | null) {
    const nodeId = node.id;
    const prev = options?.prev;
    const prevResult = prev ? this.#results.get(prev) : undefined;

    this.#setResult(nodeId, {
      status: 'running',
    });

    const data =
      prevResult?.status === 'success' ? prevResult?.data : prevResult?.error;
    const result = getProperty(data, node.data.path);
    this.#setResult(nodeId, {
      status: 'success',
      data: result,
    });
  }

  #log(nodeId: string, options: NodeOptions | null) {
    const prev = options?.prev;

    this.#setResult(nodeId, {
      status: 'running',
    });

    const prevResult = prev ? this.#results.get(prev) : undefined;
    console.log(`LOG[${nodeId}]:`, prevResult?.data, prevResult?.error);

    this.#setResult(nodeId, {
      status: 'success',
      data: prevResult,
    });
  }

  #visit(nodeId: string) {
    const visitedCount = (this.#visitedCount.get(nodeId) || 0) + 1;
    this.#visitedCount.set(nodeId, visitedCount);
    return visitedCount;
  }

  #headers(nodeId: string) {
    const headersNodeId = this.#edges.find(
      (edge) =>
        edge.targetHandle === HandleId.RequestHeadersTarget &&
        edge.target === nodeId
    )?.source;
    return headersNodeId ? this.#results.get(headersNodeId)?.data : {};
  }

  #query(nodeId: string) {
    const queryNodeId = this.#edges.find(
      (edge) =>
        edge.targetHandle === HandleId.RequestQueryTarget &&
        edge.target === nodeId
    )?.source;
    return queryNodeId ? this.#results.get(queryNodeId)?.data : {};
  }

  #body(nodeId: string) {
    const bodyNodeId = this.#edges.find(
      (edge) =>
        edge.targetHandle === HandleId.RequestBodyTarget &&
        edge.target === nodeId
    )?.source;
    return bodyNodeId ? this.#results.get(bodyNodeId)?.data : {};
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

  get status() {
    return this.#status;
  }
}

export const workflowEngine = new WorkflowEngine();
