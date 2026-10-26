/**
 * Procedural food builders. Each builder turns a SceneRecipe into a list of
 * independently movable layers (THREE.Group) with an assembled rest height,
 * a label anchor and optional custom explode behaviour.
 */

import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { M, rand, rr, reseed } from "./materials";
import { displace, drizzle, fbm, instanced, noise3, polarSlab, scatter } from "./geometry";
import { LayerVisual, SceneLayer, SceneRecipe } from "./recipes";

export interface BuiltLayer {
  layer: SceneLayer;
  group: THREE.Group;
  /** Assembled y position. */
  restY: number;
  /** Approx. vertical size, used for exploded spacing. */
  height: number;
  /** Local-space point the label leader line attaches to. */
  anchor: THREE.Vector3;
  /** Optional custom animation for this layer: e = explode amount 0..1, t = seconds. */
  animate?: (e: number, t: number) => void;
}

export interface Quality {
  detail: number; // 0.5 (low) .. 1 (high)
  shadows: boolean;
}

/* ------------------------------ helpers ------------------------------ */

function blob(r: number, detail: number, amp: number, freq: number, seed: number) {
  let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(r, detail);
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  g = mergeVertices(g);
  displace(g, amp, freq, seed);
  // planar uvs so textured materials still work
  const p = g.attributes.position as THREE.BufferAttribute;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    uv[i * 2] = p.getX(i) * 1.7 + 0.5;
    uv[i * 2 + 1] = p.getZ(i) * 1.7 + p.getY(i) * 0.6 + 0.5;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], cast = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = cast;
  m.receiveShadow = true;
  return m;
}

const count = (n: number, q: Quality) => Math.max(3, Math.round(n * (0.55 + 0.45 * q.detail)));

/* ================================================================== */
/*                               PIZZA                                 */
/* ================================================================== */

export const PIZZA_R = 2.2;
const BASE_TOP = 0.13;

function pizzaCrust(visual: LayerVisual, q: Quality): { group: THREE.Group; height: number; topY: number } {
  const group = new THREE.Group();
  const R = PIZZA_R;
  // dough base
  const base = new THREE.CylinderGeometry(R - 0.06, R - 0.12, BASE_TOP, 96, 1);
  base.translate(0, BASE_TOP / 2, 0);
  group.add(mesh(base, M.dough()));

  if (visual === "crust-crown") {
    // Crown crust: 12 stuffed dough peaks pointing outward like a crown.
    const peaks = 12;
    const petalGeo = (() => {
      let g: THREE.BufferGeometry = new THREE.SphereGeometry(0.36, 36, 24);
      g.deleteAttribute("normal");
      g = mergeVertices(g);
      const p = g.attributes.position as THREE.BufferAttribute;
      const v = new THREE.Vector3();
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i);
        // stretch outward (+x) to a soft point, squash vertically, keep tangential fullness
        const out = Math.max(0, v.x) / 0.36;
        v.x = v.x * 1.25 + Math.pow(out, 3) * 0.16;
        v.z = v.z * (1 - out * 0.38) * 1.12;
        v.y = v.y * 0.7 * (1 - out * 0.25) + (v.y > 0 ? 0.03 : 0);
        p.setXYZ(i, v.x, v.y, v.z);
      }
      displace(g, 0.025, 7, 3);
      return g;
    })();
    for (let i = 0; i < peaks; i++) {
      const a = (i / peaks) * Math.PI * 2;
      const m = mesh(petalGeo, M.doughGlazed());
      m.position.set(Math.cos(a) * (R - 0.32), BASE_TOP + 0.05, Math.sin(a) * (R - 0.32));
      m.rotation.y = -a;
      group.add(m);
    }
    // fold seams between peaks
    const seam = new THREE.TorusGeometry(R - 0.42, 0.1, 12, 120);
    seam.rotateX(Math.PI / 2);
    seam.translate(0, BASE_TOP + 0.02, 0);
    group.add(mesh(displace(seam, 0.02, 6, 4), M.dough()));
    return { group, height: 0.42, topY: BASE_TOP };
  }

  // rolled rim
  const rimR = visual === "crust-kabab" ? 0.21 : 0.17;
  const rim = new THREE.TorusGeometry(R - rimR, rimR, 24, 160);
  rim.rotateX(Math.PI / 2);
  rim.scale(1, 0.82, 1);
  rim.translate(0, BASE_TOP + 0.03, 0);
  group.add(mesh(displace(rim, 0.03, 4.2, 1), M.doughGlazed()));

  if (visual === "crust-kabab") {
    // seekh kababs tucked into the rim — visible through baked openings
    const kabab = new THREE.CapsuleGeometry(0.1, 0.55, 6, 12);
    kabab.rotateZ(Math.PI / 2);
    displace(kabab, 0.012, 14, 9);
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.2;
      const k = mesh(kabab, M.meat("#4A200E", 0.5));
      k.position.set(Math.cos(a) * (R - rimR), BASE_TOP + 0.2, Math.sin(a) * (R - rimR));
      k.rotation.y = -a + Math.PI / 2;
      group.add(k);
    }
    return { group, height: 0.38, topY: BASE_TOP };
  }
  return { group, height: 0.34, topY: BASE_TOP };
}

