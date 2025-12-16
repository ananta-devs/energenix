import React from 'react';

const TopSellingProducts = ({ products }) => {
  if (!products) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Top Selling Products
        </h3>
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 mt-2"></div>
                </div>
              </div>
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Top Selling Products
            </h3>
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No top selling products data available.</p>
            </div>
        </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Top Selling Products
      </h3>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.sku} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.totalQuantitySold} sales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">₹{product.totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;
