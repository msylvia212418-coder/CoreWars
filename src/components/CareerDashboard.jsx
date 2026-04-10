import React from 'react';
import { motion } from 'framer-motion';
import { playClick, playHover } from '../utils/audioSystem';

export default function CareerDashboard({ stats, onClose, onWipe }) {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
    >
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="game-panel w-full max-w-2xl p-8 flex flex-col relative overflow-hidden ring-4 ring-yellow-500/20 shadow-[0_0_50px_rgba(234,179,8,0.1)]"
        >
            <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                <h2 className="text-3xl font-black tracking-widest text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] flex items-center gap-3">
                    <span>🏆</span> CAREER STATISTICS
                </h2>
                <button 
                    onClick={() => { playClick(); onClose(); }}
                    onMouseEnter={playHover}
                    className="w-10 h-10 bg-black/50 hover:bg-white/10 border border-border text-white rounded transition-colors"
                >
                    <span className="font-mono text-xl font-bold">X</span>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 font-bold tracking-widest mb-2">MAX LEVEL UNLOCKED</span>
                    <span className="text-5xl font-mono font-bold text-white drop-shadow-md">{stats.maxLevelUnlocked}</span>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 font-bold tracking-widest mb-2">CUMULATIVE SCORE</span>
                    <span className="text-5xl font-mono font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{stats.cumulativeScore.toLocaleString()}</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 font-bold tracking-widest mb-2">TOTAL STARS EARNED</span>
                    <span className="text-5xl font-mono font-bold text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">{stats.totalStars}</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 font-bold tracking-widest mb-2">TOTAL CPU TICKS RUN</span>
                    <span className="text-5xl font-mono font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">{stats.totalTicksTracked.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-border mt-auto">
                <motion.button 
                    onClick={() => { playClick(); onWipe(); }}
                    onMouseEnter={playHover}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-red-900/40 hover:bg-red-800 text-red-200 text-xs font-bold rounded border border-red-500/50 transition-colors tracking-widest"
                >
                    WIPE DATABASE
                </motion.button>
                
                <span className="text-gray-600 font-mono text-xs">LOCALSTORAGE_SYNC: ACTIVE</span>
            </div>
        </motion.div>
    </motion.div>
  );
}
