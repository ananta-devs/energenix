// StatsCards.jsx
import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Users, Archive } from 'lucide-react';

const StatsCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1 truncate">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-1 sm:mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="text-xs sm:text-sm font-medium ml-1">
                {isPositive ? '+' : ''}{change}%
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1 hidden sm:inline">
                from last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${color} ml-3 shrink-0`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
};

const StatsCards = ({ reports }) => {
  if (!reports) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  const { salesSummary, inventoryHealth, customerInsights } = reports;

  const formattedStats = [
    {
      title: 'Total Revenue',
      value: `₹${salesSummary.totalRevenue.toLocaleString('en-IN')}`,
      change: salesSummary.monthOverMonthGrowth,
      icon: IndianRupee,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: salesSummary.totalOrders.toLocaleString(),
      change: undefined, // No MoM growth for orders in the API yet
      icon: ShoppingCart,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Customers',
      value: customerInsights.totalCustomers.toLocaleString(),
      change: undefined, // No MoM growth for customers in API
      icon: Users,
      color: 'bg-orange-500'
    },
    {
      title: 'Total Products',
      value: inventoryHealth.totalProducts.toLocaleString(),
      change: undefined, // No MoM growth for products in API
      icon: Archive,
      color: 'bg-blue-500'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {formattedStats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;
