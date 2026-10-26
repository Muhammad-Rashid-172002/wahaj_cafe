/**
 * Wahaj Cafe — The Pizza Lab
 * Recipe → 3D layer mapping.
 *
 * Every visible layer in the exploded 3D scenes is derived from the
 * ingredient strings in src/data/menu.ts. Labels always use the exact
 * menu wording. Structural parts that every product of that kind has
 * (a pizza base, a burger bun, a fries carton) are shown with a neutral
 * label when the menu does not name them — no extra ingredients are invented.
 */

import { MenuItem } from "../data/menu";

export type ShowcaseKind = "pizza" | "burger" | "fries";

/** Visual layer types the builders know how to render. */
export type LayerVisual =
  // pizza
  | "crust-classic"
  | "crust-crown"
  | "crust-kabab"
  | "sauce-tomato"
  | "sauce-pesto"
  | "sauce-chipotle"
  | "cheese-mozzarella"
  | "cheese-cheddar"
  | "cheese-gouda"
  | "cheese-parmesan"
  | "chicken-tikka"
  | "chicken-smoked"
  | "chicken-fiery"
  | "chicken-fajita"
  | "chicken-tandoori"
  | "chicken-spiced"
  | "onion-red"
  | "onion-caramelized"
  | "capsicum-green"
  | "peppers-tricolor"
  | "peppers-roasted"
  | "olives-black"
  | "olives-kalamata"
  | "mushroom-button"
  | "mushroom-portobello"
  | "jalapeno"
  | "green-chilli"
  | "corn"
  | "tomato-fresh"
  | "garlic"
  | "relish-tomato-onion"
  | "seasoning-paprika"
  | "seasoning-herbs"
  | "glaze-garlic-butter"
  // burger
  | "bun-bottom"
  | "bun-top"
  | "bun-top-sesame"
  | "bun-top-brioche"
  | "patty-beef"
  | "patty-chicken"
  | "fillet-crispy"
  | "fillet-lava"
  | "fillet-grilled"
  | "cheese-slice"
  | "lettuce"
  | "tomato-slices"
  | "pickles"
  | "onion-diced"
  | "sauce-mayo"
  | "sauce-chipotle-mayo"
  | "sauce-bbq"
  | "sauce-relish"
  | "sauce-glaze"
  // fries
  | "carton"
  | "tray"
  | "fries-standing"
  | "fries-bed"
  | "fries-salt"
  | "marinara-drizzle"
  | "cheese-blanket"
  | "pepperoni"
  | "tender-bites"
  | "cheese-sauce"
  | "chipotle-drizzle"
  | "oregano";

export interface SceneLayer {
  key: string;
  visual: LayerVisual;
  /** Exact menu ingredient text, or a neutral structural label. */
  label: string;
  /** True when the label is the restaurant's own menu wording. */
  fromMenu: boolean;
  /** Optional repeat count (e.g. two patties). */
  count?: number;
}

export interface SceneRecipe {
  productId: string;
  kind: ShowcaseKind;
  /** Bottom → top. */
  layers: SceneLayer[];
  /** Menu ingredients that have no dedicated 3D layer (listed, never hidden). */
  unrendered: string[];
}

type Rule = { test: RegExp; visual: LayerVisual | ((ing: string) => LayerVisual) };

const has = (s: string, re: RegExp) => re.test(s.toLowerCase());

/* ------------------------------------------------------------------ */
/*  PIZZA                                                              */
/* ------------------------------------------------------------------ */

const PIZZA_RULES: Rule[] = [
  { test: /crown crust/, visual: "crust-crown" },
  { test: /kabab crust/, visual: "crust-kabab" },
  { test: /pesto/, visual: "sauce-pesto" },
  { test: /chipotle/, visual: "sauce-chipotle" },
  { test: /(pizza sauce|marinara|secret sauce|formula sauce|herb.*sauce)/, visual: "sauce-tomato" },
  { test: /garlic butter/, visual: "glaze-garlic-butter" },
  { test: /(cheddar-mozzarella|mozzarella & cheddar|molten)/, visual: "cheese-mozzarella" },
  { test: /(mozzarella|fior di latte)/, visual: "cheese-mozzarella" },
  { test: /cheddar/, visual: "cheese-cheddar" },
  { test: /gouda/, visual: "cheese-gouda" },
  { test: /parmigiano|parmesan/, visual: "cheese-parmesan" },
  { test: /tandoori/, visual: "chicken-tandoori" },
  { test: /fajita chicken/, visual: "chicken-fajita" },
  { test: /fiery.*chicken/, visual: "chicken-fiery" },
  { test: /smoked chicken/, visual: "chicken-smoked" },
  { test: /(tikka)/, visual: "chicken-tikka" },
  { test: /spiced chicken/, visual: "chicken-spiced" },
  { test: /caramelized.*onion/, visual: "onion-caramelized" },
  { test: /tomato onion relish/, visual: "relish-tomato-onion" },
  { test: /onion/, visual: "onion-red" },
  { test: /tricolor/, visual: "peppers-tricolor" },
  { test: /roasted bell/, visual: "peppers-roasted" },
  { test: /(capsicum|bell pepper)/, visual: "capsicum-green" },
  { test: /kalamata/, visual: "olives-kalamata" },
  { test: /olive/, visual: "olives-black" },
  { test: /portobello/, visual: "mushroom-portobello" },
  { test: /mushroom/, visual: "mushroom-button" },
  { test: /jalapeno/, visual: "jalapeno" },
  { test: /green chill/, visual: "green-chilli" },
  { test: /corn/, visual: "corn" },
  { test: /tomato/, visual: "tomato-fresh" },
  { test: /garlic/, visual: "garlic" },
  { test: /paprika/, visual: "seasoning-paprika" },
  { test: /(oregano|seasoning|herb)/, visual: "seasoning-herbs" }
];

