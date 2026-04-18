export interface RawInput {
  id: string;
  type: 'confluence' | 'document' | 'transcript' | 'notes' | 'other';
  title: string;
  content: string;
}

export interface SubFeature {
  id: string;
  name: string;
  description: string;
}

export interface Feature {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  subFeatures: SubFeature[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
  order: number;
  isApproved: boolean;
  features: Feature[];
}

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  type: 'start' | 'end' | 'action' | 'decision';
  nextSteps: string[];
  conditions?: Record<string, string>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  diagramData: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  isApproved: boolean;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string; nodeType: 'start' | 'end' | 'action' | 'decision' };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export type SuggestionType = 'feature' | 'edge_case' | 'flow' | 'module';
export type SuggestionStatus = 'pending' | 'accepted' | 'rejected';

export interface Suggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  rationale: string;
  affectedModule?: string;
  priority: 'high' | 'medium' | 'low';
  status: SuggestionStatus;
}

export interface Story {
  id: string;
  moduleId: string;
  featureId?: string;
  workflowId?: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  edgeCases: string[];
  dependencies: string[];
  priority: 'high' | 'medium' | 'low';
  storyPoints: number;
  isFinalized: boolean;
}

export type SubTaskType = 'backend' | 'frontend' | 'qa';

export interface SubTask {
  id: string;
  storyId: string;
  type: SubTaskType;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  currentStep: number;
  createdAt: string;
}

export interface ConsolidatedData {
  summary: string;
  uiStructure: {
    pages: string[];
    navigationPattern: string;
    keyComponents: string[];
  };
  relationships: Array<{
    from: string;
    to: string;
    type: string;
  }>;
}
