import { Edge } from '@xyflow/react';
import { AppNode } from '../types';

export enum HandleId {
  TriggerSource = 'TRIGGER_SOURCE',
  LogTarget = 'LOG_TARGET',

  RequestSuccessSource = 'REQUEST_SUCCESS_SOURCE',
  RequestFailureSource = 'REQUEST_FAILURE_SOURCE',
  RequestTarget = 'REQUEST_TARGET',

  SelectSource = 'SELECT_SOURCE',
  SelectTarget = 'SELECT_TARGET',
}

export const initialNodes: AppNode[] = [
  {
    id: '3',
    type: 'trigger',
    position: { x: 0, y: 200 },
    data: { label: '3' },
  },
  {
    id: '4',
    type: 'request',
    position: { x: 190, y: 109 },
    data: { label: '4' },
  },
  {
    id: '5',
    type: 'log',
    position: { x: 510, y: 200 },
    data: { label: '5' },
  },
  {
    id: '6',
    type: 'log',
    position: { x: 550, y: 240 },
    data: { label: '5' },
  },
  {
    id: '7',
    type: 'select',
    position: { x: 450, y: 160 },
    data: { label: '5' },
  },
  {
    id: '8',
    type: 'log',
    position: { x: 660, y: 200 },
    data: { label: '5' },
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
  },
  {
    id: '4-6',
    source: '4',
    target: '6',
    sourceHandle: HandleId.RequestFailureSource,
    targetHandle: HandleId.LogTarget,
  },
  {
    id: '4-7',
    source: '4',
    target: '7',
    sourceHandle: HandleId.RequestSuccessSource,
    targetHandle: HandleId.SelectTarget,
  },
  {
    id: '7-8',
    source: '7',
    target: '8',
    sourceHandle: HandleId.SelectSource,
    targetHandle: HandleId.LogTarget,
  },
];
