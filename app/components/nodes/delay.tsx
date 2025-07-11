import {
  Handle,
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { LoaderIcon } from 'lucide-react';
import { type ChangeEvent, memo, useState } from 'react';
import { NodeId } from '../node-id';
import { HandleId } from '~/types/handle-id';
import { cn } from '~/utils/classname';
import { useNodeResult } from '~/lib/use-node-result';

export type DelayNodeType = Node<
  {
    duration: number;
  },
  'delay'
>;

function _DelayNode(props: NodeProps<DelayNodeType>) {
  const { selected, id: nodeId, data } = props;
  const { duration: defaultValue } = data;

  const [value, setValue] = useState(defaultValue);
  const { updateNodeData } = useReactFlow<DelayNodeType>();

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) {
      return;
    }

    setValue(newValue);
    updateNodeData(nodeId, { duration: newValue });
  };

  const result = useNodeResult(nodeId);

  return (
    <>
      <NodeId nodeId={nodeId} />
      <div
        className={cn(
          'flex items-stretch overflow-hidden rounded-full bg-zinc-900 text-white shadow-sm inset-ring-1 inset-ring-zinc-200/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-zinc-400',
          result?.status === 'running' &&
            'animate-running-node outline-2 outline-offset-1 outline-zinc-400'
        )}
      >
        <div className="flex h-[30px] shrink-0 items-center justify-center bg-zinc-800 p-2 pl-2.5">
          <LoaderIcon className="size-3.5 stroke-[2.5]" />
        </div>
        <div className="flex items-center pr-2.5">
          <input
            type="number"
            placeholder="0"
            min={0}
            className="hide-number-controls w-13 px-2 py-1 pr-1 font-mono text-sm tabular-nums placeholder:font-sans placeholder:text-zinc-400 focus:outline-none"
            value={value}
            onChange={handleValueChange}
          />
          <span className="inline-block text-xs leading-none text-zinc-400">
            ms
          </span>
        </div>
      </div>

      <Handle
        id={HandleId.DelayTarget}
        type="target"
        position={Position.Left}
        className="size-2.5! border-2! bg-zinc-900!"
      />

      <Handle
        id={HandleId.DelaySource}
        type="source"
        position={Position.Right}
        className="size-2.5! border-2! bg-zinc-900!"
      />
    </>
  );
}

export const DelayNode = memo(_DelayNode);
