/**
 * Procedural, cached food textures & materials (no network assets needed).
 * Everything is generated on a 2D canvas once and reused across scenes.
 */

import * as THREE from "three";

let seed = 1337;
export function rand() {
  // Mulberry32 — deterministic so every visit renders the same dish.
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export function reseed(s: number) {
  seed = s;
}
export const rr = (a: number, b: number) => a + rand() * (b - a);

const texCache = new Map<string, THREE.Texture>();
const matCache = new Map<string, THREE.Material>();

function canvasTexture(
  key: string,
  size: number,
  draw: (g: CanvasRenderingContext2D, s: number) => void,
  opts: { srgb?: boolean; repeat?: number } = {}
): THREE.Texture {
  const cached = texCache.get(key);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const prev = seed;
  reseed(key.split("").reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) >>> 0);
  draw(g, size);
  reseed(prev);
  const t = new THREE.CanvasTexture(c);
  if (opts.srgb !== false) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (opts.repeat) t.repeat.set(opts.repeat, opts.repeat);
  t.anisotropy = 4;
  texCache.set(key, t);
  return t;
}

function speckle(g: CanvasRenderingContext2D, s: number, n: number, colors: string[], rMin: number, rMax: number, alpha = 1) {
  g.globalAlpha = alpha;
  for (let i = 0; i < n; i++) {
    g.fillStyle = colors[(rand() * colors.length) | 0];
    const x = rand() * s, y = rand() * s, a = rr(rMin, rMax), b = rr(rMin, rMax), r = rand() * Math.PI;
    for (const dx of [-s, 0, s]) {
      g.beginPath();
      g.ellipse(x + dx, y, a, b, r, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.globalAlpha = 1;
}

function blotches(g: CanvasRenderingContext2D, s: number, n: number, color: string, rMin: number, rMax: number) {
  for (let i = 0; i < n; i++) {
    const x = rand() * s, y = rand() * s, r = rr(rMin, rMax);
    for (const dx of [-s, 0, s]) {
      const gr = g.createRadialGradient(x + dx, y, 0, x + dx, y, r);
      gr.addColorStop(0, color);
      gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr;
      g.fillRect(x + dx - r, y - r, r * 2, r * 2);
    }
  }
}

/* ----------------------------- TEXTURES ----------------------------- */

export const tex = {
  dough: () =>
    canvasTexture("dough", 512, (g, s) => {
      g.fillStyle = "#B8722E";
      g.fillRect(0, 0, s, s);
      blotches(g, s, 60, "rgba(226,160,78,0.55)", 20, 70);
      blotches(g, s, 55, "rgba(110,52,14,0.5)", 10, 45);
      blotches(g, s, 18, "rgba(60,25,8,0.55)", 4, 16); // oven char blisters
      speckle(g, s, 900, ["rgba(90,45,15,0.35)", "rgba(250,215,150,0.35)"], 0.6, 2.2);
      speckle(g, s, 120, ["rgba(40,18,6,0.7)"], 1, 3);
    }),
  doughBump: () =>
    canvasTexture(
      "doughBump",
      256,
      (g, s) => {
        g.fillStyle = "#808080";
        g.fillRect(0, 0, s, s);
        blotches(g, s, 140, "rgba(255,255,255,0.35)", 4, 18);
        blotches(g, s, 120, "rgba(0,0,0,0.35)", 3, 12);
      },
      { srgb: false }
    ),
  sauce: (tone: "tomato" | "pesto" | "chipotle") =>
    canvasTexture(`sauce-${tone}`, 512, (g, s) => {
      const base = tone === "pesto" ? "#3E6B1E" : tone === "chipotle" ? "#A3361A" : "#A4200F";
      const hi = tone === "pesto" ? "rgba(140,180,60,0.5)" : "rgba(220,70,30,0.5)";
      const lo = tone === "pesto" ? "rgba(20,40,8,0.55)" : "rgba(70,8,4,0.5)";
      g.fillStyle = base;
      g.fillRect(0, 0, s, s);
      blotches(g, s, 90, hi, 10, 50);
      blotches(g, s, 70, lo, 8, 40);
      speckle(g, s, 500, tone === "pesto" ? ["#1F3A0C", "#9CC24E"] : ["#5A1206", "#E2541F", "#2F5A16"], 0.7, 2.4, 0.6);
    }),
  cheese: (tone: "mozzarella" | "cheddar" | "gouda" | "parmesan") =>
    canvasTexture(`cheese-${tone}`, 512, (g, s) => {
      const base = { mozzarella: "#F0C266", cheddar: "#E2952E", gouda: "#DDB24C", parmesan: "#EADBB0" }[tone];
      g.fillStyle = base;
      g.fillRect(0, 0, s, s);
      blotches(g, s, 70, "rgba(255,236,190,0.6)", 12, 46);
      if (tone !== "parmesan") {
        // golden-brown bake bubbles
        blotches(g, s, 48, "rgba(190,108,30,0.75)", 6, 28);
        blotches(g, s, 22, "rgba(110,52,14,0.7)", 3, 12);
      }
      speckle(g, s, 300, ["rgba(255,255,240,0.6)", "rgba(200,140,50,0.35)"], 0.8, 2.5);
    }),
  bun: (tone: "classic" | "brioche") =>
    canvasTexture(`bun-${tone}`, 512, (g, s) => {
      // vertical gradient: v=0 bottom (pale), v=1 top (deep golden)
      const gr = g.createLinearGradient(0, s, 0, 0);
      if (tone === "brioche") {
        gr.addColorStop(0, "#EBC687");
        gr.addColorStop(0.3, "#C87528");
        gr.addColorStop(0.65, "#9A4512");
        gr.addColorStop(1, "#7E340B");
      } else {
        gr.addColorStop(0, "#EED29A");
        gr.addColorStop(0.3, "#D98E3C");
        gr.addColorStop(0.65, "#B5651F");
        gr.addColorStop(1, "#9C5216");
      }
      g.fillStyle = gr;
      g.fillRect(0, 0, s, s);
      blotches(g, s, 50, "rgba(255,220,160,0.25)", 20, 60);
      blotches(g, s, 40, "rgba(110,50,10,0.25)", 15, 50);
      speckle(g, s, 400, ["rgba(90,40,10,0.25)", "rgba(255,230,180,0.3)"], 0.6, 1.8);
    }),
  crumb: () =>
    canvasTexture("crumb", 256, (g, s) => {
      g.fillStyle = "#EBCB91";
      g.fillRect(0, 0, s, s);
      speckle(g, s, 700, ["rgba(200,160,100,0.5)", "rgba(255,250,230,0.6)"], 0.8, 3);
    }),
  beef: () =>
    canvasTexture("beef", 512, (g, s) => {
      g.fillStyle = "#4A2615";
      g.fillRect(0, 0, s, s);
      blotches(g, s, 120, "rgba(110,55,28,0.6)", 6, 26);
      blotches(g, s, 90, "rgba(25,10,5,0.7)", 5, 22);
      speckle(g, s, 1400, ["#2A1209", "#7B4425", "#9A5A33", "#1A0904"], 0.8, 3.2, 0.8);
    }),
  chickenPatty: () =>
    canvasTexture("chickenPatty", 512, (g, s) => {
      g.fillStyle = "#B87638";
      g.fillRect(0, 0, s, s);
      blotches(g, s, 100, "rgba(230,170,90,0.6)", 6, 26);
      blotches(g, s, 60, "rgba(120,62,22,0.5)", 5, 20);
      speckle(g, s, 900, ["#8A5224", "#E9B76D"], 0.8, 2.6, 0.7);
    }),
  crispy: () =>
    canvasTexture("crispy", 512, (g, s) => {
      g.fillStyle = "#C9832E";
      g.fillRect(0, 0, s, s);
      blotches(g, s, 160, "rgba(240,186,90,0.65)", 4, 18);
      blotches(g, s, 140, "rgba(120,58,14,0.55)", 3, 14);
      speckle(g, s, 2200, ["#F7CF83", "#8C4A14", "#E4A24E", "#5C2C08"], 0.6, 2.4, 0.85);
    }),
  crispyBump: () =>
    canvasTexture(
      "crispyBump",
      256,
      (g, s) => {
        g.fillStyle = "#777";
        g.fillRect(0, 0, s, s);
        speckle(g, s, 1800, ["#fff", "#000", "#bbb", "#333"], 0.8, 3.4, 0.8);
      },
      { srgb: false }
    ),
  grilled: () =>
    canvasTexture("grilled", 512, (g, s) => {
      g.fillStyle = "#D29A5C";
      g.fillRect(0, 0, s, s);
      blotches(g, s, 80, "rgba(240,190,120,0.5)", 10, 30);
      g.strokeStyle = "rgba(45,20,8,0.85)";
      g.lineCap = "round";
      for (let i = -s; i < s * 2; i += 52) {
        g.lineWidth = rr(9, 14);
        g.beginPath();
        g.moveTo(i, 0);
        g.lineTo(i + s * 0.55, s);
        g.stroke();
      }
      speckle(g, s, 600, ["rgba(120,60,20,0.5)", "rgba(250,210,150,0.4)"], 0.6, 2);
    }),
  lettuce: () =>
    canvasTexture("lettuce", 512, (g, s) => {
      const gr = g.createRadialGradient(s / 2, s / 2, s * 0.1, s / 2, s / 2, s * 0.5);
      gr.addColorStop(0, "#DDEFA0");
      gr.addColorStop(0.6, "#8CC63F");
      gr.addColorStop(1, "#4E8E20");
      g.fillStyle = gr;
      g.fillRect(0, 0, s, s);
      g.strokeStyle = "rgba(235,250,190,0.28)";
      for (let i = 0; i < 70; i++) {
        const a = (i / 40) * Math.PI * 2;
        g.lineWidth = rr(1, 3);
        g.beginPath();
        g.moveTo(s / 2, s / 2);
        g.lineTo(s / 2 + Math.cos(a) * s * 0.5, s / 2 + Math.sin(a) * s * 0.5);
        g.stroke();
      }
    }),
  tomatoSlice: () =>
    canvasTexture("tomatoSlice", 256, (g, s) => {
      g.fillStyle = "#C3200F";
      g.fillRect(0, 0, s, s);
      const c = s / 2;
      g.fillStyle = "#E8452B";
      g.beginPath();
      g.arc(c, c, s * 0.42, 0, Math.PI * 2);
      g.fill();
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        g.fillStyle = "#F07A3C";
        g.beginPath();
        g.ellipse(c + Math.cos(a) * s * 0.22, c + Math.sin(a) * s * 0.22, s * 0.12, s * 0.07, a, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#F6D07A";
        for (let k = 0; k < 4; k++) {
          g.beginPath();
          g.ellipse(c + Math.cos(a) * s * (0.17 + k * 0.03), c + Math.sin(a) * s * (0.2 + (k % 2) * 0.03), 3, 2, a, 0, Math.PI * 2);
          g.fill();
        }
      }
      g.fillStyle = "#B51A0D";
      g.beginPath();
      g.arc(c, c, s * 0.08, 0, Math.PI * 2);
      g.fill();
    }),
  pickle: () =>
    canvasTexture("pickle", 256, (g, s) => {
      const c = s / 2;
      g.fillStyle = "#4F6B1C";
      g.fillRect(0, 0, s, s);
      g.fillStyle = "#9DB54A";
      g.beginPath();
      g.arc(c, c, s * 0.4, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#C8D88A";
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        g.beginPath();
        g.ellipse(c + Math.cos(a) * s * 0.2, c + Math.sin(a) * s * 0.2, 6, 4, a, 0, Math.PI * 2);
        g.fill();
      }
    }),
  pepperoni: () =>
    canvasTexture("pepperoni", 256, (g, s) => {
      g.fillStyle = "#9C2414";
      g.fillRect(0, 0, s, s);
      speckle(g, s, 140, ["#E8A08A", "#F0C2A8", "#5A1006"], 2, 6, 0.8);
      blotches(g, s, 10, "rgba(50,6,2,0.5)", 20, 60);
    }),
  potato: () =>
    canvasTexture("potato", 256, (g, s) => {
      g.fillStyle = "#DB9530";
      g.fillRect(0, 0, s, s);
      blotches(g, s, 40, "rgba(250,200,100,0.55)", 8, 30);
      blotches(g, s, 40, "rgba(160,84,18,0.55)", 6, 22);
      speckle(g, s, 300, ["rgba(140,80,20,0.4)"], 0.6, 1.8);
    }),
  carton: () =>
    canvasTexture("carton", 512, (g, s) => {
      g.fillStyle = "#5A0C1C";
      g.fillRect(0, 0, s, s);
      blotches(g, s, 40, "rgba(120,20,40,0.35)", 30, 90);
      // gold band + monogram stripes
      g.fillStyle = "#D4AF66";
      g.fillRect(0, s * 0.62, s, s * 0.035);
      g.fillRect(0, s * 0.70, s, s * 0.012);
      g.fillStyle = "rgba(212,175,102,0.9)";
      g.font = `600 ${s * 0.07}px Cinzel, Georgia, serif`;
      g.textAlign = "center";
      for (let i = 0; i < 4; i++) g.fillText("WAHAJ", s * (0.125 + i * 0.25), s * 0.83);
    }),
  tray: () =>
    canvasTexture("tray", 256, (g, s) => {
      g.fillStyle = "#1E1414";
      g.fillRect(0, 0, s, s);
      blotches(g, s, 30, "rgba(80,60,55,0.4)", 10, 40);
    }),
  contactShadow: () =>
    canvasTexture("contactShadow", 256, (g, s) => {
      const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      gr.addColorStop(0, "rgba(0,0,0,0.85)");
      gr.addColorStop(0.45, "rgba(0,0,0,0.45)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, s, s);
    })
};

/* ----------------------------- MATERIALS ---------------------------- */

type MatFactory = () => THREE.Material;

function mat(key: string, f: MatFactory) {
  let m = matCache.get(key);
  if (!m) {
    m = f();
    matCache.set(key, m);
  }
  return m;
}

const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p);
const phys = (p: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial(p);

export const M = {
  dough: () => mat("dough", () => std({ map: tex.dough(), bumpMap: tex.doughBump(), bumpScale: 1.2, roughness: 0.78 })),
  doughGlazed: () =>
    mat("doughGlazed", () => phys({ map: tex.dough(), bumpMap: tex.doughBump(), bumpScale: 1.1, roughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.45 })),
  sauce: (tone: "tomato" | "pesto" | "chipotle") =>
    mat(`sauce-${tone}`, () => phys({ map: tex.sauce(tone), roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.3 })),
  cheese: (tone: "mozzarella" | "cheddar" | "gouda" | "parmesan") =>
    mat(`cheese-${tone}`, () =>
      phys({ map: tex.cheese(tone), roughness: tone === "parmesan" ? 0.8 : 0.48, clearcoat: tone === "parmesan" ? 0 : 0.3, clearcoatRoughness: 0.4 })
    ),
  meat: (color: string, rough = 0.62) => mat(`meat-${color}`, () => phys({ color, roughness: rough, clearcoat: 0.25, clearcoatRoughness: 0.5, bumpMap: tex.doughBump(), bumpScale: 2 })),
  veg: (color: string, rough = 0.4) => mat(`veg-${color}`, () => phys({ color, roughness: rough, clearcoat: 0.6, clearcoatRoughness: 0.25 })),
  matte: (color: string, rough = 0.85) => mat(`matte-${color}`, () => std({ color, roughness: rough })),
  bun: (tone: "classic" | "brioche") =>
    mat(`bun-${tone}`, () => phys({ map: tex.bun(tone), roughness: tone === "brioche" ? 0.38 : 0.55, clearcoat: tone === "brioche" ? 0.55 : 0.2, clearcoatRoughness: 0.35, bumpMap: tex.doughBump(), bumpScale: 0.6 })),
  crumb: () => mat("crumb", () => std({ map: tex.crumb(), roughness: 0.9 })),
  beef: () => mat("beef", () => phys({ map: tex.beef(), bumpMap: tex.crispyBump(), bumpScale: 3, roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.45 })),
  chickenPatty: () => mat("chickenPatty", () => phys({ map: tex.chickenPatty(), bumpMap: tex.crispyBump(), bumpScale: 2, roughness: 0.6, clearcoat: 0.2 })),
  crispy: () => mat("crispy", () => phys({ map: tex.crispy(), bumpMap: tex.crispyBump(), bumpScale: 6, roughness: 0.62, clearcoat: 0.25, clearcoatRoughness: 0.5 })),
  grilled: () => mat("grilled", () => phys({ map: tex.grilled(), bumpMap: tex.doughBump(), bumpScale: 1.5, roughness: 0.5, clearcoat: 0.35 })),
  cheeseSlice: () =>
    mat("cheeseSlice", () => phys({ color: "#F2A33A", roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2, sheen: 0.5, sheenColor: new THREE.Color("#ffd27a"), side: THREE.DoubleSide })),
  lettuce: () => mat("lettuce", () => phys({ map: tex.lettuce(), roughness: 0.42, clearcoat: 0.5, side: THREE.DoubleSide, transmission: 0.0 })),
  tomatoSlice: () => mat("tomatoSlice", () => phys({ map: tex.tomatoSlice(), roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.15 })),
  pickle: () => mat("pickle", () => phys({ map: tex.pickle(), roughness: 0.3, clearcoat: 0.7 })),
  pepperoni: () => mat("pepperoni", () => phys({ map: tex.pepperoni(), roughness: 0.45, clearcoat: 0.55 })),
  potato: () => mat("potato", () => phys({ color: "#ffffff", roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.5, bumpMap: tex.doughBump(), bumpScale: 0.8 })),
  carton: () => mat("carton", () => std({ map: tex.carton(), roughness: 0.7, side: THREE.DoubleSide })),
  tray: () => mat("tray", () => std({ map: tex.tray(), roughness: 0.55, metalness: 0.2 })),
  sauceGloss: (color: string) => mat(`gloss-${color}`, () => phys({ color, roughness: 0.25, clearcoat: 0.9, clearcoatRoughness: 0.12 })),
  shadow: () => mat("shadow", () => new THREE.MeshBasicMaterial({ map: tex.contactShadow(), transparent: true, depthWrite: false, opacity: 0.9 }))
};
