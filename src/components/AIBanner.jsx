import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIBanner({ recommendation, onAccept, onOverride }) {
  const [visibleText, setVisibleText] = useState('');
  const [shattered, setShattered] = useState(false);

  useEffect(() => {
    let i = 0;
    const text = `Recommended: ${recommendation.algo} — ${recommendation.reason}`;
    const timer = setInterval(() => {
      setVisibleText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [recommendation]);

  if (shattered) return null;

  return (
    <motion.div 
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      style={{
          clipPath: shattered ? "polygon(0 0, 10% 20%, 30% 0, 50% 30%, 70% 10%, 100% 0, 90% 100%, 70% 80%, 40% 100%, 20% 70%, 0 100%)" : "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
      }}
      className={`relative game-panel w-full p-4 flex items-center justify-between border-${recommendation.glow}-500/50 overflow-hidden group`}
    >
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${recommendation.glow}-500/10 to-transparent -translate-x-full animate-[slide_2s_ease-in-out_infinite]`} />
        
        <div className="flex items-center gap-4 relative z-10 w-full">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1 }}
                className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            >
                🧠
            </motion.div>
            <div className="font-mono text-sm flex-1">
                <span className={`text-${recommendation.glow}-400 font-bold mr-2`}>AI_ANALYSIS:</span>
                <span>{visibleText}</span>
            </div>

            <div className="flex gap-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAccept}
                    className="px-4 py-2 bg-green-900/50 border border-green-500 text-green-400 font-bold rounded shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:bg-green-800/80 transition-colors"
                >
                    ✓ ACCEPT
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, x: [-2, 2, -2, 2, 0] }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setShattered(true);
                        setTimeout(onOverride, 300); // give time for visual to break
                    }}
                    className="px-4 py-2 bg-red-900/50 border border-red-500 text-red-400 font-bold rounded shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:bg-red-800/80 transition-colors"
                >
                    ✗ OVERRIDE
                </motion.button>
            </div>
        </div>
    </motion.div>
  );
}
