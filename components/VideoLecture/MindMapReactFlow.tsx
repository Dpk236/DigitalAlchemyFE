import React, { useMemo, useEffect, useState, useCallback } from 'react';
import MindMapVisualView from './MindMapVisualView';

import ReactFlow, {
    Background,
    Controls,
    Handle,
    Position,
    useNodesState,
    useEdgesState,
    Edge,
    Node,
    ConnectionLineType,
    Panel,
    ReactFlowProvider,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { Info, ChevronDown, X } from 'lucide-react';

// Re-use data interface
export interface MindMapNodeData {
    title: string;
    description?: string;
    children?: MindMapNodeData[];
}

interface MindMapProps {
    data: MindMapNodeData | null;
    videoId: string;
}

// Custom Node Component
const CustomNode = ({ data }: { data: { title: string; description?: string; isRoot?: boolean; isExpanded?: boolean; hasChildren?: boolean } }) => {
    return (
        <div
            className={`
        px-5 py-4 rounded-3xl shadow-sm border transition-all duration-500 min-w-[200px] max-w-[260px] relative group animate-in fade-in zoom-in duration-500
        ${data.isRoot
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500/20 shadow-xl ring-4 ring-blue-500/5'
                    : 'bg-gradient-to-br from-blue-200 to-blue-300 text-white border-gray-200 hover:border-blue-400 hover:shadow-xl'
                }
      `}
        >
            <Handle type="target" position={Position.Left} className="!opacity-0" />

            <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center justify-center gap-2 flex-1'>
                    <h4 className={`font-bold leading-tight ${data.isRoot ? 'text-lg text-center' : 'text-sm text-gray-800'}`}>
                        {data.title}
                    </h4>

                    {data.description && (
                        <div className='relative group/tooltip inline-flex items-center'>
                            <Info
                                size={16}
                                className={`shrink-0 cursor-help ${data.isRoot ? 'opacity-80' : 'text-blue-500/40 group-hover:opacity-100'} transition-all`}
                            />
                            <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-gray-900/95 text-white text-xs rounded-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all z-50 text-center shadow-xl border border-white/10 backdrop-blur-md'>
                                {data.description}
                                <div className='absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-gray-900/95'></div>
                            </div>
                        </div>
                    )}
                </div>

                {data.hasChildren && (
                    <div className={`
            flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300
            ${data.isRoot ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}
            ${data.isExpanded ? 'rotate-90' : '-rotate-90'}
          `}>
                        <ChevronDown size={14} />
                    </div>
                )}
            </div>

            <Handle type="source" position={Position.Right} className="!opacity-0" />
        </div>
    );
};

const nodeTypes = {
    mindmap: CustomNode,
};

// Layout Helper
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 260;
const nodeHeight = 80;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    dagreGraph.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 100 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
    });

    return { nodes, edges };
};

