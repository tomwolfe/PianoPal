import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { PlaybackProvider } from './context/PlaybackContext';
import { LessonProvider } from './context/LessonContext';
import { Analytics } from '@vercel/analytics/react';
import { Navbar } from './components/Navbar';
import { Piano } from './components/Piano';
import { Metronome } from './components/Metronome';
import { Recorder } from './components/Recorder';
import { LessonMode } from './components/LessonMode';

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <PlaybackProvider>
          <LessonProvider>
            <div className="min-h-screen flex flex-col w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
              <Navbar />
              
              <main className="flex-1 flex flex-col items-center py-8 px-4 gap-8">
                <div className="w-full max-w-6xl flex flex-wrap justify-center gap-6">
                  <Metronome />
                  <Recorder />
                </div>

                <div className="w-full max-w-6xl flex justify-center">
                  <LessonMode />
                </div>

                <div className="w-full flex-1 flex flex-col justify-center items-center bg-white dark:bg-slate-900/50 rounded-3xl shadow-inner p-4 md:p-12 overflow-x-auto min-h-[400px]">
                  <Piano />
                </div>

                <div className="text-center text-slate-400 text-xs py-4">
                  <p>PianoPal &copy; 2026 • Built with Web Audio API • MIT License</p>
                </div>
              </main>
              <Analytics />
            </div>
          </LessonProvider>
        </PlaybackProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;