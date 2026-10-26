/**
 * Wahaj Cafe — The Pizza Lab
 * ShowcaseScene: a reusable WebGL stage for scroll-driven exploded-view food.
 *
 * - Builds the product from its recipe (pizza / burger / fries)
 * - Interpolates layers between assembled and exploded positions
 * - Moves the camera along a choreographed path
 * - Exposes label anchor screen positions (DOM labels are positioned by React refs)
 * - Renders only while visible; fully disposable
 */

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { BuiltLayer, Quality, buildBurger, buildFries, buildPizza } from "./builders";
import { SceneRecipe, ShowcaseKind } from "./recipes";
import { M } from "./materials";
import { easeInOutCubic, smoothstep } from "./geometry";

export interface TimelineState {
  /** 0..1 explode amount (already eased). */
  explode: number;
  /** 0..1 label opacity. */
  labels: number;
  /** 0..1 intro reveal. */
  reveal: number;
  /** 0..1 final product reveal. */
  outro: number;
}

/** Scroll progress → choreography. Shared by the React layer for copy/panels. */
export function timeline(p: number): TimelineState {
  const reveal = smoothstep(0.0, 0.1, p);
  const apart = easeInOutCubic(smoothstep(0.12, 0.4, p));
  const together = easeInOutCubic(smoothstep(0.64, 0.84, p));
  const explode = apart * (1 - together);
  const labels = smoothstep(0.3, 0.42, p) * (1 - smoothstep(0.62, 0.7, p));
  const outro = smoothstep(0.84, 0.94, p);
  return { explode, labels, reveal, outro };
}

export interface LabelAnchor {
  x: number;
  y: number;
  side: 1 | -1;
  visible: boolean;
}

interface CamRig {
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

export class ShowcaseScene {
  readonly kind: ShowcaseKind;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private root = new THREE.Group(); // spins
  private product = new THREE.Group();
  private shadow: THREE.Mesh;
  private layers: BuiltLayer[] = [];
  private spacing: number[] = [];
  private quality: Quality;
  private container: HTMLElement;
  private raf = 0;
  private running = false;
  private progress = 0; // target
  private smooth = 0; // damped
  private swap = 1; // 0..1 product swap fade
  private pointer = new THREE.Vector2();
  private pointerSmooth = new THREE.Vector2();
  private clock = new THREE.Clock();
  private ro: ResizeObserver;
  private width = 1;
  private height = 1;
  private reducedMotion: boolean;
  private v = new THREE.Vector3();
  private onAnchors?: (a: LabelAnchor[], t: TimelineState) => void;
  readonly anchors: LabelAnchor[] = [];
  /** Hero mode: no scroll timeline, gentle idle motion. */
  private hero: boolean;
  /** Camera distance multiplier (thumbnails / hero framing). */
  framing = 1;

  constructor(container: HTMLElement, kind: ShowcaseKind, opts: { lowPower?: boolean; reducedMotion?: boolean; hero?: boolean } = {}) {
    this.container = container;
    this.kind = kind;
    this.hero = !!opts.hero;
    this.reducedMotion = !!opts.reducedMotion;
    const low = !!opts.lowPower;
    this.quality = { detail: low ? 0.55 : 1, shadows: !low };

    this.renderer = new THREE.WebGLRenderer({ antialias: !low, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, low ? 1.25 : 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.98;
    this.renderer.shadowMap.enabled = this.quality.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(this.renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.38;
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

    // Studio lighting: warm key, soft fill, antique-gold rim, cool kicker
    const key = new THREE.DirectionalLight(0xffe6c4, 3.4);
    key.position.set(-4.5, 9, 6);
    key.castShadow = this.quality.shadows;
    key.shadow.mapSize.set(1536, 1536);
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 7;
    key.shadow.camera.bottom = -3;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 30;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.025;
    key.shadow.radius = 5;
    this.scene.add(key);
    const fill = new THREE.HemisphereLight(0xffeedd, 0x2a0a10, 0.45);
    this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0xd4af66, 2.6);
    rim.position.set(5, 4, -6);
    this.scene.add(rim);
    const kicker = new THREE.PointLight(0xffd9a0, 18, 18, 2);
    kicker.position.set(3.5, 2.2, 4.5);
    this.scene.add(kicker);

    const sg = new THREE.PlaneGeometry(1, 1);
    sg.rotateX(-Math.PI / 2);
    this.shadow = new THREE.Mesh(sg, M.shadow());
    this.shadow.renderOrder = -1;
    this.scene.add(this.shadow);

    this.scene.add(this.root);
    this.root.add(this.product);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.resize();
  }

  setAnchorListener(fn: (a: LabelAnchor[], t: TimelineState) => void) {
    this.onAnchors = fn;
  }

  setProgress(p: number) {
    this.progress = Math.min(1, Math.max(0, p));
  }

  setPointer(x: number, y: number) {
    this.pointer.set(x, y);
  }

  /** Replace the product (selector change). */
  setRecipe(recipe: SceneRecipe) {
    this.disposeProduct();
    const build = this.kind === "pizza" ? buildPizza : this.kind === "burger" ? buildBurger : buildFries;
    this.layers = build(recipe, this.quality);
    this.layers.forEach((l) => {
      l.group.position.y = l.restY;
      l.group.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.castShadow = m.castShadow && this.quality.shadows;
          m.receiveShadow = this.quality.shadows;
        }
      });
      this.product.add(l.group);
    });
    this.computeSpacing();
    this.anchors.length = 0;
    this.layers.forEach((_, i) => this.anchors.push({ x: 0, y: 0, side: i % 2 === 0 ? 1 : -1, visible: false }));
    this.swap = 0;
    if (!this.running) this.renderOnce();
  }

