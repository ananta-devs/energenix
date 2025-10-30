import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useStore } from '../../store/useStore';
import ChartContainer from './ChartContainer';

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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Monthly Sales & Revenue
      </h3>

      <ChartContainer className="w-full">
        <div className="w-full h-[350px] min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={250} aspect={2}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              {/* Gradients */}
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={12} tickLine={false} />
              <YAxis
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  borderColor: darkMode ? '#374151' : '#e5e7eb',
                  color: darkMode ? '#ffffff' : '#000000',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="sales" stroke="url(#colorSales)" strokeWidth={2} name="Sales ($)" />
              <Line type="monotone" dataKey="revenue" stroke="url(#colorRevenue)" strokeWidth={2} name="Revenue ($)" />
              <Line type="monotone" dataKey="orders" stroke="url(#colorOrders)" strokeWidth={2} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </div>
  );
};

export default SalesChart;
