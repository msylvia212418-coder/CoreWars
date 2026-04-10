import { useState } from 'react';

const STORAGE_KEY = 'cpu_manager_career_v1';

const defaultStats = {
    maxLevelUnlocked: 1,
    totalStars: 0,
    cumulativeScore: 0,
    totalTicksTracked: 0
};

export function useCareer() {
  const [stats, setStats] = useState(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
          try {
              return JSON.parse(stored);
          } catch(e) { console.error("Corrupted career save", e); }
      }
      return defaultStats;
  });

  const saveStats = (newStats) => {
      setStats(newStats);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
  };

  const logLevelResult = (level, score, stars, ticks) => {
      const nextLevel = stars > 0 ? Math.max(level + 1, stats.maxLevelUnlocked) : stats.maxLevelUnlocked;
      
      saveStats({
          maxLevelUnlocked: nextLevel,
          totalStars: stats.totalStars + stars,
          cumulativeScore: stats.cumulativeScore + score,
          totalTicksTracked: stats.totalTicksTracked + ticks
      });
  };

  const wipeCareer = () => {
      saveStats(defaultStats);
  };

  return {
      stats,
      logLevelResult,
      wipeCareer
  };
}
