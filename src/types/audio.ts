export interface AudioNoteInstance {
  oscillators: OscillatorNode[];
  gain: GainNode;
}

export interface PlaybackEvent {
  note: string;
  time: number;
  type: 'start' | 'end';
}

export interface AudioEngineState {
  isInitialized: boolean;
  contextState: AudioContextState;
}