function pizzaTopping(visual: LayerVisual, q: Quality): THREE.Object3D | null {
  const Rin = PIZZA_R - 0.5;
  const g = new THREE.Group();
  const add = (o: THREE.Object3D) => g.add(o);
  const pts = (n: number, d: number) => scatter(count(n, q), Rin, d);
  const flat = (y = 0.02) => ({ y });

  switch (visual) {
    case "sauce-tomato":
    case "sauce-pesto":
    case "sauce-chipotle": {
      const tone = visual === "sauce-pesto" ? "pesto" : visual === "sauce-chipotle" ? "chipotle" : "tomato";
      const geo = polarSlab({
        radius: (th) => PIZZA_R - 0.36 + fbm(Math.cos(th) * 2, Math.sin(th) * 2, 1) * 0.08,
        thickness: 0.035,
        top: (f, th, x, z) => fbm(x * 2, 3, z * 2) * 0.01,
        rings: 10,
        segments: 128
      });
      add(mesh(geo, M.sauce(tone), false));
      return g;
    }
    case "cheese-mozzarella": {
      const geo = polarSlab({
        radius: (th) => PIZZA_R - 0.42 + fbm(Math.cos(th) * 3, Math.sin(th) * 3, 2) * 0.16,
        thickness: 0.05,
        top: (f, th, x, z) => Math.max(0, fbm(x * 2.4, 5, z * 2.4)) * 0.07 * (1 - f * 0.6),
        rings: Math.round(22 * q.detail) + 6,
        segments: 128
      });
      add(mesh(geo, M.cheese("mozzarella")));
      return g;
    }
    case "cheese-cheddar":
    case "cheese-gouda": {
      const tone = visual === "cheese-cheddar" ? "cheddar" : "gouda";
      const geo = blob(0.2, 3, 0.04, 6, 11);
      geo.scale(1.4, 0.22, 1.2);
      add(instanced(geo, M.cheese(tone), pts(20, 0.42).map((p) => ({ x: p.x, y: 0.02, z: p.z, ry: rand() * 6, s: rr(0.75, 1.2) }))));
      return g;
    }
    case "cheese-parmesan": {
      const geo = new THREE.BoxGeometry(0.18, 0.012, 0.07);
      add(instanced(geo, M.cheese("parmesan"), pts(40, 0.18).map((p) => ({ x: p.x, y: 0.03, z: p.z, ry: rand() * 6, rz: rr(-0.3, 0.3), s: rr(0.7, 1.3) }))));
      return g;
    }
    case "chicken-tikka":
    case "chicken-tandoori":
    case "chicken-smoked":
    case "chicken-fiery":
    case "chicken-spiced": {
      const col = { "chicken-tikka": "#8A3A18", "chicken-tandoori": "#8E2210", "chicken-smoked": "#5E3418", "chicken-fiery": "#9C2412", "chicken-spiced": "#8A4E1E" }[visual];
      const geo = blob(0.13, 3, 0.035, 9, 5);
      geo.scale(1.2, 0.68, 1);
      add(instanced(geo, M.meat(col), pts(26, 0.36).map((p) => ({ x: p.x, y: 0.06, z: p.z, rx: rr(-0.3, 0.3), ry: rand() * 6, s: rr(0.8, 1.15) }))));
      return g;
    }
    case "chicken-fajita": {
      const geo = blob(0.12, 3, 0.03, 9, 6);
      geo.scale(2.1, 0.5, 0.65);
      add(instanced(geo, M.meat("#B57B40"), pts(24, 0.38).map((p) => ({ x: p.x, y: 0.05, z: p.z, ry: rand() * 6, s: rr(0.8, 1.1) }))));
      return g;
    }
    case "onion-red":
    case "onion-caramelized": {
      const caramel = visual === "onion-caramelized";
      const geo = new THREE.TorusGeometry(caramel ? 0.12 : 0.17, caramel ? 0.018 : 0.022, 6, 28, Math.PI * rr(0.9, 1.3));
      geo.rotateX(Math.PI / 2);
      const mat = caramel ? M.veg("#8B4A1D", 0.45) : M.veg("#8E3B6E", 0.35);
      add(instanced(geo, mat, pts(caramel ? 34 : 22, 0.26).map((p) => ({ x: p.x, y: 0.05, z: p.z, ry: rand() * 6, rx: rr(-0.25, 0.25), s: rr(0.8, 1.2) }))));
      return g;
    }
    case "relish-tomato-onion": {
      const geo = new THREE.BoxGeometry(0.07, 0.05, 0.07);
      const items = pts(60, 0.14).map((p, i) => ({ x: p.x, y: 0.04, z: p.z, ry: rand() * 6, rx: rand(), color: i % 3 === 0 ? "#8E3B6E" : "#C9301C" }));
      add(instanced(geo, M.veg("#ffffff"), items));
      return g;
    }
    case "capsicum-green":
    case "peppers-tricolor":
    case "peppers-roasted": {
      const roasted = visual === "peppers-roasted";
      const geo = new THREE.TorusGeometry(0.2, roasted ? 0.05 : 0.032, 6, 22, Math.PI * 0.45);
      geo.rotateX(Math.PI / 2);
      geo.scale(1, roasted ? 0.6 : 1.6, 1);
      const palette = visual === "capsicum-green" ? ["#2F7D1F"] : roasted ? ["#B8261A", "#D99A1E", "#8E1B12"] : ["#2F7D1F", "#C3231A", "#E2B11C"];
      const items = pts(24, 0.3).map((p) => ({ x: p.x, y: 0.05, z: p.z, ry: rand() * 6, color: palette[(rand() * palette.length) | 0] }));
      add(instanced(geo, M.veg("#ffffff", roasted ? 0.55 : 0.3), items));
      return g;
    }
    case "olives-black":
    case "olives-kalamata": {
      const geo = new THREE.TorusGeometry(0.065, 0.034, 10, 22);
      geo.rotateX(Math.PI / 2);
      add(instanced(geo, M.veg(visual === "olives-black" ? "#17110F" : "#4B2233", 0.25), pts(22, 0.3).map((p) => ({ x: p.x, y: 0.06, z: p.z, s: rr(0.85, 1.15) }))));
      return g;
    }
    case "mushroom-button":
    case "mushroom-portobello": {
      const port = visual === "mushroom-portobello";
      const shape = new THREE.Shape();
      shape.absarc(0, 0, port ? 0.2 : 0.15, 0, Math.PI, false);
      shape.lineTo(0.05, 0);
      shape.lineTo(0.05, -0.13);
      shape.lineTo(-0.05, -0.13);
      shape.lineTo(-0.05, 0);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2, curveSegments: 16 });
      geo.rotateX(-Math.PI / 2);
      add(instanced(geo, M.veg(port ? "#6A4630" : "#D9C6A3", 0.55), pts(20, 0.34).map((p) => ({ x: p.x, y: 0.05, z: p.z, ry: rand() * 6, s: rr(0.85, 1.15) }))));
      return g;
    }
    case "jalapeno":
    case "green-chilli": {
      const chilli = visual === "green-chilli";
      const geo = new THREE.TorusGeometry(chilli ? 0.05 : 0.085, chilli ? 0.022 : 0.03, 8, 20);
      geo.rotateX(Math.PI / 2);
      add(instanced(geo, M.veg(chilli ? "#3E8F27" : "#4C8A2A", 0.3), pts(chilli ? 30 : 22, 0.24).map((p) => ({ x: p.x, y: 0.06, z: p.z, s: rr(0.85, 1.15) }))));
      return g;
    }
    case "corn": {
      const geo = new THREE.SphereGeometry(0.045, 10, 8);
      geo.scale(1, 0.75, 0.85);
      add(instanced(geo, M.veg("#F1C232", 0.35), pts(70, 0.1).map((p) => ({ x: p.x, y: 0.05, z: p.z, ry: rand() * 6 }))));
      return g;
    }
    case "tomato-fresh": {
      const geo = new THREE.CylinderGeometry(0.15, 0.15, 0.035, 24);
      add(instanced(geo, M.tomatoSlice(), pts(14, 0.4).map((p) => ({ x: p.x, y: 0.05, z: p.z, ry: rand() * 6 }))));
      return g;
    }
    case "garlic": {
      const geo = blob(0.06, 2, 0.01, 10, 3);
      geo.scale(1.3, 0.8, 0.9);
      add(instanced(geo, M.veg("#E9C98E", 0.35), pts(18, 0.35).map((p) => ({ x: p.x, y: 0.05, z: p.z, ry: rand() * 6 }))));
      return g;
    }
    case "seasoning-paprika":
    case "seasoning-herbs": {
      const geo = new THREE.BoxGeometry(0.03, 0.006, 0.02);
      const pal = visual === "seasoning-paprika" ? ["#B3200F", "#D2441A", "#7E140A"] : ["#3D5E1E", "#56772A", "#2C4614"];
      add(instanced(geo, M.matte("#ffffff", 0.9), scatter(count(320, q), PIZZA_R - 0.35, 0.03).map((p) => ({ x: p.x, y: 0.08, z: p.z, ry: rand() * 6, color: pal[(rand() * pal.length) | 0] })), false));
      return g;
    }
    case "glaze-garlic-butter": {
      const rim = new THREE.TorusGeometry(PIZZA_R - 0.17, 0.185, 16, 140);
      rim.rotateX(Math.PI / 2);
      rim.scale(1, 0.84, 1);
      const glaze = new THREE.MeshPhysicalMaterial({ color: "#F5CF6A", emissive: "#5a3a08", transparent: true, opacity: 0.55, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 });
      add(mesh(rim, glaze, false));
      const herb = new THREE.BoxGeometry(0.025, 0.005, 0.018);
      const items: any[] = [];
      for (let i = 0; i < count(160, q); i++) {
        const a = rand() * Math.PI * 2;
        const r = PIZZA_R - 0.17 + rr(-0.12, 0.12);
        items.push({ x: Math.cos(a) * r, y: 0.15, z: Math.sin(a) * r, ry: rand() * 6, color: rand() > 0.5 ? "#4A6B22" : "#F5E3B0" });
      }
      add(instanced(herb, M.matte("#ffffff"), items, false));
      return g;
    }
    default:
      return null;
  }
}

