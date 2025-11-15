import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext.js';

export function CartProvider({ children }) {

  // Load cart from localStorage
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('cart_items');
    return stored ? JSON.parse(stored) : [];
  });

  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product, quantity = 1, shouldOpenDrawer = true) => {
    setItems(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    if (shouldOpenDrawer) {
      setIsOpen(true);
    }
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prev =>
      prev.map(item => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  // Calculate totals
  const total = items.reduce((sum, item) => sum + item.discount_price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isOpen,
        setIsOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
