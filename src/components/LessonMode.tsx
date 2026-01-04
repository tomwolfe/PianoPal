import React from 'react';
import { useApp } from '../context/AppContext';
import { TWINKLE_TWINKLE } from '../utils/lessonEngine';

export const LessonMode: React.FC = () => {
  const { lessonActive, setLessonActive, lessonProgress, setLessonProgress, lessonFeedback: feedback } = useApp();

  const currentNote = TWINKLE_TWINKLE.notes[lessonProgress];

  if (!lessonActive) {
    return (
      <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Interactive Lesson</h3>
        <p className="text-slate-500 text-sm mb-4 text-center">
          Learn "Twinkle Twinkle Little Star" note by note with real-time feedback.
        </p>
        <button
          onClick={() => {
            setLessonActive(true);
            setLessonProgress(0);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold transition-transform hover:scale-105"
        >
          START LESSON
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 border-blue-500 w-full max-w-md relative overflow-hidden">
      <div className="flex justify-between w-full mb-4">
        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Lesson: {TWINKLE_TWINKLE.name}</span>
        <button 
          onClick={() => setLessonActive(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col items-center mb-6">
        <span className="text-sm text-slate-500 mb-1">Play this note:</span>
        <div className="text-6xl font-black text-slate-800 dark:text-white flex items-center gap-4">
          {currentNote?.note}
          {feedback === 'correct' && <span className="text-green-500 animate-bounce">✅</span>}
          {feedback === 'wrong' && <span className="text-red-500 animate-shake">❌</span>}
        </div>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mb-2">
        <div 
          className="bg-green-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${(lessonProgress / TWINKLE_TWINKLE.notes.length) * 100}%` }}
        />
      </div>
      <span className="text-[10px] text-slate-400 font-bold uppercase">
        Progress: {lessonProgress} / {TWINKLE_TWINKLE.notes.length}
      </span>

      {lessonProgress >= TWINKLE_TWINKLE.notes.length && (
        <div className="absolute inset-0 bg-green-500/90 flex flex-col items-center justify-center text-white p-6 text-center">
          <h2 className="text-2xl font-black mb-2">CONGRATULATIONS!</h2>
          <p className="mb-4">You've mastered {TWINKLE_TWINKLE.name}!</p>
          <button
            onClick={() => {
              setLessonActive(false);
              setLessonProgress(0);
            }}
            className="bg-white text-green-600 px-6 py-2 rounded-full font-bold"
          >
            FINISH
          </button>
        </div>
      )}
    </div>
  );
};