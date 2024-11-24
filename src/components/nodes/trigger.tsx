import { Handle, Position } from '@xyflow/react';
import { TargetIcon } from 'lucide-react';
import { memo } from 'react';

function _TriggerNode() {
  return (
    <>
      <div className="flex items-center gap-1.5 rounded-full bg-zinc-900 p-2 px-2.5 pr-4 text-white inset-ring-1 shadow-sm inset-ring-zinc-200/20">
        <TargetIcon className="size-3.5 stroke-[2.5]" />
        <span className="text-sm leading-none font-medium">Trigger</span>
      </div>

      <Handle
        id="w2"
        type="source"
        position={Position.Right}
        className="size-2.5! border-2! bg-zinc-900!"
      />
    </>
  );
}

export const TriggerNode = memo(_TriggerNode);
