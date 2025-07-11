import type { Edge } from '@xyflow/react';
import type { AppNode } from '~/types/nodes';

import PQueue from 'p-queue';
import { getProperty } from 'dot-prop';

// type Node = { id: string, type: string, data: any };
// type Edge = { source: string, target: string };

/**
 * Builds a graph from a list of nodes and edges.
 * The graph is a map of node id to its children.
 * The in-degree is the number of edges coming into a node.
 * @param nodes - The list of nodes.
 * @param edges - The list of edges.
 * @returns The graph and the in-degree of each node.
 */
function buildGraph(nodes: AppNode[], edges: Edge[]) {
  const graph: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};

  nodes.forEach((n) => {
    graph[n.id] = [];
    inDegree[n.id] = 0;
  });

  edges.forEach((e) => {
    graph[e.source].push(e.target);
    inDegree[e.target]++;
  });

  return { graph, inDegree };
}

export async function runWorkflow(nodes: AppNode[], edges: Edge[]) {
  const { graph, inDegree } = buildGraph(nodes, edges);
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const queue = new PQueue({ concurrency: 4 });
  const visitedCount: Record<string, number> = {};

  const runNode = async (id: string, input: any) => {
    const node = nodeMap[id];
    visitedCount[id] = (visitedCount[id] || 0) + 1;

    // this is a hack to prevent infinite loops
    // of visiting the same node too many times
    if (visitedCount[id] > 1000) {
      console.warn(`⚠️ Infinite loop detected at node ${id}`);
      return;
    }

    let result = input;
    switch (node.type) {
      case 'start':
        console.log(`START[${id}]:`, input);
        break;
      case 'request':
        console.log(`REQUEST[${id}]:`, node.data.url);
        result = await fetch(node.data.url, { method: node.data.method }).then(
          (r) => r.json()
        );
        break;
      case 'log':
        console.log(`LOG[${id}]:`, result);
        break;
      case 'select':
        console.log(`SELECT[${id}]:`, node.data.path);
        result = getProperty(input, node.data.path);
        console.log(`SELECT[${id}][${node.data.path}]:`, result);
        break;
      case 'delay':
        console.log(`DELAY[${id}]:`, node.data.duration);
        await new Promise((r) => setTimeout(r, node.data.duration));
        break;
      default:
        console.warn(`Unknown node type ${node.type}`);
        break;
    }

    for (const child of graph[id]) {
      inDegree[child]--;

      // so if all of it's parents are done, we can run it
      // otherwise we wait for the parents to finish
      if (inDegree[child] === 0) {
        queue.add(() => runNode(child, result));
      }
    }
  };

  const startNodes = Object.keys(inDegree).filter((id) => inDegree[id] === 0);
  queue.addAll(startNodes.map((nodeId) => () => runNode(nodeId, null)));

  await queue.onIdle();
  console.log('✅ Workflow complete');
}
