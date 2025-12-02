import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen, calculateItemPrice } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const handleCheckout = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-60"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-60 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6 cursor-pointer" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => {
                  const itemPrice = calculateItemPrice(item);
                  return (
                    <div key={item.cartItemId} className="flex gap-4 pb-4 border-b">
                      <img
                        src={item.image_urls && item.image_urls.length > 0 ? item.image_urls[0] : ''}
                        alt={item.p_name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{item.p_name}</h3>
                        <p className="text-blue-950 font-semibold">₨. {Math.round(itemPrice).toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.selectedPack && item.selectedPack !== "Pack of 1" ? item.selectedPack : "Pack of 1"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-semibold px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeItem(item.cartItemId)}
                            className="ml-auto p-1 hover:bg-red-50 rounded text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="font-medium">₨. {total.toLocaleString()}</span>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/checkout"
                  onClick={handleCheckout}
                  className="flex-1 text-center bg-blue-950 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition cursor-pointer"
                >
                  Checkout
                </Link>

                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}