import type { LessonNote } from '../types/piano';

export interface Lesson {
  id: string;
  name: string;
  notes: LessonNote[];
}

export const TWINKLE_TWINKLE: Lesson = {
  id: 'twinkle',
  name: 'Twinkle Twinkle Little Star',
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
