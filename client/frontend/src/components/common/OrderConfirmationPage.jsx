import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 text-center">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
        <p className="text-gray-600 mb-8">Your order ID is: <span className="font-semibold">{orderId}</span></p>
        <Link
          to="/"
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