const MindMapInternal = ({ data }: MindMapProps) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['node-0']));
    const { fitView, setCenter, getZoom } = useReactFlow();

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        if (node.data.hasChildren) {
            setExpandedNodes((prev) => {
                const next = new Set(prev);
                if (next.has(node.id)) {
                    next.delete(node.id);
                } else {
                    next.add(node.id);
                }
                return next;
            });

            // Smoothly scroll/center the clicked node
            setTimeout(() => {
                setCenter(node.position.x + nodeWidth / 2, node.position.y + nodeHeight / 2, {
                    zoom: getZoom(),
                    duration: 800
                });
            }, 50);
        }
    }, [setCenter, getZoom]);

    useEffect(() => {
        if (!data) return;

        const allNodes: Node[] = [];
        const allEdges: Edge[] = [];
        let idCounter = 0;

        const buildTree = (nodeData: MindMapNodeData, parentId: string | null = null, level: number = 0, isVisible: boolean = true) => {
            const id = `node-${idCounter++}`;
            const hasChildren = !!(nodeData.children && nodeData.children.length > 0);
            const isExpanded = expandedNodes.has(id);

            if (isVisible) {
                allNodes.push({
                    id,
                    type: 'mindmap',
                    data: {
                        title: nodeData.title,
                        description: nodeData.description,
                        isRoot: level === 0,
                        hasChildren,
                        isExpanded
                    },
                    position: { x: 0, y: 0 },
                });

                if (parentId) {
                    allEdges.push({
                        id: `edge-${parentId}-${id}`,
                        source: parentId,
                        target: id,
                        type: 'smoothstep',
                        animated: true,
                        style: { stroke: '#9ca3af', strokeWidth: 2 },
                    });
                }
            }

            if (nodeData.children) {
                nodeData.children.forEach(child =>
                    buildTree(child, id, level + 1, isVisible && isExpanded)
                );
            }
        };

        buildTree(data);

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            allNodes,
            allEdges
        );

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);

        // Ensure the overall view is balanced after layout change
        setTimeout(() => {
            fitView({ padding: 0.2, duration: 800 });
        }, 100);
    }, [data, expandedNodes, setNodes, setEdges, fitView]);

    return (
        <div style={{ width: '100%', height: '100%', background: '#fcfcfc' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
                fitViewOptions={{ padding: 0.2, duration: 800 }}
                minZoom={0.1}
                maxZoom={4}
            >
                <Background color="#f3f4f6" gap={20} />
                <Controls />
                <Panel position="bottom-center" className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-100 shadow-lg mb-4">
                    <div className='flex items-center gap-6'>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full bg-blue-600 shadow-sm'></div>
                            <span className='text-[10px] uppercase tracking-wider font-extrabold text-gray-500'>Main Topic</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full bg-blue-50 border border-blue-100'></div>
                            <span className='text-[10px] uppercase tracking-wider font-extrabold text-gray-500'>Sub-topic</span>
                        </div>
                        <div className='h-4 w-px bg-gray-200'></div>
                        <p className='text-[10px] font-bold text-gray-400'>Click nodes to expand/fold</p>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
};

export default function MindMapReactFlow(props: MindMapProps) {
    const [activeTab, setActiveTab] = useState<'Normal Map' | 'Visual Representation'>('Normal Map');
    const [isVisualModalOpen, setIsVisualModalOpen] = useState(false);

    // Automatically open modal when Visual Representation tab is clicked
    useEffect(() => {
        if (activeTab === 'Visual Representation') {
            setIsVisualModalOpen(true);
        }
    }, [activeTab]);

    const closeVisualModal = () => {
        setIsVisualModalOpen(false);
        // Switch back to Normal Map since the modal is the primary view for Visual
        setActiveTab('Normal Map');
    };

    if (!props.data) {
        return (
            <div className='w-full h-full flex items-center justify-center min-h-[400px]'>
                <div className='text-center space-y-4'>
                    <div className='text-5xl opacity-10'>🕸️</div>
                    <h3 className='text-xl font-medium text-gray-700'>
                        Mind map not ready
                    </h3>
                    <p className='text-gray-400 max-w-sm'>
                        We're still processing the hierarchy for this lecture.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full">
            {/* Mind Map Specific Tabs */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
                <button
                    onClick={() => setActiveTab('Normal Map')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                        activeTab === 'Normal Map'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Normal Map
                </button>
                <button
                    onClick={() => setActiveTab('Visual Representation')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                        activeTab === 'Visual Representation'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Visual Representation
                </button>
            </div>

            <div className="flex-1 min-h-0 relative">
                {activeTab === 'Normal Map' ? (
                    <ReactFlowProvider>
                        <MindMapInternal {...props} />
                    </ReactFlowProvider>
                ) : (
                    <MindMapVisualView videoId={props.videoId} />
                )}
            </div>

            {/* Full Screen Visual Representation Modal */}
            {isVisualModalOpen && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shadow-sm">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-black text-blue-900 tracking-tight">Visual Representation</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Full Screen Experience</p>
                        </div>
                        <button 
                            onClick={closeVisualModal}
                            className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl transition-all group"
                        >
                            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <MindMapVisualView videoId={props.videoId} />
                    </div>
                </div>
            )}
        </div>
    );
}
