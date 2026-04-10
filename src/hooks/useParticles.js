import { useState, useEffect } from 'react';

// Lightweight particle generator for simple sparks/blips without Canvas
export function useParticles(active) {
  const [particles, setParticles] = useState([]);

  if (!active && particles.length > 0) {
      setParticles([]);
  }

  useEffect(() => {
    if (!active) {
      return;
    }

    const interval = setInterval(() => {
      const newParticle = {
        id: Math.random().toString(36).substring(7),
        x: Math.random() * 100, // percentage
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.5 + 0.5,
        life: Math.random() * 1000 + 500
      };

      setParticles(prev => [...prev.slice(-15), newParticle]);
      
      // Auto-remove
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, newParticle.life);

    }, 150); // Emit every 150ms

    return () => clearInterval(interval);
  }, [active]);

  return particles;
}
