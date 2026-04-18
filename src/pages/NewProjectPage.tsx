import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { mockApi } from '../mock/mockApi';
import { useWizardStore } from '../store/wizardStore';

export default function NewProjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setProjectId } = useWizardStore();

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const project = await mockApi.createProject(name, description);
    setProjectId(project.id);
    navigate(`/projects/${project.id}/steps/1`);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-lg">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-brand-muted text-sm hover:text-brand-text transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Projects
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="icon-circle">
            <Sparkles size={20} className="text-brand-blue" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-text">New Project</h1>
            <p className="text-xs text-brand-muted">Start your product decomposition journey</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-brand-text block mb-1.5">Project Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. E-Commerce Platform"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-text block mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of what you're building..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-brand-text placeholder-brand-muted outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={!name.trim() || loading}
          className={`btn-primary w-full mt-6 py-3 text-sm flex items-center justify-center gap-2 ${!name.trim() || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating...</>
          ) : (
            <><Sparkles size={16} /> Create & Start</>
          )}
        </button>
      </div>
    </div>
  );
}
