import React from 'react';
import { TrendingUp } from 'lucide-react';

const TopSellingProducts = () => {
  const products = [
    { id: 1, name: 'Blue Sapphire 2ct', category: 'Sapphire', sales: 45, revenue: 125000, growth: 12 },
    { id: 2, name: 'Emerald Cut Diamond', category: 'Diamond', sales: 38, revenue: 198000, growth: 8 },
    { id: 3, name: 'Ruby Pendant', category: 'Ruby', sales: 32, revenue: 89000, growth: 15 },
    { id: 4, name: 'Amethyst Cluster', category: 'Amethyst', sales: 28, revenue: 45000, growth: -2 },
    { id: 5, name: 'Emerald Ring', category: 'Emerald', sales: 25, revenue: 75000, growth: 5 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Top Selling Products
      </h3>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">G</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">${product.revenue.toLocaleString()}</p>
              <div className="flex items-center justify-end space-x-1">
                <TrendingUp size={14} className={product.growth >= 0 ? 'text-green-500' : 'text-red-500'} />
                <span className={`text-sm ${product.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.growth >= 0 ? '+' : ''}{product.growth}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;