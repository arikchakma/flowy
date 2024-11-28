import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
} from '@xyflow/react';
import { TargetIcon } from 'lucide-react';
import { memo, useEffect } from 'react';
import { HandleId } from '../../types';
import { cn } from '../../utils/classname';
import { useFlowyStore } from '../../stores/flowy-store';

export type TriggerNode = Node<{}, 'trigger'>;

function _TriggerNode(props: NodeProps<TriggerNode>) {
  const { status } = useFlowyStore();

  const { selected, id: nodeId } = props;

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-2 pr-4 text-white inset-ring-1 shadow-sm inset-ring-zinc-200/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-zinc-400'
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
