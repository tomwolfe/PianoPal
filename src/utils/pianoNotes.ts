import type { PianoKeyInfo } from '../types/piano';

export const PIANO_KEYS: PianoKeyInfo[] = [
  // Octave 3
  { note: 'C3', freq: 130.81, isBlack: false, keyboardKey: 'a' },
  { note: 'C#3', freq: 138.59, isBlack: true, keyboardKey: 'w' },
  { note: 'D3', freq: 146.83, isBlack: false, keyboardKey: 's' },
  { note: 'D#3', freq: 155.56, isBlack: true, keyboardKey: 'e' },
  { note: 'E3', freq: 164.81, isBlack: false, keyboardKey: 'd' },
  { note: 'F3', freq: 174.61, isBlack: false, keyboardKey: 'f' },
  { note: 'F#3', freq: 185.00, isBlack: true, keyboardKey: 't' },
  { note: 'G3', freq: 196.00, isBlack: false, keyboardKey: 'g' },
  { note: 'G#3', freq: 207.65, isBlack: true, keyboardKey: 'y' },
  { note: 'A3', freq: 220.00, isBlack: false, keyboardKey: 'h' },
  { note: 'A#3', freq: 233.08, isBlack: true, keyboardKey: 'u' },
  { note: 'B3', freq: 246.94, isBlack: false, keyboardKey: 'j' },
  // Octave 4
  { note: 'C4', freq: 261.63, isBlack: false, keyboardKey: 'k' },
  { note: 'C#4', freq: 277.18, isBlack: true, keyboardKey: 'o' },
  { note: 'D4', freq: 293.66, isBlack: false, keyboardKey: 'l' },
  { note: 'D#4', freq: 311.13, isBlack: true, keyboardKey: 'p' },
  { note: 'E4', freq: 329.63, isBlack: false, keyboardKey: ';' },
  { note: 'F4', freq: 349.23, isBlack: false, keyboardKey: "'" },
  { note: 'F#4', freq: 369.99, isBlack: true, keyboardKey: ']' },
  { note: 'G4', freq: 392.00, isBlack: false, keyboardKey: 'z' },
  { note: 'G#4', freq: 415.30, isBlack: true, keyboardKey: 'x' },
  { note: 'A4', freq: 440.00, isBlack: false, keyboardKey: 'c' },
  { note: 'A#4', freq: 466.16, isBlack: true, keyboardKey: 'v' },
  { note: 'B4', freq: 493.88, isBlack: false, keyboardKey: 'b' },
  // Octave 5
  { note: 'C5', freq: 523.25, isBlack: false, keyboardKey: 'n' },
];

export const PIANO_KEYS_MAP = PIANO_KEYS.reduce((acc, key) => {
  acc[key.note] = key;
  return acc;
}, {} as Record<string, PianoKeyInfo>);
