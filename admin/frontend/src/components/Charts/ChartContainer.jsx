import React, { useState, useEffect } from 'react';

const ChartContainer = ({ children, className = '' }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 150); // Slightly longer delay to ensure container is ready

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-[256px] ${className}`}>
      {isReady ? children : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            Loading chart...
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartContainer;