import React from 'react';
import type { PianoKeyInfo } from '../types/piano';

interface PianoKeyProps {
  keyInfo: PianoKeyInfo;
  isActive: boolean;
  onPress: (note: string) => void;
  onRelease: (note: string) => void;
  showNoteName: boolean;
}

export const PianoKey: React.FC<PianoKeyProps> = ({ 
  keyInfo, 
  isActive, 
  onPress, 
  onRelease, 
  showNoteName 
}) => {
  const handlePress = () => {
    onPress(keyInfo.note);
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  const handleRelease = () => {
    onRelease(keyInfo.note);
  };

  const activeClass = keyInfo.isBlack
    ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] border-blue-400 translate-y-[2px]'
    : 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] border-blue-300 translate-y-[2px]';

  const baseClass = keyInfo.isBlack
    ? `z-10 rounded-b-md transition-all duration-75 border-b-4 border-slate-900 ${isActive ? activeClass : 'bg-slate-800 hover:bg-slate-700'}`
    : `border-x border-b border-slate-300 dark:border-slate-700 z-0 rounded-b-md transition-all duration-75 ${isActive ? activeClass : 'bg-white dark:bg-slate-200 hover:bg-slate-50'}`;

  const style = {
    width: keyInfo.isBlack ? 'var(--black-key-width)' : 'var(--white-key-width)',
    height: keyInfo.isBlack ? 'var(--black-key-height)' : 'var(--white-key-height)',
  };

  return (
    <div
      role="button"
      aria-label={`Piano key ${keyInfo.note}`}
      aria-pressed={isActive}
      className={`${baseClass} cursor-pointer select-none flex flex-col justify-end items-center pb-4 shadow-md transition-shadow`}
      style={style}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={isActive ? handleRelease : undefined}
      onTouchStart={(e) => {
        e.preventDefault();
        handlePress();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleRelease();
      }}
    >
      {!keyInfo.isBlack && (
        <div className="flex flex-col items-center gap-1">
          {showNoteName && (
            <span className="text-xs font-bold text-slate-500">{keyInfo.note}</span>
          )}
          <span className="text-[10px] font-medium text-slate-400 uppercase bg-slate-100 dark:bg-slate-300 px-1.5 py-0.5 rounded shadow-sm">
            {keyInfo.keyboardKey}
          </span>
        </div>
      )}
      {keyInfo.isBlack && (
        <span className="text-[10px] font-medium text-slate-300 uppercase mb-[-8px]">
          {keyInfo.keyboardKey}
        </span>
      )}
    </div>
  );
};
