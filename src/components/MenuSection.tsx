/**
 * Wahaj Cafe — The Pizza Lab
 * Full Interactive Digital Menu Section
 */

import React, { useState, useMemo } from "react";
import { Search, Plus, Check, Info, Flame, AlertCircle, Sparkles } from "lucide-react";
import { MENU_CATEGORIES, MENU_ITEMS, MenuItem, MenuItemSize, MenuCategory } from "../data/menu";
import { useCart } from "../context/CartContext";
import { FoodImage } from "./FoodImage";
import { TiltCard } from "./experience/TiltCard";
import { formatPKR } from "../utils/whatsapp";

interface MenuSectionProps {
  onSelectProduct: (product: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectProduct }) => {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpicyOnly, setFilterSpicyOnly] = useState(false);
  const [filterPopularOnly, setFilterPopularOnly] = useState(false);

  // Per-item selected size state
  const [selectedSizes, setSelectedSizes] = useState<Record<string, MenuItemSize>>(() => {
    const map: Record<string, MenuItemSize> = {};
    MENU_ITEMS.forEach((item) => {
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

  // Filter items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      if (activeCategory !== "All" && item.category !== activeCategory) {
        return false;
      }
      // Spicy filter
      if (filterSpicyOnly && !item.isSpicy) {
        return false;
      }
      // Popular filter
      if (filterPopularOnly && !item.isPopular) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(q);
        const descMatch = item.description.toLowerCase().includes(q);
        const catMatch = item.category.toLowerCase().includes(q);
        const ingMatch = item.ingredients.some((i) => i.toLowerCase().includes(q));
        if (!nameMatch && !descMatch && !catMatch && !ingMatch) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, searchQuery, filterSpicyOnly, filterPopularOnly]);

  return (
    <section id="menu-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#500B19]/60 border border-[#D4AF66]/40 text-[#F3D99B] text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF66]" />
          <span>Authentic Restaurant Menu</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFF4DF] font-heading">
          The <span className="gold-gradient-text">Full Menu</span>
        </h2>

        <p className="mt-3 text-[#FFF4DF]/75 text-sm sm:text-base">
          Every price, size, and ingredient verified directly from Wahaj Cafe’s official menu. Select your favorites and order directly via WhatsApp.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="mb-10 space-y-4">
        {/* Search Bar & Quick Toggles */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-[#D4AF66] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pizzas, burgers, fries, shakes, ingredients..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#1A060A] border border-[#D4AF66]/30 text-[#FFF4DF] placeholder-[#FFF4DF]/40 text-sm focus:outline-none focus:border-[#D4AF66] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#FFF4DF]/50 hover:text-[#FFF4DF]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterPopularOnly((p) => !p)}
              className={`px-4 py-3 rounded-2xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                filterPopularOnly
                  ? "bg-[#D4AF66] text-[#10090B] border-[#D4AF66]"
                  : "bg-[#1A060A] border-[#D4AF66]/30 text-[#FFF4DF]/80 hover:text-[#FFF4DF]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Popular Items</span>
            </button>

            <button
              onClick={() => setFilterSpicyOnly((s) => !s)}
              className={`px-4 py-3 rounded-2xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                filterSpicyOnly
                  ? "bg-rose-700 text-white border-rose-600"
                  : "bg-[#1A060A] border-[#D4AF66]/30 text-[#FFF4DF]/80 hover:text-[#FFF4DF]"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Spicy Dishes</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MENU_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? "bg-gradient-to-r from-[#D4AF66] to-[#F3D99B] text-[#10090B] border-[#D4AF66] shadow-lg"
                    : "bg-[#1A060A] text-[#FFF4DF]/75 border-white/10 hover:border-[#D4AF66]/40 hover:text-[#FFF4DF]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Unconfirmed Warning Notice if applicable */}
      <div className="mb-6 flex items-center justify-between text-xs text-[#FFF4DF]/60">
        <span>Showing {filteredItems.length} dishes · photos are representative</span>
        <span className="text-[#D4AF66]">Free Delivery Across E-11, FECHS</span>
      </div>

      {/* Food Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-24 bg-[#1A060A] rounded-3xl border border-white/10 p-8">
          <p className="text-lg font-semibold text-[#FFF4DF]">No dishes matched your criteria.</p>
          <p className="mt-2 text-sm text-[#FFF4DF]/60">Try searching for a different term or resetting the category filter.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
              setFilterSpicyOnly(false);
              setFilterPopularOnly(false);
            }}
            className="mt-6 px-6 py-2.5 rounded-xl bg-[#500B19] text-[#FFF4DF] border border-[#D4AF66]/40 text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const currentSize = selectedSizes[item.id] || (item.sizes ? item.sizes[item.defaultSizeIndex ?? 0] : undefined);
            const isUnconfirmed = !item.priceConfirmed || (item.price === null && !currentSize);
            const displayPrice = currentSize ? currentSize.price : (item.price ?? 0);
            const isJustAdded = addedItemKey === item.id;

            return (
              <TiltCard
                key={item.id}
                className={`group rounded-3xl bg-[#170509] border border-[#D4AF66]/15 hover:border-[#D4AF66]/45 shadow-[0_10px_40px_rgba(0,0,0,0.35)] flex flex-col justify-between overflow-hidden ${/Drinks|Shakes/.test(item.category) ? "fx-drink" : ""}`}
              >
                {/* Image Area */}
                <div className="relative aspect-[4/3] w-full overflow-hidden card-media">
                  <FoodImage
                    src={item.image}
                    alt={item.imageAlt}
                    badge={item.isPopular ? "Popular" : undefined}
                    onClick={() => onSelectProduct(item)}
                  />

                  {/* Info Button */}
                  <button
                    onClick={() => onSelectProduct(item)}
                    aria-label={`View details for ${item.name}`}
                    title="View Product Ingredients"
                    className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-[#10090B]/80 hover:bg-[#500B19] border border-[#D4AF66]/40 text-[#F3D99B] backdrop-blur-sm cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>

                  {item.isSpicy && (
                    <span className="absolute top-2.5 right-2.5 p-1 rounded-md bg-rose-900/90 text-rose-200 text-[10px] font-bold flex items-center gap-0.5 shadow">
                      <Flame className="w-3 h-3 text-rose-400" />
                      <span>Spicy</span>
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-[#D4AF66] tracking-wider uppercase mb-1">
                      {item.category}
                    </div>

                    <h3 className="text-base font-bold text-[#FFF4DF] font-heading group-hover:text-[#F3D99B] transition-colors line-clamp-1">
                      <button onClick={() => onSelectProduct(item)} className="text-left cursor-pointer focus-visible:outline-none focus-visible:underline decoration-[#D4AF66]">
                        {item.name}
                      </button>
                    </h3>

                    <p className="mt-1 text-xs text-[#FFF4DF]/65 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Sizes (if item has pizza sizes) */}
                  <div className="mt-3 pt-3 border-t border-white/5">
                    {item.sizes && item.sizes.length > 0 ? (
                      <div className="mb-3">
                        <div className="flex justify-between items-center text-[10px] text-[#D4AF66] font-semibold uppercase mb-1">
                          <span>Size</span>
                          <span className="text-[#FFF4DF]/60">{currentSize?.sizeLabel}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {item.sizes.map((s) => (
                            <button
                              key={s.name}
                              onClick={() => handleSizeChange(item.id, s)}
                              className={`py-1 px-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer text-center ${
                                currentSize?.name === s.name
                                  ? "bg-[#D4AF66] text-[#10090B] border-[#D4AF66]"
                                  : "bg-[#10090B] border-white/10 text-[#FFF4DF]/70 hover:border-[#D4AF66]/40"
                              }`}
                            >
                              <div>{s.name}</div>
                              <div className="text-[9px] opacity-75">{s.price}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* Price and Add button */}
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <div>
                        {isUnconfirmed ? (
                          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                            <AlertCircle className="w-3 h-3" />
                            <span>Unconfirmed</span>
                          </div>
                        ) : (
                          <div className="text-base font-black text-[#D4AF66]">
                            {formatPKR(displayPrice)}
                          </div>
                        )}
                      </div>

                      <button
                        disabled={isUnconfirmed}
                        onClick={() => handleAddToCart(item)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isUnconfirmed
                            ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
                            : isJustAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-[#500B19] hover:bg-[#6e1024] border border-[#D4AF66]/40 text-[#FFF4DF] shadow"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-[#D4AF66]" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      )}
    </section>
  );
};
