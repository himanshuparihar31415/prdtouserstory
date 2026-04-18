import { create } from 'zustand';
import type { RawInput, Module, Feature, Workflow, Suggestion, Story, SubTask, ConsolidatedData } from '../types';

interface ProjectStore {
  rawInputs: RawInput[];
  consolidatedData: ConsolidatedData | null;
  modules: Module[];
  workflows: Workflow[];
  suggestions: Suggestion[];
  stories: Story[];
  subtasks: SubTask[];

  setRawInputs: (inputs: RawInput[]) => void;
  addRawInput: (input: RawInput) => void;
  removeRawInput: (id: string) => void;

  setConsolidatedData: (data: ConsolidatedData) => void;

  setModules: (modules: Module[]) => void;
  updateModule: (id: string, data: Partial<Module>) => void;
  deleteModule: (id: string) => void;
  updateFeature: (moduleId: string, featureId: string, data: Partial<Feature>) => void;
  deleteFeature: (moduleId: string, featureId: string) => void;
  addFeature: (moduleId: string, feature: Feature) => void;

  setWorkflows: (workflows: Workflow[]) => void;
  updateWorkflow: (id: string, data: Partial<Workflow>) => void;

  setSuggestions: (suggestions: Suggestion[]) => void;
  updateSuggestionStatus: (id: string, status: 'accepted' | 'rejected') => void;

  setStories: (stories: Story[]) => void;
  updateStory: (id: string, data: Partial<Story>) => void;
  deleteStory: (id: string) => void;

  setSubtasks: (subtasks: SubTask[]) => void;

  finalizeStories: (ids: string[]) => void;

  reset: () => void;
}

const initialState = {
  rawInputs: [] as RawInput[],
  consolidatedData: null,
  modules: [] as Module[],
  workflows: [] as Workflow[],
  suggestions: [] as Suggestion[],
  stories: [] as Story[],
  subtasks: [] as SubTask[],
};

export const useProjectStore = create<ProjectStore>((set) => ({
  ...initialState,

  setRawInputs: (inputs) => set({ rawInputs: inputs }),
  addRawInput: (input) => set((s) => ({ rawInputs: [...s.rawInputs, input] })),
  removeRawInput: (id) => set((s) => ({ rawInputs: s.rawInputs.filter(i => i.id !== id) })),

  setConsolidatedData: (data) => set({ consolidatedData: data }),

  setModules: (modules) => set({ modules }),
  updateModule: (id, data) =>
    set((s) => ({ modules: s.modules.map(m => m.id === id ? { ...m, ...data } : m) })),
  deleteModule: (id) =>
    set((s) => ({ modules: s.modules.filter(m => m.id !== id) })),
  updateFeature: (moduleId, featureId, data) =>
    set((s) => ({
      modules: s.modules.map(m =>
        m.id === moduleId
          ? { ...m, features: m.features.map(f => f.id === featureId ? { ...f, ...data } : f) }
          : m
      ),
    })),
  deleteFeature: (moduleId, featureId) =>
    set((s) => ({
      modules: s.modules.map(m =>
        m.id === moduleId
          ? { ...m, features: m.features.filter(f => f.id !== featureId) }
          : m
      ),
    })),
  addFeature: (moduleId, feature) =>
    set((s) => ({
      modules: s.modules.map(m =>
        m.id === moduleId ? { ...m, features: [...m.features, feature] } : m
      ),
    })),

  setWorkflows: (workflows) => set({ workflows }),
  updateWorkflow: (id, data) =>
    set((s) => ({ workflows: s.workflows.map(w => w.id === id ? { ...w, ...data } : w) })),

  setSuggestions: (suggestions) => set({ suggestions }),
  updateSuggestionStatus: (id, status) =>
    set((s) => ({ suggestions: s.suggestions.map(sg => sg.id === id ? { ...sg, status } : sg) })),

  setStories: (stories) => set({ stories }),
  updateStory: (id, data) =>
    set((s) => ({ stories: s.stories.map(st => st.id === id ? { ...st, ...data } : st) })),
  deleteStory: (id) =>
    set((s) => ({ stories: s.stories.filter(st => st.id !== id) })),

  setSubtasks: (subtasks) => set({ subtasks }),

  finalizeStories: (ids) =>
    set((s) => ({
      stories: s.stories.map(st => ids.includes(st.id) ? { ...st, isFinalized: true } : st),
    })),

  reset: () => set(initialState),
}));
