import React from 'react';
import { useApp } from '../context/AppContext';

export const Recorder: React.FC = () => {
  const { isRecording, startRecording, stopRecording, recordedNotes, playRecording, isPlayingBack } = useApp();

  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider">Recorder</h3>
      <div className="flex items-center gap-4">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold animate-pulse"
          >
            <div className="w-3 h-3 bg-white rounded-full"></div>
            STOP
          </button>
        ) : (
          <button
            onClick={startRecording}
            disabled={isPlayingBack}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-4 py-2 rounded-lg font-bold disabled:opacity-50"
          >
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            REC
          </button>
        )}
        
        <button
          onClick={playRecording}
          disabled={recordedNotes.length === 0 || isRecording || isPlayingBack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50 flex items-center gap-2"
        >
          {isPlayingBack ? (
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-white animate-bounce"></div>
              <div className="w-1 h-3 bg-white animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-1 h-3 bg-white animate-bounce [animation-delay:0.2s]"></div>
            </div>
          ) : 'PLAY'}
        </button>
        
        <span className="text-xs text-slate-500 font-mono">
          {recordedNotes.length} notes
        </span>
      </div>
    </div>
  );
};
