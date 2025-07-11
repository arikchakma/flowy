import { Handle, type NodeProps, Position } from '@xyflow/react';
import { TargetIcon } from 'lucide-react';
import { memo } from 'react';
import { cn } from '~/utils/classname';
import { NodeId } from '../node-id';
import { HandleId } from '~/types/handle-id';
import type { Node } from '@xyflow/react';
import { useNodeResult } from '~/lib/use-node-result';

export type TriggerNodeType = Node<{}, 'trigger'>;

function _TriggerNode(props: NodeProps<TriggerNodeType>) {
  const { selected, id: nodeId } = props;

  const result = useNodeResult(nodeId);

  return (
    <>
      <NodeId nodeId={nodeId} />
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-2 pr-4 text-white shadow-sm inset-ring-1 inset-ring-zinc-200/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-zinc-400',
          result?.status === 'running' &&
            'animate-running-node outline-2 outline-offset-1 outline-zinc-400'
        )}
      >
        <TargetIcon className="size-3.5 stroke-[2.5]" />
        <span className="text-sm leading-none font-medium">Trigger</span>
      </div>

      <Handle
        id={HandleId.TriggerSource}
        type="source"
        position={Position.Right}
        className="size-2.5! border-2! bg-zinc-900!"
      />
    </>
  );
}

export const TriggerNode = memo(_TriggerNode);
