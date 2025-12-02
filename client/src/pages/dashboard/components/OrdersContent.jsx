import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import OrderSkeleton from './OrderSkeleton';

// Function to get status icon and color - Moved from Dashboard.jsx
const getStatusInfo = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' };
    case 'shipped':
      return { icon: Truck, color: 'text-blue-600', bgColor: 'bg-blue-50' };
    case 'processing':
      return { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    default:
      return { icon: Package, color: 'text-gray-600', bgColor: 'bg-gray-50' };
  }
};

const OrdersContent = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="mb-20">
        <h1 className="text-3xl font-semi-bold text-gray-900 mb-6">Orders</h1>
        <OrderSkeleton />
      </div>
    );
  }

  return (
    <div className="mb-20">
      <h1 className="text-3xl font-semi-bold text-gray-900 mb-6">Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600">
            Go to store to place an order.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const StatusIcon = getStatusInfo(order.status).icon;
            const statusColor = getStatusInfo(order.status).color;
            const statusBgColor = getStatusInfo(order.status).bgColor;
            const total = order.items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
            
            return (
              <div key={order._id} className="bg-white rounded-lg shadow-sm p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order {order.order_id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.order_date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBgColor} ${statusColor}`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-b border-gray-200 py-4 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 mb-3 last:mb-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {item.image_urls && item.image_urls.length > 0 ? (
                          <img 
                            src={item.image_urls[0]} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{item.unit_price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Shipped to: {order.customer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{total.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersContent;