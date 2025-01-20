import { Handle, type NodeProps, Position } from '@xyflow/react';
import { PlusIcon, WifiIcon, XIcon } from 'lucide-react';
import { memo, useState } from 'react';
import { nanoid } from 'nanoid';
import { flushSync } from 'react-dom';

import { cn } from '~/utils/classname';
import { useNodeResult } from '~/lib/use-node-result';
import { HandleId } from '~/types/handle-id';
import type { Node } from '@xyflow/react';

export type RecordNodeType = Node<
  {
    /**
     * The values will be stored in a map where the key is the name of the
     * value and the value is the handle id where the value is stored.
     */
    values: {
      key: string;
      handleId: string;
    }[];
  },
  'record'
>;

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
          'min-w-52 rounded-xl bg-violet-200 p-1 inset-ring-1 inset-ring-violet-300/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-violet-300',
          result?.status === 'running' &&
            'animate-running-node outline-2 outline-offset-1 outline-violet-300'
        )}
      >
        <div className="flex items-center justify-between px-1 py-2 pt-1.5">
          <label className="pointer-events-none block text-sm leading-none font-medium text-violet-700">
            Record
          </label>
        </div>

        <div className="rounded-lg rounded-b-xs bg-white p-2">
          <div className="flex flex-col divide-y divide-zinc-200">
            {values.map((value, index) => {
              const { key, handleId } = value;
              const isLast = index === values.length - 1;
              const isFirst = index === 0;

              return (
                <div
                  key={handleId}
                  className={cn(
                    'nodrag relative py-1.5',
                    isFirst && 'pt-0',
                    isLast && 'pb-0'
                  )}
                >
                  <div className="flex items-center gap-1">
                    <div
                      className="nodrag max-w-52 grow cursor-text font-mono text-xs leading-none break-words outline-none"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      dangerouslySetInnerHTML={{ __html: key }}
                      spellCheck={false}
                      onBlur={(e) => {
                        const newKey = e.currentTarget.textContent || '';
                        setValues((values) =>
                          values.map((value) =>
                            value.handleId === handleId
                              ? { ...value, key: newKey }
                              : value
                          )
                        );
                      }}
                      data-handle-id={handleId}
                    ></div>

                    <div className="ml-auto flex shrink-0 items-center gap-0.5">
                      <button
                        className="flex size-4 cursor-pointer items-center justify-center rounded-md text-violet-300 hover:bg-violet-100 hover:text-violet-700"
                        onClick={() => {
                          setValues((values) =>
                            values.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <XIcon className="size-2.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                  <Handle
                    id={handleId}
                    type="target"
                    position={Position.Left}
                    className="-z-10 size-2.5! -translate-x-3 border-none! bg-violet-700!"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-0.5 rounded-lg rounded-t-xs bg-white/70 p-2 text-xs shadow">
          <div className="flex items-center justify-between gap-1">
            <button
              className="flex size-4 cursor-pointer items-center justify-center rounded-md text-violet-600 hover:bg-violet-200 hover:text-violet-700"
              onClick={() => {
                const handleId = nanoid(4);
                flushSync(() =>
                  setValues((values) => [
                    ...values,
                    {
                      key: '',
                      handleId,
                    },
                  ])
                );

                const handle = document.querySelector(
                  `[data-handle-id="${handleId}"]`
                ) as HTMLElement;

                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(handle);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);

                handle?.focus();
              }}
            >
              <PlusIcon className="size-2.5 rotate-90 stroke-[2.5]" />
            </button>

            <div className="relative flex items-center justify-end gap-1">
              <WifiIcon className="size-2.5 rotate-90 stroke-[2.5]" />
              <span className="leading-none">Send</span>

              <Handle
                id={HandleId.RecordSource}
                type="source"
                position={Position.Right}
                className="-z-10 size-2.5! translate-x-3 border-none! bg-violet-700!"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const RecordNode = memo(_RecordNode);
