import React, { useState } from 'react';
import { ChevronLeft, MapPin, Home, Briefcase, CreditCard, Truck, CheckCircle2, Package, Shield, Lock, Gift, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function CheckoutSmall() {
  const [currentStep, setCurrentStep] = useState(1);
  const [addressData, setAddressData] = useState({
    fullName: '',
    phone: '',
    phoneAlt: '',
    pincode: '',
    state: '',
    city: '',
    building: '',
    road: '',
    landmark: '',
    addressType: 'home'
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressSubmit = () => {
    if (addressData.fullName && addressData.phone && addressData.pincode && addressData.building) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setCurrentStep(2);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleOrderSummaryNext = () => {
    setCurrentStep(3);
  };

  const handlePaymentSubmit = () => {
    if (paymentMethod) {
      setIsLoading(true);
      // Simulate order processing
      setTimeout(() => {
        setOrderPlaced(true);
        setIsLoading(false);
      }, 800);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto animate-fade-in">
          <div className="relative inline-flex mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 animate-scale-up">
              <CheckCircle2 className="w-20 h-20 text-white" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text mb-4">
            <h1 className="text-4xl font-bold text-transparent mb-2">Order Confirmed!</h1>
          </div>
          
          <p className="text-gray-600 text-lg mb-8 px-4">Your order has been successfully placed. We've sent a confirmation to your email.</p>
          
          {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 mb-8 transform transition-all hover:scale-[1.02]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-medium">Order ID</span>
                <span className="font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full text-sm">
                  #OD{Math.floor(Math.random() * 1000000)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-medium">Delivery to</span>
                <span className="font-semibold text-gray-800">{addressData.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-medium">Payment</span>
                <span className="font-semibold text-gray-800">
                  {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-medium">Estimated Delivery</span>
                <span className="font-semibold text-gray-800 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Tomorrow
                </span>
              </div>
            </div>
          </div> */}
          
          <div className="flex gap-3">
                       <Link to="/dashboard">
                            <button className="flex-1 bg-white text-gray-700 rounded-xl py-3 font-semibold border border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
              Track Order
            </button>
            </Link> 
            <Link to="/category/all">
                            <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl py-3 font-semibold hover:shadow-lg transition-all active:scale-95">
              Continue Shopping
            </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Progress Steps - Fixed at top */}
      <div className="px-4 py-1 z-50 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${currentStep > step ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' :
                    currentStep === step ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-200' :
                    'bg-gray-100 border border-gray-200'
                  }
                `}>
                  {currentStep > step ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span className={`font-medium ${currentStep >= step ? 'text-white' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium transition-colors ${
                  currentStep >= step ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {step === 1 ? 'Address' : step === 2 ? 'Summary' : 'Payment'}
                </span>
              </div>
              {step < 3 && (
                <div className="flex-1 h-1 mx-2 relative">
                  <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    currentStep > step ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-200'
                  }`}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content - Scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
        {/* Step 1: Address Form */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Delivery Details</h3>
                  <p className="text-sm text-gray-500">Enter your complete address</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressData.fullName}
                    onChange={(e) => setAddressData({...addressData, fullName: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="John Smith"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={addressData.phone}
                      onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternative Phone
                    </label>
                    <input
                      type="tel"
                      value={addressData.phoneAlt}
                      onChange={(e) => setAddressData({...addressData, phoneAlt: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressData.pincode}
                    onChange={(e) => setAddressData({...addressData, pincode: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="110001"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={addressData.state}
                      onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-600 cursor-not-allowed"
                      placeholder="Auto-detected"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={addressData.city}
                      onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-600 cursor-not-allowed"
                      placeholder="Auto-detected"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressData.building}
                    onChange={(e) => setAddressData({...addressData, building: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="House no., Building, Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressData.road}
                    onChange={(e) => setAddressData({...addressData, road: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Area, Landmark, etc."
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleAddressSubmit}
              disabled={!addressData.fullName || !addressData.phone || !addressData.pincode || !addressData.building || isLoading}
              className={`w-full rounded-xl py-4 font-semibold text-lg transition-all duration-300 active:scale-[0.98] ${
                addressData.fullName && addressData.phone && addressData.pincode && addressData.building && !isLoading
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 hover:shadow-xl'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                'Save & Continue'
              )}
            </button>
          </div>
        )}

        {/* Step 2: Order Summary */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Delivery Address</h3>
                    <p className="text-sm text-gray-500">Expected delivery: 5-7 days</p>
                  </div>
                </div>
                <button className="text-purple-600 font-medium text-sm hover:text-purple-700 transition-colors">
                  Change
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                <p className="font-semibold text-gray-900">{addressData.fullName}</p>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  {addressData.building}{addressData.road && `, ${addressData.road}`}
                  {addressData.landmark && `, ${addressData.landmark}`}
                  <br />
                  {addressData.city}, {addressData.state} {addressData.pincode}
                </p>
                <p className="text-gray-600 text-sm mt-2">{addressData.phone}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800">Order Items</h3>
                <span className="text-xs font-medium bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full">
                  Top Deal 🔥
                </span>
              </div>
              
              <div className="flex gap-4 pb-6 border-b border-gray-100">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=120&h=120&fit=crop&crop=center" 
                    alt="Product" 
                    className="w-24 h-24 object-cover rounded-xl shadow-sm"
                  />
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -77%
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">boAt Airdopes Alpha, 35H Battery, 13mm Drivers</h4>
                  <p className="text-xs text-gray-500 mb-3">Deep Blue • In the Ear</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[1,2,3,4].map(i => (
                        <span key={i} className="text-amber-400">★</span>
                      ))}
                      <span className="text-gray-300">★</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">4.0</span>
                    <span className="text-xs text-gray-400">(6.9L reviews)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Qty: 1</option>
                      <option>Qty: 2</option>
                      <option>Qty: 3</option>
                    </select>
                    <div className="text-right">
                      <div className="text-gray-400 line-through text-sm">₹3,490</div>
                      <div className="text-2xl font-bold text-gray-900">₹799</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-6">Price Breakdown</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Item Price</span>
                  <span className="font-medium text-gray-900">₹3,490</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">- ₹2,691</span>
                </div>
                <hr />
                
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₹815</div>
                  </div>
                </div>
                <div className="text-sm text-green-600 font-medium mt-1 text-center">
                    You saved ₹2,675!
                </div>
              </div>
            </div>

            <button
              onClick={handleOrderSummaryNext}
              className="sticky bottom-0 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl py-4 font-semibold text-lg shadow-lg shadow-purple-200 hover:shadow-xl transition-all active:scale-[0.98]"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Payment Method</h3>
                  <p className="text-sm text-gray-500">Choose your preferred payment</p>
                </div>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 border-2 ${
                    paymentMethod === 'online' 
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {paymentMethod === 'online' && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        paymentMethod === 'online' ? 'border-purple-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'online' && (
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Online Payment</p>
                        <p className="text-sm text-gray-500">Pay now with card/UPI/net banking</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500">Secure</span>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 border-2 ${
                    paymentMethod === 'cod' 
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {paymentMethod === 'cod' && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        paymentMethod === 'cod' ? 'border-purple-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'cod' && (
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive the product</p>
                      </div>
                    </div>
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-6">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Items Total</span>
                  <span className="font-medium text-gray-900">₹815</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <span className="font-semibold text-lg text-gray-900">Total Amount</span>
                    <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">₹815</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-amber-500" />
                <p className="font-medium text-gray-800">Fast Checkout</p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                By continuing, you agree to our Terms of Service and acknowledge our Privacy Policy.
              </p>
            </div>

            <button
              onClick={handlePaymentSubmit}
              disabled={!paymentMethod || isLoading}
              className={`w-full rounded-xl py-4 font-semibold text-lg transition-all duration-300 active:scale-[0.98] ${
                paymentMethod && !isLoading
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 hover:shadow-xl'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Order...
                </span>
              ) : (
                `Place Order • ₹815`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}