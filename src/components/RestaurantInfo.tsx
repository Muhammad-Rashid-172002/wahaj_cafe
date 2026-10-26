/**
 * Wahaj Cafe — The Pizza Lab
 * Restaurant Information & Location Section
 */

import React from "react";
import {
  MapPin,
  Clock,
  Phone,
  Truck,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { RestaurantConfig } from "../config/restaurant";

interface RestaurantInfoProps {
  config: RestaurantConfig;
  onOpenConfigModal: () => void;
}

export const RestaurantInfo: React.FC<RestaurantInfoProps> = ({ config, onOpenConfigModal }) => {
  return (
    <section id="location-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Location & Hours Details */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#500B19]/60 border border-[#D4AF66]/40 text-[#F3D99B] text-xs font-semibold tracking-wider uppercase">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF66]" />
            <span>Islamabad Prime Location</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFF4DF] font-heading">
            VISIT & DINE AT <span className="gold-gradient-text">WAHAJ CAFE</span>
          </h2>

          <p className="text-sm sm:text-base text-[#FFF4DF]/75 leading-relaxed">
            Experience the aroma of freshly fired artisanal pizzas, crispy battered zingers, and icy mocktails right in the heart of Islamabad.
          </p>

          {/* Key Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Address */}
            <div className="p-5 rounded-2xl bg-[#1A060A] border border-[#D4AF66]/25 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#500B19] flex items-center justify-center text-[#D4AF66]">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#FFF4DF]">Address</h4>
              <p className="text-xs text-[#FFF4DF]/70 leading-relaxed">
                {config.address}
              </p>
              <a
                href={config.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#D4AF66] font-semibold hover:underline pt-1"
              >
                <span>Open Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Hours */}
            <div className="p-5 rounded-2xl bg-[#1A060A] border border-[#D4AF66]/25 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#500B19] flex items-center justify-center text-[#D4AF66]">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#FFF4DF]">Kitchen Hours</h4>
              <p className="text-xs text-[#FFF4DF]/70 leading-relaxed">
                {config.openingHours}
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold pt-1">
                Open Daily for Dine-In, Takeaway & Delivery
              </div>
            </div>

            {/* Phone Hotlines */}
            <div className="p-5 rounded-2xl bg-[#1A060A] border border-[#D4AF66]/25 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#500B19] flex items-center justify-center text-[#D4AF66]">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#FFF4DF]">Order Phone Numbers</h4>
              <div className="text-xs font-mono text-[#D4AF66] space-y-0.5">
                <div>{config.primaryWhatsAppDisplay} (WhatsApp)</div>
                <div>{config.secondaryWhatsAppDisplay} (Direct Line)</div>
              </div>
              <div className="text-[11px] text-[#FFF4DF]/60">
                Staff responds instantly during kitchen hours.
              </div>
            </div>

            {/* Free Delivery */}
            <div className="p-5 rounded-2xl bg-[#1A060A] border border-[#D4AF66]/25 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#500B19] flex items-center justify-center text-[#D4AF66]">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#FFF4DF]">{config.deliveryPromotion}</h4>
              <p className="text-xs text-[#FFF4DF]/70 leading-relaxed">
                Enjoy 100% complimentary delivery on all pizza and food orders across FECHS, E-11, and adjacent sectors.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Future WhatsApp Business Integration Architecture Showcase Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1A060A] to-[#26070D] border border-[#D4AF66]/40 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[#500B19]/50 blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-4">
            <span className="p-2 rounded-xl bg-[#25D366]/20 text-[#25D366]">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-bold text-[#D4AF66] tracking-wider uppercase block">
                Enterprise Integration Layer
              </span>
              <h3 className="text-lg font-bold text-[#FFF4DF]">
                WhatsApp Business Platform Roadmap
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#FFF4DF]/80 leading-relaxed mb-6">
            Wahaj Cafe’s ordering architecture is built in two distinct tiers:
          </p>

          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-[#10090B] border border-white/5 space-y-1">
              <div className="font-bold text-[#F3D99B] flex items-center justify-between">
                <span>Tier 1 (Current Active Frontend)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px]">
                  Production Ready
                </span>
              </div>
              <p className="text-[#FFF4DF]/70 text-[11px] leading-relaxed">
                Generates a prefilled, verified order payload with individual dish URLs, line totals, and sizes, opening the customer’s WhatsApp app directed to the administrator’s verified number.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#10090B] border border-white/5 space-y-1">
              <div className="font-bold text-[#F3D99B] flex items-center justify-between">
                <span>Tier 2 (Cloud Webhook Automation)</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-[10px]">
                  API Ready
                </span>
              </div>
              <p className="text-[#FFF4DF]/70 text-[11px] leading-relaxed">
                The backend <code className="text-[#D4AF66]">server.ts</code> includes the <code className="text-[#D4AF66]">/api/whatsapp/business-api-simulation</code> endpoint to forward validated orders and attach binary product image assets directly into WhatsApp Business threads.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={onOpenConfigModal}
              className="text-xs text-[#D4AF66] hover:text-[#FFF4DF] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Configure Admin WhatsApp Details</span>
            </button>

            <span className="text-[10px] text-[#FFF4DF]/40 font-mono">
              Status: {config.isWhatsAppVerified ? "Verified Active" : "Unverified"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
