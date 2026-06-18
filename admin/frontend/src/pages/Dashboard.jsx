// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import SalesChart from '../components/Charts/SalesChart';
import GemstonePieChart from '../components/Charts/GemstonePieChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import TopSellingProducts from '../components/Dashboard/TopSellingProducts';
import { dataService } from '../utils/dataService';

const Dashboard = () => {
  const [reports, setReports] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [topProducts, setTopProducts] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportsData, analyticsData, topProductsData, recentActivityData] = await Promise.all([
          dataService.getReports(),
          dataService.getAnalytics(),
          dataService.getTopSellingProducts(),
          dataService.getRecentActivity()
        ]);
        setReports(reportsData);
        setAnalytics(analyticsData);
        setTopProducts(topProductsData);
        setRecentActivity(recentActivityData);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 min-w-0">
      {/* Content */}
      <section className="animate-fade-in">
        {reports && <StatsCards reports={reports} />}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {analytics && <SalesChart data={analytics.monthlySales} />}
          {analytics && <GemstonePieChart data={analytics.categoryRevenue} />}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {topProducts && <TopSellingProducts products={topProducts} />}
          {recentActivity && <RecentActivity activities={recentActivity} />}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
