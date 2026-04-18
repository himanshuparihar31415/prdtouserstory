import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Cpu, BookOpen, ArrowRight, ChevronRight } from 'lucide-react';
import { mockApi } from '../mock/mockApi';
import type { Project } from '../types';

const PIPELINE_STEPS = [
  { icon: FileText, label: 'Raw Inputs', sub: 'Docs, Confluence, Transcripts' },
  { icon: Cpu, label: 'AI Understanding', sub: 'Modules & Features Extracted' },
  { icon: BookOpen, label: 'Story Generation', sub: 'User Stories + Acceptance Criteria' },
];

const PHASE_BADGES = [
  { color: 'bg-blue-100 text-blue-700', label: 'Input' },
  { color: 'bg-purple-100 text-purple-700', label: 'AI' },
  { color: 'bg-green-100 text-green-700', label: 'Stories' },
];

export default function LandingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    mockApi.getProjects().then(data => { setProjects(data); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="flex items-start justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl font-extrabold text-brand-text leading-tight mb-3">
              PRD<span className="text-brand-orange">AI</span>Studio
              <br />
              <span className="text-2xl font-semibold text-brand-muted">Powered by <span className="text-brand-blue font-bold">br<span className="text-brand-orange">AI</span>nspark</span></span>
            </h1>
            <p className="text-brand-muted text-base leading-relaxed mt-4 max-w-md">
              Transform raw product documentation into structured user stories, workflows, and sprint-ready tasks — with AI-assisted, human-in-the-loop precision.
            </p>
            <button
              onClick={() => navigate('/projects/new')}
              className="btn-primary flex items-center gap-2 mt-6 text-base px-6 py-3"
            >
              <Plus size={18} /> Create New Project
            </button>
          </div>

          {/* Decorative pipeline illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center w-80 h-48 bg-white rounded-2xl shadow-card p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="icon-circle w-10 h-10">
                      <step.icon size={18} className="text-brand-blue" />
                    </div>
                    <span className="text-[10px] font-semibold text-brand-text mt-1 text-center leading-tight">{step.label}</span>
                    <span className="text-[9px] text-brand-muted text-center leading-tight">{step.sub}</span>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && <ArrowRight size={14} className="text-brand-blue shrink-0 mb-6" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full 13-step pipeline visual */}
        <div className="mt-10 bg-white rounded-2xl shadow-card p-6 border border-gray-100">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-5">13-Step Decomposition Pipeline</h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              'Raw Inputs', 'Consolidate', 'Workflows', 'Validate', 'Suggestions',
              'Final WF', 'Stories', 'Organize', 'Dual View', 'Subtasks',
              'Interact', 'Finalize', 'Output'
            ].map((label, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold
                    ${i === 0 ? 'bg-brand-blue text-white' : 'bg-brand-icon text-brand-blue'}`}>
                    {i + 1}
                  </div>
                  <span className="text-[9px] text-brand-muted mt-1 text-center w-14 leading-tight">{label}</span>
                </div>
                {i < 12 && <ChevronRight size={12} className="text-brand-blue shrink-0 mb-4" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-text">Your Projects</h2>
          <button
            onClick={() => navigate('/projects/new')}
            className="btn-secondary flex items-center gap-2 text-xs"
          >
            <Plus size={14} /> New Project
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="step-card h-36 animate-pulse bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="step-card text-center py-16">
            <FileText size={40} className="text-brand-muted mx-auto mb-3" />
            <p className="text-brand-muted text-sm">No projects yet. Create your first one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}/steps/1`)}
                className="step-card text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="icon-circle w-10 h-10">
                    <FileText size={16} className="text-brand-blue" />
                  </div>
                  <span className="text-xs text-brand-muted">Step {p.currentStep}/13</span>
                </div>
                <h3 className="font-semibold text-brand-text text-sm mb-1 group-hover:text-brand-blue transition-colors">{p.name}</h3>
                <p className="text-xs text-brand-muted line-clamp-2">{p.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  {PHASE_BADGES.map((b, i) => (
                    <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${b.color}`}>{b.label}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
