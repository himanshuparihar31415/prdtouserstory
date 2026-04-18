import { useState, useCallback } from 'react';
import { Check, Edit2, Trash2, Plus, CheckCircle2, Lightbulb, Paperclip, X } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import { useProjectStore } from '../../store/projectStore';
import type { Feature } from '../../types';

// ── inline suggestion helpers ─────────────────────────────────────────────────

interface InlineSuggestion {
  id: string;
  moduleId: string;
  text: string;
  accepted: boolean;
  dismissed: boolean;
}

const MODULE_SUGGESTIONS: Record<string, string[]> = {
  'mod-auth': [
    'Add forgot password / email reset flow',
    'Implement two-factor authentication (2FA)',
    'Handle session timeout with auto-logout warning',
  ],
  'mod-catalog': [
    'Add product comparison feature',
    'Implement recently viewed products list',
    'Add wishlist / save-for-later functionality',
  ],
  'mod-cart': [
    'Handle cart expiry for long-inactive sessions',
    'Add gift wrapping option at checkout',
    'Support split / partial payment methods',
  ],
  'mod-orders': [
    'Add order cancellation window (within 30 minutes)',
    'Implement order dispute / escalation flow',
    'Add driver tracking for last-mile delivery',
  ],
};

function suggestionsFor(moduleId: string): InlineSuggestion[] {
  const texts = MODULE_SUGGESTIONS[moduleId] ?? [
    'Review edge cases for error states',
    'Add loading and empty state handling',
    'Consider accessibility (a11y) requirements',
  ];
  return texts.slice(0, 2).map((text, i) => ({
    id: `inl-${moduleId}-${i}`,
    moduleId,
    text,
    accepted: false,
    dismissed: false,
  }));
}

// ── component ─────────────────────────────────────────────────────────────────

