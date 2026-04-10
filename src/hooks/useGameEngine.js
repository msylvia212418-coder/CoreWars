import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { calculateFCFS } from '../algorithms/fcfs';
import { calculateSJF } from '../algorithms/sjf';
import { calculatePriority } from '../algorithms/priority';
import { calculateRoundRobin } from '../algorithms/roundRobin';

export function useGameEngine({ processes, algorithm, quantum = 2, numCpus = 1 }) {
  const [status, setStatus] = useState('idle'); // idle, running, paused, finished
  const [speed, setSpeed] = useState(1); // 1 = normal, 3 = fast
  const [currentTime, setCurrentTime] = useState(0);
  const [metrics, setMetrics] = useState(null);
  
  const tickTimer = useRef(null);
  const [prevInputs, setPrevInputs] = useState({ processes, algorithm, quantum, numCpus });

  if (processes !== prevInputs.processes ||
      algorithm !== prevInputs.algorithm ||
      quantum !== prevInputs.quantum ||
      numCpus !== prevInputs.numCpus) {
      
      setPrevInputs({ processes, algorithm, quantum, numCpus });
      setMetrics(null);
      setCurrentTime(0);
      setStatus('idle');
  }

  const simulationResult = useMemo(() => {
    if (!processes || processes.length === 0) return null;
    switch(algorithm) {
      case 'FCFS': return calculateFCFS(processes, numCpus);
      case 'SJF': return calculateSJF(processes, numCpus);
      case 'PRIORITY': return calculatePriority(processes, numCpus);
      case 'RR': return calculateRoundRobin(processes, quantum, numCpus);
      default: return calculateFCFS(processes, numCpus);
    }
  }, [processes, algorithm, quantum, numCpus]);

  const tick = useCallback(() => {
    setCurrentTime(prevTime => {
      const nextTime = prevTime + 1;
      
      if (!simulationResult) return nextTime;
      
      const maxTime = Math.max(...simulationResult.schedule.map(s => s.endTime));
      
      if (nextTime >= maxTime) {
          setStatus('finished');
          setMetrics({
              avgWaitingTime: simulationResult.avgWaitingTime,
              avgTurnaroundTime: simulationResult.avgTurnaroundTime,
              cpuUtilization: simulationResult.cpuUtilization
          });
      }
      return nextTime;
    });
  }, [simulationResult]);

  useEffect(() => {
    if (status === 'running') {
      const baseTickMs = 700;
      const effectiveTickMs = speed === 3 ? 150 : (speed === 2 ? 350 : baseTickMs);
      
      tickTimer.current = setInterval(tick, effectiveTickMs);
    } else {
      if (tickTimer.current) clearInterval(tickTimer.current);
    }
    
    return () => {
      if (tickTimer.current) clearInterval(tickTimer.current);
    };
  }, [status, speed, tick]);

  const activeProcesses = useMemo(() => {
    if (!simulationResult) return [];
    const actives = simulationResult.schedule.filter(s => currentTime >= s.startTime && currentTime < s.endTime);
    return actives.map(active => {
        const p = processes.find(proc => proc.id === active.processId);
        return {
            ...p,
            ...active,
            progressPercent: ((currentTime - active.startTime) / (active.endTime - active.startTime)) * 100
        };
    });
  }, [currentTime, simulationResult, processes]);

  const queueSnapshot = useMemo(() => {
    if (!simulationResult) return [];
    return processes.map(proc => {
        const procSchedules = simulationResult.schedule.filter(s => s.processId === proc.id);
        const lastEnd = Math.max(...procSchedules.map(s => s.endTime), -1);
        const isDone = lastEnd !== -1 && currentTime >= lastEnd;
        const hasArrived = proc.arrivalTime <= currentTime;
        const isActive = activeProcesses.some(ap => ap.processId === proc.id);
        
        return {
            ...proc,
            isDone,
            hasArrived,
            isActive
        };
    }).filter(p => p.hasArrived && !p.isDone && !p.isActive);
  }, [currentTime, simulationResult, processes, activeProcesses]);

  const start = () => setStatus('running');
  const pause = () => setStatus('paused');
  const reset = () => {
      setStatus('idle');
      setCurrentTime(0);
      setMetrics(null);
  };
  const toggleSpeed = () => setSpeed(s => s === 1 ? 2 : (s === 2 ? 3 : 1));

  return {
    status,
    speed,
    currentTime,
    activeProcesses, // Array instead of single activeProcess
    queueSnapshot,
    metrics,
    simulationResult,
    start,
    pause,
    reset,
    toggleSpeed
  };
}
