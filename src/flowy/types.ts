import type { LogNode } from './components/nodes/log';
import type { RequestNode } from './components/nodes/request';
import type { TriggerNode } from './components/nodes/trigger';
import { SelectNode } from './components/nodes/select';
import { RepeatNode } from './components/nodes/repeat';
import { StringNode } from './components/nodes/string';
import { NumberNode } from './components/nodes/number';
import { BooleanNode } from './components/nodes/boolean';

export type AppNode =
  | RequestNode
  | LogNode
  | TriggerNode
  | SelectNode
  | RepeatNode
  | StringNode
  | NumberNode
  | BooleanNode;

export enum HandleId {
  TriggerSource = 'TRIGGER_SOURCE',
  LogTarget = 'LOG_TARGET',

  RequestSuccessSource = 'REQUEST_SUCCESS_SOURCE',
  RequestFailureSource = 'REQUEST_FAILURE_SOURCE',
  RequestTarget = 'REQUEST_TARGET',

  SelectSource = 'SELECT_SOURCE',
  SelectTarget = 'SELECT_TARGET',

  RepeatSource = 'REPEAT_SOURCE',
  RepeatTarget = 'REPEAT_TARGET',

  StringSource = 'STRING_SOURCE',

  NumberSource = 'NUMBER_SOURCE',
}
