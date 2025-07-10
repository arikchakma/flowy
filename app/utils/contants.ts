import { type Edge } from '@xyflow/react';
import { HandleId } from '~/types/handle-id';
import type { AppNode } from '~/types/nodes';

export const REQUEST_STROKE_STYLE = {
  stroke: 'var(--color-pink-700)',
};

export const initialNodes: AppNode[] = [
  {
    id: '3',
    type: 'trigger',
    position: {
      x: 0,
      y: 200,
    },
    data: {
      label: '3',
    },
  },
  {
    id: '4',
    type: 'request',
    position: {
      x: 157.97502695662723,
      y: 83.3038006246936,
    },
    data: {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
    },
  },
  {
    id: '5',
    type: 'log',
    position: {
      x: 467.93950326627834,
      y: 198.72277354470052,
    },
    data: {
      label: '5',
    },
  },
  {
    id: '6',
    type: 'log',
    position: {
      x: 493.12839178319683,
      y: 236.2100694822811,
    },
    data: {
      label: '5',
    },
  },
  {
    id: '7',
    type: 'select',
    position: {
      x: 444.28632788917616,
      y: 163.57104506926493,
    },
    data: {
      path: 'title',
    },
  },
  {
    id: '8',
    type: 'log',
    position: {
      x: 658.0002688961907,
      y: 162.86113127964492,
    },
    data: {
      label: '5',
    },
  },
  {
    id: '9',
    type: 'request',
    position: {
      x: 631.8202361171429,
      y: -66.58759695247245,
    },
    data: {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
    },
  },
  {
    id: '10',
    type: 'log',
    position: {
      x: 888.6079861232147,
      y: 49.63290938682613,
    },
    data: {
      label: '5',
    },
    selected: true,
    dragging: false,
  },
  {
    id: '11',
    type: 'delay',
    position: {
      x: 444.5094158058936,
      y: 128.4544266353185,
    },
    data: {
      duration: 1000,
    },
  },
  {
    id: '12',
    type: 'string',
    position: {
      x: -47.28404724773202,
      y: -184.57495077711977,
    },
    data: {
      value: 'Hello, World!',
    },
  },
  {
    id: '18',
    type: 'variable',
    position: {
      x: 437.2141693077034,
      y: 20.346457956350008,
    },
    data: {
      name: 'variable',
    },
  },
  {
    id: '16',
    type: 'record',
    position: {
      x: 157.97502695662723,
      y: -220.71196623325315,
    },
    data: {
      values: [
        {
          key: 'Authorization',
          handleId: 'q7Rq7c7jSz000hj3vt698',
        },
        {
          key: 'Content-Type',
          handleId: 'UrUJtY5hfTaRkvzffAXmh',
        },
        {
          key: 'Accept',
          handleId: 'pb6Qy2UXs8Ag3Jr9F8Dwk',
        },
        {
          key: 'User-Agent',
          handleId: 'Km2vtkQAzcXTLyrAa3oEx',
        },
        {
          key: 'X-Forwarded-For',
          handleId: 'Vg4bcMlA3nPVMKRBSkRtQ',
        },
        {
          key: 'X-Forwarded-Proto',
          handleId: 'dY6smsnzdt37nfgLl_sUj',
        },
        {
          key: 'X-Maily-Key',
          handleId: 'PxcrJW0qph0zvyPvtZcU0',
        },
      ],
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: '3-4',
    source: '3',
    target: '4',
    sourceHandle: HandleId.TriggerSource,
    targetHandle: HandleId.RequestTarget,
  },
  {
    id: '4-5',
    source: '4',
    target: '5',
    sourceHandle: HandleId.RequestSuccessSource,
    targetHandle: HandleId.LogTarget,
    style: {
      stroke: 'var(--color-pink-700)',
      strokeWidth: 2.5,
    },
  },
  {
    id: '4-6',
    source: '4',
    target: '6',
    sourceHandle: HandleId.RequestFailureSource,
    targetHandle: HandleId.LogTarget,
    style: {
      stroke: 'var(--color-pink-700)',
      strokeWidth: 2.5,
    },
  },
  {
    id: '4-7',
    source: '4',
    target: '7',
    sourceHandle: HandleId.RequestSuccessSource,
    targetHandle: HandleId.SelectTarget,
    style: {
      stroke: 'var(--color-pink-700)',
      strokeWidth: 2.5,
    },
  },
  {
    id: '7-8',
    source: '7',
    target: '8',
    sourceHandle: HandleId.SelectSource,
    targetHandle: HandleId.LogTarget,
  },
  {
    id: '9-10',
    source: '9',
    target: '10',
    sourceHandle: HandleId.RequestSuccessSource,
    targetHandle: HandleId.LogTarget,
    style: {
      stroke: 'var(--color-pink-700)',
      strokeWidth: 2.5,
    },
  },
  {
    id: '11-9',
    source: '11',
    target: '9',
    sourceHandle: HandleId.DelaySource,
    targetHandle: HandleId.RequestTarget,
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
  },
  {
    id: '4-11',
    source: '4',
    target: '11',
    sourceHandle: HandleId.RequestSuccessSource,
    targetHandle: HandleId.DelayTarget,
    style: {
      stroke: 'var(--color-pink-700)',
      strokeWidth: 2.5,
    },
  },
  {
    id: '16-18',
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
    source: '16',
    sourceHandle: HandleId.RecordSource,
    target: '18',
    targetHandle: HandleId.VariableTarget,
  },
  {
    id: '12-16',
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
    source: '12',
    sourceHandle: HandleId.StringSource,
    target: '16',
    targetHandle: 'q7Rq7c7jSz000hj3vt698',
  },
  {
    id: '18-9',
    source: '18',
    target: '9',
    sourceHandle: HandleId.VariableSource,
    targetHandle: HandleId.RequestHeadersTarget,
  },
];
