import { useState } from 'react';
import { Sparkles, Database, Monitor, TestTube, ChevronDown, ChevronRight } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import StreamingText from '../../components/common/StreamingText';
import StoryFlowDiagram from '../../components/diagrams/StoryFlowDiagram';
import Badge from '../../components/common/Badge';
import { useProjectStore } from '../../store/projectStore';
import { MOCK_SUBTASKS, MOCK_STREAM_TEXTS } from '../../mock/data';
import type { SubTaskType } from '../../types';

type Tab = 'dualview' | 'subtasks';

const TYPE_CONFIG: Record<SubTaskType, { icon: typeof Database; label: string; color: string; badge: 'blue' | 'purple' | 'green' }> = {
  backend: { icon: Database, label: 'Backend', color: 'text-blue-600', badge: 'blue' },
  frontend: { icon: Monitor, label: 'Frontend', color: 'text-purple-600', badge: 'purple' },
  qa: { icon: TestTube, label: 'QA', color: 'text-green-600', badge: 'green' },
};

const PRIORITY_COLOR: Record<string, 'red' | 'orange' | 'gray'> = { high: 'red', medium: 'orange', low: 'gray' };

const CATEGORY_ITEMS = [
  { icon: Database, label: 'Backend', color: 'text-blue-600' },
  { icon: Monitor, label: 'Frontend', color: 'text-purple-600' },
  { icon: TestTube, label: 'QA', color: 'text-green-600' },
];

export default function Step5Page() {
  const { stories, modules, subtasks, setSubtasks } = useProjectStore();
  const [tab, setTab] = useState<Tab>('dualview');
  const [selectedStoryId, setSelectedStoryId] = useState<string | undefined>();
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [streamDoneFor, setStreamDoneFor] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const selectedStory = stories.find(s => s.id === selectedStoryId);

  const handleGenerate = (storyId: string) => setGeneratingFor(storyId);
  const handleStreamDone = (storyId: string) => {
    setGeneratingFor(null);
    setStreamDoneFor(prev => new Set([...prev, storyId]));
    setSubtasks([...subtasks, ...MOCK_SUBTASKS.filter(st => st.storyId === storyId && !subtasks.find(s => s.id === st.id))]);
    setExpanded(prev => ({ ...prev, [storyId]: true }));
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'dualview', label: 'Dual View' },
    { key: 'subtasks', label: 'Sub-tasks' },
  ];

  return (
    <WizardShell step={5} title="Story Review" description="Visualise story dependencies and generate Backend / Frontend / QA sub-tasks.">
      {/* Tab bar */}
      <div className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer
              ${tab === t.key ? 'bg-brand-active border-brand-blue text-brand-blue' : 'bg-white border-gray-200 text-brand-muted hover:border-brand-blue'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Dual View ── */}
      {tab === 'dualview' && (
        <div>
          <div className="flex gap-4 h-[calc(100vh-320px)] min-h-[400px]">
            {/* Story list */}
            <div className="w-72 shrink-0 overflow-y-auto space-y-2">
              {stories.map(story => {
                const mod = modules.find(m => m.id === story.moduleId);
                return (
                  <button key={story.id} onClick={() => setSelectedStoryId(story.id)}
                    className={`step-card w-full text-left p-4 transition-all ${selectedStoryId === story.id ? 'step-card-active' : 'hover:shadow-card-hover'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-brand-text leading-tight">{story.title}</span>
                      <Badge label={story.priority} variant={PRIORITY_COLOR[story.priority]} />
                    </div>
                    {mod && <span className="text-[10px] text-brand-muted">{mod.name}</span>}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge label={`${story.storyPoints} pts`} variant="blue" />
                      {story.dependencies.length > 0 && <Badge label={`${story.dependencies.length} deps`} variant="gray" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Diagram */}
            <div className="flex-1 min-w-0">
              <StoryFlowDiagram stories={stories} modules={modules} selectedStoryId={selectedStoryId} onSelectStory={setSelectedStoryId} />
            </div>

            {/* Category sidebar */}
            <div className="w-16 shrink-0 flex flex-col gap-3">
              {CATEGORY_ITEMS.map(item => (
                <div key={item.label} className="step-card flex flex-col items-center p-3 gap-1.5">
                  <item.icon size={18} className={item.color} />
                  <span className="text-[10px] text-brand-muted font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedStory && (
            <div className="mt-4 step-card">
              <h3 className="text-sm font-semibold text-brand-text mb-2">{selectedStory.title}</h3>
              <p className="text-xs text-brand-muted mb-2">
                As a <span className="font-medium text-brand-text">{selectedStory.asA}</span>, I want {selectedStory.iWant}, so that {selectedStory.soThat}
              </p>
              <ul className="space-y-1">
                {selectedStory.acceptanceCriteria.slice(0, 2).map((ac, i) => (
                  <li key={i} className="text-xs text-brand-muted">• {ac}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Sub-tasks ── */}
      {tab === 'subtasks' && (
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
                    <StreamingText fullText={MOCK_STREAM_TEXTS.subtasks} onDone={() => handleStreamDone(story.id)} className="text-xs" />
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
      )}

      <StepFooter step={5} canProceed={stories.length > 0} nextLabel="Edit Stories" />
    </WizardShell>
  );
}
