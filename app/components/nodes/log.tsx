import { Handle, type Node, type NodeProps, Position } from '@xyflow/react';
import { Parentheses } from 'lucide-react';
import { memo } from 'react';
import { cn } from '../../utils/classname';
import { NodeId } from '../node-id';
import { HandleId } from '~/types/handle-id';

export type LogNodeType = Node<{}, 'log'>;

function _LogNode(props: NodeProps<LogNodeType>) {
  const { selected, id: nodeId } = props;

  return (
    <>
      <NodeId nodeId={nodeId} />
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-2 text-white shadow-sm inset-ring-1 inset-ring-zinc-200/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-zinc-400'
        )}
      >
        <Parentheses className="size-3.5 stroke-[2.5]" />
        <span className="text-sm leading-none font-medium">Log</span>
      </div>

      <Handle
        id={HandleId.LogTarget}
        type="target"
        position={Position.Left}
        className="size-2.5! border-2! bg-zinc-900!"
      />
    </>
  );
}

export const LogNode = memo(_LogNode);
