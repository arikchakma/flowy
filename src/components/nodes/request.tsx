import { Handle, Position } from '@xyflow/react';
import { Parentheses, Pencil, PencilIcon, WifiIcon } from 'lucide-react';
import { memo } from 'react';

function _RequestNode() {
  return (
    <>
      <div className="max-w-52 min-w-52 rounded-xl bg-pink-200 p-1">
        <div className="flex items-center justify-between px-1 py-2 pt-1.5">
          <label className="pointer-events-none block text-sm leading-none font-medium text-pink-700">
            Send Request
          </label>

          <button className="flex size-4.5 cursor-pointer items-center justify-center rounded-md text-pink-700 opacity-60 transition-colors hover:bg-pink-300 hover:opacity-100">
            <PencilIcon className="size-2.5 stroke-[2.5]" />
          </button>
        </div>

        <div className="rounded-lg rounded-b-xs bg-white p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Method</span>
            <span className="text-xs">GET</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <span className="text-xs text-gray-500">URL</span>
            <span className="min-w-0 truncate text-xs">
              https://arikko.dev/v1/v1-health
            </span>
          </div>
        </div>

        <div className="mt-0.5 rounded-lg rounded-t-xs bg-white p-2 text-xs shadow">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <WifiIcon className="size-2.5 rotate-90 stroke-[2.5]" />
              <span className="leading-none text-gray-500">Send</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="leading-none text-gray-500">Success</span>
              <Parentheses className="size-2.5 stroke-[2.5]" />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-1">
            <div className="flex items-center gap-1">
              <span className="leading-none text-gray-500">Failure</span>
              <Parentheses className="size-2.5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>

      <Handle
        id="w1"
        type="target"
        position={Position.Left}
        className="top-full! -z-10! size-2.5! -translate-y-9.5! border-none! bg-pink-700!"
      />

      <Handle
        id="w2"
        type="source"
        position={Position.Right}
        className="top-full! -z-10! size-2.5! -translate-y-9.5! border-none! bg-pink-700!"
      />
      <Handle
        id="x2"
        type="source"
        position={Position.Right}
        className="top-full! -z-10! size-2.5! -translate-y-4.5! border-none! bg-pink-700!"
      />
    </>
  );
}

export const RequestNode = memo(_RequestNode);
