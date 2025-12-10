import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../hooks/useCart.js";
import { useAuth } from "../../../hooks/useAuth.js";
import api from "../../../utils/api";
import ap from "../../../assets/logo.svg";
import {
    Shield,
    MapPin,
    CreditCard,
    Package,
    Check,
    ChevronRight,
    Loader2,
    Tag,
    Gift,
    Clock,
    Banknote,
    ShoppingBag,
    Percent,
    Calendar,
    DollarSign,
    Users,
    Ticket,
    X,
} from "lucide-react";

// ============================ CouponModal Component ============================
function CouponModal({
    isOpen,
    onClose,
    couponCode,
    setCouponCode,
    applyCoupon,
    user,
    cartTotal,
}) {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [manualEntryMode, setManualEntryMode] = useState(false);
    const [manualCouponInput, setManualCouponInput] = useState("");

    useEffect(() => {
        if (isOpen && !manualEntryMode) {
            fetchAvailableCoupons();
        }
    }, [isOpen, manualEntryMode]);

    const fetchAvailableCoupons = async () => {
        setLoading(true);
        try {
            const response = await api.get("/coupons/available");
            setCoupons(response.data || []);
        } catch (error) {
            console.error("Error fetching coupons:", error);
            setCoupons([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApplySelected = () => {
        if (selectedCoupon) {
            setCouponCode(selectedCoupon.code);
            applyCoupon();
            onClose();
        }
    };

    const handleManualApply = () => {
        if (manualCouponInput.trim()) {
            setCouponCode(manualCouponInput.toUpperCase());
            applyCoupon();
            onClose();
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const isCouponValid = (coupon) => {
        if (
            coupon.minimum_purchase > 0 &&
            cartTotal < coupon.minimum_purchase
        ) {
            return false;
        }
        if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
            return false;
        }
        return true;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
            <div className="bg-white rounded-xl w-full max-w-sm max-h-[60vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Ticket className="w-4 h-4 text-blue-900" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {manualEntryMode
                                    ? "Enter Coupon Code"
                                    : "Available Coupons"}
                            </h2>
                            <p className="text-xs text-gray-600">
                                {manualEntryMode
                                    ? "Type your code below"
                                    : "Choose a coupon to apply"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="mb-3 flex justify-end">
                        <button
                            onClick={() => setManualEntryMode(!manualEntryMode)}
                            className="text-sm text-blue-950 hover:text-blue-900 flex items-center gap-1"
                        >
                            {manualEntryMode
                                ? "Browse Available Coupons"
                                : "Use My Own"}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {manualEntryMode ? (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter Coupon Code
                                </label>
                                <input
                                    type="text"
                                    value={manualCouponInput}
                                    onChange={(e) =>
                                        setManualCouponInput(
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    placeholder="Enter your coupon code"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                            </div>

                            <button
                                onClick={handleManualApply}
                                disabled={!manualCouponInput.trim()}
                                className="w-full py-3 bg-blue-950 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                Apply Coupon
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="text-center py-10">
                            <Tag className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                                No coupons available
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Check back later for special offers!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {coupons.map((coupon) => {
                                const isValid = isCouponValid(coupon);
                                const isSelected =
                                    selectedCoupon?._id === coupon._id;

                                return (
                                    <div
                                        key={coupon._id}
                                        className={`border rounded-lg p-3 cursor-pointer transition 
                                    ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-blue-300"
                                    } 
                                    ${
                                        !isValid
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }
                                `}
                                        onClick={() =>
                                            isValid && setSelectedCoupon(coupon)
                                        }
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-gray-900">
                                                        {coupon.code}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                                            coupon.discount_type ===
                                                            "percentage"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-blue-100 text-blue-700"
                                                        }`}
                                                    >
                                                        {coupon.discount_type ===
                                                        "percentage"
                                                            ? `${coupon.discount_value}% OFF`
                                                            : `₹${coupon.discount_value} OFF`}
                                                    </span>

                                                    {coupon.visibility ===
                                                        "private" && (
                                                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                                            Private
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-sm text-gray-600 mb-2">
                                                    {coupon.description}
                                                </p>

                                                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                                                    {coupon.minimum_purchase >
                                                        0 && (
                                                        <div className="flex items-center gap-1">
                                                            <ShoppingBag className="w-3 h-3" />
                                                            <span>
                                                                Min: ₹
                                                                {
                                                                    coupon.minimum_purchase
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>
                                                            Valid until:{" "}
                                                            {formatDate(
                                                                coupon.valid_until
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                {!isValid &&
                                                    coupon.minimum_purchase >
                                                        0 && (
                                                        <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                                                            Add ₹
                                                            {coupon.minimum_purchase -
                                                                cartTotal}{" "}
                                                            more to use this
                                                            coupon
                                                        </div>
                                                    )}
                                            </div>

                                            {isSelected ? (
                                                <Check className="w-4 h-4 text-blue-600 ml-3" />
                                            ) : (
                                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full ml-3"></div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4">
                    {!manualEntryMode && (
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleApplySelected}
                                disabled={!selectedCoupon}
                                className="flex-1 px-5 py-3 bg-blue-950 text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {selectedCoupon ? (
                                    <>
                                        <span>Apply {selectedCoupon.code}</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                ) : (
                                    "Select a coupon to apply"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================ ProgressStepper Component ============================
function ProgressStepper({ step }) {
    const steps = ["Shipping", "Payment", "Review"];

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = step === stepNumber;
                    const isCompleted = step > stepNumber;

                    return (
                        <div key={index} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    isCompleted
                                        ? "bg-green-500 text-white"
                                        : isActive
                                        ? "bg-blue-900 text-white"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    stepNumber
                                )}
                            </div>
                            <div className="ml-3">
                                <div className="text-sm text-gray-500">
                                    Step {stepNumber}
                                </div>
                                <div
                                    className={`font-medium ${
                                        isActive
                                            ? "text-blue-900"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {label}
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`h-0.5 w-35 mx-6 ${
                                        step > stepNumber
                                            ? "bg-green-500"
                                            : "bg-gray-200"
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================ ShippingForm Component ============================
function ShippingForm({
    addressForm,
    setAddressForm,
    errors,
    pinLoading,
    handlePinChange,
    handleNext,
}) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddressForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
        setAddressForm((prev) => ({ ...prev, phone: value }));
    };

    const handleAlternativePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
        setAddressForm((prev) => ({ ...prev, alternativePhone: value }));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-blue-900" />
                <h2 className="text-xl font-bold text-gray-900">
                    Shipping Address
                </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={addressForm.fullName}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg ${
                            errors.fullName
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        placeholder="John Doe"
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.fullName}
                        </p>
                    )}
                </div>

                {/* Phone Number and Alternative Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            +91
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            value={addressForm.phone}
                            onChange={handlePhoneChange}
                            className={`w-full p-3 border rounded-lg pl-12 ${
                                errors.phone
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="9876543210"
                            maxLength="10"
                        />
                    </div>
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.phone}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternative Number (Optional)
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            +91
                        </div>
                        <input
                            type="tel"
                            name="alternativePhone"
                            value={addressForm.alternativePhone}
                            onChange={handleAlternativePhoneChange}
                            className="w-full p-3 border border-gray-300 rounded-lg pl-12"
                            placeholder="9876543210"
                            maxLength="10"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        In case we can't reach your primary number
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 *
                    </label>
                    <input
                        type="text"
                        name="addressLine1"
                        value={addressForm.addressLine1}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg ${
                            errors.addressLine1
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        placeholder="Street address, P.O. box"
                    />
                    {errors.addressLine1 && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.addressLine1}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2 (Optional)
                    </label>
                    <input
                        type="text"
                        name="addressLine2"
                        value={addressForm.addressLine2}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="Apartment, suite, unit, etc."
                    />
                </div>

                {/* PIN Code, City, and State in same line */}
                <div className="col-span-2 grid grid-cols-3 gap-4">
                    {/* PIN Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PIN Code *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="pinCode"
                                value={addressForm.pinCode}
                                onChange={(e) =>
                                    handlePinChange(e.target.value)
                                }
                                className={`w-full p-3 border rounded-lg pr-10 ${
                                    errors.pinCode
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="6 digits pin"
                                maxLength="6"
                            />
                            {pinLoading && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <Loader2 className="w-4 h-4 text-blue-900 animate-spin" />
                                </div>
                            )}
                        </div>
                        {errors.pinCode && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.pinCode}
                            </p>
                        )}
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="city"
                                value={addressForm.city}
                                readOnly
                                className={`w-full p-3 border rounded-lg bg-gray-50 ${
                                    addressForm.city
                                        ? "border-green-300 text-green-800"
                                        : "border-gray-300"
                                }`}
                                placeholder="Auto-filled"
                            />
                            {addressForm.city && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                        {errors.city && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.city}
                            </p>
                        )}
                    </div>

                    {/* State */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="state"
                                value={addressForm.state}
                                readOnly
                                className={`w-full p-3 border rounded-lg bg-gray-50 ${
                                    addressForm.state
                                        ? "border-green-300 text-green-800"
                                        : "border-gray-300"
                                }`}
                                placeholder="Auto-filled"
                            />
                            {addressForm.state && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                        {errors.state && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.state}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-8">
                <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2 cursor-pointer"
                >
                    Continue to Payment
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

// ============================ PaymentMethod Component ============================
function PaymentMethod({
    paymentMethod,
    setPaymentMethod,
    handleBack,
    handleNext,
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-blue-900" />
                <h2 className="text-xl font-bold text-gray-900">
                    Payment Method
                </h2>
            </div>

            <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 accent-blue-700"
                    />
                    <div className="ml-3">
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">
                            Pay when you receive your order
                        </div>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                        + ₹100 charges
                    </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 accent-blue-700"
                    />
                    <div className="ml-3">
                        <div className="font-medium">Online Payment</div>
                        <div className="text-sm text-gray-600">
                            Credit/Debit Cards, UPI, Net Banking
                        </div>
                    </div>
                </label>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

// ============================ OrderReview Component ============================
function OrderReview({
    items,
    addressForm,
    handleBack,
    handlePlaceOrder,
    isProcessing,
    calculateItemPrice,
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-blue-900" />
                <h2 className="text-xl font-bold text-gray-900">
                    Order Review
                </h2>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                        Order Items
                    </h3>
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white border rounded flex items-center justify-center">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.p_name}
                                                className="w-10 h-10 object-contain"
                                            />
                                        ) : (
                                            <Package className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {item.p_name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Qty: {item.quantity} × ₹
                                            {Math.round(
                                                calculateItemPrice(item) /
                                                    item.quantity
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="font-bold">
                                    ₹
                                    {Math.round(
                                        calculateItemPrice(item)
                                    ).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                        Delivery Address
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium">
                            {addressForm.fullName} • {addressForm.phone}
                            {addressForm.alternativePhone &&
                                ` • ${addressForm.alternativePhone}`}
                        </div>
                        <div className="text-gray-600 mt-1">
                            {addressForm.addressLine1}
                        </div>
                        {addressForm.addressLine2 && (
                            <div className="text-gray-600">
                                {addressForm.addressLine2}
                            </div>
                        )}
                        <div className="text-gray-600">
                            {addressForm.city}, {addressForm.state} -{" "}
                            {addressForm.pinCode}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={handleBack}
                    disabled={isProcessing}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="px-8 py-3 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5" />
                            Place Order
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

// ============================ OrderSummary Component ============================
function OrderSummary({
    items,
    total,
    shippingCost,
    appliedCoupon,
    discount,
    couponCode,
    setCouponCode,
    applyCoupon,
    removeCoupon,
    errors,
    finalTotal,
    user,
    cartTotal,
}) {
    const [showCouponModal, setShowCouponModal] = useState(false);

    return (
        <>
            <CouponModal
                isOpen={showCouponModal}
                onClose={() => setShowCouponModal(false)}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                applyCoupon={applyCoupon}
                user={user}
                cartTotal={cartTotal}
            />

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                            ₹{total.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">
                            {shippingCost === 0
                                ? "FREE"
                                : `₹${shippingCost.toLocaleString()}`}
                        </span>
                    </div>

                    {appliedCoupon && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount ({appliedCoupon.code})</span>
                            <span className="font-medium">
                                -₹{discount.toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>

                {!appliedCoupon && (
                    <div className="mb-6">
                        <button
                            onClick={() => setShowCouponModal(true)}
                            className="w-full py-3 border border-dashed border-gray-300 rounded-lg hover:border-blue-900 hover:text-blue-900 transition-colors text-gray-600"
                        >
                            + Apply Coupon
                        </button>
                        {errors.coupon && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.coupon}
                            </p>
                        )}
                    </div>
                )}

                {appliedCoupon && (
                    <div className="mb-6 p-3 bg-green-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">
                                Coupon "{appliedCoupon.code}" applied
                            </span>
                        </div>
                        <button
                            onClick={removeCoupon}
                            className="text-sm text-red-600 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                )}

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                            Total
                        </span>
                        <span className="text-2xl font-bold text-blue-900">
                            ₹{finalTotal.toLocaleString()}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 text-right mt-1">
                        Incl. all taxes
                    </p>
                </div>
            </div>
        </>
    );
}

// ============================ Main CheckoutFlow Component ============================
export default function CheckoutLarge() {
    const {
        items,
        total,
        clearCart,
        getUnitPriceForPack,
        calculateItemPrice,
    } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isProcessing, setIsProcessing] = useState(false);
    const [pinLoading, setPinLoading] = useState(false);

    const [addressForm, setAddressForm] = useState({
        fullName: user?.name || "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        alternativePhone: "",
        city: "",
        state: "",
        pinCode: "",
    });

    const [errors, setErrors] = useState({});

    const shippingCost = 100;
    const cartTotal = Math.round(total);
    const finalTotal = Math.round(cartTotal + shippingCost - discount);

    const fetchCityState = async (pin) => {
        try {
            const res = await api.get(`/pincode/${pin}`);
            return { city: res.data.city || "", state: res.data.state || "" };
        } catch {
            return { city: "", state: "" };
        }
    };

    const handlePinChange = async (pin) => {
        const cleanPin = pin.replace(/\D/g, "");
        setAddressForm((prev) => ({ ...prev, pinCode: cleanPin }));
        setErrors((prev) => ({ ...prev, pinCode: "" }));

        if (cleanPin.length === 6) {
            setPinLoading(true);
            const { city, state } = await fetchCityState(cleanPin);
            setAddressForm((prev) => ({ ...prev, city, state }));
            setPinLoading(false);
        } else {
            setAddressForm((prev) => ({ ...prev, city: "", state: "" }));
        }
    };

    const applyCoupon = async () => {
        if (!couponCode) {
            setErrors((prev) => ({
                ...prev,
                coupon: "Please enter a coupon code.",
            }));
            return;
        }
        try {
            const { data } = await api.post("/coupons/apply", {
                couponCode,
                cartTotal,
            });

            setAppliedCoupon(data.coupon);
            if (data.coupon.discount_type === "fixed") {
                setDiscount(data.coupon.discount_value);
            } else if (data.coupon.discount_type === "percentage") {
                const discountValue =
                    (cartTotal * data.coupon.discount_value) / 100;
                setDiscount(discountValue);
            }
            setErrors((prev) => ({ ...prev, coupon: "" }));
        } catch (error) {
            setAppliedCoupon(null);
            setDiscount(0);
            setErrors((prev) => ({
                ...prev,
                coupon: error.response?.data?.message || "Invalid coupon",
            }));
        }
    };

    const removeCoupon = () => {
        setCouponCode("");
        setAppliedCoupon(null);
        setDiscount(0);
    };

    const validateShipping = () => {
        const newErrors = {};
        const { fullName, phone, addressLine1, city, state, pinCode } =
            addressForm;

        if (!fullName.trim()) newErrors.fullName = "Required";
        if (!phone.trim()) newErrors.phone = "Required";
        else if (!/^\d{10}$/.test(phone)) newErrors.phone = "Invalid number";
        if (!addressLine1.trim()) newErrors.addressLine1 = "Required";
        if (!pinCode.trim()) newErrors.pinCode = "Required";
        else if (!/^\d{6}$/.test(pinCode)) newErrors.pinCode = "Invalid PIN";
        if (!city) newErrors.city = "Invalid PIN";
        if (!state) newErrors.state = "Invalid PIN";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && !validateShipping()) return;
        if (step === 2 && paymentMethod === "online") {
            handleOnlinePayment();
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleOnlinePayment = async () => {
        try {
            const { data } = await api.post("/payment/create-order", {
                amount: finalTotal,
            });

            const options = {
                key: data.key,
                amount: finalTotal * 100,
                currency: "INR",
                name: "EnergeniX",
                image: ap,
                order_id: data.orderId,
                handler: async function (response) {
                    const {
                        razorpay_payment_id,
                        razorpay_order_id,
                        razorpay_signature,
                    } = response;
                    try {
                        const { data } = await api.post("/payment/verify", {
                            razorpay_payment_id,
                            razorpay_order_id,
                            razorpay_signature,
                        });
                        if (data.success) {
                            setStep(3);
                        } else {
                            alert("Payment verification failed");
                        }
                    } catch (error) {
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: addressForm.fullName,
                    email: user?.email,
                    contact: addressForm.phone,
                },
                theme: {
                    color: "#162556",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch {
            alert("Error creating payment order");
        }
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);

        try {
            const orderPayload = {
                order_id: `ENX-${Date.now()}`,
                customer: {
                    name: addressForm.fullName,
                    email: user?.email,
                    phone: addressForm.phone,
                    alternativePhone: addressForm.alternativePhone || "",
                    address_line_one: addressForm.addressLine1,
                    address_line_two: addressForm.addressLine2,
                    city: addressForm.city,
                    state: addressForm.state,
                    pincode: addressForm.pinCode,
                },
                items: items.map((item) => ({
                    sku_number: item._id,
                    quantity: item.quantity,
                    pack_type: item.selectedPack || "Pack of 1",
                })),
                payment_type: paymentMethod === "cod" ? "COD" : "PREPAID",
                cod_amount: paymentMethod === "cod" ? String(finalTotal) : "0",
                weight_kg: 0.5,
                length_cm: 20,
                width_cm: 15,
                height_cm: 10,
            };

            await api.post("/orders/create", orderPayload);
            clearCart();
            navigate("/dashboard");
        } catch (error) {
            alert("Order placement failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Add some items to get started!
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 bg-blue-950 text-white rounded-lg hover:bg-blue-900"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Checkout
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <ProgressStepper step={step} />

                        {step === 1 && (
                            <ShippingForm
                                addressForm={addressForm}
                                setAddressForm={setAddressForm}
                                errors={errors}
                                pinLoading={pinLoading}
                                handlePinChange={handlePinChange}
                                handleNext={handleNext}
                            />
                        )}

                        {step === 2 && (
                            <PaymentMethod
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                                handleBack={handleBack}
                                handleNext={handleNext}
                            />
                        )}

                        {step === 3 && (
                            <OrderReview
                                items={items}
                                addressForm={addressForm}
                                handleBack={handleBack}
                                handlePlaceOrder={handlePlaceOrder}
                                isProcessing={isProcessing}
                                calculateItemPrice={calculateItemPrice}
                            />
                        )}
                    </div>

                    <div>
                        <OrderSummary
                            items={items}
                            total={cartTotal}
                            shippingCost={shippingCost}
                            appliedCoupon={appliedCoupon}
                            discount={discount}
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            applyCoupon={applyCoupon}
                            removeCoupon={removeCoupon}
                            errors={errors}
                            finalTotal={finalTotal}
                            user={user}
                            cartTotal={cartTotal}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
