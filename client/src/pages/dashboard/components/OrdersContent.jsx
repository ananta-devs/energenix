import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import OrderSkeleton from "./OrderSkeleton";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Status info helper
const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
        case "delivered":
            return {
                icon: CheckCircle,
                color: "text-green-600",
                bgColor: "bg-green-50",
            };
        case "shipped":
        case "out for delivery":
            return {
                icon: Truck,
                color: "text-blue-600",
                bgColor: "bg-blue-50",
            };
        case "processing":
        case "pickup pending":
            return {
                icon: Clock,
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
            };
        case "cancelled":
            return {
                icon: XCircle,
                color: "text-red-600",
                bgColor: "bg-red-50",
            };
        default:
            return {
                icon: Package,
                color: "text-gray-600",
                bgColor: "bg-gray-50",
            };
    }
};

// Progress steps helper - returns only steps up to current status
const getProgressSteps = (status) => {
    const statusOrder = {
        ordered: ["Ordered"],
        processing: ["Ordered", "Processing"],
        "pickup pending": ["Ordered", "Processing", "Pickup Pending"],
        "picked up": ["Ordered", "Processing", "Pickup Pending", "Picked Up"],
        shipped: [
            "Ordered",
            "Processing",
            "Pickup Pending",
            "Picked Up",
            "Shipped",
        ],
        "out for delivery": [
            "Ordered",
            "Processing",
            "Pickup Pending",
            "Picked Up",
            "Shipped",
            "Out for Delivery",
        ],
        delivered: [
            "Ordered",
            "Processing",
            "Pickup Pending",
            "Picked Up",
            "Shipped",
            "Out for Delivery",
            "Delivered",
        ],
        cancelled: ["Ordered", "Cancelled"],
    };

    const statusKey = status.toLowerCase();

    // For cancelled orders, show specific flow
    if (statusKey === "cancelled") {
        return ["Ordered", "Cancelled"];
    }

    // Find the matching status key (including partial matches)
    for (const [key, steps] of Object.entries(statusOrder)) {
        if (statusKey.includes(key) || key.includes(statusKey)) {
            return steps;
        }
    }

    // Default fallback for unknown statuses
    return ["Ordered", "Processing", "Shipped", "Delivered"];
};

// Determine step state
const getStepStatus = (step, currentStatus, stepIndex, totalSteps) => {
    const statusKey = currentStatus.toLowerCase();

    // Handle cancelled orders
    if (statusKey === "cancelled") {
        if (step === "Ordered") return "completed";
        if (step === "Cancelled") return "current";
        return "pending";
    }

    const progressSteps = getProgressSteps(currentStatus);
    const currentStepIndex = progressSteps.indexOf(currentStatus);

    // If we can't find the exact status in the steps, approximate
    if (currentStepIndex === -1) {
        // For "out for delivery", it's after shipped
        if (
            statusKey.includes("out for delivery") ||
            statusKey.includes("out-for-delivery")
        ) {
            const shippedIndex = progressSteps.indexOf("Shipped");
            if (shippedIndex !== -1 && stepIndex === shippedIndex + 1)
                return "current";
        }

        // For "picked up", it's after pickup pending
        if (
            statusKey.includes("picked up") ||
            statusKey.includes("picked-up")
        ) {
            const pickupPendingIndex = progressSteps.indexOf("Pickup Pending");
            if (
                pickupPendingIndex !== -1 &&
                stepIndex === pickupPendingIndex + 1
            )
                return "current";
        }

        // Default logic based on step position
        const estimatedProgress = (stepIndex + 1) / totalSteps;
        const statusProgress = getStatusProgress(statusKey);

        if (estimatedProgress <= statusProgress) return "completed";
        if (estimatedProgress <= statusProgress + 0.2) return "current";
        return "pending";
    }

    // Exact match found
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "current";
    return "pending";
};

// Helper to estimate progress percentage based on status
const getStatusProgress = (status) => {
    const progressMap = {
        ordered: 0.1,
        processing: 0.3,
        "pickup pending": 0.5,
        "picked up": 0.6,
        shipped: 0.7,
        "out for delivery": 0.8,
        delivered: 1.0,
    };

    for (const [key, progress] of Object.entries(progressMap)) {
        if (status.includes(key) || key.includes(status)) {
            return progress;
        }
    }

    return 0.1; // Default for unknown status
};

