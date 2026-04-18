import { useState } from 'react';
import { Sparkles, GitBranch } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import StreamingText from '../../components/common/StreamingText';
import WorkflowDiagram from '../../components/diagrams/WorkflowDiagram';
import { useProjectStore } from '../../store/projectStore';
import { MOCK_WORKFLOWS, MOCK_STREAM_TEXTS } from '../../mock/data';

export default function Step3Page() {
  const { workflows, setWorkflows } = useProjectStore();
  const [streaming, setStreaming] = useState(false);
  const [streamDone, setStreamDone] = useState(false);
  const [selectedWf, setSelectedWf] = useState(0);

  const handleGenerate = () => setStreaming(true);
  const handleStreamDone = () => {
    setStreamDone(true);
    setStreaming(false);
    setWorkflows(MOCK_WORKFLOWS);
  };

  const currentWf = workflows[selectedWf];

  return (
    <WizardShell step={3} title="Workflow / Decision Flow Generation" description="AI generates end-to-end user journeys, decision flows, and alternate paths from your product structure.">
      {!streaming && !streamDone && (
        <div className="step-card flex flex-col items-center justify-center py-16 text-center">
          <div className="icon-circle w-16 h-16 mb-4">
            <GitBranch size={28} className="text-brand-blue" />
          </div>
          <h3 className="text-lg font-semibold text-brand-text mb-2">Generate Workflows</h3>
          <p className="text-sm text-brand-muted max-w-sm mb-6">AI will map user journeys, decision points, happy paths, and alternate flows for each module.</p>
          <button onClick={handleGenerate} className="btn-primary flex items-center gap-2 px-6 py-3">
            <Sparkles size={16} /> Generate Workflows
          </button>
        </div>
      )}

      {(streaming || streamDone) && (
        <div className="space-y-6">
          {/* Streaming text */}
          <div className="step-card">
            <h3 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-brand-blue" /> Workflow Analysis
            </h3>
            <StreamingText fullText={MOCK_STREAM_TEXTS.workflows} onDone={handleStreamDone} />
          </div>

          {/* Workflow tabs + diagram */}
          {streamDone && workflows.length > 0 && (
            <div>
              <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                {workflows.map((wf, i) => (
                  <button
                    key={wf.id}
                    onClick={() => setSelectedWf(i)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                      selectedWf === i ? 'bg-brand-active border-brand-blue text-brand-blue' : 'bg-white border-gray-200 text-brand-muted hover:border-brand-blue'
                    }`}
                  >
                    {wf.name}
                  </button>
                ))}
              </div>

              {currentWf && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Text steps */}
                  <div className="step-card">
                    <h3 className="text-sm font-semibold text-brand-text mb-1">{currentWf.name}</h3>
                    <p className="text-xs text-brand-muted mb-4">{currentWf.description}</p>
                    <div className="space-y-2">
                      {currentWf.steps.map((s, i) => (
                        <div key={s.id} className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5
                            ${s.type === 'start' ? 'bg-green-100 text-green-700' : ''}
                            ${s.type === 'end' ? 'bg-red-100 text-red-700' : ''}
                            ${s.type === 'action' ? 'bg-brand-icon text-brand-blue' : ''}
                            ${s.type === 'decision' ? 'bg-yellow-100 text-yellow-700' : ''}
                          `}>{i + 1}</div>
                          <div>
                            <p className="text-xs font-medium text-brand-text">{s.label}</p>
                            <p className="text-xs text-brand-muted">{s.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Diagram */}
                  <WorkflowDiagram nodes={currentWf.diagramData.nodes} edges={currentWf.diagramData.edges} height={420} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <StepFooter step={3} canProceed={streamDone} nextLabel="Validate Structure" />
    </WizardShell>
  );
}
