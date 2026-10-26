/**
 * Wahaj Cafe — The Pizza Lab
 * Cart State Management Context
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { MenuItem, MenuItemSize } from "../data/menu";
import { getPublicImageUrlForWhatsApp } from "../utils/imageManifest";

export interface CartItem {
  id: string; // unique cart entry key e.g. "crown-crust-pizza__Medium"
  productId: string;
  name: string;
  category: string;
  selectedSize?: MenuItemSize;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl: string;
  imageAlt: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: MenuItem, selectedSize?: MenuItemSize, quantity?: number) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "wahaj_cafe_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to persist cart:", e);
    }
  }, [cart]);

  const addToCart = (product: MenuItem, selectedSize?: MenuItemSize, quantity: number = 1): boolean => {
    // Unconfirmed price check: cannot be ordered
    if (!product.priceConfirmed || (product.price === null && !selectedSize)) {
      alert("This item currently has an unconfirmed price and cannot be ordered yet.");
      return false;
    }

    const effectiveSize = selectedSize || (product.sizes ? product.sizes[product.defaultSizeIndex ?? 0] : undefined);
    const unitPrice = effectiveSize ? effectiveSize.price : (product.price ?? 0);

    if (unitPrice <= 0) {
      alert("Invalid price configuration for this item.");
      return false;
    }

    const cartKey = effectiveSize ? `${product.id}__${effectiveSize.name}` : product.id;
    const imageUrl = getPublicImageUrlForWhatsApp(product.id);

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          lineTotal: newQty * existing.unitPrice
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartKey,
          productId: product.id,
          name: product.name,
          category: product.category,
          selectedSize: effectiveSize,
          unitPrice,
          quantity,
          lineTotal: quantity * unitPrice,
          imageUrl,
          imageAlt: product.imageAlt
        };
        return [...prev, newItem];
      }
    });

    return true;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: newQuantity,
            lineTotal: newQuantity * item.unitPrice
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
