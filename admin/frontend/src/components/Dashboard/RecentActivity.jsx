import React from 'react';
import { ShoppingCart, UserPlus, Package, AlertCircle } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'order',
      message: 'New order #1234 placed',
      user: 'John Smith',
      time: '2 min ago',
      icon: ShoppingCart,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'user',
      message: 'New customer registered',
      user: 'Sarah Johnson',
      time: '5 min ago',
      icon: UserPlus,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'inventory',
      message: 'Low stock alert for Blue Sapphire',
      user: 'System',
      time: '10 min ago',
      icon: AlertCircle,
      color: 'text-red-500'
    },
    {
      id: 4,
      type: 'shipment',
      message: 'Order #1232 shipped',
      user: 'Shipping Dept',
      time: '15 min ago',
      icon: Package,
      color: 'text-purple-500'
    },
    {
      id: 5,
      type: 'order',
      message: 'Order #1235 completed',
      user: 'System',
      time: '1 hour ago',
      icon: ShoppingCart,
      color: 'text-blue-500'
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${activity.color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.message}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  by {activity.user} • {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;