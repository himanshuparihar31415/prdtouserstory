import { useState } from 'react';
import { Check, CheckCircle2, List, Layers } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useProjectStore } from '../../store/projectStore';

const PRIORITY_COLOR: Record<string, 'red' | 'orange' | 'gray'> = { high: 'red', medium: 'orange', low: 'gray' };

export default function Step12Page() {
  const { stories, finalizeStories } = useProjectStore();
  const [mode, setMode] = useState<'incremental' | 'bulk'>('incremental');
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const pendingStories = stories.filter(s => !s.isFinalized);
  const finalizedStories = stories.filter(s => s.isFinalized);
  const allFinalized = pendingStories.length === 0 && stories.length > 0;

  const toggleSelect = (id: string) =>
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const finalizeOne = (id: string) => finalizeStories([id]);

  const bulkFinalize = () => {
    finalizeStories([...selected]);
    setSelected(new Set());
    setBulkModalOpen(false);
  };

  return (
    <WizardShell step={12} title="Story Finalization" description="Finalize stories one at a time or all at once. Finalized stories are locked and ready for sprint planning.">
      {/* Mode toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode('incremental')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            mode === 'incremental' ? 'bg-brand-active border-brand-blue text-brand-blue' : 'bg-white border-gray-200 text-brand-muted'
          }`}
        >
          <List size={15} /> Incremental Mode
        </button>
        <button
          onClick={() => setMode('bulk')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            mode === 'bulk' ? 'bg-brand-active border-brand-blue text-brand-blue' : 'bg-white border-gray-200 text-brand-muted'
          }`}
        >
          <Layers size={15} /> Bulk Mode
        </button>
      </div>

      {/* Progress */}
      <div className="step-card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-brand-text">Finalization Progress</span>
          <span className="text-sm font-semibold text-brand-blue">{finalizedStories.length}/{stories.length}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${stories.length > 0 ? (finalizedStories.length / stories.length) * 100 : 0}%` }}
          />
        </div>
        {allFinalized && (
          <div className="flex items-center gap-2 mt-3 text-green-600">
            <CheckCircle2 size={16} />
            <span className="text-sm font-medium">All stories finalized!</span>
          </div>
        )}
      </div>

      {/* Bulk actions */}
      {mode === 'bulk' && pendingStories.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setSelected(new Set(pendingStories.map(s => s.id)))}
            className="btn-secondary text-xs"
          >
            Select All
          </button>
          <button onClick={() => setSelected(new Set())} className="btn-secondary text-xs">Clear</button>
          {selected.size > 0 && (
            <button onClick={() => setBulkModalOpen(true)} className="btn-primary flex items-center gap-2 text-xs">
              <Check size={12} /> Finalize {selected.size} Stories
            </button>
          )}
        </div>
      )}

      {/* Story list */}
      <div className="space-y-3">
        {/* Pending */}
        {pendingStories.map(story => (
          <div key={story.id} className="step-card flex items-center gap-4">
            {mode === 'bulk' && (
              <input
                type="checkbox"
                checked={selected.has(story.id)}
                onChange={() => toggleSelect(story.id)}
                className="w-4 h-4 rounded accent-brand-blue cursor-pointer"
              />
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-brand-text">{story.title}</span>
                <Badge label={story.priority} variant={PRIORITY_COLOR[story.priority]} />
                <Badge label={`${story.storyPoints} pts`} variant="blue" />
              </div>
              <p className="text-xs text-brand-muted">
                As a {story.asA}, I want {story.iWant}
              </p>
            </div>
            {mode === 'incremental' && (
              <button onClick={() => finalizeOne(story.id)} className="btn-success flex items-center gap-1.5 text-xs shrink-0">
                <Check size={12} /> Finalize
              </button>
            )}
          </div>
        ))}

        {/* Finalized */}
        {finalizedStories.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">Finalized ({finalizedStories.length})</p>
            {finalizedStories.map(story => (
              <div key={story.id} className="step-card flex items-center gap-4 opacity-60 mb-2">
                <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                <div className="flex-1">
                  <span className="text-sm text-brand-text line-through">{story.title}</span>
                </div>
                <Badge label="Finalized" variant="green" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bulk confirm modal */}
      <Modal open={bulkModalOpen} onClose={() => setBulkModalOpen(false)} title="Bulk Finalize Stories">
        <p className="text-sm text-brand-muted mb-4">
          You are about to finalize <span className="font-semibold text-brand-text">{selected.size} stories</span>. Finalized stories are locked and ready for sprint planning.
        </p>
        <div className="flex gap-3">
          <button onClick={bulkFinalize} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Check size={14} /> Confirm & Finalize
          </button>
          <button onClick={() => setBulkModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
        </div>
      </Modal>

      <StepFooter step={12} canProceed={allFinalized} nextLabel="View Final Output" />
    </WizardShell>
  );
}
