import {
  BaseEdge,
  Edge,
  EdgeLabelRenderer,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import { DefaultEdgeType, getPath } from '../../utils/path';
import { ArrowUp10Icon, InfinityIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '../../utils/classname';

export type LoopRepeatType = 'indefinite' | number;

export type LoopCountEdge = Edge<{
  /**
   * Which of React Flow's path algorithms to use. Each value corresponds to one
   * of React Flow's built-in edge types.
   *
   * If not provided, this defaults to `"bezier"`.
   */
  path?: DefaultEdgeType;
  /**
   * The number of times to repeat the animation before stopping. If set to
   * `"indefinite"`, the animation will repeat indefinitely.
   *
   * If not provided, this defaults to `"indefinite"`.
   */
  repeat?: LoopRepeatType;
}>;

export function LoopCountEdge(props: EdgeProps<LoopCountEdge>) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,

    data,
  } = props;

  const { updateEdgeData } = useReactFlow();
  const [edgePath, labelX, labelY] = getPath({
    type: data?.path ?? 'bezier',
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { repeat = 'indefinite' } = data ?? {};

  const inputRef = useRef<HTMLInputElement>(null);
  const [repeatCount, setRepeatCount] = useState<LoopRepeatType>(repeat);
  const isIndefinite = repeatCount === 'indefinite';

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <div className="flex items-center rounded-lg bg-zinc-900 p-0.5 text-white">
            <button
              className={cn(
                'flex aspect-square size-5 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400',
                isIndefinite && 'bg-zinc-100/20 text-white'
              )}
              disabled={isIndefinite}
              onClick={() => {
                setRepeatCount('indefinite');
                updateEdgeData(id, { repeat: 'indefinite' });
              }}
            >
              <InfinityIcon className="size-3.5" />
            </button>
            <div className="flex shrink-0 items-stretch">
              <button
                className={cn(
                  'flex aspect-square size-5 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400',
                  !isIndefinite &&
                    'cursor-default rounded-r-none bg-zinc-100/20 text-white'
                )}
                disabled={!isIndefinite}
                onClick={() => {
                  setRepeatCount(1);
                  updateEdgeData(id, { repeat: 1 });
                  inputRef?.current?.focus();
                }}
              >
                <ArrowUp10Icon className="size-3.5" />
              </button>
              <input
                type="number"
                min={1}
                ref={inputRef}
                className={cn(
                  'hide-number-controls w-0 shrink-0 appearance-none rounded-r-md text-[13px] tabular-nums transition-[width] duration-150 focus-visible:outline-none',
                  !isIndefinite && 'w-7 bg-zinc-100/20 px-1 text-white'
                )}
                value={isIndefinite ? '' : repeatCount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setRepeatCount('indefinite');
                    updateEdgeData(id, { repeat: 'indefinite' });
                    return;
                  }

                  setRepeatCount(parseInt(value, 10));
                  updateEdgeData(id, { repeat: parseInt(value, 10) });
                }}
              />
            </div>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
