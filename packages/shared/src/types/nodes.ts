import type { Node } from '@xyflow/react';

export type BooleanNodeType = Node<
  {
    value: boolean;
  },
  'boolean'
>;

export type DelayNodeType = Node<
  {
    duration: number;
  },
  'delay'
>;

export type LogNodeType = Node<{}, 'log'>;

export type NumberNodeType = Node<
  {
    value: number;
  },
  'number'
>;

export type LoopRepeatType = 'indefinite' | number;

export type RepeatNodeType = Node<
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

export type RequestNodeType = Node<{}, 'request'>;

export type SelectNodeType = Node<
  {
    path: string;
  },
  'select'
>;

export type StringNodeType = Node<
  {
    value: string;
  },
  'string'
>;

export type TriggerNodeType = Node<{}, 'trigger'>;

export type RecordNodeType = Node<
  {
    /**
     * The values will be stored in a map where the key is the name of the
     * value and the value is the handle id where the value is stored.
     */
    values: {
      key: string;
      handleId: string;
    }[];
  },
  'record'
>;

export type AppNode =
  | RequestNodeType
  | LogNodeType
  | TriggerNodeType
  | SelectNodeType
  | RepeatNodeType
  | StringNodeType
  | NumberNodeType
  | BooleanNodeType
  | DelayNodeType
  | RecordNodeType;

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

  RecordSource = 'RECORD_SOURCE',
}
