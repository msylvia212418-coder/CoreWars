import { useState, useEffect } from 'react';

export function useCountUp(endValue, duration = 1.5, delay = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const easeOutQuad = t => t * (2 - t);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // Handle delay
      if (progress < delay * 1000) {
        animationFrame = requestAnimationFrame(step);
        return;
      }

      const activeProgress = progress - (delay * 1000);
      const percentage = Math.min(activeProgress / (duration * 1000), 1);
      
      const currentVal = easeOutQuad(percentage) * endValue;
      setCount(currentVal);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [endValue, duration, delay]);

  return count;
}
