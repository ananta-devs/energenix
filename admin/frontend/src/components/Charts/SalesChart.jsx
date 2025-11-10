import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useStore } from '../../store/useStore';

const SalesChart = () => {
  const { darkMode } = useStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('http://localhost:3001/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const analyticsData = await response.json();
        setData(analyticsData.monthlySales);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Monthly Sales & Revenue
      </h3>
      <div className="w-full">
        <LineChart
          width={500}
          height={350}
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          syncId="dashboard-charts"
        >
          {/* Gradient Definitions */}
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

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={darkMode ? '#374151' : '#e5e7eb'}
          />
          <XAxis
            dataKey="month"
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            tickLine={false}
          />
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
            itemStyle={{
              color: darkMode ? '#ffffff' : '#000000',
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: '12px',
              paddingTop: '10px',
            }}
          />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="url(#colorSales)"
            strokeWidth={2}
            name="Sales ($)"
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="url(#colorRevenue)"
            strokeWidth={2}
            name="Revenue ($)"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="url(#colorOrders)"
            strokeWidth={2}
            name="Orders"
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
          />
        </LineChart>
      </div>
    </div>
  );
};

export default SalesChart;
