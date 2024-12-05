import { FlowyManager, FlowyResults } from '@flowy/core';
import { useFlowyManager } from './flowy-manager-provider';
import { useCallback, useSyncExternalStore } from 'react';

export type UseNodeResults<R = unknown> = (
  flowyManager?: FlowyManager
) => FlowyResults;

export const useNodeResults: UseNodeResults = (flowyManager) => {
  const manager = useFlowyManager(flowyManager);
  return useSyncExternalStore(
    useCallback((onStoreChange) => manager.subscribe(onStoreChange), [manager]),
    () => manager.getAll(),
    () => manager.getAll()
  );
};
