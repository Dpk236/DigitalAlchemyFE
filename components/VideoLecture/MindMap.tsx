import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronDown, Network, Info, Search } from 'lucide-react';

// Interfaces for MindMap Data
export interface MindMapNodeData {
    title: string;
    description?: string;
    children?: MindMapNodeData[];
}

export interface MindMapProps {
    data: MindMapNodeData | null;
}

// Sub-component for individual nodes
const MindMapNode: React.FC<{ node: MindMapNodeData; level?: number }> = ({ node, level = 0 }) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className='flex flex-col items-center flex-1 min-w-[280px] relative'>
            {/* Node Card */}
            <div
                className={`
                relative z-10 p-5 rounded-3xl shadow-sm border transition-all duration-500 w-full max-w-[260px] group
                ${level === 0 ?
                        'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500/20 shadow-2xl scale-110 ring-8 ring-blue-500/5'
                        : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2'
                    }
            `}
            >
                <div className='flex items-center justify-center gap-3'>
                    <h4
                        className={`font-black leading-snug tracking-tight ${level === 0 ? 'text-xl text-center' : 'text-sm text-gray-800'}`}
                    >
                        {node.title}
                    </h4>

                    {node.description && (
                        <div className='relative group/tooltip inline-flex items-center'>
                            <Info
                                size={18}
                                className={`shrink-0 cursor-help ${level === 0 ? 'opacity-90' : 'text-blue-500/40 group-hover:opacity-100'} transition-all`}
                            />
                            <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 bg-gray-900/95 text-white text-xs rounded-2xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all z-50 text-center shadow-2xl border border-white/10 backdrop-blur-xl'>
                                {node.description}
                                <div className='absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-gray-900/95'></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Connection Lines */}
            {hasChildren && (
                <div className='w-full flex flex-col items-center'>
                    {/* Vertical line from parent to horizontal bar */}
                    <div className='w-0.5 h-16 bg-gray-400'></div>

                    <div className='w-max min-w-full relative flex flex-col items-center'>
                        {/* Horizontal connector bar */}
                        {node.children!.length > 1 && (
                            <div
                                className='absolute top-0 bg-gray-400 h-0.5'
                                style={{
                                    left: `${100 / (node.children!.length * 2)}%`,
                                    right: `${100 / (node.children!.length * 2)}%`,
                                }}
                            ></div>
                        )}

                        {/* Children Container */}
                        <div className='flex justify-center pt-0'>
                            {node.children!.map((child, idx) => (
                                <div
                                    key={idx}
                                    className='flex flex-col items-center flex-1 relative'
                                >
                                    {/* Vertical line from bar to child */}
                                    <div className='w-0.5 h-16 bg-gray-400 mb-0'></div>
                                    <MindMapNode node={child} level={level + 1} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function MindMap({ data }: MindMapProps) {
    const [mindMapData, setMindMapData] = useState<MindMapNodeData | null>(data || null);
    const [loading, setLoading] = useState(!data);
    const [scale, setScale] = useState(0.7);

    const positionRef = useRef({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const dragStartRef = useRef({ mouseX: 0, mouseY: 0, panX: 0, panY: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Helper to apply transform directly to DOM
    const updateTransform = (x: number, y: number) => {
        if (contentRef.current) {
            contentRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }
    };

    useEffect(() => {
        if (data) {
            setMindMapData(data);
            setLoading(false);
        }
    }, [data]);

    // Handle wheel zoom
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                e.stopPropagation();
                const delta = e.deltaY;
                const zoomIntensity = 0.001;
                setScale((prevScale) => {
                    const newScale = prevScale - delta * zoomIntensity;
                    return Math.min(Math.max(0.3, newScale), 3);
                });
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => container.removeEventListener('wheel', handleWheel);
        }
    }, []);

    // Handle touch pinch zoom
    useEffect(() => {
        let initialDistance = 0;
        let initialScale = 0.7;

        const getDistance = (touches: React.TouchList | TouchList) => {
            const dx = touches[0].clientX - touches[1].clientX;
            const dy = touches[0].clientY - touches[1].clientY;
            return Math.sqrt(dx * dx + dy * dy);
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                e.stopPropagation();
                initialDistance = getDistance(e.touches);
                initialScale = scale;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                e.stopPropagation();
                const currentDistance = getDistance(e.touches);
                const scaleChange = currentDistance / initialDistance;
                setScale(Math.min(Math.max(0.3, initialScale * scaleChange), 3));
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (e.touches.length < 2) {
                initialDistance = 0;
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('touchstart', handleTouchStart, {
                passive: false,
            });
            container.addEventListener('touchmove', handleTouchMove, {
                passive: false,
            });
            container.addEventListener('touchend', handleTouchEnd, {
                passive: false,
            });
            return () => {
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchmove', handleTouchMove);
                container.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [scale]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0 && !(e.target as HTMLElement).closest('button')) {
            e.preventDefault();
            setIsPanning(true);
            dragStartRef.current = {
                mouseX: e.clientX,
                mouseY: e.clientY,
                panX: positionRef.current.x,
                panY: positionRef.current.y,
            };
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isPanning) {
            e.preventDefault();
            const dx = e.clientX - dragStartRef.current.mouseX;
            const dy = e.clientY - dragStartRef.current.mouseY;
            const newX = dragStartRef.current.panX + dx;
            const newY = dragStartRef.current.panY + dy;
            positionRef.current = { x: newX, y: newY };
            updateTransform(newX, newY);
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (isPanning) {
            e.preventDefault();
            setIsPanning(false);
        }
    };

    useEffect(() => {
        if (isPanning) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isPanning]);

    const handleReset = () => {
        setScale(0.7);
        positionRef.current = { x: 0, y: 0 };
        updateTransform(0, 0);
    };

    if (loading) {
        return (
            <div className='w-full h-full flex items-center justify-center min-h-[400px]'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                    <p className='text-gray-500 animate-pulse font-medium text-sm tracking-wide'>
                        Mapping your lecture...
                    </p>
                </div>
            </div>
        );
    }

    if (!mindMapData) {
        return (
            <div className='w-full h-full flex items-center justify-center min-h-[400px]'>
                <div className='text-center space-y-4'>
                    <div className='text-5xl opacity-10'>🕸️</div>
                    <h3 className='text-xl font-medium text-gray-700'>
                        Mind map not ready
                    </h3>
                    <p className='text-gray-400 max-w-sm'>
                        We're still processing the hierarchy for this lecture. Check back in
                        a bit!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            id='mind-map-export-container'
            className='w-full h-full flex flex-col bg-white'
        >
            <div
                ref={containerRef}
                className={`flex-1 overflow-hidden relative ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
            >
                <div
                    ref={contentRef}
                    className='absolute inset-0 flex items-center justify-center p-12'
                    style={{
                        transform: `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`,
                        pointerEvents: isPanning ? 'none' : 'auto',
                        userSelect: 'none',
                    }}
                    onMouseDown={handleMouseDown}
                >
                    <div
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: 'center center',
                        }}
                    >
                        <MindMapNode node={mindMapData} />
                    </div>
                </div>

                <div className='absolute bottom-6 right-6 flex flex-col gap-2 bg-white rounded-xl p-2 shadow-lg border border-gray-100 z-50'>
                    <button
                        onClick={() => setScale(Math.min(scale + 0.1, 3))}
                        className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                        title='Zoom In'
                    >
                        <span className='text-lg font-bold text-gray-600'>+</span>
                    </button>
                    <div className='text-[10px] text-center font-bold text-gray-400 px-2'>
                        {Math.round(scale * 100)}%
                    </div>
                    <button
                        onClick={() => setScale(Math.max(scale - 0.1, 0.3))}
                        className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                        title='Zoom Out'
                    >
                        <span className='text-lg font-bold text-gray-600'>−</span>
                    </button>
                    <div className='h-px bg-gray-100 my-1'></div>
                    <button
                        onClick={handleReset}
                        className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                        title='Reset View'
                    >
                        <span className='text-xs text-gray-500'>⟲</span>
                    </button>
                </div>
            </div>

            <div className='px-12 pb-12'>
                <div className='flex items-center justify-between px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100'>
                    <div className='flex items-center gap-3 text-gray-500'>
                        <div className='p-2 bg-blue-50 rounded-xl'>
                            <Info size={18} className='text-blue-500/70' />
                        </div>
                        <p className='text-sm font-medium'>
                            Explore the logical connections in your lecture.
                        </p>
                    </div>
                    <div className='flex gap-6'>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-500/20'></div>
                            <span className='text-xs uppercase tracking-wider font-extrabold opacity-60'>
                                Main Topic
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full bg-gray-400'></div>
                            <span className='text-xs uppercase tracking-wider font-extrabold opacity-60'>
                                Sub-topic
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
