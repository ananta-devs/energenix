import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { MapPin, Package, CreditCard, Check, ChevronRight, ShoppingBag, Truck, Zap, Lock, Tag } from 'lucide-react';
import axios from 'axios';

export default function CheckoutFlow() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: ''
  });

  const [errors, setErrors] = useState({});
  const [pinLoading, setPinLoading] = useState(false);

  const shippingCost = shippingMethod === 'express' ? 29.99 : 0;
  const discount = couponApplied ? total * 0.1 : 0;
  const finalTotal = total + shippingCost - discount;

  const fetchCityState = async (pin) => {
    try {
      const res = await axios.get(`/api/pincode/${pin}`);
      return { city: res.data.city || '', state: res.data.state || '' };
    } catch {
      return { city: '', state: '' };
    }
  };

  const handlePinChange = async (pin) => {
    setAddressForm(prev => ({ ...prev, pinCode: pin }));
    setErrors(prev => ({ ...prev, pinCode: '' }));
    
    if (pin.length === 6) {
      setPinLoading(true);
      const { city, state } = await fetchCityState(pin);
      setAddressForm(prev => ({ ...prev, city, state }));
      setPinLoading(false);
    } else {
      setAddressForm(prev => ({ ...prev, city: '', state: '' }));
    }
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setCouponApplied(true);
      setErrors(prev => ({ ...prev, coupon: '' }));
    } else {
      setErrors(prev => ({ ...prev, coupon: 'Invalid coupon code' }));
    }
  };

  const validateShipping = () => {
    const newErrors = {};
    const { fullName, phone, addressLine1, city, state, pinCode } = addressForm;
    
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Enter valid 10-digit phone number';
    if (!addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!pinCode.trim()) newErrors.pinCode = 'PIN code is required';
    else if (!/^\d{6}$/.test(pinCode)) newErrors.pinCode = 'Enter valid 6-digit PIN code';
    if (!city) newErrors.city = 'City not found for this PIN';
    if (!state) newErrors.state = 'State not found for this PIN';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateShipping()) return;
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const orderPayload = {
      cartItems: items,
      shippingAddress: addressForm,
      shippingMethod,
      paymentMethod,
      total: finalTotal,
      couponCode: couponApplied ? couponCode : null
    };
    console.log('Order Payload:', orderPayload);

    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="text-center space-y-4">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300" />
          <h2 className="text-3xl font-bold text-gray-800">Your cart is empty</h2>
          <p className="text-gray-600">Add some items to get started!</p>
          <button onClick={() => navigate('/')} className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { icon: MapPin, label: 'Shipping', number: 1 },
    { icon: CreditCard, label: 'Payment', number: 2 },
    { icon: Package, label: 'Review', number: 3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Your information is safe with us
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Stepper */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                {steps.map((s, i) => {
                  const StepIcon = s.icon;
                  const isActive = step === s.number;
                  const isCompleted = step > s.number;
                  
                  return (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted ? 'bg-green-500 text-white shadow-lg scale-110' : 
                          isActive ? 'bg-purple-600 text-white shadow-lg scale-110' : 
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {isCompleted ? <Check className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                        </div>
                        <span className={`text-sm font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {s.label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${
                          step > s.number ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
                    <p className="text-gray-600 text-sm">Where should we deliver your order?</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={addressForm.fullName}
                      onChange={e => {
                        setAddressForm({ ...addressForm, fullName: e.target.value });
                        setErrors(prev => ({ ...prev, fullName: '' }));
                      }}
                      className={`w-full border-2 p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={addressForm.phone}
                      onChange={e => {
                        setAddressForm({ ...addressForm, phone: e.target.value });
                        setErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      className={`w-full border-2 p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                    <input
                      type="text"
                      placeholder="Street address, P.O. box"
                      value={addressForm.addressLine1}
                      onChange={e => {
                        setAddressForm({ ...addressForm, addressLine1: e.target.value });
                        setErrors(prev => ({ ...prev, addressLine1: '' }));
                      }}
                      className={`w-full border-2 p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.addressLine1 ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                    <input
                      type="text"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      value={addressForm.addressLine2}
                      onChange={e => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                      className="w-full border-2 border-gray-200 p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                    <input
                      type="text"
                      placeholder="700001"
                      maxLength="6"
                      value={addressForm.pinCode}
                      onChange={e => handlePinChange(e.target.value)}
                      className={`w-full border-2 p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.pinCode ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
                    {pinLoading && <p className="text-purple-600 text-sm mt-1">Fetching location...</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      placeholder="Auto-filled"
                      value={addressForm.city}
                      readOnly
                      className="w-full border-2 border-gray-200 p-3 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      placeholder="Auto-filled"
                      value={addressForm.state}
                      readOnly
                      className="w-full border-2 border-gray-200 p-3 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 font-medium shadow-lg"
                  >
                    Continue to Payment
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                    <p className="text-gray-600 text-sm">Choose your preferred payment option</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Cash on Delivery</div>
                      <div className="text-sm text-gray-600">Pay when you receive your order</div>
                    </div>
                    <Package className="w-6 h-6 text-gray-400" />
                  </label>

                  <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'online' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Online Payment</div>
                      <div className="text-sm text-gray-600">UPI, Cards, Net Banking & More</div>
                    </div>
                    <CreditCard className="w-6 h-6 text-gray-400" />
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 font-medium shadow-lg"
                  >
                    Review Order
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>
                    <p className="text-gray-600 text-sm">Double-check everything looks good</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.p_name}</div>
                        <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        ₹{(item.discount_price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Method */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">
                        {shippingMethod === 'express' ? 'Express Delivery' : 'Standard Delivery'}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </div>
                  <div className="text-gray-700 text-sm space-y-1">
                    <div>{addressForm.fullName} • {addressForm.phone}</div>
                    <div>{addressForm.addressLine1}</div>
                    {addressForm.addressLine2 && <div>{addressForm.addressLine2}</div>}
                    <div>{addressForm.city}, {addressForm.state} - {addressForm.pinCode}</div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 pb-4 border-b">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium">₹{total.toLocaleString()}</span>
                </div>
                
                {step >= 2 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                )}

                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (SAVE10)</span>
                    <span className="font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Coupon Code */}
              {step >= 2 && !couponApplied && (
                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 border-2 border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                  {errors.coupon && <p className="text-red-500 text-xs mt-1">{errors.coupon}</p>}
                </div>
              )}

              {couponApplied && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium">Coupon "SAVE10" applied!</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-purple-600">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping Options */}
              {step >= 2 && (
                <div className="pt-4 border-t space-y-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Shipping Method</div>
                  <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    shippingMethod === 'standard' ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={e => setShippingMethod(e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Standard</div>
                      <div className="text-xs text-gray-600">5-7 days • FREE</div>
                    </div>
                    <Truck className="w-5 h-5 text-gray-400" />
                  </label>

                  <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    shippingMethod === 'express' ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={e => setShippingMethod(e.target.value)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Express</div>
                      <div className="text-xs text-gray-600">2-3 days • ₹29.99</div>
                    </div>
                    <Zap className="w-5 h-5 text-orange-500" />
                  </label>
                </div>
              )}

              {/* Trust Badges */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-600" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-600" />
                    <span>Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-600" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-600" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}