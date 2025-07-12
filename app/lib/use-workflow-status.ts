import { useCallback, useSyncExternalStore } from 'react';
import { WorkflowEngine, type Status } from './workflow-engine';
import { useWorkflowEngine } from './workflow-engine-provider';

export type UseWorkflowStatus = (workflowEngine?: WorkflowEngine) => Status;

export const useWorkflowStatus: UseWorkflowStatus = (workflowEngine) => {
  const engine = useWorkflowEngine(workflowEngine);
  return useSyncExternalStore(
    useCallback((onStoreChange) => engine.subscribe(onStoreChange), [engine]),
    () => engine.status,
    () => engine.status
  );
};
