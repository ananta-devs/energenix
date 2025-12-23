import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../hooks/useCart.js";
import { useAuth } from "../../../hooks/useAuth.js";
import { dataService } from "../../../utils/dataService";
import api from "../../../utils/api";
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
    Ticket,
    ChevronUp,
    ChevronDown,
    Trash2,
    Banknote,
} from "lucide-react";

// ============================ Constants ============================
const SHIPPING_COST_COD = 100;
const SHIPPING_COST_FREE = 0;
const STEPS = ["Address", "Summary", "Payment"];
const STEP_LABELS = ["Address", "Summary", "Payment"];
const CONFETTI_COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"];

// ============================ Utility Functions ============================
const formatCurrency = (amount) => `₹${Math.round(amount).toLocaleString()}`;
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const validatePhone = (phone) => /^\d{10}$/.test(phone);
const validatePinCode = (pin) => /^\d{6}$/.test(pin);

// ============================ Helper Components ============================
const Input = React.memo(({ label, name, error, ...props }) => (
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
));

const PriceRow = React.memo(({ label, value, isGreen, isBold }) => (
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
));

const PaymentOption = React.memo(({
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
));

// ============================ CouponModal Component ============================
const CouponModal = React.memo(({
    isOpen,
    onClose,
    setCouponCode,
    applyCoupon,
    cartTotal,
}) => {
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

    const fetchAvailableCoupons = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dataService.getAvailableCoupons();
            setCoupons(response.data || []);
        } catch (error) {
            console.error("Error fetching coupons:", error);
            setCoupons([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleApplySelected = useCallback(() => {
        if (selectedCoupon) {
            setCouponCode(selectedCoupon.code);
            applyCoupon(selectedCoupon.code);
            onClose();
        }
    }, [selectedCoupon, setCouponCode, applyCoupon, onClose]);

    const handleManualApply = useCallback(() => {
        const trimmedInput = manualCouponInput.trim();
        if (trimmedInput) {
            const codeToApply = trimmedInput.toUpperCase();
            setCouponCode(codeToApply);
            applyCoupon(codeToApply);
            onClose();
        }
    }, [manualCouponInput, setCouponCode, applyCoupon, onClose]);

    const isCouponValidForCart = useCallback((coupon) => {
        if (coupon.minimum_purchase > 0 && cartTotal < coupon.minimum_purchase) {
            return false;
        }
        return true;
    }, [cartTotal]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Ticket className="w-5 h-5 text-blue-900" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {manualEntryMode ? "Enter Coupon Code" : "Available Coupons"}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {manualEntryMode ? "Type your code below" : "Choose a coupon to apply"}
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

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={() => setManualEntryMode(!manualEntryMode)}
                            className="text-sm font-medium text-blue-900 flex items-center gap-1"
                        >
                            {manualEntryMode ? "Browse Available Coupons" : "Use My Own"}
                            <ChevronDown className={`w-4 h-4 transition-transform ${manualEntryMode ? "rotate-180" : ""}`} />
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
                                    onChange={(e) => setManualCouponInput(e.target.value.toUpperCase())}
                                    placeholder="Enter your coupon code"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 text-blue-900 animate-spin mb-3" />
                            <p className="text-gray-600">Loading available coupons...</p>
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <Ticket className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No coupons available</h3>
                            <p className="text-gray-600">Check back later for special offers!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {coupons.map((coupon) => {
                                const isSelected = selectedCoupon?._id === coupon._id;
                                const isValid = isCouponValidForCart(coupon);

                                return (
                                    <div
                                        key={coupon._id}
                                        className={`border-2 rounded-xl p-3 transition-all ${
                                            isSelected
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:bg-gray-50"
                                        } ${
                                            !isValid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                        }`}
                                        onClick={() => isValid && setSelectedCoupon(coupon)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                        coupon.discount_type === "percentage"
                                                            ? "bg-green-100"
                                                            : "bg-blue-100"
                                                    }`}>
                                                        {coupon.discount_type === "percentage" ? (
                                                            <Percent className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <DollarSign className="w-5 h-5 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-gray-900">{coupon.code}</span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                coupon.discount_type === "percentage"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-blue-100 text-blue-700"
                                                            }`}>
                                                                {coupon.discount_type === "percentage"
                                                                    ? `${coupon.discount_value}% OFF`
                                                                    : `₹${coupon.discount_value} OFF`}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                            {coupon.description || `Get ${
                                                                coupon.discount_type === "percentage"
                                                                    ? `${coupon.discount_value}%`
                                                                    : `₹${coupon.discount_value}`
                                                            } discount`}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                                                    {coupon.minimum_purchase > 0 && (
                                                        <div className="flex items-center pl-12 gap-1">
                                                            <ShoppingBag className="w-3 h-3" />
                                                            <span>Min: ₹{coupon.minimum_purchase}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{formatDate(coupon.valid_until)}</span>
                                                    </div>
                                                </div>

                                                {!isValid && coupon.minimum_purchase > 0 && (
                                                    <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                                                        Add ₹{coupon.minimum_purchase - cartTotal} more to use this coupon
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

                <div className="p-4">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium border-2 border-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={manualEntryMode ? handleManualApply : handleApplySelected}
                            disabled={manualEntryMode ? !manualCouponInput.trim() : !selectedCoupon}
                            className="flex-1 px-4 py-3 bg-blue-950 text-white rounded-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

// ============================ EmptyCart Component ============================
const EmptyCart = React.memo(() => {
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
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your cart is empty</h2>
                    <p className="text-gray-600 text-lg">Add some items to get started!</p>
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="px-8 py-3 bg-blue-950 text-white rounded-xl font-semibold shadow-lg shadow-blue-200"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
});

// ============================ SuccessAnimation Component ============================
const SuccessAnimation = React.memo(() => {
    const confettiCount = 30;
    
    return (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
            <div className="relative flex flex-col items-center justify-center">
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <div className="absolute inset-0 overflow-visible pointer-events-none">
                    {Array.from({ length: confettiCount }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full animate-confetti"
                            style={{
                                background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                                top: `${Math.random() * 20 - 10}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.15}s`,
                            }}
                        />
                    ))}
                </div>

                <div className="text-center space-y-3 animate-slide-up-delay mt-6">
                    <h2 className="text-3xl font-bold text-gray-900">Order Placed Successfully!</h2>
                    <p className="text-gray-600 text-lg">Thank you for your purchase</p>
                    <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
                </div>
            </div>
        </div>
    );
});

// ============================ Main CheckoutSmall Component ============================
const CheckoutSmall = () => {
    const { items, total, clearCart, calculateItemPrice } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // State management
    const [step, setStep] = useState(1);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("online");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [isOrderItemsCollapsed, setIsOrderItemsCollapsed] = useState(true);
    const [pinLoading, setPinLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Address form state
    const addressFormDefaults = useMemo(() => ({
        fullName: user?.name || "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        alternativePhone: "",
        city: "",
        state: "",
        pinCode: "",
    }), [user]);

    const [addressForm, setAddressForm] = useState(addressFormDefaults);

    // Derived values
    const shippingCost = useMemo(() => 
        paymentMethod === "cod" ? SHIPPING_COST_COD : SHIPPING_COST_FREE, 
        [paymentMethod]
    );

    const cartTotal = useMemo(() => Math.round(total), [total]);
    const totalWithoutShipping = useMemo(() => cartTotal - discount, [cartTotal, discount]);
    const finalTotal = useMemo(() => 
        Math.round(cartTotal + shippingCost - discount), 
        [cartTotal, shippingCost, discount]
    );

    // Effects
    useEffect(() => {
        if (items.length > 2) {
            setIsOrderItemsCollapsed(true);
        } else {
            setIsOrderItemsCollapsed(false);
        }
    }, [items.length]);

    // API functions
    const fetchCityState = useCallback(async (pin) => {
        try {
            const res = await dataService.getPinCodeInfo(pin);
            return { 
                city: res.data.city || "", 
                state: res.data.state || "" 
            };
        } catch {
            return { city: "", state: "" };
        }
    }, []);

    const handlePinChange = useCallback(async (pin) => {
        const cleanPin = pin.replace(/\D/g, "");
        setAddressForm(prev => ({
            ...prev,
            pinCode: cleanPin,
            city: "",
            state: "",
        }));
        setErrors(prev => ({ ...prev, pinCode: "" }));

        if (cleanPin.length === 6) {
            setPinLoading(true);
            const { city, state } = await fetchCityState(cleanPin);
            setAddressForm(prev => ({ ...prev, city, state }));
            if (!city || !state) {
                setErrors(prev => ({
                    ...prev,
                    pinCode: "Service not available in this area.",
                }));
            }
            setPinLoading(false);
        }
    }, [fetchCityState]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    }, []);

    // Coupon management
    const applyCoupon = useCallback(async (code = couponCode) => {
        if (!code) {
            setErrors(prev => ({ ...prev, coupon: "Please enter a coupon code." }));
            return;
        }
        try {
            const { data } = await api.post('/coupons/apply', { 
                couponCode: code, 
                cartTotal 
            });

            setCouponCode(data.coupon.code);
            setAppliedCoupon(data.coupon);
            
            let discountValue = 0;
            if (data.coupon.discount_type === "fixed") {
                discountValue = data.coupon.discount_value;
            } else if (data.coupon.discount_type === "percentage") {
                discountValue = Math.round((cartTotal * data.coupon.discount_value) / 100);
            }
            setDiscount(discountValue);
            setErrors(prev => ({ ...prev, coupon: "" }));
        } catch (error) {
            setAppliedCoupon(null);
            setDiscount(0);
            setErrors(prev => ({
                ...prev,
                coupon: error.response?.data?.message || "Invalid coupon",
            }));
        }
    }, [couponCode, cartTotal]);

    const removeCoupon = useCallback(() => {
        setCouponCode("");
        setAppliedCoupon(null);
        setDiscount(0);
        setErrors(prev => ({ ...prev, coupon: "" }));
    }, []);

    // Validation
    const validateShipping = useCallback(() => {
        const newErrors = {};
        const { fullName, phone, addressLine1, city, state, pinCode } = addressForm;

        if (!fullName.trim()) newErrors.fullName = "Full name is required";
        if (!phone.trim()) newErrors.phone = "Phone number is required";
        else if (!validatePhone(phone)) newErrors.phone = "Enter a valid 10-digit phone number";
        if (!addressLine1.trim()) newErrors.addressLine1 = "Address is required";
        if (!pinCode.trim()) newErrors.pinCode = "PIN code is required";
        else if (!validatePinCode(pinCode)) newErrors.pinCode = "Enter a valid 6-digit PIN code";
        if (!city) newErrors.city = "City is required";
        if (!state) newErrors.state = "State is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [addressForm]);

    // Step navigation
    const handleNextStep = useCallback(() => {
        if (step === 1) {
            if (validateShipping()) setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            if (paymentMethod === "online") handleOnlinePayment();
            else handlePlaceOrder();
        }
    }, [step, validateShipping, paymentMethod]);

    // Payment handling
    const handleOnlinePayment = useCallback(async () => {
        setIsProcessing(true);
        try {
            const { data } = await dataService.createOrder(finalTotal);

            const options = {
                key: data.key,
                amount: data.amount,
                currency: "INR",
                name: "EnergeniX",
                image: "https://res.cloudinary.com/djva05hfi/image/upload/v1766247498/logo-razorp_sucina.jpg",
                description: "Order Payment",
                order_id: data.orderId,
                handler: (response) => handlePlaceOrder(response.razorpay_payment_id),
                prefill: {
                    name: addressForm.fullName,
                    email: user?.email,
                    contact: addressForm.phone,
                },
                theme: { color: "#162556" },
                modal: {
                    ondismiss: () => setIsProcessing(false),
                },
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
    }, [finalTotal, addressForm, user]);

    const handlePlaceOrder = useCallback(async (paymentId = null) => {
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
                const packDimensions = item["weight&dimensio"]?.[actualPackKey];

                if (packDimensions) {
                    totalWeightGrams += packDimensions.weight * item.quantity;
                    maxTotalLengthCm = Math.max(maxTotalLengthCm, packDimensions.length || 0);
                    maxTotalWidthCm = Math.max(maxTotalWidthCm, packDimensions.width || 0);
                    maxTotalHeightCm = Math.max(maxTotalHeightCm, packDimensions.height || 0);
                }
            });

            const orderPayload = {
                order_id: `ENX-${Date.now()}`,
                customer: {
                    name: addressForm.fullName,
                    email: user?.email,
                    phone: addressForm.phone,
                    alternativePhone: addressForm.alternativePhone || "",
                    address_line_one: addressForm.addressLine1,
                    address_line_two: addressForm.addressLine2,
                    pincode: addressForm.pinCode,
                    city: addressForm.city,
                    state: addressForm.state,
                },
                items: items.map((item) => ({
                    sku_number: item._id,
                    quantity: item.quantity,
                    pack_type: item.selectedPack || "Pack of 1",
                })),
                payment_type: paymentMethod === "cod" ? "COD" : "PREPAID",
                cod_amount: paymentMethod === "cod" ? String(finalTotal) : "0",
                prepaid_amount: paymentMethod === "online" ? String(finalTotal) : "0",
                weight: totalWeightGrams,
                length_cm: maxTotalLengthCm,
                width_cm: maxTotalWidthCm,
                height_cm: maxTotalHeightCm,
                coupon: appliedCoupon ? { 
                    _id: appliedCoupon._id, 
                    code: appliedCoupon.code 
                } : undefined,
            };

            const { data } = await dataService.createClientOrder(orderPayload);

            if (data.order) {
                clearCart();
                setShowSuccess(true);

                setTimeout(() => {
                    window.location.replace("/dashboard");
                }, 2000);
            } else {
                throw new Error(data.error || "Order creation failed");
            }
        } catch (error) {
            console.error("Order placement error:", error);
            alert(`An error occurred: ${error.response?.data?.error || error.message}`);
            setIsProcessing(false);
        }
    }, [items, addressForm, user, paymentMethod, finalTotal, appliedCoupon, clearCart, navigate]);

    // Render functions
    const renderStepContent = useCallback(() => {
        switch (step) {
            case 1: // Address Form
                return (
                    <div className="space-y-4 animate-slide-up">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="w-5 h-5" />
                                <h3 className="font-semibold text-gray-800">Delivery Details</h3>
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
                                        onChange={(e) => handlePinChange(e.target.value)}
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
                            cartTotal={cartTotal}
                        />

                        <div className="space-y-4 animate-slide-up">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-blue-600" />
                                        Delivery Address
                                    </h3>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                    >
                                        Change
                                    </button>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm text-gray-700">
                                    <p className="font-semibold text-gray-900">{addressForm.fullName}</p>
                                    <p>{addressForm.addressLine1}, {addressForm.addressLine2}</p>
                                    <p>{addressForm.city}, {addressForm.state} - {addressForm.pinCode}</p>
                                    <p className="mt-2 font-medium">{addressForm.phone}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                        Order Items
                                    </h3>
                                    {items.length > 2 && (
                                        <button
                                            onClick={() => setIsOrderItemsCollapsed(!isOrderItemsCollapsed)}
                                            className="text-gray-500 hover:text-gray-700 transition"
                                        >
                                            {isOrderItemsCollapsed ? (
                                                <ChevronDown className="w-5 h-5" />
                                            ) : (
                                                <ChevronUp className="w-5 h-5" />
                                            )}
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {(isOrderItemsCollapsed && items.length > 2 ? items.slice(0, 2) : items).map((item) => (
                                        <div key={item.cartItemId} className="flex gap-4 border-b border-gray-100 pb-4">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.p_name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg">
                                                    <Package className="w-10 h-10 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm line-clamp-2">{item.p_name}</h4>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                <p className="text-lg font-bold text-gray-800 mt-1">
                                                    {formatCurrency(calculateItemPrice(item))}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {isOrderItemsCollapsed && items.length > 2 && (
                                        <button
                                            onClick={() => setIsOrderItemsCollapsed(false)}
                                            className="w-full text-center text-blue-600 hover:text-blue-800 mt-2 py-2"
                                        >
                                            Show {items.length - 2} more items
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <h3 className="font-semibold text-gray-800 mb-4">Price Breakdown</h3>
                                <div className="space-y-3 text-sm">
                                    <PriceRow label="Subtotal" value={formatCurrency(cartTotal)} />
                                    {appliedCoupon && (
                                        <PriceRow
                                            label={
                                                <span className="flex items-center gap-1">
                                                    Discount
                                                    <button
                                                        onClick={removeCoupon}
                                                        className="text-red-600 hover:text-red-700 p-1 -my-1 rounded-md transition-colors"
                                                        aria-label="Remove coupon"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            }
                                            value={`-${formatCurrency(discount)}`}
                                            isGreen
                                        />
                                    )}
                                    {!appliedCoupon && (
                                        <div className="pt-2">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Enter coupon code"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    onKeyPress={(e) => e.key === "Enter" && applyCoupon()}
                                                    onClick={() => setShowCouponModal(true)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm pr-20 cursor-pointer"
                                                    readOnly
                                                />
                                                <button
                                                    onClick={() => setShowCouponModal(true)}
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
                                                Click to browse available coupons
                                            </p>
                                        </div>
                                    )}
                                    <hr className="my-2" />
                                    <PriceRow
                                        label="Total Amount"
                                        value={formatCurrency(totalWithoutShipping)}
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
                            <h3 className="font-semibold text-gray-800 mb-4">Payment Method</h3>
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
                                    icon={<Banknote />}
                                    paymentMethod={paymentMethod}
                                    setPaymentMethod={setPaymentMethod}
                                />
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <PriceRow label="Subtotal" value={formatCurrency(cartTotal)} />
                                <PriceRow label="Coupon" value={`-${formatCurrency(discount)}`} isGreen />
                                <PriceRow
                                    label="Delivery Fee"
                                    value={shippingCost > 0 ? `+${formatCurrency(shippingCost)}` : "FREE"}
                                    isGreen={shippingCost === 0}
                                />
                                <PriceRow label="Total Amount" value={formatCurrency(finalTotal)} isBold />
                                <p className="text-xs text-gray-500 text-center">Inclusive of all taxes</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }, [
        step, addressForm, errors, pinLoading, showCouponModal, 
        couponCode, user, cartTotal, items, isOrderItemsCollapsed, 
        appliedCoupon, discount, paymentMethod, shippingCost, finalTotal,
        totalWithoutShipping, handleChange, handlePinChange, 
        applyCoupon, removeCoupon, calculateItemPrice
    ]);

    const footerButtonText = useMemo(() => {
        if (isProcessing) return "Processing...";
        switch (step) {
            case 1: return "Save & Continue";
            case 2: return "Proceed to Payment";
            case 3: return paymentMethod === "cod" ? "Place Order" : `Pay ${formatCurrency(finalTotal)}`;
            default: return "Continue";
        }
    }, [step, paymentMethod, finalTotal, isProcessing]);

    // Early returns
    if (items.length === 0 && !isProcessing && !showSuccess) {
        return <EmptyCart />;
    }

    return (
        <>
            {showSuccess && <SuccessAnimation />}

            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Header and Stepper */}
                <div className="px-0 py-3 z-10 bg-gray-50 sticky top-0">
                    <div className="flex items-center justify-between max-w-sm mx-auto">
                        {STEPS.map((_, index) => {
                            const stepNumber = index + 1;
                            const isActive = step >= stepNumber;
                            return (
                                <React.Fragment key={stepNumber}>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                            isActive ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                                        }`}>
                                            {step > stepNumber ? <CheckCircle2 size={40} /> : stepNumber}
                                        </div>
                                        <span className={`text-xs mt-1 font-medium ${
                                            isActive ? "text-black" : "text-gray-500"
                                        }`}>
                                            {STEP_LABELS[index]}
                                        </span>
                                    </div>
                                    {stepNumber < STEPS.length && (
                                        <div className={`flex-1 h-0.5 mx-0 -translate-y-2 ${
                                            step > stepNumber ? "bg-green-600" : "bg-gray-200"
                                        }`}></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
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
                        disabled={isProcessing || (step === 1 && pinLoading) || showSuccess}
                        className={`w-full rounded-xl py-3.5 font-semibold text-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2
                            ${
                                isProcessing || (step === 1 && pinLoading) || showSuccess
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-950 text-white shadow-lg shadow-blue-200 hover:shadow-xl"
                            }`}
                    >
                        {isProcessing && <Loader2 className="w-6 h-6 animate-spin" />}
                        {footerButtonText}
                    </button>
                </div>
            </div>
        </>
    );
};

export default React.memo(CheckoutSmall);