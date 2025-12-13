import React from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            InsightGen <span className="text-slate-400 font-medium text-sm ml-2 hidden sm:inline-block">AI Social Studio</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
             <span>Gemini 2.5 Flash</span>
          </div>

          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;