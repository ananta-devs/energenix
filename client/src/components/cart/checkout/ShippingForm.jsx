import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

export default function ShippingForm({
    addressForm,
    setAddressForm,
    errors,
    setErrors,
    pinLoading,
    handlePinChange,
    handleNext,
}) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Shipping Address
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Where should we deliver your order?
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        value={addressForm.fullName}
                        onChange={handleChange}
                        className={`w-full border-2 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.fullName
                                ? "border-red-500"
                                : "border-gray-200"
                        }`}
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.fullName}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="9876543210"
                        value={addressForm.phone}
                        onChange={handleChange}
                        className={`w-full border-2 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.phone
                                ? "border-red-500"
                                : "border-gray-200"
                        }`}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.phone}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Code *
                    </label>
                    <input
                        type="text"
                        name="pinCode"
                        placeholder="700001"
                        maxLength="6"
                        value={addressForm.pinCode}
                        onChange={(e) => handlePinChange(e.target.value)}
                        className={`w-full border-2 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.pinCode
                                ? "border-red-500"
                                : "border-gray-200"
                        }`}
                    />
                    {errors.pinCode && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.pinCode}
                        </p>
                    )}
                    {pinLoading && (
                        <p className="text-purple-600 text-sm mt-1">
                            Fetching location...
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alternative Number{" "}
                    </label>
                    <input
                        type="tel"
                        name="alternativePhone"
                        placeholder="9876543210"
                        value={addressForm.alternativePhone}
                        onChange={handleChange}
                        className={`w-full border-2 border-gray-200 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500}`}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1 *
                    </label>
                    <input
                        type="text"
                        name="addressLine1"
                        placeholder="Street address, P.O. box"
                        value={addressForm.addressLine1}
                        onChange={handleChange}
                        className={`w-full border-2 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            errors.addressLine1
                                ? "border-red-500"
                                : "border-gray-200"
                        }`}
                    />
                    {errors.addressLine1 && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.addressLine1}
                        </p>
                    )}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 2
                    </label>
                    <input
                        type="text"
                        name="addressLine2"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        value={addressForm.addressLine2}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                    </label>
                    <input
                        type="text"
                        name="city"
                        placeholder="Auto-filled"
                        value={addressForm.city}
                        readOnly
                        className="w-full border-2 border-gray-200 p-2 rounded-lg bg-gray-50 text-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                    </label>
                    <input
                        type="text"
                        name="state"
                        placeholder="Auto-filled"
                        value={addressForm.state}
                        readOnly
                        className="w-full border-2 border-gray-200 p-2 rounded-lg bg-gray-50 text-gray-600"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleNext}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 font-medium shadow-lg"
                >
                    Continue to Payment
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}