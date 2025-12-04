import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import OrderSkeleton from './OrderSkeleton';
import { motion } from 'framer-motion';

// Status info helper
const getStatusInfo = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' };
    case 'shipped':
    case 'out for delivery':
      return { icon: Truck, color: 'text-blue-600', bgColor: 'bg-blue-50' };
    case 'processing':
    case 'pickup pending':
      return { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    case 'cancelled':
      return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' };
    default:
      return { icon: Package, color: 'text-gray-600', bgColor: 'bg-gray-50' };
  }
};

// Progress steps helper - returns only steps up to current status
const getProgressSteps = (status) => {
  const statusOrder = {
    'ordered': ['Ordered'],
    'processing': ['Ordered', 'Processing'],
    'pickup pending': ['Ordered', 'Processing', 'Pickup Pending'],
    'picked up': ['Ordered', 'Processing', 'Pickup Pending', 'Picked Up'],
    'shipped': ['Ordered', 'Processing', 'Pickup Pending', 'Picked Up', 'Shipped'],
    'out for delivery': ['Ordered', 'Processing', 'Pickup Pending', 'Picked Up', 'Shipped', 'Out for Delivery'],
    'delivered': ['Ordered', 'Processing', 'Pickup Pending', 'Picked Up', 'Shipped', 'Out for Delivery', 'Delivered'],
    'cancelled': ['Ordered', 'Cancelled']
  };

  const statusKey = status.toLowerCase();
  
  // For cancelled orders, show specific flow
  if (statusKey === 'cancelled') {
    return ['Ordered', 'Cancelled'];
  }
  
  // Find the matching status key (including partial matches)
  for (const [key, steps] of Object.entries(statusOrder)) {
    if (statusKey.includes(key) || key.includes(statusKey)) {
      return steps;
    }
  }
  
  // Default fallback for unknown statuses
  return ['Ordered', 'Processing', 'Shipped', 'Delivered'];
};

// Determine step state
const getStepStatus = (step, currentStatus, stepIndex, totalSteps) => {
  const statusKey = currentStatus.toLowerCase();
  
  // Handle cancelled orders
  if (statusKey === 'cancelled') {
    if (step === 'Ordered') return 'completed';
    if (step === 'Cancelled') return 'current';
    return 'pending';
  }
  
  const progressSteps = getProgressSteps(currentStatus);
  const currentStepIndex = progressSteps.indexOf(currentStatus);
  
  // If we can't find the exact status in the steps, approximate
  if (currentStepIndex === -1) {
    // For "out for delivery", it's after shipped
    if (statusKey.includes('out for delivery') || statusKey.includes('out-for-delivery')) {
      const shippedIndex = progressSteps.indexOf('Shipped');
      if (shippedIndex !== -1 && stepIndex === shippedIndex + 1) return 'current';
    }
    
    // For "picked up", it's after pickup pending
    if (statusKey.includes('picked up') || statusKey.includes('picked-up')) {
      const pickupPendingIndex = progressSteps.indexOf('Pickup Pending');
      if (pickupPendingIndex !== -1 && stepIndex === pickupPendingIndex + 1) return 'current';
    }
    
    // Default logic based on step position
    const estimatedProgress = (stepIndex + 1) / totalSteps;
    const statusProgress = getStatusProgress(statusKey);
    
    if (estimatedProgress <= statusProgress) return 'completed';
    if (estimatedProgress <= statusProgress + 0.2) return 'current';
    return 'pending';
  }
  
  // Exact match found
  if (stepIndex < currentStepIndex) return 'completed';
  if (stepIndex === currentStepIndex) return 'current';
  return 'pending';
};

// Helper to estimate progress percentage based on status
const getStatusProgress = (status) => {
  const progressMap = {
    'ordered': 0.1,
    'processing': 0.3,
    'pickup pending': 0.5,
    'picked up': 0.6,
    'shipped': 0.7,
    'out for delivery': 0.8,
    'delivered': 1.0
  };
  
  for (const [key, progress] of Object.entries(progressMap)) {
    if (status.includes(key) || key.includes(status)) {
      return progress;
    }
  }
  
  return 0.1; // Default for unknown status
};

const OrdersContent = ({ orders, loading, onCancel }) => {
  if (loading) {
    return (
      <div className="mb-20 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">Orders</h1>
        <OrderSkeleton />
      </div>
    );
  }

  return (
    <div className="mb-20 px-4 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-sm sm:text-base text-gray-600">Go to store to place an order.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const StatusIcon = getStatusInfo(order.status).icon;
            const statusColor = getStatusInfo(order.status).color;
            const statusBgColor = getStatusInfo(order.status).bgColor;
            const total = order.items.reduce(
              (acc, item) => acc + item.unit_price * item.quantity,
              0
            );
            const steps = getProgressSteps(order.status);

            return (
              <div key={order._id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Order {order.order_id}
                      </h3>
                      <div
                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusBgColor} ${statusColor} sm:hidden`}
                      >
                        <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {order.status}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">
                      Placed on{' '}
                      {new Date(order.order_date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>

                    {/* Animated Progress Bar */}
                    <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-2">
                      {steps.map((step, idx) => {
                        const stepStatus = getStepStatus(step, order.status, idx, steps.length);
                        const isLast = idx === steps.length - 1;
                        return (
                          <div key={idx} className="flex-1 flex items-center min-w-0">
                            {/* Step Icon */}
                            <div className="flex flex-col items-center">
                              <motion.div
                                layout
                                transition={{ duration: 0.5 }}
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mb-1
                                  ${
                                    stepStatus === 'completed'
                                      ? 'bg-green-500 text-white'
                                      : stepStatus === 'current'
                                      ? 'bg-yellow-400 text-white'
                                      : 'bg-gray-200 text-gray-500'
                                  }`}
                              >
                                {stepStatus === 'completed' ? (
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                ) : stepStatus === 'current' ? (
                                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                ) : (
                                  <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                              </motion.div>
                              <span className="text-[10px] sm:text-xs text-center whitespace-nowrap">{step}</span>
                            </div>

                            {/* Connector */}
                            {!isLast && (
                              <motion.div
                                layout
                                transition={{ duration: 0.5 }}
                                className={`flex-1 h-0.5 sm:h-1 mt-3 rounded min-w-[8px] ${
                                  stepStatus === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                              ></motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBgColor} ${statusColor}`}
                  >
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-b border-gray-200 py-3 sm:py-4 mb-3 sm:mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 sm:space-x-4 mb-3 last:mb-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
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
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">
                        ₹{item.unit_price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="w-full sm:w-auto">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Shipped to: {order.customer.name}
                    </p>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    {/* Cancel Button */}
                    {['ordered', 'processing', 'pickup pending'].includes(
                      order.status.toLowerCase()
                    ) && (
                      <button
                        onClick={() => onCancel(order._id)}
                        className="px-3 py-2 sm:py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-xs sm:text-sm font-medium"
                      >
                        Cancel Order
                      </button>
                    )}
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
                      <p className="text-base sm:text-lg font-semibold text-gray-900">
                        ₹{total.toLocaleString('en-IN')}
                      </p>
                    </div>
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