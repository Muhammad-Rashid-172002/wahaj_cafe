/**
 * Wahaj Cafe — The Pizza Lab
 * Master Digital Menu Data
 * Transcribed with 100% fidelity from official restaurant menu boards.
 */

export interface MenuItemSize {
  name: string; // e.g. "Small (6\")", "Medium (10\")", "Large (13\")"
  sizeLabel: string; // e.g. "6 inches", "10 inches", "13 inches"
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  ingredients: string[];
  price: number | null; // null if unconfirmed
  priceConfirmed: boolean;
  sizes?: MenuItemSize[];
  defaultSizeIndex?: number;
  image: string;
  imageAlt: string;
  available: boolean;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  isSpicy?: boolean;
  notes?: string;
}

export const MENU_CATEGORIES = [
  "All",
  "Signature Pizza Lab",
  "Pizzas",
  "Burgers",
  "Wraps & Shawarma",
  "Sandwiches & Rolls",
  "Fried Chicken & Wings",
  "Pasta",
  "Fries",
  "BBQ",
  "Mocktails & Drinks",
  "Shakes",
  "Soups"
] as const;

export type MenuCategory = typeof MENU_CATEGORIES[number];

export const STANDARD_PIZZA_SIZES: MenuItemSize[] = [
  { name: "Small", sizeLabel: "6 inches", price: 550 },
  { name: "Medium", sizeLabel: "10 inches", price: 999 },
  { name: "Large", sizeLabel: "13 inches", price: 1299 }
];

export const SIGNATURE_PIZZA_SIZES: MenuItemSize[] = [
  { name: "Small", sizeLabel: "6 inches", price: 599 },
  { name: "Medium", sizeLabel: "10 inches", price: 1099 },
  { name: "Large", sizeLabel: "13 inches", price: 1399 }
];

export const OVERDOSE_CHEESE_SIZES: MenuItemSize[] = [
  { name: "Small", sizeLabel: "6 inches", price: 650 },
  { name: "Medium", sizeLabel: "10 inches", price: 1150 },
  { name: "Large", sizeLabel: "13 inches", price: 1450 }
];

export const CROWN_CRUST_SIZES: MenuItemSize[] = [
  { name: "Medium", sizeLabel: "10 inches", price: 1199 },
  { name: "Large", sizeLabel: "13 inches", price: 1499 }
];

export const KABAB_CRUST_SIZES: MenuItemSize[] = [
  { name: "Medium", sizeLabel: "10 inches", price: 1250 },
  { name: "Large", sizeLabel: "13 inches", price: 1599 }
];

