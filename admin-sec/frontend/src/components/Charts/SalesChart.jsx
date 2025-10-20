import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStore } from '../../store/useStore';

const SalesChart = () => {
  const { darkMode } = useStore();

  const data = [
    { month: 'Jan', sales: 4000, revenue: 2400, orders: 24 },
    { month: 'Feb', sales: 3000, revenue: 1398, orders: 18 },
    { month: 'Mar', sales: 2000, revenue: 9800, orders: 32 },
    { month: 'Apr', sales: 2780, revenue: 3908, orders: 28 },
    { month: 'May', sales: 1890, revenue: 4800, orders: 45 },
    { month: 'Jun', sales: 2390, revenue: 3800, orders: 38 },
    { month: 'Jul', sales: 3490, revenue: 4300, orders: 52 },
    { month: 'Aug', sales: 4200, revenue: 5200, orders: 61 },
    { month: 'Sep', sales: 3800, revenue: 4900, orders: 55 },
    { month: 'Oct', sales: 4500, revenue: 5800, orders: 68 },
    { month: 'Nov', sales: 5200, revenue: 6200, orders: 72 },
    { month: 'Dec', sales: 5800, revenue: 7100, orders: 85 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Monthly Sales & Revenue
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="month" 
              stroke={darkMode ? '#9ca3af' : '#6b7280'}
            />
            <YAxis 
              stroke={darkMode ? '#9ca3af' : '#6b7280'}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
                color: darkMode ? '#ffffff' : '#000000',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#22c55e" 
              strokeWidth={2}
              name="Sales ($)"
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Revenue ($)"
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;