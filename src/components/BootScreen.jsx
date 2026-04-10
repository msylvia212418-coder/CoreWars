import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playTypewriter } from '../utils/audioSystem';

const TypewriterText = ({ text, delay = 0 }) => {
  const [visibleText, setVisibleText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleText(text.substring(0, i + 1));
        playTypewriter();
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span>{visibleText}<span className="animate-pulse">_</span></span>;
};

export default function BootScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const duration = 2500; // 2.5s intro
    const interval = 20;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setProgress((step / steps) * 100);
      
      if (step === Math.floor(steps * 0.95)) {
          setFlicker(true);
      }

      if (step >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 300); // Small wait after 100%
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black ${flicker ? 'animate-pulse' : ''}`}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "brightness(2)", transition: { duration: 0.5, ease: "easeIn" } }}
    >
      <div className="w-full max-w-2xl px-8 flex flex-col items-start font-mono">
        <motion.div 
          className="text-4xl md:text-6xl font-bold mb-4 tracking-wider text-blue-500"
          style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.8)' }}
        >
          <TypewriterText text="CoreWars" />
        </motion.div>
        
        <motion.div 
          className="text-lg md:text-xl text-gray-400 mb-8 h-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Process Scheduling Simulator
        </motion.div>

        <div className="w-full h-2 bg-gray-900 border border-gray-800 rounded relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
            style={{ width: `${progress}%` }}
          />
          {/* Scanline effect on progress bar */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] w-[200%] animate-[slide_1s_linear_infinite]" />
        </div>
        
        <div className="mt-2 text-sm text-gray-500 self-end mono">
          {Math.floor(progress)}% SYSTEMS ONLINE
        </div>
      </div>
    </motion.div>
  );
}
