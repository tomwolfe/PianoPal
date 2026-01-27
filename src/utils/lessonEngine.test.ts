import { describe, it, expect } from 'vitest';
import { evaluateNoteTiming } from './lessonEngine';

describe('evaluateNoteTiming', () => {
  it('should return perfect for timing within 100ms', () => {
    expect(evaluateNoteTiming('C4', 'C4', 1050, 1000)).toBe('perfect');
    expect(evaluateNoteTiming('C4', 'C4', 950, 1000)).toBe('perfect');
  });

  it('should return good for timing within 250ms', () => {
    expect(evaluateNoteTiming('C4', 'C4', 1150, 1000)).toBe('good');
    expect(evaluateNoteTiming('C4', 'C4', 850, 1000)).toBe('good');
  });

  it('should return late for timing after 250ms', () => {
    expect(evaluateNoteTiming('C4', 'C4', 1300, 1000)).toBe('late');
  });

  it('should return wrong for wrong note', () => {
    expect(evaluateNoteTiming('D4', 'C4', 1000, 1000)).toBe('wrong');
  });

  it('should return wrong for timing too early (before -250ms)', () => {
    expect(evaluateNoteTiming('C4', 'C4', 700, 1000)).toBe('wrong');
  });
});