import { useEffect, useState } from 'react';

const AnimatedNumber = ({ value, duration = 800, prefix = '', suffix = '' }) => {
  const target = Number(String(value).replace(/[^0-9.-]/g, '')) || 0;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const stepTime = 16;
    const totalSteps = Math.max(1, Math.floor(duration / stepTime));
    const increment = target / totalSteps;
    const timer = setInterval(() => {
      start += increment;
      if ((increment >= 0 && start >= target) || (increment < 0 && start <= target)) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{`${prefix}${displayValue.toFixed(2)}${suffix}`}</>;
};

export default AnimatedNumber;
