import { FlowyManager, type StepResult } from './flowy-manager';
import { useFlowyManager } from './flowy-manager-provider';
import { useCallback, useSyncExternalStore } from 'react';

export type UseNodeResult<R = unknown> = (
  nodeId: string,
  flowyManager?: FlowyManager
) => StepResult<R> | undefined;

export const useNodeResult: UseNodeResult = (nodeId, flowyManager) => {
  const manager = useFlowyManager(flowyManager);
  return useSyncExternalStore(
    useCallback((onStoreChange) => manager.subscribe(onStoreChange), [manager]),
    () => manager.get(nodeId),
    () => manager.get(nodeId)
  );
};
