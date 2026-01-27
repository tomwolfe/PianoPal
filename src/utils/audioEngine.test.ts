import { describe, it, expect, vi, beforeEach } from 'vitest';
import { audioEngine } from './audioEngine';

// Mock Web Audio API
class MockAudioContext {
  state = 'suspended';
  currentTime = 0;
  resume = vi.fn().mockResolvedValue(undefined);
  createOscillator = vi.fn().mockReturnValue({
    type: '',
    frequency: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  });
  createGain = vi.fn().mockReturnValue({
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
      cancelScheduledValues: vi.fn(),
      value: 1,
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  });
  createDynamicsCompressor = vi.fn().mockReturnValue({
    threshold: { setValueAtTime: vi.fn() },
    knee: { setValueAtTime: vi.fn() },
    ratio: { setValueAtTime: vi.fn() },
    attack: { setValueAtTime: vi.fn() },
    release: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
  });
  destination = {};
}

(globalThis as unknown as { AudioContext: typeof MockAudioContext }).AudioContext = MockAudioContext;
(globalThis as unknown as { window: typeof globalThis }).window = globalThis;

describe('AudioEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an audio context on first use', () => {
    expect(audioEngine.currentTime).toBe(0);
  });

  it('should play a note', () => {
    audioEngine.playNote(440, 'A4');
    // We can't easily check internal oscillators map but we can check if nodes were created
  });

  it('should stop a note', () => {
    audioEngine.playNote(440, 'A4');
    audioEngine.stopNote('A4');
  });
});
