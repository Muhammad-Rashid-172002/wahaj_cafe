/**
 * Wahaj Cafe — The Pizza Lab
 * Centralized product image manifest.
 *
 * One unique, locally stored, optimized image per menu item.
 * - kind "stock-photo": licensed Unsplash photograph, visually checked to show the
 *   named dish. These are REPRESENTATIVE images, not photos of Wahaj Cafe's own plates.
 * - kind "3d-render": rendered from this site's own procedural 3D food models
 *   (used where no licensed photo of the signature dish exists).
 *
 * To swap in the restaurant's own photography, drop a file into
 * public/images/menu/<id>.webp (same name) and set `kind: "restaurant-photo"`,
 * `representative: false`.
 */

import { MENU_ITEMS } from "../data/menu";

export type ImageKind = "stock-photo" | "3d-render" | "restaurant-photo";

export interface ProductImage {
  id: string;
  productName: string;
  category: string;
  imageSrc: string;
  alt: string;
  kind: ImageKind;
  source: string;
  sourceUrl: string | null;
  license: string;
  /** True once a human/agent visually confirmed the picture matches the product. */
  verified: boolean;
  /** True when the image represents the dish but is not the restaurant's own plate. */
  representative: boolean;
  note: string;
}

const ALT: Record<string, string> = Object.fromEntries(MENU_ITEMS.map((m) => [m.id, m.imageAlt]));

