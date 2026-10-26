/**
 * Wahaj Cafe — The Pizza Lab
 * Cart Drawer Component
 */

import React from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { FoodImage } from "./FoodImage";
import { formatPKR } from "../utils/whatsapp";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    cartCount,
    setIsCheckoutOpen
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md h-full bg-[#1A060A] border-l border-[#D4AF66]/30 shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF66]" />
            <h2 className="text-xl font-bold text-[#FFF4DF] font-heading">
              Your Order ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
            className="p-2 rounded-xl bg-[#10090B] hover:bg-[#500B19] text-[#FFF4DF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#26070D] border border-[#D4AF66]/30 flex items-center justify-center mx-auto mb-4 text-[#D4AF66]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#FFF4DF]">Your cart is empty</h3>
              <p className="mt-1 text-xs text-[#FFF4DF]/60 max-w-xs mx-auto">
                Explore our signature Pizza Lab creations, burgers, and mocktails to add items.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-2.5 rounded-xl bg-[#500B19] border border-[#D4AF66]/40 text-[#FFF4DF] font-semibold text-xs cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#10090B] border border-white/5 flex gap-3.5 items-center justify-between shadow-sm"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#D4AF66]/20">
                  <FoodImage
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#FFF4DF] truncate">
                    {item.name}
                  </h4>

                  {item.selectedSize && (
                    <div className="text-[11px] text-[#D4AF66] font-medium">
                      {item.selectedSize.name} ({item.selectedSize.sizeLabel})
                    </div>
                  )}

                  <div className="text-xs font-semibold text-[#FFF4DF]/80 mt-0.5">
                    {formatPKR(item.unitPrice)}
                  </div>
                </div>

                {/* Quantity Controls & Removal */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="text-[#FFF4DF]/40 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2 bg-[#26070D] px-2 py-1 rounded-lg border border-white/10">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-[#FFF4DF] hover:text-[#D4AF66] cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-[#FFF4DF] min-w-[14px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-[#FFF4DF] hover:text-[#D4AF66] cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#140507] space-y-4">
            <div className="space-y-1.5 text-xs text-[#FFF4DF]/80">
              <div className="flex justify-between">
                <span>Order Subtotal</span>
                <span className="font-bold text-[#FFF4DF]">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Delivery Charges</span>
                <span>FREE DELIVERY</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm sm:text-base font-black text-[#D4AF66]">
                <span>Total Payable</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF66] to-[#F3D99B] text-[#10090B] font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
