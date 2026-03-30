import React from 'react';
import { useNavigate } from 'react-router-dom';
const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 bg-white border-b px-6 py-3 shrink-0">
            <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                <div 
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => navigate('/dashboard')}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-md group-hover:scale-105 transition-transform duration-200">
                            <img 
                                src="/logoaakash.jpg" 
                                alt="Aakash Logo" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-sm font-black text-gray-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">
                            Digital Alchemy
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="text-sm font-bold border border-gray-300 rounded-full px-4 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-black shadow-sm transition-all active:scale-95">
                        <span className="text-indigo-600 font-black">+</span> Create Exam
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gray-200 border overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all">
                        <img src="https://picsum.photos/32/32?seed=user" alt="Profile" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
