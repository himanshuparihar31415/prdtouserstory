import { useState } from 'react';
import { Check, Edit2, Trash2, Plus, CheckCircle2, Sparkles, X, Lightbulb, AlertTriangle, GitBranch, Layers, BookOpen } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import StreamingText from '../../components/common/StreamingText';
import WorkflowDiagram from '../../components/diagrams/WorkflowDiagram';
import Badge from '../../components/common/Badge';
import { useProjectStore } from '../../store/projectStore';
import { MOCK_SUGGESTIONS, MOCK_STREAM_TEXTS } from '../../mock/data';
import type { Feature, SuggestionType } from '../../types';

type Tab = 'edit' | 'suggestions' | 'review';

const TYPE_ICONS: Record<SuggestionType, { icon: typeof Lightbulb; label: string; color: 'blue' | 'orange' | 'purple' | 'green' }> = {
  feature: { icon: Lightbulb, label: 'Feature', color: 'blue' },
  edge_case: { icon: AlertTriangle, label: 'Edge Case', color: 'orange' },
  flow: { icon: GitBranch, label: 'Flow', color: 'purple' },
  module: { icon: Layers, label: 'Module', color: 'green' },
};
const PRIORITY_COLOR: Record<string, 'red' | 'orange' | 'gray'> = { high: 'red', medium: 'orange', low: 'gray' };

