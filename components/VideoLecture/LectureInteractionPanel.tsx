
import React, { useState } from 'react';
import { TabType } from '../../types';
import Summary from './Summary';
import Chat from './Chat';
import Flashcards from './Flashcards';
import Quizzes from './Quizzes';
import Simulation from './Simulation';
import NotionNotes from './NotionNotes';
import Tabs from './Tabs';

interface LectureInteractionPanelProps {
    videoId: string;
}

const LectureInteractionPanel: React.FC<LectureInteractionPanelProps> = ({ videoId }) => {
    const [activeRightTab, setActiveRightTab] = useState<TabType>('Chat');

    return (
        <div className="flex-1 flex flex-col bg-[#fcfcfc] border-l border-gray-100 h-full overflow-hidden">
            <Tabs activeTab={activeRightTab} setActiveTab={setActiveRightTab} />

            <div className={`flex-1 overflow-x-hidden relative ${activeRightTab === 'Chat' ? 'p-0' : 'p-8 overflow-y-auto'}`}>
                {activeRightTab === 'Summary' && (
                    <Summary videoId={videoId}/>
                )}

                {activeRightTab === 'Chat' && (
                    <Chat />
                )}

                {activeRightTab === 'Simulation' && <Simulation videoId={videoId} />}

                {activeRightTab === 'Flashcards' && (
                    <Flashcards videoId={videoId} />
                )}

                {activeRightTab === 'Challenge Zone' && (
                    <Quizzes videoId={videoId} />
                )}

                {activeRightTab === 'Notes' && <NotionNotes />}
            </div>
        </div>
    );
};

export default LectureInteractionPanel;
