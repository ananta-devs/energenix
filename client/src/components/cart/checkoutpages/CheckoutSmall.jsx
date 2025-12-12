import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../hooks/useCart.js";
import { useAuth } from "../../../hooks/useAuth.js";
import api from "../../../utils/api";
import ap from "../../../assets/logo.svg"; // Placeholder for Razorpay
import {
    MapPin,
    CreditCard,
    Truck,
    CheckCircle2,
    Package,
    Loader2,
    ShoppingBag,
    AlertTriangle,
    X,
    Percent,
    Calendar,
    DollarSign,
    Users,
    Ticket,
    Gift,
} from "lucide-react";

// ============================ CouponModal Component ============================
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
    const [error, setError] = useState("");
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
            onClose();
            // Give a small delay before calling applyCoupon to ensure state is updated
            setTimeout(applyCoupon, 100);
        }
    };

    const handleManualApply = () => {
        if (manualCouponInput.trim()) {
            setCouponCode(manualCouponInput.toUpperCase());
            onClose();
            setTimeout(applyCoupon, 100);
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

    const calculateDiscount = (coupon) => {
        if (coupon.discount_type === "percentage") {
            return (cartTotal * coupon.discount_value) / 100;
        }
        return coupon.discount_value;
    };

    const isCouponValidForCart = (coupon) => {
        if (
            coupon.minimum_purchase > 0 &&
            cartTotal < coupon.minimum_purchase
        ) {
            return false;
        }
        return true;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-100 flex items-center justify-center">
                            <Ticket className="w-5 h-5 text-blue-900" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {manualEntryMode
                                    ? "Enter Coupon Code"
                                    : "Available Coupons"}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {manualEntryMode
                                    ? "Type your code below"
                                    : "Choose a coupon to apply"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* Toggle between available coupons and manual entry */}
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={() => setManualEntryMode(!manualEntryMode)}
                            className="text-sm font-medium text-blue-900 flex items-center gap-1"
                        >
                            {manualEntryMode
                                ? "Browse Available Coupons"
                                : "Use My Own"}
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>

                    {manualEntryMode ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 text-blue-900 animate-spin mb-3" />
                            <p className="text-gray-600">
                                Loading available coupons...
                            </p>
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <Ticket className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No coupons available
                            </h3>
                            <p className="text-gray-600">
                                Check back later for special offers!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {coupons.map((coupon) => {
                                const isSelected =
                                    selectedCoupon?._id === coupon._id;
                                const isValid = isCouponValidForCart(coupon);
                                const discountValue = calculateDiscount(coupon);

                                return (
                                    <div
                                        key={coupon._id}
                                        className={`border-2 rounded-xl p-3 transition-all ${
                                            isSelected
                                                ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50"
                                                : "border-gray-200 hover:bg-gray-50"
                                        } ${
                                            !isValid
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer"
                                        }`}
                                        onClick={() =>
                                            isValid && setSelectedCoupon(coupon)
                                        }
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                            coupon.discount_type ===
                                                            "percentage"
                                                                ? "bg-gradient-to-br from-green-100 to-emerald-100"
                                                                : "bg-gradient-to-br from-blue-100 to-cyan-100"
                                                        }`}
                                                    >
                                                        {coupon.discount_type ===
                                                        "percentage" ? (
                                                            <Percent className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <DollarSign className="w-5 h-5 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-gray-900">
                                                                {coupon.code}
                                                            </span>
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                            {coupon.description ||
                                                                `Get ${
                                                                    coupon.discount_type ===
                                                                    "percentage"
                                                                        ? `${coupon.discount_value}%`
                                                                        : `₹${coupon.discount_value}`
                                                                } discount`}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Conditions */}
                                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                                                    {coupon.minimum_purchase >
                                                        0 && (
                                                        <div className="flex items-center pl-12 gap-1">
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

                                            <div className="ml-2">
                                                {isSelected ? (
                                                    <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center">
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer with buttons in same line */}
                <div className="p-4">
                    {!manualEntryMode ? (
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium border-2 border-gray-200 hover:border-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApplySelected}
                                disabled={!selectedCoupon}
                                className="flex-1 px-4 py-3 bg-blue-950 text-white rounded-xl  transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {selectedCoupon ? (
                                    <>
                                        <span>Apply</span>
                                    </>
                                ) : (
                                    "Apply"
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium border-2 border-gray-200 hover:border-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleManualApply}
                                disabled={!manualCouponInput.trim()}
                                className="flex-1 px-4 py-3 bg-blue-900 text-white rounded-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                    {error && (
                        <p className="text-red-500 text-xs mt-2 text-center">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function EmptyCart() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
            <div className="relative text-center space-y-6 max-w-md">
                <div className="relative">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-900 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200">
                        <ShoppingBag className="w-16 h-16 text-white" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Add some items to get started!
                    </p>
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="px-8 py-3 bg-gradient-to-r from-blue-960 to-blue-600 text-white rounded-xl hover:from-blue-900 hover:to-blue-700 transition-all transform hover:scale-105 font-semibold shadow-lg shadow-blue-200"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}

const SuccessAnimation = () => (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
        <div className="relative flex flex-col items-center justify-center">
            {/* Animated circle + check */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 z-50 flex items-center justify-center mb-8 animate-scaleUp">
                <svg
                    className="w-20 h-20 text-white animate-draw-check"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                        strokeWidth: 2,
                        strokeDasharray: 50,
                        strokeDashoffset: 50,
                    }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>

            {/* Confetti */}
            <div className="absolute inset-0 overflow-visible pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full animate-confetti"
                        style={{
                            background: [
                                "#10B981",
                                "#3B82F6",
                                "#8B5CF6",
                                "#EC4899",
                                "#F59E0B",
                            ][i % 5],
                            top: `${Math.random() * 20 - 10}%`, // start ABOVE the SVG
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.15}s`,
                        }}
                    />
                ))}
            </div>

            {/* Text */}
            <div className="text-center space-y-3 animate-slide-up-delay mt-6">
                <h2 className="text-3xl font-bold text-gray-900">
                    Order Placed Successfully!
                </h2>
                <p className="text-gray-600 text-lg">
                    Thank you for your purchase
                </p>
                <p className="text-gray-500 text-sm">
                    Redirecting to dashboard...
                </p>
            </div>
        </div>
    </div>
);

export default function CheckoutSmall() {
    const { items, total, clearCart, getUnitPriceForPack, calculateItemPrice } =
        useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);

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

    const shippingCost = total > 500 ? 0 : 40; // Shipping is 40, free over 500
    const totalAmount = Math.round(total);
    const shippingCostAmount = Math.round(shippingCost); // Already round, but for consistency
    const discountAmount = couponApplied ? Math.round(total * 0.1) : 0;
    const finalTotalAmount = Math.round(
        totalAmount + shippingCostAmount - discountAmount
    );

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
        setAddressForm((prev) => ({
            ...prev,
            pinCode: cleanPin,
            city: "",
            state: "",
        }));
        setErrors((prev) => ({ ...prev, pinCode: "" }));

        if (cleanPin.length === 6) {
            setPinLoading(true);
            const { city, state } = await fetchCityState(cleanPin);
            setAddressForm((prev) => ({ ...prev, city, state }));
            if (!city || !state) {
                setErrors((prev) => ({
                    ...prev,
                    pinCode: "Service not available in this area.",
                }));
            }
            setPinLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddressForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const applyCoupon = () => {
        if (couponCode.toUpperCase() === "SAVE10") {
            setCouponApplied(true);
            setErrors((prev) => ({ ...prev, coupon: "" }));
        } else {
            setErrors((prev) => ({ ...prev, coupon: "Invalid coupon code" }));
        }
    };

    const handleCouponClick = () => {
        setShowCouponModal(true);
    };

    const validateShipping = () => {
        const newErrors = {};
        const { fullName, phone, addressLine1, city, state, pinCode } =
            addressForm;

        if (!fullName.trim()) newErrors.fullName = "Full name is required";
        if (!phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(phone))
            newErrors.phone = "Enter a valid 10-digit phone number";
        if (!addressLine1.trim())
            newErrors.addressLine1 = "Address is required";
        if (!pinCode.trim()) newErrors.pinCode = "PIN code is required";
        else if (!/^\d{6}$/.test(pinCode))
            newErrors.pinCode = "Enter a valid 6-digit PIN code";
        if (!city) newErrors.city = "City is required";
        if (!state) newErrors.state = "State is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (step === 1) {
            if (validateShipping()) setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            if (paymentMethod === "online") handleOnlinePayment();
            else handlePlaceOrder();
        }
    };

    const handleOnlinePayment = async () => {
        setIsProcessing(true);
        try {
            const { data } = await api.post("/payment/create-order", {
                amount: finalTotalAmount,
            });

            const options = {
                key: data.key,
                amount: data.amount,
                currency: "INR",
                name: "EnergeniX",
                image: ap,
                description: "Order Payment",
                order_id: data.orderId,
                handler: (response) =>
                    handlePlaceOrder(response.razorpay_payment_id),
                prefill: {
                    name: addressForm.fullName,
                    email: user?.email,
                    contact: addressForm.phone,
                },
                theme: { color: "#6366F1" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            rzp.on("payment.failed", () => {
                alert("Payment failed. Please try again.");
                setIsProcessing(false);
            });
        } catch (error) {
            alert("Error initializing payment. Please try again.");
            setIsProcessing(false);
        }
    };

    const handlePlaceOrder = async (paymentId = null) => {
        setIsProcessing(true);
        try {
            let totalWeightGrams = 0;
            let maxTotalLengthCm = 0;
            let maxTotalWidthCm = 0;
            let maxTotalHeightCm = 0;

            items.forEach((item) => {
                let actualPackKey = item.selectedPack || "Pack of 1";
                if (actualPackKey === "Pack of 4 (Family Discount)") {
                    actualPackKey = "Pack of 4";
                }
                const packDimensions =
                    item["weight&dimensio"] && item["weight&dimensio"][actualPackKey];

                if (packDimensions) {
                    totalWeightGrams += packDimensions.weight * item.quantity; // Weight is in grams
                    maxTotalLengthCm = Math.max(
                        maxTotalLengthCm,
                        packDimensions.length || 0
                    );
                    maxTotalWidthCm = Math.max(
                        maxTotalWidthCm,
                        packDimensions.width || 0
                    );
                    maxTotalHeightCm = Math.max(
                        maxTotalHeightCm,
                        packDimensions.height || 0
                    );
                } else {
                    console.warn(
                        "Could not find pack dimensions for item:",
                        item._id,
                        "with packKey:",
                        actualPackKey
                    );
                }
            });

            const orderPayload = {
                order_id: `ENX-${Date.now()}`, // Add order_id generation
                customer: {
                    name: addressForm.fullName,
                    email: user?.email, // Include email
                    phone: addressForm.phone,
                    alternativePhone: addressForm.alternativePhone || "", // Include alternativePhone
                    address_line_one: addressForm.addressLine1,
                    address_line_two: addressForm.addressLine2,
                    pincode: addressForm.pinCode,
                    city: addressForm.city,
                    state: addressForm.state,
                },
                items: items.map(item => ({
                    sku_number: item._id, // Use item._id
                    quantity: item.quantity,
                    pack_type: item.selectedPack || "Pack of 1",
                })),
                payment_type: paymentMethod === 'cod' ? 'COD' : 'PREPAID',
                cod_amount: paymentMethod === 'cod' ? String(finalTotalAmount) : "0", // Ensure cod_amount is a string
                weight: totalWeightGrams,
                length_cm: maxTotalLengthCm,
                width_cm: maxTotalWidthCm,
                height_cm: maxTotalHeightCm,
            };


            const { data } = await api.post("/orders/create", orderPayload);

            if (data.order) {
                clearCart();

                // Show success animation
                setShowSuccess(true);

                // Redirect to dashboard after animation
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000); // 2 seconds delay for animation
            } else {
                throw new Error(data.error || "Order creation failed");
            }
        } catch (error) {
            console.error("Order placement error:", error);
            alert(
                `An error occurred: ${
                    error.response?.data?.error || error.message
                }`
            );
            setIsProcessing(false);
        }
    };

    if (items.length === 0 && !isProcessing && !showSuccess) {
        return <EmptyCart />;
    }

    const renderStepContent = () => {
        switch (step) {
            case 1: // Address Form
                return (
                    <div className="space-y-4 animate-slide-up">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="w-5 h-5" />
                                <h3 className="font-semibold text-gray-800">
                                    Delivery Details
                                </h3>
                            </div>
                            <div className="space-y-4">
                                <Input
                                    label="Full Name"
                                    name="fullName"
                                    value={addressForm.fullName}
                                    onChange={handleChange}
                                    error={errors.fullName}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Phone"
                                        name="phone"
                                        type="tel"
                                        maxLength="10"
                                        value={addressForm.phone}
                                        onChange={handleChange}
                                        error={errors.phone}
                                    />
                                    <Input
                                        label="Alternative Phone"
                                        name="alternativePhone"
                                        type="tel"
                                        maxLength="10"
                                        value={addressForm.alternativePhone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <Input
                                    label="Address Line 1"
                                    name="addressLine1"
                                    value={addressForm.addressLine1}
                                    onChange={handleChange}
                                    error={errors.addressLine1}
                                    placeholder="House no., Building, Street"
                                />
                                <Input
                                    label="Address Line 2 (Optional)"
                                    name="addressLine2"
                                    value={addressForm.addressLine2}
                                    onChange={handleChange}
                                    placeholder="Area, Landmark, etc."
                                />
                                <div className="relative">
                                    <Input
                                        label="Pincode"
                                        name="pinCode"
                                        type="tel"
                                        maxLength="6"
                                        value={addressForm.pinCode}
                                        onChange={(e) =>
                                            handlePinChange(e.target.value)
                                        }
                                        error={errors.pinCode}
                                    />
                                    {pinLoading && (
                                        <Loader2 className="absolute right-3 top-10 w-5 h-5 text-blue-900 animate-spin" />
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="City"
                                        name="city"
                                        value={addressForm.city}
                                        readOnly
                                        error={errors.city}
                                    />
                                    <Input
                                        label="State"
                                        name="state"
                                        value={addressForm.state}
                                        readOnly
                                        error={errors.state}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2: // Order Summary
                return (
                    <>
                        <CouponModal
                            isOpen={showCouponModal}
                            onClose={() => setShowCouponModal(false)}
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            applyCoupon={applyCoupon}
                            user={user}
                            cartTotal={totalAmount}
                        />

                        <div className="space-y-4 animate-slide-up">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-blue-600" />{" "}
                                        Delivery Address
                                    </h3>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="font-medium text-sm"
                                    >
                                        Change
                                    </button>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm text-gray-700">
                                    <p className="font-semibold text-gray-900">
                                        {addressForm.fullName}
                                    </p>
                                    <p>
                                        {addressForm.addressLine1},{" "}
                                        {addressForm.addressLine2}
                                    </p>
                                    <p>
                                        {addressForm.city}, {addressForm.state}{" "}
                                        - {addressForm.pinCode}
                                    </p>
                                    <p className="mt-2 font-medium">
                                        {addressForm.phone}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Order Items
                                </h3>
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.cartItemId}
                                            className="flex gap-4 border-b border-gray-100 pb-4"
                                        >
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.p_name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg">
                                                    <Package className="w-10 h-10 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm line-clamp-2">
                                                    {item.p_name}
                                                </h4>
                                                <p className="text-xs text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="text-lg font-bold text-gray-800 mt-1">
                                                    ₹
                                                    {Math.round(
                                                        calculateItemPrice(item)
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Price Breakdown
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <PriceRow
                                        label="Subtotal"
                                        value={`₹${totalAmount.toLocaleString()}`}
                                    />
                                    <PriceRow
                                        label="Shipping"
                                        value={
                                            shippingCost > 0
                                                ? `₹${shippingCost}`
                                                : "FREE"
                                        }
                                        isGreen={shippingCost === 0}
                                    />
                                    {couponApplied && (
                                        <PriceRow
                                            label="Discount"
                                            value={`-₹${discountAmount.toLocaleString()}`}
                                            isGreen
                                        />
                                    )}
                                    {!couponApplied && (
                                        <div className="pt-2">
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
                                                        e.key === "Enter" &&
                                                        applyCoupon()
                                                    }
                                                    onClick={handleCouponClick}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm pr-20 cursor-pointer"
                                                    readOnly
                                                />
                                                <button
                                                    onClick={handleCouponClick}
                                                    className="absolute right-1 top-1 text-sm bg-blue-900 text-white font-semibold px-3 py-1 rounded-md"
                                                >
                                                    Browse
                                                </button>
                                            </div>
                                            {errors.coupon && (
                                                <p className="flex text-red-500 text-xs mt-1 gap-2">
                                                    <AlertTriangle size={12} className="mt-0.5" />
                                                    {errors.coupon}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-2 text-center">
                                                Click to browse available
                                                coupons
                                            </p>
                                        </div>
                                    )}
                                    <hr className="my-2" />
                                    <PriceRow
                                        label="Total Amount"
                                        value={`₹${finalTotalAmount.toLocaleString()}`}
                                        isBold
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 3: // Payment
                return (
                    <div className="space-y-4 animate-slide-up">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Payment Method
                            </h3>
                            <div className="space-y-3">
                                <PaymentOption
                                    id="online"
                                    label="Online Payment"
                                    desc="Card, UPI, Net Banking"
                                    icon={<CreditCard />}
                                    paymentMethod={paymentMethod}
                                    setPaymentMethod={setPaymentMethod}
                                />
                                <PaymentOption
                                    id="cod"
                                    label="Cash on Delivery"
                                    desc="Pay at your doorstep"
                                    icon={<Package />}
                                    paymentMethod={paymentMethod}
                                    setPaymentMethod={setPaymentMethod}
                                />
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Order Summary
                            </h3>
                            <div className="space-y-3 text-sm">
                                {couponApplied && (
                                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                                        <Gift className="w-4 h-4" />
                                        <div className="flex-1">
                                            <div className="font-semibold text-xs">
                                                Coupon "{couponCode}" applied!
                                            </div>
                                            <p className="text-xs text-green-600">
                                                You saved ₹
                                                {discountAmount.toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setCouponCode("");
                                                setCouponApplied(false);
                                            }}
                                            className="text-xs text-red-600 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                                <PriceRow
                                    label="Total Amount"
                                    value={`₹${finalTotalAmount.toLocaleString()}`}
                                    isBold
                                />
                                <p className="text-xs text-gray-500 text-center">
                                    Inclusive of all taxes
                                </p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {showSuccess && <SuccessAnimation />}

            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Header and Stepper */}
                <div className="px-0 py-3 z-10 bg-gray-50 sticky top-0">
                    <div className="flex items-center justify-between max-w-sm mx-auto">
                        {[1, 2, 3].map((s) => (
                            <React.Fragment key={s}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                            step >= s
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                    >
                                        {step > s ? (
                                            <CheckCircle2 size={40} />
                                        ) : (
                                            s
                                        )}
                                    </div>
                                    <span
                                        className={`text-xs mt-1 font-medium ${
                                            step >= s
                                                ? "text-black"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {
                                            ["Address", "Summary", "Payment"][
                                                s - 1
                                            ]
                                        }
                                    </span>
                                </div>
                                {s < 3 && (
                                    <div
                                        className={`flex-1 h-0.5 mx-0 -translate-y-2 ${
                                            step > s
                                                ? "bg-green-600"
                                                : "bg-gray-200"
                                        }`}
                                    ></div>
                                )}  
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
                    {renderStepContent()}
                </div>

                {/* Sticky Footer Button */}
                <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/80 backdrop-blur-sm border-t border-gray-100">
                    <button
                        onClick={handleNextStep}
                        disabled={
                            isProcessing ||
                            (step === 1 && pinLoading) ||
                            showSuccess
                        }
                        className={`w-full rounded-xl py-3.5 font-semibold text-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2
                        ${
                            isProcessing ||
                            (step === 1 && pinLoading) ||
                            showSuccess
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-950 text-white shadow-lg shadow-blue-200 hover:shadow-xl"
                        }`}
                    >
                        {isProcessing ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : null}
                        {isProcessing
                            ? "Processing..."
                            : step === 1
                            ? "Save & Continue"
                            : step === 2
                            ? "Proceed to Payment"
                            : `Pay ₹${finalTotalAmount.toLocaleString()}`}
                    </button>
                </div>
            </div>
        </>
    );
}

// Helper components for UI rendering
const Input = ({ label, name, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            name={name}
            className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 transition-all ${
                error
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-blue-900"
            }`}
            {...props}
        />
        {error && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                {error}
            </p>
        )}
    </div>
);

const PriceRow = ({ label, value, isGreen, isBold }) => (
    <div
        className={`flex justify-between items-center ${
            isBold ? "font-bold text-base" : ""
        }`}
    >
        <span className={`${isGreen ? "text-green-600" : "text-gray-600"}`}>
            {label}
        </span>
        <span
            className={`${isGreen ? "text-green-600" : "text-gray-900"} ${
                isBold ? "text-lg" : ""
            }`}
        >
            {value}
        </span>
    </div>
);

const PaymentOption = ({
    id,
    label,
    desc,
    icon,
    paymentMethod,
    setPaymentMethod,
}) => (
    <div
        onClick={() => setPaymentMethod(id)}
        className={`relative rounded-xl p-4 cursor-pointer transition-all border-2 ${
            paymentMethod === id
                ? "border-blue-700 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
        }`}
    >
        <div className="flex items-center gap-4">
            <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === id ? "border-blue-500" : "border-gray-300"
                }`}
            >
                {paymentMethod === id && (
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                )}
            </div>
            <div>
                <p className="font-semibold text-gray-800">{label}</p>
                <p className="text-sm text-gray-500">{desc}</p>
            </div>
            <div className="ml-auto text-gray-400">{icon}</div>
        </div>
    </div>
);
