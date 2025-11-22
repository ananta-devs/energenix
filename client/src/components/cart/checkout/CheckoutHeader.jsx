import React from 'react';
import { Lock } from 'lucide-react';

export default function CheckoutHeader() {
    return (
        <div className="text-center mb-3">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Secure Checkout
            </h1>
            <p className="text-gray-600 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Your information is safe with us
            </p>
        </div>
    );
}