/* Heights of each pizza layer above the base top when assembled. */
const PIZZA_REST: Partial<Record<string, number>> = {
  sauce: 0.0,
  cheese: 0.035,
  glaze: -0.02
};

export function buildPizza(recipe: SceneRecipe, q: Quality): BuiltLayer[] {
  reseed(recipe.productId.length * 997 + 13);
  const out: BuiltLayer[] = [];
  let toppingY = BASE_TOP + 0.075;
  recipe.layers.forEach((layer) => {
    if (layer.visual.startsWith("crust-")) {
      const c = pizzaCrust(layer.visual, q);
      out.push({ layer, group: c.group, restY: 0, height: c.height, anchor: new THREE.Vector3(PIZZA_R * 0.96, 0.12, 0) });
      return;
    }
    const obj = pizzaTopping(layer.visual, q);
    if (!obj) return;
    const group = new THREE.Group();
    group.add(obj);
    const head = layer.visual.split("-")[0];
    let restY: number;
    if (head === "sauce") restY = BASE_TOP + 0.005;
    else if (layer.visual === "cheese-mozzarella") restY = BASE_TOP + 0.04;
    else if (head === "glaze") restY = 0;
    else {
      restY = toppingY;
      toppingY += 0.012; // tiny lift so stacked toppings never z-fight
    }
    void PIZZA_REST;
    const isWide = head === "sauce" || layer.visual === "cheese-mozzarella" || head === "glaze";
    out.push({ layer, group, restY, height: isWide ? 0.12 : 0.16, anchor: new THREE.Vector3((isWide ? PIZZA_R - 0.4 : PIZZA_R - 0.75), 0.05, 0) });
  });
  return out;
}

