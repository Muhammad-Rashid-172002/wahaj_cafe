/**
 * Wahaj Cafe — The Pizza Lab
 * Master Application Component
 */

import React, { useCallback, useState } from "react";
import { CartProvider, useCart } from "./context/CartContext";
import { getStoredRestaurantConfig, RestaurantConfig } from "./config/restaurant";
import { MenuItem } from "./data/menu";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Navbar } from "./components/Navbar";
import { CinematicHero } from "./components/experience/CinematicHero";
import { ScrollShowcase } from "./components/experience/ScrollShowcase";
import { MenuSection } from "./components/MenuSection";
import { RestaurantInfo } from "./components/RestaurantInfo";
import { Footer } from "./components/Footer";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { AiVisualStudio } from "./components/AiVisualStudio";
import { RestaurantConfigModal } from "./components/RestaurantConfigModal";
import { MessageSquare, Wand2 } from "lucide-react";

function MainContent() {
  const [restaurantConfig, setRestaurantConfig] = useState<RestaurantConfig>(getStoredRestaurantConfig);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isAiStudioOpen, setIsAiStudioOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const { isCheckoutOpen, setIsCheckoutOpen, setIsCartOpen } = useCart();

  const handleExploreMenu = () => {
    const el = document.getElementById("menu-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleOrderNow = () => {
    setIsCartOpen(true);
  };

  const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const openDetails = useCallback((p: MenuItem) => setSelectedProduct(p), []);

  return (
    <div className="min-h-screen bg-[#10090B] text-[#FFF4DF] flex flex-col font-sans selection:bg-[#D4AF66] selection:text-[#10090B]">
      {/* 1. Announcement Bar */}
      <AnnouncementBar config={restaurantConfig} />

      {/* 2. Luxury Sticky Navbar */}
      <Navbar
        config={restaurantConfig}
        onOpenAiStudio={() => setIsAiStudioOpen(true)}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
      />

      {/* 3. Cinematic 3D hero */}
      <section id="hero-section">
        <CinematicHero
          config={restaurantConfig}
          onExploreMenuClick={handleExploreMenu}
          onOrderNowClick={handleOrderNow}
          onDiscoverClick={() => scrollToId("signature-section")}
        />
      </section>

      {/* 4. Signature experiences — scroll-driven exploded 3D views */}
      <ScrollShowcase
        id="signature-section"
        kind="pizza"
        initialId="crown-crust-pizza"
        productIds={["crown-crust-pizza", "the-formula-101", "chemical-reaction", "overdose-cheese", "botanical-fusion", "kabab-crust-pizza", "chicken-tikka-pizza"]}
        copy={{
          eyebrow: "The Pizza Lab · Signatures",
          title: (
            <>
              Built <span className="gold-gradient-text">layer by layer.</span>
            </>
          ),
          intro: "Scroll to take a signature pizza apart — crust, sauce, cheese and every topping on the recipe card — then put it back together.",
          stages: ["The Reveal", "Separation", "The Formula", "Reassembly", "Ready to Order"]
        }}
        onViewDetails={openDetails}
      />

      <ScrollShowcase
        id="burger-section"
        kind="burger"
        initialId="double-beef-burger"
        productIds={["classic-chicken-burger", "zinger-burger", "grilled-chicken-burger", "beef-burger", "double-beef-burger", "lava-jalapeno-burger"]}
        copy={{
          eyebrow: "The Burger Stack",
          title: (
            <>
              Every layer <span className="gold-gradient-text">earns its place.</span>
            </>
          ),
          intro: "Buns lift, fillings float, the stack comes back together. Pick a burger — each one is built only from what's on its menu card.",
          stages: ["The Stack", "Lift Off", "Anatomy", "Restack", "Ready to Order"]
        }}
        onViewDetails={openDetails}
      />

      <ScrollShowcase
        id="fries-section"
        kind="fries"
        initialId="simple-fries"
        productIds={["simple-fries", "pizza-loaded-fries", "tender-fries"]}
        copy={{
          eyebrow: "Golden Fries",
          title: (
            <>
              Crisp, salted, <span className="gold-gradient-text">loaded.</span>
            </>
          ),
          intro: "Double-fried batons rise from the carton; the loaded trays reveal every topping on top.",
          stages: ["Fresh Out", "Rising", "What's On It", "Settling", "Ready to Order"]
        }}
        onViewDetails={openDetails}
      />

      {/* 5. Complete Interactive Digital Menu */}
      <MenuSection onSelectProduct={openDetails} />

      {/* 6. Restaurant Location, Hours & WhatsApp Integration Layer */}
      <RestaurantInfo
        config={restaurantConfig}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
      />

      {/* 7. Footer */}
      <Footer
        config={restaurantConfig}
        onOpenAiStudio={() => setIsAiStudioOpen(true)}
      />

      {/* Modals & Drawers */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        adminWhatsApp={restaurantConfig.primaryWhatsApp}
      />

      <CartDrawer />

      <CheckoutModal
        config={restaurantConfig}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <AiVisualStudio
        isOpen={isAiStudioOpen}
        onClose={() => setIsAiStudioOpen(false)}
      />

      <RestaurantConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={restaurantConfig}
        onUpdateConfig={(cfg) => setRestaurantConfig(cfg)}
      />

      {/* Floating Action Buttons (Mobile WhatsApp & AI Studio) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
        <button
          onClick={() => setIsAiStudioOpen(true)}
          title="Open AI Food Visual Studio"
          className="p-3.5 rounded-full bg-gradient-to-br from-[#500B19] to-[#26070D] border border-[#D4AF66]/60 text-[#F3D99B] shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
        >
          <Wand2 className="w-6 h-6" />
        </button>

        <a
          href={`https://wa.me/${restaurantConfig.primaryWhatsApp}`}
          target="_blank"
          rel="noreferrer"
          title="Direct WhatsApp with Wahaj Cafe"
          className="p-3.5 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6 fill-white/20" />
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}
