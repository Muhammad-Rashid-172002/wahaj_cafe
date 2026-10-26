/**
 * Wahaj Cafe — The Pizza Lab
 * Restaurant Configuration & Contact Administration
 */

export interface RestaurantConfig {
  restaurantName: string;
  brandName: string;
  tagline: string;
  primaryWhatsApp: string; // International format without + for wa.me e.g. "923701691701"
  primaryWhatsAppDisplay: string; // Display format e.g. "0317-5177197"
  secondaryWhatsApp: string; // e.g. "923175174541"
  secondaryWhatsAppDisplay: string; // e.g. "0317-5174541"
  address: string;
  addressLandmark: string;
  city: string;
  deliveryPromotion: string;
  openingHours: string;
  googleMapsUrl: string;
  isWhatsAppVerified: boolean;
  unconfirmedItemsNotice: string;
}

export const initialRestaurantConfig: RestaurantConfig = {
  restaurantName: "WAHAJ CAFE",
  brandName: "THE PIZZA LAB",
  tagline: "Crafted for Cravings. The Science of Gourmet Flavors.",
  primaryWhatsApp: "923701691701",
  primaryWhatsAppDisplay: "0317-5177197",
  secondaryWhatsApp: "923175174541",
  secondaryWhatsAppDisplay: "0317-5174541",
  address: "Near Islamabad International Hospital, Northern Strip, FECHS, E-11/2 Basement, Islamabad",
  addressLandmark: "FECHS E-11/2 Basement, Near Islamabad International Hospital",
  city: "Islamabad, Pakistan",
  deliveryPromotion: "FREE DELIVERY",
  openingHours: "12:00 PM – 02:00 AM Daily",
  googleMapsUrl: "https://maps.google.com/?q=FECHS+E-11/2+Islamabad",
  isWhatsAppVerified: true,
  unconfirmedItemsNotice: "All visible menu prices have been transcribed from the official printed menu. Special seasonal platters require availability confirmation."
};

// Local storage key for administrator customization
export const RESTAURANT_CONFIG_STORAGE_KEY = "wahaj_cafe_restaurant_config_v1";

export function getStoredRestaurantConfig(): RestaurantConfig {
  if (typeof window === "undefined") return initialRestaurantConfig;
  try {
    const raw = localStorage.getItem(RESTAURANT_CONFIG_STORAGE_KEY);
    if (!raw) return initialRestaurantConfig;
    return { ...initialRestaurantConfig, ...JSON.parse(raw) };
  } catch {
    return initialRestaurantConfig;
  }
}

export function saveStoredRestaurantConfig(config: RestaurantConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RESTAURANT_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error("Failed to save restaurant configuration:", err);
  }
}
