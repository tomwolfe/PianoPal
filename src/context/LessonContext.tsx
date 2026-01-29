import React, { createContext, useContext, useState, useCallback } from 'react';
import { LESSONS, type Lesson, evaluateNoteTiming, type FeedbackType } from '../utils/lessonEngine';
import { usePlayback } from './PlaybackContext';
import { audioEngine } from '../utils/audioEngine';

interface LessonContextType {
  lessonActive: boolean;
  setLessonActive: (active: boolean) => void;
  activeLesson: Lesson;
  selectLesson: (id: string) => void;
  lessonProgress: number;
  setLessonProgress: (progress: number) => void;
  lessonFeedback: FeedbackType;
  checkNote: (note: string) => void;
  startTime: number;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { onNotePlayed } = usePlayback();
  const [activeLesson, setActiveLesson] = useState<Lesson>(LESSONS[0]);
  const [lessonActive, setLessonActive] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [lessonFeedback, setLessonFeedback] = useState<FeedbackType>(null);
  
  const [startTime, setStartTime] = useState<number>(0);

  const startLesson = useCallback((active: boolean) => {
    if (active) {
      const now = audioEngine.currentTime;
      setStartTime(now);
      setLessonProgress(0);
    }
    setLessonActive(active);
  }, []);

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
      const expectedNote = activeLesson.notes[lessonProgress];
      if (!expectedNote) return;

      const elapsedMs = (audioEngine.currentTime - startTime) * 1000;
      const feedback = evaluateNoteTiming(
        note,
        expectedNote.note,
        elapsedMs,
        expectedNote.time
      );

      setLessonFeedback(feedback);

      if (feedback !== 'wrong' || note === expectedNote.note) {
        const nextProgress = lessonProgress + 1;
        setLessonProgress(nextProgress);
        
        if (nextProgress >= activeLesson.notes.length) {
          setTimeout(() => {
            setLessonActive(false);
            setLessonProgress(0);
          }, 1000);
        }
      }
      
      setTimeout(() => setLessonFeedback(null), 500);
    }
  }, [lessonActive, lessonProgress, activeLesson, onNotePlayed, startTime]);

  return (
    <LessonContext.Provider value={{
      lessonActive, 
      setLessonActive: startLesson,
      activeLesson, selectLesson,
      lessonProgress, setLessonProgress,
      lessonFeedback,
      checkNote,
      startTime
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
