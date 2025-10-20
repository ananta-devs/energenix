import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { ShoppingCart, MapPin, Package, CreditCard, Check } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link
            to="/category/all"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map(num => (
            <React.Fragment key={num}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= num ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {num}
              </div>
              {num < 3 && (
                <div className={`w-24 h-1 ${step > num ? 'bg-purple-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-bold">Shipping Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="px-4 py-3 border rounded-lg outline-none focus:border-purple-600" />
                <input type="text" placeholder="Last Name" className="px-4 py-3 border rounded-lg outline-none focus:border-purple-600" />
                <input type="email" placeholder="Email" className="px-4 py-3 border rounded-lg outline-none focus:border-purple-600 md:col-span-2" />
                <input type="text" placeholder="Address" className="px-4 py-3 border rounded-lg outline-none focus:border-purple-600 md:col-span-2" />
                <input type="text" placeholder="City" className="px-4 py-3 border rounded-lg outline-none focus:border-purple-600" />
                <input type="text" placeholder="Postal Code" className="px-4 py-3 border rounded-lg outline-none focus:border-purple-600" />
                <input type="tel" placeholder="Phone" className="px-4 py-3 border rounded-lg outline-none focus:border-purple-600 md:col-span-2" />
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <Package className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-bold">Shipping Method</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-purple-600">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-semibold">Standard Shipping</p>
                      <p className="text-sm text-gray-600">5-7 business days</p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">FREE</span>
                </label>
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-purple-600">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-semibold">Express Shipping</p>
                      <p className="text-sm text-gray-600">2-3 business days</p>
                    </div>
                  </div>
                  <span className="font-semibold">$29.99</span>
                </label>
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-purple-600">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping"
                      value="overnight"
                      checked={shippingMethod === 'overnight'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-semibold">Overnight Shipping</p>
                      <p className="text-sm text-gray-600">Next business day</p>
                    </div>
                  </div>
                  <span className="font-semibold">$59.99</span>
                </label>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-bold">Payment Information</h2>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Card Number" className="w-full px-4 py-3 border rounded-lg outline-none focus:border-purple-600" />
                <input type="text" placeholder="Cardholder Name" className="w-full px-4 py-3 border rounded-lg outline-none focus:border-purple-600" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" className="px-4 py-3 border rounded-lg outline-none focus:border-purple-600" />
                  <input type="text" placeholder="CVV" className="px-4 py-3 border rounded-lg outline-none focus:border-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.images[0]} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-purple-600 font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg text-sm outline-none focus:border-purple-600"
                  />
                  <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200">
                    Apply
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-purple-600">${finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
              >
                Place Order
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t text-center text-xs text-gray-600">
                <Check className="w-5 h-5 mx-auto mb-2 text-green-500" />
                <p>Secure checkout • SSL encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
