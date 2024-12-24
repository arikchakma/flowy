import { Handle, type NodeProps, Position } from '@xyflow/react';
import { TargetIcon } from 'lucide-react';
import { memo } from 'react';
import { cn } from '../../utils/classname';
import { HandleId, type TriggerNodeType } from '@flowy/shared';

function _TriggerNode(props: NodeProps<TriggerNodeType>) {
  const { selected, id: nodeId } = props;

  return (
    <>
      <div
        className={cn(
          'inset-ring-1 inset-ring-zinc-200/20 flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-2 pr-4 text-white shadow-sm transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-zinc-400'
        )}
      >
        <TargetIcon className="size-3.5 stroke-[2.5]" />
        <span className="text-sm font-medium leading-none">Trigger</span>
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
