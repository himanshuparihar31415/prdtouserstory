import { useState } from 'react';
import { Download, CheckCircle2, Layers, BookOpen, Database, ChevronDown, ChevronRight } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import Badge from '../../components/common/Badge';
import { useProjectStore } from '../../store/projectStore';
import { buildExportJson, buildExportMarkdown } from '../../lib/diagramUtils';

const PRIORITY_COLOR: Record<string, 'red' | 'orange' | 'gray'> = { high: 'red', medium: 'orange', low: 'gray' };

export default function Step13Page() {
  const { modules, stories, subtasks } = useProjectStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const finalStories = stories.filter(s => s.isFinalized);
  const totalPoints = finalStories.reduce((acc, s) => acc + s.storyPoints, 0);

  const exportJson = () => {
    const data = { modules, stories: finalStories, subtasks };
    const json = buildExportJson(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'product-stories.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const exportMd = () => {
    const md = buildExportMarkdown({ modules, stories: finalStories });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'product-stories.md'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <WizardShell step={13} title="Final Output" description="Your complete structured output — module breakdown, user stories, acceptance criteria, dependencies, and sub-tasks.">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { icon: Layers, label: 'Modules', value: modules.length, color: 'text-brand-blue' },
          { icon: BookOpen, label: 'Stories', value: finalStories.length, color: 'text-purple-600' },
          { icon: Database, label: 'Total Points', value: totalPoints, color: 'text-green-600' },
          { icon: CheckCircle2, label: 'Sub-tasks', value: subtasks.length, color: 'text-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="step-card flex items-center gap-3 p-4">
            <div className="icon-circle w-9 h-9">
              <stat.icon size={16} className={stat.color} />
            </div>
            <div>
              <p className="text-xl font-bold text-brand-text">{stat.value}</p>
              <p className="text-xs text-brand-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Export buttons */}
      <div className="flex gap-3 mb-6">
        <button onClick={exportJson} className="btn-primary flex items-center gap-2">
          <Download size={15} /> Export JSON
        </button>
        <button onClick={exportMd} className="btn-secondary flex items-center gap-2">
          <Download size={15} /> Export Markdown
        </button>
      </div>

      {/* Module-wise breakdown */}
      <div className="space-y-4">
        {modules.map(mod => {
          const modStories = finalStories.filter(s => s.moduleId === mod.id);
          if (modStories.length === 0) return null;
          return (
            <div key={mod.id} className="step-card">
              <button onClick={() => toggle(mod.id)} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="icon-circle w-8 h-8">
                    {expanded[mod.id] ? <ChevronDown size={13} className="text-brand-blue" /> : <ChevronRight size={13} className="text-brand-blue" />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-brand-text">{mod.name}</p>
                    <p className="text-xs text-brand-muted">{modStories.length} stories · {modStories.reduce((a, s) => a + s.storyPoints, 0)} pts</p>
                  </div>
                </div>
                <CheckCircle2 size={16} className="text-green-600" />
              </button>

              {expanded[mod.id] && (
                <div className="mt-4 space-y-3">
                  {modStories.map(story => {
                    const storySubtasks = subtasks.filter(st => st.storyId === story.id);
                    return (
                      <div key={story.id} className="bg-brand-bg rounded-xl p-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-brand-text">{story.title}</span>
                          <Badge label={story.priority} variant={PRIORITY_COLOR[story.priority]} />
                          <Badge label={`${story.storyPoints} pts`} variant="blue" />
                        </div>
                        <p className="text-xs text-brand-muted mb-2">
                          As a <b>{story.asA}</b>, I want {story.iWant}, so that {story.soThat}
                        </p>
                        <div className="mb-2">
                          <p className="text-[11px] font-semibold text-brand-text mb-1">Acceptance Criteria:</p>
                          {story.acceptanceCriteria.map((ac, i) => (
                            <p key={i} className="text-[11px] text-brand-muted">• {ac}</p>
                          ))}
                        </div>
                        {story.dependencies.length > 0 && (
                          <p className="text-[11px] text-brand-muted mb-2">
                            <span className="font-semibold">Depends on:</span> {story.dependencies.join(', ')}
                          </p>
                        )}
                        {storySubtasks.length > 0 && (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {storySubtasks.map(st => (
                              <span key={st.id} className="text-[10px] bg-white border border-gray-200 rounded px-2 py-0.5 text-brand-muted">
                                {st.type.toUpperCase()}: {st.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <StepFooter step={13} hideNext canProceed={false} />
    </WizardShell>
  );
}
