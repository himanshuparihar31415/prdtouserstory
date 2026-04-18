import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useState, useCallback } from 'react';

interface EditableNodeData {
  label: string;
  nodeType: 'start' | 'end' | 'action' | 'decision';
  onLabelChange?: (id: string, label: string) => void;
}

const styles: Record<string, string> = {
  start:    'bg-green-50 border-green-500 text-green-800',
  end:      'bg-red-50 border-red-500 text-red-800',
  action:   'bg-white border-brand-blue text-brand-text',
  decision: 'bg-amber-50 border-amber-400 text-amber-900',
};

export default function EditableFlowNode({ id, data }: NodeProps<EditableNodeData>) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.label);

  const commit = useCallback(() => {
    setEditing(false);
    data.onLabelChange?.(id, draft);
  }, [id, draft, data]);

  const isDecision = data.nodeType === 'decision';

  return (
    <div
      className={`px-4 py-2.5 border-2 text-xs font-medium shadow-card text-center cursor-pointer
        ${isDecision ? 'min-w-[140px] max-w-[180px]' : 'rounded-xl min-w-[130px] max-w-[180px]'}
        ${styles[data.nodeType]}`}
      style={isDecision ? { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', padding: '20px 40px', borderRadius: 0 } : {}}
      onDoubleClick={() => setEditing(true)}
    >
      <Handle type="target" position={Position.Top} className="!bg-brand-blue !w-2 !h-2" />
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
          className="w-full bg-transparent outline-none text-center text-xs font-medium"
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <span>{data.label}</span>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-brand-blue !w-2 !h-2" />
    </div>
  );
}
