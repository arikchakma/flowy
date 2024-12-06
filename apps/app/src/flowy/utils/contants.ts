import { AppNode, HandleId } from '@flowy/shared';
import { Edge } from '@xyflow/react';

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
      x: 158.5748033904688,
      y: 109,
    },
    data: {
      label: '4',
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
      path: 'data.success',
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
      x: 600,
      y: 0,
    },
    data: {
      label: '9',
    },
  },
  {
    id: '10',
    type: 'log',
    position: {
      x: 843.5095406519356,
      y: 90.94829020902236,
    },
    data: {
      label: '5',
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
  },
  {
    id: '12',
    type: 'string',
    position: { x: 0, y: 0 },
    data: {
      value: 'Hello, World!',
    },
  },
  {
    id: '13',
    type: 'number',
    position: { x: 0, y: 35 },
    data: {
      value: 42,
    },
  },
  {
    id: '14',
    type: 'boolean',
    position: { x: 0, y: 70 },
    data: {
      value: true,
    },
  },
  {
    id: '15',
    type: 'delay',
    position: { x: 0, y: 105 },
    data: {
      duration: 1000,
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
];
