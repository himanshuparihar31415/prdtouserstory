import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import StreamingText from '../../components/common/StreamingText';
import { useProjectStore } from '../../store/projectStore';
import { MOCK_MODULES, MOCK_CONSOLIDATED, MOCK_STREAM_TEXTS } from '../../mock/data';

export default function Step2Page() {
  const { modules, setModules, setConsolidatedData } = useProjectStore();
  const [streaming, setStreaming] = useState(false);
  const [streamDone, setStreamDone] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleGenerate = () => {
    setStreaming(true);
  };

  const handleStreamDone = () => {
    setStreamDone(true);
    setStreaming(false);
    setModules(MOCK_MODULES);
    setConsolidatedData(MOCK_CONSOLIDATED);
  };

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <WizardShell step={2} title="Consolidated Understanding" description="AI analyzes all your inputs and extracts a structured representation of modules, features, and relationships.">
      {!streaming && !streamDone && (
        <div className="step-card flex flex-col items-center justify-center py-16 text-center">
          <div className="icon-circle w-16 h-16 mb-4">
            <Sparkles size={28} className="text-brand-blue" />
          </div>
          <h3 className="text-lg font-semibold text-brand-text mb-2">Ready to Analyze</h3>
          <p className="text-sm text-brand-muted max-w-sm mb-6">Click below to let AI extract modules, features, sub-features, UI structure, and relationships from your inputs.</p>
          <button onClick={handleGenerate} className="btn-primary flex items-center gap-2 px-6 py-3">
            <Sparkles size={16} /> Generate Understanding
          </button>
        </div>
      )}

      {(streaming || streamDone) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Streaming text panel */}
          <div className="step-card">
            <h3 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-brand-blue" /> AI Analysis
            </h3>
            <StreamingText
              fullText={MOCK_STREAM_TEXTS.consolidation}
              onDone={handleStreamDone}
              className="max-h-96 overflow-y-auto"
            />
          </div>

          {/* Module tree */}
          {streamDone && (
            <div>
              <h3 className="text-sm font-semibold text-brand-text mb-4">Extracted Structure ({modules.length} modules)</h3>
              <div className="space-y-3">
                {modules.map(mod => (
                  <div key={mod.id} className="step-card">
                    <button
                      onClick={() => toggle(mod.id)}
                      className="flex items-center gap-3 w-full text-left"
                    >
                      <div className="icon-circle w-8 h-8 shrink-0">
                        {expanded[mod.id] ? <ChevronDown size={14} className="text-brand-blue" /> : <ChevronRight size={14} className="text-brand-blue" />}
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
            </div>
          )}
        </div>
      )}

      <StepFooter step={2} canProceed={streamDone} nextLabel="Generate Workflows" />
    </WizardShell>
  );
}
