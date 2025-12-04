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

  const addItem = (product, quantity = 1, selectedPack = "Pack of 1", options = {}) => {
    const { shouldOpenDrawer = true, isBuyNow = false } = options;
    
    setItems(prev => {
      const cartItemId = generateCartItemId(product, selectedPack);
      const existing = prev.find(item => item.cartItemId === cartItemId);
      
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity, isBuyNow } // Update quantity and isBuyNow status
            : item
        );
      }
      return [...prev, { 
        ...product, 
        quantity, 
        selectedPack, // Use the passed in selectedPack
        cartItemId,
        isBuyNow
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
  
  const clearBuyNowItems = () => {
    setItems(prev => prev.filter(item => !item.isBuyNow));
  };

  // Calculate item price based on selected pack
  const calculateItemPrice = (item) => {
    const basePrice = item.discount_price;
    const pack = item.selectedPack || "Pack of 1";
    
    switch(pack) {
      case "Pack of 2":
        return Math.round(basePrice * 2 * 0.85); // 15% discount, rounded
      case "Pack of 4 (Family Discount)":
        return Math.round(basePrice * 4 * 0.80); // 20% discount, rounded
      default: // Pack of 1
        return Math.round(basePrice); // Rounded even for default
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
        clearBuyNowItems, // Expose the new function
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