import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useStore } from '../../store/useStore';

const SalesChart = ({ data }) => {
  const { darkMode } = useStore();

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">No sales data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Monthly Sales & Revenue
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
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
            yAxisId="left"
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            tickLine={false}
            tickFormatter={(val) => `₹${val.toLocaleString()}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            tickLine={false}
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
            formatter={(value, name) => {
              if (name === 'Sales' || name === 'Revenue') {
                return [`₹${value.toLocaleString()}`, name];
              }
              return [value, name];
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
            stroke="#22c55e"
            strokeWidth={2}
            name="Sales"
            yAxisId="left"
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Revenue"
            yAxisId="left"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Orders"
            yAxisId="right"
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;