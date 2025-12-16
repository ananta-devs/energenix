// components/DataDisplay/OrdersData.jsx
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Truck, Clock, CheckCircle, AlertCircle, Search, 
  Package, RefreshCw, Eye, Edit, X, User, Mail, Phone, 
  MapPin, Calendar, PackageOpen, 
  FileText, Hash, Box, AlertTriangle, Check
} from 'lucide-react';
import { dataService } from '../utils/dataService';

const OrdersData = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({
    status: '',
    payment_type: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = orders.filter(order =>
      (order.customer?.name?.toLowerCase() || '').includes(lowercasedSearchTerm) ||
      (order.order_id?.toLowerCase() || '').includes(lowercasedSearchTerm) ||
      (order.items?.[0]?.name?.toLowerCase() || '').includes(lowercasedSearchTerm)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await dataService.getOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'delivered':
      case 'rto delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'shipped':
      case 'in transit':
      case 'out for delivery':
        return <Truck size={16} className="text-blue-500" />;
      case 'processing':
      case 'packed':
      case 'ready to ship':
        return <Clock size={16} className="text-yellow-500" />;
      case 'created':
      case 'new':
        return <Package size={16} className="text-gray-500" />;
      case 'cancelled':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <RefreshCw size={16} className="text-purple-500" />;
    }
  };

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'delivered':
      case 'rto delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'shipped':
      case 'in transit':
      case 'out for delivery':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'processing':
      case 'packed':
      case 'ready to ship':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'created':
      case 'new':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    }
  };
  
  const calculateTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
  };

  const calculateItemTotal = (item) => {
    return (item.unit_price || 0) * (item.quantity || 0);
  };

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
    setMessage({ type: '', text: '' });
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedOrder(null);
  };

  const openEditModal = () => {
    if (!selectedOrder) return;
    
    setEditFormData({
      status: 'cancelled', // Default to 'cancelled' since it's the only option
      payment_type: selectedOrder.payment_type || ''
    });
    setEditModalOpen(true);
    setMessage({ type: '', text: '' });
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditFormData({
      status: '',
      payment_type: ''
    });
    setMessage({ type: '', text: '' });
    setSaving(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder || !editFormData.status) {
      setMessage({ type: 'error', text: 'Status is required' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    const updateData = { ...editFormData };
    if (editFormData.status === 'cancelled') {
      updateData.cancelled = true;
    }

    try {
      const updatedOrder = await dataService.updateOrder(selectedOrder._id, updateData);

      // Update orders list
      setOrders(orders.map(order =>
        order._id === updatedOrder._id ? updatedOrder : order
      ));

      // Update selected order in view modal
      setSelectedOrder(updatedOrder);

      setMessage({
        type: 'success',
        text: 'Order updated successfully!'
      });

      // Close edit modal after success
      setTimeout(() => {
        closeEditModal();
      }, 1500);

    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update order. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Orders ({filteredOrders.length} of {orders.length})
        </h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Order ID, Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Order ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Customer</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Items</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Order Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Payment</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="py-3 px-4 font-mono text-sm font-medium text-blue-600 dark:text-blue-400">
                  {order.order_id || 'N/A'}
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.customer?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer?.email || ''}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                  {order.items && order.items.length > 0 ? (
                    <>
                      {order.items[0].name}
                      {order.items.length > 1 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          (+{order.items.length - 1} more)
                        </span>
                      )}
                    </>
                  ) : (
                    'No items'
                  )}
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                  ₹{calculateTotal(order.items).toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {(order.status || 'unknown').toLowerCase()}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {order.order_date ? new Date(order.order_date).toLocaleDateString('en-GB') : 'N/A'}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.payment_type === 'PREPAID' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {order.payment_type}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openViewModal(order)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Orders Found</h4>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {searchTerm ? `No orders matched your search for "${searchTerm}"` : "There are currently no orders to display."}
          </p>
        </div>
      )}

      {/* View Order Details Modal */}
      {viewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <PackageOpen size={24} />
                  Order Details
                </h3>
                <div className="flex items-center gap-2">
                  {selectedOrder.status !== 'cancelled' && !selectedOrder.cancelled && (
                    <button
                      onClick={openEditModal}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit size={16} />
                      Edit Order
                    </button>
                  )}
                  <button
                    onClick={closeViewModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-2"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Hash size={16} />
                      Order Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                        <span className="font-medium text-gray-900 dark:text-white font-mono">
                          {selectedOrder.order_id || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedOrder.order_date
                            ? new Date(selectedOrder.order_date).toLocaleString('en-IN', {
                                timeZone: 'Asia/Kolkata'
                              })
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          <span className="ml-1">{(selectedOrder.status || 'unknown').toLowerCase()}</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Payment Type:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedOrder.payment_type === 'PREPAID' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {selectedOrder.payment_type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <User size={16} />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedOrder.customer?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {selectedOrder.customer?.email || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          +91 {selectedOrder.customer?.phone || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <MapPin size={16} />
                      Shipping Address
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedOrder.customer ? (
                        <>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer.name}</p>
                          <p className="text-gray-600 dark:text-gray-400">{selectedOrder.customer.address_line_one}</p>
                          {selectedOrder.customer.address_line_two && (
                            <p className="text-gray-600 dark:text-gray-400">{selectedOrder.customer.address_line_two}</p>
                          )}
                          <p className="text-gray-600 dark:text-gray-400">
                            {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}
                          </p>
                          {/* Country is not directly available in the provided sample customer object, skipping for now */}
                          <p className="text-gray-600 dark:text-gray-400">Phone: +91 {selectedOrder.customer.phone}</p>
                        </>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No shipping address provided</p>
                      )}
                    </div>
                  </div>

                      {(() => {
                        let subtotalValue = calculateTotal(selectedOrder.items);
                        let shippingValue = 0;
                        const taxValue = selectedOrder.tax_amount || 0;

                        if (selectedOrder.payment_type === 'COD') {
                          shippingValue = (selectedOrder.cod_amount || 0) - subtotalValue;
                        } else if (selectedOrder.payment_type === 'PREPAID') {
                          shippingValue = 0;
                        }

                        if (shippingValue < 0 || (selectedOrder.payment_type !== 'COD' && selectedOrder.payment_type !== 'PREPAID')) {
                           shippingValue = selectedOrder.shipping_charges || 0;
                        }

                        const totalValue = subtotalValue + shippingValue + taxValue;

                        return (
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <p size={16}>₹</p>
                              Payment Summary
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  ₹{subtotalValue.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  ₹{shippingValue.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  ₹{taxValue.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                                <span className="text-gray-900 dark:text-white font-semibold">Total:</span>
                                <span className="text-gray-900 dark:text-white font-bold">
                                  ₹{totalValue.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Box size={16} />
                  Order Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-900 dark:text-white">Item</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-900 dark:text-white">Quantity</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-900 dark:text-white">Unit Price</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-900 dark:text-white">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                              <p className="text-xs text-gray-700 dark:text-white">{item.pack_type}</p>
                              {item.sku && (
                                <p className="text-xs text-amber-500 dark:text-gray-400">SKU: {item.sku}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                            ₹{(item.unit_price).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                            ₹{calculateItemTotal(item).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedOrder.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    Order Notes
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Edit size={20} />
                Edit Order: {selectedOrder.order_id}
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`mb-4 rounded-lg p-3 ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  {message.type === 'success' ? (
                    <Check size={16} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
                  )}
                  <p className={`text-sm ${
                    message.type === 'success' 
                      ? 'text-green-800 dark:text-green-300' 
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    {message.text}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order Status *
                </label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={saving}
                >
                  <option key="cancelled" value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Current Order Details
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Customer:</span> {selectedOrder.customer?.name || 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Total Amount:</span> ₹{calculateTotal(selectedOrder.items).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrder}
                disabled={saving || message.type === 'success'}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Update Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersData;