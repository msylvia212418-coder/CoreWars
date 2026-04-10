export function calculateFCFS(processes, numCpus = 1) {
  const cpuReadyTimes = new Array(numCpus).fill(0);
  const schedule = [];
  const processMetrics = [];
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  const queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  queue.forEach(process => {
    let earliestCpuTime = Infinity;
    let selectedCpuId = 0;
    for (let i = 0; i < numCpus; i++) {
        if (cpuReadyTimes[i] < earliestCpuTime) {
            earliestCpuTime = cpuReadyTimes[i];
            selectedCpuId = i;
        }
    }

    const startTime = Math.max(process.arrivalTime, earliestCpuTime);
    const endTime = startTime + process.burstTime;
    
    cpuReadyTimes[selectedCpuId] = endTime;

    schedule.push({
      processId: process.id,
      cpuId: selectedCpuId,
      startTime,
      endTime
    });

    const turnaroundTime = endTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;
    
    processMetrics.push({ processId: process.id, waitingTime, turnaroundTime });

    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;
  });

  const maxTime = Math.max(...cpuReadyTimes);
  const totalTime = maxTime - Math.min(...processes.map(p => p.arrivalTime));
  const totalBurst = processes.reduce((acc, p) => acc + p.burstTime, 0);
  const cpuUtilization = totalTime === 0 ? 0 : (totalBurst / (totalTime * numCpus)) * 100;

  return {
    schedule,
    processMetrics,
    avgWaitingTime: processes.length ? Number((totalWaitingTime / processes.length).toFixed(2)) : 0,
    avgTurnaroundTime: processes.length ? Number((totalTurnaroundTime / processes.length).toFixed(2)) : 0,
    cpuUtilization: Number(cpuUtilization.toFixed(1))
  };
}
