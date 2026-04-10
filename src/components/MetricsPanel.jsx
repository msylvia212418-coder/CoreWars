import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

const MetricBox = ({ label, value, unit, delay = 0, optimal }) => {
    const animatedValue = useCountUp(value, 1.5, delay);
    
    // logic to color optimal vs sub-optimal (e.g. utilization high is good, wait time low is good)
    let colorClass = "text-white";
    if (optimal === 'high') {
        colorClass = value >= 80 ? "text-green-400" : (value >= 50 ? "text-yellow-400" : "text-red-400");
    } else if (optimal === 'low') {
        colorClass = value <= 5 ? "text-green-400" : (value <= 10 ? "text-yellow-400" : "text-red-400");
    }

    return (
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.5, type: 'spring' }}
            className="flex-1 bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden"
        >
            <span className="text-[10px] text-gray-500 font-bold tracking-widest absolute top-2 left-2">{label}</span>
            <div className="flex items-baseline gap-1 mt-3">
                <span className={`text-4xl font-mono font-bold ${colorClass}`}>
                    {animatedValue.toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm font-mono">{unit}</span>
            </div>
            
            {/* Progress bar visual for utilization */}
            {unit === '%' && (
                <div className="w-full h-1 bg-gray-800 mt-2 rounded overflow-hidden">
                    <motion.div 
                        className={`h-full ${value >= 80 ? 'bg-green-500' : 'bg-red-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${animatedValue}%` }}
                    />
                </div>
            )}
        </motion.div>
    );
};

export default function MetricsPanel({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="game-panel absolute inset-0 z-40 bg-panel/95 backdrop-blur-xl flex flex-col items-center justify-center p-8">
        <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-bold tracking-widest mb-12 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
            SIMULATION COMPLETE
        </motion.h2>

        <div className="w-full max-w-3xl flex gap-6 mb-12">
            <MetricBox label="CPU UTILIZATION" value={metrics.cpuUtilization} unit="%" optimal="high" delay={0.2} />
            <MetricBox label="AVG WAITING TIME" value={metrics.avgWaitingTime} unit="ms" optimal="low" delay={0.4} />
            <MetricBox label="AVG TURNAROUND" value={metrics.avgTurnaroundTime} unit="ms" optimal="low" delay={0.6} />
        </div>
        
        <p className="text-gray-500 font-mono animate-pulse">Waiting for score calculation...</p>
    </div>
  );
}
