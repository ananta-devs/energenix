import React from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import SalesChart from '../components/Charts/SalesChart';
import GemstonePieChart from '../components/Charts/GemstonePieChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import TopSellingProducts from '../components/Dashboard/TopSellingProducts';

const Dashboard = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your gemstone business today.
          </p>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 shrink-0">
          {currentDate}
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      <section className="animate-fade-in">

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <SalesChart />
          <GemstonePieChart />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <TopSellingProducts />
          <RecentActivity />
        </div>
        
      </section>
    </div>
  );
};

export default Dashboard;