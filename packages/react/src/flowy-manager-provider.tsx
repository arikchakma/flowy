import { createContext, PropsWithChildren, useContext } from 'react';
import { FlowyManager } from '@flowy/core';

export const FlowyManagerContext = createContext<FlowyManager | null>(null);

type FlowyManagerProviderProps = PropsWithChildren<{
  manager: FlowyManager;
}>;

export function FlowyManagerProvider(props: FlowyManagerProviderProps) {
  const { children, ...defaultValues } = props;

  return (
    <FlowyManagerContext.Provider value={defaultValues.manager}>
      {children}
    </FlowyManagerContext.Provider>
  );
}

export function useFlowyManager(flowyManager?: FlowyManager) {
  if (flowyManager) {
    return flowyManager;
  }

  const manager = useContext(FlowyManagerContext);
  if (!manager) {
    throw new Error(
      'useFlowyManager must be used within a FlowyManagerProvider'
    );
  }

  return manager;
}
