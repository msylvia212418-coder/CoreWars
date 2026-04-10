let audioCtx = null;
let humOsc = null;
let humGain = null;
let masterGain = null;
let isMuted = localStorage.getItem('cpu_manager_muted') === 'true';

export const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = isMuted ? 0 : 1;
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

export const toggleMute = () => {
    isMuted = !isMuted;
    localStorage.setItem('cpu_manager_muted', isMuted);
    if (masterGain && audioCtx) {
        masterGain.gain.setTargetAtTime(isMuted ? 0 : 1, audioCtx.currentTime, 0.1);
    }
    return isMuted;
};

export const getIsMuted = () => isMuted;

export const playTypewriter = () => {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 0.03; // 30ms pop
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; 
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 5000;
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.02);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain || audioCtx.destination);
    
    noise.start();
};

export const playHover = () => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(masterGain || audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
};

export const playClick = () => {
    initAudio(); 
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(masterGain || audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
};

export const playThwack = () => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(masterGain || audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
};

export const playStarChime = (index) => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    const freq = 600 + (index * 250); 
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
    
    // Slight echo effect by using another oscillator
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.01, audioCtx.currentTime);
    osc2.connect(gain);
    osc2.start();
    osc2.stop(audioCtx.currentTime + 1.0);

    osc.connect(gain);
    gain.connect(masterGain || audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.0);
};

export const updateCpuHum = (activeCount) => {
    if (!audioCtx) return;
    
    if (activeCount > 0) {
        if (!humOsc) {
            humOsc = audioCtx.createOscillator();
            humGain = audioCtx.createGain();
            
            humOsc.type = 'triangle';
            humGain.gain.setValueAtTime(0, audioCtx.currentTime);
            
            humOsc.connect(humGain);
            humGain.connect(masterGain || audioCtx.destination);
            humOsc.start();
        }
        
        const baseFreq = 50; 
        const targetFreq = baseFreq + (activeCount * 20);
        const targetGain = Math.min(0.1 + (activeCount * 0.05), 0.3);
        
        humOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.1);
        humGain.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 0.1);
    } else {
        if (humGain) {
            humGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
        }
    }
};
