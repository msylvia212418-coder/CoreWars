import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playClick, playHover, toggleMute, getIsMuted } from '../utils/audioSystem';

export default function Header({ level, time, score, algorithm, onOpenInstructions, onOpenCareer }) {
  const [muted, setMuted] = useState(getIsMuted);

  const handleMuteToggle = () => {
      setMuted(toggleMute());
      // Play a click if we just unmuted
      if (getIsMuted() === false) playClick();
  };
  return (
    <header className={`flex justify-between items-center game-panel p-4 active-border-${algorithm.toLowerCase()}`}>
      <div className="flex items-center gap-4">
          <motion.div 
             initial={{ scale: 0.8, opacity: 0 }} 
             animate={{ scale: 1, opacity: 1 }}
             className="w-10 h-10 rounded bg-black/50 border border-border flex justify-center items-center"
          >
              <svg className={`w-6 h-6 text-${algorithm.toLowerCase()}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
          </motion.div>
          <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-widest text-white">
                  LEVEL {level} <span className="text-gray-500 font-light ml-2">|</span> <span className={`text-glow-${algorithm.toLowerCase()}`}>{algorithm}</span>
              </h1>
              <div className="text-xs text-gray-500 font-mono uppercase">System Initialization Protocol</div>
          </div>
      </div>

      <div className="flex gap-4 items-center">
        <button 
            onClick={handleMuteToggle}
            onMouseEnter={playHover}
            className={`w-10 h-10 rounded border transition-colors flex items-center justify-center text-lg ${muted ? 'text-red-500 border-red-500/50 bg-black/50 hover:bg-red-950/30 hover:border-red-400 hover:shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 'text-blue-400 border-blue-500/50 bg-black/50 hover:bg-blue-900/30 hover:border-blue-400 hover:shadow-[0_0_12px_rgba(59,130,246,0.5)]'}`}
            title={muted ? "Unmute Audio" : "Mute Audio"}
        >
            {muted ? '🔇' : '🔊'}
        </button>

        <button 
            onClick={() => { playClick(); onOpenCareer(); }}
            onMouseEnter={playHover}
            className="w-10 h-10 rounded border border-yellow-500/50 bg-black/50 text-yellow-500 hover:text-yellow-400 hover:border-yellow-400 transition-colors flex items-center justify-center text-xl shadow-[0_0_8px_rgba(234,179,8,0.2)] hover:shadow-[0_0_12px_rgba(234,179,8,0.5)]"
            title="Career Stats"
        >
            🏆
        </button>

        <button 
            onClick={() => { playClick(); onOpenInstructions(); }}
            onMouseEnter={playHover}
            className="w-10 h-10 rounded border border-border bg-black/50 text-gray-400 hover:text-white hover:border-white transition-colors flex items-center justify-center font-mono text-xl shadow-[0_0_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_12px_rgba(255,255,255,0.5)]"
            title="Operator Manual"
        >
            ?
        </button>

        <div className="w-px h-10 bg-border"></div>

        <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-bold tracking-widest">TICK</span>
            <div className="mono text-white text-2xl drop-shadow-md">
                {time.toString().padStart(3, '0')}
            </div>
        </div>
        <div className="w-px h-10 bg-border"></div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-bold tracking-widest">SCORE</span>
            <div className="mono text-yellow-400 text-2xl" style={{ textShadow: '0 0 10px rgba(250, 204, 21, 0.5)' }}>
                {score.toString().padStart(4, '0')}
            </div>
        </div>
      </div>
    </header>
  );
}