const PIZZA_ORDER: Record<string, number> = {
  crust: 0,
  sauce: 1,
  cheese: 2,
  chicken: 3,
  onion: 4,
  relish: 4,
  capsicum: 5,
  peppers: 5,
  mushroom: 5,
  corn: 6,
  tomato: 6,
  olives: 7,
  jalapeno: 7,
  green: 7,
  garlic: 7,
  seasoning: 8,
  glaze: 9
};

function orderOf(visual: LayerVisual): number {
  const head = visual.split("-")[0];
  return PIZZA_ORDER[head] ?? 6;
}

function matchRule(rules: Rule[], ing: string): LayerVisual | null {
  for (const r of rules) {
    if (has(ing, r.test)) return typeof r.visual === "function" ? r.visual(ing) : r.visual;
  }
  return null;
}

export function buildPizzaRecipe(item: MenuItem): SceneRecipe {
  const layers: SceneLayer[] = [];
  const unrendered: string[] = [];
  const used = new Set<LayerVisual>();

  item.ingredients.forEach((ing, i) => {
    const v = matchRule(PIZZA_RULES, ing);
    if (!v || used.has(v)) {
      if (!v) unrendered.push(ing);
      return;
    }
    used.add(v);
    layers.push({ key: `${v}-${i}`, visual: v, label: ing, fromMenu: true });
  });

  // Structural base: every pizza has a crust even if the menu does not list one.
  if (![...used].some((v) => v.startsWith("crust-"))) {
    const fromName = /crust/i.test(item.name);
    layers.push({
      key: "crust-base",
      visual: "crust-classic",
      label: fromName ? item.name : "Hand-Tossed Base",
      fromMenu: fromName
    });
  }
  // A garlic-butter brush belongs to the crust, keep it right after the crust.
  layers.sort((a, b) => orderOf(a.visual) - orderOf(b.visual));
  return { productId: item.id, kind: "pizza", layers, unrendered };
}

/* ------------------------------------------------------------------ */
/*  BURGER                                                             */
/* ------------------------------------------------------------------ */

const BURGER_RULES: Rule[] = [
  { test: /sesame seed bun/, visual: "bun-top-sesame" },
  { test: /brioche/, visual: "bun-top-brioche" },
  { test: /two .*beef patt/, visual: "patty-beef" },
  { test: /beef patty/, visual: "patty-beef" },
  { test: /minced chicken patty/, visual: "patty-chicken" },
  { test: /jalapeno cheese stuffed fillet/, visual: "fillet-lava" },
  { test: /(crispy|battered).*chicken/, visual: "fillet-crispy" },
  { test: /grilled chicken/, visual: "fillet-grilled" },
  { test: /(cheddar|cheese slice)/, visual: "cheese-slice" },
  { test: /(lettuce|greens)/, visual: "lettuce" },
  { test: /tomato/, visual: "tomato-slices" },
  { test: /pickled jalapeno/, visual: "jalapeno" },
  { test: /pickle/, visual: "pickles" },
  { test: /caramelized onion/, visual: "onion-caramelized" },
  { test: /diced onion/, visual: "onion-diced" },
  { test: /chipotle mayo/, visual: "sauce-chipotle-mayo" },
  { test: /bbq/, visual: "sauce-bbq" },
  { test: /relish/, visual: "sauce-relish" },
  { test: /glaze/, visual: "sauce-glaze" },
  { test: /mayo/, visual: "sauce-mayo" }
];

