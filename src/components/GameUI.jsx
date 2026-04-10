import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import AIBanner from './AIBanner';
import ProcessQueue from './ProcessQueue';
import CPUUnit from './CPUUnit';
import MultiCPU from './MultiCPU';
import GanttChart from './GanttChart';
import ControlPanel from './ControlPanel';
import MetricsPanel from './MetricsPanel';
import { useGameEngine } from '../hooks/useGameEngine';
import { useCareer } from '../hooks/useCareer';
import { evaluateScore } from '../utils/metrics';
import { recommendAlgorithm } from '../ai/recommendation';
import { updateCpuHum } from '../utils/audioSystem';

export default function GameUI({ level, processes, onFinish, onOpenInstructions, onOpenCareer }) {
  const career = useCareer();
  const cumulativeScore = career.stats?.cumulativeScore || 0;
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [quantum, setQuantum] = useState(2);
  
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [acceptedAI, setAcceptedAI] = useState(false);
  
  const [showBossIntro, setShowBossIntro] = useState(false);

  const lockedAlgos = 
      level === 1 ? ['SJF', 'RR', 'PRIORITY'] :
      level === 2 ? ['RR', 'PRIORITY'] :
      level === 3 ? ['PRIORITY'] : [];

  const numCpus = level >= 5 ? 3 : 1;

  const engine = useGameEngine({ processes, algorithm, quantum, numCpus });

  // Initialize Level Logic
  useEffect(() => {
      setAlgorithm(level === 1 ? 'FCFS' : (level === 2 ? 'SJF' : (level === 3 ? 'RR' : 'PRIORITY')));
      
      const rec = recommendAlgorithm(processes, level);
      setAiRecommendation(rec);
      setAcceptedAI(false);
      
      if (level === 5) {
          setShowRecommendation(false);
          setShowBossIntro(true);
          setTimeout(() => {
              setShowBossIntro(false);
              setShowRecommendation(true);
          }, 3500);
      } else {
          setShowRecommendation(level > 1);
      }
      
  }, [level, processes]);

  // Handle Level End & Scoring
  useEffect(() => {
      if (engine.status === 'finished' && engine.metrics) {
          const timeBonus = engine.currentTime < 50; 
          const result = evaluateScore(engine.metrics, processes.length, acceptedAI, timeBonus);
          
          career.logLevelResult(level, result.score, result.stars, engine.currentTime);
          
          // Eject to score screen logic
          setTimeout(() => {
              const overrideText = (!acceptedAI && aiRecommendation && result.score < 80)
                  ? `😏 AI was right this time. Try ${aiRecommendation.algo} next time.` : null;
                  
              onFinish({ ...result, aiOverrideText: overrideText, chosenAlgorithm: algorithm, chosenQuantum: quantum }, engine.simulationResult?.processMetrics);
          }, 2000); 
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.status, engine.metrics, processes.length, acceptedAI, engine.currentTime]);

  // Audio Driver
  useEffect(() => {
      if (engine.status === 'running') {
          updateCpuHum(engine.activeProcesses.length);
      } else {
          updateCpuHum(0);
      }
  }, [engine.status, engine.activeProcesses.length]);

  const handleAIOverride = () => {
      setShowRecommendation(false);
      setAcceptedAI(false);
  };

  const handleAIAccept = () => {
      setAlgorithm(aiRecommendation.algo);
      setShowRecommendation(false);
      setAcceptedAI(true);
  };

  return (
    <motion.div 
      className={`absolute inset-0 flex flex-col p-4 gap-4 z-10 transition-colors duration-1000 ${level >= 5 ? 'bg-red-950/20' : ''}`}
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <Header 
          level={level} 
          time={engine.currentTime} 
          score={cumulativeScore} 
          algorithm={algorithm} 
          onOpenInstructions={onOpenInstructions} 
          onOpenCareer={onOpenCareer}
      />

      <AnimatePresence>
          {showBossIntro && (
              <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none"
              >
                  <motion.div 
                      animate={{ x: [-10, 10, -10, 10, 0], y: [-5, 5, -5, 5, 0] }}
                      transition={{ duration: 0.4, repeat: 7 }}
                      className="flex flex-col items-center"
                  >
                      <div className="text-[120px] filter drop-shadow-[0_0_30px_#ef4444]">💀</div>
                      <h1 className="text-6xl md:text-8xl font-black text-red-600 tracking-widest mt-4" style={{ textShadow: "0 0 40px #ef4444" }}>
                          BOSS LEVEL
                      </h1>
                      <h2 className="text-2xl text-red-400 tracking-[0.5em] mt-4 font-mono">MULTI-CORE MADNESS</h2>
                  </motion.div>
              </motion.div>
          )}

          {showRecommendation && aiRecommendation && (
              <AIBanner 
                  recommendation={aiRecommendation} 
                  onAccept={handleAIAccept} 
                  onOverride={handleAIOverride} 
              />
          )}
      </AnimatePresence>

      {/* Main Game Area */}
      <div className="flex-1 game-panel flex flex-col overflow-hidden relative">
        <ProcessQueue queue={engine.queueSnapshot} algorithm={algorithm} />

        <div className="flex-1 flex flex-col p-4 relative overflow-y-auto overflow-x-hidden">
            
            {level >= 5 && <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:100%_4px] mix-blend-overlay pointer-events-none z-0" />}

            {level >= 5 ? (
                <MultiCPU 
                    activeProcesses={engine.activeProcesses} 
                    algorithm={algorithm} 
                    status={engine.status} 
                    cpuCount={3} 
                />
            ) : (
                <CPUUnit 
                    activeProcess={engine.activeProcesses[0]} 
                    algorithm={algorithm} 
                    status={engine.status} 
                />
            )}
            
            <div className="mt-auto z-10 block">
                <GanttChart 
                    schedule={engine.simulationResult?.schedule || []} 
                    currentTime={engine.currentTime}
                    processes={processes}
                />
            </div>
        </div>

        {engine.status === 'finished' && (
            <MetricsPanel metrics={engine.metrics} />
        )}
      </div>

      {/* Bottom Panel */}
      <ControlPanel 
          status={engine.status}
          speed={engine.speed}
          onStart={engine.start}
          onPause={engine.pause}
          onReset={engine.reset}
          onToggleSpeed={engine.toggleSpeed}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          lockedAlgos={lockedAlgos}
          quantum={quantum}
          setQuantum={setQuantum}
      />
    </motion.div>
  );
}
