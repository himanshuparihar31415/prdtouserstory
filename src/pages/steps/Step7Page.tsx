import { useState } from 'react';
import { Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import StreamingText from '../../components/common/StreamingText';
import { useProjectStore } from '../../store/projectStore';
import { MOCK_STORIES, MOCK_STREAM_TEXTS } from '../../mock/data';

export default function Step7Page() {
  const { stories, setStories } = useProjectStore();
  const [streaming, setStreaming] = useState(false);
  const [streamDone, setStreamDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setStreaming(true);
    // Simulate progress bar
    let p = 0;
    const id = setInterval(() => {
      p += 2;
      setProgress(Math.min(p, 90));
      if (p >= 90) clearInterval(id);
    }, 100);
  };

  const handleStreamDone = () => {
    setProgress(100);
    setTimeout(() => {
      setStreamDone(true);
      setStreaming(false);
      setStories(MOCK_STORIES);
    }, 300);
  };

  return (
    <WizardShell step={7} title="Story Suggestion Generation" description="AI generates comprehensive user stories, acceptance criteria, dependencies, and edge cases from your finalized workflows.">
      {!streaming && !streamDone && (
        <div className="step-card flex flex-col items-center justify-center py-16 text-center">
          <div className="icon-circle w-16 h-16 mb-4">
            <BookOpen size={28} className="text-brand-blue" />
          </div>
          <h3 className="text-lg font-semibold text-brand-text mb-2">Generate User Stories</h3>
          <p className="text-sm text-brand-muted max-w-sm mb-6">AI will create stories for every feature across all modules, with full acceptance criteria and dependency mapping.</p>
          <button onClick={handleGenerate} className="btn-primary flex items-center gap-2 px-6 py-3">
            <Sparkles size={16} /> Generate Stories
          </button>
        </div>
      )}

      {(streaming || streamDone) && (
        <div className="space-y-6">
          {/* Progress bar */}
          {streaming && (
            <div className="step-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-brand-text">Generating stories...</span>
                <span className="text-sm text-brand-blue font-semibold">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-blue rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="step-card">
            <h3 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-brand-blue" /> Story Generation Log
            </h3>
            <StreamingText fullText={MOCK_STREAM_TEXTS.stories} onDone={handleStreamDone} />
          </div>

          {streamDone && (
            <div className="step-card bg-green-50/50 border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-800">{stories.length} User Stories Generated</p>
                  <p className="text-xs text-green-700">Stories span {new Set(stories.map(s => s.moduleId)).size} modules with full acceptance criteria and dependencies</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <StepFooter step={7} canProceed={streamDone} nextLabel="Organize by Module" />
    </WizardShell>
  );
}
