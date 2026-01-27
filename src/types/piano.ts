export type NoteName = string;

export interface PianoKeyInfo {
  note: NoteName;
  freq: number;
  isBlack: boolean;
  keyboardKey: string;
}

export interface RecordedNote {
  note: NoteName;
  startTime: number;
  duration?: number;
}

export interface SavedRecording {
  id: string;
  name: string;
  timestamp: number;
  notes: RecordedNote[];
}

export interface LessonNote {
  note: NoteName;
  time: number; // relative time in beats or ms
}

export type Theme = 'light' | 'dark';
