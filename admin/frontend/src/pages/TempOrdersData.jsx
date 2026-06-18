import React, { useState, useEffect } from "react";
import {
  Search,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Eye,
  Check,
  AlertTriangle,
  ShoppingCart,
  Package,
  User,
  Hash,
  Calendar,
  FileText,
  X,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const TempOrdersData = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState({});
  const [creating, setCreating] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/temp-orders`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
        setFilteredOrders(data.orders || []);
      } else {
        showMessage("Failed to fetch orders", "error");
      }
    } catch (error) {
      showMessage("Network error fetching orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        (order.tempOrderId?.toLowerCase() || "").includes(
          lowercasedSearchTerm
        ) ||
        (order.razorpay_order_id?.toLowerCase() || "").includes(
          lowercasedSearchTerm
        ) ||
        (order.userId?.toLowerCase() || "").includes(lowercasedSearchTerm)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleCheckPayment = async (orderId, razorpay_order_id) => {
    setVerifying((prev) => ({ ...prev, [orderId]: true }));
    try {
      const response = await fetch(
        `${API_URL}/api/admin/temp-orders/check-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ razorpay_order_id }),
        }
      );

      const data = await response.json();

      if (data.paid) {
        showMessage("Payment Verified Successfully", "success");
        setPaymentData((prev) => ({
          ...prev,
          [orderId]: { verified: true, paymentId: data.razorpay_payment_id },
        }));
        // Update local state to reflect PAYMENT_SUCCESS status
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "PAYMENT_SUCCESS" } : o
          )
        );
        setFilteredOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "PAYMENT_SUCCESS" } : o
          )
        );
      } else {
        showMessage("Payment Not Captured", "error");
        setPaymentData((prev) => ({
          ...prev,
          [orderId]: { verified: false, paymentId: null },
        }));
        // Update local state to reflect PAYMENT_FAILED status
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "PAYMENT_FAILED" } : o
          )
        );
        setFilteredOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "PAYMENT_FAILED" } : o
          )
        );
      }
    } catch (error) {
      showMessage("Error verifying payment", "error");
    } finally {
      setVerifying((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleCreateOrder = async (order) => {
    setCreating((prev) => ({ ...prev, [order._id]: true }));
    try {
      const response = await fetch(
        `${API_URL}/api/admin/temp-orders/create-order-from-temp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ tempOrderId: order.tempOrderId || order._id }),
        }
      );

      if (response.ok) {
        showMessage("Order Created Successfully", "success");
        // Update local state to reflect FINALIZED status
        setOrders((prev) =>
          prev.map((o) =>
            o._id === order._id ? { ...o, status: "FINALIZED" } : o
          )
        );
        setFilteredOrders((prev) =>
          prev.map((o) =>
            o._id === order._id ? { ...o, status: "FINALIZED" } : o
          )
        );
      } else {
        showMessage("Failed to create order", "error");
      }
    } catch (error) {
      showMessage("Error creating order", "error");
    } finally {
      setCreating((prev) => ({ ...prev, [order._id]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
      case "PAYMENT_SUCCESS":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "PAYMENT_FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "FINALIZED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
      case "PAYMENT_SUCCESS":
        return <CheckCircle size={14} className="text-green-500" />;
      case "PENDING_PAYMENT":
        return <AlertCircle size={14} className="text-yellow-500" />;
      case "PAYMENT_FAILED":
        return <X size={14} className="text-red-500" />;
      case "FINALIZED":
        return <Check size={14} className="text-gray-500" />;
      default:
        return <RefreshCw size={14} className="text-gray-500" />;
    }
  };

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Message Display */}
      {message.text && (
        <div
          className={`mb-4 rounded-lg p-3 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
              : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <Check
                size={16}
                className="text-green-600 dark:text-green-400"
              />
            ) : (
              <AlertTriangle
                size={16}
                className="text-red-600 dark:text-red-400"
              />
            )}
            <p
              className={`text-sm ${
                message.type === "success"
                  ? "text-green-800 dark:text-green-300"
                  : "text-red-800 dark:text-red-300"
              }`}
            >
              {message.text}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Temp Orders ({filteredOrders.length} of {orders.length})
        </h3>
        <div className="relative w-full sm:w-64">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by Order ID, User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:text-white dark:border-gray-600 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                Customer ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                Created Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {order.customer?.name || "N/A"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {order.userId}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-GB")
                    : "N/A"}
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
                    {order.status !== "FINALIZED" && (
                      <>
                        {/* Check Payment Button */}
                        {order.status === "PENDING_PAYMENT" &&
                          !paymentData[order._id]?.verified && (
                            <button
                              onClick={() =>
                                handleCheckPayment(
                                  order._id,
                                  order.razorpay_order_id
                                )
                              }
                              disabled={
                                verifying[order._id] || !order.razorpay_order_id
                              }
                              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors ${
                                !order.razorpay_order_id
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                              }`}
                            >
                              {verifying[order._id] ? (
                                <>
                                  <RefreshCw
                                    size={14}
                                    className="animate-spin"
                                  />
                                  Verifying...
                                </>
                              ) : (
                                "Check Payment"
                              )}
                            </button>
                          )}

                        {/* Create Order Button */}
                        {(paymentData[order._id]?.verified ||
                          order.status === "PAID" ||
                          order.status === "PAYMENT_SUCCESS") && (
                          <button
                            onClick={() => handleCreateOrder(order)}
                            disabled={creating[order._id]}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {creating[order._id] ? (
                              <>
                                <RefreshCw size={14} className="animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <Check size={14} />
                                Create Order
                              </>
                            )}
                          </button>
                        )}
                      </>
                    )}
                    {order.status === "FINALIZED" && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                        Finalized
                      </span>
                    )}
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
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            No Temp Orders Found
          </h4>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {searchTerm
              ? `No temp orders matched your search for "${searchTerm}"`
              : "There are currently no temp orders to display."}
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
                  <Package size={24} />
                  Temp Order Details
                </h3>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-2"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Order Info & Status */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Temp Order ID</p>
                    <p className="font-mono font-medium text-gray-900 dark:text-white">
                      {selectedOrder.tempOrderId || selectedOrder._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Created Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.createdAt
                        ? new Date(selectedOrder.createdAt).toLocaleString(
                            "en-IN",
                            { timeZone: "Asia/Kolkata" }
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Status</p>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1">{selectedOrder.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Customer & Shipping */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer Details */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                      <User size={18} className="text-blue-500" />
                      Customer Details
                    </h4>
                    {selectedOrder.customer ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Name</p>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer.name || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Phone</p>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer.phone || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Email</p>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customer.email || selectedOrder.userId || "N/A"}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Address</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {[
                              selectedOrder.customer.address_line_one,
                              selectedOrder.customer.address_line_two,
                              selectedOrder.customer.city,
                              selectedOrder.customer.state,
                              selectedOrder.customer.pincode
                            ].filter(Boolean).join(", ")}
                          </p>
                        </div>
                      </div>
                    ) : (
                       <p className="text-gray-500 text-sm">No customer details available.</p>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                      <ShoppingCart size={18} className="text-blue-500" />
                      Order Items
                    </h4>
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                            <tr>
                              <th className="px-3 py-2 font-medium">Product</th>
                              <th className="px-3 py-2 font-medium">SKU</th>
                              <th className="px-3 py-2 font-medium text-center">Qty</th>
                              <th className="px-3 py-2 font-medium text-right">Price</th>
                              <th className="px-3 py-2 font-medium text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {selectedOrder.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="px-3 py-3 font-medium text-gray-900 dark:text-white">
                                  {item.name}
                                </td>
                                <td className="px-3 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">
                                  {item.sku_number || "-"}
                                </td>
                                <td className="px-3 py-3 text-center text-gray-900 dark:text-white">
                                  {item.quantity}
                                </td>
                                <td className="px-3 py-3 text-right text-gray-900 dark:text-white">
                                  ₹{item.unit_price}
                                </td>
                                <td className="px-3 py-3 text-right font-medium text-gray-900 dark:text-white">
                                  ₹{(item.quantity * item.unit_price).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No items found.</p>
                    )}
                  </div>
                </div>

                {/* Right Column: Payment & Summary */}
                <div className="space-y-6">
                  {/* Payment Info */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                      <Hash size={18} className="text-blue-500" />
                      Payment Details
                    </h4>
                    <div className="space-y-3 text-sm">
                       <div>
                         <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Razorpay Order ID</p>
                         <p className="font-mono text-gray-900 dark:text-white truncate" title={selectedOrder.razorpay_order_id}>
                           {selectedOrder.razorpay_order_id || "N/A"}
                         </p>
                       </div>
                       <div>
                         <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Razorpay Payment ID</p>
                         <p className="font-mono text-gray-900 dark:text-white truncate" title={selectedOrder.razorpay_payment_id || paymentData[selectedOrder._id]?.paymentId}>
                           {selectedOrder.razorpay_payment_id || paymentData[selectedOrder._id]?.paymentId || "N/A"}
                         </p>
                       </div>
                       <div>
                         <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Payment Type</p>
                         <p className="font-medium text-gray-900 dark:text-white">
                           {selectedOrder.payment_type || "N/A"}
                         </p>
                       </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                       <Package size={18} className="text-blue-500" />
                       Shipping Info
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Weight</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.weight_grams ? `${selectedOrder.weight_grams} g` : "N/A"}</p>
                      </div>
                      <div>
                         <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Dimensions</p>
                         <p className="font-medium text-gray-900 dark:text-white">
                           {selectedOrder.length_cm && selectedOrder.width_cm && selectedOrder.height_cm 
                             ? `${selectedOrder.length_cm}x${selectedOrder.width_cm}x${selectedOrder.height_cm} cm`
                             : "N/A"}
                         </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>Prepaid Amount</span>
                        <span>₹{selectedOrder.prepaid_amount || 0}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>COD Amount</span>
                        <span>₹{selectedOrder.cod_amount || 0}</span>
                      </div>
                      {selectedOrder.applied_coupon && (
                         <div className="flex justify-between text-green-600 dark:text-green-400">
                           <span>Coupon ({selectedOrder.applied_coupon.code})</span>
                           <span>Applied</span>
                         </div>
                      )}
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                        <span>Total Amount</span>
                        <span>₹{(selectedOrder.prepaid_amount || 0) + (selectedOrder.cod_amount || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TempOrdersData;