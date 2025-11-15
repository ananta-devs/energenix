import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { SHIPPING_METHODS } from '../../data/constants';
import { ShoppingCart, MapPin, Package, CreditCard, Check } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');

  const shippingCost = shippingMethod === 'express' ? 29.99 : shippingMethod === 'overnight' ? 59.99 : 0;
  const finalTotal = total + shippingCost;

  const handlePlaceOrder = () => {
    // Mock order placement
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20 py-20 flex items-center">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-xl border border-gray-100 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything yet</p>
            <Link
              to="/category/all"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-950 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-950 bg-clip-text text-transparent mb-3">Secure Checkout</h1>
          <p className="text-gray-600">Complete your order in a few simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-16">
          {[
            { num: 1, label: 'Shipping' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Review' }
          ].map(({ num, label }, idx) => (
            <React.Fragment key={num}>
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold transition-all duration-300 ${step >= num ? 'bg-gradient-to-br from-purple-600 to-blue-950 text-white shadow-lg shadow-purple-500/30' : 'bg-white text-gray-400 border-2 border-gray-200'}`}>
                  {step > num ? <Check className="w-5 h-5" /> : num}
                </div>
                <span className={`text-xs mt-2 font-medium ${step >= num ? 'text-purple-600' : 'text-gray-400'}`}>{label}</span>
              </div>
              {idx < 2 && (
                <div className={`w-24 h-0.5 mx-4 mb-6 transition-all duration-300 ${step > num ? 'bg-gradient-to-r from-purple-600 to-blue-950' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-blue-950" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
                  <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all" />
                <input type="text" placeholder="Last Name" className="px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all" />
                <input type="email" placeholder="Email Address" className="px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all md:col-span-2" />
                <input type="text" placeholder="Street Address" className="px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all md:col-span-2" />
                <input type="text" placeholder="City" className="px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all" />
                <input type="text" placeholder="Postal Code" className="px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all" />
                <input type="tel" placeholder="Phone Number" className="px-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all md:col-span-2" />
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center mr-4">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Shipping Method</h2>
                  <p className="text-sm text-gray-500">Choose your preferred delivery speed</p>
                </div>
              </div>
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${shippingMethod === 'standard' ? 'border-purple-500 bg-purple-50/50 shadow-md' : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'}`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mr-4 w-5 h-5 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Prepaid</p>
                      <p className="text-sm text-gray-600">5-7 business days</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600 text-lg">FREE</span>
                </label>
                <label className={`flex items-center justify-between p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${shippingMethod === 'express' ? 'border-purple-500 bg-purple-50/50 shadow-md' : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'}`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mr-4 w-5 h-5 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Cash On Delivery</p>
                      <p className="text-sm text-gray-600">2-3 business days</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">29.99</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {items.map(item => (
                  <div key={item._id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <img src={item.image_urls && item.image_urls.length > 0 ? item.image_urls[0] : ''} alt={item.p_name} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.p_name}</h4>
                      <p className="text-xs text-gray-500 mb-2">Quantity: {item.quantity}</p>
                      <p className="font-bold text-purple-600">₹ {(item.discount_price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Have a coupon code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-950 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Apply
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">₹ {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Shipping</span>
                  <span className="font-semibold">{shippingCost === 0 ? <span className="text-green-600">FREE</span> : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-4 border-t-2 border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="bg-gradient-to-r from-purple-600 to-blue-950 bg-clip-text text-transparent">₹ {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-950 text-white py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Place Order</span>
                <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium">100% Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-500">SSL encrypted • Your data is protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}