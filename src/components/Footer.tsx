/**
 * Wahaj Cafe — The Pizza Lab
 * Luxury Brand Footer
 */

import React from "react";
import { ChefHat, Sparkles, MessageSquare, Phone, MapPin, Heart } from "lucide-react";
import { RestaurantConfig } from "../config/restaurant";
import { MENU_CATEGORIES } from "../data/menu";

interface FooterProps {
  config: RestaurantConfig;
  onOpenAiStudio: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenAiStudio }) => {
  const scrollToMenuCategory = (category: string) => {
    const el = document.getElementById("menu-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#0C0406] border-t border-[#D4AF66]/25 text-[#FFF4DF] select-none">
      {/* Top CTA Banner */}
      <div className="border-b border-white/5 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#D4AF66] uppercase tracking-widest block mb-1">
            Craving Fresh Artisanal Pizza?
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-heading text-[#FFF4DF]">
            Order Now with Free Delivery in Islamabad
          </h3>
          <p className="text-xs sm:text-sm text-[#FFF4DF]/70 mt-1">
            Direct WhatsApp ordering dispatched immediately to our kitchen staff.
          </p>
        </div>

        <a
          href={`https://wa.me/${config.primaryWhatsApp}`}
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-extrabold text-sm tracking-wide shadow-xl flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <MessageSquare className="w-5 h-5 fill-white/20" />
          <span>Chat on WhatsApp ({config.primaryWhatsAppDisplay})</span>
        </a>
      </div>

      {/* Main Footer Links */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#500B19] border border-[#D4AF66]/40 flex items-center justify-center text-[#D4AF66]">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-[#FFF4DF] font-heading block leading-none">
                {config.restaurantName}
              </span>
              <span className="text-xs text-[#D4AF66] font-semibold tracking-wider uppercase">
                {config.brandName}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#FFF4DF]/70 leading-relaxed">
            {config.tagline} Located at FECHS E-11/2 Basement, Islamabad. We combine traditional tandoor seasonings with modern pizza science.
          </p>

          <div className="text-xs text-[#D4AF66] font-semibold">
            {config.deliveryPromotion} Across Islamabad!
          </div>
        </div>

        {/* Categories Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#D4AF66] uppercase tracking-widest">
            Menu Categories
          </h4>
          <ul className="space-y-2 text-xs text-[#FFF4DF]/75">
            {MENU_CATEGORIES.slice(1, 7).map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => scrollToMenuCategory(cat)}
                  className="hover:text-[#F3D99B] transition-colors cursor-pointer"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* More Categories Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#D4AF66] uppercase tracking-widest">
            Specialties & Shakes
          </h4>
          <ul className="space-y-2 text-xs text-[#FFF4DF]/75">
            {MENU_CATEGORIES.slice(7).map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => scrollToMenuCategory(cat)}
                  className="hover:text-[#F3D99B] transition-colors cursor-pointer"
                >
                  {cat}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={onOpenAiStudio}
                className="text-[#F3D99B] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#D4AF66]" />
                <span>AI Food Visual Studio</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Contact & Hours Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#D4AF66] uppercase tracking-widest">
            Location & Contacts
          </h4>
          <div className="space-y-2.5 text-xs text-[#FFF4DF]/75">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF66] shrink-0 mt-0.5" />
              <span>{config.address}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF66] shrink-0" />
              <div className="font-mono">
                <div>{config.primaryWhatsAppDisplay}</div>
                <div>{config.secondaryWhatsAppDisplay}</div>
              </div>
            </div>

            <div className="text-[11px] text-[#FFF4DF]/60 pt-2">
              Kitchen Hours: {config.openingHours}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/5 py-6 px-4 text-center text-xs text-[#FFF4DF]/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            © {new Date().getFullYear()} {config.restaurantName} — {config.brandName}. All rights reserved.
          </span>
          <span className="flex items-center gap-1">
            Engineered with culinary passion in Islamabad
          </span>
        </div>
      </div>
    </footer>
  );
};