export default function Step3Page() {
  const {
    modules, updateModule, deleteModule, addFeature, deleteFeature, updateWorkflow, workflows,
    suggestions, setSuggestions, updateSuggestionStatus,
  } = useProjectStore();

  const [tab, setTab] = useState<Tab>('edit');

  // Edit tab state
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [addingFeature, setAddingFeature] = useState<string | null>(null);
  const [newFeatureName, setNewFeatureName] = useState('');

  // Suggestions tab state
  const [streamingSuggestions, setStreamingSuggestions] = useState(false);
  const [suggestionsDone, setSuggestionsDone] = useState(false);

  const approvedCount = modules.filter(m => m.isApproved).length;
  const allApproved = approvedCount === modules.length && modules.length > 0;

  const startEditModule = (id: string, name: string, desc: string) => {
    setEditingModule(id); setEditName(name); setEditDesc(desc);
  };
  const saveEditModule = (id: string) => {
    updateModule(id, { name: editName, description: editDesc });
    setEditingModule(null);
  };
  const approveModule = (id: string) => updateModule(id, { isApproved: true });
  const approveAll = () => {
    modules.forEach(m => updateModule(m.id, { isApproved: true }));
    workflows.forEach(w => updateWorkflow(w.id, { isApproved: true }));
  };
  const handleAddFeature = (moduleId: string) => {
    if (!newFeatureName.trim()) return;
    const f: Feature = { id: `feat-new-${Date.now()}`, moduleId, name: newFeatureName, description: '', subFeatures: [] };
    addFeature(moduleId, f);
    setNewFeatureName(''); setAddingFeature(null);
  };

  const handleGenerateSuggestions = () => setStreamingSuggestions(true);
  const handleSuggestionsDone = () => {
    setSuggestionsDone(true); setStreamingSuggestions(false);
    setSuggestions(MOCK_SUGGESTIONS);
  };

  const accepted = suggestions.filter(s => s.status === 'accepted').length;

  const TABS: { key: Tab; label: string; locked: boolean }[] = [
    { key: 'edit', label: 'Edit Structure', locked: false },
    { key: 'suggestions', label: 'Suggestions', locked: false },
    { key: 'review', label: 'Final Review', locked: !suggestionsDone },
  ];

  return (
    <WizardShell step={3} title="Validate & Refine" description="Edit the extracted structure, review AI suggestions, then confirm your product baseline.">
      {/* Tab bar */}
      <div className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => !t.locked && setTab(t.key)}
            disabled={t.locked}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all
              ${tab === t.key ? 'bg-brand-active border-brand-blue text-brand-blue' : ''}
              ${t.locked ? 'bg-white border-gray-100 text-gray-300 cursor-not-allowed' : ''}
              ${tab !== t.key && !t.locked ? 'bg-white border-gray-200 text-brand-muted hover:border-brand-blue cursor-pointer' : ''}
            `}
          >
            {t.label} {t.locked && '🔒'}
          </button>
        ))}
      </div>

      {/* ── Tab: Edit Structure ── */}
      {tab === 'edit' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-brand-muted">{approvedCount}/{modules.length} modules approved</p>
            <div className="flex gap-2">
              <button onClick={approveAll} className="btn-primary flex items-center gap-2 text-xs">
                <CheckCircle2 size={13} /> Approve All
              </button>
              {allApproved && (
                <button onClick={() => setTab('suggestions')} className="btn-secondary flex items-center gap-2 text-xs">
                  Next: Suggestions →
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {modules.map(mod => (
              <div key={mod.id} className={`step-card border-l-4 ${mod.isApproved ? 'border-green-400' : 'border-gray-200'}`}>
                {editingModule === mod.id ? (
                  <div className="mb-4">
                    <input value={editName} onChange={e => setEditName(e.target.value)}
                      className="w-full border border-brand-blue rounded-lg px-3 py-2 text-sm font-semibold mb-2 outline-none" />
                    <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-brand-muted resize-none outline-none" />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => saveEditModule(mod.id)} className="btn-primary text-xs px-3 py-1.5">Save</button>
                      <button onClick={() => setEditingModule(null)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-brand-text">{mod.name}</h3>
                        {mod.isApproved && <Check size={14} className="text-green-600" />}
                      </div>
                      <p className="text-xs text-brand-muted mt-0.5">{mod.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEditModule(mod.id, mod.name, mod.description)} className="p-1.5 rounded-lg hover:bg-gray-100">
                        <Edit2 size={13} className="text-brand-muted" />
                      </button>
                      <button onClick={() => deleteModule(mod.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                        <Trash2 size={13} className="text-red-400" />
                      </button>
                      {!mod.isApproved && (
                        <button onClick={() => approveModule(mod.id)} className="btn-success text-xs px-3 py-1">
                          <Check size={12} className="inline mr-1" />Approve
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <div className="ml-4 space-y-2">
                  {mod.features.map(f => (
                    <div key={f.id} className="bg-brand-bg rounded-lg px-3 py-2 flex items-center justify-between group">
                      <p className="text-xs font-medium text-brand-text">{f.name}</p>
                      <button onClick={() => deleteFeature(mod.id, f.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 transition-all">
                        <Trash2 size={11} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                  {addingFeature === mod.id ? (
                    <div className="flex gap-2">
                      <input value={newFeatureName} onChange={e => setNewFeatureName(e.target.value)} placeholder="Feature name..."
                        autoFocus className="flex-1 border border-brand-blue rounded-lg px-3 py-1.5 text-xs outline-none"
                        onKeyDown={e => e.key === 'Enter' && handleAddFeature(mod.id)} />
                      <button onClick={() => handleAddFeature(mod.id)} className="btn-primary text-xs px-3 py-1.5">Add</button>
                      <button onClick={() => setAddingFeature(null)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setAddingFeature(mod.id)} className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-blue transition-colors mt-1">
                      <Plus size={12} /> Add feature
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Suggestions ── */}
      {tab === 'suggestions' && (
        <div>
          {!streamingSuggestions && !suggestionsDone && (
            <div className="step-card flex flex-col items-center justify-center py-14 text-center">
              <div className="icon-circle w-16 h-16 mb-4">
                <Lightbulb size={28} className="text-brand-blue" />
              </div>
              <h3 className="text-lg font-semibold text-brand-text mb-2">Find Gaps & Improvements</h3>
              <p className="text-sm text-brand-muted max-w-sm mb-6">AI will analyse your approved modules and suggest missing features, edge cases, and logic gaps.</p>
              <button onClick={handleGenerateSuggestions} className="btn-primary flex items-center gap-2 px-6 py-3">
                <Sparkles size={16} /> Analyse & Suggest
              </button>
            </div>
          )}
          {streamingSuggestions && (
            <div className="step-card">
              <StreamingText fullText={MOCK_STREAM_TEXTS.suggestions} onDone={handleSuggestionsDone} />
            </div>
          )}
          {suggestionsDone && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-brand-muted">{suggestions.length} suggestions</span>
                  <span className="text-sm text-green-600 font-medium">{accepted} accepted</span>
                </div>
                <button onClick={() => setTab('review')} className="btn-secondary text-xs flex items-center gap-2">
                  Next: Final Review →
                </button>
              </div>
              <div className="space-y-4">
                {suggestions.map(sug => {
                  const typeInfo = TYPE_ICONS[sug.type];
                  return (
                    <div key={sug.id} className={`step-card border-l-4 transition-all
                      ${sug.status === 'accepted' ? 'border-green-400 bg-green-50/30' : ''}
                      ${sug.status === 'rejected' ? 'border-gray-200 opacity-50' : ''}
                      ${sug.status === 'pending' ? 'border-brand-blue' : ''}
                    `}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="icon-circle w-9 h-9 shrink-0 mt-0.5">
                            <typeInfo.icon size={14} className="text-brand-blue" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-brand-text">{sug.title}</span>
                              <Badge label={typeInfo.label} variant={typeInfo.color} />
                              <Badge label={sug.priority} variant={PRIORITY_COLOR[sug.priority]} />
                            </div>
                            <p className="text-xs text-brand-muted mb-1">{sug.description}</p>
                            <p className="text-xs text-brand-muted italic">💡 {sug.rationale}</p>
                          </div>
                        </div>
                        {sug.status === 'pending' && (
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => updateSuggestionStatus(sug.id, 'accepted')} className="btn-success flex items-center gap-1">
                              <Check size={12} /> Accept
                            </button>
                            <button onClick={() => updateSuggestionStatus(sug.id, 'rejected')} className="btn-danger flex items-center gap-1">
                              <X size={12} /> Reject
                            </button>
                          </div>
                        )}
                        {sug.status === 'accepted' && <span className="text-xs text-green-600 font-medium shrink-0 flex items-center gap-1"><Check size={12} />Accepted</span>}
                        {sug.status === 'rejected' && <span className="text-xs text-brand-muted shrink-0 flex items-center gap-1"><X size={12} />Rejected</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Final Review ── */}
      {tab === 'review' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Layers, label: 'Modules', value: modules.filter(m => m.isApproved).length, color: 'text-brand-blue' },
              { icon: GitBranch, label: 'Workflows', value: workflows.length, color: 'text-purple-600' },
              { icon: Lightbulb, label: 'Accepted Suggestions', value: accepted, color: 'text-green-600' },
            ].map((stat, i) => (
              <div key={i} className="step-card flex items-center gap-4">
                <div className="icon-circle"><stat.icon size={20} className={stat.color} /></div>
                <div>
                  <p className="text-2xl font-bold text-brand-text">{stat.value}</p>
                  <p className="text-xs text-brand-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="step-card">
            <h3 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
              <BookOpen size={14} className="text-brand-blue" /> Approved Modules & Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {modules.map(mod => (
                <div key={mod.id} className="bg-brand-bg rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Check size={14} className="text-green-600" />
                    <span className="text-sm font-semibold text-brand-text">{mod.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.features.map(f => <Badge key={f.id} label={f.name} variant="gray" />)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {workflows.length > 0 && (
            <div className="step-card">
              <h3 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
                <GitBranch size={14} className="text-brand-blue" /> Workflows
              </h3>
              <div className="space-y-4">
                {workflows.map(wf => (
                  <div key={wf.id}>
                    <p className="text-sm font-semibold text-brand-text mb-3">{wf.name}</p>
                    <WorkflowDiagram nodes={wf.diagramData.nodes} edges={wf.diagramData.edges} height={280} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <StepFooter step={3} canProceed={suggestionsDone} nextLabel="Generate Stories" />
    </WizardShell>
  );
}
