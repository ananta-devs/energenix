import React, { useState } from "react";
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
} from "lucide-react";

function EmptyCart() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4">
            <div className="relative text-center space-y-6 max-w-md">
                <div className="relative">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-200">
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
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-semibold shadow-lg shadow-purple-200"
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
                            top: `${Math.random() * 20 - 10}%`,    // start ABOVE the SVG
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
                <p className="text-gray-600 text-lg">Thank you for your purchase</p>
                <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
            </div>
        </div>
    </div>
);


export default function CheckoutSmall() {
    const { items, total, clearCart, getUnitPriceForPack, calculateItemPrice } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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
                handler: (response) => handlePlaceOrder(response.razorpay_payment_id),
                prefill: { name: addressForm.fullName, email: user?.email, contact: addressForm.phone },
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
                cod_amount: paymentMethod === "cod" ? finalTotalAmount : 0,
                payment_id: paymentId, // Keep this for online payments
                weight_kg: 0.5, // Add weight and dimensions like in CheckoutLarge
                length_cm: 20,
                width_cm: 15,
                height_cm: 10,
            };

            console.log("Order Payload being sent:", orderPayload);

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
                                        <Loader2 className="absolute right-3 top-10 w-5 h-5 text-purple-600 animate-spin" />
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
                                    {addressForm.city}, {addressForm.state} -{" "}
                                    {addressForm.pinCode}
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
                                        key={item._id}
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
                                        value={`-₹${discount.toLocaleString()}`}
                                        isGreen
                                    />
                                )}
                                {!couponApplied && (
                                    <div className="pt-2">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Coupon Code"
                                                value={couponCode}
                                                onChange={(e) =>
                                                    setCouponCode(
                                                        e.target.value.toUpperCase()
                                                    )
                                                }
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm pr-20"
                                            />
                                            <button
                                                onClick={applyCoupon}
                                                className="absolute right-1 top-1 text-sm bg-gray-200 text-blue-800 font-semibold px-3 py-1 rounded-md"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {errors.coupon && (
                                            <p className="text-red-500 text-xs mt-1">
                                                <AlertTriangle size={12} />
                                                {errors.coupon}
                                            </p>
                                        )}
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
                <div className="px-0 py-3 z-10 bg- sticky top-0">
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
                                            <CheckCircle2 size={25} />
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
                                        className={`flex-1 h-0.5 mx-0  ${
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
                                : "bg-blue-950 text-white shadow-lg shadow-purple-200 hover:shadow-xl"
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
                ? "border-blue-700 bg-purple-50"
                : "border-gray-200 hover:bg-gray-50"
        }`}
    >
        <div className="flex items-center gap-4">
            <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === id
                        ? "border-blue-500"
                        : "border-gray-300"
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