export default function Step3Page() {
  const { modules, updateModule, deleteModule, addFeature, deleteFeature } = useProjectStore();

  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [addingFeature, setAddingFeature] = useState<string | null>(null);
  const [newFeatureName, setNewFeatureName] = useState('');

  const [attachments, setAttachments] = useState<Record<string, string>>({});

  const [inlineSugg, setInlineSugg] = useState<InlineSuggestion[]>([]);
  const [loadingApprove, setLoadingApprove] = useState<Set<string>>(new Set());

  const startEdit = (id: string, name: string, desc: string) => {
    setEditingModule(id); setEditName(name); setEditDesc(desc);
  };
  const saveEdit = (id: string) => {
    updateModule(id, { name: editName, description: editDesc });
    setEditingModule(null);
  };

  const approveModule = useCallback((id: string) => {
    updateModule(id, { isApproved: true });
    setLoadingApprove(prev => new Set([...prev, id]));
    setTimeout(() => {
      setLoadingApprove(prev => { const n = new Set(prev); n.delete(id); return n; });
      setInlineSugg(prev => {
        if (prev.some(s => s.moduleId === id)) return prev;
        return [...prev, ...suggestionsFor(id)];
      });
    }, 800);
  }, [updateModule]);

  const approveAll = () => modules.forEach(m => { if (!m.isApproved) approveModule(m.id); });

  const handleAddFeature = (moduleId: string) => {
    if (!newFeatureName.trim()) return;
    const f: Feature = { id: `feat-new-${Date.now()}`, moduleId, name: newFeatureName, description: '', subFeatures: [] };
    addFeature(moduleId, f);
    setNewFeatureName('');
    setAddingFeature(null);
  };

  const acceptSugg = (sugg: InlineSuggestion) => {
    addFeature(sugg.moduleId, {
      id: `feat-sugg-${Date.now()}`,
      moduleId: sugg.moduleId,
      name: sugg.text,
      description: '',
      subFeatures: [],
    });
    setInlineSugg(prev => prev.map(s => s.id === sugg.id ? { ...s, accepted: true } : s));
  };

  const dismissSugg = (id: string) =>
    setInlineSugg(prev => prev.map(s => s.id === id ? { ...s, dismissed: true } : s));

  const approvedCount = modules.filter(m => m.isApproved).length;
  const allApproved = approvedCount === modules.length && modules.length > 0;

  return (
    <WizardShell step={3} title="Validate & Refine" description="Edit your product structure and approve each module. AI will surface gap suggestions inline once you approve.">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-brand-muted">
          <span className="font-semibold text-brand-text">{approvedCount}</span>/{modules.length} modules approved
        </p>
        <div className="flex gap-3 items-center">
          {allApproved ? (
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <CheckCircle2 size={14} /> All modules approved
            </span>
          ) : (
            <button onClick={approveAll} className="btn-primary flex items-center gap-2 text-xs">
              <CheckCircle2 size={13} /> Approve All
            </button>
          )}
        </div>
      </div>

      <div className="space-y-5">
        {modules.map(mod => {
          const visible = inlineSugg.filter(s => s.moduleId === mod.id && !s.dismissed && !s.accepted);
          return (
            <div key={mod.id} className={`step-card border-l-4 transition-all ${mod.isApproved ? 'border-green-400' : 'border-gray-200'}`}>

              {/* Module header / edit */}
              {editingModule === mod.id ? (
                <div className="mb-4">
                  <input value={editName} onChange={e => setEditName(e.target.value)}
                    className="w-full border border-brand-blue rounded-lg px-3 py-2 text-sm font-semibold mb-2 outline-none"
                    placeholder="Module name" />
                  <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-brand-muted resize-none outline-none focus:border-brand-blue"
                    placeholder="Module description…" />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => saveEdit(mod.id)} className="btn-primary text-xs px-3 py-1.5">Save</button>
                    <button onClick={() => setEditingModule(null)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold text-brand-text">{mod.name}</h3>
                      {mod.isApproved && <Check size={14} className="text-green-600" />}
                    </div>
                    <p className="text-xs text-brand-muted">{mod.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <button onClick={() => startEdit(mod.id, mod.name, mod.description)} className="p-1.5 rounded-lg hover:bg-gray-100">
                      <Edit2 size={13} className="text-brand-muted" />
                    </button>
                    <button onClick={() => deleteModule(mod.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                    {mod.isApproved ? (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 size={13} /> Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => approveModule(mod.id)}
                        disabled={loadingApprove.has(mod.id)}
                        className="btn-success text-xs px-3 py-1.5 flex items-center gap-1"
                      >
                        {loadingApprove.has(mod.id)
                          ? <span className="animate-pulse text-xs">Analysing…</span>
                          : <><Check size={12} /> Approve</>}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Feature list */}
              <div className="ml-4 space-y-2 mb-3">
                {mod.features.map(f => (
                  <div key={f.id} className="bg-brand-bg rounded-lg p-3 group">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-brand-text mb-0.5">{f.name}</p>
                        {f.description && <p className="text-[11px] text-brand-muted leading-snug">{f.description}</p>}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {attachments[f.id] ? (
                          <span className="text-[10px] text-brand-blue flex items-center gap-0.5">
                            <Paperclip size={9} /> {attachments[f.id]}
                          </span>
                        ) : (
                          <label className="cursor-pointer text-[10px] text-brand-muted hover:text-brand-blue flex items-center gap-0.5 transition-colors">
                            <Paperclip size={9} /> Attach
                            <input type="file" accept="image/*" className="hidden"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) setAttachments(prev => ({ ...prev, [f.id]: file.name }));
                              }} />
                          </label>
                        )}
                        <button onClick={() => deleteFeature(mod.id, f.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 transition-all">
                          <Trash2 size={11} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {addingFeature === mod.id ? (
                  <div className="flex gap-2">
                    <input value={newFeatureName} onChange={e => setNewFeatureName(e.target.value)}
                      placeholder="Feature name…" autoFocus
                      className="flex-1 border border-brand-blue rounded-lg px-3 py-1.5 text-xs outline-none"
                      onKeyDown={e => e.key === 'Enter' && handleAddFeature(mod.id)} />
                    <button onClick={() => handleAddFeature(mod.id)} className="btn-primary text-xs px-3 py-1.5">Add</button>
                    <button onClick={() => setAddingFeature(null)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setAddingFeature(mod.id)}
                    className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-blue transition-colors mt-1">
                    <Plus size={12} /> Add feature
                  </button>
                )}
              </div>

              {/* Inline suggestions — appear after module approved */}
              {visible.length > 0 && (
                <div className="ml-4 border-t border-gray-100 pt-3 space-y-2">
                  <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-wider flex items-center gap-1 mb-2">
                    <Lightbulb size={10} className="text-amber-500" /> AI Gap Suggestions
                  </p>
                  {visible.map(sugg => (
                    <div key={sugg.id} className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-3">
                      <Lightbulb size={12} className="text-amber-500 shrink-0" />
                      <p className="text-xs text-amber-900 flex-1">{sugg.text}</p>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => acceptSugg(sugg)}
                          className="text-[10px] text-green-700 bg-green-100 hover:bg-green-200 px-2 py-0.5 rounded font-medium transition-colors">
                          + Add
                        </button>
                        <button onClick={() => dismissSugg(sugg.id)} className="p-0.5 text-brand-muted hover:text-red-400 transition-colors">
                          <X size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <StepFooter step={3} canProceed={allApproved} nextLabel="Story Reviewer" />
    </WizardShell>
  );
}
