import React, { useState, useEffect, useCallback } from 'react';
import { CartContext } from './CartContext.js';

export function CartProvider({ children }) {

  // Load cart from localStorage
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('cart_items');
    if (!stored) return [];
    
    const parsedItems = JSON.parse(stored);
    
    // One-time migration for items that don't have the 'image' property
    const migratedItems = parsedItems.map(item => {
      if (!item.image && item.image_urls && item.image_urls.length > 0) {
        return { ...item, image: item.image_urls[0] };
      }
      return item;
    });

    return migratedItems;
  });

  const [isOpen, setIsOpen] = useState(false);

  // Generate unique cart item ID
  const generateCartItemId = (product, selectedPack) => {
    return `${product._id}_${selectedPack}`;
  };

  const addItem = useCallback((product, quantity = 1, selectedPack = "Pack of 1", options = {}) => {
    if (product.current_stock === 0) return;
    const { shouldOpenDrawer = true, isBuyNow = false } = options;

    const hydratedProduct = { ...product };
    if (!hydratedProduct.image && hydratedProduct.image_urls && hydratedProduct.image_urls.length > 0) {
        hydratedProduct.image = hydratedProduct.image_urls[0];
    }
    
    setItems(prev => {
      const cartItemId = generateCartItemId(hydratedProduct, selectedPack);
      
      // If this is a Buy Now, we reset isBuyNow for all other items
      // If this is a regular Add to Cart, we also reset all isBuyNow flags to false
      const updatedPrev = prev.map(item => ({ ...item, isBuyNow: false }));
      
      const existing = updatedPrev.find(item => item.cartItemId === cartItemId);
      
      if (existing) {
        return updatedPrev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: isBuyNow ? quantity : item.quantity + quantity, isBuyNow } // For Buy Now, we use the selected quantity. For Add to Cart, we increment.
            : item
        );
      }
      return [...updatedPrev, { 
        ...hydratedProduct, 
        quantity, 
        selectedPack, // Use the passed in selectedPack
        cartItemId,
        isBuyNow
      }];
    });

    if (shouldOpenDrawer) {
      setIsOpen(true);
    }
  }, []);

  const removeItem = useCallback((cartItemId) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId, quantity) => {
    setItems(prev => {
      if (quantity <= 0) {
        return prev.filter(item => item.cartItemId !== cartItemId);
      }
      return prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems(prev => {
      const hasBuyNow = prev.some(item => item.isBuyNow);
      if (hasBuyNow) {
        return prev.filter(item => !item.isBuyNow);
      }
      return [];
    });
  }, []);
  
  const clearBuyNowItems = useCallback(() => {
    setItems(prev => prev.filter(item => !item.isBuyNow));
  }, []);

  const resetBuyNowFlags = useCallback(() => {
    setItems(prev => prev.map(item => ({ ...item, isBuyNow: false })));
  }, []);

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

  // New function to get the price per unit for a given pack
  const getUnitPriceForPack = (item) => {
    const basePrice = item.discount_price;
    const pack = item.selectedPack || "Pack of 1";
    
    switch(pack) {
      case "Pack of 2":
        return Math.round(basePrice * 0.85); // 15% discount
      case "Pack of 4 (Family Discount)":
        return Math.round(basePrice * 0.80); // 20% discount
      default: // Pack of 1
        return Math.round(basePrice);
    }
  };

  // Calculate totals based on pack prices
  const total = items.reduce((sum, item) => sum + calculateItemPrice(item) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Buy Now specific items and total for checkout
  const buyNowItems = items.filter(item => item.isBuyNow);
  const checkoutItems = buyNowItems.length > 0 ? buyNowItems : items;
  const checkoutTotal = checkoutItems.reduce((sum, item) => sum + calculateItemPrice(item) * item.quantity, 0);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        checkoutItems,
        checkoutTotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearBuyNowItems, // Expose the new function
        resetBuyNowFlags,
        total,
        itemCount,
        isOpen,
        setIsOpen,
        calculateItemPrice,
        getUnitPriceForPack // Export the new function
      }}
    >
      {children}
    </CartContext.Provider>
  );
}