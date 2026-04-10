import React from 'react';
import { motion } from 'framer-motion';
import { playClick, playHover } from '../utils/audioSystem';

export default function InstructionsScreen({ onClose }) {
  return (
    <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="absolute inset-0 z-10 flex items-center justify-center bg-base p-4 md:p-12"
    >
        <div 
            className="game-panel w-full max-w-5xl h-full p-8 flex flex-col relative overflow-hidden"
        >
            {/* Background flourish */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

            <div className="flex justify-between items-center mb-6 relative z-10 border-b border-border pb-4">
                <h2 className="text-3xl font-black tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    OPERATOR MANUAL
                </h2>
                <button 
                    onClick={() => { playClick(); onClose(); }}
                    onMouseEnter={playHover}
                    className="w-10 h-10 bg-red-900/50 hover:bg-red-600 border border-red-500 text-white rounded flex flex-col items-center justify-center transition-colors shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                >
                    <span className="font-mono text-xl font-bold">X</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 space-y-8 relative z-10 mono text-sm text-gray-300 custom-scrollbar">
                
                <section>
                    <h3 className="text-blue-400 text-lg font-bold mb-2 border-l-4 border-blue-500 pl-2">1. MISSION OBJECTIVE</h3>
                    <p className="leading-relaxed">
                        You are the CPU MANAGER. Incoming processes pile up in the <span className="text-white font-bold">READY QUEUE</span>. 
                        Your job is to select the most efficient Algorithm to clear all tasks while minimizing <span className="text-yellow-400 font-bold">Waiting Time</span> and maximizing <span className="text-green-400 font-bold">CPU Utilization</span>.
                    </p>
                </section>

                <section>
                    <h3 className="text-purple-400 text-lg font-bold mb-2 border-l-4 border-purple-500 pl-2">2. THE ALGORITHMS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="bg-white/5 p-3 rounded border border-border hover:border-blue-500 transition-colors">
                            <span className="text-blue-400 font-bold block mb-1">FCFS (First Come, First Served)</span>
                            Simple, unoptimized line queuing. Processes execute in the exact order they arrive.
                        </div>
                        <div className="bg-white/5 p-3 rounded border border-border hover:border-green-500 transition-colors">
                            <span className="text-green-400 font-bold block mb-1">SJF (Shortest Job First)</span>
                            Optimizes Waiting Time. Selects the process with the smallest Burst Time (BT) available.
                        </div>
                        <div className="bg-white/5 p-3 rounded border border-border hover:border-purple-500 transition-colors">
                            <span className="text-purple-400 font-bold block mb-1">RR (Round Robin)</span>
                            Prioritizes fairness. Cycles through the queue, giving each process a fixed slice of execution time (TIME QUANTUM).
                        </div>
                        <div className="bg-white/5 p-3 rounded border border-border hover:border-orange-500 transition-colors">
                            <span className="text-orange-400 font-bold block mb-1">PRIORITY</span>
                            Executes highest priority processes first (Lower number = Higher Priority). Perfect for critical OS interruptions.
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-green-400 text-lg font-bold mb-2 border-l-4 border-green-500 pl-2">3. SYSTEM OVERRIDES & AI</h3>
                    <p className="leading-relaxed">
                        As you survive consecutive levels, deeper algorithms unlock. The built-in neural net <span className="text-white font-bold">AI_ANALYSIS</span> will suggest the mathematical optimum choice before a simulation starts based on burst variance anomalies. 
                        You may Accept or Override to test your own hypotheses. Overriding the AI successfully triggers hidden score bonuses!
                    </p>
                </section>

                <section>
                    <h3 className="text-red-400 text-lg font-bold mb-2 border-l-4 border-red-500 pl-2">4. LEVEL 5: MULTI-CORE MADNESS</h3>
                    <p className="leading-relaxed">
                        If you clear Level 4, Symmetric Multiprocessing unlocks. You must route massive loads into <span className="text-white font-bold">3 independent CPU logical cores</span> simultaneously. The visual flow-lanes will show load balancing in real-time.
                    </p>
                </section>

            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-end relative z-10">
                 <motion.button 
                    onClick={() => { playClick(); onClose(); }}
                    onMouseEnter={playHover}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-[0_0_15px_#3b82f6] tracking-widest"
                >
                    ACKNOWLEDGE
                </motion.button>
            </div>
        </div>
    </motion.div>
  );
}
