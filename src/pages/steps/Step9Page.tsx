import { useState } from 'react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import StoryFlowDiagram from '../../components/diagrams/StoryFlowDiagram';
import Badge from '../../components/common/Badge';
import { useProjectStore } from '../../store/projectStore';
import { Database, Monitor, TestTube } from 'lucide-react';

const PRIORITY_COLOR: Record<string, 'red' | 'orange' | 'gray'> = { high: 'red', medium: 'orange', low: 'gray' };

const CATEGORY_ITEMS = [
  { icon: Database, label: 'Backend', color: 'text-blue-600' },
  { icon: Monitor, label: 'Frontend', color: 'text-purple-600' },
  { icon: TestTube, label: 'QA', color: 'text-green-600' },
];

export default function Step9Page() {
  const { stories, modules } = useProjectStore();
  const [selectedStoryId, setSelectedStoryId] = useState<string | undefined>();

  const selectedStory = stories.find(s => s.id === selectedStoryId);

  return (
    <WizardShell step={9} title="Dual View Presentation" description="See stories as a text list and a dependency flow diagram side by side.">
      <div className="flex gap-4 h-[calc(100vh-260px)]">
        {/* Left: Story list */}
        <div className="w-80 shrink-0 overflow-y-auto space-y-2">
          {stories.map(story => {
            const mod = modules.find(m => m.id === story.moduleId);
            return (
              <button
                key={story.id}
                onClick={() => setSelectedStoryId(story.id)}
                className={`step-card w-full text-left transition-all p-4 ${selectedStoryId === story.id ? 'step-card-active' : 'hover:shadow-card-hover'}`}
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

        {/* Middle: Flow diagram */}
        <div className="flex-1 min-w-0">
          <StoryFlowDiagram
            stories={stories}
            modules={modules}
            selectedStoryId={selectedStoryId}
            onSelectStory={setSelectedStoryId}
          />
        </div>

        {/* Right: Category sidebar (Incedo style) */}
        <div className="w-16 shrink-0 flex flex-col gap-3">
          {CATEGORY_ITEMS.map(item => (
            <div key={item.label} className="step-card flex flex-col items-center p-3 gap-1.5">
              <item.icon size={18} className={item.color} />
              <span className="text-[10px] text-brand-muted font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected story detail */}
      {selectedStory && (
        <div className="mt-4 step-card">
          <h3 className="text-sm font-semibold text-brand-text mb-3">{selectedStory.title}</h3>
          <p className="text-xs text-brand-muted mb-3">
            As a <span className="font-medium text-brand-text">{selectedStory.asA}</span>, I want {selectedStory.iWant}, so that {selectedStory.soThat}
          </p>
          <div>
            <p className="text-xs font-semibold text-brand-text mb-1">Acceptance Criteria:</p>
            <ul className="space-y-1">
              {selectedStory.acceptanceCriteria.slice(0, 2).map((ac, i) => (
                <li key={i} className="text-xs text-brand-muted">• {ac}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <StepFooter step={9} canProceed={stories.length > 0} nextLabel="Generate Sub-tasks" />
    </WizardShell>
  );
}