/* ================================================================== */
/*                               BURGER                                */
/* ================================================================== */

export const BUN_R = 1.36;

function latheBun(profile: [number, number][], segs: number) {
  const pts = profile.map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(pts, segs);
  return g;
}

function bunTop(visual: LayerVisual, q: Quality) {
  const group = new THREE.Group();
  const brioche = visual === "bun-top-brioche";
  const prof: [number, number][] = [
    [0.0, 0.0],
    [1.2, 0.0],
    [1.36, 0.06],
    [1.42, 0.2],
    [1.39, 0.36],
    [1.27, 0.56],
    [1.06, 0.74],
    [0.78, 0.87],
    [0.42, 0.95],
    [0.0, 0.98]
  ].map(([x, y]) => [x, y * (brioche ? 1.05 : 0.95)] as [number, number]);
  // reverse so the lathe faces outward
  const shell = latheBun(prof, Math.round(64 * q.detail) + 32);
  group.add(mesh(shell, M.bun(brioche ? "brioche" : "classic")));
  const cut = new THREE.CircleGeometry(1.2, 64);
  cut.rotateX(Math.PI / 2);
  group.add(mesh(cut, M.crumb(), false));

  if (visual === "bun-top-sesame") {
    const seed = new THREE.SphereGeometry(0.035, 8, 6);
    seed.scale(1.6, 0.55, 0.9);
    const items: any[] = [];
    const n = count(120, q);
    for (let i = 0; i < n; i++) {
      // sample the dome surface
      const th = rand() * Math.PI * 2;
      const f = Math.sqrt(rand()) * 0.86;
      const r = f * 1.3;
      // height from profile (approx dome)
      const h = 0.93 * Math.cos(Math.min(1, r / 1.42) * Math.PI * 0.5) ** 0.8 + 0.02;
      items.push({ x: Math.cos(th) * r, y: h * 0.95, z: Math.sin(th) * r, ry: rand() * 6, rx: Math.sin(th) * f * 0.8, rz: -Math.cos(th) * f * 0.8 });
    }
    group.add(instanced(seed, M.veg("#F6E7C1", 0.5), items));
  }
  return { group, height: 1.0 };
}

function bunBottom(q: Quality) {
  const group = new THREE.Group();
  const prof: [number, number][] = [
    [0.0, 0.0],
    [1.24, 0.0],
    [1.36, 0.06],
    [1.4, 0.18],
    [1.36, 0.3],
    [1.24, 0.34],
    [0.0, 0.34]
  ];
  const shell = latheBun(prof, Math.round(64 * q.detail) + 32);
  group.add(mesh(shell, M.bun("classic")));
  const cut = new THREE.CircleGeometry(1.25, 64);
  cut.rotateX(-Math.PI / 2);
  cut.translate(0, 0.341, 0);
  group.add(mesh(cut, M.crumb(), false));
  return { group, height: 0.34 };
}