// Bottom → top stacking order (index in this list).
const BURGER_STACK: LayerVisual[] = [
  "bun-bottom",
  "sauce-mayo",
  "sauce-chipotle-mayo",
  "sauce-bbq",
  "sauce-relish",
  "sauce-glaze",
  "patty-beef",
  "patty-chicken",
  "fillet-crispy",
  "fillet-lava",
  "fillet-grilled",
  "cheese-slice",
  "pickles",
  "onion-diced",
  "onion-caramelized",
  "jalapeno",
  "tomato-slices",
  "lettuce",
  "bun-top",
  "bun-top-sesame",
  "bun-top-brioche"
];

export function buildBurgerRecipe(item: MenuItem): SceneRecipe {
  const layers: SceneLayer[] = [];
  const unrendered: string[] = [];
  const used = new Set<LayerVisual>();
  let bunLabel: string | null = null;
  let bunVisual: LayerVisual = "bun-top";

  item.ingredients.forEach((ing, i) => {
    const v = matchRule(BURGER_RULES, ing);
    if (!v) {
      unrendered.push(ing);
      return;
    }
    if (v.startsWith("bun-top")) {
      bunLabel = ing;
      bunVisual = v;
      return;
    }
    if (used.has(v)) return;
    used.add(v);
    const twin = /(two|twin|double)/i.test(ing);
    layers.push({ key: `${v}-${i}`, visual: v, label: ing, fromMenu: true, count: twin ? 2 : 1 });
  });

  // A double-patty burger: when the patties are doubled, the cheese is doubled with them
  // only if the menu says so ("Twin ... Slices"), which is handled by `count` above.

  layers.push({ key: "bun-bottom", visual: "bun-bottom", label: bunLabel ? `${bunLabel} (base)` : "Bun (base)", fromMenu: !!bunLabel });
  layers.push({ key: "bun-top", visual: bunVisual, label: bunLabel ?? "Bun", fromMenu: !!bunLabel });

  layers.sort((a, b) => BURGER_STACK.indexOf(a.visual) - BURGER_STACK.indexOf(b.visual));
  return { productId: item.id, kind: "burger", layers, unrendered };
}

/* ------------------------------------------------------------------ */
/*  FRIES                                                              */
/* ------------------------------------------------------------------ */

const FRIES_RULES: Rule[] = [
  { test: /(fresh cut potatoes|crispy golden fries|crispy fries)/, visual: "fries-standing" },
  { test: /sea salt/, visual: "fries-salt" },
  { test: /(herbal fry seasoning)/, visual: "seasoning-herbs" },
  { test: /marinara/, visual: "marinara-drizzle" },
  { test: /mozzarella/, visual: "cheese-blanket" },
  { test: /pepperoni/, visual: "pepperoni" },
  { test: /olive/, visual: "olives-black" },
  { test: /oregano/, visual: "oregano" },
  { test: /tender/, visual: "tender-bites" },
  { test: /cheese sauce/, visual: "cheese-sauce" },
  { test: /jalapeno/, visual: "jalapeno" },
  { test: /chipotle/, visual: "chipotle-drizzle" }
];

const FRIES_STACK: LayerVisual[] = [
  "carton",
  "tray",
  "fries-standing",
  "fries-bed",
  "fries-salt",
  "seasoning-herbs",
  "marinara-drizzle",
  "tender-bites",
  "cheese-blanket",
  "cheese-sauce",
  "pepperoni",
  "olives-black",
  "jalapeno",
  "chipotle-drizzle",
  "oregano"
];

export function buildFriesRecipe(item: MenuItem): SceneRecipe {
  const layers: SceneLayer[] = [];
  const unrendered: string[] = [];
  const loaded = item.ingredients.length > 3 && !/simple/i.test(item.name);
  item.ingredients.forEach((ing, i) => {
    let v = matchRule(FRIES_RULES, ing);
    if (!v) {
      unrendered.push(ing);
      return;
    }
    if (v === "fries-standing" && loaded) v = "fries-bed";
    layers.push({ key: `${v}-${i}`, visual: v, label: ing, fromMenu: true });
  });
  layers.push({
    key: "container",
    visual: loaded ? "tray" : "carton",
    label: loaded ? "Serving Tray" : "Serving Carton",
    fromMenu: false
  });
  layers.sort((a, b) => FRIES_STACK.indexOf(a.visual) - FRIES_STACK.indexOf(b.visual));
  return { productId: item.id, kind: "fries", layers, unrendered };
}

export function buildRecipe(kind: ShowcaseKind, item: MenuItem): SceneRecipe {
  if (kind === "pizza") return buildPizzaRecipe(item);
  if (kind === "burger") return buildBurgerRecipe(item);
  return buildFriesRecipe(item);
}
