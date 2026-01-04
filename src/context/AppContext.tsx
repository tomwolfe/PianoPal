import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import type { RecordedNote } from '../types/piano';
import { audioEngine } from '../utils/audioEngine';
import { PIANO_KEYS_MAP } from '../utils/pianoNotes';
import { TWINKLE_TWINKLE } from '../utils/lessonEngine';

interface AppContextType {
  bpm: number;
  setBpm: (bpm: number) => void;
  isMetronomeActive: boolean;
  setIsMetronomeActive: (active: boolean) => void;
  
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  recordedNotes: RecordedNote[];
  playRecording: () => void;
  isPlayingBack: boolean;

  practiceMode: boolean;
  setPracticeMode: (mode: boolean) => void;

  lessonActive: boolean;
  setLessonActive: (active: boolean) => void;
  lessonProgress: number;
  setLessonProgress: (progress: number) => void;
  onNotePlayed: (note: string) => void;
  lastPlayedNote: string | null;
  lessonFeedback: 'correct' | 'wrong' | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bpm, setBpm] = useState(() => Number(localStorage.getItem('bpm')) || 120);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<RecordedNote[]>([]);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [practiceMode, setPracticeMode] = useState(true);
  const [lessonActive, setLessonActive] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [lastPlayedNote, setLastPlayedNote] = useState<string | null>(null);
  const [lessonFeedback, setLessonFeedback] = useState<'correct' | 'wrong' | null>(null);

  const recordingStartTime = useRef<number>(0);
  const metronomeTimer = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('bpm', bpm.toString());
  }, [bpm]);

  // Metronome logic
  useEffect(() => {
    if (isMetronomeActive) {
      const interval = (60 / bpm) * 1000;
      const tick = () => {
        audioEngine.playClick(880); // High click
        metronomeTimer.current = window.setTimeout(tick, interval);
      };
      tick();
    } else {
      if (metronomeTimer.current) clearTimeout(metronomeTimer.current);
    }
    return () => {
      if (metronomeTimer.current) clearTimeout(metronomeTimer.current);
    };
  }, [isMetronomeActive, bpm]);

  const startRecording = () => {
    setRecordedNotes([]);
    setIsRecording(true);
    recordingStartTime.current = performance.now();
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onNotePlayed = (note: string) => {
    setLastPlayedNote(note);
    if (isRecording) {
      setRecordedNotes(prev => [...prev, {
        note,
        startTime: performance.now() - recordingStartTime.current
      }]);
    }
    
    // Lesson logic
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
  };

  const playRecording = () => {
    if (recordedNotes.length === 0 || isPlayingBack) return;
    setIsPlayingBack(true);
    
    recordedNotes.forEach(rn => {
      setTimeout(() => {
        const key = PIANO_KEYS_MAP[rn.note];
        if (key) {
          audioEngine.playNote(key.freq, key.note);
          // Visual feedback for playback
          setLastPlayedNote(rn.note);
          setTimeout(() => setLastPlayedNote(null), 200);
        }
      }, rn.startTime);
    });

    const lastNoteTime = recordedNotes[recordedNotes.length - 1].startTime;
    setTimeout(() => setIsPlayingBack(false), lastNoteTime + 1000);
  };

  return (
    <AppContext.Provider value={{
      bpm, setBpm,
      isMetronomeActive, setIsMetronomeActive,
      isRecording, startRecording, stopRecording, recordedNotes, playRecording, isPlayingBack,
      practiceMode, setPracticeMode,
      lessonActive, setLessonActive,
      lessonProgress, setLessonProgress,
      onNotePlayed,
      lastPlayedNote,
      lessonFeedback
    }}>
      {children}
    </AppContext.Provider>
  );
};

// I need PIANO_KEYS_MAP but I haven't defined it yet. I'll do it in pianoNotes.ts
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
