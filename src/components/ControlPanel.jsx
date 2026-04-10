import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClick, playHover } from '../utils/audioSystem';

export default function ControlPanel({ status, speed, onStart, onPause, onReset, onToggleSpeed, algorithm, setAlgorithm, lockedAlgos, quantum, setQuantum }) {
  const isRunning = status === 'running';

  const algos = ['FCFS', 'SJF', 'RR', 'PRIORITY'];

  return (
    <div className="h-48 flex gap-4 w-full">
      {/* Algorithms */}
      <div className="game-panel flex-1 p-4 flex flex-col justify-center gap-2">
          <div className="flex justify-between items-end mb-2">
              <h3 className="text-sm font-bold tracking-widest text-gray-400">ALGORITHM SYSTEM</h3>
          </div>
          
          <div className="flex gap-3">
              {algos.map(algo => {
                  const isLocked = lockedAlgos.includes(algo);
                  const isSelected = algorithm === algo;
                  
                  return (
                      <motion.button 
                          key={algo}
                          disabled={isLocked}
                          onClick={() => { playClick(); setAlgorithm(algo); }}
                          onHoverStart={!isLocked ? playHover : undefined}
                          whileHover={!isLocked ? { scale: 1.05 } : { x: [-2, 2, -2, 2, 0] }}
                          whileTap={!isLocked ? { scale: 0.95 } : {}}
                          className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-300 relative overflow-hidden
                              ${isLocked ? 'border-border bg-black/40 text-gray-600 grayscale cursor-not-allowed' : 
                                isSelected ? `border-[var(--color-${algo.toLowerCase()})] bg-[var(--color-${algo.toLowerCase()})] text-white shadow-[0_0_15px_var(--color-${algo.toLowerCase()})]` : 
                                `border-gray-700 bg-white/5 text-gray-400 hover:border-[var(--color-${algo.toLowerCase()})] hover:text-white`}
                          `}
                      >
                          <span className="font-bold tracking-wider">{algo}</span>
                          {isLocked && <span className="absolute text-xs inset-0 flex items-center justify-center bg-black/60">🔒</span>}
                      </motion.button>
                  );
              })}
          </div>

          <AnimatePresence>
              {algorithm === 'RR' && (
                  <motion.div 
                      initial={{ opacity: 0, height: 0, y: 10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: 10 }}
                      className="mt-4 flex items-center gap-4 bg-black/30 p-2 rounded-lg border border-purple-500/30"
                  >
                      <span className="text-xs font-mono text-purple-400">TIME QUANTUM:</span>
                      <input 
                          type="range" 
                          min="1" max="5" 
                          value={quantum}
                          onChange={(e) => setQuantum(Number(e.target.value))}
                          className="flex-1 accent-purple-500"
                      />
                      <span className="font-mono font-bold text-xl text-purple-300">{quantum}</span>
                  </motion.div>
              )}
          </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="game-panel w-1/3 p-4 flex flex-col justify-center items-center gap-4">
          <div className="flex w-full gap-2 h-16">
              {status === 'finished' ? (
                   <motion.button 
                      onClick={() => { playClick(); onReset(); }}
                      onHoverStart={playHover}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-[0_0_15px_#3b82f6] transition-all flex items-center justify-center gap-2"
                   >
                     <span>🔁 RESET</span>
                   </motion.button>
              ) : (
                  <>
                      {isRunning ? (
                          <motion.button 
                              onClick={() => { playClick(); onPause(); }}
                              onHoverStart={playHover}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded shadow-[0_0_15px_#d97706] transition-all flex items-center justify-center gap-2"
                          >
                          <span>⏸ PAUSE</span>
                          </motion.button>
                      ) : (
                          <motion.button 
                              onClick={() => { playClick(); onStart(); }}
                              onHoverStart={playHover}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-[0_0_15px_#22c55e] transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                          >
                              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[slide_1s_ease-in-out_infinite]" />
                              <span>▶ RUN</span>
                          </motion.button>
                      )}
                      
                      <motion.button 
                          onClick={() => { playClick(); onReset(); }}
                          onHoverStart={playHover}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-16 bg-red-600/80 hover:bg-red-500 text-white rounded transition-all flex items-center justify-center text-xl"
                          title="Reset"
                      >
                          ⏹
                      </motion.button>
                  </>
             )}
          </div>

          <div className="flex items-center justify-between w-full px-2 border-t border-border pt-4 mt-2">
              <span className="text-xs text-gray-500 font-mono">SIMULATION SPEED</span>
              <button 
                onClick={() => { playClick(); onToggleSpeed(); }} 
                onMouseEnter={playHover}
                className="flex gap-1"
              >
                  <div className={`w-3 h-3 rounded-full ${speed >= 1 ? 'bg-white shadow-[0_0_5px_#fff]' : 'bg-gray-700'}`} />
                  <div className={`w-3 h-3 rounded-full ${speed >= 2 ? 'bg-white shadow-[0_0_5px_#fff]' : 'bg-gray-700'}`} />
                  <div className={`w-3 h-3 rounded-full ${speed >= 3 ? 'bg-white shadow-[0_0_5px_#fff]' : 'bg-gray-700'}`} />
              </button>
          </div>
      </div>
    </div>
  );
}
