import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateFCFS } from '../algorithms/fcfs';
import { calculateSJF } from '../algorithms/sjf';
import { calculateRoundRobin } from '../algorithms/roundRobin';
import { calculatePriority } from '../algorithms/priority';
import { useCountUp } from '../hooks/useCountUp';
import { calculateBurstVariance } from '../ai/recommendation';
import confetti from 'canvas-confetti';
import { playClick } from '../utils/audioSystem';

export default function ComparisonScreen({ level, processes, userAlgorithm, quantum, onReplay, onNextLevel }) {
  const numCpus = level >= 5 ? 3 : 1;
  const isMultiCore = level === 5;
  
  // Calculate results for all 4 algorithms instantly
  const results = useMemo(() => {
    return {
      FCFS: calculateFCFS(processes, numCpus),
      SJF: calculateSJF(processes, numCpus),
      RR: calculateRoundRobin(processes, quantum, numCpus),
      PRIORITY: calculatePriority(processes, numCpus)
    };
  }, [processes, numCpus, quantum]);

  // Determine Winners in each category
  const winners = useMemo(() => {
    const algos = ['FCFS', 'SJF', 'RR', 'PRIORITY'];
    
    // Average Waiting Time (lower is better)
    const waitTimes = algos.map(a => results[a].avgWaitingTime);
    const minWait = Math.min(...waitTimes);
    const waitWinners = algos.filter(a => results[a].avgWaitingTime === minWait);
    
    // CPU Utilization (higher is better)
    const utils = algos.map(a => results[a].cpuUtilization);
    const maxUtil = Math.max(...utils);
    const utilWinners = algos.filter(a => results[a].cpuUtilization === maxUtil);
    
    // Turnaround Time (lower is better)
    const tatTimes = algos.map(a => results[a].avgTurnaroundTime);
    const minTat = Math.min(...tatTimes);
    const tatWinners = algos.filter(a => results[a].avgTurnaroundTime === minTat);
    
    // Makespan (for Boss Level)
    const makespans = algos.map(a => Math.max(...results[a].schedule.map(s => s.endTime)));
    const minMakespan = Math.min(...makespans);
    const makespanWinners = algos.filter((a, i) => makespans[i] === minMakespan);
    
    return { waitWinners, utilWinners, tatWinners, makespanWinners, minWait, maxUtil, minTat, minMakespan, makespans };
  }, [results]);

  // Determine overall best (simplified: whoever won the most categories, or primarily wait time)
  const bestAlgo = winners.waitWinners[0]; // Naive best
  const userChoseBest = winners.waitWinners.includes(userAlgorithm);

  // States for animation sequencing reveal
  const [showAI, setShowAI] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAI(true);
      if (userChoseBest && userAlgorithm) {
         confetti({ particleCount: 150, spread: 80, origin: { y: 0.3 } });
      }
    }, 2500); // Wait for gantt charts and bars
    return () => clearTimeout(timer);
  }, [userChoseBest, userAlgorithm]);

  const algosConf = [
      { id: 'FCFS', name: 'FCFS', color: 'blue', colorHex: '#3b82f6', icon: '🔵', entrance: { x: -100, y: -100 } },
      { id: 'SJF', name: 'SJF', color: 'green', colorHex: '#10b981', icon: '🟢', entrance: { x: 100, y: -100 } },
      { id: 'RR', name: 'RR', color: 'purple', colorHex: '#8b5cf6', icon: '🟣', entrance: { x: -100, y: 100 } },
      { id: 'PRIORITY', name: 'PRIORITY', color: 'orange', colorHex: '#f97316', icon: '🟠', entrance: { x: 100, y: 100 } }
  ];

  const getMetricClass = (isWinner) => isWinner ? "text-yellow-400 font-bold" : "text-gray-300";

  const isAlgoUnlocked = (algoId) => {
       return level === 1 ? algoId === 'FCFS' : 
              level === 2 ? ['FCFS', 'SJF'].includes(algoId) : 
              level === 3 ? ['FCFS', 'SJF', 'RR'].includes(algoId) : true;
  };

  // Helper to reorder algorithms for bar visualization (User choice first)
  const getOrderedAlgos = (algos) => {
      const userAlgo = algos.find(a => a.id === userAlgorithm);
      const others = algos.filter(a => a.id !== userAlgorithm);
      return userAlgo ? [userAlgo, ...others] : algos;
  };

  return (
    <motion.div 
        className="absolute inset-0 z-10 flex flex-col p-4 md:p-8 bg-base overflow-y-auto overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 relative">
            
            <div className="text-center mb-4">
                <h1 className="text-3xl md:text-5xl font-black tracking-widest text-shadow-sm mb-2">ALGORITHM COMPARISON</h1>
                <p className="text-gray-400 font-mono">"Same {processes.length} processes. 4 different strategies." • Level {level} Results</p>
            </div>

            {/* Matrix Board */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {algosConf.map((algo) => {
                   const isUnlocked = isAlgoUnlocked(algo.id);
                   
                   const isUserChoice = userAlgorithm === algo.id;
                   const res = results[algo.id];

                   return (
                     <motion.div 
                        key={algo.id}
                        initial={{ opacity: 0, x: algo.entrance.x, y: algo.entrance.y }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                        className={`relative p-4 rounded-xl border-2 flex flex-col items-center bg-gray-900/50 
                            ${isUserChoice ? `border-${algo.color}-500 shadow-[0_0_20px_${algo.colorHex}40]` : 'border-gray-800'}`}
                     >
                        {isUserChoice && (
                            <motion.div 
                                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                                className={`absolute -top-4 bg-${algo.color}-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-[0_0_10px_${algo.colorHex}] z-10 whitespace-nowrap`}
                            >
                                YOUR CHOICE 🎮
                            </motion.div>
                        )}
                        
                        <div className="text-2xl mb-1">{algo.icon}</div>
                        <h3 className={`font-black tracking-widest text-${algo.color}-400 mb-4`}>{algo.name}</h3>

                        {!isUnlocked ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 opacity-50 py-8">
                                <span className="text-3xl mb-2">🔒</span>
                                <span className="text-xs font-mono text-center px-4">UNLOCKS AT HIGHER LEVEL</span>
                            </div>
                        ) : (
                            <div className="w-full flex-1 flex flex-col gap-3 text-sm font-mono text-center">
                                {/* Makespan override for Boss Level */}
                                {isMultiCore && (
                                    <div className="bg-black/40 rounded p-2 relative">
                                        <div className="text-gray-500 text-[10px] mb-1">MAKESPAN</div>
                                        <div className={`text-lg ${getMetricClass(winners.makespanWinners.includes(algo.id))}`}>
                                            <AnimatedNumber value={winners.makespans[algosConf.findIndex(a=>a.id===algo.id)]} />
                                        </div>
                                        {winners.makespanWinners.includes(algo.id) && <Crown />}
                                    </div>
                                )}
                                
                                <div className="bg-black/40 rounded p-2 relative">
                                    <div className="text-gray-500 text-[10px] mb-1">AVG WAIT</div>
                                    <div className={`text-lg ${getMetricClass(winners.waitWinners.includes(algo.id))}`}>
                                        <AnimatedNumber value={res.avgWaitingTime} decimals={1} />
                                    </div>
                                    {winners.waitWinners.includes(algo.id) && <Crown />}
                                </div>
                                <div className="bg-black/40 rounded p-2 relative">
                                    <div className="text-gray-500 text-[10px] mb-1">CPU UTIL</div>
                                    <div className={`text-lg ${getMetricClass(winners.utilWinners.includes(algo.id))}`}>
                                        <AnimatedNumber value={res.cpuUtilization} />%
                                    </div>
                                    {winners.utilWinners.includes(algo.id) && <Crown />}
                                </div>
                                <div className="bg-black/40 rounded p-2 relative">
                                    <div className="text-gray-500 text-[10px] mb-1">AVG TAT</div>
                                    <div className={`text-lg ${getMetricClass(winners.tatWinners.includes(algo.id))}`}>
                                        <AnimatedNumber value={res.avgTurnaroundTime} decimals={1} />
                                    </div>
                                    {winners.tatWinners.includes(algo.id) && <Crown />}
                                </div>
                            </div>
                        )}
                     </motion.div>
                   );
               })}
            </div>

            {/* Bar Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Avg Waiting Time Bar Chart */}
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    <h4 className="text-gray-400 font-mono text-sm tracking-widest border-b border-gray-700 pb-2 mb-4">📉 AVG WAITING TIME (LOWER = BETTER)</h4>
                    <div className="flex flex-col gap-3">
                        {getOrderedAlgos(algosConf).map((algo, i) => {
                            if (!isAlgoUnlocked(algo.id)) return null;
                            const res = results[algo.id];
                            const isUserChoice = userAlgorithm === algo.id;
                            const isWinner = winners.waitWinners.includes(algo.id);
                            // Normalize width: max Wait = 100% width
                            const maxW = Math.max(...algosConf.filter(a=>isAlgoUnlocked(a.id)).map(a=>results[a.id].avgWaitingTime));
                            const percentW = maxW === 0 ? 0 : (res.avgWaitingTime / maxW) * 100;
                            
                            return (
                                <div key={`wait-${algo.id}`} className="flex items-center gap-3">
                                    <div className={`w-20 text-xs font-bold font-mono tracking-widest ${isUserChoice ? `text-${algo.color}-400` : 'text-gray-500'}`}>
                                        {algo.name} {isUserChoice && <span className="text-[10px] bg-white/10 px-1 rounded ml-1">YOU</span>}
                                    </div>
                                    <div className="flex-1 h-6 bg-gray-900 rounded overflow-hidden relative">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentW}%` }}
                                            transition={{ delay: 1.5 + (i * 0.2), type: 'spring', stiffness: 60, damping: 12 }}
                                            className={`h-full bg-gradient-to-r from-${algo.color}-900 to-${algo.color}-500 relative`}
                                        >
                                            {isWinner && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                                        </motion.div>
                                    </div>
                                    <div className="w-12 text-right font-mono text-sm">
                                        {res.avgWaitingTime.toFixed(1)}
                                    </div>
                                    <div className="w-6">{isWinner && <Crown />}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CPU Utilization Bar Chart */}
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    <h4 className="text-gray-400 font-mono text-sm tracking-widest border-b border-gray-700 pb-2 mb-4">📈 CPU UTILIZATION (HIGHER = BETTER)</h4>
                    <div className="flex flex-col gap-3">
                         {getOrderedAlgos(algosConf).map((algo, i) => {
                            if (!isAlgoUnlocked(algo.id)) return null;
                            const res = results[algo.id];
                            const isUserChoice = userAlgorithm === algo.id;
                            const isWinner = winners.utilWinners.includes(algo.id);
                            
                            return (
                                <div key={`util-${algo.id}`} className="flex items-center gap-3">
                                    <div className={`w-20 text-xs font-bold font-mono tracking-widest ${isUserChoice ? `text-${algo.color}-400` : 'text-gray-500'}`}>
                                        {algo.name} {isUserChoice && <span className="text-[10px] bg-white/10 px-1 rounded ml-1">YOU</span>}
                                    </div>
                                    <div className="flex-1 h-6 bg-gray-900 rounded overflow-hidden relative">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${res.cpuUtilization}%` }}
                                            transition={{ delay: 1.5 + (i * 0.2), type: 'spring', stiffness: 60, damping: 12 }}
                                            className={`h-full bg-gradient-to-r from-${algo.color}-900 to-${algo.color}-500 relative`}
                                        >
                                            {isWinner && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                                        </motion.div>
                                    </div>
                                    <div className="w-12 text-right font-mono text-sm">
                                        {Math.round(res.cpuUtilization)}%
                                    </div>
                                    <div className="w-6">{isWinner && <Crown />}</div>
                                </div>
                            );
                         })}
                    </div>
                </div>
            </div>

            {/* Mini Gantt Charts Section */}
            <div className="bg-black/60 p-4 rounded-xl border border-gray-800 relative z-0">
                <h4 className="text-gray-400 font-mono text-sm tracking-widest pb-4">🎬 MINI GANTT COMPARISON</h4>
                <div className="flex flex-col gap-[2px]">
                    {algosConf.map((algo) => {
                        if (!isAlgoUnlocked(algo.id)) return null;
                        const schedule = results[algo.id].schedule;
                        // Find max endTime across entire simulation to normalize percentages
                        const globalMaxTime = Math.max(...algosConf.filter(a=>isAlgoUnlocked(a.id)).map(a => Math.max(...results[a.id].schedule.map(s=>s.endTime))));
                        
                        return (
                            <div key={`gantt-${algo.id}`} className="flex items-center bg-gray-900/30 group">
                                <div className={`w-24 text-xs font-mono font-bold px-2 py-3 ${userAlgorithm === algo.id ? `text-${algo.color}-400` : 'text-gray-500'}`}>
                                    {algo.name}
                                </div>
                                <div className="flex-1 min-h-[30px] relative flex border-l border-gray-800">
                                    {schedule.map((block, i) => {
                                        const leftPercent = (block.startTime / globalMaxTime) * 100;
                                        const widthPercent = ((block.endTime - block.startTime) / globalMaxTime) * 100;
                                        const processColor = `hsl(${(block.processId * 137.5) % 360}, 70%, 50%)`;
                                        
                                        return (
                                            <motion.div
                                                key={`g-${algo.id}-${i}`}
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ duration: 0.3, delay: 2.0 + (i * 0.08), ease: "easeOut" }}
                                                style={{ left: `${leftPercent}%`, width: `${widthPercent}%`, transformOrigin: 'left', backgroundColor: processColor }}
                                                className="absolute top-[2px] bottom-[2px] opacity-80 group-hover:opacity-100 border-r border-black"
                                                title={`P${block.processId} | Start: ${block.startTime} | End: ${block.endTime}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* AI Verdict */}
            <AnimatePresence>
                {showAI && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-gray-900 border-l-4 p-6 rounded-r shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex gap-4 ${userChoseBest ? 'border-yellow-500' : 'border-red-500'}`}
                    >
                        <div className="text-4xl animate-pulse self-center drop-shadow-[0_0_10px_rgba(255,100,200,0.5)]">🧠</div>
                        <div>
                            <h3 className="font-bold tracking-widest text-white mb-2">AI VERDICT</h3>
                            <div className="font-mono text-sm text-gray-300 leading-relaxed min-h-[40px]">
                                {userChoseBest ? (
                                    <span className="text-yellow-400 font-bold mr-1">Perfect choice! 🎯</span>
                                ) : (
                                    <span className="text-red-400 font-bold mr-1">Room to improve 📉</span>
                                )}
                                <WordTyper 
                                    text={`You selected ${userAlgorithm}. The mathematically optimal algorithm was ${bestAlgo}. With a burst variance of ${calculateBurstVariance(processes).toFixed(1)}, ${bestAlgo} reduced inefficiencies globally.`}
                                    speedMs={80} 
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Actions */}
            <div className="flex gap-4 mt-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { playClick(); onReplay(); }}
                    className="flex-1 py-4 bg-orange-900/50 hover:bg-orange-600 border border-orange-500 text-orange-400 hover:text-white font-bold rounded tracking-widest transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                    <span>🔁</span> REPLAY LEVEL
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { playClick(); onNextLevel(); }}
                    className="flex-[2] py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-[0_0_20px_#10b981] tracking-widest flex items-center justify-center gap-2"
                >
                    NEXT LEVEL <span>▶</span>
                </motion.button>
            </div>

        </div>
    </motion.div>
  );
}

// Subcomponents
function AnimatedNumber({ value, decimals = 0 }) {
   const animated = useCountUp(value, 1.2, 0.2);
   return <>{animated.toFixed(decimals)}</>;
}

function Crown() {
    return (
        <motion.div 
            initial={{ y: -30, opacity: 0, rotate: -20, scale: 2 }}
            animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 10, delay: 1.2 }}
            className="absolute -top-3 -right-3 text-2xl filter drop-shadow-[0_0_5px_rgba(250,204,21,0.8)] z-20"
        >
            👑
        </motion.div>
    );
}

function WordTyper({ text, speedMs }) {
   const words = text.split(' ');
   const [visibleCount, setVisibleCount] = useState(0);

   useEffect(() => {
       if (visibleCount < words.length) {
           const t = setTimeout(() => setVisibleCount(c => c + 1), speedMs);
           return () => clearTimeout(t);
       }
   }, [visibleCount, words.length, speedMs]);

   return (
       <span>
           {words.slice(0, visibleCount).join(' ')}
       </span>
   );
}
