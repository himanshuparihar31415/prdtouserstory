import { useState } from 'react';
import { Edit2, Save, X, Plus, Trash2, BookOpen } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import Badge from '../../components/common/Badge';
import { useProjectStore } from '../../store/projectStore';

const PRIORITY_COLOR: Record<string, 'red' | 'orange' | 'gray'> = { high: 'red', medium: 'orange', low: 'gray' };

export default function Step6Page() {
  const { stories, modules, updateStory } = useProjectStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [editAcs, setEditAcs] = useState<string[]>([]);

  const startEdit = (storyId: string) => {
    const s = stories.find(st => st.id === storyId)!;
    setEditingId(storyId);
    setDraft({ asA: s.asA, iWant: s.iWant, soThat: s.soThat, priority: s.priority });
    setEditAcs([...s.acceptanceCriteria]);
  };

  const saveEdit = (storyId: string) => {
    updateStory(storyId, {
      asA: draft.asA,
      iWant: draft.iWant,
      soThat: draft.soThat,
      priority: draft.priority as 'high' | 'medium' | 'low',
      acceptanceCriteria: editAcs,
    });
    setEditingId(null);
  };

  const addAc = () => setEditAcs(prev => [...prev, '']);
  const updateAc = (i: number, val: string) => setEditAcs(prev => prev.map((ac, idx) => idx === i ? val : ac));
  const removeAc = (i: number) => setEditAcs(prev => prev.filter((_, idx) => idx !== i));

  return (
    <WizardShell step={6} title="Story Editing" description="Review and fine-tune each story — modify the user role, action, benefit, and acceptance criteria.">
      <div className="space-y-4">
        {stories.map(story => {
          const mod = modules.find(m => m.id === story.moduleId);
          const isEditing = editingId === story.id;

          return (
            <div key={story.id} className={`step-card border-l-4 ${isEditing ? 'border-brand-blue' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3">
                  <div className="icon-circle w-9 h-9 shrink-0">
                    <BookOpen size={14} className="text-brand-blue" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-brand-text">{story.title}</span>
                      <Badge label={story.priority} variant={PRIORITY_COLOR[story.priority]} />
                      <Badge label={`${story.storyPoints} pts`} variant="blue" />
                    </div>
                    {mod && <span className="text-xs text-brand-muted">{mod.name}</span>}
                  </div>
                </div>
                {!isEditing && (
                  <button onClick={() => startEdit(story.id)} className="p-1.5 rounded-lg hover:bg-gray-100 shrink-0">
                    <Edit2 size={14} className="text-brand-muted" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3 ml-12">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'asA', label: 'As a' },
                      { key: 'iWant', label: 'I want' },
                      { key: 'soThat', label: 'So that' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-xs font-semibold text-brand-text block mb-1">{field.label}</label>
                        <input
                          value={draft[field.key] || ''}
                          onChange={e => setDraft(d => ({ ...d, [field.key]: e.target.value }))}
                          className="w-full border border-brand-blue rounded-lg px-3 py-2 text-xs outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-brand-text">Acceptance Criteria</label>
                      <button onClick={addAc} className="flex items-center gap-1 text-xs text-brand-blue hover:text-blue-700">
                        <Plus size={11} /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {editAcs.map((ac, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            value={ac}
                            onChange={e => updateAc(i, e.target.value)}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-brand-blue"
                            placeholder={`Criterion ${i + 1}`}
                          />
                          <button onClick={() => removeAc(i)} className="p-1.5 rounded-lg hover:bg-red-50">
                            <Trash2 size={12} className="text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button onClick={() => saveEdit(story.id)} className="btn-primary flex items-center gap-1.5 text-xs">
                      <Save size={12} /> Save Changes
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn-secondary flex items-center gap-1.5 text-xs">
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="ml-12 space-y-2">
                  <p className="text-xs text-brand-muted">
                    As a <span className="font-medium text-brand-text">{story.asA}</span>, I want{' '}
                    <span className="font-medium text-brand-text">{story.iWant}</span>, so that{' '}
                    <span className="font-medium text-brand-text">{story.soThat}</span>
                  </p>
                  <ul className="space-y-0.5">
                    {story.acceptanceCriteria.slice(0, 2).map((ac, i) => (
                      <li key={i} className="text-xs text-brand-muted">• {ac}</li>
                    ))}
                    {story.acceptanceCriteria.length > 2 && (
                      <li className="text-xs text-brand-muted">+ {story.acceptanceCriteria.length - 2} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <StepFooter step={6} canProceed={stories.length > 0} nextLabel="Finalize & Export" />
    </WizardShell>
  );
}
