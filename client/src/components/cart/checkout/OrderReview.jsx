import React from 'react';
import { Package, MapPin, Truck, Check } from 'lucide-react';

export default function OrderReview({
    items,
    shippingCost,
    addressForm,
    handleBack,
    handlePlaceOrder,
    isProcessing,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Review Your Order
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Double-check everything looks good
                    </p>
                </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item._id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                        <div className="flex-1">
                            <div className="font-medium text-gray-900">
                                {item.p_name}
                            </div>
                            <div className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                            </div>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                            ₹
                            {(
                                item.discount_price *
                                item.quantity
                            ).toLocaleString()}
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
                            Standard Delivery
                        </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                        {shippingCost === 0
                            ? "FREE"
                            : `₹${shippingCost.toFixed(2)}`}
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
                    <div>
                        {addressForm.fullName} •{" "}
                        {addressForm.phone}
                    </div>
                    <div>{addressForm.addressLine1}</div>
                    {addressForm.addressLine2 && (
                        <div>
                            {addressForm.addressLine2}
                        </div>
                    )}
                    <div>
                        {addressForm.city},{" "}
                        {addressForm.state} -{" "}
                        {addressForm.pinCode}
                    </div>
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
    );
}