function burgerPart(visual: LayerVisual, q: Quality, n: number): { obj: THREE.Object3D; height: number } | null {
  const g = new THREE.Group();
  switch (visual) {
    case "patty-beef": {
      let h = 0;
      for (let k = 0; k < n; k++) {
        const geo = polarSlab({
          radius: (th) => 1.42 + fbm(Math.cos(th) * 2.5, Math.sin(th) * 2.5, 4 + k) * 0.14,
          thickness: 0.3,
          top: (f, th, x, z) => fbm(x * 3, 2 + k, z * 3) * 0.035 - f ** 6 * 0.05,
          bottom: (f, th, x, z) => fbm(x * 3, 5 + k, z * 3) * 0.02 + f ** 6 * 0.04,
          rings: 12,
          segments: 96,
          uvScale: 2.4
        });
        const m = mesh(geo, M.beef());
        m.position.y = 0.15 + k * 0.4;
        g.add(m);
        h = 0.3 + k * 0.4;
      }
      return { obj: g, height: h };
    }
    case "patty-chicken": {
      const geo = polarSlab({
        radius: (th) => 1.32 + fbm(Math.cos(th) * 2.5, Math.sin(th) * 2.5, 8) * 0.07,
        thickness: 0.28,
        top: (f, th, x, z) => fbm(x * 4, 2, z * 4) * 0.02 - f ** 6 * 0.06,
        bottom: (f) => f ** 6 * 0.05,
        rings: 12,
        segments: 96,
        uvScale: 2.4
      });
      const m = mesh(geo, M.chickenPatty());
      m.position.y = 0.14;
      g.add(m);
      return { obj: g, height: 0.28 };
    }
    case "fillet-crispy":
    case "fillet-lava":
    case "fillet-grilled": {
      const grilled = visual === "fillet-grilled";
      const geo = polarSlab({
        radius: (th) => (grilled ? 1.34 : 1.5) + fbm(Math.cos(th) * 2.2, Math.sin(th) * 2.2, 7) * (grilled ? 0.12 : 0.3),
        thickness: grilled ? 0.22 : 0.3,
        top: (f, th, x, z) => (1 - f * f) * (grilled ? 0.08 : 0.12) + (grilled ? 0 : fbm(x * 6, 1, z * 6) * 0.04),
        bottom: (f) => -(1 - f * f) * 0.05,
        rings: 14,
        segments: 96,
        uvScale: 2.2
      });
      geo.scale(1.12, 1, 0.92);
      const m = mesh(geo, grilled ? M.grilled() : M.crispy());
      m.position.y = grilled ? 0.12 : 0.16;
      g.add(m);
      if (visual === "fillet-lava") {
        // molten jalapeno-cheese lava oozing from the fillet
        const lava = M.sauceGloss("#F2A12E");
        for (let i = 0; i < 5; i++) {
          const a = -0.9 + i * 0.42 + rr(-0.1, 0.1);
          const drip = new THREE.SphereGeometry(rr(0.09, 0.13), 16, 12);
          drip.scale(1, rr(1.4, 2.0), 0.8);
          const d = mesh(drip, lava);
          const r = 1.5;
          d.position.set(Math.cos(a) * r * 1.08, 0.12, Math.sin(a) * r * 0.86);
          g.add(d);
        }
        const pool = polarSlab({ radius: (th) => 1.45 + fbm(Math.cos(th) * 3, Math.sin(th) * 3, 2) * 0.2, thickness: 0.04, rings: 6, segments: 64 });
        const p = mesh(pool, lava, false);
        p.position.y = 0.33;
        p.scale.set(1.0, 1, 0.85);
        g.add(p);
      }
      return { obj: g, height: grilled ? 0.26 : 0.36 };
    }
    case "cheese-slice": {
      for (let k = 0; k < n; k++) {
        const geo = new THREE.PlaneGeometry(2.4, 2.4, 28, 28);
        geo.rotateX(-Math.PI / 2);
        const p = geo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), z = p.getZ(i);
          const d = Math.sqrt(x * x + z * z);
          const over = Math.max(0, d - 1.15);
          p.setY(i, -Math.pow(over, 1.5) * 1.1 + noise3(x * 2, 4 + k, z * 2) * 0.02);
          // pull corners slightly inward as they melt
          const pull = 1 - over * 0.12;
          p.setX(i, x * pull);
          p.setZ(i, z * pull);
        }
        geo.computeVertexNormals();
        const m = mesh(geo, M.cheeseSlice());
        m.rotation.y = 0.35 + k * 0.7;
        m.position.y = 0.02 + k * 0.4;
        g.add(m);
      }
      return { obj: g, height: 0.06 };
    }
    case "lettuce": {
      for (let k = 0; k < 2; k++) {
        const geo = polarSlab({
          radius: (th) => 1.55 + Math.sin(th * 9 + k) * 0.09 + fbm(Math.cos(th) * 3, Math.sin(th) * 3, k + 3) * 0.14,
          thickness: 0.03,
          top: (f, th) => Math.sin(th * 14 + k * 2) * 0.09 * f * f + f * f * -0.08,
          bottom: (f, th) => Math.sin(th * 14 + k * 2) * 0.09 * f * f + f * f * -0.08,
          rings: 10,
          segments: 160,
          uvScale: 3.2
        });
        const m = mesh(geo, M.lettuce());
        m.rotation.y = k * 0.8;
        m.position.y = 0.05 + k * 0.05;
        g.add(m);
      }
      return { obj: g, height: 0.16 };
    }
    case "tomato-slices": {
      const geo = new THREE.CylinderGeometry(0.62, 0.62, 0.12, 40);
      const mats = [M.veg("#C3200F", 0.3), M.tomatoSlice(), M.tomatoSlice()];
      [0, 1, 2].forEach((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.4;
        const m = mesh(geo, mats);
        m.position.set(Math.cos(a) * 0.62, 0.06 + i * 0.01, Math.sin(a) * 0.62);
        g.add(m);
      });
      return { obj: g, height: 0.15 };
    }
    case "pickles": {
      const geo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 28);
      const mats = [M.veg("#4F6B1C"), M.pickle(), M.pickle()];
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const m = mesh(geo, mats);
        m.position.set(Math.cos(a) * 0.72, 0.03 + (i % 2) * 0.012, Math.sin(a) * 0.72);
        m.rotation.set(rr(-0.08, 0.08), 0, rr(-0.08, 0.08));
        g.add(m);
      }
      return { obj: g, height: 0.08 };
    }
    case "onion-diced": {
      const geo = new THREE.BoxGeometry(0.08, 0.06, 0.08);
      const items = scatter(count(70, q), 1.15, 0.1).map((p, i) => ({ x: p.x, y: 0.03, z: p.z, ry: rand() * 6, rx: rand(), color: i % 4 === 0 ? "#B98AA6" : "#F2EAD8" }));
      g.add(instanced(geo, M.veg("#ffffff", 0.3), items));
      return { obj: g, height: 0.07 };
    }
    case "onion-caramelized": {
      const geo = new THREE.TorusGeometry(0.16, 0.025, 6, 24, Math.PI * 1.1);
      geo.rotateX(Math.PI / 2);
      const items = scatter(count(46, q), 1.15, 0.15).map((p) => ({ x: p.x, y: 0.04 + rand() * 0.04, z: p.z, ry: rand() * 6, rx: rr(-0.3, 0.3) }));
      g.add(instanced(geo, M.veg("#8B4A1D", 0.42), items));
      return { obj: g, height: 0.1 };
    }
    case "jalapeno": {
      const geo = new THREE.TorusGeometry(0.13, 0.045, 10, 22);
      geo.rotateX(Math.PI / 2);
      const items = scatter(count(12, q), 1.05, 0.3).map((p) => ({ x: p.x, y: 0.04, z: p.z, rx: rr(-0.15, 0.15) }));
      g.add(instanced(geo, M.veg("#4C8A2A", 0.28), items));
      return { obj: g, height: 0.08 };
    }
    case "sauce-mayo":
    case "sauce-chipotle-mayo":
    case "sauce-bbq":
    case "sauce-relish":
    case "sauce-glaze": {
      const col = { "sauce-mayo": "#F4E8C8", "sauce-chipotle-mayo": "#E2894A", "sauce-bbq": "#5B1F0E", "sauce-relish": "#B7A33C", "sauce-glaze": "#7A3510" }[visual];
      const mat = M.sauceGloss(col);
      const geo = polarSlab({ radius: (th) => 1.25 + fbm(Math.cos(th) * 3, Math.sin(th) * 3, 9) * 0.18, thickness: 0.05, top: (f, th, x, z) => fbm(x * 3, 2, z * 3) * 0.015, rings: 6, segments: 96 });
      g.add(mesh(geo, mat, false));
      for (let i = 0; i < 6; i++) {
        const a = rand() * Math.PI * 2;
        const drip = new THREE.SphereGeometry(rr(0.04, 0.06), 12, 10);
        drip.scale(1, 1.3, 1);
        const d = mesh(drip, mat);
        const r = 1.25 + fbm(Math.cos(a) * 3, Math.sin(a) * 3, 9) * 0.18;
        d.position.set(Math.cos(a) * r, -0.03, Math.sin(a) * r);
        g.add(d);
      }
      return { obj: g, height: 0.06 };
    }
    default:
      return null;
  }
}

