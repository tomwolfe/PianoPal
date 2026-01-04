import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { practiceMode, setPracticeMode } = useApp();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h1 className="text-xl font-black tracking-tighter text-slate-800 dark:text-white">PIANOPAL</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => setPracticeMode(!practiceMode)}
          className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
            practiceMode ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-400'
          }`}
        >
          {practiceMode ? 'NOTES ON' : 'NOTES OFF'}
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 11H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.242 16.242l.707.707M6.343 6.343l.707.707M14.5 12a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};
