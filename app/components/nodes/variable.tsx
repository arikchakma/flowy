import { Handle, type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { ALargeSmallIcon, WifiIcon } from 'lucide-react';
import { type ChangeEvent, memo, useState } from 'react';
import { cn } from '~/utils/classname';
import { NodeId } from '../node-id';
import { HandleId } from '~/types/handle-id';
import type { Node } from '@xyflow/react';

export type VariableNodeType = Node<
  {
    name: string;
  },
  'variable'
>;

function _VariableNode(props: NodeProps<VariableNodeType>) {
  const { selected, id: nodeId, data } = props;
  const { name: defaultName = '' } = data;

  const [name, setName] = useState(defaultName);
  const { updateNodeData } = useReactFlow<VariableNodeType>();

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    updateNodeData(nodeId, { name: e.target.value });
  };

  return (
    <>
      <NodeId nodeId={nodeId} />
      <div
        className={cn(
          'flex items-stretch overflow-hidden rounded-full bg-zinc-900 text-white shadow-sm inset-ring-1 inset-ring-zinc-200/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-zinc-400'
        )}
      >
        <input
          placeholder="Enter text"
          className="w-30 px-2 py-1 pl-3 font-mono text-sm placeholder:font-sans placeholder:text-zinc-400 focus:outline-none"
          value={name}
          onChange={handleValueChange}
        />
        <div className="flex h-[30px] shrink-0 items-center justify-center bg-zinc-800 p-2 pr-2.5">
          <WifiIcon className="size-3.5 rotate-90 stroke-[2.5]" />
        </div>
      </div>

      <Handle
        id={HandleId.VariableTarget}
        type="target"
        position={Position.Left}
        className="size-2.5! border-2! bg-zinc-900!"
      />
      <Handle
        id={HandleId.VariableSource}
        type="source"
        position={Position.Right}
        className="size-2.5! border-2! bg-zinc-900!"
      />
    </>
  );
}

export const VariableNode = memo(_VariableNode);
