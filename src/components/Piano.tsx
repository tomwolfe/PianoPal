import React, { useEffect, useState, useCallback } from 'react';
import { PianoKey } from './PianoKey';
import { PIANO_KEYS } from '../utils/pianoNotes';
import { useSettings } from '../context/SettingsContext';
import { usePlayback } from '../context/PlaybackContext';
import { useLesson } from '../context/LessonContext';

export const Piano: React.FC = () => {
  const { practiceMode } = useSettings();
  const { lastPlayedNote } = usePlayback();
  const { checkNote } = useLesson();
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

  const handleNoteStart = useCallback((note: string) => {
    setActiveNotes(prev => new Set(prev).add(note));
    checkNote(note);
  }, [checkNote]);

  const handleNoteEnd = useCallback((note: string) => {
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
  }, []);

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
    <div className="flex justify-center items-start overflow-x-auto p-12 w-full select-none">
      <div className="flex relative shadow-2xl rounded-b-xl bg-slate-200 dark:bg-slate-800 p-2">
        {/* White Keys */}
        {whiteKeys.map((key) => (
          <PianoKey
            key={key.note}
            keyInfo={key}
            isActive={activeNotes.has(key.note) || lastPlayedNote === key.note}
            onPress={handleNoteStart}
            showNoteName={practiceMode}
          />
        ))}

        {/* Black Keys */}
        {blackKeys.map((key) => {
          // Find the index of the white key that this black key follows
          // e.g., C# follows C
          const baseNote = key.note.replace('#', '');
          const whiteIndex = whiteKeys.findIndex(wk => wk.note === baseNote);
          
          if (whiteIndex === -1) return null;

          // Each white key is 64px (w-16) + 2px for border
          // We want to center the 40px (w-10) black key on the line between white keys
          const offset = (whiteIndex + 1) * 64 - 20 + 8; // 8 is for the container padding

          return (
            <div key={key.note} style={{ '--black-key-offset': `${offset}px` } as any}>
              <PianoKey
                keyInfo={key}
                isActive={activeNotes.has(key.note) || lastPlayedNote === key.note}
                onPress={handleNoteStart}
                showNoteName={practiceMode}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
