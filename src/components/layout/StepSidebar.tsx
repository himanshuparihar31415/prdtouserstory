import { Check, Lock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWizardStore } from '../../store/wizardStore';

const STEPS = [
  { n: 1, label: 'Raw Input Ingestion' },
  { n: 2, label: 'Workflow Editor' },
  { n: 3, label: 'Validate & Refine' },
  { n: 4, label: 'Story Reviewer' },
  { n: 5, label: 'Story Editing' },
  { n: 6, label: 'Finalize & Export' },
];

export default function StepSidebar() {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentStep, completedSteps, canNavigateTo } = useWizardStore();
  const navigate = useNavigate();

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-4 overflow-y-auto shrink-0">
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Progress</p>
        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-blue rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps.size / 6) * 100}%` }}
          />
        </div>
        <p className="text-xs text-brand-muted mt-1">{completedSteps.size}/6 steps complete</p>
      </div>

      <div className="flex flex-col gap-0.5 px-2">
        {STEPS.map(step => {
          const isCompleted = completedSteps.has(step.n);
          const isActive = currentStep === step.n;
          const isLocked = !canNavigateTo(step.n);

          return (
            <button
              key={step.n}
              onClick={() => { if (!isLocked) navigate(`/projects/${projectId}/steps/${step.n}`); }}
              disabled={isLocked}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150
                ${isActive ? 'bg-brand-active border border-brand-blue' : ''}
                ${isCompleted && !isActive ? 'hover:bg-gray-50' : ''}
                ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold
                ${isCompleted ? 'bg-green-100 text-green-700' : ''}
                ${isActive && !isCompleted ? 'bg-brand-blue text-white' : ''}
                ${!isActive && !isCompleted ? 'bg-gray-100 text-brand-muted' : ''}
              `}>
                {isCompleted ? <Check size={12} /> : isLocked ? <Lock size={10} /> : step.n}
              </div>
              <span className={`text-xs leading-tight ${isActive ? 'font-semibold text-brand-blue' : isCompleted ? 'text-brand-text' : 'text-brand-muted'}`}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
