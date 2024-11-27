import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

type FlowyStatus = 'idle' | 'running' | 'paused' | 'finished';
export type RunningStep = {
  status: FlowyStatus;
  nodeId: string;
  parentId?: string;

  data?: unknown;
  error?: unknown;
};

export type FlowyState = {
  status: FlowyStatus;

  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;

  // run following current steps
  // so after we start the flow, we can get the trigger node
  // and add the step ids that are connected to the trigger node
  // to the steps(same as currently running step ids) array
  // 1. if one step is finished running, we remove it from the steps array
  //    add it's connected steps to the steps array
  steps: RunningStep[];
  // check if the node is running or not
  getStep: (nodeId: string, parentId?: string) => RunningStep | undefined;
  addStep: (step: RunningStep | RunningStep[]) => void;
  updateStep: (
    nodeId: string,
    parentId: string | undefined,
    step: Partial<RunningStep>
  ) => void;
  removeStep: (nodeId: string, parentId?: string) => void;
};

export const useFlowyStore = createWithEqualityFn<FlowyState>(
  (set, get) => ({
    status: 'idle',

    start: () => {
      set({ status: 'running' });
    },
    pause: () => {
      set({ status: 'paused' });
    },
    resume: () => {
      set({ status: 'running' });
    },
    reset: () => {
      set({ status: 'idle', steps: [] });
    },

    steps: [],
    getStep: (nodeId, parentId) => {
      return get().steps.find((step) => {
        return step.nodeId === nodeId && step.parentId === parentId;
      });
    },
    addStep: (step) => {
      set((state) => {
        const steps = Array.isArray(step) ? step : [step];

        return {
          steps: [...state.steps, ...steps],
        };
      });
    },
    updateStep: (nodeId, parentId, step) => {
      set((state) => {
        const stepIndex = state.steps.findIndex((s) => {
          return s.nodeId === nodeId && s.parentId === parentId;
        });

        if (stepIndex === -1) {
          return state;
        }

        const steps = [...state.steps];
        steps[stepIndex] = { ...steps[stepIndex], ...step };

        return { steps };
      });
    },
    removeStep: (nodeId, parentId) => {
      set((state) => {
        const stepIndex = state.steps.findIndex((step) => {
          return step.nodeId === nodeId && step.parentId === parentId;
        });

        if (stepIndex === -1) {
          return state;
        }

        const steps = [...state.steps];
        steps.splice(stepIndex, 1);

        return {
          steps,
          status: steps.length === 0 ? 'finished' : state.status,
        };
      });
    },
  }),
  shallow
);
