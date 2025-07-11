import {
  Handle,
  type NodeProps,
  Position,
  useNodeConnections,
  useReactFlow,
} from '@xyflow/react';
import { DatabaseIcon, HeadingIcon, Parentheses, WifiIcon } from 'lucide-react';
import { memo, useRef, useState } from 'react';
import { SelectNative } from '../select';
import { flushSync } from 'react-dom';
import { cn } from '~/utils/classname';
import { HandleId } from '~/types/handle-id';
import type { Node } from '@xyflow/react';
import { NodeId } from '../node-id';
import { useNodeResult } from '~/lib/use-node-result';

export const allowedRequestMethods = ['GET', 'POST', 'PUT', 'DELETE'] as const;
export type RequestMethod = (typeof allowedRequestMethods)[number];

export type RequestNodeType = Node<
  {
    /**
     * The method to use for the request. This can be one of the following:
     * - `"GET"`
     * - `"POST"`
     * - `"PUT"`
     * - `"DELETE"`
     *
     * If not provided, this defaults to `"GET"`.
     */
    method?: RequestMethod;

    /**
     * The URL to send the request to with the method specified.
     * @example `"https://arikko.dev/v1/v1-health"`
     */
    url: string;

    /**
     * The headers to send with the request. This values will be sent as is.
     * They will be added via the Record node.
     *
     * @example `{ "Content-Type": "application/json" }`
     * @default `{}`
     */
    headers?: Record<string, any>;

    /**
     * The body to send with the request. This values will be sent as is.
     * They will be added via the Record node. This is only used for methods
     * that support a body. Like `"POST"` and `"PUT"`.
     *
     * @example `{ "key": "value" }`
     * @default `{}`
     */
    body?: Record<string, any>;
  },
  'request'
>;

function _RequestNode(props: NodeProps<RequestNodeType>) {
  const { selected, id: nodeId, data } = props;

  const { updateNodeData } = useReactFlow<RequestNodeType>();

  const { method: _method = 'GET', url: _url = '' } = data;
  const [method, setMethod] = useState<RequestMethod>(_method);
  const [url, setUrl] = useState<string>(_url);

  const urlInputRef = useRef<HTMLInputElement>(null);
  const [isUpdatingUrl, setIsUpdatingUrl] = useState(false);

  const result = useNodeResult(nodeId);
  console.log('-'.repeat(20));
  console.log('~ RequestNode result:', result);
  console.log('-'.repeat(20));

  const isHeadersConnected =
    useNodeConnections({
      id: nodeId,
      handleType: 'target',
      handleId: HandleId.RequestHeadersTarget,
    }).length > 0;

  const isBodyConnected =
    useNodeConnections({
      id: nodeId,
      handleType: 'target',
      handleId: HandleId.RequestBodyTarget,
    }).length > 0;

  return (
    <>
      <NodeId nodeId={nodeId} />
      <div
        className={cn(
          'max-w-52 min-w-52 rounded-xl bg-pink-200 p-1 inset-ring-1 inset-ring-pink-300/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-pink-300',
          result?.status === 'running' &&
            'animate-running-node outline-2 outline-offset-1 outline-pink-300'
        )}
      >
        <div className="flex items-center justify-between px-1 py-2 pt-1.5">
          <label className="pointer-events-none block text-sm leading-none font-medium text-pink-700">
            Send Request
          </label>
        </div>

        <div className="rounded-lg rounded-b-xs bg-white p-2">
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

        <div className="mt-0.5 rounded-xs bg-white p-2 text-xs shadow">
          <div className="relative flex items-center gap-1">
            <HeadingIcon className="size-2.5 stroke-[2.5]" />
            <span className="leading-none text-gray-500">Headers</span>

            <Handle
              id={HandleId.RequestHeadersTarget}
              type="target"
              position={Position.Left}
              className="-z-10! size-2.5! -translate-x-3! border-none! bg-pink-700!"
              isConnectable={!isHeadersConnected}
            />
          </div>

          {(method === 'POST' || method === 'PUT') && (
            <div className="relative mt-2 flex items-center gap-1">
              <DatabaseIcon className="size-2.5 stroke-[2.5]" />
              <span className="leading-none text-gray-500">Body</span>

              <Handle
                id={HandleId.RequestBodyTarget}
                type="target"
                position={Position.Left}
                className="-z-10! size-2.5! -translate-x-3! border-none! bg-pink-700!"
                isConnectable={!isBodyConnected}
              />
            </div>
          )}
        </div>

        <div className="mt-0.5 rounded-lg rounded-t-xs bg-white/70 p-2 text-xs shadow">
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
