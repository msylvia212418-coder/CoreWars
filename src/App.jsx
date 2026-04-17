import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import BootScreen from './components/BootScreen';
import InstructionsScreen from './components/InstructionsScreen';
import LevelSelectScreen from './components/LevelSelectScreen';
import ProcessInputScreen from './components/ProcessInputScreen';
import GameUI from './components/GameUI';
import ScoreScreen from './components/ScoreScreen';
import ComparisonScreen from './components/ComparisonScreen';
import CareerDashboard from './components/CareerDashboard';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import EmailVerificationPendingScreen from './components/EmailVerificationPendingScreen';
import { useAuth } from './hooks/useAuth.jsx';

function App() {
  const { user, emailVerified, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('BOOT');
  const [level, setLevel] = useState(1);
  const [processes, setProcesses] = useState([]);
  const [levelResult, setLevelResult] = useState(null);
  const [gameMetrics, setGameMetrics] = useState(null);
  const [showCareer, setShowCareer] = useState(false);

  useEffect(() => {
    if (currentScreen === 'INSTRUCTIONS') {
      localStorage.setItem('cpu_manager_visited', 'true');
    }
  }, [currentScreen]);

  const handleBootComplete = () => {
    if (localStorage.getItem('cpu_manager_visited')) {
      setCurrentScreen('LEVEL_SELECT');
    } else {
      setCurrentScreen('INSTRUCTIONS');
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-base flex justify-center items-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="bg-grid opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#050814_100%)] z-0"></div>
        </div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#3B82F6] z-10" style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-base relative text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="bg-grid opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#050814_100%)] z-0"></div>
        </div>
        <AnimatePresence mode="wait">
          {showSignup ? (
            <SignupScreen key="signup" onNavigateLogin={() => setShowSignup(false)} />
          ) : (
            <LoginScreen key="login" onNavigateSignup={() => setShowSignup(true)} onForgotPassword={() => {}} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!emailVerified) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-base relative text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="bg-grid opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#050814_100%)] z-0"></div>
        </div>
        <EmailVerificationPendingScreen />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-base relative text-white">
      {/* Background Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-grid opacity-30"></div>
        {/* Deep vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#050814_100%)] z-0"></div>
      </div>

      <AnimatePresence mode="wait">
        {currentScreen === 'BOOT' && (
          <BootScreen key="boot" onComplete={handleBootComplete} />
        )}
        
        {currentScreen === 'INSTRUCTIONS' && (
          <InstructionsScreen 
              key="instructions" 
              onClose={() => setCurrentScreen('LEVEL_SELECT')} 
          />
        )}
        
        {currentScreen === 'LEVEL_SELECT' && (
          <LevelSelectScreen 
              key="level_select" 
              onSelectLevel={(lvl) => { setLevel(lvl); setCurrentScreen('PROCESS_INPUT'); }} 
              onOpenCareer={() => setShowCareer(true)}
          />
        )}
        
        {currentScreen === 'PROCESS_INPUT' && (
          <ProcessInputScreen 
              key="process_input" 
              level={level} 
              onStart={(procs) => { setProcesses(procs); setCurrentScreen('GAME'); }} 
              onBack={() => setCurrentScreen('LEVEL_SELECT')}
          />
        )}
        
        {currentScreen === 'GAME' && (
          <GameUI 
              key="game" 
              level={level} 
              processes={processes} 
              onFinish={(result, metrics) => { 
                setLevelResult(result); 
                setGameMetrics(metrics); 
                setCurrentScreen('SCORE'); 
              }} 
              onAbort={() => setCurrentScreen('LEVEL_SELECT')}
              onOpenInstructions={() => setCurrentScreen('INSTRUCTIONS')} // If they use header button
              onOpenCareer={() => setShowCareer(true)}
          />
        )}
        
        {currentScreen === 'SCORE' && (
          <ScoreScreen 
              key="score" 
              score={levelResult.score} 
              stars={levelResult.stars} 
              aiOverrideText={levelResult.aiOverrideText}
              processMetrics={gameMetrics}
              onNextLevel={() => {
                 setCurrentScreen('COMPARISON');
              }} 
          />
        )}

        {currentScreen === 'COMPARISON' && (
          <ComparisonScreen
              key="comparison"
              level={level}
              processes={processes}
              userAlgorithm={levelResult?.chosenAlgorithm}
              quantum={levelResult?.chosenQuantum || 2}
              onReplay={() => setCurrentScreen('PROCESS_INPUT')}
              onNextLevel={() => {
                 if (levelResult?.stars > 0 && level < 5) {
                    setLevel(l => l + 1);
                 }
                 setCurrentScreen('LEVEL_SELECT');
              }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
          {showCareer && (
              <CareerDashboard 
                  key="career_dash"
                  onClose={() => setShowCareer(false)} 
                  onWipe={() => {
                      setShowCareer(false);
                      setCurrentScreen('LEVEL_SELECT');
                  }}
              />
          )}
      </AnimatePresence>
    </div>
  );
}

export default App;