export const IMAGE_MANIFEST: ProductImage[] = [
  {
    id: "crown-crust-pizza",
    productName: "Crown Crust Pizza",
    category: "Signature Pizza Lab",
    imageSrc: "/images/menu/crown-crust-pizza.webp",
    alt: ALT["crown-crust-pizza"],
    kind: "3d-render",
    source: "Original procedural 3D render (src/three)",
    sourceUrl: null,
    license: "Original asset — Wahaj Cafe",
    verified: true,
    representative: true,
    note: "No licensed photo of this signature crust exists; rendered from the site's own 3D model"
  },
  {
    id: "the-formula-101",
    productName: "The Formula 101 Pizza",
    category: "Signature Pizza Lab",
    imageSrc: "/images/menu/the-formula-101.webp",
    alt: ALT["the-formula-101"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1717883235373-ef10b2a745a3",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows The Formula 101 Pizza"
  },
  {
    id: "chemical-reaction",
    productName: "Chemical Reaction Pizza",
    category: "Signature Pizza Lab",
    imageSrc: "/images/menu/chemical-reaction.webp",
    alt: ALT["chemical-reaction"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1655673654158-9f7285b7d1ea",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Spicy pizza with onions (representative of Chemical Reaction)"
  },
  {
    id: "overdose-cheese",
    productName: "Overdose Cheese Pizza",
    category: "Signature Pizza Lab",
    imageSrc: "/images/menu/overdose-cheese.webp",
    alt: ALT["overdose-cheese"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1712652080841-9e480a2c43ec",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Overdose Cheese Pizza"
  },
  {
    id: "botanical-fusion",
    productName: "Botanical Fusion Pizza",
    category: "Signature Pizza Lab",
    imageSrc: "/images/menu/botanical-fusion.webp",
    alt: ALT["botanical-fusion"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1788537894870-3e1bafa1fdf6",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Botanical Fusion Pizza"
  },
  {
    id: "kabab-crust-pizza",
    productName: "Kabab Crust Pizza",
    category: "Signature Pizza Lab",
    imageSrc: "/images/menu/kabab-crust-pizza.webp",
    alt: ALT["kabab-crust-pizza"],
    kind: "3d-render",
    source: "Original procedural 3D render (src/three)",
    sourceUrl: null,
    license: "Original asset — Wahaj Cafe",
    verified: true,
    representative: true,
    note: "No licensed photo of this signature crust exists; rendered from the site's own 3D model"
  },
  {
    id: "chicken-tikka-pizza",
    productName: "Chicken Tikka Pizza",
    category: "Pizzas",
    imageSrc: "/images/menu/chicken-tikka-pizza.webp",
    alt: ALT["chicken-tikka-pizza"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1665033628673-7de125eb6b12",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Chicken Tikka Pizza"
  },
  {
    id: "chicken-fajita-pizza",
    productName: "Chicken Fajita Pizza",
    category: "Pizzas",
    imageSrc: "/images/menu/chicken-fajita-pizza.webp",
    alt: ALT["chicken-fajita-pizza"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1595357081381-c34f5634adef",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Chicken Fajita Pizza"
  },
  {
    id: "tandoori-pizza",
    productName: "Tandoori Pizza",
    category: "Pizzas",
    imageSrc: "/images/menu/tandoori-pizza.webp",
    alt: ALT["tandoori-pizza"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1615719413546-198b25453f85",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Chicken pizza with chillies (representative of Tandoori Pizza)"
  },
  {
    id: "cheese-lover-pizza",
    productName: "Cheese Lover Pizza",
    category: "Pizzas",
    imageSrc: "/images/menu/cheese-lover-pizza.webp",
    alt: ALT["cheese-lover-pizza"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1732223229355-95a1433404bf",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Cheese Lover Pizza"
  },
  {
    id: "veggie-lover-pizza",
    productName: "Veggie Lover Pizza",
    category: "Pizzas",
    imageSrc: "/images/menu/veggie-lover-pizza.webp",
    alt: ALT["veggie-lover-pizza"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1625401514458-6c8a5e7d55da",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Veggie Lover Pizza"
  },
  {
    id: "zinger-burger",
    productName: "Zinger Burger",
    category: "Burgers",
    imageSrc: "/images/menu/zinger-burger.webp",
    alt: ALT["zinger-burger"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1655895176036-bf1a11326e5c",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Crispy fried chicken fillet burger with lettuce"
  },
  {
    id: "classic-chicken-burger",
    productName: "Classic Chicken Burger",
    category: "Burgers",
    imageSrc: "/images/menu/classic-chicken-burger.webp",
    alt: ALT["classic-chicken-burger"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1520073201527-6b044ba2ca9f",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Classic Chicken Burger"
  },
  {
    id: "grilled-chicken-burger",
    productName: "Grilled Chicken Burger",
    category: "Burgers",
    imageSrc: "/images/menu/grilled-chicken-burger.webp",
    alt: ALT["grilled-chicken-burger"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Grilled Chicken Burger"
  },
  {
    id: "beef-burger",
    productName: "Beef Burger",
    category: "Burgers",
    imageSrc: "/images/menu/beef-burger.webp",
    alt: ALT["beef-burger"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1767065703793-7012f5fced19",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Beef Burger"
  },
  {
    id: "double-beef-burger",
    productName: "Double Beef Burger",
    category: "Burgers",
    imageSrc: "/images/menu/double-beef-burger.webp",
    alt: ALT["double-beef-burger"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Double Beef Burger"
  },
  {
    id: "lava-jalapeno-burger",
    productName: "Lava Jalapeno Burger",
    category: "Burgers",
    imageSrc: "/images/menu/lava-jalapeno-burger.webp",
    alt: ALT["lava-jalapeno-burger"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1734773343286-99e5068b175b",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Lava Jalapeno Burger"
  },
  {
    id: "chicken-wraps",
    productName: "Chicken Wraps",
    category: "Wraps & Shawarma",
    imageSrc: "/images/menu/chicken-wraps.webp",
    alt: ALT["chicken-wraps"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1666819615040-eff5e52c778a",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Chicken Wraps"
  },
  {
    id: "chicken-shawarma",
    productName: "Chicken Shawarma",
    category: "Wraps & Shawarma",
    imageSrc: "/images/menu/chicken-shawarma.webp",
    alt: ALT["chicken-shawarma"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1719282431565-3b30bb7d2658",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Chicken Shawarma"
  },
  {
    id: "shawarma-platter",
    productName: "Shawarma Platter",
    category: "Wraps & Shawarma",
    imageSrc: "/images/menu/shawarma-platter.webp",
    alt: ALT["shawarma-platter"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1699728088614-7d1d4277414b",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Shawarma Platter"
  },
  {
    id: "club-sandwich",
    productName: "Club Sandwich",
    category: "Sandwiches & Rolls",
    imageSrc: "/images/menu/club-sandwich.webp",
    alt: ALT["club-sandwich"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1716535233357-822bcc293573",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Club Sandwich"
  },
  {
    id: "chicken-rolls",
    productName: "Chicken Paratha Roll",
    category: "Sandwiches & Rolls",
    imageSrc: "/images/menu/chicken-rolls.webp",
    alt: ALT["chicken-rolls"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1755090154723-668718b9cd83",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Chicken Paratha Roll"
  },
  {
    id: "behari-pizza-roll",
    productName: "Behari Pizza Roll",
    category: "Sandwiches & Rolls",
    imageSrc: "/images/menu/behari-pizza-roll.webp",
    alt: ALT["behari-pizza-roll"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1628824851008-ec3ab4b45527",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Baked rolled dough with molten cheese (representative of Behari Pizza Roll)"
  },
  {
    id: "fried-chicken-2pc",
    productName: "Crispy Fried Chicken (2 Pcs)",
    category: "Fried Chicken & Wings",
    imageSrc: "/images/menu/fried-chicken-2pc.webp",
    alt: ALT["fried-chicken-2pc"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1586793783658-261cddf883ef",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Crispy Fried Chicken (2 Pcs)"
  },
  {
    id: "fried-chicken-4pc",
    productName: "Crispy Fried Chicken (4 Pcs)",
    category: "Fried Chicken & Wings",
    imageSrc: "/images/menu/fried-chicken-4pc.webp",
    alt: ALT["fried-chicken-4pc"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Crispy Fried Chicken (4 Pcs)"
  },
  {
    id: "chicken-wings",
    productName: "Chicken Wings (6 Pcs)",
    category: "Fried Chicken & Wings",
    imageSrc: "/images/menu/chicken-wings.webp",
    alt: ALT["chicken-wings"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Chicken Wings (6 Pcs)"
  },
  {
    id: "chicken-nuggets",
    productName: "Chicken Nuggets (6 Pcs)",
    category: "Fried Chicken & Wings",
    imageSrc: "/images/menu/chicken-nuggets.webp",
    alt: ALT["chicken-nuggets"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1627662168223-7df99068099a",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Chicken Nuggets (6 Pcs)"
  },
  {
    id: "creamy-alfredo-pasta",
    productName: "Creamy Alfredo Pasta",
    category: "Pasta",
    imageSrc: "/images/menu/creamy-alfredo-pasta.webp",
    alt: ALT["creamy-alfredo-pasta"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Creamy Alfredo Pasta"
  },
  {
    id: "spicy-red-sauce-penne",
    productName: "Spicy Red Sauce Penne",
    category: "Pasta",
    imageSrc: "/images/menu/spicy-red-sauce-penne.webp",
    alt: ALT["spicy-red-sauce-penne"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1788599760197-81e54ec9c36a",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Spicy Red Sauce Penne"
  },
  {
    id: "pizza-loaded-fries",
    productName: "Pizza Loaded Fries",
    category: "Fries",
    imageSrc: "/images/menu/pizza-loaded-fries.webp",
    alt: ALT["pizza-loaded-fries"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1666304752980-678d5c35c911",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Pizza Loaded Fries"
  },
  {
    id: "tender-fries",
    productName: "Tender Fries",
    category: "Fries",
    imageSrc: "/images/menu/tender-fries.webp",
    alt: ALT["tender-fries"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1768204039907-77a974159ef0",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Chicken tenders with fries and cheese dip (representative of Tender Fries)"
  },
  {
    id: "simple-fries",
    productName: "Simple Fries",
    category: "Fries",
    imageSrc: "/images/menu/simple-fries.webp",
    alt: ALT["simple-fries"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Simple Fries"
  },
  {
    id: "chicken-boti",
    productName: "Chicken Boti (Plate)",
    category: "BBQ",
    imageSrc: "/images/menu/chicken-boti.webp",
    alt: ALT["chicken-boti"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1603496987351-f84a3ba5ec85",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Chicken Boti (Plate)"
  },
  {
    id: "seekh-kabab",
    productName: "Seekh Kabab (4 Skewers)",
    category: "BBQ",
    imageSrc: "/images/menu/seekh-kabab.webp",
    alt: ALT["seekh-kabab"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1708782341231-426344114ace",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Seekh Kabab (4 Skewers)"
  },
  {
    id: "malai-boti",
    productName: "Malai Boti (Plate)",
    category: "BBQ",
    imageSrc: "/images/menu/malai-boti.webp",
    alt: ALT["malai-boti"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1696950171467-231213764c42",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Creamy marinated chicken pieces on a platter (representative of Malai Boti)"
  },
  {
    id: "mint-margarita",
    productName: "Mint Margarita",
    category: "Mocktails & Drinks",
    imageSrc: "/images/menu/mint-margarita.webp",
    alt: ALT["mint-margarita"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1659046842567-2787b5c9c2fe",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Mint Margarita"
  },
  {
    id: "blue-lagoon",
    productName: "Blue Lagoon Mocktail",
    category: "Mocktails & Drinks",
    imageSrc: "/images/menu/blue-lagoon.webp",
    alt: ALT["blue-lagoon"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1682629906883-76eaa5e03693",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Blue Lagoon Mocktail"
  },
  {
    id: "peach-squish",
    productName: "Peach Squish",
    category: "Mocktails & Drinks",
    imageSrc: "/images/menu/peach-squish.webp",
    alt: ALT["peach-squish"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1676693420436-7fa448f054eb",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Peach Squish"
  },
  {
    id: "lemon-soda",
    productName: "Lemon Soda",
    category: "Mocktails & Drinks",
    imageSrc: "/images/menu/lemon-soda.webp",
    alt: ALT["lemon-soda"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1634976245495-443328555f70",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Lemon Soda"
  },
  {
    id: "lemon-ice-tea",
    productName: "Lemon Ice Tea",
    category: "Mocktails & Drinks",
    imageSrc: "/images/menu/lemon-ice-tea.webp",
    alt: ALT["lemon-ice-tea"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Lemon Ice Tea"
  },
  {
    id: "oreo-shake",
    productName: "Oreo Shake",
    category: "Shakes",
    imageSrc: "/images/menu/oreo-shake.webp",
    alt: ALT["oreo-shake"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1641665271888-575e46923776",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Oreo Shake"
  },
  {
    id: "mango-shake",
    productName: "Mango Shake",
    category: "Shakes",
    imageSrc: "/images/menu/mango-shake.webp",
    alt: ALT["mango-shake"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1719239948819-0afeced16184",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Mango Shake"
  },
  {
    id: "date-shake",
    productName: "Date & Almond Shake (Khajoor)",
    category: "Shakes",
    imageSrc: "/images/menu/date-shake.webp",
    alt: ALT["date-shake"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1712056407284-c1eda76e7bcd",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Date & Almond Shake (Khajoor)"
  },
  {
    id: "banana-shake",
    productName: "Banana Shake",
    category: "Shakes",
    imageSrc: "/images/menu/banana-shake.webp",
    alt: ALT["banana-shake"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1685967836529-b0e8d6938227",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Banana Shake"
  },
  {
    id: "apple-shake",
    productName: "Apple Shake",
    category: "Shakes",
    imageSrc: "/images/menu/apple-shake.webp",
    alt: ALT["apple-shake"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1716235597489-b851f1de9657",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Apple Shake"
  },
  {
    id: "mixed-fruit-shake",
    productName: "Mixed Fruit Shake",
    category: "Shakes",
    imageSrc: "/images/menu/mixed-fruit-shake.webp",
    alt: ALT["mixed-fruit-shake"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Mixed Fruit Shake"
  },
  {
    id: "hot-and-sour-soup",
    productName: "Hot & Sour Soup",
    category: "Soups",
    imageSrc: "/images/menu/hot-and-sour-soup.webp",
    alt: ALT["hot-and-sour-soup"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1527976746453-f363eac4d889",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Hot & Sour Soup"
  },
  {
    id: "sweet-corn-soup",
    productName: "Sweet Corn Soup",
    category: "Soups",
    imageSrc: "/images/menu/sweet-corn-soup.webp",
    alt: ALT["sweet-corn-soup"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1781332152789-2165582fddb6",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Sweet Corn Soup"
  },
  {
    id: "mushroom-milk-soup",
    productName: "Mushroom Milk Soup",
    category: "Soups",
    imageSrc: "/images/menu/mushroom-milk-soup.webp",
    alt: ALT["mushroom-milk-soup"],
    kind: "stock-photo",
    source: "Unsplash",
    sourceUrl: "https://images.unsplash.com/photo-1659603851579-17755833517e",
    license: "Unsplash License (free commercial use)",
    verified: true,
    representative: true,
    note: "Visually checked: shows Mushroom Milk Soup"
  }
];

const BY_ID: Record<string, ProductImage> = Object.fromEntries(IMAGE_MANIFEST.map((m) => [m.id, m]));

/** Neutral branded placeholder (never a photo of a different dish). */
export const PLACEHOLDER_IMAGE = "/images/brand/placeholder.svg";

export function getImageEntry(itemId: string): ProductImage | undefined {
  return BY_ID[itemId];
}

export function getProductImage(itemId: string): { url: string; alt: string; kind?: ImageKind } {
  const e = BY_ID[itemId];
  if (e) return { url: e.imageSrc, alt: e.alt, kind: e.kind };
  return { url: PLACEHOLDER_IMAGE, alt: "Wahaj Cafe menu item" };
}

/**
 * Absolute, publicly reachable image URL for WhatsApp order messages.
 * Stock photos use their stable public CDN URL; site-hosted renders use the
 * deployed site origin (skipped on localhost, where the link would not open).
 */
export function getPublicImageUrlForWhatsApp(itemId: string): string {
  const e = BY_ID[itemId];
  if (!e) return "";
  if (e.kind === "stock-photo" && e.sourceUrl) return `${e.sourceUrl}?auto=format&fit=crop&w=1000&q=80`;
  if (typeof window !== "undefined" && !/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(window.location.hostname)) {
    return `${window.location.origin}${e.imageSrc}`;
  }
  return "";
}
