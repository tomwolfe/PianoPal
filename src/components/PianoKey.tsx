import React, { useState } from 'react';
import type { PianoKeyInfo } from '../types/piano';
import { audioEngine } from '../utils/audioEngine';

interface PianoKeyProps {
  keyInfo: PianoKeyInfo;
  isActive: boolean;
  onPress: (note: string) => void;
  showNoteName: boolean;
}

export const PianoKey: React.FC<PianoKeyProps> = ({ keyInfo, isActive, onPress, showNoteName }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    audioEngine.playNote(keyInfo.freq, keyInfo.note);
    onPress(keyInfo.note);
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    setTimeout(() => setIsPressed(false), 200);
  };

  const activeClass = keyInfo.isBlack
    ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]'
    : 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]';

  const baseClass = keyInfo.isBlack
    ? `relative h-32 w-8 -mx-4 z-10 rounded-b-md transition-all duration-75 ${isPressed || isActive ? activeClass : 'bg-slate-800'}`
    : `relative h-48 w-12 border border-slate-300 dark:border-slate-700 z-0 rounded-b-md transition-all duration-75 ${isPressed || isActive ? activeClass : 'bg-white dark:bg-slate-200'}`;

  return (
    <div
      className={`${baseClass} cursor-pointer select-none flex flex-col justify-end items-center pb-2`}
      onMouseDown={handlePress}
      onTouchStart={(e) => {
        e.preventDefault();
        handlePress();
      }}
    >
      {showNoteName && !keyInfo.isBlack && (
        <span className="text-xs font-bold text-slate-500 mb-1">{keyInfo.note}</span>
      )}
      <span className="text-[10px] text-slate-400 opacity-50 uppercase">{keyInfo.keyboardKey}</span>
    </div>
  );
};