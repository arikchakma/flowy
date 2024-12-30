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

export const allowedRequestMethods = ['GET', 'POST', 'PUT', 'DELETE'] as const;
export type RequestMethod = (typeof allowedRequestMethods)[number];

export type RequestNodeType = Node<
  {
    /**
     * The method to use for the request. This can be one of the following:
     * - `"GET"`
     * - `"POST"`
     * - `"PUT"`
     * - `"DELETE"`
     *
     * If not provided, this defaults to `"GET"`.
     */
    method?: RequestMethod;

    /**
     * The URL to send the request to with the method specified.
     * @example `"https://arikko.dev/v1/v1-health"`
     */
    url: string;

    /**
     * The headers to send with the request. This values will be sent as is.
     * They will be added via the Record node.
     *
     * @example `{ "Content-Type": "application/json" }`
     * @default `{}`
     */
    headers?: Record<string, any>;

    /**
     * The body to send with the request. This values will be sent as is.
     * They will be added via the Record node. This is only used for methods
     * that support a body. Like `"POST"` and `"PUT"`.
     *
     * @example `{ "key": "value" }`
     * @default `{}`
     */
    body?: Record<string, any>;
  },
  'request'
>;

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

export type VariableNodeType = Node<
  {
    name: string;
  },
  'variable'
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
  | RecordNodeType
  | VariableNodeType;

export enum HandleId {
  TriggerSource = 'TRIGGER_SOURCE',
  LogTarget = 'LOG_TARGET',

  RequestSuccessSource = 'REQUEST_SUCCESS_SOURCE',
  RequestFailureSource = 'REQUEST_FAILURE_SOURCE',
  RequestTarget = 'REQUEST_TARGET',
  RequestHeadersTarget = 'REQUEST_HEADERS_TARGET',
  RequestBodyTarget = 'REQUEST_BODY_TARGET',

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

  VariableTarget = 'VARIABLE_TARGET',
  VariableSource = 'VARIABLE_SOURCE',
}
