import { Handle, Position } from 'reactflow';

interface FlowNodeData {
  label: string;
  nodeType: 'start' | 'end' | 'action' | 'decision';
}

const styles: Record<string, string> = {
  start: 'bg-green-100 border-green-400 text-green-800',
  end: 'bg-red-100 border-red-400 text-red-800',
  action: 'bg-white border-brand-blue text-brand-text',
  decision: 'bg-brand-active border-brand-blue text-brand-blue',
};

export default function FlowNode({ data }: { data: FlowNodeData }) {
  const isDecision = data.nodeType === 'decision';
  return (
    <div
      className={`px-4 py-2.5 rounded-xl border-2 text-xs font-medium shadow-card text-center min-w-[140px] max-w-[180px] ${styles[data.nodeType]}
        ${isDecision ? 'rotate-0' : ''}`}
      style={isDecision ? { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' , padding: '20px 40px', borderRadius: 0 } : {}}
    >
      <Handle type="target" position={Position.Top} className="!bg-brand-blue" />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="!bg-brand-blue" />
    </div>
  );
}
