import React from 'react';
import { motion } from 'framer-motion';
import { useParticles } from '../hooks/useParticles';

export default function CPUUnit({ activeProcess, algorithm, status }) {
  const isRunning = status === 'running';
  const hasProcess = !!activeProcess;
  const particles = useParticles(isRunning && hasProcess);

  // SVG Hexagon path
  const hexPath = "M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z";

  return (
    <div className="flex-1 flex justify-center items-center relative overflow-hidden">
      
      {/* Background Pulse when running */}
      {isRunning && hasProcess && (
          <motion.div 
             className={`absolute blur-3xl rounded-full w-64 h-64 opacity-20 bg-${activeProcess.colorIdx ? `process-color-${activeProcess.colorIdx}` : algorithm.toLowerCase()}`}
             animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
             transition={{ duration: 2, repeat: Infinity }}
          />
      )}

      {/* Particles effect */}
      {particles.map(p => (
          <motion.div 
            key={p.id}
            className="absolute rounded-full bg-white shadow-[0_0_8px_#fff]"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ y: -50, x: (parseInt(p.id, 36) % 50 - 25) || 0, opacity: 0 }}
            transition={{ duration: p.life / 1000, ease: "easeOut" }}
          />
      ))}

      <motion.div 
        className="relative w-48 h-48 flex justify-center items-center"
        animate={{ 
            scale: hasProcess ? [1, 1.15, 1] : 1,
            rotate: isRunning ? 360 : 0
        }}
        transition={{ 
            scale: { duration: 0.3 },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
      >
        {/* Progress Ring */}
        <svg className="absolute w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <path d={hexPath} fill="none" stroke="#1f2937" strokeWidth="2" />
            {hasProcess && (
                <motion.path 
                    d={hexPath} 
                    fill="none" 
                    stroke="currentColor" 
                    className={`text-${algorithm.toLowerCase()}`}
                    strokeWidth="4"
                    strokeDasharray="300"
                    strokeDashoffset={300 - (300 * (activeProcess.progressPercent || 0) / 100)}
                    style={{ filter: `drop-shadow(0 0 8px currentColor)` }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </svg>

        {/* CPU Core */}
        <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center relative overflow-hidden backdrop-blur-md transition-all duration-300
            ${hasProcess ? `border-[var(--color-${algorithm.toLowerCase()})] shadow-[0_0_30px_var(--color-${algorithm.toLowerCase()})]` : 'border-border bg-panel/50'}
        `}>
            {/* Core Spinners */}
            <motion.div 
              className={`absolute w-24 h-24 border-2 border-dashed rounded-full ${hasProcess ? `border-[var(--color-${algorithm.toLowerCase()})] opacity-50` : 'border-gray-600 opacity-20'}`}
              animate={{ rotate: isRunning ? -360 : 0 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />

            {/* Active Process Card inside CPU */}
            {hasProcess ? (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`w-20 h-20 rounded process-color-${activeProcess.colorIdx} flex flex-col justify-center items-center shadow-lg z-10`}
                >
                    <span className="font-bold text-white text-xl drop-shadow-md">{activeProcess.id}</span>
                </motion.div>
            ) : (
                <span className="text-gray-500 font-mono tracking-widest">IDLE</span>
            )}
        </div>
      </motion.div>
    </div>
  );
}
