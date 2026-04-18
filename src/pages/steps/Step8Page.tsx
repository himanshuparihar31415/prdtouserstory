import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import Badge from '../../components/common/Badge';
import { useProjectStore } from '../../store/projectStore';

const PRIORITY_COLOR: Record<string, 'red' | 'orange' | 'gray'> = { high: 'red', medium: 'orange', low: 'gray' };

export default function Step8Page() {
  const { stories, modules } = useProjectStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const groupedByModule = modules.map(mod => ({
    module: mod,
    stories: stories.filter(s => s.moduleId === mod.id),
  })).filter(g => g.stories.length > 0);

  return (
    <WizardShell step={8} title="Module-wise Story Organization" description="Stories are grouped by module and feature for clear ownership and sprint planning.">
      <div className="space-y-4">
        {groupedByModule.map(({ module: mod, stories: modStories }) => (
          <div key={mod.id} className="step-card">
            <button
              onClick={() => toggle(mod.id)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-3">
                <div className="icon-circle w-9 h-9">
                  {expanded[mod.id] ? <ChevronDown size={14} className="text-brand-blue" /> : <ChevronRight size={14} className="text-brand-blue" />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-brand-text">{mod.name}</p>
                  <p className="text-xs text-brand-muted">{modStories.length} stories</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {modStories.some(s => s.priority === 'high') && <Badge label="Has High Priority" variant="red" />}
                <Badge label={`${modStories.reduce((acc, s) => acc + s.storyPoints, 0)} pts`} variant="blue" />
              </div>
            </button>

            {expanded[mod.id] && (
              <div className="mt-4 space-y-3">
                {modStories.map(story => (
                  <div key={story.id} className="bg-brand-bg rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="icon-circle w-8 h-8 shrink-0 mt-0.5">
                          <BookOpen size={13} className="text-brand-blue" />
                        </div>
                        <div>
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {groupedByModule.length === 0 && (
          <div className="step-card flex flex-col items-center justify-center py-16 text-center">
            <BookOpen size={32} className="text-brand-muted mb-3" />
            <p className="text-sm text-brand-muted">No stories generated yet. Go back to Step 7 to generate stories.</p>
          </div>
        )}
      </div>

      <StepFooter step={8} canProceed={stories.length > 0} nextLabel="Dual View" />
    </WizardShell>
  );
}
