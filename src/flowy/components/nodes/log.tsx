import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';
import { Parentheses } from 'lucide-react';
import { memo, useCallback, useEffect } from 'react';
import { HandleId } from '../../types';
import { cn } from '../../utils/classname';
import { useFlowyStore } from '../../stores/flowy-store';

export type LogNode = Node<{}, 'log'>;

function _LogNode(props: NodeProps<LogNode>) {
  const { status, getStep, removeStep, steps, updateStep } = useFlowyStore();

  const { selected, id: nodeId } = props;

  const parentNodes = useHandleConnections({
    type: 'target',
    id: HandleId.LogTarget,
    nodeId,
  });

  const handleLog = useCallback(async () => {
    for (const parentNode of parentNodes) {
      const step = getStep(nodeId, parentNode.source);
      if (!step || step.status !== 'idle') {
        continue;
      }

      updateStep(nodeId, parentNode.source, { status: 'running' });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('LOGGING STEP', step);
      removeStep(nodeId, parentNode.source);
    }
  }, [parentNodes, steps]);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    handleLog();
  }, [status, steps]);

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-2 text-white inset-ring-1 shadow-sm inset-ring-zinc-200/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-zinc-400'
        )}
      >
        <Parentheses className="size-3.5 stroke-[2.5]" />
        <span className="text-sm leading-none font-medium">Log Result</span>
      </div>

      <Handle
        id={HandleId.LogTarget}
        type="target"
        position={Position.Left}
        className="size-2.5! border-2! bg-zinc-900!"
      />
    </>
  );
}

export const LogNode = memo(_LogNode);
