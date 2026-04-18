import { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { Sparkles, BookOpen, CheckCircle2, ChevronDown, ChevronRight, Edit2, Save, X, Eye, Check } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import StreamingText from '../../components/common/StreamingText';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import FlowNode from '../../components/diagrams/FlowNode';
import { useProjectStore } from '../../store/projectStore';
import { MOCK_STORIES, MOCK_STREAM_TEXTS } from '../../mock/data';
import { applyDagreLayout } from '../../lib/diagramUtils';
import type { Story } from '../../types';

const PRIORITY_COLOR: Record<string, 'red' | 'orange' | 'gray'> = { high: 'red', medium: 'orange', low: 'gray' };
const rfNodeTypes = { flowNode: FlowNode };

export default function Step4Page() {
  const { stories, setStories, modules, workflows, updateStory } = useProjectStore();

  const [streaming, setStreaming] = useState(false);
  const [streamDone, setStreamDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, string>>({});

  const [viewStory, setViewStory] = useState<Story | null>(null);

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
    setTimeout(() => { setStreamDone(true); setStreaming(false); setStories(MOCK_STORIES); }, 300);
  };

  const startEdit = useCallback((story: Story) => {
    setEditingId(story.id);
    setEditDraft({ asA: story.asA, iWant: story.iWant, soThat: story.soThat });
  }, []);

  const saveEdit = (storyId: string) => {
    updateStory(storyId, { asA: editDraft.asA, iWant: editDraft.iWant, soThat: editDraft.soThat });
    setEditingId(null);
  };

  const groupedByModule = modules.map(mod => ({
    mod,
    stories: stories.filter(s => s.moduleId === mod.id),
  })).filter(g => g.stories.length > 0);

  const workflow = workflows[0];
  const wfNodes = workflow ? applyDagreLayout(workflow.diagramData.nodes, workflow.diagramData.edges) : [];
  const wfEdges = workflow
    ? workflow.diagramData.edges.map(e => ({ ...e, type: 'smoothstep', style: { stroke: '#3B5BDB', strokeWidth: 1.5 } }))
    : [];

  return (
    <WizardShell step={4} title="Story Reviewer" description="Generate user stories and review them alongside the workflow chart. Edit inline or open a clean story view.">
      <div className="flex gap-5 h-[calc(100vh-230px)] min-h-[500px]">

        {/* ── LEFT: Storyboard (42%) ─────────────────────────────────── */}
        <div className="flex flex-col w-[42%] shrink-0 overflow-y-auto pr-1">

          {!streaming && !streamDone && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="icon-circle w-16 h-16 mb-4">
                <BookOpen size={28} className="text-brand-blue" />
              </div>
              <h3 className="text-lg font-semibold text-brand-text mb-2">Generate User Stories</h3>
              <p className="text-sm text-brand-muted max-w-xs mb-6">
                AI creates stories for every feature, with acceptance criteria and dependency mapping.
              </p>
              <button onClick={handleGenerate} className="btn-primary flex items-center gap-2 px-6 py-3">
                <Sparkles size={16} /> Generate Stories
              </button>
            </div>
          )}

          {streaming && (
            <div className="step-card mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-brand-text">Generating stories…</span>
                <span className="text-sm text-brand-blue font-semibold">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-brand-blue rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <StreamingText fullText={MOCK_STREAM_TEXTS.stories} onDone={handleStreamDone} />
            </div>
          )}

          {streamDone && (
            <>
              <div className="step-card bg-green-50/50 border border-green-200 mb-4 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">{stories.length} stories generated</p>
                  <p className="text-xs text-green-700">Across {groupedByModule.length} modules</p>
                </div>
              </div>

              <div className="space-y-3">
                {groupedByModule.map(({ mod, stories: modStories }) => (
                  <div key={mod.id} className="step-card">
                    <button onClick={() => toggle(mod.id)} className="flex items-center gap-2 w-full text-left">
                      {expanded[mod.id]
                        ? <ChevronDown size={14} className="text-brand-blue shrink-0" />
                        : <ChevronRight size={14} className="text-brand-blue shrink-0" />}
                      <span className="text-sm font-semibold text-brand-text flex-1">{mod.name}</span>
                      <Badge label={`${modStories.length} stories`} variant="blue" />
                    </button>

                    {expanded[mod.id] && (
                      <div className="mt-3 space-y-2">
                        {modStories.map(story => (
                          <div
                            key={story.id}
                            onClick={() => setSelectedStoryId(story.id)}
                            className={`rounded-xl p-3 cursor-pointer transition-all border ${selectedStoryId === story.id ? 'bg-brand-active border-brand-blue' : 'bg-brand-bg border-transparent hover:border-gray-200'}`}
                          >
                            {editingId === story.id ? (
                              <div className="space-y-2" onClick={e => e.stopPropagation()}>
                                {(['asA', 'iWant', 'soThat'] as const).map(key => (
                                  <div key={key}>
                                    <label className="text-[10px] font-semibold text-brand-muted uppercase">
                                      {key === 'asA' ? 'As a' : key === 'iWant' ? 'I want' : 'So that'}
                                    </label>
                                    <input
                                      value={editDraft[key] || ''}
                                      onChange={e => setEditDraft(d => ({ ...d, [key]: e.target.value }))}
                                      className="w-full border border-brand-blue rounded-lg px-2 py-1 text-xs outline-none mt-0.5"
                                    />
                                  </div>
                                ))}
                                <div className="flex gap-1.5 pt-1">
                                  <button onClick={() => saveEdit(story.id)} className="btn-primary text-[10px] px-2 py-1 flex items-center gap-1">
                                    <Save size={10} /> Save
                                  </button>
                                  <button onClick={() => setEditingId(null)} className="btn-secondary text-[10px] px-2 py-1 flex items-center gap-1">
                                    <X size={10} /> Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start justify-between gap-1 mb-1">
                                  <span className="text-xs font-semibold text-brand-text leading-tight">{story.title}</span>
                                  <div className="flex gap-1 shrink-0">
                                    <Badge label={story.priority} variant={PRIORITY_COLOR[story.priority]} />
                                    <Badge label={`${story.storyPoints}pt`} variant="gray" />
                                  </div>
                                </div>
                                <p className="text-[11px] text-brand-muted mb-2">
                                  As a <strong>{story.asA}</strong>, I want {story.iWant.substring(0, 45)}{story.iWant.length > 45 ? '…' : ''}
                                </p>
                                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                  <button onClick={() => startEdit(story)}
                                    className="text-[10px] text-brand-muted hover:text-brand-blue flex items-center gap-0.5 transition-colors">
                                    <Edit2 size={10} /> Edit
                                  </button>
                                  <button onClick={() => setViewStory(story)}
                                    className="text-[10px] text-brand-muted hover:text-brand-blue flex items-center gap-0.5 transition-colors">
                                    <Eye size={10} /> View Full
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT: Workflow Reference ───────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-xs font-semibold text-brand-text mb-2 flex items-center gap-2">
            <ChevronRight size={14} className="text-brand-blue" /> Workflow Reference
          </p>
          {workflow ? (
            <div className="flex-1 min-h-0 rounded-xl overflow-hidden border border-gray-100 shadow-card bg-brand-bg">
              <ReactFlow
                nodes={wfNodes}
                edges={wfEdges}
                nodeTypes={rfNodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                nodesDraggable={false}
                nodesConnectable={false}
                zoomOnDoubleClick={false}
              >
                <Background color="#e8eeff" gap={20} />
                <Controls showInteractive={false} />
              </ReactFlow>
            </div>
          ) : (
            <div className="flex-1 rounded-xl border border-gray-100 bg-brand-bg flex items-center justify-center text-center px-6">
              <div>
                <div className="icon-circle w-14 h-14 mx-auto mb-3">
                  <BookOpen size={22} className="text-brand-blue" />
                </div>
                <p className="text-sm text-brand-text font-semibold mb-1">No workflow available</p>
                <p className="text-xs text-brand-muted">Complete the Workflow Editor step to see the chart here.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Full Story Modal */}
      <Modal open={!!viewStory} onClose={() => setViewStory(null)} title={viewStory?.title ?? ''}>
        {viewStory && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge label={viewStory.priority} variant={PRIORITY_COLOR[viewStory.priority]} />
              <Badge label={`${viewStory.storyPoints} story points`} variant="blue" />
              {modules.find(m => m.id === viewStory.moduleId) && (
                <Badge label={modules.find(m => m.id === viewStory.moduleId)!.name} variant="gray" />
              )}
            </div>
            <div className="bg-brand-bg rounded-xl p-4">
              <p className="text-sm text-brand-text leading-relaxed">
                As a <strong>{viewStory.asA}</strong>, I want <strong>{viewStory.iWant}</strong>, so that <strong>{viewStory.soThat}</strong>.
              </p>
            </div>
            {viewStory.acceptanceCriteria.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-brand-text mb-2">Acceptance Criteria</p>
                <ul className="space-y-1.5">
                  {viewStory.acceptanceCriteria.map((ac, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-brand-muted">
                      <Check size={12} className="text-green-600 shrink-0 mt-0.5" />
                      {ac}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {viewStory.edgeCases.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-brand-text mb-2">Edge Cases</p>
                <ul className="space-y-1">
                  {viewStory.edgeCases.map((ec, i) => (
                    <li key={i} className="text-xs text-brand-muted">• {ec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      <StepFooter step={4} canProceed={streamDone} nextLabel="Story Editing" />
    </WizardShell>
  );
}