  /** Exploded offsets: evenly opened along the vertical axis, ordered bottom → top. */
  private computeSpacing() {
    const n = this.layers.length;
    const gap = this.kind === "pizza" ? 0.62 : this.kind === "burger" ? 0.5 : 0.5;
    this.spacing = this.layers.map((l, i) => {
      if (this.kind === "fries") {
        // container stays the anchor, contents rise above it
        if (l.layer.visual === "carton" || l.layer.visual === "tray") return 0;
        if (l.layer.visual === "fries-standing") return 0; // custom per-fry animation
        return 0.9 + i * gap;
      }
      return i * gap + (this.kind === "burger" && l.layer.visual.startsWith("bun-top") ? 0.2 : 0);
    });
    void n;
  }

  private totalHeight(e: number) {
    let top = 0;
    this.layers.forEach((l, i) => {
      top = Math.max(top, l.restY + this.spacing[i] * e + l.height);
    });
    return top;
  }

  private cameraRig(t: TimelineState): CamRig {
    const e = t.explode;
    const h = this.totalHeight(e);
    const aspect = this.width / this.height;
    const narrow = aspect < 0.85;
    if (this.kind === "pizza") {
      const dist = (narrow ? 18 : 11.2) + e * (narrow ? 4.5 : 2.6) - t.outro * 0.8;
      const elev = 0.62 - e * 0.36; // radians above horizon
      const ty = 0.15 + e * h * 0.48;
      return { pos: new THREE.Vector3(0, ty + Math.sin(elev) * dist, Math.cos(elev) * dist), target: new THREE.Vector3(0, ty, 0) };
    }
    if (this.kind === "burger") {
      const dist = (narrow ? 14.5 : 9.4) + e * (narrow ? 7 : 5.6) - t.outro * 0.6;
      const elev = 0.32 - e * 0.18;
      const ty = 0.9 + e * (h * 0.5 - 0.9);
      return { pos: new THREE.Vector3(0, ty + Math.sin(elev) * dist, Math.cos(elev) * dist), target: new THREE.Vector3(0, ty, 0) };
    }
    const dist = (narrow ? 15 : 10.2) + e * (narrow ? 5 : 3.6) - t.outro * 0.6;
    const elev = 0.4 - e * 0.15;
    const ty = 1.0 + e * 1.5;
    return { pos: new THREE.Vector3(0, ty + Math.sin(elev) * dist, Math.cos(elev) * dist), target: new THREE.Vector3(0, ty, 0) };
  }

