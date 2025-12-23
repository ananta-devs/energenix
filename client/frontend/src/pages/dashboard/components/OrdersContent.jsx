import { XCircle, Download } from "lucide-react";
import OrderSkeleton from "./OrderSkeleton";
import { useState, useEffect } from "react";
import { downloadInvoice } from "../../../utils/invoiceGenerator";

const formatStatus = (status) => {
    if (!status) return "";
    if (status === "reqForCancel") return "Cancellation Requested";
    return status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
};

const getStatusStyles = (status) => {
    const s = status?.toUpperCase();
    if (s === "CANCELLED" || status === "reqForCancel") return "bg-red-100 text-red-700 border-red-200";
    if (s === "DELIVERED") return "bg-green-100 text-green-700 border-green-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
};

// Cancel Order Modal Component
const CancelOrderModal = ({ isOpen, onClose, orderId, onSubmit }) => {
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setSelectedReason("");
            setCustomReason("");
            setIsSubmitting(false);
            setErrorMessage("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setErrorMessage("");

        if (!selectedReason) {
            setErrorMessage("Please select a reason for cancellation");
            return;
        }

        if (selectedReason === "other" && !customReason.trim()) {
            setErrorMessage("Please provide a reason for cancellation");
            return;
        }

        setIsSubmitting(true);
        
        const cancellationData = {
            orderId,
            reason: selectedReason === "other" ? customReason : selectedReason,
            reasonType: selectedReason
        };

        try {
            await onSubmit(cancellationData);
            onClose();
        } catch (error) {
            setErrorMessage(error.message || "Cancellation failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 overflow-y-auto"
            onKeyDown={handleKeyDown}
        >
            <div 
                className="fixed inset-0 bg-black/50  backdrop-blur-xl transition-opacity"
                onClick={onClose}
            />

            <div className="flex min-h-full items-center justify-center p-4">
                <div 
                    className="relative bg-white rounded-lg shadow-xl w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-6 pt-6 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Cancel Order
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Please tell us why you want to cancel order
                        </p>
                    </div>

                    <div className="px-6 py-2">
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="cancellationReason"
                                    value="change_of_mind"
                                    checked={selectedReason === "change_of_mind"}
                                    onChange={(e) => {
                                        setSelectedReason(e.target.value);
                                        setErrorMessage("");
                                    }}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm text-gray-900">
                                    Changed my mind
                                </span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="cancellationReason"
                                    value="found_better_price"
                                    checked={selectedReason === "found_better_price"}
                                    onChange={(e) => {
                                        setSelectedReason(e.target.value);
                                        setErrorMessage("");
                                    }}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm text-gray-900">
                                    Found better price elsewhere
                                </span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="cancellationReason"
                                    value="shipping_too_long"
                                    checked={selectedReason === "shipping_too_long"}
                                    onChange={(e) => {
                                        setSelectedReason(e.target.value);
                                        setErrorMessage("");
                                    }}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm text-gray-900">
                                    Shipping takes too long
                                </span>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="cancellationReason"
                                    value="other"
                                    checked={selectedReason === "other"}
                                    onChange={(e) => {
                                        setSelectedReason(e.target.value);
                                        setErrorMessage("");
                                    }}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm text-gray-900">
                                    Other reason
                                </span>
                            </label>
                        </div>

                        {selectedReason === "other" && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Please specify your reason
                                </label>
                                <textarea
                                    value={customReason}
                                    onChange={(e) => {
                                        setCustomReason(e.target.value);
                                        setErrorMessage("");
                                    }}
                                    placeholder="Enter your reason for cancellation..."
                                    className="w-full px-3 py-2 border border-gray-300 resize-none rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                                    rows="3"
                                />
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-red-700">{errorMessage}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Cancellation"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrdersContent = ({ orders, loading, onCancel }) => {
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const handleCancelClick = (orderId) => {
        setSelectedOrderId(orderId);
        setCancelModalOpen(true);
    };

    const handleCancelSubmit = async (cancellationData) => {
        await onCancel(cancellationData.orderId, cancellationData);
    };

    const handleCloseModal = () => {
        setCancelModalOpen(false);
        setSelectedOrderId(null);
    };

    if (loading) {
        return (
            <div className="mb-20 px-4 sm:px-0">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">
                    Orders
                </h1>
                <OrderSkeleton />
            </div>
        );
    }

    return (
        <>
            <div className="mb-20 px-4 sm:px-0">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">
                    Orders
                </h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            No orders yet
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            Go to store to place an order.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            let total = order.items.reduce(
                                (acc, item) =>
                                    acc + item.unit_price * item.quantity,
                                0
                            );
                            
                            const isCOD = order.payment_type === "COD";
                            if (isCOD) {
                                total += 100;
                            }
                            
                            // Calculate Discount
                            let discount = 0;
                            const totalProductAmount = order.items.reduce(
                                (acc, item) => acc + item.unit_price * item.quantity,
                                0
                            );

                            if (order.payment_type === "PREPAID") {
                                discount = totalProductAmount - (Number(order.prepaid_amount) || 0);
                            } else if (isCOD) {
                                discount = totalProductAmount - (Number(order.cod_amount) || 0);
                            }

                            if (discount > 0) {
                                total -= discount;
                            }

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-3">
                                        {/* LEFT SIDE — Order Info */}
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                                    Order {order.order_id}
                                                </h3>

                                                {/* mobile cancel button */}
                                                <div className="flex flex-col items-end gap-2 sm:hidden">
                                                    {(order.status === "CREATED" || order.status === "created") ? (
                                                        <button
                                                            onClick={() => handleCancelClick(order._id)}
                                                            className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-xs"
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    ) : (
                                                        <span className={`px-3 py-2 rounded-lg text-xs font-medium border ${getStatusStyles(order.status)}`}>
                                                            {formatStatus(order.status)}
                                                        </span>
                                                    )}

                                                    {order.status?.toLowerCase() === 'delivered' && (
                                                        <button
                                                            onClick={() => downloadInvoice(order)}
                                                            className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 bg-gray-50 px-2 py-1 rounded border border-gray-200"
                                                        >
                                                            <Download size={14} />
                                                            <span>Invoice</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-xs sm:text-sm text-gray-600">
                                                Placed on{" "}
                                                {new Date(order.order_date).toLocaleDateString("en-IN", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>

                                        {/* Large Screen Cancel/Status */}
                                        <div className="hidden lg:flex items-center gap-3 mt-1">
                                            {(order.status === "CREATED" || order.status === "created") ? (
                                                <button
                                                    onClick={() => handleCancelClick(order._id)}
                                                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-medium"
                                                >
                                                    Cancel Order
                                                </button>
                                            ) : (
                                                <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusStyles(order.status)}`}>
                                                    {formatStatus(order.status)}
                                                </span>
                                            )}

                                            {order.status?.toLowerCase() === 'delivered' && (
                                                <button
                                                    onClick={() => downloadInvoice(order)}
                                                    className="group relative flex items-center gap-2 overflow-hidden
                                                                rounded-full bg-transparent p-2
                                                                text-gray-500 transition-all duration-300
                                                                hover:bg-blue-50 hover:text-blue-600"
                                                    title="Download Invoice"
                                                    >
                                                    {/* Icon */}
                                                    <Download size={20} className="shrink-0" />

                                                    {/* Animated Text */}
                                                    <span
                                                        className="
                                                        max-w-0 overflow-hidden whitespace-nowrap
                                                        text-sm font-medium
                                                        transition-all duration-300 ease-out
                                                        group-hover:max-w-[140px]
                                                        group-hover:translate-y-0
                                                        translate-y-2
                                                        opacity-0 group-hover:opacity-100 cursor-pointer
                                                        "
                                                    >
                                                        Download Invoice
                                                    </span>
                                                    </button>

                                            )}
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="border-t border-b border-gray-200 py-3 sm:py-4 mb-3 sm:mb-4">
                                        {order.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-3 sm:space-x-4 mb-3 last:mb-0"
                                            >
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    {item.image_urls &&
                                                    item.image_urls.length > 0 ? (
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
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">
                                                    ₹
                                                    {item.unit_price.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {discount > 0 && (
                                            <div className="flex items-center space-x-3 sm:space-x-4 mb-1 pt-1 border-t border-gray-100">
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-xs font-medium pl-15 lg:pl-20 text-green-600 truncate">
                                                        Discount
                                                    </h5>
                                                </div>
                                                <div className="text-xs sm:text-sm font-medium text-green-600 flex-shrink-0">
                                                    - ₹{discount.toLocaleString("en-IN")}
                                                </div>
                                            </div>
                                        )}
                                        {isCOD && (
                                            <div className="flex items-center space-x-3 sm:space-x-4 mb-1 pt-1 border-t border-gray-100">
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-xs font-medium pl-15 lg:pl-20 text-gray-900 truncate">
                                                        Shipping Cost
                                                    </h5>
                                                </div>
                                                <div className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">
                                                    ₹100
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="flex flex-row justify-between items-center gap-3 flex-wrap">
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                Shipped to: {order.customer.name}
                                            </p>
                                        </div>

                                        <div className="flex flex-row items-center gap-3 sm:gap-4 flex-wrap">
                                            {/* Cancel Button */}
                                            {(order.status === "CREATED" || order.status === "created") ? (
                                                <button
                                                    onClick={() => handleCancelClick(order._id)}
                                                    className="hidden sm:block lg:hidden px-3 py-2 sm:py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-xs sm:text-sm font-medium"
                                                >
                                                    Cancel Order
                                                </button>
                                            ) : (
                                                <span className={`hidden sm:block lg:hidden px-3 py-1 rounded-lg text-xs sm:text-sm font-medium border ${getStatusStyles(order.status)}`}>
                                                    {formatStatus(order.status)}
                                                </span>
                                            )}

                                            <div className="text-right">
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Total Amount
                                                </p>
                                                <p className="text-base sm:text-lg font-semibold text-gray-900">
                                                    ₹{total.toLocaleString("en-IN")}
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

            {/* Cancel Order Modal */}
            <CancelOrderModal
                isOpen={cancelModalOpen}
                onClose={handleCloseModal}
                orderId={selectedOrderId}
                onSubmit={handleCancelSubmit}
            />
        </>
    );
};

export default OrdersContent;