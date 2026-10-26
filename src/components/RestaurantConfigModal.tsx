/**
 * Wahaj Cafe — The Pizza Lab
 * Restaurant Administration Configuration Modal
 */

import React, { useState } from "react";
import { X, ShieldCheck, Save, Phone, MapPin, AlertCircle, Check } from "lucide-react";
import { RestaurantConfig, saveStoredRestaurantConfig } from "../config/restaurant";

interface RestaurantConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  onUpdateConfig: (newConfig: RestaurantConfig) => void;
}

export const RestaurantConfigModal: React.FC<RestaurantConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig
}) => {
  const [formData, setFormData] = useState<RestaurantConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredRestaurantConfig(formData);
    onUpdateConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-[#1A060A] border border-[#D4AF66]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#140507]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#D4AF66]" />
            <div>
              <span className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider">
                Management Panel
              </span>
              <h2 className="text-xl font-black text-[#FFF4DF] font-heading">
                Restaurant Contact Settings
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-2 rounded-xl bg-[#10090B] hover:bg-[#500B19] text-[#FFF4DF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Fields */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-xs">
          <p className="text-[#FFF4DF]/70 leading-relaxed">
            Configure the verified WhatsApp receiving numbers, restaurant physical address, and delivery promo banner without touching source code.
          </p>

          <div>
            <label className="font-bold text-[#D4AF66] uppercase tracking-wider block mb-1">
              Primary WhatsApp Number (International format for wa.me)
            </label>
            <input
              type="text"
              value={formData.primaryWhatsApp}
              onChange={(e) => setFormData({ ...formData, primaryWhatsApp: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10090B] border border-[#D4AF66]/30 text-sm text-[#FFF4DF]"
              placeholder="e.g. 923701691701"
            />
          </div>

          <div>
            <label className="font-bold text-[#D4AF66] uppercase tracking-wider block mb-1">
              Primary WhatsApp Display Format
            </label>
            <input
              type="text"
              value={formData.primaryWhatsAppDisplay}
              onChange={(e) => setFormData({ ...formData, primaryWhatsAppDisplay: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10090B] border border-[#D4AF66]/30 text-sm text-[#FFF4DF]"
              placeholder="e.g. 0317-5177197"
            />
          </div>

          <div>
            <label className="font-bold text-[#D4AF66] uppercase tracking-wider block mb-1">
              Secondary Contact / Phone Number
            </label>
            <input
              type="text"
              value={formData.secondaryWhatsAppDisplay}
              onChange={(e) => setFormData({ ...formData, secondaryWhatsAppDisplay: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10090B] border border-[#D4AF66]/30 text-sm text-[#FFF4DF]"
              placeholder="e.g. 0317-5174541"
            />
          </div>

          <div>
            <label className="font-bold text-[#D4AF66] uppercase tracking-wider block mb-1">
              Restaurant Address
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10090B] border border-[#D4AF66]/30 text-sm text-[#FFF4DF]"
            />
          </div>

          <div>
            <label className="font-bold text-[#D4AF66] uppercase tracking-wider block mb-1">
              Delivery Promotion Banner Text
            </label>
            <input
              type="text"
              value={formData.deliveryPromotion}
              onChange={(e) => setFormData({ ...formData, deliveryPromotion: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#10090B] border border-[#D4AF66]/30 text-sm text-[#FFF4DF]"
            />
          </div>

          {/* Verification Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isVerified"
              checked={formData.isWhatsAppVerified}
              onChange={(e) => setFormData({ ...formData, isWhatsAppVerified: e.target.checked })}
              className="w-4 h-4 accent-[#D4AF66]"
            />
            <label htmlFor="isVerified" className="text-xs text-[#FFF4DF]">
              Mark primary WhatsApp number as verified & active for instant orders
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF66] to-[#F3D99B] text-[#10090B] font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Configuration Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