export function buildBurger(recipe: SceneRecipe, q: Quality): BuiltLayer[] {
  reseed(recipe.productId.length * 131 + 7);
  const out: BuiltLayer[] = [];
  let y = 0;
  recipe.layers.forEach((layer) => {
    if (layer.visual === "bun-bottom") {
      const b = bunBottom(q);
      out.push({ layer, group: b.group, restY: y, height: b.height, anchor: new THREE.Vector3(BUN_R, 0.17, 0) });
      y += b.height;
      return;
    }
    if (layer.visual.startsWith("bun-top")) {
      const b = bunTop(layer.visual, q);
      out.push({ layer, group: b.group, restY: y - 0.02, height: b.height, anchor: new THREE.Vector3(BUN_R * 0.9, 0.45, 0) });
      y += b.height;
      return;
    }
    const part = burgerPart(layer.visual, q, layer.count ?? 1);
    if (!part) return;
    const group = new THREE.Group();
    group.add(part.obj);
    const sink = layer.visual.startsWith("sauce") || layer.visual === "cheese-slice" ? 0.02 : 0;
    out.push({ layer, group, restY: y - sink, height: Math.max(part.height, 0.08), anchor: new THREE.Vector3(BUN_R * 1.02, part.height * 0.5, 0) });
    y += part.height - sink * 0.5;
  });
  // twin cheese slices are interleaved between twin patties
  const patty = out.find((l) => l.layer.visual === "patty-beef" && (l.layer.count ?? 1) > 1);
  const cheese = out.find((l) => l.layer.visual === "cheese-slice" && (l.layer.count ?? 1) > 1);
  if (patty && cheese) {
    cheese.restY = patty.restY + 0.3;
    // second slice sits on the second patty
    const second = cheese.group.children[0].children[1];
    if (second) second.position.y = 0.42;
  }
  return out;
}

