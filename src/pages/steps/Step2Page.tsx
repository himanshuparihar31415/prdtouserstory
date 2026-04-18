import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap,
  addEdge, applyNodeChanges, applyEdgeChanges,
  type Node, type Edge, type Connection, type NodeChange, type EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Sparkles, GitBranch, RefreshCw } from 'lucide-react';
import WizardShell from '../../components/wizard/WizardShell';
import StepFooter from '../../components/layout/StepFooter';
import { simulateStream } from '../../mock/mockStream';
import { MOCK_MODULES, MOCK_CONSOLIDATED, MOCK_WORKFLOWS } from '../../mock/data';
import { useProjectStore } from '../../store/projectStore';
import { applyDagreLayout } from '../../lib/diagramUtils';
import EditableFlowNode from '../../components/diagrams/EditableFlowNode';

// ── helpers ──────────────────────────────────────────────────────────────────

function parseTextToFlow(text: string): { nodes: Node[]; edges: Edge[] } {
  // Split on newlines, arrows, or commas; filter blanks
  const raw = text
    .split(/\n|->|→|,/)
    .map(s => s.trim())
    .filter(Boolean);

  if (raw.length === 0) return { nodes: [], edges: [] };

  const nodes: Node[] = raw.map((label, i) => ({
    id: `n${i}`,
    type: 'editableNode',
    position: { x: 0, y: 0 },
    data: {
      label,
      nodeType: i === 0 ? 'start' : i === raw.length - 1 ? 'end' : 'action',
    },
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

// ── component ─────────────────────────────────────────────────────────────────

const nodeTypes = { editableNode: EditableFlowNode };

export default function Step2Page() {
  const { setModules, setConsolidatedData, setWorkflows } = useProjectStore();

  // Left panel — understanding
  const [understandingText, setUnderstandingText] = useState('');
  const [streamingDone, setStreamingDone] = useState(false);

  // Right panel — workflow builder
  const [promptText, setPromptText] = useState(DEFAULT_PROMPT);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [workflowGenerated, setWorkflowGenerated] = useState(false);

  // Auto-stream understanding on mount
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

  // React Flow callbacks
  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((conn: Connection) =>
    setEdges(eds => addEdge({ ...conn, type: 'smoothstep', style: { stroke: '#3B5BDB', strokeWidth: 1.5 } }, eds)), []);

  const handleNodeLabelChange = useCallback((id: string, label: string) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, label } } : n));
  }, []);

  const generateWorkflow = () => {
    const { nodes: n, edges: e } = parseTextToFlow(promptText);
    const withCallback = n.map(node => ({
      ...node,
      data: { ...node.data, onLabelChange: handleNodeLabelChange },
    }));
    setNodes(withCallback);
    setEdges(e);
    setWorkflowGenerated(true);
    // Also persist mock workflows
    setWorkflows(MOCK_WORKFLOWS);
  };

  const regenerate = () => {
    const { nodes: n, edges: e } = parseTextToFlow(promptText);
    const withCallback = n.map(node => ({
      ...node,
      data: { ...node.data, onLabelChange: handleNodeLabelChange },
    }));
    setNodes(withCallback);
    setEdges(e);
  };

  const canProceed = streamingDone && workflowGenerated;

  return (
    <WizardShell
      step={2}
      title="Workflow Editor"
      description="AI understanding streams automatically on the left — edit it freely. Build your workflow on the right using text or by editing nodes directly."
    >
      <div className="flex gap-5 h-[calc(100vh-230px)] min-h-[500px]">

        {/* ── LEFT: AI Understanding (editable) ─────────────────────────── */}
        <div className="flex flex-col w-[44%] shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-text flex items-center gap-2">
              <Sparkles size={13} className="text-brand-blue" /> AI Understanding
            </span>
            {streamingDone && (
              <span className="text-[10px] text-green-600 font-medium">✓ Editable</span>
            )}
          </div>

          <div className="flex-1 relative">
            {/* Streaming overlay while not done */}
            {!streamingDone && (
              <div className="absolute inset-0 bg-white rounded-xl border border-gray-200 p-4 overflow-y-auto z-10 shadow-card">
                <pre className="whitespace-pre-wrap text-xs text-brand-text leading-relaxed font-sans">
                  {understandingText}
                  <span className="cursor-blink" />
                </pre>
              </div>
            )}

            {/* Editable textarea once stream is done */}
            {streamingDone && (
              <textarea
                value={understandingText}
                onChange={e => setUnderstandingText(e.target.value)}
                className="w-full h-full rounded-xl border border-gray-200 p-4 text-xs text-brand-text leading-relaxed resize-none outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue shadow-card font-sans"
                spellCheck={false}
              />
            )}
          </div>
        </div>

        {/* ── RIGHT: Workflow Generator ──────────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-brand-text flex items-center gap-2">
              <GitBranch size={13} className="text-brand-blue" /> Workflow Generator
            </span>
            {workflowGenerated && (
              <button onClick={regenerate} className="flex items-center gap-1 text-[10px] text-brand-muted hover:text-brand-blue transition-colors">
                <RefreshCw size={11} /> Re-generate
              </button>
            )}
          </div>

          {/* Text prompt input */}
          <div className="mb-3">
            <textarea
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              rows={4}
              placeholder="Type workflow steps separated by newlines or arrows (->)&#10;e.g. Start -> Login -> Dashboard -> Logout"
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

          {/* React Flow canvas */}
          <div className="flex-1 rounded-xl overflow-hidden border border-gray-100 shadow-card bg-brand-bg">
            {!workflowGenerated ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="icon-circle w-14 h-14 mb-3">
                  <GitBranch size={22} className="text-brand-blue" />
                </div>
                <p className="text-sm font-semibold text-brand-text mb-1">Your workflow diagram will appear here</p>
                <p className="text-xs text-brand-muted">
                  Type your steps above and click <strong>Generate Workflow Diagram</strong>.<br />
                  Double-click any node to edit its label. Drag nodes to rearrange.
                </p>
              </div>
            ) : (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                deleteKeyCode="Delete"
              >
                <Background color="#e8eeff" gap={20} />
                <Controls showInteractive={true} />
                <MiniMap nodeColor={() => '#3B5BDB'} maskColor="rgba(240,242,248,0.8)" />
              </ReactFlow>
            )}
          </div>

          {workflowGenerated && (
            <p className="text-[10px] text-brand-muted mt-1.5">
              💡 Double-click a node to edit its label · Drag to rearrange · Delete key removes selected nodes
            </p>
          )}
        </div>
      </div>

      <StepFooter step={2} canProceed={canProceed} nextLabel="Validate & Refine" />
    </WizardShell>
  );
}
