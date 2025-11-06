import React, { useState, useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  startValue?: number;
  className?: string;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, startValue = 0, className, duration = 1000 }) => {
  const [count, setCount] = useState(startValue);

  useEffect(() => {
    let start = startValue;
    const end = value;
    if (start === end) {
        setCount(end);
        return;
    };

    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) {
          startTime = timestamp;
          setCount(start); 
      }
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const newCount = Math.floor(progress * (end - start) + start);
      setCount(newCount);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, startValue, duration]);

  return <span className={className}>{count.toLocaleString()}</span>;
};

export default AnimatedNumber;
