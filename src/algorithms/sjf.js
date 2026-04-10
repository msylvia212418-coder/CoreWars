export function calculateSJF(processes, numCpus = 1) {
  const cpuReadyTimes = new Array(numCpus).fill(0);
  const schedule = [];
  const processMetrics = [];
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  let remaining = [...processes].map(p => ({ ...p }));
  let completed = 0;

  while (completed < processes.length) {
    let earliestCpuTime = Math.min(...cpuReadyTimes);
    let selectedCpuId = cpuReadyTimes.indexOf(earliestCpuTime);

    const available = remaining.filter(p => p.arrivalTime <= earliestCpuTime && !p.done);

    if (available.length === 0) {
      const notDone = remaining.filter(p => !p.done).sort((a, b) => a.arrivalTime - b.arrivalTime);
      if (notDone.length > 0) {
         cpuReadyTimes[selectedCpuId] = notDone[0].arrivalTime;
      }
      continue;
    }

    available.sort((a, b) => a.burstTime === b.burstTime ? a.arrivalTime - b.arrivalTime : a.burstTime - b.burstTime);
    const process = available[0];
    
    const startTime = earliestCpuTime;
    const endTime = startTime + process.burstTime;

    cpuReadyTimes[selectedCpuId] = endTime;

    schedule.push({ processId: process.id, cpuId: selectedCpuId, startTime, endTime });

    const turnaroundTime = endTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;

    processMetrics.push({ processId: process.id, waitingTime, turnaroundTime });

    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;
    
    remaining.find(p => p.id === process.id).done = true;
    completed++;
  }

  const maxTime = Math.max(...cpuReadyTimes);
  const totalTime = maxTime - Math.min(...processes.map(p => p.arrivalTime));
  const totalBurst = processes.reduce((acc, p) => acc + p.burstTime, 0);
  const cpuUtilization = totalTime === 0 ? 0 : (totalBurst / (totalTime * numCpus)) * 100;

  return { schedule, processMetrics, avgWaitingTime: processes.length ? Number((totalWaitingTime / processes.length).toFixed(2)) : 0, avgTurnaroundTime: processes.length ? Number((totalTurnaroundTime / processes.length).toFixed(2)) : 0, cpuUtilization: Number(cpuUtilization.toFixed(1)) };
}
