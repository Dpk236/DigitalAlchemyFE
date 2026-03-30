import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

interface MindMapVisualViewProps {
    videoId: string;
}

const MindMapVisualView: React.FC<MindMapVisualViewProps> = ({ videoId }) => {
    const [scale, setScale] = useState(1.25);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const imageUrl = `/MindMapVisualImages/${videoId}.png`;
    console.log("imageUrlimageUrl=", imageUrl);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setScale(prev => Math.min(Math.max(prev + delta, 0.5), 3));
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center bg-[#fcfcfc] relative overflow-hidden group select-none">
            {/* Zoom Controls */}
            <div className="absolute top-6 right-6 z-30 flex flex-col gap-2 p-2 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handleZoomIn}
                    className="p-3 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl transition-all"
                    title="Zoom In"
                >
                    <ZoomIn size={20} />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-3 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl transition-all"
                    title="Zoom Out"
                >
                    <ZoomOut size={20} />
                </button>
                <div className="h-px bg-gray-100 mx-2 my-1" />
                <button
                    onClick={handleReset}
                    className="p-3 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl transition-all"
                    title="Reset Zoom"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* Viewer Area */}
            <div
                ref={containerRef}
                className={`flex-1 w-full flex items-center justify-center p-1 overflow-hidden ${scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    className={`transition-transform duration-200 ease-out origin-center`}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    }}
                >
                    <div className="max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200/50 p-2 overflow-hidden ring-1 shadow-blue-500/5 ring-blue-500/10">
                        <img
                            src={imageUrl}
                            alt="Mind Map Visual Representation"
                            className="w-full h-auto object-contain rounded-[20px] pointer-events-none"
                            onError={(e) => {
                                console.error('Failed to load visual representation image:', imageUrl);
                                (e.target as any).style.display = 'none';
                                const parent = (e.target as any).parentElement;
                                const errorMsg = document.createElement('div');
                                errorMsg.className = 'p-20 text-center text-gray-300';
                                errorMsg.innerHTML = `
                                    <div class='text-6xl mb-6'>🖼️</div>
                                    <h3 class='text-lg font-bold text-gray-400'>Visual not found</h3>
                                    <p class='text-sm font-medium'>No image matches Video ID: ${videoId}</p>
                                `;
                                parent.appendChild(errorMsg);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer Label */}
            <div className="p-4 w-full flex justify-center items-center gap-3 bg-white/40 backdrop-blur-sm border-t border-gray-100 z-10">
                <div className="flex items-center gap-2 text-blue-900/40">
                    <Maximize2 size={12} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        AI Generated Visual Logic
                    </span>
                </div>
                <div className="h-3 w-px bg-gray-200" />
                <span className="text-[10px] font-bold text-gray-400">
                    Zoom: {Math.round(scale * 100)}%
                </span>
                {scale > 1 && (
                    <>
                        <div className="h-3 w-px bg-gray-200" />
                        <span className="text-[10px] font-bold text-blue-500 animate-fade-in">
                            Drag to explore
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};


export default MindMapVisualView;

