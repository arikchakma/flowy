import {
  Handle,
  Node,
  NodeProps,
  Position,
  useHandleConnections,
} from '@xyflow/react';
import { LinkIcon } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { HandleId } from '../../types';
import { cn } from '../../utils/classname';
import { RunningStep, useFlowyStore } from '../../stores/flowy-store';
import { getProperty } from 'dot-prop';

export type SelectNode = Node<{}, 'select'>;

function _SelectNode(props: NodeProps<SelectNode>) {
  const { status, getStep, removeStep, addStep, steps, updateStep } =
    useFlowyStore();

  const { selected, id: nodeId } = props;
  const [selectPath, setSelectPath] = useState('');

  const parentNodes = useHandleConnections({
    type: 'target',
    id: HandleId.SelectTarget,
    nodeId,
  });

  const leafNodes = useHandleConnections({
    type: 'source',
    id: HandleId.SelectSource,
    nodeId,
  });

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    for (const parentNode of parentNodes) {
      const step = getStep(nodeId, parentNode.source);
      if (!step || step.status !== 'idle') {
        continue;
      }

      updateStep(nodeId, parentNode.source, { status: 'running' });

      const value = getProperty(step, selectPath);
      const steps: RunningStep[] = leafNodes.map((connection) => ({
        status: 'idle',
        nodeId: connection.target,
        parentId: nodeId,
        data: value,
      }));

      addStep(steps);
      removeStep(nodeId, parentNode.source);
    }
  }, [status, parentNodes, leafNodes, selectPath, steps]);

  return (
    <>
      <div
        className={cn(
          'flex items-stretch overflow-hidden rounded-full bg-zinc-900 text-white inset-ring-1 shadow-sm inset-ring-zinc-200/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-zinc-400'
        )}
      >
        <div className="flex h-[30px] shrink-0 items-center justify-center bg-zinc-800 p-2 pl-2.5">
          <LinkIcon className="size-3.5 stroke-[2.5]" />
        </div>
        <input
          placeholder="Enter path"
          className="w-30 px-2 py-1 font-mono text-sm placeholder:font-sans placeholder:text-zinc-400 focus:outline-none"
          value={selectPath}
          onChange={(e) => setSelectPath(e.target.value)}
        />
      </div>

      <Handle
        id={HandleId.SelectTarget}
        type="target"
        position={Position.Left}
        className="size-2.5! border-2! bg-zinc-900!"
      />
      <Handle
        id={HandleId.SelectSource}
        type="source"
        position={Position.Right}
        className="size-2.5! border-2! bg-zinc-900!"
      />
    </>
  );
}

export const SelectNode = memo(_SelectNode);
