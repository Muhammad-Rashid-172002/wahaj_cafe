/**
 * Wahaj Cafe — The Pizza Lab
 * Luxury Navigation Bar
 */

import React, { useState } from "react";
import { ShoppingBag, MessageSquare, Menu, X, Sparkles, ChefHat, Wand2, MapPin } from "lucide-react";
import { useCart } from "../context/CartContext";
import { RestaurantConfig } from "../config/restaurant";

interface NavbarProps {
  config: RestaurantConfig;
  onOpenAiStudio: () => void;
  onOpenConfigModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  onOpenAiStudio,
  onOpenConfigModal
}) => {
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openWhatsAppDirect = () => {
    window.open(`https://wa.me/${config.primaryWhatsApp}`, "_blank");
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1A060A]/95 border-b border-[#D4AF66]/25 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => scrollToSection("hero-section")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#500B19] to-[#26070D] border border-[#D4AF66]/50 flex items-center justify-center shadow-lg group-hover:border-[#F3D99B] transition-colors">
            <ChefHat className="w-6 h-6 text-[#D4AF66]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#FFF4DF] font-heading">
                WAHAJ CAFE
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#D4AF66] text-[#10090B] tracking-wider uppercase">
                ISL
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#D4AF66] font-semibold tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-[#F3D99B]" />
              <span>THE PIZZA LAB</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#FFF4DF]/80">
          <button
            onClick={() => scrollToSection("signature-section")}
            className="hover:text-[#F3D99B] transition-colors cursor-pointer"
          >
            Pizza Lab Signatures
          </button>
          <button
            onClick={() => scrollToSection("menu-section")}
            className="hover:text-[#F3D99B] transition-colors cursor-pointer"
          >
            Full Digital Menu
          </button>
          <button
            onClick={onOpenAiStudio}
            className="flex items-center gap-1.5 text-[#F3D99B] hover:text-[#FFF4DF] font-semibold px-3 py-1 rounded-full bg-[#500B19]/50 border border-[#D4AF66]/30 transition-all cursor-pointer hover:border-[#D4AF66]"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#D4AF66]" />
            <span>AI Food Studio</span>
          </button>
          <button
            onClick={() => scrollToSection("location-section")}
            className="flex items-center gap-1 hover:text-[#F3D99B] transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4AF66]" />
            <span>Location & Hours</span>
          </button>
        </nav>

        {/* Right Actions: WhatsApp Quick Link & Cart Drawer Trigger */}
        <div className="flex items-center gap-3">
          {/* Quick WhatsApp Button */}
          <button
            onClick={openWhatsAppDirect}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs transition-all cursor-pointer"
            title="Chat with restaurant on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 fill-[#25D366]/20" />
            <span>0317-5177197</span>
          </button>

          {/* Cart Icon with Live Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
            className="relative p-2.5 rounded-xl bg-[#500B19]/80 hover:bg-[#500B19] border border-[#D4AF66]/40 text-[#F3D99B] transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#D4AF66] text-[#10090B] font-bold text-xs flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin settings button */}
          <button
            onClick={onOpenConfigModal}
            title="Admin Configuration"
            className="hidden md:inline-flex p-2 rounded-xl bg-[#10090B] border border-white/10 text-xs text-[#FFF4DF]/60 hover:text-[#FFF4DF] transition-colors cursor-pointer"
          >
            Admin Setup
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle Mobile Menu"
            className="lg:hidden p-2.5 rounded-xl bg-[#26070D] border border-[#D4AF66]/30 text-[#FFF4DF] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#10090B] border-b border-[#D4AF66]/30 px-6 py-6 space-y-4">
          <button
            onClick={() => scrollToSection("signature-section")}
            className="block w-full text-left py-2 text-base font-medium text-[#FFF4DF] hover:text-[#D4AF66]"
          >
            Pizza Lab Signatures
          </button>
          <button
            onClick={() => scrollToSection("menu-section")}
            className="block w-full text-left py-2 text-base font-medium text-[#FFF4DF] hover:text-[#D4AF66]"
          >
            Full Digital Menu
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAiStudio();
            }}
            className="flex items-center gap-2 w-full text-left py-2 text-base font-medium text-[#F3D99B]"
          >
            <Wand2 className="w-4 h-4 text-[#D4AF66]" />
            <span>AI Food Studio & Video Generator</span>
          </button>
          <button
            onClick={() => scrollToSection("location-section")}
            className="block w-full text-left py-2 text-base font-medium text-[#FFF4DF] hover:text-[#D4AF66]"
          >
            Location, Delivery & Hours
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenConfigModal();
            }}
            className="block w-full text-left py-2 text-sm text-[#D4AF66]"
          >
            Restaurant Admin Settings
          </button>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openWhatsAppDirect();
              }}
              className="w-full py-3 rounded-xl bg-[#25D366] text-black font-bold text-center flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat on WhatsApp (0317-5177197)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
