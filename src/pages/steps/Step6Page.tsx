import { Check, GitBranch, Layers, Lightbulb } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import WorkflowDiagram from '../../components/diagrams/WorkflowDiagram';
import Badge from '../../components/common/Badge';
import { useProjectStore } from '../../store/projectStore';

export default function Step6Page() {
  const { modules, workflows, suggestions } = useProjectStore();
  const accepted = suggestions.filter(s => s.status === 'accepted');
  const approvedModules = modules.filter(m => m.isApproved);
  const approvedWorkflows = workflows.filter(w => w.isApproved);

  return (
    <WizardShell step={6} title="Finalized Workflow Output" description="This is your approved product baseline — the source of truth for story generation.">
      <div className="space-y-6">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Layers, label: 'Modules', value: approvedModules.length, color: 'text-brand-blue' },
            { icon: GitBranch, label: 'Workflows', value: approvedWorkflows.length || workflows.length, color: 'text-purple-600' },
            { icon: Lightbulb, label: 'Accepted Suggestions', value: accepted.length, color: 'text-green-600' },
          ].map((stat, i) => (
            <div key={i} className="step-card flex items-center gap-4">
              <div className="icon-circle">
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-text">{stat.value}</p>
                <p className="text-xs text-brand-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modules summary */}
        <div className="step-card">
          <h3 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
            <Layers size={14} className="text-brand-blue" /> Approved Modules & Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {modules.map(mod => (
              <div key={mod.id} className="bg-brand-bg rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check size={14} className="text-green-600" />
                  <span className="text-sm font-semibold text-brand-text">{mod.name}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {mod.features.map(f => (
                    <Badge key={f.id} label={f.name} variant="gray" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accepted suggestions */}
        {accepted.length > 0 && (
          <div className="step-card">
            <h3 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
              <Lightbulb size={14} className="text-green-600" /> Incorporated Suggestions
            </h3>
            <div className="space-y-2">
              {accepted.map(s => (
                <div key={s.id} className="flex items-center gap-3 bg-green-50/50 rounded-lg px-3 py-2">
                  <Check size={13} className="text-green-600 shrink-0" />
                  <span className="text-xs font-medium text-brand-text">{s.title}</span>
                  <span className="text-xs text-brand-muted">{s.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workflows */}
        {workflows.length > 0 && (
          <div className="step-card">
            <h3 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
              <GitBranch size={14} className="text-brand-blue" /> Workflows
            </h3>
            <div className="space-y-4">
              {workflows.map(wf => (
                <div key={wf.id}>
                  <p className="text-sm font-semibold text-brand-text mb-3">{wf.name}</p>
                  <WorkflowDiagram nodes={wf.diagramData.nodes} edges={wf.diagramData.edges} height={300} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <StepFooter step={6} nextLabel="Generate Stories" canProceed={true} />
    </WizardShell>
  );
}
