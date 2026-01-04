import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { RecordedNote } from '../types/piano';
import { audioEngine } from '../utils/audioEngine';
import { PIANO_KEYS_MAP } from '../utils/pianoNotes';
import { useSettings } from './SettingsContext';

interface PlaybackContextType {
  isMetronomeActive: boolean;
  setIsMetronomeActive: (active: boolean) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  recordedNotes: RecordedNote[];
  playRecording: () => void;
  isPlayingBack: boolean;
  onNotePlayed: (note: string) => void;
  lastPlayedNote: string | null;
  setLastPlayedNote: (note: string | null) => void;
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bpm } = useSettings();
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<RecordedNote[]>([]);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [lastPlayedNote, setLastPlayedNote] = useState<string | null>(null);

  const recordingStartTime = useRef<number>(0);
  const metronomeTimer = useRef<number | null>(null);
  const nextNoteTime = useRef<number>(0);

  // Metronome logic
  useEffect(() => {
    if (isMetronomeActive) {
      nextNoteTime.current = audioEngine.currentTime;
      const lookahead = 25.0;
      const scheduleAheadTime = 0.1;

      const scheduler = () => {
        while (nextNoteTime.current < audioEngine.currentTime + scheduleAheadTime) {
          audioEngine.playClick(880, nextNoteTime.current);
          nextNoteTime.current += 60.0 / bpm;
        }
        metronomeTimer.current = window.setTimeout(scheduler, lookahead);
      };
      scheduler();
    } else {
      if (metronomeTimer.current) clearTimeout(metronomeTimer.current);
    }
    return () => {
      if (metronomeTimer.current) clearTimeout(metronomeTimer.current);
    };
  }, [isMetronomeActive, bpm]);

  const startRecording = useCallback(() => {
    setRecordedNotes([]);
    setIsRecording(true);
    recordingStartTime.current = performance.now();
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  const onNotePlayed = useCallback((note: string) => {
    setLastPlayedNote(note);
    if (isRecording) {
      setRecordedNotes(prev => [...prev, {
        note,
        startTime: performance.now() - recordingStartTime.current
      }]);
    }
    // We'll clear the last played note after a short delay for visual feedback
    // unless it's managed by the Piano component's own state
  }, [isRecording]);

  const playRecording = useCallback(() => {
    if (recordedNotes.length === 0 || isPlayingBack) return;
    setIsPlayingBack(true);
    
    const startTime = audioEngine.currentTime + 0.1;
    
    recordedNotes.forEach(rn => {
      const key = PIANO_KEYS_MAP[rn.note];
      if (key) {
        const noteTime = startTime + rn.startTime / 1000;
        audioEngine.playNote(key.freq, key.note, noteTime);
        
        setTimeout(() => {
          setLastPlayedNote(rn.note);
          setTimeout(() => setLastPlayedNote(null), 200);
        }, rn.startTime);
      }
    });

    const lastNoteTime = recordedNotes.length > 0 
      ? recordedNotes[recordedNotes.length - 1].startTime 
      : 0;
    setTimeout(() => setIsPlayingBack(false), lastNoteTime + 1000);
  }, [recordedNotes, isPlayingBack]);

  return (
    <PlaybackContext.Provider value={{
      isMetronomeActive, setIsMetronomeActive,
      isRecording, startRecording, stopRecording, recordedNotes, playRecording, isPlayingBack,
      onNotePlayed, lastPlayedNote, setLastPlayedNote
    }}>
      {children}
    </PlaybackContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) throw new Error('usePlayback must be used within a PlaybackProvider');
  return context;
};
