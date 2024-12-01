import {
  BaseEdge,
  Edge,
  EdgeLabelRenderer,
  EdgeTypes,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import { DefaultEdgeType, getPath } from '../../utils/path';
import { XIcon } from 'lucide-react';

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
  repeat?: number | 'indefinite';
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

  const { setEdges, updateEdgeData } = useReactFlow();
  const [edgePath, labelX, labelY] = getPath({
    type: data?.path ?? 'bezier',
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  console.log('data', data);

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
          <button
            className="flex size-5 cursor-pointer items-center justify-center rounded-full bg-zinc-900 text-white"
            onClick={onEdgeClick}
          >
            <XIcon size={16} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
