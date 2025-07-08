import {
  Handle,
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { ArrowUp10Icon, InfinityIcon } from 'lucide-react';
import { memo, useRef, useState } from 'react';
import { cn } from '~/lib/classname';
import { HandleId } from '~/lib/handles';

export type LoopRepeatType = 'indefinite' | number;

export type RepeatNodeType = Node<
  {
    /**
     * The number of times to repeat the animation before stopping. If set to
     * `"indefinite"`, the animation will repeat indefinitely.
     *
     * If not provided, this defaults to `"indefinite"`.
     */
    repeat?: LoopRepeatType;
  },
  'repeat'
>;

function _RepeatNode(props: NodeProps<RepeatNodeType>) {
  const { selected, id: nodeId, data } = props;

  const { updateNodeData } = useReactFlow<RepeatNodeType>();
  const { repeat = 'indefinite' } = data ?? {};

  const inputRef = useRef<HTMLInputElement>(null);
  const [repeatCount, setRepeatCount] = useState<LoopRepeatType>(repeat);
  const isIndefinite = repeatCount === 'indefinite';

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-lg bg-zinc-900 p-0.5 text-white inset-ring-1 shadow-sm inset-ring-zinc-200/20 transition-shadow',
          !selected && 'hover:shadow-md',
          selected && 'outline-1 outline-offset-1 outline-zinc-400'
        )}
      >
        <button
          className={cn(
            'flex aspect-square size-6.5 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400',
            isIndefinite && 'bg-zinc-100/20 text-white'
          )}
          onClick={() => {
            setRepeatCount('indefinite');
            updateNodeData(nodeId, { repeat: 'indefinite' });
          }}
        >
          <InfinityIcon className="size-4" />
        </button>
        <div className="flex shrink-0 items-stretch">
          <button
            className={cn(
              'flex aspect-square size-6.5 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400',
              !isIndefinite &&
                'cursor-default rounded-r-none bg-zinc-100/20 text-white'
            )}
            onClick={() => {
              setRepeatCount(1);
              updateNodeData(nodeId, { repeat: 1 });
              inputRef?.current?.focus();
            }}
          >
            <ArrowUp10Icon className="size-4" />
          </button>
          <input
            type="number"
            min={1}
            ref={inputRef}
            className={cn(
              'hide-number-controls w-0 shrink-0 appearance-none rounded-r-md text-sm tabular-nums transition-[width] duration-150 focus-visible:outline-none',
              !isIndefinite && 'w-7 bg-zinc-100/20 px-1 text-white'
            )}
            value={isIndefinite ? '' : repeatCount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setRepeatCount('indefinite');
                updateNodeData(nodeId, { repeat: 'indefinite' });
                return;
              }

              setRepeatCount(parseInt(value, 10));
              updateNodeData(nodeId, { repeat: parseInt(value, 10) });
            }}
          />
        </div>
      </div>

      <Handle
        id={HandleId.RepeatTarget}
        type="target"
        position={Position.Left}
        className="size-2.5! border-2! bg-zinc-900!"
      />
      <Handle
        id={HandleId.RepeatSource}
        type="source"
        position={Position.Right}
        className="size-2.5! border-2! bg-zinc-900!"
      />
    </>
  );
}

export const RepeatNode = memo(_RepeatNode);
