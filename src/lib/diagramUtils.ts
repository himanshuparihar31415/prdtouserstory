import dagre from '@dagrejs/dagre';
import type { FlowNode, FlowEdge } from '../types';

export function applyDagreLayout(
  nodes: FlowNode[],
  edges: FlowEdge[],
  direction: 'TB' | 'LR' = 'TB'
): FlowNode[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: direction, ranksep: 80, nodesep: 50, marginx: 20, marginy: 20 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => g.setNode(n.id, { width: 180, height: 60 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - 90, y: pos.y - 30 } };
  });
}

export function buildExportJson(data: {
  modules: unknown[];
  workflows?: unknown[];
  stories: unknown[];
  subtasks: unknown[];
}): string {
  return JSON.stringify(data, null, 2);
}

export function buildExportMarkdown(data: {
  modules: { name: string; features: { name: string }[] }[];
  stories: {
    title: string; asA: string; iWant: string; soThat: string;
    acceptanceCriteria: string[]; storyPoints: number; priority: string;
  }[];
}): string {
  const lines: string[] = ['# Product Decomposition Output\n'];

  lines.push('## Modules\n');
  data.modules.forEach((m) => {
    lines.push(`### ${m.name}`);
    m.features.forEach((f) => lines.push(`- ${f.name}`));
    lines.push('');
  });

  lines.push('## User Stories\n');
  data.stories.forEach((s, i) => {
    lines.push(`### Story ${i + 1}: ${s.title}`);
    lines.push(`**As a** ${s.asA}, **I want** ${s.iWant}, **so that** ${s.soThat}`);
    lines.push(`\n**Story Points:** ${s.storyPoints} | **Priority:** ${s.priority}\n`);
    lines.push('**Acceptance Criteria:**');
    s.acceptanceCriteria.forEach((ac) => lines.push(`- ${ac}`));
    lines.push('');
  });

  return lines.join('\n');
}
