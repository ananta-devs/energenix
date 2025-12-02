import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContext.js';

export function CartProvider({ children }) {

  // Load cart from localStorage
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('cart_items');
    return stored ? JSON.parse(stored) : [];
  });

  const [isOpen, setIsOpen] = useState(false);

  // Generate unique cart item ID
  const generateCartItemId = (product, selectedPack) => {
    return `${product._id}_${selectedPack}`;
  };

  const addItem = (product, quantity = 1, shouldOpenDrawer = true, selectedPack = "Pack of 1") => {
    setItems(prev => {
      const cartItemId = generateCartItemId(product, selectedPack);
      const existing = prev.find(item => item.cartItemId === cartItemId);
      
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { 
        ...product, 
        quantity, 
        selectedPack,
        cartItemId 
      }];
    });
    if (shouldOpenDrawer) {
      setIsOpen(true);
    }
  };

  const removeItem = (cartItemId) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setItems(prev =>
      prev.map(item => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  // Calculate item price based on selected pack
  const calculateItemPrice = (item) => {
    const basePrice = item.discount_price;
    const pack = item.selectedPack || "Pack of 1";
    
    switch(pack) {
      case "Pack of 2":
        return basePrice * 2 * 0.85; // 15% discount
      case "Pack of 4 (Family Discount)":
        return basePrice * 4 * 0.80; // 20% discount
      default: // Pack of 1
        return basePrice;
    }
  };

  // Calculate totals based on pack prices
  const total = items.reduce((sum, item) => sum + calculateItemPrice(item) * item.quantity, 0);
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
        setIsOpen,
        calculateItemPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}