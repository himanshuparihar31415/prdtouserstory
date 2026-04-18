import { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap,
  addEdge, applyNodeChanges, applyEdgeChanges,
  ReactFlowProvider, useReactFlow,
  type Node, type Edge, type Connection, type NodeChange, type EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Sparkles, GitBranch, RefreshCw, ChevronRight } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import { simulateStream } from '../../mock/mockStream';
import { MOCK_MODULES, MOCK_CONSOLIDATED, MOCK_WORKFLOWS } from '../../mock/data';
import { useProjectStore } from '../../store/projectStore';
import { applyDagreLayout } from '../../lib/diagramUtils';
import EditableFlowNode from '../../components/diagrams/EditableFlowNode';

// ── palette ───────────────────────────────────────────────────────────────────

const PALETTE_NODES = [
  { type: 'start',    label: 'Start',     style: 'bg-green-50 border-green-500 text-green-800' },
  { type: 'action',   label: 'Action',    style: 'bg-white border-brand-blue text-brand-text' },
  { type: 'decision', label: '◆ Decision', style: 'bg-amber-50 border-amber-400 text-amber-900' },
  { type: 'end',      label: 'End',       style: 'bg-red-50 border-red-500 text-red-800' },
];

// ── text → flow ───────────────────────────────────────────────────────────────

function parseTextToFlow(text: string): { nodes: Node[]; edges: Edge[] } {
  const raw = text
    .split(/\n|->|→|,/)
    .map(s => s.trim())
    .filter(Boolean);
  if (raw.length === 0) return { nodes: [], edges: [] };

  const nodes: Node[] = raw.map((label, i) => ({
    id: `n${i}`,
    type: 'editableNode',
    position: { x: 0, y: 0 },
    data: { label, nodeType: i === 0 ? 'start' : i === raw.length - 1 ? 'end' : 'action' },
  }));

  const edges: Edge[] = raw.slice(1).map((_, i) => ({
    id: `e${i}-${i + 1}`,
    source: `n${i}`,
    target: `n${i + 1}`,
    type: 'smoothstep',
    style: { stroke: '#3B5BDB', strokeWidth: 1.5 },
  }));

  const laid = applyDagreLayout(nodes as never, edges as never) as Node[];
  return { nodes: laid, edges };
}

// ── droppable canvas (inside ReactFlowProvider context) ───────────────────────

const nodeTypes = { editableNode: EditableFlowNode };

interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (c: NodeChange[]) => void;
  onEdgesChange: (c: EdgeChange[]) => void;
  onConnect: (c: Connection) => void;
  onNodeDrop: (nodeType: string, pos: { x: number; y: number }) => void;
  showPlaceholder: boolean;
}

function DroppableCanvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeDrop, showPlaceholder }: CanvasProps) {
  const { screenToFlowPosition } = useReactFlow();

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const nType = e.dataTransfer.getData('application/nodeType');
    if (!nType) return;
    const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    onNodeDrop(nType, pos);
  }, [screenToFlowPosition, onNodeDrop]);

  return (
    <div className="w-full h-full relative" onDragOver={e => e.preventDefault()} onDrop={onDrop}>
      {showPlaceholder && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 bg-brand-bg/95 rounded-xl pointer-events-none">
          <div className="icon-circle w-14 h-14 mb-3">
            <GitBranch size={22} className="text-brand-blue" />
          </div>
          <p className="text-sm font-semibold text-brand-text mb-1">Workflow canvas</p>
          <p className="text-xs text-brand-muted">
            Generate from text above, or drag a node from the palette onto this canvas.
          </p>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView={nodes.length > 0}
        fitViewOptions={{ padding: 0.3 }}
        deleteKeyCode="Delete"
      >
        <Background color="#e8eeff" gap={20} />
        <Controls showInteractive={true} />
        {!showPlaceholder && <MiniMap nodeColor={() => '#3B5BDB'} maskColor="rgba(240,242,248,0.8)" />}
      </ReactFlow>
    </div>
  );
}

// ── mock texts ────────────────────────────────────────────────────────────────

