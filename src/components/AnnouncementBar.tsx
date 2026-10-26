/**
 * Wahaj Cafe — The Pizza Lab
 * Announcement Bar
 */

import React from "react";
import { Sparkles, Phone, MapPin, Truck } from "lucide-react";
import { RestaurantConfig } from "../config/restaurant";

interface AnnouncementBarProps {
  config: RestaurantConfig;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ config }) => {
  return (
    <div className="bg-[#26070D] border-b border-[#D4AF66]/20 text-[#FFF4DF] text-xs py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Free Delivery highlight */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#500B19] border border-[#D4AF66]/40 text-[#F3D99B] font-bold text-[11px] tracking-wide uppercase">
            <Truck className="w-3 h-3 text-[#D4AF66]" />
            {config.deliveryPromotion}
          </span>
          <span className="hidden sm:inline text-[#FFF4DF]/80">
            Across FECHS & E-11, Islamabad!
          </span>
        </div>

        {/* Center: Brand Tagline */}
        <div className="hidden md:flex items-center gap-2 text-[#D4AF66] font-medium tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#F3D99B]" />
          <span>{config.tagline}</span>
        </div>

        {/* Right: Contact numbers */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#FFF4DF]/90">
            <Phone className="w-3.5 h-3.5 text-[#D4AF66]" />
            <a href={`tel:${config.primaryWhatsApp}`} className="hover:text-[#F3D99B] transition-colors font-semibold">
              {config.primaryWhatsAppDisplay}
            </a>
            <span className="text-[#D4AF66]/40">|</span>
            <a href={`tel:${config.secondaryWhatsApp}`} className="hover:text-[#F3D99B] transition-colors">
              {config.secondaryWhatsAppDisplay}
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[#FFF4DF]/70">
            <MapPin className="w-3 h-3 text-[#D4AF66]" />
            <span>FECHS E-11/2 Basement</span>
          </div>
        </div>
      </div>
    </div>
  );
};
