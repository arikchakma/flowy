import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
} from '@xyflow/react';
import {
  Parentheses,
  PencilIcon,
  PlusIcon,
  WifiIcon,
  XIcon,
} from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { cn } from '../../utils/classname';
import { HandleId, RecordNodeType } from '@flowy/shared';
import { useNodeResult } from '@flowy/react';
import { nanoid } from 'nanoid';

function _RecordNode(props: NodeProps<RecordNodeType>) {
  const { selected, id: nodeId, data } = props;

  const result = useNodeResult(nodeId);

  const { values: initialValues = [] } = data;
  const [values, setValues] =
    useState<RecordNodeType['data']['values']>(initialValues);

  return (
    <>
      <div
        className={cn(
          'inset-ring-1 inset-ring-violet-300/20 min-w-52 max-w-52 rounded-xl bg-violet-200 p-1 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-violet-300',
          result?.status === 'running' &&
            'animate-running-node outline-2 outline-offset-1 outline-violet-300'
        )}
      >
        <div className="flex items-center justify-between px-1 py-2 pt-1.5">
          <label className="pointer-events-none block text-sm font-medium leading-none text-violet-700">
            Record
          </label>
        </div>

        <div className="rounded-b-xs rounded-lg bg-white p-2">
          <div className="flex flex-col divide-y divide-zinc-200">
            {values.map((value, index) => {
              const { key, handleId } = value;
              const isLast = index === values.length - 1;
              const isFirst = index === 0;

              return (
                <div
                  key={key}
                  className={cn(
                    'relative py-1.5',
                    isFirst && 'pt-0',
                    isLast && 'pb-0'
                  )}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono leading-none grow">
                      {key}
                    </span>

                    <div className="flex items-center gap-0.5">
                      <button className="size-4 rounded-md flex items-center justify-center text-violet-300 hover:bg-violet-100 hover:text-violet-700 cursor-pointer">
                        <XIcon className="size-2.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                  <Handle
                    id={handleId}
                    type="target"
                    position={Position.Left}
                    className="size-2.5! border-none! bg-violet-700! -z-10 -translate-x-3"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-0.5 rounded-lg rounded-t-xs bg-white/70 p-2 text-xs shadow">
          <div className="flex items-center justify-end gap-1 relative">
            <WifiIcon className="size-2.5 rotate-90 stroke-[2.5]" />
            <span className="leading-none">Send</span>

            <Handle
              id={HandleId.RequestTarget}
              type="source"
              position={Position.Right}
              className="size-2.5! border-none! bg-violet-700! -z-10 translate-x-3"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export const RecordNode = memo(_RecordNode);
