import { createContext, type PropsWithChildren, useContext } from 'react';
import { WorkflowEngine } from './workflow-engine';

export const WorkflowEngineContext = createContext<WorkflowEngine | null>(null);

type WorkflowEngineProviderProps = PropsWithChildren<{
  engine: WorkflowEngine;
}>;

export function WorkflowEngineProvider(props: WorkflowEngineProviderProps) {
  const { children, ...defaultValues } = props;

  return (
    <WorkflowEngineContext.Provider value={defaultValues.engine}>
      {children}
    </WorkflowEngineContext.Provider>
  );
}

export function useWorkflowEngine(workflowEngine?: WorkflowEngine) {
  if (workflowEngine) {
    return workflowEngine;
  }

  const engine = useContext(WorkflowEngineContext);
  if (!engine) {
    throw new Error(
      'useWorkflowEngine must be used within a WorkflowEngineProvider'
    );
  }

  return engine;
}
