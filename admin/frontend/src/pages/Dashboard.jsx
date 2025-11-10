// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import SalesChart from '../components/Charts/SalesChart';
import GemstonePieChart from '../components/Charts/GemstonePieChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import TopSellingProducts from '../components/Dashboard/TopSellingProducts';
import ProductsData from '../components/DataDisplay/ProductsData';
import OrdersData from '../components/DataDisplay/OrdersData';
import CustomersData from '../components/DataDisplay/CustomersData';
import InventoryData from '../components/DataDisplay/InventoryData';
import ReportsData from '../components/DataDisplay/ReportsData';
import { useStore } from '../store/useStore';

const Dashboard = ({ activeTab: propActiveTab }) => {
  const { currentPage, setCurrentPage } = useStore();
  const [activeTab, setActiveTab] = useState(propActiveTab || 'overview');

  // Sync active tab with currentPage from store
  useEffect(() => {
    if (propActiveTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  // Update active tab when currentPage changes
  useEffect(() => {
    if (currentPage !== 'dashboard' && currentPage !== activeTab) {
      setActiveTab(currentPage);
    }
  }, [currentPage, activeTab]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <StatsCards />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <SalesChart />
              <GemstonePieChart />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <TopSellingProducts />
              <RecentActivity />
            </div>
          </>
        );
      case 'products':
        return <ProductsData />;
      case 'orders':
        return <OrdersData />;
      case 'customers':
        return <CustomersData />;
      case 'inventory':
        return <InventoryData />;
      case 'reports':
        return <ReportsData />;
      default:
        return <StatsCards />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      overview: 'Dashboard Overview',
      products: 'Products Management',
      orders: 'Orders Management',
      customers: 'Customers Management',
      inventory: 'Inventory Tracking',
      reports: 'Reports & Analytics'
    };
    return titles[activeTab] || 'Dashboard';
  };

  const getPageDescription = () => {
    const descriptions = {
      overview: "Welcome back! Here's what's happening with your gemstone business today.",
      products: 'Manage your gemstone products, inventory, and pricing.',
      orders: 'View and manage customer orders and shipments.',
      customers: 'Manage customer information and loyalty programs.',
      inventory: 'Track inventory levels and stock alerts.',
      reports: 'Analytics and business intelligence reports.'
    };
    return descriptions[activeTab] || 'Viewing dashboard data';
  };

  // Only show tabs when on overview page
  const showTabs = activeTab === 'overview';

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
            {getPageTitle()}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            {getPageDescription()}
          </p>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 shrink-0">
          {currentDate}
        </div>
      </div>

      {/* Tabs - Only show on overview page */}
      {showTabs && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'products', name: 'Products' },
              { id: 'orders', name: 'Orders' },
              { id: 'customers', name: 'Customers' },
              { id: 'inventory', name: 'Inventory' },
              { id: 'reports', name: 'Reports' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(tab.id);
                }}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Back to Overview Button - Show on non-overview pages */}
      {!showTabs && (
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setActiveTab('overview');
              setCurrentPage('dashboard');
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Overview
          </button>
        </div>
      )}

      {/* Content */}
      <section className="animate-fade-in">
        {renderContent()}
      </section>
    </div>
  );
};

export default Dashboard;