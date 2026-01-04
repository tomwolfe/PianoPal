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

    ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] border-blue-400'

    : 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] border-blue-300';



  const baseClass = keyInfo.isBlack

    ? `absolute h-32 w-10 z-10 rounded-b-md transition-all duration-75 border-b-4 border-slate-900 ${isPressed || isActive ? activeClass : 'bg-slate-800'}`

    : `h-56 w-16 border-x border-b border-slate-300 dark:border-slate-700 z-0 rounded-b-md transition-all duration-75 ${isPressed || isActive ? activeClass : 'bg-white dark:bg-slate-200'}`;



  // Calculate left offset for black keys

  // This is a bit simplified, usually it's better to calculate based on white key index

  return (

    <div

      className={`${baseClass} cursor-pointer select-none flex flex-col justify-end items-center pb-4 shadow-md hover:shadow-lg transition-shadow`}

      style={keyInfo.isBlack ? { left: 'var(--black-key-offset)' } : {}}

      onMouseDown={handlePress}

      onTouchStart={(e) => {

        e.preventDefault();

        handlePress();

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

        <span className="text-[10px] font-medium text-slate-400 uppercase mb-[-8px]">

          {keyInfo.keyboardKey}

        </span>

      )}

    </div>

  );

};