const DEFAULT_PROMPT = `Describe your workflow steps, one per line or separated by arrows:

User visits homepage -> Clicks Sign Up -> Fills registration form
-> Verifies email -> Account created -> Redirected to dashboard`;

const UNDERSTANDING_TEXT = `Analysing your product inputs...

**Authentication & User Management**
Handles user registration (email/OAuth), login with JWT session management, role-based access for Customer, Admin, and Super-Admin roles.

**Product Catalog**
Product listing with faceted filters (category, price, brand), rich detail pages with image galleries and variant selection (size, colour, stock status), full-text search with autocomplete.

**Cart & Checkout**
Persistent cart supporting guest sessions (merge on login), coupon codes, multi-step checkout flow: Address → Shipping → Payment → Review. Integrated payment gateway.

**Order Management**
Real-time order tracking via carrier API, order history with reorder, self-service returns within policy window with automated shipping label generation.

**Key UI patterns identified:** sticky top nav with search bar, breadcrumb trails for catalog depth, slide-out cart sidebar, bottom summary bar during checkout.`;

// ── main component ────────────────────────────────────────────────────────────

export default function Step2Page() {
  const { setModules, setConsolidatedData, setWorkflows } = useProjectStore();

  const [understandingText, setUnderstandingText] = useState('');
  const [streamingDone, setStreamingDone] = useState(false);
  const [highlightWorkflow, setHighlightWorkflow] = useState(false);

  const [promptText, setPromptText] = useState(DEFAULT_PROMPT);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [workflowGenerated, setWorkflowGenerated] = useState(false);

  const workflowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cancel = simulateStream(
      UNDERSTANDING_TEXT,
      chunk => setUnderstandingText(prev => prev + chunk),
      () => {
        setStreamingDone(true);
        setModules(MOCK_MODULES);
        setConsolidatedData(MOCK_CONSOLIDATED);
      },
      8,
      20,
    );
    return cancel;
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((conn: Connection) =>
    setEdges(eds => addEdge({ ...conn, type: 'smoothstep', style: { stroke: '#3B5BDB', strokeWidth: 1.5 } }, eds)), []);

  const handleNodeLabelChange = useCallback((id: string, label: string) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, label } } : n));
  }, []);

  const buildNodes = useCallback((raw: Node[]) =>
    raw.map(node => ({ ...node, data: { ...node.data, onLabelChange: handleNodeLabelChange } })),
    [handleNodeLabelChange]);

  const generateWorkflow = () => {
    const { nodes: n, edges: e } = parseTextToFlow(promptText);
    setNodes(buildNodes(n));
    setEdges(e);
    setWorkflowGenerated(true);
    setWorkflows(MOCK_WORKFLOWS);
  };

  const regenerate = () => {
    const { nodes: n, edges: e } = parseTextToFlow(promptText);
    setNodes(buildNodes(n));
    setEdges(e);
  };

  const handleNodeDrop = useCallback((nodeType: string, pos: { x: number; y: number }) => {
    const id = `drop-${Date.now()}`;
    const label = nodeType.charAt(0).toUpperCase() + nodeType.slice(1);
    setNodes(nds => [...nds, {
      id,
      type: 'editableNode',
      position: pos,
      data: { label, nodeType, onLabelChange: handleNodeLabelChange },
    }]);
    setWorkflowGenerated(true);
    setWorkflows(MOCK_WORKFLOWS);
  }, [handleNodeLabelChange, setWorkflows]);

  const jumpToWorkflow = () => {
    setHighlightWorkflow(true);
    setTimeout(() => setHighlightWorkflow(false), 1800);
    workflowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const canProceed = streamingDone && workflowGenerated;

  return (
    <WizardShell
      step={2}
      title="Workflow Editor"
      description="AI understanding streams on the left — edit freely. Build your workflow on the right via text or by dragging nodes from the palette."
    >
      <div className="flex gap-5 h-[calc(100vh-230px)] min-h-[500px]">

        {/* ── LEFT: AI Understanding ─────────────────────────────────── */}
        <div className="flex flex-col w-[44%] shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-text flex items-center gap-2">
              <Sparkles size={13} className="text-brand-blue" /> AI Understanding
            </span>
            {streamingDone && <span className="text-[10px] text-green-600 font-medium">✓ Editable</span>}
          </div>

          <div className="flex-1 relative flex flex-col gap-2">
            {!streamingDone && (
              <div className="absolute inset-0 bg-white rounded-xl border border-gray-200 p-4 overflow-y-auto z-10 shadow-card">
                <pre className="whitespace-pre-wrap text-xs text-brand-text leading-relaxed font-sans">
                  {understandingText}
                  <span className="cursor-blink" />
                </pre>
              </div>
            )}
            {streamingDone && (
              <>
                <textarea
                  value={understandingText}
                  onChange={e => setUnderstandingText(e.target.value)}
                  className="flex-1 w-full rounded-xl border border-gray-200 p-4 text-xs text-brand-text leading-relaxed resize-none outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue shadow-card font-sans"
                  spellCheck={false}
                />
                <button
                  onClick={jumpToWorkflow}
                  className="self-end flex items-center gap-1.5 text-[11px] text-brand-blue hover:text-blue-700 font-semibold transition-colors bg-brand-active px-3 py-1.5 rounded-lg border border-brand-blue/20"
                >
                  <ChevronRight size={12} /> Jump to Workflow Editor
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: Workflow Generator ───────────────────────────────── */}
        <div
          ref={workflowRef}
          className={`flex flex-col flex-1 min-w-0 rounded-xl transition-all duration-500 ${highlightWorkflow ? 'ring-2 ring-brand-blue ring-offset-2' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-text flex items-center gap-2">
              <GitBranch size={13} className="text-brand-blue" /> Workflow Generator
            </span>
            {workflowGenerated && (
              <button onClick={regenerate} className="flex items-center gap-1 text-[10px] text-brand-muted hover:text-brand-blue transition-colors">
                <RefreshCw size={11} /> Re-generate from text
              </button>
            )}
          </div>

          <div className="mb-3">
            <textarea
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              rows={3}
              placeholder="Type workflow steps separated by newlines or arrows (->)"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs text-brand-text placeholder-brand-muted resize-none outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue shadow-card font-sans"
            />
            <button
              onClick={generateWorkflow}
              disabled={!streamingDone || !promptText.trim()}
              className={`btn-primary w-full mt-2 flex items-center justify-center gap-2 text-xs py-2 ${!streamingDone || !promptText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <GitBranch size={13} />
              {workflowGenerated ? 'Update Workflow Diagram' : 'Generate Workflow Diagram'}
            </button>
          </div>

          {/* Canvas area: palette + flow */}
          <div className="flex gap-2 flex-1 min-h-0">
            {/* Node palette */}
            <div className="w-24 shrink-0 flex flex-col gap-2 pt-1">
              <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-wider px-1">Nodes</p>
              {PALETTE_NODES.map(pn => (
                <div
                  key={pn.type}
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('application/nodeType', pn.type);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  className={`border-2 rounded-lg text-[10px] font-semibold text-center py-2 px-1 cursor-grab active:cursor-grabbing active:scale-95 select-none shadow-sm hover:shadow-card transition-all ${pn.style}`}
                >
                  {pn.label}
                </div>
              ))}
              <p className="text-[9px] text-brand-muted px-1 leading-tight mt-1">Drag onto canvas →</p>
            </div>

            {/* React Flow canvas */}
            <div className="flex-1 rounded-xl overflow-hidden border border-gray-100 shadow-card bg-brand-bg">
              <ReactFlowProvider>
                <DroppableCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeDrop={handleNodeDrop}
                  showPlaceholder={!workflowGenerated}
                />
              </ReactFlowProvider>
            </div>
          </div>

          {workflowGenerated && (
            <p className="text-[10px] text-brand-muted mt-1.5">
              💡 Double-click node to edit · Drag to rearrange · Drag palette items to add nodes · Delete key removes selected
            </p>
          )}
        </div>
      </div>

      <StepFooter step={2} canProceed={canProceed} nextLabel="Validate & Refine" />
    </WizardShell>
  );
}
