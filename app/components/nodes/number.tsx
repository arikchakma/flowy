import {
  Handle,
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { ALargeSmallIcon, ArrowUp10Icon } from 'lucide-react';
import { type ChangeEvent, memo, useState } from 'react';
import { cn } from '~/utils/classname';
import { HandleId } from '~/types/handle-id';

export type NumberNodeType = Node<
  {
    value: number;
  },
  'number'
>;

function _NumberNode(props: NodeProps<NumberNodeType>) {
  const { selected, id: nodeId, data } = props;
  const { value: defaultValue = 0 } = data;

  const [value, setValue] = useState(defaultValue);
  const { updateNodeData } = useReactFlow<NumberNodeType>();

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) {
      return;
    }

    setValue(newValue);
    updateNodeData(nodeId, { value: newValue });
  };

  return (
    <>
      <div
        className={cn(
          'flex items-stretch overflow-hidden rounded-full bg-zinc-900 text-white inset-ring-1 shadow-sm inset-ring-zinc-200/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-zinc-400'
        )}
      >
        <div className="flex h-[30px] shrink-0 items-center justify-center bg-zinc-800 p-2 pl-2.5">
          <ArrowUp10Icon className="size-3.5 stroke-[2.5]" />
        </div>
        <input
          type="number"
          placeholder="0"
          className="hide-number-controls w-14 px-2 py-1 font-mono text-sm tabular-nums placeholder:font-sans placeholder:text-zinc-400 focus:outline-none"
          value={value}
          onChange={handleValueChange}
        />
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

export const NumberNode = memo(_NumberNode);