  private resize() {
    const r = this.container.getBoundingClientRect();
    this.width = Math.max(1, r.width);
    this.height = Math.max(1, r.height);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    // keep the product framed on portrait screens
    this.camera.fov = this.camera.aspect < 0.85 ? 40 : 32;
    this.camera.updateProjectionMatrix();
    if (!this.running) this.renderOnce();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.getDelta();
    const loop = () => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      this.frame(Math.min(0.05, this.clock.getDelta()));
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  renderOnce() {
    this.frame(0, true);
  }

  private frame(dt: number, snap = false) {
    const elapsed = this.clock.elapsedTime;
    // critically damped follow — smooth in both scroll directions, never lags far behind
    const k = snap || this.reducedMotion ? 1 : 1 - Math.exp(-dt * 7);
    this.smooth += (this.progress - this.smooth) * k;
    this.swap = Math.min(1, this.swap + (snap ? 1 : dt * 2.4));
    this.pointerSmooth.lerp(this.pointer, snap ? 1 : 1 - Math.exp(-dt * 4));

    const t: TimelineState = this.hero ? { explode: 0, labels: 0, reveal: 1, outro: 0 } : timeline(this.smooth);
    const n = this.layers.length;

    // Staggered layer motion: lower layers lead on the way out, upper layers lead on the way back.
    this.layers.forEach((l, i) => {
      const stagger = n > 1 ? i / (n - 1) : 0;
      const e = Math.min(1, Math.max(0, t.explode * 1.25 - stagger * 0.25));
      const ee = easeInOutCubic(e);
      // product swap: layers drop in from above with a short stagger
      const sw = easeInOutCubic(Math.min(1, Math.max(0, this.swap * 1.6 - stagger * 0.6)));
      l.group.position.y = l.restY + this.spacing[i] * ee + (1 - sw) * 1.2;
      l.group.scale.setScalar(0.92 + 0.08 * sw);
      l.group.rotation.y = this.kind === "fries" ? 0 : (i % 2 === 0 ? 1 : -1) * ee * 0.22;
      l.animate?.(t.explode, elapsed);
    });

    // reveal & spin
    const idle = this.reducedMotion ? 0 : elapsed * (this.hero ? 0.18 : 0.06);
    const scrollSpin = this.hero ? 0 : this.smooth * Math.PI * 0.9;
    this.root.rotation.y = -0.35 + idle + scrollSpin + this.pointerSmooth.x * 0.25;
    this.root.rotation.x = this.pointerSmooth.y * 0.05;
    const s = 0.86 + 0.14 * t.reveal;
    this.root.scale.setScalar(s);

    // contact shadow under the base layer, softened as layers lift
    const footprint = this.kind === "pizza" ? 5.6 : this.kind === "burger" ? 3.6 : 4.2;
    this.shadow.scale.set(footprint, 1, footprint * (this.kind === "fries" ? 0.7 : 1));
    this.shadow.position.y = -0.005;
    (this.shadow.material as THREE.MeshBasicMaterial).opacity = 0.85 - t.explode * 0.25;

    const rig = this.cameraRig(t);
    if (this.framing !== 1) rig.pos.sub(rig.target).multiplyScalar(this.framing).add(rig.target);
    if (!this.hero && this.camera.aspect < 0.85) {
      // portrait: lift the product above the order panel
      const lift = 1.1 + t.explode * 0.6;
      rig.target.y -= lift;
      rig.pos.y -= lift;
    }
    this.camera.position.copy(rig.pos);
    this.camera.position.x += this.pointerSmooth.x * 0.35;
    this.camera.lookAt(rig.target);

    this.renderer.render(this.scene, this.camera);
    this.updateAnchors(t);
  }

  private updateAnchors(t: TimelineState) {
    if (!this.onAnchors) return;
    const rootRotY = this.root.rotation.y;
    this.layers.forEach((l, i) => {
      const a = this.anchors[i];
      if (!a) return;
      // anchor is kept on the side facing the label column, independent of spin
      const side = a.side;
      this.v.copy(l.anchor);
      const r = Math.hypot(this.v.x, this.v.z);
      const ang = side === 1 ? 0 : Math.PI;
      this.v.set(Math.cos(ang) * r, this.v.y, Math.sin(ang) * r * 0.2);
      this.v.y += l.group.position.y;
      this.v.multiplyScalar(this.root.scale.x);
      void rootRotY;
      this.v.project(this.camera);
      a.x = (this.v.x * 0.5 + 0.5) * this.width;
      a.y = (-this.v.y * 0.5 + 0.5) * this.height;
      a.visible = this.v.z < 1;
    });
    this.onAnchors(this.anchors, t);
  }

  /** Render a still image (used for product thumbnails / posters). */
  snapshot(progress: number, type = "image/webp", q = 0.9) {
    this.setProgress(progress);
    this.smooth = progress;
    this.swap = 1;
    this.frame(0, true);
    return this.renderer.domElement.toDataURL(type, q);
  }

  private disposeProduct() {
    this.layers.forEach((l) => {
      this.product.remove(l.group);
      l.group.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose(); // materials & textures are shared/cached
      });
    });
    this.layers = [];
  }

  dispose() {
    this.stop();
    this.ro.disconnect();
    this.disposeProduct();
    this.scene.environment?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}

/** Lightweight capability probe: no WebGL → static fallbacks. */
export function canUseWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
