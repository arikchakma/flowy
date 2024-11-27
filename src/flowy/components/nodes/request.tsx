import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
} from '@xyflow/react';
import { Parentheses, PencilIcon, WifiIcon } from 'lucide-react';
import { memo, useCallback, useEffect } from 'react';
import { cn } from '../../utils/classname';
import { HandleId } from '../../types';
import { RunningStep, useFlowyStore } from '../../stores/flowy-store';

export type RequestNode = Node<{}, 'request'>;

function _RequestNode(props: NodeProps<RequestNode>) {
  const { status, getStep, removeStep, addStep, steps, updateStep } =
    useFlowyStore();

  const { selected, id: nodeId } = props;

  const parentNodes = useHandleConnections({
    type: 'target',
    id: HandleId.RequestTarget,
    nodeId,
  });
  const successLeafNodes = useHandleConnections({
    type: 'source',
    id: HandleId.RequestSuccessSource,
    nodeId,
  });
  const failureLeafNodes = useHandleConnections({
    type: 'source',
    id: HandleId.RequestFailureSource,
    nodeId,
  });

  const handleRequest = useCallback(async () => {
    for (const parentNode of parentNodes) {
      const step = getStep(nodeId, parentNode.source);
      if (!step || step.status !== 'idle') {
        continue;
      }

      // DO SOME MAGIC

      updateStep(nodeId, parentNode.source, { status: 'running' });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = Math.random() > 0.5 ? 'success' : 'failure';

      const steps: RunningStep[] = (
        result === 'success' ? successLeafNodes : failureLeafNodes
      ).map((connection) => ({
        status: 'idle',
        nodeId: connection.target,
        parentId: nodeId,

        ...(result === 'success'
          ? { data: { success: true }, error: undefined }
          : {
              data: undefined,
              error: {
                message: 'Failed to send request',
              },
            }),
      }));

      addStep(steps);
      removeStep(nodeId, parentNode.source);
    }
  }, [parentNodes, successLeafNodes, failureLeafNodes, steps]);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    handleRequest();
  }, [status, steps]);

  return (
    <>
      <div
        className={cn(
          'max-w-52 min-w-52 rounded-xl bg-pink-200 p-1 inset-ring-1 inset-ring-pink-300/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-pink-300'
        )}
      >
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
            <span className="font-mono text-xs">GET</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <span className="text-xs text-gray-500">URL</span>
            <span className="min-w-0 truncate font-mono text-xs">
              https://arikko.dev/v1/v1-health
            </span>
          </div>
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
