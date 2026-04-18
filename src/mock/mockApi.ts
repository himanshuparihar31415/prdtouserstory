import {
  MOCK_PROJECTS, MOCK_MODULES, MOCK_WORKFLOWS,
  MOCK_SUGGESTIONS, MOCK_STORIES, MOCK_SUBTASKS,
  MOCK_CONSOLIDATED,
} from './data';
import type { Module, Story, Suggestion, SubTask } from '../types';

function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

export const mockApi = {
  getProjects: () => delay(400, [...MOCK_PROJECTS]),
  createProject: (name: string, description: string) =>
    delay(600, { id: `proj-${Date.now()}`, name, description, currentStep: 1, createdAt: new Date().toISOString() }),

  getProject: (id: string) => delay(300, MOCK_PROJECTS.find(p => p.id === id) ?? MOCK_PROJECTS[0]),

  saveInputs: (_inputs: unknown[]) => delay(500, { success: true }),

  getConsolidated: () => delay(600, MOCK_CONSOLIDATED),

  getModules: () => delay(500, JSON.parse(JSON.stringify(MOCK_MODULES)) as Module[]),
  updateModule: (id: string, data: Partial<Module>) => delay(300, { id, ...data }),
  deleteModule: (id: string) => delay(300, { id, deleted: true }),

  getWorkflows: () => delay(500, JSON.parse(JSON.stringify(MOCK_WORKFLOWS))),
  updateWorkflow: (id: string, data: Record<string, unknown>) => delay(300, { id, ...data }),

  getSuggestions: () => delay(600, JSON.parse(JSON.stringify(MOCK_SUGGESTIONS)) as Suggestion[]),
  updateSuggestion: (id: string, status: 'accepted' | 'rejected') => delay(300, { id, status }),

  getStories: () => delay(700, JSON.parse(JSON.stringify(MOCK_STORIES)) as Story[]),
  updateStory: (id: string, data: Partial<Story>) => delay(300, { id, ...data }),
  deleteStory: (id: string) => delay(300, { id, deleted: true }),

  getSubtasks: (storyId: string) =>
    delay(400, (JSON.parse(JSON.stringify(MOCK_SUBTASKS)) as SubTask[]).filter(s => s.storyId === storyId)),
  getAllSubtasks: () => delay(500, JSON.parse(JSON.stringify(MOCK_SUBTASKS)) as SubTask[]),

  finalizeStories: (_ids: string[]) => delay(400, { success: true }),

  exportData: () =>
    delay(300, {
      modules: MOCK_MODULES,
      workflows: MOCK_WORKFLOWS,
      stories: MOCK_STORIES,
      subtasks: MOCK_SUBTASKS,
    }),
};
