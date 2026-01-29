import React, { useEffect, useState, useCallback, useRef } from 'react';
import { PianoKey } from './PianoKey';
import { PIANO_KEYS, PIANO_KEYS_MAP } from '../utils/pianoNotes';
import { useSettings } from '../context/SettingsContext';
import { usePlayback } from '../context/PlaybackContext';
import { useLesson } from '../context/LessonContext';
import { useAudioEngine } from '../hooks/useAudioEngine';

export const Piano: React.FC = () => {
  const { practiceMode } = useSettings();
  const { lastPlayedNote } = usePlayback();
  const { checkNote } = useLesson();
  const { playNote, stopNote } = useAudioEngine();
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const activeNotesRef = useRef<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNoteStart = useCallback((note: string) => {
    if (activeNotesRef.current.has(note)) return;

    const keyInfo = PIANO_KEYS_MAP[note];
    if (keyInfo) {
      playNote(keyInfo.freq, note);
      activeNotesRef.current.add(note);
      setActiveNotes(new Set(activeNotesRef.current));
      checkNote(note);
    }
  }, [checkNote, playNote]);

  const handleNoteEnd = useCallback((note: string) => {
    if (!activeNotesRef.current.has(note)) return;

    stopNote(note);
    activeNotesRef.current.delete(note);
    setActiveNotes(new Set(activeNotesRef.current));
  }, [stopNote]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey) return;
      const keyInfo = PIANO_KEYS.find(k => k.keyboardKey === e.key.toLowerCase());
      if (keyInfo) {
        handleNoteStart(keyInfo.note);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyInfo = PIANO_KEYS.find(k => k.keyboardKey === e.key.toLowerCase());
      if (keyInfo) {
        handleNoteEnd(keyInfo.note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleNoteStart, handleNoteEnd]);

  const whiteKeys = PIANO_KEYS.filter(k => !k.isBlack);
  const blackKeys = PIANO_KEYS.filter(k => k.isBlack);

  return (
    <div className="flex justify-center items-start overflow-x-auto p-4 md:p-12 w-full select-none" ref={containerRef}>
      <div className="flex relative shadow-2xl rounded-b-xl bg-slate-200 dark:bg-slate-800 p-2">
        {/* White Keys */}
        {whiteKeys.map((key) => (
          <PianoKey
            key={key.note}
            keyInfo={key}
            isActive={activeNotes.has(key.note) || lastPlayedNote === key.note}
            onPress={handleNoteStart}
            onRelease={handleNoteEnd}
            showNoteName={practiceMode}
          />
        ))}

        {/* Black Keys */}
        {blackKeys.map((key) => {
          const baseNote = key.note.replace('#', '');
          const whiteIndex = whiteKeys.findIndex(wk => wk.note === baseNote);
          
          if (whiteIndex === -1) return null;

          // Standardized offset calculation using CSS variables
          const offset = `calc(((${whiteIndex} + 1) * var(--white-key-width)) - (var(--black-key-width) / 2) + 8px)`;

          return (
            <div key={key.note} style={{ position: 'absolute', left: offset, top: '8px' }}>
              <PianoKey
                keyInfo={key}
                isActive={activeNotes.has(key.note) || lastPlayedNote === key.note}
                onPress={handleNoteStart}
                onRelease={handleNoteEnd}
                showNoteName={practiceMode}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
