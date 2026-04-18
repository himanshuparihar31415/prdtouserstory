import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { useState, useCallback } from 'react';

interface EditableNodeData {
  label: string;
  nodeType: 'start' | 'end' | 'action' | 'decision';
  onLabelChange?: (id: string, label: string) => void;
}

const styles: Record<string, string> = {
  start: 'bg-green-100 border-green-400 text-green-800',
  end: 'bg-red-100 border-red-400 text-red-800',
  action: 'bg-white border-brand-blue text-brand-text',
  decision: 'bg-brand-active border-brand-blue text-brand-blue',
};

export default function EditableFlowNode({ id, data }: NodeProps<EditableNodeData>) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.label);

  const commit = useCallback(() => {
    setEditing(false);
    data.onLabelChange?.(id, draft);
  }, [id, draft, data]);

  return (
    <div
      className={`px-4 py-2.5 rounded-xl border-2 text-xs font-medium shadow-card text-center min-w-[130px] max-w-[180px] cursor-pointer ${styles[data.nodeType]}`}
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