export const MENU_ITEMS: MenuItem[] = [
  // --- SIGNATURE PIZZA LAB ---
  {
    id: "crown-crust-pizza",
    name: "Crown Crust Pizza",
    category: "Signature Pizza Lab",
    description: "Our crowning glory featuring a majestic handcrafted scalloped crust filled with seasoned meat kababs and creamy melted cheese, crowned with gourmet spiced chicken.",
    ingredients: ["Stuffed Crown Crust", "Gourmet Spiced Chicken", "Mozzarella & Cheddar Pockets", "Red Onions", "Black Olives", "Lab Secret Sauce"],
    price: 1199,
    priceConfirmed: true,
    sizes: CROWN_CRUST_SIZES,
    defaultSizeIndex: 0,
    image: "/images/menu/crown-crust-pizza.webp",
    imageAlt: "Crown Crust Pizza with distinctive stuffed crown peaks and bubbling cheese",
    available: true,
    isPopular: true,
    isChefSpecial: true,
    notes: "Signature preparation featuring stuffed crown rim pockets."
  },
  {
    id: "the-formula-101",
    name: "The Formula 101 Pizza",
    category: "Signature Pizza Lab",
    description: "The Pizza Lab's flagship formula: wood-smoked chicken fillets, earthy portobello mushrooms, pickled jalapenos, and a double-tier secret aromatic herb reduction.",
    ingredients: ["Smoked Chicken", "Portobello Mushrooms", "Pickled Jalapenos", "Double Mozzarella", "Chef Herb Formula Sauce"],
    price: 599,
    priceConfirmed: true,
    sizes: SIGNATURE_PIZZA_SIZES,
    defaultSizeIndex: 1,
    image: "/images/menu/the-formula-101.webp",
    imageAlt: "The Formula 101 Pizza Lab creation with smoked chicken and herb reduction",
    available: true,
    isPopular: true,
    isChefSpecial: true,
    isSpicy: true,
    notes: "Pizza Lab proprietary recipe."
  },
  {
    id: "chemical-reaction",
    name: "Chemical Reaction Pizza",
    category: "Signature Pizza Lab",
    description: "A fiery explosion of spicy grilled peri chicken, fiery red paprika flakes, caramelized onion crisps, and molten volcanic cheese blend.",
    ingredients: ["Fiery Grilled Chicken", "Red Paprika", "Chipotle Volcanic Sauce", "Caramelized Red Onions", "Molten Cheddar-Mozzarella Blend"],
    price: 599,
    priceConfirmed: true,
    sizes: SIGNATURE_PIZZA_SIZES,
    defaultSizeIndex: 1,
    image: "/images/menu/chemical-reaction.webp",
    imageAlt: "Chemical Reaction pizza with vibrant red paprika and molten spicy cheese",
    available: true,
    isChefSpecial: true,
    isSpicy: true
  },
  {
    id: "overdose-cheese",
    name: "Overdose Cheese Pizza",
    category: "Signature Pizza Lab",
    description: "An unapologetic eruption of stringy fior di latte mozzarella, aged sharp cheddar, creamy gouda, and aromatic parmesan crisp.",
    ingredients: ["Fior di Latte Mozzarella", "Sharp Cheddar", "Dutch Gouda", "Parmigiano Reggiano", "Garlic Butter Crust Brush"],
    price: 650,
    priceConfirmed: true,
    sizes: OVERDOSE_CHEESE_SIZES,
    defaultSizeIndex: 1,
    image: "/images/menu/overdose-cheese.webp",
    imageAlt: "Overdose Cheese Pizza with deep stretch and golden blistering",
    available: true,
    isPopular: true
  },
  {
    id: "botanical-fusion",
    name: "Botanical Fusion Pizza",
    category: "Signature Pizza Lab",
    description: "Artisanal basil pesto swirl with fire-roasted bell peppers, sun-ripened Italian tomatoes, Kalamata olives, roasted garlic, and mozzarella.",
    ingredients: ["Sweet Basil Pesto", "Roasted Bell Peppers", "Sun-Ripened Tomatoes", "Kalamata Olives", "Roasted Garlic Confit", "Fior di Latte"],
    price: 599,
    priceConfirmed: true,
    sizes: SIGNATURE_PIZZA_SIZES,
    defaultSizeIndex: 1,
    image: "/images/menu/botanical-fusion.webp",
    imageAlt: "Botanical Fusion pizza with vibrant green basil pesto and colorful roasted vegetables",
    available: true
  },
  {
    id: "kabab-crust-pizza",
    name: "Kabab Crust Pizza",
    category: "Signature Pizza Lab",
    description: "Tender, juicy seekh kababs tucked seamlessly into the outer golden dough crust, finished with rich spicy meat toppings and melted mozzarella.",
    ingredients: ["Stuffed Seekh Kabab Crust", "Tikka Chunks", "Mozzarella Cheese", "Sliced Capsicum", "Tomato Onion Relish"],
    price: 1250,
    priceConfirmed: true,
    sizes: KABAB_CRUST_SIZES,
    defaultSizeIndex: 0,
    image: "/images/menu/kabab-crust-pizza.webp",
    imageAlt: "Kabab Crust Pizza featuring seekh kabab stuffed along the outer crust edge",
    available: true,
    isPopular: true
  },

  // --- CLASSIC PIZZAS ---
  {
    id: "chicken-tikka-pizza",
    name: "Chicken Tikka Pizza",
    category: "Pizzas",
    description: "Traditional coal-marinated chicken tikka cubes with sweet sliced red onions, vibrant green capsicum, and generous golden mozzarella.",
    ingredients: ["Charcoal Chicken Tikka", "Red Onion Slices", "Green Capsicum", "Premium Mozzarella", "Traditional Herb Pizza Sauce"],
    price: 550,
    priceConfirmed: true,
    sizes: STANDARD_PIZZA_SIZES,
    defaultSizeIndex: 1,
    image: "/images/menu/chicken-tikka-pizza.webp",
    imageAlt: "Authentic Chicken Tikka Pizza with tender marinated tikka cubes and herbs",
    available: true,
    isPopular: true
  },
  {
    id: "chicken-fajita-pizza",
    name: "Chicken Fajita Pizza",
    category: "Pizzas",
    description: "Zesty Mexican-spiced chicken fajita slices, sauteed tricolor bell peppers, crisp onions, and creamy melted mozzarella.",
    ingredients: ["Fajita Chicken", "Tricolor Bell Peppers", "Crisp Red Onions", "Mozzarella Cheese", "Zesty Fajita Seasoning"],
    price: 550,
    priceConfirmed: true,
    sizes: STANDARD_PIZZA_SIZES,
    defaultSizeIndex: 1,
    image: "/images/menu/chicken-fajita-pizza.webp",
    imageAlt: "Chicken Fajita Pizza topped with colorful bell peppers and seasoned fajita chicken",
    available: true,
    isPopular: true
  },
  {
    id: "tandoori-pizza",
    name: "Tandoori Pizza",
    category: "Pizzas",
    description: "Smokey clay-oven tandoori chicken chunks tossed in aromatic Punjabi spices with sweet onions, green chillies, and melted cheese.",
    ingredients: ["Clay Oven Tandoori Chicken", "Sliced Red Onions", "Fresh Green Chillies", "Mozzarella", "Smoky Marinara"],
    price: 550,
    priceConfirmed: true,
    sizes: STANDARD_PIZZA_SIZES,
    defaultSizeIndex: 1,
    image: "/images/menu/tandoori-pizza.webp",
    imageAlt: "Tandoori Pizza featuring aromatic clay-oven chicken chunks and fresh chillies",
    available: true,
    isSpicy: true
  },
  {
    id: "cheese-lover-pizza",
    name: "Cheese Lover Pizza",
    category: "Pizzas",
    description: "Double layer of prime creamy mozzarella and sharp cheddar infused with Italian oregano and basil on our golden hand-tossed crust.",
    ingredients: ["Double Mozzarella", "Sharp Cheddar", "Italian Oregano", "San Marzano Style Pizza Sauce"],
    price: 550,
    priceConfirmed: true,
    sizes: STANDARD_PIZZA_SIZES,
    defaultSizeIndex: 1,
    image: "/images/menu/cheese-lover-pizza.webp",
    imageAlt: "Cheese Lover Pizza with golden bubbling cheese crust and herbs",
    available: true
  },
  {
    id: "veggie-lover-pizza",
    name: "Veggie Lover Pizza",
    category: "Pizzas",
    description: "Fresh garden bounty: sliced black olives, crunchy bell peppers, button mushrooms, sweet golden corn, and fresh red onions on melted mozzarella.",
    ingredients: ["Black Olives", "Bell Peppers", "Button Mushrooms", "Sweet Corn", "Red Onions", "Mozzarella Cheese"],
    price: 550,
    priceConfirmed: true,
    sizes: STANDARD_PIZZA_SIZES,
    defaultSizeIndex: 1,
    image: "/images/menu/veggie-lover-pizza.webp",
    imageAlt: "Veggie Lover Pizza loaded with mushrooms, black olives, sweet corn, and peppers",
    available: true
  },

  // --- BURGERS ---
  {
    id: "zinger-burger",
    name: "Zinger Burger",
    category: "Burgers",
    description: "Ultra-crispy double-dredged chicken breast fillet, iceberg lettuce, and Wahaj's signature garlic pepper mayo on a toasted brioche bun.",
    ingredients: ["Crispy Battered Chicken Breast", "Fresh Iceberg Lettuce", "Garlic Pepper Mayo", "Toasted Brioche Bun"],
    price: 450,
    priceConfirmed: true,
    image: "/images/menu/zinger-burger.webp",
    imageAlt: "Crispy golden Zinger Burger with overflowing crunchy chicken fillet and creamy sauce",
    available: true,
    isPopular: true
  },
  {
    id: "classic-chicken-burger",
    name: "Classic Chicken Burger",
    category: "Burgers",
    description: "Juicy golden minced chicken patty, crisp butterhead lettuce, sliced tomato, and house burger dressing.",
    ingredients: ["Minced Chicken Patty", "Crisp Lettuce", "Tomato Slice", "House Burger Mayo", "Sesame Seed Bun"],
    price: 380,
    priceConfirmed: true,
    image: "/images/menu/classic-chicken-burger.webp",
    imageAlt: "Classic Chicken Burger with fresh lettuce and sesame seed bun",
    available: true
  },
  {
    id: "grilled-chicken-burger",
    name: "Grilled Chicken Burger",
    category: "Burgers",
    description: "Tender herb-marinated flame-grilled chicken breast fillet, caramelized onions, smoked barbecue drizzle, and melted cheddar.",
    ingredients: ["Flame-Grilled Chicken Breast", "Caramelized Onions", "Smoked BBQ Sauce", "Cheddar Slice", "Brioche Bun"],
    price: 480,
    priceConfirmed: true,
    image: "/images/menu/grilled-chicken-burger.webp",
    imageAlt: "Grilled Chicken Burger featuring charred grill marks and savory barbecue glaze",
    available: true,
    isPopular: true
  },
  {
    id: "beef-burger",
    name: "Beef Burger",
    category: "Burgers",
    description: "Hand-smashed 100% prime beef patty seared to perfection, melted cheddar cheese, dill pickles, and secret relish sauce.",
    ingredients: ["Prime Smashed Beef Patty", "Melted American Cheddar", "Dill Pickles", "Diced Onions", "Wahaj Secret Relish"],
    price: 520,
    priceConfirmed: true,
    image: "/images/menu/beef-burger.webp",
    imageAlt: "Juicy gourmet Beef Burger with melted cheddar cheese and pickles",
    available: true,
    isPopular: true
  },
  {
    id: "double-beef-burger",
    name: "Double Beef Burger",
    category: "Burgers",
    description: "Double stacked hand-smashed beef patties, twin slices of aged cheddar, caramelized onions, crisp greens, and house burger glaze.",
    ingredients: ["Two Smashed Beef Patties", "Twin Aged Cheddar Slices", "Caramelized Onions", "Crisp Greens", "Glaze Sauce"],
    price: 680,
    priceConfirmed: true,
    image: "/images/menu/double-beef-burger.webp",
    imageAlt: "Double Beef Burger with two thick patties and double dripping cheddar cheese",
    available: true,
    isPopular: true
  },
  {
    id: "lava-jalapeno-burger",
    name: "Lava Jalapeno Burger",
    category: "Burgers",
    description: "Crispy golden chicken fillet stuffed with molten spicy jalapeno cheese lava that erupts on the first bite.",
    ingredients: ["Jalapeno Cheese Stuffed Fillet", "Pickled Jalapeno Slices", "Spicy Chipotle Mayo", "Crisp Lettuce"],
    price: 520,
    priceConfirmed: true,
    image: "/images/menu/lava-jalapeno-burger.webp",
    imageAlt: "Lava Jalapeno Burger with oozing spicy cheese filling and jalapenos",
    available: true,
    isChefSpecial: true,
    isSpicy: true
  },

  // --- WRAPS & SHAWARMA ---
  {
    id: "chicken-wraps",
    name: "Chicken Wraps",
    category: "Wraps & Shawarma",
    description: "Char-grilled seasoned chicken breast strips, crunchy romaine lettuce, diced tomatoes, and garlic cream in a warm grilled tortilla.",
    ingredients: ["Char-Grilled Chicken Strips", "Romaine Lettuce", "Diced Tomatoes", "Garlic Cream Sauce", "Warm Flour Tortilla"],
    price: 380,
    priceConfirmed: true,
    image: "/images/menu/chicken-wraps.webp",
    imageAlt: "Grilled Chicken Wrap sliced diagonally showing juicy seasoned chicken and fresh vegetables",
    available: true,
    isPopular: true
  },
  {
    id: "chicken-shawarma",
    name: "Chicken Shawarma",
    category: "Wraps & Shawarma",
    description: "Authentic slow-roasted spit chicken carved thin, pickled cucumbers, salty french fries, and rich creamy garlic toum wrapped in soft pita.",
    ingredients: ["Spit-Carved Chicken", "Pickled Cucumbers", "Golden Fries", "Authentic Garlic Toum", "Soft Arabic Pita"],
    price: 240,
    priceConfirmed: true,
    image: "/images/menu/chicken-shawarma.webp",
    imageAlt: "Authentic Arabic Chicken Shawarma wrapped in golden toasted pita",
    available: true,
    isPopular: true
  },
  {
    id: "shawarma-platter",
    name: "Shawarma Platter",
    category: "Wraps & Shawarma",
    description: "A feast of carved shawarma chicken, warm toasted pita wedges, golden fries, pickled turnip, hummus, and generous whipped garlic toum dip.",
    ingredients: ["Carved Shawarma Chicken", "Toasted Pita Triangles", "French Fries", "Hummus & Garlic Toum", "Pickled Turnip & Cucumber"],
    price: 550,
    priceConfirmed: true,
    image: "/images/menu/shawarma-platter.webp",
    imageAlt: "Generous Shawarma Platter with carved chicken, dips, toasted pita, and fresh pickles",
    available: true,
    isPopular: true
  },

  // --- SANDWICHES & ROLLS ---
  {
    id: "club-sandwich",
    name: "Club Sandwich",
    category: "Sandwiches & Rolls",
    description: "Triple-layer toasted sandwich filled with slow-cooked shredded chicken, fried egg, cheddar slice, crisp lettuce, tomato, served with golden fries.",
    ingredients: ["Toasted Bread", "Shredded Roasted Chicken", "Fried Egg", "Cheddar Slice", "Tomato & Lettuce", "Served with French Fries"],
    price: 450,
    priceConfirmed: true,
    image: "/images/menu/club-sandwich.webp",
    imageAlt: "Triple decker Club Sandwich cut into quarters with golden crispy fries",
    available: true,
    isPopular: true
  },
  {
    id: "chicken-rolls",
    name: "Chicken Paratha Roll",
    category: "Sandwiches & Rolls",
    description: "Charcoal-grilled spiced chicken boti rolled in a flaky golden pan-fried paratha with sliced red onions and refreshing mint coriander chutney.",
    ingredients: ["Charcoal Chicken Boti", "Crispy Flaky Paratha", "Sliced Red Onions", "Mint Coriander Chutney"],
    price: 250,
    priceConfirmed: true,
    image: "/images/menu/chicken-rolls.webp",
    imageAlt: "Crispy Paratha Chicken Roll wrapped tightly with succulent spiced chicken chunks",
    available: true,
    isPopular: true
  },
  {
    id: "behari-pizza-roll",
    name: "Behari Pizza Roll",
    category: "Sandwiches & Rolls",
    description: "Wahaj Cafe fusion invention: tender spiced behari marinated chicken and melted mozzarella rolled together in baked herbal dough.",
    ingredients: ["Behari Spiced Chicken", "Melting Mozzarella", "Herbal Rolled Dough", "Spicy Dip"],
    price: 320,
    priceConfirmed: true,
    image: "/images/menu/behari-pizza-roll.webp",
    imageAlt: "Baked Behari Pizza Roll with melted cheese stretching from spicy marinated chicken",
    available: true,
    isChefSpecial: true,
    isSpicy: true
  },

  // --- FRIED CHICKEN & WINGS ---
  {
    id: "fried-chicken-2pc",
    name: "Crispy Fried Chicken (2 Pcs)",
    category: "Fried Chicken & Wings",
    description: "Deeply seasoned crispy broast chicken pieces with crackling golden crust and steaming tender meat inside.",
    ingredients: ["Fresh Bone-in Chicken", "Secret 11-Spice Dredge", "Garlic Dip", "Dinner Bun"],
    price: 420,
    priceConfirmed: true,
    image: "/images/menu/fried-chicken-2pc.webp",
    imageAlt: "Golden crunchy Fried Chicken pieces with visible spice flakes and crackling crust",
    available: true,
    isPopular: true
  },
  {
    id: "fried-chicken-4pc",
    name: "Crispy Fried Chicken (4 Pcs)",
    category: "Fried Chicken & Wings",
    description: "Four generous portions of our signature golden crispy fried chicken with garlic dip and fresh fries.",
    ingredients: ["4 Pcs Crispy Chicken", "Secret Spice Dredge", "French Fries", "Garlic Mayo Dip"],
    price: 780,
    priceConfirmed: true,
    image: "/images/menu/fried-chicken-4pc.webp",
    imageAlt: "Four pieces of hot crispy fried chicken piled high with golden fries",
    available: true
  },
  {
    id: "chicken-wings",
    name: "Chicken Wings (6 Pcs)",
    category: "Fried Chicken & Wings",
    description: "Crispy glazed chicken wings tossed in your choice of spicy hot buffalo or sweet honey smoky barbecue sauce.",
    ingredients: ["Crispy Fried Wings", "Spicy Buffalo / Smoky BBQ Glaze", "Ranch Dip", "Sesame Seed Garnish"],
    price: 420,
    priceConfirmed: true,
    image: "/images/menu/chicken-wings.webp",
    imageAlt: "Glazed Chicken Wings with glistening spicy sauce and fresh parsley garnish",
    available: true,
    isPopular: true
  },
  {
    id: "chicken-nuggets",
    name: "Chicken Nuggets (6 Pcs)",
    category: "Fried Chicken & Wings",
    description: "Bite-sized tender all-white meat chicken nuggets in a crispy golden batter, served with tangy honey mustard dip.",
    ingredients: ["100% Chicken Breast Meat", "Crispy Golden Batter", "Honey Mustard Dip"],
    price: 320,
    priceConfirmed: true,
    image: "/images/menu/chicken-nuggets.webp",
    imageAlt: "Golden crisp chicken nuggets stacked with sweet honey mustard dipping sauce",
    available: true
  },

  // --- PASTA ---
  {
    id: "creamy-alfredo-pasta",
    name: "Creamy Alfredo Pasta",
    category: "Pasta",
    description: "Al dente penne pasta tossed in rich garlic parmesan cream sauce, seasoned grilled chicken breast ribbons, and freshly chopped flat-leaf parsley.",
    ingredients: ["Penne Rigate", "Heavy Cream", "Aged Parmigiano Reggiano", "Grilled Chicken Strips", "Fresh Garlic & Parsley"],
    price: 650,
    priceConfirmed: true,
    image: "/images/menu/creamy-alfredo-pasta.webp",
    imageAlt: "Creamy Alfredo Pasta with penne, grilled chicken slices, and shaved parmesan",
    available: true,
    isPopular: true
  },
  {
    id: "spicy-red-sauce-penne",
    name: "Spicy Red Sauce Penne",
    category: "Pasta",
    description: "Fiery arrabbiata plum tomato sauce simmered with chili flakes, roasted garlic, black olives, bell peppers, and tender chicken chunks.",
    ingredients: ["Penne Rigate", "San Marzano Plum Tomato Sauce", "Crushed Chili Flakes", "Black Olives", "Grilled Chicken"],
    price: 590,
    priceConfirmed: true,
    image: "/images/menu/spicy-red-sauce-penne.webp",
    imageAlt: "Spicy Red Sauce Penne Pasta with bright red arrabbiata sauce and herbs",
    available: true,
    isSpicy: true
  },

  // --- FRIES ---
  {
    id: "pizza-loaded-fries",
    name: "Pizza Loaded Fries",
    category: "Fries",
    description: "A bed of golden crispy french fries baked under rich pizza marinara, melted mozzarella cheese, beef pepperoni slices, and black olives.",
    ingredients: ["Crispy Fries", "Pizza Marinara Sauce", "Melted Mozzarella", "Pepperoni Slices", "Black Olives", "Oregano Dust"],
    price: 450,
    priceConfirmed: true,
    image: "/images/menu/pizza-loaded-fries.webp",
    imageAlt: "Golden french fries smothered in melted pizza cheese and pepperoni slices",
    available: true,
    isPopular: true
  },
  {
    id: "tender-fries",
    name: "Tender Fries",
    category: "Fries",
    description: "Crispy golden fries topped with chopped crispy chicken tender bites, warm cheddar cheese sauce, pickled jalapeno rings, and chipotle drizzle.",
    ingredients: ["Crispy Golden Fries", "Crispy Chicken Tender Bites", "Cheddar Cheese Sauce", "Pickled Jalapenos", "Chipotle Drizzle"],
    price: 420,
    priceConfirmed: true,
    image: "/images/menu/tender-fries.webp",
    imageAlt: "Loaded french fries with crispy chicken tender chunks and cheddar sauce",
    available: true,
    isPopular: true
  },
  {
    id: "simple-fries",
    name: "Simple Fries",
    category: "Fries",
    description: "Freshly cut, double-fried crispy potato batons tossed in sea salt and Wahaj special herbal fry spice.",
    ingredients: ["Fresh Cut Potatoes", "Sea Salt", "Herbal Fry Seasoning"],
    price: 220,
    priceConfirmed: true,
    image: "/images/menu/simple-fries.webp",
    imageAlt: "Classic crispy golden salted french fries in a rustic serving basket",
    available: true
  },

  // --- BBQ SPECIALTIES ---
  {
    id: "chicken-boti",
    name: "Chicken Boti (Plate)",
    category: "BBQ",
    description: "Boneless chicken thigh cubes marinated in mustard oil, roasted cumin, Kashmiri red chili, and ginger garlic, char-grilled over natural coals.",
    ingredients: ["Boneless Chicken Thigh", "Desi BBQ Spices", "Mustard Oil & Lemon", "Mint Chutney & Onions"],
    price: 450,
    priceConfirmed: true,
    image: "/images/menu/chicken-boti.webp",
    imageAlt: "Skewered char-grilled Chicken Boti cubes with glowing coal smoke",
    available: true,
    isPopular: true
  },
  {
    id: "seekh-kabab",
    name: "Seekh Kabab (4 Skewers)",
    category: "BBQ",
    description: "Finely minced seasoned chicken and beef skewers infused with green coriander, mint, onions, and garam masala, flame-grilled on iron skewers.",
    ingredients: ["Minced Spiced Meat", "Fresh Coriander & Mint", "Chopped Green Chillies", "Coal Smoked"],
    price: 420,
    priceConfirmed: true,
    image: "/images/menu/seekh-kabab.webp",
    imageAlt: "Succulent sizzling Seekh Kababs straight from the grill with lemon wedges",
    available: true,
    isPopular: true
  },
  {
    id: "malai-boti",
    name: "Malai Boti (Plate)",
    category: "BBQ",
    description: "Melt-in-the-mouth boneless chicken cubes marinated in heavy fresh dairy cream, green chillies, crushed white pepper, and fragrant cardamom.",
    ingredients: ["Chicken Breast Cubes", "Fresh Heavy Dairy Cream", "Green Cardamom", "White Pepper", "Coal Grilled"],
    price: 490,
    priceConfirmed: true,
    image: "/images/menu/malai-boti.webp",
    imageAlt: "Velvety white Malai Boti skewers lightly charred with creamy aromatic glaze",
    available: true,
    isPopular: true
  },

  // --- MOCKTAILS & DRINKS ---
  {
    id: "mint-margarita",
    name: "Mint Margarita",
    category: "Mocktails & Drinks",
    description: "Wahaj's signature ice frost drink: fresh crushed garden mint leaves, freshly squeezed Persian lime juice, sprite, and black Himalayan mineral salt.",
    ingredients: ["Fresh Crushed Mint", "Lime Juice", "Chilled Soda", "Black Himalayan Salt", "Crushed Frost Ice"],
    price: 250,
    priceConfirmed: true,
    image: "/images/menu/mint-margarita.webp",
    imageAlt: "Frosty emerald green Mint Margarita glass rimmed with salt and lime wheel",
    available: true,
    isPopular: true
  },
  {
    id: "blue-lagoon",
    name: "Blue Lagoon Mocktail",
    category: "Mocktails & Drinks",
    description: "Vibrant sapphire blue curacao infused citrus cooler with sparkling carbonated soda, fresh lemon wheel, and crushed ice.",
    ingredients: ["Blue Curacao Reduction", "Citrus Lemon Juice", "Sparkling Soda", "Crushed Ice", "Mint Sprig"],
    price: 260,
    priceConfirmed: true,
    image: "/images/menu/blue-lagoon.webp",
    imageAlt: "Vivid azure Blue Lagoon mocktail with condensation on elegant tall glass",
    available: true,
    isPopular: true
  },
  {
    id: "peach-squish",
    name: "Peach Squish",
    category: "Mocktails & Drinks",
    description: "Sun-ripened orchard peach nectar blended with zesty lime soda and fine crushed ice crystals.",
    ingredients: ["Peach Nectar", "Lime Juice", "Effervescent Soda", "Crushed Ice"],
    price: 260,
    priceConfirmed: true,
    image: "/images/menu/peach-squish.webp",
    imageAlt: "Golden sunset Peach Squish mocktail with peach slices and ice",
    available: true
  },
  {
    id: "lemon-soda",
    name: "Lemon Soda",
    category: "Mocktails & Drinks",
    description: "Classic fizzy digestive cooler with fresh squeezed lemon juice, sparkling club soda, and a touch of black salt.",
    ingredients: ["Fresh Lemon Juice", "Club Soda", "Black Salt & Rock Sugar", "Ice Cubes"],
    price: 180,
    priceConfirmed: true,
    image: "/images/menu/lemon-soda.webp",
    imageAlt: "Bubbly Lemon Soda in a clear glass with effervescent carbonation",
    available: true
  },
  {
    id: "lemon-ice-tea",
    name: "Lemon Ice Tea",
    category: "Mocktails & Drinks",
    description: "Slow-brewed aromatic Ceylon black tea infused with real lemon zest, cane sugar, and served ice cold.",
    ingredients: ["Brewed Ceylon Black Tea", "Lemon Zest & Juice", "Cane Sugar", "Ice"],
    price: 220,
    priceConfirmed: true,
    image: "/images/menu/lemon-ice-tea.webp",
    imageAlt: "Amber chilled Lemon Ice Tea with lemon slice and fresh mint",
    available: true
  },

  // --- SHAKES ---
  {
    id: "oreo-shake",
    name: "Oreo Shake",
    category: "Shakes",
    description: "Decadent thick shake whipped with vanilla bean ice cream, crushed whole Oreo cookies, chocolate sauce drizzle, and whipped cream crown.",
    ingredients: ["Vanilla Ice Cream", "Whole Oreo Cookies", "Chilled Full Cream Milk", "Dark Chocolate Drizzle", "Whipped Cream"],
    price: 320,
    priceConfirmed: true,
    image: "/images/menu/oreo-shake.webp",
    imageAlt: "Rich Oreo Shake topped with crushed cookie crumbs and dark chocolate drizzle",
    available: true,
    isPopular: true
  },
  {
    id: "mango-shake",
    name: "Mango Shake",
    category: "Shakes",
    description: "Thick velvety shake crafted from sweet Chaunsa/Sindhri mango pulp, rich whole milk, and scoops of dairy ice cream.",
    ingredients: ["Ripe Mango Pulp", "Full Cream Milk", "Dairy Ice Cream", "Crushed Pistachio Dust"],
    price: 280,
    priceConfirmed: true,
    image: "/images/menu/mango-shake.webp",
    imageAlt: "Thick sunshine yellow Mango Shake with sliced mango garnish",
    available: true,
    isPopular: true
  },
  {
    id: "date-shake",
    name: "Date & Almond Shake (Khajoor)",
    category: "Shakes",
    description: "Wholesome natural energy elixir made with sweet Arabian dates, roasted crushed almonds, honey, and creamy whole milk.",
    ingredients: ["Arabian Soft Dates", "Roasted Almonds", "Natural Honey", "Chilled Milk"],
    price: 350,
    priceConfirmed: true,
    image: "/images/menu/date-shake.webp",
    imageAlt: "Creamy Date and Almond Khajoor Shake topped with slivered almonds",
    available: true,
    isPopular: true
  },
  {
    id: "banana-shake",
    name: "Banana Shake",
    category: "Shakes",
    description: "Ripe golden bananas blended with whole milk, vanilla essence, and a touch of wild honey.",
    ingredients: ["Golden Bananas", "Chilled Whole Milk", "Vanilla", "Honey"],
    price: 250,
    priceConfirmed: true,
    image: "/images/menu/banana-shake.webp",
    imageAlt: "Frothy chilled Banana Shake in a milkshake glass",
    available: true
  },
  {
    id: "apple-shake",
    name: "Apple Shake",
    category: "Shakes",
    description: "Crisp red apples blended with creamy milk and a sprinkle of cinnamon powder.",
    ingredients: ["Fresh Red Apples", "Creamy Milk", "Cinnamon Dust", "Crushed Ice"],
    price: 260,
    priceConfirmed: true,
    image: "/images/menu/apple-shake.webp",
    imageAlt: "Smooth Apple Shake with sliced apple garnish and cinnamon",
    available: true
  },
  {
    id: "mixed-fruit-shake",
    name: "Mixed Fruit Shake",
    category: "Shakes",
    description: "A tropical cocktail blend of fresh seasonal orchard fruits whipped with ice cream and chilled milk.",
    ingredients: ["Seasonal Mixed Fruits", "Dairy Milk", "Vanilla Scoop"],
    price: 290,
    priceConfirmed: true,
    image: "/images/menu/mixed-fruit-shake.webp",
    imageAlt: "Colorful multi-layer Mixed Fruit Shake with fresh fruit pieces",
    available: true
  },

  // --- SOUPS ---
  {
    id: "hot-and-sour-soup",
    name: "Hot & Sour Soup",
    category: "Soups",
    description: "Hearty traditional Chinese broth simmering with shredded chicken breast, button mushrooms, tofu, egg ribbon ribbons, dark vinegar, and chili oil.",
    ingredients: ["Slow-Simmered Chicken Broth", "Shredded Chicken", "Wood Ear Mushrooms", "Silken Egg Ribbons", "Aged Dark Vinegar & Chili Oil"],
    price: 320,
    priceConfirmed: true,
    image: "/images/menu/hot-and-sour-soup.webp",
    imageAlt: "Steaming bowl of Hot and Sour Soup with chicken strips, mushrooms, and spring onions",
    available: true,
    isPopular: true,
    isSpicy: true
  },
  {
    id: "sweet-corn-soup",
    name: "Sweet Corn Soup",
    category: "Soups",
    description: "Velvety chicken and sweet corn broth with tender shredded chicken and delicate whipped egg drops.",
    ingredients: ["Sweet Golden Corn Kernels", "Shredded Chicken Breast", "Clear Chicken Broth", "Egg Drop Ribbons", "White Pepper"],
    price: 300,
    priceConfirmed: true,
    image: "/images/menu/sweet-corn-soup.webp",
    imageAlt: "Silky Sweet Corn Soup with tender chicken bits and golden corn",
    available: true
  },
  {
    id: "mushroom-milk-soup",
    name: "Mushroom Milk Soup",
    category: "Soups",
    description: "European-style rich and creamy velvety wild mushroom soup made with whole dairy milk, butter, and freshly cracked black pepper.",
    ingredients: ["Sauteed Wild Mushrooms", "Whole Dairy Milk & Butter", "Garlic Confit", "Fresh Parsley & Cracked Pepper"],
    price: 350,
    priceConfirmed: true,
    image: "/images/menu/mushroom-milk-soup.webp",
    imageAlt: "Creamy Mushroom Milk Soup served in a ceramic bowl with herbs and cracked pepper",
    available: true,
    isChefSpecial: true
  }
];

export function getMenuItemById(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((item) => item.id === id);
}

export function getMenuItemsByCategory(category: string): MenuItem[] {
  if (category === "All") return MENU_ITEMS;
  return MENU_ITEMS.filter((item) => item.category === category);
}
