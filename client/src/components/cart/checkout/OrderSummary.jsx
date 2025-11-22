import React from 'react';
import { Tag, Check } from 'lucide-react';

export default function OrderSummary({
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
}) {
    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 pb-4 border-b">
                    Order Summary
                </h3>

                <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                        <span>Subtotal ({items.length} items)</span>
                        <span className="font-medium">
                            ₹{total.toLocaleString()}
                        </span>
                    </div>

                    {step >= 2 && (
                        <div className="flex justify-between text-gray-700">
                            <span>Shipping</span>
                            <span className="font-medium">
                                {shippingCost === 0 ? (
                                    <span className="text-green-600">
                                        FREE
                                    </span>
                                ) : (
                                    `₹${shippingCost.toFixed(2)}`
                                )}
                            </span>
                        </div>
                    )}

                    {couponApplied && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount (SAVE10)</span>
                            <span className="font-medium">
                                -₹{discount.toFixed(2)}
                            </span>
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
                                onChange={(e) =>
                                    setCouponCode(
                                        e.target.value.toUpperCase()
                                    )
                                }
                                className="flex-1 border-2 border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={applyCoupon}
                                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all text-sm font-medium"
                            >
                                Apply
                            </button>
                        </div>
                        {errors.coupon && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.coupon}
                            </p>
                        )}
                    </div>
                )}

                {couponApplied && (
                    <div className="pt-4 border-t">
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                            <Tag className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                Coupon "SAVE10" applied!
                            </span>
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                            Total
                        </span>
                        <span className="text-2xl font-bold text-purple-600">
                            ₹{finalTotal.toLocaleString()}
                        </span>
                    </div>
                </div>

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
    );
}