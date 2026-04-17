import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recommendAlgorithm } from '../ai/recommendation';
import { playClick, playHover, playTypewriter } from '../utils/audioSystem';

export default function ProcessInputScreen({ level, onStart, onBack }) {
  
  // Level constraints
  const minRows = level === 5 ? 6 : 1;
  const maxRows = 10;
  const showPriority = level >= 4;

  const [processes, setProcesses] = useState(() => {
    return Array.from({ length: minRows }).map((_, i) => ({
      id: `P${i + 1}`,
      colorIdx: i % 8,
      arrivalTime: '',
      burstTime: '',
      priority: ''
    }));
  });

  const [isRolling, setIsRolling] = useState(false);

  // Validate current form state
  const isProcessValid = (p) => {
    const arr = parseInt(p.arrivalTime, 10);
    const bur = parseInt(p.burstTime, 10);
    const pri = parseInt(p.priority, 10);

    const arrValid = !isNaN(arr) && arr >= 0;
    const burValid = !isNaN(bur) && bur >= 1 && bur <= 20;
    const priValid = showPriority ? (!isNaN(pri) && pri >= 1 && pri <= 5) : true;

    return arrValid && burValid && priValid;
  };

  const allValid = processes.every(isProcessValid);

  // Live AI Recommendation
  const aiRec = useMemo(() => {
    if (!allValid || processes.length === 0) return null;
    const parsedProcs = processes.map(p => ({
      ...p,
      arrivalTime: parseInt(p.arrivalTime, 10),
      burstTime: parseInt(p.burstTime, 10),
      priority: showPriority ? parseInt(p.priority, 10) : undefined
    }));
    return recommendAlgorithm(parsedProcs, level);
  }, [processes, allValid, level, showPriority]);

  const addProcess = () => {
    if (processes.length >= maxRows) return;
    playClick();
    setProcesses(prev => [...prev, {
      id: `P${prev.length + 1}`,
      colorIdx: prev.length % 8,
      arrivalTime: '',
      burstTime: '',
      priority: ''
    }]);
  };

  const removeProcess = () => {
    if (processes.length <= minRows) return;
    playClick();
    setProcesses(prev => prev.slice(0, -1));
  };

  const handleChange = (index, field, value) => {
    setProcesses(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
    playTypewriter();
  };

  const handleRandomFill = () => {
    if (isRolling) return;
    playHover();
    setIsRolling(true);

    const emptyIndices = processes.map((p, i) => !isProcessValid(p) || p.arrivalTime === '' || p.burstTime === '' || (showPriority && p.priority === '') ? i : -1).filter(i => i !== -1);
    
    if (emptyIndices.length === 0) {
      setIsRolling(false);
      return;
    }

    let ticks = 0;
    const maxTicks = 6;
    const interval = setInterval(() => {
      setProcesses(prev => {
        const copy = [...prev];
        emptyIndices.forEach(idx => {
          copy[idx] = {
            ...copy[idx],
            arrivalTime: Math.floor(Math.random() * 99).toString(),
            burstTime: Math.floor(Math.random() * 99).toString(),
            priority: showPriority ? Math.floor(Math.random() * 9).toString() : ''
          };
        });
        return copy;
      });
      playTypewriter();
      
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        // Final valid values
        setProcesses(prev => {
          const finalCopy = [...prev];
          // Use a baseline arrivalTime track so they aren't all 0 or purely random
          let currentArr = 0;
          finalCopy.forEach((p, idx) => {
             if (emptyIndices.includes(idx)) {
                 currentArr += Math.floor(Math.random() * 3);
                 finalCopy[idx] = {
                     ...p,
                     arrivalTime: currentArr.toString(),
                     burstTime: Math.floor(Math.random() * 8 + 2).toString(),
                     priority: showPriority ? Math.floor(Math.random() * 5 + 1).toString() : ''
                 };
             } else {
                 if (!isNaN(parseInt(p.arrivalTime, 10))) {
                     currentArr = Math.max(currentArr, parseInt(p.arrivalTime, 10));
                 }
             }
          });
          return finalCopy;
        });
        setIsRolling(false);
        playClick();
      }
    }, 50);
  };

  const handleStart = () => {
    if (!allValid || isRolling) return;
    playClick();
    
    const parsed = processes.map(p => ({
      ...p,
      arrivalTime: parseInt(p.arrivalTime, 10),
      burstTime: parseInt(p.burstTime, 10),
      priority: showPriority ? parseInt(p.priority, 10) : undefined
    }));
    onStart(parsed);
  };

  // Invalid shake class helper for inputs
  const getInputClass = (val, type) => {
      const num = parseInt(val, 10);
      let isValid = true;
      if (val !== '') {
          if (type === 'arr') isValid = !isNaN(num) && num >= 0;
          if (type === 'bur') isValid = !isNaN(num) && num >= 1 && num <= 20;
          if (type === 'pri') isValid = !isNaN(num) && num >= 1 && num <= 5;
      }
      
      const base = "w-16 bg-black/50 border border-gray-600 rounded text-center text-white font-mono focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all";
      const error = "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-[shake_0.5s_ease-in-out]";
      
      return !isValid && val !== '' ? `${base} ${error}` : base;
  };

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0, rotate: 5 }} // Implode effect
        transition={{ duration: 0.5, type: 'spring', damping: 20 }}
        className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-base"
    >
      <div className="w-full max-w-2xl bg-[#0d1117] border border-gray-700 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative">
            
            {/* Header */}
            <div className="bg-gray-800/50 p-4 border-b border-gray-700 flex items-center shadow-inner">
                <span className="text-xl mr-3">⚙️</span>
                <h2 className="text-xl font-bold tracking-widest text-white text-shadow-sm">CONFIGURE PROCESSES </h2>
                <span className="ml-2 text-gray-400 font-mono text-sm border-l border-gray-600 pl-2">Level {level}</span>
                {level === 5 && <span className="ml-4 text-xs bg-red-900/50 text-red-400 border border-red-500/50 px-2 py-1 rounded shadow-[0_0_8px_rgba(239,68,68,0.3)]">3x CPU CORES DETECTED</span>}
                <button 
                      onClick={() => { playClick(); onBack(); }}
                      className="w-8 h-8 bg-red-900/50 hover:bg-red-600 border border-red-500 text-white rounded flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(239,68,68,0.3)] ml-auto"
                      title="Abandon Configuration"
                  >
                      <span className="font-mono text-xl font-bold leading-none">X</span>
                </button>
            </div>

            {/* AI Banner Live */}
            <div className="h-12 border-b border-gray-700 bg-black/30 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    {aiRec ? (
                        <motion.div 
                            key={aiRec.algo}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="flex items-center gap-3 text-sm"
                        >
                            <span className="text-xl">🧠</span>
                            <span className="font-bold text-green-400 tracking-wider">AI_ANALYSIS:</span>
                            <span className="text-gray-300 font-mono">{aiRec.reason}</span>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="waiting"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-gray-500 font-mono text-sm tracking-widest flex items-center gap-2"
                        >
                            <span className="animate-spin text-lg">⏳</span>
                            WAITING FOR VALID INPUT DATA...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Body */}
            <div className="p-6">
                
                {/* Count Controls */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400 text-sm font-bold tracking-widest">NUMBER OF PROCESSES</span>
                    <div className="flex items-center gap-4 bg-black/40 rounded p-1 border border-gray-700 shadow-inner">
                        <button 
                            onClick={removeProcess} 
                            disabled={processes.length <= minRows}
                            className="w-8 h-8 flex items-center justify-center text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-gray-800 rounded transition-colors"
                        >
                            -
                        </button>
                        <motion.span 
                            key={processes.length}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="w-8 text-center font-mono text-xl font-bold text-white drop-shadow-[0_0_5px_#fff]"
                        >
                            {processes.length}
                        </motion.span>
                        <button 
                            onClick={addProcess} 
                            disabled={processes.length >= maxRows}
                            className="w-8 h-8 flex items-center justify-center text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-gray-800 rounded transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Grid Header */}
                <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 tracking-widest mb-2 px-2">
                    <div className="col-span-3">PROCESS</div>
                    <div className="col-span-3 text-center">ARRIVAL (≥0)</div>
                    <div className="col-span-3 text-center">BURST (1-20)</div>
                    {showPriority && <div className="col-span-3 text-center">PRIO (1-5)</div>}
                </div>

                {/* Grid Body */}
                <div className="space-y-2">
                    <AnimatePresence>
                        {processes.map((p, idx) => (
                            <motion.div 
                                key={p.id}
                                layout
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                                class={`grid grid-cols-12 gap-2 bg-gray-800/30 border border-gray-700/50 p-2 rounded items-center ${isRolling ? 'blur-[1px]' : ''} transition-all`}
                            >
                                <div className="col-span-3 flex items-center gap-3 pl-2">
                                    <div className={`w-4 h-4 rounded-full process-color-${p.colorIdx} shadow-[0_0_8px_currentColor]`} />
                                    <span className="font-mono text-white font-bold">{p.id}</span>
                                </div>
                                <div className="col-span-3 flex justify-center">
                                    <input 
                                        type="number" min="0" 
                                        value={p.arrivalTime} 
                                        onChange={(e) => handleChange(idx, 'arrivalTime', e.target.value)}
                                        className={getInputClass(p.arrivalTime, 'arr')}
                                        placeholder="-"
                                    />
                                </div>
                                <div className="col-span-3 flex justify-center">
                                    <input 
                                        type="number" min="1" max="20"
                                        value={p.burstTime} 
                                        onChange={(e) => handleChange(idx, 'burstTime', e.target.value)}
                                        className={getInputClass(p.burstTime, 'bur')}
                                        placeholder="-"
                                    />
                                </div>
                                {showPriority && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} 
                                        className="col-span-3 flex justify-center"
                                    >
                                        <input 
                                            type="number" min="1" max="5"
                                            value={p.priority} 
                                            onChange={(e) => handleChange(idx, 'priority', e.target.value)}
                                            className={getInputClass(p.priority, 'pri')}
                                            placeholder="-"
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="bg-gray-900/80 p-4 border-t border-gray-800 flex justify-between items-center">
                <button 
                    onClick={handleRandomFill}
                    className="flex items-center gap-2 px-4 py-2 border border-blue-500/50 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 hover:text-blue-300 rounded font-bold tracking-widest text-sm transition-colors"
                >
                    <motion.span 
                        animate={isRolling ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.3, repeat: isRolling ? Infinity : 0, ease: 'linear' }}
                        className="text-xl"
                    >
                        🎲
                    </motion.span>
                    RANDOM FILL
                </button>

                <button 
                    onClick={handleStart}
                    disabled={!allValid || isRolling}
                    className={`px-8 py-3 rounded font-bold tracking-widest shadow-lg flex items-center gap-2 transition-all duration-300
                        ${(!allValid || isRolling) 
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600' 
                            : 'bg-green-600 text-white hover:bg-green-500 border border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] animate-pulse'
                        }
                    `}
                >
                    ▶ START LEVEL
                </button>
            </div>

          </div>

    </motion.div>
  );
}
