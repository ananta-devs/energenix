import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart.js";
import { useAuth } from "../../hooks/useAuth.js";
import api from "../../utils/api";
import ap from "../../assets/logo.svg";

import CheckoutHeader from "./checkout/CheckoutHeader.jsx";
import ProgressStepper from "./checkout/ProgressStepper.jsx";
import ShippingForm from "./checkout/ShippingForm.jsx";
import PaymentMethod from "./checkout/PaymentMethod.jsx";
import OrderReview from "./checkout/OrderReview.jsx";
import OrderSummary from "./checkout/OrderSummary.jsx";
import EmptyCart from "./checkout/EmptyCart.jsx";

export default function CheckoutFlow() {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth(); // Get user from useAuth
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isProcessing, setIsProcessing] = useState(false);

    const [addressForm, setAddressForm] = useState({
        fullName: "",
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
    const shippingCost = 100;
    const discount = couponApplied ? total * 0.1 : 0;
    const finalTotal = total + shippingCost - discount;

    const fetchCityState = async (pin) => {
        try {
            const res = await api.get(`/pincode/${pin}`); // Use api.get
            return { city: res.data.city || "", state: res.data.state || "" };
        } catch {
            return { city: "", state: "" };
        }
    };

    const handlePinChange = async (pin) => {
        setAddressForm((prev) => ({ ...prev, pinCode: pin }));
        setErrors((prev) => ({ ...prev, pinCode: "" }));

        if (pin.length === 6) {
            setPinLoading(true);
            const { city, state } = await fetchCityState(pin);
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

    const handleBack = () => setStep(step - 1);

    const handleOnlinePayment = async () => {
        try {
            const {
                data: { orderId, key },
            } = await api.post("/payment/create-order", { // Use api.post
                amount: finalTotal,
            });

            const options = {
                key,
                amount: finalTotal * 100,
                currency: "INR",
                name: "EnergeniX",
                image: ap,
                description: "Test Transaction",
                order_id: orderId,
                handler: async function (response) {
                    const {
                        razorpay_payment_id,
                        razorpay_order_id,
                        razorpay_signature,
                    } = response;
                    try {
                        const { data } = await api.post( // Use api.post
                            "/payment/verify",
                            {
                                razorpay_payment_id,
                                razorpay_order_id,
                                razorpay_signature,
                            }
                        );
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
                items: items.map(item => ({
                    name: item.name,
                    sku_number: item._id, // Assuming item._id is the SKU
                    quantity: item.quantity,
                    unit_price: item.discount_price,
                    pack_type: item.selectedPack.toUpperCase().replace(/ /g, '_'),
                })),
                payment_type: paymentMethod === "cod" ? "COD" : "Prepaid",
                cod_amount: paymentMethod === "cod" ? String(finalTotal) : "0",
                weight_kg: 0.5, // Hardcoded weight
                length_cm: 20,  // Hardcoded dimensions
                width_cm: 15,
                height_cm: 10,
            };
            
    
            const { data } = await api.post("/orders/create", orderPayload);
    
            if (data.order) {
                clearCart();
                navigate(`/order-confirmation/${data.order.order_id}`);
            } else {
                throw new Error(data.error || "Order creation failed");
            }
        } catch (error) {
            console.error("Order placement error:", error);
            alert(`An error occurred while placing the order: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <CheckoutHeader />
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <ProgressStepper step={step} />
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
                                shippingCost={shippingCost}
                                addressForm={addressForm}
                                handleBack={handleBack}
                                handlePlaceOrder={handlePlaceOrder}
                                isProcessing={isProcessing}
                            />
                        )}
                    </div>
                    <OrderSummary
                        items={items}
                        total={total}
                        step={step}
                        shippingCost={shippingCost}
                        couponApplied={couponApplied}
                        discount={discount}
                        couponCode={couponCode}
                        setCouponCode={setCouponCode}
                        applyCoupon={applyCoupon}
                        errors={errors}
                        finalTotal={finalTotal}
                    />
                </div>
            </div>
        </div>
    );
}