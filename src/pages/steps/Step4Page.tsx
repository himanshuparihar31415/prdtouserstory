import { useState } from 'react';
import { Sparkles, BookOpen, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import StreamingText from '../../components/common/StreamingText';
import Badge from '../../components/common/Badge';
import { useProjectStore } from '../../store/projectStore';
import { MOCK_STORIES, MOCK_STREAM_TEXTS } from '../../mock/data';

const PRIORITY_COLOR: Record<string, 'red' | 'orange' | 'gray'> = { high: 'red', medium: 'orange', low: 'gray' };

export default function Step4Page() {
  const { stories, setStories, modules } = useProjectStore();
  const [streaming, setStreaming] = useState(false);
  const [streamDone, setStreamDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleGenerate = () => {
    setStreaming(true);
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

  const groupedByModule = modules.map(mod => ({
    module: mod,
    stories: stories.filter(s => s.moduleId === mod.id),
  })).filter(g => g.stories.length > 0);

  return (
    <WizardShell step={4} title="Story Generation" description="AI generates user stories from your workflows, then organises them by module for review.">
      {/* Generate section */}
      {!streaming && !streamDone && (
        <div className="step-card flex flex-col items-center justify-center py-14 text-center mb-6">
          <div className="icon-circle w-16 h-16 mb-4">
            <BookOpen size={28} className="text-brand-blue" />
          </div>
          <h3 className="text-lg font-semibold text-brand-text mb-2">Generate User Stories</h3>
          <p className="text-sm text-brand-muted max-w-sm mb-6">
            AI will create stories for every feature across all modules, with full acceptance criteria and dependency mapping.
          </p>
          <button onClick={handleGenerate} className="btn-primary flex items-center gap-2 px-6 py-3">
            <Sparkles size={16} /> Generate Stories
          </button>
        </div>
      )}

      {(streaming || streamDone) && (
        <div className="space-y-6 mb-6">
          {streaming && (
            <div className="step-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-brand-text">Generating stories...</span>
                <span className="text-sm text-brand-blue font-semibold">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-brand-blue rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <StreamingText fullText={MOCK_STREAM_TEXTS.stories} onDone={handleStreamDone} />
            </div>
          )}

          {streamDone && (
            <div className="step-card bg-green-50/50 border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-800">{stories.length} User Stories Generated</p>
                  <p className="text-xs text-green-700">
                    Across {new Set(stories.map(s => s.moduleId)).size} modules with full acceptance criteria and dependencies
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Organised stories — shown once generation is done */}
      {streamDone && groupedByModule.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-brand-text mb-4">Stories by Module</h3>
          <div className="space-y-4">
            {groupedByModule.map(({ module: mod, stories: modStories }) => (
              <div key={mod.id} className="step-card">
                <button onClick={() => toggle(mod.id)} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="icon-circle w-9 h-9">
                      {expanded[mod.id]
                        ? <ChevronDown size={14} className="text-brand-blue" />
                        : <ChevronRight size={14} className="text-brand-blue" />}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-brand-text">{mod.name}</p>
                      <p className="text-xs text-brand-muted">{modStories.length} stories</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {modStories.some(s => s.priority === 'high') && <Badge label="High Priority" variant="red" />}
                    <Badge label={`${modStories.reduce((acc, s) => acc + s.storyPoints, 0)} pts`} variant="blue" />
                  </div>
                </button>

                {expanded[mod.id] && (
                  <div className="mt-4 space-y-3">
                    {modStories.map(story => (
                      <div key={story.id} className="bg-brand-bg rounded-xl p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-brand-text">{story.title}</span>
                          <Badge label={story.priority} variant={PRIORITY_COLOR[story.priority]} />
                          <Badge label={`${story.storyPoints} pts`} variant="gray" />
                        </div>
                        <p className="text-xs text-brand-muted">
                          As a <span className="font-medium text-brand-text">{story.asA}</span>, I want {story.iWant}
                        </p>
                        <p className="text-xs text-brand-muted mt-1">
                          {story.acceptanceCriteria.length} ACs · {story.dependencies.length} dependencies
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <StepFooter step={4} canProceed={streamDone} nextLabel="Story Review" />
    </WizardShell>
  );
}
