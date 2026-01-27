class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private activeNotes: Map<string, Set<{ 
    oscillators: OscillatorNode[]; 
    gain: GainNode;
  }>> = new Map();

  private getContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      
      this.compressor = this.audioCtx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-24, this.audioCtx.currentTime);
      this.compressor.knee.setValueAtTime(40, this.audioCtx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.audioCtx.currentTime);
      this.compressor.attack.setValueAtTime(0, this.audioCtx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.audioCtx.currentTime);

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.audioCtx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.audioCtx.destination);
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
    
    const osc = ctx.createOscillator();
    const harmonicOsc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    harmonicOsc.type = 'sine';
    harmonicOsc.frequency.setValueAtTime(freq * 2, startTime);

    // ADSR Envelope
    const attack = 0.02;
    const decay = 0.1;
    const sustain = 0.4;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.7, startTime + attack);
    gain.gain.exponentialRampToValueAtTime(sustain, startTime + attack + decay);

    osc.connect(gain);
    harmonicOsc.connect(gain);
    
    // Create a local harmonic gain if we wanted more control, 
    // but for now we'll just mix them and adjust volume via master or local gain.
    // To satisfy the "20% volume" requirement for harmonics specifically:
    const harmonicGain = ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.2, startTime);
    harmonicOsc.disconnect();
    harmonicOsc.connect(harmonicGain);
    harmonicGain.connect(gain);

    gain.connect(this.compressor!);

    osc.start(startTime);
    harmonicOsc.start(startTime);

    const noteInstance = { oscillators: [osc, harmonicOsc], gain };
    if (!this.activeNotes.has(noteId)) {
      this.activeNotes.set(noteId, new Set());
    }
    this.activeNotes.get(noteId)!.add(noteInstance);
  }

  stopNote(noteId: string, time?: number) {
    const instances = this.activeNotes.get(noteId);
    if (instances) {
      const ctx = this.getContext();
      const stopTime = time || ctx.currentTime;
      const release = 0.15;

      instances.forEach(instance => {
        const { oscillators, gain } = instance;
        gain.gain.cancelScheduledValues(stopTime);
        gain.gain.setValueAtTime(gain.gain.value, stopTime);
        gain.gain.exponentialRampToValueAtTime(0.001, stopTime + release);
        
        oscillators.forEach(osc => osc.stop(stopTime + release + 0.01));
      });
      
      this.activeNotes.delete(noteId);
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
    gain.connect(this.masterGain!);

    osc.start(time);
    osc.stop(time + 0.05);
  }
}

export const audioEngine = new AudioEngine();
