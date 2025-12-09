import React, { useState } from "react";
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
    Navigation,
    Tag,
    Gift,
    ChevronDown,
    ChevronUp,
    Clock,
    Banknote,
    ShoppingBag,
} from "lucide-react";

// ============================ CheckoutHeader Component ============================
function CheckoutHeader() {
    return (
        <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div
                    className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                    className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                ></div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                Secure Checkout
            </h1>

            <p className="text-gray-600 text-lg md:text-xl mb-6">
                Complete your purchase in just a few steps
            </p>
        </div>
    );
}

// ============================ ProgressStepper Component ============================
function ProgressStepper({ step }) {
    const steps = [
        { icon: MapPin, label: "Shipping", number: 1 },
        { icon: CreditCard, label: "Payment", number: 2 },
        { icon: Package, label: "Review", number: 3 },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4">
            <div className="relative">
                {/* Progress line container */}
                <div className="absolute top-1/4 left-0 right-0 transform -translate-y-1/2 hidden md:block">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${
                                    ((step - 1) / (steps.length - 1)) * 100
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Steps */}
                <div className="flex justify-between relative z-10">
                    {steps.map((s, i) => {
                        const StepIcon = s.icon;
                        const isActive = step === s.number;
                        const isCompleted = step > s.number;
                        const isUpcoming = step < s.number;

                        return (
                            <div
                                key={i}
                                className={`flex flex-col items-center ${
                                    i === 1 ? "mx-4 md:mx-8" : ""
                                }`}
                            >
                                {/* Step circle */}
                                <div
                                    className={`relative z-20 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 transform ${
                                        isActive ? "scale-110" : ""
                                    } ${
                                        isCompleted
                                            ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-200"
                                            : isActive
                                            ? "bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-200"
                                            : "bg-gray-100 border-2 border-gray-200"
                                    }`}
                                >
                                    {isCompleted ? (
                                        <Check className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                    ) : (
                                        <StepIcon
                                            className={`w-6 h-6 md:w-7 md:h-7 ${
                                                isActive
                                                    ? "text-white"
                                                    : isUpcoming
                                                    ? "text-gray-400"
                                                    : "text-gray-600"
                                            }`}
                                        />
                                    )}

                                    {/* Step number for mobile */}
                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 md:hidden">
                                        {s.number}
                                    </div>
                                </div>

                                {/* Step label */}
                                <div className="mt-3 text-center">
                                    <span
                                        className={`text-xs md:text-sm font-semibold ${
                                            isActive || isCompleted
                                                ? "text-gray-900"
                                                : "text-gray-500"
                                        } ${
                                            isActive
                                                ? "underline decoration-purple-500 decoration-2"
                                                : ""
                                        }`}
                                    >
                                        {s.label}
                                    </span>
                                    <div className="hidden md:block text-xs text-gray-500 mt-1">
                                        Step {s.number} of {steps.length}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile progress indicator */}
                <div className="mt-6 md:hidden">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                            Step {step} of {steps.length}
                        </span>
                        <span className="font-semibold text-purple-600">
                            {steps[step - 1]?.label}
                        </span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                            style={{
                                width: `${
                                    ((step - 1) / (steps.length - 1)) * 100
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================ ShippingForm Component ============================
function ShippingForm({
    addressForm,
    setAddressForm,
    errors,
    setErrors,
    pinLoading,
    handlePinChange,
    handleNext,
}) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddressForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setAddressForm((prev) => ({ ...prev, phone: value }));
        setErrors((prev) => ({ ...prev, phone: "" }));
    };

    const handleAlternativePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setAddressForm((prev) => ({ ...prev, alternativePhone: value }));
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center shadow-md">
                    <MapPin className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Shipping Address
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                        Where should we deliver your order?
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        value={addressForm.fullName}
                        onChange={handleChange}
                        className={`w-full p-3.5 border-2 rounded-xl transition-all focus:outline-none focus:ring-3 focus:ring-opacity-50 ${
                            errors.fullName
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                        }`}
                    />
                    {errors.fullName && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            {errors.fullName}
                        </p>
                    )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                        Phone Number *
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                            +91
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="9876543210"
                            value={addressForm.phone}
                            onChange={handlePhoneChange}
                            maxLength="10"
                            className={`w-full p-3.5 border-2 rounded-xl transition-all focus:outline-none focus:ring-3 focus:ring-opacity-50 pl-16 ${
                                errors.phone
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                            }`}
                        />
                    </div>
                    {errors.phone && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* PIN Code */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                        PIN Code *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="pinCode"
                            placeholder="700001"
                            maxLength="6"
                            value={addressForm.pinCode}
                            onChange={(e) => handlePinChange(e.target.value)}
                            className={`w-full p-3.5 border-2 rounded-xl transition-all focus:outline-none focus:ring-3 focus:ring-opacity-50 ${
                                errors.pinCode
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                            }`}
                        />
                        {pinLoading && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                            </div>
                        )}
                    </div>
                    {errors.pinCode && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            {errors.pinCode}
                        </p>
                    )}
                    {pinLoading && !errors.pinCode && (
                        <p className="text-purple-600 text-sm flex items-center gap-1">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Fetching location details...
                        </p>
                    )}
                </div>

                {/* Alternative Number */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                        Alternative Number (Optional)
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                            +91
                        </div>
                        <input
                            type="tel"
                            name="alternativePhone"
                            placeholder="9876543210"
                            value={addressForm.alternativePhone}
                            onChange={handleAlternativePhoneChange}
                            maxLength="10"
                            className="w-full p-3.5 border-2 border-gray-200 rounded-xl transition-all focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-200 focus:ring-opacity-50 pl-16"
                        />
                    </div>
                    <p className="text-xs text-gray-500">
                        In case we can't reach your primary number
                    </p>
                </div>

                {/* Address Line 1 */}
                <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                        Address Line 1 *
                    </label>
                    <input
                        type="text"
                        name="addressLine1"
                        placeholder="Street address, P.O. box"
                        value={addressForm.addressLine1}
                        onChange={handleChange}
                        className={`w-full p-3.5 border-2 rounded-xl transition-all focus:outline-none focus:ring-3 focus:ring-opacity-50 ${
                            errors.addressLine1
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-200 focus:border-purple-500 focus:ring-purple-200"
                        }`}
                    />
                    {errors.addressLine1 && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            {errors.addressLine1}
                        </p>
                    )}
                </div>

                {/* Address Line 2 */}
                <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                        Address Line 2 (Optional)
                    </label>
                    <input
                        type="text"
                        name="addressLine2"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        value={addressForm.addressLine2}
                        onChange={handleChange}
                        className="w-full p-3.5 border-2 border-gray-200 rounded-xl transition-all focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-200 focus:ring-opacity-50"
                    />
                </div>

                {/* City (Auto-filled) */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                        City *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="city"
                            placeholder="Will auto-fill from PIN"
                            value={addressForm.city}
                            readOnly
                            className={`w-full p-3.5 border-2 rounded-xl transition-all bg-gray-50 ${
                                errors.city
                                    ? "border-red-500 text-red-600"
                                    : addressForm.city
                                    ? "border-green-200 bg-green-50 text-green-800"
                                    : "border-gray-200 text-gray-600"
                            }`}
                        />
                        {addressForm.city && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600">
                                <Check className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    {errors.city && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            {errors.city}
                        </p>
                    )}
                </div>

                {/* State (Auto-filled) */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                        State *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="state"
                            placeholder="Will auto-fill from PIN"
                            value={addressForm.state}
                            readOnly
                            className={`w-full p-3.5 border-2 rounded-xl transition-all bg-gray-50 ${
                                errors.state
                                    ? "border-red-500 text-red-600"
                                    : addressForm.state
                                    ? "border-green-200 bg-green-50 text-green-800"
                                    : "border-gray-200 text-gray-600"
                            }`}
                        />
                        {addressForm.state && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600">
                                <Check className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    {errors.state && (
                        <p className="text-red-600 text-sm flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            {errors.state}
                        </p>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-6 border-t">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                        <p>Your information is secure with us</p>
                        <p className="text-xs text-gray-500">
                            We never share your personal details
                        </p>
                    </div>
                    <button
                        onClick={handleNext}
                        className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 font-semibold shadow-lg shadow-blue-200 min-w-[200px]"
                    >
                        Continue to Payment
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
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
    const paymentMethods = [
        {
            id: "cod",
            name: "Cash on Delivery",
            description: "Pay when you receive your order",
            icon: Package,
            color: "from-blue-500 to-cyan-500",
            badge: "Cherges: ₹100 ",
            disabled: false,
        },
        {
            id: "online",
            name: "Online Payment",
            description: "Credit/Debit Cards, UPI, Net Banking",
            icon: CreditCard,
            color: "from-purple-600 to-indigo-600",
            badge: "Secure & Instant",
            disabled: false,
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-md">
                    <CreditCard className="w-7 h-7 text-purple-600" />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Payment Method
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                        Choose how you'd like to pay
                    </p>
                </div>
            </div>

            {/* Payment Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                    const MethodIcon = method.icon;
                    const isSelected = paymentMethod === method.id;

                    return (
                        <label
                            key={method.id}
                            className={`relative cursor-pointer group ${
                                method.disabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            <input
                                type="radio"
                                name="payment"
                                value={method.id}
                                checked={isSelected}
                                onChange={(e) =>
                                    !method.disabled &&
                                    setPaymentMethod(e.target.value)
                                }
                                disabled={method.disabled}
                                className="sr-only"
                            />
                            <div
                                className={`p-5 border-2 rounded-xl transition-all duration-200 h-full ${
                                    isSelected
                                        ? "border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md"
                                        : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                                } ${
                                    method.disabled
                                        ? "hover:border-gray-200 hover:bg-white"
                                        : ""
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-sm`}
                                    >
                                        <MethodIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">
                                                {method.name}
                                            </span>
                                            {method.badge && (
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${
                                                        isSelected
                                                            ? "bg-purple-100 text-purple-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {method.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {method.description}
                                        </p>
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="mt-4 pt-4 border-t border-purple-100">
                                        {method.id === "cod" && (
                                            <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Banknote className="w-4 h-4" />
                                                    <span>
                                                        Cash payment upon
                                                        delivery
                                                    </span>
                                                </div>
                                                <p className="text-xs mt-2 text-gray-500">
                                                    Please keep exact change
                                                    ready. A small convenience
                                                    fee may apply.
                                                </p>
                                            </div>
                                        )}

                                        {method.id === "online" && (
                                            <div className="text-sm text-gray-600">
                                                <p className="font-medium">
                                                    Accepted Cards:
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-8 h-5 bg-blue-600 rounded text-xs text-white flex items-center justify-center font-bold">
                                                        VISA
                                                    </div>
                                                    <div className="w-8 h-5 bg-red-500 rounded text-xs text-white flex items-center justify-center font-bold">
                                                        RUPAY
                                                    </div>
                                                    <div className="w-8 h-5 bg-blue-800 rounded text-xs text-white flex items-center justify-center font-bold">
                                                        MC
                                                    </div>
                                                    <div className="w-8 h-5 bg-orange-500 rounded text-xs text-white flex items-center justify-center font-bold">
                                                        AMEX
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            )}
                        </label>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <button
                    onClick={handleBack}
                    className="px-6 py-3.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium border-2 border-gray-200 hover:border-gray-300"
                >
                    Back to Shipping
                </button>
                <button
                    onClick={handleNext}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 font-semibold shadow-lg shadow-purple-200 group"
                >
                    {paymentMethod === "online" ? (
                        <>
                            <span>Proceed to Pay</span>
                            <CreditCard className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    ) : (
                        <>
                            <span>Review Your Order</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

// ============================ OrderReview Component ============================
function OrderReview({
    items,
    shippingCost,
    addressForm,
    handleBack,
    handlePlaceOrder,
    isProcessing,
    getUnitPriceForPack,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-md">
                    <Package className="w-7 h-7 text-purple-600" />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Review Your Order
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                        Please verify all details before placing your order
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full">
                    <Shield className="w-4 h-4" />
                    Secure Checkout
                </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Order Items ({items.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.p_name}
                                        className="w-full h-full object-contain rounded"
                                    />
                                ) : (
                                    <Package className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 truncate">
                                    {item.p_name}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Quantity: {item.quantity}
                                    {item.selectedPack && (
                                        <span className="ml-3 px-2 py-1 bg-gray-100 rounded text-xs">
                                            {item.selectedPack}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-lg font-bold text-gray-900 whitespace-nowrap">
                                ₹
                                {Math.round(getUnitPriceForPack(item) * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Address
                </div>
                <div className="text-gray-700 space-y-2">
                    <div className="font-medium">
                        {addressForm.fullName} • {addressForm.phone}
                        {addressForm.alternativePhone &&
                            ` • ${addressForm.alternativePhone}`}
                    </div>
                    <div>{addressForm.addressLine1}</div>
                    {addressForm.addressLine2 && (
                        <div>{addressForm.addressLine2}</div>
                    )}
                    <div>
                        {addressForm.city}, {addressForm.state} -{" "}
                        {addressForm.pinCode}
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm text-blue-600">
                    <Clock className="w-4 h-4" />
                    <span>Estimated delivery: 3-5 business days</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <button
                    onClick={handleBack}
                    disabled={isProcessing}
                    className="px-6 py-3.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Back to Payment
                </button>
                <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 font-semibold shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isProcessing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing Your Order...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5" />
                            Confirm & Place Order
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
    step,
    shippingCost,
    couponApplied,
    discount,
    couponCode,
    setCouponCode,
    applyCoupon,
    errors,
    finalTotal,
    getUnitPriceForPack,
}) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                    <h3 className="text-xl font-bold text-white">
                        Order Summary
                    </h3>
                    <p className="text-purple-100 text-sm mt-1">
                        {items.length} {items.length === 1 ? "item" : "items"}
                    </p>
                </div>

                {/* Items List - Collapsible */}
                <div className="p-6">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center justify-between w-full mb-4 text-gray-700 hover:text-gray-900"
                    >
                        <span className="font-medium">Items in cart</span>
                        {showDetails ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </button>

                    {showDetails && (
                        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
                            {items.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="w-12 h-12 bg-white rounded border border-gray-200 flex-shrink-0">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.p_name}
                                                className="w-full h-full object-contain rounded"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-gray-900 truncate">
                                            {item.p_name}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Qty: {item.quantity} × ₹
                                            {Math.round(getUnitPriceForPack(item)).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        ₹
                                        {Math.round(getUnitPriceForPack(item) * item.quantity).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span className="font-medium">
                                    ₹{total.toLocaleString()}
                                </span>
                            </div>

                            {step >= 2 && (
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    <span
                                        className={`font-medium ${
                                            shippingCost === 0
                                                ? "text-green-600"
                                                : ""
                                        }`}
                                    >
                                        {shippingCost === 0 ? (
                                            <span className="flex items-center gap-1">
                                                FREE
                                                <Gift className="w-4 h-4" />
                                            </span>
                                        ) : (
                                            `₹${shippingCost.toLocaleString()}`
                                        )}
                                    </span>
                                </div>
                            )}

                            {couponApplied && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount (SAVE10)</span>
                                    <span className="font-medium">
                                        -₹{discount.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Coupon Section */}
                        {step >= 2 && !couponApplied && (
                            <div className="pt-4 border-t">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) =>
                                            setCouponCode(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        onKeyPress={(e) =>
                                            e.key === "Enter" && applyCoupon()
                                        }
                                        className="w-full border-2 border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 pr-24"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all text-sm font-medium"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {errors.coupon && (
                                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {errors.coupon}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Try:{" "}
                                    <span
                                        className="font-medium text-purple-600 cursor-pointer hover:underline"
                                        onClick={() => setCouponCode("SAVE10")}
                                    >
                                        SAVE10
                                    </span>
                                </p>
                            </div>
                        )}

                        {couponApplied && (
                            <div className="pt-4 border-t">
                                <div className="flex items-center gap-3 text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <Gift className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-sm">
                                            Coupon "SAVE10" applied!
                                        </div>
                                        <p className="text-xs text-green-600">
                                            You saved ₹{discount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Total */}
                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-lg font-bold text-gray-900">
                                    Total Amount
                                </span>
                                <span className="text-2xl font-bold text-purple-600">
                                    ₹{step >= 2 ? `${finalTotal.toLocaleString()}` : `${total.toLocaleString()}` } 
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 text-right">
                                Inclusive of all taxes
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================ EmptyCart Component ============================
function EmptyCart() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4">
            <div className="relative text-center space-y-6 max-w-md">
                {/* Main icon with gradient */}
                <div className="relative">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-200">
                        <ShoppingBag className="w-16 h-16 text-white" />
                    </div>
                </div>

                {/* Text content */}
                <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Add some items to get started!
                    </p>
                </div>

                {/* Action button */}
                <button
                    onClick={() => navigate("/")}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-semibold shadow-lg shadow-purple-200"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}

// ============================ Main CheckoutFlow Component ============================
export default function CheckoutLarge() {
    const { items, total, clearCart, getUnitPriceForPack } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isProcessing, setIsProcessing] = useState(false);

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
    const [pinLoading, setPinLoading] = useState(false);
    
    const shippingCostValue = 100; // FIXED as per original
    const totalAmount = Math.round(total);
    const shippingCostAmount = Math.round(shippingCostValue);
    const discountAmount = couponApplied ? Math.round(total * 0.1) : 0;
    const finalTotalAmount = Math.round(totalAmount + shippingCostAmount - discountAmount);

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

    const applyCoupon = () => {
        if (couponCode.toUpperCase() === "SAVE10") {
            setCouponApplied(true);
            setErrors((prev) => ({ ...prev, coupon: "" }));
        } else {
            setErrors((prev) => ({ ...prev, coupon: "Invalid coupon code" }));
        }
    };

    const validateShipping = () => {
        const newErrors = {};
        const { fullName, phone, addressLine1, city, state, pinCode } =
            addressForm;

        if (!fullName.trim()) newErrors.fullName = "Full name is required";
        if (!phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(phone))
            newErrors.phone = "Enter valid 10-digit phone number";
        if (!addressLine1.trim())
            newErrors.addressLine1 = "Address is required";
        if (!pinCode.trim()) newErrors.pinCode = "PIN code is required";
        else if (!/^\d{6}$/.test(pinCode))
            newErrors.pinCode = "Enter valid 6-digit PIN code";
        if (!city) newErrors.city = "City not found for this PIN";
        if (!state) newErrors.state = "State not found for this PIN";

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
                amount: finalTotalAmount,
            });

            const options = {
                key: data.key,
                amount: finalTotalAmount * 100,
                currency: "INR",
                name: "EnergeniX",
                image: ap, // Using original import name
                description: "Test Transaction",
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
                notes: {
                    address: addressForm.addressLine1,
                },
                theme: {
                    color: "#162556",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            alert("Error creating order");
        }
    };

    const handlePlaceOrder = async () => {
        if (!paymentMethod) {
            alert("Please select a payment method");
            return;
        }

        setIsProcessing(true);

        try {
            const orderPayload = {
                order_id: Math.random().toString(36).substr(2, 9),
                customer: {
                    name: addressForm.fullName,
                    email: user?.email,
                    phone: addressForm.phone,
                    address_line_one: addressForm.addressLine1,
                    address_line_two: addressForm.addressLine2,
                    city: addressForm.city,
                    state: addressForm.state,
                    pincode: addressForm.pinCode,
                },
                items: items.map((item) => ({
                    name: item.p_name,
                    sku_number: item._id,
                    quantity: item.quantity,
                    unit_price: getUnitPriceForPack(item),
                    pack_type: item.selectedPack
                        ? item.selectedPack.toUpperCase().replace(/ /g, "_")
                        : "PACK_OF_1",
                })),
                payment_type: paymentMethod === "cod" ? "COD" : "PREPAID",
                cod_amount: paymentMethod === "cod" ? String(finalTotalAmount) : "0",
                weight_kg: 0.5,
                length_cm: 20,
                width_cm: 15,
                height_cm: 10,
            };

            const { data } = await api.post("/orders/create", orderPayload);

            if (data.order) {
                clearCart();
                navigate('/dashboard');
            } else {
                throw new Error(data.error || "Order creation failed");
            }
        } catch (error) {
            console.error("Order placement error:", error);
            alert(
                `An error occurred while placing the order: ${error.message}`
            );
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-1 sm:py-6 px-1 sm:px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-4 sm:mb-6">
                    <CheckoutHeader />
                </div>

                <div className="grid lg:grid-cols-3 gap-4 lg:gap-4">
                    <div className="lg:col-span-2 space-y-1">
                        <div className="mb-2">
                            <ProgressStepper step={step} />
                        </div>

                        <div className="min-h-[400px]">
                            {step === 1 && (
                                <ShippingForm
                                    addressForm={addressForm}
                                    setAddressForm={setAddressForm}
                                    errors={errors}
                                    setErrors={setErrors}
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
                                    shippingCost={shippingCostAmount}
                                    addressForm={addressForm}
                                    handleBack={handleBack}
                                    handlePlaceOrder={handlePlaceOrder}
                                    isProcessing={isProcessing}
                                    getUnitPriceForPack={getUnitPriceForPack}
                                />
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                                                    <OrderSummary
                                                        items={items}
                                                        total={totalAmount}
                                                        step={step}
                                                        shippingCost={shippingCostAmount}
                                                        couponApplied={couponApplied}
                                                        discount={discountAmount}
                                                        couponCode={couponCode}
                                                        setCouponCode={setCouponCode}
                                                        applyCoupon={applyCoupon}
                                                        errors={errors}
                                                        finalTotal={finalTotalAmount}
                                                        getUnitPriceForPack={getUnitPriceForPack}
                                                    />                    </div>
                </div>
            </div>
        </div>
    );
}
