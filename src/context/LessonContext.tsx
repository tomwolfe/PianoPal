import React, { createContext, useContext, useState, useCallback } from 'react';
import { LESSONS, Lesson } from '../utils/lessonEngine';
import { usePlayback } from './PlaybackContext';

interface LessonContextType {
  lessonActive: boolean;
  setLessonActive: (active: boolean) => void;
  activeLesson: Lesson;
  selectLesson: (id: string) => void;
  lessonProgress: number;
  setLessonProgress: (progress: number) => void;
  lessonFeedback: 'correct' | 'wrong' | null;
  checkNote: (note: string) => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { onNotePlayed } = usePlayback();
  const [activeLesson, setActiveLesson] = useState<Lesson>(LESSONS[0]);
  const [lessonActive, setLessonActive] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [lessonFeedback, setLessonFeedback] = useState<'correct' | 'wrong' | null>(null);

  const selectLesson = useCallback((id: string) => {
    const lesson = LESSONS.find(l => l.id === id);
    if (lesson) {
      setActiveLesson(lesson);
      setLessonProgress(0);
      setLessonActive(false);
    }
  }, []);

  const checkNote = useCallback((note: string) => {
    onNotePlayed(note);
    
    if (lessonActive) {
      const expectedNote = activeLesson.notes[lessonProgress]?.note;
      if (note === expectedNote) {
        setLessonFeedback('correct');
        const nextProgress = lessonProgress + 1;
        setLessonProgress(nextProgress);
        
        if (nextProgress >= activeLesson.notes.length) {
          setTimeout(() => {
            setLessonActive(false);
            setLessonProgress(0);
          }, 1000);
        }
        
        setTimeout(() => setLessonFeedback(null), 500);
      } else {
        setLessonFeedback('wrong');
        setTimeout(() => setLessonFeedback(null), 500);
      }
    }
  }, [lessonActive, lessonProgress, activeLesson, onNotePlayed]);

  return (
    <LessonContext.Provider value={{
      lessonActive, setLessonActive,
      activeLesson, selectLesson,
      lessonProgress, setLessonProgress,
      lessonFeedback,
      checkNote
    }}>
      {children}
    </LessonContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLesson = () => {
  const context = useContext(LessonContext);
  if (!context) throw new Error('useLesson must be used within a LessonProvider');
  return context;
};
