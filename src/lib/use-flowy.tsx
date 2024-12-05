import { useCallback, useSyncExternalStore } from 'react';
import { flowManager } from './flow-manager';

export function useNodeResult(nodeId: string) {
  return useSyncExternalStore(
    useCallback((onStoreChange) => flowManager.subscribe(onStoreChange), []),
    () => flowManager.get(nodeId),
    () => flowManager.get(nodeId)
  );
}
