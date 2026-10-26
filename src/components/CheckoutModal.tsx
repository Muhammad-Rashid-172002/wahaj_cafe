/**
 * Wahaj Cafe — The Pizza Lab
 * Customer Order Checkout & Direct WhatsApp Dispatch Modal
 */

import React, { useState } from "react";
import {
  X,
  MessageSquare,
  Truck,
  ShoppingBag,
  User,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Server
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { RestaurantConfig } from "../config/restaurant";
import {
  CustomerOrderDetails,
  createWhatsAppClickToChatUrl,
  generateWhatsAppOrderMessage,
  formatPKR,
  sendOrderThroughBusinessApi,
  WhatsAppBusinessApiResponse
} from "../utils/whatsapp";

interface CheckoutModalProps {
  config: RestaurantConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  config,
  isOpen,
  onClose
}) => {
  const { cart, subtotal, clearCart } = useCart();

  // Form fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<"Delivery" | "Pickup">("Delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  // Target WhatsApp number (allow switching between primary and secondary)
  const [targetNumber, setTargetNumber] = useState<string>(config.primaryWhatsApp);

  // Validation & UI states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [orderDispatched, setOrderDispatched] = useState(false);
  const [previewMessageOpen, setPreviewMessageOpen] = useState(false);
  const [apiSimulationResult, setApiSimulationResult] = useState<WhatsAppBusinessApiResponse | null>(null);
  const [isSimulatingApi, setIsSimulatingApi] = useState(false);

  if (!isOpen) return null;

  // Build the order details object
  const buildOrderPayload = (): CustomerOrderDetails => {
    return {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderType,
      deliveryAddress: orderType === "Delivery" ? deliveryAddress.trim() : undefined,
      customerNotes: customerNotes.trim(),
      items: cart.map((c) => ({
        id: c.productId,
        name: c.name,
        sizeName: c.selectedSize?.name,
        sizeLabel: c.selectedSize?.sizeLabel,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
        lineTotal: c.lineTotal,
        imageUrl: c.imageUrl
      })),
      subtotal,
      deliveryFee: 0, // FREE DELIVERY
      grandTotal: subtotal
    };
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customerName.trim()) {
      errors.name = "Please enter your full name.";
    }

    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = "Please enter a valid Pakistani contact number (e.g. 0317 5177197).";
    }

    if (orderType === "Delivery" && !deliveryAddress.trim()) {
      errors.address = "Please provide your street or apartment delivery address.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendToWhatsApp = () => {
    if (!validateForm()) return;

    const payload = buildOrderPayload();
    const waUrl = createWhatsAppClickToChatUrl(payload, targetNumber);

    // Open WhatsApp directly
    window.open(waUrl, "_blank");
    setOrderDispatched(true);
  };

  const handleTestBusinessApiSimulation = async () => {
    if (!validateForm()) return;
    setIsSimulatingApi(true);
    setApiSimulationResult(null);
    try {
      const payload = buildOrderPayload();
      const res = await sendOrderThroughBusinessApi(payload);
      setApiSimulationResult(res);
    } finally {
      setIsSimulatingApi(false);
    }
  };

  const sampleFormattedMessage = generateWhatsAppOrderMessage(buildOrderPayload());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-[#1A060A] border border-[#D4AF66]/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#140507]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#D4AF66] tracking-widest uppercase">
                {config.restaurantName}
              </span>
              <span className="text-xs text-[#FFF4DF]/50">•</span>
              <span className="text-xs text-[#FFF4DF]/70">Checkout & Dispatch</span>
            </div>
            <h2 className="text-2xl font-black text-[#FFF4DF] font-heading mt-0.5">
              COMPLETE YOUR ORDER
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="p-2 rounded-xl bg-[#10090B] hover:bg-[#500B19] text-[#FFF4DF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Post-dispatch notice */}
          {orderDispatched && (
            <div className="p-4 rounded-2xl bg-[#500B19]/70 border border-[#D4AF66]/60 text-[#FFF4DF] space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>WhatsApp Click-to-Chat Launched!</span>
              </div>
              <p className="text-xs text-[#FFF4DF]/90 leading-relaxed">
                Your order message is ready in WhatsApp. <strong>Please press Send</strong> inside WhatsApp and wait for confirmation from Wahaj Cafe.
              </p>
              <div className="text-[11px] text-[#D4AF66]">
                Notice: A standard wa.me link prepares the order text with verified food image links. Please tap send in WhatsApp to submit your order to the restaurant administrator.
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    clearCart();
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-[#D4AF66] text-[#10090B] font-bold text-xs cursor-pointer"
                >
                  Finished & Clear Cart
                </button>
                <button
                  onClick={handleSendToWhatsApp}
                  className="px-4 py-1.5 rounded-xl bg-[#10090B] border border-white/20 text-[#FFF4DF] text-xs cursor-pointer"
                >
                  Re-open WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* Destination Administrator Verification Card */}
          <div className="p-3.5 rounded-2xl bg-[#26070D]/70 border border-[#D4AF66]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF66] shrink-0" />
              <div>
                <span className="font-bold text-[#FFF4DF]">Restaurant Admin Destination:</span>
                <span className="text-[#D4AF66] ml-1 font-mono">
                  {targetNumber === config.primaryWhatsApp ? config.primaryWhatsAppDisplay : config.secondaryWhatsAppDisplay}
                </span>
              </div>
            </div>

            {/* Switch target number selector */}
            <div className="flex items-center gap-1.5 bg-[#10090B] p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setTargetNumber(config.primaryWhatsApp)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  targetNumber === config.primaryWhatsApp
                    ? "bg-[#D4AF66] text-[#10090B]"
                    : "text-[#FFF4DF]/70 hover:text-[#FFF4DF]"
                }`}
              >
                Line 1 (Verified)
              </button>
              <button
                type="button"
                onClick={() => setTargetNumber(config.secondaryWhatsApp)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  targetNumber === config.secondaryWhatsApp
                    ? "bg-[#D4AF66] text-[#10090B]"
                    : "text-[#FFF4DF]/70 hover:text-[#FFF4DF]"
                }`}
              >
                Line 2
              </button>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Your Name *</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Muhammad Rashid"
                className={`w-full px-4 py-3 rounded-2xl bg-[#10090B] border text-sm text-[#FFF4DF] placeholder-[#FFF4DF]/30 focus:outline-none transition-colors ${
                  formErrors.name ? "border-rose-500" : "border-[#D4AF66]/30 focus:border-[#D4AF66]"
                }`}
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-rose-400">{formErrors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Phone Number *</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. 0317 1234567"
                className={`w-full px-4 py-3 rounded-2xl bg-[#10090B] border text-sm text-[#FFF4DF] placeholder-[#FFF4DF]/30 focus:outline-none transition-colors ${
                  formErrors.phone ? "border-rose-500" : "border-[#D4AF66]/30 focus:border-[#D4AF66]"
                }`}
              />
              {formErrors.phone && (
                <p className="mt-1 text-xs text-rose-400">{formErrors.phone}</p>
              )}
            </div>

            {/* Order Type Selector */}
            <div>
              <label className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider block mb-1.5">
                Order Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType("Delivery")}
                  className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer ${
                    orderType === "Delivery"
                      ? "bg-[#D4AF66] text-[#10090B] border-[#D4AF66] shadow-lg"
                      : "bg-[#10090B] border-white/10 text-[#FFF4DF]/70 hover:border-[#D4AF66]/40"
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Free Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("Pickup")}
                  className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer ${
                    orderType === "Pickup"
                      ? "bg-[#D4AF66] text-[#10090B] border-[#D4AF66] shadow-lg"
                      : "bg-[#10090B] border-white/10 text-[#FFF4DF]/70 hover:border-[#D4AF66]/40"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Self Pickup</span>
                </button>
              </div>
            </div>

            {/* Delivery Address (only if Delivery) */}
            {orderType === "Delivery" && (
              <div>
                <label className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Delivery Address * (House/Street/Sector)</span>
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. House 42, Street 18, FECHS Sector E-11/2, Islamabad"
                  className={`w-full px-4 py-3 rounded-2xl bg-[#10090B] border text-sm text-[#FFF4DF] placeholder-[#FFF4DF]/30 focus:outline-none transition-colors ${
                    formErrors.address ? "border-rose-500" : "border-[#D4AF66]/30 focus:border-[#D4AF66]"
                  }`}
                />
                {formErrors.address && (
                  <p className="mt-1 text-xs text-rose-400">{formErrors.address}</p>
                )}
              </div>
            )}

            {/* Optional Notes */}
            <div>
              <label className="text-xs font-bold text-[#D4AF66] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Special Instructions / Dietary Notes (Optional)</span>
              </label>
              <input
                type="text"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="e.g. Extra spicy, extra oregano, or ring bell upon arrival"
                className="w-full px-4 py-3 rounded-2xl bg-[#10090B] border border-[#D4AF66]/30 text-sm text-[#FFF4DF] placeholder-[#FFF4DF]/30 focus:outline-none focus:border-[#D4AF66] transition-colors"
              />
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="p-4 rounded-2xl bg-[#10090B] border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs text-[#D4AF66] font-bold uppercase tracking-wider">
              <span>Order Summary ({cart.length} items)</span>
              <span>Total: {formatPKR(subtotal)}</span>
            </div>

            <div className="divide-y divide-white/5 max-h-32 overflow-y-auto text-xs text-[#FFF4DF]/80">
              {cart.map((item) => (
                <div key={item.id} className="py-1.5 flex justify-between items-center">
                  <div className="truncate mr-2">
                    <span className="font-semibold text-[#FFF4DF]">{item.quantity}x</span> {item.name}
                    {item.selectedSize && (
                      <span className="text-[#D4AF66] ml-1">({item.selectedSize.name})</span>
                    )}
                  </div>
                  <span className="font-mono text-[#D4AF66] shrink-0">{formatPKR(item.lineTotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle Formatted Message Preview */}
          <div>
            <button
              type="button"
              onClick={() => setPreviewMessageOpen((p) => !p)}
              className="text-xs text-[#D4AF66] hover:underline flex items-center gap-1"
            >
              <span>{previewMessageOpen ? "Hide" : "Preview"} formatted WhatsApp order message</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            {previewMessageOpen && (
              <pre className="mt-2 p-4 rounded-2xl bg-[#0D0406] border border-[#D4AF66]/20 text-[11px] text-[#FFF4DF]/90 font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-48">
                {sampleFormattedMessage}
              </pre>
            )}
          </div>

          {/* Future Cloud API Simulation Feedback if executed */}
          {apiSimulationResult && (
            <div className="p-4 rounded-2xl bg-[#1A1A24] border border-indigo-500/30 text-xs space-y-1 text-indigo-200">
              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Server className="w-4 h-4" />
                <span>Backend WhatsApp Business API Simulation Result</span>
              </div>
              <div>Status: {apiSimulationResult.success ? "Success (Payload Dispatched)" : "Failed"}</div>
              {apiSimulationResult.messageId && (
                <div className="font-mono text-[10px] text-indigo-300">
                  Message ID: {apiSimulationResult.messageId}
                </div>
              )}
            </div>
          )}

          {/* Primary Action Button: SEND ORDER TO WHATSAPP */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-extrabold text-base tracking-wide shadow-2xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-white/20" />
              <span>SEND ORDER TO WHATSAPP</span>
            </button>

            {/* Secondary: Future Business API simulation */}
            <div className="flex justify-between items-center text-[11px] text-[#FFF4DF]/60 pt-1">
              <span>Step 4: Opens WhatsApp with prefilled order & image links.</span>
              <button
                type="button"
                onClick={handleTestBusinessApiSimulation}
                disabled={isSimulatingApi}
                className="text-[#D4AF66] hover:underline cursor-pointer disabled:opacity-50"
              >
                {isSimulatingApi ? "Simulating API..." : "Test Cloud API Route"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
