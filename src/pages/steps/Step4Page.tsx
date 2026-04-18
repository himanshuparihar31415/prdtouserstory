import { useState } from 'react';
import { Check, Edit2, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import { useProjectStore } from '../../store/projectStore';
import type { Feature } from '../../types';

export default function Step4Page() {
  const { modules, updateModule, deleteModule, deleteFeature, addFeature, updateWorkflow, workflows } = useProjectStore();
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [addingFeature, setAddingFeature] = useState<string | null>(null);
  const [newFeatureName, setNewFeatureName] = useState('');

  const approvedCount = modules.filter(m => m.isApproved).length;
  const allApproved = approvedCount === modules.length && modules.length > 0;

  const startEditModule = (id: string, name: string, desc: string) => {
    setEditingModule(id);
    setEditName(name);
    setEditDesc(desc);
  };

  const saveEditModule = (id: string) => {
    updateModule(id, { name: editName, description: editDesc });
    setEditingModule(null);
  };

  const approveModule = (id: string) => updateModule(id, { isApproved: true });

  const handleAddFeature = (moduleId: string) => {
    if (!newFeatureName.trim()) return;
    const newFeature: Feature = {
      id: `feat-new-${Date.now()}`,
      moduleId,
      name: newFeatureName,
      description: '',
      subFeatures: [],
    };
    addFeature(moduleId, newFeature);
    setNewFeatureName('');
    setAddingFeature(null);
  };

  const approveAll = () => {
    modules.forEach(m => updateModule(m.id, { isApproved: true }));
    workflows.forEach(w => updateWorkflow(w.id, { isApproved: true }));
  };

  return (
    <WizardShell step={4} title="User Validation Layer" description="Review the extracted structure. Edit modules and features, approve what's correct, and this becomes your product baseline.">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-brand-muted">{approvedCount}/{modules.length} modules approved</p>
        <button onClick={approveAll} className="btn-primary flex items-center gap-2 text-xs">
          <CheckCircle2 size={14} /> Approve All
        </button>
      </div>

      <div className="space-y-4">
        {modules.map(mod => (
          <div key={mod.id} className={`step-card border-l-4 ${mod.isApproved ? 'border-green-400' : 'border-gray-200'}`}>
            {/* Module header */}
            {editingModule === mod.id ? (
              <div className="mb-4">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full border border-brand-blue rounded-lg px-3 py-2 text-sm font-semibold mb-2 outline-none"
                />
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-brand-muted resize-none outline-none"
                />
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
                      <Check size={12} className="inline mr-1" /> Approve
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="ml-4 space-y-2">
              {mod.features.map(f => (
                <div key={f.id} className="bg-brand-bg rounded-lg px-3 py-2 flex items-center justify-between group">
                  <div>
                    <p className="text-xs font-medium text-brand-text">{f.name}</p>
                    {f.description && <p className="text-[11px] text-brand-muted">{f.description}</p>}
                  </div>
                  <button
                    onClick={() => deleteFeature(mod.id, f.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={11} className="text-red-400" />
                  </button>
                </div>
              ))}

              {addingFeature === mod.id ? (
                <div className="flex gap-2">
                  <input
                    value={newFeatureName}
                    onChange={e => setNewFeatureName(e.target.value)}
                    placeholder="Feature name..."
                    autoFocus
                    className="flex-1 border border-brand-blue rounded-lg px-3 py-1.5 text-xs outline-none"
                    onKeyDown={e => e.key === 'Enter' && handleAddFeature(mod.id)}
                  />
                  <button onClick={() => handleAddFeature(mod.id)} className="btn-primary text-xs px-3 py-1.5">Add</button>
                  <button onClick={() => setAddingFeature(null)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingFeature(mod.id)}
                  className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-blue transition-colors mt-1"
                >
                  <Plus size={12} /> Add feature
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <StepFooter step={4} canProceed={allApproved} nextLabel="Get AI Suggestions" />
    </WizardShell>
  );
}
