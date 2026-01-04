import React, { createContext, useContext, useState, useCallback } from 'react';
import { TWINKLE_TWINKLE } from '../utils/lessonEngine';
import { usePlayback } from './PlaybackContext';

interface LessonContextType {
  lessonActive: boolean;
  setLessonActive: (active: boolean) => void;
  lessonProgress: number;
  setLessonProgress: (progress: number) => void;
  lessonFeedback: 'correct' | 'wrong' | null;
  checkNote: (note: string) => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { onNotePlayed } = usePlayback();
  const [lessonActive, setLessonActive] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [lessonFeedback, setLessonFeedback] = useState<'correct' | 'wrong' | null>(null);

  const checkNote = useCallback((note: string) => {
    onNotePlayed(note);
    
    if (lessonActive) {
      const expectedNote = TWINKLE_TWINKLE.notes[lessonProgress]?.note;
      if (note === expectedNote) {
        setLessonFeedback('correct');
        setLessonProgress(prev => prev + 1);
        setTimeout(() => setLessonFeedback(null), 500);
      } else {
        setLessonFeedback('wrong');
        setTimeout(() => setLessonFeedback(null), 500);
      }
    }
  }, [lessonActive, lessonProgress, onNotePlayed]);

  return (
    <LessonContext.Provider value={{
      lessonActive, setLessonActive,
      lessonProgress, setLessonProgress,
      lessonFeedback,
      checkNote
    }}>
      {children}
    </LessonContext.Provider>
  );
};

export const useLesson = () => {
  const context = useContext(LessonContext);
  if (!context) throw new Error('useLesson must be used within a LessonProvider');
  return context;
};
