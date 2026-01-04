class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private oscillators: Map<string, { osc: OscillatorNode; gain: GainNode }> = new Map();

  private getContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioCtx;
  }

  playNote(freq: number, noteId: string) {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Stop if already playing
    this.stopNote(noteId);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Use a combination of sine and a bit of square for a "fuller" sound, 
    // but sine + envelope is simpler and cleaner for synthesized piano.
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    
    // Auto stop after decay
    osc.stop(ctx.currentTime + 1.5);

    this.oscillators.set(noteId, { osc, gain });
  }

  stopNote(noteId: string) {
    const existing = this.oscillators.get(noteId);
    if (existing) {
      const { osc, gain } = existing;
      const ctx = this.getContext();
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      setTimeout(() => {
        try {
          osc.stop();
        } catch (e) {
          // already stopped
        }
      }, 100);
      this.oscillators.delete(noteId);
    }
  }

  playClick(freq: number) {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }
}

export const audioEngine = new AudioEngine();
