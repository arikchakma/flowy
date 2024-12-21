import { Handle, NodeProps, Position, useReactFlow } from '@xyflow/react';
import { CurlyBracesIcon, Parentheses, WifiIcon } from 'lucide-react';
import { memo, useRef, useState } from 'react';
import { cn } from '../../utils/classname';
import { HandleId, RequestMethod, RequestNodeType } from '@flowy/shared';
import { useNodeResult } from '@flowy/react';
import { SelectNative } from '../select';
import { flushSync } from 'react-dom';

function _RequestNode(props: NodeProps<RequestNodeType>) {
  const { selected, id: nodeId, data } = props;

  const { updateNodeData } = useReactFlow<RequestNodeType>();
  const result = useNodeResult(nodeId);

  const { method: _method = 'GET', url: _url = '' } = data;
  const [method, setMethod] = useState<RequestMethod>(_method);
  const [url, setUrl] = useState<string>(_url);

  const urlInputRef = useRef<HTMLInputElement>(null);
  const [isUpdatingUrl, setIsUpdatingUrl] = useState(false);

  return (
    <>
      <div
        className={cn(
          'inset-ring-1 inset-ring-pink-300/20 min-w-52 max-w-52 rounded-xl bg-pink-200 p-1 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-pink-300',
          result?.status === 'running' &&
            'animate-running-node outline-2 outline-offset-1 outline-pink-300'
        )}
      >
        <div className="flex items-center justify-between px-1 py-2 pt-1.5">
          <label className="pointer-events-none block text-sm font-medium leading-none text-pink-700">
            Send Request
          </label>
        </div>

        <div className="rounded-b-xs rounded-lg bg-white p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Method</span>
            <SelectNative
              iconClassName="size-3.5"
              className="h-4 appearance-none border-none !py-0 text-right font-mono text-xs shadow-none"
              value={method}
              onChange={(e) => {
                const newMethod = e.target.value as RequestMethod;
                setMethod(newMethod);
                updateNodeData(nodeId, { method: newMethod });
              }}
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </SelectNative>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <span className="text-xs text-gray-500">URL</span>

            {!isUpdatingUrl && (
              <button
                className="nodrag nopan min-w-0 cursor-pointer truncate pr-1 font-mono text-xs"
                onClick={() => {
                  flushSync(() => {
                    setIsUpdatingUrl(true);
                  });

                  urlInputRef.current?.focus();
                }}
              >
                {url}
              </button>
            )}

            {isUpdatingUrl && (
              <div className="relative grow">
                <form
                  className="absolute inset-0 flex items-center justify-end"
                  onSubmit={(e) => {
                    e.preventDefault();

                    const newUrl = urlInputRef.current?.value || _url;
                    setUrl(newUrl);
                    updateNodeData(nodeId, { url: newUrl });
                    setIsUpdatingUrl(false);
                  }}
                >
                  <input
                    ref={urlInputRef}
                    type="text"
                    className="nodrag nopan max-w-full pr-1 text-right font-mono text-xs caret-pink-800 outline-none focus-visible:outline-none"
                    placeholder="https://arikko.dev/v1/v1-health"
                    onBlur={(e) => {
                      const newUrl = e.target.value || _url;
                      setUrl(newUrl);
                      updateNodeData(nodeId, { url: newUrl });
                      setIsUpdatingUrl(false);
                    }}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xs mt-0.5 bg-white p-2 text-xs shadow">
          <div className="relative flex items-center gap-1">
            <CurlyBracesIcon className="size-2.5 stroke-[2.5]" />
            <span className="leading-none text-gray-500">Headers</span>

            <Handle
              id={HandleId.RequestHeadersTarget}
              type="target"
              position={Position.Left}
              className="size-2.5! -z-10! -translate-x-3! border-none! bg-pink-700!"
            />
          </div>

          {(method === 'POST' || method === 'PUT') && (
            <div className="relative mt-2 flex items-center gap-1">
              <CurlyBracesIcon className="size-2.5 stroke-[2.5]" />
              <span className="leading-none text-gray-500">Body</span>

              <Handle
                id={HandleId.RequestBodyTarget}
                type="target"
                position={Position.Left}
                className="size-2.5! -z-10! -translate-x-3! border-none! bg-pink-700!"
              />
            </div>
          )}
        </div>

        <div className="rounded-t-xs mt-0.5 rounded-lg bg-white/70 p-2 text-xs shadow">
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
        id={HandleId.RequestTarget}
        type="target"
        position={Position.Left}
        className="top-full! -z-10! size-2.5! -translate-y-9.5! border-none! bg-pink-700!"
      />

      <Handle
        id={HandleId.RequestSuccessSource}
        type="source"
        position={Position.Right}
        className="top-full! -z-10! size-2.5! -translate-y-9.5! border-none! bg-pink-700!"
      />
      <Handle
        id={HandleId.RequestFailureSource}
        type="source"
        position={Position.Right}
        className="top-full! -z-10! size-2.5! -translate-y-4.5! border-none! bg-pink-700!"
      />
    </>
  );
}

export const RequestNode = memo(_RequestNode);
