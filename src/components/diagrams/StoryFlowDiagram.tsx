import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { applyDagreLayout } from '../../lib/diagramUtils';
import type { Story, Module } from '../../types';
import type { FlowNode, FlowEdge } from '../../types';

interface Props {
  stories: Story[];
  modules: Module[];
  selectedStoryId?: string;
  onSelectStory?: (id: string) => void;
}

export default function StoryFlowDiagram({ stories, modules, selectedStoryId, onSelectStory }: Props) {
  const nodes: FlowNode[] = stories.map((s) => {
    const mod = modules.find(m => m.id === s.moduleId);
    return {
      id: s.id,
      type: 'default',
      position: { x: 0, y: 0 },
      data: { label: s.title, nodeType: 'action' as const },
      style: {
        background: selectedStoryId === s.id ? '#E8EEFF' : '#fff',
        border: selectedStoryId === s.id ? '2px solid #3B5BDB' : '1.5px solid #e5e7eb',
        borderRadius: 12,
        fontSize: 11,
        padding: '8px 12px',
        maxWidth: 180,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        color: mod ? '#1A1D2E' : '#6B7280',
      },
    };
  });

  const edges: FlowEdge[] = [];
  stories.forEach((s) => {
    s.dependencies.forEach((depTitle) => {
      const dep = stories.find(st => st.title === depTitle || st.id === depTitle);
      if (dep) {
        edges.push({ id: `${dep.id}-${s.id}`, source: dep.id, target: s.id, animated: true });
      }
    });
  });

  const laidOut = applyDagreLayout(nodes, edges, 'LR');

  return (
    <div className="h-full rounded-xl overflow-hidden border border-gray-100">
      <ReactFlow
        nodes={laidOut}
        edges={edges.map(e => ({ ...e, style: { stroke: '#3B5BDB', strokeWidth: 1.5 } }))}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        onNodeClick={(_, node) => onSelectStory?.(node.id)}
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Background color="#f0f2f8" gap={16} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
