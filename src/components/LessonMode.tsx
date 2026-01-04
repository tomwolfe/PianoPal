import React from 'react';
import { useLesson } from '../context/LessonContext';
import { LESSONS } from '../utils/lessonEngine';

export const LessonMode: React.FC = () => {
  const { 
    lessonActive, 
    setLessonActive, 
    activeLesson, 
    selectLesson, 
    lessonProgress, 
    setLessonProgress, 
    lessonFeedback: feedback 
  } = useLesson();

  const currentNote = activeLesson.notes[lessonProgress];

  if (!lessonActive) {
    return (
      <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-lg">
        <h3 className="text-xl font-black mb-2 text-slate-800 dark:text-white">Music Lessons</h3>
        <p className="text-slate-500 text-sm mb-6 text-center">
          Select a piece to learn note by note with interactive feedback.
        </p>
        
        <div className="grid grid-cols-1 gap-4 w-full mb-6">
          {LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => selectLesson(lesson.id)}
              className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${
                activeLesson.id === lesson.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-slate-100 dark:border-slate-700 hover:border-slate-200'
              }`}
            >
              <span className="font-bold text-slate-800 dark:text-white">{lesson.name}</span>
              <span className="text-xs text-slate-500">{lesson.description}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setLessonActive(true);
            setLessonProgress(0);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all hover:shadow-lg active:scale-[0.98]"
        >
          START {activeLesson.name.toUpperCase()}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl border-2 border-blue-500 w-full max-w-lg relative overflow-hidden">
      <div className="flex justify-between items-center w-full mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Active Lesson</span>
          <h4 className="text-lg font-bold text-slate-800 dark:text-white">{activeLesson.name}</h4>
        </div>
        <button 
          onClick={() => setLessonActive(false)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          aria-label="Close lesson"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="flex flex-col items-center mb-8 bg-slate-50 dark:bg-slate-900/50 w-full py-8 rounded-2xl border border-slate-100 dark:border-slate-800">
        <span className="text-sm text-slate-400 mb-2 font-medium">Next note to play:</span>
        <div className="text-7xl font-black text-slate-800 dark:text-white relative">
          {currentNote?.note}
          {feedback === 'correct' && (
            <div className="absolute -right-12 top-0 text-4xl text-green-500 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          )}
          {feedback === 'wrong' && (
            <div className="absolute -right-12 top-0 text-4xl text-red-500 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </div>
          )}
        </div>
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Progress</span>
          <span>{Math.round((lessonProgress / activeLesson.notes.length) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${(lessonProgress / activeLesson.notes.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-center">
          <span className="text-[10px] text-slate-400 font-bold">
            NOTE {lessonProgress} OF {activeLesson.notes.length}
          </span>
        </div>
      </div>

      {lessonProgress >= activeLesson.notes.length && (
        <div className="absolute inset-0 bg-blue-600 flex flex-col items-center justify-center text-white p-8 text-center animate-in fade-in duration-300">
          <div className="mb-4 bg-white/20 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
          </div>
          <h2 className="text-3xl font-black mb-2 italic">MASTERED!</h2>
          <p className="mb-8 opacity-90">You've successfully completed {activeLesson.name}.</p>
          <button
            onClick={() => {
              setLessonActive(false);
              setLessonProgress(0);
            }}
            className="bg-white text-blue-600 px-10 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg"
          >
            CONTINUE
          </button>
        </div>
      )}
    </div>
  );
};