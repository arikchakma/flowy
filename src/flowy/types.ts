import type { LogNode } from './components/nodes/log';
import type { RequestNode } from './components/nodes/request';
import type { TriggerNode } from './components/nodes/trigger';
import { SelectNode } from './components/nodes/select';
import { LoopCountEdge } from './components/edges/loop-count';
import { Edge } from '@xyflow/react';

export type AppNode = RequestNode | LogNode | TriggerNode | SelectNode;
export type AppEdge = LoopCountEdge;

export enum HandleId {
  TriggerSource = 'TRIGGER_SOURCE',
  LogTarget = 'LOG_TARGET',

  RequestSuccessSource = 'REQUEST_SUCCESS_SOURCE',
  RequestFailureSource = 'REQUEST_FAILURE_SOURCE',
  RequestTarget = 'REQUEST_TARGET',

  SelectSource = 'SELECT_SOURCE',
  SelectTarget = 'SELECT_TARGET',
}
