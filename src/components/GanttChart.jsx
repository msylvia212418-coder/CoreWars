import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GanttChart({ schedule, currentTime, processes }) {
  // schedule is an array of { processId, startTime, endTime }
  
  const maxTime = Math.max(currentTime, Math.max(...schedule.map(s => s.endTime), 0));
  const pixelsPerTick = 20;

  return (
    <div className="w-full bg-black/40 border border-border/50 p-4 rounded-lg overflow-x-auto relative flex flex-col justify-end h-32">
        <h4 className="absolute top-2 left-4 text-xs font-bold tracking-widest text-gray-500">GANTT DIAGRAM</h4>
        
        {/* Playhead Cursor */}
        <motion.div 
            className="absolute top-0 bottom-6 w-0.5 bg-white z-20 shadow-[0_0_8px_#fff]"
            animate={{ x: currentTime * pixelsPerTick + 16 }} // 16px padding
            transition={{ ease: "linear", duration: 0.2 }}
        />

        <div className="relative h-12 flex mb-2" style={{ width: Math.max(maxTime, 50) * pixelsPerTick }}>
            <AnimatePresence>
                {schedule.map((block, idx) => {
                    const proc = processes.find(p => p.id === block.processId);
                    const width = (block.endTime - block.startTime) * pixelsPerTick;
                    const passedWidth = Math.max(0, Math.min((currentTime - block.startTime) * pixelsPerTick, width));

                    return (
                        <motion.div 
                            key={`${block.processId}-${idx}-${block.startTime}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute h-full rounded border border-white/20 flex items-center justify-start overflow-hidden bg-white/5"
                            style={{ 
                                left: block.startTime * pixelsPerTick, 
                                width: Math.max(width, 2)
                            }}
                        >
                            <motion.div 
                                className={`h-full process-color-${proc?.colorIdx} shadow-[0_0_10px_currentColor]`}
                                initial={{ width: 0 }}
                                animate={{ width: passedWidth }}
                                transition={{ ease: 'linear', duration: 0.2 }}
                            />
                            
                            {width > 30 && (
                                <span 
                                    className={`absolute inset-0 flex items-center justify-center font-bold text-sm drop-shadow pointer-events-none ${passedWidth > width / 2 ? 'text-white' : 'text-gray-400'}`}
                                >
                                    {block.processId}
                                </span>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>

        {/* X-axis Ticks */}
        <div className="relative h-6 border-t border-border mt-1" style={{ width: Math.max(maxTime, 50) * pixelsPerTick }}>
            {Array.from({ length: Math.ceil(Math.max(maxTime, 50) / 5) + 1 }).map((_, i) => (
                <div 
                    key={i} 
                    className="absolute -bottom-1 flex flex-col items-center" 
                    style={{ left: (i * 5) * pixelsPerTick, transform: 'translateX(-50%)' }}
                >
                    <div className="w-px h-2 bg-gray-600 mb-1" />
                    <span className="text-[10px] text-gray-400 font-mono">{i * 5}</span>
                </div>
            ))}
        </div>
    </div>
  );
}
