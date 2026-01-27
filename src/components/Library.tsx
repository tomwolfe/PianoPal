import React from 'react';
import { usePlayback } from '../context/PlaybackContext';

export const Library: React.FC = () => {
  const { savedRecordings, playRecording, deleteRecording, isPlayingBack } = usePlayback();

  if (savedRecordings.length === 0) {
    return (
      <div className="flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 w-full max-w-lg">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Your Library is Empty</h3>
        <p className="text-sm text-slate-500 text-center mt-2">
          Start recording your performances to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 w-full max-w-lg">
      <div className="flex items-center justify-between w-full mb-6">
        <h3 className="text-xl font-black text-slate-800 dark:text-white">Saved Recordings</h3>
        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2 py-1 rounded-full uppercase">
          {savedRecordings.length} Tracks
        </span>
      </div>

      <div className="w-full space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {savedRecordings.map((recording) => (
          <div 
            key={recording.id}
            className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md"
          >
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-slate-800 dark:text-white truncate">{recording.name}</span>
              <span className="text-[10px] text-slate-400 font-medium">
                {new Date(recording.timestamp).toLocaleDateString()} • {recording.notes.length} notes
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => playRecording(recording.notes)}
                disabled={isPlayingBack}
                className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-lg transition-colors shadow-sm active:scale-95"
                title="Play recording"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </button>
              <button
                onClick={() => deleteRecording(recording.id)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
