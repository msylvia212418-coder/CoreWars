import React from 'react';
import { motion } from 'framer-motion';
import CPUUnit from './CPUUnit';

export default function MultiCPU({ activeProcesses, algorithm, status, cpuCount = 3 }) {
  // Identify which process is running on which CPU
  const getProcessForCpu = (cpuId) => {
      return activeProcesses.find(p => p.cpuId === cpuId) || null;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full p-4">
        
        {/* Background Load Balancer Graphics */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
            <svg width="100%" height="100%" className="-translate-y-12">
                <defs>
                    <linearGradient id="flowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={`var(--color-${algorithm.toLowerCase()})`} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={`var(--color-${algorithm.toLowerCase()})`} stopOpacity="0" />
                    </linearGradient>
                </defs>
                {Array.from({ length: cpuCount }).map((_, i) => {
                    // Draw lines from top center (queue) to each CPU based on layout
                    const isActive = getProcessForCpu(i) && status === 'running';

                    return (
                        <g key={i}>
                            <path 
                                d={`M 500 0 C 500 100, ${i===0?250:i===1?750:500} 100, ${i===0?250:i===1?750:500} ${i===2?350:150}`} 
                                stroke="#1f2937" 
                                strokeWidth="4" 
                                fill="none"
                                strokeDasharray="10 10"
                                vectorEffect="non-scaling-stroke"
                            />
                            {isActive && (
                                <motion.path 
                                    d={`M 500 0 C 500 100, ${i===0?250:i===1?750:500} 100, ${i===0?250:i===1?750:500} ${i===2?350:150}`} 
                                    stroke={`var(--color-${algorithm.toLowerCase()})`} 
                                    strokeWidth="6" 
                                    fill="none"
                                    strokeDasharray="15 15"
                                    vectorEffect="non-scaling-stroke"
                                    animate={{ strokeDashoffset: [30, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                    style={{ filter: `drop-shadow(0 0 10px var(--color-${algorithm.toLowerCase()}))` }}
                                />
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>

        {/* Triangle Layout of CPUs */}
        <div className="relative w-full max-w-2xl h-[400px] flex items-center justify-center">
            
            {/* CPU 0 (Top Left) */}
            <div className="absolute top-0 left-0 transform scale-75 origin-top-left flex flex-col items-center">
                <span className="text-gray-500 font-mono font-bold mb-2 tracking-widest text-sm">CORE_00</span>
                <CPUUnit activeProcess={getProcessForCpu(0)} algorithm={algorithm} status={status} />
            </div>

            {/* CPU 1 (Top Right) */}
            <div className="absolute top-0 right-0 transform scale-75 origin-top-right flex flex-col items-center">
                <span className="text-gray-500 font-mono font-bold mb-2 tracking-widest text-sm">CORE_01</span>
                <CPUUnit activeProcess={getProcessForCpu(1)} algorithm={algorithm} status={status} />
            </div>

            {/* CPU 2 (Bottom Center) */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 scale-75 flex flex-col items-center origin-bottom">
                <span className="text-gray-500 font-mono font-bold mb-3 tracking-widest text-sm translate-y-8 z-20">CORE_02</span>
                <CPUUnit activeProcess={getProcessForCpu(2)} algorithm={algorithm} status={status} />
            </div>
            
        </div>
        
    </div>
  );
}
