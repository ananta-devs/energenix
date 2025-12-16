import React from 'react';
import { ShoppingCart, UserPlus } from 'lucide-react';

const ActivityItem = ({ activity }) => {
  const { type, data, timestamp } = activity;
  
  const formatTime = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  if (type === 'new_order') {
    return (
      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-blue-500">
          <ShoppingCart size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            New Order <span className="font-mono text-blue-500">#{data.orderId}</span> for ₹{data.total.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            by {data.name} • {formatTime(timestamp)}
          </p>
        </div>
      </div>
    );
  }

  if (type === 'new_customer') {
    return (
      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-green-500">
          <UserPlus size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            New Customer Registered
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.name} ({data.email}) • {formatTime(timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return null;
};


const RecentActivity = ({ activities }) => {
  if (!activities) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activity
            </h3>
            <div className="space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-lg">
                        <div className="w-8 h-8 rounded-lg bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  if (activities.length === 0) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activity
            </h3>
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">No recent activity.</p>
            </div>
        </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <ActivityItem key={index} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
