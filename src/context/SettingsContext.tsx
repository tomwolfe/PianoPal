import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  bpm: number;
  setBpm: (bpm: number) => void;
  practiceMode: boolean;
  setPracticeMode: (mode: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bpm, setBpm] = useState(() => Number(localStorage.getItem('bpm')) || 120);
  const [practiceMode, setPracticeMode] = useState(true);

  useEffect(() => {
    localStorage.setItem('bpm', bpm.toString());
  }, [bpm]);

  return (
    <SettingsContext.Provider value={{ bpm, setBpm, practiceMode, setPracticeMode }}>
      {children}
    </SettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
