import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareer } from '../hooks/useCareer';
import { playClick, playHover } from '../utils/audioSystem';
import CareerDashboard from './CareerDashboard';

export default function LevelSelectScreen({ onSelectLevel, onOpenCareer }) {
  const career = useCareer();
  const maxLevel = career.stats?.maxLevelUnlocked || 1;

  const levels = [
    { id: 1, name: 'BASIC SCHEDULING', algo: 'FCFS' },
    { id: 2, name: 'OPTIMAL YIELD', algo: 'SJF' },
    { id: 3, name: 'TIME SLICING', algo: 'RR' },
    { id: 4, name: 'MISSION CRITICAL', algo: 'PRIORITY' },
    { id: 5, name: 'MULTI-CORE MADNESS', algo: 'BOSS' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-10 flex flex-col p-8 items-center justify-center bg-base"
    >
      <div className="absolute top-8 right-8 flex gap-4 z-50">
          <button 
              onClick={() => { playClick(); onOpenCareer(); }}
              onMouseEnter={playHover}
              className="px-6 py-2 rounded border border-yellow-500/50 bg-black/50 text-yellow-500 hover:text-yellow-400 hover:border-yellow-400 transition-colors flex items-center justify-center font-bold tracking-widest shadow-[0_0_8px_rgba(234,179,8,0.2)] hover:shadow-[0_0_12px_rgba(234,179,8,0.5)]"
          >
              🏆 CAREER
          </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black tracking-widest text-shadow-sm mb-4">SYSTEM ACCESS</h1>
        <p className="text-gray-400 font-mono tracking-widest">SELECT SCHEDULING MODULE</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl w-full px-4 relative z-20">
        {levels.map((lvl, idx) => {
          const isUnlocked = lvl.id <= maxLevel;
          const isBoss = lvl.id === 5;
          return (
            <motion.button
              key={lvl.id}
              onClick={() => {
                if (isUnlocked) {
                  playClick();
                  onSelectLevel(lvl.id);
                }
              }}
              onMouseEnter={() => {
                if (isUnlocked) playHover();
              }}
              className={`relative flex flex-col items-center justify-center p-6 h-64 rounded-xl border-2 transition-all 
                ${isUnlocked 
                  ? (isBoss ? 'bg-red-950/40 border-red-500 hover:bg-red-900/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] cursor-pointer' 
                            : 'bg-black/60 border-blue-500/50 hover:border-blue-400 hover:bg-blue-900/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] cursor-pointer') 
                  : 'bg-gray-900/50 border-gray-800 text-gray-700 cursor-not-allowed opacity-50'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="text-4xl mb-4 font-black tracking-widest font-mono">
                {lvl.id === 5 ? '💀' : `0${lvl.id}`}
              </div>
              <h3 className={`font-bold tracking-widest text-center mb-2 ${!isUnlocked ? 'text-gray-600' : isBoss ? 'text-red-400' : 'text-white'}`}>
                {lvl.name}
              </h3>
              
              {isUnlocked ? (
                  <div className={`mt-auto text-xs font-mono px-3 py-1 rounded border ${isBoss ? 'text-red-300 border-red-500/50 bg-red-900/30' : 'text-blue-300 border-blue-500/50 bg-blue-900/30'}`}>
                    {lvl.algo}
                  </div>
              ) : (
                  <div className="mt-auto text-2xl">🔒</div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
