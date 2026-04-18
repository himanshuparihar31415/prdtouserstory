import { create } from 'zustand';

interface WizardStore {
  projectId: string | null;
  currentStep: number;
  completedSteps: Set<number>;
  setProjectId: (id: string) => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  canNavigateTo: (step: number) => boolean;
  reset: () => void;
}

export const useWizardStore = create<WizardStore>((set, get) => ({
  projectId: null,
  currentStep: 1,
  completedSteps: new Set<number>(),

  setProjectId: (id) => set({ projectId: id }),

  setCurrentStep: (step) => set({ currentStep: step }),

  markStepComplete: (step) =>
    set((state) => ({
      completedSteps: new Set([...state.completedSteps, step]),
      currentStep: Math.max(state.currentStep, step + 1),
    })),

  canNavigateTo: (step) => {
    const { completedSteps, currentStep } = get();
    if (step <= currentStep) return true;
    const maxCompleted = completedSteps.size > 0 ? Math.max(...completedSteps) : 0;
    return step <= maxCompleted + 1;
  },

  reset: () =>
    set({ projectId: null, currentStep: 1, completedSteps: new Set<number>() }),
}));
