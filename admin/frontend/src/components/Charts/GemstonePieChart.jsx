import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useStore } from '../../store/useStore';
import ChartContainer from './ChartContainer';

const GemstonePieChart = () => {
  const { darkMode } = useStore();

  const data = [
    { name: 'Diamond', value: 35, color: '#b9f2ff' },
    { name: 'Ruby', value: 25, color: '#e0115f' },
    { name: 'Emerald', value: 20, color: '#50c878' },
    { name: 'Sapphire', value: 15, color: '#0f52ba' },
    { name: 'Amethyst', value: 5, color: '#9966cc' },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Revenue by Gemstone Type
      </h3>
      <ChartContainer className="h-[350px] min-h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={darkMode ? '#1f2937' : '#ffffff'}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
                color: darkMode ? '#ffffff' : '#000000',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              formatter={(value, name) => [`${value}`, `${name}`]}
            />
            <Legend
              wrapperStyle={{
                fontSize: '12px',
                paddingTop: '10px',
              }}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default GemstonePieChart;