// Progress Bar Component - Reusable for both desktop and mobile
const ProgressBar = ({ status, steps, isMobile = false }) => {
    const progressWidth = getStatusProgress(status) * 100;
    const iconSize = isMobile ? 20 : 32; // w-5 = 20px, w-8 = 32px
    const halfIconSize = iconSize / 2;
    
    return (
        <div className={`relative ${isMobile ? 'w-full z-1' : 'w-[360px]'} pb-10`}>
            {/* Step icons positioned absolutely */}
            <div className="absolute top-0 left-0 w-full flex justify-between items-start">
                {steps.map((step, idx) => {
                    const stepStatus = getStepStatus(step, status, idx, steps.length);
                    const iconClassName = isMobile ? "w-5 h-5" : "w-8 h-8";
                    const textSize = isMobile ? "text-[9px]" : "text-[10px]";

                    return (
                        <div key={idx} className="flex flex-col z-40 items-center">
                            <motion.div
                                layout
                                transition={{ duration: 0.5 }}
                                className={`${iconClassName} rounded-full flex items-center justify-center ${
                                    stepStatus === "completed"
                                        ? "bg-green-500 text-white"
                                        : stepStatus === "current"
                                        ? "bg-yellow-400 text-white"
                                        : "bg-gray-200 text-gray-500"
                                }`}
                            >
                                {stepStatus === "completed" ? (
                                    <CheckCircle className={isMobile ? "w-3 h-3" : "w-6 h-6"} />
                                ) : stepStatus === "current" ? (
                                    <Clock className={isMobile ? "w-3 h-3" : "w-6 h-6"} />
                                ) : (
                                    <Package className={isMobile ? "w-3 h-3" : "w-6 h-6"} />
                                )}
                            </motion.div>
                            <span className={`${textSize} mt-1 whitespace-nowrap`}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
            {/* Background line - positioned to start/end at icon centers */}
            <div className={`${isMobile ? '-translate-y-0.5' : 'absolute top-0 left-0 w-full'} `}>
                <div 
                    className="h-1.5 bg-gray-200 rounded-full absolute top-0"
                    style={{
                        left: `${halfIconSize}px`,
                        right: `${halfIconSize}px`,
                        top: `${isMobile ? '9px' : '12px'}`, // Half of icon size (20/2=10, 32/2=16) minus half of line height (1.5/2=0.75)
                    }}
                ></div>

                {/* Filled progress */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressWidth}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-1.5 bg-green-500 rounded-full absolute top-0"
                    style={{
                        left: `${halfIconSize}px`,
                        top: `${isMobile ? '9px' : '12px'}`,
                    }}
                />
            </div>
        </div>
    );
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
        // Clear any previous error messages
        setErrorMessage("");

        // Validate reason selection
        if (!selectedReason) {
            setErrorMessage("Please select a reason for cancellation");
            return;
        }

        // Validate custom reason if "other" is selected
        if (selectedReason === "other" && !customReason.trim()) {
            setErrorMessage("Please provide a reason for cancellation");
            return;
        }

        setIsSubmitting(true);
        
        // Prepare cancellation data
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
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50  backdrop-blur-xl transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div 
                    className="relative bg-white rounded-lg shadow-xl w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 pt-6 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Cancel Order
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Please tell us why you want to cancel order
                        </p>
                    </div>

                    {/* Reason Selection */}
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
                                        setErrorMessage(""); // Clear error when user selects an option
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

                        {/* Custom Reason Input */}
                        {selectedReason === "other" && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Please specify your reason
                                </label>
                                <textarea
                                    value={customReason}
                                    onChange={(e) => {
                                        setCustomReason(e.target.value);
                                        setErrorMessage(""); // Clear error when user types
                                    }}
                                    placeholder="Enter your reason for cancellation..."
                                    className="w-full px-3 py-2 border border-gray-300 resize-none rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                                    rows="3"
                                />
                            </div>
                        )}

                        {/* Error Message Display */}
                        {errorMessage && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-red-700">{errorMessage}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
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
        // Call the original onCancel prop with the cancellation data
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
                            const StatusIcon = getStatusInfo(order.status).icon;
                            const total = order.items.reduce(
                                (acc, item) =>
                                    acc + item.unit_price * item.quantity,
                                0
                            );
                            const steps = getProgressSteps(order.status);

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
                                                <button
                                                    onClick={() => handleCancelClick(order._id)}
                                                    className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-xs sm:hidden"
                                                >
                                                    Cancel Order
                                                </button>
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

                                        {/* RIGHT SIDE — Progress Bar on Large Screens */}
                                        <div className="hidden lg:block">
                                            <ProgressBar status={order.status} steps={steps} />
                                        </div>

                                        {/* MOBILE PROGRESS BAR (shown below Left content) */}
                                        <div className="lg:hidden mt-3">
                                            <ProgressBar status={order.status} steps={steps} isMobile={true} />
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
                                            <button
                                                onClick={() => handleCancelClick(order._id)}
                                                className="hidden sm:block px-3 py-2 sm:py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-xs sm:text-sm font-medium"
                                            >
                                                Cancel Order
                                            </button>

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