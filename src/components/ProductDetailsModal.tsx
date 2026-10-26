/**
 * Wahaj Cafe — The Pizza Lab
 * Detailed Product Modal
 */

import React, { useEffect, useState } from "react";
import { X, Plus, Minus, Check, Sparkles, Flame, MessageSquare, AlertCircle } from "lucide-react";
import { MenuItem, MenuItemSize } from "../data/menu";
import { useCart } from "../context/CartContext";
import { FoodImage } from "./FoodImage";
import { formatPKR } from "../utils/whatsapp";
import { getImageEntry } from "../utils/imageManifest";

interface ProductDetailsModalProps {
  product: MenuItem | null;
  onClose: () => void;
  adminWhatsApp: string;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose, adminWhatsApp }) => {
  if (!product) return null;
  // keyed by product so size / quantity state resets for every product
  return <ProductDetailsDialog key={product.id} product={product} onClose={onClose} adminWhatsApp={adminWhatsApp} />;
};

const ProductDetailsDialog: React.FC<{ product: MenuItem; onClose: () => void; adminWhatsApp: string }> = ({
  product,
  onClose,
  adminWhatsApp
}) => {
  const { addToCart } = useCart();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  const [selectedSize, setSelectedSize] = useState<MenuItemSize | undefined>(() => {
    return product.sizes ? product.sizes[product.defaultSizeIndex ?? 0] : undefined;
  });
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const unitPrice = selectedSize ? selectedSize.price : (product.price ?? 0);
  const totalPrice = unitPrice * quantity;
  const isUnconfirmed = !product.priceConfirmed || (product.price === null && !selectedSize);

  const handleAdd = () => {
    const success = addToCart(product, selectedSize, quantity);
    if (success) {
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        onClose();
      }, 1000);
    }
  };

  const handleInquireOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Wahaj Cafe! I would like to inquire about "${product.name}" (${selectedSize ? selectedSize.name : "Regular"}). Is this available right now?`
    );
    window.open(`https://wa.me/${adminWhatsApp}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm modal-fade" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="modal-rise relative w-full max-w-2xl rounded-3xl bg-[#1A060A] border border-[#D4AF66]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details"
          autoFocus
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#10090B]/80 hover:bg-[#500B19] border border-[#D4AF66]/40 text-[#FFF4DF] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0">
          <FoodImage
            src={product.image}
            alt={product.imageAlt}
            badge={product.category}
            eager
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A060A] via-transparent to-black/30 pointer-events-none" />

          {(() => {
            const e = getImageEntry(product.id);
            if (!e?.representative) return null;
            return (
              <span className="absolute bottom-3 right-4 text-[10px] tracking-wide text-[#FFF4DF]/55 pointer-events-none">
                {e.kind === "3d-render" ? "3D render of this recipe" : "Representative photo"}
              </span>
            );
          })()}
          {product.isSpicy && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-600 text-rose-200 text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Spicy Specialty</span>
            </div>
          )}
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-semibold text-[#D4AF66] uppercase tracking-wider block mb-1">
                {product.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#FFF4DF] font-heading">
                {product.name}
              </h2>
            </div>

            <div>
              {isUnconfirmed ? (
                <div className="inline-flex items-center gap-1.5 text-amber-400 text-sm font-semibold bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-500/30">
                  <AlertCircle className="w-4 h-4" />
                  <span>Price Unconfirmed</span>
                </div>
              ) : (
                <div className="text-2xl font-black text-[#D4AF66]">
                  {formatPKR(unitPrice)}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#FFF4DF]/80 leading-relaxed">
            {product.description}
          </p>

          {/* Ingredients Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Ingredients & Recipe Notes</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-[#26070D] border border-[#D4AF66]/20 text-xs text-[#FFF4DF]/90 font-medium"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Pizza Size Selection if applicable */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[#D4AF66] uppercase tracking-wider mb-2">
                <span>Select Your Size</span>
                <span className="text-[#FFF4DF]/60">{selectedSize?.sizeLabel}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSize(s)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      selectedSize?.name === s.name
                        ? "bg-[#D4AF66] text-[#10090B] border-[#D4AF66] shadow-lg"
                        : "bg-[#10090B] border-white/10 text-[#FFF4DF]/80 hover:border-[#D4AF66]/40"
                    }`}
                  >
                    <div className="font-bold text-sm">{s.name}</div>
                    <div className="text-xs opacity-75">{s.sizeLabel}</div>
                    <div className="text-xs font-black mt-1">{formatPKR(s.price)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes if any */}
          {product.notes && (
            <div className="p-3.5 rounded-2xl bg-[#26070D]/60 border border-[#D4AF66]/20 text-xs text-[#FFF4DF]/70">
              <span className="text-[#D4AF66] font-semibold">Chef's Note:</span> {product.notes}
            </div>
          )}

          {/* Quantity & Actions Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 bg-[#10090B] px-4 py-2 rounded-2xl border border-white/10">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-8 h-8 rounded-lg bg-[#26070D] hover:bg-[#500B19] text-[#FFF4DF] flex items-center justify-center cursor-pointer transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-lg text-[#FFF4DF]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-8 h-8 rounded-lg bg-[#26070D] hover:bg-[#500B19] text-[#FFF4DF] flex items-center justify-center cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Main Add Button */}
            <button
              disabled={isUnconfirmed}
              onClick={handleAdd}
              className={`flex-1 w-full py-4 rounded-2xl font-bold text-base tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
                isUnconfirmed
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
                  : isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-gradient-to-r from-[#D4AF66] to-[#F3D99B] text-[#10090B] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Cart!</span>
                </>
              ) : isUnconfirmed ? (
                <span>Price Verification Pending</span>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add {quantity} to Cart • {formatPKR(totalPrice)}</span>
                </>
              )}
            </button>

            {/* Quick Ask WhatsApp */}
            <button
              onClick={handleInquireOnWhatsApp}
              title="Ask question about this dish directly on WhatsApp"
              className="p-4 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] cursor-pointer transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
