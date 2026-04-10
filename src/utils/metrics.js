export const generateLevelProcesses = (level) => {
    // Level 1 → FCFS only    | 3–4 processes
    // Level 2 → SJF unlocked | 4–5 processes | high variance
    // Level 3 → RR unlocked  | 5–6 processes
    // Level 4 → PRIORITY     | 5–6 processes | mixes
    // Level 5 → BOSS        | 7–8 processes
  
    const numProcs = level === 1 ? Math.floor(Math.random() * 2) + 3 :
                     level === 2 ? Math.floor(Math.random() * 2) + 4 :
                     level === 3 ? Math.floor(Math.random() * 2) + 5 :
                     level === 4 ? Math.floor(Math.random() * 2) + 5 :
                     Math.floor(Math.random() * 2) + 7;
  
    const processes = [];
    let arrivalTime = 0;
  
    for (let i = 0; i < numProcs; i++) {
      let burstTime = Math.floor(Math.random() * 8) + 2;
      
      // Inject some high variance for level 2 (SJF time to shine)
      if (level === 2 && i === Math.floor(numProcs/2)) burstTime = 15;
      if (level === 2 && i !== Math.floor(numProcs/2)) burstTime = Math.floor(Math.random() * 3) + 1;
  
      // Prioritize some random spacing
      arrivalTime += Math.floor(Math.random() * 3);
  
      let p = {
        id: `P${i + 1}`,
        colorIdx: i % 8,
        arrivalTime,
        burstTime,
      };
  
      if (level >= 4) {
          p.priority = Math.floor(Math.random() * 5) + 1; // 1 to 5, lower might be better
      }
  
      processes.push(p);
    }
  
    return processes;
  };
  
  export const evaluateScore = (metrics, rawProcsCount, acceptedAI, timeBonus) => {
      // Base score
      let score = 100;
  
      // Penalize high wait time
      const waitPenalty = Math.max(0, (metrics.avgWaitingTime - 5) * 2); 
      score -= waitPenalty;
  
      // Penalize low CPU utilization
      if (metrics.cpuUtilization < 80) {
          score -= (80 - metrics.cpuUtilization);
      }
  
      if (acceptedAI && score >= 70) score += 10;
      if (timeBonus) score += 5;
  
      score = Math.max(0, Math.min(100, Math.round(score)));
  
      let stars = 0;
      if (score >= 90) stars = 3;
      else if (score >= 70) stars = 2;
      else if (score >= 50) stars = 1;
  
      return { score, stars };
  };
