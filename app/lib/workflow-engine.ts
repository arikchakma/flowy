import type { AppNode } from '~/types/nodes';
import { Subscribable } from './subscribable';
import type { Edge } from '@xyflow/react';
import PQueue from 'p-queue';
import { getProperty } from 'dot-prop';

type Status = 'idle' | 'running' | 'paused' | 'finished';

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

    this.#nodes = [];
    this.#edges = [];

    this.#queue = new PQueue({ concurrency: 4 });
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

    console.log('~ start', {
      inDegree: this.#inDegree,
      graph: this.#graph,
    });

    const startNodes = Array.from(this.#inDegree.entries())
      .filter(([_, degree]) => degree === 0)
      .map(([id]) => id);

    this.#queue.addAll(
      startNodes.map((nodeId) => () => this.run(nodeId, null))
    );

    await this.#queue.onIdle();
    this.#notify();
  }

  async run(id: string, input: any) {
    const node = this.#nodes.find((node) => node.id === id);
    if (!node) {
      throw new Error(`Node ${id} not found`);
    }

    this.#setResult(id, {
      status: 'running',
    });

    const visitedCount = this.#visitedCount.get(id) || 0;
    this.#visitedCount.set(id, visitedCount + 1);

    let result = input;

    switch (node.type) {
      case 'trigger':
        break;
      case 'request':
        await new Promise((resolve) => setTimeout(resolve, 3000));
        result = await fetch(node.data.url, { method: node.data.method }).then(
          (r) => r.json()
        );
        break;
      case 'log':
        break;
      case 'select':
        result = getProperty(result, node.data.path);
        break;
      case 'delay':
        await new Promise((resolve) => setTimeout(resolve, node.data.duration));
        break;
      case 'string':
        result = node.data.value;
        break;
      case 'number':
        result = node.data.value;
        break;
      default:
        console.warn(`Unknown node type ${node.type}`);
        break;
    }

    this.#setResult(id, {
      status: 'finished',
      data: result,
    });

    const children = this.#graph.get(id);
    if (!children) {
      return;
    }

    for (const child of children) {
      const degree = (this.#inDegree.get(child) || 0) - 1;
      this.#inDegree.set(child, degree);

      // if all of it's parents are done, we can run it
      // otherwise we wait for the parents to finish
      if (degree === 0) {
        this.#queue.add(() => this.run(child, result));
      }
    }
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
}

export const workflowEngine = new WorkflowEngine();
