import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useStore } from '../../store/useStore';

const GemstonePieChart = () => {
  const { darkMode } = useStore();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPieChartData = async () => {
      try {
        const response = await fetch('http://localhost:3001/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const analyticsData = await response.json();
        const formattedData = analyticsData.categoryRevenue.map(item => ({
          name: item.category,
          value: item.revenue,
          color: item.color,
        }));
        setData(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPieChartData();
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Revenue by Gemstone Type
      </h3>
      <div className="w-full">
        <PieChart width={500} height={350}>
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
      </div>
    </div>
  );
};

export default GemstonePieChart;