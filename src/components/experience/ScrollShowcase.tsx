/**
 * Wahaj Cafe — The Pizza Lab
 * ScrollShowcase — pinned, scroll-driven exploded-view product experience.
 *
 * Stage 1 reveal → 2 layers separate → 3 ingredient labels → 4 reassembly → 5 order panel.
 * Works in both scroll directions, lazy-loads WebGL near the viewport, pauses offscreen,
 * and falls back to a static presentation for reduced motion / no WebGL.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { Check, ChevronDown, Info, Plus } from "lucide-react";
import { MenuItem, MenuItemSize, getMenuItemById } from "../../data/menu";
import { useCart } from "../../context/CartContext";
import { formatPKR } from "../../utils/whatsapp";
import { getProductImage } from "../../utils/imageManifest";
import { buildRecipe, SceneRecipe, ShowcaseKind } from "../../three/recipes";
import type { LabelAnchor, ShowcaseScene, TimelineState } from "../../three/ShowcaseScene";
import { useDeviceProfile } from "./useDeviceProfile";

export interface ShowcaseCopy {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  stages: [string, string, string, string, string];
}

interface ScrollShowcaseProps {
  id: string;
  kind: ShowcaseKind;
  productIds: string[];
  initialId?: string;
  copy: ShowcaseCopy;
  onViewDetails: (p: MenuItem) => void;
}

const STAGE_EDGES = [0, 0.12, 0.3, 0.62, 0.84];

export const ScrollShowcase: React.FC<ScrollShowcaseProps> = ({ id, kind, productIds, initialId, copy, onViewDetails }) => {
  const products = useMemo(() => productIds.map((pid) => getMenuItemById(pid)).filter((p): p is MenuItem => !!p && p.available), [productIds]);
  const [productId, setProductId] = useState(initialId && products.some((p) => p.id === initialId) ? initialId : products[0]?.id);
  const product = products.find((p) => p.id === productId) ?? products[0];
  const recipe: SceneRecipe = useMemo(() => buildRecipe(kind, product), [kind, product]);

  const { reducedMotion, lowPower, webgl } = useDeviceProfile();
  const staticMode = reducedMotion || !webgl;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ShowcaseScene | null>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [near, setNear] = useState(false);

  /* ----------------------------- cart ----------------------------- */
  const { addToCart } = useCart();
  const [size, setSize] = useState<MenuItemSize | undefined>(product?.sizes?.[product.defaultSizeIndex ?? 0]);
  const [added, setAdded] = useState(false);
  useEffect(() => {
    setSize(product?.sizes?.[product.defaultSizeIndex ?? 0]);
    setAdded(false);
  }, [product]);
  const price = size ? size.price : product?.price ?? 0;
  const handleAdd = () => {
    if (!product) return;
    if (addToCart(product, size, 1)) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1600);
    }
  };

  /* ------------------------ lazy scene mount ------------------------ */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "900px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near || !webgl || !stageRef.current) return;
    let disposed = false;
    let scene: ShowcaseScene | null = null;
    import("../../three/ShowcaseScene").then(({ ShowcaseScene }) => {
      if (disposed || !stageRef.current) return;
      scene = new ShowcaseScene(stageRef.current, kind, { lowPower, reducedMotion });
      sceneRef.current = scene;
      scene.setAnchorListener(applyFrame);
      scene.setRecipe(recipe);
      if (staticMode) {
        scene.framing = 1.22;
        scene.setProgress(0.5);
        scene.renderOnce();
      } else {
        scene.setProgress(scrollYProgress.get());
      }
      setSceneReady(true);
    });
    return () => {
      disposed = true;
      scene?.dispose();
      sceneRef.current = null;
      setSceneReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [near, webgl, kind, lowPower, reducedMotion]);

  // product swap
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    s.setRecipe(recipe);
    if (staticMode) {
      s.setProgress(0.5);
      s.renderOnce();
    }
  }, [recipe, staticMode]);

  // render only while on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !sceneReady || staticMode) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? sceneRef.current?.start() : sceneRef.current?.stop()), { rootMargin: "100px 0px" });
    io.observe(el);
    return () => {
      io.disconnect();
      sceneRef.current?.stop();
    };
  }, [sceneReady, staticMode]);

  /* ---------------------------- scroll ---------------------------- */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (staticMode) return;
    sceneRef.current?.setProgress(v);
    if (railRef.current) railRef.current.style.transform = `scaleY(${v})`;
    if (!sceneRef.current) applyFrame([], fakeTimeline(v));
  });

  /* -------- per-frame DOM updates (no React re-render) -------- */
  const applyFrame = useCallback(
    (anchors: LabelAnchor[], t: TimelineState) => {
      const stage = stageRef.current;
      const W = stage?.clientWidth ?? 1;
      const narrow = W < 640;
      // labels
      const placed: { i: number; x: number; y: number; side: number }[] = [];
      anchors.forEach((a, i) => {
        const side = narrow ? 1 : a.side;
        const offset = narrow ? 18 : 64;
        placed.push({ i, x: a.x + side * offset, y: a.y, side });
      });
      // relax vertical overlaps per side
      [1, -1].forEach((side) => {
        const col = placed.filter((p) => p.side === side).sort((a, b) => a.y - b.y);
        for (let k = 1; k < col.length; k++) if (col[k].y - col[k - 1].y < 34) col[k].y = col[k - 1].y + 34;
      });
      const appear = staticMode ? 1 : t.labels;
      placed.forEach(({ i, x, y, side }) => {
        const el = labelRefs.current[i];
        const line = lineRefs.current[i];
        const dot = dotRefs.current[i];
        const a = anchors[i];
        if (!el || !a) return;
        const w = el.offsetWidth;
        let lx = side === 1 ? x : x - w;
        lx = Math.max(10, Math.min(W - w - 10, lx));
        const local = Math.min(1, Math.max(0, appear * 1.4 - (i / Math.max(1, anchors.length)) * 0.4));
        el.style.transform = `translate3d(${lx}px, ${y - 14}px, 0)`;
        el.style.opacity = String(local);
        if (line && dot) {
          const ex = side === 1 ? lx : lx + w;
          line.setAttribute("x1", String(a.x));
          line.setAttribute("y1", String(a.y));
          line.setAttribute("x2", String(ex));
          line.setAttribute("y2", String(y));
          line.style.opacity = String(local * 0.9);
          dot.setAttribute("cx", String(a.x));
          dot.setAttribute("cy", String(a.y));
          dot.style.opacity = String(local);
        }
      });
      // order panel & intro copy
      if (panelRef.current) {
        const o = staticMode ? 1 : 0.55 + 0.45 * t.outro;
        panelRef.current.style.setProperty("--outro", String(staticMode ? 1 : t.outro));
        panelRef.current.style.opacity = String(o);
      }
      if (introRef.current) {
        introRef.current.style.opacity = String(staticMode ? 1 : Math.max(0.0, 1 - t.explode * 1.6) * (1 - t.outro));
      }
      // caption
      if (captionRef.current && !staticMode) {
        const p = sceneRef.current ? progressFromTimeline(t) : 0;
        let s = 0;
        STAGE_EDGES.forEach((edge, k) => {
          if (p >= edge) s = k;
        });
        if (captionRef.current.dataset.stage !== String(s)) {
          captionRef.current.dataset.stage = String(s);
          captionRef.current.textContent = `0${s + 1} — ${copy.stages[s]}`;
        }
      }
    },
    [staticMode, copy.stages]
  );

  // progress needed for captions: keep a ref of latest scroll value
  const latest = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => (latest.current = v));
  const progressFromTimeline = (_t: TimelineState) => latest.current;

  useEffect(() => {
    // labels mount after the scene is ready — re-render once so they get positioned
    if (staticMode && sceneReady) requestAnimationFrame(() => sceneRef.current?.renderOnce());
  }, [staticMode, recipe, sceneReady]);

  const skipPast = () => {
    const el = sectionRef.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight * 0.15, behavior: reducedMotion ? "auto" : "smooth" });
  };

  if (!product) return null;
  const img = getProductImage(product.id);
  const heightVh = staticMode ? undefined : lowPower ? 420 : 520;

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-label={typeof copy.eyebrow === "string" ? copy.eyebrow : undefined}
      className="relative"
      style={{ height: heightVh ? `${heightVh}vh` : undefined }}
    >
      <div className={`${staticMode ? "relative min-h-[100svh] py-20" : "sticky top-0 h-[100svh]"} overflow-hidden`}>
        {/* cinematic backdrop */}
        <div className="absolute inset-0 showcase-backdrop" aria-hidden="true" />
        <div className="absolute inset-0 grain pointer-events-none" aria-hidden="true" />

        {/* WebGL stage */}
        <div ref={stageRef} className="absolute inset-0" />

        {/* poster while the 3D scene loads / when WebGL is unavailable */}
        {(!sceneReady || !webgl) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-[min(70vw,520px)] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)] ring-1 ring-[#D4AF66]/20">
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              {webgl && <div className="absolute inset-0 bg-[#10090B]/40 flex items-center justify-center text-[11px] tracking-[0.3em] uppercase text-[#F3D99B]">Preparing 3D view…</div>}
            </div>
          </div>
        )}

        {/* label leader lines */}
        {sceneReady && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            {recipe.layers.map((l, i) => (
              <g key={l.key}>
                <line ref={(el) => { lineRefs.current[i] = el; }} stroke="#D4AF66" strokeWidth="1" strokeDasharray="2 3" style={{ opacity: 0 }} />
                <circle ref={(el) => { dotRefs.current[i] = el; }} r="3.2" fill="#F3D99B" style={{ opacity: 0 }} />
              </g>
            ))}
          </svg>
        )}

        {/* ingredient labels — exact menu wording */}
        {sceneReady && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {recipe.layers.map((l, i) => (
              <div
                key={l.key}
                ref={(el) => { labelRefs.current[i] = el; }}
                className="absolute top-0 left-0 will-change-transform px-3 py-1.5 rounded-full bg-[#10090B]/75 backdrop-blur-md border border-[#D4AF66]/35 text-[11px] sm:text-xs tracking-wide text-[#FFF4DF] whitespace-nowrap shadow-lg"
                style={{ opacity: 0 }}
              >
                <span className="text-[#D4AF66] font-semibold mr-1.5">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </div>
            ))}
          </div>
        )}

        {/* section intro copy */}
        <div ref={introRef} className="absolute left-0 right-0 top-0 pt-24 sm:pt-28 px-5 sm:px-10 lg:px-16 pointer-events-none">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.32em] uppercase text-[#D4AF66]">
              <span className="h-px w-8 bg-[#D4AF66]/60" />
              {copy.eyebrow}
            </div>
            <h2 className="mt-3 font-heading text-3xl sm:text-5xl lg:text-6xl leading-[1.05] text-[#FFF4DF]">{copy.title}</h2>
            <p className="mt-4 text-sm sm:text-base text-[#FFF4DF]/70 max-w-md leading-relaxed">{copy.intro}</p>
          </div>
        </div>

        {/* stage caption + progress rail */}
        {!staticMode && (
          <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end gap-3 pointer-events-none">
            <div className="relative h-40 w-px bg-[#D4AF66]/15 overflow-hidden">
              <div ref={railRef} className="absolute inset-0 origin-top bg-gradient-to-b from-[#F3D99B] to-[#D4AF66]" style={{ transform: "scaleY(0)" }} />
            </div>
          </div>
        )}

        {/* selector + order panel */}
        <div className="absolute left-0 right-0 bottom-0 px-4 sm:px-10 lg:px-16 pb-5 sm:pb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div className="pointer-events-auto">
            {!staticMode && (
              <div ref={captionRef} className="mb-3 text-[11px] tracking-[0.3em] uppercase text-[#F3D99B]/80" aria-live="polite">
                01 — {copy.stages[0]}
              </div>
            )}
            <div role="radiogroup" aria-label="Choose a product to explore" className="flex gap-2 overflow-x-auto no-scrollbar max-w-[100vw] pb-1 -mx-1 px-1">
              {products.map((p) => {
                const active = p.id === product.id;
                return (
                  <button
                    key={p.id}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setProductId(p.id)}
                    className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D99B] ${
                      active
                        ? "bg-[#D4AF66] text-[#10090B] border-[#D4AF66] shadow-[0_8px_30px_rgba(212,175,102,0.3)]"
                        : "bg-[#10090B]/60 backdrop-blur-md text-[#FFF4DF]/80 border-[#D4AF66]/25 hover:border-[#D4AF66]/60 hover:text-[#FFF4DF]"
                    }`}
                  >
                    {p.name.replace(/ Pizza$/, "")}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            ref={panelRef}
            className="showcase-panel pointer-events-auto w-full lg:w-[400px] lg:mr-16 rounded-3xl bg-[#10090B]/80 backdrop-blur-xl border border-[#D4AF66]/30 p-4 sm:p-5 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
            style={{ opacity: staticMode ? 1 : 0.55 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] tracking-[0.28em] uppercase text-[#D4AF66]">{product.category}</div>
                <h3 className="font-heading text-lg sm:text-xl text-[#FFF4DF] leading-tight truncate">{product.name}</h3>
              </div>
              <div className="text-right shrink-0">
                <div className="font-heading text-lg sm:text-xl text-[#F3D99B]">{formatPKR(price)}</div>
                {size && <div className="text-[10px] text-[#FFF4DF]/55">{size.name} · {size.sizeLabel}</div>}
              </div>
            </div>
            <p className="showcase-desc hidden sm:block mt-2 text-xs text-[#FFF4DF]/65 leading-relaxed line-clamp-2">{product.description}</p>
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${product.sizes.length}, minmax(0,1fr))` }} role="radiogroup" aria-label="Size">
                {product.sizes.map((s) => (
                  <button
                    key={s.name}
                    role="radio"
                    aria-checked={size?.name === s.name}
                    onClick={() => setSize(s)}
                    className={`py-1.5 rounded-xl text-[11px] border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D99B] ${
                      size?.name === s.name ? "bg-[#F3D99B] text-[#10090B] border-[#F3D99B] font-semibold" : "border-white/10 text-[#FFF4DF]/75 hover:border-[#D4AF66]/50"
                    }`}
                  >
                    {s.name} <span className="opacity-70">{s.sizeLabel.replace(" inches", "″")}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleAdd}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D99B] ${
                  added ? "bg-emerald-600 text-white" : "bg-gradient-to-r from-[#D4AF66] to-[#F3D99B] text-[#10090B] hover:brightness-105 active:scale-[0.98]"
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {added ? "Added to cart" : `Add to Cart · ${formatPKR(price)}`}
              </button>
              <button
                onClick={() => onViewDetails(product)}
                aria-label={`View details for ${product.name}`}
                className="px-3.5 rounded-2xl border border-[#D4AF66]/35 text-[#F3D99B] hover:bg-[#500B19]/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D99B]"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            {recipe.unrendered.length > 0 && (
              <p className="mt-2 text-[10px] text-[#FFF4DF]/45">Also in this recipe: {recipe.unrendered.join(", ")}</p>
            )}
          </div>
        </div>

        {/* skip control so the pinned section never traps keyboard/scroll users */}
        {!staticMode && (
          <button
            onClick={skipPast}
            className="absolute top-24 right-4 sm:right-8 z-10 text-[10px] tracking-[0.25em] uppercase text-[#FFF4DF]/45 hover:text-[#F3D99B] flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D99B] rounded"
          >
            Skip <ChevronDown className="w-3 h-3" />
          </button>
        )}

        {/* static ingredient list for reduced motion / no-WebGL */}
        {staticMode && (
          <ul className="sr-only">
            {recipe.layers.map((l) => (
              <li key={l.key}>{l.label}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

function fakeTimeline(p: number): TimelineState {
  return { explode: 0, labels: 0, reveal: 1, outro: p > 0.84 ? 1 : 0 };
}
