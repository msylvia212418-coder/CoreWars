import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useCountUp } from '../hooks/useCountUp';
import { playStarChime, playThwack } from '../utils/audioSystem';
import { useState, useEffect } from 'react';

const Star = ({ active }) => (
  <motion.div 
      initial={{ scale: 0, rotate: -45, opacity: 0 }}
      animate={active ? { scale: [0, 1.4, 1], rotate: 0, opacity: 1 } : { scale: 1, opacity: 0.2 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="text-6xl filter drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]"
  >
      ⭐
  </motion.div>
);

export default function ScoreScreen({ score, stars, aiOverrideText, processMetrics, onNextLevel }) {
  const animatedScore = useCountUp(score, 1.5, 0.5); // delay 0.5s
  const [showStars, setShowStars] = useState(0);
  const [showRank, setShowRank] = useState(false);

  useEffect(() => {
    const s1 = setTimeout(() => { setShowStars(1); if (stars >= 1) playStarChime(1); }, 2000);
    const s2 = setTimeout(() => { setShowStars(2); if (stars >= 2) playStarChime(2); }, 2300);
    const s3 = setTimeout(() => { setShowStars(3); if (stars >= 3) playStarChime(3); }, 2600);
    const r = setTimeout(() => {
        setShowRank(true);
        playThwack();
        if (stars > 0) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
            });
        }
    }, 3000);

    return () => { clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); clearTimeout(r); };
  }, [stars]);

  return (
    <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-base"
    >
        <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="game-panel w-full max-w-2xl p-8 flex flex-col items-center relative overflow-hidden"
        >
            {/* Background flourish */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

            <h2 className="text-xl font-bold tracking-widest text-gray-400 mb-2">SYSTEM EVALUATION</h2>
            
            <div className="text-[80px] font-mono font-bold leading-none mb-6 drop-shadow-[0_0_20px_#fff]">
                {Math.floor(animatedScore)}
            </div>

            <div className="flex gap-4 mb-8">
                <Star active={showStars >= 1 && stars >= 1} />
                <Star active={showStars >= 2 && stars >= 2} />
                <Star active={showStars >= 3 && stars >= 3} />
            </div>

            <AnimatePresence>
                {showRank && (
                    <motion.div 
                        initial={{ scale: 3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-8 rotate-[-5deg] border-4 border-red-500 text-red-500 font-black text-3xl px-6 py-2 rounded shadow-[0_0_20px_rgba(239,68,68,0.5)] tracking-widest"
                    >
                        {stars === 3 ? 'EXPERT' : stars === 2 ? 'INTERMEDIATE' : stars === 1 ? 'BEGINNER' : 'FAILED'}
                    </motion.div>
                )}
            </AnimatePresence>

            {aiOverrideText && (
                <div className="text-sm font-mono text-yellow-400 mb-6 italic h-6 text-center">
                   {aiOverrideText}
                </div>
            )}

            {/* Analytics Graph */}
            {showRank && processMetrics && processMetrics.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 160 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="w-full mt-2 mb-6 flex flex-col items-center border-t border-border pt-4"
                >
                    <span className="text-xs text-gray-500 tracking-widest font-mono mb-2">PROCESS WAIT TIMES</span>
                    <div className="w-full h-full text-xs font-mono">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={processMetrics.map(p => ({
                                name: `P${p.processId}`,
                                Wait: p.waitingTime,
                                Turnaround: p.turnaroundTime
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" tick={{fill: '#888'}} />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333' }} />
                                <Bar dataKey="Wait" fill="#ef4444" radius={[2, 2, 0, 0]} />
                                <Bar dataKey="Turnaround" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}

            {showRank && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onNextLevel}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-[0_0_15px_#3b82f6] tracking-widest"
                >
                    VIEW STRATEGY COMPARISON 📊
                </motion.button>
            )}
        </motion.div>
    </motion.div>
  );
}
