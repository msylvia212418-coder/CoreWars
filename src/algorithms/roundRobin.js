export function calculateRoundRobin(processes, quantum = 2, numCpus = 1) {
  let currentTime = 0;
  const schedule = [];
  const processMetrics = [];
  const cpuEndTimes = new Array(numCpus).fill(0); 
  let completedCount = 0;
  
  let remaining = [...processes].map(p => ({ ...p, remBurst: p.burstTime }));
  let queue = [];
  let addedToQueue = new Set();
  
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let maxTickLimit = 2000; 

  while (completedCount < processes.length && currentTime < maxTickLimit) {
      let arrivals = remaining.filter(p => p.arrivalTime === currentTime && p.remBurst > 0 && !addedToQueue.has(p.id));
      arrivals.sort((a,b) => a.arrivalTime - b.arrivalTime).forEach(p => { queue.push(p); addedToQueue.add(p.id); });

      for (let i = 0; i < numCpus; i++) {
         if (cpuEndTimes[i] <= currentTime && queue.length > 0) {
             const process = queue.shift();
             const runTime = Math.min(process.remBurst, quantum);
             
             schedule.push({ processId: process.id, cpuId: i, startTime: currentTime, endTime: currentTime + runTime });
             cpuEndTimes[i] = currentTime + runTime;
             
             process.remBurst -= runTime;
             process.putBackTime = currentTime + runTime;
         }
      }

      currentTime++;
      
      remaining.forEach(p => {
          if (p.putBackTime === currentTime) {
              p.putBackTime = null;
              if (p.remBurst > 0) {
                  queue.push(p);
              } else {
                  completedCount++;
                  const turnaroundTime = currentTime - p.arrivalTime;
                  const waitingTime = turnaroundTime - p.burstTime;
                  
                  processMetrics.push({ processId: p.id, waitingTime, turnaroundTime });
                  
                  totalTurnaroundTime += turnaroundTime;
                  totalWaitingTime += waitingTime;
              }
          }
      });
  }

  const maxTime = Math.max(...cpuEndTimes.filter(t => t > 0), currentTime);
  const totalTime = maxTime - Math.min(...processes.map(p => p.arrivalTime));
  const totalBurst = processes.reduce((acc, p) => acc + p.burstTime, 0);
  const cpuUtilization = totalTime === 0 ? 0 : (totalBurst / (totalTime * numCpus)) * 100;

  return { schedule, processMetrics, avgWaitingTime: processes.length ? Number((totalWaitingTime / processes.length).toFixed(2)) : 0, avgTurnaroundTime: processes.length ? Number((totalTurnaroundTime / processes.length).toFixed(2)) : 0, cpuUtilization: Number(cpuUtilization.toFixed(1)) };
}
