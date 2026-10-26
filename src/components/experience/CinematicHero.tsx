/**
 * Wahaj Cafe — The Pizza Lab
 * CinematicHero — the opening shot: the Crown Crust Pizza on a dark studio set,
 * slow camera drift, warm key light, pointer parallax. Loads WebGL lazily with a
 * real product image as the poster so the first paint is never empty.
 */

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, Clock, MapPin } from "lucide-react";
import { getMenuItemById } from "../../data/menu";
import { buildRecipe } from "../../three/recipes";
import { getProductImage } from "../../utils/imageManifest";
import { formatPKR } from "../../utils/whatsapp";
import type { ShowcaseScene } from "../../three/ShowcaseScene";
import { RestaurantConfig } from "../../config/restaurant";
import { useDeviceProfile } from "./useDeviceProfile";

interface Props {
  config: RestaurantConfig;
  onExploreMenuClick: () => void;
  onOrderNowClick: () => void;
  onDiscoverClick: () => void;
}

const HERO_ID = "crown-crust-pizza";

export const CinematicHero: React.FC<Props> = ({ config, onExploreMenuClick, onOrderNowClick, onDiscoverClick }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ShowcaseScene | null>(null);
  const [ready, setReady] = useState(false);
  const { reducedMotion, lowPower, webgl } = useDeviceProfile();
  const item = getMenuItemById(HERO_ID)!;
  const poster = getProductImage(HERO_ID);
  const from = item.sizes ? Math.min(...item.sizes.map((s) => s.price)) : item.price ?? 0;

  useEffect(() => {
    if (!webgl || !stageRef.current) return;
    let scene: ShowcaseScene | null = null;
    let dead = false;
    const onMove = (e: PointerEvent) => {
      scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    import("../../three/ShowcaseScene").then(({ ShowcaseScene }) => {
      if (dead || !stageRef.current) return;
      scene = new ShowcaseScene(stageRef.current, "pizza", { lowPower, reducedMotion, hero: true });
      sceneRef.current = scene;
      scene.setRecipe(buildRecipe("pizza", item));
      if (reducedMotion) scene.renderOnce();
      else scene.start();
      setReady(true);
      window.addEventListener("pointermove", onMove, { passive: true });
    });
    const io = new IntersectionObserver(([e]) => {
      if (!scene || reducedMotion) return;
      e.isIntersecting ? scene.start() : scene.stop();
    });
    if (stageRef.current) io.observe(stageRef.current);
    return () => {
      dead = true;
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene?.dispose();
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webgl, lowPower, reducedMotion]);

  const fade = (d: number) =>
    reducedMotion
      ? {}
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="relative min-h-[calc(100svh-7rem)] md:min-h-[calc(100svh-6.5rem)] w-full overflow-hidden select-none">
      <div className="absolute inset-0 hero-backdrop" aria-hidden="true" />
      <div className="absolute inset-0 grain pointer-events-none" aria-hidden="true" />

      {/* product stage — right side on desktop, lower half on mobile */}
      <div className="absolute inset-x-0 bottom-0 top-[38%] md:top-0 md:left-[38%]">
        {!ready && (
          <motion.img
            src={poster.url}
            alt={poster.alt}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(82vw,620px)] aspect-[4/3] object-cover rounded-[2.5rem] opacity-90 shadow-[0_50px_140px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 1.2 }}
          />
        )}
        <div ref={stageRef} className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />
      </div>

      {/* copy */}
      <div className="relative z-10 px-5 sm:px-10 lg:px-16 pt-16 sm:pt-24 max-w-2xl">
        <motion.div {...fade(0.1)} className="flex items-center gap-3 text-[11px] tracking-[0.34em] uppercase text-[#D4AF66]">
          <span className="h-px w-10 bg-[#D4AF66]/60" />
          {config.restaurantName} · {config.brandName}
        </motion.div>
        <motion.h1 {...fade(0.2)} className="mt-5 font-heading text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl text-[#FFF4DF]">
          Crafted for
          <br />
          <span className="gold-gradient-text italic-serif">cravings.</span>
        </motion.h1>
        <motion.p {...fade(0.35)} className="mt-5 text-sm sm:text-lg text-[#FFF4DF]/70 max-w-md leading-relaxed">
          Signature pizzas, stacked burgers and golden fries — engineered layer by layer in the Pizza Lab.
        </motion.p>
        <motion.div {...fade(0.5)} className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={onExploreMenuClick}
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF66] to-[#F3D99B] text-[#10090B] text-sm font-semibold tracking-wide shadow-[0_12px_40px_rgba(212,175,102,0.35)] hover:brightness-105 active:scale-[0.98] transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#10090B] focus-visible:ring-[#F3D99B]"
          >
            Explore the Menu
          </button>
          <button
            onClick={onOrderNowClick}
            className="px-6 py-3.5 rounded-full border border-[#D4AF66]/45 text-[#FFF4DF] text-sm font-medium tracking-wide hover:bg-[#500B19]/50 transition cursor-pointer backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D99B]"
          >
            Order on WhatsApp
          </button>
        </motion.div>
        <motion.div {...fade(0.65)} className="mt-8 hidden sm:flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#FFF4DF]/55">
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#D4AF66]" />{config.addressLandmark}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#D4AF66]" />{config.openingHours}</span>
        </motion.div>
      </div>

      {/* featured product tag */}
      <motion.button
        {...fade(0.9)}
        onClick={onDiscoverClick}
        className="hidden sm:block absolute z-10 right-5 sm:right-10 lg:right-16 bottom-24 sm:bottom-16 text-left rounded-2xl bg-[#10090B]/60 backdrop-blur-xl border border-[#D4AF66]/30 px-4 py-3 hover:border-[#D4AF66]/70 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D99B]"
      >
        <div className="text-[10px] tracking-[0.28em] uppercase text-[#D4AF66]">Signature</div>
        <div className="font-heading text-base text-[#FFF4DF]">{item.name}</div>
        <div className="text-xs text-[#FFF4DF]/60">from {formatPKR(from)} · see it layer by layer →</div>
      </motion.button>

      <button
        onClick={onDiscoverClick}
        aria-label="Scroll to the Pizza Lab"
        className="absolute z-10 left-1/2 -translate-x-1/2 bottom-6 text-[#F3D99B]/70 hover:text-[#F3D99B] flex flex-col items-center gap-1 text-[10px] tracking-[0.3em] uppercase cursor-pointer"
      >
        Scroll
        <ArrowDown className={`w-4 h-4 ${reducedMotion ? "" : "animate-bounce"}`} />
      </button>
    </div>
  );
};
