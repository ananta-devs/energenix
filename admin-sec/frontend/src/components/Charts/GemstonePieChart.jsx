import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useStore } from '../../store/useStore';

const GemstonePieChart = () => {
  const { darkMode } = useStore();

  const data = [
    { name: 'Diamond', value: 35, color: '#b9f2ff' },
    { name: 'Ruby', value: 25, color: '#e0115f' },
    { name: 'Emerald', value: 20, color: '#50c878' },
    { name: 'Sapphire', value: 15, color: '#0f52ba' },
    { name: 'Amethyst', value: 5, color: '#9966cc' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Revenue by Gemstone Type
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
                color: darkMode ? '#ffffff' : '#000000',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GemstonePieChart;