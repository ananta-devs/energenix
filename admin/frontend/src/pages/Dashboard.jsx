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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your gemstone business today.
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
          {currentDate}
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <GemstonePieChart />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopSellingProducts />
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;