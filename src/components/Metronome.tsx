import React from 'react';
import { useApp } from '../context/AppContext';

export const Metronome: React.FC = () => {
  const { bpm, setBpm, isMetronomeActive, setIsMetronomeActive } = useApp();

  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider">Metronome</h3>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="60"
          max="120"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-xl font-bold w-12 text-center">{bpm}</span>
        <button
          onClick={() => setIsMetronomeActive(!isMetronomeActive)}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            isMetronomeActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isMetronomeActive ? 'STOP' : 'START'}
        </button>
      </div>
    </div>
  );
};
