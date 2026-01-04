# PianoPal 🎹

A high-performance, responsive 25-key virtual piano learning application built with React, TypeScript, and Tailwind CSS. PianoPal uses the Web Audio API to synthesize professional-grade piano tones in real-time without any external audio files or dependencies.

## Features

- **25-Key Keyboard**: Full C3 to C5 range with responsive touch and click interactions.
- **Web Audio Engine**: Pure synthesized sound using oscillators and envelope shaping.
- **Interactive Lessons**: Learn "Twinkle Twinkle Little Star" with real-time feedback.
- **Built-in Metronome**: Adjustable BPM (60–120) with synthesized click.
- **Record & Playback**: Capture your performances with microsecond precision.
- **Practice Mode**: Toggle note names for beginners.
- **Dark Mode**: Beautiful, persistent theme selection.
- **Mobile First**: Optimized for touch devices and small screens.

## Tech Stack

- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Audio**: Web Audio API (No .wav/.mp3 files)
- **Deployment**: Static build (Vercel optimized)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pianopal.git
   cd pianopal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Vercel Deployment Guide

PianoPal is designed to be deployed as a static site on Vercel for free.

1. **Push your code** to a GitHub repository.
2. **Import to Vercel**:
   - Log in to [vercel.com](https://vercel.com).
   - Click "Add New" -> "Project".
   - Select your PianoPal repository.
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Use default settings** for everything else.
4. **Deploy**: Click "Deploy". Your app will be live in seconds!

## License

This project is licensed under the MIT License - see the LICENSE file for details.