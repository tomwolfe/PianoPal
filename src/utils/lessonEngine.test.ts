import { describe, it, expect } from 'vitest';
import { TWINKLE_TWINKLE } from './lessonEngine';

describe('Lesson Engine', () => {
  it('should have a valid lesson structure for Twinkle Twinkle', () => {
    expect(TWINKLE_TWINKLE.name).toBe('Twinkle Twinkle Little Star');
    expect(TWINKLE_TWINKLE.notes.length).toBeGreaterThan(0);
  });

  it('should have notes with valid format', () => {
    TWINKLE_TWINKLE.notes.forEach(note => {
      expect(note.note).toMatch(/[A-G][#]?[0-8]/);
      expect(note.time).toBeGreaterThanOrEqual(0);
    });
  });

  it('should starts with C4', () => {
    expect(TWINKLE_TWINKLE.notes[0].note).toBe('C4');
  });
});
