import React, { useState, useEffect } from 'react';
import { ShoppingCart, UserPlus, Package, AlertCircle } from 'lucide-react';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const [ordersResponse, customersResponse] = await Promise.all([
          fetch('http://localhost:3001/orders?_sort=orderDate&_order=desc&_limit=5'),
          fetch('http://localhost:3001/customers?_sort=joinDate&_order=desc&_limit=5')
        ]);

        if (!ordersResponse.ok || !customersResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const orders = await ordersResponse.json();
        const customers = await customersResponse.json();

        const combinedActivities = [
          ...orders.map(order => ({
            id: `order-${order.id}`,
            type: 'order',
            message: `New order #${order.orderNumber} for ${order.product}`,
            user: order.customer,
            time: new Date(order.orderDate).toLocaleDateString(),
            icon: ShoppingCart,
            color: 'text-blue-500'
          })),
          ...customers.map(customer => ({
            id: `customer-${customer.id}`,
            type: 'user',
            message: 'New customer registered',
            user: customer.name,
            time: new Date(customer.joinDate).toLocaleDateString(),
            icon: UserPlus,
            color: 'text-green-500'
          }))
        ];

        const sortedActivities = combinedActivities.sort((a, b) => new Date(b.time) - new Date(a.time));

        setActivities(sortedActivities.slice(0, 5));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
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