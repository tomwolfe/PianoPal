import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { RecordedNote, SavedRecording } from '../types/piano';
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
  playRecording: (notes?: RecordedNote[]) => void;
  isPlayingBack: boolean;
  onNotePlayed: (note: string) => void;
  lastPlayedNote: string | null;
  setLastPlayedNote: (note: string | null) => void;
  saveRecording: (name: string) => void;
  deleteRecording: (id: string) => void;
  savedRecordings: SavedRecording[];
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

const STORAGE_KEY = 'pianopal_recordings';

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bpm } = useSettings();
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<RecordedNote[]>([]);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [lastPlayedNote, setLastPlayedNote] = useState<string | null>(null);
  const [savedRecordings, setSavedRecordings] = useState<SavedRecording[]>([]);

  const recordingStartTime = useRef<number>(0);
  const metronomeTimer = useRef<number | null>(null);
  const nextNoteTime = useRef<number>(0);

  // Load saved recordings
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedRecordings(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse saved recordings', e);
      }
    }
  }, []);

  // Save recordings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRecordings));
  }, [savedRecordings]);

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

  const saveRecording = useCallback((name: string) => {
    if (recordedNotes.length === 0) return;
    const newRecording: SavedRecording = {
      id: crypto.randomUUID(),
      name: name || `Recording ${new Date().toLocaleString()}`,
      timestamp: Date.now(),
      notes: [...recordedNotes]
    };
    setSavedRecordings(prev => [newRecording, ...prev]);
  }, [recordedNotes]);

  const deleteRecording = useCallback((id: string) => {
    setSavedRecordings(prev => prev.filter(r => r.id !== id));
  }, []);

  const onNotePlayed = useCallback((note: string) => {
    setLastPlayedNote(note);
    if (isRecording) {
      setRecordedNotes(prev => [...prev, {
        note,
        startTime: performance.now() - recordingStartTime.current
      }]);
    }
  }, [isRecording]);

  const playRecording = useCallback((notesToPlay?: RecordedNote[]) => {
    const notes = notesToPlay || recordedNotes;
    if (notes.length === 0 || isPlayingBack) return;
    setIsPlayingBack(true);
    
    const startTime = audioEngine.currentTime + 0.1;
    
    notes.forEach(rn => {
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

    const lastNoteTime = notes.length > 0 
      ? notes[notes.length - 1].startTime 
      : 0;
    setTimeout(() => setIsPlayingBack(false), lastNoteTime + 1000);
  }, [recordedNotes, isPlayingBack]);

  return (
    <PlaybackContext.Provider value={{
      isMetronomeActive, setIsMetronomeActive,
      isRecording, startRecording, stopRecording, recordedNotes, playRecording, isPlayingBack,
      onNotePlayed, lastPlayedNote, setLastPlayedNote,
      saveRecording, deleteRecording, savedRecordings
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
