export function calculateBurstVariance(processes) {
  if (!processes || processes.length === 0) return 0;
  const bursts = processes.map(p => p.burstTime);
  const mean = bursts.reduce((acc, val) => acc + val, 0) / bursts.length;
  const variance = bursts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / bursts.length;
  return variance;
}

export function recommendAlgorithm(processes, level) {
  const variance = calculateBurstVariance(processes);
  
  // Level 4+ implies priority field might be important to handle
  if (level >= 4 && processes.some(p => p.priority !== undefined)) {
      return { 
          algo: "PRIORITY", 
          reason: "Priority values present — minimize high-priority wait.",
          glow: "orange"
      };
  }
  
  if (variance > 10 && level >= 2) {
      return { 
          algo: "SJF", 
          reason: "High burst variance — SJF cuts avg waiting time.",
          glow: "green"
      };
  }
  
  if (processes.length > 5 && level >= 3) {
      return { 
          algo: "RR", 
          reason: "Many processes — Round Robin ensures fairness.",
          glow: "purple"
      };
  }
  
  return { 
      algo: "FCFS", 
      reason: "Uniform load — FCFS is optimal.",
      glow: "blue"
  };
}
