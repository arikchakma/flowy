import type { BooleanNodeType } from '~/components/nodes/boolean';
import type { DelayNodeType } from '~/components/nodes/delay';
import type { LogNodeType } from '~/components/nodes/log';
import type { NumberNodeType } from '~/components/nodes/number';
import type { RecordNodeType } from '~/components/nodes/record';
import type { RepeatNodeType } from '~/components/nodes/repeat';
import type { RequestNodeType } from '~/components/nodes/request';
import type { SelectNodeType } from '~/components/nodes/select';
import type { StringNodeType } from '~/components/nodes/string';
import type { StartNodeType } from '~/components/nodes/start';
import type { VariableNodeType } from '~/components/nodes/variable';

export type AppNode =
  | RequestNodeType
  | LogNodeType
  | StartNodeType
  | SelectNodeType
  | RepeatNodeType
  | StringNodeType
  | NumberNodeType
  | BooleanNodeType
  | DelayNodeType
  | RecordNodeType
  | VariableNodeType;
export type NodeType = AppNode['type'];
