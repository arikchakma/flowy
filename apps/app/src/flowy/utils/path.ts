import {
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  Position,
} from '@xyflow/react';

export type DefaultEdgeType = 'bezier' | 'smoothstep' | 'step' | 'straight';

/**
 * Chooses which of React Flow's edge path algorithms to use based on the provided
 * `type`.
 */
export function getPath({
  type,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: {
  type: DefaultEdgeType;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
}) {
  switch (type) {
    case 'bezier':
      return getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
      });

    case 'smoothstep':
      return getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
      });

    case 'step':
      return getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        borderRadius: 0,
      });

    case 'straight':
      return getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
  }
}
