import React from 'react';
import { CreditCard, Package, ChevronRight } from 'lucide-react';

export default function PaymentMethod({ paymentMethod, setPaymentMethod, handleBack, handleNext }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Payment Method
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Choose your preferred payment option
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <label
                    className={`flex items-center gap-4 p-2 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "cod"
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                    }`}
                >
                    <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) =>
                            setPaymentMethod(e.target.value)
                        }
                        className="w-5 h-5 text-purple-600"
                    />
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                            Cash on Delivery
                        </div>
                        <div className="text-sm text-gray-600">
                            Pay when you receive your order
                        </div>
                    </div>
                    <Package className="w-6 h-6 text-gray-400" />
                </label>

                <label
                    className={`flex items-center gap-4 p-2 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "online"
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                    }`}
                >
                    <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={(e) =>
                            setPaymentMethod(e.target.value)
                        }
                        className="w-5 h-5 text-purple-600"
                    />
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                            Online Payment
                        </div>
                        <div className="text-sm text-gray-600">
                            UPI, Cards, Net Banking & More
                        </div>
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
                    {paymentMethod === "online" ? (
                        <>
                            Pay Now
                            <CreditCard className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            Review Order
                            <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}