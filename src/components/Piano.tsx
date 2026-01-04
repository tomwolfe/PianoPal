import React, { useEffect, useState, useCallback } from 'react';
import { PianoKey } from './PianoKey';
import { PIANO_KEYS } from '../utils/pianoNotes';
import { useApp } from '../context/AppContext';

export const Piano: React.FC = () => {
  const { practiceMode, onNotePlayed, lastPlayedNote } = useApp();
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  const handleNoteStart = useCallback((note: string) => {
    setActiveNotes(prev => new Set(prev).add(note));
    onNotePlayed(note);
  }, [onNotePlayed]);

  const handleNoteEnd = useCallback((note: string) => {
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
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

  return (
    <div className="flex justify-center items-start overflow-x-auto p-8 w-full">
      <div className="flex relative">
        {PIANO_KEYS.map((key) => (
          <PianoKey
            key={key.note}
            keyInfo={key}
            isActive={activeNotes.has(key.note) || lastPlayedNote === key.note}
            onPress={handleNoteStart}
            showNoteName={practiceMode}
          />
        ))}
      </div>
    </div>
  );
};
