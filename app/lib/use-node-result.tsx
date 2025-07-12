import { useCallback, useSyncExternalStore } from 'react';
import { WorkflowEngine, type StepResult } from './workflow-engine';
import { useWorkflowEngine } from './workflow-engine-provider';

export type UseNodeResult<R = unknown> = (
  nodeId: string,
  workflowEngine?: WorkflowEngine
) => StepResult<R> | undefined;

export const useNodeResult: UseNodeResult = (nodeId, workflowEngine) => {
  const engine = useWorkflowEngine(workflowEngine);
  return useSyncExternalStore(
    useCallback((onStoreChange) => engine.subscribe(onStoreChange), [engine]),
    () => engine.get(nodeId),
    () => engine.get(nodeId)
  );
};
