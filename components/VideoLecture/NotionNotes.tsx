
import React, { useState } from 'react';

interface NoteBlock {
  id: string;
  type: 'h1' | 'text';
  content: string;
}

const NotionNotes: React.FC = () => {
  const [blocks, setBlocks] = useState<NoteBlock[]>([
    { id: '1', type: 'h1', content: 'My Custom Study Notes' },
    { id: '2', type: 'text', content: 'Click here to start typing your thoughts on this lecture...' },
  ]);

  const addBlock = (type: 'h1' | 'text') => {
    setBlocks([...blocks, { id: Date.now().toString(), type, content: '' }]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-20">
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => addBlock('h1')}
          className="text-xs font-bold border border-gray-300 bg-white text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all flex items-center gap-1"
        >
          <span className="text-gray-400">#</span> Heading
        </button>
        <button
          onClick={() => addBlock('text')}
          className="text-xs font-bold border border-gray-300 bg-white text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all flex items-center gap-1"
        >
          <span className="text-gray-400">Aa</span> Text
        </button>
      </div>
      <div className="space-y-1">
        {blocks.map((block) => (
          <div key={block.id} className="group relative flex items-start gap-3">
            <button
              onClick={() => removeBlock(block.id)}
              className="opacity-0 group-hover:opacity-100 absolute -left-8 top-1.5 text-gray-400 hover:text-red-500 p-1 transition-opacity"
              title="Remove block"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
            {block.type === 'h1' ? (
              <input
                className="w-full text-2xl font-black text-gray-900 bg-transparent focus:outline-none placeholder-gray-300 tracking-tight"
                value={block.content}
                placeholder="Heading..."
                onChange={(e) => updateBlock(block.id, e.target.value)}
              />
            ) : (
              <textarea
                className="w-full text-base text-gray-700 bg-transparent focus:outline-none resize-none placeholder-gray-400 min-h-[1.5em] leading-relaxed"
                value={block.content}
                placeholder="Start typing or use '/' for commands..."
                rows={block.content.split('\n').length}
                onChange={(e) => updateBlock(block.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Cloud Sync Active</span>
        </div>
        <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default NotionNotes;
