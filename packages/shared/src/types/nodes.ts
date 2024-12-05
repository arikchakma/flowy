import type {Node} from '@xyflow/react';

export type BooleanNode = Node<
  {
    value: boolean;
  },
  'boolean'
>;

export type DelayNode = Node<
  {
    duration: number;
  },
  'delay'
>;

export type LogNode = Node<{}, 'log'>;

export type NumberNode = Node<
  {
    value: number;
  },
  'number'
>;

export type LoopRepeatType = 'indefinite' | number;

export type RepeatNode = Node<
  {
    /**
     * The number of times to repeat the animation before stopping. If set to
     * `"indefinite"`, the animation will repeat indefinitely.
     *
     * If not provided, this defaults to `"indefinite"`.
     */
    repeat?: LoopRepeatType;
  },
  'repeat'
>;

export type RequestNode = Node<{}, 'request'>;

export type SelectNode = Node<
  {
    path: string;
  },
  'select'
>;

export type StringNode = Node<
  {
    value: string;
  },
  'string'
>;

export type TriggerNode = Node<{}, 'trigger'>;


export type AppNode =
  | RequestNode
  | LogNode
  | TriggerNode
  | SelectNode
  | RepeatNode
  | StringNode
  | NumberNode
  | BooleanNode
  | DelayNode;

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

  BooleanSource = 'BOOLEAN_SOURCE',

  DelaySource = 'DELAY_SOURCE',
  DelayTarget = 'DELAY_TARGET',
}