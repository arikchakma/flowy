import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { LinkIcon } from 'lucide-react';
import { memo } from 'react';
import { HandleId } from '../../utils/contants';
import { cn } from '../../utils/classname';

export type SelectNode = Node<{}, 'select'>;

function _SelectNode(props: NodeProps<SelectNode>) {
  const { selected } = props;

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
          <LinkIcon className="size-3.5 stroke-[2.5]" />
        </div>
        <input
          placeholder="Enter path"
          className="w-28 px-2 py-1 font-mono text-sm placeholder:font-sans placeholder:text-zinc-400 focus:outline-none"
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
