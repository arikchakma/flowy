import { useCallback, useSyncExternalStore } from 'react';
import { WorkflowEngine, type WorkflowResults } from './workflow-engine';
import { useWorkflowEngine } from './workflow-engine-provider';

export type UseNodeResults<R = unknown> = (
  workflowEngine?: WorkflowEngine
) => WorkflowResults;

export const useNodeResults: UseNodeResults = (workflowEngine) => {
  const engine = useWorkflowEngine(workflowEngine);
  return useSyncExternalStore(
    useCallback((onStoreChange) => engine.subscribe(onStoreChange), [engine]),
    () => engine.getAll(),
    () => engine.getAll()
  );
};
