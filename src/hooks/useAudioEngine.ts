import { useCallback, useEffect } from 'react';
import { audioEngine } from '../utils/audioEngine';

export const useAudioEngine = () => {
  const playNote = useCallback((freq: number, noteId: string, time?: number) => {
    audioEngine.playNote(freq, noteId, time);
  }, []);

  const stopNote = useCallback((noteId: string, time?: number) => {
    audioEngine.stopNote(noteId, time);
  }, []);

  const playClick = useCallback((freq: number, time: number) => {
    audioEngine.playClick(freq, time);
  }, []);

  // Ensure all notes are stopped if the hook is unmounted (though it's usually used at app level)
  useEffect(() => {
    return () => {
      // We don't necessarily want to dispose the whole engine here if other components use it,
      // but we might want to stop all active notes triggered by this hook if we tracked them.
      // For a singleton global engine, we might just leave it.
    };
  }, []);

  return {
    playNote,
    stopNote,
    playClick,
    currentTime: audioEngine.currentTime,
  };
};
