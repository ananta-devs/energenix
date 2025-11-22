import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmptyCart() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <div className="text-center space-y-4">
                <ShoppingBag className="w-24 h-24 mx-auto text-gray-300" />
                <h2 className="text-3xl font-bold text-gray-800">
                    Your cart is empty
                </h2>
                <p className="text-gray-600">
                    Add some items to get started!
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}