class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private oscillators: Map<string, { osc: OscillatorNode; gain: GainNode }> = new Map();

  private getContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioCtx;
  }

  get currentTime() {
    return this.getContext().currentTime;
  }

  playNote(freq: number, noteId: string, time?: number) {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const startTime = time || ctx.currentTime;

    // Stop if already playing at this time (or before)
    // For scheduled playback, we might not want to stop if it's in the future, 
    // but for simplicity we'll keep it.
    this.stopNote(noteId);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    const attack = 0.01;
    const decay = 0.1;
    const sustain = 0.3;
    const release = 1.0;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.6, startTime + attack);
    gain.gain.exponentialRampToValueAtTime(sustain, startTime + attack + decay);
    
    const stopTime = startTime + attack + decay + release;
    gain.gain.exponentialRampToValueAtTime(0.001, stopTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(stopTime + 0.1);

    this.oscillators.set(noteId, { osc, gain });
  }

  stopNote(noteId: string) {
    const existing = this.oscillators.get(noteId);
    if (existing) {
      const { osc, gain } = existing;
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      
      setTimeout(() => {
        try {
          osc.stop();
        } catch (e) {
          // already stopped
        }
      }, 60);
      this.oscillators.delete(noteId);
    }
  }

  playClick(freq: number, time: number) {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.05);
  }
}

export const audioEngine = new AudioEngine();