/* ================================================================== */
/*                                FRIES                                */
/* ================================================================== */

function fryGeometry() {
  const g = new THREE.BoxGeometry(0.16, 1, 0.16, 1, 6, 1);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    // slight bend and rounded tip
    p.setX(i, p.getX(i) * (1 - Math.abs(y) * 0.12) + Math.sin(y * 2) * 0.015);
  }
  g.computeVertexNormals();
  return g;
}

export function buildFries(recipe: SceneRecipe, q: Quality): BuiltLayer[] {
  reseed(recipe.productId.length * 71 + 3);
  const out: BuiltLayer[] = [];
  const loaded = recipe.layers.some((l) => l.visual === "tray");
  let surfaceY = 0;
  recipe.layers.forEach((layer) => {
    const group = new THREE.Group();
    const L = (restY: number, height: number, anchor: THREE.Vector3, animate?: BuiltLayer["animate"]) =>
      out.push({ layer, group, restY, height, anchor, animate });

    switch (layer.visual) {
      case "carton": {
        const body = new THREE.CylinderGeometry(1.25, 0.95, 2.0, 4, 1, true);
        body.rotateY(Math.PI / 4);
        body.scale(1.15, 1, 0.68);
        body.translate(0, 1.0, 0);
        group.add(mesh(body, M.carton()));
        const bottom = new THREE.PlaneGeometry(1.3, 0.92);
        bottom.rotateX(-Math.PI / 2);
        bottom.translate(0, 0.01, 0);
        group.add(mesh(bottom, M.matte("#3A0712")));
        L(0, 2.0, new THREE.Vector3(1.0, 0.9, 0));
        surfaceY = 0.2;
        break;
      }
      case "tray": {
        const prof: [number, number][] = [
          [0, 0],
          [1.7, 0],
          [1.95, 0.08],
          [2.05, 0.38],
          [2.0, 0.42]
        ];
        const geo = latheBun(prof, 64);
        geo.scale(1, 1, 0.66);
        group.add(mesh(geo, M.veg("#4A0A17", 0.6)));
        L(0, 0.42, new THREE.Vector3(2.0, 0.2, 0));
        surfaceY = 0.12;
        break;
      }
      case "fries-standing": {
        const geo = fryGeometry();
        const n = count(38, q);
        const fries: { x: number; z: number; h: number; tilt: number; rot: number; lift: number; spin: number }[] = [];
        for (let i = 0; i < n; i++) {
          fries.push({ x: rr(-0.68, 0.68), z: rr(-0.3, 0.3), h: rr(1.6, 2.35), tilt: rr(-0.18, 0.18), rot: rand() * 6, lift: rr(0.7, 1.9), spin: rr(-0.6, 0.6) });
        }
        const im = new THREE.InstancedMesh(geo, M.potato(), n);
        const fc = new THREE.Color();
        const golds = ["#E3A238", "#D8922C", "#EBB04A", "#C98426", "#E9A940"];
        for (let i = 0; i < n; i++) im.setColorAt(i, fc.set(golds[i % golds.length]));
        im.castShadow = true;
        im.receiveShadow = true;
        group.add(im);
        const m = new THREE.Matrix4(), qq = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
        const animate = (ex: number) => {
          fries.forEach((f, i) => {
            const k = Math.min(1, Math.max(0, ex * 1.25 - (i % 7) * 0.035));
            e.set(f.tilt + f.spin * k * 0.6, f.rot + f.spin * k, f.tilt * 0.6 + f.spin * k * 0.3);
            qq.setFromEuler(e);
            s.set(1, f.h, 1);
            p.set(f.x * (1 + k * 0.55), 0.25 + f.h / 2 + k * f.lift * 1.05, f.z * (1 + k * 0.9));
            m.compose(p, qq, s);
            im.setMatrixAt(i, m);
          });
          im.instanceMatrix.needsUpdate = true;
        };
        animate(0);
        // fries move inside their own layer; the carton stays as the anchor
        L(0, 0.0, new THREE.Vector3(0.6, 2.2, 0), animate);
        break;
      }
      case "fries-bed": {
        const geo = fryGeometry();
        const items: any[] = [];
        const n = count(80, q);
        for (let i = 0; i < n; i++) {
          const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * 1.55;
          const x = Math.cos(a) * r, z = Math.sin(a) * r * 0.6;
          items.push({ x, y: 0.08 + rand() * 0.28 * (1 - r / 1.8), z, rx: Math.PI / 2 + rr(-0.25, 0.25), rz: rand() * 6, sy: rr(0.8, 1.25), color: ["#E3A238", "#D8922C", "#EBB04A", "#C98426"][i % 4] });
        }
        group.add(instanced(geo, M.potato(), items));
        L(surfaceY, 0.4, new THREE.Vector3(1.6, 0.2, 0));
        surfaceY += 0.36;
        break;
      }
      case "fries-salt":
      case "seasoning-herbs":
      case "oregano": {
        const geo = new THREE.BoxGeometry(0.02, 0.014, 0.02);
        const pal = layer.visual === "fries-salt" ? ["#FFFFFF", "#F0EEE8"] : ["#3D5E1E", "#56772A", "#7A8A3A"];
        const items: any[] = [];
        const top = loaded ? surfaceY : 2.3;
        for (let i = 0; i < count(loaded ? 120 : 70, q); i++) {
          items.push({ x: rr(-1.1, 1.1) * (loaded ? 1.3 : 0.8), y: top + rand() * 0.3, z: rr(-0.5, 0.5) * (loaded ? 1.6 : 1), ry: rand() * 6, rx: rand() * 6, color: pal[(rand() * pal.length) | 0] });
        }
        group.add(instanced(geo, M.matte("#ffffff", 0.6), items, false));
        L(0, 0.15, new THREE.Vector3(1.0, top, 0));
        break;
      }
      case "marinara-drizzle":
      case "cheese-sauce":
      case "chipotle-drizzle": {
        const col = layer.visual === "marinara-drizzle" ? "#A3200F" : layer.visual === "cheese-sauce" ? "#F2A231" : "#C8502A";
        const mat = M.sauceGloss(col);
        const rad = layer.visual === "cheese-sauce" ? 0.07 : 0.04;
        for (let k = 0; k < 2; k++) {
          const geo = drizzle(14, 2.6, 1.3, rad, 0);
          const m = mesh(geo, mat);
          m.rotation.y = k * 1.2 + rr(-0.2, 0.2);
          m.scale.set(1, 1, 0.75);
          group.add(m);
        }
        L(surfaceY + 0.02, 0.12, new THREE.Vector3(1.3, 0, 0));
        surfaceY += 0.03;
        break;
      }
      case "cheese-blanket": {
        const geo = polarSlab({
          radius: (th) => 1.5 + fbm(Math.cos(th) * 3, Math.sin(th) * 3, 4) * 0.25,
          thickness: 0.05,
          top: (f, th, x, z) => Math.max(0, fbm(x * 2.5, 6, z * 2.5)) * 0.08 - f * f * 0.12,
          bottom: (f) => -f * f * 0.12,
          rings: 16,
          segments: 96
        });
        geo.scale(1, 1, 0.62);
        group.add(mesh(geo, M.cheese("mozzarella")));
        L(surfaceY, 0.12, new THREE.Vector3(1.4, 0, 0));
        surfaceY += 0.06;
        break;
      }
      case "pepperoni": {
        const geo = new THREE.CylinderGeometry(0.19, 0.19, 0.03, 28);
        const items = scatter(count(14, q), 1.4, 0.42, { sz: 0.6 }).map((p) => ({ x: p.x, y: 0.02, z: p.z, rx: rr(-0.1, 0.1), rz: rr(-0.1, 0.1) }));
        group.add(instanced(geo, [M.veg("#7E1A0E"), M.pepperoni(), M.pepperoni()] as any, items));
        L(surfaceY, 0.08, new THREE.Vector3(1.3, 0, 0));
        surfaceY += 0.02;
        break;
      }
      case "olives-black":
      case "jalapeno": {
        const ol = layer.visual === "olives-black";
        const geo = new THREE.TorusGeometry(ol ? 0.07 : 0.1, ol ? 0.035 : 0.035, 10, 22);
        geo.rotateX(Math.PI / 2);
        const items = scatter(count(16, q), 1.35, 0.3, { sz: 0.6 }).map((p) => ({ x: p.x, y: 0.04, z: p.z }));
        group.add(instanced(geo, M.veg(ol ? "#17110F" : "#4C8A2A", 0.28), items));
        L(surfaceY, 0.08, new THREE.Vector3(1.2, 0, 0));
        surfaceY += 0.02;
        break;
      }
      case "tender-bites": {
        const geo = blob(0.16, 3, 0.05, 8, 12);
        geo.scale(1.5, 0.75, 0.9);
        const items = scatter(count(16, q), 1.35, 0.36, { sz: 0.6 }).map((p) => ({ x: p.x, y: 0.1, z: p.z, ry: rand() * 6, rx: rr(-0.3, 0.3), s: rr(0.85, 1.15) }));
        group.add(instanced(geo, M.crispy(), items));
        L(surfaceY, 0.22, new THREE.Vector3(1.3, 0.1, 0));
        surfaceY += 0.12;
        break;
      }
      default:
        break;
    }
  });
  return out;
}
