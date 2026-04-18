import { useState } from 'react';
import { Plus, Trash2, FileText, MessageSquare, File, StickyNote } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import Badge from '../../components/common/Badge';
import { useProjectStore } from '../../store/projectStore';
import type { RawInput } from '../../types';

const INPUT_TYPES: { value: RawInput['type']; label: string; icon: typeof FileText; color: 'blue' | 'purple' | 'green' | 'orange' | 'gray' }[] = [
  { value: 'confluence', label: 'Confluence', icon: FileText, color: 'blue' },
  { value: 'document', label: 'Document', icon: File, color: 'purple' },
  { value: 'transcript', label: 'Transcript', icon: MessageSquare, color: 'green' },
  { value: 'notes', label: 'Notes', icon: StickyNote, color: 'orange' },
  { value: 'other', label: 'Other', icon: FileText, color: 'gray' },
];

export default function Step1Page() {
  const { rawInputs, addRawInput, removeRawInput } = useProjectStore();
  const [type, setType] = useState<RawInput['type']>('confluence');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (!title.trim() || !content.trim()) return;
    addRawInput({ id: `input-${Date.now()}`, type, title, content });
    setTitle('');
    setContent('');
  };

  return (
    <WizardShell step={1} title="Raw Input Ingestion" description="Paste your product documentation — Confluence pages, design notes, meeting transcripts, or any text-based input.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input form */}
        <div className="step-card">
          <h3 className="text-sm font-semibold text-brand-text mb-4">Add New Input</h3>

          {/* Type selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {INPUT_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  type === t.value ? 'bg-brand-active border-brand-blue text-brand-blue' : 'bg-white border-gray-200 text-brand-muted hover:border-brand-blue'
                }`}
              >
                <t.icon size={12} /> {t.label}
              </button>
            ))}
          </div>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Input title (e.g. 'Product Requirements Doc v2')"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-3 outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Paste your content here..."
            rows={10}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
          />
          <button
            onClick={handleAdd}
            disabled={!title.trim() || !content.trim()}
            className={`btn-primary w-full mt-3 flex items-center justify-center gap-2 ${!title.trim() || !content.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Plus size={16} /> Add Input
          </button>
        </div>

        {/* Added inputs */}
        <div>
          <h3 className="text-sm font-semibold text-brand-text mb-4">
            Added Inputs <span className="text-brand-muted font-normal">({rawInputs.length})</span>
          </h3>
          {rawInputs.length === 0 ? (
            <div className="step-card flex flex-col items-center justify-center py-12 text-center">
              <FileText size={32} className="text-brand-muted mb-3" />
              <p className="text-sm text-brand-muted">No inputs added yet.</p>
              <p className="text-xs text-brand-muted mt-1">Add your first document on the left.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rawInputs.map(input => {
                const typeInfo = INPUT_TYPES.find(t => t.value === input.type)!;
                return (
                  <div key={input.id} className="step-card flex items-start gap-3 group">
                    <div className="icon-circle w-9 h-9 shrink-0">
                      <typeInfo.icon size={14} className="text-brand-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-brand-text truncate">{input.title}</span>
                        <Badge label={typeInfo.label} variant={typeInfo.color} />
                      </div>
                      <p className="text-xs text-brand-muted line-clamp-2">{input.content}</p>
                    </div>
                    <button
                      onClick={() => removeRawInput(input.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <StepFooter step={1} canProceed={rawInputs.length > 0} nextLabel="Generate Understanding" />
    </WizardShell>
  );
}
