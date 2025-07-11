import { type Edge } from '@xyflow/react';
import { HandleId } from '~/types/handle-id';
import type { AppNode } from '~/types/nodes';

export const REQUEST_STROKE_STYLE = {
  stroke: 'var(--color-pink-700)',
};

export const initialNodes: AppNode[] = [
  {
    id: '3',
    type: 'start',
    position: {
      x: -251.17179630629016,
      y: 99.53789184538306,
    },
    data: {
      label: '3',
    },
    measured: {
      width: 93,
      height: 30,
    },
    selected: false,
    dragging: false,
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
    measured: {
      width: 208,
      height: 170,
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
    measured: {
      width: 64,
      height: 30,
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
    measured: {
      width: 64,
      height: 30,
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
      path: 'data.title',
    },
    measured: {
      width: 152,
      height: 30,
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
    measured: {
      width: 64,
      height: 30,
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
    measured: {
      width: 208,
      height: 170,
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
    selected: false,
    dragging: false,
    measured: {
      width: 64,
      height: 30,
    },
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
    measured: {
      width: 111,
      height: 30,
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
    measured: {
      width: 152,
      height: 30,
    },
  },
  {
    id: '13',
    type: 'string',
    position: {
      x: -47.28404724773202,
      y: -150.57495077711977,
    },
    data: {
      value: 'Howdy!',
    },
    measured: {
      width: 152,
      height: 30,
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
    measured: {
      width: 152,
      height: 30,
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
    measured: {
      width: 208,
      height: 276,
    },
  },
  {
    id: '19',
    type: 'delay',
    position: {
      x: -32.78404724773202,
      y: 199.9544266353185,
    },
    data: {
      duration: 2000,
    },
    measured: {
      width: 111,
      height: 30,
    },
    selected: false,
    dragging: false,
  },
  {
    id: '20',
    type: 'delay',
    position: {
      x: -32.78404724773202,
      y: 166.9544266353185,
    },
    data: {
      duration: 3000,
    },
    measured: {
      width: 111,
      height: 30,
    },
    selected: false,
    dragging: false,
  },
  {
    id: '21',
    type: 'delay',
    position: {
      x: -32.78404724773202,
      y: 133.9544266353185,
    },
    data: {
      duration: 4000,
    },
    measured: {
      width: 111,
      height: 30,
    },
    selected: false,
    dragging: false,
  },
  {
    id: '22',
    type: 'delay',
    position: {
      x: -32.78404724773202,
      y: 100.9544266353185,
    },
    data: {
      duration: 5000,
    },
    measured: {
      width: 111,
      height: 30,
    },
    selected: false,
    dragging: false,
  },
];

export const initialEdges: Edge[] = [
  {
    id: '4-5',
    source: '4',
    target: '5',
    sourceHandle: 'REQUEST_SUCCESS_SOURCE',
    targetHandle: 'LOG_TARGET',
    style: {
      stroke: 'var(--color-pink-700)',
      strokeWidth: 2.5,
    },
  },
  {
    id: '4-6',
    source: '4',
    target: '6',
    sourceHandle: 'REQUEST_FAILURE_SOURCE',
    targetHandle: 'LOG_TARGET',
    style: {
      stroke: 'var(--color-pink-700)',
      strokeWidth: 2.5,
    },
  },
  {
    id: '4-7',
    source: '4',
    target: '7',
    sourceHandle: 'REQUEST_SUCCESS_SOURCE',
    targetHandle: 'SELECT_TARGET',
    style: {
      stroke: 'var(--color-pink-700)',
      strokeWidth: 2.5,
    },
  },
  {
    id: '7-8',
    source: '7',
    target: '8',
    sourceHandle: 'SELECT_SOURCE',
    targetHandle: 'LOG_TARGET',
  },
  {
    id: '9-10',
    source: '9',
    target: '10',
    sourceHandle: 'REQUEST_SUCCESS_SOURCE',
    targetHandle: 'LOG_TARGET',
    style: {
      stroke: 'var(--color-pink-700)',
      strokeWidth: 2.5,
    },
  },
  {
    id: '11-9',
    source: '11',
    target: '9',
    sourceHandle: 'DELAY_SOURCE',
    targetHandle: 'REQUEST_TARGET',
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
  },
  {
    id: '4-11',
    source: '4',
    target: '11',
    sourceHandle: 'REQUEST_SUCCESS_SOURCE',
    targetHandle: 'DELAY_TARGET',
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
    sourceHandle: 'RECORD_SOURCE',
    target: '18',
    targetHandle: 'VARIABLE_TARGET',
  },
  {
    id: '12-16',
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
    source: '12',
    sourceHandle: 'STRING_SOURCE',
    target: '16',
    targetHandle: 'q7Rq7c7jSz000hj3vt698',
  },
  {
    id: '18-9',
    source: '18',
    target: '9',
    sourceHandle: 'VARIABLE_SOURCE',
    targetHandle: 'REQUEST_HEADERS_TARGET',
  },
  {
    id: '13-16',
    source: '13',
    target: '16',
    sourceHandle: 'STRING_SOURCE',
    targetHandle: 'UrUJtY5hfTaRkvzffAXmh',
  },
  {
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
    source: '3',
    sourceHandle: 'START_SOURCE',
    target: '22',
    targetHandle: 'DELAY_TARGET',
    id: 'xy-edge__3START_SOURCE-22DELAY_TARGET',
  },
  {
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
    source: '3',
    sourceHandle: 'START_SOURCE',
    target: '21',
    targetHandle: 'DELAY_TARGET',
    id: 'xy-edge__3START_SOURCE-21DELAY_TARGET',
  },
  {
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
    source: '3',
    sourceHandle: 'START_SOURCE',
    target: '20',
    targetHandle: 'DELAY_TARGET',
    id: 'xy-edge__3START_SOURCE-20DELAY_TARGET',
  },
  {
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
    source: '3',
    sourceHandle: 'START_SOURCE',
    target: '19',
    targetHandle: 'DELAY_TARGET',
    id: 'xy-edge__3START_SOURCE-19DELAY_TARGET',
  },
  {
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
    source: '22',
    sourceHandle: 'DELAY_SOURCE',
    target: '4',
    targetHandle: 'REQUEST_TARGET',
    id: 'xy-edge__22DELAY_SOURCE-4REQUEST_TARGET',
  },
  {
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
    source: '21',
    sourceHandle: 'DELAY_SOURCE',
    target: '4',
    targetHandle: 'REQUEST_TARGET',
    id: 'xy-edge__21DELAY_SOURCE-4REQUEST_TARGET',
  },
  {
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
    source: '20',
    sourceHandle: 'DELAY_SOURCE',
    target: '4',
    targetHandle: 'REQUEST_TARGET',
    id: 'xy-edge__20DELAY_SOURCE-4REQUEST_TARGET',
  },
  {
    style: {
      stroke: 'var(--color-zinc-900)',
      strokeWidth: 2.5,
    },
    source: '19',
    sourceHandle: 'DELAY_SOURCE',
    target: '4',
    targetHandle: 'REQUEST_TARGET',
    id: 'xy-edge__19DELAY_SOURCE-4REQUEST_TARGET',
  },
];
