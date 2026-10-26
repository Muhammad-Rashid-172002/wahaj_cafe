/**
 * Wahaj Cafe — The Pizza Lab
 * WhatsApp Direct Order Formatter & Integration Service
 * 
 * Formats orders strictly to the master specification with itemized lines,
 * quantities, selected sizes, line totals, and direct product image URLs.
 */

import { getPublicImageUrlForWhatsApp } from "./imageManifest";

export interface CartOrderLineItem {
  id: string; // item id
  name: string;
  sizeName?: string; // e.g. "Medium"
  sizeLabel?: string; // e.g. "10 inches"
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl?: string;
}

export interface CustomerOrderDetails {
  customerName: string;
  customerPhone: string;
  orderType: "Delivery" | "Pickup";
  deliveryAddress?: string;
  customerNotes?: string;
  items: CartOrderLineItem[];
  subtotal: number;
  deliveryFee: number; // 0 for FREE DELIVERY as advertised
  grandTotal: number;
}

/**
 * Format currency in Pakistani Rupees (Rs.)
 */
export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

/**
 * Normalizes any phone number into an international format for WhatsApp wa.me links
 * e.g. "0317-5177197" or "03175177197" or "+92 317 5177197" -> "923701691701"
 */
export function normalizeWhatsAppNumber(rawNumber: string): string {
  const digits = rawNumber.replace(/\D/g, "");
  if (digits.startsWith("03")) {
    return "92" + digits.slice(1);
  }
  if (digits.startsWith("92")) {
    return digits;
  }
  if (digits.startsWith("0092")) {
    return digits.slice(2);
  }
  return digits;
}

/**
 * Generates the master formatted text message strictly adhering to specification
 */
export function generateWhatsAppOrderMessage(order: CustomerOrderDetails): string {
  const parts: string[] = [];

  parts.push("WAHAJ CAFE — THE PIZZA LAB\n");
  parts.push("NEW CUSTOMER ORDER\n");
  parts.push(`Customer Name: ${order.customerName.trim()}`);
  parts.push(`Customer Phone: ${order.customerPhone.trim()}`);
  parts.push(`Order Type: ${order.orderType}`);

  if (order.orderType === "Delivery" && order.deliveryAddress?.trim()) {
    parts.push(`Delivery Address: ${order.deliveryAddress.trim()}`);
  }

  parts.push("\nORDER DETAILS\n");

  order.items.forEach((item, index) => {
    const itemNumber = index + 1;
    parts.push(`${itemNumber}. Product: ${item.name}`);

    if (item.sizeName && item.sizeLabel) {
      parts.push(`   Size: ${item.sizeName}, ${item.sizeLabel}`);
    } else if (item.sizeName) {
      parts.push(`   Size: ${item.sizeName}`);
    }

    parts.push(`   Quantity: ${item.quantity}`);
    parts.push(`   Unit Price: ${formatPKR(item.unitPrice)}`);
    parts.push(`   Line Total: ${formatPKR(item.lineTotal)}`);

    const directImageUrl = item.imageUrl || getPublicImageUrlForWhatsApp(item.id);
    parts.push(directImageUrl ? `   Product Image: ${directImageUrl}\n` : "");
  });

  parts.push(`ORDER SUBTOTAL: ${formatPKR(order.subtotal)}`);
  parts.push(`DELIVERY: FREE DELIVERY`);
  parts.push(`TOTAL PAYABLE: ${formatPKR(order.grandTotal)}\n`);

  if (order.customerNotes?.trim()) {
    parts.push(`Customer Notes: ${order.customerNotes.trim()}\n`);
  }

  parts.push("Please confirm availability and the final order details with the customer.");

  return parts.join("\n");
}

/**
 * Builds the direct WhatsApp click-to-chat URL
 */
export function createWhatsAppClickToChatUrl(
  order: CustomerOrderDetails,
  adminWhatsAppNumber: string
): string {
  const normalizedNumber = normalizeWhatsAppNumber(adminWhatsAppNumber);
  const rawMessage = generateWhatsAppOrderMessage(order);
  const encodedMessage = encodeURIComponent(rawMessage);

  return `https://wa.me/${normalizedNumber}?text=${encodedMessage}`;
}

/**
 * Future WhatsApp Business Platform API Integration Interface
 * When a cloud webhook / WhatsApp Cloud API is provisioned with meta credentials,
 * this adapter routes the order payload through server-side media messages.
 */
export interface WhatsAppBusinessApiResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  mode: "client-click-to-chat" | "server-cloud-api";
}

export async function sendOrderThroughBusinessApi(
  order: CustomerOrderDetails
): Promise<WhatsAppBusinessApiResponse> {
  try {
    const res = await fetch("/api/whatsapp/business-api-simulation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    return {
      success: false,
      mode: "server-cloud-api",
      error: err instanceof Error ? err.message : "WhatsApp Business API server unavailable"
    };
  }
}
