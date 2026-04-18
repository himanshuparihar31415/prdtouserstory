import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import FlowNode from './FlowNode';
import { applyDagreLayout } from '../../lib/diagramUtils';
import type { FlowNode as FlowNodeType, FlowEdge } from '../../types';

const nodeTypes = { flowNode: FlowNode };

interface Props {
  nodes: FlowNodeType[];
  edges: FlowEdge[];
  height?: number;
}

export default function WorkflowDiagram({ nodes, edges, height = 400 }: Props) {
  const laidOutNodes = applyDagreLayout(nodes, edges);

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-gray-100">
      <ReactFlow
        nodes={laidOutNodes}
        edges={edges.map(e => ({ ...e, type: 'smoothstep', style: { stroke: '#3B5BDB', strokeWidth: 1.5 }, labelStyle: { fontSize: 10, fill: '#6B7280' } }))}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnDoubleClick={false}
      >
        <Background color="#e8eeff" gap={20} />
        <Controls showInteractive={false} />
        <MiniMap nodeColor={() => '#3B5BDB'} maskColor="rgba(240,242,248,0.7)" />
      </ReactFlow>
    </div>
  );
}
