import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronRight, GitBranch } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import StreamingText from '../../components/common/StreamingText';
import WorkflowDiagram from '../../components/diagrams/WorkflowDiagram';
import { useProjectStore } from '../../store/projectStore';
import { MOCK_MODULES, MOCK_CONSOLIDATED, MOCK_WORKFLOWS, MOCK_STREAM_TEXTS } from '../../mock/data';

type Tab = 'understand' | 'workflows';

export default function Step2Page() {
  const { modules, setModules, setConsolidatedData, workflows, setWorkflows } = useProjectStore();
  const [tab, setTab] = useState<Tab>('understand');

  const [streamingUnderstand, setStreamingUnderstand] = useState(false);
  const [understandDone, setUnderstandDone] = useState(false);

  const [streamingWorkflows, setStreamingWorkflows] = useState(false);
  const [workflowsDone, setWorkflowsDone] = useState(false);

  const [selectedWf, setSelectedWf] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleGenerateUnderstand = () => setStreamingUnderstand(true);
  const handleUnderstandDone = () => {
    setUnderstandDone(true);
    setStreamingUnderstand(false);
    setModules(MOCK_MODULES);
    setConsolidatedData(MOCK_CONSOLIDATED);
  };

  const handleGenerateWorkflows = () => setStreamingWorkflows(true);
  const handleWorkflowsDone = () => {
    setWorkflowsDone(true);
    setStreamingWorkflows(false);
    setWorkflows(MOCK_WORKFLOWS);
  };

  const currentWf = workflows[selectedWf];

  const TABS: { key: Tab; label: string; locked: boolean }[] = [
    { key: 'understand', label: 'Understanding', locked: false },
    { key: 'workflows', label: 'Workflows', locked: !understandDone },
  ];

  return (
    <WizardShell
      step={2}
      title="AI Analysis"
      description="AI extracts your product structure, then maps user journeys and decision flows."
    >
      {/* Tab bar */}
      <div className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => !t.locked && setTab(t.key)}
            disabled={t.locked}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all
              ${tab === t.key ? 'bg-brand-active border-brand-blue text-brand-blue' : ''}
              ${!tab && !t.locked ? 'bg-white border-gray-200 text-brand-muted hover:border-brand-blue' : ''}
              ${t.locked ? 'bg-white border-gray-100 text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
              ${tab !== t.key && !t.locked ? 'bg-white border-gray-200 text-brand-muted hover:border-brand-blue' : ''}
            `}
          >
            {t.label} {t.locked && '🔒'}
          </button>
        ))}
      </div>

      {/* ── Tab: Understanding ── */}
      {tab === 'understand' && (
        <div>
          {!streamingUnderstand && !understandDone && (
            <div className="step-card flex flex-col items-center justify-center py-14 text-center">
              <div className="icon-circle w-16 h-16 mb-4">
                <Sparkles size={28} className="text-brand-blue" />
              </div>
              <h3 className="text-lg font-semibold text-brand-text mb-2">Analyse Your Inputs</h3>
              <p className="text-sm text-brand-muted max-w-sm mb-6">
                Extract modules, features, sub-features, UI structure, and relationships from all your pasted inputs.
              </p>
              <button onClick={handleGenerateUnderstand} className="btn-primary flex items-center gap-2 px-6 py-3">
                <Sparkles size={16} /> Generate Understanding
              </button>
            </div>
          )}

          {(streamingUnderstand || understandDone) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="step-card">
                <h3 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
                  <Sparkles size={14} className="text-brand-blue" /> AI Analysis
                </h3>
                <StreamingText
                  fullText={MOCK_STREAM_TEXTS.consolidation}
                  onDone={handleUnderstandDone}
                  className="max-h-96 overflow-y-auto"
                />
              </div>

              {understandDone && (
                <div>
                  <h3 className="text-sm font-semibold text-brand-text mb-4">
                    Extracted Structure ({modules.length} modules)
                  </h3>
                  <div className="space-y-3">
                    {modules.map(mod => (
                      <div key={mod.id} className="step-card">
                        <button onClick={() => toggle(mod.id)} className="flex items-center gap-3 w-full text-left">
                          <div className="icon-circle w-8 h-8 shrink-0">
                            {expanded[mod.id]
                              ? <ChevronDown size={14} className="text-brand-blue" />
                              : <ChevronRight size={14} className="text-brand-blue" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-brand-text">{mod.name}</p>
                            <p className="text-xs text-brand-muted">{mod.features.length} features</p>
                          </div>
                        </button>
                        {expanded[mod.id] && (
                          <div className="mt-3 ml-11 space-y-2">
                            {mod.features.map(f => (
                              <div key={f.id} className="bg-brand-bg rounded-lg p-2.5">
                                <p className="text-xs font-medium text-brand-text">{f.name}</p>
                                <p className="text-xs text-brand-muted mt-0.5">{f.description}</p>
                                {f.subFeatures.length > 0 && (
                                  <div className="mt-2 ml-3 space-y-1">
                                    {f.subFeatures.map(sf => (
                                      <p key={sf.id} className="text-[11px] text-brand-muted">• {sf.name}</p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setTab('workflows')}
                    className="btn-primary mt-4 flex items-center gap-2 text-xs"
                  >
                    <GitBranch size={14} /> Next: Generate Workflows →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Workflows ── */}
      {tab === 'workflows' && (
        <div>
          {!streamingWorkflows && !workflowsDone && (
            <div className="step-card flex flex-col items-center justify-center py-14 text-center">
              <div className="icon-circle w-16 h-16 mb-4">
                <GitBranch size={28} className="text-brand-blue" />
              </div>
              <h3 className="text-lg font-semibold text-brand-text mb-2">Generate Workflows</h3>
              <p className="text-sm text-brand-muted max-w-sm mb-6">
                Map user journeys, decision points, happy paths, and alternate flows for each module.
              </p>
              <button onClick={handleGenerateWorkflows} className="btn-primary flex items-center gap-2 px-6 py-3">
                <Sparkles size={16} /> Generate Workflows
              </button>
            </div>
          )}

          {(streamingWorkflows || workflowsDone) && (
            <div className="space-y-6">
              <div className="step-card">
                <h3 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
                  <Sparkles size={14} className="text-brand-blue" /> Workflow Analysis
                </h3>
                <StreamingText fullText={MOCK_STREAM_TEXTS.workflows} onDone={handleWorkflowsDone} />
              </div>

              {workflowsDone && workflows.length > 0 && (
                <div>
                  <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                    {workflows.map((wf, i) => (
                      <button
                        key={wf.id}
                        onClick={() => setSelectedWf(i)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all
                          ${selectedWf === i ? 'bg-brand-active border-brand-blue text-brand-blue' : 'bg-white border-gray-200 text-brand-muted hover:border-brand-blue'}`}
                      >
                        {wf.name}
                      </button>
                    ))}
                  </div>

                  {currentWf && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <WorkflowDiagram nodes={currentWf.diagramData.nodes} edges={currentWf.diagramData.edges} height={420} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <StepFooter step={2} canProceed={workflowsDone} nextLabel="Validate & Refine" />
    </WizardShell>
  );
}
