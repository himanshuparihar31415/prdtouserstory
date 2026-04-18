import { useState } from 'react';
import { Check, CheckCircle2, List, Layers, Download, BookOpen, Database, ChevronDown, ChevronRight } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useProjectStore } from '../../store/projectStore';
import { buildExportJson, buildExportMarkdown } from '../../lib/diagramUtils';

const PRIORITY_COLOR: Record<string, 'red' | 'orange' | 'gray'> = { high: 'red', medium: 'orange', low: 'gray' };

export default function Step7Page() {
  const { stories, modules, subtasks, finalizeStories } = useProjectStore();
  const [mode, setMode] = useState<'incremental' | 'bulk'>('incremental');
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleSelect = (id: string) =>
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const pendingStories = stories.filter(s => !s.isFinalized);
  const finalizedStories = stories.filter(s => s.isFinalized);
  const allFinalized = pendingStories.length === 0 && stories.length > 0;
  const totalPoints = finalizedStories.reduce((acc, s) => acc + s.storyPoints, 0);

  const bulkFinalize = () => {
    finalizeStories([...selected]);
    setSelected(new Set());
    setBulkModalOpen(false);
  };

  const exportJson = () => {
    const blob = new Blob([buildExportJson({ modules, stories: finalizedStories, subtasks })], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'product-stories.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const exportMd = () => {
    const blob = new Blob([buildExportMarkdown({ modules, stories: finalizedStories })], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'product-stories.md'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <WizardShell step={7} title="Finalize & Export" description="Approve stories one-by-one or in bulk, then export your complete structured output.">
      {/* Mode toggle */}
      <div className="flex gap-3 mb-5">
        <button onClick={() => setMode('incremental')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${mode === 'incremental' ? 'bg-brand-active border-brand-blue text-brand-blue' : 'bg-white border-gray-200 text-brand-muted cursor-pointer'}`}>
          <List size={15} /> Incremental
        </button>
        <button onClick={() => setMode('bulk')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${mode === 'bulk' ? 'bg-brand-active border-brand-blue text-brand-blue' : 'bg-white border-gray-200 text-brand-muted cursor-pointer'}`}>
          <Layers size={15} /> Bulk
        </button>
      </div>

      {/* Progress */}
      <div className="step-card mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-brand-text">Finalization Progress</span>
          <span className="text-sm font-semibold text-brand-blue">{finalizedStories.length}/{stories.length}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${stories.length > 0 ? (finalizedStories.length / stories.length) * 100 : 0}%` }} />
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
          <button onClick={() => setSelected(new Set(pendingStories.map(s => s.id)))} className="btn-secondary text-xs">Select All</button>
          <button onClick={() => setSelected(new Set())} className="btn-secondary text-xs">Clear</button>
          {selected.size > 0 && (
            <button onClick={() => setBulkModalOpen(true)} className="btn-primary flex items-center gap-2 text-xs">
              <Check size={12} /> Finalize {selected.size} Stories
            </button>
          )}
        </div>
      )}

      {/* Pending stories */}
      <div className="space-y-3 mb-6">
        {pendingStories.map(story => (
          <div key={story.id} className="step-card flex items-center gap-4">
            {mode === 'bulk' && (
              <input type="checkbox" checked={selected.has(story.id)} onChange={() => toggleSelect(story.id)}
                className="w-4 h-4 rounded accent-brand-blue cursor-pointer" />
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-brand-text">{story.title}</span>
                <Badge label={story.priority} variant={PRIORITY_COLOR[story.priority]} />
                <Badge label={`${story.storyPoints} pts`} variant="blue" />
              </div>
              <p className="text-xs text-brand-muted">As a {story.asA}, I want {story.iWant}</p>
            </div>
            {mode === 'incremental' && (
              <button onClick={() => finalizeStories([story.id])} className="btn-success flex items-center gap-1.5 text-xs shrink-0">
                <Check size={12} /> Finalize
              </button>
            )}
          </div>
        ))}

        {finalizedStories.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">Finalized ({finalizedStories.length})</p>
            {finalizedStories.map(story => (
              <div key={story.id} className="step-card flex items-center gap-4 opacity-60 mb-2">
                <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                <span className="flex-1 text-sm text-brand-text line-through">{story.title}</span>
                <Badge label="Done" variant="green" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export section — shown once all finalized */}
      {allFinalized && (
        <div className="step-card border border-green-200 bg-green-50/30">
          <h3 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
            <Download size={14} className="text-green-600" /> Export Final Output
          </h3>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: Layers, label: 'Modules', value: modules.length, color: 'text-brand-blue' },
              { icon: BookOpen, label: 'Stories', value: finalizedStories.length, color: 'text-purple-600' },
              { icon: Database, label: 'Total Points', value: totalPoints, color: 'text-green-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
                <stat.icon size={16} className={stat.color} />
                <div>
                  <p className="text-lg font-bold text-brand-text">{stat.value}</p>
                  <p className="text-[10px] text-brand-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mb-5">
            <button onClick={exportJson} className="btn-primary flex items-center gap-2">
              <Download size={15} /> Export JSON
            </button>
            <button onClick={exportMd} className="btn-secondary flex items-center gap-2">
              <Download size={15} /> Export Markdown
            </button>
          </div>

          {/* Module-wise breakdown */}
          <div className="space-y-3">
            {modules.map(mod => {
              const modStories = finalizedStories.filter(s => s.moduleId === mod.id);
              if (!modStories.length) return null;
              return (
                <div key={mod.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <button onClick={() => toggle(mod.id)} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {expanded[mod.id] ? <ChevronDown size={13} className="text-brand-blue" /> : <ChevronRight size={13} className="text-brand-blue" />}
                      <span className="text-sm font-semibold text-brand-text">{mod.name}</span>
                      <Badge label={`${modStories.length} stories`} variant="blue" />
                    </div>
                    <CheckCircle2 size={14} className="text-green-600" />
                  </button>
                  {expanded[mod.id] && (
                    <div className="mt-3 space-y-2 ml-5">
                      {modStories.map(story => (
                        <div key={story.id} className="bg-brand-bg rounded-lg p-3">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-brand-text">{story.title}</span>
                            <Badge label={story.priority} variant={PRIORITY_COLOR[story.priority]} />
                            <Badge label={`${story.storyPoints} pts`} variant="gray" />
                          </div>
                          <p className="text-[11px] text-brand-muted">
                            As a <b>{story.asA}</b>, I want {story.iWant}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal open={bulkModalOpen} onClose={() => setBulkModalOpen(false)} title="Bulk Finalize Stories">
        <p className="text-sm text-brand-muted mb-4">
          Finalise <span className="font-semibold text-brand-text">{selected.size} stories</span>? They'll be locked and ready for sprint planning.
        </p>
        <div className="flex gap-3">
          <button onClick={bulkFinalize} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Check size={14} /> Confirm & Finalise
          </button>
          <button onClick={() => setBulkModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
        </div>
      </Modal>

      <StepFooter step={7} hideNext canProceed={false} />
    </WizardShell>
  );
}
