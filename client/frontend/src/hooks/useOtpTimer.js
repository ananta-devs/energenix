// hooks/useOtpTimer.js
import { useState, useEffect } from 'react';

export const useOtpTimer = (initialTime = 30) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setTimeLeft(initialTime);
    setIsActive(true);
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsActive(false);
  };

  return { timeLeft, isActive, startTimer, resetTimer };
};