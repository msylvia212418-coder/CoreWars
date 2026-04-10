import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProcessQueue({ queue, algorithm }) {
  return (
    <div className="h-32 border-b border-border/50 bg-black/20 p-4 flex items-center relative overflow-hidden">
      <div className="absolute left-2 top-2 text-xs text-gray-500 font-bold tracking-widest">READY QUEUE</div>
      
      <div className="flex gap-4 items-center h-full pt-4 w-full px-4 overflow-x-auto">
        <AnimatePresence mode="popLayout">
          {queue.map((proc, index) => (
            <motion.div
              key={proc.id}
              layout
              initial={{ x: -200, opacity: 0, scale: 0.8 }}
              animate={{ 
                  x: 0, 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -4, 0]
              }}
              exit={{ scale: 1.2, opacity: 0, filter: "brightness(2)" }}
              transition={{ 
                  type: "spring", stiffness: 120, damping: 14,
                  y: { repeat: Infinity, duration: 2, delay: index * 0.2 } 
              }}
              className={`w-24 h-16 rounded-lg process-color-${proc.colorIdx} flex flex-col justify-center items-center shadow-lg relative glow-${algorithm.toLowerCase()}`}
            >
              <span className="font-bold text-white drop-shadow-md text-lg">{proc.id}</span>
              <span className="text-xs text-white/80 font-mono">BT:{proc.burstTime}</span>
              
              {proc.priority !== undefined && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold shadow-md border-2 border-panel">
                      {proc.priority}
                  </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {queue.length === 0 && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
               className="text-gray-600 font-mono text-sm w-full text-center"
            >
                Queue Empty // Waiting for processes
            </motion.div>
        )}
      </div>
    </div>
  );
}
