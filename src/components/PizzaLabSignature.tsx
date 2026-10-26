/**
 * Wahaj Cafe — The Pizza Lab
 * Signature Creations Section
 */

import React, { useState } from "react";
import { Sparkles, Plus, Check, Info, Flame } from "lucide-react";
import { MenuItem, MenuItemSize, MENU_ITEMS } from "../data/menu";
import { useCart } from "../context/CartContext";
import { FoodImage } from "./FoodImage";
import { formatPKR } from "../utils/whatsapp";

interface PizzaLabSignatureProps {
  onSelectProduct: (product: MenuItem) => void;
}

export const PizzaLabSignature: React.FC<PizzaLabSignatureProps> = ({ onSelectProduct }) => {
  const { addToCart } = useCart();
  const signatureItems = MENU_ITEMS.filter((item) => item.category === "Signature Pizza Lab");

  // Track selected size per item
  const [selectedSizes, setSelectedSizes] = useState<Record<string, MenuItemSize>>(() => {
    const map: Record<string, MenuItemSize> = {};
    signatureItems.forEach((item) => {
      if (item.sizes && item.sizes.length > 0) {
        map[item.id] = item.sizes[item.defaultSizeIndex ?? 0];
      }
    });
    return map;
  });

  const [addedItemKey, setAddedItemKey] = useState<string | null>(null);

  const handleSizeChange = (itemId: string, size: MenuItemSize) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const size = selectedSizes[item.id];
    const success = addToCart(item, size, 1);
    if (success) {
      setAddedItemKey(item.id);
      setTimeout(() => setAddedItemKey(null), 1500);
    }
  };

  return (
    <section id="signature-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#500B19]/60 border border-[#D4AF66]/40 text-[#F3D99B] text-xs font-semibold tracking-wider uppercase mb-3">
          <Flame className="w-3.5 h-3.5 text-[#D4AF66]" />
          <span>The Science of Flavor</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFF4DF] font-heading">
          THE PIZZA LAB <span className="gold-gradient-text">SIGNATURES</span>
        </h2>

        <p className="mt-4 text-[#FFF4DF]/75 text-base sm:text-lg">
          Masterpieces designed by Wahaj Cafe’s culinary innovators. Handcrafted stuffed crown rims, kabab crust rings, and four-cheese eruptions.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {signatureItems.map((item) => {
          const currentSize = selectedSizes[item.id] || (item.sizes ? item.sizes[0] : undefined);
          const displayPrice = currentSize ? currentSize.price : (item.price ?? 0);
          const isJustAdded = addedItemKey === item.id;

          return (
            <div
              key={item.id}
              className="group relative rounded-3xl bg-[#1A060A] border border-[#D4AF66]/25 hover:border-[#D4AF66]/60 transition-all duration-300 shadow-xl overflow-hidden flex flex-col hover:-translate-y-1"
            >
              {/* Product Image Area */}
              <div className="relative h-64 w-full overflow-hidden">
                <FoodImage
                  src={item.image}
                  alt={item.imageAlt}
                  badge={item.isChefSpecial ? "Chef Special" : "Signature Lab"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onClick={() => onSelectProduct(item)}
                />

                {/* Info Button Overlay */}
                <button
                  onClick={() => onSelectProduct(item)}
                  title="View Ingredients & Details"
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-[#10090B]/80 hover:bg-[#500B19] border border-[#D4AF66]/40 text-[#F3D99B] backdrop-blur-md transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => onSelectProduct(item)}
                      className="text-xl font-bold text-[#FFF4DF] font-heading group-hover:text-[#F3D99B] transition-colors cursor-pointer"
                    >
                      {item.name}
                    </h3>
                    <span className="text-lg font-black text-[#D4AF66] whitespace-nowrap">
                      {formatPKR(displayPrice)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-[#FFF4DF]/70 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Ingredients Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.ingredients.slice(0, 3).map((ing, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[#26070D] border border-white/5 text-[11px] text-[#FFF4DF]/80"
                      >
                        {ing}
                      </span>
                    ))}
                    {item.ingredients.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-[#26070D] border border-white/5 text-[11px] text-[#D4AF66]">
                        +{item.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom: Size Selection & Add to Cart */}
                <div className="mt-6 pt-4 border-t border-[#D4AF66]/15">
                  {item.sizes && item.sizes.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[11px] font-semibold text-[#D4AF66] uppercase tracking-wider mb-1.5 flex justify-between">
                        <span>Select Size:</span>
                        <span className="text-[#FFF4DF]/60">{currentSize?.sizeLabel}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {item.sizes.map((s) => (
                          <button
                            key={s.name}
                            onClick={() => handleSizeChange(item.id, s)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              currentSize?.name === s.name
                                ? "bg-[#D4AF66] text-[#10090B] border-[#D4AF66] shadow"
                                : "bg-[#10090B] border-white/10 text-[#FFF4DF]/70 hover:border-[#D4AF66]/40"
                            }`}
                          >
                            <div>{s.name}</div>
                            <div className="text-[10px] opacity-80">{formatPKR(s.price)}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isJustAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-gradient-to-r from-[#500B19] to-[#26070D] hover:from-[#6b0f22] hover:to-[#380b14] border border-[#D4AF66]/40 text-[#FFF4DF] shadow-lg hover:border-[#D4AF66]"
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[#D4AF66]" />
                        <span>Add to Cart ({formatPKR(displayPrice)})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
