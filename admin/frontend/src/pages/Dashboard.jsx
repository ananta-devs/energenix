// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import SalesChart from '../components/Charts/SalesChart';
import GemstonePieChart from '../components/Charts/GemstonePieChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import TopSellingProducts from '../components/Dashboard/TopSellingProducts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 min-w-0 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 min-w-0">
      {/* Content */}
      <section className="animate-fade-in">
        <StatsCards />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <SalesChart />
          <GemstonePieChart />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <TopSellingProducts />
          <RecentActivity />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;