import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, FileText, GitBranch, CheckCircle2, BookOpen,
  Edit2, Download, ArrowRight, ChevronRight, Sparkles,
} from 'lucide-react';
import { mockApi } from '../mock/mockApi';
import type { Project } from '../types';

const STEPS = [
  {
    n: 1,
    icon: FileText,
    label: 'Raw Input Ingestion',
    sub: 'Paste docs, Confluence pages, transcripts',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200',
    badge: { color: 'bg-indigo-100 text-indigo-700', label: 'Input' },
  },
  {
    n: 2,
    icon: GitBranch,
    label: 'Workflow Editor',
    sub: 'AI understanding + drag-and-drop flow builder',
    color: 'text-violet-600',
    bg: 'bg-violet-50 border-violet-200',
    badge: { color: 'bg-violet-100 text-violet-700', label: 'AI' },
  },
  {
    n: 3,
    icon: CheckCircle2,
    label: 'Validate & Refine',
    sub: 'Edit modules, approve, get inline gap suggestions',
    color: 'text-sky-600',
    bg: 'bg-sky-50 border-sky-200',
    badge: { color: 'bg-sky-100 text-sky-700', label: 'Review' },
  },
  {
    n: 4,
    icon: BookOpen,
    label: 'Story Reviewer',
    sub: 'Generate stories alongside the workflow chart',
    color: 'text-brand-blue',
    bg: 'bg-brand-active border-brand-blue/30',
    badge: { color: 'bg-blue-100 text-brand-blue', label: 'Stories' },
  },
  {
    n: 5,
    icon: Edit2,
    label: 'Story Editing',
    sub: 'Fine-tune roles, actions, and acceptance criteria',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    badge: { color: 'bg-amber-100 text-amber-700', label: 'Edit' },
  },
  {
    n: 6,
    icon: Download,
    label: 'Finalize & Export',
    sub: 'Approve stories, export JSON or Markdown',
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200',
    badge: { color: 'bg-green-100 text-green-700', label: 'Export' },
  },
];

const HERO_PHASES = [
  { icon: FileText,  label: 'Raw Inputs',      sub: 'Docs · Confluence · Transcripts' },
  { icon: Sparkles,  label: 'AI Analysis',     sub: 'Modules · Workflows · Gaps' },
  { icon: BookOpen,  label: 'Sprint-Ready',    sub: 'Stories · ACs · Export' },
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
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="flex items-start justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl font-extrabold text-brand-text leading-tight mb-3">
              PRD<span className="text-brand-orange">AI</span>Studio
              <br />
              <span className="text-2xl font-semibold text-brand-muted">
                Powered by <span className="text-brand-blue font-bold">br<span className="text-brand-orange">AI</span>nspark</span>
              </span>
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

          {/* Decorative 3-phase illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center w-80 h-48 bg-white rounded-2xl shadow-card p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              {HERO_PHASES.map((phase, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="icon-circle w-10 h-10">
                      <phase.icon size={18} className="text-brand-blue" />
                    </div>
                    <span className="text-[10px] font-semibold text-brand-text mt-1 text-center leading-tight">{phase.label}</span>
                    <span className="text-[9px] text-brand-muted text-center leading-tight w-20">{phase.sub}</span>
                  </div>
                  {i < HERO_PHASES.length - 1 && <ArrowRight size={14} className="text-brand-blue shrink-0 mb-6" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 6-Step Pipeline Visual ────────────────────────────────── */}
        <div className="mt-10 bg-white rounded-2xl shadow-card p-6 border border-gray-100">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-6">
            6-Step Decomposition Pipeline
          </h2>

          {/* Step cards row */}
          <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
            {STEPS.map((step, i) => (
              <div key={step.n} className="flex items-center gap-0 shrink-0">
                <div className={`flex flex-col items-center text-center px-4 py-3 rounded-xl border ${step.bg} w-36`}>
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm mb-2 border border-gray-100">
                    <step.icon size={16} className={step.color} />
                  </div>
                  <div className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center mb-1.5
                    ${i === 0 ? 'bg-brand-blue text-white' : 'bg-white border border-gray-200 text-brand-muted'}`}>
                    {step.n}
                  </div>
                  <p className="text-[11px] font-semibold text-brand-text leading-tight mb-0.5">{step.label}</p>
                  <p className="text-[9px] text-brand-muted leading-tight">{step.sub}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={14} className="text-brand-blue shrink-0 mx-1 self-center" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Projects ─────────────────────────────────────────────────── */}
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
            {projects.map(p => {
              const step = STEPS[Math.min(p.currentStep - 1, STEPS.length - 1)];
              return (
                <button
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}/steps/1`)}
                  className="step-card text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="icon-circle w-10 h-10">
                      <FileText size={16} className="text-brand-blue" />
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${step.badge.color}`}>
                      Step {p.currentStep}/6 · {step.badge.label}
                    </span>
                  </div>
                  <h3 className="font-semibold text-brand-text text-sm mb-1 group-hover:text-brand-blue transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-brand-muted line-clamp-2">{p.description}</p>

                  {/* Mini step progress dots */}
                  <div className="flex items-center gap-1 mt-3">
                    {STEPS.map(s => (
                      <div
                        key={s.n}
                        className={`h-1.5 rounded-full flex-1 transition-all ${s.n <= p.currentStep ? 'bg-brand-blue' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[9px] text-brand-muted mt-1">{p.currentStep}/6 steps</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
