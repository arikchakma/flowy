import { Handle, Node, NodeProps, Position, useReactFlow } from '@xyflow/react';
import { ALargeSmallIcon, ArrowUp10Icon, ToggleRightIcon } from 'lucide-react';
import { ChangeEvent, memo, useState } from 'react';
import { AppNode, HandleId } from '../../types';
import { cn } from '../../utils/classname';
import { useFlowyStore } from '../../stores/flowy-store';
import { Switch } from '../select';

export type BooleanNode = Node<
  {
    value: boolean;
  },
  'boolean'
>;

function _BooleanNode(props: NodeProps<BooleanNode>) {
  const { selected, id: nodeId, data } = props;
  const { value: defaultValue = false } = data;

  const { results } = useFlowyStore();

  const [value, setValue] = useState(defaultValue);
  const { updateNodeData } = useReactFlow<AppNode>();

  const result = results.get(nodeId);

  return (
    <>
      <div
        className={cn(
          'flex items-stretch overflow-hidden rounded-full bg-zinc-900 text-white inset-ring-1 shadow-sm inset-ring-zinc-200/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-zinc-400',
          result?.status === 'running' &&
            'animate-running-node outline-2 outline-offset-1 outline-zinc-400'
        )}
      >
        <div className="flex h-[30px] shrink-0 items-center justify-center bg-zinc-800 p-2 pl-2.5">
          <ToggleRightIcon className="size-3.5 stroke-[2.5]" />
        </div>
        <div className="flex items-center gap-2 px-1 pr-2.5">
          <Switch
            checked={value}
            onCheckedChange={(checked) => {
              setValue(checked);
              updateNodeData(nodeId, { value: checked });
            }}
          />
          <span className="font-mono text-xs uppercase">
            {value ? 'true' : 'false'}
          </span>
        </div>
      </div>

      <Handle
        id={HandleId.NumberSource}
        type="source"
        position={Position.Right}
        className="size-2.5! border-2! bg-zinc-900!"
      />
    </>
  );
}

export const BooleanNode = memo(_BooleanNode);
