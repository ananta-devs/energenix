import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const TopSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const analyticsData = await response.json();
        setProducts(analyticsData.topProducts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Top Selling Products
      </h3>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.product} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">G</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{product.product}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.sales} sales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">${product.revenue.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;