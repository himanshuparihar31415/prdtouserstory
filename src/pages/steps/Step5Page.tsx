import { useState } from 'react';
import { Sparkles, Check, X, Lightbulb, AlertTriangle, GitBranch, Layers } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import StreamingText from '../../components/common/StreamingText';
import Badge from '../../components/common/Badge';
import { useProjectStore } from '../../store/projectStore';
import { MOCK_SUGGESTIONS, MOCK_STREAM_TEXTS } from '../../mock/data';
import type { SuggestionType } from '../../types';

const TYPE_ICONS: Record<SuggestionType, { icon: typeof Lightbulb; label: string; color: 'blue' | 'orange' | 'purple' | 'green' }> = {
  feature: { icon: Lightbulb, label: 'Feature', color: 'blue' },
  edge_case: { icon: AlertTriangle, label: 'Edge Case', color: 'orange' },
  flow: { icon: GitBranch, label: 'Flow', color: 'purple' },
  module: { icon: Layers, label: 'Module', color: 'green' },
};

const PRIORITY_COLOR: Record<string, 'red' | 'orange' | 'gray'> = { high: 'red', medium: 'orange', low: 'gray' };

export default function Step5Page() {
  const { suggestions, setSuggestions, updateSuggestionStatus } = useProjectStore();
  const [streaming, setStreaming] = useState(false);
  const [streamDone, setStreamDone] = useState(false);

  const handleGenerate = () => setStreaming(true);
  const handleStreamDone = () => {
    setStreamDone(true);
    setStreaming(false);
    setSuggestions(MOCK_SUGGESTIONS);
  };

  const accepted = suggestions.filter(s => s.status === 'accepted').length;
  const pending = suggestions.filter(s => s.status === 'pending').length;

  return (
    <WizardShell step={5} title="Suggestion Layer" description="AI reviews your approved product structure and identifies gaps, missing features, and edge cases. Accept or reject each suggestion.">
      {!streaming && !streamDone && (
        <div className="step-card flex flex-col items-center justify-center py-16 text-center">
          <div className="icon-circle w-16 h-16 mb-4">
            <Lightbulb size={28} className="text-brand-blue" />
          </div>
          <h3 className="text-lg font-semibold text-brand-text mb-2">Find Gaps & Improvements</h3>
          <p className="text-sm text-brand-muted max-w-sm mb-6">AI will analyze your approved modules and workflows to suggest missing features, edge cases, and logic gaps.</p>
          <button onClick={handleGenerate} className="btn-primary flex items-center gap-2 px-6 py-3">
            <Sparkles size={16} /> Analyze & Suggest
          </button>
        </div>
      )}

      {streaming && (
        <div className="step-card">
          <h3 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
            <Sparkles size={14} className="text-brand-blue" /> Analyzing product structure...
          </h3>
          <StreamingText fullText={MOCK_STREAM_TEXTS.suggestions} onDone={handleStreamDone} />
        </div>
      )}

      {streamDone && (
        <div>
          <div className="flex items-center gap-4 mb-5">
            <span className="text-sm text-brand-muted">{suggestions.length} suggestions found</span>
            <span className="text-sm text-green-600 font-medium">{accepted} accepted</span>
            <span className="text-sm text-brand-muted">{pending} pending</span>
          </div>
          <div className="space-y-4">
            {suggestions.map(sug => {
              const typeInfo = TYPE_ICONS[sug.type];
              return (
                <div
                  key={sug.id}
                  className={`step-card border-l-4 transition-all
                    ${sug.status === 'accepted' ? 'border-green-400 bg-green-50/30' : ''}
                    ${sug.status === 'rejected' ? 'border-gray-200 opacity-50' : ''}
                    ${sug.status === 'pending' ? 'border-brand-blue' : ''}
                  `}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="icon-circle w-9 h-9 shrink-0 mt-0.5">
                        <typeInfo.icon size={14} className="text-brand-blue" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-brand-text">{sug.title}</span>
                          <Badge label={typeInfo.label} variant={typeInfo.color} />
                          <Badge label={sug.priority} variant={PRIORITY_COLOR[sug.priority]} />
                          {sug.affectedModule && <span className="text-xs text-brand-muted">→ {sug.affectedModule}</span>}
                        </div>
                        <p className="text-xs text-brand-muted mb-1">{sug.description}</p>
                        <p className="text-xs text-brand-muted italic">💡 {sug.rationale}</p>
                      </div>
                    </div>

                    {sug.status === 'pending' && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => updateSuggestionStatus(sug.id, 'accepted')} className="btn-success flex items-center gap-1">
                          <Check size={12} /> Accept
                        </button>
                        <button onClick={() => updateSuggestionStatus(sug.id, 'rejected')} className="btn-danger flex items-center gap-1">
                          <X size={12} /> Reject
                        </button>
                      </div>
                    )}
                    {sug.status === 'accepted' && (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium shrink-0">
                        <Check size={12} /> Accepted
                      </span>
                    )}
                    {sug.status === 'rejected' && (
                      <span className="flex items-center gap-1 text-xs text-brand-muted shrink-0">
                        <X size={12} /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <StepFooter step={5} canProceed={streamDone} nextLabel="View Final Workflow" />
    </WizardShell>
  );
}
