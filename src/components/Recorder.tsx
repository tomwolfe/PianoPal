import React, { useState } from 'react';
import { usePlayback } from '../context/PlaybackContext';

export const Recorder: React.FC = () => {
  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    recordedNotes, 
    playRecording, 
    isPlayingBack,
    saveRecording
  } = usePlayback();

  const [isSaving, setIsSaving] = useState(false);
  const [recordingName, setRecordingName] = useState('');

  const handleSave = () => {
    if (recordedNotes.length === 0) return;
    setIsSaving(true);
  };

  const confirmSave = () => {
    saveRecording(recordingName);
    setRecordingName('');
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 relative">
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
          onClick={() => playRecording()}
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

        <button
          onClick={handleSave}
          disabled={recordedNotes.length === 0 || isRecording || isPlayingBack}
          className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 rounded-lg transition-colors disabled:opacity-50"
          title="Save to Library"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
        </button>
        
        <span className="text-xs text-slate-500 font-mono">
          {recordedNotes.length} notes
        </span>
      </div>

      {isSaving && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white dark:bg-slate-800 rounded-xl flex flex-col p-4 z-10 border-2 border-emerald-500 shadow-xl animate-in zoom-in duration-200">
          <input
            autoFocus
            type="text"
            placeholder="Recording Name..."
            value={recordingName}
            onChange={(e) => setRecordingName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && confirmSave()}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={confirmSave}
              className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-emerald-600 transition-colors"
            >
              SAVE
            </button>
            <button
              onClick={() => setIsSaving(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-bold text-sm"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
