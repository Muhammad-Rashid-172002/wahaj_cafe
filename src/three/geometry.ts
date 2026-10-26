/**
 * Geometry helpers for organic, food-like procedural meshes.
 */

import * as THREE from "three";
import { rand, rr } from "./materials";

/* ---------- smooth 3D value noise (deterministic) ---------- */
function hash(x: number, y: number, z: number) {
  let h = x * 374761393 + y * 668265263 + z * 2147483647;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
const fade = (t: number) => t * t * (3 - 2 * t);
export function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz);
  return (
    l(
      l(l(c(0, 0, 0), c(1, 0, 0), xf), l(c(0, 1, 0), c(1, 1, 0), xf), yf),
      l(l(c(0, 0, 1), c(1, 0, 1), xf), l(c(0, 1, 1), c(1, 1, 1), xf), yf),
      zf
    ) * 2 - 1
  );
}
export const fbm = (x: number, y: number, z: number, oct = 3) => {
  let a = 0, amp = 0.5, f = 1;
  for (let i = 0; i < oct; i++) {
    a += noise3(x * f, y * f, z * f) * amp;
    f *= 2.03;
    amp *= 0.5;
  }
  return a;
};

/**
 * Push vertices outward from the origin by fbm noise — turns primitives into food.
 * Direction is derived from the position (not the face normal) so split seams
 * on non-indexed geometry never crack open.
 * `yFlatten` keeps tops/bottoms of disc-like shapes flatter.
 */
export function displace(geo: THREE.BufferGeometry, amp: number, freq: number, seedOffset = 0, yWeight = 1) {
  const p = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const d = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    d.set(v.x, v.y * yWeight, v.z);
    if (d.lengthSq() < 1e-8) continue;
    d.normalize();
    const n = fbm(v.x * freq + seedOffset, v.y * freq + seedOffset * 0.3, v.z * freq + seedOffset * 0.7) * amp;
    v.addScaledVector(d, n);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  p.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/**
 * Polar "slab" — a disc-like layer with an organic outline, a sculpted top,
 * a flat-ish underside and a closed side wall. Used for sauce, cheese,
 * lettuce, melted blankets and fillets.
 */
export function polarSlab(opts: {
  radius: (theta: number) => number;
  thickness: number;
  top?: (f: number, theta: number, x: number, z: number) => number;
  bottom?: (f: number, theta: number, x: number, z: number) => number;
  rings?: number;
  segments?: number;
  uvScale?: number;
}): THREE.BufferGeometry {
  const rings = opts.rings ?? 18;
  const segs = opts.segments ?? 96;
  const t = opts.thickness;
  const uvS = opts.uvScale ?? 5;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const ring = (side: 1 | -1) => {
    const start = pos.length / 3;
    for (let i = 0; i <= rings; i++) {
      const f = i / rings;
      for (let s = 0; s <= segs; s++) {
        const th = (s / segs) * Math.PI * 2;
        const R = opts.radius(th) * f;
        const x = Math.cos(th) * R;
        const z = Math.sin(th) * R;
        const y = side === 1 ? t / 2 + (opts.top ? opts.top(f, th, x, z) : 0) : -t / 2 + (opts.bottom ? opts.bottom(f, th, x, z) : 0);
        pos.push(x, y, z);
        uv.push(x / uvS + 0.5, z / uvS + 0.5);
      }
    }
    for (let i = 0; i < rings; i++) {
      for (let s = 0; s < segs; s++) {
        const a = start + i * (segs + 1) + s;
        const b = a + segs + 1;
        if (side === 1) idx.push(a, b, a + 1, a + 1, b, b + 1);
        else idx.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
    return start;
  };
  const topStart = ring(1);
  const botStart = ring(-1);
  // side wall — own vertices with cylindrical uvs (no stretched streaks)
  const o = rings * (segs + 1);
  const sideStart = pos.length / 3;
  const circumference = Math.PI * 2 * opts.radius(0);
  for (let s = 0; s <= segs; s++) {
    for (const base of [topStart, botStart]) {
      const vi = (base + o + s) * 3;
      pos.push(pos[vi], pos[vi + 1], pos[vi + 2]);
      uv.push((s / segs) * (circumference / uvS) * 2, 0.5 + pos[vi + 1] / uvS * 2);
    }
  }
  for (let s = 0; s < segs; s++) {
    const a = sideStart + s * 2; // top
    const b = a + 1; // bottom
    const c = a + 2;
    const d = a + 3;
    idx.push(a, c, b, c, d, b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Scatter points in a disc / ellipse with a minimum spacing (dart throwing). */
export function scatter(count: number, rMax: number, minDist: number, opts: { rMin?: number; sx?: number; sz?: number; tries?: number } = {}) {
  const pts: { x: number; z: number }[] = [];
  const tries = opts.tries ?? count * 40;
  const sx = opts.sx ?? 1, sz = opts.sz ?? 1;
  for (let k = 0; k < tries && pts.length < count; k++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rr((opts.rMin ?? 0) ** 2 / rMax ** 2, 1)) * rMax;
    const x = Math.cos(a) * r * sx, z = Math.sin(a) * r * sz;
    if (pts.every((p) => (p.x - x) ** 2 + (p.z - z) ** 2 > minDist * minDist)) pts.push({ x, z });
  }
  return pts;
}

/** Build an InstancedMesh from a base geometry and a list of transforms. */
export function instanced(
  geo: THREE.BufferGeometry,
  material: THREE.Material,
  items: { x: number; y: number; z: number; rx?: number; ry?: number; rz?: number; s?: number; sx?: number; sy?: number; sz?: number; color?: THREE.ColorRepresentation }[],
  castShadow = true
) {
  const mesh = new THREE.InstancedMesh(geo, material, items.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const c = new THREE.Color();
  items.forEach((it, i) => {
    e.set(it.rx ?? 0, it.ry ?? 0, it.rz ?? 0);
    q.setFromEuler(e);
    const k = it.s ?? 1;
    s.set((it.sx ?? 1) * k, (it.sy ?? 1) * k, (it.sz ?? 1) * k);
    p.set(it.x, it.y, it.z);
    m.compose(p, q, s);
    mesh.setMatrixAt(i, m);
    if (it.color !== undefined) mesh.setColorAt(i, c.set(it.color));
  });
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

/** A wobbly 3D drizzle line (sauce zig-zags) lying on a surface. */
export function drizzle(points: number, spanX: number, spanZ: number, radius: number, y = 0) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < points; i++) {
    const f = i / (points - 1);
    const x = (f - 0.5) * spanX + rr(-0.05, 0.05);
    const z = Math.sin(f * Math.PI * (points / 2.2)) * spanZ * 0.5 + rr(-0.06, 0.06);
    pts.push(new THREE.Vector3(x, y + rr(0, 0.04), z));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve, points * 10, radius, 8, false);
}

export function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
