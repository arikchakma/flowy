import { Handle, type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { ALargeSmallIcon } from 'lucide-react';
import { type ChangeEvent, memo, useState } from 'react';
import { cn } from '~/utils/classname';
import { NodeId } from '../node-id';
import { HandleId } from '~/types/handle-id';
import type { Node } from '@xyflow/react';
import { useNodeResult } from '~/lib/use-node-result';

export type StringNodeType = Node<
  {
    value: string;
  },
  'string'
>;

function _StringNode(props: NodeProps<StringNodeType>) {
  const { selected, id: nodeId, data } = props;
  const { value: defaultValue = '' } = data;

  const [value, setValue] = useState(defaultValue);
  const { updateNodeData } = useReactFlow<StringNodeType>();

  const result = useNodeResult(nodeId);

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    updateNodeData(nodeId, { value: e.target.value });
  };

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
          <ALargeSmallIcon className="size-3.5 stroke-[2.5]" />
        </div>
        <input
          placeholder="Enter text"
          className="w-30 px-2 py-1 font-mono text-sm placeholder:font-sans placeholder:text-zinc-400 focus:outline-none"
          value={value}
          onChange={handleValueChange}
        />
      </div>

      <Handle
        id={HandleId.StringSource}
        type="source"
        position={Position.Right}
        className="size-2.5! border-2! bg-zinc-900!"
      />
    </>
  );
}

export const StringNode = memo(_StringNode);
