class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private oscillators: Map<string, { osc: OscillatorNode; gain: GainNode }> = new Map();

  private getContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
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
    
    // Clean up any existing oscillator for this note
    this.stopNote(noteId, startTime);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    // ADSR Envelope
    const attack = 0.02;
    const decay = 0.1;
    const sustain = 0.4;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.7, startTime + attack);
    gain.gain.exponentialRampToValueAtTime(sustain, startTime + attack + decay);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);

    this.oscillators.set(noteId, { osc, gain });
  }

  stopNote(noteId: string, time?: number) {
    const existing = this.oscillators.get(noteId);
    if (existing) {
      const { osc, gain } = existing;
      const ctx = this.getContext();
      const stopTime = time || ctx.currentTime;
      const release = 0.15;

      gain.gain.cancelScheduledValues(stopTime);
      gain.gain.setValueAtTime(gain.gain.value, stopTime);
      gain.gain.exponentialRampToValueAtTime(0.001, stopTime + release);
      
      osc.stop(stopTime + release + 0.01);
      
      this.oscillators.delete(noteId);
    }
  }

  playClick(freq: number, time: number) {
    const ctx = this.getContext();
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
