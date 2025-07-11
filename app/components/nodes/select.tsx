import { Handle, type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { LinkIcon } from 'lucide-react';
import { type ChangeEvent, memo, useEffect, useState } from 'react';
import { cn } from '~/utils/classname';
import { NodeId } from '../node-id';
import { HandleId } from '~/types/handle-id';
import type { Node } from '@xyflow/react';

export type SelectNodeType = Node<
  {
    path: string;
  },
  'select'
>;

function _SelectNode(props: NodeProps<SelectNodeType>) {
  const { selected, id: nodeId, data } = props;
  const { path = '' } = data;

  const [selectPath, setSelectPath] = useState(path);
  const { updateNodeData } = useReactFlow<SelectNodeType>();

  const handlePathChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectPath(e.target.value);
    updateNodeData(nodeId, { path: e.target.value });
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
        <div className="flex h-[30px] shrink-0 items-center justify-center bg-zinc-800 p-2 pl-2.5">
          <LinkIcon className="size-3.5 stroke-[2.5]" />
        </div>
        <input
          placeholder="Enter path"
          className="w-30 px-2 py-1 font-mono text-sm placeholder:font-sans placeholder:text-zinc-400 focus:outline-none"
          value={selectPath}
          onChange={handlePathChange}
        />
      </div>

      <Handle
        id={HandleId.SelectTarget}
        type="target"
        position={Position.Left}
        className="size-2.5! border-2! bg-zinc-900!"
      />
      <Handle
        id={HandleId.SelectSource}
        type="source"
        position={Position.Right}
        className="size-2.5! border-2! bg-zinc-900!"
      />
    </>
  );
}

export const SelectNode = memo(_SelectNode);
