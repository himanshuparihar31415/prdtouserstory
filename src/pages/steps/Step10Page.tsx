import { useState } from 'react';
import { Sparkles, Database, Monitor, TestTube, ChevronDown, ChevronRight } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import StreamingText from '../../components/common/StreamingText';
import Badge from '../../components/common/Badge';
import { useProjectStore } from '../../store/projectStore';
import { MOCK_SUBTASKS, MOCK_STREAM_TEXTS } from '../../mock/data';
import type { SubTaskType } from '../../types';

const TYPE_CONFIG: Record<SubTaskType, { icon: typeof Database; label: string; color: string; badge: 'blue' | 'purple' | 'green' }> = {
  backend: { icon: Database, label: 'Backend', color: 'text-blue-600', badge: 'blue' },
  frontend: { icon: Monitor, label: 'Frontend', color: 'text-purple-600', badge: 'purple' },
  qa: { icon: TestTube, label: 'QA', color: 'text-green-600', badge: 'green' },
};

export default function Step10Page() {
  const { stories, modules, subtasks, setSubtasks } = useProjectStore();
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [streamDoneFor, setStreamDoneFor] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleGenerate = (storyId: string) => setGeneratingFor(storyId);

  const handleStreamDone = (storyId: string) => {
    setGeneratingFor(null);
    setStreamDoneFor(prev => new Set([...prev, storyId]));
    setSubtasks([...subtasks, ...MOCK_SUBTASKS.filter(st => st.storyId === storyId && !subtasks.find(s => s.id === st.id))]);
    setExpanded(prev => ({ ...prev, [storyId]: true }));
  };

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <WizardShell step={10} title="Sub-task Generation" description="Each story is broken down into Backend, Frontend, and QA tasks.">
      <div className="space-y-4">
        {stories.map(story => {
          const mod = modules.find(m => m.id === story.moduleId);
          const storySubtasks = subtasks.filter(st => st.storyId === story.id);
          const hasSubtasks = streamDoneFor.has(story.id) || storySubtasks.length > 0;
          const isGenerating = generatingFor === story.id;

          return (
            <div key={story.id} className="step-card">
              <div className="flex items-center justify-between">
                <button onClick={() => toggle(story.id)} className="flex items-center gap-3 flex-1 text-left">
                  <div className="icon-circle w-8 h-8 shrink-0">
                    {expanded[story.id] ? <ChevronDown size={14} className="text-brand-blue" /> : <ChevronRight size={14} className="text-brand-blue" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-text">{story.title}</p>
                    {mod && <p className="text-xs text-brand-muted">{mod.name}</p>}
                  </div>
                </button>
                {!hasSubtasks && !isGenerating && (
                  <button onClick={() => handleGenerate(story.id)} className="btn-primary text-xs flex items-center gap-1.5">
                    <Sparkles size={12} /> Generate Subtasks
                  </button>
                )}
                {hasSubtasks && <Badge label={`${storySubtasks.length} tasks`} variant="blue" />}
              </div>

              {isGenerating && (
                <div className="mt-4 bg-brand-bg rounded-xl p-4">
                  <StreamingText
                    fullText={MOCK_STREAM_TEXTS.subtasks}
                    onDone={() => handleStreamDone(story.id)}
                    className="text-xs"
                  />
                </div>
              )}

              {expanded[story.id] && hasSubtasks && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(['backend', 'frontend', 'qa'] as SubTaskType[]).map(type => {
                    const cfg = TYPE_CONFIG[type];
                    const tasks = storySubtasks.filter(st => st.type === type);
                    return (
                      <div key={type} className="bg-brand-bg rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <cfg.icon size={14} className={cfg.color} />
                          <span className="text-xs font-semibold text-brand-text">{cfg.label}</span>
                          <Badge label={String(tasks.length)} variant={cfg.badge} />
                        </div>
                        <div className="space-y-2">
                          {tasks.map(task => (
                            <div key={task.id} className="bg-white rounded-lg p-2.5 shadow-sm">
                              <p className="text-xs font-medium text-brand-text">{task.title}</p>
                              <p className="text-[11px] text-brand-muted mt-0.5">{task.description}</p>
                            </div>
                          ))}
                          {tasks.length === 0 && (
                            <p className="text-[11px] text-brand-muted text-center py-2">Generate subtasks above</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <StepFooter step={10} canProceed={stories.length > 0} nextLabel="Edit Stories" />
    </WizardShell>
  );
}
