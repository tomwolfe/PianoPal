import type { LessonNote } from '../types/piano';

export type FeedbackType = 'perfect' | 'good' | 'late' | 'wrong' | null;

export interface Lesson {
  id: string;
  name: string;
  description: string;
  notes: LessonNote[];
}

export const evaluateNoteTiming = (
  playedNote: string,
  expectedNote: string,
  elapsedMs: number,
  expectedMs: number
): FeedbackType => {
  if (playedNote !== expectedNote) return 'wrong';
  
  const diff = elapsedMs - expectedMs;
  
  if (Math.abs(diff) <= 100) return 'perfect';
  if (Math.abs(diff) <= 250) return 'good';
  if (diff > 250) return 'late';
  return 'wrong'; // Too early
};

export const TWINKLE_TWINKLE: Lesson = {
  id: 'twinkle',
  name: 'Twinkle Twinkle Little Star',
  description: 'A classic nursery rhyme to get started.',
  notes: [
    { note: 'C4', time: 0 }, { note: 'C4', time: 1000 },
    { note: 'G4', time: 2000 }, { note: 'G4', time: 3000 },
    { note: 'A4', time: 4000 }, { note: 'A4', time: 5000 },
    { note: 'G4', time: 6000 },
    { note: 'F4', time: 8000 }, { note: 'F4', time: 9000 },
    { note: 'E4', time: 10000 }, { note: 'E4', time: 11000 },
    { note: 'D4', time: 12000 }, { note: 'D4', time: 13000 },
    { note: 'C4', time: 14000 },
  ]
};

export const ODE_TO_JOY: Lesson = {
  id: 'ode-to-joy',
  name: 'Ode to Joy',
  description: 'Beethoven\'s famous melody.',
  notes: [
    { note: 'E4', time: 0 }, { note: 'E4', time: 500 },
    { note: 'F4', time: 1000 }, { note: 'G4', time: 1500 },
    { note: 'G4', time: 2000 }, { note: 'F4', time: 2500 },
    { note: 'E4', time: 3000 }, { note: 'D4', time: 3500 },
    { note: 'C4', time: 4000 }, { note: 'C4', time: 4500 },
    { note: 'D4', time: 5000 }, { note: 'E4', time: 5500 },
    { note: 'E4', time: 6000 }, { note: 'D4', time: 6750 },
    { note: 'D4', time: 7000 },
  ]
};

export const C_MAJOR_SCALE: Lesson = {
  id: 'c-major-scale',
  name: 'C Major Scale',
  description: 'The fundamental scale in Western music.',
  notes: [
    { note: 'C4', time: 0 }, { note: 'D4', time: 500 },
    { note: 'E4', time: 1000 }, { note: 'F4', time: 1500 },
    { note: 'G4', time: 2000 }, { note: 'A4', time: 2500 },
    { note: 'B4', time: 3000 }, { note: 'C5', time: 3500 },
  ]
};

export const LESSONS: Lesson[] = [
  TWINKLE_TWINKLE,
  ODE_TO_JOY,
  C_MAJOR_SCALE
];
