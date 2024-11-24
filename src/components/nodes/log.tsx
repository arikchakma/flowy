import { Handle, Position } from '@xyflow/react';
import { Parentheses } from 'lucide-react';
import { memo } from 'react';

function _LogNode() {
  return (
    <>
      <div className="flex items-center gap-1.5 rounded-full bg-zinc-900 p-2 px-2.5 text-white shadow-md">
        <Parentheses className="size-3.5 stroke-[2.5]" />
        <span className="leading-none">Log Result</span>
      </div>

      <Handle
        id="w1"
        type="target"
        position={Position.Left}
        className="size-2.5! border-2! bg-zinc-900!"
      />
    </>
  );
}

export const LogNode = memo(_LogNode);
